const {
  likeCurrentVideoSideAction,
  collectCurrentVideoSideAction
} = require("./douyinVideoSideActions");
const {
  extractDouyinCommentCidFromNode
} = require("./douyinCommentCid");
const {
  isDouyinSecondaryCommentNode
} = require("./douyinCommentReplyGuard");
const {
  commentBodyForKeywordMatch
} = require("./entityCommentFilters");
function createCommentAutomationController(options = {}) {
  const {
    ClipboardEvent: clipboardEvent,
    Infinity: infinity,
    InputEvent: inputEvent,
    KeyboardEvent: keyboardEvent,
    MouseEvent: mouseEvent,
    PLATFORM_SELECTORS: platformSelectors,
    PointerEvent: pointerEvent,
    Uint8Array: uint8Array,
    _migrateTouchCountsFromLegacy: migrateTouchCountsFromLegacy,
    _normalizeTouchLogEntries: normalizeTouchLogEntries,
    _syncTouchCountsFromLog: syncTouchCountsFromLog,
    allowEmptyCommentText: allowEmptyCommentText,
    appendCommentMentionsAfterAttachments: appendCommentMentionsAfterAttachments,
    appendRandomEmojiSuffix: appendRandomEmojiSuffix,
    applyEntryMetaToLead: applyEntryMetaToLead,
    applyFollowUpActions: applyFollowUpActions,
    applyRiskyEmojiReplaceForComment: applyRiskyEmojiReplaceForComment,
    atob: atob,
    awaitInteractionCooldown: awaitInteractionCooldown,
    awaitPostActionRest: awaitPostActionRest,
    briefEl: briefEl,
    describeDomControl: describeDomControl,
    briefPanel: briefPanel,
    buildAutomationAiPayload: buildAutomationAiPayload,
    buildBlacklistEntry: buildBlacklistEntry,
    buildLeadCommentFingerprint: buildLeadCommentFingerprint,
    buildLeadIdFromLead: buildLeadIdFromLead,
    buildMainCommentAbortResult: buildMainCommentAbortResult,
    buildNodeCommentFingerprint: buildNodeCommentFingerprint,
    buildTaskFinishedPayload: buildTaskFinishedPayload,
    burstPauseWithinOneSecond: burstPauseWithinOneSecond,
    classifyCommentFailureToastLocal: classifyCommentFailureToastLocal,
    cleanTitle: cleanTitle,
    clipTraceText: clipTraceText,
    closeAllModals: closeAllModals,
    collectDouyinCommentEmojiHints: collectDouyinCommentEmojiHints,
    commentDraftHasCoreTextLocal: commentDraftHasCoreTextLocal,
    commentNodeViewportBonus: commentNodeViewportBonus,
    composeCommentInputWithMentions: composeCommentInputWithMentions,
    describeCommentLikeState: describeCommentLikeState,
    describeMainCommentInputEnvironment: describeMainCommentInputEnvironment,
    describeTaskAbortReason: describeTaskAbortReason,
    dumpEmojiPanelTabCandidates: dumpEmojiPanelTabCandidates,
    emitLeadInteractionUpdate: emitLeadInteractionUpdate,
    ensureCommentPanelOpen: ensureCommentPanelOpen,
    ensureLeadgenScrapeApiHook: ensureLeadgenScrapeApiHook,
    evaluateLeadLocationFilter: evaluateLeadLocationFilter,
    extractDouyinCommentContent: extractDouyinCommentContent,
    extractSpecificVideoId: extractSpecificVideoId,
    extractUserIdFromUrl: extractUserIdFromUrl,
    extractUserKeyFromUrl: extractUserKeyFromUrl,
    extractVideoIdFromHref: extractVideoIdFromHref,
    findCommentScrollContainer: findCommentScrollContainer,
    focusCurrentAutomationViewForComment: focusCurrentAutomationViewForComment,
    focusWithoutScroll: focusWithoutScroll,
    formatTaskLocationFilterSummary: formatTaskLocationFilterSummary,
    getApplySearchFiltersModule: getApplySearchFiltersModule,
    getBoundSubviewInteractionId: getBoundSubviewInteractionId,
    getCommentPlaceholderText: getCommentPlaceholderText,
    getCommentTabPrefix: getCommentTabPrefix,
    getCommentV2String: getCommentV2String,
    getCommentV2List: getCommentV2List,
    getCommentV2Number: getCommentV2Number,
    getVideoEngagePack: getVideoEngagePack,
    getCommentsTotalCount: getCommentsTotalCount,
    getCurrentContentPauseProfile: getCurrentContentPauseProfile,
    getDouyinFeedScope: getDouyinFeedScope,
    resolveDouyinVideoDetailModal: resolveDouyinVideoDetailModal,
    getDouyinVideoAuthorApi: getDouyinVideoAuthorApi,
    getExtendedReadyRounds: getExtendedReadyRounds,
    getFeedVideoIdentity: getFeedVideoIdentity,
    getLeadAliasKeys: getLeadAliasKeys,
    getLeadPrimaryKey: getLeadPrimaryKey,
    getLocationFilterModule: getLocationFilterModule,
    getMyNickname: getMyNickname,
    getSearchApiReadyTracker: getSearchApiReadyTracker,
    getSearchFilterSessionModule: getSearchFilterSessionModule,
    getVideoIdFromPageUrl: getVideoIdFromPageUrl,
    getVideoStats: getVideoStats,
    handleGlobalAutomationPopupsAndSecurity: handleGlobalAutomationPopupsAndSecurity,
    hasCommentLikeTakenEffect: hasCommentLikeTakenEffect,
    hasCommentRuntimeReady: hasCommentRuntimeReady,
    hasLocalReplyTemplates: hasLocalReplyTemplates,
    hasVideoCommentTemplates: hasVideoCommentTemplates,
    hasVideoMainCommented: hasVideoMainCommented,
    incrementInteractionCount: incrementInteractionCount,
    insertTextIntoEditable: insertTextIntoEditable,
    installEntityFeedSwipeLock: installEntityFeedSwipeLock,
    ipcRenderer: ipcRenderer,
    isAiInvokeCancelled: isAiInvokeCancelled,
    isCommentAreaElement: isCommentAreaElement,
    isCommentDraftOnlyEmojiDriftLocal: isCommentDraftOnlyEmojiDriftLocal,
    isCommentFromVideoAuthor: isCommentFromVideoAuthor,
    isDouyinVideoShareUrl: isDouyinVideoShareUrl,
    isElementInViewport: isElementInViewport,
    isElementInViewportForAutomation: isElementInViewportForAutomation,
    isEmojiTriggerCandidate: isEmojiTriggerCandidate,
    isEntityLeadgenActive: isEntityLeadgenActive,
    isFatalAiAuthError: isFatalAiAuthError,
    isInteractionLimitReached: isInteractionLimitReached,
    isLeadInKnownPool: isLeadInKnownPool,
    isLeadInSession: isLeadInSession,
    queryKnownLeadKeys: queryKnownLeadKeys,
    isLinkOnlyScrapeTask: isLinkOnlyScrapeTask,
    isMainCommentPlaceholderCandidate: isMainCommentPlaceholderCandidate,
    isProfileCommentUiVisible: isProfileCommentUiVisible,
    isReplyBtnText: isReplyBtnText,
    isSameVideoTitleLoose: isSameVideoTitleLoose,
    isSubviewInteractionCancelled: isSubviewInteractionCancelled,
    isValidEmojiPickerPanel: isValidEmojiPickerPanel,
    isVideoLocalQuotaExhaustedReason: isVideoLocalQuotaExhaustedReason,
    isVisibleElement: isVisibleElement,
    isWithinTimeLimit: isWithinTimeLimit,
    localStorage: localStorage,
    lockFeedLeadVideoUrl: lockFeedLeadVideoUrl,
    lookupLeadgenScrapeAweme: lookupLeadgenScrapeAweme,
    markLeadInSession: markLeadInSession,
    matchExcludedCommentKeyword: matchExcludedCommentKeyword,
    matchesPlaceholderHint: matchesPlaceholderHint,
    mergeProfileInfoToLead: mergeProfileInfoToLead,
    normalizeDouyinAuthorProfileUrl: normalizeDouyinAuthorProfileUrl,
    normalizeDouyinCommentContent: normalizeDouyinCommentContent,
    normalizeUrl: normalizeUrl,
    normalizeUserUrl: normalizeUserUrl,
    noteVideoLocalQuotaExhaustedOnce: noteVideoLocalQuotaExhaustedOnce,
    openProfileVideoCommentPanel: openProfileVideoCommentPanel,
    parseDouyinCommentNode: parseDouyinCommentNode,
    pauseVisibleDouyinVideos: pauseVisibleDouyinVideos,
    persistSubviewTaskForResume: persistSubviewTaskForResume,
    pickLeadVideoUrl: pickLeadVideoUrl,
    pingInteractionActivity: pingInteractionActivity,
    prefetchKeywordReplyContents: prefetchKeywordReplyContents,
    prepareLeadsForAiAnalysis: prepareLeadsForAiAnalysis,
    pushToScrapeAiQueue: pushToScrapeAiQueue,
    radarSessionKey: radarSessionKey,
    randomDelay: randomDelay,
    readRadarSessionState: readRadarSessionState,
    recordLeadTouch: recordLeadTouch,
    rememberVideoMainComment: rememberVideoMainComment,
    removeEntityFeedSwipeLock: removeEntityFeedSwipeLock,
    reopenEmojiPanelIfNeeded: reopenEmojiPanelIfNeeded,
    replaceRiskyCommentEmojisLocal: replaceRiskyCommentEmojisLocal,
    reportCommentFlowTrace: reportCommentFlowTrace,
    reportCurrentAction: reportCurrentAction,
    reportEmojiDebug: reportEmojiDebug,
    reportMentionDebug: reportMentionDebug,
    reportProfileFirstTrace: reportProfileFirstTrace,
    reportTraceLog: reportTraceLog,
    resetScrapeAiQueueOnStop: resetScrapeAiQueueOnStop,
    resolveActiveMentionPercent: resolveActiveMentionPercent,
    resolveCommentLikeControlInNode: resolveCommentLikeControlInNode,
    resolveCommentMentionPosition: resolveCommentMentionPosition,
    resolveDouyinEmojiTabs: resolveDouyinEmojiTabs,
    resolveFollowUpFlags: resolveFollowUpFlags,
    resolveInteractionSkipReason: resolveInteractionSkipReason,
    resolveProfileFirstGenderFilter: resolveProfileFirstGenderFilter,
    resolveTaskGenderFilter: resolveTaskGenderFilter,
    resolveTaskLocationFilterRegions: resolveTaskLocationFilterRegions,
    rollMentionProbability: rollMentionProbability,
    safeScrollTargetIntoView: safeScrollTargetIntoView,
    sampleVisibleCommentTexts: sampleVisibleCommentTexts,
    scoreCommentContentFingerprints: scoreCommentContentFingerprints,
    scoreEmojiTabContainer: scoreEmojiTabContainer,
    scoreMainCommentPlaceholderCandidate: scoreMainCommentPlaceholderCandidate,
    sessionStorage: sessionStorage,
    shouldAbort: shouldAbort,
    shouldAbortProfileVideoDetailWait: shouldAbortProfileVideoDetailWait,
    shouldAppendCommentRandomSuffix: shouldAppendCommentRandomSuffix,
    shouldAppendVideoCommentRandomSuffix: shouldAppendVideoCommentRandomSuffix,
    shouldUseAiCommentAnalysis: shouldUseAiCommentAnalysis,
    shouldUseAiReplyGeneration: shouldUseAiReplyGeneration,
    shouldUseCommentKeywordFilter: shouldUseCommentKeywordFilter,
    shouldUseCommentMentions: shouldUseCommentMentions,
    shouldUseTextlessReplyPayload: shouldUseTextlessReplyPayload,
    simulateHumanClick: simulateHumanClick,
    simulateTrustedElementClick: simulateTrustedElementClick,
    simulateTrustedEnter: simulateTrustedEnter,
    sleep: sleep,
    sleepWithinDeadline: sleepWithinDeadline,
    snapshotCommentLikeControlState: snapshotCommentLikeControlState,
    snapshotComposerEmojiState: snapshotComposerEmojiState,
    startCurrentVideoPauseGuard: startCurrentVideoPauseGuard,
    taskLocationFilterEnabled: taskLocationFilterEnabled,
    toSpecificVideoDirectUrl: toSpecificVideoDirectUrl,
    toSpecificVideoJingxuanUrl: toSpecificVideoJingxuanUrl,
    waitForProfileVideoDetailScope: waitForProfileVideoDetailScope,
    waitLeadgenScrapeAwemeAuthor: waitLeadgenScrapeAwemeAuthor,
    markBatchProfileCommentDone: markBatchProfileCommentDone,
    wasBatchProfileCommentDone: wasBatchProfileCommentDone,
    withBackgroundAutomationLayout: withBackgroundAutomationLayout,
    state: state
  } = options;
  if (!state) {
    throw new TypeError("createCommentAutomationController requires a runtime state bridge");
  }
  function getV2StringOr(arg1, arg2) {
    const value = typeof getCommentV2String === "function" ? getCommentV2String(arg1) : "";
    return value || arg2;
  }
  function getV2ListOr(arg1, arg2) {
    const value = typeof getCommentV2List === "function" ? getCommentV2List(arg1) : [];
    if (value.length) {
      return value;
    } else {
      return arg2;
    }
  }
  function isCommentPlaceholderText(arg1) {
    if (typeof matchesPlaceholderHint === "function" && matchesPlaceholderHint(arg1)) {
      return true;
    }
    const result = getV2StringOr("placeholderRegex", "");
    let pattern = /说点什么|留下你的|留下.*评论|友善交流|发条评论|善语结善缘|写下.*评论/;
    if (result) {
      try {
        pattern = new RegExp(result);
      } catch (error) {}
    }
    return pattern.test(String(arg1 || ""));
  }
  function getV2Regex(arg1) {
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
  function listMissingV2Keys() {
    const list = ["emojiPanel", "emojiTrigger", "emojiStickerItems", "emojiItemCandidates", "emojiStickerClickableRoot", "emojiStickerInteractiveRoot", "emojiStickerSourcePattern", "emojiTextSourcePattern", "emojiTextTokenPattern", "emojiComposerPayload", "emojiTabContainerCandidates", "emojiTabTextCandidates", "emojiTabDebugCandidates", "emojiTabPositivePattern", "emojiTabRejectPattern", "emojiPanelRejectSelector"];
    const result = list.filter(arg1 => !getCommentV2String(arg1));
    for (const item of ["emojiStickerMinImageSide", "emojiStickerMinFillRatio", "emojiTabProbeTimeoutMs"]) {
      const value = typeof getCommentV2Number === "function" ? getCommentV2Number(item) : null;
      if (!(Number(value) > 0)) {
        result.push(item);
      }
    }
    return result;
  }
  function findDouyinEmojiPanel(arg1 = null) {
    const value = arg1 ? buildImageAttachScope(arg1, {
      replyMode: false
    }) : null;
    const result = findEmojiTriggerBtn(arg1, value);
    const value2 = typeof getCommentV2String === "function" ? getCommentV2String("emojiPanel") : "";
    if (value2) {
      let list = [];
      try {
        list = Array.from(document.querySelectorAll(value2)).filter(arg1 => isValidEmojiPickerPanel(arg1, result));
      } catch (error) {
        list = [];
      }
      if (list.length) {
        if (result) {
          const result2 = result.getBoundingClientRect();
          list.sort((arg1, arg2) => {
            const result = arg1.getBoundingClientRect();
            const result3 = arg2.getBoundingClientRect();
            const result4 = Math.min(Math.abs(result.bottom - result2.top), Math.abs(result.top - result2.bottom));
            const result5 = Math.min(Math.abs(result3.bottom - result2.top), Math.abs(result3.top - result2.bottom));
            return result4 - result5;
          });
        }
        return list[0];
      }
    }
    return null;
  }
  function getVideoTitle(arg1 = null) {
    try {
      const local = arg1 || document;
      const value = local.matches?.("[data-e2e=\"feed-active-video\"]") ? local.querySelector("[data-e2e=\"video-desc\"]") : local.querySelector?.("[data-e2e=\"feed-active-video\"] [data-e2e=\"video-desc\"]");
      if (value?.innerText?.trim()) {
        return cleanTitle(value.innerText);
      }
      const list = ["[data-e2e=\"video-desc\"]", "[data-e2e=\"note-desc\"]", "[data-e2e*=\"note-title\"]", "[data-e2e*=\"note-desc\"]", ".video-info-detail .title", ".video-info-container .title", "[class*=\"note-detail\"] [class*=\"title\"]", "[class*=\"NoteDetail\"] [class*=\"title\"]", "[class*=\"note-detail\"] [class*=\"desc\"]", "[class*=\"NoteDetail\"] [class*=\"desc\"]", "h1.title", ".account-card-container .title", ".desc"];
      let list2 = [];
      for (const item of list) {
        const local2 = local.querySelectorAll?.(item) || [];
        local2.forEach(arg1 => {
          if (arg1 && arg1.innerText && arg1.innerText.trim().length > 1) {
            list2.push(arg1);
          }
        });
      }
      if (list2.length === 0) {
        if (arg1) {
          return "未知视频";
        }
        const local = document.querySelector("meta[property=\"og:title\"]")?.content || document.querySelector("meta[property=\"og:description\"]")?.content || document.querySelector("meta[name=\"description\"]")?.content;
        if (local && cleanTitle(local) !== "未知视频") {
          return cleanTitle(local).slice(0, 100);
        }
        return cleanTitle(document.title);
      }
      let local2 = null;
      let local3 = infinity;
      const value2 = window.innerHeight / 2;
      const value3 = window.innerWidth / 2;
      list2.forEach(arg1 => {
        const result = arg1.getBoundingClientRect();
        if (result.height > 0 && result.width > 0) {
          const value = result.top + result.height / 2;
          const value4 = result.left + result.width / 2;
          const result2 = Math.sqrt(Math.pow(value - value2, 2) + Math.pow(value4 - value3, 2));
          if (result2 < local3) {
            local3 = result2;
            local2 = arg1;
          }
        }
      });
      if (local2) {
        const result = cleanTitle(local2.innerText).substring(0, 100);
        return result || cleanTitle(document.title);
      }
      if (arg1) {
        return "未知视频";
      }
      const local4 = document.querySelector("meta[property=\"og:title\"]")?.content || document.querySelector("meta[property=\"og:description\"]")?.content || document.querySelector("meta[name=\"description\"]")?.content;
      if (local4 && cleanTitle(local4) !== "未知视频") {
        return cleanTitle(local4).slice(0, 100);
      }
      return cleanTitle(document.title);
    } catch (error) {
      return "未知视频";
    }
  }
  function normalizeAuthorAccountName(arg1) {
    return getDouyinVideoAuthorApi().normalizeAuthorAccountName(arg1);
  }
  function parseExcludeAuthorAccounts(arg1) {
    return getDouyinVideoAuthorApi().parseExcludeAuthorAccounts(arg1);
  }
  function matchExcludedVideoAuthor(arg1, list = []) {
    return getDouyinVideoAuthorApi().matchExcludedVideoAuthor(arg1, list);
  }
  function getVideoAuthorNickname(arg1 = null, text = "") {
    return getDouyinVideoAuthorApi().getVideoAuthorNickname(arg1, text);
  }
  function getVideoAuthorProfileUrl(arg1 = null, text = "") {
    return getDouyinVideoAuthorApi().getVideoAuthorProfileUrl(arg1, text);
  }
  function getVideoAuthorInfo(arg1 = null, text = "") {
    return getDouyinVideoAuthorApi().getVideoAuthorInfo(arg1, text);
  }
  function captureCurrentVideoMetadata(arg1, text = "") {
    const local = arg1 || getDouyinFeedScope() || document;
    const result = getVideoTitle(local);
    const result2 = getVideoAuthorInfo(local, text);
    let local2 = result2.profileUrl || "";
    let local3 = result2.nickname || "";
    let local4 = result;
    const local5 = extractSpecificVideoId(text) || extractSpecificVideoId(window.location.href);
    const result3 = String(state.currentRunningSource || "");
    const result4 = isEntityLeadgenActive();
    const local6 = !!local5 && (!!isLinkOnlyScrapeTask(state.currentTask) || result3 === "search" || result3 === "recommend" || result3 === "follow" || !!result4);
    let flag = false;
    if (local6) {
      try {
        ensureLeadgenScrapeApiHook({
          force: true
        });
      } catch (error) {}
      const result = lookupLeadgenScrapeAweme(text || window.location.href);
      if (result && String(result.videoId) === String(local5)) {
        flag = !!result.authorUrl || !!result.authorNickname || !!result.title;
        if (result.authorUrl) {
          local2 = result.authorUrl;
        }
        if (result.authorNickname) {
          local3 = result.authorNickname;
        }
        if (result.title && (!local4 || local4 === "未知视频")) {
          local4 = result.title;
        }
      }
    }
    return {
      title: local4,
      authorNickname: local3,
      authorUrl: local2,
      stats: getVideoStats(local),
      scope: local,
      fromApi: flag
    };
  }
  async function waitAndCaptureCurrentVideoMetadata(arg1, text = "", arg3 = state.activeLoopId, options = {}) {
    const value = options.requireAuthor !== false;
    const value2 = options.requireAuthorUrl === true;
    const result = Math.max(800, Number(options.maxWaitMs) || 2800);
    const result2 = Date.now();
    pauseVisibleDouyinVideos(arg1 || document, "作者识别等待前锁定暂停");
    try {
      ensureLeadgenScrapeApiHook({
        force: true
      });
    } catch (error) {}
    const local = extractSpecificVideoId(text) || extractSpecificVideoId(window.location.href);
    if (local && value) {
      const value = value2 ? Math.min(Math.max(2200, result - 200), result) : Math.min(1600, result);
      const result2 = await waitLeadgenScrapeAwemeAuthor(text || local, value);
      if (result2?.authorUrl || !value2 && result2?.authorNickname) {
        pauseVisibleDouyinVideos(arg1 || document, "API 作者已就绪，锁定暂停");
        const result = captureCurrentVideoMetadata(arg1, text);
        if (result2.authorUrl) {
          result.authorUrl = result2.authorUrl;
        }
        if (result2.authorNickname) {
          result.authorNickname = result2.authorNickname;
        }
        if (result2.title && (!result.title || result.title === "未知视频")) {
          result.title = result2.title;
        }
        if (result.authorUrl || !value2 && result.authorNickname) {
          result.fromApi = true;
          return result;
        }
      }
    }
    let result3 = captureCurrentVideoMetadata(arg1, text);
    const local2 = result3.title || "";
    let num = 1;
    while (Date.now() - result2 < result) {
      const local = !!result3.title && result3.title !== "未知视频";
      const local3 = !!result3.authorUrl && !!result3.authorNickname;
      const local4 = !!result3.authorNickname || !!result3.authorUrl;
      const flag = !!normalizeDouyinAuthorProfileUrl(result3.authorUrl || "");
      const local5 = !local2 || local2 === "未知视频" || isSameVideoTitleLoose(local2, result3.title);
      const value3 = value2 ? flag : local3 || local4;
      if (local && local5 && (!value || value3)) {
        return result3;
      }
      if (shouldAbort(arg3)) {
        break;
      }
      if (num === 1) {
        reportCurrentAction("作者主页尚未就绪，短暂等待后重试识别...");
      }
      pauseVisibleDouyinVideos(arg1 || document);
      await sleep(350);
      const local6 = getDouyinFeedScope() || arg1;
      pauseVisibleDouyinVideos(local6 || arg1 || document);
      result3 = captureCurrentVideoMetadata(local6, text);
      if (local2 && result3.title && result3.title !== "未知视频" && !isSameVideoTitleLoose(local2, result3.title)) {
        console.warn("[Built-in-Debug] [作者对齐] 等待作者期间标题已切换，放弃本条作者补采以免错配下一条");
        return {
          ...result3,
          title: local2,
          authorNickname: "",
          authorUrl: ""
        };
      }
      num += 1;
    }
    return {
      ...result3,
      title: local2 || result3.title
    };
  }
  async function pauseSettleThenCaptureVideoMetadata(arg1, arg2, {
    isFeedPlayback = false,
    previousAuthor = "",
    previousVideoId = "",
    settleMs = 1000,
    maxWaitMs = 2200,
    requireAuthor = true,
    skipBurstPause = false
  } = {}) {
    const local = arg1 || getDouyinFeedScope() || document;
    pauseVisibleDouyinVideos(local, "进入视频：识别元数据前先暂停");
    if (isFeedPlayback) {
      try {
        lockFeedLeadVideoUrl(local);
      } catch (error) {}
    }
    if (!skipBurstPause) {
      await burstPauseWithinOneSecond(local, arg2, {
        budgetMs: Math.min(1000, Math.max(700, Number(settleMs) || 1000)),
        tickMs: 50,
        reason: "进入视频 1 秒内强制暂停"
      });
    } else {
      for (let num = 0; num < 4; num += 1) {
        if (shouldAbort(arg2)) {
          throw new Error("TASK_ABORTED");
        }
        pauseVisibleDouyinVideos(local);
        await sleep(50);
      }
    }
    let text = "";
    let text2 = "";
    if (isFeedPlayback) {
      const local2 = state.lockedFeedIdentity || getFeedVideoIdentity(local) || "";
      text = local2;
      text2 = pickLeadVideoUrl(state.lockedLeadVideoUrl || local2, local);
    } else {
      text = normalizeUrl(window.location.href);
      text2 = pickLeadVideoUrl(text, local);
    }
    const value = isDouyinVideoShareUrl(text2) ? text2 : text;
    const local2 = text2 || value || text;
    pauseVisibleDouyinVideos(local, "暂停已稳定，开始识别作者/标题");
    let result = await waitAndCaptureCurrentVideoMetadata(local, local2, arg2, {
      requireAuthor: requireAuthor,
      maxWaitMs: maxWaitMs
    });
    const local3 = extractSpecificVideoId(local2) || extractSpecificVideoId(text) || "";
    const result2 = normalizeAuthorAccountName(previousAuthor || "");
    const result3 = String(result.authorNickname || "").trim();
    const local4 = !!local3 && !!previousVideoId && String(local3) !== String(previousVideoId) && !!result3 && !!result2 && normalizeAuthorAccountName(result3) === result2;
    if (local4) {
      console.warn("[Built-in-Debug] [作者对齐] 暂停后作者仍像上一条「" + result3 + "」，再停再采");
      reportCurrentAction("作者疑似上一条残留，暂停后重新识别…");
      pauseVisibleDouyinVideos(local, "作者残留：再次暂停后重采");
      await sleep(600);
      pauseVisibleDouyinVideos(local);
      if (!isFeedPlayback) {
        text = normalizeUrl(window.location.href);
        text2 = pickLeadVideoUrl(text, local);
      } else {
        try {
          lockFeedLeadVideoUrl(local);
        } catch (error) {}
        text2 = pickLeadVideoUrl(state.lockedLeadVideoUrl || getFeedVideoIdentity(local) || "", local);
      }
      const local3 = text2 || local2;
      const result4 = await waitLeadgenScrapeAwemeAuthor(local3, 1200);
      result = captureCurrentVideoMetadata(local, local3);
      if (result4 && String(result4.videoId) === String(extractSpecificVideoId(local3) || "")) {
        if (result4.authorNickname) {
          result.authorNickname = result4.authorNickname;
        }
        if (result4.authorUrl) {
          result.authorUrl = result4.authorUrl;
        }
        if (result4.title && (!result.title || result.title === "未知视频")) {
          result.title = result4.title;
        }
        result.fromApi = true;
      }
      const result5 = String(result.authorNickname || "").trim();
      if (result5 && result2 && normalizeAuthorAccountName(result5) === result2 && !result.fromApi) {
        console.warn("[Built-in-Debug] [作者对齐] 重采仍同上一条且非 API，清空昵称防错配");
        result = {
          ...result,
          authorNickname: "",
          authorUrl: ""
        };
      }
    }
    const local5 = text2 || local2;
    return {
      meta: result,
      leadVideoUrl: local5,
      url: text || local5,
      dedupKey: isDouyinVideoShareUrl(local5) ? local5 : text || local5
    };
  }
  function getCommentPanelSelector() {
    return getCommentV2String("commentPanel");
  }
  function getPublishBtnTexts() {
    return getV2ListOr("publishBtnTexts", ["发布", "发送", "发表", "回复"]);
  }
  function getCommentItemSelector() {
    return mergeCommentSelectors(getCommentV2String("commentItem"), getCommentV2String("commentItemLoose"));
  }
  function getCommentItemLooseSelector() {
    return getCommentV2String("commentItemLoose");
  }
  function mergeCommentSelectors(...restArgs) {
    const list = [];
    const set = new Set();
    for (const item of restArgs) {
      for (const item2 of String(item || "").split(",")) {
        const result = item2.trim();
        if (!result || set.has(result)) {
          continue;
        }
        set.add(result);
        list.push(result);
      }
    }
    return list.join(", ");
  }
  function getMergedCommentInputSelector() {
    return mergeCommentSelectors(getCommentV2String("commentInputMain"), getCommentV2String("commentInput"));
  }
  function getDraftEditorSelector() {
    return getCommentV2String("draftEditor");
  }
  function getMainCommentInputShellSelector() {
    return mergeCommentSelectors(getCommentV2String("commentInputShell"), getCommentV2String("commentInputShellLoose"));
  }
  function queryCommentItemNodes(arg1) {
    const local = arg1 || document;
    if (!local?.querySelectorAll) {
      return [];
    }
    const result = getCommentItemSelector();
    let list = [];
    if (result) {
      try {
        list = Array.from(local.querySelectorAll(result));
      } catch (error) {
        list = [];
      }
    }
    if (list.length) {
      return list;
    }
    const result2 = getCommentItemLooseSelector();
    if (result2 && result2 !== result) {
      try {
        list = Array.from(local.querySelectorAll(result2));
      } catch (error) {
        list = [];
      }
    }
    return list;
  }
  function nodeContainsSecondaryComment(arg1) {
    if (!arg1?.querySelectorAll) {
      return false;
    }
    try {
      const result = Array.from(arg1.querySelectorAll("span, div, label, em, i, strong"));
      for (const item of result) {
        if (!isSecondaryCommentWithin(item, arg1)) {
          continue;
        }
        if ((item.children?.length || 0) > 1) {
          continue;
        }
        const result = String(item.innerText || item.textContent || "").replace(/\s+/g, " ").trim();
        if (result === "作者") {
          return true;
        }
      }
    } catch (error) {}
    return false;
  }
  function isSecondaryCommentWithin(arg1, arg2) {
    if (!arg1 || !arg2 || typeof arg2.contains !== "function") {
      return false;
    }
    if (!arg2.contains(arg1)) {
      return false;
    }
    const local = arg1.closest?.("[data-e2e=\"comment-reply-item\"], div[class*=\"reply-item\"], div[class*=\"ReplyItem\"], [class*=\"sub-comment-item\"], [class*=\"SubCommentItem\"]");
    if (!local) {
      return true;
    }
    return local === arg2;
  }
  function describeCommentNode(arg1, arg2 = null) {
    if (!arg1) {
      return "无节点";
    }
    const local = String(arg1.getAttribute?.("data-e2e") || "").trim() || "无e2e";
    const flag = isDouyinSecondaryCommentNode(arg1);
    const result = nodeContainsSecondaryComment(arg1);
    const result2 = String(arg2?.nickname || "").trim();
    return (result2 ? "@" + result2 + " " : "") + "e2e=" + local + " 二级=" + (flag ? "是" : "否") + " 作者角标=" + (result ? "是" : "否");
  }
  function findCommentPanelRoot(arg1 = document) {
    const result = getCommentPanelSelector();
    if (!result) {
      return null;
    }
    const list = [];
    if (arg1?.querySelectorAll) {
      list.push(arg1);
    }
    if (arg1 !== document) {
      list.push(document);
    }
    const list2 = [];
    const set = new Set();
    const result2 = getV2StringOr("commentPanel", ".comment-mainContent, [data-e2e=\"comment-list\"], [class*=\"CommentList\"], [class*=\"comment-list\"]");
    const result3 = mergeCommentSelectors(getMergedCommentInputSelector(), getMainCommentInputShellSelector(), getDraftEditorSelector());
    for (let num = 0; num < list.length; num += 1) {
      const value = list[num];
      let list3 = [];
      try {
        if (value.matches?.(result)) {
          list3.push(value);
        }
        list3.push(...Array.from(value.querySelectorAll(result)));
      } catch (error) {
        continue;
      }
      for (const item of list3) {
        if (!item || set.has(item) || !isVisibleElement(item)) {
          continue;
        }
        set.add(item);
        let flag = false;
        let num2 = 0;
        let flag2 = false;
        try {
          flag = item.matches(result2);
        } catch (error) {}
        try {
          num2 = queryCommentItemNodes(item).filter(isVisibleElement).length;
        } catch (error) {}
        try {
          const value = result3 ? item.querySelector(result3) : null;
          flag2 = !!value && !!isVisibleElement(value) || !!isMainCommentPlaceholderCandidate(item, {
            requireViewport: false,
            profileVideo: false
          });
        } catch (error) {}
        if (!flag && num2 === 0 && !flag2) {
          continue;
        }
        const result = item.getBoundingClientRect();
        const local = arg1 && arg1 !== document && (item === arg1 || arg1.contains?.(item));
        const value = (local ? 1000 : 0) + (num === 0 ? 200 : 0) + (flag ? 120 : 0) + (flag2 ? 160 : 0) + Math.min(num2, 40) * 8 + Math.min(result.width * result.height / 10000, 80);
        list2.push({
          el: item,
          score: value
        });
      }
    }
    list2.sort((arg1, arg2) => arg2.score - arg1.score);
    return list2[0]?.el || null;
  }
  function resolveCommentPanelRoot(arg1) {
    return findCommentPanelRoot(arg1) || arg1 || document.body;
  }
  function getMainCommentFloorIndex(arg1, arg2, options = {}) {
    if (!arg1 || !arg2) {
      return -1;
    }
    if (isDouyinSecondaryCommentNode(arg1) || nodeContainsSecondaryComment(arg1)) {
      return -1;
    }
    const flag = !!options.relaxed;
    const result = String(arg2.commentId || arg2.cid || arg2.comment_id || "").trim();
    if (/^\d{10,}$/.test(result)) {
      let text = "";
      try {
        text = extractDouyinCommentCidFromNode(arg1);
      } catch (error) {
        text = "";
      }
      if (text && text !== result) {
        return -1;
      }
      if (text && text === result) {
        return 80 + commentNodeViewportBonus(arg1);
      }
    }
    const result2 = normalizeDouyinCommentContent(arg1.innerText || "");
    const result3 = normalizeDouyinCommentContent(arg1.textContent || "");
    const result4 = (arg2.nickname || "").trim();
    if (!result4) {
      return -1;
    }
    const result5 = Array.from(arg1.querySelectorAll("a[href*=\"/user/\"], [data-e2e=\"comment-at-user\"]"));
    const local = result5.find(arg1 => {
      const result = normalizeDouyinCommentContent(arg1?.innerText || arg1?.textContent || arg1?.getAttribute?.("title") || "").replace(/^@+/, "");
      return result && (result === result4 || result.includes(result4) || result4.includes(result));
    }) || result5[0] || null;
    const result6 = normalizeDouyinCommentContent(local?.innerText || local?.textContent || local?.getAttribute?.("title") || "").replace(/^@+/, "");
    if (!result2.includes(result4) && !result3.includes(result4) && result6 !== result4) {
      return -1;
    }
    let num = 1;
    const result7 = normalizeDouyinCommentContent(arg2.content || arg2.comment || arg2.commentText || "");
    let text = "";
    try {
      text = extractDouyinCommentContent(arg1, result4 || result6) || "";
    } catch (error) {
      text = "";
    }
    const result8 = collectDouyinCommentEmojiHints(arg1);
    const result9 = [text, result2, result3, ...result8].filter(Boolean);
    const result10 = buildLeadCommentFingerprint(result7);
    const result11 = buildNodeCommentFingerprint(arg1, result4 || result6, text, result8);
    const result12 = scoreCommentContentFingerprints(result10, result11, result9, result4 || result6);
    let local2 = !result7 || result12.hit;
    if (result7 && !result12.hit) {
      if (!flag) {
        return -1;
      }
      const result = result7.slice(0, Math.min(10, result7.length));
      const local3 = result.length >= 4 && result9.some(arg1 => arg1.includes(result));
      const local4 = !text || text === "..." || /^\.{2,}$/.test(text) || result2.includes("...") || result3.includes("...");
      const result4 = (arg2.timeText || arg2.commentTime || "").trim();
      const local5 = !!result4 && (!!result2.includes(result4) || !!result3.includes(result4));
      const result5 = extractUserIdFromUrl(arg2.userUrl || "");
      const value = local ? extractUserIdFromUrl(local.href || local.getAttribute("href") || "") : "";
      const local6 = !!result5 && !!value && result5 === value;
      if (local3) {
        local2 = true;
        num += 8;
      } else if (local6 && (local5 || local4)) {
        local2 = true;
        num += 5;
      } else if (local6 && local5) {
        local2 = true;
        num += 6;
      } else {
        return -1;
      }
    }
    if (result12.scoreBonus) {
      num += result12.scoreBonus;
    }
    if (result12.soft) {
      num += 0;
    }
    num += commentNodeViewportBonus(arg1);
    const result13 = extractUserIdFromUrl(arg2.userUrl || "");
    if (result13) {
      const value = local ? extractUserIdFromUrl(local.href || local.getAttribute("href") || "") : "";
      if (value) {
        if (value === result13) {
          num += 18;
        } else if (!local2 || result12.soft) {
          return -1;
        }
      }
    }
    const result14 = (arg2.timeText || arg2.commentTime || "").trim();
    if (result14 && (result2.includes(result14) || result3.includes(result14))) {
      num += 10;
    }
    const result15 = (arg2.ipLocation || arg2.location || "").trim();
    if (result15 && result15 !== "未知" && (result2.includes(result15) || result3.includes(result15))) {
      num += 4;
    }
    try {
      const value = (arg1.className || "") + " " + (arg1.getAttribute?.("class") || "");
      if (/active|Active|highlight|Highlight|selected|Selected|current|Current/i.test(value)) {
        num += 10;
      }
    } catch (error) {}
    return num;
  }
  function findTargetNode(arg1, arg2, options = {}) {
    const flag = !!options.relaxed;
    const result = resolveCommentPanelRoot(arg1);
    let result2 = queryCommentItemNodes(result);
    if (!result2.length) {
      result2 = queryCommentItemNodes(document);
    }
    let local = null;
    let value = -1;
    for (const item of result2) {
      const result = getMainCommentFloorIndex(item, arg2, {
        relaxed: flag
      });
      if (result > value) {
        value = result;
        local = item;
      }
    }
    if (local && options.scrollIntoView !== false) {
      safeScrollTargetIntoView(local, {
        force: true,
        block: "nearest"
      });
    }
    return local;
  }
  async function runCommentScrollRounds(arg1, arg2, options = {}) {
    const local = Number(options.baseRounds) || 8;
    let local2 = local;
    let flag = false;
    let num = 0;
    for (let num2 = 0; num2 < local2; num2++) {
      if (shouldAbort(arg2)) {
        return num;
      }
      const result = resolveCommentPanelRoot(arg1);
      const value = queryCommentItemNodes(result).filter(isVisibleElement).length;
      if (value > num) {
        num = value;
      }
      if (num > 0) {
        return num;
      }
      const result2 = getCommentsTotalCount(arg1 || document.body);
      if (result2 === 0) {
        return 0;
      }
      if (!flag && num2 >= local - 1 && result2 > 0) {
        local2 = getExtendedReadyRounds(local, {
          progress: true,
          hardCapRounds: 14
        });
        if (local2 > local) {
          flag = true;
          console.log("[Built-in-Debug] [慢环境] 评论节点尚未渲染，延长等待 " + local + "→" + local2 + " 轮");
          try {
            reportCurrentAction("评论列表加载中，继续等待节点…");
          } catch (error) {}
        }
      }
      await sleep(options.profileVideo ? 350 : 500);
    }
    return num;
  }
  function isTargetableMainComment(arg1, arg2, options = {}) {
    if (!arg1 || !isVisibleElement(arg1)) {
      return false;
    }
    return getMainCommentFloorIndex(arg1, arg2, options) >= 0;
  }
  async function scrollIntoViewIfNeeded(arg1, arg2) {
    if (!arg1) {
      return null;
    }
    const result = arg1.getBoundingClientRect();
    const local = result.bottom > 8 && result.top < window.innerHeight - 8 && result.height > 0;
    if (!local) {
      safeScrollTargetIntoView(arg1, {
        force: true,
        block: "nearest"
      });
      await randomDelay(160, 320, arg2);
    }
    return arg1;
  }
  function reportMonitorActionProgress(arg1, arg2) {
    const result = String(arg2 || "").trim();
    const result2 = String(arg1 || "").trim();
    if (!result || !result2) {
      return;
    }
    try {
      ipcRenderer.send("video-monitor-action-progress", {
        requestId: result2,
        message: result
      });
    } catch (error) {}
  }
  async function locateTargetCommentNode(arg1, arg2, arg3, options = {}) {
    if (shouldAbort(arg3)) {
      return null;
    }
    const local = arg1 || document.body;
    const value = String(arg3 || "") === "SELF_WARMUP";
    const result = String(arg2?.commentId || arg2?.cid || arg2?.comment_id || "").trim();
    const result2 = /^\d{10,}$/.test(result);
    const local2 = !!options.fastLocate && !value && options.stableLocate !== true;
    const local3 = !result2 && (!!options.stableLocate || value) || !local2 && !!options.forceStable;
    const value2 = typeof options.onProgress === "function" ? options.onProgress : null;
    const local4 = arg1 => {
      try {
        value2?.(arg1);
      } catch (error) {}
    };
    try {
      await ensureCommentPanelOpen(local, arg3);
    } catch (error) {}
    const value3 = local2 ? 3 : local3 ? 12 : 8;
    const value4 = queryCommentItemNodes(resolveCommentPanelRoot(local)).filter(isVisibleElement).length;
    if (!local2 || value4 === 0) {
      local4("等待评论节点渲染（当前可见 " + value4 + "）");
      await runCommentScrollRounds(local, arg3, {
        profileVideo: !!options.profileVideo,
        baseRounds: value3
      });
    } else {
      local4("评论区已有 " + value4 + " 个可见节点，跳过就绪等待");
    }
    let result3 = findTargetNode(local, arg2, {
      scrollIntoView: true
    });
    if (isTargetableMainComment(result3, arg2)) {
      local4("当前视口已命中目标评论");
      return scrollIntoViewIfNeeded(result3, arg3);
    }
    if (local3) {
      local4("等待页面自动跳转到目标评论（慢速稳定模式，最长约 40 秒）…");
      const value = Date.now() + 40000;
      let num = 0;
      while (Date.now() < value) {
        if (shouldAbort(arg3)) {
          return null;
        }
        num += 1;
        await sleep(600);
        result3 = findTargetNode(local, arg2, {
          scrollIntoView: true
        });
        if (isTargetableMainComment(result3, arg2)) {
          local4("页面自动定位命中目标评论（等待第 " + num + " 轮）");
          return scrollIntoViewIfNeeded(result3, arg3);
        }
        if (num % 5 === 0) {
          local4("仍在等待自动定位…（第 " + num + " 轮，约 " + Math.round((Date.now() - (value - 40000)) / 1000) + "s）");
        }
      }
      local4("自动定位等待结束（约 40 秒），改为慢速滚动搜索");
    } else {
      await sleep(local2 ? 280 : 500);
      result3 = findTargetNode(local, arg2, {
        scrollIntoView: true
      });
      if (isTargetableMainComment(result3, arg2)) {
        local4("短等后命中目标评论");
        return scrollIntoViewIfNeeded(result3, arg3);
      }
    }
    const local5 = findCommentScrollContainer(local) || resolveCommentPanelRoot(local) || local;
    if (!local5) {
      return null;
    }
    if (local5.scrollTop > 0) {
      local4("重置评论区到顶部(scrollTop=" + Math.round(local5.scrollTop) + "→0)进行检索");
      local5.scrollTop = 0;
      try {
        local5.dispatchEvent(new Event("scroll", {
          bubbles: true
        }));
      } catch (error) {}
      await sleep(local2 ? 200 : local3 ? 600 : 350);
      result3 = findTargetNode(local, arg2, {
        scrollIntoView: true
      });
      if (isTargetableMainComment(result3, arg2)) {
        local4("回顶后命中目标评论");
        return scrollIntoViewIfNeeded(result3, arg3);
      }
    }
    const result4 = Math.max(400, Math.min(800, local5.clientHeight || 600));
    const value5 = local3 ? 50 : 40;
    let local6 = value5;
    let flag = false;
    let value6 = -1;
    let value7 = queryCommentItemNodes(resolveCommentPanelRoot(local)).length;
    let num = 0;
    const local7 = getCommentsTotalCount(local) || 0;
    local4("开始滚动搜索目标评论（可见 " + value7 + "/" + (local7 || "?") + "）");
    for (let num2 = 0; num2 < local6; num2++) {
      if (shouldAbort(arg3)) {
        return null;
      }
      result3 = findTargetNode(local, arg2, {
        scrollIntoView: true
      });
      if (isTargetableMainComment(result3, arg2)) {
        local4("滚动第 " + (num2 + 1) + " 轮命中目标评论");
        return scrollIntoViewIfNeeded(result3, arg3);
      }
      const value = local5.scrollTop;
      const result = Math.max(0, local5.scrollHeight - local5.clientHeight);
      const value2 = queryCommentItemNodes(resolveCommentPanelRoot(local)).length;
      const value3 = value2 > value7;
      if (value3) {
        value7 = value2;
      }
      if (value >= result - 10 && value6 >= result - 10) {
        if (local2) {
          local4("已滚到底仍未命中（第 " + (num2 + 1) + " 轮）");
          break;
        }
        num += 1;
        const value = local3 ? 6 : 3;
        const local = value3 || local7 > 0 && value7 < Math.min(local7, value7 + 8) || num < value;
        if (!local) {
          break;
        }
        await sleep(value3 ? 500 : local3 ? 900 : 700);
      } else {
        num = 0;
      }
      value6 = value;
      if (typeof local5.scrollBy === "function") {
        local5.scrollBy(0, result4);
      } else {
        local5.scrollTop += result4;
      }
      try {
        local5.dispatchEvent(new Event("scroll", {
          bubbles: true
        }));
      } catch (error) {}
      const local8 = value2;
      await randomDelay(local2 ? 200 : local3 ? 320 : 220, local2 ? 350 : local3 ? 520 : 380, arg3);
      let value4 = queryCommentItemNodes(resolveCommentPanelRoot(local)).length;
      if (!local2 && value4 <= local8) {
        await sleep(local3 ? 450 : 280);
        value4 = queryCommentItemNodes(resolveCommentPanelRoot(local)).length;
      }
      if (value4 > value7) {
        value7 = value4;
      }
      if ((num2 + 1) % 10 === 0) {
        local4("滚动搜索中第 " + (num2 + 1) + "/" + local6 + " 轮，可见节点 " + value7);
      }
      if (!local2 && !flag && (value3 || value4 > local8) && num2 >= value5 - 1) {
        local6 = getExtendedReadyRounds(value5, {
          progress: true,
          hardCapRounds: local3 ? 70 : 60
        });
        if (local6 > value5) {
          flag = true;
          console.log("[Built-in-Debug] [慢环境] 评论定位滚动仍有新节点，延长 " + value5 + "→" + local6 + " 轮");
        }
      }
    }
    result3 = findTargetNode(local, arg2, {
      scrollIntoView: true,
      relaxed: true
    });
    if (isTargetableMainComment(result3, arg2, {
      relaxed: true
    })) {
      local4("严格匹配未中，宽松匹配命中");
      console.log("[Built-in-Debug] [评论定位] 严格匹配未中，宽松匹配命中");
      return scrollIntoViewIfNeeded(result3, arg3);
    }
    const result5 = clipTraceText((arg2.content || "").trim(), 24);
    const value8 = queryCommentItemNodes(resolveCommentPanelRoot(local)).filter(isVisibleElement).length;
    local4("定位失败，可见节点 " + value8 + "/" + (local7 || "?"));
    reportTraceLog("⚠ 定位评论失败：@" + arg2.nickname + (result5 ? "「" + result5 + "」" : "") + "，可见节点 " + value8 + "/" + (local7 || "?") + "，评论区完整滚动搜索后未找到原评论", null, "warning");
    return null;
  }
  function findReplyControlInComment(arg1) {
    if (!arg1 || !hasCommentRuntimeReady()) {
      return null;
    }
    const local = arg1.matches?.("[data-e2e=\"comment-reply-item\"], div[class*=\"reply-item\"], [class*=\"ReplyItem\"]");
    const result = Array.from(arg1.querySelectorAll("span, a, button, div[role=\"button\"]")).filter(arg12 => {
      if (!isVisibleElement(arg12)) {
        return false;
      }
      if (!isSecondaryCommentWithin(arg12, arg1)) {
        return false;
      }
      const result = (arg12.textContent || "").replace(/\s+/g, " ").trim();
      if (!isReplyBtnText(result)) {
        return false;
      }
      if ((arg12.innerText || "").trim().length > 8) {
        return false;
      }
      if (!local) {
        const flag = !!arg12.closest("[class*=\"reply-list\"], [class*=\"ReplyList\"], [class*=\"sub-comment-list\"], [class*=\"SubCommentList\"], [data-e2e=\"comment-reply-list\"]");
        if (flag) {
          return false;
        }
      }
      return true;
    });
    if (!result.length) {
      return null;
    }
    const result2 = arg1.getBoundingClientRect();
    const result3 = result.map(arg1 => {
      const result = arg1.getBoundingClientRect();
      let num = 0;
      if (arg1.closest("button, a, [role=\"button\"]")) {
        num += 4;
      }
      const result3 = Math.max(0, result.top - result2.top);
      num += Math.max(0, 14 - result3 / 18);
      if (result.width > 0 && result.width < 80) {
        num += 2;
      }
      return {
        el: arg1,
        score: num,
        dist: result3
      };
    }).sort((arg1, arg2) => arg2.score - arg1.score);
    const local2 = result3[0]?.el;
    return local2?.closest("button, a, div[role=\"button\"], div, span") || local2 || null;
  }
  function findVisibleCommentComposer(arg1) {
    const local = getCommentV2String("commentInputReply") || getCommentV2String("commentInput");
    const result = getCommentV2String("commentSendBtn");
    const result2 = getCommentV2String("commentInputShell");
    if (!hasCommentRuntimeReady()) {
      return null;
    }
    let list = [];
    if (local) {
      try {
        list = Array.from(document.querySelectorAll(local));
      } catch (error) {
        list = [];
      }
    }
    if (list.length === 0) {
      const result = ["[data-e2e=\"comment-input\"] .public-DraftEditor-content", "[data-e2e=\"comment-input\"] [contenteditable=\"true\"]", "[class*=\"Reply\"] [contenteditable=\"true\"]", "[class*=\"reply\"] [contenteditable=\"true\"]"].join(", ");
      const local = arg1?.closest?.("[data-e2e*=\"comment\"], [class*=\"comment\"], [class*=\"Comment\"]");
      for (const item of [local, document]) {
        if (!item?.querySelectorAll) {
          continue;
        }
        try {
          list.push(...item.querySelectorAll(result));
        } catch (error) {}
        if (list.length > 0) {
          break;
        }
      }
    }
    list = [...new Set(list)].filter(arg1 => {
      if (!isVisibleElement(arg1)) {
        return false;
      }
      const result = arg1.getBoundingClientRect();
      return result.width >= 40 && result.height >= 14;
    });
    const result3 = (arg1?.innerText || "").replace(/\s+/g, " ").trim().slice(0, 200);
    const result4 = list.map(arg12 => {
      const local = arg12.closest("[class*=\"comment\"], form, section, [class*=\"Reply\"], [class*=\"reply\"]")?.innerText || "";
      const result4 = (arg12.getAttribute("placeholder") || arg12.getAttribute("data-placeholder") || "").trim();
      let num = 0;
      if (result3 && local.includes(result3.slice(0, 30))) {
        num += 5;
      }
      if (arg12.matches?.(".public-DraftEditor-content")) {
        num += 3;
      }
      if (result2) {
        try {
          if (arg12.closest(result2)) {
            num += 4;
          }
        } catch (error) {}
      }
      if (result) {
        try {
          if (arg12.closest("[class*=\"comment\"]")?.querySelector(result)) {
            num += 4;
          }
        } catch (error) {}
      }
      if (matchesPlaceholderHint(result4) || /回复|评论|说点/.test(result4)) {
        num += 5;
      }
      if (arg1?.contains?.(arg12)) {
        num += 8;
      }
      return {
        el: arg12,
        score: num
      };
    }).sort((arg1, arg2) => arg2.score - arg1.score);
    return result4[0]?.el || null;
  }
  async function hasVisibleLooseCommentShell(arg1) {
    const local = getCommentV2String("commentInputShellLoose") || getCommentV2String("commentInputShell");
    if (!local || !hasCommentRuntimeReady()) {
      return false;
    }
    const result = Array.from(document.querySelectorAll(local)).filter(arg1 => {
      if (!isVisibleElement(arg1)) {
        return false;
      }
      const result = (arg1.getAttribute("placeholder") || arg1.getAttribute("data-placeholder") || arg1.textContent || "").replace(/\s+/g, " ").trim();
      return matchesPlaceholderHint(result) || /回复|说点|评论/.test(result);
    });
    if (!result.length) {
      return false;
    }
    const value = result.sort((arg1, arg2) => {
      const result = arg1.getBoundingClientRect();
      const result2 = arg2.getBoundingClientRect();
      return result2.bottom - result.bottom;
    })[0];
    try {
      await simulateTrustedElementClick(value, arg1, "回复占位符");
    } catch (error) {
      try {
        value.click();
      } catch (error) {}
    }
    await sleep(320);
    return true;
  }
  function findMainVideoCommentInput(arg1 = document) {
    const result = getMergedCommentInputSelector();
    const result2 = getCommentItemSelector();
    const result3 = getMainCommentInputShellSelector();
    const resultDraft = getDraftEditorSelector();
    if (!hasCommentRuntimeReady()) {
      return null;
    }
    const list = [];
    if (arg1) {
      list.push(arg1);
    }
    if (arg1 !== document && !list.includes(document)) {
      list.push(document);
    }
    let list2 = [];
    for (const item of list) {
      if (result) {
        try {
          list2.push(...Array.from(item.querySelectorAll(result)));
        } catch (error) {}
      }
      if (resultDraft) {
        try {
          list2.push(...Array.from(item.querySelectorAll(resultDraft)));
        } catch (error) {}
      }
      if (result3) {
        try {
          list2.push(...Array.from(item.querySelectorAll(result3)));
        } catch (error) {}
      }
      try {
        list2.push(...Array.from(item.querySelectorAll(".public-DraftEditor-content, [contenteditable], [role=\"textbox\"]")));
      } catch (error) {}
    }
    if (document.activeElement && isVisibleElement(document.activeElement)) {
      list2.push(document.activeElement);
    }
    list2 = [...new Set(list2.map(resolveMainCommentWritableElement).filter(Boolean))].filter(arg1 => {
      if (!isVisibleElement(arg1)) {
        return false;
      }
      let flag = false;
      if (result2) {
        try {
          flag = Boolean(arg1.closest(result2));
        } catch (error) {}
      }
      if (!flag) {
        flag = Boolean(arg1.closest("[class*=\"comment-item\"], [class*=\"CommentItem\"]") && !arg1.closest("[class*=\"input\"], [class*=\"Input\"], [class*=\"write\"], [class*=\"Write\"], [class*=\"editor\"], [class*=\"Editor\"], [class*=\"compose\"], [class*=\"Compose\"]"));
      }
      if (flag) {
        return false;
      }
      if (arg1.closest("[class*=\"search\"], [data-e2e=\"searchbar\"], input[type=\"search\"]")) {
        return false;
      }
      const result = arg1.getBoundingClientRect();
      if (result.width < 30 || result.height < 12) {
        return false;
      }
      const result3 = window.getComputedStyle(arg1);
      if (result3.display === "none" || result3.visibility === "hidden") {
        return false;
      }
      return true;
    });
    const result4 = list2.map(arg12 => {
      let num = 0;
      const result = arg12.getBoundingClientRect();
      if (arg1 && arg1 !== document && (arg12 === arg1 || arg1.contains?.(arg12))) {
        num += 100;
      }
      const result2 = getCommentPanelSelector();
      if (result2) {
        try {
          if (arg12.closest(result2)) {
            num += 20;
          }
        } catch (error) {}
      }
      if (result3) {
        try {
          if (arg12.closest(result3)) {
            num += 25;
          }
        } catch (error) {}
      }
      if (arg12.classList.contains("public-DraftEditor-content")) {
        num += 15;
      }
      if (arg12.isContentEditable || (arg12.getAttribute("contenteditable") || "").toLowerCase() === "true") {
        num += 10;
      }
      if (arg12 === document.activeElement) {
        num += 20;
      }
      if (arg12.tagName === "TEXTAREA" || arg12.tagName === "INPUT") {
        num += 7;
      }
      if ((arg12.getAttribute("role") || "").toLowerCase() === "textbox") {
        num += 8;
      }
      const result4 = (arg12.getAttribute("placeholder") || "").toLowerCase();
      if (result4.includes("评论") || result4.includes("说点")) {
        num += 8;
      }
      num += result.bottom / Math.max(window.innerHeight, 1) * 15;
      if (collectScrollRoots(arg12)) {
        num += 12;
      }
      return {
        el: arg12,
        score: num
      };
    }).sort((arg1, arg2) => arg2.score - arg1.score);
    if (result4[0]) {
      console.log("[Built-in-Debug] [主贴输入框] 选中编辑器 (score=" + result4[0].score.toFixed(1) + ", tag=" + result4[0].el.tagName + ", class=" + (result4[0].el.className || "").toString().slice(0, 40) + ")");
    }
    return result4[0]?.el || null;
  }
  function isEditableElement(arg1) {
    if (!arg1 || arg1.nodeType !== 1) {
      return false;
    }
    const result = String(arg1.tagName || "").toUpperCase();
    if (result === "TEXTAREA") {
      return !arg1.disabled && !arg1.readOnly;
    }
    if (result === "INPUT") {
      const result = String(arg1.getAttribute("type") || "text").toLowerCase();
      return !arg1.disabled && !arg1.readOnly && !["button", "submit", "checkbox", "radio", "hidden", "file"].includes(result);
    }
    const rawCe = arg1.getAttribute("contenteditable");
    if (rawCe !== null) {
      const result2 = String(rawCe).toLowerCase();
      if (result2 === "true" || result2 === "plaintext-only" || result2 === "") {
        return true;
      }
    }
    if (arg1.isContentEditable) {
      return true;
    }
    if (arg1.classList?.contains("public-DraftEditor-content")) {
      return true;
    }
    if ((arg1.getAttribute("role") || "").toLowerCase() === "textbox" && (rawCe !== null || arg1.isContentEditable || arg1.classList?.contains("public-DraftEditor-content"))) {
      return true;
    }
    return false;
  }
  function resolveMainCommentWritableElement(arg1) {
    if (!arg1) {
      return null;
    }
    if (isEditableElement(arg1)) {
      return arg1;
    }
    try {
      return Array.from(arg1.querySelectorAll(".public-DraftEditor-content, [contenteditable=\"true\"], [contenteditable=\"plaintext-only\"], [contenteditable], textarea, input, [role=\"textbox\"]")).find(arg1 => isEditableElement(arg1) && isVisibleElement(arg1)) || null;
    } catch (error) {
      return null;
    }
  }
  async function prepareCommentEnvironment(arg1, arg2, num = 15, options = {}) {
    const flag = !!options.profileVideo;
    const result = Number(options.deadlineAt || 0);
    try {
      window.focus?.();
    } catch (error) {}
    try {
      if (state.currentViewKey) {
        ipcRenderer.send("focus-automation-view", {
          viewKey: state.currentViewKey,
          bringToFront: true
        });
      }
    } catch (error) {}
    const list = [];
    if (arg1) {
      list.push(arg1);
    }
    if (!list.includes(document.body)) {
      list.push(document.body);
    }
    const local = num;
    let local2 = local;
    let flag2 = false;
    let flag3 = false;
    for (let num = 0; num < local2; num++) {
      if (shouldAbort(arg2)) {
        return null;
      }
      if (result > 0 && Date.now() >= result) {
        return null;
      }
      const result2 = findMainVideoCommentInput(arg1 || document);
      if (result2) {
        return result2;
      }
      for (const item of list) {
        if (result > 0 && Date.now() >= result) {
          return null;
        }
        const result2 = getMainCommentInputShellSelector();
        const result3 = [result2, "textarea[placeholder]", "input[placeholder]", "[contenteditable=\"true\"][data-placeholder]", "[role=\"textbox\"][aria-label]", "div", "span", "p"].filter(Boolean).join(", ");
        const local = arg1 => result2 && (() => {
          try {
            return arg1.matches(result2);
          } catch (error) {
            return false;
          }
        })() && isVisibleElement(arg1) && !arg1.closest("[class*=\"comment-item\"], [class*=\"CommentItem\"]");
        const result4 = Array.from(item.querySelectorAll(result3)).filter(arg1 => isMainCommentPlaceholderCandidate(arg1, {
          requireViewport: false,
          profileVideo: flag
        }) || local(arg1)).sort((arg1, arg2) => scoreMainCommentPlaceholderCandidate(arg2) - scoreMainCommentPlaceholderCandidate(arg1));
        let result5 = result4.filter(arg1 => flag ? isElementInViewport(arg1) : isElementInViewportForAutomation(arg1));
        if (!result5.length && result4[0]) {
          try {
            safeScrollTargetIntoView(result4[0], {
              force: true,
              block: "nearest"
            });
            await sleepWithinDeadline(220, result);
            result5 = result4.filter(arg1 => flag ? isElementInViewport(arg1) : isElementInViewportForAutomation(arg1));
          } catch (error) {}
        }
        if (result5[0]) {
          flag3 = true;
          const local = result5[0].closest("div[class*=\"comment\"], div[class*=\"input\"], div[class*=\"area\"]") || result5[0];
          await simulateTrustedElementClick(local, arg2, "主评占位符兜底", {
            deadlineAt: result
          });
          try {
            result5[0]?.focus?.();
            result5[0]?.click?.();
            local.focus?.();
            local.click?.();
          } catch (error) {}
          await sleepWithinDeadline(300, result);
          const found = findMainVideoCommentInput(arg1 || document) || resolveMainCommentWritableElement(local) || resolveMainCommentWritableElement(result5[0]) || resolveMainCommentWritableElement(document.activeElement);
          if (found) {
            return found;
          }
        } else {
          const result2 = Array.from(item.querySelectorAll("div, span, p, textarea[placeholder], input[placeholder], [data-placeholder], [aria-label]")).filter(arg1 => {
            if (!isVisibleElement(arg1)) {
              return false;
            }
            if (arg1.closest("[class*=\"comment-item\"], [class*=\"CommentItem\"]")) {
              return false;
            }
            const result = getCommentPlaceholderText(arg1);
            if (!result || result.length > 48) {
              return false;
            }
            if (!isCommentPlaceholderText(result)) {
              return false;
            }
            const result2 = arg1.getBoundingClientRect();
            return result2.width >= 20 && result2.height >= 12 && result2.height <= 180 && result2.width <= Math.max(960, Math.floor(window.innerWidth * 0.85));
          }).sort((arg1, arg2) => scoreMainCommentPlaceholderCandidate(arg2) - scoreMainCommentPlaceholderCandidate(arg1)).slice(0, 3);
          for (const item of result2) {
            if (result > 0 && Date.now() >= result) {
              break;
            }
            flag3 = true;
            try {
              safeScrollTargetIntoView(item, {
                force: true,
                block: "nearest"
              });
              await sleepWithinDeadline(220, result);
              const local = item.closest("div[class*=\"comment\"], div[class*=\"input\"], div[class*=\"area\"]") || item;
              await simulateTrustedElementClick(local, arg2, "主评占位符宽松兜底", {
                deadlineAt: result,
                allowScrollIntoView: false
              });
              try {
                item.click?.();
                local.click?.();
              } catch (error) {}
              await sleepWithinDeadline(400, result);
              const result2 = findMainVideoCommentInput(arg1 || document);
              if (result2) {
                return result2;
              }
            } catch (error) {}
          }
        }
      }
      const result3 = getCommentTabPrefix();
      const value = result3 ? Array.from(document.querySelectorAll("div, span")).find(arg1 => isVisibleElement(arg1) && (arg1.textContent || "").trim().startsWith(result3) && (arg1.textContent || "").length < 24) : null;
      if (value && num % 3 === 0) {
        await simulateTrustedElementClick(value, arg2, "评论页签兜底", {
          deadlineAt: result
        });
        await sleepWithinDeadline(500, result);
      }
      const result4 = findMainVideoCommentInput(arg1 || document);
      if (result4) {
        return result4;
      }
      if (!flag2 && !result && flag3 && num >= local - 1) {
        local2 = getExtendedReadyRounds(local, {
          progress: true,
          hardCapRounds: 24
        });
        if (local2 > local) {
          flag2 = true;
          console.log("[Built-in-Debug] [慢环境] 主评占位符已出现但编辑器未就绪，延长探测 " + local + "→" + local2 + " 轮");
        }
      }
      const value2 = result > 0 ? Math.max(0, result - Date.now()) : 500;
      if (result > 0 && value2 <= 0) {
        return null;
      }
      await sleepWithinDeadline(Math.min(500, value2), result);
    }
    return null;
  }
  function clampSmallCount(arg1, num = 3) {
    const result = Number(arg1);
    if (!Number.isFinite(result)) {
      return num;
    }
    return Math.max(1, Math.min(8, Math.round(result)));
  }
  function resetExpressionRotationIndices() {
    state.commentExpressionRotateIndex = 0;
    state.videoCommentExpressionRotateIndex = 0;
  }
  function buildAttachmentScopeKey() {
    if ((state.currentTask?.isBatchAction || state.currentTask?.batchConfig) && state.currentTask?.batchRunId != null) {
      return "batch:" + state.currentTask.batchRunId;
    }
    const local = state.currentTask?.monitorTaskId || state.currentTask?.monitorRunId || (state.currentTask?.isMonitorAction ? state.currentTask?.taskId : null);
    if (local != null && String(local).trim()) {
      return "monitor:" + String(local).trim();
    }
    return "";
  }
  function hasAttachmentScope() {
    return !!buildAttachmentScopeKey();
  }
  function buildRotationStorageKey(arg1) {
    const result = buildAttachmentScopeKey();
    if (!result) {
      return "";
    }
    return "radar_attach_rot_" + result + "_" + arg1;
  }
  function readRotationFromStorage(arg1) {
    const result = buildRotationStorageKey(arg1);
    if (!result) {
      return null;
    }
    try {
      const result2 = localStorage.getItem(result);
      if (result2 != null && result2 !== "") {
        const result = Number(result2);
        if (Number.isFinite(result)) {
          return Math.max(0, Math.floor(result));
        }
      }
      if ((state.currentTask?.isBatchAction || state.currentTask?.batchConfig) && state.currentTask?.batchRunId != null) {
        const value = "radar_batch_attach_rot_" + state.currentTask.batchRunId + "_" + arg1;
        const result = localStorage.getItem(value);
        if (result != null && result !== "") {
          const result2 = Number(result);
          if (Number.isFinite(result2)) {
            return Math.max(0, Math.floor(result2));
          }
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }
  function writeRotationToStorage(arg1, arg2) {
    const result = buildRotationStorageKey(arg1);
    if (!result) {
      return;
    }
    try {
      localStorage.setItem(result, String(Math.max(0, Math.floor(Number(arg2) || 0))));
    } catch (error) {}
  }
  function syncCommentAttachmentRotationFromBatchStorage() {
    if (!hasAttachmentScope()) {
      return false;
    }
    const result = readRotationFromStorage("commentImage");
    const result2 = readRotationFromStorage("videoCommentImage");
    const result3 = readRotationFromStorage("commentExpression");
    const result4 = readRotationFromStorage("videoCommentExpression");
    if (result != null) {
      state.commentImageRotateIndex = result;
    }
    if (result2 != null) {
      state.videoCommentImageRotateIndex = result2;
    }
    if (result3 != null) {
      state.commentExpressionRotateIndex = result3;
    }
    if (result4 != null) {
      state.videoCommentExpressionRotateIndex = result4;
    }
    console.log("[评论配图] 轮询恢复(scope=" + buildAttachmentScopeKey() + "): 回复图=" + state.commentImageRotateIndex + (" 主评图=" + state.videoCommentImageRotateIndex) + (" 回复表情=" + state.commentExpressionRotateIndex) + (" 主评表情=" + state.videoCommentExpressionRotateIndex));
    return true;
  }
  function persistAllRotationIndices() {
    if (!hasAttachmentScope()) {
      return;
    }
    writeRotationToStorage("commentImage", state.commentImageRotateIndex);
    writeRotationToStorage("videoCommentImage", state.videoCommentImageRotateIndex);
    writeRotationToStorage("commentExpression", state.commentExpressionRotateIndex);
    writeRotationToStorage("videoCommentExpression", state.videoCommentExpressionRotateIndex);
  }
  function persistCommentAttachmentRotation() {
    persistAllRotationIndices();
    try {
      if (typeof window._saveRadarState === "function") {
        window._saveRadarState();
        return;
      }
      const result = radarSessionKey(window._radar_account_id, state.activeLoopId);
      const result2 = readRadarSessionState(window._radar_account_id, state.activeLoopId);
      if (result2.loopId === state.activeLoopId) {
        result2.commentImageRotateIndex = state.commentImageRotateIndex;
        result2.videoCommentImageRotateIndex = state.videoCommentImageRotateIndex;
        result2.commentExpressionRotateIndex = state.commentExpressionRotateIndex;
        result2.videoCommentExpressionRotateIndex = state.videoCommentExpressionRotateIndex;
        localStorage.setItem(result, JSON.stringify(result2));
      }
    } catch (error) {}
  }
  function restoreCommentAttachmentRotationFromSession(arg1, arg2) {
    try {
      const result = readRadarSessionState(arg1, arg2);
      if (result.loopId !== arg2) {
        return false;
      }
      if (Number.isFinite(result.commentImageRotateIndex)) {
        state.commentImageRotateIndex = Math.max(0, Math.floor(result.commentImageRotateIndex));
      }
      if (Number.isFinite(result.videoCommentImageRotateIndex)) {
        state.videoCommentImageRotateIndex = Math.max(0, Math.floor(result.videoCommentImageRotateIndex));
      }
      if (Number.isFinite(result.commentExpressionRotateIndex)) {
        state.commentExpressionRotateIndex = Math.max(0, Math.floor(result.commentExpressionRotateIndex));
      }
      if (Number.isFinite(result.videoCommentExpressionRotateIndex)) {
        state.videoCommentExpressionRotateIndex = Math.max(0, Math.floor(result.videoCommentExpressionRotateIndex));
      }
      console.log("[评论配图] 恢复轮询索引: 回复图=" + state.commentImageRotateIndex + " 主评图=" + state.videoCommentImageRotateIndex + (" 回复表情=" + state.commentExpressionRotateIndex + " 主评表情=" + state.videoCommentExpressionRotateIndex));
      return true;
    } catch (error) {
      return false;
    }
  }
  function nextRotateIndex(arg1, arg2, arg3) {
    const result = clampSmallCount(arg2);
    const result2 = Math.min(Math.max(arg1, 0), result);
    if (result2 <= 0) {
      return 0;
    }
    if (hasAttachmentScope()) {
      if (arg3) {
        const result = readRotationFromStorage("videoCommentExpression");
        if (result != null) {
          state.videoCommentExpressionRotateIndex = result;
        }
      } else {
        const result = readRotationFromStorage("commentExpression");
        if (result != null) {
          state.commentExpressionRotateIndex = result;
        }
      }
    }
    if (arg3) {
      const value = state.videoCommentExpressionRotateIndex % result2;
      state.videoCommentExpressionRotateIndex += 1;
      persistCommentAttachmentRotation();
      return value;
    }
    const value = state.commentExpressionRotateIndex % result2;
    state.commentExpressionRotateIndex += 1;
    persistCommentAttachmentRotation();
    return value;
  }
  function resolveCommentImagePaths() {
    const local = state.currentTask?.commentImagePaths;
    if (Array.isArray(local)) {
      return local.map(arg1 => String(arg1 || "").trim()).filter(Boolean);
    }
    const result = String(state.currentTask?.commentImagePath || "").trim();
    if (result) {
      return [result];
    } else {
      return [];
    }
  }
  function getCommentImageAttachmentInfo() {
    const result = resolveCommentImagePaths();
    return {
      enabled: !!state.currentTask?.enableCommentImage,
      paths: result
    };
  }
  let local = null;
  function clampPercentWithDefault(arg1) {
    const result = Number(arg1);
    if (!Number.isFinite(result)) {
      return 20;
    }
    return Math.max(0, Math.min(100, Math.round(result)));
  }
  function isCommentImageEnabled() {
    const result = getCommentImageAttachmentInfo();
    return result.enabled && result.paths.length > 0;
  }
  function isVideoCommentImageEnabled() {
    const result = getVideoCommentImageAttachmentInfo();
    return result.enabled && result.paths.length > 0;
  }
  function isCommentExpressionEnabled() {
    return !!state.currentTask?.enableCommentExpression;
  }
  function isVideoCommentExpressionEnabled() {
    return !!state.currentTask?.enableVideoCommentExpression;
  }
  function describeAttachmentSceneLabel(flag = false, options = {}) {
    if (options.profileFirst || options.isProfileFirstComment || options.profileVideo) {
      return "首作评论";
    }
    if (flag) {
      return "视频主评";
    } else {
      return "回复评论";
    }
  }
  function snapshotAttachmentFlags(flag = false, options = {}) {
    const value = flag ? isVideoCommentImageEnabled() : isCommentImageEnabled();
    const value2 = flag ? isVideoCommentExpressionEnabled() : isCommentExpressionEnabled();
    const result = describeAttachmentSceneLabel(flag, options);
    if (!value && !value2) {
      local = {
        image: false,
        expression: false
      };
      reportTraceLog("📎 " + result + "：未开启附带图片/表情包，跳过");
      console.log("[评论附带] 已滚动概率判定(isVideoComment=" + flag + "):", local);
      return;
    }
    if (options.forceWhenTextless) {
      local = {
        image: !!value,
        expression: !value && !!value2
      };
      const value3 = local.image ? "图片" : "表情包";
      reportTraceLog("📎 " + result + "：正文为空，强制附带" + value3);
      console.log("[评论附带] 正文为空强制附带(isVideoComment=" + flag + "):", local);
      return;
    }
    let flag2 = false;
    let flag3 = false;
    const value3 = flag ? clampPercentWithDefault(state.currentTask?.videoCommentAttachmentPercent) : clampPercentWithDefault(state.currentTask?.commentAttachmentPercent);
    const value4 = Math.random() * 100;
    const value5 = value4 < value3;
    const value6 = value ? "图片" : "表情包";
    if (value5) {
      if (value) {
        flag2 = true;
      } else if (value2) {
        flag3 = true;
      }
      reportTraceLog("📎 " + result + "：概率命中（" + value3 + "%），本次将附带" + value6);
    } else {
      reportTraceLog("📎 " + result + "：概率未命中（设置 " + value3 + "%，本次跳过附带" + value6 + "）");
    }
    local = {
      image: flag2,
      expression: flag3
    };
    console.log("[评论附带] 已滚动概率判定(isVideoComment=" + flag + "):", local);
  }
  function isImageAttachmentActive() {
    if (local) {
      return local.image;
    }
    return isCommentImageEnabled();
  }
  function resetCommentImageRotation() {
    state.commentImageRotateIndex = 0;
    state.videoCommentImageRotateIndex = 0;
    resetExpressionRotationIndices();
  }
  function pickCommentImagePath() {
    const result = resolveCommentImagePaths();
    if (!result.length) {
      return "";
    }
    if (hasAttachmentScope()) {
      const result = readRotationFromStorage("commentImage");
      if (result != null) {
        state.commentImageRotateIndex = result;
      }
    }
    const value = result[state.commentImageRotateIndex % result.length];
    const value2 = state.commentImageRotateIndex % result.length;
    state.commentImageRotateIndex += 1;
    persistCommentAttachmentRotation();
    const local = value.split(/[/\\]/).pop() || value;
    console.log("[评论配图] 轮询 " + (value2 + 1) + "/" + result.length + ": " + local);
    return value;
  }
  function resolveVideoCommentImagePaths() {
    const local = state.currentTask?.videoCommentImagePaths;
    if (Array.isArray(local)) {
      return local.map(arg1 => String(arg1 || "").trim()).filter(Boolean);
    }
    return [];
  }
  function getVideoCommentImageAttachmentInfo() {
    const result = resolveVideoCommentImagePaths();
    return {
      enabled: !!state.currentTask?.enableVideoCommentImage,
      paths: result
    };
  }
  function isVideoImageAttachmentActive() {
    if (local) {
      return local.image;
    }
    return isVideoCommentImageEnabled();
  }
  function pickVideoCommentImagePath() {
    const result = resolveVideoCommentImagePaths();
    if (!result.length) {
      return "";
    }
    if (hasAttachmentScope()) {
      const result = readRotationFromStorage("videoCommentImage");
      if (result != null) {
        state.videoCommentImageRotateIndex = result;
      }
    }
    const value = result[state.videoCommentImageRotateIndex % result.length];
    const value2 = state.videoCommentImageRotateIndex % result.length;
    state.videoCommentImageRotateIndex += 1;
    persistCommentAttachmentRotation();
    const local = value.split(/[/\\]/).pop() || value;
    console.log("[视频评论配图] 轮询 " + (value2 + 1) + "/" + result.length + ": " + local);
    return value;
  }
  function isCommentExpressionActive() {
    if (local) {
      return local.expression;
    }
    return isCommentExpressionEnabled();
  }
  function isVideoCommentExpressionActive() {
    if (local) {
      return local.expression;
    }
    return isVideoCommentExpressionEnabled();
  }
  function hasAnyCommentAttachment(flag = false) {
    if (flag) {
      return isVideoCommentImageEnabled() || isVideoCommentExpressionEnabled();
    } else {
      return isCommentImageEnabled() || isCommentExpressionEnabled();
    }
  }
  function hasCommentNonTextPayload(flag = false) {
    return hasAnyCommentAttachment(flag) || shouldUseCommentMentions(flag);
  }
  function applyAttachmentFallback(flag = false, options = {}) {
    if (!local) {
      return;
    }
    if (local.image || local.expression) {
      return;
    }
    const value = flag ? isVideoCommentImageEnabled() : isCommentImageEnabled();
    const value2 = flag ? isVideoCommentExpressionEnabled() : isCommentExpressionEnabled();
    if (!value && !value2) {
      return;
    }
    local = {
      image: !!value,
      expression: !value && !!value2
    };
    const result = describeAttachmentSceneLabel(flag, options);
    const value3 = local.image ? "图片" : "表情包";
    reportTraceLog("📎 " + result + "：正文为空，已强制附带" + value3 + "，避免空评论");
  }
  function describeActiveAttachments(flag = false) {
    const list = [];
    if (flag ? isVideoImageAttachmentActive() : isImageAttachmentActive()) {
      list.push("图片");
    }
    if (flag ? isVideoCommentExpressionActive() : isCommentExpressionActive()) {
      list.push("表情包");
    }
    if (shouldUseCommentMentions(flag)) {
      list.push("@账号");
    }
    if (list.length) {
      return list.join("+");
    } else {
      return "无正文内容";
    }
  }
  function findScrollableContainers(arg1) {
    if (!arg1) {
      return;
    }
    const result = [arg1.querySelector("[scrollable=\"true\"]"), ...Array.from(arg1.querySelectorAll("div")).filter(arg1 => {
      const result = window.getComputedStyle(arg1);
      return (result.overflowY === "auto" || result.overflowY === "scroll") && arg1.scrollHeight > arg1.clientHeight + 10;
    })].filter(Boolean);
    const value = result[0];
    if (!value) {
      return;
    }
    value.scrollTop = Math.min(value.scrollTop + 80, value.scrollHeight);
    value.dispatchEvent(new Event("scroll", {
      bubbles: false
    }));
  }
  function queryEmojiItemCandidates(arg1) {
    const result = getCommentV2String("emojiItemCandidates");
    if (!arg1 || !result) {
      return [];
    }
    try {
      return Array.from(arg1.querySelectorAll(result));
    } catch (error) {
      return [];
    }
  }
  function findEmojiStickerTarget(arg1, arg2) {
    const result = getCommentV2String("emojiStickerClickableRoot");
    const result2 = getCommentV2String("emojiStickerInteractiveRoot");
    if (!arg1 || !arg2 || !result || !result2) {
      return null;
    }
    try {
      const result3 = arg1.closest(result2);
      const local = result3 || arg1.closest(result) || arg1;
      if (arg2.contains(local)) {
        return local;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }
  function describeEmojiCandidate(arg1, arg2) {
    const result = findEmojiStickerTarget(arg1, arg2);
    if (!arg1 || !result || !isVisibleElement(arg1) || !isVisibleElement(result)) {
      return {
        item: arg1,
        target: result,
        visible: false,
        sticker: false,
        textEmoji: false
      };
    }
    const result2 = getV2Regex("emojiStickerSourcePattern");
    const result3 = getV2Regex("emojiTextSourcePattern");
    const result4 = getCommentV2String("emojiStickerInteractiveRoot");
    const local = Number(getCommentV2Number("emojiStickerMinImageSide")) || 0;
    const local2 = Number(getCommentV2Number("emojiStickerMinFillRatio")) || 0;
    if (!result2 || !result3 || !result4 || !(local > 0) || !(local2 > 0)) {
      return {
        item: arg1,
        target: result,
        visible: true,
        sticker: false,
        textEmoji: false
      };
    }
    try {
      const result5 = arg1.getBoundingClientRect();
      const result6 = result.getBoundingClientRect();
      const result7 = [arg1.getAttribute?.("src"), arg1.getAttribute?.("data-src"), arg1.getAttribute?.("style"), arg1.getAttribute?.("alt")].filter(Boolean).join(" ");
      const result8 = result2.test(result7);
      const result9 = result3.test(result7);
      const result10 = Math.min(result5.width, result5.height);
      const result11 = Math.min(result5.width / Math.max(result6.width, 1), result5.height / Math.max(result6.height, 1));
      const local3 = result.matches?.(result4) || false;
      const local4 = !result9 && (result8 || result10 >= local && result11 >= local2 && local3);
      return {
        item: arg1,
        target: result,
        visible: true,
        sticker: local4,
        textEmoji: !local4 && (result9 || result10 < local),
        sourceSticker: result8,
        sourceText: result9,
        side: result10,
        fillRatio: result11,
        explicitlyInteractive: local3
      };
    } catch (error) {
      return {
        item: arg1,
        target: result,
        visible: true,
        sticker: false,
        textEmoji: false
      };
    }
  }
  function dedupeEmojiCandidates(arg1, arg2) {
    const set = new Set();
    const list = [];
    for (const item of arg1) {
      if (!arg2(item) || !item.target || set.has(item.target)) {
        continue;
      }
      set.add(item.target);
      list.push(item.target);
    }
    return list;
  }
  function listVisibleEmojiCandidates(arg1) {
    return queryEmojiItemCandidates(arg1).map(arg12 => describeEmojiCandidate(arg12, arg1)).filter(arg1 => arg1.visible);
  }
  function listStickerEmojiCandidates(arg1) {
    return dedupeEmojiCandidates(listVisibleEmojiCandidates(arg1), arg1 => arg1.sticker);
  }
  function listTextEmojiCandidates(arg1) {
    return dedupeEmojiCandidates(listVisibleEmojiCandidates(arg1), arg1 => arg1.textEmoji);
  }
  function isEmojiItemClickable(arg1, arg2) {
    if (!arg1 || !isVisibleElement(arg1) || arg1.isConnected === false) {
      return false;
    }
    if (!arg2) {
      return true;
    }
    try {
      const result = arg1.getBoundingClientRect();
      const result2 = arg2.getBoundingClientRect();
      const value = Math.min(result.bottom, result2.bottom) - Math.max(result.top, result2.top);
      const value2 = Math.min(result.right, result2.right) - Math.max(result.left, result2.left);
      return value >= Math.min(Math.max(result.height, 1), 36) * 0.65 && value2 >= Math.min(Math.max(result.width, 1), 36) * 0.65;
    } catch (error) {
      return false;
    }
  }
  function listClickableStickerCandidates(arg1) {
    return listStickerEmojiCandidates(arg1).filter(arg12 => isEmojiItemClickable(arg12, arg1));
  }
  function listClickableTextEmojiCandidates(arg1) {
    return listTextEmojiCandidates(arg1).filter(arg12 => isEmojiItemClickable(arg12, arg1));
  }
  function collectEmojiPanelStats(arg1) {
    if (!arg1 || !getCommentV2String("emojiItemCandidates")) {
      return {
        matched: 0,
        excludedText: 0,
        visible: 0,
        clickable: []
      };
    }
    try {
      const result = queryEmojiItemCandidates(arg1);
      const result2 = listVisibleEmojiCandidates(arg1);
      const result3 = dedupeEmojiCandidates(result2, arg1 => arg1.sticker);
      return {
        matched: result.length,
        excludedText: result2.filter(arg1 => arg1.textEmoji).length,
        visible: result3.length,
        clickable: result3.filter(arg12 => isEmojiItemClickable(arg12, arg1))
      };
    } catch (error) {
      return {
        matched: 0,
        excludedText: 0,
        visible: 0,
        clickable: []
      };
    }
  }
  function formatEmojiPanelStats(arg1) {
    const result = collectEmojiPanelStats(arg1);
    return "匹配=" + result.matched + " 排除普通表情=" + result.excludedText + " 可见GIF=" + result.visible + " 可点击GIF=" + result.clickable.length;
  }
  function pickEmojiItem(arg1, arg2, arg3, options = {}) {
    const value = options.allowTextEmoji ? listClickableTextEmojiCandidates(arg1) : listClickableStickerCandidates(arg1);
    if (arg2 && arg2.isConnected !== false && value.includes(arg2) && isEmojiItemClickable(arg2, arg1)) {
      return arg2;
    }
    if (!value.length) {
      return null;
    }
    const result = Math.min(Math.max(Number(arg3) || 0, 0), value.length - 1);
    return value[result] || value[0];
  }
  async function clickEmojiControl(arg1, arg2, arg3, text = "表情面板控件") {
    if (!arg1 || !arg2 || arg1.isConnected === false || arg2.isConnected === false) {
      return false;
    }
    if (!isVisibleElement(arg1) || !isVisibleElement(arg2)) {
      return false;
    }
    try {
      if (!arg2.contains(arg1)) {
        return false;
      }
      const result = arg1.getBoundingClientRect();
      if (!(result.width > 1) || !(result.height > 1)) {
        return false;
      }
      const value = result.left + result.width / 2;
      const value2 = result.top + result.height / 2;
      const result2 = document.elementFromPoint(value, value2);
      if (!result2 || result2 !== arg1 && !arg1.contains(result2) && !result2.contains(arg1)) {
        reportEmojiDebug(text + " 实时位置未命中自身，取消点击 " + ("control=" + briefEl(arg1) + " hit=" + briefEl(result2)));
        return false;
      }
      reportEmojiDebug(text + " 按实时控件点击 " + (Math.round(result.width) + "x" + Math.round(result.height)) + ("@(" + Math.round(result.left) + "," + Math.round(result.top) + ") hit=" + briefEl(result2)));
    } catch (error) {
      return false;
    }
    const result = await simulateTrustedElementClick(arg1, arg3, text, {
      allowScrollIntoView: false,
      requireTargetHit: true,
      preferInner: "img, svg",
      waitForStableTarget: /表情包|贴纸/.test(text),
      targetStableTimeoutMs: 2400,
      traceToRunLog: true
    });
    return !!result && !shouldAbort(arg3);
  }
  function isEmojiItemReady(arg1) {
    if (!arg1 || arg1.isConnected === false || !isVisibleElement(arg1)) {
      return false;
    }
    const value = String(arg1.tagName || "").toUpperCase() === "IMG" ? arg1 : arg1.querySelector?.(getCommentV2String("emojiItemCandidates"));
    if (!value) {
      return true;
    }
    return value.complete !== false && Number(value.naturalWidth || 0) > 0;
  }
  async function waitForEmojiItemsReady(arg1, arg2, arg3, arg4, arg5, arg6, num = 10000) {
    const result = Date.now();
    let num2 = 0;
    let local = null;
    let num3 = 0;
    while (!shouldAbort(arg6) && Date.now() - result < num) {
      const local2 = findDouyinEmojiPanel(arg1) || arg2;
      if (local2 && isVisibleElement(local2)) {
        const result2 = pickEmojiItem(local2, arg3, arg4, arg5);
        const local3 = !!result2 && !!isEmojiItemClickable(result2, local2) && !!isEmojiItemReady(result2);
        if (local3) {
          if (local !== result2) {
            local = result2;
            num2 = Date.now();
          } else if (Date.now() - num2 >= 650) {
            return {
              panel: local2,
              item: result2,
              waitedMs: Date.now() - result
            };
          }
        } else {
          local = null;
          num2 = 0;
        }
      }
      if (Date.now() - num3 >= 2800) {
        num3 = Date.now();
        reportCurrentAction("等待收藏表情控件稳定就绪...");
      }
      await randomDelay(220, 380, arg6, "等待收藏表情控件稳定");
    }
    return {
      panel: findDouyinEmojiPanel(arg1) || arg2,
      item: null,
      waitedMs: Date.now() - result
    };
  }
  function resolveDraftEditorNode(arg1, arg2 = null) {
    if (arg1?.isConnected !== false && isVisibleElement(arg1)) {
      return arg1;
    }
    const result = [getCommentV2String("draftEditor"), "[contenteditable=\"true\"]"].filter(Boolean).join(", ");
    if (!result) {
      return arg1;
    }
    let list = [];
    try {
      list = Array.from(document.querySelectorAll(result)).filter(arg1 => arg1.isConnected !== false && isVisibleElement(arg1));
    } catch (error) {
      return arg1;
    }
    if (!list.length) {
      return arg1;
    }
    const local = arg2?.inputAnchor;
    if (!local) {
      return list[0];
    }
    list.sort((arg1, arg2) => {
      const result = arg1.getBoundingClientRect();
      const result2 = arg2.getBoundingClientRect();
      const result3 = Math.hypot(result.left + result.width / 2 - local.cx, result.top + result.height / 2 - local.cy);
      const result4 = Math.hypot(result2.left + result2.width / 2 - local.cx, result2.top + result2.height / 2 - local.cy);
      return result3 - result4;
    });
    return list[0] || arg1;
  }
  async function waitForDraftEditorReady(arg1, arg2, arg3, arg4, num = 12000) {
    const result = Date.now();
    let num2 = 0;
    let local = arg1;
    let local2 = arg2;
    let local3 = arg3;
    while (!shouldAbort(arg4) && Date.now() - result < num) {
      local2 = resolveDraftEditorNode(arg2, arg3);
      local3 = buildImageAttachScope(local2, {
        replyMode: !!arg3?.replyMode
      });
      local = snapshotComposerEmojiState(local2, local3);
      const local4 = local.payloadCount > (arg1?.payloadCount || 0) || local.textTokenCount > (arg1?.textTokenCount || 0);
      if (local4) {
        return {
          inserted: true,
          snap: local,
          inputEl: local2,
          scopeInfo: local3,
          waitedMs: Date.now() - result
        };
      }
      if (Date.now() - num2 >= 3000) {
        num2 = Date.now();
        reportCurrentAction("已选择表情，等待输入框生成预览...");
      }
      await randomDelay(240, 420, arg4, "等待表情插入输入框");
    }
    return {
      inserted: false,
      snap: local,
      inputEl: local2,
      scopeInfo: local3,
      waitedMs: Date.now() - result
    };
  }
  function findEmojiTriggerBtn(arg1, arg2 = null) {
    const value = arg2?.roots?.length ? [...arg2.roots] : [getCommentComposerRoot(arg1)].filter(Boolean);
    if (!arg2?.forbidGlobalFallback && !value.includes(document.body)) {
      value.push(document.body);
    }
    const local = arg1 => {
      if (arg1 && isVisibleElement(arg1)) {
        return arg1;
      }
      return null;
    };
    for (const item of value) {
      if (!item) {
        continue;
      }
      const result = getV2Regex("emojiTriggerSvgPattern");
      if (result) {
        const result2 = Array.from(item.querySelectorAll("svg"));
        const result3 = result2.find(arg1 => result.test(arg1.innerHTML || ""));
        if (result3) {
          const local2 = result3.closest("button, span, div[role=\"button\"]") || result3;
          const result = local(local2);
          if (result) {
            return result;
          }
        }
      }
      const value = typeof getCommentV2String === "function" ? getCommentV2String("emojiTrigger") : "";
      if (value) {
        let local2 = null;
        try {
          local2 = item.querySelector(value);
        } catch (error) {
          local2 = null;
        }
        const result = local(local2);
        if (result) {
          return result;
        }
      }
      const result2 = getV2Regex("emojiTriggerHintRegex");
      if (result2) {
        for (const item2 of item.querySelectorAll("button, div[role=\"button\"], span[role=\"button\"]")) {
          const result = [item2.getAttribute("aria-label"), item2.getAttribute("title"), item2.textContent].filter(Boolean).join(" ");
          if (result2.test(result)) {
            const result = local(item2);
            if (result) {
              return result;
            }
          }
        }
      }
    }
    return null;
  }
  function resolveValidatedEmojiPanel(arg1, arg2 = null) {
    const result = findDouyinEmojiPanel(arg1);
    if (!result || !isVisibleElement(result)) {
      return null;
    }
    const local = arg2 || findEmojiTriggerBtn(arg1);
    if (isValidEmojiPickerPanel(result, local)) {
      return result;
    } else {
      return null;
    }
  }
  async function ensureEmojiPanelOpen(arg1, arg2, arg3 = null) {
    const result = findEmojiTriggerBtn(arg1, arg3);
    let result2 = resolveValidatedEmojiPanel(arg1, result);
    if (result2) {
      return {
        panel: result2,
        emojiBtn: result,
        alreadyOpen: true,
        reason: "already_open"
      };
    }
    if (!result) {
      return {
        panel: null,
        emojiBtn: null,
        alreadyOpen: false,
        reason: "trigger_missing"
      };
    }
    const result3 = await simulateTrustedElementClick(result, arg2, "打开评论表情面板", {
      allowScrollIntoView: false
    });
    if (!result3) {
      result2 = resolveValidatedEmojiPanel(arg1, result);
      if (result2) {
        return {
          panel: result2,
          emojiBtn: result,
          alreadyOpen: false,
          reason: "opened_after_click"
        };
      }
      return {
        panel: null,
        emojiBtn: result,
        alreadyOpen: false,
        reason: "trigger_click_failed"
      };
    }
    for (let num = 0; num < 10; num++) {
      await randomDelay(220, 380, arg2);
      result2 = resolveValidatedEmojiPanel(arg1, result);
      if (result2) {
        return {
          panel: result2,
          emojiBtn: result,
          alreadyOpen: false,
          reason: "opened_after_click"
        };
      }
    }
    result2 = resolveValidatedEmojiPanel(arg1, result);
    if (!result2 && !shouldAbort(arg2)) {
      reportEmojiDebug("表情入口可信点击无页面响应，改用页面控件点击兜底");
      await simulateHumanClick(result, arg2, {
        deadlineAt: Date.now() + 1800
      });
      for (let num = 0; num < 6; num++) {
        await randomDelay(180, 300, arg2);
        result2 = resolveValidatedEmojiPanel(arg1, result);
        if (result2) {
          return {
            panel: result2,
            emojiBtn: result,
            alreadyOpen: false,
            reason: "opened_after_dom_fallback"
          };
        }
      }
    }
    return {
      panel: null,
      emojiBtn: result,
      alreadyOpen: false,
      reason: "open_timeout"
    };
  }
  async function resolveEmojiPanelTabs(arg1, arg2, arg3, arg4) {
    let local = arg2;
    let local2 = null;
    let list = [];
    for (let num = 0; num < 8; num += 1) {
      local = findDouyinEmojiPanel(arg1) || local;
      const result = resolveDouyinEmojiTabs(local, arg3);
      local2 = result.tabContainer;
      list = (result.tabs || []).filter(arg1 => arg1 && isVisibleElement(arg1) && !isEmojiTriggerCandidate(arg1, arg3));
      if (list.length >= 2) {
        break;
      }
      reportEmojiDebug("表情分类栏未就绪 attempt=" + (num + 1) + "/8 tabs=" + list.length);
      await randomDelay(280, 450, arg4, "等待表情分类栏出现");
    }
    if (list.length < 2) {
      return {
        panel: local,
        tabContainer: local2,
        tabs: list,
        items: [],
        checked: 0
      };
    }
    const result = Math.max(2500, Math.min(15000, Number(getCommentV2Number("emojiTabProbeTimeoutMs")) || 0));
    const result2 = list.map((arg1, arg2) => arg2).reverse();
    let num = 0;
    for (const item of result2) {
      if (shouldAbort(arg4)) {
        break;
      }
      local = findDouyinEmojiPanel(arg1) || local;
      const result3 = resolveDouyinEmojiTabs(local, arg3);
      const result4 = (result3.tabs || []).filter(arg1 => arg1 && isVisibleElement(arg1) && !isEmojiTriggerCandidate(arg1, arg3));
      const value = result4[item];
      if (!value) {
        continue;
      }
      num += 1;
      reportEmojiDebug("探测表情分类 " + num + "/" + result2.length + " " + ("" + (typeof describeDomControl === "function" ? describeDomControl(value) : briefEl(value))));
      const result5 = await clickEmojiControl(value, local, arg4, "评论表情分类Tab");
      if (!result5) {
        continue;
      }
      const result6 = Date.now();
      let num2 = 0;
      while (!shouldAbort(arg4) && Date.now() - result6 < result) {
        await randomDelay(260, 430, arg4, "等待表情分类内容");
        local = findDouyinEmojiPanel(arg1) || local;
        if (!local || !isVisibleElement(local)) {
          break;
        }
        let result5 = listClickableStickerCandidates(local);
        if (!result5.length && Date.now() - result6 > result * 0.45) {
          findScrollableContainers(local);
          result5 = listClickableStickerCandidates(local);
        }
        if (result5.length) {
          reportEmojiDebug("分类 " + (item + 1) + " 已识别贴纸控件: " + result5.length + " 项");
          return {
            panel: local,
            tabContainer: result3.tabContainer || local2,
            tabs: result4,
            tab: value,
            items: result5,
            checked: num
          };
        }
        if (Date.now() - num2 >= 2800) {
          num2 = Date.now();
          reportCurrentAction("正在检查表情分类 (" + num + "/" + result2.length + ")...");
        }
      }
      reportEmojiDebug("分类 " + (item + 1) + " 未出现贴纸控件：" + formatEmojiPanelStats(local));
    }
    return {
      panel: local,
      tabContainer: local2,
      tabs: list,
      items: [],
      checked: num
    };
  }
  async function performExpressionStickerAction(arg1, arg2, options = {}) {
    const flag = !!options.isVideoComment;
    const value = flag ? isVideoCommentExpressionActive() : isCommentExpressionActive();
    const value2 = flag ? clampSmallCount(state.currentTask?.videoCommentExpressionCount) : clampSmallCount(state.currentTask?.commentExpressionCount);
    if (!value) {
      return false;
    }
    const result = listMissingV2Keys();
    if (result.length) {
      const result2 = result.join(", ");
      console.warn("[评论表情包] runtime-config commentV2 缺少字段: " + result2);
      reportTraceLog("📎 " + describeAttachmentSceneLabel(flag, options) + "：后端表情控件配置不完整（" + result2 + "），已取消附加", null, "warning");
      return false;
    }
    reportEmojiDebug("开始附加 isVideoComment=" + flag + " 轮询上限=" + value2);
    const result2 = buildImageAttachScope(arg1, options);
    try {
      const result = await ensureEmojiPanelOpen(arg1, arg2, result2);
      let value = result.panel;
      if (!value) {
        const value = result.reason === "trigger_missing";
        console.warn(value ? "[评论表情包] 未找到表情按钮" : "[评论表情包] 表情面板超时未打开");
        reportTraceLog("📎 " + describeAttachmentSceneLabel(flag, options) + "：" + (value ? "未找到表情按钮" : "表情面板未能打开") + "，无法附加表情包", null, "warning");
        return false;
      }
      reportEmojiDebug(result.alreadyOpen ? "表情面板已打开，跳过入口点击" : "表情面板已通过入口打开");
      reportEmojiDebug("面板就绪: " + briefPanel(value));
      const local = !!options.profileFirst || !!options.profileVideo;
      let flag2 = false;
      let result3 = listClickableStickerCandidates(value);
      if (result3.length > 0) {
        const result = describeAttachmentSceneLabel(flag, options);
        reportEmojiDebug("当前分类已直接提供贴纸: " + result3.length + " 项，无需切换分类");
        reportTraceLog("📎 " + result + "：表情面板已就绪（可点击 " + result3.length + " 项），直接选择贴纸");
      } else {
        const result = findEmojiTriggerBtn(arg1, result2);
        const result4 = await resolveEmojiPanelTabs(arg1, value, result, arg2);
        value = result4.panel || value;
        result3 = result4.items || [];
        if (result3.length) {
          reportTraceLog("📎 " + describeAttachmentSceneLabel(flag, options) + "：已检查 " + result4.checked + " 个表情分类，找到 " + result3.length + " 个可点击贴纸");
        } else {
          const value2 = local ? listClickableTextEmojiCandidates(value) : [];
          if (value2.length) {
            result3 = value2;
            flag2 = true;
            reportTraceLog("📎 " + describeAttachmentSceneLabel(flag, options) + "：未检测到收藏贴纸，改用平台普通表情（可选 " + value2.length + " 项）", null, "warning");
          } else {
            const result2 = formatEmojiPanelStats(value);
            console.warn("[评论表情包] 已探测全部分类仍未找到贴纸 " + result2 + " " + briefPanel(value));
            dumpEmojiPanelTabCandidates(value, result, {
              traceToRunLog: true
            });
            reportTraceLog("📎 " + describeAttachmentSceneLabel(flag, options) + "：已检查 " + result4.checked + " 个表情分类，未识别到可点击贴纸（" + result2 + "）", null, "warning");
            return false;
          }
        }
      }
      result3 = flag2 ? listClickableTextEmojiCandidates(value) : listClickableStickerCandidates(value);
      if (result3.length === 0) {
        const result = formatEmojiPanelStats(value);
        console.warn("[评论表情包] 未找到可点击的贴纸/GIF（已忽略文字表情如[泣不成声]） " + result + " " + briefPanel(value));
        reportTraceLog("📎 " + describeAttachmentSceneLabel(flag, options) + "：无可用贴纸（" + result + "），已跳过", null, "warning");
        return false;
      }
      const result4 = nextRotateIndex(result3.length, value2, flag);
      const obj = {
        allowTextEmoji: flag2
      };
      let result5 = pickEmojiItem(value, result3[result4], result4, obj);
      const result6 = describeAttachmentSceneLabel(flag, options);
      reportEmojiDebug("点击表情项 #" + (result4 + 1) + "/" + Math.min(result3.length, value2) + " (当前可点" + result3.length + "项) " + (typeof describeDomControl === "function" ? describeDomControl(result5) : briefEl(result5)));
      for (let num = 0; num < 6; num += 1) {
        value = findDouyinEmojiPanel(arg1) || value;
        result5 = pickEmojiItem(value, result5, result4, obj);
        if (result5 && isEmojiItemClickable(result5, value)) {
          break;
        }
        findScrollableContainers(value);
        await randomDelay(160, 280, arg2, "滚动表情面板露出贴纸");
      }
      value = findDouyinEmojiPanel(arg1) || value;
      result5 = pickEmojiItem(value, result5, result4, obj);
      const result7 = await waitForEmojiItemsReady(arg1, value, result5, result4, obj, arg2, 10000);
      value = result7.panel || value;
      result5 = result7.item;
      if (!result5) {
        reportEmojiDebug("贴纸控件等待 " + result7.waitedMs + "ms 后仍未稳定 " + briefPanel(value));
        reportTraceLog("📎 " + result6 + "：贴纸控件未稳定就绪，已等待 " + Math.ceil(result7.waitedMs / 1000) + " 秒", null, "warning");
        return false;
      }
      let result8 = resolveDraftEditorNode(arg1, result2);
      let result9 = buildImageAttachScope(result8, {
        replyMode: !!result2?.replyMode
      });
      const result10 = snapshotComposerEmojiState(result8, result9);
      reportEmojiDebug("即将点击贴纸 " + (typeof describeDomControl === "function" ? describeDomControl(result5) : briefEl(result5)));
      const result11 = await clickEmojiControl(result5, value, arg2, "选择评论表情包");
      if (!result11) {
        reportTraceLog("📎 " + result6 + "：未点到贴纸，准备重试", null, "warning");
      }
      let result12 = await waitForDraftEditorReady(result10, result8, result9, arg2, 12000);
      let value3 = result12.inserted;
      let value4 = result12.snap;
      result8 = result12.inputEl || result8;
      result9 = result12.scopeInfo || result9;
      reportEmojiDebug("插入校验 payload " + (result10.payloadCount || 0) + "→" + (value4.payloadCount || 0) + (" 普通表情 " + (result10.textTokenCount || 0) + "→" + (value4.textTokenCount || 0)) + (" 等待=" + result12.waitedMs + "ms") + (" " + (value3 ? "通过" : "失败")));
      if (!value3) {
        const result = findDouyinEmojiPanel(result8);
        if (result && isVisibleElement(result)) {
          const result2 = await waitForEmojiItemsReady(result8, result, null, result4, obj, arg2, 8000);
          value = result2.panel || result;
          result5 = result2.item;
        } else {
          result5 = null;
          reportEmojiDebug("贴纸点击后面板已关闭，继续等待预览，不对失效节点补点");
        }
        if (result5 && !value3) {
          reportTraceLog("📎 " + result6 + "：首次点击未生效，重新解析贴纸控件后重试", null, "warning");
          const result = await clickEmojiControl(result5, value, arg2, "选择评论表情包");
          if (!result) {
            reportTraceLog("📎 " + result6 + "：重试未点到贴纸", null, "warning");
          }
          result12 = await waitForDraftEditorReady(result10, result8, result9, arg2, 10000);
          value3 = result12.inserted;
          value4 = result12.snap;
          result8 = result12.inputEl || result8;
          result9 = result12.scopeInfo || result9;
        }
      }
      if (!value3) {
        console.warn("[评论表情包] 表情包未插入输入框");
        reportTraceLog("📎 " + result6 + "：表情包点击后未检测到输入框内容", null, "warning");
        return false;
      }
      if (isVisibleElement(value)) {
        const result = findEmojiTriggerBtn(arg1, result2);
        if (result) {
          await simulateTrustedElementClick(result, arg2, "关闭评论表情面板", {
            allowScrollIntoView: false
          });
          await randomDelay(220, 380, arg2);
        }
      }
      reportEmojiDebug("附加成功");
      return true;
    } catch (error) {
      console.warn("[评论表情包] 附加表情包异常:", error.message || error);
      return false;
    }
  }
  function getCommentComposerRoot(arg1) {
    const local = getCommentV2String("commentInputShell") || getCommentV2String("commentInputShellLoose");
    if (local) {
      try {
        const local2 = arg1?.closest?.(local);
        if (local2) {
          return local2;
        }
      } catch (error) {}
    }
    return arg1?.closest?.("[class*=\"comment-compose\"]") || arg1?.parentElement;
  }
  function buildImageAttachScope(arg1, options = {}) {
    const result = getCommentComposerRoot(arg1);
    const result2 = (() => {
      try {
        const local = arg1?.getBoundingClientRect?.();
        if (!local || !(local.width > 0) || !(local.height > 0)) {
          return null;
        }
        return {
          cx: local.left + local.width / 2,
          cy: local.top + local.height / 2,
          width: local.width,
          height: local.height
        };
      } catch (error) {
        return null;
      }
    })();
    if (options.replyMode) {
      const list = [];
      if (result) {
        list.push(result);
      }
      let local = arg1;
      for (let num = 0; num < 10 && local && local !== document.body; num++) {
        if (!list.includes(local)) {
          list.push(local);
        }
        local = local.parentElement;
      }
      return {
        replyMode: true,
        roots: list,
        forbidGlobalFallback: true,
        inputAnchor: result2
      };
    }
    const list = [];
    let local = arg1;
    while (local && local !== document.body) {
      list.push(local);
      if (result && local === result) {
        break;
      }
      local = local.parentElement;
    }
    if (result && !list.includes(result)) {
      list.push(result);
    }
    return {
      replyMode: false,
      roots: list,
      forbidGlobalFallback: false,
      inputAnchor: result2
    };
  }
  function clearMarkedFileInputs() {
    document.querySelectorAll("input[type=\"file\"][data-radar-comment-file-input]").forEach(arg1 => {
      arg1.removeAttribute("data-radar-comment-file-input");
    });
  }
  function collectFileInputCandidates(arg1, arg2 = null) {
    const value = arg2?.roots?.length ? [...arg2.roots] : [getCommentComposerRoot(arg1)].filter(Boolean);
    if (!arg2?.forbidGlobalFallback && !value.includes(document.body)) {
      value.push(document.body);
    }
    const list = [];
    for (const item of value) {
      if (!item) {
        continue;
      }
      list.push(...Array.from(item.querySelectorAll("input[type=\"file\"]")));
    }
    return [...new Set(list)].find(arg1 => {
      if (arg2?.replyMode && arg2.roots?.length) {
        return arg2.roots.some(arg12 => arg12?.contains?.(arg1));
      }
      return true;
    }) || null;
  }
  function findCommentFileInput(arg1, arg2) {
    clearMarkedFileInputs();
    const result = collectFileInputCandidates(arg1, arg2);
    if (!result) {
      return false;
    }
    if (arg2.replyMode && arg2.roots?.length) {
      const result2 = arg2.roots.some(arg1 => arg1?.contains?.(result));
      if (!result2) {
        console.warn("[评论配图] 跳过 scope 外 file input（回复模式）");
        return false;
      }
    }
    result.setAttribute("data-radar-comment-file-input", "1");
    return true;
  }
  function collectCommentImageTriggerCandidates(arg1, arg2 = null) {
    const value = arg2?.roots?.length ? [...arg2.roots] : [getCommentComposerRoot(arg1)].filter(Boolean);
    const result = getV2StringOr("commentImageTriggers", ["[data-e2e=\"comment-image-upload\"]", "[data-e2e=\"comment-upload-image\"]", "[data-e2e=\"comment-picture-icon\"]", "[data-e2e*=\"comment\"][data-e2e*=\"image\"]", "[data-e2e*=\"comment\"][data-e2e*=\"picture\"]", "[data-e2e*=\"comment\"][data-e2e*=\"upload\"]"].join(", ")).split(",").map(arg1 => arg1.trim()).filter(Boolean);
    const list = [];
    const set = new Set();
    const local = (arg1, arg22) => {
      if (!arg1 || set.has(arg1) || !isVisibleElement(arg1)) {
        return;
      }
      if (arg2?.replyMode && arg2.roots?.length && !arg2.roots.some(arg12 => arg12?.contains?.(arg1))) {
        return;
      }
      set.add(arg1);
      list.push({
        el: arg1,
        reason: arg22
      });
    };
    for (const item of value) {
      for (const item2 of result) {
        item.querySelectorAll(item2).forEach(arg1 => local(arg1, item2));
      }
      item.querySelectorAll("button, div[role=\"button\"], span[role=\"button\"], label").forEach(arg1 => {
        const result = [arg1.getAttribute("aria-label"), arg1.getAttribute("title"), arg1.textContent].filter(Boolean).join(" ");
        if (/图片|相册|上传|photo|image/i.test(result)) {
          local(arg1, "hint");
        }
      });
    }
    return list;
  }
  async function clickCommentImageTrigger(arg1, arg2, arg3 = null) {
    const result = collectCommentImageTriggerCandidates(arg1, arg3);
    if (!result.length) {
      return false;
    }
    for (const {
      el: el,
      reason: reason
    } of result.slice(0, 4)) {
      console.log("[评论配图] 点击入口: " + reason);
      await simulateHumanClick(el, arg2);
      await randomDelay(350, 700, arg2);
      if (collectFileInputCandidates(arg1, arg3)) {
        return true;
      }
    }
    return !!collectFileInputCandidates(arg1, arg3);
  }
  function findComposerImagePreview(arg1, arg2 = null) {
    const value = arg2?.roots?.length ? arg2.roots : [getCommentComposerRoot(arg1)].filter(Boolean);
    for (const item of value) {
      if (!item) {
        continue;
      }
      const result = Array.from(item.querySelectorAll("img")).filter(arg1 => isVisibleElement(arg1)).filter(arg1 => {
        const local = arg1.getAttribute("src") || "";
        return local.startsWith("blob:") || local.startsWith("data:") || local.includes("douyin");
      });
      if (result.length > 0) {
        return true;
      }
      if (item.querySelector("[class*=\"upload\"][class*=\"preview\"], [class*=\"image\"][class*=\"preview\"]")) {
        return true;
      }
    }
    return false;
  }
  async function attachBase64ImageToFileInput(arg1, arg2) {
    const result = atob(arg2.base64);
    const value = new uint8Array(result.length);
    for (let num = 0; num < result.length; num++) {
      value[num] = result.charCodeAt(num);
    }
    const file = new File([value], arg2.name || "comment.jpg", {
      type: arg2.mime || "image/jpeg"
    });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    arg1.files = dataTransfer.files;
    arg1.dispatchEvent(new Event("input", {
      bubbles: true
    }));
    arg1.dispatchEvent(new Event("change", {
      bubbles: true
    }));
    return file;
  }
  async function dispatchPasteWithDataTransfer(arg1, arg2) {
    if (!arg1 || !arg2) {
      return false;
    }
    focusWithoutScroll(arg1);
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(arg2);
    return arg1.dispatchEvent(new clipboardEvent("paste", {
      bubbles: true,
      cancelable: true,
      clipboardData: dataTransfer
    })) !== false;
  }
  async function attachImagesToComment(arg1, arg2, options = {}) {
    let flag = false;
    let value = options.imagePath;
    let list = [];
    let flag2 = !!options.isVideoComment;
    if (flag2) {
      const result = getVideoCommentImageAttachmentInfo();
      flag = result.enabled;
      list = result.paths;
      if (!value) {
        value = pickVideoCommentImagePath();
      }
    } else {
      const result = getCommentImageAttachmentInfo();
      flag = result.enabled;
      list = result.paths;
      if (!value) {
        value = pickCommentImagePath();
      }
    }
    if (!flag || !value) {
      return {
        attached: false,
        skipped: true
      };
    }
    const result = buildImageAttachScope(arg1, options);
    const value2 = list.length > 1 ? ((flag2 ? state.videoCommentImageRotateIndex : state.commentImageRotateIndex) - 1 + list.length) % list.length + 1 : 0;
    const value3 = list.length > 1 ? " [" + value2 + "/" + list.length + "]" : "";
    console.log("%c[评论配图] 开始注入" + (result.replyMode ? "（回复）" : "") + value3 + ": " + value, "color: #38bdf8; font-weight: bold;");
    try {
      const result2 = await ipcRenderer.invoke("read-comment-image", value);
      if (!result2?.base64) {
        console.warn("[评论配图] 读取本地图片失败");
        return {
          attached: false,
          error: "read_failed"
        };
      }
      arg1?.focus?.();
      await randomDelay(400, 800, arg2);
      await clickCommentImageTrigger(arg1, arg2, result);
      await randomDelay(300, 600, arg2);
      findCommentFileInput(arg1, result);
      const result3 = await ipcRenderer.invoke("automation-attach-comment-image", {
        filePath: value,
        requireMarked: !!result.replyMode
      });
      if (result3?.ok) {
        await randomDelay(1500, 2500, arg2, "等待评论图片上传");
        if (findComposerImagePreview(arg1, result)) {
          console.log("%c[评论配图] CDP 注入成功", "color: #22c55e; font-weight: bold;");
          clearMarkedFileInputs();
          return {
            attached: true,
            method: "cdp",
            imagePath: value
          };
        }
      }
      let result4 = collectFileInputCandidates(arg1, result);
      if (!result4) {
        await clickCommentImageTrigger(arg1, arg2, result);
        await sleep(500);
        result4 = collectFileInputCandidates(arg1, result);
      }
      if (result4) {
        findCommentFileInput(arg1, result);
        const result3 = await attachBase64ImageToFileInput(result4, result2);
        await randomDelay(1200, 2200, arg2, "等待评论图片上传");
        if (findComposerImagePreview(arg1, result)) {
          clearMarkedFileInputs();
          return {
            attached: true,
            method: "data_transfer",
            imagePath: value
          };
        }
        await dispatchPasteWithDataTransfer(arg1, result3);
        await randomDelay(1200, 2000, arg2);
        if (findComposerImagePreview(arg1, result)) {
          clearMarkedFileInputs();
          return {
            attached: true,
            method: "paste",
            imagePath: value
          };
        }
      }
      clearMarkedFileInputs();
      console.warn("[评论配图] 未检测到图片预览，将仅发送文字");
      return {
        attached: false,
        error: "preview_not_found",
        imagePath: value
      };
    } catch (error) {
      clearMarkedFileInputs();
      console.warn("[评论配图] 异常:", error.message || error);
      return {
        attached: false,
        error: error.message || "unknown"
      };
    }
  }
  async function verifyCommentInputText(arg1, arg2, arg3) {
    if (!arg1 || !arg2) {
      return;
    }
    arg1.focus?.();
    await randomDelay(400, 700, arg3);
    const result = (arg1.innerText || arg1.textContent || "").trim();
    const result2 = arg2.slice(0, Math.min(8, arg2.length));
    if (result2 && !result.includes(result2)) {
      await insertTextIntoEditable(arg1, arg2, arg3);
      await randomDelay(400, 700, arg3);
    }
  }
  const list = [/发布评论失败/, /评论发布失败/, /无法评论/, /没有评论权限/, /不允许评论/, /关闭了评论/, /仅粉丝可评论/, /仅互关/, /发送失败/, /回复失败/, /操作太频繁/, /内容不符合.*规范/, /包含违规/, /审核未通过/, /请稍后再试/, /服务异常/, /网络异常/];
  const list2 = [/评论失败/];
  function isInsideCommentPanel(arg1) {
    if (!arg1?.closest) {
      return false;
    }
    const local = getCommentV2String("commentPanel") || platformSelectors["douyin.com"]?.commentPanel;
    const local2 = getCommentV2String("commentItem") || platformSelectors["douyin.com"]?.commentItem;
    const result = getCommentV2String("commentInputShell");
    const result2 = [local, local2, result, "[class*=\"comment-item\"], [class*=\"CommentList\"], [class*=\"comment-list\"]"].filter(Boolean);
    if (!result2.length) {
      return false;
    }
    try {
      return !!arg1.closest(result2.join(", "));
    } catch (error) {
      return false;
    }
  }
  function isCommentTextNode(arg1, arg2) {
    if (!arg1 || !arg2) {
      return false;
    }
    if (isInsideCommentPanel(arg1)) {
      return false;
    }
    if (arg2.length > 100) {
      return false;
    }
    if (arg1.children?.length > 10) {
      return false;
    }
    const result = arg2.replace(/\s+/g, " ").trim();
    const result2 = list.some(arg1 => arg1.test(result));
    if (result2) {
      return true;
    }
    const result3 = list2.some(arg1 => arg1.test(result));
    if (!result3) {
      return false;
    }
    const result4 = arg1.closest("[class*=\"toast\"], [class*=\"Toast\"], [class*=\"notice\"], [class*=\"Notice\"], [class*=\"notification\"], [class*=\"Notification\"], [role=\"alert\"], [aria-live=\"assertive\"]");
    return !!result4 && result.length <= 48;
  }
  function getCompactText(arg1) {
    return (arg1?.innerText || arg1?.textContent || "").replace(/\s+/g, "").trim();
  }
  function textMatchesTarget(arg1, arg2) {
    const result = getCompactText(arg1);
    const result2 = String(arg2 || "").replace(/\s+/g, "").trim();
    if (!result2 || !result) {
      return false;
    }
    if (result === result2) {
      return true;
    }
    if (commentDraftHasCoreTextLocal(result, result2)) {
      const value = result.length;
      const value2 = result2.length;
      if (value >= Math.min(value2, Math.max(4, Math.floor(value2 * 0.5))) && value <= Math.ceil(value2 * 1.35)) {
        return true;
      }
    }
    if (draftContainsText(result, result2) && result.length >= Math.min(result2.length, Math.max(6, Math.floor(result2.length * 0.85))) && result.length <= Math.ceil(result2.length * 1.2)) {
      return true;
    }
    return false;
  }
  async function resolveEditableTarget(arg1, arg2 = null) {
    if (!arg1) {
      return false;
    }
    let local = arg1;
    try {
      if (arg1.getAttribute?.("contenteditable") !== "true" && String(arg1.getAttribute?.("contenteditable") || "").toLowerCase() !== "plaintext-only" && !["INPUT", "TEXTAREA"].includes(arg1.tagName)) {
        local = arg1.querySelector?.("[contenteditable=\"true\"], [contenteditable=\"plaintext-only\"], textarea, input:not([type=\"file\"])") || arg1;
      }
    } catch (error) {}
    focusWithoutScroll(local);
    try {
      if (local.tagName === "TEXTAREA" || local.tagName === "INPUT") {
        const local2 = local.ownerDocument?.defaultView || window;
        const value = local.tagName === "TEXTAREA" ? Object.getOwnPropertyDescriptor(local2.HTMLTextAreaElement.prototype, "value")?.set : Object.getOwnPropertyDescriptor(local2.HTMLInputElement.prototype, "value")?.set;
        if (value) {
          value.call(local, "");
        } else {
          local.value = "";
        }
        local.dispatchEvent(new inputEvent("input", {
          bubbles: true,
          inputType: "deleteContentBackward"
        }));
        local.dispatchEvent(new Event("change", {
          bubbles: true
        }));
        return true;
      }
      const local2 = local.ownerDocument?.defaultView || window;
      const local3 = local2.getSelection?.();
      const result = document.createRange();
      result.selectNodeContents(local);
      local3?.removeAllRanges?.();
      local3?.addRange?.(result);
      let flag = false;
      try {
        flag = document.execCommand("delete", false);
      } catch (error) {}
      if (!flag) {
        try {
          document.execCommand("selectAll", false);
          flag = document.execCommand("delete", false);
        } catch (error) {}
      }
      if (!flag) {
        try {
          local.textContent = "";
        } catch (error) {}
        try {
          local.innerHTML = "";
        } catch (error) {}
      }
      local.dispatchEvent(new inputEvent("input", {
        bubbles: true,
        inputType: "deleteContentBackward"
      }));
      if (arg2 != null) {
        await randomDelay(60, 120, arg2);
      }
      return true;
    } catch (error) {
      return false;
    }
  }
  function composerHasAttachmentContent(arg1, arg2 = null) {
    try {
      if (findComposerImagePreview(arg1, arg2)) {
        return true;
      }
    } catch (error) {}
    try {
      const result = snapshotComposerEmojiState(arg1, arg2);
      return (result.payloadCount || 0) > 0 || (result.textTokenCount || 0) > 0;
    } catch (error) {}
    return false;
  }
  async function attachExpressionWithRetry(arg1, arg2, options = {}, num = 3) {
    for (let num2 = 1; num2 <= num; num2++) {
      const result = await performExpressionStickerAction(arg1, arg2, options);
      if (result) {
        return true;
      }
      if (composerHasAttachmentContent(arg1, buildImageAttachScope(arg1, options))) {
        reportEmojiDebug("附加函数未返回 true，但输入框已检测到表情内容（第 " + num2 + " 次）");
        return true;
      }
      if (num2 < num) {
        reportTraceLog("📎 " + describeAttachmentSceneLabel(!!options.isVideoComment, options) + "：表情包附加失败，" + (num2 + 1) + "/" + num + " 次重试…", null, "warning");
        await randomDelay(700, 1200, arg2, "表情包附加重试");
      }
    }
    return false;
  }
  function draftHasAnyContent(arg1, text = "", arg3 = null) {
    if (String(text || "").trim()) {
      return true;
    }
    if (getCompactText(arg1)) {
      return true;
    }
    return composerHasAttachmentContent(arg1, arg3);
  }
  function draftContainsText(arg1, arg2) {
    if (commentDraftHasCoreTextLocal(arg1, arg2)) {
      return true;
    }
    const local = arg1 => (arg1 || "").replace(/\s+/g, "").trim();
    const result = local(arg1);
    const result2 = local(arg2);
    if (!result || !result2) {
      return false;
    }
    if (result.length >= 4 && result2.includes(result)) {
      return true;
    }
    if (result2.length >= 4 && result.includes(result2)) {
      return true;
    }
    const result3 = Math.min(8, result.length, result2.length);
    return result3 >= 4 && result.slice(0, result3) === result2.slice(0, result3);
  }
  function collectPageNicknameCandidates() {
    const set = new Set(["已登录(待识别)", "主账号", "默认账号", "本账号", "未知账号", "我的", "登录"]);
    const list = [];
    const local = arg1 => {
      const result = String(arg1 || "").trim().replace(/\s+/g, " ");
      if (!result || result.length < 2 || result.length > 40 || set.has(result)) {
        return;
      }
      if (!list.includes(result)) {
        list.push(result);
      }
    };
    try {
      local(window._radar_account_name);
    } catch (error) {}
    try {
      local(state.currentTask?.nickname);
    } catch (error) {}
    try {
      local(state.currentTask?.name);
    } catch (error) {}
    try {
      local(state.currentTask?.accountName);
    } catch (error) {}
    try {
      local(getMyNickname());
    } catch (error) {}
    return list[0] || "";
  }
  function isCommentNodeStillValid(arg1, arg2) {
    if (!arg1) {
      return false;
    }
    if (arg1.isConnected === false) {
      try {
        const result = findVisibleMainCommentInput(document.body);
        if (!result) {
          return true;
        }
        return isCommentNodeStillValid(result, arg2);
      } catch (error) {
        return true;
      }
    }
    const result = getCompactText(arg1);
    const result2 = (arg2 || "").replace(/\s+/g, "").trim();
    if (!result2) {
      return !result && !composerHasAttachmentContent(arg1);
    }
    if (!result) {
      return true;
    }
    if (result.length <= Math.max(2, Math.floor(result2.length * 0.2))) {
      return true;
    }
    return !draftContainsText(result, result2);
  }
  function dispatchPointerPress(arg1) {
    if (!arg1) {
      return;
    }
    try {
      arg1.dispatchEvent(new pointerEvent("pointerdown", {
        bubbles: true,
        cancelable: true
      }));
      arg1.dispatchEvent(new mouseEvent("mousedown", {
        bubbles: true,
        cancelable: true
      }));
      arg1.dispatchEvent(new pointerEvent("pointerup", {
        bubbles: true,
        cancelable: true
      }));
      arg1.dispatchEvent(new mouseEvent("mouseup", {
        bubbles: true,
        cancelable: true
      }));
      arg1.dispatchEvent(new mouseEvent("click", {
        bubbles: true,
        cancelable: true
      }));
    } catch (error) {}
    try {
      arg1.click?.();
    } catch (error) {}
  }
  async function clickTargetAndSettle(arg1, arg2, arg3, arg4, arg5, options = {}) {
    const local = options.scope || document.body;
    const result = Math.max(500, Number(options.waitMs) || 1200);
    const value = options.allowRetry !== false;
    if (!arg1 || shouldAbort(arg4)) {
      return {
        clicked: false,
        settled: false,
        published: false
      };
    }
    const local2 = () => {
      if (isCommentNodeStillValid(arg2, arg3)) {
        return true;
      }
      try {
        if (isSelfCommentPresent(arg3, local)) {
          return true;
        }
      } catch (error) {}
      return false;
    };
    try {
      arg2?.focus?.({
        preventScroll: true
      });
    } catch (error) {
      try {
        arg2?.focus?.();
      } catch (error) {}
    }
    await sleep(80);
    await simulateTrustedElementClick(arg1, arg4, arg5);
    const value2 = Date.now() + result;
    while (Date.now() < value2) {
      if (shouldAbort(arg4)) {
        break;
      }
      if (local2()) {
        return {
          clicked: true,
          settled: true,
          published: true
        };
      }
      await sleep(120);
    }
    if (local2()) {
      return {
        clicked: true,
        settled: true,
        published: true
      };
    }
    if (!textMatchesTarget(arg2, arg3)) {
      const result = getCompactText(arg2);
      if (isCommentDraftOnlyEmojiDriftLocal(result, arg3)) {
        reportCommentFlowTrace("草稿仅表情漂移", "核心文案仍在，继续补点");
      } else {
        reportCommentFlowTrace("跳过补点", "草稿已变化且未见失败，视为发送中/已发出");
        return {
          clicked: true,
          settled: true,
          published: false,
          softSettled: true
        };
      }
    }
    if (!value || shouldAbort(arg4)) {
      return {
        clicked: true,
        settled: false,
        published: false
      };
    }
    const local3 = collectScrollRoots(arg2) || arg1;
    if (!local3) {
      return {
        clicked: true,
        settled: false,
        published: false
      };
    }
    reportCommentFlowTrace("发送钮补点", "等待后草稿仍在且评论区未见，补点并派发合成点击");
    await simulateTrustedElementClick(local3, arg4, arg5 + "补点");
    dispatchPointerPress(local3);
    await sleep(450);
    if (local2()) {
      return {
        clicked: true,
        settled: true,
        published: true
      };
    }
    if (options.enterFallback !== false && arg2 && !shouldAbort(arg4)) {
      reportCommentFlowTrace("发送钮未清空，回车兜底");
      try {
        arg2.focus?.({
          preventScroll: true
        });
      } catch (error) {
        try {
          arg2.focus?.();
        } catch (error) {}
      }
      await sleep(120);
      const result = await simulateTrustedEnter(arg2, arg4, arg5 + "回车兜底");
      if (!result) {
        try {
          const obj = {
            bubbles: true,
            cancelable: true,
            keyCode: 13,
            key: "Enter",
            code: "Enter"
          };
          arg2.dispatchEvent(new keyboardEvent("keydown", obj));
          arg2.dispatchEvent(new keyboardEvent("keypress", obj));
          arg2.dispatchEvent(new keyboardEvent("keyup", obj));
        } catch (error) {}
      }
      await sleep(450);
    }
    return {
      clicked: true,
      settled: local2(),
      published: (() => {
        try {
          return isSelfCommentPresent(arg3, local);
        } catch (error) {
          return false;
        }
      })()
    };
  }
  function findVisibleMainCommentInput(arg1 = document.body) {
    try {
      const local = resolveCommentPanelRoot(arg1) || arg1 || document.body;
      const result = mergeCommentSelectors(getMergedCommentInputSelector(), getDraftEditorSelector(), getMainCommentInputShellSelector());
      if (!result || !local?.querySelectorAll) {
        return null;
      }
      return Array.from(local.querySelectorAll(result)).find(arg1 => isVisibleElement(arg1)) || null;
    } catch (error) {
      return null;
    }
  }
  function isSelfCommentPresent(arg1, arg2 = document.body) {
    const local = resolveCommentPanelRoot(arg2) || arg2 || document.body;
    const result = collectPageNicknameCandidates();
    const result2 = queryCommentItemNodes(local);
    const result3 = (arg1 || "").replace(/\s+/g, "").trim().slice(0, 12);
    if (!result3) {
      return false;
    }
    const local2 = arg12 => {
      for (const item of result2) {
        const result2 = (item.innerText || item.textContent || "").replace(/\s+/g, " ").trim();
        if (!result2) {
          continue;
        }
        if (arg12 && result && !result2.includes(result)) {
          continue;
        }
        if (draftContainsText(result2, arg1)) {
          return true;
        }
      }
      return false;
    };
    if (local2(true)) {
      return true;
    }
    if (result && result3.length >= 8 && local2(false)) {
      console.log("[Built-in-Debug] [主贴评论] 评论区正文已命中，但未匹配本账号昵称，仍视为已发表");
      return true;
    }
    return false;
  }
  async function waitForSelfComment(arg1, arg2, arg3 = document.body) {
    const local = !!arg1 && arg1.isConnected !== false;
    if (local && isCommentNodeStillValid(arg1, arg2)) {
      return true;
    }
    await sleep(500);
    const local2 = !!arg1 && arg1.isConnected !== false;
    if (local2 && isCommentNodeStillValid(arg1, arg2)) {
      return true;
    }
    if (isSelfCommentPresent(arg2, arg3)) {
      return true;
    }
    if (!local2) {
      const result = findVisibleMainCommentInput(arg3);
      if (result && isCommentNodeStillValid(result, arg2)) {
        return true;
      }
      if (isSelfCommentPresent(arg2, arg3)) {
        return true;
      }
    }
    return false;
  }
  async function confirmCommentSent(arg1, arg2, arg3, arg4 = document.body) {
    if (arg3?.success) {
      return true;
    }
    if (!arg3?.sendDispatched || arg3?.failureToast) {
      return false;
    }
    return waitForSelfComment(arg1, arg2, arg4);
  }
  function detectVisibleToast() {
    const list3 = ["[class*=\"toast\"]", "[class*=\"Toast\"]", "[class*=\"notice\"]", "[class*=\"Notice\"]", "[class*=\"notification\"]", "[class*=\"Notification\"]", "[role=\"alert\"]", "[aria-live=\"assertive\"]", "[aria-live=\"polite\"]"];
    const list4 = [];
    for (const item of list3) {
      try {
        list4.push(...document.querySelectorAll(item));
      } catch (error) {}
    }
    const result = Array.from(new Set(list4));
    for (const item of result) {
      if (!isVisibleElement(item) || !isElementInViewport(item, 0)) {
        continue;
      }
      const result = (item.innerText || item.textContent || "").replace(/\s+/g, " ").trim();
      if (!result) {
        continue;
      }
      if (!isCommentTextNode(item, result)) {
        continue;
      }
      const result2 = [...list, ...list2].find(arg1 => arg1.test(result));
      if (result2) {
        return {
          text: clipTraceText(result, 80),
          pattern: result2.source,
          ...classifyCommentFailureToastLocal(result)
        };
      }
    }
    return null;
  }
  async function waitForToast(num = 4500) {
    const value = Date.now() + num;
    while (Date.now() < value) {
      const result = detectVisibleToast();
      if (result) {
        return result;
      }
      await sleep(180);
    }
    return null;
  }
  function handleCommentFailureToast(arg1, arg2, arg3 = null) {
    const local = arg2 || state.activeLoopId || state.currentTask?.taskId;
    const result = clipTraceText(arg1 || "发布评论失败", 80);
    const local2 = arg3 || classifyCommentFailureToastLocal(arg1);
    if (!local || local === "BATCH") {
      return;
    }
    if (state.commentFailureStoppedTaskId === local) {
      return;
    }
    const local3 = window._radar_account_id || state.currentTask?.accountId || sessionStorage.getItem("radar_account_id") || "default";
    const local4 = typeof local === "string" && local.startsWith("MONITOR");
    const local5 = local4 || local === "SELF_WARMUP";
    if (!local2.stopAccount) {
      const value = "⚠️ 本条评论失败：" + (local2.label || result) + "（" + local2.code + "）。跳过本条，任务继续。";
      console.warn("[Built-in-Debug] [评论失败] " + value);
      reportTraceLog(value, local3, "warning");
      return;
    }
    state.commentFailureStoppedTaskId = local;
    const value = local5 ? "⚠️ 互动回复失败：" + result + "。本次动作已取消，后续任务将继续。" : "⚠️ 检测到评论发布失败：" + result + "。当前账号任务已停止，请稍后手动检查账号状态。";
    console.warn("[Built-in-Debug] [账号停用] " + value);
    reportTraceLog(value, local3, "warning");
    if (local5) {
      return;
    }
    try {
      ipcRenderer.send("automation-data", {
        type: "current-action",
        payload: {
          accountId: local3,
          action: "账号已停止：评论发布失败（" + result + "）",
          level: "warning"
        }
      });
      ipcRenderer.send("automation-data", {
        type: "status",
        payload: {
          accountId: local3,
          status: "finished"
        }
      });
    } catch (error) {}
    state.pausedForSubview = false;
    state.stopRequested = true;
    state.taskRunning = false;
    state.currentRunningSource = null;
    resetScrapeAiQueueOnStop();
    try {
      ipcRenderer.send("task-finished", buildTaskFinishedPayload(local, "comment_publish_failed"));
    } catch (error) {}
  }
  function describeReplyEnvironment(arg1) {
    try {
      const result = getCommentV2String("commentInput");
      const value = result ? Array.from(document.querySelectorAll(result)).filter(isVisibleElement) : [];
      const result2 = Array.from(document.querySelectorAll("span, a, button, div[role=\"button\"]")).filter(arg1 => isVisibleElement(arg1) && isReplyBtnText((arg1.textContent || "").trim()));
      return ["viewport=" + window.innerWidth + "x" + window.innerHeight, "visibility=" + document.visibilityState, "focused=" + (document.hasFocus?.() !== false), "targetConnected=" + !!arg1?.isConnected, "replyButtons=" + result2.length, "inputs=" + value.length, "active=" + (document.activeElement?.tagName || "none"), "native=" + state.lastTrustedClickDiagnostic].join(" ");
    } catch (error) {
      return "diagnostic_failed=" + clipTraceText(error?.message || error, 50);
    }
  }
  function buildReplyFailureResult(arg1, arg2, arg3 = null, text = "") {
    const result = describeReplyEnvironment(arg3);
    const local = arg2 || arg1 || "回复失败";
    console.warn("[Built-in-Debug] [回复失败] code=" + arg1 + " error=" + local + " " + result + (text ? " detail=" + text : ""));
    reportTraceLog("💬 回复失败：" + local + (text ? "（" + clipTraceText(text, 60) + "）" : ""), null, "warning");
    return {
      success: false,
      error: local,
      errorCode: arg1 || "reply_failed",
      diagnostic: result,
      detail: text || "",
      selfLiked: false
    };
  }
  async function sendReplyToComment(arg1, arg2, arg3, options = {}) {
    if (!arg1) {
      return {
        success: false,
        error: "missing_input"
      };
    }
    const result = Date.now();
    let flag = false;
    const result2 = String(arg2 || "");
    const local = result2.trim() || describeActiveAttachments(!!options.isVideoComment);
    reportCommentFlowTrace("开始录入发表", "内容「" + clipTraceText(local, 20) + "」");
    await simulateTrustedElementClick(arg1, arg3, "主评编辑器", {
      allowScrollIntoView: false
    });
    await randomDelay(600, 1200, arg3);
    const result3 = buildImageAttachScope(arg1, {
      replyMode: false
    });
    const result4 = findEmojiTriggerBtn(arg1, result3);
    const local2 = collectCommentImageTriggerCandidates(arg1, result3)[0]?.el;
    const obj = {
      ...result3,
      emojiBtnCache: result4,
      imageBtnCache: local2
    };
    const result5 = result2.replace(/\s+/g, "").trim();
    let flag2 = !!options.resendOnly;
    if (!flag2 && result5 && textMatchesTarget(arg1, result2)) {
      flag2 = true;
    }
    if (flag2) {
      reportCommentFlowTrace("跳过重录", "输入框已有目标文案，直接尝试发送");
    } else if (getCompactText(arg1)) {
      const value = getCompactText(arg1).length;
      reportCommentFlowTrace("清空残留草稿", "原有约 " + value + " 字，避免重试叠字");
      await resolveEditableTarget(arg1, arg3);
      await randomDelay(200, 400, arg3);
    }
    const local3 = shouldUseCommentMentions(!!options.isVideoComment) && resolveCommentMentionPosition(!!options.isVideoComment) === "before";
    const local4 = !!options.attachCommentExpression && (options.isVideoComment ? isVideoCommentExpressionActive() : isCommentExpressionActive());
    const local5 = !result2.trim() && local4;
    if (!flag2 && !local3 && !local5) {
      try {
        if (result4) {
          await simulateHumanClick(result4, arg3);
          await randomDelay(500, 900, arg3);
          focusWithoutScroll(arg1);
        }
      } catch (error) {}
    } else if (!flag2) {
      reportMentionDebug(local5 ? "纯表情空文案：跳过录入前面板预打开，附加阶段再打开" : "正文前 @：跳过表情诱导点击，避免干扰 @ 按钮定位", true);
    }
    if (!flag2) {
      const result3 = await composeCommentInputWithMentions(arg1, result2, arg3, {
        isVideoComment: !!options.isVideoComment,
        mentionPosition: options.mentionPosition,
        replyMode: false,
        scopeInfo: obj
      });
      if (!result3) {
        console.warn("[Built-in-Debug] [主贴评论] insertTextIntoEditable 失败");
        reportCommentFlowTrace("录入失败", "insertTextIntoEditable 返回 false", "warning");
        return {
          success: false,
          error: "input_failed"
        };
      }
      reportCommentFlowTrace(result2.trim() ? "文案录入完成" : "正文为空，等待附带内容", "耗时 " + ((Date.now() - result) / 1000).toFixed(1) + "s");
    }
    await randomDelay(800, 1200, arg3);
    const result6 = (arg1.innerText || arg1.textContent || "").replace(/\s/g, "").trim();
    const result7 = result2.replace(/\s/g, "").trim();
    if (result7.length > 0 && result6.length < Math.min(2, result7.length)) {
      console.warn("[Built-in-Debug] [主贴评论] 录入校验未通过: 期望=\"" + result2.slice(0, 24) + "\" 实际=\"" + (arg1.innerText || "").slice(0, 24) + "\"");
      reportCommentFlowTrace("录入校验未通过", "期望" + result7.length + "字 实际" + result6.length + "字", "warning");
      return {
        success: false,
        error: "input_verify_failed"
      };
    }
    let flag3 = false;
    let flag4 = false;
    const local6 = !!options.attachCommentExpression && (options.isVideoComment ? isVideoCommentExpressionActive() : isCommentExpressionActive());
    if (options.attachCommentImage && (options.isVideoComment ? isVideoImageAttachmentActive() : isImageAttachmentActive())) {
      const result = await attachImagesToComment(arg1, arg3, {
        replyMode: false,
        isVideoComment: !!options.isVideoComment
      });
      flag3 = !!result?.attached;
      if (result2.trim()) {
        await verifyCommentInputText(arg1, result2, arg3);
      }
      await randomDelay(500, 900, arg3);
    }
    if (local6) {
      const flag = !result2.trim();
      if (flag) {
        reportCommentFlowTrace("开始附加表情包", "正文为空，需附带内容");
      }
      focusWithoutScroll(arg1);
      await randomDelay(200, 400, arg3);
      const value = flag ? 4 : 3;
      flag4 = await attachExpressionWithRetry(arg1, arg3, {
        isVideoComment: !!options.isVideoComment,
        replyMode: false,
        profileFirst: !!options.profileVideo || !!options.profileFirst,
        profileVideo: !!options.profileVideo
      }, value);
      if (!flag4 && flag) {
        flag4 = composerHasAttachmentContent(arg1, obj);
        if (flag4) {
          reportCommentFlowTrace("表情包校验", "附加重试后输入框已检测到表情内容");
        } else {
          reportCommentFlowTrace("表情包附加失败", "输入框仍为空，将取消发送", "warning");
        }
      } else if (flag4) {
        reportCommentFlowTrace("表情包附加成功", "");
      }
      await randomDelay(500, 900, arg3);
    }
    if (local6 && !flag4) {
      const result = describeAttachmentSceneLabel(!!options.isVideoComment, options);
      console.warn("[Built-in-Debug] [" + result + "] 已选择附带表情包，但插入未确认，取消本次发送");
      reportCommentFlowTrace("取消发送", "已选择附带表情包，但输入框未确认插入；不降级为纯文字", "warning");
      return {
        success: false,
        error: "comment_expression_attach_failed",
        errorCode: "comment_expression_attach_failed"
      };
    }
    const result8 = await appendCommentMentionsAfterAttachments(arg1, arg3, {
      isVideoComment: !!options.isVideoComment,
      mentionPosition: options.mentionPosition,
      replyMode: false,
      scopeInfo: obj
    });
    const local7 = draftHasAnyContent(arg1, result2, obj) || flag3 || flag4 || !!result8?.attached;
    if (!local7) {
      const local = [options.attachCommentImage ? "图片" : "", options.attachCommentExpression ? "表情包" : ""].filter(Boolean).join("+") || "无";
      console.warn("[Built-in-Debug] [主贴评论] 正文为空且未检测到图片/表情/@，取消发送（计划附带: " + local + "）");
      reportCommentFlowTrace("取消发送", "正文为空且未检测到图片/表情/@（计划附带: " + local + "）", "warning");
      return {
        success: false,
        error: "empty_comment_payload"
      };
    }
    const local8 = !!options.profileVideo || !!options.useReplyConfig;
    const value = local8 ? 2800 : 1200;
    await sleep(200);
    let result9 = collectScrollRoots(arg1);
    if (!result9) {
      await sleep(200);
      result9 = collectScrollRoots(arg1);
    }
    if (result9) {
      console.log("[Built-in-Debug] [主贴评论] 优先命中发送/发布图标按钮，执行点击");
      reportCommentFlowTrace("点击发送按钮");
      await clickTargetAndSettle(result9, arg1, result2, arg3, "主评发送按钮", {
        scope: options.publishScope || options.scope || document.body,
        waitMs: value
      });
    } else {
      console.log("[Built-in-Debug] [主贴评论] 未找到常规发送按钮，自动开启 Enter 键盘事件保底发送");
      reportCommentFlowTrace("尝试通用发送保底");
      const result = (() => {
        try {
          return arg1.getBoundingClientRect();
        } catch (error) {
          return null;
        }
      })();
      const result3 = (() => {
        try {
          const result2 = Array.from(document.querySelectorAll("button, [role=\"button\"], div, span")).filter(arg1 => {
            if (!isInInteractableArea(arg1, result)) {
              return false;
            }
            const result2 = String(arg1.textContent || "").replace(/\s+/g, "").trim();
            return getPublishBtnTexts().includes(result2) && (arg1.children?.length || 0) <= 4;
          });
          return result2[0] || null;
        } catch (error) {
          return null;
        }
      })();
      if (result3) {
        reportCommentFlowTrace("命中通用发布按钮", "文案: \"" + result3.textContent?.trim() + "\"");
        await clickTargetAndSettle(result3, arg1, result2, arg3, "通用发布按钮", {
          scope: options.publishScope || options.scope || document.body,
          waitMs: value
        });
      }
      if (!isCommentNodeStillValid(arg1, result2) && !isSelfCommentPresent(result2, options.publishScope || options.scope || document.body)) {
        focusWithoutScroll(arg1);
        await sleep(150);
        const result = await simulateTrustedEnter(arg1, arg3, "主评编辑器");
        await sleep(450);
        if (!result && !isCommentNodeStillValid(arg1, result2) && !isSelfCommentPresent(result2, options.publishScope || options.scope || document.body)) {
          const result = collectScrollRoots(arg1);
          if (result) {
            reportCommentFlowTrace("回车未生效，改点发送图标");
            await clickTargetAndSettle(result, arg1, result2, arg3, "主评发送按钮(回车后)", {
              scope: options.publishScope || options.scope || document.body,
              allowRetry: false
            });
          } else {
            try {
              const obj = {
                bubbles: true,
                cancelable: true,
                keyCode: 13,
                key: "Enter",
                code: "Enter"
              };
              arg1.dispatchEvent(new keyboardEvent("keydown", obj));
              arg1.dispatchEvent(new keyboardEvent("keypress", obj));
              arg1.dispatchEvent(new keyboardEvent("keyup", obj));
            } catch (error) {}
          }
        }
      }
    }
    flag = true;
    reportCommentFlowTrace("已触发发送", "正在确认是否发布成功…");
    const local9 = options.publishScope || options.scope || document.body;
    try {
      const result3 = await waitForToast(local8 ? 5500 : 4500);
      if (result3) {
        const result = await waitForSelfComment(arg1, result2, local9);
        if (result) {
          reportCommentFlowTrace("检测到提示但评论区已出现，视为发表成功", clipTraceText(result3.text, 40));
          reportTraceLog("📝 视频主评：评论已发表 →「" + clipTraceText(local, 32) + "」");
          return {
            success: true,
            sendDispatched: flag,
            verifiedDespiteToast: true
          };
        }
        const result4 = classifyCommentFailureToastLocal(result3.text);
        console.warn("[Built-in-Debug] [主贴评论] 检测到失败提示: " + result3.text + " (" + result4.code + ")");
        reportCommentFlowTrace("检测到失败提示", clipTraceText(result3.text, 40) + " → " + result4.label, "warning");
        handleCommentFailureToast(result3.text, arg3, result4);
        return {
          success: false,
          error: result3.text,
          errorCode: result4.code,
          failureToast: result3,
          sendDispatched: flag,
          stopAccount: !!result4.stopAccount
        };
      }
      const value = local8 ? 1800 + Math.floor(Math.random() * 900) : 800 + Math.floor(Math.random() * 701);
      reportCommentFlowTrace("等待评论生效 " + (value / 1000).toFixed(1) + "s");
      await sleep(value);
      let result4 = await waitForSelfComment(arg1, result2, local9);
      if (!result4 && flag) {
        const value = local8 ? 6 : 3;
        const value2 = local8 ? 3500 : 3000;
        for (let num = 1; num <= value && !result4; num += 1) {
          reportCommentFlowTrace("发表延迟确认", "第 " + num + "/" + value + " 次轮询评论区（间隔 " + (value2 / 1000).toFixed(1) + " 秒）…");
          await sleep(value2);
          result4 = await waitForSelfComment(arg1, result2, local9);
        }
      }
      let result5 = isCommentNodeStillValid(arg1, result2);
      if (!result5 && arg1 && arg1.isConnected === false) {
        const result = findVisibleMainCommentInput(local9);
        result5 = !!result && !!isCommentNodeStillValid(result, result2);
      }
      if (result4) {
        reportTraceLog("📝 视频主评：评论已发表 →「" + clipTraceText(local, 32) + "」");
        return {
          success: true,
          sendDispatched: flag,
          verified: true
        };
      }
      if (flag && result5) {
        reportCommentFlowTrace("容错判定", "输入框已清空且未弹出失败提示，判定为已成功发表");
        reportTraceLog("📝 视频主评：评论已提交 →「" + clipTraceText(local, 32) + "」");
        return {
          success: true,
          sendDispatched: flag,
          verifiedInferred: true
        };
      }
      if (!result4 && flag && local8 && !shouldAbort(arg3)) {
        reportCommentFlowTrace("首作发表加长确认", "评论区可能仍在刷新，再等待一轮…");
        for (let num = 1; num <= 4 && !result4 && !shouldAbort(arg3); num += 1) {
          await sleep(4000);
          result4 = await waitForSelfComment(arg1, result2, local9);
          result5 = isCommentNodeStillValid(arg1, result2);
          if (!result5 && arg1 && arg1.isConnected === false) {
            const result = findVisibleMainCommentInput(local9);
            result5 = !!result && !!isCommentNodeStillValid(result, result2);
          }
          if (result4 || result5) {
            break;
          }
        }
        if (result4) {
          reportCommentFlowTrace("加长确认成功", "评论区已出现本条评论");
          return {
            success: true,
            sendDispatched: flag,
            verified: true,
            slowVerified: true
          };
        }
        if (result5) {
          reportCommentFlowTrace("加长确认容错", "输入框已清空且无失败提示，按已发表处理（防双发）");
          return {
            success: true,
            sendDispatched: flag,
            verifiedInferred: true,
            slowVerified: true
          };
        }
        if (!shouldAbort(arg3)) {
          reportCommentFlowTrace("加长确认防双发收口", "已触发发送且无失败提示，评论区确认偏慢，按已提交处理");
          return {
            success: true,
            sendDispatched: flag,
            verifiedInferred: true,
            unverifiedSoft: true,
            slowVerified: true
          };
        }
      }
      let num = 0;
      try {
        num = queryCommentItemNodes(resolveCommentPanelRoot(local9) || local9).length;
      } catch (error) {}
      reportCommentFlowTrace("发表待确认", "总耗时 " + ((Date.now() - result) / 1000).toFixed(1) + "s，评论区暂未确认内容" + ("（inputLive=" + (!!arg1 && arg1.isConnected !== false)) + (" softCleared=" + !!result5) + (" nick=" + (clipTraceText(collectPageNicknameCandidates(), 16) || "无")) + (" nodes=" + num) + ((local8 ? " profileFirst=1" : "") + "）"), "warning");
      return {
        success: false,
        error: "publish_not_verified",
        sendDispatched: flag
      };
    } catch (error) {
      if (flag) {
        const result = await waitForSelfComment(arg1, result2, local9).catch(() => false);
        if (result) {
          reportCommentFlowTrace("发送后异常但评论已出现，视为成功", clipTraceText(error?.message || error, 40), "warning");
          return {
            success: true,
            sendDispatched: flag,
            recoveredAfterError: true
          };
        }
      }
      throw error;
    }
  }
  function isInInteractableArea(arg1, arg2 = null) {
    if (!arg1 || !isVisibleElement(arg1)) {
      return false;
    }
    try {
      if (arg1.closest("header, nav, [class*=\"header\"], [class*=\"nav\"], [class*=\"danmaku\"], [class*=\"Danmaku\"]")) {
        return false;
      }
      const result = [arg1.getAttribute?.("data-e2e") || "", arg1.getAttribute?.("aria-label") || "", arg1.getAttribute?.("title") || "", arg1.className || ""].join(" ");
      if (/publish-btn|upload|header|danmaku|search-btn/i.test(result)) {
        return false;
      }
      const result2 = String(arg1.textContent || "").replace(/\s+/g, "").trim();
      if (/发布作品|弹幕|搜索/.test(result2)) {
        return false;
      }
      if (arg2 && arg2.width > 0) {
        const result = arg1.getBoundingClientRect();
        if (Math.abs(result.top - arg2.top) > 160 && Math.abs(result.bottom - arg2.bottom) > 160) {
          return false;
        }
      }
      return true;
    } catch (error) {
      return true;
    }
  }
  function collectScrollRoots(arg1) {
    if (!arg1) {
      return null;
    }
    const list = [];
    const local = arg1 => {
      if (arg1 && arg1.querySelectorAll && !list.includes(arg1) && arg1 !== document.body && arg1 !== document.documentElement) {
        list.push(arg1);
      }
    };
    try {
      local(getCommentComposerRoot(arg1));
    } catch (error) {}
    try {
      const result = getMainCommentInputShellSelector();
      if (result) {
        local(arg1.closest(result));
      }
    } catch (error) {}
    local(arg1.closest("[data-e2e*=\"comment\"], [class*=\"comment-input\"], [class*=\"CommentInput\"], [class*=\"comment-compose\"], [class*=\"CommentCompose\"], form, section, [class*=\"Footer\"], [class*=\"footer\"]"));
    let local2 = arg1;
    for (let num = 0; num < 8 && local2 && local2 !== document.body; num += 1) {
      local(local2);
      local2 = local2.parentElement;
    }
    local(arg1.closest("[class*=\"side\"], [class*=\"Modal\"], [class*=\"detail\"], [class*=\"panel\"], [class*=\"drawer\"]"));
    const result = (() => {
      try {
        return arg1.getBoundingClientRect();
      } catch (error) {
        return null;
      }
    })();
    for (const item of list) {
      try {
        const result2 = item.querySelector(getV2StringOr("commentSendBtnLoose", "[data-e2e=\"comment-send-btn\"], [data-e2e=\"feed-comment-send-btn\"], [data-e2e*=\"comment-send\"], [data-e2e*=\"send-btn\"]"));
        if (result2 && isInInteractableArea(result2, result)) {
          const local = result2.closest("button, [role=\"button\"], div, span") || result2;
          if (isInInteractableArea(local, result)) {
            console.log("[Built-in-Debug] [主贴发送钮] 命中 data-e2e: \"" + result2.getAttribute("data-e2e") + "\"");
            return local;
          }
        }
      } catch (error) {}
    }
    for (const item of list) {
      try {
        const result2 = Array.from(item.querySelectorAll("div, span, button, p, [role=\"button\"]")).filter(arg1 => {
          if (!isInInteractableArea(arg1, result)) {
            return false;
          }
          const result2 = String(arg1.textContent || "").replace(/\s+/g, "").trim();
          if (!getPublishBtnTexts().includes(result2)) {
            return false;
          }
          if ((arg1.children?.length || 0) > 4) {
            return false;
          }
          return true;
        });
        if (result2.length) {
          const value = result2[0];
          console.log("[Built-in-Debug] [主贴发送钮] 命中文案按钮: \"" + value.textContent?.trim() + "\"");
          return value;
        }
      } catch (error) {}
    }
    const local3 = arg1 => {
      try {
        let local = arg1;
        for (let num = 0; num < 3 && local; num += 1) {
          const local2 = window.getComputedStyle(local).backgroundColor || "";
          const result = local2.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
          if (result) {
            const result2 = Number(result[1]);
            const result3 = Number(result[2]);
            const result4 = Number(result[3]);
            if (result2 >= 180 && result2 > result3 + 40 && result2 > result4 + 20) {
              return true;
            }
          }
          local = local.parentElement;
        }
      } catch (error) {}
      return false;
    };
    const local4 = arg1 => {
      if (!arg1 || String(arg1.tagName || "").toUpperCase() !== "SVG") {
        return false;
      }
      const result = String(arg1.getAttribute("viewBox") || "");
      const result2 = Array.from(arg1.querySelectorAll("path"));
      if (!result2.length) {
        return false;
      }
      const result3 = result2.map(arg1 => arg1.getAttribute("d") || "").join(" ");
      const result4 = result2.map(arg1 => String(arg1.getAttribute("fill") || "")).join(" ").toUpperCase();
      const result5 = /#?FE2C55/i.test(result4);
      const local = /M17\.5\s+30/.test(result3) && /23\.851/.test(result3);
      const local2 = /M12\.34\s+16\.117/.test(result3) || /M12\.34/.test(result3);
      if (result5 && (local || local2)) {
        return true;
      }
      if (result.includes("0 0 36 36") && result5 && local2) {
        return true;
      }
      if (local && local2) {
        return true;
      }
      return false;
    };
    const local5 = arg1 => {
      if (!arg1) {
        return false;
      }
      return arg1.includes("M17.5 30") || arg1.includes("M17.5 30C23.851") || arg1.includes("M12.34 16.117") || arg1.includes("M12.34") || arg1.startsWith("M3.79") || arg1.includes("M10 12") || arg1.includes("M17.5 13") || arg1.includes("M29 18.5");
    };
    const local6 = arg1 => {
      if (!arg1) {
        return null;
      }
      return arg1.closest("button, [role=\"button\"], [data-e2e*=\"send\"], div, span") || arg1.parentElement;
    };
    for (const item of list) {
      try {
        const result2 = Array.from(item.querySelectorAll("svg"));
        for (const item of result2) {
          if (!local4(item)) {
            const result = Array.from(item.querySelectorAll("path"));
            const result2 = result.some(arg1 => {
              const local = arg1.getAttribute("d") || "";
              const result = String(arg1.getAttribute("fill") || "");
              return /#?FE2C55/i.test(result) && local5(local) || /M17\.5\s+30C23\.851/.test(local) || /M12\.34\s+16\.117/.test(local);
            });
            if (!result2) {
              continue;
            }
          }
          const result2 = local6(item);
          if (result2 && isInInteractableArea(result2, result)) {
            console.log("[Built-in-Debug] [主贴发送钮] 命中 #FE2C55 上箭头 SVG");
            return result2;
          }
        }
      } catch (error) {}
    }
    const local7 = arg1 => {
      const value = arg1?.tagName === "SVG" ? arg1 : arg1?.querySelector?.("svg");
      if (!value) {
        return false;
      }
      if (local4(value)) {
        return true;
      }
      return Array.from(value.querySelectorAll("path")).some(arg1 => {
        const local = arg1.getAttribute("d") || "";
        const result = String(arg1.getAttribute("fill") || "");
        return local5(local) || /#?FE2C55/i.test(result);
      });
    };
    const local8 = arg1 => {
      if (!isInInteractableArea(arg1, result)) {
        return -infinity;
      }
      const result2 = [arg1.getAttribute?.("aria-label") || "", arg1.getAttribute?.("title") || "", arg1.getAttribute?.("data-e2e") || ""].join(" ");
      if (/弹幕|表情|图片|相册|@|mention|emoji|image/i.test(result2)) {
        return -infinity;
      }
      const result3 = String(arg1.innerText || arg1.textContent || "").replace(/\s+/g, "").trim();
      if (result3 && !getPublishBtnTexts().includes(result3) && result3.length > 2) {
        return -infinity;
      }
      if (/弹幕/.test(result3)) {
        return -infinity;
      }
      const result4 = arg1.getBoundingClientRect();
      if (result4.width < 18 || result4.height < 18 || result4.width > 72 || result4.height > 72) {
        return -infinity;
      }
      if (Math.abs(result4.width - result4.height) > 16) {
        return -infinity;
      }
      const result5 = local3(arg1);
      const result6 = /发送|发布|发表|send|publish/i.test(result2);
      const result7 = local7(arg1);
      if (!result5 && !result6 && !result7) {
        return -infinity;
      }
      let num = 0;
      if (result6) {
        num += 120;
      }
      if (result5) {
        num += 100;
      }
      if (result7) {
        num += 70;
      } else if (arg1.querySelector?.("svg")) {
        num += 20;
      }
      if (arg1.getAttribute?.("role") === "button" || arg1.tagName === "BUTTON") {
        num += 15;
      }
      if (result && result.width > 0) {
        if (result4.left < result.left + result.width * 0.15) {
          return -infinity;
        }
        if (result4.top > result.bottom + 120 || result4.bottom < result.top - 60) {
          return -infinity;
        }
        num += Math.max(0, 40 - Math.abs(result4.bottom - result.bottom));
        num += Math.max(0, Math.min(40, (result4.left - result.left) / Math.max(result.width, 1) * 40));
      }
      return num;
    };
    const list2 = [];
    const set = new Set();
    for (const item of list) {
      let list = [];
      try {
        list = Array.from(item.querySelectorAll("button, [role=\"button\"], div, span, [class*=\"send\"], [class*=\"Send\"], [data-e2e*=\"send\"]"));
      } catch (error) {
        list = [];
      }
      for (const item of list) {
        const value = item.querySelector?.("svg") ? item.closest("button, [role=\"button\"]") || item : item;
        if (!value || set.has(value)) {
          continue;
        }
        const result = local8(value);
        if (result > 50) {
          set.add(value);
          list2.push({
            el: value,
            score: result
          });
        }
      }
      try {
        for (const item2 of item.querySelectorAll("svg")) {
          const result = item2.closest("button, [role=\"button\"], div, span");
          if (!result || set.has(result)) {
            continue;
          }
          const result2 = local8(result);
          if (result2 > 50) {
            set.add(result);
            list2.push({
              el: result,
              score: result2
            });
          }
        }
      } catch (error) {}
    }
    if (list2.length) {
      list2.sort((arg1, arg2) => arg2.score - arg1.score);
      const value = list2[0];
      console.log("[Built-in-Debug] [主贴发送钮] 命中图标按钮 score=" + value.score.toFixed(1));
      return value.el;
    }
    const local9 = list[0] || document;
    try {
      for (const item of local9.querySelectorAll("svg path")) {
        const local = item.getAttribute("d") || "";
        if (!local5(local)) {
          continue;
        }
        const result = item.closest("div, span, button, [role=\"button\"]");
        if (result && isVisibleElement(result) && !String(result.innerText || "").includes("弹幕")) {
          return result;
        }
      }
    } catch (error) {}
    return null;
  }
  function getProfilePostListRoot() {
    const result = getV2StringOr("userPostList", "[data-e2e=\"user-post-list\"], [data-e2e=\"user-post-container\"]");
    try {
      return document.querySelector(result);
    } catch (error) {
      return document.querySelector("[data-e2e=\"user-post-list\"]") || document.querySelector("[data-e2e=\"user-post-container\"]");
    }
  }
  function parseProfileWorksCount() {
    if (!window.location.href.includes("/user/")) {
      return null;
    }
    const local = arg1 => {
      const result = (arg1 || "").replace(/\s+/g, "");
      const local = result.match(/作品[·\s]*(\d+)/) || result.match(/^作品(\d+)$/);
      if (local) {
        return parseInt(local[1], 10);
      }
      return null;
    };
    const result = document.querySelectorAll(getV2StringOr("userTabCount", "[data-e2e=\"user-tab-count\"], [data-e2e=\"user-post-tab-count\"], [data-e2e=\"user-tab-count-post\"]"));
    for (const item of result) {
      if (!isVisibleElement(item)) {
        continue;
      }
      const result = parseInt((item.innerText || "").replace(/[^\d]/g, ""), 10);
      if (!Number.isNaN(result)) {
        return result;
      }
    }
    const result2 = Array.from(document.querySelectorAll("div, span, p, li")).filter(arg1 => isVisibleElement(arg1) && arg1.children.length <= 6);
    for (const item of result2) {
      const result = (item.innerText || "").trim().replace(/\s+/g, "");
      if (/^作品\d+$/.test(result) || /^作品[·\s]*\d+$/.test(result)) {
        const result2 = local(result);
        if (result2 !== null) {
          return result2;
        }
      }
    }
    const result3 = result2.find(arg1 => (arg1.innerText || "").trim() === "作品");
    if (result3) {
      const local2 = result3.closest("[role=\"tablist\"]") || result3.parentElement;
      if (local2) {
        const result = local(local2.innerText || "");
        if (result !== null) {
          return result;
        }
        const result2 = local2.querySelectorAll("div, span, p");
        for (const item of result2) {
          const result = (item.innerText || "").trim();
          if (/^\d+$/.test(result)) {
            return parseInt(result, 10);
          }
        }
      }
    }
    const result4 = Array.from(document.querySelectorAll("div, span, p")).filter(arg1 => isVisibleElement(arg1) && (arg1.innerText || "").includes("作品"));
    for (const item of result4.slice(0, 12)) {
      const result = (item.innerText || "").split("\n").map(arg1 => arg1.trim()).filter(Boolean);
      const result2 = result.findIndex(arg1 => arg1 === "作品" || /^作品\d+$/.test(arg1.replace(/\s+/g, "")));
      if (result2 >= 0) {
        const result3 = result[result2].replace(/\s+/g, "");
        const result4 = local(result3);
        if (result4 !== null) {
          return result4;
        }
        const value = result[result2 + 1];
        if (value && /^\d+$/.test(value)) {
          return parseInt(value, 10);
        }
      }
    }
    return null;
  }
  function pageShowsNoWorks() {
    const result = getProfilePostListRoot();
    const result2 = [result?.innerText, document.querySelector("main")?.innerText, document.body?.innerText].filter(Boolean).join("\n").slice(0, 8000);
    return /暂无作品|还没有发布作品|还没有发布过|暂未发布作品|Ta还没有发布|TA还没有发布|该用户还未发布|没有更多作品|暂无内容/.test(result2);
  }
  function describeProfileNoWorksReason(text = "") {
    const result = String(text || "").trim();
    const obj = {
      tab_count_zero: "该用户主页作品数为 0，没有可评论的首作",
      empty_state: "该用户主页显示暂无作品，没有可评论的首作",
      empty_grid: "该用户主页作品列表为空，没有可评论的首作",
      empty_state_late: "等待后仍显示暂无作品，没有可评论的首作",
      timeout_empty: "等待作品区加载超时且未发现公开作品，没有可评论的首作",
      no_video_cards: "该用户主页未找到可打开的作品卡片，没有可评论的首作",
      no_works: "该用户主页未发布公开作品，没有可评论的首作"
    };
    return obj[result] || "该用户主页未发布公开作品，没有可评论的首作";
  }
  function describeProfileWorksNotReadyReason(text = "") {
    const result = String(text || "").trim();
    const obj = {
      timeout_unknown: "用户主页作品区加载超时，尚未确认是否有公开作品（可重试）",
      aborted: "等待作品区加载时任务已停止",
      unknown: "用户主页作品区尚未加载完成，暂时无法评论首作（可重试）"
    };
    return obj[result] || "用户主页作品区未就绪，暂时无法评论首作（可重试）";
  }
  function randomWaitMs(num = 10000, num2 = 20000) {
    const result = Math.max(0, Number(num) || 10000);
    const result2 = Math.max(result, Number(num2) || 20000);
    return result + Math.floor(Math.random() * (result2 - result + 1));
  }
  function pageShowsLoadingOrError() {
    try {
      const result = String(document.body?.innerText || "").slice(0, 2400);
      if (/加载中|正在加载|请稍候|稍后再试|网络不太顺畅|刷新一下|内容加载失败|服务器打瞌睡/.test(result)) {
        return true;
      }
      const result2 = String(window.location.href || "");
      if (!/\/user\//i.test(result2)) {
        return false;
      }
      if (findProfileVideoCards({
        ignoreNoWorksGuard: true
      }).length > 0) {
        return false;
      }
      return !profileHasNoPublicWorks().noWorks;
    } catch (error) {
      return false;
    }
  }
  function pageBusyOrAtUrl(text = "") {
    try {
      const result = String(document.body?.innerText || "").slice(0, 2000);
      if (/加载中|正在加载|请稍候|网络不太顺畅|刷新一下/.test(result)) {
        return true;
      }
      const result2 = String(window.location.href || "");
      if (text && result2.includes(String(text))) {
        return true;
      }
      return /\/(?:video|note)\//i.test(result2) || /modal_id=/i.test(result2);
    } catch (error) {
      return false;
    }
  }
  function isPageBlank() {
    try {
      const result = String(window.location.href || "");
      if (!result || result === "about:blank") {
        return true;
      }
      const result2 = String(document.body?.innerText || "").trim();
      if (result2.length < 8) {
        return true;
      }
      if (/无法访问此网站|dns_probe_finished|err_name_not_resolved|err_connection|err_timed_out|err_aborted|net::err_/i.test(result2) && result2.length < 800) {
        return true;
      }
      return false;
    } catch (error) {
      return true;
    }
  }
  async function waitPageReadyInPlace(arg1, text = "页面未就绪") {
    if (isPageBlank()) {
      reportProfileFirstTrace(text + "：页面空白或网络异常，跳过原地等待，交由上层决定是否重载");
      return 0;
    }
    const result = randomWaitMs();
    reportProfileFirstTrace(text + "，先原地停留 " + (result / 1000).toFixed(1) + " 秒再试一次（不重载页面）");
    const value = Date.now() + result;
    while (Date.now() < value) {
      if (shouldAbort(arg1)) {
        return 0;
      }
      await sleep(Math.min(400, Math.max(0, value - Date.now())));
    }
    return result;
  }
  function profileHasNoPublicWorks() {
    const result = parseProfileWorksCount();
    if (result === 0) {
      return {
        noWorks: true,
        worksCount: 0,
        reason: "tab_count_zero"
      };
    }
    if (pageShowsNoWorks()) {
      return {
        noWorks: true,
        worksCount: 0,
        reason: "empty_state"
      };
    }
    const result2 = getProfilePostListRoot();
    if (result2 && isVisibleElement(result2)) {
      const result3 = result2.querySelectorAll("[data-e2e=\"user-post-item\"], [role=\"listitem\"], a[href*=\"/video/\"], a[href*=\"/note/\"]");
      const result4 = Array.from(result3).filter(arg1 => {
        if (!isVisibleElement(arg1)) {
          return false;
        }
        const result = arg1.getBoundingClientRect();
        return result.width >= 60 && result.height >= 60;
      });
      if (result4.length === 0 && result === 0) {
        return {
          noWorks: true,
          worksCount: 0,
          reason: "empty_grid"
        };
      }
    }
    if (result !== null && result > 0) {
      return {
        noWorks: false,
        worksCount: result
      };
    }
    return {
      noWorks: false,
      worksCount: result
    };
  }
  async function waitForProfileWorksReady(arg1, num = 14000) {
    await ensureProfileWorksTab(arg1);
    const result = Date.now();
    while (Date.now() - result < num) {
      if (shouldAbort(arg1)) {
        return {
          ready: false,
          noWorks: false
        };
      }
      const result2 = profileHasNoPublicWorks();
      if (result2.noWorks) {
        return {
          ready: true,
          noWorks: true,
          worksCount: 0,
          reason: result2.reason
        };
      }
      const result3 = findProfileVideoCards({
        ignoreNoWorksGuard: true
      });
      if (result3.length > 0) {
        const result = parseProfileWorksCount();
        return {
          ready: true,
          noWorks: false,
          worksCount: result ?? result3.length
        };
      }
      if (Date.now() - result > 3500 && pageShowsNoWorks()) {
        return {
          ready: true,
          noWorks: true,
          worksCount: 0,
          reason: "empty_state_late"
        };
      }
      await sleep(500);
    }
    const result2 = profileHasNoPublicWorks();
    if (result2.noWorks) {
      return {
        ready: true,
        noWorks: true,
        worksCount: 0,
        reason: result2.reason || "timeout_empty"
      };
    }
    const result3 = findProfileVideoCards({
      ignoreNoWorksGuard: true
    });
    if (result3.length > 0) {
      return {
        ready: true,
        noWorks: false,
        worksCount: parseProfileWorksCount() ?? result3.length,
        reason: "timeout_has_cards"
      };
    }
    return {
      ready: false,
      noWorks: false,
      worksCount: null,
      reason: "timeout_unknown"
    };
  }
  function findProfileVideoCards(options = {}) {
    if (!options.ignoreNoWorksGuard) {
      const result = profileHasNoPublicWorks();
      if (result.noWorks) {
        return [];
      }
    }
    const result = getProfilePostListRoot();
    let list = [];
    if (result) {
      list = Array.from(result.querySelectorAll("a[href*=\"/video/\"], a[href*=\"/note/\"], [data-e2e=\"user-post-item\"], [role=\"listitem\"]")).filter(arg1 => {
        if (!isVisibleElement(arg1)) {
          return false;
        }
        const result = arg1.getBoundingClientRect();
        return result.width >= 60 && result.height >= 60;
      });
    }
    if (list.length === 0) {
      list = Array.from(document.querySelectorAll("[data-e2e=\"user-post-list\"] [role=\"listitem\"], [data-e2e=\"user-post-item\"]")).filter(arg1 => isVisibleElement(arg1));
    }
    if (list.length === 0) {
      const local = document.querySelector("main") || document.body;
      list = Array.from(local.querySelectorAll("a[href*=\"/video/\"], a[href*=\"/note/\"]")).filter(arg1 => {
        if (!isVisibleElement(arg1)) {
          return false;
        }
        if (arg1.closest("[data-e2e=\"comment-list\"], [class*=\"comment\"], [data-e2e=\"searchbar\"]")) {
          return false;
        }
        const result = arg1.getBoundingClientRect();
        return result.width >= 90 && result.height >= 90;
      });
    }
    const set = new Set();
    return list.filter(arg1 => {
      const local = arg1.href || arg1.getAttribute("href") || arg1.outerHTML?.slice(0, 80);
      if (set.has(local)) {
        return false;
      }
      set.add(local);
      return true;
    });
  }
  async function ensureProfileWorksTab(arg1) {
    const result = Array.from(document.querySelectorAll("div, span, p")).filter(arg1 => {
      if (!isVisibleElement(arg1) || arg1.children.length > 6) {
        return false;
      }
      const result = (arg1.innerText || "").trim().replace(/\s+/g, "");
      return result === "作品" || /^作品\d+$/.test(result);
    });
    if (result.length === 0) {
      return;
    }
    const local = result.find(arg1 => (arg1.innerText || "").trim() === "作品") || result[0];
    const result2 = result.find(arg1 => arg1.className.includes("active") || arg1.getAttribute("aria-selected") === "true");
    if (!result2 || result2 !== local) {
      await simulateTrustedElementClick(local, arg1, "切换主页作品页签");
      await sleep(1200);
    }
  }
  function buildLeadFromEntry(arg1, options = {}) {
    return {
      lead: {
        nickname: arg1.nickname,
        leadId: arg1.leadId,
        title: arg1.title || arg1.videoTitle || state.currentTask?.videoTitle || "",
        videoTitle: arg1.videoTitle || arg1.title || state.currentTask?.videoTitle || "",
        content: arg1.content || "",
        timeText: arg1.timeText || arg1.commentTime || "",
        commentTime: arg1.commentTime || arg1.timeText || "",
        userUrl: arg1.userUrl || "",
        url: arg1.url || arg1.videoUrl || "",
        videoUrl: arg1.videoUrl || arg1.url || "",
        accountId: arg1.accountId || state.currentTask?.accountId || "default",
        accountName: arg1.accountName || window._radar_account_name || state.currentTask?.nickname || state.currentTask?.name || "默认账号",
        location: arg1.location || arg1.ipLocation || "",
        ipLocation: arg1.ipLocation || arg1.location || "",
        signature: arg1.signature || "",
        contact: arg1.contact || "",
        douyinId: arg1.douyinId || "",
        gender: arg1.gender || "",
        age: arg1.age,
        worksCount: arg1.worksCount,
        isHighIntention: !!arg1.isHighIntention,
        aiThought: arg1.aiThought || "",
        aiAnalysis: arg1.aiAnalysis || "",
        thought: arg1.thought || "",
        actions: {
          ...(arg1.actions || {})
        },
        touchCounts: {
          ...(arg1.touchCounts || {})
        },
        touchLog: Array.isArray(arg1.touchLog) ? arg1.touchLog.map(arg1 => ({
          ...arg1
        })) : [],
        lastTouchAt: arg1.lastTouchAt,
        profileCommentAt: arg1.profileCommentAt
      },
      platform: state.currentTask?.platform || window._radar_platform || "douyin",
      taskId: state.currentTask?.taskId || state.activeLoopId,
      parentTaskId: state.currentTask?.parentTaskId || state.currentTask?.taskId || state.activeLoopId,
      taskMode: state.currentTask?.taskMode,
      keywords: state.currentTask?.keywords,
      enableCommentKeywordFilter: !!state.currentTask?.enableCommentKeywordFilter,
      intentionKeywords: state.currentTask?.intentionKeywords,
      excludeCommentKeywords: state.currentTask?.excludeCommentKeywords,
      accountId: state.currentTask?.accountId,
      nickname: state.currentTask?.nickname,
      name: state.currentTask?.name,
      taskName: state.currentTask?.taskName,
      isFree: !!state.currentTask?.isFree,
      isTrial: !!state.currentTask?.isTrial,
      authInfo: state.currentTask?.authInfo,
      dmContent: state.currentTask?.dmContent,
      genderFilter: resolveTaskGenderFilter(state.currentTask),
      targetGender: state.currentTask?.targetGender,
      profileFirstGenderFilter: resolveProfileFirstGenderFilter(state.currentTask),
      profileFirstAgeFilterEnabled: state.currentTask?.profileFirstAgeFilterEnabled === true,
      profileFirstAgeMin: state.currentTask?.profileFirstAgeMin,
      profileFirstAgeMax: state.currentTask?.profileFirstAgeMax,
      ageFilterEnabled: state.currentTask?.ageFilterEnabled ?? state.currentTask?.batchConfig?.ageFilterEnabled,
      ageMin: state.currentTask?.ageMin ?? state.currentTask?.targetAgeMin,
      ageMax: state.currentTask?.ageMax ?? state.currentTask?.targetAgeMax,
      targetAgeMin: state.currentTask?.targetAgeMin,
      targetAgeMax: state.currentTask?.targetAgeMax,
      enableWarmup: state.currentTask?.enableWarmup,
      enableComment: state.currentTask?.enableComment,
      followDmDelayMin: state.currentTask?.followDmDelayMin,
      followDmDelayMax: state.currentTask?.followDmDelayMax,
      videoCommentMode: state.currentTask?.videoCommentMode,
      videoCommentContent: state.currentTask?.videoCommentContent,
      videoCommentUseRandomSuffix: !!state.currentTask?.videoCommentUseRandomSuffix,
      aiReplyMode: !!state.currentTask?.aiReplyMode,
      aiRole: state.currentTask?.aiRole,
      aiGoal: state.currentTask?.aiGoal,
      aiStyle: state.currentTask?.aiStyle,
      aiPrompt: state.currentTask?.aiPrompt,
      commentContent: state.currentTask?.commentContent,
      commentUseRandomSuffix: !!state.currentTask?.commentUseRandomSuffix,
      commentOnProfileFirstWork: !!state.currentTask?.commentOnProfileFirstWork,
      profileFirstCommentFallbackMode: state.currentTask?.profileFirstCommentFallbackMode || "reply",
      profileFirstWorkLikePercent: clampPercentValue(state.currentTask?.profileFirstWorkLikePercent, 10),
      profileFirstWorkCollectPercent: clampPercentValue(state.currentTask?.profileFirstWorkCollectPercent, 10),
      profileFirstCommentUseAi: !!state.currentTask?.aiReplyMode,
      batchProfileCommentUseAi: !!state.currentTask?.batchProfileCommentUseAi,
      enableCommentMention: state.currentTask?.enableCommentMention,
      commentMentionNicknames: state.currentTask?.commentMentionNicknames,
      commentMentionPosition: state.currentTask?.commentMentionPosition,
      commentMentionPercent: resolveActiveMentionPercent(false),
      enableVideoCommentMention: state.currentTask?.enableVideoCommentMention,
      videoCommentMentionNicknames: state.currentTask?.videoCommentMentionNicknames,
      videoCommentMentionPosition: state.currentTask?.videoCommentMentionPosition,
      videoCommentMentionPercent: resolveActiveMentionPercent(true),
      enableCommentExpression: state.currentTask?.enableCommentExpression,
      commentExpressionCount: state.currentTask?.commentExpressionCount,
      enableCommentImage: state.currentTask?.enableCommentImage,
      commentImagePaths: state.currentTask?.commentImagePaths,
      commentImagePath: state.currentTask?.commentImagePath,
      enableVideoCommentExpression: state.currentTask?.enableVideoCommentExpression,
      videoCommentExpressionCount: state.currentTask?.videoCommentExpressionCount,
      enableVideoCommentImage: state.currentTask?.enableVideoCommentImage,
      videoCommentImagePaths: state.currentTask?.videoCommentImagePaths,
      enableVideoComment: state.currentTask?.enableVideoComment,
      enableCommentWithoutText: !!state.currentTask?.enableCommentWithoutText,
      enableVideoCommentWithoutText: !!state.currentTask?.enableVideoCommentWithoutText,
      commentAttachmentPercent: state.currentTask?.commentAttachmentPercent,
      videoCommentAttachmentPercent: state.currentTask?.videoCommentAttachmentPercent,
      ...options
    };
  }
  function isProfileFirstCommentAiMode(arg1) {
    if (!arg1) {
      return false;
    }
    return !!arg1.aiReplyMode || !!arg1.profileFirstCommentUseAi || !!arg1.batchProfileCommentUseAi && !!arg1.aiRole || !!arg1.batchConfig?.profileCommentUseAi && !!arg1.aiRole;
  }
  function shouldUseAiComment(options = {}) {
    if (options.forceTemplateOnly) {
      return false;
    }
    if (options.forceAi || options.profileAiMode) {
      return true;
    }
    const value = options.templateText != null ? String(options.templateText).trim() : "";
    if (value) {
      return false;
    }
    if (!options.useReplyConfig) {
      return state.currentTask?.videoCommentMode === "ai";
    }
    return !!shouldUseAiReplyGeneration(state.currentTask) || state.currentTask?.videoCommentMode === "ai" || !!isProfileFirstCommentAiMode(state.currentTask);
  }
  async function resolveMainVideoCommentText(arg1, arg2, options = {}) {
    const flag = !!options.useReplyConfig;
    const result = shouldUseAiComment(options);
    const value = options.templateText != null;
    const value2 = value ? String(options.templateText) : flag ? (state.currentTask?.commentContent || "").trim() || (state.currentTask?.videoCommentContent || "").trim() : state.currentTask?.videoCommentContent || "";
    const value3 = value ? value2.split("\n").some(arg1 => arg1.trim()) : flag ? hasLocalReplyTemplates() : hasVideoCommentTemplates();
    if (flag) {
      reportProfileFirstTrace("解析文案：模式=" + (result ? "AI智能体" : "固定模板") + "（forceAi=" + !!options.forceAi + "，forceTpl=" + !!options.forceTemplateOnly + "，aiReplyMode=" + !!state.currentTask?.aiReplyMode + "）");
    }
    if (result) {
      const value = flag ? !!state.currentTask?.enableCommentWithoutText : !!state.currentTask?.enableVideoCommentWithoutText;
      if (value && !value3) {
        if (flag) {
          reportProfileFirstTrace("已开启不发文字，跳过 AI 文案生成，仅发送图片/表情/@ 提及");
        } else {
          reportTraceLog("📝 视频主评：已开启不发文字，跳过 AI 文案生成，仅发送图片/表情/@");
        }
        return "";
      }
      if (shouldAbort(arg2)) {
        return null;
      }
      const result = String(options.prefetchedCommentText || "").trim();
      if (result) {
        if (flag) {
          reportProfileFirstTrace("复用提前生成文案 →「" + clipTraceText(result, 32) + "」");
        } else {
          reportTraceLog("🤖 视频主评：复用预筛文案 →「" + clipTraceText(result, 32) + "」");
        }
        return applyRiskyEmojiReplaceForComment(result, flag ? "profile" : "comment");
      }
      reportTraceLog("🤖 视频主评：正在生成…");
      pingInteractionActivity(flag ? "profile-first-ai" : "video-comment-ai", 360000);
      const result2 = Date.now();
      const result3 = getBoundSubviewInteractionId();
      try {
        const value = Array.isArray(options.commentSamples) ? options.commentSamples.filter(Boolean).slice(0, 8) : [];
        const value2 = Math.floor(Math.random() * 1500) + 150;
        await sleep(value2);
        if (shouldAbort(arg2) || arg2 === "SUBVIEW_TASK" && isSubviewInteractionCancelled(result3)) {
          reportTraceLog("🤖 视频主评：任务已停止");
          return null;
        }
        const result = await ipcRenderer.invoke("ai-generate-video-comment", buildAutomationAiPayload({
          videoTitle: (arg1 || "").trim() || "未知视频",
          comments: value,
          generationMode: flag ? "profile_first_comment" : "main_post_comment",
          config: {
            aiRole: state.currentTask.aiRole,
            aiGoal: state.currentTask.aiGoal,
            aiStyle: state.currentTask.aiStyle,
            aiPrompt: state.currentTask.aiPrompt,
            firstPostGoal: state.currentTask.firstPostGoal,
            firstPostStyle: state.currentTask.firstPostStyle,
            firstPostPrompt: state.currentTask.firstPostPrompt,
            videoGoal: state.currentTask.videoGoal,
            videoStyle: state.currentTask.videoStyle,
            videoPrompt: state.currentTask.videoPrompt
          }
        }));
        if (shouldAbort(arg2) || isAiInvokeCancelled(result) || arg2 === "SUBVIEW_TASK" && isSubviewInteractionCancelled(result3)) {
          reportTraceLog("🤖 视频主评：任务已停止");
          return null;
        }
        pingInteractionActivity(flag ? "profile-first-ai-done" : "video-comment-ai-done", 180000);
        const result4 = ((Date.now() - result2) / 1000).toFixed(1);
        if (result?.success && (result.content || "").trim()) {
          const result2 = result.content.trim();
          console.log("%c[视频主评-AI] 已生成评论: \"" + result2 + "\"", "color: #a78bfa; font-weight: bold;");
          reportTraceLog("🤖 视频主评：生成成功（" + result4 + " 秒）→「" + clipTraceText(result2, 32) + "」");
          return applyRiskyEmojiReplaceForComment(result2, flag ? "profile" : "comment");
        }
        const local = result?.msg || "未知原因";
        console.warn("%c[视频主评-AI] 未能生成评论: " + local, "color: #f97316;");
        reportTraceLog("🤖 视频主评：生成失败（" + result4 + " 秒），已跳过");
        return null;
      } catch (error) {
        const result = ((Date.now() - result2) / 1000).toFixed(1);
        console.warn("[视频主评-AI] 调用异常:", error.message || error);
        reportTraceLog("🤖 视频主评：生成失败（" + result + " 秒），已跳过");
        return null;
      }
    }
    const result2 = value2.split("\n").filter(arg1 => arg1.trim());
    const value4 = flag ? !!state.currentTask?.enableCommentWithoutText : !!state.currentTask?.enableVideoCommentWithoutText;
    if (options.allowEmptyText && value4) {
      if (flag) {
        reportProfileFirstTrace("已开启不发文字，跳过模板/AI 文案");
      } else {
        reportTraceLog("📝 视频主评：已开启不发文字，跳过模板文案");
      }
      return "";
    }
    if (!result2.length) {
      if (flag) {
        if (state.currentTask?.enableCommentWithoutText) {
          reportProfileFirstTrace("正文为空，将仅发送图片/表情/@ 提及");
          return "";
        }
        console.warn("[主贴评论] 无可用模板文案，跳过（智能体模式下不使用「赞同」等兜底）");
        reportProfileFirstTrace("无可用模板文案，已跳过（不使用「赞同」等兜底）");
        return null;
      }
      if (options.allowEmptyText) {
        return "";
      }
      if (value || flag) {
        console.warn("[主贴评论] 无可用模板文案，跳过（智能体模式下不使用「赞同」等兜底）");
        reportProfileFirstTrace("无可用模板文案，已跳过（不使用「赞同」等兜底）");
        return null;
      }
      return "好评支持！";
    }
    const value5 = result2[Math.floor(Math.random() * result2.length)];
    let local = value5;
    if (flag) {
      reportProfileFirstTrace("使用固定模板 →「" + clipTraceText(value5, 32) + "」");
      if (shouldAppendCommentRandomSuffix(state.currentTask)) {
        local = appendRandomEmojiSuffix(value5);
        reportProfileFirstTrace("本地回复模板已加随机表情");
      }
    } else if (shouldAppendVideoCommentRandomSuffix(state.currentTask)) {
      local = appendRandomEmojiSuffix(value5);
      reportTraceLog("📝 视频主评：自定义模板已加随机表情");
    }
    const result3 = replaceRiskyCommentEmojisLocal(local);
    if (result3.replaced) {
      local = result3.text;
      const value = "装饰表情已改为中文标记（" + clipTraceText(result3.labels, 24) + "）";
      if (flag) {
        reportProfileFirstTrace(value);
      } else {
        reportTraceLog("📝 视频主评：" + value, null, "warning");
      }
    }
    return local;
  }
  function clampPercentValue(arg1, num = 0) {
    const result = Number(arg1);
    if (!Number.isFinite(result)) {
      return Math.max(0, Math.min(100, Math.round(Number(num) || 0)));
    }
    return Math.max(0, Math.min(100, Math.round(result)));
  }
  function isProfileFirstWorkTask() {
    const value = state.currentTask;
    if (!value) {
      return false;
    }
    return !!value.commentOnProfileFirstWork || !!value.canCommentFirstWork || value.batchConfig?.type === "profile_first_comment";
  }
  function shouldRandomLikeFirstWork() {
    if (!isProfileFirstWorkTask()) {
      return false;
    }
    const result = clampPercentValue(state.currentTask?.profileFirstWorkLikePercent, 10);
    if (result <= 0) {
      return false;
    }
    return Math.random() * 100 < result;
  }
  function shouldRandomCollectFirstWork() {
    if (!isProfileFirstWorkTask()) {
      return false;
    }
    const result = clampPercentValue(state.currentTask?.profileFirstWorkCollectPercent, 10);
    if (result <= 0) {
      return false;
    }
    return Math.random() * 100 < result;
  }
  function buildDomApiPack() {
    return {
      simulateHumanClick: simulateHumanClick,
      randomDelay: randomDelay,
      isVisibleElement: isVisibleElement,
      getDouyinFeedScope: getDouyinFeedScope,
      resolveDouyinVideoDetailModal: resolveDouyinVideoDetailModal,
      getVideoEngagePack: getVideoEngagePack,
      reportTraceLog: arg1 => {
        reportProfileFirstTrace(String(arg1 || ""));
      }
    };
  }
  async function randomLikeFirstWork(arg1, arg2) {
    try {
      const local = arg2?.nickname || "用户";
      reportCurrentAction("随机对 [" + local + "] 的首个作品点赞...");
      const result = await likeCurrentVideoSideAction(arg1, buildDomApiPack());
      if (!result) {
        console.warn("[主页首作评论] 作品点赞未成功（未找到可见按钮或点击失败）");
        reportProfileFirstTrace("@" + local + " 首作点赞未成功", arg2?.accountId);
        return false;
      }
      console.log("%c[主页首作评论] 已按概率对作品点赞", "color: #ec4899; font-weight: bold;");
      reportProfileFirstTrace("@" + local + " 已对首个作品执行点赞", arg2?.accountId);
      return true;
    } catch (error) {
      console.warn("[主页首作评论] 作品点赞失败:", error.message || error);
      return false;
    }
  }
  async function randomCollectFirstWork(arg1, arg2) {
    try {
      const local = arg2?.nickname || "用户";
      reportCurrentAction("随机对 [" + local + "] 的首个作品收藏...");
      const result = await collectCurrentVideoSideAction(arg1, buildDomApiPack());
      if (!result) {
        console.warn("[主页首作评论] 作品收藏未成功（未找到可见按钮或点击失败）");
        reportProfileFirstTrace("@" + local + " 首作收藏未成功", arg2?.accountId);
        return false;
      }
      console.log("%c[主页首作评论] 已按概率对作品收藏", "color: #f59e0b; font-weight: bold;");
      reportProfileFirstTrace("@" + local + " 已对首个作品执行收藏", arg2?.accountId);
      return true;
    } catch (error) {
      console.warn("[主页首作评论] 作品收藏失败:", error.message || error);
      return false;
    }
  }
  async function performProfileFirstWorkComment(arg1, arg2, options = {}) {
    try {
      await handleGlobalAutomationPopupsAndSecurity(arg2);
    } catch (error) {}
    try {
      const value = options.resumeState?.phase === "video_detail" ? options.resumeState : null;
      let result = Number(value?.worksCount ?? 0);
      let local = null;
      let result2 = String(value?.videoId || "").trim();
      if (value) {
        reportProfileFirstTrace("@" + arg1.nickname + " 已恢复作品详情，继续准备评论（videoId=" + (value.videoId || "?") + "）", arg1.accountId);
        local = await waitForProfileVideoDetailScope(arg2, value.videoId || "", {
          maxWaitMs: 15000,
          interactionId: value.interactionId || state.currentTask?.interactionId
        });
        if (!local && !shouldAbort(arg2)) {
          const result = pageBusyOrAtUrl(value.videoId || "");
          reportProfileFirstTrace("@" + arg1.nickname + " 详情续跑首次未就绪（" + clipTraceText(state.lastProfileVideoDetailDiagnostic, 120) + "）" + ((result ? "，路由/加载态仍像目标详情" : "") + "，原地再等一轮"), arg1.accountId);
          await waitPageReadyInPlace(arg2, "@" + arg1.nickname + " 作品详情未挂载");
          if (!shouldAbort(arg2)) {
            local = await waitForProfileVideoDetailScope(arg2, value.videoId || "", {
              maxWaitMs: 24000,
              interactionId: value.interactionId || state.currentTask?.interactionId
            });
          }
        }
        if (!local) {
          if (value.videoId && value.openMode !== "direct") {
            const obj = {
              ...value,
              openMode: "direct",
              navigationAttempt: Math.max(2, Number(value.navigationAttempt || 1) + 1),
              createdAt: Date.now()
            };
            const result = persistSubviewTaskForResume(state.currentTask, {
              __profileFirstResume: obj
            });
            if (result) {
              reportProfileFirstTrace("@" + arg1.nickname + " 精选详情未挂载，改用 /video/ 播放页继续（" + clipTraceText(state.lastProfileVideoDetailDiagnostic, 120) + "）", arg1.accountId);
              window.location.href = toSpecificVideoDirectUrl(value.videoId);
              return await new Promise(() => {});
            }
          }
          reportProfileFirstTrace("@" + arg1.nickname + " 详情续跑未就绪（" + clipTraceText(state.lastProfileVideoDetailDiagnostic, 180) + "）", arg1.accountId);
          return {
            success: false,
            error: "作品详情续跑未就绪（可重试）",
            errorCode: "profile_video_detail_resume_failed",
            diagnostic: state.lastProfileVideoDetailDiagnostic || "resume_timeout",
            worksCount: result
          };
        }
      } else {
        let result3 = await waitForProfileWorksReady(arg2);
        if (!result3.ready && !shouldAbort(arg2)) {
          const result = pageShowsLoadingOrError();
          reportProfileFirstTrace("@" + arg1.nickname + " 作品区首次探测未就绪（" + (result3.reason || "unknown") + "）" + ((result ? "，主页仍像加载中" : "") + "，原地再等一轮"), arg1.accountId);
          await waitPageReadyInPlace(arg2, "@" + arg1.nickname + " 作品区未就绪");
          if (!shouldAbort(arg2) && !isPageBlank()) {
            const result = await waitForProfileWorksReady(arg2, 20000);
            if (result.ready) {
              result3 = result;
            }
          }
        }
        const value = (state.currentTask?.profileFirstCommentFallbackMode || "reply") === "skip" ? "将按仅首作评论模式跳过回复" : "将回退为回复评论";
        if (!result3.ready) {
          const result = describeProfileWorksNotReadyReason(result3.reason || "unknown");
          reportProfileFirstTrace("@" + arg1.nickname + " " + result + "（" + (result3.reason || "unknown") + "）", arg1.accountId);
          return {
            success: false,
            error: result,
            errorCode: "profile_works_not_ready",
            diagnostic: result3.reason || "timeout_unknown",
            worksCount: null
          };
        }
        if (result3.noWorks) {
          const result = describeProfileNoWorksReason(result3.reason);
          console.log("%c[主页首作评论] " + arg1.nickname + " 作品数=0（" + (result3.reason || "no_works") + "），" + value, "color: #94a3b8; font-style: italic;");
          reportProfileFirstTrace("@" + arg1.nickname + " " + result, arg1.accountId);
          return {
            success: false,
            noWorks: true,
            worksCount: 0,
            error: result,
            errorCode: "no_works",
            diagnostic: result3.reason || "no_works"
          };
        }
        const result4 = findProfileVideoCards();
        if (result4.length === 0) {
          const result = parseProfileWorksCount();
          const result2 = describeProfileNoWorksReason("no_video_cards");
          console.log("%c[主页首作评论] " + arg1.nickname + " 未找到作品卡片（解析作品数=" + (result ?? "未知") + "），" + value, "color: #94a3b8; font-style: italic;");
          reportProfileFirstTrace("@" + arg1.nickname + " " + result2, arg1.accountId);
          return {
            success: false,
            noWorks: true,
            worksCount: result ?? 0,
            error: result2,
            errorCode: "no_works",
            diagnostic: "no_video_cards"
          };
        }
        result = result3.worksCount ?? parseProfileWorksCount() ?? result4.length;
        console.log("%c[主页首作评论] " + arg1.nickname + " 检测到 " + result + " 个作品，准备评论首个", "color: #a78bfa; font-style: italic;");
        const value2 = result4[0];
        const value3 = value2?.matches?.("a[href*=\"/video/\"], a[href*=\"/note/\"]") ? value2 : value2?.querySelector?.("a[href*=\"/video/\"], a[href*=\"/note/\"]") || value2;
        const local2 = value3?.href || value3?.getAttribute?.("href") || "";
        let local3 = extractSpecificVideoId(local2) || extractVideoIdFromHref(local2);
        result2 = String(local3 || "").trim();
        reportCurrentAction("正在打开 [" + arg1.nickname + "] 的首个作品...");
        reportProfileFirstTrace("@" + arg1.nickname + " 正在打开首个作品（共 " + result + " 个，DOM/React 点击，videoId=" + (local3 || "待路由识别") + "）", arg1.accountId);
        try {
          window.focus?.();
        } catch (error) {}
        try {
          const local = !!window.__radar_monitor_interaction || !!state.currentTask?.isMonitorAction;
          if (state.currentViewKey && !local) {
            ipcRenderer.send("focus-automation-view", {
              viewKey: state.currentViewKey,
              bringToFront: true
            });
            await ipcRenderer.invoke("ensure-background-automation-layout", {
              viewKey: state.currentViewKey,
              claimInteractionSlot: true,
              requireComposerSurface: true
            });
          }
        } catch (error) {}
        await simulateHumanClick(value3, arg2);
        local = await waitForProfileVideoDetailScope(arg2, local3, {
          maxWaitMs: 6500,
          interactionId: state.currentTask?.interactionId
        });
        if (!local3) {
          local3 = getVideoIdFromPageUrl();
        }
        if (local3) {
          result2 = String(local3).trim();
        }
        if (!local && shouldAbortProfileVideoDetailWait(arg2, state.currentTask?.interactionId)) {
          return {
            success: false,
            error: "aborted",
            worksCount: result
          };
        }
        if (!local && local3) {
          console.log("[Built-in-Debug] [主页首作评论] 点击未拉起详情，保存阶段后用 modal_id 导航: " + local3);
          reportCurrentAction("正在跳转打开首个作品详情 (modal_id=" + local3 + ")...");
          const {
            resumeState: resumeState,
            resumeContext: resumeContext,
            ...local
          } = options;
          const result2 = persistSubviewTaskForResume(state.currentTask, {
            __profileFirstResume: {
              phase: "video_detail",
              interactionId: state.currentTask?.interactionId,
              videoId: local3,
              worksCount: result,
              detailInfo: resumeContext?.detailInfo || {},
              followedNow: !!resumeContext?.followedNow,
              batchCommentOpts: local,
              openMode: "jingxuan",
              navigationAttempt: 1,
              createdAt: Date.now()
            }
          });
          if (!result2) {
            return {
              success: false,
              error: "profile_video_resume_persist_failed",
              worksCount: result
            };
          }
          try {
            window.location.href = toSpecificVideoJingxuanUrl(local3);
            return await new Promise(() => {});
          } catch (error) {
            return {
              success: false,
              error: "profile_video_navigation_failed",
              worksCount: result
            };
          }
        }
        if (!local) {
          reportProfileFirstTrace("@" + arg1.nickname + " 未能识别首个作品 videoId，停止本条，避免在主页误操作", arg1.accountId);
          return {
            success: false,
            error: "profile_video_id_missing",
            worksCount: result
          };
        }
      }
      console.log("[Built-in-Debug] [主页首作评论] 详情层就绪, scope=" + (local?.tagName || "?"));
      let local2 = null;
      const local3 = local || document.body || document;
      const local4 = () => {
        try {
          local2?.stop?.();
        } catch (error) {}
        local2 = null;
        try {
          removeEntityFeedSwipeLock();
        } catch (error) {}
      };
      try {
        pauseVisibleDouyinVideos(local3, "主页首作：进入作品后立即暂停");
        try {
          Array.from(document.querySelectorAll("video, audio")).forEach(arg1 => {
            try {
              arg1.muted = true;
              arg1.autoplay = false;
              arg1.loop = false;
              arg1.pause();
            } catch (error) {}
          });
        } catch (error) {}
        const result3 = getCurrentContentPauseProfile(local3);
        const result4 = Math.min(220, Number(result3.intervalMs) || 220);
        local2 = startCurrentVideoPauseGuard({
          scope: local3,
          leadVideoUrl: window.location.href || "",
          videoTitle: typeof getVideoTitle === "function" ? getVideoTitle() || "" : ""
        }, arg2, {
          pauseOnly: true,
          intervalMs: result4
        });
        try {
          const value = typeof extractSpecificVideoId === "function" ? extractSpecificVideoId(window.location.href) || "" : "";
          installEntityFeedSwipeLock(value);
        } catch (error) {}
        reportProfileFirstTrace("@" + arg1.nickname + " 已启动作品暂停守护（" + result3.label + "，巡检 " + result4 + "ms）", arg1.accountId);
        reportCurrentAction("主页首作：已锁定暂停，防止图文/短片自动切条…");
        const result5 = (() => {
          const local = state.currentTask?.commentMentionNicknames;
          if (Array.isArray(local) && local.some(arg1 => String(arg1 || "").trim())) {
            return true;
          }
          return !!state.currentTask?.enableCommentMention;
        })();
        const local5 = isCommentExpressionEnabled() || result5;
        if (!local5) {
          try {
            if (state.currentViewKey) {
              ipcRenderer.invoke("release-background-automation-layout", {
                viewKey: state.currentViewKey,
                preferReacquireMs: 0
              }).catch(() => {});
            }
          } catch (error) {}
        } else {
          reportProfileFirstTrace("@" + arg1.nickname + " 已开启表情/@，AI 预取期间保持互动执行权", arg1.accountId);
        }
        let local6 = null;
        if (options.prefetchedCommentText && String(options.prefetchedCommentText).trim()) {
          reportProfileFirstTrace("@" + arg1.nickname + " 使用续跑已生成的首作评论文案", arg1.accountId);
        } else if (options.forceAi && !options.forceTemplateOnly) {
          const local = (typeof getVideoTitle === "function" ? getVideoTitle() : "") || "";
          reportProfileFirstTrace(local5 ? "@" + arg1.nickname + " 提前生成首作评论文案（保持互动执行权）" : "@" + arg1.nickname + " 提前生成首作评论文案（不占用互动执行权）", arg1.accountId);
          pingInteractionActivity("profile-first-ai-prefetch", 360000);
          local6 = resolveMainVideoCommentText(local, arg2, {
            useReplyConfig: true,
            forceAi: true,
            forceTemplateOnly: false,
            templateText: options.templateText,
            commentSamples: [],
            allowEmptyText: false
          });
        }
        try {
          window.focus?.();
        } catch (error) {}
        try {
          if (state.currentViewKey) {
            ipcRenderer.send("focus-automation-view", {
              viewKey: state.currentViewKey,
              bringToFront: true
            });
          }
        } catch (error) {}
        await randomDelay(800, 1600, arg2, "等待播放器就绪");
        pauseVisibleDouyinVideos(local3, "主页首作：等待后再次锁定暂停");
        let flag = false;
        let flag2 = false;
        const result6 = clampPercentValue(state.currentTask?.profileFirstWorkLikePercent, 10);
        const result7 = clampPercentValue(state.currentTask?.profileFirstWorkCollectPercent, 10);
        if (shouldRandomLikeFirstWork()) {
          flag = await randomLikeFirstWork(arg2, arg1);
          pauseVisibleDouyinVideos(local3, "主页首作：点赞后再次锁定暂停");
        } else if (isProfileFirstWorkTask() && result6 > 0) {
          reportProfileFirstTrace("@" + arg1.nickname + " 本条未命中点赞概率（" + result6 + "%）", arg1.accountId);
        }
        if (shouldRandomCollectFirstWork()) {
          flag2 = await randomCollectFirstWork(arg2, arg1);
          pauseVisibleDouyinVideos(local3, "主页首作：收藏后再次锁定暂停");
        } else if (isProfileFirstWorkTask() && result7 > 0) {
          reportProfileFirstTrace("@" + arg1.nickname + " 本条未命中收藏概率（" + result7 + "%）", arg1.accountId);
        }
        let text = options.prefetchedCommentText ? String(options.prefetchedCommentText).trim() : "";
        let flag3 = Boolean(text);
        if (local6) {
          text = await local6;
          flag3 = true;
          if (shouldAbort(arg2)) {
            return {
              success: false,
              error: "aborted"
            };
          }
          if (!String(text || "").trim()) {
            reportProfileFirstTrace("@" + arg1.nickname + " AI 未返回可用文案，本条跳过", arg1.accountId);
            return {
              success: false,
              error: "comment_text_unavailable",
              workLiked: flag,
              workCollected: flag2,
              worksCount: result
            };
          }
        }
        if (wasBatchProfileCommentDone(state.currentTask) || arg2 === "SUBVIEW_TASK" && isSubviewInteractionCancelled(getBoundSubviewInteractionId())) {
          reportProfileFirstTrace("@" + arg1.nickname + " 发表前检测到已成功或已抢占，跳过录入", arg1.accountId);
          if (wasBatchProfileCommentDone(state.currentTask)) {
            return {
              success: true,
              profileWorkCommented: true,
              alreadyProfileCommented: true,
              workLiked: flag,
              workCollected: flag2,
              worksCount: result
            };
          }
          return {
            success: false,
            error: "aborted",
            workLiked: flag,
            workCollected: flag2,
            worksCount: result
          };
        }
        reportCurrentAction("正在对 [" + arg1.nickname + "] 的首个作品发表评论（同主贴评论流程）...");
        console.log("%c[主页首作评论] 调用 postVideoComment (与自动发表视频评论一致)", "color: #a78bfa; font-weight: bold;");
        const num = 3;
        const local7 = arg1 => {
          const result = String(arg1?.errorCode || "");
          const result2 = String(arg1?.error || arg1?.reason || "");
          return result === "comment_input_not_found" || result2.includes("comment_input_not_found") || result2.includes("未找到评论输入框");
        };
        const local8 = arg12 => {
          local4();
          const local = arg12 || document.body || document;
          pauseVisibleDouyinVideos(local, "主页首作：重进作品后立即暂停");
          const result = getCurrentContentPauseProfile(local);
          const result3 = Math.min(220, Number(result.intervalMs) || 220);
          local2 = startCurrentVideoPauseGuard({
            scope: local,
            leadVideoUrl: window.location.href || "",
            videoTitle: typeof getVideoTitle === "function" ? getVideoTitle() || "" : ""
          }, arg2, {
            pauseOnly: true,
            intervalMs: result3
          });
          try {
            const value = typeof extractSpecificVideoId === "function" ? extractSpecificVideoId(window.location.href) || result2 || "" : result2 || "";
            installEntityFeedSwipeLock(value);
          } catch (error) {}
          reportProfileFirstTrace("@" + arg1.nickname + " 重进后已重启作品暂停守护（" + result.label + "，巡检 " + result3 + "ms）", arg1.accountId);
        };
        const local9 = async arg12 => {
          if (window.location.pathname.startsWith("/video/") || window.location.pathname.startsWith("/note/")) {
            reportProfileFirstTrace("@" + arg1.nickname + " 独立视频页重新探测输入环境（" + arg12 + "/" + num + "）", arg1.accountId);
            reportCurrentAction("独立视频页重新探测输入框（" + arg12 + "/" + num + "）...");
            local4();
            await sleep(1200);
            return {
              ok: true,
              videoId: result2
            };
          }
          reportProfileFirstTrace("@" + arg1.nickname + " 输入框未出现，关闭作品弹窗后重新进入（" + arg12 + "/" + num + "）", arg1.accountId);
          reportCurrentAction("评论输入框未出现，关闭作品后重新进入（" + arg12 + "/" + num + "）...");
          local4();
          try {
            await closeAllModals(arg2);
          } catch (error) {}
          await sleep(900);
          if (shouldAbort(arg2) || isPageBlank()) {
            return {
              ok: false,
              reason: "aborted_or_hard_fail"
            };
          }
          const result = await waitForProfileWorksReady(arg2, 20000);
          if (!result?.ready || result?.noWorks) {
            return {
              ok: false,
              reason: result?.reason || "works_not_ready"
            };
          }
          const result3 = findProfileVideoCards();
          if (!result3.length) {
            return {
              ok: false,
              reason: "no_video_cards"
            };
          }
          const value = result3[0];
          const value2 = value?.matches?.("a[href*=\"/video/\"], a[href*=\"/note/\"]") ? value : value?.querySelector?.("a[href*=\"/video/\"], a[href*=\"/note/\"]") || value;
          const local2 = value2?.href || value2?.getAttribute?.("href") || "";
          let local3 = extractSpecificVideoId(local2) || extractVideoIdFromHref(local2) || result2;
          try {
            window.focus?.();
          } catch (error) {}
          try {
            const local = !!window.__radar_monitor_interaction || !!state.currentTask?.isMonitorAction;
            if (state.currentViewKey && !local) {
              ipcRenderer.send("focus-automation-view", {
                viewKey: state.currentViewKey,
                bringToFront: true
              });
              await ipcRenderer.invoke("ensure-background-automation-layout", {
                viewKey: state.currentViewKey,
                claimInteractionSlot: true,
                requireComposerSurface: true
              });
            }
          } catch (error) {}
          await simulateHumanClick(value2, arg2);
          let result4 = await waitForProfileVideoDetailScope(arg2, local3 || "", {
            maxWaitMs: 12000,
            interactionId: state.currentTask?.interactionId
          });
          if (!local3) {
            local3 = getVideoIdFromPageUrl();
          }
          if (local3) {
            result2 = String(local3).trim();
          }
          if (!result4) {
            return {
              ok: false,
              reason: "detail_not_ready"
            };
          }
          local = result4;
          local8(result4);
          await randomDelay(600, 1200, arg2, "重进作品后等待播放器就绪");
          pauseVisibleDouyinVideos(result4 || document.body, "主页首作：重进后再次锁定暂停");
          return {
            ok: true,
            videoId: result2
          };
        };
        let local10 = null;
        for (let num2 = 1; num2 <= num; num2 += 1) {
          if (shouldAbort(arg2)) {
            local10 = {
              success: false,
              error: "aborted"
            };
            break;
          }
          pingInteractionActivity("profile-first-typing", 180000);
          local10 = await postVideoComment(document.body, arg2, {
            skipEnableCheck: true,
            countInteraction: false,
            expandScope: true,
            profileVideo: true,
            useReplyConfig: true,
            templateText: options.templateText,
            forceAi: !!options.forceAi,
            forceTemplateOnly: !!options.forceTemplateOnly,
            prefetchedCommentText: text,
            prefetchedCommentResolved: num2 === 1 ? !!flag3 : !!String(text || "").trim(),
            videoId: result2 || getVideoIdFromPageUrl() || ""
          });
          if (local10?.success) {
            break;
          }
          if (!local7(local10)) {
            break;
          }
          if (num2 >= num) {
            reportProfileFirstTrace("@" + arg1.nickname + " 关闭重进已达 " + num + " 次，仍未找到评论输入框", arg1.accountId);
            break;
          }
          const result = await local9(num2 + 1);
          if (!result?.ok) {
            reportProfileFirstTrace("@" + arg1.nickname + " 关闭重进失败（" + clipTraceText(result?.reason || "unknown", 40) + "），停止重试", arg1.accountId);
            break;
          }
        }
        if (!local10?.success && local10?.sendDispatched && !local10?.failureToast && String(local10?.error || "") === "publish_not_verified" && !shouldAbort(arg2)) {
          const result = String(local10?.content || text || "").trim();
          reportProfileFirstTrace("@" + arg1.nickname + " 已触发发送但未确认上墙，加长等待评论区（防双发，不再重发）…", arg1.accountId);
          let flag = false;
          for (let num = 0; num < 6 && !shouldAbort(arg2); num += 1) {
            await sleep(3500);
            try {
              if (result && isSelfCommentPresent(result, document.body)) {
                flag = true;
                break;
              }
              const local = findVisibleMainCommentInput(document.body) || findMainVideoCommentInput(document.body);
              if (local && isCommentNodeStillValid(local, result)) {
                flag = true;
                break;
              }
            } catch (error) {}
          }
          if (!shouldAbort(arg2)) {
            local10 = {
              success: true,
              content: local10?.content || result,
              sendDispatched: true,
              verifiedInferred: true,
              unverifiedSoft: !flag
            };
            reportProfileFirstTrace(flag ? "@" + arg1.nickname + " 加长等待后已确认评论上墙" : "@" + arg1.nickname + " 加长等待仍未刷出列表，按已提交收口（防双发）", arg1.accountId);
          }
        }
        if (local10?.success) {
          try {
            if (typeof markBatchProfileCommentDone === "function") {
              markBatchProfileCommentDone(state.currentTask);
            }
          } catch (error) {}
          await closeAllModals(arg2);
        }
        try {
          document.querySelectorAll("video").forEach(arg1 => {
            if (!arg1.paused) {
              arg1.pause();
            }
          });
        } catch (error) {}
        if (local10?.success) {
          console.log("%c[互动成功] 已在 " + arg1.nickname + " 主页首个作品发表评论", "color: #fff; background: #10b981; padding: 2px 4px; border-radius: 2px;");
          reportProfileFirstTrace("@" + arg1.nickname + " 首作评论成功 →「" + clipTraceText(local10.content || "", 32) + "」", arg1.accountId);
          return {
            success: true,
            content: local10.content,
            profileWorkCommented: true,
            workLiked: flag,
            workCollected: flag2,
            worksCount: result
          };
        }
        const local11 = local10?.error || local10?.reason || "post_failed";
        console.warn("[主页首作评论] postVideoComment 未成功 (" + local11 + ")");
        reportProfileFirstTrace("@" + arg1.nickname + " 首作评论失败（" + clipTraceText(local11, 60) + "）", arg1.accountId);
        return {
          success: false,
          error: local11,
          workLiked: flag,
          workCollected: flag2,
          worksCount: result
        };
      } finally {
        local4();
      }
    } catch (error) {
      console.warn("[主页首作评论] 异常:", error.message || error);
      return {
        success: false,
        error: error.message || "unknown"
      };
    }
  }
  async function postVideoComment(arg1, arg2, options = {}) {
    const {
      skipEnableCheck = false,
      countInteraction = true,
      expandScope = false,
      profileVideo = false
    } = options;
    if (!skipEnableCheck && !state.currentTask?.enableVideoComment) {
      return false;
    }
    if (!hasCommentRuntimeReady()) {
      console.warn("[Built-in-Debug] [RuntimeConfig] commentV2 未就绪，跳过视频主评");
      reportTraceLog("⚠ 功能不可用：评论配置未就绪，请检查网络后重试", null, "warning");
      return {
        success: false,
        error: "runtime_config_missing"
      };
    }
    const value = options.useReplyConfig != null ? !!options.useReplyConfig : !!profileVideo;
    const local2 = options.videoKey || "";
    if (!value && local2 && hasVideoMainCommented(local2)) {
      reportTraceLog("📝 视频主评：本账号已评论过此视频，跳过重复发表", null, "warning");
      return {
        success: false,
        skipped: true,
        reason: "already_commented"
      };
    }
    return withBackgroundAutomationLayout(async () => {
      state.lastTrustedClickDiagnostic = "none";
      const flag = !value;
      const result = allowEmptyCommentText(flag, value);
      snapshotAttachmentFlags(flag, {
        profileFirst: value
      });
      rollMentionProbability(flag);
      const result2 = hasCommentNonTextPayload(flag);
      const local3 = result;
      const result3 = Date.now();
      const num = 60000;
      const value2 = result3 + (profileVideo ? num : 55000);
      const result4 = String(options.videoId || getVideoIdFromPageUrl() || extractSpecificVideoId(window.location.href) || "").trim();
      const local4 = () => {
        if (!profileVideo) {
          return true;
        }
        if (!result4) {
          return !isPageBlank();
        }
        const result = String(getVideoIdFromPageUrl() || extractSpecificVideoId(window.location.href) || "").trim();
        if (!result) {
          return !isPageBlank();
        }
        return result === result4;
      };
      try {
        const list = [];
        if (arg1) {
          list.push(arg1);
        }
        if (arg1 !== document.body && !list.includes(document.body)) {
          list.push(document.body);
        }
        if (list.length === 0) {
          list.push(document.body);
        }
        console.log("%c[拟人操作] 正在探测视频主贴评论区...", "color: #a5b4fc; font-style: italic;");
        const local = (typeof getVideoTitle === "function" ? getVideoTitle() : "") || "";
        let value3 = Array.isArray(options.commentSamples) ? options.commentSamples.filter(Boolean) : [];
        const obj = {
          useReplyConfig: options.useReplyConfig != null ? !!options.useReplyConfig : !!profileVideo,
          templateText: options.templateText,
          forceAi: !!options.forceAi,
          forceTemplateOnly: !!options.forceTemplateOnly,
          prefetchedCommentText: options.prefetchedCommentText || "",
          allowEmptyText: result
        };
        let value4 = options.prefetchedCommentResolved ? Promise.resolve(options.prefetchedCommentText == null ? null : String(options.prefetchedCommentText)) : null;
        const local5 = (arg1 = value3) => {
          if (value4) {
            return value4;
          }
          value4 = resolveMainVideoCommentText(local, arg2, {
            ...obj,
            commentSamples: Array.isArray(arg1) ? arg1 : []
          });
          return value4;
        };
        const local6 = shouldUseAiComment(options) && !local3;
        const local7 = !!options.prefetchedCommentResolved || !!String(options.prefetchedCommentText || "").trim();
        if (!local6 || local7 || value3.length > 0) {
          if (local6 && !local7) {
            reportTraceLog("🤖 视频主评：与界面探测并行生成文案…");
          }
          local5(value3);
        }
        reportTraceLog("📝 视频主评：正在打开评论区…");
        reportCommentFlowTrace("打开评论区", profileVideo ? "profileVideo" : "video");
        focusCurrentAutomationViewForComment();
        if (profileVideo) {
          if (!isProfileCommentUiVisible()) {
            await openProfileVideoCommentPanel(arg2, {
              deadlineAt: value2
            });
          }
          await ensureCommentPanelOpen(document.body, arg2, {
            profileVideo: true,
            forMainPost: true,
            deadlineAt: value2
          });
          focusCurrentAutomationViewForComment();
        } else {
          await ensureCommentPanelOpen(arg1 || document.body, arg2, {
            forMainPost: true,
            deadlineAt: value2
          });
        }
        if (local6 && !value4) {
          if (!value3.length) {
            const value = getDouyinFeedScope() ? document : arg1 || document.body;
            value3 = sampleVisibleCommentTexts(value, 8);
          }
          reportTraceLog("🤖 视频主评：与界面探测并行生成文案…");
          local5(value3);
        } else if (!value4) {
          local5(value3);
        }
        reportTraceLog("📝 视频主评：正在寻找评论输入框…");
        try {
          console.log("[Built-in-Debug] [主评环境] " + describeMainCommentInputEnvironment(arg1));
        } catch (error) {}
        focusCurrentAutomationViewForComment();
        const result2 = getMergedCommentInputSelector();
        const result4 = getDraftEditorSelector();
        const result5 = getMainCommentInputShellSelector();
        const result6 = getCommentItemSelector();
        const result7 = getCommentTabPrefix();
        let result8 = findMainVideoCommentInput(arg1 || document);
        if (!result8) {
          result8 = await prepareCommentEnvironment(arg1 || document, arg2, 3, {
            profileVideo: profileVideo,
            deadlineAt: value2
          });
        }
        const value5 = profileVideo ? 4 : 6;
        let local8 = value5;
        let flag2 = false;
        let flag3 = false;
        for (let num = 0; !result8 && num < local8 && Date.now() < value2; num++) {
          if (shouldAbort(arg2)) {
            return buildMainCommentAbortResult("while_finding_input", arg2);
          }
          if (num === 0 || num === 3) {
            focusCurrentAutomationViewForComment();
          }
          for (const item of list) {
            if (num <= 1) {
              try {
                const value = result2 ? Array.from(item.querySelectorAll(result2)).filter(arg1 => isVisibleElement(arg1) && isElementInViewportForAutomation(arg1)).slice(0, 8).map((arg1, arg2) => {
                  const result = arg1.getBoundingClientRect();
                  const result2 = (arg1.getAttribute("placeholder") || "").trim();
                  return "[#" + arg2 + "] " + arg1.tagName + " class=\"" + (arg1.className || "").toString().slice(0, 50) + "\" ph=\"" + result2 + "\" rect=" + Math.round(result.left) + "," + Math.round(result.top) + "," + Math.round(result.width) + "x" + Math.round(result.height) + " ce=" + (arg1.getAttribute("contenteditable") || "");
                }) : [];
                if (value.length) {
                  flag3 = true;
                }
                console.log("[Built-in-Debug] [主贴评论探测] 第 " + (num + 1) + " 轮输入节点采样(" + value.length + "):\n" + value.join("\n"));
              } catch (error) {}
            }
            try {
              const value = result4 ? Array.from(item.querySelectorAll(result4)) : [];
              const value3 = value.filter(arg1 => isVisibleElement(arg1) && isElementInViewportForAutomation(arg1)).filter(arg1 => {
                if (result6) {
                  try {
                    if (arg1.closest(result6)) {
                      return false;
                    }
                  } catch (error) {}
                }
                return !arg1.closest("[class*=\"comment-item\"], [class*=\"CommentItem\"]");
              }).sort((arg1, arg2) => arg2.getBoundingClientRect().bottom - arg1.getBoundingClientRect().bottom)[0];
              if (value3) {
                await simulateHumanClick(value3, arg2, {
                  deadlineAt: value2
                });
                await sleepWithinDeadline(220, value2);
                result8 = value3;
                const result = result8.getBoundingClientRect();
                console.log("%c[拟人操作] 直接命中 DraftEditor 主输入: (" + Math.round(result.left) + ", " + Math.round(result.top) + ")", "color: #22c55e; font-weight: bold;");
                break;
              }
            } catch (error) {}
            try {
              const value = result5 ? Array.from(item.querySelectorAll(result5)).filter(arg1 => isVisibleElement(arg1) && isElementInViewportForAutomation(arg1)).filter(arg1 => !arg1.closest("[class*=\"comment-item\"], [class*=\"CommentItem\"]")).sort((arg1, arg2) => arg2.getBoundingClientRect().bottom - arg1.getBoundingClientRect().bottom) : [];
              if (value[0]) {
                await simulateTrustedElementClick(value[0], arg2, "主评输入容器", {
                  deadlineAt: value2
                });
                await sleepWithinDeadline(350, value2);
                const result = findMainVideoCommentInput(item) || resolveMainCommentWritableElement(value[0]) || resolveMainCommentWritableElement(document.activeElement);
                if (result) {
                  result8 = result;
                  const result2 = result8.getBoundingClientRect();
                  console.log("%c[拟人操作] 命中真实评论输入容器并捕获编辑器: (" + Math.round(result2.left) + ", " + Math.round(result2.top) + ")", "color: #22c55e; font-weight: bold;");
                  break;
                }
              }
            } catch (error) {}
            try {
              const value = result7 ? Array.from(item.querySelectorAll("div, span")).filter(arg1 => isVisibleElement(arg1) && arg1.textContent.trim().startsWith(result7)) : [];
              if (value.length > 0) {
                const result = value.find(arg1 => arg1.className.includes("active") || arg1.getAttribute("aria-selected") === "true");
                if (!result) {
                  console.log("[Built-in-Debug] [页签] 评论页签未激活，尝试切换...");
                  await simulateHumanClick(value[0], arg2, {
                    deadlineAt: value2
                  });
                  await sleepWithinDeadline(1200, value2);
                }
              }
            } catch (error) {}
            const result = Array.from(item.querySelectorAll("div, span, p, i, textarea[placeholder], input[placeholder], [contenteditable=\"true\"][data-placeholder], [role=\"textbox\"][aria-label]")).filter(arg1 => {
              const result = isMainCommentPlaceholderCandidate(arg1, {
                requireViewport: false,
                profileVideo: profileVideo
              });
              if (result) {
                flag3 = true;
              }
              return result;
            }).sort((arg1, arg2) => scoreMainCommentPlaceholderCandidate(arg2) - scoreMainCommentPlaceholderCandidate(arg1));
            let result3 = result.filter(arg1 => profileVideo ? isElementInViewport(arg1) : isElementInViewportForAutomation(arg1));
            if (!result3.length && result[0]) {
              try {
                safeScrollTargetIntoView(result[0], {
                  force: true,
                  block: "nearest"
                });
                await sleepWithinDeadline(220, value2);
                result3 = result.filter(arg1 => profileVideo ? isElementInViewport(arg1) : isElementInViewportForAutomation(arg1));
              } catch (error) {}
            }
            const list = [];
            const set = new Set();
            for (const item of result3) {
              const result = item.getBoundingClientRect();
              const value = Math.round((result.left + result.width / 2) / 6) + "_" + Math.round((result.top + result.height / 2) / 6);
              if (set.has(value)) {
                continue;
              }
              set.add(value);
              list.push(item);
              if (list.length >= (profileVideo ? 1 : 2)) {
                break;
              }
            }
            if (result3.length > 0) {
              console.log("[Built-in-Debug] [激活探测] 发现 " + result3.length + " 个候选占位符（去重后 " + list.length + " 个）:\n                    " + list.map((arg1, arg2) => "  [" + arg2 + "] \"" + getCommentPlaceholderText(arg1) + "\" at Y=" + Math.round(arg1.getBoundingClientRect().top)).join("\n"));
            }
            const value = list[0];
            if (value) {
              const local = value.closest("div[class*=\"comment\"], div[class*=\"input\"], div[class*=\"area\"]") || value;
              console.log("[Built-in-Debug] [饱和激活] 准备对 " + list.length + " 个去重候选点执行点击...");
              window.focus?.();
              for (let num = 0; num < list.length; num++) {
                const value = list[num];
                const local = value.closest("div[class*=\"comment\"], div[class*=\"input\"], div[class*=\"area\"]") || value;
                const result = local.getBoundingClientRect();
                const result2 = Math.round(result.left + result.width / 2);
                const result3 = Math.round(result.top + result.height / 2);
                if (result.width < 12 || result.height < 12 || result2 <= 5 || result3 <= 5) {
                  continue;
                }
                const result4 = document.elementFromPoint(result2, result3);
                if (result4 && !local.contains(result4) && result4 !== local) {
                  const value = result4.style.pointerEvents;
                  result4.style.setProperty("pointer-events", "none", "important");
                  await simulateTrustedElementClick(local, arg2, "主评占位符" + (num + 1), {
                    deadlineAt: value2
                  });
                  setTimeout(() => {
                    if (result4) {
                      result4.style.pointerEvents = value;
                    }
                  }, 500);
                } else {
                  await simulateTrustedElementClick(local, arg2, "主评占位符" + (num + 1), {
                    deadlineAt: value2
                  });
                }
                local.focus?.();
                value.focus?.();
                const result5 = findMainVideoCommentInput(item) || resolveMainCommentWritableElement(local) || resolveMainCommentWritableElement(value) || resolveMainCommentWritableElement(document.activeElement);
                if (result5) {
                  result8 = result5;
                  break;
                }
              }
              if (result8) {
                break;
              }
              const result = value.getBoundingClientRect();
              const result2 = Array.from(value.parentElement?.querySelectorAll("svg") || []).filter(arg1 => {
                if (!isVisibleElement(arg1) || !isElementInViewportForAutomation(arg1)) {
                  return false;
                }
                const result2 = arg1.getBoundingClientRect();
                const local = result2.left >= result.left - 50 && result2.top >= result.top - 20;
                const result3 = Math.sqrt(Math.pow(result2.top - result.top, 2) + Math.pow(result2.left - result.left, 2));
                return local && result3 < 120;
              });
              if (result2.length > 0) {
                console.log("[Built-in-Debug] [诱导激活] 发现身边的功能图标 (" + result2.length + "个)，尝试诱导...");
                await simulateHumanClick(result2[0], arg2, {
                  deadlineAt: value2
                });
                if (result2[0].parentElement) {
                  await simulateHumanClick(result2[0].parentElement, arg2, {
                    deadlineAt: value2
                  });
                }
              }
              try {
                const obj = {
                  bubbles: true,
                  cancelable: true,
                  view: window
                };
                local.dispatchEvent(new mouseEvent("mouseover", obj));
                local.dispatchEvent(new mouseEvent("mouseenter", obj));
                local.focus?.();
                await simulateHumanClick(local, arg2, {
                  deadlineAt: value2
                });
                if (num % 2 === 1) {
                  await simulateHumanClick(value, arg2, {
                    deadlineAt: value2
                  });
                }
              } catch (error) {}
              await sleepWithinDeadline(profileVideo ? 700 : 1200, value2);
            }
            const result9 = findMainVideoCommentInput(item) || resolveMainCommentWritableElement(document.activeElement);
            if (result9) {
              result8 = result9;
              const result = result8.getBoundingClientRect();
              console.log("%c[拟人操作] 成功捕获主贴编辑器! 坐标: (" + Math.round(result.left) + ", " + Math.round(result.top) + ")", "color: #22c55e; font-weight: bold;");
              break;
            }
          }
          if (!result8 && num > 2) {
            console.log("[Built-in-Debug] [探测中] 第 " + (num + 1) + " 次尝试，仍未捕获到编辑器...");
            if (num === 3 || num === 5) {
              reportTraceLog("📝 视频主评：仍在寻找输入框（第 " + (num + 1) + " 轮）…");
            }
          }
          if (!result8 && (num === 1 || num === 3 || num === 5)) {
            const result = ((Date.now() - result3) / 1000).toFixed(1);
            reportCommentFlowTrace("输入框等待中", result + "s", "warning");
            try {
              console.log("[Built-in-Debug] [主评环境] 等待第" + (num + 1) + "轮 " + describeMainCommentInputEnvironment(arg1));
            } catch (error) {}
          }
          if (result8) {
            break;
          }
          if (!result8 && profileVideo && num === 1) {
            focusCurrentAutomationViewForComment();
            reportTraceLog("📝 视频主评：提前启用可信点击兜底…");
            result8 = await prepareCommentEnvironment(arg1, arg2, 4, {
              profileVideo: true,
              deadlineAt: value2
            });
            if (result8) {
              break;
            }
            flag3 = true;
          }
          if (!result8 && !profileVideo && (num === 2 || num === 5 || num === 8 || flag2 && num === 14)) {
            await ensureCommentPanelOpen(arg1 || document.body, arg2, {
              forMainPost: true,
              deadlineAt: value2
            });
            flag3 = true;
          }
          if (options.profileVideo && !result8 && (num === 2 || num === 4)) {
            focusCurrentAutomationViewForComment();
            await openProfileVideoCommentPanel(arg2, {
              deadlineAt: value2
            });
            flag3 = true;
          }
          if (!flag2 && flag3 && num >= value5 - 1 && !result8) {
            local8 = getExtendedReadyRounds(value5, {
              progress: true,
              hardCapRounds: profileVideo ? 12 : 16
            });
            if (local8 > value5) {
              flag2 = true;
              console.log("[Built-in-Debug] [慢环境] 主评输入区仍在加载，延长探测 " + value5 + "→" + local8 + " 轮");
              reportCurrentAction("评论输入加载较慢，继续等待…");
            }
          }
          if (!result8 && (num === 2 || num === 5 || flag2 && num === 8)) {
            focusCurrentAutomationViewForComment();
            result8 = await prepareCommentEnvironment(arg1 || document, arg2, profileVideo ? 3 : 4, {
              profileVideo: profileVideo,
              deadlineAt: value2
            });
            if (result8) {
              break;
            }
          }
          await sleepWithinDeadline(profileVideo ? 400 + num * 90 : 550 + num * 120, value2);
        }
        if (!result8) {
          reportTraceLog("📝 视频主评：常规探测未命中，启用深度兜底激活与展开…");
          focusCurrentAutomationViewForComment();
          if (Date.now() < value2) {
            await ensureCommentPanelOpen(arg1 || document.body, arg2, {
              profileVideo: profileVideo,
              forMainPost: true,
              deadlineAt: value2
            }).catch(() => {});
          }
          if (Date.now() < value2) {
            await sleepWithinDeadline(Math.min(700, value2 - Date.now()), value2);
            result8 = await prepareCommentEnvironment(arg1, arg2, profileVideo ? 5 : 8, {
              profileVideo: profileVideo,
              deadlineAt: value2
            });
          }
        }
        if (!result8 && profileVideo && Date.now() < value2) {
          reportTraceLog("📝 首作评论：在剩余预算内最终捕获输入框…");
          result8 = findMainVideoCommentInput(arg1 || document.body) || (await prepareCommentEnvironment(arg1, arg2, 2, {
            profileVideo: true,
            deadlineAt: value2
          }));
          if (!result8) {
            const local = getVideoIdFromPageUrl() || options.videoId || extractSpecificVideoId(window.location.href);
            const isAlreadyDirect = window.location.pathname.startsWith("/video/") || window.location.pathname.startsWith("/note/");
            if (local && !isAlreadyDirect) {
              console.log("[Built-in-Debug] [主页首作评论] 内嵌弹窗未挂载编辑器，自动跳转独立视频页: " + local);
              reportTraceLog("📝 首作评论：主页弹窗输入框未挂载，自动跳转独立视频页评论…");
              try {
                let resolvedComment = options.prefetchedCommentText || "";
                if (!resolvedComment && value4) {
                  try {
                    resolvedComment = await Promise.race([value4, sleepWithinDeadline(2000, value2)]);
                  } catch (e) {}
                }
                const resumePayload = {
                  phase: "video_detail",
                  interactionId: state.currentTask?.interactionId,
                  videoId: local,
                  worksCount: Number(state.currentTask?.lead?.worksCount ?? 0),
                  detailInfo: {},
                  followedNow: false,
                  batchCommentOpts: {
                    useReplyConfig: options.useReplyConfig != null ? !!options.useReplyConfig : true,
                    templateText: options.templateText,
                    forceAi: !!options.forceAi,
                    forceTemplateOnly: !!options.forceTemplateOnly,
                    prefetchedCommentText: resolvedComment || "",
                    prefetchedCommentResolved: !!resolvedComment
                  },
                  openMode: "direct",
                  navigationAttempt: 2,
                  createdAt: Date.now()
                };
                persistSubviewTaskForResume(state.currentTask, {
                  __profileFirstResume: resumePayload
                });
                window.location.href = toSpecificVideoDirectUrl(local);
                return await new Promise(() => {});
              } catch (error) {}
            }
          }
        }
        if (!result8 && (profileVideo || state.currentTask?.isBatchAction || options.useReplyConfig) && !shouldAbort(arg2)) {
          reportCommentFlowTrace("评论输入框超时，软重试", null, "warning");
          try {
            console.log("[Built-in-Debug] [主评环境] 软重试前 " + describeMainCommentInputEnvironment(arg1));
          } catch (error) {}
          if (profileVideo || options.useReplyConfig) {
            const result = Math.max(0, value2 - Date.now());
            reportProfileFirstTrace(result > 800 ? "未找到评论输入框，当前仍在作品内则继续等待（剩余 " + (result / 1000).toFixed(1) + " 秒，总上限 1 分钟）" : "未找到评论输入框，同视频等待已满 1 分钟，交由上层关闭弹窗重进");
            while (!result8 && Date.now() < value2 && !shouldAbort(arg2) && local4() && !isPageBlank()) {
              focusCurrentAutomationViewForComment();
              const result = Math.min(value2, Date.now() + 8000);
              try {
                await openProfileVideoCommentPanel(arg2, {
                  deadlineAt: result
                });
                await ensureCommentPanelOpen(document.body, arg2, {
                  profileVideo: true,
                  forMainPost: true,
                  deadlineAt: result
                });
              } catch (error) {}
              result8 = findMainVideoCommentInput(arg1 || document.body) || (await prepareCommentEnvironment(arg1, arg2, 4, {
                profileVideo: true,
                deadlineAt: result
              }));
              if (result8) {
                reportCommentFlowTrace("同视频等待已找到输入框");
                reportProfileFirstTrace("同视频等待期间已出现评论输入框");
                break;
              }
              await sleepWithinDeadline(900, value2);
            }
            if (!result8 && !local4()) {
              reportProfileFirstTrace("已离开当前作品，停止原地等待输入框");
            }
          } else {
            await waitPageReadyInPlace(arg2, "评论输入框未出现");
            if (!shouldAbort(arg2) && !isPageBlank()) {
              focusCurrentAutomationViewForComment();
              const value = Date.now() + 24000;
              try {
                await ensureCommentPanelOpen(arg1 || document.body, arg2, {
                  forMainPost: true,
                  deadlineAt: value
                });
              } catch (error) {}
              result8 = findMainVideoCommentInput(arg1 || document.body) || (await prepareCommentEnvironment(arg1, arg2, 8, {
                profileVideo: false,
                deadlineAt: value
              }));
              if (result8) {
                reportCommentFlowTrace("软重试已找到输入框");
                try {
                  console.log("[Built-in-Debug] [主评环境] " + describeMainCommentInputEnvironment(arg1));
                } catch (error) {}
              }
            }
          }
        }
        if (result8) {
          const result2 = ((Date.now() - result3) / 1000).toFixed(1);
          reportCommentFlowTrace("已找到输入框", result2 + "s");
          try {
            console.log("[Built-in-Debug] [主评环境] 捕获耗时 " + result2 + "s " + describeMainCommentInputEnvironment(arg1));
          } catch (error) {}
          if (!value4) {
            local5(value3);
          }
          const result4 = await value4;
          if (shouldAbort(arg2)) {
            return buildMainCommentAbortResult("after_generating_text", arg2);
          }
          if (value) {
            reportProfileFirstTrace("文案策略：replyNoText=" + !!state.currentTask?.enableCommentWithoutText + " videoNoText=" + !!state.currentTask?.enableVideoCommentWithoutText + " allowEmpty=" + !!result);
          }
          if (!result4 && !result) {
            if (shouldUseAiComment(options)) {
              reportProfileFirstTrace("AI 未返回可用文案，已跳过（不使用「赞同」等模板）");
            } else if (options.useReplyConfig || options.profileVideo) {
              reportProfileFirstTrace("未获取到评论文案，已跳过");
            }
            return {
              success: false,
              error: "comment_text_unavailable"
            };
          }
          const result5 = applyRiskyEmojiReplaceForComment(String(result4 || ""), value ? "profile" : "comment");
          if (!result5.trim() && result) {
            applyAttachmentFallback(flag, {
              profileFirst: value
            });
            const result = describeActiveAttachments(flag);
            if (options.useReplyConfig || profileVideo) {
              reportProfileFirstTrace("准备发表评论 →「" + result + "」");
            } else {
              reportTraceLog("📝 视频主评：正文为空，将仅发送" + result);
            }
          }
          if ((options.useReplyConfig || profileVideo) && result5.trim()) {
            reportProfileFirstTrace("准备发表评论 →「" + clipTraceText(result5, 32) + "」");
          }
          const local = result5.trim() || describeActiveAttachments(flag);
          console.log("%c[互动动作] 正在录入视频评论: \"" + local + "\"", "color: #fff; background: #059669; padding: 2px 4px; border-radius: 2px;");
          const value2 = value ? isImageAttachmentActive() : isVideoImageAttachmentActive();
          const value5 = value ? isCommentExpressionActive() : isVideoCommentExpressionActive();
          const obj = {
            attachCommentImage: value2,
            attachCommentExpression: value5,
            isVideoComment: flag,
            profileVideo: value,
            publishScope: arg1 || document.body
          };
          let local3 = null;
          try {
            local3 = await sendReplyToComment(result8, result5, arg2, obj);
          } catch (error) {
            const value = error?.message === "TASK_ABORTED";
            reportCommentFlowTrace(value ? "录入发表被中断" : "录入发表异常", value ? describeTaskAbortReason(arg2) : clipTraceText(error?.message || error, 60), "warning");
            if (value) {
              return {
                success: false,
                error: "task_aborted_during_submit",
                content: result5 || local,
                aborted: true
              };
            }
            const result = await confirmCommentSent(result8, result5, {
              sendDispatched: true
            }, arg1 || document.body);
            if (result) {
              local3 = {
                success: true,
                sendDispatched: true,
                recoveredAfterError: true
              };
            } else {
              throw error;
            }
          }
          const local4 = arg1 || document.body;
          const value6 = value ? 2 : 3;
          for (let num = 2; num <= value6 && !local3?.success && !shouldAbort(arg2); num++) {
            if (await confirmCommentSent(result8, result5, local3, local4)) {
              reportCommentFlowTrace("重试前校验", "评论区已出现本账号评论，视为发表成功");
              local3 = {
                success: true,
                sendDispatched: true,
                inferredBeforeRetry: true
              };
              break;
            }
            if (local3?.sendDispatched) {
              const value2 = value ? 12 : 6;
              const value3 = value ? 800 : 500;
              reportCommentFlowTrace("重试前防双发等待", value ? "首作已派发发送，加长确认评论区（不再急着重点发送）…" : "已派发过发送，额外确认评论区…");
              for (let num = 0; num < value2 && !shouldAbort(arg2); num += 1) {
                await sleep(value3);
                if (await confirmCommentSent(result8, result5, local3, local4)) {
                  reportCommentFlowTrace("重试前校验", "延迟确认后评论已上墙，取消重发");
                  local3 = {
                    success: true,
                    sendDispatched: true,
                    inferredBeforeRetry: true
                  };
                  break;
                }
                const local = findVisibleMainCommentInput(local4) || result8;
                if (isCommentNodeStillValid(local, result5)) {
                  reportCommentFlowTrace("重试前容错", "草稿已空且无失败提示，按已发表处理");
                  local3 = {
                    success: true,
                    sendDispatched: true,
                    verifiedInferred: true
                  };
                  break;
                }
              }
              if (local3?.success) {
                break;
              }
              if (value) {
                reportProfileFirstTrace("已触发发送但评论区确认偏慢，为防双发不再补点；按已提交处理");
                local3 = {
                  success: true,
                  sendDispatched: true,
                  verifiedInferred: true,
                  unverifiedSoft: true
                };
                break;
              }
            }
            reportTraceLog("📝 视频主评：发表未成功，" + num + "/" + value6 + " 次重试（可能因并行账号布局刷新）…", null, "warning");
            await randomDelay(1200, 2200, arg2, "评论发表重试等待");
            if (shouldAbort(arg2)) {
              break;
            }
            const local = (await prepareCommentEnvironment(arg1, arg2, profileVideo ? 14 : 6, {
              profileVideo: profileVideo
            })) || result8;
            try {
              const result = textMatchesTarget(local, result5);
              if (result) {
                reportCommentFlowTrace("重试策略", "输入框已有目标文案，仅重新发送");
              }
              if (!result && isCommentNodeStillValid(local, result5)) {
                reportCommentFlowTrace("跳过重发", "草稿已空，继续等待评论区确认而不再点击发送");
                if (await confirmCommentSent(local, result5, {
                  sendDispatched: true
                }, local4)) {
                  local3 = {
                    success: true,
                    sendDispatched: true,
                    inferredBeforeRetry: true
                  };
                  break;
                }
                continue;
              }
              local3 = await sendReplyToComment(local, result5, arg2, {
                ...obj,
                resendOnly: result
              });
            } catch (error) {
              if (error?.message === "TASK_ABORTED") {
                reportCommentFlowTrace("重试被中断", describeTaskAbortReason(arg2), "warning");
                break;
              }
              if (await confirmCommentSent(local, result5, {
                sendDispatched: true
              }, local4)) {
                local3 = {
                  success: true,
                  sendDispatched: true,
                  recoveredAfterError: true
                };
                break;
              }
              throw error;
            }
          }
          if (!local3?.success && (await confirmCommentSent(result8, result5, local3, local4))) {
            reportCommentFlowTrace("最终校验", "评论区已出现本账号评论，视为发表成功");
            local3 = {
              success: true,
              sendDispatched: !!local3?.sendDispatched,
              inferredAfterSubmit: true
            };
          }
          reportCommentFlowTrace("submit 返回", "success=" + !!local3?.success + " error=" + (local3?.error || "none"));
          if (local3?.success) {
            console.log("%c[互动成功] 视频主贴评论已发表", "color: #fff; background: #10b981; padding: 2px 4px; border-radius: 2px;");
            if (options.useReplyConfig || profileVideo) {
              reportProfileFirstTrace("评论已提交 →「" + clipTraceText(local, 32) + "」");
            }
            if (countInteraction) {
              incrementInteractionCount();
            }
            if (!value && local2) {
              rememberVideoMainComment(local2);
              ipcRenderer.invoke("record-video-main-comment", {
                url: local2,
                title: options.videoTitle || "",
                platform: window._radar_platform || "douyin",
                accountId: window._radar_account_id,
                content: String(result5 || local || "").trim()
              }).catch(() => {});
            }
            if (!value && typeof ipcRenderer !== "undefined") {
              ipcRenderer.send("automation-data", {
                type: "video-comment-posted",
                payload: {
                  accountId: window._radar_account_id
                }
              });
            }
            return {
              success: true,
              content: result5 || local
            };
          }
          const local6 = local3?.error || "录入或发送失败";
          console.warn("[Built-in-Debug] [主贴评论] " + local6);
          if (options.useReplyConfig || profileVideo) {
            reportProfileFirstTrace("评论失败（" + clipTraceText(local6, 40) + "）");
          }
          return {
            success: false,
            error: local6,
            content: result5 || local,
            sendDispatched: !!local3?.sendDispatched,
            failureToast: local3?.failureToast || null,
            errorCode: local3?.errorCode
          };
        } else {
          console.warn("[交互警告] 超时未找到视频主贴评论输入框，请检查评论面板是否已完全展开");
          reportCommentFlowTrace("评论输入框超时", ((Date.now() - result3) / 1000).toFixed(1) + "s", "warning");
          try {
            console.log("[Built-in-Debug] [主评环境] 超时 " + describeMainCommentInputEnvironment(arg1));
          } catch (error) {}
          reportTraceLog("📝 视频主评：未找到评论输入框（超时）", null, "warning");
          if (options.useReplyConfig || profileVideo) {
            reportProfileFirstTrace("未找到评论输入框，超时跳过");
          }
          return {
            success: false,
            error: "未找到评论输入框（超时，可重试）",
            errorCode: "comment_input_not_found",
            diagnostic: describeMainCommentInputEnvironment(arg1)
          };
        }
      } finally {
        local = null;
        state.currentActionMentionRolled = null;
      }
      return {
        success: false,
        error: "未找到评论输入框（超时，可重试）",
        errorCode: "comment_input_not_found"
      };
    }, {
      requireComposerSurface: true,
      preferReacquireMs: value && state.currentTask?.canDM ? 10000 : 0
    });
  }
  async function performReply(arg1, arg2, arg3, arg4 = null, options = {}) {
    return withBackgroundAutomationLayout(async () => {
      if (!state.currentTask?.enableComment) {
        return buildReplyFailureResult("reply_disabled", "当前任务未开启自动回复");
      }
      if (!hasCommentRuntimeReady()) {
        console.warn("[Built-in-Debug] [RuntimeConfig] commentV2 未就绪，跳过回复");
        return buildReplyFailureResult("runtime_config_missing", "功能不可用，请检查网络后重试");
      }
      snapshotAttachmentFlags(false);
      rollMentionProbability(false);
      try {
        const result = await locateTargetCommentNode(arg1, arg2, arg3, {
          fastLocate: !!options.fastLocate,
          onProgress: typeof options.onProgress === "function" ? options.onProgress : null
        });
        if (!result) {
          console.warn("[Built-in-Debug] [回复] 失败: 找不到目标评论节点 (" + arg2.nickname + ")");
          return buildReplyFailureResult("target_comment_not_found", "未找到 @" + (arg2.nickname || "目标用户") + " 的原评论，可能已刷新、折叠或页面发生变化");
        }
        if (isDouyinSecondaryCommentNode(result) || nodeContainsSecondaryComment(result)) {
          const result2 = describeCommentNode(result, arg2);
          console.warn("[Built-in-Debug] [回复] 跳过作者/二级评论: " + result2);
          reportTraceLog("⚠ 跳过回复：命中作者回复或二级评论（" + result2 + "）", null, "warning");
          return buildReplyFailureResult("author_or_reply_comment", "定位到作者回复或二级评论，已跳过（@" + (arg2.nickname || "目标用户") + "）");
        }
        const result2 = clipTraceText((arg2.content || "").trim(), 24);
        const result3 = describeCommentNode(result, arg2);
        reportTraceLog("💬 已定位评论：" + result3 + (result2 ? "「" + result2 + "」" : "") + "，准备点击回复");
        const result4 = findReplyControlInComment(result);
        if (result4) {
          const result2 = isSecondaryCommentWithin(result4, result);
          const result5 = String(result4.textContent || "").replace(/\s+/g, " ").trim().slice(0, 8);
          reportTraceLog("💬 回复按钮：文案「" + (result5 || "回复") + "」归属主评=" + (result2 ? "是" : "否"));
          if (!result2) {
            reportTraceLog("⚠ 回复按钮落在嵌套回复上，已跳过，避免回给作者", null, "warning");
            return buildReplyFailureResult("author_or_reply_comment", "回复按钮落在作者/二级评论上，已跳过（@" + (arg2.nickname || "目标用户") + "）");
          }
          console.log("[Built-in-Debug] [回复] 发起: " + arg2.nickname + " " + result3);
          try {
            const local = (typeof findCommentScrollContainer === "function" ? findCommentScrollContainer(document) : null) || (typeof resolveCommentPanelRoot === "function" ? resolveCommentPanelRoot(document.body) : null);
            if (local && local.contains(result4)) {
              const result = result4.getBoundingClientRect();
              const result2 = local.getBoundingClientRect();
              const value = result.top + result.height / 2 - (result2.top + result2.height * 0.42);
              if (Math.abs(value) > 12) {
                local.scrollTop += value;
                try {
                  local.dispatchEvent(new Event("scroll", {
                    bubbles: true
                  }));
                } catch (error) {}
              }
            } else {
              safeScrollTargetIntoView(result4, {
                force: true,
                block: "center"
              });
            }
          } catch (error) {
            safeScrollTargetIntoView(result4, {
              force: true,
              block: "center"
            });
          }
          await sleep(180);
          await randomDelay(180, 320, arg3);
          const local = async arg1 => {
            let result = await simulateTrustedElementClick(result4, arg3, arg1);
            if (!result && !shouldAbort(arg3)) {
              try {
                await simulateHumanClick(result4, arg3);
              } catch (error) {}
              try {
                result4.click();
              } catch (error) {}
              await sleep(220);
            }
          };
          await local("回复按钮");
          let local2 = null;
          const num = 24;
          let local3 = num;
          let flag = false;
          for (let num2 = 0; num2 < local3; num2++) {
            if (shouldAbort(arg3)) {
              break;
            }
            const value = num2 + 1;
            console.log("[Built-in-Debug] [互动] 等待回复框出现 (" + value + "/" + local3 + ")...");
            ipcRenderer.send("automation-data", {
              type: "interaction-progress",
              payload: {
                type: "reply",
                current: value,
                total: local3,
                accountId: window._radar_account_id
              }
            });
            await randomDelay(220, 360, arg3);
            local2 = findVisibleCommentComposer(result);
            if (local2) {
              break;
            }
            if (value === 4 || value === 12 || flag && value === 28) {
              await hasVisibleLooseCommentShell(arg3);
              local2 = findVisibleCommentComposer(result);
              if (local2) {
                break;
              }
            }
            if (value === 8 || flag && value === 20) {
              await local("回复按钮重试");
            }
            if (!flag && value >= num && !local2) {
              local3 = getExtendedReadyRounds(num, {
                progress: true,
                hardCapRounds: 36
              });
              if (local3 > num) {
                flag = true;
                console.log("[Built-in-Debug] [慢环境] 回复框未出现，延长等待 " + num + "→" + local3 + " 轮");
              }
            }
          }
          if (local2) {
            const result2 = (arg4 || "").trim();
            const result3 = shouldUseTextlessReplyPayload();
            if (shouldUseAiReplyGeneration(state.currentTask) && !result2 && !result3) {
              console.warn("[Built-in-Debug] [回复] AI 模式无可用回复文案，跳过 (" + arg2.nickname + ")");
              reportTraceLog("🤖 AI 回复：@" + arg2.nickname + " 无可用文案，已跳过（不使用「赞同」等模板）");
              return buildReplyFailureResult("ai_reply_content_unavailable", "AI 未返回可用的回复文案", result);
            }
            const local = state.currentTask.replyTemplates || (state.currentTask.commentContent ? state.currentTask.commentContent.split("\n").filter(arg1 => arg1.trim()) : []);
            if (!result2 && local.length === 0 && !result3) {
              console.warn("[Built-in-Debug] [回复] 未配置本地回复内容，跳过 (" + arg2.nickname + ")");
              reportTraceLog("💬 回复跳过：未配置本地回复内容（@" + arg2.nickname + "）");
              return buildReplyFailureResult("reply_content_unavailable", "未配置回复内容", result);
            }
            const local3 = result2 || (result3 ? "" : local.length ? local[Math.floor(Math.random() * local.length)] : "");
            let local4 = local3;
            if (!result2 && String(local4 || "").trim() && shouldAppendCommentRandomSuffix(state.currentTask)) {
              local4 = appendRandomEmojiSuffix(local4);
            }
            local4 = applyRiskyEmojiReplaceForComment(local4, "reply");
            if (!String(local4 || "").trim() && result3) {
              applyAttachmentFallback(false);
              reportTraceLog("💬 回复 @" + arg2.nickname + "：正文为空，将仅发送" + describeActiveAttachments(false));
            }
            const local5 = String(local4 || "").trim() || describeActiveAttachments(false);
            console.log("%c[互动动作] 正在对评论进行回复: \"" + local5 + "\"", "color: #fff; background: #f59e0b; padding: 2px 4px; border-radius: 2px;");
            await simulateTrustedElementClick(local2, arg3, "回复编辑器");
            await randomDelay(600, 1200, arg3);
            const result4 = buildImageAttachScope(local2, {
              replyMode: true
            });
            const result5 = findEmojiTriggerBtn(local2, result4);
            const local6 = collectCommentImageTriggerCandidates(local2, result4)[0]?.el;
            const obj = {
              ...result4,
              emojiBtnCache: result5,
              imageBtnCache: local6
            };
            const local7 = shouldUseCommentMentions(false) && resolveCommentMentionPosition(false) === "before";
            const result6 = isCommentExpressionActive();
            const local8 = !isImageAttachmentActive() && result6;
            const local9 = !String(local4 || "").trim() && result3 && result6;
            if (!local7 && !local9) {
              try {
                if (result5) {
                  console.log("[拟人操作] 回复表情诱导点击");
                  await simulateHumanClick(result5, arg3);
                  await randomDelay(500, 900, arg3);
                  local2.focus();
                }
              } catch (error) {}
            } else {
              reportMentionDebug(local9 ? "回复纯表情空文案：跳过录入前面板预打开，附加阶段再打开" : "回复正文前 @：跳过表情诱导点击", true);
            }
            console.log("%c[拟人操作] 模拟键盘录入中...", "color: #fbbf24; font-style: italic;");
            const result7 = await composeCommentInputWithMentions(local2, local4, arg3, {
              isVideoComment: false,
              replyMode: true,
              scopeInfo: obj
            });
            if (result7) {
              let flag = false;
              let flag2 = false;
              if (isImageAttachmentActive()) {
                reportTraceLog("💬 回复 @" + arg2.nickname + "：尝试配图…");
                const result2 = await attachImagesToComment(local2, arg3, {
                  replyMode: true,
                  commentNode: result
                });
                if (result2?.attached) {
                  flag = true;
                  reportTraceLog("💬 回复 @" + arg2.nickname + "：配图成功");
                } else if (!result2?.skipped) {
                  reportTraceLog("💬 回复 @" + arg2.nickname + "：配图未成功，继续发送其它内容");
                }
                if (String(local4 || "").trim()) {
                  await verifyCommentInputText(local2, local4, arg3);
                }
              } else if (local8) {
                reportTraceLog("💬 回复 @" + arg2.nickname + "：尝试附带表情包…");
                flag2 = await attachExpressionWithRetry(local2, arg3, {
                  isVideoComment: false,
                  replyMode: true,
                  commentNode: result
                }, result3 ? 4 : 3);
                if (flag2) {
                  reportTraceLog("💬 回复 @" + arg2.nickname + "：附带表情包成功");
                } else {
                  reportTraceLog("💬 回复 @" + arg2.nickname + "：附带表情包失败，继续校验输入框内容");
                  flag2 = composerHasAttachmentContent(local2, obj);
                }
              }
              if (local8 && !flag2) {
                console.warn("[Built-in-Debug] [回复] 已选择附带表情包，但插入未确认，取消发送 (" + arg2.nickname + ")");
                reportTraceLog("💬 回复取消：@" + arg2.nickname + " 表情包插入未确认，不降级为纯文字", null, "warning");
                return {
                  success: false,
                  error: "comment_expression_attach_failed",
                  errorCode: "comment_expression_attach_failed",
                  content: "",
                  selfLiked: false
                };
              }
              const result2 = await appendCommentMentionsAfterAttachments(local2, arg3, {
                isVideoComment: false,
                replyMode: true,
                scopeInfo: obj
              });
              const local = draftHasAnyContent(local2, local4, obj) || flag || flag2 || !!result2?.attached;
              if (!local) {
                console.warn("[Built-in-Debug] [回复] 正文为空且未检测到图片/表情/@，取消发送 (" + arg2.nickname + ")");
                reportTraceLog("💬 回复取消：@" + arg2.nickname + " 正文为空且未检测到图片/表情/@", null, "warning");
                return {
                  success: false,
                  error: "empty_comment_payload",
                  content: "",
                  selfLiked: false
                };
              }
              await randomDelay(1000, 1800, arg3);
              let flag3 = false;
              let result4 = collectScrollRoots(local2);
              if (!result4) {
                await sleep(200);
                result4 = collectScrollRoots(local2);
              }
              if (result4) {
                await clickTargetAndSettle(result4, local2, local4, arg3, "回复发送按钮", {
                  scope: document.body
                });
                const result2 = await waitForToast(4500);
                if (result2) {
                  const result3 = classifyCommentFailureToastLocal(result2.text);
                  console.warn("[Built-in-Debug] [回复] 检测到失败提示: " + result2.text + " (" + result3.code + ")");
                  handleCommentFailureToast(result2.text, arg3, result3);
                  return {
                    ...buildReplyFailureResult(result3.code || "platform_rejected_reply", result2.text, result),
                    content: local4 || local5,
                    selfLiked: flag3,
                    stopAccount: !!result3.stopAccount
                  };
                }
                const result3 = await waitForSelfComment(local2, local4, document.body);
                if (!result3) {
                  return {
                    ...buildReplyFailureResult("reply_publish_not_confirmed", "已点击发送，但输入框未清空且评论区未确认到回复", result),
                    content: local4 || local5,
                    selfLiked: flag3
                  };
                }
                console.log("%c[互动成功] 回复已提交", "color: #fff; background: #10b981; padding: 2px 4px; border-radius: 2px;");
                await randomDelay(800, 1500, arg3);
                return {
                  success: true,
                  content: local4 || local5,
                  selfLiked: flag3
                };
              } else {
                console.log("%c[拟人操作] 按钮探测受阻，尝试回车保底发送...", "color: #94a3b8; font-style: italic;");
                const result2 = await simulateTrustedEnter(local2, arg3, "回复编辑器");
                if (!result2) {
                  return {
                    ...buildReplyFailureResult("reply_send_control_unavailable", "未找到发送按钮，原生回车发送也未成功触发", result),
                    content: local4 || local5,
                    selfLiked: flag3
                  };
                }
                const result3 = await waitForToast(4500);
                if (result3) {
                  const result2 = classifyCommentFailureToastLocal(result3.text);
                  console.warn("[Built-in-Debug] [回复] 回车发送检测到失败提示: " + result3.text + " (" + result2.code + ")");
                  handleCommentFailureToast(result3.text, arg3, result2);
                  return {
                    ...buildReplyFailureResult(result2.code || "platform_rejected_reply", result3.text, result),
                    content: local4 || local5,
                    selfLiked: flag3,
                    stopAccount: !!result2.stopAccount
                  };
                }
                const result4 = await waitForSelfComment(local2, local4, document.body);
                if (!result4) {
                  return {
                    ...buildReplyFailureResult("reply_publish_not_confirmed", "已触发回车发送，但未确认回复发表成功", result),
                    content: local4 || local5,
                    selfLiked: flag3
                  };
                }
                await randomDelay(800, 1500, arg3);
                return {
                  success: true,
                  content: local4 || local5,
                  selfLiked: flag3
                };
              }
            } else {
              console.warn("[Built-in-Debug] [回复] 输入失败，跳过发送 (" + arg2.nickname + ")");
              return buildReplyFailureResult("reply_input_failed", "回复内容未能写入输入框", result);
            }
          } else {
            return buildReplyFailureResult(shouldAbort(arg3) ? "reply_aborted" : "reply_input_not_found", shouldAbort(arg3) ? "回复过程已被任务停止" : "点击回复后未出现回复输入框", result);
          }
        } else {
          return buildReplyFailureResult("reply_button_not_found", "已找到目标评论，但未找到“回复”按钮", result);
        }
      } catch (error) {
        console.error("[Built-in-Debug] [回复异常]", error);
        return buildReplyFailureResult("reply_exception", "回复执行发生异常", null, error?.message || String(error));
      } finally {
        local = null;
        state.currentActionMentionRolled = null;
      }
      return buildReplyFailureResult("reply_unknown_failure", "回复未完成，未命中明确的执行分支");
    });
  }
  function isProfileWorkCommentedOk(arg1) {
    if (!arg1 || typeof arg1 !== "object") {
      return false;
    }
    if (arg1.noWorks || arg1.skipReason === "作品数为0") {
      return false;
    }
    return !!arg1.profileWorkCommented;
  }
  function clearProfileCommentMarkers(arg1) {
    if (!arg1) {
      return;
    }
    arg1.actions = arg1.actions || {};
    delete arg1.actions.profileWorkCommented;
    if (Array.isArray(arg1.touchLog) && arg1.touchLog.length) {
      arg1.touchLog = arg1.touchLog.filter(arg1 => arg1.type !== "profileComment");
    }
    arg1.touchCounts = migrateTouchCountsFromLegacy(arg1);
    if (arg1.touchCounts) {
      arg1.touchCounts.profileComment = 0;
    }
    if (!arg1.touchLog?.some(arg1 => arg1.type === "profileComment")) {
      delete arg1.profileCommentAt;
    }
    if (arg1.replied && !arg1.touchCounts?.reply && !arg1.touchCounts?.profileComment) {
      arg1.replied = false;
      delete arg1.actions.replied;
    }
  }
  function applyProfileActionResults(arg1, arg2) {
    if (!arg1 || !arg2 || typeof arg2 !== "object") {
      return;
    }
    arg1.actions = arg1.actions || {};
    if (arg2.followed) {
      arg1.actions.followed = true;
    }
    if (arg2.messaged) {
      arg1.actions.messaged = true;
    }
    if (arg2.dmSkipped !== undefined) {
      arg1.actions.dmSkipped = !!arg2.dmSkipped;
    }
    if (arg2.dmContent) {
      arg1.actions.dmContent = arg2.dmContent;
    }
    if (isProfileWorkCommentedOk(arg2)) {
      arg1.actions.profileWorkCommented = true;
      arg1.actions.replied = true;
    } else if (arg2.noWorks || arg2.skipReason === "作品数为0" || arg2.skipped && !arg2.profileWorkCommented) {
      clearProfileCommentMarkers(arg1);
    }
    if (arg2.workLiked) {
      arg1.actions.liked = true;
      arg1.liked = true;
    }
    if (arg2.workCollected) {
      arg1.actions.collected = true;
      arg1.collected = true;
    }
    if (Array.isArray(arg2.touchLog) && arg2.touchLog.length) {
      arg1.touchLog = normalizeTouchLogEntries([...(arg2.touchLog || []), ...(arg1.touchLog || [])]).slice(0, 200);
      syncTouchCountsFromLog(arg1);
    }
    if (arg2.touchCounts && typeof arg2.touchCounts === "object") {
      arg1.touchCounts = {
        ...(arg1.touchCounts || {})
      };
      for (const [local, local2] of Object.entries(arg2.touchCounts)) {
        const result = Math.max(0, Number(local2) || 0);
        arg1.touchCounts[local] = Math.max(Number(arg1.touchCounts[local] || 0), result);
      }
    }
    if (arg2.followed && !(arg1.touchCounts?.follow > 0)) {
      recordLeadTouch(arg1, "follow");
    }
    if (arg2.messaged && !arg2.dmSkipped && !(arg1.touchCounts?.message > 0)) {
      recordLeadTouch(arg1, "message", {
        content: arg2.dmContent || "已发送私信"
      });
    }
    if (arg2.lastTouchAt) {
      arg1.lastTouchAt = Math.max(Number(arg1.lastTouchAt || 0), Number(arg2.lastTouchAt || 0));
    }
    if (arg2.profileCommentAt && isProfileWorkCommentedOk(arg2)) {
      arg1.profileCommentAt = arg2.profileCommentAt;
    }
  }
  function isProfileFirstWorkCommentDone(arg1) {
    return isProfileWorkCommentedOk(arg1);
  }
  function getActionPriorityScore(options = {}) {
    if (options?.canCommentFirstWork) {
      return 375;
    }
    if (options?.canDM) {
      return 255;
    }
    return 195;
  }
  function listEnabledActionLabels(options = {}) {
    const list = [];
    if (options.canCommentFirstWork) {
      list.push("首作评论");
    }
    if (options.canFollow) {
      list.push("关注");
    }
    if (options.canDM) {
      list.push("私信");
    }
    if (list.length) {
      return list.join("+");
    } else {
      return "主页互动";
    }
  }
  function markLeadTargetRejected(arg1, arg2) {
    if (!arg2?.targetRejected) {
      return false;
    }
    const local = arg2.reason || arg2.targetReason || "主页画像判断不匹配";
    arg1.isHighIntention = false;
    arg1.aiThought = local;
    arg1.actions = arg1.actions || {};
    arg1.actions.targetRejected = true;
    markLeadInSession(arg1);
    reportTraceLog("🎯 @" + arg1.nickname + "：画像不匹配，本轮不触达（" + clipTraceText(local, 48) + "）");
    ipcRenderer.send("automation-data", {
      type: "comment",
      payload: [arg1],
      taskId: state.activeLoopId,
      viewKey: state.currentTask?.viewKey,
      isAiMode: shouldUseAiCommentAnalysis(state.currentTask)
    });
    return true;
  }
  async function executeLeadCommentAction(arg1, arg2, arg3, arg4 = null, arg5 = null) {
    if (!state.currentTask?.enableComment) {
      return false;
    }
    if (state.currentTask?.commentOnProfileFirstWork) {
      console.log("%c[主页首作评论] 尝试跳转 " + arg2.nickname + " 主页发表评论...", "color: #a78bfa; font-style: italic;");
      reportCurrentAction("尝试在 [" + arg2.nickname + "] 主页首个作品下评论...");
      reportProfileFirstTrace("@" + arg2.nickname + " 获客任务：优先跳转主页首作评论", arg2.accountId);
      const flag = !!arg5?.canFollow;
      const flag2 = !!arg5?.canDM;
      if (state.currentTask?.enableFollow && !flag) {
        reportTraceLog("⏭ @" + arg2.nickname + "：已开启关注，但当前无可用关注配额（会话 " + state.sessionFollowCount + "/" + (state.sessionFollowLimit === infinity ? "∞" : state.sessionFollowLimit) + "），本趟仅做首作评论", null, "warning");
      }
      if (state.currentTask?.enableDM && !flag2) {
        reportTraceLog("⏭ @" + arg2.nickname + "：已开启私信，但当前无可用私信配额（会话 " + state.sessionDmCount + "/" + (state.sessionDmLimit === infinity ? "∞" : state.sessionDmLimit) + "），本趟仅做首作评论", null, "warning");
      }
      const result = await openCommentAuthorForDm(arg1, arg2, arg3, flag, flag2, {
        canCommentFirstWork: true
      });
      if (result && typeof result === "object") {
        mergeProfileInfoToLead(arg2, result);
      }
      if (result?.targetRejected) {
        const local = result.targetReason || result.skipReason || "主页画像判断不匹配";
        arg2.isHighIntention = false;
        arg2.aiThought = local;
        console.log("%c[主页首作评论] " + arg2.nickname + " 画像不匹配，跳过原评论回复", "color: #94a3b8; font-style: italic;");
        reportTraceLog("🎯 @" + arg2.nickname + "：画像不匹配，已跳过互动（" + clipTraceText(local, 48) + "）");
        return {
          success: false,
          targetRejected: true,
          reason: local,
          targetScore: result.targetScore,
          worksCount: result.worksCount
        };
      }
      if (result?.profileFirstTargetFiltered) {
        const local = result.skipReason || "不符合主页首作筛选";
        console.log("%c[主页首作评论] " + arg2.nickname + " " + local + "，不回退回复原评论", "color: #94a3b8; font-style: italic;");
        reportTraceLog("⏭ @" + arg2.nickname + "：" + clipTraceText(local, 48) + "，已跳过首作评论及原评论回复");
        reportCurrentAction("@" + arg2.nickname + " " + local + "，已跳过", arg2.accountId);
        return {
          success: false,
          skipped: true,
          noReplyFallback: true,
          profileFirstTargetFiltered: true,
          skipReason: local,
          gender: result.gender,
          age: result.age,
          worksCount: result.worksCount
        };
      }
      if (isProfileFirstWorkCommentDone(result)) {
        return {
          success: true,
          content: result.content || "已在主页作品评论",
          profileWorkCommented: true,
          worksCount: result.worksCount,
          followed: !!result.followed,
          messaged: !!result.messaged,
          dmContent: result.dmContent
        };
      }
      const local = result?.skipReason || (result?.noWorks ? "无公开作品" : null) || result?.error || "首作评论未完成";
      if ((state.currentTask?.profileFirstCommentFallbackMode || "reply") === "skip") {
        console.log("%c[主页首作评论] " + local + "，已按“仅首作评论”跳过回复原评论", "color: #94a3b8; font-style: italic;");
        reportTraceLog("⏭ @" + arg2.nickname + "：" + clipTraceText(local, 32) + "，仅首作评论模式，不回复原评论");
        reportCurrentAction("@" + arg2.nickname + " " + local + "，已跳过原评论回复", arg2.accountId);
        return {
          success: false,
          skipped: true,
          noReplyFallback: true,
          skipReason: local,
          noWorks: !!result?.noWorks,
          worksCount: result?.worksCount
        };
      }
      console.log("%c[主页首作评论] " + local + "，回退为回复原评论", "color: #94a3b8; font-style: italic;");
      reportTraceLog("↩ @" + arg2.nickname + "：" + clipTraceText(local, 32) + "，回退回复原评论");
    }
    return await performReply(arg1, arg2, arg3, arg4);
  }
  async function openCommentAuthorForDm(arg1, arg2, arg3, flag = false, flag2 = false, options = {}) {
    let value = arg2.userUrl;
    const result = extractUserIdFromUrl(arg2.userUrl || "");
    try {
      const result2 = findTargetNode(arg1, arg2);
      if (result2) {
        const result3 = result2.querySelector("a[href*=\"/user/\"], [data-e2e=\"comment-at-user\"]");
        if (result3) {
          const local = result3.href || result3.getAttribute("href") || "";
          const result2 = extractUserIdFromUrl(local);
          if (!result || !result2 || result === result2) {
            value = local || value;
          } else {
            reportTraceLog("⚠ @" + arg2.nickname + "：评论区匹配节点用户不一致，沿用已采集主页链接", null, "warning");
          }
        }
      }
    } catch (error) {
      console.warn("[Built-in-Debug] [主页跳转] 定位评论节点异常，沿用已采集主页链接:", error?.message || error);
    }
    if (!value) {
      reportTraceLog("⚠ @" + arg2.nickname + "：未找到主页链接，跳过跟进");
      return false;
    }
    if (value.startsWith("/")) {
      value = window.location.origin + value;
    }
    const result2 = extractUserIdFromUrl(value);
    if (!result2) {
      reportTraceLog("⚠ @" + arg2.nickname + "：主页链接无法解析用户 ID，跳过跟进");
      return false;
    }
    arg2.userUrl = normalizeUserUrl(value) || value;
    try {
      const url = new URL(value);
      url.searchParams.set("from_tab_name", "main");
      value = url.toString();
    } catch (error) {
      if (value.includes("?")) {
        if (!value.includes("from_tab_name=")) {
          value += "&from_tab_name=main";
        }
      } else {
        value += "?from_tab_name=main";
      }
    }
    console.log("[Built-in-Debug] [子视图模式] 正在为 " + arg2.nickname + " 切换视图上下文...");
    const result3 = buildLeadFromEntry(arg2, {
      canFollow: flag,
      canDM: flag2,
      canCommentFirstWork: !!options.canCommentFirstWork,
      profileFirstCommentFallbackMode: state.currentTask?.profileFirstCommentFallbackMode || "reply"
    });
    state.pausedForSubview = true;
    let flag3 = false;
    try {
      window._radar_subview_result = null;
      ipcRenderer.send("interaction-start", {
        viewKey: state.currentViewKey,
        url: value,
        taskData: result3
      });
      reportTraceLog("↪ 子视图 @" + arg2.nickname + "：已发起主页跟进（uid=" + result2 + "，" + listEnabledActionLabels(result3) + "），等待互动结果（最长 " + getActionPriorityScore(result3) + " 秒）…");
      const result = getActionPriorityScore(result3);
      for (let num = 0; num < result; num++) {
        if (state.stopRequested) {
          break;
        }
        if (num > 0 && num % 15 === 0) {
          const result = listEnabledActionLabels(result3);
          reportTraceLog("↪ 子视图 @" + arg2.nickname + "：" + result + "进行中（已 " + num + " 秒，属正常等待）…");
        }
        if (window._radar_subview_result) {
          const value = window._radar_subview_result;
          window._radar_subview_result = null;
          applyProfileActionResults(arg2, value);
          if (value.noWorks || value.skipReason === "作品数为0") {
            arg2.noWorks = true;
            arg2.skipReason = value.skipReason || "作品数为0";
          }
          if (value.isPrivate || value.skipReason && String(value.skipReason).includes("私密账号")) {
            arg2.isPrivate = true;
            arg2.actionSkipReason = value.skipReason || "对方账号设置了隐私，未执行关注/私信";
            arg2.skipReason = arg2.actionSkipReason;
          }
          mergeProfileInfoToLead(arg2, value);
          if (value.error) {
            if (value.error === "USER_NOT_FOUND") {
              console.log("%c[会话恢复] 检测到线索 [" + arg2.nickname + "] 的账号异常（用户不存在/已被封禁），系统已在 1 秒内完成安全自愈熔断，跳过该用户跟进！", "color: #f59e0b; font-weight: bold;");
            } else {
              console.warn("[子视图跟进] 线索 [" + arg2.nickname + "] 互动未完成，原因: " + value.error);
            }
          } else if (arg2.actionSkipReason) {
            console.log("[子视图跟进] 线索 [" + arg2.nickname + "] 已跳过：" + arg2.actionSkipReason);
          } else {
            console.log("[Built-in-Debug] [子视图返回] 任务完成, 性别: " + (value.gender || "未知"));
          }
          flag3 = value;
          break;
        }
        await new Promise(arg1 => setTimeout(arg1, 1000));
      }
      if (!flag3) {
        for (let num = 0; num < 8; num++) {
          if (window._radar_subview_result) {
            const value = window._radar_subview_result;
            window._radar_subview_result = null;
            applyProfileActionResults(arg2, value);
            if (value.noWorks || value.skipReason === "作品数为0") {
              arg2.noWorks = true;
              arg2.skipReason = value.skipReason || "作品数为0";
            }
            mergeProfileInfoToLead(arg2, value);
            reportTraceLog("↪ 子视图 @" + arg2.nickname + "：结果延迟 " + (result + num + 1) + " 秒到达，已补接");
            flag3 = value;
            break;
          }
          await new Promise(arg1 => setTimeout(arg1, 1000));
        }
      }
      if (!flag3 && !state.stopRequested) {
        reportTraceLog("⚠ @" + arg2.nickname + "：" + listEnabledActionLabels(result3) + "未在 " + (result + 8) + " 秒内返回结果，本条按超时收口", arg2.accountId, "warning");
      }
    } finally {
      state.pausedForSubview = false;
      await randomDelay(1500, 2500, arg3, "子视图切换缓冲");
    }
    return flag3;
  }
  async function performProfileActions(arg1, arg2, arg3, flag = false, flag2 = false) {
    if (state.currentTask?.taskMode === "scrape") {
      return false;
    }
    if (!flag && !flag2) {
      return false;
    }
    console.log("[Built-in-Debug] [主页动作] 模式：双视图切换");
    return await openCommentAuthorForDm(arg1, arg2, arg3, flag, flag2);
  }
  async function performLike(arg1, arg2, arg3, options = {}) {
    const value = typeof options.onProgress === "function" ? options.onProgress : null;
    return withBackgroundAutomationLayout(async () => {
      const flag = !!options.force;
      if (!flag && state.currentTask?.taskMode === "scrape") {
        if (options.detail) {
          return {
            success: false,
            error: "scrape_mode",
            errorCode: "scrape_mode"
          };
        } else {
          return false;
        }
      }
      if (!flag && !state.currentTask?.enableLike) {
        if (options.detail) {
          return {
            success: false,
            error: "like_disabled",
            errorCode: "like_disabled"
          };
        } else {
          return false;
        }
      }
      try {
        value?.("开始定位目标评论");
        const value2 = String(arg3 || "") === "SELF_WARMUP";
        const local = !!options.fastLocate && !value2;
        const result = await locateTargetCommentNode(arg1, arg2, arg3, {
          profileVideo: !!options.profileVideo,
          fastLocate: local,
          stableLocate: value2 || !!options.stableLocate,
          onProgress: value
        });
        if (!result) {
          console.warn("[Built-in-Debug] [点赞] 失败: 找不到目标评论节点 (" + arg2.nickname + ")");
          if (options.detail) {
            return {
              success: false,
              error: "未找到目标评论",
              errorCode: "comment_node_not_found"
            };
          } else {
            return false;
          }
        }
        value?.("已定位评论，查找点赞按钮");
        const result2 = resolveCommentLikeControlInNode(result);
        if (!result2.button) {
          console.warn("[Built-in-Debug] [点赞] 失败: 未找到点赞控件 (" + arg2.nickname + ", reason=" + result2.reason + ", score=" + result2.score + ")");
          if (options.detail) {
            return {
              success: false,
              error: "未找到评论点赞控件",
              errorCode: "like_button_not_found"
            };
          } else {
            return false;
          }
        }
        if (result2.alreadyLiked) {
          value?.("评论已是点赞状态，跳过点击");
          console.log("%c[互动动作] 评论已点赞，跳过重复点击: " + arg2.nickname, "color: #94a3b8; font-style: italic;");
          if (options.detail) {
            return {
              success: true,
              alreadyLiked: true,
              error: "",
              errorCode: ""
            };
          } else {
            return true;
          }
        }
        value?.("正在点击点赞");
        console.log("%c[互动动作] 正在对评论点赞: " + arg2.nickname, "color: #fff; background: #ec4899; padding: 2px 4px; border-radius: 2px;");
        const local2 = () => {
          if (result2.button?.isConnected) {
            return result2.button;
          }
          const value = result.isConnected ? result : findTargetNode(arg1 || document, arg2, {
            scrollIntoView: false
          }) || findTargetNode(arg1 || document, arg2, {
            scrollIntoView: false,
            relaxed: true
          });
          if (value) {
            return resolveCommentLikeControlInNode(value).button;
          } else {
            return null;
          }
        };
        const local3 = async arg1 => {
          const result = local2();
          if (!result) {
            return {
              effect: false,
              before: null,
              after: null
            };
          }
          safeScrollTargetIntoView(result, {
            force: true,
            block: "nearest"
          });
          await sleep(220);
          const result2 = snapshotCommentLikeControlState(result);
          if (result2?.liked) {
            return {
              effect: true,
              alreadyLiked: true,
              before: result2,
              after: result2
            };
          }
          state.lastNativeClickBackgroundHosted = false;
          const value2 = typeof getCommentV2String === "function" ? getCommentV2String("commentLikeClickInner") : "";
          const value3 = arg1 ? value2 ? result.querySelector?.(value2) || result : result : result;
          const result3 = await simulateTrustedElementClick(value3, arg3, arg1 ? "评论点赞按钮(重试)" : "评论点赞按钮");
          if (!result3 || arg1) {
            try {
              value3.click?.();
            } catch (error) {}
            try {
              result.click?.();
            } catch (error) {}
          }
          const local = result3 && state.lastNativeClickBackgroundHosted;
          value?.(arg1 ? "重试点击已发出，确认点赞状态" : "点击已发出，确认点赞状态");
          let local3 = null;
          const value4 = local ? 14 : 10;
          for (let num = 0; num < value4; num += 1) {
            if (shouldAbort(arg3)) {
              break;
            }
            await sleep(250);
            local3 = snapshotCommentLikeControlState(local2());
            if (hasCommentLikeTakenEffect(result2, local3)) {
              return {
                effect: true,
                before: result2,
                after: local3,
                background: local,
                nativeClicked: result3
              };
            }
          }
          return {
            effect: false,
            before: result2,
            after: local3,
            background: local,
            nativeClicked: result3
          };
        };
        const local4 = arg1 => {
          value?.("点赞状态已确认");
          console.log("%c[互动成功] 点赞状态已确认（" + describeCommentLikeState(arg1.after) + "）", "color: #f472b6; font-style: italic;");
          if (options.detail) {
            return {
              success: true,
              alreadyLiked: !!arg1.alreadyLiked,
              error: "",
              errorCode: ""
            };
          } else {
            return true;
          }
        };
        const local5 = (arg1, arg22) => {
          console.warn("[Built-in-Debug] [点赞] " + (arg22 ? "重试后" : "") + "未读到生效信号 (" + arg2.nickname + ")" + (" before=" + describeCommentLikeState(arg1.before) + " after=" + describeCommentLikeState(arg1.after)) + (" nativeClick=" + arg1.nativeClicked + " click=" + state.lastTrustedClickDiagnostic));
        };
        let result3 = await local3(false);
        if (result3.effect) {
          return local4(result3);
        }
        local5(result3, false);
        if (!shouldAbort(arg3) && !result3.effect) {
          value?.("点赞未生效，精细重试一次");
          console.warn("[Built-in-Debug] [点赞] 红心未点亮，尝试精细目标与 DOM 补扣重试一次 (" + arg2.nickname + ")");
          result3 = await local3(true);
          if (result3.effect) {
            return local4(result3);
          }
          local5(result3, true);
        }
        if (flag || String(arg3 || "") === "SELF_WARMUP") {
          value?.("未读到已赞回显，按已点击成功记");
          console.warn("[Built-in-Debug] [点赞] 未读到已赞回显，自热场景按点击成功记 (" + arg2.nickname + ")");
          if (options.detail) {
            return {
              success: true,
              unconfirmed: true,
              error: "",
              errorCode: ""
            };
          } else {
            return true;
          }
        }
        if (result3.background) {
          value?.("后台托管点击已发出，按成功记");
          console.warn("[Built-in-Debug] [点赞] 后台托管点击已发出，按成功记 (" + arg2.nickname + ")");
          if (options.detail) {
            return {
              success: true,
              unconfirmed: true,
              error: "",
              errorCode: ""
            };
          } else {
            return true;
          }
        }
        console.warn("[Built-in-Debug] [点赞] 已尝试点击但未能点亮红心 (" + arg2.nickname + ")");
        if (options.detail) {
          return {
            success: false,
            error: "已点击点赞，但未能点亮红心",
            errorCode: "like_not_confirmed"
          };
        } else {
          return false;
        }
      } catch (error) {
        console.error("[Built-in-Debug] [点赞异常]", error);
        await sleep(2000);
        if (options.detail) {
          return {
            success: false,
            error: error?.message || "点赞异常",
            errorCode: "like_exception"
          };
        } else {
          return false;
        }
      }
    }, {
      onProgress: value
    });
  }
  async function applySearchFilters(arg1, arg2) {
    const result = getApplySearchFiltersModule();
    if (!result?.applyOfficialSearchFilters) {
      console.warn("[Built-in-Debug] [官方筛选] 共享模块缺失，跳过");
      return;
    }
    const result2 = getSearchFilterSessionModule();
    await result.applyOfficialSearchFilters({
      storage: sessionStorage,
      isVisibleElement: isVisibleElement,
      simulateHumanClick: simulateHumanClick,
      randomDelay: randomDelay,
      sleep: sleep,
      reportCurrentAction: reportCurrentAction,
      reportTraceLog: reportTraceLog,
      filterSessionMod: result2,
      bumpSearchApiGeneration: () => {
        try {
          getSearchApiReadyTracker().bumpGeneration();
        } catch (error) {}
      },
      scrollToTop: () => {
        try {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant"
          });
        } catch (error) {
          try {
            window.scrollTo(0, 0);
          } catch (error) {}
        }
      },
      findVisibleBySelector: arg1 => {
        try {
          return Array.from(document.querySelectorAll(arg1)).find(isVisibleElement) || null;
        } catch (error) {
          return null;
        }
      },
      findByExactText: (arg1, flag = false) => {
        const result = Array.from(document.querySelectorAll("button, [role=\"button\"], span, div")).filter(arg12 => (arg12.innerText || "").trim() === arg1);
        const result2 = result.find(arg1 => isVisibleElement(arg1) && arg1.getBoundingClientRect().height <= 80);
        if (result2) {
          return result2;
        }
        if (flag) {
          return null;
        } else {
          return result[0] || null;
        }
      }
    }, {
      sort: state.currentTask?.searchSort || "0",
      time: state.currentTask?.searchPublishTime || "0",
      duration: state.currentTask?.searchDuration || "0",
      scope: state.currentTask?.searchScope || "0",
      format: state.currentTask?.searchFormat || "0"
    }, arg1, arg2);
  }
  function formatScrapeScreenProgress(arg1, arg2, arg3, arg4, arg5, arg6 = state.currentTask?.taskMode) {
    const value = arg6 === "scrape" ? "评论采集" : "评论解析";
    const value2 = arg3 + arg4 + arg5;
    let value3 = "📊 " + value + "：本屏解析 " + arg1 + " 条 → 新入库 " + arg2 + " 条";
    if (value2 > 0) {
      const list = [];
      if (arg4 > 0) {
        list.push("本任务已录 " + arg4);
      }
      if (arg3 > 0) {
        list.push("本屏重复 " + arg3);
      }
      if (arg5 > 0) {
        list.push("历史库已有 " + arg5);
      }
      value3 += "｜跳过 " + value2 + " 条（" + list.join("，") + "）";
    }
    return value3;
  }
  function formatScrapeCommentScrollAction(arg1, arg2, arg3) {
    const value = arg1 + 1;
    if (arg3 && arg3 > 0) {
      return "第 " + value + "/" + arg2 + " 轮：解析评论区（视频总评论约 " + arg3 + " 条，按评论量估算最多滚动 " + arg2 + " 轮）…";
    }
    return "第 " + value + "/" + arg2 + " 轮：解析评论区并去重…";
  }
  function formatScrapeGuardWaitLabel(arg1, arg2) {
    const result = String(arg1 || "等待").trim();
    if (result === "评论加载等待") {
      return "⏱ 等待评论加载 " + arg2 + " 秒（已暂停视频，防页面跳转）";
    }
    if (result === "内滚") {
      return "⏱ 滚动后等待 " + arg2 + " 秒（已暂停视频，防页面跳转）";
    }
    return "⏱ " + result + " " + arg2 + " 秒（已暂停视频，防页面跳转）";
  }
  function saveCommentScrapeProgress(arg1, arg2, arg3, arg4) {
    if (!arg1) {
      return;
    }
    const result = findCommentScrollContainer(arg3);
    window._commentScrapeProgress = {
      videoId: arg1,
      scrollRound: Math.max(0, Number(arg2) || 0),
      scrollTop: result?.scrollTop || 0,
      videoCollectedCount: Math.max(0, Number(arg4) || 0)
    };
    if (typeof window._saveRadarState === "function") {
      window._saveRadarState();
    }
  }
  async function extractLeads(arg1, arg2, arg3, arg4, arg5 = () => {}, text = "", arg7 = null) {
    const value = platformSelectors["douyin.com"];
    const result = pickLeadVideoUrl(text, arg1);
    const local = resolveCommentPanelRoot(arg1) || arg1;
    const result2 = queryCommentItemNodes(local);
    const value2 = state.currentTask?.taskMode === "scrape";
    const local2 = !value2 && result2.length <= 40;
    if (local2) {
      try {
        let value = "\n=== [" + new Date().toLocaleString() + "] extractLeads Started ===\n";
        value += "VideoTitle: " + arg2 + "\n";
        value += "Scope Container: " + (local ? local.tagName + " class=\"" + local.className + "\"" : "null") + "\n";
        value += "CommentNodes Count: " + result2.length + "\n";
        ipcRenderer.send("write-debug-log", value);
      } catch (error) {
        console.error("[Built-in-Debug] [交互警告] IPC Debug Log Error:", error.message);
      }
    }
    const list = [];
    let num = 0;
    let num2 = 0;
    let num3 = 0;
    let num4 = 0;
    let num5 = 0;
    let num6 = 0;
    let num7 = 0;
    const list2 = [];
    const list3 = [];
    const result3 = formatTaskLocationFilterSummary(state.currentTask || {});
    const result4 = taskLocationFilterEnabled(state.currentTask || {});
    const result5 = (() => {
      const value = arg7 && typeof arg7 === "object" ? arg7 : null;
      if (value && (value.nickname || value.authorNickname || value.profileUrl || value.authorUrl)) {
        return {
          nickname: value.nickname || value.authorNickname || "",
          profileUrl: value.profileUrl || value.authorUrl || "",
          secUid: value.secUid || ""
        };
      }
      try {
        const local = getVideoAuthorInfo(null, result) || {};
        return {
          nickname: local.nickname || "",
          profileUrl: local.profileUrl || "",
          secUid: ""
        };
      } catch (error) {
        return {
          nickname: "",
          profileUrl: "",
          secUid: ""
        };
      }
    })();
    if (result4) {
      const flag = !!getLocationFilterModule();
      console.log("[Built-in-Debug] [地区过滤] 本屏启用: " + result3 + (" regions=" + JSON.stringify(resolveTaskLocationFilterRegions(state.currentTask))) + (" module=" + (flag ? "shared" : "inline-fallback")));
    }
    const result6 = getMyNickname();
    if (result6) {
      console.log("[Built-in-Debug] [自检] 探测到当前账号昵称: " + result6 + "，将自动过滤此人的评论。");
    }
    result2.forEach((arg1, arg22) => {
      try {
        if (isDouyinSecondaryCommentNode(arg1)) {
          num2++;
          return;
        }
        const result2 = parseDouyinCommentNode(arg1, {
          requireTime: true,
          skipAuthor: false
        });
        if (!result2) {
          num4++;
          return;
        }
        const {
          nickname: nickname2,
          userUrl: userUrl,
          text: text,
          time: time,
          timeOriginal: timeOriginal,
          ipLocation: ipLocation
        } = result2;
        try {
          if (local2) {
            let value = "\n[Node " + arg22 + " Debug]\n";
            value += "- Tag: " + arg1.tagName + ", Class: " + arg1.className + ", data-e2e: " + (arg1.getAttribute("data-e2e") || "null") + "\n";
            value += "- Parsed nickname: " + JSON.stringify(nickname2) + "\n";
            value += "- Parsed content: " + JSON.stringify(text) + "\n";
            value += "- Parsed time: " + JSON.stringify(time) + "\n";
            value += "- Parsed ipLocation: " + JSON.stringify(ipLocation) + "\n";
            value += "- isAuthor: " + !!result2.isAuthor + "\n";
            ipcRenderer.send("write-debug-log", value);
          }
        } catch (error) {
          console.error("[Built-in-Debug] [交互警告] Node IPC Debug Log Error:", error.message);
        }
        if (result2.isAuthor || isCommentFromVideoAuthor(result2, result5)) {
          num++;
          return;
        }
        if (result6 && nickname2 === result6) {
          num3++;
          return;
        }
        if (!isWithinTimeLimit(time, state.currentTask.commentTimeFilter)) {
          return;
        }
        if (result4) {
          const result = evaluateLeadLocationFilter({
            ipLocation: ipLocation,
            location: ipLocation
          }, state.currentTask || {});
          if (!result.pass) {
            num5++;
            if (result.reason === "地区未知") {
              num7++;
            }
            if (list2.length < 4) {
              list2.push("@" + nickname2 + " 属地「" + (ipLocation || "未知") + "」→ " + (result.reason || "跳过"));
            }
            return;
          }
          num6++;
          if (list3.length < 3) {
            list3.push("@" + nickname2 + " 属地「" + ipLocation + "」");
          }
        }
        const local = state.currentTask?.intentionKeywords || "";
        const result3 = local.split(/[,，\s\n]+/).map(arg1 => arg1.trim()).filter(arg1 => arg1.length > 0);
        const local3 = commentBodyForKeywordMatch({
          content: text,
          text: text,
          nickname: nickname2,
          ipLocation: ipLocation,
          location: ipLocation
        }) || "";
        const result7 = matchExcludedCommentKeyword(local3 || text, state.currentTask);
        const value = result3.length === 0;
        const value2 = result7 || value ? "" : result3.find(arg1 => local3.includes(arg1)) || "";
        const local4 = !result7 && (value || !!value2);
        const value3 = result7 ? "命中排除评论关键词「" + result7 + "」，直接判定为低意向" : value ? "评论关键词为空，视为全部命中" : value2 ? "匹配关键词: \"" + value2 + "\"" : "未匹配到设置的关键词";
        list.push({
          platform: "DY",
          title: arg2,
          nickname: nickname2,
          content: text,
          timeText: time,
          userUrl: userUrl,
          secUid: extractUserKeyFromUrl(userUrl) || undefined,
          url: result,
          capturedAt: new Date().toISOString(),
          timestamp: Date.now(),
          type: "LEAD",
          isHighIntention: local4,
          thought: value3,
          aiThought: result7 ? value3 : "",
          excludedCommentKeyword: result7 || "",
          leadId: buildLeadIdFromLead(userUrl, nickname2, text),
          accountId: state.currentTask?.accountId || "default",
          accountName: window._radar_account_name || state.currentTask?.nickname || state.currentTask?.name || "默认账号",
          taskName: state.currentTask?.taskName || "未命名任务",
          ipLocation: ipLocation || "",
          location: ipLocation || "未知",
          likeCount: (arg1 => {
            try {
              const local = arg1.querySelector(".comment-item-stats-container span") || arg1.querySelector("[class*=\"like-count\"]") || arg1.querySelector("[class*=\"Count\"]");
              if (local) {
                const result = local.innerText.trim();
                if (result.includes("w")) {
                  return parseFloat(result) * 10000;
                }
                if (result.includes("k")) {
                  return parseFloat(result) * 1000;
                }
                return parseInt(result) || 0;
              }
            } catch (error) {}
            return 0;
          })(arg1),
          contact: (() => {
            const result = (nickname2 + " " + text).toLowerCase();
            const result2 = result.match(/1[3-9]\d{9}/);
            const result3 = result.match(/(?:vx|v|微|wechat|➕|🛰️)[:：]?\s*([a-zA-Z0-9_-]{5,20})/);
            let list = [];
            if (result2) {
              list.push("手机: " + result2[0]);
            }
            if (result3 && !result3[1].includes("http")) {
              list.push("微信: " + result3[1]);
            }
            return list.join(" | ");
          })(),
          actions: {
            liked: false,
            replied: false
          },
          videoUrl: result,
          cid: result2.cid || "",
          commentId: result2.cid || ""
        });
        applyEntryMetaToLead(list[list.length - 1]);
      } catch (error) {
        num4++;
      }
    });
    const value3 = result4 ? ", 地区过滤跳过:" + num5 + "（通过:" + num6 + "，未知:" + num7 + "，" + result3 + "）" : "";
    console.log("[Built-in-Debug] [评论抓取] 抓取完毕。有效评论: " + list.length + "条 (跳过作者:" + num + ", 跳过二级:" + num2 + ", 跳过自己:" + num3 + ", 解析失败/无时间:" + num4 + value3 + ")");
    if (result4) {
      if (num5 > 0) {
        reportTraceLog("📍 地区过滤：本屏跳过 " + num5 + " 条、保留 " + list.length + " 条（" + result3 + "）");
        list2.forEach(arg1 => {
          reportTraceLog("📍 过滤跳过：" + arg1, null, "warning");
        });
      } else if (list.length === 0) {
        reportTraceLog("📍 地区过滤：本屏 0 条入库（" + result3 + "，可能属地均未命中或均为未知）", null, "warning");
      } else {
        reportTraceLog("📍 地区过滤：本屏 " + list.length + " 条通过（" + result3 + "）");
        list3.forEach(arg1 => {
          reportTraceLog("📍 过滤通过：" + arg1);
        });
      }
    }
    const obj = {
      leads: list,
      actionsPerformed: 0
    };
    const value4 = typeof queryKnownLeadKeys === "function" ? await queryKnownLeadKeys(list) : null;
    let num8 = 0;
    let num9 = 0;
    let num10 = 0;
    const set = new Set();
    const result7 = list.filter(arg1 => {
      const result = getLeadPrimaryKey(arg1);
      if (result && set.has(result)) {
        num8++;
        return false;
      }
      if (isLeadInSession(arg1)) {
        num9++;
        return false;
      }
      const value = value4 instanceof Set ? getLeadAliasKeys(arg1).some(arg1 => value4.has(arg1)) : isLeadInKnownPool(arg1);
      if (value) {
        num10++;
        return false;
      }
      if (result) {
        set.add(result);
      }
      markLeadInSession(arg1);
      return true;
    });
    obj.newLeadsCount = result7.length;
    obj.parsedCount = list.length;
    obj.sessionSkipCount = num9;
    if (list.length > 0) {
      const result = formatScrapeScreenProgress(list.length, result7.length, num8, num9, num10, state.currentTask?.taskMode);
      console.log("[Built-in-Debug] [去重统计] 解析" + list.length + " 新入库" + result7.length + " 跳过(本屏" + num8 + "/本任务" + num9 + "/历史" + num10 + ")");
      reportCurrentAction(result);
      if (typeof window._saveRadarState === "function") {
        window._saveRadarState();
      }
      if (result7.length > 0) {
        ipcRenderer.send("automation-data", {
          type: "comment",
          payload: result7,
          taskId: state.activeLoopId,
          viewKey: state.currentTask?.viewKey,
          isAiMode: shouldUseAiCommentAnalysis(state.currentTask)
        });
      }
    }
    if (state.currentTask?.taskMode === "scrape" && shouldUseAiCommentAnalysis(state.currentTask)) {
      console.log("[Built-in-Debug] [仅采集模式] 将 " + result7.length + " 条线索加入异步 AI 分析队列...");
      pushToScrapeAiQueue(result7);
      return obj;
    }
    if (state.currentTask?.taskMode === "scrape" || state.currentTask?.enableLike === false && state.currentTask?.enableComment === false && state.currentTask?.enableFollow === false && state.currentTask?.enableDM === false) {
      console.log("[Built-in-Debug] [仅采集/无动作模式] 本轮捕获 " + result7.length + " 条符合要求的线索，跳过后续互动。");
      return obj;
    }
    if (result7.length > 0 && (arg4.likes > 0 || arg4.comments > 0 || arg4.follows > 0 || arg4.dms > 0)) {
      let map = new Map();
      let map2 = new Map();
      if (shouldUseCommentKeywordFilter(state.currentTask) && shouldUseAiReplyGeneration(state.currentTask)) {
        map2 = await prefetchKeywordReplyContents(result7, arg3);
      }
      if (shouldUseAiCommentAnalysis(state.currentTask)) {
        console.log("[Built-in-Debug] [深度AI] 正在对 " + result7.length + " 条线索进行分批智能分析...");
        console.log("%c[AI分析] 🤖 AI 正在分析 " + result7.length + " 条评论，请稍候...", "color: #8b5cf6; font-weight: bold;");
        const {
          forBackend: forBackend,
          localDecisions: localDecisions,
          localCount: localCount,
          localLeads: localLeads
        } = prepareLeadsForAiAnalysis(result7);
        localDecisions.forEach((arg1, arg2) => map.set(arg2, arg1));
        if (localCount > 0) {
          reportTraceLog("🤖 AI 分析：" + localCount + " 条已本地判定（高意向/灌水等，跳过云端），" + forBackend.length + " 条提交后端…");
          ipcRenderer.send("automation-data", {
            type: "comment",
            payload: localLeads,
            taskId: state.activeLoopId,
            viewKey: state.currentTask?.viewKey,
            isAiMode: true
          });
        } else if (forBackend.length > 0) {
          reportTraceLog("🤖 AI 分析：" + forBackend.length + " 条评论提交后端…");
        }
        for (let num = 0; num < forBackend.length; num += 10) {
          if (shouldAbort(arg3)) {
            break;
          }
          const result = forBackend.slice(num, num + 10);
          const value = Math.floor(num / 10) + 1;
          const local = Math.ceil(forBackend.length / 10) || 1;
          console.log("%c[AI分析] 📊 正在分析第 " + value + "/" + local + " 批 (" + result.length + " 条)...", "color: #8b5cf6;");
          reportTraceLog("🤖 AI 分析：第 " + value + "/" + local + " 批，" + result.length + " 条评论，请求后端（失败将自动重试直至成功）…");
          const result2 = Date.now();
          const result3 = await ipcRenderer.invoke("ai-intelligent-analyze-batch", buildAutomationAiPayload({
            leads: result,
            config: {
              aiRole: state.currentTask.aiRole,
              aiGoal: state.currentTask.aiGoal,
              aiStyle: state.currentTask.aiStyle,
              aiPrompt: state.currentTask.aiPrompt
            }
          }));
          if (shouldAbort(arg3) || isAiInvokeCancelled(result3)) {
            reportTraceLog("🤖 AI 分析：任务已停止，终止后续批次");
            break;
          }
          const result4 = ((Date.now() - result2) / 1000).toFixed(1);
          if (result3.success && result3.data) {
            console.log("%c[AI分析] ✅ 第 " + value + "/" + local + " 批分析完成", "color: #10b981; font-weight: bold;");
            reportTraceLog("🤖 AI 分析：第 " + value + " 批完成（耗时 " + result4 + "s，返回 " + result3.data.length + " 条判定）");
            result3.data.forEach((arg1, arg2) => {
              if (result[arg2]) {
                map.set(result[arg2].leadId, arg1);
                result[arg2].isHighIntention = arg1.decision !== "ignore";
                result[arg2].aiThought = arg1.aiThought;
                if (arg1.aiThought) {
                  result[arg2].thought = arg1.aiThought;
                }
                if (arg1.replyContent && !shouldUseTextlessReplyPayload()) {
                  result[arg2].actions = result[arg2].actions || {};
                  result[arg2].actions.replyContent = arg1.replyContent;
                }
                const value = arg1.decision === "ignore" ? "忽略" : arg1.decision === "both" ? "点赞+评论" : arg1.decision === "like" ? "点赞" : "评论";
                const value2 = arg1.decision === "ignore" ? "color: #64748b" : "color: #3b82f6; font-weight: bold";
                console.log("[AI判定] 线索: %c" + result[arg2].nickname + "%c, 决策: %c" + value + "%c, 理由: " + arg1.aiThought, "color: #f1f5f9; font-weight: bold", "color: #94a3b8", value2, "color: #94a3b8");
              }
            });
            ipcRenderer.send("automation-data", {
              type: "comment",
              payload: result,
              taskId: state.activeLoopId,
              viewKey: state.currentTask?.viewKey,
              isAiMode: true
            });
          } else {
            console.warn("[Built-in-Debug] AI 分析批次 (" + num + "-" + (num + 10) + ") 失败，跳过此批次。");
            const value2 = isFatalAiAuthError(result3?.msg) ? "（额度/授权问题，已停止重试）" : "";
            reportTraceLog("🤖 AI 分析：第 " + value + " 批失败（耗时 " + result4 + "s）" + value2 + "：" + clipTraceText(result3?.msg || "未知原因"));
          }
        }
        if (!shouldAbort(arg3)) {
          console.log("%c[AI分析] 🎉 所有评论分析完成！共 " + result7.length + " 条（本地 " + localCount + " + 云端 " + forBackend.length + "）", "color: #10b981; font-weight: bold; font-size: 13px;");
          reportTraceLog("🤖 AI 分析：本视频完成，共 " + result7.length + " 条（本地 " + localCount + "，云端 " + forBackend.length + "）");
        }
      }
      for (const item of result7) {
        if (shouldAbort(arg3)) {
          break;
        }
        if (arg4.likes <= 0 && arg4.comments <= 0 && (state.currentTask?.enableLike || state.currentTask?.enableComment)) {
          console.log("[Built-in-Debug] [配额检查] 本视频点赞/评论配额已达上限，停止互动。");
          noteVideoLocalQuotaExhaustedOnce(arg3);
          const result = result7.indexOf(item);
          for (let result2 = Math.max(0, result); result2 < result7.length; result2 += 1) {
            const value = result7[result2];
            if (!value?.isHighIntention) {
              continue;
            }
            const result = resolveInteractionSkipReason(value, {
              budget: arg4,
              interactionEntered: true
            });
            emitLeadInteractionUpdate(value, {
              actionSkipReason: result
            });
          }
          break;
        }
        if (isInteractionLimitReached()) {
          console.log("[Built-in-Debug] [总量熔断] 互动总量已达上限，停止本视频互动。");
          const result = result7.indexOf(item);
          for (let result2 = Math.max(0, result); result2 < result7.length; result2 += 1) {
            const value = result7[result2];
            if (!value?.isHighIntention) {
              continue;
            }
            const result = resolveInteractionSkipReason(value, {
              budget: arg4,
              interactionEntered: true
            });
            reportTraceLog("⏭ @" + value.nickname + "：" + result);
            emitLeadInteractionUpdate(value, {
              actionSkipReason: result
            });
          }
          break;
        }
        let flag = false;
        let flag2 = false;
        const result = map.get(item.leadId);
        const result2 = resolveFollowUpFlags(arg4);
        let text = "";
        const local = async () => {
          const result = await performLike(arg1, item, arg3, {
            detail: true
          });
          if (result && typeof result === "object") {
            if (!result.success) {
              text = result.errorCode || result.error || "";
            }
            return !!result.success;
          }
          return !!result;
        };
        if (result) {
          const {
            decision: decision,
            replyContent: replyContent,
            aiThought: aiThought
          } = result;
          const result3 = shouldUseTextlessReplyPayload();
          const value = result3 ? null : replyContent;
          const local2 = (decision === "reply" || decision === "both") && (!!value || result3);
          const local3 = decision === "like" || decision === "both";
          console.log("[Built-in-Debug] [AI判定] 线索: " + item.nickname + ", 决策: " + decision + ", 回复: " + local2 + ", 点赞: " + local3);
          if (decision === "ignore") {
            markLeadInSession(item);
            console.log("[Built-in-Debug] [AI判定] 线索 " + item.nickname + " 被标记为忽略，跳过互动。");
            continue;
          }
          let flag3 = false;
          const local4 = local2 && state.currentTask.enableComment && arg4.comments > 0;
          const local5 = local3 && state.currentTask.enableLike && arg4.likes > 0;
          let flag4 = false;
          if (local4 && local5) {
            const value = arg4.likes / (arg4.likes + arg4.comments);
            flag4 = Math.random() < value;
          } else if (local5 && !local4) {
            flag4 = true;
          }
          if (state.currentTask?.commentOnProfileFirstWork && local4) {
            flag4 = false;
          }
          if (flag4) {
            if (local5) {
              flag2 = true;
              const result = await local();
              if (result) {
                arg4.likes--;
                recordLeadTouch(item, "like");
                flag = true;
                flag3 = true;
                incrementInteractionCount();
                arg5();
              }
            }
            if (!flag3 && local4) {
              flag2 = true;
              const result = await executeLeadCommentAction(arg1, item, arg3, value, result2);
              if (markLeadTargetRejected(item, result)) {
                flag3 = true;
              }
              if (result && result.success) {
                arg4.comments--;
                if (result.profileWorkCommented) {
                  recordLeadTouch(item, "profileComment", {
                    content: result.content || value || "已回复"
                  });
                } else {
                  recordLeadTouch(item, "reply", {
                    content: result.content || value || "已回复"
                  });
                }
                if (result.selfLiked) {
                  item.actions = item.actions || {};
                  item.actions.selfLiked = true;
                  item.selfLiked = true;
                }
                flag = true;
                flag3 = true;
                incrementInteractionCount();
                arg5();
              }
            }
          } else {
            if (local4) {
              flag2 = true;
              const result = await executeLeadCommentAction(arg1, item, arg3, value, result2);
              if (markLeadTargetRejected(item, result)) {
                flag3 = true;
              }
              if (result && result.success) {
                arg4.comments--;
                if (result.profileWorkCommented) {
                  recordLeadTouch(item, "profileComment", {
                    content: result.content || value || "已回复"
                  });
                } else {
                  recordLeadTouch(item, "reply", {
                    content: result.content || value || "已回复"
                  });
                }
                if (result.selfLiked) {
                  item.actions = item.actions || {};
                  item.actions.selfLiked = true;
                  item.selfLiked = true;
                }
                flag = true;
                flag3 = true;
                incrementInteractionCount();
                arg5();
              }
            }
            if (!flag3 && local5) {
              flag2 = true;
              const result = await local();
              if (result) {
                arg4.likes--;
                recordLeadTouch(item, "like");
                flag = true;
                flag3 = true;
                incrementInteractionCount();
                arg5();
              }
            }
          }
          if (!flag && !flag3 && decision !== "ignore") {
            console.log("[Built-in-Debug] [AI跳过] 线索 " + item.nickname + " 符合 AI 意向但由于配额不足或配置关闭未执行动作。");
          }
        }
        if (!flag && !shouldUseAiCommentAnalysis(state.currentTask)) {
          if (!item.isHighIntention) {
            console.log("[Built-in-Debug] [关键词跳过] 线索 " + item.nickname + " 未匹配到任何关键词，非高意向，跳过互动动作");
            continue;
          }
          const local2 = state.currentTask?.enableLike && arg4.likes > 0;
          const local3 = state.currentTask?.enableComment && arg4.comments > 0;
          if (local2 || local3) {
            console.log("[Built-in-Debug] [模式切换] 线索 " + item.nickname + " 匹配到关键词，进入高意向" + (shouldUseAiReplyGeneration(state.currentTask) ? "AI回复" : "模板") + "匹配逻辑");
          }
          const local4 = async () => {
            if (!shouldUseAiReplyGeneration(state.currentTask)) {
              return executeLeadCommentAction(arg1, item, arg3, null, result2);
            }
            if (shouldUseTextlessReplyPayload()) {
              reportTraceLog("🤖 AI 回复：@" + item.nickname + " 纯图片/表情/@ 模式，跳过文案生成");
              return executeLeadCommentAction(arg1, item, arg3, null, result2);
            }
            const result = map2.get(item.leadId);
            if (state.currentTask?.commentOnProfileFirstWork) {
              if (!result) {
                reportTraceLog("🤖 首作评论：@" + item.nickname + " 将在作品页单独生成文案");
              }
              return executeLeadCommentAction(arg1, item, arg3, result || null, result2);
            }
            if (result) {
              return executeLeadCommentAction(arg1, item, arg3, result, result2);
            }
            if (hasLocalReplyTemplates()) {
              reportTraceLog("🤖 AI 回复不可用，回退本地模板 @" + item.nickname);
              return executeLeadCommentAction(arg1, item, arg3, null, result2);
            }
            reportTraceLog("🤖 AI 回复：@" + item.nickname + " 无预生成文案且无本地模板，已跳过");
            return null;
          };
          let flag3 = false;
          if (local2 && local3) {
            const value = arg4.likes / (arg4.likes + arg4.comments);
            flag3 = Math.random() < value;
          } else if (local2 && !local3) {
            flag3 = true;
          }
          if (flag3) {
            if (local2) {
              flag2 = true;
              flag = await local();
              if (flag) {
                arg4.likes--;
                recordLeadTouch(item, "like");
                incrementInteractionCount();
                arg5();
              }
            }
            if (!flag && local3) {
              flag2 = true;
              const result = await local4();
              if (result && result.success) {
                arg4.comments--;
                if (result.profileWorkCommented) {
                  recordLeadTouch(item, "profileComment", {
                    content: result.content || "已回复"
                  });
                } else {
                  recordLeadTouch(item, "reply", {
                    content: result.content || "已回复"
                  });
                }
                if (result.selfLiked) {
                  item.actions = item.actions || {};
                  item.actions.selfLiked = true;
                  item.selfLiked = true;
                }
                flag = true;
                incrementInteractionCount();
                arg5();
              }
            }
          } else {
            if (local3) {
              flag2 = true;
              const result = await local4();
              if (result && result.success) {
                arg4.comments--;
                if (result.profileWorkCommented) {
                  recordLeadTouch(item, "profileComment", {
                    content: result.content || "已回复"
                  });
                } else {
                  recordLeadTouch(item, "reply", {
                    content: result.content || "已回复"
                  });
                }
                if (result.selfLiked) {
                  item.actions = item.actions || {};
                  item.actions.selfLiked = true;
                  item.selfLiked = true;
                }
                flag = true;
                incrementInteractionCount();
                arg5();
              }
            }
            if (!flag && local2) {
              flag2 = true;
              flag = await local();
              if (flag) {
                arg4.likes--;
                recordLeadTouch(item, "like");
                incrementInteractionCount();
                arg5();
              }
            }
          }
        } else if (!flag && shouldUseAiCommentAnalysis(state.currentTask) && !result) {
          console.log("[Built-in-Debug] [AI保护] 线索 " + item.nickname + " 无 AI 分析结果，AI 模式下拒绝自动互动。");
        }
        const local2 = !!state.currentTask?.enableFollow || !!state.currentTask?.enableDM;
        const local3 = shouldUseAiCommentAnalysis(state.currentTask) && (!result || result.decision === "ignore");
        if (item.isHighIntention && local2 && !local3) {
          if (!flag) {
            flag2 = true;
          }
          const result = await applyFollowUpActions(arg1, item, arg3, arg4, arg5);
          if (result) {
            flag = true;
          }
        }
        if (flag) {
          markLeadInSession(item);
          ipcRenderer.send("add-to-blacklist", [buildBlacklistEntry(item, state.currentTask)]);
          emitLeadInteractionUpdate(item);
          obj.actionsPerformed++;
          await awaitPostActionRest(arg3, {
            profileWork: !!item.actions?.profileWorkCommented
          });
          await awaitInteractionCooldown(arg3, {
            profileWorkCommented: !!item.actions?.profileWorkCommented
          });
        } else if (item.isHighIntention) {
          const result2 = resolveInteractionSkipReason(item, {
            budget: arg4,
            aiDecision: result,
            interactionEntered: true,
            actionAttempted: flag2,
            likeErrorCode: text
          });
          if (isVideoLocalQuotaExhaustedReason(result2)) {
            noteVideoLocalQuotaExhaustedOnce(arg3);
          } else {
            reportTraceLog("⏭ @" + item.nickname + "：" + result2);
          }
          emitLeadInteractionUpdate(item, {
            actionSkipReason: result2
          });
        }
      }
    } else if (result7.length > 0) {
      for (const item of result7) {
        if (!item?.isHighIntention) {
          continue;
        }
        const result = resolveInteractionSkipReason(item, {
          budget: arg4,
          interactionEntered: false
        });
        if (isVideoLocalQuotaExhaustedReason(result)) {
          noteVideoLocalQuotaExhaustedOnce(arg3);
        } else {
          reportTraceLog("⏭ @" + item.nickname + "：" + result);
        }
        emitLeadInteractionUpdate(item, {
          actionSkipReason: result
        });
      }
    }
    return obj;
  }
  return {
    applySearchFilters: applySearchFilters,
    buildImageAttachScope: buildImageAttachScope,
    captureCurrentVideoMetadata: captureCurrentVideoMetadata,
    collectCommentImageTriggerCandidates: collectCommentImageTriggerCandidates,
    describeProfileNoWorksReason: describeProfileNoWorksReason,
    describeProfileWorksNotReadyReason: describeProfileWorksNotReadyReason,
    describeReplyEnvironment: describeReplyEnvironment,
    ensureProfileWorksTab: ensureProfileWorksTab,
    extractLeads: extractLeads,
    findCommentPanelRoot: findCommentPanelRoot,
    findDouyinEmojiPanel: findDouyinEmojiPanel,
    findEmojiTriggerBtn: findEmojiTriggerBtn,
    findMainVideoCommentInput: findMainVideoCommentInput,
    findProfileVideoCards: findProfileVideoCards,
    findTargetNode: findTargetNode,
    formatScrapeCommentScrollAction: formatScrapeCommentScrollAction,
    formatScrapeGuardWaitLabel: formatScrapeGuardWaitLabel,
    getCommentComposerRoot: getCommentComposerRoot,
    getCommentItemLooseSelector: getCommentItemLooseSelector,
    getCommentItemSelector: getCommentItemSelector,
    getCommentPanelSelector: getCommentPanelSelector,
    getMainCommentInputShellSelector: getMainCommentInputShellSelector,
    getProfilePostListRoot: getProfilePostListRoot,
    getVideoAuthorInfo: getVideoAuthorInfo,
    getVideoAuthorNickname: getVideoAuthorNickname,
    getVideoAuthorProfileUrl: getVideoAuthorProfileUrl,
    getVideoTitle: getVideoTitle,
    hasCommentNonTextPayload: hasCommentNonTextPayload,
    isProfileFirstCommentAiMode: isProfileFirstCommentAiMode,
    isProfileFirstWorkCommentDone: isProfileFirstWorkCommentDone,
    matchExcludedVideoAuthor: matchExcludedVideoAuthor,
    mergeCommentSelectors: mergeCommentSelectors,
    normalizeAuthorAccountName: normalizeAuthorAccountName,
    parseExcludeAuthorAccounts: parseExcludeAuthorAccounts,
    parseProfileWorksCount: parseProfileWorksCount,
    pauseSettleThenCaptureVideoMetadata: pauseSettleThenCaptureVideoMetadata,
    performLike: performLike,
    performProfileActions: performProfileActions,
    performProfileFirstWorkComment: performProfileFirstWorkComment,
    performReply: performReply,
    postVideoComment: postVideoComment,
    profileHasNoPublicWorks: profileHasNoPublicWorks,
    queryCommentItemNodes: queryCommentItemNodes,
    reportMonitorActionProgress: reportMonitorActionProgress,
    resetCommentImageRotation: resetCommentImageRotation,
    resolveCommentImagePaths: resolveCommentImagePaths,
    resolveCommentPanelRoot: resolveCommentPanelRoot,
    resolveMainCommentWritableElement: resolveMainCommentWritableElement,
    resolveMainVideoCommentText: resolveMainVideoCommentText,
    resolveVideoCommentImagePaths: resolveVideoCommentImagePaths,
    restoreCommentAttachmentRotationFromSession: restoreCommentAttachmentRotationFromSession,
    persistCommentAttachmentRotation: persistCommentAttachmentRotation,
    saveCommentScrapeProgress: saveCommentScrapeProgress,
    syncCommentAttachmentRotationFromBatchStorage: syncCommentAttachmentRotationFromBatchStorage,
    waitAndCaptureCurrentVideoMetadata: waitAndCaptureCurrentVideoMetadata,
    waitForProfileWorksReady: waitForProfileWorksReady
  };
}
module.exports = {
  createCommentAutomationController: createCommentAutomationController
};
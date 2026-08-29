'use strict';

const {
  looksLikeDouyinGroupChatName,
  looksLikeOpenDouyinGroupChatHeader
} = require("./douyinDmGroupChat");
const {
  isDouyinStrangerMessagesFolderName,
  isGenericDouyinChatNickname,
  normalizeDouyinChatPreview,
  scoreDouyinChatRowMatch
} = require("./douyinChatModule");
const {
  isDouyinChatSystemHint,
  classLooksLikeSelfChatBubble,
  isChatBubbleAlignedSelf,
  isRealSelfOutboundChatMessage
} = require("./douyinChatSelfMessage");
const {
  classifyDouyinDmPlatformHint,
  resolveDouyinDmSendResult
} = require("./douyinDmSendResult");
const {
  resolveSelfWarmupContentMode
} = require("./selfWarmupTemplates");
function createDouyinDirectMessageController(options = {}) {
  const {
    clipTraceText: clipTraceText,
    closeAllModals: closeAllModals,
    findSmartElement: findSmartElement,
    getDmV2List: getDmV2List,
    getDmV2String: getDmV2String,
    getElementClassText: getElementClassText,
    getComputedStyle: getComputedStyle,
    hasDmRuntimeReady: hasDmRuntimeReady,
    insertTextIntoEditable: insertTextIntoEditable,
    ipcRenderer: ipcRenderer,
    isElementInViewport: isElementInViewport,
    isVisibleElement: isVisibleElement,
    randomDelay: randomDelay,
    shouldAbort: shouldAbort,
    simulateHumanClick: simulateHumanClick,
    simulateTrustedElementClick: simulateTrustedElementClick,
    simulateTrustedEnter: simulateTrustedEnter,
    sleep: sleep,
    waitForDmInput: waitForDmInput,
    waitForSmartElement: waitForSmartElement,
    state: state
  } = options;
  function fn() {
    const result = getDmV2String("dmBlockActiveRoots");
    const result2 = getDmV2String("dmDialog");
    const result3 = getDmV2String("dmBlockNodeCandidates");
    const result4 = getDmV2String("dmBlockGlobalHints");
    if (!result || !result2 || !result3 || !result4) {
      return null;
    }
    let list = [];
    try {
      list = Array.from(document.querySelectorAll(result)).filter(arg1 => isVisibleElement(arg1) && isElementInViewport(arg1, 0));
    } catch (error) {
      return null;
    }
    const value = list.length ? list : (() => {
      try {
        return Array.from(document.querySelectorAll(result2));
      } catch (error) {
        return [];
      }
    })();
    const list2 = [];
    for (const item of value) {
      try {
        list2.push(...item.querySelectorAll(result3));
      } catch (error) {}
    }
    try {
      list2.push(...document.querySelectorAll(result4));
    } catch (error) {}
    const list3 = [];
    for (const item of Array.from(new Set(list2))) {
      if (!isVisibleElement(item) || !isElementInViewport(item, 0)) {
        continue;
      }
      const result = (item.innerText || item.textContent || "").replace(/\s+/g, " ").trim();
      if (!result || result.length > 280) {
        continue;
      }
      const result2 = classifyDouyinDmPlatformHint(result);
      if (result2) {
        list3.push({
          hint: result2,
          textLength: result.length,
          childCount: item.children?.length || 0
        });
      }
    }
    list3.sort((arg1, arg2) => arg1.textLength - arg2.textLength || arg1.childCount - arg2.childCount);
    return list3[0]?.hint || null;
  }
  function logSelfWarmupDm(arg1, arg2 = null) {
    const value = arg2 && Object.keys(arg2).length ? " | " + JSON.stringify(arg2) : "";
    const value2 = "[SelfWarmup-DM] " + arg1 + value;
    console.log(value2);
    try {
      ipcRenderer.send("self-warmup-dm-log", {
        message: arg1,
        extra: arg2,
        ts: Date.now()
      });
    } catch (error) {}
  }
  function fn3(arg1) {
    if (!arg1) {
      return {
        exists: false
      };
    }
    const result = arg1.getBoundingClientRect();
    return {
      exists: true,
      tag: arg1.tagName,
      dataE2e: arg1.getAttribute?.("data-e2e") || "",
      className: clipTraceText(getElementClassText(arg1), 60),
      valuePreview: clipTraceText(fn4(arg1.innerText || arg1.value || ""), 48),
      rect: Math.round(result.width) + "x" + Math.round(result.height) + "@" + Math.round(result.left) + "," + Math.round(result.top)
    };
  }
  function fn4(arg1) {
    return String(arg1 || "").replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
  }
  function fn5(arg1) {
    return String(arg1 || "").replace(/\s+/g, " ").replace(/(?:\s*[·•]?\s*(?:点赞|回复|撤回|删除|复制|举报|多选|转发))+$/g, "").trim();
  }
  function fn6(arg1) {
    const local = arg1 => String(arg1 || "").replace(/\s+/g, " ").trim();
    const result = local(arg1);
    if (!result) {
      return {
        verified: false,
        reason: "empty_text",
        node: null
      };
    }
    const result2 = result.slice(0, Math.min(12, result.length));
    const result3 = getDmV2String("dmDialog");
    const result4 = getDmV2String("dmMessageItems");
    if (!result3 || !result4) {
      return {
        verified: false,
        reason: "runtime_config_missing",
        node: null
      };
    }
    let list = [];
    try {
      list = Array.from(document.querySelectorAll(result3));
    } catch (error) {
      return {
        verified: false,
        reason: "invalid_runtime_selector",
        node: null
      };
    }
    for (const item of list) {
      const result = Array.from(item.querySelectorAll(result4));
      for (let value = result.length - 1; value >= 0; value -= 1) {
        const result3 = local(result[value].innerText || result[value].textContent || "");
        if (!result3 || result3.length > 500) {
          continue;
        }
        if (result3.includes(result2) || result2.length >= 6 && result3.includes(result2.slice(0, 6))) {
          const local = fn5(result3) || result3;
          return {
            verified: true,
            snippet: clipTraceText(local, 80),
            node: result[value]
          };
        }
      }
    }
    return {
      verified: false,
      reason: "message_not_in_chat",
      node: null
    };
  }
  function fn7(text = "") {
    const result = String(text || "").match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (!result) {
      return false;
    }
    const [, local, local2, local3] = result.map(Number);
    return local >= 180 && local2 <= 105 && local3 <= 125;
  }
  function fn8(arg1) {
    if (!arg1 || !arg1.getBoundingClientRect) {
      return null;
    }
    const result = arg1.getBoundingClientRect();
    const list = [];
    let local = arg1;
    for (let num = 0; local && num < 6; num += 1, local = local.parentElement) {
      const result = local.getBoundingClientRect();
      if (result.width > 0 && result.height > 0 && result.height <= 220) {
        list.push(local);
      }
    }
    const list2 = [];
    const result2 = getDmV2String("dmFailureCandidates");
    const result3 = getDmV2String("dmFailureIconInner");
    if (!result2 || !result3) {
      return null;
    }
    for (const item of list) {
      try {
        list2.push(...item.querySelectorAll(result2));
      } catch (error) {}
    }
    for (const item of Array.from(new Set(list2))) {
      if (item === arg1 || !isVisibleElement(item) || !isElementInViewport(item, 0)) {
        continue;
      }
      const result2 = item.getBoundingClientRect();
      if (result2.width < 4 || result2.height < 4 || result2.width > 42 || result2.height > 42) {
        continue;
      }
      const value = result2.top + result2.height / 2;
      if (value < result.top - 32 || value > result.bottom + 32) {
        continue;
      }
      if (result2.right < result.left - 90 || result2.left > result.right + 90) {
        continue;
      }
      const result4 = getComputedStyle(item);
      const result5 = [item.className, item.getAttribute?.("aria-label"), item.getAttribute?.("title"), item.innerText, item.textContent].map(arg1 => String(arg1 || "")).join(" ");
      const result6 = /fail|error|retry|发送失败|重试|失败/i.test(result5);
      const local = (fn7(result4.color) || fn7(result4.backgroundColor)) && result2.width <= 28 && result2.height <= 28 && (item.matches?.(result3) || !!item.querySelector?.(result3) || /!|！/.test(result5));
      if (!result6 && !local) {
        continue;
      }
      return {
        className: clipTraceText(getElementClassText(item), 80),
        ariaLabel: clipTraceText(item.getAttribute?.("aria-label") || "", 60),
        title: clipTraceText(item.getAttribute?.("title") || "", 60),
        text: clipTraceText(item.innerText || item.textContent || "", 40),
        color: String(result4.color || ""),
        backgroundColor: String(result4.backgroundColor || "")
      };
    }
    return null;
  }
  function getDouyinDmSendResult(arg1, options = {}) {
    const result = fn6(arg1);
    const result2 = fn8(result.node);
    const result3 = fn();
    const local = options.msgInput || null;
    const result4 = fn4(local ? local.innerText || local.value || "" : options.inputText || "");
    const result5 = resolveDouyinDmSendResult({
      expectedText: arg1,
      inputText: result4,
      bubbleFound: result.verified,
      snippet: result.snippet || "",
      failureMarkerFound: !!result2,
      failureMarker: result2,
      platformHint: result3
    });
    return {
      ...result5,
      verified: result5.status === "sent",
      snippet: result5.snippet || result.snippet || "",
      verifyDetail: result5.snippet || result.reason || "",
      inputCleared: !String(result4 || "").trim(),
      failureMarker: result2 || null,
      platformHint: result5.platformHint || result3 || null
    };
  }
  function fn10() {
    if (typeof getDmV2String === "function") {
      return getDmV2String("dmSendPrimary");
    } else {
      return "";
    }
  }
  function fn11(arg1, arg2) {
    if (!arg1 || !arg2 || !isVisibleElement(arg1)) {
      return false;
    }
    try {
      const result = arg1.getBoundingClientRect();
      const result2 = arg2.getBoundingClientRect();
      if (result.width <= 0 || result.height <= 0 || result2.width <= 0 || result2.height <= 0) {
        return false;
      }
      const value = result.top + result.height / 2;
      const value2 = result2.top + result2.height / 2;
      const value3 = result.left - result2.right;
      return result.left >= result2.left + result2.width * 0.55 && Math.abs(value - value2) <= 80 && value3 >= -40 && value3 <= 220;
    } catch (error) {
      return false;
    }
  }
  function fn12(arg1) {
    if (!arg1) {
      return null;
    }
    const result = fn10();
    if (!result) {
      return null;
    }
    let value = arg1.parentElement;
    for (let num = 0; num < 10 && value; num += 1) {
      let list = [];
      try {
        list = Array.from(value.querySelectorAll(result));
      } catch (error) {
        list = [];
      }
      const result2 = list.find(arg12 => fn11(arg12, arg1));
      if (result2) {
        return result2;
      }
      value = value.parentElement;
    }
    return null;
  }
  async function fn13(arg1, arg2 = null) {
    const result = fn12(arg2);
    if (result) {
      return result;
    }
    let result2 = findSmartElement("dmSendBtn");
    if (result2 && isVisibleElement(result2)) {
      const local = result2.matches?.("[class*=\"sender\"], [class*=\"Sender\"], [data-e2e*=\"sender\"], [data-e2e*=\"Sender\"]") || result2.closest?.("[class*=\"sender\"], [class*=\"Sender\"], [data-e2e*=\"sender\"], [data-e2e*=\"Sender\"]");
      if (!local && fn11(result2, arg2)) {
        return result2;
      }
    }
    const value = typeof getDmV2String === "function" ? getDmV2String("dmDialog") : "";
    const value2 = typeof getDmV2String === "function" ? getDmV2String("dmSendSvgCandidates") : "";
    const value3 = typeof getDmV2String === "function" ? getDmV2String("dmSendClickableRoot") : "";
    const value4 = typeof getDmV2String === "function" ? getDmV2String("dmSendTextCandidates") : "";
    if (!value || !value2 || !value3 || !value4) {
      return null;
    }
    const local = arg2?.closest?.(value) || document;
    const value5 = typeof getDmV2List === "function" ? getDmV2List("sendSvgHints") : [];
    const result3 = Array.from(local.querySelectorAll(value2));
    for (const item of result3) {
      const local = item.innerHTML || "";
      const local2 = value5.find(arg1 => arg1 && local.includes(arg1)) || "";
      if (local2) {
        const result = item.closest(value3);
        if (result && fn11(result, arg2)) {
          return result;
        }
      }
    }
    const value6 = typeof getDmV2List === "function" ? getDmV2List("sendExactTexts") : [];
    return Array.from(local.querySelectorAll(value4)).find(arg1 => fn11(arg1, arg2) && value6.includes(arg1.innerText)) || null;
  }
  function fn14() {
    const local = arg1 => String(arg1 || "").replace(/\s+/g, " ").trim();
    const value = typeof getDmV2String === "function" ? getDmV2String("conversationItem") : "";
    const value2 = typeof getDmV2List === "function" ? getDmV2List("strangerFolderTexts") : [];
    if (!value || !value2.length) {
      return null;
    }
    const value3 = value2[0];
    const result = Array.from(document.querySelectorAll(value)).filter(arg1 => {
      if (!isVisibleElement(arg1)) {
        return false;
      }
      const result = arg1.getBoundingClientRect();
      if (result.width < 80 || result.height < 24 || result.width > 720 || result.height > 160) {
        return false;
      }
      const result2 = local(arg1.innerText || arg1.textContent || "");
      if (!result2 || !value2.some(arg1 => result2.includes(arg1))) {
        return false;
      }
      if (result2.length > 36 && !result2.startsWith(value3)) {
        return false;
      }
      return true;
    }).sort((arg1, arg2) => {
      const local2 = arg1 => {
        const result = local(arg1.innerText || arg1.textContent || "");
        const result2 = arg1.getBoundingClientRect();
        let num = 0;
        if (result.startsWith(value3)) {
          num += 100;
        }
        if (result === value3) {
          num += 50;
        }
        return num + Math.min(result2.width * result2.height / 1000, 30);
      };
      return local2(arg2) - local2(arg1);
    });
    return result[0] || null;
  }
  async function fn15(arg1, arg2, arg3, options = {}) {
    const result = String(arg1 || "").replace(/^@+/, "").trim();
    if (!result) {
      return null;
    }
    if (isDouyinStrangerMessagesFolderName(result)) {
      arg3?.("目标是陌生人消息文件夹，不是具体会话", {
        nickname: result
      });
      return null;
    }
    const flag = !!options.forceFolder;
    let value = flag ? null : fn16(result);
    if (!value) {
      const result2 = fn14();
      if (!result2) {
        arg3?.("未找到陌生人消息入口", {
          nickname: result
        });
        return null;
      }
      arg3?.("点击陌生人消息入口", {
        text: clipTraceText(result2.innerText || result2.textContent || "", 30),
        forceFolder: flag
      });
      await simulateHumanClick(result2, arg2);
      await sleep(1800);
      value = fn16(result);
      if (!value) {
        await sleep(1200);
        value = fn16(result);
      }
    }
    if (!value) {
      arg3?.("陌生人消息内未找到对应用户会话", {
        nickname: result
      });
      return null;
    }
    arg3?.("点击陌生人会话进入对话框", {
      tag: value.clickTarget?.tagName || "",
      nickname: result
    });
    await simulateHumanClick(value.clickTarget, arg2);
    await sleep(1800);
    let result2 = await waitForDmInput(arg2, 18000, value.clickTarget);
    if (!result2) {
      arg3?.("陌生人会话输入框未出现，重试点击会话行");
      await simulateHumanClick(value.row || value.clickTarget, arg2);
      await sleep(1200);
      result2 = await waitForDmInput(arg2, 14000, value.clickTarget);
    }
    return result2 || null;
  }
  async function sendDmOnCurrentProfile(arg1, text2 = "SELF_WARMUP", options = {}) {
    const result = String(arg1 || "").trim();
    const result2 = String(options.nickname || "").trim();
    const result3 = String(options.userUrl || window.location.href || "").trim();
    const obj = {
      nickname: result2,
      userUrl: result3,
      steps: []
    };
    const local = (arg1, options = {}) => {
      obj.steps.push({
        step: arg1,
        ...options,
        at: Date.now()
      });
      logSelfWarmupDm(arg1, {
        nickname: result2,
        ...options
      });
    };
    if (!result) {
      return {
        ok: false,
        reason: "无私信文案",
        debug: obj
      };
    }
    if (typeof hasDmRuntimeReady !== "function" || !hasDmRuntimeReady()) {
      return {
        ok: false,
        reason: "私信运行配置未就绪，本次不执行",
        errorCode: "dm_runtime_config_missing",
        debug: obj
      };
    }
    local("开始主页私信", {
      url: result3,
      msgPreview: clipTraceText(result, 40)
    });
    state.stopRequested = false;
    try {
      window.focus?.();
    } catch (error) {}
    try {
      if (state.currentViewKey) {
        ipcRenderer.send("focus-automation-view", {
          viewKey: state.currentViewKey,
          bringToFront: true
        });
        const result = await ipcRenderer.invoke("ensure-background-automation-layout", {
          viewKey: state.currentViewKey,
          claimInteractionSlot: true,
          requireComposerSurface: true
        });
        local("私信执行视口已准备", {
          ok: result?.ok !== false,
          reason: result?.reason || "",
          surfaceWarmupMs: Number(result?.surfaceWarmupMs || 0),
          slotWaitedMs: Number(result?.interactionSlotWaitedMs || 0)
        });
      }
    } catch (error) {
      local("私信执行视口准备异常，继续等待控件稳定", {
        reason: error?.message || String(error)
      });
    }
    await closeAllModals(text2);
    await sleep(1000);
    const result4 = await waitForSmartElement("profileMessageBtn", text2, 20000);
    if (!result4) {
      return {
        ok: false,
        reason: "未找到主页私信按钮",
        debug: obj
      };
    }
    local("点击主页私信按钮", {
      btnText: clipTraceText(result4.innerText || result4.textContent || "", 20)
    });
    await simulateHumanClick(result4, text2);
    await sleep(2500);
    const result5 = fn();
    if (result5) {
      local("私信受限（打开窗口即检测到）", result5);
      return {
        ok: false,
        blocked: true,
        blockType: result5.type,
        reason: result5.text,
        debug: obj
      };
    }
    let result6 = await waitForDmInput(text2, 24000, result4);
    let flag = false;
    if (!result6) {
      const result = fn();
      if (result) {
        local("私信受限（未找到输入框）", result);
        return {
          ok: false,
          blocked: true,
          blockType: result.type,
          reason: result.text,
          debug: obj
        };
      }
      local("主页私信未打开输入框，尝试经陌生人消息进入会话");
      result6 = await fn15(result2, text2, local);
      flag = !!result6;
      if (!result6) {
        return {
          ok: false,
          reason: "私信窗口或输入框未打开",
          debug: obj
        };
      }
    }
    local("私信输入框就绪", {
      ...fn3(result6),
      viaStranger: flag
    });
    const result7 = fn18();
    const result8 = result7.some(isRealSelfOutboundChatMessage);
    if (result8) {
      const result = [...result7].reverse().find(isRealSelfOutboundChatMessage);
      local("会话中已有我方私信，跳过主动私信", {
        msgCount: result7.length,
        preview: clipTraceText(result?.text || "", 40)
      });
      return {
        ok: true,
        skipped: true,
        reason: "会话中已有我方私信，跳过主动私信",
        debug: obj
      };
    }
    let result9 = await fn19(result6, result, text2, local, obj);
    if (!result9.ok && !result9.blocked && !flag && /输入框仍有内容|未找到发送|录入后输入框仍为空|私信内容输入失败/.test(String(result9.reason || ""))) {
      local("主页私信发送失败，改走陌生人消息入口重试", {
        reason: result9.reason || ""
      });
      const result3 = await fn15(result2, text2, local, {
        forceFolder: true
      });
      if (result3) {
        flag = true;
        const result2 = fn18();
        if (result2.some(isRealSelfOutboundChatMessage)) {
          local("陌生人会话中已有我方私信，跳过主动私信");
          return {
            ok: true,
            skipped: true,
            reason: "会话中已有我方私信，跳过主动私信",
            debug: obj,
            viaStranger: true
          };
        }
        result9 = await fn19(result3, result, text2, local, obj);
      }
    }
    return {
      ...result9,
      sentText: result,
      viaStranger: flag
    };
  }
  function fn16(arg1, options = {}) {
    const local = arg1 => String(arg1 || "").replace(/\s+/g, " ").trim();
    const result = local(arg1 || "").replace(/^@+/, "").toLowerCase();
    const result2 = normalizeDouyinChatPreview(options.lastMessage || options.text || "");
    if (isDouyinStrangerMessagesFolderName(result)) {
      return null;
    }
    if (isGenericDouyinChatNickname(result) && !result2) {
      return null;
    }
    const result3 = getDmV2String("conversationItem");
    const result4 = getDmV2String("conversationTitle");
    const result5 = getDmV2String("conversationPreview");
    const result6 = getDmV2String("conversationUnread");
    const result7 = getDmV2String("conversationAvatar");
    const result8 = getDmV2String("conversationAvatarRoot");
    if (!result3 || !result4 || !result5 || !result6 || !result7 || !result8) {
      return null;
    }
    const result9 = Array.from(document.querySelectorAll(result3)).filter(arg1 => {
      if (!isVisibleElement(arg1)) {
        return false;
      }
      const result = arg1.getBoundingClientRect();
      const result2 = local(arg1.innerText || arg1.textContent || "");
      const result3 = local(result2.split("\n")[0] || "");
      if (isDouyinStrangerMessagesFolderName(result3)) {
        return false;
      }
      return result.width >= 160 && result.height >= 32 && result.width <= 720 && result.height <= 180 && !!result2;
    }).map(arg12 => {
      const result = arg12.querySelector(result4);
      const result3 = arg12.querySelector(result5);
      const flag = !!arg12.querySelector(result6);
      const result7 = scoreDouyinChatRowMatch({
        title: local(result?.innerText || result?.textContent || ""),
        lastMessage: local(result3?.innerText || result3?.textContent || ""),
        rowText: local(arg12.innerText || arg12.textContent || ""),
        hasUnread: flag
      }, {
        nickname: arg1,
        lastMessage: result2
      });
      return {
        row: arg12,
        titleEl: result,
        score: result7
      };
    }).filter(arg1 => arg1.score > 0).sort((arg1, arg2) => arg2.score - arg1.score);
    for (const item of result9) {
      const result = item.row.querySelector(result7);
      const local = result?.closest(result8) || result;
      const local2 = item.titleEl || item.row;
      if (local2 && isVisibleElement(local2)) {
        return {
          row: item.row,
          clickTarget: local2,
          titleEl: item.titleEl,
          avatar: local
        };
      }
    }
    return null;
  }
  function fn20(arg1) {
    if (!arg1?.getBoundingClientRect) {
      return {
        exists: false
      };
    }
    const result = arg1.getBoundingClientRect();
    return {
      exists: true,
      tag: arg1.tagName || "",
      className: clipTraceText(getElementClassText(arg1), 80),
      text: clipTraceText(arg1.innerText || arg1.textContent || "", 20),
      rect: Math.round(result.width) + "x" + Math.round(result.height) + "@" + Math.round(result.left) + "," + Math.round(result.top)
    };
  }
  async function fn21(arg1, arg2, arg3, text = "首次") {
    const result = await fn13(arg2, arg1);
    if (result) {
      arg3(text + "定位私信发送按钮", fn20(result));
      const value = typeof simulateTrustedElementClick === "function" ? await simulateTrustedElementClick(result, arg2, "私信发送按钮", {
        allowScrollIntoView: false,
        allowOffsetSamples: true,
        requireTargetHit: true,
        waitForStableTarget: true
      }) : false;
      arg3(text + "私信发送点击结果", {
        dispatched: value,
        nativeClick: String(state.lastTrustedClickDiagnostic || "")
      });
      if (value) {
        return {
          dispatched: true,
          via: "button",
          sendBtn: result
        };
      }
    } else {
      arg3(text + "未找到私信发送按钮");
    }
    const value = typeof simulateTrustedEnter === "function" ? await simulateTrustedEnter(arg1, arg2, "私信输入框") : false;
    arg3(text + "可信 Enter 发送结果", {
      dispatched: value
    });
    return {
      dispatched: value,
      via: "enter",
      sendBtn: result || null
    };
  }
  async function fn19(arg1, arg2, arg3, arg4, arg5) {
    await simulateHumanClick(arg1, arg3);
    await randomDelay(800, 1500, arg3, "激活稳定");
    const result = await insertTextIntoEditable(arg1, arg2, arg3);
    if (!result) {
      return {
        ok: false,
        reason: "私信内容输入失败",
        debug: arg5
      };
    }
    const result2 = fn3(arg1);
    arg4("内容录入完成", result2);
    if (!result2.valuePreview) {
      return {
        ok: false,
        reason: "录入后输入框仍为空，疑似未写入成功",
        debug: arg5
      };
    }
    await randomDelay(1000, 2000, arg3, "发送前确认");
    await fn21(arg1, arg3, arg4, "首次");
    await sleep(2000);
    let result3 = fn3(arg1);
    let result4 = getDouyinDmSendResult(arg2, {
      msgInput: arg1
    });
    if (result4.status === "pending" && !result4.inputCleared && !shouldAbort(arg3)) {
      arg4("首次发送未生效，输入框仍有内容，等待控件稳定后重试一次", {
        inputAfter: result3.valuePreview || ""
      });
      await randomDelay(800, 1500, arg3, "私信发送重试等待");
      await fn21(arg1, arg3, arg4, "重试");
      await sleep(2000);
      result3 = fn3(arg1);
      result4 = getDouyinDmSendResult(arg2, {
        msgInput: arg1
      });
    }
    let value = result4.status === "sent" ? 1 : 0;
    for (let num = 0; num < 10; num += 1) {
      if (result4.status === "blocked" || result4.status === "failed") {
        break;
      }
      if (result4.status === "sent" && value >= 2) {
        break;
      }
      if (!result4.inputCleared && num >= 3) {
        break;
      }
      await sleep(600);
      if (shouldAbort(arg3)) {
        break;
      }
      result3 = fn3(arg1);
      result4 = getDouyinDmSendResult(arg2, {
        msgInput: arg1
      });
      value = result4.status === "sent" ? value + 1 : 0;
    }
    arg4("发送后校验", {
      inputAfter: result3.valuePreview || "",
      inputCleared: result4.inputCleared,
      resultStatus: result4.status,
      failureToast: result4.platformHint?.raw || "",
      failureMarker: result4.failureMarker?.className || result4.failureMarker?.ariaLabel || "",
      blockType: result4.blockType || "",
      errorCode: result4.errorCode || "",
      verified: result4.verified,
      verifyDetail: result4.snippet || result4.verifyDetail || "",
      currentUrl: window.location.href
    });
    if (result4.status === "blocked" || result4.status === "failed") {
      return {
        ok: false,
        blocked: !!result4.blocked,
        blockType: result4.blockType || "",
        errorCode: result4.errorCode || "",
        reason: result4.reason || "私信未发送成功",
        diagnostic: result4,
        debug: arg5
      };
    }
    if (result4.status !== "sent") {
      const flag = !!(result3.valuePreview || "").trim();
      if (flag) {
        return {
          ok: false,
          reason: "输入框仍有内容，疑似未发送成功",
          debug: arg5
        };
      }
      arg4("输入框已清空，按已发送弱确认", {
        msgPreview: clipTraceText(arg2, 40)
      });
      return {
        ok: true,
        softVerified: true,
        consumeRound: true,
        reason: "",
        sentText: arg2,
        debug: {
          ...arg5,
          softVerified: true
        }
      };
    }
    arg4("会话记录已确认消息", {
      snippet: result4.snippet
    });
    return {
      ok: true,
      reason: "",
      errorCode: "",
      diagnostic: result4,
      debug: {
        ...arg5,
        snippet: result4.snippet
      }
    };
  }
  function fn18() {
    const result = getDmV2String("dmHistoryMessageItems");
    const result2 = getDmV2String("dmMessageContainer");
    if (!result || !result2) {
      return [];
    }
    const result3 = Array.from(document.querySelectorAll(result)).map(arg1 => {
      const result = String(arg1.innerText || arg1.textContent || "").trim();
      if (!result || result.length > 500) {
        return null;
      }
      const local = arg1.outerHTML || "";
      const result3 = String(arg1.className || "");
      const result4 = arg1.getBoundingClientRect();
      const local2 = arg1.closest(result2) || document.querySelector(result2);
      const value = local2 && local2.getBoundingClientRect ? local2.getBoundingClientRect() : null;
      const local3 = classLooksLikeSelfChatBubble(result3, local) || isChatBubbleAlignedSelf(result4, value);
      return {
        isSelf: local3,
        text: result,
        top: result4.top,
        system: isDouyinChatSystemHint(result)
      };
    }).filter(Boolean);
    const list = [];
    for (let num = 0; num < result3.length; num++) {
      const value = result3[num];
      let flag = false;
      for (let value2 = num + 1; value2 < Math.min(num + 5, result3.length); value2++) {
        if (result3[value2].text.includes(value.text) && result3[value2].isSelf === value.isSelf) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        list.push(value);
      }
    }
    return list.sort((arg1, arg2) => arg1.top - arg2.top);
  }
  function fn22() {
    return fn18().slice(-10).map(arg1 => (arg1.isSelf ? "我: " : "对方: ") + arg1.text).join("\n");
  }
  async function replyDmInConversation(arg1, text2 = "SELF_WARMUP", options = {}) {
    const result = String(arg1 || "").trim();
    const result2 = String(options.nickname || "").trim();
    const result3 = normalizeDouyinChatPreview(options.text || options.lastMessage || "");
    const local = options.config || state.currentTask || {};
    const local2 = options.accountId || window._radar_account_id;
    const local3 = options.account || {
      nickname: window._radar_account_name
    };
    const obj = {
      nickname: result2,
      steps: []
    };
    const local4 = (arg1, options = {}) => {
      obj.steps.push({
        step: arg1,
        ...options,
        at: Date.now()
      });
      logSelfWarmupDm(arg1, {
        nickname: result2,
        ...options
      });
    };
    if (!result) {
      return {
        ok: false,
        reason: "无私信文案",
        debug: obj
      };
    }
    if (typeof hasDmRuntimeReady !== "function" || !hasDmRuntimeReady()) {
      return {
        ok: false,
        reason: "私信运行配置未就绪，本次不执行",
        errorCode: "dm_runtime_config_missing",
        debug: obj
      };
    }
    if (isDouyinStrangerMessagesFolderName(result2)) {
      local4("目标是陌生人消息文件夹，跳过回复");
      return {
        ok: true,
        skipped: true,
        reason: "陌生人消息是文件夹不是会话",
        debug: obj
      };
    }
    local4("开始回复私信", {
      msgPreview: clipTraceText(result, 40)
    });
    state.stopRequested = false;
    let result4 = fn16(result2, {
      lastMessage: result3
    });
    if (!result4) {
      local4("列表未直接命中会话，尝试进入陌生人消息", {
        genericNick: isGenericDouyinChatNickname(result2),
        preview: result3.slice(0, 20)
      });
      const result = fn14();
      if (result) {
        await simulateHumanClick(result, text2);
        await sleep(1800);
        result4 = fn16(result2, {
          lastMessage: result3
        });
        if (!result4) {
          await sleep(1200);
          result4 = fn16(result2, {
            lastMessage: result3
          });
        }
      }
    }
    if (!result4) {
      return {
        ok: false,
        reason: "未找到私信会话列表项",
        debug: obj
      };
    }
    const local5 = options.excludeGroupChats !== false && local.excludeGroupChats !== false;
    if (local5) {
      const result = String(result4.row?.innerText || result4.row?.textContent || "").replace(/\s+/g, " ").trim();
      const result2 = String(result4.titleEl?.innerText || result4.titleEl?.textContent || "").replace(/\s+/g, " ").trim().slice(0, 48);
      const local = looksLikeDouyinGroupChatName(result2).isGroup || looksLikeDouyinGroupChatName(result.slice(0, 48)).isGroup;
      const result3 = getDmV2String("groupRowHints");
      const result5 = getDmV2String("groupAvatarImages");
      let flag = false;
      try {
        flag = !!result3 && !!result4.row?.querySelector?.(result3);
      } catch (error) {
        flag = false;
      }
      const value = result4.row && result5 ? Array.from(result4.row.querySelectorAll(result5)).filter(arg1 => {
        if (!isVisibleElement(arg1)) {
          return false;
        }
        const result = arg1.getBoundingClientRect();
        return result.width >= 10 && result.width <= 72 && result.height >= 10 && result.height <= 72;
      }).length : 0;
      if (local || flag || value >= 3) {
        const value = flag ? "row_dom" : local ? "row_title" : "row_avatars";
        local4("会话列表判定为群聊，已按排除群聊跳过", {
          groupReason: value,
          titleText: result2.slice(0, 40)
        });
        return {
          ok: true,
          skipped: true,
          reason: "已开启“排除群聊”",
          excludedGroup: true,
          groupReason: value,
          debug: obj
        };
      }
      if (/群聊|邀请入群|群成员/.test(result.slice(0, 80)) && /群/.test(result2)) {
        local4("会话列表文案含群标志，已按排除群聊跳过", {
          titleText: result2.slice(0, 40)
        });
        return {
          ok: true,
          skipped: true,
          reason: "已开启“排除群聊”",
          excludedGroup: true,
          groupReason: "row_text",
          debug: obj
        };
      }
    }
    local4("点击会话头像/昵称", {
      tag: result4.clickTarget.tagName,
      hasAvatar: !!result4.avatar
    });
    await simulateHumanClick(result4.clickTarget, text2);
    await sleep(2000);
    if (local5) {
      const result = getDmV2String("conversationHeader");
      const value = result ? document.querySelector(result) : null;
      const result3 = String(value?.innerText || value?.textContent || "").replace(/\s+/g, " ").trim().slice(0, 64);
      const result4 = result2.replace(/^@+/, "").toLowerCase();
      const result5 = result3.toLowerCase();
      const local = !result4 || result5.includes(result4) || result4.includes(result5.slice(0, Math.min(result4.length, result5.length)));
      const result6 = looksLikeOpenDouyinGroupChatHeader(result3, result2);
      if (result6.isGroup || local && looksLikeDouyinGroupChatName(result3).isGroup) {
        const local = result6.reason || "open_name";
        local4("打开会话后判定为群聊，已按排除群聊跳过", {
          groupReason: local,
          headerText: result3
        });
        return {
          ok: true,
          skipped: true,
          reason: "已开启“排除群聊”",
          excludedGroup: true,
          groupReason: local,
          debug: obj
        };
      }
    }
    let result5 = await waitForDmInput(text2, 20000, result4.clickTarget);
    if (!result5) {
      local4("输入框未出现，重试点击会话行");
      await simulateHumanClick(result4.row, text2);
      await sleep(1500);
      result5 = await waitForDmInput(text2, 16000, result4.clickTarget);
    }
    if (!result5) {
      local4("会话点击后仍无输入框，经陌生人消息重试进入");
      result5 = await fn15(result2, text2, local4);
    }
    if (!result5) {
      return {
        ok: false,
        reason: "未找到私信输入框",
        debug: obj
      };
    }
    local4("私信输入框就绪", fn3(result5));
    const result6 = fn18();
    const value = result6.length ? result6[result6.length - 1] : null;
    if (!value || value.system) {
      local4("未能识别对方私信，跳过回复（避免对系统提示/空会话主动连发）", {
        msgCount: result6.length,
        lastPreview: clipTraceText(value?.text || "", 40)
      });
      return {
        ok: true,
        skipped: true,
        reason: "未能确认对方有新私信，跳过回复",
        debug: obj
      };
    }
    if (value.isSelf) {
      local4("最后一条消息为自己发送，跳过回复", {
        preview: clipTraceText(value.text, 40)
      });
      return {
        ok: true,
        skipped: true,
        reason: "最后一条消息为自己发送，无需回复",
        debug: obj
      };
    }
    local4("确认最后一条为对方消息，继续回复", {
      preview: clipTraceText(value.text, 40)
    });
    let local6 = result;
    const local7 = local.accountPersonas?.[local2];
    const local8 = resolveSelfWarmupContentMode(local, true) === "ai" && !!local7 && local7 !== "none";
    if (local8) {
      local4("正在提取最近私信历史对话...");
      const result3 = fn22();
      if (result3) {
        local4("提取成功，正在重新向大模型请求最佳回复...", {
          historySnippet: clipTraceText(result3, 80)
        });
        try {
          const result4 = await ipcRenderer.invoke("ai-generate-fresh-dm-reply", {
            config: local,
            accountId: local2,
            account: local3,
            nickname: result2,
            text: result,
            chatHistory: result3,
            forDm: true
          });
          if (result4) {
            local6 = result4;
            local4("根据上下文重新生成私信成功", {
              freshMsg: clipTraceText(local6, 40)
            });
          }
        } catch (error) {
          local4("根据上下文重新生成私信失败，使用预设私信", {
            error: error?.message || String(error)
          });
        }
      } else {
        local4("未提取到完整对话历史，使用预设私信回复对方最新消息");
      }
    }
    const result7 = await fn19(result5, local6, text2, local4, obj);
    return {
      ...result7,
      sentText: local6
    };
  }
  return {
    getDouyinDmSendResult: getDouyinDmSendResult,
    logSelfWarmupDm: logSelfWarmupDm,
    replyDmInConversation: replyDmInConversation,
    sendDmOnCurrentProfile: sendDmOnCurrentProfile
  };
}
module.exports = {
  createDouyinDirectMessageController: createDouyinDirectMessageController
};
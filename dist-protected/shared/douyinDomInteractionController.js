'use strict';

const {
  sanitizeInlinePageScript
} = require("./sanitizeInlinePageScript");
function createDouyinDomInteractionController(options = {}) {
  const {
    PLATFORM_SELECTORS: platformSelectors,
    briefEl: briefEl,
    describeDomControl: describeDomControl,
    buildImageAttachScope: buildImageAttachScope,
    clipTraceText: clipTraceText,
    collectCommentImageTriggerCandidates: collectCommentImageTriggerCandidates,
    elementsNearlyOverlap: elementsNearlyOverlap,
    findCommentScrollContainer: findCommentScrollContainer,
    findEmojiTriggerBtn: findEmojiTriggerBtn,
    findProfileFollowButtonByText: findProfileFollowButtonByText,
    findProfileMessageButtonByText: findProfileMessageButtonByText,
    getCommentComposerRoot: getCommentComposerRoot,
    getCommentV2String: getCommentV2String,
    getDmV2String: getDmV2String,
    getGatedString: getGatedString,
    getGatedTextPack: getGatedTextPack,
    getGatedVariantList: getGatedVariantList,
    getDouyinFeedScope: getDouyinFeedScope,
    getExtendedReadyBudgetMs: getExtendedReadyBudgetMs,
    hasDmRuntimeReady: hasDmRuntimeReady,
    hasProfileActionRuntimeReady: hasProfileActionRuntimeReady,
    ipcRenderer: ipcRenderer,
    isEmojiTriggerCandidate: isEmojiTriggerCandidate,
    isFeedStyleSource: isFeedStyleSource,
    randomDelay: randomDelay,
    reportEmojiDebug: reportEmojiDebug,
    reportTraceLog: reportTraceLog,
    resolveCommentPanelRoot: resolveCommentPanelRoot,
    shouldAbort: shouldAbort,
    sleep: sleep,
    sleepWithinDeadline: sleepWithinDeadline,
    state: state
  } = options;
  function fn(arg1) {
    return !!arg1 && typeof arg1.getBoundingClientRect === "function";
  }
  function isVisibleElement(arg1) {
    if (!fn(arg1)) {
      return false;
    }
    try {
      const result = arg1.getBoundingClientRect();
      return result.width > 0 && result.height > 0;
    } catch (error) {
      return false;
    }
  }
  function isElementInViewport(arg1, num = 2) {
    if (!fn(arg1)) {
      return false;
    }
    try {
      const result = arg1.getBoundingClientRect();
      const result2 = Math.max(window.innerHeight || 800, 600);
      const result3 = Math.max(window.innerWidth || 1200, 800);
      return result.bottom > -50 && result.right > -50 && result.top < result2 + 160 && result.left < result3 + 100;
    } catch (error) {
      return false;
    }
  }
  function isElementInViewportForAutomation(arg1, num = 2) {
    if (!arg1 || !isVisibleElement(arg1)) {
      return false;
    }
    if (window.innerHeight < 240 || window.innerWidth < 240) {
      return true;
    }
    return isElementInViewport(arg1, num);
  }
  function findSmartElement(arg1, text = "douyin.com") {
    if (["profileFollowBtn", "profileMessageBtn"].includes(arg1) && (typeof hasProfileActionRuntimeReady !== "function" || !hasProfileActionRuntimeReady())) {
      console.warn("[Built-in-Debug] [RuntimeConfig] 主页动作控件包未就绪，拒绝定位 " + arg1);
      return null;
    }
    if (["dmInput", "dmSendBtn"].includes(arg1) && (typeof hasDmRuntimeReady !== "function" || !hasDmRuntimeReady())) {
      console.warn("[Built-in-Debug] [RuntimeConfig] 私信控件包未就绪，拒绝定位 " + arg1);
      return null;
    }
    if (arg1 === "profileFollowBtn") {
      const result = findProfileFollowButtonByText(true);
      if (result) {
        return result;
      }
    }
    if (arg1 === "profileMessageBtn") {
      const result = findProfileMessageButtonByText(true);
      if (result) {
        return result;
      }
    }
    const set = new Set(["profileFollowBtn", "profileMessageBtn", "dmInput", "dmSendBtn"]);
    const value = set.has(arg1) ? typeof getDmV2String === "function" && getDmV2String(arg1) || "" : platformSelectors[text]?.[arg1] || "";
    const result = value.split(", ");
    for (const item of result) {
      if (!item || item.includes(":contains") || item.includes(":has-text")) {
        continue;
      }
      try {
        const result = Array.from(document.querySelectorAll(item));
        if (result.length > 0) {
          console.log("[Built-in-Debug] [选择器检测] " + arg1 + " -> \"" + item + "\" 发现 " + result.length + " 个候选元素");
          result.forEach((arg1, arg2) => {
            const result = arg1.getBoundingClientRect();
            console.log("  [候选 " + arg2 + "] Tag: " + arg1.tagName + ", Class: " + arg1.className + ", Text: \"" + (arg1.innerText || "").substring(0, 20) + "\", Visible: " + isVisibleElement(arg1) + ", Rect: " + Math.round(result.width) + "x" + Math.round(result.height) + " @ (" + Math.round(result.left) + ", " + Math.round(result.top) + ")");
          });
          const result2 = result.find(arg1 => isVisibleElement(arg1));
          if (result2) {
            console.log("[Built-in-Debug] [选择器命中] 已选择可见候选元素: " + result2.tagName);
            return result2;
          }
        }
      } catch (error) {}
    }
    const result2 = arg1.toLowerCase();
    if (result2 === "dminput") {
      return null;
    }
    let list = [];
    if (result2.includes("send")) {
      const value = typeof getGatedTextPack === "function" ? getGatedTextPack("dmSend") : null;
      list = value?.exactTexts || [];
    } else if (result2.includes("follow")) {
      list = typeof getGatedVariantList === "function" && getGatedVariantList("followVariants") || [];
    } else if (result2.includes("message") || result2.includes("dm")) {
      const value = typeof getGatedTextPack === "function" ? getGatedTextPack("profileMessage") : null;
      const local = typeof getGatedVariantList === "function" && getGatedVariantList("messageVariants") || [];
      list = local.length ? local : value?.exactTexts || [];
    }
    if (list.length > 0) {
      console.log("[Built-in-Debug] [文本查找] 正在为 " + arg1 + " 匹配文本变体: " + list.join(", "));
      const value = typeof getGatedString === "function" ? getGatedString("actionButtonCandidates") : "";
      if (!value) {
        console.warn("[Built-in-Debug] [RuntimeConfig] actionButtonCandidates 未下发，拒绝扫描 " + arg1);
        return null;
      }
      let list2 = [];
      try {
        list2 = Array.from(document.querySelectorAll(value));
      } catch (error) {
        return null;
      }
      const list3 = [];
      for (const item of list2) {
        const result = (item.innerText || item.textContent || "").trim();
        if (list.some(arg1 => result === arg1 || result.length < 10 && result.includes(arg1))) {
          list3.push({
            el: item,
            text: result
          });
        }
      }
      if (list3.length > 0) {
        console.log("[Built-in-Debug] [文本匹配] 发现 " + list3.length + " 个文本匹配候选");
        list3.forEach((arg1, arg2) => {
          const result = arg1.el.getBoundingClientRect();
          console.log("  [文本候选 " + arg2 + "] Text: \"" + arg1.text + "\", Tag: " + arg1.el.tagName + ", Visible: " + isVisibleElement(arg1.el) + ", Rect: " + Math.round(result.width) + "x" + Math.round(result.height));
        });
        const result = list3.find(arg1 => isVisibleElement(arg1.el));
        if (result) {
          const value = result.el;
          const value2 = typeof getGatedString === "function" ? getGatedString("actionClickableRoot") : "";
          const value3 = value2 ? value.closest(value2) : null;
          if (value3 && isVisibleElement(value3)) {
            console.log("[Built-in-Debug] [优化点击目标] 自动切换至按钮容器: " + value3.className);
            return value3;
          }
          return value;
        }
      }
    }
    console.warn("[Built-in-Debug] [查找失败] 无法定位元素: " + arg1);
    return null;
  }
  async function waitForDmInput(arg1, num = 24000, arg3 = null) {
    const local = num;
    let local2 = local;
    let flag = false;
    let flag2 = false;
    const num2 = 500;
    let result = Math.ceil(local2 / num2);
    for (let num = 0; num < result; num++) {
      if (shouldAbort(arg1)) {
        return null;
      }
      const result2 = findSmartElement("dmInput");
      if (result2 && isVisibleElement(result2)) {
        console.log("[Built-in-Debug] [私信输入] 远端控件命中，聊天窗口已就绪 (第 " + (num + 1) + " 次尝试成功)");
        return result2;
      }
      try {
        const result = String(window.location.href || "");
        const value = typeof getDmV2String === "function" ? getDmV2String("dmInputHint") : "";
        if (/\/chat|im\.|message|消息/.test(result) || value && document.querySelector(value)) {
          flag2 = true;
        }
      } catch (error) {}
      if ((num === 8 || num === 16 || flag && (num === 24 || num === 32)) && arg3) {
        console.log("[Built-in-Debug] [私信输入] 加载较慢，重试点击私信按钮");
        try {
          await simulateHumanClick(arg3, arg1);
        } catch (error) {}
      }
      if (!flag && flag2 && num + 1 >= Math.ceil(local / num2) - 1) {
        local2 = getExtendedReadyBudgetMs(local, {
          progress: true,
          hardCapMs: Math.min(Math.round(local * 1.75), 42000)
        });
        if (local2 > local) {
          flag = true;
          result = Math.ceil(local2 / num2);
          console.log("[Built-in-Debug] [慢环境] 私信窗口已出现但输入框未就绪，延长等待 " + local + "→" + local2 + "ms");
        }
      }
      await sleep(num2);
    }
    return null;
  }
  function fn8(arg1) {
    if (!arg1 || arg1 === document.body || arg1 === document.documentElement) {
      return false;
    }
    try {
      const local = arg1.getAttribute?.("data-e2e") || "";
      if (/^feed-(active-video|active-live|item|live)$/i.test(local) || local === "browse-live" || local === "webcast-player") {
        return true;
      }
    } catch (error) {}
    const value = (arg1.className || "") + " " + (arg1.getAttribute?.("data-e2e") || "") + " " + (arg1.id || "");
    if (/swiper|Swiper|slide-list|SlideList|feed-scroll|FeedScroll|video-switch|player-container|xgplayer|slider-group|recommend-list|RecommendList|water.?fall/i.test(value)) {
      return true;
    }
    try {
      const result = arg1.getBoundingClientRect();
      const local = arg1.scrollHeight || 0;
      const local2 = arg1.clientHeight || 0;
      if (local2 > window.innerHeight * 0.72 && local > local2 + 120 && result.width > window.innerWidth * 0.42) {
        const flag = !!arg1.querySelector?.("[data-e2e=\"comment-list\"], .comment-mainContent, [class*=\"CommentList\"]");
        if (!flag) {
          return true;
        }
      }
    } catch (error) {}
    return false;
  }
  function fn9(arg1) {
    let local = arg1;
    for (let num = 0; num < 14 && local; num += 1) {
      if (fn8(local)) {
        return true;
      }
      local = local.parentElement;
    }
    return false;
  }
  function fn10() {
    try {
      if (typeof isFeedStyleSource === "function" && isFeedStyleSource(state.currentRunningSource)) {
        return true;
      }
      if (typeof getDouyinFeedScope === "function" && getDouyinFeedScope()) {
        return true;
      }
      const result = String(window.location.href || "");
      if (/douyin\.com\/follow/.test(result)) {
        return true;
      }
      if (/douyin\.com\/?\?/.test(result) && /recommend=1/.test(result)) {
        return true;
      }
      if (document.querySelector?.("[data-e2e=\"feed-active-video\"], [data-e2e=\"feed-active-live\"]")) {
        return true;
      }
    } catch (error) {}
    return false;
  }
  function fn11(arg1, arg2) {
    if (!arg1?.closest || typeof getCommentV2String !== "function") {
      return null;
    }
    const result = getCommentV2String(arg2);
    if (!result) {
      return null;
    }
    try {
      return arg1.closest(result);
    } catch (error) {
      return null;
    }
  }
  function fn12(arg1) {
    return !!fn11(arg1, "commentFloatingChrome");
  }
  function fn13(arg1) {
    return !!fn11(arg1, "commentFloatingChrome") || !!fn11(arg1, "commentComposerChrome") || !!fn11(arg1, "commentPanel") || !!fn11(arg1, "commentInputShell") || !!fn11(arg1, "commentInputShellLoose");
  }
  function focusWithoutScroll(arg1) {
    if (!arg1) {
      return;
    }
    try {
      arg1.focus?.({
        preventScroll: true
      });
    } catch (error) {
      try {
        arg1.focus?.();
      } catch (error) {}
    }
  }
  function safeScrollTargetIntoView(arg1, {
    force = false,
    block = "nearest"
  } = {}) {
    if (!arg1) {
      return false;
    }
    try {
      const result = arg1.getBoundingClientRect();
      if (!(result.width > 0) || !(result.height > 0)) {
        return false;
      }
      const local = result.top >= -24 && result.bottom <= window.innerHeight + 24 && result.left >= -24 && result.right <= window.innerWidth + 24;
      if (!force && local) {
        return false;
      }
      const result2 = fn10();
      if (fn13(arg1) || fn9(arg1) || result2) {
        try {
          const value = typeof resolveCommentPanelRoot === "function" ? resolveCommentPanelRoot(document.body) : null;
          if (value && value.contains(arg1)) {
            const value2 = typeof findCommentScrollContainer === "function" ? findCommentScrollContainer(document) : null;
            const value3 = value2 && value2.contains(arg1) ? value2 : value;
            const result = arg1.getBoundingClientRect();
            const result2 = value3.getBoundingClientRect();
            if (result.bottom > result2.bottom - 10) {
              value3.scrollTop += result.bottom - result2.bottom + 28;
              return true;
            }
            if (result.top < result2.top + 10) {
              value3.scrollTop -= result2.top - result.top + 28;
              return true;
            }
          }
        } catch (error) {}
        console.log("[Built-in-Debug] [自动滚动] 跳过 Feed/评论框 scrollIntoView，防止 macOS 半截吸附");
        return false;
      }
      arg1.scrollIntoView({
        block: block,
        inline: "nearest",
        behavior: "instant"
      });
      return true;
    } catch (error) {
      return false;
    }
  }
  function fn16(arg1) {
    if (!arg1?.tagName) {
      return arg1;
    }
    const list = ["svg", "path", "g", "rect", "circle", "use"];
    if (!list.includes(arg1.tagName.toLowerCase())) {
      return arg1;
    }
    const value = typeof getDmV2String === "function" ? getDmV2String("dmExplicitSendSvg") : "";
    const value2 = value ? arg1.closest?.(value) : null;
    if (value2) {
      return value2;
    }
    const value3 = typeof getGatedString === "function" ? getGatedString("actionClickableRoot") : "";
    return value3 && arg1.closest(value3) || arg1;
  }
  async function simulateHumanClick(arg1, arg2, options = {}) {
    if (!arg1 || shouldAbort(arg2)) {
      return;
    }
    const result = Number(options.deadlineAt || 0);
    if (result > 0 && Date.now() >= result) {
      return;
    }
    await sleepWithinDeadline(200 + Math.random() * 400, result);
    if (result > 0 && Date.now() >= result) {
      return;
    }
    const result2 = fn16(arg1);
    try {
      const result3 = result2.getBoundingClientRect();
      const result4 = fn12(result2);
      if (!result4 && (result3.top < 0 || result3.bottom > window.innerHeight)) {
        console.log("[Built-in-Debug] [自动滚动] 目标不在视口内，正在安全对齐...");
        if (safeScrollTargetIntoView(result2, {
          block: "nearest"
        })) {
          await sleepWithinDeadline(500, result);
        }
        if (result > 0 && Date.now() >= result) {
          return;
        }
      }
      const result5 = result2.getBoundingClientRect();
      const value = result5.left + result5.width / 2;
      const value2 = result5.top + result5.height / 2;
      const local = result5.width <= 0 || result5.height <= 0 || value < 1 || value2 < 1;
      const local2 = value > window.innerWidth - 1 || value2 > window.innerHeight - 1;
      if (local || !result4 && local2) {
        console.warn("[Built-in-Debug] [点击拦截] 目标未就绪或超出可视区，跳过注入点击: (" + Math.round(value) + ", " + Math.round(value2) + ")");
        if (fn12(result2)) {
          reportEmojiDebug("点击拦截 fallback .click() " + briefEl(result2));
        }
        if (result2.click) {
          result2.click();
        }
        return;
      }
      console.log("[Built-in-Debug] [点击执行] 目标: " + result2.tagName + ", 坐标: (" + Math.round(value) + ", " + Math.round(value2) + ")");
      try {
        const value = "btn-clk-" + Date.now();
        result2.setAttribute("data-automation-id", value);
        const result = document.createElement("script");
        result.textContent = sanitizeInlinePageScript("(function(){\n                try {\n                    var el = document.querySelector('[data-automation-id=\"" + value + "\"]');\n                    if (!el) return;\n                    var rect = el.getBoundingClientRect();\n                    var cx = rect.left + rect.width / 2;\n                    var cy = rect.top + rect.height / 2;\n                    var e = { bubbles: true, cancelable: true, view: window, clientX: cx, clientY: cy, buttons: 1 };\n                    \n                    // 1. 发送 Pointer 事件 (对现代 UI 框架更有效)\n                    el.dispatchEvent(new PointerEvent('pointerdown', e));\n                    el.dispatchEvent(new MouseEvent('mousedown', e));\n                    \n                    setTimeout(function() {\n                        el.dispatchEvent(new PointerEvent('pointerup', e));\n                        el.dispatchEvent(new MouseEvent('mouseup', e));\n                        if (el.click) el.click(); // 3. 只有 HTMLElement 才有 .click()\n                    }, 50);\n                } catch(err) {}\n            })();");
        (document.head || document.documentElement).appendChild(result);
        setTimeout(() => {
          result.remove();
          if (result2 && result2.removeAttribute) {
            result2.removeAttribute("data-automation-id");
          }
        }, 1000);
      } catch (error) {
        console.error("[Built-in-Debug] [穿透点击异常]", error);
        if (result2.click) {
          result2.click();
        }
      }
    } catch (error) {
      console.error("[Built-in-Debug] [点击异常] " + error.message);
      if (arg1.click) {
        arg1.click();
      }
    }
  }
  function fn17(arg1) {
    if (!arg1 || arg1.nodeType !== 1) {
      return false;
    }
    let local = arg1;
    for (let num = 0; num < 10 && local && local !== document.body; num += 1) {
      const value = local.parentElement;
      if (!value) {
        break;
      }
      let text = "";
      try {
        text = String(window.getComputedStyle(value).overflowY || "");
      } catch (error) {
        text = "";
      }
      const local2 = text === "auto" || text === "scroll" || value.getAttribute?.("scrollable") === "true";
      if (local2 && value.scrollHeight > value.clientHeight + 8) {
        try {
          const result = local.getBoundingClientRect();
          const result2 = value.getBoundingClientRect();
          if (result.top < result2.top + 4) {
            value.scrollTop -= result2.top - result.top + 12;
          } else if (result.bottom > result2.bottom - 4) {
            value.scrollTop += result.bottom - result2.bottom + 12;
          }
        } catch (error) {}
        return true;
      }
      local = value;
    }
    return false;
  }
  function fn18(arg1, options = {}) {
    if (!arg1?.getBoundingClientRect) {
      return null;
    }
    const list = [];
    if (options.preferInner) {
      let local = null;
      try {
        local = arg1.querySelector?.(options.preferInner);
      } catch (error) {
        local = null;
      }
      if (local) {
        list.push({
          el: local,
          strict: true
        });
      }
    }
    list.push({
      el: arg1,
      strict: false
    });
    const list2 = [[0.5, 0.5]];
    const list3 = [[0.5, 0.35], [0.5, 0.65], [0.32, 0.5], [0.68, 0.5], [0.2, 0.5]];
    let local = null;
    for (const {
      el: el,
      strict: strict
    } of list) {
      const result = el.getBoundingClientRect();
      if (result.width <= 0 || result.height <= 0) {
        continue;
      }
      const value = result.left + result.width * 0.5;
      const value2 = result.top + result.height * 0.5;
      if (!local && !strict) {
        local = {
          x: value,
          y: value2,
          aimedInner: false,
          hitTag: el.tagName || "?",
          matched: false
        };
      }
      const value3 = options.allowOffsetSamples ? [...list2, ...list3] : list2;
      for (const [local, local2] of value3) {
        const value = result.left + result.width * local;
        const value2 = result.top + result.height * local2;
        let local3 = null;
        try {
          local3 = document.elementFromPoint(value, value2);
        } catch (error) {
          local3 = null;
        }
        if (!local3) {
          continue;
        }
        const local4 = local3 === el || el.contains(local3) || local3.contains(el);
        if (!local4) {
          continue;
        }
        return {
          x: value,
          y: value2,
          aimedInner: strict,
          hitTag: local3.tagName || "?",
          matched: true
        };
      }
      if (!strict && local) {
        return local;
      }
    }
    return local;
  }
  function fn19(arg1) {
    if (typeof describeDomControl === "function") {
      try {
        return describeDomControl(arg1);
      } catch (error) {}
    }
    if (typeof briefEl === "function") {
      return briefEl(arg1);
    } else {
      return arg1?.tagName || "无";
    }
  }
  function fn20(arg1, arg2) {
    try {
      return document.elementFromPoint(arg1, arg2);
    } catch (error) {
      return null;
    }
  }
  function fn21(arg1, arg2) {
    if (!arg1 || !arg2) {
      return false;
    }
    try {
      return arg1 === arg2 || arg2.contains(arg1) || arg1.contains(arg2);
    } catch (error) {
      return false;
    }
  }
  async function fn22(arg1, options = {}) {
    if (!arg1?.setAttribute) {
      return ipcRenderer.invoke("simulate-native-click", options);
    }
    const value = "rtc_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 10);
    const text = "data-radar-trusted-click-target";
    try {
      arg1.setAttribute(text, value);
      return await ipcRenderer.invoke("simulate-native-click", {
        ...options,
        targetToken: value
      });
    } finally {
      try {
        if (arg1.getAttribute?.(text) === value) {
          arg1.removeAttribute(text);
        }
      } catch (error) {}
    }
  }
  function fn23(arg1, options = {}) {
    if (options.traceToRunLog === false) {
      return false;
    }
    if (options.traceToRunLog) {
      return true;
    }
    return fn24(arg1);
  }
  function fn24(arg1) {
    return /表情|表情包|emoji/i.test(String(arg1 || ""));
  }
  function fn25() {
    try {
      if (window.__radarAutomationViewportResizeTrackerInstalled) {
        return;
      }
      window.__radarAutomationViewportResizeTrackerInstalled = true;
      const local = () => {
        window.__radarAutomationViewportChangedAt = Date.now();
      };
      window.addEventListener("resize", local, {
        passive: true
      });
      window.visualViewport?.addEventListener?.("resize", local, {
        passive: true
      });
    } catch (error) {}
  }
  async function fn26(arg1, num = 0) {
    fn25();
    const num2 = 260;
    const result = Date.now();
    while (!shouldAbort(arg1) && Date.now() - result < 1400) {
      const result = Number(window.__radarAutomationViewportChangedAt || 0);
      if (!result || Date.now() - result >= num2) {
        return true;
      }
      if (num > 0 && Date.now() >= num) {
        return false;
      }
      await sleepWithinDeadline(Math.min(90, num2), num);
    }
    return !shouldAbort(arg1);
  }
  async function fn27(arg1, arg2, num = 0, options = {}) {
    if (!arg1?.getBoundingClientRect) {
      return false;
    }
    const result = Math.max(500, Number(options.targetStableTimeoutMs) || 1800);
    const result2 = Math.max(80, Number(options.targetStableIntervalMs) || 140);
    const result3 = Math.max(2, Number(options.targetStableSamples) || 3);
    const result4 = Math.max(0.5, Number(options.targetStableTolerance) || 1.5);
    const result5 = Date.now();
    let local = null;
    let num2 = 0;
    while (!shouldAbort(arg2) && Date.now() - result5 < result) {
      if (num > 0 && Date.now() >= num) {
        return false;
      }
      if (arg1.isConnected === false) {
        return false;
      }
      let local2 = null;
      try {
        local2 = arg1.getBoundingClientRect();
      } catch (error) {
        local2 = null;
      }
      const value = local2 && local2.width > 1 && local2.height > 1 ? fn18(arg1, {
        ...options,
        allowOffsetSamples: true
      }) : null;
      const value2 = local2 && value?.matched ? {
        left: local2.left,
        top: local2.top,
        width: local2.width,
        height: local2.height
      } : null;
      const local3 = !!value2 && !!local && !!(Math.abs(value2.left - local.left) <= result4) && !!(Math.abs(value2.top - local.top) <= result4) && !!(Math.abs(value2.width - local.width) <= result4) && !!(Math.abs(value2.height - local.height) <= result4);
      num2 = value2 ? local3 ? num2 + 1 : 1 : 0;
      if (num2 >= result3) {
        return true;
      }
      local = value2;
      await sleepWithinDeadline(result2, num);
    }
    return false;
  }
  function fn28(arg1) {
    if (!arg1?.getBoundingClientRect) {
      return false;
    }
    try {
      const result = arg1.getBoundingClientRect();
      return result.width > 1 && result.height > 1;
    } catch (error) {
      return false;
    }
  }
  function fn29(arg1) {
    const result = fn16(arg1);
    if (fn28(result)) {
      return result;
    }
    if (fn28(arg1)) {
      return arg1;
    }
    try {
      const local = arg1?.querySelector?.("img");
      if (fn28(local)) {
        return local;
      }
      const result = Array.from(arg1?.children || []).find(fn28);
      if (result) {
        return result;
      }
    } catch (error) {}
    let local = arg1?.parentElement;
    for (let num = 0; num < 5 && local && local !== document.body; num += 1) {
      if (fn28(local)) {
        const result = local.getBoundingClientRect();
        if (result.width <= 220 && result.height <= 220) {
          return local;
        }
      }
      local = local.parentElement;
    }
    return result || arg1;
  }
  async function simulateTrustedElementClick(arg1, arg2, text = "控件", options = {}) {
    if (!arg1 || shouldAbort(arg2)) {
      return false;
    }
    const result = Number(options.deadlineAt || 0);
    if (result > 0 && Date.now() >= result) {
      return false;
    }
    const result2 = fn24(text);
    const local = result2 || options.requireTargetHit === true;
    if (result2 && !(await fn26(arg2, result))) {
      return false;
    }
    const result3 = fn29(arg1);
    try {
      fn17(result3);
    } catch (error) {}
    try {
      const value = options.allowScrollIntoView !== false;
      const result = fn12(result3);
      if (value && !result) {
        const result = result3.getBoundingClientRect();
        const local = result.top < -8 || result.bottom > window.innerHeight + 8 || result.left < -8 || result.right > window.innerWidth + 8;
        if (local || options.forceScrollIntoView) {
          safeScrollTargetIntoView(result3, {
            force: !!options.forceScrollIntoView,
            block: options.scrollBlock || "nearest"
          });
        }
      }
    } catch (error) {}
    if (options.waitForStableTarget === true) {
      const result2 = await fn27(result3, arg2, result, options);
      if (!result2) {
        state.lastTrustedClickDiagnostic = "fail:" + text + ":target_unstable";
        return false;
      }
    }
    let result4 = fn18(result3, options);
    if (!result4) {
      const result = result3.getBoundingClientRect();
      if (result.width > 0 && result.height > 0) {
        result4 = {
          x: result.left + result.width * 0.5,
          y: result.top + result.height * 0.5,
          aimedInner: false,
          hitTag: result3.tagName || "?",
          matched: false
        };
      }
    }
    if (!result4) {
      console.warn("[Built-in-Debug] [原生激活] " + text + " 控件无尺寸，无法派发");
      if (fn23(text, options)) {
        reportTraceLog("📎 「" + text + "」控件无尺寸，未派发点击" + (" 原=" + fn19(arg1) + " 点目标=" + fn19(result3)) + (" 连接=" + (arg1.isConnected !== false ? "是" : "否")), null, "warning");
      }
      if (!local) {
        await simulateHumanClick(arg1, arg2, {
          deadlineAt: result
        });
      }
      return false;
    }
    let {
      x: x,
      y: y
    } = result4;
    let result5 = fn20(x, y);
    let local2 = fn21(result5, result3) || fn21(result5, arg1);
    if (result2 && !local2 && !options.allowOffsetSamples) {
      const result = fn18(result3, {
        ...options,
        allowOffsetSamples: true
      });
      if (result) {
        const result2 = fn20(result.x, result.y);
        if (fn21(result2, result3) || fn21(result2, arg1)) {
          result4 = result;
          x = result.x;
          y = result.y;
          result5 = result2;
          local2 = true;
        }
      }
    }
    if (!result4.matched && result5 && !local2 && !local) {
      console.warn("[Built-in-Debug] [原生激活] " + text + " 坐标未通过命中校验（可能被遮挡），仍按中心点派发");
    }
    if (fn23(text, options) && !local2) {
      reportTraceLog((result2 ? "📎" : "👤") + " 「" + text + "」当前落点未命中控件，未派发原生点击（等待布局稳定后重试）", null, "warning");
    }
    if (local && !local2) {
      state.lastTrustedClickDiagnostic = "fail:" + text + ":target_not_hit";
      return false;
    }
    try {
      const result2 = await fn22(result3, {
        x: x,
        y: y,
        label: text
      });
      state.lastTrustedClickDiagnostic = result2?.success ? "ok:" + text + ":" + (result2.backgroundHosted ? "bg" : "fg") + ":" + (result2.transport || "?") + ":" + (result2.targetResolved ? "dom" : "legacy") + ":z" + (result2.zoomFactor || "?") : "fail:" + text + ":" + (result2?.reason || "unknown");
      console.log("[Built-in-Debug] [原生激活] " + text + " success=" + !!result2?.success + " " + ("background=" + !!result2?.backgroundHosted + " transport=" + (result2?.transport || "?") + " zoom=" + (result2?.zoomFactor || "?") + " ") + ("target=" + (result2?.targetResolved ? "live-dom-control" : "legacy-point") + " ") + ("reason=" + (result2?.reason || "none") + " ") + ("point=(" + Math.round(x) + "," + Math.round(y) + ") hit=" + result4.hitTag) + ("" + (result4.aimedInner ? ":inner" : "") + (result4.matched ? "" : ":unverified")));
      if (result2?.success) {
        state.lastNativeClickBackgroundHosted = !!result2.backgroundHosted;
        focusWithoutScroll(result3);
        await sleepWithinDeadline(260, result);
        return true;
      }
    } catch (error) {
      state.lastTrustedClickDiagnostic = "error:" + text + ":" + clipTraceText(error?.message || error, 30);
      console.warn("[Built-in-Debug] [原生激活] " + text + " IPC 失败: " + (error.message || error));
    }
    if (!shouldAbort(arg2) && !local) {
      await simulateHumanClick(arg1, arg2, {
        deadlineAt: result
      });
    }
    return false;
  }
  async function simulateTrustedEnter(arg1, arg2, text = "输入框") {
    if (!arg1 || shouldAbort(arg2)) {
      return false;
    }
    focusWithoutScroll(arg1);
    try {
      const result = await ipcRenderer.invoke("simulate-native-enter");
      state.lastTrustedClickDiagnostic = result?.success ? "ok:" + text + ":enter:" + (result.transport || "?") : "fail:" + text + ":enter:" + (result?.reason || "unknown");
      console.log("[Built-in-Debug] [原生回车] " + text + " success=" + !!result?.success + " " + ("transport=" + (result?.transport || "?") + " reason=" + (result?.reason || "none")));
      if (result?.success) {
        await sleep(260);
        return true;
      }
    } catch (error) {
      state.lastTrustedClickDiagnostic = "error:" + text + ":enter:" + clipTraceText(error?.message || error, 30);
      console.warn("[Built-in-Debug] [原生回车] " + text + " IPC 失败: " + (error.message || error));
    }
    return false;
  }
  async function simulateTrustedKey(arg1, arg2, arg3 = arg1) {
    if (shouldAbort(arg2)) {
      return false;
    }
    try {
      const result = await ipcRenderer.invoke("simulate-trusted-key", {
        key: arg1
      });
      state.lastTrustedClickDiagnostic = result?.success ? "ok:" + arg3 + ":key:" + (result.transport || "?") : "fail:" + arg3 + ":key:" + (result?.reason || "unknown");
      console.log("[Built-in-Debug] [原生按键] " + arg3 + " success=" + !!result?.success + " " + ("transport=" + (result?.transport || "?") + " reason=" + (result?.reason || "none")));
      if (result?.success) {
        await sleep(120);
        return true;
      }
    } catch (error) {
      state.lastTrustedClickDiagnostic = "error:" + arg3 + ":key:" + clipTraceText(error?.message || error, 30);
      console.warn("[Built-in-Debug] [原生按键] " + arg3 + " IPC 失败: " + (error.message || error));
    }
    return false;
  }
  async function insertTextIntoEditable(arg1, arg2, arg3 = null) {
    if (!arg1 || !arg2) {
      return false;
    }
    let local = arg1;
    if (arg1.getAttribute("contenteditable") !== "true" && !["INPUT", "TEXTAREA"].includes(arg1.tagName)) {
      local = arg1.querySelector("[contenteditable=\"true\"]") || arg1;
    }
    focusWithoutScroll(local);
    if (local.tagName === "TEXTAREA" || local.tagName === "INPUT") {
      const local2 = local.ownerDocument?.defaultView || window;
      const value = local.tagName === "TEXTAREA" ? Object.getOwnPropertyDescriptor(local2.HTMLTextAreaElement.prototype, "value")?.set : Object.getOwnPropertyDescriptor(local2.HTMLInputElement.prototype, "value")?.set;
      for (const item of arg2) {
        if (shouldAbort(arg3)) {
          return false;
        }
        let value2 = local.value;
        try {
          if (value) {
            value.call(local, value2 + item);
          } else {
            local.value = value2 + item;
          }
        } catch (error) {
          console.warn("[Built-in-Debug] [文本录入] " + local.tagName + " 写入失败: " + error.message);
          return false;
        }
        local.dispatchEvent(new InputEvent("input", {
          bubbles: true,
          data: item,
          inputType: "insertText"
        }));
        await randomDelay(150, 350, arg3);
      }
      local.dispatchEvent(new Event("change", {
        bubbles: true
      }));
      return true;
    }
    const local2 = local.ownerDocument.defaultView || window;
    const result = local2.getSelection();
    if (!result) {
      return false;
    }
    local.dispatchEvent(new CompositionEvent("compositionstart", {
      bubbles: true
    }));
    await randomDelay(200, 400, arg3);
    const result2 = document.createRange();
    result2.selectNodeContents(local);
    result2.collapse(false);
    result.removeAllRanges();
    result.addRange(result2);
    for (const item of arg2) {
      if (shouldAbort(arg3)) {
        return false;
      }
      local.dispatchEvent(new KeyboardEvent("keydown", {
        key: item,
        bubbles: true
      }));
      local.dispatchEvent(new InputEvent("beforeinput", {
        bubbles: true,
        cancelable: true,
        data: item,
        inputType: "insertText"
      }));
      const result3 = document.execCommand("insertText", false, item);
      if (!result3) {
        const result3 = document.createTextNode(item);
        result2.insertNode(result3);
        result2.collapse(false);
        result.removeAllRanges();
        result.addRange(result2);
      }
      local.dispatchEvent(new InputEvent("input", {
        bubbles: true,
        data: item,
        inputType: "insertText"
      }));
      local.dispatchEvent(new KeyboardEvent("keyup", {
        key: item,
        bubbles: true
      }));
      await randomDelay(120, 400, arg3);
    }
    local.dispatchEvent(new CompositionEvent("compositionend", {
      data: arg2,
      bubbles: true
    }));
    local.dispatchEvent(new InputEvent("input", {
      bubbles: true,
      inputType: "insertCompositionText"
    }));
    if (fn10() || fn13(local)) {
      focusWithoutScroll(local);
    } else {
      await simulateHumanClick(local, arg3);
    }
    return true;
  }
  function fn34(arg1) {
    if (!arg1) {
      return [];
    }
    if (Array.isArray(arg1)) {
      return arg1.map(arg1 => String(arg1 || "").trim().replace(/^@+/, "")).filter(Boolean);
    }
    return String(arg1).split(/[,，\n\r]+/).map(arg1 => arg1.trim().replace(/^@+/, "")).filter(Boolean);
  }
  function fn35() {
    if (!state.currentTask?.enableCommentMention) {
      return [];
    }
    return fn34(state.currentTask?.commentMentionNicknames);
  }
  function fn36() {
    if (!state.currentTask?.enableVideoCommentMention) {
      return [];
    }
    return fn34(state.currentTask?.videoCommentMentionNicknames);
  }
  function resolveCommentMentionPosition(flag = false) {
    const value = flag ? state.currentTask?.videoCommentMentionPosition : state.currentTask?.commentMentionPosition;
    if (value === "after") {
      return "after";
    } else {
      return "before";
    }
  }
  function fn38(arg1) {
    const result = Number(arg1);
    if (!Number.isFinite(result)) {
      return 100;
    }
    return Math.max(0, Math.min(100, Math.round(result)));
  }
  function fn39(...restArgs) {
    for (const item of restArgs) {
      if (item == null || item === "") {
        continue;
      }
      const result = Number(item);
      if (Number.isFinite(result)) {
        return fn38(result);
      }
    }
    return 100;
  }
  function resolveActiveMentionPercent(flag = false) {
    if (flag) {
      return fn39(state.currentTask?.videoCommentMentionPercent, state.currentTask?.batchConfig?.videoCommentMentionPercent);
    }
    return fn39(state.currentTask?.commentMentionPercent, state.currentTask?.batchConfig?.commentMentionPercent);
  }
  function rollMentionProbability(flag = false) {
    const value = flag ? fn36() : fn35();
    const value2 = flag ? "视频主评" : "回复/首作评论";
    if (!value.length) {
      state.currentActionMentionRolled = {
        hit: false,
        percent: 0
      };
      return state.currentActionMentionRolled;
    }
    const result = resolveActiveMentionPercent(flag);
    const value3 = Math.floor(Math.random() * 100) + 1;
    const value4 = value3 <= result;
    state.currentActionMentionRolled = {
      hit: value4,
      percent: result,
      roll: value3,
      source: flag ? "videoCommentMentionPercent" : "commentMentionPercent",
      raw: flag ? state.currentTask?.videoCommentMentionPercent : state.currentTask?.commentMentionPercent
    };
    if (value4) {
      reportTraceLog("@ 提及：概率命中（" + value2 + " " + result + "%；随机 " + value3 + "），本次将 @");
    } else {
      reportTraceLog("@ 提及：概率未命中（" + value2 + " " + result + "%；随机 " + value3 + "），本次跳过 @");
    }
    console.log("[评论@提及] " + value2 + " 概率判定:", state.currentActionMentionRolled);
    return state.currentActionMentionRolled;
  }
  function shouldUseCommentMentions(flag = false) {
    const value = flag ? fn36().length > 0 : fn35().length > 0;
    if (!value) {
      return false;
    }
    if (!state.currentActionMentionRolled) {
      rollMentionProbability(flag);
    }
    return !!state.currentActionMentionRolled?.hit;
  }
  function reportMentionDebug(arg1, flag = false) {
    const result = String(arg1 || "").trim();
    if (!result) {
      return;
    }
    console.log("[评论@提及] " + result);
    if (flag) {
      reportTraceLog("@ 探测：" + clipTraceText(result, 120));
    }
  }
  function fn44(arg1, num = 4) {
    function fn(arg1, arg2) {
      if (arg2 > num) {
        return "";
      }
      if (!arg1) {
        return "";
      }
      const local = arg1.tagName || "";
      const local2 = arg1.className || "";
      const local3 = arg1.id || "";
      const value = arg1.childNodes.length === 1 && arg1.childNodes[0].nodeType === 3 ? (arg1.textContent || "").trim().slice(0, 40) : "";
      const value2 = arg1.getBoundingClientRect ? arg1.getBoundingClientRect() : null;
      const value3 = value2 ? " @(" + Math.round(value2.left) + "," + Math.round(value2.top) + ") " + Math.round(value2.width) + "x" + Math.round(value2.height) : "";
      const value4 = arg1.getAttribute ? arg1.getAttribute("data-e2e") : "";
      const value5 = value4 ? " e2e=\"" + value4 + "\"" : "";
      let value6 = "  ".repeat(arg2) + "<" + local + (local3 ? " id=\"" + local3 + "\"" : "") + (local2 ? " class=\"" + local2 + "\"" : "") + value5 + value3 + "> " + value;
      let list = [];
      if (arg1.children) {
        for (let num = 0; num < arg1.children.length; num++) {
          list.push(fn(arg1.children[num], arg2 + 1));
        }
      }
      return [value6, ...list.filter(Boolean)].join("\n");
    }
    try {
      const result = fn(arg1, 0);
      console.log("[评论@提及] DOM Tree Dump:\n" + result);
    } catch (error) {
      console.error("[评论@提及] DOM Tree Dump 失败: " + error.message);
    }
  }
  function fn45(arg1, arg2) {
    if (!arg1) {
      return null;
    }
    const value = "on" + arg2.charAt(0).toUpperCase() + arg2.slice(1);
    const local = arg1 => {
      const result = Object.keys(arg1);
      const result2 = result.find(arg1 => arg1.startsWith("__reactProps") || arg1.startsWith("__reactEventHandlers") || arg1.startsWith("__reactInternalInstance"));
      if (result2 && arg1[result2]) {
        const value2 = arg1[result2];
        if (value2[value] && typeof value2[value] === "function") {
          return {
            handler: value2[value],
            target: arg1
          };
        }
        if (value2[arg2] && typeof value2[arg2] === "function") {
          return {
            handler: value2[arg2],
            target: arg1
          };
        }
      }
      const result3 = result.find(arg1 => arg1.startsWith("__reactFiber") || arg1.startsWith("__reactInternal"));
      if (result3 && arg1[result3]) {
        let value2 = arg1[result3];
        while (value2) {
          if (value2.memoizedProps) {
            const value3 = value2.memoizedProps;
            if (value3[value] && typeof value3[value] === "function") {
              return {
                handler: value3[value],
                target: arg1
              };
            }
          }
          value2 = value2.return;
        }
      }
      return null;
    };
    let local2 = arg1;
    while (local2 && local2 !== document.body) {
      const result = local(local2);
      if (result) {
        return result;
      }
      local2 = local2.parentElement;
    }
    return null;
  }
  function fn46(arg1, arg2, options = {}) {
    const result = fn45(arg1, arg2);
    if (!result) {
      reportMentionDebug("[React-Trigger] 未能在 " + arg1.tagName + " 及其祖先中找到 " + arg2 + " 处理器");
      return false;
    }
    reportMentionDebug("[React-Trigger] 发现 " + arg2 + " 处理器在 " + result.target.tagName + " 上", true);
    try {
      const obj = {
        preventDefault: () => {},
        stopPropagation: () => {},
        target: arg1,
        currentTarget: result.target,
        bubbles: true,
        cancelable: true,
        isTrusted: true,
        type: arg2,
        ...options
      };
      result.handler(obj);
      return true;
    } catch (error) {
      reportMentionDebug("[React-Trigger] 执行 " + arg2 + " 失败: " + error.message, true);
      return false;
    }
  }
  function fn47(arg1) {
    if (!arg1) {
      return "无";
    }
    const result = arg1.getBoundingClientRect();
    const result2 = String(arg1.className || "").split(/\s+/).filter(Boolean).slice(0, 3).join(".");
    const local = arg1.getAttribute("data-e2e") || "";
    return "" + arg1.tagName + (result2 ? "." + result2 : "") + (local ? "[e2e=" + local + "]" : "") + " " + Math.round(result.width) + "x" + Math.round(result.height) + "@(" + Math.round(result.left) + "," + Math.round(result.top) + ")";
  }
  function fn48(arg1) {
    if (!arg1) {
      return false;
    }
    const result = String(arg1.className || "");
    if (/atBox-outside|atBox-inner|atbox-outside|atbox-inner/i.test(result)) {
      return true;
    }
    return !!arg1.querySelector?.("[class*=\"atBox-inner\"], [class*=\"atBox-outside\"]");
  }
  function fn49(arg1) {
    if (!arg1) {
      return true;
    }
    const result = String(arg1.className || "").toLowerCase();
    const result2 = String(arg1.getAttribute("data-e2e") || "").toLowerCase();
    const value = result + " " + result2;
    if (/douyin-navigation|comment-input-inner|comment-input-container|comment-compose|tab-user_|tab-user_self|navigation|sidebar/.test(value)) {
      return true;
    }
    if (arg1.closest?.("[data-e2e=\"douyin-navigation\"]")) {
      return true;
    }
    if (arg1.closest?.("[class*=\"comment-input-inner\"]") && !fn48(arg1)) {
      return true;
    }
    return false;
  }
  function fn50(arg1) {
    try {
      const result = arg1.querySelector("span:not([class*=\"avatar\"]):not([class*=\"Avatar\"]):not(.kkIgSOBm), p, [class*=\"name\"], [class*=\"nick\"]");
      if (result) {
        const result2 = (result.innerText || result.textContent || "").trim();
        if (result2) {
          return result2;
        }
      }
    } catch (error) {}
    const result = (arg1.innerText || arg1.textContent || "").replace(/\s+/g, " ").trim();
    if (!result) {
      return "";
    }
    return result.split(/\s/)[0] || result.slice(0, 40);
  }
  function fn51(arg1) {
    return String(arg1 || "").replace(/\s+/g, "").toLowerCase().replace(/[^\w\u4e00-\u9fff]/g, "");
  }
  function fn52(arg1) {
    const result = String(arg1?.text || "").trim();
    if (!result) {
      return false;
    }
    if (/^(精选|推荐|搜索|关注|朋友|我的|直播|放映厅|短剧)$/.test(result)) {
      return false;
    }
    return true;
  }
  function fn53(list = []) {
    const result = list.filter(fn52);
    if (result.length) {
      return result;
    } else {
      return list;
    }
  }
  function fn54(arg1, arg2) {
    const result = String(arg2 || "").trim().toLowerCase();
    const result2 = fn51(arg2);
    const result3 = String(arg1.text || "").trim().toLowerCase();
    const result4 = fn51(arg1.text);
    const result5 = String(arg1.fullText || "").trim().toLowerCase();
    const result6 = fn51(arg1.fullText);
    if (!result2) {
      return 0;
    }
    if (result3 === result || result4 === result2 || result5 === result || result6 === result2) {
      return 100;
    }
    if (result5.includes(result) || result6.includes(result2)) {
      return 95;
    }
    if (result3.startsWith(result) || result4.startsWith(result2) || result6.startsWith(result2)) {
      return 85;
    }
    if (result.startsWith(result3) || result2.startsWith(result4) || result2.startsWith(result6)) {
      return 80;
    }
    if (result3.includes(result) || result5.includes(result)) {
      return 70;
    }
    if (result4.includes(result2) || result2.includes(result4)) {
      return 65;
    }
    const flag = !!arg1.el?.querySelector?.("img, [class*=\"avatar\"], [class*=\"Avatar\"]");
    if (flag) {
      return 10;
    } else {
      return 0;
    }
  }
  function fn55(arg1, arg2) {
    return fn54(arg1, arg2) >= 95;
  }
  function fn56(arg1, arg2) {
    if (!arg1) {
      return 0;
    }
    const local = arg1.closest?.("[contenteditable=\"true\"]") || arg1;
    const result = String(arg2 || "").trim().replace(/^@+/, "");
    if (!result) {
      return 0;
    }
    const result2 = fn51(result);
    let num = 0;
    const local2 = local.querySelectorAll?.("[contenteditable=\"false\"]") || [];
    for (const item of local2) {
      const result = String(item.textContent || "").trim().replace(/^@+/, "");
      if (!result) {
        continue;
      }
      const result3 = fn51(result);
      if (result3 === result2 || result3.includes(result2) || result2.includes(result3)) {
        num += 1;
      }
    }
    const local3 = local.querySelectorAll?.("a[href*=\"/user/\"], [data-e2e=\"comment-at-user\"], [data-user-id], [data-sec-uid]") || [];
    for (const item of local3) {
      const result = String(item.textContent || "").trim().replace(/^@+/, "");
      if (!result) {
        continue;
      }
      const result3 = fn51(result);
      if (result3 === result2 || result3.includes(result2) || result2.includes(result3)) {
        num += 1;
      }
    }
    return num;
  }
  function fn57(arg1) {
    if (!arg1) {
      return [];
    }
    const set = new Set();
    const list = [];
    const local = (arg1, arg2) => {
      if (!arg1 || set.has(arg1) || !isVisibleElement(arg1)) {
        return;
      }
      const result = arg1.getBoundingClientRect();
      const result2 = (arg1.innerText || arg1.textContent || "").replace(/\s+/g, " ").trim();
      const result3 = fn50(arg1);
      reportMentionDebug("[DEBUG-ROW] ID=" + (arg1.id || arg1.className) + " text=\"" + result2 + "\" firstLine=\"" + result3 + "\" rect=" + Math.round(result.left) + "," + Math.round(result.top) + " " + Math.round(result.width) + "x" + Math.round(result.height));
      if (result.width < 48 || result.height < 24 || result.height > 160) {
        return;
      }
      if (!result3 || result3.length > 60) {
        return;
      }
      if (/^(精选|推荐|搜索|关注|朋友|我的|直播|放映厅|短剧)$/.test(result3)) {
        return;
      }
      if (arg1.closest?.("[data-e2e=\"douyin-navigation\"]")) {
        return;
      }
      set.add(arg1);
      list.push({
        el: arg1,
        text: result3,
        rect: result,
        fullText: result2.slice(0, 80),
        source: arg2
      });
    };
    Array.from(arg1.children).forEach(arg1 => local(arg1, "inner-child"));
    if (!list.length) {
      const list = ["[class*=\"at-item\"]", "[class*=\"AtItem\"]", "[class*=\"atUser\"]", "[class*=\"AtUser\"]", "[class*=\"user-item\"]", "[class*=\"UserItem\"]", "li", "[role=\"option\"]"];
      for (const item of list) {
        arg1.querySelectorAll(item).forEach(arg1 => {
          const local2 = arg1.closest("[class*=\"at-item\"], [class*=\"AtItem\"], li, [role=\"option\"]") || arg1;
          local(local2, item);
        });
      }
    }
    list.sort((arg1, arg2) => arg1.rect.top - arg2.rect.top || arg1.rect.left - arg2.rect.left);
    const list2 = [];
    const set2 = new Set();
    for (const item of list) {
      const value = item.text.toLowerCase() + "@" + Math.round(item.rect.top);
      if (set2.has(value)) {
        continue;
      }
      set2.add(value);
      list2.push(item);
    }
    return list2;
  }
  function fn58(arg1) {
    if (!arg1) {
      return null;
    }
    if (String(arg1.className || "").includes("atBox-inner")) {
      return arg1;
    }
    return arg1.querySelector("[class*=\"atBox-inner\"]");
  }
  function fn59(arg1, arg2) {
    const result = fn58(arg1);
    if (!result) {
      return null;
    }
    const result2 = Array.from(result.children).filter(isVisibleElement).map(arg1 => {
      const result = arg1.getBoundingClientRect();
      const result2 = fn50(arg1);
      const result3 = (arg1.innerText || arg1.textContent || "").replace(/\s+/g, " ").trim();
      return {
        el: arg1,
        text: result2,
        fullText: result3,
        rect: result
      };
    }).filter(arg1 => fn52(arg1) && arg1.rect.width > 0 && arg1.rect.height > 0);
    if (!result2.length) {
      return null;
    }
    const result3 = String(arg2 || "").trim();
    if (result3) {
      const result = [...result2].map(arg1 => ({
        ...arg1,
        score: fn54(arg1, arg2)
      })).filter(arg1 => fn55(arg1, arg2)).sort((arg1, arg2) => arg2.score - arg1.score || arg1.rect.top - arg2.rect.top);
      if (result.length) {
        reportMentionDebug("fallback 精确匹配「" + arg2 + "」→ \"" + clipTraceText(result[0].text, 24) + "\"");
        return result[0];
      }
    }
    reportMentionDebug("未匹配到精确候选「" + (result3 || arg2) + "」，拒绝兜底点击候选第一项", true);
    return null;
  }
  function fn60(arg1) {
    if (!arg1 || !isVisibleElement(arg1)) {
      return false;
    }
    const result = arg1.getBoundingClientRect();
    return result.width > 40 && result.height > 40;
  }
  function fn61(arg1) {
    if (!arg1) {
      return "panel=null";
    }
    const result = arg1.getBoundingClientRect();
    const result2 = fn58(arg1);
    const value = result2 ? result2.children.length : 0;
    return fn47(arg1) + " visible=" + fn60(arg1) + " innerChildren=" + value;
  }
  function fn62(arg1, arg2) {
    const result = fn58(arg2);
    if (!result || !arg1) {
      return null;
    }
    let local = arg1;
    while (local && local !== result) {
      if (local.parentElement === result) {
        return local;
      }
      local = local.parentElement;
    }
    return null;
  }
  function fn63(arg1, arg2) {
    return fn62(arg1, arg2) || (() => {
      if (!arg1) {
        return null;
      }
      const result = fn58(arg2);
      let local = arg1;
      let local2 = arg1;
      for (let num = 0; num < 8 && local2; num++) {
        if (arg2 && !arg2.contains(local2) && local2 !== arg2) {
          break;
        }
        const result2 = local2.getBoundingClientRect();
        if (result2.width <= 0 || result2.height <= 0) {
          local2 = local2.parentElement;
          continue;
        }
        const flag = !!local2.querySelector("img, [class*=\"avatar\"], [class*=\"Avatar\"]");
        const local3 = result2.width >= 72 && result2.height >= 28 && result2.height <= 120;
        if (local3) {
          local = local2;
          if (flag) {
            return local2;
          }
        }
        if (result && local2.parentElement === result) {
          local = local2;
        }
        local2 = local2.parentElement;
      }
      return local;
    })();
  }
  async function fn64(arg1, arg2, arg3, text = "") {
    const result = Math.round(arg1);
    const result2 = Math.round(arg2);
    const result3 = document.elementFromPoint(result, result2);
    reportMentionDebug("原生点击 " + (text || "atBox") + " @(" + result + "," + result2 + ") elementFromPoint=" + briefEl(result3), true);
    try {
      const result4 = await fn22(result3, {
        x: result,
        y: result2,
        label: text || "atBox"
      });
      await randomDelay(120, 220, arg3);
      return !!result4 && result4.success !== false;
    } catch (error) {
      reportMentionDebug("原生点击 IPC 失败: " + (error.message || error), true);
      if (result3?.click) {
        try {
          result3.click();
        } catch (error) {}
      }
      return false;
    }
  }
  function fn65(arg1) {
    return Array.from(String(arg1 || "")).map(arg1 => "" + arg1 + arg1).join("");
  }
  function fn66(arg1, arg2) {
    const result = String(arg1 || "");
    const result2 = String(arg2 || "").trim();
    if (!result2) {
      return false;
    }
    if (result.includes(result2)) {
      return true;
    }
    const result3 = fn65(result2);
    return !!result3 && !!result.includes(result3);
  }
  async function fn67(arg1, arg2) {
    if (!arg1) {
      return false;
    }
    try {
      const result = await ipcRenderer.invoke("simulate-text", {
        text: arg1
      });
      await randomDelay(120, 220, arg2);
      return !!result && result.success !== false;
    } catch (error) {
      reportMentionDebug("原生键盘输入 IPC 失败: " + (error.message || error), true);
      return false;
    }
  }
  async function fn68(arg1, arg2, arg3, arg4, arg5) {
    if (!arg1?.el) {
      return false;
    }
    const list = [];
    const local = (arg1, arg2) => {
      if (!arg1 || list.some(arg12 => arg12.el === arg1)) {
        return;
      }
      list.push({
        el: arg1,
        label: arg2
      });
    };
    if (arg1.el) {
      const result = Array.from(arg1.el.querySelectorAll("span, p, div, [class*=\"name\"], [class*=\"nick\"]")).filter(arg12 => {
        const result = (arg12.textContent || "").trim();
        return result === arg1.text || result.includes(arg1.text);
      });
      if (result.length > 0) {
        local(result[0], "item-text");
      } else {
        const result = arg1.el.querySelector("span");
        if (result) {
          local(result, "item-span");
        }
      }
      const result2 = arg1.el.querySelector("img");
      if (result2) {
        local(result2, "item-img");
      }
    }
    local(arg1.el, "item-el");
    local(fn62(arg1.el, arg2), "inner-child");
    const result = fn63(arg1.el, arg2);
    if (result && result !== arg1.el) {
      local(result, "row-el");
    }
    if (!list.length) {
      reportMentionDebug("atBox 无可用点击目标", true);
      return false;
    }
    reportMentionDebug("atBox 准备点击 @" + arg3 + " → \"" + clipTraceText(arg1.text, 20) + "\" 候选=" + list.length + " panel=" + fn61(arg2) + " composer=" + fn69(arg5), true);
    for (const {
      el: el,
      label: label
    } of list) {
      if (shouldAbort(arg4)) {
        return false;
      }
      if (!isVisibleElement(el)) {
        reportMentionDebug("  跳过(" + label + ") 不可见 " + briefEl(el));
        continue;
      }
      const result = el.getBoundingClientRect();
      reportMentionDebug("  可信点击(" + label + ") " + briefEl(el) + " " + Math.round(result.width) + "x" + Math.round(result.height) + " @(" + Math.round(result.left) + "," + Math.round(result.top) + ")");
      const result2 = await simulateTrustedElementClick(el, arg4, "atBox-" + label, {
        allowScrollIntoView: false
      });
      await randomDelay(450, 800, arg4);
      reportMentionDebug("  点击后 trusted=" + !!result2 + " panel=" + fn61(arg2) + " composer=" + fn69(arg5));
      if (arg5 && fn70(arg5)) {
        reportMentionDebug("可信点击(" + label + ") 已形成蓝色 @", true);
        return true;
      }
      if (arg5 && !fn70(arg5)) {
        const result = el.getBoundingClientRect();
        const value = result.left + result.width / 2;
        const value2 = result.top + result.height / 2;
        reportMentionDebug("  可信点击未形成 @，坐标原生点击重试(" + label + ") @(" + Math.round(value) + "," + Math.round(value2) + ")", true);
        await fn64(value, value2, arg4, "atBox-item-" + label);
        await randomDelay(450, 800, arg4);
        reportMentionDebug("  原生点击后 panel=" + fn61(arg2) + " composer=" + fn69(arg5));
        if (fn70(arg5)) {
          reportMentionDebug("原生点击(" + label + ") 已形成蓝色 @", true);
          return true;
        }
      }
    }
    reportMentionDebug("可信点击各候选均未形成蓝色 @", true);
    return false;
  }
  async function fn71(arg1, arg2, arg3, arg4, arg5, arg6) {
    if (!arg1 || !arg5 || !arg4) {
      return false;
    }
    reportMentionDebug("@" + arg2 + "：方向键高亮 + 穿透点击（禁止回车）", true);
    arg1.focus();
    await randomDelay(200, 380, arg3);
    const obj = {
      bubbles: true,
      cancelable: true,
      key: "ArrowDown",
      code: "ArrowDown",
      keyCode: 40
    };
    arg1.dispatchEvent(new KeyboardEvent("keydown", obj));
    arg1.dispatchEvent(new KeyboardEvent("keyup", obj));
    await randomDelay(320, 520, arg3);
    if (!fn60(arg4)) {
      reportMentionDebug("@" + arg2 + "：方向键后面板已关闭 panel=" + fn61(arg4), true);
      return false;
    }
    return fn68(arg5, arg4, arg2, arg3, arg6 || arg1);
  }
  function fn72(arg1) {
    const result = Array.from(document.querySelectorAll("[class*=\"atBox-outside\"], [class*=\"atBox-inner\"]")).filter(arg1 => isVisibleElement(arg1) && !fn49(arg1));
    if (!result.length) {
      return null;
    }
    const local = arg1?.getBoundingClientRect?.();
    let value = result[0];
    let value2 = -1;
    for (const item of result) {
      const local2 = item.closest("[class*=\"atBox-outside\"]") || item;
      if (fn49(local2)) {
        continue;
      }
      let value3 = fn48(local2) ? 200 : 0;
      const result = local2.getBoundingClientRect();
      if (local) {
        const result2 = Math.abs((result.left + result.right) / 2 - (local.left + local.right) / 2);
        if (result2 < 180) {
          value3 += 30;
        }
        if (result.top < local.top && result.bottom > local.top - 20) {
          value3 += 20;
        }
      }
      if (value3 > value2) {
        value2 = value3;
        value = local2;
      }
    }
    return value;
  }
  function fn73(arg1, arg2) {
    if (!arg1 || !isVisibleElement(arg1) || fn49(arg1)) {
      return false;
    }
    if (fn48(arg1)) {
      const result = arg1.getBoundingClientRect();
      if (result.width < 72 || result.height < 32) {
        return false;
      }
      return true;
    }
    const result = arg1.getBoundingClientRect();
    if (result.width < 72 || result.height < 32) {
      return false;
    }
    if (result.width > window.innerWidth * 0.96 || result.height > window.innerHeight * 0.85) {
      return false;
    }
    const result2 = String(arg1.className || "").toLowerCase();
    const result3 = String(arg1.getAttribute("data-e2e") || "").toLowerCase();
    const value = result2 + " " + result3;
    if (/emoji|sticker|gif|face|表情/.test(value)) {
      return false;
    }
    const result4 = fn74(arg1);
    const result5 = (arg1.innerText || arg1.textContent || "").replace(/\s+/g, " ").trim();
    const result6 = /(?:^|[\s_-])(?:at|mention|suggest|search-user|user-list|nickname)/i.test(value);
    const value2 = result4.length > 0;
    const result7 = /抖音号|粉丝|关注/.test(result5);
    if (!value2 && !result6 && !result7) {
      return false;
    }
    const local = arg2?.getBoundingClientRect?.();
    if (local) {
      const value = result.top > local.bottom + 420;
      const value2 = result.bottom < local.top - 320;
      if (value || value2) {
        return false;
      }
    }
    return true;
  }
  function fn74(arg1) {
    if (!arg1) {
      return [];
    }
    const local = arg1.querySelector("[class*=\"atBox-inner\"]") || (String(arg1.className || "").includes("atBox-inner") ? arg1 : null);
    if (local) {
      const result = fn57(local);
      if (result.length) {
        return result;
      }
    }
    const text = "li, [role=\"option\"], [role=\"menuitem\"], [class*=\"at-item\"], [class*=\"AtItem\"], [class*=\"user-item\"], [class*=\"UserItem\"]";
    const result = Array.from(arg1.querySelectorAll(text)).filter(isVisibleElement);
    const set = new Set();
    const list = [];
    for (const item of result) {
      const local = item.closest("li, [role=\"option\"], [role=\"menuitem\"]") || item;
      if (set.has(local) || fn49(local)) {
        continue;
      }
      const result = local.getBoundingClientRect();
      if (result.width < 48 || result.height < 22 || result.height > 220) {
        continue;
      }
      const result2 = fn50(local);
      if (!result2 || result2.length > 60) {
        continue;
      }
      set.add(local);
      list.push({
        el: local,
        text: result2,
        rect: result
      });
    }
    list.sort((arg1, arg2) => arg1.rect.top - arg2.rect.top || arg1.rect.left - arg2.rect.left);
    return list;
  }
  function fn75(arg1, arg2, arg3) {
    let num = 0;
    const result = fn74(arg1);
    const result2 = String(arg1.className || "").toLowerCase();
    const result3 = String(arg1.getAttribute("data-e2e") || "").toLowerCase();
    const value = result2 + " " + result3;
    const result4 = String(arg3 || "").trim().toLowerCase();
    const result5 = (arg1.innerText || "").replace(/\s+/g, " ").trim().toLowerCase();
    if (fn48(arg1)) {
      num += 200;
    }
    if (/atbox-outside/.test(value)) {
      num += 40;
    }
    if (/atbox-inner/.test(value)) {
      num += 20;
    }
    if (/at|mention|suggest|search-user|user-list|userlist|nickname/.test(value)) {
      num += 40;
    }
    if (result.length > 0) {
      num += 50;
    }
    if (result4 && result5.includes(result4)) {
      num += 25;
    }
    if (result.some(arg1 => arg1.text.toLowerCase().includes(result4) || arg1.text.toLowerCase() === result4)) {
      num += 40;
    }
    const local = arg2?.getBoundingClientRect?.();
    const result6 = arg1.getBoundingClientRect();
    if (local) {
      const value = (local.left + local.right) / 2;
      const value2 = (result6.left + result6.right) / 2;
      const result = Math.abs(value - value2);
      if (result < 120) {
        num += 20;
      } else if (result < 260) {
        num += 10;
      }
      if (result6.bottom <= local.top + 40 && result6.bottom >= local.top - 220) {
        num += 25;
      }
    }
    if (fn49(arg1)) {
      num -= 500;
    }
    return {
      score: num,
      items: result,
      textPreview: result5.slice(0, 100),
      isAtBox: fn48(arg1)
    };
  }
  function fn76(arg1, arg2) {
    const set = new Set();
    const list = [];
    const local = arg12 => {
      if (!arg12 || set.has(arg12) || fn49(arg12)) {
        return;
      }
      if (!fn73(arg12, arg1) && !fn48(arg12)) {
        return;
      }
      set.add(arg12);
      const result = fn75(arg12, arg1, arg2);
      list.push({
        panel: arg12,
        ...result
      });
    };
    const result = fn72(arg1);
    if (result) {
      local(result);
    }
    document.querySelectorAll("[class*=\"atBox-outside-container\"]").forEach(arg1 => {
      local(arg1.closest("[class*=\"atBox-outside\"]") || arg1);
    });
    const list2 = [];
    const result2 = getCommentComposerRoot(arg1);
    if (result2) {
      list2.push(result2);
    }
    let local2 = arg1;
    for (let num = 0; num < 8 && local2; num++) {
      if (!list2.includes(local2)) {
        list2.push(local2);
      }
      local2 = local2.parentElement;
    }
    const list3 = ["[class*=\"atBox\"]", "[class*=\"at-item\"]", "[class*=\"mention\"]", "[class*=\"suggest\"]", "[data-e2e*=\"at\"]"];
    for (const item of list2) {
      if (!item) {
        continue;
      }
      for (const item2 of list3) {
        let list = [];
        try {
          list = Array.from(item.querySelectorAll(item2));
        } catch (error) {
          continue;
        }
        for (const item of list) {
          const local2 = item.closest("[class*=\"atBox-outside\"]") || item;
          local(local2);
        }
      }
    }
    return list.sort((arg1, arg2) => arg2.score - arg1.score);
  }
  function fn77(arg1, arg2, arg3) {
    reportMentionDebug(arg3 + " @" + arg2 + "：发现 " + arg1.length + " 个候选面板");
    arg1.slice(0, 6).forEach((arg1, arg2) => {
      reportMentionDebug("  面板#" + (arg2 + 1) + " score=" + arg1.score + " " + fn47(arg1.panel) + " 项=" + arg1.items.length + " 预览=\"" + clipTraceText(arg1.textPreview, 36) + "\"");
      arg1.items.slice(0, 6).forEach((arg1, arg2) => {
        reportMentionDebug("    项#" + (arg2 + 1) + " " + briefEl(arg1.el) + " \"" + clipTraceText(arg1.text, 28) + "\"");
      });
    });
  }
  function fn78(arg1, arg2) {
    if (!arg1.length) {
      return null;
    }
    const result = fn53(arg1);
    const result2 = String(arg2 || "").trim();
    if (!result2) {
      reportMentionDebug("无目标昵称，拒绝兜底点击候选第一项", true);
      return null;
    }
    const result3 = [...result].map(arg1 => ({
      ...arg1,
      score: fn54(arg1, result2)
    })).filter(arg1 => fn55(arg1, result2)).sort((arg1, arg2) => arg2.score - arg1.score || arg1.rect.top - arg2.rect.top || arg1.rect.left - arg2.rect.left);
    if (result3.length) {
      const value = result3[0];
      reportMentionDebug("精确匹配「" + result2 + "」→ \"" + clipTraceText(value.text, 24) + "\" (score=" + value.score + ") rect=@(" + Math.round(value.rect.left) + "," + Math.round(value.rect.top) + ") " + Math.round(value.rect.width) + "x" + Math.round(value.rect.height));
      return value;
    }
    reportMentionDebug("未匹配到精确候选「" + result2 + "」，拒绝兜底点击候选第一项", true);
    return null;
  }
  const num = 52;
  const num2 = 48;
  const num3 = 24;
  async function fn79(arg1, arg2, arg3, arg4 = num) {
    let num4 = 0;
    for (let num = 0; num < arg4; num++) {
      if (shouldAbort(arg2)) {
        return null;
      }
      await randomDelay(280, 480, arg2);
      const result = fn76(arg1, arg3);
      const result2 = result.filter(arg1 => arg1.isAtBox);
      const value = result2.length ? result2 : result.slice(0, 3);
      fn77(value, arg3, "轮询 " + (num + 1) + "/" + arg4);
      const result3 = result2.find(arg1 => arg1.items.length > 0);
      if (result3) {
        const result = result3.items.some(arg1 => fn55(arg1, arg3));
        const local = num2;
        if (result) {
          reportMentionDebug("atBox 精确候选就绪 项=" + result3.items.length + " " + fn47(result3.panel), true);
          fn44(result3.panel);
          return {
            panel: result3.panel,
            items: result3.items
          };
        }
        if (num >= local) {
          reportMentionDebug("atBox 搜索超时仍无精确候选「" + arg3 + "」，拒绝兜底点击候选第一项", true);
          fn44(result3.panel);
          return {
            panel: result3.panel,
            items: result3.items
          };
        }
        reportMentionDebug("已发现 atBox，但尚未发现「" + arg3 + "」的精确匹配，继续等待搜索结果渲染… (" + (num + 1) + "/" + local + ")");
      }
      if (result2.length) {
        num4 += 1;
        reportMentionDebug("atBox 已出现，等待列表渲染… (" + (num + 1) + "/" + arg4 + "，连续 " + num4 + ")");
        if (num4 >= num3) {
          reportMentionDebug("atBox 已稳定出现但仍无精确候选，拒绝兜底点击候选第一项", true);
          fn44(result2[0].panel);
          return {
            panel: result2[0].panel,
            items: result2[0].items || []
          };
        }
        continue;
      }
      num4 = 0;
    }
    reportMentionDebug("@" + arg3 + "：" + arg4 + " 轮后 atBox 列表仍未就绪", true);
    return null;
  }
  function fn70(arg1) {
    if (!arg1) {
      return false;
    }
    const local = arg1.closest?.("[contenteditable=\"true\"]") || arg1;
    const local2 = local.querySelectorAll?.("[contenteditable=\"false\"]") || [];
    for (const item of local2) {
      const result = (item.textContent || "").trim();
      if (result.startsWith("@") && result.length > 1) {
        return true;
      }
    }
    if (local.querySelector?.("a[href*=\"/user/\"], [data-e2e=\"comment-at-user\"], [data-user-id], [data-aweme-id], [data-sec-uid]")) {
      return true;
    }
    const local3 = local.innerHTML || "";
    if (/data-(?:user|aweme|uid|anchor|sec)/i.test(local3)) {
      return true;
    }
    if (/class="[^"]*(?:mention|at-user|atUser|AtUser|AT_USER)[^"]*"/i.test(local3)) {
      return true;
    }
    return false;
  }
  function fn69(arg1) {
    if (!arg1) {
      return "无输入框";
    }
    const local = arg1.closest?.("[contenteditable=\"true\"]") || arg1;
    const result = (local.innerText || local.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80);
    const result2 = Array.from(local.querySelectorAll?.("[contenteditable=\"false\"]") || []).map(arg1 => (arg1.textContent || "").trim()).filter(arg1 => arg1.startsWith("@"));
    return "text=\"" + result + "\" locked=@" + (result2.join(", @") || "无") + " realLink=" + fn70(arg1);
  }
  function fn80(arg1, options = {}) {
    if (!arg1 || !isVisibleElement(arg1)) {
      return false;
    }
    if (arg1.closest("[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], [class*=\"comment-item\"]")) {
      return false;
    }
    if (fn49(arg1)) {
      return false;
    }
    const {
      emojiBtn: emojiBtn,
      imageBtn: imageBtn
    } = options;
    if (isEmojiTriggerCandidate(arg1, emojiBtn)) {
      return false;
    }
    if (imageBtn && (arg1 === imageBtn || imageBtn.contains(arg1) || arg1.contains(imageBtn) || elementsNearlyOverlap(arg1, imageBtn))) {
      return false;
    }
    const result = arg1.getBoundingClientRect();
    if (result.width < 8 || result.height < 8 || result.width > 96 || result.height > 96) {
      return false;
    }
    return true;
  }
  function fn81(arg1) {
    if (!arg1) {
      return null;
    }
    return arg1.closest("button, div[role=\"button\"], span[role=\"button\"], label, span, div") || arg1;
  }
  function fn82(arg1, arg2, arg3) {
    if (!arg1 || !isVisibleElement(arg1)) {
      return false;
    }
    if (arg2 && (arg1 === arg2 || arg2.contains(arg1) || arg1.contains(arg2))) {
      return false;
    }
    if (arg3 && arg3.contains(arg1)) {
      return false;
    }
    if (arg1.closest("[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], [class*=\"comment-item\"]")) {
      return false;
    }
    const local = arg1.tagName === "SVG" || !!arg1.querySelector("svg");
    if (!local) {
      return false;
    }
    const result = arg1.getBoundingClientRect();
    if (result.width < 8 || result.height < 8 || result.width > 80 || result.height > 80) {
      return false;
    }
    return true;
  }
  function fn83(arg1, arg2 = null) {
    const local = arg2?.emojiBtnCache || findEmojiTriggerBtn(arg1, arg2);
    const local2 = arg2?.imageBtnCache || collectCommentImageTriggerCandidates(arg1, arg2)[0]?.el;
    const local3 = arg1?.getBoundingClientRect?.();
    const local4 = local?.getBoundingClientRect?.();
    const value = local4 ? (local4.top + local4.bottom) / 2 : local3 ? (local3.top + local3.bottom) / 2 : null;
    const list = [];
    const result = getCommentComposerRoot(arg1);
    if (result) {
      list.push(result);
    }
    if (arg2?.roots?.length) {
      arg2.roots.forEach(arg1 => {
        if (arg1 && !list.includes(arg1)) {
          list.push(arg1);
        }
      });
    }
    let local5 = arg1;
    for (let num = 0; num < 10 && local5 && local5 !== document.body; num++) {
      if (!list.includes(local5)) {
        list.push(local5);
      }
      local5 = local5.parentElement;
    }
    if (local) {
      let value = local.parentElement;
      for (let num = 0; num < 6 && value; num++) {
        if (!list.includes(value)) {
          list.push(value);
        }
        value = value.parentElement;
      }
    }
    const set = new Set();
    const list2 = [];
    const local6 = (arg12, arg2) => {
      const result = fn81(arg12);
      if (!result || set.has(result) || !fn82(result, null, arg1)) {
        return;
      }
      const result2 = result.getBoundingClientRect();
      if (value != null && Math.abs((result2.top + result2.bottom) / 2 - value) > 34) {
        return;
      }
      if (local3 && result2.left < local3.left + 40) {
        return;
      }
      if (local4 && result2.left > local4.right + 48) {
        return;
      }
      set.add(result);
      list2.push({
        el: result,
        source: arg2,
        cx: (result2.left + result2.right) / 2,
        cy: (result2.top + result2.bottom) / 2,
        rect: result2,
        isEmoji: !!local && (result === local || !!local.contains(result) || !!result.contains(local)),
        isImage: !!local2 && (result === local2 || !!local2.contains(result) || !!result.contains(local2) || !!elementsNearlyOverlap(result, local2))
      });
    };
    for (const item of list) {
      if (!item) {
        continue;
      }
      item.querySelectorAll("span, button, div[role=\"button\"], label, svg").forEach(arg1 => {
        const value = arg1.tagName === "SVG" ? arg1.closest("span, button, div, label") || arg1 : arg1;
        local6(value, "root:" + item.tagName);
      });
    }
    list2.sort((arg1, arg2) => arg1.cx - arg2.cx || arg1.cy - arg2.cy);
    return {
      icons: list2,
      emojiBtn: local,
      imageBtn: local2,
      rowCy: value,
      inputRect: local3,
      emojiRect: local4
    };
  }
  function fn84(arg1, arg2 = null) {
    const {
      icons: icons,
      emojiBtn: emojiBtn,
      imageBtn: imageBtn,
      rowCy: rowCy,
      inputRect: inputRect,
      emojiRect: emojiRect
    } = fn83(arg1, arg2);
    reportMentionDebug("工具栏探测 input=" + (inputRect ? "@(" + Math.round(inputRect.left) + "," + Math.round(inputRect.top) + ") " + Math.round(inputRect.width) + "x" + Math.round(inputRect.height) : "无") + " emoji=" + (emojiBtn ? briefEl(emojiBtn) : "未找到") + " image=" + (imageBtn ? briefEl(imageBtn) : "未找到") + " rowCy=" + (rowCy != null ? Math.round(rowCy) : "n/a") + " 图标=" + icons.length, true);
    icons.forEach((arg1, arg2) => {
      const result = String(arg1.el.className || "").split(/\s+/).filter(Boolean).slice(0, 2).join(".");
      const local = arg1.el.getAttribute("data-e2e") || "";
      const local2 = [arg1.isImage ? "图" : "", arg1.isEmoji ? "表情" : ""].filter(Boolean).join(",") || "-";
      reportMentionDebug("  工具栏#" + (arg2 + 1) + " [" + local2 + "] " + arg1.el.tagName + (result ? "." + result : "") + (local ? "[e2e=" + local + "]" : "") + " cx=" + Math.round(arg1.cx) + " cy=" + Math.round(arg1.cy) + " " + Math.round(arg1.rect.width) + "x" + Math.round(arg1.rect.height));
    });
    return icons;
  }
  function fn85(arg1, arg2 = null) {
    const {
      icons: icons,
      emojiBtn: emojiBtn,
      imageBtn: imageBtn
    } = fn83(arg1, arg2);
    if (!emojiBtn || icons.length === 0) {
      return null;
    }
    const result = icons.findIndex(arg1 => arg1.isEmoji);
    if (result <= 0) {
      reportMentionDebug("表情邻位：emojiIdx=" + result + "，无法定位 @（图标数=" + icons.length + "）");
      return null;
    }
    const result2 = icons.slice(0, result);
    if (!result2.length) {
      reportMentionDebug("表情邻位：emojiIdx=" + result + "，左侧无图标");
      return null;
    }
    const value = icons[result - 1];
    if (!value?.el) {
      reportMentionDebug("表情邻位：emojiIdx=" + result + "，左侧无紧邻图标");
      return null;
    }
    reportMentionDebug("表情邻位：选中紧邻表情左侧 #" + result + " " + briefEl(value.el) + " cx=" + Math.round(value.cx) + "（顺序：图→@→表情）", true);
    return value.el;
  }
  function fn86(arg1) {
    if (!arg1) {
      return false;
    }
    const value = arg1.tagName === "SVG" ? arg1 : arg1.querySelector?.("svg");
    if (!value) {
      return false;
    }
    const result = (value.textContent || "").trim();
    if (result === "@") {
      return true;
    }
    const local = value.innerHTML || "";
    if (/>@</.test(local)) {
      return true;
    }
    const result2 = (String(arg1.className || "") + " " + (arg1.getAttribute?.("data-e2e") || "") + " " + (arg1.getAttribute?.("aria-label") || "")).toLowerCase();
    return /(?:^|[\s_-])(?:at|mention)(?:$|[\s_-])/.test(result2) && !/emoji|sticker|gif|face|表情|image|picture|upload|photo/.test(result2);
  }
  function fn87(arg1, arg2 = null) {
    const value = arg2?.roots?.length ? [...arg2.roots] : [getCommentComposerRoot(arg1)].filter(Boolean);
    const local = arg2?.emojiBtnCache || findEmojiTriggerBtn(arg1, arg2);
    const local2 = arg2?.imageBtnCache || collectCommentImageTriggerCandidates(arg1, arg2)[0]?.el;
    const obj = {
      emojiBtn: local,
      imageBtn: local2
    };
    const list = ["[data-e2e=\"comment-at-icon\"]", "[data-e2e=\"comment-at-btn\"]", "[data-e2e=\"comment-at-button\"]", "[data-e2e=\"comment-at\"]", "[data-e2e*=\"comment-at-icon\"]", "[data-e2e*=\"comment-at-btn\"]", "[data-e2e*=\"comment\"][data-e2e*=\"at-icon\"]", "[data-e2e*=\"comment\"][data-e2e*=\"mention\"]", "[class*=\"comment-at\"]", "[class*=\"CommentAt\"]", "[class*=\"at-icon\"]", "[class*=\"AtIcon\"]"];
    const list2 = [];
    const set = new Set();
    const local3 = (arg1, arg2, num = 0) => {
      const result = fn81(arg1);
      if (!result || set.has(result) || !fn80(result, obj)) {
        return;
      }
      set.add(result);
      list2.push({
        el: result,
        reason: arg2,
        score: num
      });
    };
    for (const item of value) {
      if (!item) {
        continue;
      }
      for (const item2 of list) {
        try {
          item.querySelectorAll(item2).forEach(arg1 => {
            if (arg1.closest("[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], [class*=\"comment-item\"]")) {
              return;
            }
            local3(arg1, item2, 80);
          });
        } catch (error) {}
      }
      item.querySelectorAll("button, div[role=\"button\"], span[role=\"button\"], label, span, svg").forEach(arg1 => {
        const result = fn81(arg1);
        const result2 = [result.getAttribute?.("aria-label"), result.getAttribute?.("title"), result.textContent].filter(Boolean).join(" ");
        if (/^@$/.test((result.textContent || "").trim())) {
          local3(result, "text-@", 70);
          return;
        }
        if (/@|提及|艾特|mention/i.test(result2) && !/emoji|表情|gif|sticker|图片|相册|photo|image|upload/i.test(result2)) {
          local3(result, "hint", 60);
        }
        if (fn86(result)) {
          local3(result, "svg-at", 65);
        }
      });
    }
    const result = fn85(arg1, arg2);
    if (result) {
      local3(result, "emoji-neighbor", 95);
    }
    if (local || local2) {
      const result = getCommentComposerRoot(arg1);
      const value = result ? [result] : [];
      if (local?.parentElement && !value.includes(local.parentElement)) {
        value.push(local.parentElement);
      }
      for (const item of value) {
        if (!item) {
          continue;
        }
        const result = Array.from(item.querySelectorAll("button, div[role=\"button\"], span[role=\"button\"], label, span, svg")).map(arg1 => fn81(arg1)).filter((arg1, arg2, arg3) => arg1 && arg3.indexOf(arg1) === arg2 && fn80(arg1, obj));
        result.sort((arg1, arg2) => {
          const result = arg1.getBoundingClientRect();
          const result2 = arg2.getBoundingClientRect();
          return result.left - result2.left || result.top - result2.top;
        });
        if (local && local2) {
          const result2 = local.getBoundingClientRect();
          const result3 = local2.getBoundingClientRect();
          const result4 = result.filter(arg1 => {
            const result = arg1.getBoundingClientRect();
            const value = (result.left + result.right) / 2;
            return value > result3.left - 8 && value < result2.right + 8;
          });
          if (result4.length === 1) {
            local3(result4[0], "between-image-emoji", 90);
          } else if (result4.length > 1) {
            local3(result4[0], "between-image-emoji", 85);
          }
        } else if (local) {
          const result2 = local.getBoundingClientRect();
          const result3 = result.filter(arg1 => {
            const result = arg1.getBoundingClientRect();
            return result.right <= result2.left + 18 && Math.abs((result.top + result.bottom) / 2 - (result2.top + result2.bottom) / 2) < 36;
          }).sort((arg1, arg2) => arg2.getBoundingClientRect().right - arg1.getBoundingClientRect().right);
          const result4 = result3.find(arg1 => !local2 || arg1 !== local2 && !elementsNearlyOverlap(arg1, local2));
          if (result4) {
            local3(result4, "left-of-emoji", 75);
          }
        }
      }
    }
    return list2.sort((arg1, arg2) => arg2.score - arg1.score);
  }
  function fn88(arg1, arg2 = null) {
    fn84(arg1, arg2);
    const result = fn85(arg1, arg2);
    if (result) {
      reportMentionDebug("@ 按钮(表情邻位) " + briefEl(result), true);
      return result;
    }
    const result2 = fn87(arg1, arg2);
    if (result2.length) {
      reportMentionDebug("@ 按钮候选 " + result2.length + " 个，选用 " + result2[0].reason + " " + briefEl(result2[0].el));
      return result2[0].el;
    }
    return null;
  }
  function fn89(arg1, arg2) {
    const result = [arg2, fn58(arg2), getCommentComposerRoot(arg1)].filter(Boolean);
    for (const item of result) {
      const result = Array.from(item.querySelectorAll("input:not([type=\"file\"]), textarea, [contenteditable=\"true\"], [role=\"textbox\"]")).filter(arg12 => isVisibleElement(arg12) && arg12 !== arg1 && !arg1?.contains?.(arg12));
      if (result.length) {
        return result[0];
      }
    }
    const value = document.activeElement;
    if (value && value !== arg1 && value !== document.body) {
      if (value.matches?.("input:not([type=\"file\"]), textarea, [contenteditable=\"true\"], [role=\"textbox\"]")) {
        return value;
      }
    }
    return arg1;
  }
  async function fn90(arg1, arg2, num = 8) {
    for (let num2 = 0; num2 < num; num2++) {
      const result = fn72(arg1);
      if (result && isVisibleElement(result)) {
        reportMentionDebug("@ 面板已打开 " + fn47(result), true);
        return true;
      }
      await randomDelay(280, 480, arg2);
    }
    return false;
  }
  async function fn91(arg1, arg2, arg3 = null) {
    if (!arg1) {
      return false;
    }
    arg1.focus();
    await randomDelay(200, 400, arg2);
    const result = fn88(arg1, arg3);
    if (!result) {
      reportMentionDebug("未找到评论框右侧 @ 工具栏按钮", true);
      return false;
    }
    const result2 = result.getBoundingClientRect();
    const result3 = Math.round(result2.left + result2.width / 2);
    const result4 = Math.round(result2.top + result2.height / 2);
    reportMentionDebug("点击 @ 工具栏 " + briefEl(result) + " 中心(" + result3 + "," + result4 + ") " + Math.round(result2.width) + "x" + Math.round(result2.height), true);
    await simulateTrustedElementClick(result, arg2, "@工具栏", {
      allowScrollIntoView: false
    });
    if (await fn90(arg1, arg2, 8)) {
      return true;
    }
    reportMentionDebug("@ 可信点击未打开面板，尝试坐标原生点击兜底", true);
    await fn64(result3, result4, arg2, "@toolbar-fallback");
    if (await fn90(arg1, arg2, 6)) {
      return true;
    }
    reportMentionDebug("@ 按钮已点击，但未检测到 atBox 面板", true);
    return false;
  }
  async function fn92(arg1, arg2, arg3, options = {}) {
    const result = String(arg2 || "").trim().replace(/^@+/, "");
    if (!result || !arg1) {
      return false;
    }
    const local = options.scopeInfo || buildImageAttachScope(arg1, {
      replyMode: !!options.replyMode
    });
    const obj = {
      ...local,
      emojiBtnCache: options.scopeInfo?.emojiBtnCache || local.emojiBtnCache || findEmojiTriggerBtn(arg1, local),
      imageBtnCache: options.scopeInfo?.imageBtnCache || local.imageBtnCache || collectCommentImageTriggerCandidates(arg1, local)[0]?.el
    };
    reportMentionDebug("开始 @" + result, true);
    arg1.focus();
    await randomDelay(200, 400, arg3);
    const result2 = await fn91(arg1, arg3, obj);
    if (!result2) {
      reportMentionDebug("@" + result + "：未能通过 @ 按钮打开提及面板，跳过", true);
      return false;
    }
    const result3 = fn72(arg1);
    const result4 = fn89(arg1, result3);
    result4.focus();
    try {
      const local = result4.ownerDocument.defaultView || window;
      const result = local.getSelection();
      if (result) {
        const result2 = document.createRange();
        result2.selectNodeContents(result4);
        result2.collapse(false);
        result.removeAllRanges();
        result.addRange(result2);
      }
    } catch (error) {}
    await randomDelay(200, 380, arg3);
    reportMentionDebug("在 " + (result4 === arg1 ? "评论框" : "搜索框") + " 输入昵称 " + result + " (原生输入模式)");
    let result5 = await fn67(result, arg3);
    let local2 = result4.innerText || result4.textContent || "";
    const result6 = fn65(result);
    if (result6 && local2.includes(result6)) {
      reportMentionDebug("检测到昵称逐字双插（框内: \"" + clipTraceText(local2, 40) + "\"），清空后重输一次", true);
      try {
        focusWithoutScroll(result4);
        document.execCommand("selectAll");
        document.execCommand("delete");
      } catch (error) {}
      await randomDelay(180, 320, arg3);
      result5 = await fn67(result, arg3);
      local2 = result4.innerText || result4.textContent || "";
    }
    const result7 = fn66(local2, result);
    if (!result5 || !result7) {
      if (result6 && local2.includes(result6)) {
        reportMentionDebug("重输后仍见双插，跳过 DOM 叠打，继续点选候选", true);
      } else {
        reportMentionDebug("原生键盘输入未完全成功（当前框内: \"" + clipTraceText(local2, 30) + "\"），执行 DOM execCommand 录入兜底", true);
        await insertTextIntoEditable(result4, result, arg3);
      }
    }
    reportMentionDebug("已输入昵称 " + result + "，等待 atBox 精确候选…");
    reportMentionDebug("当前框内=\"" + clipTraceText(arg1.innerText || arg1.textContent || "", 60) + "\"");
    const result8 = fn56(arg1, result);
    const result9 = await fn79(arg1, arg3, result);
    let flag = false;
    let local3 = null;
    reportMentionDebug("候选就绪 panel=" + fn61(result9?.panel || result3) + " composer=" + fn69(arg1));
    if (result9?.panel && fn60(result9.panel)) {
      local3 = result9.items?.length ? fn78(result9.items, result) : null;
      if (!local3) {
        local3 = fn59(result9.panel, result);
        if (local3) {
          reportMentionDebug("fallback 精确项 \"" + clipTraceText(local3.text, 24) + "\"", true);
        }
      }
      if (local3) {
        reportMentionDebug("开始可信点击 atBox 精确候选（禁止回车、禁止点第一项）", true);
        flag = await fn68(local3, result9.panel, result, arg3, arg1);
        reportMentionDebug("点击后 panel=" + fn61(result9.panel) + " composer=" + fn69(arg1));
      } else {
        reportMentionDebug("未解析到精确可点击 atBox 项，拒绝兜底点击候选第一项", true);
      }
    } else {
      reportMentionDebug("atBox 不可见，跳过点击 panel=" + fn61(result9?.panel), true);
    }
    if (!fn70(arg1) && local3 && result9?.panel && fn60(result9.panel)) {
      reportMentionDebug("精确候选未形成蓝色 @，对同一项可信重试 \"" + clipTraceText(local3.text, 24) + "\"", true);
      flag = await fn68(local3, result9.panel, result, arg3, arg1);
      reportMentionDebug("重试后 composer=" + fn69(arg1));
    }
    await randomDelay(280, 520, arg3);
    const result10 = fn56(arg1, result);
    const local4 = fn70(arg1) && result10 > result8;
    if (local4) {
      reportMentionDebug("@" + result + " 蓝色 @ 链接已确认 (count " + result8 + "→" + result10 + ")", true);
    } else {
      console.warn("[评论@提及] @" + result + " 未能形成蓝色 @ 链接");
      reportMentionDebug("@" + result + " 未能形成蓝色 @ 链接 clicked=" + !!flag + " count " + result8 + "→" + result10 + " (" + fn69(arg1) + ")", true);
    }
    return local4;
  }
  async function fn93(arg1, arg2, options = {}) {
    const flag = !!options.isVideoComment;
    const value = flag ? fn36() : fn35();
    if (!value.length) {
      return {
        attached: false,
        skipped: true,
        count: 0,
        total: 0
      };
    }
    let num = 0;
    for (const item of value) {
      if (shouldAbort(arg2)) {
        break;
      }
      const result = await fn92(arg1, item, arg2, options);
      if (result) {
        num += 1;
      }
      await randomDelay(250, 450, arg2);
    }
    return {
      attached: num > 0,
      skipped: false,
      count: num,
      total: value.length
    };
  }
  async function composeCommentInputWithMentions(arg1, arg2, arg3, options = {}) {
    const flag = !!options.isVideoComment;
    const local = options.mentionPosition || resolveCommentMentionPosition(flag);
    if (local === "before" && shouldUseCommentMentions(flag)) {
      const result = await fn93(arg1, arg3, {
        isVideoComment: flag,
        replyMode: !!options.replyMode,
        scopeInfo: options.scopeInfo
      });
      if (result.attached) {
        reportTraceLog("@ 提及：已附加 " + result.count + "/" + result.total + " 个账号（正文前）");
      } else if (!result.skipped && result.total > 0) {
        reportTraceLog("@ 提及：正文前附加失败，继续发送评论正文");
      }
    }
    const result = String(arg2 || "");
    if (!result.trim()) {
      return true;
    }
    const result2 = await insertTextIntoEditable(arg1, result, arg3);
    return result2;
  }
  async function appendCommentMentionsAfterAttachments(arg1, arg2, options = {}) {
    const flag = !!options.isVideoComment;
    const local = options.mentionPosition || resolveCommentMentionPosition(flag);
    if (local !== "after" || !shouldUseCommentMentions(flag)) {
      return {
        attached: false,
        skipped: true,
        count: 0,
        total: 0
      };
    }
    const result = await fn93(arg1, arg2, {
      isVideoComment: flag,
      replyMode: !!options.replyMode,
      scopeInfo: options.scopeInfo
    });
    if (result.attached) {
      reportTraceLog("@ 提及：已附加 " + result.count + "/" + result.total + " 个账号（正文后）");
    } else if (result.total > 0) {
      reportTraceLog("@ 提及：正文后附加失败，继续发送");
    }
    return result;
  }
  return {
    appendCommentMentionsAfterAttachments: appendCommentMentionsAfterAttachments,
    composeCommentInputWithMentions: composeCommentInputWithMentions,
    findSmartElement: findSmartElement,
    focusWithoutScroll: focusWithoutScroll,
    insertTextIntoEditable: insertTextIntoEditable,
    isElementInViewport: isElementInViewport,
    isElementInViewportForAutomation: isElementInViewportForAutomation,
    isVisibleElement: isVisibleElement,
    reportMentionDebug: reportMentionDebug,
    resolveActiveMentionPercent: resolveActiveMentionPercent,
    resolveCommentMentionPosition: resolveCommentMentionPosition,
    rollMentionProbability: rollMentionProbability,
    safeScrollTargetIntoView: safeScrollTargetIntoView,
    shouldUseCommentMentions: shouldUseCommentMentions,
    simulateHumanClick: simulateHumanClick,
    simulateTrustedElementClick: simulateTrustedElementClick,
    simulateTrustedEnter: simulateTrustedEnter,
    simulateTrustedKey: simulateTrustedKey,
    waitForDmInput: waitForDmInput
  };
}
module.exports = {
  createDouyinDomInteractionController: createDouyinDomInteractionController
};
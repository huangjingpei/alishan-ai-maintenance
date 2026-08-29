'use strict';

function splitSelectorList(arg1) {
  if (Array.isArray(arg1)) {
    return arg1.map(arg1 => String(arg1 || "").trim()).filter(Boolean);
  }
  return String(arg1 || "").split(",").map(arg1 => arg1.trim()).filter(Boolean);
}
function compileOptionalRegex(arg1, text = "i") {
  const result = String(arg1 || "").trim();
  if (!result) {
    return null;
  }
  try {
    return new RegExp(result, text);
  } catch (error) {
    return null;
  }
}
function resolveVideoEngagePack(options = {}) {
  if (typeof options.getVideoEngagePack === "function") {
    try {
      const result = options.getVideoEngagePack();
      if (result && typeof result === "object") {
        return result;
      }
    } catch (error) {}
  }
  if (options.videoEngagePack && typeof options.videoEngagePack === "object") {
    return options.videoEngagePack;
  }
  return null;
}
function getVideoEngageSelector(arg1, arg2) {
  const result = resolveVideoEngagePack(arg1);
  return String(result?.[arg2] || "").trim();
}
function hasVideoEngagePack(options = {}) {
  const result = resolveVideoEngagePack(options);
  if (!result) {
    return false;
  }
  return splitSelectorList(result.likeSelectors).length > 0 || splitSelectorList(result.collectSelectors).length > 0 || splitSelectorList(result.shareSelectors).length > 0;
}
function pickVisibleActionButton(arg1, {
  isVisibleElement: isVisibleElement,
  scope: scope,
  matchText: matchText,
  rejectText: rejectText,
  commentListExclude: commentListExclude
} = {}) {
  const local = scope || document;
  const list = [];
  for (const item of arg1 || []) {
    try {
      list.push(...Array.from(local.querySelectorAll(item)));
    } catch (error) {}
  }
  const result = String(commentListExclude || "").trim();
  const result2 = list.filter(arg12 => {
    if (!arg12 || isVisibleElement && !isVisibleElement(arg12)) {
      return false;
    }
    try {
      if (result && arg12.closest?.(result)) {
        return false;
      }
    } catch (error) {}
    const result2 = [arg12.getAttribute?.("aria-label") || "", arg12.getAttribute?.("title") || "", arg12.getAttribute?.("data-e2e") || "", arg12.innerText || ""].join(" ");
    if (rejectText && rejectText.test(result2)) {
      return false;
    }
    if (matchText && !matchText.test(result2) && !(arg1 || []).some(arg1 => {
      try {
        return arg12.matches?.(arg1);
      } catch (error) {
        return false;
      }
    })) {
      return false;
    }
    const local = arg12.getBoundingClientRect?.();
    return local && local.width > 0 && local.height > 0;
  }).sort((arg1, arg2) => {
    const result = arg1.getBoundingClientRect();
    const result2 = arg2.getBoundingClientRect();
    return result2.left - result.left || result.top - result2.top;
  });
  const value = result2[0];
  if (!value) {
    return null;
  }
  return value.closest?.("div[role=\"button\"], button, [role=\"button\"]") || value;
}
function looksAlreadyActive(arg1, arg2 = null) {
  if (!arg1) {
    return false;
  }
  try {
    if (arg1.getAttribute?.("aria-pressed") === "true") {
      return true;
    }
    if (arg1.getAttribute?.("aria-checked") === "true") {
      return true;
    }
    const value = (arg1.className || "") + " " + (arg1.parentElement?.className || "");
    const result = compileOptionalRegex(arg2?.activeClassPattern);
    if (result && result.test(value)) {
      return true;
    }
    const value2 = (arg1.getAttribute?.("aria-label") || "") + " " + (arg1.innerText || "");
    const value3 = Array.isArray(arg2?.activeStateHints) ? arg2.activeStateHints.map(arg1 => String(arg1 || "").trim()).filter(Boolean) : [];
    if (value3.length && value3.some(arg1 => value2.includes(arg1))) {
      return true;
    }
  } catch (error) {}
  return false;
}
async function clickVisibleSideActionButton(arg1, arg2, arg3, arg4, arg5 = null) {
  const {
    simulateHumanClick: simulateHumanClick,
    randomDelay: randomDelay,
    reportTraceLog: reportTraceLog
  } = arg3;
  if (!arg1 || typeof simulateHumanClick !== "function") {
    reportTraceLog?.("未找到" + arg4 + "按钮", null, "warning");
    return false;
  }
  if (looksAlreadyActive(arg1, arg5)) {
    reportTraceLog?.(arg4 + "已是选中状态，跳过重复点击");
    return true;
  }
  await simulateHumanClick(arg1, arg2);
  await randomDelay?.(400, 900, arg2, arg4 + "后停顿");
  return true;
}
function resolveVideoSideActionScope(options = {}) {
  const {
    resolveDouyinVideoDetailModal: resolveDouyinVideoDetailModal,
    getDouyinFeedScope: getDouyinFeedScope
  } = options;
  try {
    const local = resolveDouyinVideoDetailModal?.({
      includeFeed: false
    });
    if (local) {
      return local;
    }
  } catch (error) {}
  try {
    const local = getDouyinFeedScope?.();
    if (local) {
      return local;
    }
  } catch (error) {}
  return document;
}
async function likeCurrentVideoSideAction(arg1, options = {}) {
  const result = resolveVideoEngagePack(options);
  const result2 = splitSelectorList(result?.likeSelectors);
  if (!result2.length) {
    options.reportTraceLog?.("videoEngageV2 未就绪或缺少 likeSelectors，跳过点赞", null, "warning");
    return false;
  }
  const result3 = resolveVideoSideActionScope(options);
  const result4 = pickVisibleActionButton(result2, {
    isVisibleElement: options.isVisibleElement,
    scope: result3,
    rejectText: compileOptionalRegex(result.likeRejectPattern),
    commentListExclude: result.commentListExclude
  });
  return clickVisibleSideActionButton(result4, arg1, options, "点赞", result);
}
async function collectCurrentVideoSideAction(arg1, options = {}) {
  const result = resolveVideoEngagePack(options);
  const result2 = splitSelectorList(result?.collectSelectors);
  if (!result2.length) {
    options.reportTraceLog?.("videoEngageV2 未就绪或缺少 collectSelectors，跳过收藏", null, "warning");
    return false;
  }
  const result3 = resolveVideoSideActionScope(options);
  const result4 = pickVisibleActionButton(result2, {
    isVisibleElement: options.isVisibleElement,
    scope: result3,
    matchText: compileOptionalRegex(result.collectMatchPattern),
    rejectText: compileOptionalRegex(result.collectRejectPattern),
    commentListExclude: result.commentListExclude
  });
  return clickVisibleSideActionButton(result4, arg1, options, "收藏", result);
}
async function findShareSideActionButton(arg1, options = {}) {
  const result = resolveVideoEngagePack(options);
  const result2 = splitSelectorList(result?.shareSelectors);
  if (!result2.length) {
    options.reportTraceLog?.("videoEngageV2 未就绪或缺少 shareSelectors，跳过转发", null, "warning");
    return null;
  }
  const local = options.getDouyinFeedScope?.() || resolveVideoSideActionScope(options);
  return pickVisibleActionButton(result2, {
    isVisibleElement: options.isVisibleElement,
    scope: local,
    matchText: compileOptionalRegex(result.shareMatchPattern),
    rejectText: compileOptionalRegex(result.shareRejectPattern),
    commentListExclude: result.commentListExclude
  });
}
function findSharePanelCopyLinkButton(arg1, arg2 = null) {
  const value = Array.isArray(arg2?.copyLinkExactTexts) ? arg2.copyLinkExactTexts.map(arg1 => String(arg1 || "").trim()).filter(Boolean) : [];
  const result = compileOptionalRegex(arg2?.copyLinkRejectPattern);
  if (!value.length) {
    return null;
  }
  const result2 = Array.from(document.querySelectorAll("button, div, span, a, [role=\"button\"], li"));
  const list = [];
  for (const item of result2) {
    if (!item || arg1 && !arg1(item)) {
      continue;
    }
    const value2 = (item.innerText || item.textContent || "") + " " + (item.getAttribute?.("aria-label") || "");
    const result2 = value2.replace(/\s+/g, "");
    if (!value.some(arg1 => result2.includes(String(arg1).replace(/\s+/g, "")))) {
      continue;
    }
    if (result && result.test(result2)) {
      continue;
    }
    if (result2.length > 24) {
      continue;
    }
    let local;
    try {
      local = item.getBoundingClientRect();
    } catch (error) {
      continue;
    }
    if (!local || local.width < 24 || local.height < 16) {
      continue;
    }
    const local2 = window.innerHeight || 800;
    const value3 = local.top > local2 * 0.42 ? 120 : local.top > local2 * 0.28 ? 40 : 0;
    const value4 = value.some(arg1 => result2 === String(arg1).replace(/\s+/g, "")) ? 80 : 0;
    const value5 = local.width >= 88 && local.width <= 280 ? 30 : 0;
    const value6 = local.left < (window.innerWidth || 1280) * 0.55 ? 20 : 0;
    list.push({
      el: item,
      score: value3 + value4 + value5 + value6 + Math.min(local.width, 180) * 0.15
    });
  }
  list.sort((arg1, arg2) => arg2.score - arg1.score);
  const local = list[0]?.el;
  if (!local) {
    return null;
  }
  return local.closest?.("button, [role=\"button\"], a, div") || local;
}
module.exports = {
  splitSelectorList: splitSelectorList,
  compileOptionalRegex: compileOptionalRegex,
  resolveVideoEngagePack: resolveVideoEngagePack,
  getVideoEngageSelector: getVideoEngageSelector,
  hasVideoEngagePack: hasVideoEngagePack,
  pickVisibleActionButton: pickVisibleActionButton,
  looksAlreadyActive: looksAlreadyActive,
  clickVisibleSideActionButton: clickVisibleSideActionButton,
  resolveVideoSideActionScope: resolveVideoSideActionScope,
  likeCurrentVideoSideAction: likeCurrentVideoSideAction,
  collectCurrentVideoSideAction: collectCurrentVideoSideAction,
  findShareSideActionButton: findShareSideActionButton,
  findSharePanelCopyLinkButton: findSharePanelCopyLinkButton
};
'use strict';

/**
 * 抖音主页作品「置顶」角标识别（线索指定博主 / 监控主页共用）。
 * 页内注入请用 getDouyinProfileWorkPinnedPageSource()。本文件禁止混淆。
 */
function isDouyinPinnedBadgeText(text) {
  const s = String(text || "").replace(/\s+/g, "").trim();
  if (!s) {
    return false;
  }
  if (s === "置顶") {
    return true;
  }
  if (/^置顶[.。!！…]*$/.test(s)) {
    return true;
  }
  // 角标偶发「置顶」+ 极短后缀；排除「取消置顶」等
  if (s.length <= 8 && s.includes("置顶") && !/取消|已取消|解除/.test(s)) {
    return true;
  }
  return false;
}
function isDouyinAwemePinnedFlag(aweme) {
  if (!aweme || typeof aweme !== "object") {
    return false;
  }
  const truthy = v => v === true || v === 1 || v === "1" || v === "true";
  if (truthy(aweme.is_top) || truthy(aweme.isTop) || truthy(aweme.is_top_v2) || truthy(aweme.isTopV2)) {
    return true;
  }
  const status = aweme.status || aweme.aweme_status || aweme.awemeStatus;
  if (status && typeof status === "object") {
    if (truthy(status.is_top) || truthy(status.isTop) || truthy(status.is_top_v2)) {
      return true;
    }
  }
  const label = String(aweme.label_top_text || aweme.labelTopText || aweme.top_text || aweme.topText || "").replace(/\s+/g, "").trim();
  return isDouyinPinnedBadgeText(label);
}

/**
 * 收窄卡片根：禁止落到包裹整页作品列表的巨大 li/article（会把一条置顶传染给全部）。
 */
function resolveDouyinProfileWorkCardRoot(node) {
  if (!node) {
    return null;
  }
  const preferred = node.closest?.("[data-e2e=\"user-post-item\"], [data-e2e=user-post-item], [class*=\"user-post-item\"], [class*=\"UserPostItem\"]");
  if (preferred) {
    return preferred;
  }

  // 链接自身或最近一层带视频链的容器
  const link = node.matches?.("a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id\"]") ? node : node.querySelector?.("a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id\"]");
  if (!link) {
    return node;
  }
  let cur = link.parentElement;
  for (let i = 0; i < 5 && cur; i += 1) {
    const videoLinks = cur.querySelectorAll?.("a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id\"]") || [];
    // 只含当前一条视频链的容器才算卡片，避免整列表根
    if (videoLinks.length === 1) {
      return cur;
    }
    if (videoLinks.length > 3) {
      break;
    }
    cur = cur.parentElement;
  }
  return link;
}

/**
 * DOM：卡片/链接是否带置顶角标。
 * @param {Element|null} node
 */
function isDouyinProfileWorkPinnedNode(node) {
  if (!node) {
    return false;
  }
  try {
    const card = resolveDouyinProfileWorkCardRoot(node) || node;
    const aria = [card.getAttribute?.("aria-label"), node.getAttribute?.("aria-label"), card.getAttribute?.("title")].filter(Boolean).join(" ");
    if (isDouyinPinnedBadgeText(aria) || /置顶/.test(String(aria).replace(/\s+/g, "")) && String(aria).length <= 24) {
      return true;
    }

    // 仅信任带「置顶」文案的角标；不要用空文本 class / data-e2e*="top" 误杀
    const hintEls = Array.from(card.querySelectorAll?.("[class*=\"top-tag\"], [class*=\"TopTag\"], [class*=\"pin-tag\"], [class*=\"PinTag\"], [class*=\"topTag\"]") || []);
    for (const hintEl of hintEls) {
      if (isDouyinPinnedBadgeText(hintEl.textContent)) {
        return true;
      }
    }
    const badges = Array.from(card.querySelectorAll?.("span, div, p, i, label, em, strong, b") || []);
    for (const el of badges) {
      // 只看短节点，避免扫到整卡大段文案
      const t = String(el.textContent || "").replace(/\s+/g, "").trim();
      if (t.length > 8) {
        continue;
      }
      if (isDouyinPinnedBadgeText(t)) {
        return true;
      }
    }
    const lines = String(card.innerText || "").split("\n").map(line => line.replace(/\s+/g, "").trim()).filter(Boolean).slice(0, 8);
    if (lines.some(line => isDouyinPinnedBadgeText(line))) {
      return true;
    }
    return false;
  } catch (_) {
    return false;
  }
}

/**
 * 排除置顶开启时：发布时间像多年前的「绝对日期」，高度疑似漏检置顶，不应作为 N 天窗口截止。
 */
function looksLikeMissedPinnedPublishTime(publishTimeMs, publishTimeText = "", withinDays = 3, nowMs = Date.now()) {
  const ms = Number(publishTimeMs) || 0;
  if (!(ms > 0)) {
    return false;
  }
  const now = Number(nowMs) > 0 ? Number(nowMs) : Date.now();
  const days = Math.max(1, Number(withinDays) || 3);
  const ageDays = (now - ms) / 86400000;
  const text = String(publishTimeText || "");
  if (/\d{4}\s*年/.test(text)) {
    return true;
  }
  return ageDays > Math.max(30, days * 5);
}

/** 页内注入用：函数声明原文。本文件禁止混淆，否则兄弟调用会变成 _0x 未定义。 */
function getDouyinProfileWorkPinnedPageSource() {
  return [isDouyinPinnedBadgeText, isDouyinAwemePinnedFlag, resolveDouyinProfileWorkCardRoot, isDouyinProfileWorkPinnedNode].map(fn => Function.prototype.toString.call(fn)).join("\n");
}
module.exports = {
  isDouyinPinnedBadgeText,
  isDouyinAwemePinnedFlag,
  resolveDouyinProfileWorkCardRoot,
  isDouyinProfileWorkPinnedNode,
  looksLikeMissedPinnedPublishTime,
  getDouyinProfileWorkPinnedPageSource
};
'use strict';

/**
 * 抖音作品发布时间（详情页）。
 * 1) 固定控件：.video-create-time > span.time（如「· 14小时前」）
 * 2) 控件很小，可见高度按 4px 计
 * 3) 页内注入请用 getDouyinVideoPublishTimePageSource()。本文件禁止混淆。
 */
function extractDouyinAuthorLinePublishTimeText(text) {
  const raw = String(text || "").replace(/\s+/g, " ").trim();
  if (!raw) {
    return "";
  }
  const relativeOnlyRe = /(刚刚|刚才|昨天|前天|\d+\s*(?:秒|分钟|小时|天|周|个?月|年)前)/;
  const absoluteDateRe = /(20\d{2})\s*[./年-]\s*(1[0-2]|0?[1-9])\s*[./月-]\s*(3[01]|[12]\d|0?[1-9])\s*日?/;
  const shortDateRe = /(?<!\d)(1[0-2]|0?[1-9])\s*月\s*(3[01]|[12]\d|0?[1-9])\s*日?|(?<!\d)(1[0-2]|0?[1-9])-(3[01]|[12]\d|0?[1-9])(?!\d|[万亿wWkKxX])/;
  const afterDot = raw.match(/[·•･・]\s*((?:刚刚|刚才|昨天|前天|\d+\s*(?:秒|分钟|小时|天|周|个?月|年)前|20\d{2}\s*[./年-]\s*(?:1[0-2]|0?[1-9])\s*[./月-]\s*(?:3[01]|[12]\d|0?[1-9])\s*日?|(?<!\d)(?:1[0-2]|0?[1-9])\s*月\s*(?:3[01]|[12]\d|0?[1-9])\s*日?|(?<!\d)(?:1[0-2]|0?[1-9])-(?:3[01]|[12]\d|0?[1-9]))(?:\s*\d{1,2}:\d{2})?)/);
  if (afterDot) {
    const seg = String(afterDot[1] || "").trim();
    const rel = seg.match(relativeOnlyRe);
    if (rel) {
      return String(rel[1] || rel[0]).replace(/\s+/g, "");
    }
    const abs = seg.match(absoluteDateRe) || seg.match(shortDateRe);
    if (abs) {
      return String(abs[0]).replace(/\s+/g, "");
    }
  }
  const afterPublish = raw.match(/(?:发布于|发布时间)[：:\s]*((?:刚刚|刚才|昨天|前天|\d+\s*(?:秒|分钟|小时|天|周|个?月|年)前|20\d{2}\s*[./年-]\s*(?:1[0-2]|0?[1-9])\s*[./月-]\s*(?:3[01]|[12]\d|0?[1-9])\s*日?|(?<!\d)(?:1[0-2]|0?[1-9])\s*月\s*(?:3[01]|[12]\d|0?[1-9])\s*日?|(?<!\d)(?:1[0-2]|0?[1-9])-(?:3[01]|[12]\d|0?[1-9])))/);
  if (afterPublish) {
    const seg = String(afterPublish[1] || "").trim();
    const rel = seg.match(relativeOnlyRe);
    if (rel) {
      return String(rel[1] || rel[0]).replace(/\s+/g, "");
    }
    const abs = seg.match(absoluteDateRe) || seg.match(shortDateRe);
    if (abs) {
      return String(abs[0]).replace(/\s+/g, "");
    }
  }
  const rel = raw.match(relativeOnlyRe);
  if (rel) {
    return String(rel[1] || rel[0]).replace(/\s+/g, "");
  }
  if (raw.length <= 80) {
    const abs = raw.match(absoluteDateRe) || raw.match(shortDateRe);
    if (abs) {
      const token = String(abs[0]).replace(/\s+/g, "");
      if (!/[万亿wWkKxX]/.test(token)) {
        return token;
      }
    }
  }
  return "";
}
function parseDouyinRelativePublishTimeMs(text, nowMs = Date.now()) {
  const now = Number(nowMs) > 0 ? Number(nowMs) : Date.now();
  const label = extractDouyinAuthorLinePublishTimeText(text) || String(text || "").replace(/\s+/g, " ").trim();
  if (!label) {
    return 0;
  }
  if (/刚刚|刚才/.test(label)) {
    return now;
  }
  let m = label.match(/(\d{1,3})\s*秒前/);
  if (m) {
    return now - Number(m[1]) * 1000;
  }
  m = label.match(/(\d{1,3})\s*分钟前/);
  if (m) {
    return now - Number(m[1]) * 60 * 1000;
  }
  m = label.match(/(\d{1,3})\s*小时前/);
  if (m) {
    return now - Number(m[1]) * 3600 * 1000;
  }
  if (/昨天/.test(label)) {
    return now - 86400000;
  }
  if (/前天/.test(label)) {
    return now - 172800000;
  }
  m = label.match(/(\d{1,3})\s*天前/);
  if (m) {
    return now - Number(m[1]) * 24 * 3600 * 1000;
  }
  m = label.match(/(\d{1,2})\s*周前/);
  if (m) {
    return now - Number(m[1]) * 7 * 24 * 3600 * 1000;
  }
  m = label.match(/(\d{1,2})\s*个?月前/);
  if (m) {
    return now - Number(m[1]) * 30 * 24 * 3600 * 1000;
  }
  m = label.match(/(\d{1,2})\s*年前/);
  if (m) {
    return now - Number(m[1]) * 365 * 24 * 3600 * 1000;
  }
  m = label.match(/(20\d{2})[./年-](\d{1,2})[./月-](\d{1,2})/);
  if (m) {
    const t = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])).getTime();
    if (Number.isFinite(t)) {
      return t;
    } else {
      return 0;
    }
  }
  m = label.match(/(?<!\d)(\d{1,2})月(\d{1,2})日?/);
  if (m) {
    const y = new Date(now).getFullYear();
    let t = new Date(y, Number(m[1]) - 1, Number(m[2])).getTime();
    if (Number.isFinite(t) && t > now) {
      t = new Date(y - 1, Number(m[1]) - 1, Number(m[2])).getTime();
    }
    if (Number.isFinite(t)) {
      return t;
    } else {
      return 0;
    }
  }
  m = label.match(/(?<!\d)(\d{1,2})-(\d{1,2})(?!\d)/);
  if (m) {
    const y = new Date(now).getFullYear();
    let t = new Date(y, Number(m[1]) - 1, Number(m[2])).getTime();
    if (Number.isFinite(t) && t > now) {
      t = new Date(y - 1, Number(m[1]) - 1, Number(m[2])).getTime();
    }
    if (Number.isFinite(t)) {
      return t;
    } else {
      return 0;
    }
  }
  return 0;
}
function pickDouyinClosestToViewportCenter(elements, options = {}) {
  const list = Array.from(elements || []).filter(Boolean);
  if (!list.length) {
    return null;
  }
  const minH = Number.isFinite(Number(options.minVisibleH)) ? Number(options.minVisibleH) : 40;
  const minW = Number.isFinite(Number(options.minVisibleW)) ? Number(options.minVisibleW) : 20;
  const vHeight = typeof window !== "undefined" && window.innerHeight ? window.innerHeight : 900;
  const vWidth = typeof window !== "undefined" && window.innerWidth ? window.innerWidth : 1280;
  const centerY = vHeight / 2;
  let best = null;
  let bestDist = Infinity;
  let hasRect = false;
  for (const el of list) {
    let rect = null;
    try {
      if (el && typeof el.getBoundingClientRect === "function") {
        rect = el.getBoundingClientRect();
      }
    } catch (_) {
      rect = null;
    }
    if (!rect) {
      continue;
    }
    hasRect = true;
    const w = Number(rect.width) || 0;
    const h = Number(rect.height) || 0;
    if (w <= 0 && h <= 0) {
      continue;
    }
    const top = Number(rect.top) || 0;
    const bottom = Number(rect.bottom) || top + h;
    const left = Number(rect.left) || 0;
    const right = Number(rect.right) || left + w;
    const visibleH = Math.min(bottom, vHeight) - Math.max(top, 0);
    const visibleW = Math.min(right, vWidth) - Math.max(left, 0);
    if (visibleH < minH || visibleW < minW) {
      continue;
    }
    const dist = Math.abs(top + h / 2 - centerY);
    if (dist < bestDist) {
      bestDist = dist;
      best = el;
    }
  }
  if (best) {
    return best;
  }
  if (!hasRect) {
    return list[0];
  }
  return null;
}
function isDouyinCommentNode(el) {
  return !!el && !!el.closest && !!el.closest("[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], [class*=\"comment-item\"], [class*=\"CommentItem\"], [class*=\"reply-item\"]");
}
function collectDouyinCreateTimeWidgets(host) {
  if (!host || !host.querySelectorAll) {
    return [];
  }
  const seen = new Set();
  const out = [];
  const selectors = [".video-create-time .time", ".video-create-time", "[data-e2e=\"video-create-time\"]"];
  for (const sel of selectors) {
    let nodes = [];
    try {
      nodes = Array.from(host.querySelectorAll(sel) || []);
    } catch (_) {
      nodes = [];
    }
    for (const el of nodes) {
      if (!el || seen.has(el) || isDouyinCommentNode(el)) {
        continue;
      }
      seen.add(el);
      out.push(el);
    }
  }
  return out;
}
function toPublishTimeHit(text, source, nowMs) {
  const publishTimeText = extractDouyinAuthorLinePublishTimeText(text);
  if (!publishTimeText) {
    return null;
  }
  const publishTimeMs = parseDouyinRelativePublishTimeMs(publishTimeText, nowMs);
  if (!(publishTimeMs > 0)) {
    return null;
  }
  return {
    publishTimeMs,
    publishTimeText,
    source
  };
}
function buildRejectPublishTimeSet(options = {}) {
  const rejectSet = new Set();
  const add = value => {
    if (Array.isArray(value)) {
      for (const item of value) {
        add(item);
      }
      return;
    }
    const token = String(value || "").replace(/\s+/g, "").trim();
    if (token) {
      rejectSet.add(token);
    }
  };
  add(options.rejectPublishTimeText);
  add(options.rejectPublishTimeTexts);
  return rejectSet;
}

/** 只读当前可见的 .video-create-time 文案，供切条后等待控件刷新。 */
function readDouyinVideoCreateTimeWidgetText(root = document) {
  const doc = root && root.querySelectorAll ? root : document;
  const nodes = collectDouyinCreateTimeWidgets(doc);
  const picked = pickDouyinClosestToViewportCenter(nodes, {
    minVisibleH: 4,
    minVisibleW: 4
  }) || nodes[0];
  if (!picked) {
    return "";
  }
  return extractDouyinAuthorLinePublishTimeText(picked.innerText || picked.textContent || "");
}

/**
 * 优先固定控件；控件全是残留时再兜底信息区 / 作者链。
 * @param {ParentNode} [root]
 * @param {{ rejectPublishTimeText?: string, rejectPublishTimeTexts?: string[] }} [options]
 */
function scrapeDouyinVideoPublishTimeNearAuthor(root = document, options = {}) {
  const nowMs = Date.now();
  const rejectSet = buildRejectPublishTimeSet(options);
  const empty = {
    publishTimeMs: 0,
    publishTimeText: "",
    source: ""
  };
  const accept = hit => {
    if (!hit) {
      return null;
    }
    if (rejectSet.has(String(hit.publishTimeText).replace(/\s+/g, ""))) {
      return null;
    }
    return hit;
  };
  const doc = root && root.querySelectorAll ? root : document;
  const timeWidgets = collectDouyinCreateTimeWidgets(doc);
  const pickedTime = pickDouyinClosestToViewportCenter(timeWidgets, {
    minVisibleH: 4,
    minVisibleW: 4
  });
  const orderedTime = pickedTime ? [pickedTime, ...timeWidgets.filter(el => el !== pickedTime)] : timeWidgets;
  for (const el of orderedTime) {
    const hit = accept(toPublishTimeHit(el.innerText || el.textContent || "", "dom-video-create-time", nowMs));
    if (hit) {
      return hit;
    }
  }
  const infoNodes = Array.from(doc.querySelectorAll("[data-e2e=\"video-info\"], .video-info-detail, [data-e2e=\"feed-video-nickname\"]") || []);
  const centerInfo = pickDouyinClosestToViewportCenter(infoNodes) || infoNodes.find(el => !isDouyinCommentNode(el)) || null;
  if (centerInfo && !isDouyinCommentNode(centerInfo)) {
    const raw = String(centerInfo.innerText || centerInfo.textContent || "").replace(/\s+/g, " ").trim();
    if (raw && raw.length <= 220) {
      const hit = accept(toPublishTimeHit(raw, "dom-video-info", nowMs));
      if (hit) {
        return hit;
      }
    }
  }
  const links = Array.from(doc.querySelectorAll("a[href*=\"/user/\"]") || []);
  for (const link of links) {
    if (isDouyinCommentNode(link)) {
      continue;
    }
    if (String(link.href || link.getAttribute?.("href") || "").includes("/user/self")) {
      continue;
    }
    let node = link;
    for (let depth = 0; depth < 4 && node; depth += 1) {
      if (isDouyinCommentNode(node)) {
        break;
      }
      const raw = String(node.innerText || node.textContent || "").replace(/\s+/g, " ").trim();
      if (raw && raw.length <= 160) {
        const source = depth === 0 ? "dom-author-link" : `dom-author-ancestor-${depth}`;
        const hit = accept(toPublishTimeHit(raw, source, nowMs));
        if (hit) {
          return hit;
        }
      }
      node = node.parentElement;
    }
  }
  return empty;
}
function buildDouyinVideoCreateTimeWidgetReadExpression() {
  return `(() => {
    ${getDouyinVideoPublishTimePageSource()}
    try {
      return readDouyinVideoCreateTimeWidgetText(document) || '';
    } catch (e) {
      return '';
    }
  })()`;
}
function buildDouyinVideoPublishTimeScrapeExpression(options = {}) {
  const rejectPublishTimeTexts = [].concat(options.rejectPublishTimeText || "").concat(Array.isArray(options.rejectPublishTimeTexts) ? options.rejectPublishTimeTexts : []).map(item => String(item || "")).filter(item => item.trim());
  return `(() => {
    ${getDouyinVideoPublishTimePageSource()}
    try {
      return scrapeDouyinVideoPublishTimeNearAuthor(document, {
        rejectPublishTimeTexts: ${JSON.stringify(rejectPublishTimeTexts)},
      });
    } catch (e) {
      return {
        publishTimeMs: 0,
        publishTimeText: '',
        source: '',
        error: String(e && e.message || e),
      };
    }
  })()`;
}

/** 页内注入用：函数声明原文。本文件禁止混淆，否则兄弟调用会变成 _0x 未定义。 */
function getDouyinVideoPublishTimePageSource() {
  return [extractDouyinAuthorLinePublishTimeText, parseDouyinRelativePublishTimeMs, pickDouyinClosestToViewportCenter, isDouyinCommentNode, collectDouyinCreateTimeWidgets, toPublishTimeHit, buildRejectPublishTimeSet, scrapeDouyinVideoPublishTimeNearAuthor, readDouyinVideoCreateTimeWidgetText].map(fn => Function.prototype.toString.call(fn)).join("\n");
}
module.exports = {
  extractDouyinAuthorLinePublishTimeText,
  parseDouyinRelativePublishTimeMs,
  pickDouyinClosestToViewportCenter,
  scrapeDouyinVideoPublishTimeNearAuthor,
  readDouyinVideoCreateTimeWidgetText,
  buildDouyinVideoCreateTimeWidgetReadExpression,
  buildDouyinVideoPublishTimeScrapeExpression,
  getDouyinVideoPublishTimePageSource
};
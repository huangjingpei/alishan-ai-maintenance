'use strict';

const {
  getDouyinAuthorProfileKey,
  normalizeDouyinAuthorUrl
} = require("../shared/douyinAuthorUrl");
const {
  resolveDouyinShareUrl
} = require("../shared/resolveDouyinShareUrl");
const {
  BLOGGER_WORK_SELECT_COUNT,
  normalizeBloggerWorkSelectMode,
  normalizeBloggerWorkCount,
  normalizeBloggerPublishWithinDays,
  selectBloggerProfileWorks
} = require("../shared/entityBloggerProfileSelect");
const {
  getDouyinVideoPublishTimePageSource
} = require("../shared/douyinVideoPublishTime");
const {
  getDouyinProfileWorkPinnedPageSource
} = require("../shared/douyinProfileWorkPinned");
function sleep(arg1) {
  return new Promise(arg12 => setTimeout(arg12, arg1));
}
function extractSecUidFromProfileUrl(arg1) {
  const result = getDouyinAuthorProfileKey(arg1);
  return result || "";
}
async function resolveBloggerProfileUrl(arg1) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return "";
  }
  const result2 = normalizeDouyinAuthorUrl(result, {
    preserveSearch: false
  });
  if (result2) {
    return result2;
  }
  if (!/v\.douyin\.com|iesdouyin\.com\/share/i.test(result)) {
    return "";
  }
  try {
    const result2 = await resolveDouyinShareUrl(result);
    return normalizeDouyinAuthorUrl(result2, {
      preserveSearch: false
    }) || "";
  } catch (error) {
    return "";
  }
}
async function resolveBloggerProfileUrls(arg1) {
  const value = Array.isArray(arg1) ? arg1.map(arg1 => arg1 || "").map(arg1 => String(arg1).trim()).filter(Boolean) : String(arg1 || "").split(/[\n,，]+/).map(arg1 => arg1.trim()).filter(Boolean);
  const list = [];
  const set = new Set();
  for (const item of value) {
    const result = await resolveBloggerProfileUrl(item);
    if (!result) {
      continue;
    }
    const local = extractSecUidFromProfileUrl(result) || result;
    if (!local || set.has(local)) {
      continue;
    }
    set.add(local);
    list.push({
      url: result,
      secUid: extractSecUidFromProfileUrl(result)
    });
  }
  return list;
}
function buildDomWorksScrapeScript({
  maxWorks: maxWorks,
  filterPinned: filterPinned,
  scrollRounds: scrollRounds,
  withinDays = 0
}) {
  return "\n    (async () => {\n      try {\n      const maxWorks = " + Math.max(1, Math.min(100, Number(maxWorks) || 30)) + ";\n      const filterPinned = " + (filterPinned === true ? "true" : "false") + ";\n      const scrollRounds = " + Math.max(0, Math.min(20, Number(scrollRounds) || 4)) + ";\n      const withinDays = " + Math.max(0, Math.floor(Number(withinDays) || 0)) + ";\n      const nowMs = Date.now();\n      // 滚动截止：相对 now 的 N×24h（与筛选口径一致）\n      const cutoffMs = withinDays > 0 ? nowMs - withinDays * 24 * 60 * 60 * 1000 : 0;\n      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));\n\n      const extractAwemeId = (hrefOrText) => {\n        const s = String(hrefOrText || '');\n        const m = s.match(/\\/(?:video|note)\\/(\\d{10,})/i)\n          || s.match(/[?&](?:modal_id|aweme_id|vid)=(\\d{10,})/i)\n          || s.match(/[\"'](?:aweme_id|awemeId|group_id|groupId|video_id|videoId)[\"']\\s*[:=]\\s*[\"']?(\\d{10,})/i)\n          || s.match(/\\b(?:aweme[_-]?id|group[_-]?id|video[_-]?id)[=:]\\s*(\\d{10,})/i);\n        return m?.[1] || '';\n      };\n      const normalizeWorkUrl = (href, awemeId = '') => {\n        const id = String(awemeId || extractAwemeId(href) || '').trim();\n        if (!id) return '';\n        if (/\\/note\\//i.test(String(href || ''))) return 'https://www.douyin.com/note/' + id;\n        return 'https://www.douyin.com/video/' + id;\n      };\n      " + getDouyinProfileWorkPinnedPageSource() + "\n      " + getDouyinVideoPublishTimePageSource() + "\n      const isPinnedNode = (node) => {\n        try { return isDouyinProfileWorkPinnedNode(node); } catch (_) { return false; }\n      };\n      const readAuthorName = () => {\n        try {\n          const el = document.querySelector('[data-e2e=\"user-info\"] h1, [data-e2e=\"user-title\"], h1');\n          const name = String(el?.textContent || '').trim().replace(/^@+/, '');\n          if (name && name.length < 40) return name;\n        } catch (_) { /* ignore */ }\n        return '';\n      };\n      const ensureWorksTab = async () => {\n        try {\n          if (typeof ensureProfileWorksTab === 'function') {\n            await ensureProfileWorksTab('entity_blogger_profile');\n            return;\n          }\n        } catch (_) { /* fall through */ }\n        try {\n          const tabs = Array.from(document.querySelectorAll('div, span, p, a, button'))\n            .filter((el) => {\n              const text = String(el.innerText || '').trim().replace(/\\s+/g, '');\n              return text === '作品' || /^作品\\d+$/.test(text);\n            })\n            .slice(0, 8);\n          const worksTab = tabs.find((t) => String(t.innerText || '').trim() === '作品') || tabs[0];\n          if (!worksTab) return;\n          const selected = worksTab.getAttribute?.('aria-selected') === 'true'\n            || /active|selected|current/i.test(String(worksTab.className || ''));\n          if (!selected) {\n            worksTab.click?.();\n            await sleep(900);\n          }\n        } catch (_) { /* ignore */ }\n      };\n      const resolveListRoot = () => {\n        try {\n          if (typeof getProfilePostListRoot === 'function') {\n            const root = getProfilePostListRoot();\n            if (root) return root;\n          }\n        } catch (_) { /* ignore */ }\n        return document.querySelector('div[data-e2e=user-post-list], div[data-e2e=\"user-post-list\"]')\n          || document.querySelector('[data-e2e=\"user-post-container\"]')\n          || document.querySelector('#douyin-right-container')\n          || document.querySelector('main')\n          || document.body;\n      };\n      // 对齐监控：后台 BrowserView 不用 isVisibleElement，否则常被滤光成 0\n      const findWorkCardNodes = () => {\n        const out = [];\n        const seen = new Set();\n        const push = (el) => {\n          if (!el || out.length >= Math.max(maxWorks * 3, 40)) return;\n          const key = el;\n          if (seen.has(key)) return;\n          seen.add(key);\n          out.push(el);\n        };\n        const root = resolveListRoot();\n        const selectors = [\n          'a[href*=\"/video/\"]',\n          'a[href*=\"/note/\"]',\n          'a[href*=\"modal_id\"]',\n          '[data-e2e=\"user-post-item\"]',\n          '[data-e2e=user-post-item]',\n          'ul[data-e2e=scroll-list] > li',\n          'ul[data-e2e=\"scroll-list\"] > li',\n          '[data-e2e=\"user-post-list\"] li',\n          '[data-e2e=user-post-list] li',\n          '[role=\"listitem\"]',\n        ];\n        for (const sel of selectors) {\n          try {\n            Array.from(root.querySelectorAll?.(sel) || []).forEach(push);\n          } catch (_) { /* ignore */ }\n        }\n        // 共用找卡仅作补充；忽略可见性为空的结果\n        try {\n          if (typeof findProfileVideoCards === 'function') {\n            const shared = findProfileVideoCards({ ignoreNoWorksGuard: true }) || [];\n            shared.forEach(push);\n          }\n        } catch (_) { /* ignore */ }\n        return out;\n      };\n      const extractIdFromNode = (node) => {\n        if (!node) return '';\n        const link = node.matches?.('a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id\"]')\n          ? node\n          : node.querySelector?.('a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id\"]');\n        const href = String(link?.href || link?.getAttribute?.('href') || '');\n        let id = extractAwemeId(href);\n        if (id) return id;\n        const attrs = [\n          node.getAttribute?.('data-e2e-aweme-id'),\n          node.getAttribute?.('data-aweme-id'),\n          node.getAttribute?.('data-video-id'),\n          node.getAttribute?.('data-group-id'),\n          link?.getAttribute?.('data-e2e-aweme-id'),\n          link?.getAttribute?.('data-aweme-id'),\n        ];\n        for (const a of attrs) {\n          id = extractAwemeId(a);\n          if (id) return id;\n        }\n        try {\n          const htmlSlice = String(node.outerHTML || '').slice(0, 1200);\n          id = extractAwemeId(htmlSlice);\n          if (id) return id;\n        } catch (_) { /* ignore */ }\n        return '';\n      };\n      const collectOnce = () => {\n        const works = [];\n        const seen = new Set();\n        let oldestKnownMs = 0;\n        let cardsFound = 0;\n        const pushNode = (node, index) => {\n          if (works.length >= maxWorks) return;\n          cardsFound += 1;\n          // 先收录再标记置顶；禁止在收集阶段因误判置顶导致 0 条\n          // 禁止裸 a[href]：主页卡常先出现 /user/ 头像链，会误吸导致整卡丢弃\n          const link = node?.matches?.('a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id\"]')\n            ? node\n            : node?.querySelector?.('a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id\"]');\n          const href = String(link?.href || link?.getAttribute?.('href') || '');\n          const awemeId = extractAwemeId(href) || extractIdFromNode(node);\n          const url = normalizeWorkUrl(href, awemeId);\n          if (!url || !awemeId || seen.has(awemeId)) return;\n          const card = (typeof resolveDouyinProfileWorkCardRoot === 'function'\n            ? resolveDouyinProfileWorkCardRoot(link || node)\n            : null)\n            || link?.closest?.('[data-e2e=\"user-post-item\"], [data-e2e=user-post-item]')\n            || link\n            || node;\n          const rawText = String(card?.innerText || link?.getAttribute?.('aria-label') || '');\n          let createTime = 0;\n          try {\n            const publishTimeText = extractDouyinAuthorLinePublishTimeText(rawText);\n            createTime = publishTimeText ? parseDouyinRelativePublishTimeMs(publishTimeText, nowMs) : 0;\n          } catch (_) { createTime = 0; }\n          if (createTime > 0) {\n            oldestKnownMs = oldestKnownMs > 0 ? Math.min(oldestKnownMs, createTime) : createTime;\n          }\n          const imgAlt = (link || node)?.querySelector?.('img[alt]')?.getAttribute('alt') || '';\n          const title = String(\n            link?.getAttribute?.('aria-label')\n            || link?.getAttribute?.('title')\n            || imgAlt\n            || rawText\n            || '',\n          )\n            .split('\\n')\n            .map((line) => line.trim())\n            .filter(Boolean)\n            .find((line) => !/^\\d+$/.test(line) && !/^(赞|评论|分享|置顶)$/.test(line))\n            || ('作品 ' + (index + 1));\n          seen.add(awemeId);\n          works.push({\n            url,\n            awemeId,\n            title: title.replace(/\\s+/g, ' ').slice(0, 120),\n            authorName: '',\n            authorSecUid: '',\n            createTime,\n            pinned: isPinnedNode(link || node),\n            rank: works.length + 1,\n            source: 'author_profile_dom',\n          });\n        };\n\n        findWorkCardNodes().forEach((card, index) => pushNode(card, index));\n        return { works, oldestKnownMs, cardsFound };\n      };\n\n      const scrollMore = () => {\n        try {\n          const list = resolveListRoot()\n            || document.querySelector('[data-e2e=\"scroll-list\"], [data-e2e=scroll-list]')\n            || document.scrollingElement\n            || document.documentElement;\n          list?.querySelector?.('[data-e2e=scroll-list], [data-e2e=\"scroll-list\"]')?.scrollBy?.(0, 720);\n          if (typeof list?.scrollBy === 'function') list.scrollBy(0, 720);\n          else if (list) list.scrollTop = (list.scrollTop || 0) + 720;\n          window.scrollBy?.(0, 560);\n        } catch (_) { /* ignore */ }\n      };\n\n      await ensureWorksTab();\n\n      // 等作品区挂载（后台视图加载慢，多等几轮）\n      let lastCardsFound = 0;\n      for (let i = 0; i < 28; i += 1) {\n        const probe = collectOnce();\n        lastCardsFound = probe.cardsFound || 0;\n        if (probe.works.length > 0) break;\n        if (i === 8 || i === 16) await ensureWorksTab();\n        await sleep(400);\n      }\n\n      const collectCreateTimeMap = () => {\n        const map = new Map();\n        const pinIds = new Set();\n        const pushAweme = (aweme) => {\n          if (!aweme || typeof aweme !== 'object') return;\n          const id = String(\n            aweme.aweme_id || aweme.awemeId || aweme.group_id || aweme.id || '',\n          ).trim();\n          if (!/^\\d{10,}$/.test(id)) return;\n          if (isDouyinAwemePinnedFlag(aweme)) pinIds.add(id);\n          if (map.has(id)) return;\n          let raw = Number(aweme.create_time ?? aweme.createTime ?? 0);\n          if (!Number.isFinite(raw) || raw <= 0) return;\n          if (raw < 1e12) raw *= 1000;\n          map.set(id, raw);\n        };\n        const walk = (value, depth = 0) => {\n          if (!value || depth > 8) return;\n          if (typeof value === 'string') {\n            const t = value.trim();\n            if (t && (t[0] === '{' || t[0] === '[')) {\n              try { walk(JSON.parse(t), depth + 1); } catch (_) { /* ignore */ }\n            }\n            return;\n          }\n          if (Array.isArray(value)) {\n            value.forEach((item) => {\n              if (item && (item.aweme_id || item.awemeId || item.create_time || item.createTime)) {\n                pushAweme(item);\n              } else {\n                walk(item, depth + 1);\n              }\n            });\n            return;\n          }\n          if (typeof value === 'object') {\n            if (value.aweme_id || value.awemeId) pushAweme(value);\n            const list = value.aweme_list || value.awemeList;\n            if (list) walk(list, depth + 1);\n            ['data', 'user', 'post_list', 'postList', 'user_post', 'userPost'].forEach((k) => {\n              if (value[k] != null) walk(value[k], depth + 1);\n            });\n          }\n        };\n        try {\n          const scripts = Array.from(document.querySelectorAll('script'));\n          for (const el of scripts) {\n            const text = String(el.textContent || '');\n            if (!/aweme_list|create_time|aweme_id/.test(text)) continue;\n            const matched = text.match(/\\{[\\s\\S]{20,500000}?\\}/g) || [];\n            matched.slice(0, 8).forEach((chunk) => walk(chunk, 0));\n          }\n        } catch (_) { /* ignore */ }\n        try {\n          [\n            window.__INIT_PROPS__,\n            window.__INITIAL_STATE__,\n            window.RENDER_DATA,\n            window._ROUTER_DATA,\n          ].forEach((blob) => walk(blob, 0));\n        } catch (_) { /* ignore */ }\n        return { timeMap: map, pinIds };\n      };\n\n      let result = collectOnce();\n      lastCardsFound = Math.max(lastCardsFound, result.cardsFound || 0);\n      let stagnant = 0;\n      for (let i = 0; i < scrollRounds; i += 1) {\n        if (result.works.length >= maxWorks) break;\n        // 天数模式：已识别到早于窗口的作品则可停（列表按新→旧）\n        if (withinDays > 0 && result.oldestKnownMs > 0 && result.oldestKnownMs < cutoffMs) break;\n        const before = result.works.length;\n        scrollMore();\n        await sleep(650);\n        result = collectOnce();\n        lastCardsFound = Math.max(lastCardsFound, result.cardsFound || 0);\n        if (result.works.length <= before) {\n          stagnant += 1;\n          if (stagnant >= 2) break;\n        } else {\n          stagnant = 0;\n        }\n      }\n\n      const { timeMap, pinIds } = collectCreateTimeMap();\n      if (timeMap.size) {\n        result.works.forEach((w) => {\n          if (!w.createTime && timeMap.has(w.awemeId)) {\n            w.createTime = timeMap.get(w.awemeId);\n          }\n        });\n      }\n      if (pinIds && pinIds.size) {\n        result.works.forEach((w) => {\n          if (pinIds.has(w.awemeId)) w.pinned = true;\n        });\n      }\n      const beforePinFilter = result.works.length;\n      const pinnedCount = result.works.filter((w) => w.pinned).length;\n      if (filterPinned) {\n        const kept = result.works.filter((w) => !w.pinned);\n        // 若置顶误判导致全灭，回退保留原列表（避免 DOM 识别 0 条）\n        if (kept.length === 0 && beforePinFilter > 0) {\n          result.works = result.works.map((w) => Object.assign({}, w, { pinned: false }));\n          result.pinFilterFallback = true;\n        } else {\n          result.works = kept;\n        }\n      }\n\n      const authorName = readAuthorName();\n      result.works.forEach((w) => { w.authorName = authorName; });\n      return {\n        success: result.works.length > 0,\n        works: result.works,\n        authorName,\n        source: 'author_profile_dom',\n        diagnostics: {\n          beforePinFilter,\n          pinnedCount,\n          afterPinFilter: result.works.length,\n          pinFilterFallback: !!result.pinFilterFallback,\n          cardsFound: lastCardsFound,\n          hrefLinkCount: Array.from(document.querySelectorAll(\n            'a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id\"]',\n          )).length,\n          path: String(location.pathname || ''),\n        },\n      };\n      } catch (e) {\n        return {\n          success: false,\n          works: [],\n          authorName: '',\n          source: 'author_profile_dom',\n          error: String(e && e.message || e),\n          diagnostics: { scrapeError: String(e && e.message || e) },\n        };\n      }\n    })()\n  ";
}
async function captureBloggerProfileWorks(arg1, {
  profileUrl: profileUrl,
  secUid = "",
  maxWorks = 50,
  filterPinned = true,
  scrollRounds = 4,
  withinDays = 0,
  loadUrl: loadUrl,
  isActive = () => true
} = {}) {
  const result = String(profileUrl || "").trim();
  const result2 = String(secUid || extractSecUidFromProfileUrl(result) || "").trim();
  if (!result || !arg1 || arg1.isDestroyed?.()) {
    return {
      works: [],
      authorName: "",
      secUid: result2,
      hasPostListPayload: false,
      source: "author_profile_dom"
    };
  }
  const result3 = Math.max(1, Math.min(100, Math.floor(Number(maxWorks) || 50)));
  if (typeof loadUrl === "function") {
    await loadUrl(arg1, result);
  }
  if (!isActive()) {
    return {
      works: [],
      authorName: "",
      secUid: result2,
      hasPostListPayload: false,
      source: "author_profile_dom"
    };
  }
  await sleep(2200);
  if (!isActive() || arg1.isDestroyed?.()) {
    return {
      works: [],
      authorName: "",
      secUid: result2,
      hasPostListPayload: false,
      source: "author_profile_dom",
      diagnostics: {
        aborted: true
      }
    };
  }
  let obj = {
    works: [],
    authorName: "",
    success: false,
    diagnostics: {}
  };
  try {
    obj = (await arg1.webContents.executeJavaScript(buildDomWorksScrapeScript({
      maxWorks: result3,
      filterPinned: filterPinned !== false,
      scrollRounds: scrollRounds,
      withinDays: withinDays
    }), true)) || obj;
  } catch (error) {
    obj = {
      works: [],
      authorName: "",
      success: false,
      error: String(error?.message || error || "executeJavaScript failed"),
      diagnostics: {
        scrapeError: String(error?.message || error || "executeJavaScript failed")
      }
    };
  }
  const value = Array.isArray(obj.works) ? obj.works : [];
  const obj2 = {
    ...(obj.diagnostics && typeof obj.diagnostics === "object" ? obj.diagnostics : {})
  };
  if (obj.error && !obj2.scrapeError) {
    obj2.scrapeError = String(obj.error);
  }
  return {
    works: value,
    authorName: String(obj.authorName || "").trim(),
    secUid: result2,
    hasPostListPayload: value.length > 0,
    source: "author_profile_dom",
    diagnostics: obj2
  };
}
function selectWorksForBloggerConfig(arg1, options = {}, arg3 = Date.now()) {
  const result = normalizeBloggerWorkSelectMode(options.bloggerWorkSelectMode);
  const value = options.bloggerExcludePinned !== false;
  const value2 = Array.isArray(arg1) ? arg1.filter(arg1 => arg1 && arg1.awemeId && (!value || !arg1.pinned)) : [];
  return selectBloggerProfileWorks(value2, {
    mode: result,
    count: options.bloggerWorkCount,
    withinDays: options.bloggerPublishWithinDays,
    nowMs: arg3
  });
}
function resolveCaptureMaxWorks(options = {}) {
  const result = normalizeBloggerWorkSelectMode(options.bloggerWorkSelectMode);
  if (result === BLOGGER_WORK_SELECT_COUNT) {
    return Math.min(100, normalizeBloggerWorkCount(options.bloggerWorkCount) + 6);
  }
  const result2 = normalizeBloggerPublishWithinDays(options.bloggerPublishWithinDays);
  return Math.min(100, Math.max(40, result2 * 8));
}
function resolveScrollRounds(options = {}) {
  const result = normalizeBloggerWorkSelectMode(options.bloggerWorkSelectMode);
  if (result === BLOGGER_WORK_SELECT_COUNT) {
    return 3;
  }
  const result2 = normalizeBloggerPublishWithinDays(options.bloggerPublishWithinDays);
  return Math.min(12, Math.max(4, result2 + 2));
}
module.exports = {
  resolveBloggerProfileUrl: resolveBloggerProfileUrl,
  resolveBloggerProfileUrls: resolveBloggerProfileUrls,
  extractSecUidFromProfileUrl: extractSecUidFromProfileUrl,
  captureBloggerProfileWorks: captureBloggerProfileWorks,
  selectWorksForBloggerConfig: selectWorksForBloggerConfig,
  resolveCaptureMaxWorks: resolveCaptureMaxWorks,
  resolveScrollRounds: resolveScrollRounds,
  buildDomWorksScrapeScript: buildDomWorksScrapeScript
};
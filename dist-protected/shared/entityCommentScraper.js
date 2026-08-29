const {
  isDouyinSecondaryCommentNode,
  isDouyinNestedReplyComment
} = require("./douyinCommentReplyGuard");
const {
  formatEntityCommentFilterLogLine
} = require("./entityCommentFilters");
function isVisibleElement(arg1) {
  if (!arg1 || typeof arg1.getBoundingClientRect !== "function") {
    return false;
  }
  try {
    const result = window.getComputedStyle(arg1);
    if (result.display === "none" || result.visibility === "hidden" || parseFloat(result.opacity || "1") <= 0.01) {
      return false;
    }
    const result2 = arg1.getBoundingClientRect();
    return result2.width > 0 && result2.height > 0;
  } catch (error) {
    return false;
  }
}
function normalizeAuthorFilter(options = {}) {
  return {
    nickname: String(options.nickname || "").trim().replace(/^@+/, ""),
    userUrl: String(options.userUrl || "").trim(),
    secUid: String(options.secUid || "").trim(),
    userKey: String(options.userKey || options.secUid || "").trim()
  };
}
function isVideoAuthorComment(options = {}, arg2 = null) {
  if (!arg2) {
    return false;
  }
  const result = String(options.userKey || options.secUid || "").trim();
  const result2 = String(options.userUrl || "").trim();
  const result3 = String(options.nickname || "").trim().replace(/^@+/, "");
  if (arg2.userKey && result && result === arg2.userKey) {
    return true;
  }
  if (arg2.secUid && result && result === arg2.secUid) {
    return true;
  }
  if (arg2.userUrl && result2 && result2 === arg2.userUrl) {
    return true;
  }
  if (!arg2.userKey && !arg2.secUid && !arg2.userUrl && arg2.nickname && result3 && result3 === arg2.nickname) {
    return true;
  }
  return false;
}
function findCommentTabInRoots(arg1, arg2, options = {}) {
  const local = options.isVisibleElement || isVisibleElement;
  const local2 = String(arg2 || "评论").trim() || "评论";
  const list = [];
  for (const item of arg1) {
    if (!item?.querySelectorAll) {
      continue;
    }
    for (const item2 of item.querySelectorAll("div, span, p, button, [role=\"tab\"], a")) {
      if (!local(item2)) {
        continue;
      }
      if ((item2.children?.length || 0) > 8) {
        continue;
      }
      const result = String(item2.textContent || item2.innerText || "").replace(/\s+/g, " ").trim();
      if (!result || result.length >= 24) {
        continue;
      }
      const result2 = result.replace(/\s+/g, "");
      if (result !== local2 && !result.startsWith(local2) && result2 !== local2 && !result2.startsWith(local2) && !/^评论[\d(（]/.test(result2)) {
        continue;
      }
      const result3 = item2.getBoundingClientRect();
      if (result3.height > 64 && result3.width < 80) {
        continue;
      }
      list.push({
        el: item2,
        text: result,
        right: result3.right,
        top: result3.top,
        len: result.length,
        children: item2.children?.length || 0
      });
    }
  }
  if (!list.length) {
    return null;
  }
  list.sort((arg1, arg2) => {
    if (Math.abs(arg1.right - arg2.right) > 48) {
      return arg2.right - arg1.right;
    }
    if (arg1.len !== arg2.len) {
      return arg1.len - arg2.len;
    }
    return arg1.children - arg2.children;
  });
  const value = list[0].el;
  return value.closest?.("button, [role=\"button\"], [role=\"tab\"], a") || value;
}
function findCommentIconInRoots(arg1, options = {}) {
  const local = options.isVisibleElement || isVisibleElement;
  const value = typeof options.getCommentV2String === "function" ? [options.getCommentV2String("openCommentBtns"), options.getCommentV2String("feedCommentIcon"), options.getCommentV2String("videoCommentIcon"), options.getCommentV2String("videoPlayerComment"), options.getCommentV2String("openCommentAria")].filter(Boolean) : [];
  const list = ["[data-e2e=\"feed-comment-icon\"]", "[data-e2e=\"video-comment-icon\"]", "[data-e2e=\"video-player-comment\"]", "[data-e2e=\"comment-icon\"]", ".comment-icon", "[class*=\"comment-icon\"]", "[aria-label*=\"评论\"]"];
  const result = [...new Set([...value, ...list])].join(", ");
  for (const item of arg1) {
    if (!item?.querySelectorAll) {
      continue;
    }
    const result2 = Array.from(item.querySelectorAll(result)).filter(arg1 => local(arg1));
    if (result2.length) {
      return result2[result2.length - 1].closest?.("button, [role=\"button\"]") || result2[result2.length - 1];
    }
  }
  return null;
}
function buildSearchRoots(arg1) {
  const list = [];
  const local = arg1 => {
    if (arg1 && !list.includes(arg1)) {
      list.push(arg1);
    }
  };
  local(arg1);
  try {
    document.querySelectorAll(["[data-e2e=\"video-detail-container\"]", ".modal-video-container", "[class*=\"SearchDetail\"]", "[class*=\"VideoDetail\"]", "[class*=\"note-detail\"]", "[class*=\"NoteDetail\"]", "[role=\"dialog\"]", "[class*=\"player-container\"]"].join(", ")).forEach(arg1 => local(arg1));
  } catch (error) {}
  local(document.body);
  local(document);
  return list;
}
function countCommentSignals(options = {}) {
  let num = 0;
  try {
    num = Number(options.countApiUsers?.() || 0) || 0;
  } catch (error) {}
  let num2 = 0;
  try {
    const local = options.resolveCommentPanelRoot?.(document.body) || document.body;
    if (typeof options.queryCommentItemNodes === "function") {
      num2 = options.queryCommentItemNodes(local).length;
    } else {
      num2 = document.querySelectorAll("[data-e2e=\"comment-item\"], [class*=\"comment-item\"], div[class*=\"CommentItem\"]").length;
    }
  } catch (error) {}
  return {
    api: num,
    nodes: num2,
    ready: num > 0 || num2 > 0
  };
}
function inspectEntityCommentPanel(options = {}) {
  const local = options.isVisibleElement || isVisibleElement;
  let local2 = null;
  try {
    if (typeof options.findCommentPanelRoot === "function") {
      local2 = options.findCommentPanelRoot(document.body) || null;
    }
  } catch (error) {
    local2 = null;
  }
  if (!local2 && typeof options.resolveCommentPanelRoot === "function") {
    try {
      const result = options.resolveCommentPanelRoot(document.body);
      if (result && result !== document.body && result !== document.documentElement && result !== document) {
        local2 = result;
      }
    } catch (error) {}
  }
  const local3 = !!local2 && !!local(local2);
  let num = 0;
  let num2 = 0;
  if (local2 && typeof options.queryCommentItemNodes === "function") {
    try {
      const local3 = options.queryCommentItemNodes(local2) || [];
      num = local3.length;
      num2 = local3.filter(arg1 => local(arg1)).length;
    } catch (error) {}
  }
  let flag = false;
  try {
    if (local2 && typeof options.hasCommentComposerInPanel === "function") {
      flag = !!options.hasCommentComposerInPanel(local2);
    } else if (local2) {
      const local3 = local2.querySelector?.("[contenteditable=\"true\"], textarea, [data-e2e*=\"comment-input\"], [class*=\"DraftEditor\"]");
      flag = !!local3 && !!local(local3);
    }
  } catch (error) {}
  const result = String(document.body?.innerText || "");
  const result2 = /暂无评论|还没有人评论|快来发表评论|说点什么吧/.test(result);
  let local4 = null;
  try {
    if (typeof options.getCommentsTotalCount === "function") {
      const result = options.getCommentsTotalCount(document.body);
      if (result != null && Number.isFinite(result) && result >= 0) {
        local4 = Math.floor(result);
      }
    }
  } catch (error) {}
  let flag2 = false;
  try {
    if (typeof options.isCommentPanelContentLoading === "function") {
      flag2 = !!options.isCommentPanelContentLoading(local2 || document.body);
    }
  } catch (error) {}
  const local5 = local4 != null && local4 > 0 && num2 === 0 && !flag2 && !flag;
  const local6 = local3 && !local5 && (num2 > 0 || flag || flag2 || result2 && (local4 == null || local4 === 0));
  return {
    opened: local6,
    panel: local2,
    panelVisible: local3,
    itemCount: num,
    visibleItemCount: num2,
    hasComposer: flag,
    hasEmptyPlaceholder: result2,
    total: local4,
    loading: flag2,
    badgeOnly: local5,
    empty: !!local6 && num2 === 0 && (!!result2 || local4 === 0)
  };
}
function looksTrulyEmpty(options = {}) {
  const result = inspectEntityCommentPanel(options);
  if (result.opened && result.empty) {
    return true;
  }
  const result2 = countCommentSignals(options);
  if (result2.ready) {
    return false;
  }
  const result3 = String(document.body?.innerText || "");
  const result4 = /暂无评论|还没有人评论|快来发表评论/.test(result3);
  if (!result4) {
    return false;
  }
  const value = typeof options.getCommentsTotalCount === "function" ? options.getCommentsTotalCount(document.body) : null;
  const value2 = typeof options.isCommentPanelContentLoading === "function" ? options.isCommentPanelContentLoading(document.body) : false;
  return !value2 && value === 0;
}
async function clickEntityCommentTarget(arg1, options = {}) {
  if (!arg1) {
    return false;
  }
  const local = options.loopId || "ENTITY_LEADGEN";
  try {
    if (typeof options.simulateHumanClick === "function") {
      await options.simulateHumanClick(arg1, local);
      return true;
    }
  } catch (error) {}
  try {
    arg1.click();
    return true;
  } catch (error) {
    return false;
  }
}
async function openEntityCommentPanel(options = {}) {
  const {
    token: token,
    taskId: taskId,
    scope = document.body,
    waitFn: waitFn,
    logFn: logFn,
    isVisibleElement: isVisibleElement2,
    getCommentTabPrefix: getCommentTabPrefix,
    isCancelled: isCancelled
  } = options;
  const local = isVisibleElement2 || isVisibleElement;
  const value = typeof logFn === "function" ? logFn : () => {};
  const value2 = typeof waitFn === "function" ? waitFn : async arg1 => {
    await new Promise(arg12 => setTimeout(arg12, arg1));
  };
  const local2 = () => typeof isCancelled === "function" ? isCancelled() : false;
  const result = String(typeof location !== "undefined" && location.href || "");
  const result2 = /modal_id=|\/jingxuan|\/video\/|\/note\//.test(result);
  const local3 = () => inspectEntityCommentPanel({
    ...options,
    isVisibleElement: local
  });
  const result3 = Math.max(400, Math.min(3000, Number(options.postTabWaitMs) || 600));
  const result4 = Math.max(500, Math.min(4000, Number(options.postIconWaitMs) || 800));
  const result5 = Math.max(400, Math.min(3000, Number(options.postTabAgainWaitMs) || 500));
  const result6 = Math.max(8, Math.min(40, Number(options.maxInspectRounds) || 14));
  const result7 = Math.max(500, Math.min(2500, Number(options.inspectIntervalMs) || 750));
  const result8 = buildSearchRoots(scope);
  const result9 = local3();
  if (result9.opened && !result2) {
    return {
      opened: true,
      already: true,
      empty: !!result9.empty,
      inspection: result9
    };
  }
  const local4 = typeof getCommentTabPrefix === "function" && getCommentTabPrefix() || "评论";
  const result10 = findCommentTabInRoots(result8, local4, {
    isVisibleElement: local
  });
  if (result10) {
    value(taskId, "切换到评论 Tab「" + String(result10.textContent || "").replace(/\s+/g, " ").trim() + "」…");
    await clickEntityCommentTarget(result10, options);
    if ((await value2(result3)) === false || local2()) {
      return {
        opened: false,
        cancelled: true
      };
    }
  } else if (result2) {
    value(taskId, "未定位到评论 Tab，将尝试评论图标…", "warning");
  }
  if (!local3().opened) {
    const result = findCommentIconInRoots(result8, {
      isVisibleElement: local
    });
    if (result) {
      value(taskId, "展开评论区…");
      await clickEntityCommentTarget(result, options);
      if ((await value2(result4)) === false || local2()) {
        return {
          opened: false,
          cancelled: true
        };
      }
    } else if (!result10) {
      value(taskId, "未找到评论 Tab/图标，稍后仍尝试采集", "warning");
    }
  }
  if (result2 || !local3().opened) {
    const local3 = result10 || findCommentTabInRoots(result8, local4, {
      isVisibleElement: local
    });
    if (local3) {
      if (!result10) {
        value(taskId, "切换到评论 Tab「" + String(local3.textContent || "").replace(/\s+/g, " ").trim() + "」…");
      }
      await clickEntityCommentTarget(local3, options);
      if ((await value2(result5)) === false || local2()) {
        return {
          opened: false,
          cancelled: true
        };
      }
    }
  }
  for (let num = 0; num < result6; num += 1) {
    if (local2()) {
      return {
        opened: false,
        cancelled: true
      };
    }
    const result = local3();
    if (result.opened) {
      return {
        opened: true,
        empty: !!result.empty,
        inspection: result
      };
    }
    if (looksTrulyEmpty(options)) {
      return {
        opened: true,
        empty: true,
        inspection: result
      };
    }
    if ((await value2(result7 + Math.random() * 250)) === false) {
      return {
        opened: false,
        cancelled: true
      };
    }
  }
  const result11 = local3();
  return {
    opened: !!result11.opened,
    empty: !!result11.empty,
    slow: !result11.opened,
    badgeOnly: !!result11.badgeOnly,
    inspection: result11
  };
}
function collectEntityCommentsFromPage(options = {}, arg2 = null, arg3 = null, options2 = {}) {
  const result = normalizeAuthorFilter(arg2 || {});
  const list = [];
  const map = new Map();
  const {
    collectEntityUsersFromApiBuffer: collectEntityUsersFromApiBuffer,
    normalizeDouyinAuthorProfileUrl: normalizeDouyinAuthorProfileUrl,
    buildEntityUserKey: buildEntityUserKey,
    resolveCommentPanelRoot: resolveCommentPanelRoot,
    queryCommentItemNodes: queryCommentItemNodes,
    parseDouyinCommentNode: parseDouyinCommentNode,
    evaluateEntityCommentFilters: evaluateEntityCommentFilters,
    normalizeEntityCommentFilters: normalizeEntityCommentFilters,
    canonicalizeDouyinVideoUrl: canonicalizeDouyinVideoUrl
  } = options;
  const value = typeof canonicalizeDouyinVideoUrl === "function" ? canonicalizeDouyinVideoUrl(options2.sourceVideoUrl || options2.targetVideoUrl || "") || "" : String(options2.sourceVideoUrl || options2.targetVideoUrl || "").trim();
  const result2 = String(options2.sourceVideoTitle || options2.videoTitle || "").replace(/\s+/g, " ").trim();
  const local = arg1 => {
    const result = String(arg1 || "").trim();
    if (!result || result === "未知视频") {
      return true;
    }
    if (/^https?:\/\//i.test(result)) {
      return true;
    }
    if (result.startsWith("直播间：")) {
      return true;
    }
    return false;
  };
  const value2 = typeof normalizeEntityCommentFilters === "function" ? normalizeEntityCommentFilters(arg3 || {}) : null;
  let num = 0;
  const result3 = Object.create(null);
  const set = new Set();
  const list2 = [];
  const local2 = (arg1, arg2) => {
    if (!value2?.active) {
      return;
    }
    const value = Array.isArray(value2.includeKeywords) ? value2.includeKeywords : [];
    if (!value.length && !arg2?.reason) {
      return;
    }
    if (list2.length >= 24) {
      return;
    }
    const flag = !!arg2?.pass;
    const result = String(arg1.nickname || "").trim();
    const result2 = String(arg1.content || arg1.text || "").trim();
    const result3 = String(arg2?.body || "").trim();
    const result4 = value.some(arg1 => result.includes(arg1));
    const result5 = value.some(arg1 => result2.includes(arg1));
    const result6 = value.some(arg1 => result3.includes(arg1));
    const local = result4 || result5 && !result6 || flag && result6 || !flag && !result6;
    const value3 = list2.filter(arg1 => String(arg1).includes("未过筛")).length;
    if (!flag && !local && value3 >= 6) {
      return;
    }
    const value4 = typeof formatEntityCommentFilterLogLine === "function" ? formatEntityCommentFilterLogLine : null;
    list2.push(value4 ? value4(arg1, arg2, value2) : "🔍 筛选@" + result + " 原文「" + result2 + "」 → " + (flag ? "过筛" : "未过筛" + (arg2?.reason ? "（" + arg2.reason + "）" : "")));
  };
  const local3 = arg1 => {
    if (!arg1?.userKey) {
      return;
    }
    set.add(arg1.userKey);
    const value3 = value2?.active && typeof evaluateEntityCommentFilters === "function" ? evaluateEntityCommentFilters(arg1, value2) : {
      pass: true,
      body: String(arg1.content || arg1.text || "").trim()
    };
    if (!value3.pass) {
      num += 1;
      const local = value3?.reason || "已过滤";
      result3[local] = (result3[local] || 0) + 1;
      local2(arg1, value3);
      return;
    }
    local2(arg1, value3);
    const value4 = arg1.userKey;
    const obj = {
      ...arg1,
      videoUrl: (typeof canonicalizeDouyinVideoUrl === "function" ? canonicalizeDouyinVideoUrl(arg1.videoUrl) : "") || arg1.videoUrl || value || "",
      title: (!local(arg1.title) ? String(arg1.title).trim() : "") || (!local(arg1.sourceVideoTitle) ? String(arg1.sourceVideoTitle).trim() : "") || result2 || "",
      sourceVideoTitle: (!local(arg1.sourceVideoTitle) ? String(arg1.sourceVideoTitle).trim() : "") || (!local(arg1.title) ? String(arg1.title).trim() : "") || result2 || ""
    };
    if (map.has(value4)) {
      const result = map.get(value4);
      const local = list[result] || {};
      const local2 = (arg1, arg2) => {
        const result = String(arg1 || "").trim();
        const result2 = String(arg2 || "").trim();
        if (result && result !== "视频评论区潜客") {
          return result;
        }
        return result2 || result;
      };
      list[result] = {
        ...local,
        ...obj,
        content: local2(local.content, obj.content),
        time: local2(local.time, obj.time),
        timeText: local2(local.timeText, obj.timeText),
        ipLocation: local2(local.ipLocation, obj.ipLocation),
        location: local2(local.location, obj.location),
        videoUrl: local2(local.videoUrl, obj.videoUrl) || value || "",
        title: local2(local.title, obj.title) || result2 || "",
        sourceVideoTitle: local2(local.sourceVideoTitle, obj.sourceVideoTitle) || local2(local.title, obj.title) || result2 || "",
        sourceType: "comment",
        entrySource: "entity_comment",
        entryLabel: "线索采集：视频评论区潜客"
      };
      return;
    }
    map.set(value4, list.length);
    list.push({
      ...obj,
      sourceType: "comment",
      entrySource: "entity_comment",
      entryLabel: "线索采集：视频评论区潜客"
    });
  };
  const local4 = (typeof resolveCommentPanelRoot === "function" ? resolveCommentPanelRoot(document.body) : null) || document.body;
  const value3 = typeof queryCommentItemNodes === "function" ? queryCommentItemNodes(local4) : Array.from(local4.querySelectorAll("[data-e2e=\"comment-item\"], [class*=\"comment-item\"], div[class*=\"CommentItem\"]"));
  for (const item of value3) {
    if (isDouyinSecondaryCommentNode(item)) {
      continue;
    }
    let text = "";
    let text2 = "";
    let text3 = "";
    let text4 = "";
    let text5 = "";
    let text6 = "";
    if (typeof parseDouyinCommentNode === "function") {
      const result = parseDouyinCommentNode(item, {
        requireTime: !!(value2?.windowMinutes > 0),
        skipAuthor: true
      });
      if (!result) {
        continue;
      }
      text = String(result.nickname || "").trim().replace(/^@+/, "");
      text2 = typeof normalizeDouyinAuthorProfileUrl === "function" ? normalizeDouyinAuthorProfileUrl(result.userUrl || "") : String(result.userUrl || "");
      text3 = String(result.text || "").trim();
      if (text3 && text && text3.replace(/^@+/, "") === text.replace(/^@+/, "")) {
        text3 = "";
      }
      text4 = String(result.time || "").trim();
      text5 = String(result.timeOriginal || result.time || "").trim();
      text6 = String(result.ipLocation || "").trim();
    } else {
      const local = item.querySelector?.("a[href*=\"/user/\"]");
      if (!local) {
        continue;
      }
      const local2 = local.href || local.getAttribute?.("href") || "";
      text2 = typeof normalizeDouyinAuthorProfileUrl === "function" ? normalizeDouyinAuthorProfileUrl(local2) : local2;
      text = String(local.innerText || local.textContent || "").trim().replace(/^@+/, "");
      const local3 = item.querySelector?.("[class*=\"content\"], [class*=\"text\"], p");
      text3 = String(local3?.innerText || "").trim();
    }
    if (!text2 || !text) {
      continue;
    }
    const value = typeof buildEntityUserKey === "function" ? buildEntityUserKey(text2, text) : text2;
    if (!value) {
      continue;
    }
    if (isVideoAuthorComment({
      userKey: value,
      userUrl: text2,
      nickname: text
    }, result)) {
      continue;
    }
    const result2 = (text4 || text5.replace(/\s*[·•].*$/, "").trim() || "").trim();
    local3({
      nickname: text,
      userUrl: text2,
      userKey: value,
      content: text3 || "视频评论区潜客",
      time: result2,
      timeText: result2,
      ipLocation: text6,
      location: text6
    });
  }
  if (typeof collectEntityUsersFromApiBuffer === "function") {
    for (const item of collectEntityUsersFromApiBuffer("comment") || []) {
      if (!item?.userKey) {
        continue;
      }
      if (item.isReplyComment === true || isDouyinNestedReplyComment(item)) {
        continue;
      }
      if (isVideoAuthorComment(item, result)) {
        continue;
      }
      const local = String(item.content || "").trim() || "视频评论区潜客";
      const result2 = String(item.time || item.timeText || "").trim();
      const local2 = result2.replace(/\s*[·•].*$/, "").trim() || result2;
      const result3 = String(item.ipLocation || item.location || "").trim();
      const obj = {
        ...item,
        content: local,
        time: local2,
        timeText: local2,
        ipLocation: result3,
        location: result3
      };
      if (value2?.active) {
        const value = value2.windowMinutes > 0;
        const local = value2.locationRegions.length > 0 && value2.locationMode === "include";
        if (value && !obj.time || local && !obj.ipLocation) {
          continue;
        }
      }
      local3(obj);
    }
  }
  list.__entityCommentFilterStats = {
    rejected: num,
    kept: list.length,
    scanned: set.size,
    reasons: result3,
    includeKeywords: value2?.includeKeywords || [],
    samples: list2
  };
  return list;
}
function resolveEntityCommentEmptyTolerance({
  pageTotal = null,
  scannedCommentCount = 0,
  collectedCount = 0,
  filtersActive = false,
  getScrapeNoNewDataTolerance = null
} = {}) {
  const result = Math.max(Math.max(0, Number(scannedCommentCount) || 0), Math.max(0, Number(collectedCount) || 0));
  const value = typeof getScrapeNoNewDataTolerance === "function" ? getScrapeNoNewDataTolerance(pageTotal, result) : 8;
  let result2 = Math.max(value, pageTotal != null && pageTotal > 200 ? 18 : 10);
  if (pageTotal != null && pageTotal > 0 && pageTotal <= 80) {
    result2 = Math.min(result2, 8);
  }
  if (filtersActive) {
    result2 = Math.min(result2, pageTotal != null && pageTotal <= 80 ? 8 : 12);
  }
  return Math.max(4, result2);
}
function resolveEntityCommentMaxBoundaryProbes(arg1 = null) {
  if (arg1 != null && arg1 > 0 && arg1 <= 60) {
    return 3;
  }
  if (arg1 != null && arg1 > 0 && arg1 <= 200) {
    return 6;
  }
  if (arg1 != null && arg1 > 500) {
    return 16;
  }
  return 10;
}
async function forceEntityCommentLoadMore(options = {}, arg2, arg3, num = 1) {
  const value = typeof options.waitFn === "function" ? options.waitFn : async arg1 => {
    await new Promise(arg12 => setTimeout(arg12, arg1));
  };
  try {
    if (typeof options.clickCommentPanelLoadingPlaceholder === "function") {
      await options.clickCommentPanelLoadingPlaceholder(arg2, arg3);
    }
  } catch (error) {}
  let local = null;
  try {
    local = typeof options.getCommentScrollMetrics === "function" ? options.getCommentScrollMetrics(arg2) : null;
  } catch (error) {}
  const local2 = local?.container;
  if (local2) {
    try {
      const local = local2.clientHeight || 400;
      const result = Math.max(160, Math.round(local * 0.45));
      local2.scrollTop = Math.max(0, (local2.scrollTop || 0) - result);
      await value(220);
      local2.scrollTop = Math.max(0, local2.scrollHeight || 0);
      await value(280);
      const result2 = local2.getBoundingClientRect();
      const value2 = result2.left + result2.width / 2;
      const value3 = result2.top + Math.min(result2.height * 0.88, result2.height - 8);
      for (const item of [1200, 2000, 2800]) {
        local2.dispatchEvent(new WheelEvent("wheel", {
          deltaY: item,
          deltaMode: 0,
          clientX: value2,
          clientY: value3,
          bubbles: false,
          cancelable: true
        }));
        await value(120);
      }
      local2.scrollTop = Math.max(0, (local2.scrollHeight || 0) + 80);
    } catch (error) {}
  }
  try {
    if (typeof options.aggressiveCommentListScroll === "function") {
      await options.aggressiveCommentListScroll(arg2, arg3, Math.min(8, 3 + num));
    }
  } catch (error) {}
  try {
    if (typeof options.scrollCommentList === "function") {
      await options.scrollCommentList(arg2, -80, arg3, {
        delayMin: 60,
        delayMax: 110
      });
      await options.scrollCommentList(arg2, 220, arg3, {
        delayMin: 80,
        delayMax: 140
      });
      await options.scrollCommentList(arg2, -200, arg3, {
        delayMin: 80,
        delayMax: 140
      });
      await options.scrollCommentList(arg2, 2400, arg3, {
        delayMin: 140,
        delayMax: 240
      });
    }
  } catch (error) {}
  await value(700 + Math.min(900, num * 80));
}
async function trySwitchEntityCommentSortLatest(options = {}, arg2) {
  const local = options.isVisibleElement || isVisibleElement;
  const result = [arg2, document.body].filter(Boolean);
  for (const item of result) {
    if (!item?.querySelectorAll) {
      continue;
    }
    const result = Array.from(item.querySelectorAll("div, span, button, [role=\"tab\"]")).find(arg1 => {
      if (!local(arg1) || (arg1.children?.length || 0) > 3) {
        return false;
      }
      const result = String(arg1.textContent || "").replace(/\s+/g, " ").trim();
      return result === "最新" || result === "按时间" || result === "时间";
    });
    if (!result) {
      continue;
    }
    try {
      if (typeof options.simulateHumanClick === "function") {
        await options.simulateHumanClick(result, options.loopId || "ENTITY_LEADGEN");
      } else {
        result.click();
      }
      return String(result.textContent || "").trim() || "最新";
    } catch (error) {}
  }
  return "";
}
async function collectEntityCommentUsersByScrolling(options = {}, options2 = {}) {
  const {
    token: token,
    taskId: taskId,
    searchKeyword = "",
    seenKeys: seenKeys,
    collectedUsers: collectedUsers,
    maxCollect = 0,
    authorFilter = null,
    progressLabel = "视频评论区潜客",
    waitFn: waitFn,
    logFn: logFn,
    isCancelled: isCancelled,
    scrollCommentList: scrollCommentList,
    aggressiveCommentListScroll: aggressiveCommentListScroll,
    pruneStaleCommentDom: pruneStaleCommentDom,
    getCommentEndHintText: getCommentEndHintText,
    getCommentScrollMetrics: getCommentScrollMetrics,
    getScrapeNoNewDataTolerance: getScrapeNoNewDataTolerance,
    resolveCommentScope: resolveCommentScope,
    initialPageTotal = null,
    commentFilters = null,
    loopId = "ENTITY_LEADGEN",
    targetVideoUrl = "",
    sourceVideoTitle = "",
    videoTitle = "",
    installFeedSwipeLock: installFeedSwipeLock,
    removeFeedSwipeLock: removeFeedSwipeLock,
    hasVideoDrifted: hasVideoDrifted
  } = options2;
  const result = String(sourceVideoTitle || videoTitle || "").replace(/\s+/g, " ").trim();
  const result2 = normalizeAuthorFilter(authorFilter || {});
  const value = typeof logFn === "function" ? logFn : () => {};
  const value2 = typeof waitFn === "function" ? waitFn : async arg1 => {
    await new Promise(arg12 => setTimeout(arg12, arg1));
  };
  const local = () => typeof isCancelled === "function" ? isCancelled() : false;
  const local2 = (typeof resolveCommentScope === "function" ? resolveCommentScope() : null) || document.body;
  const local3 = async (arg1, arg2, arg3, options = {}) => {
    if (typeof scrollCommentList !== "function") {
      return false;
    }
    return scrollCommentList(arg1, arg2, arg3, {
      ...options,
      containWheel: true,
      bubbles: false
    });
  };
  const local4 = async (arg1, arg2, num = 1) => {
    if (typeof aggressiveCommentListScroll !== "function") {
      return false;
    }
    return aggressiveCommentListScroll(arg1, arg2, num);
  };
  const local5 = () => ({
    ...options,
    waitFn: value2,
    getCommentScrollMetrics: getCommentScrollMetrics,
    aggressiveCommentListScroll: local4,
    scrollCommentList: local3,
    clickCommentPanelLoadingPlaceholder: options.clickCommentPanelLoadingPlaceholder || options2.clickCommentPanelLoadingPlaceholder || null,
    isCommentPanelContentLoading: options.isCommentPanelContentLoading || options2.isCommentPanelContentLoading || null
  });
  const local6 = async (text = "") => {
    const value2 = local5().isCommentPanelContentLoading;
    const value3 = local5().clickCommentPanelLoadingPlaceholder;
    let flag = false;
    try {
      flag = typeof value2 === "function" ? !!value2(local2) : false;
    } catch (error) {
      flag = false;
    }
    if (!flag || typeof value3 !== "function") {
      return false;
    }
    if (text) {
      value(taskId, progressLabel + "：" + text, "info");
    }
    try {
      await value3(local2, loopId);
      return true;
    } catch (error) {
      return false;
    }
  };
  try {
    if (typeof installFeedSwipeLock === "function") {
      installFeedSwipeLock(targetVideoUrl);
    }
  } catch (error) {}
  try {
    const local7 = () => {
      try {
        if (typeof hasVideoDrifted === "function" && hasVideoDrifted(targetVideoUrl)) {
          return true;
        }
      } catch (error) {}
      return false;
    };
    const local8 = () => {
      try {
        return inspectEntityCommentPanel(options);
      } catch (error) {
        return {
          opened: false,
          visibleItemCount: 0,
          badgeOnly: false
        };
      }
    };
    {
      const result = local8();
      if (!result.opened) {
        value(taskId, result.badgeOnly ? progressLabel + "：评论角标有数量但列表未打开，停止本页并重新进入" : progressLabel + "：评论区未真正打开，停止本页并重新进入", "warning");
        return {
          needReload: true,
          panelNotOpen: true,
          pageTotal: result.total ?? (Number.isFinite(Number(initialPageTotal)) ? Math.floor(Number(initialPageTotal)) : null)
        };
      }
    }
    const local9 = () => {
      const local = arg1 => {
        try {
          if (typeof options.getCommentsTotalCount !== "function" || !arg1) {
            return null;
          }
          const result = options.getCommentsTotalCount(arg1);
          if (result != null && Number.isFinite(result) && result >= 0) {
            return Math.floor(result);
          }
        } catch (error) {}
        return null;
      };
      return local(document.body) || local(local2) || (Number.isFinite(Number(initialPageTotal)) && Number(initialPageTotal) > 0 ? Math.floor(Number(initialPageTotal)) : null);
    };
    let result3 = local9();
    const local10 = arg1 => {
      let num = 200;
      if (arg1 != null && arg1 > 0) {
        num = Math.min(Math.max(Math.ceil(arg1 / 6 * 1.3), 120), 2000);
      }
      if (maxCollect > 0) {
        num = Math.min(num, Math.max(120, Math.ceil(maxCollect / 4) + 100));
      }
      return num;
    };
    let result4 = local10(result3);
    value(taskId, progressLabel + "：开始采集" + (result3 != null ? "（约 " + result3 + " 条评论）" : ""));
    const local11 = () => {
      const result = local9();
      if (result != null && result !== result3) {
        result3 = result;
        const result2 = local10(result3);
        if (result2 > result4) {
          result4 = result2;
        }
        result5 = resolveEntityCommentMaxBoundaryProbes(result3);
      } else if (result != null) {
        result3 = result;
      }
      if (result3 != null) {
        return "，页面约 " + result3 + " 条评论";
      } else {
        return "";
      }
    };
    const local12 = () => {
      try {
        if (typeof getCommentScrollMetrics === "function") {
          return getCommentScrollMetrics(local2);
        }
      } catch (error) {}
      return null;
    };
    let local13 = null;
    let num = 0;
    let flag = false;
    const set = new Set();
    const local14 = arg1 => {
      if (!Array.isArray(arg1) || !arg1.length) {
        return;
      }
      for (const item of arg1) {
        const result = String(item || "").trim();
        if (!result || set.has(result)) {
          continue;
        }
        set.add(result);
        const local = /→ 过筛/.test(result) && !/未过筛/.test(result);
        value(taskId, progressLabel + "：" + result, local ? "success" : "info");
      }
    };
    try {
      if (typeof options.normalizeEntityCommentFilters === "function") {
        flag = !!options.normalizeEntityCommentFilters(commentFilters || {})?.active;
      } else if (commentFilters && typeof commentFilters === "object") {
        flag = !!(Number(commentFilters.windowMinutes) > 0) || !!Array.isArray(commentFilters.includeKeywords) && !!commentFilters.includeKeywords.length || !!Array.isArray(commentFilters.locationRegions) && !!commentFilters.locationRegions.length;
      }
    } catch (error) {}
    const local15 = () => {
      const local = collectEntityCommentsFromPage(options, result2, commentFilters, {
        sourceVideoUrl: targetVideoUrl,
        targetVideoUrl: targetVideoUrl,
        sourceVideoTitle: result,
        videoTitle: result
      }) || [];
      local13 = local.__entityCommentFilterStats || null;
      if (local13) {
        const local = Number(local13.scanned) || 0;
        if (local > num) {
          num = local;
        }
      }
      try {
        delete local.__entityCommentFilterStats;
      } catch (error) {}
      return local;
    };
    const local16 = () => {
      try {
        if (typeof options.countApiUsers === "function") {
          return Number(options.countApiUsers() || 0);
        } else {
          return 0;
        }
      } catch (error) {
        return 0;
      }
    };
    const local17 = () => resolveEntityCommentEmptyTolerance({
      pageTotal: result3,
      scannedCommentCount: num,
      collectedCount: collectedUsers.length,
      filtersActive: flag,
      getScrapeNoNewDataTolerance: getScrapeNoNewDataTolerance
    });
    let result5 = resolveEntityCommentMaxBoundaryProbes(result3);
    let num2 = 0;
    let num3 = 0;
    let num4 = 0;
    let num5 = 0;
    let num6 = 0;
    let num7 = 0;
    let text = "";
    let result6 = local16();
    let flag2 = false;
    const map = new Map();
    for (const item of collectedUsers) {
      if (item?.userKey) {
        map.set(item.userKey, item);
      }
    }
    const local18 = arg1 => {
      const result2 = map.get(arg1.userKey);
      if (!result2) {
        return false;
      }
      const local = (arg1, arg2) => {
        const result = String(arg1 || "").trim();
        const result2 = String(arg2 || "").trim();
        if (result && result !== "视频评论区潜客" && result !== "实体获客" && result !== "线索采集") {
          return result;
        }
        return result2 || result;
      };
      result2.content = local(result2.content, arg1.content);
      result2.time = local(result2.time, arg1.time);
      result2.timeText = local(result2.timeText, arg1.timeText);
      result2.ipLocation = local(result2.ipLocation, arg1.ipLocation) || local(result2.location, arg1.location);
      result2.location = local(result2.location, arg1.location) || local(result2.ipLocation, arg1.ipLocation);
      const result3 = local(result2.videoUrl, arg1.videoUrl);
      if (result3) {
        result2.videoUrl = result3;
      } else if (!result2.videoUrl && targetVideoUrl) {
        result2.videoUrl = typeof options.canonicalizeDouyinVideoUrl === "function" ? options.canonicalizeDouyinVideoUrl(targetVideoUrl) || targetVideoUrl : targetVideoUrl;
      }
      const local2 = local(result2.title, arg1.title) || local(result2.sourceVideoTitle, arg1.sourceVideoTitle) || result;
      if (local2) {
        result2.title = local2;
        result2.sourceVideoTitle = local2;
      }
      return true;
    };
    {
      const result = local12();
      if (result?.container) {
        flag2 = true;
      }
    }
    try {
      const result = await trySwitchEntityCommentSortLatest({
        isVisibleElement: isVisibleElement,
        simulateHumanClick: options2.simulateHumanClick,
        loopId: loopId
      }, local2);
      if (result) {
        value(taskId, progressLabel + "：已切换为「" + result + "」排序");
        if ((await value2(900)) === false || local()) {
          return {
            cancelled: true,
            pageTotal: result3
          };
        }
      }
    } catch (error) {}
    for (let num8 = 0; num8 < result4; num8 += 1) {
      if (local()) {
        return {
          cancelled: true,
          pageTotal: result3
        };
      }
      if (local7()) {
        value(taskId, progressLabel + "：检测到已滑到其他视频，停止本页并重新进入", "warning");
        return {
          drifted: true,
          needReload: true,
          pageTotal: result3
        };
      }
      if (num8 === 0 || num8 % 5 === 0) {
        const result = local8();
        if (!result.opened) {
          value(taskId, result.badgeOnly ? progressLabel + "：采集中发现评论列表未打开（角标约 " + (result.total ?? "?") + "），重新进入视频" : progressLabel + "：采集中评论区丢失，重新进入视频", "warning");
          return {
            needReload: true,
            panelNotOpen: true,
            pageTotal: result.total ?? result3
          };
        }
      }
      if (maxCollect > 0 && collectedUsers.length >= maxCollect) {
        value(taskId, progressLabel + "：已达采集上限 " + maxCollect + local11());
        return {
          reachedLimit: true,
          pageTotal: result3
        };
      }
      const value3 = collectedUsers.length;
      const result4 = local15();
      let num9 = 0;
      let num10 = 0;
      for (const item of result4) {
        if (!item?.userKey) {
          continue;
        }
        if (isVideoAuthorComment(item, result2)) {
          num10 += 1;
          num4 += 1;
          continue;
        }
        if (seenKeys.has(item.userKey)) {
          local18(item);
          continue;
        }
        seenKeys.add(item.userKey);
        const obj = {
          ...item,
          sourceType: "comment",
          searchKeyword: searchKeyword,
          videoUrl: item.videoUrl || (typeof options.canonicalizeDouyinVideoUrl === "function" ? options.canonicalizeDouyinVideoUrl(targetVideoUrl) : "") || String(targetVideoUrl || "").trim(),
          title: item.title || item.sourceVideoTitle || result || "",
          sourceVideoTitle: item.sourceVideoTitle || item.title || result || ""
        };
        collectedUsers.push(obj);
        map.set(item.userKey, obj);
        num9 += 1;
        if (maxCollect > 0 && collectedUsers.length >= maxCollect) {
          break;
        }
      }
      const result7 = local16();
      const value4 = result7 > result6;
      if (result7 > result6) {
        result6 = result7;
      }
      const result8 = local17();
      const result9 = local12();
      const flag = !!result9?.canScrollDown;
      let flag3 = false;
      try {
        const value = local5().isCommentPanelContentLoading;
        if (typeof value === "function") {
          flag3 = !!value(local2 || document.body);
        }
      } catch (error) {}
      const result10 = [result3 == null ? "" : result3, result6, Math.floor((Number(result9?.scrollHeight) || 0) / 40), num].join("|");
      if (result10 !== text) {
        text = result10;
        num6 = 0;
      } else if (num9 === 0 && !value4) {
        num6 += 1;
      }
      if (num9 > 0 || value4) {
        num2 = 0;
        num3 = 0;
        num6 = 0;
        if (num9 > 0) {
          num5 = 0;
        }
        if (num9 > 0) {
          value(taskId, progressLabel + "：本轮新增 " + num9 + "，累计潜客 " + collectedUsers.length + local11() + (num10 ? "（已过滤作者评论 " + num10 + "）" : ""), "info", {
            users: collectedUsers.slice(value3),
            sourceType: "comment"
          });
        }
        local14(local13?.samples || []);
        if (local13) {
          local13.samples = [];
        }
      } else {
        num2 += 1;
        num3 += 1;
        local14(local13?.samples || []);
        if (local13) {
          local13.samples = [];
        }
        if (num2 === result8 || num2 > 0 && num2 % 10 === 0) {
          let text = "";
          const local = local13;
          if (local && Number(local.rejected) > 0 && collectedUsers.length === 0) {
            const result = Object.entries(local.reasons || {}).sort((arg1, arg2) => arg2[1] - arg1[1]).slice(0, 2).map(([arg1, arg12]) => arg1 + "×" + arg12).join("、");
            const value = Array.isArray(local.includeKeywords) && local.includeKeywords.length ? "含词「" + local.includeKeywords.join("、") + "」" : "当前筛选";
            text = "；" + value + "未过筛 " + local.rejected + " 条" + (result ? "（" + result + "）" : "") + "，未命中不计入潜客";
          } else if (collectedUsers.length === 0) {
            try {
              const value = typeof options.normalizeEntityCommentFilters === "function" ? options.normalizeEntityCommentFilters(commentFilters || {}) : null;
              const local = value?.includeKeywords || [];
              if (local.length) {
                text = "；当前筛选含词「" + local.join("、") + "」，未命中不计入潜客";
              }
            } catch (error) {}
          }
          value(taskId, progressLabel + "：暂无新增潜客（连续 " + num2 + " 轮），累计 " + collectedUsers.length + local11() + text);
        }
      }
      const value5 = typeof getCommentEndHintText === "function" ? getCommentEndHintText(local2) : "";
      if (value5) {
        num7 += 1;
        if (num7 === 1) {
          value(taskId, progressLabel + "：检测到「" + value5 + "」，再下滚复核 1~2 次以防遗漏最后一页评论…", "info");
        } else if (num7 >= 2) {
          value(taskId, collectedUsers.length === 0 ? progressLabel + "：界面显示「" + value5 + "」，复核完毕，跳过当前视频" + local11() : progressLabel + "：界面显示「" + value5 + "」，滚动复核完毕，本视频采集结束（潜客 " + collectedUsers.length + local11() + "）", "info");
          break;
        }
      } else {
        num7 = 0;
      }
      const local9 = result3 != null && result3 > 0 && num >= Math.min(result3, Math.max(8, Math.ceil(result3 * 0.55)));
      const local10 = result3 != null && result3 > 0 && num6 >= Math.min(5, result8) && !flag && !value4 && (flag3 || num2 >= Math.min(5, result8)) && (local9 || num2 >= result8 || num3 >= result8);
      const local19 = num3 >= result8 && num5 >= result5;
      if (local10) {
        value(taskId, collectedUsers.length === 0 ? progressLabel + "：评论分页停滞（约 " + result3 + " 条未再增长），跳过当前视频" : progressLabel + "：评论分页停滞，本视频采集结束（潜客 " + collectedUsers.length + local11() + "）", "warning");
        break;
      }
      if (num2 >= result8) {
        if (!local19 && num5 < result5) {
          num5 += 1;
          value(taskId, progressLabel + "：继续加载更多评论（" + num5 + "/" + result5 + "），当前潜客 " + collectedUsers.length + local11(), "warning");
          num2 = Math.max(0, Math.floor(result8 / 3));
          await forceEntityCommentLoadMore(local5(), local2, loopId, num2 + num5);
        } else {
          value(taskId, collectedUsers.length === 0 ? progressLabel + "：未采到评论潜客，跳过当前视频" + local11() : progressLabel + "：本视频采集结束（潜客 " + collectedUsers.length + local11() + "）");
          break;
        }
      }
      try {
        if (typeof pruneStaleCommentDom === "function") {
          const result = Number(pruneStaleCommentDom(local2, {
            context: "entity",
            taskMode: "scrape"
          }) || 0);
          if (result > 0) {
            const result2 = Date.now();
            if (!collectEntityCommentUsersByScrolling._lastPruneLogAt || result2 - collectEntityCommentUsersByScrolling._lastPruneLogAt > 8000) {
              collectEntityCommentUsersByScrolling._lastPruneLogAt = result2;
              value(taskId, "评论区 DOM 瘦身：已移除 " + result + " 个旧节点，继续加载", "info");
            }
          }
        }
      } catch (error) {}
      let flag4 = false;
      if (num8 === 0 || num2 > 0 || !flag) {
        await local6(!flag || num2 >= 2 ? "评论区显示「加载中」或已触底，上滑继续加载…" : "");
      }
      if (!flag) {
        await forceEntityCommentLoadMore(local5(), local2, loopId, Math.max(1, num2));
        flag4 = true;
      } else {
        try {
          flag4 = !!(await local4(local2, loopId, Math.max(1, num2 || 1)));
        } catch (error) {}
        try {
          if (num2 >= 2) {
            await local3(local2, -80, loopId, {
              delayMin: 60,
              delayMax: 120
            });
            await local3(local2, 220, loopId, {
              delayMin: 80,
              delayMax: 140
            });
          }
          flag4 = !!(await local3(local2, 1400, loopId, {
            delayMin: 90,
            delayMax: 180
          })) || flag4;
          flag4 = !!(await local3(local2, 1800, loopId, {
            delayMin: 110,
            delayMax: 220
          })) || flag4;
        } catch (error) {}
      }
      if (local7()) {
        value(taskId, progressLabel + "：滚动后检测到已滑到其他视频，停止本页并重新进入", "warning");
        return {
          drifted: true,
          needReload: true,
          pageTotal: result3
        };
      }
      const result11 = local16();
      if (result11 > result6) {
        result6 = result11;
        num2 = Math.max(0, num2 - 3);
        num3 = Math.max(0, num3 - 3);
      }
      if (!flag4 && num2 > 0 && num2 % 4 === 0) {
        const result = local12();
        if (!flag2 && result?.container) {
          flag2 = true;
        }
      }
      if ((await value2(750 + Math.random() * 550)) === false || local()) {
        return {
          cancelled: true,
          pageTotal: result3
        };
      }
    }
    try {
      pruneStaleCommentDom?.(local2, {
        context: "entity",
        taskMode: "scrape"
      });
    } catch (error) {}
    const result7 = (() => {
      if (collectedUsers.length > 0 || !flag) {
        return "";
      }
      const local = local13;
      if (local && Number(local.rejected) > 0) {
        const value = Array.isArray(local.includeKeywords) && local.includeKeywords.length ? "含词「" + local.includeKeywords.join("、") + "」" : "当前筛选";
        return "；" + value + "未过筛 " + local.rejected + " 条，未命中不计入潜客";
      }
      return "；筛选后无新潜客";
    })();
    value(taskId, progressLabel + "：本视频采集结束，潜客 " + collectedUsers.length + local11() + (num4 ? "，已过滤作者评论 " + num4 : "") + result7);
    return {
      exhausted: true,
      pageTotal: result3
    };
  } finally {
    try {
      if (typeof removeFeedSwipeLock === "function") {
        removeFeedSwipeLock();
      }
    } catch (error) {}
  }
}
module.exports = {
  isVideoAuthorComment: isVideoAuthorComment,
  normalizeAuthorFilter: normalizeAuthorFilter,
  findCommentTabInRoots: findCommentTabInRoots,
  findCommentIconInRoots: findCommentIconInRoots,
  inspectEntityCommentPanel: inspectEntityCommentPanel,
  openEntityCommentPanel: openEntityCommentPanel,
  collectEntityCommentsFromPage: collectEntityCommentsFromPage,
  resolveEntityCommentEmptyTolerance: resolveEntityCommentEmptyTolerance,
  resolveEntityCommentMaxBoundaryProbes: resolveEntityCommentMaxBoundaryProbes,
  forceEntityCommentLoadMore: forceEntityCommentLoadMore,
  trySwitchEntityCommentSortLatest: trySwitchEntityCommentSortLatest,
  collectEntityCommentUsersByScrolling: collectEntityCommentUsersByScrolling
};
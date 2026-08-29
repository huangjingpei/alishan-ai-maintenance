function defaultIsVisible(arg1) {
  if (!arg1 || arg1.nodeType !== 1) {
    return false;
  }
  try {
    const result = window.getComputedStyle(arg1);
    if (result.display === "none" || result.visibility === "hidden" || Number(result.opacity) === 0) {
      return false;
    }
    const result2 = arg1.getBoundingClientRect();
    return result2.width > 0 && result2.height > 0;
  } catch (error) {
    return !!arg1.offsetWidth || !!arg1.offsetHeight;
  }
}
function normalizeHint(arg1) {
  return String(arg1 || "").replace(/\s+/g, " ").trim();
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
function compileHintRegexList(arg1) {
  return (Array.isArray(arg1) ? arg1 : []).map(arg1 => compileOptionalRegex(arg1, "i")).filter(Boolean);
}
function resolveCommentLikePack(options = {}) {
  if (options.commentLikePack && typeof options.commentLikePack === "object") {
    return options.commentLikePack;
  }
  const value = typeof options.getCommentV2String === "function" ? options.getCommentV2String : null;
  const value2 = typeof options.getCommentV2List === "function" ? options.getCommentV2List : null;
  if (!value) {
    return null;
  }
  const obj = {
    selectors: value("commentLikeSelectors") || "",
    clickInner: value("commentLikeClickInner") || "",
    pathHints: value2 ? value2("commentLikePathHints") : [],
    activeHints: value2 ? value2("commentLikeActiveHints") : [],
    activeClassPattern: value("commentLikeActiveClassPattern") || "",
    activeColorPattern: value("commentLikeActiveColorPattern") || "",
    rejectExactTexts: value2 ? value2("commentLikeRejectExactTexts") : [],
    rejectPattern: value("commentLikeRejectPattern") || "",
    ariaMatchPattern: value("commentLikeAriaMatchPattern") || "",
    e2eMatchPattern: value("commentLikeE2eMatchPattern") || "",
    classMatchPattern: value("commentLikeClassMatchPattern") || "",
    replyBtnTexts: value2 ? value2("replyBtnTexts") : []
  };
  if (!obj.selectors && !obj.pathHints.length) {
    return null;
  }
  return obj;
}
function clickableAncestor(arg1) {
  if (!arg1) {
    return null;
  }
  return arg1.closest?.("button, [role=\"button\"], [data-e2e], p, span, div") || arg1;
}
function elementLooksLikeReplyOrShare(arg1, arg2) {
  const result = normalizeHint(arg1?.innerText || arg1?.textContent || "");
  const value = Array.isArray(arg2?.rejectExactTexts) ? arg2.rejectExactTexts : [];
  if (value.some(arg1 => result === String(arg1 || "").trim())) {
    return true;
  }
  const result2 = normalizeHint(arg1?.getAttribute?.("aria-label") || arg1?.getAttribute?.("title") || "");
  const result3 = compileOptionalRegex(arg2?.rejectPattern);
  const result4 = compileOptionalRegex(arg2?.ariaMatchPattern);
  if (result3 && result3.test(result2) && (!result4 || !result4.test(result2))) {
    return true;
  }
  return false;
}
function svgPathLooksLikeHeart(arg1, arg2) {
  const result = String(arg1 || "");
  if (!result || result.length < 8) {
    return false;
  }
  const result2 = compileHintRegexList(arg2?.pathHints);
  return result2.some(arg1 => arg1.test(result));
}
function isLikedColorBlob(arg1, arg2) {
  const result = compileOptionalRegex(arg2?.activeColorPattern);
  if (!result) {
    return false;
  }
  return result.test(String(arg1 || ""));
}
function readClassBlob(arg1) {
  if (!arg1) {
    return "";
  }
  const value = typeof arg1.className === "string" ? arg1.className : String(arg1.getAttribute?.("class") || "");
  let local = value;
  try {
    (arg1.querySelectorAll?.("svg, use, span, p, i, path") || []).forEach(arg1 => {
      const value = typeof arg1.className === "string" ? arg1.className : String(arg1.getAttribute?.("class") || "");
      if (value) {
        local += " " + value;
      }
    });
  } catch (error) {}
  return local;
}
function isCommentLikeAlreadyActive(arg1, arg2 = null) {
  if (!arg1) {
    return false;
  }
  if (String(arg1.getAttribute?.("aria-pressed") || "") === "true") {
    return true;
  }
  const result = String(arg1.innerHTML || "");
  if (isLikedColorBlob(result, arg2)) {
    return true;
  }
  const result2 = normalizeHint(arg1.getAttribute?.("aria-label") || arg1.getAttribute?.("title") || "");
  const value = Array.isArray(arg2?.activeHints) ? arg2.activeHints : [];
  if (value.some(arg1 => result2.toLowerCase().includes(String(arg1 || "").toLowerCase()))) {
    return true;
  }
  const local = arg1.querySelectorAll?.("svg path, path") || [];
  for (const item of local) {
    const result = String(item.getAttribute?.("fill") || "");
    const result2 = String(item.getAttribute?.("stroke") || "");
    const result3 = String(item.getAttribute?.("style") || "");
    const value = result + " " + result2 + " " + result3;
    if (isLikedColorBlob(value, arg2)) {
      return true;
    }
    try {
      const local = window.getComputedStyle?.(item);
      if (local && (isLikedColorBlob(local.fill, arg2) || isLikedColorBlob(local.color, arg2) || isLikedColorBlob(local.stroke, arg2))) {
        return true;
      }
    } catch (error) {}
  }
  try {
    const list = [arg1, ...Array.from(arg1.querySelectorAll?.("svg, use, path") || [])];
    for (const item of list) {
      const local = window.getComputedStyle?.(item);
      if (!local) {
        continue;
      }
      if (isLikedColorBlob(local.color, arg2) || isLikedColorBlob(local.fill, arg2) || isLikedColorBlob(local.stroke, arg2)) {
        return true;
      }
    }
  } catch (error) {}
  return false;
}
function parseLikeCountText(arg1) {
  const result = normalizeHint(arg1).replace(/,/g, "");
  const result2 = result.match(/^(\d+(?:\.\d+)?)\s*([万wWkK])?$/);
  if (!result2) {
    return null;
  }
  const result3 = parseFloat(result2[1]);
  if (!Number.isFinite(result3)) {
    return null;
  }
  const result4 = String(result2[2] || "").toLowerCase();
  if (result4 === "万" || result4 === "w") {
    return Math.round(result3 * 10000);
  }
  if (result4 === "k") {
    return Math.round(result3 * 1000);
  }
  return Math.round(result3);
}
function readCommentLikeCount(arg1) {
  if (!arg1) {
    return null;
  }
  const result = parseLikeCountText(arg1.innerText || arg1.textContent || "");
  if (result != null) {
    return result;
  }
  try {
    for (const item of Array.from(arg1.querySelectorAll?.("span, p, div, em, i") || [])) {
      const result = parseLikeCountText(item.innerText || item.textContent || "");
      if (result != null) {
        return result;
      }
    }
  } catch (error) {}
  const value = arg1.nextElementSibling;
  if (value) {
    const result = parseLikeCountText(value.innerText || value.textContent || "");
    if (result != null) {
      return result;
    }
  }
  return null;
}
function snapshotCommentLikeState(arg1, arg2 = null) {
  if (!arg1) {
    return null;
  }
  const result = compileOptionalRegex(arg2?.activeClassPattern);
  return {
    liked: isCommentLikeAlreadyActive(arg1, arg2),
    count: readCommentLikeCount(arg1),
    likedClass: !!result && !!result.test(readClassBlob(arg1))
  };
}
function hasCommentLikeTakenEffect(arg1, arg2) {
  if (!arg2) {
    return false;
  }
  if (arg2.liked) {
    return true;
  }
  if (!arg1) {
    return false;
  }
  if (!arg1.likedClass && arg2.likedClass) {
    return true;
  }
  if (arg2.count != null) {
    if (arg1.count != null && arg2.count > arg1.count) {
      return true;
    }
    if (arg1.count == null && arg2.count >= 1) {
      return true;
    }
  }
  return false;
}
function scoreLikeCandidate(arg1, arg2, arg3) {
  if (!arg1 || elementLooksLikeReplyOrShare(arg1, arg3)) {
    return -999;
  }
  let num = 0;
  const result = String(arg1.getAttribute?.("data-e2e") || "").toLowerCase();
  const result2 = normalizeHint(arg1.getAttribute?.("aria-label") || arg1.getAttribute?.("title") || "");
  const result3 = String(arg1.className || "");
  const result4 = normalizeHint(arg1.innerText || arg1.textContent || "").slice(0, 20);
  const result5 = compileOptionalRegex(arg3?.e2eMatchPattern);
  const result6 = compileOptionalRegex(arg3?.ariaMatchPattern);
  const result7 = compileOptionalRegex(arg3?.classMatchPattern);
  if (result5 && result5.test(result)) {
    num += 40;
  }
  if (result6 && result6.test(result2)) {
    num += 36;
  }
  if (result7 && result7.test(result3)) {
    num += 18;
  }
  if (/^(\d+(\.\d+)?[万wWkK]?|赞)?$/.test(result4)) {
    num += 6;
  }
  const result8 = Array.from(arg1.querySelectorAll?.("svg path") || []);
  if (result8.some(arg1 => svgPathLooksLikeHeart(arg1.getAttribute?.("d"), arg3))) {
    num += 28;
  }
  if (arg1.querySelector?.("svg")) {
    num += 8;
  }
  try {
    const result = arg2.getBoundingClientRect();
    const result2 = arg1.getBoundingClientRect();
    const value = (result2.top - result.top) / Math.max(1, result.height);
    if (value > 0.45) {
      num += 10;
    }
    if (value > 0.7) {
      num += 6;
    }
  } catch (error) {}
  const value = Array.isArray(arg3?.replyBtnTexts) ? arg3.replyBtnTexts : [];
  const value2 = value.length ? Array.from(arg2.querySelectorAll("span, a, button, div")).find(arg1 => value.includes(normalizeHint(arg1.innerText || arg1.textContent))) : null;
  if (value2) {
    try {
      const result = value2.getBoundingClientRect();
      const result2 = arg1.getBoundingClientRect();
      const result3 = Math.abs(result2.left - result.left);
      const result4 = Math.abs(result2.top - result.top);
      if (result4 < 28 && result3 < 220) {
        num += 16;
      }
      if (result2.right <= result.left + 8 && result4 < 28) {
        num += 10;
      }
    } catch (error) {}
  }
  if (isCommentLikeAlreadyActive(arg1, arg3)) {
    num += 4;
  }
  return num;
}
function resolveCommentLikeControl(arg1, options = {}) {
  const local = options.isVisibleElement || defaultIsVisible;
  const result = resolveCommentLikePack(options);
  if (!arg1) {
    return {
      button: null,
      alreadyLiked: false,
      reason: "comment_node_missing",
      score: -1
    };
  }
  if (!result) {
    return {
      button: null,
      alreadyLiked: false,
      reason: "comment_like_pack_missing",
      score: -1
    };
  }
  const set = new Set();
  if (result.selectors) {
    try {
      arg1.querySelectorAll?.(result.selectors).forEach(arg1 => set.add(clickableAncestor(arg1)));
    } catch (error) {}
  }
  if (result.pathHints.length) {
    arg1.querySelectorAll?.("svg path").forEach(arg1 => {
      if (!svgPathLooksLikeHeart(arg1.getAttribute?.("d"), result)) {
        return;
      }
      set.add(clickableAncestor(arg1));
    });
  }
  const value = Array.isArray(result.replyBtnTexts) ? result.replyBtnTexts : [];
  const value2 = value.length ? Array.from(arg1.querySelectorAll("span, a, button, div")).find(arg1 => local(arg1) && value.includes(normalizeHint(arg1.innerText || arg1.textContent))) : null;
  if (value2) {
    const value = value2.parentElement;
    if (value) {
      Array.from(value.children || []).forEach(arg1 => {
        if (!arg1?.querySelector?.("svg")) {
          return;
        }
        if (elementLooksLikeReplyOrShare(arg1, result)) {
          return;
        }
        set.add(clickableAncestor(arg1));
      });
      const value2 = value.parentElement;
      if (value2 && value2 !== arg1) {
        Array.from(value2.querySelectorAll("button, [role=\"button\"], div, span, p")).filter(arg1 => arg1.querySelector?.("svg") && local(arg1)).forEach(arg1 => {
          if (elementLooksLikeReplyOrShare(arg1, result)) {
            return;
          }
          set.add(clickableAncestor(arg1));
        });
      }
    }
  }
  let local2 = null;
  let num = 0;
  for (const item of set) {
    if (!item || !local(item)) {
      continue;
    }
    if (elementLooksLikeReplyOrShare(item, result)) {
      continue;
    }
    if (item.closest?.("a[href*=\"/user/\"]") && !item.querySelector?.("svg")) {
      continue;
    }
    const result2 = scoreLikeCandidate(item, arg1, result);
    if (result2 > num) {
      num = result2;
      local2 = item;
    }
  }
  if (!local2 || num < 12) {
    return {
      button: null,
      alreadyLiked: false,
      reason: "like_button_not_found",
      score: num
    };
  }
  return {
    button: local2,
    alreadyLiked: isCommentLikeAlreadyActive(local2, result),
    reason: "",
    score: num
  };
}
module.exports = {
  hasCommentLikeTakenEffect: hasCommentLikeTakenEffect,
  isCommentLikeAlreadyActive: isCommentLikeAlreadyActive,
  readCommentLikeCount: readCommentLikeCount,
  resolveCommentLikeControl: resolveCommentLikeControl,
  resolveCommentLikePack: resolveCommentLikePack,
  snapshotCommentLikeState: snapshotCommentLikeState,
  svgPathLooksLikeHeart: svgPathLooksLikeHeart
};
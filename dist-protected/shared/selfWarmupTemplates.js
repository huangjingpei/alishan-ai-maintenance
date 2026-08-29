'use strict';

function hasOwn(arg1, arg2) {
  return !!arg1 && Object.prototype.hasOwnProperty.call(arg1, arg2);
}
function resolveAttachmentFlags(options = {}, flag = false) {
  let value = hasOwn(options, "enableImage") ? options.enableImage === true : options.attachment === "image" || options.attachment === "both";
  let value2 = hasOwn(options, "enableExpression") ? options.enableExpression === true : options.attachment === "expression" || options.attachment === "both";
  if (flag && value && value2) {
    if (options.attachment === "expression") {
      value = false;
    } else {
      value2 = false;
    }
  }
  const value3 = value && value2 ? "both" : value ? "image" : value2 ? "expression" : "none";
  return {
    enableImage: value,
    enableExpression: value2,
    attachment: value3
  };
}
function createSelfWarmupTemplateItem(options = {}, options2 = {}) {
  const value = options2.exclusive === true;
  const result = resolveAttachmentFlags(options, value);
  const value2 = Array.isArray(options.imagePaths) ? options.imagePaths.filter(arg1 => typeof arg1 === "string" && arg1.trim()).map(arg1 => arg1.trim()) : [];
  let result2 = Number(options.expressionCount);
  if (!Number.isFinite(result2)) {
    result2 = 3;
  }
  result2 = Math.max(1, Math.min(8, Math.floor(result2)));
  return {
    id: String(options.id || "tpl_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8)),
    text: String(options.text || ""),
    enableImage: result.enableImage,
    enableExpression: result.enableExpression,
    attachment: result.attachment,
    imagePaths: value2,
    expressionCount: result2
  };
}
function splitTemplateLines(arg1) {
  return String(arg1 ?? "").split("\n");
}
function itemHasAttachment(arg1) {
  if (!arg1) {
    return false;
  }
  if (arg1.enableExpression === true || arg1.attachment === "expression" || arg1.attachment === "both") {
    return true;
  }
  if (arg1.enableImage === true || arg1.attachment === "image" || arg1.attachment === "both") {
    return Array.isArray(arg1.imagePaths) && arg1.imagePaths.some(arg1 => String(arg1 || "").trim());
  }
  return false;
}
function normalizeSelfWarmupTemplateItems(arg1, text = "", options = {}, options2 = {}) {
  const value = options2.exclusive === true;
  if (Array.isArray(arg1) && arg1.length) {
    return arg1.map(arg1 => createSelfWarmupTemplateItem(arg1, {
      exclusive: value
    }));
  }
  const result = splitTemplateLines(text);
  const value2 = result.length ? result : [""];
  const value3 = options.enableCommentExpression === true ? "expression" : options.enableCommentImage === true ? "image" : "none";
  const value4 = Array.isArray(options.commentImagePaths) ? options.commentImagePaths : [];
  return value2.map(arg1 => createSelfWarmupTemplateItem({
    text: arg1,
    attachment: value3,
    imagePaths: value4,
    expressionCount: options.commentExpressionCount
  }));
}
function joinSelfWarmupTemplateTexts(arg1) {
  return (Array.isArray(arg1) ? arg1 : []).map(arg1 => String(arg1?.text || "")).join("\n");
}
function pickSelfWarmupTemplateItem(arg1, num = 0) {
  const value = Array.isArray(arg1) && arg1.length ? arg1 : [createSelfWarmupTemplateItem()];
  const value2 = (Math.max(0, Number(num) || 0) % value.length + value.length) % value.length;
  return value[value2];
}
function applySelfWarmupTemplateText(arg1, options = {}, text = "") {
  const result = String(arg1 || text || "").trim();
  if (!result) {
    return "";
  }
  return result.replace(/\{nickname\}/g, options.nickname || "朋友").replace(/\{content\}/g, options.text || "");
}
function collapseTemplateItems(list = [], text = "", options = {}, options2 = {}) {
  const value = options2.exclusive === true;
  const result = normalizeSelfWarmupTemplateItems(list, text, options, {
    exclusive: value
  });
  if (result.length <= 1) {
    if (result.length) {
      return result;
    } else {
      return [createSelfWarmupTemplateItem({}, {
        exclusive: value
      })];
    }
  }
  const list2 = [];
  const list3 = [];
  result.forEach(arg1 => {
    String(arg1.text || "").split("\n").forEach(arg1 => {
      const result = arg1.trim();
      if (result) {
        list2.push(result);
      }
    });
    (arg1.imagePaths || []).forEach(arg1 => {
      if (typeof arg1 === "string" && arg1.trim() && !list3.includes(arg1.trim())) {
        list3.push(arg1.trim());
      }
    });
  });
  const local = result.find(itemHasAttachment) || result[0];
  return [createSelfWarmupTemplateItem({
    ...local,
    text: list2.join("\n"),
    imagePaths: list3
  }, {
    exclusive: value
  })];
}
function collapseCommentTemplateItems(list = [], text = "", options = {}) {
  return collapseTemplateItems(list, text, options, {
    exclusive: true
  });
}
function collapseDmTemplateItems(list = [], text = "") {
  return collapseTemplateItems(list, text, {}, {
    exclusive: false
  });
}
function collectTemplateTextLines(list = [], options = {}, text2 = "") {
  const list2 = [];
  for (const item of Array.isArray(list) ? list : []) {
    const result = String(item?.text || "").split("\n").map(arg1 => arg1.trim()).filter(Boolean);
    result.forEach(arg1 => {
      const result = applySelfWarmupTemplateText(arg1, options);
      if (result) {
        list2.push(result);
      }
    });
  }
  if (!list2.length && text2) {
    const result = applySelfWarmupTemplateText(text2, options);
    if (result) {
      list2.push(result);
    }
  }
  return list2;
}
function expandTemplateItemsForRotation(list = [], options = {}) {
  const value = options.exclusive === true;
  const value2 = Array.isArray(list) ? list : [];
  const list2 = [];
  for (const item of value2) {
    const result = String(item?.text || "").split("\n").map(arg1 => arg1.trim()).filter(Boolean);
    if (result.length > 1) {
      result.forEach(arg1 => {
        list2.push(createSelfWarmupTemplateItem({
          ...item,
          id: (item.id || "tpl") + "_" + arg1.slice(0, 12),
          text: arg1
        }, {
          exclusive: value
        }));
      });
      continue;
    }
    list2.push(item);
  }
  if (list2.length) {
    return list2;
  } else {
    return value2;
  }
}
function resolveSelfWarmupContentMode(options = {}, flag = false) {
  const value = flag ? options.dmSuggestionMode : options.commentSuggestionMode;
  if (value === "ai" || value === "template") {
    return value;
  }
  if (options.suggestionMode === "ai") {
    return "ai";
  } else {
    return "template";
  }
}
function resolveSelfWarmupTemplatePayload(options = {}, options2 = {}, options3 = {}) {
  const value = options3.isDm === true;
  const obj = {
    enableCommentImage: options.enableCommentImage,
    enableCommentExpression: options.enableCommentExpression,
    commentImagePaths: options.commentImagePaths,
    commentExpressionCount: options.commentExpressionCount
  };
  const value2 = value ? collapseDmTemplateItems(options.dmTemplateItems, options.dmTemplate) : collapseCommentTemplateItems(options.replyTemplateItems, options.replyTemplate, obj);
  const result = String(options3.fallback || "");
  const result2 = expandTemplateItemsForRotation(value2, {
    exclusive: !value
  });
  const result3 = Math.max(0, Number(options3.roundIndex) || 0);
  const result4 = pickSelfWarmupTemplateItem(result2, result3);
  const result5 = applySelfWarmupTemplateText(result4?.text, options2, result);
  return {
    items: result2,
    item: result4,
    text: result5,
    texts: result5 ? [result5] : [],
    extras: value ? {
      enableCommentImage: !!result4.enableImage || result4.attachment === "image" || result4.attachment === "both",
      commentImagePaths: result4.imagePaths || [],
      enableCommentExpression: !!result4.enableExpression || result4.attachment === "expression" || result4.attachment === "both",
      commentExpressionCount: result4.expressionCount || 3
    } : {
      enableCommentImage: !!result4.enableImage || result4.attachment === "image",
      commentImagePaths: result4.imagePaths || [],
      enableCommentExpression: !result4.enableImage && result4.attachment !== "image" && (!!result4.enableExpression || result4.attachment === "expression"),
      commentExpressionCount: result4.expressionCount || 3
    }
  };
}
function syncLegacyCommentExtrasFromItems(options = {}, list = []) {
  const value = Array.isArray(list) ? list : [];
  if (!value.length) {
    return options;
  }
  const result = value.find(itemHasAttachment);
  if (!result) {
    options.enableCommentImage = false;
    options.enableCommentExpression = false;
    return options;
  }
  const local = !!result.enableImage || result.attachment === "image";
  const local2 = !local && (!!result.enableExpression || result.attachment === "expression");
  options.enableCommentImage = local;
  options.enableCommentExpression = local2;
  if (local) {
    options.commentImagePaths = [...(result.imagePaths || [])];
  }
  if (local2) {
    options.commentExpressionCount = result.expressionCount;
  }
  return options;
}
function commentItemsHaveAttachment(options = {}) {
  const result = normalizeSelfWarmupTemplateItems(options.replyTemplateItems, options.replyTemplate, {
    enableCommentImage: options.enableCommentImage,
    enableCommentExpression: options.enableCommentExpression,
    commentImagePaths: options.commentImagePaths,
    commentExpressionCount: options.commentExpressionCount
  }, {
    exclusive: true
  });
  return result.some(itemHasAttachment);
}
module.exports = {
  createSelfWarmupTemplateItem: createSelfWarmupTemplateItem,
  normalizeSelfWarmupTemplateItems: normalizeSelfWarmupTemplateItems,
  joinSelfWarmupTemplateTexts: joinSelfWarmupTemplateTexts,
  collapseTemplateItems: collapseTemplateItems,
  collapseCommentTemplateItems: collapseCommentTemplateItems,
  collapseDmTemplateItems: collapseDmTemplateItems,
  collectTemplateTextLines: collectTemplateTextLines,
  expandTemplateItemsForRotation: expandTemplateItemsForRotation,
  pickSelfWarmupTemplateItem: pickSelfWarmupTemplateItem,
  applySelfWarmupTemplateText: applySelfWarmupTemplateText,
  resolveSelfWarmupContentMode: resolveSelfWarmupContentMode,
  resolveSelfWarmupTemplatePayload: resolveSelfWarmupTemplatePayload,
  itemHasAttachment: itemHasAttachment,
  syncLegacyCommentExtrasFromItems: syncLegacyCommentExtrasFromItems,
  commentItemsHaveAttachment: commentItemsHaveAttachment
};
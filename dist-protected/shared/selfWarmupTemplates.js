'use strict';

function hasOwn(_0x5d2985, _0x5dbf2b) {
  return !!_0x5d2985 && Object.prototype.hasOwnProperty.call(_0x5d2985, _0x5dbf2b);
}
function resolveAttachmentFlags(_0x22016b = {}, _0x202110 = false) {
  let _0x6d065d = hasOwn(_0x22016b, "enableImage") ? _0x22016b.enableImage === true : _0x22016b.attachment === "image" || _0x22016b.attachment === "both";
  let _0xce78af = hasOwn(_0x22016b, "enableExpression") ? _0x22016b.enableExpression === true : _0x22016b.attachment === "expression" || _0x22016b.attachment === "both";
  if (_0x202110 && _0x6d065d && _0xce78af) {
    if (_0x22016b.attachment === "expression") {
      _0x6d065d = false;
    } else {
      _0xce78af = false;
    }
  }
  const _0x4e96aa = _0x6d065d && _0xce78af ? "both" : _0x6d065d ? "image" : _0xce78af ? "expression" : "none";
  return {
    enableImage: _0x6d065d,
    enableExpression: _0xce78af,
    attachment: _0x4e96aa
  };
}
function createSelfWarmupTemplateItem(_0x2205aa = {}, _0x52fd7c = {}) {
  const _0x30a82e = _0x52fd7c.exclusive === true;
  const _0x119639 = resolveAttachmentFlags(_0x2205aa, _0x30a82e);
  const _0x556926 = Array.isArray(_0x2205aa.imagePaths) ? _0x2205aa.imagePaths.filter(_0x5c274b => typeof _0x5c274b === "string" && _0x5c274b.trim()).map(_0x4da22d => _0x4da22d.trim()) : [];
  let _0xb3a714 = Number(_0x2205aa.expressionCount);
  if (!Number.isFinite(_0xb3a714)) {
    _0xb3a714 = 3;
  }
  _0xb3a714 = Math.max(1, Math.min(8, Math.floor(_0xb3a714)));
  return {
    id: String(_0x2205aa.id || "tpl_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8)),
    text: String(_0x2205aa.text || ""),
    enableImage: _0x119639.enableImage,
    enableExpression: _0x119639.enableExpression,
    attachment: _0x119639.attachment,
    imagePaths: _0x556926,
    expressionCount: _0xb3a714
  };
}
function splitTemplateLines(_0x340fe8) {
  return String(_0x340fe8 ?? "").split("\n");
}
function itemHasAttachment(_0x3677c2) {
  if (!_0x3677c2) {
    return false;
  }
  if (_0x3677c2.enableExpression === true || _0x3677c2.attachment === "expression" || _0x3677c2.attachment === "both") {
    return true;
  }
  if (_0x3677c2.enableImage === true || _0x3677c2.attachment === "image" || _0x3677c2.attachment === "both") {
    return Array.isArray(_0x3677c2.imagePaths) && _0x3677c2.imagePaths.some(_0x185969 => String(_0x185969 || "").trim());
  }
  return false;
}
function normalizeSelfWarmupTemplateItems(_0x360188, _0x5a4684 = "", _0x100ae0 = {}, _0x1653ef = {}) {
  const _0x321211 = _0x1653ef.exclusive === true;
  if (Array.isArray(_0x360188) && _0x360188.length) {
    return _0x360188.map(_0x46249f => createSelfWarmupTemplateItem(_0x46249f, {
      exclusive: _0x321211
    }));
  }
  const _0x4fe8c0 = splitTemplateLines(_0x5a4684);
  const _0x2db941 = _0x4fe8c0.length ? _0x4fe8c0 : [""];
  const _0x5a5616 = _0x100ae0.enableCommentExpression === true ? "expression" : _0x100ae0.enableCommentImage === true ? "image" : "none";
  const _0x181b8f = Array.isArray(_0x100ae0.commentImagePaths) ? _0x100ae0.commentImagePaths : [];
  return _0x2db941.map(_0x1af850 => createSelfWarmupTemplateItem({
    text: _0x1af850,
    attachment: _0x5a5616,
    imagePaths: _0x181b8f,
    expressionCount: _0x100ae0.commentExpressionCount
  }));
}
function joinSelfWarmupTemplateTexts(_0x5b1794) {
  return (Array.isArray(_0x5b1794) ? _0x5b1794 : []).map(_0x45f30a => String(_0x45f30a?.text || "")).join("\n");
}
function pickSelfWarmupTemplateItem(_0x14974c, _0x2618c3 = 0) {
  const _0x2e2900 = Array.isArray(_0x14974c) && _0x14974c.length ? _0x14974c : [createSelfWarmupTemplateItem()];
  const _0x1f6d32 = (Math.max(0, Number(_0x2618c3) || 0) % _0x2e2900.length + _0x2e2900.length) % _0x2e2900.length;
  return _0x2e2900[_0x1f6d32];
}
function applySelfWarmupTemplateText(_0x3debec, _0xbff819 = {}, _0x201f73 = "") {
  const _0x332464 = String(_0x3debec || _0x201f73 || "").trim();
  if (!_0x332464) {
    return "";
  }
  return _0x332464.replace(/\{nickname\}/g, _0xbff819.nickname || "朋友").replace(/\{content\}/g, _0xbff819.text || "");
}
function collapseTemplateItems(_0x4245c9 = [], _0x5e213e = "", _0x440a08 = {}, _0x5db409 = {}) {
  const _0x150024 = _0x5db409.exclusive === true;
  const _0x190f45 = normalizeSelfWarmupTemplateItems(_0x4245c9, _0x5e213e, _0x440a08, {
    exclusive: _0x150024
  });
  if (_0x190f45.length <= 1) {
    if (_0x190f45.length) {
      return _0x190f45;
    } else {
      return [createSelfWarmupTemplateItem({}, {
        exclusive: _0x150024
      })];
    }
  }
  const _0x44f5f4 = [];
  const _0x19c46d = [];
  _0x190f45.forEach(_0xce1615 => {
    String(_0xce1615.text || "").split("\n").forEach(_0x2aefec => {
      const _0x40d476 = _0x2aefec.trim();
      if (_0x40d476) {
        _0x44f5f4.push(_0x40d476);
      }
    });
    (_0xce1615.imagePaths || []).forEach(_0x5d634a => {
      if (typeof _0x5d634a === "string" && _0x5d634a.trim() && !_0x19c46d.includes(_0x5d634a.trim())) {
        _0x19c46d.push(_0x5d634a.trim());
      }
    });
  });
  const _0x4ddce8 = _0x190f45.find(itemHasAttachment) || _0x190f45[0];
  return [createSelfWarmupTemplateItem({
    ..._0x4ddce8,
    text: _0x44f5f4.join("\n"),
    imagePaths: _0x19c46d
  }, {
    exclusive: _0x150024
  })];
}
function collapseCommentTemplateItems(_0x2fe701 = [], _0x3179c8 = "", _0x200201 = {}) {
  return collapseTemplateItems(_0x2fe701, _0x3179c8, _0x200201, {
    exclusive: true
  });
}
function collapseDmTemplateItems(_0x49bdda = [], _0x34d091 = "") {
  return collapseTemplateItems(_0x49bdda, _0x34d091, {}, {
    exclusive: false
  });
}
function collectTemplateTextLines(_0x16b2f6 = [], _0x52952c = {}, _0x13a0fe = "") {
  const _0x4c982e = [];
  for (const _0x55da07 of Array.isArray(_0x16b2f6) ? _0x16b2f6 : []) {
    const _0x545edb = String(_0x55da07?.text || "").split("\n").map(_0x2004a4 => _0x2004a4.trim()).filter(Boolean);
    _0x545edb.forEach(_0x2c1a44 => {
      const _0x2932a5 = applySelfWarmupTemplateText(_0x2c1a44, _0x52952c);
      if (_0x2932a5) {
        _0x4c982e.push(_0x2932a5);
      }
    });
  }
  if (!_0x4c982e.length && _0x13a0fe) {
    const _0x32c914 = applySelfWarmupTemplateText(_0x13a0fe, _0x52952c);
    if (_0x32c914) {
      _0x4c982e.push(_0x32c914);
    }
  }
  return _0x4c982e;
}
function expandTemplateItemsForRotation(_0x37093f = [], _0x4809bf = {}) {
  const _0x63e906 = _0x4809bf.exclusive === true;
  const _0x1df2d8 = Array.isArray(_0x37093f) ? _0x37093f : [];
  const _0x9c518e = [];
  for (const _0x491c49 of _0x1df2d8) {
    const _0x6c244b = String(_0x491c49?.text || "").split("\n").map(_0x198efa => _0x198efa.trim()).filter(Boolean);
    if (_0x6c244b.length > 1) {
      _0x6c244b.forEach(_0x513210 => {
        _0x9c518e.push(createSelfWarmupTemplateItem({
          ..._0x491c49,
          id: (_0x491c49.id || "tpl") + "_" + _0x513210.slice(0, 12),
          text: _0x513210
        }, {
          exclusive: _0x63e906
        }));
      });
      continue;
    }
    _0x9c518e.push(_0x491c49);
  }
  if (_0x9c518e.length) {
    return _0x9c518e;
  } else {
    return _0x1df2d8;
  }
}
function resolveSelfWarmupContentMode(_0x21e5d1 = {}, _0x2231f0 = false) {
  const _0x62f1f2 = _0x2231f0 ? _0x21e5d1.dmSuggestionMode : _0x21e5d1.commentSuggestionMode;
  if (_0x62f1f2 === "ai" || _0x62f1f2 === "template") {
    return _0x62f1f2;
  }
  if (_0x21e5d1.suggestionMode === "ai") {
    return "ai";
  } else {
    return "template";
  }
}
function resolveSelfWarmupTemplatePayload(_0x2262b6 = {}, _0x1961cd = {}, _0x953c59 = {}) {
  const _0x579bca = _0x953c59.isDm === true;
  const _0x1c8310 = {
    enableCommentImage: _0x2262b6.enableCommentImage,
    enableCommentExpression: _0x2262b6.enableCommentExpression,
    commentImagePaths: _0x2262b6.commentImagePaths,
    commentExpressionCount: _0x2262b6.commentExpressionCount
  };
  const _0x28b976 = _0x579bca ? collapseDmTemplateItems(_0x2262b6.dmTemplateItems, _0x2262b6.dmTemplate) : collapseCommentTemplateItems(_0x2262b6.replyTemplateItems, _0x2262b6.replyTemplate, _0x1c8310);
  const _0x177ea0 = String(_0x953c59.fallback || "");
  const _0x3d6ca8 = expandTemplateItemsForRotation(_0x28b976, {
    exclusive: !_0x579bca
  });
  const _0x4e0fa1 = Math.max(0, Number(_0x953c59.roundIndex) || 0);
  const _0x548da9 = pickSelfWarmupTemplateItem(_0x3d6ca8, _0x4e0fa1);
  const _0x15997d = applySelfWarmupTemplateText(_0x548da9?.text, _0x1961cd, _0x177ea0);
  return {
    items: _0x3d6ca8,
    item: _0x548da9,
    text: _0x15997d,
    texts: _0x15997d ? [_0x15997d] : [],
    extras: _0x579bca ? {
      enableCommentImage: !!_0x548da9.enableImage || _0x548da9.attachment === "image" || _0x548da9.attachment === "both",
      commentImagePaths: _0x548da9.imagePaths || [],
      enableCommentExpression: !!_0x548da9.enableExpression || _0x548da9.attachment === "expression" || _0x548da9.attachment === "both",
      commentExpressionCount: _0x548da9.expressionCount || 3
    } : {
      enableCommentImage: !!_0x548da9.enableImage || _0x548da9.attachment === "image",
      commentImagePaths: _0x548da9.imagePaths || [],
      enableCommentExpression: !_0x548da9.enableImage && _0x548da9.attachment !== "image" && (!!_0x548da9.enableExpression || _0x548da9.attachment === "expression"),
      commentExpressionCount: _0x548da9.expressionCount || 3
    }
  };
}
function syncLegacyCommentExtrasFromItems(_0x583bf3 = {}, _0x525a23 = []) {
  const _0x268aff = Array.isArray(_0x525a23) ? _0x525a23 : [];
  if (!_0x268aff.length) {
    return _0x583bf3;
  }
  const _0x29106d = _0x268aff.find(itemHasAttachment);
  if (!_0x29106d) {
    _0x583bf3.enableCommentImage = false;
    _0x583bf3.enableCommentExpression = false;
    return _0x583bf3;
  }
  const _0x4ed6cc = !!_0x29106d.enableImage || _0x29106d.attachment === "image";
  const _0x4e3359 = !_0x4ed6cc && (!!_0x29106d.enableExpression || _0x29106d.attachment === "expression");
  _0x583bf3.enableCommentImage = _0x4ed6cc;
  _0x583bf3.enableCommentExpression = _0x4e3359;
  if (_0x4ed6cc) {
    _0x583bf3.commentImagePaths = [...(_0x29106d.imagePaths || [])];
  }
  if (_0x4e3359) {
    _0x583bf3.commentExpressionCount = _0x29106d.expressionCount;
  }
  return _0x583bf3;
}
function commentItemsHaveAttachment(_0x562abc = {}) {
  const _0x3ebfca = normalizeSelfWarmupTemplateItems(_0x562abc.replyTemplateItems, _0x562abc.replyTemplate, {
    enableCommentImage: _0x562abc.enableCommentImage,
    enableCommentExpression: _0x562abc.enableCommentExpression,
    commentImagePaths: _0x562abc.commentImagePaths,
    commentExpressionCount: _0x562abc.commentExpressionCount
  }, {
    exclusive: true
  });
  return _0x3ebfca.some(itemHasAttachment);
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
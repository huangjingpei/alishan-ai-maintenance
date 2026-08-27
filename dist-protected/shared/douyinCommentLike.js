function defaultIsVisible(_0x4b1865) {
  if (!_0x4b1865 || _0x4b1865.nodeType !== 1) {
    return false;
  }
  try {
    const _0x20c73c = window.getComputedStyle(_0x4b1865);
    if (_0x20c73c.display === "none" || _0x20c73c.visibility === "hidden" || Number(_0x20c73c.opacity) === 0) {
      return false;
    }
    const _0x5ef319 = _0x4b1865.getBoundingClientRect();
    return _0x5ef319.width > 0 && _0x5ef319.height > 0;
  } catch (_0xbdbf27) {
    return !!_0x4b1865.offsetWidth || !!_0x4b1865.offsetHeight;
  }
}
function normalizeHint(_0x311917) {
  return String(_0x311917 || "").replace(/\s+/g, " ").trim();
}
function compileOptionalRegex(_0x2dba0b, _0x2116b0 = "i") {
  const _0x737617 = String(_0x2dba0b || "").trim();
  if (!_0x737617) {
    return null;
  }
  try {
    return new RegExp(_0x737617, _0x2116b0);
  } catch (_0x2de2ed) {
    return null;
  }
}
function compileHintRegexList(_0x3fa897) {
  return (Array.isArray(_0x3fa897) ? _0x3fa897 : []).map(_0x23ea2f => compileOptionalRegex(_0x23ea2f, "i")).filter(Boolean);
}
function resolveCommentLikePack(_0x5c2851 = {}) {
  if (_0x5c2851.commentLikePack && typeof _0x5c2851.commentLikePack === "object") {
    return _0x5c2851.commentLikePack;
  }
  const _0x3751a6 = typeof _0x5c2851.getCommentV2String === "function" ? _0x5c2851.getCommentV2String : null;
  const _0x2294f5 = typeof _0x5c2851.getCommentV2List === "function" ? _0x5c2851.getCommentV2List : null;
  if (!_0x3751a6) {
    return null;
  }
  const _0x3e1486 = {
    selectors: _0x3751a6("commentLikeSelectors") || "",
    clickInner: _0x3751a6("commentLikeClickInner") || "",
    pathHints: _0x2294f5 ? _0x2294f5("commentLikePathHints") : [],
    activeHints: _0x2294f5 ? _0x2294f5("commentLikeActiveHints") : [],
    activeClassPattern: _0x3751a6("commentLikeActiveClassPattern") || "",
    activeColorPattern: _0x3751a6("commentLikeActiveColorPattern") || "",
    rejectExactTexts: _0x2294f5 ? _0x2294f5("commentLikeRejectExactTexts") : [],
    rejectPattern: _0x3751a6("commentLikeRejectPattern") || "",
    ariaMatchPattern: _0x3751a6("commentLikeAriaMatchPattern") || "",
    e2eMatchPattern: _0x3751a6("commentLikeE2eMatchPattern") || "",
    classMatchPattern: _0x3751a6("commentLikeClassMatchPattern") || "",
    replyBtnTexts: _0x2294f5 ? _0x2294f5("replyBtnTexts") : []
  };
  if (!_0x3e1486.selectors && !_0x3e1486.pathHints.length) {
    return null;
  }
  return _0x3e1486;
}
function clickableAncestor(_0x4e9893) {
  if (!_0x4e9893) {
    return null;
  }
  return _0x4e9893.closest?.("button, [role=\"button\"], [data-e2e], p, span, div") || _0x4e9893;
}
function elementLooksLikeReplyOrShare(_0xff15a6, _0x113ec7) {
  const _0x2248ff = normalizeHint(_0xff15a6?.innerText || _0xff15a6?.textContent || "");
  const _0x405a57 = Array.isArray(_0x113ec7?.rejectExactTexts) ? _0x113ec7.rejectExactTexts : [];
  if (_0x405a57.some(_0x3f4a4c => _0x2248ff === String(_0x3f4a4c || "").trim())) {
    return true;
  }
  const _0x508d5f = normalizeHint(_0xff15a6?.getAttribute?.("aria-label") || _0xff15a6?.getAttribute?.("title") || "");
  const _0x2c5fb6 = compileOptionalRegex(_0x113ec7?.rejectPattern);
  const _0x33499d = compileOptionalRegex(_0x113ec7?.ariaMatchPattern);
  if (_0x2c5fb6 && _0x2c5fb6.test(_0x508d5f) && (!_0x33499d || !_0x33499d.test(_0x508d5f))) {
    return true;
  }
  return false;
}
function svgPathLooksLikeHeart(_0x4fb601, _0x29cf3f) {
  const _0x3aebe4 = String(_0x4fb601 || "");
  if (!_0x3aebe4 || _0x3aebe4.length < 8) {
    return false;
  }
  const _0x426516 = compileHintRegexList(_0x29cf3f?.pathHints);
  return _0x426516.some(_0x2022fe => _0x2022fe.test(_0x3aebe4));
}
function isLikedColorBlob(_0x3f4f6e, _0x2203bb) {
  const _0x1a57dc = compileOptionalRegex(_0x2203bb?.activeColorPattern);
  if (!_0x1a57dc) {
    return false;
  }
  return _0x1a57dc.test(String(_0x3f4f6e || ""));
}
function readClassBlob(_0x1c2567) {
  if (!_0x1c2567) {
    return "";
  }
  const _0x2a1616 = typeof _0x1c2567.className === "string" ? _0x1c2567.className : String(_0x1c2567.getAttribute?.("class") || "");
  let _0x4f173a = _0x2a1616;
  try {
    (_0x1c2567.querySelectorAll?.("svg, use, span, p, i, path") || []).forEach(_0x58ddf5 => {
      const _0x25708c = typeof _0x58ddf5.className === "string" ? _0x58ddf5.className : String(_0x58ddf5.getAttribute?.("class") || "");
      if (_0x25708c) {
        _0x4f173a += " " + _0x25708c;
      }
    });
  } catch (_0x219452) {}
  return _0x4f173a;
}
function isCommentLikeAlreadyActive(_0x45485d, _0x534806 = null) {
  if (!_0x45485d) {
    return false;
  }
  if (String(_0x45485d.getAttribute?.("aria-pressed") || "") === "true") {
    return true;
  }
  const _0x55a3ce = String(_0x45485d.innerHTML || "");
  if (isLikedColorBlob(_0x55a3ce, _0x534806)) {
    return true;
  }
  const _0x68cd36 = normalizeHint(_0x45485d.getAttribute?.("aria-label") || _0x45485d.getAttribute?.("title") || "");
  const _0x2c4288 = Array.isArray(_0x534806?.activeHints) ? _0x534806.activeHints : [];
  if (_0x2c4288.some(_0x4b6a91 => _0x68cd36.toLowerCase().includes(String(_0x4b6a91 || "").toLowerCase()))) {
    return true;
  }
  const _0x4ba69a = _0x45485d.querySelectorAll?.("svg path, path") || [];
  for (const _0x431bcc of _0x4ba69a) {
    const _0x233214 = String(_0x431bcc.getAttribute?.("fill") || "");
    const _0x2a4f34 = String(_0x431bcc.getAttribute?.("stroke") || "");
    const _0x26c7f6 = String(_0x431bcc.getAttribute?.("style") || "");
    const _0x2e1e32 = _0x233214 + " " + _0x2a4f34 + " " + _0x26c7f6;
    if (isLikedColorBlob(_0x2e1e32, _0x534806)) {
      return true;
    }
    try {
      const _0x1d7d1c = window.getComputedStyle?.(_0x431bcc);
      if (_0x1d7d1c && (isLikedColorBlob(_0x1d7d1c.fill, _0x534806) || isLikedColorBlob(_0x1d7d1c.color, _0x534806) || isLikedColorBlob(_0x1d7d1c.stroke, _0x534806))) {
        return true;
      }
    } catch (_0x2ea250) {}
  }
  try {
    const _0x396c56 = [_0x45485d, ...Array.from(_0x45485d.querySelectorAll?.("svg, use, path") || [])];
    for (const _0x130839 of _0x396c56) {
      const _0x5c7f3c = window.getComputedStyle?.(_0x130839);
      if (!_0x5c7f3c) {
        continue;
      }
      if (isLikedColorBlob(_0x5c7f3c.color, _0x534806) || isLikedColorBlob(_0x5c7f3c.fill, _0x534806) || isLikedColorBlob(_0x5c7f3c.stroke, _0x534806)) {
        return true;
      }
    }
  } catch (_0x21e124) {}
  return false;
}
function parseLikeCountText(_0x24afe4) {
  const _0x314442 = normalizeHint(_0x24afe4).replace(/,/g, "");
  const _0x4772c1 = _0x314442.match(/^(\d+(?:\.\d+)?)\s*([万wWkK])?$/);
  if (!_0x4772c1) {
    return null;
  }
  const _0x101503 = parseFloat(_0x4772c1[1]);
  if (!Number.isFinite(_0x101503)) {
    return null;
  }
  const _0x44bda3 = String(_0x4772c1[2] || "").toLowerCase();
  if (_0x44bda3 === "万" || _0x44bda3 === "w") {
    return Math.round(_0x101503 * 10000);
  }
  if (_0x44bda3 === "k") {
    return Math.round(_0x101503 * 1000);
  }
  return Math.round(_0x101503);
}
function readCommentLikeCount(_0x2273b5) {
  if (!_0x2273b5) {
    return null;
  }
  const _0x2bab12 = parseLikeCountText(_0x2273b5.innerText || _0x2273b5.textContent || "");
  if (_0x2bab12 != null) {
    return _0x2bab12;
  }
  try {
    for (const _0x26b6cd of Array.from(_0x2273b5.querySelectorAll?.("span, p, div, em, i") || [])) {
      const _0x497243 = parseLikeCountText(_0x26b6cd.innerText || _0x26b6cd.textContent || "");
      if (_0x497243 != null) {
        return _0x497243;
      }
    }
  } catch (_0x1bbd4e) {}
  const _0x58d401 = _0x2273b5.nextElementSibling;
  if (_0x58d401) {
    const _0x2556b2 = parseLikeCountText(_0x58d401.innerText || _0x58d401.textContent || "");
    if (_0x2556b2 != null) {
      return _0x2556b2;
    }
  }
  return null;
}
function snapshotCommentLikeState(_0x3a0306, _0x38ac01 = null) {
  if (!_0x3a0306) {
    return null;
  }
  const _0x3745f2 = compileOptionalRegex(_0x38ac01?.activeClassPattern);
  return {
    liked: isCommentLikeAlreadyActive(_0x3a0306, _0x38ac01),
    count: readCommentLikeCount(_0x3a0306),
    likedClass: !!_0x3745f2 && !!_0x3745f2.test(readClassBlob(_0x3a0306))
  };
}
function hasCommentLikeTakenEffect(_0x181791, _0x5dd256) {
  if (!_0x5dd256) {
    return false;
  }
  if (_0x5dd256.liked) {
    return true;
  }
  if (!_0x181791) {
    return false;
  }
  if (!_0x181791.likedClass && _0x5dd256.likedClass) {
    return true;
  }
  if (_0x5dd256.count != null) {
    if (_0x181791.count != null && _0x5dd256.count > _0x181791.count) {
      return true;
    }
    if (_0x181791.count == null && _0x5dd256.count >= 1) {
      return true;
    }
  }
  return false;
}
function scoreLikeCandidate(_0x577dc8, _0x220668, _0x4cbafd) {
  if (!_0x577dc8 || elementLooksLikeReplyOrShare(_0x577dc8, _0x4cbafd)) {
    return -999;
  }
  let _0x27ae93 = 0;
  const _0x4d559e = String(_0x577dc8.getAttribute?.("data-e2e") || "").toLowerCase();
  const _0x268b1e = normalizeHint(_0x577dc8.getAttribute?.("aria-label") || _0x577dc8.getAttribute?.("title") || "");
  const _0xda4ca4 = String(_0x577dc8.className || "");
  const _0x26e478 = normalizeHint(_0x577dc8.innerText || _0x577dc8.textContent || "").slice(0, 20);
  const _0x493382 = compileOptionalRegex(_0x4cbafd?.e2eMatchPattern);
  const _0x3cd6b8 = compileOptionalRegex(_0x4cbafd?.ariaMatchPattern);
  const _0x51263c = compileOptionalRegex(_0x4cbafd?.classMatchPattern);
  if (_0x493382 && _0x493382.test(_0x4d559e)) {
    _0x27ae93 += 40;
  }
  if (_0x3cd6b8 && _0x3cd6b8.test(_0x268b1e)) {
    _0x27ae93 += 36;
  }
  if (_0x51263c && _0x51263c.test(_0xda4ca4)) {
    _0x27ae93 += 18;
  }
  if (/^(\d+(\.\d+)?[万wWkK]?|赞)?$/.test(_0x26e478)) {
    _0x27ae93 += 6;
  }
  const _0x2b70e0 = Array.from(_0x577dc8.querySelectorAll?.("svg path") || []);
  if (_0x2b70e0.some(_0xf4c18d => svgPathLooksLikeHeart(_0xf4c18d.getAttribute?.("d"), _0x4cbafd))) {
    _0x27ae93 += 28;
  }
  if (_0x577dc8.querySelector?.("svg")) {
    _0x27ae93 += 8;
  }
  try {
    const _0x407dcd = _0x220668.getBoundingClientRect();
    const _0x4a9a3a = _0x577dc8.getBoundingClientRect();
    const _0x518ba7 = (_0x4a9a3a.top - _0x407dcd.top) / Math.max(1, _0x407dcd.height);
    if (_0x518ba7 > 0.45) {
      _0x27ae93 += 10;
    }
    if (_0x518ba7 > 0.7) {
      _0x27ae93 += 6;
    }
  } catch (_0x1aa3a2) {}
  const _0x3bacf0 = Array.isArray(_0x4cbafd?.replyBtnTexts) ? _0x4cbafd.replyBtnTexts : [];
  const _0x35cf94 = _0x3bacf0.length ? Array.from(_0x220668.querySelectorAll("span, a, button, div")).find(_0x57d815 => _0x3bacf0.includes(normalizeHint(_0x57d815.innerText || _0x57d815.textContent))) : null;
  if (_0x35cf94) {
    try {
      const _0x1eb32b = _0x35cf94.getBoundingClientRect();
      const _0x286d88 = _0x577dc8.getBoundingClientRect();
      const _0x4c75b8 = Math.abs(_0x286d88.left - _0x1eb32b.left);
      const _0x184935 = Math.abs(_0x286d88.top - _0x1eb32b.top);
      if (_0x184935 < 28 && _0x4c75b8 < 220) {
        _0x27ae93 += 16;
      }
      if (_0x286d88.right <= _0x1eb32b.left + 8 && _0x184935 < 28) {
        _0x27ae93 += 10;
      }
    } catch (_0x1fabab) {}
  }
  if (isCommentLikeAlreadyActive(_0x577dc8, _0x4cbafd)) {
    _0x27ae93 += 4;
  }
  return _0x27ae93;
}
function resolveCommentLikeControl(_0x2d7469, _0x1bd80d = {}) {
  const _0x3572d8 = _0x1bd80d.isVisibleElement || defaultIsVisible;
  const _0x47de5d = resolveCommentLikePack(_0x1bd80d);
  if (!_0x2d7469) {
    return {
      button: null,
      alreadyLiked: false,
      reason: "comment_node_missing",
      score: -1
    };
  }
  if (!_0x47de5d) {
    return {
      button: null,
      alreadyLiked: false,
      reason: "comment_like_pack_missing",
      score: -1
    };
  }
  const _0x242e8d = new Set();
  if (_0x47de5d.selectors) {
    try {
      _0x2d7469.querySelectorAll?.(_0x47de5d.selectors).forEach(_0x1f1880 => _0x242e8d.add(clickableAncestor(_0x1f1880)));
    } catch (_0x91ed12) {}
  }
  if (_0x47de5d.pathHints.length) {
    _0x2d7469.querySelectorAll?.("svg path").forEach(_0x446d13 => {
      if (!svgPathLooksLikeHeart(_0x446d13.getAttribute?.("d"), _0x47de5d)) {
        return;
      }
      _0x242e8d.add(clickableAncestor(_0x446d13));
    });
  }
  const _0xc25075 = Array.isArray(_0x47de5d.replyBtnTexts) ? _0x47de5d.replyBtnTexts : [];
  const _0x20dee0 = _0xc25075.length ? Array.from(_0x2d7469.querySelectorAll("span, a, button, div")).find(_0x463cea => _0x3572d8(_0x463cea) && _0xc25075.includes(normalizeHint(_0x463cea.innerText || _0x463cea.textContent))) : null;
  if (_0x20dee0) {
    const _0x314a9a = _0x20dee0.parentElement;
    if (_0x314a9a) {
      Array.from(_0x314a9a.children || []).forEach(_0x18f809 => {
        if (!_0x18f809?.querySelector?.("svg")) {
          return;
        }
        if (elementLooksLikeReplyOrShare(_0x18f809, _0x47de5d)) {
          return;
        }
        _0x242e8d.add(clickableAncestor(_0x18f809));
      });
      const _0x44b650 = _0x314a9a.parentElement;
      if (_0x44b650 && _0x44b650 !== _0x2d7469) {
        Array.from(_0x44b650.querySelectorAll("button, [role=\"button\"], div, span, p")).filter(_0x163dd8 => _0x163dd8.querySelector?.("svg") && _0x3572d8(_0x163dd8)).forEach(_0x324910 => {
          if (elementLooksLikeReplyOrShare(_0x324910, _0x47de5d)) {
            return;
          }
          _0x242e8d.add(clickableAncestor(_0x324910));
        });
      }
    }
  }
  let _0x3d2ac4 = null;
  let _0x35e0a1 = 0;
  for (const _0x38fa14 of _0x242e8d) {
    if (!_0x38fa14 || !_0x3572d8(_0x38fa14)) {
      continue;
    }
    if (elementLooksLikeReplyOrShare(_0x38fa14, _0x47de5d)) {
      continue;
    }
    if (_0x38fa14.closest?.("a[href*=\"/user/\"]") && !_0x38fa14.querySelector?.("svg")) {
      continue;
    }
    const _0x208b27 = scoreLikeCandidate(_0x38fa14, _0x2d7469, _0x47de5d);
    if (_0x208b27 > _0x35e0a1) {
      _0x35e0a1 = _0x208b27;
      _0x3d2ac4 = _0x38fa14;
    }
  }
  if (!_0x3d2ac4 || _0x35e0a1 < 12) {
    return {
      button: null,
      alreadyLiked: false,
      reason: "like_button_not_found",
      score: _0x35e0a1
    };
  }
  return {
    button: _0x3d2ac4,
    alreadyLiked: isCommentLikeAlreadyActive(_0x3d2ac4, _0x47de5d),
    reason: "",
    score: _0x35e0a1
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
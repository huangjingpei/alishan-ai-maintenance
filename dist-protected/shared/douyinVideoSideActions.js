'use strict';

function splitSelectorList(_0xdea7c2) {
  if (Array.isArray(_0xdea7c2)) {
    return _0xdea7c2.map(_0x2479f6 => String(_0x2479f6 || "").trim()).filter(Boolean);
  }
  return String(_0xdea7c2 || "").split(",").map(_0x534036 => _0x534036.trim()).filter(Boolean);
}
function compileOptionalRegex(_0x1b301c, _0x4565c8 = "i") {
  const _0x2bb4bc = String(_0x1b301c || "").trim();
  if (!_0x2bb4bc) {
    return null;
  }
  try {
    return new RegExp(_0x2bb4bc, _0x4565c8);
  } catch (_0x266f56) {
    return null;
  }
}
function resolveVideoEngagePack(_0x47801a = {}) {
  if (typeof _0x47801a.getVideoEngagePack === "function") {
    try {
      const _0x5adde2 = _0x47801a.getVideoEngagePack();
      if (_0x5adde2 && typeof _0x5adde2 === "object") {
        return _0x5adde2;
      }
    } catch (_0x33a064) {}
  }
  if (_0x47801a.videoEngagePack && typeof _0x47801a.videoEngagePack === "object") {
    return _0x47801a.videoEngagePack;
  }
  return null;
}
function getVideoEngageSelector(_0x12fa98, _0xf0a986) {
  const _0x384372 = resolveVideoEngagePack(_0x12fa98);
  return String(_0x384372?.[_0xf0a986] || "").trim();
}
function hasVideoEngagePack(_0x25a54c = {}) {
  const _0xc7dec4 = resolveVideoEngagePack(_0x25a54c);
  if (!_0xc7dec4) {
    return false;
  }
  return splitSelectorList(_0xc7dec4.likeSelectors).length > 0 || splitSelectorList(_0xc7dec4.collectSelectors).length > 0 || splitSelectorList(_0xc7dec4.shareSelectors).length > 0;
}
function pickVisibleActionButton(_0x8c0bf2, {
  isVisibleElement: _0x11fe60,
  scope: _0x404adc,
  matchText: _0x16ae51,
  rejectText: _0x7b3d49,
  commentListExclude: _0x31ef6d
} = {}) {
  const _0x1d3384 = _0x404adc || document;
  const _0x10e888 = [];
  for (const _0x556d3f of _0x8c0bf2 || []) {
    try {
      _0x10e888.push(...Array.from(_0x1d3384.querySelectorAll(_0x556d3f)));
    } catch (_0xf6b4f5) {}
  }
  const _0xb9eaa2 = String(_0x31ef6d || "").trim();
  const _0x274fd0 = _0x10e888.filter(_0x1efc28 => {
    if (!_0x1efc28 || _0x11fe60 && !_0x11fe60(_0x1efc28)) {
      return false;
    }
    try {
      if (_0xb9eaa2 && _0x1efc28.closest?.(_0xb9eaa2)) {
        return false;
      }
    } catch (_0x56882c) {}
    const _0x3498b3 = [_0x1efc28.getAttribute?.("aria-label") || "", _0x1efc28.getAttribute?.("title") || "", _0x1efc28.getAttribute?.("data-e2e") || "", _0x1efc28.innerText || ""].join(" ");
    if (_0x7b3d49 && _0x7b3d49.test(_0x3498b3)) {
      return false;
    }
    if (_0x16ae51 && !_0x16ae51.test(_0x3498b3) && !(_0x8c0bf2 || []).some(_0x4f0677 => {
      try {
        return _0x1efc28.matches?.(_0x4f0677);
      } catch (_0xe12b4d) {
        return false;
      }
    })) {
      return false;
    }
    const _0x50c0ec = _0x1efc28.getBoundingClientRect?.();
    return _0x50c0ec && _0x50c0ec.width > 0 && _0x50c0ec.height > 0;
  }).sort((_0x2b7589, _0x1d9c35) => {
    const _0x383aeb = _0x2b7589.getBoundingClientRect();
    const _0x5021d2 = _0x1d9c35.getBoundingClientRect();
    return _0x5021d2.left - _0x383aeb.left || _0x383aeb.top - _0x5021d2.top;
  });
  const _0x13865c = _0x274fd0[0];
  if (!_0x13865c) {
    return null;
  }
  return _0x13865c.closest?.("div[role=\"button\"], button, [role=\"button\"]") || _0x13865c;
}
function looksAlreadyActive(_0x50e8dd, _0x533dfe = null) {
  if (!_0x50e8dd) {
    return false;
  }
  try {
    if (_0x50e8dd.getAttribute?.("aria-pressed") === "true") {
      return true;
    }
    if (_0x50e8dd.getAttribute?.("aria-checked") === "true") {
      return true;
    }
    const _0x420691 = (_0x50e8dd.className || "") + " " + (_0x50e8dd.parentElement?.className || "");
    const _0x168613 = compileOptionalRegex(_0x533dfe?.activeClassPattern);
    if (_0x168613 && _0x168613.test(_0x420691)) {
      return true;
    }
    const _0x3c0303 = (_0x50e8dd.getAttribute?.("aria-label") || "") + " " + (_0x50e8dd.innerText || "");
    const _0x5e5899 = Array.isArray(_0x533dfe?.activeStateHints) ? _0x533dfe.activeStateHints.map(_0x536ad0 => String(_0x536ad0 || "").trim()).filter(Boolean) : [];
    if (_0x5e5899.length && _0x5e5899.some(_0xa3047d => _0x3c0303.includes(_0xa3047d))) {
      return true;
    }
  } catch (_0x363572) {}
  return false;
}
async function clickVisibleSideActionButton(_0x15cd91, _0xae9cc3, _0x4d1641, _0x238049, _0x54779f = null) {
  const {
    simulateHumanClick: _0x97af43,
    randomDelay: _0x3fec15,
    reportTraceLog: _0x4abd0d
  } = _0x4d1641;
  if (!_0x15cd91 || typeof _0x97af43 !== "function") {
    _0x4abd0d?.("未找到" + _0x238049 + "按钮", null, "warning");
    return false;
  }
  if (looksAlreadyActive(_0x15cd91, _0x54779f)) {
    _0x4abd0d?.(_0x238049 + "已是选中状态，跳过重复点击");
    return true;
  }
  await _0x97af43(_0x15cd91, _0xae9cc3);
  await _0x3fec15?.(400, 900, _0xae9cc3, _0x238049 + "后停顿");
  return true;
}
function resolveVideoSideActionScope(_0x433960 = {}) {
  const {
    resolveDouyinVideoDetailModal: _0x43882e,
    getDouyinFeedScope: _0x5f4928
  } = _0x433960;
  try {
    const _0x23c036 = _0x43882e?.({
      includeFeed: false
    });
    if (_0x23c036) {
      return _0x23c036;
    }
  } catch (_0x14fd44) {}
  try {
    const _0x5eb9b8 = _0x5f4928?.();
    if (_0x5eb9b8) {
      return _0x5eb9b8;
    }
  } catch (_0x53b59c) {}
  return document;
}
async function likeCurrentVideoSideAction(_0x3b5dea, _0x137bec = {}) {
  const _0x35c7bf = resolveVideoEngagePack(_0x137bec);
  const _0x1aa47d = splitSelectorList(_0x35c7bf?.likeSelectors);
  if (!_0x1aa47d.length) {
    _0x137bec.reportTraceLog?.("videoEngageV2 未就绪或缺少 likeSelectors，跳过点赞", null, "warning");
    return false;
  }
  const _0x2b3aca = resolveVideoSideActionScope(_0x137bec);
  const _0x2ff94d = pickVisibleActionButton(_0x1aa47d, {
    isVisibleElement: _0x137bec.isVisibleElement,
    scope: _0x2b3aca,
    rejectText: compileOptionalRegex(_0x35c7bf.likeRejectPattern),
    commentListExclude: _0x35c7bf.commentListExclude
  });
  return clickVisibleSideActionButton(_0x2ff94d, _0x3b5dea, _0x137bec, "点赞", _0x35c7bf);
}
async function collectCurrentVideoSideAction(_0x20e2a1, _0x375e33 = {}) {
  const _0x22ee1c = resolveVideoEngagePack(_0x375e33);
  const _0x41941d = splitSelectorList(_0x22ee1c?.collectSelectors);
  if (!_0x41941d.length) {
    _0x375e33.reportTraceLog?.("videoEngageV2 未就绪或缺少 collectSelectors，跳过收藏", null, "warning");
    return false;
  }
  const _0x558f8b = resolveVideoSideActionScope(_0x375e33);
  const _0x5c8456 = pickVisibleActionButton(_0x41941d, {
    isVisibleElement: _0x375e33.isVisibleElement,
    scope: _0x558f8b,
    matchText: compileOptionalRegex(_0x22ee1c.collectMatchPattern),
    rejectText: compileOptionalRegex(_0x22ee1c.collectRejectPattern),
    commentListExclude: _0x22ee1c.commentListExclude
  });
  return clickVisibleSideActionButton(_0x5c8456, _0x20e2a1, _0x375e33, "收藏", _0x22ee1c);
}
async function findShareSideActionButton(_0x11ba12, _0x18319b = {}) {
  const _0x1c9985 = resolveVideoEngagePack(_0x18319b);
  const _0xa6042c = splitSelectorList(_0x1c9985?.shareSelectors);
  if (!_0xa6042c.length) {
    _0x18319b.reportTraceLog?.("videoEngageV2 未就绪或缺少 shareSelectors，跳过转发", null, "warning");
    return null;
  }
  const _0x164661 = _0x18319b.getDouyinFeedScope?.() || resolveVideoSideActionScope(_0x18319b);
  return pickVisibleActionButton(_0xa6042c, {
    isVisibleElement: _0x18319b.isVisibleElement,
    scope: _0x164661,
    matchText: compileOptionalRegex(_0x1c9985.shareMatchPattern),
    rejectText: compileOptionalRegex(_0x1c9985.shareRejectPattern),
    commentListExclude: _0x1c9985.commentListExclude
  });
}
function findSharePanelCopyLinkButton(_0x466cb4, _0x1fe756 = null) {
  const _0x5b455c = Array.isArray(_0x1fe756?.copyLinkExactTexts) ? _0x1fe756.copyLinkExactTexts.map(_0x2c4144 => String(_0x2c4144 || "").trim()).filter(Boolean) : [];
  const _0x3fbae1 = compileOptionalRegex(_0x1fe756?.copyLinkRejectPattern);
  if (!_0x5b455c.length) {
    return null;
  }
  const _0x516b0c = Array.from(document.querySelectorAll("button, div, span, a, [role=\"button\"], li"));
  const _0x1d98d3 = [];
  for (const _0x578b5c of _0x516b0c) {
    if (!_0x578b5c || _0x466cb4 && !_0x466cb4(_0x578b5c)) {
      continue;
    }
    const _0x47a4ab = (_0x578b5c.innerText || _0x578b5c.textContent || "") + " " + (_0x578b5c.getAttribute?.("aria-label") || "");
    const _0x7fd07 = _0x47a4ab.replace(/\s+/g, "");
    if (!_0x5b455c.some(_0x24be19 => _0x7fd07.includes(String(_0x24be19).replace(/\s+/g, "")))) {
      continue;
    }
    if (_0x3fbae1 && _0x3fbae1.test(_0x7fd07)) {
      continue;
    }
    if (_0x7fd07.length > 24) {
      continue;
    }
    let _0x8ee729;
    try {
      _0x8ee729 = _0x578b5c.getBoundingClientRect();
    } catch (_0x19de43) {
      continue;
    }
    if (!_0x8ee729 || _0x8ee729.width < 24 || _0x8ee729.height < 16) {
      continue;
    }
    const _0xcee3d9 = window.innerHeight || 800;
    const _0x7f32db = _0x8ee729.top > _0xcee3d9 * 0.42 ? 120 : _0x8ee729.top > _0xcee3d9 * 0.28 ? 40 : 0;
    const _0x550620 = _0x5b455c.some(_0x1ec0e2 => _0x7fd07 === String(_0x1ec0e2).replace(/\s+/g, "")) ? 80 : 0;
    const _0x55994e = _0x8ee729.width >= 88 && _0x8ee729.width <= 280 ? 30 : 0;
    const _0x49839d = _0x8ee729.left < (window.innerWidth || 1280) * 0.55 ? 20 : 0;
    _0x1d98d3.push({
      el: _0x578b5c,
      score: _0x7f32db + _0x550620 + _0x55994e + _0x49839d + Math.min(_0x8ee729.width, 180) * 0.15
    });
  }
  _0x1d98d3.sort((_0xc5033c, _0x2ab9e5) => _0x2ab9e5.score - _0xc5033c.score);
  const _0x29eb82 = _0x1d98d3[0]?.el;
  if (!_0x29eb82) {
    return null;
  }
  return _0x29eb82.closest?.("button, [role=\"button\"], a, div") || _0x29eb82;
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
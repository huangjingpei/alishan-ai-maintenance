const {
  isDouyinSecondaryCommentNode,
  isDouyinNestedReplyComment
} = require("./douyinCommentReplyGuard");
const {
  formatEntityCommentFilterLogLine
} = require("./entityCommentFilters");
function isVisibleElement(_0x392ea6) {
  if (!_0x392ea6 || typeof _0x392ea6.getBoundingClientRect !== "function") {
    return false;
  }
  try {
    const _0x5c5247 = window.getComputedStyle(_0x392ea6);
    if (_0x5c5247.display === "none" || _0x5c5247.visibility === "hidden" || parseFloat(_0x5c5247.opacity || "1") <= 0.01) {
      return false;
    }
    const _0x44d2cc = _0x392ea6.getBoundingClientRect();
    return _0x44d2cc.width > 0 && _0x44d2cc.height > 0;
  } catch (_0x360460) {
    return false;
  }
}
function normalizeAuthorFilter(_0x5eaf8a = {}) {
  return {
    nickname: String(_0x5eaf8a.nickname || "").trim().replace(/^@+/, ""),
    userUrl: String(_0x5eaf8a.userUrl || "").trim(),
    secUid: String(_0x5eaf8a.secUid || "").trim(),
    userKey: String(_0x5eaf8a.userKey || _0x5eaf8a.secUid || "").trim()
  };
}
function isVideoAuthorComment(_0x14e603 = {}, _0x4fed1a = null) {
  if (!_0x4fed1a) {
    return false;
  }
  const _0x470ca8 = String(_0x14e603.userKey || _0x14e603.secUid || "").trim();
  const _0x3e62d1 = String(_0x14e603.userUrl || "").trim();
  const _0x319b99 = String(_0x14e603.nickname || "").trim().replace(/^@+/, "");
  if (_0x4fed1a.userKey && _0x470ca8 && _0x470ca8 === _0x4fed1a.userKey) {
    return true;
  }
  if (_0x4fed1a.secUid && _0x470ca8 && _0x470ca8 === _0x4fed1a.secUid) {
    return true;
  }
  if (_0x4fed1a.userUrl && _0x3e62d1 && _0x3e62d1 === _0x4fed1a.userUrl) {
    return true;
  }
  if (!_0x4fed1a.userKey && !_0x4fed1a.secUid && !_0x4fed1a.userUrl && _0x4fed1a.nickname && _0x319b99 && _0x319b99 === _0x4fed1a.nickname) {
    return true;
  }
  return false;
}
function findCommentTabInRoots(_0x1fb7ac, _0xcc452a, _0x1413ca = {}) {
  const _0x1bd58a = _0x1413ca.isVisibleElement || isVisibleElement;
  const _0x9ae7bb = String(_0xcc452a || "评论").trim() || "评论";
  const _0x471ce2 = [];
  for (const _0x5e1ea4 of _0x1fb7ac) {
    if (!_0x5e1ea4?.querySelectorAll) {
      continue;
    }
    for (const _0x2ad957 of _0x5e1ea4.querySelectorAll("div, span, p, button, [role=\"tab\"], a")) {
      if (!_0x1bd58a(_0x2ad957)) {
        continue;
      }
      if ((_0x2ad957.children?.length || 0) > 8) {
        continue;
      }
      const _0x3d4926 = String(_0x2ad957.textContent || _0x2ad957.innerText || "").replace(/\s+/g, " ").trim();
      if (!_0x3d4926 || _0x3d4926.length >= 24) {
        continue;
      }
      const _0x210093 = _0x3d4926.replace(/\s+/g, "");
      if (_0x3d4926 !== _0x9ae7bb && !_0x3d4926.startsWith(_0x9ae7bb) && _0x210093 !== _0x9ae7bb && !_0x210093.startsWith(_0x9ae7bb) && !/^评论[\d(（]/.test(_0x210093)) {
        continue;
      }
      const _0x428287 = _0x2ad957.getBoundingClientRect();
      if (_0x428287.height > 64 && _0x428287.width < 80) {
        continue;
      }
      _0x471ce2.push({
        el: _0x2ad957,
        text: _0x3d4926,
        right: _0x428287.right,
        top: _0x428287.top,
        len: _0x3d4926.length,
        children: _0x2ad957.children?.length || 0
      });
    }
  }
  if (!_0x471ce2.length) {
    return null;
  }
  _0x471ce2.sort((_0x44371b, _0x3a3674) => {
    if (Math.abs(_0x44371b.right - _0x3a3674.right) > 48) {
      return _0x3a3674.right - _0x44371b.right;
    }
    if (_0x44371b.len !== _0x3a3674.len) {
      return _0x44371b.len - _0x3a3674.len;
    }
    return _0x44371b.children - _0x3a3674.children;
  });
  const _0x31767d = _0x471ce2[0].el;
  return _0x31767d.closest?.("button, [role=\"button\"], [role=\"tab\"], a") || _0x31767d;
}
function findCommentIconInRoots(_0x2b77f3, _0x5d7a5a = {}) {
  const _0xa3268d = _0x5d7a5a.isVisibleElement || isVisibleElement;
  const _0x2e3233 = typeof _0x5d7a5a.getCommentV2String === "function" ? [_0x5d7a5a.getCommentV2String("openCommentBtns"), _0x5d7a5a.getCommentV2String("feedCommentIcon"), _0x5d7a5a.getCommentV2String("videoCommentIcon"), _0x5d7a5a.getCommentV2String("videoPlayerComment"), _0x5d7a5a.getCommentV2String("openCommentAria")].filter(Boolean) : [];
  const _0x31a6d7 = ["[data-e2e=\"feed-comment-icon\"]", "[data-e2e=\"video-comment-icon\"]", "[data-e2e=\"video-player-comment\"]", "[data-e2e=\"comment-icon\"]", ".comment-icon", "[class*=\"comment-icon\"]", "[aria-label*=\"评论\"]"];
  const _0x4e3625 = [...new Set([..._0x2e3233, ..._0x31a6d7])].join(", ");
  for (const _0x518346 of _0x2b77f3) {
    if (!_0x518346?.querySelectorAll) {
      continue;
    }
    const _0x513af8 = Array.from(_0x518346.querySelectorAll(_0x4e3625)).filter(_0xc884ba => _0xa3268d(_0xc884ba));
    if (_0x513af8.length) {
      return _0x513af8[_0x513af8.length - 1].closest?.("button, [role=\"button\"]") || _0x513af8[_0x513af8.length - 1];
    }
  }
  return null;
}
function buildSearchRoots(_0x4d0558) {
  const _0x3ab575 = [];
  const _0x7361e9 = _0x6fa25e => {
    if (_0x6fa25e && !_0x3ab575.includes(_0x6fa25e)) {
      _0x3ab575.push(_0x6fa25e);
    }
  };
  _0x7361e9(_0x4d0558);
  try {
    document.querySelectorAll(["[data-e2e=\"video-detail-container\"]", ".modal-video-container", "[class*=\"SearchDetail\"]", "[class*=\"VideoDetail\"]", "[class*=\"note-detail\"]", "[class*=\"NoteDetail\"]", "[role=\"dialog\"]", "[class*=\"player-container\"]"].join(", ")).forEach(_0x4c7512 => _0x7361e9(_0x4c7512));
  } catch (_0xe591c3) {}
  _0x7361e9(document.body);
  _0x7361e9(document);
  return _0x3ab575;
}
function countCommentSignals(_0x584502 = {}) {
  let _0x3b617 = 0;
  try {
    _0x3b617 = Number(_0x584502.countApiUsers?.() || 0) || 0;
  } catch (_0x158f6a) {}
  let _0x21cffe = 0;
  try {
    const _0x39da39 = _0x584502.resolveCommentPanelRoot?.(document.body) || document.body;
    if (typeof _0x584502.queryCommentItemNodes === "function") {
      _0x21cffe = _0x584502.queryCommentItemNodes(_0x39da39).length;
    } else {
      _0x21cffe = document.querySelectorAll("[data-e2e=\"comment-item\"], [class*=\"comment-item\"], div[class*=\"CommentItem\"]").length;
    }
  } catch (_0x5396cd) {}
  return {
    api: _0x3b617,
    nodes: _0x21cffe,
    ready: _0x3b617 > 0 || _0x21cffe > 0
  };
}
function inspectEntityCommentPanel(_0x2ebffd = {}) {
  const _0x175abd = _0x2ebffd.isVisibleElement || isVisibleElement;
  let _0x566607 = null;
  try {
    if (typeof _0x2ebffd.findCommentPanelRoot === "function") {
      _0x566607 = _0x2ebffd.findCommentPanelRoot(document.body) || null;
    }
  } catch (_0x65f9be) {
    _0x566607 = null;
  }
  if (!_0x566607 && typeof _0x2ebffd.resolveCommentPanelRoot === "function") {
    try {
      const _0x28d3e6 = _0x2ebffd.resolveCommentPanelRoot(document.body);
      if (_0x28d3e6 && _0x28d3e6 !== document.body && _0x28d3e6 !== document.documentElement && _0x28d3e6 !== document) {
        _0x566607 = _0x28d3e6;
      }
    } catch (_0x4317e4) {}
  }
  const _0x5ebb84 = !!_0x566607 && !!_0x175abd(_0x566607);
  let _0x22314f = 0;
  let _0x142394 = 0;
  if (_0x566607 && typeof _0x2ebffd.queryCommentItemNodes === "function") {
    try {
      const _0x4a5682 = _0x2ebffd.queryCommentItemNodes(_0x566607) || [];
      _0x22314f = _0x4a5682.length;
      _0x142394 = _0x4a5682.filter(_0x5b15ba => _0x175abd(_0x5b15ba)).length;
    } catch (_0x1822b4) {}
  }
  let _0x39f591 = false;
  try {
    if (_0x566607 && typeof _0x2ebffd.hasCommentComposerInPanel === "function") {
      _0x39f591 = !!_0x2ebffd.hasCommentComposerInPanel(_0x566607);
    } else if (_0x566607) {
      const _0xd8549e = _0x566607.querySelector?.("[contenteditable=\"true\"], textarea, [data-e2e*=\"comment-input\"], [class*=\"DraftEditor\"]");
      _0x39f591 = !!_0xd8549e && !!_0x175abd(_0xd8549e);
    }
  } catch (_0x3eb04d) {}
  const _0x4f2d2f = String(document.body?.innerText || "");
  const _0x4b698d = /暂无评论|还没有人评论|快来发表评论|说点什么吧/.test(_0x4f2d2f);
  let _0x115eed = null;
  try {
    if (typeof _0x2ebffd.getCommentsTotalCount === "function") {
      const _0x51f929 = _0x2ebffd.getCommentsTotalCount(document.body);
      if (_0x51f929 != null && Number.isFinite(_0x51f929) && _0x51f929 >= 0) {
        _0x115eed = Math.floor(_0x51f929);
      }
    }
  } catch (_0x4ad850) {}
  let _0x3b8a22 = false;
  try {
    if (typeof _0x2ebffd.isCommentPanelContentLoading === "function") {
      _0x3b8a22 = !!_0x2ebffd.isCommentPanelContentLoading(_0x566607 || document.body);
    }
  } catch (_0x424427) {}
  const _0x3983ca = _0x115eed != null && _0x115eed > 0 && _0x142394 === 0 && !_0x3b8a22 && !_0x39f591;
  const _0x10f072 = _0x5ebb84 && !_0x3983ca && (_0x142394 > 0 || _0x39f591 || _0x3b8a22 || _0x4b698d && (_0x115eed == null || _0x115eed === 0));
  return {
    opened: _0x10f072,
    panel: _0x566607,
    panelVisible: _0x5ebb84,
    itemCount: _0x22314f,
    visibleItemCount: _0x142394,
    hasComposer: _0x39f591,
    hasEmptyPlaceholder: _0x4b698d,
    total: _0x115eed,
    loading: _0x3b8a22,
    badgeOnly: _0x3983ca,
    empty: !!_0x10f072 && _0x142394 === 0 && (!!_0x4b698d || _0x115eed === 0)
  };
}
function looksTrulyEmpty(_0x1f1ac3 = {}) {
  const _0x17b2d0 = inspectEntityCommentPanel(_0x1f1ac3);
  if (_0x17b2d0.opened && _0x17b2d0.empty) {
    return true;
  }
  const _0x2bdd18 = countCommentSignals(_0x1f1ac3);
  if (_0x2bdd18.ready) {
    return false;
  }
  const _0x2f47b7 = String(document.body?.innerText || "");
  const _0x2912d6 = /暂无评论|还没有人评论|快来发表评论/.test(_0x2f47b7);
  if (!_0x2912d6) {
    return false;
  }
  const _0x13d401 = typeof _0x1f1ac3.getCommentsTotalCount === "function" ? _0x1f1ac3.getCommentsTotalCount(document.body) : null;
  const _0x5d7b96 = typeof _0x1f1ac3.isCommentPanelContentLoading === "function" ? _0x1f1ac3.isCommentPanelContentLoading(document.body) : false;
  return !_0x5d7b96 && _0x13d401 === 0;
}
async function clickEntityCommentTarget(_0x25c664, _0x3e1140 = {}) {
  if (!_0x25c664) {
    return false;
  }
  const _0x35a504 = _0x3e1140.loopId || "ENTITY_LEADGEN";
  try {
    if (typeof _0x3e1140.simulateHumanClick === "function") {
      await _0x3e1140.simulateHumanClick(_0x25c664, _0x35a504);
      return true;
    }
  } catch (_0x42ace1) {}
  try {
    _0x25c664.click();
    return true;
  } catch (_0x2e32a0) {
    return false;
  }
}
async function openEntityCommentPanel(_0x5d042d = {}) {
  const {
    token: _0x593e27,
    taskId: _0x2224cf,
    scope = document.body,
    waitFn: _0x39c25c,
    logFn: _0x259649,
    isVisibleElement: _0x58e6d7,
    getCommentTabPrefix: _0xa2d223,
    isCancelled: _0x56b300
  } = _0x5d042d;
  const _0x4399e2 = _0x58e6d7 || isVisibleElement;
  const _0x5cf933 = typeof _0x259649 === "function" ? _0x259649 : () => {};
  const _0x4154be = typeof _0x39c25c === "function" ? _0x39c25c : async _0x1748c6 => {
    await new Promise(_0x27f8eb => setTimeout(_0x27f8eb, _0x1748c6));
  };
  const _0x492504 = () => typeof _0x56b300 === "function" ? _0x56b300() : false;
  const _0x163d34 = String(typeof location !== "undefined" && location.href || "");
  const _0x3b418d = /modal_id=|\/jingxuan|\/video\/|\/note\//.test(_0x163d34);
  const _0x154d9c = () => inspectEntityCommentPanel({
    ..._0x5d042d,
    isVisibleElement: _0x4399e2
  });
  const _0x5df998 = Math.max(400, Math.min(3000, Number(_0x5d042d.postTabWaitMs) || 600));
  const _0xe6a0b9 = Math.max(500, Math.min(4000, Number(_0x5d042d.postIconWaitMs) || 800));
  const _0x2051b9 = Math.max(400, Math.min(3000, Number(_0x5d042d.postTabAgainWaitMs) || 500));
  const _0x4235ab = Math.max(8, Math.min(40, Number(_0x5d042d.maxInspectRounds) || 14));
  const _0x390e02 = Math.max(500, Math.min(2500, Number(_0x5d042d.inspectIntervalMs) || 750));
  const _0x125b50 = buildSearchRoots(scope);
  const _0x41ce09 = _0x154d9c();
  if (_0x41ce09.opened && !_0x3b418d) {
    return {
      opened: true,
      already: true,
      empty: !!_0x41ce09.empty,
      inspection: _0x41ce09
    };
  }
  const _0x1aae8 = typeof _0xa2d223 === "function" && _0xa2d223() || "评论";
  const _0x18b901 = findCommentTabInRoots(_0x125b50, _0x1aae8, {
    isVisibleElement: _0x4399e2
  });
  if (_0x18b901) {
    _0x5cf933(_0x2224cf, "切换到评论 Tab「" + String(_0x18b901.textContent || "").replace(/\s+/g, " ").trim() + "」…");
    await clickEntityCommentTarget(_0x18b901, _0x5d042d);
    if ((await _0x4154be(_0x5df998)) === false || _0x492504()) {
      return {
        opened: false,
        cancelled: true
      };
    }
  } else if (_0x3b418d) {
    _0x5cf933(_0x2224cf, "未定位到评论 Tab，将尝试评论图标…", "warning");
  }
  if (!_0x154d9c().opened) {
    const _0x3b2332 = findCommentIconInRoots(_0x125b50, {
      isVisibleElement: _0x4399e2
    });
    if (_0x3b2332) {
      _0x5cf933(_0x2224cf, "展开评论区…");
      await clickEntityCommentTarget(_0x3b2332, _0x5d042d);
      if ((await _0x4154be(_0xe6a0b9)) === false || _0x492504()) {
        return {
          opened: false,
          cancelled: true
        };
      }
    } else if (!_0x18b901) {
      _0x5cf933(_0x2224cf, "未找到评论 Tab/图标，稍后仍尝试采集", "warning");
    }
  }
  if (_0x3b418d || !_0x154d9c().opened) {
    const _0x4519b2 = _0x18b901 || findCommentTabInRoots(_0x125b50, _0x1aae8, {
      isVisibleElement: _0x4399e2
    });
    if (_0x4519b2) {
      if (!_0x18b901) {
        _0x5cf933(_0x2224cf, "切换到评论 Tab「" + String(_0x4519b2.textContent || "").replace(/\s+/g, " ").trim() + "」…");
      }
      await clickEntityCommentTarget(_0x4519b2, _0x5d042d);
      if ((await _0x4154be(_0x2051b9)) === false || _0x492504()) {
        return {
          opened: false,
          cancelled: true
        };
      }
    }
  }
  for (let _0x5d4401 = 0; _0x5d4401 < _0x4235ab; _0x5d4401 += 1) {
    if (_0x492504()) {
      return {
        opened: false,
        cancelled: true
      };
    }
    const _0x3a84b4 = _0x154d9c();
    if (_0x3a84b4.opened) {
      return {
        opened: true,
        empty: !!_0x3a84b4.empty,
        inspection: _0x3a84b4
      };
    }
    if (looksTrulyEmpty(_0x5d042d)) {
      return {
        opened: true,
        empty: true,
        inspection: _0x3a84b4
      };
    }
    if ((await _0x4154be(_0x390e02 + Math.random() * 250)) === false) {
      return {
        opened: false,
        cancelled: true
      };
    }
  }
  const _0x3c5d63 = _0x154d9c();
  return {
    opened: !!_0x3c5d63.opened,
    empty: !!_0x3c5d63.empty,
    slow: !_0x3c5d63.opened,
    badgeOnly: !!_0x3c5d63.badgeOnly,
    inspection: _0x3c5d63
  };
}
function collectEntityCommentsFromPage(_0x35923d = {}, _0x4aec82 = null, _0x23f9bb = null, _0x231e3b = {}) {
  const _0x459947 = normalizeAuthorFilter(_0x4aec82 || {});
  const _0x465007 = [];
  const _0x56745d = new Map();
  const {
    collectEntityUsersFromApiBuffer: _0x32ebfb,
    normalizeDouyinAuthorProfileUrl: _0x2aad47,
    buildEntityUserKey: _0x421f80,
    resolveCommentPanelRoot: _0x2fd1ca,
    queryCommentItemNodes: _0x508e33,
    parseDouyinCommentNode: _0x31aea2,
    evaluateEntityCommentFilters: _0x4e6156,
    normalizeEntityCommentFilters: _0x35cd22,
    canonicalizeDouyinVideoUrl: _0x19c32c
  } = _0x35923d;
  const _0x4a09fd = typeof _0x19c32c === "function" ? _0x19c32c(_0x231e3b.sourceVideoUrl || _0x231e3b.targetVideoUrl || "") || "" : String(_0x231e3b.sourceVideoUrl || _0x231e3b.targetVideoUrl || "").trim();
  const _0x230545 = String(_0x231e3b.sourceVideoTitle || _0x231e3b.videoTitle || "").replace(/\s+/g, " ").trim();
  const _0x65d9a6 = _0x25942d => {
    const _0x375fd8 = String(_0x25942d || "").trim();
    if (!_0x375fd8 || _0x375fd8 === "未知视频") {
      return true;
    }
    if (/^https?:\/\//i.test(_0x375fd8)) {
      return true;
    }
    if (_0x375fd8.startsWith("直播间：")) {
      return true;
    }
    return false;
  };
  const _0x3205d5 = typeof _0x35cd22 === "function" ? _0x35cd22(_0x23f9bb || {}) : null;
  let _0x5db9e3 = 0;
  const _0x2dcc20 = Object.create(null);
  const _0x222e68 = new Set();
  const _0x17f59a = [];
  const _0x4db2c0 = (_0x24347f, _0x59bafb) => {
    if (!_0x3205d5?.active) {
      return;
    }
    const _0x302f83 = Array.isArray(_0x3205d5.includeKeywords) ? _0x3205d5.includeKeywords : [];
    if (!_0x302f83.length && !_0x59bafb?.reason) {
      return;
    }
    if (_0x17f59a.length >= 24) {
      return;
    }
    const _0x2a7630 = !!_0x59bafb?.pass;
    const _0x164aac = String(_0x24347f.nickname || "").trim();
    const _0x15ca6b = String(_0x24347f.content || _0x24347f.text || "").trim();
    const _0x2602c3 = String(_0x59bafb?.body || "").trim();
    const _0x3f0528 = _0x302f83.some(_0x253d12 => _0x164aac.includes(_0x253d12));
    const _0x5a751c = _0x302f83.some(_0x2b177e => _0x15ca6b.includes(_0x2b177e));
    const _0xa566d5 = _0x302f83.some(_0x5d0117 => _0x2602c3.includes(_0x5d0117));
    const _0x12de15 = _0x3f0528 || _0x5a751c && !_0xa566d5 || _0x2a7630 && _0xa566d5 || !_0x2a7630 && !_0xa566d5;
    const _0x2cccd5 = _0x17f59a.filter(_0x24e89a => String(_0x24e89a).includes("未过筛")).length;
    if (!_0x2a7630 && !_0x12de15 && _0x2cccd5 >= 6) {
      return;
    }
    const _0x5eecad = typeof formatEntityCommentFilterLogLine === "function" ? formatEntityCommentFilterLogLine : null;
    _0x17f59a.push(_0x5eecad ? _0x5eecad(_0x24347f, _0x59bafb, _0x3205d5) : "🔍 筛选@" + _0x164aac + " 原文「" + _0x15ca6b + "」 → " + (_0x2a7630 ? "过筛" : "未过筛" + (_0x59bafb?.reason ? "（" + _0x59bafb.reason + "）" : "")));
  };
  const _0x449eab = _0xa2afc9 => {
    if (!_0xa2afc9?.userKey) {
      return;
    }
    _0x222e68.add(_0xa2afc9.userKey);
    const _0x17166b = _0x3205d5?.active && typeof _0x4e6156 === "function" ? _0x4e6156(_0xa2afc9, _0x3205d5) : {
      pass: true,
      body: String(_0xa2afc9.content || _0xa2afc9.text || "").trim()
    };
    if (!_0x17166b.pass) {
      _0x5db9e3 += 1;
      const _0x4735be = _0x17166b?.reason || "已过滤";
      _0x2dcc20[_0x4735be] = (_0x2dcc20[_0x4735be] || 0) + 1;
      _0x4db2c0(_0xa2afc9, _0x17166b);
      return;
    }
    _0x4db2c0(_0xa2afc9, _0x17166b);
    const _0x3188ef = _0xa2afc9.userKey;
    const _0x156226 = {
      ..._0xa2afc9,
      videoUrl: (typeof _0x19c32c === "function" ? _0x19c32c(_0xa2afc9.videoUrl) : "") || _0xa2afc9.videoUrl || _0x4a09fd || "",
      title: (!_0x65d9a6(_0xa2afc9.title) ? String(_0xa2afc9.title).trim() : "") || (!_0x65d9a6(_0xa2afc9.sourceVideoTitle) ? String(_0xa2afc9.sourceVideoTitle).trim() : "") || _0x230545 || "",
      sourceVideoTitle: (!_0x65d9a6(_0xa2afc9.sourceVideoTitle) ? String(_0xa2afc9.sourceVideoTitle).trim() : "") || (!_0x65d9a6(_0xa2afc9.title) ? String(_0xa2afc9.title).trim() : "") || _0x230545 || ""
    };
    if (_0x56745d.has(_0x3188ef)) {
      const _0x52e357 = _0x56745d.get(_0x3188ef);
      const _0xc803b7 = _0x465007[_0x52e357] || {};
      const _0x3828e8 = (_0x5cde7c, _0x9a8b49) => {
        const _0x47e6b8 = String(_0x5cde7c || "").trim();
        const _0x4d496d = String(_0x9a8b49 || "").trim();
        if (_0x47e6b8 && _0x47e6b8 !== "视频评论区潜客") {
          return _0x47e6b8;
        }
        return _0x4d496d || _0x47e6b8;
      };
      _0x465007[_0x52e357] = {
        ..._0xc803b7,
        ..._0x156226,
        content: _0x3828e8(_0xc803b7.content, _0x156226.content),
        time: _0x3828e8(_0xc803b7.time, _0x156226.time),
        timeText: _0x3828e8(_0xc803b7.timeText, _0x156226.timeText),
        ipLocation: _0x3828e8(_0xc803b7.ipLocation, _0x156226.ipLocation),
        location: _0x3828e8(_0xc803b7.location, _0x156226.location),
        videoUrl: _0x3828e8(_0xc803b7.videoUrl, _0x156226.videoUrl) || _0x4a09fd || "",
        title: _0x3828e8(_0xc803b7.title, _0x156226.title) || _0x230545 || "",
        sourceVideoTitle: _0x3828e8(_0xc803b7.sourceVideoTitle, _0x156226.sourceVideoTitle) || _0x3828e8(_0xc803b7.title, _0x156226.title) || _0x230545 || "",
        sourceType: "comment",
        entrySource: "entity_comment",
        entryLabel: "线索采集：视频评论区潜客"
      };
      return;
    }
    _0x56745d.set(_0x3188ef, _0x465007.length);
    _0x465007.push({
      ..._0x156226,
      sourceType: "comment",
      entrySource: "entity_comment",
      entryLabel: "线索采集：视频评论区潜客"
    });
  };
  const _0x35458a = (typeof _0x2fd1ca === "function" ? _0x2fd1ca(document.body) : null) || document.body;
  const _0x21065b = typeof _0x508e33 === "function" ? _0x508e33(_0x35458a) : Array.from(_0x35458a.querySelectorAll("[data-e2e=\"comment-item\"], [class*=\"comment-item\"], div[class*=\"CommentItem\"]"));
  for (const _0x3cebc9 of _0x21065b) {
    if (isDouyinSecondaryCommentNode(_0x3cebc9)) {
      continue;
    }
    let _0x1891d2 = "";
    let _0x50749d = "";
    let _0x4ce8e5 = "";
    let _0x5d4c24 = "";
    let _0x443a66 = "";
    let _0x4aea04 = "";
    if (typeof _0x31aea2 === "function") {
      const _0x3b9aaf = _0x31aea2(_0x3cebc9, {
        requireTime: !!(_0x3205d5?.windowMinutes > 0),
        skipAuthor: true
      });
      if (!_0x3b9aaf) {
        continue;
      }
      _0x1891d2 = String(_0x3b9aaf.nickname || "").trim().replace(/^@+/, "");
      _0x50749d = typeof _0x2aad47 === "function" ? _0x2aad47(_0x3b9aaf.userUrl || "") : String(_0x3b9aaf.userUrl || "");
      _0x4ce8e5 = String(_0x3b9aaf.text || "").trim();
      if (_0x4ce8e5 && _0x1891d2 && _0x4ce8e5.replace(/^@+/, "") === _0x1891d2.replace(/^@+/, "")) {
        _0x4ce8e5 = "";
      }
      _0x5d4c24 = String(_0x3b9aaf.time || "").trim();
      _0x443a66 = String(_0x3b9aaf.timeOriginal || _0x3b9aaf.time || "").trim();
      _0x4aea04 = String(_0x3b9aaf.ipLocation || "").trim();
    } else {
      const _0xe58155 = _0x3cebc9.querySelector?.("a[href*=\"/user/\"]");
      if (!_0xe58155) {
        continue;
      }
      const _0x4cdd1c = _0xe58155.href || _0xe58155.getAttribute?.("href") || "";
      _0x50749d = typeof _0x2aad47 === "function" ? _0x2aad47(_0x4cdd1c) : _0x4cdd1c;
      _0x1891d2 = String(_0xe58155.innerText || _0xe58155.textContent || "").trim().replace(/^@+/, "");
      const _0xc8ddb3 = _0x3cebc9.querySelector?.("[class*=\"content\"], [class*=\"text\"], p");
      _0x4ce8e5 = String(_0xc8ddb3?.innerText || "").trim();
    }
    if (!_0x50749d || !_0x1891d2) {
      continue;
    }
    const _0x4208b2 = typeof _0x421f80 === "function" ? _0x421f80(_0x50749d, _0x1891d2) : _0x50749d;
    if (!_0x4208b2) {
      continue;
    }
    if (isVideoAuthorComment({
      userKey: _0x4208b2,
      userUrl: _0x50749d,
      nickname: _0x1891d2
    }, _0x459947)) {
      continue;
    }
    const _0x30b5b5 = (_0x5d4c24 || _0x443a66.replace(/\s*[·•].*$/, "").trim() || "").trim();
    _0x449eab({
      nickname: _0x1891d2,
      userUrl: _0x50749d,
      userKey: _0x4208b2,
      content: _0x4ce8e5 || "视频评论区潜客",
      time: _0x30b5b5,
      timeText: _0x30b5b5,
      ipLocation: _0x4aea04,
      location: _0x4aea04
    });
  }
  if (typeof _0x32ebfb === "function") {
    for (const _0xcdcc01 of _0x32ebfb("comment") || []) {
      if (!_0xcdcc01?.userKey) {
        continue;
      }
      if (_0xcdcc01.isReplyComment === true || isDouyinNestedReplyComment(_0xcdcc01)) {
        continue;
      }
      if (isVideoAuthorComment(_0xcdcc01, _0x459947)) {
        continue;
      }
      const _0x3db7e4 = String(_0xcdcc01.content || "").trim() || "视频评论区潜客";
      const _0x14317d = String(_0xcdcc01.time || _0xcdcc01.timeText || "").trim();
      const _0x66c04e = _0x14317d.replace(/\s*[·•].*$/, "").trim() || _0x14317d;
      const _0x19422b = String(_0xcdcc01.ipLocation || _0xcdcc01.location || "").trim();
      const _0x34a50a = {
        ..._0xcdcc01,
        content: _0x3db7e4,
        time: _0x66c04e,
        timeText: _0x66c04e,
        ipLocation: _0x19422b,
        location: _0x19422b
      };
      if (_0x3205d5?.active) {
        const _0x2e8609 = _0x3205d5.windowMinutes > 0;
        const _0x20755a = _0x3205d5.locationRegions.length > 0 && _0x3205d5.locationMode === "include";
        if (_0x2e8609 && !_0x34a50a.time || _0x20755a && !_0x34a50a.ipLocation) {
          continue;
        }
      }
      _0x449eab(_0x34a50a);
    }
  }
  _0x465007.__entityCommentFilterStats = {
    rejected: _0x5db9e3,
    kept: _0x465007.length,
    scanned: _0x222e68.size,
    reasons: _0x2dcc20,
    includeKeywords: _0x3205d5?.includeKeywords || [],
    samples: _0x17f59a
  };
  return _0x465007;
}
function resolveEntityCommentEmptyTolerance({
  pageTotal = null,
  scannedCommentCount = 0,
  collectedCount = 0,
  filtersActive = false,
  getScrapeNoNewDataTolerance = null
} = {}) {
  const _0x3b8aa8 = Math.max(Math.max(0, Number(scannedCommentCount) || 0), Math.max(0, Number(collectedCount) || 0));
  const _0xacd71a = typeof getScrapeNoNewDataTolerance === "function" ? getScrapeNoNewDataTolerance(pageTotal, _0x3b8aa8) : 8;
  let _0x4e6c55 = Math.max(_0xacd71a, pageTotal != null && pageTotal > 200 ? 18 : 10);
  if (pageTotal != null && pageTotal > 0 && pageTotal <= 80) {
    _0x4e6c55 = Math.min(_0x4e6c55, 8);
  }
  if (filtersActive) {
    _0x4e6c55 = Math.min(_0x4e6c55, pageTotal != null && pageTotal <= 80 ? 8 : 12);
  }
  return Math.max(4, _0x4e6c55);
}
function resolveEntityCommentMaxBoundaryProbes(_0x522c65 = null) {
  if (_0x522c65 != null && _0x522c65 > 0 && _0x522c65 <= 60) {
    return 3;
  }
  if (_0x522c65 != null && _0x522c65 > 0 && _0x522c65 <= 200) {
    return 6;
  }
  if (_0x522c65 != null && _0x522c65 > 500) {
    return 16;
  }
  return 10;
}
async function forceEntityCommentLoadMore(_0x5e7dce = {}, _0x2397ce, _0x60025e, _0x44bc63 = 1) {
  const _0x438dc0 = typeof _0x5e7dce.waitFn === "function" ? _0x5e7dce.waitFn : async _0x49b437 => {
    await new Promise(_0x14a805 => setTimeout(_0x14a805, _0x49b437));
  };
  try {
    if (typeof _0x5e7dce.clickCommentPanelLoadingPlaceholder === "function") {
      await _0x5e7dce.clickCommentPanelLoadingPlaceholder(_0x2397ce, _0x60025e);
    }
  } catch (_0x5e55ee) {}
  let _0x3dd6ed = null;
  try {
    _0x3dd6ed = typeof _0x5e7dce.getCommentScrollMetrics === "function" ? _0x5e7dce.getCommentScrollMetrics(_0x2397ce) : null;
  } catch (_0x1f5812) {}
  const _0x4647e3 = _0x3dd6ed?.container;
  if (_0x4647e3) {
    try {
      const _0x2036a7 = _0x4647e3.clientHeight || 400;
      const _0x1c4e48 = Math.max(160, Math.round(_0x2036a7 * 0.45));
      _0x4647e3.scrollTop = Math.max(0, (_0x4647e3.scrollTop || 0) - _0x1c4e48);
      await _0x438dc0(220);
      _0x4647e3.scrollTop = Math.max(0, _0x4647e3.scrollHeight || 0);
      await _0x438dc0(280);
      const _0xf7a9b1 = _0x4647e3.getBoundingClientRect();
      const _0x7ea6c1 = _0xf7a9b1.left + _0xf7a9b1.width / 2;
      const _0x395691 = _0xf7a9b1.top + Math.min(_0xf7a9b1.height * 0.88, _0xf7a9b1.height - 8);
      for (const _0x21b891 of [1200, 2000, 2800]) {
        _0x4647e3.dispatchEvent(new WheelEvent("wheel", {
          deltaY: _0x21b891,
          deltaMode: 0,
          clientX: _0x7ea6c1,
          clientY: _0x395691,
          bubbles: false,
          cancelable: true
        }));
        await _0x438dc0(120);
      }
      _0x4647e3.scrollTop = Math.max(0, (_0x4647e3.scrollHeight || 0) + 80);
    } catch (_0x52ba9b) {}
  }
  try {
    if (typeof _0x5e7dce.aggressiveCommentListScroll === "function") {
      await _0x5e7dce.aggressiveCommentListScroll(_0x2397ce, _0x60025e, Math.min(8, 3 + _0x44bc63));
    }
  } catch (_0x54dbd6) {}
  try {
    if (typeof _0x5e7dce.scrollCommentList === "function") {
      await _0x5e7dce.scrollCommentList(_0x2397ce, -80, _0x60025e, {
        delayMin: 60,
        delayMax: 110
      });
      await _0x5e7dce.scrollCommentList(_0x2397ce, 220, _0x60025e, {
        delayMin: 80,
        delayMax: 140
      });
      await _0x5e7dce.scrollCommentList(_0x2397ce, -200, _0x60025e, {
        delayMin: 80,
        delayMax: 140
      });
      await _0x5e7dce.scrollCommentList(_0x2397ce, 2400, _0x60025e, {
        delayMin: 140,
        delayMax: 240
      });
    }
  } catch (_0x2262b6) {}
  await _0x438dc0(700 + Math.min(900, _0x44bc63 * 80));
}
async function trySwitchEntityCommentSortLatest(_0x1cf342 = {}, _0x139b55) {
  const _0x9adf31 = _0x1cf342.isVisibleElement || isVisibleElement;
  const _0x245f00 = [_0x139b55, document.body].filter(Boolean);
  for (const _0x186d73 of _0x245f00) {
    if (!_0x186d73?.querySelectorAll) {
      continue;
    }
    const _0x4e9536 = Array.from(_0x186d73.querySelectorAll("div, span, button, [role=\"tab\"]")).find(_0x48c395 => {
      if (!_0x9adf31(_0x48c395) || (_0x48c395.children?.length || 0) > 3) {
        return false;
      }
      const _0x532b97 = String(_0x48c395.textContent || "").replace(/\s+/g, " ").trim();
      return _0x532b97 === "最新" || _0x532b97 === "按时间" || _0x532b97 === "时间";
    });
    if (!_0x4e9536) {
      continue;
    }
    try {
      if (typeof _0x1cf342.simulateHumanClick === "function") {
        await _0x1cf342.simulateHumanClick(_0x4e9536, _0x1cf342.loopId || "ENTITY_LEADGEN");
      } else {
        _0x4e9536.click();
      }
      return String(_0x4e9536.textContent || "").trim() || "最新";
    } catch (_0x55b6e9) {}
  }
  return "";
}
async function collectEntityCommentUsersByScrolling(_0x421ae6 = {}, _0x58d172 = {}) {
  const {
    token: _0x3b4dcc,
    taskId: _0x33a9cb,
    searchKeyword = "",
    seenKeys: _0x160d5f,
    collectedUsers: _0x7a85dc,
    maxCollect = 0,
    authorFilter = null,
    progressLabel = "视频评论区潜客",
    waitFn: _0x242093,
    logFn: _0x365776,
    isCancelled: _0x427a4f,
    scrollCommentList: _0x3ae64f,
    aggressiveCommentListScroll: _0x4d550d,
    pruneStaleCommentDom: _0x29503a,
    getCommentEndHintText: _0x1fb755,
    getCommentScrollMetrics: _0x198aba,
    getScrapeNoNewDataTolerance: _0x290824,
    resolveCommentScope: _0x34ac01,
    initialPageTotal = null,
    commentFilters = null,
    loopId = "ENTITY_LEADGEN",
    targetVideoUrl = "",
    sourceVideoTitle = "",
    videoTitle = "",
    installFeedSwipeLock: _0x4645d3,
    removeFeedSwipeLock: _0xb89538,
    hasVideoDrifted: _0x3e8f55
  } = _0x58d172;
  const _0x481592 = String(sourceVideoTitle || videoTitle || "").replace(/\s+/g, " ").trim();
  const _0xcc4754 = normalizeAuthorFilter(authorFilter || {});
  const _0x521824 = typeof _0x365776 === "function" ? _0x365776 : () => {};
  const _0x1e8578 = typeof _0x242093 === "function" ? _0x242093 : async _0x3b4b88 => {
    await new Promise(_0x12a286 => setTimeout(_0x12a286, _0x3b4b88));
  };
  const _0x50b7c1 = () => typeof _0x427a4f === "function" ? _0x427a4f() : false;
  const _0x3e2541 = (typeof _0x34ac01 === "function" ? _0x34ac01() : null) || document.body;
  const _0x3875ea = async (_0x3bb424, _0x105e58, _0xf44a17, _0x484d0c = {}) => {
    if (typeof _0x3ae64f !== "function") {
      return false;
    }
    return _0x3ae64f(_0x3bb424, _0x105e58, _0xf44a17, {
      ..._0x484d0c,
      containWheel: true,
      bubbles: false
    });
  };
  const _0x55cdcc = async (_0x3b325c, _0x31c453, _0x3a0bb2 = 1) => {
    if (typeof _0x4d550d !== "function") {
      return false;
    }
    return _0x4d550d(_0x3b325c, _0x31c453, _0x3a0bb2);
  };
  const _0x84e003 = () => ({
    ..._0x421ae6,
    waitFn: _0x1e8578,
    getCommentScrollMetrics: _0x198aba,
    aggressiveCommentListScroll: _0x55cdcc,
    scrollCommentList: _0x3875ea,
    clickCommentPanelLoadingPlaceholder: _0x421ae6.clickCommentPanelLoadingPlaceholder || _0x58d172.clickCommentPanelLoadingPlaceholder || null,
    isCommentPanelContentLoading: _0x421ae6.isCommentPanelContentLoading || _0x58d172.isCommentPanelContentLoading || null
  });
  const _0x548422 = async (_0x63e5e5 = "") => {
    const _0xd3dbf0 = _0x84e003().isCommentPanelContentLoading;
    const _0x2d1dc2 = _0x84e003().clickCommentPanelLoadingPlaceholder;
    let _0x2e3b50 = false;
    try {
      _0x2e3b50 = typeof _0xd3dbf0 === "function" ? !!_0xd3dbf0(_0x3e2541) : false;
    } catch (_0x43bb0b) {
      _0x2e3b50 = false;
    }
    if (!_0x2e3b50 || typeof _0x2d1dc2 !== "function") {
      return false;
    }
    if (_0x63e5e5) {
      _0x521824(_0x33a9cb, progressLabel + "：" + _0x63e5e5, "info");
    }
    try {
      await _0x2d1dc2(_0x3e2541, loopId);
      return true;
    } catch (_0x2c77f0) {
      return false;
    }
  };
  try {
    if (typeof _0x4645d3 === "function") {
      _0x4645d3(targetVideoUrl);
    }
  } catch (_0x3da228) {}
  try {
    const _0x54570e = () => {
      try {
        if (typeof _0x3e8f55 === "function" && _0x3e8f55(targetVideoUrl)) {
          return true;
        }
      } catch (_0x1eb071) {}
      return false;
    };
    const _0x2d55bd = () => {
      try {
        return inspectEntityCommentPanel(_0x421ae6);
      } catch (_0x1ace04) {
        return {
          opened: false,
          visibleItemCount: 0,
          badgeOnly: false
        };
      }
    };
    {
      const _0xf9fbdb = _0x2d55bd();
      if (!_0xf9fbdb.opened) {
        _0x521824(_0x33a9cb, _0xf9fbdb.badgeOnly ? progressLabel + "：评论角标有数量但列表未打开，停止本页并重新进入" : progressLabel + "：评论区未真正打开，停止本页并重新进入", "warning");
        return {
          needReload: true,
          panelNotOpen: true,
          pageTotal: _0xf9fbdb.total ?? (Number.isFinite(Number(initialPageTotal)) ? Math.floor(Number(initialPageTotal)) : null)
        };
      }
    }
    const _0x3a2dda = () => {
      const _0x237477 = _0x1e2cf6 => {
        try {
          if (typeof _0x421ae6.getCommentsTotalCount !== "function" || !_0x1e2cf6) {
            return null;
          }
          const _0x3a506d = _0x421ae6.getCommentsTotalCount(_0x1e2cf6);
          if (_0x3a506d != null && Number.isFinite(_0x3a506d) && _0x3a506d >= 0) {
            return Math.floor(_0x3a506d);
          }
        } catch (_0x5f5148) {}
        return null;
      };
      return _0x237477(document.body) || _0x237477(_0x3e2541) || (Number.isFinite(Number(initialPageTotal)) && Number(initialPageTotal) > 0 ? Math.floor(Number(initialPageTotal)) : null);
    };
    let _0x23262e = _0x3a2dda();
    const _0x1dd2bd = _0x504fd6 => {
      let _0x1336c9 = 200;
      if (_0x504fd6 != null && _0x504fd6 > 0) {
        _0x1336c9 = Math.min(Math.max(Math.ceil(_0x504fd6 / 6 * 1.3), 120), 2000);
      }
      if (maxCollect > 0) {
        _0x1336c9 = Math.min(_0x1336c9, Math.max(120, Math.ceil(maxCollect / 4) + 100));
      }
      return _0x1336c9;
    };
    let _0x328b07 = _0x1dd2bd(_0x23262e);
    _0x521824(_0x33a9cb, progressLabel + "：开始采集" + (_0x23262e != null ? "（约 " + _0x23262e + " 条评论）" : ""));
    const _0x1b2cfb = () => {
      const _0x2ed17d = _0x3a2dda();
      if (_0x2ed17d != null && _0x2ed17d !== _0x23262e) {
        _0x23262e = _0x2ed17d;
        const _0x322995 = _0x1dd2bd(_0x23262e);
        if (_0x322995 > _0x328b07) {
          _0x328b07 = _0x322995;
        }
        _0x2de19f = resolveEntityCommentMaxBoundaryProbes(_0x23262e);
      } else if (_0x2ed17d != null) {
        _0x23262e = _0x2ed17d;
      }
      if (_0x23262e != null) {
        return "，页面约 " + _0x23262e + " 条评论";
      } else {
        return "";
      }
    };
    const _0x402ad7 = () => {
      try {
        if (typeof _0x198aba === "function") {
          return _0x198aba(_0x3e2541);
        }
      } catch (_0x2e0d1b) {}
      return null;
    };
    let _0x27d0a2 = null;
    let _0x229956 = 0;
    let _0x3d761f = false;
    const _0x5e8b97 = new Set();
    const _0x4a0f9d = _0xe7cdf2 => {
      if (!Array.isArray(_0xe7cdf2) || !_0xe7cdf2.length) {
        return;
      }
      for (const _0x71a6ee of _0xe7cdf2) {
        const _0x2b37a0 = String(_0x71a6ee || "").trim();
        if (!_0x2b37a0 || _0x5e8b97.has(_0x2b37a0)) {
          continue;
        }
        _0x5e8b97.add(_0x2b37a0);
        const _0x57e8e0 = /→ 过筛/.test(_0x2b37a0) && !/未过筛/.test(_0x2b37a0);
        _0x521824(_0x33a9cb, progressLabel + "：" + _0x2b37a0, _0x57e8e0 ? "success" : "info");
      }
    };
    try {
      if (typeof _0x421ae6.normalizeEntityCommentFilters === "function") {
        _0x3d761f = !!_0x421ae6.normalizeEntityCommentFilters(commentFilters || {})?.active;
      } else if (commentFilters && typeof commentFilters === "object") {
        _0x3d761f = !!(Number(commentFilters.windowMinutes) > 0) || !!Array.isArray(commentFilters.includeKeywords) && !!commentFilters.includeKeywords.length || !!Array.isArray(commentFilters.locationRegions) && !!commentFilters.locationRegions.length;
      }
    } catch (_0x17b033) {}
    const _0x157504 = () => {
      const _0x13d565 = collectEntityCommentsFromPage(_0x421ae6, _0xcc4754, commentFilters, {
        sourceVideoUrl: targetVideoUrl,
        targetVideoUrl: targetVideoUrl,
        sourceVideoTitle: _0x481592,
        videoTitle: _0x481592
      }) || [];
      _0x27d0a2 = _0x13d565.__entityCommentFilterStats || null;
      if (_0x27d0a2) {
        const _0x210f4f = Number(_0x27d0a2.scanned) || 0;
        if (_0x210f4f > _0x229956) {
          _0x229956 = _0x210f4f;
        }
      }
      try {
        delete _0x13d565.__entityCommentFilterStats;
      } catch (_0x42148f) {}
      return _0x13d565;
    };
    const _0x35c28a = () => {
      try {
        if (typeof _0x421ae6.countApiUsers === "function") {
          return Number(_0x421ae6.countApiUsers() || 0);
        } else {
          return 0;
        }
      } catch (_0x402972) {
        return 0;
      }
    };
    const _0x3adcef = () => resolveEntityCommentEmptyTolerance({
      pageTotal: _0x23262e,
      scannedCommentCount: _0x229956,
      collectedCount: _0x7a85dc.length,
      filtersActive: _0x3d761f,
      getScrapeNoNewDataTolerance: _0x290824
    });
    let _0x2de19f = resolveEntityCommentMaxBoundaryProbes(_0x23262e);
    let _0x2a96ec = 0;
    let _0x375c0b = 0;
    let _0x5057e1 = 0;
    let _0x23b071 = 0;
    let _0x1f0b9f = 0;
    let _0x31fd07 = 0;
    let _0x4f0c8c = "";
    let _0x507dac = _0x35c28a();
    let _0x197e4f = false;
    const _0x2330d0 = new Map();
    for (const _0x58c4af of _0x7a85dc) {
      if (_0x58c4af?.userKey) {
        _0x2330d0.set(_0x58c4af.userKey, _0x58c4af);
      }
    }
    const _0x25d1c0 = _0x4e6f61 => {
      const _0x2755f7 = _0x2330d0.get(_0x4e6f61.userKey);
      if (!_0x2755f7) {
        return false;
      }
      const _0x25cf90 = (_0x5ebf77, _0x1d5f0b) => {
        const _0x53a433 = String(_0x5ebf77 || "").trim();
        const _0x22a933 = String(_0x1d5f0b || "").trim();
        if (_0x53a433 && _0x53a433 !== "视频评论区潜客" && _0x53a433 !== "实体获客" && _0x53a433 !== "线索采集") {
          return _0x53a433;
        }
        return _0x22a933 || _0x53a433;
      };
      _0x2755f7.content = _0x25cf90(_0x2755f7.content, _0x4e6f61.content);
      _0x2755f7.time = _0x25cf90(_0x2755f7.time, _0x4e6f61.time);
      _0x2755f7.timeText = _0x25cf90(_0x2755f7.timeText, _0x4e6f61.timeText);
      _0x2755f7.ipLocation = _0x25cf90(_0x2755f7.ipLocation, _0x4e6f61.ipLocation) || _0x25cf90(_0x2755f7.location, _0x4e6f61.location);
      _0x2755f7.location = _0x25cf90(_0x2755f7.location, _0x4e6f61.location) || _0x25cf90(_0x2755f7.ipLocation, _0x4e6f61.ipLocation);
      const _0x22c0b1 = _0x25cf90(_0x2755f7.videoUrl, _0x4e6f61.videoUrl);
      if (_0x22c0b1) {
        _0x2755f7.videoUrl = _0x22c0b1;
      } else if (!_0x2755f7.videoUrl && targetVideoUrl) {
        _0x2755f7.videoUrl = typeof _0x421ae6.canonicalizeDouyinVideoUrl === "function" ? _0x421ae6.canonicalizeDouyinVideoUrl(targetVideoUrl) || targetVideoUrl : targetVideoUrl;
      }
      const _0x570ae2 = _0x25cf90(_0x2755f7.title, _0x4e6f61.title) || _0x25cf90(_0x2755f7.sourceVideoTitle, _0x4e6f61.sourceVideoTitle) || _0x481592;
      if (_0x570ae2) {
        _0x2755f7.title = _0x570ae2;
        _0x2755f7.sourceVideoTitle = _0x570ae2;
      }
      return true;
    };
    {
      const _0x5efe6c = _0x402ad7();
      if (_0x5efe6c?.container) {
        _0x197e4f = true;
      }
    }
    try {
      const _0x1d368f = await trySwitchEntityCommentSortLatest({
        isVisibleElement: isVisibleElement,
        simulateHumanClick: _0x58d172.simulateHumanClick,
        loopId: loopId
      }, _0x3e2541);
      if (_0x1d368f) {
        _0x521824(_0x33a9cb, progressLabel + "：已切换为「" + _0x1d368f + "」排序");
        if ((await _0x1e8578(900)) === false || _0x50b7c1()) {
          return {
            cancelled: true,
            pageTotal: _0x23262e
          };
        }
      }
    } catch (_0x6f87a2) {}
    for (let _0x37ea24 = 0; _0x37ea24 < _0x328b07; _0x37ea24 += 1) {
      if (_0x50b7c1()) {
        return {
          cancelled: true,
          pageTotal: _0x23262e
        };
      }
      if (_0x54570e()) {
        _0x521824(_0x33a9cb, progressLabel + "：检测到已滑到其他视频，停止本页并重新进入", "warning");
        return {
          drifted: true,
          needReload: true,
          pageTotal: _0x23262e
        };
      }
      if (_0x37ea24 === 0 || _0x37ea24 % 5 === 0) {
        const _0x338ba0 = _0x2d55bd();
        if (!_0x338ba0.opened) {
          _0x521824(_0x33a9cb, _0x338ba0.badgeOnly ? progressLabel + "：采集中发现评论列表未打开（角标约 " + (_0x338ba0.total ?? "?") + "），重新进入视频" : progressLabel + "：采集中评论区丢失，重新进入视频", "warning");
          return {
            needReload: true,
            panelNotOpen: true,
            pageTotal: _0x338ba0.total ?? _0x23262e
          };
        }
      }
      if (maxCollect > 0 && _0x7a85dc.length >= maxCollect) {
        _0x521824(_0x33a9cb, progressLabel + "：已达采集上限 " + maxCollect + _0x1b2cfb());
        return {
          reachedLimit: true,
          pageTotal: _0x23262e
        };
      }
      const _0x483a1c = _0x7a85dc.length;
      const _0x284010 = _0x157504();
      let _0x1037a5 = 0;
      let _0x351975 = 0;
      for (const _0x16ed53 of _0x284010) {
        if (!_0x16ed53?.userKey) {
          continue;
        }
        if (isVideoAuthorComment(_0x16ed53, _0xcc4754)) {
          _0x351975 += 1;
          _0x5057e1 += 1;
          continue;
        }
        if (_0x160d5f.has(_0x16ed53.userKey)) {
          _0x25d1c0(_0x16ed53);
          continue;
        }
        _0x160d5f.add(_0x16ed53.userKey);
        const _0x4cca04 = {
          ..._0x16ed53,
          sourceType: "comment",
          searchKeyword: searchKeyword,
          videoUrl: _0x16ed53.videoUrl || (typeof _0x421ae6.canonicalizeDouyinVideoUrl === "function" ? _0x421ae6.canonicalizeDouyinVideoUrl(targetVideoUrl) : "") || String(targetVideoUrl || "").trim(),
          title: _0x16ed53.title || _0x16ed53.sourceVideoTitle || _0x481592 || "",
          sourceVideoTitle: _0x16ed53.sourceVideoTitle || _0x16ed53.title || _0x481592 || ""
        };
        _0x7a85dc.push(_0x4cca04);
        _0x2330d0.set(_0x16ed53.userKey, _0x4cca04);
        _0x1037a5 += 1;
        if (maxCollect > 0 && _0x7a85dc.length >= maxCollect) {
          break;
        }
      }
      const _0x5f749d = _0x35c28a();
      const _0x18e170 = _0x5f749d > _0x507dac;
      if (_0x5f749d > _0x507dac) {
        _0x507dac = _0x5f749d;
      }
      const _0x38d12b = _0x3adcef();
      const _0x101593 = _0x402ad7();
      const _0xba164d = !!_0x101593?.canScrollDown;
      let _0x45c599 = false;
      try {
        const _0x22fb74 = _0x84e003().isCommentPanelContentLoading;
        if (typeof _0x22fb74 === "function") {
          _0x45c599 = !!_0x22fb74(_0x3e2541 || document.body);
        }
      } catch (_0x303c83) {}
      const _0x40081c = [_0x23262e == null ? "" : _0x23262e, _0x507dac, Math.floor((Number(_0x101593?.scrollHeight) || 0) / 40), _0x229956].join("|");
      if (_0x40081c !== _0x4f0c8c) {
        _0x4f0c8c = _0x40081c;
        _0x1f0b9f = 0;
      } else if (_0x1037a5 === 0 && !_0x18e170) {
        _0x1f0b9f += 1;
      }
      if (_0x1037a5 > 0 || _0x18e170) {
        _0x2a96ec = 0;
        _0x375c0b = 0;
        _0x1f0b9f = 0;
        if (_0x1037a5 > 0) {
          _0x23b071 = 0;
        }
        if (_0x1037a5 > 0) {
          _0x521824(_0x33a9cb, progressLabel + "：本轮新增 " + _0x1037a5 + "，累计潜客 " + _0x7a85dc.length + _0x1b2cfb() + (_0x351975 ? "（已过滤作者评论 " + _0x351975 + "）" : ""), "info", {
            users: _0x7a85dc.slice(_0x483a1c),
            sourceType: "comment"
          });
        }
        _0x4a0f9d(_0x27d0a2?.samples || []);
        if (_0x27d0a2) {
          _0x27d0a2.samples = [];
        }
      } else {
        _0x2a96ec += 1;
        _0x375c0b += 1;
        _0x4a0f9d(_0x27d0a2?.samples || []);
        if (_0x27d0a2) {
          _0x27d0a2.samples = [];
        }
        if (_0x2a96ec === _0x38d12b || _0x2a96ec > 0 && _0x2a96ec % 10 === 0) {
          let _0x540ab6 = "";
          const _0x398629 = _0x27d0a2;
          if (_0x398629 && Number(_0x398629.rejected) > 0 && _0x7a85dc.length === 0) {
            const _0x2024e7 = Object.entries(_0x398629.reasons || {}).sort((_0x3a237e, _0x17e489) => _0x17e489[1] - _0x3a237e[1]).slice(0, 2).map(([_0x5175a1, _0x371c3c]) => _0x5175a1 + "×" + _0x371c3c).join("、");
            const _0x5c9469 = Array.isArray(_0x398629.includeKeywords) && _0x398629.includeKeywords.length ? "含词「" + _0x398629.includeKeywords.join("、") + "」" : "当前筛选";
            _0x540ab6 = "；" + _0x5c9469 + "未过筛 " + _0x398629.rejected + " 条" + (_0x2024e7 ? "（" + _0x2024e7 + "）" : "") + "，未命中不计入潜客";
          } else if (_0x7a85dc.length === 0) {
            try {
              const _0xbd828f = typeof _0x421ae6.normalizeEntityCommentFilters === "function" ? _0x421ae6.normalizeEntityCommentFilters(commentFilters || {}) : null;
              const _0x1c9bd4 = _0xbd828f?.includeKeywords || [];
              if (_0x1c9bd4.length) {
                _0x540ab6 = "；当前筛选含词「" + _0x1c9bd4.join("、") + "」，未命中不计入潜客";
              }
            } catch (_0xd3accf) {}
          }
          _0x521824(_0x33a9cb, progressLabel + "：暂无新增潜客（连续 " + _0x2a96ec + " 轮），累计 " + _0x7a85dc.length + _0x1b2cfb() + _0x540ab6);
        }
      }
      const _0x513c80 = typeof _0x1fb755 === "function" ? _0x1fb755(_0x3e2541) : "";
      if (_0x513c80) {
        _0x31fd07 += 1;
        if (_0x31fd07 === 1) {
          _0x521824(_0x33a9cb, progressLabel + "：检测到「" + _0x513c80 + "」，再下滚复核 1~2 次以防遗漏最后一页评论…", "info");
        } else if (_0x31fd07 >= 2) {
          _0x521824(_0x33a9cb, _0x7a85dc.length === 0 ? progressLabel + "：界面显示「" + _0x513c80 + "」，复核完毕，跳过当前视频" + _0x1b2cfb() : progressLabel + "：界面显示「" + _0x513c80 + "」，滚动复核完毕，本视频采集结束（潜客 " + _0x7a85dc.length + _0x1b2cfb() + "）", "info");
          break;
        }
      } else {
        _0x31fd07 = 0;
      }
      const _0x1a43c4 = _0x23262e != null && _0x23262e > 0 && _0x229956 >= Math.min(_0x23262e, Math.max(8, Math.ceil(_0x23262e * 0.55)));
      const _0x59f24e = _0x23262e != null && _0x23262e > 0 && _0x1f0b9f >= Math.min(5, _0x38d12b) && !_0xba164d && !_0x18e170 && (_0x45c599 || _0x2a96ec >= Math.min(5, _0x38d12b)) && (_0x1a43c4 || _0x2a96ec >= _0x38d12b || _0x375c0b >= _0x38d12b);
      const _0x112956 = _0x375c0b >= _0x38d12b && _0x23b071 >= _0x2de19f;
      if (_0x59f24e) {
        _0x521824(_0x33a9cb, _0x7a85dc.length === 0 ? progressLabel + "：评论分页停滞（约 " + _0x23262e + " 条未再增长），跳过当前视频" : progressLabel + "：评论分页停滞，本视频采集结束（潜客 " + _0x7a85dc.length + _0x1b2cfb() + "）", "warning");
        break;
      }
      if (_0x2a96ec >= _0x38d12b) {
        if (!_0x112956 && _0x23b071 < _0x2de19f) {
          _0x23b071 += 1;
          _0x521824(_0x33a9cb, progressLabel + "：继续加载更多评论（" + _0x23b071 + "/" + _0x2de19f + "），当前潜客 " + _0x7a85dc.length + _0x1b2cfb(), "warning");
          _0x2a96ec = Math.max(0, Math.floor(_0x38d12b / 3));
          await forceEntityCommentLoadMore(_0x84e003(), _0x3e2541, loopId, _0x2a96ec + _0x23b071);
        } else {
          _0x521824(_0x33a9cb, _0x7a85dc.length === 0 ? progressLabel + "：未采到评论潜客，跳过当前视频" + _0x1b2cfb() : progressLabel + "：本视频采集结束（潜客 " + _0x7a85dc.length + _0x1b2cfb() + "）");
          break;
        }
      }
      try {
        if (typeof _0x29503a === "function") {
          const _0x319abc = Number(_0x29503a(_0x3e2541, {
            context: "entity",
            taskMode: "scrape"
          }) || 0);
          if (_0x319abc > 0) {
            const _0xfe4947 = Date.now();
            if (!collectEntityCommentUsersByScrolling._lastPruneLogAt || _0xfe4947 - collectEntityCommentUsersByScrolling._lastPruneLogAt > 8000) {
              collectEntityCommentUsersByScrolling._lastPruneLogAt = _0xfe4947;
              _0x521824(_0x33a9cb, "评论区 DOM 瘦身：已移除 " + _0x319abc + " 个旧节点，继续加载", "info");
            }
          }
        }
      } catch (_0x4a26b6) {}
      let _0xf6c01a = false;
      if (_0x37ea24 === 0 || _0x2a96ec > 0 || !_0xba164d) {
        await _0x548422(!_0xba164d || _0x2a96ec >= 2 ? "评论区显示「加载中」或已触底，上滑继续加载…" : "");
      }
      if (!_0xba164d) {
        await forceEntityCommentLoadMore(_0x84e003(), _0x3e2541, loopId, Math.max(1, _0x2a96ec));
        _0xf6c01a = true;
      } else {
        try {
          _0xf6c01a = !!(await _0x55cdcc(_0x3e2541, loopId, Math.max(1, _0x2a96ec || 1)));
        } catch (_0x7ba7db) {}
        try {
          if (_0x2a96ec >= 2) {
            await _0x3875ea(_0x3e2541, -80, loopId, {
              delayMin: 60,
              delayMax: 120
            });
            await _0x3875ea(_0x3e2541, 220, loopId, {
              delayMin: 80,
              delayMax: 140
            });
          }
          _0xf6c01a = !!(await _0x3875ea(_0x3e2541, 1400, loopId, {
            delayMin: 90,
            delayMax: 180
          })) || _0xf6c01a;
          _0xf6c01a = !!(await _0x3875ea(_0x3e2541, 1800, loopId, {
            delayMin: 110,
            delayMax: 220
          })) || _0xf6c01a;
        } catch (_0x58fb5a) {}
      }
      if (_0x54570e()) {
        _0x521824(_0x33a9cb, progressLabel + "：滚动后检测到已滑到其他视频，停止本页并重新进入", "warning");
        return {
          drifted: true,
          needReload: true,
          pageTotal: _0x23262e
        };
      }
      const _0x298418 = _0x35c28a();
      if (_0x298418 > _0x507dac) {
        _0x507dac = _0x298418;
        _0x2a96ec = Math.max(0, _0x2a96ec - 3);
        _0x375c0b = Math.max(0, _0x375c0b - 3);
      }
      if (!_0xf6c01a && _0x2a96ec > 0 && _0x2a96ec % 4 === 0) {
        const _0x138f51 = _0x402ad7();
        if (!_0x197e4f && _0x138f51?.container) {
          _0x197e4f = true;
        }
      }
      if ((await _0x1e8578(750 + Math.random() * 550)) === false || _0x50b7c1()) {
        return {
          cancelled: true,
          pageTotal: _0x23262e
        };
      }
    }
    try {
      _0x29503a?.(_0x3e2541, {
        context: "entity",
        taskMode: "scrape"
      });
    } catch (_0x3d34b5) {}
    const _0x136375 = (() => {
      if (_0x7a85dc.length > 0 || !_0x3d761f) {
        return "";
      }
      const _0x227b42 = _0x27d0a2;
      if (_0x227b42 && Number(_0x227b42.rejected) > 0) {
        const _0x43da8f = Array.isArray(_0x227b42.includeKeywords) && _0x227b42.includeKeywords.length ? "含词「" + _0x227b42.includeKeywords.join("、") + "」" : "当前筛选";
        return "；" + _0x43da8f + "未过筛 " + _0x227b42.rejected + " 条，未命中不计入潜客";
      }
      return "；筛选后无新潜客";
    })();
    _0x521824(_0x33a9cb, progressLabel + "：本视频采集结束，潜客 " + _0x7a85dc.length + _0x1b2cfb() + (_0x5057e1 ? "，已过滤作者评论 " + _0x5057e1 : "") + _0x136375);
    return {
      exhausted: true,
      pageTotal: _0x23262e
    };
  } finally {
    try {
      if (typeof _0xb89538 === "function") {
        _0xb89538();
      }
    } catch (_0x5970b1) {}
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
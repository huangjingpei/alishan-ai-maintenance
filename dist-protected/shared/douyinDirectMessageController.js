'use strict';

const {
  looksLikeDouyinGroupChatName,
  looksLikeOpenDouyinGroupChatHeader
} = require("./douyinDmGroupChat");
const {
  isDouyinStrangerMessagesFolderName,
  isGenericDouyinChatNickname,
  normalizeDouyinChatPreview,
  scoreDouyinChatRowMatch
} = require("./douyinChatModule");
const {
  isDouyinChatSystemHint,
  classLooksLikeSelfChatBubble,
  isChatBubbleAlignedSelf,
  isRealSelfOutboundChatMessage
} = require("./douyinChatSelfMessage");
const {
  classifyDouyinDmPlatformHint,
  resolveDouyinDmSendResult
} = require("./douyinDmSendResult");
const {
  resolveSelfWarmupContentMode
} = require("./selfWarmupTemplates");
function createDouyinDirectMessageController(_0x1c0e18 = {}) {
  const {
    clipTraceText: _0x2eceab,
    closeAllModals: _0x4b4f4c,
    findSmartElement: _0x249c49,
    getDmV2List: _0x5cf508,
    getDmV2String: _0xd60148,
    getElementClassText: _0x5e3849,
    getComputedStyle: _0x37eae4,
    hasDmRuntimeReady: _0x3f5c72,
    insertTextIntoEditable: _0x1ed148,
    ipcRenderer: _0x2a9363,
    isElementInViewport: _0x41bd1e,
    isVisibleElement: _0x51232f,
    randomDelay: _0x5d9478,
    shouldAbort: _0x38be95,
    simulateHumanClick: _0x259543,
    simulateTrustedElementClick: _0x2757b0,
    simulateTrustedEnter: _0x442f18,
    sleep: _0x2a6d31,
    waitForDmInput: _0x366477,
    waitForSmartElement: _0x145e95,
    state: _0xa9be1b
  } = _0x1c0e18;
  function _0x254a15() {
    const _0x483874 = _0xd60148("dmBlockActiveRoots");
    const _0xacb2ae = _0xd60148("dmDialog");
    const _0x5b2977 = _0xd60148("dmBlockNodeCandidates");
    const _0x19bc5b = _0xd60148("dmBlockGlobalHints");
    if (!_0x483874 || !_0xacb2ae || !_0x5b2977 || !_0x19bc5b) {
      return null;
    }
    let _0x110dc8 = [];
    try {
      _0x110dc8 = Array.from(document.querySelectorAll(_0x483874)).filter(_0x18b952 => _0x51232f(_0x18b952) && _0x41bd1e(_0x18b952, 0));
    } catch (_0x3dc7db) {
      return null;
    }
    const _0xa79ae6 = _0x110dc8.length ? _0x110dc8 : (() => {
      try {
        return Array.from(document.querySelectorAll(_0xacb2ae));
      } catch (_0x2ba5dc) {
        return [];
      }
    })();
    const _0x404d7e = [];
    for (const _0x36027e of _0xa79ae6) {
      try {
        _0x404d7e.push(..._0x36027e.querySelectorAll(_0x5b2977));
      } catch (_0x46fb96) {}
    }
    try {
      _0x404d7e.push(...document.querySelectorAll(_0x19bc5b));
    } catch (_0x4a720b) {}
    const _0x5a6d6e = [];
    for (const _0x90c4ce of Array.from(new Set(_0x404d7e))) {
      if (!_0x51232f(_0x90c4ce) || !_0x41bd1e(_0x90c4ce, 0)) {
        continue;
      }
      const _0x15f812 = (_0x90c4ce.innerText || _0x90c4ce.textContent || "").replace(/\s+/g, " ").trim();
      if (!_0x15f812 || _0x15f812.length > 280) {
        continue;
      }
      const _0x1641e9 = classifyDouyinDmPlatformHint(_0x15f812);
      if (_0x1641e9) {
        _0x5a6d6e.push({
          hint: _0x1641e9,
          textLength: _0x15f812.length,
          childCount: _0x90c4ce.children?.length || 0
        });
      }
    }
    _0x5a6d6e.sort((_0x25b53d, _0x179e42) => _0x25b53d.textLength - _0x179e42.textLength || _0x25b53d.childCount - _0x179e42.childCount);
    return _0x5a6d6e[0]?.hint || null;
  }
  function _0x905647(_0x1fd80d, _0x146914 = null) {
    const _0x4fbf72 = _0x146914 && Object.keys(_0x146914).length ? " | " + JSON.stringify(_0x146914) : "";
    const _0x34544c = "[SelfWarmup-DM] " + _0x1fd80d + _0x4fbf72;
    console.log(_0x34544c);
    try {
      _0x2a9363.send("self-warmup-dm-log", {
        message: _0x1fd80d,
        extra: _0x146914,
        ts: Date.now()
      });
    } catch (_0x5c6d99) {}
  }
  function _0xb7d33f(_0x1a76af) {
    if (!_0x1a76af) {
      return {
        exists: false
      };
    }
    const _0x27111a = _0x1a76af.getBoundingClientRect();
    return {
      exists: true,
      tag: _0x1a76af.tagName,
      dataE2e: _0x1a76af.getAttribute?.("data-e2e") || "",
      className: _0x2eceab(_0x5e3849(_0x1a76af), 60),
      valuePreview: _0x2eceab(_0x323e58(_0x1a76af.innerText || _0x1a76af.value || ""), 48),
      rect: Math.round(_0x27111a.width) + "x" + Math.round(_0x27111a.height) + "@" + Math.round(_0x27111a.left) + "," + Math.round(_0x27111a.top)
    };
  }
  function _0x323e58(_0x53159b) {
    return String(_0x53159b || "").replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
  }
  function _0x2ea9a3(_0x6d8715) {
    return String(_0x6d8715 || "").replace(/\s+/g, " ").replace(/(?:\s*[·•]?\s*(?:点赞|回复|撤回|删除|复制|举报|多选|转发))+$/g, "").trim();
  }
  function _0x1ffb5b(_0x4e7472) {
    const _0x42d496 = _0x402157 => String(_0x402157 || "").replace(/\s+/g, " ").trim();
    const _0x183d0b = _0x42d496(_0x4e7472);
    if (!_0x183d0b) {
      return {
        verified: false,
        reason: "empty_text",
        node: null
      };
    }
    const _0x24012e = _0x183d0b.slice(0, Math.min(12, _0x183d0b.length));
    const _0xc05678 = _0xd60148("dmDialog");
    const _0x48fafe = _0xd60148("dmMessageItems");
    if (!_0xc05678 || !_0x48fafe) {
      return {
        verified: false,
        reason: "runtime_config_missing",
        node: null
      };
    }
    let _0x24b0fd = [];
    try {
      _0x24b0fd = Array.from(document.querySelectorAll(_0xc05678));
    } catch (_0x4b336d) {
      return {
        verified: false,
        reason: "invalid_runtime_selector",
        node: null
      };
    }
    for (const _0x21c37e of _0x24b0fd) {
      const _0x575adc = Array.from(_0x21c37e.querySelectorAll(_0x48fafe));
      for (let _0x1003fc = _0x575adc.length - 1; _0x1003fc >= 0; _0x1003fc -= 1) {
        const _0x3dff86 = _0x42d496(_0x575adc[_0x1003fc].innerText || _0x575adc[_0x1003fc].textContent || "");
        if (!_0x3dff86 || _0x3dff86.length > 500) {
          continue;
        }
        if (_0x3dff86.includes(_0x24012e) || _0x24012e.length >= 6 && _0x3dff86.includes(_0x24012e.slice(0, 6))) {
          const _0x5cc9f0 = _0x2ea9a3(_0x3dff86) || _0x3dff86;
          return {
            verified: true,
            snippet: _0x2eceab(_0x5cc9f0, 80),
            node: _0x575adc[_0x1003fc]
          };
        }
      }
    }
    return {
      verified: false,
      reason: "message_not_in_chat",
      node: null
    };
  }
  function _0x3a570d(_0x47033a = "") {
    const _0x3de414 = String(_0x47033a || "").match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (!_0x3de414) {
      return false;
    }
    const [, _0x4b02b8, _0x5647af, _0x18d6e3] = _0x3de414.map(Number);
    return _0x4b02b8 >= 180 && _0x5647af <= 105 && _0x18d6e3 <= 125;
  }
  function _0x34d79e(_0x4b5769) {
    if (!_0x4b5769 || !_0x4b5769.getBoundingClientRect) {
      return null;
    }
    const _0x560aaa = _0x4b5769.getBoundingClientRect();
    const _0x40c871 = [];
    let _0x5b3b4a = _0x4b5769;
    for (let _0x241383 = 0; _0x5b3b4a && _0x241383 < 6; _0x241383 += 1, _0x5b3b4a = _0x5b3b4a.parentElement) {
      const _0x5ba95f = _0x5b3b4a.getBoundingClientRect();
      if (_0x5ba95f.width > 0 && _0x5ba95f.height > 0 && _0x5ba95f.height <= 220) {
        _0x40c871.push(_0x5b3b4a);
      }
    }
    const _0x4f5944 = [];
    const _0x468326 = _0xd60148("dmFailureCandidates");
    const _0x38e1cc = _0xd60148("dmFailureIconInner");
    if (!_0x468326 || !_0x38e1cc) {
      return null;
    }
    for (const _0x51dd93 of _0x40c871) {
      try {
        _0x4f5944.push(..._0x51dd93.querySelectorAll(_0x468326));
      } catch (_0x263e0f) {}
    }
    for (const _0x139523 of Array.from(new Set(_0x4f5944))) {
      if (_0x139523 === _0x4b5769 || !_0x51232f(_0x139523) || !_0x41bd1e(_0x139523, 0)) {
        continue;
      }
      const _0xae32f2 = _0x139523.getBoundingClientRect();
      if (_0xae32f2.width < 4 || _0xae32f2.height < 4 || _0xae32f2.width > 42 || _0xae32f2.height > 42) {
        continue;
      }
      const _0x25b0bc = _0xae32f2.top + _0xae32f2.height / 2;
      if (_0x25b0bc < _0x560aaa.top - 32 || _0x25b0bc > _0x560aaa.bottom + 32) {
        continue;
      }
      if (_0xae32f2.right < _0x560aaa.left - 90 || _0xae32f2.left > _0x560aaa.right + 90) {
        continue;
      }
      const _0x1fc493 = _0x37eae4(_0x139523);
      const _0x490949 = [_0x139523.className, _0x139523.getAttribute?.("aria-label"), _0x139523.getAttribute?.("title"), _0x139523.innerText, _0x139523.textContent].map(_0x390308 => String(_0x390308 || "")).join(" ");
      const _0x304f24 = /fail|error|retry|发送失败|重试|失败/i.test(_0x490949);
      const _0x149fde = (_0x3a570d(_0x1fc493.color) || _0x3a570d(_0x1fc493.backgroundColor)) && _0xae32f2.width <= 28 && _0xae32f2.height <= 28 && (_0x139523.matches?.(_0x38e1cc) || !!_0x139523.querySelector?.(_0x38e1cc) || /!|！/.test(_0x490949));
      if (!_0x304f24 && !_0x149fde) {
        continue;
      }
      return {
        className: _0x2eceab(_0x5e3849(_0x139523), 80),
        ariaLabel: _0x2eceab(_0x139523.getAttribute?.("aria-label") || "", 60),
        title: _0x2eceab(_0x139523.getAttribute?.("title") || "", 60),
        text: _0x2eceab(_0x139523.innerText || _0x139523.textContent || "", 40),
        color: String(_0x1fc493.color || ""),
        backgroundColor: String(_0x1fc493.backgroundColor || "")
      };
    }
    return null;
  }
  function _0x39e7d5(_0x4ca0c0, _0x385dfc = {}) {
    const _0x1e468b = _0x1ffb5b(_0x4ca0c0);
    const _0x3e1792 = _0x34d79e(_0x1e468b.node);
    const _0x336df3 = _0x254a15();
    const _0x1fc02f = _0x385dfc.msgInput || null;
    const _0x3565d8 = _0x323e58(_0x1fc02f ? _0x1fc02f.innerText || _0x1fc02f.value || "" : _0x385dfc.inputText || "");
    const _0x10cf6f = resolveDouyinDmSendResult({
      expectedText: _0x4ca0c0,
      inputText: _0x3565d8,
      bubbleFound: _0x1e468b.verified,
      snippet: _0x1e468b.snippet || "",
      failureMarkerFound: !!_0x3e1792,
      failureMarker: _0x3e1792,
      platformHint: _0x336df3
    });
    return {
      ..._0x10cf6f,
      verified: _0x10cf6f.status === "sent",
      snippet: _0x10cf6f.snippet || _0x1e468b.snippet || "",
      verifyDetail: _0x10cf6f.snippet || _0x1e468b.reason || "",
      inputCleared: !String(_0x3565d8 || "").trim(),
      failureMarker: _0x3e1792 || null,
      platformHint: _0x10cf6f.platformHint || _0x336df3 || null
    };
  }
  function _0x9f6ba0() {
    if (typeof _0xd60148 === "function") {
      return _0xd60148("dmSendPrimary");
    } else {
      return "";
    }
  }
  function _0x136b1c(_0x3cf395, _0x5b6328) {
    if (!_0x3cf395 || !_0x5b6328 || !_0x51232f(_0x3cf395)) {
      return false;
    }
    try {
      const _0x2a44a2 = _0x3cf395.getBoundingClientRect();
      const _0x308d46 = _0x5b6328.getBoundingClientRect();
      if (_0x2a44a2.width <= 0 || _0x2a44a2.height <= 0 || _0x308d46.width <= 0 || _0x308d46.height <= 0) {
        return false;
      }
      const _0x283372 = _0x2a44a2.top + _0x2a44a2.height / 2;
      const _0x2c9413 = _0x308d46.top + _0x308d46.height / 2;
      const _0x528a04 = _0x2a44a2.left - _0x308d46.right;
      return _0x2a44a2.left >= _0x308d46.left + _0x308d46.width * 0.55 && Math.abs(_0x283372 - _0x2c9413) <= 80 && _0x528a04 >= -40 && _0x528a04 <= 220;
    } catch (_0x5844e7) {
      return false;
    }
  }
  function _0xa6eb4e(_0xa7f905) {
    if (!_0xa7f905) {
      return null;
    }
    const _0x2772aa = _0x9f6ba0();
    if (!_0x2772aa) {
      return null;
    }
    let _0x5ce408 = _0xa7f905.parentElement;
    for (let _0x38b8af = 0; _0x38b8af < 10 && _0x5ce408; _0x38b8af += 1) {
      let _0x42bedb = [];
      try {
        _0x42bedb = Array.from(_0x5ce408.querySelectorAll(_0x2772aa));
      } catch (_0x444878) {
        _0x42bedb = [];
      }
      const _0x1782fc = _0x42bedb.find(_0x4872a5 => _0x136b1c(_0x4872a5, _0xa7f905));
      if (_0x1782fc) {
        return _0x1782fc;
      }
      _0x5ce408 = _0x5ce408.parentElement;
    }
    return null;
  }
  async function _0x3d2704(_0x358626, _0x1d7075 = null) {
    const _0xe5c0df = _0xa6eb4e(_0x1d7075);
    if (_0xe5c0df) {
      return _0xe5c0df;
    }
    let _0x17d652 = _0x249c49("dmSendBtn");
    if (_0x17d652 && _0x51232f(_0x17d652)) {
      const _0x27b759 = _0x17d652.matches?.("[class*=\"sender\"], [class*=\"Sender\"], [data-e2e*=\"sender\"], [data-e2e*=\"Sender\"]") || _0x17d652.closest?.("[class*=\"sender\"], [class*=\"Sender\"], [data-e2e*=\"sender\"], [data-e2e*=\"Sender\"]");
      if (!_0x27b759 && _0x136b1c(_0x17d652, _0x1d7075)) {
        return _0x17d652;
      }
    }
    const _0x48c65a = typeof _0xd60148 === "function" ? _0xd60148("dmDialog") : "";
    const _0x3bc676 = typeof _0xd60148 === "function" ? _0xd60148("dmSendSvgCandidates") : "";
    const _0x275c38 = typeof _0xd60148 === "function" ? _0xd60148("dmSendClickableRoot") : "";
    const _0x29dda6 = typeof _0xd60148 === "function" ? _0xd60148("dmSendTextCandidates") : "";
    if (!_0x48c65a || !_0x3bc676 || !_0x275c38 || !_0x29dda6) {
      return null;
    }
    const _0x52ce8a = _0x1d7075?.closest?.(_0x48c65a) || document;
    const _0xfca4c6 = typeof _0x5cf508 === "function" ? _0x5cf508("sendSvgHints") : [];
    const _0x547791 = Array.from(_0x52ce8a.querySelectorAll(_0x3bc676));
    for (const _0x57dd3f of _0x547791) {
      const _0x40b9c3 = _0x57dd3f.innerHTML || "";
      const _0x37a59d = _0xfca4c6.find(_0x283662 => _0x283662 && _0x40b9c3.includes(_0x283662)) || "";
      if (_0x37a59d) {
        const _0x1a0bea = _0x57dd3f.closest(_0x275c38);
        if (_0x1a0bea && _0x136b1c(_0x1a0bea, _0x1d7075)) {
          return _0x1a0bea;
        }
      }
    }
    const _0x532b4d = typeof _0x5cf508 === "function" ? _0x5cf508("sendExactTexts") : [];
    return Array.from(_0x52ce8a.querySelectorAll(_0x29dda6)).find(_0x590e34 => _0x136b1c(_0x590e34, _0x1d7075) && _0x532b4d.includes(_0x590e34.innerText)) || null;
  }
  function _0xdb052c() {
    const _0x150f8d = _0x595306 => String(_0x595306 || "").replace(/\s+/g, " ").trim();
    const _0x3c8a64 = typeof _0xd60148 === "function" ? _0xd60148("conversationItem") : "";
    const _0x1f3dac = typeof _0x5cf508 === "function" ? _0x5cf508("strangerFolderTexts") : [];
    if (!_0x3c8a64 || !_0x1f3dac.length) {
      return null;
    }
    const _0x17dd37 = _0x1f3dac[0];
    const _0x25de6e = Array.from(document.querySelectorAll(_0x3c8a64)).filter(_0x552c88 => {
      if (!_0x51232f(_0x552c88)) {
        return false;
      }
      const _0x4012f8 = _0x552c88.getBoundingClientRect();
      if (_0x4012f8.width < 80 || _0x4012f8.height < 24 || _0x4012f8.width > 720 || _0x4012f8.height > 160) {
        return false;
      }
      const _0x261109 = _0x150f8d(_0x552c88.innerText || _0x552c88.textContent || "");
      if (!_0x261109 || !_0x1f3dac.some(_0x578852 => _0x261109.includes(_0x578852))) {
        return false;
      }
      if (_0x261109.length > 36 && !_0x261109.startsWith(_0x17dd37)) {
        return false;
      }
      return true;
    }).sort((_0x2cd5dd, _0x248022) => {
      const _0x2f012b = _0x3690be => {
        const _0x4f3d53 = _0x150f8d(_0x3690be.innerText || _0x3690be.textContent || "");
        const _0x336900 = _0x3690be.getBoundingClientRect();
        let _0x1a59b8 = 0;
        if (_0x4f3d53.startsWith(_0x17dd37)) {
          _0x1a59b8 += 100;
        }
        if (_0x4f3d53 === _0x17dd37) {
          _0x1a59b8 += 50;
        }
        return _0x1a59b8 + Math.min(_0x336900.width * _0x336900.height / 1000, 30);
      };
      return _0x2f012b(_0x248022) - _0x2f012b(_0x2cd5dd);
    });
    return _0x25de6e[0] || null;
  }
  async function _0x3aa1f8(_0x57749c, _0x48eb9e, _0x2c90d7, _0xc51220 = {}) {
    const _0x59dc7a = String(_0x57749c || "").replace(/^@+/, "").trim();
    if (!_0x59dc7a) {
      return null;
    }
    if (isDouyinStrangerMessagesFolderName(_0x59dc7a)) {
      _0x2c90d7?.("目标是陌生人消息文件夹，不是具体会话", {
        nickname: _0x59dc7a
      });
      return null;
    }
    const _0x53915d = !!_0xc51220.forceFolder;
    let _0x53732d = _0x53915d ? null : _0x7519e8(_0x59dc7a);
    if (!_0x53732d) {
      const _0x58f525 = _0xdb052c();
      if (!_0x58f525) {
        _0x2c90d7?.("未找到陌生人消息入口", {
          nickname: _0x59dc7a
        });
        return null;
      }
      _0x2c90d7?.("点击陌生人消息入口", {
        text: _0x2eceab(_0x58f525.innerText || _0x58f525.textContent || "", 30),
        forceFolder: _0x53915d
      });
      await _0x259543(_0x58f525, _0x48eb9e);
      await _0x2a6d31(1800);
      _0x53732d = _0x7519e8(_0x59dc7a);
      if (!_0x53732d) {
        await _0x2a6d31(1200);
        _0x53732d = _0x7519e8(_0x59dc7a);
      }
    }
    if (!_0x53732d) {
      _0x2c90d7?.("陌生人消息内未找到对应用户会话", {
        nickname: _0x59dc7a
      });
      return null;
    }
    _0x2c90d7?.("点击陌生人会话进入对话框", {
      tag: _0x53732d.clickTarget?.tagName || "",
      nickname: _0x59dc7a
    });
    await _0x259543(_0x53732d.clickTarget, _0x48eb9e);
    await _0x2a6d31(1800);
    let _0x433b72 = await _0x366477(_0x48eb9e, 18000, _0x53732d.clickTarget);
    if (!_0x433b72) {
      _0x2c90d7?.("陌生人会话输入框未出现，重试点击会话行");
      await _0x259543(_0x53732d.row || _0x53732d.clickTarget, _0x48eb9e);
      await _0x2a6d31(1200);
      _0x433b72 = await _0x366477(_0x48eb9e, 14000, _0x53732d.clickTarget);
    }
    return _0x433b72 || null;
  }
  async function _0x4849c4(_0x26e6dd, _0x20e33b = "SELF_WARMUP", _0x3cbd09 = {}) {
    const _0xfe034 = String(_0x26e6dd || "").trim();
    const _0x3ae042 = String(_0x3cbd09.nickname || "").trim();
    const _0x249741 = String(_0x3cbd09.userUrl || window.location.href || "").trim();
    const _0x1cb05f = {
      nickname: _0x3ae042,
      userUrl: _0x249741,
      steps: []
    };
    const _0x40388b = (_0x345c54, _0xa1509e = {}) => {
      _0x1cb05f.steps.push({
        step: _0x345c54,
        ..._0xa1509e,
        at: Date.now()
      });
      _0x905647(_0x345c54, {
        nickname: _0x3ae042,
        ..._0xa1509e
      });
    };
    if (!_0xfe034) {
      return {
        ok: false,
        reason: "无私信文案",
        debug: _0x1cb05f
      };
    }
    if (typeof _0x3f5c72 !== "function" || !_0x3f5c72()) {
      return {
        ok: false,
        reason: "私信运行配置未就绪，本次不执行",
        errorCode: "dm_runtime_config_missing",
        debug: _0x1cb05f
      };
    }
    _0x40388b("开始主页私信", {
      url: _0x249741,
      msgPreview: _0x2eceab(_0xfe034, 40)
    });
    _0xa9be1b.stopRequested = false;
    try {
      window.focus?.();
    } catch (_0x316e94) {}
    try {
      if (_0xa9be1b.currentViewKey) {
        _0x2a9363.send("focus-automation-view", {
          viewKey: _0xa9be1b.currentViewKey,
          bringToFront: true
        });
        const _0x47e3cf = await _0x2a9363.invoke("ensure-background-automation-layout", {
          viewKey: _0xa9be1b.currentViewKey,
          claimInteractionSlot: true,
          requireComposerSurface: true
        });
        _0x40388b("私信执行视口已准备", {
          ok: _0x47e3cf?.ok !== false,
          reason: _0x47e3cf?.reason || "",
          surfaceWarmupMs: Number(_0x47e3cf?.surfaceWarmupMs || 0),
          slotWaitedMs: Number(_0x47e3cf?.interactionSlotWaitedMs || 0)
        });
      }
    } catch (_0x2d9e89) {
      _0x40388b("私信执行视口准备异常，继续等待控件稳定", {
        reason: _0x2d9e89?.message || String(_0x2d9e89)
      });
    }
    await _0x4b4f4c(_0x20e33b);
    await _0x2a6d31(1000);
    const _0x3f81b5 = await _0x145e95("profileMessageBtn", _0x20e33b, 20000);
    if (!_0x3f81b5) {
      return {
        ok: false,
        reason: "未找到主页私信按钮",
        debug: _0x1cb05f
      };
    }
    _0x40388b("点击主页私信按钮", {
      btnText: _0x2eceab(_0x3f81b5.innerText || _0x3f81b5.textContent || "", 20)
    });
    await _0x259543(_0x3f81b5, _0x20e33b);
    await _0x2a6d31(2500);
    const _0x554f62 = _0x254a15();
    if (_0x554f62) {
      _0x40388b("私信受限（打开窗口即检测到）", _0x554f62);
      return {
        ok: false,
        blocked: true,
        blockType: _0x554f62.type,
        reason: _0x554f62.text,
        debug: _0x1cb05f
      };
    }
    let _0x5c0275 = await _0x366477(_0x20e33b, 24000, _0x3f81b5);
    let _0x38ea55 = false;
    if (!_0x5c0275) {
      const _0x2ab268 = _0x254a15();
      if (_0x2ab268) {
        _0x40388b("私信受限（未找到输入框）", _0x2ab268);
        return {
          ok: false,
          blocked: true,
          blockType: _0x2ab268.type,
          reason: _0x2ab268.text,
          debug: _0x1cb05f
        };
      }
      _0x40388b("主页私信未打开输入框，尝试经陌生人消息进入会话");
      _0x5c0275 = await _0x3aa1f8(_0x3ae042, _0x20e33b, _0x40388b);
      _0x38ea55 = !!_0x5c0275;
      if (!_0x5c0275) {
        return {
          ok: false,
          reason: "私信窗口或输入框未打开",
          debug: _0x1cb05f
        };
      }
    }
    _0x40388b("私信输入框就绪", {
      ..._0xb7d33f(_0x5c0275),
      viaStranger: _0x38ea55
    });
    const _0x224893 = _0x50ae94();
    const _0x120c68 = _0x224893.some(isRealSelfOutboundChatMessage);
    if (_0x120c68) {
      const _0x2ea24f = [..._0x224893].reverse().find(isRealSelfOutboundChatMessage);
      _0x40388b("会话中已有我方私信，跳过主动私信", {
        msgCount: _0x224893.length,
        preview: _0x2eceab(_0x2ea24f?.text || "", 40)
      });
      return {
        ok: true,
        skipped: true,
        reason: "会话中已有我方私信，跳过主动私信",
        debug: _0x1cb05f
      };
    }
    let _0xbea623 = await _0x43f064(_0x5c0275, _0xfe034, _0x20e33b, _0x40388b, _0x1cb05f);
    if (!_0xbea623.ok && !_0xbea623.blocked && !_0x38ea55 && /输入框仍有内容|未找到发送|录入后输入框仍为空|私信内容输入失败/.test(String(_0xbea623.reason || ""))) {
      _0x40388b("主页私信发送失败，改走陌生人消息入口重试", {
        reason: _0xbea623.reason || ""
      });
      const _0x572539 = await _0x3aa1f8(_0x3ae042, _0x20e33b, _0x40388b, {
        forceFolder: true
      });
      if (_0x572539) {
        _0x38ea55 = true;
        const _0x111644 = _0x50ae94();
        if (_0x111644.some(isRealSelfOutboundChatMessage)) {
          _0x40388b("陌生人会话中已有我方私信，跳过主动私信");
          return {
            ok: true,
            skipped: true,
            reason: "会话中已有我方私信，跳过主动私信",
            debug: _0x1cb05f,
            viaStranger: true
          };
        }
        _0xbea623 = await _0x43f064(_0x572539, _0xfe034, _0x20e33b, _0x40388b, _0x1cb05f);
      }
    }
    return {
      ..._0xbea623,
      sentText: _0xfe034,
      viaStranger: _0x38ea55
    };
  }
  function _0x7519e8(_0x2ff0b8, _0x3612b9 = {}) {
    const _0x4387c1 = _0xacb5cb => String(_0xacb5cb || "").replace(/\s+/g, " ").trim();
    const _0x48a08b = _0x4387c1(_0x2ff0b8 || "").replace(/^@+/, "").toLowerCase();
    const _0x4d8264 = normalizeDouyinChatPreview(_0x3612b9.lastMessage || _0x3612b9.text || "");
    if (isDouyinStrangerMessagesFolderName(_0x48a08b)) {
      return null;
    }
    if (isGenericDouyinChatNickname(_0x48a08b) && !_0x4d8264) {
      return null;
    }
    const _0x4dc6cf = _0xd60148("conversationItem");
    const _0x392915 = _0xd60148("conversationTitle");
    const _0x438400 = _0xd60148("conversationPreview");
    const _0x549b33 = _0xd60148("conversationUnread");
    const _0x411323 = _0xd60148("conversationAvatar");
    const _0x48b81e = _0xd60148("conversationAvatarRoot");
    if (!_0x4dc6cf || !_0x392915 || !_0x438400 || !_0x549b33 || !_0x411323 || !_0x48b81e) {
      return null;
    }
    const _0x1582b6 = Array.from(document.querySelectorAll(_0x4dc6cf)).filter(_0x4695ec => {
      if (!_0x51232f(_0x4695ec)) {
        return false;
      }
      const _0x4edb6f = _0x4695ec.getBoundingClientRect();
      const _0x17aefc = _0x4387c1(_0x4695ec.innerText || _0x4695ec.textContent || "");
      const _0x526f5d = _0x4387c1(_0x17aefc.split("\n")[0] || "");
      if (isDouyinStrangerMessagesFolderName(_0x526f5d)) {
        return false;
      }
      return _0x4edb6f.width >= 160 && _0x4edb6f.height >= 32 && _0x4edb6f.width <= 720 && _0x4edb6f.height <= 180 && !!_0x17aefc;
    }).map(_0x1e4a57 => {
      const _0x55bbf7 = _0x1e4a57.querySelector(_0x392915);
      const _0x30554e = _0x1e4a57.querySelector(_0x438400);
      const _0x2af22a = !!_0x1e4a57.querySelector(_0x549b33);
      const _0x55d7b3 = scoreDouyinChatRowMatch({
        title: _0x4387c1(_0x55bbf7?.innerText || _0x55bbf7?.textContent || ""),
        lastMessage: _0x4387c1(_0x30554e?.innerText || _0x30554e?.textContent || ""),
        rowText: _0x4387c1(_0x1e4a57.innerText || _0x1e4a57.textContent || ""),
        hasUnread: _0x2af22a
      }, {
        nickname: _0x2ff0b8,
        lastMessage: _0x4d8264
      });
      return {
        row: _0x1e4a57,
        titleEl: _0x55bbf7,
        score: _0x55d7b3
      };
    }).filter(_0x162feb => _0x162feb.score > 0).sort((_0x4cc053, _0x1c209d) => _0x1c209d.score - _0x4cc053.score);
    for (const _0x11fcb9 of _0x1582b6) {
      const _0x482981 = _0x11fcb9.row.querySelector(_0x411323);
      const _0x5c1b7c = _0x482981?.closest(_0x48b81e) || _0x482981;
      const _0x57d245 = _0x11fcb9.titleEl || _0x11fcb9.row;
      if (_0x57d245 && _0x51232f(_0x57d245)) {
        return {
          row: _0x11fcb9.row,
          clickTarget: _0x57d245,
          titleEl: _0x11fcb9.titleEl,
          avatar: _0x5c1b7c
        };
      }
    }
    return null;
  }
  function _0x52bb25(_0x48a4f8) {
    if (!_0x48a4f8?.getBoundingClientRect) {
      return {
        exists: false
      };
    }
    const _0x3290d9 = _0x48a4f8.getBoundingClientRect();
    return {
      exists: true,
      tag: _0x48a4f8.tagName || "",
      className: _0x2eceab(_0x5e3849(_0x48a4f8), 80),
      text: _0x2eceab(_0x48a4f8.innerText || _0x48a4f8.textContent || "", 20),
      rect: Math.round(_0x3290d9.width) + "x" + Math.round(_0x3290d9.height) + "@" + Math.round(_0x3290d9.left) + "," + Math.round(_0x3290d9.top)
    };
  }
  async function _0x1365e9(_0xb169c3, _0x3c7271, _0x35040c, _0x3fd74f = "首次") {
    const _0x58b3b4 = await _0x3d2704(_0x3c7271, _0xb169c3);
    if (_0x58b3b4) {
      _0x35040c(_0x3fd74f + "定位私信发送按钮", _0x52bb25(_0x58b3b4));
      const _0x319e19 = typeof _0x2757b0 === "function" ? await _0x2757b0(_0x58b3b4, _0x3c7271, "私信发送按钮", {
        allowScrollIntoView: false,
        allowOffsetSamples: true,
        requireTargetHit: true,
        waitForStableTarget: true
      }) : false;
      _0x35040c(_0x3fd74f + "私信发送点击结果", {
        dispatched: _0x319e19,
        nativeClick: String(_0xa9be1b.lastTrustedClickDiagnostic || "")
      });
      if (_0x319e19) {
        return {
          dispatched: true,
          via: "button",
          sendBtn: _0x58b3b4
        };
      }
    } else {
      _0x35040c(_0x3fd74f + "未找到私信发送按钮");
    }
    const _0x56caed = typeof _0x442f18 === "function" ? await _0x442f18(_0xb169c3, _0x3c7271, "私信输入框") : false;
    _0x35040c(_0x3fd74f + "可信 Enter 发送结果", {
      dispatched: _0x56caed
    });
    return {
      dispatched: _0x56caed,
      via: "enter",
      sendBtn: _0x58b3b4 || null
    };
  }
  async function _0x43f064(_0x3b5c9c, _0x52e008, _0x1acccf, _0x112700, _0x9a1cd8) {
    await _0x259543(_0x3b5c9c, _0x1acccf);
    await _0x5d9478(800, 1500, _0x1acccf, "激活稳定");
    const _0x183b06 = await _0x1ed148(_0x3b5c9c, _0x52e008, _0x1acccf);
    if (!_0x183b06) {
      return {
        ok: false,
        reason: "私信内容输入失败",
        debug: _0x9a1cd8
      };
    }
    const _0x1d3a96 = _0xb7d33f(_0x3b5c9c);
    _0x112700("内容录入完成", _0x1d3a96);
    if (!_0x1d3a96.valuePreview) {
      return {
        ok: false,
        reason: "录入后输入框仍为空，疑似未写入成功",
        debug: _0x9a1cd8
      };
    }
    await _0x5d9478(1000, 2000, _0x1acccf, "发送前确认");
    await _0x1365e9(_0x3b5c9c, _0x1acccf, _0x112700, "首次");
    await _0x2a6d31(2000);
    let _0x165389 = _0xb7d33f(_0x3b5c9c);
    let _0x6eddcf = _0x39e7d5(_0x52e008, {
      msgInput: _0x3b5c9c
    });
    if (_0x6eddcf.status === "pending" && !_0x6eddcf.inputCleared && !_0x38be95(_0x1acccf)) {
      _0x112700("首次发送未生效，输入框仍有内容，等待控件稳定后重试一次", {
        inputAfter: _0x165389.valuePreview || ""
      });
      await _0x5d9478(800, 1500, _0x1acccf, "私信发送重试等待");
      await _0x1365e9(_0x3b5c9c, _0x1acccf, _0x112700, "重试");
      await _0x2a6d31(2000);
      _0x165389 = _0xb7d33f(_0x3b5c9c);
      _0x6eddcf = _0x39e7d5(_0x52e008, {
        msgInput: _0x3b5c9c
      });
    }
    let _0x3fe5b9 = _0x6eddcf.status === "sent" ? 1 : 0;
    for (let _0xb131b7 = 0; _0xb131b7 < 10; _0xb131b7 += 1) {
      if (_0x6eddcf.status === "blocked" || _0x6eddcf.status === "failed") {
        break;
      }
      if (_0x6eddcf.status === "sent" && _0x3fe5b9 >= 2) {
        break;
      }
      if (!_0x6eddcf.inputCleared && _0xb131b7 >= 3) {
        break;
      }
      await _0x2a6d31(600);
      if (_0x38be95(_0x1acccf)) {
        break;
      }
      _0x165389 = _0xb7d33f(_0x3b5c9c);
      _0x6eddcf = _0x39e7d5(_0x52e008, {
        msgInput: _0x3b5c9c
      });
      _0x3fe5b9 = _0x6eddcf.status === "sent" ? _0x3fe5b9 + 1 : 0;
    }
    _0x112700("发送后校验", {
      inputAfter: _0x165389.valuePreview || "",
      inputCleared: _0x6eddcf.inputCleared,
      resultStatus: _0x6eddcf.status,
      failureToast: _0x6eddcf.platformHint?.raw || "",
      failureMarker: _0x6eddcf.failureMarker?.className || _0x6eddcf.failureMarker?.ariaLabel || "",
      blockType: _0x6eddcf.blockType || "",
      errorCode: _0x6eddcf.errorCode || "",
      verified: _0x6eddcf.verified,
      verifyDetail: _0x6eddcf.snippet || _0x6eddcf.verifyDetail || "",
      currentUrl: window.location.href
    });
    if (_0x6eddcf.status === "blocked" || _0x6eddcf.status === "failed") {
      return {
        ok: false,
        blocked: !!_0x6eddcf.blocked,
        blockType: _0x6eddcf.blockType || "",
        errorCode: _0x6eddcf.errorCode || "",
        reason: _0x6eddcf.reason || "私信未发送成功",
        diagnostic: _0x6eddcf,
        debug: _0x9a1cd8
      };
    }
    if (_0x6eddcf.status !== "sent") {
      const _0x44f632 = !!(_0x165389.valuePreview || "").trim();
      if (_0x44f632) {
        return {
          ok: false,
          reason: "输入框仍有内容，疑似未发送成功",
          debug: _0x9a1cd8
        };
      }
      _0x112700("输入框已清空，按已发送弱确认", {
        msgPreview: _0x2eceab(_0x52e008, 40)
      });
      return {
        ok: true,
        softVerified: true,
        consumeRound: true,
        reason: "",
        sentText: _0x52e008,
        debug: {
          ..._0x9a1cd8,
          softVerified: true
        }
      };
    }
    _0x112700("会话记录已确认消息", {
      snippet: _0x6eddcf.snippet
    });
    return {
      ok: true,
      reason: "",
      errorCode: "",
      diagnostic: _0x6eddcf,
      debug: {
        ..._0x9a1cd8,
        snippet: _0x6eddcf.snippet
      }
    };
  }
  function _0x50ae94() {
    const _0x2c036c = _0xd60148("dmHistoryMessageItems");
    const _0x3fd41e = _0xd60148("dmMessageContainer");
    if (!_0x2c036c || !_0x3fd41e) {
      return [];
    }
    const _0x2416e8 = Array.from(document.querySelectorAll(_0x2c036c)).map(_0x12539a => {
      const _0x21e885 = String(_0x12539a.innerText || _0x12539a.textContent || "").trim();
      if (!_0x21e885 || _0x21e885.length > 500) {
        return null;
      }
      const _0x360715 = _0x12539a.outerHTML || "";
      const _0x450950 = String(_0x12539a.className || "");
      const _0x857dcc = _0x12539a.getBoundingClientRect();
      const _0x1814cf = _0x12539a.closest(_0x3fd41e) || document.querySelector(_0x3fd41e);
      const _0x16fb3b = _0x1814cf && _0x1814cf.getBoundingClientRect ? _0x1814cf.getBoundingClientRect() : null;
      const _0x5b50ff = classLooksLikeSelfChatBubble(_0x450950, _0x360715) || isChatBubbleAlignedSelf(_0x857dcc, _0x16fb3b);
      return {
        isSelf: _0x5b50ff,
        text: _0x21e885,
        top: _0x857dcc.top,
        system: isDouyinChatSystemHint(_0x21e885)
      };
    }).filter(Boolean);
    const _0x577a7d = [];
    for (let _0x208c6a = 0; _0x208c6a < _0x2416e8.length; _0x208c6a++) {
      const _0x3cf1ce = _0x2416e8[_0x208c6a];
      let _0x4860a3 = false;
      for (let _0x1d64d4 = _0x208c6a + 1; _0x1d64d4 < Math.min(_0x208c6a + 5, _0x2416e8.length); _0x1d64d4++) {
        if (_0x2416e8[_0x1d64d4].text.includes(_0x3cf1ce.text) && _0x2416e8[_0x1d64d4].isSelf === _0x3cf1ce.isSelf) {
          _0x4860a3 = true;
          break;
        }
      }
      if (!_0x4860a3) {
        _0x577a7d.push(_0x3cf1ce);
      }
    }
    return _0x577a7d.sort((_0x1dd860, _0x57db87) => _0x1dd860.top - _0x57db87.top);
  }
  function _0x136cb4() {
    return _0x50ae94().slice(-10).map(_0x4fb437 => (_0x4fb437.isSelf ? "我: " : "对方: ") + _0x4fb437.text).join("\n");
  }
  async function _0x308a63(_0x497381, _0x5afcb4 = "SELF_WARMUP", _0x2baf2e = {}) {
    const _0x52da8c = String(_0x497381 || "").trim();
    const _0x12905f = String(_0x2baf2e.nickname || "").trim();
    const _0x5576c7 = normalizeDouyinChatPreview(_0x2baf2e.text || _0x2baf2e.lastMessage || "");
    const _0x4837a6 = _0x2baf2e.config || _0xa9be1b.currentTask || {};
    const _0x4a3dc7 = _0x2baf2e.accountId || window._radar_account_id;
    const _0x2c9357 = _0x2baf2e.account || {
      nickname: window._radar_account_name
    };
    const _0x5b08ed = {
      nickname: _0x12905f,
      steps: []
    };
    const _0x18c9af = (_0x29c685, _0x2083ce = {}) => {
      _0x5b08ed.steps.push({
        step: _0x29c685,
        ..._0x2083ce,
        at: Date.now()
      });
      _0x905647(_0x29c685, {
        nickname: _0x12905f,
        ..._0x2083ce
      });
    };
    if (!_0x52da8c) {
      return {
        ok: false,
        reason: "无私信文案",
        debug: _0x5b08ed
      };
    }
    if (typeof _0x3f5c72 !== "function" || !_0x3f5c72()) {
      return {
        ok: false,
        reason: "私信运行配置未就绪，本次不执行",
        errorCode: "dm_runtime_config_missing",
        debug: _0x5b08ed
      };
    }
    if (isDouyinStrangerMessagesFolderName(_0x12905f)) {
      _0x18c9af("目标是陌生人消息文件夹，跳过回复");
      return {
        ok: true,
        skipped: true,
        reason: "陌生人消息是文件夹不是会话",
        debug: _0x5b08ed
      };
    }
    _0x18c9af("开始回复私信", {
      msgPreview: _0x2eceab(_0x52da8c, 40)
    });
    _0xa9be1b.stopRequested = false;
    let _0x3b6b4a = _0x7519e8(_0x12905f, {
      lastMessage: _0x5576c7
    });
    if (!_0x3b6b4a) {
      _0x18c9af("列表未直接命中会话，尝试进入陌生人消息", {
        genericNick: isGenericDouyinChatNickname(_0x12905f),
        preview: _0x5576c7.slice(0, 20)
      });
      const _0x45861d = _0xdb052c();
      if (_0x45861d) {
        await _0x259543(_0x45861d, _0x5afcb4);
        await _0x2a6d31(1800);
        _0x3b6b4a = _0x7519e8(_0x12905f, {
          lastMessage: _0x5576c7
        });
        if (!_0x3b6b4a) {
          await _0x2a6d31(1200);
          _0x3b6b4a = _0x7519e8(_0x12905f, {
            lastMessage: _0x5576c7
          });
        }
      }
    }
    if (!_0x3b6b4a) {
      return {
        ok: false,
        reason: "未找到私信会话列表项",
        debug: _0x5b08ed
      };
    }
    const _0x4cdb24 = _0x2baf2e.excludeGroupChats !== false && _0x4837a6.excludeGroupChats !== false;
    if (_0x4cdb24) {
      const _0x5a6f31 = String(_0x3b6b4a.row?.innerText || _0x3b6b4a.row?.textContent || "").replace(/\s+/g, " ").trim();
      const _0x2474ad = String(_0x3b6b4a.titleEl?.innerText || _0x3b6b4a.titleEl?.textContent || "").replace(/\s+/g, " ").trim().slice(0, 48);
      const _0x3ddb9e = looksLikeDouyinGroupChatName(_0x2474ad).isGroup || looksLikeDouyinGroupChatName(_0x5a6f31.slice(0, 48)).isGroup;
      const _0x4b6a92 = _0xd60148("groupRowHints");
      const _0x4d379f = _0xd60148("groupAvatarImages");
      let _0x1eb804 = false;
      try {
        _0x1eb804 = !!_0x4b6a92 && !!_0x3b6b4a.row?.querySelector?.(_0x4b6a92);
      } catch (_0xe609c1) {
        _0x1eb804 = false;
      }
      const _0x199355 = _0x3b6b4a.row && _0x4d379f ? Array.from(_0x3b6b4a.row.querySelectorAll(_0x4d379f)).filter(_0x235bdd => {
        if (!_0x51232f(_0x235bdd)) {
          return false;
        }
        const _0x16ac8e = _0x235bdd.getBoundingClientRect();
        return _0x16ac8e.width >= 10 && _0x16ac8e.width <= 72 && _0x16ac8e.height >= 10 && _0x16ac8e.height <= 72;
      }).length : 0;
      if (_0x3ddb9e || _0x1eb804 || _0x199355 >= 3) {
        const _0x31dfd0 = _0x1eb804 ? "row_dom" : _0x3ddb9e ? "row_title" : "row_avatars";
        _0x18c9af("会话列表判定为群聊，已按排除群聊跳过", {
          groupReason: _0x31dfd0,
          titleText: _0x2474ad.slice(0, 40)
        });
        return {
          ok: true,
          skipped: true,
          reason: "已开启“排除群聊”",
          excludedGroup: true,
          groupReason: _0x31dfd0,
          debug: _0x5b08ed
        };
      }
      if (/群聊|邀请入群|群成员/.test(_0x5a6f31.slice(0, 80)) && /群/.test(_0x2474ad)) {
        _0x18c9af("会话列表文案含群标志，已按排除群聊跳过", {
          titleText: _0x2474ad.slice(0, 40)
        });
        return {
          ok: true,
          skipped: true,
          reason: "已开启“排除群聊”",
          excludedGroup: true,
          groupReason: "row_text",
          debug: _0x5b08ed
        };
      }
    }
    _0x18c9af("点击会话头像/昵称", {
      tag: _0x3b6b4a.clickTarget.tagName,
      hasAvatar: !!_0x3b6b4a.avatar
    });
    await _0x259543(_0x3b6b4a.clickTarget, _0x5afcb4);
    await _0x2a6d31(2000);
    if (_0x4cdb24) {
      const _0x36e9bd = _0xd60148("conversationHeader");
      const _0x12d2d3 = _0x36e9bd ? document.querySelector(_0x36e9bd) : null;
      const _0x2d7f9b = String(_0x12d2d3?.innerText || _0x12d2d3?.textContent || "").replace(/\s+/g, " ").trim().slice(0, 64);
      const _0x22cc1c = _0x12905f.replace(/^@+/, "").toLowerCase();
      const _0x3fd472 = _0x2d7f9b.toLowerCase();
      const _0x1c121c = !_0x22cc1c || _0x3fd472.includes(_0x22cc1c) || _0x22cc1c.includes(_0x3fd472.slice(0, Math.min(_0x22cc1c.length, _0x3fd472.length)));
      const _0x5935aa = looksLikeOpenDouyinGroupChatHeader(_0x2d7f9b, _0x12905f);
      if (_0x5935aa.isGroup || _0x1c121c && looksLikeDouyinGroupChatName(_0x2d7f9b).isGroup) {
        const _0xbda8ff = _0x5935aa.reason || "open_name";
        _0x18c9af("打开会话后判定为群聊，已按排除群聊跳过", {
          groupReason: _0xbda8ff,
          headerText: _0x2d7f9b
        });
        return {
          ok: true,
          skipped: true,
          reason: "已开启“排除群聊”",
          excludedGroup: true,
          groupReason: _0xbda8ff,
          debug: _0x5b08ed
        };
      }
    }
    let _0x4a688f = await _0x366477(_0x5afcb4, 20000, _0x3b6b4a.clickTarget);
    if (!_0x4a688f) {
      _0x18c9af("输入框未出现，重试点击会话行");
      await _0x259543(_0x3b6b4a.row, _0x5afcb4);
      await _0x2a6d31(1500);
      _0x4a688f = await _0x366477(_0x5afcb4, 16000, _0x3b6b4a.clickTarget);
    }
    if (!_0x4a688f) {
      _0x18c9af("会话点击后仍无输入框，经陌生人消息重试进入");
      _0x4a688f = await _0x3aa1f8(_0x12905f, _0x5afcb4, _0x18c9af);
    }
    if (!_0x4a688f) {
      return {
        ok: false,
        reason: "未找到私信输入框",
        debug: _0x5b08ed
      };
    }
    _0x18c9af("私信输入框就绪", _0xb7d33f(_0x4a688f));
    const _0x4dfbdf = _0x50ae94();
    const _0x1140f1 = _0x4dfbdf.length ? _0x4dfbdf[_0x4dfbdf.length - 1] : null;
    if (!_0x1140f1 || _0x1140f1.system) {
      _0x18c9af("未能识别对方私信，跳过回复（避免对系统提示/空会话主动连发）", {
        msgCount: _0x4dfbdf.length,
        lastPreview: _0x2eceab(_0x1140f1?.text || "", 40)
      });
      return {
        ok: true,
        skipped: true,
        reason: "未能确认对方有新私信，跳过回复",
        debug: _0x5b08ed
      };
    }
    if (_0x1140f1.isSelf) {
      _0x18c9af("最后一条消息为自己发送，跳过回复", {
        preview: _0x2eceab(_0x1140f1.text, 40)
      });
      return {
        ok: true,
        skipped: true,
        reason: "最后一条消息为自己发送，无需回复",
        debug: _0x5b08ed
      };
    }
    _0x18c9af("确认最后一条为对方消息，继续回复", {
      preview: _0x2eceab(_0x1140f1.text, 40)
    });
    let _0x548f13 = _0x52da8c;
    const _0x548ebc = _0x4837a6.accountPersonas?.[_0x4a3dc7];
    const _0x483dda = resolveSelfWarmupContentMode(_0x4837a6, true) === "ai" && !!_0x548ebc && _0x548ebc !== "none";
    if (_0x483dda) {
      _0x18c9af("正在提取最近私信历史对话...");
      const _0x14125d = _0x136cb4();
      if (_0x14125d) {
        _0x18c9af("提取成功，正在重新向大模型请求最佳回复...", {
          historySnippet: _0x2eceab(_0x14125d, 80)
        });
        try {
          const _0x5dd735 = await _0x2a9363.invoke("ai-generate-fresh-dm-reply", {
            config: _0x4837a6,
            accountId: _0x4a3dc7,
            account: _0x2c9357,
            nickname: _0x12905f,
            text: _0x52da8c,
            chatHistory: _0x14125d,
            forDm: true
          });
          if (_0x5dd735) {
            _0x548f13 = _0x5dd735;
            _0x18c9af("根据上下文重新生成私信成功", {
              freshMsg: _0x2eceab(_0x548f13, 40)
            });
          }
        } catch (_0x348562) {
          _0x18c9af("根据上下文重新生成私信失败，使用预设私信", {
            error: _0x348562?.message || String(_0x348562)
          });
        }
      } else {
        _0x18c9af("未提取到完整对话历史，使用预设私信回复对方最新消息");
      }
    }
    const _0xb09c67 = await _0x43f064(_0x4a688f, _0x548f13, _0x5afcb4, _0x18c9af, _0x5b08ed);
    return {
      ..._0xb09c67,
      sentText: _0x548f13
    };
  }
  return {
    getDouyinDmSendResult: _0x39e7d5,
    logSelfWarmupDm: _0x905647,
    replyDmInConversation: _0x308a63,
    sendDmOnCurrentProfile: _0x4849c4
  };
}
module.exports = {
  createDouyinDirectMessageController: createDouyinDirectMessageController
};
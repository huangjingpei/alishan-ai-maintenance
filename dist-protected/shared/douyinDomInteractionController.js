'use strict';

const {
  sanitizeInlinePageScript
} = require("./sanitizeInlinePageScript");
function createDouyinDomInteractionController(_0xaa706d = {}) {
  const {
    PLATFORM_SELECTORS: _0x3b3648,
    briefEl: _0x34aefa,
    describeDomControl: _0x33a9ce,
    buildImageAttachScope: _0xf1aba4,
    clipTraceText: _0x5cd915,
    collectCommentImageTriggerCandidates: _0xf62e6a,
    elementsNearlyOverlap: _0x4a0ccf,
    findCommentScrollContainer: _0x3844a4,
    findEmojiTriggerBtn: _0x1a4a5e,
    findProfileFollowButtonByText: _0x128539,
    findProfileMessageButtonByText: _0x1b8b60,
    getCommentComposerRoot: _0x1e21ff,
    getCommentV2String: _0x1d972a,
    getDmV2String: _0x3291db,
    getGatedString: _0x4e8db8,
    getGatedTextPack: _0x2a8bdb,
    getGatedVariantList: _0x5f0db3,
    getDouyinFeedScope: _0x326dff,
    getExtendedReadyBudgetMs: _0x50ecf1,
    hasDmRuntimeReady: _0x4d876d,
    hasProfileActionRuntimeReady: _0x3e3fd4,
    ipcRenderer: _0x1c346a,
    isEmojiTriggerCandidate: _0x1256dc,
    isFeedStyleSource: _0x51bb1a,
    randomDelay: _0x27280b,
    reportEmojiDebug: _0x1ae075,
    reportTraceLog: _0x160520,
    resolveCommentPanelRoot: _0x54e433,
    shouldAbort: _0x4dcc81,
    sleep: _0x16ee5f,
    sleepWithinDeadline: _0x329433,
    state: _0x3cec27
  } = _0xaa706d;
  function _0x3cad88(_0x24dc7a) {
    return !!_0x24dc7a && typeof _0x24dc7a.getBoundingClientRect === "function";
  }
  function _0x593d97(_0xc0986b) {
    if (!_0x3cad88(_0xc0986b)) {
      return false;
    }
    try {
      const _0x49b987 = _0xc0986b.getBoundingClientRect();
      return _0x49b987.width > 0 && _0x49b987.height > 0;
    } catch (_0x548155) {
      return false;
    }
  }
  function _0x46db38(_0x4e8596, _0x3d48df = 2) {
    if (!_0x3cad88(_0x4e8596)) {
      return false;
    }
    try {
      const _0x3b50b0 = _0x4e8596.getBoundingClientRect();
      const _0x4e175f = Math.max(window.innerHeight || 800, 600);
      const _0x39f0b7 = Math.max(window.innerWidth || 1200, 800);
      return _0x3b50b0.bottom > -50 && _0x3b50b0.right > -50 && _0x3b50b0.top < _0x4e175f + 160 && _0x3b50b0.left < _0x39f0b7 + 100;
    } catch (_0xea3857) {
      return false;
    }
  }
  function _0x158526(_0x14ce76, _0x4d1e66 = 2) {
    if (!_0x14ce76 || !_0x593d97(_0x14ce76)) {
      return false;
    }
    if (window.innerHeight < 240 || window.innerWidth < 240) {
      return true;
    }
    return _0x46db38(_0x14ce76, _0x4d1e66);
  }
  function _0x9c55e(_0x198a4f, _0x5069c9 = "douyin.com") {
    if (["profileFollowBtn", "profileMessageBtn"].includes(_0x198a4f) && (typeof _0x3e3fd4 !== "function" || !_0x3e3fd4())) {
      console.warn("[Built-in-Debug] [RuntimeConfig] 主页动作控件包未就绪，拒绝定位 " + _0x198a4f);
      return null;
    }
    if (["dmInput", "dmSendBtn"].includes(_0x198a4f) && (typeof _0x4d876d !== "function" || !_0x4d876d())) {
      console.warn("[Built-in-Debug] [RuntimeConfig] 私信控件包未就绪，拒绝定位 " + _0x198a4f);
      return null;
    }
    if (_0x198a4f === "profileFollowBtn") {
      const _0x13cc0e = _0x128539(true);
      if (_0x13cc0e) {
        return _0x13cc0e;
      }
    }
    if (_0x198a4f === "profileMessageBtn") {
      const _0x370c6b = _0x1b8b60(true);
      if (_0x370c6b) {
        return _0x370c6b;
      }
    }
    const _0x289087 = new Set(["profileFollowBtn", "profileMessageBtn", "dmInput", "dmSendBtn"]);
    const _0x18dc7a = _0x289087.has(_0x198a4f) ? typeof _0x3291db === "function" && _0x3291db(_0x198a4f) || "" : _0x3b3648[_0x5069c9]?.[_0x198a4f] || "";
    const _0x11b8a1 = _0x18dc7a.split(", ");
    for (const _0xeb7680 of _0x11b8a1) {
      if (!_0xeb7680 || _0xeb7680.includes(":contains") || _0xeb7680.includes(":has-text")) {
        continue;
      }
      try {
        const _0x214d86 = Array.from(document.querySelectorAll(_0xeb7680));
        if (_0x214d86.length > 0) {
          console.log("[Built-in-Debug] [选择器检测] " + _0x198a4f + " -> \"" + _0xeb7680 + "\" 发现 " + _0x214d86.length + " 个候选元素");
          _0x214d86.forEach((_0x5b8c01, _0x450cee) => {
            const _0x1df948 = _0x5b8c01.getBoundingClientRect();
            console.log("  [候选 " + _0x450cee + "] Tag: " + _0x5b8c01.tagName + ", Class: " + _0x5b8c01.className + ", Text: \"" + (_0x5b8c01.innerText || "").substring(0, 20) + "\", Visible: " + _0x593d97(_0x5b8c01) + ", Rect: " + Math.round(_0x1df948.width) + "x" + Math.round(_0x1df948.height) + " @ (" + Math.round(_0x1df948.left) + ", " + Math.round(_0x1df948.top) + ")");
          });
          const _0x290aaf = _0x214d86.find(_0x15047d => _0x593d97(_0x15047d));
          if (_0x290aaf) {
            console.log("[Built-in-Debug] [选择器命中] 已选择可见候选元素: " + _0x290aaf.tagName);
            return _0x290aaf;
          }
        }
      } catch (_0x1d64c8) {}
    }
    const _0x54c639 = _0x198a4f.toLowerCase();
    if (_0x54c639 === "dminput") {
      return null;
    }
    let _0x1f7aee = [];
    if (_0x54c639.includes("send")) {
      const _0x366510 = typeof _0x2a8bdb === "function" ? _0x2a8bdb("dmSend") : null;
      _0x1f7aee = _0x366510?.exactTexts || [];
    } else if (_0x54c639.includes("follow")) {
      _0x1f7aee = typeof _0x5f0db3 === "function" && _0x5f0db3("followVariants") || [];
    } else if (_0x54c639.includes("message") || _0x54c639.includes("dm")) {
      const _0x2e54af = typeof _0x2a8bdb === "function" ? _0x2a8bdb("profileMessage") : null;
      const _0x30ea31 = typeof _0x5f0db3 === "function" && _0x5f0db3("messageVariants") || [];
      _0x1f7aee = _0x30ea31.length ? _0x30ea31 : _0x2e54af?.exactTexts || [];
    }
    if (_0x1f7aee.length > 0) {
      console.log("[Built-in-Debug] [文本查找] 正在为 " + _0x198a4f + " 匹配文本变体: " + _0x1f7aee.join(", "));
      const _0x46b069 = typeof _0x4e8db8 === "function" ? _0x4e8db8("actionButtonCandidates") : "";
      if (!_0x46b069) {
        console.warn("[Built-in-Debug] [RuntimeConfig] actionButtonCandidates 未下发，拒绝扫描 " + _0x198a4f);
        return null;
      }
      let _0x37f8e1 = [];
      try {
        _0x37f8e1 = Array.from(document.querySelectorAll(_0x46b069));
      } catch (_0xb7c03d) {
        return null;
      }
      const _0x4ff57d = [];
      for (const _0x2125b3 of _0x37f8e1) {
        const _0x139ca7 = (_0x2125b3.innerText || _0x2125b3.textContent || "").trim();
        if (_0x1f7aee.some(_0x7b4df7 => _0x139ca7 === _0x7b4df7 || _0x139ca7.length < 10 && _0x139ca7.includes(_0x7b4df7))) {
          _0x4ff57d.push({
            el: _0x2125b3,
            text: _0x139ca7
          });
        }
      }
      if (_0x4ff57d.length > 0) {
        console.log("[Built-in-Debug] [文本匹配] 发现 " + _0x4ff57d.length + " 个文本匹配候选");
        _0x4ff57d.forEach((_0x188337, _0x14e9d2) => {
          const _0x46efca = _0x188337.el.getBoundingClientRect();
          console.log("  [文本候选 " + _0x14e9d2 + "] Text: \"" + _0x188337.text + "\", Tag: " + _0x188337.el.tagName + ", Visible: " + _0x593d97(_0x188337.el) + ", Rect: " + Math.round(_0x46efca.width) + "x" + Math.round(_0x46efca.height));
        });
        const _0xd5525f = _0x4ff57d.find(_0x2f9fc5 => _0x593d97(_0x2f9fc5.el));
        if (_0xd5525f) {
          const _0x602657 = _0xd5525f.el;
          const _0x5c29f6 = typeof _0x4e8db8 === "function" ? _0x4e8db8("actionClickableRoot") : "";
          const _0x386a79 = _0x5c29f6 ? _0x602657.closest(_0x5c29f6) : null;
          if (_0x386a79 && _0x593d97(_0x386a79)) {
            console.log("[Built-in-Debug] [优化点击目标] 自动切换至按钮容器: " + _0x386a79.className);
            return _0x386a79;
          }
          return _0x602657;
        }
      }
    }
    console.warn("[Built-in-Debug] [查找失败] 无法定位元素: " + _0x198a4f);
    return null;
  }
  async function _0x31eefb(_0x1b0311, _0x37586f = 24000, _0x5ddefe = null) {
    const _0x55a608 = _0x37586f;
    let _0x4f1b7a = _0x55a608;
    let _0x523fbb = false;
    let _0x2062d1 = false;
    const _0x316373 = 500;
    let _0x5625a9 = Math.ceil(_0x4f1b7a / _0x316373);
    for (let _0xcea63d = 0; _0xcea63d < _0x5625a9; _0xcea63d++) {
      if (_0x4dcc81(_0x1b0311)) {
        return null;
      }
      const _0x511ae0 = _0x9c55e("dmInput");
      if (_0x511ae0 && _0x593d97(_0x511ae0)) {
        console.log("[Built-in-Debug] [私信输入] 远端控件命中，聊天窗口已就绪 (第 " + (_0xcea63d + 1) + " 次尝试成功)");
        return _0x511ae0;
      }
      try {
        const _0x123c84 = String(window.location.href || "");
        const _0x1d8629 = typeof _0x3291db === "function" ? _0x3291db("dmInputHint") : "";
        if (/\/chat|im\.|message|消息/.test(_0x123c84) || _0x1d8629 && document.querySelector(_0x1d8629)) {
          _0x2062d1 = true;
        }
      } catch (_0x1aedfd) {}
      if ((_0xcea63d === 8 || _0xcea63d === 16 || _0x523fbb && (_0xcea63d === 24 || _0xcea63d === 32)) && _0x5ddefe) {
        console.log("[Built-in-Debug] [私信输入] 加载较慢，重试点击私信按钮");
        try {
          await _0x2d90b5(_0x5ddefe, _0x1b0311);
        } catch (_0x5bc8a9) {}
      }
      if (!_0x523fbb && _0x2062d1 && _0xcea63d + 1 >= Math.ceil(_0x55a608 / _0x316373) - 1) {
        _0x4f1b7a = _0x50ecf1(_0x55a608, {
          progress: true,
          hardCapMs: Math.min(Math.round(_0x55a608 * 1.75), 42000)
        });
        if (_0x4f1b7a > _0x55a608) {
          _0x523fbb = true;
          _0x5625a9 = Math.ceil(_0x4f1b7a / _0x316373);
          console.log("[Built-in-Debug] [慢环境] 私信窗口已出现但输入框未就绪，延长等待 " + _0x55a608 + "→" + _0x4f1b7a + "ms");
        }
      }
      await _0x16ee5f(_0x316373);
    }
    return null;
  }
  function _0x37b5b4(_0x57609b) {
    if (!_0x57609b || _0x57609b === document.body || _0x57609b === document.documentElement) {
      return false;
    }
    try {
      const _0x5e15a8 = _0x57609b.getAttribute?.("data-e2e") || "";
      if (/^feed-(active-video|active-live|item|live)$/i.test(_0x5e15a8) || _0x5e15a8 === "browse-live" || _0x5e15a8 === "webcast-player") {
        return true;
      }
    } catch (_0x54a619) {}
    const _0x482972 = (_0x57609b.className || "") + " " + (_0x57609b.getAttribute?.("data-e2e") || "") + " " + (_0x57609b.id || "");
    if (/swiper|Swiper|slide-list|SlideList|feed-scroll|FeedScroll|video-switch|player-container|xgplayer|slider-group|recommend-list|RecommendList|water.?fall/i.test(_0x482972)) {
      return true;
    }
    try {
      const _0x3b8ca9 = _0x57609b.getBoundingClientRect();
      const _0xcaa273 = _0x57609b.scrollHeight || 0;
      const _0x142e6e = _0x57609b.clientHeight || 0;
      if (_0x142e6e > window.innerHeight * 0.72 && _0xcaa273 > _0x142e6e + 120 && _0x3b8ca9.width > window.innerWidth * 0.42) {
        const _0x2d3423 = !!_0x57609b.querySelector?.("[data-e2e=\"comment-list\"], .comment-mainContent, [class*=\"CommentList\"]");
        if (!_0x2d3423) {
          return true;
        }
      }
    } catch (_0x32beee) {}
    return false;
  }
  function _0x39b104(_0x395973) {
    let _0x18604d = _0x395973;
    for (let _0x34736d = 0; _0x34736d < 14 && _0x18604d; _0x34736d += 1) {
      if (_0x37b5b4(_0x18604d)) {
        return true;
      }
      _0x18604d = _0x18604d.parentElement;
    }
    return false;
  }
  function _0x5ee924() {
    try {
      if (typeof _0x51bb1a === "function" && _0x51bb1a(_0x3cec27.currentRunningSource)) {
        return true;
      }
      if (typeof _0x326dff === "function" && _0x326dff()) {
        return true;
      }
      const _0x19710f = String(window.location.href || "");
      if (/douyin\.com\/follow/.test(_0x19710f)) {
        return true;
      }
      if (/douyin\.com\/?\?/.test(_0x19710f) && /recommend=1/.test(_0x19710f)) {
        return true;
      }
      if (document.querySelector?.("[data-e2e=\"feed-active-video\"], [data-e2e=\"feed-active-live\"]")) {
        return true;
      }
    } catch (_0x3790c3) {}
    return false;
  }
  function _0x2e7d9b(_0x33fada, _0xe67bf1) {
    if (!_0x33fada?.closest || typeof _0x1d972a !== "function") {
      return null;
    }
    const _0x5a1ca8 = _0x1d972a(_0xe67bf1);
    if (!_0x5a1ca8) {
      return null;
    }
    try {
      return _0x33fada.closest(_0x5a1ca8);
    } catch (_0x196642) {
      return null;
    }
  }
  function _0x1ca7c0(_0x91c17a) {
    return !!_0x2e7d9b(_0x91c17a, "commentFloatingChrome");
  }
  function _0x11a3db(_0x588f0b) {
    return !!_0x2e7d9b(_0x588f0b, "commentFloatingChrome") || !!_0x2e7d9b(_0x588f0b, "commentComposerChrome") || !!_0x2e7d9b(_0x588f0b, "commentPanel") || !!_0x2e7d9b(_0x588f0b, "commentInputShell") || !!_0x2e7d9b(_0x588f0b, "commentInputShellLoose");
  }
  function _0x5db5c5(_0x2e8451) {
    if (!_0x2e8451) {
      return;
    }
    try {
      _0x2e8451.focus?.({
        preventScroll: true
      });
    } catch (_0x14aa7c) {
      try {
        _0x2e8451.focus?.();
      } catch (_0x573789) {}
    }
  }
  function _0x2db747(_0x59160c, {
    force = false,
    block = "nearest"
  } = {}) {
    if (!_0x59160c) {
      return false;
    }
    try {
      const _0x353a97 = _0x59160c.getBoundingClientRect();
      if (!(_0x353a97.width > 0) || !(_0x353a97.height > 0)) {
        return false;
      }
      const _0x5c47d8 = _0x353a97.top >= -24 && _0x353a97.bottom <= window.innerHeight + 24 && _0x353a97.left >= -24 && _0x353a97.right <= window.innerWidth + 24;
      if (!force && _0x5c47d8) {
        return false;
      }
      const _0x2ed0ea = _0x5ee924();
      if (_0x11a3db(_0x59160c) || _0x39b104(_0x59160c) || _0x2ed0ea) {
        try {
          const _0x34acff = typeof _0x54e433 === "function" ? _0x54e433(document.body) : null;
          if (_0x34acff && _0x34acff.contains(_0x59160c)) {
            const _0x4cc129 = typeof _0x3844a4 === "function" ? _0x3844a4(document) : null;
            const _0x62fc19 = _0x4cc129 && _0x4cc129.contains(_0x59160c) ? _0x4cc129 : _0x34acff;
            const _0x2cc2df = _0x59160c.getBoundingClientRect();
            const _0x33e35b = _0x62fc19.getBoundingClientRect();
            if (_0x2cc2df.bottom > _0x33e35b.bottom - 10) {
              _0x62fc19.scrollTop += _0x2cc2df.bottom - _0x33e35b.bottom + 28;
              return true;
            }
            if (_0x2cc2df.top < _0x33e35b.top + 10) {
              _0x62fc19.scrollTop -= _0x33e35b.top - _0x2cc2df.top + 28;
              return true;
            }
          }
        } catch (_0x1fbfd8) {}
        console.log("[Built-in-Debug] [自动滚动] 跳过 Feed/评论框 scrollIntoView，防止 macOS 半截吸附");
        return false;
      }
      _0x59160c.scrollIntoView({
        block: block,
        inline: "nearest",
        behavior: "instant"
      });
      return true;
    } catch (_0x2ad18c) {
      return false;
    }
  }
  function _0x1717fe(_0x28cb24) {
    if (!_0x28cb24?.tagName) {
      return _0x28cb24;
    }
    const _0x48c9c2 = ["svg", "path", "g", "rect", "circle", "use"];
    if (!_0x48c9c2.includes(_0x28cb24.tagName.toLowerCase())) {
      return _0x28cb24;
    }
    const _0x157978 = typeof _0x3291db === "function" ? _0x3291db("dmExplicitSendSvg") : "";
    const _0x12ed1d = _0x157978 ? _0x28cb24.closest?.(_0x157978) : null;
    if (_0x12ed1d) {
      return _0x12ed1d;
    }
    const _0x23e345 = typeof _0x4e8db8 === "function" ? _0x4e8db8("actionClickableRoot") : "";
    return _0x23e345 && _0x28cb24.closest(_0x23e345) || _0x28cb24;
  }
  async function _0x2d90b5(_0xfb03d, _0x5f1e54, _0x15cb89 = {}) {
    if (!_0xfb03d || _0x4dcc81(_0x5f1e54)) {
      return;
    }
    const _0x3dfefe = Number(_0x15cb89.deadlineAt || 0);
    if (_0x3dfefe > 0 && Date.now() >= _0x3dfefe) {
      return;
    }
    await _0x329433(200 + Math.random() * 400, _0x3dfefe);
    if (_0x3dfefe > 0 && Date.now() >= _0x3dfefe) {
      return;
    }
    const _0x1d757d = _0x1717fe(_0xfb03d);
    try {
      const _0x339262 = _0x1d757d.getBoundingClientRect();
      const _0x4196db = _0x1ca7c0(_0x1d757d);
      if (!_0x4196db && (_0x339262.top < 0 || _0x339262.bottom > window.innerHeight)) {
        console.log("[Built-in-Debug] [自动滚动] 目标不在视口内，正在安全对齐...");
        if (_0x2db747(_0x1d757d, {
          block: "nearest"
        })) {
          await _0x329433(500, _0x3dfefe);
        }
        if (_0x3dfefe > 0 && Date.now() >= _0x3dfefe) {
          return;
        }
      }
      const _0x225e3c = _0x1d757d.getBoundingClientRect();
      const _0x2b8bc4 = _0x225e3c.left + _0x225e3c.width / 2;
      const _0x3b708b = _0x225e3c.top + _0x225e3c.height / 2;
      const _0x16ee68 = _0x225e3c.width <= 0 || _0x225e3c.height <= 0 || _0x2b8bc4 < 1 || _0x3b708b < 1;
      const _0x588628 = _0x2b8bc4 > window.innerWidth - 1 || _0x3b708b > window.innerHeight - 1;
      if (_0x16ee68 || !_0x4196db && _0x588628) {
        console.warn("[Built-in-Debug] [点击拦截] 目标未就绪或超出可视区，跳过注入点击: (" + Math.round(_0x2b8bc4) + ", " + Math.round(_0x3b708b) + ")");
        if (_0x1ca7c0(_0x1d757d)) {
          _0x1ae075("点击拦截 fallback .click() " + _0x34aefa(_0x1d757d));
        }
        if (_0x1d757d.click) {
          _0x1d757d.click();
        }
        return;
      }
      console.log("[Built-in-Debug] [点击执行] 目标: " + _0x1d757d.tagName + ", 坐标: (" + Math.round(_0x2b8bc4) + ", " + Math.round(_0x3b708b) + ")");
      try {
        const _0x119c67 = "btn-clk-" + Date.now();
        _0x1d757d.setAttribute("data-automation-id", _0x119c67);
        const _0x38db07 = document.createElement("script");
        _0x38db07.textContent = sanitizeInlinePageScript("(function(){\n                try {\n                    var el = document.querySelector('[data-automation-id=\"" + _0x119c67 + "\"]');\n                    if (!el) return;\n                    var rect = el.getBoundingClientRect();\n                    var cx = rect.left + rect.width / 2;\n                    var cy = rect.top + rect.height / 2;\n                    var e = { bubbles: true, cancelable: true, view: window, clientX: cx, clientY: cy, buttons: 1 };\n                    \n                    // 1. 发送 Pointer 事件 (对现代 UI 框架更有效)\n                    el.dispatchEvent(new PointerEvent('pointerdown', e));\n                    el.dispatchEvent(new MouseEvent('mousedown', e));\n                    \n                    setTimeout(function() {\n                        el.dispatchEvent(new PointerEvent('pointerup', e));\n                        el.dispatchEvent(new MouseEvent('mouseup', e));\n                        if (el.click) el.click(); // 3. 只有 HTMLElement 才有 .click()\n                    }, 50);\n                } catch(err) {}\n            })();");
        (document.head || document.documentElement).appendChild(_0x38db07);
        setTimeout(() => {
          _0x38db07.remove();
          if (_0x1d757d && _0x1d757d.removeAttribute) {
            _0x1d757d.removeAttribute("data-automation-id");
          }
        }, 1000);
      } catch (_0x5511a1) {
        console.error("[Built-in-Debug] [穿透点击异常]", _0x5511a1);
        if (_0x1d757d.click) {
          _0x1d757d.click();
        }
      }
    } catch (_0x16becf) {
      console.error("[Built-in-Debug] [点击异常] " + _0x16becf.message);
      if (_0xfb03d.click) {
        _0xfb03d.click();
      }
    }
  }
  function _0x4b2e0a(_0x1a5359) {
    if (!_0x1a5359 || _0x1a5359.nodeType !== 1) {
      return false;
    }
    let _0x26fde3 = _0x1a5359;
    for (let _0x36d6f6 = 0; _0x36d6f6 < 10 && _0x26fde3 && _0x26fde3 !== document.body; _0x36d6f6 += 1) {
      const _0x5b4476 = _0x26fde3.parentElement;
      if (!_0x5b4476) {
        break;
      }
      let _0x4ee820 = "";
      try {
        _0x4ee820 = String(window.getComputedStyle(_0x5b4476).overflowY || "");
      } catch (_0x58b15a) {
        _0x4ee820 = "";
      }
      const _0x3c820e = _0x4ee820 === "auto" || _0x4ee820 === "scroll" || _0x5b4476.getAttribute?.("scrollable") === "true";
      if (_0x3c820e && _0x5b4476.scrollHeight > _0x5b4476.clientHeight + 8) {
        try {
          const _0xac0b66 = _0x26fde3.getBoundingClientRect();
          const _0x32c6aa = _0x5b4476.getBoundingClientRect();
          if (_0xac0b66.top < _0x32c6aa.top + 4) {
            _0x5b4476.scrollTop -= _0x32c6aa.top - _0xac0b66.top + 12;
          } else if (_0xac0b66.bottom > _0x32c6aa.bottom - 4) {
            _0x5b4476.scrollTop += _0xac0b66.bottom - _0x32c6aa.bottom + 12;
          }
        } catch (_0x5c82a2) {}
        return true;
      }
      _0x26fde3 = _0x5b4476;
    }
    return false;
  }
  function _0x2f0d54(_0x27c8d9, _0xe92ce1 = {}) {
    if (!_0x27c8d9?.getBoundingClientRect) {
      return null;
    }
    const _0x5e774c = [];
    if (_0xe92ce1.preferInner) {
      let _0x4d664d = null;
      try {
        _0x4d664d = _0x27c8d9.querySelector?.(_0xe92ce1.preferInner);
      } catch (_0x547100) {
        _0x4d664d = null;
      }
      if (_0x4d664d) {
        _0x5e774c.push({
          el: _0x4d664d,
          strict: true
        });
      }
    }
    _0x5e774c.push({
      el: _0x27c8d9,
      strict: false
    });
    const _0x2a9e02 = [[0.5, 0.5]];
    const _0x1363ad = [[0.5, 0.35], [0.5, 0.65], [0.32, 0.5], [0.68, 0.5], [0.2, 0.5]];
    let _0x4afc81 = null;
    for (const {
      el: _0x25d1b6,
      strict: _0x24e1c8
    } of _0x5e774c) {
      const _0x581a7a = _0x25d1b6.getBoundingClientRect();
      if (_0x581a7a.width <= 0 || _0x581a7a.height <= 0) {
        continue;
      }
      const _0x21e806 = _0x581a7a.left + _0x581a7a.width * 0.5;
      const _0x558054 = _0x581a7a.top + _0x581a7a.height * 0.5;
      if (!_0x4afc81 && !_0x24e1c8) {
        _0x4afc81 = {
          x: _0x21e806,
          y: _0x558054,
          aimedInner: false,
          hitTag: _0x25d1b6.tagName || "?",
          matched: false
        };
      }
      const _0x45df5d = _0xe92ce1.allowOffsetSamples ? [..._0x2a9e02, ..._0x1363ad] : _0x2a9e02;
      for (const [_0x1e30ad, _0x49acf1] of _0x45df5d) {
        const _0x2a4b9b = _0x581a7a.left + _0x581a7a.width * _0x1e30ad;
        const _0x45e478 = _0x581a7a.top + _0x581a7a.height * _0x49acf1;
        let _0x330ff1 = null;
        try {
          _0x330ff1 = document.elementFromPoint(_0x2a4b9b, _0x45e478);
        } catch (_0x45129d) {
          _0x330ff1 = null;
        }
        if (!_0x330ff1) {
          continue;
        }
        const _0x4258ef = _0x330ff1 === _0x25d1b6 || _0x25d1b6.contains(_0x330ff1) || _0x330ff1.contains(_0x25d1b6);
        if (!_0x4258ef) {
          continue;
        }
        return {
          x: _0x2a4b9b,
          y: _0x45e478,
          aimedInner: _0x24e1c8,
          hitTag: _0x330ff1.tagName || "?",
          matched: true
        };
      }
      if (!_0x24e1c8 && _0x4afc81) {
        return _0x4afc81;
      }
    }
    return _0x4afc81;
  }
  function _0x37d347(_0x344aff) {
    if (typeof _0x33a9ce === "function") {
      try {
        return _0x33a9ce(_0x344aff);
      } catch (_0x253c50) {}
    }
    if (typeof _0x34aefa === "function") {
      return _0x34aefa(_0x344aff);
    } else {
      return _0x344aff?.tagName || "无";
    }
  }
  function _0x3ce108(_0x1a25d3, _0x2f78f4) {
    try {
      return document.elementFromPoint(_0x1a25d3, _0x2f78f4);
    } catch (_0x516335) {
      return null;
    }
  }
  function _0x3930b6(_0x606fa, _0x1823f2) {
    if (!_0x606fa || !_0x1823f2) {
      return false;
    }
    try {
      return _0x606fa === _0x1823f2 || _0x1823f2.contains(_0x606fa) || _0x606fa.contains(_0x1823f2);
    } catch (_0x19a6fb) {
      return false;
    }
  }
  async function _0x4d6e89(_0x12f3a5, _0x270ff1 = {}) {
    if (!_0x12f3a5?.setAttribute) {
      return _0x1c346a.invoke("simulate-native-click", _0x270ff1);
    }
    const _0x33d436 = "rtc_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 10);
    const _0x4d8a45 = "data-radar-trusted-click-target";
    try {
      _0x12f3a5.setAttribute(_0x4d8a45, _0x33d436);
      return await _0x1c346a.invoke("simulate-native-click", {
        ..._0x270ff1,
        targetToken: _0x33d436
      });
    } finally {
      try {
        if (_0x12f3a5.getAttribute?.(_0x4d8a45) === _0x33d436) {
          _0x12f3a5.removeAttribute(_0x4d8a45);
        }
      } catch (_0x5c49aa) {}
    }
  }
  function _0xf01e61(_0x337ef1, _0x3afc0a = {}) {
    if (_0x3afc0a.traceToRunLog === false) {
      return false;
    }
    if (_0x3afc0a.traceToRunLog) {
      return true;
    }
    return _0x59f95f(_0x337ef1);
  }
  function _0x59f95f(_0xf80d53) {
    return /表情|表情包|emoji/i.test(String(_0xf80d53 || ""));
  }
  function _0x4da902() {
    try {
      if (window.__radarAutomationViewportResizeTrackerInstalled) {
        return;
      }
      window.__radarAutomationViewportResizeTrackerInstalled = true;
      const _0x12dbd1 = () => {
        window.__radarAutomationViewportChangedAt = Date.now();
      };
      window.addEventListener("resize", _0x12dbd1, {
        passive: true
      });
      window.visualViewport?.addEventListener?.("resize", _0x12dbd1, {
        passive: true
      });
    } catch (_0x1c2e29) {}
  }
  async function _0x5a2124(_0x4d3d28, _0x40c545 = 0) {
    _0x4da902();
    const _0x3a836c = 260;
    const _0x5e4478 = Date.now();
    while (!_0x4dcc81(_0x4d3d28) && Date.now() - _0x5e4478 < 1400) {
      const _0x25b774 = Number(window.__radarAutomationViewportChangedAt || 0);
      if (!_0x25b774 || Date.now() - _0x25b774 >= _0x3a836c) {
        return true;
      }
      if (_0x40c545 > 0 && Date.now() >= _0x40c545) {
        return false;
      }
      await _0x329433(Math.min(90, _0x3a836c), _0x40c545);
    }
    return !_0x4dcc81(_0x4d3d28);
  }
  async function _0x419f0a(_0x2a88c0, _0x527033, _0x2514f3 = 0, _0xc99b47 = {}) {
    if (!_0x2a88c0?.getBoundingClientRect) {
      return false;
    }
    const _0x2977c7 = Math.max(500, Number(_0xc99b47.targetStableTimeoutMs) || 1800);
    const _0x456478 = Math.max(80, Number(_0xc99b47.targetStableIntervalMs) || 140);
    const _0x57fcf7 = Math.max(2, Number(_0xc99b47.targetStableSamples) || 3);
    const _0x58741b = Math.max(0.5, Number(_0xc99b47.targetStableTolerance) || 1.5);
    const _0x589633 = Date.now();
    let _0x273628 = null;
    let _0x54ae76 = 0;
    while (!_0x4dcc81(_0x527033) && Date.now() - _0x589633 < _0x2977c7) {
      if (_0x2514f3 > 0 && Date.now() >= _0x2514f3) {
        return false;
      }
      if (_0x2a88c0.isConnected === false) {
        return false;
      }
      let _0x1eab68 = null;
      try {
        _0x1eab68 = _0x2a88c0.getBoundingClientRect();
      } catch (_0x42656a) {
        _0x1eab68 = null;
      }
      const _0xd55013 = _0x1eab68 && _0x1eab68.width > 1 && _0x1eab68.height > 1 ? _0x2f0d54(_0x2a88c0, {
        ..._0xc99b47,
        allowOffsetSamples: true
      }) : null;
      const _0x5b1aee = _0x1eab68 && _0xd55013?.matched ? {
        left: _0x1eab68.left,
        top: _0x1eab68.top,
        width: _0x1eab68.width,
        height: _0x1eab68.height
      } : null;
      const _0x2dc9c9 = !!_0x5b1aee && !!_0x273628 && !!(Math.abs(_0x5b1aee.left - _0x273628.left) <= _0x58741b) && !!(Math.abs(_0x5b1aee.top - _0x273628.top) <= _0x58741b) && !!(Math.abs(_0x5b1aee.width - _0x273628.width) <= _0x58741b) && !!(Math.abs(_0x5b1aee.height - _0x273628.height) <= _0x58741b);
      _0x54ae76 = _0x5b1aee ? _0x2dc9c9 ? _0x54ae76 + 1 : 1 : 0;
      if (_0x54ae76 >= _0x57fcf7) {
        return true;
      }
      _0x273628 = _0x5b1aee;
      await _0x329433(_0x456478, _0x2514f3);
    }
    return false;
  }
  function _0x27105e(_0x37f615) {
    if (!_0x37f615?.getBoundingClientRect) {
      return false;
    }
    try {
      const _0x597a09 = _0x37f615.getBoundingClientRect();
      return _0x597a09.width > 1 && _0x597a09.height > 1;
    } catch (_0x57b12a) {
      return false;
    }
  }
  function _0x2edcfc(_0x2e84f0) {
    const _0x236f97 = _0x1717fe(_0x2e84f0);
    if (_0x27105e(_0x236f97)) {
      return _0x236f97;
    }
    if (_0x27105e(_0x2e84f0)) {
      return _0x2e84f0;
    }
    try {
      const _0x3c8e56 = _0x2e84f0?.querySelector?.("img");
      if (_0x27105e(_0x3c8e56)) {
        return _0x3c8e56;
      }
      const _0x23b87 = Array.from(_0x2e84f0?.children || []).find(_0x27105e);
      if (_0x23b87) {
        return _0x23b87;
      }
    } catch (_0x4606bd) {}
    let _0xf6b457 = _0x2e84f0?.parentElement;
    for (let _0x56f9f9 = 0; _0x56f9f9 < 5 && _0xf6b457 && _0xf6b457 !== document.body; _0x56f9f9 += 1) {
      if (_0x27105e(_0xf6b457)) {
        const _0x268cad = _0xf6b457.getBoundingClientRect();
        if (_0x268cad.width <= 220 && _0x268cad.height <= 220) {
          return _0xf6b457;
        }
      }
      _0xf6b457 = _0xf6b457.parentElement;
    }
    return _0x236f97 || _0x2e84f0;
  }
  async function _0x296bfe(_0x55192d, _0x59da2b, _0x14b2a1 = "控件", _0x2c30b = {}) {
    if (!_0x55192d || _0x4dcc81(_0x59da2b)) {
      return false;
    }
    const _0x2d1166 = Number(_0x2c30b.deadlineAt || 0);
    if (_0x2d1166 > 0 && Date.now() >= _0x2d1166) {
      return false;
    }
    const _0x194616 = _0x59f95f(_0x14b2a1);
    const _0x24a4f1 = _0x194616 || _0x2c30b.requireTargetHit === true;
    if (_0x194616 && !(await _0x5a2124(_0x59da2b, _0x2d1166))) {
      return false;
    }
    const _0x1e0b01 = _0x2edcfc(_0x55192d);
    try {
      _0x4b2e0a(_0x1e0b01);
    } catch (_0x591568) {}
    try {
      const _0x2b1ff0 = _0x2c30b.allowScrollIntoView !== false;
      const _0x40a11f = _0x1ca7c0(_0x1e0b01);
      if (_0x2b1ff0 && !_0x40a11f) {
        const _0x395b44 = _0x1e0b01.getBoundingClientRect();
        const _0x48ec79 = _0x395b44.top < -8 || _0x395b44.bottom > window.innerHeight + 8 || _0x395b44.left < -8 || _0x395b44.right > window.innerWidth + 8;
        if (_0x48ec79 || _0x2c30b.forceScrollIntoView) {
          _0x2db747(_0x1e0b01, {
            force: !!_0x2c30b.forceScrollIntoView,
            block: _0x2c30b.scrollBlock || "nearest"
          });
        }
      }
    } catch (_0x5e4d22) {}
    if (_0x2c30b.waitForStableTarget === true) {
      const _0x4a79a7 = await _0x419f0a(_0x1e0b01, _0x59da2b, _0x2d1166, _0x2c30b);
      if (!_0x4a79a7) {
        _0x3cec27.lastTrustedClickDiagnostic = "fail:" + _0x14b2a1 + ":target_unstable";
        return false;
      }
    }
    let _0x2889f6 = _0x2f0d54(_0x1e0b01, _0x2c30b);
    if (!_0x2889f6) {
      const _0x1d8323 = _0x1e0b01.getBoundingClientRect();
      if (_0x1d8323.width > 0 && _0x1d8323.height > 0) {
        _0x2889f6 = {
          x: _0x1d8323.left + _0x1d8323.width * 0.5,
          y: _0x1d8323.top + _0x1d8323.height * 0.5,
          aimedInner: false,
          hitTag: _0x1e0b01.tagName || "?",
          matched: false
        };
      }
    }
    if (!_0x2889f6) {
      console.warn("[Built-in-Debug] [原生激活] " + _0x14b2a1 + " 控件无尺寸，无法派发");
      if (_0xf01e61(_0x14b2a1, _0x2c30b)) {
        _0x160520("📎 「" + _0x14b2a1 + "」控件无尺寸，未派发点击" + (" 原=" + _0x37d347(_0x55192d) + " 点目标=" + _0x37d347(_0x1e0b01)) + (" 连接=" + (_0x55192d.isConnected !== false ? "是" : "否")), null, "warning");
      }
      if (!_0x24a4f1) {
        await _0x2d90b5(_0x55192d, _0x59da2b, {
          deadlineAt: _0x2d1166
        });
      }
      return false;
    }
    let {
      x: _0x165dd1,
      y: _0xdd8742
    } = _0x2889f6;
    let _0x39814c = _0x3ce108(_0x165dd1, _0xdd8742);
    let _0x4dceb6 = _0x3930b6(_0x39814c, _0x1e0b01) || _0x3930b6(_0x39814c, _0x55192d);
    if (_0x194616 && !_0x4dceb6 && !_0x2c30b.allowOffsetSamples) {
      const _0x304907 = _0x2f0d54(_0x1e0b01, {
        ..._0x2c30b,
        allowOffsetSamples: true
      });
      if (_0x304907) {
        const _0x370451 = _0x3ce108(_0x304907.x, _0x304907.y);
        if (_0x3930b6(_0x370451, _0x1e0b01) || _0x3930b6(_0x370451, _0x55192d)) {
          _0x2889f6 = _0x304907;
          _0x165dd1 = _0x304907.x;
          _0xdd8742 = _0x304907.y;
          _0x39814c = _0x370451;
          _0x4dceb6 = true;
        }
      }
    }
    if (!_0x2889f6.matched && _0x39814c && !_0x4dceb6 && !_0x24a4f1) {
      console.warn("[Built-in-Debug] [原生激活] " + _0x14b2a1 + " 坐标未通过命中校验（可能被遮挡），仍按中心点派发");
    }
    if (_0xf01e61(_0x14b2a1, _0x2c30b) && !_0x4dceb6) {
      _0x160520((_0x194616 ? "📎" : "👤") + " 「" + _0x14b2a1 + "」当前落点未命中控件，未派发原生点击（等待布局稳定后重试）", null, "warning");
    }
    if (_0x24a4f1 && !_0x4dceb6) {
      _0x3cec27.lastTrustedClickDiagnostic = "fail:" + _0x14b2a1 + ":target_not_hit";
      return false;
    }
    try {
      const _0x24a30e = await _0x4d6e89(_0x1e0b01, {
        x: _0x165dd1,
        y: _0xdd8742,
        label: _0x14b2a1
      });
      _0x3cec27.lastTrustedClickDiagnostic = _0x24a30e?.success ? "ok:" + _0x14b2a1 + ":" + (_0x24a30e.backgroundHosted ? "bg" : "fg") + ":" + (_0x24a30e.transport || "?") + ":" + (_0x24a30e.targetResolved ? "dom" : "legacy") + ":z" + (_0x24a30e.zoomFactor || "?") : "fail:" + _0x14b2a1 + ":" + (_0x24a30e?.reason || "unknown");
      console.log("[Built-in-Debug] [原生激活] " + _0x14b2a1 + " success=" + !!_0x24a30e?.success + " " + ("background=" + !!_0x24a30e?.backgroundHosted + " transport=" + (_0x24a30e?.transport || "?") + " zoom=" + (_0x24a30e?.zoomFactor || "?") + " ") + ("target=" + (_0x24a30e?.targetResolved ? "live-dom-control" : "legacy-point") + " ") + ("reason=" + (_0x24a30e?.reason || "none") + " ") + ("point=(" + Math.round(_0x165dd1) + "," + Math.round(_0xdd8742) + ") hit=" + _0x2889f6.hitTag) + ("" + (_0x2889f6.aimedInner ? ":inner" : "") + (_0x2889f6.matched ? "" : ":unverified")));
      if (_0x24a30e?.success) {
        _0x3cec27.lastNativeClickBackgroundHosted = !!_0x24a30e.backgroundHosted;
        _0x5db5c5(_0x1e0b01);
        await _0x329433(260, _0x2d1166);
        return true;
      }
    } catch (_0x38b5ce) {
      _0x3cec27.lastTrustedClickDiagnostic = "error:" + _0x14b2a1 + ":" + _0x5cd915(_0x38b5ce?.message || _0x38b5ce, 30);
      console.warn("[Built-in-Debug] [原生激活] " + _0x14b2a1 + " IPC 失败: " + (_0x38b5ce.message || _0x38b5ce));
    }
    if (!_0x4dcc81(_0x59da2b) && !_0x24a4f1) {
      await _0x2d90b5(_0x55192d, _0x59da2b, {
        deadlineAt: _0x2d1166
      });
    }
    return false;
  }
  async function _0xb8958(_0x13bfea, _0x236769, _0x3d3d1d = "输入框") {
    if (!_0x13bfea || _0x4dcc81(_0x236769)) {
      return false;
    }
    _0x5db5c5(_0x13bfea);
    try {
      const _0x3fa192 = await _0x1c346a.invoke("simulate-native-enter");
      _0x3cec27.lastTrustedClickDiagnostic = _0x3fa192?.success ? "ok:" + _0x3d3d1d + ":enter:" + (_0x3fa192.transport || "?") : "fail:" + _0x3d3d1d + ":enter:" + (_0x3fa192?.reason || "unknown");
      console.log("[Built-in-Debug] [原生回车] " + _0x3d3d1d + " success=" + !!_0x3fa192?.success + " " + ("transport=" + (_0x3fa192?.transport || "?") + " reason=" + (_0x3fa192?.reason || "none")));
      if (_0x3fa192?.success) {
        await _0x16ee5f(260);
        return true;
      }
    } catch (_0x1851b2) {
      _0x3cec27.lastTrustedClickDiagnostic = "error:" + _0x3d3d1d + ":enter:" + _0x5cd915(_0x1851b2?.message || _0x1851b2, 30);
      console.warn("[Built-in-Debug] [原生回车] " + _0x3d3d1d + " IPC 失败: " + (_0x1851b2.message || _0x1851b2));
    }
    return false;
  }
  async function _0x2a86de(_0x3f9e56, _0x1a6f7f, _0x22f49a = _0x3f9e56) {
    if (_0x4dcc81(_0x1a6f7f)) {
      return false;
    }
    try {
      const _0x419e75 = await _0x1c346a.invoke("simulate-trusted-key", {
        key: _0x3f9e56
      });
      _0x3cec27.lastTrustedClickDiagnostic = _0x419e75?.success ? "ok:" + _0x22f49a + ":key:" + (_0x419e75.transport || "?") : "fail:" + _0x22f49a + ":key:" + (_0x419e75?.reason || "unknown");
      console.log("[Built-in-Debug] [原生按键] " + _0x22f49a + " success=" + !!_0x419e75?.success + " " + ("transport=" + (_0x419e75?.transport || "?") + " reason=" + (_0x419e75?.reason || "none")));
      if (_0x419e75?.success) {
        await _0x16ee5f(120);
        return true;
      }
    } catch (_0x1891b4) {
      _0x3cec27.lastTrustedClickDiagnostic = "error:" + _0x22f49a + ":key:" + _0x5cd915(_0x1891b4?.message || _0x1891b4, 30);
      console.warn("[Built-in-Debug] [原生按键] " + _0x22f49a + " IPC 失败: " + (_0x1891b4.message || _0x1891b4));
    }
    return false;
  }
  async function _0x38c727(_0x25a930, _0x515833, _0x3e81e2 = null) {
    if (!_0x25a930 || !_0x515833) {
      return false;
    }
    let _0xba2ee2 = _0x25a930;
    if (_0x25a930.getAttribute("contenteditable") !== "true" && !["INPUT", "TEXTAREA"].includes(_0x25a930.tagName)) {
      _0xba2ee2 = _0x25a930.querySelector("[contenteditable=\"true\"]") || _0x25a930;
    }
    _0x5db5c5(_0xba2ee2);
    if (_0xba2ee2.tagName === "TEXTAREA" || _0xba2ee2.tagName === "INPUT") {
      const _0x239623 = _0xba2ee2.ownerDocument?.defaultView || window;
      const _0x52cc92 = _0xba2ee2.tagName === "TEXTAREA" ? Object.getOwnPropertyDescriptor(_0x239623.HTMLTextAreaElement.prototype, "value")?.set : Object.getOwnPropertyDescriptor(_0x239623.HTMLInputElement.prototype, "value")?.set;
      for (const _0x41f4a9 of _0x515833) {
        if (_0x4dcc81(_0x3e81e2)) {
          return false;
        }
        let _0x1040b6 = _0xba2ee2.value;
        try {
          if (_0x52cc92) {
            _0x52cc92.call(_0xba2ee2, _0x1040b6 + _0x41f4a9);
          } else {
            _0xba2ee2.value = _0x1040b6 + _0x41f4a9;
          }
        } catch (_0x304e56) {
          console.warn("[Built-in-Debug] [文本录入] " + _0xba2ee2.tagName + " 写入失败: " + _0x304e56.message);
          return false;
        }
        _0xba2ee2.dispatchEvent(new InputEvent("input", {
          bubbles: true,
          data: _0x41f4a9,
          inputType: "insertText"
        }));
        await _0x27280b(150, 350, _0x3e81e2);
      }
      _0xba2ee2.dispatchEvent(new Event("change", {
        bubbles: true
      }));
      return true;
    }
    const _0x37abde = _0xba2ee2.ownerDocument.defaultView || window;
    const _0x2b50da = _0x37abde.getSelection();
    if (!_0x2b50da) {
      return false;
    }
    _0xba2ee2.dispatchEvent(new CompositionEvent("compositionstart", {
      bubbles: true
    }));
    await _0x27280b(200, 400, _0x3e81e2);
    const _0x20d801 = document.createRange();
    _0x20d801.selectNodeContents(_0xba2ee2);
    _0x20d801.collapse(false);
    _0x2b50da.removeAllRanges();
    _0x2b50da.addRange(_0x20d801);
    for (const _0x3ed536 of _0x515833) {
      if (_0x4dcc81(_0x3e81e2)) {
        return false;
      }
      _0xba2ee2.dispatchEvent(new KeyboardEvent("keydown", {
        key: _0x3ed536,
        bubbles: true
      }));
      _0xba2ee2.dispatchEvent(new InputEvent("beforeinput", {
        bubbles: true,
        cancelable: true,
        data: _0x3ed536,
        inputType: "insertText"
      }));
      const _0x43d7d2 = document.execCommand("insertText", false, _0x3ed536);
      if (!_0x43d7d2) {
        const _0x34c654 = document.createTextNode(_0x3ed536);
        _0x20d801.insertNode(_0x34c654);
        _0x20d801.collapse(false);
        _0x2b50da.removeAllRanges();
        _0x2b50da.addRange(_0x20d801);
      }
      _0xba2ee2.dispatchEvent(new InputEvent("input", {
        bubbles: true,
        data: _0x3ed536,
        inputType: "insertText"
      }));
      _0xba2ee2.dispatchEvent(new KeyboardEvent("keyup", {
        key: _0x3ed536,
        bubbles: true
      }));
      await _0x27280b(120, 400, _0x3e81e2);
    }
    _0xba2ee2.dispatchEvent(new CompositionEvent("compositionend", {
      data: _0x515833,
      bubbles: true
    }));
    _0xba2ee2.dispatchEvent(new InputEvent("input", {
      bubbles: true,
      inputType: "insertCompositionText"
    }));
    if (_0x5ee924() || _0x11a3db(_0xba2ee2)) {
      _0x5db5c5(_0xba2ee2);
    } else {
      await _0x2d90b5(_0xba2ee2, _0x3e81e2);
    }
    return true;
  }
  function _0x27d422(_0x50f82b) {
    if (!_0x50f82b) {
      return [];
    }
    if (Array.isArray(_0x50f82b)) {
      return _0x50f82b.map(_0x30ac98 => String(_0x30ac98 || "").trim().replace(/^@+/, "")).filter(Boolean);
    }
    return String(_0x50f82b).split(/[,，\n\r]+/).map(_0x27abe0 => _0x27abe0.trim().replace(/^@+/, "")).filter(Boolean);
  }
  function _0x5946be() {
    if (!_0x3cec27.currentTask?.enableCommentMention) {
      return [];
    }
    return _0x27d422(_0x3cec27.currentTask?.commentMentionNicknames);
  }
  function _0x54fe8d() {
    if (!_0x3cec27.currentTask?.enableVideoCommentMention) {
      return [];
    }
    return _0x27d422(_0x3cec27.currentTask?.videoCommentMentionNicknames);
  }
  function _0x1258fc(_0x360637 = false) {
    const _0x3b3de6 = _0x360637 ? _0x3cec27.currentTask?.videoCommentMentionPosition : _0x3cec27.currentTask?.commentMentionPosition;
    if (_0x3b3de6 === "after") {
      return "after";
    } else {
      return "before";
    }
  }
  function _0x31679e(_0xb7ae0e) {
    const _0x207b16 = Number(_0xb7ae0e);
    if (!Number.isFinite(_0x207b16)) {
      return 100;
    }
    return Math.max(0, Math.min(100, Math.round(_0x207b16)));
  }
  function _0x1810e1(..._0x4224da) {
    for (const _0x40ab0a of _0x4224da) {
      if (_0x40ab0a == null || _0x40ab0a === "") {
        continue;
      }
      const _0x2808bd = Number(_0x40ab0a);
      if (Number.isFinite(_0x2808bd)) {
        return _0x31679e(_0x2808bd);
      }
    }
    return 100;
  }
  function _0x16d0ca(_0x102dd5 = false) {
    if (_0x102dd5) {
      return _0x1810e1(_0x3cec27.currentTask?.videoCommentMentionPercent, _0x3cec27.currentTask?.batchConfig?.videoCommentMentionPercent);
    }
    return _0x1810e1(_0x3cec27.currentTask?.commentMentionPercent, _0x3cec27.currentTask?.batchConfig?.commentMentionPercent);
  }
  function _0x8054e(_0x366690 = false) {
    const _0x35ed01 = _0x366690 ? _0x54fe8d() : _0x5946be();
    const _0x2845ed = _0x366690 ? "视频主评" : "回复/首作评论";
    if (!_0x35ed01.length) {
      _0x3cec27.currentActionMentionRolled = {
        hit: false,
        percent: 0
      };
      return _0x3cec27.currentActionMentionRolled;
    }
    const _0x1add65 = _0x16d0ca(_0x366690);
    const _0x2b2909 = Math.floor(Math.random() * 100) + 1;
    const _0xebbc85 = _0x2b2909 <= _0x1add65;
    _0x3cec27.currentActionMentionRolled = {
      hit: _0xebbc85,
      percent: _0x1add65,
      roll: _0x2b2909,
      source: _0x366690 ? "videoCommentMentionPercent" : "commentMentionPercent",
      raw: _0x366690 ? _0x3cec27.currentTask?.videoCommentMentionPercent : _0x3cec27.currentTask?.commentMentionPercent
    };
    if (_0xebbc85) {
      _0x160520("@ 提及：概率命中（" + _0x2845ed + " " + _0x1add65 + "%；随机 " + _0x2b2909 + "），本次将 @");
    } else {
      _0x160520("@ 提及：概率未命中（" + _0x2845ed + " " + _0x1add65 + "%；随机 " + _0x2b2909 + "），本次跳过 @");
    }
    console.log("[评论@提及] " + _0x2845ed + " 概率判定:", _0x3cec27.currentActionMentionRolled);
    return _0x3cec27.currentActionMentionRolled;
  }
  function _0x19f5d2(_0x2ad961 = false) {
    const _0x302b13 = _0x2ad961 ? _0x54fe8d().length > 0 : _0x5946be().length > 0;
    if (!_0x302b13) {
      return false;
    }
    if (!_0x3cec27.currentActionMentionRolled) {
      _0x8054e(_0x2ad961);
    }
    return !!_0x3cec27.currentActionMentionRolled?.hit;
  }
  function _0x1d0184(_0x28ab0e, _0x2176b1 = false) {
    const _0xe6674f = String(_0x28ab0e || "").trim();
    if (!_0xe6674f) {
      return;
    }
    console.log("[评论@提及] " + _0xe6674f);
    if (_0x2176b1) {
      _0x160520("@ 探测：" + _0x5cd915(_0xe6674f, 120));
    }
  }
  function _0x1b0ad3(_0xa7400b, _0x419f56 = 4) {
    function _0x3c8d7f(_0x54e118, _0x6541ef) {
      if (_0x6541ef > _0x419f56) {
        return "";
      }
      if (!_0x54e118) {
        return "";
      }
      const _0x180cbd = _0x54e118.tagName || "";
      const _0x50a383 = _0x54e118.className || "";
      const _0x53f29d = _0x54e118.id || "";
      const _0x15ca7e = _0x54e118.childNodes.length === 1 && _0x54e118.childNodes[0].nodeType === 3 ? (_0x54e118.textContent || "").trim().slice(0, 40) : "";
      const _0x5a930e = _0x54e118.getBoundingClientRect ? _0x54e118.getBoundingClientRect() : null;
      const _0x2bbcb4 = _0x5a930e ? " @(" + Math.round(_0x5a930e.left) + "," + Math.round(_0x5a930e.top) + ") " + Math.round(_0x5a930e.width) + "x" + Math.round(_0x5a930e.height) : "";
      const _0x4bfee1 = _0x54e118.getAttribute ? _0x54e118.getAttribute("data-e2e") : "";
      const _0x100a18 = _0x4bfee1 ? " e2e=\"" + _0x4bfee1 + "\"" : "";
      let _0x55cd30 = "  ".repeat(_0x6541ef) + "<" + _0x180cbd + (_0x53f29d ? " id=\"" + _0x53f29d + "\"" : "") + (_0x50a383 ? " class=\"" + _0x50a383 + "\"" : "") + _0x100a18 + _0x2bbcb4 + "> " + _0x15ca7e;
      let _0xcbb46 = [];
      if (_0x54e118.children) {
        for (let _0x5bb0ed = 0; _0x5bb0ed < _0x54e118.children.length; _0x5bb0ed++) {
          _0xcbb46.push(_0x3c8d7f(_0x54e118.children[_0x5bb0ed], _0x6541ef + 1));
        }
      }
      return [_0x55cd30, ..._0xcbb46.filter(Boolean)].join("\n");
    }
    try {
      const _0x374492 = _0x3c8d7f(_0xa7400b, 0);
      console.log("[评论@提及] DOM Tree Dump:\n" + _0x374492);
    } catch (_0x155461) {
      console.error("[评论@提及] DOM Tree Dump 失败: " + _0x155461.message);
    }
  }
  function _0x4df347(_0x525933, _0x19d71c) {
    if (!_0x525933) {
      return null;
    }
    const _0x18719e = "on" + _0x19d71c.charAt(0).toUpperCase() + _0x19d71c.slice(1);
    const _0x237368 = _0x3a9cdb => {
      const _0x4651ff = Object.keys(_0x3a9cdb);
      const _0xfa4597 = _0x4651ff.find(_0xc55847 => _0xc55847.startsWith("__reactProps") || _0xc55847.startsWith("__reactEventHandlers") || _0xc55847.startsWith("__reactInternalInstance"));
      if (_0xfa4597 && _0x3a9cdb[_0xfa4597]) {
        const _0x153b2e = _0x3a9cdb[_0xfa4597];
        if (_0x153b2e[_0x18719e] && typeof _0x153b2e[_0x18719e] === "function") {
          return {
            handler: _0x153b2e[_0x18719e],
            target: _0x3a9cdb
          };
        }
        if (_0x153b2e[_0x19d71c] && typeof _0x153b2e[_0x19d71c] === "function") {
          return {
            handler: _0x153b2e[_0x19d71c],
            target: _0x3a9cdb
          };
        }
      }
      const _0x27c549 = _0x4651ff.find(_0x35b6ac => _0x35b6ac.startsWith("__reactFiber") || _0x35b6ac.startsWith("__reactInternal"));
      if (_0x27c549 && _0x3a9cdb[_0x27c549]) {
        let _0x4837e1 = _0x3a9cdb[_0x27c549];
        while (_0x4837e1) {
          if (_0x4837e1.memoizedProps) {
            const _0xf05a7d = _0x4837e1.memoizedProps;
            if (_0xf05a7d[_0x18719e] && typeof _0xf05a7d[_0x18719e] === "function") {
              return {
                handler: _0xf05a7d[_0x18719e],
                target: _0x3a9cdb
              };
            }
          }
          _0x4837e1 = _0x4837e1.return;
        }
      }
      return null;
    };
    let _0x5be458 = _0x525933;
    while (_0x5be458 && _0x5be458 !== document.body) {
      const _0xa322aa = _0x237368(_0x5be458);
      if (_0xa322aa) {
        return _0xa322aa;
      }
      _0x5be458 = _0x5be458.parentElement;
    }
    return null;
  }
  function _0x3e10a4(_0xc83f22, _0x1569b9, _0x527f26 = {}) {
    const _0x170e73 = _0x4df347(_0xc83f22, _0x1569b9);
    if (!_0x170e73) {
      _0x1d0184("[React-Trigger] 未能在 " + _0xc83f22.tagName + " 及其祖先中找到 " + _0x1569b9 + " 处理器");
      return false;
    }
    _0x1d0184("[React-Trigger] 发现 " + _0x1569b9 + " 处理器在 " + _0x170e73.target.tagName + " 上", true);
    try {
      const _0x208bb4 = {
        preventDefault: () => {},
        stopPropagation: () => {},
        target: _0xc83f22,
        currentTarget: _0x170e73.target,
        bubbles: true,
        cancelable: true,
        isTrusted: true,
        type: _0x1569b9,
        ..._0x527f26
      };
      _0x170e73.handler(_0x208bb4);
      return true;
    } catch (_0x17e928) {
      _0x1d0184("[React-Trigger] 执行 " + _0x1569b9 + " 失败: " + _0x17e928.message, true);
      return false;
    }
  }
  function _0x24f2de(_0x3d536c) {
    if (!_0x3d536c) {
      return "无";
    }
    const _0x21c927 = _0x3d536c.getBoundingClientRect();
    const _0x4e96a8 = String(_0x3d536c.className || "").split(/\s+/).filter(Boolean).slice(0, 3).join(".");
    const _0x99e64a = _0x3d536c.getAttribute("data-e2e") || "";
    return "" + _0x3d536c.tagName + (_0x4e96a8 ? "." + _0x4e96a8 : "") + (_0x99e64a ? "[e2e=" + _0x99e64a + "]" : "") + " " + Math.round(_0x21c927.width) + "x" + Math.round(_0x21c927.height) + "@(" + Math.round(_0x21c927.left) + "," + Math.round(_0x21c927.top) + ")";
  }
  function _0x5dfb03(_0x230dd7) {
    if (!_0x230dd7) {
      return false;
    }
    const _0x3d4179 = String(_0x230dd7.className || "");
    if (/atBox-outside|atBox-inner|atbox-outside|atbox-inner/i.test(_0x3d4179)) {
      return true;
    }
    return !!_0x230dd7.querySelector?.("[class*=\"atBox-inner\"], [class*=\"atBox-outside\"]");
  }
  function _0x2e92d2(_0x12e356) {
    if (!_0x12e356) {
      return true;
    }
    const _0x2df1a5 = String(_0x12e356.className || "").toLowerCase();
    const _0x2994f9 = String(_0x12e356.getAttribute("data-e2e") || "").toLowerCase();
    const _0x3c650d = _0x2df1a5 + " " + _0x2994f9;
    if (/douyin-navigation|comment-input-inner|comment-input-container|comment-compose|tab-user_|tab-user_self|navigation|sidebar/.test(_0x3c650d)) {
      return true;
    }
    if (_0x12e356.closest?.("[data-e2e=\"douyin-navigation\"]")) {
      return true;
    }
    if (_0x12e356.closest?.("[class*=\"comment-input-inner\"]") && !_0x5dfb03(_0x12e356)) {
      return true;
    }
    return false;
  }
  function _0x5627d7(_0x445ecd) {
    try {
      const _0x6dcae7 = _0x445ecd.querySelector("span:not([class*=\"avatar\"]):not([class*=\"Avatar\"]):not(.kkIgSOBm), p, [class*=\"name\"], [class*=\"nick\"]");
      if (_0x6dcae7) {
        const _0x4273a6 = (_0x6dcae7.innerText || _0x6dcae7.textContent || "").trim();
        if (_0x4273a6) {
          return _0x4273a6;
        }
      }
    } catch (_0x64abee) {}
    const _0x3ce809 = (_0x445ecd.innerText || _0x445ecd.textContent || "").replace(/\s+/g, " ").trim();
    if (!_0x3ce809) {
      return "";
    }
    return _0x3ce809.split(/\s/)[0] || _0x3ce809.slice(0, 40);
  }
  function _0x1a2686(_0xc073dd) {
    return String(_0xc073dd || "").replace(/\s+/g, "").toLowerCase().replace(/[^\w\u4e00-\u9fff]/g, "");
  }
  function _0x1c961c(_0x2cb08c) {
    const _0x43cf19 = String(_0x2cb08c?.text || "").trim();
    if (!_0x43cf19) {
      return false;
    }
    if (/^(精选|推荐|搜索|关注|朋友|我的|直播|放映厅|短剧)$/.test(_0x43cf19)) {
      return false;
    }
    return true;
  }
  function _0x26eaf2(_0x369037 = []) {
    const _0x5ae870 = _0x369037.filter(_0x1c961c);
    if (_0x5ae870.length) {
      return _0x5ae870;
    } else {
      return _0x369037;
    }
  }
  function _0x4c8da2(_0x23a7d0, _0x1672a2) {
    const _0x19add3 = String(_0x1672a2 || "").trim().toLowerCase();
    const _0x506ac6 = _0x1a2686(_0x1672a2);
    const _0x16b7cd = String(_0x23a7d0.text || "").trim().toLowerCase();
    const _0x1d251e = _0x1a2686(_0x23a7d0.text);
    const _0x3e3f71 = String(_0x23a7d0.fullText || "").trim().toLowerCase();
    const _0x2e7856 = _0x1a2686(_0x23a7d0.fullText);
    if (!_0x506ac6) {
      return 0;
    }
    if (_0x16b7cd === _0x19add3 || _0x1d251e === _0x506ac6 || _0x3e3f71 === _0x19add3 || _0x2e7856 === _0x506ac6) {
      return 100;
    }
    if (_0x3e3f71.includes(_0x19add3) || _0x2e7856.includes(_0x506ac6)) {
      return 95;
    }
    if (_0x16b7cd.startsWith(_0x19add3) || _0x1d251e.startsWith(_0x506ac6) || _0x2e7856.startsWith(_0x506ac6)) {
      return 85;
    }
    if (_0x19add3.startsWith(_0x16b7cd) || _0x506ac6.startsWith(_0x1d251e) || _0x506ac6.startsWith(_0x2e7856)) {
      return 80;
    }
    if (_0x16b7cd.includes(_0x19add3) || _0x3e3f71.includes(_0x19add3)) {
      return 70;
    }
    if (_0x1d251e.includes(_0x506ac6) || _0x506ac6.includes(_0x1d251e)) {
      return 65;
    }
    const _0x1a6e39 = !!_0x23a7d0.el?.querySelector?.("img, [class*=\"avatar\"], [class*=\"Avatar\"]");
    if (_0x1a6e39) {
      return 10;
    } else {
      return 0;
    }
  }
  function _0x237dcc(_0x1951cf, _0xba7e8f) {
    return _0x4c8da2(_0x1951cf, _0xba7e8f) >= 95;
  }
  function _0x46a0ba(_0x371982, _0x3568c2) {
    if (!_0x371982) {
      return 0;
    }
    const _0xa9cebc = _0x371982.closest?.("[contenteditable=\"true\"]") || _0x371982;
    const _0x280712 = String(_0x3568c2 || "").trim().replace(/^@+/, "");
    if (!_0x280712) {
      return 0;
    }
    const _0x5a3c29 = _0x1a2686(_0x280712);
    let _0xae178e = 0;
    const _0x2ddda7 = _0xa9cebc.querySelectorAll?.("[contenteditable=\"false\"]") || [];
    for (const _0xb1dab2 of _0x2ddda7) {
      const _0x471ad2 = String(_0xb1dab2.textContent || "").trim().replace(/^@+/, "");
      if (!_0x471ad2) {
        continue;
      }
      const _0x3aebbb = _0x1a2686(_0x471ad2);
      if (_0x3aebbb === _0x5a3c29 || _0x3aebbb.includes(_0x5a3c29) || _0x5a3c29.includes(_0x3aebbb)) {
        _0xae178e += 1;
      }
    }
    const _0x318182 = _0xa9cebc.querySelectorAll?.("a[href*=\"/user/\"], [data-e2e=\"comment-at-user\"], [data-user-id], [data-sec-uid]") || [];
    for (const _0x50cdc0 of _0x318182) {
      const _0x45b3d3 = String(_0x50cdc0.textContent || "").trim().replace(/^@+/, "");
      if (!_0x45b3d3) {
        continue;
      }
      const _0x2b41ee = _0x1a2686(_0x45b3d3);
      if (_0x2b41ee === _0x5a3c29 || _0x2b41ee.includes(_0x5a3c29) || _0x5a3c29.includes(_0x2b41ee)) {
        _0xae178e += 1;
      }
    }
    return _0xae178e;
  }
  function _0xf2d4be(_0x16cec5) {
    if (!_0x16cec5) {
      return [];
    }
    const _0x5c46af = new Set();
    const _0x2bf620 = [];
    const _0x3aae4d = (_0x20cd12, _0x5c71b3) => {
      if (!_0x20cd12 || _0x5c46af.has(_0x20cd12) || !_0x593d97(_0x20cd12)) {
        return;
      }
      const _0xf0e5a4 = _0x20cd12.getBoundingClientRect();
      const _0x354bfd = (_0x20cd12.innerText || _0x20cd12.textContent || "").replace(/\s+/g, " ").trim();
      const _0x105d27 = _0x5627d7(_0x20cd12);
      _0x1d0184("[DEBUG-ROW] ID=" + (_0x20cd12.id || _0x20cd12.className) + " text=\"" + _0x354bfd + "\" firstLine=\"" + _0x105d27 + "\" rect=" + Math.round(_0xf0e5a4.left) + "," + Math.round(_0xf0e5a4.top) + " " + Math.round(_0xf0e5a4.width) + "x" + Math.round(_0xf0e5a4.height));
      if (_0xf0e5a4.width < 48 || _0xf0e5a4.height < 24 || _0xf0e5a4.height > 160) {
        return;
      }
      if (!_0x105d27 || _0x105d27.length > 60) {
        return;
      }
      if (/^(精选|推荐|搜索|关注|朋友|我的|直播|放映厅|短剧)$/.test(_0x105d27)) {
        return;
      }
      if (_0x20cd12.closest?.("[data-e2e=\"douyin-navigation\"]")) {
        return;
      }
      _0x5c46af.add(_0x20cd12);
      _0x2bf620.push({
        el: _0x20cd12,
        text: _0x105d27,
        rect: _0xf0e5a4,
        fullText: _0x354bfd.slice(0, 80),
        source: _0x5c71b3
      });
    };
    Array.from(_0x16cec5.children).forEach(_0x6642e7 => _0x3aae4d(_0x6642e7, "inner-child"));
    if (!_0x2bf620.length) {
      const _0x4c2859 = ["[class*=\"at-item\"]", "[class*=\"AtItem\"]", "[class*=\"atUser\"]", "[class*=\"AtUser\"]", "[class*=\"user-item\"]", "[class*=\"UserItem\"]", "li", "[role=\"option\"]"];
      for (const _0x59210c of _0x4c2859) {
        _0x16cec5.querySelectorAll(_0x59210c).forEach(_0x241aa7 => {
          const _0x325af2 = _0x241aa7.closest("[class*=\"at-item\"], [class*=\"AtItem\"], li, [role=\"option\"]") || _0x241aa7;
          _0x3aae4d(_0x325af2, _0x59210c);
        });
      }
    }
    _0x2bf620.sort((_0x4a1e24, _0x465ab2) => _0x4a1e24.rect.top - _0x465ab2.rect.top || _0x4a1e24.rect.left - _0x465ab2.rect.left);
    const _0x5f129e = [];
    const _0x23d45c = new Set();
    for (const _0x3b4ac7 of _0x2bf620) {
      const _0x19467e = _0x3b4ac7.text.toLowerCase() + "@" + Math.round(_0x3b4ac7.rect.top);
      if (_0x23d45c.has(_0x19467e)) {
        continue;
      }
      _0x23d45c.add(_0x19467e);
      _0x5f129e.push(_0x3b4ac7);
    }
    return _0x5f129e;
  }
  function _0x4de80a(_0x5c673d) {
    if (!_0x5c673d) {
      return null;
    }
    if (String(_0x5c673d.className || "").includes("atBox-inner")) {
      return _0x5c673d;
    }
    return _0x5c673d.querySelector("[class*=\"atBox-inner\"]");
  }
  function _0x3b47c2(_0x5d2223, _0xd52962) {
    const _0x4a195b = _0x4de80a(_0x5d2223);
    if (!_0x4a195b) {
      return null;
    }
    const _0x202100 = Array.from(_0x4a195b.children).filter(_0x593d97).map(_0x4cdb2c => {
      const _0x3e89f1 = _0x4cdb2c.getBoundingClientRect();
      const _0x4917b4 = _0x5627d7(_0x4cdb2c);
      const _0x20d49a = (_0x4cdb2c.innerText || _0x4cdb2c.textContent || "").replace(/\s+/g, " ").trim();
      return {
        el: _0x4cdb2c,
        text: _0x4917b4,
        fullText: _0x20d49a,
        rect: _0x3e89f1
      };
    }).filter(_0x10cd9 => _0x1c961c(_0x10cd9) && _0x10cd9.rect.width > 0 && _0x10cd9.rect.height > 0);
    if (!_0x202100.length) {
      return null;
    }
    const _0x23cb2d = String(_0xd52962 || "").trim();
    if (_0x23cb2d) {
      const _0x549ac8 = [..._0x202100].map(_0x5135c7 => ({
        ..._0x5135c7,
        score: _0x4c8da2(_0x5135c7, _0xd52962)
      })).filter(_0xad29a0 => _0x237dcc(_0xad29a0, _0xd52962)).sort((_0x1f01d0, _0x5b006a) => _0x5b006a.score - _0x1f01d0.score || _0x1f01d0.rect.top - _0x5b006a.rect.top);
      if (_0x549ac8.length) {
        _0x1d0184("fallback 精确匹配「" + _0xd52962 + "」→ \"" + _0x5cd915(_0x549ac8[0].text, 24) + "\"");
        return _0x549ac8[0];
      }
    }
    _0x1d0184("未匹配到精确候选「" + (_0x23cb2d || _0xd52962) + "」，拒绝兜底点击候选第一项", true);
    return null;
  }
  function _0x1e295c(_0xa01cb0) {
    if (!_0xa01cb0 || !_0x593d97(_0xa01cb0)) {
      return false;
    }
    const _0x5916fc = _0xa01cb0.getBoundingClientRect();
    return _0x5916fc.width > 40 && _0x5916fc.height > 40;
  }
  function _0x5c158f(_0x4ce33c) {
    if (!_0x4ce33c) {
      return "panel=null";
    }
    const _0x19b361 = _0x4ce33c.getBoundingClientRect();
    const _0x23100e = _0x4de80a(_0x4ce33c);
    const _0x2aecff = _0x23100e ? _0x23100e.children.length : 0;
    return _0x24f2de(_0x4ce33c) + " visible=" + _0x1e295c(_0x4ce33c) + " innerChildren=" + _0x2aecff;
  }
  function _0x4b8c91(_0x2d23f6, _0x438fc3) {
    const _0x161dce = _0x4de80a(_0x438fc3);
    if (!_0x161dce || !_0x2d23f6) {
      return null;
    }
    let _0x136a87 = _0x2d23f6;
    while (_0x136a87 && _0x136a87 !== _0x161dce) {
      if (_0x136a87.parentElement === _0x161dce) {
        return _0x136a87;
      }
      _0x136a87 = _0x136a87.parentElement;
    }
    return null;
  }
  function _0x564f93(_0x348121, _0x5727f3) {
    return _0x4b8c91(_0x348121, _0x5727f3) || (() => {
      if (!_0x348121) {
        return null;
      }
      const _0x241625 = _0x4de80a(_0x5727f3);
      let _0x81841f = _0x348121;
      let _0x318a8 = _0x348121;
      for (let _0x15ef8c = 0; _0x15ef8c < 8 && _0x318a8; _0x15ef8c++) {
        if (_0x5727f3 && !_0x5727f3.contains(_0x318a8) && _0x318a8 !== _0x5727f3) {
          break;
        }
        const _0x28f4ba = _0x318a8.getBoundingClientRect();
        if (_0x28f4ba.width <= 0 || _0x28f4ba.height <= 0) {
          _0x318a8 = _0x318a8.parentElement;
          continue;
        }
        const _0x28699f = !!_0x318a8.querySelector("img, [class*=\"avatar\"], [class*=\"Avatar\"]");
        const _0x27848d = _0x28f4ba.width >= 72 && _0x28f4ba.height >= 28 && _0x28f4ba.height <= 120;
        if (_0x27848d) {
          _0x81841f = _0x318a8;
          if (_0x28699f) {
            return _0x318a8;
          }
        }
        if (_0x241625 && _0x318a8.parentElement === _0x241625) {
          _0x81841f = _0x318a8;
        }
        _0x318a8 = _0x318a8.parentElement;
      }
      return _0x81841f;
    })();
  }
  async function _0x322685(_0x48098a, _0x1616ff, _0x3d702f, _0x22e52b = "") {
    const _0x38726f = Math.round(_0x48098a);
    const _0x58e738 = Math.round(_0x1616ff);
    const _0x366fd5 = document.elementFromPoint(_0x38726f, _0x58e738);
    _0x1d0184("原生点击 " + (_0x22e52b || "atBox") + " @(" + _0x38726f + "," + _0x58e738 + ") elementFromPoint=" + _0x34aefa(_0x366fd5), true);
    try {
      const _0x1572d5 = await _0x4d6e89(_0x366fd5, {
        x: _0x38726f,
        y: _0x58e738,
        label: _0x22e52b || "atBox"
      });
      await _0x27280b(120, 220, _0x3d702f);
      return !!_0x1572d5 && _0x1572d5.success !== false;
    } catch (_0x2ecb65) {
      _0x1d0184("原生点击 IPC 失败: " + (_0x2ecb65.message || _0x2ecb65), true);
      if (_0x366fd5?.click) {
        try {
          _0x366fd5.click();
        } catch (_0x59b11f) {}
      }
      return false;
    }
  }
  function _0xefadbd(_0x417acc) {
    return Array.from(String(_0x417acc || "")).map(_0xcc80fa => "" + _0xcc80fa + _0xcc80fa).join("");
  }
  function _0x287ddd(_0x19f7bb, _0x5e7875) {
    const _0x4e8055 = String(_0x19f7bb || "");
    const _0x1d2712 = String(_0x5e7875 || "").trim();
    if (!_0x1d2712) {
      return false;
    }
    if (_0x4e8055.includes(_0x1d2712)) {
      return true;
    }
    const _0x43579d = _0xefadbd(_0x1d2712);
    return !!_0x43579d && !!_0x4e8055.includes(_0x43579d);
  }
  async function _0x2cabac(_0x41129f, _0x1b6ca4) {
    if (!_0x41129f) {
      return false;
    }
    try {
      const _0x413793 = await _0x1c346a.invoke("simulate-text", {
        text: _0x41129f
      });
      await _0x27280b(120, 220, _0x1b6ca4);
      return !!_0x413793 && _0x413793.success !== false;
    } catch (_0x258cc6) {
      _0x1d0184("原生键盘输入 IPC 失败: " + (_0x258cc6.message || _0x258cc6), true);
      return false;
    }
  }
  async function _0x48f64(_0x3614c4, _0x3a3247, _0x30dc08, _0x2417e3, _0x1ca305) {
    if (!_0x3614c4?.el) {
      return false;
    }
    const _0x597156 = [];
    const _0x1acb5c = (_0x3785a5, _0x2aae70) => {
      if (!_0x3785a5 || _0x597156.some(_0x327415 => _0x327415.el === _0x3785a5)) {
        return;
      }
      _0x597156.push({
        el: _0x3785a5,
        label: _0x2aae70
      });
    };
    if (_0x3614c4.el) {
      const _0x557c6d = Array.from(_0x3614c4.el.querySelectorAll("span, p, div, [class*=\"name\"], [class*=\"nick\"]")).filter(_0xa8bba5 => {
        const _0x1be84a = (_0xa8bba5.textContent || "").trim();
        return _0x1be84a === _0x3614c4.text || _0x1be84a.includes(_0x3614c4.text);
      });
      if (_0x557c6d.length > 0) {
        _0x1acb5c(_0x557c6d[0], "item-text");
      } else {
        const _0x3899fa = _0x3614c4.el.querySelector("span");
        if (_0x3899fa) {
          _0x1acb5c(_0x3899fa, "item-span");
        }
      }
      const _0x60856 = _0x3614c4.el.querySelector("img");
      if (_0x60856) {
        _0x1acb5c(_0x60856, "item-img");
      }
    }
    _0x1acb5c(_0x3614c4.el, "item-el");
    _0x1acb5c(_0x4b8c91(_0x3614c4.el, _0x3a3247), "inner-child");
    const _0x596b96 = _0x564f93(_0x3614c4.el, _0x3a3247);
    if (_0x596b96 && _0x596b96 !== _0x3614c4.el) {
      _0x1acb5c(_0x596b96, "row-el");
    }
    if (!_0x597156.length) {
      _0x1d0184("atBox 无可用点击目标", true);
      return false;
    }
    _0x1d0184("atBox 准备点击 @" + _0x30dc08 + " → \"" + _0x5cd915(_0x3614c4.text, 20) + "\" 候选=" + _0x597156.length + " panel=" + _0x5c158f(_0x3a3247) + " composer=" + _0x137413(_0x1ca305), true);
    for (const {
      el: _0xfcd10b,
      label: _0xae2e3b
    } of _0x597156) {
      if (_0x4dcc81(_0x2417e3)) {
        return false;
      }
      if (!_0x593d97(_0xfcd10b)) {
        _0x1d0184("  跳过(" + _0xae2e3b + ") 不可见 " + _0x34aefa(_0xfcd10b));
        continue;
      }
      const _0x19f4fd = _0xfcd10b.getBoundingClientRect();
      _0x1d0184("  可信点击(" + _0xae2e3b + ") " + _0x34aefa(_0xfcd10b) + " " + Math.round(_0x19f4fd.width) + "x" + Math.round(_0x19f4fd.height) + " @(" + Math.round(_0x19f4fd.left) + "," + Math.round(_0x19f4fd.top) + ")");
      const _0x430827 = await _0x296bfe(_0xfcd10b, _0x2417e3, "atBox-" + _0xae2e3b, {
        allowScrollIntoView: false
      });
      await _0x27280b(450, 800, _0x2417e3);
      _0x1d0184("  点击后 trusted=" + !!_0x430827 + " panel=" + _0x5c158f(_0x3a3247) + " composer=" + _0x137413(_0x1ca305));
      if (_0x1ca305 && _0x5e6d5a(_0x1ca305)) {
        _0x1d0184("可信点击(" + _0xae2e3b + ") 已形成蓝色 @", true);
        return true;
      }
      if (_0x1ca305 && !_0x5e6d5a(_0x1ca305)) {
        const _0x512f75 = _0xfcd10b.getBoundingClientRect();
        const _0x4f3ecf = _0x512f75.left + _0x512f75.width / 2;
        const _0x1c7746 = _0x512f75.top + _0x512f75.height / 2;
        _0x1d0184("  可信点击未形成 @，坐标原生点击重试(" + _0xae2e3b + ") @(" + Math.round(_0x4f3ecf) + "," + Math.round(_0x1c7746) + ")", true);
        await _0x322685(_0x4f3ecf, _0x1c7746, _0x2417e3, "atBox-item-" + _0xae2e3b);
        await _0x27280b(450, 800, _0x2417e3);
        _0x1d0184("  原生点击后 panel=" + _0x5c158f(_0x3a3247) + " composer=" + _0x137413(_0x1ca305));
        if (_0x5e6d5a(_0x1ca305)) {
          _0x1d0184("原生点击(" + _0xae2e3b + ") 已形成蓝色 @", true);
          return true;
        }
      }
    }
    _0x1d0184("可信点击各候选均未形成蓝色 @", true);
    return false;
  }
  async function _0x1e9abe(_0x5ccad2, _0x5db001, _0x4a2bec, _0x4aeaa1, _0x2d56cb, _0x164c2f) {
    if (!_0x5ccad2 || !_0x2d56cb || !_0x4aeaa1) {
      return false;
    }
    _0x1d0184("@" + _0x5db001 + "：方向键高亮 + 穿透点击（禁止回车）", true);
    _0x5ccad2.focus();
    await _0x27280b(200, 380, _0x4a2bec);
    const _0x3801b0 = {
      bubbles: true,
      cancelable: true,
      key: "ArrowDown",
      code: "ArrowDown",
      keyCode: 40
    };
    _0x5ccad2.dispatchEvent(new KeyboardEvent("keydown", _0x3801b0));
    _0x5ccad2.dispatchEvent(new KeyboardEvent("keyup", _0x3801b0));
    await _0x27280b(320, 520, _0x4a2bec);
    if (!_0x1e295c(_0x4aeaa1)) {
      _0x1d0184("@" + _0x5db001 + "：方向键后面板已关闭 panel=" + _0x5c158f(_0x4aeaa1), true);
      return false;
    }
    return _0x48f64(_0x2d56cb, _0x4aeaa1, _0x5db001, _0x4a2bec, _0x164c2f || _0x5ccad2);
  }
  function _0x292046(_0x389c8c) {
    const _0x58e886 = Array.from(document.querySelectorAll("[class*=\"atBox-outside\"], [class*=\"atBox-inner\"]")).filter(_0x8a8da3 => _0x593d97(_0x8a8da3) && !_0x2e92d2(_0x8a8da3));
    if (!_0x58e886.length) {
      return null;
    }
    const _0x48b0fa = _0x389c8c?.getBoundingClientRect?.();
    let _0x5d53ba = _0x58e886[0];
    let _0x24f8e2 = -1;
    for (const _0x39e1f8 of _0x58e886) {
      const _0x2ed51f = _0x39e1f8.closest("[class*=\"atBox-outside\"]") || _0x39e1f8;
      if (_0x2e92d2(_0x2ed51f)) {
        continue;
      }
      let _0x21ef6d = _0x5dfb03(_0x2ed51f) ? 200 : 0;
      const _0x129f58 = _0x2ed51f.getBoundingClientRect();
      if (_0x48b0fa) {
        const _0x5d9342 = Math.abs((_0x129f58.left + _0x129f58.right) / 2 - (_0x48b0fa.left + _0x48b0fa.right) / 2);
        if (_0x5d9342 < 180) {
          _0x21ef6d += 30;
        }
        if (_0x129f58.top < _0x48b0fa.top && _0x129f58.bottom > _0x48b0fa.top - 20) {
          _0x21ef6d += 20;
        }
      }
      if (_0x21ef6d > _0x24f8e2) {
        _0x24f8e2 = _0x21ef6d;
        _0x5d53ba = _0x2ed51f;
      }
    }
    return _0x5d53ba;
  }
  function _0x221919(_0x142f4f, _0x1873bd) {
    if (!_0x142f4f || !_0x593d97(_0x142f4f) || _0x2e92d2(_0x142f4f)) {
      return false;
    }
    if (_0x5dfb03(_0x142f4f)) {
      const _0x3436e6 = _0x142f4f.getBoundingClientRect();
      if (_0x3436e6.width < 72 || _0x3436e6.height < 32) {
        return false;
      }
      return true;
    }
    const _0x4aecfb = _0x142f4f.getBoundingClientRect();
    if (_0x4aecfb.width < 72 || _0x4aecfb.height < 32) {
      return false;
    }
    if (_0x4aecfb.width > window.innerWidth * 0.96 || _0x4aecfb.height > window.innerHeight * 0.85) {
      return false;
    }
    const _0x2d6ae3 = String(_0x142f4f.className || "").toLowerCase();
    const _0x2fbd33 = String(_0x142f4f.getAttribute("data-e2e") || "").toLowerCase();
    const _0x560ae2 = _0x2d6ae3 + " " + _0x2fbd33;
    if (/emoji|sticker|gif|face|表情/.test(_0x560ae2)) {
      return false;
    }
    const _0x38bcc1 = _0x5e6508(_0x142f4f);
    const _0x498061 = (_0x142f4f.innerText || _0x142f4f.textContent || "").replace(/\s+/g, " ").trim();
    const _0x12039a = /(?:^|[\s_-])(?:at|mention|suggest|search-user|user-list|nickname)/i.test(_0x560ae2);
    const _0x3ae272 = _0x38bcc1.length > 0;
    const _0x467009 = /抖音号|粉丝|关注/.test(_0x498061);
    if (!_0x3ae272 && !_0x12039a && !_0x467009) {
      return false;
    }
    const _0x1681a8 = _0x1873bd?.getBoundingClientRect?.();
    if (_0x1681a8) {
      const _0x34f8cf = _0x4aecfb.top > _0x1681a8.bottom + 420;
      const _0x33f15a = _0x4aecfb.bottom < _0x1681a8.top - 320;
      if (_0x34f8cf || _0x33f15a) {
        return false;
      }
    }
    return true;
  }
  function _0x5e6508(_0x2f38a4) {
    if (!_0x2f38a4) {
      return [];
    }
    const _0x45fe68 = _0x2f38a4.querySelector("[class*=\"atBox-inner\"]") || (String(_0x2f38a4.className || "").includes("atBox-inner") ? _0x2f38a4 : null);
    if (_0x45fe68) {
      const _0x4816b5 = _0xf2d4be(_0x45fe68);
      if (_0x4816b5.length) {
        return _0x4816b5;
      }
    }
    const _0x537dfc = "li, [role=\"option\"], [role=\"menuitem\"], [class*=\"at-item\"], [class*=\"AtItem\"], [class*=\"user-item\"], [class*=\"UserItem\"]";
    const _0x5e9617 = Array.from(_0x2f38a4.querySelectorAll(_0x537dfc)).filter(_0x593d97);
    const _0x17fa57 = new Set();
    const _0x3dbc47 = [];
    for (const _0x966df0 of _0x5e9617) {
      const _0x11e303 = _0x966df0.closest("li, [role=\"option\"], [role=\"menuitem\"]") || _0x966df0;
      if (_0x17fa57.has(_0x11e303) || _0x2e92d2(_0x11e303)) {
        continue;
      }
      const _0x56b72f = _0x11e303.getBoundingClientRect();
      if (_0x56b72f.width < 48 || _0x56b72f.height < 22 || _0x56b72f.height > 220) {
        continue;
      }
      const _0x217a79 = _0x5627d7(_0x11e303);
      if (!_0x217a79 || _0x217a79.length > 60) {
        continue;
      }
      _0x17fa57.add(_0x11e303);
      _0x3dbc47.push({
        el: _0x11e303,
        text: _0x217a79,
        rect: _0x56b72f
      });
    }
    _0x3dbc47.sort((_0x221055, _0x45c7ff) => _0x221055.rect.top - _0x45c7ff.rect.top || _0x221055.rect.left - _0x45c7ff.rect.left);
    return _0x3dbc47;
  }
  function _0x180766(_0x339df2, _0x1a08ea, _0xbff426) {
    let _0x15a1c3 = 0;
    const _0x43acd6 = _0x5e6508(_0x339df2);
    const _0x1e5b4d = String(_0x339df2.className || "").toLowerCase();
    const _0xefcbcf = String(_0x339df2.getAttribute("data-e2e") || "").toLowerCase();
    const _0x5b220d = _0x1e5b4d + " " + _0xefcbcf;
    const _0xeaa57 = String(_0xbff426 || "").trim().toLowerCase();
    const _0x5762c2 = (_0x339df2.innerText || "").replace(/\s+/g, " ").trim().toLowerCase();
    if (_0x5dfb03(_0x339df2)) {
      _0x15a1c3 += 200;
    }
    if (/atbox-outside/.test(_0x5b220d)) {
      _0x15a1c3 += 40;
    }
    if (/atbox-inner/.test(_0x5b220d)) {
      _0x15a1c3 += 20;
    }
    if (/at|mention|suggest|search-user|user-list|userlist|nickname/.test(_0x5b220d)) {
      _0x15a1c3 += 40;
    }
    if (_0x43acd6.length > 0) {
      _0x15a1c3 += 50;
    }
    if (_0xeaa57 && _0x5762c2.includes(_0xeaa57)) {
      _0x15a1c3 += 25;
    }
    if (_0x43acd6.some(_0x2a7ca0 => _0x2a7ca0.text.toLowerCase().includes(_0xeaa57) || _0x2a7ca0.text.toLowerCase() === _0xeaa57)) {
      _0x15a1c3 += 40;
    }
    const _0x52b9ef = _0x1a08ea?.getBoundingClientRect?.();
    const _0x5a4eac = _0x339df2.getBoundingClientRect();
    if (_0x52b9ef) {
      const _0x4649a6 = (_0x52b9ef.left + _0x52b9ef.right) / 2;
      const _0x34a17e = (_0x5a4eac.left + _0x5a4eac.right) / 2;
      const _0x49ac0d = Math.abs(_0x4649a6 - _0x34a17e);
      if (_0x49ac0d < 120) {
        _0x15a1c3 += 20;
      } else if (_0x49ac0d < 260) {
        _0x15a1c3 += 10;
      }
      if (_0x5a4eac.bottom <= _0x52b9ef.top + 40 && _0x5a4eac.bottom >= _0x52b9ef.top - 220) {
        _0x15a1c3 += 25;
      }
    }
    if (_0x2e92d2(_0x339df2)) {
      _0x15a1c3 -= 500;
    }
    return {
      score: _0x15a1c3,
      items: _0x43acd6,
      textPreview: _0x5762c2.slice(0, 100),
      isAtBox: _0x5dfb03(_0x339df2)
    };
  }
  function _0x32439d(_0x3bbaf9, _0x294f1f) {
    const _0x28ef52 = new Set();
    const _0x29ed11 = [];
    const _0x1a1fee = _0x1a4f80 => {
      if (!_0x1a4f80 || _0x28ef52.has(_0x1a4f80) || _0x2e92d2(_0x1a4f80)) {
        return;
      }
      if (!_0x221919(_0x1a4f80, _0x3bbaf9) && !_0x5dfb03(_0x1a4f80)) {
        return;
      }
      _0x28ef52.add(_0x1a4f80);
      const _0x1891ca = _0x180766(_0x1a4f80, _0x3bbaf9, _0x294f1f);
      _0x29ed11.push({
        panel: _0x1a4f80,
        ..._0x1891ca
      });
    };
    const _0x2dcc5c = _0x292046(_0x3bbaf9);
    if (_0x2dcc5c) {
      _0x1a1fee(_0x2dcc5c);
    }
    document.querySelectorAll("[class*=\"atBox-outside-container\"]").forEach(_0x23cbed => {
      _0x1a1fee(_0x23cbed.closest("[class*=\"atBox-outside\"]") || _0x23cbed);
    });
    const _0x51819f = [];
    const _0x1432ca = _0x1e21ff(_0x3bbaf9);
    if (_0x1432ca) {
      _0x51819f.push(_0x1432ca);
    }
    let _0x1a600b = _0x3bbaf9;
    for (let _0x465cfb = 0; _0x465cfb < 8 && _0x1a600b; _0x465cfb++) {
      if (!_0x51819f.includes(_0x1a600b)) {
        _0x51819f.push(_0x1a600b);
      }
      _0x1a600b = _0x1a600b.parentElement;
    }
    const _0x3d0ced = ["[class*=\"atBox\"]", "[class*=\"at-item\"]", "[class*=\"mention\"]", "[class*=\"suggest\"]", "[data-e2e*=\"at\"]"];
    for (const _0x247ead of _0x51819f) {
      if (!_0x247ead) {
        continue;
      }
      for (const _0x37bbe2 of _0x3d0ced) {
        let _0x3704c6 = [];
        try {
          _0x3704c6 = Array.from(_0x247ead.querySelectorAll(_0x37bbe2));
        } catch (_0x4f8d14) {
          continue;
        }
        for (const _0x37ee86 of _0x3704c6) {
          const _0x174bdf = _0x37ee86.closest("[class*=\"atBox-outside\"]") || _0x37ee86;
          _0x1a1fee(_0x174bdf);
        }
      }
    }
    return _0x29ed11.sort((_0x5a7a0e, _0x165bfa) => _0x165bfa.score - _0x5a7a0e.score);
  }
  function _0x29cd33(_0xbe643f, _0x325bff, _0x578afd) {
    _0x1d0184(_0x578afd + " @" + _0x325bff + "：发现 " + _0xbe643f.length + " 个候选面板");
    _0xbe643f.slice(0, 6).forEach((_0x123129, _0x5bfe00) => {
      _0x1d0184("  面板#" + (_0x5bfe00 + 1) + " score=" + _0x123129.score + " " + _0x24f2de(_0x123129.panel) + " 项=" + _0x123129.items.length + " 预览=\"" + _0x5cd915(_0x123129.textPreview, 36) + "\"");
      _0x123129.items.slice(0, 6).forEach((_0x4f11b5, _0x3f955f) => {
        _0x1d0184("    项#" + (_0x3f955f + 1) + " " + _0x34aefa(_0x4f11b5.el) + " \"" + _0x5cd915(_0x4f11b5.text, 28) + "\"");
      });
    });
  }
  function _0x547aca(_0x3bde6b, _0x3f103d) {
    if (!_0x3bde6b.length) {
      return null;
    }
    const _0x23556c = _0x26eaf2(_0x3bde6b);
    const _0xa23deb = String(_0x3f103d || "").trim();
    if (!_0xa23deb) {
      _0x1d0184("无目标昵称，拒绝兜底点击候选第一项", true);
      return null;
    }
    const _0x11ea19 = [..._0x23556c].map(_0x419448 => ({
      ..._0x419448,
      score: _0x4c8da2(_0x419448, _0xa23deb)
    })).filter(_0x40cbb8 => _0x237dcc(_0x40cbb8, _0xa23deb)).sort((_0x21db3d, _0x505977) => _0x505977.score - _0x21db3d.score || _0x21db3d.rect.top - _0x505977.rect.top || _0x21db3d.rect.left - _0x505977.rect.left);
    if (_0x11ea19.length) {
      const _0x4faf80 = _0x11ea19[0];
      _0x1d0184("精确匹配「" + _0xa23deb + "」→ \"" + _0x5cd915(_0x4faf80.text, 24) + "\" (score=" + _0x4faf80.score + ") rect=@(" + Math.round(_0x4faf80.rect.left) + "," + Math.round(_0x4faf80.rect.top) + ") " + Math.round(_0x4faf80.rect.width) + "x" + Math.round(_0x4faf80.rect.height));
      return _0x4faf80;
    }
    _0x1d0184("未匹配到精确候选「" + _0xa23deb + "」，拒绝兜底点击候选第一项", true);
    return null;
  }
  const _0x22533c = 52;
  const _0x111748 = 48;
  const _0x568ff1 = 24;
  async function _0xa6ae24(_0x32ec4f, _0x4c6448, _0x383c5a, _0x2e77f2 = _0x22533c) {
    let _0x30af82 = 0;
    for (let _0x5338c2 = 0; _0x5338c2 < _0x2e77f2; _0x5338c2++) {
      if (_0x4dcc81(_0x4c6448)) {
        return null;
      }
      await _0x27280b(280, 480, _0x4c6448);
      const _0x316082 = _0x32439d(_0x32ec4f, _0x383c5a);
      const _0x40da55 = _0x316082.filter(_0x4f28c9 => _0x4f28c9.isAtBox);
      const _0x42832b = _0x40da55.length ? _0x40da55 : _0x316082.slice(0, 3);
      _0x29cd33(_0x42832b, _0x383c5a, "轮询 " + (_0x5338c2 + 1) + "/" + _0x2e77f2);
      const _0x3fd8fb = _0x40da55.find(_0x4ab985 => _0x4ab985.items.length > 0);
      if (_0x3fd8fb) {
        const _0x59c26c = _0x3fd8fb.items.some(_0x13a6d6 => _0x237dcc(_0x13a6d6, _0x383c5a));
        const _0x3cb003 = _0x111748;
        if (_0x59c26c) {
          _0x1d0184("atBox 精确候选就绪 项=" + _0x3fd8fb.items.length + " " + _0x24f2de(_0x3fd8fb.panel), true);
          _0x1b0ad3(_0x3fd8fb.panel);
          return {
            panel: _0x3fd8fb.panel,
            items: _0x3fd8fb.items
          };
        }
        if (_0x5338c2 >= _0x3cb003) {
          _0x1d0184("atBox 搜索超时仍无精确候选「" + _0x383c5a + "」，拒绝兜底点击候选第一项", true);
          _0x1b0ad3(_0x3fd8fb.panel);
          return {
            panel: _0x3fd8fb.panel,
            items: _0x3fd8fb.items
          };
        }
        _0x1d0184("已发现 atBox，但尚未发现「" + _0x383c5a + "」的精确匹配，继续等待搜索结果渲染… (" + (_0x5338c2 + 1) + "/" + _0x3cb003 + ")");
      }
      if (_0x40da55.length) {
        _0x30af82 += 1;
        _0x1d0184("atBox 已出现，等待列表渲染… (" + (_0x5338c2 + 1) + "/" + _0x2e77f2 + "，连续 " + _0x30af82 + ")");
        if (_0x30af82 >= _0x568ff1) {
          _0x1d0184("atBox 已稳定出现但仍无精确候选，拒绝兜底点击候选第一项", true);
          _0x1b0ad3(_0x40da55[0].panel);
          return {
            panel: _0x40da55[0].panel,
            items: _0x40da55[0].items || []
          };
        }
        continue;
      }
      _0x30af82 = 0;
    }
    _0x1d0184("@" + _0x383c5a + "：" + _0x2e77f2 + " 轮后 atBox 列表仍未就绪", true);
    return null;
  }
  function _0x5e6d5a(_0x1f0525) {
    if (!_0x1f0525) {
      return false;
    }
    const _0x147842 = _0x1f0525.closest?.("[contenteditable=\"true\"]") || _0x1f0525;
    const _0x4d9929 = _0x147842.querySelectorAll?.("[contenteditable=\"false\"]") || [];
    for (const _0x43820e of _0x4d9929) {
      const _0x4fee19 = (_0x43820e.textContent || "").trim();
      if (_0x4fee19.startsWith("@") && _0x4fee19.length > 1) {
        return true;
      }
    }
    if (_0x147842.querySelector?.("a[href*=\"/user/\"], [data-e2e=\"comment-at-user\"], [data-user-id], [data-aweme-id], [data-sec-uid]")) {
      return true;
    }
    const _0xf4fd23 = _0x147842.innerHTML || "";
    if (/data-(?:user|aweme|uid|anchor|sec)/i.test(_0xf4fd23)) {
      return true;
    }
    if (/class="[^"]*(?:mention|at-user|atUser|AtUser|AT_USER)[^"]*"/i.test(_0xf4fd23)) {
      return true;
    }
    return false;
  }
  function _0x137413(_0x1a858c) {
    if (!_0x1a858c) {
      return "无输入框";
    }
    const _0x1e701a = _0x1a858c.closest?.("[contenteditable=\"true\"]") || _0x1a858c;
    const _0x75c5e5 = (_0x1e701a.innerText || _0x1e701a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80);
    const _0x58383e = Array.from(_0x1e701a.querySelectorAll?.("[contenteditable=\"false\"]") || []).map(_0x489594 => (_0x489594.textContent || "").trim()).filter(_0x3d5b95 => _0x3d5b95.startsWith("@"));
    return "text=\"" + _0x75c5e5 + "\" locked=@" + (_0x58383e.join(", @") || "无") + " realLink=" + _0x5e6d5a(_0x1a858c);
  }
  function _0x16bfb9(_0x182a07, _0x29c807 = {}) {
    if (!_0x182a07 || !_0x593d97(_0x182a07)) {
      return false;
    }
    if (_0x182a07.closest("[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], [class*=\"comment-item\"]")) {
      return false;
    }
    if (_0x2e92d2(_0x182a07)) {
      return false;
    }
    const {
      emojiBtn: _0x30693f,
      imageBtn: _0xf4535f
    } = _0x29c807;
    if (_0x1256dc(_0x182a07, _0x30693f)) {
      return false;
    }
    if (_0xf4535f && (_0x182a07 === _0xf4535f || _0xf4535f.contains(_0x182a07) || _0x182a07.contains(_0xf4535f) || _0x4a0ccf(_0x182a07, _0xf4535f))) {
      return false;
    }
    const _0x2880fb = _0x182a07.getBoundingClientRect();
    if (_0x2880fb.width < 8 || _0x2880fb.height < 8 || _0x2880fb.width > 96 || _0x2880fb.height > 96) {
      return false;
    }
    return true;
  }
  function _0x1d9fad(_0x39c75c) {
    if (!_0x39c75c) {
      return null;
    }
    return _0x39c75c.closest("button, div[role=\"button\"], span[role=\"button\"], label, span, div") || _0x39c75c;
  }
  function _0x474fd7(_0x279437, _0x33163e, _0x1e8bab) {
    if (!_0x279437 || !_0x593d97(_0x279437)) {
      return false;
    }
    if (_0x33163e && (_0x279437 === _0x33163e || _0x33163e.contains(_0x279437) || _0x279437.contains(_0x33163e))) {
      return false;
    }
    if (_0x1e8bab && _0x1e8bab.contains(_0x279437)) {
      return false;
    }
    if (_0x279437.closest("[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], [class*=\"comment-item\"]")) {
      return false;
    }
    const _0x250f66 = _0x279437.tagName === "SVG" || !!_0x279437.querySelector("svg");
    if (!_0x250f66) {
      return false;
    }
    const _0x5c7816 = _0x279437.getBoundingClientRect();
    if (_0x5c7816.width < 8 || _0x5c7816.height < 8 || _0x5c7816.width > 80 || _0x5c7816.height > 80) {
      return false;
    }
    return true;
  }
  function _0x2f3c52(_0x4bc645, _0x2eb723 = null) {
    const _0x4d077c = _0x2eb723?.emojiBtnCache || _0x1a4a5e(_0x4bc645, _0x2eb723);
    const _0xc4e1f0 = _0x2eb723?.imageBtnCache || _0xf62e6a(_0x4bc645, _0x2eb723)[0]?.el;
    const _0x391a55 = _0x4bc645?.getBoundingClientRect?.();
    const _0x4a217c = _0x4d077c?.getBoundingClientRect?.();
    const _0x2d3492 = _0x4a217c ? (_0x4a217c.top + _0x4a217c.bottom) / 2 : _0x391a55 ? (_0x391a55.top + _0x391a55.bottom) / 2 : null;
    const _0x116536 = [];
    const _0x270136 = _0x1e21ff(_0x4bc645);
    if (_0x270136) {
      _0x116536.push(_0x270136);
    }
    if (_0x2eb723?.roots?.length) {
      _0x2eb723.roots.forEach(_0x3c3c1b => {
        if (_0x3c3c1b && !_0x116536.includes(_0x3c3c1b)) {
          _0x116536.push(_0x3c3c1b);
        }
      });
    }
    let _0x36aed6 = _0x4bc645;
    for (let _0x1cba15 = 0; _0x1cba15 < 10 && _0x36aed6 && _0x36aed6 !== document.body; _0x1cba15++) {
      if (!_0x116536.includes(_0x36aed6)) {
        _0x116536.push(_0x36aed6);
      }
      _0x36aed6 = _0x36aed6.parentElement;
    }
    if (_0x4d077c) {
      let _0x409520 = _0x4d077c.parentElement;
      for (let _0x1e5484 = 0; _0x1e5484 < 6 && _0x409520; _0x1e5484++) {
        if (!_0x116536.includes(_0x409520)) {
          _0x116536.push(_0x409520);
        }
        _0x409520 = _0x409520.parentElement;
      }
    }
    const _0x3b43c5 = new Set();
    const _0x4b375b = [];
    const _0x5d7870 = (_0x3d8813, _0x4216c7) => {
      const _0x5ead60 = _0x1d9fad(_0x3d8813);
      if (!_0x5ead60 || _0x3b43c5.has(_0x5ead60) || !_0x474fd7(_0x5ead60, null, _0x4bc645)) {
        return;
      }
      const _0x2e17ee = _0x5ead60.getBoundingClientRect();
      if (_0x2d3492 != null && Math.abs((_0x2e17ee.top + _0x2e17ee.bottom) / 2 - _0x2d3492) > 34) {
        return;
      }
      if (_0x391a55 && _0x2e17ee.left < _0x391a55.left + 40) {
        return;
      }
      if (_0x4a217c && _0x2e17ee.left > _0x4a217c.right + 48) {
        return;
      }
      _0x3b43c5.add(_0x5ead60);
      _0x4b375b.push({
        el: _0x5ead60,
        source: _0x4216c7,
        cx: (_0x2e17ee.left + _0x2e17ee.right) / 2,
        cy: (_0x2e17ee.top + _0x2e17ee.bottom) / 2,
        rect: _0x2e17ee,
        isEmoji: !!_0x4d077c && (_0x5ead60 === _0x4d077c || !!_0x4d077c.contains(_0x5ead60) || !!_0x5ead60.contains(_0x4d077c)),
        isImage: !!_0xc4e1f0 && (_0x5ead60 === _0xc4e1f0 || !!_0xc4e1f0.contains(_0x5ead60) || !!_0x5ead60.contains(_0xc4e1f0) || !!_0x4a0ccf(_0x5ead60, _0xc4e1f0))
      });
    };
    for (const _0x4a1431 of _0x116536) {
      if (!_0x4a1431) {
        continue;
      }
      _0x4a1431.querySelectorAll("span, button, div[role=\"button\"], label, svg").forEach(_0x462bab => {
        const _0x2f2d51 = _0x462bab.tagName === "SVG" ? _0x462bab.closest("span, button, div, label") || _0x462bab : _0x462bab;
        _0x5d7870(_0x2f2d51, "root:" + _0x4a1431.tagName);
      });
    }
    _0x4b375b.sort((_0x37a1d0, _0x21a278) => _0x37a1d0.cx - _0x21a278.cx || _0x37a1d0.cy - _0x21a278.cy);
    return {
      icons: _0x4b375b,
      emojiBtn: _0x4d077c,
      imageBtn: _0xc4e1f0,
      rowCy: _0x2d3492,
      inputRect: _0x391a55,
      emojiRect: _0x4a217c
    };
  }
  function _0x1bc5b3(_0x16f11f, _0x3e1d33 = null) {
    const {
      icons: _0x38576a,
      emojiBtn: _0xa2ce18,
      imageBtn: _0x4e92c8,
      rowCy: _0x49669e,
      inputRect: _0x11cf89,
      emojiRect: _0x5612ad
    } = _0x2f3c52(_0x16f11f, _0x3e1d33);
    _0x1d0184("工具栏探测 input=" + (_0x11cf89 ? "@(" + Math.round(_0x11cf89.left) + "," + Math.round(_0x11cf89.top) + ") " + Math.round(_0x11cf89.width) + "x" + Math.round(_0x11cf89.height) : "无") + " emoji=" + (_0xa2ce18 ? _0x34aefa(_0xa2ce18) : "未找到") + " image=" + (_0x4e92c8 ? _0x34aefa(_0x4e92c8) : "未找到") + " rowCy=" + (_0x49669e != null ? Math.round(_0x49669e) : "n/a") + " 图标=" + _0x38576a.length, true);
    _0x38576a.forEach((_0x25cef3, _0x4be226) => {
      const _0x4d982c = String(_0x25cef3.el.className || "").split(/\s+/).filter(Boolean).slice(0, 2).join(".");
      const _0x18ddda = _0x25cef3.el.getAttribute("data-e2e") || "";
      const _0x170316 = [_0x25cef3.isImage ? "图" : "", _0x25cef3.isEmoji ? "表情" : ""].filter(Boolean).join(",") || "-";
      _0x1d0184("  工具栏#" + (_0x4be226 + 1) + " [" + _0x170316 + "] " + _0x25cef3.el.tagName + (_0x4d982c ? "." + _0x4d982c : "") + (_0x18ddda ? "[e2e=" + _0x18ddda + "]" : "") + " cx=" + Math.round(_0x25cef3.cx) + " cy=" + Math.round(_0x25cef3.cy) + " " + Math.round(_0x25cef3.rect.width) + "x" + Math.round(_0x25cef3.rect.height));
    });
    return _0x38576a;
  }
  function _0x1fedb1(_0x2d92c1, _0x58176c = null) {
    const {
      icons: _0x533b08,
      emojiBtn: _0x358dca,
      imageBtn: _0x5edaed
    } = _0x2f3c52(_0x2d92c1, _0x58176c);
    if (!_0x358dca || _0x533b08.length === 0) {
      return null;
    }
    const _0x67494d = _0x533b08.findIndex(_0x457a36 => _0x457a36.isEmoji);
    if (_0x67494d <= 0) {
      _0x1d0184("表情邻位：emojiIdx=" + _0x67494d + "，无法定位 @（图标数=" + _0x533b08.length + "）");
      return null;
    }
    const _0x4646f3 = _0x533b08.slice(0, _0x67494d);
    if (!_0x4646f3.length) {
      _0x1d0184("表情邻位：emojiIdx=" + _0x67494d + "，左侧无图标");
      return null;
    }
    const _0x3a46fa = _0x533b08[_0x67494d - 1];
    if (!_0x3a46fa?.el) {
      _0x1d0184("表情邻位：emojiIdx=" + _0x67494d + "，左侧无紧邻图标");
      return null;
    }
    _0x1d0184("表情邻位：选中紧邻表情左侧 #" + _0x67494d + " " + _0x34aefa(_0x3a46fa.el) + " cx=" + Math.round(_0x3a46fa.cx) + "（顺序：图→@→表情）", true);
    return _0x3a46fa.el;
  }
  function _0x15f1cc(_0x7d813) {
    if (!_0x7d813) {
      return false;
    }
    const _0x42309f = _0x7d813.tagName === "SVG" ? _0x7d813 : _0x7d813.querySelector?.("svg");
    if (!_0x42309f) {
      return false;
    }
    const _0x4184f4 = (_0x42309f.textContent || "").trim();
    if (_0x4184f4 === "@") {
      return true;
    }
    const _0x143850 = _0x42309f.innerHTML || "";
    if (/>@</.test(_0x143850)) {
      return true;
    }
    const _0x22f201 = (String(_0x7d813.className || "") + " " + (_0x7d813.getAttribute?.("data-e2e") || "") + " " + (_0x7d813.getAttribute?.("aria-label") || "")).toLowerCase();
    return /(?:^|[\s_-])(?:at|mention)(?:$|[\s_-])/.test(_0x22f201) && !/emoji|sticker|gif|face|表情|image|picture|upload|photo/.test(_0x22f201);
  }
  function _0x2a2982(_0x4560e4, _0x3ae224 = null) {
    const _0x1bf699 = _0x3ae224?.roots?.length ? [..._0x3ae224.roots] : [_0x1e21ff(_0x4560e4)].filter(Boolean);
    const _0x5ce3b0 = _0x3ae224?.emojiBtnCache || _0x1a4a5e(_0x4560e4, _0x3ae224);
    const _0x39a069 = _0x3ae224?.imageBtnCache || _0xf62e6a(_0x4560e4, _0x3ae224)[0]?.el;
    const _0x3eccb3 = {
      emojiBtn: _0x5ce3b0,
      imageBtn: _0x39a069
    };
    const _0x441442 = ["[data-e2e=\"comment-at-icon\"]", "[data-e2e=\"comment-at-btn\"]", "[data-e2e=\"comment-at-button\"]", "[data-e2e=\"comment-at\"]", "[data-e2e*=\"comment-at-icon\"]", "[data-e2e*=\"comment-at-btn\"]", "[data-e2e*=\"comment\"][data-e2e*=\"at-icon\"]", "[data-e2e*=\"comment\"][data-e2e*=\"mention\"]", "[class*=\"comment-at\"]", "[class*=\"CommentAt\"]", "[class*=\"at-icon\"]", "[class*=\"AtIcon\"]"];
    const _0x59ef6d = [];
    const _0x31c8d3 = new Set();
    const _0x5e1e8c = (_0x51b3c6, _0x1ad3d7, _0x2e49b4 = 0) => {
      const _0x53bf50 = _0x1d9fad(_0x51b3c6);
      if (!_0x53bf50 || _0x31c8d3.has(_0x53bf50) || !_0x16bfb9(_0x53bf50, _0x3eccb3)) {
        return;
      }
      _0x31c8d3.add(_0x53bf50);
      _0x59ef6d.push({
        el: _0x53bf50,
        reason: _0x1ad3d7,
        score: _0x2e49b4
      });
    };
    for (const _0x2de942 of _0x1bf699) {
      if (!_0x2de942) {
        continue;
      }
      for (const _0x1a49e7 of _0x441442) {
        try {
          _0x2de942.querySelectorAll(_0x1a49e7).forEach(_0x1972fe => {
            if (_0x1972fe.closest("[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], [class*=\"comment-item\"]")) {
              return;
            }
            _0x5e1e8c(_0x1972fe, _0x1a49e7, 80);
          });
        } catch (_0x9a91c0) {}
      }
      _0x2de942.querySelectorAll("button, div[role=\"button\"], span[role=\"button\"], label, span, svg").forEach(_0x51cab3 => {
        const _0x32e4cb = _0x1d9fad(_0x51cab3);
        const _0x3d2dfa = [_0x32e4cb.getAttribute?.("aria-label"), _0x32e4cb.getAttribute?.("title"), _0x32e4cb.textContent].filter(Boolean).join(" ");
        if (/^@$/.test((_0x32e4cb.textContent || "").trim())) {
          _0x5e1e8c(_0x32e4cb, "text-@", 70);
          return;
        }
        if (/@|提及|艾特|mention/i.test(_0x3d2dfa) && !/emoji|表情|gif|sticker|图片|相册|photo|image|upload/i.test(_0x3d2dfa)) {
          _0x5e1e8c(_0x32e4cb, "hint", 60);
        }
        if (_0x15f1cc(_0x32e4cb)) {
          _0x5e1e8c(_0x32e4cb, "svg-at", 65);
        }
      });
    }
    const _0xf9e833 = _0x1fedb1(_0x4560e4, _0x3ae224);
    if (_0xf9e833) {
      _0x5e1e8c(_0xf9e833, "emoji-neighbor", 95);
    }
    if (_0x5ce3b0 || _0x39a069) {
      const _0x404e59 = _0x1e21ff(_0x4560e4);
      const _0x4259a6 = _0x404e59 ? [_0x404e59] : [];
      if (_0x5ce3b0?.parentElement && !_0x4259a6.includes(_0x5ce3b0.parentElement)) {
        _0x4259a6.push(_0x5ce3b0.parentElement);
      }
      for (const _0x423905 of _0x4259a6) {
        if (!_0x423905) {
          continue;
        }
        const _0x5633ba = Array.from(_0x423905.querySelectorAll("button, div[role=\"button\"], span[role=\"button\"], label, span, svg")).map(_0xd4b981 => _0x1d9fad(_0xd4b981)).filter((_0x3d414a, _0x11d0ef, _0x17a08a) => _0x3d414a && _0x17a08a.indexOf(_0x3d414a) === _0x11d0ef && _0x16bfb9(_0x3d414a, _0x3eccb3));
        _0x5633ba.sort((_0x328f89, _0x1a0899) => {
          const _0x5d6c39 = _0x328f89.getBoundingClientRect();
          const _0x27b7e8 = _0x1a0899.getBoundingClientRect();
          return _0x5d6c39.left - _0x27b7e8.left || _0x5d6c39.top - _0x27b7e8.top;
        });
        if (_0x5ce3b0 && _0x39a069) {
          const _0x4b39cf = _0x5ce3b0.getBoundingClientRect();
          const _0x4d7913 = _0x39a069.getBoundingClientRect();
          const _0x251b33 = _0x5633ba.filter(_0x204cc => {
            const _0x403191 = _0x204cc.getBoundingClientRect();
            const _0x4fca08 = (_0x403191.left + _0x403191.right) / 2;
            return _0x4fca08 > _0x4d7913.left - 8 && _0x4fca08 < _0x4b39cf.right + 8;
          });
          if (_0x251b33.length === 1) {
            _0x5e1e8c(_0x251b33[0], "between-image-emoji", 90);
          } else if (_0x251b33.length > 1) {
            _0x5e1e8c(_0x251b33[0], "between-image-emoji", 85);
          }
        } else if (_0x5ce3b0) {
          const _0x54f7fa = _0x5ce3b0.getBoundingClientRect();
          const _0x4aae6d = _0x5633ba.filter(_0x303402 => {
            const _0x1e73a7 = _0x303402.getBoundingClientRect();
            return _0x1e73a7.right <= _0x54f7fa.left + 18 && Math.abs((_0x1e73a7.top + _0x1e73a7.bottom) / 2 - (_0x54f7fa.top + _0x54f7fa.bottom) / 2) < 36;
          }).sort((_0x3979b9, _0x40ced0) => _0x40ced0.getBoundingClientRect().right - _0x3979b9.getBoundingClientRect().right);
          const _0x3f95b6 = _0x4aae6d.find(_0x4aca19 => !_0x39a069 || _0x4aca19 !== _0x39a069 && !_0x4a0ccf(_0x4aca19, _0x39a069));
          if (_0x3f95b6) {
            _0x5e1e8c(_0x3f95b6, "left-of-emoji", 75);
          }
        }
      }
    }
    return _0x59ef6d.sort((_0x14662e, _0x160d45) => _0x160d45.score - _0x14662e.score);
  }
  function _0x5d50f6(_0x84adc9, _0x5dc127 = null) {
    _0x1bc5b3(_0x84adc9, _0x5dc127);
    const _0x5651ab = _0x1fedb1(_0x84adc9, _0x5dc127);
    if (_0x5651ab) {
      _0x1d0184("@ 按钮(表情邻位) " + _0x34aefa(_0x5651ab), true);
      return _0x5651ab;
    }
    const _0x1fe54b = _0x2a2982(_0x84adc9, _0x5dc127);
    if (_0x1fe54b.length) {
      _0x1d0184("@ 按钮候选 " + _0x1fe54b.length + " 个，选用 " + _0x1fe54b[0].reason + " " + _0x34aefa(_0x1fe54b[0].el));
      return _0x1fe54b[0].el;
    }
    return null;
  }
  function _0x79be9(_0x43070d, _0x36d8d3) {
    const _0x4eacde = [_0x36d8d3, _0x4de80a(_0x36d8d3), _0x1e21ff(_0x43070d)].filter(Boolean);
    for (const _0x4ca6f9 of _0x4eacde) {
      const _0x272444 = Array.from(_0x4ca6f9.querySelectorAll("input:not([type=\"file\"]), textarea, [contenteditable=\"true\"], [role=\"textbox\"]")).filter(_0x1f136e => _0x593d97(_0x1f136e) && _0x1f136e !== _0x43070d && !_0x43070d?.contains?.(_0x1f136e));
      if (_0x272444.length) {
        return _0x272444[0];
      }
    }
    const _0x215b89 = document.activeElement;
    if (_0x215b89 && _0x215b89 !== _0x43070d && _0x215b89 !== document.body) {
      if (_0x215b89.matches?.("input:not([type=\"file\"]), textarea, [contenteditable=\"true\"], [role=\"textbox\"]")) {
        return _0x215b89;
      }
    }
    return _0x43070d;
  }
  async function _0x57de23(_0x7452d5, _0x17c2d5, _0x4fcaeb = 8) {
    for (let _0xd0a5bc = 0; _0xd0a5bc < _0x4fcaeb; _0xd0a5bc++) {
      const _0x331e7a = _0x292046(_0x7452d5);
      if (_0x331e7a && _0x593d97(_0x331e7a)) {
        _0x1d0184("@ 面板已打开 " + _0x24f2de(_0x331e7a), true);
        return true;
      }
      await _0x27280b(280, 480, _0x17c2d5);
    }
    return false;
  }
  async function _0x376880(_0xbdb5e3, _0x2c2894, _0xf114a7 = null) {
    if (!_0xbdb5e3) {
      return false;
    }
    _0xbdb5e3.focus();
    await _0x27280b(200, 400, _0x2c2894);
    const _0x18274f = _0x5d50f6(_0xbdb5e3, _0xf114a7);
    if (!_0x18274f) {
      _0x1d0184("未找到评论框右侧 @ 工具栏按钮", true);
      return false;
    }
    const _0x69c20d = _0x18274f.getBoundingClientRect();
    const _0x3dcd78 = Math.round(_0x69c20d.left + _0x69c20d.width / 2);
    const _0x45db52 = Math.round(_0x69c20d.top + _0x69c20d.height / 2);
    _0x1d0184("点击 @ 工具栏 " + _0x34aefa(_0x18274f) + " 中心(" + _0x3dcd78 + "," + _0x45db52 + ") " + Math.round(_0x69c20d.width) + "x" + Math.round(_0x69c20d.height), true);
    await _0x296bfe(_0x18274f, _0x2c2894, "@工具栏", {
      allowScrollIntoView: false
    });
    if (await _0x57de23(_0xbdb5e3, _0x2c2894, 8)) {
      return true;
    }
    _0x1d0184("@ 可信点击未打开面板，尝试坐标原生点击兜底", true);
    await _0x322685(_0x3dcd78, _0x45db52, _0x2c2894, "@toolbar-fallback");
    if (await _0x57de23(_0xbdb5e3, _0x2c2894, 6)) {
      return true;
    }
    _0x1d0184("@ 按钮已点击，但未检测到 atBox 面板", true);
    return false;
  }
  async function _0xf7169b(_0x399ead, _0xa23eb4, _0xe0cc6b, _0x36d7db = {}) {
    const _0x358c92 = String(_0xa23eb4 || "").trim().replace(/^@+/, "");
    if (!_0x358c92 || !_0x399ead) {
      return false;
    }
    const _0x2c19e4 = _0x36d7db.scopeInfo || _0xf1aba4(_0x399ead, {
      replyMode: !!_0x36d7db.replyMode
    });
    const _0x578a41 = {
      ..._0x2c19e4,
      emojiBtnCache: _0x36d7db.scopeInfo?.emojiBtnCache || _0x2c19e4.emojiBtnCache || _0x1a4a5e(_0x399ead, _0x2c19e4),
      imageBtnCache: _0x36d7db.scopeInfo?.imageBtnCache || _0x2c19e4.imageBtnCache || _0xf62e6a(_0x399ead, _0x2c19e4)[0]?.el
    };
    _0x1d0184("开始 @" + _0x358c92, true);
    _0x399ead.focus();
    await _0x27280b(200, 400, _0xe0cc6b);
    const _0x33bce4 = await _0x376880(_0x399ead, _0xe0cc6b, _0x578a41);
    if (!_0x33bce4) {
      _0x1d0184("@" + _0x358c92 + "：未能通过 @ 按钮打开提及面板，跳过", true);
      return false;
    }
    const _0x2baac9 = _0x292046(_0x399ead);
    const _0x57a4a9 = _0x79be9(_0x399ead, _0x2baac9);
    _0x57a4a9.focus();
    try {
      const _0x2319a3 = _0x57a4a9.ownerDocument.defaultView || window;
      const _0x4ae305 = _0x2319a3.getSelection();
      if (_0x4ae305) {
        const _0x249874 = document.createRange();
        _0x249874.selectNodeContents(_0x57a4a9);
        _0x249874.collapse(false);
        _0x4ae305.removeAllRanges();
        _0x4ae305.addRange(_0x249874);
      }
    } catch (_0x6b60eb) {}
    await _0x27280b(200, 380, _0xe0cc6b);
    _0x1d0184("在 " + (_0x57a4a9 === _0x399ead ? "评论框" : "搜索框") + " 输入昵称 " + _0x358c92 + " (原生输入模式)");
    let _0x57a376 = await _0x2cabac(_0x358c92, _0xe0cc6b);
    let _0x315ed7 = _0x57a4a9.innerText || _0x57a4a9.textContent || "";
    const _0x477835 = _0xefadbd(_0x358c92);
    if (_0x477835 && _0x315ed7.includes(_0x477835)) {
      _0x1d0184("检测到昵称逐字双插（框内: \"" + _0x5cd915(_0x315ed7, 40) + "\"），清空后重输一次", true);
      try {
        _0x5db5c5(_0x57a4a9);
        document.execCommand("selectAll");
        document.execCommand("delete");
      } catch (_0x18de99) {}
      await _0x27280b(180, 320, _0xe0cc6b);
      _0x57a376 = await _0x2cabac(_0x358c92, _0xe0cc6b);
      _0x315ed7 = _0x57a4a9.innerText || _0x57a4a9.textContent || "";
    }
    const _0x3feac4 = _0x287ddd(_0x315ed7, _0x358c92);
    if (!_0x57a376 || !_0x3feac4) {
      if (_0x477835 && _0x315ed7.includes(_0x477835)) {
        _0x1d0184("重输后仍见双插，跳过 DOM 叠打，继续点选候选", true);
      } else {
        _0x1d0184("原生键盘输入未完全成功（当前框内: \"" + _0x5cd915(_0x315ed7, 30) + "\"），执行 DOM execCommand 录入兜底", true);
        await _0x38c727(_0x57a4a9, _0x358c92, _0xe0cc6b);
      }
    }
    _0x1d0184("已输入昵称 " + _0x358c92 + "，等待 atBox 精确候选…");
    _0x1d0184("当前框内=\"" + _0x5cd915(_0x399ead.innerText || _0x399ead.textContent || "", 60) + "\"");
    const _0xb1a8b3 = _0x46a0ba(_0x399ead, _0x358c92);
    const _0x14ee78 = await _0xa6ae24(_0x399ead, _0xe0cc6b, _0x358c92);
    let _0x58a509 = false;
    let _0x5ba1e8 = null;
    _0x1d0184("候选就绪 panel=" + _0x5c158f(_0x14ee78?.panel || _0x2baac9) + " composer=" + _0x137413(_0x399ead));
    if (_0x14ee78?.panel && _0x1e295c(_0x14ee78.panel)) {
      _0x5ba1e8 = _0x14ee78.items?.length ? _0x547aca(_0x14ee78.items, _0x358c92) : null;
      if (!_0x5ba1e8) {
        _0x5ba1e8 = _0x3b47c2(_0x14ee78.panel, _0x358c92);
        if (_0x5ba1e8) {
          _0x1d0184("fallback 精确项 \"" + _0x5cd915(_0x5ba1e8.text, 24) + "\"", true);
        }
      }
      if (_0x5ba1e8) {
        _0x1d0184("开始可信点击 atBox 精确候选（禁止回车、禁止点第一项）", true);
        _0x58a509 = await _0x48f64(_0x5ba1e8, _0x14ee78.panel, _0x358c92, _0xe0cc6b, _0x399ead);
        _0x1d0184("点击后 panel=" + _0x5c158f(_0x14ee78.panel) + " composer=" + _0x137413(_0x399ead));
      } else {
        _0x1d0184("未解析到精确可点击 atBox 项，拒绝兜底点击候选第一项", true);
      }
    } else {
      _0x1d0184("atBox 不可见，跳过点击 panel=" + _0x5c158f(_0x14ee78?.panel), true);
    }
    if (!_0x5e6d5a(_0x399ead) && _0x5ba1e8 && _0x14ee78?.panel && _0x1e295c(_0x14ee78.panel)) {
      _0x1d0184("精确候选未形成蓝色 @，对同一项可信重试 \"" + _0x5cd915(_0x5ba1e8.text, 24) + "\"", true);
      _0x58a509 = await _0x48f64(_0x5ba1e8, _0x14ee78.panel, _0x358c92, _0xe0cc6b, _0x399ead);
      _0x1d0184("重试后 composer=" + _0x137413(_0x399ead));
    }
    await _0x27280b(280, 520, _0xe0cc6b);
    const _0x30c14a = _0x46a0ba(_0x399ead, _0x358c92);
    const _0x57e192 = _0x5e6d5a(_0x399ead) && _0x30c14a > _0xb1a8b3;
    if (_0x57e192) {
      _0x1d0184("@" + _0x358c92 + " 蓝色 @ 链接已确认 (count " + _0xb1a8b3 + "→" + _0x30c14a + ")", true);
    } else {
      console.warn("[评论@提及] @" + _0x358c92 + " 未能形成蓝色 @ 链接");
      _0x1d0184("@" + _0x358c92 + " 未能形成蓝色 @ 链接 clicked=" + !!_0x58a509 + " count " + _0xb1a8b3 + "→" + _0x30c14a + " (" + _0x137413(_0x399ead) + ")", true);
    }
    return _0x57e192;
  }
  async function _0x3be8ce(_0x286d45, _0x155f04, _0x1e87f1 = {}) {
    const _0x1602fe = !!_0x1e87f1.isVideoComment;
    const _0x19ead9 = _0x1602fe ? _0x54fe8d() : _0x5946be();
    if (!_0x19ead9.length) {
      return {
        attached: false,
        skipped: true,
        count: 0,
        total: 0
      };
    }
    let _0x22b86d = 0;
    for (const _0x193519 of _0x19ead9) {
      if (_0x4dcc81(_0x155f04)) {
        break;
      }
      const _0x4b4f7c = await _0xf7169b(_0x286d45, _0x193519, _0x155f04, _0x1e87f1);
      if (_0x4b4f7c) {
        _0x22b86d += 1;
      }
      await _0x27280b(250, 450, _0x155f04);
    }
    return {
      attached: _0x22b86d > 0,
      skipped: false,
      count: _0x22b86d,
      total: _0x19ead9.length
    };
  }
  async function _0x569e51(_0x36ee20, _0x30e97f, _0x2928a6, _0x138ee3 = {}) {
    const _0x2b89eb = !!_0x138ee3.isVideoComment;
    const _0x156040 = _0x138ee3.mentionPosition || _0x1258fc(_0x2b89eb);
    if (_0x156040 === "before" && _0x19f5d2(_0x2b89eb)) {
      const _0x6b387e = await _0x3be8ce(_0x36ee20, _0x2928a6, {
        isVideoComment: _0x2b89eb,
        replyMode: !!_0x138ee3.replyMode,
        scopeInfo: _0x138ee3.scopeInfo
      });
      if (_0x6b387e.attached) {
        _0x160520("@ 提及：已附加 " + _0x6b387e.count + "/" + _0x6b387e.total + " 个账号（正文前）");
      } else if (!_0x6b387e.skipped && _0x6b387e.total > 0) {
        _0x160520("@ 提及：正文前附加失败，继续发送评论正文");
      }
    }
    const _0x4e0f3c = String(_0x30e97f || "");
    if (!_0x4e0f3c.trim()) {
      return true;
    }
    const _0x4dfcba = await _0x38c727(_0x36ee20, _0x4e0f3c, _0x2928a6);
    return _0x4dfcba;
  }
  async function _0x58bed4(_0x2c53b2, _0x19481e, _0x19933f = {}) {
    const _0x3b23b4 = !!_0x19933f.isVideoComment;
    const _0x444703 = _0x19933f.mentionPosition || _0x1258fc(_0x3b23b4);
    if (_0x444703 !== "after" || !_0x19f5d2(_0x3b23b4)) {
      return {
        attached: false,
        skipped: true,
        count: 0,
        total: 0
      };
    }
    const _0x3c4cf2 = await _0x3be8ce(_0x2c53b2, _0x19481e, {
      isVideoComment: _0x3b23b4,
      replyMode: !!_0x19933f.replyMode,
      scopeInfo: _0x19933f.scopeInfo
    });
    if (_0x3c4cf2.attached) {
      _0x160520("@ 提及：已附加 " + _0x3c4cf2.count + "/" + _0x3c4cf2.total + " 个账号（正文后）");
    } else if (_0x3c4cf2.total > 0) {
      _0x160520("@ 提及：正文后附加失败，继续发送");
    }
    return _0x3c4cf2;
  }
  return {
    appendCommentMentionsAfterAttachments: _0x58bed4,
    composeCommentInputWithMentions: _0x569e51,
    findSmartElement: _0x9c55e,
    focusWithoutScroll: _0x5db5c5,
    insertTextIntoEditable: _0x38c727,
    isElementInViewport: _0x46db38,
    isElementInViewportForAutomation: _0x158526,
    isVisibleElement: _0x593d97,
    reportMentionDebug: _0x1d0184,
    resolveActiveMentionPercent: _0x16d0ca,
    resolveCommentMentionPosition: _0x1258fc,
    rollMentionProbability: _0x8054e,
    safeScrollTargetIntoView: _0x2db747,
    shouldUseCommentMentions: _0x19f5d2,
    simulateHumanClick: _0x2d90b5,
    simulateTrustedElementClick: _0x296bfe,
    simulateTrustedEnter: _0xb8958,
    simulateTrustedKey: _0x2a86de,
    waitForDmInput: _0x31eefb
  };
}
module.exports = {
  createDouyinDomInteractionController: createDouyinDomInteractionController
};
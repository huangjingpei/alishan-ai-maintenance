function isVisibleElement(_0x5bf270) {
  if (!_0x5bf270 || typeof _0x5bf270.getBoundingClientRect !== "function") {
    return false;
  }
  try {
    const _0x1ceaaa = window.getComputedStyle(_0x5bf270);
    if (_0x1ceaaa.display === "none" || _0x1ceaaa.visibility === "hidden" || parseFloat(_0x1ceaaa.opacity || "1") <= 0.01) {
      return false;
    }
    const _0xb2039b = _0x5bf270.getBoundingClientRect();
    return _0xb2039b.width > 0 && _0xb2039b.height > 0;
  } catch (_0x3d4b48) {
    return false;
  }
}
function findEntityFollowingTab(_0x3b892d = null) {
  const _0x17ad9c = Array.from(document.querySelectorAll("[role=\"tab\"], .semi-tabs-tab"));
  const _0x150e2e = _0x17ad9c.find(_0x53b292 => {
    if (!isVisibleElement(_0x53b292)) {
      return false;
    }
    const _0x1fbd3f = String(_0x53b292.innerText || _0x53b292.textContent || "").replace(/\s+/g, "").trim();
    if (!/^关注(\(\d+\))?$/.test(_0x1fbd3f)) {
      return false;
    }
    let _0x4cf5aa = _0x53b292.parentElement;
    while (_0x4cf5aa && _0x4cf5aa !== document.body) {
      if (window.getComputedStyle(_0x4cf5aa).position === "fixed") {
        return true;
      }
      _0x4cf5aa = _0x4cf5aa.parentElement;
    }
    return false;
  });
  if (_0x150e2e) {
    const _0x383582 = String(_0x150e2e.innerText || "").trim();
    if (typeof _0x3b892d === "function") {
      _0x3b892d("[调试] 成功命中关注Tab: \"" + _0x383582 + "\"");
    }
    return _0x150e2e;
  }
  const _0x4fd7f3 = Array.from(document.querySelectorAll("[role=\"dialog\"], [class*=\"modal\"], [class*=\"Modal\"], [class*=\"drawer\"], [class*=\"Drawer\"], [class*=\"popup\"], [class*=\"Popup\"], [class*=\"semi-modal\"], [class*=\"semi-drawer\"], [class*=\"semi-portal\"]")).filter(_0x3c811b => isVisibleElement(_0x3c811b));
  const _0x223e1d = _0x4fd7f3.length ? _0x4fd7f3 : [document.body];
  for (const _0x298989 of _0x223e1d) {
    const _0x50afba = Array.from(_0x298989.querySelectorAll("button, [role=\"tab\"], [role=\"button\"], div, span, a"));
    const _0x1f08fe = _0x50afba.find(_0x4fbf7c => {
      if (!isVisibleElement(_0x4fbf7c)) {
        return false;
      }
      const _0xf5c2ec = String(_0x4fbf7c.innerText || _0x4fbf7c.textContent || "").replace(/\s+/g, "").trim();
      return /^关注(\(\d+\))?$/.test(_0xf5c2ec);
    });
    if (!_0x1f08fe) {
      continue;
    }
    const _0x5bb471 = _0x1f08fe.matches?.("button, [role=\"tab\"], [role=\"button\"], a") ? _0x1f08fe : _0x1f08fe.closest?.("button, [role=\"tab\"], [role=\"button\"], a") || _0x1f08fe;
    if (_0x5bb471 && typeof _0x3b892d === "function") {
      _0x3b892d("[调试] 兜底命中关注Tab: \"" + _0x5bb471.innerText?.trim() + "\"");
    }
    return _0x5bb471;
  }
  if (typeof _0x3b892d === "function") {
    _0x3b892d("[调试] 未找到关注Tab，将使用粉丝列表回退模式");
  }
  return null;
}
function findEntityRelationModalContainer(_0x461e70 = null) {
  if (typeof document === "undefined") {
    return null;
  }
  const _0x5641a6 = Array.from(document.querySelectorAll("[role=\"dialog\"], [class*=\"modal\"], [class*=\"Modal\"], [class*=\"drawer\"], [class*=\"Drawer\"], [class*=\"popup\"], [class*=\"Popup\"], [class*=\"semi-modal\"], [class*=\"semi-drawer\"], [class*=\"semi-portal\"], [class*=\"userMenu\"], [class*=\"relation\"], [class*=\"fans\"], [class*=\"follow\"]")).filter(_0x18f8ab => isVisibleElement(_0x18f8ab));
  const _0x34000c = _0x5641a6.find(_0x40693e => {
    const _0x1ff244 = String(_0x40693e.innerText || _0x40693e.textContent || "");
    return /关注\s*\(\d+\)/.test(_0x1ff244) && /粉丝\s*\(\d+\)/.test(_0x1ff244) || /搜索用户名字或抖音号/.test(_0x1ff244) || _0x40693e.querySelectorAll("a[href*=\"/user/\"]").length > 0 && /回关|已关注|相互关注/.test(_0x1ff244);
  });
  if (_0x34000c) {
    const _0x6299a6 = String(_0x34000c.className || "").slice(0, 40);
    if (typeof _0x461e70 === "function") {
      _0x461e70("[调试] 明确定位到弹窗容器: <" + _0x34000c.tagName + "." + _0x6299a6 + ">");
    }
    return _0x34000c;
  }
  const _0x230067 = Array.from(document.querySelectorAll("div, section, aside")).filter(_0x43699e => {
    if (!isVisibleElement(_0x43699e)) {
      return false;
    }
    if (_0x43699e === document.body || _0x43699e === document.documentElement) {
      return false;
    }
    const _0x5f1b80 = _0x43699e.getBoundingClientRect();
    if (_0x5f1b80.width < 200 || _0x5f1b80.height < 200) {
      return false;
    }
    if (_0x5f1b80.width >= window.innerWidth - 10 && _0x5f1b80.height >= window.innerHeight - 10) {
      return false;
    }
    const _0x2ff072 = String(_0x43699e.innerText || _0x43699e.textContent || "");
    if (!/粉丝/.test(_0x2ff072) && !/关注/.test(_0x2ff072)) {
      return false;
    }
    const _0x5b3f59 = _0x43699e.getAttribute?.("role") === "dialog" || /modal|drawer|popup|semi/i.test(_0x43699e.className || "") || /搜索用户名字/.test(_0x2ff072) || _0x43699e.querySelectorAll("a[href*=\"/user/\"]").length >= 1;
    return _0x5b3f59;
  }).sort((_0x345eb1, _0x4abd12) => _0x4abd12.querySelectorAll("a[href*=\"/user/\"]").length - _0x345eb1.querySelectorAll("a[href*=\"/user/\"]").length);
  const _0xb5a46 = _0x230067[0] || null;
  if (_0xb5a46 && typeof _0x461e70 === "function") {
    _0x461e70("[调试] 泛化定位到弹窗容器: <" + _0xb5a46.tagName + "." + String(_0xb5a46.className || "").slice(0, 40) + ">");
  } else if (!_0xb5a46 && typeof _0x461e70 === "function") {
    _0x461e70("[调试] 警告: 未能找到弹窗容器!");
  }
  return _0xb5a46;
}
function findEntityRelationListScroller(_0x24fcdd = null) {
  const _0x3d6ab4 = findEntityRelationModalContainer();
  if (!_0x3d6ab4) {
    if (typeof _0x24fcdd === "function") {
      _0x24fcdd("[调试] 无弹窗容器，滚动容器使用 document.body");
    }
    return document.body;
  }
  const _0x1fbf79 = Array.from(_0x3d6ab4.querySelectorAll("div, ul, section, article"));
  const _0xf2929b = _0x1fbf79.filter(_0x2d04f4 => {
    if (!isVisibleElement(_0x2d04f4)) {
      return false;
    }
    const _0x1e4bb6 = window.getComputedStyle(_0x2d04f4);
    const _0x35c657 = /(auto|scroll|overlay)/.test(_0x1e4bb6.overflowY + " " + _0x1e4bb6.overflow) || _0x2d04f4.scrollHeight > _0x2d04f4.clientHeight + 10;
    if (!_0x35c657) {
      return false;
    }
    return _0x2d04f4.querySelectorAll("a[href*=\"/user/\"], a[href*=\"sec_uid\"]").length >= 1;
  }).sort((_0xde07f3, _0x5e0b19) => {
    const _0x47c641 = _0x5e0b19.scrollHeight - _0x5e0b19.clientHeight - (_0xde07f3.scrollHeight - _0xde07f3.clientHeight);
    if (Math.abs(_0x47c641) > 10) {
      return _0x47c641;
    }
    return _0x5e0b19.querySelectorAll("a[href*=\"/user/\"]").length - _0xde07f3.querySelectorAll("a[href*=\"/user/\"]").length;
  });
  const _0x5932b7 = _0xf2929b[0] || _0x3d6ab4;
  if (typeof _0x24fcdd === "function") {
    const _0xd9a91d = String(_0x5932b7.className || "").slice(0, 40);
    const _0x3cb500 = _0x5932b7.querySelectorAll("a[href*=\"/user/\"]").length;
    _0x24fcdd("[调试] 列表滚动容器: <" + _0x5932b7.tagName + "." + _0xd9a91d + ">, scrollH=" + _0x5932b7.scrollHeight + ", clientH=" + _0x5932b7.clientHeight + ", scrollTop=" + _0x5932b7.scrollTop + ", 用户数=" + _0x3cb500);
  }
  return _0x5932b7;
}
function findUserCardRow(_0x17aa8e, _0x34ed0d) {
  let _0x1e7a8c = _0x17aa8e;
  while (_0x1e7a8c && _0x1e7a8c !== _0x34ed0d && _0x1e7a8c !== document.body) {
    const _0x278718 = _0x1e7a8c.querySelectorAll("a[href*=\"/user/\"]").length;
    const _0x2aa20f = String(_0x1e7a8c.innerText || _0x1e7a8c.textContent || "");
    const _0x5d8af0 = /相互关注|已关注|回关|\+ 关注|移除/.test(_0x2aa20f);
    if (_0x278718 <= 3 && _0x5d8af0) {
      return _0x1e7a8c;
    }
    _0x1e7a8c = _0x1e7a8c.parentElement;
  }
  return _0x17aa8e.closest("li") || _0x17aa8e.parentElement;
}
function collectEntityRelationUsersFromList({
  sourceType = "mutual",
  collectEntityUsersFromApiBuffer: _0x16b875,
  normalizeDouyinAuthorProfileUrl: _0x521c0b,
  buildEntityUserKey: _0x53b5f3,
  logFn = null
} = {}) {
  const _0xeb5dac = sourceType === "following" ? "following" : "mutual";
  const _0x3c5032 = [];
  const _0x2ae31b = new Set();
  const _0xc962b = _0xeb5dac === "following" ? "关注列表" : "互关";
  if (typeof _0x16b875 === "function") {
    const _0x206521 = _0x16b875(_0xeb5dac);
    for (const _0x3f5338 of _0x206521) {
      if (_0x2ae31b.has(_0x3f5338.userKey)) {
        continue;
      }
      _0x2ae31b.add(_0x3f5338.userKey);
      _0x3c5032.push(_0x3f5338);
    }
  }
  const _0x3eecb9 = findEntityRelationModalContainer(logFn);
  if (!_0x3eecb9) {
    return _0x3c5032;
  }
  const _0x17f715 = Array.from(_0x3eecb9.querySelectorAll("a[href*=\"/user/\"], a[href*=\"sec_uid\"]"));
  let _0x22dcfd = 0;
  for (const _0xcfe242 of _0x17f715) {
    if (!isVisibleElement(_0xcfe242)) {
      continue;
    }
    const _0x13ab8d = _0xcfe242.href || _0xcfe242.getAttribute?.("href") || "";
    if (!_0x13ab8d || _0x13ab8d.includes("/user/self")) {
      continue;
    }
    const _0x300f62 = typeof _0x521c0b === "function" ? _0x521c0b(_0x13ab8d) : _0x13ab8d;
    const _0x27ef3f = typeof _0x53b5f3 === "function" ? _0x53b5f3(_0x300f62) : _0x300f62;
    if (!_0x27ef3f || !_0x300f62 || _0x2ae31b.has(_0x27ef3f)) {
      continue;
    }
    const _0x39bf49 = findUserCardRow(_0xcfe242, _0x3eecb9) || _0xcfe242.closest("li, div") || _0xcfe242;
    const _0x2a8d98 = String(_0x39bf49.innerText || _0x39bf49.textContent || "");
    if (_0xeb5dac === "mutual") {
      const _0x29821e = /相互关注|互相关注/.test(_0x2a8d98) && !/回关/.test(_0x2a8d98);
      if (!_0x29821e) {
        continue;
      }
    } else {
      const _0x27b77a = /相互关注|互相关注|已关注|移除/.test(_0x2a8d98);
      if (!_0x27b77a) {
        continue;
      }
    }
    let _0x1f1089 = String(_0xcfe242.innerText || _0xcfe242.textContent || "").replace(/\s+/g, " ").trim().replace(/^@+/, "");
    if (!_0x1f1089 || /相互关注|互相关注|关注|私信|回关|移除/.test(_0x1f1089)) {
      const _0x401120 = String(_0x39bf49.innerText || "").split(/\n+/).map(_0x67c97 => _0x67c97.trim()).find(_0x5d48bc => _0x5d48bc && _0x5d48bc.length <= 40 && !/相互关注|互相关注|关注|粉丝|获赞|私信|回关|移除/.test(_0x5d48bc));
      _0x1f1089 = _0x401120 ? _0x401120.replace(/^@+/, "") : "";
    }
    if (!_0x1f1089) {
      continue;
    }
    _0x2ae31b.add(_0x27ef3f);
    _0x3c5032.push({
      nickname: _0x1f1089,
      userUrl: _0x300f62,
      userKey: _0x27ef3f
    });
    _0x22dcfd += 1;
  }
  if (typeof logFn === "function") {
    logFn("[调试] 弹窗内共解析 " + _0x17f715.length + " 个用户链接，DOM 提取出 " + _0x22dcfd + " 个" + _0xc962b + "用户 (总计 " + _0x3c5032.length + ")");
  }
  return _0x3c5032;
}
function collectEntityMutualUsersFromList(_0x48281a = {}) {
  return collectEntityRelationUsersFromList({
    ..._0x48281a,
    sourceType: "mutual"
  });
}
async function scrollEntityMutualContainer(_0x58c25f, _0x3a7e48, _0x39a53e = null) {
  const _0x564dce = _0x58c25f || findEntityRelationListScroller(_0x39a53e);
  if (!_0x564dce) {
    if (typeof _0x39a53e === "function") {
      _0x39a53e("[调试] 无法滚动: 未确定滚动目标容器");
    }
    return {
      moved: false,
      atBottom: true
    };
  }
  const _0x4b9023 = _0x564dce.scrollTop || 0;
  const _0x43866a = _0x564dce.scrollHeight || 0;
  const _0x37241b = _0x564dce.querySelectorAll("a[href*=\"/user/\"]").length;
  const _0xc70ede = _0x564dce.clientHeight || 400;
  const _0x1e418d = Math.max(0, (_0x564dce.scrollHeight || 0) - _0xc70ede);
  const _0x1fb110 = _0x4b9023 >= _0x1e418d - 24 && _0x1e418d > 80;
  if (_0x1fb110) {
    try {
      _0x564dce.scrollTop = Math.max(0, _0x1e418d - Math.min(320, Math.floor(_0xc70ede * 0.6)));
      _0x564dce.dispatchEvent(new Event("scroll", {
        bubbles: true
      }));
    } catch (_0x50806e) {}
    if (typeof _0x3a7e48 === "function") {
      await _0x3a7e48(280 + Math.random() * 180);
    }
  }
  const _0x1c2495 = Math.max(480, Math.floor(_0xc70ede * (0.85 + Math.random() * 0.45)));
  const _0x190634 = Math.max(0, (_0x564dce.scrollHeight || 0) - (_0x564dce.clientHeight || _0xc70ede));
  try {
    _0x564dce.scrollTop = Math.min(_0x190634, (_0x564dce.scrollTop || 0) + _0x1c2495);
    _0x564dce.dispatchEvent(new Event("scroll", {
      bubbles: true
    }));
  } catch (_0x24c430) {}
  if (typeof _0x3a7e48 === "function") {
    await _0x3a7e48(220 + Math.random() * 160);
  }
  try {
    _0x564dce.scrollTop = Math.max(0, (_0x564dce.scrollHeight || 0) - (_0x564dce.clientHeight || _0xc70ede)) + 40;
  } catch (_0x32e097) {}
  const _0x24f0c9 = Array.from(_0x564dce.children || []);
  const _0x282491 = _0x24f0c9[_0x24f0c9.length - 1] || _0x564dce.lastElementChild || _0x564dce.lastChild;
  if (_0x282491 && typeof _0x282491.scrollIntoView === "function") {
    try {
      _0x282491.scrollIntoView({
        block: "end",
        inline: "nearest"
      });
    } catch (_0x4000e6) {}
  }
  const _0x56a83a = {
    deltaX: 0,
    deltaY: _0x1c2495,
    deltaMode: 0,
    bubbles: true,
    cancelable: true,
    view: window
  };
  try {
    _0x564dce.dispatchEvent(new WheelEvent("wheel", _0x56a83a));
    _0x564dce.dispatchEvent(new Event("scroll", {
      bubbles: true
    }));
    if (_0x282491 && typeof _0x282491.dispatchEvent === "function") {
      _0x282491.dispatchEvent(new WheelEvent("wheel", _0x56a83a));
    }
    const _0x309a72 = {
      key: "PageDown",
      code: "PageDown",
      keyCode: 34,
      which: 34,
      bubbles: true,
      cancelable: true
    };
    _0x564dce.dispatchEvent(new KeyboardEvent("keydown", _0x309a72));
    _0x564dce.dispatchEvent(new KeyboardEvent("keyup", _0x309a72));
  } catch (_0x286cb0) {}
  const _0x23e0a0 = findEntityRelationModalContainer();
  if (_0x23e0a0 && _0x23e0a0 !== _0x564dce) {
    try {
      const _0x3faa2a = Math.max(0, (_0x23e0a0.scrollHeight || 0) - (_0x23e0a0.clientHeight || 0));
      if (_0x3faa2a > 40) {
        if ((_0x23e0a0.scrollTop || 0) >= _0x3faa2a - 24) {
          _0x23e0a0.scrollTop = Math.max(0, _0x3faa2a - 240);
        }
        _0x23e0a0.scrollTop = _0x3faa2a + 40;
        _0x23e0a0.dispatchEvent(new WheelEvent("wheel", _0x56a83a));
        _0x23e0a0.dispatchEvent(new Event("scroll", {
          bubbles: true
        }));
      }
    } catch (_0x55ec79) {}
  }
  if (typeof _0x3a7e48 === "function") {
    await _0x3a7e48(1600 + Math.random() * 800);
  }
  const _0x4ede02 = _0x564dce.scrollTop || 0;
  const _0x5ab458 = _0x564dce.scrollHeight || 0;
  const _0x531199 = _0x564dce.querySelectorAll("a[href*=\"/user/\"]").length;
  const _0xab60ea = _0x4ede02 > _0x4b9023 + 20 || _0x5ab458 > _0x43866a + 40 || _0x531199 > _0x37241b;
  const _0x3ab28d = _0x4ede02 >= Math.max(0, _0x5ab458 - (_0x564dce.clientHeight || _0xc70ede)) - 24;
  if (typeof _0x39a53e === "function") {
    _0x39a53e("[调试] 互关列表滚动: scrollTop " + _0x4b9023 + "->" + _0x4ede02 + ", scrollH " + _0x43866a + "->" + _0x5ab458 + ", " + ("用户链 " + _0x37241b + "->" + _0x531199) + (_0x1fb110 ? "（底部回弹）" : "") + (_0xab60ea ? "" : "（本轮无明显位移，可能已到底或容器未命中）"));
  }
  return {
    moved: _0xab60ea,
    atBottom: _0x3ab28d,
    beforeTop: _0x4b9023,
    afterTop: _0x4ede02,
    beforeLinks: _0x37241b,
    afterLinks: _0x531199
  };
}
function findEntitySelfProfileRelationEntry(_0x579688 = "fans") {
  const _0x369d42 = _0x579688 === "following";
  const _0x5bcb98 = _0x19b642 => {
    if (!_0x19b642) {
      return false;
    }
    return !!_0x19b642.closest?.("header, #douyin-header, [class*=\"userMenuPanelShadowAnimation\"]");
  };
  const _0x58c897 = _0x369d42 ? "[data-e2e=\"user-info-follow\"], [data-e2e*=\"user-follow\"], [data-e2e*=\"user-following\"], [data-e2e*=\"following-count\"]" : "[data-e2e=\"user-info-fans\"], [data-e2e*=\"user-fans\"], [data-e2e*=\"user-follower\"]";
  const _0xb61ac = Array.from(document.querySelectorAll(_0x58c897)).filter(_0x313e8d => {
    if (!isVisibleElement(_0x313e8d) || _0x5bcb98(_0x313e8d)) {
      return false;
    }
    const _0x3f1abf = String(_0x313e8d.getAttribute?.("data-e2e") || "");
    if (_0x369d42 && /follow-btn|follow-button/i.test(_0x3f1abf)) {
      return false;
    }
    return true;
  });
  if (_0xb61ac.length > 0) {
    return _0xb61ac[0];
  }
  const _0x1784ea = _0x369d42 ? ["[data-e2e*=\"user-info-follow\"]", "[data-e2e*=\"user-following\"]", "[data-e2e*=\"following-count\"]", "a[href*=\"following\"]", "button", "[role=\"button\"]", "a", "div", "span", "p"] : ["[data-e2e*=\"user-info-fans\"]", "[data-e2e*=\"user-fans\"]", "[data-e2e*=\"user-follower\"]", "[data-e2e*=\"follower-count\"]", "a[href*=\"follower\"]", "button", "[role=\"button\"]", "a", "div", "span", "p"];
  const _0x13ebd9 = Array.from(document.querySelectorAll(_0x1784ea.join(","))).filter(_0x28f874 => {
    if (!isVisibleElement(_0x28f874)) {
      return false;
    }
    if (_0x5bcb98(_0x28f874)) {
      return false;
    }
    const _0x297b1e = String(_0x28f874.innerText || _0x28f874.textContent || "").replace(/\s+/g, " ").trim();
    if (!_0x297b1e || _0x297b1e.length > 24) {
      return false;
    }
    if (_0x369d42) {
      if (/粉丝|粉丝团|回关|已关注|相互关注|互相关注|关注Ta|\+关注/.test(_0x297b1e)) {
        return false;
      }
      if (/follow-btn|follow-button/i.test(String(_0x28f874.getAttribute?.("data-e2e") || ""))) {
        return false;
      }
      return /关注/.test(_0x297b1e);
    }
    return /粉丝/.test(_0x297b1e) && !/粉丝团|粉丝群|你的粉丝/.test(_0x297b1e);
  }).sort((_0x111e36, _0x270610) => {
    const _0x22c83a = _0x55c070 => {
      const _0x483ce1 = String(_0x55c070.innerText || _0x55c070.textContent || "").replace(/\s+/g, " ").trim();
      let _0x199118 = 0;
      const _0xa4e1af = String(_0x55c070.getAttribute?.("data-e2e") || "");
      const _0x591c1c = String(_0x55c070.getAttribute?.("href") || "");
      if (_0x369d42) {
        if (/user-info-follow|user-following|following-count/i.test(_0xa4e1af)) {
          _0x199118 += 50;
        }
        if (/following/i.test(_0x591c1c) && !/follower/i.test(_0x591c1c)) {
          _0x199118 += 25;
        }
        if (/^关注\s*\d+(?:\.\d+)?[万wW]?$/.test(_0x483ce1)) {
          _0x199118 += 20;
        }
        if (/^\d+(?:\.\d+)?[万wW]?关注$/.test(_0x483ce1)) {
          _0x199118 += 20;
        }
        if (_0x483ce1 === "关注") {
          _0x199118 += 12;
        }
      } else {
        if (/user-info-fans|user-fans/i.test(_0xa4e1af)) {
          _0x199118 += 50;
        }
        if (/user-follower|follower-count/i.test(_0xa4e1af)) {
          _0x199118 += 30;
        }
        if (/follower/i.test(_0x591c1c)) {
          _0x199118 += 20;
        }
        if (/^粉丝\s*\d+(?:\.\d+)?[万wW]?$/.test(_0x483ce1)) {
          _0x199118 += 15;
        }
        if (/^\d+(?:\.\d+)?[万wW]?粉丝$/.test(_0x483ce1)) {
          _0x199118 += 15;
        }
        if (_0x483ce1 === "粉丝") {
          _0x199118 += 10;
        }
      }
      if (_0x55c070.matches?.("a, button, [role=\"button\"]")) {
        _0x199118 += 10;
      }
      _0x199118 -= Math.min(_0x483ce1.length, 20) / 20;
      return _0x199118;
    };
    return _0x22c83a(_0x270610) - _0x22c83a(_0x111e36);
  });
  const _0x182e02 = _0x13ebd9[0] || null;
  if (!_0x182e02) {
    return null;
  }
  if (_0x182e02.getAttribute?.("data-e2e") || _0x182e02.matches?.("a, button, [role=\"button\"], [class*=\"tfxaETAB\"]")) {
    return _0x182e02;
  }
  const _0x258b02 = _0x182e02.closest?.("a, button, [role=\"button\"], [data-e2e], div[class*=\"tfxaETAB\"]");
  if (_0x258b02 && isVisibleElement(_0x258b02) && !_0x5bcb98(_0x258b02)) {
    if (!_0x258b02.matches?.("a[href*=\"/user/self\"]") || _0x258b02.getAttribute?.("data-e2e")) {
      return _0x258b02;
    }
  }
  return _0x182e02;
}
function findEntitySelfFansEntry() {
  return findEntitySelfProfileRelationEntry("fans");
}
function findEntitySelfFollowingEntry() {
  return findEntitySelfProfileRelationEntry("following");
}
function resolveEntityRelationProfileEntryKind(_0x2bc7b3) {
  if (_0x2bc7b3 === "following") {
    return "following";
  } else {
    return "fans";
  }
}
module.exports = {
  findEntityFollowingTab: findEntityFollowingTab,
  findEntityRelationModalContainer: findEntityRelationModalContainer,
  findEntityRelationListScroller: findEntityRelationListScroller,
  findEntitySelfProfileRelationEntry: findEntitySelfProfileRelationEntry,
  findEntitySelfFansEntry: findEntitySelfFansEntry,
  findEntitySelfFollowingEntry: findEntitySelfFollowingEntry,
  resolveEntityRelationProfileEntryKind: resolveEntityRelationProfileEntryKind,
  collectEntityRelationUsersFromList: collectEntityRelationUsersFromList,
  collectEntityMutualUsersFromList: collectEntityMutualUsersFromList,
  scrollEntityMutualContainer: scrollEntityMutualContainer
};
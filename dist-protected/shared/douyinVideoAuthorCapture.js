const {
  normalizeAuthorNicknameText,
  normalizeAuthorAccountName,
  parseExcludeAuthorAccounts,
  matchExcludedVideoAuthor
} = require("./douyinVideoAuthor");
const FEED_SCOPE_E2E = ["feed-active-video", "feed-active-live", "feed-live", "browse-live", "webcast-player"];
function createDouyinVideoAuthorApi(_0x498b05 = {}) {
  const _0x4c529d = _0x498b05.isVisibleElement || (() => true);
  const _0x2384df = _0x498b05.extractAuthorFromReactFiber || (() => null);
  const _0x529803 = _0x498b05.normalizeDouyinAuthorProfileUrl || (_0x5ef415 => String(_0x5ef415 || "").trim());
  const _0x484ceb = _0x498b05.getElementsIncludingRoot || ((_0x12a375, _0x5d7c4e) => {
    if (!_0x12a375?.querySelectorAll) {
      return [];
    }
    return Array.from(_0x12a375.querySelectorAll(_0x5d7c4e));
  });
  const _0x39dc72 = _0x498b05.extractSpecificVideoId || (() => "");
  const _0xa51a5e = _0x498b05.getModalContainerSelector || (() => "[data-e2e=\"video-detail\"], .video-detail-container");
  function _0x38df1b(_0x79a18d, _0x30caa2 = document) {
    if (!_0x79a18d) {
      return -999;
    }
    const _0x4f8d33 = _0x529803(_0x79a18d.href || _0x79a18d.getAttribute?.("href") || "");
    if (!_0x4f8d33) {
      return -999;
    }
    const _0x4af716 = _0x79a18d.closest?.("[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], [class*=\"comment-item\"], [class*=\"reply-item\"]");
    if (_0x4af716) {
      return -999;
    }
    let _0x1c14cc = 10;
    const _0x583727 = normalizeAuthorNicknameText(_0x79a18d.innerText || _0x79a18d.textContent || _0x79a18d.getAttribute?.("title") || "");
    if (_0x583727) {
      _0x1c14cc += 25;
    }
    if (_0x79a18d.closest?.("[data-e2e=\"feed-video-nickname\"], [data-e2e=\"video-author-name\"], .author-card-user-name")) {
      _0x1c14cc += 90;
    }
    if (_0x79a18d.closest?.("[data-e2e*=\"author\"], [data-e2e*=\"user-name\"], [class*=\"author-name\"], [class*=\"AuthorName\"], [class*=\"nickname\"]")) {
      _0x1c14cc += 45;
    }
    if (_0x79a18d.closest?.(".video-info-detail, .account-card-container, [class*=\"video-info\"], [class*=\"VideoInfo\"]")) {
      _0x1c14cc += 35;
    }
    if (_0x79a18d.closest?.("[data-e2e=\"video-desc\"], [data-e2e=\"note-desc\"], [class*=\"desc\"], [class*=\"Desc\"]")) {
      _0x1c14cc -= 55;
    }
    try {
      const _0x1f2e6f = _0x79a18d.getBoundingClientRect();
      const _0x160249 = _0x30caa2.getBoundingClientRect?.() || {
        top: 0,
        height: window.innerHeight,
        bottom: window.innerHeight
      };
      const _0xf57c9c = _0x1f2e6f.top - (_0x160249.top || 0);
      const _0x54ec63 = _0x160249.height || window.innerHeight;
      if (_0xf57c9c >= 0 && _0xf57c9c < Math.max(180, _0x54ec63 * 0.35)) {
        _0x1c14cc += 20;
      }
      if (_0x1f2e6f.top > (_0x160249.bottom || window.innerHeight) - 8) {
        _0x1c14cc -= 120;
      }
      if (_0x1f2e6f.top > window.innerHeight * 0.72) {
        _0x1c14cc -= 80;
      }
      const _0x5690c7 = Math.min(_0x1f2e6f.bottom, _0x160249.bottom || window.innerHeight) - Math.max(_0x1f2e6f.top, _0x160249.top || 0);
      if (_0x5690c7 < Math.min(_0x1f2e6f.height || 0, 16)) {
        _0x1c14cc -= 100;
      }
    } catch (_0x387350) {}
    return _0x1c14cc;
  }
  function _0x2f3a71(_0x409803) {
    if (!_0x409803) {
      return "";
    }
    const _0x27299e = [];
    const _0x52cd47 = _0x500f2c => {
      const _0x556185 = String(_0x500f2c || "").trim();
      if (_0x556185) {
        _0x27299e.push(_0x556185);
      }
    };
    let _0x25b1c2 = _0x409803;
    for (let _0x375d1e = 0; _0x375d1e < 8 && _0x25b1c2; _0x375d1e += 1) {
      _0x52cd47(_0x25b1c2.getAttribute?.("href"));
      _0x52cd47(_0x25b1c2.getAttribute?.("to"));
      _0x52cd47(_0x25b1c2.getAttribute?.("data-href"));
      _0x52cd47(_0x25b1c2.dataset?.href);
      _0x52cd47(_0x25b1c2.getAttribute?.("data-user-url"));
      _0x52cd47(_0x25b1c2.getAttribute?.("data-sec-uid"));
      _0x52cd47(_0x25b1c2.getAttribute?.("data-secUid"));
      _0x52cd47(_0x25b1c2.dataset?.secUid);
      const _0x19eb8e = _0x25b1c2.getAttribute?.("data-sec-uid") || _0x25b1c2.getAttribute?.("data-secUid") || _0x25b1c2.dataset?.secUid || "";
      if (/^[A-Za-z0-9._-]{12,}$/.test(_0x19eb8e) && !/^\d+$/.test(_0x19eb8e)) {
        return _0x529803("https://www.douyin.com/user/" + _0x19eb8e);
      }
      const _0x5bc88a = [_0x25b1c2.matches?.("a[href]") ? _0x25b1c2 : null, _0x25b1c2.querySelector?.("a[href*=\"/user/\"], a[href*=\"sec_uid\"], a[href*=\"secUid\"]")].filter(Boolean);
      for (const _0x3efded of _0x5bc88a) {
        _0x52cd47(_0x3efded.href);
        _0x52cd47(_0x3efded.getAttribute?.("href"));
      }
      _0x25b1c2 = _0x25b1c2.parentElement;
    }
    for (const _0x3c0df6 of _0x27299e) {
      if (/^[A-Za-z0-9._-]{12,}$/.test(_0x3c0df6) && !/^\d+$/.test(_0x3c0df6) && !_0x3c0df6.includes("/")) {
        const _0x351dff = _0x529803("https://www.douyin.com/user/" + _0x3c0df6);
        if (_0x351dff) {
          return _0x351dff;
        }
      }
      const _0x232bce = _0x529803(_0x3c0df6);
      if (_0x232bce) {
        return _0x232bce;
      }
    }
    return "";
  }
  function _0xb7635c(_0x11cff3, _0x2b8e82) {
    const _0x3afc8f = normalizeAuthorAccountName(_0x2b8e82);
    if (!_0x3afc8f || !_0x11cff3?.getBoundingClientRect) {
      return "";
    }
    const _0x14332b = _0x11cff3.getBoundingClientRect();
    const _0x2669a9 = Array.from(document.querySelectorAll("a[href*=\"/user/\"], a[href*=\"douyin.com/user/\"]"));
    let _0x1eb59a = "";
    let _0x1d7636 = -Infinity;
    for (const _0x2d735f of _0x2669a9) {
      if (!_0x4c529d(_0x2d735f)) {
        continue;
      }
      const _0x3a9430 = _0x2d735f.closest?.("[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], [class*=\"comment-item\"], [class*=\"reply-item\"]");
      if (_0x3a9430) {
        continue;
      }
      const _0x57de06 = normalizeAuthorNicknameText(_0x2d735f.innerText || _0x2d735f.textContent || _0x2d735f.getAttribute?.("title") || "");
      if (!_0x57de06 || normalizeAuthorAccountName(_0x57de06) !== _0x3afc8f) {
        continue;
      }
      const _0x41a1a5 = _0x529803(_0x2d735f.href || _0x2d735f.getAttribute?.("href") || "");
      if (!_0x41a1a5) {
        continue;
      }
      const _0x1a7880 = _0x2d735f.getBoundingClientRect();
      if (_0x1a7880.top >= _0x14332b.bottom - 12) {
        continue;
      }
      if (_0x1a7880.top > _0x14332b.top + _0x14332b.height * 0.94) {
        continue;
      }
      const _0x18d9f4 = Math.min(_0x1a7880.bottom, _0x14332b.bottom) - Math.max(_0x1a7880.top, _0x14332b.top);
      const _0x30d61e = Math.min(_0x1a7880.right, _0x14332b.right) - Math.max(_0x1a7880.left, _0x14332b.left);
      if (_0x18d9f4 < 8 || _0x30d61e < 4) {
        continue;
      }
      const _0x290103 = _0x18d9f4 + Math.min(_0x30d61e, 60);
      if (_0x290103 > _0x1d7636) {
        _0x1d7636 = _0x290103;
        _0x1eb59a = _0x41a1a5;
      }
    }
    return _0x1eb59a;
  }
  function _0x5dfa7b(_0x52ad43, _0x334599, _0x219097, _0x3ac755) {
    if (!_0x3ac755) {
      return "";
    }
    const _0x124bdd = _0x2f3a71(_0x52ad43?.link);
    if (_0x124bdd) {
      return _0x124bdd;
    }
    try {
      const _0x3739ef = _0x2384df(_0x52ad43?.link, "", {
        maxSteps: 12,
        shallowOnly: true
      });
      if (_0x3739ef?.secUid) {
        const _0x3da6ab = normalizeAuthorNicknameText(_0x3739ef.nickname || "");
        if (!_0x3da6ab || normalizeAuthorAccountName(_0x3da6ab) === normalizeAuthorAccountName(_0x3ac755)) {
          return _0x529803("https://www.douyin.com/user/" + _0x3739ef.secUid);
        }
      }
    } catch (_0x111f8d) {}
    try {
      const _0x5b4ca7 = _0x2384df(_0x334599, _0x219097);
      if (_0x5b4ca7?.secUid) {
        const _0x5b9fc0 = normalizeAuthorNicknameText(_0x5b4ca7.nickname || "");
        const _0x4eff7d = _0x5b9fc0 && normalizeAuthorAccountName(_0x5b9fc0) === normalizeAuthorAccountName(_0x3ac755);
        if (_0x4eff7d) {
          return _0x529803("https://www.douyin.com/user/" + _0x5b4ca7.secUid);
        }
      }
    } catch (_0x406805) {}
    return _0xb7635c(_0x334599, _0x3ac755);
  }
  function _0x406d80(_0xfba5b4) {
    if (!_0xfba5b4 || !_0xfba5b4.getBoundingClientRect) {
      return null;
    }
    const _0x864973 = _0xfba5b4.getAttribute?.("data-e2e") || "";
    if (!FEED_SCOPE_E2E.includes(_0x864973)) {
      return null;
    }
    const _0x3fc43f = _0xfba5b4.getBoundingClientRect();
    if (_0x3fc43f.height < 80 || _0x3fc43f.width < 80) {
      return null;
    }
    const _0x4103af = Array.from(document.querySelectorAll("[data-e2e=\"feed-video-nickname\"], [data-e2e=\"video-author-name\"], .author-card-user-name"));
    let _0x1fc343 = null;
    let _0x2f318d = -Infinity;
    for (const _0x546e0a of _0x4103af) {
      if (!_0x4c529d(_0x546e0a)) {
        continue;
      }
      const _0xd536a5 = _0x546e0a.getBoundingClientRect();
      const _0x195ad5 = Math.min(_0xd536a5.bottom, _0x3fc43f.bottom) - Math.max(_0xd536a5.top, _0x3fc43f.top);
      const _0x39efd7 = Math.min(_0xd536a5.right, _0x3fc43f.right) - Math.max(_0xd536a5.left, _0x3fc43f.left);
      if (_0x195ad5 < Math.min(_0xd536a5.height || 0, 12) || _0x39efd7 < 8) {
        continue;
      }
      if (_0xd536a5.top >= _0x3fc43f.bottom - 12) {
        continue;
      }
      if (_0xd536a5.top > _0x3fc43f.top + _0x3fc43f.height * 0.94) {
        continue;
      }
      const _0x5de795 = _0x546e0a.matches?.("a[href*=\"/user/\"]") ? _0x546e0a : _0x546e0a.closest?.("a[href*=\"/user/\"]") || _0x546e0a.querySelector?.("a[href*=\"/user/\"]") || _0x546e0a;
      let _0x43ebc3 = _0x2f3a71(_0x5de795 || _0x546e0a);
      let _0xd39dd5 = normalizeAuthorNicknameText(_0x5de795?.innerText || _0x546e0a.innerText || _0x546e0a.textContent || _0x546e0a.getAttribute?.("title") || "");
      if (!_0x43ebc3 || !_0xd39dd5) {
        try {
          const _0x13a108 = _0x2384df(_0x546e0a, "", {
            maxSteps: 12,
            shallowOnly: true
          });
          if (!_0x43ebc3 && _0x13a108?.secUid) {
            _0x43ebc3 = _0x529803("https://www.douyin.com/user/" + _0x13a108.secUid);
          }
          if (!_0xd39dd5 && _0x13a108?.nickname) {
            _0xd39dd5 = normalizeAuthorNicknameText(_0x13a108.nickname);
          }
        } catch (_0x4c2bfa) {}
      }
      if (!_0x43ebc3 && !_0xd39dd5) {
        continue;
      }
      let _0x4c67f6 = _0x195ad5 + Math.min(_0x39efd7, 80);
      if (_0x43ebc3) {
        _0x4c67f6 += 40;
      }
      if (_0xd39dd5) {
        _0x4c67f6 += 20;
      }
      if (_0x546e0a.getAttribute?.("data-e2e") === "feed-video-nickname") {
        _0x4c67f6 += 30;
      }
      _0x4c67f6 += Math.max(0, 120 - Math.abs(_0xd536a5.top + _0xd536a5.height / 2 - (_0x3fc43f.top + _0x3fc43f.height * 0.72)));
      if (_0x4c67f6 > _0x2f318d) {
        _0x2f318d = _0x4c67f6;
        _0x1fc343 = {
          link: _0x5de795 || _0x546e0a,
          href: _0x43ebc3,
          nickname: _0xd39dd5
        };
      }
    }
    return _0x1fc343;
  }
  function _0x2a1c79(_0x38653e) {
    if (!_0x38653e) {
      return null;
    }
    const _0x23054d = _0x406d80(_0x38653e);
    if (_0x23054d?.link && _0x23054d.href) {
      return _0x23054d.link;
    }
    const _0x527432 = _0x484ceb(_0x38653e, "a[href*=\"/user/\"], a[href*=\"douyin.com/user/\"], [data-e2e*=\"author\"] a[href], [data-e2e*=\"user\"] a[href]");
    let _0x56bc82 = null;
    let _0x1eff0c = 40;
    for (const _0x37d697 of _0x527432) {
      const _0x5b176c = _0x38df1b(_0x37d697, _0x38653e);
      if (_0x5b176c > _0x1eff0c) {
        _0x56bc82 = _0x37d697;
        _0x1eff0c = _0x5b176c;
      }
    }
    return _0x56bc82;
  }
  function _0x3ea897(_0x442d6a, _0x33ddc9 = "") {
    if (!_0x442d6a) {
      return "";
    }
    const _0x24c3ff = _0x406d80(_0x442d6a);
    if (_0x24c3ff?.href) {
      return _0x24c3ff.href;
    }
    const _0x30447c = _0x2a1c79(_0x442d6a);
    if (_0x30447c) {
      const _0x455491 = _0x529803(_0x30447c.href || _0x30447c.getAttribute?.("href") || "");
      if (_0x455491) {
        return _0x455491;
      }
    }
    try {
      const _0x2427af = _0x2384df(_0x442d6a, _0x33ddc9);
      if (_0x2427af?.secUid) {
        return "https://www.douyin.com/user/" + _0x2427af.secUid;
      }
    } catch (_0x2c5cef) {}
    if (_0x39dc72(_0x33ddc9)) {
      return "";
    }
    const _0xcde932 = [_0x442d6a, ...Array.from(_0x442d6a.querySelectorAll?.("*") || []).slice(0, 180)];
    for (const _0x2ba654 of _0xcde932) {
      const _0x2dea04 = _0x2ba654.getAttributeNames?.() || [];
      for (const _0x1368ee of _0x2dea04) {
        const _0x3811e9 = String(_0x2ba654.getAttribute?.(_0x1368ee) || "").trim();
        if (!_0x3811e9) {
          continue;
        }
        const _0x53a090 = [_0x3811e9];
        if (/%(?:2f|3a)/i.test(_0x3811e9)) {
          try {
            _0x53a090.push(decodeURIComponent(_0x3811e9));
          } catch (_0x3772a1) {}
        }
        for (const _0x40747d of _0x53a090) {
          const _0x2c090f = _0x529803(_0x40747d);
          if (_0x2c090f) {
            return _0x2c090f;
          }
          const _0x5033e5 = _0x40747d.match(/(?:https?:)?\/\/(?:www\.)?douyin\.com\/user\/[^?&#"'\s<>]+|\/user\/[^?&#"'\s<>]+/i);
          const _0x3ff5d7 = _0x529803(_0x5033e5?.[0] || "");
          if (_0x3ff5d7) {
            return _0x3ff5d7;
          }
        }
        if (/^(?:data-)?(?:author-)?sec[-_]?uid$/i.test(_0x1368ee) && /^[A-Za-z0-9._-]{12,}$/.test(_0x3811e9) && !/^\d+$/.test(_0x3811e9)) {
          return "https://www.douyin.com/user/" + _0x3811e9;
        }
      }
    }
    return "";
  }
  function _0x5e9df6(_0x1c0103 = null, _0x42f8f7 = "") {
    try {
      const _0x352a12 = _0x1c0103 || document;
      const _0x1c1f5f = _0x2a1c79(_0x352a12);
      const _0x5dd762 = normalizeAuthorNicknameText(_0x1c1f5f?.innerText || _0x1c1f5f?.textContent || _0x1c1f5f?.getAttribute?.("title") || "");
      if (_0x5dd762) {
        return _0x5dd762;
      }
      const _0x4ea01e = _0x352a12.matches?.("[data-e2e=\"feed-video-nickname\"]") ? _0x352a12 : _0x352a12.querySelector?.("[data-e2e=\"feed-video-nickname\"]");
      const _0x118c71 = normalizeAuthorNicknameText(_0x4ea01e?.innerText || "");
      if (_0x118c71) {
        return _0x118c71;
      }
      const _0x30738e = _0x352a12.querySelector?.(_0xa51a5e()) || _0x352a12;
      const _0x12d054 = [_0x30738e.querySelector?.(".video-info-detail"), _0x30738e.querySelector?.(".account-card-container"), _0x30738e.querySelector?.("[class*=\"video-info\"]"), _0x30738e, _0x352a12].filter(Boolean);
      for (const _0xd4ce4c of _0x12d054) {
        const _0x2a6bd6 = Array.from(_0xd4ce4c.querySelectorAll?.("a[href*=\"/user/\"]") || []).filter(_0x2577db => {
          const _0x466d68 = _0x2577db.href || "";
          if (!_0x466d68.includes("/user/") || _0x466d68.includes("/user/self")) {
            return false;
          }
          return _0x4c529d(_0x2577db);
        });
        for (const _0x3d13dc of _0x2a6bd6) {
          const _0x372ea8 = _0x3d13dc.closest("[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], [class*=\"comment-item\"], [class*=\"reply-item\"]");
          if (_0x372ea8) {
            continue;
          }
          const _0x1e6845 = normalizeAuthorNicknameText(_0x3d13dc.innerText || _0x3d13dc.getAttribute("title") || "");
          if (_0x1e6845) {
            return _0x1e6845;
          }
        }
      }
      const _0x3ac26a = [".account-name", ".author-card-user-name", "[class*=\"author-name\"]", "[class*=\"AccountName\"]", "[data-e2e=\"video-author-name\"]"];
      for (const _0x791adb of _0x3ac26a) {
        const _0x558299 = _0x352a12.querySelector?.(_0x791adb);
        const _0x1f64ab = normalizeAuthorNicknameText(_0x558299?.innerText || "");
        if (_0x1f64ab) {
          return _0x1f64ab;
        }
      }
      try {
        const _0x39e9c4 = _0x2384df(_0x352a12, _0x42f8f7);
        const _0x388d2a = normalizeAuthorNicknameText(_0x39e9c4?.nickname || "");
        if (_0x388d2a) {
          return _0x388d2a;
        }
      } catch (_0x44636a) {}
    } catch (_0x2101e5) {}
    return "";
  }
  function _0x3c5fee(_0x13e0e5 = null, _0x318c7e = "") {
    try {
      const _0x4b6715 = _0x13e0e5 || document;
      const _0x3c7854 = [...new Set([_0x4b6715.querySelector?.(_0xa51a5e()), _0x4b6715.querySelector?.(".video-info-detail"), _0x4b6715.querySelector?.(".account-card-container"), _0x4b6715, ...(_0x13e0e5 ? [] : [document.querySelector?.(_0xa51a5e()), document.querySelector?.(".video-info-detail"), document.querySelector?.(".account-card-container"), document])].filter(Boolean))];
      for (const _0x40107f of _0x3c7854) {
        const _0x49cc89 = _0x3ea897(_0x40107f, _0x318c7e);
        if (_0x49cc89) {
          return _0x49cc89;
        }
      }
      if (!_0x13e0e5) {
        for (const _0x551a92 of _0x3c7854.slice(0, -1)) {
          const _0xad1b34 = _0x3ea897(_0x551a92);
          if (_0xad1b34) {
            return _0xad1b34;
          }
        }
      }
      try {
        const _0x5b0068 = _0x2384df(_0x4b6715, _0x318c7e);
        if (_0x5b0068?.secUid) {
          return "https://www.douyin.com/user/" + _0x5b0068.secUid;
        }
      } catch (_0x3aedd3) {}
    } catch (_0x1a9507) {}
    return "";
  }
  function _0xb53ebb(_0x46e6d3 = null, _0x5ecf31 = "") {
    const _0x493da9 = _0x46e6d3 || document;
    const _0x328f4a = _0x493da9.getAttribute?.("data-e2e") || "";
    const _0x586a36 = FEED_SCOPE_E2E.includes(_0x328f4a);
    const _0x259318 = _0x406d80(_0x493da9);
    let _0x17a31b = _0x259318?.href || "";
    let _0x461b6a = _0x259318?.nickname || "";
    if (_0x586a36 && _0x259318 && _0x461b6a && !_0x17a31b) {
      _0x17a31b = _0x5dfa7b(_0x259318, _0x493da9, _0x5ecf31, _0x461b6a);
    } else if (!_0x586a36 || !_0x259318) {
      if (!_0x17a31b) {
        _0x17a31b = _0x3c5fee(_0x493da9, _0x5ecf31);
      }
      if (!_0x461b6a) {
        _0x461b6a = normalizeAuthorNicknameText(_0x5e9df6(_0x493da9, _0x5ecf31));
      }
    }
    if (_0x17a31b) {
      const _0x195080 = Array.from(document.querySelectorAll?.("a[href*=\"/user/\"]") || []).find(_0x53347b => {
        const _0x3e2d6a = _0x53347b.closest?.("[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], [class*=\"comment-item\"], [class*=\"reply-item\"]");
        if (_0x3e2d6a) {
          return false;
        }
        return _0x529803(_0x53347b.href || _0x53347b.getAttribute?.("href") || "") === _0x17a31b;
      }) || (_0x259318?.href === _0x17a31b ? _0x259318.link : null);
      const _0x161a0f = normalizeAuthorNicknameText(_0x195080?.innerText || _0x195080?.textContent || _0x195080?.getAttribute?.("title") || "");
      if (_0x161a0f) {
        if (!_0x461b6a || normalizeAuthorAccountName(_0x161a0f) === normalizeAuthorAccountName(_0x461b6a)) {
          _0x461b6a = _0x161a0f;
        }
      } else if (!_0x461b6a && (!_0x586a36 || !_0x259318)) {
        try {
          const _0x6c4c7a = _0x2384df(_0x493da9, _0x5ecf31);
          const _0x393446 = _0x6c4c7a?.secUid ? _0x529803("https://www.douyin.com/user/" + _0x6c4c7a.secUid) : "";
          if (_0x393446 === _0x17a31b && _0x6c4c7a?.nickname) {
            _0x461b6a = normalizeAuthorNicknameText(_0x6c4c7a.nickname);
          }
        } catch (_0x46abad) {}
      }
    }
    return {
      nickname: _0x461b6a || "",
      profileUrl: _0x17a31b || "",
      source: _0x259318 ? _0x17a31b && _0x461b6a ? "feed-publisher" : "feed-publisher-partial" : "scoped-fallback"
    };
  }
  return {
    normalizeAuthorNicknameText: normalizeAuthorNicknameText,
    normalizeAuthorAccountName: normalizeAuthorAccountName,
    parseExcludeAuthorAccounts: parseExcludeAuthorAccounts,
    matchExcludedVideoAuthor: matchExcludedVideoAuthor,
    scoreAuthorProfileLink: _0x38df1b,
    findFeedPublisherNearScope: _0x406d80,
    pickBestAuthorProfileLink: _0x2a1c79,
    findDouyinAuthorProfileUrlInRoot: _0x3ea897,
    getVideoAuthorNickname: _0x5e9df6,
    getVideoAuthorProfileUrl: _0x3c5fee,
    getVideoAuthorInfo: _0xb53ebb
  };
}
module.exports = {
  createDouyinVideoAuthorApi: createDouyinVideoAuthorApi,
  normalizeAuthorNicknameText: normalizeAuthorNicknameText,
  normalizeAuthorAccountName: normalizeAuthorAccountName,
  parseExcludeAuthorAccounts: parseExcludeAuthorAccounts,
  matchExcludedVideoAuthor: matchExcludedVideoAuthor
};
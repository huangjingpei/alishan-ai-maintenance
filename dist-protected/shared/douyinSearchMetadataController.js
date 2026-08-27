'use strict';

const {
  sanitizeInlinePageScript
} = require("./sanitizeInlinePageScript");
function createDouyinSearchMetadataController(_0x1ad63d = {}) {
  const {
    PLATFORM_SELECTORS: _0x1ac5e0,
    applyEntryMetaToLead: _0x500454,
    clipTraceText: _0x135641,
    extractSpecificVideoId: _0x53e0c4,
    extractUserIdFromUrl: _0x51dadc,
    extractVideoIdFromHref: _0x4f5eaf,
    getPlannedVideoCountForDisplay: _0x1458f3,
    getProcessedVideoKeyModule: _0x23f441,
    getSearchApiReadyTracker: _0x1f4db8,
    getRuntimeApiHooks: _0x4aa5a8,
    getVideoSearchScrapePolicyModule: _0x1446dd,
    ipcRenderer: _0x179139,
    isVisibleElement: _0x2abf3e,
    loadCreateDouyinVideoAuthorApi: _0x4540b2,
    matchExcludedVideoAuthor: _0x33899b,
    matchTitleKeywordList: _0xc95e85,
    normalizeAuthorAccountName: _0xb7efef,
    normalizeUrl: _0x23218c,
    parseExcludeAuthorAccounts: _0x3deddf,
    parseTitleKeywordList: _0xff42e3,
    reportTraceLog: _0x2c0775,
    sleep: _0xdaa122,
    preloadDir: _0x145e4c,
    state: _0x372fb5
  } = _0x1ad63d;
  const _0x3f7a18 = _0x145e4c;
  function _0x154eba(_0x321dac) {
    if (!_0x321dac) {
      return null;
    }
    let _0x75b48f = null;
    try {
      const _0x3c7b11 = Object.getOwnPropertyNames(_0x321dac);
      _0x75b48f = _0x3c7b11.find(_0x25879c => _0x25879c.startsWith("__reactProps") || _0x25879c.startsWith("__reactFiber"));
    } catch (_0x605eef) {
      return null;
    }
    if (!_0x75b48f) {
      return null;
    }
    const _0x174f24 = _0x321dac[_0x75b48f];
    if (!_0x174f24) {
      return null;
    }
    const _0x3f2c6a = new Set();
    function _0x282372(_0x555c79, _0x55c27e = 0) {
      if (_0x55c27e > 12) {
        return null;
      }
      if (!_0x555c79 || typeof _0x555c79 !== "object") {
        return null;
      }
      if (_0x3f2c6a.has(_0x555c79)) {
        return null;
      }
      _0x3f2c6a.add(_0x555c79);
      for (const _0x1fff61 in _0x555c79) {
        try {
          const _0xb198c0 = _0x555c79[_0x1fff61];
          if (typeof _0xb198c0 === "string" || typeof _0xb198c0 === "number") {
            const _0x1bf3bc = String(_0xb198c0);
            if (/^\d{19}$/.test(_0x1bf3bc)) {
              if (/id|aweme|group|item/i.test(_0x1fff61)) {
                return _0x1bf3bc;
              }
            }
          } else if (typeof _0xb198c0 === "object" && _0xb198c0 !== null) {
            if (_0x1fff61 === "stateNode" || _0x1fff61 === "child" || _0x1fff61 === "sibling" || _0x1fff61 === "return" || _0x1fff61 === "alternate") {
              continue;
            }
            const _0x347cb2 = _0x282372(_0xb198c0, _0x55c27e + 1);
            if (_0x347cb2) {
              return _0x347cb2;
            }
          }
        } catch (_0xa7ff74) {}
      }
      return null;
    }
    return _0x282372(_0x174f24);
  }
  function _0x1dde07(_0x5b6925) {
    let _0x582e98 = _0x154eba(_0x5b6925);
    if (_0x582e98) {
      return _0x582e98;
    }
    const _0x3fffef = _0x5b6925.querySelectorAll("*");
    for (const _0x3c31cc of _0x3fffef) {
      _0x582e98 = _0x154eba(_0x3c31cc);
      if (_0x582e98) {
        return _0x582e98;
      }
    }
    return null;
  }
  function _0x247e4a(_0x4b5c32) {
    const _0x2dc03d = String(_0x4b5c32 || "");
    if (!_0x2dc03d) {
      return "";
    }
    const _0x100222 = _0x2dc03d.match(/\/(?:video|note)\/(\d{15,})/);
    if (_0x100222?.[1]) {
      return _0x100222[1];
    }
    const _0x380747 = _0x2dc03d.match(/[?&](?:modal_id|vid|aweme_id)=(\d{15,})/i);
    if (_0x380747?.[1]) {
      return _0x380747[1];
    }
    const _0x190064 = _0x2dc03d.match(/waterfall[_-]?item[_-]?(\d{15,})/i);
    if (_0x190064?.[1]) {
      return _0x190064[1];
    }
    const _0x43b1c4 = _0x2dc03d.match(/(?:aweme[_-]?id|item[_-]?id|group[_-]?id|modal[_-]?id|vid|aweme|group|item)["'\s:=/%_-]*(\d{15,})/i);
    return _0x43b1c4?.[1] || "";
  }
  function _0x1e8bb2(_0x448483) {
    if (!_0x448483) {
      return "";
    }
    const _0x571387 = "a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id=\"], a[href*=\"aweme_id=\"], a[href*=\"vid=\"]";
    const _0x37e439 = [];
    if (_0x448483.matches?.(_0x571387)) {
      _0x37e439.push(_0x448483);
    }
    _0x37e439.push(...Array.from(_0x448483.querySelectorAll?.(_0x571387) || []));
    for (const _0x18f252 of _0x37e439) {
      const _0x7b45fe = _0x4f5eaf(_0x18f252.href || _0x18f252.getAttribute("href"));
      if (_0x7b45fe) {
        return _0x7b45fe;
      }
    }
    return "";
  }
  function _0x50086b(_0x17a829) {
    if (!_0x17a829) {
      return "";
    }
    const _0x5e00f4 = _0x259eb6 => {
      for (const _0x299006 of Array.from(_0x259eb6.attributes || [])) {
        const _0x36277f = _0x247e4a(_0x299006.value);
        if (_0x36277f) {
          return _0x36277f;
        }
      }
      return "";
    };
    const _0x43a24c = [];
    const _0x436278 = _0x596594 => {
      if (_0x596594 && !_0x43a24c.includes(_0x596594)) {
        _0x43a24c.push(_0x596594);
      }
    };
    _0x436278(_0x17a829);
    _0x436278(_0x17a829.closest?.("[id^=\"waterfall_item_\"]"));
    for (let _0x2595b3 = _0x17a829.parentElement, _0x1f87a4 = 0; _0x2595b3 && _0x1f87a4 < 3; _0x2595b3 = _0x2595b3.parentElement, _0x1f87a4++) {
      _0x436278(_0x2595b3);
    }
    for (const _0x2945e9 of _0x43a24c) {
      const _0x5b9f54 = _0x5e00f4(_0x2945e9);
      if (_0x5b9f54) {
        return _0x5b9f54;
      }
    }
    const _0x3aeb75 = Array.from(_0x17a829.querySelectorAll?.("[href], [data-e2e], [data-id], [data-aweme-id], [data-item-id], [data-log-extra], [data-log], [data-key]") || []).slice(0, 120);
    for (const _0x118692 of _0x3aeb75) {
      const _0x381a01 = _0x5e00f4(_0x118692);
      if (_0x381a01) {
        return _0x381a01;
      }
    }
    return "";
  }
  function _0x107992(_0x1f08fd) {
    if (!_0x1f08fd) {
      return false;
    }
    const _0x144892 = (_0x1f08fd.innerText || _0x1f08fd.textContent || "").replace(/\s+/g, " ").trim();
    if (/相关搜索|大家都在搜|猜你想搜|搜索历史|热搜榜/.test(_0x144892)) {
      return false;
    }
    if (/抖音号\s*[:：]/i.test(_0x144892) || /获赞/.test(_0x144892) && /粉丝/.test(_0x144892)) {
      return false;
    }
    if (_0x1e8bb2(_0x1f08fd)) {
      return true;
    }
    const _0x32a8eb = _0x1f08fd.querySelector?.(".videoImage, [class*=\"videoImage\"], [class*=\"VideoImage\"], [class*=\"cover\"], [class*=\"Cover\"], img, video, canvas");
    if (_0x32a8eb) {
      try {
        const _0x991246 = _0x32a8eb.getBoundingClientRect();
        if (_0x991246.width >= 48 && _0x991246.height >= 48) {
          return true;
        }
      } catch (_0x2e65ef) {
        return true;
      }
    }
    if (/\b\d{1,2}:\d{2}\b/.test(_0x144892) && (/@/.test(_0x144892) || /万|点赞|评论|收藏/.test(_0x144892))) {
      return true;
    }
    return false;
  }
  function _0x51204e(_0xa5c666) {
    const _0x4b0a9a = [];
    const _0x1b6b50 = _0x20b78a => {
      if (_0x20b78a && !_0x4b0a9a.includes(_0x20b78a)) {
        _0x4b0a9a.push(_0x20b78a);
      }
    };
    _0x1b6b50(_0xa5c666);
    _0x1b6b50(_0xa5c666.closest?.("[id^=\"waterfall_item_\"]"));
    for (let _0x3096d7 = _0xa5c666.parentElement, _0x380d31 = 0; _0x3096d7 && _0x380d31 < 3; _0x3096d7 = _0x3096d7.parentElement, _0x380d31++) {
      _0x1b6b50(_0x3096d7);
    }
    for (const _0x5282e7 of _0x4b0a9a) {
      const _0x697774 = _0x1e8bb2(_0x5282e7);
      if (_0x697774) {
        return _0x697774;
      }
    }
    if (!_0x107992(_0xa5c666)) {
      return "";
    }
    for (const _0x249c84 of _0x4b0a9a) {
      const _0x50ecf7 = _0x50086b(_0x249c84);
      if (_0x50ecf7) {
        return _0x50ecf7;
      }
    }
    const _0x2b190f = String(_0xa5c666?.className || "");
    const _0x339636 = /video|aweme|note|cover|search-result|SearchResult/i.test(_0x2b190f) || !!_0xa5c666.querySelector?.("video, [class*=\"video\"], [class*=\"Video\"], [class*=\"aweme\"], [class*=\"Aweme\"], [class*=\"cover\"], [class*=\"Cover\"]");
    if (!_0x339636) {
      return "";
    }
    return _0x1dde07(_0xa5c666) || "";
  }
  function _0x5eacb9(_0x59da6d) {
    const _0x2c151b = ["a[href*=\"/video/\"]", "a[href*=\"/note/\"]", "a[href*=\"modal_id=\"]", "a[href*=\"aweme_id=\"]", "[role=\"link\"]", "video", "[class*=\"videoImage\"]", "[class*=\"VideoImage\"]", "[class*=\"cover\"]", "[class*=\"Cover\"]", "img", "canvas"].join(", ");
    const _0x1c02d7 = Array.from(_0x59da6d.querySelectorAll?.(_0x2c151b) || []).find(_0x2abf3e);
    return _0x1c02d7 || _0x59da6d;
  }
  function _0x486a40() {
    const _0x4cd3de = document.querySelector("main") || document.body;
    if (!_0x4cd3de?.querySelectorAll) {
      return [];
    }
    const _0x5c4d73 = [];
    const _0x4b2a78 = new Set();
    const _0x57bc7e = _0x3f43f6 => {
      if (!_0x3f43f6 || _0x4b2a78.has(_0x3f43f6) || !_0x2abf3e(_0x3f43f6)) {
        return;
      }
      const _0xf009ef = _0x3f43f6.getBoundingClientRect();
      if (_0xf009ef.width < 72 || _0xf009ef.height < 72) {
        return;
      }
      if (_0xf009ef.width > window.innerWidth * 0.92) {
        return;
      }
      if (_0xf009ef.top > window.innerHeight + 160) {
        return;
      }
      _0x4b2a78.add(_0x3f43f6);
      _0x5c4d73.push(_0x3f43f6);
    };
    const _0x596bbc = Array.from(_0x4cd3de.querySelectorAll("img, video, canvas")).filter(_0x2abf3e);
    for (const _0x1a90b6 of _0x596bbc) {
      let _0x4021d7;
      try {
        _0x4021d7 = _0x1a90b6.getBoundingClientRect();
      } catch (_0x4c7910) {
        continue;
      }
      if (_0x4021d7.width < 72 || _0x4021d7.height < 72 || _0x4021d7.width > 720) {
        continue;
      }
      if (_0x4021d7.top > window.innerHeight + 120 || _0x4021d7.bottom < -40) {
        continue;
      }
      let _0x542702 = null;
      let _0x3ab7eb = _0x1a90b6.parentElement;
      for (let _0x2b44c4 = 0; _0x3ab7eb && _0x2b44c4 < 8; _0x3ab7eb = _0x3ab7eb.parentElement, _0x2b44c4 += 1) {
        const _0x33e5dd = new Set(_0xf00b48(_0x3ab7eb, "a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id=\"]").map(_0x3b6b96 => _0x53e0c4(_0x3b6b96.href || _0x3b6b96.getAttribute?.("href") || "")).filter(Boolean));
        if (_0x33e5dd.size > 1) {
          break;
        }
        const _0x36b1ce = _0x1e8bb2(_0x3ab7eb) || _0x50086b(_0x3ab7eb) || (_0x107992(_0x3ab7eb) ? "struct" : "");
        if (!_0x36b1ce) {
          continue;
        }
        _0x542702 = _0x3ab7eb;
        if (_0x3ab7eb.id?.startsWith?.("waterfall_item_") || /search-result|SearchResult|result-card|ResultCard|waterfall|WaterFall/i.test(String(_0x3ab7eb.className || ""))) {
          break;
        }
      }
      if (_0x542702) {
        _0x57bc7e(_0x542702);
      }
    }
    return _0x5c4d73;
  }
  function _0x4901d0() {
    const _0xa5ef02 = document.querySelector("main") || document.body;
    const _0x430016 = [".search-result-card", "[id^=\"waterfall_item_\"]", "[data-e2e=\"search-result-card\"]", "[data-e2e*=\"search-result\"]", "[data-e2e*=\"search_result\"]", "[data-e2e*=\"scroll-list\"] [id*=\"item\"]", "[class*=\"search-result\"]", "[class*=\"SearchResult\"]", "[class*=\"result-card\"]", "[class*=\"ResultCard\"]", "[class*=\"search-card\"]", "[class*=\"SearchCard\"]", "[class*=\"video-card\"]", "[class*=\"VideoCard\"]", "[class*=\"WaterFall\"]", "[class*=\"waterfall\"]", "[class*=\"Waterfall\"]"].join(", ");
    const _0x58cc49 = [".search-result-card", "[id^=\"waterfall_item_\"]", "[data-e2e*=\"search\"]", "[class*=\"search-result\"]", "[class*=\"SearchResult\"]", "[class*=\"search-card\"]", "[class*=\"VideoCard\"]", "[class*=\"waterfall\"]", "[class*=\"WaterFall\"]", "[class*=\"card\"]", "[class*=\"Card\"]", "article", "li"].join(", ");
    const _0x227114 = [];
    const _0x36d79d = new Set();
    const _0x22bb5d = _0x3fcecf => {
      if (!_0x3fcecf || _0x36d79d.has(_0x3fcecf) || !_0x2abf3e(_0x3fcecf)) {
        return;
      }
      const _0x39cf30 = _0x3fcecf.getBoundingClientRect();
      if (_0x39cf30.width < 40 || _0x39cf30.height < 30) {
        return;
      }
      _0x36d79d.add(_0x3fcecf);
      _0x227114.push(_0x3fcecf);
    };
    Array.from(_0xa5ef02.querySelectorAll(_0x430016)).forEach(_0x22bb5d);
    Array.from(_0xa5ef02.querySelectorAll("a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id=\"], a[href*=\"aweme_id=\"], a[href*=\"vid=\"]")).forEach(_0x9c717e => {
      _0x22bb5d(_0x9c717e.closest(_0x58cc49) || _0x9c717e);
    });
    _0x486a40().forEach(_0x22bb5d);
    return _0x227114;
  }
  function _0x51a964(_0x59a21d = _0x372fb5.currentTask) {
    const _0x134b01 = _0x1446dd();
    if (_0x134b01?.getScrapeTargetSet) {
      return _0x134b01.getScrapeTargetSet(_0x59a21d);
    }
    const _0x16b314 = new Set(["comments", "video", "author"]);
    const _0x39b417 = Array.isArray(_0x59a21d?.scrapeTargets) ? _0x59a21d.scrapeTargets.filter(_0x151a42 => _0x16b314.has(_0x151a42)) : [];
    return new Set(_0x39b417.length > 0 ? _0x39b417 : ["comments"]);
  }
  function _0x56315a(_0x37aab4 = _0x372fb5.currentTask) {
    const _0x569dd5 = _0x1446dd();
    if (_0x569dd5?.isLinkOnlyScrapeTask) {
      return _0x569dd5.isLinkOnlyScrapeTask(_0x37aab4);
    }
    if (_0x37aab4?.taskMode !== "scrape") {
      return false;
    }
    const _0x3dfd06 = _0x51a964(_0x37aab4);
    return !_0x3dfd06.has("comments") && (_0x3dfd06.has("video") || _0x3dfd06.has("author"));
  }
  function _0x3c2c98(_0x47db01 = _0x372fb5.currentTask) {
    const _0x7f8b5a = _0x1446dd();
    if (_0x7f8b5a?.hasMinVideoStatFilters) {
      return _0x7f8b5a.hasMinVideoStatFilters(_0x47db01);
    }
    return ["minVideoLike", "minVideoComment", "minVideoCollect", "minVideoShare"].some(_0x3edd85 => (parseInt(_0x47db01?.[_0x3edd85]) || 0) > 0);
  }
  function _0x53c1a9(_0x3aeb5c = _0x372fb5.currentTask) {
    const _0x20b5a8 = _0x1446dd();
    if (_0x20b5a8?.canLinkOnlyScrapeWithoutOpen) {
      return _0x20b5a8.canLinkOnlyScrapeWithoutOpen(_0x3aeb5c);
    }
    return _0x56315a(_0x3aeb5c) && !_0x3c2c98(_0x3aeb5c);
  }
  function _0x3dce06(_0x15a31 = _0x372fb5.currentTask) {
    if (_0x15a31?.taskMode !== "scrape") {
      return false;
    }
    const _0x2c36fd = _0x51a964(_0x15a31);
    return _0x2c36fd.has("video") || _0x2c36fd.has("author");
  }
  const _0x54c321 = new Map();
  let _0x14fc55 = false;
  let _0x549f5b = false;
  function _0x5a0311(_0x35e43d = {}) {
    const _0x33e275 = Array.isArray(_0x35e43d.awemes) ? _0x35e43d.awemes : [];
    if (!_0x33e275.length) {
      return 0;
    }
    let _0x504884 = 0;
    _0x33e275.forEach(_0x3ceb79 => {
      const _0x1eab2b = String(_0x3ceb79?.videoId || "").trim();
      if (!/^\d{5,}$/.test(_0x1eab2b)) {
        return;
      }
      const _0x388235 = _0x54c321.get(_0x1eab2b) || {};
      const _0x1b511 = _0x175ab4(_0x3ceb79.authorUrl || "") || _0x388235.authorUrl || "";
      const _0x7688d9 = String(_0x3ceb79.authorNickname || _0x388235.authorNickname || "").trim().replace(/^@+/, "");
      const _0x51803e = {
        videoId: _0x1eab2b,
        videoUrl: _0x23218c(_0x3ceb79.videoUrl || _0x388235.videoUrl || "") || "https://www.douyin.com/video/" + _0x1eab2b,
        title: String(_0x3ceb79.title || _0x388235.title || "").trim(),
        authorNickname: _0x7688d9,
        authorUrl: _0x1b511,
        createTime: Number(_0x3ceb79.createTime || _0x388235.createTime || 0) || 0,
        updatedAt: Date.now()
      };
      _0x54c321.set(_0x1eab2b, _0x51803e);
      _0x504884 += 1;
    });
    if (_0x54c321.size > 800) {
      const _0x47fa63 = [..._0x54c321.keys()].slice(0, _0x54c321.size - 600);
      _0x47fa63.forEach(_0x6dbed => _0x54c321.delete(_0x6dbed));
    }
    return _0x504884;
  }
  function _0x42f492(_0x4f3e3b) {
    const _0x26c7f6 = _0x53e0c4(_0x4f3e3b) || String(_0x4f3e3b || "").trim();
    if (!_0x26c7f6) {
      return null;
    }
    return _0x54c321.get(_0x26c7f6) || null;
  }
  async function _0x3d7f2d(_0x220d64, _0xe1a31c = 2200) {
    const _0x23dfe3 = Date.now();
    let _0x55fea4 = _0x42f492(_0x220d64);
    if (_0x55fea4?.authorUrl) {
      return _0x55fea4;
    }
    while (Date.now() - _0x23dfe3 < _0xe1a31c) {
      await _0xdaa122(280);
      _0x55fea4 = _0x42f492(_0x220d64);
      if (_0x55fea4?.authorUrl) {
        return _0x55fea4;
      }
    }
    return _0x55fea4;
  }
  function _0x3068d6() {
    if (_0x549f5b) {
      return;
    }
    _0x549f5b = true;
    document.addEventListener("__radar_leadgen_scrape_api", _0x12fcfb => {
      try {
        const _0x24f2eb = _0x12fcfb?.detail || {};
        const _0x5ad9ef = _0x5a0311(_0x24f2eb);
        if (_0x5ad9ef > 0) {
          console.log("[LeadgenScrape][API] +" + _0x5ad9ef + " aweme cache=" + _0x54c321.size);
        }
        try {
          _0x1f4db8().noteApiDetail(_0x24f2eb);
        } catch (_0x103f55) {}
      } catch (_0x510c84) {
        console.warn("[LeadgenScrape][API] bridge error:", _0x510c84?.message || _0x510c84);
      }
    });
  }
  function _0x37071f(_0x1b4837 = "") {
    const _0x4f19d3 = _0x54c321.size;
    _0x54c321.clear();
    if (_0x4f19d3 > 0) {
      console.log("[LeadgenScrape][API] cleared " + _0x4f19d3 + (_0x1b4837 ? " (" + _0x1b4837 + ")" : ""));
    }
  }
  _0x3068d6();
  try {
    _0x179139.on("entity-leadgen-clear-scrape-aweme", (_0x2b3349, _0x38518e = {}) => {
      _0x37071f(_0x38518e?.reason || "entity");
      _0x2ba8c0({
        force: true
      });
    });
  } catch (_0x156d3a) {}
  function _0x2ba8c0(_0x5cbf34 = {}) {
    const _0x4c8c22 = _0x372fb5.currentRunningSource === "search";
    if (!_0x5cbf34.force && !_0x56315a(_0x372fb5.currentTask) && !_0x4c8c22) {
      return false;
    }
    _0x3068d6();
    if (_0x14fc55 || window.__radar_leadgen_scrape_api_hooked) {
      _0x14fc55 = true;
      return true;
    }
    let _0x14e621 = "";
    try {
      const _0x1a67c5 = (() => {
        try {
          return require("path");
        } catch (_0xd9f841) {
          return null;
        }
      })();
      const _0x140451 = ["./shared/leadgenScrapeApiHook", "./shared/leadgenScrapeApiHook.js"];
      if (_0x1a67c5 && typeof _0x3f7a18 === "string") {
        _0x140451.push(_0x1a67c5.join(_0x3f7a18, "shared", "leadgenScrapeApiHook.js"), _0x1a67c5.join(_0x3f7a18, "..", "shared", "leadgenScrapeApiHook.js"));
      }
      for (const _0x2e373a of _0x140451) {
        try {
          const _0x479f46 = require(_0x2e373a);
          if (typeof _0x479f46?.getLeadgenScrapeApiHookInstaller === "function") {
            const _0x101e1f = typeof _0x4aa5a8 === "function" ? _0x4aa5a8() : null;
            _0x14e621 = _0x479f46.getLeadgenScrapeApiHookInstaller(_0x101e1f);
            break;
          }
        } catch (_0x5748bc) {}
      }
    } catch (_0x3baea1) {}
    if (!_0x14e621) {
      console.warn("[LeadgenScrape][API] installer module missing");
      return false;
    }
    try {
      const _0x271fe2 = document.createElement("script");
      _0x271fe2.textContent = sanitizeInlinePageScript(_0x14e621);
      (document.documentElement || document.head || document.body).appendChild(_0x271fe2);
      _0x271fe2.remove();
      _0x14fc55 = true;
      console.log("[LeadgenScrape][API] hook installed");
      return true;
    } catch (_0x354b72) {
      console.warn("[LeadgenScrape][API] inject failed:", _0x354b72?.message || _0x354b72);
      return false;
    }
  }
  function _0x2daf52(_0x13508e, _0x208084) {
    const _0x560ea1 = _0x56315a(_0x372fb5.currentTask) ? _0x42f492(_0x208084) : null;
    let _0x20ea1b = _0x560ea1?.authorUrl || "";
    let _0x3e7b12 = _0x560ea1?.authorNickname || "";
    let _0xbcb762 = _0x560ea1?.title || "";
    if (!_0x20ea1b) {
      _0x20ea1b = _0x85711f(_0x13508e);
    }
    if (!_0x3e7b12) {
      _0x3e7b12 = _0x42cb4c(_0x13508e, _0x20ea1b);
    }
    if (!_0xbcb762) {
      _0xbcb762 = _0x399aa9(_0x13508e, _0x3e7b12);
    }
    _0xbcb762 = String(_0xbcb762 || "").trim() || "未知视频";
    const _0x45cbb2 = _0x23218c(_0x560ea1?.videoUrl || _0x208084 || "") || _0x208084;
    return {
      videoUrl: _0x45cbb2,
      authorUrl: _0x20ea1b,
      authorNickname: _0x3e7b12,
      title: _0xbcb762,
      fromApi: !!_0x560ea1
    };
  }
  function _0x420610() {
    return Array.from(_0x54c321.values());
  }
  async function _0xabebb({
    videoUrl: _0x2518a5,
    title = "未知视频",
    authorNickname = "",
    authorUrl = "",
    source = "api_json",
    likedBoundaryUrls = null
  } = {}) {
    let _0x1ede99 = _0x23218c(_0x2518a5 || "") || String(_0x2518a5 || "").trim();
    if (!_0x1ede99) {
      return {
        emitted: false,
        reason: "no_url"
      };
    }
    const _0x41741e = _0x51a964(_0x372fb5.currentTask);
    const _0x279697 = _0x41741e.has("author");
    if (_0x372fb5.sessionProcessedCount >= _0x1458f3(_0x372fb5.currentRunningSource, _0x372fb5.currentTask)) {
      return {
        emitted: false,
        reason: "target_reached"
      };
    }
    if (Array.isArray(likedBoundaryUrls) && likedBoundaryUrls.length > 0) {
      const _0x3e12fc = likedBoundaryUrls.some(_0x12dc99 => {
        const _0x324e88 = _0x53e0c4(_0x12dc99);
        const _0x4eb22c = _0x53e0c4(_0x1ede99);
        return _0x324e88 && _0x4eb22c && _0x324e88 === _0x4eb22c || _0x23218c(_0x12dc99) === _0x1ede99;
      });
      if (!_0x3e12fc) {
        return {
          emitted: false,
          reason: "outside_like_boundary"
        };
      }
    }
    let _0x2fb218 = _0x42f492(_0x1ede99);
    if (_0x279697 && !_0x175ab4(_0x2fb218?.authorUrl || authorUrl || "")) {
      _0x2fb218 = await _0x3d7f2d(_0x1ede99, 2200);
    }
    let _0xe10b16 = String(_0x2fb218?.title || title || "").trim() || "未知视频";
    let _0x50d125 = String(_0x2fb218?.authorNickname || authorNickname || "").trim().replace(/^@+/, "");
    let _0x224e8a = _0x175ab4(_0x2fb218?.authorUrl || authorUrl || "");
    if (_0x2fb218?.videoUrl) {
      _0x1ede99 = _0x23218c(_0x2fb218.videoUrl) || _0x1ede99;
    }
    const _0x2ec97d = _0x3deddf(_0x372fb5.currentTask.excludeAuthorAccounts);
    const _0x989ff = _0xff42e3(_0x372fb5.currentTask.excludeTitleKeywords);
    const _0x1560a9 = _0xff42e3(_0x372fb5.currentTask.includeTitleKeywords);
    const _0x84f195 = _0xc95e85(_0xe10b16, _0x989ff);
    if (_0x84f195) {
      _0x23f441().rememberProcessedVideoKey(_0x372fb5.processedVideos, _0x1ede99);
      return {
        emitted: false,
        reason: "exclude_title"
      };
    }
    if (_0x1560a9.length > 0) {
      const _0x585973 = _0xc95e85(_0xe10b16, _0x1560a9);
      if (!_0x585973) {
        _0x23f441().rememberProcessedVideoKey(_0x372fb5.processedVideos, _0x1ede99);
        return {
          emitted: false,
          reason: "include_title"
        };
      }
    }
    const _0x177995 = _0x33899b(_0x50d125, _0x2ec97d);
    if (_0x177995.excluded) {
      _0x23f441().rememberProcessedVideoKey(_0x372fb5.processedVideos, _0x1ede99);
      return {
        emitted: false,
        reason: "exclude_author"
      };
    }
    if (_0x279697 && !_0x224e8a) {
      console.log("[LeadgenScrape] skip missing_author id=" + (_0x53e0c4(_0x1ede99) || "?") + " nick=" + (_0x50d125 || "-"));
      return {
        emitted: false,
        reason: "missing_author"
      };
    }
    if (_0x279697 && (!_0x50d125 || _0x50d125 === "未知作者")) {
      return {
        emitted: false,
        reason: "missing_author"
      };
    }
    const _0x429557 = await _0x179139.invoke("claim-processed-video", {
      url: _0x1ede99,
      title: _0xe10b16,
      authorUrl: _0x224e8a,
      authorNickname: _0x50d125,
      platform: "douyin"
    });
    if (!_0x429557?.claimed) {
      _0x23f441().rememberProcessedVideoKey(_0x372fb5.processedVideos, _0x1ede99);
      return {
        emitted: false,
        reason: _0x429557?.reason === "already_processed" ? "processed" : "claimed_elsewhere"
      };
    }
    const _0x3faba5 = _0x29e9ce({
      videoUrl: _0x1ede99,
      title: _0xe10b16,
      authorNickname: _0x50d125 || "未知作者",
      authorUrl: _0x224e8a,
      source: _0x2fb218 ? "api_json" : source
    });
    if (!_0x80e5bc(_0x3faba5)) {
      return {
        emitted: false,
        reason: "emit_rejected"
      };
    }
    const _0x3bde78 = _0x23f441().normalizeProcessedVideoKey(_0x1ede99) || _0x1ede99;
    _0x23f441().rememberProcessedVideoKey(_0x372fb5.processedVideos, _0x3bde78);
    _0x179139.send("update-processed-videos", {
      url: _0x3bde78,
      title: _0xe10b16,
      authorNickname: _0x50d125,
      authorUrl: _0x224e8a,
      platform: "douyin",
      timestamp: Date.now()
    });
    _0x372fb5.sessionProcessedCount += 1;
    _0x179139.send("automation-data", {
      type: "video-processed",
      payload: {
        accountId: window._radar_account_id,
        accountName: window._radar_account_name,
        sessionCount: _0x372fb5.sessionProcessedCount,
        targetCount: _0x1458f3(_0x372fb5.currentRunningSource, _0x372fb5.currentTask)
      }
    });
    console.log("[LeadgenScrape] emit ok id=" + (_0x53e0c4(_0x3bde78) || "?") + " author=" + (_0x50d125 || "-") + " hasProfile=" + !!_0x224e8a);
    return {
      emitted: true,
      reason: "ok",
      videoUrl: _0x3bde78,
      authorUrl: _0x224e8a
    };
  }
  function _0x2b662b(_0x4a137d) {
    const _0x5dcf68 = String(_0x4a137d || "").trim();
    if (!_0x5dcf68) {
      return "";
    }
    try {
      const _0x542795 = new URL(_0x5dcf68, window.location.origin);
      if (_0x542795.hostname.endsWith("douyin.com")) {
        return _0x542795.href;
      } else {
        return "";
      }
    } catch (_0x270fe7) {
      return "";
    }
  }
  function _0xf00b48(_0x2b7250, _0x5df374) {
    if (!_0x2b7250 || !_0x5df374) {
      return [];
    }
    const _0x5e1e67 = [];
    if (_0x2b7250.matches?.(_0x5df374)) {
      _0x5e1e67.push(_0x2b7250);
    }
    _0x5e1e67.push(...Array.from(_0x2b7250.querySelectorAll?.(_0x5df374) || []));
    return _0x5e1e67;
  }
  function _0x175ab4(_0x16b315) {
    const _0x86244e = _0x2b662b(String(_0x16b315 || "").replace(/&amp;/g, "&"));
    const _0x578ede = _0x51dadc(_0x86244e);
    if (_0x578ede) {
      return "https://www.douyin.com/user/" + _0x578ede;
    } else {
      return "";
    }
  }
  function _0x3745d2(_0x215ae6, _0x40b603 = "", _0x1fd32d = {}) {
    if (!_0x215ae6) {
      return null;
    }
    const _0x1f146f = [];
    if (_0x215ae6 === document || _0x215ae6 === document.body) {
      _0x1f146f.push(document.querySelector("[data-e2e=\"feed-active-video\"]"), document.querySelector(".video-info-detail"), document.querySelector(".xgplayer-container"), document.querySelector(".search-result-card .videoImage"), document.querySelector(".search-result-card a"), document.querySelector(".search-result-card"));
    } else if (typeof _0x215ae6.querySelector === "function") {
      _0x1f146f.push(_0x215ae6.querySelector("[data-e2e=\"feed-video-nickname\"]"), _0x215ae6.querySelector("[data-e2e*=\"author\"]"), _0x215ae6.querySelector("[data-e2e*=\"user-name\"]"), _0x215ae6.querySelector(".author-card-user-name"), _0x215ae6.querySelector("[class*=\"author-name\"]"), _0x215ae6.querySelector("[class*=\"AuthorName\"]"), _0x215ae6.querySelector("span.E3Qz9sDw"), _0x215ae6.querySelector(".videoImage"), _0x215ae6.querySelector("a[href*=\"/user/\"]"), _0x215ae6.querySelector("a[href*=\"/video/\"]"), _0x215ae6.querySelector("a[href*=\"/note/\"]"), _0x215ae6.querySelector("img"), _0x215ae6);
    } else {
      _0x1f146f.push(_0x215ae6);
    }
    let _0x5ee076 = null;
    let _0x1e9059 = null;
    for (const _0x34b87b of _0x1f146f.filter(Boolean)) {
      const _0x1b78ff = Object.keys(_0x34b87b).find(_0x467a8f => _0x467a8f.startsWith("__reactFiber$") || _0x467a8f.startsWith("__reactProps$"));
      if (_0x1b78ff) {
        _0x5ee076 = _0x34b87b;
        _0x1e9059 = _0x1b78ff;
        break;
      }
    }
    if (!_0x5ee076 || !_0x1e9059) {
      return null;
    }
    const _0xac188b = Math.max(1, Number(_0x1fd32d.maxSteps) || 20);
    const _0x40a78a = !!_0x1fd32d.shallowOnly;
    let _0x8b520c = _0x5ee076[_0x1e9059];
    let _0x55653a = 0;
    while (_0x8b520c && _0x55653a < _0xac188b) {
      const _0x413fea = [_0x8b520c.pendingProps, _0x8b520c.memoizedProps].filter(Boolean);
      for (const _0x4c027c of _0x413fea) {
        const _0x454d43 = (_0x40a78a ? [_0x4c027c.authorInfo, _0x4c027c.author, _0x4c027c.user] : [_0x4c027c.awemeInfo, _0x4c027c.aweme, _0x4c027c.data, _0x4c027c.logParams?.awemeInfo, _0x4c027c.activeAweme, _0x4c027c.currentAweme]).filter(Boolean);
        for (const _0x29df1c of _0x454d43) {
          if (!_0x40a78a) {
            try {
              const _0x55d6c8 = _0x53e0c4(_0x40b603) || _0x53e0c4(window.location.href);
              const _0x5c72c6 = _0x29df1c.awemeId || _0x29df1c.aweme_id || _0x29df1c.id || _0x29df1c.gid || _0x29df1c.itemId || _0x29df1c.item_id;
              if (_0x55d6c8) {
                if (!_0x5c72c6 || String(_0x5c72c6) !== String(_0x55d6c8)) {
                  continue;
                }
              } else {
                continue;
              }
            } catch (_0x21382f) {
              continue;
            }
          }
          const _0x128cf7 = _0x29df1c.authorInfo;
          if (_0x128cf7) {
            const _0x648658 = _0x128cf7.secUid || _0x128cf7.sec_uid;
            const _0x453e7c = _0x128cf7.nickname || _0x128cf7.nickName;
            if (_0x648658 && typeof _0x648658 === "string" && _0x648658.length > 15 && _0x453e7c) {
              return {
                secUid: _0x648658,
                nickname: String(_0x453e7c).trim()
              };
            }
          }
          const _0x271980 = _0x29df1c.author || _0x29df1c;
          const _0x4c8e49 = _0x271980.secUid || _0x271980.sec_uid;
          const _0x276c1e = _0x271980.nickname || _0x271980.nickName;
          if (_0x4c8e49 && typeof _0x4c8e49 === "string" && _0x4c8e49.length > 15 && _0x276c1e) {
            return {
              secUid: _0x4c8e49,
              nickname: String(_0x276c1e).trim()
            };
          }
        }
        if (_0x40a78a) {
          const _0x1d3100 = _0x4c027c.authorInfo || _0x4c027c.author || _0x4c027c.user;
          if (_0x1d3100) {
            const _0x4290ea = _0x1d3100.secUid || _0x1d3100.sec_uid;
            const _0x500780 = _0x1d3100.nickname || _0x1d3100.nickName;
            if (_0x4290ea && typeof _0x4290ea === "string" && _0x4290ea.length > 15) {
              return {
                secUid: _0x4290ea,
                nickname: _0x500780 ? String(_0x500780).trim() : ""
              };
            }
          }
          if (_0x4c027c.secUid && typeof _0x4c027c.secUid === "string" && _0x4c027c.secUid.length > 15) {
            return {
              secUid: _0x4c027c.secUid,
              nickname: _0x4c027c.nickname || _0x4c027c.nickName || ""
            };
          }
          if (_0x4c027c.sec_uid && typeof _0x4c027c.sec_uid === "string" && _0x4c027c.sec_uid.length > 15) {
            return {
              secUid: _0x4c027c.sec_uid,
              nickname: _0x4c027c.nickname || _0x4c027c.nickName || ""
            };
          }
        }
      }
      _0x8b520c = _0x8b520c.return;
      _0x55653a++;
    }
    return null;
  }
  function _0x308250(_0x396aff) {
    try {
      const _0x520812 = _0x3745d2(_0x396aff);
      if (_0x520812) {
        return _0x520812.secUid;
      } else {
        return "";
      }
    } catch (_0x21240b) {
      console.error("[Automation-Preload] extractSecUidFromReactFiber failed:", _0x21240b);
      return "";
    }
  }
  let _0x489930 = null;
  function _0x3b4ec0() {
    if (_0x489930) {
      return _0x489930;
    }
    const _0x51516d = _0x4540b2();
    if (typeof _0x51516d !== "function") {
      throw new Error("douyinVideoAuthorCapture 未加载：请确认 automation 视图已关闭 sandbox，且 shared/douyinVideoAuthorCapture.js 存在");
    }
    _0x489930 = _0x51516d({
      isVisibleElement: _0x3f73d9 => _0x2abf3e(_0x3f73d9),
      extractAuthorFromReactFiber: (_0x5e1092, _0x326eda, _0x15e939) => _0x3745d2(_0x5e1092, _0x326eda, _0x15e939),
      normalizeDouyinAuthorProfileUrl: _0x1eb8e0 => _0x175ab4(_0x1eb8e0),
      getElementsIncludingRoot: (_0x800c72, _0x5a805e) => _0xf00b48(_0x800c72, _0x5a805e),
      extractSpecificVideoId: _0x24c5e2 => _0x53e0c4(_0x24c5e2),
      getModalContainerSelector: () => _0x1ac5e0["douyin.com"].modalContainer
    });
    return _0x489930;
  }
  function _0x20151b(_0x121867) {
    return _0x3b4ec0().normalizeAuthorNicknameText(_0x121867);
  }
  function _0x4ec3a6(_0x18c7aa, _0x30c64c = document) {
    return _0x3b4ec0().scoreAuthorProfileLink(_0x18c7aa, _0x30c64c);
  }
  function _0x571d1a(_0x283371) {
    return _0x3b4ec0().findFeedPublisherNearScope(_0x283371);
  }
  function _0x24ae69(_0x3a2807) {
    return _0x3b4ec0().pickBestAuthorProfileLink(_0x3a2807);
  }
  function _0x2fedc8(_0x2559eb, _0x30e1d9 = "") {
    return _0x3b4ec0().findDouyinAuthorProfileUrlInRoot(_0x2559eb, _0x30e1d9);
  }
  function _0x15bf31(_0x58c361) {
    if (!_0x58c361) {
      return null;
    }
    const _0x5ea424 = [".search-result-card", "[id^=\"waterfall_item_\"]", "[data-e2e*=\"search-result\"]", "[data-e2e*=\"search_result\"]", "[class*=\"search-result\"]", "[class*=\"SearchResult\"]", "[class*=\"result-card\"]", "[class*=\"ResultCard\"]", "[class*=\"search-card\"]", "[class*=\"VideoCard\"]", "[class*=\"waterfall\"]", "[class*=\"WaterFall\"]", "article", "li"].join(", ");
    let _0x5c5946 = _0x58c361;
    let _0x52f744 = -1;
    for (let _0x464b56 = _0x58c361, _0x42cbc5 = 0; _0x464b56 && _0x42cbc5 < 9; _0x464b56 = _0x464b56.parentElement, _0x42cbc5 += 1) {
      const _0x356c56 = _0x464b56.getBoundingClientRect?.();
      if (_0x42cbc5 > 0 && _0x356c56 && (_0x356c56.width > window.innerWidth * 0.96 || _0x356c56.height > window.innerHeight * 1.6)) {
        break;
      }
      const _0x32f2a8 = _0xf00b48(_0x464b56, "a[href*=\"/video/\"], a[href*=\"/note/\"]");
      const _0x27bce9 = new Set(_0x32f2a8.map(_0x56f129 => _0x53e0c4(_0x56f129.href || _0x56f129.getAttribute?.("href") || "")).filter(Boolean));
      if (_0x27bce9.size > 1) {
        break;
      }
      const _0xec038c = String(_0x464b56.innerText || _0x464b56.textContent || "").replace(/\s+/g, " ").trim();
      const _0x1b4a7b = !!_0x2fedc8(_0x464b56);
      const _0xd7550c = !!_0x464b56.querySelector?.(".author-card-user-name, [data-e2e*=\"author\"], [data-e2e*=\"user-name\"], [class*=\"author-name\"], [class*=\"AuthorName\"], [class*=\"nickname\"]");
      const _0x729827 = !!_0x464b56.querySelector?.("img[alt]:not([alt=\"\"]), [title]:not([title=\"\"]), [aria-label]:not([aria-label=\"\"])");
      const _0x2c5cf2 = !!_0x464b56.matches?.(_0x5ea424);
      const _0x47b0b4 = (_0x1b4a7b ? 100 : 0) + (_0xd7550c ? 30 : 0) + (_0x2c5cf2 ? 12 : 0) + (_0x729827 ? 6 : 0) + (_0xec038c.length >= 2 ? 4 : 0) + (_0x27bce9.size === 1 ? 8 : 0) + _0x42cbc5;
      if (_0x47b0b4 >= _0x52f744) {
        _0x5c5946 = _0x464b56;
        _0x52f744 = _0x47b0b4;
      }
    }
    return _0x5c5946;
  }
  function _0x5a1b80(_0x4a6b27) {
    if (!_0x4a6b27) {
      return "";
    }
    const _0x21c633 = _0xf00b48(_0x4a6b27, "a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id=\"], a[href*=\"aweme_id=\"]").find(_0x7883fb => {
      const _0x39bfaa = _0x7883fb.href || _0x7883fb.getAttribute?.("href") || "";
      return !!_0x53e0c4(_0x39bfaa) || /\/(?:video|note)\//.test(_0x39bfaa);
    });
    const _0x134b7e = _0x21c633?.href || _0x21c633?.getAttribute?.("href") || "";
    return _0x23218c(_0x134b7e) || _0x134b7e || "";
  }
  function _0x85711f(_0x111709) {
    if (!_0x111709) {
      return "";
    }
    const _0x3f9574 = _0x5a1b80(_0x111709);
    const _0xcb430 = _0x2fedc8(_0x111709, _0x3f9574);
    if (_0xcb430) {
      return _0xcb430;
    }
    try {
      const _0x359cf1 = _0x3745d2(_0x111709, _0x3f9574);
      if (_0x359cf1?.secUid) {
        return "https://www.douyin.com/user/" + _0x359cf1.secUid;
      }
    } catch (_0x1f6a29) {}
    return "";
  }
  function _0x42cb4c(_0x1e6d6e, _0x143544 = "") {
    if (!_0x1e6d6e) {
      return "";
    }
    const _0x432be7 = _0x175ab4(_0x143544);
    const _0x22ee11 = Array.from(_0x1e6d6e.querySelectorAll?.("a[href*=\"/user/\"]") || []).find(_0x3232dd => _0x175ab4(_0x3232dd.href || _0x3232dd.getAttribute?.("href")) === _0x432be7) || (_0x432be7 ? null : _0x1e6d6e.querySelector?.("a[href*=\"/user/\"]"));
    const _0x37ef45 = _0x3ad472 => {
      const _0x5f15fe = String(_0x3ad472?.innerText || _0x3ad472?.textContent || _0x3ad472?.getAttribute?.("title") || "").replace(/\s+/g, " ").trim().replace(/^@+/, "");
      if (_0x5f15fe && _0x5f15fe.length <= 50 && !/^(关注|粉丝|获赞|私信)$/.test(_0x5f15fe)) {
        return _0x5f15fe;
      } else {
        return "";
      }
    };
    if (_0x432be7) {
      const _0x4bd80f = _0x37ef45(_0x22ee11);
      if (_0x4bd80f) {
        return _0x4bd80f;
      }
      try {
        const _0x490971 = _0x3745d2(_0x1e6d6e, _0x5a1b80(_0x1e6d6e));
        const _0xb46247 = _0x490971?.secUid ? _0x175ab4("https://www.douyin.com/user/" + _0x490971.secUid) : "";
        if (_0xb46247 === _0x432be7 && _0x490971?.nickname) {
          return String(_0x490971.nickname).trim().replace(/^@+/, "");
        }
      } catch (_0x2600ca) {}
      return "";
    }
    const _0x59452b = [_0x22ee11, _0x1e6d6e.querySelector?.(".author-card-user-name"), _0x1e6d6e.querySelector?.("[data-e2e=\"feed-video-nickname\"]"), _0x1e6d6e.querySelector?.("[data-e2e*=\"user-name\"]"), _0x1e6d6e.querySelector?.("[data-e2e*=\"author\"]"), _0x1e6d6e.querySelector?.("[class*=\"author-name\"]"), _0x1e6d6e.querySelector?.("[class*=\"AuthorName\"]"), _0x1e6d6e.querySelector?.("[class*=\"nickname\"]")].filter(Boolean);
    for (const _0x506e14 of _0x59452b) {
      const _0x577f9d = _0x506e14.closest?.("[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], [class*=\"comment-item\"], [class*=\"reply-item\"]");
      if (_0x577f9d) {
        continue;
      }
      const _0x2442e6 = _0x37ef45(_0x506e14);
      if (_0x2442e6) {
        return _0x2442e6;
      }
    }
    try {
      const _0x78b5a7 = _0x3745d2(_0x1e6d6e, _0x5a1b80(_0x1e6d6e));
      if (_0x78b5a7?.nickname) {
        return _0x78b5a7.nickname;
      }
    } catch (_0x2c6e6a) {}
    const _0x1c53e0 = String(_0x1e6d6e.innerText || _0x1e6d6e.textContent || "").split(/\n+/).map(_0x44ca9c => _0x44ca9c.trim()).find(_0x4ffd29 => /^@[^\s]{1,40}/.test(_0x4ffd29));
    if (_0x1c53e0) {
      return _0x1c53e0.replace(/^@/, "").split(/\s+/)[0];
    } else {
      return "";
    }
  }
  function _0x399aa9(_0xa5e0fe, _0x7189f = "") {
    if (!_0xa5e0fe) {
      return "";
    }
    const _0x15fb8f = ["[data-e2e=\"video-desc\"]", "[data-e2e=\"note-desc\"]", "[data-e2e*=\"note-title\"]", "[data-e2e*=\"note-desc\"]", "[data-e2e*=\"video-title\"]", "[data-e2e*=\"search-card-desc\"]", "[data-e2e*=\"search-result-card-desc\"]", "[class*=\"video-title\"]", "[class*=\"VideoTitle\"]", "[class*=\"note-title\"]", "[class*=\"NoteTitle\"]", "[class*=\"note-desc\"]", "[class*=\"NoteDesc\"]", "[class*=\"desc\"]", "[class*=\"Desc\"]", "[class*=\"title\"]", "[class*=\"Title\"]", "h1", "h2", "h3"];
    const _0xe3fa3 = _0x4163f8 => {
      const _0x5083eb = String(_0x4163f8 || "").replace(/\s+/g, " ").trim();
      if (!_0x5083eb || _0x5083eb.length < 2 || _0x5083eb.length > 240) {
        return "";
      }
      if (/^(图片|图文|笔记|封面|视频|播放|查看详情|点击查看|抖音|关注|点赞|评论|收藏|分享)$/i.test(_0x5083eb)) {
        return "";
      }
      if (/^https?:\/\//i.test(_0x5083eb) || /^\d+(?:\.\d+)?[万wkW]?$/.test(_0x5083eb) || /^\d{1,2}:\d{2}$/.test(_0x5083eb)) {
        return "";
      }
      if (_0x7189f && _0xb7efef(_0x5083eb) === _0xb7efef(_0x7189f)) {
        return "";
      }
      return _0x5083eb.slice(0, 100);
    };
    for (const _0x3c3227 of _0x15fb8f) {
      const _0x97cf5a = Array.from(_0xa5e0fe.querySelectorAll?.(_0x3c3227) || []);
      for (const _0x4cfaa8 of _0x97cf5a) {
        const _0x48dbf8 = _0xe3fa3(_0x4cfaa8.innerText || _0x4cfaa8.textContent || "");
        if (_0x48dbf8) {
          return _0x48dbf8;
        }
      }
    }
    const _0x14de63 = [_0xa5e0fe, ...Array.from(_0xa5e0fe.querySelectorAll?.("a[title], a[aria-label], img[alt], [title], [aria-label]") || [])];
    for (const _0xe3ee5 of _0x14de63) {
      for (const _0x5cb541 of ["title", "aria-label", "alt"]) {
        const _0x144bfa = _0xe3fa3(_0xe3ee5?.getAttribute?.(_0x5cb541));
        if (_0x144bfa) {
          return _0x144bfa;
        }
      }
    }
    const _0x2d4ab7 = String(_0xa5e0fe.innerText || _0xa5e0fe.textContent || "").split(/\n+/).map(_0x5ae929 => _0x5ae929.replace(/\s+/g, " ").trim()).find(_0x15bac0 => !_0x15bac0.startsWith("@") && _0xe3fa3(_0x15bac0));
    return _0xe3fa3(_0x2d4ab7);
  }
  function _0x29e9ce({
    videoUrl: _0x460d5f,
    title: _0x427dd2,
    authorNickname: _0x23e58b,
    authorUrl: _0x2595ef,
    source = "search_card"
  } = {}) {
    const _0x1c9033 = _0x23218c(_0x460d5f || "");
    const _0x329599 = _0x53e0c4(_0x1c9033) || String(_0x1c9033).replace(/\W+/g, "").slice(-40) || String(Date.now());
    const _0x130f8a = _0x51a964(_0x372fb5.currentTask);
    const _0x3cf4fa = Date.now();
    const _0xfd6393 = {
      platform: "DY",
      leadKind: "video_card",
      leadId: "video:" + _0x329599,
      key: "video:" + _0x329599,
      type: "LEAD",
      title: String(_0x427dd2 || "未知视频").trim() || "未知视频",
      nickname: String(_0x23e58b || "未知作者").trim() || "未知作者",
      content: "",
      timeText: "卡片采集",
      url: _0x1c9033,
      videoUrl: _0x1c9033,
      userUrl: _0x130f8a.has("author") ? String(_0x2595ef || "").trim() : "",
      authorProfileUrl: _0x130f8a.has("author") ? String(_0x2595ef || "").trim() : "",
      timestamp: _0x3cf4fa,
      capturedAt: new Date(_0x3cf4fa).toISOString(),
      isHighIntention: false,
      thought: source === "search_card" ? "仅采集：从搜索结果卡片获取视频与作者信息，未展开评论区" : "仅采集：记录当前视频与作者信息，未展开评论区",
      accountId: _0x372fb5.currentTask?.accountId || "default",
      accountName: window._radar_account_name || _0x372fb5.currentTask?.nickname || _0x372fb5.currentTask?.name || "默认账号",
      taskName: _0x372fb5.currentTask?.taskName || "未命名任务",
      actions: {
        liked: false,
        replied: false
      },
      collectedFields: [..._0x130f8a]
    };
    _0x500454(_0xfd6393);
    return _0xfd6393;
  }
  function _0x80e5bc(_0x26d7fc) {
    if (!_0x26d7fc?.videoUrl) {
      return false;
    }
    const _0x17f5bf = new Set(Array.isArray(_0x26d7fc.collectedFields) && _0x26d7fc.collectedFields.length ? _0x26d7fc.collectedFields : [..._0x51a964(_0x372fb5.currentTask)]);
    if (_0x17f5bf.has("author")) {
      const _0x19ef91 = _0x175ab4(_0x26d7fc.authorProfileUrl || _0x26d7fc.userUrl || "");
      const _0x53ddda = String(_0x26d7fc.nickname || _0x26d7fc.authorNickname || "").trim();
      if (!_0x19ef91 || !_0x53ddda || _0x53ddda === "未知作者") {
        return false;
      }
    }
    if (_0x17f5bf.has("video") && !_0x26d7fc.videoUrl && !_0x26d7fc.url) {
      return false;
    }
    _0x179139.send("automation-data", {
      type: "comment",
      payload: [_0x26d7fc],
      taskId: _0x372fb5.activeLoopId,
      viewKey: _0x372fb5.currentTask?.viewKey,
      isAiMode: false
    });
    return true;
  }
  function _0x282c29(_0x4b0bd1, _0x8821f9 = 8) {
    return Array.from(document.querySelectorAll(_0x4b0bd1)).filter(_0x2abf3e).slice(0, _0x8821f9).map(_0x28cc16 => {
      const _0x1dd04d = _0x28cc16.getBoundingClientRect();
      return {
        tag: _0x28cc16.tagName,
        text: _0x135641((_0x28cc16.innerText || _0x28cc16.textContent || "").replace(/\s+/g, " "), 120),
        href: _0x135641(_0x28cc16.href || _0x28cc16.getAttribute?.("href") || "", 180),
        className: _0x135641(String(_0x28cc16.className || ""), 120),
        dataE2e: _0x135641(_0x28cc16.getAttribute?.("data-e2e") || "", 80),
        rect: Math.round(_0x1dd04d.width) + "x" + Math.round(_0x1dd04d.height) + "@" + Math.round(_0x1dd04d.left) + "," + Math.round(_0x1dd04d.top)
      };
    });
  }
  function _0x1abdb5() {
    const _0x1e3c06 = {
      videoLinks: "a[href*=\"/video/\"]",
      noteLinks: "a[href*=\"/note/\"]",
      modalLinks: "a[href*=\"modal_id=\"]",
      awemeLinks: "a[href*=\"aweme_id=\"]",
      vidLinks: "a[href*=\"vid=\"]",
      allLinks: "a[href]",
      searchResultCards: ".search-result-card",
      dataSearch: "[data-e2e*=\"search\"], [data-e2e*=\"search_result\"], [data-e2e*=\"search-result\"]",
      classSearch: "[class*=\"search\"], [class*=\"Search\"]",
      classCard: "[class*=\"card\"], [class*=\"Card\"]",
      classVideo: "[class*=\"video\"], [class*=\"Video\"]",
      roleLinks: "[role=\"link\"]"
    };
    const _0x100f11 = {};
    for (const [_0x3eae22, _0x23ffda] of Object.entries(_0x1e3c06)) {
      const _0x245ac6 = Array.from(document.querySelectorAll(_0x23ffda));
      _0x100f11[_0x3eae22] = {
        total: _0x245ac6.length,
        visible: _0x245ac6.filter(_0x2abf3e).length
      };
    }
    return _0x100f11;
  }
  function _0x59fa93(_0x3a454c = 12) {
    const _0x584a64 = Array.from(document.querySelectorAll("[class], [data-e2e], article, li")).filter(_0x2abf3e).filter(_0x218083 => {
      const _0x23af09 = _0x218083.tagName + " " + (_0x218083.className || "") + " " + (_0x218083.getAttribute?.("data-e2e") || "") + " " + (_0x218083.innerText || _0x218083.textContent || "").slice(0, 80);
      return /search|result|card|video|note|aweme|cover|waterfall|feed|content|综合|视频/i.test(_0x23af09);
    }).slice(0, _0x3a454c);
    return _0x584a64.map(_0x3952d1 => {
      const _0x5177f3 = _0x3952d1.getBoundingClientRect();
      return {
        tag: _0x3952d1.tagName,
        className: _0x135641(String(_0x3952d1.className || ""), 140),
        dataE2e: _0x135641(_0x3952d1.getAttribute?.("data-e2e") || "", 80),
        text: _0x135641((_0x3952d1.innerText || _0x3952d1.textContent || "").replace(/\s+/g, " "), 140),
        rect: Math.round(_0x5177f3.width) + "x" + Math.round(_0x5177f3.height) + "@" + Math.round(_0x5177f3.left) + "," + Math.round(_0x5177f3.top)
      };
    });
  }
  function _0x979206({
    standardLinkCount = 0,
    customCardCount = 0
  } = {}) {
    const _0x2131e2 = (document.body?.innerText || "").replace(/\s+/g, " ").trim();
    const _0x38e0cf = /登录后即可搜索更多精彩视频|扫码登录|验证码登录|密码登录|一键登录|快捷登录|授权登录/.test(_0x2131e2) && !/退出登录|个人主页|我的关注/.test(_0x2131e2);
    const _0x5802b4 = /没有找到相关|暂无搜索结果|换个关键词试试|搜索结果为空/.test(_0x2131e2);
    return {
      url: window.location.href,
      title: document.title,
      readyState: document.readyState,
      loginGate: _0x38e0cf,
      emptyResult: _0x5802b4,
      standardLinkCount: standardLinkCount,
      customCardCount: customCardCount,
      bodyHint: _0x135641(_0x2131e2, 260),
      selectorCounts: _0x1abdb5(),
      visibleLinks: _0x282c29("a[href]", 10),
      candidateSamples: _0x59fa93(12)
    };
  }
  function _0x5d7670({
    standardLinkCount = 0,
    customCardCount = 0
  } = {}) {
    const _0x475587 = Date.now();
    const _0x320f40 = _0x979206({
      standardLinkCount: standardLinkCount,
      customCardCount: customCardCount
    });
    if (_0x475587 - _0x372fb5.lastDouyinSearchZeroDiagAt < 15000) {
      return _0x320f40;
    }
    _0x372fb5.lastDouyinSearchZeroDiagAt = _0x475587;
    console.warn("[Built-in-Debug] [搜索页诊断] 解析结果为 0，页面结构快照:", _0x320f40);
    if (_0x320f40.loginGate) {
      _0x2c0775("搜索页诊断：页面提示“登录后即可搜索更多精彩视频”，当前搜索结果 DOM 未渲染，请先完成抖音登录。", null, "warning");
    } else if (_0x320f40.emptyResult) {
      _0x2c0775("搜索页诊断：页面疑似返回空搜索结果，请检查关键词或筛选条件。", null, "warning");
    } else {
      _0x2c0775("搜索页诊断：未识别到作品卡片，已输出选择器计数和候选 DOM 样本到控制台。", null, "warning");
    }
    const _0x32a3af = _0x320f40.selectorCounts || {};
    const _0x3d70d5 = Object.entries(_0x32a3af).map(([_0x5a40af, _0x1605b1]) => _0x5a40af + ":" + _0x1605b1.visible + "/" + _0x1605b1.total).join(" ");
    console.warn("[Built-in-Debug] [搜索页诊断] 选择器计数 visible/total => " + _0x3d70d5);
    console.warn("[Built-in-Debug] [搜索页诊断] 可见链接样本:", _0x320f40.visibleLinks);
    console.warn("[Built-in-Debug] [搜索页诊断] 候选元素样本:", _0x320f40.candidateSamples);
    _0x2c0775("搜索页诊断：" + _0x135641(_0x3d70d5, 220), null, "warning");
    return _0x320f40;
  }
  return {
    buildVideoCardLead: _0x29e9ce,
    canLinkOnlyScrapeWithoutOpen: _0x53c1a9,
    collectDouyinSearchResultCards: _0x4901d0,
    emitLinkOnlyScrapeLead: _0xabebb,
    emitVideoCardLead: _0x80e5bc,
    ensureLeadgenScrapeApiBridge: _0x3068d6,
    ensureLeadgenScrapeApiHook: _0x2ba8c0,
    findAwemeIdForCard: _0x1dde07,
    findDouyinSearchCardContentId: _0x51204e,
    findSearchCardAuthorNickname: _0x42cb4c,
    findSearchCardAuthorProfileUrl: _0x85711f,
    findSearchCardVideoUrl: _0x5a1b80,
    getDouyinSearchCardClickTarget: _0x5eacb9,
    getDouyinSearchCardRoot: _0x15bf31,
    getDouyinSearchZeroDiagnostics: _0x979206,
    getDouyinVideoAuthorApi: _0x3b4ec0,
    getScrapeTargetSet: _0x51a964,
    isLinkOnlyScrapeTask: _0x56315a,
    listLeadgenScrapeAwemes: _0x420610,
    lookupLeadgenScrapeAweme: _0x42f492,
    clearLeadgenScrapeAwemeCache: _0x37071f,
    maybeReportDouyinSearchZeroDiagnostics: _0x5d7670,
    normalizeDouyinAuthorProfileUrl: _0x175ab4,
    resolveSearchCardScrapeFields: _0x2daf52,
    shouldCollectScrapeVideoMetadata: _0x3dce06,
    waitLeadgenScrapeAwemeAuthor: _0x3d7f2d
  };
}
module.exports = {
  createDouyinSearchMetadataController: createDouyinSearchMetadataController
};
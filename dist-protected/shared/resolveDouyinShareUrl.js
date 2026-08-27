const http = require("http");
const https = require("https");
const {
  extractDouyinVideoId
} = require("./processedVideoKey");
const {
  isDouyinAuthorProfileUrl,
  normalizeDouyinAuthorUrl
} = require("./douyinAuthorUrl");
const {
  pickDouyinUrlFromText
} = require("./douyinShareText");
const {
  isDouyinLiveReflowUrl,
  buildDouyinLiveUrl,
  extractDouyinLiveWebRid,
  extractDouyinLiveReflowRoomId
} = require("./entityLeadgenUrls");
const DEFAULT_USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const DEFAULT_RESOLVE_CONCURRENCY = 6;
const resolveCache = new Map();
const inflightResolves = new Map();
function isDouyinShortShareUrl(_0x2bea80) {
  const _0x3e7c72 = String(_0x2bea80 || "").trim();
  if (!_0x3e7c72) {
    return false;
  }
  return /v\.douyin\.com/i.test(_0x3e7c72) || /iesdouyin\.com\/share/i.test(_0x3e7c72) || /^https?:\/\/douyin\.com\//i.test(_0x3e7c72);
}
function isDouyinNotePath(_0x55e696) {
  return /\/(?:share\/)?note\/\d+/i.test(String(_0x55e696 || ""));
}
function toCanonicalDouyinVideoUrl(_0xacf4b) {
  const _0x15a38b = extractDouyinVideoId(_0xacf4b);
  if (!_0x15a38b) {
    return "";
  }
  if (isDouyinNotePath(_0xacf4b)) {
    return "https://www.douyin.com/note/" + _0x15a38b;
  }
  return "https://www.douyin.com/video/" + _0x15a38b;
}
function normalizeRequestUrl(_0x56a58a) {
  const _0x350500 = String(_0x56a58a || "").trim();
  if (!_0x350500) {
    return "";
  }
  if (_0x350500.startsWith("//")) {
    return "https:" + _0x350500;
  }
  if (/^https?:\/\//i.test(_0x350500)) {
    return _0x350500;
  }
  return "https://" + _0x350500;
}
function fetchRedirectLocation(_0x30c217, _0x151463 = DEFAULT_USER_AGENT, _0x5bffed = "HEAD") {
  return new Promise(_0x4c61cd => {
    let _0x474a8e;
    try {
      _0x474a8e = new URL(normalizeRequestUrl(_0x30c217));
    } catch (_0x40e568) {
      _0x4c61cd(null);
      return;
    }
    const _0x5220ca = _0x474a8e.protocol === "https:" ? https : http;
    const _0x1d9f27 = _0x5220ca.request({
      hostname: _0x474a8e.hostname,
      port: _0x474a8e.port || (_0x474a8e.protocol === "https:" ? 443 : 80),
      path: "" + _0x474a8e.pathname + _0x474a8e.search,
      method: _0x5bffed,
      headers: {
        "User-Agent": _0x151463,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      }
    }, _0x1cb06d => {
      _0x1cb06d.resume();
      if (_0x1cb06d.statusCode >= 300 && _0x1cb06d.statusCode < 400 && _0x1cb06d.headers.location) {
        try {
          _0x4c61cd(new URL(_0x1cb06d.headers.location, _0x30c217).href);
        } catch (_0x121bc7) {
          _0x4c61cd(null);
        }
        return;
      }
      _0x4c61cd(null);
    });
    _0x1d9f27.on("error", () => _0x4c61cd(null));
    _0x1d9f27.setTimeout(12000, () => {
      _0x1d9f27.destroy();
    });
    _0x1d9f27.end();
  });
}
function finalizeResolvedShareUrl(_0xa926b9) {
  const _0x56810b = String(_0xa926b9 || "").trim();
  if (!_0x56810b) {
    return "";
  }
  if (isDouyinAuthorProfileUrl(_0x56810b)) {
    return normalizeDouyinAuthorUrl(_0x56810b) || _0x56810b;
  }
  const _0x473b32 = extractDouyinLiveWebRid(_0x56810b);
  if (_0x473b32) {
    return "https://live.douyin.com/" + _0x473b32;
  }
  if (isDouyinLiveReflowUrl(_0x56810b)) {
    return buildDouyinLiveUrl(_0x56810b) || _0x56810b;
  }
  return toCanonicalDouyinVideoUrl(_0x56810b) || _0x56810b;
}
function fetchTextBody(_0x47a55c, _0x44d107 = DEFAULT_USER_AGENT) {
  return new Promise(_0x39fe68 => {
    let _0x5ae421;
    try {
      _0x5ae421 = new URL(normalizeRequestUrl(_0x47a55c));
    } catch (_0x1b2db3) {
      _0x39fe68("");
      return;
    }
    const _0x899f50 = _0x5ae421.protocol === "https:" ? https : http;
    const _0x3f8fe6 = _0x899f50.request({
      hostname: _0x5ae421.hostname,
      port: _0x5ae421.port || (_0x5ae421.protocol === "https:" ? 443 : 80),
      path: "" + _0x5ae421.pathname + _0x5ae421.search,
      method: "GET",
      headers: {
        "User-Agent": _0x44d107,
        Accept: "application/json,text/html,*/*;q=0.8",
        Referer: "https://live.douyin.com/"
      }
    }, _0x398e06 => {
      const _0x29ff6a = [];
      _0x398e06.on("data", _0x7782e1 => _0x29ff6a.push(_0x7782e1));
      _0x398e06.on("end", () => {
        _0x39fe68(Buffer.concat(_0x29ff6a).toString("utf8"));
      });
    });
    _0x3f8fe6.on("error", () => _0x39fe68(""));
    _0x3f8fe6.setTimeout(12000, () => {
      _0x3f8fe6.destroy();
      _0x39fe68("");
    });
    _0x3f8fe6.end();
  });
}
function pickWebRidFromReflowInfoBody(_0x24f37c) {
  const _0x3da2fc = String(_0x24f37c || "");
  if (!_0x3da2fc) {
    return "";
  }
  try {
    const _0x44caee = JSON.parse(_0x3da2fc);
    const _0x29dbc0 = _0x44caee?.data?.room || {};
    const _0x5dc5fd = String(_0x29dbc0?.owner?.web_rid || _0x29dbc0?.owner?.webRid || "").trim();
    if (/^\d{6,24}$/.test(_0x5dc5fd)) {
      return _0x5dc5fd;
    }
    const _0x499e49 = String(_0x29dbc0?.web_rid || _0x29dbc0?.webRid || "").trim();
    if (/^\d{6,24}$/.test(_0x499e49)) {
      return _0x499e49;
    }
    const _0xd7350b = String(_0x44caee?.data?.user?.web_rid || _0x44caee?.data?.user?.webRid || "").trim();
    if (/^\d{6,24}$/.test(_0xd7350b)) {
      return _0xd7350b;
    }
  } catch (_0x37c52f) {}
  const _0xb4843c = _0x3da2fc.match(/"web_rid"\s*:\s*"(\d{6,24})"/);
  return _0xb4843c?.[1] || "";
}
async function resolveLiveUrlFromReflowRoomId(_0x37691f, _0x5c8a38 = DEFAULT_USER_AGENT) {
  const _0x59b5ea = String(_0x37691f || "").trim();
  if (!/^\d{6,24}$/.test(_0x59b5ea)) {
    return "";
  }
  const _0x4cc0bb = "https://webcast.amemv.com/webcast/room/reflow/info/?type_id=0&live_id=1&room_id=" + encodeURIComponent(_0x59b5ea) + "&app_id=1128";
  const _0x5e802f = await fetchTextBody(_0x4cc0bb, _0x5c8a38);
  const _0x351c41 = pickWebRidFromReflowInfoBody(_0x5e802f);
  if (_0x351c41) {
    return "https://live.douyin.com/" + _0x351c41;
  } else {
    return "";
  }
}
async function finalizeResolvedShareUrlAsync(_0x58afc3, _0x19457e = DEFAULT_USER_AGENT) {
  const _0x53acc0 = String(_0x58afc3 || "").trim();
  if (!_0x53acc0) {
    return "";
  }
  const _0x4ac567 = extractDouyinLiveWebRid(_0x53acc0);
  if (_0x4ac567) {
    return "https://live.douyin.com/" + _0x4ac567;
  }
  const _0x577f6 = extractDouyinLiveReflowRoomId(_0x53acc0);
  if (_0x577f6) {
    const _0x421b38 = await resolveLiveUrlFromReflowRoomId(_0x577f6, _0x19457e);
    if (_0x421b38) {
      return _0x421b38;
    }
    return buildDouyinLiveUrl(_0x53acc0) || _0x53acc0;
  }
  return finalizeResolvedShareUrl(_0x53acc0);
}
async function followDouyinShareRedirects(_0x2e0ceb, _0x2f5073 = DEFAULT_USER_AGENT) {
  let _0x4b5176 = normalizeRequestUrl(_0x2e0ceb);
  if (!_0x4b5176) {
    return "";
  }
  const _0x1fb80c = new Set();
  for (let _0x3eb9e3 = 0; _0x3eb9e3 < 10; _0x3eb9e3 += 1) {
    if (extractDouyinLiveWebRid(_0x4b5176) || isDouyinAuthorProfileUrl(_0x4b5176) || toCanonicalDouyinVideoUrl(_0x4b5176)) {
      return finalizeResolvedShareUrlAsync(_0x4b5176, _0x2f5073);
    }
    if (isDouyinLiveReflowUrl(_0x4b5176)) {
      return finalizeResolvedShareUrlAsync(_0x4b5176, _0x2f5073);
    }
    if (_0x1fb80c.has(_0x4b5176)) {
      break;
    }
    _0x1fb80c.add(_0x4b5176);
    let _0x3463da = await fetchRedirectLocation(_0x4b5176, _0x2f5073, "HEAD");
    if (!_0x3463da) {
      _0x3463da = await fetchRedirectLocation(_0x4b5176, _0x2f5073, "GET");
    }
    if (!_0x3463da || _0x3463da === _0x4b5176) {
      break;
    }
    _0x4b5176 = _0x3463da;
  }
  return finalizeResolvedShareUrlAsync(_0x4b5176, _0x2f5073);
}
async function mapWithConcurrency(_0x189b9f, _0x17da22, _0x3f5ef4) {
  const _0x32f191 = Array.isArray(_0x189b9f) ? _0x189b9f : [];
  const _0x3fc28e = new Array(_0x32f191.length);
  let _0x47c4ce = 0;
  const _0x27be40 = Math.max(1, Math.min(Number(_0x17da22) || 1, _0x32f191.length || 1));
  async function _0x15d854() {
    while (_0x47c4ce < _0x32f191.length) {
      const _0x336045 = _0x47c4ce;
      _0x47c4ce += 1;
      _0x3fc28e[_0x336045] = await _0x3f5ef4(_0x32f191[_0x336045], _0x336045);
    }
  }
  await Promise.all(Array.from({
    length: _0x27be40
  }, () => _0x15d854()));
  return _0x3fc28e;
}
async function resolveDouyinShareUrl(_0x40555b, _0x375fbf = {}) {
  const _0x503dfb = pickDouyinUrlFromText(_0x40555b);
  const _0x59c778 = String(_0x503dfb || "").trim();
  if (!_0x59c778) {
    return "";
  }
  const _0x304b3d = resolveCache.get(_0x59c778);
  if (_0x304b3d) {
    return _0x304b3d;
  }
  if (isDouyinAuthorProfileUrl(_0x59c778)) {
    const _0x437d82 = normalizeDouyinAuthorUrl(_0x59c778);
    resolveCache.set(_0x59c778, _0x437d82);
    return _0x437d82;
  }
  const _0x42c142 = extractDouyinLiveWebRid(_0x59c778);
  if (_0x42c142) {
    const _0x5adc83 = "https://live.douyin.com/" + _0x42c142;
    resolveCache.set(_0x59c778, _0x5adc83);
    return _0x5adc83;
  }
  const _0x5b175c = toCanonicalDouyinVideoUrl(_0x59c778);
  if (_0x5b175c) {
    resolveCache.set(_0x59c778, _0x5b175c);
    return _0x5b175c;
  }
  const _0x13243f = _0x375fbf.userAgent || DEFAULT_USER_AGENT;
  if (isDouyinLiveReflowUrl(_0x59c778)) {
    const _0x2ee8da = inflightResolves.get(_0x59c778);
    if (_0x2ee8da) {
      return _0x2ee8da;
    }
    const _0x7da813 = (async () => {
      const _0x1f3053 = await finalizeResolvedShareUrlAsync(_0x59c778, _0x13243f);
      resolveCache.set(_0x59c778, _0x1f3053);
      return _0x1f3053;
    })().finally(() => {
      if (inflightResolves.get(_0x59c778) === _0x7da813) {
        inflightResolves.delete(_0x59c778);
      }
    });
    inflightResolves.set(_0x59c778, _0x7da813);
    return _0x7da813;
  }
  if (!isDouyinShortShareUrl(_0x59c778)) {
    const _0x5f023d = finalizeResolvedShareUrl(_0x59c778) || _0x59c778;
    resolveCache.set(_0x59c778, _0x5f023d);
    return _0x5f023d;
  }
  const _0x1e03cc = inflightResolves.get(_0x59c778);
  if (_0x1e03cc) {
    return _0x1e03cc;
  }
  const _0x1773cd = (async () => {
    const _0x328eb1 = await followDouyinShareRedirects(_0x59c778, _0x13243f);
    const _0xf7e0d5 = (await finalizeResolvedShareUrlAsync(_0x328eb1, _0x13243f)) || _0x328eb1 || _0x59c778;
    resolveCache.set(_0x59c778, _0xf7e0d5);
    return _0xf7e0d5;
  })().finally(() => {
    if (inflightResolves.get(_0x59c778) === _0x1773cd) {
      inflightResolves.delete(_0x59c778);
    }
  });
  inflightResolves.set(_0x59c778, _0x1773cd);
  return _0x1773cd;
}
async function resolveDouyinShareUrls(_0x42405e = [], _0x26f409 = {}) {
  const _0x4168dc = Array.isArray(_0x42405e) ? _0x42405e : [_0x42405e];
  const _0x35bb07 = Math.max(1, Number(_0x26f409.concurrency) || DEFAULT_RESOLVE_CONCURRENCY);
  return mapWithConcurrency(_0x4168dc, _0x35bb07, _0x339c02 => resolveDouyinShareUrl(_0x339c02, _0x26f409));
}
async function resolveDouyinSpecifiedUrlsText(_0x419088, _0xd7b1aa = {}) {
  const _0x190295 = String(_0x419088 || "").split(/[\n,，]+/).map(_0x3ceaac => _0x3ceaac.trim()).filter(Boolean);
  if (_0x190295.length === 0) {
    return "";
  }
  const _0x1cafa6 = await resolveDouyinShareUrls(_0x190295, _0xd7b1aa);
  return _0x1cafa6.join("\n");
}
module.exports = {
  DEFAULT_RESOLVE_CONCURRENCY: DEFAULT_RESOLVE_CONCURRENCY,
  isDouyinShortShareUrl: isDouyinShortShareUrl,
  isDouyinNotePath: isDouyinNotePath,
  toCanonicalDouyinVideoUrl: toCanonicalDouyinVideoUrl,
  resolveLiveUrlFromReflowRoomId: resolveLiveUrlFromReflowRoomId,
  resolveDouyinShareUrl: resolveDouyinShareUrl,
  resolveDouyinShareUrls: resolveDouyinShareUrls,
  resolveDouyinSpecifiedUrlsText: resolveDouyinSpecifiedUrlsText
};
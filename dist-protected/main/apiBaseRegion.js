'use strict';

const DEFAULT_REGIONS_FOR_BASE2 = Object.freeze(["福州", "厦门", "泉州", "漳州", "莆田", "宁德"]);
function normalizeRegionText(_0x170190) {
  return String(_0x170190 || "").trim().replace(/\s+/g, "").replace(/市$|地区$|特别行政区$/g, "");
}
function parseRegionList(_0x5b325f, _0x53bbbc = DEFAULT_REGIONS_FOR_BASE2) {
  if (Array.isArray(_0x5b325f)) {
    const _0x4f9adc = _0x5b325f.map(normalizeRegionText).filter(Boolean);
    if (_0x4f9adc.length) {
      return _0x4f9adc;
    } else {
      return [..._0x53bbbc];
    }
  }
  const _0x4c4d14 = String(_0x5b325f || "").trim();
  if (!_0x4c4d14) {
    return [..._0x53bbbc];
  }
  return _0x4c4d14.split(/[,，;；|/]/).map(normalizeRegionText).filter(Boolean);
}
function stripTrailingSlash(_0x345c88) {
  return String(_0x345c88 || "").trim().replace(/\/+$/, "");
}
function regionMatchesBase2(_0xc68f2c, _0x540f3f) {
  const _0x5b5677 = normalizeRegionText(_0xc68f2c);
  if (!_0x5b5677) {
    return false;
  }
  const _0x488e8a = parseRegionList(_0x540f3f);
  return _0x488e8a.some(_0x43aad1 => _0x43aad1 && _0x5b5677.includes(_0x43aad1));
}
function buildLocationLabel(_0x4508e4) {
  return _0x4508e4.map(_0x5d59dd => String(_0x5d59dd || "").trim()).filter(Boolean).join(" ");
}
function pickApiBaseByRegion({
  apiBase: _0x3e98ec,
  apiBase2: _0x41a18e,
  locationText: _0x2665b4,
  regions: _0x33914f
} = {}) {
  const _0x966e92 = stripTrailingSlash(_0x3e98ec);
  const _0x211830 = stripTrailingSlash(_0x41a18e);
  const _0x1e3a94 = parseRegionList(_0x33914f);
  if (!_0x966e92 && _0x211830) {
    return {
      apiBase: _0x211830,
      used: "apiBase2",
      matched: false,
      reason: "fallback_only_base2",
      regions: _0x1e3a94
    };
  }
  if (!_0x211830 || _0x211830 === _0x966e92) {
    return {
      apiBase: _0x966e92,
      used: "apiBase",
      matched: false,
      reason: "no_apiBase2",
      regions: _0x1e3a94
    };
  }
  if (regionMatchesBase2(_0x2665b4, _0x1e3a94)) {
    return {
      apiBase: _0x211830,
      used: "apiBase2",
      matched: true,
      reason: "region_match",
      regions: _0x1e3a94
    };
  }
  return {
    apiBase: _0x966e92,
    used: "apiBase",
    matched: false,
    reason: "region_miss",
    regions: _0x1e3a94
  };
}
async function tryIpApiCom(_0x55ebca, _0x13cd61) {
  const _0xc89d30 = await _0x55ebca.get("http://ip-api.com/json/", {
    params: {
      lang: "zh-CN",
      fields: "status,message,country,regionName,city,query"
    },
    timeout: _0x13cd61,
    validateStatus: _0x30e315 => _0x30e315 === 200
  });
  const _0x26451f = _0xc89d30.data || {};
  if (_0x26451f.status !== "success") {
    throw new Error(_0x26451f.message || "ip-api failed");
  }
  return {
    ip: _0x26451f.query || "",
    city: _0x26451f.city || "",
    region: _0x26451f.regionName || "",
    country: _0x26451f.country || "",
    locationText: buildLocationLabel([_0x26451f.country, _0x26451f.regionName, _0x26451f.city]),
    provider: "ip-api.com"
  };
}
async function tryIpApiCo(_0x4973a1, _0x2287e4) {
  const _0xe1e3af = await _0x4973a1.get("https://ipapi.co/json/", {
    timeout: _0x2287e4,
    validateStatus: _0xe5a776 => _0xe5a776 === 200
  });
  const _0x3c7fcb = _0xe1e3af.data || {};
  if (_0x3c7fcb.error) {
    throw new Error(_0x3c7fcb.reason || "ipapi.co failed");
  }
  return {
    ip: _0x3c7fcb.ip || "",
    city: _0x3c7fcb.city || "",
    region: _0x3c7fcb.region || _0x3c7fcb.region_code || "",
    country: _0x3c7fcb.country_name || _0x3c7fcb.country || "",
    locationText: buildLocationLabel([_0x3c7fcb.country_name || _0x3c7fcb.country, _0x3c7fcb.region, _0x3c7fcb.city]),
    provider: "ipapi.co"
  };
}
async function fetchIpLocation(_0x1e9677, {
  timeout = 3500
} = {}) {
  if (!_0x1e9677 || typeof _0x1e9677.get !== "function") {
    throw new Error("axios required");
  }
  const _0x1984af = [];
  for (const _0xd31866 of [tryIpApiCom, tryIpApiCo]) {
    try {
      return await _0xd31866(_0x1e9677, timeout);
    } catch (_0x22b4a1) {
      _0x1984af.push(_0x22b4a1?.message || String(_0x22b4a1));
    }
  }
  const _0x3e6ca1 = new Error("ip location failed: " + _0x1984af.join(" | "));
  _0x3e6ca1.details = _0x1984af;
  throw _0x3e6ca1;
}
async function resolveApiBaseByIp(_0x5c2cfa, {
  apiBase: _0x3a7ec5,
  apiBase2: _0x519163,
  regions: _0x1ec070,
  timeout = 3500
} = {}) {
  const _0x467e86 = stripTrailingSlash(_0x3a7ec5);
  const _0x1ebecf = stripTrailingSlash(_0x519163);
  const _0x363b60 = parseRegionList(_0x1ec070);
  if (!_0x1ebecf || _0x1ebecf === _0x467e86) {
    return {
      apiBase: _0x467e86,
      used: "apiBase",
      matched: false,
      reason: "no_apiBase2",
      regions: _0x363b60,
      location: null
    };
  }
  try {
    const _0x420998 = await fetchIpLocation(_0x5c2cfa, {
      timeout: timeout
    });
    const _0x274c5b = pickApiBaseByRegion({
      apiBase: _0x467e86,
      apiBase2: _0x1ebecf,
      locationText: _0x420998.locationText,
      regions: _0x363b60
    });
    return {
      ..._0x274c5b,
      location: _0x420998
    };
  } catch (_0x36fea4) {
    return {
      apiBase: _0x467e86,
      used: "apiBase",
      matched: false,
      reason: "locate_failed",
      regions: _0x363b60,
      location: null,
      error: _0x36fea4?.message || String(_0x36fea4)
    };
  }
}
function isApiBaseConnResetError(_0x50301a) {
  if (!_0x50301a) {
    return false;
  }
  const _0x2068c3 = String(_0x50301a.code || "");
  if (_0x2068c3 === "ECONNRESET") {
    return true;
  }
  const _0x240740 = String(_0x50301a.message || _0x50301a.msg || "");
  return /ECONNRESET/i.test(_0x240740);
}
module.exports = {
  DEFAULT_REGIONS_FOR_BASE2: DEFAULT_REGIONS_FOR_BASE2,
  normalizeRegionText: normalizeRegionText,
  parseRegionList: parseRegionList,
  regionMatchesBase2: regionMatchesBase2,
  pickApiBaseByRegion: pickApiBaseByRegion,
  fetchIpLocation: fetchIpLocation,
  resolveApiBaseByIp: resolveApiBaseByIp,
  isApiBaseConnResetError: isApiBaseConnResetError
};
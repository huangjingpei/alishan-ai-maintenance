'use strict';

const DEFAULT_REGIONS_FOR_BASE2 = Object.freeze(["福州", "厦门", "泉州", "漳州", "莆田", "宁德"]);
function getLocalDevelopmentApiBase() {
  if (process.env.HUOKE_LOCAL_BOOTSTRAP_ACTIVE !== "1") {
    return "";
  }
  return String(process.env.HUOKE_LOCAL_API_BASE || process.env.API_BASE || "").trim().replace(/\/+$/, "");
}
function normalizeRegionText(arg1) {
  return String(arg1 || "").trim().replace(/\s+/g, "").replace(/市$|地区$|特别行政区$/g, "");
}
function parseRegionList(arg1, arg2 = DEFAULT_REGIONS_FOR_BASE2) {
  if (Array.isArray(arg1)) {
    const result = arg1.map(normalizeRegionText).filter(Boolean);
    if (result.length) {
      return result;
    } else {
      return [...arg2];
    }
  }
  const result = String(arg1 || "").trim();
  if (!result) {
    return [...arg2];
  }
  return result.split(/[,，;；|/]/).map(normalizeRegionText).filter(Boolean);
}
function stripTrailingSlash(arg1) {
  return String(arg1 || "").trim().replace(/\/+$/, "");
}
function regionMatchesBase2(arg1, arg2) {
  const result = normalizeRegionText(arg1);
  if (!result) {
    return false;
  }
  const result2 = parseRegionList(arg2);
  return result2.some(arg1 => arg1 && result.includes(arg1));
}
function buildLocationLabel(arg1) {
  return arg1.map(arg1 => String(arg1 || "").trim()).filter(Boolean).join(" ");
}
function pickApiBaseByRegion({
  apiBase: apiBase,
  apiBase2: apiBase2,
  locationText: locationText,
  regions: regions
} = {}) {
  const result = getLocalDevelopmentApiBase();
  if (result) {
    return {
      apiBase: result,
      used: "localDevelopment",
      matched: true,
      reason: "local_development",
      regions: []
    };
  }
  const result2 = stripTrailingSlash(apiBase);
  const result3 = stripTrailingSlash(apiBase2);
  const result4 = parseRegionList(regions);
  if (!result2 && result3) {
    return {
      apiBase: result3,
      used: "apiBase2",
      matched: false,
      reason: "fallback_only_base2",
      regions: result4
    };
  }
  if (!result3 || result3 === result2) {
    return {
      apiBase: result2,
      used: "apiBase",
      matched: false,
      reason: "no_apiBase2",
      regions: result4
    };
  }
  if (regionMatchesBase2(locationText, result4)) {
    return {
      apiBase: result3,
      used: "apiBase2",
      matched: true,
      reason: "region_match",
      regions: result4
    };
  }
  return {
    apiBase: result2,
    used: "apiBase",
    matched: false,
    reason: "region_miss",
    regions: result4
  };
}
async function tryIpApiCom(arg1, arg2) {
  const result = await arg1.get("http://ip-api.com/json/", {
    params: {
      lang: "zh-CN",
      fields: "status,message,country,regionName,city,query"
    },
    timeout: arg2,
    validateStatus: arg1 => arg1 === 200
  });
  const local = result.data || {};
  if (local.status !== "success") {
    throw new Error(local.message || "ip-api failed");
  }
  return {
    ip: local.query || "",
    city: local.city || "",
    region: local.regionName || "",
    country: local.country || "",
    locationText: buildLocationLabel([local.country, local.regionName, local.city]),
    provider: "ip-api.com"
  };
}
async function tryIpApiCo(arg1, arg2) {
  const result = await arg1.get("https://ipapi.co/json/", {
    timeout: arg2,
    validateStatus: arg1 => arg1 === 200
  });
  const local = result.data || {};
  if (local.error) {
    throw new Error(local.reason || "ipapi.co failed");
  }
  return {
    ip: local.ip || "",
    city: local.city || "",
    region: local.region || local.region_code || "",
    country: local.country_name || local.country || "",
    locationText: buildLocationLabel([local.country_name || local.country, local.region, local.city]),
    provider: "ipapi.co"
  };
}
async function fetchIpLocation(arg1, {
  timeout = 3500
} = {}) {
  if (!arg1 || typeof arg1.get !== "function") {
    throw new Error("axios required");
  }
  const list = [];
  for (const item of [tryIpApiCom, tryIpApiCo]) {
    try {
      return await item(arg1, timeout);
    } catch (error) {
      list.push(error?.message || String(error));
    }
  }
  const error = new Error("ip location failed: " + list.join(" | "));
  error.details = list;
  throw error;
}
async function resolveApiBaseByIp(arg1, {
  apiBase: apiBase,
  apiBase2: apiBase2,
  regions: regions,
  timeout = 3500
} = {}) {
  const result = getLocalDevelopmentApiBase();
  if (result) {
    return {
      apiBase: result,
      used: "localDevelopment",
      matched: true,
      reason: "local_development",
      regions: [],
      location: null
    };
  }
  const result2 = stripTrailingSlash(apiBase);
  const result3 = stripTrailingSlash(apiBase2);
  const result4 = parseRegionList(regions);
  if (!result3 || result3 === result2) {
    return {
      apiBase: result2,
      used: "apiBase",
      matched: false,
      reason: "no_apiBase2",
      regions: result4,
      location: null
    };
  }
  try {
    const result = await fetchIpLocation(arg1, {
      timeout: timeout
    });
    const result5 = pickApiBaseByRegion({
      apiBase: result2,
      apiBase2: result3,
      locationText: result.locationText,
      regions: result4
    });
    return {
      ...result5,
      location: result
    };
  } catch (error) {
    return {
      apiBase: result2,
      used: "apiBase",
      matched: false,
      reason: "locate_failed",
      regions: result4,
      location: null,
      error: error?.message || String(error)
    };
  }
}
function isApiBaseConnResetError(arg1) {
  if (!arg1) {
    return false;
  }
  const result = String(arg1.code || "");
  if (result === "ECONNRESET") {
    return true;
  }
  const result2 = String(arg1.message || arg1.msg || "");
  return /ECONNRESET/i.test(result2);
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

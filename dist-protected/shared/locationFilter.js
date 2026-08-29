function normalizeLocationFilterRegions(arg1) {
  if (!arg1) {
    return [];
  }
  const value = Array.isArray(arg1) ? arg1 : String(arg1).split(/[,，\n]/);
  return value.map(arg1 => String(arg1 || "").trim()).filter(Boolean);
}
function getLocationTextFromEntity(arg1) {
  return String(arg1?.ipLocation || arg1?.location || "").trim();
}
function matchesAnyRegion(arg1, arg2) {
  if (!arg1 || arg1 === "未知") {
    return false;
  }
  return arg2.some(arg12 => arg12 && arg1.includes(arg12));
}
function evaluateLocationFilter(arg1, arg2, arg3) {
  const result = normalizeLocationFilterRegions(arg3);
  if (!result.length) {
    return {
      pass: true
    };
  }
  const result2 = String(arg1 || "").trim();
  const value = arg2 === "exclude" ? "exclude" : "include";
  if (value === "exclude") {
    if (!result2 || result2 === "未知") {
      return {
        pass: true
      };
    }
    if (matchesAnyRegion(result2, result)) {
      return {
        pass: false,
        reason: "地区排除（" + result2 + "）"
      };
    }
    return {
      pass: true
    };
  }
  if (!result2 || result2 === "未知") {
    return {
      pass: false,
      reason: "地区未知"
    };
  }
  if (matchesAnyRegion(result2, result)) {
    return {
      pass: true
    };
  }
  return {
    pass: false,
    reason: "地区不符（" + result2 + "）"
  };
}
function evaluateTaskLocationFilter(arg1, options = {}) {
  const result = normalizeLocationFilterRegions(options.locationFilterRegions);
  if (!result.length) {
    return {
      pass: true
    };
  }
  const value = options.locationFilterMode === "exclude" ? "exclude" : "include";
  const result2 = getLocationTextFromEntity(arg1);
  return evaluateLocationFilter(result2, value, result);
}
function formatLocationFilterSummary(options = {}) {
  const result = normalizeLocationFilterRegions(options.locationFilterRegions);
  if (!result.length) {
    return "不限";
  }
  const value = options.locationFilterMode === "exclude" ? "不包含" : "包含";
  return value + "：" + result.join("、");
}
module.exports = {
  normalizeLocationFilterRegions: normalizeLocationFilterRegions,
  getLocationTextFromEntity: getLocationTextFromEntity,
  matchesAnyRegion: matchesAnyRegion,
  evaluateLocationFilter: evaluateLocationFilter,
  evaluateTaskLocationFilter: evaluateTaskLocationFilter,
  formatLocationFilterSummary: formatLocationFilterSummary
};
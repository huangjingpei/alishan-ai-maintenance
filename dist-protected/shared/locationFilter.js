function normalizeLocationFilterRegions(_0x29e13e) {
  if (!_0x29e13e) {
    return [];
  }
  const _0x4f77f3 = Array.isArray(_0x29e13e) ? _0x29e13e : String(_0x29e13e).split(/[,，\n]/);
  return _0x4f77f3.map(_0xdeec1a => String(_0xdeec1a || "").trim()).filter(Boolean);
}
function getLocationTextFromEntity(_0x4c8c4d) {
  return String(_0x4c8c4d?.ipLocation || _0x4c8c4d?.location || "").trim();
}
function matchesAnyRegion(_0x5bb383, _0x206e4c) {
  if (!_0x5bb383 || _0x5bb383 === "未知") {
    return false;
  }
  return _0x206e4c.some(_0x4be4b4 => _0x4be4b4 && _0x5bb383.includes(_0x4be4b4));
}
function evaluateLocationFilter(_0x13ced9, _0xb50d8e, _0x22d4b9) {
  const _0x134b44 = normalizeLocationFilterRegions(_0x22d4b9);
  if (!_0x134b44.length) {
    return {
      pass: true
    };
  }
  const _0x407a96 = String(_0x13ced9 || "").trim();
  const _0x3cbbda = _0xb50d8e === "exclude" ? "exclude" : "include";
  if (_0x3cbbda === "exclude") {
    if (!_0x407a96 || _0x407a96 === "未知") {
      return {
        pass: true
      };
    }
    if (matchesAnyRegion(_0x407a96, _0x134b44)) {
      return {
        pass: false,
        reason: "地区排除（" + _0x407a96 + "）"
      };
    }
    return {
      pass: true
    };
  }
  if (!_0x407a96 || _0x407a96 === "未知") {
    return {
      pass: false,
      reason: "地区未知"
    };
  }
  if (matchesAnyRegion(_0x407a96, _0x134b44)) {
    return {
      pass: true
    };
  }
  return {
    pass: false,
    reason: "地区不符（" + _0x407a96 + "）"
  };
}
function evaluateTaskLocationFilter(_0x253ca3, _0x246502 = {}) {
  const _0x3721e3 = normalizeLocationFilterRegions(_0x246502.locationFilterRegions);
  if (!_0x3721e3.length) {
    return {
      pass: true
    };
  }
  const _0x13028f = _0x246502.locationFilterMode === "exclude" ? "exclude" : "include";
  const _0x5a2cb0 = getLocationTextFromEntity(_0x253ca3);
  return evaluateLocationFilter(_0x5a2cb0, _0x13028f, _0x3721e3);
}
function formatLocationFilterSummary(_0x426930 = {}) {
  const _0x43f4bb = normalizeLocationFilterRegions(_0x426930.locationFilterRegions);
  if (!_0x43f4bb.length) {
    return "不限";
  }
  const _0x153e88 = _0x426930.locationFilterMode === "exclude" ? "不包含" : "包含";
  return _0x153e88 + "：" + _0x43f4bb.join("、");
}
module.exports = {
  normalizeLocationFilterRegions: normalizeLocationFilterRegions,
  getLocationTextFromEntity: getLocationTextFromEntity,
  matchesAnyRegion: matchesAnyRegion,
  evaluateLocationFilter: evaluateLocationFilter,
  evaluateTaskLocationFilter: evaluateTaskLocationFilter,
  formatLocationFilterSummary: formatLocationFilterSummary
};
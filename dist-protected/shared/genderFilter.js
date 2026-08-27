'use strict';

const GENDER_FILTER_OPTIONS = Object.freeze([{
  value: "all",
  label: "不限"
}, {
  value: "male_unknown",
  label: "男+未知"
}, {
  value: "male",
  label: "男"
}, {
  value: "female_unknown",
  label: "女+未知"
}, {
  value: "female",
  label: "女"
}]);
const GENDER_FILTER_VALUES = new Set(GENDER_FILTER_OPTIONS.map(_0x4df9bb => _0x4df9bb.value));
const GENDER_FILTER_LABELS = Object.freeze(Object.fromEntries(GENDER_FILTER_OPTIONS.map(_0x53b081 => [_0x53b081.value, _0x53b081.label])));
function normalizeGenderFilter(_0x288edd, _0x450356 = "all") {
  const _0x3858bf = String(_0x288edd || "").trim().toLowerCase();
  if (GENDER_FILTER_VALUES.has(_0x3858bf)) {
    return _0x3858bf;
  }
  const _0x16db09 = String(_0x450356 || "all").trim().toLowerCase();
  if (GENDER_FILTER_VALUES.has(_0x16db09)) {
    return _0x16db09;
  } else {
    return "all";
  }
}
function normalizeObservedGender(_0x1ede30) {
  const _0x5d1477 = String(_0x1ede30 ?? "").trim().toLowerCase().replace(/\s+/g, "");
  if (/^(男|男性|男生|male|m|♂)$/.test(_0x5d1477)) {
    return "male";
  }
  if (/^(女|女性|女生|female|f|♀)$/.test(_0x5d1477)) {
    return "female";
  }
  return "unknown";
}
function getObservedGenderLabel(_0x1daf03) {
  const _0x42e793 = normalizeObservedGender(_0x1daf03);
  if (_0x42e793 === "male") {
    return "男";
  }
  if (_0x42e793 === "female") {
    return "女";
  }
  return "未知";
}
function evaluateGenderFilter(_0x437cf8, _0x2e452b) {
  const _0x13cc67 = normalizeGenderFilter(_0x2e452b);
  const _0x380501 = normalizeObservedGender(_0x437cf8);
  const _0x51bf66 = _0x13cc67 === "all" || _0x13cc67 === _0x380501 || _0x13cc67 === "male_unknown" && (_0x380501 === "male" || _0x380501 === "unknown") || _0x13cc67 === "female_unknown" && (_0x380501 === "female" || _0x380501 === "unknown");
  const _0x2013b3 = getObservedGenderLabel(_0x437cf8);
  const _0x3d37cc = GENDER_FILTER_LABELS[_0x13cc67] || GENDER_FILTER_LABELS.all;
  return {
    pass: _0x51bf66,
    filter: _0x13cc67,
    filterLabel: _0x3d37cc,
    observed: _0x380501,
    observedLabel: _0x2013b3,
    reason: _0x51bf66 ? "" : "性别不符（识别：" + _0x2013b3 + "，筛选：" + _0x3d37cc + "）"
  };
}
module.exports = {
  GENDER_FILTER_OPTIONS: GENDER_FILTER_OPTIONS,
  GENDER_FILTER_VALUES: GENDER_FILTER_VALUES,
  GENDER_FILTER_LABELS: GENDER_FILTER_LABELS,
  normalizeGenderFilter: normalizeGenderFilter,
  normalizeObservedGender: normalizeObservedGender,
  getObservedGenderLabel: getObservedGenderLabel,
  evaluateGenderFilter: evaluateGenderFilter
};
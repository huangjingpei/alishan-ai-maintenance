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
const GENDER_FILTER_VALUES = new Set(GENDER_FILTER_OPTIONS.map(arg1 => arg1.value));
const GENDER_FILTER_LABELS = Object.freeze(Object.fromEntries(GENDER_FILTER_OPTIONS.map(arg1 => [arg1.value, arg1.label])));
function normalizeGenderFilter(arg1, text = "all") {
  const result = String(arg1 || "").trim().toLowerCase();
  if (GENDER_FILTER_VALUES.has(result)) {
    return result;
  }
  const result2 = String(text || "all").trim().toLowerCase();
  if (GENDER_FILTER_VALUES.has(result2)) {
    return result2;
  } else {
    return "all";
  }
}
function normalizeObservedGender(arg1) {
  const result = String(arg1 ?? "").trim().toLowerCase().replace(/\s+/g, "");
  if (/^(男|男性|男生|male|m|♂)$/.test(result)) {
    return "male";
  }
  if (/^(女|女性|女生|female|f|♀)$/.test(result)) {
    return "female";
  }
  return "unknown";
}
function getObservedGenderLabel(arg1) {
  const result = normalizeObservedGender(arg1);
  if (result === "male") {
    return "男";
  }
  if (result === "female") {
    return "女";
  }
  return "未知";
}
function evaluateGenderFilter(arg1, arg2) {
  const result = normalizeGenderFilter(arg2);
  const result2 = normalizeObservedGender(arg1);
  const local = result === "all" || result === result2 || result === "male_unknown" && (result2 === "male" || result2 === "unknown") || result === "female_unknown" && (result2 === "female" || result2 === "unknown");
  const result3 = getObservedGenderLabel(arg1);
  const local2 = GENDER_FILTER_LABELS[result] || GENDER_FILTER_LABELS.all;
  return {
    pass: local,
    filter: result,
    filterLabel: local2,
    observed: result2,
    observedLabel: result3,
    reason: local ? "" : "性别不符（识别：" + result3 + "，筛选：" + local2 + "）"
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
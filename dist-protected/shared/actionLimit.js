'use strict';

function normalizeActionLimitRange(options = {}, options2 = {}) {
  let result = Number(options[options2.minField]);
  let result2 = Number(options[options2.maxField]);
  if (!Number.isFinite(result)) {
    result = Number(options2.defaultMin) || 10;
  }
  if (!Number.isFinite(result2)) {
    result2 = Number(options2.defaultMax) || 20;
  }
  result = Math.max(1, Math.floor(result));
  result2 = Math.max(1, Math.floor(result2));
  if (result > result2) {
    [result, result2] = [result2, result];
  }
  const result3 = Math.max(1, Number(options2.hardMax) || 10000);
  return {
    min: Math.min(result, result3),
    max: Math.min(result2, result3)
  };
}
function pickActionLimit(arg1, arg2 = Math.random) {
  const result = Math.max(1, Math.floor(Number(arg1?.min) || 1));
  const result2 = Math.max(result, Math.floor(Number(arg1?.max) || result));
  const result3 = Math.max(0, Math.min(0.999999999, Number(arg2()) || 0));
  return Math.floor(result3 * (result2 - result + 1)) + result;
}
function createActionLimitState(options = {}, list = [], arg3 = Math.random) {
  const obj = {};
  const obj2 = {};
  for (const item of list) {
    if (!item?.key) {
      continue;
    }
    const result = normalizeActionLimitRange(options, item);
    const value = options[item.enabledField] === true;
    obj[item.key] = {
      key: item.key,
      label: item.label || item.key,
      enabled: value,
      min: result.min,
      max: result.max,
      limit: value ? pickActionLimit(result, arg3) : null
    };
    obj2[item.key] = 0;
  }
  return {
    limits: obj,
    counts: obj2
  };
}
function getActionLimitStatus(arg1, arg2) {
  const local = arg1?.limits?.[arg2];
  const result = Math.max(0, Number(arg1?.counts?.[arg2]) || 0);
  if (!local || !local.enabled) {
    return {
      enabled: false,
      allowed: true,
      count: result,
      limit: null,
      remaining: Infinity
    };
  }
  const result2 = Math.max(1, Number(local.limit) || 1);
  return {
    enabled: true,
    allowed: result < result2,
    count: result,
    limit: result2,
    remaining: Math.max(0, result2 - result),
    label: local.label || arg2
  };
}
function recordActionLimitSuccess(arg1, arg2, num = 1) {
  if (!arg1?.counts || !Object.prototype.hasOwnProperty.call(arg1.counts, arg2)) {
    return getActionLimitStatus(arg1, arg2);
  }
  arg1.counts[arg2] = Math.max(0, Number(arg1.counts[arg2]) || 0) + Math.max(0, Math.floor(Number(num) || 0));
  return getActionLimitStatus(arg1, arg2);
}
function formatActionLimitSummary(arg1) {
  const local = arg1?.template || arg1;
  return Object.values(local?.limits || {}).map(arg1 => arg1.enabled ? arg1.label + " " + arg1.limit + "（区间 " + arg1.min + "-" + arg1.max + "）" : arg1.label + " 不限").join("；");
}
function cloneActionLimitState(options = {}) {
  const obj = {};
  Object.keys(options.counts || options.limits || {}).forEach(arg1 => {
    obj[arg1] = 0;
  });
  return {
    limits: JSON.parse(JSON.stringify(options.limits || {})),
    counts: obj
  };
}
function createAccountActionLimitStore(options = {}, list = [], list2 = [], arg4 = Math.random) {
  const result = createActionLimitState(options, list, arg4);
  const result2 = Object.create(null);
  for (const item of list2 || []) {
    const result3 = String(item || "").trim();
    if (!result3) {
      continue;
    }
    result2[result3] = cloneActionLimitState(result);
  }
  return {
    template: result,
    accounts: result2,
    config: options,
    specs: list
  };
}
function ensureAccountActionLimitState(arg1, arg2, arg3 = Math.random) {
  if (!arg1) {
    return createActionLimitState({}, [], arg3);
  }
  if (arg1.limits && arg1.counts && !arg1.template && !arg1.accounts) {
    return arg1;
  }
  if (!arg1.template) {
    arg1.template = createActionLimitState(arg1.config || {}, arg1.specs || [], arg3);
  }
  if (!arg1.accounts) {
    arg1.accounts = Object.create(null);
  }
  const result = String(arg2 || "").trim();
  if (!result) {
    return arg1.template;
  }
  if (!arg1.accounts[result]) {
    arg1.accounts[result] = cloneActionLimitState(arg1.template);
  }
  return arg1.accounts[result];
}
function getAccountActionLimitStatus(arg1, arg2, arg3) {
  return getActionLimitStatus(ensureAccountActionLimitState(arg1, arg2), arg3);
}
function recordAccountActionLimitSuccess(arg1, arg2, arg3, num = 1) {
  return recordActionLimitSuccess(ensureAccountActionLimitState(arg1, arg2), arg3, num);
}
function formatAccountActionLimitSummary(arg1) {
  const result = formatActionLimitSummary(arg1);
  if (result) {
    return "每账号 " + result;
  } else {
    return result;
  }
}
const ACCOUNT_ACTION_LIMIT_SPECS = Object.freeze([{
  key: "like",
  label: "点赞",
  enabledField: "autoLikeLimitEnabled",
  minField: "autoLikeLimitMin",
  maxField: "autoLikeLimitMax"
}, {
  key: "reply",
  label: "回复",
  enabledField: "autoReplyLimitEnabled",
  minField: "autoReplyLimitMin",
  maxField: "autoReplyLimitMax"
}, {
  key: "follow",
  label: "关注",
  enabledField: "autoFollowLimitEnabled",
  minField: "autoFollowLimitMin",
  maxField: "autoFollowLimitMax"
}, {
  key: "dm",
  label: "私信",
  enabledField: "autoDmLimitEnabled",
  minField: "autoDmLimitMin",
  maxField: "autoDmLimitMax"
}]);
function mapSelfWarmupActionToLimitKey(arg1) {
  if (arg1 === "like_comment") {
    return "like";
  }
  if (arg1 === "reply_comment" || arg1 === "reply_dm") {
    return "reply";
  }
  if (arg1 === "follow_back" || arg1 === "user_follow") {
    return "follow";
  }
  if (arg1 === "send_dm") {
    return "dm";
  }
  return "";
}
module.exports = {
  normalizeActionLimitRange: normalizeActionLimitRange,
  pickActionLimit: pickActionLimit,
  createActionLimitState: createActionLimitState,
  getActionLimitStatus: getActionLimitStatus,
  recordActionLimitSuccess: recordActionLimitSuccess,
  formatActionLimitSummary: formatActionLimitSummary,
  cloneActionLimitState: cloneActionLimitState,
  createAccountActionLimitStore: createAccountActionLimitStore,
  ensureAccountActionLimitState: ensureAccountActionLimitState,
  getAccountActionLimitStatus: getAccountActionLimitStatus,
  recordAccountActionLimitSuccess: recordAccountActionLimitSuccess,
  formatAccountActionLimitSummary: formatAccountActionLimitSummary,
  ACCOUNT_ACTION_LIMIT_SPECS: ACCOUNT_ACTION_LIMIT_SPECS,
  mapSelfWarmupActionToLimitKey: mapSelfWarmupActionToLimitKey
};
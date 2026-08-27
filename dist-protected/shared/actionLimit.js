'use strict';

function normalizeActionLimitRange(_0x2928db = {}, _0x5f3678 = {}) {
  let _0x52b8ed = Number(_0x2928db[_0x5f3678.minField]);
  let _0x3a8328 = Number(_0x2928db[_0x5f3678.maxField]);
  if (!Number.isFinite(_0x52b8ed)) {
    _0x52b8ed = Number(_0x5f3678.defaultMin) || 10;
  }
  if (!Number.isFinite(_0x3a8328)) {
    _0x3a8328 = Number(_0x5f3678.defaultMax) || 20;
  }
  _0x52b8ed = Math.max(1, Math.floor(_0x52b8ed));
  _0x3a8328 = Math.max(1, Math.floor(_0x3a8328));
  if (_0x52b8ed > _0x3a8328) {
    [_0x52b8ed, _0x3a8328] = [_0x3a8328, _0x52b8ed];
  }
  const _0xbc4499 = Math.max(1, Number(_0x5f3678.hardMax) || 10000);
  return {
    min: Math.min(_0x52b8ed, _0xbc4499),
    max: Math.min(_0x3a8328, _0xbc4499)
  };
}
function pickActionLimit(_0x349ddd, _0x40fccb = Math.random) {
  const _0x473215 = Math.max(1, Math.floor(Number(_0x349ddd?.min) || 1));
  const _0x133434 = Math.max(_0x473215, Math.floor(Number(_0x349ddd?.max) || _0x473215));
  const _0x500e8c = Math.max(0, Math.min(0.999999999, Number(_0x40fccb()) || 0));
  return Math.floor(_0x500e8c * (_0x133434 - _0x473215 + 1)) + _0x473215;
}
function createActionLimitState(_0xf21895 = {}, _0x509861 = [], _0x4c7412 = Math.random) {
  const _0x49d20d = {};
  const _0x153710 = {};
  for (const _0xde827a of _0x509861) {
    if (!_0xde827a?.key) {
      continue;
    }
    const _0x1aa1ad = normalizeActionLimitRange(_0xf21895, _0xde827a);
    const _0x35ed1b = _0xf21895[_0xde827a.enabledField] === true;
    _0x49d20d[_0xde827a.key] = {
      key: _0xde827a.key,
      label: _0xde827a.label || _0xde827a.key,
      enabled: _0x35ed1b,
      min: _0x1aa1ad.min,
      max: _0x1aa1ad.max,
      limit: _0x35ed1b ? pickActionLimit(_0x1aa1ad, _0x4c7412) : null
    };
    _0x153710[_0xde827a.key] = 0;
  }
  return {
    limits: _0x49d20d,
    counts: _0x153710
  };
}
function getActionLimitStatus(_0xe6ea30, _0xfa0a56) {
  const _0x508c06 = _0xe6ea30?.limits?.[_0xfa0a56];
  const _0x4de89d = Math.max(0, Number(_0xe6ea30?.counts?.[_0xfa0a56]) || 0);
  if (!_0x508c06 || !_0x508c06.enabled) {
    return {
      enabled: false,
      allowed: true,
      count: _0x4de89d,
      limit: null,
      remaining: Infinity
    };
  }
  const _0x2da2f8 = Math.max(1, Number(_0x508c06.limit) || 1);
  return {
    enabled: true,
    allowed: _0x4de89d < _0x2da2f8,
    count: _0x4de89d,
    limit: _0x2da2f8,
    remaining: Math.max(0, _0x2da2f8 - _0x4de89d),
    label: _0x508c06.label || _0xfa0a56
  };
}
function recordActionLimitSuccess(_0x111f08, _0x13bda3, _0x47cea8 = 1) {
  if (!_0x111f08?.counts || !Object.prototype.hasOwnProperty.call(_0x111f08.counts, _0x13bda3)) {
    return getActionLimitStatus(_0x111f08, _0x13bda3);
  }
  _0x111f08.counts[_0x13bda3] = Math.max(0, Number(_0x111f08.counts[_0x13bda3]) || 0) + Math.max(0, Math.floor(Number(_0x47cea8) || 0));
  return getActionLimitStatus(_0x111f08, _0x13bda3);
}
function formatActionLimitSummary(_0x44c3a7) {
  const _0x5a4107 = _0x44c3a7?.template || _0x44c3a7;
  return Object.values(_0x5a4107?.limits || {}).map(_0x5dc3d2 => _0x5dc3d2.enabled ? _0x5dc3d2.label + " " + _0x5dc3d2.limit + "（区间 " + _0x5dc3d2.min + "-" + _0x5dc3d2.max + "）" : _0x5dc3d2.label + " 不限").join("；");
}
function cloneActionLimitState(_0x318c4b = {}) {
  const _0x530f96 = {};
  Object.keys(_0x318c4b.counts || _0x318c4b.limits || {}).forEach(_0x1c1d42 => {
    _0x530f96[_0x1c1d42] = 0;
  });
  return {
    limits: JSON.parse(JSON.stringify(_0x318c4b.limits || {})),
    counts: _0x530f96
  };
}
function createAccountActionLimitStore(_0x4e6cd4 = {}, _0xe26861 = [], _0x14fafb = [], _0x5883a2 = Math.random) {
  const _0x5de0cf = createActionLimitState(_0x4e6cd4, _0xe26861, _0x5883a2);
  const _0x383fab = Object.create(null);
  for (const _0x353207 of _0x14fafb || []) {
    const _0x38be7f = String(_0x353207 || "").trim();
    if (!_0x38be7f) {
      continue;
    }
    _0x383fab[_0x38be7f] = cloneActionLimitState(_0x5de0cf);
  }
  return {
    template: _0x5de0cf,
    accounts: _0x383fab,
    config: _0x4e6cd4,
    specs: _0xe26861
  };
}
function ensureAccountActionLimitState(_0x1f4ca0, _0x4d97fe, _0x3de6da = Math.random) {
  if (!_0x1f4ca0) {
    return createActionLimitState({}, [], _0x3de6da);
  }
  if (_0x1f4ca0.limits && _0x1f4ca0.counts && !_0x1f4ca0.template && !_0x1f4ca0.accounts) {
    return _0x1f4ca0;
  }
  if (!_0x1f4ca0.template) {
    _0x1f4ca0.template = createActionLimitState(_0x1f4ca0.config || {}, _0x1f4ca0.specs || [], _0x3de6da);
  }
  if (!_0x1f4ca0.accounts) {
    _0x1f4ca0.accounts = Object.create(null);
  }
  const _0x415afb = String(_0x4d97fe || "").trim();
  if (!_0x415afb) {
    return _0x1f4ca0.template;
  }
  if (!_0x1f4ca0.accounts[_0x415afb]) {
    _0x1f4ca0.accounts[_0x415afb] = cloneActionLimitState(_0x1f4ca0.template);
  }
  return _0x1f4ca0.accounts[_0x415afb];
}
function getAccountActionLimitStatus(_0x5770d0, _0x2c217c, _0x3c72f9) {
  return getActionLimitStatus(ensureAccountActionLimitState(_0x5770d0, _0x2c217c), _0x3c72f9);
}
function recordAccountActionLimitSuccess(_0x1a7e91, _0x44732a, _0xa7b3d8, _0x27d759 = 1) {
  return recordActionLimitSuccess(ensureAccountActionLimitState(_0x1a7e91, _0x44732a), _0xa7b3d8, _0x27d759);
}
function formatAccountActionLimitSummary(_0x75deb6) {
  const _0x3ed9e0 = formatActionLimitSummary(_0x75deb6);
  if (_0x3ed9e0) {
    return "每账号 " + _0x3ed9e0;
  } else {
    return _0x3ed9e0;
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
function mapSelfWarmupActionToLimitKey(_0x4ad495) {
  if (_0x4ad495 === "like_comment") {
    return "like";
  }
  if (_0x4ad495 === "reply_comment" || _0x4ad495 === "reply_dm") {
    return "reply";
  }
  if (_0x4ad495 === "follow_back" || _0x4ad495 === "user_follow") {
    return "follow";
  }
  if (_0x4ad495 === "send_dm") {
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
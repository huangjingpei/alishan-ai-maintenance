const {
  buildSelfWarmupEventSeenKey,
  normalizeName
} = require("../shared/selfWarmupDedupe");
const SEEN_PREFIX = "self_warmup_seen_";
const ROUNDS_PREFIX = "self_warmup_user_rounds_";
const PENDING_PREFIX = "self_warmup_pending_";
const BASELINES_PREFIX = "self_warmup_baselines_";
function getSeenKeys(_0x32d75f, _0x4e1905) {
  const _0x38cbbe = _0x32d75f.get("" + SEEN_PREFIX + _0x4e1905, []);
  if (Array.isArray(_0x38cbbe)) {
    return _0x38cbbe;
  } else {
    return [];
  }
}
function saveSeenKeys(_0xd9fa9f, _0x534275, _0x568697) {
  _0xd9fa9f.set("" + SEEN_PREFIX + _0x534275, [...new Set(_0x568697.filter(Boolean))].slice(-5000));
}
function getPendingEvents(_0x2adf6c, _0xd57c55) {
  const _0xf1c5a = _0x2adf6c.get("" + PENDING_PREFIX + _0xd57c55, []);
  if (Array.isArray(_0xf1c5a)) {
    return _0xf1c5a.filter(_0xa812ad => _0xa812ad && typeof _0xa812ad === "object");
  } else {
    return [];
  }
}
function savePendingEvents(_0x7410c5, _0x470701, _0x461345 = []) {
  const _0x43281f = [];
  const _0x46c29c = new Set();
  for (const _0x276cc1 of Array.isArray(_0x461345) ? _0x461345 : []) {
    if (!_0x276cc1 || typeof _0x276cc1 !== "object") {
      continue;
    }
    const _0x14b6db = buildSelfWarmupEventSeenKey(_0x276cc1);
    if (!_0x14b6db || _0x46c29c.has(_0x14b6db)) {
      continue;
    }
    _0x46c29c.add(_0x14b6db);
    _0x43281f.push(_0x276cc1);
  }
  _0x7410c5.set("" + PENDING_PREFIX + _0x470701, _0x43281f.slice(-500));
}
function clearTaskEventCache(_0x288467, _0x134fea) {
  if (!_0x134fea) {
    return;
  }
  _0x288467.delete("" + SEEN_PREFIX + _0x134fea);
  _0x288467.delete("" + ROUNDS_PREFIX + _0x134fea);
  _0x288467.delete("" + PENDING_PREFIX + _0x134fea);
  _0x288467.delete("" + BASELINES_PREFIX + _0x134fea);
}
function clearUserReplyRounds(_0x3d1497, _0x57febf) {
  if (!_0x57febf) {
    return false;
  }
  _0x3d1497.delete("" + ROUNDS_PREFIX + _0x57febf);
  return true;
}
function removeEventsFromCache(_0x293587, _0x33594f, _0x107a8e = []) {
  if (!_0x33594f || !_0x107a8e.length) {
    return;
  }
  const _0x4d3bb4 = new Set(_0x107a8e.map(_0x5c8ac2 => buildSelfWarmupEventSeenKey(_0x5c8ac2)));
  const _0x27b0f4 = getSeenKeys(_0x293587, _0x33594f).filter(_0x484d35 => !_0x4d3bb4.has(_0x484d35));
  saveSeenKeys(_0x293587, _0x33594f, _0x27b0f4);
  const _0x40c92a = getPendingEvents(_0x293587, _0x33594f).filter(_0x48dd0d => !_0x4d3bb4.has(buildSelfWarmupEventSeenKey(_0x48dd0d)));
  savePendingEvents(_0x293587, _0x33594f, _0x40c92a);
  const _0x1175a1 = "" + ROUNDS_PREFIX + _0x33594f;
  const _0x13fd04 = {
    ...(_0x293587.get(_0x1175a1, {}) || {})
  };
  let _0x1ab025 = false;
  for (const _0x35d520 of _0x107a8e) {
    const _0x4ded56 = normalizeName(_0x35d520.nickname);
    const _0x3989f6 = String(_0x35d520.accountId || "");
    const _0x23dea9 = _0x3989f6 + "|" + _0x4ded56;
    const _0x37ce54 = [_0x4ded56, _0x23dea9, _0x23dea9 + "|comment", _0x23dea9 + "|dm"];
    try {
      const {
        extractUserKeyFromUrl: _0x45c897
      } = require("../shared/leadUserKey");
      const _0x8eb552 = _0x45c897(_0x35d520.userUrl || "");
      if (_0x8eb552) {
        _0x37ce54.push(_0x3989f6 + "|uid:" + _0x8eb552 + "|comment", _0x3989f6 + "|uid:" + _0x8eb552 + "|dm");
      }
    } catch (_0x497b3c) {}
    for (const _0x255906 of _0x37ce54) {
      if (_0x255906 && Object.prototype.hasOwnProperty.call(_0x13fd04, _0x255906)) {
        delete _0x13fd04[_0x255906];
        _0x1ab025 = true;
      }
    }
  }
  if (_0x1ab025) {
    _0x293587.set(_0x1175a1, _0x13fd04);
  }
}
function clearTaskEventCacheForTasks(_0x78bed6, _0x3f359b = []) {
  const _0xd28686 = Array.isArray(_0x3f359b) ? _0x3f359b : [_0x3f359b];
  _0xd28686.forEach(_0x36634d => clearTaskEventCache(_0x78bed6, _0x36634d));
}
module.exports = {
  getSeenKeys: getSeenKeys,
  saveSeenKeys: saveSeenKeys,
  getPendingEvents: getPendingEvents,
  savePendingEvents: savePendingEvents,
  clearTaskEventCache: clearTaskEventCache,
  clearUserReplyRounds: clearUserReplyRounds,
  removeEventsFromCache: removeEventsFromCache,
  clearTaskEventCacheForTasks: clearTaskEventCacheForTasks
};
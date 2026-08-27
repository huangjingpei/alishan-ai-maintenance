'use strict';

const {
  buildMonitorUserDedupKey
} = require("./monitorCommentFilter");
const STORE_KEY = "monitor_global_user_sec_uids";
const MAX_KEYS = 20000;
function loadGlobalKeySet(_0x2bf086) {
  const _0x487636 = new Set();
  if (!_0x2bf086 || typeof _0x2bf086.get !== "function") {
    return _0x487636;
  }
  const _0x1be74a = _0x2bf086.get(STORE_KEY, []);
  if (!Array.isArray(_0x1be74a)) {
    return _0x487636;
  }
  for (const _0x4a8e15 of _0x1be74a) {
    const _0x201e7c = String(_0x4a8e15 || "").trim();
    if (_0x201e7c && _0x201e7c.length >= 15 && !_0x201e7c.startsWith("nick:")) {
      _0x487636.add(_0x201e7c);
    }
  }
  return _0x487636;
}
function saveGlobalKeySet(_0x5d32b0, _0x161c7e) {
  if (!_0x5d32b0 || typeof _0x5d32b0.set !== "function") {
    return;
  }
  const _0x3c9573 = [...(_0x161c7e || [])].filter(Boolean).slice(-MAX_KEYS);
  _0x5d32b0.set(STORE_KEY, _0x3c9573);
}
function leadExistsInPool(_0x1c5493) {
  if (!_0x1c5493) {
    return false;
  }
  try {
    const _0x4414dd = require("./dbManager");
    if (!_0x4414dd.isLeadsRuntimeReady?.()) {
      return false;
    }
    const _0x14731c = _0x4414dd.getLeadById?.(_0x1c5493) || _0x4414dd.getLeadByUserKey?.(_0x1c5493);
    return !!_0x14731c;
  } catch (_0x2b0ce5) {
    return false;
  }
}
function claimGlobalMonitorUser(_0x1b5e92, _0x2558c9 = {}) {
  const _0x20d7b1 = buildMonitorUserDedupKey(_0x2558c9);
  if (!_0x20d7b1) {
    return {
      claimed: true,
      key: "",
      reason: "no_sec_uid"
    };
  }
  const _0x259fbe = loadGlobalKeySet(_0x1b5e92);
  if (_0x259fbe.has(_0x20d7b1)) {
    return {
      claimed: false,
      key: _0x20d7b1,
      reason: "global_seen"
    };
  }
  if (leadExistsInPool(_0x20d7b1)) {
    _0x259fbe.add(_0x20d7b1);
    saveGlobalKeySet(_0x1b5e92, _0x259fbe);
    return {
      claimed: false,
      key: _0x20d7b1,
      reason: "lead_pool"
    };
  }
  _0x259fbe.add(_0x20d7b1);
  saveGlobalKeySet(_0x1b5e92, _0x259fbe);
  return {
    claimed: true,
    key: _0x20d7b1,
    reason: "claimed"
  };
}
function rememberGlobalMonitorUser(_0xc684c0, _0x4dd8cc = {}) {
  const _0x40d091 = buildMonitorUserDedupKey(_0x4dd8cc);
  if (!_0x40d091 || !_0xc684c0) {
    return "";
  }
  const _0x5e3e7f = loadGlobalKeySet(_0xc684c0);
  if (_0x5e3e7f.has(_0x40d091)) {
    return _0x40d091;
  }
  _0x5e3e7f.add(_0x40d091);
  saveGlobalKeySet(_0xc684c0, _0x5e3e7f);
  return _0x40d091;
}
function isGlobalKnownMonitorUser(_0x554a8f, _0x402c89 = {}) {
  const _0x401a52 = buildMonitorUserDedupKey(_0x402c89);
  if (!_0x401a52) {
    return false;
  }
  const _0x6b9b1b = loadGlobalKeySet(_0x554a8f);
  if (_0x6b9b1b.has(_0x401a52)) {
    return true;
  }
  return leadExistsInPool(_0x401a52);
}
module.exports = {
  STORE_KEY: STORE_KEY,
  loadGlobalKeySet: loadGlobalKeySet,
  saveGlobalKeySet: saveGlobalKeySet,
  claimGlobalMonitorUser: claimGlobalMonitorUser,
  rememberGlobalMonitorUser: rememberGlobalMonitorUser,
  isGlobalKnownMonitorUser: isGlobalKnownMonitorUser,
  leadExistsInPool: leadExistsInPool
};
'use strict';

const DEFAULT_MAX_KEYS_PER_REQUEST = 2000;
const DEFAULT_LEGACY_CACHE_TTL_MS = 5000;
function normalizeKeys(_0x1c3f6a, _0x146691 = DEFAULT_MAX_KEYS_PER_REQUEST) {
  const _0x1eb77c = [];
  const _0x91a6b4 = new Set();
  for (const _0xc29199 of Array.isArray(_0x1c3f6a) ? _0x1c3f6a : []) {
    const _0x45e503 = String(_0xc29199 || "").trim();
    if (!_0x45e503 || _0x91a6b4.has(_0x45e503)) {
      continue;
    }
    _0x91a6b4.add(_0x45e503);
    _0x1eb77c.push(_0x45e503);
    if (_0x1eb77c.length >= _0x146691) {
      break;
    }
  }
  return _0x1eb77c;
}
function createLeadDedupService({
  ipcMain: _0xa5222,
  dbManager: _0x2c6d00,
  isLeadsSqliteRuntime: _0x114564,
  collectAllLeadUserKeysFromHistory: _0x51c56e,
  collectBlacklistIdentifiers: _0x352358,
  maxKeysPerRequest = DEFAULT_MAX_KEYS_PER_REQUEST,
  legacyCacheTtlMs = DEFAULT_LEGACY_CACHE_TTL_MS
} = {}) {
  let _0x155450 = null;
  let _0x2cc799 = 0;
  let _0x40cd80 = false;
  function _0x4e00d3() {
    const _0x25f4c2 = Date.now();
    if (!_0x155450 || _0x25f4c2 - _0x2cc799 >= legacyCacheTtlMs) {
      _0x155450 = new Set(normalizeKeys(typeof _0x51c56e === "function" ? _0x51c56e() : [], Number.MAX_SAFE_INTEGER));
      _0x2cc799 = _0x25f4c2;
    }
    return _0x155450;
  }
  function _0x4e8cde() {
    _0x155450 = null;
    _0x2cc799 = 0;
  }
  function _0x5c2287(_0x5455ee) {
    const _0x4fa765 = normalizeKeys(_0x5455ee, maxKeysPerRequest);
    if (!_0x4fa765.length) {
      return {
        matched: [],
        complete: true
      };
    }
    const _0x35532c = new Set();
    const _0x246454 = new Set(normalizeKeys(typeof _0x352358 === "function" ? _0x352358() : [], Number.MAX_SAFE_INTEGER));
    _0x4fa765.forEach(_0x27653f => {
      if (_0x246454.has(_0x27653f)) {
        _0x35532c.add(_0x27653f);
      }
    });
    if (typeof _0x114564 === "function" && _0x114564()) {
      const _0x53aaf5 = _0x2c6d00?.findExistingLeadUserKeys?.(_0x4fa765) || [];
      _0x53aaf5.forEach(_0x16dc61 => _0x35532c.add(String(_0x16dc61 || "").trim()));
    } else {
      const _0x39099b = _0x4e00d3();
      _0x4fa765.forEach(_0x478e2a => {
        if (_0x39099b.has(_0x478e2a)) {
          _0x35532c.add(_0x478e2a);
        }
      });
    }
    return {
      matched: [..._0x35532c].filter(Boolean),
      complete: true
    };
  }
  function _0x3f04e0() {
    if (_0x40cd80 || !_0xa5222?.handle) {
      return;
    }
    _0x40cd80 = true;
    _0xa5222.handle("check-interacted-user-keys", async (_0x3d4037, _0x3e018f = {}) => {
      try {
        return _0x5c2287(_0x3e018f.keys);
      } catch (_0x978185) {
        console.warn("[LeadDedup] 批量历史去重查询失败:", _0x978185?.message || _0x978185);
        return {
          matched: [],
          complete: false,
          reason: _0x978185?.message || String(_0x978185)
        };
      }
    });
  }
  return {
    checkInteractedUserKeys: _0x5c2287,
    invalidateLegacyCache: _0x4e8cde,
    registerIpc: _0x3f04e0
  };
}
module.exports = {
  DEFAULT_MAX_KEYS_PER_REQUEST: DEFAULT_MAX_KEYS_PER_REQUEST,
  normalizeKeys: normalizeKeys,
  createLeadDedupService: createLeadDedupService
};
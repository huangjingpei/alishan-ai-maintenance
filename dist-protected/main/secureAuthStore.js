'use strict';

const AUTH_SECRET_KEYS = Object.freeze(["auth_token", "auth_code", "auth_license"]);
const BLOB_PREFIX = "ssv1:";
function isAuthSecretKey(_0xfa022a) {
  return AUTH_SECRET_KEYS.includes(String(_0xfa022a || ""));
}
function isEncryptedBlob(_0xf4d74f) {
  return typeof _0xf4d74f === "string" && _0xf4d74f.startsWith(BLOB_PREFIX);
}
function createSecureAuthStore({
  store: _0x4baf29,
  app: _0x3a26d8,
  safeStorage: _0x20852f
} = {}) {
  if (!_0x4baf29 || typeof _0x4baf29.get !== "function" || typeof _0x4baf29.set !== "function") {
    throw new Error("secureAuthStore requires electron-store instance");
  }
  const _0x10851e = _0x4baf29.get.bind(_0x4baf29);
  const _0x35ef96 = _0x4baf29.set.bind(_0x4baf29);
  const _0x30fa18 = typeof _0x4baf29.has === "function" ? _0x4baf29.has.bind(_0x4baf29) : null;
  const _0x5e5211 = typeof _0x4baf29.delete === "function" ? _0x4baf29.delete.bind(_0x4baf29) : null;
  function _0x1ca425() {
    try {
      if (_0x3a26d8 && typeof _0x3a26d8.isReady === "function" && !_0x3a26d8.isReady()) {
        return false;
      }
      return !!_0x20852f && typeof _0x20852f.isEncryptionAvailable === "function" && !!_0x20852f.isEncryptionAvailable();
    } catch (_0x2cf3c7) {
      return false;
    }
  }
  function _0x1802d6(_0x9391f0) {
    const _0x356872 = _0x20852f.encryptString(String(_0x9391f0));
    return BLOB_PREFIX + Buffer.from(_0x356872).toString("base64");
  }
  function _0x7afa4e(_0x1f19cc) {
    const _0x2d3830 = String(_0x1f19cc).slice(BLOB_PREFIX.length);
    const _0x1d7e72 = Buffer.from(_0x2d3830, "base64");
    return _0x20852f.decryptString(_0x1d7e72);
  }
  function _0x20f180(_0x10e647) {
    if (_0x10e647 == null) {
      return "";
    }
    if (typeof _0x10e647 === "string") {
      return _0x10e647;
    }
    return JSON.stringify(_0x10e647);
  }
  function _0x4b40de(_0x5ac729) {
    if (_0x5ac729 == null || _0x5ac729 === "") {
      return {};
    }
    try {
      const _0x55ea3d = JSON.parse(_0x5ac729);
      if (_0x55ea3d && typeof _0x55ea3d === "object") {
        return _0x55ea3d;
      } else {
        return {};
      }
    } catch (_0x14d4e6) {
      return {};
    }
  }
  function _0x4dd4d9(_0x4abc8f, _0xb6b28f) {
    if (!_0x1ca425()) {
      if (_0x4abc8f === "auth_license") {
        _0x35ef96(_0x4abc8f, _0x4b40de(_0xb6b28f));
      } else {
        _0x35ef96(_0x4abc8f, _0xb6b28f);
      }
      return;
    }
    try {
      _0x35ef96(_0x4abc8f, _0x1802d6(_0xb6b28f));
    } catch (_0x11e961) {
      console.warn("[SecureAuthStore] 加密写入 " + _0x4abc8f + " 失败，回退明文:", _0x11e961?.message || _0x11e961);
      if (_0x4abc8f === "auth_license") {
        _0x35ef96(_0x4abc8f, _0x4b40de(_0xb6b28f));
      } else {
        _0x35ef96(_0x4abc8f, _0xb6b28f);
      }
    }
  }
  function _0x529290(_0x374b0c, _0x2b81c9) {
    const _0x43601f = _0x10851e(_0x374b0c, undefined);
    if (_0x43601f === undefined || _0x43601f === null || _0x43601f === "") {
      if (_0x2b81c9 !== undefined) {
        return _0x2b81c9;
      } else if (_0x374b0c === "auth_license") {
        return {};
      } else {
        return _0x43601f;
      }
    }
    if (_0x374b0c === "auth_license" && typeof _0x43601f === "object" && !Array.isArray(_0x43601f)) {
      if (_0x1ca425()) {
        try {
          _0x4dd4d9(_0x374b0c, _0x20f180(_0x43601f));
        } catch (_0x15e8d1) {}
      }
      return _0x43601f;
    }
    if (typeof _0x43601f !== "string") {
      if (_0x2b81c9 !== undefined) {
        return _0x2b81c9;
      } else {
        return _0x43601f;
      }
    }
    if (!isEncryptedBlob(_0x43601f)) {
      if (_0x1ca425() && _0x43601f) {
        try {
          _0x4dd4d9(_0x374b0c, _0x374b0c === "auth_license" ? _0x20f180(_0x4b40de(_0x43601f)) : _0x43601f);
        } catch (_0x5267ca) {}
      }
      if (_0x374b0c === "auth_license") {
        return _0x4b40de(_0x43601f);
      }
      return _0x43601f;
    }
    if (!_0x1ca425()) {
      console.warn("[SecureAuthStore] 无法解密 " + _0x374b0c + "（safeStorage 不可用），需重新授权");
      if (_0x2b81c9 !== undefined) {
        return _0x2b81c9;
      } else if (_0x374b0c === "auth_license") {
        return {};
      } else {
        return null;
      }
    }
    try {
      const _0x379f91 = _0x7afa4e(_0x43601f);
      if (_0x374b0c === "auth_license") {
        return _0x4b40de(_0x379f91);
      }
      return _0x379f91;
    } catch (_0x5102f7) {
      console.warn("[SecureAuthStore] 解密 " + _0x374b0c + " 失败，已清除损坏数据:", _0x5102f7?.message || _0x5102f7);
      try {
        if (_0x5e5211) {
          _0x5e5211(_0x374b0c);
        }
      } catch (_0xb79cc5) {}
      if (_0x2b81c9 !== undefined) {
        return _0x2b81c9;
      } else if (_0x374b0c === "auth_license") {
        return {};
      } else {
        return null;
      }
    }
  }
  function _0x27befb(_0x5e3d6a, _0xab55f8) {
    if (_0xab55f8 === undefined) {
      if (_0x5e5211) {
        _0x5e5211(_0x5e3d6a);
      } else {
        _0x35ef96(_0x5e3d6a, undefined);
      }
      return;
    }
    if (_0x5e3d6a === "auth_license") {
      _0x4dd4d9(_0x5e3d6a, _0x20f180(_0xab55f8 || {}));
      return;
    }
    if (_0xab55f8 == null || _0xab55f8 === "") {
      if (_0x5e5211) {
        _0x5e5211(_0x5e3d6a);
      } else {
        _0x35ef96(_0x5e3d6a, "");
      }
      return;
    }
    _0x4dd4d9(_0x5e3d6a, String(_0xab55f8));
  }
  function _0x522737() {
    if (!_0x1ca425()) {
      console.log("[SecureAuthStore] safeStorage 不可用，授权字段保持明文兼容模式");
      return {
        migrated: 0,
        available: false
      };
    }
    let _0x2a6c36 = 0;
    for (const _0x5d81d2 of AUTH_SECRET_KEYS) {
      const _0x4f8221 = _0x10851e(_0x5d81d2, undefined);
      if (_0x4f8221 === undefined || _0x4f8221 === null || _0x4f8221 === "") {
        continue;
      }
      if (isEncryptedBlob(_0x4f8221)) {
        continue;
      }
      try {
        if (_0x5d81d2 === "auth_license") {
          const _0x2f805f = typeof _0x4f8221 === "object" ? _0x4f8221 : _0x4b40de(_0x4f8221);
          _0x4dd4d9(_0x5d81d2, _0x20f180(_0x2f805f));
        } else {
          _0x4dd4d9(_0x5d81d2, String(_0x4f8221));
        }
        _0x2a6c36 += 1;
      } catch (_0x468b0c) {
        console.warn("[SecureAuthStore] 迁移 " + _0x5d81d2 + " 失败:", _0x468b0c?.message || _0x468b0c);
      }
    }
    if (_0x2a6c36 > 0) {
      console.log("[SecureAuthStore] 已将 " + _0x2a6c36 + " 个授权字段迁移为 safeStorage 密文");
    }
    return {
      migrated: _0x2a6c36,
      available: true
    };
  }
  _0x4baf29.get = function _0x336fdf(_0x234eb1, _0x13ba27) {
    if (isAuthSecretKey(_0x234eb1)) {
      return _0x529290(_0x234eb1, _0x13ba27);
    }
    return _0x10851e(_0x234eb1, _0x13ba27);
  };
  _0x4baf29.set = function _0x106652(_0x57de89, _0x54d986) {
    if (isAuthSecretKey(_0x57de89)) {
      _0x27befb(_0x57de89, _0x54d986);
      return _0x4baf29;
    }
    return _0x35ef96(_0x57de89, _0x54d986);
  };
  if (_0x30fa18) {
    _0x4baf29.has = function _0x2841f8(_0x23676e) {
      if (!isAuthSecretKey(_0x23676e)) {
        return _0x30fa18(_0x23676e);
      }
      const _0xa43307 = _0x529290(_0x23676e, null);
      if (_0x23676e === "auth_license") {
        return !!_0xa43307 && typeof _0xa43307 === "object" && !!Object.keys(_0xa43307).length;
      }
      return _0xa43307 != null && _0xa43307 !== "";
    };
  }
  return {
    migratePlaintextAuthSecrets: _0x522737,
    encryptionAvailable: _0x1ca425,
    AUTH_SECRET_KEYS: AUTH_SECRET_KEYS
  };
}
module.exports = {
  AUTH_SECRET_KEYS: AUTH_SECRET_KEYS,
  BLOB_PREFIX: BLOB_PREFIX,
  isEncryptedBlob: isEncryptedBlob,
  createSecureAuthStore: createSecureAuthStore
};
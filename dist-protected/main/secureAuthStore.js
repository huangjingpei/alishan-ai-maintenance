'use strict';

const AUTH_SECRET_KEYS = Object.freeze(["auth_token", "auth_code", "auth_license"]);
const BLOB_PREFIX = "ssv1:";
function isAuthSecretKey(arg1) {
  return AUTH_SECRET_KEYS.includes(String(arg1 || ""));
}
function isEncryptedBlob(arg1) {
  return typeof arg1 === "string" && arg1.startsWith(BLOB_PREFIX);
}
function createSecureAuthStore({
  store: store,
  app: app,
  safeStorage: safeStorage
} = {}) {
  if (!store || typeof store.get !== "function" || typeof store.set !== "function") {
    throw new Error("secureAuthStore requires electron-store instance");
  }
  const result = store.get.bind(store);
  const result2 = store.set.bind(store);
  const value = typeof store.has === "function" ? store.has.bind(store) : null;
  const value2 = typeof store.delete === "function" ? store.delete.bind(store) : null;
  function fn() {
    try {
      if (app && typeof app.isReady === "function" && !app.isReady()) {
        return false;
      }
      return !!safeStorage && typeof safeStorage.isEncryptionAvailable === "function" && !!safeStorage.isEncryptionAvailable();
    } catch (error) {
      return false;
    }
  }
  function fn2(arg1) {
    const result = safeStorage.encryptString(String(arg1));
    return BLOB_PREFIX + Buffer.from(result).toString("base64");
  }
  function fn3(arg1) {
    const result = String(arg1).slice(BLOB_PREFIX.length);
    const result2 = Buffer.from(result, "base64");
    return safeStorage.decryptString(result2);
  }
  function fn4(arg1) {
    if (arg1 == null) {
      return "";
    }
    if (typeof arg1 === "string") {
      return arg1;
    }
    return JSON.stringify(arg1);
  }
  function fn5(arg1) {
    if (arg1 == null || arg1 === "") {
      return {};
    }
    try {
      const result = JSON.parse(arg1);
      if (result && typeof result === "object") {
        return result;
      } else {
        return {};
      }
    } catch (error) {
      return {};
    }
  }
  function fn6(arg1, arg2) {
    if (!fn()) {
      if (arg1 === "auth_license") {
        result2(arg1, fn5(arg2));
      } else {
        result2(arg1, arg2);
      }
      return;
    }
    try {
      result2(arg1, fn2(arg2));
    } catch (error) {
      console.warn("[SecureAuthStore] 加密写入 " + arg1 + " 失败，回退明文:", error?.message || error);
      if (arg1 === "auth_license") {
        result2(arg1, fn5(arg2));
      } else {
        result2(arg1, arg2);
      }
    }
  }
  function fn7(arg1, arg2) {
    const result2 = result(arg1, undefined);
    if (result2 === undefined || result2 === null || result2 === "") {
      if (arg2 !== undefined) {
        return arg2;
      } else if (arg1 === "auth_license") {
        return {};
      } else {
        return result2;
      }
    }
    if (arg1 === "auth_license" && typeof result2 === "object" && !Array.isArray(result2)) {
      if (fn()) {
        try {
          fn6(arg1, fn4(result2));
        } catch (error) {}
      }
      return result2;
    }
    if (typeof result2 !== "string") {
      if (arg2 !== undefined) {
        return arg2;
      } else {
        return result2;
      }
    }
    if (!isEncryptedBlob(result2)) {
      if (fn() && result2) {
        try {
          fn6(arg1, arg1 === "auth_license" ? fn4(fn5(result2)) : result2);
        } catch (error) {}
      }
      if (arg1 === "auth_license") {
        return fn5(result2);
      }
      return result2;
    }
    if (!fn()) {
      console.warn("[SecureAuthStore] 无法解密 " + arg1 + "（safeStorage 不可用），需重新授权");
      if (arg2 !== undefined) {
        return arg2;
      } else if (arg1 === "auth_license") {
        return {};
      } else {
        return null;
      }
    }
    try {
      const result = fn3(result2);
      if (arg1 === "auth_license") {
        return fn5(result);
      }
      return result;
    } catch (error) {
      console.warn("[SecureAuthStore] 解密 " + arg1 + " 失败，已清除损坏数据:", error?.message || error);
      try {
        if (value2) {
          value2(arg1);
        }
      } catch (error) {}
      if (arg2 !== undefined) {
        return arg2;
      } else if (arg1 === "auth_license") {
        return {};
      } else {
        return null;
      }
    }
  }
  function fn8(arg1, arg2) {
    if (arg2 === undefined) {
      if (value2) {
        value2(arg1);
      } else {
        result2(arg1, undefined);
      }
      return;
    }
    if (arg1 === "auth_license") {
      fn6(arg1, fn4(arg2 || {}));
      return;
    }
    if (arg2 == null || arg2 === "") {
      if (value2) {
        value2(arg1);
      } else {
        result2(arg1, "");
      }
      return;
    }
    fn6(arg1, String(arg2));
  }
  function migratePlaintextAuthSecrets() {
    if (!fn()) {
      console.log("[SecureAuthStore] safeStorage 不可用，授权字段保持明文兼容模式");
      return {
        migrated: 0,
        available: false
      };
    }
    let num = 0;
    for (const item of AUTH_SECRET_KEYS) {
      const result2 = result(item, undefined);
      if (result2 === undefined || result2 === null || result2 === "") {
        continue;
      }
      if (isEncryptedBlob(result2)) {
        continue;
      }
      try {
        if (item === "auth_license") {
          const value = typeof result2 === "object" ? result2 : fn5(result2);
          fn6(item, fn4(value));
        } else {
          fn6(item, String(result2));
        }
        num += 1;
      } catch (error) {
        console.warn("[SecureAuthStore] 迁移 " + item + " 失败:", error?.message || error);
      }
    }
    if (num > 0) {
      console.log("[SecureAuthStore] 已将 " + num + " 个授权字段迁移为 safeStorage 密文");
    }
    return {
      migrated: num,
      available: true
    };
  }
  store.get = function fn(arg1, arg2) {
    if (isAuthSecretKey(arg1)) {
      return fn7(arg1, arg2);
    }
    return result(arg1, arg2);
  };
  store.set = function fn(arg1, arg2) {
    if (isAuthSecretKey(arg1)) {
      fn8(arg1, arg2);
      return store;
    }
    return result2(arg1, arg2);
  };
  if (value) {
    store.has = function fn(arg1) {
      if (!isAuthSecretKey(arg1)) {
        return value(arg1);
      }
      const result = fn7(arg1, null);
      if (arg1 === "auth_license") {
        return !!result && typeof result === "object" && !!Object.keys(result).length;
      }
      return result != null && result !== "";
    };
  }
  return {
    migratePlaintextAuthSecrets: migratePlaintextAuthSecrets,
    encryptionAvailable: fn,
    AUTH_SECRET_KEYS: AUTH_SECRET_KEYS
  };
}
module.exports = {
  AUTH_SECRET_KEYS: AUTH_SECRET_KEYS,
  BLOB_PREFIX: BLOB_PREFIX,
  isEncryptedBlob: isEncryptedBlob,
  createSecureAuthStore: createSecureAuthStore
};
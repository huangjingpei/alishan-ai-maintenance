const fs = require("fs");
const Conf = require("conf");
const ElectronStore = require("electron-store");
const ATOMIC_WRITE_RETRY_CODES = new Set(["EPERM", "EACCES", "EBUSY", "EXDEV"]);
const MAX_ATOMIC_ATTEMPTS = 6;
const DEBOUNCE_MS = 80;
let patched = false;
const pendingByConf = new WeakMap();
const liveConfs = new Set();
let flushInstalled = false;
function getOriginalWrite() {
  return getOriginalWrite._fn;
}
function directConfWrite(_0x28c4c9, _0x3b1de4) {
  _0x28c4c9._ensureDirectory();
  const _0x4a5281 = _0x28c4c9._serialize(_0x3b1de4);
  const _0x51074c = 438;
  fs.writeFileSync(_0x28c4c9.path, _0x4a5281, {
    mode: _0x51074c
  });
  console.warn("[SafeStore] 原子写入失败，已改用直接写入: " + _0x28c4c9.path);
}
function writeConfSyncBlocking(_0x26a0f4, _0x2bed1) {
  const _0x48a7e9 = getOriginalWrite();
  let _0x396c9b;
  for (let _0xae7fdb = 1; _0xae7fdb <= MAX_ATOMIC_ATTEMPTS; _0xae7fdb++) {
    try {
      _0x48a7e9.call(_0x26a0f4, _0x2bed1);
      return;
    } catch (_0x496fa8) {
      _0x396c9b = _0x496fa8;
      if (!ATOMIC_WRITE_RETRY_CODES.has(_0x496fa8?.code) || _0xae7fdb >= MAX_ATOMIC_ATTEMPTS) {
        break;
      }
      const _0x4b3a33 = Date.now() + _0xae7fdb * 40;
      while (Date.now() < _0x4b3a33) {}
    }
  }
  try {
    directConfWrite(_0x26a0f4, _0x2bed1);
  } catch (_0x1709a6) {
    console.error("[SafeStore] 直接写入仍失败:", _0x1709a6.message);
    throw _0x396c9b || _0x1709a6;
  }
}
function attemptWriteAsync(_0x6db361, _0x39ced2, _0x5343c3 = 1) {
  const _0x40a093 = getOriginalWrite();
  try {
    _0x40a093.call(_0x6db361, _0x39ced2);
    return;
  } catch (_0x2edab0) {
    if (ATOMIC_WRITE_RETRY_CODES.has(_0x2edab0?.code) && _0x5343c3 < MAX_ATOMIC_ATTEMPTS) {
      const _0x504fc5 = setTimeout(() => {
        try {
          attemptWriteAsync(_0x6db361, _0x39ced2, _0x5343c3 + 1);
        } catch (_0x8507a3) {
          console.error("[SafeStore] 异步重试仍失败:", _0x8507a3?.message || _0x8507a3);
        }
      }, _0x5343c3 * 40);
      _0x504fc5.unref?.();
      return;
    }
    try {
      directConfWrite(_0x6db361, _0x39ced2);
    } catch (_0x254ef4) {
      console.error("[SafeStore] 直接写入仍失败:", _0x254ef4.message);
      throw _0x2edab0;
    }
  }
}
function getPending(_0xf830c8) {
  let _0x36fd13 = pendingByConf.get(_0xf830c8);
  if (!_0x36fd13) {
    _0x36fd13 = {
      value: null,
      timer: null
    };
    pendingByConf.set(_0xf830c8, _0x36fd13);
    liveConfs.add(_0xf830c8);
  }
  return _0x36fd13;
}
function flushConf(_0x3c0fde, {
  sync = false
} = {}) {
  const _0x138c9d = pendingByConf.get(_0x3c0fde);
  if (!_0x138c9d || _0x138c9d.value == null) {
    return;
  }
  if (_0x138c9d.timer) {
    clearTimeout(_0x138c9d.timer);
    _0x138c9d.timer = null;
  }
  const _0x3cc2f3 = _0x138c9d.value;
  _0x138c9d.value = null;
  if (sync) {
    writeConfSyncBlocking(_0x3c0fde, _0x3cc2f3);
    return;
  }
  attemptWriteAsync(_0x3c0fde, _0x3cc2f3, 1);
}
function flushAllPendingStoresSync() {
  for (const _0x20984f of [...liveConfs]) {
    try {
      flushConf(_0x20984f, {
        sync: true
      });
    } catch (_0x408e63) {
      console.error("[SafeStore] 退出前 flush 失败:", _0x408e63?.message || _0x408e63);
    }
  }
}
function installFlushHooks() {
  if (flushInstalled) {
    return;
  }
  flushInstalled = true;
  process.on("exit", () => {
    try {
      flushAllPendingStoresSync();
    } catch (_0xf2700b) {}
  });
  process.on("beforeExit", () => {
    try {
      flushAllPendingStoresSync();
    } catch (_0x4b5d4f) {}
  });
  try {
    const {
      app: _0x232683
    } = require("electron");
    if (_0x232683 && typeof _0x232683.on === "function") {
      _0x232683.on("before-quit", () => {
        try {
          flushAllPendingStoresSync();
        } catch (_0xa4feeb) {}
      });
      _0x232683.on("will-quit", () => {
        try {
          flushAllPendingStoresSync();
        } catch (_0xa13e5e) {}
      });
    }
  } catch (_0x378914) {}
}
function patchConfWrites() {
  if (patched) {
    return;
  }
  patched = true;
  getOriginalWrite._fn = Conf.prototype._write;
  installFlushHooks();
  Conf.prototype._write = function _0x449de8(_0x579d5a) {
    const _0x352347 = getPending(this);
    _0x352347.value = _0x579d5a;
    if (_0x352347.timer) {
      clearTimeout(_0x352347.timer);
    }
    _0x352347.timer = setTimeout(() => {
      _0x352347.timer = null;
      try {
        flushConf(this);
      } catch (_0x5af39d) {
        console.error("[SafeStore] 延后写入失败:", _0x5af39d?.message || _0x5af39d);
      }
    }, DEBOUNCE_MS);
    _0x352347.timer.unref?.();
  };
}
function createElectronStore(_0x33bf7c) {
  patchConfWrites();
  return new ElectronStore(_0x33bf7c);
}
function installConfigWriteExceptionGuard() {
  if (installConfigWriteExceptionGuard.installed) {
    return;
  }
  installConfigWriteExceptionGuard.installed = true;
  process.on("uncaughtException", _0x2e9d85 => {
    const _0x4450b6 = String(_0x2e9d85?.message || _0x2e9d85 || "");
    if (_0x2e9d85?.code === "EPERM" && /config\.json/i.test(_0x4450b6)) {
      console.error("[SafeStore] 已抑制 config.json 写入 EPERM（功能可继续）:", _0x4450b6);
      return;
    }
  });
}
if (process.platform === "win32") {
  installConfigWriteExceptionGuard();
}
module.exports = {
  patchConfWrites: patchConfWrites,
  createElectronStore: createElectronStore,
  flushAllPendingStoresSync: flushAllPendingStoresSync,
  DEBOUNCE_MS: DEBOUNCE_MS
};
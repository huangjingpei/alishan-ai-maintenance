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
function directConfWrite(arg1, arg2) {
  arg1._ensureDirectory();
  const result = arg1._serialize(arg2);
  const num = 438;
  fs.writeFileSync(arg1.path, result, {
    mode: num
  });
  console.warn("[SafeStore] 原子写入失败，已改用直接写入: " + arg1.path);
}
function writeConfSyncBlocking(arg1, arg2) {
  const result = getOriginalWrite();
  let local;
  for (let num = 1; num <= MAX_ATOMIC_ATTEMPTS; num++) {
    try {
      result.call(arg1, arg2);
      return;
    } catch (error) {
      local = error;
      if (!ATOMIC_WRITE_RETRY_CODES.has(error?.code) || num >= MAX_ATOMIC_ATTEMPTS) {
        break;
      }
      const value = Date.now() + num * 40;
      while (Date.now() < value) {}
    }
  }
  try {
    directConfWrite(arg1, arg2);
  } catch (error) {
    console.error("[SafeStore] 直接写入仍失败:", error.message);
    throw local || error;
  }
}
function attemptWriteAsync(arg1, arg2, num = 1) {
  const result = getOriginalWrite();
  try {
    result.call(arg1, arg2);
    return;
  } catch (error) {
    if (ATOMIC_WRITE_RETRY_CODES.has(error?.code) && num < MAX_ATOMIC_ATTEMPTS) {
      const result = setTimeout(() => {
        try {
          attemptWriteAsync(arg1, arg2, num + 1);
        } catch (error) {
          console.error("[SafeStore] 异步重试仍失败:", error?.message || error);
        }
      }, num * 40);
      result.unref?.();
      return;
    }
    try {
      directConfWrite(arg1, arg2);
    } catch (error2) {
      console.error("[SafeStore] 直接写入仍失败:", error2.message);
      throw error;
    }
  }
}
function getPending(arg1) {
  let result = pendingByConf.get(arg1);
  if (!result) {
    result = {
      value: null,
      timer: null
    };
    pendingByConf.set(arg1, result);
    liveConfs.add(arg1);
  }
  return result;
}
function flushConf(arg1, {
  sync = false
} = {}) {
  const result = pendingByConf.get(arg1);
  if (!result || result.value == null) {
    return;
  }
  if (result.timer) {
    clearTimeout(result.timer);
    result.timer = null;
  }
  const value = result.value;
  result.value = null;
  if (sync) {
    writeConfSyncBlocking(arg1, value);
    return;
  }
  attemptWriteAsync(arg1, value, 1);
}
function flushAllPendingStoresSync() {
  for (const item of [...liveConfs]) {
    try {
      flushConf(item, {
        sync: true
      });
    } catch (error) {
      console.error("[SafeStore] 退出前 flush 失败:", error?.message || error);
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
    } catch (error) {}
  });
  process.on("beforeExit", () => {
    try {
      flushAllPendingStoresSync();
    } catch (error) {}
  });
  try {
    const {
      app: app
    } = require("electron");
    if (app && typeof app.on === "function") {
      app.on("before-quit", () => {
        try {
          flushAllPendingStoresSync();
        } catch (error) {}
      });
      app.on("will-quit", () => {
        try {
          flushAllPendingStoresSync();
        } catch (error) {}
      });
    }
  } catch (error) {}
}
function patchConfWrites() {
  if (patched) {
    return;
  }
  patched = true;
  getOriginalWrite._fn = Conf.prototype._write;
  installFlushHooks();
  Conf.prototype._write = function fn(arg1) {
    const result = getPending(this);
    result.value = arg1;
    if (result.timer) {
      clearTimeout(result.timer);
    }
    result.timer = setTimeout(() => {
      result.timer = null;
      try {
        flushConf(this);
      } catch (error) {
        console.error("[SafeStore] 延后写入失败:", error?.message || error);
      }
    }, DEBOUNCE_MS);
    result.timer.unref?.();
  };
}
function createElectronStore(arg1) {
  patchConfWrites();
  return new ElectronStore(arg1);
}
function installConfigWriteExceptionGuard() {
  if (installConfigWriteExceptionGuard.installed) {
    return;
  }
  installConfigWriteExceptionGuard.installed = true;
  process.on("uncaughtException", arg1 => {
    const result = String(arg1?.message || arg1 || "");
    if (arg1?.code === "EPERM" && /config\.json/i.test(result)) {
      console.error("[SafeStore] 已抑制 config.json 写入 EPERM（功能可继续）:", result);
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
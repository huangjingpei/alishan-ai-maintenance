const {
  powerSaveBlocker
} = require("electron");
const activeTokens = new Map();
const changeListeners = new Set();
let blockerId = null;
let heartbeatTimer = null;
const GUARD_HEARTBEAT_INTERVAL_MS = 30000;
function notifyChange() {
  const _0x271672 = getTaskRuntimeGuardSnapshot();
  for (const _0x4f9fbb of [...changeListeners]) {
    try {
      _0x4f9fbb(_0x271672);
    } catch (_0x181fdb) {
      console.warn("[TaskRuntimeGuard] 状态监听器异常:", _0x181fdb?.message || _0x181fdb);
    }
  }
}
function normalizeToken(_0x33eca5) {
  return String(_0x33eca5 || "").trim();
}
function isBlockerStarted() {
  if (blockerId == null) {
    return false;
  }
  try {
    return typeof powerSaveBlocker?.isStarted !== "function" || powerSaveBlocker.isStarted(blockerId);
  } catch (_0x37717f) {
    return false;
  }
}
function ensureBlocker() {
  if (activeTokens.size === 0) {
    return false;
  }
  if (isBlockerStarted()) {
    return true;
  }
  blockerId = null;
  try {
    blockerId = powerSaveBlocker?.start?.("prevent-app-suspension") ?? null;
  } catch (_0x536d1b) {
    console.warn("[TaskRuntimeGuard] 启动防挂起守护失败:", _0x536d1b?.message || _0x536d1b);
    blockerId = null;
  }
  return isBlockerStarted();
}
function ensureGuardHeartbeat() {
  if (heartbeatTimer || activeTokens.size === 0) {
    return;
  }
  heartbeatTimer = setInterval(() => {
    if (activeTokens.size === 0) {
      return;
    }
    const _0x48fca1 = isBlockerStarted();
    const _0x5333e1 = ensureBlocker();
    if (!_0x48fca1 && _0x5333e1) {
      console.warn("[TaskRuntimeGuard] 检测到防挂起守护失效，已自动恢复");
      notifyChange();
    }
  }, GUARD_HEARTBEAT_INTERVAL_MS);
  if (typeof heartbeatTimer.unref === "function") {
    heartbeatTimer.unref();
  }
}
function stopGuardHeartbeatIfIdle() {
  if (activeTokens.size > 0 || !heartbeatTimer) {
    return;
  }
  clearInterval(heartbeatTimer);
  heartbeatTimer = null;
}
function stopBlockerIfIdle() {
  if (activeTokens.size > 0 || blockerId == null) {
    return false;
  }
  const _0x2db22b = blockerId;
  blockerId = null;
  try {
    if (typeof powerSaveBlocker?.isStarted !== "function" || powerSaveBlocker.isStarted(_0x2db22b)) {
      powerSaveBlocker?.stop?.(_0x2db22b);
    }
    return true;
  } catch (_0x22db22) {
    console.warn("[TaskRuntimeGuard] 释放防挂起守护失败:", _0x22db22?.message || _0x22db22);
    return false;
  }
}
function acquireTaskRuntimeGuard(_0x224d45, _0x5cd705 = {}) {
  const _0x4205a3 = normalizeToken(_0x224d45);
  if (!_0x4205a3) {
    return false;
  }
  activeTokens.set(_0x4205a3, {
    ...(activeTokens.get(_0x4205a3) || {}),
    ...(_0x5cd705 && typeof _0x5cd705 === "object" ? _0x5cd705 : {}),
    acquiredAt: activeTokens.get(_0x4205a3)?.acquiredAt || Date.now(),
    touchedAt: Date.now()
  });
  const _0x1d787b = ensureBlocker();
  ensureGuardHeartbeat();
  notifyChange();
  return _0x1d787b;
}
function releaseTaskRuntimeGuard(_0x466814) {
  const _0x1c46b9 = normalizeToken(_0x466814);
  if (!_0x1c46b9) {
    return false;
  }
  const _0xbfa444 = activeTokens.delete(_0x1c46b9);
  if (activeTokens.size > 0) {
    ensureBlocker();
  } else {
    stopBlockerIfIdle();
    stopGuardHeartbeatIfIdle();
  }
  if (_0xbfa444) {
    notifyChange();
  }
  return _0xbfa444;
}
function releaseTaskRuntimeGuardsByPrefix(_0x523371) {
  const _0x4bf2c9 = normalizeToken(_0x523371);
  if (!_0x4bf2c9) {
    return 0;
  }
  let _0x2633ce = 0;
  for (const _0x491008 of [...activeTokens.keys()]) {
    if (!_0x491008.startsWith(_0x4bf2c9)) {
      continue;
    }
    activeTokens.delete(_0x491008);
    _0x2633ce += 1;
  }
  if (activeTokens.size > 0) {
    ensureBlocker();
  } else {
    stopBlockerIfIdle();
    stopGuardHeartbeatIfIdle();
  }
  if (_0x2633ce > 0) {
    notifyChange();
  }
  return _0x2633ce;
}
function clearTaskRuntimeGuards() {
  const _0x1f31c0 = activeTokens.size > 0;
  activeTokens.clear();
  stopBlockerIfIdle();
  stopGuardHeartbeatIfIdle();
  if (_0x1f31c0) {
    notifyChange();
  }
}
function refreshTaskRuntimeGuard() {
  const _0x5dc5a3 = isBlockerStarted();
  const _0x15a6a1 = ensureBlocker();
  if (activeTokens.size > 0) {
    ensureGuardHeartbeat();
  } else {
    stopGuardHeartbeatIfIdle();
  }
  if (_0x5dc5a3 !== _0x15a6a1) {
    notifyChange();
  }
  return getTaskRuntimeGuardSnapshot();
}
function getTaskRuntimeGuardSnapshot() {
  return {
    activeCount: activeTokens.size,
    blockerId: blockerId,
    blockerStarted: isBlockerStarted(),
    tokens: [...activeTokens.entries()].map(([_0x27bc40, _0x3fa58c]) => ({
      token: _0x27bc40,
      ..._0x3fa58c
    }))
  };
}
function onTaskRuntimeGuardChange(_0x5aa7fa) {
  if (typeof _0x5aa7fa !== "function") {
    return () => {};
  }
  changeListeners.add(_0x5aa7fa);
  return () => changeListeners.delete(_0x5aa7fa);
}
module.exports = {
  acquireTaskRuntimeGuard: acquireTaskRuntimeGuard,
  releaseTaskRuntimeGuard: releaseTaskRuntimeGuard,
  releaseTaskRuntimeGuardsByPrefix: releaseTaskRuntimeGuardsByPrefix,
  clearTaskRuntimeGuards: clearTaskRuntimeGuards,
  refreshTaskRuntimeGuard: refreshTaskRuntimeGuard,
  getTaskRuntimeGuardSnapshot: getTaskRuntimeGuardSnapshot,
  onTaskRuntimeGuardChange: onTaskRuntimeGuardChange
};
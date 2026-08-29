const {
  powerSaveBlocker
} = require("electron");
const activeTokens = new Map();
const changeListeners = new Set();
let blockerId = null;
let heartbeatTimer = null;
const GUARD_HEARTBEAT_INTERVAL_MS = 30000;
function notifyChange() {
  const result = getTaskRuntimeGuardSnapshot();
  for (const item of [...changeListeners]) {
    try {
      item(result);
    } catch (error) {
      console.warn("[TaskRuntimeGuard] 状态监听器异常:", error?.message || error);
    }
  }
}
function normalizeToken(arg1) {
  return String(arg1 || "").trim();
}
function isBlockerStarted() {
  if (blockerId == null) {
    return false;
  }
  try {
    return typeof powerSaveBlocker?.isStarted !== "function" || powerSaveBlocker.isStarted(blockerId);
  } catch (error) {
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
  } catch (error) {
    console.warn("[TaskRuntimeGuard] 启动防挂起守护失败:", error?.message || error);
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
    const flag = isBlockerStarted();
    const result = ensureBlocker();
    if (!flag && result) {
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
  const local = blockerId;
  blockerId = null;
  try {
    if (typeof powerSaveBlocker?.isStarted !== "function" || powerSaveBlocker.isStarted(local)) {
      powerSaveBlocker?.stop?.(local);
    }
    return true;
  } catch (error) {
    console.warn("[TaskRuntimeGuard] 释放防挂起守护失败:", error?.message || error);
    return false;
  }
}
function acquireTaskRuntimeGuard(arg1, options = {}) {
  const result = normalizeToken(arg1);
  if (!result) {
    return false;
  }
  activeTokens.set(result, {
    ...(activeTokens.get(result) || {}),
    ...(options && typeof options === "object" ? options : {}),
    acquiredAt: activeTokens.get(result)?.acquiredAt || Date.now(),
    touchedAt: Date.now()
  });
  const result2 = ensureBlocker();
  ensureGuardHeartbeat();
  notifyChange();
  return result2;
}
function releaseTaskRuntimeGuard(arg1) {
  const result = normalizeToken(arg1);
  if (!result) {
    return false;
  }
  const result2 = activeTokens.delete(result);
  if (activeTokens.size > 0) {
    ensureBlocker();
  } else {
    stopBlockerIfIdle();
    stopGuardHeartbeatIfIdle();
  }
  if (result2) {
    notifyChange();
  }
  return result2;
}
function releaseTaskRuntimeGuardsByPrefix(arg1) {
  const result = normalizeToken(arg1);
  if (!result) {
    return 0;
  }
  let num = 0;
  for (const item of [...activeTokens.keys()]) {
    if (!item.startsWith(result)) {
      continue;
    }
    activeTokens.delete(item);
    num += 1;
  }
  if (activeTokens.size > 0) {
    ensureBlocker();
  } else {
    stopBlockerIfIdle();
    stopGuardHeartbeatIfIdle();
  }
  if (num > 0) {
    notifyChange();
  }
  return num;
}
function clearTaskRuntimeGuards() {
  const value = activeTokens.size > 0;
  activeTokens.clear();
  stopBlockerIfIdle();
  stopGuardHeartbeatIfIdle();
  if (value) {
    notifyChange();
  }
}
function refreshTaskRuntimeGuard() {
  const flag = isBlockerStarted();
  const result = ensureBlocker();
  if (activeTokens.size > 0) {
    ensureGuardHeartbeat();
  } else {
    stopGuardHeartbeatIfIdle();
  }
  if (flag !== result) {
    notifyChange();
  }
  return getTaskRuntimeGuardSnapshot();
}
function getTaskRuntimeGuardSnapshot() {
  return {
    activeCount: activeTokens.size,
    blockerId: blockerId,
    blockerStarted: isBlockerStarted(),
    tokens: [...activeTokens.entries()].map(([arg1, arg12]) => ({
      token: arg1,
      ...arg12
    }))
  };
}
function onTaskRuntimeGuardChange(arg1) {
  if (typeof arg1 !== "function") {
    return () => {};
  }
  changeListeners.add(arg1);
  return () => changeListeners.delete(arg1);
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
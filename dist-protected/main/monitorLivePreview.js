'use strict';

const {
  buildMonitorViewKey
} = require("./monitorAutomationViewHost");
function createMonitorLivePreviewController(options = {}) {
  const {
    getMainWindow: getMainWindow,
    getPlatformViews: getPlatformViews,
    getViewSettingsMap: getViewSettingsMap,
    getActiveTasks: getActiveTasks,
    getMonitorWindows: getMonitorWindows,
    automationLiveViewLifecycle: automationLiveViewLifecycle
  } = options;
  let local = null;
  function listActiveMonitorAccountIds(arg1 = null) {
    const set = new Set();
    const local = getActiveTasks?.() || new Map();
    const value = arg1 != null && arg1 !== "" ? [[String(arg1), local.get(String(arg1))]].filter(([, arg1]) => arg1) : [...local.entries()];
    for (const [, local] of value) {
      const value = Array.isArray(local?.accounts) ? local.accounts : [];
      for (const item of value) {
        const result = String(item?.id || item?.accountId || "").trim();
        if (result) {
          set.add(result);
        }
      }
    }
    return set;
  }
  function listMonitorLiveViewKeys({
    taskId = null,
    accountId = null
  } = {}) {
    let local;
    if (accountId != null && accountId !== "") {
      local = [String(accountId)];
    } else {
      const result = listActiveMonitorAccountIds(taskId);
      local = result.size ? [...result] : [];
    }
    const local2 = getMonitorWindows?.() || new Map();
    const local3 = getPlatformViews?.() || new Map();
    const list = [];
    local.forEach(arg1 => {
      const result = local2.get(String(arg1));
      if (!result || result.isDestroyed?.()) {
        return;
      }
      const local = result.__radarMonitorViewKey || buildMonitorViewKey(arg1);
      const local4 = local3.get?.(local);
      if (!local4 || local4.webContents?.isDestroyed?.()) {
        return;
      }
      list.push(local);
    });
    return list;
  }
  function showMonitorLivePreview({
    taskId = null,
    accountId = null
  } = {}) {
    const value = taskId != null && taskId !== "" ? String(taskId) : null;
    const local2 = getActiveTasks?.() || new Map();
    if (value && !local2.has(value)) {
      return {
        success: false,
        shown: 0,
        error: "任务未在运行"
      };
    }
    const result = listMonitorLiveViewKeys({
      taskId: value,
      accountId: accountId
    });
    if (!result.length) {
      return {
        success: false,
        shown: 0,
        error: "暂无监控窗口可打开",
        viewKeys: []
      };
    }
    local = {
      viewKeys: result,
      taskId: value,
      accountId: accountId != null ? String(accountId) : null,
      at: Date.now()
    };
    const local3 = getMainWindow?.();
    try {
      if (local3 && !local3.isDestroyed() && !local3.webContents?.isDestroyed?.()) {
        local3.webContents.send("video-monitor-open-live-preview", {
          viewKeys: result,
          taskId: value,
          accountId: accountId != null ? String(accountId) : null
        });
      }
    } catch (error) {}
    return {
      success: true,
      shown: result.length,
      viewKeys: result,
      livePreview: true
    };
  }
  function hideMonitorLivePreview({
    taskId = null,
    accountId = null
  } = {}) {
    const result = listMonitorLiveViewKeys({
      taskId: taskId,
      accountId: accountId
    });
    local = null;
    const local2 = getMainWindow?.();
    try {
      if (local2 && !local2.isDestroyed() && !local2.webContents?.isDestroyed?.()) {
        local2.webContents.send("video-monitor-close-live-preview", {
          viewKeys: result,
          taskId: taskId != null ? String(taskId) : null,
          accountId: accountId != null ? String(accountId) : null
        });
      }
    } catch (error) {}
    return {
      success: true,
      hidden: result.length,
      viewKeys: result,
      livePreview: true
    };
  }
  function consumePendingLivePreview() {
    if (!local) {
      return null;
    }
    const obj = {
      ...local,
      viewKeys: Array.isArray(local.viewKeys) ? [...local.viewKeys] : []
    };
    local = null;
    const local2 = getPlatformViews?.();
    const result = obj.viewKeys.filter(arg1 => {
      try {
        const local = local2?.get?.(arg1);
        return !!local && !local.webContents?.isDestroyed?.();
      } catch (error) {
        return false;
      }
    });
    if (!result.length) {
      return null;
    }
    return {
      ...obj,
      viewKeys: result
    };
  }
  function clearPendingLivePreview() {
    local = null;
  }
  function releaseMonitorLiveSurfaces(arg1 = null) {
    local = null;
    const local2 = getMonitorWindows?.() || new Map();
    const value = arg1 == null ? [...local2.keys()].map(String) : (Array.isArray(arg1) ? arg1 : [arg1]).map(String).filter(Boolean);
    const list = [];
    const local3 = getPlatformViews?.();
    value.forEach(arg1 => {
      const result = local2.get(String(arg1));
      if (!result || result.isDestroyed?.()) {
        return;
      }
      const local = result.__radarMonitorViewKey || buildMonitorViewKey(arg1);
      list.push(local);
      const local4 = local3?.get?.(local) || null;
      if (!local4) {
        return;
      }
      try {
        const value = typeof getViewSettingsMap === "function" ? getViewSettingsMap() : null;
        const local2 = value?.get?.(local);
        automationLiveViewLifecycle?.finishTask?.(local, {
          reason: "monitor-finished",
          settingsSnapshot: local2 && typeof local2 === "object" ? {
            ...local2
          } : null
        });
      } catch (error) {}
    });
    try {
      const local = getMainWindow?.();
      if (local && !local.isDestroyed() && !local.webContents?.isDestroyed?.()) {
        local.webContents.send("video-monitor-detach-live-preview", {
          viewKeys: list,
          accountIds: arg1 == null ? null : value
        });
      }
    } catch (error) {}
    return {
      viewKeys: list
    };
  }
  return {
    listActiveMonitorAccountIds: listActiveMonitorAccountIds,
    listMonitorLiveViewKeys: listMonitorLiveViewKeys,
    showMonitorLivePreview: showMonitorLivePreview,
    hideMonitorLivePreview: hideMonitorLivePreview,
    consumePendingLivePreview: consumePendingLivePreview,
    clearPendingLivePreview: clearPendingLivePreview,
    releaseMonitorLiveSurfaces: releaseMonitorLiveSurfaces
  };
}
module.exports = {
  createMonitorLivePreviewController: createMonitorLivePreviewController
};
'use strict';

function createAutomationLiveViewLifecycle(options = {}) {
  const {
    getPlatformViews: getPlatformViews,
    getViewSettingsMap: getViewSettingsMap,
    getBoundsStateByViewKey: getBoundsStateByViewKey,
    shouldAttachAutomationView: shouldAttachAutomationView,
    cancelPendingAutomationViewDestroy: cancelPendingAutomationViewDestroy,
    recoverMainAutomationView: recoverMainAutomationView,
    attachMainAutomationView: attachMainAutomationView,
    preserveAutomationViewAfterTaskFinish: preserveAutomationViewAfterTaskFinish,
    nudgeAutomationViewRepaint: nudgeAutomationViewRepaint,
    ensureAutomationPaintWatchdog: ensureAutomationPaintWatchdog,
    requestAutomationLayoutRefresh: requestAutomationLayoutRefresh,
    ensureBackgroundAutomationLayout: ensureBackgroundAutomationLayout,
    releaseBackgroundAutomationLayout: releaseBackgroundAutomationLayout,
    acquireEntityExecutionViewportLease: acquireEntityExecutionViewportLease,
    releaseEntityExecutionViewportLease: releaseEntityExecutionViewportLease
  } = options;
  const map = new Map();
  const map2 = new Map();
  function fn(arg1, arg2 = null) {
    if (String(arg1 || "").startsWith("entity_") && typeof releaseEntityExecutionViewportLease === "function") {
      return releaseEntityExecutionViewportLease(arg1, {
        taskGeneration: arg2?.generation ?? null
      });
    }
    return releaseBackgroundAutomationLayout?.(arg1);
  }
  function fn2(arg1) {
    const value = Number(map.get(arg1) || 0) + 1;
    map.set(arg1, value);
    return value;
  }
  function isCurrent(arg1, arg2) {
    return map.get(arg1) === arg2;
  }
  function beginTask(arg1, options = {}) {
    const local = getPlatformViews?.()?.get?.(arg1);
    if (!local || local.webContents?.isDestroyed?.()) {
      return {
        ok: false,
        generation: fn2(arg1),
        reason: "view_unavailable"
      };
    }
    const local2 = getViewSettingsMap?.();
    const local3 = local2?.get?.(arg1);
    const result = String(options.runtimeTaskId || options.taskId || "");
    const result2 = String(local3?.runtimeTaskId || local3?.taskId || "");
    if (local3 && !local3.finishedAt && result && result === result2 && map.has(arg1)) {
      wake(arg1);
      return {
        ok: true,
        generation: map.get(arg1),
        reused: true
      };
    }
    if (map2.has(arg1)) {
      const result = map2.get(arg1);
      map2.delete(arg1);
      try {
        fn(arg1, result);
      } catch (error) {}
    }
    const result3 = fn2(arg1);
    cancelPendingAutomationViewDestroy?.(arg1);
    if (local2) {
      const obj = {
        ...(local3 && typeof local3 === "object" ? local3 : {}),
        ...options,
        startedAt: Date.now(),
        liveViewGeneration: result3
      };
      delete obj.finishedAt;
      local2.set(arg1, obj);
    }
    ensureAutomationPaintWatchdog?.();
    const local4 = getBoundsStateByViewKey?.()?.get?.(arg1)?.bounds || null;
    if (shouldAttachAutomationView?.(arg1)) {
      recoverMainAutomationView?.(arg1, local4, {
        force: true
      });
    } else {
      attachMainAutomationView?.(arg1);
    }
    try {
      nudgeAutomationViewRepaint?.(local.webContents, local);
    } catch (error) {}
    requestAutomationLayoutRefresh?.();
    return {
      ok: true,
      generation: result3
    };
  }
  function wake(arg1) {
    const local = getPlatformViews?.()?.get?.(arg1);
    if (!local || local.webContents?.isDestroyed?.()) {
      return false;
    }
    ensureAutomationPaintWatchdog?.();
    try {
      local.webContents.setBackgroundThrottling?.(false);
      local.webContents.setFrameRate?.(30);
      local.webContents.invalidate?.();
    } catch (error) {}
    return true;
  }
  function finishTask(arg1, {
    reason = "completed",
    settingsSnapshot = null,
    skipHeavyRepaint = false
  } = {}) {
    const result = map2.get(arg1);
    fn2(arg1);
    map2.delete(arg1);
    try {
      fn(arg1, result);
    } catch (error) {}
    const local = getViewSettingsMap?.();
    if (local) {
      local.delete(arg1);
    }
    const local2 = preserveAutomationViewAfterTaskFinish?.(arg1, reason, {
      settingsSnapshot: settingsSnapshot,
      skipHeavyRepaint: skipHeavyRepaint
    });
    requestAutomationLayoutRefresh?.();
    return local2 !== false;
  }
  function invalidate(arg1) {
    if (map2.has(arg1)) {
      const result = map2.get(arg1);
      map2.delete(arg1);
      try {
        fn(arg1, result);
      } catch (error) {}
    }
    return fn2(arg1);
  }
  async function acquireExecutionViewport(arg1, {
    runtimeTaskId = ""
  } = {}) {
    const result = Number(map.get(arg1) || 0);
    const local = getPlatformViews?.()?.get?.(arg1);
    if (!result || !local || local.webContents?.isDestroyed?.()) {
      return {
        ok: false,
        reason: "view_unavailable",
        generation: result
      };
    }
    const obj = {
      generation: result,
      runtimeTaskId: String(runtimeTaskId || ""),
      acquiredAt: Date.now()
    };
    map2.set(arg1, obj);
    const value = String(arg1 || "").startsWith("entity_") && typeof acquireEntityExecutionViewportLease === "function" ? await acquireEntityExecutionViewportLease(arg1, {
      taskGeneration: result,
      runtimeTaskId: String(runtimeTaskId || "")
    }) : await ensureBackgroundAutomationLayout?.(arg1);
    const result2 = map2.get(arg1);
    if (!result2 || result2.generation !== result || !isCurrent(arg1, result) || getPlatformViews?.()?.get?.(arg1) !== local) {
      return {
        ok: false,
        reason: "stale_execution_viewport",
        generation: result
      };
    }
    if (value && value.ok === false) {
      map2.delete(arg1);
      return {
        ...value,
        generation: result
      };
    }
    return {
      ok: true,
      generation: result,
      layout: value || null
    };
  }
  function releaseExecutionViewport(arg1, {
    generation = null
  } = {}) {
    const result = map2.get(arg1);
    if (!result) {
      return {
        ok: true,
        skipped: true
      };
    }
    if (generation != null && Number(generation) !== Number(result.generation)) {
      return {
        ok: false,
        reason: "stale_execution_viewport_release"
      };
    }
    map2.delete(arg1);
    const result2 = fn(arg1, result);
    return {
      ok: result2 !== false && result2?.ok !== false,
      release: result2 || null
    };
  }
  return {
    beginTask: beginTask,
    wake: wake,
    finishTask: finishTask,
    invalidate: invalidate,
    acquireExecutionViewport: acquireExecutionViewport,
    releaseExecutionViewport: releaseExecutionViewport,
    hasExecutionViewport: arg1 => map2.has(arg1),
    isCurrent: isCurrent,
    getGeneration: arg1 => Number(map.get(arg1) || 0)
  };
}
module.exports = {
  createAutomationLiveViewLifecycle: createAutomationLiveViewLifecycle
};
'use strict';

const {
  BrowserWindow,
  ipcMain,
  screen
} = require("electron");
const {
  restoreOccludedPageRendering
} = require("./automationRenderingPolicy");
const COMPACT_BACKGROUND_AUTOMATION_WIDTH = 1200;
const COMPACT_BACKGROUND_AUTOMATION_HEIGHT = 800;
const VISIBLE_AUTOMATION_LOGICAL_WIDTH = 1280;
const VISIBLE_AUTOMATION_LOGICAL_HEIGHT = 800;
const MIN_INTERACTIVE_AUTOMATION_ZOOM_FACTOR = 0.25;
const BACKGROUND_LAYOUT_WARMUP_MS = 160;
const BACKGROUND_INTERACTION_RESUME_WARMUP_MS = 900;
const BACKGROUND_AUTOMATION_FRAME_RATE_ACTIVE = 30;
const BACKGROUND_AUTOMATION_FRAME_RATE_IDLE = 30;
const FOREGROUND_AUTOMATION_FRAME_RATE = 60;
const BACKGROUND_INTERACTION_SLOT_LEASE_MS = 300000;
const BACKGROUND_HOST_FOCUS_ACTIVATE_GUARD_MS = 500;
const BACKGROUND_HOST_SHOW_ACTIVATE_GUARD_MS = 1000;
const BACKGROUND_HOST_RELATED_EVENT_GRACE_MS = 500;
const MAIN_WINDOW_COMPOSITOR_NUDGE_COOLDOWN_MS = 500;
const AUTOMATION_VIEWPORT_REFRESH_MIN_INTERVAL_MS = 50;
const VISIBLE_AUTOMATION_REPAINT_DELAYS_MS = [50, 250, 700];
const BOUNDS_SYNC_MIN_INTERVAL_MS = 40;
function createBackgroundAutomationLayout(arg1) {
  const {
    getMainWindow: getMainWindow,
    getPlatformViews: getPlatformViews,
    getInteractionViewsMap: getInteractionViewsMap,
    getInteractionLocksMap: getInteractionLocksMap,
    getViewSettingsMap: getViewSettingsMap,
    getBoundsStateByViewKey: getBoundsStateByViewKey,
    getVisibleAutomationRepaintTimers: getVisibleAutomationRepaintTimers,
    getBackgroundDetachedViewKeys: getBackgroundDetachedViewKeys,
    getBackgroundLayoutHoldViewKeys: getBackgroundLayoutHoldViewKeys,
    getBackgroundOriginalZoomFactors: getBackgroundOriginalZoomFactors,
    getBackgroundInteractionWaiters: getBackgroundInteractionWaiters,
    getPendingAutomationWebContentsClose: getPendingAutomationWebContentsClose,
    getAutomationViewsVisible: getAutomationViewsVisible,
    setAutomationViewsVisible: setAutomationViewsVisible,
    getVisibleAutomationViewKeys: getVisibleAutomationViewKeys,
    setVisibleAutomationViewKeys: setVisibleAutomationViewKeys,
    getMainWindowBackgrounded: getMainWindowBackgrounded,
    setMainWindowBackgrounded: setMainWindowBackgrounded,
    getMainWindowBackgroundReason: getMainWindowBackgroundReason,
    setMainWindowBackgroundReason: setMainWindowBackgroundReason,
    getBackgroundAutomationHostWindow: getBackgroundAutomationHostWindow,
    setBackgroundAutomationHostWindow: setBackgroundAutomationHostWindow,
    getBackgroundAutomationHostDestroyTimer: getBackgroundAutomationHostDestroyTimer,
    setBackgroundAutomationHostDestroyTimer: setBackgroundAutomationHostDestroyTimer,
    getBackgroundInteractionSlot: getBackgroundInteractionSlot,
    setBackgroundInteractionSlot: setBackgroundInteractionSlot,
    getBackgroundHostInternalActivateUntil: getBackgroundHostInternalActivateUntil,
    setBackgroundHostInternalActivateUntil: setBackgroundHostInternalActivateUntil,
    getBackgroundHostInternalActivatePending: getBackgroundHostInternalActivatePending,
    setBackgroundHostInternalActivatePending: setBackgroundHostInternalActivatePending,
    getBackgroundHostRelatedEventUntil: getBackgroundHostRelatedEventUntil,
    setBackgroundHostRelatedEventUntil: setBackgroundHostRelatedEventUntil,
    getAutomationWindow: getAutomationWindow,
    setAutomationWindow: setAutomationWindow,
    getActivePlatform: getActivePlatform,
    isBatchViewRuntimeActive: isBatchViewRuntimeActive,
    isMonitorTaskViewRunning: isMonitorTaskViewRunning,
    applyPackagedWindowMenuPolicy: applyPackagedWindowMenuPolicy,
    appendDiagnosticsLog: appendDiagnosticsLog,
    requestAutomationLayoutRefresh: requestAutomationLayoutRefresh,
    recoverMainAutomationView: recoverMainAutomationView,
    store: store,
    backgroundLivePreviewAutoCloseMs: backgroundLivePreviewAutoCloseMs
  } = arg1;
  const map = new Map();
  const map2 = new Map();
  function fn(arg1) {
    const value = Number(map.get(arg1) || 0) + 1;
    map.set(arg1, value);
    return value;
  }
  const weakMap = new WeakMap();
  let num = 0;
  function fn2(arg1, num = 1) {
    const result = Number(arg1);
    if (!Number.isFinite(result) || result <= 0) {
      return num;
    }
    return Math.max(MIN_INTERACTIVE_AUTOMATION_ZOOM_FACTOR, result);
  }
  function inferInteractionViewKey(arg1) {
    const result = getInteractionViewsMap();
    for (const [local, local2] of result.entries()) {
      if (local2.webContents === arg1) {
        return local;
      }
    }
    return null;
  }
  function inferAutomationViewKey(arg1) {
    const result = getPlatformViews();
    for (const [local, local2] of result.entries()) {
      if (local2.webContents === arg1) {
        return local;
      }
    }
    return inferInteractionViewKey(arg1);
  }
  function applyMainWindowRuntimePerformancePolicy() {
    const result = getMainWindow();
    if (!result || result.isDestroyed() || result.webContents.isDestroyed()) {
      return;
    }
    try {
      result.webContents.setBackgroundThrottling(false);
    } catch (error) {}
    try {
      result.webContents.setFrameRate(getMainWindowBackgrounded() ? 30 : 60);
    } catch (error) {}
    try {
      result.webContents.setImageAnimationPolicy(getMainWindowBackgrounded() ? "noAnimation" : "animate");
    } catch (error) {}
  }
  function wakeMainWindowUiSurface(text = "") {
    const result = getMainWindow();
    if (!result || result.isDestroyed() || result.webContents.isDestroyed()) {
      return;
    }
    if (!result.isVisible() || result.isMinimized()) {
      return;
    }
    try {
      result.webContents.invalidate();
    } catch (error) {}
    nudgeMainWindowCompositor(text || "ui-wake");
    [120, 400].forEach(arg1 => {
      const result = setTimeout(() => {
        const result = getMainWindow();
        if (!result || result.isDestroyed() || result.webContents.isDestroyed()) {
          return;
        }
        if (!result.isVisible() || result.isMinimized()) {
          return;
        }
        try {
          result.webContents.invalidate();
        } catch (error) {}
      }, arg1);
      if (typeof result.unref === "function") {
        result.unref();
      }
    });
  }
  function restoreMainWindowUiFocus(text = "") {
    const result = getMainWindow();
    if (!result || result.isDestroyed() || result.webContents.isDestroyed()) {
      return;
    }
    if (!result.isVisible() || result.isMinimized()) {
      return;
    }
    try {
      if (!result.isFocused()) {
        result.focus();
      }
    } catch (error) {}
    try {
      result.webContents.focus();
    } catch (error) {}
    wakeMainWindowUiSurface(text || "restore-ui-focus");
  }
  function focusAutomationWebContentsSafely(arg1, {
    force = false
  } = {}) {
    if (!arg1 || arg1.isDestroyed?.()) {
      return false;
    }
    const result = getBackgroundAutomationHostViews();
    const result2 = result.some(arg12 => arg12?.webContents === arg1);
    if (result2) {
      try {
        arg1.executeJavaScript("(() => { try { document.body && document.body.focus(); } catch (_) {} return true; })()", true).catch(() => {});
      } catch (error) {}
      const result = getBackgroundAutomationHostWindow();
      if (result && !result.isDestroyed()) {
        parkBackgroundAutomationHostWindow(result, "safe-focus-skip");
        try {
          if (result.isFocused()) {
            result.blur();
          }
        } catch (error) {}
        scheduleBackgroundAutomationHostRepark(result, "safe-focus-skip");
      }
      const result2 = getMainWindow();
      if (result2 && !result2.isDestroyed() && result2.isVisible() && !result2.isMinimized()) {
        setImmediate(() => restoreMainWindowUiFocus("after-host-safe-focus"));
      }
      return false;
    }
    const flag = !getAutomationViewsVisible();
    if (flag && !force) {
      try {
        arg1.executeJavaScript("(() => { try { document.body && document.body.focus(); } catch (_) {} return true; })()", true).catch(() => {});
      } catch (error) {}
      setImmediate(() => restoreMainWindowUiFocus("after-offscreen-safe-focus"));
      return false;
    }
    const result3 = getMainWindow();
    if (!force && result3 && !result3.isDestroyed() && !result3.isFocused()) {
      return false;
    }
    try {
      arg1.focus();
      return true;
    } catch (error) {
      return false;
    }
  }
  function restoreRequestedAutomationViewsToMainWindow(text = "foreground") {
    const result = getMainWindow();
    if (!getAutomationViewsVisible() || !result || result.isDestroyed() || !result.isVisible() || result.isMinimized()) {
      return 0;
    }
    const result2 = getPlatformViews();
    const result3 = getInteractionViewsMap();
    const result4 = getInteractionLocksMap();
    const result5 = getBoundsStateByViewKey();
    const result6 = getBackgroundLayoutHoldViewKeys();
    const result7 = getVisibleAutomationViewKeys();
    let num = 0;
    for (const [local, local2] of result2.entries()) {
      if (result7 && !result7.has(local)) {
        continue;
      }
      if (isAutomationExecutionViewportLocked(local)) {
        if (shouldAttachAutomationView(local)) {
          const result = restoreVisibleInteractionStack(local, "foreground-locked-restore:" + text);
          if (result.restored) {
            num += 1;
          }
          continue;
        }
        const value = result4.has(local) ? result3.get(local) : null;
        if (value && !value.webContents?.isDestroyed?.()) {
          attachAutomationViewToBackgroundHost(local, value, {
            active: true
          });
          result6.add(local);
        } else if (local2 && !local2.webContents?.isDestroyed?.()) {
          attachAutomationViewToBackgroundHost(local, local2, {
            active: true
          });
          result6.add(local);
        }
        if (value && restoreAutomationPreviewAfterExecution(local, local2)) {
          num += 1;
        }
        continue;
      }
      const result2 = result4.get(local);
      const value = result2 ? result3.get(local) : null;
      const local3 = value || local2;
      if (!local3?.webContents || local3.webContents.isDestroyed()) {
        continue;
      }
      const result8 = result5.get(local);
      const local4 = result2?.bounds || result8?.bounds;
      if (!isValidAutomationBounds(local4)) {
        continue;
      }
      removeAutomationViewFromBackgroundHost(local3);
      restoreForegroundAutomationRendering(local3.webContents);
      try {
        local3.setBounds({
          ...local4
        });
      } catch (error) {}
      const result9 = Number(result2?.zoomFactor || result8?.zoomFactor || 0);
      if (result9 > 0) {
        try {
          local3.webContents.setZoomFactor(result9);
        } catch (error) {}
      }
      if (!result.getBrowserViews().includes(local3)) {
        result.addBrowserView(local3);
      }
      safeSetTopBrowserView(local3, {
        context: "foreground-restore:" + local
      });
      if (Number(result9) > 0 && Number(result9) < 0.98) {
        schedulePreviewViewportResizeAfterZoom(local3.webContents);
      } else {
        notifyAutomationViewportChanged(local3.webContents, {
          force: true
        });
      }
      nudgeAutomationViewRepaint(local3.webContents, local3);
      if (!value) {
        clearBackgroundAutomationState(local);
      }
      num += 1;
    }
    maybeDestroyBackgroundAutomationHostWindow();
    if (num > 0) {
      console.log("[Main] 前台实况视图已主动恢复: " + num + " 个 (" + text + ")");
    }
    return num;
  }
  function closeAutomationLivePreviewForBackground(text = "background-timeout") {
    if (!getAutomationViewsVisible()) {
      return false;
    }
    setAutomationViewsVisible(false);
    setVisibleAutomationViewKeys(null);
    const result = getVisibleAutomationRepaintTimers();
    result.forEach(arg1 => clearTimeout(arg1));
    result.clear();
    const result2 = getPlatformViews();
    const result3 = getInteractionViewsMap();
    result2.forEach((arg1, arg2) => {
      detachAutomationViewFromWindow(arg2, arg1);
      const result = result3.get(arg2);
      if (result) {
        detachAutomationViewFromWindow(arg2, result);
      }
    });
    maybeDestroyBackgroundAutomationHostWindow();
    const obj = {
      reason: text,
      delayMs: backgroundLivePreviewAutoCloseMs
    };
    appendDiagnosticsLog("PERF", "live preview auto closed in background", obj);
    const result4 = getMainWindow();
    if (result4 && !result4.isDestroyed() && !result4.webContents.isDestroyed()) {
      try {
        result4.webContents.send("automation-live-preview-auto-closed", obj);
      } catch (error) {}
    }
    console.log("[Perf] 软件后台超过 " + backgroundLivePreviewAutoCloseMs / 1000 + "s，已自动关闭实况画面 (" + text + ")");
    return true;
  }
  function setMainWindowBackgroundState(arg1, text = "") {
    const result = getMainWindowBackgrounded();
    setMainWindowBackgrounded(!!arg1);
    if (getMainWindowBackgrounded()) {
      setMainWindowBackgroundReason(text || getMainWindowBackgroundReason() || "unknown");
    } else {
      setMainWindowBackgroundReason("");
    }
    const result2 = getMainWindow();
    if (!result2 || result2.isDestroyed() || result2.webContents.isDestroyed()) {
      return;
    }
    applyMainWindowRuntimePerformancePolicy();
    if (getMainWindowBackgrounded() === result) {
      return;
    }
    const result3 = getVisibleAutomationRepaintTimers();
    const result4 = getPlatformViews();
    const result5 = getInteractionViewsMap();
    if (getMainWindowBackgrounded()) {
      result3.forEach(arg1 => clearTimeout(arg1));
      result3.clear();
      result4.forEach((arg1, arg2) => {
        detachAutomationViewFromWindow(arg2, arg1);
        const result = result5.get(arg2);
        if (result) {
          detachAutomationViewFromWindow(arg2, result);
        }
      });
      console.log("[Main] 主窗口进入后台模式 (" + (text || "unknown") + ")，任务视图已迁移至低功耗宿主");
      return;
    }
    if (!getAutomationViewsVisible()) {
      const result = getInteractionLocksMap();
      const result2 = getBackgroundDetachedViewKeys();
      result4.forEach((arg1, arg2) => {
        if (!shouldKeepAutomationViewAttached(arg2)) {
          return;
        }
        const value = result.has(arg2) ? result5.get(arg2) || arg1 : arg1;
        result2.add(arg2);
        parkAutomationViewInMainWindow(arg2, value);
      });
    }
    restoreRequestedAutomationViewsToMainWindow(text || "foreground");
    requestAutomationLayoutRefresh();
    scheduleVisibleAutomationViewsRepaint("main-window-" + (text || "foreground"));
    const result6 = setTimeout(() => {
      restoreRequestedAutomationViewsToMainWindow((text || "foreground") + "-confirm");
      wakeForegroundAutomationSurfaces("");
    }, 120);
    if (typeof result6.unref === "function") {
      result6.unref();
    }
  }
  function shouldAttachAutomationView(arg1) {
    const result = getMainWindow();
    if (getMainWindowBackgrounded() || !result || result.isDestroyed()) {
      return false;
    }
    if (!result.isVisible() || result.isMinimized()) {
      return false;
    }
    const result2 = getVisibleAutomationViewKeys();
    return getAutomationViewsVisible() && (!result2 || result2.has(arg1));
  }
  function buildOffscreenAutomationBounds(arg1) {
    const result = Math.max(arg1?.width || 800, 100);
    const result2 = Math.max(arg1?.height || 600, 100);
    return {
      x: -5000,
      y: -5000,
      width: result,
      height: result2
    };
  }
  function clearBackgroundInteractionSlot(arg1, text = "release") {
    if (!arg1 || getBackgroundInteractionSlot() !== arg1) {
      return false;
    }
    if (arg1.timer) {
      clearTimeout(arg1.timer);
    }
    if (arg1.affinityReleaseTimer) {
      clearTimeout(arg1.affinityReleaseTimer);
    }
    if (arg1.webContents && arg1.destroyedListener) {
      try {
        arg1.webContents.removeListener("destroyed", arg1.destroyedListener);
      } catch (error) {}
    }
    setBackgroundInteractionSlot(null);
    console.log("[Main] 后台互动执行权已释放: " + arg1.viewKey + " (" + text + ")");
    grantNextBackgroundInteractionSlot();
    return true;
  }
  function grantNextBackgroundInteractionSlot() {
    if (getBackgroundInteractionSlot()) {
      return;
    }
    const result = getBackgroundInteractionWaiters();
    while (result.length > 0) {
      const result2 = result.shift();
      const value = result2.webContents;
      if (!value || value.isDestroyed?.()) {
        result2.resolve({
          acquired: false,
          reason: "sender_destroyed"
        });
        continue;
      }
      const obj = {
        viewKey: result2.viewKey,
        webContents: value,
        webContentsId: value.id,
        acquiredAt: Date.now(),
        timer: null,
        destroyedListener: null
      };
      obj.destroyedListener = () => clearBackgroundInteractionSlot(obj, "sender_destroyed");
      try {
        value.once("destroyed", obj.destroyedListener);
      } catch (error) {}
      obj.timer = setTimeout(() => {
        console.warn("[Main] 后台互动执行权超时释放: " + obj.viewKey);
        clearBackgroundInteractionSlot(obj, "lease_timeout");
      }, BACKGROUND_INTERACTION_SLOT_LEASE_MS);
      if (typeof obj.timer.unref === "function") {
        obj.timer.unref();
      }
      setBackgroundInteractionSlot(obj);
      console.log("[Main] 后台互动执行权已授予: " + obj.viewKey + " wait=" + (Date.now() - result2.queuedAt) + "ms");
      result2.resolve({
        acquired: true,
        waitedMs: Date.now() - result2.queuedAt
      });
      return;
    }
  }
  function acquireBackgroundInteractionSlot(arg1, arg2) {
    if (!arg1 || !arg2 || arg2.isDestroyed?.()) {
      return Promise.resolve({
        acquired: false,
        reason: "invalid_sender"
      });
    }
    const result = getBackgroundInteractionSlot();
    if (result && result.viewKey === arg1 && result.webContentsId === arg2.id) {
      if (result.affinityReleaseTimer) {
        clearTimeout(result.affinityReleaseTimer);
        result.affinityReleaseTimer = null;
      }
      result.affinityHolding = false;
      return Promise.resolve({
        acquired: true,
        reused: true,
        waitedMs: 0
      });
    }
    if (result && result.affinityHolding && result.viewKey !== arg1) {
      console.log("[Main] 发现其它账号 " + arg1 + " 申请执行权，抢占清理上个账号的 affinity 保留锁: " + result.viewKey);
      clearBackgroundInteractionSlot(result, "preempt_for_next_account");
    }
    return new Promise(arg12 => {
      getBackgroundInteractionWaiters().push({
        viewKey: arg1,
        webContents: arg2,
        queuedAt: Date.now(),
        resolve: arg12
      });
      grantNextBackgroundInteractionSlot();
    });
  }
  function releaseBackgroundInteractionSlot(arg1, arg2, text = "release", {
    preferReacquireMs = 0
  } = {}) {
    const result = getBackgroundInteractionSlot();
    if (!result) {
      return {
        released: false,
        reason: "no_owner"
      };
    }
    if (result.viewKey !== arg1 || result.webContentsId !== arg2?.id) {
      return {
        released: false,
        reason: "not_owner"
      };
    }
    const value = getBackgroundInteractionWaiters().length > 0;
    const value2 = value ? 0 : Math.max(0, Math.min(15000, Number(preferReacquireMs) || 0));
    if (value2 > 0) {
      if (result.affinityReleaseTimer) {
        clearTimeout(result.affinityReleaseTimer);
      }
      result.affinityHolding = true;
      result.affinityReleaseTimer = setTimeout(() => {
        result.affinityReleaseTimer = null;
        result.affinityHolding = false;
        releaseBackgroundAutomationLayout(arg1);
        clearBackgroundInteractionSlot(result, "affinity_timeout");
      }, value2);
      result.affinityReleaseTimer.unref?.();
      console.log("[Main] 为同一用户后续动作保留互动执行权: " + arg1 + " " + value2 + "ms");
      return {
        released: false,
        reserved: true,
        preferReacquireMs: value2
      };
    }
    return {
      released: clearBackgroundInteractionSlot(result, text)
    };
  }
  function cancelBackgroundInteractionForView(arg1, text = "view_stopped") {
    if (!arg1) {
      return;
    }
    const result = getBackgroundInteractionWaiters();
    for (let value = result.length - 1; value >= 0; value--) {
      const value2 = result[value];
      if (value2.viewKey !== arg1) {
        continue;
      }
      result.splice(value, 1);
      try {
        value2.resolve({
          acquired: false,
          reason: text
        });
      } catch (error) {}
    }
    const result2 = getBackgroundInteractionSlot();
    if (result2?.viewKey === arg1) {
      clearBackgroundInteractionSlot(result2, text);
    }
  }
  function getBackgroundAutomationHostViews() {
    const result = getBackgroundAutomationHostWindow();
    if (!result || result.isDestroyed()) {
      return [];
    }
    try {
      return result.getBrowserViews();
    } catch (error) {
      return [];
    }
  }
  function getBackgroundAutomationHostOffscreenBounds() {
    let num = 0;
    let num2 = 0;
    try {
      const result = screen.getAllDisplays();
      if (result.length > 0) {
        num = Math.min(...result.map(arg1 => Number(arg1.bounds?.x) || 0));
        const result2 = screen.getPrimaryDisplay();
        num2 = Number(result2?.workArea?.y ?? result2?.bounds?.y) || 0;
      }
    } catch (error) {}
    return {
      x: num - COMPACT_BACKGROUND_AUTOMATION_WIDTH - 4096,
      y: num2,
      width: COMPACT_BACKGROUND_AUTOMATION_WIDTH,
      height: COMPACT_BACKGROUND_AUTOMATION_HEIGHT
    };
  }
  function getBackgroundAutomationComposerSurfaceBounds() {
    const result = getBackgroundAutomationHostOffscreenBounds();
    if (process.platform !== "win32") {
      return result;
    }
    let num = 0;
    try {
      const result = screen.getAllDisplays();
      if (result.length > 0) {
        num = Math.min(...result.map(arg1 => Number(arg1.bounds?.x) || 0));
      }
    } catch (error) {}
    return {
      ...result,
      x: num - COMPACT_BACKGROUND_AUTOMATION_WIDTH + 1
    };
  }
  function activateBackgroundAutomationComposerSurface(arg1, arg2) {
    if (process.platform !== "win32") {
      return false;
    }
    const result = getBackgroundAutomationHostWindow();
    if (!result || result.isDestroyed()) {
      return false;
    }
    result.__radarComposerSurfaceViewKey = arg1;
    try {
      result.setBounds(getBackgroundAutomationComposerSurfaceBounds(), false);
      result.setSkipTaskbar(true);
      try {
        result.webContents.invalidate();
      } catch (error) {}
      try {
        arg2?.invalidate?.();
      } catch (error) {}
      return true;
    } catch (error) {
      result.__radarComposerSurfaceViewKey = null;
      console.warn("[Main] 评论编辑器激活面创建失败 " + (arg1 || "?") + ": " + error.message);
      return false;
    }
  }
  async function emulateBackgroundAutomationPageFocus(arg1) {
    if (process.platform !== "win32" || !arg1 || arg1.isDestroyed?.()) {
      return {
        enabled: false,
        reason: process.platform === "win32" ? "web_contents_unavailable" : "not_windows"
      };
    }
    const value = arg1.debugger;
    let flag = false;
    try {
      if (!value.isAttached()) {
        value.attach("1.3");
        flag = true;
      }
      await value.sendCommand("Emulation.setFocusEmulationEnabled", {
        enabled: true
      });
      try {
        await value.sendCommand("Page.bringToFront");
      } catch (error) {}
      return {
        enabled: true
      };
    } catch (error) {
      console.warn("[Main] Windows 后台页面焦点仿真失败: " + error.message);
      return {
        enabled: false,
        reason: error.message || "focus_emulation_failed"
      };
    } finally {
      if (flag && value.isAttached()) {
        try {
          value.detach();
        } catch (error) {}
      }
    }
  }
  function releaseBackgroundAutomationComposerSurface(arg1) {
    const result = getBackgroundAutomationHostWindow();
    if (!result || result.isDestroyed()) {
      return false;
    }
    if (result.__radarComposerSurfaceViewKey && result.__radarComposerSurfaceViewKey !== arg1) {
      return false;
    }
    if (!result.__radarComposerSurfaceViewKey) {
      return false;
    }
    result.__radarComposerSurfaceViewKey = null;
    parkBackgroundAutomationHostWindow(result, "composer-release");
    return true;
  }
  function parkBackgroundAutomationHostWindow(arg1, text = "park") {
    if (!arg1 || arg1.isDestroyed() || arg1.__radarBackgroundHostParking) {
      return false;
    }
    if (arg1.__radarComposerSurfaceViewKey && text !== "composer-release") {
      return false;
    }
    arg1.__radarBackgroundHostParking = true;
    try {
      const result = getBackgroundAutomationHostOffscreenBounds();
      const result2 = arg1.getBounds();
      const local = result2.x !== result.x || result2.y !== result.y || result2.width !== result.width || result2.height !== result.height;
      if (local) {
        arg1.setBounds(result, false);
      }
      try {
        arg1.setSkipTaskbar(true);
      } catch (error) {}
      return true;
    } catch (error) {
      console.warn("[Main] 后台自动化宿主屏外校正失败(" + text + "): " + error.message);
      return false;
    } finally {
      arg1.__radarBackgroundHostParking = false;
    }
  }
  function scheduleBackgroundAutomationHostRepark(arg1, text = "repark") {
    if (!arg1 || arg1.isDestroyed()) {
      return;
    }
    if (arg1.__radarBackgroundHostReparkTimer) {
      clearTimeout(arg1.__radarBackgroundHostReparkTimer);
    }
    arg1.__radarBackgroundHostReparkTimer = setTimeout(() => {
      arg1.__radarBackgroundHostReparkTimer = null;
      parkBackgroundAutomationHostWindow(arg1, text);
    }, 0);
    arg1.__radarBackgroundHostReparkTimer.unref?.();
  }
  function clearBackgroundHostInternalActivation() {
    setBackgroundHostInternalActivatePending(false);
    setBackgroundHostInternalActivateUntil(0);
    setBackgroundHostRelatedEventUntil(0);
  }
  function armBackgroundHostInternalActivation(arg1 = BACKGROUND_HOST_FOCUS_ACTIVATE_GUARD_MS) {
    if (process.platform !== "darwin" || !getMainWindowBackgrounded()) {
      return;
    }
    setBackgroundHostInternalActivatePending(true);
    setBackgroundHostInternalActivateUntil(Date.now() + Math.max(100, Number(arg1) || 0));
    setBackgroundHostRelatedEventUntil(0);
  }
  function showBackgroundAutomationHostInactive(arg1) {
    if (!arg1 || arg1.isDestroyed()) {
      return;
    }
    parkBackgroundAutomationHostWindow(arg1, "before-show");
    if (!arg1.isVisible()) {
      armBackgroundHostInternalActivation(BACKGROUND_HOST_SHOW_ACTIVATE_GUARD_MS);
      try {
        arg1.showInactive();
      } catch (error) {}
    }
    parkBackgroundAutomationHostWindow(arg1, "after-show");
    scheduleBackgroundAutomationHostRepark(arg1, "after-show-confirm");
  }
  function consumeBackgroundHostInternalActivation() {
    const result = Date.now();
    const result2 = getMainWindow();
    const result3 = getBackgroundAutomationHostWindow();
    const local = process.platform === "darwin" && !!getMainWindowBackgrounded() && !!result2 && !result2.isDestroyed() && !!result3 && !result3.isDestroyed();
    if (!local) {
      clearBackgroundHostInternalActivation();
      return false;
    }
    if (getBackgroundHostInternalActivatePending() && result <= getBackgroundHostInternalActivateUntil()) {
      setBackgroundHostInternalActivatePending(false);
      setBackgroundHostInternalActivateUntil(0);
      setBackgroundHostRelatedEventUntil(result + BACKGROUND_HOST_RELATED_EVENT_GRACE_MS);
      return true;
    }
    if (result <= getBackgroundHostRelatedEventUntil()) {
      return true;
    }
    clearBackgroundHostInternalActivation();
    return false;
  }
  function suppressMainWindowEventFromBackgroundHost(arg1) {
    if (!consumeBackgroundHostInternalActivation()) {
      return false;
    }
    const result = getMainWindowBackgroundReason();
    console.log("[Main] 已忽略后台自动化宿主触发的主窗口 " + arg1);
    setImmediate(() => {
      const result2 = getMainWindow();
      if (!result2 || result2.isDestroyed() || !getMainWindowBackgrounded()) {
        return;
      }
      try {
        if (result === "minimize") {
          if (!result2.isMinimized()) {
            result2.minimize();
          }
        } else if (result2.isVisible()) {
          result2.hide();
        }
      } catch (error) {}
    });
    return true;
  }
  function ensureBackgroundAutomationHostWindow() {
    const result = getBackgroundAutomationHostWindow();
    if (result && !result.isDestroyed()) {
      showBackgroundAutomationHostInactive(result);
      return result;
    }
    const result2 = getBackgroundAutomationHostOffscreenBounds();
    const browserWindow = new BrowserWindow({
      ...result2,
      show: false,
      frame: false,
      title: "",
      hasShadow: false,
      backgroundColor: "#111827",
      focusable: true,
      skipTaskbar: true,
      resizable: false,
      movable: false,
      minimizable: false,
      maximizable: false,
      closable: false,
      fullscreenable: false,
      paintWhenInitiallyHidden: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        backgroundThrottling: false
      }
    });
    setBackgroundAutomationHostWindow(browserWindow);
    applyPackagedWindowMenuPolicy(browserWindow);
    if (process.platform === "darwin") {
      try {
        browserWindow.setHiddenInMissionControl(true);
      } catch (error) {}
      try {
        browserWindow.setWindowButtonVisibility(false);
      } catch (error) {}
    }
    parkBackgroundAutomationHostWindow(browserWindow, "created");
    try {
      browserWindow.setIgnoreMouseEvents(true);
    } catch (error) {}
    try {
      browserWindow.webContents.setAudioMuted(true);
    } catch (error) {}
    const local = () => {
      if (!browserWindow.isDestroyed()) {
        showBackgroundAutomationHostInactive(browserWindow);
      }
    };
    browserWindow.once("ready-to-show", local);
    browserWindow.webContents.once("did-finish-load", local);
    const local2 = () => {
      scheduleBackgroundAutomationHostRepark(browserWindow, "display-topology-changed");
    };
    try {
      screen.on("display-added", local2);
      screen.on("display-removed", local2);
      screen.on("display-metrics-changed", local2);
    } catch (error) {}
    browserWindow.on("show", () => {
      if (browserWindow.isDestroyed()) {
        return;
      }
      parkBackgroundAutomationHostWindow(browserWindow, "show-event");
      scheduleBackgroundAutomationHostRepark(browserWindow, "show-event-confirm");
    });
    browserWindow.on("move", () => {
      if (!browserWindow.__radarBackgroundHostParking) {
        scheduleBackgroundAutomationHostRepark(browserWindow, "move-event");
      }
    });
    browserWindow.on("focus", () => {
      scheduleBackgroundAutomationHostRepark(browserWindow, "focus-event");
      setImmediate(() => {
        if (browserWindow.isDestroyed()) {
          return;
        }
        parkBackgroundAutomationHostWindow(browserWindow, "focus-repark");
        try {
          if (browserWindow.isFocused()) {
            browserWindow.blur();
          }
        } catch (error) {}
        const result = getMainWindow();
        if (result && !result.isDestroyed() && result.isVisible() && !result.isMinimized()) {
          restoreMainWindowUiFocus("host-focus-repark");
        }
      });
    });
    browserWindow.on("closed", () => {
      if (browserWindow.__radarBackgroundHostReparkTimer) {
        clearTimeout(browserWindow.__radarBackgroundHostReparkTimer);
        browserWindow.__radarBackgroundHostReparkTimer = null;
      }
      try {
        screen.removeListener("display-added", local2);
        screen.removeListener("display-removed", local2);
        screen.removeListener("display-metrics-changed", local2);
      } catch (error) {}
      if (getBackgroundAutomationHostWindow() === browserWindow) {
        setBackgroundAutomationHostWindow(null);
      }
      const result = getMainWindow();
      if (result && !result.isDestroyed() && result.isVisible()) {
        restoreMainWindowUiFocus("background-host-closed");
      }
    });
    browserWindow.loadURL("about:blank").catch(() => {});
    setTimeout(local, 250);
    console.log("[Main] 已创建低功耗后台自动化宿主窗口");
    return browserWindow;
  }
  function removeAutomationViewFromWindow(arg1, arg2) {
    if (!arg1 || arg1.isDestroyed() || !arg2) {
      return;
    }
    try {
      if (arg1.getBrowserViews().includes(arg2)) {
        arg1.removeBrowserView(arg2);
      }
    } catch (error) {}
  }
  function removeAutomationViewFromBackgroundHost(arg1) {
    removeAutomationViewFromWindow(getBackgroundAutomationHostWindow(), arg1);
  }
  function maybeDestroyBackgroundAutomationHostWindow() {
    const result = getBackgroundAutomationHostWindow();
    if (!result || result.isDestroyed()) {
      return;
    }
    if (getBackgroundAutomationHostViews().length > 0) {
      return;
    }
    if (getBackgroundAutomationHostDestroyTimer()) {
      return;
    }
    const value = process.platform === "darwin" ? 800 : 100;
    const result2 = setTimeout(() => {
      setBackgroundAutomationHostDestroyTimer(null);
      if (getBackgroundAutomationHostWindow() !== result || result.isDestroyed()) {
        return;
      }
      if (getBackgroundAutomationHostViews().length > 0) {
        return;
      }
      if (getPendingAutomationWebContentsClose().size > 0) {
        maybeDestroyBackgroundAutomationHostWindow();
        return;
      }
      setBackgroundAutomationHostWindow(null);
      try {
        result.destroy();
      } catch (error) {}
      console.log("[Main] 后台自动化宿主已安全释放");
    }, value);
    setBackgroundAutomationHostDestroyTimer(result2);
    if (typeof result2.unref === "function") {
      result2.unref();
    }
  }
  function shouldKeepAutomationViewAttached(arg1) {
    if (getInteractionLocksMap().has(arg1)) {
      return true;
    }
    if (isBatchViewRuntimeActive(arg1)) {
      return true;
    }
    if (isMonitorTaskViewRunning(arg1)) {
      return true;
    }
    const result = getViewSettingsMap().get(arg1);
    return !!result && !!result.taskId;
  }
  function schedulePreviewViewportResizeAfterZoom(arg1) {
    if (!arg1 || arg1.isDestroyed?.()) {
      return;
    }
    arg1.executeJavaScript("\n            (() => {\n                window.__radarAutomationViewportChangedAt = Date.now();\n                return true;\n            })()\n        ", true).catch(() => {});
    [60, 200].forEach(arg12 => {
      const result = setTimeout(() => {
        if (arg1.isDestroyed?.()) {
          return;
        }
        notifyAutomationViewportChanged(arg1, {
          force: true
        });
      }, arg12);
      if (typeof result.unref === "function") {
        result.unref();
      }
    });
  }
  function isBackgroundAutomationHidden(arg1) {
    return getBackgroundDetachedViewKeys().has(arg1) || getBackgroundLayoutHoldViewKeys().has(arg1);
  }
  function clearBackgroundAutomationState(arg1) {
    getBackgroundDetachedViewKeys().delete(arg1);
    getBackgroundLayoutHoldViewKeys().delete(arg1);
    map2.delete(arg1);
  }
  function isAutomationExecutionViewportLocked(arg1) {
    return !!arg1 && (getBackgroundLayoutHoldViewKeys().has(arg1) || getInteractionLocksMap().has(arg1));
  }
  function cacheAutomationPreviewBounds(arg1, arg2, arg3) {
    if (!arg1 || !isValidAutomationBounds(arg2)) {
      return;
    }
    const result = getBoundsStateByViewKey();
    const result2 = Number(arg3);
    const value = result2 > 0 ? fn2(result2) : 0;
    result.set(arg1, {
      bounds: {
        ...arg2
      },
      pendingBounds: {
        ...arg2
      },
      zoomFactor: value > 0 ? value : result.get(arg1)?.zoomFactor || 0,
      at: Date.now()
    });
    const result3 = getInteractionLocksMap().get(arg1);
    if (result3) {
      result3.previewBounds = {
        ...arg2
      };
      if (value > 0) {
        result3.previewZoomFactor = value;
      }
    }
  }
  function fn56(arg1, arg2 = null) {
    const result = getBoundsStateByViewKey().get(arg1);
    const value = isValidAutomationBounds(arg2?.previewBounds) ? arg2.previewBounds : isValidAutomationBounds(result?.bounds) ? result.bounds : arg2?.bounds;
    const result2 = Number(arg2?.previewZoomFactor || result?.zoomFactor || arg2?.zoomFactor || 1);
    const value2 = isValidAutomationBounds(value) ? Math.max(MIN_INTERACTIVE_AUTOMATION_ZOOM_FACTOR, Math.min(1, Number(value.width) / VISIBLE_AUTOMATION_LOGICAL_WIDTH, Number(value.height) / VISIBLE_AUTOMATION_LOGICAL_HEIGHT)) : 1;
    const value3 = result2 > 0 ? Math.min(result2, value2) : value2;
    return {
      bounds: isValidAutomationBounds(value) ? {
        ...value
      } : null,
      zoomFactor: value3 > 0 ? value3 : 1
    };
  }
  function restoreAutomationPreviewAfterExecution(arg1, arg2) {
    if (!arg1 || !arg2 || arg2.webContents?.isDestroyed?.()) {
      return false;
    }
    const result = getMainWindow();
    if (!shouldAttachAutomationView(arg1) || !result || result.isDestroyed()) {
      return false;
    }
    const result2 = getBoundsStateByViewKey().get(arg1);
    if (!isValidAutomationBounds(result2?.bounds)) {
      return false;
    }
    removeAutomationViewFromBackgroundHost(arg2);
    restoreForegroundAutomationRendering(arg2.webContents);
    arg2.setBounds({
      ...result2.bounds
    });
    if (Number(result2.zoomFactor) > 0) {
      try {
        arg2.webContents.setZoomFactor(Number(result2.zoomFactor));
      } catch (error) {}
    }
    if (!result.getBrowserViews().includes(arg2)) {
      result.addBrowserView(arg2);
    }
    if (!getInteractionLocksMap().has(arg1)) {
      safeSetTopBrowserView(arg2, {
        context: "restore-preview-after-execution:" + arg1
      });
    }
    nudgeAutomationViewRepaint(arg2.webContents, arg2);
    return true;
  }
  function applyBackgroundAutomationOptimizations(arg1, {
    active = false
  } = {}) {
    if (!arg1 || arg1.isDestroyed?.()) {
      return;
    }
    const result = inferAutomationViewKey(arg1);
    if (result && shouldAttachAutomationView(result) && !isAutomationExecutionViewportLocked(result)) {
      restoreForegroundAutomationRendering(arg1);
      return;
    }
    try {
      arg1.setAudioMuted(true);
    } catch (error) {}
    try {
      arg1.setBackgroundThrottling(false);
    } catch (error) {}
    try {
      arg1.setImageAnimationPolicy("animate");
    } catch (error) {}
    try {
      arg1.setFrameRate(active ? BACKGROUND_AUTOMATION_FRAME_RATE_ACTIVE : BACKGROUND_AUTOMATION_FRAME_RATE_IDLE);
    } catch (error) {}
  }
  function applyBackgroundAutomationZoom(arg1) {
    if (!arg1 || arg1.isDestroyed?.()) {
      return;
    }
    const result = getBackgroundOriginalZoomFactors();
    try {
      if (!result.has(arg1)) {
        const local = arg1.getZoomFactor?.() || 1;
        result.set(arg1, local);
      }
      if (Math.abs((arg1.getZoomFactor?.() || 1) - 1) > 0.001) {
        arg1.setZoomFactor(1);
      }
    } catch (error) {}
  }
  function restoreForegroundAutomationRendering(arg1) {
    if (!arg1 || arg1.isDestroyed?.()) {
      return;
    }
    try {
      arg1.setAudioMuted(store.get("system_video_muted", true));
    } catch (error) {}
    try {
      arg1.setBackgroundThrottling(false);
    } catch (error) {}
    try {
      arg1.setFrameRate(FOREGROUND_AUTOMATION_FRAME_RATE);
    } catch (error) {}
    try {
      arg1.setImageAnimationPolicy("animate");
    } catch (error) {}
    const result = getBackgroundOriginalZoomFactors();
    try {
      if (result.has(arg1)) {
        const local = result.get(arg1) || 1;
        result.delete(arg1);
        arg1.setZoomFactor(local);
      }
    } catch (error) {}
    restoreOccludedPageRendering(arg1);
  }
  function buildCompactBackgroundAutomationBounds(arg1) {
    return {
      x: 0,
      y: 0,
      width: COMPACT_BACKGROUND_AUTOMATION_WIDTH,
      height: COMPACT_BACKGROUND_AUTOMATION_HEIGHT
    };
  }
  function canParkAutomationViewInMainWindow() {
    if (process.platform === "win32") {
      return false;
    }
    const result = getMainWindow();
    return Boolean(result && !result.isDestroyed() && result.isVisible() && !result.isMinimized());
  }
  function parkAutomationViewInMainWindow(arg1, arg2) {
    if (!arg2 || arg2.webContents?.isDestroyed?.() || !canParkAutomationViewInMainWindow()) {
      return false;
    }
    if (shouldAttachAutomationView(arg1)) {
      return false;
    }
    removeAutomationViewFromBackgroundHost(arg2);
    applyBackgroundAutomationOptimizations(arg2.webContents, {
      active: getBackgroundLayoutHoldViewKeys().has(arg1) || getInteractionLocksMap().has(arg1)
    });
    applyBackgroundAutomationZoom(arg2.webContents);
    const result = getMainWindow();
    if (!result.getBrowserViews().includes(arg2)) {
      result.addBrowserView(arg2);
    }
    arg2.setBounds({
      x: -5000,
      y: -5000,
      width: COMPACT_BACKGROUND_AUTOMATION_WIDTH,
      height: COMPACT_BACKGROUND_AUTOMATION_HEIGHT
    });
    try {
      arg2.webContents.invalidate?.();
    } catch (error) {}
    maybeDestroyBackgroundAutomationHostWindow();
    console.log("[Main] 实况视图已在主窗口内离屏保留: " + arg1);
    return true;
  }
  function attachAutomationViewToBackgroundHost(arg1, arg2, {
    active = false,
    force = false
  } = {}) {
    if (!arg2 || arg2.webContents?.isDestroyed?.()) {
      return;
    }
    if (!force && shouldAttachAutomationView(arg1)) {
      console.log("[Main] 跳过后台托管（画面已打开）: " + arg1);
      return null;
    }
    const result = getMainWindow();
    if (parkAutomationViewInMainWindow(arg1, arg2)) {
      return result;
    }
    applyBackgroundAutomationOptimizations(arg2.webContents, {
      active: active
    });
    applyBackgroundAutomationZoom(arg2.webContents);
    removeAutomationViewFromWindow(result, arg2);
    const result2 = ensureBackgroundAutomationHostWindow();
    arg2.setBounds(buildCompactBackgroundAutomationBounds(arg1));
    if (!result2.getBrowserViews().includes(arg2)) {
      result2.addBrowserView(arg2);
    }
    if (!arg2.webContents.__radarBackgroundLowPowerHookAttached) {
      arg2.webContents.__radarBackgroundLowPowerHookAttached = true;
      arg2.webContents.on("dom-ready", () => {
        if (!getBackgroundAutomationHostViews().includes(arg2)) {
          return;
        }
        applyBackgroundAutomationOptimizations(arg2.webContents, {
          active: getBackgroundLayoutHoldViewKeys().has(arg1) || getInteractionLocksMap().has(arg1)
        });
      });
    }
    if (active) {
      const result = getBackgroundInteractionSlot();
      const local = !!result && (result.viewKey !== arg1 || result.webContentsId !== arg2.webContents.id);
      if (!local) {
        try {
          result2.setTopBrowserView(arg2);
        } catch (error) {}
        armBackgroundHostInternalActivation();
        focusAutomationWebContentsSafely(arg2.webContents);
        parkBackgroundAutomationHostWindow(result2, "after-active-attach");
        try {
          if (result2.isFocused()) {
            result2.blur();
          }
        } catch (error) {}
        scheduleBackgroundAutomationHostRepark(result2, "after-active-attach");
      }
    }
    return result2;
  }
  function attachLivePreviewSpectatorIfPossible(arg1, text = "preview-spectator") {
    if (!arg1 || !shouldAttachAutomationView(arg1)) {
      return false;
    }
    const result = getPlatformViews().get(arg1);
    if (!result || result.webContents?.isDestroyed?.()) {
      return false;
    }
    if (getInteractionLocksMap().has(arg1)) {
      const result2 = restoreVisibleInteractionStack(arg1, text);
      if (result2.restored) {
        nudgeAutomationViewRepaint(result.webContents, result);
        return true;
      }
      return false;
    }
    if (restoreAutomationPreviewAfterExecution(arg1, result)) {
      return true;
    }
    console.warn("[Main] 打开画面暂无有效卡片尺寸，等待 bounds 同步: " + arg1 + " (" + text + ")");
    return false;
  }
  function enterBackgroundDetachedMode(arg1, arg2) {
    if (!arg2 || arg2.webContents?.isDestroyed?.()) {
      return;
    }
    getBackgroundLayoutHoldViewKeys().delete(arg1);
    getBackgroundDetachedViewKeys().add(arg1);
    attachAutomationViewToBackgroundHost(arg1, arg2, {
      active: false
    });
    console.log("[Main] 任务进入低功耗后台宿主: " + arg1);
  }
  async function ensureBackgroundAutomationLayout(arg1, {
    claimInteractionSlot = false,
    requesterWebContents = null,
    requireComposerSurface = false
  } = {}) {
    if (!arg1) {
      return {
        ok: false,
        reason: "no_view_key"
      };
    }
    const result = getPlatformViews().get(arg1);
    if (!result) {
      return {
        ok: false,
        reason: "no_view"
      };
    }
    if (!map.has(arg1)) {
      map.set(arg1, 1);
    }
    const result2 = map.get(arg1);
    const result3 = String(getViewSettingsMap().get(arg1)?.taskId || "");
    const result4 = String(getInteractionLocksMap().get(arg1)?.interactionId || "");
    const flag = !!isBatchViewRuntimeActive?.(arg1);
    const flag2 = !!isMonitorTaskViewRunning?.(arg1);
    const local = () => map.get(arg1) === result2 && getPlatformViews().get(arg1) === result && !result.webContents?.isDestroyed?.() && String(getViewSettingsMap().get(arg1)?.taskId || "") === result3 && String(getInteractionLocksMap().get(arg1)?.interactionId || "") === result4 && (!flag || !!isBatchViewRuntimeActive?.(arg1)) && (!flag2 || !!isMonitorTaskViewRunning?.(arg1)) && (shouldAttachAutomationView(arg1) || shouldKeepAutomationViewAttached(arg1));
    if (shouldAttachAutomationView(arg1) && !claimInteractionSlot) {
      const result2 = getMainWindow();
      return {
        ok: true,
        attached: !!result2 && !result2.isDestroyed() && !!result2.getBrowserViews().includes(result),
        visible: true
      };
    }
    if (!shouldAttachAutomationView(arg1) && !shouldKeepAutomationViewAttached(arg1)) {
      return {
        ok: true,
        attached: false,
        reason: "no_active_task"
      };
    }
    let flag3 = false;
    let num = 0;
    if (claimInteractionSlot) {
      const result2 = await acquireBackgroundInteractionSlot(arg1, requesterWebContents || result.webContents);
      if (!result2?.acquired) {
        return {
          ok: false,
          attached: false,
          reason: result2?.reason || "interaction_slot_failed"
        };
      }
      if (!local()) {
        releaseBackgroundInteractionSlot(arg1, requesterWebContents || result.webContents, "stale_layout_generation");
        return {
          ok: false,
          attached: false,
          reason: "stale_layout_generation"
        };
      }
      flag3 = true;
      num = Number(result2.waitedMs || 0);
      if (shouldAttachAutomationView(arg1) && !getInteractionLocksMap().has(arg1)) {
        removeAutomationViewFromBackgroundHost(result);
        const result2 = getMainWindow();
        if (result2 && !result2.isDestroyed() && !result2.getBrowserViews().includes(result)) {
          result2.addBrowserView(result);
        }
        restoreForegroundAutomationRendering(result.webContents);
        safeSetTopBrowserView(result, {
          context: "ensure-visible-main-interaction:" + arg1
        });
        focusAutomationWebContentsSafely(result.webContents);
        return {
          ok: true,
          attached: true,
          visible: true,
          interactionSlotAcquired: flag3,
          interactionSlotWaitedMs: num
        };
      }
    }
    if (getInteractionLocksMap().has(arg1)) {
      const result2 = getInteractionLocksMap().get(arg1);
      const result3 = getInteractionViewsMap().get(arg1);
      if (result3 && !result3.webContents.isDestroyed()) {
        if (shouldShowInteractionView(arg1) && isValidAutomationBounds(result2?.bounds)) {
          const result = restoreVisibleInteractionStack(arg1, "ensure-visible-subview-interaction:" + arg1);
          if (result.interactionVisible) {
            focusAutomationWebContentsSafely(result3.webContents, {
              force: true
            });
          }
          getBackgroundLayoutHoldViewKeys().add(arg1);
          return {
            ok: true,
            attached: true,
            visible: true,
            interaction: result.interactionVisible,
            warming: !result.interactionVisible,
            interactionSlotAcquired: flag3,
            interactionSlotWaitedMs: num
          };
        }
        attachAutomationViewToBackgroundHost(arg1, result3, {
          active: true
        });
        const local2 = requireComposerSurface && activateBackgroundAutomationComposerSurface(arg1, result3.webContents);
        const value = requireComposerSurface ? await emulateBackgroundAutomationPageFocus(result3.webContents) : {
          enabled: false
        };
        if (requireComposerSurface) {
          result3.setBounds(buildCompactBackgroundAutomationBounds(arg1));
          notifyAutomationViewportChanged(result3.webContents, {
            force: true
          });
          nudgeAutomationViewRepaint(result3.webContents, result3);
          const value = num >= 500 ? BACKGROUND_INTERACTION_RESUME_WARMUP_MS : Math.max(BACKGROUND_LAYOUT_WARMUP_MS, 420);
          await new Promise(arg1 => setTimeout(arg1, value));
          if (!local()) {
            if (flag3) {
              releaseBackgroundInteractionSlot(arg1, requesterWebContents || result.webContents, "stale_layout_generation");
            }
            return {
              ok: false,
              attached: false,
              reason: "stale_layout_generation"
            };
          }
        }
        getBackgroundDetachedViewKeys().delete(arg1);
        getBackgroundLayoutHoldViewKeys().add(arg1);
        return {
          ok: true,
          attached: true,
          interaction: true,
          stableViewport: true,
          composerSurface: !!local2,
          focusEmulated: !!value.enabled,
          surfaceWarmupMs: requireComposerSurface ? num >= 500 ? BACKGROUND_INTERACTION_RESUME_WARMUP_MS : Math.max(BACKGROUND_LAYOUT_WARMUP_MS, 420) : 0,
          nativeWindowFocused: !!getBackgroundAutomationHostWindow()?.isFocused?.(),
          webContentsFocused: !!result3.webContents?.isFocused?.(),
          interactionSlotAcquired: flag3,
          interactionSlotWaitedMs: num
        };
      }
    }
    if (canParkAutomationViewInMainWindow()) {
      const value = getInteractionLocksMap().has(arg1) ? getInteractionViewsMap().get(arg1) || result : result;
      getBackgroundDetachedViewKeys().delete(arg1);
      getBackgroundLayoutHoldViewKeys().add(arg1);
      parkAutomationViewInMainWindow(arg1, value);
      nudgeAutomationViewRepaint(value.webContents, value);
      await new Promise(arg1 => setTimeout(arg1, BACKGROUND_LAYOUT_WARMUP_MS));
      if (!local()) {
        if (flag3) {
          releaseBackgroundInteractionSlot(arg1, requesterWebContents || result.webContents, "stale_layout_generation");
        }
        return {
          ok: false,
          attached: false,
          reason: "stale_layout_generation"
        };
      }
      return {
        ok: true,
        attached: true,
        parkedInMainWindow: true,
        interactionSlotAcquired: flag3,
        interactionSlotWaitedMs: num
      };
    }
    const result5 = ensureBackgroundAutomationHostWindow();
    if (getBackgroundLayoutHoldViewKeys().has(arg1) && result5.getBrowserViews().includes(result)) {
      attachAutomationViewToBackgroundHost(arg1, result, {
        active: true
      });
      const local2 = requireComposerSurface && activateBackgroundAutomationComposerSurface(arg1, result.webContents);
      const value = requireComposerSurface ? await emulateBackgroundAutomationPageFocus(result.webContents) : {
        enabled: false
      };
      if (requireComposerSurface) {
        result.setBounds(buildCompactBackgroundAutomationBounds(arg1));
        notifyAutomationViewportChanged(result.webContents, {
          force: true
        });
        nudgeAutomationViewRepaint(result.webContents, result);
        const value = num >= 500 ? BACKGROUND_INTERACTION_RESUME_WARMUP_MS : Math.max(BACKGROUND_LAYOUT_WARMUP_MS, 420);
        await new Promise(arg1 => setTimeout(arg1, value));
        if (!local()) {
          if (flag3) {
            releaseBackgroundInteractionSlot(arg1, requesterWebContents || result.webContents, "stale_layout_generation");
          }
          return {
            ok: false,
            attached: false,
            reason: "stale_layout_generation"
          };
        }
      }
      return {
        ok: true,
        attached: true,
        reused: true,
        composerSurface: !!local2,
        focusEmulated: !!value.enabled,
        surfaceWarmupMs: requireComposerSurface ? num >= 500 ? BACKGROUND_INTERACTION_RESUME_WARMUP_MS : Math.max(BACKGROUND_LAYOUT_WARMUP_MS, 420) : 0,
        nativeWindowFocused: !!getBackgroundAutomationHostWindow()?.isFocused?.(),
        webContentsFocused: !!result.webContents?.isFocused?.(),
        interactionSlotAcquired: flag3,
        interactionSlotWaitedMs: num
      };
    }
    attachAutomationViewToBackgroundHost(arg1, result, {
      active: true
    });
    const local2 = requireComposerSurface && activateBackgroundAutomationComposerSurface(arg1, result.webContents);
    const value = requireComposerSurface ? await emulateBackgroundAutomationPageFocus(result.webContents) : {
      enabled: false
    };
    getBackgroundDetachedViewKeys().delete(arg1);
    getBackgroundLayoutHoldViewKeys().add(arg1);
    nudgeAutomationViewRepaint(result.webContents, result);
    const value2 = requireComposerSurface && num >= 500 ? BACKGROUND_INTERACTION_RESUME_WARMUP_MS : requireComposerSurface ? Math.max(BACKGROUND_LAYOUT_WARMUP_MS, 420) : BACKGROUND_LAYOUT_WARMUP_MS;
    await new Promise(arg1 => setTimeout(arg1, value2));
    if (!local()) {
      if (flag3) {
        releaseBackgroundInteractionSlot(arg1, requesterWebContents || result.webContents, "stale_layout_generation");
      }
      return {
        ok: false,
        attached: false,
        reason: "stale_layout_generation"
      };
    }
    return {
      ok: true,
      attached: true,
      composerSurface: !!local2,
      focusEmulated: !!value.enabled,
      surfaceWarmupMs: value2,
      nativeWindowFocused: !!getBackgroundAutomationHostWindow()?.isFocused?.(),
      webContentsFocused: !!result.webContents?.isFocused?.(),
      interactionSlotAcquired: flag3,
      interactionSlotWaitedMs: num
    };
  }
  function releaseBackgroundAutomationLayout(arg1) {
    if (!arg1) {
      return {
        ok: false,
        reason: "no_view_key"
      };
    }
    fn(arg1);
    releaseBackgroundAutomationComposerSurface(arg1);
    const result = getBackgroundLayoutHoldViewKeys();
    if (!result.has(arg1)) {
      return {
        ok: true,
        skipped: true
      };
    }
    const result2 = getPlatformViews().get(arg1);
    result.delete(arg1);
    if (getInteractionLocksMap().has(arg1)) {
      const result3 = getInteractionLocksMap().get(arg1);
      const result4 = getInteractionViewsMap().get(arg1);
      let flag = false;
      if (result4 && !result4.webContents?.isDestroyed?.()) {
        if (shouldShowInteractionView(arg1) && isValidAutomationBounds(result3?.bounds)) {
          const result = restoreVisibleInteractionStack(arg1, "release-visible-subview-interaction:" + arg1);
          flag = result.interactionVisible;
        } else {
          attachAutomationViewToBackgroundHost(arg1, result4, {
            active: true
          });
        }
        result.add(arg1);
      }
      if (result2 && !flag) {
        restoreAutomationPreviewAfterExecution(arg1, result2);
      }
      if (flag) {
        return {
          ok: true,
          visible: true,
          interaction: true
        };
      } else {
        return {
          ok: true,
          stableViewport: true,
          previewWatchOnly: true
        };
      }
    }
    if (shouldAttachAutomationView(arg1)) {
      if (result2) {
        if (!restoreAutomationPreviewAfterExecution(arg1, result2)) {
          restoreForegroundAutomationRendering(result2.webContents);
        }
      }
      return {
        ok: true,
        visible: true
      };
    }
    if (result2 && shouldKeepAutomationViewAttached(arg1)) {
      enterBackgroundDetachedMode(arg1, result2);
    }
    return {
      ok: true
    };
  }
  async function acquireEntityExecutionViewportLease(arg1, {
    taskGeneration = 0,
    runtimeTaskId = ""
  } = {}) {
    const result = String(arg1 || "");
    if (!result.startsWith("entity_")) {
      return {
        ok: false,
        reason: "not_entity_view"
      };
    }
    const result2 = getPlatformViews().get(result);
    if (!result2 || result2.webContents?.isDestroyed?.()) {
      return {
        ok: false,
        reason: "view_unavailable"
      };
    }
    const obj = {
      taskGeneration: Number(taskGeneration) || 0,
      runtimeTaskId: String(runtimeTaskId || ""),
      acquiredAt: Date.now()
    };
    map2.set(result, obj);
    getBackgroundLayoutHoldViewKeys().add(result);
    let local;
    if (shouldAttachAutomationView(result)) {
      const result3 = getBoundsStateByViewKey().get(result);
      removeAutomationViewFromBackgroundHost(result2);
      restoreForegroundAutomationRendering(result2.webContents);
      const result4 = getMainWindow();
      if (result4 && !result4.isDestroyed() && !result4.getBrowserViews().includes(result2)) {
        result4.addBrowserView(result2);
      }
      if (isValidAutomationBounds(result3?.bounds)) {
        result2.setBounds({
          ...result3.bounds
        });
      }
      if (Number(result3?.zoomFactor) > 0) {
        try {
          result2.webContents.setZoomFactor(Number(result3.zoomFactor));
        } catch (error) {}
      }
      safeSetTopBrowserView(result2, {
        context: "entity-execution-lease:" + result
      });
      local = {
        ok: true,
        attached: true,
        visible: true
      };
    } else {
      local = await ensureBackgroundAutomationLayout(result, {
        claimInteractionSlot: false
      });
    }
    const result3 = map2.get(result);
    if (result3 !== obj || local && local.ok === false || getPlatformViews().get(result) !== result2 || result2.webContents?.isDestroyed?.()) {
      if (result3 === obj) {
        map2.delete(result);
        getBackgroundLayoutHoldViewKeys().delete(result);
      }
      return {
        ok: false,
        reason: local?.reason || "stale_entity_execution_lease"
      };
    }
    return {
      ok: true,
      taskGeneration: obj.taskGeneration,
      layout: local || null
    };
  }
  function releaseEntityExecutionViewportLease(arg1, {
    taskGeneration = null
  } = {}) {
    const result = String(arg1 || "");
    if (!result.startsWith("entity_")) {
      return {
        ok: false,
        reason: "not_entity_view"
      };
    }
    const result2 = map2.get(result);
    if (!result2) {
      return {
        ok: true,
        skipped: true
      };
    }
    if (taskGeneration != null && Number(taskGeneration) !== Number(result2.taskGeneration)) {
      return {
        ok: false,
        reason: "stale_entity_execution_lease_release"
      };
    }
    map2.delete(result);
    return releaseBackgroundAutomationLayout(result);
  }
  function hasEntityExecutionViewportLease(arg1) {
    return map2.has(String(arg1 || ""));
  }
  function detachAutomationViewFromWindow(arg1, arg2) {
    if (!arg2) {
      return;
    }
    const result = getMainWindow();
    if (getInteractionViewsMap().get(arg1) === arg2 && !getInteractionLocksMap().has(arg1)) {
      removeAutomationViewFromWindow(result, arg2);
      removeAutomationViewFromBackgroundHost(arg2);
      maybeDestroyBackgroundAutomationHostWindow();
      return;
    }
    if (getBackgroundLayoutHoldViewKeys().has(arg1)) {
      if (shouldKeepAutomationViewAttached(arg1)) {
        if (parkAutomationViewInMainWindow(arg1, arg2)) {
          return;
        }
        attachAutomationViewToBackgroundHost(arg1, arg2, {
          active: true
        });
      }
      return;
    }
    if (shouldKeepAutomationViewAttached(arg1)) {
      if (canParkAutomationViewInMainWindow()) {
        getBackgroundDetachedViewKeys().add(arg1);
        parkAutomationViewInMainWindow(arg1, arg2);
        return;
      }
      enterBackgroundDetachedMode(arg1, arg2);
      return;
    }
    clearBackgroundAutomationState(arg1);
    removeAutomationViewFromWindow(result, arg2);
    removeAutomationViewFromBackgroundHost(arg2);
    maybeDestroyBackgroundAutomationHostWindow();
  }
  function shouldShowInteractionView(arg1) {
    return shouldAttachAutomationView(arg1);
  }
  function restoreVisibleInteractionStack(arg1, text = "visible-interaction-stack") {
    const result = getInteractionLocksMap().get(arg1);
    const result2 = getPlatformViews().get(arg1);
    const result3 = getInteractionViewsMap().get(arg1);
    const result4 = getMainWindow();
    if (!result || !result2 || result2.webContents?.isDestroyed?.() || !shouldAttachAutomationView(arg1) || !result4 || result4.isDestroyed()) {
      return {
        restored: false,
        interactionVisible: false,
        interactionStaged: false
      };
    }
    const result5 = getBoundsStateByViewKey().get(arg1);
    const result6 = fn56(arg1, result);
    const value = result6.bounds;
    if (!isValidAutomationBounds(value)) {
      return {
        restored: false,
        interactionVisible: false,
        interactionStaged: false
      };
    }
    removeAutomationViewFromBackgroundHost(result2);
    restoreForegroundAutomationRendering(result2.webContents);
    if (!result4.getBrowserViews().includes(result2)) {
      result4.addBrowserView(result2);
    }
    result2.setBounds({
      ...value
    });
    if (Number(result5?.zoomFactor) > 0) {
      try {
        result2.webContents.setZoomFactor(Number(result5.zoomFactor));
      } catch (error) {}
    }
    let flag = false;
    let flag2 = false;
    if (result3 && !result3.webContents?.isDestroyed?.()) {
      removeAutomationViewFromBackgroundHost(result3);
      restoreForegroundAutomationRendering(result3.webContents);
      if (result6.zoomFactor > 0) {
        try {
          result3.webContents.setZoomFactor(result6.zoomFactor);
        } catch (error) {}
      }
      result3.setBounds({
        ...value
      });
      if (!result4.getBrowserViews().includes(result3)) {
        result4.addBrowserView(result3);
      }
      const value2 = result6.zoomFactor;
      if (value2 > 0 && value2 < 0.98) {
        schedulePreviewViewportResizeAfterZoom(result3.webContents);
      } else {
        notifyAutomationViewportChanged(result3.webContents, {
          force: true
        });
      }
      nudgeAutomationViewRepaint(result3.webContents, result3);
      flag2 = true;
    }
    if (result.visibleSwapReady && flag2) {
      safeSetTopBrowserView(result3, {
        context: text + ":interaction-top"
      });
      flag = true;
    } else {
      safeSetTopBrowserView(result2, {
        context: text + ":main-cover"
      });
    }
    getBackgroundDetachedViewKeys().delete(arg1);
    return {
      restored: true,
      interactionVisible: flag,
      interactionStaged: flag2
    };
  }
  function safeSetTopBrowserView(arg1, {
    attachIfMissing = false,
    context = ""
  } = {}) {
    const result = getMainWindow();
    if (!result || result.isDestroyed() || !arg1) {
      return false;
    }
    try {
      const result2 = result.getBrowserViews().includes(arg1);
      if (!result2 && attachIfMissing) {
        result.addBrowserView(arg1);
      } else if (!result2) {
        return false;
      }
      result.setTopBrowserView(arg1);
      return true;
    } catch (error) {
      console.warn("[Main] setTopBrowserView 已忽略(" + (context || "unknown") + "): " + error.message);
      return false;
    }
  }
  function countPlatformAutomationViews(arg1) {
    let num = 0;
    for (const item of getPlatformViews().keys()) {
      if (item === arg1 || item.startsWith(arg1 + "_")) {
        num++;
      }
    }
    return num;
  }
  function attachMainAutomationView(arg1) {
    const result = getPlatformViews().get(arg1);
    const result2 = getMainWindow();
    if (!result || !result2 || result2.isDestroyed()) {
      return;
    }
    if (isAutomationExecutionViewportLocked(arg1)) {
      if (shouldAttachAutomationView(arg1)) {
        restoreVisibleInteractionStack(arg1, "attach-main-locked:" + arg1);
        return;
      }
      const value = getInteractionLocksMap().has(arg1) ? getInteractionViewsMap().get(arg1) : null;
      if (value && !value.webContents?.isDestroyed?.()) {
        attachAutomationViewToBackgroundHost(arg1, value, {
          active: true
        });
        getBackgroundLayoutHoldViewKeys().add(arg1);
        restoreAutomationPreviewAfterExecution(arg1, result);
      } else {
        attachAutomationViewToBackgroundHost(arg1, result, {
          active: true
        });
        getBackgroundLayoutHoldViewKeys().add(arg1);
      }
      return;
    }
    if (shouldAttachAutomationView(arg1)) {
      removeAutomationViewFromBackgroundHost(result);
      restoreForegroundAutomationRendering(result.webContents);
      const result3 = getBoundsStateByViewKey().get(arg1);
      if (isValidAutomationBounds(result3?.bounds)) {
        result.setBounds({
          ...result3.bounds
        });
      }
      if (Number(result3?.zoomFactor) > 0) {
        try {
          result.webContents.setZoomFactor(Number(result3.zoomFactor));
        } catch (error) {}
      }
      if (!result2.getBrowserViews().includes(result)) {
        result2.addBrowserView(result);
      }
      safeSetTopBrowserView(result, {
        context: "attachMainAutomationView:" + arg1
      });
    } else {
      detachAutomationViewFromWindow(arg1, result);
    }
  }
  function isValidAutomationBounds(arg1) {
    return Boolean(arg1 && arg1.width > 50 && arg1.height > 50 && arg1.x > -1000 && arg1.y > -1000);
  }
  function resolveInteractionViewportBounds(arg1, arg2, arg3 = null, arg4 = null) {
    const result = shouldAttachAutomationView(arg1);
    const result2 = getBoundsStateByViewKey();
    const list = [arg2?.getBounds?.(), arg4?.previewBounds, arg4?.bounds, arg3?.getBounds?.(), result2.get(arg1)?.bounds, result2.get(arg1 + ":interaction")?.bounds];
    if (result) {
      for (const item of list) {
        if (isValidAutomationBounds(item)) {
          return {
            ...item
          };
        }
      }
    } else {
      for (const item of list) {
        if (isValidAutomationBounds(item) && Number(item.x) < -100 && Number(item.y) < -100) {
          return {
            x: 0,
            y: 0,
            width: Math.max(Number(item.width) || 0, COMPACT_BACKGROUND_AUTOMATION_WIDTH),
            height: Math.max(Number(item.height) || 0, COMPACT_BACKGROUND_AUTOMATION_HEIGHT)
          };
        }
        if (item && Number(item.width) > 50 && Number(item.height) > 50) {
          return {
            x: 0,
            y: 0,
            width: Math.max(Number(item.width) || 0, COMPACT_BACKGROUND_AUTOMATION_WIDTH),
            height: Math.max(Number(item.height) || 0, COMPACT_BACKGROUND_AUTOMATION_HEIGHT)
          };
        }
      }
      return buildCompactBackgroundAutomationBounds(arg1);
    }
    for (const item of list) {
      if (item && Number(item.width) > 50 && Number(item.height) > 50) {
        const obj = {
          x: 0,
          y: 0,
          width: Math.max(Number(item.width) || 0, COMPACT_BACKGROUND_AUTOMATION_WIDTH),
          height: Math.max(Number(item.height) || 0, COMPACT_BACKGROUND_AUTOMATION_HEIGHT)
        };
        console.warn("[Main] [" + arg1 + "] 实况坐标不完整，复用尺寸兜底 " + obj.width + "x" + obj.height);
        return obj;
      }
    }
    const result3 = buildCompactBackgroundAutomationBounds(arg1);
    console.warn("[Main] [" + arg1 + "] 无坐标缓存（多见于批量开始前未打开画面），使用默认后台视口 " + result3.width + "x" + result3.height);
    return result3;
  }
  function ensureMainViewVisibleForBatch(arg1) {
    const result = getPlatformViews().get(arg1);
    if (!result) {
      return null;
    }
    const result2 = getInteractionViewsMap().get(arg1);
    const result3 = getMainWindow();
    if (result3 && !result3.isDestroyed()) {
      const local = result2 && result3.getBrowserViews().includes(result2);
      const result4 = result3.getBrowserViews().includes(result);
      if (local || !result4) {
        console.log("[Batch] 恢复主自动化视图置顶: " + arg1 + " (interactionOnTop=" + local + ")");
        recoverMainAutomationView(arg1);
      } else if (shouldAttachAutomationView(arg1)) {
        safeSetTopBrowserView(result, {
          context: "ensureMainViewVisibleForBatch:" + arg1
        });
      }
    }
    return result;
  }
  function shouldNudgeAutomationViewGeometry(arg1) {
    if (process.platform !== "darwin") {
      return true;
    }
    const local = arg1?.getBounds?.();
    if (!local) {
      return true;
    }
    return !(local.x > -1000) || !(local.y > -1000);
  }
  function nudgeAutomationViewRepaint(arg1, arg2 = null) {
    if (!arg1 || arg1.isDestroyed()) {
      return;
    }
    try {
      arg1.invalidate();
      const local = arg1.getZoomFactor?.() || 1;
      if (local > 0) {
        arg1.setZoomFactor(local + 0.0001);
        setImmediate(() => {
          if (!arg1.isDestroyed()) {
            arg1.setZoomFactor(local);
            arg1.invalidate();
          }
        });
      }
      if (shouldNudgeAutomationViewGeometry(arg2)) {
        if (arg2 && typeof arg2.getBounds === "function" && typeof arg2.setBounds === "function") {
          const result = arg2.getBounds();
          if (result && result.width > 52 && result.height > 52 && result.x > -1000 && result.y > -1000) {
            arg2.setBounds({
              ...result,
              width: result.width - 1
            });
            setImmediate(() => {
              if (!arg2.webContents?.isDestroyed?.()) {
                arg2.setBounds(result);
                arg1.invalidate();
              }
            });
          }
        }
      } else {
        notifyAutomationViewportChanged(arg1, {
          force: true
        });
      }
    } catch (error) {}
  }
  function invalidateAutomationViewRepaint(arg1) {
    if (!arg1 || arg1.isDestroyed?.()) {
      return false;
    }
    try {
      arg1.invalidate();
      return true;
    } catch (error) {
      return false;
    }
  }
  function notifyAutomationViewportChanged(arg1, {
    force = false
  } = {}) {
    if (!arg1 || arg1.isDestroyed?.()) {
      return;
    }
    let result = weakMap.get(arg1);
    if (!result) {
      result = {
        lastAt: 0,
        timer: null
      };
      weakMap.set(arg1, result);
    }
    const local = () => {
      result.timer = null;
      result.lastAt = Date.now();
      if (arg1.isDestroyed?.()) {
        return;
      }
      arg1.executeJavaScript("\n                (() => {\n                    window.__radarAutomationViewportChangedAt = Date.now();\n                    requestAnimationFrame(() => {\n                        window.dispatchEvent(new Event('resize'));\n                        try { window.visualViewport?.dispatchEvent(new Event('resize')); } catch (_) {}\n                    });\n                    return true;\n                })()\n            ", true).catch(() => {});
    };
    const value = Date.now() - result.lastAt;
    if (force || value >= AUTOMATION_VIEWPORT_REFRESH_MIN_INTERVAL_MS) {
      if (result.timer) {
        clearTimeout(result.timer);
      }
      local();
      return;
    }
    if (result.timer) {
      return;
    }
    result.timer = setTimeout(local, AUTOMATION_VIEWPORT_REFRESH_MIN_INTERVAL_MS - value);
    if (typeof result.timer.unref === "function") {
      result.timer.unref();
    }
  }
  function nudgeMainWindowCompositor(text = "") {
    const result = getMainWindow();
    if (!result || result.isDestroyed()) {
      return;
    }
    const result2 = Date.now();
    if (result2 - num < MAIN_WINDOW_COMPOSITOR_NUDGE_COOLDOWN_MS) {
      return;
    }
    num = result2;
    try {
      result.webContents?.invalidate?.();
    } catch (error) {}
    if (process.platform === "darwin") {
      return;
    }
    try {
      if (result.isMinimized?.() || result.isMaximized?.() || result.isFullScreen?.()) {
        return;
      }
      const result2 = result.getBounds();
      if (!result2 || result2.width < 400 || result2.height < 300) {
        return;
      }
      result.setBounds({
        ...result2,
        width: result2.width - 1
      }, false);
      setImmediate(() => {
        try {
          const result = getMainWindow();
          if (!result || result.isDestroyed()) {
            return;
          }
          result.setBounds(result2, false);
          result.webContents?.invalidate?.();
        } catch (error) {}
      });
    } catch (error) {
      console.warn("[Main] 主窗口合成层唤醒已忽略(" + (text || "unknown") + "): " + error.message);
    }
  }
  function nudgeVisibleAutomationViews(text = "", {
    skipCompositor = false,
    heavy = false
  } = {}) {
    const result = getMainWindow();
    if (!result || result.isDestroyed()) {
      return false;
    }
    const result2 = getPlatformViews();
    const result3 = getInteractionLocksMap();
    const result4 = getInteractionViewsMap();
    let flag = false;
    for (const [local, local2] of result2.entries()) {
      if (!shouldAttachAutomationView(local)) {
        continue;
      }
      if (isAutomationExecutionViewportLocked(local)) {
        if (!local2?.webContents || local2.webContents.isDestroyed()) {
          continue;
        }
        if (!result.getBrowserViews().includes(local2) || getBackgroundAutomationHostViews().includes(local2) || !isValidAutomationBounds(local2.getBounds?.())) {
          flag = true;
          break;
        }
        continue;
      }
      const value = result3.has(local) ? result4.get(local) || local2 : local2;
      if (!value?.webContents || value.webContents.isDestroyed()) {
        continue;
      }
      if (!result.getBrowserViews().includes(value) || getBackgroundAutomationHostViews().includes(value)) {
        flag = true;
        break;
      }
    }
    if (flag) {
      restoreRequestedAutomationViewsToMainWindow("paint-audit:" + (text || "unknown"));
    }
    let flag2 = false;
    for (const [local, local2] of result2.entries()) {
      if (!shouldAttachAutomationView(local)) {
        continue;
      }
      const value = isAutomationExecutionViewportLocked(local) ? [local2] : result3.has(local) ? [result4.get(local) || local2] : [local2];
      for (const item of value) {
        if (!item?.webContents || item.webContents.isDestroyed()) {
          continue;
        }
        if (!result.getBrowserViews().includes(item)) {
          continue;
        }
        if (!isValidAutomationBounds(item.getBounds?.())) {
          continue;
        }
        if (heavy) {
          nudgeAutomationViewRepaint(item.webContents, item);
          flag2 = true;
        } else if (invalidateAutomationViewRepaint(item.webContents)) {
          flag2 = true;
        }
      }
    }
    if (flag2 && !skipCompositor) {
      nudgeMainWindowCompositor(text);
    }
    return flag2;
  }
  function scheduleVisibleAutomationViewsRepaint(text = "", {
    skipCompositor = false
  } = {}) {
    const result = getVisibleAutomationRepaintTimers();
    result.forEach(arg1 => clearTimeout(arg1));
    result.clear();
    VISIBLE_AUTOMATION_REPAINT_DELAYS_MS.forEach((arg1, arg2) => {
      const result2 = setTimeout(() => {
        result.delete(result2);
        nudgeVisibleAutomationViews(text, {
          heavy: arg2 === 0,
          skipCompositor: skipCompositor || arg2 > 0
        });
      }, arg1);
      if (typeof result2.unref === "function") {
        result2.unref();
      }
      result.add(result2);
    });
  }
  function wakeForegroundAutomationSurfaces(text = "") {
    const result = getMainWindow();
    if (!result || result.isDestroyed()) {
      return;
    }
    const result2 = getPlatformViews();
    const result3 = getInteractionLocksMap();
    const result4 = getInteractionViewsMap();
    const result5 = getBoundsStateByViewKey();
    const local = ({
      focus = false
    } = {}) => {
      let local = null;
      for (const [local2, local3] of result2.entries()) {
        if (!shouldAttachAutomationView(local2)) {
          continue;
        }
        if (isAutomationExecutionViewportLocked(local2)) {
          const local = local3;
          if (!local?.webContents || local.webContents.isDestroyed()) {
            continue;
          }
          if (!result.getBrowserViews().includes(local) || getBackgroundAutomationHostViews().includes(local) || !isValidAutomationBounds(local.getBounds?.())) {
            attachLivePreviewSpectatorIfPossible(local2, "wake-locked-missing");
          }
          if (!result.getBrowserViews().includes(local)) {
            continue;
          }
          const result2 = result5.get(local2);
          if (isValidAutomationBounds(result2?.bounds)) {
            try {
              local.setBounds({
                ...result2.bounds
              });
            } catch (error) {}
          }
          if (Number(result2?.zoomFactor) > 0) {
            try {
              local.webContents.setZoomFactor(Number(result2.zoomFactor));
            } catch (error) {}
          }
          try {
            local.webContents.invalidate();
          } catch (error) {}
          nudgeAutomationViewRepaint(local.webContents, local);
          continue;
        }
        const value = result3.has(local2) ? result4.get(local2) || local3 : local3;
        if (!value?.webContents || value.webContents.isDestroyed()) {
          continue;
        }
        if (!result.getBrowserViews().includes(value)) {
          continue;
        }
        const result2 = result5.get(local2);
        if (isValidAutomationBounds(result2?.bounds)) {
          try {
            value.setBounds({
              ...result2.bounds
            });
          } catch (error) {}
        }
        if (Number(result2?.zoomFactor) > 0) {
          try {
            value.webContents.setZoomFactor(Number(result2.zoomFactor));
          } catch (error) {}
        }
        try {
          value.webContents.invalidate();
        } catch (error) {}
        const local4 = focus && local2 === text;
        const result6 = Number(result2?.zoomFactor || 0);
        if (result6 > 0 && result6 < 0.98) {
          schedulePreviewViewportResizeAfterZoom(value.webContents);
        } else {
          value.webContents.executeJavaScript("\n                    (() => {\n                        requestAnimationFrame(() => {\n                            window.dispatchEvent(new Event('resize'));\n                            " + (local4 ? "window.dispatchEvent(new Event('focus'));" : "") + "\n                        });\n                        return true;\n                    })()\n                ", true).catch(() => {});
        }
        if (local4) {
          local = value;
        }
      }
      if (focus && local && result.isFocused?.()) {
        safeSetTopBrowserView(local, {
          context: "wake-foreground:" + text
        });
        try {
          local.webContents.focus();
        } catch (error) {}
      }
      try {
        result.webContents.invalidate();
      } catch (error) {}
    };
    try {
      if (result.isFocused?.()) {
        result.webContents.invalidate();
      } else {
        result.focus();
      }
    } catch (error) {}
    local({
      focus: true
    });
    const list = [80, 300, 700];
    list.forEach((arg1, arg2) => {
      const result = setTimeout(() => local({
        focus: arg2 === 0
      }), arg1);
      if (typeof result.unref === "function") {
        result.unref();
      }
    });
  }
  function areBoundsClose(arg1, arg2) {
    return Boolean(arg1 && arg2 && Math.abs(arg1.x - arg2.x) <= 1 && Math.abs(arg1.y - arg2.y) <= 1 && Math.abs(arg1.width - arg2.width) <= 1 && Math.abs(arg1.height - arg2.height) <= 1);
  }
  function shouldApplyBoundsUpdate(arg1, arg2, arg3) {
    const result = Date.now();
    const result2 = getBoundsStateByViewKey();
    const result3 = result2.get(arg1);
    if (result3 && areBoundsClose(result3.bounds, arg2) && Math.abs((result3.zoomFactor || 0) - (arg3 || 0)) < 0.001) {
      return false;
    }
    if (result3 && result - result3.at < BOUNDS_SYNC_MIN_INTERVAL_MS && Math.abs((result3.zoomFactor || 0) - (arg3 || 0)) < 0.001 && areBoundsClose(result3.pendingBounds || result3.bounds, arg2)) {
      return false;
    }
    result2.set(arg1, {
      bounds: {
        ...arg2
      },
      pendingBounds: {
        ...arg2
      },
      zoomFactor: arg3,
      at: result
    });
    return true;
  }
  function registerIpc() {
    ipcMain.on("update-automation-bounds", (arg1, arg2) => {
      const result = getAutomationWindow();
      if (typeof result !== "undefined" && result) {
        return;
      }
      const {
        bounds: bounds,
        zoomFactor: zoomFactor,
        viewKey = "douyin_default",
        light = false,
        force = false
      } = arg2;
      const value = Number(zoomFactor) > 0 ? fn2(zoomFactor) : zoomFactor;
      const result2 = getPlatformViews();
      const result3 = result2.get(viewKey);
      if (result3) {
        const result = getInteractionLocksMap();
        const result4 = getInteractionViewsMap();
        const result5 = getBackgroundLayoutHoldViewKeys();
        const result6 = getMainWindow();
        const result7 = result.get(viewKey);
        const result8 = result4.get(viewKey);
        const flag = !isValidAutomationBounds(result3.getBounds());
        const local = result8?.webContents?.getURL?.() || "";
        const value2 = result7 ? Date.now() - (result7.startedAt || 0) : 0;
        const local2 = result7 && flag && value2 > 200000 && (!local || local === "about:blank");
        if (result7 && !local2) {
          if (isValidAutomationBounds(bounds)) {
            cacheAutomationPreviewBounds(viewKey, bounds, value);
            cacheAutomationPreviewBounds(viewKey + ":interaction", bounds, value);
            if (shouldAttachAutomationView(viewKey)) {
              const result = restoreVisibleInteractionStack(viewKey, "update-bounds-locked-preview");
              if (!result.restored) {
                attachLivePreviewSpectatorIfPossible(viewKey, "update-bounds-locked-preview");
              } else {
                const result = result2.get(viewKey);
                if (result?.webContents && !result.webContents.isDestroyed()) {
                  nudgeAutomationViewRepaint(result.webContents, result);
                }
              }
            } else if (result8 && !shouldShowInteractionView(viewKey)) {
              attachAutomationViewToBackgroundHost(viewKey, result8, {
                active: true,
                force: true
              });
              result5.add(viewKey);
            }
          }
          return;
        }
        if ((flag || local2) && !isBackgroundAutomationHidden(viewKey)) {
          console.warn("[Main] 检测到主视图不可见" + (local2 ? "（僵死子视图锁）" : "") + "，强制恢复");
          recoverMainAutomationView(viewKey, bounds);
        }
        if (isValidAutomationBounds(bounds)) {
          if (result.has(viewKey)) {
            cacheAutomationPreviewBounds(viewKey, bounds, value);
            return;
          }
          if (shouldAttachAutomationView(viewKey) && result5.has(viewKey) && (!result6?.getBrowserViews?.().includes(result3) || getBackgroundAutomationHostViews().includes(result3) || !isValidAutomationBounds(result3.getBounds?.()))) {
            cacheAutomationPreviewBounds(viewKey, bounds, value);
            if (attachLivePreviewSpectatorIfPossible(viewKey, "update-bounds-layout-hold")) {
              return;
            }
          }
          if (!shouldAttachAutomationView(viewKey) && shouldKeepAutomationViewAttached(viewKey)) {
            shouldApplyBoundsUpdate(viewKey, bounds, value);
            attachAutomationViewToBackgroundHost(viewKey, result3, {
              active: result5.has(viewKey)
            });
            return;
          }
          const flag2 = !isValidAutomationBounds(result3.getBounds());
          const value2 = result6 && !result6.isDestroyed() ? result6.getBrowserViews().includes(result3) : false;
          const local = isBackgroundAutomationHidden(viewKey) || getBackgroundAutomationHostViews().includes(result3);
          const result2 = shouldApplyBoundsUpdate(viewKey, bounds, value);
          if (!flag && !local2 && !result2 && value2 && !local) {
            return;
          }
          const local3 = shouldAttachAutomationView(viewKey) && result6 && !result6.isDestroyed();
          if (local3) {
            if (local) {
              removeAutomationViewFromBackgroundHost(result3);
            }
            restoreForegroundAutomationRendering(result3.webContents);
          }
          result3.setBounds(bounds);
          if (value) {
            result3.webContents.setZoomFactor(value);
          }
          if (local3) {
            if (!value2) {
              result6.addBrowserView(result3);
            }
            if (!result.has(viewKey)) {
              safeSetTopBrowserView(result3, {
                context: "update-automation-bounds:" + viewKey
              });
            }
            clearBackgroundAutomationState(viewKey);
            maybeDestroyBackgroundAutomationHostWindow();
            if (Number(value) > 0 && Number(value) < 0.98) {
              schedulePreviewViewportResizeAfterZoom(result3.webContents);
            } else {
              notifyAutomationViewportChanged(result3.webContents, {
                force: force || !value2 || flag2 || local
              });
            }
          }
          if (!light || force || !value2 || flag2 || local) {
            nudgeAutomationViewRepaint(result3.webContents, result3);
            scheduleVisibleAutomationViewsRepaint("update-automation-bounds:" + viewKey, {
              skipCompositor: light && !force && !flag2
            });
          } else {
            try {
              result3.webContents.invalidate?.();
            } catch (error) {}
          }
        } else {
          console.warn("[Main] 无效的边界值: " + viewKey + ", bounds:", bounds);
        }
      } else {
        console.warn("[Main] 找不到对应的视图: " + viewKey + ", 当前池大小: " + result2.size);
      }
    });
    ipcMain.on("toggle-automation-detach", (arg1, arg2) => {
      const result = getPlatformViews();
      const result2 = getActivePlatform();
      const result3 = result.get(result2);
      if (!result3) {
        return;
      }
      try {
        if (arg2) {
          const result4 = getAutomationWindow();
          if (result4 && !result4.isDestroyed()) {
            result4.focus();
            return;
          }
          const result5 = getMainWindow();
          result.forEach((arg1, arg2) => {
            removeAutomationViewFromWindow(result5, arg1);
            if (arg1 === result3) {
              removeAutomationViewFromBackgroundHost(arg1);
            } else {
              detachAutomationViewFromWindow(arg2, arg1);
            }
          });
          const browserWindow = new BrowserWindow({
            width: 1000,
            height: 800,
            title: "采集引擎 - " + result2,
            autoHideMenuBar: true,
            backgroundColor: "#000000",
            webPreferences: {
              nodeIntegration: false,
              contextIsolation: true
            }
          });
          setAutomationWindow(browserWindow);
          applyPackagedWindowMenuPolicy(browserWindow);
          browserWindow.setBrowserView(result3);
          result3.setBounds({
            x: 0,
            y: 0,
            width: 1000,
            height: 800
          });
          browserWindow.on("resize", () => {
            const result = getAutomationWindow();
            if (result && !result.isDestroyed()) {
              const result2 = result.getContentBounds();
              result3.setBounds({
                x: 0,
                y: 0,
                width: result2.width,
                height: result2.height
              });
            }
          });
          browserWindow.on("close", () => {
            const result = getAutomationWindow();
            if (result && !result.isDestroyed()) {
              result.setBrowserView(null);
            }
          });
          browserWindow.on("closed", () => {
            setAutomationWindow(null);
            setTimeout(() => {
              const result2 = getMainWindow();
              if (result2 && !result2.isDestroyed()) {
                result.forEach(arg1 => result2.addBrowserView(arg1));
                result2.webContents.send("automation-attached");
              }
            }, 300);
          });
          arg1.reply("automation-detached");
        } else {
          const result2 = getAutomationWindow();
          const result3 = getMainWindow();
          if (result2 && !result2.isDestroyed()) {
            result2.close();
          } else if (result3) {
            result.forEach(arg1 => result3.addBrowserView(arg1));
            result3.webContents.send("automation-attached");
          }
        }
      } catch (error) {
        console.error("[Main] 切换自动化窗口模式失败:", error);
      }
    });
  }
  return {
    inferInteractionViewKey: inferInteractionViewKey,
    inferAutomationViewKey: inferAutomationViewKey,
    applyMainWindowRuntimePerformancePolicy: applyMainWindowRuntimePerformancePolicy,
    wakeMainWindowUiSurface: wakeMainWindowUiSurface,
    restoreMainWindowUiFocus: restoreMainWindowUiFocus,
    focusAutomationWebContentsSafely: focusAutomationWebContentsSafely,
    restoreRequestedAutomationViewsToMainWindow: restoreRequestedAutomationViewsToMainWindow,
    closeAutomationLivePreviewForBackground: closeAutomationLivePreviewForBackground,
    setMainWindowBackgroundState: setMainWindowBackgroundState,
    shouldAttachAutomationView: shouldAttachAutomationView,
    buildOffscreenAutomationBounds: buildOffscreenAutomationBounds,
    clearBackgroundInteractionSlot: clearBackgroundInteractionSlot,
    grantNextBackgroundInteractionSlot: grantNextBackgroundInteractionSlot,
    acquireBackgroundInteractionSlot: acquireBackgroundInteractionSlot,
    releaseBackgroundInteractionSlot: releaseBackgroundInteractionSlot,
    cancelBackgroundInteractionForView: cancelBackgroundInteractionForView,
    getBackgroundAutomationHostViews: getBackgroundAutomationHostViews,
    getBackgroundAutomationHostOffscreenBounds: getBackgroundAutomationHostOffscreenBounds,
    getBackgroundAutomationComposerSurfaceBounds: getBackgroundAutomationComposerSurfaceBounds,
    activateBackgroundAutomationComposerSurface: activateBackgroundAutomationComposerSurface,
    emulateBackgroundAutomationPageFocus: emulateBackgroundAutomationPageFocus,
    releaseBackgroundAutomationComposerSurface: releaseBackgroundAutomationComposerSurface,
    parkBackgroundAutomationHostWindow: parkBackgroundAutomationHostWindow,
    scheduleBackgroundAutomationHostRepark: scheduleBackgroundAutomationHostRepark,
    clearBackgroundHostInternalActivation: clearBackgroundHostInternalActivation,
    armBackgroundHostInternalActivation: armBackgroundHostInternalActivation,
    showBackgroundAutomationHostInactive: showBackgroundAutomationHostInactive,
    consumeBackgroundHostInternalActivation: consumeBackgroundHostInternalActivation,
    suppressMainWindowEventFromBackgroundHost: suppressMainWindowEventFromBackgroundHost,
    ensureBackgroundAutomationHostWindow: ensureBackgroundAutomationHostWindow,
    removeAutomationViewFromWindow: removeAutomationViewFromWindow,
    removeAutomationViewFromBackgroundHost: removeAutomationViewFromBackgroundHost,
    maybeDestroyBackgroundAutomationHostWindow: maybeDestroyBackgroundAutomationHostWindow,
    shouldKeepAutomationViewAttached: shouldKeepAutomationViewAttached,
    schedulePreviewViewportResizeAfterZoom: schedulePreviewViewportResizeAfterZoom,
    isBackgroundAutomationHidden: isBackgroundAutomationHidden,
    clearBackgroundAutomationState: clearBackgroundAutomationState,
    isAutomationExecutionViewportLocked: isAutomationExecutionViewportLocked,
    cacheAutomationPreviewBounds: cacheAutomationPreviewBounds,
    restoreAutomationPreviewAfterExecution: restoreAutomationPreviewAfterExecution,
    applyBackgroundAutomationOptimizations: applyBackgroundAutomationOptimizations,
    applyBackgroundAutomationZoom: applyBackgroundAutomationZoom,
    restoreForegroundAutomationRendering: restoreForegroundAutomationRendering,
    buildCompactBackgroundAutomationBounds: buildCompactBackgroundAutomationBounds,
    canParkAutomationViewInMainWindow: canParkAutomationViewInMainWindow,
    parkAutomationViewInMainWindow: parkAutomationViewInMainWindow,
    attachAutomationViewToBackgroundHost: attachAutomationViewToBackgroundHost,
    attachLivePreviewSpectatorIfPossible: attachLivePreviewSpectatorIfPossible,
    enterBackgroundDetachedMode: enterBackgroundDetachedMode,
    ensureBackgroundAutomationLayout: ensureBackgroundAutomationLayout,
    releaseBackgroundAutomationLayout: releaseBackgroundAutomationLayout,
    acquireEntityExecutionViewportLease: acquireEntityExecutionViewportLease,
    releaseEntityExecutionViewportLease: releaseEntityExecutionViewportLease,
    hasEntityExecutionViewportLease: hasEntityExecutionViewportLease,
    detachAutomationViewFromWindow: detachAutomationViewFromWindow,
    shouldShowInteractionView: shouldShowInteractionView,
    restoreVisibleInteractionStack: restoreVisibleInteractionStack,
    safeSetTopBrowserView: safeSetTopBrowserView,
    countPlatformAutomationViews: countPlatformAutomationViews,
    attachMainAutomationView: attachMainAutomationView,
    isValidAutomationBounds: isValidAutomationBounds,
    resolveInteractionViewportBounds: resolveInteractionViewportBounds,
    ensureMainViewVisibleForBatch: ensureMainViewVisibleForBatch,
    shouldNudgeAutomationViewGeometry: shouldNudgeAutomationViewGeometry,
    nudgeAutomationViewRepaint: nudgeAutomationViewRepaint,
    invalidateAutomationViewRepaint: invalidateAutomationViewRepaint,
    notifyAutomationViewportChanged: notifyAutomationViewportChanged,
    nudgeMainWindowCompositor: nudgeMainWindowCompositor,
    nudgeVisibleAutomationViews: nudgeVisibleAutomationViews,
    scheduleVisibleAutomationViewsRepaint: scheduleVisibleAutomationViewsRepaint,
    wakeForegroundAutomationSurfaces: wakeForegroundAutomationSurfaces,
    areBoundsClose: areBoundsClose,
    shouldApplyBoundsUpdate: shouldApplyBoundsUpdate,
    registerIpc: registerIpc
  };
}
module.exports = {
  createBackgroundAutomationLayout: createBackgroundAutomationLayout
};
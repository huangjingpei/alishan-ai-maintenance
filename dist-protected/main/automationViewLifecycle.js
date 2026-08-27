'use strict';

const {
  app,
  BrowserView
} = require("electron");
const {
  handleStripFrameBlockingHeaders
} = require("./stripFrameBlockingHeaders");
const TASK_FINISH_IDLE_DESTROY_DELAY_MS = 180000;
const INTERACTION_VIEW_IDLE_CLEANUP_MS = 8000;
const BATCH_INTERACTION_VIEW_IDLE_CLEANUP_MS = 2000;
const VIEW_RECOVERY_COOLDOWN_MS = 45000;
const AUTOMATION_LOAD_RECOVERY_MAX_ATTEMPTS = 3;
const COMPACT_BACKGROUND_AUTOMATION_WIDTH = 1200;
const COMPACT_BACKGROUND_AUTOMATION_HEIGHT = 800;
function createAutomationViewLifecycle(_0x4ae81e) {
  const {
    getMainWindow: _0x54c52a,
    getPlatformViews: _0x39aa66,
    getInteractionViewsMap: _0xa5046b,
    getInteractionLocksMap: _0x22e279,
    getViewSettingsMap: _0x44f283,
    getBoundsStateByViewKey: _0x30e2eb,
    getPendingAutomationWebContentsClose: _0x113bc,
    getPendingBatchByViewKey: _0x3a750c,
    getIsBatchActionRunningMap: _0x22c8c9,
    getViewActiveBatchRunMap: _0x286c23,
    getLastInteractionFinishedAtByViewKey: _0x6335d6,
    getPendingRestartByViewKey: _0x59c056,
    getAutomationViewsVisible: _0x33703b,
    getVisibleAutomationViewKeys: _0x2995e3,
    getIsCurrentUserFree: _0x3d4a02,
    isAutomationViewKey: _0x37a25f,
    isMonitorTaskViewRunning: _0x202e02,
    isBatchViewRuntimeActive: _0x4c8127,
    appendDiagnosticsLog: _0x121808,
    requestAutomationLayoutRefresh: _0x279615,
    getActiveAutomationSettings: _0x2c8833,
    clearBatchWaitTickersForView: _0x319f3c,
    releaseBatchRuntimeGuardIfIdle: _0x51538a,
    syncAutomationRuntimeGuard: _0x1f0868,
    completeBatchFromInteraction: _0xb7f4af,
    writeLog: _0x2d79a4,
    leadgenTasksApi: _0x21142b,
    extractDouyinVideoId: _0x51b7f4,
    configureAutomationSession: _0x3c4876,
    configureXianyuSession: _0x33ad47,
    attachProtocolGuard: _0xb4e8e1,
    resolveAutomationPreloadPath: _0x2601c1,
    applyAccountProxy: _0x45d853,
    getProcessedVideoUrlsForSettings: _0x18f1da,
    injectInteractedUsers: _0x2baadb,
    scheduleAutomationSessionCacheCheck: _0xe4a9f1,
    store: _0xc865df,
    runtimeConfig: _0x5e22a8,
    automationUserAgent: _0x27c89f,
    maxPlatformAccounts: _0x5b75e2,
    ensureAutomationPaintWatchdog: _0x5a86ad,
    stopAutomationPaintWatchdogIfIdle: _0x52dcff,
    maybeDestroyBackgroundAutomationHostWindow: _0x6ddccf,
    removeAutomationViewFromBackgroundHost: _0x32b016,
    clearBackgroundAutomationState: _0xe87a38,
    isBackgroundAutomationHidden: _0x2f4f64,
    cancelBackgroundInteractionForView: _0x15e66b,
    shouldAttachAutomationView: _0x336d7b,
    shouldKeepAutomationViewAttached: _0x55ada8,
    parkAutomationViewInMainWindow: _0x18718f,
    enterBackgroundDetachedMode: _0x101eb5,
    safeSetTopBrowserView: _0x1566de,
    nudgeAutomationViewRepaint: _0x21b775,
    restoreForegroundAutomationRendering: _0x3f46c7,
    restoreMainWindowUiFocus: _0x2409af,
    buildCompactBackgroundAutomationBounds: _0x3e659c,
    isValidAutomationBounds: _0x2def54,
    countPlatformAutomationViews: _0x60d4f8,
    attachMainAutomationView: _0x23b560,
    realignActiveChatViewBoundsAfterAutomationClose: _0x3b7dd4
  } = _0x4ae81e;
  const _0xe96807 = new Map();
  const _0x3f41e8 = new Map();
  const _0x2c6e76 = new Map();
  const _0x4f7b7a = new Map();
  const _0x4411eb = new Map();
  const _0x1aac24 = [];
  let _0x231b1f = null;
  function _0x14af3b(_0x46f30d) {
    const _0x142bd7 = _0x4f7b7a.get(_0x46f30d);
    if (!_0x142bd7) {
      return false;
    }
    clearTimeout(_0x142bd7);
    _0x4f7b7a.delete(_0x46f30d);
    console.log("[Main] 已取消待销毁视图计划: " + _0x46f30d);
    return true;
  }
  function _0x2ed997(_0x537d00) {
    const _0x30a429 = _0x4411eb.get(_0x537d00);
    if (!_0x30a429) {
      return false;
    }
    clearTimeout(_0x30a429);
    _0x4411eb.delete(_0x537d00);
    return true;
  }
  function _0x33575d(_0x419efc, _0x47bf8c, _0xb44e8e = {}) {
    _0x14af3b(_0x419efc);
    const _0x96a879 = setTimeout(() => {
      _0x4f7b7a.delete(_0x419efc);
      if (_0x4c8127(_0x419efc)) {
        console.log("[Main] 跳过延迟销毁（批量任务仍在运行）: " + _0x419efc);
        return;
      }
      if (_0x44f283().has(_0x419efc)) {
        console.log("[Main] 跳过延迟销毁（账号已重新启动）: " + _0x419efc);
        return;
      }
      if (_0x202e02(_0x419efc)) {
        console.log("[Main] 跳过延迟销毁（监控任务仍在运行）: " + _0x419efc);
        return;
      }
      const _0x450370 = _0x2995e3();
      if (_0x33703b() && (!_0x450370 || _0x450370.has(_0x419efc))) {
        console.log("[Main] 跳过延迟销毁（实况画面仍打开）: " + _0x419efc);
        return;
      }
      if (!_0x39aa66().has(_0x419efc) && !_0xa5046b().has(_0x419efc)) {
        return;
      }
      _0x1be5b8(_0x419efc, _0xb44e8e);
    }, Math.max(0, _0x47bf8c));
    if (typeof _0x96a879.unref === "function") {
      _0x96a879.unref();
    }
    _0x4f7b7a.set(_0x419efc, _0x96a879);
  }
  function _0x281e54(_0x44f467, {
    reason = "task_completed_idle",
    settingsSnapshot = null,
    skipHeavyRepaint = false,
    delayMs = TASK_FINISH_IDLE_DESTROY_DELAY_MS
  } = {}) {
    if (!_0x37a25f(_0x44f467)) {
      return false;
    }
    if (!_0x39aa66().has(_0x44f467) && !_0xa5046b().has(_0x44f467)) {
      return false;
    }
    if (_0x4c8127(_0x44f467)) {
      return false;
    }
    if (_0x44f283().has(_0x44f467)) {
      return false;
    }
    if (_0x202e02(_0x44f467)) {
      return false;
    }
    const _0x4a62df = _0x2995e3();
    if (_0x33703b() && (!_0x4a62df || _0x4a62df.has(_0x44f467))) {
      return false;
    }
    _0x33575d(_0x44f467, delayMs, {
      reason: reason,
      finalizeTask: false,
      settingsSnapshot: settingsSnapshot,
      skipHeavyRepaint: skipHeavyRepaint
    });
    console.log("[Main] 已计划 " + Math.round(delayMs / 1000) + "s 后释放已完成任务的预览视图: " + _0x44f467);
    return true;
  }
  function _0x48ba92(_0x43f8c3) {
    if (_0x231b1f || _0x1aac24.length === 0) {
      return;
    }
    const _0x19050b = Number.isFinite(_0x43f8c3) ? _0x43f8c3 : process.platform === "darwin" ? 1200 : 180;
    _0x231b1f = setTimeout(() => {
      _0x231b1f = null;
      const _0x50fa3b = _0x1aac24.shift();
      if (!_0x50fa3b) {
        return;
      }
      const {
        webContents: _0x58fa8b,
        viewKey: _0x300750,
        label: _0x217b5c
      } = _0x50fa3b;
      try {
        if (!_0x58fa8b.isDestroyed()) {
          try {
            if (_0x58fa8b.debugger?.isAttached?.()) {
              _0x58fa8b.debugger.detach();
            }
          } catch (_0x2daf27) {}
          _0x58fa8b.close({
            waitForBeforeUnload: false
          });
        }
        console.log("[Main] 自动化视图已安全关闭: " + _0x300750 + " (" + _0x217b5c + ")");
      } catch (_0x5be389) {
        console.warn("[Main] webContents.close(" + _0x217b5c + "/" + _0x300750 + ") 失败: " + _0x5be389.message);
      } finally {
        _0x113bc().delete(_0x58fa8b);
        _0x50fa3b.view = null;
      }
      _0x6ddccf();
      _0x3b7dd4();
      if (_0x1aac24.length > 0) {
        _0x48ba92(process.platform === "darwin" ? 500 : 100);
      }
    }, Math.max(0, _0x19050b));
    if (typeof _0x231b1f.unref === "function") {
      _0x231b1f.unref();
    }
  }
  function _0x29d89c(_0x3c5495, _0x1e5fd4, _0xbc6549) {
    const _0xb59dcd = _0x3c5495?.webContents;
    const _0x24706e = _0x113bc();
    if (!_0xb59dcd || _0xb59dcd.isDestroyed() || _0x24706e.has(_0xb59dcd)) {
      return;
    }
    _0x24706e.add(_0xb59dcd);
    try {
      _0xb59dcd.setAudioMuted(true);
    } catch (_0x37b0ff) {}
    try {
      _0xb59dcd.setFrameRate(1);
    } catch (_0x1f3d10) {}
    _0x1aac24.push({
      view: _0x3c5495,
      webContents: _0xb59dcd,
      viewKey: _0x1e5fd4,
      label: _0xbc6549
    });
    _0x48ba92();
  }
  function _0x505bf4(_0x1c6c04, _0x4a11df, _0x1e6bd4 = "main") {
    if (!_0x1c6c04) {
      return;
    }
    const _0x94ff15 = _0x54c52a();
    try {
      if (_0x94ff15 && !_0x94ff15.isDestroyed() && _0x94ff15.getBrowserViews().includes(_0x1c6c04)) {
        _0x94ff15.removeBrowserView(_0x1c6c04);
      }
    } catch (_0x347ce7) {
      console.warn("[Main] removeBrowserView(" + _0x1e6bd4 + "/" + _0x4a11df + ") 失败: " + _0x347ce7.message);
    }
    try {
      _0x32b016(_0x1c6c04);
    } catch (_0x886c8c) {
      console.warn("[Main] removeBackgroundBrowserView(" + _0x1e6bd4 + "/" + _0x4a11df + ") 失败: " + _0x886c8c.message);
    }
    _0x29d89c(_0x1c6c04, _0x4a11df, _0x1e6bd4);
    _0x6ddccf();
  }
  function _0x564020(_0x174a5c, _0x285d7f = "manual_stop") {
    const _0x51a174 = _0x54c52a();
    if (!_0x174a5c?.taskId || !_0x51a174 || _0x51a174.isDestroyed()) {
      return;
    }
    if (_0x174a5c.taskMode === "nurture") {
      _0x51a174.webContents.send("nurture-task-finished", {
        taskId: _0x174a5c.taskId,
        accountId: _0x174a5c.accountId,
        reason: _0x285d7f
      });
      return;
    }
    try {
      const _0x363950 = _0x21142b.finalizeTaskRun(_0x174a5c.taskId, {
        reason: _0x285d7f,
        accountId: _0x174a5c.accountId,
        progress: {}
      });
      if (_0x363950) {
        _0x51a174.webContents.send("leadgen-task-record-updated", _0x363950);
      }
    } catch (_0x5ca445) {
      console.warn("[Main] 停止任务落盘失败:", _0x5ca445.message);
    }
    _0x51a174.webContents.send("leadgen-task-finished", {
      taskId: _0x174a5c.taskId,
      accountId: _0x174a5c.accountId,
      reason: _0x285d7f,
      progress: {}
    });
  }
  function _0x1be5b8(_0x182e0b, {
    reason = "manual_stop",
    finalizeTask = true,
    settingsSnapshot = null,
    skipHeavyRepaint = false
  } = {}) {
    if (!_0x37a25f(_0x182e0b)) {
      return false;
    }
    const _0xf18b12 = reason === "manual_stop" || reason === "task_stopped" || reason === "app_quit";
    if (_0x202e02(_0x182e0b) && !_0xf18b12) {
      console.log("[Main] 拦截并阻止非手动停止的销毁动作: " + _0x182e0b + " (" + reason + ")");
      return false;
    }
    _0x14af3b(_0x182e0b);
    _0x2ed997(_0x182e0b);
    const _0x137889 = _0x44f283();
    const _0x4381aa = _0xa5046b();
    const _0x55e020 = _0x22e279();
    const _0x223162 = _0x39aa66();
    const _0x18b1c3 = settingsSnapshot || _0x137889.get(_0x182e0b) || null;
    const _0x1513d7 = _0x55e020.get(_0x182e0b);
    if (_0x1513d7?.timer) {
      clearTimeout(_0x1513d7.timer);
    }
    if (_0x1513d7?.taskDispatchTimer) {
      clearTimeout(_0x1513d7.taskDispatchTimer);
    }
    if (_0x1513d7?.profileOpenTimer) {
      clearTimeout(_0x1513d7.profileOpenTimer);
    }
    if (_0x1513d7?.loadListener) {
      const _0x1f8daf = _0x4381aa.get(_0x182e0b);
      try {
        _0x1f8daf?.webContents?.removeListener("did-finish-load", _0x1513d7.loadListener);
      } catch (_0x2a0d7d) {}
    }
    _0x55e020.delete(_0x182e0b);
    _0x3a750c().delete(_0x182e0b);
    _0x22c8c9().delete(_0x182e0b);
    _0x286c23().delete(_0x182e0b);
    _0x319f3c(_0x182e0b);
    _0x15e66b(_0x182e0b, "view_stopped");
    _0x51538a();
    const _0x206f03 = _0x4381aa.get(_0x182e0b);
    _0x505bf4(_0x206f03, _0x182e0b, "interaction");
    _0x4381aa.delete(_0x182e0b);
    const _0x22366c = _0x223162.get(_0x182e0b);
    _0x505bf4(_0x22366c, _0x182e0b, "main");
    _0x223162.delete(_0x182e0b);
    _0x137889.delete(_0x182e0b);
    _0x1f0868(_0x182e0b, null);
    _0x137889.delete(_0x182e0b + "_name");
    _0x137889.delete(_0x182e0b + "_platform");
    _0x137889.delete(_0x182e0b + "_douyinId");
    _0x3f41e8.delete(_0x182e0b);
    _0x30e2eb().delete(_0x182e0b);
    _0xe96807.delete(_0x182e0b);
    _0x55827c(_0x182e0b);
    _0x59c056().delete(_0x182e0b);
    _0xe87a38(_0x182e0b);
    _0x52dcff();
    const _0x1947b8 = _0x18b1c3?.accountId || null;
    const _0x33048e = _0x18b1c3?.taskId || null;
    const _0x25a95d = _0x54c52a();
    if (_0x25a95d && !_0x25a95d.isDestroyed()) {
      const _0x23b4b0 = _0x2c8833().length;
      _0x25a95d.webContents.send("automation-view-closed", {
        viewKey: _0x182e0b,
        accountId: _0x1947b8,
        taskId: _0x33048e,
        reason: reason,
        taskMode: _0x18b1c3?.taskMode || "leadgen",
        siblingCount: _0x23b4b0
      });
      if (_0x23b4b0 > 0) {
        console.log("[Main] automation-view-closed " + _0x182e0b + "，另有 " + _0x23b4b0 + " 个账号运行中（不触发全量布局刷新: " + skipHeavyRepaint + "）");
      }
    }
    if (finalizeTask && _0x18b1c3) {
      _0x564020(_0x18b1c3, reason);
    }
    console.log("[Main] 已停止并摘除自动化视图: " + _0x182e0b + " (" + reason + ")");
    try {
      _0xe4a9f1?.(_0x182e0b);
    } catch (_0x148974) {}
    _0x279615({
      light: skipHeavyRepaint
    });
    return true;
  }
  function _0x5198e9(_0x1504a6, _0x3bb1ec = "stop") {
    if (_0x22e279().has(_0x1504a6)) {
      _0x32eb48(_0x1504a6, {
        error: _0x3bb1ec
      }, _0x3bb1ec);
      return true;
    }
    const _0x219996 = _0x39aa66().get(_0x1504a6);
    if (_0x219996 && !_0x2def54(_0x219996.getBounds()) && !_0x2f4f64(_0x1504a6)) {
      return _0x3c2007(_0x1504a6, null, {
        force: true
      });
    }
    return false;
  }
  function _0x2a2221(_0x516fe5, _0x355c1b = "completed", {
    settingsSnapshot = null,
    skipHeavyRepaint = false
  } = {}) {
    if (!_0x37a25f(_0x516fe5)) {
      return false;
    }
    _0x14af3b(_0x516fe5);
    _0x5198e9(_0x516fe5, "task-finished");
    const _0x10f8c9 = _0x30e2eb().get(_0x516fe5)?.bounds || null;
    _0x3c2007(_0x516fe5, _0x10f8c9, {
      force: true,
      skipLayoutRefresh: true
    });
    _0x281e54(_0x516fe5, {
      reason: _0x355c1b === "completed" ? "task_completed_idle" : "task_finished_" + _0x355c1b,
      settingsSnapshot: settingsSnapshot,
      skipHeavyRepaint: skipHeavyRepaint
    });
    console.log("[Main] task-finished 保留预览视图位置: " + _0x516fe5 + " (" + _0x355c1b + ")");
    return true;
  }
  function _0x3c2007(_0x4d4d34, _0xc4d2a5 = null, {
    force = false,
    skipLayoutRefresh = false
  } = {}) {
    const _0x36e858 = _0x39aa66();
    const _0x3c2e7e = _0xa5046b();
    const _0x2c7362 = _0x22e279();
    const _0x40a300 = _0x36e858.get(_0x4d4d34);
    const _0xe41445 = _0x3c2e7e.get(_0x4d4d34);
    const _0x27addd = _0x54c52a();
    if (!_0x40a300 || !_0x27addd || _0x27addd.isDestroyed()) {
      return false;
    }
    if (!force && _0x2c7362.has(_0x4d4d34)) {
      console.log("[Main] 子视图互动进行中，跳过恢复主视图: " + _0x4d4d34);
      return false;
    }
    const _0x4bc045 = _0x2c7362.get(_0x4d4d34);
    let _0x5a2bba = null;
    const _0x51aa04 = _0x30e2eb().get(_0x4d4d34);
    const _0x348b31 = [_0xc4d2a5, _0x4bc045?.previewBounds, _0x51aa04?.bounds, _0x4bc045?.bounds, _0x40a300.getBounds(), _0xe41445?.getBounds()];
    for (const _0x5e5be6 of _0x348b31) {
      if (_0x2def54(_0x5e5be6)) {
        _0x5a2bba = {
          ..._0x5e5be6
        };
        break;
      }
    }
    if (!_0x5a2bba) {
      for (const _0x3afcf6 of _0x348b31) {
        if (_0x3afcf6 && Number(_0x3afcf6.width) > 50 && Number(_0x3afcf6.height) > 50) {
          _0x5a2bba = {
            x: 0,
            y: 0,
            width: Math.max(Number(_0x3afcf6.width) || 0, COMPACT_BACKGROUND_AUTOMATION_WIDTH),
            height: Math.max(Number(_0x3afcf6.height) || 0, COMPACT_BACKGROUND_AUTOMATION_HEIGHT)
          };
          break;
        }
      }
    }
    if (!_0x5a2bba) {
      _0x5a2bba = _0x3e659c(_0x4d4d34);
    }
    if (_0x4bc045?.timer) {
      clearTimeout(_0x4bc045.timer);
    }
    if (_0x4bc045?.taskDispatchTimer) {
      clearTimeout(_0x4bc045.taskDispatchTimer);
    }
    if (_0x4bc045?.profileOpenTimer) {
      clearTimeout(_0x4bc045.profileOpenTimer);
    }
    if (_0x4bc045?.loadListener && _0xe41445?.webContents) {
      try {
        _0xe41445.webContents.removeListener("did-finish-load", _0x4bc045.loadListener);
      } catch (_0x2fc51c) {}
    }
    try {
      if (_0xe41445) {
        const _0x228ab7 = Math.max(_0x5a2bba.width || 800, 100);
        const _0x3797f6 = Math.max(_0x5a2bba.height || 600, 100);
        _0xe41445.setBounds({
          x: -5000,
          y: -5000,
          width: _0x228ab7,
          height: _0x3797f6
        });
        _0xe41445.webContents.setAudioMuted(true);
        if (_0x27addd.getBrowserViews().includes(_0xe41445)) {
          _0x27addd.removeBrowserView(_0xe41445);
        }
        _0x32b016(_0xe41445);
        _0xe41445.webContents.loadURL("about:blank").catch(() => {});
      }
    } catch (_0x32f747) {
      console.warn("[Main] 隐藏互动视图失败: " + _0x32f747.message);
    }
    _0x2c7362.delete(_0x4d4d34);
    if (_0x336d7b(_0x4d4d34)) {
      _0x40a300.setBounds(_0x5a2bba);
      const _0x57982a = Number(_0x4bc045?.previewZoomFactor || _0x51aa04?.zoomFactor || _0x4bc045?.zoomFactor || 0);
      if (_0x57982a > 0) {
        _0x40a300.webContents.setZoomFactor(_0x57982a);
      }
      _0x21b775(_0x40a300.webContents, _0x40a300);
      _0x32b016(_0x40a300);
      _0x3f46c7(_0x40a300.webContents);
      if (!_0x27addd.getBrowserViews().includes(_0x40a300)) {
        _0x27addd.addBrowserView(_0x40a300);
      }
      _0x1566de(_0x40a300, {
        context: "recoverMainAutomationView:" + _0x4d4d34
      });
      _0xe87a38(_0x4d4d34);
      _0x6ddccf();
      console.log("[Main] 主视图已恢复(实况): " + _0x4d4d34 + " -> x:" + _0x5a2bba.x + ", y:" + _0x5a2bba.y + ", w:" + _0x5a2bba.width + ", h:" + _0x5a2bba.height);
    } else if (_0x55ada8(_0x4d4d34)) {
      const _0x593f01 = Number(_0x4bc045?.previewZoomFactor || _0x51aa04?.zoomFactor || _0x4bc045?.zoomFactor || 0);
      if (_0x593f01 > 0) {
        try {
          _0x40a300.webContents.setZoomFactor(_0x593f01);
        } catch (_0x3ae821) {}
      }
      if (_0x18718f(_0x4d4d34, _0x40a300)) {
        console.log("[Main] 主视图已离屏停靠(同获客): " + _0x4d4d34);
      } else {
        _0x101eb5(_0x4d4d34, _0x40a300);
        console.log("[Main] 主视图已迁入后台宿主: " + _0x4d4d34);
      }
    } else {
      _0xe87a38(_0x4d4d34);
      _0x32b016(_0x40a300);
      _0x6ddccf();
      console.log("[Main] 主视图已拆卸: " + _0x4d4d34);
    }
    if (!skipLayoutRefresh) {
      _0x279615();
    }
    return true;
  }
  function _0x32eb48(_0x359832, _0x4c9842 = {}, _0x566921 = "done", {
    notifyMainView = true,
    preferLatestBounds = false,
    skipIdleCleanup = false
  } = {}) {
    const _0x207135 = _0x39aa66();
    const _0x274d91 = _0xa5046b();
    const _0x3922f7 = _0x22e279();
    const _0x13c2f2 = _0x207135.get(_0x359832);
    const _0x564730 = _0x274d91.get(_0x359832);
    const _0x5aa200 = _0x54c52a();
    const _0x253588 = _0x3922f7.get(_0x359832);
    if (_0x253588?.timer) {
      clearTimeout(_0x253588.timer);
    }
    if (_0x253588?.taskDispatchTimer) {
      clearTimeout(_0x253588.taskDispatchTimer);
    }
    if (_0x253588?.profileOpenTimer) {
      clearTimeout(_0x253588.profileOpenTimer);
    }
    if (_0x253588) {
      _0x253588.profileOpenReady = true;
    }
    if (_0x253588?.loadListener && _0x564730?.webContents) {
      try {
        _0x564730.webContents.removeListener("did-finish-load", _0x253588.loadListener);
      } catch (_0x4ad06f) {}
    }
    if (!_0x13c2f2 || !_0x5aa200 || _0x5aa200.isDestroyed?.()) {
      _0x3922f7.delete(_0x359832);
      _0x15e66b(_0x359832, "interaction_orphaned:" + _0x566921);
      try {
        if (_0x564730) {
          if (_0x5aa200 && !_0x5aa200.isDestroyed?.() && _0x5aa200.getBrowserViews().includes(_0x564730)) {
            _0x5aa200.removeBrowserView(_0x564730);
          }
          _0x32b016(_0x564730);
          if (!_0x564730.webContents?.isDestroyed?.()) {
            _0x564730.webContents.loadURL("about:blank").catch(() => {});
          }
          if (!skipIdleCleanup) {
            _0x573379(_0x359832);
          }
        }
      } catch (_0x755cdf) {}
      _0x279615();
      console.warn("[Main] [子视图模式] 主视图已缺失，已清理互动锁: " + _0x359832 + " (" + _0x566921 + ")");
      return false;
    }
    const _0x304e79 = _0x30e2eb().get(_0x359832);
    const _0x4d6727 = preferLatestBounds && Number(_0x304e79?.zoomFactor) > 0 ? Number(_0x304e79.zoomFactor) : Number(_0x253588?.previewZoomFactor || _0x253588?.zoomFactor || 0);
    if (_0x253588 && _0x4d6727) {
      _0x253588.previewZoomFactor = _0x4d6727;
    }
    console.log("[Main] [子视图模式] 互动结束(" + _0x566921 + ")，恢复主视图");
    _0x15e66b(_0x359832, "interaction_finished:" + _0x566921);
    const _0x371827 = preferLatestBounds && _0x2def54(_0x304e79?.bounds) ? _0x304e79.bounds : _0x2def54(_0x253588?.previewBounds) ? _0x253588.previewBounds : _0x253588?.bounds;
    const _0x2a8cda = _0x3c2007(_0x359832, _0x371827, {
      force: true
    });
    if (!_0x2a8cda) {
      console.warn("[Main] [子视图模式] 恢复主视图坐标失败，等待 Dashboard 同步 bounds");
      _0x3922f7.delete(_0x359832);
      try {
        if (_0x564730 && _0x5aa200.getBrowserViews().includes(_0x564730)) {
          _0x5aa200.removeBrowserView(_0x564730);
        }
        if (_0x336d7b(_0x359832)) {
          const _0x1b456a = _0x30e2eb().get(_0x359832)?.bounds;
          if (_0x1b456a && _0x2def54(_0x1b456a)) {
            _0x13c2f2.setBounds({
              ..._0x1b456a
            });
            if (!_0x5aa200.getBrowserViews().includes(_0x13c2f2)) {
              _0x5aa200.addBrowserView(_0x13c2f2);
            }
            _0x1566de(_0x13c2f2, {
              context: "finishInteraction:fallback:" + _0x359832
            });
          }
        } else if (_0x55ada8(_0x359832)) {
          if (!_0x18718f(_0x359832, _0x13c2f2)) {
            _0x101eb5(_0x359832, _0x13c2f2);
          }
        }
      } catch (_0x46df8e) {}
    } else if (_0x4d6727 && _0x336d7b(_0x359832)) {
      _0x13c2f2.webContents.setZoomFactor(_0x4d6727);
    }
    _0x279615();
    _0x6335d6().set(_0x359832, Date.now());
    if (notifyMainView && !_0x13c2f2.webContents.isDestroyed()) {
      _0x13c2f2.webContents.send("interaction-result", _0x4c9842);
    }
    if (_0x564730) {
      try {
        if (!_0x564730.webContents.isDestroyed()) {
          _0x564730.webContents.loadURL("about:blank").catch(() => {});
        }
      } catch (_0x3db64d) {}
      if (!skipIdleCleanup) {
        _0x573379(_0x359832);
      }
    }
    if (!_0x33703b() && _0x5aa200 && !_0x5aa200.isDestroyed() && _0x5aa200.isVisible()) {
      setImmediate(() => _0x2409af("finish-interaction:" + _0x566921));
    }
    return true;
  }
  function _0x573379(_0x116e8a) {
    _0x2ed997(_0x116e8a);
    const _0x2ff978 = _0xa5046b().get(_0x116e8a);
    if (!_0x2ff978) {
      return;
    }
    const _0x274d98 = _0x4c8127(_0x116e8a) ? BATCH_INTERACTION_VIEW_IDLE_CLEANUP_MS : INTERACTION_VIEW_IDLE_CLEANUP_MS;
    const _0x4535c6 = setTimeout(() => {
      _0x4411eb.delete(_0x116e8a);
      try {
        _0x4608af(_0x116e8a, _0x2ff978, "idle-timeout");
      } catch (_0x894566) {
        console.warn("[Perf] 空闲互动视图清理失败 " + _0x116e8a + ": " + _0x894566.message);
      }
    }, _0x274d98);
    if (typeof _0x4535c6.unref === "function") {
      _0x4535c6.unref();
    }
    _0x4411eb.set(_0x116e8a, _0x4535c6);
  }
  function _0x4608af(_0x400374, _0x3e8efe = null, _0x277835 = "idle") {
    if (_0x22e279().has(_0x400374) || _0x3a750c().has(_0x400374)) {
      return false;
    }
    const _0xcd3799 = _0xa5046b();
    const _0x383ae1 = _0xcd3799.get(_0x400374);
    if (!_0x383ae1 || _0x3e8efe && _0x383ae1 !== _0x3e8efe) {
      return false;
    }
    _0x2ed997(_0x400374);
    _0xcd3799.delete(_0x400374);
    _0x505bf4(_0x383ae1, _0x400374, "interaction-idle");
    console.log("[Perf] 已销毁空闲互动视图: " + _0x400374 + " (" + _0x277835 + ")");
    return true;
  }
  function _0x1ab808(_0x16e023, _0x5d3756, _0x2b6473 = false) {
    if (!_0x16e023) {
      return;
    }
    _0x16e023.on("console-message", (_0x1ad8f9, _0x5d7722, _0x99d5bf, _0x5852e5, _0x35ba54) => {
      const _0x320760 = ["federation", "fallback", "Security Policy", "Failed to load", "Refused to load", "tracking", "Reporting Observer", "DevTools", "preloaded", "upgrade-insecure-requests", "CORS policy", "imapi.douyin.com", "xgplayer", "mammon", "UnredirectedLogger", "react does not satisfy", "react-dom does not satisfy", "kern.hv_vmm_present", "HTMLImageElement", "/aweme/v1/web", "[c0]", "icons.[object Object]", "init or use must be first call", "DevTools", "chrome-extension", "Failed to execute"];
      const _0x43b8de = _0x99d5bf.toLowerCase();
      if (_0x320760.some(_0xb3a3d5 => _0x43b8de.includes(_0xb3a3d5.toLowerCase()))) {
        return;
      }
      let _0x1f7a07 = _0x99d5bf.replace(/%c/g, "").trim();
      if (_0x1f7a07.includes("signature") || _0x1f7a07.includes("cookie") || _0x1f7a07.includes("token") || _0x1f7a07.includes("headers") || _0x1f7a07.includes("sec-ch-ua")) {
        return;
      }
      const _0xb00183 = _0x1f7a07.includes("[拟人操作]") || _0x1f7a07.includes("[状态识别]") || _0x1f7a07.includes("[环境清理]") || _0x1f7a07.includes("[页面就绪]") || _0x1f7a07.includes("[节奏控制]") || _0x1f7a07.includes("[执行策略]") || _0x1f7a07.includes("[交互警告]") || _0x1f7a07.includes("[子视图任务]") || _0x1f7a07.includes("[性别过滤]") || _0x1f7a07.includes("[互动动作]") || _0x1f7a07.includes("[详细信息提取]") || _0x1f7a07.includes("[环境重建]") || _0x1f7a07.includes("[网络加固]") || _0x1f7a07.includes("[会话恢复]") || _0x1f7a07.includes("[互动成功]") || _0x1f7a07.includes("[批量执行]") || _0x1f7a07.includes("[批量首作评论]") || _0x1f7a07.includes("[主页首作评论]");
      const _0x230e6b = ["DEBUG", "LOG", "WARN", "ERROR"];
      const _0x2f3bff = _0x230e6b[_0x5d7722] || "LOG";
      const _0x22ebab = _0x1f7a07.includes("[批量间隙闲逛]");
      const _0x11091c = _0x2b6473 ? "[主页跟进]" : _0x22ebab ? "[批量间隙]" : "[智能扫描]";
      const _0x4862d3 = _0x11091c + " " + _0x1f7a07;
      if (app.isPackaged && _0x2f3bff === "DEBUG") {
        return;
      }
      if (app.isPackaged && _0x2f3bff === "LOG" && !_0xb00183) {
        return;
      }
      _0x2d79a4(_0x2f3bff, [_0x4862d3]);
    });
  }
  function _0x3450ff(_0x41a98b, _0x43e2a7, {
    isInteraction = false
  } = {}) {
    if (!_0x41a98b || !_0x41a98b.webContents || _0x41a98b.webContents.__radarStabilityGuardsAttached) {
      return;
    }
    const _0x1f904d = _0x41a98b.webContents;
    _0x1f904d.__radarStabilityGuardsAttached = true;
    const _0x114de2 = _0x2b21ac => {
      if (!_0x1f904d || _0x1f904d.isDestroyed()) {
        return;
      }
      const _0x4678e6 = isInteraction ? _0xa5046b().get(_0x43e2a7) === _0x41a98b : _0x39aa66().get(_0x43e2a7) === _0x41a98b;
      if (!_0x4678e6 || _0x113bc().has(_0x1f904d)) {
        return;
      }
      const _0x4157d4 = Date.now();
      const _0x5ed5e2 = _0xe96807.get(_0x43e2a7) || {};
      const _0x245f9a = isInteraction ? _0x5ed5e2.lastInteractionAt : _0x5ed5e2.lastMainAt;
      if (_0x245f9a && _0x4157d4 - _0x245f9a < VIEW_RECOVERY_COOLDOWN_MS) {
        console.warn("[Main] 视图恢复已节流: " + _0x43e2a7 + (isInteraction ? ":interaction" : "") + " (" + _0x2b21ac + ")");
        return;
      }
      _0xe96807.set(_0x43e2a7, {
        ..._0x5ed5e2,
        [isInteraction ? "lastInteractionAt" : "lastMainAt"]: _0x4157d4
      });
      console.warn("[Main] 自动化视图异常，尝试恢复: " + _0x43e2a7 + (isInteraction ? ":interaction" : "") + " (" + _0x2b21ac + ")");
      try {
        if (isInteraction) {
          const _0x81fc02 = _0x3a750c().get(_0x43e2a7);
          if (_0x81fc02) {
            _0xb7f4af(_0x43e2a7, _0x81fc02, {
              success: false,
              error: "interaction-view-recovered:" + _0x2b21ac
            }, _0x1f904d);
          }
          _0x3c2007(_0x43e2a7, null, {
            force: true
          });
          _0x1f904d.loadURL("about:blank").catch(() => {});
          return;
        }
        const _0x4dda13 = _0x1f904d.getURL();
        if (_0x4dda13 && _0x4dda13 !== "about:blank") {
          _0x1f904d.reloadIgnoringCache();
        } else {
          const _0x51e5d2 = _0x44f283();
          const _0x50427b = _0x51e5d2.get(_0x43e2a7);
          if (_0x50427b) {
            _0x15bdd6(_0x50427b, _0x50427b.platform || _0x51e5d2.get(_0x43e2a7 + "_platform") || "douyin");
          }
        }
      } catch (_0x4972d7) {
        console.warn("[Main] 自动化视图恢复失败: " + _0x43e2a7 + " " + _0x4972d7.message);
      }
    };
    _0x1f904d.on("render-process-gone", (_0x434559, _0x319465 = {}) => {
      _0x114de2("render-process-gone:" + (_0x319465.reason || "unknown"));
    });
    _0x1f904d.on("unresponsive", () => {
      _0x114de2("unresponsive");
    });
  }
  function _0x34a652(_0x106577, _0x410ad0, _0x46cdc1) {
    if (!_0x46cdc1) {
      return Promise.resolve();
    }
    return _0x45d853(_0x46cdc1, _0x106577?.proxy, _0x410ad0).catch(_0x3b9e63 => {
      console.warn("[Proxy][" + _0x410ad0 + "] 应用代理失败: " + _0x3b9e63.message);
    });
  }
  function _0x38f527(_0x42cb0d, _0x1fd49e) {
    const _0x2d3e8a = {
      ..._0x1fd49e,
      viewKey: _0x42cb0d
    };
    const _0x11ccac = _0x59c056();
    if (_0x11ccac.get(_0x42cb0d)) {
      _0x2d3e8a.isRestart = true;
      _0x11ccac.delete(_0x42cb0d);
    }
    return _0x2d3e8a;
  }
  function _0x283d3b(_0x43a96e, _0x599015, _0x5dc19a) {
    if (!_0x43a96e || _0x43a96e.webContents.isDestroyed() || !_0x5dc19a?.taskId) {
      return;
    }
    _0x5e22a8.pushToWebContents(_0x43a96e.webContents);
    const _0x459cd6 = _0x38f527(_0x599015, _0x5dc19a);
    console.log("[Main] 下发 START_TASK: " + _0x599015 + " taskId=" + _0x5dc19a.taskId + " restart=" + !!_0x459cd6.isRestart);
    _0x43a96e.webContents.send("control-task", {
      type: "START_TASK",
      payload: _0x459cd6
    });
  }
  function _0x55827c(_0x4402a8) {
    const _0x177b6e = _0x2c6e76.get(_0x4402a8);
    if (_0x177b6e?.timer) {
      clearTimeout(_0x177b6e.timer);
    }
    _0x2c6e76.delete(_0x4402a8);
  }
  function _0x840d46(_0x552bb0, _0x13fba1, _0x675fbf, _0xbd20bd = "页面加载失败") {
    if (!_0x552bb0 || _0x552bb0.webContents?.isDestroyed?.()) {
      return false;
    }
    if (_0x39aa66().get(_0x13fba1) !== _0x552bb0) {
      return false;
    }
    const _0xd46f17 = String(_0x675fbf || _0x552bb0.webContents.getURL?.() || "");
    if (!/^https?:\/\//i.test(_0xd46f17)) {
      return false;
    }
    const _0x54de00 = _0x2c6e76.get(_0x13fba1) || {};
    if (_0x54de00.timer) {
      return true;
    }
    const _0x28da29 = _0x54de00.url === _0xd46f17;
    if (_0x28da29 && _0x54de00.exhausted) {
      return false;
    }
    const _0x10d49a = _0x28da29 ? Number(_0x54de00.attempt || 0) + 1 : 1;
    if (_0x10d49a > AUTOMATION_LOAD_RECOVERY_MAX_ATTEMPTS) {
      _0x2c6e76.set(_0x13fba1, {
        url: _0xd46f17,
        attempt: AUTOMATION_LOAD_RECOVERY_MAX_ATTEMPTS,
        exhausted: true
      });
      const _0x31cd32 = _0x44f283().get(_0x13fba1);
      const _0x24e0cc = _0x31cd32?.nickname || _0x31cd32?.name || _0x31cd32?.accountId || _0x13fba1;
      const _0x586c17 = _0x24e0cc + " 页面连续加载失败，请检查网络或代理后重试";
      console.error("[Main] [页面自愈] " + _0x13fba1 + " 已重试 " + AUTOMATION_LOAD_RECOVERY_MAX_ATTEMPTS + " 次仍失败: " + _0xbd20bd + " " + _0xd46f17);
      _0x121808("ERROR", "automation page load exhausted", {
        viewKey: _0x13fba1,
        attempt: AUTOMATION_LOAD_RECOVERY_MAX_ATTEMPTS,
        errorDescription: _0xbd20bd,
        targetUrl: _0xd46f17
      });
      const _0x4bad54 = _0x54c52a();
      try {
        _0x4bad54?.webContents?.send("new-status", "[WARN] " + _0x586c17);
      } catch (_0x305bb1) {}
      return false;
    }
    const _0x3097e5 = 5000 + Math.floor(Math.random() * 5001);
    const _0x109cec = setTimeout(() => {
      const _0x20a62e = _0x2c6e76.get(_0x13fba1);
      if (!_0x20a62e || _0x20a62e.timer !== _0x109cec) {
        return;
      }
      _0x20a62e.timer = null;
      if (_0x39aa66().get(_0x13fba1) !== _0x552bb0 || _0x552bb0.webContents.isDestroyed()) {
        _0x55827c(_0x13fba1);
        return;
      }
      console.warn("[Main] [页面自愈] " + _0x13fba1 + " 第 " + _0x10d49a + "/" + AUTOMATION_LOAD_RECOVERY_MAX_ATTEMPTS + " 次重载: " + _0xd46f17);
      _0x121808("WARN", "automation page load retry", {
        viewKey: _0x13fba1,
        attempt: _0x10d49a,
        errorDescription: _0xbd20bd,
        targetUrl: _0xd46f17
      });
      const _0x290e1d = _0x54c52a();
      try {
        _0x290e1d?.webContents?.send("new-status", "[WARN] 页面加载失败，正在自动重试 (" + _0x10d49a + "/" + AUTOMATION_LOAD_RECOVERY_MAX_ATTEMPTS + ")…");
      } catch (_0x13ea19) {}
      _0x552bb0.webContents.loadURL(_0xd46f17).catch(_0x495a75 => {
        _0x840d46(_0x552bb0, _0x13fba1, _0xd46f17, _0x495a75?.message || _0xbd20bd);
      });
    }, _0x3097e5);
    if (typeof _0x109cec.unref === "function") {
      _0x109cec.unref();
    }
    _0x2c6e76.set(_0x13fba1, {
      url: _0xd46f17,
      attempt: _0x10d49a,
      timer: _0x109cec
    });
    return true;
  }
  function _0x5f23b1(_0x28ef5f) {
    const _0x1f6cb5 = String(_0x28ef5f || "").split(/[\n,，\s]+/).map(_0x577aec => _0x577aec.trim()).filter(Boolean)[0];
    if (!_0x1f6cb5) {
      return "https://www.douyin.com";
    }
    const _0xd881af = _0x51b7f4(_0x1f6cb5);
    if (_0xd881af) {
      return "https://www.douyin.com/jingxuan?modal_id=" + _0xd881af;
    } else {
      return _0x1f6cb5;
    }
  }
  function _0x15bdd6(_0xd8b173, _0x204c89 = "douyin") {
    if (_0xd8b173 && !_0xd8b173.platform) {
      _0xd8b173.platform = _0x204c89;
    }
    _0x5a86ad();
    if (_0x3d4a02()) {
      _0xd8b173.enableComment = false;
      _0xd8b173.enableVideoComment = false;
      _0xd8b173.enableFollow = false;
      _0xd8b173.enableDM = false;
      _0xd8b173.enableWarmup = false;
      _0xd8b173.isFree = true;
      console.log("[Auth-Shield] [安全策略] 已在引擎加载前硬熔断高级特权: enableComment=false, enableVideoComment=false, enableFollow=false, enableDM=false (AccountId: " + (_0xd8b173.accountId || "default") + ")");
    }
    if (_0xd8b173.taskMode === "scrape") {
      _0xd8b173.enableLike = false;
      _0xd8b173.enableComment = false;
      _0xd8b173.enableFollow = false;
      _0xd8b173.enableDM = false;
      _0xd8b173.enableWarmup = false;
      console.log("[Scrape-Shield] [安全策略] 仅采集模式已自动熔断所有自动点赞/评论/关注/私信/预热配置");
    }
    const _0x3cc487 = _0xd8b173.accountId && _0xd8b173.accountId !== "default" ? _0x204c89 + "_" + _0xd8b173.accountId : _0x204c89;
    const _0xa5c13a = _0x39aa66();
    const _0x223b67 = _0xa5046b();
    const _0x8d1873 = _0x22e279();
    const _0x1301a2 = _0x44f283();
    let _0x16bfce = _0xa5c13a.get(_0x3cc487);
    const _0x3e4252 = _0xd8b173.keywords?.trim();
    const _0x5af1e5 = _0x3e4252?.split(/[,，\s\n]+/).map(_0x315b53 => _0x315b53.trim()).filter(Boolean) || [];
    const _0xc040f7 = _0x5af1e5[0];
    const _0x28a892 = Array.isArray(_0xd8b173.videoSources) && _0xd8b173.videoSources.length > 0 ? _0xd8b173.videoSources : ["search"];
    const _0x4a4ff3 = _0x28a892.filter(_0x28eacb => ["search", "follow", "recommend", "like", "specific"].includes(_0x28eacb) && (_0x28eacb !== "search" || _0xc040f7));
    const _0x24fc9a = _0x4a4ff3[0] || "search";
    let _0x330774 = _0xd8b173.url || (_0x204c89 === "xianyu" ? "https://www.goofish.com" : "https://www.douyin.com");
    if (_0x204c89 === "douyin") {
      if (_0x24fc9a === "follow") {
        _0x330774 = "https://www.douyin.com/follow";
      } else if (_0x24fc9a === "recommend") {
        _0x330774 = "https://www.douyin.com/?recommend=1&from_nav=1";
      } else if (_0x24fc9a === "like") {
        _0x330774 = "https://www.douyin.com/user/self?from_tab_name=main&showTab=like";
      } else if (_0x24fc9a === "specific") {
        _0x330774 = _0x5f23b1(_0xd8b173.specifiedUrls);
      } else if (_0xc040f7) {
        _0x330774 = "https://www.douyin.com/search/" + encodeURIComponent(_0xc040f7);
      }
    }
    if (_0xd8b173.name) {
      _0x1301a2.set(_0x3cc487 + "_name", _0xd8b173.name);
    }
    if (_0x204c89) {
      _0x1301a2.set(_0x3cc487 + "_platform", _0x204c89);
    }
    const _0x3bfd28 = _0x4a4ff3.join("|") + "::" + (_0x3e4252 || "");
    if (_0x16bfce) {
      _0x3450ff(_0x16bfce, _0x3cc487, {
        isInteraction: false
      });
      const _0x4f1e2b = _0x223b67.get(_0x3cc487);
      if (_0x4f1e2b) {
        _0x3450ff(_0x4f1e2b, _0x3cc487, {
          isInteraction: true
        });
      }
      const _0x31e15c = _0x3f41e8.get(_0x3cc487);
      const _0x45abdf = _0x31e15c !== _0x3bfd28;
      const _0x1fe1e4 = _0x1301a2.get(_0x3cc487);
      const _0x4486ff = !_0xd8b173?.taskId;
      console.log("[Main] 恢复已有视图: " + _0x3cc487 + ", 启动参数变化=" + _0x45abdf + " (" + _0x3bfd28 + ")");
      const _0x2792d9 = _0x54c52a();
      if (_0x2792d9 && !_0x2792d9.isDestroyed()) {
        const _0xf80bbc = _0x16bfce.getBounds();
        const _0x1a8096 = _0x8d1873.get(_0x3cc487);
        if (_0x1a8096) {
          const _0x17d76c = _0x223b67.get(_0x3cc487);
          const _0x8a6286 = _0x2def54(_0x1a8096.previewBounds) ? _0x1a8096.previewBounds : _0x1a8096.bounds;
          if (_0x17d76c && _0x8a6286 && _0x2def54(_0x8a6286)) {
            if (!_0x2792d9.getBrowserViews().includes(_0x17d76c)) {
              _0x2792d9.addBrowserView(_0x17d76c);
            }
            const _0x17ccf7 = Number(_0x1a8096.previewZoomFactor || _0x1a8096.zoomFactor || 0);
            if (_0x17ccf7 > 0) {
              try {
                _0x17d76c.webContents.setZoomFactor(_0x17ccf7);
              } catch (_0x507817) {}
            }
            _0x17d76c.setBounds(_0x8a6286);
            _0x1566de(_0x17d76c, {
              context: "initAutomationView:resumeInteraction:" + _0x3cc487
            });
          }
        } else if (!_0x2def54(_0xf80bbc)) {
          _0x3c2007(_0x3cc487);
        } else {
          _0x23b560(_0x3cc487);
          _0x21b775(_0x16bfce.webContents, _0x16bfce);
        }
      }
      if (_0xd8b173 && _0xd8b173.taskId) {
        if (_0xd8b173.taskMode === "nurture") {
          _0xd8b173.processedVideos = [];
        } else {
          _0xd8b173.processedVideos = _0x18f1da(_0xd8b173, _0x3cc487);
        }
        _0x2baadb(_0xd8b173);
        _0x1301a2.set(_0x3cc487, _0xd8b173);
        _0x1f0868(_0x3cc487, _0xd8b173);
        if (!_0x8d1873.has(_0x3cc487)) {
          _0x23b560(_0x3cc487);
        }
      }
      if (_0x45abdf) {
        const _0x4f41fb = !!_0x1fe1e4?.taskId && !!_0xd8b173?.taskId && _0x1fe1e4.taskId === _0xd8b173.taskId;
        if (_0x4f41fb) {
          console.log("[Main] 同任务运行中，跳过 launchChanged 页面重载: " + _0x3cc487 + " taskId=" + _0x1fe1e4.taskId);
          if (_0x31e15c) {
            _0x3f41e8.set(_0x3cc487, _0x31e15c);
          }
        } else {
          _0x34a652(_0xd8b173, _0x3cc487, _0x16bfce.webContents.session).then(() => {
            console.log("[Main] 启动参数变化，重载目标页: " + _0x3cc487 + " -> " + _0x330774);
            _0x3f41e8.set(_0x3cc487, _0x3bfd28);
            _0x16bfce.webContents.loadURL(_0x330774).catch(_0x4f2380 => {
              _0x840d46(_0x16bfce, _0x3cc487, _0x330774, _0x4f2380?.message || "loadURL failed");
            });
          });
        }
      } else if (_0xd8b173 && _0xd8b173.taskId) {
        _0x34a652(_0xd8b173, _0x3cc487, _0x16bfce.webContents.session);
        _0x283d3b(_0x16bfce, _0x3cc487, _0xd8b173);
      } else if (_0x4486ff) {
        _0x34a652(_0xd8b173, _0x3cc487, _0x16bfce.webContents.session).then(() => {
          console.log("[Main] 登录/预热视图重载: " + _0x3cc487 + " -> " + _0x330774);
          _0x16bfce.webContents.loadURL(_0x330774).catch(_0x22ab3e => {
            _0x840d46(_0x16bfce, _0x3cc487, _0x330774, _0x22ab3e?.message || "loadURL failed");
          });
        });
      } else {
        _0x34a652(_0xd8b173, _0x3cc487, _0x16bfce.webContents.session);
      }
      return;
    }
    if (_0x60d4f8(_0x204c89) >= _0x5b75e2) {
      console.warn("[Main] 已达每平台最大登录账号数 " + _0x5b75e2 + ": " + _0x204c89);
      const _0x4a3816 = _0x54c52a();
      if (_0x4a3816 && !_0x4a3816.isDestroyed()) {
        _0x4a3816.webContents.send("account-limit-rejected", {
          platform: _0x204c89,
          max: _0x5b75e2,
          reason: "每平台最多同时登录 " + _0x5b75e2 + " 个账号"
        });
      }
      return;
    }
    console.log("[Main] 初始化内置自动化视图 (" + _0x3cc487 + ")...");
    _0x3f41e8.set(_0x3cc487, _0x3bfd28);
    const _0x1e4bc1 = _0x2601c1();
    _0x16bfce = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false,
        preload: _0x1e4bc1,
        partition: "persist:automation:" + _0x3cc487,
        backgroundThrottling: false,
        spellcheck: false
      }
    });
    _0x16bfce.setBackgroundColor("#111827");
    _0xb4e8e1(_0x16bfce.webContents, _0x3cc487 + ":main");
    _0x3450ff(_0x16bfce, _0x3cc487, {
      isInteraction: false
    });
    _0x3c4876(_0x16bfce.webContents.session, _0x3cc487);
    if (_0x204c89 === "xianyu") {
      _0x33ad47(_0x16bfce.webContents.session);
    }
    _0xa5c13a.set(_0x3cc487, _0x16bfce);
    const _0x5b5189 = _0x54c52a();
    _0x5b5189.webContents.send("plugin-status", {
      connected: true
    });
    _0x16bfce.webContents.setUserAgent(_0x27c89f);
    const _0x177e42 = _0xc865df.get("system_video_muted", true);
    _0x16bfce.webContents.setAudioMuted(_0x177e42);
    console.log("[Main] 视图 " + _0x3cc487 + " 初始静音状态: " + _0x177e42);
    _0x16bfce.webContents.session.webRequest.onHeadersReceived({
      urls: ["*://*.douyin.com/*", "*://*.bytedance.net/*"]
    }, handleStripFrameBlockingHeaders);
    _0x16bfce.setBounds({
      x: 0,
      y: 0,
      width: 800,
      height: 600
    });
    if (_0xd8b173 && _0xd8b173.taskId) {
      if (_0xd8b173.taskMode === "nurture") {
        _0xd8b173.processedVideos = [];
      } else {
        _0xd8b173.processedVideos = _0x18f1da(_0xd8b173, _0x3cc487);
      }
      _0x2baadb(_0xd8b173);
      _0x1301a2.set(_0x3cc487, _0xd8b173);
      _0x1f0868(_0x3cc487, _0xd8b173);
    }
    _0x23b560(_0x3cc487);
    _0x16bfce.webContents.on("dom-ready", () => {
      _0x5e22a8.ensureAndPushToWebContents(_0x16bfce.webContents);
      const _0x108467 = _0x1301a2.get(_0x3cc487);
      const _0x4a3089 = _0x22c8c9().get(_0x3cc487);
      if (_0x108467 && _0x108467.taskId && !_0x4a3089) {
        console.log("[Main] 页面就绪 (" + _0x3cc487 + ")，发送任务指令...");
        _0x283d3b(_0x16bfce, _0x3cc487, _0x108467);
      }
      const _0x7a1e6c = _0x54c52a();
      if (_0x7a1e6c) {
        _0x7a1e6c.webContents.send("automation-url-changed", {
          platform: _0x204c89,
          url: _0x16bfce.webContents.getURL()
        });
      }
    });
    _0x16bfce.webContents.on("did-navigate", (_0x38e3d1, _0xb5315c) => {
      const _0x39064e = _0x54c52a();
      if (_0x39064e) {
        _0x39064e.webContents.send("automation-url-changed", {
          platform: _0x204c89,
          url: _0xb5315c
        });
      }
    });
    _0x16bfce.webContents.on("did-finish-load", () => {
      const _0x423d58 = _0x16bfce.webContents.getURL();
      if (/^https?:\/\//i.test(_0x423d58)) {
        _0x55827c(_0x3cc487);
      }
      _0x21b775(_0x16bfce.webContents, _0x16bfce);
      _0x279615();
    });
    _0x16bfce.webContents.on("did-fail-load", (_0x1a6c3e, _0x59af3f, _0x213e11, _0x9c80ce, _0x5a94d7) => {
      if (_0x9c80ce?.includes("bytedance.net") || _0x9c80ce?.includes("douyin.com")) {
        console.warn("[Network][" + _0x3cc487 + "] did-fail-load code=" + _0x59af3f + " main=" + _0x5a94d7 + " " + _0x213e11 + " " + _0x9c80ce);
      }
      if (_0x5a94d7 && _0x59af3f !== -3) {
        _0x840d46(_0x16bfce, _0x3cc487, _0x9c80ce, _0x213e11 || "ERR_" + _0x59af3f);
      }
    });
    _0x1ab808(_0x16bfce.webContents, _0x204c89, false);
    _0x34a652(_0xd8b173, _0x3cc487, _0x16bfce.webContents.session).then(() => {
      console.log("[Main] 正在加载目标网址: " + _0x330774);
      _0x16bfce.webContents.loadURL(_0x330774).catch(_0x4ca338 => {
        _0x840d46(_0x16bfce, _0x3cc487, _0x330774, _0x4ca338?.message || "loadURL failed");
      });
    });
  }
  return {
    cancelPendingAutomationViewDestroy: _0x14af3b,
    cancelInteractionViewIdleCleanup: _0x2ed997,
    scheduleDestroyAutomationView: _0x33575d,
    scheduleIdleFinishedViewDestroy: _0x281e54,
    enqueueAutomationBrowserViewClose: _0x29d89c,
    destroyAutomationBrowserView: _0x505bf4,
    finalizeStoppedAutomationTask: _0x564020,
    destroyAutomationView: _0x1be5b8,
    releaseAutomationInteraction: _0x5198e9,
    preserveAutomationViewAfterTaskFinish: _0x2a2221,
    recoverMainAutomationView: _0x3c2007,
    finishInteraction: _0x32eb48,
    scheduleInteractionViewIdleCleanup: _0x573379,
    destroyIdleInteractionView: _0x4608af,
    registerWebContentsLogger: _0x1ab808,
    attachAutomationViewStabilityGuards: _0x3450ff,
    bindAutomationViewProxy: _0x34a652,
    buildAutomationStartPayload: _0x38f527,
    sendAutomationStartTask: _0x283d3b,
    clearAutomationLoadRecovery: _0x55827c,
    scheduleAutomationLoadRecovery: _0x840d46,
    resolveDouyinSpecificEntryUrl: _0x5f23b1,
    initAutomationView: _0x15bdd6
  };
}
module.exports = {
  createAutomationViewLifecycle: createAutomationViewLifecycle
};
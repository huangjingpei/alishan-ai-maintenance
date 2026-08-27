'use strict';

const fs = require("fs");
const crypto = require("crypto");
const {
  ipcMain,
  BrowserView
} = require("electron");
const dbManager = require("./dbManager");
const {
  waitForInteractionViewVisualReady
} = require("./interactionViewVisualReady");
const BATCH_USER_GONE_REASON = "用户不存在（可能已注销）";
const BATCH_PROFILE_LOAD_MAX_RETRIES = 2;
const BATCH_PROFILE_OPEN_TIMEOUT_MS = 40000;
const SUBVIEW_HANDOFF_MIN_GAP_MS = 2800;
const COMPACT_BACKGROUND_AUTOMATION_WIDTH = 1200;
const COMPACT_BACKGROUND_AUTOMATION_HEIGHT = 800;
function createBatchFollow(_0x40add4) {
  const {
    getMainWindow: _0x42dad6,
    getPlatformViews: _0x3193d5,
    getInteractionViewsMap: _0x86f3df,
    getInteractionLocksMap: _0x3a36f,
    getViewSettingsMap: _0x57e918,
    getBatchActionQueueMap: _0x203fb0,
    getPendingBatchByViewKey: _0x2e6906,
    getIsBatchActionRunningMap: _0x429dfe,
    getViewActiveBatchRunMap: _0x199df4,
    getLastInteractionFinishedAtByViewKey: _0xf98cb,
    getBackgroundDetachedViewKeys: _0x1f8fcb,
    getBackgroundLayoutHoldViewKeys: _0x1e01e0,
    getIsCurrentUserFree: _0x5b84f2,
    isAutomationViewKey: _0x44fc67,
    isBatchViewRuntimeActive: _0x533b89,
    pushAutomationTrace: _0x47064a,
    suspendOccludedAutomationRendering: _0x156745,
    historyManager: _0x4e7042,
    ensureRuntimeConfigReadyForTask: _0x137c25,
    runtimeConfigBlockReason: _0x2e4783,
    resolveAutomationPreloadPath: _0x5bc01b,
    attachProtocolGuard: _0x261f1e,
    configureAutomationSession: _0xb14d6f,
    configureXianyuSession: _0x5112a1,
    store: _0x4df458,
    runtimeConfig: _0x1a8625,
    automationUserAgent: _0x503d8b,
    historyFile: _0x173215,
    cryptoKey: _0x379978,
    cryptoIv: _0x2c1ede,
    isLeadsSqliteRuntime: _0x372db0,
    inferInteractionViewKey: _0x23a5ae,
    shouldAttachAutomationView: _0x1485dd,
    shouldKeepAutomationViewAttached: _0x45ecd1,
    parkAutomationViewInMainWindow: _0x1b54ab,
    enterBackgroundDetachedMode: _0x232da4,
    safeSetTopBrowserView: _0x38c93c,
    nudgeAutomationViewRepaint: _0x36d65f,
    restoreForegroundAutomationRendering: _0x418bc3,
    isValidAutomationBounds: _0x12775e,
    isBackgroundAutomationHidden: _0x3cfd4d,
    cacheAutomationPreviewBounds: _0x3c0e9b,
    resolveInteractionViewportBounds: _0x13b874,
    shouldShowInteractionView: _0x583df5,
    restoreVisibleInteractionStack: _0x4afa5c,
    attachAutomationViewToBackgroundHost: _0x43f1d4,
    focusAutomationWebContentsSafely: _0x4d6a45,
    canParkAutomationViewInMainWindow: _0x5eff65,
    attachLivePreviewSpectatorIfPossible: _0x573aab,
    ensureMainViewVisibleForBatch: _0x4a8277,
    getBackgroundAutomationHostViews: _0x2e39f0,
    cancelPendingAutomationViewDestroy: _0x105f1f,
    cancelInteractionViewIdleCleanup: _0x5531e6,
    scheduleInteractionViewIdleCleanup: _0x5027f7,
    finishInteraction: _0x4732a0,
    preserveAutomationViewAfterTaskFinish: _0x49cbc9,
    recoverMainAutomationView: _0x3c3c85,
    initAutomationView: _0x5d13ef,
    cancelAutomationAiRetry = () => {},
    attachAutomationViewStabilityGuards: _0x1bdc80,
    registerWebContentsLogger: _0x73b805,
    releaseBatchRuntimeGuardIfIdle: _0xdc2c01,
    acquireBatchRuntimeGuard: _0x14a3de,
    syncAutomationRuntimeGuard: _0x5d5b96
  } = _0x40add4;
  let _0x3c18e0 = 0;
  let _0x411698 = false;
  let _0x24247a = 0;
  let _0x828cc1 = {
    total: 0,
    current: 0,
    success: 0,
    failed: 0,
    skipped: 0
  };
  const _0x4ae52a = new Map();
  const _0x1e68e3 = new Map();
  const _0x32ff84 = new Map();
  const _0x1b5a42 = new Map();
  function _0x41634a(_0xf6cd10 = null) {
    if (_0xf6cd10?.canCommentFirstWork) {
      return 360000;
    }
    if (_0xf6cd10?.canDM) {
      return 240000;
    }
    return 180000;
  }
  function _0x555d5b(_0x318bd0, _0x2ad8a9 = "", _0x1beb78 = {}) {
    const _0x24e511 = _0x3a36f();
    const _0x4149ee = _0x24e511.get(_0x318bd0);
    if (!_0x4149ee || typeof _0x4149ee.onTimeout !== "function") {
      return false;
    }
    if (_0x2ad8a9 && _0x4149ee.interactionId && _0x2ad8a9 !== _0x4149ee.interactionId) {
      return false;
    }
    const _0x18a2b6 = Number(_0x1beb78.extendMs);
    const _0x38e0a4 = Number.isFinite(_0x18a2b6) && _0x18a2b6 > 0 ? _0x18a2b6 : Number(_0x4149ee.timeoutMs) || 360000;
    if (_0x4149ee.timer) {
      clearTimeout(_0x4149ee.timer);
    }
    _0x4149ee.timer = setTimeout(_0x4149ee.onTimeout, _0x38e0a4);
    _0x4149ee.lastActivityAt = Date.now();
    _0x4149ee.timeoutMs = Number(_0x4149ee.timeoutMs) || _0x38e0a4;
    return true;
  }
  function _0x353391(_0x2fab38, _0x12921c = "preempt", _0x460b8d = {}) {
    cancelAutomationAiRetry();
    const _0x3de6f5 = _0x86f3df().get(_0x2fab38);
    if (!_0x3de6f5?.webContents || _0x3de6f5.webContents.isDestroyed()) {
      return;
    }
    try {
      _0x3de6f5.webContents.send("interaction-preempt", {
        viewKey: _0x2fab38,
        reason: _0x12921c,
        ..._0x460b8d
      });
    } catch (_0x259f40) {
      console.warn("[Batch] [" + _0x2fab38 + "] 发送 interaction-preempt 失败: " + (_0x259f40?.message || _0x259f40));
    }
  }
  function _0x542199(_0x412e61 = null, _0x5574b2 = null) {
    if (_0x5574b2 != null && Number.isFinite(Number(_0x5574b2))) {
      return Number(_0x5574b2);
    }
    if (_0x412e61) {
      const _0x5c1b62 = _0x2e6906().get(_0x412e61);
      if (_0x5c1b62?.runId != null) {
        return _0x5c1b62.runId;
      }
      const _0xd32581 = _0x199df4().get(_0x412e61);
      if (_0xd32581 != null) {
        return _0xd32581;
      }
    }
    return null;
  }
  function _0x54648b(_0xd08321, _0x4150ff = {}) {
    if (_0xd08321 == null) {
      return null;
    }
    try {
      const _0x916b1b = _0x4e7042.appendBatchRunLog(_0xd08321, _0x4150ff);
      const _0x58ec78 = _0x42dad6();
      if (_0x916b1b && _0x58ec78 && !_0x58ec78.isDestroyed()) {
        _0x58ec78.webContents.send("batch-run-log", {
          runId: _0xd08321,
          log: _0x916b1b
        });
      }
      return _0x916b1b;
    } catch (_0x38ad6e) {
      console.warn("[Batch] 写入批量跟进日志失败:", _0x38ad6e?.message || _0x38ad6e);
      return null;
    }
  }
  function _0x562fd7(_0x20b317, _0x2b636c) {
    const _0x3d98f8 = _0x20b317 + "_" + _0x2b636c;
    const _0xe40ce6 = _0x4ae52a.get(_0x3d98f8);
    if (_0xe40ce6) {
      clearInterval(_0xe40ce6);
      _0x4ae52a.delete(_0x3d98f8);
    }
  }
  function _0x3020a8(_0x264594, _0x23d1f2, _0x1bd86c, _0x3ed8f7) {
    const _0x32c5ea = _0x264594 + "_" + _0x23d1f2;
    let _0x2cd68c = _0x1e68e3.get(_0x32c5ea);
    if (!_0x2cd68c) {
      _0x2cd68c = new Set();
      _0x1e68e3.set(_0x32c5ea, _0x2cd68c);
    }
    const _0x142cb2 = setTimeout(() => {
      const _0x4512f3 = _0x1e68e3.get(_0x32c5ea);
      _0x4512f3?.delete(_0x142cb2);
      if (_0x4512f3?.size === 0) {
        _0x1e68e3.delete(_0x32c5ea);
      }
      _0x1bd86c();
    }, Math.max(0, _0x3ed8f7));
    _0x2cd68c.add(_0x142cb2);
    return _0x142cb2;
  }
  function _0x560ee3(_0x4f791c, _0x1fb1de) {
    const _0x509f86 = _0x4f791c + "_" + _0x1fb1de;
    const _0x3209b2 = _0x1e68e3.get(_0x509f86);
    if (!_0x3209b2) {
      return;
    }
    for (const _0x2af6f2 of _0x3209b2) {
      clearTimeout(_0x2af6f2);
    }
    _0x1e68e3.delete(_0x509f86);
  }
  function _0x3b4415() {
    for (const _0x1343db of _0x4ae52a.values()) {
      clearInterval(_0x1343db);
    }
    _0x4ae52a.clear();
    for (const _0x36d3c7 of _0x1e68e3.values()) {
      for (const _0x44f55e of _0x36d3c7) {
        clearTimeout(_0x44f55e);
      }
    }
    _0x1e68e3.clear();
  }
  function _0x4676e6(_0xb21c96) {
    for (const [_0x3c5b35, _0x4b994a] of [..._0x4ae52a.entries()]) {
      if (_0x3c5b35.startsWith(_0xb21c96 + "_")) {
        clearInterval(_0x4b994a);
        _0x4ae52a.delete(_0x3c5b35);
      }
    }
    for (const [_0x391b5a, _0x4182a7] of [..._0x1e68e3.entries()]) {
      if (!_0x391b5a.startsWith(_0xb21c96 + "_")) {
        continue;
      }
      for (const _0x145104 of _0x4182a7) {
        clearTimeout(_0x145104);
      }
      _0x1e68e3.delete(_0x391b5a);
    }
  }
  function _0x1bed5a(_0x405bfe, _0x24348a) {
    _0x3193d5().forEach((_0x502633, _0x1c072a) => {
      if (!_0x502633 || _0x502633.webContents.isDestroyed()) {
        return;
      }
      try {
        _0x502633.webContents.send("control-task", {
          type: "CANCEL_WANDERING",
          payload: {
            reason: _0x405bfe,
            batchRunId: _0x24348a,
            viewKey: _0x1c072a
          }
        });
      } catch (_0x4ecefe) {
        console.warn("[Batch] [" + _0x1c072a + "] 取消拟人闲逛失败: " + _0x4ecefe.message);
      }
    });
  }
  function _0xe75fe9(_0x180782, _0x529c7e) {
    const _0x2a3055 = _0x203fb0();
    const _0x316d6b = _0x2e6906();
    const _0x8c2464 = _0x199df4();
    const _0x14a2d4 = _0x86f3df();
    const _0x2ce2f1 = _0x3a36f();
    const _0x5e9fe8 = new Set([..._0x2a3055.keys(), ..._0x316d6b.keys(), ..._0x8c2464.keys()]);
    for (const _0x4bf85c of _0x5e9fe8) {
      const _0x2aa273 = _0x316d6b.get(_0x4bf85c);
      if (_0x2aa273 && _0x529c7e != null && _0x2aa273.runId !== _0x529c7e) {
        continue;
      }
      const _0x34be44 = _0x14a2d4.get(_0x4bf85c);
      try {
        if (_0x34be44 && !_0x34be44.webContents.isDestroyed()) {
          _0x34be44.webContents.send("interaction-preempt", {
            viewKey: _0x4bf85c,
            reason: _0x180782,
            cancelledBatchRunId: _0x529c7e
          });
          _0x34be44.webContents.stop();
        }
      } catch (_0x3e6682) {
        console.warn("[Batch] [" + _0x4bf85c + "] 取消旧互动任务失败: " + _0x3e6682.message);
      }
      _0x316d6b.delete(_0x4bf85c);
      if (_0x2ce2f1.has(_0x4bf85c)) {
        _0x4732a0(_0x4bf85c, {
          error: "batch-cancelled"
        }, _0x180782);
      }
    }
  }
  function _0x5e3278({
    viewKeyFound: _0x4d75f5,
    accountId: _0x179624,
    finishedLeadName: _0x32af09,
    nextLeadName: _0x5072b0,
    delayMs: _0x5d7c4a,
    delayMin: _0x40ac85,
    delayMax: _0x12be47,
    sender: _0xf4670e,
    scheduledRunId: _0x3736e6
  }) {
    const _0x25143c = Math.round(_0x5d7c4a / 1000);
    const _0x2606a0 = _0x5d7c4a > 3000 ? Math.round((_0x5d7c4a - 3000) / 1000) : 0;
    const _0x46149d = Math.max(0, _0x25143c - _0x2606a0);
    const _0x2d90d5 = _0x40ac85 + "-" + _0x12be47;
    let _0x510990;
    if (_0x2606a0 > 0) {
      _0x510990 = "⏳ 批量间隙：@" + (_0x32af09 || "上一条") + " 已完成，" + _0x25143c + "s 后处理下一条（" + _0x2606a0 + "s 推荐页刷视频 + " + _0x46149d + "s 提前准备，间隔设置 " + _0x2d90d5 + "s）";
    } else {
      _0x510990 = "⏳ 批量间隙：@" + (_0x32af09 || "上一条") + " 已完成，等待 " + _0x25143c + "s 后处理下一条（间隔设置 " + _0x2d90d5 + "s）";
    }
    _0x47064a(_0x510990, _0x179624, {
      runId: _0x3736e6,
      viewKey: _0x4d75f5,
      phase: "delay",
      level: "info"
    });
    if (_0x5072b0) {
      _0x47064a("📋 下一条：@" + _0x5072b0, _0x179624, {
        runId: _0x3736e6,
        viewKey: _0x4d75f5,
        phase: "delay",
        leadName: _0x5072b0
      });
    }
    _0x562fd7(_0x4d75f5, _0x3736e6);
    _0x560ee3(_0x4d75f5, _0x3736e6);
    const _0x2f4347 = Date.now();
    const _0x9a9546 = _0x4d75f5 + "_" + _0x3736e6;
    const _0x555774 = setInterval(() => {
      if (_0x411698 || _0x3c18e0 !== _0x3736e6) {
        _0x562fd7(_0x4d75f5, _0x3736e6);
        return;
      }
      const _0x5b25a6 = Math.floor((Date.now() - _0x2f4347) / 1000);
      const _0x4bb026 = _0x25143c - _0x5b25a6;
      if (_0x4bb026 <= 0) {
        _0x562fd7(_0x4d75f5, _0x3736e6);
        return;
      }
      _0x47064a("⏳ 批量间隙：剩余约 " + _0x4bb026 + "s…", _0x179624, {
        runId: _0x3736e6,
        viewKey: _0x4d75f5,
        phase: "delay",
        persist: false
      });
    }, 10000);
    _0x4ae52a.set(_0x9a9546, _0x555774);
    const _0x562697 = _0x3193d5().get(_0x4d75f5);
    if (_0x5d7c4a > 3000 && _0x562697 && !_0x562697.webContents.isDestroyed()) {
      const _0x136bca = _0x5d7c4a - 3000;
      console.log("[Batch] 等待 " + _0x25143c + "s 后处理下一个任务，期间执行 " + Math.round(_0x136bca / 1000) + "s 推荐页刷视频...");
      _0x562697.webContents.loadURL("https://www.douyin.com/?recommend=1");
      _0x3020a8(_0x4d75f5, _0x3736e6, () => {
        if (!_0x411698 && _0x3c18e0 === _0x3736e6 && !_0x562697.webContents.isDestroyed()) {
          _0x562697.webContents.send("control-task", {
            type: "PERFORM_WANDERING",
            payload: {
              duration: _0x136bca,
              traceAccountId: _0x179624,
              batchRunId: _0x3736e6
            }
          });
        }
      }, 1500);
    } else {
      console.log("[Batch] 等待 " + _0x25143c + "s 后处理下一个任务...");
    }
    const _0x5e885b = _0x203fb0().get(_0x4d75f5);
    const _0x595196 = _0x5e885b ? _0x5e885b[0] : null;
    if (_0x5d7c4a > 3000 && _0x595196 && _0x595196.lead?.userUrl) {
      _0x3020a8(_0x4d75f5, _0x3736e6, () => {
        if (!_0x411698 && _0x3c18e0 === _0x3736e6 && _0x562697 && !_0x562697.webContents.isDestroyed()) {
          const _0x47e53d = _0x4776e5(_0x595196.lead.userUrl);
          _0x47064a("🚀 提前 3 秒导航至下一目标主页进行加载: @" + (_0x595196.lead.nickname || "未知"), _0x179624, {
            runId: _0x3736e6,
            viewKey: _0x4d75f5,
            phase: "delay",
            leadName: _0x595196.lead.nickname || ""
          });
          console.log("[Batch] [" + _0x4d75f5 + "] 提前 3 秒载入下一目标主页: " + _0x47e53d);
          _0x562697.webContents.loadURL(_0x47e53d);
        }
      }, _0x5d7c4a - 3000);
    }
    _0x3020a8(_0x4d75f5, _0x3736e6, () => {
      _0x562fd7(_0x4d75f5, _0x3736e6);
      if (!_0x411698 && _0x3c18e0 === _0x3736e6) {
        _0x47064a("▶️ 批量间隙结束，开始处理下一条", _0x179624, {
          runId: _0x3736e6,
          viewKey: _0x4d75f5,
          phase: "delay",
          level: "info"
        });
        _0x18d9a3(_0x4d75f5, _0x3736e6, "normal-gap-delay");
      }
    }, _0x5d7c4a);
  }
  function _0x42afd2(_0x2aaf68, _0x18d876) {
    const _0x1dab52 = (_0x2aaf68?.template || "你好 {nickname}").split("\n").filter(_0x44b4f3 => _0x44b4f3.trim());
    if (_0x1dab52.length === 0) {
      return "你好".replace(/{nickname}/g, _0x18d876?.nickname || "朋友");
    }
    const _0x13906a = _0x1dab52[_0x24247a % _0x1dab52.length];
    _0x24247a += 1;
    return _0x13906a.replace(/{nickname}/g, _0x18d876?.nickname || "朋友");
  }
  function _0x4776e5(_0x20a2af) {
    if (!_0x20a2af || typeof _0x20a2af !== "string") {
      return _0x20a2af;
    }
    try {
      const _0x234ae1 = new URL(_0x20a2af.startsWith("http") ? _0x20a2af : "https://www.douyin.com" + (_0x20a2af.startsWith("/") ? _0x20a2af : "/" + _0x20a2af));
      _0x234ae1.searchParams.set("from_tab_name", "main");
      return _0x234ae1.toString();
    } catch (_0x4e888b) {
      if (_0x20a2af.includes("from_tab_name=")) {
        return _0x20a2af;
      }
      if (_0x20a2af.includes("?")) {
        return _0x20a2af + "&from_tab_name=main";
      } else {
        return _0x20a2af + "?from_tab_name=main";
      }
    }
  }
  function _0x38897d(_0x4bffbe, _0x19a706, _0xf5f524) {
    const _0x36710f = _0x19a706?.type || "follow_dm";
    const _0x3e8d7e = _0x19a706?.profileCommentUseAi && _0x19a706?.personaByAccount?.[_0x4bffbe?.accountId];
    const _0x269057 = (_0x19a706.commentTemplate || "").trim();
    const _0x3cebda = _0x19a706.commentMentionPosition === "after" ? "after" : "before";
    const _0x494a2d = !!_0x19a706.enableCommentMention;
    const _0x5a4dcd = _0x19a706.commentMentionNicknames || "";
    const _0x3e1cfe = Number.isFinite(Number(_0x19a706.commentMentionPercent)) ? Math.max(0, Math.min(100, Math.round(Number(_0x19a706.commentMentionPercent)))) : 100;
    if (_0x494a2d) {
      console.log("[Batch] 构建首作任务 @概率=" + _0x3e1cfe + "% nicks=" + String(_0x5a4dcd || "").slice(0, 40));
    }
    const _0x2951b8 = !!_0x19a706.commentUseRandomSuffix;
    const _0x2aa898 = !!_0x19a706.enableCommentWithoutText;
    const _0x42c135 = !!_0x19a706.enableCommentImage;
    const _0x560316 = !!_0x19a706.enableCommentExpression;
    const _0x5db4dc = Array.isArray(_0x19a706.commentImagePaths) ? _0x19a706.commentImagePaths.filter(_0x109dc9 => typeof _0x109dc9 === "string" && _0x109dc9.trim()) : String(_0x19a706.commentImagePath || "").trim() ? [String(_0x19a706.commentImagePath).trim()] : [];
    const _0x3d5bfb = Math.max(1, Math.min(8, Number(_0x19a706.commentExpressionCount) || 3));
    const _0x210731 = Number.isFinite(Number(_0x19a706.commentAttachmentPercent)) ? Math.max(0, Math.min(100, Number(_0x19a706.commentAttachmentPercent))) : 20;
    const _0x176e7e = {
      viewKey: _0xf5f524,
      lead: _0x4bffbe,
      isBatchAction: true,
      batchConfig: {
        type: _0x19a706.type,
        template: _0x19a706.template,
        commentTemplate: _0x19a706.commentTemplate,
        profileCommentUseAi: _0x19a706.profileCommentUseAi,
        useRandomSuffix: _0x19a706.useRandomSuffix,
        dmUseRandomSuffix: !!_0x19a706.useRandomSuffix,
        commentUseRandomSuffix: _0x2951b8,
        enableCommentWithoutText: _0x2aa898,
        enableCommentMention: _0x494a2d,
        commentMentionNicknames: _0x5a4dcd,
        commentMentionPosition: _0x3cebda,
        commentMentionPercent: _0x3e1cfe,
        enableCommentImage: _0x42c135,
        commentImagePaths: _0x5db4dc,
        enableCommentExpression: _0x560316,
        commentExpressionCount: _0x3d5bfb,
        commentAttachmentPercent: _0x210731,
        followDmDelayMin: _0x19a706.followDmDelayMin,
        followDmDelayMax: _0x19a706.followDmDelayMax,
        dmTarget: _0x19a706.dmTarget,
        genderFilter: _0x19a706.genderFilter,
        ageFilterEnabled: _0x19a706.ageFilterEnabled === true,
        ageMin: _0x19a706.ageMin,
        ageMax: _0x19a706.ageMax,
        personaByAccount: _0x19a706.personaByAccount,
        profileFirstWorkLikePercent: (() => {
          const _0x3bedfb = Number(_0x19a706.profileFirstWorkLikePercent);
          if (Number.isFinite(_0x3bedfb)) {
            return Math.max(0, Math.min(100, Math.round(_0x3bedfb)));
          } else {
            return 10;
          }
        })(),
        profileFirstWorkCollectPercent: (() => {
          const _0x59b81d = Number(_0x19a706.profileFirstWorkCollectPercent);
          if (Number.isFinite(_0x59b81d)) {
            return Math.max(0, Math.min(100, Math.round(_0x59b81d)));
          } else {
            return 10;
          }
        })()
      },
      canFollow: _0x36710f.includes("follow"),
      canDM: _0x36710f === "follow_dm" || _0x36710f === "message",
      canCommentFirstWork: _0x36710f === "profile_first_comment",
      commentOnProfileFirstWork: _0x36710f === "profile_first_comment",
      profileFirstWorkLikePercent: (() => {
        const _0x549a97 = Number(_0x19a706.profileFirstWorkLikePercent);
        if (Number.isFinite(_0x549a97)) {
          return Math.max(0, Math.min(100, Math.round(_0x549a97)));
        } else {
          return 10;
        }
      })(),
      profileFirstWorkCollectPercent: (() => {
        const _0x232717 = Number(_0x19a706.profileFirstWorkCollectPercent);
        if (Number.isFinite(_0x232717)) {
          return Math.max(0, Math.min(100, Math.round(_0x232717)));
        } else {
          return 10;
        }
      })(),
      enableWarmup: false,
      enableRandomLike: false,
      followDmDelayMin: _0x19a706.followDmDelayMin,
      followDmDelayMax: _0x19a706.followDmDelayMax,
      useRandomSuffix: !!_0x19a706.useRandomSuffix,
      dmUseRandomSuffix: !!_0x19a706.useRandomSuffix,
      genderFilter: _0x19a706.genderFilter || "all",
      ageFilterEnabled: _0x19a706.ageFilterEnabled === true,
      ageMin: _0x19a706.ageMin,
      ageMax: _0x19a706.ageMax,
      dmContent: _0x36710f.includes("message") || _0x36710f === "follow_dm" ? _0x42afd2(_0x19a706, _0x4bffbe) : "",
      dmTarget: _0x19a706.dmTarget === "followed_only" ? "followed_only" : "all",
      commentTemplate: _0x269057,
      commentContent: _0x269057,
      videoCommentContent: _0x269057,
      batchProfileCommentUseAi: !!_0x19a706.profileCommentUseAi,
      enableCommentMention: _0x494a2d,
      commentMentionNicknames: _0x5a4dcd,
      commentMentionPosition: _0x3cebda,
      commentMentionPercent: _0x3e1cfe,
      commentUseRandomSuffix: _0x2951b8,
      enableCommentWithoutText: _0x2aa898,
      enableCommentImage: _0x42c135,
      commentImagePaths: _0x5db4dc,
      commentImagePath: _0x5db4dc[0] || "",
      enableCommentExpression: _0x560316,
      commentExpressionCount: _0x3d5bfb,
      commentAttachmentPercent: _0x210731
    };
    if (_0x3e8d7e) {
      Object.assign(_0x176e7e, {
        aiReplyMode: true,
        profileFirstCommentUseAi: true,
        aiRole: _0x3e8d7e.aiRole,
        aiGoal: _0x3e8d7e.aiGoal,
        aiStyle: _0x3e8d7e.aiStyle,
        aiPrompt: _0x3e8d7e.aiPrompt,
        firstPostGoal: _0x3e8d7e.firstPostGoal || "",
        firstPostStyle: _0x3e8d7e.firstPostStyle || "",
        firstPostPrompt: _0x3e8d7e.firstPostPrompt || "",
        videoGoal: _0x3e8d7e.videoGoal || "",
        videoStyle: _0x3e8d7e.videoStyle || "",
        videoPrompt: _0x3e8d7e.videoPrompt || ""
      });
    }
    return _0x176e7e;
  }
  function _0x58ac61(_0x29871d, _0x48c2f8 = {}) {
    if (_0x48c2f8.profileFirstTargetFiltered || _0x48c2f8.targetRejected || _0x48c2f8.demographicFilterFailed) {
      return true;
    }
    const _0x12ec39 = String(_0x29871d || "");
    if (!_0x12ec39) {
      return false;
    }
    return _0x12ec39.includes("性别不符") || _0x12ec39.startsWith("年龄不符") || _0x12ec39.includes("低于最小年龄") || _0x12ec39.includes("超过最大年龄");
  }
  function _0x239abe(_0x120ca8, _0x1225f4 = {}) {
    if (_0x1225f4.noWorks) {
      return true;
    }
    const _0x38858b = String(_0x120ca8 || "");
    return _0x38858b.includes("作品数为0") || _0x38858b.includes("无公开作品");
  }
  function _0x500f66(_0x198d9a, _0x17b52c = {}) {
    if (_0x17b52c.isPrivate && (_0x17b52c.skipped || String(_0x198d9a || "").includes("私密账号"))) {
      return true;
    }
    const _0x27f885 = String(_0x198d9a || "");
    return _0x27f885.includes("私密账号");
  }
  function _0x467f95(_0x230734, _0x59dc48 = {}) {
    if (_0x59dc48?.userGone || _0x59dc48?.errorCode === "USER_NOT_FOUND") {
      return true;
    }
    if (_0x59dc48?.profileUnavailable && /用户不存在|已注销|无此用户|账号已被封禁/.test(String(_0x59dc48.profileUnavailableReason || ""))) {
      return true;
    }
    const _0xd50cb4 = String(_0x230734 || "");
    return /USER_NOT_FOUND/i.test(_0xd50cb4) || _0xd50cb4.includes("用户不存在") || _0xd50cb4.includes("无此用户") || _0xd50cb4.includes("账号已被封禁") || _0xd50cb4.includes(BATCH_USER_GONE_REASON);
  }
  function _0x1a7ce9(_0x1dbcf4 = {}) {
    if (!_0x1dbcf4 || typeof _0x1dbcf4 !== "object") {
      return false;
    }
    if (_0x1dbcf4.userGone) {
      return true;
    }
    if (_0x1dbcf4.profileUnavailable && /用户不存在|已注销|无此用户|账号已被封禁/.test(String(_0x1dbcf4.profileUnavailableReason || ""))) {
      return true;
    }
    return /用户不存在|已注销|USER_NOT_FOUND/i.test(String(_0x1dbcf4.lastBatchSkipReason || _0x1dbcf4.lastError || ""));
  }
  function _0x1fe2fa(_0x4f9192, _0x204530 = {}) {
    return _0x239abe(_0x4f9192, _0x204530) || _0x58ac61(_0x4f9192, _0x204530) || _0x500f66(_0x4f9192, _0x204530);
  }
  function _0x2b5b03(_0x5dfb28, _0x2094b7, _0x39f139) {
    const _0x1afd3d = _0x2094b7 || {};
    const _0x542d37 = _0x1afd3d.skipReason || _0x1afd3d.error || _0x1afd3d.profileUnavailableReason || "";
    const _0x44d96e = _0x467f95(_0x542d37, _0x1afd3d);
    const _0x51a186 = BATCH_USER_GONE_REASON;
    if (_0x5dfb28 === "profile_first_comment") {
      const _0x1892a3 = _0x1afd3d.skipReason || _0x1afd3d.error || "";
      const _0x545da5 = _0x239abe(_0x1892a3, _0x1afd3d);
      const _0x41e600 = _0x58ac61(_0x1892a3, _0x1afd3d);
      const _0x11ba20 = _0x500f66(_0x1892a3, _0x1afd3d);
      const _0x16b59b = _0x545da5 || _0x41e600 || _0x11ba20;
      const _0x502493 = !_0x16b59b && (_0x44d96e || !!_0x1afd3d.skipped || !!_0x1afd3d.skipReason);
      const _0x41d5eb = _0x16b59b ? false : _0x502493 ? false : !!_0x1afd3d.success;
      const _0x8bd22c = _0x11ba20 ? _0x1892a3 || "对方账号设置了隐私，未执行关注/私信/首作评论" : _0x41e600 ? _0x1892a3 || "筛选不符" : _0x545da5 ? _0x1afd3d.error || _0x1892a3 || "作品数为0" : _0x41d5eb && !_0x502493 ? "" : _0x44d96e ? _0x51a186 : _0x1afd3d.error || _0x1afd3d.skipReason || "";
      return {
        leadId: _0x39f139.leadId,
        accountId: _0x39f139.accountId,
        leadName: _0x39f139.nickname,
        leadPlatform: _0x39f139.platform,
        accountName: _0x39f139.accountName,
        ..._0x1831a2(_0x39f139),
        success: _0x41d5eb,
        skipped: _0x502493,
        skipReason: _0x16b59b ? "" : _0x44d96e ? _0x51a186 : _0x1afd3d.skipReason || "",
        error: _0x8bd22c,
        type: _0x5dfb28,
        interactionResults: {
          skipped: _0x502493,
          skipReason: _0x16b59b ? "" : _0x44d96e ? _0x51a186 : _0x1afd3d.skipReason || "",
          noWorks: _0x545da5,
          isPrivate: _0x1afd3d.isPrivate !== undefined ? !!_0x1afd3d.isPrivate : _0x11ba20 || undefined,
          userGone: _0x44d96e || undefined,
          profileUnavailable: _0x44d96e ? true : _0x1afd3d.profileUnavailable || undefined,
          profileUnavailableReason: _0x44d96e ? _0x51a186 : _0x1afd3d.profileUnavailableReason || undefined,
          profileFirstTargetFiltered: !!_0x1afd3d.profileFirstTargetFiltered || _0x41e600,
          demographicFilterFailed: !!_0x1afd3d.demographicFilterFailed || _0x41e600,
          profileCommented: !!_0x1afd3d.success && !_0x16b59b && !_0x502493,
          replyContent: _0x1afd3d.content || "",
          worksCount: _0x1afd3d.worksCount,
          gender: _0x1afd3d.gender,
          age: _0x1afd3d.age,
          location: _0x1afd3d.location,
          douyinId: _0x1afd3d.douyinId,
          signature: _0x1afd3d.signature,
          profileCommentAt: _0x1afd3d.profileCommentAt || _0x39f139.profileCommentAt,
          lastTouchAt: _0x1afd3d.lastTouchAt || _0x39f139.lastTouchAt,
          touchCounts: _0x1afd3d.touchCounts || _0x39f139.touchCounts,
          touchLog: _0x1afd3d.touchLog || _0x39f139.touchLog
        }
      };
    }
    const _0x11e291 = !!_0x1afd3d.followed;
    const _0x1fdbde = !!_0x1afd3d.messaged;
    const _0x23484b = _0x1afd3d.skipReason || _0x1afd3d.error || "";
    const _0x2fc5c4 = _0x58ac61(_0x23484b, _0x1afd3d);
    const _0x531cc4 = _0x500f66(_0x23484b, _0x1afd3d);
    const _0x40e552 = _0x2fc5c4 || _0x531cc4;
    const _0x1964c5 = !_0x40e552 && (_0x44d96e || !!_0x1afd3d.skipped);
    const _0x1ad268 = _0x40e552 ? false : _0x1964c5 ? false : _0x11e291 || _0x1fdbde;
    const _0x364d10 = _0x1afd3d.worksCount !== undefined && _0x1afd3d.worksCount !== null ? _0x1afd3d.worksCount : _0x39f139.worksCount !== undefined ? _0x39f139.worksCount : undefined;
    const _0x1b6bbb = _0x1afd3d.isPrivate !== undefined ? !!_0x1afd3d.isPrivate : _0x39f139.isPrivate !== undefined ? !!_0x39f139.isPrivate : undefined;
    return {
      leadId: _0x39f139.leadId,
      accountId: _0x39f139.accountId,
      leadName: _0x39f139.nickname,
      leadPlatform: _0x39f139.platform,
      accountName: _0x39f139.accountName,
      ..._0x1831a2(_0x39f139),
      success: _0x1ad268,
      skipped: _0x1964c5,
      skipReason: _0x40e552 ? "" : _0x44d96e ? _0x51a186 : _0x1afd3d.skipReason || "",
      error: _0x531cc4 ? _0x23484b || "对方账号设置了隐私，未执行关注/私信" : _0x2fc5c4 ? _0x23484b || "筛选不符" : _0x1964c5 ? _0x44d96e ? _0x51a186 : _0x1afd3d.skipReason || "过滤跳过" : _0x1afd3d.error || (_0x1ad268 ? "" : "互动未完成"),
      type: _0x5dfb28,
      interactionResults: {
        followed: _0x11e291,
        messaged: _0x1fdbde,
        dmContent: _0x1afd3d.dmContent,
        skipped: _0x1964c5,
        skipReason: _0x40e552 ? "" : _0x44d96e ? _0x51a186 : _0x1afd3d.skipReason || "",
        demographicFilterFailed: !!_0x1afd3d.demographicFilterFailed || _0x2fc5c4,
        worksCount: _0x364d10,
        isPrivate: _0x1b6bbb !== undefined ? _0x1b6bbb : _0x531cc4 || undefined,
        userGone: _0x44d96e || undefined,
        profileUnavailable: _0x44d96e ? true : _0x1afd3d.profileUnavailable || undefined,
        profileUnavailableReason: _0x44d96e ? _0x51a186 : _0x1afd3d.profileUnavailableReason || undefined,
        gender: _0x1afd3d.gender,
        age: _0x1afd3d.age,
        location: _0x1afd3d.location,
        douyinId: _0x1afd3d.douyinId,
        signature: _0x1afd3d.signature,
        profileCommentAt: _0x1afd3d.profileCommentAt || _0x39f139.profileCommentAt,
        lastTouchAt: _0x1afd3d.lastTouchAt || _0x39f139.lastTouchAt,
        touchCounts: _0x1afd3d.touchCounts || _0x39f139.touchCounts,
        touchLog: _0x1afd3d.touchLog || _0x39f139.touchLog
      }
    };
  }
  function _0x3f0eea(_0x1cba6f) {
    if (!_0x1cba6f) {
      return null;
    }
    for (const [_0x3c706a, _0xe39cfc] of _0x3193d5().entries()) {
      if (_0xe39cfc.webContents === _0x1cba6f) {
        return _0x3c706a;
      }
    }
    return _0x23a5ae(_0x1cba6f);
  }
  function _0x33af4c() {
    return 10000 + Math.floor(Math.random() * 10001);
  }
  function _0x1a958e(_0x30b0f7 = "") {
    try {
      let _0x581d64 = String(_0x30b0f7 || "").trim();
      if (!_0x581d64) {
        return "";
      }
      if (_0x581d64.startsWith("//")) {
        _0x581d64 = "https:" + _0x581d64;
      }
      if (!/^https?:\/\//i.test(_0x581d64)) {
        _0x581d64 = "https://www.douyin.com" + (_0x581d64.startsWith("/") ? _0x581d64 : "/" + _0x581d64);
      }
      const _0x147a67 = new URL(_0x581d64);
      const _0x437fb8 = _0x147a67.pathname.match(/\/user\/(?:profile\/)?([^/?#]+)/i);
      if (!_0x437fb8?.[1]) {
        return "";
      }
      const _0x41efa4 = decodeURIComponent(_0x437fb8[1]);
      if (!_0x41efa4 || ["self", "login"].includes(_0x41efa4.toLowerCase())) {
        return "";
      }
      return _0x41efa4;
    } catch (_0x46d8cc) {
      return "";
    }
  }
  function _0xd4ef40(_0x4d8dbb) {
    const _0xb1de22 = String(_0x4d8dbb || "").trim();
    return _0xb1de22.length >= 15 && !["self", "login", "anonymous", "undefined", "null"].includes(_0xb1de22.toLowerCase()) && !_0xb1de22.startsWith("name:") && !_0xb1de22.startsWith("live_") && !/^uid:\d+$/i.test(_0xb1de22) && !/^webcast:/i.test(_0xb1de22) && !/^video:\d+$/i.test(_0xb1de22) && /^[A-Za-z0-9_-]+$/.test(_0xb1de22);
  }
  function _0x1831a2(_0x2c55f9 = {}) {
    const _0x11d737 = String(_0x2c55f9.userUrl || _0x2c55f9.profileUrl || "").trim();
    const _0x16d17e = _0x1a958e(_0x11d737);
    const _0x268426 = String(_0x2c55f9.secUid || _0x2c55f9.sec_uid || "").trim();
    const _0x50515e = _0xd4ef40(_0x2c55f9.leadId) ? String(_0x2c55f9.leadId).trim() : "";
    const _0x2912f5 = _0xd4ef40(_0x268426) && _0x268426 || _0xd4ef40(_0x16d17e) && _0x16d17e || _0x50515e || "";
    let _0x541c3f = "";
    if (_0x11d737 && !/(?:video|note)\/\d{10,}/i.test(_0x11d737)) {
      try {
        const _0x445d5d = new URL(_0x11d737.startsWith("http") ? _0x11d737 : "https://www.douyin.com" + (_0x11d737.startsWith("/") ? _0x11d737 : "/" + _0x11d737));
        _0x541c3f = ("" + _0x445d5d.origin + _0x445d5d.pathname).replace(/\/$/, "");
      } catch (_0x26cada) {
        _0x541c3f = _0x11d737;
      }
    }
    if (!_0x541c3f && _0x2912f5) {
      _0x541c3f = "https://www.douyin.com/user/" + _0x2912f5;
    }
    return {
      userUrl: _0x541c3f,
      secUid: _0x2912f5
    };
  }
  async function _0x4649ed(_0x48e303, _0x3e0833 = {}) {
    const _0x37aca1 = {
      alive: false,
      loading: false,
      blankPage: true,
      networkError: false,
      onProfile: false,
      onVideoDetail: false,
      sameUser: false,
      worksCards: 0,
      panelOpen: false,
      commentInputHint: false,
      href: "",
      textLength: 0
    };
    const _0x6639db = _0x86f3df().get(_0x48e303);
    if (!_0x6639db?.webContents || _0x6639db.webContents.isDestroyed()) {
      return _0x37aca1;
    }
    const _0x47dac5 = _0x1a958e(_0x3e0833?.userUrl || _0x3e0833?.profileUrl || "");
    try {
      const _0x2daf50 = await _0x6639db.webContents.executeJavaScript("(() => {\n                try {\n                    const href = String(location.href || '');\n                    const text = String(document.body?.innerText || '').trim().slice(0, 2400);\n                    const textLength = text.length;\n                    const blankPage = !text || textLength < 8 || href === 'about:blank';\n                    const networkError = /网络不太顺畅|无法访问此网站|刷新一下|err_name_not_resolved|err_connection|err_timed_out|err_aborted|net::err_/i.test(text);\n                    const loadingText = /加载中|正在加载|请稍候|稍后再试/.test(text);\n                    let loadingEl = false;\n                    try {\n                        loadingEl = Array.from(document.querySelectorAll(\n                            '[class*=\"loading\"], [class*=\"Loading\"], [class*=\"spinner\"], [class*=\"Spinner\"], [data-e2e*=\"loading\"]'\n                        )).some((el) => {\n                            const r = el.getBoundingClientRect();\n                            return r.width >= 6 && r.height >= 6 && r.bottom > 0 && r.top < (window.innerHeight || 800);\n                        });\n                    } catch (_) { loadingEl = false; }\n                    const onProfile = /\\/user\\//i.test(href);\n                    const onVideoDetail = /\\/(?:video|note)\\//i.test(href) || /modal_id=/i.test(href);\n                    let worksCards = 0;\n                    try {\n                        const root = document.querySelector('[data-e2e=\"user-post-list\"]') || document.body;\n                        worksCards = Array.from(root.querySelectorAll(\n                            'a[href*=\"/video/\"], a[href*=\"/note/\"], [data-e2e=\"user-post-item\"], [role=\"listitem\"]'\n                        )).filter((el) => {\n                            const r = el.getBoundingClientRect();\n                            return r.width >= 60 && r.height >= 60;\n                        }).length;\n                    } catch (_) { worksCards = 0; }\n                    const panel = document.querySelector(\n                        '[data-e2e=\"comment-list\"], .comment-mainContent, [class*=\"comment-list\"], [class*=\"CommentList\"]'\n                    );\n                    let panelOpen = false;\n                    if (panel) {\n                        const pr = panel.getBoundingClientRect();\n                        panelOpen = pr.height > 60 && pr.width > 60;\n                    }\n                    const commentInputHint = /说点什么|留下你的评论|友善交流|写评论/.test(text)\n                        || !!document.querySelector('[contenteditable=\"true\"], textarea[placeholder*=\"评论\"], [data-e2e*=\"comment-input\"]');\n                    let currentUid = '';\n                    try {\n                        const m = href.match(/\\/user\\/(?:profile\\/)?([^/?#]+)/i);\n                        if (m && m[1] && !['self', 'login'].includes(String(m[1]).toLowerCase())) {\n                            currentUid = decodeURIComponent(m[1]);\n                        }\n                    } catch (_) {}\n                    return {\n                        href,\n                        textLength,\n                        blankPage,\n                        networkError,\n                        loading: loadingText || loadingEl,\n                        onProfile,\n                        onVideoDetail,\n                        worksCards,\n                        panelOpen,\n                        commentInputHint,\n                        currentUid,\n                    };\n                } catch (err) {\n                    return {\n                        href: '',\n                        textLength: 0,\n                        blankPage: true,\n                        networkError: false,\n                        loading: false,\n                        onProfile: false,\n                        onVideoDetail: false,\n                        worksCards: 0,\n                        panelOpen: false,\n                        commentInputHint: false,\n                        currentUid: '',\n                        error: String(err && err.message || err || ''),\n                    };\n                }\n            })()", true);
      const _0x444c5c = String(_0x2daf50?.currentUid || "");
      return {
        alive: true,
        loading: !!_0x2daf50?.loading,
        blankPage: !!_0x2daf50?.blankPage,
        networkError: !!_0x2daf50?.networkError,
        onProfile: !!_0x2daf50?.onProfile,
        onVideoDetail: !!_0x2daf50?.onVideoDetail,
        sameUser: !!_0x47dac5 && !!_0x444c5c && _0x47dac5 === _0x444c5c,
        worksCards: Number(_0x2daf50?.worksCards) || 0,
        panelOpen: !!_0x2daf50?.panelOpen,
        commentInputHint: !!_0x2daf50?.commentInputHint,
        href: String(_0x2daf50?.href || ""),
        textLength: Number(_0x2daf50?.textLength) || 0
      };
    } catch (_0x549833) {
      return {
        ..._0x37aca1,
        blankPage: true
      };
    }
  }
  function _0x36d083(_0x45cbec = {}, _0x2102a4 = "", _0x226a1f = "") {
    const _0x10eca6 = ((_0x2102a4 || "") + " " + (_0x226a1f || "")).toLowerCase();
    if (!_0x45cbec.alive) {
      return {
        reload: true,
        reason: "互动页已失效"
      };
    }
    if (_0x45cbec.blankPage && !_0x45cbec.onProfile && !_0x45cbec.onVideoDetail) {
      return {
        reload: true,
        reason: "页面几乎空白，可能加载失败"
      };
    }
    if (_0x45cbec.networkError && _0x45cbec.blankPage) {
      return {
        reload: true,
        reason: "页面提示网络异常且内容不可用"
      };
    }
    if (_0x10eca6.includes("子视图切换失败") || _0x10eca6.includes("互动子视图创建失败") || _0x10eca6.includes("profile_url_mismatch") || _0x10eca6.includes("navigation") || /net::err_|err_aborted|err_timed_out|err_connection/.test(_0x10eca6)) {
      return {
        reload: true,
        reason: "导航/创建类错误，需重开主页"
      };
    }
    if (_0x45cbec.onProfile && (_0x45cbec.sameUser || !_0x1a958e(_0x45cbec.href))) {
      if (_0x10eca6.includes("profile_works_not_ready") || _0x10eca6.includes("作品区未就绪") || _0x10eca6.includes("作品区加载超时") || _0x10eca6.includes("主页打开超时") || _0x10eca6.includes("主页加载超时") || _0x10eca6.includes("profile_ready_timeout") || _0x10eca6.includes("interaction-timeout")) {
        return {
          reload: false,
          reason: _0x45cbec.loading ? "目标主页仍在加载，先等待后原地再跑" : _0x45cbec.worksCards > 0 ? "目标主页仍在（可见作品卡 " + _0x45cbec.worksCards + "），先等待后原地再跑" : "仍在目标主页，先等待后原地再跑"
        };
      }
    }
    if (_0x45cbec.onVideoDetail || _0x45cbec.onProfile && (_0x45cbec.panelOpen || _0x45cbec.commentInputHint)) {
      if (_0x10eca6.includes("comment_input_not_found") || _0x10eca6.includes("未找到评论输入框") || _0x10eca6.includes("profile_video_detail_resume_failed") || _0x10eca6.includes("详情续跑未就绪") || _0x10eca6.includes("作品详情续跑")) {
        return {
          reload: false,
          reason: _0x45cbec.loading ? "作品详情/评论区仍在加载，先等待后原地再跑" : _0x45cbec.panelOpen ? "评论区仍在，先等待后原地再跑" : "仍在作品详情页，先等待后原地再跑"
        };
      }
    }
    if (_0x45cbec.sameUser && (_0x45cbec.onProfile || _0x45cbec.onVideoDetail)) {
      return {
        reload: false,
        reason: _0x45cbec.loading ? "仍在目标用户页且加载中，先等待后原地再跑" : "仍在目标用户页，先等待后原地再跑"
      };
    }
    return {
      reload: true,
      reason: "当前页已偏离目标用户，需重开主页"
    };
  }
  function _0x18a471(_0x22706e, _0x330052, _0x45d413, _0x171f23, _0x53c2ff) {
    const _0x1c0551 = _0x3a36f();
    if (_0x411698 || _0x3c18e0 !== _0x171f23) {
      _0x4732a0(_0x22706e, {
        success: false,
        error: "batch_stopped"
      }, "retry-cancelled");
      return false;
    }
    const _0x2487f2 = _0x86f3df().get(_0x22706e);
    if (!_0x2487f2?.webContents || _0x2487f2.webContents.isDestroyed()) {
      return false;
    }
    let _0x37b693 = _0x1c0551.get(_0x22706e);
    const _0x5d6b59 = _0x37b693?.successCheckpoint;
    if (_0x5d6b59?.success && _0x5d6b59?.profileWorkCommented) {
      const _0x305118 = _0x2e6906().get(_0x22706e) || {
        lead: _0x330052,
        config: _0x45d413,
        runId: _0x171f23
      };
      console.warn("[Batch] [" + _0x22706e + "] 原地再跑前已有首作评论成功检查点，直接完结 @" + (_0x330052.nickname || ""));
      _0x353391(_0x22706e, "success-checkpoint-before-inplace");
      Promise.resolve(_0x3b2d0d(_0x22706e, _0x305118, _0x5d6b59, _0x2487f2.webContents)).then(_0x4d0ff6 => {
        if (_0x4d0ff6 !== "retry-scheduled") {
          _0x4732a0(_0x22706e, _0x5d6b59, "success-checkpoint");
        }
      }).catch(() => _0x4732a0(_0x22706e, _0x5d6b59, "success-checkpoint"));
      return true;
    }
    _0x353391(_0x22706e, "batch-inplace-retry", {
      attempt: _0x53c2ff
    });
    const _0x303ab2 = Date.now() + "_inplace_" + Math.random().toString(36).slice(2, 8);
    const _0x276997 = {
      ..._0x38897d(_0x330052, _0x45d413, _0x22706e),
      batchRunId: _0x171f23,
      viewKey: _0x22706e,
      interactionId: _0x303ab2,
      createdAt: Date.now(),
      __batchInPlaceRetry: _0x53c2ff
    };
    const _0x58b671 = _0x41634a(_0x276997);
    _0x37b693 = _0x1c0551.get(_0x22706e);
    if (!_0x37b693) {
      const _0x43ba80 = _0x3193d5().get(_0x22706e);
      const _0x2078c7 = _0x13b874(_0x22706e, _0x43ba80, _0x2487f2, null);
      _0x37b693 = {
        bounds: _0x2078c7,
        zoomFactor: _0x43ba80?.webContents && !_0x43ba80.webContents.isDestroyed() ? _0x43ba80.webContents.getZoomFactor() : 1,
        previewBounds: _0x2078c7 ? {
          ..._0x2078c7
        } : null,
        previewZoomFactor: _0x43ba80?.webContents && !_0x43ba80.webContents.isDestroyed() ? _0x43ba80.webContents.getZoomFactor() : 1,
        startedAt: Date.now(),
        interactionId: _0x303ab2,
        timeoutMs: _0x58b671,
        successCheckpoint: null,
        visibleSwapReady: true,
        timer: null,
        taskDispatchTimer: null,
        profileOpenTimer: null,
        profileOpenReady: true,
        onTimeout: null,
        onProfileOpenTimeout: null
      };
      _0x1c0551.set(_0x22706e, _0x37b693);
    } else {
      if (_0x37b693.timer) {
        clearTimeout(_0x37b693.timer);
      }
      if (_0x37b693.taskDispatchTimer) {
        clearTimeout(_0x37b693.taskDispatchTimer);
      }
      if (_0x37b693.profileOpenTimer) {
        clearTimeout(_0x37b693.profileOpenTimer);
        _0x37b693.profileOpenTimer = null;
      }
      _0x37b693.interactionId = _0x303ab2;
      _0x37b693.startedAt = Date.now();
      _0x37b693.timeoutMs = _0x58b671;
      _0x37b693.profileOpenReady = true;
    }
    _0x37b693.onTimeout = () => {
      const _0xd87b94 = _0x1c0551.get(_0x22706e);
      if (!_0xd87b94 || _0xd87b94.interactionId !== _0x303ab2) {
        return;
      }
      const _0x21b24f = _0xd87b94.successCheckpoint;
      const _0x578644 = _0x2e6906().get(_0x22706e);
      if (_0x21b24f?.success && _0x21b24f?.profileWorkCommented && _0x578644?.runId === _0x3c18e0) {
        Promise.resolve(_0x3b2d0d(_0x22706e, _0x578644, _0x21b24f, _0x2487f2.webContents)).then(_0x1cb1b1 => {
          if (_0x1cb1b1 !== "retry-scheduled") {
            _0x4732a0(_0x22706e, _0x21b24f, "success-checkpoint");
          }
        }).catch(() => _0x4732a0(_0x22706e, _0x21b24f, "success-checkpoint"));
        return;
      }
      if (_0x578644 && _0x578644.runId === _0x3c18e0) {
        Promise.resolve(_0x3b2d0d(_0x22706e, _0x578644, {
          success: false,
          error: "interaction-timeout"
        }, _0x2487f2.webContents)).then(_0x4dc2c8 => {
          if (_0x4dc2c8 !== "retry-scheduled") {
            _0x4732a0(_0x22706e, {
              followed: false,
              messaged: false,
              error: "interaction-timeout"
            }, "timeout");
          }
        }).catch(() => {
          _0x4732a0(_0x22706e, {
            followed: false,
            messaged: false,
            error: "interaction-timeout"
          }, "timeout");
        });
        return;
      }
      _0x4732a0(_0x22706e, {
        followed: false,
        messaged: false,
        error: "interaction-timeout"
      }, "timeout");
    };
    _0x37b693.timer = setTimeout(_0x37b693.onTimeout, _0x58b671);
    _0x2e6906().set(_0x22706e, {
      lead: _0x330052,
      config: _0x45d413,
      runId: _0x171f23
    });
    try {
      _0x2487f2.webContents.send("interaction-prepare-task", _0x276997);
      console.warn("[Batch] [" + _0x22706e + "] 第 " + _0x53c2ff + " 次原地再跑 @" + (_0x330052.nickname || "") + "（不重载）");
      return true;
    } catch (_0x4c89bb) {
      console.warn("[Batch] [" + _0x22706e + "] 原地再派发失败:", _0x4c89bb?.message || _0x4c89bb);
      return false;
    }
  }
  function _0x2cfed7(_0xb132f6, _0x2618de, _0x4f7882, _0xde8a8d, _0x2cd4d3, _0x5aad87, _0xed2044 = "", _0x577177 = {}) {
    try {
      const _0x161d2b = _0x86f3df().get(_0xb132f6);
      if (_0x161d2b?.webContents && !_0x161d2b.webContents.isDestroyed()) {
        _0x161d2b.webContents.stop();
      }
    } catch (_0x1d0b3a) {}
    _0x2e6906().delete(_0xb132f6);
    _0x4732a0(_0xb132f6, {
      success: false,
      error: _0x5aad87
    }, "retry-cleanup");
    const _0x5afcb4 = _0x203fb0();
    const _0xaf266 = _0x5afcb4.get(_0xb132f6);
    if (_0xaf266) {
      _0xaf266.unshift({
        lead: _0x2618de,
        config: _0x4f7882
      });
    } else {
      _0x5afcb4.set(_0xb132f6, [{
        lead: _0x2618de,
        config: _0x4f7882
      }]);
    }
    const _0x3f009d = _0x577177.immediate ? 800 : _0x33af4c();
    console.warn("[Batch] [" + _0xb132f6 + "] " + Math.round(_0x3f009d / 1000) + " 秒后进行第 " + _0x2cd4d3 + " 次主页重开" + ("" + (_0xed2044 ? "（" + _0xed2044 + "）" : "")));
    setTimeout(() => {
      if (!_0x411698 && _0x3c18e0 === _0xde8a8d) {
        _0x18d9a3(_0xb132f6, _0xde8a8d, "profile-load-retry-" + _0x2cd4d3);
      }
    }, _0x3f009d);
  }
  function _0x3678d0(_0x4c6af0, _0x4be27e = "") {
    if (!_0x4c6af0 && !_0x4be27e) {
      return false;
    }
    const _0x209717 = ((_0x4c6af0 || "") + " " + (_0x4be27e || "")).toLowerCase();
    if (_0x209717.includes("user_not_found") || _0x209717.includes("用户不存在") || _0x209717.includes("无此用户") || _0x209717.includes("账号已被封禁") || _0x209717.includes("可能已注销")) {
      return false;
    }
    return _0x209717.includes("interaction-timeout") || _0x209717.includes("profile_ready_timeout") || _0x209717.includes("profile_works_not_ready") || _0x209717.includes("作品区未就绪") || _0x209717.includes("作品区加载超时") || _0x209717.includes("profile_video_detail_resume_failed") || _0x209717.includes("详情续跑未就绪") || _0x209717.includes("作品详情续跑") || _0x209717.includes("comment_input_not_found") || _0x209717.includes("未找到评论输入框") || _0x209717.includes("profile_url_mismatch") || _0x209717.includes("主页加载超时") || _0x209717.includes("主页打开超时") || _0x209717.includes("子视图切换失败") || _0x209717.includes("互动子视图创建失败") || _0x209717.includes("加载失败") || _0x209717.includes("net::err_") || _0x209717.includes("页面加载") || _0x209717.includes("navigation") || _0x209717.includes("err_aborted") || _0x209717.includes("err_timed_out") || _0x209717.includes("err_connection");
  }
  async function _0x3b2d0d(_0x57c4cb, _0x5eb6b1, _0x34bf4a, _0x351175) {
    const {
      lead: _0x50e4e6,
      config: _0x55395a,
      runId: _0x51add6
    } = _0x5eb6b1;
    const _0x12241b = _0x34bf4a?.error || _0x34bf4a?.errorCode || "";
    const _0x58c8f6 = _0x34bf4a?.errorCode || "";
    if (!_0x34bf4a?.success && _0x3678d0(_0x12241b, _0x58c8f6)) {
      const _0x509184 = _0x57c4cb + ":" + (_0x50e4e6.leadId || _0x50e4e6.nickname);
      const _0x547c55 = _0x32ff84.get(_0x509184) || 0;
      if (_0x547c55 < BATCH_PROFILE_LOAD_MAX_RETRIES) {
        _0x32ff84.set(_0x509184, _0x547c55 + 1);
        const _0x25ba7c = _0x547c55 + 1;
        const _0x4af03d = await _0x4649ed(_0x57c4cb, _0x50e4e6);
        const _0x3bcb74 = _0x36d083(_0x4af03d, _0x58c8f6, _0x12241b);
        console.warn("[Batch] [" + _0x57c4cb + "] 主页/详情未就绪，第 " + _0x25ba7c + "/" + BATCH_PROFILE_LOAD_MAX_RETRIES + " 次重试: @" + _0x50e4e6.nickname + (" (" + _0x12241b + ") → " + (_0x3bcb74.reload ? "重开主页" : "原地再跑") + "（" + _0x3bcb74.reason + "；") + ("加载中=" + (_0x4af03d.loading ? "是" : "否") + "，主页=" + (_0x4af03d.onProfile ? "是" : "否") + "，") + ("详情=" + (_0x4af03d.onVideoDetail ? "是" : "否") + "，作品卡=" + _0x4af03d.worksCards + "）"));
        _0x47064a("⚠️ @" + (_0x50e4e6.nickname || "未知") + " " + (_0x3bcb74.reload ? "需重开主页" : "先原地再试") + ("（" + _0x12241b + "；" + _0x3bcb74.reason + "），第 " + _0x25ba7c + "/" + BATCH_PROFILE_LOAD_MAX_RETRIES + " 次"), _0x50e4e6.accountId, {
          runId: _0x51add6,
          viewKey: _0x57c4cb,
          phase: "retry",
          level: "warning",
          leadName: _0x50e4e6.nickname || ""
        });
        _0x54648b(_0x51add6, {
          message: "@" + (_0x50e4e6.nickname || "未知") + " " + (_0x3bcb74.reload ? "将重开主页" : "将原地再跑") + ("（" + _0x12241b + "；" + _0x3bcb74.reason + "），第 " + _0x25ba7c + " 次…"),
          level: "warning",
          accountId: _0x50e4e6.accountId,
          accountName: _0x50e4e6.accountName || "",
          viewKey: _0x57c4cb,
          leadId: _0x50e4e6.leadId,
          leadName: _0x50e4e6.nickname || "",
          phase: "retry"
        });
        if (!_0x3bcb74.reload) {
          const _0x37bc97 = _0x33af4c();
          console.warn("[Batch] [" + _0x57c4cb + "] 不重载，" + Math.round(_0x37bc97 / 1000) + " 秒后原地再跑 @" + (_0x50e4e6.nickname || ""));
          _0x353391(_0x57c4cb, "batch-inplace-retry-wait", {
            attempt: _0x25ba7c
          });
          const _0x54ca77 = _0x3a36f();
          const _0x4de8bd = _0x54ca77.get(_0x57c4cb);
          if (_0x4de8bd?.successCheckpoint?.success && _0x4de8bd.successCheckpoint?.profileWorkCommented) {
            console.warn("[Batch] [" + _0x57c4cb + "] 超时瞬间已有首作成功检查点，取消原地重试并完结");
            const _0x533b49 = _0x4de8bd.successCheckpoint;
            Promise.resolve(_0x3b2d0d(_0x57c4cb, _0x5eb6b1, _0x533b49, _0x351175)).then(_0x206cc3 => {
              if (_0x206cc3 !== "retry-scheduled") {
                _0x4732a0(_0x57c4cb, _0x533b49, "success-checkpoint");
              }
            }).catch(() => _0x4732a0(_0x57c4cb, _0x533b49, "success-checkpoint"));
            return "retry-scheduled";
          }
          if (_0x4de8bd) {
            if (_0x4de8bd.timer) {
              clearTimeout(_0x4de8bd.timer);
            }
            if (_0x4de8bd.taskDispatchTimer) {
              clearTimeout(_0x4de8bd.taskDispatchTimer);
            }
            if (_0x4de8bd.profileOpenTimer) {
              clearTimeout(_0x4de8bd.profileOpenTimer);
              _0x4de8bd.profileOpenTimer = null;
            }
            _0x4de8bd.profileOpenReady = true;
            const _0x4a1ff5 = "batch_wait_retry_" + Date.now();
            _0x4de8bd.interactionId = _0x4a1ff5;
            _0x4de8bd.timer = setTimeout(() => {
              const _0x304e51 = _0x54ca77.get(_0x57c4cb);
              if (!_0x304e51 || _0x304e51.interactionId !== _0x4a1ff5) {
                return;
              }
              if (_0x304e51.successCheckpoint?.success && _0x304e51.successCheckpoint?.profileWorkCommented) {
                const _0x1d0008 = _0x304e51.successCheckpoint;
                console.warn("[Batch] [" + _0x57c4cb + "] 原地等待期间收到成功检查点，完结而非重开 @" + (_0x50e4e6.nickname || ""));
                Promise.resolve(_0x3b2d0d(_0x57c4cb, _0x5eb6b1, _0x1d0008, _0x351175)).then(_0x221530 => {
                  if (_0x221530 !== "retry-scheduled") {
                    _0x4732a0(_0x57c4cb, _0x1d0008, "success-checkpoint");
                  }
                }).catch(() => _0x4732a0(_0x57c4cb, _0x1d0008, "success-checkpoint"));
                return;
              }
              console.warn("[Batch] [" + _0x57c4cb + "] 原地等待超时，改为重开主页 @" + (_0x50e4e6.nickname || ""));
              _0x2cfed7(_0x57c4cb, _0x50e4e6, _0x55395a, _0x51add6, _0x25ba7c, _0x12241b, "原地等待超时", {
                immediate: true
              });
            }, _0x37bc97 + 90000);
          }
          setTimeout(() => {
            (async () => {
              if (_0x411698 || _0x3c18e0 !== _0x51add6) {
                _0x2e6906().delete(_0x57c4cb);
                _0x4732a0(_0x57c4cb, {
                  success: false,
                  error: "batch_stopped"
                }, "retry-cancelled");
                return;
              }
              const _0x2bba7b = _0x3a36f();
              const _0x41f0b1 = _0x2bba7b.get(_0x57c4cb);
              if (_0x41f0b1?.successCheckpoint?.success && _0x41f0b1.successCheckpoint?.profileWorkCommented) {
                const _0x449c26 = _0x41f0b1.successCheckpoint;
                console.warn("[Batch] [" + _0x57c4cb + "] 原地等待结束前已成功，跳过再跑 @" + (_0x50e4e6.nickname || ""));
                Promise.resolve(_0x3b2d0d(_0x57c4cb, _0x5eb6b1, _0x449c26, _0x351175)).then(_0x494006 => {
                  if (_0x494006 !== "retry-scheduled") {
                    _0x4732a0(_0x57c4cb, _0x449c26, "success-checkpoint");
                  }
                }).catch(() => _0x4732a0(_0x57c4cb, _0x449c26, "success-checkpoint"));
                return;
              }
              const _0x1550c0 = await _0x4649ed(_0x57c4cb, _0x50e4e6);
              const _0x3af4d4 = _0x36d083(_0x1550c0, _0x58c8f6, _0x12241b);
              if (!_0x3af4d4.reload && _0x1550c0.onProfile && (_0x1550c0.sameUser || _0x1550c0.worksCards > 0 || _0x1550c0.loading)) {
                const _0x1ec47b = _0x18a471(_0x57c4cb, _0x50e4e6, _0x55395a, _0x51add6, _0x25ba7c);
                if (_0x1ec47b) {
                  return;
                }
              }
              console.warn("[Batch] [" + _0x57c4cb + "] 原地条件不再满足（" + _0x3af4d4.reason + "），改为重开主页");
              _0x2cfed7(_0x57c4cb, _0x50e4e6, _0x55395a, _0x51add6, _0x25ba7c, _0x12241b, _0x3af4d4.reason, {
                immediate: true
              });
            })().catch(_0x3b58cd => {
              console.warn("[Batch] [" + _0x57c4cb + "] 原地重试异常，改为重开:", _0x3b58cd?.message || _0x3b58cd);
              _0x2cfed7(_0x57c4cb, _0x50e4e6, _0x55395a, _0x51add6, _0x25ba7c, _0x12241b, "原地重试异常", {
                immediate: true
              });
            });
          }, _0x37bc97);
          return "retry-scheduled";
        }
        _0x2cfed7(_0x57c4cb, _0x50e4e6, _0x55395a, _0x51add6, _0x25ba7c, _0x12241b, _0x3bcb74.reason);
        return "retry-scheduled";
      }
      _0x32ff84.delete(_0x509184);
      _0x34bf4a = {
        ..._0x34bf4a,
        error: "主页加载超时，已重试" + BATCH_PROFILE_LOAD_MAX_RETRIES + "次仍失败（" + _0x12241b + "）"
      };
      console.error("[Batch] [" + _0x57c4cb + "] 主页加载重试 " + BATCH_PROFILE_LOAD_MAX_RETRIES + " 次后仍失败: @" + _0x50e4e6.nickname);
      _0x54648b(_0x51add6, {
        message: "@" + (_0x50e4e6.nickname || "未知") + " 主页加载重试 " + BATCH_PROFILE_LOAD_MAX_RETRIES + " 次后仍失败，已跳过",
        level: "error",
        accountId: _0x50e4e6.accountId,
        accountName: _0x50e4e6.accountName || "",
        viewKey: _0x57c4cb,
        leadId: _0x50e4e6.leadId,
        leadName: _0x50e4e6.nickname || "",
        phase: "retry-exhausted"
      });
    } else {
      const _0x5ee656 = _0x57c4cb + ":" + (_0x50e4e6.leadId || _0x50e4e6.nickname);
      _0x32ff84.delete(_0x5ee656);
    }
    _0x2e6906().delete(_0x57c4cb);
    const _0x7399af = _0x2b5b03(_0x55395a.type, _0x34bf4a, _0x50e4e6);
    const _0x51ef4c = _0x86f3df().get(_0x57c4cb);
    const _0x195d8b = _0x351175 && typeof _0x351175.isDestroyed === "function" && !_0x351175.isDestroyed();
    const _0x413a82 = {
      sender: (_0x195d8b ? _0x351175 : null) || _0x51ef4c?.webContents || _0x3193d5().get(_0x57c4cb)?.webContents
    };
    _0x38898c(_0x413a82, _0x7399af, _0x51add6, _0x57c4cb);
    return "completed";
  }
  function _0x59dee3(_0x260ffb, _0x2187fe, _0x35197a) {
    const _0x55c790 = _0xf98cb().get(_0x260ffb) || 0;
    const _0x3d26ad = Date.now() - _0x55c790;
    const _0x5eabab = Math.max(0, SUBVIEW_HANDOFF_MIN_GAP_MS - _0x3d26ad);
    if (_0x5eabab > 0) {
      console.log("[Main] [子视图模式] 距上次互动结束 " + _0x3d26ad + "ms，缓冲 " + _0x5eabab + "ms 后再打开下一主页");
      setTimeout(() => {
        if (_0x35197a?.isBatchAction && _0x35197a?.batchRunId !== _0x3c18e0) {
          console.log("[Batch] 忽略旧代次的延迟互动启动 (" + _0x260ffb + ", run " + _0x35197a?.batchRunId + ")");
          return;
        }
        const _0x5b2dee = _0x346810(_0x260ffb, _0x2187fe, _0x35197a);
        if (_0x5b2dee || !_0x35197a?.isBatchAction) {
          return;
        }
        const _0x46c8fd = _0x2e6906().get(_0x260ffb);
        if (!_0x46c8fd || _0x35197a?.batchRunId != null && _0x46c8fd.runId !== _0x35197a.batchRunId) {
          return;
        }
        console.error("[Batch] [" + _0x260ffb + "] 延迟启动子视图失败，回传失败结果");
        Promise.resolve(_0x3b2d0d(_0x260ffb, _0x46c8fd, {
          success: false,
          error: "子视图切换失败"
        }, _0x86f3df().get(_0x260ffb)?.webContents || _0x3193d5().get(_0x260ffb)?.webContents)).then(_0x59a771 => {
          if (_0x59a771 === "retry-scheduled") {
            return;
          }
          _0x4732a0(_0x260ffb, {
            success: false,
            error: "子视图切换失败"
          }, "delayed-start-failed");
        }).catch(() => {
          _0x4732a0(_0x260ffb, {
            success: false,
            error: "子视图切换失败"
          }, "delayed-start-failed");
        });
      }, _0x5eabab);
      return true;
    }
    return _0x346810(_0x260ffb, _0x2187fe, _0x35197a);
  }
  function _0x21f742(_0x3b1c16) {
    _0x5531e6(_0x3b1c16);
    const _0x3f1a6d = _0x86f3df();
    const _0xdd9333 = _0x3f1a6d.get(_0x3b1c16);
    if (_0xdd9333 && !_0xdd9333.webContents.isDestroyed()) {
      return _0xdd9333;
    }
    if (_0xdd9333) {
      _0x3f1a6d.delete(_0x3b1c16);
    }
    const _0x233bac = _0x3193d5().get(_0x3b1c16);
    const _0x5c6841 = _0x42dad6();
    if (!_0x233bac || !_0x5c6841 || _0x5c6841.isDestroyed()) {
      return null;
    }
    const _0x1b7dc9 = _0x57e918();
    const _0x423026 = _0x1b7dc9.get(_0x3b1c16) || {};
    const _0x4cde0a = _0x423026.platform || _0x1b7dc9.get(_0x3b1c16 + "_platform") || _0x3b1c16.split("_")[0] || "douyin";
    const _0x511263 = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false,
        preload: _0x5bc01b(),
        partition: "persist:automation:" + _0x3b1c16,
        backgroundThrottling: false,
        spellcheck: false
      }
    });
    _0x511263.setBackgroundColor("#111827");
    _0x511263.setBounds({
      x: -5000,
      y: -5000,
      width: COMPACT_BACKGROUND_AUTOMATION_WIDTH,
      height: COMPACT_BACKGROUND_AUTOMATION_HEIGHT
    });
    _0x261f1e(_0x511263.webContents, _0x3b1c16 + ":interaction");
    _0x1bdc80(_0x511263, _0x3b1c16, {
      isInteraction: true
    });
    _0xb14d6f(_0x511263.webContents.session, _0x3b1c16);
    if (_0x4cde0a === "xianyu") {
      _0x5112a1(_0x511263.webContents.session);
    }
    _0x511263.webContents.setUserAgent(_0x503d8b);
    _0x511263.webContents.setAudioMuted(_0x4df458.get("system_video_muted", true));
    _0x511263.webContents.on("did-fail-load", (_0x586c3e, _0x3b6d89, _0x9c90f9, _0x5f20a0, _0x1fda50) => {
      if (_0x5f20a0?.includes("bytedance.net") || _0x5f20a0?.includes("douyin.com")) {
        console.warn("[Network][" + _0x3b1c16 + ":interaction] did-fail-load code=" + _0x3b6d89 + " main=" + _0x1fda50 + " " + _0x9c90f9 + " " + _0x5f20a0);
      }
    });
    _0x73b805(_0x511263.webContents, _0x4cde0a, true);
    _0x511263.webContents.on("dom-ready", () => {
      _0x1a8625.ensureAndPushToWebContents(_0x511263.webContents);
    });
    _0x3f1a6d.set(_0x3b1c16, _0x511263);
    _0x1a8625.ensureAndPushToWebContents(_0x511263.webContents);
    console.log("[Perf] 已按需创建互动视图: " + _0x3b1c16);
    return _0x511263;
  }
  function _0x346810(_0x4cdb97, _0x2045be, _0x197a48) {
    const _0x366f44 = _0x3193d5();
    const _0x2e19b0 = _0x3a36f();
    const _0x3f4664 = _0x42dad6();
    const _0x5b25eb = _0x1f8fcb();
    const _0x290deb = _0x1e01e0();
    const _0x54b7d2 = _0x366f44.get(_0x4cdb97);
    const _0x183da5 = _0x21f742(_0x4cdb97);
    if (!_0x54b7d2 || !_0x183da5 || !_0x3f4664) {
      if (_0x183da5) {
        _0x5027f7(_0x4cdb97);
      }
      return false;
    }
    const _0x259df5 = _0x2e19b0.get(_0x4cdb97);
    const _0x43c6dc = _0x13b874(_0x4cdb97, _0x54b7d2, _0x183da5, _0x259df5);
    if (!_0x12775e(_0x43c6dc)) {
      console.warn("[Main] 无法解析互动视口坐标，取消子视图切换: " + _0x4cdb97);
      _0x5027f7(_0x4cdb97);
      return false;
    }
    console.log("[Main] [子视图模式] 切换至互动视图: " + _0x2045be + " (坐标: " + _0x43c6dc.x + ", " + _0x43c6dc.y + ")");
    const _0x4052ea = _0x2e19b0.get(_0x4cdb97);
    if (_0x4052ea?.timer) {
      clearTimeout(_0x4052ea.timer);
    }
    if (_0x4052ea?.taskDispatchTimer) {
      clearTimeout(_0x4052ea.taskDispatchTimer);
    }
    if (_0x4052ea?.loadListener) {
      _0x183da5.webContents.removeListener("did-finish-load", _0x4052ea.loadListener);
    }
    const _0x3dae76 = Date.now() + "_" + Math.random().toString(36).slice(2);
    const _0x198c6f = _0x41634a(_0x197a48);
    const _0x2713c8 = {
      bounds: _0x43c6dc,
      zoomFactor: _0x54b7d2.webContents.getZoomFactor(),
      previewBounds: {
        ..._0x43c6dc
      },
      previewZoomFactor: _0x54b7d2.webContents.getZoomFactor(),
      startedAt: Date.now(),
      interactionId: _0x3dae76,
      timeoutMs: _0x198c6f,
      successCheckpoint: null,
      visibleSwapReady: false,
      timer: null,
      taskDispatchTimer: null,
      profileOpenTimer: null,
      profileOpenReady: false,
      onTimeout: null,
      onProfileOpenTimeout: null
    };
    _0x2713c8.onTimeout = () => {
      const _0x5bb25b = _0x2e19b0.get(_0x4cdb97);
      if (!_0x5bb25b || _0x5bb25b.interactionId !== _0x3dae76) {
        return;
      }
      if (_0x5bb25b.profileOpenTimer) {
        clearTimeout(_0x5bb25b.profileOpenTimer);
        _0x5bb25b.profileOpenTimer = null;
      }
      const _0x119315 = _0x5bb25b.successCheckpoint;
      const _0x1e289c = _0x2e6906().get(_0x4cdb97);
      if (_0x119315?.success && _0x119315?.profileWorkCommented && _0x1e289c?.runId === _0x3c18e0) {
        console.warn("[Batch] [" + _0x4cdb97 + "] 首作评论成功回调迟到，使用成功检查点完成本条，避免误记 interaction-timeout");
        Promise.resolve(_0x3b2d0d(_0x4cdb97, _0x1e289c, _0x119315, _0x183da5.webContents)).then(_0x53f101 => {
          if (_0x53f101 !== "retry-scheduled") {
            _0x4732a0(_0x4cdb97, _0x119315, "success-checkpoint");
          }
        }).catch(() => _0x4732a0(_0x4cdb97, _0x119315, "success-checkpoint"));
        return;
      }
      console.warn("[Main] [子视图模式] 互动超时，强制恢复主视图: " + _0x4cdb97);
      if (_0x1e289c && _0x1e289c.runId === _0x3c18e0) {
        Promise.resolve(_0x3b2d0d(_0x4cdb97, _0x1e289c, {
          success: false,
          error: "interaction-timeout"
        }, _0x183da5.webContents)).then(_0xbb195e => {
          if (_0xbb195e !== "retry-scheduled") {
            _0x4732a0(_0x4cdb97, {
              followed: false,
              messaged: false,
              error: "interaction-timeout"
            }, "timeout");
          }
        }).catch(() => {
          _0x4732a0(_0x4cdb97, {
            followed: false,
            messaged: false,
            error: "interaction-timeout"
          }, "timeout");
        });
        return;
      }
      _0x4732a0(_0x4cdb97, {
        followed: false,
        messaged: false,
        error: "interaction-timeout"
      }, "timeout");
    };
    _0x2713c8.timer = setTimeout(_0x2713c8.onTimeout, _0x198c6f);
    if (_0x197a48?.isBatchAction) {
      _0x2713c8.onProfileOpenTimeout = async () => {
        const _0x54b63a = _0x2e19b0.get(_0x4cdb97);
        if (!_0x54b63a || _0x54b63a.interactionId !== _0x3dae76) {
          return;
        }
        if (_0x54b63a.profileOpenReady) {
          return;
        }
        try {
          if (_0x183da5?.webContents && !_0x183da5.webContents.isDestroyed()) {
            const _0x42432e = await _0x183da5.webContents.executeJavaScript("\n                            !!(document.querySelector('a[href*=\"/user/\"]') || document.querySelector('.user-info') || document.querySelector('[data-e2e=\"user-info\"]') || (document.body && document.body.innerText && (document.body.innerText.includes('获赞') || document.body.innerText.includes('作品'))))\n                        ").catch(() => false);
            if (_0x42432e) {
              console.warn("[Batch] [" + _0x4cdb97 + "] 主页加载事件虽阻塞，但 DOM 核心节点已就绪，跳过超时拦截继续跟进");
              _0x54b63a.profileOpenReady = true;
              return;
            }
          }
        } catch (_0x25420a) {}
        _0x54b63a.profileOpenTimer = null;
        const _0xada9b3 = _0x2e6906().get(_0x4cdb97);
        console.warn("[Batch] [" + _0x4cdb97 + "] 主页打开超过 " + BATCH_PROFILE_OPEN_TIMEOUT_MS / 1000 + "s 仍未就绪");
        if (_0xada9b3 && _0xada9b3.runId === _0x3c18e0) {
          Promise.resolve(_0x3b2d0d(_0x4cdb97, _0xada9b3, {
            success: false,
            error: "主页打开超时"
          }, _0x183da5.webContents)).then(_0x305174 => {
            if (_0x305174 !== "retry-scheduled") {
              _0x4732a0(_0x4cdb97, {
                followed: false,
                messaged: false,
                error: "主页打开超时"
              }, "profile-open-timeout");
            }
          }).catch(() => {
            _0x4732a0(_0x4cdb97, {
              followed: false,
              messaged: false,
              error: "主页打开超时"
            }, "profile-open-timeout");
          });
        }
      };
      _0x2713c8.profileOpenTimer = setTimeout(_0x2713c8.onProfileOpenTimeout, BATCH_PROFILE_OPEN_TIMEOUT_MS);
    }
    _0x2e19b0.set(_0x4cdb97, _0x2713c8);
    if (_0x583df5(_0x4cdb97)) {
      const _0x7a55d1 = _0x4afa5c(_0x4cdb97, "runInteractionStart:stage-before-load:" + _0x4cdb97);
      _0x47064a(_0x7a55d1.interactionStaged ? "🖥 用户主页子视图已进入有效视口（底层预热 " + _0x43c6dc.width + "x" + _0x43c6dc.height + "）" : "⚠ 用户主页子视图未获得有效视口，正在重试", _0x197a48?.lead?.accountId, {
        viewKey: _0x4cdb97,
        phase: "interaction-viewport",
        leadName: _0x197a48?.lead?.nickname || "",
        level: _0x7a55d1.interactionStaged ? "normal" : "warning",
        persist: false
      });
    } else {
      _0x43f1d4(_0x4cdb97, _0x183da5, {
        active: true,
        force: true
      });
      _0x5b25eb.delete(_0x4cdb97);
      _0x290deb.add(_0x4cdb97);
      _0x47064a("🖥 用户主页子视图已进入后台稳定视口（" + COMPACT_BACKGROUND_AUTOMATION_WIDTH + "x" + COMPACT_BACKGROUND_AUTOMATION_HEIGHT + "）", _0x197a48?.lead?.accountId, {
        viewKey: _0x4cdb97,
        phase: "interaction-viewport",
        leadName: _0x197a48?.lead?.nickname || "",
        persist: false
      });
    }
    let _0x58b8ea = false;
    let _0x4f1210 = null;
    const _0x3577a3 = () => {
      if (_0x58b8ea) {
        return Promise.resolve(true);
      }
      if (_0x4f1210) {
        return _0x4f1210;
      }
      _0x4f1210 = (async () => {
        const _0x5f9312 = _0x2e19b0.get(_0x4cdb97);
        if (!_0x5f9312 || _0x5f9312.interactionId !== _0x3dae76) {
          return false;
        }
        const _0x2fa889 = _0x583df5(_0x4cdb97);
        if (_0x2fa889) {
          const _0x48a609 = _0x4afa5c(_0x4cdb97, "runInteractionStart:visual-stage:" + _0x4cdb97);
          if (!_0x48a609.interactionStaged) {
            console.warn("[Main] [子视图模式] 互动视图未能获得有效视口，暂不下发任务 (" + _0x4cdb97 + ")");
            return false;
          }
          const _0x561cc8 = await waitForInteractionViewVisualReady(_0x183da5, () => _0x2e19b0.get(_0x4cdb97)?.interactionId === _0x3dae76);
          if (!_0x561cc8.ready) {
            console.warn("[Main] [子视图模式] 可见首帧尚未就绪，继续显示主视图 (" + _0x4cdb97 + ", " + (_0x561cc8.reason || "unknown") + ")");
            return false;
          }
          if (!_0x583df5(_0x4cdb97)) {
            _0x43f1d4(_0x4cdb97, _0x183da5, {
              active: true
            });
            _0x5b25eb.delete(_0x4cdb97);
            _0x290deb.add(_0x4cdb97);
            _0x58b8ea = true;
            return true;
          }
          const _0x1fe83c = _0x2e19b0.get(_0x4cdb97);
          if (!_0x1fe83c || _0x1fe83c.interactionId !== _0x3dae76) {
            return false;
          }
          await new Promise(_0x57b8de => setTimeout(_0x57b8de, 420));
          const _0x550669 = _0x2e19b0.get(_0x4cdb97);
          if (!_0x550669 || _0x550669.interactionId !== _0x3dae76) {
            return false;
          }
          _0x550669.visibleSwapReady = true;
          const _0x42d53f = _0x4afa5c(_0x4cdb97, "runInteractionStart:warmed-visible-swap:" + _0x4cdb97);
          if (!_0x42d53f.interactionVisible) {
            return false;
          }
          console.log("[Main] [子视图模式] 可见子视图首帧已预热后置顶 (" + _0x4cdb97 + ", " + _0x561cc8.reason + ", " + _0x561cc8.elapsedMs + "ms)");
          _0x47064a("🖥 首作互动画面已就绪并显示（首帧预热 " + _0x561cc8.elapsedMs + "ms）", _0x197a48?.lead?.accountId, {
            viewKey: _0x4cdb97,
            phase: "interaction-view",
            leadName: _0x197a48?.lead?.nickname || "",
            persist: false
          });
        } else {
          if (_0x1485dd(_0x4cdb97)) {
            _0x418bc3(_0x54b7d2.webContents);
            if (!_0x3f4664.getBrowserViews().includes(_0x54b7d2)) {
              _0x3f4664.addBrowserView(_0x54b7d2);
            }
            if (!_0x12775e(_0x54b7d2.getBounds()) && _0x12775e(_0x43c6dc)) {
              _0x54b7d2.setBounds(_0x43c6dc);
            }
            _0x38c93c(_0x54b7d2, {
              context: "runInteractionStart:keep-preview:" + _0x4cdb97
            });
          } else {
            _0x156745(_0x54b7d2.webContents);
            if (_0x5eff65()) {
              _0x1b54ab(_0x4cdb97, _0x54b7d2);
            }
          }
          _0x43f1d4(_0x4cdb97, _0x183da5, {
            active: true
          });
          _0x5b25eb.delete(_0x4cdb97);
          _0x290deb.add(_0x4cdb97);
        }
        _0x58b8ea = true;
        if (_0x2fa889) {
          _0x4d6a45(_0x183da5.webContents);
        }
        return true;
      })().finally(() => {
        if (!_0x58b8ea) {
          _0x4f1210 = null;
        }
      });
      return _0x4f1210;
    };
    const _0x1c8ad3 = _0x2e19b0.get(_0x4cdb97);
    const _0x4e726a = {
      ..._0x197a48,
      viewKey: _0x4cdb97,
      interactionId: _0x3dae76,
      createdAt: Date.now()
    };
    let _0x53e425 = false;
    const _0x507ea1 = async () => {
      if (_0x53e425) {
        return;
      }
      const _0xb78daf = await _0x3577a3();
      const _0x4da20f = _0x2e19b0.get(_0x4cdb97);
      if (!_0x4da20f || _0x4da20f.interactionId !== _0x3dae76) {
        return;
      }
      if (!_0xb78daf) {
        if (_0x4da20f.taskDispatchTimer) {
          clearTimeout(_0x4da20f.taskDispatchTimer);
        }
        _0x4da20f.taskDispatchTimer = setTimeout(() => {
          _0x4da20f.taskDispatchTimer = null;
          _0x507ea1();
        }, 600);
        if (typeof _0x4da20f.taskDispatchTimer.unref === "function") {
          _0x4da20f.taskDispatchTimer.unref();
        }
        return;
      }
      if (_0x4da20f.taskDispatchTimer) {
        clearTimeout(_0x4da20f.taskDispatchTimer);
        _0x4da20f.taskDispatchTimer = null;
      }
      if (_0x4da20f.profileOpenTimer) {
        clearTimeout(_0x4da20f.profileOpenTimer);
        _0x4da20f.profileOpenTimer = null;
      }
      if (!_0x183da5.webContents.isDestroyed()) {
        let _0x57ede1 = _0x4e726a;
        try {
          if (typeof structuredClone === "function") {
            _0x57ede1 = structuredClone(_0x4e726a);
          } else {
            _0x57ede1 = JSON.parse(JSON.stringify(_0x4e726a));
          }
        } catch (_0x189b70) {
          console.warn("[Main] 子视图任务含不可克隆字段，已做 JSON 降级净化: " + _0x189b70.message);
          try {
            _0x57ede1 = JSON.parse(JSON.stringify(_0x4e726a));
          } catch (_0x4e6993) {
            _0x57ede1 = {
              viewKey: _0x4cdb97,
              interactionId: _0x3dae76,
              batchRunId: _0x4e726a?.batchRunId,
              createdAt: Date.now(),
              lead: _0x4e726a?.lead ? {
                nickname: _0x4e726a.lead.nickname,
                leadId: _0x4e726a.lead.leadId
              } : undefined,
              canFollow: !!_0x4e726a?.canFollow,
              canDM: !!_0x4e726a?.canDM,
              canCommentFirstWork: !!_0x4e726a?.canCommentFirstWork,
              commentOnProfileFirstWork: !!_0x4e726a?.commentOnProfileFirstWork || !!_0x4e726a?.canCommentFirstWork,
              profileFirstWorkLikePercent: Number.isFinite(Number(_0x4e726a?.profileFirstWorkLikePercent)) ? Math.max(0, Math.min(100, Math.round(Number(_0x4e726a.profileFirstWorkLikePercent)))) : 10,
              profileFirstWorkCollectPercent: Number.isFinite(Number(_0x4e726a?.profileFirstWorkCollectPercent)) ? Math.max(0, Math.min(100, Math.round(Number(_0x4e726a.profileFirstWorkCollectPercent)))) : 10,
              enableWarmup: !!_0x4e726a?.enableWarmup,
              followDmDelayMin: _0x4e726a?.followDmDelayMin,
              followDmDelayMax: _0x4e726a?.followDmDelayMax,
              useRandomSuffix: !!_0x4e726a?.useRandomSuffix,
              dmUseRandomSuffix: !!_0x4e726a?.dmUseRandomSuffix,
              genderFilter: _0x4e726a?.genderFilter || "all",
              profileFirstGenderFilter: _0x4e726a?.profileFirstGenderFilter || "all",
              profileFirstAgeFilterEnabled: _0x4e726a?.profileFirstAgeFilterEnabled === true,
              profileFirstAgeMin: _0x4e726a?.profileFirstAgeMin,
              profileFirstAgeMax: _0x4e726a?.profileFirstAgeMax,
              ageFilterEnabled: _0x4e726a?.ageFilterEnabled === true,
              ageMin: _0x4e726a?.ageMin,
              ageMax: _0x4e726a?.ageMax,
              dmContent: _0x4e726a?.dmContent || "",
              dmTarget: _0x4e726a?.dmTarget === "followed_only" ? "followed_only" : "all",
              commentTemplate: _0x4e726a?.commentTemplate || "",
              commentContent: _0x4e726a?.commentContent || "",
              commentUseRandomSuffix: !!_0x4e726a?.commentUseRandomSuffix,
              videoCommentContent: _0x4e726a?.videoCommentContent || "",
              videoCommentMode: _0x4e726a?.videoCommentMode || "",
              videoCommentUseRandomSuffix: !!_0x4e726a?.videoCommentUseRandomSuffix,
              batchProfileCommentUseAi: !!_0x4e726a?.batchProfileCommentUseAi,
              profileFirstCommentUseAi: !!_0x4e726a?.profileFirstCommentUseAi,
              aiReplyMode: !!_0x4e726a?.aiReplyMode,
              aiRole: _0x4e726a?.aiRole || "",
              aiGoal: _0x4e726a?.aiGoal || "",
              aiStyle: _0x4e726a?.aiStyle || "",
              aiPrompt: _0x4e726a?.aiPrompt || "",
              firstPostGoal: _0x4e726a?.firstPostGoal || "",
              firstPostStyle: _0x4e726a?.firstPostStyle || "",
              firstPostPrompt: _0x4e726a?.firstPostPrompt || "",
              videoGoal: _0x4e726a?.videoGoal || "",
              videoStyle: _0x4e726a?.videoStyle || "",
              videoPrompt: _0x4e726a?.videoPrompt || "",
              batchConfig: _0x4e726a?.batchConfig,
              enableCommentMention: !!_0x4e726a?.enableCommentMention,
              commentMentionNicknames: _0x4e726a?.commentMentionNicknames || "",
              commentMentionPosition: _0x4e726a?.commentMentionPosition || "before",
              commentMentionPercent: Number.isFinite(Number(_0x4e726a?.commentMentionPercent)) ? Math.max(0, Math.min(100, Math.round(Number(_0x4e726a.commentMentionPercent)))) : 100,
              enableVideoCommentMention: !!_0x4e726a?.enableVideoCommentMention,
              videoCommentMentionNicknames: _0x4e726a?.videoCommentMentionNicknames || "",
              videoCommentMentionPosition: _0x4e726a?.videoCommentMentionPosition || "before",
              videoCommentMentionPercent: Number.isFinite(Number(_0x4e726a?.videoCommentMentionPercent)) ? Math.max(0, Math.min(100, Math.round(Number(_0x4e726a.videoCommentMentionPercent)))) : 100,
              enableCommentExpression: !!_0x4e726a?.enableCommentExpression,
              commentExpressionCount: _0x4e726a?.commentExpressionCount || 3,
              enableCommentImage: !!_0x4e726a?.enableCommentImage,
              commentImagePaths: _0x4e726a?.commentImagePaths || [],
              commentImagePath: _0x4e726a?.commentImagePath || "",
              enableCommentWithoutText: !!_0x4e726a?.enableCommentWithoutText,
              commentAttachmentPercent: Number.isFinite(Number(_0x4e726a?.commentAttachmentPercent)) ? Number(_0x4e726a.commentAttachmentPercent) : 20,
              enableVideoCommentExpression: !!_0x4e726a?.enableVideoCommentExpression,
              videoCommentExpressionCount: _0x4e726a?.videoCommentExpressionCount || 3,
              enableVideoCommentImage: !!_0x4e726a?.enableVideoCommentImage,
              videoCommentImagePaths: _0x4e726a?.videoCommentImagePaths || []
            };
          }
        }
        _0x53e425 = true;
        _0x183da5.webContents.send("interaction-prepare-task", _0x57ede1);
      }
    };
    if (_0x1c8ad3) {
      _0x1c8ad3.loadListener = _0x507ea1;
    }
    _0x183da5.webContents.once("did-finish-load", _0x507ea1);
    try {
      if (!_0x183da5.webContents.isDestroyed()) {
        _0x183da5.webContents.send("interaction-preempt", {
          viewKey: _0x4cdb97,
          url: _0x2045be,
          interactionId: _0x3dae76
        });
      }
    } catch (_0x48d3ac) {}
    try {
      if (!_0x183da5.webContents.isDestroyed()) {
        _0x183da5.webContents.stop();
      }
    } catch (_0x2a4591) {}
    _0x183da5.webContents.loadURL(_0x2045be).catch(_0x2b3693 => {
      console.warn("[Main] [子视图模式] 互动视图加载失败: " + _0x2b3693.message);
      const _0x1b976a = _0x2e19b0.get(_0x4cdb97);
      if (!_0x1b976a || _0x1b976a.interactionId !== _0x3dae76) {
        return;
      }
      const _0x5be252 = _0x2e6906().get(_0x4cdb97);
      if (_0x5be252 && _0x197a48?.isBatchAction && _0x5be252.runId === _0x3c18e0) {
        const _0x228120 = "页面加载失败: " + (_0x2b3693.message || "loadURL failed");
        Promise.resolve(_0x3b2d0d(_0x4cdb97, _0x5be252, {
          success: false,
          error: _0x228120
        }, _0x183da5.webContents)).then(_0x400ea2 => {
          if (_0x400ea2 !== "retry-scheduled") {
            _0x4732a0(_0x4cdb97, {
              followed: false,
              messaged: false,
              error: _0x228120
            }, "load-failed");
          }
        }).catch(() => {
          _0x4732a0(_0x4cdb97, {
            followed: false,
            messaged: false,
            error: _0x228120
          }, "load-failed");
        });
      }
    });
    return true;
  }
  function _0x2d4784(_0x28b2af, _0x7c98b6) {
    return _0x28b2af + "_" + _0x7c98b6;
  }
  function _0x18d9a3(_0x532fe5, _0x3ff473, _0x16244b = "unknown") {
    const _0xefb780 = _0x2d4784(_0x532fe5, _0x3ff473);
    let _0x135a1d;
    try {
      _0x135a1d = _0x145c77(_0x532fe5, _0x3ff473);
    } catch (_0x2b4f07) {
      _0x135a1d = Promise.reject(_0x2b4f07);
    }
    Promise.resolve(_0x135a1d).then(() => {
      _0x1b5a42.delete(_0xefb780);
    }).catch(_0x3d1d4c => {
      const _0x3345d4 = (_0x1b5a42.get(_0xefb780) || 0) + 1;
      _0x1b5a42.set(_0xefb780, _0x3345d4);
      console.error("[Batch] [" + _0x532fe5 + "] 下一条调度异常 (" + _0x16244b + ", 第" + _0x3345d4 + "次):", _0x3d1d4c);
      const _0x218903 = _0x532fe5.includes("_") ? _0x532fe5.split("_").slice(1).join("_") : "default";
      _0x47064a("⚠️ 批量调度异常，2 秒后自动恢复（" + (_0x3d1d4c?.message || "未知错误") + "）", _0x218903);
      if (_0x411698 || _0x3c18e0 !== _0x3ff473 || !_0x533b89(_0x532fe5)) {
        return;
      }
      setTimeout(() => _0x18d9a3(_0x532fe5, _0x3ff473, "auto-retry"), 2000);
    });
  }
  async function _0x145c77(_0x4cda8c, _0x2097e9 = _0x3c18e0) {
    const _0x4121c3 = _0x203fb0();
    const _0x5e46b2 = _0x429dfe();
    const _0x153b2a = _0x199df4();
    const _0x4a058f = _0x2e6906();
    const _0x407e11 = _0x42dad6();
    if (_0x2097e9 !== _0x3c18e0) {
      console.log("[Batch] 忽略过期批量代次回调 (" + _0x4cda8c + ")");
      return;
    }
    if (_0x411698) {
      console.log("[Batch] 停止信号已触发，清空队列 (" + _0x4cda8c + ")");
      _0x4121c3.delete(_0x4cda8c);
      _0x5e46b2.set(_0x4cda8c, false);
      _0x153b2a.delete(_0x4cda8c);
      _0x49cbc9(_0x4cda8c, "manual_stop");
      const _0x5cdec5 = _0x4cda8c.includes("_") ? _0x4cda8c.split("_").slice(1).join("_") : null;
      if (_0x407e11) {
        _0x407e11.webContents.send("batch-account-finished", {
          viewKey: _0x4cda8c,
          accountId: _0x5cdec5,
          reason: "manual_stop"
        });
        _0x407e11.webContents.send("view-batch-status", {
          viewKey: _0x4cda8c,
          isRunning: false
        });
      }
      return;
    }
    _0x105f1f(_0x4cda8c);
    const _0x15c5a6 = _0x4a058f.get(_0x4cda8c);
    if (_0x15c5a6 && _0x15c5a6.runId === _0x2097e9) {
      console.log("[Batch] [" + _0x4cda8c + "] 当前条仍在执行，忽略重复的下一条调度");
      return;
    }
    const _0x19951e = _0x4121c3.get(_0x4cda8c);
    if (!_0x19951e || _0x19951e.length === 0) {
      console.log("[Batch] 视图 " + _0x4cda8c + " 的批量任务已全部完成");
      _0x5e46b2.set(_0x4cda8c, false);
      _0x4121c3.delete(_0x4cda8c);
      _0x153b2a.delete(_0x4cda8c);
      _0x1b5a42.delete(_0x2d4784(_0x4cda8c, _0x2097e9));
      _0x562fd7(_0x4cda8c, _0x2097e9);
      _0x49cbc9(_0x4cda8c, "batch_completed");
      const _0x51bf1a = _0x4cda8c.includes("_") ? _0x4cda8c.split("_").slice(1).join("_") : null;
      if (_0x407e11) {
        _0x407e11.webContents.send("batch-account-finished", {
          viewKey: _0x4cda8c,
          accountId: _0x51bf1a,
          reason: "batch_completed"
        });
        _0x407e11.webContents.send("view-batch-status", {
          viewKey: _0x4cda8c,
          isRunning: false
        });
        _0x407e11.webContents.send("new-status", "[Batch] 视图 " + _0x4cda8c + " 批量任务处理完毕");
        const _0x41b817 = Array.from(_0x5e46b2.values()).some(Boolean);
        if (!_0x41b817) {
          try {
            _0x4e7042.finalizeBatchRun(_0x2097e9, "completed");
          } catch (_0x31c003) {}
          _0x54648b(_0x2097e9, {
            message: "批量跟进已完成：成功 " + (_0x828cc1.success || 0) + "，失败 " + (_0x828cc1.failed || 0) + "，跳过 " + (_0x828cc1.skipped || 0),
            level: "success",
            phase: "run",
            viewKey: _0x4cda8c,
            accountId: _0x51bf1a || ""
          });
          _0x407e11.webContents.send("batch-task-complete", {
            runId: _0x2097e9
          });
        }
      }
      _0xdc2c01?.({
        force: true
      });
      return;
    }
    _0x5e46b2.set(_0x4cda8c, true);
    if (_0x407e11) {
      _0x407e11.webContents.send("view-batch-status", {
        viewKey: _0x4cda8c,
        isRunning: true
      });
    }
    const _0x20b628 = _0x19951e[0];
    const {
      lead: _0x44115d,
      config: _0x3362ed
    } = _0x20b628;
    let _0x321573 = _0x3193d5().get(_0x4cda8c);
    const _0x3748dc = _0x4cda8c.split("_")[0];
    if (!_0x321573) {
      console.log("[Batch] 视图 " + _0x4cda8c + " 不存在，正在初始化并等待...");
      _0x5d13ef({
        accountId: _0x44115d.accountId,
        accountName: _0x44115d.accountName
      }, _0x3748dc);
      setTimeout(() => _0x18d9a3(_0x4cda8c, _0x2097e9, "wait-view-init"), 5000);
      return;
    }
    _0x153b2a.set(_0x4cda8c, _0x2097e9);
    console.log("[Batch] [" + _0x4cda8c + "] 正在处理: " + _0x44115d.nickname + ", 动作: " + _0x3362ed.type);
    if (_0x1a7ce9(_0x44115d)) {
      _0x19951e.shift();
      const _0x2d0b84 = _0x44115d.profileUnavailableReason || _0x44115d.lastBatchSkipReason || BATCH_USER_GONE_REASON;
      console.warn("[Batch] [" + _0x4cda8c + "] @" + (_0x44115d.nickname || "未知") + " 已标记" + _0x2d0b84 + "，跳过开主页");
      _0x4a058f.delete(_0x4cda8c);
      _0x38898c({
        sender: _0x321573?.webContents || null
      }, {
        leadId: _0x44115d.leadId,
        accountId: _0x44115d.accountId,
        leadName: _0x44115d.nickname,
        leadPlatform: _0x44115d.platform,
        accountName: _0x44115d.accountName,
        success: false,
        skipped: true,
        skipReason: _0x2d0b84,
        error: _0x2d0b84,
        type: _0x3362ed.type,
        interactionResults: {
          skipped: true,
          skipReason: _0x2d0b84,
          userGone: true,
          profileUnavailable: true,
          profileUnavailableReason: _0x2d0b84
        }
      }, _0x2097e9, _0x4cda8c);
      return;
    }
    const _0x324f4c = _0x44115d.userUrl;
    if (!_0x324f4c) {
      _0x19951e.shift();
      console.error("[Batch] 线索 " + _0x44115d.nickname + " 缺失用户主页链接，跳过");
      _0x828cc1.current += 1;
      if (_0x828cc1.total > 0) {
        _0x828cc1.current = Math.min(_0x828cc1.current, _0x828cc1.total);
      }
      _0x828cc1.failed += 1;
      if (_0x372db0() && _0x44115d.leadId) {
        const _0x33a83d = dbManager.setLeadLastBatchFollowResult(_0x44115d.leadId, {
          status: "failed",
          message: "缺失主页链接",
          at: Date.now(),
          type: _0x3362ed.type,
          runId: _0x2097e9
        });
        if (!_0x33a83d) {
          console.warn("[Batch] 最近跟进结果回写失败 leadId=" + _0x44115d.leadId + "（缺失主页链接）");
        }
      }
      try {
        _0x4e7042.appendBatchRunResult(_0x2097e9, {
          leadId: _0x44115d.leadId,
          accountId: _0x44115d.accountId,
          success: false,
          error: "缺失主页链接",
          type: _0x3362ed.type,
          leadName: _0x44115d.nickname || "未知",
          leadPlatform: _0x44115d.platform,
          accountName: _0x44115d.accountName || "主账号",
          ..._0x1831a2(_0x44115d),
          time: new Date().toLocaleTimeString(),
          viewKey: _0x4cda8c
        }, _0x828cc1);
      } catch (_0x18d673) {}
      if (_0x407e11) {
        _0x407e11.webContents.send("batch-item-result", {
          leadId: _0x44115d.leadId,
          accountId: _0x44115d.accountId,
          success: false,
          error: "缺失主页链接",
          type: _0x3362ed.type,
          leadName: _0x44115d.nickname || "未知",
          leadPlatform: _0x44115d.platform,
          accountName: _0x44115d.accountName || "主账号",
          time: new Date().toLocaleTimeString(),
          viewKey: _0x4cda8c,
          runId: _0x2097e9
        });
        _0x407e11.webContents.send("batch-task-progress", {
          ..._0x828cc1,
          lastLeadName: _0x44115d.nickname || "未知",
          lastAction: _0x3362ed.type,
          status: _0x828cc1.total > 0 && _0x828cc1.current >= _0x828cc1.total ? "completed" : "executing"
        });
      }
      _0x18d9a3(_0x4cda8c, _0x2097e9, "missing-profile-url");
      return;
    }
    if (_0x407e11) {
      _0x407e11.webContents.send("new-log", "[批量跟进] [" + _0x4cda8c + "] 正在处理: " + _0x44115d.nickname + " (" + _0x3362ed.type + ")");
      _0x407e11.webContents.send("batch-item-start", {
        leadId: _0x44115d.leadId,
        accountId: _0x44115d.accountId,
        accountName: _0x44115d.accountName,
        leadName: _0x44115d.nickname,
        type: _0x3362ed.type,
        viewKey: _0x4cda8c,
        runId: _0x2097e9
      });
      _0x407e11.webContents.send("batch-task-progress", {
        ..._0x828cc1,
        lastLeadName: _0x44115d.nickname || "未知",
        lastAction: _0x3362ed.type,
        status: "executing",
        runId: _0x2097e9
      });
    }
    _0x54648b(_0x2097e9, {
      message: "开始处理 @" + (_0x44115d.nickname || "未知") + "（" + _0x3362ed.type + "）",
      level: "info",
      accountId: _0x44115d.accountId,
      accountName: _0x44115d.accountName || "",
      viewKey: _0x4cda8c,
      leadId: _0x44115d.leadId,
      leadName: _0x44115d.nickname || "",
      phase: "item"
    });
    console.log("[Batch] [" + _0x4cda8c + "] 正在切换至批量任务模式，停止原获客循环");
    _0x57e918().delete(_0x4cda8c);
    _0x5d5b96?.(_0x4cda8c, null);
    _0x321573.webContents.send("control-task", {
      type: "STOP_TASK"
    });
    if (!_0x1485dd(_0x4cda8c)) {
      if (_0x5eff65()) {
        _0x1b54ab(_0x4cda8c, _0x321573);
      } else {
        _0x232da4(_0x4cda8c, _0x321573);
      }
    }
    const _0x29cd3f = _0x21f742(_0x4cda8c);
    if (!_0x29cd3f) {
      _0x19951e.shift();
      console.error("[Batch] 无法创建互动子视图: " + _0x4cda8c + "，跳过本条");
      _0x3b2d0d(_0x4cda8c, {
        lead: _0x44115d,
        config: _0x3362ed,
        runId: _0x2097e9
      }, {
        success: false,
        error: "互动子视图创建失败"
      }, _0x321573.webContents);
      return;
    }
    _0x4a058f.set(_0x4cda8c, {
      lead: _0x44115d,
      config: _0x3362ed,
      runId: _0x2097e9
    });
    const _0xdc4230 = {
      ..._0x38897d(_0x44115d, _0x3362ed, _0x4cda8c),
      batchRunId: _0x2097e9
    };
    const _0x2b3a2f = _0x4776e5(_0x324f4c);
    console.log("[Batch] [" + _0x4cda8c + "] 子视图跟进（同自动获客 interaction-start）: " + _0x44115d.nickname + " (" + _0x3362ed.type + ")");
    let _0x3ea9ca = false;
    try {
      _0x3ea9ca = _0x59dee3(_0x4cda8c, _0x2b3a2f, _0xdc4230);
    } catch (_0x5a5250) {
      console.error("[Batch] [" + _0x4cda8c + "] 子视图启动异常:", _0x5a5250);
    }
    _0x19951e.shift();
    if (!_0x3ea9ca) {
      _0x4a058f.delete(_0x4cda8c);
      try {
        _0x3c3c85(_0x4cda8c, null, {
          force: true
        });
      } catch (_0x5d003d) {}
      _0x3b2d0d(_0x4cda8c, {
        lead: _0x44115d,
        config: _0x3362ed,
        runId: _0x2097e9
      }, {
        success: false,
        error: "子视图切换失败"
      }, _0x29cd3f.webContents);
    }
  }
  function _0x38898c(_0x24c577, _0x18905c, _0x70feb2 = _0x3c18e0, _0x5509c5 = null) {
    const {
      leadId: _0x1b65bf,
      accountId: _0x5d8275,
      success: _0x234b10,
      type: _0x396668,
      error: _0x294404,
      leadName: _0x796b58,
      leadPlatform: _0x1938e3,
      accountName: _0x1a9d8e,
      skipped: _0x14bbf3,
      skipReason: _0xf9861e,
      interactionResults: _0x350c6c,
      userUrl: _0x2045cd,
      secUid: _0x74317a,
      profileUrl: _0x25549e
    } = _0x18905c;
    const _0x19a0a3 = _0x5509c5 || _0x3f0eea(_0x24c577?.sender);
    if (!_0x19a0a3) {
      console.warn("[Batch] 无法解析 viewKey，丢弃完成回调 lead=" + (_0x796b58 || _0x1b65bf || "?"));
      return;
    }
    const _0x184382 = _0x2e6906();
    if (_0x184382.has(_0x19a0a3)) {
      _0x184382.delete(_0x19a0a3);
      _0x4732a0(_0x19a0a3, _0x350c6c || _0x18905c, "batch-done");
    }
    const _0x4259eb = _0x199df4().get(_0x19a0a3);
    if (_0x4259eb !== _0x70feb2) {
      console.log("[Batch] 忽略过期任务的完成回调 (" + _0x19a0a3 + ", run " + _0x4259eb + " vs " + _0x70feb2 + ")");
      return;
    }
    if (_0x350c6c) {
      let _0xb3f36f = 0;
      let _0x1133e2 = [];
      if (fs.existsSync(_0x173215)) {
        try {
          const _0x37da70 = fs.readFileSync(_0x173215, "utf8");
          const _0x3cf7d4 = crypto.createDecipheriv("aes-256-cbc", _0x379978, _0x2c1ede);
          let _0x2c4994 = _0x3cf7d4.update(_0x37da70, "hex", "utf8");
          _0x2c4994 += _0x3cf7d4.final("utf8");
          _0x1133e2 = JSON.parse(_0x2c4994);
        } catch (_0x58462b) {
          console.error("[Main] History parse error in batch sync", _0x58462b);
        }
      }
      _0x1133e2.forEach(_0x5bd0dc => {
        if (!_0x5bd0dc.items) {
          return;
        }
        const _0x1ea5e8 = _0x5bd0dc.items.find(_0x572a68 => _0x572a68.leadId === _0x1b65bf || _0x572a68.nickname === _0x796b58 && _0x572a68.platform === _0x1938e3 || _0x572a68.nickname === _0x796b58 && String(_0x572a68.platform || "").toLowerCase() === String(_0x1938e3 || "").toLowerCase());
        if (_0x1ea5e8) {
          _0x1ea5e8.actions = _0x1ea5e8.actions || {};
          if (_0x350c6c.followed) {
            _0x1ea5e8.followed = true;
            _0x1ea5e8.actions.followed = true;
          }
          if (_0x350c6c.messaged) {
            _0x1ea5e8.messaged = true;
            _0x1ea5e8.actions.messaged = true;
            if (_0x350c6c.dmContent) {
              _0x1ea5e8.dmContent = _0x350c6c.dmContent;
              _0x1ea5e8.actions.dmContent = _0x350c6c.dmContent;
            }
          }
          if (_0x350c6c.profileCommented) {
            _0x1ea5e8.replied = true;
            _0x1ea5e8.actions.profileWorkCommented = true;
            if (_0x350c6c.replyContent) {
              _0x1ea5e8.replyContent = _0x350c6c.replyContent;
              _0x1ea5e8.actions.replyContent = _0x350c6c.replyContent;
            }
          }
          if (_0x350c6c.touchCounts) {
            _0x1ea5e8.touchCounts = {
              ...(_0x1ea5e8.touchCounts || {}),
              ..._0x350c6c.touchCounts
            };
          } else {
            _0x1ea5e8.touchCounts = _0x1ea5e8.touchCounts || {
              like: 0,
              reply: 0,
              follow: 0,
              message: 0,
              profileComment: 0
            };
            if (_0x350c6c.followed) {
              _0x1ea5e8.touchCounts.follow = Math.max(1, Number(_0x1ea5e8.touchCounts.follow || 0));
            }
            if (_0x350c6c.messaged) {
              _0x1ea5e8.touchCounts.message = Math.max(1, Number(_0x1ea5e8.touchCounts.message || 0));
            }
            if (_0x350c6c.profileCommented) {
              _0x1ea5e8.touchCounts.profileComment = Math.max(1, Number(_0x1ea5e8.touchCounts.profileComment || 0));
            }
          }
          if (_0x350c6c.touchLog) {
            _0x1ea5e8.touchLog = _0x350c6c.touchLog;
          }
          if (_0x350c6c.profileCommentAt) {
            _0x1ea5e8.profileCommentAt = Number(_0x350c6c.profileCommentAt);
          }
          if (_0x350c6c.lastTouchAt) {
            _0x1ea5e8.lastTouchAt = Math.max(Number(_0x1ea5e8.lastTouchAt || 0), Number(_0x350c6c.lastTouchAt || 0));
          } else if (_0x350c6c.messaged || _0x350c6c.followed || _0x350c6c.profileCommented) {
            _0x1ea5e8.lastTouchAt = Date.now();
          }
          if (_0x350c6c.worksCount !== undefined && _0x350c6c.worksCount !== null) {
            _0x1ea5e8.worksCount = _0x350c6c.worksCount;
            if (Number(_0x350c6c.worksCount) === 0) {
              _0x1ea5e8.noWorks = true;
            }
          }
          if (_0x350c6c.noWorks) {
            _0x1ea5e8.noWorks = true;
          }
          if (_0x350c6c.isPrivate !== undefined) {
            _0x1ea5e8.isPrivate = _0x350c6c.isPrivate;
          }
          if (_0x350c6c.userGone || _0x350c6c.profileUnavailable) {
            _0x1ea5e8.userGone = true;
            _0x1ea5e8.profileUnavailable = true;
            _0x1ea5e8.profileUnavailableReason = _0x350c6c.profileUnavailableReason || _0x350c6c.skipReason || BATCH_USER_GONE_REASON;
          }
          if (_0x350c6c.skipReason) {
            _0x1ea5e8.lastBatchSkipReason = _0x350c6c.skipReason;
          }
          if (_0x350c6c.location) {
            _0x1ea5e8.location = _0x350c6c.location;
          }
          if (_0x350c6c.douyinId) {
            _0x1ea5e8.douyinId = _0x350c6c.douyinId;
          }
          if (_0x350c6c.gender) {
            _0x1ea5e8.gender = _0x350c6c.gender;
          }
          if (_0x350c6c.signature) {
            _0x1ea5e8.signature = _0x350c6c.signature;
          }
          if (_0x350c6c.contact) {
            _0x1ea5e8.contact = _0x350c6c.contact;
          }
          _0xb3f36f++;
        }
      });
      if (_0xb3f36f > 0) {
        console.log("[Batch] 已同步 " + _0xb3f36f + " 条历史记录中的线索状态");
        try {
          const _0x92604d = JSON.stringify(_0x1133e2);
          const _0x5afbcc = crypto.createCipheriv("aes-256-cbc", _0x379978, _0x2c1ede);
          let _0x4def2f = _0x5afbcc.update(_0x92604d, "utf8", "hex");
          _0x4def2f += _0x5afbcc.final("hex");
          fs.writeFileSync(_0x173215, _0x4def2f);
        } catch (_0x1320d8) {
          console.error("[Main] History save error in batch sync", _0x1320d8);
        }
      }
    }
    if (_0x350c6c && (_0x350c6c.userGone || _0x350c6c.profileUnavailable || _0x350c6c.noWorks || _0x350c6c.isPrivate !== undefined || _0x350c6c.worksCount !== undefined && _0x350c6c.worksCount !== null) && _0x372db0() && _0x1b65bf) {
      try {
        let _0x2aea57 = dbManager.getLeadById(_0x1b65bf) || dbManager.getLeadByUserKey(_0x1b65bf);
        if (!_0x2aea57) {
          const _0x12051b = dbManager.findLeadRowId({
            leadId: _0x1b65bf,
            key: _0x1b65bf,
            nickname: _0x796b58,
            platform: _0x1938e3,
            worksCount: _0x350c6c.worksCount,
            noWorks: _0x350c6c.noWorks,
            isPrivate: _0x350c6c.isPrivate,
            userGone: _0x350c6c.userGone
          });
          if (_0x12051b) {
            _0x2aea57 = dbManager.getLeadById(_0x12051b);
          }
        }
        if (_0x2aea57) {
          if (_0x350c6c.userGone || _0x350c6c.profileUnavailable) {
            _0x2aea57.userGone = true;
            _0x2aea57.profileUnavailable = true;
            _0x2aea57.profileUnavailableReason = _0x350c6c.profileUnavailableReason || _0x350c6c.skipReason || BATCH_USER_GONE_REASON;
            _0x2aea57.lastBatchSkipReason = _0x350c6c.skipReason || _0x2aea57.profileUnavailableReason;
          }
          if (_0x350c6c.worksCount !== undefined && _0x350c6c.worksCount !== null) {
            _0x2aea57.worksCount = _0x350c6c.worksCount;
            if (Number(_0x350c6c.worksCount) === 0) {
              _0x2aea57.noWorks = true;
            }
          }
          if (_0x350c6c.noWorks) {
            _0x2aea57.noWorks = true;
          }
          if (_0x350c6c.isPrivate !== undefined) {
            _0x2aea57.isPrivate = !!_0x350c6c.isPrivate;
          }
          if (_0x350c6c.skipReason) {
            _0x2aea57.lastBatchSkipReason = _0x350c6c.skipReason;
          }
          dbManager.upsertLead(_0x2aea57);
        } else {
          console.warn("[Batch] SQLite 未找到线索行，账号标记未落库 leadId=" + _0x1b65bf + " name=" + (_0x796b58 || ""));
        }
      } catch (_0x2d084d) {
        console.warn("[Batch] SQLite 回写账号标记失败:", _0x2d084d?.message || _0x2d084d);
      }
    }
    console.log("[Batch] 动作反馈: leadId=" + _0x1b65bf + ", success=" + _0x234b10 + ", error=" + (_0x294404 || "无"));
    const _0x2b160b = _0x5d8275 || (_0x19a0a3.includes("_") ? _0x19a0a3.split("_").slice(1).join("_") : "default");
    const _0x5cb84b = _0xf9861e || _0x294404 || _0x350c6c?.skipReason || "";
    const _0x43b6c3 = _0x1fe2fa(_0x5cb84b, {
      ...(_0x350c6c || {}),
      noWorks: !!_0x350c6c?.noWorks || !!_0x18905c?.noWorks,
      isPrivate: !!_0x350c6c?.isPrivate || !!_0x18905c?.isPrivate,
      skipped: !!_0x14bbf3 || !!_0x350c6c?.skipped,
      profileFirstTargetFiltered: !!_0x350c6c?.profileFirstTargetFiltered || !!_0x18905c?.profileFirstTargetFiltered,
      demographicFilterFailed: !!_0x350c6c?.demographicFilterFailed || !!_0x18905c?.demographicFilterFailed
    });
    const _0x263328 = !_0x43b6c3 && (!!_0x14bbf3 || !!_0x350c6c && !!_0x350c6c.skipped);
    const _0x1402b0 = !_0x43b6c3 && !_0x263328 && !!_0x234b10;
    _0x828cc1.current += 1;
    if (_0x828cc1.total > 0) {
      _0x828cc1.current = Math.min(_0x828cc1.current, _0x828cc1.total);
    }
    if (_0x263328) {
      _0x828cc1.skipped = (_0x828cc1.skipped || 0) + 1;
    } else if (_0x1402b0) {
      _0x828cc1.success += 1;
    } else {
      _0x828cc1.failed += 1;
    }
    const _0x304e09 = _0x57e918();
    const _0x50760a = _0x1a9d8e || _0x304e09.get(_0x19a0a3 + "_nickname") || _0x304e09.get(_0x19a0a3 + "_name") || "主账号";
    const _0x47f93a = "DY";
    const _0x104e15 = _0x304e09.get(_0x19a0a3 + "_platform") || "";
    const _0x1809dc = _0x104e15 === "xianyu" || _0x19a0a3.toLowerCase().startsWith("xianyu") ? "XY" : "DY";
    const _0x3578aa = _0x43b6c3 ? _0x5cb84b || _0x294404 || "筛选不符" : _0x294404;
    const _0x1caf27 = {
      leadId: _0x1b65bf,
      accountId: _0x2b160b,
      success: _0x1402b0,
      skipped: _0x263328,
      skipReason: _0x263328 ? _0xf9861e || _0x350c6c && _0x350c6c.skipReason || "" : "",
      type: _0x396668,
      error: _0x3578aa,
      leadName: _0x796b58 || "未知",
      leadPlatform: _0x47f93a,
      accountName: _0x50760a,
      platform: _0x1809dc,
      ..._0x1831a2({
        leadId: _0x1b65bf,
        userUrl: _0x2045cd || _0x25549e || "",
        secUid: _0x74317a || ""
      }),
      time: new Date().toLocaleTimeString(),
      viewKey: _0x19a0a3,
      interactionResults: _0x350c6c,
      runId: _0x70feb2
    };
    if (_0x372db0() && _0x1b65bf) {
      const _0xb53596 = _0x1402b0 ? "执行成功（" + (_0x396668 || "批量跟进") + "）" : _0x263328 ? "已跳过：" + (_0x1caf27.skipReason || _0x3578aa || "条件不符") : _0x3578aa || "执行失败";
      const _0x45e954 = dbManager.setLeadLastBatchFollowResult(_0x1b65bf, {
        status: _0x1402b0 ? "success" : "failed",
        message: _0xb53596,
        at: Date.now(),
        type: _0x396668,
        runId: _0x70feb2
      });
      if (!_0x45e954) {
        console.warn("[Batch] 最近跟进结果回写失败 leadId=" + _0x1b65bf + " name=" + (_0x796b58 || ""));
      }
    }
    try {
      const {
        interactionResults: _0x516266,
        ..._0x209d1d
      } = _0x1caf27;
      _0x4e7042.appendBatchRunResult(_0x70feb2, _0x209d1d, _0x828cc1);
    } catch (_0x107eca) {}
    const _0xef6ea = _0x263328 ? "已跳过 @" + (_0x796b58 || "未知") + "（" + (_0x1caf27.skipReason || "条件不符") + "）" : _0x1402b0 ? "完成 @" + (_0x796b58 || "未知") + "（" + (_0x396668 || "跟进") + "）" : "失败 @" + (_0x796b58 || "未知") + "：" + (_0x3578aa || "未知错误");
    _0x54648b(_0x70feb2, {
      message: _0xef6ea,
      level: _0x263328 ? "warning" : _0x1402b0 ? "success" : "error",
      accountId: _0x2b160b,
      accountName: _0x50760a,
      viewKey: _0x19a0a3,
      leadId: _0x1b65bf,
      leadName: _0x796b58 || "",
      phase: "result"
    });
    const _0x14b820 = _0x42dad6();
    if (_0x14b820) {
      _0x14b820.webContents.send("batch-item-result", _0x1caf27);
      _0x14b820.webContents.send("batch-task-progress", {
        ..._0x828cc1,
        lastLeadName: _0x796b58 || "未知",
        lastAction: _0x396668,
        status: _0x828cc1.total > 0 && _0x828cc1.current >= _0x828cc1.total ? "completed" : "executing",
        runId: _0x70feb2
      });
    }
    const _0x34de89 = _0x203fb0().get(_0x19a0a3);
    const _0xc974e = _0x3c18e0;
    if (!_0x34de89 || _0x34de89.length === 0) {
      console.log("[Batch] 队列已空，立即收尾 (" + _0x19a0a3 + ")");
      _0x18d9a3(_0x19a0a3, _0xc974e, "queue-empty-finalize");
      return;
    }
    if (!_0x1402b0) {
      const _0x47c918 = Math.floor(Math.random() * 6 + 3) * 1000;
      console.log("[Batch] 任务判定为失败/过滤跳过，延迟 " + _0x47c918 / 1000 + " 秒后处理下一条 (" + _0x19a0a3 + ")");
      _0x47064a("⏳ 失败/跳过缓冲：等 " + _0x47c918 / 1000 + "s 后处理下一条", _0x2b160b, {
        runId: _0xc974e,
        viewKey: _0x19a0a3,
        phase: "delay",
        level: "warning",
        accountName: _0x50760a,
        leadName: _0x796b58 || ""
      });
      _0x3020a8(_0x19a0a3, _0xc974e, () => {
        if (!_0x411698 && _0x3c18e0 === _0xc974e) {
          _0x47064a("▶️ 失败/跳过缓冲结束，开始处理下一条", _0x2b160b, {
            runId: _0xc974e,
            viewKey: _0x19a0a3,
            phase: "delay",
            level: "info"
          });
          _0x18d9a3(_0x19a0a3, _0xc974e, "failed-item-delay");
        }
      }, _0x47c918);
      return;
    }
    const _0x46f791 = _0x34de89[0];
    const _0x4b3601 = _0x46f791?.config?.delayMin || 120;
    const _0x22a69c = _0x46f791?.config?.delayMax || 180;
    const _0x44b56d = Math.floor(Math.random() * (_0x22a69c - _0x4b3601 + 1) + _0x4b3601) * 1000;
    _0x5e3278({
      viewKeyFound: _0x19a0a3,
      accountId: _0x2b160b,
      finishedLeadName: _0x796b58,
      nextLeadName: _0x46f791?.lead?.nickname,
      delayMs: _0x44b56d,
      delayMin: _0x4b3601,
      delayMax: _0x22a69c,
      sender: _0x24c577.sender,
      scheduledRunId: _0xc974e
    });
  }
  function _0x3776dc(_0x3c7e0c, _0x5ecaf2 = "manual_stop") {
    if (!_0x3c7e0c || !_0x44fc67(_0x3c7e0c)) {
      return false;
    }
    const _0x1fb130 = _0x199df4();
    const _0x542785 = _0x203fb0();
    const _0x2f35ed = _0x2e6906();
    const _0x591fc7 = _0x429dfe();
    const _0x58d806 = _0x86f3df();
    const _0x3925a0 = _0x3a36f();
    const _0x497cf7 = _0x42dad6();
    const _0x51a7a6 = _0x1fb130.get(_0x3c7e0c) ?? _0x3c18e0;
    const _0x37971c = _0x542785.has(_0x3c7e0c) || _0x2f35ed.has(_0x3c7e0c) || _0x591fc7.get(_0x3c7e0c) || _0x1fb130.has(_0x3c7e0c);
    if (!_0x37971c) {
      return false;
    }
    console.log("[Batch] 停止单账号批量任务: " + _0x3c7e0c);
    _0x4676e6(_0x3c7e0c);
    _0x1b5a42.delete(_0x2d4784(_0x3c7e0c, _0x51a7a6));
    _0x542785.delete(_0x3c7e0c);
    _0x591fc7.set(_0x3c7e0c, false);
    _0x1fb130.delete(_0x3c7e0c);
    const _0xf0b058 = _0x2f35ed.get(_0x3c7e0c);
    if (_0xf0b058) {
      const _0x37167f = _0x58d806.get(_0x3c7e0c);
      try {
        if (_0x37167f && !_0x37167f.webContents.isDestroyed()) {
          _0x37167f.webContents.send("interaction-preempt", {
            viewKey: _0x3c7e0c,
            reason: _0x5ecaf2,
            cancelledBatchRunId: _0x51a7a6
          });
          _0x37167f.webContents.stop();
        }
      } catch (_0x221ba7) {
        console.warn("[Batch] [" + _0x3c7e0c + "] 取消互动失败: " + _0x221ba7.message);
      }
      _0x2f35ed.delete(_0x3c7e0c);
    }
    if (_0x3925a0.has(_0x3c7e0c)) {
      _0x4732a0(_0x3c7e0c, {
        error: "batch-account-stopped"
      }, _0x5ecaf2);
    }
    try {
      const _0x37fc89 = _0x3193d5().get(_0x3c7e0c);
      if (_0x37fc89 && !_0x37fc89.webContents.isDestroyed()) {
        _0x37fc89.webContents.send("control-task", {
          type: "CANCEL_WANDERING",
          payload: {
            reason: _0x5ecaf2,
            batchRunId: _0x51a7a6,
            viewKey: _0x3c7e0c
          }
        });
      }
    } catch (_0x5d2275) {
      console.warn("[Batch] [" + _0x3c7e0c + "] 取消拟人闲逛失败: " + _0x5d2275.message);
    }
    _0x49cbc9(_0x3c7e0c, _0x5ecaf2);
    const _0x255ea0 = _0x3c7e0c.includes("_") ? _0x3c7e0c.split("_").slice(1).join("_") : null;
    if (_0x497cf7 && !_0x497cf7.isDestroyed()) {
      _0x497cf7.webContents.send("batch-account-finished", {
        viewKey: _0x3c7e0c,
        accountId: _0x255ea0,
        reason: _0x5ecaf2,
        runId: _0x51a7a6
      });
      _0x497cf7.webContents.send("view-batch-status", {
        viewKey: _0x3c7e0c,
        isRunning: false
      });
      const _0x214efb = Array.from(_0x591fc7.values()).some(Boolean);
      if (!_0x214efb) {
        const _0x5d977e = _0x5ecaf2 === "manual_stop" ? "stopped" : "completed";
        try {
          _0x4e7042.finalizeBatchRun(_0x51a7a6, _0x5d977e);
        } catch (_0x78cd35) {}
        _0x54648b(_0x51a7a6, {
          message: _0x5d977e === "stopped" ? "批量跟进已停止" : "批量跟进已完成：成功 " + (_0x828cc1.success || 0) + "，失败 " + (_0x828cc1.failed || 0) + "，跳过 " + (_0x828cc1.skipped || 0),
          level: _0x5d977e === "stopped" ? "warning" : "success",
          phase: "run",
          viewKey: _0x3c7e0c,
          accountId: _0x255ea0 || ""
        });
        _0x497cf7.webContents.send("batch-task-complete", {
          runId: _0x51a7a6,
          status: _0x5d977e
        });
      }
    }
    _0xdc2c01?.();
    return true;
  }
  function _0x2848e7() {
    ipcMain.handle("get-batch-runtime-state", () => {
      const _0x4ba112 = new Set();
      _0x429dfe().forEach((_0x38a57e, _0x5be6e9) => {
        if (_0x38a57e) {
          _0x4ba112.add(_0x5be6e9);
        }
      });
      _0x203fb0().forEach((_0x2495e6, _0x352f6e) => {
        if (Array.isArray(_0x2495e6) && _0x2495e6.length > 0) {
          _0x4ba112.add(_0x352f6e);
        }
      });
      _0x2e6906().forEach((_0x45db86, _0x1c2bbb) => _0x4ba112.add(_0x1c2bbb));
      return {
        active: !_0x411698 && _0x4ba112.size > 0,
        runId: _0x3c18e0,
        runningViewKeys: [..._0x4ba112],
        progress: {
          ..._0x828cc1
        }
      };
    });
    ipcMain.on("start-batch-action", (_0x43284a, {
      leads: _0x5c2a52,
      config: _0xcfd3fa
    }) => {
      (async () => {
        const _0x227915 = _0x42dad6();
        if (_0x5b84f2()) {
          console.warn("[Auth-Shield] 拦截到未激活状态尝试启动批量操作！");
          if (_0x227915) {
            _0x227915.webContents.send("new-status", "[WARN] 未激活专业版不支持批量关注、私信、首作评论等操作，请激活后使用");
            _0x227915.webContents.send("batch-task-stopped");
          }
          return;
        }
        const _0x43fdd6 = await _0x137c25({
          allowDialogRetry: true
        });
        if (!_0x43fdd6.ok) {
          console.warn("[RuntimeConfig] 拦截批量跟进：运行配置未就绪");
          if (_0x227915 && !_0x227915.isDestroyed()) {
            _0x227915.webContents.send("new-status", "[WARN] " + (_0x43fdd6.reason || _0x2e4783));
            _0x227915.webContents.send("batch-task-stopped");
          }
          return;
        }
        const _0x2880e8 = _0x203fb0();
        const _0x3bec86 = _0x429dfe();
        const _0x4991e1 = _0x199df4();
        const _0x3df245 = _0x3c18e0;
        _0xe75fe9("batch-replaced", _0x3df245);
        _0x1bed5a("batch-replaced", _0x3df245);
        _0x3b4415();
        _0x411698 = false;
        _0xdc2c01?.({
          force: true
        });
        try {
          _0x4e7042.finalizeBatchRun(_0x3df245, "stopped");
        } catch (_0x3c0a8a) {}
        _0x3c18e0 += 1;
        const _0xc33ac0 = _0x3c18e0;
        _0x24247a = 0;
        _0x2880e8.clear();
        _0x3bec86.clear();
        _0x4991e1.clear();
        _0x1b5a42.clear();
        _0x32ff84.clear();
        _0x828cc1 = {
          total: _0x5c2a52.length,
          current: 0,
          success: 0,
          failed: 0,
          skipped: 0
        };
        if (_0xcfd3fa && typeof _0xcfd3fa === "object") {
          const _0x50d743 = Number(_0xcfd3fa.commentMentionPercent);
          _0xcfd3fa.commentMentionPercent = Number.isFinite(_0x50d743) ? Math.max(0, Math.min(100, Math.round(_0x50d743))) : 100;
        }
        console.log("[Batch] 收到批量任务请求, 线索量: " + _0x5c2a52.length + ", 类型: " + _0xcfd3fa.type + (", @提及=" + (_0xcfd3fa.enableCommentMention ? "开" : "关")) + (", @概率=" + (Number.isFinite(Number(_0xcfd3fa.commentMentionPercent)) ? _0xcfd3fa.commentMentionPercent : 100) + "%"));
        const _0x3218b8 = Array.from(new Set((_0x5c2a52 || []).map(_0x1545d4 => _0x1545d4.accountId).filter(Boolean)));
        const _0x5d0237 = Array.from(new Set((_0x5c2a52 || []).map(_0x16989b => _0x16989b.accountName).filter(Boolean)));
        try {
          _0x4e7042.createBatchRun({
            id: "batch_" + _0xc33ac0 + "_" + Date.now(),
            runId: _0xc33ac0,
            startedAt: Date.now(),
            endedAt: null,
            status: "running",
            type: _0xcfd3fa?.type || "follow_dm",
            genderFilter: _0xcfd3fa?.genderFilter || "all",
            accountIds: _0x3218b8,
            accountNames: _0x5d0237,
            total: _0x5c2a52.length,
            current: 0,
            success: 0,
            failed: 0,
            skipped: 0,
            results: [],
            logs: []
          });
          _0x54648b(_0xc33ac0, {
            message: "批量跟进已启动：共 " + _0x5c2a52.length + " 条，动作 " + (_0xcfd3fa?.type || "follow_dm") + "，账号 " + (_0x5d0237.join("、") || _0x3218b8.length),
            level: "info",
            phase: "run"
          });
        } catch (_0x365dda) {
          console.warn("[Batch] 创建批量跟进详情记录失败:", _0x365dda?.message || _0x365dda);
        }
        if (_0x227915) {
          _0x227915.webContents.send("batch-task-info", {
            total: _0x5c2a52.length,
            runId: _0xc33ac0
          });
        }
        _0x5c2a52.forEach(_0x4ac297 => {
          const _0x348010 = "douyin";
          const _0x1625b1 = _0x4ac297.accountId && _0x4ac297.accountId !== "default" ? _0x348010 + "_" + _0x4ac297.accountId : _0x348010;
          if (!_0x2880e8.has(_0x1625b1)) {
            _0x2880e8.set(_0x1625b1, []);
          }
          _0x2880e8.get(_0x1625b1).push({
            lead: _0x4ac297,
            config: _0xcfd3fa
          });
        });
        const _0x99516b = [..._0x2880e8.values()].some(_0x471f6e => Array.isArray(_0x471f6e) && _0x471f6e.length > 0);
        if (_0x99516b) {
          _0x14a3de?.(_0xc33ac0, _0x5c2a52.length);
        } else if (_0x227915) {
          try {
            _0x4e7042.finalizeBatchRun(_0xc33ac0, "completed");
          } catch (_0x3f2175) {}
          _0x227915.webContents.send("batch-task-complete");
        }
        _0x2880e8.forEach((_0x59ed0d, _0x30e762) => {
          if (_0x59ed0d.length > 0) {
            _0x105f1f(_0x30e762);
            _0x3bec86.set(_0x30e762, true);
            if (_0x227915) {
              _0x227915.webContents.send("view-batch-status", {
                viewKey: _0x30e762,
                isRunning: true
              });
            }
            _0x18d9a3(_0x30e762, _0xc33ac0, "batch-start");
          }
        });
      })().catch(_0x283607 => {
        console.error("[Batch] start-batch-action failed:", _0x283607?.message || _0x283607);
        const _0x3bc8f9 = _0x42dad6();
        if (_0x3bc8f9 && !_0x3bc8f9.isDestroyed()) {
          _0x3bc8f9.webContents.send("batch-task-stopped");
        }
      });
    });
    ipcMain.on("batch-item-finished", (_0x1ea071, _0x429583) => {
      _0x38898c(_0x1ea071, _0x429583);
    });
    ipcMain.on("stop-batch-action", () => {
      console.log("[Batch] 收到手动停止指令");
      const _0x577ed5 = _0x42dad6();
      const _0x42fa16 = _0x203fb0();
      const _0x46dbf5 = _0x429dfe();
      const _0x5c6ac6 = _0x199df4();
      const _0x5bb1de = _0x2e6906();
      const _0x294dc4 = _0x3c18e0;
      const _0x16720d = new Set([..._0x42fa16.keys(), ..._0x5bb1de.keys(), ..._0x5c6ac6.keys(), ...[..._0x46dbf5.entries()].filter(([, _0x1ca37d]) => _0x1ca37d).map(([_0xfe0c46]) => _0xfe0c46)]);
      _0x411698 = true;
      _0x3c18e0 += 1;
      _0xe75fe9("batch-manual-stop", _0x294dc4);
      _0x1bed5a("batch-manual-stop", _0x294dc4);
      _0x42fa16.clear();
      _0x46dbf5.clear();
      _0x5c6ac6.clear();
      _0x5bb1de.clear();
      _0x1b5a42.clear();
      _0x32ff84.clear();
      _0x3b4415();
      try {
        _0x4e7042.finalizeBatchRun(_0x294dc4, "stopped");
      } catch (_0x494512) {}
      _0x54648b(_0x294dc4, {
        message: "批量跟进已手动停止",
        level: "warning",
        phase: "run"
      });
      for (const _0x26d582 of _0x16720d) {
        _0x49cbc9(_0x26d582, "manual_stop");
        const _0x598862 = _0x26d582.includes("_") ? _0x26d582.split("_").slice(1).join("_") : null;
        if (_0x577ed5 && !_0x577ed5.isDestroyed()) {
          _0x577ed5.webContents.send("batch-account-finished", {
            viewKey: _0x26d582,
            accountId: _0x598862,
            reason: "manual_stop",
            runId: _0x294dc4
          });
          _0x577ed5.webContents.send("view-batch-status", {
            viewKey: _0x26d582,
            isRunning: false
          });
        }
      }
      _0xdc2c01?.({
        force: true
      });
      if (_0x577ed5) {
        _0x577ed5.webContents.send("batch-task-stopped", {
          runId: _0x294dc4
        });
      }
    });
    ipcMain.on("stop-batch-account", (_0x2b4736, _0x18c5ae = {}) => {
      const _0x1f973d = typeof _0x18c5ae === "string" ? _0x18c5ae : _0x18c5ae?.viewKey;
      if (!_0x1f973d) {
        return;
      }
      _0x3776dc(_0x1f973d, _0x18c5ae?.reason || "manual_stop");
    });
    ipcMain.on("interaction-start", (_0x3f65a9, {
      viewKey: _0x4c7ae3,
      url: _0xb78ee2,
      taskData: _0x550d29
    }) => {
      _0x59dee3(_0x4c7ae3, _0xb78ee2, _0x550d29);
    });
    ipcMain.on("interaction-profile-ready", (_0x8673ee, _0x120066 = {}) => {
      const _0x1b2fce = _0x120066.viewKey || _0x23a5ae(_0x8673ee.sender);
      if (!_0x1b2fce) {
        return;
      }
      const _0x17a435 = _0x3a36f().get(_0x1b2fce);
      if (!_0x17a435) {
        return;
      }
      if (_0x120066.interactionId && _0x17a435.interactionId && _0x120066.interactionId !== _0x17a435.interactionId) {
        return;
      }
      _0x17a435.profileOpenReady = true;
      if (_0x17a435.profileOpenTimer) {
        clearTimeout(_0x17a435.profileOpenTimer);
        _0x17a435.profileOpenTimer = null;
      }
    });
    ipcMain.on("interaction-activity", (_0x50d561, _0x507c25 = {}) => {
      const _0x3abe63 = _0x507c25.viewKey || _0x23a5ae(_0x50d561.sender);
      if (!_0x3abe63) {
        return;
      }
      const _0x206974 = _0x555d5b(_0x3abe63, _0x507c25.interactionId || "", {
        extendMs: _0x507c25.extendMs
      });
      if (_0x206974 && _0x507c25.reason) {
        console.log("[Batch] [" + _0x3abe63 + "] 互动续期（" + _0x507c25.reason + "）");
      }
    });
    ipcMain.on("interaction-success-checkpoint", (_0x9aded6, _0x29fbb8 = {}) => {
      const _0x1b555b = _0x29fbb8.viewKey || _0x23a5ae(_0x9aded6.sender);
      if (!_0x1b555b) {
        return;
      }
      const _0x594b32 = _0x3a36f().get(_0x1b555b);
      const _0x2d17fa = _0x2e6906().get(_0x1b555b);
      const _0x1959ef = _0x29fbb8.results || {};
      if (!_0x594b32 || !_0x2d17fa || !_0x1959ef.success || !_0x1959ef.profileWorkCommented) {
        return;
      }
      const _0x1fe711 = _0x29fbb8.interactionId && _0x594b32.interactionId && _0x29fbb8.interactionId !== _0x594b32.interactionId && !String(_0x594b32.interactionId).startsWith("batch_wait_retry_");
      if (_0x1fe711) {
        return;
      }
      if (_0x29fbb8.batchRunId != null && _0x29fbb8.batchRunId !== _0x2d17fa.runId) {
        return;
      }
      _0x594b32.successCheckpoint = _0x1959ef;
      if (_0x594b32.timer) {
        clearTimeout(_0x594b32.timer);
      }
      _0x594b32.timer = setTimeout(_0x594b32.onTimeout, 60000);
      console.log("[Batch] [" + _0x1b555b + "] 已记录首作评论成功检查点，等待最终结果回传");
    });
    ipcMain.on("interaction-done", (_0x1ff899, {
      viewKey: _0x324ca6,
      interactionId: _0x209478,
      batchRunId: _0x35e428,
      results: _0x5d1298
    }) => {
      const _0x32b9cf = _0x324ca6 || _0x23a5ae(_0x1ff899.sender);
      if (!_0x32b9cf) {
        console.warn("[Main] [子视图模式] 收到互动结束，但无法识别 viewKey");
        return;
      }
      const _0x3c7ec7 = _0x3a36f().get(_0x32b9cf)?.interactionId;
      const _0x58a98f = _0x2e6906().get(_0x32b9cf);
      if (_0x209478 && _0x3c7ec7 && _0x209478 !== _0x3c7ec7) {
        if (_0x58a98f && _0x5d1298?.success && _0x5d1298?.profileWorkCommented && (_0x35e428 == null || _0x35e428 === _0x58a98f.runId) && _0x58a98f.runId === _0x3c18e0) {
          console.warn("[Batch] [" + _0x32b9cf + "] 采纳迟到的首作评论成功（旧 interactionId=" + _0x209478 + "），完结本条并取消重试");
          const _0x2654ee = _0x3a36f().get(_0x32b9cf);
          if (_0x2654ee) {
            _0x2654ee.successCheckpoint = _0x5d1298;
          }
          _0x353391(_0x32b9cf, "late-profile-comment-success");
          Promise.resolve(_0x3b2d0d(_0x32b9cf, _0x58a98f, _0x5d1298, _0x1ff899.sender)).then(_0x1d8871 => {
            if (_0x1d8871 === "retry-scheduled") {
              return;
            }
            _0x4732a0(_0x32b9cf, _0x5d1298);
          }).catch(_0x113f97 => {
            console.warn("[Batch] [" + _0x32b9cf + "] 迟到成功完结异常:", _0x113f97?.message || _0x113f97);
            _0x4732a0(_0x32b9cf, _0x5d1298);
          });
          return;
        }
        console.log("[Main] [子视图模式] 忽略旧互动回调 (" + _0x32b9cf + ", " + _0x209478 + " != " + _0x3c7ec7 + ")");
        return;
      }
      if (_0x58a98f && _0x35e428 != null && _0x35e428 !== _0x58a98f.runId) {
        console.log("[Batch] 忽略旧代次互动回调 (" + _0x32b9cf + ", run " + _0x35e428 + " != " + _0x58a98f.runId + ")");
        return;
      }
      if (_0x58a98f) {
        if (_0x58a98f.runId !== _0x3c18e0) {
          _0x2e6906().delete(_0x32b9cf);
          _0x4732a0(_0x32b9cf, _0x5d1298);
          return;
        }
        Promise.resolve(_0x3b2d0d(_0x32b9cf, _0x58a98f, _0x5d1298, _0x1ff899.sender)).then(_0x2f92d4 => {
          if (_0x2f92d4 === "retry-scheduled") {
            return;
          }
          _0x4732a0(_0x32b9cf, _0x5d1298);
        }).catch(_0x5cf2d9 => {
          console.warn("[Batch] [" + _0x32b9cf + "] completeBatchFromInteraction 异常:", _0x5cf2d9?.message || _0x5cf2d9);
          _0x4732a0(_0x32b9cf, _0x5d1298);
        });
        return;
      }
      _0x4732a0(_0x32b9cf, _0x5d1298);
    });
  }
  return {
    resolveActiveBatchRunId: _0x542199,
    appendBatchFollowLog: _0x54648b,
    clearBatchWaitTickersForView: _0x4676e6,
    cancelBatchWandering: _0x1bed5a,
    cancelActiveBatchInteractions: _0xe75fe9,
    pickBatchDmText: _0x42afd2,
    buildBatchInteractionTask: _0x38897d,
    isBatchCountedFailure: _0x1fe2fa,
    mapSubviewResultsToBatchPayload: _0x2b5b03,
    resolveViewKeyFromSender: _0x3f0eea,
    completeBatchFromInteraction: _0x3b2d0d,
    runInteractionStart: _0x59dee3,
    ensureInteractionView: _0x21f742,
    dispatchNextBatchItem: _0x18d9a3,
    processNextBatchItem: _0x145c77,
    processBatchItemFinished: _0x38898c,
    stopBatchAccountByViewKey: _0x3776dc,
    registerIpc: _0x2848e7
  };
}
module.exports = {
  createBatchFollow: createBatchFollow
};
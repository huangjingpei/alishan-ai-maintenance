'use strict';

const {
  BrowserView
} = require("electron");
const {
  buildMonitorViewKey,
  buildAccountSessionKey
} = require("./monitorAutomationViewHost");
function createMonitorProfileSubviewRunner(options = {}) {
  const {
    getInteractionViewsMap: getInteractionViewsMap,
    configureAutomationSession: configureAutomationSession,
    attachProtocolGuard: attachProtocolGuard,
    applyAccountProxy: applyAccountProxy,
    resolveAutomationPreloadPath: resolveAutomationPreloadPath,
    automationUserAgent = "",
    store: store,
    runtimeConfig: runtimeConfig,
    automationViewportSession: automationViewportSession
  } = options;
  const set = new Set();
  function fn(arg1) {
    set.delete(arg1);
    automationViewportSession?.destroyViewportSubview?.(arg1, "monitor-destroy");
  }
  function ensureMonitorInteractionView(arg1, arg2) {
    const result = buildMonitorViewKey(arg1);
    const local = getInteractionViewsMap?.();
    const local2 = local?.get?.(result);
    if (local2 && !local2.webContents?.isDestroyed?.()) {
      local2.__radarMonitorInteraction = true;
      set.add(result);
      return local2;
    }
    if (local2) {
      local.delete(result);
    }
    const result2 = buildAccountSessionKey(arg1);
    const value = result2 ? "persist:automation:" + result2 : "temp:monitor-interaction:" + result;
    const value2 = typeof resolveAutomationPreloadPath === "function" ? resolveAutomationPreloadPath() : "";
    const browserView = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false,
        preload: value2,
        partition: value,
        backgroundThrottling: false,
        spellcheck: false
      }
    });
    try {
      browserView.setBackgroundColor("#111827");
    } catch (error) {}
    const value3 = browserView.webContents;
    const local3 = result2 || result;
    try {
      configureAutomationSession?.(value3.session, local3);
    } catch (error) {}
    try {
      attachProtocolGuard?.(value3, result + ":interaction");
    } catch (error) {}
    try {
      value3.setWindowOpenHandler(() => ({
        action: "deny"
      }));
    } catch (error) {}
    if (automationUserAgent) {
      try {
        value3.setUserAgent(automationUserAgent);
      } catch (error) {}
    }
    try {
      const local = store?.get?.("system_video_muted", true);
      value3.setAudioMuted(local !== false);
    } catch (error) {
      try {
        value3.setAudioMuted(true);
      } catch (error) {}
    }
    value3.on("dom-ready", () => {
      try {
        runtimeConfig?.ensureAndPushToWebContents?.(value3);
      } catch (error) {}
    });
    browserView.__radarMonitorInteraction = true;
    set.add(result);
    automationViewportSession?.registerInteractionSubview?.(result, browserView);
    const local4 = () => {
      try {
        if (value3.isDestroyed?.()) {
          return;
        }
        value3.executeJavaScript("\n          (() => {\n            try {\n              window.__radar_monitor_interaction = true;\n              window.__radar_view_key = '';\n            } catch (_) {}\n            return true;\n          })()\n        ", true).catch(() => {});
      } catch (error) {}
    };
    try {
      value3.on("dom-ready", local4);
    } catch (error) {}
    local4();
    if (typeof applyAccountProxy === "function") {
      Promise.resolve(applyAccountProxy(value3.session, arg2, local3)).catch(arg1 => {
        console.warn("[MonitorSubview] 代理设置失败:", arg1?.message || arg1);
      });
    }
    return browserView;
  }
  function isMonitorInteractionWebContents(arg1) {
    if (!arg1 || arg1.isDestroyed?.()) {
      return false;
    }
    try {
      const local = getInteractionViewsMap?.();
      for (const item of set) {
        const local2 = local?.get?.(item);
        if (local2?.webContents === arg1) {
          return true;
        }
      }
    } catch (error) {}
    return false;
  }
  async function runMonitorProfileActionsInSubview(arg1, arg2, arg3, arg4, arg5, arg6) {
    const result = buildMonitorViewKey(arg1);
    const result2 = ensureMonitorInteractionView(arg1, arg2);
    if (!result2) {
      throw new Error("无法创建监控互动子视图");
    }
    if (!automationViewportSession) {
      fn(result);
      throw new Error("监控互动视口生命周期不可用");
    }
    let text = "";
    let obj = {};
    let local = null;
    let flag = false;
    const abortController = new AbortController();
    const obj2 = {
      timeoutMs: 360000,
      onTimeout: ({
        interactionId: interactionId
      }) => {
        if (text && interactionId !== text) {
          return;
        }
        flag = true;
        abortController.abort(new Error("monitor_interaction_timeout"));
      }
    };
    let local2 = null;
    const value = Date.now() + 2400;
    do {
      local2 = automationViewportSession.beginViewportSession(result, obj2);
      if (local2?.started) {
        break;
      }
      if (!["invalid_bounds", "visible_stack_not_staged", "viewport_staging_failed"].includes(local2?.reason)) {
        break;
      }
      await new Promise(arg1 => setTimeout(arg1, 120));
    } while (Date.now() < value);
    if (!local2?.started) {
      fn(result);
      throw new Error("无法启动监控互动视口：" + (local2?.reason || "unknown"));
    }
    text = local2.interactionId;
    result2.webContents.__radarMonitorAbortSignal = abortController.signal;
    try {
      const obj2 = {
        webContents: result2.webContents,
        isDestroyed: () => !!result2.webContents?.isDestroyed?.(),
        loadURL: arg1 => result2.webContents.loadURL(arg1),
        __radarMonitorInteraction: true,
        __radarMonitorViewKey: result + ":interaction",
        __radarMonitorParentViewKey: result,
        abortSignal: abortController.signal
      };
      if (typeof arg6 === "function") {
        await arg6(obj2, arg3);
      } else {
        await result2.webContents.loadURL(arg3);
      }
      await new Promise(arg1 => setTimeout(arg1, 3500));
      const result3 = await automationViewportSession.revealViewportSession(result, text);
      if (!result3?.ready) {
        throw new Error("互动页面首帧未就绪：" + (result3?.reason || "unknown"));
      }
      obj = await arg5(obj2);
      if (flag) {
        throw Object.assign(new Error("monitor_interaction_timeout"), {
          code: "monitor_interaction_timeout"
        });
      }
      return obj;
    } catch (error) {
      local = error;
      throw error;
    } finally {
      try {
        delete result2.webContents.__radarMonitorAbortSignal;
      } catch (error) {}
      automationViewportSession.endViewportSession(result, {
        interactionId: text,
        results: local ? {
          success: false,
          error: local?.message || String(local)
        } : obj,
        reason: flag ? "monitor-timeout" : local ? "monitor-error" : "monitor-done",
        destroySubview: true
      });
      set.delete(result);
    }
  }
  function destroyAllInteractionViews() {
    for (const item of [...set]) {
      fn(item);
    }
  }
  return {
    runMonitorProfileActionsInSubview: runMonitorProfileActionsInSubview,
    destroyAllInteractionViews: destroyAllInteractionViews,
    ensureMonitorInteractionView: ensureMonitorInteractionView,
    isMonitorInteractionWebContents: isMonitorInteractionWebContents
  };
}
module.exports = {
  createMonitorProfileSubviewRunner: createMonitorProfileSubviewRunner
};
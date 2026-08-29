'use strict';

const {
  BrowserView
} = require("electron");
function buildMonitorViewKey(arg1) {
  const local = String(arg1 || "").trim() || "unknown";
  return "monitor_" + local;
}
function buildAccountSessionKey(arg1, {
  platform = "douyin"
} = {}) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return "";
  }
  const local = String(platform || "douyin").trim().toLowerCase() || "douyin";
  return local + "_" + result;
}
function createMonitorAutomationViewHostFactory(options = {}) {
  const {
    getPlatformViews: getPlatformViews,
    getMainWindow: getMainWindow,
    attachAutomationViewToBackgroundHost: attachAutomationViewToBackgroundHost,
    ensureBackgroundAutomationHostWindow: ensureBackgroundAutomationHostWindow,
    configureAutomationSession: configureAutomationSession,
    attachProtocolGuard: attachProtocolGuard,
    applyAccountProxy: applyAccountProxy,
    resolveAutomationPreloadPath: resolveAutomationPreloadPath,
    automationUserAgent = "",
    store: store,
    getViewSettingsMap: getViewSettingsMap,
    destroyAutomationBrowserView: destroyAutomationBrowserView
  } = options;
  async function createMonitorAccountHost(arg1, arg2, {
    platform = "douyin"
  } = {}) {
    const result = buildMonitorViewKey(arg1);
    const result2 = buildAccountSessionKey(arg1, {
      platform: platform
    });
    const local = getPlatformViews?.();
    if (!local) {
      throw new Error("platformViews 不可用");
    }
    const value = result2 ? "persist:automation:" + result2 : "temp:monitor:" + result;
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
    try {
      browserView.setBounds({
        x: 0,
        y: 0,
        width: 1280,
        height: 800
      });
    } catch (error) {}
    const value3 = browserView.webContents;
    const local2 = result2 || result;
    if (typeof configureAutomationSession === "function") {
      configureAutomationSession(value3.session, local2);
    }
    if (automationUserAgent) {
      try {
        value3.setUserAgent(automationUserAgent);
      } catch (error) {}
    }
    try {
      attachProtocolGuard?.(value3, "video-monitor:" + result);
    } catch (error) {}
    try {
      value3.setWindowOpenHandler(() => ({
        action: "deny"
      }));
    } catch (error) {}
    if (typeof applyAccountProxy === "function") {
      await applyAccountProxy(value3.session, arg2, result2 || result);
    }
    try {
      const local = store?.get?.("system_video_muted", true);
      value3.setAudioMuted(local !== false);
    } catch (error) {}
    try {
      value3.setFrameRate?.(30);
    } catch (error) {}
    local.set(result, browserView);
    try {
      const value = typeof getViewSettingsMap === "function" ? getViewSettingsMap() : null;
      value?.set?.(result, {
        taskId: "monitor-host:" + arg1,
        accountId: String(arg1),
        platform: platform || "douyin",
        taskMode: "video_monitor",
        videoMonitor: true
      });
    } catch (error) {}
    let flag = false;
    const list = [];
    const obj = {
      value: "监控任务 - " + arg1
    };
    const obj2 = {
      __radarMonitorHost: true,
      __radarMonitorViewKey: result,
      __radarMonitorAccountSessionKey: result2 || "",
      __radarMonitorAccountId: String(arg1),
      __radarAllowVisibleMonitor: false,
      __radarMonitorActive: false,
      __radarMonitorLastUsedAt: Date.now(),
      __radarMonitorProcessedVideos: 0,
      webContents: value3,
      isDestroyed: () => flag || value3.isDestroyed?.(),
      loadURL: arg1 => value3.loadURL(arg1),
      setTitle: arg1 => {
        obj.value = String(arg1 || obj.value);
      },
      getTitle: () => obj.value,
      on: (arg1, arg2) => {
        if (arg1 === "closed") {
          list.push(arg2);
          return obj2;
        }
        if (arg1 === "close") {
          return obj2;
        }
        try {
          value3.on(arg1, arg2);
        } catch (error) {}
        return obj2;
      },
      once: (arg1, arg2) => {
        if (arg1 === "closed") {
          const local = (...restArgs) => {
            const result = list.indexOf(local);
            if (result >= 0) {
              list.splice(result, 1);
            }
            arg2(...restArgs);
          };
          list.push(local);
          return obj2;
        }
        try {
          value3.once(arg1, arg2);
        } catch (error) {}
        return obj2;
      },
      destroy: () => {
        if (flag) {
          return;
        }
        flag = true;
        try {
          local.delete(result);
        } catch (error) {}
        try {
          const value = typeof getViewSettingsMap === "function" ? getViewSettingsMap() : null;
          value?.delete?.(result);
        } catch (error) {}
        try {
          if (typeof destroyAutomationBrowserView === "function") {
            destroyAutomationBrowserView(browserView, result, "monitor-main");
          } else if (!value3.isDestroyed?.()) {
            try {
              getMainWindow?.()?.removeBrowserView?.(browserView);
            } catch (error) {}
            try {
              ensureBackgroundAutomationHostWindow?.()?.removeBrowserView?.(browserView);
            } catch (error) {}
            value3.destroy?.();
          }
        } catch (error) {}
        for (const item of list.splice(0)) {
          try {
            item();
          } catch (error) {}
        }
      },
      show: () => {},
      hide: () => {},
      focus: () => {},
      isVisible: () => false,
      showInactive: () => {},
      setOpacity: () => {},
      setSkipTaskbar: () => {},
      setFocusable: () => {},
      setPosition: () => {},
      center: () => {},
      setSize: () => {},
      setBounds: () => {},
      getBounds: () => {
        try {
          return browserView.getBounds();
        } catch (error) {
          return {
            x: 0,
            y: 0,
            width: 1280,
            height: 800
          };
        }
      },
      getContentBounds: () => {
        try {
          return browserView.getBounds();
        } catch (error) {
          return {
            x: 0,
            y: 0,
            width: 1280,
            height: 800
          };
        }
      }
    };
    return {
      facade: obj2,
      view: browserView,
      viewKey: result,
      webContents: value3
    };
  }
  return {
    buildMonitorViewKey: buildMonitorViewKey,
    buildAccountSessionKey: buildAccountSessionKey,
    createMonitorAccountHost: createMonitorAccountHost
  };
}
module.exports = {
  buildMonitorViewKey: buildMonitorViewKey,
  buildAccountSessionKey: buildAccountSessionKey,
  createMonitorAutomationViewHostFactory: createMonitorAutomationViewHostFactory
};
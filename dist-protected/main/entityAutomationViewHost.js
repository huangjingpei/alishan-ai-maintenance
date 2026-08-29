'use strict';

const {
  BrowserView
} = require("electron");
const {
  handleStripFrameBlockingHeaders
} = require("./stripFrameBlockingHeaders");
function buildEntityViewKey(arg1, {
  guest = false
} = {}) {
  const local = String(arg1 || "").trim() || "guest";
  if (guest) {
    return "entity_guest_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6);
  }
  return "entity_" + local;
}
function buildAccountSessionKey(arg1, {
  guest = false,
  platform = "douyin"
} = {}) {
  const result = String(arg1 || "").trim();
  if (guest || !result) {
    return "";
  }
  const local = String(platform || "douyin").trim().toLowerCase() || "douyin";
  return local + "_" + result;
}
function createEntityAutomationViewHostFactory(options = {}) {
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
    destroyAutomationBrowserView: destroyAutomationBrowserView
  } = options;
  async function createEntityAccountHost(arg1, arg2, {
    guest = false,
    platform = "douyin"
  } = {}) {
    const result = buildEntityViewKey(arg1, {
      guest: guest
    });
    const result2 = buildAccountSessionKey(arg1, {
      guest: guest,
      platform: platform
    });
    const local = getPlatformViews?.();
    if (!local) {
      throw new Error("platformViews 不可用");
    }
    const value = guest || !result2 ? "temp:entity-guest:" + result : "persist:automation:" + result2;
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
        width: 1200,
        height: 800
      });
    } catch (error) {}
    const value3 = browserView.webContents;
    const local2 = result2 || result;
    if (typeof configureAutomationSession === "function") {
      configureAutomationSession(value3.session, local2);
    }
    if (guest) {
      try {
        value3.session.webRequest.onHeadersReceived({
          urls: ["*://*.douyin.com/*", "*://*.bytedance.net/*"]
        }, handleStripFrameBlockingHeaders);
      } catch (error) {}
    }
    if (automationUserAgent) {
      try {
        value3.setUserAgent(automationUserAgent);
      } catch (error) {}
    }
    try {
      attachProtocolGuard?.(value3, "entity-leadgen:" + result);
    } catch (error) {}
    try {
      value3.setWindowOpenHandler(() => ({
        action: "deny"
      }));
    } catch (error) {}
    if (!guest && typeof applyAccountProxy === "function") {
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
    let flag = false;
    const list = [];
    const obj = {
      value: guest ? "线索采集（无账号游客）" : "线索采集 - " + arg1
    };
    const obj2 = {
      __radarEntityHost: true,
      __radarEntityViewKey: result,
      __radarEntityAccountSessionKey: result2 || "",
      __radarEntityGuest: !!guest,
      __radarEntityAccountId: String(arg1),
      __radarAllowVisibleMonitor: false,
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
          if (typeof destroyAutomationBrowserView === "function") {
            destroyAutomationBrowserView(browserView, result, "entity-main");
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
      setOpacity: () => {},
      setSkipTaskbar: () => {},
      setFocusable: () => {},
      setPosition: () => {},
      center: () => {},
      setSize: () => {},
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
    buildEntityViewKey: buildEntityViewKey,
    buildAccountSessionKey: buildAccountSessionKey,
    createEntityAccountHost: createEntityAccountHost
  };
}
module.exports = {
  buildEntityViewKey: buildEntityViewKey,
  buildAccountSessionKey: buildAccountSessionKey,
  createEntityAutomationViewHostFactory: createEntityAutomationViewHostFactory
};
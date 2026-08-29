const {
  app,
  BrowserView,
  BrowserWindow,
  ipcMain
} = require("electron");
const {
  acquireTaskRuntimeGuard,
  releaseTaskRuntimeGuard
} = require("./taskRuntimeGuard");
const {
  attachProtocolGuard
} = require("./protocolGuard");
const {
  CHAT_LIST_CHANGED_TOKEN,
  DEFAULT_CHAT_NOTIFICATION_CONFIG,
  getChatConversationSnapshotScript,
  getChatListObserverInstallScript,
  getChatMonitorVisibilityKeepaliveScript,
  isChatWebhookPushConfigured,
  isHttpWebhookUrl,
  normalizeChatNotificationConfig,
  reconcileConversationSnapshot,
  sendChatMessageWebhookRequest
} = require("./chatMessageNotifications");
const DOUYIN_CHAT_URL = "https://www.douyin.com/chat";
const MESSAGE_CENTER_FREE_BLOCK_MSG = "当前未激活专业版，试用期间或升级专业版后可使用消息聚合";
const CHAT_NOTIFICATION_CONFIG_KEY = "message_center_notification_config";
const CHAT_NOTIFICATION_STATES_KEY = "message_center_account_states_v1";
const CHAT_NOTIFICATION_SUMMARIES_KEY = "message_center_unread_summaries_v1";
const CHAT_NOTIFICATION_RUNTIME_GUARD = "message-notification-monitor";
const CHAT_OBSERVER_DEBOUNCE_MS = 200;
const CHAT_SAFETY_SCAN_INTERVAL_MS = 45000;
function createMessageCenter(options = {}) {
  const value = options.store;
  const value2 = options.axios;
  const local = () => typeof options.getMainWindow === "function" ? options.getMainWindow() : null;
  const local2 = () => typeof options.getIsCurrentUserFree === "function" ? !!options.getIsCurrentUserFree() : false;
  const local3 = () => typeof options.getAutomationUserAgent === "function" ? options.getAutomationUserAgent() : undefined;
  const local4 = () => typeof options.getAppProductName === "function" ? options.getAppProductName() : "获客雷达";
  const value3 = Number(options.maxKeepaliveAccounts) > 0 ? Number(options.maxKeepaliveAccounts) : 10;
  const local5 = options.chatViewsMap || new Map();
  const local6 = options.chatMonitorWindowsMap || new Map();
  let flag = false;
  let local7 = null;
  let num = 0;
  let result = normalizeChatNotificationConfig(value.get(CHAT_NOTIFICATION_CONFIG_KEY, {}));
  let local8 = value.get(CHAT_NOTIFICATION_STATES_KEY, {}) || {};
  let local9 = value.get(CHAT_NOTIFICATION_SUMMARIES_KEY, {}) || {};
  let local10 = null;
  let flag2 = false;
  let num2 = 0;
  let local11 = null;
  let flag3 = false;
  const map = new Map();
  const map2 = new Map();
  const map3 = new Map();
  const map4 = new Map();
  const map5 = new Map();
  function fn(options = {}) {
    const result = local();
    if (!result || result.isDestroyed() || result.webContents.isDestroyed()) {
      return;
    }
    try {
      result.webContents.send("chat-view-status", {
        at: Date.now(),
        ...options
      });
    } catch (error) {}
  }
  function fn2() {
    const result = value.get("account_pool", []);
    return (Array.isArray(result) ? result : []).filter(arg1 => arg1 && (!arg1.platform || arg1.platform === "douyin"));
  }
  function fn3(arg1) {
    return fn2().find(arg12 => String(arg12.id) === String(arg1)) || null;
  }
  function isBackgroundChatMonitorEnabled() {
    return !local2() && !!result.enabled;
  }
  function fn5() {
    return isBackgroundChatMonitorEnabled() && isChatWebhookPushConfigured(result);
  }
  function shouldRunChatMessageMonitor() {
    if (local2()) {
      return false;
    }
    return !!flag3 || isBackgroundChatMonitorEnabled();
  }
  function fn7() {
    const result = fn2().filter(arg1 => arg1.status === "online");
    const value = local7?.accountId ? String(local7.accountId) : "";
    const list = [];
    if (value) {
      const result2 = result.find(arg1 => String(arg1.id) === value);
      if (result2) {
        list.push(result2);
      }
    }
    for (const item of result) {
      if (String(item.id) === value) {
        continue;
      }
      list.push(item);
      if (list.length >= value3) {
        break;
      }
    }
    return list.slice(0, value3);
  }
  function getChatUnreadStatePayload() {
    const obj = {};
    let num = 0;
    Object.entries(local9 || {}).forEach(([arg1, arg12]) => {
      const result = Math.max(0, Math.min(9999, Number(arg12?.unreadCount || 0)));
      obj[arg1] = {
        accountId: arg1,
        unreadCount: result,
        lastSender: String(arg12?.lastSender || "").slice(0, 120),
        lastContent: String(arg12?.lastContent || "").slice(0, 500),
        lastScanAt: Number(arg12?.lastScanAt || 0),
        source: String(arg12?.source || ""),
        error: String(arg12?.error || "")
      };
      num += result;
    });
    return {
      totalUnread: Math.min(9999, num),
      accounts: obj,
      monitor: {
        enabled: !!result.enabled,
        webhookEnabled: fn5(),
        webhookType: String(result.webhookType || "feishu"),
        messageCenterActive: !!flag3,
        running: !!flag2,
        mode: "event",
        keepaliveMaxAccounts: value3,
        safetyScanIntervalSeconds: Math.round(CHAT_SAFETY_SCAN_INTERVAL_MS / 1000),
        keepaliveCount: local6.size,
        lastRun: local11
      }
    };
  }
  function fn9() {
    const result = local();
    if (!result || result.isDestroyed() || result.webContents.isDestroyed()) {
      return;
    }
    try {
      result.webContents.send("chat-unread-state", getChatUnreadStatePayload());
    } catch (error) {}
  }
  function fn10() {
    value.set(CHAT_NOTIFICATION_STATES_KEY, local8 || {});
    value.set(CHAT_NOTIFICATION_SUMMARIES_KEY, local9 || {});
  }
  function fn11(arg1, arg2, text = "") {
    const local = local9[arg1] || {};
    local9 = {
      ...local9,
      [arg1]: {
        ...local,
        accountId: arg1,
        source: text,
        error: String(arg2 || "消息列表暂不可读").slice(0, 300),
        lastScanAt: Date.now()
      }
    };
    fn10();
    fn9();
  }
  async function fn12(arg1, arg2 = result, {
    force = false
  } = {}) {
    const result2 = normalizeChatNotificationConfig(arg2);
    if (!force && !result2.enabled || !isChatWebhookPushConfigured(result2)) {
      return {
        success: false,
        skipped: true,
        message: "Webhook 未启用或地址无效"
      };
    }
    try {
      const result = await sendChatMessageWebhookRequest({
        axios: value2,
        config: {
          ...result2,
          enabled: true
        },
        event: arg1,
        timeout: 10000,
        force: true
      });
      const flag = !!result.success;
      const obj = {
        success: flag,
        message: result.message || (flag ? "推送成功" : "机器人返回失败状态"),
        accountId: arg1.accountId,
        sender: arg1.sender,
        at: Date.now()
      };
      const result3 = local();
      if (result3 && !result3.isDestroyed()) {
        result3.webContents.send("chat-webhook-result", obj);
      }
      return obj;
    } catch (error) {
      const obj = {
        success: false,
        message: error.message || "Webhook 推送失败",
        accountId: arg1.accountId,
        sender: arg1.sender,
        at: Date.now()
      };
      console.warn("[ChatNotify] Webhook 推送失败 account=" + arg1.accountId + ": " + obj.message);
      const result = local();
      if (result && !result.isDestroyed()) {
        result.webContents.send("chat-webhook-result", obj);
      }
      return obj;
    }
  }
  async function fn13(arg1, arg2, arg3) {
    const result2 = String(arg1?.id || "");
    const result3 = String(arg2.content || "").trim().slice(0, 200);
    const result4 = [result2, result3].join("|");
    if (result4 !== "|" && map2.has(result4)) {
      console.log("[ChatNotify] 跳过重复推送 account=" + result2 + " content=" + result3.slice(0, 40));
      return {
        skipped: true,
        reason: "duplicate"
      };
    }
    if (result4 !== "|") {
      map2.set(result4, Date.now());
      if (map2.size > 2000) {
        const value = Date.now() - 21600000;
        for (const [local, local2] of map2.entries()) {
          if (local2 < value) {
            map2.delete(local);
          }
        }
      }
    }
    const result5 = Math.max(0, Number(local8[result2]?.unreadCount || 0));
    const obj = {
      accountId: result2,
      productName: local4(),
      receiverNickname: arg1?.nickname || "",
      receiverRemark: arg1?.name || "",
      receiverDouyinId: arg1?.douyinId || "",
      sender: arg2.sender,
      content: arg2.content,
      unreadCount: arg2.unreadCount,
      conversationUnreadCount: arg2.unreadCount,
      accountUnreadCount: result5,
      conversationKey: arg2.conversationKey,
      fingerprint: arg2.fingerprint,
      detectedAt: arg2.detectedAt || Date.now(),
      source: arg3
    };
    const result6 = local();
    if (result6 && !result6.isDestroyed()) {
      result6.webContents.send("chat-new-message", obj);
    }
    if (result.enabled && isChatWebhookPushConfigured(result)) {
      await fn12(obj, result);
    }
    return {
      skipped: false
    };
  }
  async function fn14(arg1, arg2, {
    source = "active"
  } = {}) {
    if (!arg1 || arg1.isDestroyed?.() || !arg2?.id) {
      return {
        success: false,
        message: "消息页面不可用"
      };
    }
    const result = String(arg2.id);
    if (map.has(result)) {
      return map.get(result);
    }
    const result2 = (async () => {
      let local;
      try {
        local = await arg1.executeJavaScript(getChatConversationSnapshotScript(), true);
      } catch (error) {
        fn11(result, error.message || "读取消息列表失败", source);
        return {
          success: false,
          message: error.message || "读取消息列表失败"
        };
      }
      if (!local?.success || !Array.isArray(local.conversations)) {
        const local2 = local?.error || (local?.diagnostics?.readyState !== "complete" ? "消息页面仍在加载" : "暂未识别到会话列表");
        fn11(result, local2, source);
        return {
          success: false,
          message: local2,
          diagnostics: local?.diagnostics || null
        };
      }
      const local2 = local8[result] || {};
      const result2 = reconcileConversationSnapshot(local2, local.conversations, Date.now());
      local8 = {
        ...local8,
        [result]: result2.state
      };
      local9 = {
        ...local9,
        [result]: {
          accountId: result,
          unreadCount: result2.state.unreadCount,
          lastSender: result2.state.lastSender,
          lastContent: result2.state.lastContent,
          lastScanAt: result2.state.lastScanAt,
          source: source,
          error: ""
        }
      };
      fn10();
      fn9();
      for (const item of result2.events) {
        await fn13(arg2, item, source);
      }
      return {
        success: true,
        eventCount: result2.events.length,
        unreadCount: result2.state.unreadCount,
        conversationCount: result2.state.conversationCount,
        diagnostics: local.diagnostics || null
      };
    })().finally(() => {
      map.delete(result);
    });
    map.set(result, result2);
    return result2;
  }
  function fn15(arg1) {
    const result = String(arg1 || "");
    if (!result) {
      return null;
    }
    if (local7?.accountId === result && !local7.view?.webContents?.isDestroyed?.()) {
      return local7.view.webContents;
    }
    const value = "douyin_" + result + ":message-monitor";
    const result2 = local6.get(value);
    if (result2 && !result2.isDestroyed() && !result2.webContents.isDestroyed()) {
      return result2.webContents;
    }
    return null;
  }
  function fn16(arg1) {
    const result = String(arg1 || "");
    if (!result || !shouldRunChatMessageMonitor()) {
      return;
    }
    const result2 = map3.get(result);
    if (result2) {
      clearTimeout(result2);
    }
    const result3 = setTimeout(() => {
      map3.delete(result);
      const result2 = fn3(result);
      const result3 = fn15(result);
      if (!result2 || !result3) {
        return;
      }
      const value = local7?.accountId === result ? "active" : "observer";
      fn14(result3, result2, {
        source: value
      }).catch(() => {});
    }, CHAT_OBSERVER_DEBOUNCE_MS);
    result3.unref?.();
    map3.set(result, result3);
  }
  async function fn17(arg1, arg2) {
    if (!arg1 || arg1.isDestroyed?.() || !arg2) {
      return {
        success: false
      };
    }
    const result = String(arg2);
    const value = arg1.id;
    let result2 = map4.get(value);
    if (!result2) {
      const local = (arg1, arg2, arg3) => {
        const result = map4.get(value);
        if (!result) {
          return;
        }
        if (String(arg3 || "").includes(CHAT_LIST_CHANGED_TOKEN)) {
          fn16(result.accountId);
        }
      };
      arg1.on("console-message", local);
      result2 = {
        accountId: result,
        handler: local
      };
      map4.set(value, result2);
      arg1.once("destroyed", () => {
        map4.delete(value);
      });
    } else {
      result2.accountId = result;
    }
    try {
      await arg1.executeJavaScript(getChatMonitorVisibilityKeepaliveScript(), true);
      const result = await arg1.executeJavaScript(getChatListObserverInstallScript(CHAT_LIST_CHANGED_TOKEN), true);
      return result || {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "安装列表观察者失败"
      };
    }
  }
  function fn18(arg1, arg2) {
    if (!arg1 || arg1.isDestroyed?.() || arg1.__radarChatMonitorLifecycle) {
      return;
    }
    arg1.__radarChatMonitorLifecycle = true;
    const local = () => {
      if (arg1.isDestroyed()) {
        return;
      }
      fn17(arg1, arg2).catch(() => {});
    };
    arg1.on("did-finish-load", local);
    arg1.on("dom-ready", local);
  }
  function fn19(arg1) {
    if (!arg1 || local7 !== arg1 || arg1.view?.webContents?.isDestroyed?.()) {
      return;
    }
    const local = fn3(arg1.accountId) || {
      id: arg1.accountId,
      name: arg1.name || ""
    };
    const value = arg1.view.webContents;
    fn18(value, arg1.accountId);
    fn17(value, arg1.accountId).catch(() => {});
    const result = setTimeout(() => {
      if (local7 !== arg1 || value.isDestroyed()) {
        return;
      }
      fn14(value, local, {
        source: "active"
      }).catch(() => {});
    }, 800);
    result.unref?.();
  }
  function fn20(arg1, arg2) {
    if (local6.get(arg1) === arg2) {
      local6.delete(arg1);
    }
    if (!arg2 || arg2.isDestroyed()) {
      return;
    }
    try {
      arg2.destroy();
    } catch (error) {}
  }
  async function fn21(arg1, arg2 = num2) {
    if (!arg1?.id || arg2 !== num2 || app.isQuitting) {
      return {
        success: false,
        skipped: true
      };
    }
    if (!shouldRunChatMessageMonitor()) {
      return {
        success: false,
        skipped: true
      };
    }
    const result = String(arg1.id);
    if (local7?.accountId === result && !local7.view?.webContents?.isDestroyed?.()) {
      const value = "douyin_" + result + ":message-monitor";
      const result2 = local6.get(value);
      if (result2) {
        fn20(value, result2);
      }
      fn18(local7.view.webContents, result);
      await fn17(local7.view.webContents, result);
      return fn14(local7.view.webContents, arg1, {
        source: "active"
      });
    }
    if (map5.has(result)) {
      return map5.get(result);
    }
    const result2 = (async () => {
      const value = "douyin_" + result + ":message-monitor";
      let result2 = local6.get(value);
      if (result2 && !result2.isDestroyed() && !result2.webContents.isDestroyed()) {
        fn18(result2.webContents, result);
        await fn17(result2.webContents, result);
        return fn14(result2.webContents, arg1, {
          source: "keepalive"
        });
      }
      if (result2) {
        fn20(value, result2);
      }
      result2 = new BrowserWindow({
        width: 900,
        height: 720,
        show: false,
        frame: false,
        skipTaskbar: true,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          sandbox: true,
          partition: "persist:automation:douyin_" + result,
          backgroundThrottling: false,
          spellcheck: false
        }
      });
      local6.set(value, result2);
      options.applyPackagedWindowMenuPolicy?.(result2);
      attachProtocolGuard(result2.webContents, value);
      options.configureAutomationSession?.(result2.webContents.session, value);
      result2.webContents.setUserAgent(local3());
      try {
        result2.webContents.setAudioMuted(true);
      } catch (error) {}
      try {
        result2.webContents.setBackgroundThrottling?.(false);
      } catch (error) {}
      fn18(result2.webContents, result);
      try {
        await options.bindAutomationViewProxy?.({
          proxy: arg1.proxy
        }, value, result2.webContents.session);
        if (arg2 !== num2 || app.isQuitting || result2.isDestroyed()) {
          fn20(value, result2);
          return {
            success: false,
            skipped: true
          };
        }
        if (local7?.accountId === result && !local7.view?.webContents?.isDestroyed?.()) {
          fn20(value, result2);
          return fn21(arg1, arg2);
        }
        await result2.loadURL(DOUYIN_CHAT_URL);
        let obj = {
          success: false,
          message: "消息列表尚未渲染"
        };
        for (let num = 0; num < 10; num += 1) {
          if (arg2 !== num2 || result2.isDestroyed() || app.isQuitting) {
            fn20(value, result2);
            return {
              success: false,
              skipped: true
            };
          }
          await new Promise(arg1 => setTimeout(arg1, num === 0 ? 1200 : 800));
          await fn17(result2.webContents, result);
          obj = await fn14(result2.webContents, arg1, {
            source: "keepalive"
          });
          if (obj.success) {
            return obj;
          }
        }
        return obj;
      } catch (error) {
        fn11(result, error.message || "后台消息监听失败", "keepalive");
        fn20(value, result2);
        return {
          success: false,
          message: error.message || "后台消息监听失败"
        };
      }
    })().finally(() => {
      map5.delete(result);
    });
    map5.set(result, result2);
    return result2;
  }
  function fn22(arg1 = CHAT_SAFETY_SCAN_INTERVAL_MS) {
    if (local10) {
      clearTimeout(local10);
    }
    local10 = null;
    if (!shouldRunChatMessageMonitor()) {
      return;
    }
    const local = num2;
    local10 = setTimeout(() => {
      local10 = null;
      fn23(local).catch(arg1 => {
        console.warn("[ChatNotify] 兜底扫描异常: " + arg1.message);
      });
    }, Math.max(0, Number(arg1 || 0)));
    local10.unref?.();
  }
  async function fn23(arg1 = num2) {
    if (flag2 || arg1 !== num2) {
      return;
    }
    if (!shouldRunChatMessageMonitor()) {
      return;
    }
    flag2 = true;
    fn9();
    try {
      const result = fn7();
      for (const item of result) {
        if (arg1 !== num2 || app.isQuitting) {
          break;
        }
        if (!shouldRunChatMessageMonitor()) {
          break;
        }
        const result = fn15(item.id);
        if (result) {
          const value = local7?.accountId === String(item.id) ? "active" : "safety";
          await fn17(result, item.id);
          await fn14(result, item, {
            source: value
          });
        } else {
          await fn21(item, arg1);
        }
        await new Promise(arg1 => setTimeout(arg1, 200));
      }
      local11 = {
        at: Date.now(),
        accountCount: result.length,
        messageCenterActive: !!flag3,
        webhookEnabled: fn5(),
        mode: "safety"
      };
    } finally {
      flag2 = false;
      fn9();
      if (arg1 === num2 && shouldRunChatMessageMonitor()) {
        fn22(CHAT_SAFETY_SCAN_INTERVAL_MS);
      }
    }
  }
  async function syncChatMonitorKeepalives(arg1 = num2) {
    if (arg1 !== num2 || !shouldRunChatMessageMonitor()) {
      return;
    }
    const result = fn7();
    const set = new Set(result.map(arg1 => String(arg1.id)));
    for (const [local, local2] of [...local6.entries()]) {
      const result = String(local).match(/^douyin_(.+):message-monitor$/);
      const local3 = result?.[1] || "";
      if (!set.has(local3)) {
        fn20(local, local2);
      }
    }
    for (const item of result) {
      if (arg1 !== num2 || app.isQuitting) {
        break;
      }
      if (!shouldRunChatMessageMonitor()) {
        break;
      }
      await fn21(item, arg1);
      await new Promise(arg1 => setTimeout(arg1, 300));
    }
    local11 = {
      at: Date.now(),
      accountCount: result.length,
      messageCenterActive: !!flag3,
      webhookEnabled: fn5(),
      mode: "keepalive-sync"
    };
    fn9();
  }
  function stopChatNotificationMonitor(text = "disabled") {
    num2 += 1;
    if (local10) {
      clearTimeout(local10);
    }
    local10 = null;
    flag2 = false;
    for (const item of map3.values()) {
      clearTimeout(item);
    }
    map3.clear();
    for (const [local, local2] of [...local6.entries()]) {
      fn20(local, local2);
    }
    releaseTaskRuntimeGuard(CHAT_NOTIFICATION_RUNTIME_GUARD);
    if (text !== "app-quit") {
      fn9();
    }
  }
  function syncChatNotificationMonitor({
    immediate = false
  } = {}) {
    stopChatNotificationMonitor("config-change");
    if (!shouldRunChatMessageMonitor()) {
      return;
    }
    const local = num2;
    acquireTaskRuntimeGuard(CHAT_NOTIFICATION_RUNTIME_GUARD, {
      type: "message-notification-monitor",
      mode: "event",
      safetyScanIntervalMs: CHAT_SAFETY_SCAN_INTERVAL_MS,
      keepaliveMaxAccounts: value3,
      messageCenterActive: !!flag3,
      webhookEnabled: fn5()
    });
    const value = immediate ? 400 : 1200;
    const result = setTimeout(() => {
      syncChatMonitorKeepalives(local).catch(arg1 => {
        console.warn("[ChatNotify] 常驻监听同步失败: " + arg1.message);
      }).finally(() => {
        if (local === num2 && shouldRunChatMessageMonitor()) {
          fn22(CHAT_SAFETY_SCAN_INTERVAL_MS);
        }
      });
    }, value);
    result.unref?.();
    fn9();
  }
  function fn27(arg1) {
    const result = Math.round(Number(arg1?.x));
    const result2 = Math.round(Number(arg1?.y));
    const result3 = Math.round(Number(arg1?.width));
    const result4 = Math.round(Number(arg1?.height));
    if (![result, result2, result3, result4].every(Number.isFinite)) {
      return null;
    }
    if (result3 < 120 || result4 < 120) {
      return null;
    }
    return {
      x: Math.max(0, result),
      y: Math.max(0, result2),
      width: Math.max(120, result3),
      height: Math.max(120, result4)
    };
  }
  function fn28(arg1, arg2) {
    const result = fn27(arg2);
    if (!arg1 || arg1.webContents?.isDestroyed?.() || !result) {
      return false;
    }
    try {
      arg1.setBounds(result);
      return true;
    } catch (error) {
      console.warn("[Chat] 更新消息视图坐标失败: " + error.message);
      return false;
    }
  }
  function fn29(arg1) {
    if (!arg1 || arg1.isDestroyed?.()) {
      return;
    }
    try {
      arg1.insertCSS("\n                [class*=\"chat-list\"], [class*=\"ChatList\"],\n                [class*=\"message-list\"], [class*=\"MessageList\"],\n                [class*=\"message\"], [class*=\"Message\"],\n                [class*=\"bubble\"], [class*=\"Bubble\"],\n                [class*=\"item\"], [class*=\"Item\"],\n                [class*=\"scroll\"], [class*=\"Scroll\"] {\n                    transform-style: preserve-3d !important;\n                    backface-visibility: hidden !important;\n                    will-change: transform !important;\n                }\n            ").catch(() => {});
    } catch (error) {}
  }
  function fn30(arg1, arg2 = null) {
    if (!arg1?.webContents || arg1.webContents.isDestroyed?.()) {
      return;
    }
    const value = arg1.webContents;
    fn29(value);
    try {
      value.setZoomFactor(1);
    } catch (error) {}
    const result = fn27(arg2 || arg1.getBounds?.());
    if (result) {
      fn28(arg1, {
        ...result,
        width: Math.max(120, result.width - 1)
      });
      setTimeout(() => {
        if (value.isDestroyed?.()) {
          return;
        }
        fn28(arg1, result);
        try {
          value.setZoomFactor(1.0001);
        } catch (error) {}
        setTimeout(() => {
          if (value.isDestroyed?.()) {
            return;
          }
          try {
            value.setZoomFactor(1);
          } catch (error) {}
          options.notifyAutomationViewportChanged?.(value, {
            force: true
          });
          value.executeJavaScript("\n                        (() => {\n                            try {\n                                const styleId = '__radar_chat_transform_fix__';\n                                if (!document.getElementById(styleId)) {\n                                    const style = document.createElement('style');\n                                    style.id = styleId;\n                                    style.textContent = `\n                                        [class*=\"chat-list\"], [class*=\"ChatList\"],\n                                        [class*=\"message-list\"], [class*=\"MessageList\"],\n                                        [class*=\"message\"], [class*=\"Message\"],\n                                        [class*=\"bubble\"], [class*=\"Bubble\"],\n                                        [class*=\"item\"], [class*=\"Item\"],\n                                        [class*=\"scroll\"], [class*=\"Scroll\"] {\n                                            transform-style: preserve-3d !important;\n                                            backface-visibility: hidden !important;\n                                            will-change: transform !important;\n                                        }\n                                    `;\n                                    (document.head || document.documentElement).appendChild(style);\n                                }\n                                const nodes = Array.from(document.querySelectorAll('[class*=\"message\"], [class*=\"Message\"], [class*=\"scroll\"], [class*=\"Scroll\"]'));\n                                for (const node of nodes) {\n                                    if (node.scrollHeight > node.clientHeight + 40) {\n                                        node.scrollTop = node.scrollHeight;\n                                    }\n                                }\n                                window.dispatchEvent(new Event('resize'));\n                            } catch (_) {}\n                            return true;\n                        })()\n                    ", true).catch(() => {});
        }, 60);
      }, 60);
      return;
    }
    options.notifyAutomationViewportChanged?.(value, {
      force: true
    });
  }
  function fn31() {
    if (typeof options.hideAutomationViews === "function") {
      options.hideAutomationViews();
      return;
    }
    const value = options.detachAutomationViewFromWindow;
    if (typeof value !== "function") {
      return;
    }
    const local = options.getPlatformViews?.() || new Map();
    const local2 = options.getInteractionViewsMap?.() || new Map();
    local.forEach((arg1, arg2) => {
      value(arg2, arg1);
      const result = local2.get(arg2);
      if (result) {
        value(arg2, result);
      }
    });
  }
  function destroyActiveChatView(text = "closed", {
    notify = true
  } = {}) {
    num += 1;
    const local = local7;
    if (!local) {
      return false;
    }
    local7 = null;
    local5.delete(local.viewKey);
    if (local.readyProbeTimer) {
      clearTimeout(local.readyProbeTimer);
      local.readyProbeTimer = null;
    }
    if (local.messageScanTimer) {
      clearInterval(local.messageScanTimer);
      local.messageScanTimer = null;
    }
    options.destroyAutomationBrowserView(local.view, local.viewKey, "chat");
    if (notify) {
      fn({
        status: "closed",
        viewKey: local.viewKey,
        accountId: local.accountId,
        reason: text
      });
    }
    console.log("[Chat] 消息视图已关闭: " + local.viewKey + " (" + text + ")");
    if (shouldRunChatMessageMonitor() && local.accountId) {
      const result = fn3(local.accountId);
      if (result?.status === "online") {
        fn21(result).catch(arg1 => {
          console.warn("[ChatNotify] 关闭消息页后重建监听失败: " + arg1.message);
        });
      }
    }
    return true;
  }
  function setActiveChatViewAttached(arg1) {
    const local2 = local7;
    const result = local();
    if (!local2?.view || local2.view.webContents?.isDestroyed?.()) {
      return false;
    }
    if (!result || result.isDestroyed()) {
      return false;
    }
    const result2 = result.getBrowserViews().includes(local2.view);
    if (arg1) {
      if (!result2) {
        try {
          result.addBrowserView(local2.view);
        } catch (error) {
          console.warn("[Chat] 重新挂载消息视图失败: " + error.message);
          return false;
        }
        if (local2.bounds) {
          fn28(local2.view, local2.bounds);
        }
        options.safeSetTopBrowserView(local2.view, {
          context: "chat-reattach:" + local2.viewKey
        });
      }
      local2.detachedForOverlay = false;
      return true;
    }
    if (result2) {
      try {
        result.removeBrowserView(local2.view);
      } catch (error) {
        console.warn("[Chat] 临时摘除消息视图失败: " + error.message);
        return false;
      }
    }
    local2.detachedForOverlay = true;
    return true;
  }
  async function openChatView({
    accountId: accountId,
    name = "",
    proxy = null,
    bounds = null
  } = {}) {
    const result = local();
    try {
      options.destroyConflictingView?.("chat-opened", {
        notify: true
      });
    } catch (error) {}
    const result2 = String(accountId || "").trim();
    if (!result2) {
      return {
        success: false,
        message: "缺少抖音账号信息"
      };
    }
    if (!result || result.isDestroyed()) {
      return {
        success: false,
        message: "主窗口不可用"
      };
    }
    const value = "douyin_" + result2;
    const result3 = fn27(bounds);
    if (!result3) {
      return {
        success: false,
        message: "消息窗口尺寸无效"
      };
    }
    const local2 = local7;
    if (local2?.viewKey === value && !local2.view?.webContents?.isDestroyed?.()) {
      fn31();
      local2.bounds = result3;
      fn28(local2.view, result3);
      if (!result.getBrowserViews().includes(local2.view)) {
        result.addBrowserView(local2.view);
      }
      options.safeSetTopBrowserView(local2.view, {
        context: "chat-reopen:" + value
      });
      try {
        local2.view.webContents.setUserAgent(local3());
      } catch (error) {}
      fn({
        status: local2.status || "ready",
        viewKey: value,
        accountId: result2,
        url: local2.view.webContents.getURL()
      });
      fn19(local2);
      fn30(local2.view, result3);
      return {
        success: true,
        reused: true,
        viewKey: value
      };
    }
    destroyActiveChatView("account-switch", {
      notify: false
    });
    const local4 = ++num;
    const browserView = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true,
        partition: "persist:automation:" + value,
        backgroundThrottling: true,
        spellcheck: true
      }
    });
    const obj = {
      view: browserView,
      viewKey: value,
      accountId: result2,
      name: String(name || ""),
      status: "loading",
      generation: local4,
      bounds: result3
    };
    local7 = obj;
    local5.set(value, browserView);
    browserView.setBackgroundColor("#171923");
    browserView.webContents.setUserAgent(local3());
    attachProtocolGuard(browserView.webContents, value + ":chat");
    options.configureAutomationSession?.(browserView.webContents.session, value);
    const local8 = () => local7 === obj && obj.generation === local4 && !browserView.webContents.isDestroyed();
    const local9 = (arg1, options = {}) => {
      if (!local8()) {
        return;
      }
      obj.status = arg1;
      fn({
        status: arg1,
        viewKey: value,
        accountId: result2,
        ...options
      });
    };
    const local10 = () => {
      if (!local8()) {
        return;
      }
      const result = browserView.webContents.getURL();
      if (!/^https:\/\/(?:www\.)?douyin\.com\//i.test(result)) {
        return;
      }
      local9("ready", {
        url: result
      });
      fn19(obj);
      fn30(browserView, obj.bounds);
      const value = "douyin_" + result2 + ":message-monitor";
      const result3 = local6.get(value);
      if (result3) {
        fn20(value, result3);
      }
    };
    const local11 = () => {
      if (obj.readyProbeTimer) {
        clearTimeout(obj.readyProbeTimer);
      }
      obj.readyProbeTimer = setTimeout(async () => {
        obj.readyProbeTimer = null;
        if (!local8() || obj.status !== "loading") {
          return;
        }
        try {
          const result = await browserView.webContents.executeJavaScript("document.readyState", true);
          if (result === "interactive" || result === "complete") {
            local10();
          }
        } catch (error) {}
      }, 3000);
    };
    browserView.webContents.on("did-start-loading", () => {
      local9("loading");
      local11();
    });
    browserView.webContents.on("dom-ready", local11);
    try {
      browserView.webContents.setMaxListeners?.(20);
    } catch (error) {}
    browserView.webContents.removeAllListeners("did-stop-loading");
    browserView.webContents.on("did-stop-loading", local10);
    browserView.webContents.on("did-finish-load", local10);
    browserView.webContents.on("did-navigate", (arg1, arg2) => {
      local9(obj.status || "loading", {
        url: arg2
      });
    });
    browserView.webContents.on("did-navigate-in-page", (arg1, arg2) => {
      local9(obj.status || "ready", {
        url: arg2
      });
    });
    browserView.webContents.on("did-fail-load", (arg1, arg2, arg3, arg4, arg5) => {
      if (!arg5 || arg2 === -3) {
        return;
      }
      local9("error", {
        url: arg4,
        message: arg3 || "页面加载失败 (" + arg2 + ")"
      });
    });
    browserView.webContents.on("render-process-gone", (arg1, options = {}) => {
      local9("error", {
        message: "消息页面异常退出：" + (options.reason || "unknown")
      });
    });
    browserView.webContents.on("unresponsive", () => {
      local9("error", {
        message: "消息页面暂时无响应，可点击刷新重试"
      });
    });
    fn31();
    fn28(browserView, result3);
    result.addBrowserView(browserView);
    options.safeSetTopBrowserView(browserView, {
      context: "chat-open:" + value
    });
    local9("loading", {
      url: DOUYIN_CHAT_URL
    });
    await options.bindAutomationViewProxy?.({
      proxy: proxy
    }, value, browserView.webContents.session);
    if (!local8()) {
      return {
        success: false,
        superseded: true,
        message: "账号已切换"
      };
    }
    try {
      await browserView.webContents.loadURL(DOUYIN_CHAT_URL);
      if (!local8()) {
        return {
          success: false,
          superseded: true,
          message: "账号已切换"
        };
      }
      return {
        success: true,
        reused: false,
        viewKey: value,
        url: browserView.webContents.getURL()
      };
    } catch (error) {
      if (!local8()) {
        return {
          success: false,
          superseded: true,
          message: "账号已切换"
        };
      }
      local9("error", {
        message: error.message || "消息页面加载失败"
      });
      return {
        success: false,
        viewKey: value,
        message: error.message || "消息页面加载失败"
      };
    }
  }
  function getChatViewState() {
    const local2 = local7;
    const result = local();
    if (!local2 || local2.view?.webContents?.isDestroyed?.()) {
      return {
        active: false,
        count: 0
      };
    }
    const local3 = !!result && !result.isDestroyed() && !!result.getBrowserViews().includes(local2.view);
    return {
      active: true,
      count: local5.size,
      viewKey: local2.viewKey,
      accountId: local2.accountId,
      status: local2.status,
      url: local2.view.webContents.getURL(),
      attached: local3,
      bounds: local2.view.getBounds()
    };
  }
  async function fn36({
    viewKey: viewKey
  } = {}) {
    const local = local7;
    if (!local || local.view?.webContents?.isDestroyed?.()) {
      return {
        success: false,
        message: "消息窗口尚未打开"
      };
    }
    if (viewKey && local.viewKey !== viewKey) {
      return {
        success: false,
        message: "当前账号已切换"
      };
    }
    local.status = "loading";
    fn({
      status: "loading",
      viewKey: local.viewKey,
      accountId: local.accountId
    });
    try {
      await local.view.webContents.reload();
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "刷新失败"
      };
    }
  }
  function fn37({
    viewKey: viewKey,
    bounds: bounds
  } = {}) {
    const local = local7;
    if (!local || viewKey && local.viewKey !== viewKey) {
      return;
    }
    const result = fn27(bounds);
    if (!result) {
      return;
    }
    local.bounds = result;
    if (local.detachedForOverlay) {
      return;
    }
    fn28(local.view, result);
  }
  async function fn38(arg1) {
    const flag = !!arg1;
    if (flag && !options.ensureMessageCenterAccess?.()) {
      flag3 = false;
      syncChatNotificationMonitor({
        immediate: false
      });
      return {
        success: false,
        active: false,
        message: MESSAGE_CENTER_FREE_BLOCK_MSG,
        state: getChatUnreadStatePayload()
      };
    }
    if (flag3 === flag) {
      return {
        success: true,
        active: flag,
        unchanged: true,
        state: getChatUnreadStatePayload()
      };
    }
    flag3 = flag;
    console.log("[ChatNotify] 消息聚合会话 " + (flag ? "已打开" : "已关闭") + "，多账号监听=" + shouldRunChatMessageMonitor());
    syncChatNotificationMonitor({
      immediate: flag || isBackgroundChatMonitorEnabled()
    });
    return {
      success: true,
      active: flag,
      state: getChatUnreadStatePayload()
    };
  }
  async function fn39(options2 = {}) {
    const result2 = normalizeChatNotificationConfig(options2);
    if (result2.enabled && !options.ensureMessageCenterAccess?.()) {
      return {
        success: false,
        message: MESSAGE_CENTER_FREE_BLOCK_MSG
      };
    }
    if (result2.enabled && result2.webhookType !== "none" && !isHttpWebhookUrl(result2.webhookUrl)) {
      return {
        success: false,
        message: "请填写有效的飞书或钉钉 Webhook 地址，或选择「不推送」"
      };
    }
    result = result2;
    value.set(CHAT_NOTIFICATION_CONFIG_KEY, result2);
    syncChatNotificationMonitor({
      immediate: shouldRunChatMessageMonitor()
    });
    return {
      success: true,
      config: {
        ...result2
      },
      state: getChatUnreadStatePayload()
    };
  }
  async function fn40(options2 = {}) {
    if (!options.ensureMessageCenterAccess?.()) {
      return {
        success: false,
        message: MESSAGE_CENTER_FREE_BLOCK_MSG
      };
    }
    const result = normalizeChatNotificationConfig({
      ...options2,
      enabled: true
    });
    if (result.webhookType === "none") {
      return {
        success: false,
        message: "当前为「不推送」，无需测试 Webhook"
      };
    }
    if (!isHttpWebhookUrl(result.webhookUrl)) {
      return {
        success: false,
        message: "请先填写有效的 Webhook 地址"
      };
    }
    return fn12({
      accountId: "test-account",
      productName: local4(),
      receiverNickname: "接收账号昵称（测试）",
      receiverRemark: "账号备注名（测试）",
      sender: "发送消息的账号（测试）",
      receiverDouyinId: "douyin_test_receiver",
      content: "这是一条消息聚合 Webhook 测试内容",
      unreadCount: 2,
      conversationUnreadCount: 2,
      accountUnreadCount: 5,
      detectedAt: Date.now()
    }, result, {
      force: true
    });
  }
  function stopMessageCenterIfNeeded() {
    if (!local2()) {
      return;
    }
    let flag = false;
    if (flag3) {
      flag3 = false;
      flag = true;
    }
    if (result?.enabled) {
      result = {
        ...result,
        enabled: false
      };
      try {
        value.set(CHAT_NOTIFICATION_CONFIG_KEY, result);
      } catch (error) {}
      flag = true;
    }
    if (local7) {
      destroyActiveChatView("auth-downgraded");
      flag = true;
    }
    if (options.destroyConflictingView?.("auth-downgraded")) {
      flag = true;
    }
    if (flag) {
      console.log("[Auth-Shield] 授权降级，已关闭消息聚合与后台提醒");
      syncChatNotificationMonitor({
        immediate: false
      });
      const result2 = local();
      if (result2 && !result2.isDestroyed()) {
        try {
          result2.webContents.send("chat-notification-config", {
            ...result
          });
          result2.webContents.send("chat-unread-state", getChatUnreadStatePayload());
        } catch (error) {}
      }
    }
  }
  function handleAppQuit() {
    flag3 = false;
    stopChatNotificationMonitor("app-quit");
    destroyActiveChatView("app-quit");
  }
  function realignActiveChatViewBoundsAfterAutomationClose() {
    const local2 = local7;
    if (!local2?.bounds || !local2?.view) {
      return;
    }
    setTimeout(() => {
      if (local7 !== local2) {
        return;
      }
      if (local2.view.webContents?.isDestroyed?.()) {
        return;
      }
      const result = local();
      fn28(local2.view, local2.bounds);
      const result2 = local2.view.getBounds();
      const value = local2.bounds;
      const result3 = ["x", "y", "width", "height"].some(arg1 => result2[arg1] !== value[arg1]);
      if (result3 && result && !result.isDestroyed()) {
        console.warn("[Chat] 检测到原生坐标漂移，重新挂载并校准: " + local2.viewKey + (" actual=" + JSON.stringify(result2) + " expected=" + JSON.stringify(value)));
        try {
          if (result.getBrowserViews().includes(local2.view)) {
            result.removeBrowserView(local2.view);
          }
          result.addBrowserView(local2.view);
        } catch (error) {
          console.warn("[Chat] 重新挂载消息视图失败: " + error.message);
        }
        fn28(local2.view, value);
      }
      options.safeSetTopBrowserView?.(local2.view, {
        context: "chat-realign:" + local2.viewKey
      });
    }, 50);
  }
  function registerIpc() {
    if (flag) {
      return;
    }
    flag = true;
    ipcMain.handle("open-chat-view", async (arg1, options2 = {}) => {
      if (!options.ensureMessageCenterAccess?.()) {
        return {
          success: false,
          message: MESSAGE_CENTER_FREE_BLOCK_MSG
        };
      }
      try {
        return await openChatView(options2);
      } catch (error) {
        console.error("[Chat] 打开消息视图失败:", error);
        return {
          success: false,
          message: error.message || "打开消息视图失败"
        };
      }
    });
    ipcMain.on("update-chat-view-bounds", (arg1, options = {}) => {
      fn37(options);
    });
    ipcMain.on("set-chat-view-attached", (arg1, {
      attached = true
    } = {}) => {
      setActiveChatViewAttached(!!attached);
    });
    ipcMain.handle("reload-chat-view", async (arg1, options = {}) => fn36(options));
    ipcMain.on("destroy-chat-view", (arg1, {
      reason = "renderer-closed"
    } = {}) => {
      destroyActiveChatView(reason);
    });
    ipcMain.handle("set-message-center-session", async (arg1, {
      active: active
    } = {}) => fn38(active));
    ipcMain.handle("get-chat-view-state", () => getChatViewState());
    ipcMain.handle("get-chat-notification-config", () => ({
      ...result
    }));
    ipcMain.handle("save-chat-notification-config", async (arg1, options = {}) => fn39(options));
    ipcMain.handle("get-chat-unread-state", () => getChatUnreadStatePayload());
    ipcMain.handle("test-chat-message-webhook", async (arg1, options = {}) => fn40(options));
  }
  return {
    DOUYIN_CHAT_URL: DOUYIN_CHAT_URL,
    MESSAGE_CENTER_FREE_BLOCK_MSG: MESSAGE_CENTER_FREE_BLOCK_MSG,
    chatViewsMap: local5,
    chatMonitorWindowsMap: local6,
    registerIpc: registerIpc,
    stopMessageCenterIfNeeded: stopMessageCenterIfNeeded,
    syncChatNotificationMonitor: syncChatNotificationMonitor,
    shouldRunChatMessageMonitor: shouldRunChatMessageMonitor,
    syncChatMonitorKeepalives: syncChatMonitorKeepalives,
    isBackgroundChatMonitorEnabled: isBackgroundChatMonitorEnabled,
    getChatNotificationMonitorGeneration: () => num2,
    openChatView: openChatView,
    destroyActiveChatView: destroyActiveChatView,
    stopChatNotificationMonitor: stopChatNotificationMonitor,
    handleAppQuit: handleAppQuit,
    realignActiveChatViewBoundsAfterAutomationClose: realignActiveChatViewBoundsAfterAutomationClose,
    setActiveChatViewAttached: setActiveChatViewAttached,
    getChatViewState: getChatViewState,
    getChatUnreadStatePayload: getChatUnreadStatePayload,
    getActiveChatViewState: () => local7
  };
}
module.exports = {
  DOUYIN_CHAT_URL: DOUYIN_CHAT_URL,
  MESSAGE_CENTER_FREE_BLOCK_MSG: MESSAGE_CENTER_FREE_BLOCK_MSG,
  DEFAULT_CHAT_NOTIFICATION_CONFIG: DEFAULT_CHAT_NOTIFICATION_CONFIG,
  createMessageCenter: createMessageCenter
};
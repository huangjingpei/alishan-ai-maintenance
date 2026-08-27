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
function createMessageCenter(_0xee7ec1 = {}) {
  const _0x1a779a = _0xee7ec1.store;
  const _0x226cd2 = _0xee7ec1.axios;
  const _0x9d234 = () => typeof _0xee7ec1.getMainWindow === "function" ? _0xee7ec1.getMainWindow() : null;
  const _0x39d4b6 = () => typeof _0xee7ec1.getIsCurrentUserFree === "function" ? !!_0xee7ec1.getIsCurrentUserFree() : false;
  const _0x37e6fc = () => typeof _0xee7ec1.getAutomationUserAgent === "function" ? _0xee7ec1.getAutomationUserAgent() : undefined;
  const _0x182364 = () => typeof _0xee7ec1.getAppProductName === "function" ? _0xee7ec1.getAppProductName() : "获客雷达";
  const _0x1d0d75 = Number(_0xee7ec1.maxKeepaliveAccounts) > 0 ? Number(_0xee7ec1.maxKeepaliveAccounts) : 10;
  const _0x15c218 = _0xee7ec1.chatViewsMap || new Map();
  const _0x5cb20c = _0xee7ec1.chatMonitorWindowsMap || new Map();
  let _0x404838 = false;
  let _0x1acd82 = null;
  let _0x27bbf2 = 0;
  let _0x2218de = normalizeChatNotificationConfig(_0x1a779a.get(CHAT_NOTIFICATION_CONFIG_KEY, {}));
  let _0x366146 = _0x1a779a.get(CHAT_NOTIFICATION_STATES_KEY, {}) || {};
  let _0x4324ac = _0x1a779a.get(CHAT_NOTIFICATION_SUMMARIES_KEY, {}) || {};
  let _0x27d19d = null;
  let _0x3e47c6 = false;
  let _0x46a1cb = 0;
  let _0x2bfa83 = null;
  let _0x41caaf = false;
  const _0xf07603 = new Map();
  const _0x3cc9a7 = new Map();
  const _0x257f8e = new Map();
  const _0x11256e = new Map();
  const _0x156cd5 = new Map();
  function _0x2794bf(_0x44450d = {}) {
    const _0x4fd5da = _0x9d234();
    if (!_0x4fd5da || _0x4fd5da.isDestroyed() || _0x4fd5da.webContents.isDestroyed()) {
      return;
    }
    try {
      _0x4fd5da.webContents.send("chat-view-status", {
        at: Date.now(),
        ..._0x44450d
      });
    } catch (_0xce4c83) {}
  }
  function _0xf1c98e() {
    const _0x1ed2c0 = _0x1a779a.get("account_pool", []);
    return (Array.isArray(_0x1ed2c0) ? _0x1ed2c0 : []).filter(_0x793cb9 => _0x793cb9 && (!_0x793cb9.platform || _0x793cb9.platform === "douyin"));
  }
  function _0x482253(_0x4fa962) {
    return _0xf1c98e().find(_0x256c84 => String(_0x256c84.id) === String(_0x4fa962)) || null;
  }
  function _0x431f4d() {
    return !_0x39d4b6() && !!_0x2218de.enabled;
  }
  function _0xc78b4d() {
    return _0x431f4d() && isChatWebhookPushConfigured(_0x2218de);
  }
  function _0xbd58af() {
    if (_0x39d4b6()) {
      return false;
    }
    return !!_0x41caaf || _0x431f4d();
  }
  function _0xa90a56() {
    const _0x54a6b4 = _0xf1c98e().filter(_0x511dcd => _0x511dcd.status === "online");
    const _0x2274e7 = _0x1acd82?.accountId ? String(_0x1acd82.accountId) : "";
    const _0x33941f = [];
    if (_0x2274e7) {
      const _0x2e480a = _0x54a6b4.find(_0x70f27e => String(_0x70f27e.id) === _0x2274e7);
      if (_0x2e480a) {
        _0x33941f.push(_0x2e480a);
      }
    }
    for (const _0x9a30d0 of _0x54a6b4) {
      if (String(_0x9a30d0.id) === _0x2274e7) {
        continue;
      }
      _0x33941f.push(_0x9a30d0);
      if (_0x33941f.length >= _0x1d0d75) {
        break;
      }
    }
    return _0x33941f.slice(0, _0x1d0d75);
  }
  function _0x33f720() {
    const _0x425535 = {};
    let _0x48ce96 = 0;
    Object.entries(_0x4324ac || {}).forEach(([_0x1b1f1f, _0x319f5f]) => {
      const _0x15bfb7 = Math.max(0, Math.min(9999, Number(_0x319f5f?.unreadCount || 0)));
      _0x425535[_0x1b1f1f] = {
        accountId: _0x1b1f1f,
        unreadCount: _0x15bfb7,
        lastSender: String(_0x319f5f?.lastSender || "").slice(0, 120),
        lastContent: String(_0x319f5f?.lastContent || "").slice(0, 500),
        lastScanAt: Number(_0x319f5f?.lastScanAt || 0),
        source: String(_0x319f5f?.source || ""),
        error: String(_0x319f5f?.error || "")
      };
      _0x48ce96 += _0x15bfb7;
    });
    return {
      totalUnread: Math.min(9999, _0x48ce96),
      accounts: _0x425535,
      monitor: {
        enabled: !!_0x2218de.enabled,
        webhookEnabled: _0xc78b4d(),
        webhookType: String(_0x2218de.webhookType || "feishu"),
        messageCenterActive: !!_0x41caaf,
        running: !!_0x3e47c6,
        mode: "event",
        keepaliveMaxAccounts: _0x1d0d75,
        safetyScanIntervalSeconds: Math.round(CHAT_SAFETY_SCAN_INTERVAL_MS / 1000),
        keepaliveCount: _0x5cb20c.size,
        lastRun: _0x2bfa83
      }
    };
  }
  function _0x563f20() {
    const _0x49359b = _0x9d234();
    if (!_0x49359b || _0x49359b.isDestroyed() || _0x49359b.webContents.isDestroyed()) {
      return;
    }
    try {
      _0x49359b.webContents.send("chat-unread-state", _0x33f720());
    } catch (_0x35657e) {}
  }
  function _0xadf724() {
    _0x1a779a.set(CHAT_NOTIFICATION_STATES_KEY, _0x366146 || {});
    _0x1a779a.set(CHAT_NOTIFICATION_SUMMARIES_KEY, _0x4324ac || {});
  }
  function _0x5ea2ef(_0x2fa299, _0x56e426, _0x1686b9 = "") {
    const _0x2e78a3 = _0x4324ac[_0x2fa299] || {};
    _0x4324ac = {
      ..._0x4324ac,
      [_0x2fa299]: {
        ..._0x2e78a3,
        accountId: _0x2fa299,
        source: _0x1686b9,
        error: String(_0x56e426 || "消息列表暂不可读").slice(0, 300),
        lastScanAt: Date.now()
      }
    };
    _0xadf724();
    _0x563f20();
  }
  async function _0x152623(_0x1d2818, _0x21fa74 = _0x2218de, {
    force = false
  } = {}) {
    const _0x4d2928 = normalizeChatNotificationConfig(_0x21fa74);
    if (!force && !_0x4d2928.enabled || !isChatWebhookPushConfigured(_0x4d2928)) {
      return {
        success: false,
        skipped: true,
        message: "Webhook 未启用或地址无效"
      };
    }
    try {
      const _0x2a955c = await sendChatMessageWebhookRequest({
        axios: _0x226cd2,
        config: {
          ..._0x4d2928,
          enabled: true
        },
        event: _0x1d2818,
        timeout: 10000,
        force: true
      });
      const _0x5a6031 = !!_0x2a955c.success;
      const _0x48c405 = {
        success: _0x5a6031,
        message: _0x2a955c.message || (_0x5a6031 ? "推送成功" : "机器人返回失败状态"),
        accountId: _0x1d2818.accountId,
        sender: _0x1d2818.sender,
        at: Date.now()
      };
      const _0x3ba190 = _0x9d234();
      if (_0x3ba190 && !_0x3ba190.isDestroyed()) {
        _0x3ba190.webContents.send("chat-webhook-result", _0x48c405);
      }
      return _0x48c405;
    } catch (_0x34c92a) {
      const _0x1a645e = {
        success: false,
        message: _0x34c92a.message || "Webhook 推送失败",
        accountId: _0x1d2818.accountId,
        sender: _0x1d2818.sender,
        at: Date.now()
      };
      console.warn("[ChatNotify] Webhook 推送失败 account=" + _0x1d2818.accountId + ": " + _0x1a645e.message);
      const _0x252b49 = _0x9d234();
      if (_0x252b49 && !_0x252b49.isDestroyed()) {
        _0x252b49.webContents.send("chat-webhook-result", _0x1a645e);
      }
      return _0x1a645e;
    }
  }
  async function _0x115110(_0x35e3db, _0x209cb5, _0x43c060) {
    const _0x318d13 = String(_0x35e3db?.id || "");
    const _0x1b40c3 = String(_0x209cb5.content || "").trim().slice(0, 200);
    const _0x77294d = [_0x318d13, _0x1b40c3].join("|");
    if (_0x77294d !== "|" && _0x3cc9a7.has(_0x77294d)) {
      console.log("[ChatNotify] 跳过重复推送 account=" + _0x318d13 + " content=" + _0x1b40c3.slice(0, 40));
      return {
        skipped: true,
        reason: "duplicate"
      };
    }
    if (_0x77294d !== "|") {
      _0x3cc9a7.set(_0x77294d, Date.now());
      if (_0x3cc9a7.size > 2000) {
        const _0x16a4fb = Date.now() - 21600000;
        for (const [_0xef2e4, _0x2d08c0] of _0x3cc9a7.entries()) {
          if (_0x2d08c0 < _0x16a4fb) {
            _0x3cc9a7.delete(_0xef2e4);
          }
        }
      }
    }
    const _0xd0771f = Math.max(0, Number(_0x366146[_0x318d13]?.unreadCount || 0));
    const _0x536fe1 = {
      accountId: _0x318d13,
      productName: _0x182364(),
      receiverNickname: _0x35e3db?.nickname || "",
      receiverRemark: _0x35e3db?.name || "",
      receiverDouyinId: _0x35e3db?.douyinId || "",
      sender: _0x209cb5.sender,
      content: _0x209cb5.content,
      unreadCount: _0x209cb5.unreadCount,
      conversationUnreadCount: _0x209cb5.unreadCount,
      accountUnreadCount: _0xd0771f,
      conversationKey: _0x209cb5.conversationKey,
      fingerprint: _0x209cb5.fingerprint,
      detectedAt: _0x209cb5.detectedAt || Date.now(),
      source: _0x43c060
    };
    const _0x1a2a89 = _0x9d234();
    if (_0x1a2a89 && !_0x1a2a89.isDestroyed()) {
      _0x1a2a89.webContents.send("chat-new-message", _0x536fe1);
    }
    if (_0x2218de.enabled && isChatWebhookPushConfigured(_0x2218de)) {
      await _0x152623(_0x536fe1, _0x2218de);
    }
    return {
      skipped: false
    };
  }
  async function _0x3cd207(_0xb1d9b7, _0x3eba20, {
    source = "active"
  } = {}) {
    if (!_0xb1d9b7 || _0xb1d9b7.isDestroyed?.() || !_0x3eba20?.id) {
      return {
        success: false,
        message: "消息页面不可用"
      };
    }
    const _0x214683 = String(_0x3eba20.id);
    if (_0xf07603.has(_0x214683)) {
      return _0xf07603.get(_0x214683);
    }
    const _0x247e0d = (async () => {
      let _0x550763;
      try {
        _0x550763 = await _0xb1d9b7.executeJavaScript(getChatConversationSnapshotScript(), true);
      } catch (_0x5ec3fb) {
        _0x5ea2ef(_0x214683, _0x5ec3fb.message || "读取消息列表失败", source);
        return {
          success: false,
          message: _0x5ec3fb.message || "读取消息列表失败"
        };
      }
      if (!_0x550763?.success || !Array.isArray(_0x550763.conversations)) {
        const _0x50ac17 = _0x550763?.error || (_0x550763?.diagnostics?.readyState !== "complete" ? "消息页面仍在加载" : "暂未识别到会话列表");
        _0x5ea2ef(_0x214683, _0x50ac17, source);
        return {
          success: false,
          message: _0x50ac17,
          diagnostics: _0x550763?.diagnostics || null
        };
      }
      const _0x822a70 = _0x366146[_0x214683] || {};
      const _0x4f4567 = reconcileConversationSnapshot(_0x822a70, _0x550763.conversations, Date.now());
      _0x366146 = {
        ..._0x366146,
        [_0x214683]: _0x4f4567.state
      };
      _0x4324ac = {
        ..._0x4324ac,
        [_0x214683]: {
          accountId: _0x214683,
          unreadCount: _0x4f4567.state.unreadCount,
          lastSender: _0x4f4567.state.lastSender,
          lastContent: _0x4f4567.state.lastContent,
          lastScanAt: _0x4f4567.state.lastScanAt,
          source: source,
          error: ""
        }
      };
      _0xadf724();
      _0x563f20();
      for (const _0x398140 of _0x4f4567.events) {
        await _0x115110(_0x3eba20, _0x398140, source);
      }
      return {
        success: true,
        eventCount: _0x4f4567.events.length,
        unreadCount: _0x4f4567.state.unreadCount,
        conversationCount: _0x4f4567.state.conversationCount,
        diagnostics: _0x550763.diagnostics || null
      };
    })().finally(() => {
      _0xf07603.delete(_0x214683);
    });
    _0xf07603.set(_0x214683, _0x247e0d);
    return _0x247e0d;
  }
  function _0x4790af(_0x44b3f9) {
    const _0x421bf5 = String(_0x44b3f9 || "");
    if (!_0x421bf5) {
      return null;
    }
    if (_0x1acd82?.accountId === _0x421bf5 && !_0x1acd82.view?.webContents?.isDestroyed?.()) {
      return _0x1acd82.view.webContents;
    }
    const _0x15a8a2 = "douyin_" + _0x421bf5 + ":message-monitor";
    const _0x28ccdb = _0x5cb20c.get(_0x15a8a2);
    if (_0x28ccdb && !_0x28ccdb.isDestroyed() && !_0x28ccdb.webContents.isDestroyed()) {
      return _0x28ccdb.webContents;
    }
    return null;
  }
  function _0x4a4e9f(_0x5bee93) {
    const _0x2bb0b3 = String(_0x5bee93 || "");
    if (!_0x2bb0b3 || !_0xbd58af()) {
      return;
    }
    const _0x158183 = _0x257f8e.get(_0x2bb0b3);
    if (_0x158183) {
      clearTimeout(_0x158183);
    }
    const _0x523d5e = setTimeout(() => {
      _0x257f8e.delete(_0x2bb0b3);
      const _0x3791e6 = _0x482253(_0x2bb0b3);
      const _0x43054b = _0x4790af(_0x2bb0b3);
      if (!_0x3791e6 || !_0x43054b) {
        return;
      }
      const _0x14ba34 = _0x1acd82?.accountId === _0x2bb0b3 ? "active" : "observer";
      _0x3cd207(_0x43054b, _0x3791e6, {
        source: _0x14ba34
      }).catch(() => {});
    }, CHAT_OBSERVER_DEBOUNCE_MS);
    _0x523d5e.unref?.();
    _0x257f8e.set(_0x2bb0b3, _0x523d5e);
  }
  async function _0x2f2332(_0x3d8475, _0x1e7308) {
    if (!_0x3d8475 || _0x3d8475.isDestroyed?.() || !_0x1e7308) {
      return {
        success: false
      };
    }
    const _0x2160ce = String(_0x1e7308);
    const _0x114c80 = _0x3d8475.id;
    let _0x1ff0b9 = _0x11256e.get(_0x114c80);
    if (!_0x1ff0b9) {
      const _0x2c588f = (_0x484658, _0x20c6cb, _0x393f62) => {
        const _0x4c4f27 = _0x11256e.get(_0x114c80);
        if (!_0x4c4f27) {
          return;
        }
        if (String(_0x393f62 || "").includes(CHAT_LIST_CHANGED_TOKEN)) {
          _0x4a4e9f(_0x4c4f27.accountId);
        }
      };
      _0x3d8475.on("console-message", _0x2c588f);
      _0x1ff0b9 = {
        accountId: _0x2160ce,
        handler: _0x2c588f
      };
      _0x11256e.set(_0x114c80, _0x1ff0b9);
      _0x3d8475.once("destroyed", () => {
        _0x11256e.delete(_0x114c80);
      });
    } else {
      _0x1ff0b9.accountId = _0x2160ce;
    }
    try {
      await _0x3d8475.executeJavaScript(getChatMonitorVisibilityKeepaliveScript(), true);
      const _0x59478c = await _0x3d8475.executeJavaScript(getChatListObserverInstallScript(CHAT_LIST_CHANGED_TOKEN), true);
      return _0x59478c || {
        success: true
      };
    } catch (_0x32f342) {
      return {
        success: false,
        message: _0x32f342.message || "安装列表观察者失败"
      };
    }
  }
  function _0x2b0e80(_0x5b9a19, _0x2766e9) {
    if (!_0x5b9a19 || _0x5b9a19.isDestroyed?.() || _0x5b9a19.__radarChatMonitorLifecycle) {
      return;
    }
    _0x5b9a19.__radarChatMonitorLifecycle = true;
    const _0xb25f8f = () => {
      if (_0x5b9a19.isDestroyed()) {
        return;
      }
      _0x2f2332(_0x5b9a19, _0x2766e9).catch(() => {});
    };
    _0x5b9a19.on("did-finish-load", _0xb25f8f);
    _0x5b9a19.on("dom-ready", _0xb25f8f);
  }
  function _0x4e0764(_0x35afc3) {
    if (!_0x35afc3 || _0x1acd82 !== _0x35afc3 || _0x35afc3.view?.webContents?.isDestroyed?.()) {
      return;
    }
    const _0x188490 = _0x482253(_0x35afc3.accountId) || {
      id: _0x35afc3.accountId,
      name: _0x35afc3.name || ""
    };
    const _0x53087c = _0x35afc3.view.webContents;
    _0x2b0e80(_0x53087c, _0x35afc3.accountId);
    _0x2f2332(_0x53087c, _0x35afc3.accountId).catch(() => {});
    const _0x2859c8 = setTimeout(() => {
      if (_0x1acd82 !== _0x35afc3 || _0x53087c.isDestroyed()) {
        return;
      }
      _0x3cd207(_0x53087c, _0x188490, {
        source: "active"
      }).catch(() => {});
    }, 800);
    _0x2859c8.unref?.();
  }
  function _0x4a11a5(_0x2c8c74, _0x59b03a) {
    if (_0x5cb20c.get(_0x2c8c74) === _0x59b03a) {
      _0x5cb20c.delete(_0x2c8c74);
    }
    if (!_0x59b03a || _0x59b03a.isDestroyed()) {
      return;
    }
    try {
      _0x59b03a.destroy();
    } catch (_0x4f829c) {}
  }
  async function _0x54a0c7(_0x4a0ea8, _0x57110e = _0x46a1cb) {
    if (!_0x4a0ea8?.id || _0x57110e !== _0x46a1cb || app.isQuitting) {
      return {
        success: false,
        skipped: true
      };
    }
    if (!_0xbd58af()) {
      return {
        success: false,
        skipped: true
      };
    }
    const _0x1b2d3e = String(_0x4a0ea8.id);
    if (_0x1acd82?.accountId === _0x1b2d3e && !_0x1acd82.view?.webContents?.isDestroyed?.()) {
      const _0x1fabb1 = "douyin_" + _0x1b2d3e + ":message-monitor";
      const _0x562bd6 = _0x5cb20c.get(_0x1fabb1);
      if (_0x562bd6) {
        _0x4a11a5(_0x1fabb1, _0x562bd6);
      }
      _0x2b0e80(_0x1acd82.view.webContents, _0x1b2d3e);
      await _0x2f2332(_0x1acd82.view.webContents, _0x1b2d3e);
      return _0x3cd207(_0x1acd82.view.webContents, _0x4a0ea8, {
        source: "active"
      });
    }
    if (_0x156cd5.has(_0x1b2d3e)) {
      return _0x156cd5.get(_0x1b2d3e);
    }
    const _0x4657fd = (async () => {
      const _0x5d4623 = "douyin_" + _0x1b2d3e + ":message-monitor";
      let _0x4376b3 = _0x5cb20c.get(_0x5d4623);
      if (_0x4376b3 && !_0x4376b3.isDestroyed() && !_0x4376b3.webContents.isDestroyed()) {
        _0x2b0e80(_0x4376b3.webContents, _0x1b2d3e);
        await _0x2f2332(_0x4376b3.webContents, _0x1b2d3e);
        return _0x3cd207(_0x4376b3.webContents, _0x4a0ea8, {
          source: "keepalive"
        });
      }
      if (_0x4376b3) {
        _0x4a11a5(_0x5d4623, _0x4376b3);
      }
      _0x4376b3 = new BrowserWindow({
        width: 900,
        height: 720,
        show: false,
        frame: false,
        skipTaskbar: true,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          sandbox: true,
          partition: "persist:automation:douyin_" + _0x1b2d3e,
          backgroundThrottling: false,
          spellcheck: false
        }
      });
      _0x5cb20c.set(_0x5d4623, _0x4376b3);
      _0xee7ec1.applyPackagedWindowMenuPolicy?.(_0x4376b3);
      attachProtocolGuard(_0x4376b3.webContents, _0x5d4623);
      _0xee7ec1.configureAutomationSession?.(_0x4376b3.webContents.session, _0x5d4623);
      _0x4376b3.webContents.setUserAgent(_0x37e6fc());
      try {
        _0x4376b3.webContents.setAudioMuted(true);
      } catch (_0xfc6784) {}
      try {
        _0x4376b3.webContents.setBackgroundThrottling?.(false);
      } catch (_0x30737e) {}
      _0x2b0e80(_0x4376b3.webContents, _0x1b2d3e);
      try {
        await _0xee7ec1.bindAutomationViewProxy?.({
          proxy: _0x4a0ea8.proxy
        }, _0x5d4623, _0x4376b3.webContents.session);
        if (_0x57110e !== _0x46a1cb || app.isQuitting || _0x4376b3.isDestroyed()) {
          _0x4a11a5(_0x5d4623, _0x4376b3);
          return {
            success: false,
            skipped: true
          };
        }
        if (_0x1acd82?.accountId === _0x1b2d3e && !_0x1acd82.view?.webContents?.isDestroyed?.()) {
          _0x4a11a5(_0x5d4623, _0x4376b3);
          return _0x54a0c7(_0x4a0ea8, _0x57110e);
        }
        await _0x4376b3.loadURL(DOUYIN_CHAT_URL);
        let _0x4a6185 = {
          success: false,
          message: "消息列表尚未渲染"
        };
        for (let _0x48a99f = 0; _0x48a99f < 10; _0x48a99f += 1) {
          if (_0x57110e !== _0x46a1cb || _0x4376b3.isDestroyed() || app.isQuitting) {
            _0x4a11a5(_0x5d4623, _0x4376b3);
            return {
              success: false,
              skipped: true
            };
          }
          await new Promise(_0xae1b89 => setTimeout(_0xae1b89, _0x48a99f === 0 ? 1200 : 800));
          await _0x2f2332(_0x4376b3.webContents, _0x1b2d3e);
          _0x4a6185 = await _0x3cd207(_0x4376b3.webContents, _0x4a0ea8, {
            source: "keepalive"
          });
          if (_0x4a6185.success) {
            return _0x4a6185;
          }
        }
        return _0x4a6185;
      } catch (_0x6c72ba) {
        _0x5ea2ef(_0x1b2d3e, _0x6c72ba.message || "后台消息监听失败", "keepalive");
        _0x4a11a5(_0x5d4623, _0x4376b3);
        return {
          success: false,
          message: _0x6c72ba.message || "后台消息监听失败"
        };
      }
    })().finally(() => {
      _0x156cd5.delete(_0x1b2d3e);
    });
    _0x156cd5.set(_0x1b2d3e, _0x4657fd);
    return _0x4657fd;
  }
  function _0x53e7c0(_0xa344f4 = CHAT_SAFETY_SCAN_INTERVAL_MS) {
    if (_0x27d19d) {
      clearTimeout(_0x27d19d);
    }
    _0x27d19d = null;
    if (!_0xbd58af()) {
      return;
    }
    const _0x3d4d3f = _0x46a1cb;
    _0x27d19d = setTimeout(() => {
      _0x27d19d = null;
      _0x31f7e2(_0x3d4d3f).catch(_0x4032e8 => {
        console.warn("[ChatNotify] 兜底扫描异常: " + _0x4032e8.message);
      });
    }, Math.max(0, Number(_0xa344f4 || 0)));
    _0x27d19d.unref?.();
  }
  async function _0x31f7e2(_0x1a6c56 = _0x46a1cb) {
    if (_0x3e47c6 || _0x1a6c56 !== _0x46a1cb) {
      return;
    }
    if (!_0xbd58af()) {
      return;
    }
    _0x3e47c6 = true;
    _0x563f20();
    try {
      const _0x5b58bf = _0xa90a56();
      for (const _0x126d92 of _0x5b58bf) {
        if (_0x1a6c56 !== _0x46a1cb || app.isQuitting) {
          break;
        }
        if (!_0xbd58af()) {
          break;
        }
        const _0x43888b = _0x4790af(_0x126d92.id);
        if (_0x43888b) {
          const _0x5eb55b = _0x1acd82?.accountId === String(_0x126d92.id) ? "active" : "safety";
          await _0x2f2332(_0x43888b, _0x126d92.id);
          await _0x3cd207(_0x43888b, _0x126d92, {
            source: _0x5eb55b
          });
        } else {
          await _0x54a0c7(_0x126d92, _0x1a6c56);
        }
        await new Promise(_0x458f62 => setTimeout(_0x458f62, 200));
      }
      _0x2bfa83 = {
        at: Date.now(),
        accountCount: _0x5b58bf.length,
        messageCenterActive: !!_0x41caaf,
        webhookEnabled: _0xc78b4d(),
        mode: "safety"
      };
    } finally {
      _0x3e47c6 = false;
      _0x563f20();
      if (_0x1a6c56 === _0x46a1cb && _0xbd58af()) {
        _0x53e7c0(CHAT_SAFETY_SCAN_INTERVAL_MS);
      }
    }
  }
  async function _0x38d200(_0x2332c0 = _0x46a1cb) {
    if (_0x2332c0 !== _0x46a1cb || !_0xbd58af()) {
      return;
    }
    const _0x21ce27 = _0xa90a56();
    const _0x3b16f8 = new Set(_0x21ce27.map(_0x4b5fdb => String(_0x4b5fdb.id)));
    for (const [_0xe0ca7f, _0x894fea] of [..._0x5cb20c.entries()]) {
      const _0x1f43fd = String(_0xe0ca7f).match(/^douyin_(.+):message-monitor$/);
      const _0x531978 = _0x1f43fd?.[1] || "";
      if (!_0x3b16f8.has(_0x531978)) {
        _0x4a11a5(_0xe0ca7f, _0x894fea);
      }
    }
    for (const _0x1561fe of _0x21ce27) {
      if (_0x2332c0 !== _0x46a1cb || app.isQuitting) {
        break;
      }
      if (!_0xbd58af()) {
        break;
      }
      await _0x54a0c7(_0x1561fe, _0x2332c0);
      await new Promise(_0x3122a6 => setTimeout(_0x3122a6, 300));
    }
    _0x2bfa83 = {
      at: Date.now(),
      accountCount: _0x21ce27.length,
      messageCenterActive: !!_0x41caaf,
      webhookEnabled: _0xc78b4d(),
      mode: "keepalive-sync"
    };
    _0x563f20();
  }
  function _0x569639(_0x4974e7 = "disabled") {
    _0x46a1cb += 1;
    if (_0x27d19d) {
      clearTimeout(_0x27d19d);
    }
    _0x27d19d = null;
    _0x3e47c6 = false;
    for (const _0x378f2c of _0x257f8e.values()) {
      clearTimeout(_0x378f2c);
    }
    _0x257f8e.clear();
    for (const [_0x1db50d, _0xf34917] of [..._0x5cb20c.entries()]) {
      _0x4a11a5(_0x1db50d, _0xf34917);
    }
    releaseTaskRuntimeGuard(CHAT_NOTIFICATION_RUNTIME_GUARD);
    if (_0x4974e7 !== "app-quit") {
      _0x563f20();
    }
  }
  function _0x57ffe4({
    immediate = false
  } = {}) {
    _0x569639("config-change");
    if (!_0xbd58af()) {
      return;
    }
    const _0x8097a6 = _0x46a1cb;
    acquireTaskRuntimeGuard(CHAT_NOTIFICATION_RUNTIME_GUARD, {
      type: "message-notification-monitor",
      mode: "event",
      safetyScanIntervalMs: CHAT_SAFETY_SCAN_INTERVAL_MS,
      keepaliveMaxAccounts: _0x1d0d75,
      messageCenterActive: !!_0x41caaf,
      webhookEnabled: _0xc78b4d()
    });
    const _0x48fff3 = immediate ? 400 : 1200;
    const _0x7c8672 = setTimeout(() => {
      _0x38d200(_0x8097a6).catch(_0x2a243b => {
        console.warn("[ChatNotify] 常驻监听同步失败: " + _0x2a243b.message);
      }).finally(() => {
        if (_0x8097a6 === _0x46a1cb && _0xbd58af()) {
          _0x53e7c0(CHAT_SAFETY_SCAN_INTERVAL_MS);
        }
      });
    }, _0x48fff3);
    _0x7c8672.unref?.();
    _0x563f20();
  }
  function _0x73b453(_0x535eb9) {
    const _0x41b6eb = Math.round(Number(_0x535eb9?.x));
    const _0x286cc6 = Math.round(Number(_0x535eb9?.y));
    const _0x2b6b39 = Math.round(Number(_0x535eb9?.width));
    const _0x54396f = Math.round(Number(_0x535eb9?.height));
    if (![_0x41b6eb, _0x286cc6, _0x2b6b39, _0x54396f].every(Number.isFinite)) {
      return null;
    }
    if (_0x2b6b39 < 120 || _0x54396f < 120) {
      return null;
    }
    return {
      x: Math.max(0, _0x41b6eb),
      y: Math.max(0, _0x286cc6),
      width: Math.max(120, _0x2b6b39),
      height: Math.max(120, _0x54396f)
    };
  }
  function _0x405854(_0xd3ac23, _0x2efaf0) {
    const _0x57ac13 = _0x73b453(_0x2efaf0);
    if (!_0xd3ac23 || _0xd3ac23.webContents?.isDestroyed?.() || !_0x57ac13) {
      return false;
    }
    try {
      _0xd3ac23.setBounds(_0x57ac13);
      return true;
    } catch (_0x2a65c7) {
      console.warn("[Chat] 更新消息视图坐标失败: " + _0x2a65c7.message);
      return false;
    }
  }
  function _0x3073f8(_0x3864f6) {
    if (!_0x3864f6 || _0x3864f6.isDestroyed?.()) {
      return;
    }
    try {
      _0x3864f6.insertCSS("\n                [class*=\"chat-list\"], [class*=\"ChatList\"],\n                [class*=\"message-list\"], [class*=\"MessageList\"],\n                [class*=\"message\"], [class*=\"Message\"],\n                [class*=\"bubble\"], [class*=\"Bubble\"],\n                [class*=\"item\"], [class*=\"Item\"],\n                [class*=\"scroll\"], [class*=\"Scroll\"] {\n                    transform-style: preserve-3d !important;\n                    backface-visibility: hidden !important;\n                    will-change: transform !important;\n                }\n            ").catch(() => {});
    } catch (_0x3fdac4) {}
  }
  function _0x58c6da(_0x37b26b, _0x5765be = null) {
    if (!_0x37b26b?.webContents || _0x37b26b.webContents.isDestroyed?.()) {
      return;
    }
    const _0x4eea7e = _0x37b26b.webContents;
    _0x3073f8(_0x4eea7e);
    try {
      _0x4eea7e.setZoomFactor(1);
    } catch (_0x5253fd) {}
    const _0x216a58 = _0x73b453(_0x5765be || _0x37b26b.getBounds?.());
    if (_0x216a58) {
      _0x405854(_0x37b26b, {
        ..._0x216a58,
        width: Math.max(120, _0x216a58.width - 1)
      });
      setTimeout(() => {
        if (_0x4eea7e.isDestroyed?.()) {
          return;
        }
        _0x405854(_0x37b26b, _0x216a58);
        try {
          _0x4eea7e.setZoomFactor(1.0001);
        } catch (_0x4193f2) {}
        setTimeout(() => {
          if (_0x4eea7e.isDestroyed?.()) {
            return;
          }
          try {
            _0x4eea7e.setZoomFactor(1);
          } catch (_0x54dba8) {}
          _0xee7ec1.notifyAutomationViewportChanged?.(_0x4eea7e, {
            force: true
          });
          _0x4eea7e.executeJavaScript("\n                        (() => {\n                            try {\n                                const styleId = '__radar_chat_transform_fix__';\n                                if (!document.getElementById(styleId)) {\n                                    const style = document.createElement('style');\n                                    style.id = styleId;\n                                    style.textContent = `\n                                        [class*=\"chat-list\"], [class*=\"ChatList\"],\n                                        [class*=\"message-list\"], [class*=\"MessageList\"],\n                                        [class*=\"message\"], [class*=\"Message\"],\n                                        [class*=\"bubble\"], [class*=\"Bubble\"],\n                                        [class*=\"item\"], [class*=\"Item\"],\n                                        [class*=\"scroll\"], [class*=\"Scroll\"] {\n                                            transform-style: preserve-3d !important;\n                                            backface-visibility: hidden !important;\n                                            will-change: transform !important;\n                                        }\n                                    `;\n                                    (document.head || document.documentElement).appendChild(style);\n                                }\n                                const nodes = Array.from(document.querySelectorAll('[class*=\"message\"], [class*=\"Message\"], [class*=\"scroll\"], [class*=\"Scroll\"]'));\n                                for (const node of nodes) {\n                                    if (node.scrollHeight > node.clientHeight + 40) {\n                                        node.scrollTop = node.scrollHeight;\n                                    }\n                                }\n                                window.dispatchEvent(new Event('resize'));\n                            } catch (_) {}\n                            return true;\n                        })()\n                    ", true).catch(() => {});
        }, 60);
      }, 60);
      return;
    }
    _0xee7ec1.notifyAutomationViewportChanged?.(_0x4eea7e, {
      force: true
    });
  }
  function _0x1d2615() {
    if (typeof _0xee7ec1.hideAutomationViews === "function") {
      _0xee7ec1.hideAutomationViews();
      return;
    }
    const _0x3a8557 = _0xee7ec1.detachAutomationViewFromWindow;
    if (typeof _0x3a8557 !== "function") {
      return;
    }
    const _0x4851d9 = _0xee7ec1.getPlatformViews?.() || new Map();
    const _0x3b1afc = _0xee7ec1.getInteractionViewsMap?.() || new Map();
    _0x4851d9.forEach((_0xbdf5c3, _0x539a2b) => {
      _0x3a8557(_0x539a2b, _0xbdf5c3);
      const _0x193a1c = _0x3b1afc.get(_0x539a2b);
      if (_0x193a1c) {
        _0x3a8557(_0x539a2b, _0x193a1c);
      }
    });
  }
  function _0x46457d(_0x6f5d08 = "closed", {
    notify = true
  } = {}) {
    _0x27bbf2 += 1;
    const _0xab7a4e = _0x1acd82;
    if (!_0xab7a4e) {
      return false;
    }
    _0x1acd82 = null;
    _0x15c218.delete(_0xab7a4e.viewKey);
    if (_0xab7a4e.readyProbeTimer) {
      clearTimeout(_0xab7a4e.readyProbeTimer);
      _0xab7a4e.readyProbeTimer = null;
    }
    if (_0xab7a4e.messageScanTimer) {
      clearInterval(_0xab7a4e.messageScanTimer);
      _0xab7a4e.messageScanTimer = null;
    }
    _0xee7ec1.destroyAutomationBrowserView(_0xab7a4e.view, _0xab7a4e.viewKey, "chat");
    if (notify) {
      _0x2794bf({
        status: "closed",
        viewKey: _0xab7a4e.viewKey,
        accountId: _0xab7a4e.accountId,
        reason: _0x6f5d08
      });
    }
    console.log("[Chat] 消息视图已关闭: " + _0xab7a4e.viewKey + " (" + _0x6f5d08 + ")");
    if (_0xbd58af() && _0xab7a4e.accountId) {
      const _0x1b33e3 = _0x482253(_0xab7a4e.accountId);
      if (_0x1b33e3?.status === "online") {
        _0x54a0c7(_0x1b33e3).catch(_0x250dfd => {
          console.warn("[ChatNotify] 关闭消息页后重建监听失败: " + _0x250dfd.message);
        });
      }
    }
    return true;
  }
  function _0x5ec290(_0x16723a) {
    const _0x3af5db = _0x1acd82;
    const _0x523bab = _0x9d234();
    if (!_0x3af5db?.view || _0x3af5db.view.webContents?.isDestroyed?.()) {
      return false;
    }
    if (!_0x523bab || _0x523bab.isDestroyed()) {
      return false;
    }
    const _0x29f9df = _0x523bab.getBrowserViews().includes(_0x3af5db.view);
    if (_0x16723a) {
      if (!_0x29f9df) {
        try {
          _0x523bab.addBrowserView(_0x3af5db.view);
        } catch (_0x25c815) {
          console.warn("[Chat] 重新挂载消息视图失败: " + _0x25c815.message);
          return false;
        }
        if (_0x3af5db.bounds) {
          _0x405854(_0x3af5db.view, _0x3af5db.bounds);
        }
        _0xee7ec1.safeSetTopBrowserView(_0x3af5db.view, {
          context: "chat-reattach:" + _0x3af5db.viewKey
        });
      }
      _0x3af5db.detachedForOverlay = false;
      return true;
    }
    if (_0x29f9df) {
      try {
        _0x523bab.removeBrowserView(_0x3af5db.view);
      } catch (_0x5f41e0) {
        console.warn("[Chat] 临时摘除消息视图失败: " + _0x5f41e0.message);
        return false;
      }
    }
    _0x3af5db.detachedForOverlay = true;
    return true;
  }
  async function _0x2e13d9({
    accountId: _0x1c9216,
    name = "",
    proxy = null,
    bounds = null
  } = {}) {
    const _0x44e850 = _0x9d234();
    try {
      _0xee7ec1.destroyConflictingView?.("chat-opened", {
        notify: true
      });
    } catch (_0x4f7a13) {}
    const _0x5e39b5 = String(_0x1c9216 || "").trim();
    if (!_0x5e39b5) {
      return {
        success: false,
        message: "缺少抖音账号信息"
      };
    }
    if (!_0x44e850 || _0x44e850.isDestroyed()) {
      return {
        success: false,
        message: "主窗口不可用"
      };
    }
    const _0x162735 = "douyin_" + _0x5e39b5;
    const _0x1e3d39 = _0x73b453(bounds);
    if (!_0x1e3d39) {
      return {
        success: false,
        message: "消息窗口尺寸无效"
      };
    }
    const _0x3ef709 = _0x1acd82;
    if (_0x3ef709?.viewKey === _0x162735 && !_0x3ef709.view?.webContents?.isDestroyed?.()) {
      _0x1d2615();
      _0x3ef709.bounds = _0x1e3d39;
      _0x405854(_0x3ef709.view, _0x1e3d39);
      if (!_0x44e850.getBrowserViews().includes(_0x3ef709.view)) {
        _0x44e850.addBrowserView(_0x3ef709.view);
      }
      _0xee7ec1.safeSetTopBrowserView(_0x3ef709.view, {
        context: "chat-reopen:" + _0x162735
      });
      try {
        _0x3ef709.view.webContents.setUserAgent(_0x37e6fc());
      } catch (_0x479b7a) {}
      _0x2794bf({
        status: _0x3ef709.status || "ready",
        viewKey: _0x162735,
        accountId: _0x5e39b5,
        url: _0x3ef709.view.webContents.getURL()
      });
      _0x4e0764(_0x3ef709);
      _0x58c6da(_0x3ef709.view, _0x1e3d39);
      return {
        success: true,
        reused: true,
        viewKey: _0x162735
      };
    }
    _0x46457d("account-switch", {
      notify: false
    });
    const _0x2f5c22 = ++_0x27bbf2;
    const _0x52862b = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true,
        partition: "persist:automation:" + _0x162735,
        backgroundThrottling: true,
        spellcheck: true
      }
    });
    const _0x19b881 = {
      view: _0x52862b,
      viewKey: _0x162735,
      accountId: _0x5e39b5,
      name: String(name || ""),
      status: "loading",
      generation: _0x2f5c22,
      bounds: _0x1e3d39
    };
    _0x1acd82 = _0x19b881;
    _0x15c218.set(_0x162735, _0x52862b);
    _0x52862b.setBackgroundColor("#171923");
    _0x52862b.webContents.setUserAgent(_0x37e6fc());
    attachProtocolGuard(_0x52862b.webContents, _0x162735 + ":chat");
    _0xee7ec1.configureAutomationSession?.(_0x52862b.webContents.session, _0x162735);
    const _0x19058a = () => _0x1acd82 === _0x19b881 && _0x19b881.generation === _0x2f5c22 && !_0x52862b.webContents.isDestroyed();
    const _0xe922fc = (_0x483b06, _0x44495e = {}) => {
      if (!_0x19058a()) {
        return;
      }
      _0x19b881.status = _0x483b06;
      _0x2794bf({
        status: _0x483b06,
        viewKey: _0x162735,
        accountId: _0x5e39b5,
        ..._0x44495e
      });
    };
    const _0x435b58 = () => {
      if (!_0x19058a()) {
        return;
      }
      const _0x14a6f0 = _0x52862b.webContents.getURL();
      if (!/^https:\/\/(?:www\.)?douyin\.com\//i.test(_0x14a6f0)) {
        return;
      }
      _0xe922fc("ready", {
        url: _0x14a6f0
      });
      _0x4e0764(_0x19b881);
      _0x58c6da(_0x52862b, _0x19b881.bounds);
      const _0x113501 = "douyin_" + _0x5e39b5 + ":message-monitor";
      const _0x30a262 = _0x5cb20c.get(_0x113501);
      if (_0x30a262) {
        _0x4a11a5(_0x113501, _0x30a262);
      }
    };
    const _0x1d831b = () => {
      if (_0x19b881.readyProbeTimer) {
        clearTimeout(_0x19b881.readyProbeTimer);
      }
      _0x19b881.readyProbeTimer = setTimeout(async () => {
        _0x19b881.readyProbeTimer = null;
        if (!_0x19058a() || _0x19b881.status !== "loading") {
          return;
        }
        try {
          const _0x5662ce = await _0x52862b.webContents.executeJavaScript("document.readyState", true);
          if (_0x5662ce === "interactive" || _0x5662ce === "complete") {
            _0x435b58();
          }
        } catch (_0x3a0027) {}
      }, 3000);
    };
    _0x52862b.webContents.on("did-start-loading", () => {
      _0xe922fc("loading");
      _0x1d831b();
    });
    _0x52862b.webContents.on("dom-ready", _0x1d831b);
    try {
      _0x52862b.webContents.setMaxListeners?.(20);
    } catch (_0x9e1ce8) {}
    _0x52862b.webContents.removeAllListeners("did-stop-loading");
    _0x52862b.webContents.on("did-stop-loading", _0x435b58);
    _0x52862b.webContents.on("did-finish-load", _0x435b58);
    _0x52862b.webContents.on("did-navigate", (_0x2767f6, _0x454906) => {
      _0xe922fc(_0x19b881.status || "loading", {
        url: _0x454906
      });
    });
    _0x52862b.webContents.on("did-navigate-in-page", (_0x2996fc, _0x724af5) => {
      _0xe922fc(_0x19b881.status || "ready", {
        url: _0x724af5
      });
    });
    _0x52862b.webContents.on("did-fail-load", (_0x4ab995, _0x5abd24, _0x57d9b6, _0x221e86, _0x3f319c) => {
      if (!_0x3f319c || _0x5abd24 === -3) {
        return;
      }
      _0xe922fc("error", {
        url: _0x221e86,
        message: _0x57d9b6 || "页面加载失败 (" + _0x5abd24 + ")"
      });
    });
    _0x52862b.webContents.on("render-process-gone", (_0x20bd93, _0x20bb26 = {}) => {
      _0xe922fc("error", {
        message: "消息页面异常退出：" + (_0x20bb26.reason || "unknown")
      });
    });
    _0x52862b.webContents.on("unresponsive", () => {
      _0xe922fc("error", {
        message: "消息页面暂时无响应，可点击刷新重试"
      });
    });
    _0x1d2615();
    _0x405854(_0x52862b, _0x1e3d39);
    _0x44e850.addBrowserView(_0x52862b);
    _0xee7ec1.safeSetTopBrowserView(_0x52862b, {
      context: "chat-open:" + _0x162735
    });
    _0xe922fc("loading", {
      url: DOUYIN_CHAT_URL
    });
    await _0xee7ec1.bindAutomationViewProxy?.({
      proxy: proxy
    }, _0x162735, _0x52862b.webContents.session);
    if (!_0x19058a()) {
      return {
        success: false,
        superseded: true,
        message: "账号已切换"
      };
    }
    try {
      await _0x52862b.webContents.loadURL(DOUYIN_CHAT_URL);
      if (!_0x19058a()) {
        return {
          success: false,
          superseded: true,
          message: "账号已切换"
        };
      }
      return {
        success: true,
        reused: false,
        viewKey: _0x162735,
        url: _0x52862b.webContents.getURL()
      };
    } catch (_0x4812cd) {
      if (!_0x19058a()) {
        return {
          success: false,
          superseded: true,
          message: "账号已切换"
        };
      }
      _0xe922fc("error", {
        message: _0x4812cd.message || "消息页面加载失败"
      });
      return {
        success: false,
        viewKey: _0x162735,
        message: _0x4812cd.message || "消息页面加载失败"
      };
    }
  }
  function _0xaa7c24() {
    const _0x2a1043 = _0x1acd82;
    const _0x4d3231 = _0x9d234();
    if (!_0x2a1043 || _0x2a1043.view?.webContents?.isDestroyed?.()) {
      return {
        active: false,
        count: 0
      };
    }
    const _0x37ef46 = !!_0x4d3231 && !_0x4d3231.isDestroyed() && !!_0x4d3231.getBrowserViews().includes(_0x2a1043.view);
    return {
      active: true,
      count: _0x15c218.size,
      viewKey: _0x2a1043.viewKey,
      accountId: _0x2a1043.accountId,
      status: _0x2a1043.status,
      url: _0x2a1043.view.webContents.getURL(),
      attached: _0x37ef46,
      bounds: _0x2a1043.view.getBounds()
    };
  }
  async function _0x1dcff5({
    viewKey: _0x836cc3
  } = {}) {
    const _0x2f8a5f = _0x1acd82;
    if (!_0x2f8a5f || _0x2f8a5f.view?.webContents?.isDestroyed?.()) {
      return {
        success: false,
        message: "消息窗口尚未打开"
      };
    }
    if (_0x836cc3 && _0x2f8a5f.viewKey !== _0x836cc3) {
      return {
        success: false,
        message: "当前账号已切换"
      };
    }
    _0x2f8a5f.status = "loading";
    _0x2794bf({
      status: "loading",
      viewKey: _0x2f8a5f.viewKey,
      accountId: _0x2f8a5f.accountId
    });
    try {
      await _0x2f8a5f.view.webContents.reload();
      return {
        success: true
      };
    } catch (_0xed4bca) {
      return {
        success: false,
        message: _0xed4bca.message || "刷新失败"
      };
    }
  }
  function _0x5c5954({
    viewKey: _0x55f0fb,
    bounds: _0x5bc159
  } = {}) {
    const _0x1ee8b1 = _0x1acd82;
    if (!_0x1ee8b1 || _0x55f0fb && _0x1ee8b1.viewKey !== _0x55f0fb) {
      return;
    }
    const _0x2b9e68 = _0x73b453(_0x5bc159);
    if (!_0x2b9e68) {
      return;
    }
    _0x1ee8b1.bounds = _0x2b9e68;
    if (_0x1ee8b1.detachedForOverlay) {
      return;
    }
    _0x405854(_0x1ee8b1.view, _0x2b9e68);
  }
  async function _0x55da95(_0x42b044) {
    const _0xdc830f = !!_0x42b044;
    if (_0xdc830f && !_0xee7ec1.ensureMessageCenterAccess?.()) {
      _0x41caaf = false;
      _0x57ffe4({
        immediate: false
      });
      return {
        success: false,
        active: false,
        message: MESSAGE_CENTER_FREE_BLOCK_MSG,
        state: _0x33f720()
      };
    }
    if (_0x41caaf === _0xdc830f) {
      return {
        success: true,
        active: _0xdc830f,
        unchanged: true,
        state: _0x33f720()
      };
    }
    _0x41caaf = _0xdc830f;
    console.log("[ChatNotify] 消息聚合会话 " + (_0xdc830f ? "已打开" : "已关闭") + "，多账号监听=" + _0xbd58af());
    _0x57ffe4({
      immediate: _0xdc830f || _0x431f4d()
    });
    return {
      success: true,
      active: _0xdc830f,
      state: _0x33f720()
    };
  }
  async function _0x488ad1(_0x1d37b4 = {}) {
    const _0x1820b2 = normalizeChatNotificationConfig(_0x1d37b4);
    if (_0x1820b2.enabled && !_0xee7ec1.ensureMessageCenterAccess?.()) {
      return {
        success: false,
        message: MESSAGE_CENTER_FREE_BLOCK_MSG
      };
    }
    if (_0x1820b2.enabled && _0x1820b2.webhookType !== "none" && !isHttpWebhookUrl(_0x1820b2.webhookUrl)) {
      return {
        success: false,
        message: "请填写有效的飞书或钉钉 Webhook 地址，或选择「不推送」"
      };
    }
    _0x2218de = _0x1820b2;
    _0x1a779a.set(CHAT_NOTIFICATION_CONFIG_KEY, _0x1820b2);
    _0x57ffe4({
      immediate: _0xbd58af()
    });
    return {
      success: true,
      config: {
        ..._0x1820b2
      },
      state: _0x33f720()
    };
  }
  async function _0x16cb3b(_0x33f2d1 = {}) {
    if (!_0xee7ec1.ensureMessageCenterAccess?.()) {
      return {
        success: false,
        message: MESSAGE_CENTER_FREE_BLOCK_MSG
      };
    }
    const _0x2b01fd = normalizeChatNotificationConfig({
      ..._0x33f2d1,
      enabled: true
    });
    if (_0x2b01fd.webhookType === "none") {
      return {
        success: false,
        message: "当前为「不推送」，无需测试 Webhook"
      };
    }
    if (!isHttpWebhookUrl(_0x2b01fd.webhookUrl)) {
      return {
        success: false,
        message: "请先填写有效的 Webhook 地址"
      };
    }
    return _0x152623({
      accountId: "test-account",
      productName: _0x182364(),
      receiverNickname: "接收账号昵称（测试）",
      receiverRemark: "账号备注名（测试）",
      sender: "发送消息的账号（测试）",
      receiverDouyinId: "douyin_test_receiver",
      content: "这是一条消息聚合 Webhook 测试内容",
      unreadCount: 2,
      conversationUnreadCount: 2,
      accountUnreadCount: 5,
      detectedAt: Date.now()
    }, _0x2b01fd, {
      force: true
    });
  }
  function _0x154f76() {
    if (!_0x39d4b6()) {
      return;
    }
    let _0x79e046 = false;
    if (_0x41caaf) {
      _0x41caaf = false;
      _0x79e046 = true;
    }
    if (_0x2218de?.enabled) {
      _0x2218de = {
        ..._0x2218de,
        enabled: false
      };
      try {
        _0x1a779a.set(CHAT_NOTIFICATION_CONFIG_KEY, _0x2218de);
      } catch (_0x2c6af0) {}
      _0x79e046 = true;
    }
    if (_0x1acd82) {
      _0x46457d("auth-downgraded");
      _0x79e046 = true;
    }
    if (_0xee7ec1.destroyConflictingView?.("auth-downgraded")) {
      _0x79e046 = true;
    }
    if (_0x79e046) {
      console.log("[Auth-Shield] 授权降级，已关闭消息聚合与后台提醒");
      _0x57ffe4({
        immediate: false
      });
      const _0x2088ba = _0x9d234();
      if (_0x2088ba && !_0x2088ba.isDestroyed()) {
        try {
          _0x2088ba.webContents.send("chat-notification-config", {
            ..._0x2218de
          });
          _0x2088ba.webContents.send("chat-unread-state", _0x33f720());
        } catch (_0x5beebb) {}
      }
    }
  }
  function _0x10cda8() {
    _0x41caaf = false;
    _0x569639("app-quit");
    _0x46457d("app-quit");
  }
  function _0x50cc96() {
    const _0x2388ac = _0x1acd82;
    if (!_0x2388ac?.bounds || !_0x2388ac?.view) {
      return;
    }
    setTimeout(() => {
      if (_0x1acd82 !== _0x2388ac) {
        return;
      }
      if (_0x2388ac.view.webContents?.isDestroyed?.()) {
        return;
      }
      const _0x1299d1 = _0x9d234();
      _0x405854(_0x2388ac.view, _0x2388ac.bounds);
      const _0x104ce2 = _0x2388ac.view.getBounds();
      const _0x2641d4 = _0x2388ac.bounds;
      const _0x1f8518 = ["x", "y", "width", "height"].some(_0x5a0894 => _0x104ce2[_0x5a0894] !== _0x2641d4[_0x5a0894]);
      if (_0x1f8518 && _0x1299d1 && !_0x1299d1.isDestroyed()) {
        console.warn("[Chat] 检测到原生坐标漂移，重新挂载并校准: " + _0x2388ac.viewKey + (" actual=" + JSON.stringify(_0x104ce2) + " expected=" + JSON.stringify(_0x2641d4)));
        try {
          if (_0x1299d1.getBrowserViews().includes(_0x2388ac.view)) {
            _0x1299d1.removeBrowserView(_0x2388ac.view);
          }
          _0x1299d1.addBrowserView(_0x2388ac.view);
        } catch (_0x497d3f) {
          console.warn("[Chat] 重新挂载消息视图失败: " + _0x497d3f.message);
        }
        _0x405854(_0x2388ac.view, _0x2641d4);
      }
      _0xee7ec1.safeSetTopBrowserView?.(_0x2388ac.view, {
        context: "chat-realign:" + _0x2388ac.viewKey
      });
    }, 50);
  }
  function _0x115914() {
    if (_0x404838) {
      return;
    }
    _0x404838 = true;
    ipcMain.handle("open-chat-view", async (_0x191e09, _0x216376 = {}) => {
      if (!_0xee7ec1.ensureMessageCenterAccess?.()) {
        return {
          success: false,
          message: MESSAGE_CENTER_FREE_BLOCK_MSG
        };
      }
      try {
        return await _0x2e13d9(_0x216376);
      } catch (_0x226ce4) {
        console.error("[Chat] 打开消息视图失败:", _0x226ce4);
        return {
          success: false,
          message: _0x226ce4.message || "打开消息视图失败"
        };
      }
    });
    ipcMain.on("update-chat-view-bounds", (_0xd5b971, _0xae211e = {}) => {
      _0x5c5954(_0xae211e);
    });
    ipcMain.on("set-chat-view-attached", (_0x1fe2b9, {
      attached = true
    } = {}) => {
      _0x5ec290(!!attached);
    });
    ipcMain.handle("reload-chat-view", async (_0x4242b2, _0x39f3ee = {}) => _0x1dcff5(_0x39f3ee));
    ipcMain.on("destroy-chat-view", (_0xf87a25, {
      reason = "renderer-closed"
    } = {}) => {
      _0x46457d(reason);
    });
    ipcMain.handle("set-message-center-session", async (_0x3a0e30, {
      active: _0x23f5fe
    } = {}) => _0x55da95(_0x23f5fe));
    ipcMain.handle("get-chat-view-state", () => _0xaa7c24());
    ipcMain.handle("get-chat-notification-config", () => ({
      ..._0x2218de
    }));
    ipcMain.handle("save-chat-notification-config", async (_0x5dd4cc, _0x8da5b5 = {}) => _0x488ad1(_0x8da5b5));
    ipcMain.handle("get-chat-unread-state", () => _0x33f720());
    ipcMain.handle("test-chat-message-webhook", async (_0x1be432, _0x157aa6 = {}) => _0x16cb3b(_0x157aa6));
  }
  return {
    DOUYIN_CHAT_URL: DOUYIN_CHAT_URL,
    MESSAGE_CENTER_FREE_BLOCK_MSG: MESSAGE_CENTER_FREE_BLOCK_MSG,
    chatViewsMap: _0x15c218,
    chatMonitorWindowsMap: _0x5cb20c,
    registerIpc: _0x115914,
    stopMessageCenterIfNeeded: _0x154f76,
    syncChatNotificationMonitor: _0x57ffe4,
    shouldRunChatMessageMonitor: _0xbd58af,
    syncChatMonitorKeepalives: _0x38d200,
    isBackgroundChatMonitorEnabled: _0x431f4d,
    getChatNotificationMonitorGeneration: () => _0x46a1cb,
    openChatView: _0x2e13d9,
    destroyActiveChatView: _0x46457d,
    stopChatNotificationMonitor: _0x569639,
    handleAppQuit: _0x10cda8,
    realignActiveChatViewBoundsAfterAutomationClose: _0x50cc96,
    setActiveChatViewAttached: _0x5ec290,
    getChatViewState: _0xaa7c24,
    getChatUnreadStatePayload: _0x33f720,
    getActiveChatViewState: () => _0x1acd82
  };
}
module.exports = {
  DOUYIN_CHAT_URL: DOUYIN_CHAT_URL,
  MESSAGE_CENTER_FREE_BLOCK_MSG: MESSAGE_CENTER_FREE_BLOCK_MSG,
  DEFAULT_CHAT_NOTIFICATION_CONFIG: DEFAULT_CHAT_NOTIFICATION_CONFIG,
  createMessageCenter: createMessageCenter
};
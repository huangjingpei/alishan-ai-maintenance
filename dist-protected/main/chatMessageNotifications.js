const crypto = require("crypto");
const DEFAULT_CHAT_NOTIFICATION_CONFIG = Object.freeze({
  enabled: false,
  webhookType: "feishu",
  webhookUrlFeishu: "",
  webhookUrlDingtalk: "",
  webhookSecretDingtalk: "",
  pollIntervalSeconds: 60
});
const CHAT_LIST_CHANGED_TOKEN = "__RADAR_CHAT_LIST_CHANGED__";
function cleanText(arg1, num = 500) {
  return String(arg1 || "").replace(/[\u200b-\u200d\ufeff]/g, "").replace(/\s+/g, " ").trim().slice(0, num);
}
function clampNumber(arg1, arg2, arg3, arg4) {
  const result = Number(arg1);
  if (!Number.isFinite(result)) {
    return arg4;
  }
  return Math.min(arg3, Math.max(arg2, Math.round(result)));
}
function normalizeChatWebhookType(arg1) {
  const result = String(arg1 || "").trim().toLowerCase();
  if (result === "none" || result === "off" || result === "disabled") {
    return "none";
  }
  if (result === "dingtalk") {
    return "dingtalk";
  }
  return "feishu";
}
function normalizeChatNotificationConfig(options = {}) {
  const result = normalizeChatWebhookType(options.webhookType);
  const obj = {
    enabled: !!options.enabled,
    webhookType: result,
    webhookUrlFeishu: cleanText(options.webhookUrlFeishu, 2000),
    webhookUrlDingtalk: cleanText(options.webhookUrlDingtalk, 2000),
    webhookSecretDingtalk: cleanText(options.webhookSecretDingtalk, 1000),
    pollIntervalSeconds: clampNumber(options.pollIntervalSeconds, 30, 1800, 60)
  };
  obj.webhookUrl = result === "dingtalk" ? obj.webhookUrlDingtalk : result === "feishu" ? obj.webhookUrlFeishu : "";
  obj.webhookSecret = result === "dingtalk" ? obj.webhookSecretDingtalk : "";
  return obj;
}
function isHttpWebhookUrl(arg1) {
  try {
    const url = new URL(String(arg1 || "").trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (error) {
    return false;
  }
}
function isChatWebhookPushConfigured(options = {}) {
  const result = normalizeChatNotificationConfig(options);
  return result.webhookType !== "none" && isHttpWebhookUrl(result.webhookUrl);
}
function parseUnreadCount(arg1) {
  if (typeof arg1 === "number" && Number.isFinite(arg1)) {
    return Math.max(0, Math.min(999, Math.round(arg1)));
  }
  const result = cleanText(arg1, 30);
  if (!result) {
    return 0;
  }
  if (/^\d+\+?$/.test(result)) {
    return Math.max(0, Math.min(999, Number.parseInt(result, 10) || 0));
  }
  if (/未读|新消息|红点/.test(result)) {
    return 1;
  } else {
    return 0;
  }
}
function stableHash(arg1) {
  const result = String(arg1 || "");
  let num = 2166136261;
  for (let num2 = 0; num2 < result.length; num2 += 1) {
    num ^= result.charCodeAt(num2);
    num = Math.imul(num, 16777619);
  }
  return (num >>> 0).toString(36);
}
const RELATIVE_TIME_SUFFIX_RE = /(?:\s|^)(?:\d{1,2}:\d{2}|昨天|前天|刚刚|星期[一二三四五六日天]|周[一二三四五六日天]|\d+\s*分钟前|\d+\s*小时前|\d+\s*天前|\d{1,2}月\d{1,2}日)\s*$/u;
function stripRelativeTimeSuffix(arg1, num = 500) {
  let result = cleanText(arg1, num);
  for (let num = 0; num < 3; num += 1) {
    const result2 = result.replace(RELATIVE_TIME_SUFFIX_RE, "").trim();
    if (result2 === result) {
      break;
    }
    result = result2;
  }
  return result;
}
function normalizeSenderName(arg1) {
  return stripRelativeTimeSuffix(arg1, 120);
}
function looksLikeNumericAccountId(arg1) {
  return /^\d{5,}$/.test(normalizeSenderName(arg1));
}
function pickFriendNickname(...restArgs) {
  const result = restArgs.map(arg1 => normalizeSenderName(arg1)).filter(Boolean);
  const result2 = result.find(arg1 => !looksLikeNumericAccountId(arg1));
  return result2 || result[0] || "";
}
function senderConversationAlias(arg1) {
  const result = normalizeSenderName(arg1);
  if (result) {
    return "sender:" + stableHash(result.toLowerCase());
  } else {
    return "";
  }
}
function isUidNicknameIdentityFlip(arg1, arg2) {
  const result = normalizeSenderName(arg1);
  const result2 = normalizeSenderName(arg2);
  if (!result || !result2 || result === result2) {
    return false;
  }
  const result3 = looksLikeNumericAccountId(result);
  const result4 = looksLikeNumericAccountId(result2);
  return result3 !== result4 && (result3 || result4);
}
function stabilizeConversationKey(arg1, arg2) {
  const result = normalizeSenderName(arg2);
  const result2 = senderConversationAlias(result);
  const result3 = stripRelativeTimeSuffix(arg1, 500);
  if (!result3) {
    return result2;
  }
  if (result2 && (result3 === result || result3 === result2 || result3 === "sender:" + result)) {
    return result2;
  }
  try {
    if (/^https?:\/\//i.test(result3)) {
      const url = new URL(result3);
      const result = String(url.pathname || "").replace(/\/+$/, "");
      const result2 = result.match(/\/user\/([^/]+)/i);
      if (result2?.[1]) {
        return "user:" + decodeURIComponent(result2[1]);
      }
      return "url:" + url.origin + result;
    }
  } catch (error) {}
  const result4 = result3.match(/(?:^|[/?#])user\/([^/?#]+)/i);
  if (result4?.[1]) {
    return "user:" + decodeURIComponent(result4[1]);
  }
  return result3;
}
function findMatchingPreviousConversation(arg1, arg2) {
  const value = arg1 && typeof arg1 === "object" ? arg1 : {};
  const value2 = value[arg2.conversationKey];
  if (value2) {
    return value2;
  }
  const result = senderConversationAlias(arg2.sender);
  if (result && value[result]) {
    return value[result];
  }
  const result2 = normalizeSenderName(arg2.sender);
  if (!result2) {
    return null;
  }
  for (const item of Object.values(value)) {
    if (normalizeSenderName(item?.sender) === result2) {
      return item;
    }
  }
  const result3 = cleanText(arg2.content, 500);
  if (result3) {
    for (const item of Object.values(value)) {
      const result = cleanText(item?.lastNotifiedContent || "", 500);
      const local = result && result === result3 || arg2.fingerprint && String(item?.fingerprint || "") === String(arg2.fingerprint) || arg2.fingerprint && String(item?.lastNotifiedFingerprint || "") === String(arg2.fingerprint);
      if (!local) {
        continue;
      }
      if (isUidNicknameIdentityFlip(item?.sender, arg2.sender)) {
        return item;
      }
    }
  }
  return null;
}
function hasNotifiedSamePreview(arg1, arg2) {
  const result = String(arg2.fingerprint || "");
  const result2 = cleanText(arg2.content, 500);
  const result3 = normalizeSenderName(arg2.sender);
  for (const [local, local2] of Object.entries(arg1 || {})) {
    const result4 = normalizeSenderName(local2?.sender);
    const local3 = arg2.conversationKey && local === arg2.conversationKey || result3 && result4 === result3 || result2 && cleanText(local2?.lastNotifiedContent || "", 500) === result2 && isUidNicknameIdentityFlip(result4, result3);
    if (!local3) {
      continue;
    }
    if (result && String(local2?.lastNotifiedFingerprint || "") === result) {
      return true;
    }
    if (result2 && cleanText(local2?.lastNotifiedContent || "", 500) === result2) {
      return true;
    }
  }
  return false;
}
function normalizeConversationSnapshot(list = []) {
  const list2 = [];
  const set = new Set();
  for (const item of Array.isArray(list) ? list : []) {
    const result = pickFriendNickname(item?.nickname, item?.name, item?.senderNickname, item?.sender, item?.title);
    const local = result;
    let result2 = stripRelativeTimeSuffix(item?.content || item?.message || item?.msg);
    if (!result || !result2) {
      continue;
    }
    const local2 = !!item?.isOutgoing || /^(?:我|本人)\s*[:：]/.test(result2);
    if (local2) {
      result2 = result2.replace(/^(?:我|本人)\s*[:：]\s*/, "");
    }
    result2 = stripRelativeTimeSuffix(result2);
    if (!result2) {
      continue;
    }
    const result3 = parseUnreadCount(item?.unreadCount ?? item?.unread);
    const result4 = cleanText(item?.conversationKey || item?.key || item?.userUrl || item?.href, 500);
    const result5 = stabilizeConversationKey(result4, result);
    if (!result5 || set.has(result5)) {
      continue;
    }
    set.add(result5);
    list2.push({
      conversationKey: result5,
      sender: result,
      senderDisplay: local || result,
      content: result2,
      unreadCount: result3,
      isOutgoing: local2,
      fingerprint: stableHash(result2.toLowerCase())
    });
    if (list2.length >= 100) {
      break;
    }
  }
  return list2;
}
function normalizePreviousState(options = {}) {
  const value = options.conversations && typeof options.conversations === "object" ? options.conversations : {};
  return {
    initialized: !!options.initialized,
    conversations: value
  };
}
const CHAT_CONVERSATION_RETAIN_MS = 604800000;
const CHAT_CONVERSATION_STATE_LIMIT = 300;
function pruneConversationState(arg1, arg2) {
  const result = Object.entries(arg1 || {}).filter(([, arg1]) => {
    const result = Number(arg1?.updatedAt || 0);
    return !result || arg2 - result <= CHAT_CONVERSATION_RETAIN_MS;
  }).sort((arg1, arg2) => Number(arg2[1]?.updatedAt || 0) - Number(arg1[1]?.updatedAt || 0)).slice(0, CHAT_CONVERSATION_STATE_LIMIT);
  return Object.fromEntries(result);
}
function reconcileConversationSnapshot(arg1, arg2, arg3 = Date.now()) {
  const result = normalizePreviousState(arg1);
  const result2 = normalizeConversationSnapshot(arg2);
  const obj = {};
  const list = [];
  let num = 0;
  let local = null;
  for (const [local, local2] of Object.entries(result.conversations)) {
    const result = Number(local2?.updatedAt || 0);
    if (result && arg3 - result > CHAT_CONVERSATION_RETAIN_MS) {
      continue;
    }
    obj[local] = {
      fingerprint: String(local2?.fingerprint || ""),
      unreadCount: Math.max(0, Number(local2?.unreadCount || 0)),
      sender: normalizeSenderName(local2?.sender),
      updatedAt: result || arg3,
      lastNotifiedFingerprint: String(local2?.lastNotifiedFingerprint || ""),
      lastNotifiedContent: cleanText(local2?.lastNotifiedContent || "", 500)
    };
  }
  for (const item of result2) {
    const local2 = findMatchingPreviousConversation(result.conversations, item) || findMatchingPreviousConversation(obj, item);
    const result2 = String(local2?.lastNotifiedFingerprint || "");
    let local3 = result2;
    let result3 = cleanText(local2?.lastNotifiedContent || "", 500);
    num += item.unreadCount;
    if (item.unreadCount > 0 && !local) {
      local = item;
    }
    if (!result.initialized) {
      if (item.unreadCount > 0 && !item.isOutgoing) {
        local3 = item.fingerprint;
        result3 = item.content;
      }
      const obj2 = {
        fingerprint: item.fingerprint,
        unreadCount: item.unreadCount,
        sender: item.sender,
        updatedAt: arg3,
        lastNotifiedFingerprint: local3,
        lastNotifiedContent: result3
      };
      obj[item.conversationKey] = obj2;
      const result = senderConversationAlias(item.sender);
      if (result && result !== item.conversationKey) {
        obj[result] = {
          ...obj2
        };
      }
      continue;
    }
    if (local2 && result2 && !result3 && result2 !== item.fingerprint) {
      local3 = item.fingerprint;
      result3 = item.content;
    }
    const local4 = result2 && result2 === item.fingerprint || result3 && result3 === item.content || hasNotifiedSamePreview(result.conversations, item) || hasNotifiedSamePreview(obj, item);
    const flag = !local2;
    const local5 = !!local2 && item.content !== result3 && local2.fingerprint !== item.fingerprint;
    const local6 = item.unreadCount > 0 && !item.isOutgoing && !local4 && (flag || local5);
    if (local6) {
      local3 = item.fingerprint;
      result3 = item.content;
      list.push({
        sender: item.sender,
        content: item.content,
        unreadCount: item.unreadCount,
        conversationKey: item.conversationKey,
        fingerprint: item.fingerprint,
        detectedAt: arg3
      });
    }
    const local7 = pickFriendNickname(item.sender, local2?.sender) || item.sender;
    const obj2 = {
      fingerprint: item.fingerprint,
      unreadCount: item.unreadCount,
      sender: local7,
      updatedAt: arg3,
      lastNotifiedFingerprint: local3,
      lastNotifiedContent: result3
    };
    obj[item.conversationKey] = obj2;
    const result4 = senderConversationAlias(local7);
    if (result4 && result4 !== item.conversationKey) {
      obj[result4] = {
        ...obj2
      };
    }
    const result5 = senderConversationAlias(local2?.sender);
    if (result5 && result5 !== item.conversationKey && result5 !== result4) {
      obj[result5] = {
        ...obj2
      };
    }
    if (local6) {
      const value = list.length - 1;
      if (value >= 0 && list[value]?.fingerprint === item.fingerprint) {
        list[value].sender = local7;
      }
    }
  }
  return {
    state: {
      initialized: true,
      conversations: pruneConversationState(obj, arg3),
      unreadCount: Math.min(9999, num),
      conversationCount: result2.length,
      lastSender: local?.sender || "",
      lastContent: local?.content || "",
      lastScanAt: arg3
    },
    events: list
  };
}
function buildChatWebhookData(options = {}) {
  const local = cleanText(options.productName, 80) || "获客雷达";
  const local2 = cleanText(options.receiverNickname || options.accountNickname, 120) || "未获取昵称";
  const local3 = cleanText(options.receiverRemark || options.accountRemark, 120) || "未设置";
  const local4 = cleanText(options.receiverDouyinId || options.douyinId, 120) || "未获取";
  const local5 = pickFriendNickname(options.senderNickname, options.nickname, options.sender) || "未知好友";
  const local6 = stripRelativeTimeSuffix(options.content) || "[无文本内容]";
  const result = parseUnreadCount(options.unreadCount || options.conversationUnreadCount);
  const result2 = parseUnreadCount(options.accountUnreadCount ?? options.totalUnreadCount ?? options.accountUnread);
  const local7 = options.time || new Date(options.detectedAt || Date.now()).toLocaleString();
  const value = result > 0 ? String(result) : "至少 1";
  const value2 = result2 > 0 ? String(result2) : result > 0 ? String(result) : "至少 1";
  return {
    title: "💬 " + local + " - 收到新私信",
    content: ["**收到消息的账号（抖音昵称）**: " + local2, "**账号备注名**: " + local3, "**发送消息的好友**: " + local5, "**该好友最新消息**: " + local6, "**该好友未读数**: " + value, "**当前账号总未读**: " + value2].join("\n"),
    time: local7,
    eventType: "chat_message",
    extra: {
      receiverAccountId: cleanText(options.accountId, 120),
      receiverNickname: local2,
      receiverRemark: local3,
      receiverDouyinId: local4,
      sender: local5,
      content: local6,
      unreadCount: result || 1,
      conversationUnreadCount: result || 1,
      accountUnreadCount: result2 || result || 1
    }
  };
}
function buildChatMessageWebhookPayload(arg1, options = {}) {
  const result = buildChatWebhookData(options);
  if (arg1 === "dingtalk") {
    return {
      msgtype: "markdown",
      markdown: {
        title: result.title,
        text: "### " + result.title + "\n\n" + result.content + "\n\n> ⏰ " + result.time
      }
    };
  }
  return {
    msg_type: "interactive",
    card: {
      header: {
        title: {
          tag: "plain_text",
          content: result.title
        },
        template: "blue"
      },
      elements: [{
        tag: "div",
        text: {
          tag: "lark_md",
          content: result.content
        }
      }, {
        tag: "note",
        elements: [{
          tag: "plain_text",
          content: "⏰ " + result.time
        }]
      }]
    }
  };
}
function buildSignedDingtalkUrl(arg1, arg2, arg3 = Date.now()) {
  if (!arg2) {
    return arg1;
  }
  const value = arg3 + "\n" + arg2;
  const result = crypto.createHmac("sha256", arg2).update(value).digest("base64");
  const value2 = String(arg1).includes("?") ? "&" : "?";
  return "" + arg1 + value2 + "timestamp=" + arg3 + "&sign=" + encodeURIComponent(result);
}
function isChatWebhookResponseSuccess(arg1, arg2) {
  if (!arg2 || arg2.status !== 200) {
    return false;
  }
  const value = arg2.data;
  if (value && value.errcode !== undefined && value.errcode !== 0) {
    return false;
  }
  if (arg1 === "feishu" && value && value.code !== undefined && value.code !== 0) {
    return false;
  }
  return true;
}
async function sendChatMessageWebhookRequest({
  axios: axios,
  config: config,
  event: event,
  timeout = 10000,
  force = false
}) {
  if (!axios || typeof axios.post !== "function") {
    throw new Error("缺少 Webhook HTTP 客户端");
  }
  const result = normalizeChatNotificationConfig(config);
  if (!force && !result.enabled || !isChatWebhookPushConfigured(result)) {
    return {
      success: false,
      skipped: true,
      message: "Webhook 未启用或地址无效"
    };
  }
  const result2 = buildChatMessageWebhookPayload(result.webhookType, event);
  const value = result.webhookType === "dingtalk" ? buildSignedDingtalkUrl(result.webhookUrl, result.webhookSecret) : result.webhookUrl;
  const result3 = await axios.post(value, result2, {
    timeout: timeout
  });
  const flag = isChatWebhookResponseSuccess(result.webhookType, result3);
  return {
    success: flag,
    message: flag ? "推送成功" : "机器人返回失败状态",
    status: result3?.status || 0
  };
}
function getChatMonitorVisibilityKeepaliveScript() {
  return "(() => {\n    try {\n      if (window.__radarChatVisibilityKeepalive) return { success: true, reused: true };\n      window.__radarChatVisibilityKeepalive = true;\n      try {\n        Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });\n        Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });\n        Object.defineProperty(document, 'hasFocus', {\n          value: () => true,\n          configurable: true,\n          writable: false,\n        });\n      } catch (_) { /* ignore */ }\n      try {\n        document.dispatchEvent(new Event('visibilitychange'));\n      } catch (_) { /* ignore */ }\n      // 轻量心跳，降低 Chromium 对隐藏页的定时器节流影响\n      if (!window.__radarChatVisibilityHeartbeat) {\n        window.__radarChatVisibilityHeartbeat = setInterval(() => {\n          try { void document.visibilityState; } catch (_) {}\n        }, 15000);\n      }\n      return { success: true };\n    } catch (error) {\n      return { success: false, error: error.message || String(error) };\n    }\n  })()";
}
function getChatListObserverInstallScript(arg1 = CHAT_LIST_CHANGED_TOKEN) {
  const result = String(arg1 || CHAT_LIST_CHANGED_TOKEN).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  return "(() => {\n    try {\n      const TOKEN = '" + result + "';\n      // 每次安装先确保可见性伪装（隐藏窗场景）\n      try {\n        Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });\n        Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });\n        Object.defineProperty(document, 'hasFocus', {\n          value: () => true,\n          configurable: true,\n          writable: false,\n        });\n      } catch (_) { /* ignore */ }\n      if (window.__radarChatListObserverInstalled && window.__radarChatListObserver) {\n        return { success: true, reused: true };\n      }\n      const root = document.body || document.documentElement;\n      if (!root) return { success: false, error: 'no-root' };\n      let timer = null;\n      const notify = () => {\n        if (timer) return;\n        timer = setTimeout(() => {\n          timer = null;\n          console.log(TOKEN);\n        }, 200);\n      };\n      if (window.__radarChatListObserver) {\n        try { window.__radarChatListObserver.disconnect(); } catch (_) {}\n      }\n      const observer = new MutationObserver((mutations) => {\n        for (const m of mutations) {\n          if (m.type === 'childList' && (m.addedNodes.length || m.removedNodes.length)) {\n            notify();\n            return;\n          }\n          if (m.type === 'attributes') {\n            notify();\n            return;\n          }\n        }\n      });\n      observer.observe(root, {\n        childList: true,\n        subtree: true,\n        attributes: true,\n        attributeFilter: ['class', 'data-e2e', 'data-conversation-id', 'data-session-id', 'aria-label'],\n      });\n      window.__radarChatListObserver = observer;\n      window.__radarChatListObserverInstalled = true;\n      return { success: true };\n    } catch (error) {\n      return { success: false, error: error.message || String(error) };\n    }\n  })()";
}
function getChatConversationSnapshotScript() {
  return "(() => {\n    try {\n      const clean = (value) => String(value || '')\n        .replace(/[\\u200b-\\u200d\\ufeff]/g, '')\n        .replace(/\\s+/g, ' ')\n        .trim();\n      const isVisible = (node) => {\n        if (!node || !(node instanceof Element)) return false;\n        const rect = node.getBoundingClientRect();\n        const style = getComputedStyle(node);\n        return rect.width >= 120 && rect.height >= 30 && rect.height <= 180\n          && rect.bottom > 0 && rect.top < innerHeight\n          && style.display !== 'none' && style.visibility !== 'hidden';\n      };\n      const timePattern = /^(?:\\d{1,2}:\\d{2}|昨天|前天|刚刚|星期.|周.|\\d+分钟前|\\d+小时前|\\d{1,2}月\\d{1,2}日)$/;\n      const relativeTimeSuffix = /(?:\\s|^)(?:\\d{1,2}:\\d{2}|昨天|前天|刚刚|星期.|周.|\\d+\\s*分钟前|\\d+\\s*小时前|\\d+\\s*天前|\\d{1,2}月\\d{1,2}日)\\s*$/u;\n      const stripTime = (value) => clean(value).replace(relativeTimeSuffix, '').trim();\n      const isUidLike = (value) => /^\\d{5,}$/.test(stripTime(value));\n      const isNoiseLine = (line) => {\n        const text = clean(line);\n        if (!text) return true;\n        if (timePattern.test(text)) return true;\n        if (/^\\d+\\+?$/.test(text)) return true;\n        if (/^\\d{5,}\\s*(?:岁|刚刚|昨天|前天|\\d+分钟前|\\d+小时前)?$/.test(text)) return true;\n        return false;\n      };\n      const isGoodNickname = (value) => {\n        const text = stripTime(value);\n        if (!text || text.length > 80) return false;\n        if (isUidLike(text)) return false;\n        if (timePattern.test(text)) return false;\n        if (/^\\d+\\+?$/.test(text)) return false;\n        return true;\n      };\n      const explicitSelectors = [\n        '[data-e2e=\"conversation-item\"]',\n        '[data-e2e*=\"conversation\"]',\n        '[class*=\"conversation-item\"]',\n        '[class*=\"ConversationItem\"]',\n        '[class*=\"conversationItem\"]',\n        '[class*=\"session-item\"]',\n        '[class*=\"SessionItem\"]',\n        '[class*=\"sessionItem\"]'\n      ];\n      let rows = Array.from(document.querySelectorAll(explicitSelectors.join(','))).filter(isVisible);\n      if (!rows.length) {\n        rows = Array.from(document.querySelectorAll('[role=\"listitem\"], li')).filter((node) => {\n          if (!isVisible(node)) return false;\n          const rect = node.getBoundingClientRect();\n          if (rect.left > innerWidth * 0.65) return false;\n          const lines = String(node.innerText || '').split(/\\n+/).map(clean).filter(Boolean);\n          return lines.length >= 2 && lines.length <= 8 && !!node.querySelector('img, [class*=\"avatar\"], [class*=\"Avatar\"]');\n        });\n      }\n\n      const conversations = [];\n      const used = new Set();\n      for (const row of rows) {\n        const rawLines = String(row.innerText || '').split(/\\n+/).map(clean).filter(Boolean);\n        if (rawLines.length < 2) continue;\n        const nicknameSelectors = [\n          '[data-e2e*=\"name\"]',\n          '[class*=\"nickname\"]',\n          '[class*=\"Nickname\"]',\n          '[class*=\"user-name\"]',\n          '[class*=\"UserName\"]',\n          '[class*=\"nick-name\"]',\n          '[class*=\"NickName\"]',\n        ];\n        const titleSelectors = [\n          '[class*=\"title\"]',\n          '[class*=\"Title\"]',\n          'strong',\n          'p',\n        ];\n        const nicknameCandidates = [];\n        for (const selector of nicknameSelectors.concat(titleSelectors)) {\n          for (const node of Array.from(row.querySelectorAll(selector))) {\n            const text = clean(node.innerText || node.textContent || '');\n            if (isGoodNickname(text)) nicknameCandidates.push(stripTime(text));\n          }\n        }\n        const imgAlt = clean(row.querySelector('img[alt]')?.getAttribute('alt') || '');\n        if (isGoodNickname(imgAlt)) nicknameCandidates.push(stripTime(imgAlt));\n        const ariaLabel = clean(row.getAttribute('aria-label') || '');\n        const ariaName = ariaLabel.match(/(?:与|和)\\s*(.+?)\\s*(?:的对话|的会话|聊天|私信)/)?.[1]\n          || ariaLabel;\n        if (isGoodNickname(ariaName)) nicknameCandidates.push(stripTime(ariaName));\n        // 文本行只采首行作昵称候选，避免把消息预览「哈哈」当成好友名\n        if (isGoodNickname(rawLines[0])) nicknameCandidates.push(stripTime(rawLines[0]));\n        let senderFinal = nicknameCandidates.find(Boolean) || '';\n        if (!senderFinal) {\n          // DOM 未取到昵称时回退首行（可能是 UID）；仍优于把预览文案当昵称\n          senderFinal = stripTime(rawLines[0] || '');\n        }\n        if (!senderFinal) continue;\n        // 推送与去重统一用稳定昵称（不含相对时间）\n        const senderShown = senderFinal;\n\n        const messageNode = row.querySelector(\n          '[data-e2e*=\"message\"], [class*=\"message\"], [class*=\"Message\"], '\n          + '[class*=\"preview\"], [class*=\"Preview\"], [class*=\"content\"], [class*=\"Content\"], pre'\n        );\n        let content = clean(messageNode?.innerText || messageNode?.textContent || '');\n        if (!content || content === senderShown || content === senderFinal || content.length > 500) {\n          const contentLines = rawLines.filter((line) => (\n            line !== senderShown\n            && line !== senderFinal\n            && !line.startsWith(senderFinal + ' ')\n            && !timePattern.test(line)\n            && !isUidLike(line)\n            && !/^\\d+\\+?$/.test(line)\n          ));\n          content = contentLines[contentLines.length - 1] || '';\n        }\n        content = stripTime(content);\n        if (!senderFinal || !content || senderFinal === content) continue;\n\n        let unreadCount = 0;\n        const unreadNodes = Array.from(row.querySelectorAll(\n          '[aria-label*=\"未读\"], [title*=\"未读\"], [class*=\"unread\" i], '\n          + '[class*=\"badge\" i], [class*=\"red-dot\" i], [class*=\"reddot\" i]'\n        ));\n        for (const node of unreadNodes) {\n          const label = clean(node.getAttribute('aria-label') || node.getAttribute('title') || node.textContent);\n          const matched = label.match(/\\d+/);\n          unreadCount = Math.max(unreadCount, matched ? Number(matched[0]) : 1);\n        }\n        if (!unreadCount) {\n          const compactNodes = Array.from(row.querySelectorAll('span, i, em, div')).filter((node) => {\n            const rect = node.getBoundingClientRect();\n            if (rect.width < 4 || rect.height < 4 || rect.width > 28 || rect.height > 28) return false;\n            const style = getComputedStyle(node);\n            const color = style.backgroundColor || '';\n            const rgb = color.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)/);\n            return !!rgb && Number(rgb[1]) > 180 && Number(rgb[2]) < 130 && Number(rgb[3]) < 130;\n          });\n          for (const node of compactNodes) {\n            const text = clean(node.textContent);\n            unreadCount = Math.max(unreadCount, /^\\d+\\+?$/.test(text) ? Number.parseInt(text, 10) : 1);\n          }\n        }\n\n        const link = row.querySelector('a[href*=\"/user/\"], a[href]');\n        let key = clean(\n          row.getAttribute('data-conversation-id')\n          || row.getAttribute('data-session-id')\n          || row.getAttribute('data-id')\n          || link?.href\n          || senderFinal\n        );\n        try {\n          if (/^https?:\\/\\//i.test(key)) {\n            const parsed = new URL(key);\n            const path = String(parsed.pathname || '').replace(/\\/+$/, '');\n            const userMatch = path.match(/\\/user\\/([^/]+)/i);\n            key = userMatch && userMatch[1]\n              ? ('user:' + decodeURIComponent(userMatch[1]))\n              : ('url:' + parsed.origin + path);\n          } else if (key === senderFinal || key === senderShown) {\n            key = 'sender:' + senderFinal;\n          }\n        } catch (_) { /* keep raw key */ }\n        if (!key || used.has(key)) continue;\n        used.add(key);\n        conversations.push({\n          conversationKey: key,\n          sender: senderShown,\n          content,\n          unreadCount: Math.min(999, unreadCount),\n          isOutgoing: /^(?:我|本人)\\s*[:：]/.test(content)\n        });\n        if (conversations.length >= 100) break;\n      }\n      return {\n        success: conversations.length > 0,\n        conversations,\n        diagnostics: {\n          readyState: document.readyState,\n          candidateCount: rows.length,\n          conversationCount: conversations.length\n        }\n      };\n    } catch (error) {\n      return { success: false, conversations: [], error: error.message || String(error) };\n    }\n  })()";
}
module.exports = {
  CHAT_LIST_CHANGED_TOKEN: CHAT_LIST_CHANGED_TOKEN,
  DEFAULT_CHAT_NOTIFICATION_CONFIG: DEFAULT_CHAT_NOTIFICATION_CONFIG,
  buildChatMessageWebhookPayload: buildChatMessageWebhookPayload,
  buildChatWebhookData: buildChatWebhookData,
  buildSignedDingtalkUrl: buildSignedDingtalkUrl,
  getChatConversationSnapshotScript: getChatConversationSnapshotScript,
  getChatListObserverInstallScript: getChatListObserverInstallScript,
  getChatMonitorVisibilityKeepaliveScript: getChatMonitorVisibilityKeepaliveScript,
  isChatWebhookPushConfigured: isChatWebhookPushConfigured,
  isHttpWebhookUrl: isHttpWebhookUrl,
  normalizeChatNotificationConfig: normalizeChatNotificationConfig,
  normalizeChatWebhookType: normalizeChatWebhookType,
  normalizeConversationSnapshot: normalizeConversationSnapshot,
  parseUnreadCount: parseUnreadCount,
  reconcileConversationSnapshot: reconcileConversationSnapshot,
  sendChatMessageWebhookRequest: sendChatMessageWebhookRequest,
  stableHash: stableHash
};
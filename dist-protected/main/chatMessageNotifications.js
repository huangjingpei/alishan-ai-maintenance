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
function cleanText(_0x339b76, _0x572a2c = 500) {
  return String(_0x339b76 || "").replace(/[\u200b-\u200d\ufeff]/g, "").replace(/\s+/g, " ").trim().slice(0, _0x572a2c);
}
function clampNumber(_0x3a0533, _0x5eb9ce, _0x5b74ec, _0x81801d) {
  const _0xa5f724 = Number(_0x3a0533);
  if (!Number.isFinite(_0xa5f724)) {
    return _0x81801d;
  }
  return Math.min(_0x5b74ec, Math.max(_0x5eb9ce, Math.round(_0xa5f724)));
}
function normalizeChatWebhookType(_0x1130c5) {
  const _0x47c9c3 = String(_0x1130c5 || "").trim().toLowerCase();
  if (_0x47c9c3 === "none" || _0x47c9c3 === "off" || _0x47c9c3 === "disabled") {
    return "none";
  }
  if (_0x47c9c3 === "dingtalk") {
    return "dingtalk";
  }
  return "feishu";
}
function normalizeChatNotificationConfig(_0x55eb5b = {}) {
  const _0x45cb73 = normalizeChatWebhookType(_0x55eb5b.webhookType);
  const _0x52ed9b = {
    enabled: !!_0x55eb5b.enabled,
    webhookType: _0x45cb73,
    webhookUrlFeishu: cleanText(_0x55eb5b.webhookUrlFeishu, 2000),
    webhookUrlDingtalk: cleanText(_0x55eb5b.webhookUrlDingtalk, 2000),
    webhookSecretDingtalk: cleanText(_0x55eb5b.webhookSecretDingtalk, 1000),
    pollIntervalSeconds: clampNumber(_0x55eb5b.pollIntervalSeconds, 30, 1800, 60)
  };
  _0x52ed9b.webhookUrl = _0x45cb73 === "dingtalk" ? _0x52ed9b.webhookUrlDingtalk : _0x45cb73 === "feishu" ? _0x52ed9b.webhookUrlFeishu : "";
  _0x52ed9b.webhookSecret = _0x45cb73 === "dingtalk" ? _0x52ed9b.webhookSecretDingtalk : "";
  return _0x52ed9b;
}
function isHttpWebhookUrl(_0x502579) {
  try {
    const _0x32b352 = new URL(String(_0x502579 || "").trim());
    return _0x32b352.protocol === "http:" || _0x32b352.protocol === "https:";
  } catch (_0x120289) {
    return false;
  }
}
function isChatWebhookPushConfigured(_0x44a9dc = {}) {
  const _0x1ffd48 = normalizeChatNotificationConfig(_0x44a9dc);
  return _0x1ffd48.webhookType !== "none" && isHttpWebhookUrl(_0x1ffd48.webhookUrl);
}
function parseUnreadCount(_0x31169b) {
  if (typeof _0x31169b === "number" && Number.isFinite(_0x31169b)) {
    return Math.max(0, Math.min(999, Math.round(_0x31169b)));
  }
  const _0x24b1d7 = cleanText(_0x31169b, 30);
  if (!_0x24b1d7) {
    return 0;
  }
  if (/^\d+\+?$/.test(_0x24b1d7)) {
    return Math.max(0, Math.min(999, Number.parseInt(_0x24b1d7, 10) || 0));
  }
  if (/未读|新消息|红点/.test(_0x24b1d7)) {
    return 1;
  } else {
    return 0;
  }
}
function stableHash(_0x4af8c8) {
  const _0x2adf3d = String(_0x4af8c8 || "");
  let _0x2b37b8 = 2166136261;
  for (let _0x1d3477 = 0; _0x1d3477 < _0x2adf3d.length; _0x1d3477 += 1) {
    _0x2b37b8 ^= _0x2adf3d.charCodeAt(_0x1d3477);
    _0x2b37b8 = Math.imul(_0x2b37b8, 16777619);
  }
  return (_0x2b37b8 >>> 0).toString(36);
}
const RELATIVE_TIME_SUFFIX_RE = /(?:\s|^)(?:\d{1,2}:\d{2}|昨天|前天|刚刚|星期[一二三四五六日天]|周[一二三四五六日天]|\d+\s*分钟前|\d+\s*小时前|\d+\s*天前|\d{1,2}月\d{1,2}日)\s*$/u;
function stripRelativeTimeSuffix(_0x84404c, _0x1dc5aa = 500) {
  let _0x3a2d6d = cleanText(_0x84404c, _0x1dc5aa);
  for (let _0x22d00e = 0; _0x22d00e < 3; _0x22d00e += 1) {
    const _0x298754 = _0x3a2d6d.replace(RELATIVE_TIME_SUFFIX_RE, "").trim();
    if (_0x298754 === _0x3a2d6d) {
      break;
    }
    _0x3a2d6d = _0x298754;
  }
  return _0x3a2d6d;
}
function normalizeSenderName(_0x1bb35e) {
  return stripRelativeTimeSuffix(_0x1bb35e, 120);
}
function looksLikeNumericAccountId(_0x1e3672) {
  return /^\d{5,}$/.test(normalizeSenderName(_0x1e3672));
}
function pickFriendNickname(..._0x20d918) {
  const _0x471e14 = _0x20d918.map(_0x4113fa => normalizeSenderName(_0x4113fa)).filter(Boolean);
  const _0x5dd445 = _0x471e14.find(_0x4842d5 => !looksLikeNumericAccountId(_0x4842d5));
  return _0x5dd445 || _0x471e14[0] || "";
}
function senderConversationAlias(_0x5f19c6) {
  const _0x34a372 = normalizeSenderName(_0x5f19c6);
  if (_0x34a372) {
    return "sender:" + stableHash(_0x34a372.toLowerCase());
  } else {
    return "";
  }
}
function isUidNicknameIdentityFlip(_0x1623bc, _0x323028) {
  const _0x2ca0ca = normalizeSenderName(_0x1623bc);
  const _0x5d61b6 = normalizeSenderName(_0x323028);
  if (!_0x2ca0ca || !_0x5d61b6 || _0x2ca0ca === _0x5d61b6) {
    return false;
  }
  const _0x151c33 = looksLikeNumericAccountId(_0x2ca0ca);
  const _0x3a7d0e = looksLikeNumericAccountId(_0x5d61b6);
  return _0x151c33 !== _0x3a7d0e && (_0x151c33 || _0x3a7d0e);
}
function stabilizeConversationKey(_0x1f0345, _0x5bc499) {
  const _0x1fb299 = normalizeSenderName(_0x5bc499);
  const _0x30bb39 = senderConversationAlias(_0x1fb299);
  const _0x1c2a75 = stripRelativeTimeSuffix(_0x1f0345, 500);
  if (!_0x1c2a75) {
    return _0x30bb39;
  }
  if (_0x30bb39 && (_0x1c2a75 === _0x1fb299 || _0x1c2a75 === _0x30bb39 || _0x1c2a75 === "sender:" + _0x1fb299)) {
    return _0x30bb39;
  }
  try {
    if (/^https?:\/\//i.test(_0x1c2a75)) {
      const _0x671b6a = new URL(_0x1c2a75);
      const _0x235e6b = String(_0x671b6a.pathname || "").replace(/\/+$/, "");
      const _0x1c4935 = _0x235e6b.match(/\/user\/([^/]+)/i);
      if (_0x1c4935?.[1]) {
        return "user:" + decodeURIComponent(_0x1c4935[1]);
      }
      return "url:" + _0x671b6a.origin + _0x235e6b;
    }
  } catch (_0x1c2fe9) {}
  const _0x287aee = _0x1c2a75.match(/(?:^|[/?#])user\/([^/?#]+)/i);
  if (_0x287aee?.[1]) {
    return "user:" + decodeURIComponent(_0x287aee[1]);
  }
  return _0x1c2a75;
}
function findMatchingPreviousConversation(_0x5d7256, _0x3f62c1) {
  const _0x4ed2cb = _0x5d7256 && typeof _0x5d7256 === "object" ? _0x5d7256 : {};
  const _0x58b41e = _0x4ed2cb[_0x3f62c1.conversationKey];
  if (_0x58b41e) {
    return _0x58b41e;
  }
  const _0x1444e6 = senderConversationAlias(_0x3f62c1.sender);
  if (_0x1444e6 && _0x4ed2cb[_0x1444e6]) {
    return _0x4ed2cb[_0x1444e6];
  }
  const _0x2bd94c = normalizeSenderName(_0x3f62c1.sender);
  if (!_0x2bd94c) {
    return null;
  }
  for (const _0x5d1cb3 of Object.values(_0x4ed2cb)) {
    if (normalizeSenderName(_0x5d1cb3?.sender) === _0x2bd94c) {
      return _0x5d1cb3;
    }
  }
  const _0x1c4a55 = cleanText(_0x3f62c1.content, 500);
  if (_0x1c4a55) {
    for (const _0x4b6a9f of Object.values(_0x4ed2cb)) {
      const _0x490b2f = cleanText(_0x4b6a9f?.lastNotifiedContent || "", 500);
      const _0xcda19a = _0x490b2f && _0x490b2f === _0x1c4a55 || _0x3f62c1.fingerprint && String(_0x4b6a9f?.fingerprint || "") === String(_0x3f62c1.fingerprint) || _0x3f62c1.fingerprint && String(_0x4b6a9f?.lastNotifiedFingerprint || "") === String(_0x3f62c1.fingerprint);
      if (!_0xcda19a) {
        continue;
      }
      if (isUidNicknameIdentityFlip(_0x4b6a9f?.sender, _0x3f62c1.sender)) {
        return _0x4b6a9f;
      }
    }
  }
  return null;
}
function hasNotifiedSamePreview(_0x4a4086, _0x27daf7) {
  const _0x709db5 = String(_0x27daf7.fingerprint || "");
  const _0x6481c2 = cleanText(_0x27daf7.content, 500);
  const _0x5b312b = normalizeSenderName(_0x27daf7.sender);
  for (const [_0x51414e, _0x3eb869] of Object.entries(_0x4a4086 || {})) {
    const _0x512d3e = normalizeSenderName(_0x3eb869?.sender);
    const _0xcb4fec = _0x27daf7.conversationKey && _0x51414e === _0x27daf7.conversationKey || _0x5b312b && _0x512d3e === _0x5b312b || _0x6481c2 && cleanText(_0x3eb869?.lastNotifiedContent || "", 500) === _0x6481c2 && isUidNicknameIdentityFlip(_0x512d3e, _0x5b312b);
    if (!_0xcb4fec) {
      continue;
    }
    if (_0x709db5 && String(_0x3eb869?.lastNotifiedFingerprint || "") === _0x709db5) {
      return true;
    }
    if (_0x6481c2 && cleanText(_0x3eb869?.lastNotifiedContent || "", 500) === _0x6481c2) {
      return true;
    }
  }
  return false;
}
function normalizeConversationSnapshot(_0x3c4071 = []) {
  const _0x16ffd5 = [];
  const _0x402e21 = new Set();
  for (const _0x705dec of Array.isArray(_0x3c4071) ? _0x3c4071 : []) {
    const _0x3453c0 = pickFriendNickname(_0x705dec?.nickname, _0x705dec?.name, _0x705dec?.senderNickname, _0x705dec?.sender, _0x705dec?.title);
    const _0x40e3c1 = _0x3453c0;
    let _0x2a29f6 = stripRelativeTimeSuffix(_0x705dec?.content || _0x705dec?.message || _0x705dec?.msg);
    if (!_0x3453c0 || !_0x2a29f6) {
      continue;
    }
    const _0x32f0c8 = !!_0x705dec?.isOutgoing || /^(?:我|本人)\s*[:：]/.test(_0x2a29f6);
    if (_0x32f0c8) {
      _0x2a29f6 = _0x2a29f6.replace(/^(?:我|本人)\s*[:：]\s*/, "");
    }
    _0x2a29f6 = stripRelativeTimeSuffix(_0x2a29f6);
    if (!_0x2a29f6) {
      continue;
    }
    const _0x1a1d43 = parseUnreadCount(_0x705dec?.unreadCount ?? _0x705dec?.unread);
    const _0x4200de = cleanText(_0x705dec?.conversationKey || _0x705dec?.key || _0x705dec?.userUrl || _0x705dec?.href, 500);
    const _0xb9e694 = stabilizeConversationKey(_0x4200de, _0x3453c0);
    if (!_0xb9e694 || _0x402e21.has(_0xb9e694)) {
      continue;
    }
    _0x402e21.add(_0xb9e694);
    _0x16ffd5.push({
      conversationKey: _0xb9e694,
      sender: _0x3453c0,
      senderDisplay: _0x40e3c1 || _0x3453c0,
      content: _0x2a29f6,
      unreadCount: _0x1a1d43,
      isOutgoing: _0x32f0c8,
      fingerprint: stableHash(_0x2a29f6.toLowerCase())
    });
    if (_0x16ffd5.length >= 100) {
      break;
    }
  }
  return _0x16ffd5;
}
function normalizePreviousState(_0x3ec876 = {}) {
  const _0x1d3cb4 = _0x3ec876.conversations && typeof _0x3ec876.conversations === "object" ? _0x3ec876.conversations : {};
  return {
    initialized: !!_0x3ec876.initialized,
    conversations: _0x1d3cb4
  };
}
const CHAT_CONVERSATION_RETAIN_MS = 604800000;
const CHAT_CONVERSATION_STATE_LIMIT = 300;
function pruneConversationState(_0x2261a0, _0x45941e) {
  const _0x2b38a3 = Object.entries(_0x2261a0 || {}).filter(([, _0x1da286]) => {
    const _0x4da53d = Number(_0x1da286?.updatedAt || 0);
    return !_0x4da53d || _0x45941e - _0x4da53d <= CHAT_CONVERSATION_RETAIN_MS;
  }).sort((_0x1a63cf, _0xaefad2) => Number(_0xaefad2[1]?.updatedAt || 0) - Number(_0x1a63cf[1]?.updatedAt || 0)).slice(0, CHAT_CONVERSATION_STATE_LIMIT);
  return Object.fromEntries(_0x2b38a3);
}
function reconcileConversationSnapshot(_0x44d936, _0x5ee113, _0x5c1b72 = Date.now()) {
  const _0x2d35f5 = normalizePreviousState(_0x44d936);
  const _0x303f98 = normalizeConversationSnapshot(_0x5ee113);
  const _0x38cf10 = {};
  const _0x12fcfb = [];
  let _0x375e15 = 0;
  let _0x5e97a1 = null;
  for (const [_0x135ef5, _0xa2e093] of Object.entries(_0x2d35f5.conversations)) {
    const _0x58ccc7 = Number(_0xa2e093?.updatedAt || 0);
    if (_0x58ccc7 && _0x5c1b72 - _0x58ccc7 > CHAT_CONVERSATION_RETAIN_MS) {
      continue;
    }
    _0x38cf10[_0x135ef5] = {
      fingerprint: String(_0xa2e093?.fingerprint || ""),
      unreadCount: Math.max(0, Number(_0xa2e093?.unreadCount || 0)),
      sender: normalizeSenderName(_0xa2e093?.sender),
      updatedAt: _0x58ccc7 || _0x5c1b72,
      lastNotifiedFingerprint: String(_0xa2e093?.lastNotifiedFingerprint || ""),
      lastNotifiedContent: cleanText(_0xa2e093?.lastNotifiedContent || "", 500)
    };
  }
  for (const _0x37da8d of _0x303f98) {
    const _0x22b1fd = findMatchingPreviousConversation(_0x2d35f5.conversations, _0x37da8d) || findMatchingPreviousConversation(_0x38cf10, _0x37da8d);
    const _0x216ab7 = String(_0x22b1fd?.lastNotifiedFingerprint || "");
    let _0x1857e9 = _0x216ab7;
    let _0x347f46 = cleanText(_0x22b1fd?.lastNotifiedContent || "", 500);
    _0x375e15 += _0x37da8d.unreadCount;
    if (_0x37da8d.unreadCount > 0 && !_0x5e97a1) {
      _0x5e97a1 = _0x37da8d;
    }
    if (!_0x2d35f5.initialized) {
      if (_0x37da8d.unreadCount > 0 && !_0x37da8d.isOutgoing) {
        _0x1857e9 = _0x37da8d.fingerprint;
        _0x347f46 = _0x37da8d.content;
      }
      const _0x1795ff = {
        fingerprint: _0x37da8d.fingerprint,
        unreadCount: _0x37da8d.unreadCount,
        sender: _0x37da8d.sender,
        updatedAt: _0x5c1b72,
        lastNotifiedFingerprint: _0x1857e9,
        lastNotifiedContent: _0x347f46
      };
      _0x38cf10[_0x37da8d.conversationKey] = _0x1795ff;
      const _0x2d5d69 = senderConversationAlias(_0x37da8d.sender);
      if (_0x2d5d69 && _0x2d5d69 !== _0x37da8d.conversationKey) {
        _0x38cf10[_0x2d5d69] = {
          ..._0x1795ff
        };
      }
      continue;
    }
    if (_0x22b1fd && _0x216ab7 && !_0x347f46 && _0x216ab7 !== _0x37da8d.fingerprint) {
      _0x1857e9 = _0x37da8d.fingerprint;
      _0x347f46 = _0x37da8d.content;
    }
    const _0x141725 = _0x216ab7 && _0x216ab7 === _0x37da8d.fingerprint || _0x347f46 && _0x347f46 === _0x37da8d.content || hasNotifiedSamePreview(_0x2d35f5.conversations, _0x37da8d) || hasNotifiedSamePreview(_0x38cf10, _0x37da8d);
    const _0x5f411b = !_0x22b1fd;
    const _0xfed7ae = !!_0x22b1fd && _0x37da8d.content !== _0x347f46 && _0x22b1fd.fingerprint !== _0x37da8d.fingerprint;
    const _0x1cf90b = _0x37da8d.unreadCount > 0 && !_0x37da8d.isOutgoing && !_0x141725 && (_0x5f411b || _0xfed7ae);
    if (_0x1cf90b) {
      _0x1857e9 = _0x37da8d.fingerprint;
      _0x347f46 = _0x37da8d.content;
      _0x12fcfb.push({
        sender: _0x37da8d.sender,
        content: _0x37da8d.content,
        unreadCount: _0x37da8d.unreadCount,
        conversationKey: _0x37da8d.conversationKey,
        fingerprint: _0x37da8d.fingerprint,
        detectedAt: _0x5c1b72
      });
    }
    const _0x52d78a = pickFriendNickname(_0x37da8d.sender, _0x22b1fd?.sender) || _0x37da8d.sender;
    const _0x37460d = {
      fingerprint: _0x37da8d.fingerprint,
      unreadCount: _0x37da8d.unreadCount,
      sender: _0x52d78a,
      updatedAt: _0x5c1b72,
      lastNotifiedFingerprint: _0x1857e9,
      lastNotifiedContent: _0x347f46
    };
    _0x38cf10[_0x37da8d.conversationKey] = _0x37460d;
    const _0x209d10 = senderConversationAlias(_0x52d78a);
    if (_0x209d10 && _0x209d10 !== _0x37da8d.conversationKey) {
      _0x38cf10[_0x209d10] = {
        ..._0x37460d
      };
    }
    const _0x2cfb48 = senderConversationAlias(_0x22b1fd?.sender);
    if (_0x2cfb48 && _0x2cfb48 !== _0x37da8d.conversationKey && _0x2cfb48 !== _0x209d10) {
      _0x38cf10[_0x2cfb48] = {
        ..._0x37460d
      };
    }
    if (_0x1cf90b) {
      const _0x27c2c8 = _0x12fcfb.length - 1;
      if (_0x27c2c8 >= 0 && _0x12fcfb[_0x27c2c8]?.fingerprint === _0x37da8d.fingerprint) {
        _0x12fcfb[_0x27c2c8].sender = _0x52d78a;
      }
    }
  }
  return {
    state: {
      initialized: true,
      conversations: pruneConversationState(_0x38cf10, _0x5c1b72),
      unreadCount: Math.min(9999, _0x375e15),
      conversationCount: _0x303f98.length,
      lastSender: _0x5e97a1?.sender || "",
      lastContent: _0x5e97a1?.content || "",
      lastScanAt: _0x5c1b72
    },
    events: _0x12fcfb
  };
}
function buildChatWebhookData(_0x5534bb = {}) {
  const _0x13c9f0 = cleanText(_0x5534bb.productName, 80) || "获客雷达";
  const _0x53bca8 = cleanText(_0x5534bb.receiverNickname || _0x5534bb.accountNickname, 120) || "未获取昵称";
  const _0xe2d4cb = cleanText(_0x5534bb.receiverRemark || _0x5534bb.accountRemark, 120) || "未设置";
  const _0x2bf24f = cleanText(_0x5534bb.receiverDouyinId || _0x5534bb.douyinId, 120) || "未获取";
  const _0x46bbd5 = pickFriendNickname(_0x5534bb.senderNickname, _0x5534bb.nickname, _0x5534bb.sender) || "未知好友";
  const _0x172279 = stripRelativeTimeSuffix(_0x5534bb.content) || "[无文本内容]";
  const _0x2ed399 = parseUnreadCount(_0x5534bb.unreadCount || _0x5534bb.conversationUnreadCount);
  const _0x4dc08b = parseUnreadCount(_0x5534bb.accountUnreadCount ?? _0x5534bb.totalUnreadCount ?? _0x5534bb.accountUnread);
  const _0x1227ec = _0x5534bb.time || new Date(_0x5534bb.detectedAt || Date.now()).toLocaleString();
  const _0x546c8b = _0x2ed399 > 0 ? String(_0x2ed399) : "至少 1";
  const _0x950d90 = _0x4dc08b > 0 ? String(_0x4dc08b) : _0x2ed399 > 0 ? String(_0x2ed399) : "至少 1";
  return {
    title: "💬 " + _0x13c9f0 + " - 收到新私信",
    content: ["**收到消息的账号（抖音昵称）**: " + _0x53bca8, "**账号备注名**: " + _0xe2d4cb, "**发送消息的好友**: " + _0x46bbd5, "**该好友最新消息**: " + _0x172279, "**该好友未读数**: " + _0x546c8b, "**当前账号总未读**: " + _0x950d90].join("\n"),
    time: _0x1227ec,
    eventType: "chat_message",
    extra: {
      receiverAccountId: cleanText(_0x5534bb.accountId, 120),
      receiverNickname: _0x53bca8,
      receiverRemark: _0xe2d4cb,
      receiverDouyinId: _0x2bf24f,
      sender: _0x46bbd5,
      content: _0x172279,
      unreadCount: _0x2ed399 || 1,
      conversationUnreadCount: _0x2ed399 || 1,
      accountUnreadCount: _0x4dc08b || _0x2ed399 || 1
    }
  };
}
function buildChatMessageWebhookPayload(_0x27accb, _0x163fe3 = {}) {
  const _0x2f1477 = buildChatWebhookData(_0x163fe3);
  if (_0x27accb === "dingtalk") {
    return {
      msgtype: "markdown",
      markdown: {
        title: _0x2f1477.title,
        text: "### " + _0x2f1477.title + "\n\n" + _0x2f1477.content + "\n\n> ⏰ " + _0x2f1477.time
      }
    };
  }
  return {
    msg_type: "interactive",
    card: {
      header: {
        title: {
          tag: "plain_text",
          content: _0x2f1477.title
        },
        template: "blue"
      },
      elements: [{
        tag: "div",
        text: {
          tag: "lark_md",
          content: _0x2f1477.content
        }
      }, {
        tag: "note",
        elements: [{
          tag: "plain_text",
          content: "⏰ " + _0x2f1477.time
        }]
      }]
    }
  };
}
function buildSignedDingtalkUrl(_0x229d7f, _0x519b26, _0x2cf9d8 = Date.now()) {
  if (!_0x519b26) {
    return _0x229d7f;
  }
  const _0x10eebc = _0x2cf9d8 + "\n" + _0x519b26;
  const _0x214701 = crypto.createHmac("sha256", _0x519b26).update(_0x10eebc).digest("base64");
  const _0x3e8393 = String(_0x229d7f).includes("?") ? "&" : "?";
  return "" + _0x229d7f + _0x3e8393 + "timestamp=" + _0x2cf9d8 + "&sign=" + encodeURIComponent(_0x214701);
}
function isChatWebhookResponseSuccess(_0x470f87, _0x57d9d6) {
  if (!_0x57d9d6 || _0x57d9d6.status !== 200) {
    return false;
  }
  const _0x29e36d = _0x57d9d6.data;
  if (_0x29e36d && _0x29e36d.errcode !== undefined && _0x29e36d.errcode !== 0) {
    return false;
  }
  if (_0x470f87 === "feishu" && _0x29e36d && _0x29e36d.code !== undefined && _0x29e36d.code !== 0) {
    return false;
  }
  return true;
}
async function sendChatMessageWebhookRequest({
  axios: _0x801d41,
  config: _0x323291,
  event: _0x30bd3d,
  timeout = 10000,
  force = false
}) {
  if (!_0x801d41 || typeof _0x801d41.post !== "function") {
    throw new Error("缺少 Webhook HTTP 客户端");
  }
  const _0x20bc6d = normalizeChatNotificationConfig(_0x323291);
  if (!force && !_0x20bc6d.enabled || !isChatWebhookPushConfigured(_0x20bc6d)) {
    return {
      success: false,
      skipped: true,
      message: "Webhook 未启用或地址无效"
    };
  }
  const _0x4bb3dd = buildChatMessageWebhookPayload(_0x20bc6d.webhookType, _0x30bd3d);
  const _0x21a312 = _0x20bc6d.webhookType === "dingtalk" ? buildSignedDingtalkUrl(_0x20bc6d.webhookUrl, _0x20bc6d.webhookSecret) : _0x20bc6d.webhookUrl;
  const _0x527ec6 = await _0x801d41.post(_0x21a312, _0x4bb3dd, {
    timeout: timeout
  });
  const _0x15348b = isChatWebhookResponseSuccess(_0x20bc6d.webhookType, _0x527ec6);
  return {
    success: _0x15348b,
    message: _0x15348b ? "推送成功" : "机器人返回失败状态",
    status: _0x527ec6?.status || 0
  };
}
function getChatMonitorVisibilityKeepaliveScript() {
  return "(() => {\n    try {\n      if (window.__radarChatVisibilityKeepalive) return { success: true, reused: true };\n      window.__radarChatVisibilityKeepalive = true;\n      try {\n        Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });\n        Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });\n        Object.defineProperty(document, 'hasFocus', {\n          value: () => true,\n          configurable: true,\n          writable: false,\n        });\n      } catch (_) { /* ignore */ }\n      try {\n        document.dispatchEvent(new Event('visibilitychange'));\n      } catch (_) { /* ignore */ }\n      // 轻量心跳，降低 Chromium 对隐藏页的定时器节流影响\n      if (!window.__radarChatVisibilityHeartbeat) {\n        window.__radarChatVisibilityHeartbeat = setInterval(() => {\n          try { void document.visibilityState; } catch (_) {}\n        }, 15000);\n      }\n      return { success: true };\n    } catch (error) {\n      return { success: false, error: error.message || String(error) };\n    }\n  })()";
}
function getChatListObserverInstallScript(_0x14e40d = CHAT_LIST_CHANGED_TOKEN) {
  const _0x1e9d51 = String(_0x14e40d || CHAT_LIST_CHANGED_TOKEN).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  return "(() => {\n    try {\n      const TOKEN = '" + _0x1e9d51 + "';\n      // 每次安装先确保可见性伪装（隐藏窗场景）\n      try {\n        Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });\n        Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });\n        Object.defineProperty(document, 'hasFocus', {\n          value: () => true,\n          configurable: true,\n          writable: false,\n        });\n      } catch (_) { /* ignore */ }\n      if (window.__radarChatListObserverInstalled && window.__radarChatListObserver) {\n        return { success: true, reused: true };\n      }\n      const root = document.body || document.documentElement;\n      if (!root) return { success: false, error: 'no-root' };\n      let timer = null;\n      const notify = () => {\n        if (timer) return;\n        timer = setTimeout(() => {\n          timer = null;\n          console.log(TOKEN);\n        }, 200);\n      };\n      if (window.__radarChatListObserver) {\n        try { window.__radarChatListObserver.disconnect(); } catch (_) {}\n      }\n      const observer = new MutationObserver((mutations) => {\n        for (const m of mutations) {\n          if (m.type === 'childList' && (m.addedNodes.length || m.removedNodes.length)) {\n            notify();\n            return;\n          }\n          if (m.type === 'attributes') {\n            notify();\n            return;\n          }\n        }\n      });\n      observer.observe(root, {\n        childList: true,\n        subtree: true,\n        attributes: true,\n        attributeFilter: ['class', 'data-e2e', 'data-conversation-id', 'data-session-id', 'aria-label'],\n      });\n      window.__radarChatListObserver = observer;\n      window.__radarChatListObserverInstalled = true;\n      return { success: true };\n    } catch (error) {\n      return { success: false, error: error.message || String(error) };\n    }\n  })()";
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
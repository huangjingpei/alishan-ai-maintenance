/**
 * 线索采集：抖音直播间实时消息采集。
 *
 * 直播聊天接口返回的是 Protobuf，不能按 JSON 解析。页面自身会完成解码，本模块在
 * 主世界接入其解码后的消息总线，提取用户 UID/sec_uid 及评论、进房、点赞、礼物等事件。
 */

const LIVE_MESSAGE_NAMES = Object.freeze(["ChatMessage", "EmojiChatMessage", "MemberMessage", "GiftMessage", "BindingGiftMessage", "LikeMessage", "SocialMessage", "RoomMessage", "ExhibitionChatMessage", "ScreenChatMessage", "PrivilegeScreenChatMessage", "FansclubMessage"]);
function cleanScalar(value) {
  if (value == null) {
    return "";
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "bigint") {
    return String(value).trim();
  }
  try {
    if (typeof value.toString === "function") {
      const text = value.toString();
      if (text === "[object Object]") {
        return "";
      } else {
        return String(text).trim();
      }
    }
  } catch (_) {/* ignore */}
  return "";
}
function isDouyinSecUid(value) {
  const text = cleanScalar(value);
  if (text.length < 15) {
    return false;
  }
  if (["self", "login", "anonymous", "undefined", "null"].includes(text.toLowerCase())) {
    return false;
  }
  if (text.startsWith("name:") || text.startsWith("live_")) {
    return false;
  }
  return /^[A-Za-z0-9_-]+$/.test(text);
}
function isDouyinUid(value) {
  const text = cleanScalar(value);
  return /^\d{5,24}$/.test(text) && !/^0+$/.test(text) && text !== "111111";
}
function isDouyinWebcastUid(value) {
  const text = cleanScalar(value);
  if (text.length < 15 || text === "111111") {
    return false;
  }
  return /^[A-Za-z0-9_-]+$/.test(text);
}
function normalizeTimestamp(value, fallback = Date.now()) {
  const n = Number(cleanScalar(value));
  if (!Number.isFinite(n) || n <= 0) {
    return fallback;
  }
  if (n < 100000000000) {
    return Math.round(n * 1000);
  }
  if (n > 1000000000000000) {
    return Math.round(n / 1000);
  }
  return Math.round(n);
}
function readLivePayload(value) {
  if (!value || typeof value !== "object") {
    return {};
  }
  const payload = value.payload && typeof value.payload === "object" ? value.payload : value;
  if (payload.msg && typeof payload.msg === "object") {
    return {
      ...payload,
      ...payload.msg
    };
  } else {
    return payload;
  }
}
function readLiveUser(value) {
  if (!value || typeof value !== "object") {
    return null;
  }
  const payload = value.payload && typeof value.payload === "object" ? value.payload : value;
  const body = readLivePayload(value);
  const user = body.user || payload.user || body.user_info || body.userInfo || payload.user_info || payload.userInfo || null;
  if (user && typeof user === "object") {
    return user;
  } else {
    return null;
  }
}
function readGiftDetails(payload) {
  const gift = payload.gift && typeof payload.gift === "object" ? payload.gift : {};
  return {
    giftId: cleanScalar(gift.id_str || gift.idStr || gift.id || payload.gift_id || payload.giftId),
    giftName: cleanScalar(gift.name || gift.gift_name || gift.giftName || payload.gift_name || payload.giftName),
    giftCount: Number(payload.repeat_count ?? payload.repeatCount ?? payload.combo_count ?? payload.comboCount ?? payload.count ?? 1) || 1,
    comboCount: Number(payload.combo_count ?? payload.comboCount ?? payload.repeat_count ?? payload.repeatCount) || 0,
    diamondCount: Number(gift.diamond_count ?? gift.diamondCount ?? payload.diamond_count ?? payload.diamondCount) || 0
  };
}
function resolveLiveEventCategory(value, explicitMethod = "") {
  const payload = readLivePayload(value);
  const direct = cleanScalar(payload.category || payload.eventCategory);
  if (["enter", "like", "follow", "comment", "interaction", "gift"].includes(direct)) {
    return direct;
  }
  const method = cleanScalar(explicitMethod || value?.method || payload.method || payload.common?.method);
  if (/ChatMessage/i.test(method)) {
    return "comment";
  }
  if (/MemberMessage/i.test(method)) {
    return "enter";
  }
  if (/LikeMessage/i.test(method)) {
    return "like";
  }
  if (/GiftMessage/i.test(method)) {
    return "gift";
  }
  if (/SocialMessage/i.test(method)) {
    const action = cleanScalar(payload.action_name || payload.actionName || payload.action || payload.action_type || payload.actionType);
    const text = cleanScalar(payload.content || payload.text || payload.comment || payload.message);
    if (/关注|follow/i.test(`${action} ${text}`) || action === "1") {
      return "follow";
    }
    return "interaction";
  }
  return "interaction";
}
function categorizeLiveEvent(value, explicitMethod = "") {
  const payload = readLivePayload(value);
  const method = cleanScalar(explicitMethod || value?.method || payload.method || payload.common?.method);
  const text = cleanScalar(payload.content || payload.text || payload.comment || payload.message);
  if (/ChatMessage/i.test(method)) {
    if (text) {
      return `发表评论: ${text}`;
    } else {
      return "发表了评论";
    }
  }
  if (/MemberMessage/i.test(method)) {
    return "进入直播间";
  }
  if (/LikeMessage/i.test(method)) {
    const count = Number(payload.count ?? payload.like_count ?? payload.likeCount) || 0;
    if (count > 1) {
      return `点赞了直播间 ×${count}`;
    } else {
      return "点赞了直播间";
    }
  }
  if (/GiftMessage/i.test(method)) {
    const detail = readGiftDetails(payload);
    const countText = detail.giftCount > 1 ? ` ×${detail.giftCount}` : "";
    if (detail.giftName) {
      return `赠送礼物: ${detail.giftName}${countText}`;
    } else {
      return `赠送了礼物${countText}`;
    }
  }
  if (/SocialMessage/i.test(method)) {
    const action = cleanScalar(payload.action || payload.action_name || payload.actionName);
    if (resolveLiveEventCategory(value, method) === "follow") {
      return "关注了主播";
    }
    if (action && !/^\d+$/.test(action)) {
      return action;
    } else {
      return "互动了直播间";
    }
  }
  if (/FansclubMessage/i.test(method)) {
    return "加入/更新了粉丝团";
  }
  if (/RoomMessage/i.test(method)) {
    if (text) {
      return `直播间消息: ${text}`;
    } else {
      return "直播间互动";
    }
  }
  if (text) {
    return `直播间互动: ${text}`;
  } else {
    return "直播间互动";
  }
}
function normalizeLiveEvent(value, explicitMethod = "", observedAt = Date.now()) {
  if (!value || typeof value !== "object") {
    return null;
  }
  const payload = readLivePayload(value);
  const common = payload.common && typeof payload.common === "object" ? payload.common : {};
  const method = cleanScalar(explicitMethod || value.method || payload.method || common.method);
  if (!method) {
    return null;
  }
  const occurredAt = normalizeTimestamp(common.create_time ?? common.createTime ?? payload.create_time ?? payload.createTime ?? payload.timestamp, observedAt);
  const event = {
    messageId: cleanScalar(value.msgId || value.msg_id || payload.msg_id || payload.msgId || common.msg_id || common.msgId),
    method,
    type: method.replace(/^Webcast/, ""),
    category: resolveLiveEventCategory(value, method),
    content: categorizeLiveEvent(value, method),
    text: cleanScalar(payload.content || payload.text || payload.comment || payload.message),
    occurredAt,
    observedAt
  };
  if (/GiftMessage/i.test(method)) {
    Object.assign(event, readGiftDetails(payload));
  }
  if (/LikeMessage/i.test(method)) {
    event.likeCount = Number(payload.count ?? payload.like_count ?? payload.likeCount) || 1;
  }
  if (/SocialMessage/i.test(method)) {
    event.action = cleanScalar(payload.action || payload.action_name || payload.actionName);
  }
  return event;
}
function buildLiveUserRecord(value, explicitMethod = "", observedAt = Date.now()) {
  const user = readLiveUser(value);
  if (!user) {
    return null;
  }
  const nickname = cleanScalar(user.nickname || user.nickName || user.nick_name).replace(/^@+/, "");
  const rawSecUid = cleanScalar(user.sec_uid || user.secUid || user.sec_id);
  const rawWebcastUid = cleanScalar(user.webcast_uid || user.webcastUid || user.webcast_uid_str);
  const rawUid = cleanScalar(user.id_str || user.idStr || user.uid || user.user_id || user.userId || user.id);
  const uid = isDouyinUid(rawUid) ? rawUid : "";
  const secUid = isDouyinSecUid(rawSecUid) ? rawSecUid : "";
  // webcast_uid 是直播消息域的匿名标识，不是用户主页 sec_uid。正常用户已有
  // uid/sec_uid 时不向下游暴露它，避免被误拼成 /user/{webcast_uid}。
  const webcastUid = !uid && !secUid && isDouyinWebcastUid(rawWebcastUid) ? rawWebcastUid : "";
  if (!nickname || !secUid && !webcastUid && !uid) {
    return null;
  }
  const liveEvent = normalizeLiveEvent(value, explicitMethod, observedAt);
  if (!liveEvent) {
    return null;
  }
  const userKey = secUid || (webcastUid ? `webcast:${webcastUid}` : uid ? `uid:${uid}` : `name:${nickname}`);
  const profileAvailable = !!secUid;
  const privacyMasked = nickname.includes("*") || rawUid === "111111" || !!webcastUid;
  return {
    uid,
    secUid,
    webcastUid,
    nickname,
    userUrl: secUid ? `https://www.douyin.com/user/${secUid}` : "",
    userKey,
    identityType: profileAvailable ? "profile" : webcastUid ? "webcast" : "numeric",
    profileAvailable,
    profileUnavailable: !profileAvailable,
    profileUnavailableReason: profileAvailable ? "" : privacyMasked ? "主播设置不支持查看他人资料" : "实时消息未提供主页标识",
    privacyMasked,
    content: liveEvent.content,
    liveEvent,
    liveEvents: [liveEvent],
    messageId: liveEvent.messageId,
    eventTimestamp: liveEvent.occurredAt,
    sourceType: "live",
    entrySource: "entity_live",
    entryLabel: "线索采集：直播间"
  };
}

/**
 * 返回可注入页面主世界的自执行脚本。
 * 当前抖音直播站使用 webpackChunkdouyin_live_v2；模块号变化时也会扫描已加载模块的事件总线。
 *
 * 重要：禁止用 Function#toString() 拼助手函数。LEVEL2_SHARED 混淆后 toString 结果会残留
 * `_0x…()` 字符串表调用，页面主世界没有解码器 → ReferenceError → 采不到 sec_uid，
 * 最终退化为 DOM 抓取（开发版明文无此问题）。助手逻辑必须以内联源码字符串形式嵌入，
 * 与 entityLeadgenApiHook 一致；混淆只影响 Node 侧取串，executeJavaScript 拿到的是明文。
 */
function getEntityLeadgenLiveHookInstaller() {
  const messageNames = JSON.stringify(LIVE_MESSAGE_NAMES);
  return `(() => {
    if (window.__radar_entity_live_hooked) return true;
    window.__radar_entity_live_hooked = true;

    function cleanScalar(value) {
      if (value == null) return '';
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint') {
        return String(value).trim();
      }
      try {
        if (typeof value.toString === 'function') {
          const text = value.toString();
          return text === '[object Object]' ? '' : String(text).trim();
        }
      } catch (_) { /* ignore */ }
      return '';
    }
    function isDouyinSecUid(value) {
      const text = cleanScalar(value);
      if (text.length < 15) return false;
      if (['self', 'login', 'anonymous', 'undefined', 'null'].includes(text.toLowerCase())) return false;
      if (text.startsWith('name:') || text.startsWith('live_')) return false;
      return /^[A-Za-z0-9_-]+$/.test(text);
    }
    function isDouyinUid(value) {
      const text = cleanScalar(value);
      return /^\\d{5,24}$/.test(text) && !/^0+$/.test(text) && text !== '111111';
    }
    function isDouyinWebcastUid(value) {
      const text = cleanScalar(value);
      if (text.length < 15 || text === '111111') return false;
      return /^[A-Za-z0-9_-]+$/.test(text);
    }
    function normalizeTimestamp(value, fallback) {
      const base = fallback == null ? Date.now() : fallback;
      const n = Number(cleanScalar(value));
      if (!Number.isFinite(n) || n <= 0) return base;
      if (n < 1e11) return Math.round(n * 1000);
      if (n > 1e15) return Math.round(n / 1000);
      return Math.round(n);
    }
    function readLivePayload(value) {
      if (!value || typeof value !== 'object') return {};
      const payload = value.payload && typeof value.payload === 'object' ? value.payload : value;
      return payload.msg && typeof payload.msg === 'object' ? Object.assign({}, payload, payload.msg) : payload;
    }
    function readLiveUser(value) {
      if (!value || typeof value !== 'object') return null;
      const payload = value.payload && typeof value.payload === 'object' ? value.payload : value;
      const body = readLivePayload(value);
      const user = body.user
        || payload.user
        || body.user_info
        || body.userInfo
        || payload.user_info
        || payload.userInfo
        || null;
      return user && typeof user === 'object' ? user : null;
    }
    function readGiftDetails(payload) {
      const gift = payload.gift && typeof payload.gift === 'object' ? payload.gift : {};
      return {
        giftId: cleanScalar(gift.id_str || gift.idStr || gift.id || payload.gift_id || payload.giftId),
        giftName: cleanScalar(gift.name || gift.gift_name || gift.giftName || payload.gift_name || payload.giftName),
        giftCount: Number(
          payload.repeat_count
          ?? payload.repeatCount
          ?? payload.combo_count
          ?? payload.comboCount
          ?? payload.count
          ?? 1,
        ) || 1,
        comboCount: Number(payload.combo_count ?? payload.comboCount ?? payload.repeat_count ?? payload.repeatCount) || 0,
        diamondCount: Number(gift.diamond_count ?? gift.diamondCount ?? payload.diamond_count ?? payload.diamondCount) || 0,
      };
    }
    function resolveLiveEventCategory(value, explicitMethod) {
      const payload = readLivePayload(value);
      const direct = cleanScalar(payload.category || payload.eventCategory);
      if (['enter', 'like', 'follow', 'comment', 'interaction', 'gift'].includes(direct)) return direct;
      const method = cleanScalar(explicitMethod || value && value.method || payload.method || (payload.common && payload.common.method));
      if (/ChatMessage/i.test(method)) return 'comment';
      if (/MemberMessage/i.test(method)) return 'enter';
      if (/LikeMessage/i.test(method)) return 'like';
      if (/GiftMessage/i.test(method)) return 'gift';
      if (/SocialMessage/i.test(method)) {
        const action = cleanScalar(
          payload.action_name
          || payload.actionName
          || payload.action
          || payload.action_type
          || payload.actionType,
        );
        const text = cleanScalar(payload.content || payload.text || payload.comment || payload.message);
        if (/关注|follow/i.test(action + ' ' + text) || action === '1') return 'follow';
        return 'interaction';
      }
      return 'interaction';
    }
    function categorizeLiveEvent(value, explicitMethod) {
      const payload = readLivePayload(value);
      const method = cleanScalar(explicitMethod || value && value.method || payload.method || (payload.common && payload.common.method));
      const text = cleanScalar(payload.content || payload.text || payload.comment || payload.message);
      if (/ChatMessage/i.test(method)) return text ? ('发表评论: ' + text) : '发表了评论';
      if (/MemberMessage/i.test(method)) return '进入直播间';
      if (/LikeMessage/i.test(method)) {
        const count = Number(payload.count ?? payload.like_count ?? payload.likeCount) || 0;
        return count > 1 ? ('点赞了直播间 ×' + count) : '点赞了直播间';
      }
      if (/GiftMessage/i.test(method)) {
        const detail = readGiftDetails(payload);
        const countText = detail.giftCount > 1 ? (' ×' + detail.giftCount) : '';
        return detail.giftName ? ('赠送礼物: ' + detail.giftName + countText) : ('赠送了礼物' + countText);
      }
      if (/SocialMessage/i.test(method)) {
        const action = cleanScalar(payload.action || payload.action_name || payload.actionName);
        if (resolveLiveEventCategory(value, method) === 'follow') return '关注了主播';
        return action && !/^\\d+$/.test(action) ? action : '互动了直播间';
      }
      if (/FansclubMessage/i.test(method)) return '加入/更新了粉丝团';
      if (/RoomMessage/i.test(method)) return text ? ('直播间消息: ' + text) : '直播间互动';
      return text ? ('直播间互动: ' + text) : '直播间互动';
    }
    function normalizeLiveEvent(value, explicitMethod, observedAt) {
      if (!value || typeof value !== 'object') return null;
      const payload = readLivePayload(value);
      const common = payload.common && typeof payload.common === 'object' ? payload.common : {};
      const method = cleanScalar(explicitMethod || value.method || payload.method || common.method);
      if (!method) return null;
      const occurredAt = normalizeTimestamp(
        common.create_time
        ?? common.createTime
        ?? payload.create_time
        ?? payload.createTime
        ?? payload.timestamp,
        observedAt,
      );
      const event = {
        messageId: cleanScalar(
          value.msgId
          || value.msg_id
          || payload.msg_id
          || payload.msgId
          || common.msg_id
          || common.msgId,
        ),
        method: method,
        type: method.replace(/^Webcast/, ''),
        category: resolveLiveEventCategory(value, method),
        content: categorizeLiveEvent(value, method),
        text: cleanScalar(payload.content || payload.text || payload.comment || payload.message),
        occurredAt: occurredAt,
        observedAt: observedAt,
      };
      if (/GiftMessage/i.test(method)) Object.assign(event, readGiftDetails(payload));
      if (/LikeMessage/i.test(method)) {
        event.likeCount = Number(payload.count ?? payload.like_count ?? payload.likeCount) || 1;
      }
      if (/SocialMessage/i.test(method)) {
        event.action = cleanScalar(payload.action || payload.action_name || payload.actionName);
      }
      return event;
    }
    function buildLiveUserRecord(value, explicitMethod, observedAt) {
      const user = readLiveUser(value);
      if (!user) return null;
      const nickname = cleanScalar(user.nickname || user.nickName || user.nick_name).replace(/^@+/, '');
      const rawSecUid = cleanScalar(user.sec_uid || user.secUid || user.sec_id);
      const rawWebcastUid = cleanScalar(user.webcast_uid || user.webcastUid || user.webcast_uid_str);
      const rawUid = cleanScalar(
        user.id_str
        || user.idStr
        || user.uid
        || user.user_id
        || user.userId
        || user.id,
      );
      const uid = isDouyinUid(rawUid) ? rawUid : '';
      const secUid = isDouyinSecUid(rawSecUid) ? rawSecUid : '';
      const webcastUid = !uid && !secUid && isDouyinWebcastUid(rawWebcastUid) ? rawWebcastUid : '';
      if (!nickname || (!secUid && !webcastUid && !uid)) return null;
      const liveEvent = normalizeLiveEvent(value, explicitMethod, observedAt);
      if (!liveEvent) return null;
      const userKey = secUid || (webcastUid ? ('webcast:' + webcastUid) : (uid ? ('uid:' + uid) : ('name:' + nickname)));
      const profileAvailable = !!secUid;
      const privacyMasked = nickname.indexOf('*') >= 0 || rawUid === '111111' || !!webcastUid;
      return {
        uid: uid,
        secUid: secUid,
        webcastUid: webcastUid,
        nickname: nickname,
        userUrl: secUid ? ('https://www.douyin.com/user/' + secUid) : '',
        userKey: userKey,
        identityType: profileAvailable ? 'profile' : (webcastUid ? 'webcast' : 'numeric'),
        profileAvailable: profileAvailable,
        profileUnavailable: !profileAvailable,
        profileUnavailableReason: profileAvailable
          ? ''
          : (privacyMasked ? '主播设置不支持查看他人资料' : '实时消息未提供主页标识'),
        privacyMasked: privacyMasked,
        content: liveEvent.content,
        liveEvent: liveEvent,
        liveEvents: [liveEvent],
        messageId: liveEvent.messageId,
        eventTimestamp: liveEvent.occurredAt,
        sourceType: 'live',
        entrySource: 'entity_live',
        entryLabel: '线索采集：直播间',
      };
    }

    const liveMessageNames = new Set(${messageNames});
    const status = window.__radar_entity_live_hook_status = {
      installedAt: Date.now(),
      webpackReady: false,
      patchedEmitters: 0,
      patchedSubscriptions: 0,
      directSubscriptions: 0,
      capturedEvents: 0,
      capturedUsers: 0,
      lastEvent: '',
      lastError: '',
    };
    window.__radar_entity_live_records = window.__radar_entity_live_records || [];
    const seenMessages = new Set();

    const report = (eventName, args) => {
      try {
        if (!liveMessageNames.has(String(eventName || ''))) return;
        const candidates = [];
        args.forEach((arg) => {
          if (Array.isArray(arg)) candidates.push(...arg);
          else if (arg && typeof arg === 'object') candidates.push(arg);
        });
        const observedAt = Date.now();
        const users = candidates
          .map((item) => buildLiveUserRecord(item, String(eventName), observedAt))
          .filter(Boolean)
          .filter((item) => {
            const event = item.liveEvent || {};
            const identity = String(event.messageId || '').trim()
              || [
                item.userKey || '',
                event.method || '',
                event.occurredAt || event.observedAt || '',
                event.content || event.text || '',
              ].join('|');
            if (seenMessages.has(identity)) return false;
            seenMessages.add(identity);
            if (seenMessages.size > 5000) {
              const oldest = seenMessages.values().next().value;
              seenMessages.delete(oldest);
            }
            return true;
          });
        status.capturedEvents += candidates.length;
        status.lastEvent = String(eventName);
        if (!users.length) return;
        status.capturedUsers += users.length;
        window.__radar_entity_live_records.push(...users);
        if (window.__radar_entity_live_records.length > 200) {
          window.__radar_entity_live_records.splice(0, window.__radar_entity_live_records.length - 200);
        }
        document.dispatchEvent(new CustomEvent('__radar_entity_live', {
          detail: { hint: 'live', users },
        }));
      } catch (error) {
        status.lastError = String(error && (error.stack || error.message) || error).slice(0, 500);
      }
    };

    const patchPrototype = (proto) => {
      if (!proto) return false;
      let patched = false;
      if (typeof proto.emit === 'function' && !proto.emit.__radarEntityLivePatched) {
        const originalEmit = proto.emit;
        function radarEntityLiveEmit(eventName, ...args) {
          report(eventName, args);
          return originalEmit.call(this, eventName, ...args);
        }
        radarEntityLiveEmit.__radarEntityLivePatched = true;
        radarEntityLiveEmit.__radarEntityLiveOriginal = originalEmit;
        try {
          proto.emit = radarEntityLiveEmit;
          status.patchedEmitters += 1;
          patched = true;
        } catch (_) { /* ignore */ }
      }
      if (typeof proto.on === 'function' && !proto.on.__radarEntityLivePatched) {
        const originalOn = proto.on;
        function radarEntityLiveOn(eventName, callback, ...args) {
          if (!liveMessageNames.has(String(eventName || '')) || typeof callback !== 'function') {
            return originalOn.call(this, eventName, callback, ...args);
          }
          const wrapped = (...payloadArgs) => {
            report(eventName, payloadArgs);
            return callback(...payloadArgs);
          };
          return originalOn.call(this, eventName, wrapped, ...args);
        }
        radarEntityLiveOn.__radarEntityLivePatched = true;
        radarEntityLiveOn.__radarEntityLiveOriginal = originalOn;
        try {
          proto.on = radarEntityLiveOn;
          status.patchedSubscriptions += 1;
          patched = true;
        } catch (_) { /* ignore */ }
      }
      return patched;
    };

    let webpackRequire = null;
    let subscribedMessageInstance = null;
    const subscribeMessageInstance = () => {
      try {
        const store = window.__STORE__ || null;
        const instance = window.__MESSAGE_INSTANCE__
          || (store && store.singletonStore && store.singletonStore.message)
          || (store && store.message)
          || null;
        if (!instance || instance === subscribedMessageInstance || typeof instance.on !== 'function') return false;
        liveMessageNames.forEach((eventName) => {
          try {
            instance.on(eventName, (...args) => report(eventName, args));
            status.directSubscriptions += 1;
          } catch (_) { /* unsupported message type */ }
        });
        subscribedMessageInstance = instance;
        return true;
      } catch (error) {
        status.lastError = String(error && (error.message || error)).slice(0, 500);
        return false;
      }
    };

    const patchModuleExports = (exportsValue) => {
      if (!exportsValue) return;
      const values = new Set([exportsValue]);
      if (typeof exportsValue === 'object' || typeof exportsValue === 'function') {
        ['default', 'Q', 'TQ', 'Emitter', 'EventEmitter'].forEach((key) => {
          try { if (exportsValue[key]) values.add(exportsValue[key]); } catch (_) { /* ignore */ }
        });
      }
      values.forEach((value) => {
        try {
          const proto = typeof value === 'function' ? value.prototype : null;
          if (proto && (typeof proto.emit === 'function' || typeof proto.on === 'function')) patchPrototype(proto);
        } catch (_) { /* ignore */ }
      });
    };

    const patchLoadedEmitters = () => {
      if (!webpackRequire) return;
      try {
        const knownIds = ['492481', '317807'];
        knownIds.forEach((id) => {
          try {
            if (webpackRequire.m && webpackRequire.m[id]) patchModuleExports(webpackRequire(id));
          } catch (_) { /* version fallback below */ }
        });
        const cache = webpackRequire.c || {};
        Object.keys(cache).forEach((id) => {
          try { patchModuleExports(cache[id] && cache[id].exports); } catch (_) { /* ignore */ }
        });
      } catch (error) {
        status.lastError = String(error && (error.message || error)).slice(0, 500);
      }
    };

    const captureWebpack = () => {
      try {
        const chunks = window.webpackChunkdouyin_live_v2
          || (window.webpackChunkdouyin_live_v2 = []);
        if (!Array.isArray(chunks)) return false;
        chunks.push([
          ['radar_entity_live_' + Date.now() + '_' + Math.random().toString(36).slice(2)],
          {},
          (req) => {
            webpackRequire = req;
            status.webpackReady = true;
            patchLoadedEmitters();
          },
        ]);
        return true;
      } catch (error) {
        status.lastError = String(error && (error.message || error)).slice(0, 500);
        return false;
      }
    };

    captureWebpack();
    const timer = setInterval(() => {
      if (!webpackRequire) captureWebpack();
      patchLoadedEmitters();
      subscribeMessageInstance();
      if (status.patchedEmitters > 0 && Date.now() - status.installedAt > 10 * 60 * 1000) {
        clearInterval(timer);
      }
    }, 250);
    subscribeMessageInstance();
    return true;
  })();`;
}
module.exports = {
  LIVE_MESSAGE_NAMES,
  cleanScalar,
  isDouyinSecUid,
  isDouyinUid,
  isDouyinWebcastUid,
  normalizeTimestamp,
  resolveLiveEventCategory,
  categorizeLiveEvent,
  normalizeLiveEvent,
  buildLiveUserRecord,
  getEntityLeadgenLiveHookInstaller
};
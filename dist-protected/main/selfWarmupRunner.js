const path = require("path");
const crypto = require("crypto");
const axios = require("axios");
const {
  BrowserWindow,
  ipcMain
} = require("electron");
const {
  acquireTaskRuntimeGuard,
  releaseTaskRuntimeGuard
} = require("./taskRuntimeGuard");
const {
  applyHiddenAutomationWindowPolicy,
  ensureHiddenWindowStaysHidden,
  hideVisibleAutomationWindow,
  showHiddenAutomationWindow
} = require("./hiddenWindowGuards");
const {
  buildSelfWarmupEventSeenKey,
  mergeSelfWarmupNoticeEvents,
  normalizeName
} = require("../shared/selfWarmupDedupe");
const {
  collectNoticeItems,
  extractNoticeAwemeId,
  extractNoticeCommentId
} = require("../shared/selfWarmupNoticeParse");
const {
  buildDouyinCommentLocateUrl
} = require("../shared/processedVideoKey");
const {
  extractUserKeyFromUrl
} = require("../shared/leadUserKey");
const {
  appendRandomEmojiSuffix
} = require("../shared/randomTextSuffix");
const {
  looksLikeDouyinGroupChatName,
  detectDouyinDmIsGroupChat
} = require("../shared/douyinDmGroupChat");
const {
  isDouyinStrangerMessagesFolderName,
  isDouyinStrangerMessagesFolderRow
} = require("../shared/douyinChatModule");
const {
  getSeenKeys,
  saveSeenKeys,
  getPendingEvents,
  savePendingEvents
} = require("./selfWarmupEventCache");
const {
  commentItemsHaveAttachment,
  resolveSelfWarmupContentMode,
  resolveSelfWarmupTemplatePayload
} = require("../shared/selfWarmupTemplates");
const {
  isDouyinChatPageUrl,
  isWarmupHeavyPageUrl,
  isWarmupIdleJingxuanUrl,
  shouldWarmupIdleOnChat
} = require("../shared/selfWarmupPageRecycle");
const {
  isWarmupSurfaceComplete,
  canCommitNotificationScan,
  canCommitDmScan
} = require("../shared/selfWarmupSurfaceState");
const {
  ACCOUNT_ACTION_LIMIT_SPECS,
  createAccountActionLimitStore,
  getAccountActionLimitStatus,
  recordAccountActionLimitSuccess,
  formatAccountActionLimitSummary,
  mapSelfWarmupActionToLimitKey
} = require("../shared/actionLimit");
function resolveSelfWarmupVideoUrl(_0x881e96, _0x10f00f = null) {
  return buildDouyinCommentLocateUrl(_0x881e96, _0x10f00f) || String(_0x881e96 || "").trim();
}
function isSelfWarmupVideoPageUrl(_0x328e0b) {
  const _0x239428 = String(_0x328e0b || "");
  return /\/video\/|\/note\/|modal_id=/.test(_0x239428);
}
let selfWarmupDmLogBridgeReady = false;
let selfWarmupDmLogSink = null;
function ensureSelfWarmupDmLogBridge() {
  if (selfWarmupDmLogBridgeReady) {
    return;
  }
  selfWarmupDmLogBridgeReady = true;
  ipcMain.on("self-warmup-dm-log", (_0x181c19, _0x19ae68 = {}) => {
    const _0x5bd683 = String(_0x19ae68.message || "").trim();
    const _0x2a2f0c = _0x19ae68.extra && typeof _0x19ae68.extra === "object" ? _0x19ae68.extra : null;
    if (_0x5bd683) {
      const _0x1c351f = _0x2a2f0c && Object.keys(_0x2a2f0c).length ? " | " + JSON.stringify(_0x2a2f0c) : "";
      console.log(_0x5bd683.startsWith("[SelfWarmup-DM]") ? "" + _0x5bd683 + _0x1c351f : "[SelfWarmup-DM] " + _0x5bd683 + _0x1c351f);
      try {
        selfWarmupDmLogSink?.(_0x181c19, {
          ..._0x19ae68,
          message: _0x5bd683,
          extra: _0x2a2f0c
        });
      } catch (_0x28cf94) {}
    }
  });
}
const latestNoticeJsonStore = new Map();
let selfWarmupNoticeJsonBridgeReady = false;
function ensureSelfWarmupNoticeJsonBridge() {
  if (selfWarmupNoticeJsonBridgeReady) {
    return;
  }
  selfWarmupNoticeJsonBridgeReady = true;
  ipcMain.on("self-warmup-notice-json", (_0x2666e0, _0x21f6a2 = {}) => {
    try {
      const _0x36a46d = _0x2666e0.sender?.id;
      if (_0x36a46d && _0x21f6a2?.data) {
        latestNoticeJsonStore.set(_0x36a46d + ":notice", {
          data: _0x21f6a2.data,
          url: _0x21f6a2.url || "",
          kind: "notice",
          ts: Date.now()
        });
      }
    } catch (_0x3d6303) {}
  });
  ipcMain.on("self-warmup-im-json", (_0xbed91d, _0x571f38 = {}) => {
    try {
      const _0x13385c = _0xbed91d.sender?.id;
      if (_0x13385c && _0x571f38?.data) {
        latestNoticeJsonStore.set(_0x13385c + ":im", {
          data: _0x571f38.data,
          url: _0x571f38.url || "",
          kind: "im",
          ts: Date.now()
        });
      }
    } catch (_0x591249) {}
  });
}
function parseDouyinNoticeJson(_0x436eee, _0x2cb30b = {}) {
  if (!_0x436eee || typeof _0x436eee !== "object") {
    return [];
  }
  const _0xee7a86 = collectNoticeItems(_0x436eee);
  if (!Array.isArray(_0xee7a86) || _0xee7a86.length === 0) {
    return [];
  }
  const _0x4205de = [];
  for (const _0x3a9f5b of _0xee7a86) {
    try {
      const _0x2fc76f = Number(_0x3a9f5b.notice_type || _0x3a9f5b.group_type || _0x3a9f5b.type || 0);
      const _0x482a40 = _0x3a9f5b.user || _0x3a9f5b.from_user || _0x3a9f5b.comment?.user || _0x3a9f5b.content?.user || {};
      const _0x190404 = compactText(_0x482a40.nickname || _0x482a40.name || "");
      const _0x2f1ae1 = _0x482a40.sec_uid ? "https://www.douyin.com/user/" + _0x482a40.sec_uid : "";
      const _0x198398 = _0x3a9f5b.comment || _0x3a9f5b.content?.comment || {};
      const _0x5d0b05 = compactText(_0x198398.text || _0x198398.content || "");
      const _0x5cd20e = extractNoticeCommentId(_0x3a9f5b);
      const _0x3e6382 = extractNoticeAwemeId(_0x3a9f5b);
      const _0x3ff1b5 = _0x3e6382 ? resolveSelfWarmupVideoUrl("https://www.douyin.com/video/" + _0x3e6382, _0x5cd20e) : "";
      let _0x10123a = "unknown";
      let _0x5d137c = "";
      if (_0x2fc76f === 1 || _0x2fc76f === 11 || _0x3a9f5b.like || /like/i.test(_0x3a9f5b.type_name || "")) {
        _0x10123a = "like";
        _0x5d137c = "赞了你的作品";
      } else if (_0x2fc76f === 2 || _0x2fc76f === 12 || _0x5d0b05 || /comment|reply/i.test(_0x3a9f5b.type_name || "")) {
        if (_0x198398.reply_id || _0x198398.reply_comment || /回复/i.test(_0x5d0b05)) {
          _0x10123a = "reply";
          _0x5d137c = "回复了你";
        } else {
          _0x10123a = "comment";
          _0x5d137c = "评论了你的作品";
        }
      } else if (_0x2fc76f === 3 || _0x2fc76f === 13 || _0x3a9f5b.follow || /follow/i.test(_0x3a9f5b.type_name || "")) {
        _0x10123a = "follow";
        _0x5d137c = "关注了你";
      }
      if (_0x10123a === "unknown" && !_0x5d0b05 && !_0x190404) {
        continue;
      }
      const _0x1dc873 = (Array.isArray(_0x3a9f5b.notice_list) || Array.isArray(_0x3a9f5b.notices) || Array.isArray(_0x3a9f5b.children)) && !_0x190404 && !_0x5d0b05;
      if (_0x1dc873) {
        continue;
      }
      _0x4205de.push({
        source: "notification",
        eventType: _0x10123a,
        nickname: _0x190404 || "抖音用户",
        userUrl: _0x2f1ae1,
        text: _0x5d0b05 || _0x5d137c,
        rowText: _0x190404 + " " + _0x5d137c + " " + _0x5d0b05,
        eventText: _0x5d137c,
        videoUrl: _0x3ff1b5,
        commentId: _0x5cd20e,
        cid: _0x5cd20e,
        createTime: _0x3a9f5b.create_time ? _0x3a9f5b.create_time * 1000 : Date.now(),
        unread: !_0x3a9f5b.is_read,
        accountName: _0x2cb30b.name || _0x2cb30b.nickname || "",
        accountId: _0x2cb30b.id || ""
      });
    } catch (_0xa82621) {}
  }
  return _0x4205de;
}
const EVENT_TYPE_LABELS = {
  comment: "新评论",
  reply: "评论回复",
  like: "新点赞",
  follow: "新关注",
  message: "新私信"
};
const WATCH_KEYS = {
  comment: "watchComments",
  reply: "watchReplies",
  like: "watchLikes",
  follow: "watchFollows",
  message: "watchMessages"
};
const ACTION_LABELS = {
  follow_back: "回关",
  user_follow: "关注",
  like_comment: "点赞评论",
  reply_comment: "回复评论",
  reply_dm: "回复私信",
  send_dm: "发送私信"
};
function delay(_0x41de2b) {
  return new Promise(_0x4fbe12 => setTimeout(_0x4fbe12, _0x41de2b));
}
function compactText(_0x2631ee) {
  return String(_0x2631ee || "").replace(/[\u200b-\u200f\u202a-\u202e\u2060-\u206f]/g, "").replace(/\s+/g, " ").trim();
}
function cleanDmDeliveredSnippet(_0x2b128e) {
  return compactText(_0x2b128e).replace(/(?:\s*[·•]?\s*(?:点赞|回复|撤回|删除|复制|举报|多选|转发))+$/u, "").trim();
}
function formatDmDeliveredLog(_0x40f0bd, _0x4b09c6 = {}) {
  const _0x5ce95a = cleanDmDeliveredSnippet(_0x4b09c6.sentText) || cleanDmDeliveredSnippet(_0x4b09c6.debug?.snippet);
  if (_0x5ce95a) {
    return (_0x40f0bd || "用户") + " 私信回复已确认送达：" + _0x5ce95a;
  } else {
    return (_0x40f0bd || "用户") + " 私信回复已确认送达";
  }
}
function sanitizeDmNickname(_0x347b40, _0x4e2414 = "", _0x56a959 = "") {
  let _0x160cac = compactText(_0x347b40);
  if (!_0x160cac) {
    return "";
  }
  const _0x183d76 = compactText(_0x4e2414);
  const _0x4a7e6a = compactText(_0x56a959);
  _0x160cac = _0x160cac.replace(/(?:\s|[·•])*\d+\+?\s*$/u, "").trim();
  if (_0x4a7e6a && _0x160cac.endsWith(_0x4a7e6a)) {
    _0x160cac = _0x160cac.slice(0, -_0x4a7e6a.length).replace(/(?:\s|[·•])+$/u, "").trim();
  } else {
    _0x160cac = _0x160cac.replace(/(?:\s|[·•])*(?:刚刚|\d+秒前|\d+分钟前|\d+小时前|\d+天前|昨天|前天|星期[一二三四五六日天]|\d{1,2}:\d{2})$/u, "").trim();
  }
  if (_0x183d76 && _0x160cac.length > _0x183d76.length) {
    if (_0x160cac.endsWith(_0x183d76)) {
      _0x160cac = _0x160cac.slice(0, -_0x183d76.length).replace(/(?:\s|[·•])+$/u, "").trim();
    } else {
      const _0x18971c = _0x160cac.indexOf(_0x183d76);
      if (_0x18971c > 0) {
        const _0x461296 = _0x160cac.slice(0, _0x18971c).replace(/(?:\s|[·•])+$/u, "").trim();
        if (_0x461296) {
          _0x160cac = _0x461296;
        }
      }
    }
  }
  const _0x2c4b15 = _0x160cac.split(/\s*[·•]\s*/).map(_0x24c69e => compactText(_0x24c69e)).filter(Boolean);
  if (_0x2c4b15.length >= 2 && _0x2c4b15[0].length <= 40) {
    _0x160cac = _0x2c4b15[0];
  }
  return _0x160cac || compactText(_0x347b40);
}
function formatEventBrief(_0x5840f8, {
  maxText = 36
} = {}) {
  const _0x2e2c1d = _0x5840f8?.eventLabel || EVENT_TYPE_LABELS[_0x5840f8?.eventType] || "通知";
  const _0x4e8f20 = compactText(_0x5840f8?.nickname) || "用户";
  const _0x3bbb51 = compactText(_0x5840f8?.text);
  const _0x4eab7e = _0x3bbb51.slice(0, maxText);
  const _0x22898c = _0x4eab7e ? "「" + _0x4eab7e + (_0x3bbb51.length > maxText ? "…" : "") + "」" : "（无正文摘要）";
  return _0x2e2c1d + " · @" + _0x4e8f20 + " " + _0x22898c;
}
function formatNewEventsDiscoveryLog(_0x27eb90, _0x12ad32) {
  const _0x3af112 = Array.isArray(_0x12ad32) ? _0x12ad32 : [];
  if (_0x3af112.length === 1) {
    return "账号 " + _0x27eb90 + " 发现 1 条新通知：" + formatEventBrief(_0x3af112[0]);
  }
  const _0x3c8238 = _0x3af112.filter(_0x413363 => _0x413363.matched).length;
  const _0x5a187e = _0x3af112.slice(0, 5).map((_0x1925ea, _0x4ce066) => "  " + (_0x4ce066 + 1) + ". " + formatEventBrief(_0x1925ea));
  const _0x2cc073 = _0x3af112.length > 5 ? " (另有 " + (_0x3af112.length - 5) + " 条)" : "";
  return "账号 " + _0x27eb90 + " 发现 " + _0x3af112.length + " 条新通知（跟进 " + _0x3c8238 + " 条）：\n" + _0x5a187e.join("\n") + _0x2cc073;
}
function splitList(_0x55e757) {
  return String(_0x55e757 || "").split(/[\n,，、;；]+/).map(_0x40f5f6 => _0x40f5f6.trim()).filter(Boolean);
}
function parseNotificationType(_0x4aba8f) {
  const _0x3cbe89 = compactText(_0x4aba8f);
  if (/回复了你|回复了你的评论|回复你的评论/.test(_0x3cbe89)) {
    return "reply";
  }
  if (/评论了你的(?:作品|视频|评论|动态)?|给你评论|写下了评论/.test(_0x3cbe89)) {
    return "comment";
  }
  if (/关注了你|开始关注你|成为了你的粉丝/.test(_0x3cbe89)) {
    return "follow";
  }
  if (/赞了你的(?:作品|视频|评论|动态)?|点赞|喜欢了你的/.test(_0x3cbe89)) {
    return "like";
  }
  return "unknown";
}
function isJudgeableEvent(_0x3ceb48) {
  return ["comment", "reply", "message"].includes(_0x3ceb48?.eventType);
}
function signDingtalkUrl(_0x712060, _0x5defb7) {
  if (!_0x5defb7) {
    return _0x712060;
  }
  const _0x1c8a96 = Date.now();
  const _0x2f6d19 = _0x1c8a96 + "\n" + _0x5defb7;
  const _0x6e663e = crypto.createHmac("sha256", _0x5defb7).update(_0x2f6d19).digest("base64");
  const _0x228efe = _0x712060.includes("?") ? "&" : "?";
  return "" + _0x712060 + _0x228efe + "timestamp=" + _0x1c8a96 + "&sign=" + encodeURIComponent(_0x6e663e);
}
function buildWebhookPayload(_0x10c931, _0x356aea) {
  if (_0x10c931 === "feishu") {
    return {
      msg_type: "interactive",
      card: {
        header: {
          title: {
            tag: "plain_text",
            content: _0x356aea.title || "自热互动提醒"
          },
          template: "blue"
        },
        elements: [{
          tag: "div",
          text: {
            tag: "lark_md",
            content: _0x356aea.content || ""
          }
        }, {
          tag: "hr"
        }, {
          tag: "note",
          elements: [{
            tag: "plain_text",
            content: _0x356aea.time || new Date().toLocaleString()
          }]
        }]
      }
    };
  }
  if (_0x10c931 === "dingtalk") {
    return {
      msgtype: "markdown",
      markdown: {
        title: _0x356aea.title || "自热互动提醒",
        text: "### " + (_0x356aea.title || "自热互动提醒") + "\n\n" + (_0x356aea.content || "") + "\n\n> " + (_0x356aea.time || new Date().toLocaleString())
      }
    };
  }
  return {
    event: "self_warmup",
    title: _0x356aea.title || "自热互动提醒",
    content: _0x356aea.content || "",
    time: _0x356aea.time || new Date().toLocaleString(),
    items: _0x356aea.items || []
  };
}
function isWebhookResponseSuccess(_0x16a81b, _0x20083b) {
  if (!_0x20083b || _0x20083b.status !== 200) {
    return false;
  }
  if (_0x20083b.data) {
    if (_0x20083b.data.errcode !== undefined && _0x20083b.data.errcode !== 0) {
      return false;
    }
    if (_0x20083b.data.code !== undefined && _0x16a81b === "feishu" && _0x20083b.data.code !== 0) {
      return false;
    }
  }
  return true;
}
function createSelfWarmupRunner(_0x1d2021) {
  ensureSelfWarmupDmLogBridge();
  const {
    app: _0x505093,
    store: _0x3c83bb,
    fs: _0x8722c8,
    runtimeConfig = null,
    applyAccountProxy: _0x54a3ac,
    configureAutomationSession: _0x3b8fcf,
    applyPackagedWindowMenuPolicy: _0x464e64,
    attachProtocolGuard: _0x3ab795,
    analyzeMonitorCommentsBatch: _0x2965c4,
    generateMonitorPersonaContent: _0x200d41,
    matchKeywords: _0x7d5c87,
    isMonitorAccountAiEnabled: _0x51f0a2
  } = _0x1d2021;
  async function _0x18dbf4(_0x12bdc5) {
    if (!runtimeConfig || !_0x12bdc5 || _0x12bdc5.isDestroyed?.()) {
      return;
    }
    try {
      if (typeof runtimeConfig.ensureFetched === "function") {
        await runtimeConfig.ensureFetched();
      }
      runtimeConfig.pushToWebContents?.(_0x12bdc5);
    } catch (_0x5b1ebd) {
      console.warn("[SelfWarmup] runtime config push failed:", _0x5b1ebd?.message || _0x5b1ebd);
    }
  }
  const _0x139d3d = () => {
    if (typeof _0x1d2021.getMainWindow === "function") {
      return _0x1d2021.getMainWindow();
    }
    return _0x1d2021.mainWindow || null;
  };
  const _0x332b9f = new Map();
  const _0x46d1ca = new Map();
  const _0x4f3dd4 = new Map();
  const _0x183f60 = new Map();
  const _0x2dc815 = new Map();
  const _0x44b85d = 45000;
  const _0x4646db = 18000;
  const _0x3a75de = 15000;
  const _0x175e26 = 22000;
  const _0x6d588c = 400;
  const _0x2597db = 15;
  const _0x5e7160 = 2;
  const _0x26fc15 = 300;
  const _0x1554e4 = 5000;
  const _0x42421a = 1000;
  const _0x4c7e6d = 5000;
  const _0x481c3d = _0x137da8 => "self-warmup:" + _0x137da8;
  let _0x17b1c7 = null;
  function _0x210c09(_0x4dcf1a = {}) {
    const _0x319023 = (_0x4dcf1a.accounts || []).map(_0x128a16 => _0x128a16?.id).filter(Boolean);
    if (_0x319023.length) {
      return _0x319023;
    }
    return (_0x4dcf1a.config?.selectedAccounts || []).filter(Boolean);
  }
  function _0x812251(_0x4dc924 = {}) {
    return createAccountActionLimitStore(_0x4dc924.config || {}, ACCOUNT_ACTION_LIMIT_SPECS, _0x210c09(_0x4dc924));
  }
  function _0x137ca2(_0x252b3f, _0x53c21a, _0x508b8b) {
    const _0x4530e6 = mapSelfWarmupActionToLimitKey(_0x53c21a);
    if (!_0x4530e6) {
      return true;
    }
    return getAccountActionLimitStatus(_0x332b9f.get(_0x252b3f)?.actionLimitState, _0x508b8b, _0x4530e6).allowed;
  }
  function _0x396cb8(_0x8d4744, _0x4e1487, _0x3b9395) {
    const _0x912b52 = mapSelfWarmupActionToLimitKey(_0x4e1487);
    if (!_0x912b52) {
      return "";
    }
    const _0x2a233f = getAccountActionLimitStatus(_0x332b9f.get(_0x8d4744)?.actionLimitState, _0x3b9395, _0x912b52);
    if (!_0x2a233f?.enabled || !!_0x2a233f.allowed) {
      return "";
    }
    const _0x4b039a = {
      like: "点赞",
      reply: "回复",
      follow: "关注",
      dm: "私信"
    };
    return "已达本账号本次" + (_0x4b039a[_0x912b52] || _0x2a233f.label || "动作") + "上限";
  }
  function _0x203a4c(_0x5e020a, _0x3666f2, _0x13632b) {
    const _0x3ffdcc = _0x332b9f.get(_0x5e020a);
    const _0x2b7843 = mapSelfWarmupActionToLimitKey(_0x13632b);
    if (!_0x3ffdcc?.actionLimitState || !_0x2b7843) {
      return;
    }
    const _0x501d55 = recordAccountActionLimitSuccess(_0x3ffdcc.actionLimitState, _0x3666f2, _0x2b7843);
    if (!_0x501d55.enabled || _0x501d55.allowed) {
      return;
    }
    const _0x4538a9 = _0x3666f2 + "|" + _0x2b7843;
    if (!_0x3ffdcc.actionLimitReachedLogged) {
      _0x3ffdcc.actionLimitReachedLogged = new Set();
    }
    if (_0x3ffdcc.actionLimitReachedLogged.has(_0x4538a9)) {
      return;
    }
    _0x3ffdcc.actionLimitReachedLogged.add(_0x4538a9);
    const _0x4de49c = {
      like: "点赞",
      reply: "回复",
      follow: "关注",
      dm: "私信"
    };
    _0x16891a(_0x5e020a, "账号已达本次" + (_0x4de49c[_0x2b7843] || _0x2b7843) + "上限（" + _0x501d55.limit + "）", "info");
  }
  function _0x3e438b(_0x5ec2af, _0x29dded) {
    if (!_0x5ec2af || _0x5ec2af.isDestroyed() || _0x5ec2af.webContents.isDestroyed()) {
      return;
    }
    try {
      _0x5ec2af.webContents.setBackgroundThrottling(false);
    } catch (_0x5c1cb9) {}
    try {
      _0x5ec2af.webContents.setFrameRate(_0x29dded ? _0x2597db : _0x5e7160);
    } catch (_0x3a333d) {}
    try {
      _0x5ec2af.webContents.setImageAnimationPolicy(_0x29dded ? "animate" : "noAnimation");
    } catch (_0x322d3d) {}
  }
  function _0x59110b() {
    for (const _0x1cca6a of _0x46d1ca.values()) {
      if (!_0x1cca6a || _0x1cca6a.isDestroyed()) {
        continue;
      }
      _0x3e438b(_0x1cca6a, true);
    }
  }
  function _0x15397a(_0x4ce0b2, _0x3de313) {
    if (!_0x4ce0b2 || !_0x3de313?.message) {
      return;
    }
    const _0x10147e = _0x183f60.get(_0x4ce0b2) || [];
    _0x10147e.push(_0x3de313);
    if (_0x10147e.length > _0x26fc15) {
      _0x10147e.splice(0, _0x10147e.length - _0x26fc15);
    }
    _0x183f60.set(_0x4ce0b2, _0x10147e);
  }
  function _0x14fcba(_0x3510d7) {
    if (!_0x3510d7) {
      return [];
    }
    return [...(_0x183f60.get(_0x3510d7) || [])];
  }
  function _0x647eb8() {
    const _0x10e9cf = {};
    for (const [_0x356854, _0x248b14] of _0x183f60.entries()) {
      _0x10e9cf[_0x356854] = [..._0x248b14];
    }
    return _0x10e9cf;
  }
  function _0x660cbc(_0x5085bd) {
    if (!_0x5085bd) {
      _0x183f60.clear();
      return true;
    }
    return _0x183f60.delete(_0x5085bd);
  }
  function _0x182ba5(_0x5079b5) {
    if (!_0x5079b5 || _0x5079b5.isDestroyed()) {
      return;
    }
    if (_0x5079b5.__radarAllowVisibleMonitor) {
      return;
    }
    _0x5079b5.__radarUseOffscreenKeepAlive = false;
    ensureHiddenWindowStaysHidden(_0x5079b5);
    _0x3e438b(_0x5079b5, false);
  }
  async function _0x207cc3(_0x51ee03, _0x1f2708) {
    if (!_0x51ee03 || _0x51ee03.isDestroyed()) {
      return _0x1f2708();
    }
    _0x3e438b(_0x51ee03, true);
    if (!_0x51ee03.__radarAllowVisibleMonitor) {
      ensureHiddenWindowStaysHidden(_0x51ee03);
    }
    try {
      return await _0x1f2708();
    } finally {
      if (!_0x51ee03.isDestroyed() && !_0x51ee03.__radarAllowVisibleMonitor) {
        _0x182ba5(_0x51ee03);
      }
    }
  }
  async function _0x207a54(_0x210087, _0x55791d, _0x35b755) {
    const _0x4e23da = String(_0x210087);
    const _0x4b9cbb = _0x4f3dd4.get(_0x4e23da) || Promise.resolve();
    let _0x137200;
    const _0x7303fe = new Promise(_0x1d9698 => {
      _0x137200 = _0x1d9698;
    });
    const _0xb276d5 = _0x4b9cbb.catch(() => {}).then(() => _0x7303fe);
    _0x4f3dd4.set(_0x4e23da, _0xb276d5);
    const _0x3bacc3 = Date.now();
    await _0x4b9cbb.catch(() => {});
    const _0x1f9751 = Date.now() - _0x3bacc3;
    if (_0x1f9751 >= 500) {
      _0x16891a(_0x55791d, "同账号自热任务排队 " + (_0x1f9751 / 1000).toFixed(1) + " 秒，现已按顺序执行", "info");
    }
    _0x3e438b(_0x46d1ca.get(_0x4e23da), true);
    try {
      if (!_0x332b9f.has(_0x55791d)) {
        return null;
      }
      return await _0x35b755();
    } finally {
      const _0x46eead = _0x46d1ca.get(_0x4e23da);
      if (_0x46eead && !_0x46eead.isDestroyed() && !_0x46eead.__radarAllowVisibleMonitor) {
        _0x182ba5(_0x46eead);
      } else {
        _0x3e438b(_0x46eead, !!_0x46eead && !_0x46eead.isDestroyed() && !!_0x46eead.isVisible());
      }
      _0x137200();
      if (_0x4f3dd4.get(_0x4e23da) === _0xb276d5) {
        _0x4f3dd4.delete(_0x4e23da);
      }
    }
  }
  function _0x318540(_0x4d7799, _0x274bc6) {
    const _0xebdb92 = _0x139d3d();
    if (_0xebdb92 && !_0xebdb92.isDestroyed() && !_0xebdb92.webContents.isDestroyed()) {
      try {
        _0xebdb92.webContents.send("self-warmup-task-event", {
          taskId: _0x4d7799,
          ..._0x274bc6
        });
      } catch (_0x46f654) {}
    }
  }
  function _0x16891a(_0x4b1fdc, _0x487a05, _0xe3efd2 = "info") {
    const _0x1dfad5 = Date.now();
    const _0x810cf = String(_0x487a05 || "").trim();
    if (!_0x810cf) {
      return;
    }
    _0x15397a(_0x4b1fdc, {
      message: _0x810cf,
      level: _0xe3efd2,
      ts: _0x1dfad5
    });
    _0x318540(_0x4b1fdc, {
      type: "log",
      message: _0x810cf,
      level: _0xe3efd2,
      ts: _0x1dfad5
    });
    console.log("[SelfWarmup][" + _0x4b1fdc + "] " + _0x810cf);
  }
  function _0x48c762(_0x535976 = {}) {
    const _0x9dc4e5 = [];
    if (_0x535976.msgPreview) {
      _0x9dc4e5.push("文案「" + compactText(_0x535976.msgPreview).slice(0, 48) + "」");
    }
    if (_0x535976.reason) {
      _0x9dc4e5.push("原因=" + compactText(_0x535976.reason).slice(0, 100));
    }
    if (_0x535976.viaStranger) {
      _0x9dc4e5.push("经陌生人消息进入");
    }
    if (_0x535976.forceFolder) {
      _0x9dc4e5.push("强制检查陌生人消息");
    }
    if (_0x535976.resultStatus) {
      _0x9dc4e5.push("结果=" + compactText(_0x535976.resultStatus));
    }
    if (_0x535976.inputCleared === true) {
      _0x9dc4e5.push("输入框已清空");
    } else if (_0x535976.inputCleared === false) {
      _0x9dc4e5.push("输入框仍有内容");
    }
    if (_0x535976.verified === true) {
      _0x9dc4e5.push("发送气泡已确认");
    }
    if (_0x535976.failureMarker) {
      _0x9dc4e5.push("检测到红色失败标记");
    }
    if (_0x535976.failureToast) {
      _0x9dc4e5.push("平台提示=" + compactText(_0x535976.failureToast).slice(0, 120));
    }
    if (_0x535976.blockType) {
      _0x9dc4e5.push("限制=" + compactText(_0x535976.blockType));
    }
    if (_0x535976.errorCode) {
      _0x9dc4e5.push("代码=" + compactText(_0x535976.errorCode));
    }
    if (_0x9dc4e5.length) {
      return "（" + _0x9dc4e5.join("；") + "）";
    } else {
      return "";
    }
  }
  selfWarmupDmLogSink = (_0x28ff41, _0x3fef00 = {}) => {
    const _0x447957 = _0x2dc815.get(_0x28ff41.sender?.id);
    if (!_0x447957 || !_0x332b9f.has(_0x447957.taskId)) {
      return;
    }
    const _0x2f3161 = compactText(_0x3fef00.extra?.nickname || "");
    const _0x516779 = _0x2f3161 ? " @" + _0x2f3161 : "";
    const _0x1fc7ef = compactText(_0x3fef00.message);
    const _0x4f9506 = _0x48c762(_0x3fef00.extra || {});
    const _0x1eab94 = /失败|受限|异常|未找到/.test(_0x1fc7ef) ? "warning" : /确认|成功/.test(_0x1fc7ef) ? "success" : "info";
    _0x16891a(_0x447957.taskId, "账号 " + _0x447957.accountName + " · 私信步骤" + _0x516779 + "：" + _0x1fc7ef + _0x4f9506, _0x1eab94);
  };
  function _0x32e6b1(_0x4b169d = {}) {
    if (_0x4b169d.ok || _0x4b169d.blocked || _0x4b169d.consumeRound || _0x4b169d.skipped) {
      return false;
    }
    const _0x562b33 = compactText(_0x4b169d.reason || "");
    if (/无.*文案|隐私设置|操作频繁|账号.*封禁|用户不存在|未登录|权限|已达.*上限|未确认|已点击发送|已触发回车/.test(_0x562b33)) {
      return false;
    }
    if (/未能打开对应视频页/.test(_0x562b33)) {
      return false;
    }
    return true;
  }
  function _0x534344(_0x5ad4c6 = {}) {
    if (_0x5ad4c6.ok || _0x5ad4c6.blocked || _0x5ad4c6.consumeRound || _0x5ad4c6.skipped) {
      return false;
    }
    const _0x4e21fc = compactText(_0x5ad4c6.reason || "");
    if (/无.*文案|隐私设置|操作频繁|账号.*封禁|用户不存在|未登录|权限|已达.*上限|已点击发送|已触发回车/.test(_0x4e21fc)) {
      return false;
    }
    return true;
  }
  function _0x2a7fc9(_0x3e22fe) {
    if (!_0x3e22fe) {
      return;
    }
    _0x3e22fe._selfWarmupCommentPageReady = false;
    _0x3e22fe._selfWarmupCommentSettled = false;
    _0x3e22fe._selfWarmupNavFailed = false;
    _0x3e22fe._selfWarmupUsedApiNav = false;
  }
  async function _0x3205e7(_0x2d9cf3, _0x452e7b, _0x478063) {
    const _0x5356fa = await _0x478063();
    if (!_0x32e6b1(_0x5356fa)) {
      return _0x5356fa;
    }
    const _0x138b7d = 9000 + Math.floor(Math.random() * 2001);
    _0x16891a(_0x2d9cf3, _0x452e7b + "首次失败：" + (_0x5356fa.reason || "未知原因") + "；等待约 " + (_0x138b7d / 1000).toFixed(1) + " 秒后重试一次", "warning");
    await delay(_0x138b7d);
    if (!_0x332b9f.has(_0x2d9cf3)) {
      return {
        ..._0x5356fa,
        retryCancelled: true,
        reason: (_0x5356fa.reason || "首次失败") + "；任务已停止，取消重试"
      };
    }
    const _0x2222e3 = await _0x478063();
    _0x16891a(_0x2d9cf3, _0x2222e3.ok || _0x2222e3.consumeRound ? _0x452e7b + "重试成功" : _0x452e7b + "重试仍失败：" + (_0x2222e3.reason || "未知原因"), _0x2222e3.ok || _0x2222e3.consumeRound ? "success" : "warning");
    return {
      ..._0x2222e3,
      retried: true,
      firstFailureReason: _0x5356fa.reason || ""
    };
  }
  async function _0x35f5d6(_0x112580, _0x1e6da0, _0x59e03f, _0x5c420f, _0x35a22f) {
    const _0x4e2284 = await _0x35a22f();
    if (_0x4e2284.ok || _0x4e2284.blocked || _0x4e2284.consumeRound || _0x4e2284.skipped) {
      return _0x4e2284;
    }
    if (!_0x534344(_0x4e2284) && !_0x32e6b1(_0x4e2284)) {
      return _0x4e2284;
    }
    const _0x36436 = 9000 + Math.floor(Math.random() * 2001);
    _0x16891a(_0x112580, _0x5c420f + "首次失败：" + (_0x4e2284.reason || "未知原因") + "；等待约 " + (_0x36436 / 1000).toFixed(1) + " 秒后重试一次", "warning");
    await delay(_0x36436);
    if (!_0x332b9f.has(_0x112580)) {
      return {
        ..._0x4e2284,
        retryCancelled: true,
        reason: (_0x4e2284.reason || "首次失败") + "；任务已停止，取消重试"
      };
    }
    const _0x1b4f5b = await _0x35a22f();
    if (_0x1b4f5b.ok || _0x1b4f5b.blocked || _0x1b4f5b.consumeRound || _0x1b4f5b.skipped) {
      _0x16891a(_0x112580, _0x5c420f + "重试成功", "success");
      return {
        ..._0x1b4f5b,
        retried: true,
        firstFailureReason: _0x4e2284.reason || ""
      };
    }
    if (!_0x534344(_0x1b4f5b) || !_0x1e6da0 || _0x1e6da0.isDestroyed()) {
      _0x16891a(_0x112580, _0x5c420f + "重试仍失败：" + (_0x1b4f5b.reason || "未知原因"), "warning");
      return {
        ..._0x1b4f5b,
        retried: true,
        firstFailureReason: _0x4e2284.reason || ""
      };
    }
    _0x16891a(_0x112580, _0x5c420f + "第二次仍失败：" + (_0x1b4f5b.reason || "未知原因") + "；刷新精选页后重新点通知卡片再试一次", "warning");
    _0x2a7fc9(_0x59e03f);
    await _0x12d98a(_0x1e6da0, "https://www.douyin.com/jingxuan");
    const _0x1cf47a = await _0x3aee2c(_0x1e6da0, "home", {
      timeoutMs: _0x4646db,
      stableSamples: 2,
      taskId: _0x112580
    });
    ensureHiddenWindowStaysHidden(_0x1e6da0);
    if (!isWarmupSurfaceComplete(_0x1cf47a)) {
      return {
        ..._0x1b4f5b,
        retried: true,
        refreshed: true,
        reason: (_0x1b4f5b.reason || "二次失败") + "；刷新后精选页未就绪（" + _0x15d169(_0x1cf47a) + "）"
      };
    }
    if (!_0x332b9f.has(_0x112580)) {
      return {
        ..._0x1b4f5b,
        retried: true,
        retryCancelled: true,
        reason: (_0x1b4f5b.reason || "二次失败") + "；任务已停止，取消刷新重试"
      };
    }
    const _0x1fccef = await _0x35a22f();
    _0x16891a(_0x112580, _0x1fccef.ok || _0x1fccef.consumeRound ? _0x5c420f + "刷新页面后重试成功" : _0x5c420f + "刷新页面后仍失败，记为失败：" + (_0x1fccef.reason || "未知原因"), _0x1fccef.ok || _0x1fccef.consumeRound ? "success" : "warning");
    return {
      ..._0x1fccef,
      retried: true,
      refreshed: true,
      firstFailureReason: _0x4e2284.reason || ""
    };
  }
  function _0x36c447() {
    let _0x58146c = path.join(__dirname, "..", "automation-preload.js");
    if (_0x505093.isPackaged) {
      const _0x32e690 = _0x3c83bb.get("latest_resource_path");
      if (_0x32e690 && _0x8722c8.existsSync(path.join(_0x32e690, "automation-preload.js"))) {
        _0x58146c = path.join(_0x32e690, "automation-preload.js");
      }
    }
    return _0x58146c;
  }
  async function _0x41a742(_0x4a82bf, _0xf3c982) {
    const _0x2f5415 = "douyin_" + _0x4a82bf;
    const _0x1e82e1 = _0x139d3d();
    const _0x47189c = _0x1e82e1 && !_0x1e82e1.isDestroyed() ? _0x1e82e1 : null;
    const _0x1739ee = new BrowserWindow({
      parent: _0x47189c || undefined,
      width: 1280,
      height: 800,
      show: false,
      x: -4000,
      y: -4000,
      opacity: 0,
      skipTaskbar: true,
      focusable: false,
      minimizable: false,
      maximizable: false,
      webPreferences: {
        partition: "persist:automation:" + _0x2f5415,
        backgroundThrottling: false,
        contextIsolation: true,
        sandbox: false,
        preload: _0x36c447(),
        spellcheck: false
      },
      autoHideMenuBar: true
    });
    _0x1739ee.__radarUseOffscreenKeepAlive = false;
    applyHiddenAutomationWindowPolicy(_0x1739ee, {
      parent: _0x47189c
    });
    _0x464e64(_0x1739ee);
    _0x3ab795(_0x1739ee.webContents, "self-warmup:" + _0x2f5415);
    _0x1739ee.webContents.setWindowOpenHandler(() => ({
      action: "deny"
    }));
    _0x1739ee.on("close", _0x1b7f9c => {
      if (!_0x505093.isQuitting && _0x1739ee.__radarAllowVisibleMonitor) {
        _0x1b7f9c.preventDefault();
        hideVisibleAutomationWindow(_0x1739ee);
        _0x182ba5(_0x1739ee);
      }
    });
    _0x3b8fcf(_0x1739ee.webContents.session, _0x2f5415);
    await _0x54a3ac(_0x1739ee.webContents.session, _0xf3c982, _0x2f5415);
    _0x1739ee.webContents.setAudioMuted(_0x3c83bb.get("system_video_muted", true));
    ensureHiddenWindowStaysHidden(_0x1739ee);
    _0x1739ee.webContents.on("dom-ready", () => {
      runtimeConfig?.ensureAndPushToWebContents?.(_0x1739ee.webContents);
    });
    _0x46d1ca.set(_0x4a82bf, _0x1739ee);
    return _0x1739ee;
  }
  async function _0x4def12(_0x3de49e) {
    const _0xe677a9 = String(_0x3de49e.id);
    const _0x2a74b6 = _0x46d1ca.get(_0xe677a9);
    if (_0x2a74b6 && !_0x2a74b6.isDestroyed()) {
      return _0x2a74b6;
    }
    return _0x41a742(_0xe677a9, _0x3de49e.proxy);
  }
  function _0x7f0fbf() {
    for (const _0xfcbec0 of _0x46d1ca.values()) {
      if (_0xfcbec0 && !_0xfcbec0.isDestroyed()) {
        _0xfcbec0.destroy();
      }
    }
    _0x46d1ca.clear();
  }
  async function _0x12d98a(_0x344a0e, _0x1a12ba) {
    if (!_0x344a0e || _0x344a0e.isDestroyed()) {
      throw new Error("自热互动窗口已销毁");
    }
    _0x3e438b(_0x344a0e, true);
    let _0x3733c1 = null;
    try {
      await Promise.race([_0x344a0e.loadURL(_0x1a12ba), new Promise((_0x3377f5, _0x14ebfd) => {
        _0x3733c1 = setTimeout(() => {
          const _0x3a8e08 = new Error("页面加载超过 " + Math.round(_0x44b85d / 1000) + " 秒");
          _0x3a8e08.code = "self_warmup_navigation_timeout";
          _0x14ebfd(_0x3a8e08);
        }, _0x44b85d);
      })]);
    } catch (_0xf28b6b) {
      if (_0xf28b6b?.code === "self_warmup_navigation_timeout") {
        try {
          _0x344a0e.webContents.stop();
        } catch (_0x4f95f6) {}
        throw _0xf28b6b;
      }
      if (_0xf28b6b.message && (_0xf28b6b.message.includes("ERR_ABORTED") || _0xf28b6b.message.includes("ERR_FAILED"))) {
        console.log("[selfWarmup] loadURL aborted/failed for " + _0x1a12ba + " (expected/ignored)");
      } else {
        throw _0xf28b6b;
      }
    } finally {
      if (_0x3733c1) {
        clearTimeout(_0x3733c1);
      }
    }
    await _0x18dbf4(_0x344a0e.webContents);
    return true;
  }
  function _0x15d169(_0x596560 = {}) {
    const _0xe4de0e = [_0x596560.status || "unknown"];
    if (_0x596560.observedStatus && _0x596560.observedStatus !== _0x596560.status) {
      _0xe4de0e.push("最后状态=" + _0x596560.observedStatus);
    }
    if (Number.isFinite(Number(_0x596560.elapsedMs))) {
      _0xe4de0e.push((Number(_0x596560.elapsedMs) / 1000).toFixed(1) + "s");
    }
    if (Number.isFinite(Number(_0x596560.rootCount))) {
      _0xe4de0e.push("容器 " + Number(_0x596560.rootCount));
    }
    if (Number.isFinite(Number(_0x596560.rowCount))) {
      _0xe4de0e.push("数据行 " + Number(_0x596560.rowCount));
    }
    if (_0x596560.loading) {
      _0xe4de0e.push("仍在加载");
    }
    if (_0x596560.readyState) {
      _0xe4de0e.push("readyState=" + _0x596560.readyState);
    }
    if (_0x596560.clickAttempt) {
      _0xe4de0e.push("点击 " + _0x596560.clickAttempt + " 次");
    }
    if (_0x596560.reloaded) {
      _0xe4de0e.push("已刷新恢复");
    }
    if (_0x596560.error) {
      _0xe4de0e.push("错误=" + compactText(_0x596560.error).slice(0, 80));
    }
    return _0xe4de0e.join("，");
  }
  async function _0x677389(_0xca020f, _0x1315b4) {
    if (!_0xca020f || _0xca020f.isDestroyed() || _0xca020f.webContents.isDestroyed()) {
      return {
        kind: _0x1315b4,
        status: "destroyed",
        url: "",
        rootCount: 0,
        rowCount: 0
      };
    }
    return _0xca020f.webContents.executeJavaScript("(() => {\n      const kind = " + JSON.stringify(_0x1315b4) + ";\n      const compact = (value) => String(value || '')\n        .replace(/[\\u200b-\\u200f\\u202a-\\u202e\\u2060-\\u206f]/g, '')\n        .replace(/\\s+/g, ' ')\n        .trim();\n      const visible = (el, minWidth = 1, minHeight = 1) => {\n        if (!el || !el.getBoundingClientRect) return false;\n        const r = el.getBoundingClientRect();\n        const s = getComputedStyle(el);\n        return r.width >= minWidth && r.height >= minHeight\n          && s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';\n      };\n      const readyState = document.readyState || '';\n      const url = window.location.href || '';\n      const base = {\n        kind,\n        status: 'waiting',\n        url,\n        readyState,\n        rootCount: 0,\n        rowCount: 0,\n        loading: false,\n        emptyMatched: false,\n      };\n      const loginNodes = Array.from(document.querySelectorAll(\n        '[data-e2e=\"header-login-container\"], button, a, [role=\"button\"]'\n      )).filter((el) => visible(el));\n      const loginRequired = loginNodes.some((el) => {\n        const text = compact(el.innerText || el.textContent);\n        return /^(登录|注册登录|登录\\/注册|立即登录)$/.test(text)\n          || /扫码登录|验证码登录|密码登录|登录后即可/.test(text);\n      });\n      if (loginRequired) return { ...base, status: 'login-required' };\n\n      if (kind === 'home') {\n        const entries = Array.from(document.querySelectorAll(\n          '[data-e2e=\"notification-entry\"], [data-e2e=\"im-entry\"], [data-e2e=\"something-button\"]'\n        )).filter((el) => visible(el));\n        return {\n          ...base,\n          status: entries.length > 0 && /interactive|complete/.test(readyState) ? 'ready' : 'waiting',\n          rootCount: entries.length,\n        };\n      }\n\n      const loadingSelector = [\n        '[aria-busy=\"true\"]', '.semi-spin', '.semi-spin-wrapper',\n        '[class*=\"Loading\"]', '[class*=\"loading\"]', '[class*=\"Skeleton\"]', '[class*=\"skeleton\"]'\n      ].join(',');\n      const hasLoading = (root) => {\n        try {\n          return Array.from(root.querySelectorAll(loadingSelector)).some((el) => visible(el));\n        } catch (_) { return false; }\n      };\n\n      if (kind === 'chat' || kind === 'message') {\n        if (kind === 'chat' && !/^https:\\/\\/(?:www\\.)?douyin\\.com\\/chat(?:[/?#]|$)/i.test(url)) {\n          return { ...base, status: 'wrong-page' };\n        }\n        const rootSelector = '#imSaasContainerId, [data-e2e=\"im-dialog\"]';\n        let roots = Array.from(document.querySelectorAll(rootSelector))\n          .filter((el) => visible(el, 120, 60));\n        if (kind === 'message') {\n          const popovers = Array.from(document.querySelectorAll(\n            '.semi-popover-content, [class*=\"Popover\"], [class*=\"popover\"], [role=\"dialog\"]'\n          )).filter((el) => {\n            if (!visible(el, 120, 60)) return false;\n            const text = compact(el.innerText || el.textContent);\n            return /私信|陌生人消息|聊天|会话/.test(text)\n              && !/赞了你|评论了你的|回复了你|关注了你/.test(text);\n          });\n          roots = Array.from(new Set([...roots, ...popovers]));\n        }\n        const rowSelector = [\n          '[data-e2e=\"conversation-item\"]', '.conversationStrangerBoxwrapper',\n          '[class*=\"Conversation\"]', '[class*=\"conversation\"]',\n          '[class*=\"Stranger\"]', '[class*=\"stranger\"]', '[role=\"listitem\"]'\n        ].join(',');\n        const rows = new Set();\n        roots.forEach((root) => {\n          root.querySelectorAll(rowSelector).forEach((row) => {\n            if (!visible(row, 120, 24)) return;\n            const r = row.getBoundingClientRect();\n            const text = compact(row.innerText || row.textContent);\n            if (r.height > 220 || !text || /^(私信|消息)$/.test(text)) return;\n            rows.add(row);\n          });\n        });\n        // 部分 /chat 版本的会话列表与 im 根节点并列挂载。\n        if (!rows.size) {\n          document.querySelectorAll(rowSelector).forEach((row) => {\n            if (!visible(row, 120, 24)) return;\n            const r = row.getBoundingClientRect();\n            const text = compact(row.innerText || row.textContent);\n            if (r.height <= 220 && text && !/^(私信|消息)$/.test(text)) rows.add(row);\n          });\n        }\n        const text = compact(roots.map((root) => root.innerText || root.textContent).join(' '));\n        const emptyMatched = /暂无(?:会话|聊天|私信|消息)|还没有(?:会话|聊天|私信|消息)|暂时没有(?:会话|聊天|私信|消息)/.test(text);\n        const loading = roots.some(hasLoading);\n        let status = 'waiting';\n        if (/interactive|complete/.test(readyState) && roots.length && !loading && rows.size > 0) status = 'ready';\n        else if (/interactive|complete/.test(readyState) && roots.length && !loading && emptyMatched) status = 'empty';\n        else if (loading) status = 'loading';\n        return { ...base, status, rootCount: roots.length, rowCount: rows.size, loading, emptyMatched };\n      }\n\n      const EVENT_RE = /(评论了你的(?:作品|视频|评论|动态)?|回复了你|回复了你的评论|关注了你|开始关注你|赞了你的(?:作品|视频|评论|动态)?|点赞|喜欢了你的|提到了你|@了你)/;\n      const panelSelector = [\n        '[data-e2e=\"listDlgTest-container\"]', '[data-e2e*=\"notice\"]',\n        '[data-e2e*=\"notification\"]', '.semi-popover-content',\n        '[class*=\"Popover\"]', '[class*=\"popover\"]',\n        '[class*=\"Notice\"]', '[class*=\"notice\"]', '[role=\"dialog\"]'\n      ].join(',');\n      const panels = Array.from(document.querySelectorAll(panelSelector))\n        .filter((el) => visible(el, 180, 60))\n        .filter((el) => !(\n          el.matches('#imSaasContainerId, [data-e2e=\"im-dialog\"]')\n          || el.closest('#imSaasContainerId, [data-e2e=\"im-dialog\"]')\n          || el.querySelector('#imSaasContainerId, [data-e2e=\"im-dialog\"]')\n        ))\n        .filter((el) => {\n          const text = compact(el.innerText || el.textContent);\n          return EVENT_RE.test(text) || /通知|互动|评论|回复|赞了你|点赞|关注|全部消息/.test(text);\n        });\n      const rowSelector = [\n        '.JkTB0jW1', '[role=\"listitem\"]', 'li', '[data-e2e=\"user-name-card\"]',\n        '[data-e2e*=\"notice\"]', '[data-e2e*=\"notification\"]', 'a[href*=\"/user/\"]', 'pre'\n      ].join(',');\n      const rows = new Set();\n      panels.forEach((panel) => {\n        const addRowFromNode = (node) => {\n          // 新版通知面板里的用户名/头像链接本身通常只有 20px 左右高，\n          // 不能在向上寻找完整通知卡片之前用“行尺寸”把锚点过滤掉。\n          if (node === panel || !visible(node)) return;\n          let row = node;\n          while (row && row !== panel) {\n            const r = row.getBoundingClientRect();\n            const text = compact(row.innerText || row.textContent);\n            if (r.width >= 160 && r.height >= 28 && r.height < 360 && EVENT_RE.test(text)) {\n              rows.add(row);\n              break;\n            }\n            row = row.parentElement;\n          }\n        };\n        panel.querySelectorAll(rowSelector).forEach(addRowFromNode);\n        // 抖音通知卡片类名会混淆且频繁变化；没有语义锚点时，从事件文案叶子反查卡片。\n        if (!rows.size) {\n          panel.querySelectorAll('div, span').forEach((node) => {\n            if (node.children.length === 0 && EVENT_RE.test(compact(node.innerText || node.textContent))) {\n              addRowFromNode(node);\n            }\n          });\n        }\n      });\n      const panelText = compact(panels.map((panel) => panel.innerText || panel.textContent).join(' '));\n      const emptyMatched = /暂无(?:通知|互动|消息|更多)|还没有(?:通知|互动|消息)|暂时没有(?:通知|互动|消息)|没有更多/.test(panelText);\n      const loading = panels.some(hasLoading);\n      let status = 'waiting';\n      if (/interactive|complete/.test(readyState) && panels.length && !loading && rows.size > 0) status = 'ready';\n      else if (/interactive|complete/.test(readyState) && panels.length && !loading && emptyMatched) status = 'empty';\n      else if (loading) status = 'loading';\n      return { ...base, status, rootCount: panels.length, rowCount: rows.size, loading, emptyMatched };\n    })()", true).catch(_0x219b35 => ({
      kind: _0x1315b4,
      status: "probe-error",
      url: String(_0xca020f.webContents.getURL?.() || ""),
      rootCount: 0,
      rowCount: 0,
      error: _0x219b35?.message || String(_0x219b35)
    }));
  }
  async function _0x3aee2c(_0xedc567, _0x18aaf1, _0x63603e = {}) {
    const _0x2ad3f3 = Math.max(1000, Number(_0x63603e.timeoutMs) || _0x3a75de);
    const _0x326a1a = Math.max(1, Number(_0x63603e.stableSamples) || (_0x18aaf1 === "home" ? 2 : 3));
    const _0x37e8bb = _0x63603e.taskId || "";
    const _0x19b355 = Date.now();
    let _0x4b4c56 = {
      kind: _0x18aaf1,
      status: "waiting",
      rootCount: 0,
      rowCount: 0
    };
    let _0x160871 = "";
    let _0xb1c768 = 0;
    while (Date.now() - _0x19b355 < _0x2ad3f3) {
      if (_0x37e8bb && !_0x332b9f.has(_0x37e8bb)) {
        return {
          ..._0x4b4c56,
          status: "cancelled",
          elapsedMs: Date.now() - _0x19b355
        };
      }
      _0x4b4c56 = await _0x677389(_0xedc567, _0x18aaf1);
      if (_0x4b4c56.status === "destroyed" || _0x4b4c56.status === "login-required") {
        return {
          ..._0x4b4c56,
          elapsedMs: Date.now() - _0x19b355
        };
      }
      if (isWarmupSurfaceComplete(_0x4b4c56)) {
        const _0x5b7392 = _0x4b4c56.status + "|" + _0x4b4c56.rootCount + "|" + _0x4b4c56.rowCount;
        _0xb1c768 = _0x5b7392 === _0x160871 ? _0xb1c768 + 1 : 1;
        _0x160871 = _0x5b7392;
        if (_0xb1c768 >= _0x326a1a) {
          return {
            ..._0x4b4c56,
            elapsedMs: Date.now() - _0x19b355,
            stableSamples: _0xb1c768
          };
        }
      } else {
        _0xb1c768 = 0;
        _0x160871 = "";
      }
      await delay(_0x6d588c);
    }
    return {
      ..._0x4b4c56,
      observedStatus: _0x4b4c56.status,
      status: "timeout",
      elapsedMs: Date.now() - _0x19b355,
      stableSamples: _0xb1c768
    };
  }
  async function _0xe4a1d5(_0x272320) {
    const _0x4d5d93 = String(_0x272320.id);
    const _0x34ca3d = _0x46d1ca.get(_0x4d5d93);
    if (_0x34ca3d && !_0x34ca3d.isDestroyed()) {
      try {
        _0x34ca3d.destroy();
      } catch (_0x2203dd) {}
    }
    _0x46d1ca.delete(_0x4d5d93);
    const _0x1435e8 = await _0x4def12(_0x272320);
    _0x3e438b(_0x1435e8, false);
    return _0x1435e8;
  }
  async function _0x5dc0a0(_0x148b61, _0x1be7d4 = "") {
    const _0x5b0394 = _0x148b61.webContents.getURL();
    let _0x21b475 = false;
    try {
      const _0x21528c = new URL(_0x5b0394);
      _0x21b475 = /(^|\.)douyin\.com$/i.test(_0x21528c.hostname) && (_0x21528c.pathname === "/" || _0x21528c.pathname === "/jingxuan") && !_0x21528c.searchParams.get("modal_id");
    } catch (_0x409686) {}
    const _0x9c231 = _0x21b475 && (await _0x148b61.webContents.executeJavaScript("(() => {\n      const visible = (el) => {\n        if (!el) return false;\n        const r = el.getBoundingClientRect();\n        const style = getComputedStyle(el);\n        return r.width > 120 && r.height > 60\n          && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';\n      };\n      return Array.from(document.querySelectorAll(\n        '#imSaasContainerId, [data-e2e=\"im-dialog\"], [data-e2e=\"listDlgTest-container\"], .semi-popover-content, [role=\"dialog\"]'\n      )).some(visible);\n    })()").catch(() => false));
    if (!_0x21b475 || _0x9c231) {
      await _0x12d98a(_0x148b61, "https://www.douyin.com/jingxuan");
    }
    ensureHiddenWindowStaysHidden(_0x148b61);
    return _0x3aee2c(_0x148b61, "home", {
      timeoutMs: _0x4646db,
      stableSamples: 2,
      taskId: _0x1be7d4
    });
  }
  async function _0x5438e3(_0x1042e1, _0x24ccb5 = {}) {
    if (!_0x1042e1 || _0x1042e1.isDestroyed()) {
      throw new Error("自动回复窗口已销毁");
    }
    const _0x59725a = _0x24ccb5.taskId || "";
    let _0x3a1c68 = String(_0x1042e1.webContents.getURL() || "");
    let _0xac31bd = await _0x677389(_0x1042e1, "chat");
    if (isWarmupSurfaceComplete(_0xac31bd) || _0xac31bd.status === "login-required") {
      ensureHiddenWindowStaysHidden(_0x1042e1);
      return _0xac31bd;
    }
    if (isDouyinChatPageUrl(_0x3a1c68)) {
      if (_0x59725a) {
        _0x16891a(_0x59725a, "Chat 页面已打开，正在等待会话列表稳定…", "info");
      }
      _0xac31bd = await _0x3aee2c(_0x1042e1, "chat", {
        timeoutMs: Math.min(12000, _0x175e26),
        taskId: _0x59725a
      });
      if (isWarmupSurfaceComplete(_0xac31bd) || _0xac31bd.status === "login-required" || _0xac31bd.status === "cancelled") {
        ensureHiddenWindowStaysHidden(_0x1042e1);
        return _0xac31bd;
      }
    }
    _0x3a1c68 = String(_0x1042e1.webContents.getURL() || "");
    if (!isDouyinChatPageUrl(_0x3a1c68) || _0xac31bd.status === "timeout" || _0xac31bd.status === "wrong-page") {
      if (_0x59725a) {
        _0x16891a(_0x59725a, "正在进入 Chat 页面并加载会话列表…", "info");
      }
      await _0x12d98a(_0x1042e1, "https://www.douyin.com/chat");
    }
    ensureHiddenWindowStaysHidden(_0x1042e1);
    return _0x3aee2c(_0x1042e1, "chat", {
      timeoutMs: _0x175e26,
      taskId: _0x59725a
    });
  }
  async function _0x71ecd4(_0x28d16c, _0x2804e3 = {}) {
    if (!_0x28d16c || _0x28d16c.isDestroyed()) {
      return {
        ok: false,
        reason: "窗口已销毁"
      };
    }
    const _0x388ef8 = String(_0x28d16c.webContents.getURL() || "");
    const _0x578478 = shouldWarmupIdleOnChat(_0x2804e3);
    let _0x20e497 = false;
    if (_0x578478) {
      if (!isDouyinChatPageUrl(_0x388ef8)) {
        _0x20e497 = true;
        await _0x5438e3(_0x28d16c).catch(() => null);
      }
    } else if (isDouyinChatPageUrl(_0x388ef8) || isWarmupHeavyPageUrl(_0x388ef8) && !isWarmupIdleJingxuanUrl(_0x388ef8)) {
      await _0x12d98a(_0x28d16c, "https://www.douyin.com/jingxuan");
      await _0x3aee2c(_0x28d16c, "home", {
        timeoutMs: _0x4646db,
        stableSamples: 2
      });
      _0x20e497 = true;
    }
    try {
      _0x28d16c.webContents.clearHistory();
    } catch (_0x12aa6a) {}
    _0x3e438b(_0x28d16c, false);
    return {
      ok: true,
      recycled: _0x20e497
    };
  }
  async function _0x47e0f7(_0x5bb4e2, _0x8f30b4 = {}) {
    const _0x184c55 = await _0x5bb4e2.webContents.executeJavaScript("(() => {\n      const compact = (value) => String(value || '')\n        .replace(/[\\u200b-\\u200f\\u202a-\\u202e\\u2060-\\u206f]/g, '')\n        .replace(/\\s+/g, ' ')\n        .trim();\n      const visible = (el) => {\n        if (!el) return false;\n        const r = el.getBoundingClientRect();\n        const s = getComputedStyle(el);\n        return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';\n      };\n      const readUserInfo = () => {\n        for (const key of ['user_info', 'index_user_info']) {\n          try {\n            const raw = localStorage.getItem(key);\n            if (!raw) continue;\n            const data = JSON.parse(raw);\n            const nickname = compact(data.nickname);\n            const douyinId = compact(data.short_id || data.display_id || data.unique_id);\n            if (nickname || douyinId) return { nickname, douyinId };\n          } catch (_) {}\n        }\n        return {};\n      };\n      const storageUser = readUserInfo();\n      const selfLink = Array.from(document.querySelectorAll('a[href*=\"/user/self\"]')).find(visible);\n      const avatar = document.querySelector('[data-e2e=\"header-user-avatar\"], [data-e2e=\"user-avatar\"]');\n      const loggedInHeaderEntry = Array.from(document.querySelectorAll('[data-e2e=\"notification-entry\"], [data-e2e=\"im-entry\"]')).find(visible);\n      const headerLogin = document.querySelector('[data-e2e=\"header-login-container\"]');\n      const loginTexts = Array.from(document.querySelectorAll('[data-e2e=\"header-login-container\"], button, a, [role=\"button\"]'))\n        .filter(visible)\n        .map((el) => compact(el.innerText || el.textContent))\n        .filter(Boolean);\n      const strongLoginGate = loginTexts.some((text) =>\n        /^(登录|注册登录|登录\\/注册|立即登录)$/.test(text)\n        || /扫码登录|验证码登录|密码登录|登录后即可/.test(text)\n      ) || (visible(headerLogin) && /登录/.test(compact(headerLogin.innerText || headerLogin.textContent)));\n      const cookieText = document.cookie || '';\n      const cookieLogged = /(?:^|;\\s*)(sessionid|sid_tt|uid_tt|passport_auth_status|LOGIN_STATUS)=/.test(cookieText);\n      const bodyText = compact(document.body?.innerText || '').slice(0, 800);\n      const hasLoggedInMarker = !!(\n        storageUser.nickname\n        || storageUser.douyinId\n        || selfLink\n        || (avatar && visible(avatar))\n        || loggedInHeaderEntry\n      );\n      const loggedIn = hasLoggedInMarker || (cookieLogged && !strongLoginGate);\n      return {\n        loggedIn,\n        strongLoginGate,\n        hasLoggedInMarker,\n        cookieLogged,\n        nickname: storageUser.nickname || '',\n        douyinId: storageUser.douyinId || '',\n        url: window.location.href,\n        loginTexts: loginTexts.slice(0, 5),\n        bodyHasLoginGate: /扫码登录|验证码登录|密码登录|登录后即可/.test(bodyText),\n      };\n    })()").catch(_0x3907bf => ({
      loggedIn: false,
      strongLoginGate: false,
      error: _0x3907bf?.message || String(_0x3907bf)
    }));
    const _0x4af768 = String(_0x8f30b4.status || "").toLowerCase();
    const _0x4a9f42 = _0x4af768 === "online" || _0x4af768 === "logged_in";
    if (_0x184c55.loggedIn) {
      return {
        ..._0x184c55,
        reason: _0x184c55.nickname ? "识别到账号 " + _0x184c55.nickname : "页面存在登录态标记"
      };
    }
    if (_0x4a9f42 && !_0x184c55.strongLoginGate) {
      return {
        ..._0x184c55,
        loggedIn: true,
        assumedFromAccountPool: true,
        reason: "账号池状态为已登录，且当前页面未出现强登录拦截"
      };
    }
    return {
      ..._0x184c55,
      loggedIn: false,
      reason: _0x184c55.strongLoginGate ? "页面出现登录入口" : _0x184c55.error || "未识别到登录态"
    };
  }
  async function _0x1d94bd(_0x400021, _0x3b2fcf, _0x2c1fa5 = []) {
    const _0x5a56f7 = await _0x400021.webContents.executeJavaScript("(() => {\n      const selectors = " + JSON.stringify(_0x2c1fa5) + ";\n      const targetLabel = " + JSON.stringify(_0x3b2fcf) + ";\n      const compact = (value) => String(value || '')\n        .replace(/[\\u200b-\\u200f\\u202a-\\u202e\\u2060-\\u206f]/g, '')\n        .replace(/\\s+/g, ' ')\n        .trim();\n      const visible = (el) => {\n        if (!el) return false;\n        const r = el.getBoundingClientRect();\n        const s = getComputedStyle(el);\n        return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';\n      };\n      const depth = (el) => {\n        let d = 0;\n        let node = el;\n        while (node && node !== document.body) { d += 1; node = node.parentElement; }\n        return d;\n      };\n      const matchedLabels = [targetLabel];\n      if (targetLabel === '私信') {\n        matchedLabels.push('消息');\n      }\n      const candidates = [];\n      const pushCandidate = (el, reason) => {\n        if (!visible(el)) return;\n        const text = compact(el.innerText || el.textContent);\n        const dataE2e = el.getAttribute('data-e2e') || '';\n        const exact = matchedLabels.some((l) => text === l);\n        const contains = matchedLabels.some((l) => text.includes(l));\n        const isExpectedIm = targetLabel === '私信' && (dataE2e === 'im-entry' || dataE2e === 'something-button');\n        const isExpectedNotif = targetLabel === '通知' && (dataE2e === 'notification-entry' || dataE2e === 'something-button');\n        if (!exact && !contains && !isExpectedIm && !isExpectedNotif) return;\n        const r = el.getBoundingClientRect();\n        const area = r.width * r.height;\n        let score = 0;\n        if (exact) score -= 60;\n        if (contains) score -= 30;\n        if (dataE2e === 'notification-entry' || dataE2e === 'im-entry') score -= 40;\n        if (dataE2e === 'something-button') score -= 25;\n        if (reason === 'selector') score -= 10;\n        if (/更多/.test(text) && targetLabel !== '更多') score += 200;\n        score += Math.min(area / 200, 80);\n        score -= Math.min(depth(el), 30) / 2;\n        candidates.push({ el, score, area, depth: depth(el), text, dataE2e });\n      };\n      selectors.forEach((sel) => {\n        try { document.querySelectorAll(sel).forEach((el) => pushCandidate(el, 'selector')); } catch (_) {}\n      });\n      const header = document.querySelector('#douyin-header-menuCt')\n        || document.querySelector('header')\n        || document.body;\n      header.querySelectorAll(\n        '[data-e2e=\"notification-entry\"], [data-e2e=\"im-entry\"], [data-e2e=\"something-button\"], li, button, a, [role=\"button\"], div'\n      ).forEach((el) => pushCandidate(el, 'header'));\n      if (candidates.length === 0) {\n        document.querySelectorAll('#douyin-header-menuCt li, #douyin-header-menuCt div, .Ng3vbSwy, .mRpT0Jfh')\n          .forEach((el) => pushCandidate(el, 'fallback'));\n      }\n      if (!candidates.length) return null;\n      candidates.sort((a, b) => a.score - b.score || a.area - b.area || b.depth - a.depth);\n      const best = candidates[0].el;\n      if (!visible(best)) return null;\n      const r = best.getBoundingClientRect();\n      try {\n        const eventInit = { bubbles: true, cancelable: true, view: window, clientX: Math.round(r.left + r.width / 2), clientY: Math.round(r.top + r.height / 2) };\n        ['pointerover', 'mouseover', 'pointerenter', 'mouseenter', 'mousemove'].forEach((type) => {\n          best.dispatchEvent(new MouseEvent(type, eventInit));\n        });\n      } catch (_) {}\n      return {\n        x: Math.round(r.left + r.width / 2),\n        y: Math.round(r.top + r.height / 2),\n        text: candidates[0].text,\n      };\n    })()").catch(() => null);
    if (!_0x5a56f7) {
      return false;
    }
    const _0x209e1d = Math.max(4, _0x5a56f7.x - 80);
    const _0x5a469a = Math.max(4, _0x5a56f7.y + 80);
    for (const _0x52361f of [{
      x: _0x209e1d,
      y: _0x5a469a
    }, {
      x: Math.max(4, _0x5a56f7.x - 24),
      y: _0x5a56f7.y
    }, {
      x: Math.max(4, _0x5a56f7.x - 8),
      y: _0x5a56f7.y
    }, {
      x: _0x5a56f7.x,
      y: _0x5a56f7.y
    }]) {
      _0x400021.webContents.sendInputEvent({
        type: "mouseMove",
        x: _0x52361f.x,
        y: _0x52361f.y
      });
      await delay(120);
    }
    await delay(400);
    _0x400021.webContents.sendInputEvent({
      type: "mouseDown",
      x: _0x5a56f7.x,
      y: _0x5a56f7.y,
      button: "left",
      clickCount: 1
    });
    await delay(80);
    _0x400021.webContents.sendInputEvent({
      type: "mouseUp",
      x: _0x5a56f7.x,
      y: _0x5a56f7.y,
      button: "left",
      clickCount: 1
    });
    await delay(800);
    return true;
  }
  async function _0x28f9b1(_0x1ec80e, _0x1d4e11, _0x47b523 = {}) {
    return _0x3aee2c(_0x1ec80e, _0x1d4e11, {
      timeoutMs: _0x47b523.timeoutMs || _0x3a75de,
      taskId: _0x47b523.taskId || "",
      stableSamples: _0x47b523.stableSamples || 3
    });
  }
  async function _0x1adc84(_0x3eb040, _0x39a0ef, _0x2b366b = {}) {
    const _0x4afe92 = _0x2b366b.taskId || "";
    const _0x35ff5e = _0x39a0ef === "message" ? "私信" : "通知";
    const _0xa545e0 = _0x39a0ef === "message" ? ["[data-e2e=\"im-entry\"]"] : ["[data-e2e=\"notification-entry\"]", "[data-e2e=\"something-button\"]"];
    let _0x42ee0d = await _0x677389(_0x3eb040, _0x39a0ef);
    if (isWarmupSurfaceComplete(_0x42ee0d)) {
      return _0x28f9b1(_0x3eb040, _0x39a0ef, {
        timeoutMs: _0x3a75de,
        taskId: _0x4afe92
      });
    }
    if (_0x42ee0d.status === "login-required") {
      return _0x42ee0d;
    }
    for (let _0x295b34 = 1; _0x295b34 <= 2; _0x295b34 += 1) {
      if (_0x4afe92 && !_0x332b9f.has(_0x4afe92)) {
        return {
          ..._0x42ee0d,
          status: "cancelled"
        };
      }
      if (_0x4afe92) {
        _0x16891a(_0x4afe92, "正在点击" + _0x35ff5e + "入口并等待列表稳定（第 " + _0x295b34 + "/2 次）…", "info");
      }
      const _0x88175d = await _0x1d94bd(_0x3eb040, _0x35ff5e, _0xa545e0);
      if (_0x88175d) {
        _0x42ee0d = await _0x28f9b1(_0x3eb040, _0x39a0ef, {
          timeoutMs: _0x3a75de,
          taskId: _0x4afe92
        });
        _0x42ee0d = {
          ..._0x42ee0d,
          clickAttempt: _0x295b34
        };
        if (isWarmupSurfaceComplete(_0x42ee0d) || _0x42ee0d.status === "login-required" || _0x42ee0d.status === "cancelled") {
          return _0x42ee0d;
        }
        if (_0x4afe92) {
          _0x16891a(_0x4afe92, _0x35ff5e + "入口已点击，但列表尚未稳定（" + _0x15d169(_0x42ee0d) + "），准备重试", "warning");
        }
      } else {
        _0x42ee0d = {
          kind: _0x39a0ef,
          status: "entry-not-found",
          url: String(_0x3eb040.webContents?.getURL?.() || ""),
          rootCount: 0,
          rowCount: 0,
          clickAttempt: _0x295b34
        };
        await delay(1000);
      }
    }
    if (_0x39a0ef === "notification" && _0x2b366b.reloadOnFailure !== false) {
      try {
        if (_0x4afe92) {
          _0x16891a(_0x4afe92, "通知列表连续未就绪，正在刷新精选页后做最后一次恢复检查…", "warning");
        }
        await _0x12d98a(_0x3eb040, "https://www.douyin.com/jingxuan");
        const _0x446db6 = await _0x3aee2c(_0x3eb040, "home", {
          timeoutMs: _0x4646db,
          stableSamples: 2,
          taskId: _0x4afe92
        });
        if (isWarmupSurfaceComplete(_0x446db6)) {
          const _0x3c8036 = await _0x1d94bd(_0x3eb040, _0x35ff5e, _0xa545e0);
          if (_0x3c8036) {
            _0x42ee0d = await _0x28f9b1(_0x3eb040, _0x39a0ef, {
              timeoutMs: _0x3a75de,
              taskId: _0x4afe92
            });
            return {
              ..._0x42ee0d,
              clickAttempt: 3,
              reloaded: true
            };
          }
        } else {
          _0x42ee0d = {
            ..._0x446db6,
            kind: _0x39a0ef,
            reloadHomeFailed: true
          };
        }
      } catch (_0x5583ae) {
        _0x42ee0d = {
          ..._0x42ee0d,
          status: "navigation-error",
          error: _0x5583ae?.message || String(_0x5583ae),
          reloaded: true
        };
      }
    }
    return _0x42ee0d;
  }
  async function _0x2218da(_0x10d392) {
    return _0x10d392.webContents.executeJavaScript("(() => {\n      const EVENT_RE = /(评论了你的(?:作品|视频|评论|动态)?|回复了你|回复了你的评论|关注了你|开始关注你|赞了你的(?:作品|视频|评论|动态)?|点赞|喜欢了你的|提到了你|@了你)/;\n      const TIME_RE = /^(刚刚|\\d+秒前|\\d+分钟前|\\d+小时前|\\d+天前|昨天|前天|星期.|\\d{1,2}:\\d{2}|\\d{2}-\\d{2}|\\d{4}-\\d{1,2}|\\d{1,2}\\/\\d{1,2})$/;\n      const visible = (el) => {\n        if (!el) return false;\n        const r = el.getBoundingClientRect();\n        const s = getComputedStyle(el);\n        return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';\n      };\n      const compact = (value) => String(value || '')\n        .replace(/[\\u200b-\\u200f\\u202a-\\u202e\\u2060-\\u206f]/g, '')\n        .replace(/\\s+/g, ' ')\n        .trim();\n      const panelSelectors = [\n        '[data-e2e=\"listDlgTest-container\"]',\n        '[data-e2e*=\"notice\"]',\n        '[data-e2e*=\"notification\"]',\n        '.semi-popover-content',\n        '[class*=\"Popover\"]',\n        '[class*=\"popover\"]',\n        '[class*=\"Notice\"]',\n        '[class*=\"notice\"]',\n        '[role=\"dialog\"]'\n      ].join(',');\n      const panels = Array.from(document.querySelectorAll(panelSelectors))\n        .filter(visible)\n        .filter((el) => !(\n          el.matches('#imSaasContainerId, [data-e2e=\"im-dialog\"]')\n          || el.closest('#imSaasContainerId, [data-e2e=\"im-dialog\"]')\n          || el.querySelector('#imSaasContainerId, [data-e2e=\"im-dialog\"]')\n        ))\n        .map((el) => {\n          const r = el.getBoundingClientRect();\n          const text = compact(el.innerText || el.textContent);\n          return { el, r, text };\n        })\n        .filter(({ r, text }) =>\n          r.width >= 180\n          && r.height >= 60\n          && (EVENT_RE.test(text) || /通知|互动|评论|回复|赞了你|点赞|关注|全部消息/.test(text))\n        )\n        .sort((a, b) => {\n          const aExact = a.el.matches('[data-e2e=\"listDlgTest-container\"]') ? -80 : 0;\n          const bExact = b.el.matches('[data-e2e=\"listDlgTest-container\"]') ? -80 : 0;\n          const aScore = aExact + Math.abs(a.r.top) + Math.min(a.r.width * a.r.height / 1000, 300);\n          const bScore = bExact + Math.abs(b.r.top) + Math.min(b.r.width * b.r.height / 1000, 300);\n          return aScore - bScore;\n        });\n      const panel = panels[0]?.el;\n      if (!panel) return [];\n\n      // 💡 自动化展开被折叠的通知分类（如“展开更多”、“查看历史消息”等）\n      try {\n        const expandBtns = Array.from(panel.querySelectorAll('button, div, span, a'))\n          .filter((el) => visible(el) && /展开|查看更多|历史消息|更多通知/.test(compact(el.innerText || el.textContent)));\n        for (const btn of expandBtns) {\n          try { btn.click(); } catch (_) {}\n        }\n      } catch (_) {}\n\n      const scrollable = panel.querySelector?.('[class*=\"scroll\"], [class*=\"Scroll\"], [class*=\"list\"], [class*=\"List\"]') || panel;\n      const allRowNodes = new Set();\n\n      const collectRowsFromCurrentViewport = () => {\n        const rowSet = new Set();\n        const addRow = (el) => {\n          if (!visible(el) || el === panel) return;\n          let node = el;\n          while (node && node !== panel) {\n            const r = node.getBoundingClientRect();\n            const text = compact(node.innerText || node.textContent);\n            if (r.width >= 180 && r.height >= 36 && text && (EVENT_RE.test(text) || text.length >= 8)) {\n              rowSet.add(node);\n              return;\n            }\n            node = node.parentElement;\n          }\n        };\n        panel.querySelectorAll('.JkTB0jW1, [role=\"listitem\"], li, [data-e2e*=\"notice\"], [data-e2e*=\"notification\"]').forEach(addRow);\n        panel.querySelectorAll('[data-e2e=\"user-name-card\"], a[href*=\"/user/\"], pre').forEach(addRow);\n        if (!rowSet.size) {\n          Array.from(panel.children).forEach((child) => {\n            if (visible(child) && EVENT_RE.test(compact(child.innerText || child.textContent))) rowSet.add(child);\n          });\n        }\n        rowSet.forEach((n) => allRowNodes.add(n));\n      };\n\n      collectRowsFromCurrentViewport();\n\n      if (scrollable && typeof scrollable.scrollBy === 'function') {\n        try {\n          scrollable.scrollBy(0, 300);\n          collectRowsFromCurrentViewport();\n          scrollable.scrollBy(0, 300);\n          collectRowsFromCurrentViewport();\n          scrollable.scrollTop = 0;\n        } catch (_) {}\n      }\n\n      const rows = Array.from(allRowNodes)\n        .filter((row) => visible(row) && EVENT_RE.test(compact(row.innerText || row.textContent)))\n        .sort((a, b) => {\n          const ar = a.getBoundingClientRect();\n          const br = b.getBoundingClientRect();\n          return (ar.top - br.top) || ((ar.width * ar.height) - (br.width * br.height));\n        })\n        .filter((row, idx, arr) => !arr.some((other, otherIdx) =>\n          otherIdx !== idx\n          && other.contains(row)\n          && compact(other.innerText || other.textContent) === compact(row.innerText || row.textContent)\n        ));\n\n      const seenTexts = new Set();\n      return rows.slice(0, 40).map((row) => {\n        const rowText = compact(row.innerText || row.textContent || '');\n        if (!rowText || seenTexts.has(rowText)) return null;\n        seenTexts.add(rowText);\n        const userNameEl = row.querySelector('[data-e2e=\"user-name-card\"]');\n        const linkEl = row.querySelector('a[href*=\"/user/\"]');\n        const leaves = Array.from(row.querySelectorAll('pre, span, div, a'))\n          .filter((el) => el.children.length === 0 && compact(el.innerText || el.textContent))\n          .map((el) => compact(el.innerText || el.textContent));\n        const eventMatch = rowText.match(EVENT_RE);\n        const eventText = leaves.find((text) => EVENT_RE.test(text)) || eventMatch?.[0] || '';\n        let nickname = compact(userNameEl?.innerText || userNameEl?.textContent || linkEl?.innerText || linkEl?.textContent || '');\n        if (!nickname && eventMatch && eventMatch.index > 0) {\n          nickname = compact(rowText.slice(0, eventMatch.index).replace(/^@+/, ''));\n        }\n        const extractVideoUrlFromNode = (el) => {\n          if (!el) return '';\n          const videoLink = el.querySelector?.('a[href*=\"modal_id\"], a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"detail\"], [data-href*=\"modal_id\"], [data-href*=\"/video/\"]');\n          const rawUrl = videoLink?.href || videoLink?.getAttribute?.('data-href') || (el.tagName === 'A' ? el.href : '');\n          if (rawUrl) return rawUrl;\n\n          const nodesToInspect = [el];\n          try {\n            if (el.querySelectorAll) {\n              const children = Array.from(el.querySelectorAll('*'));\n              if (children.length < 60) nodesToInspect.push(...children);\n            }\n          } catch (_) {}\n\n          for (const node of nodesToInspect) {\n            try {\n              const keys = Object.keys(node);\n              const reactKey = keys.find((k) => k.startsWith('__reactProps') || k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance'));\n              if (!reactKey) continue;\n              const root = node[reactKey];\n\n              const visited = new Set();\n              const searchObj = (obj, depth = 0) => {\n                if (!obj || depth > 7) return '';\n                if (typeof obj === 'string') {\n                  const modalMatch = obj.match(/modal_id=(\\d+)/);\n                  if (modalMatch && modalMatch[1]) return 'https://www.douyin.com/jingxuan?modal_id=' + modalMatch[1];\n                  const videoMatch = obj.match(/\\/video\\/(\\d+)/);\n                  if (videoMatch && videoMatch[1]) return 'https://www.douyin.com/video/' + videoMatch[1];\n                  const groupMatch = obj.match(/group_id=(\\d{15,})/);\n                  if (groupMatch && groupMatch[1]) return 'https://www.douyin.com/jingxuan?modal_id=' + groupMatch[1];\n                  return '';\n                }\n                if (typeof obj !== 'object') return '';\n                if (visited.has(obj)) return '';\n                visited.add(obj);\n\n                const modalId = obj.modal_id || obj.modalId || obj.aweme_id || obj.awemeId || obj.item_id || obj.itemId || obj.group_id || obj.groupId;\n                if (modalId && /^\\d{15,}$/.test(String(modalId))) {\n                  return 'https://www.douyin.com/jingxuan?modal_id=' + modalId;\n                }\n\n                if (typeof obj.schema === 'string') {\n                  const res = searchObj(obj.schema, depth + 1);\n                  if (res) return res;\n                }\n                if (typeof obj.url === 'string') {\n                  const res = searchObj(obj.url, depth + 1);\n                  if (res) return res;\n                }\n                if (typeof obj.link_url === 'string') {\n                  const res = searchObj(obj.link_url, depth + 1);\n                  if (res) return res;\n                }\n\n                const keysToSearch = ['memoizedProps', 'pendingProps', 'item', 'data', 'notice', 'content', 'payload', 'target', 'aweme', 'aweme_info', 'awemeInfo', 'extra', 'group'];\n                for (const k of keysToSearch) {\n                  if (obj[k]) {\n                    const res = searchObj(obj[k], depth + 1);\n                    if (res) return res;\n                  }\n                }\n                return '';\n              };\n\n              const found = searchObj(root);\n              if (found) return found;\n            } catch (_) {}\n          }\n          return '';\n        };\n\n        const extractCommentIdFromNode = (el) => {\n          if (!el) return '';\n          const nodesToInspect = [el];\n          try {\n            if (el.querySelectorAll) {\n              const children = Array.from(el.querySelectorAll('*'));\n              if (children.length < 60) nodesToInspect.push(...children);\n            }\n          } catch (_) {}\n          for (const node of nodesToInspect) {\n            try {\n              const keys = Object.keys(node);\n              const reactKey = keys.find((k) => k.startsWith('__reactProps') || k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance'));\n              if (!reactKey) continue;\n              const root = node[reactKey];\n              const visited = new Set();\n              const searchCid = (obj, depth = 0) => {\n                if (!obj || depth > 7 || typeof obj !== 'object') return '';\n                if (visited.has(obj)) return '';\n                visited.add(obj);\n                const cid = obj.cid || obj.comment_id || obj.commentId || obj.comment?.cid;\n                if (cid && /^\\d{10,}$/.test(String(cid))) return String(cid);\n                const keysToSearch = ['memoizedProps', 'pendingProps', 'item', 'data', 'notice', 'content', 'comment', 'payload', 'extra'];\n                for (const k of keysToSearch) {\n                  if (obj[k]) {\n                    const res = searchCid(obj[k], depth + 1);\n                    if (res) return res;\n                  }\n                }\n                return '';\n              };\n              const found = searchCid(root);\n              if (found) return found;\n            } catch (_) {}\n          }\n          return '';\n        };\n\n        const preText = compact(row.querySelector('pre')?.innerText || row.querySelector('pre')?.textContent || '');\n        const timeText = [...leaves].reverse().find((text) => TIME_RE.test(text)) || '';\n        const videoUrl = extractVideoUrlFromNode(row);\n        const commentId = extractCommentIdFromNode(row);\n        return {\n          source: 'notification',\n          nickname: nickname || '抖音用户',\n          userUrl: linkEl?.href || '',\n          videoUrl: videoUrl || '',\n          commentId: commentId || '',\n          text: preText || rowText,\n          rowText,\n          eventText,\n          timeText,\n          hasFollowButton: !!row.querySelector('[data-e2e=\"notice-follow-button\"], [class*=\"Follow\"], [class*=\"follow\"]'),\n        };\n      }).filter(Boolean);\n    })()").catch(() => []);
  }
  function _0x4ddb65(_0x242b78 = [], _0x4a7877 = []) {
    const _0x1128a1 = new Set((Array.isArray(_0x242b78) ? _0x242b78 : []).map(_0x569997 => compactText(_0x569997.nickname) + "|" + compactText(_0x569997.text)));
    const _0x2e8d20 = [...(Array.isArray(_0x242b78) ? _0x242b78 : [])];
    for (const _0x5e8ec3 of Array.isArray(_0x4a7877) ? _0x4a7877 : []) {
      const _0x30334d = compactText(_0x5e8ec3.nickname) + "|" + compactText(_0x5e8ec3.text);
      if (_0x1128a1.has(_0x30334d)) {
        continue;
      }
      _0x1128a1.add(_0x30334d);
      _0x2e8d20.push(_0x5e8ec3);
    }
    return _0x2e8d20;
  }
  function _0x415f47(_0x13cfc8 = []) {
    return (Array.isArray(_0x13cfc8) ? _0x13cfc8 : []).filter(_0x19c761 => {
      if (!_0x19c761 || _0x19c761.isFolder) {
        return false;
      }
      if (!_0x19c761.unread) {
        return false;
      }
      if (isDouyinStrangerMessagesFolderRow({
        title: _0x19c761.nickname,
        titleRaw: _0x19c761.nickname,
        rowText: _0x19c761.rowText,
        kind: _0x19c761.kind
      })) {
        return false;
      }
      return true;
    });
  }
  async function _0x1cb107(_0x5b33ef) {
    if (!_0x5b33ef || _0x5b33ef.isDestroyed()) {
      return null;
    }
    return _0x5b33ef.webContents.executeJavaScript("(() => {\n      const compact = (value) => String(value || '').replace(/\\s+/g, ' ').trim();\n      const visible = (el) => {\n        if (!el) return false;\n        const r = el.getBoundingClientRect();\n        const s = getComputedStyle(el);\n        return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';\n      };\n      const candidates = Array.from(document.querySelectorAll(\n        '[data-e2e=\"conversation-item\"], .conversationStrangerBoxwrapper, [class*=\"Conversation\"], [class*=\"conversation\"], [class*=\"Stranger\"], [class*=\"stranger\"], [role=\"listitem\"], div, span'\n      )).filter((el) => {\n        if (!visible(el)) return false;\n        const r = el.getBoundingClientRect();\n        if (r.width < 80 || r.height < 24 || r.width > 720 || r.height > 160) return false;\n        const text = compact(el.innerText || el.textContent || '');\n        if (!text || !text.includes('陌生人消息')) return false;\n        if (text.length > 36 && !/^陌生人消息/.test(text) && !/^<+\\s*陌生人消息/.test(text)) return false;\n        return true;\n      }).sort((a, b) => {\n        const score = (el) => {\n          const text = compact(el.innerText || el.textContent || '');\n          const r = el.getBoundingClientRect();\n          let s = 0;\n          if (/^陌生人消息/.test(text)) s += 100;\n          if (el.matches('.conversationStrangerBoxwrapper, [class*=\"StrangerBox\"], [class*=\"strangerBox\"]')) s += 80;\n          if (el.matches('[data-e2e=\"conversation-item\"], [role=\"listitem\"]')) s += 40;\n          if (text === '陌生人消息') s += 50;\n          return s + Math.min(r.width * r.height / 1000, 30);\n        };\n        return score(b) - score(a);\n      });\n      const el = candidates[0];\n      if (!el) return null;\n      const r = el.getBoundingClientRect();\n      return { x: Math.round(r.left + Math.min(48, r.width / 2)), y: Math.round(r.top + r.height / 2) };\n    })()").catch(() => null);
  }
  async function _0x40cf74(_0x1a7040) {
    if (!_0x1a7040 || _0x1a7040.isDestroyed()) {
      return null;
    }
    return _0x1a7040.webContents.executeJavaScript("(() => {\n      const compact = (value) => String(value || '').replace(/\\s+/g, ' ').trim();\n      const visible = (el) => {\n        if (!el) return false;\n        const r = el.getBoundingClientRect();\n        const s = getComputedStyle(el);\n        return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';\n      };\n      const nodes = Array.from(document.querySelectorAll(\n        '[class*=\"Header\"], [class*=\"header\"], [class*=\"Nav\"], [class*=\"nav\"], [class*=\"Title\"], [class*=\"title\"], div, span, button, [role=\"button\"]'\n      ));\n      let header = null;\n      for (const el of nodes) {\n        if (!visible(el)) continue;\n        const text = compact(el.innerText || el.textContent || '');\n        if (text.length > 0 && text.length <= 20 && /^<+\\s*陌生人消息$/.test(text)) {\n          header = el;\n          break;\n        }\n      }\n      if (!header) return null;\n      const back = header.querySelector('svg, [class*=\"back\"], [class*=\"Back\"], [class*=\"arrow\"], [class*=\"Arrow\"]') || header;\n      const r = back.getBoundingClientRect();\n      return { x: Math.round(r.left + Math.min(18, r.width / 3)), y: Math.round(r.top + r.height / 2) };\n    })()").catch(() => null);
  }
  async function _0x437c1e(_0x51fdc5) {
    const _0x17e24a = await _0x40cf74(_0x51fdc5);
    if (!_0x17e24a) {
      return false;
    }
    await _0x3c3959(_0x51fdc5, _0x17e24a.x, _0x17e24a.y);
    await delay(1200);
    return true;
  }
  async function _0x6426ae(_0x49f246) {
    const _0x16a0b5 = await _0x1cb107(_0x49f246);
    if (!_0x16a0b5) {
      return false;
    }
    await _0x3c3959(_0x49f246, _0x16a0b5.x, _0x16a0b5.y);
    await delay(1800);
    return true;
  }
  async function _0x23d29e(_0xd3e5d) {
    const _0xf653 = await _0xd3e5d.webContents.executeJavaScript("(() => {\n      const TIME_RE = /^(刚刚|\\d+秒前|\\d+分钟前|\\d+小时前|\\d+天前|昨天|前天|星期.|\\d{1,2}:\\d{2}|\\d{2}-\\d{2}|\\d{4}-\\d{1,2}|\\d{1,2}\\/\\d{1,2})$/;\n      const visible = (el) => {\n        if (!el) return false;\n        const r = el.getBoundingClientRect();\n        const s = getComputedStyle(el);\n        return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';\n      };\n      const compact = (value) => String(value || '')\n        .replace(/[\\u200b-\\u200f\\u202a-\\u202e\\u2060-\\u206f]/g, '')\n        .replace(/\\s+/g, ' ')\n        .trim();\n      const folderNameRe = /^(?:<+\\s*)?(陌生人消息|私信|消息)$/;\n      const insideStrangerFolder = Array.from(document.querySelectorAll(\n        '[class*=\"Header\"], [class*=\"header\"], [class*=\"Nav\"], [class*=\"nav\"], [class*=\"Title\"], [class*=\"title\"], div, span'\n      )).some((el) => {\n        if (!visible(el)) return false;\n        const text = compact(el.innerText || el.textContent || '');\n        return text.length > 0 && text.length <= 20 && /^<+\\s*陌生人消息$/.test(text);\n      });\n\n      // 💡 Direct document query prevents root-container matching failures when im-dialog overlaps.\n      const rows = Array.from(document.querySelectorAll(\n        '[data-e2e=\"conversation-item\"], .conversationStrangerBoxwrapper, [class*=\"Conversation\"], [class*=\"conversation\"], [class*=\"Stranger\"], [class*=\"stranger\"], [role=\"listitem\"]'\n      ))\n        .filter((row) => {\n          if (!visible(row)) return false;\n          const r = row.getBoundingClientRect();\n          const text = compact(row.innerText || row.textContent);\n          return r.width >= 160 && r.height >= 32 && text && !/^私信$|^消息$/.test(text);\n        })\n        .sort((a, b) => {\n          const ar = a.getBoundingClientRect();\n          const br = b.getBoundingClientRect();\n          return (ar.top - br.top) || ((ar.width * ar.height) - (br.width * br.height));\n        });\n\n      const seenTexts = new Set();\n      const list = [];\n      const debugLogs = [];\n\n      rows.slice(0, 40).forEach((row) => {\n        const rowText = compact(row.innerText || row.textContent || '');\n        if (!rowText || seenTexts.has(rowText)) return;\n        seenTexts.add(rowText);\n        const lines = rowText.split(/\\n|\\s{2,}/).map((part) => compact(part)).filter(Boolean);\n        const titleRaw = compact(\n          row.querySelector('[class*=\"titleWrapper\"], [class*=\"TitleWrapper\"], [class*=\"title\"], [class*=\"Title\"]')?.innerText\n          || row.querySelector('a[href*=\"/user/\"]')?.innerText\n          || ''\n        );\n        const titleParts = titleRaw.split(/\\n|\\s{2,}/).map((part) => compact(part)).filter(Boolean);\n        const timeEl = row.querySelector('[class*=\"timeStr\"], [class*=\"TimeStr\"], [class*=\"strangerTimeStr\"], [class*=\"time\"], [class*=\"Time\"]');\n        const msgEl = row.querySelector('pre, [class*=\"HinttextBox\"], [class*=\"hint\"], [class*=\"Hint\"], [class*=\"Desc\"], [class*=\"desc\"], [class*=\"Content\"], [class*=\"content\"], [class*=\"Message\"], [class*=\"message\"]');\n        const ignoredTitle = /^(私信|消息|陌生人消息|未读|已读|\\d+)$/;\n        const timeText = compact(timeEl?.innerText || timeEl?.textContent || [...lines].reverse().find((line) => TIME_RE.test(line)) || '');\n        let title = titleParts.find((part) => part && !TIME_RE.test(part) && !ignoredTitle.test(part)) || '';\n        if (!title) {\n          title = lines.find((line) => line && !TIME_RE.test(line) && !ignoredTitle.test(line)) || '';\n        }\n        let text = compact(msgEl?.innerText || msgEl?.textContent || '');\n        if (!text || text === title) {\n          text = [...lines].reverse().find((line) =>\n            line\n            && line !== title\n            && line !== timeText\n            && !TIME_RE.test(line)\n            && !ignoredTitle.test(line)\n          ) || '';\n        }\n        // 标题节点经常带上预览/时间/未读数，先剥掉再入库，避免轮次上限键漂移\n        if (title && text && title.includes(text) && title.length > text.length) {\n          const cut = title.indexOf(text);\n          if (cut > 0) title = compact(title.slice(0, cut));\n        }\n        if (title && timeText && title.endsWith(timeText)) {\n          title = compact(title.slice(0, -timeText.length));\n        }\n        title = compact(title\n          .replace(/(?:\\s|[·•])*(?:刚刚|\\d+秒前|\\d+分钟前|\\d+小时前|\\d+天前|昨天|前天|星期.|\\d{1,2}:\\d{2})$/u, '')\n          .replace(/(?:\\s|[·•])*\\d+\\+?\\s*$/u, ''));\n        if (!text) text = rowText;\n        const kind = /Stranger|stranger|陌生人/.test(row.className || rowText) ? 'stranger' : 'conversation';\n        const firstTitleLine = compact((titleRaw || '').split(/\\n/)[0] || title);\n        let isFolder = false;\n        try {\n          isFolder = folderNameRe.test(title)\n            || folderNameRe.test(firstTitleLine)\n            || (!title && /陌生人消息/.test(rowText) && kind === 'stranger')\n            || (/^<?\\s*陌生人消息/.test(rowText) && rowText.length <= 48)\n            || (row.matches('.conversationStrangerBoxwrapper, [class*=\"StrangerBox\"], [class*=\"strangerBox\"]') && /陌生人消息/.test(rowText));\n        } catch (_) {\n          isFolder = folderNameRe.test(title) || folderNameRe.test(firstTitleLine);\n        }\n        const attrBlob = compact([\n          row.getAttribute('aria-label') || '',\n          row.getAttribute('title') || '',\n          row.getAttribute('data-conversation-type') || '',\n          row.getAttribute('data-chat-type') || '',\n          row.getAttribute('data-e2e') || '',\n          row.className || '',\n          titleRaw,\n        ].join(' '));\n        let explicitGroupNode = null;\n        try {\n          explicitGroupNode = row.querySelector(\n            '[data-e2e*=\"group\"], [data-e2e*=\"Group\"], [data-chat-type=\"group\"], [data-conversation-type=\"group\"], '\n            + '[class*=\"GroupAvatar\"], [class*=\"group-avatar\"], [class*=\"groupAvatar\"], [class*=\"GroupChat\"], '\n            + '[class*=\"groupChat\"], [class*=\"ImGroup\"], [class*=\"im-group\"], [class*=\"conversation-group\"], '\n            + '[class*=\"AvatarList\"], [class*=\"avatarList\"], [aria-label*=\"群聊\"], [aria-label*=\"群消息\"], [title*=\"群聊\"]'\n          );\n        } catch (_) { explicitGroupNode = null; }\n        const rowRect = row.getBoundingClientRect();\n        const avatarImgs = Array.from(row.querySelectorAll('img')).filter((el) => {\n          if (!visible(el)) return false;\n          const r = el.getBoundingClientRect();\n          return r.left < rowRect.left + Math.min(96, rowRect.width * 0.38)\n            && r.width >= 10 && r.height >= 10 && r.width <= 72 && r.height <= 72;\n        });\n        const hasUserLink = !!row.querySelector('a[href*=\"/user/\"]');\n        // 页面内联启发式（与 shared/douyinDmGroupChat 对齐）：名称/人数/多人头像/DOM 标志\n        const strongName = /群聊|群消息|粉丝群|交流群|互助群|客户群|学员群|官方群|内部群|社群|售后群|资源群|同城群|本地群|宝妈群|创业群/;\n        const memberHint = /共\\s*\\d+\\s*人|\\d+\\s*人|[（(]\\s*(?:[2-9]|[1-9]\\d{1,2})\\s*[）)]/;\n        const groupAttr = /群聊|群消息|group(?:[_\\s-]?chat|[_\\s-]?conversation)|chatType[\"']?\\s*[:=]\\s*[\"']?group/i;\n        let groupReason = '';\n        let isGroupChat = false;\n        if (explicitGroupNode) {\n          isGroupChat = true;\n          groupReason = 'dom_explicit';\n        } else if (groupAttr.test(attrBlob)) {\n          isGroupChat = true;\n          groupReason = 'attr_text';\n        } else if (strongName.test(title) || /的群$/.test(title) || (/^.{1,24}群$/.test(title) && !/个人|自己/.test(title))) {\n          isGroupChat = true;\n          groupReason = 'name_strong';\n        } else if (memberHint.test(title)) {\n          isGroupChat = true;\n          groupReason = /群/.test(title) ? 'name_群+人数' : 'name_paren_count';\n        } else {\n          let score = 0;\n          const reasons = [];\n          if (/群/.test(title)) { score += 2; reasons.push('name_has_群'); }\n          if (memberHint.test(title)) { score += 3; reasons.push('member_hint'); }\n          if (avatarImgs.length >= 3) { score += 4; reasons.push('avatars>=3'); }\n          else if (avatarImgs.length >= 2) { score += 2; reasons.push('avatars>=2'); }\n          if (!hasUserLink && score >= 2) { score += 1; reasons.push('no_user_link'); }\n          if (/GroupAvatar|group-avatar|groupAvatar|GroupChat|groupChat|ImGroup|im-group|AvatarList|avatarList|多人头像/i.test(attrBlob)) {\n            score += 3; reasons.push('class_hint');\n          }\n          if (score >= 3) {\n            isGroupChat = true;\n            groupReason = 'score_' + score + ':' + reasons.join('+');\n          }\n        }\n        const knownUnreadBadge = row.querySelector(\n          '[class*=\"UnRead\"], [class*=\"Unread\"], [class*=\"unread\"], [class*=\"red-dot\"], [class*=\"RedDot\"], [aria-label*=\"未读\"]'\n        );\n        const visualUnreadBadge = Array.from(row.querySelectorAll('span, i, div, b, em')).find((el) => {\n          if (!visible(el)) return false;\n          const r = el.getBoundingClientRect();\n          if (r.width > 22 || r.height > 22 || r.width < 4 || r.height < 4) return false;\n          const color = String(getComputedStyle(el).backgroundColor || '');\n          const badgeText = compact(el.innerText || el.textContent || '');\n          const isRed = /rgb\\((?:2[0-5]\\d|1\\d\\d),\\s*(?:[0-8]?\\d),\\s*(?:[0-8]?\\d)\\)/.test(color)\n            || /rgba\\((?:2[0-5]\\d|1\\d\\d),\\s*(?:[0-8]?\\d),\\s*(?:[0-8]?\\d)/.test(color);\n          const isNum = /^\\d+\\+?$/.test(badgeText);\n          // 必须是红点/红底未读数，不能把时间数字、普通角标当成未读\n          return isRed && (isNum || (!badgeText && r.width <= 16 && r.height <= 16));\n        });\n        const unreadBadge = knownUnreadBadge || visualUnreadBadge;\n        const hasRedDot = !!unreadBadge;\n        const unreadText = unreadBadge ? compact(unreadBadge.innerText || unreadBadge.textContent) : '';\n\n        debugLogs.push({\n          nickname: isFolder ? '陌生人消息' : title,\n          rowText: rowText.substring(0, 100),\n          hasRedDot,\n          unreadText,\n          rowClasses: row.className,\n          badgeClasses: unreadBadge ? unreadBadge.className : null,\n          isGroupChat,\n          isFolder,\n          groupReason,\n          avatarCount: avatarImgs.length,\n        });\n\n        list.push({\n          source: 'dm',\n          kind: isFolder ? 'stranger-folder' : kind,\n          isFolder,\n          nickname: isFolder ? '陌生人消息' : (title || '抖音用户'),\n          userUrl: row.querySelector('a[href*=\"/user/\"]')?.href || '',\n          text: isFolder ? '' : text,\n          rowText,\n          eventText: '私信',\n          timeText,\n          unread: hasRedDot,\n          isGroupChat,\n          groupReason,\n          fromStrangerFolder: !!insideStrangerFolder && !isFolder,\n        });\n      });\n      return { ok: true, list, debugLogs, insideStrangerFolder };\n    })()").catch(_0x1beefb => ({
      ok: false,
      error: _0x1beefb.message || String(_0x1beefb)
    }));
    if (_0xf653 && _0xf653.ok) {
      if (_0xf653.debugLogs && _0xf653.debugLogs.length) {
        const _0x1f7726 = _0xf653.debugLogs.filter(_0x50ed2e => _0x50ed2e.hasRedDot).length;
        const _0x2e97d3 = _0xf653.debugLogs.filter(_0x1f77b8 => _0x1f77b8.isGroupChat).length;
        const _0x54804b = _0xf653.debugLogs.filter(_0x3d3a75 => _0x3d3a75.isFolder).length;
        console.log("[selfWarmup-DM-Debug] Scraped " + _0xf653.debugLogs.length + " message rows, unread=" + _0x1f7726 + ", groups=" + _0x2e97d3 + ", folders=" + _0x54804b + ", insideFolder=" + !!_0xf653.insideStrangerFolder);
        _0xf653.debugLogs.filter(_0x40257e => _0x40257e.isGroupChat).slice(0, 8).forEach(_0xcb92ef => {
          console.log("[selfWarmup-DM-Debug] group-hit: " + (_0xcb92ef.nickname || "?") + " reason=" + (_0xcb92ef.groupReason || "?"));
        });
      }
      return _0xf653;
    }
    console.log("[selfWarmup-DM-Debug] scrapeMessages failed: " + (_0xf653?.error || "Unknown error"));
    return {
      ok: false,
      list: [],
      debugLogs: [],
      insideStrangerFolder: false,
      error: _0xf653?.error || ""
    };
  }
  async function _0x17e343(_0x2da37e, _0x9d0a0b = false) {
    let _0x1198ba = await _0x23d29e(_0x2da37e);
    if (!_0x1198ba || !_0x1198ba.ok) {
      return {
        ok: false,
        list: [],
        reason: _0x1198ba?.error || "读取私信列表失败"
      };
    }
    if (_0x1198ba.insideStrangerFolder) {
      const _0x126185 = await _0x437c1e(_0x2da37e);
      if (_0x126185) {
        _0x1198ba = await _0x23d29e(_0x2da37e);
        if (!_0x1198ba || !_0x1198ba.ok) {
          return {
            ok: false,
            list: _0x415f47(_0x1198ba?.list),
            reason: _0x1198ba?.error || "返回私信列表后读取失败"
          };
        }
      } else {
        return {
          ok: true,
          list: _0x415f47(_0x1198ba.list)
        };
      }
    }
    const _0x2b9f7f = _0x1198ba.list || [];
    const _0x16f1e5 = _0x2b9f7f.find(_0xf686e3 => _0xf686e3.isFolder || isDouyinStrangerMessagesFolderName(_0xf686e3.nickname));
    let _0xa38afd = _0x415f47(_0x2b9f7f);
    if (_0x16f1e5) {
      const _0x46b189 = await _0x6426ae(_0x2da37e);
      if (_0x46b189) {
        const _0x3937cf = await _0x23d29e(_0x2da37e);
        const _0x33ef92 = _0x415f47(_0x3937cf?.list).map(_0x18ef8c => ({
          ..._0x18ef8c,
          fromStrangerFolder: true
        }));
        _0xa38afd = _0x4ddb65(_0xa38afd, _0x33ef92);
        console.log("[selfWarmup-DM-Debug] stranger-folder inner unread=" + _0x33ef92.length + ", merged=" + _0xa38afd.length);
      }
    }
    if (!_0xa38afd.length && _0x9d0a0b && _0x2b9f7f.length) {
      console.log("[selfWarmup-DM-Debug] Header has unread badge but no unread row badge; skip fallback to avoid false DM replies");
    }
    return {
      ok: true,
      list: _0xa38afd
    };
  }
  function _0x5abb0d(_0x1d7b59, _0x5b2e71) {
    const _0x433787 = parseNotificationType((_0x1d7b59.eventText || "") + " " + (_0x1d7b59.rowText || ""));
    const _0x3b4835 = compactText(_0x1d7b59.text || _0x1d7b59.rowText);
    return {
      source: "notification",
      eventType: _0x433787,
      eventLabel: EVENT_TYPE_LABELS[_0x433787] || "未知通知",
      accountId: String(_0x5b2e71.id),
      accountName: _0x5b2e71.nickname || _0x5b2e71.name || "账号" + _0x5b2e71.id,
      nickname: compactText(_0x1d7b59.nickname),
      userUrl: _0x1d7b59.userUrl || "",
      videoUrl: _0x1d7b59.videoUrl || "",
      commentId: _0x1d7b59.commentId || _0x1d7b59.cid || "",
      cid: _0x1d7b59.commentId || _0x1d7b59.cid || "",
      text: _0x3b4835,
      notificationRowText: compactText(_0x1d7b59.rowText),
      notificationEventText: compactText(_0x1d7b59.eventText),
      timeText: compactText(_0x1d7b59.timeText),
      unread: false,
      hasFollowButton: !!_0x1d7b59.hasFollowButton
    };
  }
  function _0x174148(_0x444fe0, _0x936b8b) {
    const _0x3ff4d0 = compactText(_0x444fe0.timeText);
    let _0x6d2576 = compactText(_0x444fe0.text);
    if (!_0x6d2576) {
      const _0x654fb0 = compactText(_0x444fe0.rowText);
      const _0x3ecde9 = compactText(_0x444fe0.nickname);
      _0x6d2576 = _0x654fb0.replace(_0x3ecde9, "").replace(_0x3ff4d0, "").replace(/(?:\s|[·•])*\d+\+?\s*$/u, "").replace(/^(?:\s|[·•])+|(?:\s|[·•])+$/ug, "").trim();
    }
    const _0x15be88 = sanitizeDmNickname(_0x444fe0.nickname, _0x6d2576, _0x3ff4d0);
    if (_0x444fe0.isFolder || isDouyinStrangerMessagesFolderName(_0x15be88) || isDouyinStrangerMessagesFolderRow({
      title: _0x15be88,
      titleRaw: _0x444fe0.nickname,
      rowText: _0x444fe0.rowText,
      kind: _0x444fe0.kind
    })) {
      return null;
    }
    let _0x336ba6 = looksLikeDouyinGroupChatName(_0x15be88 || _0x444fe0.nickname);
    if (!_0x336ba6.isGroup) {
      _0x336ba6 = looksLikeDouyinGroupChatName(compactText(_0x444fe0.rowText).split(/\n/)[0].slice(0, 48));
    }
    const _0x4da2cf = detectDouyinDmIsGroupChat({
      name: _0x15be88 || _0x444fe0.nickname,
      rowText: _0x444fe0.rowText,
      attrBlob: _0x444fe0.groupReason || "",
      hasExplicitGroupNode: !!_0x444fe0.isGroupChat
    });
    const _0x21085a = !!_0x444fe0.isGroupChat || _0x336ba6.isGroup || _0x4da2cf.isGroup;
    return {
      source: "dm",
      eventType: "message",
      eventLabel: EVENT_TYPE_LABELS.message,
      accountId: String(_0x936b8b.id),
      accountName: _0x936b8b.nickname || _0x936b8b.name || "账号" + _0x936b8b.id,
      nickname: _0x15be88 || compactText(_0x444fe0.nickname) || "抖音用户",
      userUrl: _0x444fe0.userUrl || "",
      text: _0x6d2576,
      timeText: _0x3ff4d0,
      unread: !!_0x444fe0.unread,
      isGroupChat: _0x21085a,
      groupReason: _0x444fe0.groupReason || _0x336ba6.reason || _0x4da2cf.reason || ""
    };
  }
  function _0xbcd816(_0x545d13, _0x5957a2) {
    const _0x21e2a0 = WATCH_KEYS[_0x5957a2.eventType];
    if (!_0x21e2a0) {
      return false;
    }
    return _0x545d13[_0x21e2a0] !== false;
  }
  function _0x158ff6(_0x148da5, _0x415ad4) {
    if (_0x415ad4.source === "dm" && isDouyinStrangerMessagesFolderName(_0x415ad4.nickname)) {
      return "陌生人消息是文件夹，需进入后识别具体会话";
    }
    if (_0x415ad4.source === "dm" && _0x148da5.excludeGroupChats !== false) {
      if (_0x415ad4.isGroupChat) {
        return "已开启“排除群聊”";
      }
      const _0x5a00bb = looksLikeDouyinGroupChatName(_0x415ad4.nickname);
      if (_0x5a00bb.isGroup) {
        _0x415ad4.isGroupChat = true;
        _0x415ad4.groupReason = _0x5a00bb.reason;
        return "已开启“排除群聊”";
      }
    }
    const _0x4c8d6a = splitList(_0x148da5.excludeUsers).map(normalizeName);
    if (!_0x4c8d6a.length) {
      return "";
    }
    const _0x4aac8d = normalizeName(_0x415ad4.nickname);
    if (_0x4c8d6a.some(_0x38e368 => _0x38e368 && _0x4aac8d === _0x38e368)) {
      return "命中排除用户";
    } else {
      return "";
    }
  }
  function _0x1be824(_0x1296b7 = {}) {
    let _0x29d030 = Number(_0x1296b7.actionDelayMin);
    let _0xe00fa3 = Number(_0x1296b7.actionDelayMax);
    if (!Number.isFinite(_0x29d030)) {
      _0x29d030 = 2;
    }
    if (!Number.isFinite(_0xe00fa3)) {
      _0xe00fa3 = 6;
    }
    if (_0x29d030 > _0xe00fa3) {
      [_0x29d030, _0xe00fa3] = [_0xe00fa3, _0x29d030];
    }
    _0x29d030 = Math.max(1, Math.floor(_0x29d030));
    _0xe00fa3 = Math.max(_0x29d030, Math.floor(_0xe00fa3));
    const _0x524a31 = Math.floor(Math.random() * (_0xe00fa3 - _0x29d030 + 1)) + _0x29d030;
    return _0x524a31 * 1000;
  }
  function _0x1f17fd(_0x4edf06, _0x338359, _0x1163d7 = "comment", _0x5640cc = "") {
    const _0x8439f2 = extractUserKeyFromUrl(_0x5640cc);
    if (_0x8439f2) {
      return String(_0x4edf06 || "") + "|uid:" + _0x8439f2 + "|" + _0x1163d7;
    }
    return String(_0x4edf06 || "") + "|" + normalizeName(_0x338359) + "|" + _0x1163d7;
  }
  function _0x3235a3(_0x51cfd5, _0x4a6305, _0x2a6e31 = "comment", _0x4b2b52 = "") {
    const _0x456aaf = [];
    const _0x6716e9 = extractUserKeyFromUrl(_0x4b2b52);
    const _0x570661 = normalizeName(_0x4a6305);
    const _0x990585 = String(_0x51cfd5 || "");
    if (_0x6716e9) {
      _0x456aaf.push(_0x990585 + "|uid:" + _0x6716e9 + "|" + _0x2a6e31);
    }
    if (_0x570661) {
      _0x456aaf.push(_0x990585 + "|" + _0x570661 + "|" + _0x2a6e31);
      _0x456aaf.push(_0x990585 + "|" + _0x570661);
      _0x456aaf.push(_0x570661);
    }
    return [...new Set(_0x456aaf.filter(Boolean))];
  }
  function _0x3f781a(_0x562834, _0x25f8e4, _0x2c4b53 = "", _0x40fc6d = "comment", _0x36c8c0 = "") {
    const _0x38db40 = "self_warmup_user_rounds_" + _0x562834;
    const _0x411e01 = _0x3c83bb.get(_0x38db40, {}) || {};
    let _0x4b8739 = 0;
    for (const _0x4748ae of _0x3235a3(_0x2c4b53, _0x25f8e4, _0x40fc6d, _0x36c8c0)) {
      _0x4b8739 = Math.max(_0x4b8739, Number(_0x411e01?.[_0x4748ae] ?? 0));
    }
    const _0x530286 = String(_0x2c4b53 || "");
    const _0x44507d = normalizeName(_0x25f8e4);
    if (_0x44507d) {
      const _0x2577ae = _0x530286 + "|" + _0x44507d + "|" + _0x40fc6d;
      _0x4b8739 = Math.max(_0x4b8739, Number(_0x411e01?.[_0x2577ae] ?? 0));
      const _0x16abbc = _0x530286 + "|";
      const _0x18c886 = "|" + _0x40fc6d;
      for (const [_0x2f9c96, _0x309b50] of Object.entries(_0x411e01)) {
        if (!_0x2f9c96.startsWith(_0x16abbc) || !_0x2f9c96.endsWith(_0x18c886)) {
          continue;
        }
        const _0x33b0cd = _0x2f9c96.slice(_0x16abbc.length, _0x2f9c96.length - _0x18c886.length);
        if (_0x33b0cd === _0x44507d || _0x33b0cd.startsWith(_0x44507d + " ") || _0x33b0cd.startsWith(_0x44507d + "|") || _0x2f9c96.includes("|" + _0x44507d + "|") || _0x2f9c96 === _0x2577ae) {
          _0x4b8739 = Math.max(_0x4b8739, Number(_0x309b50 ?? 0));
        }
      }
    }
    return _0x4b8739;
  }
  function _0x2117f1(_0x4e74cb, _0x475776, _0x17678 = "", _0x2da7eb = "comment", _0x19276d = "") {
    const _0x521242 = "self_warmup_user_rounds_" + _0x4e74cb;
    const _0x1de82f = _0x3c83bb.get(_0x521242, {}) || {};
    const _0x15dbc1 = _0x3f781a(_0x4e74cb, _0x475776, _0x17678, _0x2da7eb, _0x19276d);
    const _0x142bb7 = _0x15dbc1 + 1;
    const _0x4b4a5b = String(_0x17678 || "");
    const _0x30513b = normalizeName(_0x475776);
    const _0x3bc98c = extractUserKeyFromUrl(_0x19276d);
    if (_0x3bc98c) {
      _0x1de82f[_0x4b4a5b + "|uid:" + _0x3bc98c + "|" + _0x2da7eb] = _0x142bb7;
    }
    if (_0x30513b) {
      _0x1de82f[_0x4b4a5b + "|" + _0x30513b + "|" + _0x2da7eb] = _0x142bb7;
    }
    if (!_0x3bc98c && !_0x30513b) {
      _0x1de82f[_0x1f17fd(_0x17678, _0x475776, _0x2da7eb, _0x19276d)] = _0x142bb7;
    }
    _0x3c83bb.set(_0x521242, _0x1de82f);
    return _0x142bb7;
  }
  function _0x3e6a03(_0x3fa2c7 = {}) {
    return Math.max(1, Math.min(20, Number(_0x3fa2c7.actionUserMaxRounds ?? _0x3fa2c7.actionMessageMaxRounds) || 1));
  }
  function _0x13bfdc(_0x141b7a, _0x2ac0ca, _0x16cb62, _0x56ef23 = "", _0x198bac = "comment", _0x5603fc = "") {
    return _0x3f781a(_0x141b7a, _0x16cb62, _0x56ef23, _0x198bac, _0x5603fc) >= _0x3e6a03(_0x2ac0ca);
  }
  function _0x8b7897(_0x9a03e9, _0x3c1622, _0x54c4b1) {
    if (!_0x3c1622.enableAutoActions || !_0x54c4b1.matched) {
      return [];
    }
    const _0x5a530a = [];
    const _0x1bf55d = _0x13bfdc(_0x9a03e9, _0x3c1622, _0x54c4b1.nickname, _0x54c4b1.accountId, "comment", _0x54c4b1.userUrl);
    const _0x1c99ff = _0x13bfdc(_0x9a03e9, _0x3c1622, _0x54c4b1.nickname, _0x54c4b1.accountId, "dm", _0x54c4b1.userUrl);
    const _0x33dd5e = _0x3f781a(_0x9a03e9, _0x54c4b1.nickname, _0x54c4b1.accountId, "dm", _0x54c4b1.userUrl) > 0;
    if (_0x54c4b1.eventType === "comment" && _0x3c1622.watchComments !== false) {
      if (_0x3c1622.actionCommentLike !== false) {
        _0x5a530a.push("like_comment");
      }
      if (_0x3c1622.actionCommentReply && !_0x1bf55d) {
        _0x5a530a.push("reply_comment");
      }
    }
    if (_0x54c4b1.eventType === "reply" && _0x3c1622.watchReplies !== false) {
      if (_0x3c1622.actionReplyLike !== false) {
        _0x5a530a.push("like_comment");
      }
      if (_0x3c1622.actionReplyReply && !_0x1bf55d) {
        _0x5a530a.push("reply_comment");
      }
      if (_0x3c1622.actionReplyFollow) {
        _0x5a530a.push("user_follow");
      }
      if (_0x3c1622.actionReplyDm && !_0x1c99ff && !_0x33dd5e) {
        _0x5a530a.push("send_dm");
      }
    }
    if (_0x54c4b1.eventType === "like" && _0x3c1622.watchLikes !== false) {
      if (_0x3c1622.actionLikeFollow) {
        _0x5a530a.push("user_follow");
      }
      if (_0x3c1622.actionLikeDm && !_0x1c99ff && !_0x33dd5e) {
        _0x5a530a.push("send_dm");
      }
    }
    if (_0x54c4b1.eventType === "follow" && _0x3c1622.watchFollows !== false) {
      if (_0x3c1622.actionFollowBack) {
        _0x5a530a.push("follow_back");
      }
      if (_0x3c1622.actionFollowDm && !_0x1c99ff && !_0x33dd5e) {
        _0x5a530a.push("send_dm");
      }
    }
    if (_0x54c4b1.eventType === "message" && _0x3c1622.watchMessages !== false && _0x3c1622.actionMessageReply) {
      if (!_0x1c99ff) {
        _0x5a530a.push("reply_dm");
      }
    }
    return _0x5a530a.filter(_0x344b0a => _0x137ca2(_0x9a03e9, _0x344b0a, _0x54c4b1.accountId));
  }
  function _0x2c381b(_0x14dc06, _0x4ae5bb, _0x42a5ed) {
    if (!_0x4ae5bb.enableAutoActions || !_0x42a5ed.matched) {
      return [];
    }
    const _0x46e6cb = _0x42a5ed.eventType === "comment" && _0x4ae5bb.watchComments !== false;
    const _0x353536 = _0x42a5ed.eventType === "reply" && _0x4ae5bb.watchReplies !== false;
    const _0x45942d = _0x42a5ed.eventType === "message" && _0x4ae5bb.watchMessages !== false;
    const _0x3aad1f = _0x3e6a03(_0x4ae5bb);
    const _0x37ae04 = [];
    if (_0x45942d) {
      if (!_0x4ae5bb.actionMessageReply) {
        return [{
          action: "reply_dm",
          reason: "未开启“自动回复私信”"
        }];
      }
      const _0x6a812b = _0x3f781a(_0x14dc06, _0x42a5ed.nickname, _0x42a5ed.accountId, "dm", _0x42a5ed.userUrl);
      if (_0x6a812b >= _0x3aad1f) {
        return [{
          action: "reply_dm",
          reason: "已达每用户 " + _0x3aad1f + " 轮私信回复上限（当前 " + _0x6a812b + "/" + _0x3aad1f + "）"
        }];
      }
      return [];
    }
    const _0x2c5ad4 = _0x42a5ed.eventType === "like" && _0x4ae5bb.watchLikes !== false;
    const _0x4bcd1f = _0x42a5ed.eventType === "follow" && _0x4ae5bb.watchFollows !== false;
    const _0x2e5a2a = _0x353536 && _0x4ae5bb.actionReplyDm || _0x2c5ad4 && _0x4ae5bb.actionLikeDm || _0x4bcd1f && _0x4ae5bb.actionFollowDm;
    if (_0x2e5a2a) {
      const _0x145131 = _0x3f781a(_0x14dc06, _0x42a5ed.nickname, _0x42a5ed.accountId, "dm", _0x42a5ed.userUrl);
      if (_0x145131 > 0) {
        _0x37ae04.push({
          action: "send_dm",
          reason: "该用户本任务已发过私信，不再主动私信"
        });
      } else if (_0x145131 >= _0x3aad1f) {
        _0x37ae04.push({
          action: "send_dm",
          reason: "已达每用户 " + _0x3aad1f + " 轮私信上限（当前 " + _0x145131 + "/" + _0x3aad1f + "）"
        });
      }
    }
    if (!_0x46e6cb && !_0x353536) {
      return _0x37ae04;
    }
    const _0x3f8ab2 = _0x46e6cb ? !!_0x4ae5bb.actionCommentReply : !!_0x4ae5bb.actionReplyReply;
    if (!_0x3f8ab2) {
      _0x37ae04.push({
        action: "reply_comment",
        reason: _0x46e6cb ? "未开启“自动回复评论”" : "未开启“自动回复”"
      });
      return _0x37ae04;
    }
    const _0x4e8e9b = _0x3f781a(_0x14dc06, _0x42a5ed.nickname, _0x42a5ed.accountId, "comment", _0x42a5ed.userUrl);
    if (_0x4e8e9b >= _0x3aad1f) {
      _0x37ae04.push({
        action: "reply_comment",
        reason: "已达每用户 " + _0x3aad1f + " 轮回复上限（当前 " + _0x4e8e9b + "/" + _0x3aad1f + "）"
      });
    }
    return _0x37ae04;
  }
  function _0x3872f7(_0x3047ac, _0x49c657, _0x41fbb8, _0x564750) {
    if (!_0x49c657.enableAutoActions || !_0x41fbb8.matched) {
      return _0x564750;
    }
    const _0x22ff0c = [];
    if (_0x41fbb8.eventType === "comment" && _0x49c657.watchComments !== false) {
      if (_0x49c657.actionCommentLike !== false) {
        _0x22ff0c.push("like_comment");
      }
      if (_0x49c657.actionCommentReply) {
        _0x22ff0c.push("reply_comment");
      }
    }
    if (_0x41fbb8.eventType === "reply" && _0x49c657.watchReplies !== false) {
      if (_0x49c657.actionReplyLike !== false) {
        _0x22ff0c.push("like_comment");
      }
      if (_0x49c657.actionReplyReply) {
        _0x22ff0c.push("reply_comment");
      }
      if (_0x49c657.actionReplyFollow) {
        _0x22ff0c.push("user_follow");
      }
      if (_0x49c657.actionReplyDm) {
        _0x22ff0c.push("send_dm");
      }
    }
    if (_0x41fbb8.eventType === "like" && _0x49c657.watchLikes !== false) {
      if (_0x49c657.actionLikeFollow) {
        _0x22ff0c.push("user_follow");
      }
      if (_0x49c657.actionLikeDm) {
        _0x22ff0c.push("send_dm");
      }
    }
    if (_0x41fbb8.eventType === "follow" && _0x49c657.watchFollows !== false) {
      if (_0x49c657.actionFollowBack) {
        _0x22ff0c.push("follow_back");
      }
      if (_0x49c657.actionFollowDm) {
        _0x22ff0c.push("send_dm");
      }
    }
    if (_0x41fbb8.eventType === "message" && _0x49c657.watchMessages !== false && _0x49c657.actionMessageReply) {
      _0x22ff0c.push("reply_dm");
    }
    const _0x188449 = [];
    for (const _0x4f1cb2 of _0x22ff0c) {
      const _0x2436fb = _0x396cb8(_0x3047ac, _0x4f1cb2, _0x41fbb8.accountId);
      if (!_0x2436fb) {
        continue;
      }
      _0x188449.push({
        action: _0x4f1cb2,
        reason: _0x2436fb
      });
    }
    return _0x564750.concat(_0x188449);
  }
  function _0x567fa2(_0x8b3e92 = {}) {
    if (_0x8b3e92.action === "reply_comment") {
      return "未回复评论（" + (_0x8b3e92.reason || "已跳过") + "）";
    }
    if (_0x8b3e92.action === "reply_dm" || _0x8b3e92.action === "send_dm") {
      return "未回复私信（" + (_0x8b3e92.reason || "已跳过") + "）";
    }
    return (ACTION_LABELS[_0x8b3e92.action] || _0x8b3e92.action || "动作") + "已跳过（" + (_0x8b3e92.reason || "未知原因") + "）";
  }
  async function _0x3c3959(_0x4cf16f, _0x16ff17, _0x1b2a9f) {
    const _0x1f952a = Math.round(Number(_0x16ff17) || 0);
    const _0x37d1b7 = Math.round(Number(_0x1b2a9f) || 0);
    if (_0x1f952a <= 0 || _0x37d1b7 <= 0) {
      return false;
    }
    _0x4cf16f.webContents.sendInputEvent({
      type: "mouseMove",
      x: _0x1f952a,
      y: _0x37d1b7
    });
    await delay(120);
    _0x4cf16f.webContents.sendInputEvent({
      type: "mouseDown",
      x: _0x1f952a,
      y: _0x37d1b7,
      button: "left",
      clickCount: 1
    });
    await delay(80);
    _0x4cf16f.webContents.sendInputEvent({
      type: "mouseUp",
      x: _0x1f952a,
      y: _0x37d1b7,
      button: "left",
      clickCount: 1
    });
    await delay(400);
    return true;
  }
  function _0x1f5e3c(_0x40597d = {}) {
    let _0x57c03d = Number(_0x40597d.followDmDelayMin);
    let _0x552d8f = Number(_0x40597d.followDmDelayMax);
    if (!Number.isFinite(_0x57c03d)) {
      _0x57c03d = Number(_0x40597d.actionDelayMin) || 3;
    }
    if (!Number.isFinite(_0x552d8f)) {
      _0x552d8f = Number(_0x40597d.actionDelayMax) || 8;
    }
    if (_0x57c03d > _0x552d8f) {
      [_0x57c03d, _0x552d8f] = [_0x552d8f, _0x57c03d];
    }
    _0x57c03d = Math.max(1, Math.floor(_0x57c03d));
    _0x552d8f = Math.max(_0x57c03d, Math.floor(_0x552d8f));
    const _0x1d019d = Math.floor(Math.random() * (_0x552d8f - _0x57c03d + 1)) + _0x57c03d;
    return _0x1d019d * 1000;
  }
  async function _0x207cee(_0x1dcfe5, _0x18c5cd = "") {
    const _0x29fb70 = await _0x1adc84(_0x1dcfe5, "notification", {
      taskId: _0x18c5cd
    });
    return isWarmupSurfaceComplete(_0x29fb70);
  }
  async function _0x2edf11(_0x29e9f4, _0x5ef0ba = "") {
    const _0x3d9fa4 = await _0x1adc84(_0x29e9f4, "message", {
      taskId: _0x5ef0ba,
      reloadOnFailure: false
    });
    return isWarmupSurfaceComplete(_0x3d9fa4);
  }
  async function _0x1da8b2(_0x5010ce, _0x4d8bdf, _0x19a43b = []) {
    if (_0x5010ce.isDestroyed()) {
      return {
        found: false,
        unread: false,
        reason: "window-destroyed"
      };
    }
    return _0x5010ce.webContents.executeJavaScript("(() => {\n      const selectors = " + JSON.stringify(_0x19a43b) + ";\n      const targetLabel = " + JSON.stringify(_0x4d8bdf) + ";\n      const compact = (value) => String(value || '')\n        .replace(/[\\u200b-\\u200f\\u202a-\\u202e\\u2060-\\u206f]/g, '')\n        .replace(/\\s+/g, ' ')\n        .trim();\n      const visible = (el) => {\n        if (!el) return false;\n        const r = el.getBoundingClientRect();\n        const s = getComputedStyle(el);\n        return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden';\n      };\n      \n      const matchedLabels = [targetLabel];\n      if (targetLabel === '私信') {\n        matchedLabels.push('消息');\n      }\n      \n      const candidates = [];\n      const pushCandidate = (el) => {\n        if (!visible(el)) return;\n        const text = compact(el.innerText || el.textContent);\n        const dataE2e = el.getAttribute('data-e2e') || '';\n        const exact = matchedLabels.some((l) => text === l);\n        const contains = matchedLabels.some((l) => text.includes(l));\n        const isExpectedIm = targetLabel === '私信' && (dataE2e === 'im-entry' || dataE2e === 'something-button');\n        const isExpectedNotif = targetLabel === '通知' && (dataE2e === 'notification-entry' || dataE2e === 'something-button');\n        if (!exact && !contains && !isExpectedIm && !isExpectedNotif) return;\n        candidates.push(el);\n      };\n\n      selectors.forEach((sel) => {\n        try { document.querySelectorAll(sel).forEach(pushCandidate); } catch (_) {}\n      });\n      const header = document.querySelector('#douyin-header-menuCt')\n        || document.querySelector('header')\n        || document.body;\n      header.querySelectorAll(\n        '[data-e2e=\"notification-entry\"], [data-e2e=\"im-entry\"], [data-e2e=\"something-button\"], li, button, a, [role=\"button\"], div'\n      ).forEach(pushCandidate);\n      \n      if (!candidates.length) return { found: false, unread: false, reason: 'entry-not-found' };\n      candidates.sort((a, b) => {\n        const score = (el) => {\n          const r = el.getBoundingClientRect();\n          const text = compact(el.innerText || el.textContent);\n          const dataE2e = el.getAttribute('data-e2e') || '';\n          const exactEntry = targetLabel === '私信' && dataE2e === 'im-entry'\n            ? -10000\n            : (targetLabel === '通知' && dataE2e === 'notification-entry' ? -10000 : 0);\n          const exactLabel = matchedLabels.includes(text) ? -5000 : 0;\n          return exactEntry + exactLabel + (r.width * r.height);\n        };\n        return score(a) - score(b);\n      });\n      const targetEl = candidates[0];\n      \n      // Look for a red dot or badge element inside the candidate header entry\n      const badgeSelectors = '[class*=\"UnRead\"], [class*=\"Unread\"], [class*=\"unread\"], [class*=\"Badge\"], [class*=\"badge\"], [class*=\"dot\"], [class*=\"Dot\"], [class*=\"red-dot\"], [aria-label*=\"未读\"]';\n      const knownBadge = targetEl.querySelector(badgeSelectors);\n      if (knownBadge && visible(knownBadge)) return { found: true, unread: true, reason: 'known-badge' };\n      const unread = Array.from(targetEl.querySelectorAll('span, i, div')).some((el) => {\n        if (!visible(el)) return false;\n        const r = el.getBoundingClientRect();\n        if (r.width > 24 || r.height > 24) return false;\n        const style = getComputedStyle(el);\n        const color = String(style.backgroundColor || '');\n        const labelText = compact(el.innerText || el.textContent || '');\n        return /rgb\\((?:2[0-5]\\d|1\\d\\d),\\s*(?:[0-8]?\\d),\\s*(?:[0-8]?\\d)\\)/.test(color)\n          || /^\\d+\\+?$/.test(labelText);\n      });\n      return { found: true, unread, reason: unread ? 'visual-badge' : 'no-badge' };\n    })()").catch(_0x4fdf63 => ({
      found: false,
      unread: false,
      reason: _0x4fdf63?.message || "badge-probe-error"
    }));
  }
  async function _0x2372a2(_0x58982c, _0x1b267f) {
    const _0x3cee2a = await _0x207cee(_0x58982c);
    if (!_0x3cee2a) {
      return {
        ok: false,
        reason: "未打开通知面板"
      };
    }
    const _0xa17095 = await _0x58982c.webContents.executeJavaScript("(() => {\n      const compact = (value) => String(value || '').replace(/\\s+/g, ' ').trim();\n      const target = compact(" + JSON.stringify(_0x1b267f.nickname || "") + ").replace(/^@+/, '').toLowerCase();\n      const FOLLOW_RE = /关注了你|开始关注你|成为了你的粉丝/;\n      const ALREADY_RE = /^(互关|已关注|已互关)$|互关|已关注|已互关/;\n      const CLICKABLE_RE = /回关|^关注$|关注对方/;\n      const visible = (el) => {\n        if (!el) return false;\n        const r = el.getBoundingClientRect();\n        const s = getComputedStyle(el);\n        return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';\n      };\n      const panels = Array.from(document.querySelectorAll(\n        '[data-e2e=\"listDlgTest-container\"], .semi-popover-content, [class*=\"Notice\"], [class*=\"notice\"]'\n      )).filter(visible);\n      const panel = panels.sort((a, b) => {\n        const ar = a.getBoundingClientRect();\n        const br = b.getBoundingClientRect();\n        return (br.width * br.height) - (ar.width * ar.height);\n      })[0];\n      if (!panel) return { ok: false, reason: '未找到通知列表' };\n\n      const rowSet = new Set();\n      panel.querySelectorAll('li, [role=\"listitem\"], .JkTB0jW1, [data-e2e*=\"notice\"], [data-e2e*=\"notification\"], [class*=\"notice-item\"], [class*=\"NoticeItem\"]')\n        .forEach((node) => {\n          const text = compact(node.innerText || node.textContent || '');\n          if (!text || !FOLLOW_RE.test(text)) return;\n          if (target && !text.toLowerCase().includes(target)) return;\n          rowSet.add(node);\n        });\n\n      let lastUserUrl = '';\n      for (const row of rowSet) {\n        const userLink = row.querySelector('a[href*=\"/user/\"]');\n        const userUrl = userLink?.href || '';\n        if (userUrl) lastUserUrl = userUrl;\n\n        const candidates = Array.from(row.querySelectorAll(\n          '[data-e2e=\"notice-follow-button\"], button, [role=\"button\"], [class*=\"Follow\"], [class*=\"follow\"]'\n        )).filter(visible);\n\n        let followBtn = candidates.find((btn) => btn.getAttribute('data-e2e') === 'notice-follow-button')\n          || candidates.find((btn) => {\n            const label = compact(btn.innerText || btn.textContent || btn.getAttribute('aria-label') || '');\n            return CLICKABLE_RE.test(label) || ALREADY_RE.test(label);\n          });\n\n        if (!followBtn) continue;\n\n        const label = compact(\n          followBtn.innerText || followBtn.textContent || followBtn.getAttribute('aria-label') || ''\n        );\n        // 已关注态：互关/已关注（排除仍显示「回关」）\n        if (ALREADY_RE.test(label) && !/回关/.test(label)) {\n          return { ok: true, alreadyFollowed: true, userUrl, label };\n        }\n\n        try { followBtn.scrollIntoView({ block: 'center', inline: 'nearest' }); } catch (_) {}\n        const r = followBtn.getBoundingClientRect();\n        if (r.width <= 0 || r.height <= 0) continue;\n\n        // 页面内点击 + 坐标，兼容图标按钮/空文案的 data-e2e 回关钮\n        try { followBtn.click(); } catch (_) {}\n        return {\n          ok: true,\n          needClick: true,\n          clickedInPage: true,\n          x: Math.round(r.left + r.width / 2),\n          y: Math.round(r.top + r.height / 2),\n          userUrl,\n          label: label || '回关',\n        };\n      }\n      return {\n        ok: false,\n        reason: rowSet.size ? '通知中未找到回关按钮' : '未找到对应的关注通知',\n        userUrl: lastUserUrl,\n      };\n    })()").catch(() => ({
      ok: false,
      reason: "读取通知列表异常"
    }));
    if (_0xa17095.userUrl && !_0x1b267f.userUrl) {
      _0x1b267f.userUrl = _0xa17095.userUrl;
    }
    if (_0xa17095.alreadyFollowed) {
      return {
        ok: true,
        alreadyFollowed: true,
        userUrl: _0xa17095.userUrl || _0x1b267f.userUrl || "",
        label: _0xa17095.label || ""
      };
    }
    if (!_0xa17095.ok || !_0xa17095.needClick) {
      return {
        ok: false,
        reason: _0xa17095.reason || "未找到回关按钮",
        userUrl: _0xa17095.userUrl || _0x1b267f.userUrl || ""
      };
    }
    if (_0xa17095.x > 0 && _0xa17095.y > 0) {
      await _0x3c3959(_0x58982c, _0xa17095.x, _0xa17095.y);
    }
    await delay(1600);
    const _0x3bb17b = await _0x58982c.webContents.executeJavaScript("(() => {\n      const compact = (value) => String(value || '').replace(/\\s+/g, ' ').trim();\n      const target = compact(" + JSON.stringify(_0x1b267f.nickname || "") + ").replace(/^@+/, '').toLowerCase();\n      const rows = Array.from(document.querySelectorAll(\n        '[data-e2e=\"notice-follow-button\"], button, [role=\"button\"], [class*=\"Follow\"], [class*=\"follow\"]'\n      ));\n      return rows.some((btn) => {\n        const row = btn.closest('li, [role=\"listitem\"], div');\n        const text = compact(row?.innerText || row?.textContent || btn.innerText || btn.textContent || '');\n        if (target && text && !text.toLowerCase().includes(target)) return false;\n        const label = compact(btn.innerText || btn.textContent || btn.getAttribute('aria-label') || '');\n        return /互关|已关注|已互关|发私信|私信/.test(label);\n      });\n    })()").catch(() => false);
    return {
      ok: !!_0x3bb17b,
      reason: _0x3bb17b ? "" : "已点击回关，未确认按钮状态变化",
      userUrl: _0xa17095.userUrl || _0x1b267f.userUrl || ""
    };
  }
  async function _0x53afeb(_0x21c08e, _0x2d5dd2) {
    if (_0x2d5dd2.userUrl) {
      return _0x2d5dd2.userUrl;
    }
    const _0x4efd4c = await _0x207cee(_0x21c08e);
    if (!_0x4efd4c) {
      return "";
    }
    const _0x55e846 = await _0x21c08e.webContents.executeJavaScript("(() => {\n      const compact = (value) => String(value || '').replace(/\\s+/g, ' ').trim();\n      const target = compact(" + JSON.stringify(_0x2d5dd2.nickname || "") + ").replace(/^@+/, '').toLowerCase();\n      const links = Array.from(document.querySelectorAll('a[href*=\"/user/\"]'));\n      for (const link of links) {\n        const row = link.closest('li, [role=\"listitem\"], div');\n        const text = compact(row?.innerText || row?.textContent || link.innerText || link.textContent || '');\n        if (target && text.toLowerCase().includes(target) && link.href) return link.href;\n      }\n      return '';\n    })()").catch(() => "");
    if (_0x55e846) {
      _0x2d5dd2.userUrl = _0x55e846;
    }
    return _0x55e846;
  }
  async function _0x3cb9d9(_0x2459aa, _0xc68af4 = 12000) {
    const _0x4d6279 = Date.now();
    const _0x38dd68 = typeof runtimeConfig?.getPlain === "function" ? runtimeConfig.getPlain() : null;
    const _0xf7bfe5 = _0x38dd68?.selectors?.["douyin.com"]?.profileMessageBtn || "[data-e2e=\"user-info-chat-btn\"], [data-e2e=\"chat-button\"], .EuZ9gjHD, .gifWSwDu, .message-button";
    const _0x319d27 = _0x38dd68?.gated?.profileReadyPattern || "抖音号|获赞|粉丝|关注|作品|喜欢|私信|发消息";
    while (Date.now() - _0x4d6279 < _0xc68af4) {
      if (_0x2459aa.isDestroyed()) {
        return false;
      }
      const _0x11dd5b = await _0x2459aa.webContents.executeJavaScript("(() => {\n        const bodyText = (document.body?.innerText || document.body?.textContent || '').trim();\n        const urlReady = /\\/user\\//.test(window.location.href);\n        let hasProfileText = false;\n        try { hasProfileText = new RegExp(" + JSON.stringify(_0x319d27) + ").test(bodyText); }\n        catch (_) { hasProfileText = /抖音号|获赞|粉丝|关注|作品|喜欢|私信|发消息/.test(bodyText); }\n        const hasMessageBtn = !!document.querySelector(" + JSON.stringify(_0xf7bfe5) + ");\n        return urlReady && (hasProfileText || hasMessageBtn);\n      })()").catch(() => false);
      if (_0x11dd5b) {
        await delay(1200);
        return true;
      }
      await delay(300);
    }
    return false;
  }
  async function _0x5a7952(_0x2aa423, _0x2187ce) {
    if (_0x2aa423.isDestroyed()) {
      return false;
    }
    const _0x52fd72 = await _0x2aa423.webContents.executeJavaScript("(() => {\n      const compact = (value) => String(value || '').replace(/\\s+/g, ' ').trim();\n      const target = compact(" + JSON.stringify(_0x2187ce || "") + ").replace(/^@+/, '').toLowerCase();\n      const panels = Array.from(document.querySelectorAll(\n        '[data-e2e=\"listDlgTest-container\"], .semi-popover-content, [class*=\"Notice\"], [class*=\"notice\"]'\n      ));\n      for (const panel of panels) {\n        const rows = Array.from(panel.querySelectorAll('li, [role=\"listitem\"], .JkTB0jW1, [data-e2e*=\"notice\"], [data-e2e*=\"notification\"]')).filter((node) => {\n          const text = compact(node.innerText || node.textContent || '');\n          return text && target && text.toLowerCase().includes(target);\n        });\n        for (const row of rows) {\n          const userLinks = Array.from(row.querySelectorAll('a[href*=\"/user/\"], a[href*=\"douyin.com/user/\"]'));\n          if (userLinks.length > 0) {\n            const avatar = userLinks[0];\n            const r = avatar.getBoundingClientRect();\n            if (r.width > 0 && r.height > 0) {\n              return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };\n            }\n          }\n        }\n      }\n      return null;\n    })()").catch(() => null);
    if (!_0x52fd72) {
      return false;
    }
    return _0x3c3959(_0x2aa423, _0x52fd72.x, _0x52fd72.y);
  }
  async function _0xb73757(_0x2577c2, _0x236ac9) {
    const _0x1f7ca1 = await _0x207cee(_0x2577c2);
    if (!_0x1f7ca1) {
      return false;
    }
    const _0x45abff = await _0x5a7952(_0x2577c2, _0x236ac9.nickname);
    if (!_0x45abff) {
      return false;
    }
    const _0x5edaea = await _0x5175fa(_0x2577c2, /\/user\//, 8000);
    if (_0x5edaea) {
      return _0x3cb9d9(_0x2577c2);
    }
    return false;
  }
  function _0x2b1f11(_0x50d1cb, _0x9bc564 = {}) {
    const _0x2765cb = _0x50d1cb?.nickname || "未知用户";
    if (_0x9bc564.blocked) {
      console.log("[SelfWarmup-DM] @" + _0x2765cb + " 私信受限已跳过：" + (_0x9bc564.reason || _0x9bc564.blockType || "平台限制"));
    } else {
      const _0xb1f5b3 = _0x9bc564.ok ? "成功" : "失败";
      console.log("[SelfWarmup-DM] @" + _0x2765cb + " 私信" + _0xb1f5b3 + "：" + (_0x9bc564.reason || "已确认送达"));
    }
    if (_0x9bc564.debug?.steps?.length) {
      _0x9bc564.debug.steps.forEach(_0x7135aa => {
        const {
          step: _0x4b4d53,
          at: _0xf2c2b7,
          ..._0x45735f
        } = _0x7135aa;
        console.log("[SelfWarmup-DM]   · " + _0x4b4d53 + (Object.keys(_0x45735f).length ? " | " + JSON.stringify(_0x45735f) : ""));
      });
    }
  }
  function _0x101717(_0x485c57, _0x220d00 = {}) {
    const {
      resultChannel: _0x36e923,
      controlChannel: _0x57cf5b,
      timeoutReason: _0x47a7fd,
      payload: _0x3be7e6,
      timeoutMs = 90000
    } = _0x220d00;
    const _0x17c68e = Date.now() + "_" + Math.random().toString(36).slice(2);
    if (!_0x485c57 || _0x485c57.isDestroyed() || _0x485c57.webContents.isDestroyed()) {
      return Promise.resolve({
        ok: false,
        reason: "自热互动窗口已销毁"
      });
    }
    const _0x2739a3 = _0x485c57.webContents;
    const _0x2a47fb = _0x2739a3.id;
    const _0x2a9793 = Date.now();
    return new Promise(_0x568cf2 => {
      let _0x263afb = false;
      const _0x2b90d1 = _0x4579de => {
        if (_0x263afb) {
          return;
        }
        _0x263afb = true;
        clearTimeout(_0x2571a7);
        ipcMain.removeListener(_0x36e923, _0x51ff72);
        _0x2739a3.removeListener("destroyed", _0x53f0ab);
        _0x568cf2(_0x4579de);
      };
      const _0x53f0ab = () => _0x2b90d1({
        ok: false,
        reason: "自热互动窗口执行中被关闭"
      });
      const _0x51ff72 = (_0x5c41c9, _0x528241 = {}) => {
        if (_0x5c41c9.sender.id !== _0x2a47fb || _0x528241.requestId !== _0x17c68e) {
          return;
        }
        const _0x48b81b = Date.now() - _0x2a9793;
        if (_0x48b81b > timeoutMs) {
          _0x2b90d1({
            ok: false,
            reason: _0x47a7fd,
            elapsedMs: _0x48b81b
          });
          return;
        }
        _0x2b90d1({
          ok: !!_0x528241.ok,
          reason: _0x528241.reason || "",
          blocked: !!_0x528241.blocked,
          blockType: _0x528241.blockType || "",
          debug: _0x528241.debug || null,
          sentText: compactText(_0x528241.sentText || ""),
          alreadyLiked: !!_0x528241.alreadyLiked,
          alreadyFollowed: !!_0x528241.alreadyFollowed,
          followStatus: _0x528241.followStatus || "",
          followed: !!_0x528241.followed,
          followRequested: !!_0x528241.followRequested,
          skipped: !!_0x528241.skipped,
          consumeRound: !!_0x528241.consumeRound,
          softVerified: !!_0x528241.softVerified,
          errorCode: _0x528241.errorCode || "",
          diagnostic: _0x528241.diagnostic || null,
          detail: _0x528241.detail || "",
          elapsedMs: _0x48b81b
        });
      };
      const _0x2571a7 = setTimeout(() => _0x2b90d1({
        ok: false,
        reason: _0x47a7fd,
        elapsedMs: Date.now() - _0x2a9793
      }), timeoutMs);
      ipcMain.on(_0x36e923, _0x51ff72);
      _0x2739a3.once("destroyed", _0x53f0ab);
      (async () => {
        try {
          await _0x18dbf4(_0x2739a3);
          if (!_0x2739a3 || _0x2739a3.isDestroyed()) {
            _0x2b90d1({
              ok: false,
              reason: "自热互动窗口已销毁"
            });
            return;
          }
          _0x2739a3.send(_0x57cf5b, {
            requestId: _0x17c68e,
            ..._0x3be7e6
          });
        } catch (_0x380d00) {
          _0x2b90d1({
            ok: false,
            reason: _0x380d00.message || "无法下发自热互动动作"
          });
        }
      })();
    });
  }
  async function _0x1273fb(_0x1ebdb0, _0x40a5d1, _0x23eb8c = {}) {
    return _0x101717(_0x1ebdb0, {
      resultChannel: "self-warmup-profile-dm-result",
      controlChannel: "self-warmup-profile-dm",
      timeoutReason: "私信操作超时",
      payload: {
        dmText: _0x40a5d1,
        nickname: _0x23eb8c.nickname || "",
        userUrl: _0x23eb8c.userUrl || _0x1ebdb0.webContents.getURL()
      }
    });
  }
  async function _0x5cb6a2(_0x571c5f, _0x5f0f6b, _0x51d16a) {
    return _0x207cc3(_0x571c5f, async () => {
      let _0x4dc636 = false;
      try {
        _0x4dc636 = await _0xb73757(_0x571c5f, _0x5f0f6b);
      } catch (_0x3e359b) {}
      if (!_0x4dc636) {
        const _0x35c7f6 = _0x5f0f6b.userUrl || (await _0x53afeb(_0x571c5f, _0x5f0f6b));
        if (!_0x35c7f6) {
          return {
            ok: false,
            reason: "缺少用户主页链接"
          };
        }
        await _0x12d98a(_0x571c5f, _0x35c7f6);
        _0x4dc636 = await _0x3cb9d9(_0x571c5f);
      }
      if (!_0x4dc636) {
        return {
          ok: false,
          reason: "用户主页未加载完成"
        };
      }
      const _0x25b98d = _0x5f0f6b.userUrl || _0x571c5f.webContents.getURL();
      console.log("[SelfWarmup-DM] 准备私信 @" + (_0x5f0f6b.nickname || "未知用户") + " | 主页=" + _0x25b98d);
      await delay(2500);
      const _0x599dfc = (Array.isArray(_0x51d16a) ? _0x51d16a : [_0x51d16a]).map(compactText).filter(Boolean);
      if (!_0x599dfc.length) {
        return {
          ok: false,
          reason: "无私信文案"
        };
      }
      let _0x1deeb1 = null;
      for (let _0x5c4a56 = 0; _0x5c4a56 < _0x599dfc.length; _0x5c4a56 += 1) {
        if (_0x5c4a56 > 0) {
          await delay(1500);
        }
        _0x1deeb1 = await _0x1273fb(_0x571c5f, _0x599dfc[_0x5c4a56], {
          nickname: _0x5f0f6b.nickname,
          userUrl: _0x25b98d
        });
        if (!_0x1deeb1?.ok && !_0x1deeb1?.skipped) {
          return _0x1deeb1;
        }
      }
      _0x2b1f11(_0x5f0f6b, _0x1deeb1);
      return _0x1deeb1;
    });
  }
  async function _0x5c8629(_0x463ef8, _0x194384 = {}) {
    await delay(1200);
    return _0x101717(_0x463ef8, {
      resultChannel: "self-warmup-profile-follow-result",
      controlChannel: "self-warmup-profile-follow",
      timeoutReason: "关注操作超时",
      payload: {
        nickname: _0x194384.nickname || "",
        userUrl: _0x194384.userUrl || _0x463ef8.webContents.getURL()
      }
    });
  }
  async function _0x3e1f7c(_0x410674, _0x223016 = {}) {
    let _0x23e3da = _0x223016.userUrl || "";
    if (!_0x23e3da) {
      try {
        _0x23e3da = await _0x53afeb(_0x410674, _0x223016);
      } catch (_0x16d6b3) {
        _0x23e3da = "";
      }
    }
    let _0x285a89 = false;
    if (_0x23e3da) {
      await _0x12d98a(_0x410674, _0x23e3da);
      _0x285a89 = await _0x3cb9d9(_0x410674);
    }
    if (!_0x285a89) {
      try {
        _0x285a89 = await _0xb73757(_0x410674, _0x223016);
      } catch (_0x38e6a1) {}
    }
    if (!_0x285a89) {
      return {
        ok: false,
        reason: _0x23e3da ? "用户主页未加载完成" : "缺少用户主页链接"
      };
    }
    const _0x520c49 = _0x223016.userUrl || _0x410674.webContents.getURL();
    if (!/\/user\//.test(_0x520c49)) {
      return {
        ok: false,
        reason: "未进入用户主页",
        userUrl: _0x520c49
      };
    }
    const _0x51b55a = await _0x5c8629(_0x410674, {
      nickname: _0x223016.nickname,
      userUrl: _0x520c49
    });
    const _0x22e78b = !!_0x51b55a.followed || !!_0x51b55a.alreadyFollowed;
    const _0x45b788 = !!_0x51b55a.followRequested || _0x51b55a.followStatus === "requested";
    if (_0x22e78b || _0x45b788) {
      return {
        ok: true,
        alreadyFollowed: !!_0x51b55a.alreadyFollowed,
        followStatus: _0x51b55a.followStatus || (_0x22e78b ? "success" : "requested"),
        followed: _0x22e78b,
        followRequested: _0x45b788 && !_0x22e78b,
        reason: "",
        userUrl: _0x520c49
      };
    }
    return {
      ok: false,
      reason: _0x51b55a.reason || "主页关注失败",
      followStatus: _0x51b55a.followStatus || "",
      errorCode: _0x51b55a.errorCode || "",
      userUrl: _0x520c49
    };
  }
  async function _0x5175fa(_0x3c12a2, _0x424253, _0x460c2d = 8000) {
    const _0x49e72e = Date.now();
    while (Date.now() - _0x49e72e < _0x460c2d) {
      if (_0x3c12a2.isDestroyed()) {
        return false;
      }
      const _0xdb5be2 = _0x3c12a2.webContents.getURL();
      if (_0x424253.test(_0xdb5be2)) {
        return true;
      }
      await delay(200);
    }
    return false;
  }
  async function _0x311147(_0x207cbb, _0x246fea = 35000) {
    const _0x5455e2 = Date.now();
    while (Date.now() - _0x5455e2 < _0x246fea) {
      if (_0x207cbb.isDestroyed()) {
        return false;
      }
      if (isSelfWarmupVideoPageUrl(_0x207cbb.webContents.getURL())) {
        return true;
      }
      const _0x381325 = await _0x207cbb.webContents.executeJavaScript("(() => {\n        const visible = (el) => {\n          if (!el) return false;\n          const rect = el.getBoundingClientRect();\n          const style = getComputedStyle(el);\n          return rect.width > 0 && rect.height > 0\n            && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';\n        };\n        const commentSurface = Array.from(document.querySelectorAll(\n          '[data-e2e=\"comment-panel\"], [data-e2e=\"comment-list\"], .comment-mainContent, '\n          + '[data-e2e=\"comment-input\"], [class*=\"comment-mainContent\"]'\n        )).find(visible);\n        if (!commentSurface) return false;\n        const hasVideo = Array.from(document.querySelectorAll('video')).some(visible);\n        const hasCommentContent = !!document.querySelector(\n          '[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], .public-DraftEditor-content'\n        );\n        return hasVideo || hasCommentContent;\n      })()").catch(() => false);
      if (_0x381325) {
        return true;
      }
      await delay(200);
    }
    return false;
  }
  async function _0xd4f699(_0x59fcd0, {
    timeoutMs = 12000,
    noEffectMs = 4000
  } = {}) {
    if (!_0x59fcd0 || _0x59fcd0.isDestroyed()) {
      return {
        ok: false,
        reason: "窗口已销毁",
        early: true
      };
    }
    const _0x189bdc = String(_0x59fcd0.webContents.getURL() || "");
    const _0x32cebc = Date.now();
    while (Date.now() - _0x32cebc < timeoutMs) {
      if (_0x59fcd0.isDestroyed()) {
        return {
          ok: false,
          reason: "窗口已销毁",
          early: true
        };
      }
      const _0x2d33e9 = String(_0x59fcd0.webContents.getURL() || "");
      if (isSelfWarmupVideoPageUrl(_0x2d33e9)) {
        return {
          ok: true,
          reason: "url"
        };
      }
      if (/\/user\//.test(_0x2d33e9) && !isSelfWarmupVideoPageUrl(_0x2d33e9)) {
        return {
          ok: false,
          reason: "点击后跳到了用户主页而非视频",
          early: true
        };
      }
      const _0x122f45 = await _0x59fcd0.webContents.executeJavaScript("(() => {\n        const visible = (el) => {\n          if (!el) return false;\n          const rect = el.getBoundingClientRect();\n          const style = getComputedStyle(el);\n          return rect.width > 0 && rect.height > 0\n            && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';\n        };\n        const commentSurface = Array.from(document.querySelectorAll(\n          '[data-e2e=\"comment-panel\"], [data-e2e=\"comment-list\"], .comment-mainContent, '\n          + '[data-e2e=\"comment-input\"], [class*=\"comment-mainContent\"]'\n        )).find(visible);\n        const hasVideo = Array.from(document.querySelectorAll('video')).some(visible);\n        const hasCommentContent = !!document.querySelector(\n          '[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], .public-DraftEditor-content'\n        );\n        const videoReady = !!(commentSurface && (hasVideo || hasCommentContent));\n        const EVENT_RE = /(评论了你的|回复了你|关注了你|赞了你的|点赞|提到了你)/;\n        const panelSelectors = [\n          '[data-e2e=\"listDlgTest-container\"]',\n          '[data-e2e*=\"notice\"]',\n          '[data-e2e*=\"notification\"]',\n          '.semi-popover-content',\n          '[class*=\"Notice\"]',\n          '[role=\"dialog\"]',\n        ].join(',');\n        const noticeStillOpen = Array.from(document.querySelectorAll(panelSelectors)).some((el) => {\n          if (!visible(el)) return false;\n          if (el.closest('#imSaasContainerId, [data-e2e=\"im-dialog\"]')) return false;\n          const r = el.getBoundingClientRect();\n          const text = String(el.innerText || '').slice(0, 400);\n          return r.width >= 180 && r.height >= 60\n            && (EVENT_RE.test(text) || /通知|互动|评论|全部消息/.test(text));\n        });\n        return {\n          videoReady,\n          noticeStillOpen,\n          path: location.pathname || '',\n        };\n      })()").catch(() => ({
        videoReady: false,
        noticeStillOpen: false,
        path: ""
      }));
      if (_0x122f45.videoReady) {
        return {
          ok: true,
          reason: "dom"
        };
      }
      const _0x3e3c91 = Date.now() - _0x32cebc;
      const _0x1d5dbb = _0x2d33e9 !== _0x189bdc;
      if (_0x3e3c91 >= noEffectMs) {
        if (!_0x1d5dbb && _0x122f45.noticeStillOpen) {
          return {
            ok: false,
            reason: "点击未触发跳转（通知面板仍在）",
            early: true
          };
        }
        if (_0x1d5dbb && !_0x122f45.videoReady && !_0x122f45.noticeStillOpen && !isSelfWarmupVideoPageUrl(_0x2d33e9)) {
          return {
            ok: false,
            reason: "点击后页面异常：" + compactText(_0x2d33e9).slice(0, 90),
            early: true
          };
        }
      }
      await delay(200);
    }
    return {
      ok: false,
      reason: "等待视频页超时",
      early: false
    };
  }
  async function _0x45bdfc(_0x13bf77, _0x4c99e7, _0x1b9c51) {
    if (_0x4c99e7._selfWarmupCommentPageReady) {
      const _0x3b084a = await _0x311147(_0x13bf77, 1200);
      if (_0x3b084a) {
        return true;
      }
      _0x4c99e7._selfWarmupCommentPageReady = false;
    }
    const _0x5446a0 = () => {
      _0x4c99e7._selfWarmupNavFailed = true;
      return false;
    };
    const _0xce3c2f = _0x4c99e7.commentId || _0x4c99e7.cid || _0x4c99e7.comment_id || "";
    let _0x48388c = _0x4c99e7.videoUrl ? resolveSelfWarmupVideoUrl(_0x4c99e7.videoUrl, _0xce3c2f || _0x4c99e7.commentId) : "";
    if (_0x1b9c51) {
      _0x16891a(_0x1b9c51, "正在定位 @" + (_0x4c99e7.nickname || "用户") + " 的评论通知卡片 (相关文本: \"" + compactText(_0x4c99e7.text).slice(0, 15) + "\")...", "info");
    }
    const _0x20f557 = await _0x207cee(_0x13bf77, _0x1b9c51);
    if (_0x20f557) {
      const _0x49aa70 = compactText(_0x4c99e7.text || "");
      const _0x471329 = async () => _0x13bf77.webContents.executeJavaScript("(async () => {\n        const EVENT_RE = /(评论了你的(?:作品|视频|评论|动态)?|回复了你|回复了你的评论|关注了你|开始关注你|赞了你的(?:作品|视频|评论|动态)?|点赞|喜欢了你的|提到了你|@了你)/;\n        const compact = (value) => String(value || '')\n          .replace(/[\\u200b-\\u200f\\u202a-\\u202e\\u2060-\\u206f]/g, '')\n          .replace(/\\s+/g, ' ')\n          .trim();\n        const targetNick = compact(" + JSON.stringify(_0x4c99e7.nickname || "") + ").replace(/^@+/, '').toLowerCase();\n        const rawText = compact(" + JSON.stringify(_0x49aa70) + ").toLowerCase();\n        const rawRowText = compact(" + JSON.stringify(_0x4c99e7.notificationRowText || "") + ").toLowerCase();\n        const visible = (el) => {\n          if (!el) return false;\n          const r = el.getBoundingClientRect();\n          const s = getComputedStyle(el);\n          return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';\n        };\n\n        const extractVideoUrlFromNode = (el) => {\n          if (!el) return '';\n          const videoLink = el.querySelector?.('a[href*=\"modal_id\"], a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"detail\"], [data-href*=\"modal_id\"], [data-href*=\"/video/\"]');\n          const rawUrl = videoLink?.href || videoLink?.getAttribute?.('data-href') || (el.tagName === 'A' ? el.href : '');\n          if (rawUrl) return rawUrl;\n\n          const nodesToInspect = [el];\n          try {\n            if (el.querySelectorAll) {\n              const children = Array.from(el.querySelectorAll('*'));\n              if (children.length < 60) nodesToInspect.push(...children);\n            }\n          } catch (_) {}\n\n          for (const node of nodesToInspect) {\n            try {\n              const keys = Object.keys(node);\n              const reactKey = keys.find((k) => k.startsWith('__reactProps') || k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance'));\n              if (!reactKey) continue;\n              const root = node[reactKey];\n\n              const visited = new Set();\n              const searchObj = (obj, depth = 0) => {\n                if (!obj || depth > 8) return '';\n                if (typeof obj === 'string') {\n                  const modalMatch = obj.match(/modal_id=(\\d+)/);\n                  if (modalMatch && modalMatch[1]) return 'https://www.douyin.com/jingxuan?modal_id=' + modalMatch[1];\n                  const videoMatch = obj.match(/\\/video\\/(\\d+)/);\n                  if (videoMatch && videoMatch[1]) return 'https://www.douyin.com/video/' + videoMatch[1];\n                  const groupMatch = obj.match(/group_id=(\\d+)/);\n                  if (groupMatch && groupMatch[1]) return 'https://www.douyin.com/jingxuan?modal_id=' + groupMatch[1];\n                  return '';\n                }\n                if (typeof obj !== 'object') return '';\n                if (visited.has(obj)) return '';\n                visited.add(obj);\n\n                const modalId = obj.modal_id || obj.modalId || obj.group_id || obj.groupId || obj.aweme_id || obj.awemeId || obj.item_id || obj.itemId || obj.gid || obj.videoId;\n                if (modalId && /^\\d{15,}$/.test(String(modalId))) {\n                  return 'https://www.douyin.com/jingxuan?modal_id=' + modalId;\n                }\n\n                if (typeof obj.schema === 'string') {\n                  const res = searchObj(obj.schema, depth + 1);\n                  if (res) return res;\n                }\n                if (typeof obj.url === 'string') {\n                  const res = searchObj(obj.url, depth + 1);\n                  if (res) return res;\n                }\n                if (typeof obj.link_url === 'string') {\n                  const res = searchObj(obj.link_url, depth + 1);\n                  if (res) return res;\n                }\n\n                const keysToSearch = ['memoizedProps', 'pendingProps', 'item', 'data', 'notice', 'content', 'payload', 'target', 'aweme', 'aweme_info', 'awemeInfo', 'params', 'extra', 'group'];\n                for (const k of keysToSearch) {\n                  if (obj[k]) {\n                    const res = searchObj(obj[k], depth + 1);\n                    if (res) return res;\n                  }\n                }\n                return '';\n              };\n\n              const found = searchObj(root);\n              if (found) return found;\n            } catch (_) {\n              // 继续检查卡片内的其他 React 节点\n            }\n          }\n          return '';\n        };\n\n        const extractCommentIdFromNode = (el) => {\n          if (!el) return '';\n          const nodesToInspect = [el];\n          try {\n            if (el.querySelectorAll) {\n              const children = Array.from(el.querySelectorAll('*'));\n              if (children.length < 60) nodesToInspect.push(...children);\n            }\n          } catch (_) {}\n          for (const node of nodesToInspect) {\n            try {\n              const keys = Object.keys(node);\n              const reactKey = keys.find((k) => k.startsWith('__reactProps') || k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance'));\n              if (!reactKey) continue;\n              const root = node[reactKey];\n              const visited = new Set();\n              const searchCid = (obj, depth = 0) => {\n                if (!obj || depth > 8 || typeof obj !== 'object') return '';\n                if (visited.has(obj)) return '';\n                visited.add(obj);\n                const cid = obj.cid || obj.comment_id || obj.commentId || obj.comment?.cid;\n                if (cid && /^\\d{10,}$/.test(String(cid))) return String(cid);\n                const keysToSearch = ['memoizedProps', 'pendingProps', 'item', 'data', 'notice', 'content', 'comment', 'payload', 'extra'];\n                for (const k of keysToSearch) {\n                  if (obj[k]) {\n                    const res = searchCid(obj[k], depth + 1);\n                    if (res) return res;\n                  }\n                }\n                return '';\n              };\n              const found = searchCid(root);\n              if (found) return found;\n            } catch (_) {}\n          }\n          return '';\n        };\n\n        const panelSelectors = [\n          '[data-e2e=\"listDlgTest-container\"]',\n          '[data-e2e*=\"notice\"]',\n          '[data-e2e*=\"notification\"]',\n          '.semi-popover-content',\n          '[class*=\"Popover\"]',\n          '[class*=\"popover\"]',\n          '[class*=\"Notice\"]',\n          '[class*=\"notice\"]',\n          '[role=\"dialog\"]'\n        ].join(',');\n        const rowSelector = [\n          '.JkTB0jW1',\n          '[role=\"listitem\"]',\n          'li',\n          '[data-e2e*=\"notice\"]',\n          '[data-e2e*=\"notification\"]'\n        ].join(',');\n        const deriveNotificationRows = (panelEl) => {\n          const rows = new Set();\n          panelEl.querySelectorAll(\n            '[data-e2e=\"user-name-card\"], a[href*=\"/user/\"], pre'\n          ).forEach((anchor) => {\n            let node = anchor;\n            while (node && node !== panelEl) {\n              if (visible(node)) {\n                const r = node.getBoundingClientRect();\n                const text = compact(node.innerText || node.textContent || '');\n                if (\n                  r.width >= 160\n                  && r.height >= 28\n                  && r.height < 360\n                  && EVENT_RE.test(text)\n                ) {\n                  rows.add(node);\n                  break;\n                }\n              }\n              node = node.parentElement;\n            }\n          });\n          return Array.from(rows);\n        };\n        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));\n        const listPanelCandidates = () => Array.from(document.querySelectorAll(panelSelectors))\n          .filter(visible)\n          .filter((el) => !(\n            el.matches('#imSaasContainerId, [data-e2e=\"im-dialog\"]')\n            || el.closest('#imSaasContainerId, [data-e2e=\"im-dialog\"]')\n            || el.querySelector('#imSaasContainerId, [data-e2e=\"im-dialog\"]')\n          ))\n          .map((el) => {\n            const r = el.getBoundingClientRect();\n            const text = compact(el.innerText || el.textContent || '');\n            const explicitRows = Array.from(el.querySelectorAll(rowSelector)).filter((row) => {\n              if (row === el || !visible(row)) return false;\n              const rr = row.getBoundingClientRect();\n              const rowText = compact(row.innerText || row.textContent || '');\n              return rr.width >= 160 && rr.height >= 28 && rr.height < 360 && EVENT_RE.test(rowText);\n            });\n            const rows = [...new Set([...explicitRows, ...deriveNotificationRows(el)])];\n            return {\n              el,\n              r,\n              text,\n              rowCount: rows.length,\n              exact: el.matches('[data-e2e=\"listDlgTest-container\"], .semi-popover-content') ? 1 : 0,\n            };\n          });\n        // 抖音会先挂载通知弹层空壳，再异步渲染通知行。仅等待弹层出现会把\n        // “互动消息 / 全部消息”的空壳误判为最终状态，实测通知行可能晚 2~3 秒。\n        let panelCandidates = [];\n        for (let renderAttempt = 0; renderAttempt < 16; renderAttempt += 1) {\n          panelCandidates = listPanelCandidates();\n          if (panelCandidates.some(({ rowCount }) => rowCount > 0)) break;\n          await sleep(250);\n        }\n        const panels = panelCandidates.filter(({ r, text, rowCount }) =>\n            r.width >= 180\n            && r.height >= 60\n            && rowCount > 0\n            && (EVENT_RE.test(text) || /通知|互动|评论|回复|赞了你|点赞|关注|全部消息/.test(text))\n          )\n          .sort((a, b) =>\n            (b.exact - a.exact)\n            || (b.rowCount - a.rowCount)\n            || (b.r.height - a.r.height)\n            || (b.r.left - a.r.left)\n          );\n        const panelInfo = panels[0] || null;\n        const panel = panelInfo?.el || null;\n        if (!panel) {\n          return {\n            found: false,\n            reason: '未识别到包含互动通知行的弹层',\n            panelCandidateCount: Array.from(document.querySelectorAll(panelSelectors)).filter(visible).length,\n            panelDiagnostics: panelCandidates.slice(0, 6).map(({ el, r, text, rowCount, exact }) => ({\n              tag: el.tagName || 'DIV',\n              className: (el.className || '').toString().slice(0, 80),\n              dataE2e: el.getAttribute?.('data-e2e') || '',\n              width: Math.round(r.width),\n              height: Math.round(r.height),\n              rowCount,\n              exact,\n              eventMatched: EVENT_RE.test(text),\n              text: text.slice(0, 100),\n            })),\n          };\n        }\n\n        const scrollables = [panel, ...Array.from(panel.querySelectorAll('*'))]\n          .filter((el) => {\n            if (!visible(el)) return false;\n            const r = el.getBoundingClientRect();\n            return r.width >= 160\n              && r.height >= 80\n              && el.scrollHeight > el.clientHeight + 16;\n          })\n          .sort((a, b) => {\n            const ar = a.getBoundingClientRect();\n            const br = b.getBoundingClientRect();\n            return (br.width * br.height) - (ar.width * ar.height);\n          });\n        const scrollable = scrollables[0] || null;\n\n        if (scrollable) {\n          scrollable.scrollTop = 0;\n          try { scrollable.dispatchEvent(new Event('scroll', { bubbles: true })); } catch (_) {}\n          await sleep(220);\n        }\n\n        let targetRow = null;\n        let attemptCount = 0;\n        let bestScore = 0;\n        let lastCandidateDebug = [];\n\n        const collectRowCandidates = () => {\n          const rowSet = new Set();\n          const addRow = (row) => {\n            if (!row || row === panel || !panel.contains(row) || !visible(row)) return;\n            const r = row.getBoundingClientRect();\n            if (r.width < 160 || r.height < 28 || r.height >= 360) return;\n            const text = compact(row.innerText || row.textContent || '').toLowerCase();\n            if (!text || !EVENT_RE.test(text)) return;\n            rowSet.add(row);\n          };\n\n          panel.querySelectorAll(rowSelector).forEach(addRow);\n          panel.querySelectorAll(\n            '[data-e2e=\"user-name-card\"], a[href*=\"/user/\"], pre, span, div'\n          ).forEach((node) => {\n            const text = compact(node.innerText || node.textContent || '').replace(/^@+/, '').toLowerCase();\n            const snippet = rawText.slice(0, Math.min(24, rawText.length));\n            if (!text) return;\n            if (!(targetNick && text.includes(targetNick)) && !(snippet && text.includes(snippet))) return;\n            let current = node;\n            while (current && current !== panel) {\n              const currentText = compact(current.innerText || current.textContent || '').toLowerCase();\n              const r = current.getBoundingClientRect();\n              if (\n                r.width >= 160\n                && r.height >= 28\n                && r.height < 360\n                && EVENT_RE.test(currentText)\n                && (!targetNick || currentText.includes(targetNick))\n              ) {\n                addRow(current);\n                break;\n              }\n              current = current.parentElement;\n            }\n          });\n\n          return Array.from(rowSet).map((row) => {\n            const r = row.getBoundingClientRect();\n            const rowText = compact(row.innerText || row.textContent || '').toLowerCase();\n            const userTexts = Array.from(row.querySelectorAll(\n              '[data-e2e=\"user-name-card\"], a[href*=\"/user/\"], [class*=\"name\"], [class*=\"Name\"]'\n            )).map((el) => compact(el.innerText || el.textContent || '').replace(/^@+/, '').toLowerCase());\n            const preTexts = Array.from(row.querySelectorAll('pre'))\n              .map((el) => compact(el.innerText || el.textContent || '').toLowerCase())\n              .filter(Boolean);\n            const snippet = rawText.slice(0, Math.min(24, rawText.length));\n            const rowSnippet = rawRowText.slice(0, Math.min(42, rawRowText.length));\n            let score = 0;\n            if (targetNick && userTexts.some((text) => text === targetNick)) score += 120;\n            else if (targetNick && rowText.includes(targetNick)) score += 70;\n            if (rawText && preTexts.some((text) => text === rawText)) score += 160;\n            else if (snippet && preTexts.some((text) => text.includes(snippet) || snippet.includes(text))) score += 110;\n            else if (snippet && rowText.includes(snippet)) score += 80;\n            if (rawRowText && rowText === rawRowText) score += 220;\n            else if (rowSnippet && rowText.includes(rowSnippet)) score += 130;\n            if (/评论了你的|回复了你|回复了你的评论/.test(rowText)) score += 25;\n            return { row, score, area: r.width * r.height };\n          }).filter(({ score }) => score > 0);\n        };\n\n        for (let attempt = 0; attempt < 10; attempt++) {\n          attemptCount = attempt + 1;\n          const rowCandidates = collectRowCandidates();\n          lastCandidateDebug = rowCandidates.slice(0, 8).map(({ row, score }) => ({\n            score,\n            text: compact(row.innerText || row.textContent || '').slice(0, 120),\n            className: (row.className || '').toString().slice(0, 60),\n          }));\n          rowCandidates.sort((a, b) => b.score - a.score || a.area - b.area);\n          targetRow = rowCandidates[0]?.row || null;\n          bestScore = rowCandidates[0]?.score || 0;\n\n          if (targetRow) break;\n\n          if (!scrollable) break;\n          const previousTop = scrollable.scrollTop;\n          const nextTop = Math.min(\n            scrollable.scrollHeight - scrollable.clientHeight,\n            previousTop + Math.max(220, Math.round(scrollable.clientHeight * 0.72)),\n          );\n          if (nextTop <= previousTop) break;\n          scrollable.scrollTop = nextTop;\n          try { scrollable.dispatchEvent(new Event('scroll', { bubbles: true })); } catch (_) {}\n          await sleep(300);\n          if (scrollable.scrollTop <= previousTop) {\n            break;\n          }\n        }\n\n        if (!targetRow) {\n          return {\n            found: false,\n            reason: '弹层已打开，但遍历可见通知行后未匹配目标',\n            attempts: attemptCount,\n            panelTag: panel.tagName || 'DIV',\n            panelClass: (panel.className || '').toString().slice(0, 80),\n            panelRows: panelInfo?.rowCount || 0,\n            panelText: compact(panel.innerText || panel.textContent || '').slice(0, 120),\n            scrollTop: scrollable?.scrollTop || 0,\n            scrollHeight: scrollable?.scrollHeight || 0,\n            clientHeight: scrollable?.clientHeight || 0,\n            targetNick,\n            rawText: rawText.slice(0, 80),\n            rawRowText: rawRowText.slice(0, 120),\n            candidates: lastCandidateDebug,\n          };\n        }\n\n        // 强行将目标通知卡片居中滚动到视口中央\n        try {\n          if (typeof targetRow.scrollIntoView === 'function') {\n            targetRow.scrollIntoView({ block: 'center', behavior: 'instant' });\n            await sleep(150);\n          }\n        } catch (_) {}\n\n        // 三层精准寻找评论正文 preview 节点\n        const visiblePreviews = Array.from(targetRow.querySelectorAll('pre')).filter(visible);\n        let commentEl = visiblePreviews\n          .map((el) => {\n            const text = compact(el.innerText || el.textContent || '').toLowerCase();\n            const snippet = rawText.slice(0, Math.min(24, rawText.length));\n            let score = 0;\n            if (rawText && text === rawText) score += 100;\n            else if (snippet && (text.includes(snippet) || snippet.includes(text))) score += 60;\n            return { el, score, length: text.length };\n          })\n          .sort((a, b) => b.score - a.score || a.length - b.length)[0]?.el || null;\n\n        if (!commentEl && rawText && rawText.length >= 2) {\n          const snippet = compact(rawText).slice(0, 10).toLowerCase();\n          const matches = Array.from(targetRow.querySelectorAll('*')).filter((el) => {\n            if (!visible(el) || el.children.length > 2) return false;\n            if (el.closest('a[href*=\"/user/\"], [data-e2e=\"user-name-card\"], [class*=\"avatar\"], [class*=\"Avatar\"], [class*=\"name\"], [class*=\"Name\"]')) return false;\n            const txt = compact(el.innerText || el.textContent || '').toLowerCase();\n            return txt && txt.includes(snippet);\n          });\n          if (matches.length > 0) {\n            matches.sort((a, b) => a.innerText.length - b.innerText.length);\n            commentEl = matches[0];\n          }\n        }\n\n        if (!commentEl) {\n          const contentClassEls = Array.from(targetRow.querySelectorAll('pre, [class*=\"content\"], [class*=\"Content\"], [class*=\"desc\"], [class*=\"Desc\"], [class*=\"comment\"], [class*=\"Comment\"], [class*=\"text\"], [class*=\"Text\"]'))\n            .filter((el) => {\n              if (!visible(el)) return false;\n              if (el.closest('a[href*=\"/user/\"], [data-e2e=\"user-name-card\"], [class*=\"avatar\"], [class*=\"Avatar\"], [class*=\"name\"], [class*=\"Name\"], [class*=\"time\"], [class*=\"Time\"]')) return false;\n              const txt = compact(el.innerText || el.textContent || '');\n              if (!txt || txt === targetNick) return false;\n              if (/^(?:评论了你的(?:作品|视频|评论|动态)?|回复了你|回复了你的评论|关注了你|赞了你的评论|赞了你的作品|点赞了你的评论|刚刚|d+.*前|昨天|前天)$/.test(txt)) return false;\n              return true;\n            });\n          if (contentClassEls.length > 0) {\n            commentEl = contentClassEls[0];\n          }\n        }\n\n        commentEl = commentEl || targetRow;\n\n        const r = commentEl.getBoundingClientRect();\n        const rowR = targetRow.getBoundingClientRect();\n        const extractedUrl = extractVideoUrlFromNode(targetRow);\n        const extractedCid = extractCommentIdFromNode(targetRow);\n\n        return {\n          found: true,\n          attempts: attemptCount,\n          score: bestScore,\n          matchedTag: commentEl.tagName || 'DIV',\n          matchedClass: (commentEl.className || '').toString().slice(0, 40),\n          matchedText: compact(commentEl.innerText || commentEl.textContent || '').slice(0, 30),\n          rowText: compact(targetRow.innerText || targetRow.textContent || '').slice(0, 40),\n          x: r.width > 0 ? Math.round(r.left + r.width / 2) : Math.round(rowR.left + rowR.width * 0.5),\n          y: r.height > 0 ? Math.round(r.top + r.height / 2) : Math.round(rowR.top + rowR.height / 2),\n          rowX: Math.round(rowR.left + rowR.width * 0.6),\n          rowY: Math.round(rowR.top + rowR.height / 2),\n          videoUrl: extractedUrl || '',\n          commentId: extractedCid || '',\n        };\n      })()").catch(_0x11bd57 => {
        if (_0x1b9c51) {
          _0x16891a(_0x1b9c51, "评论通知定位脚本异常：" + (_0x11bd57?.message || _0x11bd57), "warning");
        }
        return null;
      });
      const _0xaa92bc = (_0x787311, {
        silent = false
      } = {}) => {
        if (_0x787311?.commentId && !_0x4c99e7.commentId && !_0x4c99e7.cid) {
          _0x4c99e7.commentId = String(_0x787311.commentId);
          _0x4c99e7.cid = String(_0x787311.commentId);
        }
        if (!_0x787311?.videoUrl) {
          return;
        }
        const _0x2e5158 = resolveSelfWarmupVideoUrl(_0x787311.videoUrl, _0x4c99e7.commentId || _0x4c99e7.cid || _0xce3c2f);
        _0x4c99e7.videoUrl = _0x2e5158;
        _0x48388c = _0x2e5158;
        if (_0x1b9c51 && !silent) {
          _0x16891a(_0x1b9c51, "已从通知卡片提取到视频 URL: " + _0x2e5158, "info");
        }
      };
      const _0x3175c6 = () => {
        const _0x718356 = _0x13bf77.webContents.getURL();
        if (isSelfWarmupVideoPageUrl(_0x718356)) {
          _0x4c99e7.videoUrl = resolveSelfWarmupVideoUrl(_0x718356, _0xce3c2f);
        }
        _0x4c99e7._selfWarmupCommentPageReady = true;
      };
      const _0x41d835 = async (_0x34b929, {
        useRow = false,
        label = "评论正文"
      } = {}) => {
        const _0x3c8d2a = useRow ? _0x34b929.rowX : _0x34b929.x;
        const _0x217e86 = useRow ? _0x34b929.rowY : _0x34b929.y;
        if (_0x1b9c51) {
          _0x16891a(_0x1b9c51, "点击通知卡片" + label + "坐标 (" + _0x3c8d2a + ", " + _0x217e86 + ")，等待进入视频页…", "info");
        }
        await _0x3c3959(_0x13bf77, _0x3c8d2a, _0x217e86);
        await _0x13bf77.webContents.executeJavaScript("(() => {\n          const x = " + JSON.stringify(_0x3c8d2a) + ";\n          const y = " + JSON.stringify(_0x217e86) + ";\n          const el = document.elementFromPoint(x, y);\n          if (!el) return false;\n          const init = { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y };\n          ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach((type) => {\n            try { el.dispatchEvent(new MouseEvent(type, init)); } catch (_) {}\n          });\n          try { el.click(); } catch (_) {}\n          return true;\n        })()").catch(() => false);
        const _0x160cdb = await _0xd4f699(_0x13bf77, {
          timeoutMs: 12000,
          noEffectMs: 4000
        });
        if (_0x160cdb.ok) {
          _0x3175c6();
          if (_0x1b9c51) {
            _0x16891a(_0x1b9c51, "已通过点击" + label + "成功进入视频页: " + _0x13bf77.webContents.getURL(), "info");
          }
          return true;
        }
        if (_0x1b9c51) {
          _0x16891a(_0x1b9c51, "@" + _0x4c99e7.nickname + " 点击" + label + "未进视频：" + (_0x160cdb.reason || "未知") + (_0x160cdb.early ? "（已提前结束等待）" : ""), "warning");
        }
        return false;
      };
      let _0x323fde = await _0x471329();
      if (_0x323fde?.found) {
        _0xaa92bc(_0x323fde, {
          silent: true
        });
        if (_0x1b9c51) {
          _0x16891a(_0x1b9c51, "找到 @" + _0x4c99e7.nickname + " 通知卡片 (下翻第 " + (_0x323fde.attempts || 1) + " 次) <" + _0x323fde.matchedTag + "." + _0x323fde.matchedClass + "> \"" + (_0x323fde.matchedText || _0x323fde.rowText) + "\"，准备点击评论内容坐标 (" + _0x323fde.x + ", " + _0x323fde.y + ")", "info");
        }
        if (await _0x41d835(_0x323fde, {
          useRow: false,
          label: "评论正文"
        })) {
          return true;
        }
        if (_0x1b9c51) {
          _0x16891a(_0x1b9c51, "@" + _0x4c99e7.nickname + " 正文点击未进视频，重新定位通知卡片后再点右侧区域…", "info");
        }
        await _0x207cee(_0x13bf77, _0x1b9c51);
        _0x323fde = await _0x471329();
        if (_0x323fde?.found) {
          _0xaa92bc(_0x323fde);
          if (_0x1b9c51) {
            _0x16891a(_0x1b9c51, "重新找到 @" + _0x4c99e7.nickname + " 通知卡片 (下翻第 " + (_0x323fde.attempts || 1) + " 次)，准备点击右侧 (" + _0x323fde.rowX + ", " + _0x323fde.rowY + ")", "info");
          }
          if (await _0x41d835(_0x323fde, {
            useRow: true,
            label: "卡片右侧"
          })) {
            return true;
          }
          if (_0x323fde.videoUrl) {
            const _0x5afda2 = resolveSelfWarmupVideoUrl(_0x323fde.videoUrl, _0xce3c2f);
            _0x4c99e7.videoUrl = _0x5afda2;
            if (_0x1b9c51) {
              _0x16891a(_0x1b9c51, "卡片点击未唤起弹窗，自动切换 safeLoadURL 直达视频页: " + _0x5afda2, "info");
            }
            await _0x12d98a(_0x13bf77, _0x5afda2);
            const _0x19d1f3 = await _0x311147(_0x13bf77, 20000);
            _0x4c99e7._selfWarmupCommentPageReady = _0x19d1f3;
            return _0x19d1f3 || _0x5446a0();
          }
        } else if (_0x1b9c51) {
          _0x16891a(_0x1b9c51, "@" + _0x4c99e7.nickname + " 重新定位通知卡片失败，准备走 URL 兜底", "warning");
        }
      } else if (_0x1b9c51) {
        const _0x3dea7e = _0x323fde ? "（" + (_0x323fde.reason || "未知原因") + "；候选弹层 " + (_0x323fde.panelCandidateCount ?? 1) + "；通知行 " + (_0x323fde.panelRows ?? 0) + "；滚动 " + (_0x323fde.scrollTop ?? 0) + "/" + (_0x323fde.scrollHeight ?? 0) + "）" : "";
        _0x16891a(_0x1b9c51, "通知弹层中未查找到 @" + _0x4c99e7.nickname + " 的卡片节点" + _0x3dea7e, "warning");
      }
    }
    if (_0x48388c) {
      const _0x3dcb4a = _0x48388c;
      _0x4c99e7.videoUrl = _0x3dcb4a;
      if (_0x1b9c51) {
        _0x16891a(_0x1b9c51, "通知卡片点击未能打开视频，使用已记录的视频 URL 兜底直达: " + _0x3dcb4a, "info");
      }
      await _0x12d98a(_0x13bf77, _0x3dcb4a);
      const _0x1848b5 = await _0x311147(_0x13bf77, 40000);
      _0x4c99e7._selfWarmupCommentPageReady = _0x1848b5;
      return _0x1848b5 || _0x5446a0();
    }
    return _0x5446a0();
  }
  async function _0x479773(_0x4b3a24, _0x419857, _0x3c64d6) {
    if (!_0x4b3a24 || _0x4b3a24.isDestroyed()) {
      return false;
    }
    if (_0x3c64d6?._selfWarmupCommentSettled) {
      return true;
    }
    const _0x2d5951 = compactText(_0x3c64d6?.nickname || "");
    const _0x1ea4ea = String(_0x3c64d6?.commentId || _0x3c64d6?.cid || _0x3c64d6?.comment_id || "").trim();
    const _0x18119f = !!_0x3c64d6?._selfWarmupUsedApiNav;
    const _0x284017 = _0x18119f ? 16000 : 40000;
    const _0x217d78 = () => {
      if (_0x3c64d6) {
        _0x3c64d6._selfWarmupCommentSettled = true;
      }
      return true;
    };
    if (_0x419857) {
      _0x16891a(_0x419857, _0x18119f ? "@" + (_0x2d5951 || "用户") + " 已直达视频页，等待评论列表 API / 节点（最长约 " + Math.round(_0x284017 / 1000) + " 秒）…" : "@" + (_0x2d5951 || "用户") + " 已进入视频页，等待评论区与自动定位稳定（最长约 40 秒）…", "info");
    }
    const _0x1c673e = Date.now();
    let _0x5cfe30 = 0;
    let _0x5f26da = 0;
    while (Date.now() - _0x1c673e < _0x284017) {
      if (_0x4b3a24.isDestroyed()) {
        return false;
      }
      const _0x381c0b = await _0x4b3a24.webContents.executeJavaScript("(() => {\n        const visible = (el) => {\n          if (!el) return false;\n          const r = el.getBoundingClientRect();\n          const s = getComputedStyle(el);\n          return r.width > 0 && r.height > 0\n            && s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';\n        };\n        const panel = document.querySelector(\n          '[data-e2e=\"comment-panel\"], [data-e2e=\"comment-list\"], .comment-mainContent, [class*=\"comment-mainContent\"]'\n        );\n        const items = Array.from(document.querySelectorAll(\n          '[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], div[class*=\"CommentItem\"], div[class*=\"comment-item\"]'\n        )).filter(visible);\n        const latest = window.__radarLatestCommentList || null;\n        const targetCid = " + JSON.stringify(_0x1ea4ea) + ";\n        const apiFresh = !!(latest && Date.now() - Number(latest.ts || 0) < 20000);\n        const apiHasTarget = !!(apiFresh && targetCid && Array.isArray(latest.cids) && latest.cids.includes(targetCid));\n        const apiHasAny = !!(apiFresh && Number(latest.count || 0) > 0);\n        return {\n          hasPanel: !!(panel && visible(panel)),\n          itemCount: items.length,\n          apiHasTarget: !!apiHasTarget,\n          apiHasAny: !!apiHasAny,\n          apiCount: Number(latest && latest.count) || 0,\n        };\n      })()").catch(() => ({
        hasPanel: false,
        itemCount: 0,
        apiHasTarget: false,
        apiHasAny: false,
        apiCount: 0
      }));
      if (_0x18119f && _0x381c0b.apiHasTarget) {
        await delay(600);
        if (_0x419857) {
          _0x16891a(_0x419857, "@" + (_0x2d5951 || "用户") + " 评论列表 API 已命中目标 cid，开始定位", "info");
        }
        return _0x217d78();
      }
      if (_0x381c0b.hasPanel && _0x381c0b.itemCount > 0) {
        if (_0x381c0b.itemCount >= _0x5cfe30) {
          if (_0x381c0b.itemCount === _0x5cfe30) {
            _0x5f26da += 1;
          } else {
            _0x5f26da = 0;
          }
          _0x5cfe30 = _0x381c0b.itemCount;
        }
        const _0x2b2459 = _0x18119f && (_0x381c0b.apiHasAny || _0x5f26da >= 2);
        const _0x1011b6 = !_0x18119f && (_0x5f26da >= 3 || _0x381c0b.itemCount >= 3 && Date.now() - _0x1c673e > 4000);
        if (_0x2b2459 || _0x1011b6) {
          await delay(_0x18119f ? 700 : 2500 + Math.floor(Math.random() * 1000));
          if (_0x419857) {
            _0x16891a(_0x419857, "@" + (_0x2d5951 || "用户") + " 评论区已就绪（可见 " + _0x381c0b.itemCount + " 条" + (_0x381c0b.apiCount ? "，API " + _0x381c0b.apiCount : "") + "），开始定位目标评论", "info");
          }
          return _0x217d78();
        }
      }
      await delay(400);
    }
    if (_0x419857) {
      _0x16891a(_0x419857, "@" + (_0x2d5951 || "用户") + " 评论区就绪等待超时（约 " + Math.round(_0x284017 / 1000) + " 秒），改为滚动定位", "warning");
    }
    return _0x217d78();
  }
  async function _0xa3aeaf(_0x1a0db8, _0xec16a4 = {}) {
    return _0x101717(_0x1a0db8, {
      resultChannel: "self-warmup-reply-comment-result",
      controlChannel: "self-warmup-reply-comment",
      timeoutReason: "回复评论操作超时",
      payload: {
        nickname: _0xec16a4.nickname || "",
        userUrl: _0xec16a4.userUrl || "",
        commentText: _0xec16a4.commentText || "",
        timeText: _0xec16a4.timeText || "",
        replyText: _0xec16a4.replyText || "",
        commentId: _0xec16a4.commentId || _0xec16a4.cid || "",
        cid: _0xec16a4.commentId || _0xec16a4.cid || "",
        enableCommentMention: !!_0xec16a4.enableCommentMention,
        commentMentionNicknames: _0xec16a4.commentMentionNicknames || "",
        commentMentionPosition: _0xec16a4.commentMentionPosition || "before",
        commentMentionPercent: Number.isFinite(Number(_0xec16a4.commentMentionPercent)) ? Math.max(0, Math.min(100, Math.round(Number(_0xec16a4.commentMentionPercent)))) : 100,
        enableCommentImage: !!_0xec16a4.enableCommentImage,
        commentImagePaths: _0xec16a4.commentImagePaths || [],
        enableCommentExpression: !!_0xec16a4.enableCommentExpression,
        commentExpressionCount: _0xec16a4.commentExpressionCount || 3,
        enableCommentWithoutText: !!_0xec16a4.enableCommentWithoutText,
        commentAttachmentPercent: _0xec16a4.commentAttachmentPercent,
        commentUseRandomSuffix: false
      },
      timeoutMs: 120000
    });
  }
  function _0xa484cd(_0x12ee0d = {}, _0x1054cc = null) {
    if (_0x1054cc?.enableCommentImage && Array.isArray(_0x1054cc.commentImagePaths) && _0x1054cc.commentImagePaths.some(_0x47c78e => String(_0x47c78e || "").trim())) {
      return true;
    }
    if (_0x1054cc?.enableCommentExpression) {
      return true;
    }
    if (Array.isArray(_0x12ee0d.replyTemplateItems) && _0x12ee0d.replyTemplateItems.length) {
      if (commentItemsHaveAttachment(_0x12ee0d)) {
        return true;
      }
    } else {
      if (_0x12ee0d.enableCommentImage && Array.isArray(_0x12ee0d.commentImagePaths) && _0x12ee0d.commentImagePaths.some(_0x1cc093 => String(_0x1cc093 || "").trim())) {
        return true;
      }
      if (_0x12ee0d.enableCommentExpression) {
        return true;
      }
    }
    if (_0x12ee0d.enableCommentMention && String(_0x12ee0d.commentMentionNicknames || "").trim()) {
      return true;
    }
    return false;
  }
  function _0x35e65e(_0xc644fa = {}, _0x582e14 = {}) {
    const _0x20c5b4 = !!_0x582e14.allowEmptyReplyText;
    const _0x53037f = _0x582e14.itemExtras || null;
    const _0x149a87 = Number.isFinite(Number(_0xc644fa.commentAttachmentPercent)) ? Number(_0xc644fa.commentAttachmentPercent) : 100;
    return {
      enableCommentMention: !!_0xc644fa.enableCommentMention,
      commentMentionNicknames: _0xc644fa.commentMentionNicknames || "",
      commentMentionPosition: _0xc644fa.commentMentionPosition || "before",
      commentMentionPercent: Number.isFinite(Number(_0xc644fa.commentMentionPercent)) ? Math.max(0, Math.min(100, Math.round(Number(_0xc644fa.commentMentionPercent)))) : 100,
      enableCommentImage: _0x53037f ? !!_0x53037f.enableCommentImage : !!_0xc644fa.enableCommentImage,
      commentImagePaths: _0x53037f ? _0x53037f.commentImagePaths || [] : _0xc644fa.commentImagePaths || [],
      enableCommentExpression: _0x53037f ? !!_0x53037f.enableCommentExpression : !!_0xc644fa.enableCommentExpression,
      commentExpressionCount: _0x53037f ? _0x53037f.commentExpressionCount || 3 : _0xc644fa.commentExpressionCount || 3,
      enableCommentWithoutText: _0x20c5b4 || _0xc644fa.enableCommentWithoutText === true,
      commentAttachmentPercent: _0x20c5b4 ? 100 : _0x149a87,
      commentUseRandomSuffix: false
    };
  }
  async function _0x472053(_0x2af094, _0x300787 = {}) {
    return _0x101717(_0x2af094, {
      resultChannel: "self-warmup-like-comment-result",
      controlChannel: "self-warmup-like-comment",
      timeoutReason: "点赞评论操作超时",
      payload: {
        nickname: _0x300787.nickname || "",
        userUrl: _0x300787.userUrl || "",
        commentText: _0x300787.commentText || "",
        timeText: _0x300787.timeText || "",
        commentId: _0x300787.commentId || _0x300787.cid || "",
        cid: _0x300787.commentId || _0x300787.cid || ""
      },
      timeoutMs: 120000
    });
  }
  function _0x3fb65d(_0x5207ab) {
    const _0x54305b = compactText(_0x5207ab?.text);
    if (!_0x54305b) {
      return "";
    }
    return _0x54305b.replace(/\[[^\[\]\n]{1,16}\]/g, "").replace(/👍|👏|❤|♥|💕|💗|💖|💘/g, "").replace(/\s+/g, " ").trim();
  }
  async function _0x349a80(_0x2150c2, _0x35e39f, _0x48cdef) {
    const _0x1ce61c = await _0x45bdfc(_0x35e39f, _0x48cdef, _0x2150c2);
    if (!_0x1ce61c) {
      return {
        ok: false,
        reason: "未能打开对应视频页"
      };
    }
    return _0x207cc3(_0x35e39f, async () => {
      await _0x479773(_0x35e39f, _0x2150c2, _0x48cdef);
      return _0x472053(_0x35e39f, {
        nickname: _0x48cdef.nickname,
        userUrl: _0x48cdef.userUrl,
        commentText: compactText(_0x48cdef.text),
        timeText: compactText(_0x48cdef.timeText),
        commentId: _0x48cdef.commentId || _0x48cdef.cid || "",
        cid: _0x48cdef.commentId || _0x48cdef.cid || ""
      });
    });
  }
  async function _0x549117(_0x22d4a7, _0x3279fd, _0x295003, _0x2dfbdb, _0xa15c9e, _0x4fbce8, _0x5f1927, _0x3266dd = null) {
    const _0x22d3c3 = await _0x45bdfc(_0x2dfbdb, _0x4fbce8, _0x295003);
    if (!_0x22d3c3) {
      return {
        ok: false,
        reason: "未能打开对应视频页"
      };
    }
    await _0x479773(_0x2dfbdb, _0x295003, _0x4fbce8);
    const _0x3cc8b8 = _0xa15c9e.enableCommentWithoutText === true;
    const _0x47d8d9 = _0xa484cd(_0xa15c9e, _0x3266dd);
    let _0x291301 = _0x3cc8b8 ? "" : _0x5f1927;
    let _0x56fbfc = false;
    const _0x29cf7f = resolveSelfWarmupContentMode(_0xa15c9e, false);
    if (!_0x3cc8b8 && _0x29cf7f === "ai" && _0x51f0a2(_0xa15c9e, _0x22d4a7)) {
      await delay(1200);
      const _0xbfaece = await _0x2dfbdb.webContents.executeJavaScript("(() => {\n        const compact = (value) => String(value || '').replace(/\\s+/g, ' ').trim();\n        const targetName = compact(" + JSON.stringify(_0x4fbce8.nickname || "") + ").replace(/^@+/, '').toLowerCase();\n        const hint = compact(" + JSON.stringify(_0x3fb65d(_0x4fbce8).slice(0, 50)) + ").toLowerCase();\n\n        const nodes = Array.from(document.querySelectorAll(\n          '[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], div[class*=\"comment-item\"], div[class*=\"reply-item\"]'\n        ));\n        let target = null;\n        for (const node of nodes) {\n          const link = node.querySelector('a[href*=\"/user/\"]');\n          const name = compact(link?.innerText || link?.textContent || '').replace(/^@+/, '').toLowerCase();\n          if (!name || !targetName) continue;\n          if (name !== targetName && !name.includes(targetName) && !targetName.includes(name)) continue;\n          const contentEl = node.querySelector('[data-e2e=\"comment-content\"], span[class*=\"comment\"], [class*=\"content\"]');\n          const content = compact(contentEl?.innerText || contentEl?.textContent || node.innerText || '').toLowerCase();\n          // 有可识别纯文字时再过滤；纯表情/图片评论走昵称兜底\n          if (hint.length >= 2 && !content.includes(hint.slice(0, Math.min(20, hint.length)))) continue;\n          target = node;\n          break;\n        }\n        if (!target && targetName) {\n          target = nodes.find((node) => {\n            const link = node.querySelector('a[href*=\"/user/\"]');\n            const name = compact(link?.innerText || link?.textContent || '').replace(/^@+/, '').toLowerCase();\n            return name && (name === targetName || name.includes(targetName) || targetName.includes(name));\n          }) || null;\n        }\n        if (!target) return '';\n\n        const container = target.closest('[class*=\"comment-item-container\"], [class*=\"CommentItemContainer\"]') || target.parentElement;\n        if (!container) return '';\n\n        const rows = Array.from(container.querySelectorAll('[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], [class*=\"comment-item\"], [class*=\"reply-item\"]'));\n        return rows.map((row) => {\n          const link = row.querySelector('a[href*=\"/user/\"]');\n          const name = compact(link?.innerText || link?.textContent || '');\n          const contentEl = row.querySelector('[data-e2e=\"comment-content\"], span[class*=\"comment\"], [class*=\"content\"]');\n          const content = compact(contentEl?.innerText || contentEl?.textContent || '');\n          if (!name || !content) return '';\n          return name + ': ' + content;\n        }).filter(Boolean).slice(-10).join('\\n');\n      })()").catch(() => "");
      if (_0xbfaece) {
        _0x16891a(_0x295003, "正在结合最近 10 条评论对话上下文重新生成回复...", "info");
        try {
          const _0x51a83f = await _0x200d41(_0xa15c9e, _0x22d4a7, _0x3279fd, {
            title: "自热互动通知",
            url: ""
          }, {
            nickname: _0x4fbce8.nickname,
            text: _0x4fbce8.text,
            userUrl: _0x4fbce8.userUrl,
            chatHistory: _0xbfaece
          }, {
            forDm: false,
            aiScene: "self_warmup",
            onRetry: (_0x2cd41d, _0x54ef52) => _0x16891a(_0x295003, "重新生成评论回复第 " + _0x2cd41d + " 次未成功：" + _0x54ef52, "warning")
          });
          if (_0x51a83f) {
            _0x291301 = _0x51a83f;
            _0x56fbfc = true;
            _0x16891a(_0x295003, "结合上下文生成新回复成功：" + _0x291301, "info");
          }
        } catch (_0x4895f4) {
          _0x16891a(_0x295003, "重新生成评论回复失败，使用预设文本：" + _0x4895f4.message, "warning");
        }
      }
    }
    if (!_0x3cc8b8 && !_0x56fbfc && _0x29cf7f !== "ai" && _0xa15c9e.commentUseRandomSuffix && String(_0x291301 || "").trim()) {
      _0x291301 = appendRandomEmojiSuffix(_0x291301);
    }
    const _0x35b778 = !!String(_0x291301 || "").trim();
    const _0xd5ff5a = !_0x35b778 && _0x47d8d9;
    if (!_0x35b778 && !_0x47d8d9) {
      return {
        ok: false,
        reason: _0x3cc8b8 ? "已开启不发文字但未配置图片/表情/@" : "无回复文案且未配置图片/表情/@"
      };
    }
    return _0x207cc3(_0x2dfbdb, async () => {
      await delay(800);
      const _0x55a2df = await _0xa3aeaf(_0x2dfbdb, {
        nickname: _0x4fbce8.nickname,
        userUrl: _0x4fbce8.userUrl,
        commentText: compactText(_0x4fbce8.text),
        timeText: compactText(_0x4fbce8.timeText),
        replyText: _0x291301,
        commentId: _0x4fbce8.commentId || _0x4fbce8.cid || "",
        cid: _0x4fbce8.commentId || _0x4fbce8.cid || "",
        ..._0x35e65e(_0xa15c9e, {
          allowEmptyReplyText: _0xd5ff5a,
          itemExtras: _0x3266dd
        })
      });
      return {
        ok: !!_0x55a2df.ok,
        reason: _0x55a2df.reason || "",
        sentText: _0x55a2df.sentText || _0x291301,
        errorCode: _0x55a2df.errorCode || "",
        diagnostic: _0x55a2df.diagnostic || "",
        detail: _0x55a2df.detail || ""
      };
    });
  }
  async function _0x310d47(_0x274dde, _0xd6df84, _0x300e1b = {}) {
    return _0x101717(_0x274dde, {
      resultChannel: "self-warmup-reply-dm-result",
      controlChannel: "self-warmup-reply-dm",
      timeoutReason: "回复私信操作超时",
      payload: {
        dmText: _0xd6df84,
        nickname: _0x300e1b.nickname || "",
        text: _0x300e1b.text || "",
        config: _0x300e1b.config,
        accountId: _0x300e1b.accountId,
        account: _0x300e1b.account,
        excludeGroupChats: _0x300e1b.excludeGroupChats !== false
      }
    });
  }
  async function _0x571704(_0x1ed062, _0x49f086, _0x39eda3, _0x3be6b5 = {}) {
    await delay(900 + Math.floor(Math.random() * 300));
    if (_0x39eda3) {
      return;
    }
    const _0xe57b3b = await _0x71ecd4(_0x49f086, _0x3be6b5);
    if (_0xe57b3b?.recycled) {
      _0x16891a(_0x1ed062, shouldWarmupIdleOnChat(_0x3be6b5) ? "已回收作品/主页等画面，回到 Chat 页" : "已回收作品/主页等画面，回到精选页", "info");
    }
  }
  async function _0x5c82da(_0x204812, _0x24e554, _0x245082, _0x9d74d9, _0x8174a9, _0x9fbd45, _0x5c7b05) {
    if (isDouyinStrangerMessagesFolderName(_0x9fbd45.nickname)) {
      return {
        ok: true,
        skipped: true,
        reason: "陌生人消息是文件夹不是会话"
      };
    }
    return _0x207cc3(_0x9d74d9, async () => {
      const _0x2fbe3d = await _0x5438e3(_0x9d74d9, {
        taskId: _0x245082
      }).catch(() => null);
      let _0x4b4b12 = isWarmupSurfaceComplete(_0x2fbe3d);
      if (!_0x4b4b12) {
        _0x4b4b12 = await _0x2edf11(_0x9d74d9, _0x245082);
      }
      if (!_0x4b4b12) {
        return {
          ok: false,
          reason: "未打开私信页面/面板"
        };
      }
      await delay(800);
      if (_0x8174a9.excludeGroupChats !== false) {
        if (_0x9fbd45.isGroupChat || looksLikeDouyinGroupChatName(_0x9fbd45.nickname).isGroup) {
          _0x9fbd45.isGroupChat = true;
          _0x9fbd45.groupReason = _0x9fbd45.groupReason || looksLikeDouyinGroupChatName(_0x9fbd45.nickname).reason || "list_or_name";
          _0x16891a(_0x245082, (_0x9fbd45.nickname || "私信会话") + " 已排除：已开启“排除群聊”（" + _0x9fbd45.groupReason + "）", "info");
          return {
            ok: true,
            skipped: true,
            reason: "已开启“排除群聊”",
            excludedGroup: true
          };
        }
      }
      const _0x2ecb78 = (Array.isArray(_0x5c7b05) ? _0x5c7b05 : [_0x5c7b05]).map(compactText).filter(Boolean);
      if (!_0x2ecb78.length) {
        return {
          ok: false,
          reason: "私信文案为空"
        };
      }
      let _0x5caea5 = null;
      for (let _0x4a417b = 0; _0x4a417b < _0x2ecb78.length; _0x4a417b++) {
        const _0x1db434 = _0x2ecb78[_0x4a417b];
        if (_0x4a417b > 0) {
          _0x16891a(_0x245082, "@" + (_0x9fbd45.nickname || "用户") + " 发送第 " + (_0x4a417b + 1) + "/" + _0x2ecb78.length + " 条私信，间隔 1.5 秒…", "info");
          await delay(1500);
        }
        _0x5caea5 = await _0x310d47(_0x9d74d9, _0x1db434, {
          nickname: _0x9fbd45.nickname,
          text: _0x9fbd45.text,
          config: _0x8174a9,
          accountId: _0x204812,
          account: _0x24e554,
          excludeGroupChats: _0x8174a9.excludeGroupChats !== false
        });
        if (_0x5caea5?.excludedGroup) {
          _0x9fbd45.isGroupChat = true;
          _0x9fbd45.groupReason = _0x5caea5.groupReason || "opened_session";
          _0x16891a(_0x245082, (_0x9fbd45.nickname || "私信会话") + " 已排除：已开启“排除群聊”（" + _0x9fbd45.groupReason + "）", "info");
          break;
        }
      }
      _0x2b1f11(_0x9fbd45, _0x5caea5);
      return _0x5caea5;
    });
  }
  function _0x3ba28b(_0x76f41e, _0x4a9a8e, _0x314dd6, _0xb8eae) {
    if (!_0x76f41e) {
      return false;
    }
    const _0x4e175c = normalizeName(_0x314dd6.nickname || "");
    const _0x4ba0cc = _0x314dd6.userUrl ? extractUserIdFromUrl(_0x314dd6.userUrl) : "";
    if (!_0x4e175c && !_0x4ba0cc) {
      return false;
    }
    const _0x3104cc = typeof _0x76f41e.listEventsForUser === "function" ? _0x76f41e.listEventsForUser(_0x4a9a8e, {
      nickname: _0x314dd6.nickname || "",
      userUrl: _0x314dd6.userUrl || ""
    }) : _0x76f41e.findTaskById(_0x4a9a8e)?.events || [];
    if (!Array.isArray(_0x3104cc) || !_0x3104cc.length) {
      return false;
    }
    return _0x3104cc.some(_0x3b9b37 => {
      const _0x39fa04 = normalizeName(_0x3b9b37.nickname || "");
      const _0x1c6404 = _0x3b9b37.userUrl ? extractUserIdFromUrl(_0x3b9b37.userUrl) : "";
      const _0x277ed7 = _0x4e175c && _0x39fa04 && _0x4e175c === _0x39fa04 || _0x4ba0cc && _0x1c6404 && _0x4ba0cc === _0x1c6404;
      if (!_0x277ed7) {
        return false;
      }
      const _0x2d21b5 = Array.isArray(_0x3b9b37.actionsTaken) ? _0x3b9b37.actionsTaken.join(" ") : String(_0x3b9b37.actionSummary || "");
      if (_0xb8eae === "follow_back" || _0xb8eae === "user_follow") {
        return _0x3b9b37.alreadyFollowed || _0x3b9b37.followStatus === "success" || /已关注|已回关|已互关|原先已关注|已发关注请求/.test(_0x2d21b5);
      }
      if (_0xb8eae === "send_dm" || _0xb8eae === "reply_dm") {
        return _0x3b9b37.dmStatus === "success" || /已发送私信|已回复私信/.test(_0x2d21b5);
      }
      if (_0xb8eae === "reply_comment") {
        if (/已回复评论/.test(_0x2d21b5) && _0x3b9b37.text === _0x314dd6.text) {
          return true;
        }
        return false;
      }
      if (_0xb8eae === "like_comment") {
        return _0x3b9b37.text === _0x314dd6.text && /已点赞评论|评论原先已赞/.test(_0x2d21b5);
      }
      return false;
    });
  }
  async function _0x4b9692(_0x4ae293, _0x30c7ba, _0x33719b, _0x36621a, _0x1fe9a9, _0xc468a6, _0x1d697f = {}) {
    const {
      hasNextDm = false
    } = _0x1d697f;
    const _0x4c296e = _0x8b7897(_0x4ae293, _0x1fe9a9, _0xc468a6);
    const _0x44f024 = _0x3872f7(_0x4ae293, _0x1fe9a9, _0xc468a6, _0x2c381b(_0x4ae293, _0x1fe9a9, _0xc468a6));
    _0xc468a6.actionSkippedReasons = _0x44f024;
    _0x44f024.forEach(_0x5cdb1f => {
      _0x16891a(_0x4ae293, (_0xc468a6.nickname || "用户") + " " + (ACTION_LABELS[_0x5cdb1f.action] || _0x5cdb1f.action || "动作") + "已跳过：" + _0x5cdb1f.reason, "info");
    });
    if (!_0x4c296e.length) {
      if (_0x44f024.length) {
        _0xc468a6.actionStatus = "skipped";
        _0xc468a6.actionSummary = _0x44f024.map(_0x567fa2).join("、");
        return;
      }
      _0xc468a6.actionStatus = _0x1fe9a9.enableAutoActions ? "skipped" : "none";
      _0xc468a6.actionSummary = _0x1fe9a9.enableAutoActions ? "未匹配回应条件" : "仅记录";
      return;
    }
    if (_0x44f024.some(_0x3a3411 => _0x3a3411.action === "reply_comment") && _0x4c296e.includes("like_comment")) {
      _0x16891a(_0x4ae293, formatEventBrief(_0xc468a6) + "：回复已达每用户上限，本条通知只点赞、不再回复（与同用户其它通知无关）", "info");
    }
    await delay(_0x1be824(_0x1fe9a9));
    const _0x46a075 = [];
    const _0x146dd2 = [];
    let _0x53d3a1 = false;
    const _0x39c2ff = _0x1d2021.selfWarmupTasksApi?.findTaskById(_0x4ae293)?.stats?.actionsExecuted || 0;
    const _0x1a0ebb = resolveSelfWarmupTemplatePayload(_0x1fe9a9, _0xc468a6, {
      isDm: false,
      roundIndex: _0x39c2ff,
      fallback: _0x1fe9a9.enableCommentWithoutText === true || _0xa484cd(_0x1fe9a9) ? "" : "谢谢 {nickname}，看到你的评论啦。"
    });
    const _0xd39e27 = resolveSelfWarmupTemplatePayload(_0x1fe9a9, _0xc468a6, {
      isDm: true,
      roundIndex: _0x39c2ff,
      fallback: "你好 {nickname}，看到你的消息了，方便的话可以继续聊聊。"
    });
    const _0x47cea1 = resolveSelfWarmupContentMode(_0x1fe9a9, false) === "template" ? _0x1a0ebb.extras : null;
    const _0x228e3b = _0x19c8d4 => {
      if (Array.isArray(_0x19c8d4.text)) {
        return _0x19c8d4.texts?.[0] || _0x19c8d4.text[0] || "";
      }
      return _0x19c8d4.text || "";
    };
    const _0x37349d = Object.prototype.hasOwnProperty.call(_0xc468a6, "suggestedCommentText");
    const _0x52bcd2 = Object.prototype.hasOwnProperty.call(_0xc468a6, "suggestedDmText");
    const _0x765053 = compactText(_0x37349d ? _0xc468a6.suggestedCommentText : _0xc468a6.suggestedText) || _0x228e3b(_0x1a0ebb);
    const _0x9b605f = compactText(_0x52bcd2 ? _0xc468a6.suggestedDmText : _0xc468a6.suggestedText) || _0x228e3b(_0xd39e27);
    for (const _0x43868f of _0x4c296e) {
      try {
        const _0x3ad447 = _0x396cb8(_0x4ae293, _0x43868f, _0x30c7ba);
        if (_0x3ad447) {
          _0x44f024.push({
            action: _0x43868f,
            reason: _0x3ad447
          });
          _0x16891a(_0x4ae293, (_0xc468a6.nickname || "用户") + " " + (ACTION_LABELS[_0x43868f] || _0x43868f) + "已跳过：" + _0x3ad447, "info");
          continue;
        }
        if (_0x3ba28b(_0x1d2021.selfWarmupTasksApi, _0x4ae293, _0xc468a6, _0x43868f)) {
          const _0x260691 = _0x43868f === "like_comment" ? "点赞评论" : _0x43868f.includes("follow") ? "关注" : _0x43868f.includes("dm") ? "私信" : "回复";
          _0x16891a(_0x4ae293, (_0xc468a6.nickname || "用户") + " 在该任务详情记录中此前已完成" + _0x260691 + "操作，跳过重复操作", "info");
          if (_0x43868f === "like_comment") {
            _0x46a075.push("已点赞评论");
          } else if (_0x43868f.includes("follow")) {
            _0x46a075.push("已关注");
            _0x53d3a1 = true;
          } else if (_0x43868f.includes("dm")) {
            _0x46a075.push("已发私信");
          } else if (_0x43868f.includes("comment")) {
            _0x46a075.push("已回复评论");
          }
          continue;
        }
        if (_0x43868f === "follow_back") {
          const _0x544f6c = await _0x2372a2(_0x36621a, _0xc468a6);
          if (_0x544f6c.userUrl && !_0xc468a6.userUrl) {
            _0xc468a6.userUrl = _0x544f6c.userUrl;
          }
          if (_0x544f6c.ok) {
            _0x53d3a1 = true;
            _0x46a075.push(_0x544f6c.alreadyFollowed ? "已互关" : "已回关");
            if (!_0x544f6c.alreadyFollowed) {
              _0x203a4c(_0x4ae293, _0x30c7ba, _0x43868f);
            }
          } else {
            const _0x17ca89 = await _0x3e1f7c(_0x36621a, _0xc468a6);
            if (_0x17ca89.userUrl && !_0xc468a6.userUrl) {
              _0xc468a6.userUrl = _0x17ca89.userUrl;
            }
            if (_0x17ca89.ok) {
              _0x53d3a1 = true;
              if (_0x17ca89.alreadyFollowed) {
                _0x46a075.push("已互关");
              } else if (_0x17ca89.followRequested) {
                _0x46a075.push("已发关注请求");
              } else {
                _0x46a075.push("已回关");
              }
              if (!_0x17ca89.alreadyFollowed) {
                _0x203a4c(_0x4ae293, _0x30c7ba, _0x43868f);
              }
            } else {
              _0x146dd2.push({
                action: _0x43868f,
                reason: _0x17ca89.reason || _0x544f6c.reason || "主页未确认回关成功"
              });
            }
            await _0x71ecd4(_0x36621a, _0x1fe9a9);
          }
        } else if (_0x43868f === "user_follow") {
          const _0x24e7fa = await _0x3e1f7c(_0x36621a, _0xc468a6);
          if (_0x24e7fa.userUrl && !_0xc468a6.userUrl) {
            _0xc468a6.userUrl = _0x24e7fa.userUrl;
          }
          if (_0x24e7fa.ok) {
            _0x53d3a1 = true;
            if (_0x24e7fa.alreadyFollowed) {
              _0x46a075.push("原先已关注");
            } else if (_0x24e7fa.followRequested) {
              _0x46a075.push("已发关注请求");
            } else {
              _0x46a075.push("已关注");
            }
            if (!_0x24e7fa.alreadyFollowed) {
              _0x203a4c(_0x4ae293, _0x30c7ba, _0x43868f);
            }
          } else {
            const _0x2fd343 = _0x24e7fa.reason || "未找到关注按钮或点击失败";
            _0x146dd2.push({
              action: _0x43868f,
              reason: _0x2fd343
            });
            _0x16891a(_0x4ae293, (_0xc468a6.nickname || "用户") + " " + _0x2fd343 + "，跳过关注", "warning");
          }
          await _0x71ecd4(_0x36621a, _0x1fe9a9);
        } else if (_0x43868f === "like_comment") {
          const _0x343784 = await _0x35f5d6(_0x4ae293, _0x36621a, _0xc468a6, "@" + (_0xc468a6.nickname || "用户") + " 评论点赞", () => _0x349a80(_0x4ae293, _0x36621a, _0xc468a6));
          if (_0x343784.retried) {
            _0xc468a6._immediateRetryPerformed = true;
          }
          if (_0x343784.ok) {
            _0x46a075.push(_0x343784.alreadyLiked ? "评论原先已赞" : "已点赞评论");
            if (!_0x343784.alreadyLiked) {
              _0x203a4c(_0x4ae293, _0x30c7ba, _0x43868f);
            }
          } else {
            const _0x3a9cde = _0x343784.reason || "未知原因";
            _0x146dd2.push({
              action: _0x43868f,
              reason: _0x3a9cde
            });
            _0x16891a(_0x4ae293, _0xc468a6.nickname + " 评论点赞失败：" + _0x3a9cde, "warning");
          }
          if (!_0x4c296e.includes("reply_comment")) {
            _0xc468a6._selfWarmupCommentPageReady = false;
            await _0x71ecd4(_0x36621a, _0x1fe9a9);
          }
        } else if (_0x43868f === "reply_comment") {
          const _0x44443c = _0x1fe9a9.enableCommentWithoutText === true || !compactText(_0x765053) && _0xa484cd(_0x1fe9a9, _0x47cea1);
          const _0x4cbc7d = _0xa484cd(_0x1fe9a9, _0x47cea1);
          const _0x582191 = _0x44443c ? "" : _0x765053;
          if (!_0x582191 && !_0x4cbc7d) {
            _0x146dd2.push({
              action: _0x43868f,
              reason: _0x44443c ? "已开启不发文字但未配置图片/表情/@" : "无回复文案"
            });
            continue;
          }
          const _0x535353 = _0x3e6a03(_0x1fe9a9);
          const _0x549cec = _0x3f781a(_0x4ae293, _0xc468a6.nickname, _0x30c7ba, "comment", _0xc468a6.userUrl);
          if (_0x549cec >= _0x535353) {
            const _0x4cf380 = "已达每用户 " + _0x535353 + " 轮回复上限";
            _0x146dd2.push({
              action: _0x43868f,
              reason: _0x4cf380
            });
            _0x16891a(_0x4ae293, _0xc468a6.nickname + " " + _0x4cf380 + "，跳过", "info");
            continue;
          }
          const _0x74ad84 = await _0x35f5d6(_0x4ae293, _0x36621a, _0xc468a6, "@" + (_0xc468a6.nickname || "用户") + " 评论回复", () => _0x549117(_0x30c7ba, _0x33719b, _0x4ae293, _0x36621a, _0x1fe9a9, _0xc468a6, _0x582191, _0x47cea1));
          if (_0x74ad84.retried) {
            _0xc468a6._immediateRetryPerformed = true;
          }
          if (_0x74ad84.ok) {
            if (_0x74ad84.sentText) {
              _0xc468a6.suggestedCommentText = _0x74ad84.sentText;
              _0xc468a6.suggestedText = _0x74ad84.sentText;
            }
            const _0x2eec89 = _0x2117f1(_0x4ae293, _0xc468a6.nickname, _0x30c7ba, "comment", _0xc468a6.userUrl);
            _0x46a075.push("已回复评论(" + _0x2eec89 + "/" + _0x535353 + ")");
            _0x203a4c(_0x4ae293, _0x30c7ba, _0x43868f);
          } else {
            const _0x5193ba = _0x74ad84.reason || "未知原因";
            _0x146dd2.push({
              action: _0x43868f,
              reason: _0x5193ba
            });
            _0x16891a(_0x4ae293, _0xc468a6.nickname + " 评论回复失败：" + _0x5193ba, "warning");
          }
          _0xc468a6._selfWarmupCommentPageReady = false;
          await _0x71ecd4(_0x36621a, _0x1fe9a9);
        } else if (_0x43868f === "send_dm") {
          const _0x29a479 = _0x3e6a03(_0x1fe9a9);
          const _0x2aca95 = _0x3f781a(_0x4ae293, _0xc468a6.nickname, _0x30c7ba, "dm", _0xc468a6.userUrl);
          if (_0x2aca95 >= _0x29a479) {
            const _0x4d44bf = "已达每用户 " + _0x29a479 + " 轮回复上限";
            _0x146dd2.push({
              action: _0x43868f,
              reason: _0x4d44bf
            });
            _0x16891a(_0x4ae293, _0xc468a6.nickname + " " + _0x4d44bf + "，跳过", "info");
            continue;
          }
          if (!(Array.isArray(_0x9b605f) ? _0x9b605f.some(_0x435511 => !!compactText(_0x435511)) : !!_0x9b605f)) {
            _0x146dd2.push({
              action: _0x43868f,
              reason: "无私信文案"
            });
            continue;
          }
          if (_0x53d3a1) {
            await delay(_0x1f5e3c(_0x1fe9a9));
          }
          const _0x22a65d = await _0x3205e7(_0x4ae293, "@" + (_0xc468a6.nickname || "用户") + " 主页私信", () => _0x5cb6a2(_0x36621a, _0xc468a6, _0x9b605f));
          if (_0x22a65d.retried) {
            _0xc468a6._immediateRetryPerformed = true;
          }
          if (_0x22a65d.ok && _0x22a65d.skipped) {
            let _0x160f76 = _0x3f781a(_0x4ae293, _0xc468a6.nickname, _0x30c7ba, "dm", _0xc468a6.userUrl);
            if (_0x160f76 <= 0) {
              _0x160f76 = _0x2117f1(_0x4ae293, _0xc468a6.nickname, _0x30c7ba, "dm", _0xc468a6.userUrl);
            }
            _0x46a075.push("私信已跳过(" + _0x160f76 + "/" + _0x29a479 + "·会话已有我方消息)");
            _0x16891a(_0x4ae293, _0xc468a6.nickname + " 会话中已有我方私信，跳过主动私信", "info");
          } else if (_0x22a65d.ok) {
            if (_0x22a65d.sentText) {
              _0xc468a6.suggestedDmText = _0x22a65d.sentText;
              _0xc468a6.suggestedText = _0x22a65d.sentText;
            }
            const _0x4859d7 = _0x2117f1(_0x4ae293, _0xc468a6.nickname, _0x30c7ba, "dm", _0xc468a6.userUrl);
            _0x46a075.push("已发送私信(" + _0x4859d7 + "/" + _0x29a479 + ")");
            _0x203a4c(_0x4ae293, _0x30c7ba, _0x43868f);
            _0x16891a(_0x4ae293, (() => {
              const _0x4b0655 = cleanDmDeliveredSnippet(_0x22a65d.sentText) || cleanDmDeliveredSnippet(_0x22a65d.debug?.snippet);
              if (_0x4b0655) {
                return _0xc468a6.nickname + " 私信已确认送达：" + _0x4b0655;
              } else {
                return _0xc468a6.nickname + " 私信已确认送达";
              }
            })(), "success");
          } else if (_0x22a65d.blocked && _0x22a65d.blockType === "privacy_settings") {
            const _0x51edca = _0x2117f1(_0x4ae293, _0xc468a6.nickname, _0x30c7ba, "dm", _0xc468a6.userUrl);
            _0x46a075.push("私信已跳过(" + _0x51edca + "/" + _0x29a479 + "·对方隐私设置)");
            _0x16891a(_0x4ae293, _0xc468a6.nickname + " 因对方隐私设置无法私信，已跳过（平台提示：由于对方的隐私设置，你无法发送消息）", "info");
          } else if (_0x22a65d.consumeRound) {
            if (_0x22a65d.sentText) {
              _0xc468a6.suggestedDmText = _0x22a65d.sentText;
              _0xc468a6.suggestedText = _0x22a65d.sentText;
            }
            const _0x1125ce = _0x2117f1(_0x4ae293, _0xc468a6.nickname, _0x30c7ba, "dm", _0xc468a6.userUrl);
            _0x46a075.push("已发送私信(" + _0x1125ce + "/" + _0x29a479 + "·弱确认)");
            _0x203a4c(_0x4ae293, _0x30c7ba, _0x43868f);
            _0x16891a(_0x4ae293, _0xc468a6.nickname + " 私信已发送(会话气泡未即时确认)，已计入次数", "success");
          } else {
            const _0x2c4126 = _0x22a65d.reason || "未知原因";
            _0x146dd2.push({
              action: _0x43868f,
              reason: _0x2c4126
            });
            _0x16891a(_0x4ae293, _0xc468a6.nickname + " 主页私信失败：" + _0x2c4126, "warning");
          }
          await _0x71ecd4(_0x36621a, _0x1fe9a9);
        } else if (_0x43868f === "reply_dm") {
          const _0x439d70 = _0x3e6a03(_0x1fe9a9);
          const _0x57b6b0 = _0x3f781a(_0x4ae293, _0xc468a6.nickname, _0x30c7ba, "dm", _0xc468a6.userUrl);
          if (_0x57b6b0 >= _0x439d70) {
            const _0x485367 = "已达每用户 " + _0x439d70 + " 轮回复上限";
            _0x146dd2.push({
              action: _0x43868f,
              reason: _0x485367
            });
            _0x16891a(_0x4ae293, _0xc468a6.nickname + " " + _0x485367 + "，跳过", "info");
            await _0x571704(_0x4ae293, _0x36621a, hasNextDm, _0x1fe9a9);
            continue;
          }
          if (!(Array.isArray(_0x9b605f) ? _0x9b605f.some(_0x5f3aa7 => !!compactText(_0x5f3aa7)) : !!_0x9b605f)) {
            _0x146dd2.push({
              action: _0x43868f,
              reason: "无私信文案"
            });
            await _0x571704(_0x4ae293, _0x36621a, hasNextDm, _0x1fe9a9);
            continue;
          }
          const _0x4f00e5 = await _0x3205e7(_0x4ae293, "@" + (_0xc468a6.nickname || "用户") + " 私信回复", () => _0x5c82da(_0x30c7ba, _0x33719b, _0x4ae293, _0x36621a, _0x1fe9a9, _0xc468a6, _0x9b605f));
          if (_0x4f00e5.retried) {
            _0xc468a6._immediateRetryPerformed = true;
          }
          if (_0x4f00e5.ok && _0x4f00e5.skipped) {
            const _0x29cd86 = _0x4f00e5.reason || "无需再回复";
            if (_0x4f00e5.excludedGroup || /排除群聊/.test(_0x29cd86)) {
              _0xc468a6.isGroupChat = true;
              _0xc468a6.suggestionStatus = "none";
              _0xc468a6.suggestedDmText = "";
              _0xc468a6.suggestedText = "";
              _0x46a075.push("私信已跳过(排除群聊)");
              _0x16891a(_0x4ae293, _0xc468a6.nickname + " " + _0x29cd86, "info");
            } else if (/文件夹/.test(_0x29cd86) || isDouyinStrangerMessagesFolderName(_0xc468a6.nickname)) {
              _0x46a075.push("私信已跳过(陌生人消息是文件夹)");
              _0x16891a(_0x4ae293, "已跳过「陌生人消息」文件夹：需进入列表后回复具体会话", "info");
            } else {
              _0x46a075.push(_0x29cd86.includes("自己") ? "私信已跳过(最后一条为自己发送)" : "私信已跳过(未确认对方新消息)");
              _0x16891a(_0x4ae293, _0xc468a6.nickname + " " + _0x29cd86, "info");
            }
          } else if (_0x4f00e5.ok) {
            if (_0x4f00e5.sentText) {
              _0xc468a6.suggestedDmText = _0x4f00e5.sentText;
              _0xc468a6.suggestedText = _0x4f00e5.sentText;
            }
            const _0x411958 = _0x2117f1(_0x4ae293, _0xc468a6.nickname, _0x30c7ba, "dm", _0xc468a6.userUrl);
            const _0x10efe5 = _0x4f00e5.softVerified ? "(弱确认)" : "";
            _0x46a075.push("已回复私信(" + _0x411958 + "/" + _0x439d70 + _0x10efe5 + ")");
            _0x203a4c(_0x4ae293, _0x30c7ba, _0x43868f);
            _0x16891a(_0x4ae293, _0x4f00e5.softVerified ? _0xc468a6.nickname + " 私信已发送(会话气泡未即时确认)，已计入次数" : formatDmDeliveredLog(_0xc468a6.nickname, _0x4f00e5), "success");
          } else if (_0x4f00e5.blocked && _0x4f00e5.blockType === "privacy_settings") {
            const _0x2c86df = _0x2117f1(_0x4ae293, _0xc468a6.nickname, _0x30c7ba, "dm", _0xc468a6.userUrl);
            _0x46a075.push("私信回复已跳过(" + _0x2c86df + "/" + _0x439d70 + "·对方隐私设置)");
            _0x16891a(_0x4ae293, _0xc468a6.nickname + " 因对方隐私设置无法回复私信，已跳过", "info");
          } else if (_0x4f00e5.consumeRound) {
            if (_0x4f00e5.sentText) {
              _0xc468a6.suggestedDmText = _0x4f00e5.sentText;
              _0xc468a6.suggestedText = _0x4f00e5.sentText;
            }
            const _0x598dad = _0x2117f1(_0x4ae293, _0xc468a6.nickname, _0x30c7ba, "dm", _0xc468a6.userUrl);
            _0x46a075.push("已回复私信(" + _0x598dad + "/" + _0x439d70 + "·弱确认)");
            _0x203a4c(_0x4ae293, _0x30c7ba, _0x43868f);
            _0x16891a(_0x4ae293, _0xc468a6.nickname + " 私信已发送(会话气泡未即时确认)，已计入次数", "success");
          } else {
            const _0x2b302d = _0x4f00e5.reason || "未知原因";
            _0x146dd2.push({
              action: _0x43868f,
              reason: _0x2b302d
            });
            _0x16891a(_0x4ae293, _0xc468a6.nickname + " 私信回复失败：" + _0x2b302d, "warning");
          }
          await _0x571704(_0x4ae293, _0x36621a, hasNextDm, _0x1fe9a9);
        }
      } catch (_0x281414) {
        _0x146dd2.push({
          action: _0x43868f,
          reason: _0x281414.message || String(_0x281414)
        });
        _0x16891a(_0x4ae293, "自动回应失败(" + _0x43868f + ")：" + _0x281414.message, "warning");
      }
    }
    _0xc468a6.actionsTaken = _0x46a075;
    _0xc468a6.actionFailures = _0x146dd2;
    _0xc468a6.actionErrorReason = _0x146dd2.map(_0x162a74 => (ACTION_LABELS[_0x162a74.action] || _0x162a74.action) + "：" + _0x162a74.reason).join("；");
    const _0x323b47 = [..._0x46a075, ..._0x44f024.map(_0x567fa2)];
    _0xc468a6.actionSummary = _0x323b47.join("、");
    if (_0x46a075.length && (_0x146dd2.length || _0x44f024.length)) {
      _0xc468a6.actionStatus = "partial";
    } else if (_0x46a075.length) {
      _0xc468a6.actionStatus = "success";
    } else if (_0x4c296e.length) {
      _0xc468a6.actionStatus = "failed";
      if (!_0xc468a6.actionSummary) {
        _0xc468a6.actionSummary = _0xc468a6.actionErrorReason || "自动回应未成功";
      }
    } else {
      _0xc468a6.actionStatus = "failed";
      _0xc468a6.actionSummary = _0xc468a6.actionErrorReason || "自动回应未成功";
    }
    if (_0x46a075.length) {
      _0x16891a(_0x4ae293, formatEventBrief(_0xc468a6) + " → " + _0x323b47.join("、"), "success");
    } else if (_0x146dd2.length) {
      const _0x4abf7c = _0x44f024.length ? "（" + _0x44f024.map(_0x567fa2).join("、") + "）" : "";
      _0x16891a(_0x4ae293, formatEventBrief(_0xc468a6) + " 自动回应失败：" + _0xc468a6.actionErrorReason + _0x4abf7c, "warning");
    } else if (_0x44f024.length) {
      _0x16891a(_0x4ae293, formatEventBrief(_0xc468a6) + " → " + _0x323b47.join("、"), "info");
    }
  }
  async function _0x2d8af0(_0x8b4bf8, _0x6e3086, _0xaa0e7b, _0x513f27, _0x55366b) {
    const _0x1e8458 = _0x55366b.filter(_0x27d9d7 => isJudgeableEvent(_0x27d9d7));
    const _0x39be96 = new Map();
    if (_0x1e8458.length) {
      if (_0x513f27.useAiJudge) {
        try {
          _0x16891a(_0x8b4bf8, "正在对 " + _0x1e8458.length + " 条评论/私信做 AI 研判", "info");
          const _0x2c2bed = await _0x2965c4(_0x513f27, _0x6e3086, _0xaa0e7b, {
            title: "自热互动通知",
            url: ""
          }, _0x1e8458.map(_0x4811bb => ({
            nickname: _0x4811bb.nickname,
            text: _0x4811bb.text,
            userUrl: _0x4811bb.userUrl,
            time: _0x4811bb.timeText
          })), {
            aiScene: "self_warmup",
            onLog: _0x427a77 => _0x16891a(_0x8b4bf8, _0x427a77, "info"),
            onRetry: (_0x4b3c69, _0x2cb2a8) => _0x16891a(_0x8b4bf8, "AI 研判第 " + _0x4b3c69 + " 次未成功：" + _0x2cb2a8, "warning")
          });
          _0x1e8458.forEach((_0x445f90, _0x3fcaf5) => _0x39be96.set(_0x445f90, _0x2c2bed[_0x3fcaf5]));
        } catch (_0x7d4d51) {
          _0x16891a(_0x8b4bf8, "AI 研判失败，回退关键词：" + _0x7d4d51.message, "warning");
        }
      }
      _0x1e8458.forEach(_0x48bb0a => {
        if (_0x39be96.has(_0x48bb0a)) {
          return;
        }
        const _0x31da65 = String(_0x513f27.keywords || "").replace(/[\n\r]+/g, ",");
        const _0x1181c4 = _0x7d5c87(_0x48bb0a.text, _0x31da65);
        const _0x452076 = !!_0x31da65.trim();
        _0x39be96.set(_0x48bb0a, {
          matched: _0x1181c4,
          matchType: "keyword",
          reason: _0x1181c4 ? _0x452076 ? "命中关键词" : "未设置关键词，全部回复" : "未命中关键词",
          replyContent: ""
        });
      });
    }
    for (const _0x19f689 of _0x55366b) {
      if (_0x39be96.has(_0x19f689)) {
        const _0x37c618 = _0x39be96.get(_0x19f689) || {};
        _0x19f689.matched = _0x37c618.matched !== false;
        _0x19f689.matchType = _0x37c618.matchType || (_0x513f27.useAiJudge ? "ai" : "keyword");
        _0x19f689.judgeReason = _0x37c618.reason || _0x37c618.judgeReason || (_0x19f689.matched ? "建议跟进" : "无需跟进");
      } else {
        _0x19f689.matched = true;
        _0x19f689.matchType = "rule";
        _0x19f689.judgeReason = (_0x19f689.eventLabel || "互动") + "已记录";
      }
    }
  }
  async function _0x5f58d3(_0x2ddbbf, _0x959e7b, _0x56661c, _0x14d63d, _0x568c99) {
    const _0x1ffde5 = _0x14d63d.enableAutoActions ? _0x8b7897(_0x2ddbbf, _0x14d63d, _0x568c99) : [];
    const _0x1dfdf1 = _0x1ffde5.includes("reply_comment");
    const _0x43e9a8 = _0x1ffde5.some(_0x481b06 => _0x481b06 === "reply_dm" || _0x481b06 === "send_dm");
    const _0x2cd637 = resolveSelfWarmupTemplatePayload(_0x14d63d, _0x568c99, {
      isDm: false
    });
    const _0x497226 = Array.isArray(_0x2cd637.text) ? _0x2cd637.texts?.[0] || "" : _0x2cd637.text || "";
    const _0xb10f41 = _0x14d63d.enableCommentWithoutText === true || !String(_0x497226).trim() && _0xa484cd(_0x14d63d, _0x2cd637.extras);
    const _0x130435 = _0x1dfdf1 && !_0xb10f41;
    const _0x19bef4 = _0x43e9a8;
    if (!_0x14d63d.enableAutoActions || !_0x130435 && !_0x19bef4) {
      _0x568c99.suggestionStatus = "none";
      return;
    }
    if (_0x568c99.source === "dm" && _0x14d63d.excludeGroupChats !== false && (_0x568c99.isGroupChat || looksLikeDouyinGroupChatName(_0x568c99.nickname).isGroup)) {
      _0x568c99.suggestionStatus = "none";
      _0x568c99.suggestedDmText = "";
      _0x568c99.suggestedText = "";
      return;
    }
    if (!_0x568c99.matched) {
      _0x568c99.suggestionStatus = "none";
      return;
    }
    if (_0x1dfdf1 && !_0x43e9a8 && _0xb10f41) {
      _0x568c99.suggestionStatus = "none";
      _0x568c99.suggestedCommentText = "";
      _0x568c99.suggestedText = "";
      return;
    }
    const _0x4f5633 = async _0x329f20 => {
      const _0x2675f8 = resolveSelfWarmupContentMode(_0x14d63d, _0x329f20);
      if (_0x2675f8 === "ai" && _0x51f0a2(_0x14d63d, _0x959e7b)) {
        return _0x200d41(_0x14d63d, _0x959e7b, _0x56661c, {
          title: "自热互动通知",
          url: ""
        }, {
          nickname: _0x568c99.nickname,
          text: _0x568c99.text,
          userUrl: _0x568c99.userUrl
        }, {
          forDm: _0x329f20,
          aiScene: "self_warmup",
          onRetry: (_0x287b41, _0x1f7d8a) => _0x16891a(_0x2ddbbf, (_0x329f20 ? "私信" : "评论") + " AI 生成第 " + _0x287b41 + " 次未成功：" + _0x1f7d8a, "warning")
        });
      }
      const _0x149561 = resolveSelfWarmupTemplatePayload(_0x14d63d, _0x568c99, {
        isDm: _0x329f20,
        fallback: _0x329f20 ? "你好 {nickname}，看到你的消息了，方便的话可以继续聊聊。" : "谢谢 {nickname}，看到你的评论啦。"
      });
      if (Array.isArray(_0x149561.text)) {
        return _0x149561.texts?.[0] || "";
      } else {
        return _0x149561.text || "";
      }
    };
    const _0x2e8e3b = [];
    let _0x36fea4 = "";
    let _0x2a998f = "";
    if (_0x130435) {
      try {
        _0x36fea4 = compactText(await _0x4f5633(false));
      } catch (_0x564f24) {
        _0x2e8e3b.push("评论：" + (_0x564f24.message || String(_0x564f24)));
      }
      _0x568c99.suggestedCommentText = _0x36fea4;
    }
    if (_0x19bef4) {
      try {
        _0x2a998f = compactText(await _0x4f5633(true));
      } catch (_0x711ba7) {
        _0x2e8e3b.push("私信：" + (_0x711ba7.message || String(_0x711ba7)));
      }
      _0x568c99.suggestedDmText = _0x2a998f;
    }
    _0x568c99.suggestedText = _0x568c99.eventType === "message" ? _0x2a998f : _0x36fea4 || _0x2a998f;
    _0x568c99.suggestionStatus = _0x36fea4 || _0x2a998f ? "ready" : _0x2e8e3b.length ? "failed" : "none";
    _0x568c99.suggestionErrorReason = _0x2e8e3b.join("；");
    if (_0x2e8e3b.length) {
      _0x568c99.judgeReason = _0x568c99.judgeReason ? _0x568c99.judgeReason + "；建议生成失败：" + _0x568c99.suggestionErrorReason : "建议生成失败：" + _0x568c99.suggestionErrorReason;
    }
  }
  async function _0x4a0e86(_0x15bdf8, _0x20ba8f, _0x5f2c83) {
    if (!_0x20ba8f.enableWebhook || !_0x20ba8f.webhookUrl || !_0x5f2c83.length) {
      return 0;
    }
    const _0x678be = _0x5f2c83.slice(0, 20).map((_0xab03f1, _0x2baa4a) => {
      const _0x530788 = _0xab03f1.userUrl ? "[" + (_0xab03f1.nickname || "用户") + "](" + _0xab03f1.userUrl + ")" : _0xab03f1.nickname || "用户";
      const _0x37dfc8 = _0xab03f1.suggestedText ? "\n   - 建议：" + _0xab03f1.suggestedText : "";
      return _0x2baa4a + 1 + ". " + _0xab03f1.eventLabel + " · " + _0x530788 + "\n   - 内容：" + (_0xab03f1.text || _0xab03f1.eventLabel) + "\n   - 时间：" + (_0xab03f1.timeText || "最新") + _0x37dfc8;
    });
    const _0x4c86eb = {
      title: "自热互动新动态",
      content: "本轮发现 " + _0x5f2c83.length + " 条新互动：\n\n" + _0x678be.join("\n\n"),
      time: new Date().toLocaleString(),
      items: _0x5f2c83
    };
    try {
      const _0x2ab453 = buildWebhookPayload(_0x20ba8f.webhookType || "feishu", _0x4c86eb);
      const _0x410406 = _0x20ba8f.webhookType === "dingtalk" ? signDingtalkUrl(_0x20ba8f.webhookUrl, _0x20ba8f.webhookSecret) : _0x20ba8f.webhookUrl;
      const _0x3fca24 = await axios.post(_0x410406, _0x2ab453, {
        timeout: 10000
      });
      const _0xb310df = isWebhookResponseSuccess(_0x20ba8f.webhookType || "feishu", _0x3fca24);
      _0x5f2c83.forEach(_0x5f461d => {
        _0x5f461d.webhookStatus = _0xb310df ? "success" : "failed";
        if (!_0xb310df) {
          _0x5f461d.webhookErrorReason = "Webhook 返回异常";
        }
      });
      _0x16891a(_0x15bdf8, _0xb310df ? "Webhook 已推送 " + _0x5f2c83.length + " 条新互动" : "Webhook 返回异常", _0xb310df ? "success" : "warning");
      if (_0xb310df) {
        return _0x5f2c83.length;
      } else {
        return 0;
      }
    } catch (_0x27cbfe) {
      const _0x1a04f7 = _0x27cbfe.message || String(_0x27cbfe);
      _0x5f2c83.forEach(_0x3064ce => {
        _0x3064ce.webhookStatus = "failed";
        _0x3064ce.webhookErrorReason = _0x1a04f7;
      });
      _0x16891a(_0x15bdf8, "Webhook 推送失败：" + _0x27cbfe.message, "warning");
      return 0;
    }
  }
  function _0x176277(_0x54883a, _0x5c2f0b = 0, _0x2e8168 = null) {
    const _0x2ebab4 = {
      checks: 1,
      eventsTotal: _0x54883a.length,
      notifications: _0x54883a.filter(_0x4030a3 => _0x4030a3.source === "notification").length,
      comments: _0x54883a.filter(_0x3e9a4e => _0x3e9a4e.eventType === "comment").length,
      replies: _0x54883a.filter(_0x550e6b => _0x550e6b.eventType === "reply").length,
      likes: _0x54883a.filter(_0x5a72b1 => _0x5a72b1.eventType === "like").length,
      follows: _0x54883a.filter(_0x5e2e41 => _0x5e2e41.eventType === "follow").length,
      messages: _0x54883a.filter(_0x47e736 => _0x47e736.eventType === "message").length,
      matched: _0x54883a.filter(_0x3741a5 => _0x3741a5.matched).length,
      suggestions: _0x54883a.filter(_0x13ccd7 => _0x13ccd7.suggestionStatus === "ready").length,
      actionsExecuted: _0x2e8168 == null ? _0x54883a.filter(_0xd238eb => (_0xd238eb.actionsTaken || []).length > 0).length : Math.max(0, Number(_0x2e8168) || 0),
      webhookPushed: _0x5c2f0b,
      lastCycleEvents: _0x54883a.length,
      lastCycleAt: Date.now()
    };
    return _0x2ebab4;
  }
  function _0x6889de(_0x409ece = {}) {
    if (_0x409ece.actionStatus !== "failed" || (_0x409ece.actionsTaken || []).length > 0) {
      return false;
    }
    const _0x4efbe5 = compactText(_0x409ece.actionErrorReason || _0x409ece.actionSummary);
    if (!_0x4efbe5) {
      return false;
    }
    if (/超时|未确认|疑似|输入框仍有内容|点击发送后|发送结果校验/.test(_0x4efbe5)) {
      return false;
    }
    return /未打开|未找到|缺少|未加载完成|页面脚本异常|读取.*异常/.test(_0x4efbe5);
  }
  function _0x3b8774(_0x40b738, _0x2e0e48) {
    const _0x19571e = buildSelfWarmupEventSeenKey(_0x2e0e48);
    const _0x467b10 = _0x40b738.findIndex(_0x35422b => buildSelfWarmupEventSeenKey(_0x35422b) === _0x19571e);
    if (_0x467b10 >= 0) {
      _0x40b738[_0x467b10] = _0x2e0e48;
    } else {
      _0x40b738.push(_0x2e0e48);
    }
  }
  async function _0x4a7944(_0x21b7b6, _0x2be0ac, _0x2e0443, _0x388b20, _0x29ef57) {
    const _0x6f3e8b = _0x388b20.find(_0x3f1e2f => String(_0x3f1e2f.id) === String(_0x2be0ac)) || {
      id: _0x2be0ac
    };
    const _0x38eb5b = await _0x4def12(_0x6f3e8b);
    const _0x5d47a8 = _0x6f3e8b.nickname || _0x6f3e8b.name || String(_0x2be0ac);
    if (_0x38eb5b?.webContents?.id) {
      _0x2dc815.set(_0x38eb5b.webContents.id, {
        taskId: _0x21b7b6,
        accountId: String(_0x2be0ac),
        accountName: _0x5d47a8
      });
    }
    _0x16891a(_0x21b7b6, "账号 " + _0x5d47a8 + " 开始检查：进入精选页并确认登录状态", "info");
    const _0x3bca8b = await _0x5dc0a0(_0x38eb5b, _0x21b7b6);
    if (!isWarmupSurfaceComplete(_0x3bca8b) && _0x3bca8b.status !== "login-required") {
      _0x16891a(_0x21b7b6, "账号 " + (_0x6f3e8b.nickname || _0x6f3e8b.name || _0x2be0ac) + " 精选页尚未就绪，本轮不推进（" + _0x15d169(_0x3bca8b) + "）", "warning");
      return {
        events: 0,
        matched: 0,
        incomplete: true
      };
    }
    const _0xe5ab9a = await _0x47e0f7(_0x38eb5b, _0x6f3e8b);
    if (!_0xe5ab9a.loggedIn) {
      _0x16891a(_0x21b7b6, "账号 " + (_0x6f3e8b.nickname || _0x6f3e8b.name || _0x2be0ac) + " 未登录，跳过本轮（" + _0xe5ab9a.reason + "）", "warning");
      return {
        events: 0,
        matched: 0
      };
    }
    if (_0xe5ab9a.assumedFromAccountPool) {
      _0x16891a(_0x21b7b6, "账号 " + (_0x6f3e8b.nickname || _0x6f3e8b.name || _0x2be0ac) + " 按账号池已登录状态继续检查", "info");
    }
    const _0x47c73d = [];
    let _0x59dd5d = false;
    const _0x7ea111 = _0x2e0443.watchComments !== false || _0x2e0443.watchReplies !== false || _0x2e0443.watchLikes !== false || _0x2e0443.watchFollows !== false;
    let _0x25d3e4 = false;
    ensureSelfWarmupNoticeJsonBridge();
    if (_0x7ea111) {
      _0x16891a(_0x21b7b6, "账号 " + _0x5d47a8 + " 正在打开通知面板并等待通知列表稳定…", "info");
      const _0x565ffb = Date.now();
      const _0x37fdbb = await _0x1adc84(_0x38eb5b, "notification", {
        taskId: _0x21b7b6,
        reloadOnFailure: true
      });
      const _0x4e7177 = isWarmupSurfaceComplete(_0x37fdbb);
      const _0x583b83 = _0x38eb5b.webContents?.id;
      const _0x4d7154 = _0x583b83 ? latestNoticeJsonStore.get(_0x583b83 + ":notice") : null;
      const _0x1cbdb6 = !!_0x4d7154 && _0x4d7154.kind === "notice" && !!(Number(_0x4d7154.ts || 0) >= _0x565ffb);
      let _0x5315d0 = [];
      if (_0x1cbdb6) {
        _0x5315d0 = parseDouyinNoticeJson(_0x4d7154.data, _0x6f3e8b);
        if (_0x5315d0.length > 0) {
          console.log("[36m[Terminal-Only] 账号 " + (_0x6f3e8b.nickname || _0x6f3e8b.name || _0x2be0ac) + " 从本轮网络 JSON 中解析出 " + _0x5315d0.length + " 条有效通知事件[0m");
        }
      }
      const _0x7fd071 = _0x4e7177 ? await _0x2218da(_0x38eb5b) : [];
      const _0x1814b0 = _0x7fd071.map(_0x39e426 => _0x5abb0d(_0x39e426, _0x6f3e8b));
      const _0xbf2c3d = mergeSelfWarmupNoticeEvents([..._0x5315d0, ..._0x1814b0]);
      _0x25d3e4 = canCommitNotificationScan(_0x37fdbb, _0x5315d0.length);
      if (!_0x25d3e4) {
        _0x59dd5d = true;
        _0x16891a(_0x21b7b6, "账号 " + (_0x6f3e8b.nickname || _0x6f3e8b.name || _0x2be0ac) + " 通知面板未完整就绪，本轮不建立基线、不消费通知（" + _0x15d169(_0x37fdbb) + "）", "warning");
      } else {
        const _0x549282 = Math.max(0, _0x5315d0.length + _0x1814b0.length - _0xbf2c3d.length);
        _0x16891a(_0x21b7b6, "账号 " + _0x5d47a8 + " 通知扫描完成：网络 " + _0x5315d0.length + " 条、页面 " + _0x1814b0.length + " 条，来源合并后 " + _0xbf2c3d.length + " 条，来源重复 " + _0x549282 + " 条", "info");
      }
      _0x47c73d.push(..._0xbf2c3d);
    }
    const _0x187697 = getSeenKeys(_0x3c83bb, _0x21b7b6);
    const _0x3accd8 = new Set(_0x187697);
    const _0x572040 = getPendingEvents(_0x3c83bb, _0x21b7b6);
    const _0x18427e = new Set(_0x572040.map(_0x17d5f4 => buildSelfWarmupEventSeenKey(_0x17d5f4)));
    const _0x5a7239 = "self_warmup_baselines_" + _0x21b7b6;
    const _0x21ad57 = {
      ...(_0x3c83bb.get(_0x5a7239, {}) || {})
    };
    const _0x96fa9f = !!_0x21ad57[String(_0x2be0ac)];
    let _0x5c0ed9 = 0;
    const _0x431ee6 = new Set();
    const _0xe9978b = [];
    const _0x494021 = _0x166284 => {
      const _0x1e422c = {
        total: 0,
        queued: 0,
        baseline: 0,
        excluded: 0,
        notWatched: 0,
        unknown: 0,
        seen: 0,
        pending: 0,
        batchDuplicate: 0
      };
      _0x166284.forEach(_0x9507b6 => {
        _0x1e422c.total += 1;
        if (!_0xbcd816(_0x2e0443, _0x9507b6)) {
          _0x1e422c.notWatched += 1;
          return;
        }
        if (_0x9507b6.eventType === "unknown") {
          _0x1e422c.unknown += 1;
          return;
        }
        const _0x1366b6 = buildSelfWarmupEventSeenKey(_0x9507b6);
        if (_0x3accd8.has(_0x1366b6)) {
          _0x1e422c.seen += 1;
          return;
        }
        if (_0x18427e.has(_0x1366b6)) {
          _0x1e422c.pending += 1;
          return;
        }
        if (_0x431ee6.has(_0x1366b6)) {
          _0x1e422c.batchDuplicate += 1;
          return;
        }
        _0x431ee6.add(_0x1366b6);
        if (_0x9507b6.source === "notification" && !_0x96fa9f) {
          _0x3accd8.add(_0x1366b6);
          _0x187697.push(_0x1366b6);
          _0x5c0ed9 += 1;
          _0x1e422c.baseline += 1;
          return;
        }
        const _0x476222 = _0x158ff6(_0x2e0443, _0x9507b6);
        if (_0x476222) {
          _0x16891a(_0x21b7b6, (_0x9507b6.nickname || "私信会话") + " 已排除：" + _0x476222 + (_0x9507b6.isGroupChat ? "（群聊）" : ""), "info");
          _0x3accd8.add(_0x1366b6);
          _0x187697.push(_0x1366b6);
          _0x1e422c.excluded += 1;
          return;
        }
        const _0x38cca8 = {
          ..._0x9507b6,
          id: "warm_event_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
          ts: Date.now(),
          _attemptCount: 0,
          _queuedAt: Date.now(),
          _inFlightAt: 0
        };
        _0x572040.push(_0x38cca8);
        _0x18427e.add(_0x1366b6);
        _0xe9978b.push(_0x38cca8);
        _0x1e422c.queued += 1;
      });
      return _0x1e422c;
    };
    const _0x1c879b = _0x494021(_0x47c73d);
    if (_0x7ea111 && _0x25d3e4) {
      const _0x27a278 = _0x1c879b.seen + _0x1c879b.pending + _0x1c879b.batchDuplicate;
      _0x16891a(_0x21b7b6, "账号 " + _0x5d47a8 + " 通知过滤完成：候选 " + _0x1c879b.total + " 条，历史/待处理重复 " + _0x27a278 + " 条，新增待处理 " + _0x1c879b.queued + " 条，历史基线 " + _0x1c879b.baseline + " 条，规则排除 " + (_0x1c879b.excluded + _0x1c879b.notWatched + _0x1c879b.unknown) + " 条", "info");
    }
    if (!_0x96fa9f && _0x25d3e4) {
      _0x21ad57[String(_0x2be0ac)] = Date.now();
      _0x3c83bb.set(_0x5a7239, _0x21ad57);
      if (_0x5c0ed9 > 0) {
        _0x16891a(_0x21b7b6, "账号 " + (_0x6f3e8b.nickname || _0x6f3e8b.name || _0x2be0ac) + " 已建立 " + _0x5c0ed9 + " 条历史通知基线，不对旧互动执行动作", "info");
      }
    }
    saveSeenKeys(_0x3c83bb, _0x21b7b6, _0x187697);
    savePendingEvents(_0x3c83bb, _0x21b7b6, _0x572040);
    const _0x4f45b4 = [];
    const _0x2ad75d = new Set();
    const _0x1b052c = _0x8e689c => _0x8e689c?.source !== "dm" && _0x8e689c?.eventType !== "message";
    const _0x108ce3 = async _0x4637e3 => {
      const _0x1b8737 = _0x572040.filter(_0x4388d9 => String(_0x4388d9.accountId) === String(_0x2be0ac) && _0x4637e3(_0x4388d9) && !_0x2ad75d.has(_0x4388d9.id));
      if (!_0x1b8737.length) {
        return;
      }
      const _0x3672fb = _0x1b8737.some(_0x161d0e => _0x161d0e.eventType === "message") ? "私信" : "通知";
      _0x16891a(_0x21b7b6, "账号 " + _0x5d47a8 + " 本轮有 " + _0x1b8737.length + " 条" + _0x3672fb + "待处理", "info");
      const _0x4856b1 = _0x1b8737.filter(_0x3dc20d => !_0x3dc20d._evaluatedAt);
      if (_0x4856b1.length) {
        await _0x2d8af0(_0x21b7b6, String(_0x2be0ac), _0x6f3e8b, _0x2e0443, _0x4856b1);
        for (const _0x5a7287 of _0x4856b1) {
          await _0x5f58d3(_0x21b7b6, String(_0x2be0ac), _0x6f3e8b, _0x2e0443, _0x5a7287);
          _0x5a7287._evaluatedAt = Date.now();
          _0x3b8774(_0x572040, _0x5a7287);
        }
        savePendingEvents(_0x3c83bb, _0x21b7b6, _0x572040);
      }
      for (let _0x609415 = 0; _0x609415 < _0x1b8737.length; _0x609415 += 1) {
        const _0x5c475e = _0x1b8737[_0x609415];
        if (!_0x332b9f.has(_0x21b7b6)) {
          break;
        }
        const _0x40bcdc = _0x8b7897(_0x21b7b6, _0x2e0443, _0x5c475e).map(_0x5e96e9 => ACTION_LABELS[_0x5e96e9] || _0x5e96e9).join("、");
        _0x16891a(_0x21b7b6, "账号 " + _0x5d47a8 + " 处理 " + _0x3672fb + " " + (_0x609415 + 1) + "/" + _0x1b8737.length + "：" + formatEventBrief(_0x5c475e) + "；" + (_0x40bcdc ? "计划执行 " + _0x40bcdc : "没有匹配到自动动作"), "info");
        _0x2ad75d.add(_0x5c475e.id);
        const _0x6e08a6 = Number(_0x5c475e._inFlightAt) > 0;
        if (_0x6e08a6) {
          _0x5c475e.actionStatus = "failed";
          _0x5c475e.actionSummary = "上次动作执行中断";
          _0x5c475e.actionErrorReason = "上次动作执行中断，为避免重复回复或关注，本次不自动重试";
          _0x5c475e._inFlightAt = 0;
        } else if (_0x2e0443.enableAutoActions) {
          _0x5c475e._attemptCount = Number(_0x5c475e._attemptCount || 0) + 1;
          _0x5c475e._inFlightAt = Date.now();
          _0x3b8774(_0x572040, _0x5c475e);
          savePendingEvents(_0x3c83bb, _0x21b7b6, _0x572040);
          const _0x55cea1 = _0x1b8737.slice(_0x609415 + 1).some(_0x5cfcb8 => _0x8b7897(_0x21b7b6, _0x2e0443, _0x5cfcb8).includes("reply_dm"));
          await _0x4b9692(_0x21b7b6, String(_0x2be0ac), _0x6f3e8b, _0x38eb5b, _0x2e0443, _0x5c475e, {
            hasNextDm: _0x55cea1
          });
          _0x5c475e._inFlightAt = 0;
        } else {
          _0x5c475e.actionStatus = "none";
          _0x5c475e.actionSummary = "仅记录";
        }
        const _0x209b18 = !_0x6e08a6 && !_0x5c475e._immediateRetryPerformed && Number(_0x5c475e._attemptCount || 0) < 2 && _0x6889de(_0x5c475e);
        if (_0x209b18) {
          _0x3b8774(_0x572040, _0x5c475e);
          _0x16891a(_0x21b7b6, (_0x5c475e.nickname || "用户") + " 本次动作未进入发送阶段，将在下轮安全重试（" + _0x5c475e._attemptCount + "/2）", "warning");
        } else {
          const _0x106925 = buildSelfWarmupEventSeenKey(_0x5c475e);
          _0x3accd8.add(_0x106925);
          _0x187697.push(_0x106925);
          const _0x2473b3 = _0x572040.findIndex(_0xbfcc28 => buildSelfWarmupEventSeenKey(_0xbfcc28) === _0x106925);
          if (_0x2473b3 >= 0) {
            _0x572040.splice(_0x2473b3, 1);
          }
        }
        _0x4f45b4.push(_0x5c475e);
        _0x29ef57.appendEventRecord(_0x21b7b6, _0x5c475e);
        saveSeenKeys(_0x3c83bb, _0x21b7b6, _0x187697);
        savePendingEvents(_0x3c83bb, _0x21b7b6, _0x572040);
      }
    };
    await _0x108ce3(_0x1b052c);
    const _0x554158 = new Set();
    const _0x2d7a8b = _0x16347d => _0x16347d?.source === "dm" || _0x16347d?.eventType === "message";
    let _0x4f41de = false;
    if (_0x2e0443.watchMessages !== false) {
      const _0x2a1f20 = await _0x1da8b2(_0x38eb5b, "私信", ["[data-e2e=\"im-entry\"]"]);
      _0x16891a(_0x21b7b6, "账号 " + (_0x6f3e8b.nickname || _0x6f3e8b.name || _0x2be0ac) + " 检查 Chat 私信列表" + (_0x2a1f20.unread ? "（顶部有未读提示）" : "（不依赖顶部红点）") + "…", "info");
      const _0x18585a = await _0x5438e3(_0x38eb5b, {
        taskId: _0x21b7b6
      }).catch(_0x17e583 => ({
        status: "navigation-error",
        error: _0x17e583?.message || String(_0x17e583),
        rootCount: 0,
        rowCount: 0
      }));
      if (isWarmupSurfaceComplete(_0x18585a)) {
        const _0x4c4380 = await _0x17e343(_0x38eb5b, false);
        if (!_0x4c4380.ok) {
          _0x59dd5d = true;
          _0x16891a(_0x21b7b6, "账号 " + (_0x6f3e8b.nickname || _0x6f3e8b.name || _0x2be0ac) + " 私信列表读取失败，本轮保留待回复私信（" + (_0x4c4380.reason || "未知原因") + "）", "warning");
        } else if (_0x4c4380.list.length > 0) {
          _0x4f41de = canCommitDmScan({
            chatSurface: _0x18585a,
            messageScanOk: _0x4c4380.ok
          });
          const _0x5877de = _0x4c4380.list;
          const _0xa4ed16 = _0x5877de.map(_0x113ba2 => _0x174148(_0x113ba2, _0x6f3e8b)).filter(Boolean);
          _0xa4ed16.forEach(_0x4cf238 => _0x554158.add(buildSelfWarmupEventSeenKey(_0x4cf238)));
          const _0x20d498 = _0x494021(_0xa4ed16);
          _0x16891a(_0x21b7b6, "账号 " + _0x5d47a8 + " 私信过滤完成：未读 " + _0x20d498.total + " 条，历史/待处理重复 " + (_0x20d498.seen + _0x20d498.pending + _0x20d498.batchDuplicate) + " 条，新增待回复 " + _0x20d498.queued + " 条，规则排除 " + (_0x20d498.excluded + _0x20d498.notWatched + _0x20d498.unknown) + " 条", "info");
          saveSeenKeys(_0x3c83bb, _0x21b7b6, _0x187697);
          savePendingEvents(_0x3c83bb, _0x21b7b6, _0x572040);
        } else {
          _0x4f41de = canCommitDmScan({
            chatSurface: _0x18585a,
            messageScanOk: _0x4c4380.ok
          });
          _0x16891a(_0x21b7b6, "账号 " + (_0x6f3e8b.nickname || _0x6f3e8b.name || _0x2be0ac) + " Chat 列表无新未读私信", "info");
        }
      } else {
        _0x59dd5d = true;
        _0x16891a(_0x21b7b6, "账号 " + (_0x6f3e8b.nickname || _0x6f3e8b.name || _0x2be0ac) + " Chat 页面未完整就绪，本轮保留待回复私信（" + _0x15d169(_0x18585a) + "）", "warning");
      }
    }
    if (_0x4f41de) {
      await _0x108ce3(_0x25b05a => {
        if (_0x1b052c(_0x25b05a)) {
          return false;
        }
        if (_0x2d7a8b(_0x25b05a) && !_0x554158.has(buildSelfWarmupEventSeenKey(_0x25b05a))) {
          return false;
        }
        return true;
      });
      _0x572040.filter(_0x5d412b => String(_0x5d412b.accountId) === String(_0x2be0ac) && _0x2d7a8b(_0x5d412b) && !_0x2ad75d.has(_0x5d412b.id) && !_0x554158.has(buildSelfWarmupEventSeenKey(_0x5d412b))).forEach(_0x3143cb => {
        _0x3143cb.actionStatus = "skipped";
        _0x3143cb.actionSummary = "当前无未读红点，不自动回复";
        _0x16891a(_0x21b7b6, (_0x3143cb.nickname || "私信会话") + " 当前无未读红点，不自动回复", "info");
        _0x2ad75d.add(_0x3143cb.id);
        _0x4f45b4.push(_0x3143cb);
        const _0x3b1b14 = buildSelfWarmupEventSeenKey(_0x3143cb);
        _0x3accd8.add(_0x3b1b14);
        _0x187697.push(_0x3b1b14);
        const _0x5ac78f = _0x572040.findIndex(_0x141236 => buildSelfWarmupEventSeenKey(_0x141236) === _0x3b1b14);
        if (_0x5ac78f >= 0) {
          _0x572040.splice(_0x5ac78f, 1);
        }
        _0x29ef57.appendEventRecord(_0x21b7b6, _0x3143cb);
      });
    }
    saveSeenKeys(_0x3c83bb, _0x21b7b6, _0x187697);
    savePendingEvents(_0x3c83bb, _0x21b7b6, _0x572040);
    if (!_0x4f45b4.length) {
      _0x16891a(_0x21b7b6, "账号 " + (_0x6f3e8b.nickname || _0x6f3e8b.name || _0x2be0ac) + " 本轮无新互动", "info");
      const _0x3ef022 = _0x176277([]);
      _0x29ef57.incrementStats(_0x21b7b6, _0x3ef022);
      _0x318540(_0x21b7b6, {
        type: "stats-update",
        statsDelta: _0x3ef022,
        ts: Date.now()
      });
      await _0x71ecd4(_0x38eb5b, _0x2e0443);
      return {
        events: 0,
        matched: 0,
        incomplete: _0x59dd5d
      };
    }
    const _0x344b6a = _0x4f45b4.filter(_0xbc4d1e => _0xe9978b.includes(_0xbc4d1e));
    const _0x59f38f = await _0x4a0e86(_0x21b7b6, _0x2e0443, _0x344b6a);
    _0x4f45b4.forEach(_0x12fd87 => {
      _0x29ef57.appendEventRecord(_0x21b7b6, _0x12fd87);
      _0x318540(_0x21b7b6, {
        type: "event",
        event: _0x12fd87,
        ts: Date.now()
      });
    });
    const _0x30e99a = _0x4f45b4.filter(_0x4f7be9 => (_0x4f7be9.actionsTaken || []).length > 0).length;
    const _0x549548 = _0x176277(_0xe9978b, _0x59f38f, _0x30e99a);
    _0x29ef57.incrementStats(_0x21b7b6, _0x549548);
    _0x318540(_0x21b7b6, {
      type: "stats-update",
      statsDelta: _0x549548,
      ts: Date.now()
    });
    if (_0xe9978b.length) {
      _0x16891a(_0x21b7b6, formatNewEventsDiscoveryLog(_0x6f3e8b.nickname || _0x6f3e8b.name || _0x2be0ac, _0xe9978b), "success");
    } else if (_0x4f45b4.length) {
      _0x16891a(_0x21b7b6, "账号 " + (_0x6f3e8b.nickname || _0x6f3e8b.name || _0x2be0ac) + " 已处理 " + _0x4f45b4.length + " 条待重试互动", "info");
    }
    await _0x71ecd4(_0x38eb5b, _0x2e0443);
    return {
      events: _0xe9978b.length,
      matched: _0xe9978b.filter(_0x108e63 => _0x108e63.matched).length,
      incomplete: _0x59dd5d
    };
  }
  function _0x5cdd60(_0x24a70c = {}) {
    let _0x10e0f5 = Number(_0x24a70c.intervalSecondsMin);
    let _0x45bea0 = Number(_0x24a70c.intervalSecondsMax);
    if (!Number.isFinite(_0x10e0f5)) {
      _0x10e0f5 = 60;
    }
    if (!Number.isFinite(_0x45bea0)) {
      _0x45bea0 = 120;
    }
    if (_0x10e0f5 > _0x45bea0) {
      [_0x10e0f5, _0x45bea0] = [_0x45bea0, _0x10e0f5];
    }
    _0x10e0f5 = Math.max(20, Math.floor(_0x10e0f5));
    _0x45bea0 = Math.max(_0x10e0f5, Math.floor(_0x45bea0));
    return {
      min: _0x10e0f5,
      max: _0x45bea0
    };
  }
  function _0x42b3d1(_0x479eb4) {
    const {
      min: _0x5db246,
      max: _0x3f48c8
    } = _0x5cdd60(_0x479eb4);
    const _0x9956f9 = Math.floor(Math.random() * (_0x3f48c8 - _0x5db246 + 1)) + _0x5db246;
    return _0x9956f9 * 1000;
  }
  async function _0x2eedf0(_0x452c0a) {
    const _0x479acd = _0x332b9f.get(_0x452c0a);
    if (!_0x479acd || _0x479acd.running) {
      return;
    }
    _0x479acd.running = true;
    try {
      const {
        config: _0x38119f,
        accounts: _0x192919,
        selfWarmupTasksApi: _0x1367da
      } = _0x479acd;
      const _0x26159c = _0x38119f.selectedAccounts || [];
      let _0x3616f2 = 0;
      let _0x49ad6d = 0;
      let _0x10b1a4 = false;
      _0x16891a(_0x452c0a, "开始第 " + ((_0x1367da.findTaskById(_0x452c0a)?.stats?.checks || 0) + 1) + " 轮自动回复检查", "info");
      for (const _0x44db6f of _0x26159c) {
        if (!_0x332b9f.has(_0x452c0a)) {
          break;
        }
        const _0x4294b3 = _0x192919.find(_0x232f5e => String(_0x232f5e.id) === String(_0x44db6f)) || {
          id: _0x44db6f
        };
        try {
          const _0x418d68 = await _0x207a54(_0x44db6f, _0x452c0a, () => _0x4a7944(_0x452c0a, _0x44db6f, _0x38119f, _0x192919, _0x1367da));
          _0x3616f2 += _0x418d68?.events || 0;
          _0x49ad6d += _0x418d68?.matched || 0;
          _0x10b1a4 = _0x10b1a4 || !!_0x418d68?.incomplete;
        } catch (_0x571505) {
          _0x10b1a4 = true;
          _0x16891a(_0x452c0a, "账号 " + (_0x4294b3.nickname || _0x4294b3.name || _0x44db6f) + " 检查异常：" + _0x571505.message, "error");
          if (_0x571505?.code === "self_warmup_navigation_timeout" || _0x46d1ca.get(String(_0x44db6f))?.isDestroyed?.()) {
            _0x16891a(_0x452c0a, "自热页面响应异常，正在重建后台窗口后继续其他账号", "warning");
            try {
              await _0xe4a1d5(_0x4294b3);
            } catch (_0xf359fa) {
              _0x16891a(_0x452c0a, "自热窗口重建失败：" + _0xf359fa.message, "error");
            }
          }
        }
      }
      if (_0x3616f2 > 0) {
        _0x16891a(_0x452c0a, "本轮检查完成：处理 " + _0x3616f2 + " 条通知", "success");
      } else if (_0x10b1a4) {
        _0x16891a(_0x452c0a, "本轮检查完成：部分页面未就绪，状态已保留并将在下轮继续检查", "warning");
      } else {
        _0x16891a(_0x452c0a, "本轮检查完成：无新通知", "info");
      }
      _0x318540(_0x452c0a, {
        type: "cycle-done",
        ts: Date.now()
      });
    } catch (_0x3525ce) {
      _0x16891a(_0x452c0a, "轮询异常：" + _0x3525ce.message, "error");
    } finally {
      if (_0x332b9f.has(_0x452c0a)) {
        _0x332b9f.get(_0x452c0a).running = false;
      }
    }
  }
  function _0x2ec92f(_0x42c738) {
    if (!_0x42c738?.timer) {
      return;
    }
    clearTimeout(_0x42c738.timer);
    _0x42c738.timer = null;
  }
  function _0x4d0fb5() {
    if (_0x17b1c7 || _0x332b9f.size === 0) {
      return;
    }
    _0x17b1c7 = setInterval(() => {
      const _0x1a1caa = Date.now();
      _0x59110b();
      for (const [_0x522e1e, _0x32cf1d] of _0x332b9f.entries()) {
        if (_0x32cf1d.running || _0x32cf1d.triggering || !_0x32cf1d.nextRunAt) {
          continue;
        }
        if (_0x1a1caa < _0x32cf1d.nextRunAt + _0x42421a) {
          continue;
        }
        _0x108c05(_0x522e1e, "watchdog").catch(_0x502ad3 => {
          _0x16891a(_0x522e1e, "到点守护补触发失败：" + (_0x502ad3.message || _0x502ad3), "error");
        });
      }
    }, _0x1554e4);
  }
  function _0x39b8ca() {
    if (_0x332b9f.size > 0 || !_0x17b1c7) {
      return;
    }
    clearInterval(_0x17b1c7);
    _0x17b1c7 = null;
  }
  function _0x31e1d4(_0x334583, _0x1b0c1f, _0xd4a9fc = "poll") {
    const _0x18047c = _0x332b9f.get(_0x334583);
    if (!_0x18047c) {
      return false;
    }
    _0x2ec92f(_0x18047c);
    const _0x487a4d = Math.max(0, Math.floor(Number(_0x1b0c1f) || 0));
    const _0x2911c4 = Date.now();
    _0x18047c.scheduledAt = _0x2911c4;
    _0x18047c.plannedDelayMs = _0x487a4d;
    _0x18047c.nextRunAt = _0x2911c4 + _0x487a4d;
    _0x18047c.scheduleKind = _0xd4a9fc;
    _0x18047c.timer = setTimeout(() => {
      const _0xe40402 = _0x332b9f.get(_0x334583);
      if (_0xe40402) {
        _0xe40402.timer = null;
      }
      _0x108c05(_0x334583, "timer").catch(_0x3e1871 => {
        _0x16891a(_0x334583, "检查定时器触发异常：" + (_0x3e1871.message || _0x3e1871), "error");
      });
    }, _0x487a4d);
    _0x4d0fb5();
    return true;
  }
  function _0x2e4cb7(_0xe5bb7e) {
    const _0x3838dc = _0x332b9f.get(_0xe5bb7e);
    if (!_0x3838dc?.nextRunAt || _0x3838dc.running || _0x3838dc.triggering) {
      return false;
    }
    _0x2ec92f(_0x3838dc);
    const _0x4e4abe = Math.max(0, _0x3838dc.nextRunAt - Date.now());
    _0x3838dc.timer = setTimeout(() => {
      const _0x31fa70 = _0x332b9f.get(_0xe5bb7e);
      if (_0x31fa70) {
        _0x31fa70.timer = null;
      }
      _0x108c05(_0xe5bb7e, "timer").catch(_0x457789 => {
        _0x16891a(_0xe5bb7e, "检查定时器触发异常：" + (_0x457789.message || _0x457789), "error");
      });
    }, _0x4e4abe);
    _0x4d0fb5();
    return true;
  }
  async function _0x108c05(_0x184eb6, _0x6553d5 = "timer") {
    const _0x5878e7 = _0x332b9f.get(_0x184eb6);
    if (!_0x5878e7 || _0x5878e7.running || _0x5878e7.triggering) {
      return false;
    }
    _0x5878e7.triggering = true;
    _0x2ec92f(_0x5878e7);
    const _0x3aec34 = Number(_0x5878e7.nextRunAt) || Date.now();
    const _0x312977 = Math.max(0, Date.now() - _0x3aec34);
    const _0x371c40 = _0x5878e7.scheduleKind || "poll";
    _0x5878e7.nextRunAt = null;
    _0x5878e7.scheduledAt = null;
    _0x5878e7.plannedDelayMs = null;
    _0x5878e7.scheduleKind = null;
    const _0x2be0b1 = (_0x312977 / 1000).toFixed(_0x312977 >= 1000 ? 1 : 2);
    if (_0x371c40 === "initial") {
      _0x16891a(_0x184eb6, "首次检查定时器已触发（误差 " + _0x2be0b1 + " 秒），开始执行", "info");
    } else if (_0x6553d5 === "watchdog") {
      _0x16891a(_0x184eb6, "到点守护检测到检查已到期，延迟 " + _0x2be0b1 + " 秒后补触发", "warning");
    } else if (_0x6553d5 === "system-resume") {
      _0x16891a(_0x184eb6, "系统恢复后发现检查已到期，延迟 " + _0x2be0b1 + " 秒后立即补触发", "warning");
    } else if (_0x6553d5 === "app-focus") {
      _0x16891a(_0x184eb6, "回到前台后发现检查已到期，延迟 " + _0x2be0b1 + " 秒后立即补触发", "warning");
    } else if (_0x312977 >= _0x4c7e6d) {
      _0x16891a(_0x184eb6, "检查定时器延迟 " + _0x2be0b1 + " 秒后触发，开始本轮", "warning");
    }
    acquireTaskRuntimeGuard(_0x481c3d(_0x184eb6), {
      type: "self-warmup",
      taskId: _0x184eb6
    });
    _0x59110b();
    try {
      await _0x2eedf0(_0x184eb6);
      return true;
    } finally {
      const _0x4c72ad = _0x332b9f.get(_0x184eb6);
      if (_0x4c72ad === _0x5878e7) {
        _0x4c72ad.triggering = false;
        _0x225e69(_0x184eb6);
      }
    }
  }
  function _0x225e69(_0x292891) {
    const _0x52ce98 = _0x332b9f.get(_0x292891);
    if (!_0x52ce98) {
      return;
    }
    const {
      min: _0x282bc3,
      max: _0x21193e
    } = _0x5cdd60(_0x52ce98.config);
    const _0x1303c8 = _0x42b3d1(_0x52ce98.config);
    _0x16891a(_0x292891, "下次检查约 " + Math.round(_0x1303c8 / 1000) + " 秒后（区间 " + _0x282bc3 + "-" + _0x21193e + "s 随机）", "info");
    _0x31e1d4(_0x292891, _0x1303c8, "poll");
  }
  function _0x5ae646(_0x43e91a = "system-resume") {
    const _0x1446ce = Date.now();
    let _0x239130 = 0;
    _0x59110b();
    for (const [_0x26aa47, _0x465eb3] of _0x332b9f.entries()) {
      acquireTaskRuntimeGuard(_0x481c3d(_0x26aa47), {
        type: "self-warmup",
        taskId: _0x26aa47
      });
      if (_0x465eb3.running || _0x465eb3.triggering || !_0x465eb3.nextRunAt) {
        continue;
      }
      if (_0x465eb3.nextRunAt <= _0x1446ce) {
        _0x239130 += 1;
        _0x108c05(_0x26aa47, _0x43e91a).catch(_0x4ffa89 => {
          _0x16891a(_0x26aa47, "调度补触发失败（" + _0x43e91a + "）：" + (_0x4ffa89.message || _0x4ffa89), "error");
        });
        continue;
      }
      const _0x2837df = !_0x465eb3.timer;
      if (_0x2837df || _0x43e91a === "system-resume") {
        _0x2e4cb7(_0x26aa47);
        _0x239130 += 1;
        if (_0x43e91a === "system-resume") {
          _0x16891a(_0x26aa47, "系统恢复，检查计划仍有效，将在约 " + Math.ceil((_0x465eb3.nextRunAt - _0x1446ce) / 1000) + " 秒后开始下一轮", "info");
        } else if (_0x2837df) {
          _0x16891a(_0x26aa47, "检测到检查定时器丢失，已重建，约 " + Math.ceil((_0x465eb3.nextRunAt - _0x1446ce) / 1000) + " 秒后开始下一轮", "warning");
        }
      }
    }
    return _0x239130;
  }
  function _0x4c3713() {
    return _0x5ae646("system-resume");
  }
  function _0x5130e2() {
    return _0x5ae646("app-focus");
  }
  function _0x26c141(_0x5672e2, _0x4e55b2, _0x58e1da) {
    const _0x14e2a5 = _0x5672e2.id;
    _0x41a215(_0x14e2a5);
    const _0x5f56c8 = _0x5672e2.configSnapshot || {};
    const {
      min: _0x1155d4,
      max: _0x4916fd
    } = _0x5cdd60(_0x5f56c8);
    _0x332b9f.set(_0x14e2a5, {
      timer: null,
      config: _0x5f56c8,
      accounts: _0x4e55b2,
      selfWarmupTasksApi: _0x58e1da,
      running: false,
      triggering: false,
      scheduledAt: null,
      plannedDelayMs: null,
      nextRunAt: null,
      scheduleKind: null,
      actionLimitState: createAccountActionLimitStore(_0x5f56c8, ACCOUNT_ACTION_LIMIT_SPECS, (_0x4e55b2 || []).map(_0x4dd5fe => _0x4dd5fe?.id).filter(Boolean)),
      actionLimitReachedLogged: new Set()
    });
    acquireTaskRuntimeGuard(_0x481c3d(_0x14e2a5), {
      type: "self-warmup",
      taskId: _0x14e2a5
    });
    _0x16891a(_0x14e2a5, "自热互动已启动，检查间隔 " + _0x1155d4 + "-" + _0x4916fd + " 秒（每轮随机）", "success");
    const _0x112ad4 = formatAccountActionLimitSummary(_0x332b9f.get(_0x14e2a5).actionLimitState);
    const _0x2c302f = Object.values(_0x332b9f.get(_0x14e2a5).actionLimitState?.template?.limits || {}).some(_0x3f3daf => _0x3f3daf?.enabled);
    _0x16891a(_0x14e2a5, _0x2c302f ? "动作数量限制：" + _0x112ad4 : "动作数量限制：全部不限（未开启「单账号限制数量」）", "info");
    _0x16891a(_0x14e2a5, "私信策略：" + (_0x5f56c8.excludeGroupChats !== false ? "排除群聊" : "包含群聊") + "；评论回复/主页私信/私信回复失败后约 10 秒重试 1 次", "info");
    _0x16891a(_0x14e2a5, "回复内容：评论使用" + (resolveSelfWarmupContentMode(_0x5f56c8, false) === "ai" ? "AI 生成" : "自定义模板") + "；私信使用" + (resolveSelfWarmupContentMode(_0x5f56c8, true) === "ai" ? "AI 生成" : "固定话术"), "info");
    _0x31e1d4(_0x14e2a5, 3000, "initial");
    _0x4d0fb5();
    return true;
  }
  function _0x41a215(_0x298d4f) {
    const _0x319a3d = _0x332b9f.get(_0x298d4f);
    if (!_0x319a3d) {
      return false;
    }
    _0x2ec92f(_0x319a3d);
    _0x332b9f.delete(_0x298d4f);
    for (const [_0xc443b0, _0x45f140] of _0x2dc815.entries()) {
      if (_0x45f140.taskId === _0x298d4f) {
        _0x2dc815.delete(_0xc443b0);
      }
    }
    releaseTaskRuntimeGuard(_0x481c3d(_0x298d4f));
    _0x16891a(_0x298d4f, "自热互动已停止", "info");
    _0x39b8ca();
    if (_0x332b9f.size === 0) {
      _0x7f0fbf();
    }
    return true;
  }
  function _0x5ed22d() {
    [..._0x332b9f.keys()].forEach(_0xa29504 => _0x41a215(_0xa29504));
    _0x7f0fbf();
  }
  function _0x72857e(_0x2bf418, _0x2575de) {
    const _0x7efe4e = _0x332b9f.get(_0x2bf418);
    if (!_0x7efe4e) {
      return false;
    }
    _0x7efe4e.config = _0x2575de || {};
    _0x7efe4e.actionLimitState = _0x812251(_0x7efe4e);
    _0x7efe4e.actionLimitReachedLogged = new Set();
    _0x16891a(_0x2bf418, "动作数量限制已按新配置重置：" + formatAccountActionLimitSummary(_0x7efe4e.actionLimitState), "info");
    return true;
  }
  async function _0x221c01(_0x1c5f56, _0x2d42f9 = "") {
    const _0x52a9d6 = _0x332b9f.get(_0x1c5f56);
    if (!_0x52a9d6) {
      return {
        success: false,
        msg: "该自热互动任务未在运行"
      };
    }
    const _0x7e85ff = Array.isArray(_0x52a9d6.config?.selectedAccounts) ? _0x52a9d6.config.selectedAccounts : [];
    const _0x1da287 = _0x2d42f9 ? _0x7e85ff.filter(_0x1d524c => String(_0x1d524c) === String(_0x2d42f9)) : _0x7e85ff;
    if (!_0x1da287.length) {
      return {
        success: false,
        msg: "任务没有可监控账号"
      };
    }
    let _0x31fe02 = 0;
    for (const _0x54b81c of _0x1da287) {
      const _0x18b346 = _0x52a9d6.accounts.find(_0x25a898 => String(_0x25a898.id) === String(_0x54b81c)) || {
        id: _0x54b81c
      };
      try {
        let _0xdc2304 = _0x46d1ca.get(String(_0x54b81c));
        if (!_0xdc2304 || _0xdc2304.isDestroyed()) {
          _0xdc2304 = await _0x4def12(_0x18b346);
        }
        const _0x26c460 = showHiddenAutomationWindow(_0xdc2304, {
          title: "自热互动监控 - " + (_0x18b346.nickname || _0x18b346.name || _0x54b81c),
          width: 1280,
          height: 820
        });
        if (_0x26c460) {
          _0x3e438b(_0xdc2304, true);
          _0x31fe02 += 1;
        }
        const _0x2248e9 = String(_0xdc2304.webContents?.getURL?.() || "");
        if (!_0x2248e9 || /^about:blank$/i.test(_0x2248e9) || !/douyin\.com/i.test(_0x2248e9)) {
          _0x12d98a(_0xdc2304, "https://www.douyin.com/jingxuan").catch(_0x434f6e => {
            console.warn("[SelfWarmup] 监控窗口补载首页失败 " + _0x54b81c + ":", _0x434f6e?.message || _0x434f6e);
          });
        }
      } catch (_0x16694f) {
        console.warn("[SelfWarmup] 打开监控窗口失败 " + _0x54b81c + ":", _0x16694f?.message || _0x16694f);
      }
    }
    if (_0x31fe02 <= 0) {
      return {
        success: false,
        msg: "打开监控窗口失败"
      };
    }
    _0x16891a(_0x1c5f56, _0x31fe02 > 1 ? "已打开运行监控窗口（" + _0x31fe02 + " 个账号）" : "已打开账号监控窗口", "info");
    return {
      success: true,
      shown: _0x31fe02,
      accountId: String(_0x1da287[0])
    };
  }
  function _0x380146(_0x507074, _0x10974c = "") {
    const _0x1d9012 = _0x332b9f.get(_0x507074);
    const _0x148468 = Array.isArray(_0x1d9012?.config?.selectedAccounts) ? _0x1d9012.config.selectedAccounts : [];
    const _0x4e0dfb = _0x10974c ? [String(_0x10974c)] : _0x148468.length ? _0x148468.map(String) : [..._0x46d1ca.keys()];
    let _0x2e4205 = 0;
    for (const _0x354107 of _0x4e0dfb) {
      const _0x5c1196 = _0x46d1ca.get(String(_0x354107));
      if (!_0x5c1196 || _0x5c1196.isDestroyed()) {
        continue;
      }
      if (hideVisibleAutomationWindow(_0x5c1196)) {
        _0x182ba5(_0x5c1196);
        _0x2e4205 += 1;
      }
    }
    return {
      success: true,
      hidden: _0x2e4205
    };
  }
  function _0x3aef30() {
    return [..._0x332b9f.keys()].map(String);
  }
  function _0x28309f() {
    return [..._0x46d1ca.values()].filter(_0x1bb6cf => _0x1bb6cf && !_0x1bb6cf.isDestroyed()).map(_0x4cfe45 => _0x4cfe45.webContents).filter(_0x4d8b7a => _0x4d8b7a && !_0x4d8b7a.isDestroyed?.());
  }
  return {
    startTask: _0x26c141,
    stopTask: _0x41a215,
    stopAll: _0x5ed22d,
    updateTaskConfig: _0x72857e,
    showTaskWindow: _0x221c01,
    hideTaskWindow: _0x380146,
    destroyWarmupWindows: _0x7f0fbf,
    handleSystemResume: _0x4c3713,
    handleAppFocus: _0x5130e2,
    listWebContents: _0x28309f,
    listRunningTaskIds: _0x3aef30,
    getTaskLogs: _0x14fcba,
    getAllTaskLogs: _0x647eb8,
    clearTaskLogs: _0x660cbc
  };
}
module.exports = {
  createSelfWarmupRunner: createSelfWarmupRunner
};
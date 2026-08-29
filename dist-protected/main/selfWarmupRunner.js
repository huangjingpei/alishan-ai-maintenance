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
function resolveSelfWarmupVideoUrl(arg1, arg2 = null) {
  return buildDouyinCommentLocateUrl(arg1, arg2) || String(arg1 || "").trim();
}
function isSelfWarmupVideoPageUrl(arg1) {
  const result = String(arg1 || "");
  return /\/video\/|\/note\/|modal_id=/.test(result);
}
let selfWarmupDmLogBridgeReady = false;
let selfWarmupDmLogSink = null;
function ensureSelfWarmupDmLogBridge() {
  if (selfWarmupDmLogBridgeReady) {
    return;
  }
  selfWarmupDmLogBridgeReady = true;
  ipcMain.on("self-warmup-dm-log", (arg1, options = {}) => {
    const result = String(options.message || "").trim();
    const value = options.extra && typeof options.extra === "object" ? options.extra : null;
    if (result) {
      const value2 = value && Object.keys(value).length ? " | " + JSON.stringify(value) : "";
      console.log(result.startsWith("[SelfWarmup-DM]") ? "" + result + value2 : "[SelfWarmup-DM] " + result + value2);
      try {
        selfWarmupDmLogSink?.(arg1, {
          ...options,
          message: result,
          extra: value
        });
      } catch (error) {}
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
  ipcMain.on("self-warmup-notice-json", (arg1, options = {}) => {
    try {
      const local = arg1.sender?.id;
      if (local && options?.data) {
        latestNoticeJsonStore.set(local + ":notice", {
          data: options.data,
          url: options.url || "",
          kind: "notice",
          ts: Date.now()
        });
      }
    } catch (error) {}
  });
  ipcMain.on("self-warmup-im-json", (arg1, options = {}) => {
    try {
      const local = arg1.sender?.id;
      if (local && options?.data) {
        latestNoticeJsonStore.set(local + ":im", {
          data: options.data,
          url: options.url || "",
          kind: "im",
          ts: Date.now()
        });
      }
    } catch (error) {}
  });
}
function parseDouyinNoticeJson(arg1, options = {}) {
  if (!arg1 || typeof arg1 !== "object") {
    return [];
  }
  const result = collectNoticeItems(arg1);
  if (!Array.isArray(result) || result.length === 0) {
    return [];
  }
  const list = [];
  for (const item of result) {
    try {
      const result = Number(item.notice_type || item.group_type || item.type || 0);
      const local = item.user || item.from_user || item.comment?.user || item.content?.user || {};
      const result2 = compactText(local.nickname || local.name || "");
      const value = local.sec_uid ? "https://www.douyin.com/user/" + local.sec_uid : "";
      const local2 = item.comment || item.content?.comment || {};
      const result3 = compactText(local2.text || local2.content || "");
      const result4 = extractNoticeCommentId(item);
      const result5 = extractNoticeAwemeId(item);
      const value2 = result5 ? resolveSelfWarmupVideoUrl("https://www.douyin.com/video/" + result5, result4) : "";
      let text = "unknown";
      let text2 = "";
      if (result === 1 || result === 11 || item.like || /like/i.test(item.type_name || "")) {
        text = "like";
        text2 = "赞了你的作品";
      } else if (result === 2 || result === 12 || result3 || /comment|reply/i.test(item.type_name || "")) {
        if (local2.reply_id || local2.reply_comment || /回复/i.test(result3)) {
          text = "reply";
          text2 = "回复了你";
        } else {
          text = "comment";
          text2 = "评论了你的作品";
        }
      } else if (result === 3 || result === 13 || item.follow || /follow/i.test(item.type_name || "")) {
        text = "follow";
        text2 = "关注了你";
      }
      if (text === "unknown" && !result3 && !result2) {
        continue;
      }
      const local3 = (Array.isArray(item.notice_list) || Array.isArray(item.notices) || Array.isArray(item.children)) && !result2 && !result3;
      if (local3) {
        continue;
      }
      list.push({
        source: "notification",
        eventType: text,
        nickname: result2 || "抖音用户",
        userUrl: value,
        text: result3 || text2,
        rowText: result2 + " " + text2 + " " + result3,
        eventText: text2,
        videoUrl: value2,
        commentId: result4,
        cid: result4,
        createTime: item.create_time ? item.create_time * 1000 : Date.now(),
        unread: !item.is_read,
        accountName: options.name || options.nickname || "",
        accountId: options.id || ""
      });
    } catch (error) {}
  }
  return list;
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
function delay(arg1) {
  return new Promise(arg12 => setTimeout(arg12, arg1));
}
function compactText(arg1) {
  return String(arg1 || "").replace(/[\u200b-\u200f\u202a-\u202e\u2060-\u206f]/g, "").replace(/\s+/g, " ").trim();
}
function cleanDmDeliveredSnippet(arg1) {
  return compactText(arg1).replace(/(?:\s*[·•]?\s*(?:点赞|回复|撤回|删除|复制|举报|多选|转发))+$/u, "").trim();
}
function formatDmDeliveredLog(arg1, options = {}) {
  const local = cleanDmDeliveredSnippet(options.sentText) || cleanDmDeliveredSnippet(options.debug?.snippet);
  if (local) {
    return (arg1 || "用户") + " 私信回复已确认送达：" + local;
  } else {
    return (arg1 || "用户") + " 私信回复已确认送达";
  }
}
function sanitizeDmNickname(arg1, text = "", text2 = "") {
  let result = compactText(arg1);
  if (!result) {
    return "";
  }
  const result2 = compactText(text);
  const result3 = compactText(text2);
  result = result.replace(/(?:\s|[·•])*\d+\+?\s*$/u, "").trim();
  if (result3 && result.endsWith(result3)) {
    result = result.slice(0, -result3.length).replace(/(?:\s|[·•])+$/u, "").trim();
  } else {
    result = result.replace(/(?:\s|[·•])*(?:刚刚|\d+秒前|\d+分钟前|\d+小时前|\d+天前|昨天|前天|星期[一二三四五六日天]|\d{1,2}:\d{2})$/u, "").trim();
  }
  if (result2 && result.length > result2.length) {
    if (result.endsWith(result2)) {
      result = result.slice(0, -result2.length).replace(/(?:\s|[·•])+$/u, "").trim();
    } else {
      const result3 = result.indexOf(result2);
      if (result3 > 0) {
        const result2 = result.slice(0, result3).replace(/(?:\s|[·•])+$/u, "").trim();
        if (result2) {
          result = result2;
        }
      }
    }
  }
  const result4 = result.split(/\s*[·•]\s*/).map(arg1 => compactText(arg1)).filter(Boolean);
  if (result4.length >= 2 && result4[0].length <= 40) {
    result = result4[0];
  }
  return result || compactText(arg1);
}
function formatEventBrief(arg1, {
  maxText = 36
} = {}) {
  const local = arg1?.eventLabel || EVENT_TYPE_LABELS[arg1?.eventType] || "通知";
  const local2 = compactText(arg1?.nickname) || "用户";
  const result = compactText(arg1?.text);
  const result2 = result.slice(0, maxText);
  const value = result2 ? "「" + result2 + (result.length > maxText ? "…" : "") + "」" : "（无正文摘要）";
  return local + " · @" + local2 + " " + value;
}
function formatNewEventsDiscoveryLog(arg1, arg2) {
  const value = Array.isArray(arg2) ? arg2 : [];
  if (value.length === 1) {
    return "账号 " + arg1 + " 发现 1 条新通知：" + formatEventBrief(value[0]);
  }
  const value2 = value.filter(arg1 => arg1.matched).length;
  const result = value.slice(0, 5).map((arg1, arg2) => "  " + (arg2 + 1) + ". " + formatEventBrief(arg1));
  const value3 = value.length > 5 ? " (另有 " + (value.length - 5) + " 条)" : "";
  return "账号 " + arg1 + " 发现 " + value.length + " 条新通知（跟进 " + value2 + " 条）：\n" + result.join("\n") + value3;
}
function splitList(arg1) {
  return String(arg1 || "").split(/[\n,，、;；]+/).map(arg1 => arg1.trim()).filter(Boolean);
}
function parseNotificationType(arg1) {
  const result = compactText(arg1);
  if (/回复了你|回复了你的评论|回复你的评论/.test(result)) {
    return "reply";
  }
  if (/评论了你的(?:作品|视频|评论|动态)?|给你评论|写下了评论/.test(result)) {
    return "comment";
  }
  if (/关注了你|开始关注你|成为了你的粉丝/.test(result)) {
    return "follow";
  }
  if (/赞了你的(?:作品|视频|评论|动态)?|点赞|喜欢了你的/.test(result)) {
    return "like";
  }
  return "unknown";
}
function isJudgeableEvent(arg1) {
  return ["comment", "reply", "message"].includes(arg1?.eventType);
}
function signDingtalkUrl(arg1, arg2) {
  if (!arg2) {
    return arg1;
  }
  const result = Date.now();
  const value = result + "\n" + arg2;
  const result2 = crypto.createHmac("sha256", arg2).update(value).digest("base64");
  const value2 = arg1.includes("?") ? "&" : "?";
  return "" + arg1 + value2 + "timestamp=" + result + "&sign=" + encodeURIComponent(result2);
}
function buildWebhookPayload(arg1, arg2) {
  if (arg1 === "feishu") {
    return {
      msg_type: "interactive",
      card: {
        header: {
          title: {
            tag: "plain_text",
            content: arg2.title || "自热互动提醒"
          },
          template: "blue"
        },
        elements: [{
          tag: "div",
          text: {
            tag: "lark_md",
            content: arg2.content || ""
          }
        }, {
          tag: "hr"
        }, {
          tag: "note",
          elements: [{
            tag: "plain_text",
            content: arg2.time || new Date().toLocaleString()
          }]
        }]
      }
    };
  }
  if (arg1 === "dingtalk") {
    return {
      msgtype: "markdown",
      markdown: {
        title: arg2.title || "自热互动提醒",
        text: "### " + (arg2.title || "自热互动提醒") + "\n\n" + (arg2.content || "") + "\n\n> " + (arg2.time || new Date().toLocaleString())
      }
    };
  }
  return {
    event: "self_warmup",
    title: arg2.title || "自热互动提醒",
    content: arg2.content || "",
    time: arg2.time || new Date().toLocaleString(),
    items: arg2.items || []
  };
}
function isWebhookResponseSuccess(arg1, arg2) {
  if (!arg2 || arg2.status !== 200) {
    return false;
  }
  if (arg2.data) {
    if (arg2.data.errcode !== undefined && arg2.data.errcode !== 0) {
      return false;
    }
    if (arg2.data.code !== undefined && arg1 === "feishu" && arg2.data.code !== 0) {
      return false;
    }
  }
  return true;
}
function createSelfWarmupRunner(arg1) {
  ensureSelfWarmupDmLogBridge();
  const {
    app: app,
    store: store,
    fs: fs,
    runtimeConfig = null,
    applyAccountProxy: applyAccountProxy,
    configureAutomationSession: configureAutomationSession,
    applyPackagedWindowMenuPolicy: applyPackagedWindowMenuPolicy,
    attachProtocolGuard: attachProtocolGuard,
    analyzeMonitorCommentsBatch: analyzeMonitorCommentsBatch,
    generateMonitorPersonaContent: generateMonitorPersonaContent,
    matchKeywords: matchKeywords,
    isMonitorAccountAiEnabled: isMonitorAccountAiEnabled
  } = arg1;
  async function fn(arg1) {
    if (!runtimeConfig || !arg1 || arg1.isDestroyed?.()) {
      return;
    }
    try {
      if (typeof runtimeConfig.ensureFetched === "function") {
        await runtimeConfig.ensureFetched();
      }
      runtimeConfig.pushToWebContents?.(arg1);
    } catch (error) {
      console.warn("[SelfWarmup] runtime config push failed:", error?.message || error);
    }
  }
  const local = () => {
    if (typeof arg1.getMainWindow === "function") {
      return arg1.getMainWindow();
    }
    return arg1.mainWindow || null;
  };
  const map = new Map();
  const map2 = new Map();
  const map3 = new Map();
  const map4 = new Map();
  const map5 = new Map();
  const num = 45000;
  const num2 = 18000;
  const num3 = 15000;
  const num4 = 22000;
  const num5 = 400;
  const num6 = 15;
  const num7 = 2;
  const num8 = 300;
  const num9 = 5000;
  const num10 = 1000;
  const num11 = 5000;
  const local2 = arg1 => "self-warmup:" + arg1;
  let local3 = null;
  function fn2(options = {}) {
    const result = (options.accounts || []).map(arg1 => arg1?.id).filter(Boolean);
    if (result.length) {
      return result;
    }
    return (options.config?.selectedAccounts || []).filter(Boolean);
  }
  function fn3(options = {}) {
    return createAccountActionLimitStore(options.config || {}, ACCOUNT_ACTION_LIMIT_SPECS, fn2(options));
  }
  function fn4(arg1, arg2, arg3) {
    const result = mapSelfWarmupActionToLimitKey(arg2);
    if (!result) {
      return true;
    }
    return getAccountActionLimitStatus(map.get(arg1)?.actionLimitState, arg3, result).allowed;
  }
  function fn5(arg1, arg2, arg3) {
    const result = mapSelfWarmupActionToLimitKey(arg2);
    if (!result) {
      return "";
    }
    const result2 = getAccountActionLimitStatus(map.get(arg1)?.actionLimitState, arg3, result);
    if (!result2?.enabled || !!result2.allowed) {
      return "";
    }
    const obj = {
      like: "点赞",
      reply: "回复",
      follow: "关注",
      dm: "私信"
    };
    return "已达本账号本次" + (obj[result] || result2.label || "动作") + "上限";
  }
  function fn6(arg1, arg2, arg3) {
    const result = map.get(arg1);
    const result2 = mapSelfWarmupActionToLimitKey(arg3);
    if (!result?.actionLimitState || !result2) {
      return;
    }
    const result3 = recordAccountActionLimitSuccess(result.actionLimitState, arg2, result2);
    if (!result3.enabled || result3.allowed) {
      return;
    }
    const value = arg2 + "|" + result2;
    if (!result.actionLimitReachedLogged) {
      result.actionLimitReachedLogged = new Set();
    }
    if (result.actionLimitReachedLogged.has(value)) {
      return;
    }
    result.actionLimitReachedLogged.add(value);
    const obj = {
      like: "点赞",
      reply: "回复",
      follow: "关注",
      dm: "私信"
    };
    fn7(arg1, "账号已达本次" + (obj[result2] || result2) + "上限（" + result3.limit + "）", "info");
  }
  function fn8(arg1, arg2) {
    if (!arg1 || arg1.isDestroyed() || arg1.webContents.isDestroyed()) {
      return;
    }
    try {
      arg1.webContents.setBackgroundThrottling(false);
    } catch (error) {}
    try {
      arg1.webContents.setFrameRate(arg2 ? num6 : num7);
    } catch (error) {}
    try {
      arg1.webContents.setImageAnimationPolicy(arg2 ? "animate" : "noAnimation");
    } catch (error) {}
  }
  function fn9() {
    for (const item of map2.values()) {
      if (!item || item.isDestroyed()) {
        continue;
      }
      fn8(item, true);
    }
  }
  function fn10(arg1, arg2) {
    if (!arg1 || !arg2?.message) {
      return;
    }
    const local = map4.get(arg1) || [];
    local.push(arg2);
    if (local.length > num8) {
      local.splice(0, local.length - num8);
    }
    map4.set(arg1, local);
  }
  function getTaskLogs(arg1) {
    if (!arg1) {
      return [];
    }
    return [...(map4.get(arg1) || [])];
  }
  function getAllTaskLogs() {
    const obj = {};
    for (const [local, local2] of map4.entries()) {
      obj[local] = [...local2];
    }
    return obj;
  }
  function clearTaskLogs(arg1) {
    if (!arg1) {
      map4.clear();
      return true;
    }
    return map4.delete(arg1);
  }
  function fn14(arg1) {
    if (!arg1 || arg1.isDestroyed()) {
      return;
    }
    if (arg1.__radarAllowVisibleMonitor) {
      return;
    }
    arg1.__radarUseOffscreenKeepAlive = false;
    ensureHiddenWindowStaysHidden(arg1);
    fn8(arg1, false);
  }
  async function fn15(arg1, arg2) {
    if (!arg1 || arg1.isDestroyed()) {
      return arg2();
    }
    fn8(arg1, true);
    if (!arg1.__radarAllowVisibleMonitor) {
      ensureHiddenWindowStaysHidden(arg1);
    }
    try {
      return await arg2();
    } finally {
      if (!arg1.isDestroyed() && !arg1.__radarAllowVisibleMonitor) {
        fn14(arg1);
      }
    }
  }
  async function fn16(arg1, arg2, arg3) {
    const result = String(arg1);
    const local = map3.get(result) || Promise.resolve();
    let local2;
    const promise = new Promise(arg1 => {
      local2 = arg1;
    });
    const result2 = local.catch(() => {}).then(() => promise);
    map3.set(result, result2);
    const result3 = Date.now();
    await local.catch(() => {});
    const value = Date.now() - result3;
    if (value >= 500) {
      fn7(arg2, "同账号自热任务排队 " + (value / 1000).toFixed(1) + " 秒，现已按顺序执行", "info");
    }
    fn8(map2.get(result), true);
    try {
      if (!map.has(arg2)) {
        return null;
      }
      return await arg3();
    } finally {
      const result3 = map2.get(result);
      if (result3 && !result3.isDestroyed() && !result3.__radarAllowVisibleMonitor) {
        fn14(result3);
      } else {
        fn8(result3, !!result3 && !result3.isDestroyed() && !!result3.isVisible());
      }
      local2();
      if (map3.get(result) === result2) {
        map3.delete(result);
      }
    }
  }
  function fn17(arg1, arg2) {
    const result = local();
    if (result && !result.isDestroyed() && !result.webContents.isDestroyed()) {
      try {
        result.webContents.send("self-warmup-task-event", {
          taskId: arg1,
          ...arg2
        });
      } catch (error) {}
    }
  }
  function fn7(arg1, arg2, text = "info") {
    const result = Date.now();
    const result2 = String(arg2 || "").trim();
    if (!result2) {
      return;
    }
    fn10(arg1, {
      message: result2,
      level: text,
      ts: result
    });
    fn17(arg1, {
      type: "log",
      message: result2,
      level: text,
      ts: result
    });
    console.log("[SelfWarmup][" + arg1 + "] " + result2);
  }
  function fn18(options = {}) {
    const list = [];
    if (options.msgPreview) {
      list.push("文案「" + compactText(options.msgPreview).slice(0, 48) + "」");
    }
    if (options.reason) {
      list.push("原因=" + compactText(options.reason).slice(0, 100));
    }
    if (options.viaStranger) {
      list.push("经陌生人消息进入");
    }
    if (options.forceFolder) {
      list.push("强制检查陌生人消息");
    }
    if (options.resultStatus) {
      list.push("结果=" + compactText(options.resultStatus));
    }
    if (options.inputCleared === true) {
      list.push("输入框已清空");
    } else if (options.inputCleared === false) {
      list.push("输入框仍有内容");
    }
    if (options.verified === true) {
      list.push("发送气泡已确认");
    }
    if (options.failureMarker) {
      list.push("检测到红色失败标记");
    }
    if (options.failureToast) {
      list.push("平台提示=" + compactText(options.failureToast).slice(0, 120));
    }
    if (options.blockType) {
      list.push("限制=" + compactText(options.blockType));
    }
    if (options.errorCode) {
      list.push("代码=" + compactText(options.errorCode));
    }
    if (list.length) {
      return "（" + list.join("；") + "）";
    } else {
      return "";
    }
  }
  selfWarmupDmLogSink = (arg1, options = {}) => {
    const result = map5.get(arg1.sender?.id);
    if (!result || !map.has(result.taskId)) {
      return;
    }
    const result2 = compactText(options.extra?.nickname || "");
    const value = result2 ? " @" + result2 : "";
    const result3 = compactText(options.message);
    const result4 = fn18(options.extra || {});
    const value2 = /失败|受限|异常|未找到/.test(result3) ? "warning" : /确认|成功/.test(result3) ? "success" : "info";
    fn7(result.taskId, "账号 " + result.accountName + " · 私信步骤" + value + "：" + result3 + result4, value2);
  };
  function fn19(options = {}) {
    if (options.ok || options.blocked || options.consumeRound || options.skipped) {
      return false;
    }
    const result = compactText(options.reason || "");
    if (/无.*文案|隐私设置|操作频繁|账号.*封禁|用户不存在|未登录|权限|已达.*上限|未确认|已点击发送|已触发回车/.test(result)) {
      return false;
    }
    if (/未能打开对应视频页/.test(result)) {
      return false;
    }
    return true;
  }
  function fn20(options = {}) {
    if (options.ok || options.blocked || options.consumeRound || options.skipped) {
      return false;
    }
    const result = compactText(options.reason || "");
    if (/无.*文案|隐私设置|操作频繁|账号.*封禁|用户不存在|未登录|权限|已达.*上限|已点击发送|已触发回车/.test(result)) {
      return false;
    }
    return true;
  }
  function fn21(arg1) {
    if (!arg1) {
      return;
    }
    arg1._selfWarmupCommentPageReady = false;
    arg1._selfWarmupCommentSettled = false;
    arg1._selfWarmupNavFailed = false;
    arg1._selfWarmupUsedApiNav = false;
  }
  async function fn22(arg1, arg2, arg3) {
    const result = await arg3();
    if (!fn19(result)) {
      return result;
    }
    const value = 9000 + Math.floor(Math.random() * 2001);
    fn7(arg1, arg2 + "首次失败：" + (result.reason || "未知原因") + "；等待约 " + (value / 1000).toFixed(1) + " 秒后重试一次", "warning");
    await delay(value);
    if (!map.has(arg1)) {
      return {
        ...result,
        retryCancelled: true,
        reason: (result.reason || "首次失败") + "；任务已停止，取消重试"
      };
    }
    const result2 = await arg3();
    fn7(arg1, result2.ok || result2.consumeRound ? arg2 + "重试成功" : arg2 + "重试仍失败：" + (result2.reason || "未知原因"), result2.ok || result2.consumeRound ? "success" : "warning");
    return {
      ...result2,
      retried: true,
      firstFailureReason: result.reason || ""
    };
  }
  async function fn23(arg1, arg2, arg3, arg4, arg5) {
    const result = await arg5();
    if (result.ok || result.blocked || result.consumeRound || result.skipped) {
      return result;
    }
    if (!fn20(result) && !fn19(result)) {
      return result;
    }
    const value = 9000 + Math.floor(Math.random() * 2001);
    fn7(arg1, arg4 + "首次失败：" + (result.reason || "未知原因") + "；等待约 " + (value / 1000).toFixed(1) + " 秒后重试一次", "warning");
    await delay(value);
    if (!map.has(arg1)) {
      return {
        ...result,
        retryCancelled: true,
        reason: (result.reason || "首次失败") + "；任务已停止，取消重试"
      };
    }
    const result2 = await arg5();
    if (result2.ok || result2.blocked || result2.consumeRound || result2.skipped) {
      fn7(arg1, arg4 + "重试成功", "success");
      return {
        ...result2,
        retried: true,
        firstFailureReason: result.reason || ""
      };
    }
    if (!fn20(result2) || !arg2 || arg2.isDestroyed()) {
      fn7(arg1, arg4 + "重试仍失败：" + (result2.reason || "未知原因"), "warning");
      return {
        ...result2,
        retried: true,
        firstFailureReason: result.reason || ""
      };
    }
    fn7(arg1, arg4 + "第二次仍失败：" + (result2.reason || "未知原因") + "；刷新精选页后重新点通知卡片再试一次", "warning");
    fn21(arg3);
    await fn24(arg2, "https://www.douyin.com/jingxuan");
    const result3 = await fn25(arg2, "home", {
      timeoutMs: num2,
      stableSamples: 2,
      taskId: arg1
    });
    ensureHiddenWindowStaysHidden(arg2);
    if (!isWarmupSurfaceComplete(result3)) {
      return {
        ...result2,
        retried: true,
        refreshed: true,
        reason: (result2.reason || "二次失败") + "；刷新后精选页未就绪（" + fn26(result3) + "）"
      };
    }
    if (!map.has(arg1)) {
      return {
        ...result2,
        retried: true,
        retryCancelled: true,
        reason: (result2.reason || "二次失败") + "；任务已停止，取消刷新重试"
      };
    }
    const result4 = await arg5();
    fn7(arg1, result4.ok || result4.consumeRound ? arg4 + "刷新页面后重试成功" : arg4 + "刷新页面后仍失败，记为失败：" + (result4.reason || "未知原因"), result4.ok || result4.consumeRound ? "success" : "warning");
    return {
      ...result4,
      retried: true,
      refreshed: true,
      firstFailureReason: result.reason || ""
    };
  }
  function fn27() {
    let result = path.join(__dirname, "..", "automation-preload.js");
    if (app.isPackaged) {
      const result2 = store.get("latest_resource_path");
      if (result2 && fs.existsSync(path.join(result2, "automation-preload.js"))) {
        result = path.join(result2, "automation-preload.js");
      }
    }
    return result;
  }
  async function fn28(arg1, arg2) {
    const value = "douyin_" + arg1;
    const result = local();
    const value2 = result && !result.isDestroyed() ? result : null;
    const browserWindow = new BrowserWindow({
      parent: value2 || undefined,
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
        partition: "persist:automation:" + value,
        backgroundThrottling: false,
        contextIsolation: true,
        sandbox: false,
        preload: fn27(),
        spellcheck: false
      },
      autoHideMenuBar: true
    });
    browserWindow.__radarUseOffscreenKeepAlive = false;
    applyHiddenAutomationWindowPolicy(browserWindow, {
      parent: value2
    });
    applyPackagedWindowMenuPolicy(browserWindow);
    attachProtocolGuard(browserWindow.webContents, "self-warmup:" + value);
    browserWindow.webContents.setWindowOpenHandler(() => ({
      action: "deny"
    }));
    browserWindow.on("close", arg1 => {
      if (!app.isQuitting && browserWindow.__radarAllowVisibleMonitor) {
        arg1.preventDefault();
        hideVisibleAutomationWindow(browserWindow);
        fn14(browserWindow);
      }
    });
    configureAutomationSession(browserWindow.webContents.session, value);
    await applyAccountProxy(browserWindow.webContents.session, arg2, value);
    browserWindow.webContents.setAudioMuted(store.get("system_video_muted", true));
    ensureHiddenWindowStaysHidden(browserWindow);
    browserWindow.webContents.on("dom-ready", () => {
      runtimeConfig?.ensureAndPushToWebContents?.(browserWindow.webContents);
    });
    map2.set(arg1, browserWindow);
    return browserWindow;
  }
  async function fn29(arg1) {
    const result = String(arg1.id);
    const result2 = map2.get(result);
    if (result2 && !result2.isDestroyed()) {
      return result2;
    }
    return fn28(result, arg1.proxy);
  }
  function destroyWarmupWindows() {
    for (const item of map2.values()) {
      if (item && !item.isDestroyed()) {
        item.destroy();
      }
    }
    map2.clear();
  }
  async function fn24(arg1, arg2) {
    if (!arg1 || arg1.isDestroyed()) {
      throw new Error("自热互动窗口已销毁");
    }
    fn8(arg1, true);
    let local = null;
    try {
      await Promise.race([arg1.loadURL(arg2), new Promise((arg1, arg2) => {
        local = setTimeout(() => {
          const error = new Error("页面加载超过 " + Math.round(num / 1000) + " 秒");
          error.code = "self_warmup_navigation_timeout";
          arg2(error);
        }, num);
      })]);
    } catch (error) {
      if (error?.code === "self_warmup_navigation_timeout") {
        try {
          arg1.webContents.stop();
        } catch (error) {}
        throw error;
      }
      if (error.message && (error.message.includes("ERR_ABORTED") || error.message.includes("ERR_FAILED"))) {
        console.log("[selfWarmup] loadURL aborted/failed for " + arg2 + " (expected/ignored)");
      } else {
        throw error;
      }
    } finally {
      if (local) {
        clearTimeout(local);
      }
    }
    await fn(arg1.webContents);
    return true;
  }
  function fn26(options = {}) {
    const list = [options.status || "unknown"];
    if (options.observedStatus && options.observedStatus !== options.status) {
      list.push("最后状态=" + options.observedStatus);
    }
    if (Number.isFinite(Number(options.elapsedMs))) {
      list.push((Number(options.elapsedMs) / 1000).toFixed(1) + "s");
    }
    if (Number.isFinite(Number(options.rootCount))) {
      list.push("容器 " + Number(options.rootCount));
    }
    if (Number.isFinite(Number(options.rowCount))) {
      list.push("数据行 " + Number(options.rowCount));
    }
    if (options.loading) {
      list.push("仍在加载");
    }
    if (options.readyState) {
      list.push("readyState=" + options.readyState);
    }
    if (options.clickAttempt) {
      list.push("点击 " + options.clickAttempt + " 次");
    }
    if (options.reloaded) {
      list.push("已刷新恢复");
    }
    if (options.error) {
      list.push("错误=" + compactText(options.error).slice(0, 80));
    }
    return list.join("，");
  }
  async function fn31(arg1, arg2) {
    if (!arg1 || arg1.isDestroyed() || arg1.webContents.isDestroyed()) {
      return {
        kind: arg2,
        status: "destroyed",
        url: "",
        rootCount: 0,
        rowCount: 0
      };
    }
    return arg1.webContents.executeJavaScript("(() => {\n      const kind = " + JSON.stringify(arg2) + ";\n      const compact = (value) => String(value || '')\n        .replace(/[\\u200b-\\u200f\\u202a-\\u202e\\u2060-\\u206f]/g, '')\n        .replace(/\\s+/g, ' ')\n        .trim();\n      const visible = (el, minWidth = 1, minHeight = 1) => {\n        if (!el || !el.getBoundingClientRect) return false;\n        const r = el.getBoundingClientRect();\n        const s = getComputedStyle(el);\n        return r.width >= minWidth && r.height >= minHeight\n          && s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';\n      };\n      const readyState = document.readyState || '';\n      const url = window.location.href || '';\n      const base = {\n        kind,\n        status: 'waiting',\n        url,\n        readyState,\n        rootCount: 0,\n        rowCount: 0,\n        loading: false,\n        emptyMatched: false,\n      };\n      const loginNodes = Array.from(document.querySelectorAll(\n        '[data-e2e=\"header-login-container\"], button, a, [role=\"button\"]'\n      )).filter((el) => visible(el));\n      const loginRequired = loginNodes.some((el) => {\n        const text = compact(el.innerText || el.textContent);\n        return /^(登录|注册登录|登录\\/注册|立即登录)$/.test(text)\n          || /扫码登录|验证码登录|密码登录|登录后即可/.test(text);\n      });\n      if (loginRequired) return { ...base, status: 'login-required' };\n\n      if (kind === 'home') {\n        const entries = Array.from(document.querySelectorAll(\n          '[data-e2e=\"notification-entry\"], [data-e2e=\"im-entry\"], [data-e2e=\"something-button\"]'\n        )).filter((el) => visible(el));\n        return {\n          ...base,\n          status: entries.length > 0 && /interactive|complete/.test(readyState) ? 'ready' : 'waiting',\n          rootCount: entries.length,\n        };\n      }\n\n      const loadingSelector = [\n        '[aria-busy=\"true\"]', '.semi-spin', '.semi-spin-wrapper',\n        '[class*=\"Loading\"]', '[class*=\"loading\"]', '[class*=\"Skeleton\"]', '[class*=\"skeleton\"]'\n      ].join(',');\n      const hasLoading = (root) => {\n        try {\n          return Array.from(root.querySelectorAll(loadingSelector)).some((el) => visible(el));\n        } catch (_) { return false; }\n      };\n\n      if (kind === 'chat' || kind === 'message') {\n        if (kind === 'chat' && !/^https:\\/\\/(?:www\\.)?douyin\\.com\\/chat(?:[/?#]|$)/i.test(url)) {\n          return { ...base, status: 'wrong-page' };\n        }\n        const rootSelector = '#imSaasContainerId, [data-e2e=\"im-dialog\"]';\n        let roots = Array.from(document.querySelectorAll(rootSelector))\n          .filter((el) => visible(el, 120, 60));\n        if (kind === 'message') {\n          const popovers = Array.from(document.querySelectorAll(\n            '.semi-popover-content, [class*=\"Popover\"], [class*=\"popover\"], [role=\"dialog\"]'\n          )).filter((el) => {\n            if (!visible(el, 120, 60)) return false;\n            const text = compact(el.innerText || el.textContent);\n            return /私信|陌生人消息|聊天|会话/.test(text)\n              && !/赞了你|评论了你的|回复了你|关注了你/.test(text);\n          });\n          roots = Array.from(new Set([...roots, ...popovers]));\n        }\n        const rowSelector = [\n          '[data-e2e=\"conversation-item\"]', '.conversationStrangerBoxwrapper',\n          '[class*=\"Conversation\"]', '[class*=\"conversation\"]',\n          '[class*=\"Stranger\"]', '[class*=\"stranger\"]', '[role=\"listitem\"]'\n        ].join(',');\n        const rows = new Set();\n        roots.forEach((root) => {\n          root.querySelectorAll(rowSelector).forEach((row) => {\n            if (!visible(row, 120, 24)) return;\n            const r = row.getBoundingClientRect();\n            const text = compact(row.innerText || row.textContent);\n            if (r.height > 220 || !text || /^(私信|消息)$/.test(text)) return;\n            rows.add(row);\n          });\n        });\n        // 部分 /chat 版本的会话列表与 im 根节点并列挂载。\n        if (!rows.size) {\n          document.querySelectorAll(rowSelector).forEach((row) => {\n            if (!visible(row, 120, 24)) return;\n            const r = row.getBoundingClientRect();\n            const text = compact(row.innerText || row.textContent);\n            if (r.height <= 220 && text && !/^(私信|消息)$/.test(text)) rows.add(row);\n          });\n        }\n        const text = compact(roots.map((root) => root.innerText || root.textContent).join(' '));\n        const emptyMatched = /暂无(?:会话|聊天|私信|消息)|还没有(?:会话|聊天|私信|消息)|暂时没有(?:会话|聊天|私信|消息)/.test(text);\n        const loading = roots.some(hasLoading);\n        let status = 'waiting';\n        if (/interactive|complete/.test(readyState) && roots.length && !loading && rows.size > 0) status = 'ready';\n        else if (/interactive|complete/.test(readyState) && roots.length && !loading && emptyMatched) status = 'empty';\n        else if (loading) status = 'loading';\n        return { ...base, status, rootCount: roots.length, rowCount: rows.size, loading, emptyMatched };\n      }\n\n      const EVENT_RE = /(评论了你的(?:作品|视频|评论|动态)?|回复了你|回复了你的评论|关注了你|开始关注你|赞了你的(?:作品|视频|评论|动态)?|点赞|喜欢了你的|提到了你|@了你)/;\n      const panelSelector = [\n        '[data-e2e=\"listDlgTest-container\"]', '[data-e2e*=\"notice\"]',\n        '[data-e2e*=\"notification\"]', '.semi-popover-content',\n        '[class*=\"Popover\"]', '[class*=\"popover\"]',\n        '[class*=\"Notice\"]', '[class*=\"notice\"]', '[role=\"dialog\"]'\n      ].join(',');\n      const panels = Array.from(document.querySelectorAll(panelSelector))\n        .filter((el) => visible(el, 180, 60))\n        .filter((el) => !(\n          el.matches('#imSaasContainerId, [data-e2e=\"im-dialog\"]')\n          || el.closest('#imSaasContainerId, [data-e2e=\"im-dialog\"]')\n          || el.querySelector('#imSaasContainerId, [data-e2e=\"im-dialog\"]')\n        ))\n        .filter((el) => {\n          const text = compact(el.innerText || el.textContent);\n          return EVENT_RE.test(text) || /通知|互动|评论|回复|赞了你|点赞|关注|全部消息/.test(text);\n        });\n      const rowSelector = [\n        '.JkTB0jW1', '[role=\"listitem\"]', 'li', '[data-e2e=\"user-name-card\"]',\n        '[data-e2e*=\"notice\"]', '[data-e2e*=\"notification\"]', 'a[href*=\"/user/\"]', 'pre'\n      ].join(',');\n      const rows = new Set();\n      panels.forEach((panel) => {\n        const addRowFromNode = (node) => {\n          // 新版通知面板里的用户名/头像链接本身通常只有 20px 左右高，\n          // 不能在向上寻找完整通知卡片之前用“行尺寸”把锚点过滤掉。\n          if (node === panel || !visible(node)) return;\n          let row = node;\n          while (row && row !== panel) {\n            const r = row.getBoundingClientRect();\n            const text = compact(row.innerText || row.textContent);\n            if (r.width >= 160 && r.height >= 28 && r.height < 360 && EVENT_RE.test(text)) {\n              rows.add(row);\n              break;\n            }\n            row = row.parentElement;\n          }\n        };\n        panel.querySelectorAll(rowSelector).forEach(addRowFromNode);\n        // 抖音通知卡片类名会混淆且频繁变化；没有语义锚点时，从事件文案叶子反查卡片。\n        if (!rows.size) {\n          panel.querySelectorAll('div, span').forEach((node) => {\n            if (node.children.length === 0 && EVENT_RE.test(compact(node.innerText || node.textContent))) {\n              addRowFromNode(node);\n            }\n          });\n        }\n      });\n      const panelText = compact(panels.map((panel) => panel.innerText || panel.textContent).join(' '));\n      const emptyMatched = /暂无(?:通知|互动|消息|更多)|还没有(?:通知|互动|消息)|暂时没有(?:通知|互动|消息)|没有更多/.test(panelText);\n      const loading = panels.some(hasLoading);\n      let status = 'waiting';\n      if (/interactive|complete/.test(readyState) && panels.length && !loading && rows.size > 0) status = 'ready';\n      else if (/interactive|complete/.test(readyState) && panels.length && !loading && emptyMatched) status = 'empty';\n      else if (loading) status = 'loading';\n      return { ...base, status, rootCount: panels.length, rowCount: rows.size, loading, emptyMatched };\n    })()", true).catch(arg12 => ({
      kind: arg2,
      status: "probe-error",
      url: String(arg1.webContents.getURL?.() || ""),
      rootCount: 0,
      rowCount: 0,
      error: arg12?.message || String(arg12)
    }));
  }
  async function fn25(arg1, arg2, options = {}) {
    const result = Math.max(1000, Number(options.timeoutMs) || num3);
    const result2 = Math.max(1, Number(options.stableSamples) || (arg2 === "home" ? 2 : 3));
    const local = options.taskId || "";
    const result3 = Date.now();
    let obj = {
      kind: arg2,
      status: "waiting",
      rootCount: 0,
      rowCount: 0
    };
    let text = "";
    let num = 0;
    while (Date.now() - result3 < result) {
      if (local && !map.has(local)) {
        return {
          ...obj,
          status: "cancelled",
          elapsedMs: Date.now() - result3
        };
      }
      obj = await fn31(arg1, arg2);
      if (obj.status === "destroyed" || obj.status === "login-required") {
        return {
          ...obj,
          elapsedMs: Date.now() - result3
        };
      }
      if (isWarmupSurfaceComplete(obj)) {
        const value = obj.status + "|" + obj.rootCount + "|" + obj.rowCount;
        num = value === text ? num + 1 : 1;
        text = value;
        if (num >= result2) {
          return {
            ...obj,
            elapsedMs: Date.now() - result3,
            stableSamples: num
          };
        }
      } else {
        num = 0;
        text = "";
      }
      await delay(num5);
    }
    return {
      ...obj,
      observedStatus: obj.status,
      status: "timeout",
      elapsedMs: Date.now() - result3,
      stableSamples: num
    };
  }
  async function fn32(arg1) {
    const result = String(arg1.id);
    const result2 = map2.get(result);
    if (result2 && !result2.isDestroyed()) {
      try {
        result2.destroy();
      } catch (error) {}
    }
    map2.delete(result);
    const result3 = await fn29(arg1);
    fn8(result3, false);
    return result3;
  }
  async function fn33(arg1, text = "") {
    const result = arg1.webContents.getURL();
    let flag = false;
    try {
      const url = new URL(result);
      flag = /(^|\.)douyin\.com$/i.test(url.hostname) && (url.pathname === "/" || url.pathname === "/jingxuan") && !url.searchParams.get("modal_id");
    } catch (error) {}
    const local = flag && (await arg1.webContents.executeJavaScript("(() => {\n      const visible = (el) => {\n        if (!el) return false;\n        const r = el.getBoundingClientRect();\n        const style = getComputedStyle(el);\n        return r.width > 120 && r.height > 60\n          && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';\n      };\n      return Array.from(document.querySelectorAll(\n        '#imSaasContainerId, [data-e2e=\"im-dialog\"], [data-e2e=\"listDlgTest-container\"], .semi-popover-content, [role=\"dialog\"]'\n      )).some(visible);\n    })()").catch(() => false));
    if (!flag || local) {
      await fn24(arg1, "https://www.douyin.com/jingxuan");
    }
    ensureHiddenWindowStaysHidden(arg1);
    return fn25(arg1, "home", {
      timeoutMs: num2,
      stableSamples: 2,
      taskId: text
    });
  }
  async function fn34(arg1, options = {}) {
    if (!arg1 || arg1.isDestroyed()) {
      throw new Error("自动回复窗口已销毁");
    }
    const local = options.taskId || "";
    let result = String(arg1.webContents.getURL() || "");
    let result2 = await fn31(arg1, "chat");
    if (isWarmupSurfaceComplete(result2) || result2.status === "login-required") {
      ensureHiddenWindowStaysHidden(arg1);
      return result2;
    }
    if (isDouyinChatPageUrl(result)) {
      if (local) {
        fn7(local, "Chat 页面已打开，正在等待会话列表稳定…", "info");
      }
      result2 = await fn25(arg1, "chat", {
        timeoutMs: Math.min(12000, num4),
        taskId: local
      });
      if (isWarmupSurfaceComplete(result2) || result2.status === "login-required" || result2.status === "cancelled") {
        ensureHiddenWindowStaysHidden(arg1);
        return result2;
      }
    }
    result = String(arg1.webContents.getURL() || "");
    if (!isDouyinChatPageUrl(result) || result2.status === "timeout" || result2.status === "wrong-page") {
      if (local) {
        fn7(local, "正在进入 Chat 页面并加载会话列表…", "info");
      }
      await fn24(arg1, "https://www.douyin.com/chat");
    }
    ensureHiddenWindowStaysHidden(arg1);
    return fn25(arg1, "chat", {
      timeoutMs: num4,
      taskId: local
    });
  }
  async function fn35(arg1, options = {}) {
    if (!arg1 || arg1.isDestroyed()) {
      return {
        ok: false,
        reason: "窗口已销毁"
      };
    }
    const result = String(arg1.webContents.getURL() || "");
    const result2 = shouldWarmupIdleOnChat(options);
    let flag = false;
    if (result2) {
      if (!isDouyinChatPageUrl(result)) {
        flag = true;
        await fn34(arg1).catch(() => null);
      }
    } else if (isDouyinChatPageUrl(result) || isWarmupHeavyPageUrl(result) && !isWarmupIdleJingxuanUrl(result)) {
      await fn24(arg1, "https://www.douyin.com/jingxuan");
      await fn25(arg1, "home", {
        timeoutMs: num2,
        stableSamples: 2
      });
      flag = true;
    }
    try {
      arg1.webContents.clearHistory();
    } catch (error) {}
    fn8(arg1, false);
    return {
      ok: true,
      recycled: flag
    };
  }
  async function fn36(arg1, options = {}) {
    const result = await arg1.webContents.executeJavaScript("(() => {\n      const compact = (value) => String(value || '')\n        .replace(/[\\u200b-\\u200f\\u202a-\\u202e\\u2060-\\u206f]/g, '')\n        .replace(/\\s+/g, ' ')\n        .trim();\n      const visible = (el) => {\n        if (!el) return false;\n        const r = el.getBoundingClientRect();\n        const s = getComputedStyle(el);\n        return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';\n      };\n      const readUserInfo = () => {\n        for (const key of ['user_info', 'index_user_info']) {\n          try {\n            const raw = localStorage.getItem(key);\n            if (!raw) continue;\n            const data = JSON.parse(raw);\n            const nickname = compact(data.nickname);\n            const douyinId = compact(data.short_id || data.display_id || data.unique_id);\n            if (nickname || douyinId) return { nickname, douyinId };\n          } catch (_) {}\n        }\n        return {};\n      };\n      const storageUser = readUserInfo();\n      const selfLink = Array.from(document.querySelectorAll('a[href*=\"/user/self\"]')).find(visible);\n      const avatar = document.querySelector('[data-e2e=\"header-user-avatar\"], [data-e2e=\"user-avatar\"]');\n      const loggedInHeaderEntry = Array.from(document.querySelectorAll('[data-e2e=\"notification-entry\"], [data-e2e=\"im-entry\"]')).find(visible);\n      const headerLogin = document.querySelector('[data-e2e=\"header-login-container\"]');\n      const loginTexts = Array.from(document.querySelectorAll('[data-e2e=\"header-login-container\"], button, a, [role=\"button\"]'))\n        .filter(visible)\n        .map((el) => compact(el.innerText || el.textContent))\n        .filter(Boolean);\n      const strongLoginGate = loginTexts.some((text) =>\n        /^(登录|注册登录|登录\\/注册|立即登录)$/.test(text)\n        || /扫码登录|验证码登录|密码登录|登录后即可/.test(text)\n      ) || (visible(headerLogin) && /登录/.test(compact(headerLogin.innerText || headerLogin.textContent)));\n      const cookieText = document.cookie || '';\n      const cookieLogged = /(?:^|;\\s*)(sessionid|sid_tt|uid_tt|passport_auth_status|LOGIN_STATUS)=/.test(cookieText);\n      const bodyText = compact(document.body?.innerText || '').slice(0, 800);\n      const hasLoggedInMarker = !!(\n        storageUser.nickname\n        || storageUser.douyinId\n        || selfLink\n        || (avatar && visible(avatar))\n        || loggedInHeaderEntry\n      );\n      const loggedIn = hasLoggedInMarker || (cookieLogged && !strongLoginGate);\n      return {\n        loggedIn,\n        strongLoginGate,\n        hasLoggedInMarker,\n        cookieLogged,\n        nickname: storageUser.nickname || '',\n        douyinId: storageUser.douyinId || '',\n        url: window.location.href,\n        loginTexts: loginTexts.slice(0, 5),\n        bodyHasLoginGate: /扫码登录|验证码登录|密码登录|登录后即可/.test(bodyText),\n      };\n    })()").catch(arg1 => ({
      loggedIn: false,
      strongLoginGate: false,
      error: arg1?.message || String(arg1)
    }));
    const result2 = String(options.status || "").toLowerCase();
    const local = result2 === "online" || result2 === "logged_in";
    if (result.loggedIn) {
      return {
        ...result,
        reason: result.nickname ? "识别到账号 " + result.nickname : "页面存在登录态标记"
      };
    }
    if (local && !result.strongLoginGate) {
      return {
        ...result,
        loggedIn: true,
        assumedFromAccountPool: true,
        reason: "账号池状态为已登录，且当前页面未出现强登录拦截"
      };
    }
    return {
      ...result,
      loggedIn: false,
      reason: result.strongLoginGate ? "页面出现登录入口" : result.error || "未识别到登录态"
    };
  }
  async function fn37(arg1, arg2, list = []) {
    const result = await arg1.webContents.executeJavaScript("(() => {\n      const selectors = " + JSON.stringify(list) + ";\n      const targetLabel = " + JSON.stringify(arg2) + ";\n      const compact = (value) => String(value || '')\n        .replace(/[\\u200b-\\u200f\\u202a-\\u202e\\u2060-\\u206f]/g, '')\n        .replace(/\\s+/g, ' ')\n        .trim();\n      const visible = (el) => {\n        if (!el) return false;\n        const r = el.getBoundingClientRect();\n        const s = getComputedStyle(el);\n        return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';\n      };\n      const depth = (el) => {\n        let d = 0;\n        let node = el;\n        while (node && node !== document.body) { d += 1; node = node.parentElement; }\n        return d;\n      };\n      const matchedLabels = [targetLabel];\n      if (targetLabel === '私信') {\n        matchedLabels.push('消息');\n      }\n      const candidates = [];\n      const pushCandidate = (el, reason) => {\n        if (!visible(el)) return;\n        const text = compact(el.innerText || el.textContent);\n        const dataE2e = el.getAttribute('data-e2e') || '';\n        const exact = matchedLabels.some((l) => text === l);\n        const contains = matchedLabels.some((l) => text.includes(l));\n        const isExpectedIm = targetLabel === '私信' && (dataE2e === 'im-entry' || dataE2e === 'something-button');\n        const isExpectedNotif = targetLabel === '通知' && (dataE2e === 'notification-entry' || dataE2e === 'something-button');\n        if (!exact && !contains && !isExpectedIm && !isExpectedNotif) return;\n        const r = el.getBoundingClientRect();\n        const area = r.width * r.height;\n        let score = 0;\n        if (exact) score -= 60;\n        if (contains) score -= 30;\n        if (dataE2e === 'notification-entry' || dataE2e === 'im-entry') score -= 40;\n        if (dataE2e === 'something-button') score -= 25;\n        if (reason === 'selector') score -= 10;\n        if (/更多/.test(text) && targetLabel !== '更多') score += 200;\n        score += Math.min(area / 200, 80);\n        score -= Math.min(depth(el), 30) / 2;\n        candidates.push({ el, score, area, depth: depth(el), text, dataE2e });\n      };\n      selectors.forEach((sel) => {\n        try { document.querySelectorAll(sel).forEach((el) => pushCandidate(el, 'selector')); } catch (_) {}\n      });\n      const header = document.querySelector('#douyin-header-menuCt')\n        || document.querySelector('header')\n        || document.body;\n      header.querySelectorAll(\n        '[data-e2e=\"notification-entry\"], [data-e2e=\"im-entry\"], [data-e2e=\"something-button\"], li, button, a, [role=\"button\"], div'\n      ).forEach((el) => pushCandidate(el, 'header'));\n      if (candidates.length === 0) {\n        document.querySelectorAll('#douyin-header-menuCt li, #douyin-header-menuCt div, .Ng3vbSwy, .mRpT0Jfh')\n          .forEach((el) => pushCandidate(el, 'fallback'));\n      }\n      if (!candidates.length) return null;\n      candidates.sort((a, b) => a.score - b.score || a.area - b.area || b.depth - a.depth);\n      const best = candidates[0].el;\n      if (!visible(best)) return null;\n      const r = best.getBoundingClientRect();\n      try {\n        const eventInit = { bubbles: true, cancelable: true, view: window, clientX: Math.round(r.left + r.width / 2), clientY: Math.round(r.top + r.height / 2) };\n        ['pointerover', 'mouseover', 'pointerenter', 'mouseenter', 'mousemove'].forEach((type) => {\n          best.dispatchEvent(new MouseEvent(type, eventInit));\n        });\n      } catch (_) {}\n      return {\n        x: Math.round(r.left + r.width / 2),\n        y: Math.round(r.top + r.height / 2),\n        text: candidates[0].text,\n      };\n    })()").catch(() => null);
    if (!result) {
      return false;
    }
    const result2 = Math.max(4, result.x - 80);
    const result3 = Math.max(4, result.y + 80);
    for (const item of [{
      x: result2,
      y: result3
    }, {
      x: Math.max(4, result.x - 24),
      y: result.y
    }, {
      x: Math.max(4, result.x - 8),
      y: result.y
    }, {
      x: result.x,
      y: result.y
    }]) {
      arg1.webContents.sendInputEvent({
        type: "mouseMove",
        x: item.x,
        y: item.y
      });
      await delay(120);
    }
    await delay(400);
    arg1.webContents.sendInputEvent({
      type: "mouseDown",
      x: result.x,
      y: result.y,
      button: "left",
      clickCount: 1
    });
    await delay(80);
    arg1.webContents.sendInputEvent({
      type: "mouseUp",
      x: result.x,
      y: result.y,
      button: "left",
      clickCount: 1
    });
    await delay(800);
    return true;
  }
  async function fn38(arg1, arg2, options = {}) {
    return fn25(arg1, arg2, {
      timeoutMs: options.timeoutMs || num3,
      taskId: options.taskId || "",
      stableSamples: options.stableSamples || 3
    });
  }
  async function fn39(arg1, arg2, options = {}) {
    const local = options.taskId || "";
    const value = arg2 === "message" ? "私信" : "通知";
    const value2 = arg2 === "message" ? ["[data-e2e=\"im-entry\"]"] : ["[data-e2e=\"notification-entry\"]", "[data-e2e=\"something-button\"]"];
    let result = await fn31(arg1, arg2);
    if (isWarmupSurfaceComplete(result)) {
      return fn38(arg1, arg2, {
        timeoutMs: num3,
        taskId: local
      });
    }
    if (result.status === "login-required") {
      return result;
    }
    for (let num = 1; num <= 2; num += 1) {
      if (local && !map.has(local)) {
        return {
          ...result,
          status: "cancelled"
        };
      }
      if (local) {
        fn7(local, "正在点击" + value + "入口并等待列表稳定（第 " + num + "/2 次）…", "info");
      }
      const result2 = await fn37(arg1, value, value2);
      if (result2) {
        result = await fn38(arg1, arg2, {
          timeoutMs: num3,
          taskId: local
        });
        result = {
          ...result,
          clickAttempt: num
        };
        if (isWarmupSurfaceComplete(result) || result.status === "login-required" || result.status === "cancelled") {
          return result;
        }
        if (local) {
          fn7(local, value + "入口已点击，但列表尚未稳定（" + fn26(result) + "），准备重试", "warning");
        }
      } else {
        result = {
          kind: arg2,
          status: "entry-not-found",
          url: String(arg1.webContents?.getURL?.() || ""),
          rootCount: 0,
          rowCount: 0,
          clickAttempt: num
        };
        await delay(1000);
      }
    }
    if (arg2 === "notification" && options.reloadOnFailure !== false) {
      try {
        if (local) {
          fn7(local, "通知列表连续未就绪，正在刷新精选页后做最后一次恢复检查…", "warning");
        }
        await fn24(arg1, "https://www.douyin.com/jingxuan");
        const result2 = await fn25(arg1, "home", {
          timeoutMs: num2,
          stableSamples: 2,
          taskId: local
        });
        if (isWarmupSurfaceComplete(result2)) {
          const result2 = await fn37(arg1, value, value2);
          if (result2) {
            result = await fn38(arg1, arg2, {
              timeoutMs: num3,
              taskId: local
            });
            return {
              ...result,
              clickAttempt: 3,
              reloaded: true
            };
          }
        } else {
          result = {
            ...result2,
            kind: arg2,
            reloadHomeFailed: true
          };
        }
      } catch (error) {
        result = {
          ...result,
          status: "navigation-error",
          error: error?.message || String(error),
          reloaded: true
        };
      }
    }
    return result;
  }
  async function fn40(arg1) {
    return arg1.webContents.executeJavaScript("(() => {\n      const EVENT_RE = /(评论了你的(?:作品|视频|评论|动态)?|回复了你|回复了你的评论|关注了你|开始关注你|赞了你的(?:作品|视频|评论|动态)?|点赞|喜欢了你的|提到了你|@了你)/;\n      const TIME_RE = /^(刚刚|\\d+秒前|\\d+分钟前|\\d+小时前|\\d+天前|昨天|前天|星期.|\\d{1,2}:\\d{2}|\\d{2}-\\d{2}|\\d{4}-\\d{1,2}|\\d{1,2}\\/\\d{1,2})$/;\n      const visible = (el) => {\n        if (!el) return false;\n        const r = el.getBoundingClientRect();\n        const s = getComputedStyle(el);\n        return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';\n      };\n      const compact = (value) => String(value || '')\n        .replace(/[\\u200b-\\u200f\\u202a-\\u202e\\u2060-\\u206f]/g, '')\n        .replace(/\\s+/g, ' ')\n        .trim();\n      const panelSelectors = [\n        '[data-e2e=\"listDlgTest-container\"]',\n        '[data-e2e*=\"notice\"]',\n        '[data-e2e*=\"notification\"]',\n        '.semi-popover-content',\n        '[class*=\"Popover\"]',\n        '[class*=\"popover\"]',\n        '[class*=\"Notice\"]',\n        '[class*=\"notice\"]',\n        '[role=\"dialog\"]'\n      ].join(',');\n      const panels = Array.from(document.querySelectorAll(panelSelectors))\n        .filter(visible)\n        .filter((el) => !(\n          el.matches('#imSaasContainerId, [data-e2e=\"im-dialog\"]')\n          || el.closest('#imSaasContainerId, [data-e2e=\"im-dialog\"]')\n          || el.querySelector('#imSaasContainerId, [data-e2e=\"im-dialog\"]')\n        ))\n        .map((el) => {\n          const r = el.getBoundingClientRect();\n          const text = compact(el.innerText || el.textContent);\n          return { el, r, text };\n        })\n        .filter(({ r, text }) =>\n          r.width >= 180\n          && r.height >= 60\n          && (EVENT_RE.test(text) || /通知|互动|评论|回复|赞了你|点赞|关注|全部消息/.test(text))\n        )\n        .sort((a, b) => {\n          const aExact = a.el.matches('[data-e2e=\"listDlgTest-container\"]') ? -80 : 0;\n          const bExact = b.el.matches('[data-e2e=\"listDlgTest-container\"]') ? -80 : 0;\n          const aScore = aExact + Math.abs(a.r.top) + Math.min(a.r.width * a.r.height / 1000, 300);\n          const bScore = bExact + Math.abs(b.r.top) + Math.min(b.r.width * b.r.height / 1000, 300);\n          return aScore - bScore;\n        });\n      const panel = panels[0]?.el;\n      if (!panel) return [];\n\n      // 💡 自动化展开被折叠的通知分类（如“展开更多”、“查看历史消息”等）\n      try {\n        const expandBtns = Array.from(panel.querySelectorAll('button, div, span, a'))\n          .filter((el) => visible(el) && /展开|查看更多|历史消息|更多通知/.test(compact(el.innerText || el.textContent)));\n        for (const btn of expandBtns) {\n          try { btn.click(); } catch (_) {}\n        }\n      } catch (_) {}\n\n      const scrollable = panel.querySelector?.('[class*=\"scroll\"], [class*=\"Scroll\"], [class*=\"list\"], [class*=\"List\"]') || panel;\n      const allRowNodes = new Set();\n\n      const collectRowsFromCurrentViewport = () => {\n        const rowSet = new Set();\n        const addRow = (el) => {\n          if (!visible(el) || el === panel) return;\n          let node = el;\n          while (node && node !== panel) {\n            const r = node.getBoundingClientRect();\n            const text = compact(node.innerText || node.textContent);\n            if (r.width >= 180 && r.height >= 36 && text && (EVENT_RE.test(text) || text.length >= 8)) {\n              rowSet.add(node);\n              return;\n            }\n            node = node.parentElement;\n          }\n        };\n        panel.querySelectorAll('.JkTB0jW1, [role=\"listitem\"], li, [data-e2e*=\"notice\"], [data-e2e*=\"notification\"]').forEach(addRow);\n        panel.querySelectorAll('[data-e2e=\"user-name-card\"], a[href*=\"/user/\"], pre').forEach(addRow);\n        if (!rowSet.size) {\n          Array.from(panel.children).forEach((child) => {\n            if (visible(child) && EVENT_RE.test(compact(child.innerText || child.textContent))) rowSet.add(child);\n          });\n        }\n        rowSet.forEach((n) => allRowNodes.add(n));\n      };\n\n      collectRowsFromCurrentViewport();\n\n      if (scrollable && typeof scrollable.scrollBy === 'function') {\n        try {\n          scrollable.scrollBy(0, 300);\n          collectRowsFromCurrentViewport();\n          scrollable.scrollBy(0, 300);\n          collectRowsFromCurrentViewport();\n          scrollable.scrollTop = 0;\n        } catch (_) {}\n      }\n\n      const rows = Array.from(allRowNodes)\n        .filter((row) => visible(row) && EVENT_RE.test(compact(row.innerText || row.textContent)))\n        .sort((a, b) => {\n          const ar = a.getBoundingClientRect();\n          const br = b.getBoundingClientRect();\n          return (ar.top - br.top) || ((ar.width * ar.height) - (br.width * br.height));\n        })\n        .filter((row, idx, arr) => !arr.some((other, otherIdx) =>\n          otherIdx !== idx\n          && other.contains(row)\n          && compact(other.innerText || other.textContent) === compact(row.innerText || row.textContent)\n        ));\n\n      const seenTexts = new Set();\n      return rows.slice(0, 40).map((row) => {\n        const rowText = compact(row.innerText || row.textContent || '');\n        if (!rowText || seenTexts.has(rowText)) return null;\n        seenTexts.add(rowText);\n        const userNameEl = row.querySelector('[data-e2e=\"user-name-card\"]');\n        const linkEl = row.querySelector('a[href*=\"/user/\"]');\n        const leaves = Array.from(row.querySelectorAll('pre, span, div, a'))\n          .filter((el) => el.children.length === 0 && compact(el.innerText || el.textContent))\n          .map((el) => compact(el.innerText || el.textContent));\n        const eventMatch = rowText.match(EVENT_RE);\n        const eventText = leaves.find((text) => EVENT_RE.test(text)) || eventMatch?.[0] || '';\n        let nickname = compact(userNameEl?.innerText || userNameEl?.textContent || linkEl?.innerText || linkEl?.textContent || '');\n        if (!nickname && eventMatch && eventMatch.index > 0) {\n          nickname = compact(rowText.slice(0, eventMatch.index).replace(/^@+/, ''));\n        }\n        const extractVideoUrlFromNode = (el) => {\n          if (!el) return '';\n          const videoLink = el.querySelector?.('a[href*=\"modal_id\"], a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"detail\"], [data-href*=\"modal_id\"], [data-href*=\"/video/\"]');\n          const rawUrl = videoLink?.href || videoLink?.getAttribute?.('data-href') || (el.tagName === 'A' ? el.href : '');\n          if (rawUrl) return rawUrl;\n\n          const nodesToInspect = [el];\n          try {\n            if (el.querySelectorAll) {\n              const children = Array.from(el.querySelectorAll('*'));\n              if (children.length < 60) nodesToInspect.push(...children);\n            }\n          } catch (_) {}\n\n          for (const node of nodesToInspect) {\n            try {\n              const keys = Object.keys(node);\n              const reactKey = keys.find((k) => k.startsWith('__reactProps') || k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance'));\n              if (!reactKey) continue;\n              const root = node[reactKey];\n\n              const visited = new Set();\n              const searchObj = (obj, depth = 0) => {\n                if (!obj || depth > 7) return '';\n                if (typeof obj === 'string') {\n                  const modalMatch = obj.match(/modal_id=(\\d+)/);\n                  if (modalMatch && modalMatch[1]) return 'https://www.douyin.com/jingxuan?modal_id=' + modalMatch[1];\n                  const videoMatch = obj.match(/\\/video\\/(\\d+)/);\n                  if (videoMatch && videoMatch[1]) return 'https://www.douyin.com/video/' + videoMatch[1];\n                  const groupMatch = obj.match(/group_id=(\\d{15,})/);\n                  if (groupMatch && groupMatch[1]) return 'https://www.douyin.com/jingxuan?modal_id=' + groupMatch[1];\n                  return '';\n                }\n                if (typeof obj !== 'object') return '';\n                if (visited.has(obj)) return '';\n                visited.add(obj);\n\n                const modalId = obj.modal_id || obj.modalId || obj.aweme_id || obj.awemeId || obj.item_id || obj.itemId || obj.group_id || obj.groupId;\n                if (modalId && /^\\d{15,}$/.test(String(modalId))) {\n                  return 'https://www.douyin.com/jingxuan?modal_id=' + modalId;\n                }\n\n                if (typeof obj.schema === 'string') {\n                  const res = searchObj(obj.schema, depth + 1);\n                  if (res) return res;\n                }\n                if (typeof obj.url === 'string') {\n                  const res = searchObj(obj.url, depth + 1);\n                  if (res) return res;\n                }\n                if (typeof obj.link_url === 'string') {\n                  const res = searchObj(obj.link_url, depth + 1);\n                  if (res) return res;\n                }\n\n                const keysToSearch = ['memoizedProps', 'pendingProps', 'item', 'data', 'notice', 'content', 'payload', 'target', 'aweme', 'aweme_info', 'awemeInfo', 'extra', 'group'];\n                for (const k of keysToSearch) {\n                  if (obj[k]) {\n                    const res = searchObj(obj[k], depth + 1);\n                    if (res) return res;\n                  }\n                }\n                return '';\n              };\n\n              const found = searchObj(root);\n              if (found) return found;\n            } catch (_) {}\n          }\n          return '';\n        };\n\n        const extractCommentIdFromNode = (el) => {\n          if (!el) return '';\n          const nodesToInspect = [el];\n          try {\n            if (el.querySelectorAll) {\n              const children = Array.from(el.querySelectorAll('*'));\n              if (children.length < 60) nodesToInspect.push(...children);\n            }\n          } catch (_) {}\n          for (const node of nodesToInspect) {\n            try {\n              const keys = Object.keys(node);\n              const reactKey = keys.find((k) => k.startsWith('__reactProps') || k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance'));\n              if (!reactKey) continue;\n              const root = node[reactKey];\n              const visited = new Set();\n              const searchCid = (obj, depth = 0) => {\n                if (!obj || depth > 7 || typeof obj !== 'object') return '';\n                if (visited.has(obj)) return '';\n                visited.add(obj);\n                const cid = obj.cid || obj.comment_id || obj.commentId || obj.comment?.cid;\n                if (cid && /^\\d{10,}$/.test(String(cid))) return String(cid);\n                const keysToSearch = ['memoizedProps', 'pendingProps', 'item', 'data', 'notice', 'content', 'comment', 'payload', 'extra'];\n                for (const k of keysToSearch) {\n                  if (obj[k]) {\n                    const res = searchCid(obj[k], depth + 1);\n                    if (res) return res;\n                  }\n                }\n                return '';\n              };\n              const found = searchCid(root);\n              if (found) return found;\n            } catch (_) {}\n          }\n          return '';\n        };\n\n        const preText = compact(row.querySelector('pre')?.innerText || row.querySelector('pre')?.textContent || '');\n        const timeText = [...leaves].reverse().find((text) => TIME_RE.test(text)) || '';\n        const videoUrl = extractVideoUrlFromNode(row);\n        const commentId = extractCommentIdFromNode(row);\n        return {\n          source: 'notification',\n          nickname: nickname || '抖音用户',\n          userUrl: linkEl?.href || '',\n          videoUrl: videoUrl || '',\n          commentId: commentId || '',\n          text: preText || rowText,\n          rowText,\n          eventText,\n          timeText,\n          hasFollowButton: !!row.querySelector('[data-e2e=\"notice-follow-button\"], [class*=\"Follow\"], [class*=\"follow\"]'),\n        };\n      }).filter(Boolean);\n    })()").catch(() => []);
  }
  function fn41(list = [], list2 = []) {
    const set = new Set((Array.isArray(list) ? list : []).map(arg1 => compactText(arg1.nickname) + "|" + compactText(arg1.text)));
    const list3 = [...(Array.isArray(list) ? list : [])];
    for (const item of Array.isArray(list2) ? list2 : []) {
      const value = compactText(item.nickname) + "|" + compactText(item.text);
      if (set.has(value)) {
        continue;
      }
      set.add(value);
      list3.push(item);
    }
    return list3;
  }
  function fn42(list = []) {
    return (Array.isArray(list) ? list : []).filter(arg1 => {
      if (!arg1 || arg1.isFolder) {
        return false;
      }
      if (!arg1.unread) {
        return false;
      }
      if (isDouyinStrangerMessagesFolderRow({
        title: arg1.nickname,
        titleRaw: arg1.nickname,
        rowText: arg1.rowText,
        kind: arg1.kind
      })) {
        return false;
      }
      return true;
    });
  }
  async function fn43(arg1) {
    if (!arg1 || arg1.isDestroyed()) {
      return null;
    }
    return arg1.webContents.executeJavaScript("(() => {\n      const compact = (value) => String(value || '').replace(/\\s+/g, ' ').trim();\n      const visible = (el) => {\n        if (!el) return false;\n        const r = el.getBoundingClientRect();\n        const s = getComputedStyle(el);\n        return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';\n      };\n      const candidates = Array.from(document.querySelectorAll(\n        '[data-e2e=\"conversation-item\"], .conversationStrangerBoxwrapper, [class*=\"Conversation\"], [class*=\"conversation\"], [class*=\"Stranger\"], [class*=\"stranger\"], [role=\"listitem\"], div, span'\n      )).filter((el) => {\n        if (!visible(el)) return false;\n        const r = el.getBoundingClientRect();\n        if (r.width < 80 || r.height < 24 || r.width > 720 || r.height > 160) return false;\n        const text = compact(el.innerText || el.textContent || '');\n        if (!text || !text.includes('陌生人消息')) return false;\n        if (text.length > 36 && !/^陌生人消息/.test(text) && !/^<+\\s*陌生人消息/.test(text)) return false;\n        return true;\n      }).sort((a, b) => {\n        const score = (el) => {\n          const text = compact(el.innerText || el.textContent || '');\n          const r = el.getBoundingClientRect();\n          let s = 0;\n          if (/^陌生人消息/.test(text)) s += 100;\n          if (el.matches('.conversationStrangerBoxwrapper, [class*=\"StrangerBox\"], [class*=\"strangerBox\"]')) s += 80;\n          if (el.matches('[data-e2e=\"conversation-item\"], [role=\"listitem\"]')) s += 40;\n          if (text === '陌生人消息') s += 50;\n          return s + Math.min(r.width * r.height / 1000, 30);\n        };\n        return score(b) - score(a);\n      });\n      const el = candidates[0];\n      if (!el) return null;\n      const r = el.getBoundingClientRect();\n      return { x: Math.round(r.left + Math.min(48, r.width / 2)), y: Math.round(r.top + r.height / 2) };\n    })()").catch(() => null);
  }
  async function fn44(arg1) {
    if (!arg1 || arg1.isDestroyed()) {
      return null;
    }
    return arg1.webContents.executeJavaScript("(() => {\n      const compact = (value) => String(value || '').replace(/\\s+/g, ' ').trim();\n      const visible = (el) => {\n        if (!el) return false;\n        const r = el.getBoundingClientRect();\n        const s = getComputedStyle(el);\n        return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';\n      };\n      const nodes = Array.from(document.querySelectorAll(\n        '[class*=\"Header\"], [class*=\"header\"], [class*=\"Nav\"], [class*=\"nav\"], [class*=\"Title\"], [class*=\"title\"], div, span, button, [role=\"button\"]'\n      ));\n      let header = null;\n      for (const el of nodes) {\n        if (!visible(el)) continue;\n        const text = compact(el.innerText || el.textContent || '');\n        if (text.length > 0 && text.length <= 20 && /^<+\\s*陌生人消息$/.test(text)) {\n          header = el;\n          break;\n        }\n      }\n      if (!header) return null;\n      const back = header.querySelector('svg, [class*=\"back\"], [class*=\"Back\"], [class*=\"arrow\"], [class*=\"Arrow\"]') || header;\n      const r = back.getBoundingClientRect();\n      return { x: Math.round(r.left + Math.min(18, r.width / 3)), y: Math.round(r.top + r.height / 2) };\n    })()").catch(() => null);
  }
  async function fn45(arg1) {
    const result = await fn44(arg1);
    if (!result) {
      return false;
    }
    await fn46(arg1, result.x, result.y);
    await delay(1200);
    return true;
  }
  async function fn47(arg1) {
    const result = await fn43(arg1);
    if (!result) {
      return false;
    }
    await fn46(arg1, result.x, result.y);
    await delay(1800);
    return true;
  }
  async function fn48(arg1) {
    const result = await arg1.webContents.executeJavaScript("(() => {\n      const TIME_RE = /^(刚刚|\\d+秒前|\\d+分钟前|\\d+小时前|\\d+天前|昨天|前天|星期.|\\d{1,2}:\\d{2}|\\d{2}-\\d{2}|\\d{4}-\\d{1,2}|\\d{1,2}\\/\\d{1,2})$/;\n      const visible = (el) => {\n        if (!el) return false;\n        const r = el.getBoundingClientRect();\n        const s = getComputedStyle(el);\n        return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';\n      };\n      const compact = (value) => String(value || '')\n        .replace(/[\\u200b-\\u200f\\u202a-\\u202e\\u2060-\\u206f]/g, '')\n        .replace(/\\s+/g, ' ')\n        .trim();\n      const folderNameRe = /^(?:<+\\s*)?(陌生人消息|私信|消息)$/;\n      const insideStrangerFolder = Array.from(document.querySelectorAll(\n        '[class*=\"Header\"], [class*=\"header\"], [class*=\"Nav\"], [class*=\"nav\"], [class*=\"Title\"], [class*=\"title\"], div, span'\n      )).some((el) => {\n        if (!visible(el)) return false;\n        const text = compact(el.innerText || el.textContent || '');\n        return text.length > 0 && text.length <= 20 && /^<+\\s*陌生人消息$/.test(text);\n      });\n\n      // 💡 Direct document query prevents root-container matching failures when im-dialog overlaps.\n      const rows = Array.from(document.querySelectorAll(\n        '[data-e2e=\"conversation-item\"], .conversationStrangerBoxwrapper, [class*=\"Conversation\"], [class*=\"conversation\"], [class*=\"Stranger\"], [class*=\"stranger\"], [role=\"listitem\"]'\n      ))\n        .filter((row) => {\n          if (!visible(row)) return false;\n          const r = row.getBoundingClientRect();\n          const text = compact(row.innerText || row.textContent);\n          return r.width >= 160 && r.height >= 32 && text && !/^私信$|^消息$/.test(text);\n        })\n        .sort((a, b) => {\n          const ar = a.getBoundingClientRect();\n          const br = b.getBoundingClientRect();\n          return (ar.top - br.top) || ((ar.width * ar.height) - (br.width * br.height));\n        });\n\n      const seenTexts = new Set();\n      const list = [];\n      const debugLogs = [];\n\n      rows.slice(0, 40).forEach((row) => {\n        const rowText = compact(row.innerText || row.textContent || '');\n        if (!rowText || seenTexts.has(rowText)) return;\n        seenTexts.add(rowText);\n        const lines = rowText.split(/\\n|\\s{2,}/).map((part) => compact(part)).filter(Boolean);\n        const titleRaw = compact(\n          row.querySelector('[class*=\"titleWrapper\"], [class*=\"TitleWrapper\"], [class*=\"title\"], [class*=\"Title\"]')?.innerText\n          || row.querySelector('a[href*=\"/user/\"]')?.innerText\n          || ''\n        );\n        const titleParts = titleRaw.split(/\\n|\\s{2,}/).map((part) => compact(part)).filter(Boolean);\n        const timeEl = row.querySelector('[class*=\"timeStr\"], [class*=\"TimeStr\"], [class*=\"strangerTimeStr\"], [class*=\"time\"], [class*=\"Time\"]');\n        const msgEl = row.querySelector('pre, [class*=\"HinttextBox\"], [class*=\"hint\"], [class*=\"Hint\"], [class*=\"Desc\"], [class*=\"desc\"], [class*=\"Content\"], [class*=\"content\"], [class*=\"Message\"], [class*=\"message\"]');\n        const ignoredTitle = /^(私信|消息|陌生人消息|未读|已读|\\d+)$/;\n        const timeText = compact(timeEl?.innerText || timeEl?.textContent || [...lines].reverse().find((line) => TIME_RE.test(line)) || '');\n        let title = titleParts.find((part) => part && !TIME_RE.test(part) && !ignoredTitle.test(part)) || '';\n        if (!title) {\n          title = lines.find((line) => line && !TIME_RE.test(line) && !ignoredTitle.test(line)) || '';\n        }\n        let text = compact(msgEl?.innerText || msgEl?.textContent || '');\n        if (!text || text === title) {\n          text = [...lines].reverse().find((line) =>\n            line\n            && line !== title\n            && line !== timeText\n            && !TIME_RE.test(line)\n            && !ignoredTitle.test(line)\n          ) || '';\n        }\n        // 标题节点经常带上预览/时间/未读数，先剥掉再入库，避免轮次上限键漂移\n        if (title && text && title.includes(text) && title.length > text.length) {\n          const cut = title.indexOf(text);\n          if (cut > 0) title = compact(title.slice(0, cut));\n        }\n        if (title && timeText && title.endsWith(timeText)) {\n          title = compact(title.slice(0, -timeText.length));\n        }\n        title = compact(title\n          .replace(/(?:\\s|[·•])*(?:刚刚|\\d+秒前|\\d+分钟前|\\d+小时前|\\d+天前|昨天|前天|星期.|\\d{1,2}:\\d{2})$/u, '')\n          .replace(/(?:\\s|[·•])*\\d+\\+?\\s*$/u, ''));\n        if (!text) text = rowText;\n        const kind = /Stranger|stranger|陌生人/.test(row.className || rowText) ? 'stranger' : 'conversation';\n        const firstTitleLine = compact((titleRaw || '').split(/\\n/)[0] || title);\n        let isFolder = false;\n        try {\n          isFolder = folderNameRe.test(title)\n            || folderNameRe.test(firstTitleLine)\n            || (!title && /陌生人消息/.test(rowText) && kind === 'stranger')\n            || (/^<?\\s*陌生人消息/.test(rowText) && rowText.length <= 48)\n            || (row.matches('.conversationStrangerBoxwrapper, [class*=\"StrangerBox\"], [class*=\"strangerBox\"]') && /陌生人消息/.test(rowText));\n        } catch (_) {\n          isFolder = folderNameRe.test(title) || folderNameRe.test(firstTitleLine);\n        }\n        const attrBlob = compact([\n          row.getAttribute('aria-label') || '',\n          row.getAttribute('title') || '',\n          row.getAttribute('data-conversation-type') || '',\n          row.getAttribute('data-chat-type') || '',\n          row.getAttribute('data-e2e') || '',\n          row.className || '',\n          titleRaw,\n        ].join(' '));\n        let explicitGroupNode = null;\n        try {\n          explicitGroupNode = row.querySelector(\n            '[data-e2e*=\"group\"], [data-e2e*=\"Group\"], [data-chat-type=\"group\"], [data-conversation-type=\"group\"], '\n            + '[class*=\"GroupAvatar\"], [class*=\"group-avatar\"], [class*=\"groupAvatar\"], [class*=\"GroupChat\"], '\n            + '[class*=\"groupChat\"], [class*=\"ImGroup\"], [class*=\"im-group\"], [class*=\"conversation-group\"], '\n            + '[class*=\"AvatarList\"], [class*=\"avatarList\"], [aria-label*=\"群聊\"], [aria-label*=\"群消息\"], [title*=\"群聊\"]'\n          );\n        } catch (_) { explicitGroupNode = null; }\n        const rowRect = row.getBoundingClientRect();\n        const avatarImgs = Array.from(row.querySelectorAll('img')).filter((el) => {\n          if (!visible(el)) return false;\n          const r = el.getBoundingClientRect();\n          return r.left < rowRect.left + Math.min(96, rowRect.width * 0.38)\n            && r.width >= 10 && r.height >= 10 && r.width <= 72 && r.height <= 72;\n        });\n        const hasUserLink = !!row.querySelector('a[href*=\"/user/\"]');\n        // 页面内联启发式（与 shared/douyinDmGroupChat 对齐）：名称/人数/多人头像/DOM 标志\n        const strongName = /群聊|群消息|粉丝群|交流群|互助群|客户群|学员群|官方群|内部群|社群|售后群|资源群|同城群|本地群|宝妈群|创业群/;\n        const memberHint = /共\\s*\\d+\\s*人|\\d+\\s*人|[（(]\\s*(?:[2-9]|[1-9]\\d{1,2})\\s*[）)]/;\n        const groupAttr = /群聊|群消息|group(?:[_\\s-]?chat|[_\\s-]?conversation)|chatType[\"']?\\s*[:=]\\s*[\"']?group/i;\n        let groupReason = '';\n        let isGroupChat = false;\n        if (explicitGroupNode) {\n          isGroupChat = true;\n          groupReason = 'dom_explicit';\n        } else if (groupAttr.test(attrBlob)) {\n          isGroupChat = true;\n          groupReason = 'attr_text';\n        } else if (strongName.test(title) || /的群$/.test(title) || (/^.{1,24}群$/.test(title) && !/个人|自己/.test(title))) {\n          isGroupChat = true;\n          groupReason = 'name_strong';\n        } else if (memberHint.test(title)) {\n          isGroupChat = true;\n          groupReason = /群/.test(title) ? 'name_群+人数' : 'name_paren_count';\n        } else {\n          let score = 0;\n          const reasons = [];\n          if (/群/.test(title)) { score += 2; reasons.push('name_has_群'); }\n          if (memberHint.test(title)) { score += 3; reasons.push('member_hint'); }\n          if (avatarImgs.length >= 3) { score += 4; reasons.push('avatars>=3'); }\n          else if (avatarImgs.length >= 2) { score += 2; reasons.push('avatars>=2'); }\n          if (!hasUserLink && score >= 2) { score += 1; reasons.push('no_user_link'); }\n          if (/GroupAvatar|group-avatar|groupAvatar|GroupChat|groupChat|ImGroup|im-group|AvatarList|avatarList|多人头像/i.test(attrBlob)) {\n            score += 3; reasons.push('class_hint');\n          }\n          if (score >= 3) {\n            isGroupChat = true;\n            groupReason = 'score_' + score + ':' + reasons.join('+');\n          }\n        }\n        const knownUnreadBadge = row.querySelector(\n          '[class*=\"UnRead\"], [class*=\"Unread\"], [class*=\"unread\"], [class*=\"red-dot\"], [class*=\"RedDot\"], [aria-label*=\"未读\"]'\n        );\n        const visualUnreadBadge = Array.from(row.querySelectorAll('span, i, div, b, em')).find((el) => {\n          if (!visible(el)) return false;\n          const r = el.getBoundingClientRect();\n          if (r.width > 22 || r.height > 22 || r.width < 4 || r.height < 4) return false;\n          const color = String(getComputedStyle(el).backgroundColor || '');\n          const badgeText = compact(el.innerText || el.textContent || '');\n          const isRed = /rgb\\((?:2[0-5]\\d|1\\d\\d),\\s*(?:[0-8]?\\d),\\s*(?:[0-8]?\\d)\\)/.test(color)\n            || /rgba\\((?:2[0-5]\\d|1\\d\\d),\\s*(?:[0-8]?\\d),\\s*(?:[0-8]?\\d)/.test(color);\n          const isNum = /^\\d+\\+?$/.test(badgeText);\n          // 必须是红点/红底未读数，不能把时间数字、普通角标当成未读\n          return isRed && (isNum || (!badgeText && r.width <= 16 && r.height <= 16));\n        });\n        const unreadBadge = knownUnreadBadge || visualUnreadBadge;\n        const hasRedDot = !!unreadBadge;\n        const unreadText = unreadBadge ? compact(unreadBadge.innerText || unreadBadge.textContent) : '';\n\n        debugLogs.push({\n          nickname: isFolder ? '陌生人消息' : title,\n          rowText: rowText.substring(0, 100),\n          hasRedDot,\n          unreadText,\n          rowClasses: row.className,\n          badgeClasses: unreadBadge ? unreadBadge.className : null,\n          isGroupChat,\n          isFolder,\n          groupReason,\n          avatarCount: avatarImgs.length,\n        });\n\n        list.push({\n          source: 'dm',\n          kind: isFolder ? 'stranger-folder' : kind,\n          isFolder,\n          nickname: isFolder ? '陌生人消息' : (title || '抖音用户'),\n          userUrl: row.querySelector('a[href*=\"/user/\"]')?.href || '',\n          text: isFolder ? '' : text,\n          rowText,\n          eventText: '私信',\n          timeText,\n          unread: hasRedDot,\n          isGroupChat,\n          groupReason,\n          fromStrangerFolder: !!insideStrangerFolder && !isFolder,\n        });\n      });\n      return { ok: true, list, debugLogs, insideStrangerFolder };\n    })()").catch(arg1 => ({
      ok: false,
      error: arg1.message || String(arg1)
    }));
    if (result && result.ok) {
      if (result.debugLogs && result.debugLogs.length) {
        const value = result.debugLogs.filter(arg1 => arg1.hasRedDot).length;
        const value2 = result.debugLogs.filter(arg1 => arg1.isGroupChat).length;
        const value3 = result.debugLogs.filter(arg1 => arg1.isFolder).length;
        console.log("[selfWarmup-DM-Debug] Scraped " + result.debugLogs.length + " message rows, unread=" + value + ", groups=" + value2 + ", folders=" + value3 + ", insideFolder=" + !!result.insideStrangerFolder);
        result.debugLogs.filter(arg1 => arg1.isGroupChat).slice(0, 8).forEach(arg1 => {
          console.log("[selfWarmup-DM-Debug] group-hit: " + (arg1.nickname || "?") + " reason=" + (arg1.groupReason || "?"));
        });
      }
      return result;
    }
    console.log("[selfWarmup-DM-Debug] scrapeMessages failed: " + (result?.error || "Unknown error"));
    return {
      ok: false,
      list: [],
      debugLogs: [],
      insideStrangerFolder: false,
      error: result?.error || ""
    };
  }
  async function fn49(arg1, flag = false) {
    let result = await fn48(arg1);
    if (!result || !result.ok) {
      return {
        ok: false,
        list: [],
        reason: result?.error || "读取私信列表失败"
      };
    }
    if (result.insideStrangerFolder) {
      const result2 = await fn45(arg1);
      if (result2) {
        result = await fn48(arg1);
        if (!result || !result.ok) {
          return {
            ok: false,
            list: fn42(result?.list),
            reason: result?.error || "返回私信列表后读取失败"
          };
        }
      } else {
        return {
          ok: true,
          list: fn42(result.list)
        };
      }
    }
    const local = result.list || [];
    const result2 = local.find(arg1 => arg1.isFolder || isDouyinStrangerMessagesFolderName(arg1.nickname));
    let result3 = fn42(local);
    if (result2) {
      const result = await fn47(arg1);
      if (result) {
        const result = await fn48(arg1);
        const result2 = fn42(result?.list).map(arg1 => ({
          ...arg1,
          fromStrangerFolder: true
        }));
        result3 = fn41(result3, result2);
        console.log("[selfWarmup-DM-Debug] stranger-folder inner unread=" + result2.length + ", merged=" + result3.length);
      }
    }
    if (!result3.length && flag && local.length) {
      console.log("[selfWarmup-DM-Debug] Header has unread badge but no unread row badge; skip fallback to avoid false DM replies");
    }
    return {
      ok: true,
      list: result3
    };
  }
  function fn50(arg1, arg2) {
    const result = parseNotificationType((arg1.eventText || "") + " " + (arg1.rowText || ""));
    const result2 = compactText(arg1.text || arg1.rowText);
    return {
      source: "notification",
      eventType: result,
      eventLabel: EVENT_TYPE_LABELS[result] || "未知通知",
      accountId: String(arg2.id),
      accountName: arg2.nickname || arg2.name || "账号" + arg2.id,
      nickname: compactText(arg1.nickname),
      userUrl: arg1.userUrl || "",
      videoUrl: arg1.videoUrl || "",
      commentId: arg1.commentId || arg1.cid || "",
      cid: arg1.commentId || arg1.cid || "",
      text: result2,
      notificationRowText: compactText(arg1.rowText),
      notificationEventText: compactText(arg1.eventText),
      timeText: compactText(arg1.timeText),
      unread: false,
      hasFollowButton: !!arg1.hasFollowButton
    };
  }
  function fn51(arg1, arg2) {
    const result = compactText(arg1.timeText);
    let result2 = compactText(arg1.text);
    if (!result2) {
      const result3 = compactText(arg1.rowText);
      const result4 = compactText(arg1.nickname);
      result2 = result3.replace(result4, "").replace(result, "").replace(/(?:\s|[·•])*\d+\+?\s*$/u, "").replace(/^(?:\s|[·•])+|(?:\s|[·•])+$/ug, "").trim();
    }
    const result3 = sanitizeDmNickname(arg1.nickname, result2, result);
    if (arg1.isFolder || isDouyinStrangerMessagesFolderName(result3) || isDouyinStrangerMessagesFolderRow({
      title: result3,
      titleRaw: arg1.nickname,
      rowText: arg1.rowText,
      kind: arg1.kind
    })) {
      return null;
    }
    let result4 = looksLikeDouyinGroupChatName(result3 || arg1.nickname);
    if (!result4.isGroup) {
      result4 = looksLikeDouyinGroupChatName(compactText(arg1.rowText).split(/\n/)[0].slice(0, 48));
    }
    const result5 = detectDouyinDmIsGroupChat({
      name: result3 || arg1.nickname,
      rowText: arg1.rowText,
      attrBlob: arg1.groupReason || "",
      hasExplicitGroupNode: !!arg1.isGroupChat
    });
    const local = !!arg1.isGroupChat || result4.isGroup || result5.isGroup;
    return {
      source: "dm",
      eventType: "message",
      eventLabel: EVENT_TYPE_LABELS.message,
      accountId: String(arg2.id),
      accountName: arg2.nickname || arg2.name || "账号" + arg2.id,
      nickname: result3 || compactText(arg1.nickname) || "抖音用户",
      userUrl: arg1.userUrl || "",
      text: result2,
      timeText: result,
      unread: !!arg1.unread,
      isGroupChat: local,
      groupReason: arg1.groupReason || result4.reason || result5.reason || ""
    };
  }
  function fn52(arg1, arg2) {
    const value = WATCH_KEYS[arg2.eventType];
    if (!value) {
      return false;
    }
    return arg1[value] !== false;
  }
  function fn53(arg1, arg2) {
    if (arg2.source === "dm" && isDouyinStrangerMessagesFolderName(arg2.nickname)) {
      return "陌生人消息是文件夹，需进入后识别具体会话";
    }
    if (arg2.source === "dm" && arg1.excludeGroupChats !== false) {
      if (arg2.isGroupChat) {
        return "已开启“排除群聊”";
      }
      const result = looksLikeDouyinGroupChatName(arg2.nickname);
      if (result.isGroup) {
        arg2.isGroupChat = true;
        arg2.groupReason = result.reason;
        return "已开启“排除群聊”";
      }
    }
    const result = splitList(arg1.excludeUsers).map(normalizeName);
    if (!result.length) {
      return "";
    }
    const result2 = normalizeName(arg2.nickname);
    if (result.some(arg1 => arg1 && result2 === arg1)) {
      return "命中排除用户";
    } else {
      return "";
    }
  }
  function fn54(options = {}) {
    let result = Number(options.actionDelayMin);
    let result2 = Number(options.actionDelayMax);
    if (!Number.isFinite(result)) {
      result = 2;
    }
    if (!Number.isFinite(result2)) {
      result2 = 6;
    }
    if (result > result2) {
      [result, result2] = [result2, result];
    }
    result = Math.max(1, Math.floor(result));
    result2 = Math.max(result, Math.floor(result2));
    const value = Math.floor(Math.random() * (result2 - result + 1)) + result;
    return value * 1000;
  }
  function fn55(arg1, arg2, text = "comment", text2 = "") {
    const result = extractUserKeyFromUrl(text2);
    if (result) {
      return String(arg1 || "") + "|uid:" + result + "|" + text;
    }
    return String(arg1 || "") + "|" + normalizeName(arg2) + "|" + text;
  }
  function fn56(arg1, arg2, text = "comment", text2 = "") {
    const list = [];
    const result = extractUserKeyFromUrl(text2);
    const result2 = normalizeName(arg2);
    const result3 = String(arg1 || "");
    if (result) {
      list.push(result3 + "|uid:" + result + "|" + text);
    }
    if (result2) {
      list.push(result3 + "|" + result2 + "|" + text);
      list.push(result3 + "|" + result2);
      list.push(result2);
    }
    return [...new Set(list.filter(Boolean))];
  }
  function fn57(arg1, arg2, text = "", text2 = "comment", text3 = "") {
    const value = "self_warmup_user_rounds_" + arg1;
    const local = store.get(value, {}) || {};
    let num = 0;
    for (const item of fn56(text, arg2, text2, text3)) {
      num = Math.max(num, Number(local?.[item] ?? 0));
    }
    const result = String(text || "");
    const result2 = normalizeName(arg2);
    if (result2) {
      const value = result + "|" + result2 + "|" + text2;
      num = Math.max(num, Number(local?.[value] ?? 0));
      const value2 = result + "|";
      const value3 = "|" + text2;
      for (const [local2, local3] of Object.entries(local)) {
        if (!local2.startsWith(value2) || !local2.endsWith(value3)) {
          continue;
        }
        const result = local2.slice(value2.length, local2.length - value3.length);
        if (result === result2 || result.startsWith(result2 + " ") || result.startsWith(result2 + "|") || local2.includes("|" + result2 + "|") || local2 === value) {
          num = Math.max(num, Number(local3 ?? 0));
        }
      }
    }
    return num;
  }
  function fn58(arg1, arg2, text = "", text2 = "comment", text3 = "") {
    const value = "self_warmup_user_rounds_" + arg1;
    const local = store.get(value, {}) || {};
    const result = fn57(arg1, arg2, text, text2, text3);
    const value2 = result + 1;
    const result2 = String(text || "");
    const result3 = normalizeName(arg2);
    const result4 = extractUserKeyFromUrl(text3);
    if (result4) {
      local[result2 + "|uid:" + result4 + "|" + text2] = value2;
    }
    if (result3) {
      local[result2 + "|" + result3 + "|" + text2] = value2;
    }
    if (!result4 && !result3) {
      local[fn55(text, arg2, text2, text3)] = value2;
    }
    store.set(value, local);
    return value2;
  }
  function fn59(options = {}) {
    return Math.max(1, Math.min(20, Number(options.actionUserMaxRounds ?? options.actionMessageMaxRounds) || 1));
  }
  function fn60(arg1, arg2, arg3, text = "", text2 = "comment", text3 = "") {
    return fn57(arg1, arg3, text, text2, text3) >= fn59(arg2);
  }
  function fn61(arg1, arg2, arg3) {
    if (!arg2.enableAutoActions || !arg3.matched) {
      return [];
    }
    const list = [];
    const result = fn60(arg1, arg2, arg3.nickname, arg3.accountId, "comment", arg3.userUrl);
    const result2 = fn60(arg1, arg2, arg3.nickname, arg3.accountId, "dm", arg3.userUrl);
    const value = fn57(arg1, arg3.nickname, arg3.accountId, "dm", arg3.userUrl) > 0;
    if (arg3.eventType === "comment" && arg2.watchComments !== false) {
      if (arg2.actionCommentLike !== false) {
        list.push("like_comment");
      }
      if (arg2.actionCommentReply && !result) {
        list.push("reply_comment");
      }
    }
    if (arg3.eventType === "reply" && arg2.watchReplies !== false) {
      if (arg2.actionReplyLike !== false) {
        list.push("like_comment");
      }
      if (arg2.actionReplyReply && !result) {
        list.push("reply_comment");
      }
      if (arg2.actionReplyFollow) {
        list.push("user_follow");
      }
      if (arg2.actionReplyDm && !result2 && !value) {
        list.push("send_dm");
      }
    }
    if (arg3.eventType === "like" && arg2.watchLikes !== false) {
      if (arg2.actionLikeFollow) {
        list.push("user_follow");
      }
      if (arg2.actionLikeDm && !result2 && !value) {
        list.push("send_dm");
      }
    }
    if (arg3.eventType === "follow" && arg2.watchFollows !== false) {
      if (arg2.actionFollowBack) {
        list.push("follow_back");
      }
      if (arg2.actionFollowDm && !result2 && !value) {
        list.push("send_dm");
      }
    }
    if (arg3.eventType === "message" && arg2.watchMessages !== false && arg2.actionMessageReply) {
      if (!result2) {
        list.push("reply_dm");
      }
    }
    return list.filter(arg12 => fn4(arg1, arg12, arg3.accountId));
  }
  function fn62(arg1, arg2, arg3) {
    if (!arg2.enableAutoActions || !arg3.matched) {
      return [];
    }
    const local = arg3.eventType === "comment" && arg2.watchComments !== false;
    const local2 = arg3.eventType === "reply" && arg2.watchReplies !== false;
    const local3 = arg3.eventType === "message" && arg2.watchMessages !== false;
    const result = fn59(arg2);
    const list = [];
    if (local3) {
      if (!arg2.actionMessageReply) {
        return [{
          action: "reply_dm",
          reason: "未开启“自动回复私信”"
        }];
      }
      const result2 = fn57(arg1, arg3.nickname, arg3.accountId, "dm", arg3.userUrl);
      if (result2 >= result) {
        return [{
          action: "reply_dm",
          reason: "已达每用户 " + result + " 轮私信回复上限（当前 " + result2 + "/" + result + "）"
        }];
      }
      return [];
    }
    const local4 = arg3.eventType === "like" && arg2.watchLikes !== false;
    const local5 = arg3.eventType === "follow" && arg2.watchFollows !== false;
    const local6 = local2 && arg2.actionReplyDm || local4 && arg2.actionLikeDm || local5 && arg2.actionFollowDm;
    if (local6) {
      const result2 = fn57(arg1, arg3.nickname, arg3.accountId, "dm", arg3.userUrl);
      if (result2 > 0) {
        list.push({
          action: "send_dm",
          reason: "该用户本任务已发过私信，不再主动私信"
        });
      } else if (result2 >= result) {
        list.push({
          action: "send_dm",
          reason: "已达每用户 " + result + " 轮私信上限（当前 " + result2 + "/" + result + "）"
        });
      }
    }
    if (!local && !local2) {
      return list;
    }
    const value = local ? !!arg2.actionCommentReply : !!arg2.actionReplyReply;
    if (!value) {
      list.push({
        action: "reply_comment",
        reason: local ? "未开启“自动回复评论”" : "未开启“自动回复”"
      });
      return list;
    }
    const result2 = fn57(arg1, arg3.nickname, arg3.accountId, "comment", arg3.userUrl);
    if (result2 >= result) {
      list.push({
        action: "reply_comment",
        reason: "已达每用户 " + result + " 轮回复上限（当前 " + result2 + "/" + result + "）"
      });
    }
    return list;
  }
  function fn63(arg1, arg2, arg3, arg4) {
    if (!arg2.enableAutoActions || !arg3.matched) {
      return arg4;
    }
    const list = [];
    if (arg3.eventType === "comment" && arg2.watchComments !== false) {
      if (arg2.actionCommentLike !== false) {
        list.push("like_comment");
      }
      if (arg2.actionCommentReply) {
        list.push("reply_comment");
      }
    }
    if (arg3.eventType === "reply" && arg2.watchReplies !== false) {
      if (arg2.actionReplyLike !== false) {
        list.push("like_comment");
      }
      if (arg2.actionReplyReply) {
        list.push("reply_comment");
      }
      if (arg2.actionReplyFollow) {
        list.push("user_follow");
      }
      if (arg2.actionReplyDm) {
        list.push("send_dm");
      }
    }
    if (arg3.eventType === "like" && arg2.watchLikes !== false) {
      if (arg2.actionLikeFollow) {
        list.push("user_follow");
      }
      if (arg2.actionLikeDm) {
        list.push("send_dm");
      }
    }
    if (arg3.eventType === "follow" && arg2.watchFollows !== false) {
      if (arg2.actionFollowBack) {
        list.push("follow_back");
      }
      if (arg2.actionFollowDm) {
        list.push("send_dm");
      }
    }
    if (arg3.eventType === "message" && arg2.watchMessages !== false && arg2.actionMessageReply) {
      list.push("reply_dm");
    }
    const list2 = [];
    for (const item of list) {
      const result = fn5(arg1, item, arg3.accountId);
      if (!result) {
        continue;
      }
      list2.push({
        action: item,
        reason: result
      });
    }
    return arg4.concat(list2);
  }
  function fn64(options = {}) {
    if (options.action === "reply_comment") {
      return "未回复评论（" + (options.reason || "已跳过") + "）";
    }
    if (options.action === "reply_dm" || options.action === "send_dm") {
      return "未回复私信（" + (options.reason || "已跳过") + "）";
    }
    return (ACTION_LABELS[options.action] || options.action || "动作") + "已跳过（" + (options.reason || "未知原因") + "）";
  }
  async function fn46(arg1, arg2, arg3) {
    const result = Math.round(Number(arg2) || 0);
    const result2 = Math.round(Number(arg3) || 0);
    if (result <= 0 || result2 <= 0) {
      return false;
    }
    arg1.webContents.sendInputEvent({
      type: "mouseMove",
      x: result,
      y: result2
    });
    await delay(120);
    arg1.webContents.sendInputEvent({
      type: "mouseDown",
      x: result,
      y: result2,
      button: "left",
      clickCount: 1
    });
    await delay(80);
    arg1.webContents.sendInputEvent({
      type: "mouseUp",
      x: result,
      y: result2,
      button: "left",
      clickCount: 1
    });
    await delay(400);
    return true;
  }
  function fn65(options = {}) {
    let result = Number(options.followDmDelayMin);
    let result2 = Number(options.followDmDelayMax);
    if (!Number.isFinite(result)) {
      result = Number(options.actionDelayMin) || 3;
    }
    if (!Number.isFinite(result2)) {
      result2 = Number(options.actionDelayMax) || 8;
    }
    if (result > result2) {
      [result, result2] = [result2, result];
    }
    result = Math.max(1, Math.floor(result));
    result2 = Math.max(result, Math.floor(result2));
    const value = Math.floor(Math.random() * (result2 - result + 1)) + result;
    return value * 1000;
  }
  async function fn66(arg1, text = "") {
    const result = await fn39(arg1, "notification", {
      taskId: text
    });
    return isWarmupSurfaceComplete(result);
  }
  async function fn67(arg1, text = "") {
    const result = await fn39(arg1, "message", {
      taskId: text,
      reloadOnFailure: false
    });
    return isWarmupSurfaceComplete(result);
  }
  async function fn68(arg1, arg2, list = []) {
    if (arg1.isDestroyed()) {
      return {
        found: false,
        unread: false,
        reason: "window-destroyed"
      };
    }
    return arg1.webContents.executeJavaScript("(() => {\n      const selectors = " + JSON.stringify(list) + ";\n      const targetLabel = " + JSON.stringify(arg2) + ";\n      const compact = (value) => String(value || '')\n        .replace(/[\\u200b-\\u200f\\u202a-\\u202e\\u2060-\\u206f]/g, '')\n        .replace(/\\s+/g, ' ')\n        .trim();\n      const visible = (el) => {\n        if (!el) return false;\n        const r = el.getBoundingClientRect();\n        const s = getComputedStyle(el);\n        return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden';\n      };\n      \n      const matchedLabels = [targetLabel];\n      if (targetLabel === '私信') {\n        matchedLabels.push('消息');\n      }\n      \n      const candidates = [];\n      const pushCandidate = (el) => {\n        if (!visible(el)) return;\n        const text = compact(el.innerText || el.textContent);\n        const dataE2e = el.getAttribute('data-e2e') || '';\n        const exact = matchedLabels.some((l) => text === l);\n        const contains = matchedLabels.some((l) => text.includes(l));\n        const isExpectedIm = targetLabel === '私信' && (dataE2e === 'im-entry' || dataE2e === 'something-button');\n        const isExpectedNotif = targetLabel === '通知' && (dataE2e === 'notification-entry' || dataE2e === 'something-button');\n        if (!exact && !contains && !isExpectedIm && !isExpectedNotif) return;\n        candidates.push(el);\n      };\n\n      selectors.forEach((sel) => {\n        try { document.querySelectorAll(sel).forEach(pushCandidate); } catch (_) {}\n      });\n      const header = document.querySelector('#douyin-header-menuCt')\n        || document.querySelector('header')\n        || document.body;\n      header.querySelectorAll(\n        '[data-e2e=\"notification-entry\"], [data-e2e=\"im-entry\"], [data-e2e=\"something-button\"], li, button, a, [role=\"button\"], div'\n      ).forEach(pushCandidate);\n      \n      if (!candidates.length) return { found: false, unread: false, reason: 'entry-not-found' };\n      candidates.sort((a, b) => {\n        const score = (el) => {\n          const r = el.getBoundingClientRect();\n          const text = compact(el.innerText || el.textContent);\n          const dataE2e = el.getAttribute('data-e2e') || '';\n          const exactEntry = targetLabel === '私信' && dataE2e === 'im-entry'\n            ? -10000\n            : (targetLabel === '通知' && dataE2e === 'notification-entry' ? -10000 : 0);\n          const exactLabel = matchedLabels.includes(text) ? -5000 : 0;\n          return exactEntry + exactLabel + (r.width * r.height);\n        };\n        return score(a) - score(b);\n      });\n      const targetEl = candidates[0];\n      \n      // Look for a red dot or badge element inside the candidate header entry\n      const badgeSelectors = '[class*=\"UnRead\"], [class*=\"Unread\"], [class*=\"unread\"], [class*=\"Badge\"], [class*=\"badge\"], [class*=\"dot\"], [class*=\"Dot\"], [class*=\"red-dot\"], [aria-label*=\"未读\"]';\n      const knownBadge = targetEl.querySelector(badgeSelectors);\n      if (knownBadge && visible(knownBadge)) return { found: true, unread: true, reason: 'known-badge' };\n      const unread = Array.from(targetEl.querySelectorAll('span, i, div')).some((el) => {\n        if (!visible(el)) return false;\n        const r = el.getBoundingClientRect();\n        if (r.width > 24 || r.height > 24) return false;\n        const style = getComputedStyle(el);\n        const color = String(style.backgroundColor || '');\n        const labelText = compact(el.innerText || el.textContent || '');\n        return /rgb\\((?:2[0-5]\\d|1\\d\\d),\\s*(?:[0-8]?\\d),\\s*(?:[0-8]?\\d)\\)/.test(color)\n          || /^\\d+\\+?$/.test(labelText);\n      });\n      return { found: true, unread, reason: unread ? 'visual-badge' : 'no-badge' };\n    })()").catch(arg1 => ({
      found: false,
      unread: false,
      reason: arg1?.message || "badge-probe-error"
    }));
  }
  async function fn69(arg1, arg2) {
    const result = await fn66(arg1);
    if (!result) {
      return {
        ok: false,
        reason: "未打开通知面板"
      };
    }
    const result2 = await arg1.webContents.executeJavaScript("(() => {\n      const compact = (value) => String(value || '').replace(/\\s+/g, ' ').trim();\n      const target = compact(" + JSON.stringify(arg2.nickname || "") + ").replace(/^@+/, '').toLowerCase();\n      const FOLLOW_RE = /关注了你|开始关注你|成为了你的粉丝/;\n      const ALREADY_RE = /^(互关|已关注|已互关)$|互关|已关注|已互关/;\n      const CLICKABLE_RE = /回关|^关注$|关注对方/;\n      const visible = (el) => {\n        if (!el) return false;\n        const r = el.getBoundingClientRect();\n        const s = getComputedStyle(el);\n        return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';\n      };\n      const panels = Array.from(document.querySelectorAll(\n        '[data-e2e=\"listDlgTest-container\"], .semi-popover-content, [class*=\"Notice\"], [class*=\"notice\"]'\n      )).filter(visible);\n      const panel = panels.sort((a, b) => {\n        const ar = a.getBoundingClientRect();\n        const br = b.getBoundingClientRect();\n        return (br.width * br.height) - (ar.width * ar.height);\n      })[0];\n      if (!panel) return { ok: false, reason: '未找到通知列表' };\n\n      const rowSet = new Set();\n      panel.querySelectorAll('li, [role=\"listitem\"], .JkTB0jW1, [data-e2e*=\"notice\"], [data-e2e*=\"notification\"], [class*=\"notice-item\"], [class*=\"NoticeItem\"]')\n        .forEach((node) => {\n          const text = compact(node.innerText || node.textContent || '');\n          if (!text || !FOLLOW_RE.test(text)) return;\n          if (target && !text.toLowerCase().includes(target)) return;\n          rowSet.add(node);\n        });\n\n      let lastUserUrl = '';\n      for (const row of rowSet) {\n        const userLink = row.querySelector('a[href*=\"/user/\"]');\n        const userUrl = userLink?.href || '';\n        if (userUrl) lastUserUrl = userUrl;\n\n        const candidates = Array.from(row.querySelectorAll(\n          '[data-e2e=\"notice-follow-button\"], button, [role=\"button\"], [class*=\"Follow\"], [class*=\"follow\"]'\n        )).filter(visible);\n\n        let followBtn = candidates.find((btn) => btn.getAttribute('data-e2e') === 'notice-follow-button')\n          || candidates.find((btn) => {\n            const label = compact(btn.innerText || btn.textContent || btn.getAttribute('aria-label') || '');\n            return CLICKABLE_RE.test(label) || ALREADY_RE.test(label);\n          });\n\n        if (!followBtn) continue;\n\n        const label = compact(\n          followBtn.innerText || followBtn.textContent || followBtn.getAttribute('aria-label') || ''\n        );\n        // 已关注态：互关/已关注（排除仍显示「回关」）\n        if (ALREADY_RE.test(label) && !/回关/.test(label)) {\n          return { ok: true, alreadyFollowed: true, userUrl, label };\n        }\n\n        try { followBtn.scrollIntoView({ block: 'center', inline: 'nearest' }); } catch (_) {}\n        const r = followBtn.getBoundingClientRect();\n        if (r.width <= 0 || r.height <= 0) continue;\n\n        // 页面内点击 + 坐标，兼容图标按钮/空文案的 data-e2e 回关钮\n        try { followBtn.click(); } catch (_) {}\n        return {\n          ok: true,\n          needClick: true,\n          clickedInPage: true,\n          x: Math.round(r.left + r.width / 2),\n          y: Math.round(r.top + r.height / 2),\n          userUrl,\n          label: label || '回关',\n        };\n      }\n      return {\n        ok: false,\n        reason: rowSet.size ? '通知中未找到回关按钮' : '未找到对应的关注通知',\n        userUrl: lastUserUrl,\n      };\n    })()").catch(() => ({
      ok: false,
      reason: "读取通知列表异常"
    }));
    if (result2.userUrl && !arg2.userUrl) {
      arg2.userUrl = result2.userUrl;
    }
    if (result2.alreadyFollowed) {
      return {
        ok: true,
        alreadyFollowed: true,
        userUrl: result2.userUrl || arg2.userUrl || "",
        label: result2.label || ""
      };
    }
    if (!result2.ok || !result2.needClick) {
      return {
        ok: false,
        reason: result2.reason || "未找到回关按钮",
        userUrl: result2.userUrl || arg2.userUrl || ""
      };
    }
    if (result2.x > 0 && result2.y > 0) {
      await fn46(arg1, result2.x, result2.y);
    }
    await delay(1600);
    const result3 = await arg1.webContents.executeJavaScript("(() => {\n      const compact = (value) => String(value || '').replace(/\\s+/g, ' ').trim();\n      const target = compact(" + JSON.stringify(arg2.nickname || "") + ").replace(/^@+/, '').toLowerCase();\n      const rows = Array.from(document.querySelectorAll(\n        '[data-e2e=\"notice-follow-button\"], button, [role=\"button\"], [class*=\"Follow\"], [class*=\"follow\"]'\n      ));\n      return rows.some((btn) => {\n        const row = btn.closest('li, [role=\"listitem\"], div');\n        const text = compact(row?.innerText || row?.textContent || btn.innerText || btn.textContent || '');\n        if (target && text && !text.toLowerCase().includes(target)) return false;\n        const label = compact(btn.innerText || btn.textContent || btn.getAttribute('aria-label') || '');\n        return /互关|已关注|已互关|发私信|私信/.test(label);\n      });\n    })()").catch(() => false);
    return {
      ok: !!result3,
      reason: result3 ? "" : "已点击回关，未确认按钮状态变化",
      userUrl: result2.userUrl || arg2.userUrl || ""
    };
  }
  async function fn70(arg1, arg2) {
    if (arg2.userUrl) {
      return arg2.userUrl;
    }
    const result = await fn66(arg1);
    if (!result) {
      return "";
    }
    const result2 = await arg1.webContents.executeJavaScript("(() => {\n      const compact = (value) => String(value || '').replace(/\\s+/g, ' ').trim();\n      const target = compact(" + JSON.stringify(arg2.nickname || "") + ").replace(/^@+/, '').toLowerCase();\n      const links = Array.from(document.querySelectorAll('a[href*=\"/user/\"]'));\n      for (const link of links) {\n        const row = link.closest('li, [role=\"listitem\"], div');\n        const text = compact(row?.innerText || row?.textContent || link.innerText || link.textContent || '');\n        if (target && text.toLowerCase().includes(target) && link.href) return link.href;\n      }\n      return '';\n    })()").catch(() => "");
    if (result2) {
      arg2.userUrl = result2;
    }
    return result2;
  }
  async function fn71(arg1, num = 12000) {
    const result = Date.now();
    const value = typeof runtimeConfig?.getPlain === "function" ? runtimeConfig.getPlain() : null;
    const local = value?.selectors?.["douyin.com"]?.profileMessageBtn || "[data-e2e=\"user-info-chat-btn\"], [data-e2e=\"chat-button\"], .EuZ9gjHD, .gifWSwDu, .message-button";
    const local2 = value?.gated?.profileReadyPattern || "抖音号|获赞|粉丝|关注|作品|喜欢|私信|发消息";
    while (Date.now() - result < num) {
      if (arg1.isDestroyed()) {
        return false;
      }
      const result = await arg1.webContents.executeJavaScript("(() => {\n        const bodyText = (document.body?.innerText || document.body?.textContent || '').trim();\n        const urlReady = /\\/user\\//.test(window.location.href);\n        let hasProfileText = false;\n        try { hasProfileText = new RegExp(" + JSON.stringify(local2) + ").test(bodyText); }\n        catch (_) { hasProfileText = /抖音号|获赞|粉丝|关注|作品|喜欢|私信|发消息/.test(bodyText); }\n        const hasMessageBtn = !!document.querySelector(" + JSON.stringify(local) + ");\n        return urlReady && (hasProfileText || hasMessageBtn);\n      })()").catch(() => false);
      if (result) {
        await delay(1200);
        return true;
      }
      await delay(300);
    }
    return false;
  }
  async function fn72(arg1, arg2) {
    if (arg1.isDestroyed()) {
      return false;
    }
    const result = await arg1.webContents.executeJavaScript("(() => {\n      const compact = (value) => String(value || '').replace(/\\s+/g, ' ').trim();\n      const target = compact(" + JSON.stringify(arg2 || "") + ").replace(/^@+/, '').toLowerCase();\n      const panels = Array.from(document.querySelectorAll(\n        '[data-e2e=\"listDlgTest-container\"], .semi-popover-content, [class*=\"Notice\"], [class*=\"notice\"]'\n      ));\n      for (const panel of panels) {\n        const rows = Array.from(panel.querySelectorAll('li, [role=\"listitem\"], .JkTB0jW1, [data-e2e*=\"notice\"], [data-e2e*=\"notification\"]')).filter((node) => {\n          const text = compact(node.innerText || node.textContent || '');\n          return text && target && text.toLowerCase().includes(target);\n        });\n        for (const row of rows) {\n          const userLinks = Array.from(row.querySelectorAll('a[href*=\"/user/\"], a[href*=\"douyin.com/user/\"]'));\n          if (userLinks.length > 0) {\n            const avatar = userLinks[0];\n            const r = avatar.getBoundingClientRect();\n            if (r.width > 0 && r.height > 0) {\n              return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };\n            }\n          }\n        }\n      }\n      return null;\n    })()").catch(() => null);
    if (!result) {
      return false;
    }
    return fn46(arg1, result.x, result.y);
  }
  async function fn73(arg1, arg2) {
    const result = await fn66(arg1);
    if (!result) {
      return false;
    }
    const result2 = await fn72(arg1, arg2.nickname);
    if (!result2) {
      return false;
    }
    const result3 = await fn74(arg1, /\/user\//, 8000);
    if (result3) {
      return fn71(arg1);
    }
    return false;
  }
  function fn75(arg1, options = {}) {
    const local = arg1?.nickname || "未知用户";
    if (options.blocked) {
      console.log("[SelfWarmup-DM] @" + local + " 私信受限已跳过：" + (options.reason || options.blockType || "平台限制"));
    } else {
      const value = options.ok ? "成功" : "失败";
      console.log("[SelfWarmup-DM] @" + local + " 私信" + value + "：" + (options.reason || "已确认送达"));
    }
    if (options.debug?.steps?.length) {
      options.debug.steps.forEach(arg1 => {
        const {
          step: step,
          at: at,
          ...local
        } = arg1;
        console.log("[SelfWarmup-DM]   · " + step + (Object.keys(local).length ? " | " + JSON.stringify(local) : ""));
      });
    }
  }
  function fn76(arg1, options = {}) {
    const {
      resultChannel: resultChannel,
      controlChannel: controlChannel,
      timeoutReason: timeoutReason,
      payload: payload,
      timeoutMs = 90000
    } = options;
    const value = Date.now() + "_" + Math.random().toString(36).slice(2);
    if (!arg1 || arg1.isDestroyed() || arg1.webContents.isDestroyed()) {
      return Promise.resolve({
        ok: false,
        reason: "自热互动窗口已销毁"
      });
    }
    const value2 = arg1.webContents;
    const value3 = value2.id;
    const result = Date.now();
    return new Promise(arg1 => {
      let flag = false;
      const local = arg12 => {
        if (flag) {
          return;
        }
        flag = true;
        clearTimeout(result2);
        ipcMain.removeListener(resultChannel, local2);
        value2.removeListener("destroyed", local3);
        arg1(arg12);
      };
      const local3 = () => local({
        ok: false,
        reason: "自热互动窗口执行中被关闭"
      });
      const local2 = (arg1, options = {}) => {
        if (arg1.sender.id !== value3 || options.requestId !== value) {
          return;
        }
        const value2 = Date.now() - result;
        if (value2 > timeoutMs) {
          local({
            ok: false,
            reason: timeoutReason,
            elapsedMs: value2
          });
          return;
        }
        local({
          ok: !!options.ok,
          reason: options.reason || "",
          blocked: !!options.blocked,
          blockType: options.blockType || "",
          debug: options.debug || null,
          sentText: compactText(options.sentText || ""),
          alreadyLiked: !!options.alreadyLiked,
          alreadyFollowed: !!options.alreadyFollowed,
          followStatus: options.followStatus || "",
          followed: !!options.followed,
          followRequested: !!options.followRequested,
          skipped: !!options.skipped,
          consumeRound: !!options.consumeRound,
          softVerified: !!options.softVerified,
          errorCode: options.errorCode || "",
          diagnostic: options.diagnostic || null,
          detail: options.detail || "",
          elapsedMs: value2
        });
      };
      const result2 = setTimeout(() => local({
        ok: false,
        reason: timeoutReason,
        elapsedMs: Date.now() - result
      }), timeoutMs);
      ipcMain.on(resultChannel, local2);
      value2.once("destroyed", local3);
      (async () => {
        try {
          await fn(value2);
          if (!value2 || value2.isDestroyed()) {
            local({
              ok: false,
              reason: "自热互动窗口已销毁"
            });
            return;
          }
          value2.send(controlChannel, {
            requestId: value,
            ...payload
          });
        } catch (error) {
          local({
            ok: false,
            reason: error.message || "无法下发自热互动动作"
          });
        }
      })();
    });
  }
  async function fn77(arg1, arg2, options = {}) {
    return fn76(arg1, {
      resultChannel: "self-warmup-profile-dm-result",
      controlChannel: "self-warmup-profile-dm",
      timeoutReason: "私信操作超时",
      payload: {
        dmText: arg2,
        nickname: options.nickname || "",
        userUrl: options.userUrl || arg1.webContents.getURL()
      }
    });
  }
  async function fn78(arg1, arg2, arg3) {
    return fn15(arg1, async () => {
      let flag = false;
      try {
        flag = await fn73(arg1, arg2);
      } catch (error) {}
      if (!flag) {
        const local = arg2.userUrl || (await fn70(arg1, arg2));
        if (!local) {
          return {
            ok: false,
            reason: "缺少用户主页链接"
          };
        }
        await fn24(arg1, local);
        flag = await fn71(arg1);
      }
      if (!flag) {
        return {
          ok: false,
          reason: "用户主页未加载完成"
        };
      }
      const local = arg2.userUrl || arg1.webContents.getURL();
      console.log("[SelfWarmup-DM] 准备私信 @" + (arg2.nickname || "未知用户") + " | 主页=" + local);
      await delay(2500);
      const result = (Array.isArray(arg3) ? arg3 : [arg3]).map(compactText).filter(Boolean);
      if (!result.length) {
        return {
          ok: false,
          reason: "无私信文案"
        };
      }
      let local2 = null;
      for (let num = 0; num < result.length; num += 1) {
        if (num > 0) {
          await delay(1500);
        }
        local2 = await fn77(arg1, result[num], {
          nickname: arg2.nickname,
          userUrl: local
        });
        if (!local2?.ok && !local2?.skipped) {
          return local2;
        }
      }
      fn75(arg2, local2);
      return local2;
    });
  }
  async function fn79(arg1, options = {}) {
    await delay(1200);
    return fn76(arg1, {
      resultChannel: "self-warmup-profile-follow-result",
      controlChannel: "self-warmup-profile-follow",
      timeoutReason: "关注操作超时",
      payload: {
        nickname: options.nickname || "",
        userUrl: options.userUrl || arg1.webContents.getURL()
      }
    });
  }
  async function fn80(arg1, options = {}) {
    let local = options.userUrl || "";
    if (!local) {
      try {
        local = await fn70(arg1, options);
      } catch (error) {
        local = "";
      }
    }
    let flag = false;
    if (local) {
      await fn24(arg1, local);
      flag = await fn71(arg1);
    }
    if (!flag) {
      try {
        flag = await fn73(arg1, options);
      } catch (error) {}
    }
    if (!flag) {
      return {
        ok: false,
        reason: local ? "用户主页未加载完成" : "缺少用户主页链接"
      };
    }
    const local2 = options.userUrl || arg1.webContents.getURL();
    if (!/\/user\//.test(local2)) {
      return {
        ok: false,
        reason: "未进入用户主页",
        userUrl: local2
      };
    }
    const result = await fn79(arg1, {
      nickname: options.nickname,
      userUrl: local2
    });
    const local3 = !!result.followed || !!result.alreadyFollowed;
    const local4 = !!result.followRequested || result.followStatus === "requested";
    if (local3 || local4) {
      return {
        ok: true,
        alreadyFollowed: !!result.alreadyFollowed,
        followStatus: result.followStatus || (local3 ? "success" : "requested"),
        followed: local3,
        followRequested: local4 && !local3,
        reason: "",
        userUrl: local2
      };
    }
    return {
      ok: false,
      reason: result.reason || "主页关注失败",
      followStatus: result.followStatus || "",
      errorCode: result.errorCode || "",
      userUrl: local2
    };
  }
  async function fn74(arg1, arg2, num = 8000) {
    const result = Date.now();
    while (Date.now() - result < num) {
      if (arg1.isDestroyed()) {
        return false;
      }
      const result = arg1.webContents.getURL();
      if (arg2.test(result)) {
        return true;
      }
      await delay(200);
    }
    return false;
  }
  async function fn81(arg1, num = 35000) {
    const result = Date.now();
    while (Date.now() - result < num) {
      if (arg1.isDestroyed()) {
        return false;
      }
      if (isSelfWarmupVideoPageUrl(arg1.webContents.getURL())) {
        return true;
      }
      const result = await arg1.webContents.executeJavaScript("(() => {\n        const visible = (el) => {\n          if (!el) return false;\n          const rect = el.getBoundingClientRect();\n          const style = getComputedStyle(el);\n          return rect.width > 0 && rect.height > 0\n            && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';\n        };\n        const commentSurface = Array.from(document.querySelectorAll(\n          '[data-e2e=\"comment-panel\"], [data-e2e=\"comment-list\"], .comment-mainContent, '\n          + '[data-e2e=\"comment-input\"], [class*=\"comment-mainContent\"]'\n        )).find(visible);\n        if (!commentSurface) return false;\n        const hasVideo = Array.from(document.querySelectorAll('video')).some(visible);\n        const hasCommentContent = !!document.querySelector(\n          '[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], .public-DraftEditor-content'\n        );\n        return hasVideo || hasCommentContent;\n      })()").catch(() => false);
      if (result) {
        return true;
      }
      await delay(200);
    }
    return false;
  }
  async function fn82(arg1, {
    timeoutMs = 12000,
    noEffectMs = 4000
  } = {}) {
    if (!arg1 || arg1.isDestroyed()) {
      return {
        ok: false,
        reason: "窗口已销毁",
        early: true
      };
    }
    const result = String(arg1.webContents.getURL() || "");
    const result2 = Date.now();
    while (Date.now() - result2 < timeoutMs) {
      if (arg1.isDestroyed()) {
        return {
          ok: false,
          reason: "窗口已销毁",
          early: true
        };
      }
      const result3 = String(arg1.webContents.getURL() || "");
      if (isSelfWarmupVideoPageUrl(result3)) {
        return {
          ok: true,
          reason: "url"
        };
      }
      if (/\/user\//.test(result3) && !isSelfWarmupVideoPageUrl(result3)) {
        return {
          ok: false,
          reason: "点击后跳到了用户主页而非视频",
          early: true
        };
      }
      const result4 = await arg1.webContents.executeJavaScript("(() => {\n        const visible = (el) => {\n          if (!el) return false;\n          const rect = el.getBoundingClientRect();\n          const style = getComputedStyle(el);\n          return rect.width > 0 && rect.height > 0\n            && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';\n        };\n        const commentSurface = Array.from(document.querySelectorAll(\n          '[data-e2e=\"comment-panel\"], [data-e2e=\"comment-list\"], .comment-mainContent, '\n          + '[data-e2e=\"comment-input\"], [class*=\"comment-mainContent\"]'\n        )).find(visible);\n        const hasVideo = Array.from(document.querySelectorAll('video')).some(visible);\n        const hasCommentContent = !!document.querySelector(\n          '[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], .public-DraftEditor-content'\n        );\n        const videoReady = !!(commentSurface && (hasVideo || hasCommentContent));\n        const EVENT_RE = /(评论了你的|回复了你|关注了你|赞了你的|点赞|提到了你)/;\n        const panelSelectors = [\n          '[data-e2e=\"listDlgTest-container\"]',\n          '[data-e2e*=\"notice\"]',\n          '[data-e2e*=\"notification\"]',\n          '.semi-popover-content',\n          '[class*=\"Notice\"]',\n          '[role=\"dialog\"]',\n        ].join(',');\n        const noticeStillOpen = Array.from(document.querySelectorAll(panelSelectors)).some((el) => {\n          if (!visible(el)) return false;\n          if (el.closest('#imSaasContainerId, [data-e2e=\"im-dialog\"]')) return false;\n          const r = el.getBoundingClientRect();\n          const text = String(el.innerText || '').slice(0, 400);\n          return r.width >= 180 && r.height >= 60\n            && (EVENT_RE.test(text) || /通知|互动|评论|全部消息/.test(text));\n        });\n        return {\n          videoReady,\n          noticeStillOpen,\n          path: location.pathname || '',\n        };\n      })()").catch(() => ({
        videoReady: false,
        noticeStillOpen: false,
        path: ""
      }));
      if (result4.videoReady) {
        return {
          ok: true,
          reason: "dom"
        };
      }
      const value = Date.now() - result2;
      const value2 = result3 !== result;
      if (value >= noEffectMs) {
        if (!value2 && result4.noticeStillOpen) {
          return {
            ok: false,
            reason: "点击未触发跳转（通知面板仍在）",
            early: true
          };
        }
        if (value2 && !result4.videoReady && !result4.noticeStillOpen && !isSelfWarmupVideoPageUrl(result3)) {
          return {
            ok: false,
            reason: "点击后页面异常：" + compactText(result3).slice(0, 90),
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
  async function fn83(arg1, arg2, arg3) {
    if (arg2._selfWarmupCommentPageReady) {
      const result = await fn81(arg1, 1200);
      if (result) {
        return true;
      }
      arg2._selfWarmupCommentPageReady = false;
    }
    const local = () => {
      arg2._selfWarmupNavFailed = true;
      return false;
    };
    const local2 = arg2.commentId || arg2.cid || arg2.comment_id || "";
    let value = arg2.videoUrl ? resolveSelfWarmupVideoUrl(arg2.videoUrl, local2 || arg2.commentId) : "";
    if (arg3) {
      fn7(arg3, "正在定位 @" + (arg2.nickname || "用户") + " 的评论通知卡片 (相关文本: \"" + compactText(arg2.text).slice(0, 15) + "\")...", "info");
    }
    const result = await fn66(arg1, arg3);
    if (result) {
      const result = compactText(arg2.text || "");
      const local3 = async () => arg1.webContents.executeJavaScript("(async () => {\n        const EVENT_RE = /(评论了你的(?:作品|视频|评论|动态)?|回复了你|回复了你的评论|关注了你|开始关注你|赞了你的(?:作品|视频|评论|动态)?|点赞|喜欢了你的|提到了你|@了你)/;\n        const compact = (value) => String(value || '')\n          .replace(/[\\u200b-\\u200f\\u202a-\\u202e\\u2060-\\u206f]/g, '')\n          .replace(/\\s+/g, ' ')\n          .trim();\n        const targetNick = compact(" + JSON.stringify(arg2.nickname || "") + ").replace(/^@+/, '').toLowerCase();\n        const rawText = compact(" + JSON.stringify(result) + ").toLowerCase();\n        const rawRowText = compact(" + JSON.stringify(arg2.notificationRowText || "") + ").toLowerCase();\n        const visible = (el) => {\n          if (!el) return false;\n          const r = el.getBoundingClientRect();\n          const s = getComputedStyle(el);\n          return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';\n        };\n\n        const extractVideoUrlFromNode = (el) => {\n          if (!el) return '';\n          const videoLink = el.querySelector?.('a[href*=\"modal_id\"], a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"detail\"], [data-href*=\"modal_id\"], [data-href*=\"/video/\"]');\n          const rawUrl = videoLink?.href || videoLink?.getAttribute?.('data-href') || (el.tagName === 'A' ? el.href : '');\n          if (rawUrl) return rawUrl;\n\n          const nodesToInspect = [el];\n          try {\n            if (el.querySelectorAll) {\n              const children = Array.from(el.querySelectorAll('*'));\n              if (children.length < 60) nodesToInspect.push(...children);\n            }\n          } catch (_) {}\n\n          for (const node of nodesToInspect) {\n            try {\n              const keys = Object.keys(node);\n              const reactKey = keys.find((k) => k.startsWith('__reactProps') || k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance'));\n              if (!reactKey) continue;\n              const root = node[reactKey];\n\n              const visited = new Set();\n              const searchObj = (obj, depth = 0) => {\n                if (!obj || depth > 8) return '';\n                if (typeof obj === 'string') {\n                  const modalMatch = obj.match(/modal_id=(\\d+)/);\n                  if (modalMatch && modalMatch[1]) return 'https://www.douyin.com/jingxuan?modal_id=' + modalMatch[1];\n                  const videoMatch = obj.match(/\\/video\\/(\\d+)/);\n                  if (videoMatch && videoMatch[1]) return 'https://www.douyin.com/video/' + videoMatch[1];\n                  const groupMatch = obj.match(/group_id=(\\d+)/);\n                  if (groupMatch && groupMatch[1]) return 'https://www.douyin.com/jingxuan?modal_id=' + groupMatch[1];\n                  return '';\n                }\n                if (typeof obj !== 'object') return '';\n                if (visited.has(obj)) return '';\n                visited.add(obj);\n\n                const modalId = obj.modal_id || obj.modalId || obj.group_id || obj.groupId || obj.aweme_id || obj.awemeId || obj.item_id || obj.itemId || obj.gid || obj.videoId;\n                if (modalId && /^\\d{15,}$/.test(String(modalId))) {\n                  return 'https://www.douyin.com/jingxuan?modal_id=' + modalId;\n                }\n\n                if (typeof obj.schema === 'string') {\n                  const res = searchObj(obj.schema, depth + 1);\n                  if (res) return res;\n                }\n                if (typeof obj.url === 'string') {\n                  const res = searchObj(obj.url, depth + 1);\n                  if (res) return res;\n                }\n                if (typeof obj.link_url === 'string') {\n                  const res = searchObj(obj.link_url, depth + 1);\n                  if (res) return res;\n                }\n\n                const keysToSearch = ['memoizedProps', 'pendingProps', 'item', 'data', 'notice', 'content', 'payload', 'target', 'aweme', 'aweme_info', 'awemeInfo', 'params', 'extra', 'group'];\n                for (const k of keysToSearch) {\n                  if (obj[k]) {\n                    const res = searchObj(obj[k], depth + 1);\n                    if (res) return res;\n                  }\n                }\n                return '';\n              };\n\n              const found = searchObj(root);\n              if (found) return found;\n            } catch (_) {\n              // 继续检查卡片内的其他 React 节点\n            }\n          }\n          return '';\n        };\n\n        const extractCommentIdFromNode = (el) => {\n          if (!el) return '';\n          const nodesToInspect = [el];\n          try {\n            if (el.querySelectorAll) {\n              const children = Array.from(el.querySelectorAll('*'));\n              if (children.length < 60) nodesToInspect.push(...children);\n            }\n          } catch (_) {}\n          for (const node of nodesToInspect) {\n            try {\n              const keys = Object.keys(node);\n              const reactKey = keys.find((k) => k.startsWith('__reactProps') || k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance'));\n              if (!reactKey) continue;\n              const root = node[reactKey];\n              const visited = new Set();\n              const searchCid = (obj, depth = 0) => {\n                if (!obj || depth > 8 || typeof obj !== 'object') return '';\n                if (visited.has(obj)) return '';\n                visited.add(obj);\n                const cid = obj.cid || obj.comment_id || obj.commentId || obj.comment?.cid;\n                if (cid && /^\\d{10,}$/.test(String(cid))) return String(cid);\n                const keysToSearch = ['memoizedProps', 'pendingProps', 'item', 'data', 'notice', 'content', 'comment', 'payload', 'extra'];\n                for (const k of keysToSearch) {\n                  if (obj[k]) {\n                    const res = searchCid(obj[k], depth + 1);\n                    if (res) return res;\n                  }\n                }\n                return '';\n              };\n              const found = searchCid(root);\n              if (found) return found;\n            } catch (_) {}\n          }\n          return '';\n        };\n\n        const panelSelectors = [\n          '[data-e2e=\"listDlgTest-container\"]',\n          '[data-e2e*=\"notice\"]',\n          '[data-e2e*=\"notification\"]',\n          '.semi-popover-content',\n          '[class*=\"Popover\"]',\n          '[class*=\"popover\"]',\n          '[class*=\"Notice\"]',\n          '[class*=\"notice\"]',\n          '[role=\"dialog\"]'\n        ].join(',');\n        const rowSelector = [\n          '.JkTB0jW1',\n          '[role=\"listitem\"]',\n          'li',\n          '[data-e2e*=\"notice\"]',\n          '[data-e2e*=\"notification\"]'\n        ].join(',');\n        const deriveNotificationRows = (panelEl) => {\n          const rows = new Set();\n          panelEl.querySelectorAll(\n            '[data-e2e=\"user-name-card\"], a[href*=\"/user/\"], pre'\n          ).forEach((anchor) => {\n            let node = anchor;\n            while (node && node !== panelEl) {\n              if (visible(node)) {\n                const r = node.getBoundingClientRect();\n                const text = compact(node.innerText || node.textContent || '');\n                if (\n                  r.width >= 160\n                  && r.height >= 28\n                  && r.height < 360\n                  && EVENT_RE.test(text)\n                ) {\n                  rows.add(node);\n                  break;\n                }\n              }\n              node = node.parentElement;\n            }\n          });\n          return Array.from(rows);\n        };\n        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));\n        const listPanelCandidates = () => Array.from(document.querySelectorAll(panelSelectors))\n          .filter(visible)\n          .filter((el) => !(\n            el.matches('#imSaasContainerId, [data-e2e=\"im-dialog\"]')\n            || el.closest('#imSaasContainerId, [data-e2e=\"im-dialog\"]')\n            || el.querySelector('#imSaasContainerId, [data-e2e=\"im-dialog\"]')\n          ))\n          .map((el) => {\n            const r = el.getBoundingClientRect();\n            const text = compact(el.innerText || el.textContent || '');\n            const explicitRows = Array.from(el.querySelectorAll(rowSelector)).filter((row) => {\n              if (row === el || !visible(row)) return false;\n              const rr = row.getBoundingClientRect();\n              const rowText = compact(row.innerText || row.textContent || '');\n              return rr.width >= 160 && rr.height >= 28 && rr.height < 360 && EVENT_RE.test(rowText);\n            });\n            const rows = [...new Set([...explicitRows, ...deriveNotificationRows(el)])];\n            return {\n              el,\n              r,\n              text,\n              rowCount: rows.length,\n              exact: el.matches('[data-e2e=\"listDlgTest-container\"], .semi-popover-content') ? 1 : 0,\n            };\n          });\n        // 抖音会先挂载通知弹层空壳，再异步渲染通知行。仅等待弹层出现会把\n        // “互动消息 / 全部消息”的空壳误判为最终状态，实测通知行可能晚 2~3 秒。\n        let panelCandidates = [];\n        for (let renderAttempt = 0; renderAttempt < 16; renderAttempt += 1) {\n          panelCandidates = listPanelCandidates();\n          if (panelCandidates.some(({ rowCount }) => rowCount > 0)) break;\n          await sleep(250);\n        }\n        const panels = panelCandidates.filter(({ r, text, rowCount }) =>\n            r.width >= 180\n            && r.height >= 60\n            && rowCount > 0\n            && (EVENT_RE.test(text) || /通知|互动|评论|回复|赞了你|点赞|关注|全部消息/.test(text))\n          )\n          .sort((a, b) =>\n            (b.exact - a.exact)\n            || (b.rowCount - a.rowCount)\n            || (b.r.height - a.r.height)\n            || (b.r.left - a.r.left)\n          );\n        const panelInfo = panels[0] || null;\n        const panel = panelInfo?.el || null;\n        if (!panel) {\n          return {\n            found: false,\n            reason: '未识别到包含互动通知行的弹层',\n            panelCandidateCount: Array.from(document.querySelectorAll(panelSelectors)).filter(visible).length,\n            panelDiagnostics: panelCandidates.slice(0, 6).map(({ el, r, text, rowCount, exact }) => ({\n              tag: el.tagName || 'DIV',\n              className: (el.className || '').toString().slice(0, 80),\n              dataE2e: el.getAttribute?.('data-e2e') || '',\n              width: Math.round(r.width),\n              height: Math.round(r.height),\n              rowCount,\n              exact,\n              eventMatched: EVENT_RE.test(text),\n              text: text.slice(0, 100),\n            })),\n          };\n        }\n\n        const scrollables = [panel, ...Array.from(panel.querySelectorAll('*'))]\n          .filter((el) => {\n            if (!visible(el)) return false;\n            const r = el.getBoundingClientRect();\n            return r.width >= 160\n              && r.height >= 80\n              && el.scrollHeight > el.clientHeight + 16;\n          })\n          .sort((a, b) => {\n            const ar = a.getBoundingClientRect();\n            const br = b.getBoundingClientRect();\n            return (br.width * br.height) - (ar.width * ar.height);\n          });\n        const scrollable = scrollables[0] || null;\n\n        if (scrollable) {\n          scrollable.scrollTop = 0;\n          try { scrollable.dispatchEvent(new Event('scroll', { bubbles: true })); } catch (_) {}\n          await sleep(220);\n        }\n\n        let targetRow = null;\n        let attemptCount = 0;\n        let bestScore = 0;\n        let lastCandidateDebug = [];\n\n        const collectRowCandidates = () => {\n          const rowSet = new Set();\n          const addRow = (row) => {\n            if (!row || row === panel || !panel.contains(row) || !visible(row)) return;\n            const r = row.getBoundingClientRect();\n            if (r.width < 160 || r.height < 28 || r.height >= 360) return;\n            const text = compact(row.innerText || row.textContent || '').toLowerCase();\n            if (!text || !EVENT_RE.test(text)) return;\n            rowSet.add(row);\n          };\n\n          panel.querySelectorAll(rowSelector).forEach(addRow);\n          panel.querySelectorAll(\n            '[data-e2e=\"user-name-card\"], a[href*=\"/user/\"], pre, span, div'\n          ).forEach((node) => {\n            const text = compact(node.innerText || node.textContent || '').replace(/^@+/, '').toLowerCase();\n            const snippet = rawText.slice(0, Math.min(24, rawText.length));\n            if (!text) return;\n            if (!(targetNick && text.includes(targetNick)) && !(snippet && text.includes(snippet))) return;\n            let current = node;\n            while (current && current !== panel) {\n              const currentText = compact(current.innerText || current.textContent || '').toLowerCase();\n              const r = current.getBoundingClientRect();\n              if (\n                r.width >= 160\n                && r.height >= 28\n                && r.height < 360\n                && EVENT_RE.test(currentText)\n                && (!targetNick || currentText.includes(targetNick))\n              ) {\n                addRow(current);\n                break;\n              }\n              current = current.parentElement;\n            }\n          });\n\n          return Array.from(rowSet).map((row) => {\n            const r = row.getBoundingClientRect();\n            const rowText = compact(row.innerText || row.textContent || '').toLowerCase();\n            const userTexts = Array.from(row.querySelectorAll(\n              '[data-e2e=\"user-name-card\"], a[href*=\"/user/\"], [class*=\"name\"], [class*=\"Name\"]'\n            )).map((el) => compact(el.innerText || el.textContent || '').replace(/^@+/, '').toLowerCase());\n            const preTexts = Array.from(row.querySelectorAll('pre'))\n              .map((el) => compact(el.innerText || el.textContent || '').toLowerCase())\n              .filter(Boolean);\n            const snippet = rawText.slice(0, Math.min(24, rawText.length));\n            const rowSnippet = rawRowText.slice(0, Math.min(42, rawRowText.length));\n            let score = 0;\n            if (targetNick && userTexts.some((text) => text === targetNick)) score += 120;\n            else if (targetNick && rowText.includes(targetNick)) score += 70;\n            if (rawText && preTexts.some((text) => text === rawText)) score += 160;\n            else if (snippet && preTexts.some((text) => text.includes(snippet) || snippet.includes(text))) score += 110;\n            else if (snippet && rowText.includes(snippet)) score += 80;\n            if (rawRowText && rowText === rawRowText) score += 220;\n            else if (rowSnippet && rowText.includes(rowSnippet)) score += 130;\n            if (/评论了你的|回复了你|回复了你的评论/.test(rowText)) score += 25;\n            return { row, score, area: r.width * r.height };\n          }).filter(({ score }) => score > 0);\n        };\n\n        for (let attempt = 0; attempt < 10; attempt++) {\n          attemptCount = attempt + 1;\n          const rowCandidates = collectRowCandidates();\n          lastCandidateDebug = rowCandidates.slice(0, 8).map(({ row, score }) => ({\n            score,\n            text: compact(row.innerText || row.textContent || '').slice(0, 120),\n            className: (row.className || '').toString().slice(0, 60),\n          }));\n          rowCandidates.sort((a, b) => b.score - a.score || a.area - b.area);\n          targetRow = rowCandidates[0]?.row || null;\n          bestScore = rowCandidates[0]?.score || 0;\n\n          if (targetRow) break;\n\n          if (!scrollable) break;\n          const previousTop = scrollable.scrollTop;\n          const nextTop = Math.min(\n            scrollable.scrollHeight - scrollable.clientHeight,\n            previousTop + Math.max(220, Math.round(scrollable.clientHeight * 0.72)),\n          );\n          if (nextTop <= previousTop) break;\n          scrollable.scrollTop = nextTop;\n          try { scrollable.dispatchEvent(new Event('scroll', { bubbles: true })); } catch (_) {}\n          await sleep(300);\n          if (scrollable.scrollTop <= previousTop) {\n            break;\n          }\n        }\n\n        if (!targetRow) {\n          return {\n            found: false,\n            reason: '弹层已打开，但遍历可见通知行后未匹配目标',\n            attempts: attemptCount,\n            panelTag: panel.tagName || 'DIV',\n            panelClass: (panel.className || '').toString().slice(0, 80),\n            panelRows: panelInfo?.rowCount || 0,\n            panelText: compact(panel.innerText || panel.textContent || '').slice(0, 120),\n            scrollTop: scrollable?.scrollTop || 0,\n            scrollHeight: scrollable?.scrollHeight || 0,\n            clientHeight: scrollable?.clientHeight || 0,\n            targetNick,\n            rawText: rawText.slice(0, 80),\n            rawRowText: rawRowText.slice(0, 120),\n            candidates: lastCandidateDebug,\n          };\n        }\n\n        // 强行将目标通知卡片居中滚动到视口中央\n        try {\n          if (typeof targetRow.scrollIntoView === 'function') {\n            targetRow.scrollIntoView({ block: 'center', behavior: 'instant' });\n            await sleep(150);\n          }\n        } catch (_) {}\n\n        // 三层精准寻找评论正文 preview 节点\n        const visiblePreviews = Array.from(targetRow.querySelectorAll('pre')).filter(visible);\n        let commentEl = visiblePreviews\n          .map((el) => {\n            const text = compact(el.innerText || el.textContent || '').toLowerCase();\n            const snippet = rawText.slice(0, Math.min(24, rawText.length));\n            let score = 0;\n            if (rawText && text === rawText) score += 100;\n            else if (snippet && (text.includes(snippet) || snippet.includes(text))) score += 60;\n            return { el, score, length: text.length };\n          })\n          .sort((a, b) => b.score - a.score || a.length - b.length)[0]?.el || null;\n\n        if (!commentEl && rawText && rawText.length >= 2) {\n          const snippet = compact(rawText).slice(0, 10).toLowerCase();\n          const matches = Array.from(targetRow.querySelectorAll('*')).filter((el) => {\n            if (!visible(el) || el.children.length > 2) return false;\n            if (el.closest('a[href*=\"/user/\"], [data-e2e=\"user-name-card\"], [class*=\"avatar\"], [class*=\"Avatar\"], [class*=\"name\"], [class*=\"Name\"]')) return false;\n            const txt = compact(el.innerText || el.textContent || '').toLowerCase();\n            return txt && txt.includes(snippet);\n          });\n          if (matches.length > 0) {\n            matches.sort((a, b) => a.innerText.length - b.innerText.length);\n            commentEl = matches[0];\n          }\n        }\n\n        if (!commentEl) {\n          const contentClassEls = Array.from(targetRow.querySelectorAll('pre, [class*=\"content\"], [class*=\"Content\"], [class*=\"desc\"], [class*=\"Desc\"], [class*=\"comment\"], [class*=\"Comment\"], [class*=\"text\"], [class*=\"Text\"]'))\n            .filter((el) => {\n              if (!visible(el)) return false;\n              if (el.closest('a[href*=\"/user/\"], [data-e2e=\"user-name-card\"], [class*=\"avatar\"], [class*=\"Avatar\"], [class*=\"name\"], [class*=\"Name\"], [class*=\"time\"], [class*=\"Time\"]')) return false;\n              const txt = compact(el.innerText || el.textContent || '');\n              if (!txt || txt === targetNick) return false;\n              if (/^(?:评论了你的(?:作品|视频|评论|动态)?|回复了你|回复了你的评论|关注了你|赞了你的评论|赞了你的作品|点赞了你的评论|刚刚|d+.*前|昨天|前天)$/.test(txt)) return false;\n              return true;\n            });\n          if (contentClassEls.length > 0) {\n            commentEl = contentClassEls[0];\n          }\n        }\n\n        commentEl = commentEl || targetRow;\n\n        const r = commentEl.getBoundingClientRect();\n        const rowR = targetRow.getBoundingClientRect();\n        const extractedUrl = extractVideoUrlFromNode(targetRow);\n        const extractedCid = extractCommentIdFromNode(targetRow);\n\n        return {\n          found: true,\n          attempts: attemptCount,\n          score: bestScore,\n          matchedTag: commentEl.tagName || 'DIV',\n          matchedClass: (commentEl.className || '').toString().slice(0, 40),\n          matchedText: compact(commentEl.innerText || commentEl.textContent || '').slice(0, 30),\n          rowText: compact(targetRow.innerText || targetRow.textContent || '').slice(0, 40),\n          x: r.width > 0 ? Math.round(r.left + r.width / 2) : Math.round(rowR.left + rowR.width * 0.5),\n          y: r.height > 0 ? Math.round(r.top + r.height / 2) : Math.round(rowR.top + rowR.height / 2),\n          rowX: Math.round(rowR.left + rowR.width * 0.6),\n          rowY: Math.round(rowR.top + rowR.height / 2),\n          videoUrl: extractedUrl || '',\n          commentId: extractedCid || '',\n        };\n      })()").catch(arg1 => {
        if (arg3) {
          fn7(arg3, "评论通知定位脚本异常：" + (arg1?.message || arg1), "warning");
        }
        return null;
      });
      const local4 = (arg1, {
        silent = false
      } = {}) => {
        if (arg1?.commentId && !arg2.commentId && !arg2.cid) {
          arg2.commentId = String(arg1.commentId);
          arg2.cid = String(arg1.commentId);
        }
        if (!arg1?.videoUrl) {
          return;
        }
        const result = resolveSelfWarmupVideoUrl(arg1.videoUrl, arg2.commentId || arg2.cid || local2);
        arg2.videoUrl = result;
        value = result;
        if (arg3 && !silent) {
          fn7(arg3, "已从通知卡片提取到视频 URL: " + result, "info");
        }
      };
      const local5 = () => {
        const result = arg1.webContents.getURL();
        if (isSelfWarmupVideoPageUrl(result)) {
          arg2.videoUrl = resolveSelfWarmupVideoUrl(result, local2);
        }
        arg2._selfWarmupCommentPageReady = true;
      };
      const local6 = async (arg12, {
        useRow = false,
        label = "评论正文"
      } = {}) => {
        const value = useRow ? arg12.rowX : arg12.x;
        const value2 = useRow ? arg12.rowY : arg12.y;
        if (arg3) {
          fn7(arg3, "点击通知卡片" + label + "坐标 (" + value + ", " + value2 + ")，等待进入视频页…", "info");
        }
        await fn46(arg1, value, value2);
        await arg1.webContents.executeJavaScript("(() => {\n          const x = " + JSON.stringify(value) + ";\n          const y = " + JSON.stringify(value2) + ";\n          const el = document.elementFromPoint(x, y);\n          if (!el) return false;\n          const init = { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y };\n          ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach((type) => {\n            try { el.dispatchEvent(new MouseEvent(type, init)); } catch (_) {}\n          });\n          try { el.click(); } catch (_) {}\n          return true;\n        })()").catch(() => false);
        const result = await fn82(arg1, {
          timeoutMs: 12000,
          noEffectMs: 4000
        });
        if (result.ok) {
          local5();
          if (arg3) {
            fn7(arg3, "已通过点击" + label + "成功进入视频页: " + arg1.webContents.getURL(), "info");
          }
          return true;
        }
        if (arg3) {
          fn7(arg3, "@" + arg2.nickname + " 点击" + label + "未进视频：" + (result.reason || "未知") + (result.early ? "（已提前结束等待）" : ""), "warning");
        }
        return false;
      };
      let result2 = await local3();
      if (result2?.found) {
        local4(result2, {
          silent: true
        });
        if (arg3) {
          fn7(arg3, "找到 @" + arg2.nickname + " 通知卡片 (下翻第 " + (result2.attempts || 1) + " 次) <" + result2.matchedTag + "." + result2.matchedClass + "> \"" + (result2.matchedText || result2.rowText) + "\"，准备点击评论内容坐标 (" + result2.x + ", " + result2.y + ")", "info");
        }
        if (await local6(result2, {
          useRow: false,
          label: "评论正文"
        })) {
          return true;
        }
        if (arg3) {
          fn7(arg3, "@" + arg2.nickname + " 正文点击未进视频，重新定位通知卡片后再点右侧区域…", "info");
        }
        await fn66(arg1, arg3);
        result2 = await local3();
        if (result2?.found) {
          local4(result2);
          if (arg3) {
            fn7(arg3, "重新找到 @" + arg2.nickname + " 通知卡片 (下翻第 " + (result2.attempts || 1) + " 次)，准备点击右侧 (" + result2.rowX + ", " + result2.rowY + ")", "info");
          }
          if (await local6(result2, {
            useRow: true,
            label: "卡片右侧"
          })) {
            return true;
          }
          if (result2.videoUrl) {
            const result = resolveSelfWarmupVideoUrl(result2.videoUrl, local2);
            arg2.videoUrl = result;
            if (arg3) {
              fn7(arg3, "卡片点击未唤起弹窗，自动切换 safeLoadURL 直达视频页: " + result, "info");
            }
            await fn24(arg1, result);
            const result3 = await fn81(arg1, 20000);
            arg2._selfWarmupCommentPageReady = result3;
            return result3 || local();
          }
        } else if (arg3) {
          fn7(arg3, "@" + arg2.nickname + " 重新定位通知卡片失败，准备走 URL 兜底", "warning");
        }
      } else if (arg3) {
        const value = result2 ? "（" + (result2.reason || "未知原因") + "；候选弹层 " + (result2.panelCandidateCount ?? 1) + "；通知行 " + (result2.panelRows ?? 0) + "；滚动 " + (result2.scrollTop ?? 0) + "/" + (result2.scrollHeight ?? 0) + "）" : "";
        fn7(arg3, "通知弹层中未查找到 @" + arg2.nickname + " 的卡片节点" + value, "warning");
      }
    }
    if (value) {
      const local2 = value;
      arg2.videoUrl = local2;
      if (arg3) {
        fn7(arg3, "通知卡片点击未能打开视频，使用已记录的视频 URL 兜底直达: " + local2, "info");
      }
      await fn24(arg1, local2);
      const result = await fn81(arg1, 40000);
      arg2._selfWarmupCommentPageReady = result;
      return result || local();
    }
    return local();
  }
  async function fn84(arg1, arg2, arg3) {
    if (!arg1 || arg1.isDestroyed()) {
      return false;
    }
    if (arg3?._selfWarmupCommentSettled) {
      return true;
    }
    const result = compactText(arg3?.nickname || "");
    const result2 = String(arg3?.commentId || arg3?.cid || arg3?.comment_id || "").trim();
    const flag = !!arg3?._selfWarmupUsedApiNav;
    const value = flag ? 16000 : 40000;
    const local = () => {
      if (arg3) {
        arg3._selfWarmupCommentSettled = true;
      }
      return true;
    };
    if (arg2) {
      fn7(arg2, flag ? "@" + (result || "用户") + " 已直达视频页，等待评论列表 API / 节点（最长约 " + Math.round(value / 1000) + " 秒）…" : "@" + (result || "用户") + " 已进入视频页，等待评论区与自动定位稳定（最长约 40 秒）…", "info");
    }
    const result3 = Date.now();
    let num = 0;
    let num2 = 0;
    while (Date.now() - result3 < value) {
      if (arg1.isDestroyed()) {
        return false;
      }
      const result4 = await arg1.webContents.executeJavaScript("(() => {\n        const visible = (el) => {\n          if (!el) return false;\n          const r = el.getBoundingClientRect();\n          const s = getComputedStyle(el);\n          return r.width > 0 && r.height > 0\n            && s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';\n        };\n        const panel = document.querySelector(\n          '[data-e2e=\"comment-panel\"], [data-e2e=\"comment-list\"], .comment-mainContent, [class*=\"comment-mainContent\"]'\n        );\n        const items = Array.from(document.querySelectorAll(\n          '[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], div[class*=\"CommentItem\"], div[class*=\"comment-item\"]'\n        )).filter(visible);\n        const latest = window.__radarLatestCommentList || null;\n        const targetCid = " + JSON.stringify(result2) + ";\n        const apiFresh = !!(latest && Date.now() - Number(latest.ts || 0) < 20000);\n        const apiHasTarget = !!(apiFresh && targetCid && Array.isArray(latest.cids) && latest.cids.includes(targetCid));\n        const apiHasAny = !!(apiFresh && Number(latest.count || 0) > 0);\n        return {\n          hasPanel: !!(panel && visible(panel)),\n          itemCount: items.length,\n          apiHasTarget: !!apiHasTarget,\n          apiHasAny: !!apiHasAny,\n          apiCount: Number(latest && latest.count) || 0,\n        };\n      })()").catch(() => ({
        hasPanel: false,
        itemCount: 0,
        apiHasTarget: false,
        apiHasAny: false,
        apiCount: 0
      }));
      if (flag && result4.apiHasTarget) {
        await delay(600);
        if (arg2) {
          fn7(arg2, "@" + (result || "用户") + " 评论列表 API 已命中目标 cid，开始定位", "info");
        }
        return local();
      }
      if (result4.hasPanel && result4.itemCount > 0) {
        if (result4.itemCount >= num) {
          if (result4.itemCount === num) {
            num2 += 1;
          } else {
            num2 = 0;
          }
          num = result4.itemCount;
        }
        const local2 = flag && (result4.apiHasAny || num2 >= 2);
        const local3 = !flag && (num2 >= 3 || result4.itemCount >= 3 && Date.now() - result3 > 4000);
        if (local2 || local3) {
          await delay(flag ? 700 : 2500 + Math.floor(Math.random() * 1000));
          if (arg2) {
            fn7(arg2, "@" + (result || "用户") + " 评论区已就绪（可见 " + result4.itemCount + " 条" + (result4.apiCount ? "，API " + result4.apiCount : "") + "），开始定位目标评论", "info");
          }
          return local();
        }
      }
      await delay(400);
    }
    if (arg2) {
      fn7(arg2, "@" + (result || "用户") + " 评论区就绪等待超时（约 " + Math.round(value / 1000) + " 秒），改为滚动定位", "warning");
    }
    return local();
  }
  async function fn85(arg1, options = {}) {
    return fn76(arg1, {
      resultChannel: "self-warmup-reply-comment-result",
      controlChannel: "self-warmup-reply-comment",
      timeoutReason: "回复评论操作超时",
      payload: {
        nickname: options.nickname || "",
        userUrl: options.userUrl || "",
        commentText: options.commentText || "",
        timeText: options.timeText || "",
        replyText: options.replyText || "",
        commentId: options.commentId || options.cid || "",
        cid: options.commentId || options.cid || "",
        enableCommentMention: !!options.enableCommentMention,
        commentMentionNicknames: options.commentMentionNicknames || "",
        commentMentionPosition: options.commentMentionPosition || "before",
        commentMentionPercent: Number.isFinite(Number(options.commentMentionPercent)) ? Math.max(0, Math.min(100, Math.round(Number(options.commentMentionPercent)))) : 100,
        enableCommentImage: !!options.enableCommentImage,
        commentImagePaths: options.commentImagePaths || [],
        enableCommentExpression: !!options.enableCommentExpression,
        commentExpressionCount: options.commentExpressionCount || 3,
        enableCommentWithoutText: !!options.enableCommentWithoutText,
        commentAttachmentPercent: options.commentAttachmentPercent,
        commentUseRandomSuffix: false
      },
      timeoutMs: 120000
    });
  }
  function fn86(options = {}, arg2 = null) {
    if (arg2?.enableCommentImage && Array.isArray(arg2.commentImagePaths) && arg2.commentImagePaths.some(arg1 => String(arg1 || "").trim())) {
      return true;
    }
    if (arg2?.enableCommentExpression) {
      return true;
    }
    if (Array.isArray(options.replyTemplateItems) && options.replyTemplateItems.length) {
      if (commentItemsHaveAttachment(options)) {
        return true;
      }
    } else {
      if (options.enableCommentImage && Array.isArray(options.commentImagePaths) && options.commentImagePaths.some(arg1 => String(arg1 || "").trim())) {
        return true;
      }
      if (options.enableCommentExpression) {
        return true;
      }
    }
    if (options.enableCommentMention && String(options.commentMentionNicknames || "").trim()) {
      return true;
    }
    return false;
  }
  function fn87(options = {}, options2 = {}) {
    const flag = !!options2.allowEmptyReplyText;
    const local = options2.itemExtras || null;
    const value = Number.isFinite(Number(options.commentAttachmentPercent)) ? Number(options.commentAttachmentPercent) : 100;
    return {
      enableCommentMention: !!options.enableCommentMention,
      commentMentionNicknames: options.commentMentionNicknames || "",
      commentMentionPosition: options.commentMentionPosition || "before",
      commentMentionPercent: Number.isFinite(Number(options.commentMentionPercent)) ? Math.max(0, Math.min(100, Math.round(Number(options.commentMentionPercent)))) : 100,
      enableCommentImage: local ? !!local.enableCommentImage : !!options.enableCommentImage,
      commentImagePaths: local ? local.commentImagePaths || [] : options.commentImagePaths || [],
      enableCommentExpression: local ? !!local.enableCommentExpression : !!options.enableCommentExpression,
      commentExpressionCount: local ? local.commentExpressionCount || 3 : options.commentExpressionCount || 3,
      enableCommentWithoutText: flag || options.enableCommentWithoutText === true,
      commentAttachmentPercent: flag ? 100 : value,
      commentUseRandomSuffix: false
    };
  }
  async function fn88(arg1, options = {}) {
    return fn76(arg1, {
      resultChannel: "self-warmup-like-comment-result",
      controlChannel: "self-warmup-like-comment",
      timeoutReason: "点赞评论操作超时",
      payload: {
        nickname: options.nickname || "",
        userUrl: options.userUrl || "",
        commentText: options.commentText || "",
        timeText: options.timeText || "",
        commentId: options.commentId || options.cid || "",
        cid: options.commentId || options.cid || ""
      },
      timeoutMs: 120000
    });
  }
  function fn89(arg1) {
    const result = compactText(arg1?.text);
    if (!result) {
      return "";
    }
    return result.replace(/\[[^\[\]\n]{1,16}\]/g, "").replace(/👍|👏|❤|♥|💕|💗|💖|💘/g, "").replace(/\s+/g, " ").trim();
  }
  async function fn90(arg1, arg2, arg3) {
    const result = await fn83(arg2, arg3, arg1);
    if (!result) {
      return {
        ok: false,
        reason: "未能打开对应视频页"
      };
    }
    return fn15(arg2, async () => {
      await fn84(arg2, arg1, arg3);
      return fn88(arg2, {
        nickname: arg3.nickname,
        userUrl: arg3.userUrl,
        commentText: compactText(arg3.text),
        timeText: compactText(arg3.timeText),
        commentId: arg3.commentId || arg3.cid || "",
        cid: arg3.commentId || arg3.cid || ""
      });
    });
  }
  async function fn91(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8 = null) {
    const result = await fn83(arg4, arg6, arg3);
    if (!result) {
      return {
        ok: false,
        reason: "未能打开对应视频页"
      };
    }
    await fn84(arg4, arg3, arg6);
    const value = arg5.enableCommentWithoutText === true;
    const result2 = fn86(arg5, arg8);
    let value2 = value ? "" : arg7;
    let flag = false;
    const result3 = resolveSelfWarmupContentMode(arg5, false);
    if (!value && result3 === "ai" && isMonitorAccountAiEnabled(arg5, arg1)) {
      await delay(1200);
      const result = await arg4.webContents.executeJavaScript("(() => {\n        const compact = (value) => String(value || '').replace(/\\s+/g, ' ').trim();\n        const targetName = compact(" + JSON.stringify(arg6.nickname || "") + ").replace(/^@+/, '').toLowerCase();\n        const hint = compact(" + JSON.stringify(fn89(arg6).slice(0, 50)) + ").toLowerCase();\n\n        const nodes = Array.from(document.querySelectorAll(\n          '[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], div[class*=\"comment-item\"], div[class*=\"reply-item\"]'\n        ));\n        let target = null;\n        for (const node of nodes) {\n          const link = node.querySelector('a[href*=\"/user/\"]');\n          const name = compact(link?.innerText || link?.textContent || '').replace(/^@+/, '').toLowerCase();\n          if (!name || !targetName) continue;\n          if (name !== targetName && !name.includes(targetName) && !targetName.includes(name)) continue;\n          const contentEl = node.querySelector('[data-e2e=\"comment-content\"], span[class*=\"comment\"], [class*=\"content\"]');\n          const content = compact(contentEl?.innerText || contentEl?.textContent || node.innerText || '').toLowerCase();\n          // 有可识别纯文字时再过滤；纯表情/图片评论走昵称兜底\n          if (hint.length >= 2 && !content.includes(hint.slice(0, Math.min(20, hint.length)))) continue;\n          target = node;\n          break;\n        }\n        if (!target && targetName) {\n          target = nodes.find((node) => {\n            const link = node.querySelector('a[href*=\"/user/\"]');\n            const name = compact(link?.innerText || link?.textContent || '').replace(/^@+/, '').toLowerCase();\n            return name && (name === targetName || name.includes(targetName) || targetName.includes(name));\n          }) || null;\n        }\n        if (!target) return '';\n\n        const container = target.closest('[class*=\"comment-item-container\"], [class*=\"CommentItemContainer\"]') || target.parentElement;\n        if (!container) return '';\n\n        const rows = Array.from(container.querySelectorAll('[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], [class*=\"comment-item\"], [class*=\"reply-item\"]'));\n        return rows.map((row) => {\n          const link = row.querySelector('a[href*=\"/user/\"]');\n          const name = compact(link?.innerText || link?.textContent || '');\n          const contentEl = row.querySelector('[data-e2e=\"comment-content\"], span[class*=\"comment\"], [class*=\"content\"]');\n          const content = compact(contentEl?.innerText || contentEl?.textContent || '');\n          if (!name || !content) return '';\n          return name + ': ' + content;\n        }).filter(Boolean).slice(-10).join('\\n');\n      })()").catch(() => "");
      if (result) {
        fn7(arg3, "正在结合最近 10 条评论对话上下文重新生成回复...", "info");
        try {
          const result2 = await generateMonitorPersonaContent(arg5, arg1, arg2, {
            title: "自热互动通知",
            url: ""
          }, {
            nickname: arg6.nickname,
            text: arg6.text,
            userUrl: arg6.userUrl,
            chatHistory: result
          }, {
            forDm: false,
            aiScene: "self_warmup",
            onRetry: (arg1, arg2) => fn7(arg3, "重新生成评论回复第 " + arg1 + " 次未成功：" + arg2, "warning")
          });
          if (result2) {
            value2 = result2;
            flag = true;
            fn7(arg3, "结合上下文生成新回复成功：" + value2, "info");
          }
        } catch (error) {
          fn7(arg3, "重新生成评论回复失败，使用预设文本：" + error.message, "warning");
        }
      }
    }
    if (!value && !flag && result3 !== "ai" && arg5.commentUseRandomSuffix && String(value2 || "").trim()) {
      value2 = appendRandomEmojiSuffix(value2);
    }
    const flag2 = !!String(value2 || "").trim();
    const local = !flag2 && result2;
    if (!flag2 && !result2) {
      return {
        ok: false,
        reason: value ? "已开启不发文字但未配置图片/表情/@" : "无回复文案且未配置图片/表情/@"
      };
    }
    return fn15(arg4, async () => {
      await delay(800);
      const result = await fn85(arg4, {
        nickname: arg6.nickname,
        userUrl: arg6.userUrl,
        commentText: compactText(arg6.text),
        timeText: compactText(arg6.timeText),
        replyText: value2,
        commentId: arg6.commentId || arg6.cid || "",
        cid: arg6.commentId || arg6.cid || "",
        ...fn87(arg5, {
          allowEmptyReplyText: local,
          itemExtras: arg8
        })
      });
      return {
        ok: !!result.ok,
        reason: result.reason || "",
        sentText: result.sentText || value2,
        errorCode: result.errorCode || "",
        diagnostic: result.diagnostic || "",
        detail: result.detail || ""
      };
    });
  }
  async function fn92(arg1, arg2, options = {}) {
    return fn76(arg1, {
      resultChannel: "self-warmup-reply-dm-result",
      controlChannel: "self-warmup-reply-dm",
      timeoutReason: "回复私信操作超时",
      payload: {
        dmText: arg2,
        nickname: options.nickname || "",
        text: options.text || "",
        config: options.config,
        accountId: options.accountId,
        account: options.account,
        excludeGroupChats: options.excludeGroupChats !== false
      }
    });
  }
  async function fn93(arg1, arg2, arg3, options = {}) {
    await delay(900 + Math.floor(Math.random() * 300));
    if (arg3) {
      return;
    }
    const result = await fn35(arg2, options);
    if (result?.recycled) {
      fn7(arg1, shouldWarmupIdleOnChat(options) ? "已回收作品/主页等画面，回到 Chat 页" : "已回收作品/主页等画面，回到精选页", "info");
    }
  }
  async function fn94(arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
    if (isDouyinStrangerMessagesFolderName(arg6.nickname)) {
      return {
        ok: true,
        skipped: true,
        reason: "陌生人消息是文件夹不是会话"
      };
    }
    return fn15(arg4, async () => {
      const result = await fn34(arg4, {
        taskId: arg3
      }).catch(() => null);
      let flag = isWarmupSurfaceComplete(result);
      if (!flag) {
        flag = await fn67(arg4, arg3);
      }
      if (!flag) {
        return {
          ok: false,
          reason: "未打开私信页面/面板"
        };
      }
      await delay(800);
      if (arg5.excludeGroupChats !== false) {
        if (arg6.isGroupChat || looksLikeDouyinGroupChatName(arg6.nickname).isGroup) {
          arg6.isGroupChat = true;
          arg6.groupReason = arg6.groupReason || looksLikeDouyinGroupChatName(arg6.nickname).reason || "list_or_name";
          fn7(arg3, (arg6.nickname || "私信会话") + " 已排除：已开启“排除群聊”（" + arg6.groupReason + "）", "info");
          return {
            ok: true,
            skipped: true,
            reason: "已开启“排除群聊”",
            excludedGroup: true
          };
        }
      }
      const result2 = (Array.isArray(arg7) ? arg7 : [arg7]).map(compactText).filter(Boolean);
      if (!result2.length) {
        return {
          ok: false,
          reason: "私信文案为空"
        };
      }
      let local = null;
      for (let num = 0; num < result2.length; num++) {
        const value = result2[num];
        if (num > 0) {
          fn7(arg3, "@" + (arg6.nickname || "用户") + " 发送第 " + (num + 1) + "/" + result2.length + " 条私信，间隔 1.5 秒…", "info");
          await delay(1500);
        }
        local = await fn92(arg4, value, {
          nickname: arg6.nickname,
          text: arg6.text,
          config: arg5,
          accountId: arg1,
          account: arg2,
          excludeGroupChats: arg5.excludeGroupChats !== false
        });
        if (local?.excludedGroup) {
          arg6.isGroupChat = true;
          arg6.groupReason = local.groupReason || "opened_session";
          fn7(arg3, (arg6.nickname || "私信会话") + " 已排除：已开启“排除群聊”（" + arg6.groupReason + "）", "info");
          break;
        }
      }
      fn75(arg6, local);
      return local;
    });
  }
  function fn95(arg1, arg2, arg3, arg4) {
    if (!arg1) {
      return false;
    }
    const result = normalizeName(arg3.nickname || "");
    const value = arg3.userUrl ? extractUserIdFromUrl(arg3.userUrl) : "";
    if (!result && !value) {
      return false;
    }
    const value2 = typeof arg1.listEventsForUser === "function" ? arg1.listEventsForUser(arg2, {
      nickname: arg3.nickname || "",
      userUrl: arg3.userUrl || ""
    }) : arg1.findTaskById(arg2)?.events || [];
    if (!Array.isArray(value2) || !value2.length) {
      return false;
    }
    return value2.some(arg1 => {
      const result2 = normalizeName(arg1.nickname || "");
      const value2 = arg1.userUrl ? extractUserIdFromUrl(arg1.userUrl) : "";
      const local = result && result2 && result === result2 || value && value2 && value === value2;
      if (!local) {
        return false;
      }
      const value3 = Array.isArray(arg1.actionsTaken) ? arg1.actionsTaken.join(" ") : String(arg1.actionSummary || "");
      if (arg4 === "follow_back" || arg4 === "user_follow") {
        return arg1.alreadyFollowed || arg1.followStatus === "success" || /已关注|已回关|已互关|原先已关注|已发关注请求/.test(value3);
      }
      if (arg4 === "send_dm" || arg4 === "reply_dm") {
        return arg1.dmStatus === "success" || /已发送私信|已回复私信/.test(value3);
      }
      if (arg4 === "reply_comment") {
        if (/已回复评论/.test(value3) && arg1.text === arg3.text) {
          return true;
        }
        return false;
      }
      if (arg4 === "like_comment") {
        return arg1.text === arg3.text && /已点赞评论|评论原先已赞/.test(value3);
      }
      return false;
    });
  }
  async function fn96(arg12, arg2, arg3, arg4, arg5, arg6, options = {}) {
    const {
      hasNextDm = false
    } = options;
    const result = fn61(arg12, arg5, arg6);
    const result2 = fn63(arg12, arg5, arg6, fn62(arg12, arg5, arg6));
    arg6.actionSkippedReasons = result2;
    result2.forEach(arg1 => {
      fn7(arg12, (arg6.nickname || "用户") + " " + (ACTION_LABELS[arg1.action] || arg1.action || "动作") + "已跳过：" + arg1.reason, "info");
    });
    if (!result.length) {
      if (result2.length) {
        arg6.actionStatus = "skipped";
        arg6.actionSummary = result2.map(fn64).join("、");
        return;
      }
      arg6.actionStatus = arg5.enableAutoActions ? "skipped" : "none";
      arg6.actionSummary = arg5.enableAutoActions ? "未匹配回应条件" : "仅记录";
      return;
    }
    if (result2.some(arg1 => arg1.action === "reply_comment") && result.includes("like_comment")) {
      fn7(arg12, formatEventBrief(arg6) + "：回复已达每用户上限，本条通知只点赞、不再回复（与同用户其它通知无关）", "info");
    }
    await delay(fn54(arg5));
    const list = [];
    const list2 = [];
    let flag = false;
    const local = arg1.selfWarmupTasksApi?.findTaskById(arg12)?.stats?.actionsExecuted || 0;
    const result3 = resolveSelfWarmupTemplatePayload(arg5, arg6, {
      isDm: false,
      roundIndex: local,
      fallback: arg5.enableCommentWithoutText === true || fn86(arg5) ? "" : "谢谢 {nickname}，看到你的评论啦。"
    });
    const result4 = resolveSelfWarmupTemplatePayload(arg5, arg6, {
      isDm: true,
      roundIndex: local,
      fallback: "你好 {nickname}，看到你的消息了，方便的话可以继续聊聊。"
    });
    const value = resolveSelfWarmupContentMode(arg5, false) === "template" ? result3.extras : null;
    const local2 = arg1 => {
      if (Array.isArray(arg1.text)) {
        return arg1.texts?.[0] || arg1.text[0] || "";
      }
      return arg1.text || "";
    };
    const result5 = Object.prototype.hasOwnProperty.call(arg6, "suggestedCommentText");
    const result6 = Object.prototype.hasOwnProperty.call(arg6, "suggestedDmText");
    const local3 = compactText(result5 ? arg6.suggestedCommentText : arg6.suggestedText) || local2(result3);
    const local4 = compactText(result6 ? arg6.suggestedDmText : arg6.suggestedText) || local2(result4);
    for (const item of result) {
      try {
        const result3 = fn5(arg12, item, arg2);
        if (result3) {
          result2.push({
            action: item,
            reason: result3
          });
          fn7(arg12, (arg6.nickname || "用户") + " " + (ACTION_LABELS[item] || item) + "已跳过：" + result3, "info");
          continue;
        }
        if (fn95(arg1.selfWarmupTasksApi, arg12, arg6, item)) {
          const value = item === "like_comment" ? "点赞评论" : item.includes("follow") ? "关注" : item.includes("dm") ? "私信" : "回复";
          fn7(arg12, (arg6.nickname || "用户") + " 在该任务详情记录中此前已完成" + value + "操作，跳过重复操作", "info");
          if (item === "like_comment") {
            list.push("已点赞评论");
          } else if (item.includes("follow")) {
            list.push("已关注");
            flag = true;
          } else if (item.includes("dm")) {
            list.push("已发私信");
          } else if (item.includes("comment")) {
            list.push("已回复评论");
          }
          continue;
        }
        if (item === "follow_back") {
          const result = await fn69(arg4, arg6);
          if (result.userUrl && !arg6.userUrl) {
            arg6.userUrl = result.userUrl;
          }
          if (result.ok) {
            flag = true;
            list.push(result.alreadyFollowed ? "已互关" : "已回关");
            if (!result.alreadyFollowed) {
              fn6(arg12, arg2, item);
            }
          } else {
            const result2 = await fn80(arg4, arg6);
            if (result2.userUrl && !arg6.userUrl) {
              arg6.userUrl = result2.userUrl;
            }
            if (result2.ok) {
              flag = true;
              if (result2.alreadyFollowed) {
                list.push("已互关");
              } else if (result2.followRequested) {
                list.push("已发关注请求");
              } else {
                list.push("已回关");
              }
              if (!result2.alreadyFollowed) {
                fn6(arg12, arg2, item);
              }
            } else {
              list2.push({
                action: item,
                reason: result2.reason || result.reason || "主页未确认回关成功"
              });
            }
            await fn35(arg4, arg5);
          }
        } else if (item === "user_follow") {
          const result = await fn80(arg4, arg6);
          if (result.userUrl && !arg6.userUrl) {
            arg6.userUrl = result.userUrl;
          }
          if (result.ok) {
            flag = true;
            if (result.alreadyFollowed) {
              list.push("原先已关注");
            } else if (result.followRequested) {
              list.push("已发关注请求");
            } else {
              list.push("已关注");
            }
            if (!result.alreadyFollowed) {
              fn6(arg12, arg2, item);
            }
          } else {
            const local = result.reason || "未找到关注按钮或点击失败";
            list2.push({
              action: item,
              reason: local
            });
            fn7(arg12, (arg6.nickname || "用户") + " " + local + "，跳过关注", "warning");
          }
          await fn35(arg4, arg5);
        } else if (item === "like_comment") {
          const result2 = await fn23(arg12, arg4, arg6, "@" + (arg6.nickname || "用户") + " 评论点赞", () => fn90(arg12, arg4, arg6));
          if (result2.retried) {
            arg6._immediateRetryPerformed = true;
          }
          if (result2.ok) {
            list.push(result2.alreadyLiked ? "评论原先已赞" : "已点赞评论");
            if (!result2.alreadyLiked) {
              fn6(arg12, arg2, item);
            }
          } else {
            const local = result2.reason || "未知原因";
            list2.push({
              action: item,
              reason: local
            });
            fn7(arg12, arg6.nickname + " 评论点赞失败：" + local, "warning");
          }
          if (!result.includes("reply_comment")) {
            arg6._selfWarmupCommentPageReady = false;
            await fn35(arg4, arg5);
          }
        } else if (item === "reply_comment") {
          const local = arg5.enableCommentWithoutText === true || !compactText(local3) && fn86(arg5, value);
          const result = fn86(arg5, value);
          const value2 = local ? "" : local3;
          if (!value2 && !result) {
            list2.push({
              action: item,
              reason: local ? "已开启不发文字但未配置图片/表情/@" : "无回复文案"
            });
            continue;
          }
          const result2 = fn59(arg5);
          const result3 = fn57(arg12, arg6.nickname, arg2, "comment", arg6.userUrl);
          if (result3 >= result2) {
            const value = "已达每用户 " + result2 + " 轮回复上限";
            list2.push({
              action: item,
              reason: value
            });
            fn7(arg12, arg6.nickname + " " + value + "，跳过", "info");
            continue;
          }
          const result4 = await fn23(arg12, arg4, arg6, "@" + (arg6.nickname || "用户") + " 评论回复", () => fn91(arg2, arg3, arg12, arg4, arg5, arg6, value2, value));
          if (result4.retried) {
            arg6._immediateRetryPerformed = true;
          }
          if (result4.ok) {
            if (result4.sentText) {
              arg6.suggestedCommentText = result4.sentText;
              arg6.suggestedText = result4.sentText;
            }
            const result = fn58(arg12, arg6.nickname, arg2, "comment", arg6.userUrl);
            list.push("已回复评论(" + result + "/" + result2 + ")");
            fn6(arg12, arg2, item);
          } else {
            const local = result4.reason || "未知原因";
            list2.push({
              action: item,
              reason: local
            });
            fn7(arg12, arg6.nickname + " 评论回复失败：" + local, "warning");
          }
          arg6._selfWarmupCommentPageReady = false;
          await fn35(arg4, arg5);
        } else if (item === "send_dm") {
          const result = fn59(arg5);
          const result2 = fn57(arg12, arg6.nickname, arg2, "dm", arg6.userUrl);
          if (result2 >= result) {
            const value = "已达每用户 " + result + " 轮回复上限";
            list2.push({
              action: item,
              reason: value
            });
            fn7(arg12, arg6.nickname + " " + value + "，跳过", "info");
            continue;
          }
          if (!(Array.isArray(local4) ? local4.some(arg1 => !!compactText(arg1)) : !!local4)) {
            list2.push({
              action: item,
              reason: "无私信文案"
            });
            continue;
          }
          if (flag) {
            await delay(fn65(arg5));
          }
          const result3 = await fn22(arg12, "@" + (arg6.nickname || "用户") + " 主页私信", () => fn78(arg4, arg6, local4));
          if (result3.retried) {
            arg6._immediateRetryPerformed = true;
          }
          if (result3.ok && result3.skipped) {
            let result2 = fn57(arg12, arg6.nickname, arg2, "dm", arg6.userUrl);
            if (result2 <= 0) {
              result2 = fn58(arg12, arg6.nickname, arg2, "dm", arg6.userUrl);
            }
            list.push("私信已跳过(" + result2 + "/" + result + "·会话已有我方消息)");
            fn7(arg12, arg6.nickname + " 会话中已有我方私信，跳过主动私信", "info");
          } else if (result3.ok) {
            if (result3.sentText) {
              arg6.suggestedDmText = result3.sentText;
              arg6.suggestedText = result3.sentText;
            }
            const result2 = fn58(arg12, arg6.nickname, arg2, "dm", arg6.userUrl);
            list.push("已发送私信(" + result2 + "/" + result + ")");
            fn6(arg12, arg2, item);
            fn7(arg12, (() => {
              const local = cleanDmDeliveredSnippet(result3.sentText) || cleanDmDeliveredSnippet(result3.debug?.snippet);
              if (local) {
                return arg6.nickname + " 私信已确认送达：" + local;
              } else {
                return arg6.nickname + " 私信已确认送达";
              }
            })(), "success");
          } else if (result3.blocked && result3.blockType === "privacy_settings") {
            const result2 = fn58(arg12, arg6.nickname, arg2, "dm", arg6.userUrl);
            list.push("私信已跳过(" + result2 + "/" + result + "·对方隐私设置)");
            fn7(arg12, arg6.nickname + " 因对方隐私设置无法私信，已跳过（平台提示：由于对方的隐私设置，你无法发送消息）", "info");
          } else if (result3.consumeRound) {
            if (result3.sentText) {
              arg6.suggestedDmText = result3.sentText;
              arg6.suggestedText = result3.sentText;
            }
            const result2 = fn58(arg12, arg6.nickname, arg2, "dm", arg6.userUrl);
            list.push("已发送私信(" + result2 + "/" + result + "·弱确认)");
            fn6(arg12, arg2, item);
            fn7(arg12, arg6.nickname + " 私信已发送(会话气泡未即时确认)，已计入次数", "success");
          } else {
            const local = result3.reason || "未知原因";
            list2.push({
              action: item,
              reason: local
            });
            fn7(arg12, arg6.nickname + " 主页私信失败：" + local, "warning");
          }
          await fn35(arg4, arg5);
        } else if (item === "reply_dm") {
          const result = fn59(arg5);
          const result2 = fn57(arg12, arg6.nickname, arg2, "dm", arg6.userUrl);
          if (result2 >= result) {
            const value = "已达每用户 " + result + " 轮回复上限";
            list2.push({
              action: item,
              reason: value
            });
            fn7(arg12, arg6.nickname + " " + value + "，跳过", "info");
            await fn93(arg12, arg4, hasNextDm, arg5);
            continue;
          }
          if (!(Array.isArray(local4) ? local4.some(arg1 => !!compactText(arg1)) : !!local4)) {
            list2.push({
              action: item,
              reason: "无私信文案"
            });
            await fn93(arg12, arg4, hasNextDm, arg5);
            continue;
          }
          const result3 = await fn22(arg12, "@" + (arg6.nickname || "用户") + " 私信回复", () => fn94(arg2, arg3, arg12, arg4, arg5, arg6, local4));
          if (result3.retried) {
            arg6._immediateRetryPerformed = true;
          }
          if (result3.ok && result3.skipped) {
            const local = result3.reason || "无需再回复";
            if (result3.excludedGroup || /排除群聊/.test(local)) {
              arg6.isGroupChat = true;
              arg6.suggestionStatus = "none";
              arg6.suggestedDmText = "";
              arg6.suggestedText = "";
              list.push("私信已跳过(排除群聊)");
              fn7(arg12, arg6.nickname + " " + local, "info");
            } else if (/文件夹/.test(local) || isDouyinStrangerMessagesFolderName(arg6.nickname)) {
              list.push("私信已跳过(陌生人消息是文件夹)");
              fn7(arg12, "已跳过「陌生人消息」文件夹：需进入列表后回复具体会话", "info");
            } else {
              list.push(local.includes("自己") ? "私信已跳过(最后一条为自己发送)" : "私信已跳过(未确认对方新消息)");
              fn7(arg12, arg6.nickname + " " + local, "info");
            }
          } else if (result3.ok) {
            if (result3.sentText) {
              arg6.suggestedDmText = result3.sentText;
              arg6.suggestedText = result3.sentText;
            }
            const result2 = fn58(arg12, arg6.nickname, arg2, "dm", arg6.userUrl);
            const value = result3.softVerified ? "(弱确认)" : "";
            list.push("已回复私信(" + result2 + "/" + result + value + ")");
            fn6(arg12, arg2, item);
            fn7(arg12, result3.softVerified ? arg6.nickname + " 私信已发送(会话气泡未即时确认)，已计入次数" : formatDmDeliveredLog(arg6.nickname, result3), "success");
          } else if (result3.blocked && result3.blockType === "privacy_settings") {
            const result2 = fn58(arg12, arg6.nickname, arg2, "dm", arg6.userUrl);
            list.push("私信回复已跳过(" + result2 + "/" + result + "·对方隐私设置)");
            fn7(arg12, arg6.nickname + " 因对方隐私设置无法回复私信，已跳过", "info");
          } else if (result3.consumeRound) {
            if (result3.sentText) {
              arg6.suggestedDmText = result3.sentText;
              arg6.suggestedText = result3.sentText;
            }
            const result2 = fn58(arg12, arg6.nickname, arg2, "dm", arg6.userUrl);
            list.push("已回复私信(" + result2 + "/" + result + "·弱确认)");
            fn6(arg12, arg2, item);
            fn7(arg12, arg6.nickname + " 私信已发送(会话气泡未即时确认)，已计入次数", "success");
          } else {
            const local = result3.reason || "未知原因";
            list2.push({
              action: item,
              reason: local
            });
            fn7(arg12, arg6.nickname + " 私信回复失败：" + local, "warning");
          }
          await fn93(arg12, arg4, hasNextDm, arg5);
        }
      } catch (error) {
        list2.push({
          action: item,
          reason: error.message || String(error)
        });
        fn7(arg12, "自动回应失败(" + item + ")：" + error.message, "warning");
      }
    }
    arg6.actionsTaken = list;
    arg6.actionFailures = list2;
    arg6.actionErrorReason = list2.map(arg1 => (ACTION_LABELS[arg1.action] || arg1.action) + "：" + arg1.reason).join("；");
    const list3 = [...list, ...result2.map(fn64)];
    arg6.actionSummary = list3.join("、");
    if (list.length && (list2.length || result2.length)) {
      arg6.actionStatus = "partial";
    } else if (list.length) {
      arg6.actionStatus = "success";
    } else if (result.length) {
      arg6.actionStatus = "failed";
      if (!arg6.actionSummary) {
        arg6.actionSummary = arg6.actionErrorReason || "自动回应未成功";
      }
    } else {
      arg6.actionStatus = "failed";
      arg6.actionSummary = arg6.actionErrorReason || "自动回应未成功";
    }
    if (list.length) {
      fn7(arg12, formatEventBrief(arg6) + " → " + list3.join("、"), "success");
    } else if (list2.length) {
      const value = result2.length ? "（" + result2.map(fn64).join("、") + "）" : "";
      fn7(arg12, formatEventBrief(arg6) + " 自动回应失败：" + arg6.actionErrorReason + value, "warning");
    } else if (result2.length) {
      fn7(arg12, formatEventBrief(arg6) + " → " + list3.join("、"), "info");
    }
  }
  async function fn97(arg1, arg2, arg3, arg4, arg5) {
    const result = arg5.filter(arg1 => isJudgeableEvent(arg1));
    const map = new Map();
    if (result.length) {
      if (arg4.useAiJudge) {
        try {
          fn7(arg1, "正在对 " + result.length + " 条评论/私信做 AI 研判", "info");
          const result2 = await analyzeMonitorCommentsBatch(arg4, arg2, arg3, {
            title: "自热互动通知",
            url: ""
          }, result.map(arg1 => ({
            nickname: arg1.nickname,
            text: arg1.text,
            userUrl: arg1.userUrl,
            time: arg1.timeText
          })), {
            aiScene: "self_warmup",
            onLog: arg12 => fn7(arg1, arg12, "info"),
            onRetry: (arg12, arg2) => fn7(arg1, "AI 研判第 " + arg12 + " 次未成功：" + arg2, "warning")
          });
          result.forEach((arg1, arg2) => map.set(arg1, result2[arg2]));
        } catch (error) {
          fn7(arg1, "AI 研判失败，回退关键词：" + error.message, "warning");
        }
      }
      result.forEach(arg1 => {
        if (map.has(arg1)) {
          return;
        }
        const result = String(arg4.keywords || "").replace(/[\n\r]+/g, ",");
        const result2 = matchKeywords(arg1.text, result);
        const flag = !!result.trim();
        map.set(arg1, {
          matched: result2,
          matchType: "keyword",
          reason: result2 ? flag ? "命中关键词" : "未设置关键词，全部回复" : "未命中关键词",
          replyContent: ""
        });
      });
    }
    for (const item of arg5) {
      if (map.has(item)) {
        const local = map.get(item) || {};
        item.matched = local.matched !== false;
        item.matchType = local.matchType || (arg4.useAiJudge ? "ai" : "keyword");
        item.judgeReason = local.reason || local.judgeReason || (item.matched ? "建议跟进" : "无需跟进");
      } else {
        item.matched = true;
        item.matchType = "rule";
        item.judgeReason = (item.eventLabel || "互动") + "已记录";
      }
    }
  }
  async function fn98(arg1, arg2, arg3, arg4, arg5) {
    const value = arg4.enableAutoActions ? fn61(arg1, arg4, arg5) : [];
    const result = value.includes("reply_comment");
    const result2 = value.some(arg1 => arg1 === "reply_dm" || arg1 === "send_dm");
    const result3 = resolveSelfWarmupTemplatePayload(arg4, arg5, {
      isDm: false
    });
    const value2 = Array.isArray(result3.text) ? result3.texts?.[0] || "" : result3.text || "";
    const local = arg4.enableCommentWithoutText === true || !String(value2).trim() && fn86(arg4, result3.extras);
    const local2 = result && !local;
    const local3 = result2;
    if (!arg4.enableAutoActions || !local2 && !local3) {
      arg5.suggestionStatus = "none";
      return;
    }
    if (arg5.source === "dm" && arg4.excludeGroupChats !== false && (arg5.isGroupChat || looksLikeDouyinGroupChatName(arg5.nickname).isGroup)) {
      arg5.suggestionStatus = "none";
      arg5.suggestedDmText = "";
      arg5.suggestedText = "";
      return;
    }
    if (!arg5.matched) {
      arg5.suggestionStatus = "none";
      return;
    }
    if (result && !result2 && local) {
      arg5.suggestionStatus = "none";
      arg5.suggestedCommentText = "";
      arg5.suggestedText = "";
      return;
    }
    const local4 = async arg12 => {
      const result = resolveSelfWarmupContentMode(arg4, arg12);
      if (result === "ai" && isMonitorAccountAiEnabled(arg4, arg2)) {
        return generateMonitorPersonaContent(arg4, arg2, arg3, {
          title: "自热互动通知",
          url: ""
        }, {
          nickname: arg5.nickname,
          text: arg5.text,
          userUrl: arg5.userUrl
        }, {
          forDm: arg12,
          aiScene: "self_warmup",
          onRetry: (arg13, arg2) => fn7(arg1, (arg12 ? "私信" : "评论") + " AI 生成第 " + arg13 + " 次未成功：" + arg2, "warning")
        });
      }
      const result2 = resolveSelfWarmupTemplatePayload(arg4, arg5, {
        isDm: arg12,
        fallback: arg12 ? "你好 {nickname}，看到你的消息了，方便的话可以继续聊聊。" : "谢谢 {nickname}，看到你的评论啦。"
      });
      if (Array.isArray(result2.text)) {
        return result2.texts?.[0] || "";
      } else {
        return result2.text || "";
      }
    };
    const list = [];
    let text = "";
    let text2 = "";
    if (local2) {
      try {
        text = compactText(await local4(false));
      } catch (error) {
        list.push("评论：" + (error.message || String(error)));
      }
      arg5.suggestedCommentText = text;
    }
    if (local3) {
      try {
        text2 = compactText(await local4(true));
      } catch (error) {
        list.push("私信：" + (error.message || String(error)));
      }
      arg5.suggestedDmText = text2;
    }
    arg5.suggestedText = arg5.eventType === "message" ? text2 : text || text2;
    arg5.suggestionStatus = text || text2 ? "ready" : list.length ? "failed" : "none";
    arg5.suggestionErrorReason = list.join("；");
    if (list.length) {
      arg5.judgeReason = arg5.judgeReason ? arg5.judgeReason + "；建议生成失败：" + arg5.suggestionErrorReason : "建议生成失败：" + arg5.suggestionErrorReason;
    }
  }
  async function fn99(arg1, arg2, arg3) {
    if (!arg2.enableWebhook || !arg2.webhookUrl || !arg3.length) {
      return 0;
    }
    const result = arg3.slice(0, 20).map((arg1, arg2) => {
      const value = arg1.userUrl ? "[" + (arg1.nickname || "用户") + "](" + arg1.userUrl + ")" : arg1.nickname || "用户";
      const value2 = arg1.suggestedText ? "\n   - 建议：" + arg1.suggestedText : "";
      return arg2 + 1 + ". " + arg1.eventLabel + " · " + value + "\n   - 内容：" + (arg1.text || arg1.eventLabel) + "\n   - 时间：" + (arg1.timeText || "最新") + value2;
    });
    const obj = {
      title: "自热互动新动态",
      content: "本轮发现 " + arg3.length + " 条新互动：\n\n" + result.join("\n\n"),
      time: new Date().toLocaleString(),
      items: arg3
    };
    try {
      const result = buildWebhookPayload(arg2.webhookType || "feishu", obj);
      const value = arg2.webhookType === "dingtalk" ? signDingtalkUrl(arg2.webhookUrl, arg2.webhookSecret) : arg2.webhookUrl;
      const result2 = await axios.post(value, result, {
        timeout: 10000
      });
      const flag = isWebhookResponseSuccess(arg2.webhookType || "feishu", result2);
      arg3.forEach(arg1 => {
        arg1.webhookStatus = flag ? "success" : "failed";
        if (!flag) {
          arg1.webhookErrorReason = "Webhook 返回异常";
        }
      });
      fn7(arg1, flag ? "Webhook 已推送 " + arg3.length + " 条新互动" : "Webhook 返回异常", flag ? "success" : "warning");
      if (flag) {
        return arg3.length;
      } else {
        return 0;
      }
    } catch (error) {
      const local = error.message || String(error);
      arg3.forEach(arg1 => {
        arg1.webhookStatus = "failed";
        arg1.webhookErrorReason = local;
      });
      fn7(arg1, "Webhook 推送失败：" + error.message, "warning");
      return 0;
    }
  }
  function fn100(arg1, num = 0, arg3 = null) {
    const obj = {
      checks: 1,
      eventsTotal: arg1.length,
      notifications: arg1.filter(arg1 => arg1.source === "notification").length,
      comments: arg1.filter(arg1 => arg1.eventType === "comment").length,
      replies: arg1.filter(arg1 => arg1.eventType === "reply").length,
      likes: arg1.filter(arg1 => arg1.eventType === "like").length,
      follows: arg1.filter(arg1 => arg1.eventType === "follow").length,
      messages: arg1.filter(arg1 => arg1.eventType === "message").length,
      matched: arg1.filter(arg1 => arg1.matched).length,
      suggestions: arg1.filter(arg1 => arg1.suggestionStatus === "ready").length,
      actionsExecuted: arg3 == null ? arg1.filter(arg1 => (arg1.actionsTaken || []).length > 0).length : Math.max(0, Number(arg3) || 0),
      webhookPushed: num,
      lastCycleEvents: arg1.length,
      lastCycleAt: Date.now()
    };
    return obj;
  }
  function fn101(options = {}) {
    if (options.actionStatus !== "failed" || (options.actionsTaken || []).length > 0) {
      return false;
    }
    const result = compactText(options.actionErrorReason || options.actionSummary);
    if (!result) {
      return false;
    }
    if (/超时|未确认|疑似|输入框仍有内容|点击发送后|发送结果校验/.test(result)) {
      return false;
    }
    return /未打开|未找到|缺少|未加载完成|页面脚本异常|读取.*异常/.test(result);
  }
  function fn102(arg1, arg2) {
    const result = buildSelfWarmupEventSeenKey(arg2);
    const result2 = arg1.findIndex(arg1 => buildSelfWarmupEventSeenKey(arg1) === result);
    if (result2 >= 0) {
      arg1[result2] = arg2;
    } else {
      arg1.push(arg2);
    }
  }
  async function fn103(arg1, arg2, arg3, arg4, arg5) {
    const local = arg4.find(arg1 => String(arg1.id) === String(arg2)) || {
      id: arg2
    };
    const result = await fn29(local);
    const local2 = local.nickname || local.name || String(arg2);
    if (result?.webContents?.id) {
      map5.set(result.webContents.id, {
        taskId: arg1,
        accountId: String(arg2),
        accountName: local2
      });
    }
    fn7(arg1, "账号 " + local2 + " 开始检查：进入精选页并确认登录状态", "info");
    const result2 = await fn33(result, arg1);
    if (!isWarmupSurfaceComplete(result2) && result2.status !== "login-required") {
      fn7(arg1, "账号 " + (local.nickname || local.name || arg2) + " 精选页尚未就绪，本轮不推进（" + fn26(result2) + "）", "warning");
      return {
        events: 0,
        matched: 0,
        incomplete: true
      };
    }
    const result3 = await fn36(result, local);
    if (!result3.loggedIn) {
      fn7(arg1, "账号 " + (local.nickname || local.name || arg2) + " 未登录，跳过本轮（" + result3.reason + "）", "warning");
      return {
        events: 0,
        matched: 0
      };
    }
    if (result3.assumedFromAccountPool) {
      fn7(arg1, "账号 " + (local.nickname || local.name || arg2) + " 按账号池已登录状态继续检查", "info");
    }
    const list = [];
    let flag = false;
    const local3 = arg3.watchComments !== false || arg3.watchReplies !== false || arg3.watchLikes !== false || arg3.watchFollows !== false;
    let flag2 = false;
    ensureSelfWarmupNoticeJsonBridge();
    if (local3) {
      fn7(arg1, "账号 " + local2 + " 正在打开通知面板并等待通知列表稳定…", "info");
      const result2 = Date.now();
      const result3 = await fn39(result, "notification", {
        taskId: arg1,
        reloadOnFailure: true
      });
      const flag3 = isWarmupSurfaceComplete(result3);
      const local3 = result.webContents?.id;
      const value = local3 ? latestNoticeJsonStore.get(local3 + ":notice") : null;
      const local4 = !!value && value.kind === "notice" && !!(Number(value.ts || 0) >= result2);
      let list2 = [];
      if (local4) {
        list2 = parseDouyinNoticeJson(value.data, local);
        if (list2.length > 0) {
          console.log("[36m[Terminal-Only] 账号 " + (local.nickname || local.name || arg2) + " 从本轮网络 JSON 中解析出 " + list2.length + " 条有效通知事件[0m");
        }
      }
      const value2 = flag3 ? await fn40(result) : [];
      const result4 = value2.map(arg1 => fn50(arg1, local));
      const result5 = mergeSelfWarmupNoticeEvents([...list2, ...result4]);
      flag2 = canCommitNotificationScan(result3, list2.length);
      if (!flag2) {
        flag = true;
        fn7(arg1, "账号 " + (local.nickname || local.name || arg2) + " 通知面板未完整就绪，本轮不建立基线、不消费通知（" + fn26(result3) + "）", "warning");
      } else {
        const result = Math.max(0, list2.length + result4.length - result5.length);
        fn7(arg1, "账号 " + local2 + " 通知扫描完成：网络 " + list2.length + " 条、页面 " + result4.length + " 条，来源合并后 " + result5.length + " 条，来源重复 " + result + " 条", "info");
      }
      list.push(...result5);
    }
    const result4 = getSeenKeys(store, arg1);
    const set = new Set(result4);
    const result5 = getPendingEvents(store, arg1);
    const set2 = new Set(result5.map(arg1 => buildSelfWarmupEventSeenKey(arg1)));
    const value = "self_warmup_baselines_" + arg1;
    const obj = {
      ...(store.get(value, {}) || {})
    };
    const flag3 = !!obj[String(arg2)];
    let num = 0;
    const set3 = new Set();
    const list2 = [];
    const local4 = arg12 => {
      const obj = {
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
      arg12.forEach(arg12 => {
        obj.total += 1;
        if (!fn52(arg3, arg12)) {
          obj.notWatched += 1;
          return;
        }
        if (arg12.eventType === "unknown") {
          obj.unknown += 1;
          return;
        }
        const result = buildSelfWarmupEventSeenKey(arg12);
        if (set.has(result)) {
          obj.seen += 1;
          return;
        }
        if (set2.has(result)) {
          obj.pending += 1;
          return;
        }
        if (set3.has(result)) {
          obj.batchDuplicate += 1;
          return;
        }
        set3.add(result);
        if (arg12.source === "notification" && !flag3) {
          set.add(result);
          result4.push(result);
          num += 1;
          obj.baseline += 1;
          return;
        }
        const result2 = fn53(arg3, arg12);
        if (result2) {
          fn7(arg1, (arg12.nickname || "私信会话") + " 已排除：" + result2 + (arg12.isGroupChat ? "（群聊）" : ""), "info");
          set.add(result);
          result4.push(result);
          obj.excluded += 1;
          return;
        }
        const obj2 = {
          ...arg12,
          id: "warm_event_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
          ts: Date.now(),
          _attemptCount: 0,
          _queuedAt: Date.now(),
          _inFlightAt: 0
        };
        result5.push(obj2);
        set2.add(result);
        list2.push(obj2);
        obj.queued += 1;
      });
      return obj;
    };
    const result6 = local4(list);
    if (local3 && flag2) {
      const value = result6.seen + result6.pending + result6.batchDuplicate;
      fn7(arg1, "账号 " + local2 + " 通知过滤完成：候选 " + result6.total + " 条，历史/待处理重复 " + value + " 条，新增待处理 " + result6.queued + " 条，历史基线 " + result6.baseline + " 条，规则排除 " + (result6.excluded + result6.notWatched + result6.unknown) + " 条", "info");
    }
    if (!flag3 && flag2) {
      obj[String(arg2)] = Date.now();
      store.set(value, obj);
      if (num > 0) {
        fn7(arg1, "账号 " + (local.nickname || local.name || arg2) + " 已建立 " + num + " 条历史通知基线，不对旧互动执行动作", "info");
      }
    }
    saveSeenKeys(store, arg1, result4);
    savePendingEvents(store, arg1, result5);
    const list3 = [];
    const set4 = new Set();
    const local5 = arg1 => arg1?.source !== "dm" && arg1?.eventType !== "message";
    const local6 = async arg12 => {
      const result2 = result5.filter(arg1 => String(arg1.accountId) === String(arg2) && arg12(arg1) && !set4.has(arg1.id));
      if (!result2.length) {
        return;
      }
      const value = result2.some(arg1 => arg1.eventType === "message") ? "私信" : "通知";
      fn7(arg1, "账号 " + local2 + " 本轮有 " + result2.length + " 条" + value + "待处理", "info");
      const result3 = result2.filter(arg1 => !arg1._evaluatedAt);
      if (result3.length) {
        await fn97(arg1, String(arg2), local, arg3, result3);
        for (const item of result3) {
          await fn98(arg1, String(arg2), local, arg3, item);
          item._evaluatedAt = Date.now();
          fn102(result5, item);
        }
        savePendingEvents(store, arg1, result5);
      }
      for (let num = 0; num < result2.length; num += 1) {
        const value2 = result2[num];
        if (!map.has(arg1)) {
          break;
        }
        const result3 = fn61(arg1, arg3, value2).map(arg1 => ACTION_LABELS[arg1] || arg1).join("、");
        fn7(arg1, "账号 " + local2 + " 处理 " + value + " " + (num + 1) + "/" + result2.length + "：" + formatEventBrief(value2) + "；" + (result3 ? "计划执行 " + result3 : "没有匹配到自动动作"), "info");
        set4.add(value2.id);
        const value3 = Number(value2._inFlightAt) > 0;
        if (value3) {
          value2.actionStatus = "failed";
          value2.actionSummary = "上次动作执行中断";
          value2.actionErrorReason = "上次动作执行中断，为避免重复回复或关注，本次不自动重试";
          value2._inFlightAt = 0;
        } else if (arg3.enableAutoActions) {
          value2._attemptCount = Number(value2._attemptCount || 0) + 1;
          value2._inFlightAt = Date.now();
          fn102(result5, value2);
          savePendingEvents(store, arg1, result5);
          const result3 = result2.slice(num + 1).some(arg12 => fn61(arg1, arg3, arg12).includes("reply_dm"));
          await fn96(arg1, String(arg2), local, result, arg3, value2, {
            hasNextDm: result3
          });
          value2._inFlightAt = 0;
        } else {
          value2.actionStatus = "none";
          value2.actionSummary = "仅记录";
        }
        const local3 = !value3 && !value2._immediateRetryPerformed && Number(value2._attemptCount || 0) < 2 && fn101(value2);
        if (local3) {
          fn102(result5, value2);
          fn7(arg1, (value2.nickname || "用户") + " 本次动作未进入发送阶段，将在下轮安全重试（" + value2._attemptCount + "/2）", "warning");
        } else {
          const result = buildSelfWarmupEventSeenKey(value2);
          set.add(result);
          result4.push(result);
          const result2 = result5.findIndex(arg1 => buildSelfWarmupEventSeenKey(arg1) === result);
          if (result2 >= 0) {
            result5.splice(result2, 1);
          }
        }
        list3.push(value2);
        arg5.appendEventRecord(arg1, value2);
        saveSeenKeys(store, arg1, result4);
        savePendingEvents(store, arg1, result5);
      }
    };
    await local6(local5);
    const set5 = new Set();
    const local7 = arg1 => arg1?.source === "dm" || arg1?.eventType === "message";
    let flag4 = false;
    if (arg3.watchMessages !== false) {
      const result2 = await fn68(result, "私信", ["[data-e2e=\"im-entry\"]"]);
      fn7(arg1, "账号 " + (local.nickname || local.name || arg2) + " 检查 Chat 私信列表" + (result2.unread ? "（顶部有未读提示）" : "（不依赖顶部红点）") + "…", "info");
      const result3 = await fn34(result, {
        taskId: arg1
      }).catch(arg1 => ({
        status: "navigation-error",
        error: arg1?.message || String(arg1),
        rootCount: 0,
        rowCount: 0
      }));
      if (isWarmupSurfaceComplete(result3)) {
        const result2 = await fn49(result, false);
        if (!result2.ok) {
          flag = true;
          fn7(arg1, "账号 " + (local.nickname || local.name || arg2) + " 私信列表读取失败，本轮保留待回复私信（" + (result2.reason || "未知原因") + "）", "warning");
        } else if (result2.list.length > 0) {
          flag4 = canCommitDmScan({
            chatSurface: result3,
            messageScanOk: result2.ok
          });
          const value = result2.list;
          const result = value.map(arg1 => fn51(arg1, local)).filter(Boolean);
          result.forEach(arg1 => set5.add(buildSelfWarmupEventSeenKey(arg1)));
          const result6 = local4(result);
          fn7(arg1, "账号 " + local2 + " 私信过滤完成：未读 " + result6.total + " 条，历史/待处理重复 " + (result6.seen + result6.pending + result6.batchDuplicate) + " 条，新增待回复 " + result6.queued + " 条，规则排除 " + (result6.excluded + result6.notWatched + result6.unknown) + " 条", "info");
          saveSeenKeys(store, arg1, result4);
          savePendingEvents(store, arg1, result5);
        } else {
          flag4 = canCommitDmScan({
            chatSurface: result3,
            messageScanOk: result2.ok
          });
          fn7(arg1, "账号 " + (local.nickname || local.name || arg2) + " Chat 列表无新未读私信", "info");
        }
      } else {
        flag = true;
        fn7(arg1, "账号 " + (local.nickname || local.name || arg2) + " Chat 页面未完整就绪，本轮保留待回复私信（" + fn26(result3) + "）", "warning");
      }
    }
    if (flag4) {
      await local6(arg1 => {
        if (local5(arg1)) {
          return false;
        }
        if (local7(arg1) && !set5.has(buildSelfWarmupEventSeenKey(arg1))) {
          return false;
        }
        return true;
      });
      result5.filter(arg1 => String(arg1.accountId) === String(arg2) && local7(arg1) && !set4.has(arg1.id) && !set5.has(buildSelfWarmupEventSeenKey(arg1))).forEach(arg12 => {
        arg12.actionStatus = "skipped";
        arg12.actionSummary = "当前无未读红点，不自动回复";
        fn7(arg1, (arg12.nickname || "私信会话") + " 当前无未读红点，不自动回复", "info");
        set4.add(arg12.id);
        list3.push(arg12);
        const result = buildSelfWarmupEventSeenKey(arg12);
        set.add(result);
        result4.push(result);
        const result2 = result5.findIndex(arg1 => buildSelfWarmupEventSeenKey(arg1) === result);
        if (result2 >= 0) {
          result5.splice(result2, 1);
        }
        arg5.appendEventRecord(arg1, arg12);
      });
    }
    saveSeenKeys(store, arg1, result4);
    savePendingEvents(store, arg1, result5);
    if (!list3.length) {
      fn7(arg1, "账号 " + (local.nickname || local.name || arg2) + " 本轮无新互动", "info");
      const result2 = fn100([]);
      arg5.incrementStats(arg1, result2);
      fn17(arg1, {
        type: "stats-update",
        statsDelta: result2,
        ts: Date.now()
      });
      await fn35(result, arg3);
      return {
        events: 0,
        matched: 0,
        incomplete: flag
      };
    }
    const result7 = list3.filter(arg1 => list2.includes(arg1));
    const result8 = await fn99(arg1, arg3, result7);
    list3.forEach(arg12 => {
      arg5.appendEventRecord(arg1, arg12);
      fn17(arg1, {
        type: "event",
        event: arg12,
        ts: Date.now()
      });
    });
    const value2 = list3.filter(arg1 => (arg1.actionsTaken || []).length > 0).length;
    const result9 = fn100(list2, result8, value2);
    arg5.incrementStats(arg1, result9);
    fn17(arg1, {
      type: "stats-update",
      statsDelta: result9,
      ts: Date.now()
    });
    if (list2.length) {
      fn7(arg1, formatNewEventsDiscoveryLog(local.nickname || local.name || arg2, list2), "success");
    } else if (list3.length) {
      fn7(arg1, "账号 " + (local.nickname || local.name || arg2) + " 已处理 " + list3.length + " 条待重试互动", "info");
    }
    await fn35(result, arg3);
    return {
      events: list2.length,
      matched: list2.filter(arg1 => arg1.matched).length,
      incomplete: flag
    };
  }
  function fn104(options = {}) {
    let result = Number(options.intervalSecondsMin);
    let result2 = Number(options.intervalSecondsMax);
    if (!Number.isFinite(result)) {
      result = 60;
    }
    if (!Number.isFinite(result2)) {
      result2 = 120;
    }
    if (result > result2) {
      [result, result2] = [result2, result];
    }
    result = Math.max(20, Math.floor(result));
    result2 = Math.max(result, Math.floor(result2));
    return {
      min: result,
      max: result2
    };
  }
  function fn105(arg1) {
    const {
      min: min,
      max: max
    } = fn104(arg1);
    const value = Math.floor(Math.random() * (max - min + 1)) + min;
    return value * 1000;
  }
  async function fn106(arg1) {
    const result = map.get(arg1);
    if (!result || result.running) {
      return;
    }
    result.running = true;
    try {
      const {
        config: config,
        accounts: accounts,
        selfWarmupTasksApi: selfWarmupTasksApi
      } = result;
      const local = config.selectedAccounts || [];
      let num = 0;
      let num2 = 0;
      let flag = false;
      fn7(arg1, "开始第 " + ((selfWarmupTasksApi.findTaskById(arg1)?.stats?.checks || 0) + 1) + " 轮自动回复检查", "info");
      for (const item of local) {
        if (!map.has(arg1)) {
          break;
        }
        const local = accounts.find(arg1 => String(arg1.id) === String(item)) || {
          id: item
        };
        try {
          const result = await fn16(item, arg1, () => fn103(arg1, item, config, accounts, selfWarmupTasksApi));
          num += result?.events || 0;
          num2 += result?.matched || 0;
          flag = flag || !!result?.incomplete;
        } catch (error) {
          flag = true;
          fn7(arg1, "账号 " + (local.nickname || local.name || item) + " 检查异常：" + error.message, "error");
          if (error?.code === "self_warmup_navigation_timeout" || map2.get(String(item))?.isDestroyed?.()) {
            fn7(arg1, "自热页面响应异常，正在重建后台窗口后继续其他账号", "warning");
            try {
              await fn32(local);
            } catch (error) {
              fn7(arg1, "自热窗口重建失败：" + error.message, "error");
            }
          }
        }
      }
      if (num > 0) {
        fn7(arg1, "本轮检查完成：处理 " + num + " 条通知", "success");
      } else if (flag) {
        fn7(arg1, "本轮检查完成：部分页面未就绪，状态已保留并将在下轮继续检查", "warning");
      } else {
        fn7(arg1, "本轮检查完成：无新通知", "info");
      }
      fn17(arg1, {
        type: "cycle-done",
        ts: Date.now()
      });
    } catch (error) {
      fn7(arg1, "轮询异常：" + error.message, "error");
    } finally {
      if (map.has(arg1)) {
        map.get(arg1).running = false;
      }
    }
  }
  function fn107(arg1) {
    if (!arg1?.timer) {
      return;
    }
    clearTimeout(arg1.timer);
    arg1.timer = null;
  }
  function fn108() {
    if (local3 || map.size === 0) {
      return;
    }
    local3 = setInterval(() => {
      const result = Date.now();
      fn9();
      for (const [local, local2] of map.entries()) {
        if (local2.running || local2.triggering || !local2.nextRunAt) {
          continue;
        }
        if (result < local2.nextRunAt + num10) {
          continue;
        }
        fn109(local, "watchdog").catch(arg1 => {
          fn7(local, "到点守护补触发失败：" + (arg1.message || arg1), "error");
        });
      }
    }, num9);
  }
  function fn110() {
    if (map.size > 0 || !local3) {
      return;
    }
    clearInterval(local3);
    local3 = null;
  }
  function fn111(arg1, arg2, text = "poll") {
    const result = map.get(arg1);
    if (!result) {
      return false;
    }
    fn107(result);
    const result2 = Math.max(0, Math.floor(Number(arg2) || 0));
    const result3 = Date.now();
    result.scheduledAt = result3;
    result.plannedDelayMs = result2;
    result.nextRunAt = result3 + result2;
    result.scheduleKind = text;
    result.timer = setTimeout(() => {
      const result = map.get(arg1);
      if (result) {
        result.timer = null;
      }
      fn109(arg1, "timer").catch(arg12 => {
        fn7(arg1, "检查定时器触发异常：" + (arg12.message || arg12), "error");
      });
    }, result2);
    fn108();
    return true;
  }
  function fn112(arg1) {
    const result = map.get(arg1);
    if (!result?.nextRunAt || result.running || result.triggering) {
      return false;
    }
    fn107(result);
    const result2 = Math.max(0, result.nextRunAt - Date.now());
    result.timer = setTimeout(() => {
      const result = map.get(arg1);
      if (result) {
        result.timer = null;
      }
      fn109(arg1, "timer").catch(arg12 => {
        fn7(arg1, "检查定时器触发异常：" + (arg12.message || arg12), "error");
      });
    }, result2);
    fn108();
    return true;
  }
  async function fn109(arg1, text = "timer") {
    const result = map.get(arg1);
    if (!result || result.running || result.triggering) {
      return false;
    }
    result.triggering = true;
    fn107(result);
    const local = Number(result.nextRunAt) || Date.now();
    const result2 = Math.max(0, Date.now() - local);
    const local3 = result.scheduleKind || "poll";
    result.nextRunAt = null;
    result.scheduledAt = null;
    result.plannedDelayMs = null;
    result.scheduleKind = null;
    const result3 = (result2 / 1000).toFixed(result2 >= 1000 ? 1 : 2);
    if (local3 === "initial") {
      fn7(arg1, "首次检查定时器已触发（误差 " + result3 + " 秒），开始执行", "info");
    } else if (text === "watchdog") {
      fn7(arg1, "到点守护检测到检查已到期，延迟 " + result3 + " 秒后补触发", "warning");
    } else if (text === "system-resume") {
      fn7(arg1, "系统恢复后发现检查已到期，延迟 " + result3 + " 秒后立即补触发", "warning");
    } else if (text === "app-focus") {
      fn7(arg1, "回到前台后发现检查已到期，延迟 " + result3 + " 秒后立即补触发", "warning");
    } else if (result2 >= num11) {
      fn7(arg1, "检查定时器延迟 " + result3 + " 秒后触发，开始本轮", "warning");
    }
    acquireTaskRuntimeGuard(local2(arg1), {
      type: "self-warmup",
      taskId: arg1
    });
    fn9();
    try {
      await fn106(arg1);
      return true;
    } finally {
      const result2 = map.get(arg1);
      if (result2 === result) {
        result2.triggering = false;
        fn113(arg1);
      }
    }
  }
  function fn113(arg1) {
    const result = map.get(arg1);
    if (!result) {
      return;
    }
    const {
      min: min,
      max: max
    } = fn104(result.config);
    const result2 = fn105(result.config);
    fn7(arg1, "下次检查约 " + Math.round(result2 / 1000) + " 秒后（区间 " + min + "-" + max + "s 随机）", "info");
    fn111(arg1, result2, "poll");
  }
  function fn114(text = "system-resume") {
    const result = Date.now();
    let num = 0;
    fn9();
    for (const [local, local3] of map.entries()) {
      acquireTaskRuntimeGuard(local2(local), {
        type: "self-warmup",
        taskId: local
      });
      if (local3.running || local3.triggering || !local3.nextRunAt) {
        continue;
      }
      if (local3.nextRunAt <= result) {
        num += 1;
        fn109(local, text).catch(arg1 => {
          fn7(local, "调度补触发失败（" + text + "）：" + (arg1.message || arg1), "error");
        });
        continue;
      }
      const flag = !local3.timer;
      if (flag || text === "system-resume") {
        fn112(local);
        num += 1;
        if (text === "system-resume") {
          fn7(local, "系统恢复，检查计划仍有效，将在约 " + Math.ceil((local3.nextRunAt - result) / 1000) + " 秒后开始下一轮", "info");
        } else if (flag) {
          fn7(local, "检测到检查定时器丢失，已重建，约 " + Math.ceil((local3.nextRunAt - result) / 1000) + " 秒后开始下一轮", "warning");
        }
      }
    }
    return num;
  }
  function handleSystemResume() {
    return fn114("system-resume");
  }
  function handleAppFocus() {
    return fn114("app-focus");
  }
  function startTask(arg1, arg2, arg3) {
    const value = arg1.id;
    stopTask(value);
    const local = arg1.configSnapshot || {};
    const {
      min: min,
      max: max
    } = fn104(local);
    map.set(value, {
      timer: null,
      config: local,
      accounts: arg2,
      selfWarmupTasksApi: arg3,
      running: false,
      triggering: false,
      scheduledAt: null,
      plannedDelayMs: null,
      nextRunAt: null,
      scheduleKind: null,
      actionLimitState: createAccountActionLimitStore(local, ACCOUNT_ACTION_LIMIT_SPECS, (arg2 || []).map(arg1 => arg1?.id).filter(Boolean)),
      actionLimitReachedLogged: new Set()
    });
    acquireTaskRuntimeGuard(local2(value), {
      type: "self-warmup",
      taskId: value
    });
    fn7(value, "自热互动已启动，检查间隔 " + min + "-" + max + " 秒（每轮随机）", "success");
    const result = formatAccountActionLimitSummary(map.get(value).actionLimitState);
    const result2 = Object.values(map.get(value).actionLimitState?.template?.limits || {}).some(arg1 => arg1?.enabled);
    fn7(value, result2 ? "动作数量限制：" + result : "动作数量限制：全部不限（未开启「单账号限制数量」）", "info");
    fn7(value, "私信策略：" + (local.excludeGroupChats !== false ? "排除群聊" : "包含群聊") + "；评论回复/主页私信/私信回复失败后约 10 秒重试 1 次", "info");
    fn7(value, "回复内容：评论使用" + (resolveSelfWarmupContentMode(local, false) === "ai" ? "AI 生成" : "自定义模板") + "；私信使用" + (resolveSelfWarmupContentMode(local, true) === "ai" ? "AI 生成" : "固定话术"), "info");
    fn111(value, 3000, "initial");
    fn108();
    return true;
  }
  function stopTask(arg1) {
    const result = map.get(arg1);
    if (!result) {
      return false;
    }
    fn107(result);
    map.delete(arg1);
    for (const [local, local2] of map5.entries()) {
      if (local2.taskId === arg1) {
        map5.delete(local);
      }
    }
    releaseTaskRuntimeGuard(local2(arg1));
    fn7(arg1, "自热互动已停止", "info");
    fn110();
    if (map.size === 0) {
      destroyWarmupWindows();
    }
    return true;
  }
  function stopAll() {
    [...map.keys()].forEach(arg1 => stopTask(arg1));
    destroyWarmupWindows();
  }
  function updateTaskConfig(arg1, arg2) {
    const result = map.get(arg1);
    if (!result) {
      return false;
    }
    result.config = arg2 || {};
    result.actionLimitState = fn3(result);
    result.actionLimitReachedLogged = new Set();
    fn7(arg1, "动作数量限制已按新配置重置：" + formatAccountActionLimitSummary(result.actionLimitState), "info");
    return true;
  }
  async function showTaskWindow(arg1, text = "") {
    const result = map.get(arg1);
    if (!result) {
      return {
        success: false,
        msg: "该自热互动任务未在运行"
      };
    }
    const value = Array.isArray(result.config?.selectedAccounts) ? result.config.selectedAccounts : [];
    const value2 = text ? value.filter(arg1 => String(arg1) === String(text)) : value;
    if (!value2.length) {
      return {
        success: false,
        msg: "任务没有可监控账号"
      };
    }
    let num = 0;
    for (const item of value2) {
      const local = result.accounts.find(arg1 => String(arg1.id) === String(item)) || {
        id: item
      };
      try {
        let result = map2.get(String(item));
        if (!result || result.isDestroyed()) {
          result = await fn29(local);
        }
        const result2 = showHiddenAutomationWindow(result, {
          title: "自热互动监控 - " + (local.nickname || local.name || item),
          width: 1280,
          height: 820
        });
        if (result2) {
          fn8(result, true);
          num += 1;
        }
        const result3 = String(result.webContents?.getURL?.() || "");
        if (!result3 || /^about:blank$/i.test(result3) || !/douyin\.com/i.test(result3)) {
          fn24(result, "https://www.douyin.com/jingxuan").catch(arg1 => {
            console.warn("[SelfWarmup] 监控窗口补载首页失败 " + item + ":", arg1?.message || arg1);
          });
        }
      } catch (error) {
        console.warn("[SelfWarmup] 打开监控窗口失败 " + item + ":", error?.message || error);
      }
    }
    if (num <= 0) {
      return {
        success: false,
        msg: "打开监控窗口失败"
      };
    }
    fn7(arg1, num > 1 ? "已打开运行监控窗口（" + num + " 个账号）" : "已打开账号监控窗口", "info");
    return {
      success: true,
      shown: num,
      accountId: String(value2[0])
    };
  }
  function hideTaskWindow(arg1, text = "") {
    const result = map.get(arg1);
    const value = Array.isArray(result?.config?.selectedAccounts) ? result.config.selectedAccounts : [];
    const value2 = text ? [String(text)] : value.length ? value.map(String) : [...map2.keys()];
    let num = 0;
    for (const item of value2) {
      const result = map2.get(String(item));
      if (!result || result.isDestroyed()) {
        continue;
      }
      if (hideVisibleAutomationWindow(result)) {
        fn14(result);
        num += 1;
      }
    }
    return {
      success: true,
      hidden: num
    };
  }
  function listRunningTaskIds() {
    return [...map.keys()].map(String);
  }
  function listWebContents() {
    return [...map2.values()].filter(arg1 => arg1 && !arg1.isDestroyed()).map(arg1 => arg1.webContents).filter(arg1 => arg1 && !arg1.isDestroyed?.());
  }
  return {
    startTask: startTask,
    stopTask: stopTask,
    stopAll: stopAll,
    updateTaskConfig: updateTaskConfig,
    showTaskWindow: showTaskWindow,
    hideTaskWindow: hideTaskWindow,
    destroyWarmupWindows: destroyWarmupWindows,
    handleSystemResume: handleSystemResume,
    handleAppFocus: handleAppFocus,
    listWebContents: listWebContents,
    listRunningTaskIds: listRunningTaskIds,
    getTaskLogs: getTaskLogs,
    getAllTaskLogs: getAllTaskLogs,
    clearTaskLogs: clearTaskLogs
  };
}
module.exports = {
  createSelfWarmupRunner: createSelfWarmupRunner
};
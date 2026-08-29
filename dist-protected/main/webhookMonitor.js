'use strict';

const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const axios = require("axios");
const {
  app,
  BrowserWindow,
  ipcMain
} = require("electron");
function createWebhookMonitor(arg1) {
  const {
    store: store,
    getMainWindow: getMainWindow,
    getApiBase: getApiBase,
    radarDeviceHeaders: radarDeviceHeaders,
    getRobustDeviceID: getRobustDeviceID,
    autoLogin: autoLogin,
    handleAiResponse: handleAiResponse,
    isFatalAiAuthError: isFatalAiAuthError,
    acquireTaskRuntimeGuard: acquireTaskRuntimeGuard,
    releaseTaskRuntimeGuard: releaseTaskRuntimeGuard,
    applyPackagedWindowMenuPolicy: applyPackagedWindowMenuPolicy,
    attachProtocolGuard: attachProtocolGuard,
    configureAutomationSession: configureAutomationSession,
    applyAccountProxy: applyAccountProxy,
    runtimeConfig: runtimeConfig
  } = arg1;
  let local = null;
  let local2 = null;
  function sendMonitorLog(arg1, arg2, text = "info") {
    const result = new Date().toLocaleTimeString();
    const local = (store.get("taskSettings")?.accounts || []).find(arg12 => String(arg12.id) === String(arg1)) || {};
    const local2 = local.nickname || local.name || "账号" + arg1;
    console.log("[Monitor][" + arg1 + "] " + arg2);
    const result2 = getMainWindow();
    if (result2 && !result2.isDestroyed()) {
      result2.webContents.send("monitor-log", {
        accountId: arg1,
        accountName: local2,
        message: arg2,
        level: text,
        timestamp: result
      });
    }
  }
  function signDingtalkUrl(arg1, arg2) {
    if (!arg2) {
      return arg1;
    }
    const result = Date.now();
    const value = result + "\n" + arg2;
    const result2 = crypto.createHmac("sha256", arg2).update(value).digest("base64");
    const result3 = encodeURIComponent(result2);
    const value2 = arg1.includes("?") ? "&" : "?";
    return "" + arg1 + value2 + "timestamp=" + result + "&sign=" + result3;
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
  function isMonitorAccountAiEnabled(arg1, arg2) {
    const local = arg1.accountPersonas?.[arg2];
    return !!local && local !== "none";
  }
  function isMonitorAiIntentJudgeEnabled(options = {}) {
    const local = options?.useAiJudge;
    return local === true || local === 1 || local === "true";
  }
  async function analyzeCommentWithAI(arg1, arg2) {
    try {
      let result = store.get("auth_token");
      const result2 = getRobustDeviceID();
      const result3 = await axios.post(getApiBase() + "/radar/analyze", {
        title: arg1,
        content: arg2
      }, {
        headers: radarDeviceHeaders(result, result2)
      });
      if (result3.data.code === 200) {
        return result3.data.data;
      }
    } catch (error) {
      console.error("[Monitor] AI analysis failed:", error.message);
    }
    return null;
  }
  function matchKeywords(arg1, arg2) {
    if (!arg2 || !arg2.trim()) {
      return true;
    }
    const result = arg2.split(/[,，]/).map(arg1 => arg1.trim()).filter(Boolean);
    if (result.length === 0) {
      return true;
    }
    const result2 = (arg1 || "").toLowerCase();
    return result.some(arg1 => result2.includes(arg1.toLowerCase()));
  }
  function pickRandomTemplateLine(arg1) {
    const result = String(arg1 || "").split("\n").map(arg1 => arg1.trim()).filter(Boolean);
    if (result.length === 0) {
      return "";
    }
    return result[Math.floor(Math.random() * result.length)];
  }
  function resolveMonitorPersonaIntent(arg1, arg2) {
    const local = arg1?.accountPersonas?.[arg2];
    if (!local || local === "none") {
      return "";
    }
    const value = Array.isArray(arg1.personas) ? arg1.personas : [];
    const result = value.find(arg1 => arg1.id === local);
    if (!result) {
      return "";
    }
    if (result.prompt) {
      return result.prompt;
    }
    const local2 = result.purpose || result.goal || "寻找潜在客户";
    return "身份: " + (result.role || "专业营销人员") + "; 目的: " + local2 + "; 要求: " + (result.style || "专业、真诚");
  }
  function findMatchedKeyword(arg1, arg2) {
    if (!arg2 || !arg2.trim()) {
      return "";
    }
    const result = arg2.split(/[,，]/).map(arg1 => arg1.trim()).filter(Boolean);
    const result2 = (arg1 || "").toLowerCase();
    return result.find(arg1 => result2.includes(arg1.toLowerCase())) || "";
  }
  function normalizeRadarAnalyzeResult(arg1) {
    if (!arg1) {
      return {
        matched: false,
        matchType: "ai",
        reason: "AI 无返回结果",
        intent: "low",
        replyContent: "",
        aiResult: null
      };
    }
    const result = String(arg1.intent || arg1.intention || "low").toLowerCase();
    const local = result === "high" || result === "medium";
    const local2 = String(arg1.reason || arg1.thought || "").trim() || (local ? "意向 " + result : "意向 " + result + "，不符合跟进条件");
    return {
      matched: local,
      matchType: "ai",
      reason: local2,
      intent: result,
      replyContent: String(arg1.reply || arg1.reply_content || "").trim(),
      aiResult: {
        ...arg1,
        intention: result,
        reason: local2
      }
    };
  }
  function mapCommentDecisionToEvaluations(arg1, list = []) {
    return arg1.map((arg1, arg2) => {
      const local = list[arg2] || {};
      const local2 = local.decision || "ignore";
      const local3 = local2 === "reply" || local2 === "both";
      const result = String(local.aiThought || local.thought || "").trim();
      const local4 = result || (local3 ? "人设匹配，建议互动" : "AI 判定为低意向或无需回复");
      return {
        matched: local3,
        matchType: "ai",
        reason: local4,
        intent: local3 ? "high" : "low",
        replyContent: String(local.replyContent || "").trim(),
        aiResult: {
          intention: local3 ? "high" : "low",
          thought: result,
          reply_content: local.replyContent || ""
        }
      };
    });
  }
  async function postMonitorCommentDecisionBatch(arg1, arg2, arg3, arg4, arg5, options = {}) {
    let result = store.get("auth_token");
    const result2 = getRobustDeviceID();
    const local = options.aiScene || "";
    const value = local === "self_warmup" ? "self_warmup" : "";
    const result3 = arg5.map(arg1 => ({
      videoTitle: arg2?.title || "",
      nickname: arg1?.nickname || "",
      content: arg1?.text || "",
      videoUrl: arg2?.url || "",
      userUrl: arg1?.userUrl || "",
      accountName: arg4?.nickname || arg4?.name || ""
    }));
    const local2 = async arg12 => axios.post(getApiBase() + "/radar/ai/v2/comment-decision", {
      intent: arg1,
      video_title: arg2?.title || "监控视频",
      keywords: arg3.keywords || "",
      accountName: arg4?.nickname || arg4?.name || "",
      leads: result3,
      ...(value ? {
        generationMode: value
      } : {})
    }, {
      headers: radarDeviceHeaders(arg12, result2),
      timeout: 300000
    });
    let local3;
    try {
      local3 = await local2(result);
    } catch (error) {
      if (error.response?.status === 401) {
        await autoLogin();
        result = store.get("auth_token");
        local3 = await local2(result);
      } else {
        throw error;
      }
    }
    const result4 = handleAiResponse(local3);
    if (!result4.success) {
      throw new Error(result4.msg || "AI 批量研判失败");
    }
    return mapCommentDecisionToEvaluations(arg5, result4.data || []);
  }
  async function analyzeMonitorCommentsRadarBatch(arg1, arg2, num = 5) {
    const list = [];
    for (let num2 = 0; num2 < arg2.length; num2 += num) {
      const result = arg2.slice(num2, num2 + num);
      const result2 = await Promise.all(result.map(async arg12 => {
        const result = await analyzeCommentWithAI(arg1, arg12.text);
        return normalizeRadarAnalyzeResult(result);
      }));
      list.push(...result2);
    }
    return list;
  }
  async function analyzeMonitorCommentsBatch(arg1, arg2, arg3, arg4, arg5, options = {}) {
    const {
      onLog: onLog,
      onRetry: onRetry,
      aiScene = ""
    } = options;
    if (!Array.isArray(arg5) || arg5.length === 0) {
      return [];
    }
    const result = isMonitorAiIntentJudgeEnabled(arg1);
    const result2 = isMonitorAccountAiEnabled(arg1, arg2);
    if (result && (result2 || aiScene === "self_warmup")) {
      const value = result2 ? resolveMonitorPersonaIntent(arg1, arg2) : "身份: 短视频账号运营者; 目的: 维护自己作品评论、评论回复和私信里的有效互动; 要求: 只跟进真实问题、合作咨询、认真反馈和有沟通价值的互动，跳过无意义寒暄、广告和低价值内容";
      if (!value) {
        throw new Error("账号未绑定智能体，无法使用 AI 研判");
      }
      const num = 10;
      const list = [];
      const num2 = 10000;
      for (let num3 = 0; num3 < arg5.length; num3 += num) {
        const result = arg5.slice(num3, num3 + num);
        const value2 = Math.floor(num3 / num) + 1;
        const result2 = Math.ceil(arg5.length / num);
        if (typeof onLog === "function") {
          onLog((aiScene === "self_warmup" ? "AI 自动回复研判" : "AI 批量人设研判") + " 第 " + value2 + "/" + result2 + " 批（" + result.length + " 条）…");
        }
        let num4 = 0;
        while (true) {
          num4 += 1;
          try {
            const result2 = await postMonitorCommentDecisionBatch(value, arg4, arg1, arg3, result, {
              aiScene: aiScene
            });
            list.push(...result2);
            break;
          } catch (error) {
            const local = error.response?.data?.msg || error.message || "未知错误";
            if (isFatalAiAuthError(local)) {
              throw new Error(local);
            }
            if (typeof onRetry === "function") {
              onRetry(num4, local);
            }
            await new Promise(arg1 => setTimeout(arg1, num2));
          }
        }
      }
      return list;
    }
    if (result) {
      if (typeof onLog === "function") {
        onLog("AI 批量研判 " + arg5.length + " 条评论（并行）…");
      }
      return analyzeMonitorCommentsRadarBatch(arg4?.title || "监控视频", arg5);
    }
    return arg5.map(arg12 => {
      const result = matchKeywords(arg12.text, arg1.keywords);
      const result2 = findMatchedKeyword(arg12.text, arg1.keywords);
      return {
        matched: result,
        matchType: "keyword",
        reason: result ? result2 ? "命中关键词「" + result2 + "」" : "命中关键词规则" : "未命中设置的关键词",
        replyContent: "",
        aiResult: null
      };
    });
  }
  async function generateMonitorPersonaContent(arg1, arg2, arg3, arg4, arg5, {
    forDm = false,
    onRetry = null,
    aiScene = ""
  } = {}) {
    const result = resolveMonitorPersonaIntent(arg1, arg2);
    if (!result) {
      throw new Error("账号未绑定智能体，无法使用 AI 生成");
    }
    const value = forDm ? result + "；请生成一条适合私信该用户的简短话术（口语化、自然，勿像硬广）" : result;
    const value2 = aiScene === "self_warmup" ? forDm ? "self_warmup_dm" : "self_warmup_reply" : "keyword_reply_only";
    const num = 10000;
    let num2 = 0;
    while (true) {
      num2 += 1;
      try {
        let result = store.get("auth_token");
        const result2 = getRobustDeviceID();
        const local = async arg12 => axios.post(getApiBase() + "/radar/ai/v2/comment-decision", {
          intent: value,
          video_title: arg4?.title || "监控视频",
          keywords: arg1.keywords || "",
          accountName: arg3?.nickname || arg3?.name || "",
          generationMode: value2,
          leads: [{
            videoTitle: arg4?.title || "",
            nickname: arg5?.nickname || "",
            content: arg5?.text || "",
            videoUrl: arg4?.url || "",
            userUrl: arg5?.userUrl || "",
            accountName: arg3?.nickname || arg3?.name || "",
            chatHistory: arg5?.chatHistory || ""
          }]
        }, {
          headers: radarDeviceHeaders(arg12, result2),
          timeout: 300000
        });
        let local2;
        try {
          local2 = await local(result);
        } catch (error) {
          if (error.response?.status === 401) {
            await autoLogin();
            result = store.get("auth_token");
            local2 = await local(result);
          } else {
            throw error;
          }
        }
        const result3 = handleAiResponse(local2);
        const result4 = String(result3.data?.[0]?.replyContent || "").trim();
        if (result3.success && result4) {
          return result4;
        }
        throw new Error(result3.msg || "AI 未返回有效话术");
      } catch (error) {
        const local = error.response?.data?.msg || error.message || "未知错误";
        if (isFatalAiAuthError(local)) {
          throw new Error(local);
        }
        console.warn("[MonitorTask] AI 话术第 " + num2 + " 次未成功: " + local + "，" + num / 1000 + "s 后重试");
        if (typeof onRetry === "function") {
          onRetry(num2, local);
        }
        await new Promise(arg1 => setTimeout(arg1, num));
      }
    }
  }
  async function fn17(arg1, arg2, arg3, arg4) {
    const result = store.get("monitor_notified_keys", []);
    const list = [...result];
    const local = (store.get("taskSettings")?.accounts || []).find(arg12 => String(arg12.id) === String(arg1)) || {
      name: "主账号"
    };
    const local2 = local.nickname || local.name || "主账号";
    for (const item of arg2) {
      let text = "";
      let text2 = "";
      const value = item.text;
      if (value.includes("关注了你") || value.includes("开始关注你")) {
        if (!arg3.watchFollows) {
          continue;
        }
        text = "follow";
        text2 = "👤 收到关注";
      } else if (value.includes("赞了你的作品") || value.includes("赞了你的评论") || value.includes("赞了你的视频") || value.includes("点赞")) {
        if (!arg3.watchLikes) {
          continue;
        }
        text = "like";
        text2 = "❤️ 收到点赞";
      } else if (value.includes("回复了你") || value.includes("回复了你的评论") || value.includes("评论了你的")) {
        if (!arg3.watchReplies) {
          continue;
        }
        const result = isMonitorAccountAiEnabled(arg3, arg1);
        if (!result && !matchKeywords(value, arg3.keywords)) {
          console.log("[Monitor] 评论回复 \"" + value + "\" 未匹配关键词且账号未分配 AI，跳过推送");
          continue;
        }
        text = "reply";
        text2 = "💭 评论回复";
      } else {
        continue;
      }
      const value2 = arg1 + "_" + text + "_" + item.nickname + "_" + value;
      if (result.includes(value2)) {
        continue;
      }
      list.push(value2);
      arg4.push({
        accountId: arg1,
        accountName: local2,
        eventType: text,
        titleLabel: text2,
        nickname: item.nickname,
        userUrl: item.userUrl,
        text: value,
        time: item.time || new Date().toLocaleTimeString()
      });
    }
    if (list.length > 2000) {
      store.set("monitor_notified_keys", list.slice(-2000));
    } else {
      store.set("monitor_notified_keys", list);
    }
  }
  async function fn18(arg1, arg2, arg3, arg4) {
    if (!arg3.watchMessages) {
      return;
    }
    const result = store.get("monitor_notified_keys", []);
    const list = [...result];
    const local = (store.get("taskSettings")?.accounts || []).find(arg12 => String(arg12.id) === String(arg1)) || {
      name: "主账号"
    };
    const local2 = local.nickname || local.name || "主账号";
    for (const item of arg2) {
      const result2 = isMonitorAccountAiEnabled(arg3, arg1);
      if (!result2 && !matchKeywords(item.msg, arg3.keywords)) {
        console.log("[Monitor] 私信消息 \"" + item.msg + "\" 未匹配关键词且账号未分配 AI，跳过推送");
        continue;
      }
      const value = arg1 + "_message_" + item.nickname + "_" + item.msg;
      if (result.includes(value)) {
        continue;
      }
      list.push(value);
      arg4.push({
        accountId: arg1,
        accountName: local2,
        eventType: "message",
        titleLabel: "💬 收到私信",
        nickname: item.nickname,
        text: item.msg,
        time: new Date().toLocaleTimeString(),
        unread: item.unread
      });
    }
    if (list.length > 2000) {
      store.set("monitor_notified_keys", list.slice(-2000));
    } else {
      store.set("monitor_notified_keys", list);
    }
  }
  async function fn19(arg1, arg2, arg3, arg4, arg5) {
    if (!arg4.watchNewLeads) {
      return;
    }
    const result = store.get("monitor_notified_keys", []);
    const list = [...result];
    const local = (store.get("taskSettings")?.accounts || []).find(arg12 => String(arg12.id) === String(arg1)) || {
      name: "主账号"
    };
    const local2 = local.nickname || local.name || "主账号";
    for (const item of arg3) {
      const value = arg1 + "_newLead_" + arg2.url + "_" + item.nickname + "_" + item.text;
      if (result.includes(value)) {
        continue;
      }
      const result2 = isMonitorAccountAiEnabled(arg4, arg1);
      let local = null;
      if (result2) {
        const local2 = arg4.accountPersonas?.[arg1];
        console.log("[Monitor] 账号 " + arg1 + " 已分配智能人设 (" + local2 + ")，正在对新评论进行 AI 意向分析: " + item.text);
        local = await analyzeCommentWithAI(arg2.title || "监控视频", item.text);
        if (!local || local.intention !== "high" && local.intention !== "medium") {
          console.log("[Monitor] 线索 \"" + item.text + "\" AI分析意向较低 (" + (local?.intention || "无") + "), 跳过推送");
          continue;
        }
      } else if (!matchKeywords(item.text, arg4.keywords)) {
        console.log("[Monitor] 线索 \"" + item.text + "\" 未匹配关键词且账号未分配 AI，跳过推送");
        continue;
      }
      list.push(value);
      arg5.push({
        accountId: arg1,
        accountName: local2,
        eventType: "newLead",
        titleLabel: "🔍 发现新线索",
        nickname: item.nickname,
        userUrl: item.userUrl,
        text: item.text,
        time: item.time || new Date().toLocaleTimeString(),
        videoTitle: arg2.title,
        videoUrl: arg2.url,
        aiResult: local
      });
    }
    if (list.length > 2000) {
      store.set("monitor_notified_keys", list.slice(-2000));
    } else {
      store.set("monitor_notified_keys", list);
    }
  }
  async function checkAccountMonitor(arg1, arg2, arg3) {
    console.log("[Monitor] 开始检查账号: " + arg1);
    sendMonitorLog(arg1, "🔍 开始检查账号...", "info");
    const value = "douyin_" + arg1;
    let result = path.join(__dirname, "..", "automation-preload.js");
    if (app.isPackaged) {
      const result2 = store.get("latest_resource_path");
      if (result2 && fs.existsSync(path.join(result2, "automation-preload.js"))) {
        result = path.join(result2, "automation-preload.js");
      }
    }
    const browserWindow = new BrowserWindow({
      width: 1020,
      height: 800,
      show: false,
      x: -3000,
      y: -3000,
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
        preload: result,
        spellcheck: false
      },
      autoHideMenuBar: true
    });
    applyPackagedWindowMenuPolicy(browserWindow);
    attachProtocolGuard(browserWindow.webContents, "legacy-monitor:" + value);
    browserWindow.webContents.setWindowOpenHandler(() => ({
      action: "deny"
    }));
    configureAutomationSession(browserWindow.webContents.session, value);
    const local = arg2.accountProxies?.[arg1] || arg2.accounts?.find(arg12 => arg12.id === arg1)?.proxy;
    await applyAccountProxy(browserWindow.webContents.session, local, value);
    try {
      await runtimeConfig.ensureFetched();
      runtimeConfig.pushToWebContents(browserWindow.webContents);
    } catch (error) {}
    const result2 = store.get("system_video_muted", true);
    browserWindow.webContents.setAudioMuted(result2);
    console.log("[Monitor][" + value + "] 初始静音状态: " + result2);
    sendMonitorLog(arg1, "🔇 静音模式: " + (result2 ? "已开启" : "已关闭"), "info");
    try {
      const local = arg2.watchLikes || arg2.watchFollows || arg2.watchReplies;
      const value2 = arg2.watchMessages;
      if (local || value2) {
        console.log("[Monitor][" + value + "] 正在加载抖音首页...");
        sendMonitorLog(arg1, "📱 正在加载抖音首页...", "info");
        await browserWindow.loadURL("https://www.douyin.com/");
        await new Promise(arg1 => setTimeout(arg1, 6000));
        try {
          runtimeConfig.pushToWebContents(browserWindow.webContents);
        } catch (error) {}
        const result = await browserWindow.webContents.executeJavaScript("(() => {\n                    const loginBtn = document.querySelector('[data-e2e=\"header-login-container\"]') || \n                                     Array.from(document.querySelectorAll('button, div')).find(el => el.innerText && el.innerText.includes('登录'));\n                    return loginBtn ? 'NOT_LOGGED_IN' : 'LOGGED_IN';\n                })()");
        if (result === "NOT_LOGGED_IN") {
          console.warn("[Monitor][" + value + "] 账号未登录，跳过该账号的通知/私信检查");
          sendMonitorLog(arg1, "⚠️ 账号未登录，跳过通知/私信检查", "warning");
        } else {
          sendMonitorLog(arg1, "✅ 账号已登录", "success");
          if (local) {
            console.log("[Monitor][" + value + "] 正在抓取系统通知...");
            sendMonitorLog(arg1, "🔔 正在抓取系统通知...", "info");
            const result = await browserWindow.webContents.executeJavaScript("(() => {\n                            try {\n                                const bell = Array.from(document.querySelectorAll('#douyin-header-menuCt li, #douyin-header-menuCt div, [data-e2e=\"something-button\"]')).find(el => el.innerText && el.innerText.includes('通知')) ||\n                                             document.querySelector('[data-e2e=\"notification-entry\"]') ||\n                                             document.querySelector('#douyin-header-menuCt ul.KrOwwuLZ .Ng3vbSwy.mRpT0Jfh') ||\n                                             document.querySelector('.Ng3vbSwy.mRpT0Jfh');\n                                if (!bell) return null;\n                                const rect = bell.getBoundingClientRect();\n                                return {\n                                    x: Math.round(rect.left + rect.width / 2),\n                                    y: Math.round(rect.top + rect.height / 2)\n                                };\n                            } catch (e) {\n                                return null;\n                            }\n                        })()");
            if (!result) {
              console.warn("[Monitor][" + value + "] 抓取通知失败: Bell icon not found");
              sendMonitorLog(arg1, "❌ 抓取通知失败: Bell icon not found", "error");
            } else {
              browserWindow.webContents.sendInputEvent({
                type: "mouseMove",
                x: result.x,
                y: result.y
              });
              await new Promise(arg1 => setTimeout(arg1, 500));
              browserWindow.webContents.sendInputEvent({
                type: "mouseDown",
                x: result.x,
                y: result.y,
                button: "left",
                clickCount: 1
              });
              browserWindow.webContents.sendInputEvent({
                type: "mouseUp",
                x: result.x,
                y: result.y,
                button: "left",
                clickCount: 1
              });
              await new Promise(arg1 => setTimeout(arg1, 3000));
              const result2 = await browserWindow.webContents.executeJavaScript("(async () => {\n                                try {\n                                    const popover = document.querySelector('[data-e2e=\"listDlgTest-container\"]') || \n                                                    document.querySelector('.SrFKhBVP') ||\n                                                    document.querySelector('.y7JV7Z6q') ||\n                                                    document.querySelector('[class*=\"popover\"]') ||\n                                                    document.querySelector('.semi-popover-content');\n                                    if (!popover) return { success: false, error: 'Popover container not found' };\n                                    \n                                    const rows = Array.from(popover.querySelectorAll(\n                                        '.SrFKhBVP > div, ' +\n                                        '[data-e2e=\"listDlgTest-container\"] ul > li, ' +\n                                        '.SrFKhBVP [class*=\"item\"], ' +\n                                        'div.jWk7ojn7.I_GURp8z, ' +\n                                        'li'\n                                    ));\n                                    const notifications = [];\n                                    rows.forEach(row => {\n                                        const userLink = row.querySelector('a[href*=\"/user/\"]') || row.querySelector('a[href*=\"douyin.com/user/\"]');\n                                        const userUrl = userLink ? userLink.href : '';\n                                        const nickname = userLink ? userLink.innerText.trim() : '未知用户';\n                                        \n                                        const textEl = row.querySelector('[data-e2e=\"notification-text\"]') ||\n                                                       row.querySelector('div.uWltsBYg') || \n                                                       row.querySelector('[class*=\"content\"]') || \n                                                       row.querySelector('[class*=\"text\"]') ||\n                                                       row.querySelector('pre');\n                                        let text = textEl ? textEl.innerText.trim() : row.innerText.trim();\n                                        \n                                        const timeEl = row.querySelector('div.Yt8hlEul') || \n                                                       row.querySelector('[class*=\"time\"]') || \n                                                       row.querySelector('[class*=\"date\"]');\n                                        const time = timeEl ? timeEl.innerText.trim() : '';\n                                        \n                                        // Strip the timestamp from the end of the text if it got duplicated\n                                        if (time && text.endsWith(time)) {\n                                            text = text.substring(0, text.length - time.length).trim();\n                                        }\n                                        \n                                        if (nickname && text) {\n                                            notifications.push({ nickname, userUrl, text, time });\n                                        }\n                                    });\n                                    return { success: true, notifications };\n                                } catch (e) {\n                                    return { success: false, error: e.message };\n                                }\n                            })()");
              if (result2.success && result2.notifications) {
                console.log("[Monitor][" + value + "] 成功抓取到 " + result2.notifications.length + " 条通知");
                sendMonitorLog(arg1, "✅ 成功抓取 " + result2.notifications.length + " 条通知", result2.notifications.length > 0 ? "success" : "info");
                await fn17(arg1, result2.notifications, arg2, arg3);
              } else {
                console.warn("[Monitor][" + value + "] 抓取通知失败:", result2.error);
                sendMonitorLog(arg1, "❌ 抓取通知失败: " + result2.error, "error");
              }
            }
          }
          if (value2) {
            console.log("[Monitor][" + value + "] 正在抓取私信消息...");
            sendMonitorLog(arg1, "💬 正在抓取私信消息...", "info");
            const result = await browserWindow.webContents.executeJavaScript("(() => {\n                            try {\n                                const chat = document.querySelector('[data-e2e=\"im-entry\"]') || \n                                             Array.from(document.querySelectorAll('#douyin-header-menuCt li, #douyin-header-menuCt div')).find(el => el.innerText && el.innerText.includes('私信'));\n                                if (!chat) return null;\n                                const rect = chat.getBoundingClientRect();\n                                return {\n                                    x: Math.round(rect.left + rect.width / 2),\n                                    y: Math.round(rect.top + rect.height / 2)\n                                };\n                            } catch (e) {\n                                return null;\n                            }\n                        })()");
            if (!result) {
              console.warn("[Monitor][" + value + "] 抓取私信失败: Chat icon not found");
              sendMonitorLog(arg1, "❌ 抓取私信失败: Chat icon not found", "error");
            } else {
              browserWindow.webContents.sendInputEvent({
                type: "mouseMove",
                x: result.x,
                y: result.y
              });
              await new Promise(arg1 => setTimeout(arg1, 500));
              browserWindow.webContents.sendInputEvent({
                type: "mouseDown",
                x: result.x,
                y: result.y,
                button: "left",
                clickCount: 1
              });
              browserWindow.webContents.sendInputEvent({
                type: "mouseUp",
                x: result.x,
                y: result.y,
                button: "left",
                clickCount: 1
              });
              await new Promise(arg1 => setTimeout(arg1, 3000));
              const result2 = await browserWindow.webContents.executeJavaScript("(async () => {\n                                try {\n                                    const popover = document.querySelector('#imSaasContainerId') ||\n                                                    document.querySelector('[class*=\"popover\"]') || \n                                                    document.querySelector('[class*=\"dialog\"]') || \n                                                    document.querySelector('.semi-popover-content') || \n                                                    document.querySelector('[data-e2e=\"im-entry\"] + div');\n                                    if (!popover) return { success: false, error: 'Chat popover not found' };\n                                    \n                                    const rows = Array.from(popover.querySelectorAll(\n                                        '[data-e2e=\"conversation-item\"], ' +\n                                        '[class*=\"item\"], ' +\n                                        '[class*=\"session\"], ' +\n                                        'li'\n                                    ));\n                                    const dms = [];\n                                    rows.forEach(row => {\n                                        const nicknameEl = row.querySelector('[class*=\"title\"]') ||\n                                                           row.querySelector('[class*=\"name\"]') || \n                                                           row.querySelector('p');\n                                        const nickname = nicknameEl ? nicknameEl.innerText.trim() : '';\n                                        \n                                        const msgEl = row.querySelector('pre') ||\n                                                      row.querySelector('[class*=\"message\"]') || \n                                                      row.querySelector('[class*=\"content\"]') || \n                                                      row.querySelector('span');\n                                        const msg = msgEl ? msgEl.innerText.trim() : '';\n                                        \n                                        const badgeEl = row.querySelector('[class*=\"UnRead\"]') ||\n                                                        row.querySelector('[class*=\"badge\"]') || \n                                                        row.querySelector('[class*=\"count\"]');\n                                        const unread = badgeEl ? badgeEl.innerText.trim() : '';\n                                        \n                                        if (nickname && msg) {\n                                            dms.push({ nickname, msg, unread });\n                                        }\n                                    });\n                                    return { success: true, dms };\n                                } catch (e) {\n                                    return { success: false, error: e.message };\n                                }\n                            })()");
              if (result2.success && result2.dms) {
                console.log("[Monitor][" + value + "] 成功抓取到 " + result2.dms.length + " 条私信会话");
                sendMonitorLog(arg1, "✅ 成功抓取 " + result2.dms.length + " 条私信会话", result2.dms.length > 0 ? "success" : "info");
                await fn18(arg1, result2.dms, arg2, arg3);
              } else {
                console.warn("[Monitor][" + value + "] 抓取私信失败:", result2.error);
                sendMonitorLog(arg1, "❌ 抓取私信失败: " + result2.error, "error");
              }
            }
          }
        }
      }
      if (arg2.watchNewLeads && arg2.videoUrls && arg2.videoUrls.length > 0) {
        console.log("[Monitor][" + value + "] 开启视频新线索监控, 视频数: " + arg2.videoUrls.length);
        sendMonitorLog(arg1, "🎬 开始监控 " + arg2.videoUrls.length + " 个视频的新线索...", "info");
        for (const item of arg2.videoUrls) {
          try {
            console.log("[Monitor][" + value + "] 正在加载视频页: " + item.url);
            await browserWindow.loadURL(item.url);
            await new Promise(arg1 => setTimeout(arg1, 8000));
            const result = await browserWindow.webContents.executeJavaScript("(async () => {\n                            try {\n                                // 等待页面完全加载\n                                await new Promise(resolve => setTimeout(resolve, 2000));\n                                \n                                // 尝试点击评论区切换按钮（如果存在）\n                                const commentTab = Array.from(document.querySelectorAll('div, span')).find(el => {\n                                    const text = el.innerText ? el.innerText.trim() : '';\n                                    return text.startsWith('评论') && text.length < 15;\n                                });\n                                if (commentTab) {\n                                    commentTab.click();\n                                    await new Promise(resolve => setTimeout(resolve, 2000));\n                                }\n                                \n                                // 使用与 automation-preload.js 一致的选择器\n                                // commentPanel: '.comment-mainContent, [data-e2e=\"comment-list\"], [class*=\"CommentList\"]'\n                                let commentList = document.querySelector('.comment-mainContent') || \n                                                document.querySelector('[data-e2e=\"comment-list\"]') ||\n                                                document.querySelector('[class*=\"CommentList\"]');\n                                \n                                if (!commentList) {\n                                    // 尝试通过评论项反向查找容器\n                                    const firstComment = document.querySelector('[data-e2e=\"comment-item\"]');\n                                    if (firstComment) {\n                                        commentList = firstComment.parentElement;\n                                    }\n                                }\n                                \n                                if (!commentList) {\n                                    return { success: false, error: 'Comment list container not found' };\n                                }\n                                \n                                // 使用与 automation-preload.js 一致的选择器\n                                // commentItem: '[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], div[class*=\"comment-item\"], div[class*=\"reply-item\"]'\n                                const commentNodes = commentList.querySelectorAll('[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], div[class*=\"comment-item\"], div[class*=\"reply-item\"]');\n                                const comments = [];\n                                commentNodes.forEach(node => {\n                                    const userLink = node.querySelector('a[href*=\"/user/\"]');\n                                    const userUrl = userLink ? userLink.href : '';\n                                    const nickname = userLink ? userLink.innerText.trim() : '未知用户';\n                                    \n                                    const textEl = node.querySelector('[data-e2e=\"comment-content\"]') || node.querySelector('span[class*=\"comment-text\"]') || node.querySelector('[class*=\"content\"]');\n                                    const text = textEl ? textEl.innerText.trim() : '';\n                                    \n                                    const timeEl = node.querySelector('[class*=\"time\"]') || node.querySelector('[class*=\"date\"]') || node.querySelector('span[class*=\"time\"]');\n                                    const time = timeEl ? timeEl.innerText.trim() : '';\n                                    \n                                    if (nickname && text) {\n                                        comments.push({ nickname, userUrl, text, time });\n                                    }\n                                });\n                                return { success: true, comments };\n                            } catch (e) {\n                                return { success: false, error: e.message };\n                            }\n                        })()");
            if (result.success && result.comments) {
              console.log("[Monitor][" + value + "] 视频 " + (item.title || "") + " 抓取到 " + result.comments.length + " 条评论");
              await fn19(arg1, item, result.comments, arg2, arg3);
            } else {
              console.warn("[Monitor][" + value + "] 抓取视频评论失败:", result.error);
            }
          } catch (error) {
            console.error("[Monitor][" + value + "] 监控单个视频时异常:", error.message);
          }
        }
      }
    } catch (error) {
      console.error("[Monitor][" + value + "] 监控检查中发生未捕获异常:", error.message);
      sendMonitorLog(arg1, "❌ 检查过程发生异常: " + error.message, "error");
    } finally {
      browserWindow.destroy();
      console.log("[Monitor] 账号: " + arg1 + " 检查完成，后台窗口已销毁");
      sendMonitorLog(arg1, "✅ 账号检查完成", "success");
    }
  }
  async function pushConsolidatedEvents(arg1, arg2) {
    if (!arg2 || !arg2.webhookUrl) {
      return;
    }
    const result = getMainWindow();
    if (arg1.length === 1) {
      const value = arg1[0];
      let text = "";
      if (value.eventType === "like") {
        text = "**监控账号**: " + value.accountName + "\n**用户**: [" + value.nickname + "](" + (value.userUrl || "javascript:;") + ")\n**内容**: " + value.text + "\n**时间**: " + value.time;
      } else if (value.eventType === "follow") {
        text = "**监控账号**: " + value.accountName + "\n**粉丝**: [" + value.nickname + "](" + (value.userUrl || "javascript:;") + ")\n**时间**: " + value.time;
      } else if (value.eventType === "reply") {
        text = "**监控账号**: " + value.accountName + "\n**回复用户**: [" + value.nickname + "](" + (value.userUrl || "javascript:;") + ")\n**回复内容**: " + value.text + "\n**时间**: " + value.time;
      } else if (value.eventType === "message") {
        text = "**监控账号**: " + value.accountName + "\n**会话用户**: " + value.nickname + "\n**最后私信**: " + value.text + "\n**未读消息**: " + (value.unread ? value.unread + "条未读" : "最新") + "\n**时间**: " + value.time;
      } else if (value.eventType === "newLead") {
        text = "**监控账号**: " + value.accountName + "\n**视频**: [" + (value.videoTitle || "点此查看") + "](" + value.videoUrl + ")\n**评论用户**: [" + value.nickname + "](" + (value.userUrl || "javascript:;") + ")\n**评论内容**: " + value.text + "\n**时间**: " + value.time;
        if (value.aiResult) {
          const value2 = value.aiResult.intention === "high" ? "🔴 高意向" : value.aiResult.intention === "medium" ? "🟡 中意向" : "⚪ 低意向";
          text += "\n\n**🤖 AI 分析结果**:\n**意向等级**: " + value2 + "\n**分析依据**: " + (value.aiResult.thought || "无") + "\n**推荐回复**: " + (value.aiResult.reply_content || "无");
        }
      }
      const obj = {
        title: "📡 获客雷达 - 收到新" + value.titleLabel.substring(2),
        content: text,
        time: new Date().toLocaleString(),
        eventType: value.eventType
      };
      try {
        const result2 = buildWebhookPayload(arg2.webhookType, obj);
        let value2 = arg2.webhookUrl;
        if (arg2.webhookType === "dingtalk" && arg2.webhookSecret) {
          value2 = signDingtalkUrl(value2, arg2.webhookSecret);
        }
        const result3 = await axios.post(value2, result2, {
          timeout: 10000
        });
        const result4 = isWebhookResponseSuccess(arg2.webhookType, result3);
        if (result && !result.isDestroyed()) {
          result.webContents.send("monitor-push-result", {
            type: value.eventType,
            content: value.text || value.titleLabel,
            success: result4
          });
        }
      } catch (error) {
        console.error("[Monitor] Single item webhook failed:", error.message);
        if (result && !result.isDestroyed()) {
          result.webContents.send("monitor-push-result", {
            type: value.eventType,
            content: value.text || value.titleLabel,
            success: false
          });
        }
      }
      return;
    }
    let value = "📡 **获客雷达 - 定时监控汇总报告**\n此次检查共抓取到 **" + arg1.length + "** 项新动态：\n\n---\n";
    const obj = {
      newLead: [],
      message: [],
      reply: [],
      follow: [],
      like: []
    };
    arg1.forEach(arg1 => {
      if (obj[arg1.eventType]) {
        obj[arg1.eventType].push(arg1);
      }
    });
    if (obj.newLead.length > 0) {
      value += "### 🔍 新线索 (" + obj.newLead.length + ")\n";
      obj.newLead.forEach((arg1, arg2) => {
        value += arg2 + 1 + ". **监控账号**: " + arg1.accountName + "\n";
        value += "   - **视频**: [" + (arg1.videoTitle || "点此查看") + "](" + arg1.videoUrl + ")\n";
        value += "   - **评论用户**: [" + arg1.nickname + "](" + (arg1.userUrl || "javascript:;") + ")\n";
        value += "   - **评论内容**: " + arg1.text + "\n";
        if (arg1.aiResult) {
          const value2 = arg1.aiResult.intention === "high" ? "🔴 高意向" : arg1.aiResult.intention === "medium" ? "🟡 中意向" : "⚪ 低意向";
          value += "   - **🤖 AI分析**: " + value2 + " | 依据: " + (arg1.aiResult.thought || "无") + "\n";
          value += "   - **推荐回复**: " + (arg1.aiResult.reply_content || "无") + "\n";
        }
        value += "   - **时间**: " + arg1.time + "\n\n";
      });
      value += "---\n";
    }
    if (obj.message.length > 0) {
      value += "### 💬 收到新私信 (" + obj.message.length + ")\n";
      obj.message.forEach((arg1, arg2) => {
        value += arg2 + 1 + ". **监控账号**: " + arg1.accountName + "\n";
        value += "   - **会话用户**: " + arg1.nickname + "\n";
        value += "   - **最后消息**: " + arg1.text + "\n";
        value += "   - **时间**: " + arg1.time + "\n\n";
      });
      value += "---\n";
    }
    if (obj.reply.length > 0) {
      value += "### 💭 评论回复 (" + obj.reply.length + ")\n";
      obj.reply.forEach((arg1, arg2) => {
        value += arg2 + 1 + ". **监控账号**: " + arg1.accountName + "\n";
        value += "   - **用户**: [" + arg1.nickname + "](" + (arg1.userUrl || "javascript:;") + ")\n";
        value += "   - **回复内容**: " + arg1.text + "\n";
        value += "   - **时间**: " + arg1.time + "\n\n";
      });
      value += "---\n";
    }
    if (obj.follow.length > 0) {
      value += "### 👤 收到关注 (" + obj.follow.length + ")\n";
      obj.follow.forEach(arg1 => {
        value += "- **监控账号**: " + arg1.accountName + " | **粉丝**: [" + arg1.nickname + "](" + (arg1.userUrl || "javascript:;") + ") | 时间: " + arg1.time + "\n";
      });
      value += "\n---\n";
    }
    if (obj.like.length > 0) {
      value += "### ❤️ 收到点赞 (" + obj.like.length + ")\n";
      obj.like.forEach(arg1 => {
        value += "- **监控账号**: " + arg1.accountName + " | **用户**: [" + arg1.nickname + "](" + (arg1.userUrl || "javascript:;") + ") | **动作**: " + arg1.text + " | 时间: " + arg1.time + "\n";
      });
      value += "\n---\n";
    }
    const obj2 = {
      title: "📡 获客雷达 - 定时监控汇总报告",
      content: value,
      time: new Date().toLocaleString(),
      eventType: "consolidated"
    };
    try {
      const result2 = buildWebhookPayload(arg2.webhookType, obj2);
      let value = arg2.webhookUrl;
      if (arg2.webhookType === "dingtalk" && arg2.webhookSecret) {
        value = signDingtalkUrl(value, arg2.webhookSecret);
      }
      const result3 = await axios.post(value, result2, {
        timeout: 10000
      });
      const result4 = isWebhookResponseSuccess(arg2.webhookType, result3);
      if (result && !result.isDestroyed()) {
        arg1.forEach(arg1 => {
          result.webContents.send("monitor-push-result", {
            type: arg1.eventType,
            content: "[已合并推送] " + arg1.nickname + ": " + (arg1.text || arg1.titleLabel),
            success: result4
          });
        });
      }
    } catch (error) {
      console.error("[Monitor] Consolidated webhook push failed:", error.message);
      if (result && !result.isDestroyed()) {
        arg1.forEach(arg1 => {
          result.webContents.send("monitor-push-result", {
            type: arg1.eventType,
            content: "[合并推送失败] " + arg1.nickname + ": " + (arg1.text || arg1.titleLabel),
            success: false
          });
        });
      }
    }
  }
  async function executeMonitorCheck() {
    const result = getMainWindow();
    if (!local2 || !result || result.isDestroyed()) {
      return;
    }
    console.log("[Monitor] 执行定时检查...");
    const value = (local2.accountIds || []).length;
    sendMonitorLog("system", "🚀 开始新一轮监控检查 (共 " + value + " 个账号)", "info");
    const result2 = new Date(Date.now() + (local2.intervalMinutes || 10) * 60 * 1000).toLocaleTimeString();
    result.webContents.send("monitor-status-update", {
      running: true,
      nextCheck: result2
    });
    const local = local2.accountIds || [];
    const list = [];
    for (const item of local) {
      try {
        await checkAccountMonitor(item, local2, list);
      } catch (error) {
        console.error("[Monitor] 检查账号 " + item + " 时发生错误:", error.message);
      }
    }
    if (list.length > 0) {
      console.log("[Monitor] 检查完成，共抓取到 " + list.length + " 条新动态，开始整合推送...");
      sendMonitorLog("system", "📤 发现 " + list.length + " 条新动态，正在推送...", "success");
      await pushConsolidatedEvents(list, local2);
    } else {
      console.log("[Monitor] 检查完成，无新动态需要推送");
      sendMonitorLog("system", "✓ 检查完成，暂无新动态", "info");
    }
  }
  function buildWebhookPayload(arg1, arg2) {
    if (arg1 === "feishu") {
      return {
        msg_type: "interactive",
        card: {
          header: {
            title: {
              tag: "plain_text",
              content: arg2.title || "📡 获客雷达通知"
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
            tag: "note",
            elements: [{
              tag: "plain_text",
              content: "⏰ " + (arg2.time || new Date().toLocaleString())
            }]
          }]
        }
      };
    } else if (arg1 === "dingtalk") {
      return {
        msgtype: "markdown",
        markdown: {
          title: arg2.title || "📡 获客雷达通知",
          text: "### " + (arg2.title || "获客雷达通知") + "\n\n" + (arg2.content || "") + "\n\n> ⏰ " + (arg2.time || new Date().toLocaleString())
        }
      };
    } else {
      return {
        event: arg2.eventType || "notification",
        title: arg2.title || "获客雷达通知",
        content: arg2.content || "",
        timestamp: Date.now(),
        data: arg2.extra || {}
      };
    }
  }
  function registerIpc() {
    ipcMain.handle("get-monitor-status", () => {
      return !!local;
    });
    ipcMain.handle("test-webhook", async (arg1, {
      type: type,
      url: url,
      secret: secret
    }) => {
      try {
        const result = buildWebhookPayload(type, {
          title: "🔔 Webhook 连接测试",
          content: "恭喜！您的 Webhook 配置正确，消息推送功能已就绪。",
          time: new Date().toLocaleString()
        });
        let local = url;
        if (type === "dingtalk" && secret) {
          local = signDingtalkUrl(url, secret);
        }
        const result2 = await axios.post(local, result, {
          timeout: 10000
        });
        if (result2.status === 200) {
          if (result2.data) {
            if (result2.data.errcode !== undefined && result2.data.errcode !== 0) {
              return {
                success: false,
                message: "机器人错误: " + result2.data.errmsg + " (" + result2.data.errcode + ")"
              };
            }
            if (result2.data.code !== undefined && type === "feishu" && result2.data.code !== 0) {
              return {
                success: false,
                message: "机器人错误: " + (result2.data.msg || result2.data.message) + " (" + result2.data.code + ")"
              };
            }
          }
          return {
            success: true,
            message: "发送成功"
          };
        }
        return {
          success: false,
          message: "HTTP " + result2.status
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "网络错误"
        };
      }
    });
    ipcMain.on("start-monitor", (arg1, arg2) => {
      local2 = arg2;
      if (local) {
        clearInterval(local);
      }
      const value = (arg2.intervalMinutes || 10) * 60 * 1000;
      console.log("[Monitor] 启动定时监控, 间隔: " + arg2.intervalMinutes + "分钟");
      local = setInterval(() => executeMonitorCheck(), value);
      acquireTaskRuntimeGuard("legacy-monitor", {
        type: "legacy-monitor",
        intervalMs: value
      });
      setTimeout(() => executeMonitorCheck(), 3000);
    });
    ipcMain.on("stop-monitor", () => {
      if (local) {
        clearInterval(local);
        local = null;
      }
      local2 = null;
      releaseTaskRuntimeGuard("legacy-monitor");
      console.log("[Monitor] 定时监控已停止");
      const result = getMainWindow();
      const result2 = BrowserWindow.getAllWindows();
      result2.forEach(arg1 => {
        if (!arg1.isDestroyed() && arg1 !== result) {
          const value = arg1.webContents.session.partition;
          if (value && value.includes("persist:automation:")) {
            console.log("[Monitor] 销毁监控窗口: " + value);
            arg1.destroy();
          }
        }
      });
      if (result && !result.isDestroyed()) {
        result.webContents.send("monitor-status-update", {
          running: false
        });
      }
    });
  }
  return {
    registerIpc: registerIpc,
    analyzeCommentWithAI: analyzeCommentWithAI,
    analyzeMonitorCommentsBatch: analyzeMonitorCommentsBatch,
    analyzeMonitorCommentsRadarBatch: analyzeMonitorCommentsRadarBatch,
    generateMonitorPersonaContent: generateMonitorPersonaContent,
    matchKeywords: matchKeywords,
    isMonitorAccountAiEnabled: isMonitorAccountAiEnabled,
    isMonitorAiIntentJudgeEnabled: isMonitorAiIntentJudgeEnabled,
    pickRandomTemplateLine: pickRandomTemplateLine,
    resolveMonitorPersonaIntent: resolveMonitorPersonaIntent,
    findMatchedKeyword: findMatchedKeyword,
    normalizeRadarAnalyzeResult: normalizeRadarAnalyzeResult,
    mapCommentDecisionToEvaluations: mapCommentDecisionToEvaluations,
    postMonitorCommentDecisionBatch: postMonitorCommentDecisionBatch,
    checkAccountMonitor: checkAccountMonitor,
    executeMonitorCheck: executeMonitorCheck,
    pushConsolidatedEvents: pushConsolidatedEvents,
    buildWebhookPayload: buildWebhookPayload,
    signDingtalkUrl: signDingtalkUrl,
    isWebhookResponseSuccess: isWebhookResponseSuccess,
    sendMonitorLog: sendMonitorLog,
    getMonitorTimer: () => local,
    getMonitorConfig: () => local2
  };
}
module.exports = {
  createWebhookMonitor: createWebhookMonitor
};
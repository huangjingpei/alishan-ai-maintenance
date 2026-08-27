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
function createWebhookMonitor(_0x22b4c2) {
  const {
    store: _0x2f2822,
    getMainWindow: _0x3a9bce,
    getApiBase: _0x2145c9,
    radarDeviceHeaders: _0x241174,
    getRobustDeviceID: _0xf591d,
    autoLogin: _0x24422d,
    handleAiResponse: _0x581c81,
    isFatalAiAuthError: _0x5da8ee,
    acquireTaskRuntimeGuard: _0xb171cb,
    releaseTaskRuntimeGuard: _0x199696,
    applyPackagedWindowMenuPolicy: _0x1b8588,
    attachProtocolGuard: _0x278a7c,
    configureAutomationSession: _0x27671d,
    applyAccountProxy: _0x4c1092,
    runtimeConfig: _0x2f1a11
  } = _0x22b4c2;
  let _0x23f53c = null;
  let _0x333105 = null;
  function _0x13520b(_0x32c921, _0x20315d, _0x2139e7 = "info") {
    const _0x29dea4 = new Date().toLocaleTimeString();
    const _0x101ca6 = (_0x2f2822.get("taskSettings")?.accounts || []).find(_0x1b2731 => String(_0x1b2731.id) === String(_0x32c921)) || {};
    const _0x5e6484 = _0x101ca6.nickname || _0x101ca6.name || "账号" + _0x32c921;
    console.log("[Monitor][" + _0x32c921 + "] " + _0x20315d);
    const _0xd43e13 = _0x3a9bce();
    if (_0xd43e13 && !_0xd43e13.isDestroyed()) {
      _0xd43e13.webContents.send("monitor-log", {
        accountId: _0x32c921,
        accountName: _0x5e6484,
        message: _0x20315d,
        level: _0x2139e7,
        timestamp: _0x29dea4
      });
    }
  }
  function _0x57225f(_0x59769c, _0x1017c2) {
    if (!_0x1017c2) {
      return _0x59769c;
    }
    const _0x222e2f = Date.now();
    const _0x49e5fd = _0x222e2f + "\n" + _0x1017c2;
    const _0x111d40 = crypto.createHmac("sha256", _0x1017c2).update(_0x49e5fd).digest("base64");
    const _0x3d9e88 = encodeURIComponent(_0x111d40);
    const _0x5ca4f4 = _0x59769c.includes("?") ? "&" : "?";
    return "" + _0x59769c + _0x5ca4f4 + "timestamp=" + _0x222e2f + "&sign=" + _0x3d9e88;
  }
  function _0x3ca056(_0x57cde3, _0x159c8e) {
    if (!_0x159c8e || _0x159c8e.status !== 200) {
      return false;
    }
    if (_0x159c8e.data) {
      if (_0x159c8e.data.errcode !== undefined && _0x159c8e.data.errcode !== 0) {
        return false;
      }
      if (_0x159c8e.data.code !== undefined && _0x57cde3 === "feishu" && _0x159c8e.data.code !== 0) {
        return false;
      }
    }
    return true;
  }
  function _0x3a5140(_0x2ddc04, _0x51e85f) {
    const _0x440f25 = _0x2ddc04.accountPersonas?.[_0x51e85f];
    return !!_0x440f25 && _0x440f25 !== "none";
  }
  function _0x3f3942(_0x1c17d4 = {}) {
    const _0x26570a = _0x1c17d4?.useAiJudge;
    return _0x26570a === true || _0x26570a === 1 || _0x26570a === "true";
  }
  async function _0x4c94ef(_0x124367, _0x1083f3) {
    try {
      let _0x284303 = _0x2f2822.get("auth_token");
      const _0x260f4d = _0xf591d();
      const _0x5b1d6e = await axios.post(_0x2145c9() + "/radar/analyze", {
        title: _0x124367,
        content: _0x1083f3
      }, {
        headers: _0x241174(_0x284303, _0x260f4d)
      });
      if (_0x5b1d6e.data.code === 200) {
        return _0x5b1d6e.data.data;
      }
    } catch (_0x3864f5) {
      console.error("[Monitor] AI analysis failed:", _0x3864f5.message);
    }
    return null;
  }
  function _0x32796c(_0x20dfdc, _0x54dbd2) {
    if (!_0x54dbd2 || !_0x54dbd2.trim()) {
      return true;
    }
    const _0x134e86 = _0x54dbd2.split(/[,，]/).map(_0x1dc7f0 => _0x1dc7f0.trim()).filter(Boolean);
    if (_0x134e86.length === 0) {
      return true;
    }
    const _0x3a7709 = (_0x20dfdc || "").toLowerCase();
    return _0x134e86.some(_0x156f07 => _0x3a7709.includes(_0x156f07.toLowerCase()));
  }
  function _0x28410b(_0x3eb492) {
    const _0x44957e = String(_0x3eb492 || "").split("\n").map(_0x1426ac => _0x1426ac.trim()).filter(Boolean);
    if (_0x44957e.length === 0) {
      return "";
    }
    return _0x44957e[Math.floor(Math.random() * _0x44957e.length)];
  }
  function _0x547495(_0x192b58, _0xd6bb45) {
    const _0xbb2ed6 = _0x192b58?.accountPersonas?.[_0xd6bb45];
    if (!_0xbb2ed6 || _0xbb2ed6 === "none") {
      return "";
    }
    const _0x7aa12a = Array.isArray(_0x192b58.personas) ? _0x192b58.personas : [];
    const _0x2d845c = _0x7aa12a.find(_0x17a677 => _0x17a677.id === _0xbb2ed6);
    if (!_0x2d845c) {
      return "";
    }
    if (_0x2d845c.prompt) {
      return _0x2d845c.prompt;
    }
    const _0x21ecb0 = _0x2d845c.purpose || _0x2d845c.goal || "寻找潜在客户";
    return "身份: " + (_0x2d845c.role || "专业营销人员") + "; 目的: " + _0x21ecb0 + "; 要求: " + (_0x2d845c.style || "专业、真诚");
  }
  function _0x2ccf9b(_0x10158f, _0xf6475e) {
    if (!_0xf6475e || !_0xf6475e.trim()) {
      return "";
    }
    const _0x463471 = _0xf6475e.split(/[,，]/).map(_0x1377dc => _0x1377dc.trim()).filter(Boolean);
    const _0x115999 = (_0x10158f || "").toLowerCase();
    return _0x463471.find(_0x15fad6 => _0x115999.includes(_0x15fad6.toLowerCase())) || "";
  }
  function _0x3fa67c(_0x1bd93f) {
    if (!_0x1bd93f) {
      return {
        matched: false,
        matchType: "ai",
        reason: "AI 无返回结果",
        intent: "low",
        replyContent: "",
        aiResult: null
      };
    }
    const _0x3f7793 = String(_0x1bd93f.intent || _0x1bd93f.intention || "low").toLowerCase();
    const _0x4e7229 = _0x3f7793 === "high" || _0x3f7793 === "medium";
    const _0x537a5b = String(_0x1bd93f.reason || _0x1bd93f.thought || "").trim() || (_0x4e7229 ? "意向 " + _0x3f7793 : "意向 " + _0x3f7793 + "，不符合跟进条件");
    return {
      matched: _0x4e7229,
      matchType: "ai",
      reason: _0x537a5b,
      intent: _0x3f7793,
      replyContent: String(_0x1bd93f.reply || _0x1bd93f.reply_content || "").trim(),
      aiResult: {
        ..._0x1bd93f,
        intention: _0x3f7793,
        reason: _0x537a5b
      }
    };
  }
  function _0x38a64c(_0x518421, _0x426bc9 = []) {
    return _0x518421.map((_0x28d00e, _0x1da0fc) => {
      const _0x50c835 = _0x426bc9[_0x1da0fc] || {};
      const _0xa9a327 = _0x50c835.decision || "ignore";
      const _0x213159 = _0xa9a327 === "reply" || _0xa9a327 === "both";
      const _0x385590 = String(_0x50c835.aiThought || _0x50c835.thought || "").trim();
      const _0x126ef6 = _0x385590 || (_0x213159 ? "人设匹配，建议互动" : "AI 判定为低意向或无需回复");
      return {
        matched: _0x213159,
        matchType: "ai",
        reason: _0x126ef6,
        intent: _0x213159 ? "high" : "low",
        replyContent: String(_0x50c835.replyContent || "").trim(),
        aiResult: {
          intention: _0x213159 ? "high" : "low",
          thought: _0x385590,
          reply_content: _0x50c835.replyContent || ""
        }
      };
    });
  }
  async function _0x42f13b(_0x45a80a, _0x81561c, _0x5145ed, _0x578990, _0x566f6c, _0x2071b8 = {}) {
    let _0x13499a = _0x2f2822.get("auth_token");
    const _0x4e7f61 = _0xf591d();
    const _0x270a99 = _0x2071b8.aiScene || "";
    const _0x412e52 = _0x270a99 === "self_warmup" ? "self_warmup" : "";
    const _0x21d031 = _0x566f6c.map(_0x3665d0 => ({
      videoTitle: _0x81561c?.title || "",
      nickname: _0x3665d0?.nickname || "",
      content: _0x3665d0?.text || "",
      videoUrl: _0x81561c?.url || "",
      userUrl: _0x3665d0?.userUrl || "",
      accountName: _0x578990?.nickname || _0x578990?.name || ""
    }));
    const _0x1a6b5c = async _0xb7d5d9 => axios.post(_0x2145c9() + "/radar/ai/v2/comment-decision", {
      intent: _0x45a80a,
      video_title: _0x81561c?.title || "监控视频",
      keywords: _0x5145ed.keywords || "",
      accountName: _0x578990?.nickname || _0x578990?.name || "",
      leads: _0x21d031,
      ...(_0x412e52 ? {
        generationMode: _0x412e52
      } : {})
    }, {
      headers: _0x241174(_0xb7d5d9, _0x4e7f61),
      timeout: 300000
    });
    let _0x23c60f;
    try {
      _0x23c60f = await _0x1a6b5c(_0x13499a);
    } catch (_0x48e03d) {
      if (_0x48e03d.response?.status === 401) {
        await _0x24422d();
        _0x13499a = _0x2f2822.get("auth_token");
        _0x23c60f = await _0x1a6b5c(_0x13499a);
      } else {
        throw _0x48e03d;
      }
    }
    const _0x27d24d = _0x581c81(_0x23c60f);
    if (!_0x27d24d.success) {
      throw new Error(_0x27d24d.msg || "AI 批量研判失败");
    }
    return _0x38a64c(_0x566f6c, _0x27d24d.data || []);
  }
  async function _0x549dd8(_0x4eabce, _0x3f2099, _0x583133 = 5) {
    const _0x46c5b0 = [];
    for (let _0x3bb831 = 0; _0x3bb831 < _0x3f2099.length; _0x3bb831 += _0x583133) {
      const _0x5afe69 = _0x3f2099.slice(_0x3bb831, _0x3bb831 + _0x583133);
      const _0x3bf40a = await Promise.all(_0x5afe69.map(async _0x536146 => {
        const _0x3159fd = await _0x4c94ef(_0x4eabce, _0x536146.text);
        return _0x3fa67c(_0x3159fd);
      }));
      _0x46c5b0.push(..._0x3bf40a);
    }
    return _0x46c5b0;
  }
  async function _0x596d0c(_0xb1ebbe, _0x400868, _0x43d773, _0x291d8e, _0x1f7ac7, _0x16b01e = {}) {
    const {
      onLog: _0x437267,
      onRetry: _0x49e482,
      aiScene = ""
    } = _0x16b01e;
    if (!Array.isArray(_0x1f7ac7) || _0x1f7ac7.length === 0) {
      return [];
    }
    const _0x261d26 = _0x3f3942(_0xb1ebbe);
    const _0x11e85c = _0x3a5140(_0xb1ebbe, _0x400868);
    if (_0x261d26 && (_0x11e85c || aiScene === "self_warmup")) {
      const _0x537a26 = _0x11e85c ? _0x547495(_0xb1ebbe, _0x400868) : "身份: 短视频账号运营者; 目的: 维护自己作品评论、评论回复和私信里的有效互动; 要求: 只跟进真实问题、合作咨询、认真反馈和有沟通价值的互动，跳过无意义寒暄、广告和低价值内容";
      if (!_0x537a26) {
        throw new Error("账号未绑定智能体，无法使用 AI 研判");
      }
      const _0x3c9fbb = 10;
      const _0xb49710 = [];
      const _0x14ac86 = 10000;
      for (let _0x3503a7 = 0; _0x3503a7 < _0x1f7ac7.length; _0x3503a7 += _0x3c9fbb) {
        const _0x23d183 = _0x1f7ac7.slice(_0x3503a7, _0x3503a7 + _0x3c9fbb);
        const _0x541bfe = Math.floor(_0x3503a7 / _0x3c9fbb) + 1;
        const _0x40914e = Math.ceil(_0x1f7ac7.length / _0x3c9fbb);
        if (typeof _0x437267 === "function") {
          _0x437267((aiScene === "self_warmup" ? "AI 自动回复研判" : "AI 批量人设研判") + " 第 " + _0x541bfe + "/" + _0x40914e + " 批（" + _0x23d183.length + " 条）…");
        }
        let _0x390a9a = 0;
        while (true) {
          _0x390a9a += 1;
          try {
            const _0x28b17e = await _0x42f13b(_0x537a26, _0x291d8e, _0xb1ebbe, _0x43d773, _0x23d183, {
              aiScene: aiScene
            });
            _0xb49710.push(..._0x28b17e);
            break;
          } catch (_0x2f81f7) {
            const _0x3176d7 = _0x2f81f7.response?.data?.msg || _0x2f81f7.message || "未知错误";
            if (_0x5da8ee(_0x3176d7)) {
              throw new Error(_0x3176d7);
            }
            if (typeof _0x49e482 === "function") {
              _0x49e482(_0x390a9a, _0x3176d7);
            }
            await new Promise(_0xb9a5b1 => setTimeout(_0xb9a5b1, _0x14ac86));
          }
        }
      }
      return _0xb49710;
    }
    if (_0x261d26) {
      if (typeof _0x437267 === "function") {
        _0x437267("AI 批量研判 " + _0x1f7ac7.length + " 条评论（并行）…");
      }
      return _0x549dd8(_0x291d8e?.title || "监控视频", _0x1f7ac7);
    }
    return _0x1f7ac7.map(_0x2e4bb1 => {
      const _0x2d2345 = _0x32796c(_0x2e4bb1.text, _0xb1ebbe.keywords);
      const _0x2ad2d6 = _0x2ccf9b(_0x2e4bb1.text, _0xb1ebbe.keywords);
      return {
        matched: _0x2d2345,
        matchType: "keyword",
        reason: _0x2d2345 ? _0x2ad2d6 ? "命中关键词「" + _0x2ad2d6 + "」" : "命中关键词规则" : "未命中设置的关键词",
        replyContent: "",
        aiResult: null
      };
    });
  }
  async function _0x2fbc71(_0x15baa9, _0x242723, _0x5e8c7a, _0x38b261, _0x137e7d, {
    forDm = false,
    onRetry = null,
    aiScene = ""
  } = {}) {
    const _0x52b1e2 = _0x547495(_0x15baa9, _0x242723);
    if (!_0x52b1e2) {
      throw new Error("账号未绑定智能体，无法使用 AI 生成");
    }
    const _0x43840d = forDm ? _0x52b1e2 + "；请生成一条适合私信该用户的简短话术（口语化、自然，勿像硬广）" : _0x52b1e2;
    const _0xf8fcd0 = aiScene === "self_warmup" ? forDm ? "self_warmup_dm" : "self_warmup_reply" : "keyword_reply_only";
    const _0x39285b = 10000;
    let _0x20a488 = 0;
    while (true) {
      _0x20a488 += 1;
      try {
        let _0x4cf70b = _0x2f2822.get("auth_token");
        const _0x89e8f0 = _0xf591d();
        const _0x319e93 = async _0x983b3b => axios.post(_0x2145c9() + "/radar/ai/v2/comment-decision", {
          intent: _0x43840d,
          video_title: _0x38b261?.title || "监控视频",
          keywords: _0x15baa9.keywords || "",
          accountName: _0x5e8c7a?.nickname || _0x5e8c7a?.name || "",
          generationMode: _0xf8fcd0,
          leads: [{
            videoTitle: _0x38b261?.title || "",
            nickname: _0x137e7d?.nickname || "",
            content: _0x137e7d?.text || "",
            videoUrl: _0x38b261?.url || "",
            userUrl: _0x137e7d?.userUrl || "",
            accountName: _0x5e8c7a?.nickname || _0x5e8c7a?.name || "",
            chatHistory: _0x137e7d?.chatHistory || ""
          }]
        }, {
          headers: _0x241174(_0x983b3b, _0x89e8f0),
          timeout: 300000
        });
        let _0x1e526c;
        try {
          _0x1e526c = await _0x319e93(_0x4cf70b);
        } catch (_0x4772e8) {
          if (_0x4772e8.response?.status === 401) {
            await _0x24422d();
            _0x4cf70b = _0x2f2822.get("auth_token");
            _0x1e526c = await _0x319e93(_0x4cf70b);
          } else {
            throw _0x4772e8;
          }
        }
        const _0x8b5efc = _0x581c81(_0x1e526c);
        const _0x1a011b = String(_0x8b5efc.data?.[0]?.replyContent || "").trim();
        if (_0x8b5efc.success && _0x1a011b) {
          return _0x1a011b;
        }
        throw new Error(_0x8b5efc.msg || "AI 未返回有效话术");
      } catch (_0x34ffb7) {
        const _0x5555b1 = _0x34ffb7.response?.data?.msg || _0x34ffb7.message || "未知错误";
        if (_0x5da8ee(_0x5555b1)) {
          throw new Error(_0x5555b1);
        }
        console.warn("[MonitorTask] AI 话术第 " + _0x20a488 + " 次未成功: " + _0x5555b1 + "，" + _0x39285b / 1000 + "s 后重试");
        if (typeof onRetry === "function") {
          onRetry(_0x20a488, _0x5555b1);
        }
        await new Promise(_0x11395b => setTimeout(_0x11395b, _0x39285b));
      }
    }
  }
  async function _0x298e77(_0x2c8536, _0xccd8c4, _0x5a6dbd, _0x233b98) {
    const _0x4b2939 = _0x2f2822.get("monitor_notified_keys", []);
    const _0x5bd5d6 = [..._0x4b2939];
    const _0x11c842 = (_0x2f2822.get("taskSettings")?.accounts || []).find(_0x281f32 => String(_0x281f32.id) === String(_0x2c8536)) || {
      name: "主账号"
    };
    const _0x53e174 = _0x11c842.nickname || _0x11c842.name || "主账号";
    for (const _0x2760dd of _0xccd8c4) {
      let _0x5042f3 = "";
      let _0x87cb4a = "";
      const _0x32682b = _0x2760dd.text;
      if (_0x32682b.includes("关注了你") || _0x32682b.includes("开始关注你")) {
        if (!_0x5a6dbd.watchFollows) {
          continue;
        }
        _0x5042f3 = "follow";
        _0x87cb4a = "👤 收到关注";
      } else if (_0x32682b.includes("赞了你的作品") || _0x32682b.includes("赞了你的评论") || _0x32682b.includes("赞了你的视频") || _0x32682b.includes("点赞")) {
        if (!_0x5a6dbd.watchLikes) {
          continue;
        }
        _0x5042f3 = "like";
        _0x87cb4a = "❤️ 收到点赞";
      } else if (_0x32682b.includes("回复了你") || _0x32682b.includes("回复了你的评论") || _0x32682b.includes("评论了你的")) {
        if (!_0x5a6dbd.watchReplies) {
          continue;
        }
        const _0x9449f3 = _0x3a5140(_0x5a6dbd, _0x2c8536);
        if (!_0x9449f3 && !_0x32796c(_0x32682b, _0x5a6dbd.keywords)) {
          console.log("[Monitor] 评论回复 \"" + _0x32682b + "\" 未匹配关键词且账号未分配 AI，跳过推送");
          continue;
        }
        _0x5042f3 = "reply";
        _0x87cb4a = "💭 评论回复";
      } else {
        continue;
      }
      const _0x45b1dc = _0x2c8536 + "_" + _0x5042f3 + "_" + _0x2760dd.nickname + "_" + _0x32682b;
      if (_0x4b2939.includes(_0x45b1dc)) {
        continue;
      }
      _0x5bd5d6.push(_0x45b1dc);
      _0x233b98.push({
        accountId: _0x2c8536,
        accountName: _0x53e174,
        eventType: _0x5042f3,
        titleLabel: _0x87cb4a,
        nickname: _0x2760dd.nickname,
        userUrl: _0x2760dd.userUrl,
        text: _0x32682b,
        time: _0x2760dd.time || new Date().toLocaleTimeString()
      });
    }
    if (_0x5bd5d6.length > 2000) {
      _0x2f2822.set("monitor_notified_keys", _0x5bd5d6.slice(-2000));
    } else {
      _0x2f2822.set("monitor_notified_keys", _0x5bd5d6);
    }
  }
  async function _0x28936b(_0xb3e5d, _0x2a7aeb, _0x11fe53, _0x566cc3) {
    if (!_0x11fe53.watchMessages) {
      return;
    }
    const _0x135a63 = _0x2f2822.get("monitor_notified_keys", []);
    const _0x7ce9db = [..._0x135a63];
    const _0x40405a = (_0x2f2822.get("taskSettings")?.accounts || []).find(_0xa980c6 => String(_0xa980c6.id) === String(_0xb3e5d)) || {
      name: "主账号"
    };
    const _0x5f5c3e = _0x40405a.nickname || _0x40405a.name || "主账号";
    for (const _0x232ec1 of _0x2a7aeb) {
      const _0x319666 = _0x3a5140(_0x11fe53, _0xb3e5d);
      if (!_0x319666 && !_0x32796c(_0x232ec1.msg, _0x11fe53.keywords)) {
        console.log("[Monitor] 私信消息 \"" + _0x232ec1.msg + "\" 未匹配关键词且账号未分配 AI，跳过推送");
        continue;
      }
      const _0x6e4e49 = _0xb3e5d + "_message_" + _0x232ec1.nickname + "_" + _0x232ec1.msg;
      if (_0x135a63.includes(_0x6e4e49)) {
        continue;
      }
      _0x7ce9db.push(_0x6e4e49);
      _0x566cc3.push({
        accountId: _0xb3e5d,
        accountName: _0x5f5c3e,
        eventType: "message",
        titleLabel: "💬 收到私信",
        nickname: _0x232ec1.nickname,
        text: _0x232ec1.msg,
        time: new Date().toLocaleTimeString(),
        unread: _0x232ec1.unread
      });
    }
    if (_0x7ce9db.length > 2000) {
      _0x2f2822.set("monitor_notified_keys", _0x7ce9db.slice(-2000));
    } else {
      _0x2f2822.set("monitor_notified_keys", _0x7ce9db);
    }
  }
  async function _0x4f8fe5(_0x228809, _0x5e2904, _0x582b1f, _0x1dc456, _0x50d0a0) {
    if (!_0x1dc456.watchNewLeads) {
      return;
    }
    const _0x13f541 = _0x2f2822.get("monitor_notified_keys", []);
    const _0x5ef9ee = [..._0x13f541];
    const _0x240313 = (_0x2f2822.get("taskSettings")?.accounts || []).find(_0x341a17 => String(_0x341a17.id) === String(_0x228809)) || {
      name: "主账号"
    };
    const _0x27c6d6 = _0x240313.nickname || _0x240313.name || "主账号";
    for (const _0x32690d of _0x582b1f) {
      const _0x4acf73 = _0x228809 + "_newLead_" + _0x5e2904.url + "_" + _0x32690d.nickname + "_" + _0x32690d.text;
      if (_0x13f541.includes(_0x4acf73)) {
        continue;
      }
      const _0x2450d6 = _0x3a5140(_0x1dc456, _0x228809);
      let _0x5e2bb8 = null;
      if (_0x2450d6) {
        const _0x1a2a21 = _0x1dc456.accountPersonas?.[_0x228809];
        console.log("[Monitor] 账号 " + _0x228809 + " 已分配智能人设 (" + _0x1a2a21 + ")，正在对新评论进行 AI 意向分析: " + _0x32690d.text);
        _0x5e2bb8 = await _0x4c94ef(_0x5e2904.title || "监控视频", _0x32690d.text);
        if (!_0x5e2bb8 || _0x5e2bb8.intention !== "high" && _0x5e2bb8.intention !== "medium") {
          console.log("[Monitor] 线索 \"" + _0x32690d.text + "\" AI分析意向较低 (" + (_0x5e2bb8?.intention || "无") + "), 跳过推送");
          continue;
        }
      } else if (!_0x32796c(_0x32690d.text, _0x1dc456.keywords)) {
        console.log("[Monitor] 线索 \"" + _0x32690d.text + "\" 未匹配关键词且账号未分配 AI，跳过推送");
        continue;
      }
      _0x5ef9ee.push(_0x4acf73);
      _0x50d0a0.push({
        accountId: _0x228809,
        accountName: _0x27c6d6,
        eventType: "newLead",
        titleLabel: "🔍 发现新线索",
        nickname: _0x32690d.nickname,
        userUrl: _0x32690d.userUrl,
        text: _0x32690d.text,
        time: _0x32690d.time || new Date().toLocaleTimeString(),
        videoTitle: _0x5e2904.title,
        videoUrl: _0x5e2904.url,
        aiResult: _0x5e2bb8
      });
    }
    if (_0x5ef9ee.length > 2000) {
      _0x2f2822.set("monitor_notified_keys", _0x5ef9ee.slice(-2000));
    } else {
      _0x2f2822.set("monitor_notified_keys", _0x5ef9ee);
    }
  }
  async function _0x397121(_0x47b3f1, _0x4d47c7, _0x592976) {
    console.log("[Monitor] 开始检查账号: " + _0x47b3f1);
    _0x13520b(_0x47b3f1, "🔍 开始检查账号...", "info");
    const _0x4d0e79 = "douyin_" + _0x47b3f1;
    let _0x2d7c85 = path.join(__dirname, "..", "automation-preload.js");
    if (app.isPackaged) {
      const _0x25633b = _0x2f2822.get("latest_resource_path");
      if (_0x25633b && fs.existsSync(path.join(_0x25633b, "automation-preload.js"))) {
        _0x2d7c85 = path.join(_0x25633b, "automation-preload.js");
      }
    }
    const _0x15cd5a = new BrowserWindow({
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
        partition: "persist:automation:" + _0x4d0e79,
        backgroundThrottling: false,
        contextIsolation: true,
        sandbox: false,
        preload: _0x2d7c85,
        spellcheck: false
      },
      autoHideMenuBar: true
    });
    _0x1b8588(_0x15cd5a);
    _0x278a7c(_0x15cd5a.webContents, "legacy-monitor:" + _0x4d0e79);
    _0x15cd5a.webContents.setWindowOpenHandler(() => ({
      action: "deny"
    }));
    _0x27671d(_0x15cd5a.webContents.session, _0x4d0e79);
    const _0xa5684 = _0x4d47c7.accountProxies?.[_0x47b3f1] || _0x4d47c7.accounts?.find(_0x258f54 => _0x258f54.id === _0x47b3f1)?.proxy;
    await _0x4c1092(_0x15cd5a.webContents.session, _0xa5684, _0x4d0e79);
    try {
      await _0x2f1a11.ensureFetched();
      _0x2f1a11.pushToWebContents(_0x15cd5a.webContents);
    } catch (_0x3da7e9) {}
    const _0x1c7247 = _0x2f2822.get("system_video_muted", true);
    _0x15cd5a.webContents.setAudioMuted(_0x1c7247);
    console.log("[Monitor][" + _0x4d0e79 + "] 初始静音状态: " + _0x1c7247);
    _0x13520b(_0x47b3f1, "🔇 静音模式: " + (_0x1c7247 ? "已开启" : "已关闭"), "info");
    try {
      const _0x73fb0c = _0x4d47c7.watchLikes || _0x4d47c7.watchFollows || _0x4d47c7.watchReplies;
      const _0x5ab0e1 = _0x4d47c7.watchMessages;
      if (_0x73fb0c || _0x5ab0e1) {
        console.log("[Monitor][" + _0x4d0e79 + "] 正在加载抖音首页...");
        _0x13520b(_0x47b3f1, "📱 正在加载抖音首页...", "info");
        await _0x15cd5a.loadURL("https://www.douyin.com/");
        await new Promise(_0x217111 => setTimeout(_0x217111, 6000));
        try {
          _0x2f1a11.pushToWebContents(_0x15cd5a.webContents);
        } catch (_0x358352) {}
        const _0x228f5d = await _0x15cd5a.webContents.executeJavaScript("(() => {\n                    const loginBtn = document.querySelector('[data-e2e=\"header-login-container\"]') || \n                                     Array.from(document.querySelectorAll('button, div')).find(el => el.innerText && el.innerText.includes('登录'));\n                    return loginBtn ? 'NOT_LOGGED_IN' : 'LOGGED_IN';\n                })()");
        if (_0x228f5d === "NOT_LOGGED_IN") {
          console.warn("[Monitor][" + _0x4d0e79 + "] 账号未登录，跳过该账号的通知/私信检查");
          _0x13520b(_0x47b3f1, "⚠️ 账号未登录，跳过通知/私信检查", "warning");
        } else {
          _0x13520b(_0x47b3f1, "✅ 账号已登录", "success");
          if (_0x73fb0c) {
            console.log("[Monitor][" + _0x4d0e79 + "] 正在抓取系统通知...");
            _0x13520b(_0x47b3f1, "🔔 正在抓取系统通知...", "info");
            const _0x5515d4 = await _0x15cd5a.webContents.executeJavaScript("(() => {\n                            try {\n                                const bell = Array.from(document.querySelectorAll('#douyin-header-menuCt li, #douyin-header-menuCt div, [data-e2e=\"something-button\"]')).find(el => el.innerText && el.innerText.includes('通知')) ||\n                                             document.querySelector('[data-e2e=\"notification-entry\"]') ||\n                                             document.querySelector('#douyin-header-menuCt ul.KrOwwuLZ .Ng3vbSwy.mRpT0Jfh') ||\n                                             document.querySelector('.Ng3vbSwy.mRpT0Jfh');\n                                if (!bell) return null;\n                                const rect = bell.getBoundingClientRect();\n                                return {\n                                    x: Math.round(rect.left + rect.width / 2),\n                                    y: Math.round(rect.top + rect.height / 2)\n                                };\n                            } catch (e) {\n                                return null;\n                            }\n                        })()");
            if (!_0x5515d4) {
              console.warn("[Monitor][" + _0x4d0e79 + "] 抓取通知失败: Bell icon not found");
              _0x13520b(_0x47b3f1, "❌ 抓取通知失败: Bell icon not found", "error");
            } else {
              _0x15cd5a.webContents.sendInputEvent({
                type: "mouseMove",
                x: _0x5515d4.x,
                y: _0x5515d4.y
              });
              await new Promise(_0x41ca8f => setTimeout(_0x41ca8f, 500));
              _0x15cd5a.webContents.sendInputEvent({
                type: "mouseDown",
                x: _0x5515d4.x,
                y: _0x5515d4.y,
                button: "left",
                clickCount: 1
              });
              _0x15cd5a.webContents.sendInputEvent({
                type: "mouseUp",
                x: _0x5515d4.x,
                y: _0x5515d4.y,
                button: "left",
                clickCount: 1
              });
              await new Promise(_0x2c2472 => setTimeout(_0x2c2472, 3000));
              const _0x37879b = await _0x15cd5a.webContents.executeJavaScript("(async () => {\n                                try {\n                                    const popover = document.querySelector('[data-e2e=\"listDlgTest-container\"]') || \n                                                    document.querySelector('.SrFKhBVP') ||\n                                                    document.querySelector('.y7JV7Z6q') ||\n                                                    document.querySelector('[class*=\"popover\"]') ||\n                                                    document.querySelector('.semi-popover-content');\n                                    if (!popover) return { success: false, error: 'Popover container not found' };\n                                    \n                                    const rows = Array.from(popover.querySelectorAll(\n                                        '.SrFKhBVP > div, ' +\n                                        '[data-e2e=\"listDlgTest-container\"] ul > li, ' +\n                                        '.SrFKhBVP [class*=\"item\"], ' +\n                                        'div.jWk7ojn7.I_GURp8z, ' +\n                                        'li'\n                                    ));\n                                    const notifications = [];\n                                    rows.forEach(row => {\n                                        const userLink = row.querySelector('a[href*=\"/user/\"]') || row.querySelector('a[href*=\"douyin.com/user/\"]');\n                                        const userUrl = userLink ? userLink.href : '';\n                                        const nickname = userLink ? userLink.innerText.trim() : '未知用户';\n                                        \n                                        const textEl = row.querySelector('[data-e2e=\"notification-text\"]') ||\n                                                       row.querySelector('div.uWltsBYg') || \n                                                       row.querySelector('[class*=\"content\"]') || \n                                                       row.querySelector('[class*=\"text\"]') ||\n                                                       row.querySelector('pre');\n                                        let text = textEl ? textEl.innerText.trim() : row.innerText.trim();\n                                        \n                                        const timeEl = row.querySelector('div.Yt8hlEul') || \n                                                       row.querySelector('[class*=\"time\"]') || \n                                                       row.querySelector('[class*=\"date\"]');\n                                        const time = timeEl ? timeEl.innerText.trim() : '';\n                                        \n                                        // Strip the timestamp from the end of the text if it got duplicated\n                                        if (time && text.endsWith(time)) {\n                                            text = text.substring(0, text.length - time.length).trim();\n                                        }\n                                        \n                                        if (nickname && text) {\n                                            notifications.push({ nickname, userUrl, text, time });\n                                        }\n                                    });\n                                    return { success: true, notifications };\n                                } catch (e) {\n                                    return { success: false, error: e.message };\n                                }\n                            })()");
              if (_0x37879b.success && _0x37879b.notifications) {
                console.log("[Monitor][" + _0x4d0e79 + "] 成功抓取到 " + _0x37879b.notifications.length + " 条通知");
                _0x13520b(_0x47b3f1, "✅ 成功抓取 " + _0x37879b.notifications.length + " 条通知", _0x37879b.notifications.length > 0 ? "success" : "info");
                await _0x298e77(_0x47b3f1, _0x37879b.notifications, _0x4d47c7, _0x592976);
              } else {
                console.warn("[Monitor][" + _0x4d0e79 + "] 抓取通知失败:", _0x37879b.error);
                _0x13520b(_0x47b3f1, "❌ 抓取通知失败: " + _0x37879b.error, "error");
              }
            }
          }
          if (_0x5ab0e1) {
            console.log("[Monitor][" + _0x4d0e79 + "] 正在抓取私信消息...");
            _0x13520b(_0x47b3f1, "💬 正在抓取私信消息...", "info");
            const _0x59e5d3 = await _0x15cd5a.webContents.executeJavaScript("(() => {\n                            try {\n                                const chat = document.querySelector('[data-e2e=\"im-entry\"]') || \n                                             Array.from(document.querySelectorAll('#douyin-header-menuCt li, #douyin-header-menuCt div')).find(el => el.innerText && el.innerText.includes('私信'));\n                                if (!chat) return null;\n                                const rect = chat.getBoundingClientRect();\n                                return {\n                                    x: Math.round(rect.left + rect.width / 2),\n                                    y: Math.round(rect.top + rect.height / 2)\n                                };\n                            } catch (e) {\n                                return null;\n                            }\n                        })()");
            if (!_0x59e5d3) {
              console.warn("[Monitor][" + _0x4d0e79 + "] 抓取私信失败: Chat icon not found");
              _0x13520b(_0x47b3f1, "❌ 抓取私信失败: Chat icon not found", "error");
            } else {
              _0x15cd5a.webContents.sendInputEvent({
                type: "mouseMove",
                x: _0x59e5d3.x,
                y: _0x59e5d3.y
              });
              await new Promise(_0x36d387 => setTimeout(_0x36d387, 500));
              _0x15cd5a.webContents.sendInputEvent({
                type: "mouseDown",
                x: _0x59e5d3.x,
                y: _0x59e5d3.y,
                button: "left",
                clickCount: 1
              });
              _0x15cd5a.webContents.sendInputEvent({
                type: "mouseUp",
                x: _0x59e5d3.x,
                y: _0x59e5d3.y,
                button: "left",
                clickCount: 1
              });
              await new Promise(_0x2119eb => setTimeout(_0x2119eb, 3000));
              const _0xeed8eb = await _0x15cd5a.webContents.executeJavaScript("(async () => {\n                                try {\n                                    const popover = document.querySelector('#imSaasContainerId') ||\n                                                    document.querySelector('[class*=\"popover\"]') || \n                                                    document.querySelector('[class*=\"dialog\"]') || \n                                                    document.querySelector('.semi-popover-content') || \n                                                    document.querySelector('[data-e2e=\"im-entry\"] + div');\n                                    if (!popover) return { success: false, error: 'Chat popover not found' };\n                                    \n                                    const rows = Array.from(popover.querySelectorAll(\n                                        '[data-e2e=\"conversation-item\"], ' +\n                                        '[class*=\"item\"], ' +\n                                        '[class*=\"session\"], ' +\n                                        'li'\n                                    ));\n                                    const dms = [];\n                                    rows.forEach(row => {\n                                        const nicknameEl = row.querySelector('[class*=\"title\"]') ||\n                                                           row.querySelector('[class*=\"name\"]') || \n                                                           row.querySelector('p');\n                                        const nickname = nicknameEl ? nicknameEl.innerText.trim() : '';\n                                        \n                                        const msgEl = row.querySelector('pre') ||\n                                                      row.querySelector('[class*=\"message\"]') || \n                                                      row.querySelector('[class*=\"content\"]') || \n                                                      row.querySelector('span');\n                                        const msg = msgEl ? msgEl.innerText.trim() : '';\n                                        \n                                        const badgeEl = row.querySelector('[class*=\"UnRead\"]') ||\n                                                        row.querySelector('[class*=\"badge\"]') || \n                                                        row.querySelector('[class*=\"count\"]');\n                                        const unread = badgeEl ? badgeEl.innerText.trim() : '';\n                                        \n                                        if (nickname && msg) {\n                                            dms.push({ nickname, msg, unread });\n                                        }\n                                    });\n                                    return { success: true, dms };\n                                } catch (e) {\n                                    return { success: false, error: e.message };\n                                }\n                            })()");
              if (_0xeed8eb.success && _0xeed8eb.dms) {
                console.log("[Monitor][" + _0x4d0e79 + "] 成功抓取到 " + _0xeed8eb.dms.length + " 条私信会话");
                _0x13520b(_0x47b3f1, "✅ 成功抓取 " + _0xeed8eb.dms.length + " 条私信会话", _0xeed8eb.dms.length > 0 ? "success" : "info");
                await _0x28936b(_0x47b3f1, _0xeed8eb.dms, _0x4d47c7, _0x592976);
              } else {
                console.warn("[Monitor][" + _0x4d0e79 + "] 抓取私信失败:", _0xeed8eb.error);
                _0x13520b(_0x47b3f1, "❌ 抓取私信失败: " + _0xeed8eb.error, "error");
              }
            }
          }
        }
      }
      if (_0x4d47c7.watchNewLeads && _0x4d47c7.videoUrls && _0x4d47c7.videoUrls.length > 0) {
        console.log("[Monitor][" + _0x4d0e79 + "] 开启视频新线索监控, 视频数: " + _0x4d47c7.videoUrls.length);
        _0x13520b(_0x47b3f1, "🎬 开始监控 " + _0x4d47c7.videoUrls.length + " 个视频的新线索...", "info");
        for (const _0x198e78 of _0x4d47c7.videoUrls) {
          try {
            console.log("[Monitor][" + _0x4d0e79 + "] 正在加载视频页: " + _0x198e78.url);
            await _0x15cd5a.loadURL(_0x198e78.url);
            await new Promise(_0x4a0360 => setTimeout(_0x4a0360, 8000));
            const _0x11371f = await _0x15cd5a.webContents.executeJavaScript("(async () => {\n                            try {\n                                // 等待页面完全加载\n                                await new Promise(resolve => setTimeout(resolve, 2000));\n                                \n                                // 尝试点击评论区切换按钮（如果存在）\n                                const commentTab = Array.from(document.querySelectorAll('div, span')).find(el => {\n                                    const text = el.innerText ? el.innerText.trim() : '';\n                                    return text.startsWith('评论') && text.length < 15;\n                                });\n                                if (commentTab) {\n                                    commentTab.click();\n                                    await new Promise(resolve => setTimeout(resolve, 2000));\n                                }\n                                \n                                // 使用与 automation-preload.js 一致的选择器\n                                // commentPanel: '.comment-mainContent, [data-e2e=\"comment-list\"], [class*=\"CommentList\"]'\n                                let commentList = document.querySelector('.comment-mainContent') || \n                                                document.querySelector('[data-e2e=\"comment-list\"]') ||\n                                                document.querySelector('[class*=\"CommentList\"]');\n                                \n                                if (!commentList) {\n                                    // 尝试通过评论项反向查找容器\n                                    const firstComment = document.querySelector('[data-e2e=\"comment-item\"]');\n                                    if (firstComment) {\n                                        commentList = firstComment.parentElement;\n                                    }\n                                }\n                                \n                                if (!commentList) {\n                                    return { success: false, error: 'Comment list container not found' };\n                                }\n                                \n                                // 使用与 automation-preload.js 一致的选择器\n                                // commentItem: '[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], div[class*=\"comment-item\"], div[class*=\"reply-item\"]'\n                                const commentNodes = commentList.querySelectorAll('[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], div[class*=\"comment-item\"], div[class*=\"reply-item\"]');\n                                const comments = [];\n                                commentNodes.forEach(node => {\n                                    const userLink = node.querySelector('a[href*=\"/user/\"]');\n                                    const userUrl = userLink ? userLink.href : '';\n                                    const nickname = userLink ? userLink.innerText.trim() : '未知用户';\n                                    \n                                    const textEl = node.querySelector('[data-e2e=\"comment-content\"]') || node.querySelector('span[class*=\"comment-text\"]') || node.querySelector('[class*=\"content\"]');\n                                    const text = textEl ? textEl.innerText.trim() : '';\n                                    \n                                    const timeEl = node.querySelector('[class*=\"time\"]') || node.querySelector('[class*=\"date\"]') || node.querySelector('span[class*=\"time\"]');\n                                    const time = timeEl ? timeEl.innerText.trim() : '';\n                                    \n                                    if (nickname && text) {\n                                        comments.push({ nickname, userUrl, text, time });\n                                    }\n                                });\n                                return { success: true, comments };\n                            } catch (e) {\n                                return { success: false, error: e.message };\n                            }\n                        })()");
            if (_0x11371f.success && _0x11371f.comments) {
              console.log("[Monitor][" + _0x4d0e79 + "] 视频 " + (_0x198e78.title || "") + " 抓取到 " + _0x11371f.comments.length + " 条评论");
              await _0x4f8fe5(_0x47b3f1, _0x198e78, _0x11371f.comments, _0x4d47c7, _0x592976);
            } else {
              console.warn("[Monitor][" + _0x4d0e79 + "] 抓取视频评论失败:", _0x11371f.error);
            }
          } catch (_0x20ba97) {
            console.error("[Monitor][" + _0x4d0e79 + "] 监控单个视频时异常:", _0x20ba97.message);
          }
        }
      }
    } catch (_0x3a5da7) {
      console.error("[Monitor][" + _0x4d0e79 + "] 监控检查中发生未捕获异常:", _0x3a5da7.message);
      _0x13520b(_0x47b3f1, "❌ 检查过程发生异常: " + _0x3a5da7.message, "error");
    } finally {
      _0x15cd5a.destroy();
      console.log("[Monitor] 账号: " + _0x47b3f1 + " 检查完成，后台窗口已销毁");
      _0x13520b(_0x47b3f1, "✅ 账号检查完成", "success");
    }
  }
  async function _0x386f15(_0x4afcd6, _0x5b5e91) {
    if (!_0x5b5e91 || !_0x5b5e91.webhookUrl) {
      return;
    }
    const _0x38af1b = _0x3a9bce();
    if (_0x4afcd6.length === 1) {
      const _0x428005 = _0x4afcd6[0];
      let _0x47342a = "";
      if (_0x428005.eventType === "like") {
        _0x47342a = "**监控账号**: " + _0x428005.accountName + "\n**用户**: [" + _0x428005.nickname + "](" + (_0x428005.userUrl || "javascript:;") + ")\n**内容**: " + _0x428005.text + "\n**时间**: " + _0x428005.time;
      } else if (_0x428005.eventType === "follow") {
        _0x47342a = "**监控账号**: " + _0x428005.accountName + "\n**粉丝**: [" + _0x428005.nickname + "](" + (_0x428005.userUrl || "javascript:;") + ")\n**时间**: " + _0x428005.time;
      } else if (_0x428005.eventType === "reply") {
        _0x47342a = "**监控账号**: " + _0x428005.accountName + "\n**回复用户**: [" + _0x428005.nickname + "](" + (_0x428005.userUrl || "javascript:;") + ")\n**回复内容**: " + _0x428005.text + "\n**时间**: " + _0x428005.time;
      } else if (_0x428005.eventType === "message") {
        _0x47342a = "**监控账号**: " + _0x428005.accountName + "\n**会话用户**: " + _0x428005.nickname + "\n**最后私信**: " + _0x428005.text + "\n**未读消息**: " + (_0x428005.unread ? _0x428005.unread + "条未读" : "最新") + "\n**时间**: " + _0x428005.time;
      } else if (_0x428005.eventType === "newLead") {
        _0x47342a = "**监控账号**: " + _0x428005.accountName + "\n**视频**: [" + (_0x428005.videoTitle || "点此查看") + "](" + _0x428005.videoUrl + ")\n**评论用户**: [" + _0x428005.nickname + "](" + (_0x428005.userUrl || "javascript:;") + ")\n**评论内容**: " + _0x428005.text + "\n**时间**: " + _0x428005.time;
        if (_0x428005.aiResult) {
          const _0x20eb3f = _0x428005.aiResult.intention === "high" ? "🔴 高意向" : _0x428005.aiResult.intention === "medium" ? "🟡 中意向" : "⚪ 低意向";
          _0x47342a += "\n\n**🤖 AI 分析结果**:\n**意向等级**: " + _0x20eb3f + "\n**分析依据**: " + (_0x428005.aiResult.thought || "无") + "\n**推荐回复**: " + (_0x428005.aiResult.reply_content || "无");
        }
      }
      const _0x3da034 = {
        title: "📡 获客雷达 - 收到新" + _0x428005.titleLabel.substring(2),
        content: _0x47342a,
        time: new Date().toLocaleString(),
        eventType: _0x428005.eventType
      };
      try {
        const _0x467501 = _0x6ee0b4(_0x5b5e91.webhookType, _0x3da034);
        let _0x41de10 = _0x5b5e91.webhookUrl;
        if (_0x5b5e91.webhookType === "dingtalk" && _0x5b5e91.webhookSecret) {
          _0x41de10 = _0x57225f(_0x41de10, _0x5b5e91.webhookSecret);
        }
        const _0x3540fe = await axios.post(_0x41de10, _0x467501, {
          timeout: 10000
        });
        const _0x53eb69 = _0x3ca056(_0x5b5e91.webhookType, _0x3540fe);
        if (_0x38af1b && !_0x38af1b.isDestroyed()) {
          _0x38af1b.webContents.send("monitor-push-result", {
            type: _0x428005.eventType,
            content: _0x428005.text || _0x428005.titleLabel,
            success: _0x53eb69
          });
        }
      } catch (_0x322289) {
        console.error("[Monitor] Single item webhook failed:", _0x322289.message);
        if (_0x38af1b && !_0x38af1b.isDestroyed()) {
          _0x38af1b.webContents.send("monitor-push-result", {
            type: _0x428005.eventType,
            content: _0x428005.text || _0x428005.titleLabel,
            success: false
          });
        }
      }
      return;
    }
    let _0x622253 = "📡 **获客雷达 - 定时监控汇总报告**\n此次检查共抓取到 **" + _0x4afcd6.length + "** 项新动态：\n\n---\n";
    const _0x559fd0 = {
      newLead: [],
      message: [],
      reply: [],
      follow: [],
      like: []
    };
    _0x4afcd6.forEach(_0x3e3b01 => {
      if (_0x559fd0[_0x3e3b01.eventType]) {
        _0x559fd0[_0x3e3b01.eventType].push(_0x3e3b01);
      }
    });
    if (_0x559fd0.newLead.length > 0) {
      _0x622253 += "### 🔍 新线索 (" + _0x559fd0.newLead.length + ")\n";
      _0x559fd0.newLead.forEach((_0xbcba90, _0x1ea3d2) => {
        _0x622253 += _0x1ea3d2 + 1 + ". **监控账号**: " + _0xbcba90.accountName + "\n";
        _0x622253 += "   - **视频**: [" + (_0xbcba90.videoTitle || "点此查看") + "](" + _0xbcba90.videoUrl + ")\n";
        _0x622253 += "   - **评论用户**: [" + _0xbcba90.nickname + "](" + (_0xbcba90.userUrl || "javascript:;") + ")\n";
        _0x622253 += "   - **评论内容**: " + _0xbcba90.text + "\n";
        if (_0xbcba90.aiResult) {
          const _0x331397 = _0xbcba90.aiResult.intention === "high" ? "🔴 高意向" : _0xbcba90.aiResult.intention === "medium" ? "🟡 中意向" : "⚪ 低意向";
          _0x622253 += "   - **🤖 AI分析**: " + _0x331397 + " | 依据: " + (_0xbcba90.aiResult.thought || "无") + "\n";
          _0x622253 += "   - **推荐回复**: " + (_0xbcba90.aiResult.reply_content || "无") + "\n";
        }
        _0x622253 += "   - **时间**: " + _0xbcba90.time + "\n\n";
      });
      _0x622253 += "---\n";
    }
    if (_0x559fd0.message.length > 0) {
      _0x622253 += "### 💬 收到新私信 (" + _0x559fd0.message.length + ")\n";
      _0x559fd0.message.forEach((_0x4d8fa1, _0x3667f6) => {
        _0x622253 += _0x3667f6 + 1 + ". **监控账号**: " + _0x4d8fa1.accountName + "\n";
        _0x622253 += "   - **会话用户**: " + _0x4d8fa1.nickname + "\n";
        _0x622253 += "   - **最后消息**: " + _0x4d8fa1.text + "\n";
        _0x622253 += "   - **时间**: " + _0x4d8fa1.time + "\n\n";
      });
      _0x622253 += "---\n";
    }
    if (_0x559fd0.reply.length > 0) {
      _0x622253 += "### 💭 评论回复 (" + _0x559fd0.reply.length + ")\n";
      _0x559fd0.reply.forEach((_0x323076, _0x4ff634) => {
        _0x622253 += _0x4ff634 + 1 + ". **监控账号**: " + _0x323076.accountName + "\n";
        _0x622253 += "   - **用户**: [" + _0x323076.nickname + "](" + (_0x323076.userUrl || "javascript:;") + ")\n";
        _0x622253 += "   - **回复内容**: " + _0x323076.text + "\n";
        _0x622253 += "   - **时间**: " + _0x323076.time + "\n\n";
      });
      _0x622253 += "---\n";
    }
    if (_0x559fd0.follow.length > 0) {
      _0x622253 += "### 👤 收到关注 (" + _0x559fd0.follow.length + ")\n";
      _0x559fd0.follow.forEach(_0x2c64e3 => {
        _0x622253 += "- **监控账号**: " + _0x2c64e3.accountName + " | **粉丝**: [" + _0x2c64e3.nickname + "](" + (_0x2c64e3.userUrl || "javascript:;") + ") | 时间: " + _0x2c64e3.time + "\n";
      });
      _0x622253 += "\n---\n";
    }
    if (_0x559fd0.like.length > 0) {
      _0x622253 += "### ❤️ 收到点赞 (" + _0x559fd0.like.length + ")\n";
      _0x559fd0.like.forEach(_0x3af88d => {
        _0x622253 += "- **监控账号**: " + _0x3af88d.accountName + " | **用户**: [" + _0x3af88d.nickname + "](" + (_0x3af88d.userUrl || "javascript:;") + ") | **动作**: " + _0x3af88d.text + " | 时间: " + _0x3af88d.time + "\n";
      });
      _0x622253 += "\n---\n";
    }
    const _0x1cd510 = {
      title: "📡 获客雷达 - 定时监控汇总报告",
      content: _0x622253,
      time: new Date().toLocaleString(),
      eventType: "consolidated"
    };
    try {
      const _0x1fadf9 = _0x6ee0b4(_0x5b5e91.webhookType, _0x1cd510);
      let _0x28c242 = _0x5b5e91.webhookUrl;
      if (_0x5b5e91.webhookType === "dingtalk" && _0x5b5e91.webhookSecret) {
        _0x28c242 = _0x57225f(_0x28c242, _0x5b5e91.webhookSecret);
      }
      const _0x11afec = await axios.post(_0x28c242, _0x1fadf9, {
        timeout: 10000
      });
      const _0x19957d = _0x3ca056(_0x5b5e91.webhookType, _0x11afec);
      if (_0x38af1b && !_0x38af1b.isDestroyed()) {
        _0x4afcd6.forEach(_0x275de2 => {
          _0x38af1b.webContents.send("monitor-push-result", {
            type: _0x275de2.eventType,
            content: "[已合并推送] " + _0x275de2.nickname + ": " + (_0x275de2.text || _0x275de2.titleLabel),
            success: _0x19957d
          });
        });
      }
    } catch (_0x24e6e5) {
      console.error("[Monitor] Consolidated webhook push failed:", _0x24e6e5.message);
      if (_0x38af1b && !_0x38af1b.isDestroyed()) {
        _0x4afcd6.forEach(_0x29c9a2 => {
          _0x38af1b.webContents.send("monitor-push-result", {
            type: _0x29c9a2.eventType,
            content: "[合并推送失败] " + _0x29c9a2.nickname + ": " + (_0x29c9a2.text || _0x29c9a2.titleLabel),
            success: false
          });
        });
      }
    }
  }
  async function _0x2f7a79() {
    const _0x568da2 = _0x3a9bce();
    if (!_0x333105 || !_0x568da2 || _0x568da2.isDestroyed()) {
      return;
    }
    console.log("[Monitor] 执行定时检查...");
    const _0xdb2f78 = (_0x333105.accountIds || []).length;
    _0x13520b("system", "🚀 开始新一轮监控检查 (共 " + _0xdb2f78 + " 个账号)", "info");
    const _0x4a6a35 = new Date(Date.now() + (_0x333105.intervalMinutes || 10) * 60 * 1000).toLocaleTimeString();
    _0x568da2.webContents.send("monitor-status-update", {
      running: true,
      nextCheck: _0x4a6a35
    });
    const _0x3bc465 = _0x333105.accountIds || [];
    const _0x5ecd58 = [];
    for (const _0x2544f7 of _0x3bc465) {
      try {
        await _0x397121(_0x2544f7, _0x333105, _0x5ecd58);
      } catch (_0x17b419) {
        console.error("[Monitor] 检查账号 " + _0x2544f7 + " 时发生错误:", _0x17b419.message);
      }
    }
    if (_0x5ecd58.length > 0) {
      console.log("[Monitor] 检查完成，共抓取到 " + _0x5ecd58.length + " 条新动态，开始整合推送...");
      _0x13520b("system", "📤 发现 " + _0x5ecd58.length + " 条新动态，正在推送...", "success");
      await _0x386f15(_0x5ecd58, _0x333105);
    } else {
      console.log("[Monitor] 检查完成，无新动态需要推送");
      _0x13520b("system", "✓ 检查完成，暂无新动态", "info");
    }
  }
  function _0x6ee0b4(_0x2bb768, _0x403ded) {
    if (_0x2bb768 === "feishu") {
      return {
        msg_type: "interactive",
        card: {
          header: {
            title: {
              tag: "plain_text",
              content: _0x403ded.title || "📡 获客雷达通知"
            },
            template: "blue"
          },
          elements: [{
            tag: "div",
            text: {
              tag: "lark_md",
              content: _0x403ded.content || ""
            }
          }, {
            tag: "note",
            elements: [{
              tag: "plain_text",
              content: "⏰ " + (_0x403ded.time || new Date().toLocaleString())
            }]
          }]
        }
      };
    } else if (_0x2bb768 === "dingtalk") {
      return {
        msgtype: "markdown",
        markdown: {
          title: _0x403ded.title || "📡 获客雷达通知",
          text: "### " + (_0x403ded.title || "获客雷达通知") + "\n\n" + (_0x403ded.content || "") + "\n\n> ⏰ " + (_0x403ded.time || new Date().toLocaleString())
        }
      };
    } else {
      return {
        event: _0x403ded.eventType || "notification",
        title: _0x403ded.title || "获客雷达通知",
        content: _0x403ded.content || "",
        timestamp: Date.now(),
        data: _0x403ded.extra || {}
      };
    }
  }
  function _0xf4c3dc() {
    ipcMain.handle("get-monitor-status", () => {
      return !!_0x23f53c;
    });
    ipcMain.handle("test-webhook", async (_0x3bd71f, {
      type: _0x352b02,
      url: _0x37268a,
      secret: _0x357597
    }) => {
      try {
        const _0x4ba761 = _0x6ee0b4(_0x352b02, {
          title: "🔔 Webhook 连接测试",
          content: "恭喜！您的 Webhook 配置正确，消息推送功能已就绪。",
          time: new Date().toLocaleString()
        });
        let _0x57f12f = _0x37268a;
        if (_0x352b02 === "dingtalk" && _0x357597) {
          _0x57f12f = _0x57225f(_0x37268a, _0x357597);
        }
        const _0x14d1f1 = await axios.post(_0x57f12f, _0x4ba761, {
          timeout: 10000
        });
        if (_0x14d1f1.status === 200) {
          if (_0x14d1f1.data) {
            if (_0x14d1f1.data.errcode !== undefined && _0x14d1f1.data.errcode !== 0) {
              return {
                success: false,
                message: "机器人错误: " + _0x14d1f1.data.errmsg + " (" + _0x14d1f1.data.errcode + ")"
              };
            }
            if (_0x14d1f1.data.code !== undefined && _0x352b02 === "feishu" && _0x14d1f1.data.code !== 0) {
              return {
                success: false,
                message: "机器人错误: " + (_0x14d1f1.data.msg || _0x14d1f1.data.message) + " (" + _0x14d1f1.data.code + ")"
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
          message: "HTTP " + _0x14d1f1.status
        };
      } catch (_0x1ade18) {
        return {
          success: false,
          message: _0x1ade18.message || "网络错误"
        };
      }
    });
    ipcMain.on("start-monitor", (_0x54cc11, _0x3fd154) => {
      _0x333105 = _0x3fd154;
      if (_0x23f53c) {
        clearInterval(_0x23f53c);
      }
      const _0x30bd14 = (_0x3fd154.intervalMinutes || 10) * 60 * 1000;
      console.log("[Monitor] 启动定时监控, 间隔: " + _0x3fd154.intervalMinutes + "分钟");
      _0x23f53c = setInterval(() => _0x2f7a79(), _0x30bd14);
      _0xb171cb("legacy-monitor", {
        type: "legacy-monitor",
        intervalMs: _0x30bd14
      });
      setTimeout(() => _0x2f7a79(), 3000);
    });
    ipcMain.on("stop-monitor", () => {
      if (_0x23f53c) {
        clearInterval(_0x23f53c);
        _0x23f53c = null;
      }
      _0x333105 = null;
      _0x199696("legacy-monitor");
      console.log("[Monitor] 定时监控已停止");
      const _0x9ca46e = _0x3a9bce();
      const _0x3dcab7 = BrowserWindow.getAllWindows();
      _0x3dcab7.forEach(_0x3c9e03 => {
        if (!_0x3c9e03.isDestroyed() && _0x3c9e03 !== _0x9ca46e) {
          const _0x19cfff = _0x3c9e03.webContents.session.partition;
          if (_0x19cfff && _0x19cfff.includes("persist:automation:")) {
            console.log("[Monitor] 销毁监控窗口: " + _0x19cfff);
            _0x3c9e03.destroy();
          }
        }
      });
      if (_0x9ca46e && !_0x9ca46e.isDestroyed()) {
        _0x9ca46e.webContents.send("monitor-status-update", {
          running: false
        });
      }
    });
  }
  return {
    registerIpc: _0xf4c3dc,
    analyzeCommentWithAI: _0x4c94ef,
    analyzeMonitorCommentsBatch: _0x596d0c,
    analyzeMonitorCommentsRadarBatch: _0x549dd8,
    generateMonitorPersonaContent: _0x2fbc71,
    matchKeywords: _0x32796c,
    isMonitorAccountAiEnabled: _0x3a5140,
    isMonitorAiIntentJudgeEnabled: _0x3f3942,
    pickRandomTemplateLine: _0x28410b,
    resolveMonitorPersonaIntent: _0x547495,
    findMatchedKeyword: _0x2ccf9b,
    normalizeRadarAnalyzeResult: _0x3fa67c,
    mapCommentDecisionToEvaluations: _0x38a64c,
    postMonitorCommentDecisionBatch: _0x42f13b,
    checkAccountMonitor: _0x397121,
    executeMonitorCheck: _0x2f7a79,
    pushConsolidatedEvents: _0x386f15,
    buildWebhookPayload: _0x6ee0b4,
    signDingtalkUrl: _0x57225f,
    isWebhookResponseSuccess: _0x3ca056,
    sendMonitorLog: _0x13520b,
    getMonitorTimer: () => _0x23f53c,
    getMonitorConfig: () => _0x333105
  };
}
module.exports = {
  createWebhookMonitor: createWebhookMonitor
};
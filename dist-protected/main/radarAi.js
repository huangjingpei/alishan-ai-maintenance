'use strict';

const {
  ipcMain
} = require("electron");
function createRadarAi(_0x2f1830) {
  const {
    store: _0x1be971,
    getApiBase: _0x1adc8f,
    getMainWindow: _0x3e1dbc,
    getActiveSettings: _0x3a5358,
    getPlatformViews: _0x3f9800,
    getViewSettingsMap: _0x36be9c,
    getInteractionViewsMap: _0x304e35,
    radarDeviceHeaders: _0x334501,
    getRobustDeviceID: _0x3302ce,
    autoLogin: _0x1a1f66,
    resolveActiveBatchRunId: _0xeedebf,
    appendBatchFollowLog: _0xd4e1ae,
    generateMonitorPersonaContent: _0x422ceb
  } = _0x2f1830;
  const _0x4622a4 = _0x2f1830.axios || require("axios");
  function _0x356676(_0x57377a, _0x5b80f1 = 100) {
    const _0x434f5f = String(_0x57377a || "").trim();
    if (!_0x434f5f) {
      return "";
    }
    if (_0x434f5f.length > _0x5b80f1) {
      return _0x434f5f.slice(0, _0x5b80f1) + "…";
    } else {
      return _0x434f5f;
    }
  }
  function _0xedc75f(_0x538922) {
    if (!_0x538922) {
      return false;
    }
    const _0x4237ca = String(_0x538922);
    return _0x4237ca.includes("额度已用完") || _0x4237ca.includes("已用完") || _0x4237ca.includes("卡密已过期") || _0x4237ca.includes("授权码无效") || _0x4237ca.includes("设备已被封") || _0x4237ca.includes("余额不足") || _0x4237ca.includes("未授权");
  }
  let _0x558a88 = 0;
  function _0x4a4f97() {
    return _0x558a88;
  }
  function _0x458822() {
    _0x558a88 += 1;
  }
  function _0xf88fe0(_0x1e9d0e) {
    return _0x1e9d0e !== _0x558a88;
  }
  async function _0x22e0ca(_0x14ede5, _0x51f18e) {
    const _0x31ff14 = 400;
    let _0x277f2b = _0x14ede5;
    while (_0x277f2b > 0) {
      if (_0xf88fe0(_0x51f18e)) {
        return false;
      }
      const _0xe8ae59 = Math.min(_0x31ff14, _0x277f2b);
      await new Promise(_0xcbcaf5 => setTimeout(_0xcbcaf5, _0xe8ae59));
      _0x277f2b -= _0xe8ae59;
    }
    return !_0xf88fe0(_0x51f18e);
  }
  function _0x356f2e(_0xbe49a3, _0xc04667, _0x249fec = {}) {
    const _0x56b6af = String(_0xbe49a3 || "").trim();
    if (!_0x56b6af) {
      return;
    }
    const _0x56dc68 = _0x3a5358();
    const _0x3e5dfc = _0xc04667 || _0x56dc68?.accountId || "default";
    const _0x3b75d0 = _0xeedebf(_0x249fec.viewKey, _0x249fec.runId ?? _0x249fec.batchRunId);
    if (_0x3b75d0 != null && _0x249fec.persist !== false) {
      _0xd4e1ae(_0x3b75d0, {
        message: _0x56b6af,
        level: _0x249fec.level || "normal",
        accountId: _0x3e5dfc,
        accountName: _0x249fec.accountName || "",
        viewKey: _0x249fec.viewKey || "",
        leadId: _0x249fec.leadId || "",
        leadName: _0x249fec.leadName || "",
        phase: _0x249fec.phase || "trace"
      });
    }
    const _0x30e0f0 = _0x3e1dbc();
    if (!_0x30e0f0 || _0x30e0f0.isDestroyed()) {
      return;
    }
    _0x30e0f0.webContents.send("automation-data", {
      type: "trace-log",
      payload: {
        accountId: _0x3e5dfc,
        message: _0x56b6af,
        level: _0x249fec.level || "normal",
        runId: _0x3b75d0 ?? undefined,
        batchRunId: _0x3b75d0 ?? undefined
      }
    });
  }
  function _0x4e0893(_0x38ba20, _0x4ed60e = {}) {
    if (_0x4ed60e?.accountId) {
      return _0x4ed60e.accountId;
    }
    const _0x59075b = _0x38ba20?.sender;
    if (_0x59075b && !_0x59075b.isDestroyed?.()) {
      const _0x2b0497 = _0x3f9800();
      const _0x34879a = _0x36be9c();
      const _0x466323 = _0x304e35();
      for (const [_0x5d36c5, _0x16f00a] of _0x2b0497.entries()) {
        if (_0x16f00a?.webContents === _0x59075b) {
          const _0xe059d2 = _0x34879a.get(_0x5d36c5);
          if (_0xe059d2?.accountId) {
            return _0xe059d2.accountId;
          }
          const _0xbd383b = _0x5d36c5.split("_");
          if (_0xbd383b.length > 1) {
            return _0xbd383b.slice(1).join("_");
          }
        }
      }
      for (const [_0xad4194, _0x3c58d7] of _0x466323.entries()) {
        if (_0x3c58d7?.webContents === _0x59075b) {
          const _0x5ddea7 = _0x34879a.get(_0xad4194);
          if (_0x5ddea7?.accountId) {
            return _0x5ddea7.accountId;
          }
          const _0x17e81f = _0xad4194.split("_");
          if (_0x17e81f.length > 1) {
            return _0x17e81f.slice(1).join("_");
          }
        }
      }
    }
    return _0x3a5358()?.accountId || "default";
  }
  function _0x110cbd(_0xfb580f = {}, _0x18e187 = {}) {
    const _0x2af83f = String(_0xfb580f?.aiPrompt || "").trim();
    if (_0x2af83f) {
      return _0x2af83f;
    }
    const _0x585e81 = _0xfb580f?.aiRole || _0x18e187.aiRole || "专业获客评论互动顾问";
    const _0x526d9f = _0xfb580f?.aiGoal || _0xfb580f?.aiPurpose || _0x18e187.aiGoal || "识别更匹配业务人设的潜在客户并进行自然互动";
    const _0x350bd4 = _0xfb580f?.aiStyle || _0x18e187.aiStyle || "真诚、克制、精准、合规";
    return "身份: " + _0x585e81 + "; 目的: " + _0x526d9f + "; 要求: " + _0x350bd4;
  }
  async function _0x2c7911(_0x3a6609, _0x2f12cd, _0x4b6d4d = 60000) {
    const _0x4ede35 = _0x3302ce();
    let _0x595f6b = _0x1be971.get("auth_token");
    try {
      return await _0x4622a4.post(_0x3a6609, _0x2f12cd, {
        headers: _0x334501(_0x595f6b, _0x4ede35),
        timeout: _0x4b6d4d
      });
    } catch (_0x2647db) {
      if (_0x2647db.response?.status === 401) {
        await _0x1a1f66();
        _0x595f6b = _0x1be971.get("auth_token");
        return await _0x4622a4.post(_0x3a6609, _0x2f12cd, {
          headers: _0x334501(_0x595f6b, _0x4ede35),
          timeout: _0x4b6d4d
        });
      }
      throw _0x2647db;
    }
  }
  function _0xcc853e(_0x307d23, _0x57bacc = "AI 判断完成") {
    const _0x4937ee = _0x307d23?.data?.data;
    if (_0x307d23?.data?.code === 200 && _0x4937ee) {
      return {
        success: true,
        pass: _0x4937ee.pass !== false,
        score: Number(_0x4937ee.score || 0),
        reason: _0x4937ee.reason || _0x57bacc,
        mainPostComment: String(_0x4937ee.main_post_comment || _0x4937ee.mainPostComment || "").trim()
      };
    }
    return {
      success: false,
      pass: false,
      score: 0,
      reason: _0x307d23?.data?.msg || "后端未返回有效判断，未放行",
      mainPostComment: ""
    };
  }
  function _0x5e5bb7(_0x342c36) {
    try {
      if (_0x342c36.data.code === 200 && _0x342c36.data.data) {
        const _0x14bb1c = Array.isArray(_0x342c36.data.data) ? _0x342c36.data.data : [_0x342c36.data.data];
        const _0x30c84d = _0x14bb1c.map(_0x40848a => {
          let _0x2b0585 = "ignore";
          if (_0x40848a.should_like && _0x40848a.should_reply) {
            _0x2b0585 = "both";
          } else if (_0x40848a.should_like) {
            _0x2b0585 = "like";
          } else if (_0x40848a.should_reply) {
            _0x2b0585 = "reply";
          }
          return {
            decision: _0x2b0585,
            replyContent: _0x40848a.reply_content,
            aiThought: _0x40848a.thought
          };
        });
        console.log("[AI-Analyze] 批量映射成功 (动作互斥已生效)，最终决策量: " + _0x30c84d.length);
        console.log("[AI-Analyze] -----------------------------------------");
        return {
          success: true,
          data: _0x30c84d
        };
      }
      return {
        success: false,
        msg: _0x342c36.data.msg || "后端分析返回异常"
      };
    } catch (_0x5d22f9) {
      console.error("[AI-Analyze] 批量调用结果解析失败: " + _0x5d22f9.message);
      return {
        success: false,
        msg: _0x5d22f9.message
      };
    }
  }
  function _0x759ee6() {
    ipcMain.handle("ai-intelligent-analyze-batch", async (_0x4b836c, _0x59fb4e) => {
      const _0x37c88b = _0x1adc8f();
      const {
        leads: _0x2148a5,
        config: _0x3fb22a,
        generationMode = ""
      } = _0x59fb4e;
      if (!_0x2148a5 || _0x2148a5.length === 0) {
        return {
          success: true,
          data: []
        };
      }
      const _0x1135c5 = _0x4e0893(_0x4b836c, _0x59fb4e);
      const _0x587dfe = Date.now();
      const _0x283e4a = generationMode === "keyword_reply_only";
      const _0x1e31fb = _0x283e4a ? "关键词匹配回复生成" : "评论分析";
      _0x356f2e("🌐 后端 AI：提交 " + _0x2148a5.length + " 条" + _0x1e31fb + "…", _0x1135c5);
      let _0x191b0c = _0x3fb22a.aiPrompt;
      if (!_0x191b0c) {
        _0x191b0c = "身份: " + (_0x3fb22a.aiRole || "专业营销人员") + "; 目的: " + (_0x3fb22a.aiGoal || "寻找有真实服务/产品需求的潜在客户") + "; 要求: " + (_0x3fb22a.aiStyle || "专业、精准、严谨");
      }
      const _0x24d443 = _0x2148a5[0].title;
      const _0x4c9811 = _0x3a5358();
      const _0x252f07 = _0x4c9811?.keywords || "未知关键字";
      const _0x1c77db = _0x4c9811?.nickname || _0x4c9811?.name || _0x2148a5[0]?.accountName || "未知账号";
      console.log("[AI-Analyze] -----------------------------------------");
      console.log("[AI-Analyze] 发起批量" + _0x1e31fb + " (" + _0x2148a5.length + " 条" + (_0x283e4a ? ", mode=keyword_reply_only" : "") + ")");
      const _0x932ce4 = async _0x358d26 => {
        const _0x8eabf9 = _0x3302ce();
        const _0x27213e = _0x2148a5.map(_0x1ac1bd => ({
          videoTitle: _0x1ac1bd.title,
          nickname: _0x1ac1bd.nickname,
          videoUrl: _0x1ac1bd.url,
          content: _0x1ac1bd.content,
          commentTime: _0x1ac1bd.timeText,
          userUrl: _0x1ac1bd.userUrl,
          videoAuthor: "",
          accountName: _0x1ac1bd.accountName || _0x1c77db,
          signature: _0x1ac1bd.signature || "",
          chatHistory: _0x1ac1bd.chatHistory || "",
          contact: _0x1ac1bd.contact || "",
          douyinId: _0x1ac1bd.douyinId || "",
          location: _0x1ac1bd.location || _0x1ac1bd.ipLocation || "",
          gender: _0x1ac1bd.gender || "",
          worksCount: _0x1ac1bd.worksCount !== null && _0x1ac1bd.worksCount !== undefined && Number.isFinite(Number(_0x1ac1bd.worksCount)) && Number(_0x1ac1bd.worksCount) >= 0 ? Number(_0x1ac1bd.worksCount) : null
        }));
        return await _0x4622a4.post(_0x37c88b + "/radar/ai/v2/comment-decision", {
          intent: _0x191b0c,
          video_title: _0x24d443,
          keywords: _0x252f07,
          accountName: _0x1c77db,
          leads: _0x27213e,
          ...(generationMode ? {
            generationMode: generationMode
          } : {})
        }, {
          headers: _0x334501(_0x358d26, _0x8eabf9),
          timeout: 300000
        });
      };
      const _0x61278f = 10000;
      let _0xf796d = 0;
      const _0x2bed00 = _0x4a4f97();
      while (true) {
        if (_0xf88fe0(_0x2bed00)) {
          console.log("[AI-Analyze] 任务已停止，终止分析重试");
          _0x356f2e("🌐 后端 AI：任务已停止，终止分析重试", _0x1135c5);
          return {
            success: false,
            msg: "AI 分析已取消（任务已停止）",
            cancelled: true
          };
        }
        _0xf796d += 1;
        try {
          let _0x1c965b = _0x1be971.get("auth_token");
          let _0x19b07f;
          try {
            _0x19b07f = await _0x932ce4(_0x1c965b);
          } catch (_0x5eccf6) {
            if (_0x5eccf6.response?.status === 401) {
              console.log("[AI-Analyze] Token 过期，正在自动刷新...");
              await _0x1a1f66();
              _0x1c965b = _0x1be971.get("auth_token");
              _0x19b07f = await _0x932ce4(_0x1c965b);
            } else {
              throw _0x5eccf6;
            }
          }
          const _0x1cc87e = _0x5e5bb7(_0x19b07f);
          if (_0x1cc87e.success) {
            const _0x386492 = ((Date.now() - _0x587dfe) / 1000).toFixed(1);
            _0x356f2e("🌐 后端 AI：" + _0x1e31fb + "完成（" + _0x2148a5.length + " 条，耗时 " + _0x386492 + "s）", _0x1135c5);
            const _0x2fc17c = _0x3e1dbc();
            if (_0x2fc17c) {
              _0x2fc17c.webContents.send("ai-quota-updated");
              if (_0xf796d > 1) {
                _0x2fc17c.webContents.send("ai-retry-status", {
                  status: "success"
                });
              }
            }
            return _0x1cc87e;
          }
          throw new Error(_0x1cc87e.msg || "后端分析异常");
        } catch (_0x5ddab0) {
          const _0xa2af67 = _0x5ddab0.response?.data?.msg || _0x5ddab0.message;
          console.error("[AI-Analyze] 第 " + _0xf796d + " 次尝试失败:", _0xa2af67);
          _0x356f2e("🌐 后端 AI：第 " + _0xf796d + " 次失败：" + _0x356676(_0xa2af67), _0x1135c5);
          if (_0xedc75f(_0xa2af67)) {
            console.warn("[AI-Analyze] 监测到致命授权/额度错误，终止重试");
            const _0x13ddf4 = _0x3e1dbc();
            if (_0x13ddf4) {
              _0x13ddf4.webContents.send("ai-quota-updated");
              _0x13ddf4.webContents.send("ai-retry-status", {
                status: "failed",
                count: _0xf796d,
                msg: _0xa2af67
              });
            }
            _0x356f2e("🌐 后端 AI：分析终止（" + _0x356676(_0xa2af67) + "）", _0x1135c5);
            return {
              success: false,
              msg: "AI 分析失败: " + _0xa2af67
            };
          }
          const _0x45318a = _0x3e1dbc();
          if (_0x45318a) {
            _0x45318a.webContents.send("ai-retry-status", {
              status: "retrying",
              count: _0xf796d,
              msg: _0xa2af67
            });
          }
          if (_0xf88fe0(_0x2bed00)) {
            _0x356f2e("🌐 后端 AI：任务已停止，终止分析重试", _0x1135c5);
            return {
              success: false,
              msg: "AI 分析已取消（任务已停止）",
              cancelled: true
            };
          }
          _0x356f2e("⏱ 后端 AI：" + _0x61278f / 1000 + " 秒后重试（第 " + _0xf796d + " 次失败）…", _0x1135c5);
          const _0x3136e2 = await _0x22e0ca(_0x61278f, _0x2bed00);
          if (!_0x3136e2) {
            _0x356f2e("🌐 后端 AI：任务已停止，终止分析重试", _0x1135c5);
            return {
              success: false,
              msg: "AI 分析已取消（任务已停止）",
              cancelled: true
            };
          }
        }
      }
    });
    ipcMain.handle("ai-match-video-context", async (_0x2946fe, _0x2b4cc3) => {
      const _0x2b3e2f = _0x1adc8f();
      const {
        videoTitle = "",
        comments = [],
        authorNickname = "",
        keywords = "",
        config = {},
        matchScene = "leadgen_persona",
        withMainPost = false
      } = _0x2b4cc3 || {};
      const _0x461c2d = _0x4e0893(_0x2946fe, _0x2b4cc3);
      const _0x47770a = String(videoTitle || "").trim() || "未知视频";
      const _0x137c35 = Array.isArray(comments) ? comments.map(_0x12a005 => String(_0x12a005 || "").trim()).filter(Boolean).slice(0, 10) : [];
      const _0x3e7b94 = !!withMainPost && matchScene === "leadgen_persona";
      let _0x425048;
      if (matchScene !== "leadgen_persona" && config.aiStyle && config.aiStyle.trim()) {
        _0x425048 = "身份: 抖音获客视频预筛专家; 目的: 筛选符合特征的视频: " + config.aiStyle + "; 要求: 精准、谨慎、只拦截明显不匹配的视频";
      } else {
        _0x425048 = _0x110cbd(config, {
          aiRole: "抖音获客视频预筛专家",
          aiGoal: "判断视频评论区是否聚集了与智能体人设匹配的目标人群",
          aiStyle: "精准、谨慎、只拦截明显不匹配内容"
        });
      }
      let _0x1428d6 = "";
      if (_0x3e7b94) {
        if (config.videoPrompt) {
          _0x1428d6 = config.videoPrompt;
        } else if (config.videoGoal || config.videoStyle) {
          const _0x3076ad = config.videoGoal || config.aiGoal || "生成高质量、自然且安全的主贴评论";
          const _0x5cfcea = config.videoStyle || config.aiStyle || "简洁、真诚、有互动感";
          _0x1428d6 = "身份: " + (config.aiRole || "短视频评论互动专家") + "; 目的: " + _0x3076ad + "; 风格: " + _0x5cfcea;
        } else {
          _0x1428d6 = config.aiPrompt || _0x110cbd(config, {
            aiRole: "短视频评论互动专家",
            aiGoal: "生成高质量、自然且安全的主贴评论",
            aiStyle: "简洁、真诚、有互动感"
          });
        }
      }
      const _0x4d3497 = 10000;
      let _0xf5654e = 0;
      const _0x2c7ced = _0x4a4f97();
      const _0x1988b1 = _0x3e7b94 ? 180000 : 90000;
      while (true) {
        if (_0xf88fe0(_0x2c7ced)) {
          console.log("[AI-VideoMatch] 任务已停止，终止预筛分析重试");
          _0x356f2e("🌐 后端 AI：任务已停止，终止预筛分析重试", _0x461c2d);
          return {
            success: false,
            pass: false,
            score: 0,
            reason: "视频预筛取消（任务已停止）",
            mainPostComment: ""
          };
        }
        _0xf5654e += 1;
        try {
          const _0x5fd6c7 = _0x3e7b94 ? "视频预筛+主评" : "视频预筛";
          _0x356f2e("🌐 后端 AI：" + _0x5fd6c7 + "中…", _0x461c2d);
          const _0x49ebe5 = async _0x4563cb => {
            const _0x5b3019 = _0x3302ce();
            return await _0x2c7911(_0x2b3e2f + "/radar/ai/v2/video-match", {
              intent: _0x425048,
              video_title: _0x47770a,
              author_nickname: String(authorNickname || "").trim(),
              keywords: String(keywords || _0x3a5358()?.keywords || "").trim(),
              top_comments: _0x137c35,
              with_main_post: _0x3e7b94,
              main_post_intent: _0x1428d6
            }, _0x1988b1);
          };
          let _0x41dc22 = _0x1be971.get("auth_token");
          let _0x49ef80;
          try {
            _0x49ef80 = await _0x49ebe5(_0x41dc22);
          } catch (_0x3d4c90) {
            if (_0x3d4c90.response?.status === 401) {
              console.log("[AI-VideoMatch] Token 过期，正在自动刷新...");
              await _0x1a1f66();
              _0x41dc22 = _0x1be971.get("auth_token");
              _0x49ef80 = await _0x49ebe5(_0x41dc22);
            } else {
              throw _0x3d4c90;
            }
          }
          const _0x203f08 = _0xcc853e(_0x49ef80, "视频预筛完成");
          if (_0x203f08.success) {
            if (_0x203f08.pass) {
              const _0x3ec506 = _0x3e7b94 ? _0x203f08.mainPostComment ? "，已生成主评" : "，主评待补生成" : "";
              _0x356f2e("🌐 后端 AI：视频预筛通过" + _0x3ec506, _0x461c2d);
            } else {
              _0x356f2e("🌐 后端 AI：视频预筛不匹配，已跳过", _0x461c2d);
            }
            const _0x50d159 = _0x3e1dbc();
            if (_0x50d159) {
              _0x50d159.webContents.send("ai-quota-updated");
            }
            return _0x203f08;
          }
          throw new Error(_0x203f08.reason || "后端预筛返回失败");
        } catch (_0x402a17) {
          const _0x3b6911 = _0x402a17.response?.data?.msg || _0x402a17.message || "视频预筛异常";
          console.error("[AI-VideoMatch] 第 " + _0xf5654e + " 次预筛失败:", _0x3b6911);
          _0x356f2e("🌐 后端 AI：视频预筛第 " + _0xf5654e + " 次失败：" + _0x356676(_0x3b6911, 48), _0x461c2d);
          if (_0xedc75f(_0x3b6911)) {
            console.warn("[AI-VideoMatch] 监测到致命授权/额度错误，终止预筛并返回不匹配");
            const _0x5769bf = _0x3e1dbc();
            if (_0x5769bf) {
              _0x5769bf.webContents.send("ai-quota-updated");
            }
            _0x356f2e("🌐 后端 AI：预筛终止（" + _0x356676(_0x3b6911) + "），视频不予放行", _0x461c2d);
            return {
              success: false,
              pass: false,
              score: 0,
              reason: _0x3b6911,
              mainPostComment: ""
            };
          }
          if (_0xf88fe0(_0x2c7ced)) {
            _0x356f2e("🌐 后端 AI：任务已停止，终止预筛分析重试", _0x461c2d);
            return {
              success: false,
              pass: false,
              score: 0,
              reason: "视频预筛取消（任务已停止）",
              mainPostComment: ""
            };
          }
          _0x356f2e("⏱ 后端 AI：" + _0x4d3497 / 1000 + " 秒后重试预筛（第 " + _0xf5654e + " 次失败）…", _0x461c2d);
          const _0x1f8f68 = await _0x22e0ca(_0x4d3497, _0x2c7ced);
          if (!_0x1f8f68) {
            _0x356f2e("🌐 后端 AI：任务已停止，终止预筛分析重试", _0x461c2d);
            return {
              success: false,
              pass: false,
              score: 0,
              reason: "视频预筛取消（任务已停止）",
              mainPostComment: ""
            };
          }
        }
      }
    });
    ipcMain.handle("ai-match-lead-profile", async (_0x507897, _0x2de2e0) => {
      const {
        lead = {},
        videoTitle = "",
        config = {}
      } = _0x2de2e0 || {};
      const _0x3375b4 = _0x4e0893(_0x507897, _0x2de2e0) || lead?.accountId || "default";
      const _0x3b4f1f = String(videoTitle || lead?.title || lead?.videoTitle || "").trim() || "未知视频";
      const _0x5dce33 = lead?.worksCount !== null && lead?.worksCount !== undefined && Number.isFinite(Number(lead.worksCount)) && Number(lead.worksCount) >= 0 ? Number(lead.worksCount) : null;
      const _0x512429 = _0x110cbd(config, {
        aiRole: "抖音获客用户画像判断专家",
        aiGoal: "判断评论者是否符合当前智能体的目标客户画像",
        aiStyle: "精准、克制、只拦截明显不匹配用户"
      });
      const _0x51dbf7 = 10000;
      let _0x1fc956 = 0;
      const _0xc78b3e = _0x4a4f97();
      while (true) {
        if (_0xf88fe0(_0xc78b3e)) {
          console.log("[AI-LeadMatch] 任务已停止，终止用户画像分析重试");
          _0x356f2e("🌐 后端 AI：任务已停止，终止用户画像分析重试", _0x3375b4);
          return {
            success: false,
            pass: false,
            score: 0,
            reason: "画像判断取消（任务已停止）"
          };
        }
        _0x1fc956 += 1;
        try {
          _0x356f2e("🌐 后端 AI：画像判断 @" + _0x356676(lead?.nickname || "未知用户", 24) + " [第 " + _0x1fc956 + " 次尝试]…", _0x3375b4);
          const _0x3ccc88 = async _0x472bbe => {
            const _0x55d236 = _0x3302ce();
            const _0x3048e5 = _0x3a5358();
            return await _0x2c7911(_0x1adc8f() + "/radar/ai/lead-match", {
              intent: _0x512429,
              video_title: _0x3b4f1f,
              lead: {
                videoTitle: _0x3b4f1f,
                nickname: String(lead?.nickname || "").trim(),
                videoUrl: String(lead?.videoUrl || lead?.url || "").trim(),
                content: String(lead?.content || "").trim(),
                commentTime: String(lead?.commentTime || lead?.timeText || "").trim(),
                userUrl: String(lead?.userUrl || "").trim(),
                videoAuthor: String(lead?.videoAuthor || "").trim(),
                accountName: String(lead?.accountName || _0x3048e5?.nickname || _0x3048e5?.name || "未知账号").trim(),
                signature: String(lead?.signature || "").trim(),
                contact: String(lead?.contact || "").trim(),
                douyinId: String(lead?.douyinId || "").trim(),
                location: String(lead?.location || lead?.ipLocation || "").trim(),
                gender: String(lead?.gender || "").trim(),
                worksCount: _0x5dce33
              }
            }, 90000);
          };
          let _0x3f298f = _0x1be971.get("auth_token");
          let _0x157bab;
          try {
            _0x157bab = await _0x3ccc88(_0x3f298f);
          } catch (_0x590414) {
            if (_0x590414.response?.status === 401) {
              console.log("[AI-LeadMatch] Token 过期，正在自动刷新...");
              await _0x1a1f66();
              _0x3f298f = _0x1be971.get("auth_token");
              _0x157bab = await _0x3ccc88(_0x3f298f);
            } else {
              throw _0x590414;
            }
          }
          const _0x33dc26 = _0xcc853e(_0x157bab, "画像判断完成");
          if (_0x33dc26.success) {
            const _0x1fb3ea = _0x33dc26.pass ? "通过" : "跳过";
            _0x356f2e("🌐 后端 AI：画像判断" + _0x1fb3ea + "（" + _0x33dc26.score + "分，" + _0x356676(_0x33dc26.reason, 48) + "）", _0x3375b4);
            const _0x58e513 = _0x3e1dbc();
            if (_0x58e513) {
              _0x58e513.webContents.send("ai-quota-updated");
            }
            return _0x33dc26;
          }
          throw new Error(_0x33dc26.reason || "后端画像判断返回失败");
        } catch (_0x534450) {
          const _0x1eb255 = _0x534450.response?.data?.msg || _0x534450.message || "画像判断异常";
          console.error("[AI-LeadMatch] 第 " + _0x1fc956 + " 次画像判断失败:", _0x1eb255);
          _0x356f2e("🌐 后端 AI：画像判断第 " + _0x1fc956 + " 次失败：" + _0x356676(_0x1eb255, 48), _0x3375b4);
          if (_0xedc75f(_0x1eb255)) {
            console.warn("[AI-LeadMatch] 监测到致命授权/额度错误，终止画像判断并返回不匹配");
            const _0x3cf210 = _0x3e1dbc();
            if (_0x3cf210) {
              _0x3cf210.webContents.send("ai-quota-updated");
            }
            _0x356f2e("🌐 后端 AI：画像判断终止（" + _0x356676(_0x1eb255) + "），用户不予通过", _0x3375b4);
            return {
              success: false,
              pass: false,
              score: 0,
              reason: _0x1eb255
            };
          }
          if (_0xf88fe0(_0xc78b3e)) {
            _0x356f2e("🌐 后端 AI：任务已停止，终止用户画像分析重试", _0x3375b4);
            return {
              success: false,
              pass: false,
              score: 0,
              reason: "画像判断取消（任务已停止）"
            };
          }
          _0x356f2e("⏱ 后端 AI：" + _0x51dbf7 / 1000 + " 秒后重试画像判断（第 " + _0x1fc956 + " 次失败）…", _0x3375b4);
          const _0x3f6f39 = await _0x22e0ca(_0x51dbf7, _0xc78b3e);
          if (!_0x3f6f39) {
            _0x356f2e("🌐 后端 AI：任务已停止，终止用户画像分析重试", _0x3375b4);
            return {
              success: false,
              pass: false,
              score: 0,
              reason: "画像判断取消（任务已停止）"
            };
          }
        }
      }
    });
    ipcMain.handle("ai-generate-fresh-dm-reply", async (_0x45baf7, _0x165bd) => {
      const {
        config = {},
        accountId = "",
        account = {},
        nickname = "",
        userUrl = "",
        chatHistory = "",
        text = "",
        forDm = true
      } = _0x165bd || {};
      return _0x422ceb(config, accountId, account, {
        title: "自热互动通知",
        url: ""
      }, {
        nickname: nickname,
        text: text,
        userUrl: userUrl,
        chatHistory: chatHistory
      }, {
        forDm: forDm,
        aiScene: "self_warmup"
      });
    });
    ipcMain.handle("ai-generate-video-comment", async (_0x163b80, _0x35157f) => {
      const _0x48e746 = _0x1adc8f();
      const {
        videoTitle: _0x3e1de8,
        comments = [],
        config = {},
        generationMode = "main_post_comment"
      } = _0x35157f || {};
      const _0x242a63 = _0x4e0893(_0x163b80, _0x35157f);
      const _0x218036 = (_0x3e1de8 || "").trim() || "未知视频";
      const _0x47d4d9 = generationMode === "profile_first_comment" ? "profile_first_comment" : "main_post_comment";
      const _0x499eae = _0x47d4d9 === "profile_first_comment" ? "首作品评论" : "视频主评";
      const _0x4fe621 = Date.now();
      const _0x3e9c3d = Array.isArray(comments) ? comments.filter(Boolean).slice(0, 8) : [];
      let _0x2e1420 = "";
      if (_0x47d4d9 === "profile_first_comment") {
        if (config.firstPostPrompt) {
          _0x2e1420 = config.firstPostPrompt;
        } else if (config.firstPostGoal || config.firstPostStyle) {
          const _0x5b0f87 = config.firstPostGoal || config.aiGoal || "生成高质量、自然且安全的首贴评论";
          const _0x406195 = config.firstPostStyle || config.aiStyle || "简洁、真诚、有互动感";
          _0x2e1420 = "身份: " + (config.aiRole || "短视频评论互动专家") + "; 目的: " + _0x5b0f87 + "; 风格: " + _0x406195;
        } else {
          _0x2e1420 = config.aiPrompt;
          if (!_0x2e1420) {
            _0x2e1420 = "身份: " + (config.aiRole || "短视频评论互动专家") + "; 目的: " + (config.aiGoal || "生成高质量、自然且安全的首贴评论") + "; 风格: " + (config.aiStyle || "简洁、真诚、有互动感");
          }
        }
      } else if (config.videoPrompt) {
        _0x2e1420 = config.videoPrompt;
      } else if (config.videoGoal || config.videoStyle) {
        const _0x5ab73a = config.videoGoal || config.aiGoal || "生成高质量、自然且安全的主贴评论";
        const _0x207e78 = config.videoStyle || config.aiStyle || "简洁、真诚、有互动感";
        _0x2e1420 = "身份: " + (config.aiRole || "短视频评论互动专家") + "; 目的: " + _0x5ab73a + "; 风格: " + _0x207e78;
      } else {
        _0x2e1420 = config.aiPrompt;
        if (!_0x2e1420) {
          _0x2e1420 = "身份: " + (config.aiRole || "短视频评论互动专家") + "; 目的: " + (config.aiGoal || "生成高质量、自然且安全的主贴评论") + "; 风格: " + (config.aiStyle || "简洁、真诚、有互动感");
        }
      }
      const _0x4f5925 = [{
        videoTitle: _0x218036,
        nickname: "主贴评论生成",
        videoUrl: "",
        content: _0x3e9c3d.length ? "评论区样本：" + _0x3e9c3d.join(" | ") : "评论区样本为空，请根据视频标题生成自然评论。",
        commentTime: "",
        userUrl: "",
        videoAuthor: "",
        accountName: "ai-video-comment"
      }];
      const _0x83e235 = async _0x5599a8 => {
        const _0x3354d0 = _0x3302ce();
        const _0x13cef7 = _0x3a5358();
        return await _0x4622a4.post(_0x48e746 + "/radar/ai/v2/comment-decision", {
          intent: _0x2e1420,
          video_title: _0x218036,
          keywords: _0x13cef7?.keywords || "",
          accountName: _0x13cef7?.nickname || _0x13cef7?.name || "未知账号",
          generationMode: _0x47d4d9,
          leads: _0x4f5925
        }, {
          headers: _0x334501(_0x5599a8, _0x3354d0),
          timeout: 120000
        });
      };
      const _0x300b0f = 10000;
      const _0x2c71c1 = _0x4a4f97();
      _0x356f2e("🌐 后端 AI：正在生成" + _0x499eae + "…", _0x242a63);
      try {
        let _0x2e23e0 = _0x1be971.get("auth_token");
        let _0x3c7009 = 0;
        let _0x25b72b = "";
        while (true) {
          if (_0xf88fe0(_0x2c71c1)) {
            _0x356f2e("🌐 后端 AI：任务已停止，终止视频主评重试", _0x242a63);
            return {
              success: false,
              msg: "AI 生成已取消（任务已停止）",
              cancelled: true
            };
          }
          _0x3c7009 += 1;
          try {
            if (_0xf88fe0(_0x2c71c1)) {
              _0x356f2e("🌐 后端 AI：任务已停止，取消本次视频主评请求", _0x242a63);
              return {
                success: false,
                msg: "AI 生成已取消（任务已停止）",
                cancelled: true
              };
            }
            let _0x5cccfa;
            try {
              _0x5cccfa = await _0x83e235(_0x2e23e0);
            } catch (_0x49c634) {
              if (_0x49c634.response?.status === 401) {
                await _0x1a1f66();
                _0x2e23e0 = _0x1be971.get("auth_token");
                _0x5cccfa = await _0x83e235(_0x2e23e0);
              } else {
                throw _0x49c634;
              }
            }
            const _0x15c23b = _0x5e5bb7(_0x5cccfa);
            const _0x19412d = _0x15c23b?.data?.[0];
            const _0x1fb974 = (_0x19412d?.replyContent || "").trim();
            if (_0x15c23b.success && _0x1fb974) {
              const _0x196d73 = ((Date.now() - _0x4fe621) / 1000).toFixed(1);
              _0x356f2e("🌐 后端 AI：" + _0x499eae + "生成成功（" + _0x196d73 + " 秒）", _0x242a63);
              const _0x5019bc = _0x3e1dbc();
              if (_0x5019bc) {
                _0x5019bc.webContents.send("ai-quota-updated");
              }
              if (_0x3c7009 > 1) {
                console.log("[AI主贴评论] 第 " + _0x3c7009 + " 次尝试成功");
              }
              return {
                success: true,
                content: _0x1fb974,
                thought: _0x19412d.aiThought || ""
              };
            }
            _0x25b72b = _0x15c23b?.msg || "AI 未生成可用评论";
            console.warn("[AI主贴评论] 第 " + _0x3c7009 + " 次返回不可用结果: " + _0x25b72b);
          } catch (_0x235fca) {
            _0x25b72b = _0x235fca.response?.data?.msg || _0x235fca.message || "AI 生成失败";
            console.warn("[AI主贴评论] 第 " + _0x3c7009 + " 次请求失败: " + _0x25b72b);
          }
          if (_0xedc75f(_0x25b72b)) {
            _0x356f2e("🌐 后端 AI：视频主评终止（" + _0x356676(_0x25b72b) + "）", _0x242a63);
            return {
              success: false,
              msg: _0x25b72b
            };
          }
          if (_0xf88fe0(_0x2c71c1)) {
            _0x356f2e("🌐 后端 AI：任务已停止，终止视频主评重试", _0x242a63);
            return {
              success: false,
              msg: "AI 生成已取消（任务已停止）",
              cancelled: true
            };
          }
          _0x356f2e("⏱ 后端 AI：视频主评第 " + _0x3c7009 + " 次未成功（" + _0x356676(_0x25b72b) + "），" + _0x300b0f / 1000 + " 秒后重试…", _0x242a63);
          const _0x34bf20 = await _0x22e0ca(_0x300b0f, _0x2c71c1);
          if (!_0x34bf20) {
            _0x356f2e("🌐 后端 AI：任务已停止，终止视频主评重试", _0x242a63);
            return {
              success: false,
              msg: "AI 生成已取消（任务已停止）",
              cancelled: true
            };
          }
        }
      } catch (_0x583f8c) {
        const _0x4523d4 = _0x583f8c.response?.data?.msg || _0x583f8c.message || "AI 生成失败";
        _0x356f2e("🌐 后端 AI：视频主评异常：" + _0x356676(_0x4523d4), _0x242a63);
        return {
          success: false,
          msg: _0x4523d4
        };
      }
    });
  }
  return {
    registerIpc: _0x759ee6,
    pushAutomationTrace: _0x356f2e,
    postRadarAiJson: _0x2c7911,
    clipAutomationTraceText: _0x356676,
    isFatalAiAuthError: _0xedc75f,
    parseRadarMatchResponse: _0xcc853e,
    handleAiResponse: _0x5e5bb7,
    buildRuntimeAiIntent: _0x110cbd,
    resolveTraceAccountIdFromIpc: _0x4e0893,
    captureAutomationAiInvokeGeneration: _0x4a4f97,
    cancelAutomationAiRetry: _0x458822,
    isAutomationAiInvokeCancelled: _0xf88fe0,
    sleepWithAutomationAiCancel: _0x22e0ca
  };
}
module.exports = {
  createRadarAi: createRadarAi
};
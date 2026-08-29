'use strict';

const {
  ipcMain
} = require("electron");
function createRadarAi(arg1) {
  const {
    store: store,
    getApiBase: getApiBase,
    getMainWindow: getMainWindow,
    getActiveSettings: getActiveSettings,
    getPlatformViews: getPlatformViews,
    getViewSettingsMap: getViewSettingsMap,
    getInteractionViewsMap: getInteractionViewsMap,
    radarDeviceHeaders: radarDeviceHeaders,
    getRobustDeviceID: getRobustDeviceID,
    autoLogin: autoLogin,
    resolveActiveBatchRunId: resolveActiveBatchRunId,
    appendBatchFollowLog: appendBatchFollowLog,
    generateMonitorPersonaContent: generateMonitorPersonaContent
  } = arg1;
  const local = arg1.axios || require("axios");
  function clipAutomationTraceText(arg1, num = 100) {
    const result = String(arg1 || "").trim();
    if (!result) {
      return "";
    }
    if (result.length > num) {
      return result.slice(0, num) + "…";
    } else {
      return result;
    }
  }
  function isFatalAiAuthError(arg1) {
    if (!arg1) {
      return false;
    }
    const result = String(arg1);
    return result.includes("额度已用完") || result.includes("已用完") || result.includes("卡密已过期") || result.includes("授权码无效") || result.includes("设备已被封") || result.includes("余额不足") || result.includes("未授权");
  }
  let num = 0;
  function captureAutomationAiInvokeGeneration() {
    return num;
  }
  function cancelAutomationAiRetry() {
    num += 1;
  }
  function isAutomationAiInvokeCancelled(arg1) {
    return arg1 !== num;
  }
  async function sleepWithAutomationAiCancel(arg1, arg2) {
    const num = 400;
    let local = arg1;
    while (local > 0) {
      if (isAutomationAiInvokeCancelled(arg2)) {
        return false;
      }
      const result = Math.min(num, local);
      await new Promise(arg1 => setTimeout(arg1, result));
      local -= result;
    }
    return !isAutomationAiInvokeCancelled(arg2);
  }
  function pushAutomationTrace(arg1, arg2, options = {}) {
    const result = String(arg1 || "").trim();
    if (!result) {
      return;
    }
    const result2 = getActiveSettings();
    const local = arg2 || result2?.accountId || "default";
    const result3 = resolveActiveBatchRunId(options.viewKey, options.runId ?? options.batchRunId);
    if (result3 != null && options.persist !== false) {
      appendBatchFollowLog(result3, {
        message: result,
        level: options.level || "normal",
        accountId: local,
        accountName: options.accountName || "",
        viewKey: options.viewKey || "",
        leadId: options.leadId || "",
        leadName: options.leadName || "",
        phase: options.phase || "trace"
      });
    }
    const result4 = getMainWindow();
    if (!result4 || result4.isDestroyed()) {
      return;
    }
    result4.webContents.send("automation-data", {
      type: "trace-log",
      payload: {
        accountId: local,
        message: result,
        level: options.level || "normal",
        runId: result3 ?? undefined,
        batchRunId: result3 ?? undefined
      }
    });
  }
  function resolveTraceAccountIdFromIpc(arg1, options = {}) {
    if (options?.accountId) {
      return options.accountId;
    }
    const local = arg1?.sender;
    if (local && !local.isDestroyed?.()) {
      const result = getPlatformViews();
      const result2 = getViewSettingsMap();
      const result3 = getInteractionViewsMap();
      for (const [local2, local3] of result.entries()) {
        if (local3?.webContents === local) {
          const result = result2.get(local2);
          if (result?.accountId) {
            return result.accountId;
          }
          const result3 = local2.split("_");
          if (result3.length > 1) {
            return result3.slice(1).join("_");
          }
        }
      }
      for (const [local2, local3] of result3.entries()) {
        if (local3?.webContents === local) {
          const result = result2.get(local2);
          if (result?.accountId) {
            return result.accountId;
          }
          const result3 = local2.split("_");
          if (result3.length > 1) {
            return result3.slice(1).join("_");
          }
        }
      }
    }
    return getActiveSettings()?.accountId || "default";
  }
  function buildRuntimeAiIntent(options = {}, options2 = {}) {
    const result = String(options?.aiPrompt || "").trim();
    if (result) {
      return result;
    }
    const local = options?.aiRole || options2.aiRole || "专业获客评论互动顾问";
    const local2 = options?.aiGoal || options?.aiPurpose || options2.aiGoal || "识别更匹配业务人设的潜在客户并进行自然互动";
    const local3 = options?.aiStyle || options2.aiStyle || "真诚、克制、精准、合规";
    return "身份: " + local + "; 目的: " + local2 + "; 要求: " + local3;
  }
  async function postRadarAiJson(arg1, arg2, num = 60000) {
    const result = getRobustDeviceID();
    let result2 = store.get("auth_token");
    try {
      return await local.post(arg1, arg2, {
        headers: radarDeviceHeaders(result2, result),
        timeout: num
      });
    } catch (error) {
      if (error.response?.status === 401) {
        await autoLogin();
        result2 = store.get("auth_token");
        return await local.post(arg1, arg2, {
          headers: radarDeviceHeaders(result2, result),
          timeout: num
        });
      }
      throw error;
    }
  }
  function parseRadarMatchResponse(arg1, text = "AI 判断完成") {
    const local = arg1?.data?.data;
    if (arg1?.data?.code === 200 && local) {
      return {
        success: true,
        pass: local.pass !== false,
        score: Number(local.score || 0),
        reason: local.reason || text,
        mainPostComment: String(local.main_post_comment || local.mainPostComment || "").trim()
      };
    }
    return {
      success: false,
      pass: false,
      score: 0,
      reason: arg1?.data?.msg || "后端未返回有效判断，未放行",
      mainPostComment: ""
    };
  }
  function handleAiResponse(arg1) {
    try {
      if (arg1.data.code === 200 && arg1.data.data) {
        const value = Array.isArray(arg1.data.data) ? arg1.data.data : [arg1.data.data];
        const result = value.map(arg1 => {
          let text = "ignore";
          if (arg1.should_like && arg1.should_reply) {
            text = "both";
          } else if (arg1.should_like) {
            text = "like";
          } else if (arg1.should_reply) {
            text = "reply";
          }
          return {
            decision: text,
            replyContent: arg1.reply_content,
            aiThought: arg1.thought
          };
        });
        console.log("[AI-Analyze] 批量映射成功 (动作互斥已生效)，最终决策量: " + result.length);
        console.log("[AI-Analyze] -----------------------------------------");
        return {
          success: true,
          data: result
        };
      }
      return {
        success: false,
        msg: arg1.data.msg || "后端分析返回异常"
      };
    } catch (error) {
      console.error("[AI-Analyze] 批量调用结果解析失败: " + error.message);
      return {
        success: false,
        msg: error.message
      };
    }
  }
  function registerIpc() {
    ipcMain.handle("ai-intelligent-analyze-batch", async (arg1, arg2) => {
      const result = getApiBase();
      const {
        leads: leads,
        config: config,
        generationMode = ""
      } = arg2;
      if (!leads || leads.length === 0) {
        return {
          success: true,
          data: []
        };
      }
      const result2 = resolveTraceAccountIdFromIpc(arg1, arg2);
      const result3 = Date.now();
      const value = generationMode === "keyword_reply_only";
      const value2 = value ? "关键词匹配回复生成" : "评论分析";
      pushAutomationTrace("🌐 后端 AI：提交 " + leads.length + " 条" + value2 + "…", result2);
      let value3 = config.aiPrompt;
      if (!value3) {
        value3 = "身份: " + (config.aiRole || "专业营销人员") + "; 目的: " + (config.aiGoal || "寻找有真实服务/产品需求的潜在客户") + "; 要求: " + (config.aiStyle || "专业、精准、严谨");
      }
      const value4 = leads[0].title;
      const result4 = getActiveSettings();
      const local2 = result4?.keywords || "未知关键字";
      const local3 = result4?.nickname || result4?.name || leads[0]?.accountName || "未知账号";
      console.log("[AI-Analyze] -----------------------------------------");
      console.log("[AI-Analyze] 发起批量" + value2 + " (" + leads.length + " 条" + (value ? ", mode=keyword_reply_only" : "") + ")");
      const local4 = async arg1 => {
        const result2 = getRobustDeviceID();
        const result3 = leads.map(arg1 => ({
          videoTitle: arg1.title,
          nickname: arg1.nickname,
          videoUrl: arg1.url,
          content: arg1.content,
          commentTime: arg1.timeText,
          userUrl: arg1.userUrl,
          videoAuthor: "",
          accountName: arg1.accountName || local3,
          signature: arg1.signature || "",
          chatHistory: arg1.chatHistory || "",
          contact: arg1.contact || "",
          douyinId: arg1.douyinId || "",
          location: arg1.location || arg1.ipLocation || "",
          gender: arg1.gender || "",
          worksCount: arg1.worksCount !== null && arg1.worksCount !== undefined && Number.isFinite(Number(arg1.worksCount)) && Number(arg1.worksCount) >= 0 ? Number(arg1.worksCount) : null
        }));
        return await local.post(result + "/radar/ai/v2/comment-decision", {
          intent: value3,
          video_title: value4,
          keywords: local2,
          accountName: local3,
          leads: result3,
          ...(generationMode ? {
            generationMode: generationMode
          } : {})
        }, {
          headers: radarDeviceHeaders(arg1, result2),
          timeout: 300000
        });
      };
      const num = 10000;
      let num2 = 0;
      const result5 = captureAutomationAiInvokeGeneration();
      while (true) {
        if (isAutomationAiInvokeCancelled(result5)) {
          console.log("[AI-Analyze] 任务已停止，终止分析重试");
          pushAutomationTrace("🌐 后端 AI：任务已停止，终止分析重试", result2);
          return {
            success: false,
            msg: "AI 分析已取消（任务已停止）",
            cancelled: true
          };
        }
        num2 += 1;
        try {
          let result = store.get("auth_token");
          let local;
          try {
            local = await local4(result);
          } catch (error) {
            if (error.response?.status === 401) {
              console.log("[AI-Analyze] Token 过期，正在自动刷新...");
              await autoLogin();
              result = store.get("auth_token");
              local = await local4(result);
            } else {
              throw error;
            }
          }
          const result4 = handleAiResponse(local);
          if (result4.success) {
            const result = ((Date.now() - result3) / 1000).toFixed(1);
            pushAutomationTrace("🌐 后端 AI：" + value2 + "完成（" + leads.length + " 条，耗时 " + result + "s）", result2);
            const result5 = getMainWindow();
            if (result5) {
              result5.webContents.send("ai-quota-updated");
              if (num2 > 1) {
                result5.webContents.send("ai-retry-status", {
                  status: "success"
                });
              }
            }
            return result4;
          }
          throw new Error(result4.msg || "后端分析异常");
        } catch (error) {
          const local = error.response?.data?.msg || error.message;
          console.error("[AI-Analyze] 第 " + num2 + " 次尝试失败:", local);
          pushAutomationTrace("🌐 后端 AI：第 " + num2 + " 次失败：" + clipAutomationTraceText(local), result2);
          if (isFatalAiAuthError(local)) {
            console.warn("[AI-Analyze] 监测到致命授权/额度错误，终止重试");
            const result = getMainWindow();
            if (result) {
              result.webContents.send("ai-quota-updated");
              result.webContents.send("ai-retry-status", {
                status: "failed",
                count: num2,
                msg: local
              });
            }
            pushAutomationTrace("🌐 后端 AI：分析终止（" + clipAutomationTraceText(local) + "）", result2);
            return {
              success: false,
              msg: "AI 分析失败: " + local
            };
          }
          const result = getMainWindow();
          if (result) {
            result.webContents.send("ai-retry-status", {
              status: "retrying",
              count: num2,
              msg: local
            });
          }
          if (isAutomationAiInvokeCancelled(result5)) {
            pushAutomationTrace("🌐 后端 AI：任务已停止，终止分析重试", result2);
            return {
              success: false,
              msg: "AI 分析已取消（任务已停止）",
              cancelled: true
            };
          }
          pushAutomationTrace("⏱ 后端 AI：" + num / 1000 + " 秒后重试（第 " + num2 + " 次失败）…", result2);
          const result3 = await sleepWithAutomationAiCancel(num, result5);
          if (!result3) {
            pushAutomationTrace("🌐 后端 AI：任务已停止，终止分析重试", result2);
            return {
              success: false,
              msg: "AI 分析已取消（任务已停止）",
              cancelled: true
            };
          }
        }
      }
    });
    ipcMain.handle("ai-match-video-context", async (arg1, arg2) => {
      const result = getApiBase();
      const {
        videoTitle = "",
        comments = [],
        authorNickname = "",
        keywords = "",
        config = {},
        matchScene = "leadgen_persona",
        withMainPost = false
      } = arg2 || {};
      const result2 = resolveTraceAccountIdFromIpc(arg1, arg2);
      const local = String(videoTitle || "").trim() || "未知视频";
      const value = Array.isArray(comments) ? comments.map(arg1 => String(arg1 || "").trim()).filter(Boolean).slice(0, 10) : [];
      const local2 = !!withMainPost && matchScene === "leadgen_persona";
      let local3;
      if (matchScene !== "leadgen_persona" && config.aiStyle && config.aiStyle.trim()) {
        local3 = "身份: 抖音获客视频预筛专家; 目的: 筛选符合特征的视频: " + config.aiStyle + "; 要求: 精准、谨慎、只拦截明显不匹配的视频";
      } else {
        local3 = buildRuntimeAiIntent(config, {
          aiRole: "抖音获客视频预筛专家",
          aiGoal: "判断视频评论区是否聚集了与智能体人设匹配的目标人群",
          aiStyle: "精准、谨慎、只拦截明显不匹配内容"
        });
      }
      let text = "";
      if (local2) {
        if (config.videoPrompt) {
          text = config.videoPrompt;
        } else if (config.videoGoal || config.videoStyle) {
          const local = config.videoGoal || config.aiGoal || "生成高质量、自然且安全的主贴评论";
          const local2 = config.videoStyle || config.aiStyle || "简洁、真诚、有互动感";
          text = "身份: " + (config.aiRole || "短视频评论互动专家") + "; 目的: " + local + "; 风格: " + local2;
        } else {
          text = config.aiPrompt || buildRuntimeAiIntent(config, {
            aiRole: "短视频评论互动专家",
            aiGoal: "生成高质量、自然且安全的主贴评论",
            aiStyle: "简洁、真诚、有互动感"
          });
        }
      }
      const num = 10000;
      let num2 = 0;
      const result3 = captureAutomationAiInvokeGeneration();
      const value2 = local2 ? 180000 : 90000;
      while (true) {
        if (isAutomationAiInvokeCancelled(result3)) {
          console.log("[AI-VideoMatch] 任务已停止，终止预筛分析重试");
          pushAutomationTrace("🌐 后端 AI：任务已停止，终止预筛分析重试", result2);
          return {
            success: false,
            pass: false,
            score: 0,
            reason: "视频预筛取消（任务已停止）",
            mainPostComment: ""
          };
        }
        num2 += 1;
        try {
          const value3 = local2 ? "视频预筛+主评" : "视频预筛";
          pushAutomationTrace("🌐 后端 AI：" + value3 + "中…", result2);
          const local4 = async arg1 => {
            const result2 = getRobustDeviceID();
            return await postRadarAiJson(result + "/radar/ai/v2/video-match", {
              intent: local3,
              video_title: local,
              author_nickname: String(authorNickname || "").trim(),
              keywords: String(keywords || getActiveSettings()?.keywords || "").trim(),
              top_comments: value,
              with_main_post: local2,
              main_post_intent: text
            }, value2);
          };
          let result3 = store.get("auth_token");
          let local5;
          try {
            local5 = await local4(result3);
          } catch (error) {
            if (error.response?.status === 401) {
              console.log("[AI-VideoMatch] Token 过期，正在自动刷新...");
              await autoLogin();
              result3 = store.get("auth_token");
              local5 = await local4(result3);
            } else {
              throw error;
            }
          }
          const result4 = parseRadarMatchResponse(local5, "视频预筛完成");
          if (result4.success) {
            if (result4.pass) {
              const value = local2 ? result4.mainPostComment ? "，已生成主评" : "，主评待补生成" : "";
              pushAutomationTrace("🌐 后端 AI：视频预筛通过" + value, result2);
            } else {
              pushAutomationTrace("🌐 后端 AI：视频预筛不匹配，已跳过", result2);
            }
            const result = getMainWindow();
            if (result) {
              result.webContents.send("ai-quota-updated");
            }
            return result4;
          }
          throw new Error(result4.reason || "后端预筛返回失败");
        } catch (error) {
          const local = error.response?.data?.msg || error.message || "视频预筛异常";
          console.error("[AI-VideoMatch] 第 " + num2 + " 次预筛失败:", local);
          pushAutomationTrace("🌐 后端 AI：视频预筛第 " + num2 + " 次失败：" + clipAutomationTraceText(local, 48), result2);
          if (isFatalAiAuthError(local)) {
            console.warn("[AI-VideoMatch] 监测到致命授权/额度错误，终止预筛并返回不匹配");
            const result = getMainWindow();
            if (result) {
              result.webContents.send("ai-quota-updated");
            }
            pushAutomationTrace("🌐 后端 AI：预筛终止（" + clipAutomationTraceText(local) + "），视频不予放行", result2);
            return {
              success: false,
              pass: false,
              score: 0,
              reason: local,
              mainPostComment: ""
            };
          }
          if (isAutomationAiInvokeCancelled(result3)) {
            pushAutomationTrace("🌐 后端 AI：任务已停止，终止预筛分析重试", result2);
            return {
              success: false,
              pass: false,
              score: 0,
              reason: "视频预筛取消（任务已停止）",
              mainPostComment: ""
            };
          }
          pushAutomationTrace("⏱ 后端 AI：" + num / 1000 + " 秒后重试预筛（第 " + num2 + " 次失败）…", result2);
          const result = await sleepWithAutomationAiCancel(num, result3);
          if (!result) {
            pushAutomationTrace("🌐 后端 AI：任务已停止，终止预筛分析重试", result2);
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
    ipcMain.handle("ai-match-lead-profile", async (arg1, arg2) => {
      const {
        lead = {},
        videoTitle = "",
        config = {}
      } = arg2 || {};
      const local = resolveTraceAccountIdFromIpc(arg1, arg2) || lead?.accountId || "default";
      const local2 = String(videoTitle || lead?.title || lead?.videoTitle || "").trim() || "未知视频";
      const value = lead?.worksCount !== null && lead?.worksCount !== undefined && Number.isFinite(Number(lead.worksCount)) && Number(lead.worksCount) >= 0 ? Number(lead.worksCount) : null;
      const result = buildRuntimeAiIntent(config, {
        aiRole: "抖音获客用户画像判断专家",
        aiGoal: "判断评论者是否符合当前智能体的目标客户画像",
        aiStyle: "精准、克制、只拦截明显不匹配用户"
      });
      const num = 10000;
      let num2 = 0;
      const result2 = captureAutomationAiInvokeGeneration();
      while (true) {
        if (isAutomationAiInvokeCancelled(result2)) {
          console.log("[AI-LeadMatch] 任务已停止，终止用户画像分析重试");
          pushAutomationTrace("🌐 后端 AI：任务已停止，终止用户画像分析重试", local);
          return {
            success: false,
            pass: false,
            score: 0,
            reason: "画像判断取消（任务已停止）"
          };
        }
        num2 += 1;
        try {
          pushAutomationTrace("🌐 后端 AI：画像判断 @" + clipAutomationTraceText(lead?.nickname || "未知用户", 24) + " [第 " + num2 + " 次尝试]…", local);
          const local3 = async arg1 => {
            const result2 = getRobustDeviceID();
            const result3 = getActiveSettings();
            return await postRadarAiJson(getApiBase() + "/radar/ai/lead-match", {
              intent: result,
              video_title: local2,
              lead: {
                videoTitle: local2,
                nickname: String(lead?.nickname || "").trim(),
                videoUrl: String(lead?.videoUrl || lead?.url || "").trim(),
                content: String(lead?.content || "").trim(),
                commentTime: String(lead?.commentTime || lead?.timeText || "").trim(),
                userUrl: String(lead?.userUrl || "").trim(),
                videoAuthor: String(lead?.videoAuthor || "").trim(),
                accountName: String(lead?.accountName || result3?.nickname || result3?.name || "未知账号").trim(),
                signature: String(lead?.signature || "").trim(),
                contact: String(lead?.contact || "").trim(),
                douyinId: String(lead?.douyinId || "").trim(),
                location: String(lead?.location || lead?.ipLocation || "").trim(),
                gender: String(lead?.gender || "").trim(),
                worksCount: value
              }
            }, 90000);
          };
          let result2 = store.get("auth_token");
          let local4;
          try {
            local4 = await local3(result2);
          } catch (error) {
            if (error.response?.status === 401) {
              console.log("[AI-LeadMatch] Token 过期，正在自动刷新...");
              await autoLogin();
              result2 = store.get("auth_token");
              local4 = await local3(result2);
            } else {
              throw error;
            }
          }
          const result3 = parseRadarMatchResponse(local4, "画像判断完成");
          if (result3.success) {
            const value = result3.pass ? "通过" : "跳过";
            pushAutomationTrace("🌐 后端 AI：画像判断" + value + "（" + result3.score + "分，" + clipAutomationTraceText(result3.reason, 48) + "）", local);
            const result = getMainWindow();
            if (result) {
              result.webContents.send("ai-quota-updated");
            }
            return result3;
          }
          throw new Error(result3.reason || "后端画像判断返回失败");
        } catch (error) {
          const local2 = error.response?.data?.msg || error.message || "画像判断异常";
          console.error("[AI-LeadMatch] 第 " + num2 + " 次画像判断失败:", local2);
          pushAutomationTrace("🌐 后端 AI：画像判断第 " + num2 + " 次失败：" + clipAutomationTraceText(local2, 48), local);
          if (isFatalAiAuthError(local2)) {
            console.warn("[AI-LeadMatch] 监测到致命授权/额度错误，终止画像判断并返回不匹配");
            const result = getMainWindow();
            if (result) {
              result.webContents.send("ai-quota-updated");
            }
            pushAutomationTrace("🌐 后端 AI：画像判断终止（" + clipAutomationTraceText(local2) + "），用户不予通过", local);
            return {
              success: false,
              pass: false,
              score: 0,
              reason: local2
            };
          }
          if (isAutomationAiInvokeCancelled(result2)) {
            pushAutomationTrace("🌐 后端 AI：任务已停止，终止用户画像分析重试", local);
            return {
              success: false,
              pass: false,
              score: 0,
              reason: "画像判断取消（任务已停止）"
            };
          }
          pushAutomationTrace("⏱ 后端 AI：" + num / 1000 + " 秒后重试画像判断（第 " + num2 + " 次失败）…", local);
          const result = await sleepWithAutomationAiCancel(num, result2);
          if (!result) {
            pushAutomationTrace("🌐 后端 AI：任务已停止，终止用户画像分析重试", local);
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
    ipcMain.handle("ai-generate-fresh-dm-reply", async (arg1, arg2) => {
      const {
        config = {},
        accountId = "",
        account = {},
        nickname = "",
        userUrl = "",
        chatHistory = "",
        text = "",
        forDm = true
      } = arg2 || {};
      return generateMonitorPersonaContent(config, accountId, account, {
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
    ipcMain.handle("ai-generate-video-comment", async (arg1, arg2) => {
      const result = getApiBase();
      const {
        videoTitle: videoTitle,
        comments = [],
        config = {},
        generationMode = "main_post_comment"
      } = arg2 || {};
      const result2 = resolveTraceAccountIdFromIpc(arg1, arg2);
      const local2 = (videoTitle || "").trim() || "未知视频";
      const value = generationMode === "profile_first_comment" ? "profile_first_comment" : "main_post_comment";
      const value2 = value === "profile_first_comment" ? "首作品评论" : "视频主评";
      const result3 = Date.now();
      const value3 = Array.isArray(comments) ? comments.filter(Boolean).slice(0, 8) : [];
      let text = "";
      if (value === "profile_first_comment") {
        if (config.firstPostPrompt) {
          text = config.firstPostPrompt;
        } else if (config.firstPostGoal || config.firstPostStyle) {
          const local = config.firstPostGoal || config.aiGoal || "生成高质量、自然且安全的首贴评论";
          const local2 = config.firstPostStyle || config.aiStyle || "简洁、真诚、有互动感";
          text = "身份: " + (config.aiRole || "短视频评论互动专家") + "; 目的: " + local + "; 风格: " + local2;
        } else {
          text = config.aiPrompt;
          if (!text) {
            text = "身份: " + (config.aiRole || "短视频评论互动专家") + "; 目的: " + (config.aiGoal || "生成高质量、自然且安全的首贴评论") + "; 风格: " + (config.aiStyle || "简洁、真诚、有互动感");
          }
        }
      } else if (config.videoPrompt) {
        text = config.videoPrompt;
      } else if (config.videoGoal || config.videoStyle) {
        const local = config.videoGoal || config.aiGoal || "生成高质量、自然且安全的主贴评论";
        const local2 = config.videoStyle || config.aiStyle || "简洁、真诚、有互动感";
        text = "身份: " + (config.aiRole || "短视频评论互动专家") + "; 目的: " + local + "; 风格: " + local2;
      } else {
        text = config.aiPrompt;
        if (!text) {
          text = "身份: " + (config.aiRole || "短视频评论互动专家") + "; 目的: " + (config.aiGoal || "生成高质量、自然且安全的主贴评论") + "; 风格: " + (config.aiStyle || "简洁、真诚、有互动感");
        }
      }
      const list = [{
        videoTitle: local2,
        nickname: "主贴评论生成",
        videoUrl: "",
        content: value3.length ? "评论区样本：" + value3.join(" | ") : "评论区样本为空，请根据视频标题生成自然评论。",
        commentTime: "",
        userUrl: "",
        videoAuthor: "",
        accountName: "ai-video-comment"
      }];
      const local3 = async arg1 => {
        const result2 = getRobustDeviceID();
        const result3 = getActiveSettings();
        return await local.post(result + "/radar/ai/v2/comment-decision", {
          intent: text,
          video_title: local2,
          keywords: result3?.keywords || "",
          accountName: result3?.nickname || result3?.name || "未知账号",
          generationMode: value,
          leads: list
        }, {
          headers: radarDeviceHeaders(arg1, result2),
          timeout: 120000
        });
      };
      const num = 10000;
      const result4 = captureAutomationAiInvokeGeneration();
      pushAutomationTrace("🌐 后端 AI：正在生成" + value2 + "…", result2);
      try {
        let result = store.get("auth_token");
        let num2 = 0;
        let text = "";
        while (true) {
          if (isAutomationAiInvokeCancelled(result4)) {
            pushAutomationTrace("🌐 后端 AI：任务已停止，终止视频主评重试", result2);
            return {
              success: false,
              msg: "AI 生成已取消（任务已停止）",
              cancelled: true
            };
          }
          num2 += 1;
          try {
            if (isAutomationAiInvokeCancelled(result4)) {
              pushAutomationTrace("🌐 后端 AI：任务已停止，取消本次视频主评请求", result2);
              return {
                success: false,
                msg: "AI 生成已取消（任务已停止）",
                cancelled: true
              };
            }
            let local;
            try {
              local = await local3(result);
            } catch (error) {
              if (error.response?.status === 401) {
                await autoLogin();
                result = store.get("auth_token");
                local = await local3(result);
              } else {
                throw error;
              }
            }
            const result5 = handleAiResponse(local);
            const local2 = result5?.data?.[0];
            const result6 = (local2?.replyContent || "").trim();
            if (result5.success && result6) {
              const result = ((Date.now() - result3) / 1000).toFixed(1);
              pushAutomationTrace("🌐 后端 AI：" + value2 + "生成成功（" + result + " 秒）", result2);
              const result4 = getMainWindow();
              if (result4) {
                result4.webContents.send("ai-quota-updated");
              }
              if (num2 > 1) {
                console.log("[AI主贴评论] 第 " + num2 + " 次尝试成功");
              }
              return {
                success: true,
                content: result6,
                thought: local2.aiThought || ""
              };
            }
            text = result5?.msg || "AI 未生成可用评论";
            console.warn("[AI主贴评论] 第 " + num2 + " 次返回不可用结果: " + text);
          } catch (error) {
            text = error.response?.data?.msg || error.message || "AI 生成失败";
            console.warn("[AI主贴评论] 第 " + num2 + " 次请求失败: " + text);
          }
          if (isFatalAiAuthError(text)) {
            pushAutomationTrace("🌐 后端 AI：视频主评终止（" + clipAutomationTraceText(text) + "）", result2);
            return {
              success: false,
              msg: text
            };
          }
          if (isAutomationAiInvokeCancelled(result4)) {
            pushAutomationTrace("🌐 后端 AI：任务已停止，终止视频主评重试", result2);
            return {
              success: false,
              msg: "AI 生成已取消（任务已停止）",
              cancelled: true
            };
          }
          pushAutomationTrace("⏱ 后端 AI：视频主评第 " + num2 + " 次未成功（" + clipAutomationTraceText(text) + "），" + num / 1000 + " 秒后重试…", result2);
          const result5 = await sleepWithAutomationAiCancel(num, result4);
          if (!result5) {
            pushAutomationTrace("🌐 后端 AI：任务已停止，终止视频主评重试", result2);
            return {
              success: false,
              msg: "AI 生成已取消（任务已停止）",
              cancelled: true
            };
          }
        }
      } catch (error) {
        const local = error.response?.data?.msg || error.message || "AI 生成失败";
        pushAutomationTrace("🌐 后端 AI：视频主评异常：" + clipAutomationTraceText(local), result2);
        return {
          success: false,
          msg: local
        };
      }
    });
  }
  return {
    registerIpc: registerIpc,
    pushAutomationTrace: pushAutomationTrace,
    postRadarAiJson: postRadarAiJson,
    clipAutomationTraceText: clipAutomationTraceText,
    isFatalAiAuthError: isFatalAiAuthError,
    parseRadarMatchResponse: parseRadarMatchResponse,
    handleAiResponse: handleAiResponse,
    buildRuntimeAiIntent: buildRuntimeAiIntent,
    resolveTraceAccountIdFromIpc: resolveTraceAccountIdFromIpc,
    captureAutomationAiInvokeGeneration: captureAutomationAiInvokeGeneration,
    cancelAutomationAiRetry: cancelAutomationAiRetry,
    isAutomationAiInvokeCancelled: isAutomationAiInvokeCancelled,
    sleepWithAutomationAiCancel: sleepWithAutomationAiCancel
  };
}
module.exports = {
  createRadarAi: createRadarAi
};
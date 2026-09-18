// 抖多客 AI 接口的“请求翻译 + 响应回写”层（本地 Ollama 改向用）
//
// 职责：把主进程 radarAi.js / workPublishAi.js 发出的原始请求，转换为
// 适合本地 Ollama 的提示词与结构化 JSON Schema；再把 Ollama 的 JSON 输出
// 解析为 app 实际消费的响应形状。
//
// 设计原则（与 docs/去服务器化副作用与缺陷评估.md 一致）：
// - fail-closed：任何解析失败、字段缺失都按“最保守”取值，不伪装成功；
// - 不臆造点赞/回复动作：should_like / should_reply 默认 false；
// - 错误信息不含鉴权致命词（见 ollama-client.sanitizeAiMessage）。

const COMMENT_DECISION_SCHEMA = {
  type: "array",
  items: {
    type: "object",
    properties: {
      should_like: { type: "boolean" },
      should_reply: { type: "boolean" },
      reply_content: { type: "string" },
      thought: { type: "string" }
    },
    required: ["should_like", "should_reply", "reply_content", "thought"]
  }
};

const MATCH_SCHEMA = {
  type: "object",
  properties: {
    pass: { type: "boolean" },
    score: { type: "number" },
    reason: { type: "string" }
  },
  required: ["pass", "score", "reason"]
};

const VIDEO_MATCH_SCHEMA = {
  type: "object",
  properties: {
    pass: { type: "boolean" },
    score: { type: "number" },
    reason: { type: "string" },
    main_post_comment: { type: "string" }
  },
  required: ["pass", "score", "reason"]
};

const WORK_PUBLISH_SCHEMA = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" }
        },
        required: ["title", "description"]
      }
    }
  },
  required: ["items"]
};

function defaultIntent(body) {
  return String(body?.intent || "").trim() ||
    "身份: 抖音获客评论互动顾问; 目的: 识别更匹配业务人设的潜在客户并进行自然互动; 要求: 真诚、克制、精准、合规";
}

function serializeLead(lead, index) {
  const l = lead || {};
  const row = (label, value) => `- ${label}：${value ?? ""}`;
  return [
    `第${index + 1}条：`,
    row("昵称", l.nickname),
    row("视频标题", l.videoTitle ?? l.title),
    row("评论内容", l.content),
    row("签名/简介", l.signature),
    row("位置", l.location ?? l.ipLocation),
    row("性别", l.gender),
    row("作品数", l.worksCount),
    row("主页", l.userUrl ?? l.url)
  ].join("\n");
}

function buildCommentDecisionMessages(body) {
  const intent = defaultIntent(body);
  const leads = Array.isArray(body?.leads) ? body.leads : [];
  const generationMode = String(body?.generationMode || "").trim();
  const leadText = leads.map((lead, i) => serializeLead(lead, i)).join("\n\n") || "（无评论）";

  let modeHint = "";
  if (generationMode) {
    modeHint = `\n本次为生成任务（generationMode=${generationMode}）：请将需要产出的文案写入对应条目的 reply_content 字段，thought 简述构思即可。`;
  }

  const system = [
    "你是抖音获客助手的评论决策模块。对每条评论给出点赞/回复决策并（必要时）生成回复。",
    "规则：",
    "1. 只输出 JSON 数组，长度等于输入评论条数，顺序一致。",
    "2. should_like / should_reply 必须是布尔值；不要盲目全部 true，避免触发无意义网页动作。",
    "3. reply_content 仅在 should_reply 为 true 时填写，保持简短、自然、合规；否则为空字符串。",
    "4. thought 用一句话说明判断依据。",
    "5. 禁止承诺、夸大或违规话术。"
  ].join("\n");

  const user = [
    `人设要求：\n${intent}\n`,
    `视频标题：${String(body?.video_title || "").trim() || "未知视频"}`,
    `业务关键词：${String(body?.keywords || "").trim() || "无"}`,
    `账号名：${String(body?.accountName || "").trim() || "未知账号"}`,
    ``,
    `需要逐条判断的评论（共 ${leads.length} 条），请严格保持顺序：\n${leadText}`,
    modeHint,
    `\n仅输出符合给定 JSON Schema 的数组，不要任何额外说明文字。`
  ].join("\n");

  return [
    { role: "system", content: system },
    { role: "user", content: user }
  ];
}

function buildVideoMatchMessages(body) {
  const intent = defaultIntent(body);
  const comments = Array.isArray(body?.top_comments) ? body.top_comments : [];
  const withMainPost = body?.with_main_post === true;
  const system = [
    "你是抖音获客视频预筛模块。判断该视频评论区是否聚集了与人设匹配的目标人群。",
    "规则：",
    "1. 只输出 JSON 对象。",
    "2. pass 必须为布尔值；只有“明显匹配”才为 true，不确定时给 false。",
    "3. score 为 0-100 的匹配度；reason 用一句话说明。",
    `4. main_post_comment：仅当 with_main_post 为 true 时生成一句自然主评，否则为空字符串。当前 with_main_post=${withMainPost}。`
  ].join("\n");
  const user = [
    `人设要求：\n${intent}\n`,
    `视频标题：${String(body?.video_title || "").trim() || "未知视频"}`,
    `作者昵称：${String(body?.author_nickname || "").trim() || "未知"}`,
    `业务关键词：${String(body?.keywords || "").trim() || "无"}`,
    `热门评论：${comments.length ? comments.map((c, i) => `${i + 1}. ${c}`).join("\n") : "（无）"}`,
    withMainPost ? `主评意图：${String(body?.main_post_intent || "").trim() || "（未提供）"}` : "",
    `\n仅输出符合给定 JSON Schema 的对象，不要任何额外说明文字。`
  ].filter(Boolean).join("\n");
  return [
    { role: "system", content: system },
    { role: "user", content: user }
  ];
}

function buildLeadMatchMessages(body) {
  const intent = defaultIntent(body);
  const lead = body?.lead || {};
  const system = [
    "你是抖音获客用户画像判断模块。判断该评论者是否符合当前智能体的目标客户画像。",
    "规则：",
    "1. 只输出 JSON 对象。",
    "2. pass 必须为布尔值；只有“明显匹配”才为 true，不确定时给 false。",
    "3. score 为 0-100 的匹配度；reason 用一句话说明。"
  ].join("\n");
  const user = [
    `人设要求：\n${intent}\n`,
    `视频标题：${String(body?.video_title || lead?.videoTitle || "").trim() || "未知视频"}`,
    `评论者昵称：${String(lead?.nickname || "").trim() || "未知"}`,
    `评论内容：${String(lead?.content || "").trim() || "（无）"}`,
    `签名/简介：${String(lead?.signature || "").trim() || "（无）"}`,
    `位置：${String(lead?.location || lead?.ipLocation || "").trim() || "（无）"}`,
    `性别：${String(lead?.gender || "").trim() || "（无）"}`,
    `作品数：${lead?.worksCount ?? "（无）"}`,
    `\n仅输出符合给定 JSON Schema 的对象，不要任何额外说明文字。`
  ].join("\n");
  return [
    { role: "system", content: system },
    { role: "user", content: user }
  ];
}

function buildWorkPublishMessages(body) {
  const count = Math.min(10, Math.max(1, Number(body?.count) || 1));
  const similarity = Math.min(100, Math.max(0, Number(body?.similarity) || 30));
  const system = [
    "你是短视频文案生成模块。基于种子标题/描述，生成若干条风格一致、自然合规的文案。",
    "规则：",
    "1. 只输出 JSON 对象，包含 items 数组。",
    "2. 每条含 title（标题）与 description（描述），均为中文、简短、有吸引力、不违规。",
    `3. 共生成 ${count} 条，与种子相似度约 ${similarity}%。`
  ].join("\n");
  const user = [
    `种子标题：${String(body?.seedTitle || "").trim() || "（无）"}`,
    `种子描述：${String(body?.seedDesc || "").trim() || "（无）"}`,
    `生成数量：${count}`,
    `相似度：${similarity}%`,
    `\n仅输出符合给定 JSON Schema 的对象，不要任何额外说明文字。`
  ].join("\n");
  return [
    { role: "system", content: system },
    { role: "user", content: user }
  ];
}

// ---- 响应回写（fail-closed）----

function safeBool(value, fallback = false) {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

function safeString(value) {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

function safeNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function createAiHandlers(ollamaClient) {
  if (!ollamaClient || typeof ollamaClient.chatStructured !== "function") {
    throw new Error("createAiHandlers 需要有效的 ollamaClient");
  }

  async function commentDecision(body = {}) {
    const leads = Array.isArray(body?.leads) ? body.leads : [];
    if (leads.length === 0) {
      return { code: 200, data: [] };
    }
    const messages = buildCommentDecisionMessages(body);
    const parsed = await ollamaClient.chatStructured(messages, COMMENT_DECISION_SCHEMA, { temperature: 0.4 });
    let arr = Array.isArray(parsed) ? parsed : null;
    if (!arr && typeof parsed === "object" && parsed !== null) {
      for (const val of Object.values(parsed)) {
        if (Array.isArray(val)) {
          arr = val;
          break;
        }
      }
    }
    arr = arr || [];
    const data = leads.map((_lead, i) => {
      const item = arr[i] || {};
      return {
        should_like: safeBool(item.should_like, false),
        should_reply: safeBool(item.should_reply, false),
        reply_content: safeString(item.reply_content),
        thought: safeString(item.thought)
      };
    });
    return { code: 200, data };
  }

  async function videoMatch(body = {}) {
    const messages = buildVideoMatchMessages(body);
    const parsed = await ollamaClient.chatStructured(messages, VIDEO_MATCH_SCHEMA, { temperature: 0.3 });
    const p = parsed || {};
    return {
      code: 200,
      data: {
        // 缺失即视为 false（app 把缺失 pass 当作 true，因此这里必须显式 false 以 fail-closed）
        pass: safeBool(p.pass, false),
        score: safeNumber(p.score),
        reason: safeString(p.reason) || "本地模型未给出理由",
        main_post_comment: safeString(p.main_post_comment)
      }
    };
  }

  async function leadMatch(body = {}) {
    const messages = buildLeadMatchMessages(body);
    const parsed = await ollamaClient.chatStructured(messages, MATCH_SCHEMA, { temperature: 0.3 });
    const p = parsed || {};
    return {
      code: 200,
      data: {
        pass: safeBool(p.pass, false),
        score: safeNumber(p.score),
        reason: safeString(p.reason) || "本地模型未给出理由"
      }
    };
  }

  async function workPublishGenerate(body = {}) {
    const count = Math.min(10, Math.max(1, Number(body?.count) || 1));
    const messages = buildWorkPublishMessages(body);
    const parsed = await ollamaClient.chatStructured(messages, WORK_PUBLISH_SCHEMA, { temperature: 0.7 });
    const items = Array.isArray(parsed?.items) ? parsed.items : [];
    const normalized = items.slice(0, count).map(it => ({
      title: safeString(it?.title),
      description: safeString(it?.description)
    }));
    return {
      code: 200,
      data: { items: normalized },
      workPublishQuota: null
    };
  }

  function workPublishQuota() {
    return {
      code: 200,
      success: true,
      localDevelopment: true,
      data: { remaining: null, planType: "local-development" }
    };
  }

  return {
    commentDecision,
    videoMatch,
    leadMatch,
    workPublishGenerate,
    workPublishQuota
  };
}

export const AI_SCHEMAS = {
  COMMENT_DECISION_SCHEMA,
  MATCH_SCHEMA,
  VIDEO_MATCH_SCHEMA,
  WORK_PUBLISH_SCHEMA
};

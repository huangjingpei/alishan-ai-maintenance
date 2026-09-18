// 本地 Ollama 客户端（结构化 JSON 输出）
//
// 仅用于本地开发模式：把抖多客的 AI 请求改向到本机运行的 Ollama，
// 避免把数据发送到原厂商 SaaS。密钥/地址只能来自本机环境变量，不进仓库。
//
// 错误信息的措辞刻意避开鉴权致命词（额度/授权码/未授权等），
// 以免被主进程 isFatalAiAuthError 误判为授权失败而中断重试。

const DEFAULT_TIMEOUT_MS = 120000;
const DEFAULT_MODEL = "qwen2.5:7b";
const DEFAULT_BASE_URL = "http://127.0.0.1:11434";

// 主进程判定为“致命授权/额度错误”的子串，响应消息必须避免命中。
const FATAL_AUTH_SUBSTRINGS = [
  "额度已用完",
  "已用完",
  "卡密已过期",
  "授权码无效",
  "设备已被封",
  "余额不足",
  "未授权"
];

export class OllamaUnavailableError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = "OllamaUnavailableError";
    this.cause = cause;
  }
}

export function sanitizeAiMessage(message) {
  let out = String(message || "");
  for (const needle of FATAL_AUTH_SUBSTRINGS) {
    if (out.includes(needle)) {
      out = out.split(needle).join("本地模型服务异常");
    }
  }
  return out;
}

function resolveConfig({
  baseUrl = process.env.OLLAMA_BASE_URL || DEFAULT_BASE_URL,
  model = process.env.OLLAMA_MODEL || DEFAULT_MODEL,
  timeout = Number(process.env.OLLAMA_TIMEOUT_MS || DEFAULT_TIMEOUT_MS),
  fetchFn = globalThis.fetch
} = {}) {
  return {
    baseUrl: String(baseUrl).replace(/\/+$/, ""),
    model: String(model),
    timeout: Number.isFinite(timeout) && timeout > 0 ? timeout : DEFAULT_TIMEOUT_MS,
    fetchFn
  };
}

export function createOllamaClient(options = {}) {
  const config = resolveConfig(options);
  if (!config.fetchFn) {
    throw new OllamaUnavailableError("运行环境缺少 fetch，无法连接本地 Ollama");
  }

  async function isAvailable() {
    try {
      const res = await config.fetchFn(`${config.baseUrl}/api/tags`, {
        signal: AbortSignal.timeout(Math.min(config.timeout, 10000))
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  // 调用 Ollama /api/chat，要求模型按 format(JSON Schema) 返回结构化 JSON。
  async function chatStructured(messages, formatSchema, { temperature = 0.3, timeout = config.timeout } = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    let res;
    try {
      res = await config.fetchFn(`${config.baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: config.model,
          messages,
          format: formatSchema,
          stream: false,
          options: { temperature }
        }),
        signal: controller.signal
      });
    } catch (err) {
      clearTimeout(timer);
      throw new OllamaUnavailableError(`本地 Ollama 不可达：${config.baseUrl}`, err);
    }
    clearTimeout(timer);

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new OllamaUnavailableError(`本地 Ollama 返回 ${res.status}：${text.slice(0, 200)}`);
    }

    const data = await res.json().catch(() => null);
    const content = data?.message?.content;
    if (typeof content !== "string" || !content.trim()) {
      throw new OllamaUnavailableError("本地 Ollama 未返回有效内容");
    }

    // 优先整体解析；若模型在 JSON 外加了说明文字或代码围栏，则尝试抽取。
    try {
      return JSON.parse(content);
    } catch {
      const matched = content.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (matched) {
        try {
          return JSON.parse(matched[0]);
        } catch {
          // 落到外层
        }
      }
      throw new OllamaUnavailableError("本地 Ollama 返回内容不是合法 JSON");
    }
  }

  return {
    baseUrl: config.baseUrl,
    model: config.model,
    isAvailable,
    chatStructured
  };
}

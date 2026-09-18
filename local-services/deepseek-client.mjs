// DeepSeek 官方 API 客户端（OpenAI 兼容协议 + 结构化输出）
//
// 用于本地服务接管 AI 路由：通过 DeepSeek API 完成评论决策、视频筛选、线索匹配与文案生成。
// 遵循 fail-closed 原则，错误信息避免命中致命鉴权拦截词。

import { sanitizeAiMessage } from "./ollama-client.mjs";

const DEFAULT_TIMEOUT_MS = 60000;
const DEFAULT_MODEL = "deepseek-chat";
const DEFAULT_BASE_URL = "https://api.deepseek.com";

export class DeepSeekError extends Error {
  constructor(message, cause) {
    super(sanitizeAiMessage(message));
    this.name = "DeepSeekError";
    this.cause = cause;
  }
}

function resolveConfig({
  apiKey = process.env.DEEPSEEK_API_KEY,
  baseUrl = process.env.DEEPSEEK_BASE_URL || DEFAULT_BASE_URL,
  model = process.env.DEEPSEEK_MODEL || DEFAULT_MODEL,
  timeout = Number(process.env.DEEPSEEK_TIMEOUT_MS || DEFAULT_TIMEOUT_MS),
  fetchFn = globalThis.fetch
} = {}) {
  return {
    apiKey: String(apiKey || "").trim(),
    baseUrl: String(baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, ""),
    model: String(model || DEFAULT_MODEL),
    timeout: Number.isFinite(timeout) && timeout > 0 ? timeout : DEFAULT_TIMEOUT_MS,
    fetchFn
  };
}

/**
 * 解析大模型返回的内容为 JSON 对象或数组
 * 支持：
 * 1. 原生 JSON 字符串
 * 2. Markdown 代码块包裹（```json ... ``` 或 ``` ... ```）
 * 3. 前后带附带文字的 JSON 片段抽取
 * 4. 自动解包对象内层数组（当 formatSchema.type 为 array 时）
 */
export function parseStructuredJson(rawContent, formatSchema = null) {
  if (typeof rawContent !== "string" || !rawContent.trim()) {
    throw new DeepSeekError("DeepSeek API 未返回有效内容");
  }

  const trimmed = rawContent.trim();
  let result;

  // 1. 尝试直接解析
  try {
    result = JSON.parse(trimmed);
  } catch {
    // 2. 去除 Markdown ```json ... ``` 标记
    const codeBlockMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    if (codeBlockMatch && codeBlockMatch[1]) {
      try {
        result = JSON.parse(codeBlockMatch[1].trim());
      } catch {
        // 继续向下
      }
    }

    if (result === undefined) {
      // 3. 正则提取首个闭合的 [] 或 {}
      const bracketMatch = trimmed.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
      if (bracketMatch) {
        try {
          result = JSON.parse(bracketMatch[0]);
        } catch {
          // 解析失败
        }
      }
    }
  }

  if (result === undefined) {
    throw new DeepSeekError("DeepSeek API 返回的内容无法解析为合法 JSON");
  }

  // 4. 若期望数组，但模型外层包裹了对象（如 { content: [...] } 或 { type: 'json_object', content: [...] }）
  if (formatSchema?.type === "array" && !Array.isArray(result) && typeof result === "object" && result !== null) {
    for (const val of Object.values(result)) {
      if (Array.isArray(val)) {
        return val;
      }
    }
  }

  return result;
}

export function createDeepSeekClient(options = {}) {
  const config = resolveConfig(options);
  if (!config.apiKey) {
    throw new DeepSeekError("未配置 DEEPSEEK_API_KEY");
  }
  if (!config.fetchFn) {
    throw new DeepSeekError("运行环境缺少 fetch，无法连接 DeepSeek API");
  }

  async function isAvailable() {
    try {
      const res = await config.fetchFn(`${config.baseUrl}/models`, {
        headers: {
          Authorization: `Bearer ${config.apiKey}`
        },
        signal: AbortSignal.timeout(Math.min(config.timeout, 8000))
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * 调用 DeepSeek 聊天补全接口，返回经解析的结构化数据
   */
  async function chatStructured(messages, formatSchema = null, { temperature = 0.3, timeout = config.timeout } = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    const requestBody = {
      model: config.model,
      messages,
      temperature,
      stream: false
    };

    // 当明确要求顶级为 object 时传 response_format: { type: "json_object" }；
    // 当要求 array 时不传该参数，让模型直接返回顶级数组
    if (formatSchema?.type === "object") {
      requestBody.response_format = { type: "json_object" };
    }

    let res;
    try {
      res = await config.fetchFn(`${config.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });
    } catch (err) {
      clearTimeout(timer);
      throw new DeepSeekError(`DeepSeek API 网络请求异常：${err.message}`, err);
    }
    clearTimeout(timer);

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new DeepSeekError(`DeepSeek API 返回错误 HTTP ${res.status}：${errText.slice(0, 300)}`);
    }

    let data;
    try {
      data = await res.json();
    } catch (err) {
      throw new DeepSeekError("DeepSeek API 响应体不是合法 JSON", err);
    }

    const content = data?.choices?.[0]?.message?.content;
    return parseStructuredJson(content, formatSchema);
  }

  return {
    provider: "deepseek",
    baseUrl: config.baseUrl,
    model: config.model,
    isAvailable,
    chatStructured
  };
}

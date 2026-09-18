// AI 客户端工厂与解析器
//
// 策略：
// 1. 优先使用 DeepSeek 官方 API（通过 DEEPSEEK_API_KEY 配置）
// 2. 本地 Ollama 作为容灾备用（默认 http://127.0.0.1:11434, qwen2.5:7b）
// 3. 若均未配置，返回 null（各 AI 路由保持 501，fail-closed）

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createDeepSeekClient } from "./deepseek-client.mjs";
import { createOllamaClient } from "./ollama-client.mjs";
import { createFallbackAiClient } from "./fallback-ai-client.mjs";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(moduleDir, "..");

export function isTestEnvironment() {
  return Boolean(
    process.env.NODE_ENV === "test" ||
    process.env.NODE_TEST_CONTEXT ||
    process.execArgv.some(arg => typeof arg === "string" && arg.includes("--test"))
  );
}

/**
 * 安全加载根目录 .env 文件（测试模式下默认不加载以隔离单测环境）
 */
export function loadEnvIfPresent(repoRoot = repositoryRoot, force = false) {
  if (!force && isTestEnvironment()) {
    return;
  }
  const envPath = path.join(repoRoot, ".env");
  if (fs.existsSync(envPath) && typeof process.loadEnvFile === "function") {
    try {
      process.loadEnvFile(envPath);
    } catch {
      // 忽略重复或异常语法
    }
  }
}

export function resolveAiClient({
  logger = console,
  deepseekApiKey,
  deepseekBaseUrl,
  deepseekModel,
  ollamaBaseUrl,
  ollamaModel,
  enableOllamaBackup = true,
  fetchFn = globalThis.fetch
} = {}) {
  loadEnvIfPresent();

  const activeDeepSeekKey = deepseekApiKey !== undefined
    ? String(deepseekApiKey || "").trim()
    : String(process.env.DEEPSEEK_API_KEY || "").trim();

  let deepseekClient = null;
  if (activeDeepSeekKey) {
    try {
      deepseekClient = createDeepSeekClient({
        apiKey: activeDeepSeekKey,
        baseUrl: deepseekBaseUrl || process.env.DEEPSEEK_BASE_URL,
        model: deepseekModel || process.env.DEEPSEEK_MODEL,
        fetchFn
      });
    } catch (err) {
      logger.warn?.(`[AIFactory] DeepSeek 客户端初始化失败: ${err.message}`);
      deepseekClient = null;
    }
  }

  // Ollama 客户端：如果显式开启或作为 DeepSeek 备用
  const shouldInitOllama = Boolean(
    process.env.HUOKE_OLLAMA_ENABLED === "1" ||
    process.env.OLLAMA_BASE_URL ||
    (deepseekClient && enableOllamaBackup)
  );

  let ollamaClient = null;
  if (shouldInitOllama) {
    try {
      ollamaClient = createOllamaClient({
        baseUrl: ollamaBaseUrl || process.env.OLLAMA_BASE_URL,
        model: ollamaModel || process.env.OLLAMA_MODEL,
        fetchFn
      });
    } catch (err) {
      logger.warn?.(`[AIFactory] Ollama 客户端初始化失败: ${err.message}`);
      ollamaClient = null;
    }
  }

  // 1. 两者均存在 -> 组装容灾备用客户端（优先 DeepSeek，备用 Ollama）
  if (deepseekClient && ollamaClient) {
    return createFallbackAiClient({
      primaryClient: deepseekClient,
      backupClient: ollamaClient,
      logger
    });
  }

  // 2. 仅 DeepSeek 存在
  if (deepseekClient) {
    return deepseekClient;
  }

  // 3. 仅 Ollama 存在（保持原纯 Ollama 逻辑完全兼容）
  if (ollamaClient && (process.env.HUOKE_OLLAMA_ENABLED === "1" || process.env.OLLAMA_BASE_URL)) {
    return ollamaClient;
  }

  return null;
}

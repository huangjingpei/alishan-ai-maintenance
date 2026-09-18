// 多模型容灾中继客户端（优先级 + 备用降级）
//
// 策略：
// 1. 优先使用 Primary（如 DeepSeek 官方 API）
// 2. 当 Primary 发生网络超时、服务限流或异常时，自动无缝降级到 Backup（如本地 Ollama）
// 3. 当两者均不可用时，保持 fail-closed 并抛出净化后的异常信息

export function createFallbackAiClient({
  primaryClient = null,
  backupClient = null,
  logger = console
} = {}) {
  if (!primaryClient && !backupClient) {
    throw new Error("createFallbackAiClient 至少需要提供一个有效客户端");
  }

  const activeProviderName = primaryClient && backupClient
    ? `${primaryClient.provider || "primary"} (主) + ${backupClient.provider || "backup"} (备)`
    : (primaryClient?.provider || backupClient?.provider || "ai");

  async function isAvailable() {
    if (primaryClient && typeof primaryClient.isAvailable === "function") {
      const ok = await primaryClient.isAvailable().catch(() => false);
      if (ok) return true;
    }
    if (backupClient && typeof backupClient.isAvailable === "function") {
      return await backupClient.isAvailable().catch(() => false);
    }
    return false;
  }

  async function chatStructured(messages, formatSchema, options = {}) {
    // 1. 若配置了主客户端，优先调用
    if (primaryClient) {
      try {
        return await primaryClient.chatStructured(messages, formatSchema, options);
      } catch (primaryErr) {
        if (!backupClient) {
          throw primaryErr;
        }
        logger.warn?.(
          `[AI 容灾降级] 主模型服务 (${primaryClient.provider || "primary"}) 调用失败: ${primaryErr.message}，正在自动切换至备用服务 (${backupClient.provider || "backup"})...`
        );
      }
    }

    // 2. 备用客户端接管
    if (backupClient) {
      return await backupClient.chatStructured(messages, formatSchema, options);
    }

    throw new Error("没有可用的 AI 模型客户端");
  }

  return {
    provider: activeProviderName,
    primaryClient,
    backupClient,
    baseUrl: primaryClient?.baseUrl || backupClient?.baseUrl,
    model: primaryClient?.model || backupClient?.model,
    isAvailable,
    chatStructured
  };
}

# AI 模型接入与双轨容灾指南（DeepSeek 优先 + Ollama 备用）

- **文档版本**：1.0
- **创建时间**：2026-09-18
- **适用工程**：`alishan-ai-maintenance` (Electron 2.9.89 恢复版)

---

## 1. 架构总览

为了满足高响应速度、高质量回复与断网容灾的双重需求，本地服务层实现了**双轨 AI 容灾适配器**：

```mermaid
flowchart TD
    Client[客户端 radarAi.js / workPublishAi.js] -->|HTTP POST| LocalBackend[本地微服务 local-services/backend.mjs]
    LocalBackend --> Router[AI 路由分发器]
    Router --> Adapter[双轨容灾客户端 fallback-ai-client]
    
    Adapter -->|优先调用 (Primary)| DeepSeek[DeepSeek 官方 API\n(deepseek-chat / V3)]
    DeepSeek -->|成功 (200)| RetOK[解析结构化 JSON 并回写给客户端]
    
    DeepSeek -.->|网络异常 / 限流 / 超时| FallbackTrigger{自动触发容灾降级}
    FallbackTrigger -->|无缝切换 (Backup)| Ollama[本地 Ollama 模型\n(qwen2.5:7b @ 127.0.0.1:11434)]
    Ollama -->|备用成功 (200)| RetOK
    
    Ollama -.->|两者均不可用| FailClosed[安全失败 502 / fail-closed\n避免产生误动作]
```

### 核心特性
1. **优先使用 DeepSeek 官方 API**：
   - 模型：`deepseek-chat`（DeepSeek-V3）。
   - 优势：生成语义自然亲切，神评与文案质量显著优于小参数本地模型，单次意图分析仅需 1~2 秒。
2. **本地 Ollama 自动热备（Failover）**：
   - 当 DeepSeek 发生超时、欠费、接口限流或断网时，适配器在毫秒级内自动无缝切换到本地已运行的 Ollama。
3. **零云端密钥泄露**：
   - 密钥与端点配置存放在根目录 `.env`（已被 `.gitignore` 排除，绝不提交至代码仓库）。
4. **防御性结构化 JSON 解析**：
   - 针对大模型可能返回原生 JSON、Markdown 代码围栏（```` ```json ````）或内层包裹对象（`{ content: [...] }`），解析器具备自动脱壳与校验能力。

---

## 2. 环境变量与配置文件

根目录下已提供 `.env`（本地私有配置）与 `.env.example`（提交模板）：

```bash
# ==========================================
# 1. DeepSeek 官方 API 配置 (优先使用)
# ==========================================
DEEPSEEK_API_KEY=sk-your-deepseek-api-key
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_TIMEOUT_MS=60000

# ==========================================
# 2. 本地 Ollama 配置 (容灾备用)
# ==========================================
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen2.5:7b
OLLAMA_TIMEOUT_MS=120000
```

---

## 3. 启动与验证

### 一键启动本地服务与客户端

```powershell
npm run dev:local
```

终端启动日志将显示：
```text
[LocalDev] 本地服务：http://127.0.0.1:48765/api
[LocalDev] Electron 数据目录：.local-data
[LocalDev] 检测到 DeepSeek API 配置，优先使用云端模型：model=deepseek-chat（Ollama 备用）
[LocalBackend] AI 引擎已就绪 [deepseek (主) + backup (备)]：https://api.deepseek.com model=deepseek-chat
```

### 仅启动本地后端（供接口联调）

```powershell
npm run local:server
```

### 运行完整自动化测试套件

```powershell
cmd.exe /c npm test
cmd.exe /c npm run validate
```

所有 24 个单测与契约测试均已通过，涵盖：
- DeepSeek 报文解析与容错脱壳测试；
- 主用成功时不唤醒备用；
- 主用抛出异常时自动降级至本地备用；
- 契约隔离与环境安全测试。

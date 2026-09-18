# AI 本地 Ollama 改向与运行时观测（方案 A）

文档版本：1.0  
最后更新：2026-08-30  
适用版本：2.9.89 恢复版 + 本地开发模式

## 1. 目标

把抖多客原本发送到厂商 SaaS 的 AI 调用（评论决策、视频预筛、用户画像、作品文案生成等）改向到**本机运行的 Ollama**，满足：

- 数据不出本机（不发给原厂商后台）；
- 本地开发模式下 AI 能力可用；
- 不改 `main.x64.jsc` 字节码，只改可读的本地服务层；
- 未配置 Ollama 时行为与以前完全一致（AI 接口返回 501，fail-closed）。

## 2. 为什么需要「主进程 HTTP 抓包」而不是 CDP Network

`radarAi.js` / `workPublishAi.js` 运行在 **Electron 主进程（Node）**，AI 请求通过 axios → `http`/`https` 发出。

- CDP 的 `Network` 域只能捕获 **renderer（Chromium）** 的网络流量；
- 主进程 Node 的 `http`/`https` 请求 CDP Network 看不到。

因此「运行时观测」用 `dist-protected/observability/http-tap.cjs`：在 `main.js` 加载 jsc **之前**包装 `http.request`/`https.request`，把所有出站请求/响应**仅记录**到 `.temp/observe/`。它既能确认 AI 请求的真实契约，也能验证「改向」后请求确实落到了本地后端（`127.0.0.1:48765`），而不是原厂商域名。

该 tap **只记录、不修改**流量，默认关闭（见 §6）。

## 3. 前置条件

1. 本机已安装并启动 Ollama（默认 `http://127.0.0.1:11434`）。
2. 拉取一个支持结构化 JSON 输出的模型，例如：
   ```powershell
   ollama pull qwen2.5:7b
   ```
3. 工程依赖已安装：`npm install`。

## 4. 启动（改向）

设置环境变量后再跑本地开发模式：

```powershell
$env:OLLAMA_BASE_URL = 'http://127.0.0.1:11434'   # 可选，缺省即本机默认地址
$env:OLLAMA_MODEL   = 'qwen2.5:7b'                # 可选，缺省 qwen2.5:7b
$env:HUOKE_OLLAMA_ENABLED = '1'                    # 或仅设置 OLLAMA_BASE_URL 亦可触发
npm run dev:local
```

判定逻辑（见 `local-services/backend.mjs`）：

- 设置了 `HUOKE_OLLAMA_ENABLED=1` 或 `OLLAMA_BASE_URL` → 后端构建 Ollama 客户端并接管 AI 路由；
- 两者都未设置 → AI 路由保持 501（与原行为一致，不破坏既有契约测试）。

启动日志会出现：
```
[LocalBackend] AI 接口已改向本地 Ollama：http://127.0.0.1:11434 model=qwen2.5:7b
```

## 5. 已改向的接口与契约

请求契约来自 `dist-protected/main/radarAi.js`、`workPublishAi.js` 已确认字段；响应形状按消费代码 `handleAiResponse` / `parseRadarMatchResponse` 回写。

| 方法 + 路径 | 请求关键字段 | Ollama 输出 Schema | 回写响应 |
|---|---|---|---|
| `POST /radar/ai/v2/comment-decision` | `intent, video_title, keywords, accountName, leads[], generationMode?` | 数组 `[{should_like, should_reply, reply_content, thought}]` | `{code:200, data:[...]}` |
| `POST /radar/ai/v2/video-match` | `intent, video_title, author_nickname, keywords, top_comments[], with_main_post, main_post_intent` | `{pass, score, reason, main_post_comment}` | `{code:200, data:{...}}` |
| `POST /radar/ai/lead-match` | `intent, video_title, lead{...}` | `{pass, score, reason}` | `{code:200, data:{...}}` |
| `POST /radar/ai/work-publish-generate` | `seedTitle, seedDesc, count, similarity` | `{items:[{title, description}]}` | `{code:200, data:{items}, workPublishQuota:null}` |
| `GET /radar/ai/work-publish-quota` | — | 不需要 | `{code:200, data:{remaining:null, planType:"local-development"}}` |

翻译逻辑集中在 `local-services/ai-handlers.mjs`：把 `intent`（人设）作为系统/用户提示词，把 `leads`/视频信息序列化进提示词，要求模型按 JSON Schema 结构化输出，再解析回应用期望的形状。

> `POST /radar/analyze` 仍返回 501（结构未从真实业务确认，遵循《03》§6.5 的 fail-closed 约定，不返回空 200）。

## 6. 运行时观测（验证改向是否生效）

```powershell
$env:HUOKE_TRACE_HTTP = '1'
npm run dev:local
```

日志写入 `.temp/observe/http-trace-<ts>.log`，内容示例：

```
=== POST http://127.0.0.1:48765/api/radar/ai/v2/comment-decision [http-...] ===
[req-headers] {"Content-Type":"application/json","Authorization":"<redacted>"}
[req-body] {"intent":"身份: ...","leads":[...]}
[res-status] 200 OK
[res-body] {"code":200,"data":[...]}
```

判定：

- 看到目标 URL 是 `127.0.0.1:48765/api/radar/ai/*` → 说明 apiBase 已切到本地后端，改向链路打通；
- 若仍看到原厂商域名 → 检查 `HUOKE_LOCAL_DEV=1` 是否生效、`[ApiBase] 生效=` 日志是否为 localhost（见《03》§7）。

Authorization 等敏感头会被 `<redacted>`，日志不落盘明文密钥。

## 7. 安全与 fail-closed 约定

- Ollama 地址/模型只来自本机环境变量，**不写进仓库、运行配置或安装包**；
- 未配置 Ollama → AI 路由 501，不伪装成功；
- 模型调用失败/返回非 JSON/字段缺失 → 返回 502，且消息已脱敏（不含「额度/授权/未授权」等子串，避免被主进程 `isFatalAiAuthError` 误判为授权失败而中断重试）；
- `pass` 字段缺失时一律按 `false` 处理（主进程把缺失 `pass` 视为放行，故这里必须显式 fail-closed）；
- 抖音网页仍是外部依赖，本地服务无法替代；Ollama 只接管「AI 决策/生成」这一段；
- 不要用 `npm run dev:local` 作为生产启动方式，安装包内不应出现 `local-services`/`.temp`。

## 8. 测试与验证

```powershell
npm test
npm run validate
```

- `tests/local-backend-ai-ollama.test.mjs`：翻译层单测 + 后端路由（注入假 Ollama）+ 端到端（假 Ollama HTTP 服务）全绿；
- `tests/local-backend-contract.test.mjs`：确保「未配置 Ollama 时 AI 仍 501」的契约不被破坏。

URL 模块加载一致性：本机使用的是 Node 22 管理运行时（`~/.workbuddy/binaries/node/versions/22.22.2/node.exe`），`fetch` 与 `AbortSignal.timeout` 均可用。

## 9. 已知限制

- 依赖 Ollama 模型对 JSON Schema 结构化输出的支持；弱模型可能返回非预期 JSON，触发 502 重试；
- 若 Ollama 未 `pull` 对应模型，请求会 502，主进程按重试策略每 10s 重试，属预期；
- `work-publish-generate` 的 `similarity` 仅作为提示词约束，不保证数值精确；
- `analyze` 接口未实现（维持 501）。

## 10. 控制台中文乱码修复（Windows）

**现象**：控制台出现 `绗?138 娆￠绛涘け璐?` 这类乱码，且只有中文、英文/时间戳正常。

**根因**：Windows 控制台默认代码页为 936(GBK)。Node 把中文按 UTF-8 字节写出，被 GBK 终端重新解释 → mojibake。日志里的字符串（如 `第 N 次预处理失败…`）在源码里本来是正确 UTF-8，与代码无关。

**修复**（已写入启动链路，无需手动操作）：

- `package.json` 的 `dev` / `dev:local` 脚本前置 `chcp 65001 >nul`（把本次启动的控制台切到 UTF-8）；
- `scripts/dev-local.mjs` 顶部增加 Windows 自举：若未设 `HUOKE_CP_UTF8`，则 `cmd /c "chcp 65001 && set HUOKE_CP_UTF8=1 && node ..."` 重新拉起自己，确保 electron 与本地后端都继承 UTF-8 控制台。`HUOKE_CP_UTF8` 防止递归。

**仍乱码时的排查**：

1. 用的是 **PowerShell** 时，`chcp` 在 npm 拉起的子 cmd 里执行，未必改变 PowerShell 会话自身的 `OutputEncoding`。请在自己的 PowerShell 里先执行一次：
   ```powershell
   chcp 65001
   $OutputEncoding = [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
   ```
   或直接改用 **Windows Terminal**（默认 UTF-8，基本不会乱码）。
2. 如果你是在 **查看日志文件**（而非实时控制台），用 UTF-8 编码打开（VS Code / Notepad++ / 记事本「另存为」选 UTF-8 查看），不要用 GBK 记事本直开。
3. 打包后的正式 `.exe` 不走 `dev-local.mjs`，若也需要修复，需在 `dist-protected/main.js` 加载 jsc 前调用 Win32 `SetConsoleOutputCP(65001)`（需 ffi 或 native addon），如需可单独处理。

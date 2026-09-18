import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createLocalBackendServer, DEFAULT_LOCAL_HOST, DEFAULT_LOCAL_PORT } from "../local-services/backend.mjs";
import { loadEnvIfPresent } from "../local-services/ai-factory.mjs";

// 中文乱码修复（Windows）：把控制台代码页切到 UTF-8(65001)。
// 默认控制台为 GBK(936)，Node 输出的 UTF-8 字节会被误读成 mojibake（如「第」→「绗?」）。
// 在启动前通过 cmd /c chcp 65001 切换，electron 继承该控制台后中文正常显示。
// HUOKE_CP_UTF8 用于防止自举递归；直接 `node scripts/dev-local.mjs` 也会走此分支。
if (process.platform === "win32" && !process.env.HUOKE_CP_UTF8) {
  const { spawnSync } = await import("node:child_process");
  const scriptPath = JSON.stringify(process.argv[1]);
  const args = process.argv.slice(2).map((a) => JSON.stringify(a)).join(" ");
  const result = spawnSync(
    "cmd.exe",
    ["/c", `chcp 65001 >nul && set HUOKE_CP_UTF8=1 && node ${scriptPath} ${args}`],
    { stdio: "inherit", windowsHide: false }
  );
  process.exit(result.status ?? 0);
}

const require = createRequire(import.meta.url);
const electronPath = require("electron");
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

loadEnvIfPresent(repositoryRoot);

const port = Number(process.env.HUOKE_LOCAL_PORT || DEFAULT_LOCAL_PORT);
const backend = createLocalBackendServer({
  host: DEFAULT_LOCAL_HOST,
  port
});
const address = await backend.start();

console.log(`[LocalDev] 本地服务：${address.apiBase}`);
console.log("[LocalDev] Electron 数据目录：.local-data");
if (process.env.DEEPSEEK_API_KEY) {
  console.log(`[LocalDev] 检测到 DeepSeek API 配置，优先使用云端模型：model=${process.env.DEEPSEEK_MODEL || "deepseek-chat"}（Ollama 备用）`);
} else if (process.env.OLLAMA_BASE_URL || process.env.HUOKE_OLLAMA_ENABLED === "1") {
  console.log("[LocalDev] 检测到 Ollama 环境变量，AI 接口将改向本地模型：" + (process.env.OLLAMA_BASE_URL || "默认 http://127.0.0.1:11434") + " model=" + (process.env.OLLAMA_MODEL || "qwen2.5:7b"));
}

const child = spawn(electronPath, ["."], {
  cwd: repositoryRoot,
  env: {
    ...process.env,
    HUOKE_LOCAL_DEV: "1",
    HUOKE_LOCAL_API_BASE: address.apiBase,
    HUOKE_LOCAL_USER_DATA: path.join(repositoryRoot, ".local-data"),
    API_BASE: address.apiBase,
    API_BASE_2: address.apiBase,
    API_BASE2_REGIONS: ""
  },
  stdio: "inherit"
});

let stopping = false;
async function stop(exitCode = 0) {
  if (stopping) {
    return;
  }
  stopping = true;
  if (!child.killed) {
    child.kill();
  }
  await backend.stop();
  process.exit(exitCode);
}

child.once("error", async error => {
  console.error("[LocalDev] Electron 启动失败:", error.message);
  await stop(1);
});
child.once("exit", async code => {
  await stop(code ?? 0);
});
process.on("SIGINT", () => stop(130));
process.on("SIGTERM", () => stop(143));

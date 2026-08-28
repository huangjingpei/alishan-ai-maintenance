import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createLocalBackendServer, DEFAULT_LOCAL_HOST, DEFAULT_LOCAL_PORT } from "../local-services/backend.mjs";

const require = createRequire(import.meta.url);
const electronPath = require("electron");
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.HUOKE_LOCAL_PORT || DEFAULT_LOCAL_PORT);
const backend = createLocalBackendServer({
  host: DEFAULT_LOCAL_HOST,
  port
});
const address = await backend.start();

console.log(`[LocalDev] 本地服务：${address.apiBase}`);
console.log("[LocalDev] Electron 数据目录：.local-data");

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

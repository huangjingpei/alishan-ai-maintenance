import { createLocalBackendServer, DEFAULT_LOCAL_HOST, DEFAULT_LOCAL_PORT } from "../local-services/backend.mjs";

const port = Number(process.env.HUOKE_LOCAL_PORT || DEFAULT_LOCAL_PORT);
const backend = createLocalBackendServer({
  host: DEFAULT_LOCAL_HOST,
  port
});

const address = await backend.start();
console.log(`[LocalBackend] 已启动：${address.apiBase}`);
console.log("[LocalBackend] 仅供本地开发；Ctrl+C 停止");

let stopping = false;
async function stop() {
  if (stopping) {
    return;
  }
  stopping = true;
  await backend.stop();
  process.exit(0);
}

process.on("SIGINT", stop);
process.on("SIGTERM", stop);

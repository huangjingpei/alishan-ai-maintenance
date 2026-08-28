import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateRuntimeConfig } from "./runtime-config-validation.mjs";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_LOCAL_HOST = "127.0.0.1";
export const DEFAULT_LOCAL_PORT = 48765;
export const DEFAULT_RUNTIME_CONFIG_PATH = path.join(moduleDir, "runtime-config.dev.json");

function sendJson(response, statusCode, body) {
  const payload = Buffer.from(JSON.stringify(body));
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": payload.length,
    "Cache-Control": "no-store"
  });
  response.end(payload);
}

function routePath(pathname) {
  const withoutApiPrefix = pathname.replace(/^\/api(?=\/|$)/, "");
  return withoutApiPrefix || "/";
}

async function readRuntimeFixture(runtimeConfigPath) {
  const raw = await readFile(runtimeConfigPath, "utf8");
  return JSON.parse(raw);
}

function activeDeviceResponse() {
  return {
    code: 200,
    success: true,
    localDevelopment: true,
    data: {
      status: "active",
      isPaid: true,
      isTrial: false,
      token: "LOCAL-DEV-TOKEN",
      planType: "local-development",
      expireTime: null,
      aiQuota: null,
      personaTestQuota: null,
      workPublishQuota: null
    }
  };
}

function activationResponse() {
  return {
    code: 200,
    success: true,
    localDevelopment: true,
    token: "LOCAL-DEV-TOKEN",
    planType: "local-development",
    expireTime: null,
    message: "本地开发模式已启用"
  };
}

function notImplemented(feature) {
  return {
    code: 501,
    success: false,
    localDevelopment: true,
    implemented: false,
    error: "LOCAL_FEATURE_NOT_IMPLEMENTED",
    feature,
    msg: `本地开发服务尚未实现 ${feature}，请按 docs/03_本地开发模式与接口契约.md 接入实现`
  };
}

export function createLocalBackendServer({
  host = DEFAULT_LOCAL_HOST,
  port = DEFAULT_LOCAL_PORT,
  runtimeConfigPath = DEFAULT_RUNTIME_CONFIG_PATH,
  logger = console
} = {}) {
  const server = http.createServer(async (request, response) => {
    const requestUrl = new URL(request.url || "/", `http://${host}:${port}`);
    const pathname = routePath(requestUrl.pathname);
    logger.info?.(`[LocalBackend] ${request.method || "GET"} ${pathname}`);

    if (request.method === "OPTIONS") {
      response.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Authorization, Content-Type, X-Device-ID, X-Product-Slug",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
      });
      response.end();
      return;
    }

    if (request.method === "GET" && pathname === "/healthz") {
      sendJson(response, 200, {
        ok: true,
        service: "huoke-local-development-backend"
      });
      return;
    }

    if (request.method === "POST" && pathname === "/device/report") {
      sendJson(response, 200, activeDeviceResponse());
      return;
    }

    if (request.method === "POST" && pathname === "/auth-codes/use") {
      sendJson(response, 200, activationResponse());
      return;
    }

    if (request.method === "GET" && pathname === "/radar/runtime-config") {
      try {
        const fixture = await readRuntimeFixture(runtimeConfigPath);
        if (fixture.configured !== true || !fixture.config || typeof fixture.config !== "object") {
          sendJson(response, 503, {
            code: 503,
            success: false,
            localDevelopment: true,
            error: "LOCAL_RUNTIME_CONFIG_NOT_CONFIGURED",
            msg: "请先填写 local-services/runtime-config.dev.json，并将 configured 改为 true"
          });
          return;
        }
        const validation = validateRuntimeConfig(fixture.config);
        if (!validation.valid) {
          sendJson(response, 422, {
            code: 422,
            success: false,
            localDevelopment: true,
            error: "LOCAL_RUNTIME_CONFIG_INCOMPLETE",
            msg: "本地运行配置未通过完整性校验",
            details: validation.errors
          });
          return;
        }
        sendJson(response, 200, {
          code: 200,
          success: true,
          localDevelopment: true,
          data: {
            plain: fixture.config,
            etag: fixture.config.version || "local-development"
          }
        });
      } catch (error) {
        sendJson(response, 500, {
          code: 500,
          success: false,
          localDevelopment: true,
          error: "LOCAL_RUNTIME_CONFIG_INVALID",
          msg: error.message
        });
      }
      return;
    }

    if (request.method === "GET" && pathname === "/product/check-update") {
      sendJson(response, 200, {
        hasUpdate: false,
        localDevelopment: true
      });
      return;
    }

    if (request.method === "POST" && pathname === "/radar/report-data") {
      sendJson(response, 200, {
        code: 200,
        success: true,
        localDevelopment: true,
        accepted: true,
        persisted: false
      });
      return;
    }

    if (request.method === "POST" && pathname === "/feedback/submit") {
      sendJson(response, 200, {
        code: 200,
        success: true,
        localDevelopment: true,
        accepted: true,
        persisted: false
      });
      return;
    }

    const unimplementedRoutes = new Map([
      ["/radar/analyze", "内容分析"],
      ["/radar/ai/lead-match", "线索匹配"],
      ["/radar/ai/v2/comment-decision", "评论决策与生成"],
      ["/radar/ai/v2/video-match", "视频匹配"],
      ["/radar/ai/work-publish-generate", "作品文案生成"],
      ["/radar/ai/work-publish-quota", "作品文案额度"],
      ["/feedback/upload", "反馈图片上传"]
    ]);
    if (unimplementedRoutes.has(pathname)) {
      sendJson(response, 501, notImplemented(unimplementedRoutes.get(pathname)));
      return;
    }

    sendJson(response, 404, {
      code: 404,
      success: false,
      localDevelopment: true,
      error: "LOCAL_ROUTE_NOT_FOUND",
      method: request.method,
      path: pathname
    });
  });

  return {
    server,
    async start() {
      await new Promise((resolve, reject) => {
        server.once("error", reject);
        server.listen(port, host, () => {
          server.off("error", reject);
          resolve();
        });
      });
      const address = server.address();
      const actualPort = typeof address === "object" && address ? address.port : port;
      return {
        host,
        port: actualPort,
        apiBase: `http://${host}:${actualPort}/api`
      };
    },
    async stop() {
      if (!server.listening) {
        return;
      }
      await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    }
  };
}

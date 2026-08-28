import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const apiBaseRegion = require("../dist-protected/main/apiBaseRegion.js");

test("本地开发引导激活后跳过公网地域探测", async () => {
  const previousBootstrap = process.env.HUOKE_LOCAL_BOOTSTRAP_ACTIVE;
  const previousLocalApiBase = process.env.HUOKE_LOCAL_API_BASE;
  process.env.HUOKE_LOCAL_BOOTSTRAP_ACTIVE = "1";
  process.env.HUOKE_LOCAL_API_BASE = "http://127.0.0.1:48765/api/";
  let requestCount = 0;

  try {
    const result = await apiBaseRegion.resolveApiBaseByIp({
      async get() {
        requestCount += 1;
        throw new Error("公网探测不应执行");
      }
    }, {
      apiBase: "https://example.invalid/api",
      apiBase2: "https://example-2.invalid/api"
    });

    assert.equal(result.apiBase, "http://127.0.0.1:48765/api");
    assert.equal(result.used, "localDevelopment");
    assert.equal(result.reason, "local_development");
    assert.equal(requestCount, 0);
  } finally {
    if (previousBootstrap === undefined) {
      delete process.env.HUOKE_LOCAL_BOOTSTRAP_ACTIVE;
    } else {
      process.env.HUOKE_LOCAL_BOOTSTRAP_ACTIVE = previousBootstrap;
    }
    if (previousLocalApiBase === undefined) {
      delete process.env.HUOKE_LOCAL_API_BASE;
    } else {
      process.env.HUOKE_LOCAL_API_BASE = previousLocalApiBase;
    }
  }
});

import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { createLocalBackendServer } from "../local-services/backend.mjs";

test("本地服务返回开发授权且对未实现 AI 功能明确失败", async t => {
  const backend = createLocalBackendServer({
    port: 0,
    logger: {
      info() {}
    }
  });
  const address = await backend.start();
  t.after(() => backend.stop());

  const authResponse = await fetch(`${address.apiBase}/device/report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: "{}"
  });
  assert.equal(authResponse.status, 200);
  const authBody = await authResponse.json();
  assert.equal(authBody.data.status, "active");
  assert.equal(authBody.data.token, "LOCAL-DEV-TOKEN");
  assert.equal(authBody.localDevelopment, true);

  const aiResponse = await fetch(`${address.apiBase}/radar/ai/lead-match`, {
    method: "POST"
  });
  assert.equal(aiResponse.status, 501);
  const aiBody = await aiResponse.json();
  assert.equal(aiBody.implemented, false);
  assert.equal(aiBody.error, "LOCAL_FEATURE_NOT_IMPLEMENTED");
});

test("默认本地运行配置可以通过完整性校验", async t => {
  const backend = createLocalBackendServer({
    port: 0,
    logger: {
      info() {}
    }
  });
  const address = await backend.start();
  t.after(() => backend.stop());

  const response = await fetch(`${address.apiBase}/radar/runtime-config`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.match(body.data.plain.version, /^local-compat-/);
  assert.equal(body.data.etag, body.data.plain.version);
});

test("未填写运行配置时保持 fail-closed", async t => {
  const fixtureDirectory = await mkdtemp(path.join(tmpdir(), "huoke-local-contract-"));
  const fixturePath = path.join(fixtureDirectory, "runtime-config.json");
  await writeFile(fixturePath, JSON.stringify({
    configured: false,
    config: {}
  }), "utf8");
  t.after(() => rm(fixtureDirectory, {
    recursive: true,
    force: true
  }));

  const backend = createLocalBackendServer({
    port: 0,
    runtimeConfigPath: fixturePath,
    logger: {
      info() {}
    }
  });
  const address = await backend.start();
  t.after(() => backend.stop());

  const response = await fetch(`${address.apiBase}/radar/runtime-config`);
  assert.equal(response.status, 503);
  const body = await response.json();
  assert.equal(body.error, "LOCAL_RUNTIME_CONFIG_NOT_CONFIGURED");
});

test("configured=true 但字段为空时拒绝伪就绪配置", async t => {
  const fixtureDirectory = await mkdtemp(path.join(tmpdir(), "huoke-local-invalid-contract-"));
  const fixturePath = path.join(fixtureDirectory, "runtime-config.json");
  await writeFile(fixturePath, JSON.stringify({
    configured: true,
    config: {
      version: "contract-test",
      commentV2: {},
      dmV2: {},
      gated: {}
    }
  }), "utf8");
  t.after(() => rm(fixtureDirectory, {
    recursive: true,
    force: true
  }));

  const backend = createLocalBackendServer({
    port: 0,
    runtimeConfigPath: fixturePath,
    logger: {
      info() {}
    }
  });
  const address = await backend.start();
  t.after(() => backend.stop());

  const response = await fetch(`${address.apiBase}/radar/runtime-config`);
  assert.equal(response.status, 422);
  const body = await response.json();
  assert.equal(body.error, "LOCAL_RUNTIME_CONFIG_INCOMPLETE");
  assert.ok(body.details.includes("commentV2.commentInput 不能为空"));
});

test("遥测与更新的本地响应不会触发外部动作", async t => {
  const backend = createLocalBackendServer({
    port: 0,
    logger: {
      info() {}
    }
  });
  const address = await backend.start();
  t.after(() => backend.stop());

  const reportResponse = await fetch(`${address.apiBase}/radar/report-data`, {
    method: "POST"
  });
  assert.equal(reportResponse.status, 200);
  const reportBody = await reportResponse.json();
  assert.equal(reportBody.persisted, false);

  const updateResponse = await fetch(`${address.apiBase}/product/check-update`);
  assert.equal(updateResponse.status, 200);
  const updateBody = await updateResponse.json();
  assert.equal(updateBody.hasUpdate, false);
});

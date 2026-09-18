import assert from "node:assert/strict";
import http from "node:http";
import test from "node:test";
import { createLocalBackendServer } from "../local-services/backend.mjs";
import { createAiHandlers } from "../local-services/ai-handlers.mjs";
import { createOllamaClient } from "../local-services/ollama-client.mjs";

// 假 Ollama 客户端：把传入的 responder 结果直接返回，用于翻译层单测。
function fakeOllama(responder) {
  return {
    baseUrl: "http://fake",
    model: "fake",
    isAvailable: async () => true,
    async chatStructured(_messages, _schema, _opts) {
      return responder(_messages, _schema, _opts);
    }
  };
}

const SILENT_LOGGER = { info() {}, warn() {} };

test("comment-decision：翻译 Ollama 输出并回写为 app 数组形状", async () => {
  const fake = fakeOllama(async () => ([
    { should_like: true, should_reply: false, reply_content: "", thought: "高意向" },
    { should_like: false, should_reply: true, reply_content: "你好，方便了解下吗？", thought: "普通咨询" }
  ]));
  const ai = createAiHandlers(fake);
  const out = await ai.commentDecision({
    intent: "身份: X; 目的: Y; 要求: Z",
    video_title: "示例视频",
    keywords: "k",
    accountName: "acc",
    leads: [{ nickname: "a", content: "c1" }, { nickname: "b", content: "c2" }]
  });
  assert.equal(out.code, 200);
  assert.equal(out.data.length, 2);
  assert.equal(out.data[0].should_like, true);
  assert.equal(out.data[0].should_reply, false);
  assert.equal(out.data[1].should_reply, true);
  assert.equal(out.data[1].reply_content, "你好，方便了解下吗？");
});

test("comment-decision：leads 为空直接返回空数组", async () => {
  const ai = createAiHandlers(fakeOllama(async () => []));
  const out = await ai.commentDecision({ leads: [] });
  assert.deepEqual(out, { code: 200, data: [] });
});

test("comment-decision：Ollama 返回条数不足时按索引补缺（fail-closed）", async () => {
  const fake = fakeOllama(async () => ([{ should_like: true, should_reply: true, reply_content: "x", thought: "y" }]));
  const ai = createAiHandlers(fake);
  const out = await ai.commentDecision({ leads: [{ nickname: "a" }, { nickname: "b" }] });
  assert.equal(out.data.length, 2);
  // 第 2 条缺失 -> 全 false、空字符串
  assert.equal(out.data[1].should_like, false);
  assert.equal(out.data[1].reply_content, "");
});

test("video-match：pass 缺失时 fail-closed 为 false", async () => {
  const fake = fakeOllama(async () => ({ score: 80, reason: "看起来匹配" }));
  const ai = createAiHandlers(fake);
  const out = await ai.videoMatch({ intent: "x", video_title: "v", with_main_post: false });
  assert.equal(out.code, 200);
  assert.equal(out.data.pass, false);
  assert.equal(out.data.score, 80);
  assert.equal(out.data.main_post_comment, "");
});

test("video-match：with_main_post=true 时回写主评", async () => {
  const fake = fakeOllama(async () => ({
    pass: true,
    score: 92,
    reason: "人群匹配",
    main_post_comment: "这个观点很有意思"
  }));
  const ai = createAiHandlers(fake);
  const out = await ai.videoMatch({ intent: "x", video_title: "v", with_main_post: true });
  assert.equal(out.data.pass, true);
  assert.equal(out.data.main_post_comment, "这个观点很有意思");
});

test("lead-match：回写 pass/score/reason", async () => {
  const fake = fakeOllama(async () => ({ pass: true, score: 90, reason: "画像匹配" }));
  const ai = createAiHandlers(fake);
  const out = await ai.leadMatch({ intent: "x", video_title: "v", lead: { nickname: "n" } });
  assert.equal(out.data.pass, true);
  assert.equal(out.data.score, 90);
  assert.equal(out.data.reason, "画像匹配");
});

test("work-publish-generate：回写 items 与 null 配额", async () => {
  const fake = fakeOllama(async () => ({ items: [{ title: "T1", description: "D1" }] }));
  const ai = createAiHandlers(fake);
  const out = await ai.workPublishGenerate({ seedTitle: "s", count: 1, similarity: 30 });
  assert.equal(out.code, 200);
  assert.equal(out.data.items.length, 1);
  assert.equal(out.data.items[0].title, "T1");
  assert.equal(out.workPublishQuota, null);
});

test("work-publish-quota：固定返回本地开发配额对象", async () => {
  const ai = createAiHandlers(fakeOllama(async () => ({})));
  const out = await ai.workPublishQuota();
  assert.equal(out.code, 200);
  assert.equal(out.data.remaining, null);
  assert.equal(out.data.planType, "local-development");
});

test("后端：注入 ollama 后 comment-decision 路由返回 app 形状", async t => {
  const fake = fakeOllama(async () => ([{ should_like: false, should_reply: true, reply_content: "hi", thought: "t" }]));
  const backend = createLocalBackendServer({ port: 0, ollamaClient: fake, logger: SILENT_LOGGER });
  const address = await backend.start();
  t.after(() => backend.stop());

  const res = await fetch(`${address.apiBase}/radar/ai/v2/comment-decision`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ leads: [{ nickname: "a", content: "c" }] })
  });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.code, 200);
  assert.equal(body.data[0].reply_content, "hi");
});

test("后端：未配置 ollama 时 comment-decision 仍返回 501（保持 fail-closed）", async t => {
  const backend = createLocalBackendServer({ port: 0, logger: SILENT_LOGGER });
  const address = await backend.start();
  t.after(() => backend.stop());

  const res = await fetch(`${address.apiBase}/radar/ai/v2/comment-decision`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ leads: [{ nickname: "a" }] })
  });
  assert.equal(res.status, 501);
  const body = await res.json();
  assert.equal(body.implemented, false);
});

test("端到端：本地后端经假 Ollama HTTP 服务完成 video-match", async t => {
  const ollamaServer = http.createServer((req, res) => {
    let buf = "";
    req.on("data", c => (buf += c));
    req.on("end", () => {
      // 校验确实收到了 /api/chat 且 body 含 format 字段
      assert.ok(req.url.includes("/api/chat"));
      const payload = JSON.parse(buf);
      assert.ok(payload.format && payload.model);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        message: { content: JSON.stringify({ pass: true, score: 88, reason: "假服务匹配", main_post_comment: "" }) }
      }));
    });
  });
  await new Promise(r => ollamaServer.listen(0, r));
  t.after(() => ollamaServer.close());

  const ollamaPort = ollamaServer.address().port;
  const ollamaClient = createOllamaClient({
    baseUrl: `http://127.0.0.1:${ollamaPort}`,
    model: "fake",
    fetchFn: fetch
  });
  const backend = createLocalBackendServer({ port: 0, ollamaClient, logger: SILENT_LOGGER });
  const address = await backend.start();
  t.after(() => backend.stop());

  const res = await fetch(`${address.apiBase}/radar/ai/v2/video-match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ intent: "x", video_title: "v", with_main_post: false })
  });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.code, 200);
  assert.equal(body.data.pass, true);
  assert.equal(body.data.score, 88);
});

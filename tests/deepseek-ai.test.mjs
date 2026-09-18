import assert from "node:assert/strict";
import http from "node:http";
import test from "node:test";
import { parseStructuredJson, createDeepSeekClient, DeepSeekError } from "../local-services/deepseek-client.mjs";
import { createFallbackAiClient } from "../local-services/fallback-ai-client.mjs";
import { resolveAiClient } from "../local-services/ai-factory.mjs";

test("parseStructuredJson：能正确解析多种大模型返回格式", () => {
  // 1. 标准 JSON 对象
  assert.deepEqual(parseStructuredJson('{"pass": true, "score": 90}'), { pass: true, score: 90 });

  // 2. 标准 JSON 数组
  assert.deepEqual(parseStructuredJson('[{"should_like": true}]'), [{ should_like: true }]);

  // 3. Markdown 代码块包裹 ```json ... ```
  const mdBlock = "```json\n[{\"should_like\": false, \"reply_content\": \"你好\"}]\n```";
  assert.deepEqual(parseStructuredJson(mdBlock), [{ should_like: false, reply_content: "你好" }]);

  // 4. 前后包含说明文字的 JSON 抽取
  const mixedText = "这是分析结果：\n```\n{\"pass\": false, \"score\": 20}\n```\n请参考。";
  assert.deepEqual(parseStructuredJson(mixedText), { pass: false, score: 20 });

  // 5. 无法解析时抛出 DeepSeekError
  assert.throws(() => parseStructuredJson("没有任何结构化内容"), err => err instanceof DeepSeekError);
});

test("createDeepSeekClient：未提供 key 时直接报错", () => {
  assert.throws(() => createDeepSeekClient({ apiKey: "" }), /未配置 DEEPSEEK_API_KEY/);
});

test("createDeepSeekClient：调用假 DeepSeek 服务并解析响应", async t => {
  const fakeServer = http.createServer((req, res) => {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      assert.equal(req.headers.authorization, "Bearer test-key");
      assert.equal(req.headers["content-type"], "application/json");
      const parsed = JSON.parse(body);
      assert.equal(parsed.model, "deepseek-chat");
      assert.ok(Array.isArray(parsed.messages));

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        choices: [
          {
            message: {
              content: JSON.stringify([{ should_like: true, should_reply: true, reply_content: "来自 DeepSeek 的回复", thought: "高意向" }])
            }
          }
        ]
      }));
    });
  });

  await new Promise(r => fakeServer.listen(0, r));
  t.after(() => fakeServer.close());

  const port = fakeServer.address().port;
  const client = createDeepSeekClient({
    apiKey: "test-key",
    baseUrl: `http://127.0.0.1:${port}`,
    model: "deepseek-chat",
    fetchFn: fetch
  });

  const result = await client.chatStructured([{ role: "user", content: "test" }], {});
  assert.equal(result.length, 1);
  assert.equal(result[0].should_like, true);
  assert.equal(result[0].reply_content, "来自 DeepSeek 的回复");
});

test("createFallbackAiClient：主客户端成功时不调用备用客户端", async () => {
  let backupCalled = false;
  const primary = {
    provider: "deepseek",
    chatStructured: async () => ({ source: "primary" })
  };
  const backup = {
    provider: "ollama",
    chatStructured: async () => {
      backupCalled = true;
      return { source: "backup" };
    }
  };

  const fallbackClient = createFallbackAiClient({
    primaryClient: primary,
    backupClient: backup,
    logger: { warn() {} }
  });

  const res = await fallbackClient.chatStructured([], {});
  assert.equal(res.source, "primary");
  assert.equal(backupCalled, false);
});

test("createFallbackAiClient：主客户端失败时自动无缝降级到备用客户端", async () => {
  let warnLogged = false;
  const primary = {
    provider: "deepseek",
    chatStructured: async () => {
      throw new Error("DeepSeek 网络超时");
    }
  };
  const backup = {
    provider: "ollama",
    chatStructured: async () => ({ source: "backup-success" })
  };

  const fallbackClient = createFallbackAiClient({
    primaryClient: primary,
    backupClient: backup,
    logger: {
      warn(msg) {
        warnLogged = true;
        assert.ok(msg.includes("自动切换至备用服务"));
      }
    }
  });

  const res = await fallbackClient.chatStructured([], {});
  assert.equal(res.source, "backup-success");
  assert.equal(warnLogged, true);
});

test("createFallbackAiClient：两者均失败时抛出错误", async () => {
  const primary = {
    provider: "deepseek",
    chatStructured: async () => { throw new Error("Primary 出错"); }
  };
  const backup = {
    provider: "ollama",
    chatStructured: async () => { throw new Error("Backup 也出错"); }
  };

  const fallbackClient = createFallbackAiClient({
    primaryClient: primary,
    backupClient: backup,
    logger: { warn() {} }
  });

  await assert.rejects(
    () => fallbackClient.chatStructured([], {}),
    /Backup 也出错/
  );
});

test("resolveAiClient：未配置密钥且未配置 Ollama 时返回 null", () => {
  const client = resolveAiClient({
    deepseekApiKey: "",
    enableOllamaBackup: false
  });
  // 如果环境变量里没有 HUOKE_OLLAMA_ENABLED 或 OLLAMA_BASE_URL
  if (!process.env.HUOKE_OLLAMA_ENABLED && !process.env.OLLAMA_BASE_URL) {
    assert.equal(client, null);
  }
});

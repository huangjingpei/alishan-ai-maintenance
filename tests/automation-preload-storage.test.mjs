import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const preloadPath = path.resolve(moduleDir, "../dist-protected/automation-preload.js");
const localRequire = createRequire(preloadPath);

test("automation-preload：在不透明源 (about:blank) 抛出 DOMException 时依然正常加载控制器", () => {
  const code = fs.readFileSync(preloadPath, "utf8");

  class MockDOMException extends Error {
    constructor(msg, name = "SecurityError") {
      super(msg);
      this.name = name;
    }
  }

  const loggedErrors = [];

  const mockWindow = {
    location: { href: "about:blank" },
    document: {
      querySelectorAll: () => [],
      querySelector: () => null,
      addEventListener: () => {},
      removeEventListener: () => {},
      cookie: ""
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true
  };

  // 模拟 Chromium 在 about:blank 下访问 localStorage / sessionStorage 抛出 SecurityError DOMException
  Object.defineProperty(mockWindow, "localStorage", {
    get() {
      throw new MockDOMException("Failed to read the 'localStorage' property from 'Window': Access is denied for this document.", "SecurityError");
    }
  });
  Object.defineProperty(mockWindow, "sessionStorage", {
    get() {
      throw new MockDOMException("Failed to read the 'sessionStorage' property from 'Window': Access is denied for this document.", "SecurityError");
    }
  });

  const mockElectron = {
    ipcRenderer: {
      on() {},
      send() {},
      invoke: async () => ({})
    },
    webFrame: {
      executeJavaScript: async () => ({})
    }
  };

  const sandbox = {
    require: (mod) => {
      if (mod === "electron") return mockElectron;
      return localRequire(mod);
    },
    window: mockWindow,
    document: mockWindow.document,
    console: {
      log() {},
      warn() {},
      error: (...args) => {
        loggedErrors.push(args.join(" "));
      }
    },
    __dirname: path.dirname(preloadPath),
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    Date,
    Array,
    Object,
    String,
    Number,
    Boolean,
    JSON,
    Map,
    Set,
    WeakMap,
    WeakSet,
    RegExp,
    Error,
    Math
  };

  // 通过 getter 挂载，使得执行访问时抛出异常
  Object.defineProperty(sandbox, "localStorage", {
    get() {
      return mockWindow.localStorage;
    }
  });
  Object.defineProperty(sandbox, "sessionStorage", {
    get() {
      return mockWindow.sessionStorage;
    }
  });

  // 执行脚本，验证是否会因 DOMException 导致控制器加载失败
  const script = new vm.Script(code, { filename: preloadPath });
  const context = vm.createContext(sandbox);

  assert.doesNotThrow(() => {
    script.runInContext(context);
  });

  // 校验没有任何一个 [Built-in-Debug] 控制器报 DOMException 加载失败
  const domExceptionFailures = loggedErrors.filter(msg =>
    msg.includes("[Built-in-Debug]") &&
    (msg.includes("DOMException") || msg.includes("SecurityError") || msg.includes("Access is denied"))
  );

  assert.deepEqual(
    domExceptionFailures,
    [],
    `automation-preload 不应抛出 DOMException: ${domExceptionFailures.join("; ")}`
  );
});

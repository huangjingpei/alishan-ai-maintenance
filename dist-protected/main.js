'use strict';

require("bytenode");
const path = require("path");
const fs = require("fs");

function enableLocalDevelopmentBootstrap() {
  if (process.env.HUOKE_LOCAL_DEV !== "1") {
    return;
  }
  const { app } = require("electron");
  if (app.isPackaged) {
    console.warn("[LocalDev] HUOKE_LOCAL_DEV 被忽略：打包程序不允许启用本地开发模式");
    return;
  }
  const localUserData = process.env.HUOKE_LOCAL_USER_DATA || path.join(__dirname, "..", ".local-data");
  const resolvedLocalUserData = path.resolve(localUserData);
  const localApiBase = String(process.env.HUOKE_LOCAL_API_BASE || process.env.API_BASE || "").trim().replace(/\/+$/, "");
  process.env.HUOKE_LOCAL_BOOTSTRAP_ACTIVE = "1";
  fs.mkdirSync(resolvedLocalUserData, {
    recursive: true
  });
  if (localApiBase) {
    const localConfigPath = path.join(resolvedLocalUserData, "config.json");
    let localConfig = {};
    try {
      localConfig = JSON.parse(fs.readFileSync(localConfigPath, "utf8"));
    } catch (_error) {}
    localConfig.api_base_region_cache = {
      apiBase: localApiBase,
      used: "localDevelopment",
      matched: true,
      reason: "local_development",
      location: null,
      savedAt: Date.now()
    };
    fs.writeFileSync(localConfigPath, JSON.stringify(localConfig, null, "\t") + "\n", "utf8");
    console.log("[LocalDev] API 基址缓存已固定为:", localApiBase);
  }
  const originalSetPath = app.setPath.bind(app);
  originalSetPath("userData", resolvedLocalUserData);
  app.setPath = (name, value) => {
    if (name === "userData") {
      const requestedPath = path.resolve(String(value || ""));
      if (requestedPath !== resolvedLocalUserData) {
        console.warn("[LocalDev] 忽略应用对 userData 的覆盖:", requestedPath);
      }
      return originalSetPath("userData", resolvedLocalUserData);
    }
    return originalSetPath(name, value);
  };
  console.log("[LocalDev] 使用隔离的 userData:", resolvedLocalUserData);

  const localRendererIndex = path.join(__dirname, "renderer", "index.html");
  let rendererFallbackInstalled = false;
  app.on("browser-window-created", (_event, browserWindow) => {
    if (rendererFallbackInstalled) {
      return;
    }
    rendererFallbackInstalled = true;
    const contents = browserWindow.webContents;
    let fallbackUsed = false;
    contents.on("did-fail-load", (_loadEvent, errorCode, errorDescription, validatedUrl, isMainFrame) => {
      if (fallbackUsed || isMainFrame === false || errorCode === -3) {
        return;
      }
      let failedUrl;
      try {
        failedUrl = new URL(validatedUrl);
      } catch (_error) {
        return;
      }
      if (failedUrl.protocol !== "http:" || !["localhost", "127.0.0.1"].includes(failedUrl.hostname)) {
        return;
      }
      fallbackUsed = true;
      console.warn("[LocalDev] 原前端开发服务器不可用，改为加载恢复版 renderer:", validatedUrl, errorDescription);
      browserWindow.loadFile(localRendererIndex).catch(error => {
        console.error("[LocalDev] renderer 加载失败:", error.message);
      });
    });
    contents.on("did-finish-load", () => {
      if (!fallbackUsed) {
        return;
      }
      browserWindow.setMenuBarVisibility(false);
      if (contents.isDevToolsOpened()) {
        contents.closeDevTools();
      }
    });
  });
}

enableLocalDevelopmentBootstrap();

const archJsc = path.join(__dirname, "main." + process.arch + ".jsc");
const fallbackJsc = path.join(__dirname, "main.jsc");
const jscPath = fs.existsSync(archJsc) ? archJsc : fallbackJsc;
if (!fs.existsSync(jscPath)) {
  console.error("[Loader] main bytecode missing for arch=" + process.arch);
  process.exit(1);
}
require(jscPath);

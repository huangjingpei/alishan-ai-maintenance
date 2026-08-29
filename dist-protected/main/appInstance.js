'use strict';

const fs = require("fs");
const path = require("path");
const {
  spawn
} = require("child_process");
const {
  app
} = require("electron");
const HANDOVER_FILE_NAME = "instance-handover.json";
const HANDOVER_MAX_AGE_MS = 60000;
function readOwnAppVersionEarly() {
  try {
    const list = [path.join(app.getAppPath(), "package.json"), path.join(__dirname, "..", "package.json")];
    for (const item of list) {
      if (!fs.existsSync(item)) {
        continue;
      }
      const result = String(JSON.parse(fs.readFileSync(item, "utf8")).version || "").trim();
      if (result) {
        return result;
      }
    }
  } catch (error) {}
  try {
    return String(app.getVersion() || "").trim();
  } catch (error) {
    return "";
  }
}
function getHandoverPath(arg1) {
  return path.join(arg1, HANDOVER_FILE_NAME);
}
function writeInstanceHandoverRequest(arg1) {
  try {
    fs.mkdirSync(arg1, {
      recursive: true
    });
    const obj = {
      version: readOwnAppVersionEarly(),
      execPath: process.execPath,
      argv: process.argv.slice(1).filter(arg1 => arg1 && arg1 !== process.execPath),
      cwd: process.cwd(),
      ts: Date.now()
    };
    fs.writeFileSync(getHandoverPath(arg1), JSON.stringify(obj), "utf8");
    console.log("[Instance] 已写入切换请求: v" + obj.version + " → " + obj.execPath);
  } catch (error) {
    console.warn("[Instance] 写入切换请求失败:", error?.message || error);
  }
}
function consumeInstanceHandoverRequest(arg1) {
  const result = getHandoverPath(arg1);
  try {
    if (!fs.existsSync(result)) {
      return null;
    }
    const result2 = fs.readFileSync(result, "utf8");
    fs.unlinkSync(result);
    const result3 = JSON.parse(result2 || "{}");
    if (!result3 || !result3.version || !result3.execPath) {
      return null;
    }
    if (result3.ts && Date.now() - Number(result3.ts) > HANDOVER_MAX_AGE_MS) {
      return null;
    }
    return result3;
  } catch (error) {
    try {
      fs.unlinkSync(result);
    } catch (error) {}
    return null;
  }
}
function installAppInstanceLock({
  userDataPath: userDataPath,
  onShowMainWindow: onShowMainWindow,
  onQuitApplication: onQuitApplication
} = {}) {
  if (!userDataPath) {
    throw new Error("installAppInstanceLock: userDataPath required");
  }
  function fn(arg1, arg2, arg3) {
    const result = consumeInstanceHandoverRequest(userDataPath);
    const result2 = readOwnAppVersionEarly();
    const result3 = String(result?.version || "").trim();
    const result4 = String(result?.execPath || "").trim();
    const local = !!result && !!result3 && !!result4 && result3 !== result2 && !!fs.existsSync(result4);
    if (local) {
      console.log("[Instance] 版本不一致：运行中 " + result2 + "，新打开 " + result3 + "，切换到新包");
      try {
        if (typeof app.releaseSingleInstanceLock === "function") {
          app.releaseSingleInstanceLock();
        }
      } catch (error) {}
      try {
        const result2 = spawn(result4, Array.isArray(result.argv) ? result.argv : [], {
          detached: true,
          cwd: result.cwd || arg3 || path.dirname(result4),
          stdio: "ignore",
          windowsHide: true
        });
        result2.unref();
      } catch (error) {
        console.error("[Instance] 启动新版本失败，回退为唤起当前窗口:", error?.message || error);
        if (typeof onShowMainWindow === "function") {
          onShowMainWindow();
        }
        return;
      }
      try {
        if (typeof onQuitApplication === "function") {
          onQuitApplication();
        } else {
          app.isQuitting = true;
          app.quit();
        }
      } catch (error) {
        app.isQuitting = true;
        app.quit();
      }
      return;
    }
    if (typeof onShowMainWindow === "function") {
      onShowMainWindow();
    }
  }
  const result = app.requestSingleInstanceLock();
  if (!result) {
    writeInstanceHandoverRequest(userDataPath);
    app.isQuitting = true;
    setImmediate(() => app.quit());
  } else {
    app.on("second-instance", fn);
  }
  return result;
}
module.exports = {
  HANDOVER_FILE_NAME: HANDOVER_FILE_NAME,
  HANDOVER_MAX_AGE_MS: HANDOVER_MAX_AGE_MS,
  readOwnAppVersionEarly: readOwnAppVersionEarly,
  writeInstanceHandoverRequest: writeInstanceHandoverRequest,
  consumeInstanceHandoverRequest: consumeInstanceHandoverRequest,
  installAppInstanceLock: installAppInstanceLock
};
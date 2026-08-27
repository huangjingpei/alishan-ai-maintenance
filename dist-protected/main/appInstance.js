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
    const _0xf5de2f = [path.join(app.getAppPath(), "package.json"), path.join(__dirname, "..", "package.json")];
    for (const _0x405147 of _0xf5de2f) {
      if (!fs.existsSync(_0x405147)) {
        continue;
      }
      const _0x51e765 = String(JSON.parse(fs.readFileSync(_0x405147, "utf8")).version || "").trim();
      if (_0x51e765) {
        return _0x51e765;
      }
    }
  } catch (_0x48ae2a) {}
  try {
    return String(app.getVersion() || "").trim();
  } catch (_0x1f17f8) {
    return "";
  }
}
function getHandoverPath(_0x599b51) {
  return path.join(_0x599b51, HANDOVER_FILE_NAME);
}
function writeInstanceHandoverRequest(_0x28630c) {
  try {
    fs.mkdirSync(_0x28630c, {
      recursive: true
    });
    const _0x113e3f = {
      version: readOwnAppVersionEarly(),
      execPath: process.execPath,
      argv: process.argv.slice(1).filter(_0x1d5a64 => _0x1d5a64 && _0x1d5a64 !== process.execPath),
      cwd: process.cwd(),
      ts: Date.now()
    };
    fs.writeFileSync(getHandoverPath(_0x28630c), JSON.stringify(_0x113e3f), "utf8");
    console.log("[Instance] 已写入切换请求: v" + _0x113e3f.version + " → " + _0x113e3f.execPath);
  } catch (_0x34a23f) {
    console.warn("[Instance] 写入切换请求失败:", _0x34a23f?.message || _0x34a23f);
  }
}
function consumeInstanceHandoverRequest(_0x456541) {
  const _0x373024 = getHandoverPath(_0x456541);
  try {
    if (!fs.existsSync(_0x373024)) {
      return null;
    }
    const _0x19d181 = fs.readFileSync(_0x373024, "utf8");
    fs.unlinkSync(_0x373024);
    const _0x54a169 = JSON.parse(_0x19d181 || "{}");
    if (!_0x54a169 || !_0x54a169.version || !_0x54a169.execPath) {
      return null;
    }
    if (_0x54a169.ts && Date.now() - Number(_0x54a169.ts) > HANDOVER_MAX_AGE_MS) {
      return null;
    }
    return _0x54a169;
  } catch (_0x572026) {
    try {
      fs.unlinkSync(_0x373024);
    } catch (_0x1dcf01) {}
    return null;
  }
}
function installAppInstanceLock({
  userDataPath: _0x203ff6,
  onShowMainWindow: _0x2f0d98,
  onQuitApplication: _0x55f8b7
} = {}) {
  if (!_0x203ff6) {
    throw new Error("installAppInstanceLock: userDataPath required");
  }
  function _0x53e04c(_0x855394, _0x506e68, _0x1c8f23) {
    const _0x4c2ce6 = consumeInstanceHandoverRequest(_0x203ff6);
    const _0x30b1a9 = readOwnAppVersionEarly();
    const _0x2883f2 = String(_0x4c2ce6?.version || "").trim();
    const _0x48ae88 = String(_0x4c2ce6?.execPath || "").trim();
    const _0x549be9 = !!_0x4c2ce6 && !!_0x2883f2 && !!_0x48ae88 && _0x2883f2 !== _0x30b1a9 && !!fs.existsSync(_0x48ae88);
    if (_0x549be9) {
      console.log("[Instance] 版本不一致：运行中 " + _0x30b1a9 + "，新打开 " + _0x2883f2 + "，切换到新包");
      try {
        if (typeof app.releaseSingleInstanceLock === "function") {
          app.releaseSingleInstanceLock();
        }
      } catch (_0x5755a9) {}
      try {
        const _0xe7f358 = spawn(_0x48ae88, Array.isArray(_0x4c2ce6.argv) ? _0x4c2ce6.argv : [], {
          detached: true,
          cwd: _0x4c2ce6.cwd || _0x1c8f23 || path.dirname(_0x48ae88),
          stdio: "ignore",
          windowsHide: true
        });
        _0xe7f358.unref();
      } catch (_0x22458a) {
        console.error("[Instance] 启动新版本失败，回退为唤起当前窗口:", _0x22458a?.message || _0x22458a);
        if (typeof _0x2f0d98 === "function") {
          _0x2f0d98();
        }
        return;
      }
      try {
        if (typeof _0x55f8b7 === "function") {
          _0x55f8b7();
        } else {
          app.isQuitting = true;
          app.quit();
        }
      } catch (_0x5d81e4) {
        app.isQuitting = true;
        app.quit();
      }
      return;
    }
    if (typeof _0x2f0d98 === "function") {
      _0x2f0d98();
    }
  }
  const _0x1cbac9 = app.requestSingleInstanceLock();
  if (!_0x1cbac9) {
    writeInstanceHandoverRequest(_0x203ff6);
    app.isQuitting = true;
    setImmediate(() => app.quit());
  } else {
    app.on("second-instance", _0x53e04c);
  }
  return _0x1cbac9;
}
module.exports = {
  HANDOVER_FILE_NAME: HANDOVER_FILE_NAME,
  HANDOVER_MAX_AGE_MS: HANDOVER_MAX_AGE_MS,
  readOwnAppVersionEarly: readOwnAppVersionEarly,
  writeInstanceHandoverRequest: writeInstanceHandoverRequest,
  consumeInstanceHandoverRequest: consumeInstanceHandoverRequest,
  installAppInstanceLock: installAppInstanceLock
};
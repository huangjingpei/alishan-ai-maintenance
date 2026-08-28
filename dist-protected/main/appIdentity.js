'use strict';

const fs = require("fs");
const path = require("path");
const {
  app
} = require("electron");
function resolveAppDisplayName({
  appDir: _0x3eeb30
} = {}) {
  const _0x3853a4 = String("抖多客" || "").trim();
  if (_0x3853a4) {
    return _0x3853a4;
  }
  const _0xa1add6 = [];
  try {
    _0xa1add6.push(_0x3eeb30 || path.join(__dirname, ".."));
  } catch (_0x42fa93) {}
  try {
    _0xa1add6.push(app.getAppPath());
  } catch (_0x4727fd) {}
  for (const _0x53a6f1 of _0xa1add6) {
    if (!_0x53a6f1) {
      continue;
    }
    for (const _0x537ae5 of ["build-variant.manifest.json", "electron-builder.effective.json", "package.json"]) {
      try {
        const _0x317ff7 = path.join(_0x53a6f1, _0x537ae5);
        if (!fs.existsSync(_0x317ff7)) {
          continue;
        }
        const _0x377bd0 = JSON.parse(fs.readFileSync(_0x317ff7, "utf8"));
        const _0x333e13 = _0x377bd0?.productName || _0x377bd0?.build?.productName;
        if (_0x333e13 && String(_0x333e13).trim()) {
          return String(_0x333e13).trim();
        }
      } catch (_0x12e721) {}
    }
  }
  try {
    const _0x1b9556 = app.getName();
    if (_0x1b9556 && _0x1b9556 !== "Electron" && !/^huoke-radar/i.test(_0x1b9556)) {
      return _0x1b9556;
    }
  } catch (_0x4bb4a2) {}
  return "获客雷达";
}
function applyAppDisplayName(_0x4338d8 = {}) {
  const _0x32b198 = resolveAppDisplayName(_0x4338d8);
  try {
    app.setName(_0x32b198);
    console.log("[AppName] display => " + _0x32b198);
  } catch (_0x282b14) {
    console.warn("[AppName] setName 失败:", _0x282b14?.message || _0x282b14);
  }
  return _0x32b198;
}
function stripTrailingVersionSuffixes(_0x57f7fb) {
  const _0x54a71e = String(_0x57f7fb || "").trim();
  if (!_0x54a71e) {
    return "";
  }
  const _0xd22845 = _0x54a71e.replace(/(?:_\d+\.\d+\.\d+(?:[-+][\w.]+)?)+$/i, "").trim();
  return _0xd22845 || _0x54a71e;
}
function getAppProductName({
  appDir: _0x42d211,
  displayName: _0x2c8039
} = {}) {
  const _0x1149f0 = String(typeof _0x2c8039 === "string" ? _0x2c8039 : "").trim() || String("抖多客" || "").trim();
  if (_0x1149f0) {
    return _0x1149f0;
  }
  const _0x5167c0 = (() => {
    try {
      return app.getAppPath();
    } catch (_0x318fa) {
      return "";
    }
  })();
  const _0x5d5e49 = [_0x42d211 || path.join(__dirname, ".."), _0x5167c0].filter(Boolean);
  const _0xbfb456 = ["build-variant.manifest.json", "electron-builder.effective.json", "package.json"];
  for (const _0x53526e of _0x5d5e49) {
    for (const _0x45a973 of _0xbfb456) {
      try {
        const _0x2722c8 = path.join(_0x53526e, _0x45a973);
        if (!fs.existsSync(_0x2722c8)) {
          continue;
        }
        const _0x1af9a3 = JSON.parse(fs.readFileSync(_0x2722c8, "utf8"));
        const _0x1e931c = _0x1af9a3?.productName || _0x1af9a3?.build?.productName;
        if (_0x1e931c) {
          return String(_0x1e931c).trim();
        }
      } catch (_0x351f14) {}
    }
  }
  const _0xd500e5 = (process.env.PORTABLE_EXECUTABLE_FILE || "").trim();
  if (_0xd500e5) {
    const _0x51a256 = path.basename(_0xd500e5, path.extname(_0xd500e5));
    const _0x1c1215 = stripTrailingVersionSuffixes(_0x51a256);
    if (_0x1c1215) {
      return _0x1c1215;
    }
  }
  try {
    const _0x50adb5 = app.getName();
    if (_0x50adb5 && _0x50adb5 !== "Electron" && !/^huoke-radar/i.test(_0x50adb5)) {
      return _0x50adb5;
    }
  } catch (_0x4b51a1) {}
  return "app";
}
module.exports = {
  resolveAppDisplayName: resolveAppDisplayName,
  applyAppDisplayName: applyAppDisplayName,
  stripTrailingVersionSuffixes: stripTrailingVersionSuffixes,
  getAppProductName: getAppProductName
};
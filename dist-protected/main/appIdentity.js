'use strict';

const fs = require("fs");
const path = require("path");
const {
  app
} = require("electron");
function resolveAppDisplayName({
  appDir: appDir
} = {}) {
  const result = String("抖多客" || "").trim();
  if (result) {
    return result;
  }
  const list = [];
  try {
    list.push(appDir || path.join(__dirname, ".."));
  } catch (error) {}
  try {
    list.push(app.getAppPath());
  } catch (error) {}
  for (const item of list) {
    if (!item) {
      continue;
    }
    for (const item2 of ["build-variant.manifest.json", "electron-builder.effective.json", "package.json"]) {
      try {
        const result = path.join(item, item2);
        if (!fs.existsSync(result)) {
          continue;
        }
        const result2 = JSON.parse(fs.readFileSync(result, "utf8"));
        const local = result2?.productName || result2?.build?.productName;
        if (local && String(local).trim()) {
          return String(local).trim();
        }
      } catch (error) {}
    }
  }
  try {
    const result = app.getName();
    if (result && result !== "Electron" && !/^huoke-radar/i.test(result)) {
      return result;
    }
  } catch (error) {}
  return "获客雷达";
}
function applyAppDisplayName(options = {}) {
  const result = resolveAppDisplayName(options);
  try {
    app.setName(result);
    console.log("[AppName] display => " + result);
  } catch (error) {
    console.warn("[AppName] setName 失败:", error?.message || error);
  }
  return result;
}
function stripTrailingVersionSuffixes(arg1) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return "";
  }
  const result2 = result.replace(/(?:_\d+\.\d+\.\d+(?:[-+][\w.]+)?)+$/i, "").trim();
  return result2 || result;
}
function getAppProductName({
  appDir: appDir,
  displayName: displayName
} = {}) {
  const local = String(typeof displayName === "string" ? displayName : "").trim() || String("抖多客" || "").trim();
  if (local) {
    return local;
  }
  const result = (() => {
    try {
      return app.getAppPath();
    } catch (error) {
      return "";
    }
  })();
  const result2 = [appDir || path.join(__dirname, ".."), result].filter(Boolean);
  const list = ["build-variant.manifest.json", "electron-builder.effective.json", "package.json"];
  for (const item of result2) {
    for (const item2 of list) {
      try {
        const result = path.join(item, item2);
        if (!fs.existsSync(result)) {
          continue;
        }
        const result2 = JSON.parse(fs.readFileSync(result, "utf8"));
        const local = result2?.productName || result2?.build?.productName;
        if (local) {
          return String(local).trim();
        }
      } catch (error) {}
    }
  }
  const result3 = (process.env.PORTABLE_EXECUTABLE_FILE || "").trim();
  if (result3) {
    const result = path.basename(result3, path.extname(result3));
    const result2 = stripTrailingVersionSuffixes(result);
    if (result2) {
      return result2;
    }
  }
  try {
    const result = app.getName();
    if (result && result !== "Electron" && !/^huoke-radar/i.test(result)) {
      return result;
    }
  } catch (error) {}
  return "app";
}
module.exports = {
  resolveAppDisplayName: resolveAppDisplayName,
  applyAppDisplayName: applyAppDisplayName,
  stripTrailingVersionSuffixes: stripTrailingVersionSuffixes,
  getAppProductName: getAppProductName
};
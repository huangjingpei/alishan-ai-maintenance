'use strict';

const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const {
  app
} = require("electron");
function createExtensionSync({
  store: store,
  appDir: appDir
}) {
  const text = ".sync-meta.json";
  function fn() {
    return new Promise(arg1 => setImmediate(arg1));
  }
  async function copyRecursive(arg1, arg2, options = {
    files: 0
  }) {
    if (!fs.existsSync(arg1)) {
      return;
    }
    await fsp.mkdir(arg2, {
      recursive: true
    });
    const result = await fsp.readdir(arg1);
    for (const item of result) {
      const result = path.join(arg1, item);
      const result2 = path.join(arg2, item);
      const result3 = await fsp.lstat(result);
      if (result3.isDirectory()) {
        await copyRecursive(result, result2, options);
      } else {
        await fsp.copyFile(result, result2);
        options.files += 1;
        if (options.files % 16 === 0) {
          await fn();
        }
      }
    }
  }
  async function fn3(arg1) {
    const result = path.join(arg1, text);
    try {
      if (!fs.existsSync(result)) {
        return null;
      }
      return JSON.parse(await fsp.readFile(result, "utf8"));
    } catch (error) {
      return null;
    }
  }
  async function fn4(arg1) {
    const result = path.join(arg1, "manifest.json");
    let num = 0;
    let num2 = 0;
    try {
      if (fs.existsSync(result)) {
        const result2 = await fsp.stat(result);
        num = result2.mtimeMs;
        num2 = result2.size;
      } else {
        const result = await fsp.stat(arg1);
        num = result.mtimeMs;
        num2 = result.size;
      }
    } catch (error) {}
    return {
      srcPath: arg1,
      mtimeMs: num,
      size: num2,
      version: String(store.get("local_ext_version") || store.get("latest_ext_version") || "")
    };
  }
  function fn5(arg1, arg2) {
    if (!arg1 || !arg2) {
      return false;
    }
    return arg1.srcPath === arg2.srcPath && Number(arg1.mtimeMs) === Number(arg2.mtimeMs) && Number(arg1.size) === Number(arg2.size) && String(arg1.version || "") === String(arg2.version || "");
  }
  async function syncExtensionToFixedPath() {
    try {
      let result = store.get("latest_ext_path");
      let text2 = "";
      if (result && fs.existsSync(path.join(result, "extension"))) {
        text2 = path.join(result, "extension");
      } else {
        text2 = app.isPackaged ? path.join(process.resourcesPath, "extension") : path.join(appDir, "..", "extension");
      }
      if (!fs.existsSync(text2)) {
        return;
      }
      const result2 = path.join(app.getPath("home"), ".huoke-radar-ext-current");
      const result3 = await fn4(text2);
      if (fs.existsSync(result2)) {
        const result = await fn3(result2);
        if (fn5(result, result3)) {
          console.log("[Main] 插件固定目录已是最新，跳过同步: " + result2);
          return result2;
        }
      }
      console.log("[Main] 正在同步插件到固定目录: " + result2);
      if (fs.existsSync(result2)) {
        await fsp.rm(result2, {
          recursive: true,
          force: true
        });
        await fn();
      }
      await fsp.mkdir(result2, {
        recursive: true
      });
      await copyRecursive(text2, result2);
      await fsp.writeFile(path.join(result2, text), JSON.stringify(result3, null, 2) + "\n", "utf8");
      console.log("[Main] 插件同步完成，手动安装用户重启浏览器即可完成升级");
      return result2;
    } catch (error) {
      console.error("[Main] 同步插件固定目录失败:", error);
    }
  }
  return {
    copyRecursive: copyRecursive,
    syncExtensionToFixedPath: syncExtensionToFixedPath
  };
}
module.exports = {
  createExtensionSync: createExtensionSync
};
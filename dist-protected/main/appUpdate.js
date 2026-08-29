'use strict';

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const axios = require("axios");
const {
  spawn
} = require("child_process");
const {
  Transform
} = require("stream");
const {
  pipeline
} = require("stream/promises");
const AdmZip = require("adm-zip");
const {
  app,
  ipcMain,
  shell
} = require("electron");
const {
  stripTrailingVersionSuffixes
} = require("./appIdentity");
function createAppUpdateService(arg1) {
  const {
    getApiBase: getApiBase,
    getAppVersion: getAppVersion,
    productSlug: productSlug,
    productToken: productToken,
    deviceId: deviceId,
    store: store,
    getMainWindow: getMainWindow,
    quitApplication: quitApplication,
    getAppProductName: getAppProductName,
    syncExtensionToFixedPath: syncExtensionToFixedPath
  } = arg1;
  const local = () => typeof deviceId === "function" ? deviceId() : deviceId;
  let local2 = null;
  function fn(arg1) {
    const value = String(arg1 || "update_installer.bin").split("?")[0].split("#")[0];
    const result = path.basename(value);
    return result.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_") || "update_installer.bin";
  }
  function fn2(arg1) {
    const result = fn(arg1);
    return result.replace(/\s*\(\d+\)(?=\.[^.]+$)/i, "");
  }
  function fn3(arg1, arg2) {
    if (arg2) {
      return String(arg2).trim();
    }
    const result = path.basename(String(arg1 || ""), path.extname(String(arg1 || "")));
    const list = [...result.matchAll(/(\d+\.\d+\.\d+(?:[-+][\w.]+)?)/g)];
    if (list.length) {
      return list[list.length - 1][1];
    }
    return local2?.version || "latest";
  }
  function fn4(arg1) {
    const local = String(arg1 || "app").replace(/[<>:"/\\|?*\x00-\x1f]/g, "_").trim() || "app";
    return stripTrailingVersionSuffixes(local) || "app";
  }
  function fn5(arg1) {
    const result = path.extname(String(arg1 || "")).toLowerCase();
    if ([".exe", ".dmg", ".pkg", ".zip", ".appimage"].includes(result)) {
      return result;
    }
    if (process.platform === "darwin") {
      return ".dmg";
    }
    if (process.platform === "linux") {
      return ".AppImage";
    }
    return ".exe";
  }
  function fn6(arg1, arg2) {
    const result = fn4(getAppProductName());
    const local = String(arg1 || "latest").replace(/[<>:"/\\|?*\x00-\x1f]/g, "_").trim() || "latest";
    return result + "_" + local + fn5(arg2);
  }
  function fn7(arg1) {
    const local = arg1?.code || "";
    const result = String(arg1?.message || arg1 || "未知错误");
    if (local === "ECONNABORTED" || /aborted/i.test(result) || /timeout/i.test(result)) {
      return "下载超时或连接中断，请检查网络后重试";
    }
    if (local === "EBUSY" || local === "EPERM" || local === "EACCES") {
      return "无法写入安装包（文件被占用或无权限），请关闭杀毒软件后重试";
    }
    if (local === "ENOSPC") {
      return "磁盘空间不足，无法保存安装包";
    }
    return result;
  }
  function fn8(arg1, arg2) {
    if (!getMainWindow() || getMainWindow().isDestroyed()) {
      return;
    }
    const value = arg2 ? Math.min(99, Math.round(arg1 / arg2 * 100)) : 0;
    getMainWindow().webContents.send("download-progress", {
      percent: value,
      downloaded: arg1,
      total: arg2
    });
  }
  function fn9(arg1) {
    if (process.platform !== "win32" || !app.isPackaged) {
      return null;
    }
    const result = (process.env.PORTABLE_EXECUTABLE_DIR || "").trim();
    if (!result) {
      return null;
    }
    const result2 = (process.env.PORTABLE_EXECUTABLE_FILE || "").trim();
    const result3 = path.basename(result2 || arg1 || "update_installer.exe");
    const result4 = path.join(result, result3);
    return {
      installDir: result,
      targetFileName: result3,
      launcherPath: result4
    };
  }
  function fn10(arg1, arg2) {
    const result = fn2(arg1);
    const result2 = fn3(arg1, arg2);
    const result3 = fn6(result2, result);
    const result4 = path.join(app.getPath("userData"), "updates");
    fs.mkdirSync(result4, {
      recursive: true
    });
    const local = (arg1, arg2, arg3, arg4 = result3) => ({
      finalPath: path.join(arg1, arg4),
      downloadPath: arg2,
      needsPostExitReplace: arg3,
      installDir: arg1,
      updateVersion: result2,
      versionedFileName: arg4
    });
    if (!app.isPackaged) {
      const result = path.join(result4, result3);
      return local(result4, result, false);
    }
    const result5 = fn9(result);
    if (result5) {
      let value = result5.installDir;
      try {
        fs.mkdirSync(value, {
          recursive: true
        });
        fs.accessSync(value, fs.constants.W_OK);
      } catch (error) {
        console.warn("[Download] 便携版目录不可写 " + value + "，回退到 userData/updates:", error.message);
        value = result4;
      }
      const result = path.join(value, result3);
      console.log("[Download] Win 便携版：下载到 " + result + "（不覆盖原文件，用户使用新文件启动）");
      return {
        finalPath: result,
        downloadPath: result,
        needsPostExitReplace: false,
        isPortable: true,
        installDir: value,
        updateVersion: result2,
        versionedFileName: result3
      };
    }
    if (process.platform === "darwin") {
      let local;
      try {
        local = app.getPath("downloads");
        fs.mkdirSync(local, {
          recursive: true
        });
        fs.accessSync(local, fs.constants.W_OK);
      } catch (error) {
        console.warn("[Download] macOS ~/Downloads 不可写，回退到 userData/updates:", error.message);
        local = result4;
      }
      console.log("[Download] macOS：将新版本保存到 " + local + "/" + result3);
      const result = path.join(local, result3);
      return {
        finalPath: result,
        downloadPath: result,
        needsPostExitReplace: false,
        installDir: local,
        updateVersion: result2,
        versionedFileName: result3
      };
    }
    let local2;
    if (process.platform === "win32") {
      local2 = process.env.PORTABLE_EXECUTABLE_DIR || path.dirname(process.execPath);
    } else {
      local2 = result4;
    }
    try {
      fs.mkdirSync(local2, {
        recursive: true
      });
      fs.accessSync(local2, fs.constants.W_OK);
    } catch (error) {
      console.warn("[Download] 无法写入 " + local2 + "，回退 userData/updates:", error.message);
      local2 = result4;
    }
    const result6 = path.join(local2, result3);
    return local(local2, result6, false);
  }
  function fn11(arg1, arg2, flag = true) {
    const value = process.pid;
    const result = path.join(app.getPath("temp"), "huoke-update-replace-" + Date.now() + (process.platform === "win32" ? ".ps1" : ".sh"));
    if (process.platform === "win32") {
      const local = arg1 => "'" + String(arg1).replace(/'/g, "''") + "'";
      const result2 = ["$ErrorActionPreference = \"SilentlyContinue\"", "$targetPid = " + value, "$temp = " + local(arg1), "$final = " + local(arg2), "$backup = \"$final.old\"", "$elapsed = 0", "$maxWait = 180", "while ((Get-Process -Id $targetPid) -and ($elapsed -lt $maxWait)) {", "    Start-Sleep -Seconds 1", "    $elapsed++", "}", "Start-Sleep -Seconds 2", "$moved = $false", "for ($i = 0; $i -lt 8; $i++) {", "    if (-not (Test-Path -LiteralPath $temp)) { Start-Sleep -Seconds 1; continue }", "    try {", "        if (Test-Path -LiteralPath $backup) { Remove-Item -LiteralPath $backup -Force -ErrorAction SilentlyContinue }", "        if (Test-Path -LiteralPath $final) { Move-Item -LiteralPath $final -Destination $backup -Force -ErrorAction Stop }", "        Move-Item -LiteralPath $temp -Destination $final -Force -ErrorAction Stop", "        $moved = $true", "        break", "    } catch {", "        if ((-not (Test-Path -LiteralPath $final)) -and (Test-Path -LiteralPath $backup)) {", "            Move-Item -LiteralPath $backup -Destination $final -Force -ErrorAction SilentlyContinue", "        }", "        Start-Sleep -Seconds 1", "    }", "}", flag ? "if ($moved) { Start-Process -FilePath $final }" : "", "if ($moved) {", "    Start-Sleep -Seconds 3", "    if (Test-Path -LiteralPath $backup) { Remove-Item -LiteralPath $backup -Force -ErrorAction SilentlyContinue }", "}", "Remove-Item -LiteralPath $PSCommandPath -Force"].filter(Boolean).join("\r\n");
      fs.writeFileSync(result, result2, "utf8");
      const result3 = spawn("powershell.exe", ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-WindowStyle", "Hidden", "-File", result], {
        detached: true,
        stdio: "ignore",
        windowsHide: true
      });
      result3.unref();
      return;
    }
    if (process.platform === "darwin") {
      const local = arg1 => String(arg1).replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
      const value2 = flag ? "open \"" + local(arg2) + "\"\n" : "";
      const result2 = ["#!/bin/bash", "while kill -0 " + value + " 2>/dev/null; do sleep 1; done", "backup=\"" + local(arg2) + ".old\"", "rm -f \"$backup\"", "if [ -e \"" + local(arg2) + "\" ]; then mv -f \"" + local(arg2) + "\" \"$backup\"; fi", "if mv -f \"" + local(arg1) + "\" \"" + local(arg2) + "\"; then", value2, "  rm -f \"$backup\"", "else", "  if [ ! -e \"" + local(arg2) + "\" ] && [ -e \"$backup\" ]; then mv -f \"$backup\" \"" + local(arg2) + "\"; fi", "fi", "rm -f \"$0\""].join("\n");
      fs.writeFileSync(result, result2, {
        mode: 493
      });
      const result3 = spawn("/bin/bash", [result], {
        detached: true,
        stdio: "ignore"
      });
      result3.unref();
    }
  }
  function pushUpdateToRenderer(arg1) {
    if (!arg1?.hasUpdate || !getMainWindow() || getMainWindow().isDestroyed()) {
      return;
    }
    getMainWindow().webContents.send("update-available", arg1);
  }
  function scheduleCheckUpdate(num = 800) {
    const local = async () => {
      const result = await checkUpdate();
      if (result?.hasUpdate) {
        pushUpdateToRenderer(result);
      }
    };
    if (!getMainWindow() || getMainWindow().isDestroyed()) {
      setTimeout(local, num);
      return;
    }
    const local2 = () => setTimeout(local, num);
    if (getMainWindow().webContents.isLoading()) {
      getMainWindow().webContents.once("did-finish-load", local2);
    } else {
      local2();
    }
  }
  async function checkUpdate() {
    try {
      const result = getAppVersion();
      const result2 = Math.floor(Date.now() / 1000).toString();
      const value = process.platform;
      const value2 = process.arch;
      const result3 = process.getSystemVersion();
      const value3 = productSlug + result + result2;
      const result4 = crypto.createHmac("sha256", productToken).update(value3).digest("hex");
      console.log("[Update] 正在自检更新... 当前版本: " + result);
      const obj = {
        slug: productSlug,
        version: result,
        platform: value,
        arch: value2,
        os_version: result3,
        device_id: local(),
        ts: result2,
        sign: result4
      };
      const result5 = await axios.get(getApiBase() + "/product/check-update", {
        params: obj,
        timeout: 5000
      });
      if (!result5.data) {
        return {
          hasUpdate: false
        };
      }
      const local3 = (arg1, arg2) => {
        if (!arg1 || !arg2) {
          return false;
        }
        const result = String(arg1).trim().split(".").map(Number);
        const result2 = String(arg2).trim().split(".").map(Number);
        for (let num = 0; num < Math.max(result.length, result2.length); num++) {
          const local = result[num] || 0;
          const local2 = result2[num] || 0;
          if (local > local2) {
            return true;
          }
          if (local < local2) {
            return false;
          }
        }
        return false;
      };
      const value4 = result5.data.version;
      const result6 = local3(value4, result);
      const value5 = result5.data.extVersion;
      let value6 = result5.data.extUrl;
      const result7 = store.get("local_ext_version", "0.0.0");
      if (value5 && value6 && value5 !== result7) {
        console.log("[Update] 检测到热更新资源包: 云端 v" + value5 + ", 本地 " + result7);
        if (!value6.startsWith("http")) {
          try {
            const url = new URL(getApiBase());
            const value = url.protocol + "//" + url.host;
            value6 = value + (value6.startsWith("/") ? "" : "/") + value6;
          } catch (error) {
            const value = getApiBase().split("/api")[0];
            value6 = value + (value6.startsWith("/") ? "" : "/") + value6;
          }
        }
        fn15(value6, value5);
      }
      if (result5.data.code === 200 && result6) {
        let value = result5.data.downloadUrl;
        if (value && !value.startsWith("http")) {
          try {
            const url = new URL(getApiBase());
            const value2 = url.protocol + "//" + url.host;
            value = value2 + (value.startsWith("/") ? "" : "/") + value;
          } catch (error) {
            const value2 = getApiBase().split("/api")[0];
            value = value2 + (value.startsWith("/") ? "" : "/") + value;
          }
        }
        const obj = {
          hasUpdate: true,
          version: result5.data.version,
          title: result5.data.updateTitle,
          content: result5.data.updateContent,
          isForce: result5.data.isForceUpdate,
          url: value
        };
        local2 = obj;
        return obj;
      }
      local2 = null;
      return {
        hasUpdate: false
      };
    } catch (error) {
      console.error("[Update] 检查更新失败:", error.message);
      return {
        hasUpdate: false,
        error: error.message
      };
    }
  }
  ipcMain.handle("check-update", async () => {
    return await checkUpdate();
  });
  ipcMain.handle("get-pending-update", () => {
    return local2;
  });
  ipcMain.handle("reveal-update-installer", () => {
    const result = store.get("last_update_download_path");
    if (!result || !fs.existsSync(result)) {
      return {
        success: false,
        msg: "未找到已下载的安装包"
      };
    }
    shell.showItemInFolder(result);
    return {
      success: true,
      path: result
    };
  });
  ipcMain.handle("get-last-update-download-path", () => {
    const result = store.get("last_update_download_path");
    if (result && fs.existsSync(result)) {
      return result;
    } else {
      return null;
    }
  });
  ipcMain.handle("run-installer", async () => {
    const result = store.get("last_update_download_path");
    if (!result || !fs.existsSync(result)) {
      return {
        success: false,
        msg: "未找到已下载的安装包"
      };
    }
    try {
      await shell.openPath(result);
      setTimeout(() => {
        quitApplication();
      }, 1500);
      return {
        success: true
      };
    } catch (error) {
      console.error("[Install] 启动安装程序失败:", error.message);
      return {
        success: false,
        msg: error.message
      };
    }
  });
  ipcMain.on("start-download", async (arg1, {
    url: url,
    fileName: fileName
  }) => {
    console.log("[Download] 开始下载: " + url);
    const result = fn10(fileName, local2?.version);
    let value = result.downloadPath;
    console.log("[Download] 保存路径: " + value + "，目标文件: " + result.finalPath);
    const local = (arg1, arg2) => {
      store.set("last_update_download_path", arg1);
      store.set("pending_update_final_path", result.finalPath);
      store.set("pending_update_version", result.updateVersion);
      if (arg2) {
        store.set("pending_update_temp_path", arg1);
        store.set("pending_update_needs_replace", true);
      } else {
        store.delete("pending_update_temp_path");
        store.set("pending_update_needs_replace", false);
      }
      const obj = {
        savePath: arg1,
        finalPath: result.finalPath,
        updateVersion: result.updateVersion,
        versionedFileName: result.versionedFileName,
        needsPostExitReplace: arg2,
        isPortable: result.isPortable || false,
        installDir: result.installDir,
        platform: process.platform
      };
      if (getMainWindow() && !getMainWindow().isDestroyed()) {
        getMainWindow().webContents.send("download-success", obj);
      }
      try {
        shell.showItemInFolder(arg1);
      } catch (error) {
        console.warn("[Download] 打开所在文件夹失败:", error.message);
      }
    };
    const local3 = async (arg1, arg2) => {
      const result = await axios({
        method: "get",
        url: url,
        responseType: "stream",
        timeout: 0,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        validateStatus: arg1 => arg1 >= 200 && arg1 < 300
      });
      const local = parseInt(result.headers["content-length"], 10) || 0;
      let num = 0;
      const result2 = fs.createWriteStream(arg1);
      const transform = new Transform({
        transform(arg1, arg2, arg3) {
          num += arg1.length;
          fn8(num, local);
          arg3(null, arg1);
        }
      });
      try {
        await pipeline(result.data, transform, result2);
        fn8(local || num, local || num);
        if (getMainWindow() && !getMainWindow().isDestroyed()) {
          getMainWindow().webContents.send("download-progress", {
            percent: 100,
            downloaded: num,
            total: local || num
          });
        }
        if (typeof arg2 === "function") {
          await arg2();
        }
        return {
          targetPath: arg1
        };
      } catch (error) {
        try {
          result2.destroy();
        } catch (error) {}
        try {
          if (fs.existsSync(arg1)) {
            fs.unlinkSync(arg1);
          }
        } catch (error) {}
        throw error;
      }
    };
    try {
      await local3(value, () => {
        console.log("[Download] 下载完成: " + value);
        local(value, result.needsPostExitReplace);
      });
    } catch (error) {
      const local2 = error.code === "EBUSY" || error.code === "EPERM" || error.code === "EACCES";
      if (local2 && !result.needsPostExitReplace && value === result.downloadPath) {
        const value2 = result.installDir !== path.join(app.getPath("userData"), "updates") ? result.installDir : path.join(app.getPath("userData"), "updates");
        const result2 = path.join(value2, ".pending-" + result.versionedFileName);
        console.warn("[Download] 直接写入失败 (" + error.message + ")，改存 " + result2 + " 并在退出后重命名");
        try {
          if (fs.existsSync(value)) {
            fs.unlinkSync(value);
          }
        } catch (error) {}
        value = result2;
        try {
          await local3(value, () => {
            console.log("[Download] 临时下载完成: " + value);
            local(value, true);
          });
          return;
        } catch (error) {
          const result = fn7(error);
          console.error("[Download] 临时下载失败: " + result, error);
          if (getMainWindow() && !getMainWindow().isDestroyed()) {
            getMainWindow().webContents.send("download-error", result);
          }
          return;
        }
      }
      const result2 = fn7(error);
      console.error("[Download] 请求失败: " + result2, error);
      if (getMainWindow() && !getMainWindow().isDestroyed()) {
        getMainWindow().webContents.send("download-error", result2);
      }
    }
  });
  function launchPendingUpdateReplacementIfReady() {
    const result = store.get("pending_update_temp_path");
    const result2 = store.get("pending_update_needs_replace");
    const local = store.get("pending_update_version") || local2?.version;
    const result3 = store.get("pending_update_final_path");
    if (!result2 || !result || !fs.existsSync(result)) {
      return false;
    }
    try {
      const value = result3 ? path.dirname(result3) : path.dirname(result);
      const local2 = local || fn3(path.basename(result).replace(/^\.pending-/, ""));
      const local3 = result3 || path.join(value, fn6(local2));
      fn11(result, local3, true);
      store.delete("pending_update_temp_path");
      store.delete("pending_update_final_path");
      store.delete("pending_update_version");
      store.delete("pending_update_needs_replace");
      return true;
    } catch (error) {
      console.error("[Update] 启动退出后替换脚本失败:", error.message || error);
      return false;
    }
  }
  ipcMain.on("apply-update-and-exit", () => {
    quitApplication();
  });
  async function fn15(arg1, arg2) {
    console.log("[HotUpdate] 开始处理热更新... 目标版本: " + arg2 + ", URL: " + arg1);
    const result = path.join(app.getPath("userData"), "plugins");
    const result2 = path.join(result, "extension_v" + arg2);
    const result3 = path.join(result, "ext_" + arg2 + ".zip");
    if (!fs.existsSync(result)) {
      console.log("[HotUpdate] 创建插件目录: " + result);
      fs.mkdirSync(result, {
        recursive: true
      });
    }
    try {
      console.log("[HotUpdate] 正在从云端下载资源包...");
      const result = await axios({
        method: "get",
        url: arg1,
        responseType: "stream"
      });
      const result4 = fs.createWriteStream(result3);
      result.data.pipe(result4);
      await new Promise((arg1, arg2) => {
        result4.on("finish", () => {
          console.log("[HotUpdate] 下载完成，存放在: " + result3);
          arg1();
        });
        result4.on("error", arg1 => {
          console.error("[HotUpdate] 写入文件失败:", arg1);
          arg2(arg1);
        });
      });
      console.log("[HotUpdate] 正在解压资源到: " + result2);
      const admZip = new AdmZip(result3);
      admZip.extractAllTo(result2, true);
      store.set("latest_ext_path", result2);
      store.set("local_ext_version", arg2);
      console.log("[HotUpdate] 热更新完成！插件已成功升级至 v" + arg2);
      Promise.resolve().then(() => syncExtensionToFixedPath()).catch(arg1 => console.warn("[HotUpdate] extensionSync failed:", arg1?.message || arg1));
      if (getMainWindow()) {
        getMainWindow().webContents.send("new-status", "系统资源已自动升级至 v" + arg2 + "，下次启动生效");
      }
      if (fs.existsSync(result3)) {
        fs.unlinkSync(result3);
      }
    } catch (error) {
      console.error("[HotUpdate] 严重错误: 热更新失败!", error.message);
    }
  }
  return {
    scheduleCheckUpdate: scheduleCheckUpdate,
    launchPendingUpdateReplacementIfReady: launchPendingUpdateReplacementIfReady,
    checkUpdate: checkUpdate,
    pushUpdateToRenderer: pushUpdateToRenderer
  };
}
module.exports = {
  createAppUpdateService: createAppUpdateService
};
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
function createAppUpdateService(_0x39de99) {
  const {
    getApiBase: _0x236c5f,
    getAppVersion: _0x1f0ec5,
    productSlug: _0x4522a6,
    productToken: _0x7ebf5d,
    deviceId: _0x354bcd,
    store: _0x5f5728,
    getMainWindow: _0x1c25f3,
    quitApplication: _0x25785,
    getAppProductName: _0x1a295d,
    syncExtensionToFixedPath: _0xfe67e
  } = _0x39de99;
  const _0x597a12 = () => typeof _0x354bcd === "function" ? _0x354bcd() : _0x354bcd;
  let _0x2047ef = null;
  function _0x203363(_0x385c3c) {
    const _0x5837e6 = String(_0x385c3c || "update_installer.bin").split("?")[0].split("#")[0];
    const _0x2832bb = path.basename(_0x5837e6);
    return _0x2832bb.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_") || "update_installer.bin";
  }
  function _0x1b27f8(_0x5f2ff2) {
    const _0x3430ad = _0x203363(_0x5f2ff2);
    return _0x3430ad.replace(/\s*\(\d+\)(?=\.[^.]+$)/i, "");
  }
  function _0x3834a5(_0x1740ff, _0x610609) {
    if (_0x610609) {
      return String(_0x610609).trim();
    }
    const _0x69b45c = path.basename(String(_0x1740ff || ""), path.extname(String(_0x1740ff || "")));
    const _0x413d88 = [..._0x69b45c.matchAll(/(\d+\.\d+\.\d+(?:[-+][\w.]+)?)/g)];
    if (_0x413d88.length) {
      return _0x413d88[_0x413d88.length - 1][1];
    }
    return _0x2047ef?.version || "latest";
  }
  function _0x164a81(_0x12c223) {
    const _0x3bb891 = String(_0x12c223 || "app").replace(/[<>:"/\\|?*\x00-\x1f]/g, "_").trim() || "app";
    return stripTrailingVersionSuffixes(_0x3bb891) || "app";
  }
  function _0x597757(_0x57a2d8) {
    const _0x20abd0 = path.extname(String(_0x57a2d8 || "")).toLowerCase();
    if ([".exe", ".dmg", ".pkg", ".zip", ".appimage"].includes(_0x20abd0)) {
      return _0x20abd0;
    }
    if (process.platform === "darwin") {
      return ".dmg";
    }
    if (process.platform === "linux") {
      return ".AppImage";
    }
    return ".exe";
  }
  function _0x5980b0(_0x152e46, _0x4bfa31) {
    const _0x35ffe5 = _0x164a81(_0x1a295d());
    const _0x3106d3 = String(_0x152e46 || "latest").replace(/[<>:"/\\|?*\x00-\x1f]/g, "_").trim() || "latest";
    return _0x35ffe5 + "_" + _0x3106d3 + _0x597757(_0x4bfa31);
  }
  function _0x1b2567(_0x4ed6f1) {
    const _0x21e4ec = _0x4ed6f1?.code || "";
    const _0x1e352c = String(_0x4ed6f1?.message || _0x4ed6f1 || "未知错误");
    if (_0x21e4ec === "ECONNABORTED" || /aborted/i.test(_0x1e352c) || /timeout/i.test(_0x1e352c)) {
      return "下载超时或连接中断，请检查网络后重试";
    }
    if (_0x21e4ec === "EBUSY" || _0x21e4ec === "EPERM" || _0x21e4ec === "EACCES") {
      return "无法写入安装包（文件被占用或无权限），请关闭杀毒软件后重试";
    }
    if (_0x21e4ec === "ENOSPC") {
      return "磁盘空间不足，无法保存安装包";
    }
    return _0x1e352c;
  }
  function _0x524ffc(_0x2ec32d, _0x4436ad) {
    if (!_0x1c25f3() || _0x1c25f3().isDestroyed()) {
      return;
    }
    const _0xc0484e = _0x4436ad ? Math.min(99, Math.round(_0x2ec32d / _0x4436ad * 100)) : 0;
    _0x1c25f3().webContents.send("download-progress", {
      percent: _0xc0484e,
      downloaded: _0x2ec32d,
      total: _0x4436ad
    });
  }
  function _0x59832f(_0x34be2a) {
    if (process.platform !== "win32" || !app.isPackaged) {
      return null;
    }
    const _0x464320 = (process.env.PORTABLE_EXECUTABLE_DIR || "").trim();
    if (!_0x464320) {
      return null;
    }
    const _0x34bd4b = (process.env.PORTABLE_EXECUTABLE_FILE || "").trim();
    const _0x42bf7e = path.basename(_0x34bd4b || _0x34be2a || "update_installer.exe");
    const _0x40dfd7 = path.join(_0x464320, _0x42bf7e);
    return {
      installDir: _0x464320,
      targetFileName: _0x42bf7e,
      launcherPath: _0x40dfd7
    };
  }
  function _0x2f5df9(_0x53fb9b, _0x330382) {
    const _0x2e6a5c = _0x1b27f8(_0x53fb9b);
    const _0x360f78 = _0x3834a5(_0x53fb9b, _0x330382);
    const _0x30b420 = _0x5980b0(_0x360f78, _0x2e6a5c);
    const _0x7c46df = path.join(app.getPath("userData"), "updates");
    fs.mkdirSync(_0x7c46df, {
      recursive: true
    });
    const _0x24d8c4 = (_0x5e4611, _0x1bd0a6, _0x25541e, _0x14655e = _0x30b420) => ({
      finalPath: path.join(_0x5e4611, _0x14655e),
      downloadPath: _0x1bd0a6,
      needsPostExitReplace: _0x25541e,
      installDir: _0x5e4611,
      updateVersion: _0x360f78,
      versionedFileName: _0x14655e
    });
    if (!app.isPackaged) {
      const _0x283404 = path.join(_0x7c46df, _0x30b420);
      return _0x24d8c4(_0x7c46df, _0x283404, false);
    }
    const _0x2ede8a = _0x59832f(_0x2e6a5c);
    if (_0x2ede8a) {
      let _0x5ab451 = _0x2ede8a.installDir;
      try {
        fs.mkdirSync(_0x5ab451, {
          recursive: true
        });
        fs.accessSync(_0x5ab451, fs.constants.W_OK);
      } catch (_0x4b002b) {
        console.warn("[Download] 便携版目录不可写 " + _0x5ab451 + "，回退到 userData/updates:", _0x4b002b.message);
        _0x5ab451 = _0x7c46df;
      }
      const _0x3805db = path.join(_0x5ab451, _0x30b420);
      console.log("[Download] Win 便携版：下载到 " + _0x3805db + "（不覆盖原文件，用户使用新文件启动）");
      return {
        finalPath: _0x3805db,
        downloadPath: _0x3805db,
        needsPostExitReplace: false,
        isPortable: true,
        installDir: _0x5ab451,
        updateVersion: _0x360f78,
        versionedFileName: _0x30b420
      };
    }
    if (process.platform === "darwin") {
      let _0x284190;
      try {
        _0x284190 = app.getPath("downloads");
        fs.mkdirSync(_0x284190, {
          recursive: true
        });
        fs.accessSync(_0x284190, fs.constants.W_OK);
      } catch (_0x5ab178) {
        console.warn("[Download] macOS ~/Downloads 不可写，回退到 userData/updates:", _0x5ab178.message);
        _0x284190 = _0x7c46df;
      }
      console.log("[Download] macOS：将新版本保存到 " + _0x284190 + "/" + _0x30b420);
      const _0x344c32 = path.join(_0x284190, _0x30b420);
      return {
        finalPath: _0x344c32,
        downloadPath: _0x344c32,
        needsPostExitReplace: false,
        installDir: _0x284190,
        updateVersion: _0x360f78,
        versionedFileName: _0x30b420
      };
    }
    let _0x5b84d3;
    if (process.platform === "win32") {
      _0x5b84d3 = process.env.PORTABLE_EXECUTABLE_DIR || path.dirname(process.execPath);
    } else {
      _0x5b84d3 = _0x7c46df;
    }
    try {
      fs.mkdirSync(_0x5b84d3, {
        recursive: true
      });
      fs.accessSync(_0x5b84d3, fs.constants.W_OK);
    } catch (_0x1d9dcd) {
      console.warn("[Download] 无法写入 " + _0x5b84d3 + "，回退 userData/updates:", _0x1d9dcd.message);
      _0x5b84d3 = _0x7c46df;
    }
    const _0x2ed6ac = path.join(_0x5b84d3, _0x30b420);
    return _0x24d8c4(_0x5b84d3, _0x2ed6ac, false);
  }
  function _0x1952bd(_0x1444e2, _0x53c297, _0x5eeba6 = true) {
    const _0x1615f2 = process.pid;
    const _0x1306c4 = path.join(app.getPath("temp"), "huoke-update-replace-" + Date.now() + (process.platform === "win32" ? ".ps1" : ".sh"));
    if (process.platform === "win32") {
      const _0x53be98 = _0x44de9a => "'" + String(_0x44de9a).replace(/'/g, "''") + "'";
      const _0x48a066 = ["$ErrorActionPreference = \"SilentlyContinue\"", "$targetPid = " + _0x1615f2, "$temp = " + _0x53be98(_0x1444e2), "$final = " + _0x53be98(_0x53c297), "$backup = \"$final.old\"", "$elapsed = 0", "$maxWait = 180", "while ((Get-Process -Id $targetPid) -and ($elapsed -lt $maxWait)) {", "    Start-Sleep -Seconds 1", "    $elapsed++", "}", "Start-Sleep -Seconds 2", "$moved = $false", "for ($i = 0; $i -lt 8; $i++) {", "    if (-not (Test-Path -LiteralPath $temp)) { Start-Sleep -Seconds 1; continue }", "    try {", "        if (Test-Path -LiteralPath $backup) { Remove-Item -LiteralPath $backup -Force -ErrorAction SilentlyContinue }", "        if (Test-Path -LiteralPath $final) { Move-Item -LiteralPath $final -Destination $backup -Force -ErrorAction Stop }", "        Move-Item -LiteralPath $temp -Destination $final -Force -ErrorAction Stop", "        $moved = $true", "        break", "    } catch {", "        if ((-not (Test-Path -LiteralPath $final)) -and (Test-Path -LiteralPath $backup)) {", "            Move-Item -LiteralPath $backup -Destination $final -Force -ErrorAction SilentlyContinue", "        }", "        Start-Sleep -Seconds 1", "    }", "}", _0x5eeba6 ? "if ($moved) { Start-Process -FilePath $final }" : "", "if ($moved) {", "    Start-Sleep -Seconds 3", "    if (Test-Path -LiteralPath $backup) { Remove-Item -LiteralPath $backup -Force -ErrorAction SilentlyContinue }", "}", "Remove-Item -LiteralPath $PSCommandPath -Force"].filter(Boolean).join("\r\n");
      fs.writeFileSync(_0x1306c4, _0x48a066, "utf8");
      const _0x24f584 = spawn("powershell.exe", ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-WindowStyle", "Hidden", "-File", _0x1306c4], {
        detached: true,
        stdio: "ignore",
        windowsHide: true
      });
      _0x24f584.unref();
      return;
    }
    if (process.platform === "darwin") {
      const _0x48b554 = _0x1cb039 => String(_0x1cb039).replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
      const _0x2c3982 = _0x5eeba6 ? "open \"" + _0x48b554(_0x53c297) + "\"\n" : "";
      const _0x25c4f2 = ["#!/bin/bash", "while kill -0 " + _0x1615f2 + " 2>/dev/null; do sleep 1; done", "backup=\"" + _0x48b554(_0x53c297) + ".old\"", "rm -f \"$backup\"", "if [ -e \"" + _0x48b554(_0x53c297) + "\" ]; then mv -f \"" + _0x48b554(_0x53c297) + "\" \"$backup\"; fi", "if mv -f \"" + _0x48b554(_0x1444e2) + "\" \"" + _0x48b554(_0x53c297) + "\"; then", _0x2c3982, "  rm -f \"$backup\"", "else", "  if [ ! -e \"" + _0x48b554(_0x53c297) + "\" ] && [ -e \"$backup\" ]; then mv -f \"$backup\" \"" + _0x48b554(_0x53c297) + "\"; fi", "fi", "rm -f \"$0\""].join("\n");
      fs.writeFileSync(_0x1306c4, _0x25c4f2, {
        mode: 493
      });
      const _0x1759a6 = spawn("/bin/bash", [_0x1306c4], {
        detached: true,
        stdio: "ignore"
      });
      _0x1759a6.unref();
    }
  }
  function _0x4551eb(_0x11bce7) {
    if (!_0x11bce7?.hasUpdate || !_0x1c25f3() || _0x1c25f3().isDestroyed()) {
      return;
    }
    _0x1c25f3().webContents.send("update-available", _0x11bce7);
  }
  function _0x35014d(_0x234875 = 800) {
    const _0x278a26 = async () => {
      const _0x4c2a84 = await _0x3af791();
      if (_0x4c2a84?.hasUpdate) {
        _0x4551eb(_0x4c2a84);
      }
    };
    if (!_0x1c25f3() || _0x1c25f3().isDestroyed()) {
      setTimeout(_0x278a26, _0x234875);
      return;
    }
    const _0x41a865 = () => setTimeout(_0x278a26, _0x234875);
    if (_0x1c25f3().webContents.isLoading()) {
      _0x1c25f3().webContents.once("did-finish-load", _0x41a865);
    } else {
      _0x41a865();
    }
  }
  async function _0x3af791() {
    try {
      const _0x209b8f = _0x1f0ec5();
      const _0x44ac86 = Math.floor(Date.now() / 1000).toString();
      const _0x3bba3e = process.platform;
      const _0x57b31e = process.arch;
      const _0x32a68d = process.getSystemVersion();
      const _0x4b7dd4 = _0x4522a6 + _0x209b8f + _0x44ac86;
      const _0x52dd8d = crypto.createHmac("sha256", _0x7ebf5d).update(_0x4b7dd4).digest("hex");
      console.log("[Update] 正在自检更新... 当前版本: " + _0x209b8f);
      const _0x3266bc = {
        slug: _0x4522a6,
        version: _0x209b8f,
        platform: _0x3bba3e,
        arch: _0x57b31e,
        os_version: _0x32a68d,
        device_id: _0x597a12(),
        ts: _0x44ac86,
        sign: _0x52dd8d
      };
      const _0x186b0c = await axios.get(_0x236c5f() + "/product/check-update", {
        params: _0x3266bc,
        timeout: 5000
      });
      if (!_0x186b0c.data) {
        return {
          hasUpdate: false
        };
      }
      const _0x3bf129 = (_0x3fda00, _0xb8b79a) => {
        if (!_0x3fda00 || !_0xb8b79a) {
          return false;
        }
        const _0x1f9ed3 = String(_0x3fda00).trim().split(".").map(Number);
        const _0x3deae8 = String(_0xb8b79a).trim().split(".").map(Number);
        for (let _0x484249 = 0; _0x484249 < Math.max(_0x1f9ed3.length, _0x3deae8.length); _0x484249++) {
          const _0x2f8fd8 = _0x1f9ed3[_0x484249] || 0;
          const _0x468b2b = _0x3deae8[_0x484249] || 0;
          if (_0x2f8fd8 > _0x468b2b) {
            return true;
          }
          if (_0x2f8fd8 < _0x468b2b) {
            return false;
          }
        }
        return false;
      };
      const _0x394465 = _0x186b0c.data.version;
      const _0x106787 = _0x3bf129(_0x394465, _0x209b8f);
      const _0x40b50d = _0x186b0c.data.extVersion;
      let _0x1e2de7 = _0x186b0c.data.extUrl;
      const _0x4c8f0e = _0x5f5728.get("local_ext_version", "0.0.0");
      if (_0x40b50d && _0x1e2de7 && _0x40b50d !== _0x4c8f0e) {
        console.log("[Update] 检测到热更新资源包: 云端 v" + _0x40b50d + ", 本地 " + _0x4c8f0e);
        if (!_0x1e2de7.startsWith("http")) {
          try {
            const _0x202b05 = new URL(_0x236c5f());
            const _0x3c488b = _0x202b05.protocol + "//" + _0x202b05.host;
            _0x1e2de7 = _0x3c488b + (_0x1e2de7.startsWith("/") ? "" : "/") + _0x1e2de7;
          } catch (_0x5d63b9) {
            const _0x193b9d = _0x236c5f().split("/api")[0];
            _0x1e2de7 = _0x193b9d + (_0x1e2de7.startsWith("/") ? "" : "/") + _0x1e2de7;
          }
        }
        _0x58b8a8(_0x1e2de7, _0x40b50d);
      }
      if (_0x186b0c.data.code === 200 && _0x106787) {
        let _0x288312 = _0x186b0c.data.downloadUrl;
        if (_0x288312 && !_0x288312.startsWith("http")) {
          try {
            const _0x48017d = new URL(_0x236c5f());
            const _0x771360 = _0x48017d.protocol + "//" + _0x48017d.host;
            _0x288312 = _0x771360 + (_0x288312.startsWith("/") ? "" : "/") + _0x288312;
          } catch (_0x30bde3) {
            const _0x503f96 = _0x236c5f().split("/api")[0];
            _0x288312 = _0x503f96 + (_0x288312.startsWith("/") ? "" : "/") + _0x288312;
          }
        }
        const _0x5869d1 = {
          hasUpdate: true,
          version: _0x186b0c.data.version,
          title: _0x186b0c.data.updateTitle,
          content: _0x186b0c.data.updateContent,
          isForce: _0x186b0c.data.isForceUpdate,
          url: _0x288312
        };
        _0x2047ef = _0x5869d1;
        return _0x5869d1;
      }
      _0x2047ef = null;
      return {
        hasUpdate: false
      };
    } catch (_0x3d79cc) {
      console.error("[Update] 检查更新失败:", _0x3d79cc.message);
      return {
        hasUpdate: false,
        error: _0x3d79cc.message
      };
    }
  }
  ipcMain.handle("check-update", async () => {
    return await _0x3af791();
  });
  ipcMain.handle("get-pending-update", () => {
    return _0x2047ef;
  });
  ipcMain.handle("reveal-update-installer", () => {
    const _0x82081d = _0x5f5728.get("last_update_download_path");
    if (!_0x82081d || !fs.existsSync(_0x82081d)) {
      return {
        success: false,
        msg: "未找到已下载的安装包"
      };
    }
    shell.showItemInFolder(_0x82081d);
    return {
      success: true,
      path: _0x82081d
    };
  });
  ipcMain.handle("get-last-update-download-path", () => {
    const _0x3e6b13 = _0x5f5728.get("last_update_download_path");
    if (_0x3e6b13 && fs.existsSync(_0x3e6b13)) {
      return _0x3e6b13;
    } else {
      return null;
    }
  });
  ipcMain.handle("run-installer", async () => {
    const _0x115b71 = _0x5f5728.get("last_update_download_path");
    if (!_0x115b71 || !fs.existsSync(_0x115b71)) {
      return {
        success: false,
        msg: "未找到已下载的安装包"
      };
    }
    try {
      await shell.openPath(_0x115b71);
      setTimeout(() => {
        _0x25785();
      }, 1500);
      return {
        success: true
      };
    } catch (_0x25786f) {
      console.error("[Install] 启动安装程序失败:", _0x25786f.message);
      return {
        success: false,
        msg: _0x25786f.message
      };
    }
  });
  ipcMain.on("start-download", async (_0x551cb9, {
    url: _0x326b63,
    fileName: _0x16b275
  }) => {
    console.log("[Download] 开始下载: " + _0x326b63);
    const _0x4dde04 = _0x2f5df9(_0x16b275, _0x2047ef?.version);
    let _0x5578b4 = _0x4dde04.downloadPath;
    console.log("[Download] 保存路径: " + _0x5578b4 + "，目标文件: " + _0x4dde04.finalPath);
    const _0x417551 = (_0x8728a9, _0x38ed28) => {
      _0x5f5728.set("last_update_download_path", _0x8728a9);
      _0x5f5728.set("pending_update_final_path", _0x4dde04.finalPath);
      _0x5f5728.set("pending_update_version", _0x4dde04.updateVersion);
      if (_0x38ed28) {
        _0x5f5728.set("pending_update_temp_path", _0x8728a9);
        _0x5f5728.set("pending_update_needs_replace", true);
      } else {
        _0x5f5728.delete("pending_update_temp_path");
        _0x5f5728.set("pending_update_needs_replace", false);
      }
      const _0x11fcbe = {
        savePath: _0x8728a9,
        finalPath: _0x4dde04.finalPath,
        updateVersion: _0x4dde04.updateVersion,
        versionedFileName: _0x4dde04.versionedFileName,
        needsPostExitReplace: _0x38ed28,
        isPortable: _0x4dde04.isPortable || false,
        installDir: _0x4dde04.installDir,
        platform: process.platform
      };
      if (_0x1c25f3() && !_0x1c25f3().isDestroyed()) {
        _0x1c25f3().webContents.send("download-success", _0x11fcbe);
      }
      try {
        shell.showItemInFolder(_0x8728a9);
      } catch (_0x13993c) {
        console.warn("[Download] 打开所在文件夹失败:", _0x13993c.message);
      }
    };
    const _0x4270d3 = async (_0x2ea317, _0x5c57c6) => {
      const _0x1c1550 = await axios({
        method: "get",
        url: _0x326b63,
        responseType: "stream",
        timeout: 0,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        validateStatus: _0x26fda8 => _0x26fda8 >= 200 && _0x26fda8 < 300
      });
      const _0x141cea = parseInt(_0x1c1550.headers["content-length"], 10) || 0;
      let _0x12351c = 0;
      const _0x26b12a = fs.createWriteStream(_0x2ea317);
      const _0x9d381a = new Transform({
        transform(_0x5fc346, _0x316b0c, _0x402ebc) {
          _0x12351c += _0x5fc346.length;
          _0x524ffc(_0x12351c, _0x141cea);
          _0x402ebc(null, _0x5fc346);
        }
      });
      try {
        await pipeline(_0x1c1550.data, _0x9d381a, _0x26b12a);
        _0x524ffc(_0x141cea || _0x12351c, _0x141cea || _0x12351c);
        if (_0x1c25f3() && !_0x1c25f3().isDestroyed()) {
          _0x1c25f3().webContents.send("download-progress", {
            percent: 100,
            downloaded: _0x12351c,
            total: _0x141cea || _0x12351c
          });
        }
        if (typeof _0x5c57c6 === "function") {
          await _0x5c57c6();
        }
        return {
          targetPath: _0x2ea317
        };
      } catch (_0x1a80eb) {
        try {
          _0x26b12a.destroy();
        } catch (_0x8834af) {}
        try {
          if (fs.existsSync(_0x2ea317)) {
            fs.unlinkSync(_0x2ea317);
          }
        } catch (_0x17fcd9) {}
        throw _0x1a80eb;
      }
    };
    try {
      await _0x4270d3(_0x5578b4, () => {
        console.log("[Download] 下载完成: " + _0x5578b4);
        _0x417551(_0x5578b4, _0x4dde04.needsPostExitReplace);
      });
    } catch (_0x5e2ab1) {
      const _0x3875bf = _0x5e2ab1.code === "EBUSY" || _0x5e2ab1.code === "EPERM" || _0x5e2ab1.code === "EACCES";
      if (_0x3875bf && !_0x4dde04.needsPostExitReplace && _0x5578b4 === _0x4dde04.downloadPath) {
        const _0x3c5efb = _0x4dde04.installDir !== path.join(app.getPath("userData"), "updates") ? _0x4dde04.installDir : path.join(app.getPath("userData"), "updates");
        const _0x24ea96 = path.join(_0x3c5efb, ".pending-" + _0x4dde04.versionedFileName);
        console.warn("[Download] 直接写入失败 (" + _0x5e2ab1.message + ")，改存 " + _0x24ea96 + " 并在退出后重命名");
        try {
          if (fs.existsSync(_0x5578b4)) {
            fs.unlinkSync(_0x5578b4);
          }
        } catch (_0x50082a) {}
        _0x5578b4 = _0x24ea96;
        try {
          await _0x4270d3(_0x5578b4, () => {
            console.log("[Download] 临时下载完成: " + _0x5578b4);
            _0x417551(_0x5578b4, true);
          });
          return;
        } catch (_0x59d97f) {
          const _0x4a9640 = _0x1b2567(_0x59d97f);
          console.error("[Download] 临时下载失败: " + _0x4a9640, _0x59d97f);
          if (_0x1c25f3() && !_0x1c25f3().isDestroyed()) {
            _0x1c25f3().webContents.send("download-error", _0x4a9640);
          }
          return;
        }
      }
      const _0x26a14c = _0x1b2567(_0x5e2ab1);
      console.error("[Download] 请求失败: " + _0x26a14c, _0x5e2ab1);
      if (_0x1c25f3() && !_0x1c25f3().isDestroyed()) {
        _0x1c25f3().webContents.send("download-error", _0x26a14c);
      }
    }
  });
  function _0x30a5b9() {
    const _0x2f5ff0 = _0x5f5728.get("pending_update_temp_path");
    const _0x39249c = _0x5f5728.get("pending_update_needs_replace");
    const _0x32bc02 = _0x5f5728.get("pending_update_version") || _0x2047ef?.version;
    const _0x5763dc = _0x5f5728.get("pending_update_final_path");
    if (!_0x39249c || !_0x2f5ff0 || !fs.existsSync(_0x2f5ff0)) {
      return false;
    }
    try {
      const _0x9e1930 = _0x5763dc ? path.dirname(_0x5763dc) : path.dirname(_0x2f5ff0);
      const _0x5e2d37 = _0x32bc02 || _0x3834a5(path.basename(_0x2f5ff0).replace(/^\.pending-/, ""));
      const _0x222e27 = _0x5763dc || path.join(_0x9e1930, _0x5980b0(_0x5e2d37));
      _0x1952bd(_0x2f5ff0, _0x222e27, true);
      _0x5f5728.delete("pending_update_temp_path");
      _0x5f5728.delete("pending_update_final_path");
      _0x5f5728.delete("pending_update_version");
      _0x5f5728.delete("pending_update_needs_replace");
      return true;
    } catch (_0x9adcc8) {
      console.error("[Update] 启动退出后替换脚本失败:", _0x9adcc8.message || _0x9adcc8);
      return false;
    }
  }
  ipcMain.on("apply-update-and-exit", () => {
    _0x25785();
  });
  async function _0x58b8a8(_0x9e28e5, _0x43a6e1) {
    console.log("[HotUpdate] 开始处理热更新... 目标版本: " + _0x43a6e1 + ", URL: " + _0x9e28e5);
    const _0x2a205b = path.join(app.getPath("userData"), "plugins");
    const _0x5c081f = path.join(_0x2a205b, "extension_v" + _0x43a6e1);
    const _0x15bf56 = path.join(_0x2a205b, "ext_" + _0x43a6e1 + ".zip");
    if (!fs.existsSync(_0x2a205b)) {
      console.log("[HotUpdate] 创建插件目录: " + _0x2a205b);
      fs.mkdirSync(_0x2a205b, {
        recursive: true
      });
    }
    try {
      console.log("[HotUpdate] 正在从云端下载资源包...");
      const _0x3d2481 = await axios({
        method: "get",
        url: _0x9e28e5,
        responseType: "stream"
      });
      const _0x47db69 = fs.createWriteStream(_0x15bf56);
      _0x3d2481.data.pipe(_0x47db69);
      await new Promise((_0x104800, _0x2a8779) => {
        _0x47db69.on("finish", () => {
          console.log("[HotUpdate] 下载完成，存放在: " + _0x15bf56);
          _0x104800();
        });
        _0x47db69.on("error", _0x25d344 => {
          console.error("[HotUpdate] 写入文件失败:", _0x25d344);
          _0x2a8779(_0x25d344);
        });
      });
      console.log("[HotUpdate] 正在解压资源到: " + _0x5c081f);
      const _0x581c7a = new AdmZip(_0x15bf56);
      _0x581c7a.extractAllTo(_0x5c081f, true);
      _0x5f5728.set("latest_ext_path", _0x5c081f);
      _0x5f5728.set("local_ext_version", _0x43a6e1);
      console.log("[HotUpdate] 热更新完成！插件已成功升级至 v" + _0x43a6e1);
      Promise.resolve().then(() => _0xfe67e()).catch(_0xb65ecb => console.warn("[HotUpdate] extensionSync failed:", _0xb65ecb?.message || _0xb65ecb));
      if (_0x1c25f3()) {
        _0x1c25f3().webContents.send("new-status", "系统资源已自动升级至 v" + _0x43a6e1 + "，下次启动生效");
      }
      if (fs.existsSync(_0x15bf56)) {
        fs.unlinkSync(_0x15bf56);
      }
    } catch (_0x1303a0) {
      console.error("[HotUpdate] 严重错误: 热更新失败!", _0x1303a0.message);
    }
  }
  return {
    scheduleCheckUpdate: _0x35014d,
    launchPendingUpdateReplacementIfReady: _0x30a5b9,
    checkUpdate: _0x3af791,
    pushUpdateToRenderer: _0x4551eb
  };
}
module.exports = {
  createAppUpdateService: createAppUpdateService
};
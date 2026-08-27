'use strict';

const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const {
  app
} = require("electron");
function createExtensionSync({
  store: _0x2af811,
  appDir: _0x3e0746
}) {
  const _0x53877a = ".sync-meta.json";
  function _0x3894e2() {
    return new Promise(_0x5804b2 => setImmediate(_0x5804b2));
  }
  async function _0x192f9f(_0x6fbbc0, _0x2fbc38, _0x22387d = {
    files: 0
  }) {
    if (!fs.existsSync(_0x6fbbc0)) {
      return;
    }
    await fsp.mkdir(_0x2fbc38, {
      recursive: true
    });
    const _0x3a2988 = await fsp.readdir(_0x6fbbc0);
    for (const _0x5c39ed of _0x3a2988) {
      const _0x1e8f81 = path.join(_0x6fbbc0, _0x5c39ed);
      const _0x5a671d = path.join(_0x2fbc38, _0x5c39ed);
      const _0x3e0b11 = await fsp.lstat(_0x1e8f81);
      if (_0x3e0b11.isDirectory()) {
        await _0x192f9f(_0x1e8f81, _0x5a671d, _0x22387d);
      } else {
        await fsp.copyFile(_0x1e8f81, _0x5a671d);
        _0x22387d.files += 1;
        if (_0x22387d.files % 16 === 0) {
          await _0x3894e2();
        }
      }
    }
  }
  async function _0x44f278(_0x38b03f) {
    const _0x181eff = path.join(_0x38b03f, _0x53877a);
    try {
      if (!fs.existsSync(_0x181eff)) {
        return null;
      }
      return JSON.parse(await fsp.readFile(_0x181eff, "utf8"));
    } catch (_0x1c5821) {
      return null;
    }
  }
  async function _0x487992(_0x13225e) {
    const _0x4b374b = path.join(_0x13225e, "manifest.json");
    let _0x1a9dc1 = 0;
    let _0x4eb193 = 0;
    try {
      if (fs.existsSync(_0x4b374b)) {
        const _0x3d9e5d = await fsp.stat(_0x4b374b);
        _0x1a9dc1 = _0x3d9e5d.mtimeMs;
        _0x4eb193 = _0x3d9e5d.size;
      } else {
        const _0x2240da = await fsp.stat(_0x13225e);
        _0x1a9dc1 = _0x2240da.mtimeMs;
        _0x4eb193 = _0x2240da.size;
      }
    } catch (_0x486cdc) {}
    return {
      srcPath: _0x13225e,
      mtimeMs: _0x1a9dc1,
      size: _0x4eb193,
      version: String(_0x2af811.get("local_ext_version") || _0x2af811.get("latest_ext_version") || "")
    };
  }
  function _0x807d0e(_0x9b2d5f, _0x3b3dbe) {
    if (!_0x9b2d5f || !_0x3b3dbe) {
      return false;
    }
    return _0x9b2d5f.srcPath === _0x3b3dbe.srcPath && Number(_0x9b2d5f.mtimeMs) === Number(_0x3b3dbe.mtimeMs) && Number(_0x9b2d5f.size) === Number(_0x3b3dbe.size) && String(_0x9b2d5f.version || "") === String(_0x3b3dbe.version || "");
  }
  async function _0x501e66() {
    try {
      let _0x1b47f8 = _0x2af811.get("latest_ext_path");
      let _0x4f6586 = "";
      if (_0x1b47f8 && fs.existsSync(path.join(_0x1b47f8, "extension"))) {
        _0x4f6586 = path.join(_0x1b47f8, "extension");
      } else {
        _0x4f6586 = app.isPackaged ? path.join(process.resourcesPath, "extension") : path.join(_0x3e0746, "..", "extension");
      }
      if (!fs.existsSync(_0x4f6586)) {
        return;
      }
      const _0x348efc = path.join(app.getPath("home"), ".huoke-radar-ext-current");
      const _0x2069a3 = await _0x487992(_0x4f6586);
      if (fs.existsSync(_0x348efc)) {
        const _0x547c59 = await _0x44f278(_0x348efc);
        if (_0x807d0e(_0x547c59, _0x2069a3)) {
          console.log("[Main] 插件固定目录已是最新，跳过同步: " + _0x348efc);
          return _0x348efc;
        }
      }
      console.log("[Main] 正在同步插件到固定目录: " + _0x348efc);
      if (fs.existsSync(_0x348efc)) {
        await fsp.rm(_0x348efc, {
          recursive: true,
          force: true
        });
        await _0x3894e2();
      }
      await fsp.mkdir(_0x348efc, {
        recursive: true
      });
      await _0x192f9f(_0x4f6586, _0x348efc);
      await fsp.writeFile(path.join(_0x348efc, _0x53877a), JSON.stringify(_0x2069a3, null, 2) + "\n", "utf8");
      console.log("[Main] 插件同步完成，手动安装用户重启浏览器即可完成升级");
      return _0x348efc;
    } catch (_0x51bfcc) {
      console.error("[Main] 同步插件固定目录失败:", _0x51bfcc);
    }
  }
  return {
    copyRecursive: _0x192f9f,
    syncExtensionToFixedPath: _0x501e66
  };
}
module.exports = {
  createExtensionSync: createExtensionSync
};
'use strict';

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const {
  app,
  ipcMain,
  dialog,
  BrowserWindow
} = require("electron");
function registerCommentFeedbackIpc({
  store: _0x234ae5,
  getDeviceId: _0x408142,
  getApiBase: _0x54ee10,
  getMainWindow: _0x6fceb8
}) {
  ipcMain.handle("submit-feedback", async (_0x206039, _0x5a3665) => {
    try {
      const _0x2d3ce5 = _0x234ae5.get("auth_token");
      const _0x45c520 = {
        ..._0x5a3665,
        device_id: _0x408142()
      };
      const _0x94b2b6 = await axios.post(_0x54ee10() + "/feedback/submit", _0x45c520, {
        headers: _0x2d3ce5 ? {
          Authorization: "Bearer " + _0x2d3ce5
        } : {},
        timeout: 10000
      });
      if (_0x94b2b6.data.code === 200) {
        return {
          success: true
        };
      }
      return {
        success: false,
        msg: _0x94b2b6.data.msg || "提交失败"
      };
    } catch (_0xc4cabb) {
      console.error("[Feedback] 提交异常:", _0xc4cabb.message);
      return {
        success: false,
        msg: "网络连接失败，请检查网络后重试"
      };
    }
  });
  const _0x39552c = () => path.join(app.getPath("userData"), "comment-images");
  function _0x180dcc(_0x17d1c8) {
    const _0x2b7ebd = path.extname(_0x17d1c8 || "").toLowerCase();
    const _0x231d6d = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp"
    };
    return _0x231d6d[_0x2b7ebd] || "image/png";
  }
  ipcMain.handle("pick-comment-image", async () => {
    try {
      const _0x15cee8 = BrowserWindow.getFocusedWindow() || _0x6fceb8();
      const _0x19a6bb = await dialog.showOpenDialog(_0x15cee8, {
        title: "选择评论配图（可多选）",
        properties: ["openFile", "multiSelections"],
        filters: [{
          name: "图片",
          extensions: ["jpg", "jpeg", "png", "gif", "webp"]
        }]
      });
      if (_0x19a6bb.canceled || !_0x19a6bb.filePaths?.length) {
        return {
          canceled: true
        };
      }
      const _0x103144 = _0x39552c();
      fs.mkdirSync(_0x103144, {
        recursive: true
      });
      const _0x563d24 = Date.now();
      const _0x1c3ebf = _0x19a6bb.filePaths.map((_0x4f3c99, _0x33502f) => {
        const _0x159d3d = path.extname(_0x4f3c99) || ".png";
        const _0x5e629d = path.join(_0x103144, "comment_" + _0x563d24 + "_" + _0x33502f + _0x159d3d);
        fs.copyFileSync(_0x4f3c99, _0x5e629d);
        return _0x5e629d;
      });
      return {
        canceled: false,
        paths: _0x1c3ebf,
        path: _0x1c3ebf[0]
      };
    } catch (_0x23cc43) {
      console.error("[CommentImage] 选择图片失败:", _0x23cc43.message);
      return {
        canceled: true,
        error: _0x23cc43.message
      };
    }
  });
  ipcMain.handle("read-comment-image", async (_0x188633, _0x36c5b6) => {
    try {
      if (!_0x36c5b6 || typeof _0x36c5b6 !== "string" || !fs.existsSync(_0x36c5b6)) {
        return null;
      }
      const _0x1bc178 = fs.readFileSync(_0x36c5b6);
      return {
        base64: _0x1bc178.toString("base64"),
        mime: _0x180dcc(_0x36c5b6),
        name: path.basename(_0x36c5b6)
      };
    } catch (_0x15d806) {
      console.error("[CommentImage] 读取图片失败:", _0x15d806.message);
      return null;
    }
  });
  async function _0x525e79(_0x3006e4, _0x55ec1a, {
    requireMarked = false
  } = {}) {
    if (!_0x3006e4 || _0x3006e4.isDestroyed()) {
      return {
        ok: false,
        error: "no_webcontents"
      };
    }
    if (!_0x55ec1a || !fs.existsSync(_0x55ec1a)) {
      return {
        ok: false,
        error: "file_not_found"
      };
    }
    const _0x25e035 = path.resolve(_0x55ec1a);
    const _0x19aa18 = _0x3006e4.debugger;
    let _0x32524c = false;
    try {
      if (!_0x19aa18.isAttached()) {
        _0x19aa18.attach("1.3");
        _0x32524c = true;
      }
      const {
        root: _0x53f2cf
      } = await _0x19aa18.sendCommand("DOM.getDocument", {
        depth: -1,
        pierce: true
      });
      const _0xa77eef = requireMarked ? ["input[type=\"file\"][data-radar-comment-file-input=\"1\"]"] : ["input[type=\"file\"][data-radar-comment-file-input=\"1\"]", "[data-e2e=\"comment-input\"] input[type=\"file\"]", "[data-e2e*=\"comment\"] input[type=\"file\"]", "input[type=\"file\"][accept*=\"image\"]", "input[type=\"file\"]"];
      let _0x2bd7c0 = null;
      let _0x273929 = "";
      for (const _0x52e0eb of _0xa77eef) {
        try {
          const _0x9859a6 = await _0x19aa18.sendCommand("DOM.querySelector", {
            nodeId: _0x53f2cf.nodeId,
            selector: _0x52e0eb
          });
          if (_0x9859a6?.nodeId) {
            _0x2bd7c0 = _0x9859a6.nodeId;
            _0x273929 = _0x52e0eb;
            break;
          }
        } catch (_0x251bfb) {}
      }
      if (!_0x2bd7c0) {
        return {
          ok: false,
          error: requireMarked ? "no_marked_reply_file_input" : "no_file_input"
        };
      }
      await _0x19aa18.sendCommand("DOM.setFileInputFiles", {
        nodeId: _0x2bd7c0,
        files: [_0x25e035]
      });
      return {
        ok: true,
        method: "cdp",
        selector: _0x273929
      };
    } catch (_0x474a8e) {
      return {
        ok: false,
        error: _0x474a8e.message || String(_0x474a8e)
      };
    } finally {
      if (_0x32524c) {
        try {
          _0x19aa18.detach();
        } catch (_0x4789db) {}
      }
    }
  }
  ipcMain.handle("automation-attach-comment-image", async (_0x5115e6, {
    filePath: _0x27cde4,
    requireMarked = false
  } = {}) => {
    try {
      const _0x2ab57 = _0x5115e6.sender;
      return await _0x525e79(_0x2ab57, _0x27cde4, {
        requireMarked: requireMarked
      });
    } catch (_0x1bc93f) {
      console.error("[CommentImage] CDP 注入失败:", _0x1bc93f.message);
      return {
        ok: false,
        error: _0x1bc93f.message || String(_0x1bc93f)
      };
    }
  });
  ipcMain.handle("upload-feedback-image", async (_0x4ff744, {
    base64: _0x3bb08b,
    fileName: _0x4a1474
  }) => {
    try {
      const _0x54b155 = _0x234ae5.get("auth_token");
      const _0x215da5 = _0x3bb08b.replace(/^data:image\/\w+;base64,/, "");
      const _0x1a139e = Buffer.from(_0x215da5, "base64");
      const _0x3afd6f = new FormData();
      const _0x64ff0e = new Blob([_0x1a139e]);
      _0x3afd6f.append("file", _0x64ff0e, _0x4a1474);
      const _0x55eb70 = _0x54ee10();
      const _0x3f91a2 = await axios.post(_0x55eb70 + "/feedback/upload", _0x3afd6f, {
        headers: {
          ...(_0x54b155 ? {
            Authorization: "Bearer " + _0x54b155
          } : {}),
          "Content-Type": "multipart/form-data"
        },
        timeout: 30000
      });
      if (_0x3f91a2.data.code === 200) {
        const _0x1c7ef0 = _0x3f91a2.data.data.url;
        const _0x4a8fce = _0x55eb70.replace("/api", "");
        const _0x4741ff = _0x1c7ef0.startsWith("http") ? _0x1c7ef0 : "" + _0x4a8fce + _0x1c7ef0;
        return {
          success: true,
          url: _0x4741ff,
          relativeUrl: _0x1c7ef0
        };
      }
      return {
        success: false,
        msg: _0x3f91a2.data.msg || "上传失败"
      };
    } catch (_0x52afbe) {
      console.error("[Feedback] 图片上传异常:", _0x52afbe.message);
      return {
        success: false,
        msg: "图片上传失败: " + _0x52afbe.message
      };
    }
  });
}
module.exports = {
  registerCommentFeedbackIpc: registerCommentFeedbackIpc
};
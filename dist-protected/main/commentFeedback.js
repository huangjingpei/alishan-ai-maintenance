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
  store: store,
  getDeviceId: getDeviceId,
  getApiBase: getApiBase,
  getMainWindow: getMainWindow
}) {
  ipcMain.handle("submit-feedback", async (arg1, arg2) => {
    try {
      const result = store.get("auth_token");
      const obj = {
        ...arg2,
        device_id: getDeviceId()
      };
      const result2 = await axios.post(getApiBase() + "/feedback/submit", obj, {
        headers: result ? {
          Authorization: "Bearer " + result
        } : {},
        timeout: 10000
      });
      if (result2.data.code === 200) {
        return {
          success: true
        };
      }
      return {
        success: false,
        msg: result2.data.msg || "提交失败"
      };
    } catch (error) {
      console.error("[Feedback] 提交异常:", error.message);
      return {
        success: false,
        msg: "网络连接失败，请检查网络后重试"
      };
    }
  });
  const local = () => path.join(app.getPath("userData"), "comment-images");
  function fn(arg1) {
    const result = path.extname(arg1 || "").toLowerCase();
    const obj = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp"
    };
    return obj[result] || "image/png";
  }
  ipcMain.handle("pick-comment-image", async () => {
    try {
      const local2 = BrowserWindow.getFocusedWindow() || getMainWindow();
      const result = await dialog.showOpenDialog(local2, {
        title: "选择评论配图（可多选）",
        properties: ["openFile", "multiSelections"],
        filters: [{
          name: "图片",
          extensions: ["jpg", "jpeg", "png", "gif", "webp"]
        }]
      });
      if (result.canceled || !result.filePaths?.length) {
        return {
          canceled: true
        };
      }
      const result2 = local();
      fs.mkdirSync(result2, {
        recursive: true
      });
      const result3 = Date.now();
      const result4 = result.filePaths.map((arg1, arg2) => {
        const local = path.extname(arg1) || ".png";
        const result = path.join(result2, "comment_" + result3 + "_" + arg2 + local);
        fs.copyFileSync(arg1, result);
        return result;
      });
      return {
        canceled: false,
        paths: result4,
        path: result4[0]
      };
    } catch (error) {
      console.error("[CommentImage] 选择图片失败:", error.message);
      return {
        canceled: true,
        error: error.message
      };
    }
  });
  ipcMain.handle("read-comment-image", async (arg1, arg2) => {
    try {
      if (!arg2 || typeof arg2 !== "string" || !fs.existsSync(arg2)) {
        return null;
      }
      const result = fs.readFileSync(arg2);
      return {
        base64: result.toString("base64"),
        mime: fn(arg2),
        name: path.basename(arg2)
      };
    } catch (error) {
      console.error("[CommentImage] 读取图片失败:", error.message);
      return null;
    }
  });
  async function fn2(arg1, arg2, {
    requireMarked = false
  } = {}) {
    if (!arg1 || arg1.isDestroyed()) {
      return {
        ok: false,
        error: "no_webcontents"
      };
    }
    if (!arg2 || !fs.existsSync(arg2)) {
      return {
        ok: false,
        error: "file_not_found"
      };
    }
    const result = path.resolve(arg2);
    const value = arg1.debugger;
    let flag = false;
    try {
      if (!value.isAttached()) {
        value.attach("1.3");
        flag = true;
      }
      const {
        root: root
      } = await value.sendCommand("DOM.getDocument", {
        depth: -1,
        pierce: true
      });
      const value2 = requireMarked ? ["input[type=\"file\"][data-radar-comment-file-input=\"1\"]"] : ["input[type=\"file\"][data-radar-comment-file-input=\"1\"]", "[data-e2e=\"comment-input\"] input[type=\"file\"]", "[data-e2e*=\"comment\"] input[type=\"file\"]", "input[type=\"file\"][accept*=\"image\"]", "input[type=\"file\"]"];
      let local = null;
      let text = "";
      for (const item of value2) {
        try {
          const result = await value.sendCommand("DOM.querySelector", {
            nodeId: root.nodeId,
            selector: item
          });
          if (result?.nodeId) {
            local = result.nodeId;
            text = item;
            break;
          }
        } catch (error) {}
      }
      if (!local) {
        return {
          ok: false,
          error: requireMarked ? "no_marked_reply_file_input" : "no_file_input"
        };
      }
      await value.sendCommand("DOM.setFileInputFiles", {
        nodeId: local,
        files: [result]
      });
      return {
        ok: true,
        method: "cdp",
        selector: text
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message || String(error)
      };
    } finally {
      if (flag) {
        try {
          value.detach();
        } catch (error) {}
      }
    }
  }
  ipcMain.handle("automation-attach-comment-image", async (arg1, {
    filePath: filePath,
    requireMarked = false
  } = {}) => {
    try {
      const value = arg1.sender;
      return await fn2(value, filePath, {
        requireMarked: requireMarked
      });
    } catch (error) {
      console.error("[CommentImage] CDP 注入失败:", error.message);
      return {
        ok: false,
        error: error.message || String(error)
      };
    }
  });
  ipcMain.handle("upload-feedback-image", async (arg1, {
    base64: base64,
    fileName: fileName
  }) => {
    try {
      const result = store.get("auth_token");
      const result2 = base64.replace(/^data:image\/\w+;base64,/, "");
      const result3 = Buffer.from(result2, "base64");
      const formData = new FormData();
      const blob = new Blob([result3]);
      formData.append("file", blob, fileName);
      const result4 = getApiBase();
      const result5 = await axios.post(result4 + "/feedback/upload", formData, {
        headers: {
          ...(result ? {
            Authorization: "Bearer " + result
          } : {}),
          "Content-Type": "multipart/form-data"
        },
        timeout: 30000
      });
      if (result5.data.code === 200) {
        const value = result5.data.data.url;
        const result = result4.replace("/api", "");
        const value2 = value.startsWith("http") ? value : "" + result + value;
        return {
          success: true,
          url: value2,
          relativeUrl: value
        };
      }
      return {
        success: false,
        msg: result5.data.msg || "上传失败"
      };
    } catch (error) {
      console.error("[Feedback] 图片上传异常:", error.message);
      return {
        success: false,
        msg: "图片上传失败: " + error.message
      };
    }
  });
}
module.exports = {
  registerCommentFeedbackIpc: registerCommentFeedbackIpc
};
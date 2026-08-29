'use strict';

const WebSocket = require("ws");
function createPluginWebSocket({
  getMainWindow: getMainWindow,
  getActiveSettings: getActiveSettings,
  getActiveAutomationSettings: getActiveAutomationSettings,
  store: store,
  setWss: setWss,
  appendHistory: appendHistory,
  trackInteractions: trackInteractions,
  addToReportQueue: addToReportQueue,
  reconcileActiveSettings: reconcileActiveSettings
}) {
  function startWSServer() {
    try {
      const local = new WebSocket.Server({
        port: 12345
      });
      setWss(local);
      console.log("[Main] WebSocket 辅助服务已启动 (内置兼容模式)");
      local.on("error", arg1 => {
        console.error("[Main] WebSocket 服务启动失败:", arg1.message);
        if (arg1.code === "EADDRINUSE") {
          console.error("[Main] 错误：12345 端口已被占用，请关闭冲突程序后重试");
        }
      });
      local.on("connection", arg1 => {
        console.log("[Main] 浏览器插件已连接");
        const result = getMainWindow();
        if (result) {
          result.webContents.send("plugin-status", {
            connected: true
          });
        }
        const result2 = getActiveSettings();
        if (result2) {
          console.log("[Main] 同步当前活跃任务给新连接的插件 (静默同步)");
          arg1.send(JSON.stringify({
            type: "START_TASK",
            payload: result2,
            isSync: true
          }));
        } else {
          arg1.send(JSON.stringify({
            type: "STOP_TASK",
            payload: {
              silent: true
            }
          }));
        }
        arg1.on("close", () => {
          console.log("[Main] 浏览器插件连接已断开");
          const result = Array.from(local.clients).some(arg1 => arg1.readyState === 1);
          const result2 = getMainWindow();
          if (result2) {
            result2.webContents.send("plugin-status", {
              connected: result
            });
            if (!result) {
              result2.webContents.send("new-status", "所有浏览器插件已断开连接");
            }
          }
        });
        arg1.on("message", arg1 => {
          try {
            const result = JSON.parse(arg1);
            if (getActiveAutomationSettings().length === 0 && (result.type === "DATA" || result.type === "STATUS")) {
              console.log("[Main] 拒绝接收插件消息（当前无活跃任务）: Type=" + result.type);
              return;
            }
            const result2 = getMainWindow();
            if (result.type === "DATA" || result.type === "STATUS") {
              if (result2) {
                result2.webContents.send(result.type === "DATA" ? "new-data" : "new-status", result.payload);
              }
            } else if (result.type === "VIDEO_PROCESSED") {
              const value = result.payload;
              const processedVideosAccess = require("./processedVideosAccess");
              if (!processedVideosAccess.findByUrl(store, value.url)) {
                processedVideosAccess.upsert(store, {
                  url: value.url,
                  title: value.title,
                  timestamp: Date.now(),
                  recordType: "history_video"
                });
                const result = processedVideosAccess.listAll(store);
                const result2 = result.map(arg1 => arg1.url);
                const result3 = JSON.stringify({
                  type: "UPDATE_MEMORY",
                  payload: result2
                });
                local.clients.forEach(arg1 => {
                  if (arg1.readyState === WebSocket.OPEN) {
                    arg1.send(result3);
                  }
                });
              }
            } else if (result.type === "TASK_COMPLETED") {
              console.log("[Main] 收到任务完成信号。");
              reconcileActiveSettings();
              if (result2) {
                result2.webContents.send("new-status", "任务已圆满完成 - 自动停止");
                result2.webContents.send("task-stopped");
              }
            }
            if (result.type === "DATA" && result.payload) {
              const value = Array.isArray(result.payload) ? result.payload : result.payload.items || [];
              const result2 = getActiveSettings();
              const local = result.taskId || result2?.taskId || "unknown_task";
              const local2 = result.taskName || result2?.taskName || "未命名任务";
              appendHistory(value, local, local2);
              trackInteractions(value);
              addToReportQueue(value);
            }
          } catch (error) {
            console.error("解析插件消息失败", error);
          }
        });
      });
    } catch (error) {
      console.error("[Main] WebSocket Server 创建异常:", error.message);
    }
  }
  return {
    startWSServer: startWSServer
  };
}
module.exports = {
  createPluginWebSocket: createPluginWebSocket
};
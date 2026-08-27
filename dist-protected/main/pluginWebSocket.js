'use strict';

const WebSocket = require("ws");
function createPluginWebSocket({
  getMainWindow: _0x564f2a,
  getActiveSettings: _0x27dc6b,
  getActiveAutomationSettings: _0x2eec3a,
  store: _0x31a0f9,
  setWss: _0x341553,
  appendHistory: _0x1d5546,
  trackInteractions: _0x1e61ca,
  addToReportQueue: _0x43a3a2,
  reconcileActiveSettings: _0x202429
}) {
  function _0x496b0f() {
    try {
      const _0x44640e = new WebSocket.Server({
        port: 12345
      });
      _0x341553(_0x44640e);
      console.log("[Main] WebSocket 辅助服务已启动 (内置兼容模式)");
      _0x44640e.on("error", _0x535052 => {
        console.error("[Main] WebSocket 服务启动失败:", _0x535052.message);
        if (_0x535052.code === "EADDRINUSE") {
          console.error("[Main] 错误：12345 端口已被占用，请关闭冲突程序后重试");
        }
      });
      _0x44640e.on("connection", _0x3537cc => {
        console.log("[Main] 浏览器插件已连接");
        const _0x249ba3 = _0x564f2a();
        if (_0x249ba3) {
          _0x249ba3.webContents.send("plugin-status", {
            connected: true
          });
        }
        const _0x5e2906 = _0x27dc6b();
        if (_0x5e2906) {
          console.log("[Main] 同步当前活跃任务给新连接的插件 (静默同步)");
          _0x3537cc.send(JSON.stringify({
            type: "START_TASK",
            payload: _0x5e2906,
            isSync: true
          }));
        } else {
          _0x3537cc.send(JSON.stringify({
            type: "STOP_TASK",
            payload: {
              silent: true
            }
          }));
        }
        _0x3537cc.on("close", () => {
          console.log("[Main] 浏览器插件连接已断开");
          const _0x534d8f = Array.from(_0x44640e.clients).some(_0x4feabc => _0x4feabc.readyState === 1);
          const _0x455eb6 = _0x564f2a();
          if (_0x455eb6) {
            _0x455eb6.webContents.send("plugin-status", {
              connected: _0x534d8f
            });
            if (!_0x534d8f) {
              _0x455eb6.webContents.send("new-status", "所有浏览器插件已断开连接");
            }
          }
        });
        _0x3537cc.on("message", _0x570965 => {
          try {
            const _0x5a0cdd = JSON.parse(_0x570965);
            if (_0x2eec3a().length === 0 && (_0x5a0cdd.type === "DATA" || _0x5a0cdd.type === "STATUS")) {
              console.log("[Main] 拒绝接收插件消息（当前无活跃任务）: Type=" + _0x5a0cdd.type);
              return;
            }
            const _0x10010f = _0x564f2a();
            if (_0x5a0cdd.type === "DATA" || _0x5a0cdd.type === "STATUS") {
              if (_0x10010f) {
                _0x10010f.webContents.send(_0x5a0cdd.type === "DATA" ? "new-data" : "new-status", _0x5a0cdd.payload);
              }
            } else if (_0x5a0cdd.type === "VIDEO_PROCESSED") {
              const _0x5591f2 = _0x5a0cdd.payload;
              const _0x1a7e67 = require("./processedVideosAccess");
              if (!_0x1a7e67.findByUrl(_0x31a0f9, _0x5591f2.url)) {
                _0x1a7e67.upsert(_0x31a0f9, {
                  url: _0x5591f2.url,
                  title: _0x5591f2.title,
                  timestamp: Date.now(),
                  recordType: "history_video"
                });
                const _0x86fb7f = _0x1a7e67.listAll(_0x31a0f9);
                const _0x43e083 = _0x86fb7f.map(_0x575d81 => _0x575d81.url);
                const _0x425054 = JSON.stringify({
                  type: "UPDATE_MEMORY",
                  payload: _0x43e083
                });
                _0x44640e.clients.forEach(_0x9b9c53 => {
                  if (_0x9b9c53.readyState === WebSocket.OPEN) {
                    _0x9b9c53.send(_0x425054);
                  }
                });
              }
            } else if (_0x5a0cdd.type === "TASK_COMPLETED") {
              console.log("[Main] 收到任务完成信号。");
              _0x202429();
              if (_0x10010f) {
                _0x10010f.webContents.send("new-status", "任务已圆满完成 - 自动停止");
                _0x10010f.webContents.send("task-stopped");
              }
            }
            if (_0x5a0cdd.type === "DATA" && _0x5a0cdd.payload) {
              const _0xdd1758 = Array.isArray(_0x5a0cdd.payload) ? _0x5a0cdd.payload : _0x5a0cdd.payload.items || [];
              const _0x1c19a2 = _0x27dc6b();
              const _0x19136f = _0x5a0cdd.taskId || _0x1c19a2?.taskId || "unknown_task";
              const _0x41f0a4 = _0x5a0cdd.taskName || _0x1c19a2?.taskName || "未命名任务";
              _0x1d5546(_0xdd1758, _0x19136f, _0x41f0a4);
              _0x1e61ca(_0xdd1758);
              _0x43a3a2(_0xdd1758);
            }
          } catch (_0x23fe25) {
            console.error("解析插件消息失败", _0x23fe25);
          }
        });
      });
    } catch (_0x285f6e) {
      console.error("[Main] WebSocket Server 创建异常:", _0x285f6e.message);
    }
  }
  return {
    startWSServer: _0x496b0f
  };
}
module.exports = {
  createPluginWebSocket: createPluginWebSocket
};
class HistoryManager {
  constructor(arg1, arg2, options = {}) {
    this.store = arg1;
    this.ipcMain = arg2;
    this.onProcessedVideosRemoved = typeof options.onProcessedVideosRemoved === "function" ? options.onProcessedVideosRemoved : null;
    this.migrateLegacyData();
    this.registerHandlers();
  }
  setProcessedVideosRemovedHandler(arg1) {
    this.onProcessedVideosRemoved = typeof arg1 === "function" ? arg1 : null;
  }
  migrateLegacyData() {
    try {
      const result = this.store.get("global_blacklist", []);
      const result2 = this.store.get("global_blacklist_v2", []);
      let list = [];
      let flag = false;
      const set = new Set();
      result2.forEach(arg1 => {
        if (!arg1) {
          return;
        }
        const value = typeof arg1 === "string" ? arg1 : arg1.id || arg1.userUrl || arg1.nickname;
        if (value && !set.has(value)) {
          set.add(value);
          list.push(typeof arg1 === "string" ? {
            id: arg1,
            timestamp: Date.now()
          } : arg1);
          flag = true;
        }
      });
      result.forEach(arg1 => {
        if (!arg1) {
          return;
        }
        const value = typeof arg1 === "string" ? arg1 : arg1.id || arg1.userUrl || arg1.nickname;
        if (value && !set.has(value)) {
          set.add(value);
          list.push(typeof arg1 === "string" ? {
            id: arg1,
            timestamp: Date.now()
          } : arg1);
          flag = true;
        }
      });
      const result3 = result.some(arg1 => typeof arg1 === "string");
      if (result3 && result2.length === 0) {
        list = result.map(arg1 => typeof arg1 === "string" ? {
          id: arg1,
          timestamp: Date.now()
        } : arg1);
        flag = true;
      }
      if (flag) {
        this.store.set("global_blacklist", list);
        this.store.delete("global_blacklist_v2");
        console.log("[HistoryManager] 黑名单成功无缝合并迁移，共 " + list.length + " 条记录");
      }
      const result4 = this.store.get("processed_videos_detail", []);
      const result5 = this.store.get("processed_videos", []);
      const result6 = this.store.get("processed_videos_v2", []);
      let list2 = [...result4];
      let flag2 = false;
      const set2 = new Set(result4.map(arg1 => arg1.url));
      result6.forEach(arg1 => {
        if (!arg1) {
          return;
        }
        const value = typeof arg1 === "string" ? arg1 : arg1.url;
        if (value && !set2.has(value)) {
          set2.add(value);
          list2.push({
            url: value,
            title: "历史扫描记录",
            platform: "douyin",
            timestamp: typeof arg1 === "object" ? arg1.timestamp || Date.now() : Date.now()
          });
          flag2 = true;
        }
      });
      result5.forEach(arg1 => {
        if (arg1 && !set2.has(arg1)) {
          set2.add(arg1);
          list2.push({
            url: arg1,
            title: "历史扫描记录",
            platform: "douyin",
            timestamp: Date.now()
          });
          flag2 = true;
        }
      });
      if (flag2) {
        this.store.set("processed_videos_detail", list2);
        this.store.delete("processed_videos");
        this.store.delete("processed_videos_v2");
        console.log("[HistoryManager] 视频扫描记忆成功无缝合并迁移，共 " + list2.length + " 条记录");
      }
    } catch (error) {
      console.error("[HistoryManager] 启动数据迁移桥接发生异常:", error);
    }
  }
  registerHandlers() {
    this.ipcMain.handle("get-blacklist", () => {
      return this.store.get("global_blacklist", []);
    });
    this.ipcMain.handle("get-blacklist-size", () => {
      return this.store.get("global_blacklist", []).length;
    });
    this.ipcMain.handle("clear-blacklist", () => {
      this.store.set("global_blacklist", []);
      console.log("[Main] 全局黑名单已清空");
      return {
        success: true
      };
    });
    this.ipcMain.handle("remove-from-blacklist", (arg1, arg2) => {
      const result = this.store.get("global_blacklist", []);
      const result2 = result.filter(arg1 => {
        const value = typeof arg1 === "string" ? arg1 : arg1.id;
        return !arg2.includes(value);
      });
      this.store.set("global_blacklist", result2);
      return true;
    });
    this.ipcMain.on("add-to-blacklist", (arg1, arg2) => {
      const result = Date.now();
      const result2 = this.store.get("global_blacklist", []);
      let flag = false;
      (Array.isArray(arg2) ? arg2 : [arg2]).forEach(arg1 => {
        if (!arg1) {
          return;
        }
        const value = typeof arg1 === "string" ? arg1 : arg1.id || arg1.userUrl || arg1.nickname;
        if (!value) {
          return;
        }
        const result3 = result2.findIndex(arg1 => (typeof arg1 === "string" ? arg1 : arg1.id || arg1.userUrl || arg1.nickname) === value);
        if (result3 === -1) {
          const value = typeof arg1 === "string" ? {
            id: arg1,
            timestamp: result
          } : {
            ...arg1,
            timestamp: result
          };
          result2.push(value);
          flag = true;
        } else if (typeof arg1 === "object" && arg1 !== null) {
          const value = typeof result2[result3] === "string" ? {
            id: result2[result3]
          } : result2[result3];
          result2[result3] = {
            ...value,
            ...arg1,
            timestamp: Math.max(value.timestamp || 0, arg1.timestamp || result, result),
            touchSummary: arg1.touchSummary || value.touchSummary,
            lastChannel: arg1.lastChannel || value.lastChannel
          };
          flag = true;
        }
      });
      if (flag) {
        let local = result2;
        if (local.length > 8000) {
          local = local.slice(-8000);
        }
        this.store.set("global_blacklist", local);
        const {
          BrowserWindow: browserWindow
        } = require("electron");
        const result = browserWindow.getAllWindows().flatMap(arg1 => arg1.getBrowserViews ? arg1.getBrowserViews() : []);
        result.forEach(arg1 => {
          if (arg1 && !arg1.webContents.isDestroyed()) {
            arg1.webContents.send("sync-interacted-user", {
              entries: Array.isArray(arg2) ? arg2 : [arg2]
            });
          }
        });
      }
    });
    this.ipcMain.handle("get-processed-videos", () => {
      try {
        const processedVideosAccess = require("./processedVideosAccess");
        return processedVideosAccess.listHistoryVideos(this.store);
      } catch (error) {
        return this.store.get("processed_videos_detail", []).filter(arg1 => arg1?.recordType !== "collected_link");
      }
    });
    this.ipcMain.handle("get-processed-videos-page", (arg1, options = {}) => {
      try {
        const processedVideosAccess = require("./processedVideosAccess");
        return processedVideosAccess.listHistoryVideosPage(this.store, options || {});
      } catch (error) {
        return {
          items: [],
          total: 0,
          page: 1,
          pageSize: 20,
          error: error?.message || String(error)
        };
      }
    });
    this.ipcMain.handle("remove-processed-videos", (arg1, arg2) => {
      const value = Array.isArray(arg2) ? arg2 : [arg2];
      try {
        const processedVideosAccess = require("./processedVideosAccess");
        processedVideosAccess.removeByUrls(this.store, value);
      } catch (error) {
        const {
          processedVideoKeysMatch: processedVideoKeysMatch
        } = require("../shared/processedVideoKey");
        let result = this.store.get("processed_videos_detail", []);
        const result2 = result.filter(arg1 => !value.some(arg12 => processedVideoKeysMatch(arg1.url, arg12)));
        this.store.set("processed_videos_detail", result2);
      }
      try {
        this.onProcessedVideosRemoved?.(value);
      } catch (error) {}
      return true;
    });
    this.ipcMain.handle("get-batch-follow-runs", (arg1, options = {}) => this.getBatchRunSummariesPage(options));
    this.ipcMain.handle("get-batch-follow-runs-page", (arg1, options = {}) => this.getBatchRunSummariesPage(options));
    this.ipcMain.handle("get-batch-follow-run", (arg1, options = {}) => {
      const local = options?.id || options?.runId || options;
      return this.getBatchRunById(local);
    });
    this.ipcMain.handle("delete-batch-follow-runs", (arg1, arg2) => this.deleteBatchRuns(arg2));
    this.ipcMain.handle("clear-batch-follow-runs", () => this.clearBatchRuns());
  }
  getBatchRunsAccess() {
    return require("./batchFollowRunsAccess");
  }
  getBatchRuns() {
    return this.getBatchRunsAccess().listAll(this.store);
  }
  getBatchRunSummariesPage(options = {}) {
    return this.getBatchRunsAccess().listSummariesPage(this.store, options || {});
  }
  getBatchRunById(arg1) {
    return this.getBatchRunsAccess().getById(this.store, arg1);
  }
  saveBatchRuns(arg1) {
    return this.getBatchRunsAccess().replaceAll(this.store, arg1);
  }
  createBatchRun(arg1) {
    if (!arg1 || !arg1.id) {
      return null;
    }
    return this.getBatchRunsAccess().upsert(this.store, {
      ...arg1,
      results: Array.isArray(arg1.results) ? arg1.results : [],
      logs: Array.isArray(arg1.logs) ? arg1.logs : []
    });
  }
  updateBatchRun(arg1, arg2) {
    if (arg1 == null) {
      return null;
    }
    const result = this.getBatchRunsAccess();
    const result2 = result.getById(this.store, arg1);
    if (!result2) {
      return null;
    }
    const value = typeof arg2 === "function" ? arg2(result2) : {
      ...result2,
      ...arg2
    };
    if (!value) {
      return null;
    }
    return result.upsert(this.store, value);
  }
  appendBatchRunResult(arg1, arg2, options = {}) {
    return this.updateBatchRun(arg1, arg1 => {
      const value = Array.isArray(arg1.results) ? arg1.results.slice() : [];
      value.unshift({
        id: Date.now() + "_" + Math.random().toString(36).slice(2, 8),
        timestamp: Date.now(),
        ...arg2
      });
      const local = !!arg2?.skipped || !!arg2?.skipReason;
      const local2 = options.success ?? (arg1.success || 0) + (arg2?.success && !local ? 1 : 0);
      const local3 = options.failed ?? (arg1.failed || 0) + (!arg2?.success && !local ? 1 : 0);
      return {
        ...arg1,
        total: options.total ?? arg1.total,
        current: options.current ?? (arg1.current || 0) + 1,
        success: local2,
        failed: local3,
        skipped: (arg1.skipped || 0) + (local ? 1 : 0),
        results: value
      };
    });
  }
  appendBatchRunLog(arg1, options = {}) {
    const local = Number(options.ts) || Date.now();
    const obj = {
      id: options.id || local + "_" + Math.random().toString(36).slice(2, 8),
      runId: arg1,
      ts: local,
      time: options.time || new Date(local).toLocaleTimeString("zh-CN", {
        hour12: false
      }),
      level: options.level || "normal",
      message: String(options.message || "").trim(),
      accountId: options.accountId || "",
      accountName: options.accountName || "",
      viewKey: options.viewKey || "",
      leadId: options.leadId || "",
      leadName: options.leadName || "",
      phase: options.phase || "trace"
    };
    if (!obj.message) {
      return null;
    }
    const result = this.updateBatchRun(arg1, arg1 => {
      const value = Array.isArray(arg1.logs) ? arg1.logs.slice() : [];
      value.push(obj);
      return {
        ...arg1,
        logs: value
      };
    });
    if (result) {
      return obj;
    } else {
      return null;
    }
  }
  finalizeBatchRun(arg1, text = "completed") {
    return this.updateBatchRun(arg1, arg1 => {
      if (!arg1 || arg1.status === "completed" || arg1.status === "stopped") {
        return arg1;
      }
      return {
        ...arg1,
        status: text,
        endedAt: Date.now()
      };
    });
  }
  deleteBatchRuns(list = []) {
    this.getBatchRunsAccess().deleteByIds(this.store, list);
    return true;
  }
  clearBatchRuns() {
    const batchFollowRunsAccess = require("./batchFollowRunsAccess");
    return batchFollowRunsAccess.clearAll(this.store);
  }
  isBlacklisted(arg1) {
    const result = this.store.get("global_blacklist", []);
    return result.some(arg12 => {
      if (typeof arg12 === "string") {
        return arg12 === arg1;
      }
      return arg12.id === arg1 || arg12.userUrl === arg1 || arg12.nickname === arg1;
    });
  }
  isProcessedVideo(arg1) {
    try {
      const processedVideosAccess = require("./processedVideosAccess");
      return processedVideosAccess.isProcessed(this.store, arg1);
    } catch (error) {
      const {
        processedVideoKeysMatch: processedVideoKeysMatch
      } = require("../shared/processedVideoKey");
      const result = this.store.get("processed_videos_detail", []);
      return result.some(arg12 => processedVideoKeysMatch(arg12.url, arg1));
    }
  }
}
module.exports = HistoryManager;
'use strict';

const fs = require("fs");
const crypto = require("crypto");
const {
  ipcMain,
  dialog
} = require("electron");
const dbManager = require("./dbManager");
const leadUserKey = require("../shared/leadUserKey");
const {
  normalizeProcessedVideoKey,
  processedVideoKeysMatch,
  extractDouyinVideoId
} = require("../shared/processedVideoKey");
const processedVideosAccess = require("./processedVideosAccess");
function registerLeadsHistoryIpc(arg1) {
  const {
    store: store,
    historyManager: historyManager,
    ensureDatabaseInitialized: ensureDatabaseInitialized,
    isLeadsSqliteRuntime: isLeadsSqliteRuntime,
    HISTORY_FILE: historyFile,
    CRYPTO_KEY: cryptoKey,
    CRYPTO_IV: cryptoIv,
    getPlatformViews: getPlatformViews,
    getViewSettingsMap: getViewSettingsMap,
    inFlightProcessedVideos: inFlightProcessedVideos,
    recordAccountVideoMainComment: recordAccountVideoMainComment,
    broadcastClearProcessedVideosCache: broadcastClearProcessedVideosCache,
    appendHistory: appendHistory
  } = arg1;
  function fn(arg1) {
    const set = new Set();
    String(arg1 || "").split(/[\n,，\s]+/).map(arg1 => arg1.trim()).filter(Boolean).forEach(arg1 => {
      const result = extractDouyinVideoId(arg1);
      if (result) {
        set.add(result);
      }
    });
    return set;
  }
  function historyItemMatchesLeadId(arg1, arg2) {
    if (!arg1 || arg2 == null || arg2 === "") {
      return false;
    }
    const result = String(arg2);
    if (String(arg1.leadId || "") === result || String(arg1.key || "") === result) {
      return true;
    }
    const result2 = leadUserKey.getLeadUserKey(arg1);
    return !!result2 && String(result2) === result;
  }
  function isVideoInProcessedStore(arg1, arg2) {
    return arg2.some(arg12 => processedVideoKeysMatch(arg12.url, arg1));
  }
  function broadcastProcessedVideoSync(arg1) {
    getPlatformViews().forEach(arg12 => {
      if (arg12 && !arg12.webContents.isDestroyed()) {
        arg12.webContents.send("sync-processed-video", {
          url: arg1
        });
      }
    });
  }
  function broadcastForgetProcessedVideos(arg1) {
    const result = (Array.isArray(arg1) ? arg1 : [arg1]).map(arg1 => normalizeProcessedVideoKey(arg1) || String(arg1 || "").trim()).filter(Boolean);
    if (result.length === 0) {
      return;
    }
    for (const item of result) {
      inFlightProcessedVideos.delete(item);
      const result = extractDouyinVideoId(item);
      if (result) {
        inFlightProcessedVideos.delete("https://www.douyin.com/video/" + result);
      }
    }
    getPlatformViews().forEach(arg1 => {
      if (arg1 && !arg1.webContents.isDestroyed()) {
        arg1.webContents.send("forget-processed-videos", {
          urls: result
        });
      }
    });
  }
  function toCollectedVideoLeadKey(arg1) {
    const result = String(arg1 || "").trim();
    if (!result) {
      return "";
    }
    const local = result.match(/^video:(\d{10,})$/i)?.[1];
    if (local) {
      return "video:" + local;
    }
    const local2 = extractDouyinVideoId(result) || result.match(/(?:video|note)\/(\d{10,})/i)?.[1] || "";
    if (local2) {
      return "video:" + local2;
    } else {
      return "";
    }
  }
  try {
    historyManager.setProcessedVideosRemovedHandler?.(broadcastForgetProcessedVideos);
  } catch (error) {}
  function resolveProcessedVideoRecordMeta(options = {}, options2 = {}) {
    const value = Array.isArray(options?.scrapeTargets) ? options.scrapeTargets : [];
    const result = value.filter(arg1 => arg1 === "video" || arg1 === "author");
    const local = options?.taskMode === "scrape" && result.length > 0;
    return {
      recordType: options2?.recordType || (local ? "collected_link" : "history_video"),
      collectedTargets: Array.isArray(options2?.collectedTargets) ? options2.collectedTargets.filter(arg1 => arg1 === "video" || arg1 === "author") : result
    };
  }
  function registerIpc() {
    ipcMain.handle("get-history", async () => {
      if (isLeadsSqliteRuntime()) {
        console.warn("[Main] get-history 在 SQLite 运行时已禁用全量导出，请使用 get-leads-page");
        return [];
      }
      if (!fs.existsSync(historyFile)) {
        return [];
      }
      try {
        const result = fs.readFileSync(historyFile, "utf8");
        const result2 = crypto.createDecipheriv("aes-256-cbc", cryptoKey, cryptoIv);
        let result3 = result2.update(result, "hex", "utf8");
        result3 += result2.final("utf8");
        return JSON.parse(result3);
      } catch (error) {
        return [];
      }
    });
    ipcMain.handle("get-leads-page", async (arg1, options = {}) => {
      try {
        await ensureDatabaseInitialized();
        if (!isLeadsSqliteRuntime()) {
          return {
            items: [],
            total: 0,
            runtime: "enc"
          };
        }
        const result = Math.max(1, Number(options.page) || Number(options.current) || 1);
        const value = options.forExport === true;
        const value2 = value ? Math.max(1, Math.min(100000, Number(options.pageSize) || Number(options.limit) || 100000)) : Math.max(1, Math.min(200, Number(options.pageSize) || Number(options.limit) || 50));
        const value3 = value ? 0 : (result - 1) * value2;
        const local = options.filters || {};
        const result2 = await dbManager.queryLeadsPage({
          offset: value3,
          limit: value2,
          filters: local,
          orderBy: options.orderBy,
          forExport: value
        });
        return {
          ...result2,
          page: result,
          pageSize: value2,
          runtime: "sqlite"
        };
      } catch (error) {
        console.error("[Main] get-leads-page failed:", error?.message || error);
        return {
          items: [],
          total: 0,
          error: error?.message || String(error)
        };
      }
    });
    ipcMain.handle("get-leads-count", async (arg1, options = {}) => {
      try {
        await ensureDatabaseInitialized();
        if (!isLeadsSqliteRuntime()) {
          return {
            total: 0,
            runtime: "enc"
          };
        }
        const local = options.filters || {};
        const result = await dbManager.queryLeadsPage({
          offset: 0,
          limit: 1,
          filters: local,
          _countOnly: true
        });
        return {
          total: result.total || 0,
          runtime: "sqlite"
        };
      } catch (error) {
        return {
          total: 0,
          error: error?.message || String(error)
        };
      }
    });
    ipcMain.handle("get-leads-pool-stats", async (arg1, options = {}) => {
      try {
        await ensureDatabaseInitialized();
        if (!isLeadsSqliteRuntime()) {
          return {
            stats: {
              total: 0,
              likes: 0,
              replies: 0,
              messages: 0,
              follows: 0,
              touched: 0,
              untouched: 0,
              profileComments: 0
            },
            accountStats: [],
            runtime: "enc"
          };
        }
        const result = await dbManager.aggregateLeadsPoolStats(options.filters || {});
        return {
          ...result,
          runtime: "sqlite"
        };
      } catch (error) {
        console.error("[Main] get-leads-pool-stats failed:", error?.message || error);
        return {
          stats: {
            total: 0,
            likes: 0,
            replies: 0,
            messages: 0,
            follows: 0,
            touched: 0,
            untouched: 0,
            profileComments: 0
          },
          accountStats: [],
          error: error?.message || String(error)
        };
      }
    });
    ipcMain.handle("get-leads-filter-options", async () => {
      try {
        await ensureDatabaseInitialized();
        if (!isLeadsSqliteRuntime()) {
          return {
            accounts: [],
            keywords: [],
            locations: []
          };
        }
        return {
          accounts: typeof dbManager.listLeadAccountOptions === "function" ? dbManager.listLeadAccountOptions() : dbManager.listLeadAccountNames(),
          keywords: dbManager.listLeadSearchKeywords(),
          locations: dbManager.listLeadLocations()
        };
      } catch (error) {
        return {
          accounts: [],
          keywords: [],
          locations: []
        };
      }
    });
    ipcMain.handle("export-leads", async (arg1, options = {}) => {
      try {
        await ensureDatabaseInitialized();
        if (!isLeadsSqliteRuntime()) {
          return {
            success: false,
            error: "SQLite 线索库未就绪"
          };
        }
        const value = "leads_export_" + Date.now() + ".csv";
        const {
          canceled: canceled,
          filePath: filePath
        } = await dialog.showSaveDialog({
          title: "导出线索",
          defaultPath: value,
          filters: [{
            name: "CSV",
            extensions: ["csv"]
          }]
        });
        if (canceled || !filePath) {
          return {
            success: false,
            canceled: true
          };
        }
        const local = options.filters || {};
        const result = await dbManager.queryLeadsPage({
          offset: 0,
          limit: 100000,
          filters: local,
          forExport: true
        });
        const local2 = result.items || [];
        if (!local2.length) {
          return {
            success: false,
            error: "暂无数据可导出"
          };
        }
        const value2 = Array.isArray(options.fields) && options.fields.length ? options.fields : ["nickname", "content", "userUrl", "accountName", "entryLabel", "searchKeyword", "location", "isHighIntention", "capturedAt", "timestamp"];
        const local3 = value2;
        const local4 = arg1 => {
          if (arg1 == null) {
            return "";
          }
          const value = typeof arg1 === "string" ? arg1 : String(arg1);
          return "\"" + value.replace(/"/g, "\"\"") + "\"";
        };
        const list = [local3.join(",")];
        for (const item of local2) {
          list.push(local3.map(arg1 => local4(item[arg1])).join(","));
        }
        fs.writeFileSync(filePath, "﻿" + list.join("\n"), "utf8");
        return {
          success: true,
          path: filePath,
          count: local2.length
        };
      } catch (error) {
        console.error("[Main] export-leads failed:", error?.message || error);
        return {
          success: false,
          error: error?.message || String(error)
        };
      }
    });
    ipcMain.handle("query-leads-for-batch", async (arg1, options = {}) => {
      try {
        await ensureDatabaseInitialized();
        if (!isLeadsSqliteRuntime()) {
          return {
            items: [],
            total: 0
          };
        }
        const local = options.filters || {};
        const result = await dbManager.queryLeadsPage({
          offset: 0,
          limit: Math.min(50000, Number(options.limit) || 50000),
          filters: local,
          forBatch: true
        });
        const result2 = (result.items || []).filter(arg1 => arg1 && arg1.userUrl && arg1.leadKind !== "video_card");
        return {
          items: result2,
          total: result2.length
        };
      } catch (error) {
        console.error("[Main] query-leads-for-batch failed:", error?.message || error);
        return {
          items: [],
          total: 0,
          error: error?.message || String(error)
        };
      }
    });
    ipcMain.handle("get-leads-by-ids", async (arg1, options = {}) => {
      try {
        await ensureDatabaseInitialized();
        if (!isLeadsSqliteRuntime()) {
          return {
            items: [],
            total: 0,
            requested: 0
          };
        }
        const value = Array.isArray(options?.ids) ? options.ids : Array.isArray(options) ? options : [];
        const result = value.map(arg1 => String(arg1 || "").trim()).filter(Boolean);
        const result2 = (dbManager.listLeadsByIds(result, {
          limit: Math.min(100000, Number(options?.limit) || result.length || 1)
        }) || []).filter(arg1 => arg1 && arg1.leadKind !== "video_card");
        return {
          items: result2,
          total: result2.length,
          requested: result.length
        };
      } catch (error) {
        console.error("[Main] get-leads-by-ids failed:", error?.message || error);
        return {
          items: [],
          total: 0,
          requested: 0,
          error: error?.message || String(error)
        };
      }
    });
    ipcMain.handle("append-imported-leads", async (arg1, arg2) => {
      try {
        const result = (Array.isArray(arg2) ? arg2 : []).filter(arg1 => arg1 && arg1.userUrl);
        if (!result.length) {
          return false;
        }
        const result2 = result.some(arg1 => String(arg1.taskId || "").startsWith("import_csv") || String(arg1.source || "") === "import_csv");
        appendHistory(result, result2 ? "import_csv" : "import_uid", result2 ? "CSV导入" : "UID导入");
        return true;
      } catch (error) {
        console.error("[Main] append-imported-leads failed:", error?.message || error);
        return false;
      }
    });
    ipcMain.handle("delete-history-record", async (arg1, arg2) => {
      if (!fs.existsSync(historyFile)) {
        return false;
      }
      try {
        const value = Array.isArray(arg2) ? arg2 : [arg2];
        const result = fs.readFileSync(historyFile, "utf8");
        const result2 = crypto.createDecipheriv("aes-256-cbc", cryptoKey, cryptoIv);
        let result3 = result2.update(result, "hex", "utf8");
        result3 += result2.final("utf8");
        let result4 = JSON.parse(result3);
        const result5 = result4.filter(arg1 => !value.includes(arg1.taskId));
        const result6 = crypto.createCipheriv("aes-256-cbc", cryptoKey, cryptoIv);
        let result7 = result6.update(JSON.stringify(result5), "utf8", "hex");
        result7 += result6.final("hex");
        fs.writeFileSync(historyFile, result7);
        return true;
      } catch (error) {
        return false;
      }
    });
    ipcMain.handle("update-history-remark", async (arg1, {
      taskId: taskId,
      remark: remark
    }) => {
      if (!fs.existsSync(historyFile)) {
        return false;
      }
      try {
        const result = fs.readFileSync(historyFile, "utf8");
        const result2 = crypto.createDecipheriv("aes-256-cbc", cryptoKey, cryptoIv);
        let result3 = result2.update(result, "hex", "utf8");
        result3 += result2.final("utf8");
        let result4 = JSON.parse(result3);
        const result5 = result4.find(arg1 => arg1.taskId === taskId);
        if (result5) {
          result5.remark = remark;
          const result = crypto.createCipheriv("aes-256-cbc", cryptoKey, cryptoIv);
          let result2 = result.update(JSON.stringify(result4), "utf8", "hex");
          result2 += result.final("hex");
          fs.writeFileSync(historyFile, result2);
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    });
    ipcMain.handle("update-lead-in-history", async (arg1, {
      leadId: leadId,
      updates: updates
    }) => {
      if (isLeadsSqliteRuntime()) {
        try {
          let local = dbManager.getLeadById(leadId) || dbManager.getLeadByUserKey(leadId);
          if (!local && updates && typeof updates === "object") {
            const result = dbManager.findLeadRowId({
              ...updates,
              leadId: leadId,
              key: leadId
            });
            if (result) {
              local = dbManager.getLeadById(result);
            }
          }
          if (!local) {
            return false;
          }
          Object.assign(local, updates || {});
          return !!dbManager.upsertLead(local);
        } catch (error) {
          console.error("[Main] update-lead-in-history SQLite failed:", error?.message || error);
          return false;
        }
      }
      if (!fs.existsSync(historyFile)) {
        return false;
      }
      try {
        const result = fs.readFileSync(historyFile, "utf8");
        const result2 = crypto.createDecipheriv("aes-256-cbc", cryptoKey, cryptoIv);
        let result3 = result2.update(result, "hex", "utf8");
        result3 += result2.final("utf8");
        let result4 = JSON.parse(result3);
        let flag = false;
        result4.forEach(arg1 => {
          (arg1.items || []).forEach(arg1 => {
            if (!historyItemMatchesLeadId(arg1, leadId)) {
              return;
            }
            Object.assign(arg1, updates);
            flag = true;
          });
        });
        if (flag) {
          const result = crypto.createCipheriv("aes-256-cbc", cryptoKey, cryptoIv);
          let result2 = result.update(JSON.stringify(result4), "utf8", "hex");
          result2 += result.final("hex");
          fs.writeFileSync(historyFile, result2);
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    });
    ipcMain.handle("claim-processed-video", async (arg1, arg2) => {
      const result = getPlatformViews();
      const result2 = getViewSettingsMap();
      const local = [...result.entries()].find(([, arg12]) => arg12.webContents === arg1.sender)?.[0];
      const value = local ? result2.get(local) : null;
      if (value?.taskMode === "nurture") {
        return {
          claimed: true,
          key: "",
          reason: "nurture_skip"
        };
      }
      const result3 = normalizeProcessedVideoKey(arg2?.url || "");
      if (!result3) {
        return {
          claimed: false,
          reason: "invalid_url"
        };
      }
      if (inFlightProcessedVideos.has(result3)) {
        return {
          claimed: false,
          reason: "in_flight",
          key: result3
        };
      }
      let result4 = processedVideosAccess.listAll(store);
      const local2 = !!arg2?.forceReclaim && (value?.videoSources || []).includes("specific") && fn(value?.specifiedUrls).has(extractDouyinVideoId(result3));
      if (local2) {
        processedVideosAccess.removeByUrls(store, [result3]);
        result4 = processedVideosAccess.listAll(store);
      } else if (isVideoInProcessedStore(result3, result4)) {
        const result = result4.find(arg1 => processedVideoKeysMatch(arg1.url, result3));
        const value2 = Array.isArray(value?.scrapeTargets) ? value.scrapeTargets : [];
        const local = value?.taskMode === "scrape" && !value2.includes("comments") && (value2.includes("video") || value2.includes("author"));
        const local2 = value?.taskMode === "scrape" && value2.includes("author");
        const local3 = local && result?.recordType === "collected_link";
        const local4 = local2 && result?.recordType === "collected_link" && !result?.authorUrl;
        if (!local3 && !local4) {
          return {
            claimed: false,
            reason: "already_processed",
            key: result3
          };
        }
        processedVideosAccess.removeByUrls(store, [result3]);
        result4 = processedVideosAccess.listAll(store);
      }
      inFlightProcessedVideos.add(result3);
      try {
        const result = resolveProcessedVideoRecordMeta(value, arg2);
        processedVideosAccess.upsert(store, {
          url: result3,
          title: arg2?.title || "处理中",
          authorUrl: arg2?.authorUrl || "",
          authorNickname: arg2?.authorNickname || "",
          platform: arg2?.platform || "douyin",
          timestamp: Date.now(),
          ...result
        });
        broadcastProcessedVideoSync(result3);
        return {
          claimed: true,
          key: result3
        };
      } finally {
        inFlightProcessedVideos.delete(result3);
      }
    });
    ipcMain.handle("record-video-main-comment", async (arg1, arg2) => {
      const result = getPlatformViews();
      const result2 = getViewSettingsMap();
      const local = [...result.entries()].find(([, arg12]) => arg12.webContents === arg1.sender)?.[0];
      const value = local ? result2.get(local) : null;
      if (value?.taskMode === "nurture") {
        return {
          recorded: false,
          reason: "nurture_skip"
        };
      }
      const local2 = arg2?.accountId || value?.accountId || "default";
      const result3 = recordAccountVideoMainComment(local2, arg2);
      return {
        recorded: result3
      };
    });
    const accountVideoMainCommentsAccess = require("./accountVideoMainCommentsAccess");
    ipcMain.handle("get-video-main-comments", async (arg1, options = {}) => {
      try {
        await ensureDatabaseInitialized();
        return {
          success: true,
          ...accountVideoMainCommentsAccess.queryPage(store, options || {})
        };
      } catch (error) {
        return {
          success: false,
          items: [],
          total: 0,
          error: error?.message || String(error)
        };
      }
    });
    ipcMain.handle("remove-video-main-comments", async (arg1, options = {}) => {
      try {
        await ensureDatabaseInitialized();
        const value = Array.isArray(options?.items) ? options.items : Array.isArray(options?.keys) ? options.keys : [];
        const result = accountVideoMainCommentsAccess.removeMany(store, value);
        return {
          success: true,
          removed: result
        };
      } catch (error) {
        return {
          success: false,
          removed: 0,
          error: error?.message || String(error)
        };
      }
    });
    ipcMain.handle("clear-video-main-comments", async () => {
      try {
        await ensureDatabaseInitialized();
        const result = accountVideoMainCommentsAccess.clearAll(store);
        return {
          success: true,
          cleared: result
        };
      } catch (error) {
        return {
          success: false,
          cleared: 0,
          error: error?.message || String(error)
        };
      }
    });
    ipcMain.on("update-processed-videos", (arg1, arg2) => {
      const result = getPlatformViews();
      const result2 = getViewSettingsMap();
      const local = [...result.entries()].find(([, arg12]) => arg12.webContents === arg1.sender)?.[0];
      const value = local ? result2.get(local) : null;
      if (value?.taskMode === "nurture") {
        return;
      }
      const result3 = Date.now();
      const value2 = typeof arg2 === "string" ? {
        url: arg2,
        title: "历史扫描记录",
        timestamp: result3
      } : arg2;
      const result4 = normalizeProcessedVideoKey(value2?.url || "");
      if (!result4) {
        return;
      }
      const result5 = processedVideosAccess.findByUrl(store, result4);
      const local2 = value2.title || "历史扫描记录";
      const local3 = value2.platform || "douyin";
      const local4 = value2.timestamp || result3;
      const local5 = value2.authorUrl || "";
      const local6 = value2.authorNickname || "";
      const result6 = resolveProcessedVideoRecordMeta(value, value2);
      if (result5) {
        const obj = {
          recordType: result5.recordType === "collected_link" || result6.recordType === "collected_link" ? "collected_link" : result6.recordType,
          collectedTargets: [...new Set([...(result5.collectedTargets || []), ...(result6.collectedTargets || [])])]
        };
        const local = local2 && local2 !== "处理中" && local2 !== "历史扫描记录" && local2 !== "未知视频" && result5.title !== local2;
        const local7 = result5.recordType !== obj.recordType || JSON.stringify(result5.collectedTargets || []) !== JSON.stringify(obj.collectedTargets || []);
        const local8 = !!local5 && result5.authorUrl !== local5 || !!local6 && result5.authorNickname !== local6;
        if (local || local7 || local8) {
          processedVideosAccess.upsert(store, {
            ...result5,
            url: result4,
            title: local ? local2 : result5.title,
            authorUrl: local5 || result5.authorUrl || "",
            authorNickname: local6 || result5.authorNickname || "",
            platform: local3,
            timestamp: local4,
            ...obj
          });
        }
        return;
      }
      processedVideosAccess.upsert(store, {
        url: result4,
        title: local2,
        authorUrl: local5,
        authorNickname: local6,
        platform: local3,
        timestamp: local4,
        ...result6
      });
      broadcastProcessedVideoSync(result4);
    });
    ipcMain.handle("get-memory-list", async () => {
      const result = processedVideosAccess.listAll(store);
      console.log("[Main] [记忆读取] 返回 " + result.length + " 条记忆数据");
      return result.sort((arg1, arg2) => (arg2.timestamp || 0) - (arg1.timestamp || 0));
    });
    ipcMain.handle("delete-memory-items", async (arg1, arg2) => {
      const value = Array.isArray(arg2) ? arg2 : [arg2];
      processedVideosAccess.removeByUrls(store, value);
      broadcastForgetProcessedVideos(value);
      console.log("[Main] [记忆删除] 已删除 " + value.length + " 条记录");
      return {
        success: true
      };
    });
    ipcMain.handle("clear-all-memory", async () => {
      processedVideosAccess.clearAll(store);
      broadcastClearProcessedVideosCache();
      console.log("[Main] [记忆清空] 已重置所有扫描记忆");
      return {
        success: true
      };
    });
    ipcMain.handle("delete-leads-from-history", async (arg1, arg2) => {
      const result = (Array.isArray(arg2) ? arg2 : [arg2]).map(arg1 => arg1 == null ? "" : String(arg1)).filter(Boolean);
      if (!result.length) {
        return false;
      }
      if (isLeadsSqliteRuntime()) {
        try {
          const result2 = dbManager.deleteLeadsByIds(result);
          return result2 > 0;
        } catch (error) {
          console.error("[Main] delete-leads-from-history SQLite failed:", error?.message || error);
          return false;
        }
      }
      if (!fs.existsSync(historyFile)) {
        return false;
      }
      try {
        const set = new Set(result);
        const result2 = fs.readFileSync(historyFile, "utf8");
        const result3 = crypto.createDecipheriv("aes-256-cbc", cryptoKey, cryptoIv);
        let result4 = result3.update(result2, "hex", "utf8");
        result4 += result3.final("utf8");
        let result5 = JSON.parse(result4);
        let flag = false;
        result5.forEach(arg1 => {
          const value = (arg1.items || []).length;
          arg1.items = (arg1.items || []).filter(arg1 => {
            for (const item of set) {
              if (historyItemMatchesLeadId(arg1, item)) {
                return false;
              }
            }
            return true;
          });
          if (arg1.items.length !== value) {
            flag = true;
          }
        });
        const result6 = result5.filter(arg1 => arg1.items.length > 0 || arg1.remark && arg1.remark.trim() !== "");
        if (result6.length !== result5.length) {
          flag = true;
        }
        if (flag) {
          const result = crypto.createCipheriv("aes-256-cbc", cryptoKey, cryptoIv);
          let result2 = result.update(JSON.stringify(result6), "utf8", "hex");
          result2 += result.final("hex");
          fs.writeFileSync(historyFile, result2);
          return true;
        }
        return false;
      } catch (error) {
        console.error("[Main] delete-leads-from-history failed:", error?.message || error);
        return false;
      }
    });
    ipcMain.handle("delete-low-intention-leads", async () => {
      try {
        await ensureDatabaseInitialized();
        if (isLeadsSqliteRuntime()) {
          return {
            success: true,
            deleted: dbManager.deleteLowIntentionLeads()
          };
        }
        return {
          success: false,
          fallback: true
        };
      } catch (error) {
        return {
          success: false,
          error: error?.message || String(error)
        };
      }
    });
    ipcMain.handle("delete-touched-leads", async () => {
      try {
        await ensureDatabaseInitialized();
        if (isLeadsSqliteRuntime()) {
          return {
            success: true,
            deleted: dbManager.deleteTouchedLeads()
          };
        }
        return {
          success: false,
          fallback: true
        };
      } catch (error) {
        return {
          success: false,
          error: error?.message || String(error)
        };
      }
    });
    ipcMain.handle("delete-failed-batch-follow-leads", async () => {
      try {
        await ensureDatabaseInitialized();
        if (!isLeadsSqliteRuntime()) {
          return {
            success: false,
            error: "SQLite 线索库未就绪"
          };
        }
        return {
          success: true,
          deleted: dbManager.deleteFailedBatchFollowLeads()
        };
      } catch (error) {
        console.error("[Main] delete-failed-batch-follow-leads failed:", error?.message || error);
        return {
          success: false,
          error: error?.message || String(error)
        };
      }
    });
    ipcMain.handle("get-last-export-task-timestamp", () => {
      return store.get("last_export_task_timestamp") || 0;
    });
    ipcMain.handle("set-last-export-task-timestamp", (arg1, arg2) => {
      store.set("last_export_task_timestamp", arg2 || 0);
      return {
        success: true
      };
    });
    ipcMain.handle("delete-tasks", async (arg1, arg2) => {
      if (!fs.existsSync(historyFile)) {
        return {
          success: true
        };
      }
      try {
        const result = fs.readFileSync(historyFile, "utf8");
        const result2 = crypto.createDecipheriv("aes-256-cbc", cryptoKey, cryptoIv);
        let result3 = result2.update(result, "hex", "utf8");
        result3 += result2.final("utf8");
        let result4 = JSON.parse(result3);
        result4 = result4.filter(arg1 => !arg2.includes(arg1.taskId));
        const result5 = crypto.createCipheriv("aes-256-cbc", cryptoKey, cryptoIv);
        let result6 = result5.update(JSON.stringify(result4), "utf8", "hex");
        result6 += result5.final("hex");
        fs.writeFileSync(historyFile, result6);
        return {
          success: true
        };
      } catch (error) {
        console.error("删除任务失败", error);
        return {
          success: false,
          msg: error.message
        };
      }
    });
    ipcMain.handle("clear-all-history", async () => {
      try {
        if (isLeadsSqliteRuntime()) {
          dbManager.clearAllLeads();
          console.log("[Main] [历史清空] 已清空 SQLite 线索库");
          return true;
        }
        const result = crypto.createCipheriv("aes-256-cbc", cryptoKey, cryptoIv);
        let result2 = result.update(JSON.stringify([]), "utf8", "hex");
        result2 += result.final("hex");
        fs.writeFileSync(historyFile, result2);
        console.log("[Main] [历史清空] 已清空全部线索历史");
        return true;
      } catch (error) {
        console.error("清空历史记录失败", error);
        return false;
      }
    });
  }
  return {
    registerIpc: registerIpc,
    historyItemMatchesLeadId: historyItemMatchesLeadId,
    isVideoInProcessedStore: isVideoInProcessedStore,
    broadcastProcessedVideoSync: broadcastProcessedVideoSync,
    broadcastForgetProcessedVideos: broadcastForgetProcessedVideos,
    toCollectedVideoLeadKey: toCollectedVideoLeadKey,
    resolveProcessedVideoRecordMeta: resolveProcessedVideoRecordMeta
  };
}
module.exports = {
  registerLeadsHistoryIpc: registerLeadsHistoryIpc
};
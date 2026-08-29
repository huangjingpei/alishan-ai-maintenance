'use strict';

const fs = require("fs");
const crypto = require("crypto");
const {
  ipcMain
} = require("electron");
const dbManager = require("./dbManager");
const {
  normalizeProcessedVideoKey,
  extractDouyinVideoId
} = require("../shared/processedVideoKey");
const {
  toCollectedVideoKey,
  extractAuthorSecUid,
  toCollectedAuthorKey
} = require("../shared/collectedLeadKeys");
const processedVideosAccess = require("./processedVideosAccess");
function registerCollectedLibraryIpc(arg1) {
  const {
    store: store,
    ensureDatabaseInitialized: ensureDatabaseInitialized,
    isLeadsSqliteRuntime: isLeadsSqliteRuntime,
    HISTORY_FILE: historyFile,
    CRYPTO_KEY: cryptoKey,
    CRYPTO_IV: cryptoIv,
    getPlatformViews: getPlatformViews,
    inFlightProcessedVideos: inFlightProcessedVideos,
    historyManager: historyManager
  } = arg1;
  function broadcastForgetProcessedVideos(list = []) {
    const result = (Array.isArray(list) ? list : []).map(arg1 => String(arg1 || "").trim()).filter(Boolean);
    if (!result.length) {
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
  try {
    historyManager?.setProcessedVideosRemovedHandler?.(broadcastForgetProcessedVideos);
  } catch (error) {}
  function fn2(arg1, arg2) {
    if (arg2.length > 0) {
      processedVideosAccess.clearAuthorUrls(store, arg2);
    }
    if (arg1.length > 0) {
      processedVideosAccess.removeByUrls(store, arg1);
      broadcastForgetProcessedVideos(arg1);
    }
  }
  function fn3(arg1, arg2) {
    const list = [...arg1, ...arg2];
    return {
      videos: arg1,
      authors: arg2,
      tasks: [{
        taskId: "sqlite_collected",
        taskName: "采集库",
        timestamp: Date.now(),
        items: list
      }]
    };
  }
  function registerIpc() {
    ipcMain.handle("list-collected-video-import-keys", async () => {
      try {
        await ensureDatabaseInitialized();
        if (!isLeadsSqliteRuntime()) {
          return {
            keys: []
          };
        }
        const local = dbManager.listCollectedVideoImportKeys?.() || [];
        const list = [];
        for (const item of local) {
          if (item.videoId) {
            list.push(item.videoId);
          }
          const result = normalizeProcessedVideoKey(item.videoUrl || "");
          if (result) {
            list.push(result);
          }
          if (item.videoUrl) {
            list.push(String(item.videoUrl).trim());
          }
        }
        return {
          keys: [...new Set(list.filter(Boolean))]
        };
      } catch (error) {
        console.error("[Main] list-collected-video-import-keys failed:", error?.message || error);
        return {
          keys: []
        };
      }
    });
    ipcMain.handle("get-collected-videos-page", async (arg1, options = {}) => {
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
        const result2 = Math.max(1, Math.min(500, Number(options.pageSize) || Number(options.limit) || 50));
        const value = (result - 1) * result2;
        const result3 = dbManager.queryCollectedVideosPage({
          offset: value,
          limit: result2,
          keyword: options.keyword || options.search || ""
        });
        return {
          ...result3,
          page: result,
          pageSize: result2,
          runtime: "sqlite"
        };
      } catch (error) {
        console.error("[Main] get-collected-videos-page failed:", error?.message || error);
        return {
          items: [],
          total: 0,
          error: error?.message || String(error)
        };
      }
    });
    ipcMain.handle("get-collected-authors-page", async (arg1, options = {}) => {
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
        const result2 = Math.max(1, Math.min(500, Number(options.pageSize) || Number(options.limit) || 50));
        const value = (result - 1) * result2;
        const result3 = dbManager.queryCollectedAuthorsPage({
          offset: value,
          limit: result2,
          keyword: options.keyword || options.search || ""
        });
        return {
          ...result3,
          page: result,
          pageSize: result2,
          runtime: "sqlite"
        };
      } catch (error) {
        console.error("[Main] get-collected-authors-page failed:", error?.message || error);
        return {
          items: [],
          total: 0,
          error: error?.message || String(error)
        };
      }
    });
    ipcMain.handle("get-collected-videos-library", async () => {
      try {
        await ensureDatabaseInitialized();
        if (!isLeadsSqliteRuntime()) {
          return {
            items: []
          };
        }
        const result = dbManager.queryCollectedVideosPage({
          offset: 0,
          limit: 200
        });
        return {
          items: result.items,
          total: result.total,
          truncated: result.total > result.items.length
        };
      } catch (error) {
        console.error("[Main] get-collected-videos-library failed:", error?.message || error);
        return {
          items: []
        };
      }
    });
    ipcMain.handle("get-collected-authors-library", async () => {
      try {
        await ensureDatabaseInitialized();
        if (!isLeadsSqliteRuntime()) {
          return {
            items: []
          };
        }
        const result = dbManager.queryCollectedAuthorsPage({
          offset: 0,
          limit: 200
        });
        return {
          items: result.items,
          total: result.total,
          truncated: result.total > result.items.length
        };
      } catch (error) {
        console.error("[Main] get-collected-authors-library failed:", error?.message || error);
        return {
          items: []
        };
      }
    });
    ipcMain.handle("get-collected-link-library", async (arg1, options = {}) => {
      try {
        await ensureDatabaseInitialized();
        if (isLeadsSqliteRuntime()) {
          const result = Math.max(1, Math.min(500, Number(options.pageSize) || Number(options.limit) || 200));
          const result2 = String(options.keyword || options.search || "").trim();
          const result3 = dbManager.queryCollectedVideosPage({
            offset: 0,
            limit: result,
            keyword: result2
          });
          const result4 = dbManager.queryCollectedAuthorsPage({
            offset: 0,
            limit: result,
            keyword: result2
          });
          if (!dbManager.isCollectedSplitMigrationDone?.()) {
            const result2 = dbManager.listVideoCardLeads();
            const result3 = result2.filter(arg1 => {
              const value = Array.isArray(arg1.collectedFields) ? arg1.collectedFields : [];
              return value.includes("video") || value.length === 0;
            }).slice(0, result);
            const result4 = result2.filter(arg1 => Array.isArray(arg1.collectedFields) && arg1.collectedFields.includes("author")).slice(0, result);
            const result5 = fn3(result3, result4);
            return {
              videos: result5.videos,
              authors: result5.authors,
              tasks: result5.tasks,
              items: result5.tasks,
              truncated: true
            };
          }
          const result5 = fn3(result3.items, result4.items);
          return {
            videos: result5.videos,
            authors: result5.authors,
            tasks: result5.tasks,
            items: result5.tasks,
            videosTotal: result3.total,
            authorsTotal: result4.total,
            truncated: result3.total > result3.items.length || result4.total > result4.items.length
          };
        }
        if (!fs.existsSync(historyFile)) {
          return [];
        }
        const result = fs.readFileSync(historyFile, "utf8");
        const result2 = crypto.createDecipheriv("aes-256-cbc", cryptoKey, cryptoIv);
        let result3 = result2.update(result, "hex", "utf8");
        result3 += result2.final("utf8");
        return JSON.parse(result3);
      } catch (error) {
        console.error("[Main] get-collected-link-library failed:", error?.message || error);
        return [];
      }
    });
    ipcMain.handle("remove-collected-links-from-history", async (arg1, options = {}) => {
      const value = options.type === "author" ? "author" : "video";
      const set = new Set((Array.isArray(options.keys) ? options.keys : [options.keys]).map(arg1 => String(arg1 || "").trim()).filter(Boolean));
      if (set.size === 0) {
        return false;
      }
      const local = arg1 => {
        const result = String(arg1 || "").trim();
        if (!result) {
          return [];
        }
        const set = new Set([result]);
        const result2 = toCollectedVideoKey(result);
        if (result2) {
          set.add(result2);
          const result = result2.slice(6);
          set.add("https://www.douyin.com/video/" + result);
          const result3 = normalizeProcessedVideoKey("https://www.douyin.com/video/" + result);
          if (result3) {
            set.add(result3);
          }
        }
        const result3 = toCollectedAuthorKey(result);
        if (result3) {
          set.add(result3);
        }
        const result4 = extractAuthorSecUid(result);
        if (result4) {
          set.add(result4);
          set.add("author:" + result4);
        }
        const local = normalizeProcessedVideoKey(result) || "";
        if (local) {
          set.add(local);
        }
        return [...set].filter(Boolean);
      };
      const set2 = new Set();
      set.forEach(arg1 => local(arg1).forEach(arg1 => set2.add(arg1)));
      if (isLeadsSqliteRuntime()) {
        try {
          const list = [];
          const list2 = [];
          let flag = false;
          if (value === "video") {
            const result = [...set].map(arg1 => toCollectedVideoKey(arg1)).filter(Boolean);
            for (const item of result) {
              const local2 = dbManager.listCollectedVideos().find(arg1 => local(arg1.leadId || arg1.videoUrl).some(arg1 => set2.has(arg1))) || dbManager.listCollectedVideos().find(arg1 => String(arg1.leadId) === item);
              const result = normalizeProcessedVideoKey(local2?.videoUrl || local2?.url || item);
              if (result) {
                list.push(result);
              }
            }
            const result2 = dbManager.deleteCollectedVideosByKeys([...set]);
            if (result2 > 0) {
              flag = true;
            }
            try {
              dbManager.deleteEntityLeadgenVideoCardsByKeys(result);
            } catch (error) {
              console.warn("[Main] 清理线索采集视频明细失败:", error?.message || error);
            }
          } else {
            const result = dbManager.deleteCollectedAuthorsByKeys([...set]);
            if (result > 0) {
              flag = true;
            }
            for (const item of set) {
              const result = extractAuthorSecUid(item);
              if (!result) {
                continue;
              }
              const result2 = dbManager.listCollectedVideos().filter(arg1 => extractAuthorSecUid(arg1.authorProfileUrl || arg1.userUrl) === result);
              for (const item of result2) {
                const result = normalizeProcessedVideoKey(item.videoUrl || item.url || "");
                if (result) {
                  list2.push(result);
                }
              }
            }
          }
          if (!dbManager.isCollectedSplitMigrationDone?.()) {
            const result = dbManager.listVideoCardLeads();
            const list3 = [];
            for (const item of result) {
              const set3 = new Set(Array.isArray(item.collectedFields) ? item.collectedFields : []);
              const result = String(item.leadId || item.key || "");
              const result2 = extractAuthorSecUid(item.authorProfileUrl || item.userUrl || "");
              const value2 = value === "video" ? local(result).concat(local(item.videoUrl || item.url || "")).some(arg1 => set2.has(arg1)) : set.has(result2) || set.has("author:" + result2);
              if (!value2) {
                continue;
              }
              set3.delete(value);
              flag = true;
              if (value === "author") {
                item.authorProfileUrl = "";
                item.userUrl = "";
              }
              const result3 = normalizeProcessedVideoKey(item.videoUrl || item.url || result);
              if (value === "video" && result3) {
                list.push(result3);
              } else if (value === "author" && result3) {
                list2.push(result3);
              }
              if (set3.size > 0) {
                item.collectedFields = [...set3];
                dbManager.upsertLead(item);
                if (value === "video" && set3.has("author") === false) {
                  list3.push(item.leadId || item.key);
                }
              } else {
                list3.push(item.leadId || item.key || result);
              }
            }
            if (list3.length) {
              dbManager.deleteLeadsByIds([...new Set(list3.map(String).filter(Boolean))]);
            }
          }
          if (!flag) {
            return false;
          }
          fn2(list, list2);
          return true;
        } catch (error) {
          console.error("[Main] 批量删除采集链接(SQLite)失败:", error);
          return false;
        }
      }
      if (!historyFile || !fs.existsSync(historyFile)) {
        return false;
      }
      try {
        const result = fs.readFileSync(historyFile, "utf8");
        const result2 = crypto.createDecipheriv("aes-256-cbc", cryptoKey, cryptoIv);
        let result3 = result2.update(result, "hex", "utf8");
        result3 += result2.final("utf8");
        let result4 = JSON.parse(result3);
        let flag = false;
        const list = [];
        const list2 = [];
        const local2 = arg1 => extractAuthorSecUid(arg1);
        result4.forEach(arg1 => {
          const list3 = [];
          (Array.isArray(arg1.items) ? arg1.items : []).forEach(arg1 => {
            if (arg1?.leadKind !== "video_card") {
              list3.push(arg1);
              return;
            }
            const set3 = new Set(Array.isArray(arg1.collectedFields) ? arg1.collectedFields : []);
            const result = String(arg1.leadId || arg1.key || normalizeProcessedVideoKey(arg1.videoUrl || arg1.url || ""));
            const result2 = local2(arg1.authorProfileUrl || arg1.userUrl || "");
            const value2 = value === "video" ? local(result).concat(local(arg1.videoUrl || arg1.url || "")).some(arg1 => set2.has(arg1)) : set.has(result2) || set.has("author:" + result2);
            if (!value2) {
              list3.push(arg1);
              return;
            }
            set3.delete(value);
            flag = true;
            if (value === "author") {
              arg1.authorProfileUrl = "";
              arg1.userUrl = "";
            }
            const result3 = normalizeProcessedVideoKey(arg1.videoUrl || arg1.url || result);
            if ((value === "video" || set3.size === 0) && result3) {
              list.push(result3);
            } else if (value === "author" && result3) {
              list2.push(result3);
            }
            if (set3.size > 0) {
              arg1.collectedFields = [...set3];
              list3.push(arg1);
            }
          });
          arg1.items = list3;
        });
        if (!flag) {
          return false;
        }
        result4 = result4.filter(arg1 => arg1.items.length > 0 || String(arg1.remark || "").trim());
        const result5 = crypto.createCipheriv("aes-256-cbc", cryptoKey, cryptoIv);
        let result6 = result5.update(JSON.stringify(result4), "utf8", "hex");
        result6 += result5.final("hex");
        fs.writeFileSync(historyFile, result6);
        fn2(list, list2);
        return true;
      } catch (error) {
        console.error("[Main] 批量删除采集链接(enc)失败:", error);
        return false;
      }
    });
    ipcMain.handle("clear-collected-library", async (arg1, options = {}) => {
      const value = options.type === "author" ? "author" : "video";
      try {
        ensureDatabaseInitialized();
        if (!isLeadsSqliteRuntime()) {
          return {
            success: false,
            error: "sqlite_required",
            deleted: 0
          };
        }
        const list = [];
        const list2 = [];
        let num = 0;
        if (value === "video") {
          for (const item of dbManager.listCollectedVideoUrls?.() || []) {
            const result = normalizeProcessedVideoKey(item);
            if (result) {
              list.push(result);
            }
          }
          num = dbManager.clearAllCollectedVideos();
          try {
            dbManager.clearAllEntityLeadgenVideoCards();
          } catch (error) {
            console.warn("[Main] 清空线索采集视频明细失败:", error?.message || error);
          }
          if (!dbManager.isCollectedSplitMigrationDone?.()) {
            const local = dbManager.listVideoCardLeads() || [];
            const list2 = [];
            for (const item of local) {
              const set = new Set(Array.isArray(item.collectedFields) ? item.collectedFields : []);
              if (!set.has("video") && item.leadKind !== "video_card") {
                continue;
              }
              set.delete("video");
              const result = normalizeProcessedVideoKey(item.videoUrl || item.url || item.leadId || "");
              if (result) {
                list.push(result);
              }
              if (set.size > 0) {
                item.collectedFields = [...set];
                dbManager.upsertLead(item);
              } else {
                list2.push(item.leadId || item.key);
              }
            }
            if (list2.length) {
              dbManager.deleteLeadsByIds([...new Set(list2.map(String).filter(Boolean))]);
            }
          }
        } else {
          for (const item of dbManager.listCollectedVideoUrls?.() || []) {
            const result = normalizeProcessedVideoKey(item);
            if (result) {
              list2.push(result);
            }
          }
          num = dbManager.clearAllCollectedAuthors();
          try {
            dbManager.stripAuthorTargetFromEntityLeadgenVideoCards();
          } catch (error) {
            console.warn("[Main] 剥离线索采集主页标记失败:", error?.message || error);
          }
          if (!dbManager.isCollectedSplitMigrationDone?.()) {
            const local = dbManager.listVideoCardLeads() || [];
            for (const item of local) {
              const set = new Set(Array.isArray(item.collectedFields) ? item.collectedFields : []);
              if (!set.has("author")) {
                continue;
              }
              set.delete("author");
              item.authorProfileUrl = "";
              item.userUrl = "";
              item.collectedFields = set.size ? [...set] : ["video"];
              const result = normalizeProcessedVideoKey(item.videoUrl || item.url || item.leadId || "");
              if (result) {
                list2.push(result);
              }
              dbManager.upsertLead(item);
            }
          }
        }
        fn2([...new Set(list.filter(Boolean))], [...new Set(list2.filter(Boolean))]);
        return {
          success: true,
          deleted: num,
          type: value
        };
      } catch (error) {
        console.error("[Main] 清空采集库失败:", error);
        return {
          success: false,
          error: error?.message || String(error),
          deleted: 0
        };
      }
    });
    ipcMain.handle("restore-leads-collected-split", async (arg1, options = {}) => {
      try {
        ensureDatabaseInitialized();
        return dbManager.restoreLeadsCollectedSplitFromBackup(options?.backupPath || "");
      } catch (error) {
        return {
          success: false,
          error: error?.message || String(error)
        };
      }
    });
  }
  return {
    registerIpc: registerIpc,
    broadcastForgetProcessedVideos: broadcastForgetProcessedVideos
  };
}
module.exports = {
  registerCollectedLibraryIpc: registerCollectedLibraryIpc
};
'use strict';

const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const {
  app
} = require("electron");
const HISTORY_FILE = path.join(app.getPath("userData"), "huoke_history.enc");
const CRYPTO_KEY = crypto.scryptSync("huoke-radar-secret-v1", "salt", 32);
const CRYPTO_IV = Buffer.alloc(16, 0);
function createHistoryAppend(arg1) {
  const {
    reporting: reporting,
    getActiveSettings: getActiveSettings,
    getViewSettingsMap: getViewSettingsMap,
    getLeadDedupKey: getLeadDedupKey,
    markCollectedLinkVideoRecords: markCollectedLinkVideoRecords,
    isLeadsSqliteRuntime: isLeadsSqliteRuntime,
    readHistoryRecords: readHistoryRecords,
    dbManager: dbManager,
    leadUserKey: leadUserKey
  } = arg1;
  function addToReportQueue(arg1, arg2 = null) {
    const result = getActiveSettings();
    const result2 = getViewSettingsMap();
    let local = result;
    if (arg2) {
      local = result2.get(arg2) || result;
      const result3 = result2.get(arg2 + "_nickname");
      if (result3) {
        local = {
          ...(local || {}),
          nickname: result3
        };
      }
    } else if (arg1.length > 0 && arg1[0].accountId) {
      const text = "douyin";
      const value = arg1[0].accountId === "default" ? text : text + "_" + arg1[0].accountId;
      local = result2.get(value) || result;
      const result3 = result2.get(value + "_nickname");
      if (result3) {
        local = {
          ...(local || {}),
          nickname: result3
        };
      }
    }
    reporting.add(arg1, local);
  }
  function appendHistoryToEnc(arg1, text = "unknown_task", text2 = "未命名任务") {
    let list = [];
    if (fs.existsSync(HISTORY_FILE)) {
      try {
        const result = fs.readFileSync(HISTORY_FILE, "utf8");
        const result2 = crypto.createDecipheriv("aes-256-cbc", CRYPTO_KEY, CRYPTO_IV);
        let result3 = result2.update(result, "hex", "utf8");
        result3 += result2.final("utf8");
        list = JSON.parse(result3);
      } catch (error) {
        console.error("History parse error", error);
      }
    }
    const set = new Set();
    const map = new Map();
    list.forEach(arg1 => {
      if (arg1.items) {
        arg1.items.forEach(arg1 => {
          const result = getLeadDedupKey(arg1);
          if (result) {
            set.add(result);
            if (!map.has(result)) {
              map.set(result, arg1);
            }
          }
        });
      }
    });
    let result = list.find(arg1 => arg1.taskId === text);
    if (!result) {
      result = {
        taskId: text,
        taskName: text2,
        timestamp: Date.now(),
        platform: arg1[0]?.platform || "DY",
        accountName: arg1[0]?.accountName || "未知账号",
        items: [],
        stats: {
          videoTotal: 0
        }
      };
      list.unshift(result);
    }
    let num = 0;
    for (const item of arg1) {
      const result2 = getLeadDedupKey(item);
      if (result2) {
        item.leadId = result2;
        item.key = result2;
      }
      const value = result2 ? map.get(result2) : null;
      const value2 = !result2 ? result.items.find(arg1 => !getLeadDedupKey(arg1)) : null;
      if (value) {
        leadUserKey.mergeLeadRecords(value, item);
        num++;
      } else if (value2) {
        leadUserKey.mergeLeadRecords(value2, item);
        num++;
      } else if (!set.has(result2)) {
        result.items.unshift(item);
        set.add(result2);
        if (result2) {
          map.set(result2, item);
        }
        num++;
      }
    }
    markCollectedLinkVideoRecords(arg1);
    if (num === 0) {
      return;
    }
    console.log("[Main] [数据同步] 任务 " + text + " 历史记录已更新(enc), 变更项: " + num);
    const num2 = 500;
    if (list.length > num2) {
      list = list.slice(0, num2);
    }
    try {
      const result = crypto.createCipheriv("aes-256-cbc", CRYPTO_KEY, CRYPTO_IV);
      let result2 = result.update(JSON.stringify(list), "utf8", "hex");
      result2 += result.final("hex");
      fs.writeFileSync(HISTORY_FILE, result2);
    } catch (error) {
      console.error("History save error", error);
    }
  }
  function appendHistory(arg1, text = "unknown_task", text2 = "未命名任务", options = {}) {
    const value = Array.isArray(arg1) ? arg1.filter(Boolean) : [];
    if (!value.length) {
      return 0;
    }
    const value2 = options.updateOnly === true;
    for (const item of value) {
      const result = getLeadDedupKey(item);
      if (result) {
        item.leadId = result;
        item.key = result;
      }
      if (!item.taskId) {
        item.taskId = text;
      }
      if (!item.taskName) {
        item.taskName = text2;
      }
      if (item.timestamp == null) {
        item.timestamp = Date.now();
      }
      if (!item.capturedAt) {
        item.capturedAt = new Date().toISOString();
      }
    }
    markCollectedLinkVideoRecords(value);
    if (isLeadsSqliteRuntime()) {
      try {
        const list = [];
        const list2 = [];
        for (const item of value) {
          if (dbManager.isVideoCardLeadLike?.(item) || item?.leadKind === "video_card" || item?.sourceType === "video" || item?.identityType === "video" || item?.leadKind === "collected_author" || item?.leadKind === "collected_video" || /^video:\d{10,}$/.test(String(item?.leadId || item?.key || "")) || /^author:/.test(String(item?.leadId || item?.key || ""))) {
            list2.push(item);
          } else {
            list.push(item);
          }
        }
        let num = 0;
        if (list.length) {
          num += dbManager.upsertLeadsBatch(list, {
            mergeFn: (arg1, arg2) => leadUserKey.mergeLeadRecords(arg1, arg2),
            updateOnly: value2
          });
        }
        if (list2.length) {
          num += dbManager.upsertLeadsBatch(list2, {
            mergeFn: (arg1, arg2) => leadUserKey.mergeLeadRecords(arg1, arg2),
            updateOnly: value2
          });
        }
        console.log("[Main] [数据同步] 任务 " + text + " 线索已" + (value2 ? "更新" : "写入") + " SQLite" + (" (人:" + list.length + " 采集:" + list2.length + "), 变更项: " + num));
        return num;
      } catch (error) {
        console.error("[Main] SQLite appendHistory 失败，回退 enc:", error?.message || error);
      }
    }
    if (value2) {
      try {
        const result = readHistoryRecords();
        let num = 0;
        for (const item of value) {
          const result2 = getLeadDedupKey(item);
          let local = null;
          for (const item2 of result) {
            for (const item3 of item2.items || []) {
              const result = getLeadDedupKey(item3);
              if (result2 && result && result2 === result || item3.leadId && item.leadId && item3.leadId === item.leadId) {
                local = item3;
                break;
              }
            }
            if (local) {
              break;
            }
          }
          if (!local) {
            continue;
          }
          leadUserKey.mergeLeadRecords(local, item);
          num += 1;
        }
        if (num > 0) {}
        return num;
      } catch (error) {
        return 0;
      }
    }
    appendHistoryToEnc(value, text, text2);
    return value.length;
  }
  return {
    addToReportQueue: addToReportQueue,
    appendHistory: appendHistory,
    appendHistoryToEnc: appendHistoryToEnc
  };
}
module.exports = {
  createHistoryAppend: createHistoryAppend
};
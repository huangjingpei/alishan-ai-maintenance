const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const dbManager = require("./dbManager");
const V2_MIGRATION = "v2_full_leads_migration";
const V3_MIGRATION = "v3_leads_runtime_cutover";
const V3B_MIGRATION = "v3b_leads_enc_rebuild_dedupe";
const V4_MIGRATION = "v4_entity_leadgen_sqlite";
const ENTITY_LEADGEN_ENC = "entity_leadgen_tasks.enc";
function readEncryptedFile(arg1) {
  if (!fs.existsSync(arg1)) {
    return null;
  }
  try {
    const result = crypto.scryptSync("huoke-radar-secret-v1", "salt", 32);
    const result2 = Buffer.alloc(16, 0);
    const result3 = fs.readFileSync(arg1, "utf8");
    if (!result3) {
      return null;
    }
    const result4 = crypto.createDecipheriv("aes-256-cbc", result, result2);
    let result5 = result4.update(result3, "hex", "utf8");
    result5 += result4.final("utf8");
    return JSON.parse(result5);
  } catch (error) {
    console.warn("[DB-Migration] 解密文件 [" + arg1 + "] 失败:", error.message);
    return null;
  }
}
function ensureBackupsDir(arg1) {
  const result = path.join(arg1, "backups");
  try {
    if (!fs.existsSync(result)) {
      fs.mkdirSync(result, {
        recursive: true
      });
    }
  } catch (error) {
    console.warn("[DB-Migration] 创建备份文件夹失败:", error.message);
  }
  return result;
}
function flattenHistoryLeads(arg1) {
  const list = [];
  if (!Array.isArray(arg1)) {
    return list;
  }
  for (const item of arg1) {
    if (Array.isArray(item?.items)) {
      for (const item2 of item.items) {
        if (!item2 || typeof item2 !== "object") {
          continue;
        }
        const obj = {
          ...item2,
          taskId: item2.taskId || item.taskId,
          taskName: item2.taskName || item.taskName
        };
        list.push(obj);
      }
    } else if (item && typeof item === "object" && (item.nickname || item.content || item.userUrl)) {
      list.push(item);
    }
  }
  return list;
}
function mergeLeadsByUserKey(arg1) {
  let local;
  try {
    local = require("../shared/leadUserKey");
  } catch (error) {
    console.error("[DB-Migration] 无法加载 leadUserKey:", error.message);
    return arg1.filter(Boolean);
  }
  const map = new Map();
  const list = [];
  for (const item of arg1) {
    if (!item || typeof item !== "object") {
      continue;
    }
    const result = local.getLeadUserKey(item);
    if (!result) {
      const result = String(item.leadId || item.key || "").trim();
      if (result) {
        item.leadId = result;
        item.key = result;
      } else {
        item.leadId = item.leadId || "nokey_" + list.length + "_" + Date.now();
        item.key = item.leadId;
      }
      list.push(item);
      continue;
    }
    item.leadId = result;
    item.key = result;
    const result2 = map.get(result);
    if (result2) {
      local.mergeLeadRecords(result2, item);
    } else {
      map.set(result, item);
    }
  }
  return [...map.values(), ...list];
}
function runV2MigrationIfNeeded(arg1, arg2, arg3) {
  if (dbManager.isMigrationExecuted(V2_MIGRATION)) {
    return true;
  }
  console.log("[DB-Migration] 正在检测并安全迁移旧 JSON 数据到 SQLite (v2)...");
  let num = 0;
  try {
    if (arg2 && typeof arg2.get === "function") {
      const result = arg2.get("accounts", []);
      if (Array.isArray(result) && result.length > 0) {
        console.log("[DB-Migration] 发现旧账号池记录 " + result.length + " 条，写入 SQLite...");
        dbManager.saveAccountPool(result);
        num++;
      }
      const result2 = arg2.get("processed_videos_detail", []);
      if (Array.isArray(result2) && result2.length > 0) {
        console.log("[DB-Migration] 发现旧视频明细记录 " + result2.length + " 条，写入 SQLite...");
        dbManager.saveProcessedVideosDetail(result2);
        num++;
      }
      const result3 = arg2.get("monitor_notified_keys", []);
      if (Array.isArray(result3) && result3.length > 0) {
        console.log("[DB-Migration] 发现旧监控 Hash 记录 " + result3.length + " 条，写入 SQLite...");
        dbManager.saveMonitorNotifiedKeys(result3);
        num++;
      }
      const local = arg2.get("task_config") || {};
      const value = Array.isArray(local.personas) ? local.personas : [];
      if (value.length > 0) {
        console.log("[DB-Migration] 发现旧 AI 智能体/人设配置 " + value.length + " 个，写入 SQLite...");
        dbManager.saveAiAgentsBatch(value);
        num++;
      }
    }
    const result = path.join(arg1, "huoke_history.enc");
    if (fs.existsSync(result)) {
      console.log("[DB-Migration] 发现历史线索加密库 [huoke_history.enc]，正在解密并写入 SQLite (v2 粗导入)...");
      const result2 = readEncryptedFile(result);
      const result3 = flattenHistoryLeads(result2);
      if (result3.length > 0) {
        console.log("[DB-Migration] 共解密出 " + result3.length + " 条历史线索，开始批量写入 SQLite...");
        const result2 = dbManager.saveLeadsBatch(result3);
        console.log("[DB-Migration] 已成功将 " + result2 + " 条线索写入 SQLite 数据库！");
        num++;
        try {
          const result2 = path.join(arg3, "huoke_history_" + Date.now() + ".enc.bak");
          fs.copyFileSync(result, result2);
          console.log("[DB-Migration] 历史线索库已备份归档至: " + result2);
        } catch (error) {
          console.warn("[DB-Migration] 备份 huoke_history.enc 失败:", error.message);
        }
      }
    }
    const result2 = path.join(arg1, "config.json");
    if (fs.existsSync(result2)) {
      try {
        const result = path.join(arg3, "config_" + Date.now() + ".json.bak");
        fs.copyFileSync(result2, result);
      } catch (error) {}
    }
    const result3 = path.join(arg1, "auth_record.json");
    if (fs.existsSync(result3)) {
      try {
        const result = path.join(arg3, "auth_record_" + Date.now() + ".json.bak");
        fs.copyFileSync(result3, result);
      } catch (error) {}
    }
    dbManager.recordMigration(V2_MIGRATION);
    console.log("[DB-Migration] v2 迁移完成，共迁移 " + num + " 个核心数据模块。");
    return true;
  } catch (error) {
    console.error("[DB-Migration] v2 迁移异常:", error);
    return false;
  }
}
function runV3LeadsCutoverIfNeeded(arg1) {
  if (dbManager.isMigrationExecuted(V3_MIGRATION)) {
    console.log("[DB-Migration] v3 线索运行时切流已完成，跳过");
    return {
      ok: true,
      already: true
    };
  }
  console.log("[DB-Migration] 开始 v3 线索完好迁移（按用户键合并）…");
  dbManager.ensureLeadSchemaColumns?.();
  const result = path.join(arg1, "huoke_history.enc");
  const result2 = ensureBackupsDir(arg1);
  try {
    let list = [];
    if (fs.existsSync(result)) {
      const result2 = readEncryptedFile(result);
      if (result2 == null) {
        return {
          ok: false,
          error: "无法解密 huoke_history.enc"
        };
      }
      const result3 = flattenHistoryLeads(result2);
      console.log("[DB-Migration] v3 展平线索 " + result3.length + " 条，开始按用户键合并…");
      list = mergeLeadsByUserKey(result3);
      console.log("[DB-Migration] v3 合并后唯一线索 " + list.length + " 条");
    } else {
      const result = dbManager.getLeadsCount({
        includeVideoCards: true
      });
      console.log("[DB-Migration] 未找到 huoke_history.enc，沿用 SQLite 现有 " + result + " 条线索");
      try {
        const result = dbManager.getAllLeadsRaw();
        if (result.length > 0) {
          const leadUserKey = require("../shared/leadUserKey");
          const result2 = mergeLeadsByUserKey(result);
          dbManager.clearAllLeads();
          dbManager.upsertLeadsBatch(result2, {
            mergeFn: (arg1, arg2) => leadUserKey.mergeLeadRecords(arg1, arg2)
          });
          console.log("[DB-Migration] 无 enc：已按用户键重规范化 " + result2.length + " 条");
        }
      } catch (error) {
        console.warn("[DB-Migration] 无 enc 重规范化失败，继续以现库切流:", error.message);
      }
      const result2 = dbManager.getLeadsCount({
        includeVideoCards: true
      });
      dbManager.recordMigration(V3_MIGRATION);
      try {
        fs.writeFileSync(path.join(arg1, "huoke_history.enc.migrated"), String(Date.now()));
      } catch (error) {}
      return {
        ok: true,
        uniqueCount: result2,
        dbCount: result2
      };
    }
    if (list.length > 0) {
      const result = dbManager.clearAllLeads();
      console.log("[DB-Migration] v3 重建前已清空 leads " + result + " 条（以 enc 合并结果为准）");
      const leadUserKey = require("../shared/leadUserKey");
      const result2 = dbManager.upsertLeadsBatch(list, {
        mergeFn: (arg1, arg2) => leadUserKey.mergeLeadRecords(arg1, arg2)
      });
      console.log("[DB-Migration] v3 upsert 写入 " + result2 + " 条");
    }
    const result3 = dbManager.getLeadsCount({
      includeVideoCards: true
    });
    const value = list.length;
    if (value > 0) {
      if (result3 < Math.floor(value * 0.98) || result3 > Math.ceil(value * 1.02) + 5) {
        const value2 = "校验失败：合并 " + value + " 条，库内 " + result3 + " 条";
        console.error("[DB-Migration] " + value2);
        return {
          ok: false,
          error: value2,
          uniqueCount: value,
          dbCount: result3
        };
      }
    }
    if (list.length > 0) {
      const value2 = list[Math.min(3, list.length - 1)];
      const local = value2.leadId || value2.key;
      const result = dbManager.getLeadById(local);
      if (!result) {
        return {
          ok: false,
          error: "抽样校验失败：库中找不到 " + local,
          uniqueCount: value,
          dbCount: result3
        };
      }
    }
    try {
      if (fs.existsSync(result)) {
        const result3 = path.join(result2, "huoke_history_v3_" + Date.now() + ".enc.bak");
        fs.copyFileSync(result, result3);
        console.log("[DB-Migration] v3 已备份 enc → " + result3);
      }
      fs.writeFileSync(path.join(arg1, "huoke_history.enc.migrated"), String(Date.now()));
    } catch (error) {
      console.warn("[DB-Migration] v3 备份/标记失败:", error.message);
    }
    dbManager.recordMigration(V3_MIGRATION);
    console.log("[DB-Migration] v3 线索运行时切流成功：唯一 " + value + "，库内 " + result3);
    return {
      ok: true,
      uniqueCount: value,
      dbCount: result3
    };
  } catch (error) {
    console.error("[DB-Migration] v3 迁移异常:", error);
    return {
      ok: false,
      error: error.message || String(error)
    };
  }
}
function runV3bLeadsDedupeRebuildIfNeeded(arg1) {
  if (dbManager.isMigrationExecuted(V3B_MIGRATION)) {
    return {
      ok: true,
      already: true
    };
  }
  if (!dbManager.isMigrationExecuted(V3_MIGRATION)) {
    return {
      ok: true,
      skipped: true
    };
  }
  console.log("[DB-Migration] 开始 v3b 线索去重重建…");
  const result = path.join(arg1, "huoke_history.enc");
  const result2 = ensureBackupsDir(arg1);
  try {
    dbManager.ensureLeadSchemaColumns?.();
    let list = [];
    if (fs.existsSync(result)) {
      const result2 = readEncryptedFile(result);
      if (result2 == null) {
        console.warn("[DB-Migration] v3b 无法解密 enc，改为仅规范化现库");
      } else {
        list = mergeLeadsByUserKey(flattenHistoryLeads(result2));
      }
    }
    const leadUserKey = require("../shared/leadUserKey");
    if (list.length > 0) {
      const result3 = dbManager.getLeadsCount({
        includeVideoCards: true
      });
      dbManager.clearAllLeads();
      const result4 = dbManager.upsertLeadsBatch(list, {
        mergeFn: (arg1, arg2) => leadUserKey.mergeLeadRecords(arg1, arg2)
      });
      const result5 = dbManager.getLeadsCount({
        includeVideoCards: true
      });
      console.log("[DB-Migration] v3b enc 重建：前 " + result3 + " → 写入 " + result4 + " → 后 " + result5 + "（合并唯一 " + list.length + "）");
      if (result5 < Math.floor(list.length * 0.98)) {
        return {
          ok: false,
          error: "v3b 校验失败：合并 " + list.length + "，库内 " + result5
        };
      }
      try {
        const result3 = path.join(result2, "huoke_history_v3b_" + Date.now() + ".enc.bak");
        fs.copyFileSync(result, result3);
      } catch (error) {}
    } else {
      const result = dbManager.getAllLeadsRaw();
      const result2 = mergeLeadsByUserKey(result);
      if (result2.length > 0 && result2.length < result.length) {
        dbManager.clearAllLeads();
        dbManager.upsertLeadsBatch(result2, {
          mergeFn: (arg1, arg2) => leadUserKey.mergeLeadRecords(arg1, arg2)
        });
        console.log("[DB-Migration] v3b 现库去重：" + result.length + " → " + result2.length);
      } else if (result2.length > 0) {
        dbManager.clearAllLeads();
        dbManager.upsertLeadsBatch(result2, {
          mergeFn: (arg1, arg2) => leadUserKey.mergeLeadRecords(arg1, arg2)
        });
        console.log("[DB-Migration] v3b 现库主键规范化：" + result2.length + " 条");
      }
    }
    dbManager.recordMigration(V3B_MIGRATION);
    return {
      ok: true
    };
  } catch (error) {
    console.error("[DB-Migration] v3b 异常:", error);
    return {
      ok: false,
      error: error.message || String(error)
    };
  }
}
function runV4EntityLeadgenCutoverIfNeeded(arg1) {
  if (dbManager.isMigrationExecuted(V4_MIGRATION)) {
    console.log("[DB-Migration] v4 线索采集任务已切流 SQLite，跳过");
    return {
      ok: true,
      already: true
    };
  }
  console.log("[DB-Migration] 开始 v4 线索采集任务完好迁移…");
  const result = path.join(arg1, ENTITY_LEADGEN_ENC);
  const result2 = ensureBackupsDir(arg1);
  const {
    normalizeEntityLeadgenTaskForMigration: normalizeEntityLeadgenTaskForMigration
  } = require("./entityLeadgenTasks");
  try {
    let list = [];
    if (fs.existsSync(result)) {
      const result2 = readEncryptedFile(result);
      if (result2 == null) {
        return {
          ok: false,
          error: "无法解密 entity_leadgen_tasks.enc"
        };
      }
      if (!Array.isArray(result2)) {
        return {
          ok: false,
          error: "entity_leadgen_tasks.enc 内容不是数组"
        };
      }
      list = result2.map(arg1 => normalizeEntityLeadgenTaskForMigration(arg1));
      console.log("[DB-Migration] v4 解密任务 " + list.length + " 个");
    } else {
      console.log("[DB-Migration] v4 未找到 entity_leadgen_tasks.enc，以空库切流");
    }
    const result3 = dbManager.getEntityLeadgenTasksCount();
    if (!list.length && result3 > 0) {
      dbManager.recordMigration(V4_MIGRATION);
      try {
        fs.writeFileSync(path.join(arg1, ENTITY_LEADGEN_ENC + ".migrated"), String(Date.now()));
      } catch (error) {}
      return {
        ok: true,
        taskCount: result3,
        leadCount: 0
      };
    }
    const result4 = list.reduce((arg1, arg2) => arg1 + (Array.isArray(arg2.leads) ? arg2.leads.length : 0), 0);
    let num = 0;
    let num2 = 0;
    const result5 = dbManager.getDatabaseInstance();
    if (!result5) {
      return {
        ok: false,
        error: "SQLite 未初始化"
      };
    }
    const result6 = result5.transaction(arg1 => {
      let num = 0;
      let num2 = 0;
      for (const item of arg1) {
        const value = Array.isArray(item.leads) ? item.leads : [];
        const obj = {
          ...item,
          leads: []
        };
        const result = dbManager.upsertEntityLeadgenTask(obj, {
          replaceLeads: false
        });
        if (!result) {
          throw new Error("写入任务失败: " + item.id);
        }
        const result2 = dbManager.replaceEntityLeadgenLeads(item.id, value);
        if (result2 !== value.length) {
          throw new Error("任务 " + item.id + " 明细写入不完整：期望 " + value.length + "，实际 " + result2);
        }
        num += result2;
        num2 += 1;
      }
      return {
        localTasks: num2,
        localLeads: num
      };
    });
    try {
      const result = result6(list);
      num2 = result.localTasks;
      num = result.localLeads;
    } catch (error) {
      console.error("[DB-Migration] v4 事务失败，已回滚本次写入:", error.message);
      return {
        ok: false,
        error: error.message || String(error)
      };
    }
    const result7 = dbManager.getEntityLeadgenTasksCount();
    if (list.length > 0 && result7 < list.length) {
      const value = "校验失败：enc 任务 " + list.length + "，库内 " + result7;
      console.error("[DB-Migration] " + value);
      return {
        ok: false,
        error: value,
        taskCount: result7,
        leadCount: num
      };
    }
    for (const item of list) {
      const value = Array.isArray(item.leads) ? item.leads.length : 0;
      const result = dbManager.countEntityLeadgenLeads(item.id);
      if (result !== value) {
        return {
          ok: false,
          error: "校验失败：任务 " + item.id + " enc=" + value + " db=" + result,
          taskCount: result7,
          leadCount: num
        };
      }
      if (value > 0) {
        const result = dbManager.getEntityLeadgenTaskById(item.id, {
          includeLeads: true,
          leadLimit: 1
        });
        if (!result) {
          return {
            ok: false,
            error: "校验失败：库中找不到任务 " + item.id
          };
        }
      }
    }
    if (num !== result4) {
      return {
        ok: false,
        error: "校验失败：明细合计 enc=" + result4 + " 写入=" + num,
        taskCount: num2,
        leadCount: num
      };
    }
    try {
      if (fs.existsSync(result)) {
        const result3 = path.join(result2, "entity_leadgen_tasks_v4_" + Date.now() + ".enc.bak");
        fs.copyFileSync(result, result3);
        console.log("[DB-Migration] v4 已备份 enc → " + result3);
      }
      fs.writeFileSync(path.join(arg1, ENTITY_LEADGEN_ENC + ".migrated"), String(Date.now()));
    } catch (error) {
      console.warn("[DB-Migration] v4 备份/标记失败:", error.message);
    }
    dbManager.recordMigration(V4_MIGRATION);
    console.log("[DB-Migration] v4 线索采集切流成功：任务 " + num2 + "，明细 " + num);
    try {
      const result = dbManager.syncEntityVideoCardsIntoLeadPool();
      if (result?.synced > 0) {
        console.log("[DB-Migration] v4 已补齐采集视频到线索库 " + result.synced + " 条");
      }
    } catch (error) {
      console.warn("[DB-Migration] v4 补齐采集视频失败:", error.message);
    }
    return {
      ok: true,
      taskCount: num2,
      leadCount: num
    };
  } catch (error) {
    console.error("[DB-Migration] v4 迁移异常:", error);
    return {
      ok: false,
      error: error.message || String(error)
    };
  }
}
function runMigrationIfNeeded(arg1, arg2) {
  const result = ensureBackupsDir(arg1);
  runV2MigrationIfNeeded(arg1, arg2, result);
  const result2 = runV3LeadsCutoverIfNeeded(arg1);
  if (!result2.ok) {
    console.error("[DB-Migration] v3 切流未成功，运行时将回退 enc 路径:", result2.error || "");
  } else {
    const result = runV3bLeadsDedupeRebuildIfNeeded(arg1);
    if (!result.ok) {
      console.error("[DB-Migration] v3b 去重重建未成功:", result.error || "");
    }
  }
  const result3 = runV4EntityLeadgenCutoverIfNeeded(arg1);
  if (!result3.ok) {
    console.error("[DB-Migration] v4 线索采集切流未成功:", result3.error || "");
  }
  return (result2.ok || dbManager.isMigrationExecuted(V2_MIGRATION)) && (result3.ok || dbManager.isMigrationExecuted(V4_MIGRATION));
}
module.exports = {
  runMigrationIfNeeded: runMigrationIfNeeded,
  runV3LeadsCutoverIfNeeded: runV3LeadsCutoverIfNeeded,
  runV3bLeadsDedupeRebuildIfNeeded: runV3bLeadsDedupeRebuildIfNeeded,
  runV4EntityLeadgenCutoverIfNeeded: runV4EntityLeadgenCutoverIfNeeded,
  V3_MIGRATION: V3_MIGRATION,
  V3B_MIGRATION: V3B_MIGRATION,
  V4_MIGRATION: V4_MIGRATION,
  readEncryptedFile: readEncryptedFile,
  mergeLeadsByUserKey: mergeLeadsByUserKey,
  flattenHistoryLeads: flattenHistoryLeads
};
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const dbManager = require("./dbManager");
const V2_MIGRATION = "v2_full_leads_migration";
const V3_MIGRATION = "v3_leads_runtime_cutover";
const V3B_MIGRATION = "v3b_leads_enc_rebuild_dedupe";
const V4_MIGRATION = "v4_entity_leadgen_sqlite";
const ENTITY_LEADGEN_ENC = "entity_leadgen_tasks.enc";
function readEncryptedFile(_0x15f488) {
  if (!fs.existsSync(_0x15f488)) {
    return null;
  }
  try {
    const _0x1aa552 = crypto.scryptSync("huoke-radar-secret-v1", "salt", 32);
    const _0x4a0671 = Buffer.alloc(16, 0);
    const _0x2019b2 = fs.readFileSync(_0x15f488, "utf8");
    if (!_0x2019b2) {
      return null;
    }
    const _0x2cf5a8 = crypto.createDecipheriv("aes-256-cbc", _0x1aa552, _0x4a0671);
    let _0x40c363 = _0x2cf5a8.update(_0x2019b2, "hex", "utf8");
    _0x40c363 += _0x2cf5a8.final("utf8");
    return JSON.parse(_0x40c363);
  } catch (_0x265118) {
    console.warn("[DB-Migration] 解密文件 [" + _0x15f488 + "] 失败:", _0x265118.message);
    return null;
  }
}
function ensureBackupsDir(_0x487a14) {
  const _0x20ac1b = path.join(_0x487a14, "backups");
  try {
    if (!fs.existsSync(_0x20ac1b)) {
      fs.mkdirSync(_0x20ac1b, {
        recursive: true
      });
    }
  } catch (_0xd2e449) {
    console.warn("[DB-Migration] 创建备份文件夹失败:", _0xd2e449.message);
  }
  return _0x20ac1b;
}
function flattenHistoryLeads(_0x45ce04) {
  const _0x39a375 = [];
  if (!Array.isArray(_0x45ce04)) {
    return _0x39a375;
  }
  for (const _0x4c14fa of _0x45ce04) {
    if (Array.isArray(_0x4c14fa?.items)) {
      for (const _0x1f9f9b of _0x4c14fa.items) {
        if (!_0x1f9f9b || typeof _0x1f9f9b !== "object") {
          continue;
        }
        const _0x35d660 = {
          ..._0x1f9f9b,
          taskId: _0x1f9f9b.taskId || _0x4c14fa.taskId,
          taskName: _0x1f9f9b.taskName || _0x4c14fa.taskName
        };
        _0x39a375.push(_0x35d660);
      }
    } else if (_0x4c14fa && typeof _0x4c14fa === "object" && (_0x4c14fa.nickname || _0x4c14fa.content || _0x4c14fa.userUrl)) {
      _0x39a375.push(_0x4c14fa);
    }
  }
  return _0x39a375;
}
function mergeLeadsByUserKey(_0x240f37) {
  let _0x21d58f;
  try {
    _0x21d58f = require("../shared/leadUserKey");
  } catch (_0x4a9d90) {
    console.error("[DB-Migration] 无法加载 leadUserKey:", _0x4a9d90.message);
    return _0x240f37.filter(Boolean);
  }
  const _0x56c53a = new Map();
  const _0x3f3177 = [];
  for (const _0x2fbcdb of _0x240f37) {
    if (!_0x2fbcdb || typeof _0x2fbcdb !== "object") {
      continue;
    }
    const _0x515e0e = _0x21d58f.getLeadUserKey(_0x2fbcdb);
    if (!_0x515e0e) {
      const _0x2b477 = String(_0x2fbcdb.leadId || _0x2fbcdb.key || "").trim();
      if (_0x2b477) {
        _0x2fbcdb.leadId = _0x2b477;
        _0x2fbcdb.key = _0x2b477;
      } else {
        _0x2fbcdb.leadId = _0x2fbcdb.leadId || "nokey_" + _0x3f3177.length + "_" + Date.now();
        _0x2fbcdb.key = _0x2fbcdb.leadId;
      }
      _0x3f3177.push(_0x2fbcdb);
      continue;
    }
    _0x2fbcdb.leadId = _0x515e0e;
    _0x2fbcdb.key = _0x515e0e;
    const _0xfe095d = _0x56c53a.get(_0x515e0e);
    if (_0xfe095d) {
      _0x21d58f.mergeLeadRecords(_0xfe095d, _0x2fbcdb);
    } else {
      _0x56c53a.set(_0x515e0e, _0x2fbcdb);
    }
  }
  return [..._0x56c53a.values(), ..._0x3f3177];
}
function runV2MigrationIfNeeded(_0x95c1a6, _0x1ca888, _0x5a815d) {
  if (dbManager.isMigrationExecuted(V2_MIGRATION)) {
    return true;
  }
  console.log("[DB-Migration] 正在检测并安全迁移旧 JSON 数据到 SQLite (v2)...");
  let _0xb0b161 = 0;
  try {
    if (_0x1ca888 && typeof _0x1ca888.get === "function") {
      const _0x38c03f = _0x1ca888.get("accounts", []);
      if (Array.isArray(_0x38c03f) && _0x38c03f.length > 0) {
        console.log("[DB-Migration] 发现旧账号池记录 " + _0x38c03f.length + " 条，写入 SQLite...");
        dbManager.saveAccountPool(_0x38c03f);
        _0xb0b161++;
      }
      const _0x2030ce = _0x1ca888.get("processed_videos_detail", []);
      if (Array.isArray(_0x2030ce) && _0x2030ce.length > 0) {
        console.log("[DB-Migration] 发现旧视频明细记录 " + _0x2030ce.length + " 条，写入 SQLite...");
        dbManager.saveProcessedVideosDetail(_0x2030ce);
        _0xb0b161++;
      }
      const _0x14b131 = _0x1ca888.get("monitor_notified_keys", []);
      if (Array.isArray(_0x14b131) && _0x14b131.length > 0) {
        console.log("[DB-Migration] 发现旧监控 Hash 记录 " + _0x14b131.length + " 条，写入 SQLite...");
        dbManager.saveMonitorNotifiedKeys(_0x14b131);
        _0xb0b161++;
      }
      const _0x1d6acc = _0x1ca888.get("task_config") || {};
      const _0x16649a = Array.isArray(_0x1d6acc.personas) ? _0x1d6acc.personas : [];
      if (_0x16649a.length > 0) {
        console.log("[DB-Migration] 发现旧 AI 智能体/人设配置 " + _0x16649a.length + " 个，写入 SQLite...");
        dbManager.saveAiAgentsBatch(_0x16649a);
        _0xb0b161++;
      }
    }
    const _0x39ac96 = path.join(_0x95c1a6, "huoke_history.enc");
    if (fs.existsSync(_0x39ac96)) {
      console.log("[DB-Migration] 发现历史线索加密库 [huoke_history.enc]，正在解密并写入 SQLite (v2 粗导入)...");
      const _0x3d7b9f = readEncryptedFile(_0x39ac96);
      const _0x15b140 = flattenHistoryLeads(_0x3d7b9f);
      if (_0x15b140.length > 0) {
        console.log("[DB-Migration] 共解密出 " + _0x15b140.length + " 条历史线索，开始批量写入 SQLite...");
        const _0x1b7772 = dbManager.saveLeadsBatch(_0x15b140);
        console.log("[DB-Migration] 已成功将 " + _0x1b7772 + " 条线索写入 SQLite 数据库！");
        _0xb0b161++;
        try {
          const _0x1a339e = path.join(_0x5a815d, "huoke_history_" + Date.now() + ".enc.bak");
          fs.copyFileSync(_0x39ac96, _0x1a339e);
          console.log("[DB-Migration] 历史线索库已备份归档至: " + _0x1a339e);
        } catch (_0x9e08ad) {
          console.warn("[DB-Migration] 备份 huoke_history.enc 失败:", _0x9e08ad.message);
        }
      }
    }
    const _0x3dc00e = path.join(_0x95c1a6, "config.json");
    if (fs.existsSync(_0x3dc00e)) {
      try {
        const _0x15d53f = path.join(_0x5a815d, "config_" + Date.now() + ".json.bak");
        fs.copyFileSync(_0x3dc00e, _0x15d53f);
      } catch (_0x5c4dab) {}
    }
    const _0x55e7a7 = path.join(_0x95c1a6, "auth_record.json");
    if (fs.existsSync(_0x55e7a7)) {
      try {
        const _0xb4920c = path.join(_0x5a815d, "auth_record_" + Date.now() + ".json.bak");
        fs.copyFileSync(_0x55e7a7, _0xb4920c);
      } catch (_0x3e1ff3) {}
    }
    dbManager.recordMigration(V2_MIGRATION);
    console.log("[DB-Migration] v2 迁移完成，共迁移 " + _0xb0b161 + " 个核心数据模块。");
    return true;
  } catch (_0x47bd79) {
    console.error("[DB-Migration] v2 迁移异常:", _0x47bd79);
    return false;
  }
}
function runV3LeadsCutoverIfNeeded(_0x3cf645) {
  if (dbManager.isMigrationExecuted(V3_MIGRATION)) {
    console.log("[DB-Migration] v3 线索运行时切流已完成，跳过");
    return {
      ok: true,
      already: true
    };
  }
  console.log("[DB-Migration] 开始 v3 线索完好迁移（按用户键合并）…");
  dbManager.ensureLeadSchemaColumns?.();
  const _0x38ae30 = path.join(_0x3cf645, "huoke_history.enc");
  const _0x13a9d9 = ensureBackupsDir(_0x3cf645);
  try {
    let _0x59a693 = [];
    if (fs.existsSync(_0x38ae30)) {
      const _0x107320 = readEncryptedFile(_0x38ae30);
      if (_0x107320 == null) {
        return {
          ok: false,
          error: "无法解密 huoke_history.enc"
        };
      }
      const _0x5cbce8 = flattenHistoryLeads(_0x107320);
      console.log("[DB-Migration] v3 展平线索 " + _0x5cbce8.length + " 条，开始按用户键合并…");
      _0x59a693 = mergeLeadsByUserKey(_0x5cbce8);
      console.log("[DB-Migration] v3 合并后唯一线索 " + _0x59a693.length + " 条");
    } else {
      const _0x113778 = dbManager.getLeadsCount({
        includeVideoCards: true
      });
      console.log("[DB-Migration] 未找到 huoke_history.enc，沿用 SQLite 现有 " + _0x113778 + " 条线索");
      try {
        const _0x5f35f2 = dbManager.getAllLeadsRaw();
        if (_0x5f35f2.length > 0) {
          const _0x117b43 = require("../shared/leadUserKey");
          const _0x4c2c87 = mergeLeadsByUserKey(_0x5f35f2);
          dbManager.clearAllLeads();
          dbManager.upsertLeadsBatch(_0x4c2c87, {
            mergeFn: (_0x325f3f, _0x880280) => _0x117b43.mergeLeadRecords(_0x325f3f, _0x880280)
          });
          console.log("[DB-Migration] 无 enc：已按用户键重规范化 " + _0x4c2c87.length + " 条");
        }
      } catch (_0x4e4bdc) {
        console.warn("[DB-Migration] 无 enc 重规范化失败，继续以现库切流:", _0x4e4bdc.message);
      }
      const _0x40274d = dbManager.getLeadsCount({
        includeVideoCards: true
      });
      dbManager.recordMigration(V3_MIGRATION);
      try {
        fs.writeFileSync(path.join(_0x3cf645, "huoke_history.enc.migrated"), String(Date.now()));
      } catch (_0x498bab) {}
      return {
        ok: true,
        uniqueCount: _0x40274d,
        dbCount: _0x40274d
      };
    }
    if (_0x59a693.length > 0) {
      const _0x4a13c7 = dbManager.clearAllLeads();
      console.log("[DB-Migration] v3 重建前已清空 leads " + _0x4a13c7 + " 条（以 enc 合并结果为准）");
      const _0x30da66 = require("../shared/leadUserKey");
      const _0x232261 = dbManager.upsertLeadsBatch(_0x59a693, {
        mergeFn: (_0x17b889, _0x5cde99) => _0x30da66.mergeLeadRecords(_0x17b889, _0x5cde99)
      });
      console.log("[DB-Migration] v3 upsert 写入 " + _0x232261 + " 条");
    }
    const _0x52ce6a = dbManager.getLeadsCount({
      includeVideoCards: true
    });
    const _0x168eb8 = _0x59a693.length;
    if (_0x168eb8 > 0) {
      if (_0x52ce6a < Math.floor(_0x168eb8 * 0.98) || _0x52ce6a > Math.ceil(_0x168eb8 * 1.02) + 5) {
        const _0x569d15 = "校验失败：合并 " + _0x168eb8 + " 条，库内 " + _0x52ce6a + " 条";
        console.error("[DB-Migration] " + _0x569d15);
        return {
          ok: false,
          error: _0x569d15,
          uniqueCount: _0x168eb8,
          dbCount: _0x52ce6a
        };
      }
    }
    if (_0x59a693.length > 0) {
      const _0x41d82c = _0x59a693[Math.min(3, _0x59a693.length - 1)];
      const _0x30475e = _0x41d82c.leadId || _0x41d82c.key;
      const _0x10e789 = dbManager.getLeadById(_0x30475e);
      if (!_0x10e789) {
        return {
          ok: false,
          error: "抽样校验失败：库中找不到 " + _0x30475e,
          uniqueCount: _0x168eb8,
          dbCount: _0x52ce6a
        };
      }
    }
    try {
      if (fs.existsSync(_0x38ae30)) {
        const _0x151657 = path.join(_0x13a9d9, "huoke_history_v3_" + Date.now() + ".enc.bak");
        fs.copyFileSync(_0x38ae30, _0x151657);
        console.log("[DB-Migration] v3 已备份 enc → " + _0x151657);
      }
      fs.writeFileSync(path.join(_0x3cf645, "huoke_history.enc.migrated"), String(Date.now()));
    } catch (_0x2b13ea) {
      console.warn("[DB-Migration] v3 备份/标记失败:", _0x2b13ea.message);
    }
    dbManager.recordMigration(V3_MIGRATION);
    console.log("[DB-Migration] v3 线索运行时切流成功：唯一 " + _0x168eb8 + "，库内 " + _0x52ce6a);
    return {
      ok: true,
      uniqueCount: _0x168eb8,
      dbCount: _0x52ce6a
    };
  } catch (_0x20f29f) {
    console.error("[DB-Migration] v3 迁移异常:", _0x20f29f);
    return {
      ok: false,
      error: _0x20f29f.message || String(_0x20f29f)
    };
  }
}
function runV3bLeadsDedupeRebuildIfNeeded(_0x42215d) {
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
  const _0xd8be2c = path.join(_0x42215d, "huoke_history.enc");
  const _0x26a0f9 = ensureBackupsDir(_0x42215d);
  try {
    dbManager.ensureLeadSchemaColumns?.();
    let _0x98814d = [];
    if (fs.existsSync(_0xd8be2c)) {
      const _0xacad85 = readEncryptedFile(_0xd8be2c);
      if (_0xacad85 == null) {
        console.warn("[DB-Migration] v3b 无法解密 enc，改为仅规范化现库");
      } else {
        _0x98814d = mergeLeadsByUserKey(flattenHistoryLeads(_0xacad85));
      }
    }
    const _0x234195 = require("../shared/leadUserKey");
    if (_0x98814d.length > 0) {
      const _0x1030c9 = dbManager.getLeadsCount({
        includeVideoCards: true
      });
      dbManager.clearAllLeads();
      const _0x30e364 = dbManager.upsertLeadsBatch(_0x98814d, {
        mergeFn: (_0x138b80, _0x90a326) => _0x234195.mergeLeadRecords(_0x138b80, _0x90a326)
      });
      const _0x258501 = dbManager.getLeadsCount({
        includeVideoCards: true
      });
      console.log("[DB-Migration] v3b enc 重建：前 " + _0x1030c9 + " → 写入 " + _0x30e364 + " → 后 " + _0x258501 + "（合并唯一 " + _0x98814d.length + "）");
      if (_0x258501 < Math.floor(_0x98814d.length * 0.98)) {
        return {
          ok: false,
          error: "v3b 校验失败：合并 " + _0x98814d.length + "，库内 " + _0x258501
        };
      }
      try {
        const _0x571585 = path.join(_0x26a0f9, "huoke_history_v3b_" + Date.now() + ".enc.bak");
        fs.copyFileSync(_0xd8be2c, _0x571585);
      } catch (_0x513ce4) {}
    } else {
      const _0x39d7c5 = dbManager.getAllLeadsRaw();
      const _0x57d65c = mergeLeadsByUserKey(_0x39d7c5);
      if (_0x57d65c.length > 0 && _0x57d65c.length < _0x39d7c5.length) {
        dbManager.clearAllLeads();
        dbManager.upsertLeadsBatch(_0x57d65c, {
          mergeFn: (_0x31b8a3, _0xf56036) => _0x234195.mergeLeadRecords(_0x31b8a3, _0xf56036)
        });
        console.log("[DB-Migration] v3b 现库去重：" + _0x39d7c5.length + " → " + _0x57d65c.length);
      } else if (_0x57d65c.length > 0) {
        dbManager.clearAllLeads();
        dbManager.upsertLeadsBatch(_0x57d65c, {
          mergeFn: (_0x2997b1, _0x495ce3) => _0x234195.mergeLeadRecords(_0x2997b1, _0x495ce3)
        });
        console.log("[DB-Migration] v3b 现库主键规范化：" + _0x57d65c.length + " 条");
      }
    }
    dbManager.recordMigration(V3B_MIGRATION);
    return {
      ok: true
    };
  } catch (_0x126a91) {
    console.error("[DB-Migration] v3b 异常:", _0x126a91);
    return {
      ok: false,
      error: _0x126a91.message || String(_0x126a91)
    };
  }
}
function runV4EntityLeadgenCutoverIfNeeded(_0x18154b) {
  if (dbManager.isMigrationExecuted(V4_MIGRATION)) {
    console.log("[DB-Migration] v4 线索采集任务已切流 SQLite，跳过");
    return {
      ok: true,
      already: true
    };
  }
  console.log("[DB-Migration] 开始 v4 线索采集任务完好迁移…");
  const _0x31d566 = path.join(_0x18154b, ENTITY_LEADGEN_ENC);
  const _0xe0b535 = ensureBackupsDir(_0x18154b);
  const {
    normalizeEntityLeadgenTaskForMigration: _0x5880c9
  } = require("./entityLeadgenTasks");
  try {
    let _0x5f3034 = [];
    if (fs.existsSync(_0x31d566)) {
      const _0x94657c = readEncryptedFile(_0x31d566);
      if (_0x94657c == null) {
        return {
          ok: false,
          error: "无法解密 entity_leadgen_tasks.enc"
        };
      }
      if (!Array.isArray(_0x94657c)) {
        return {
          ok: false,
          error: "entity_leadgen_tasks.enc 内容不是数组"
        };
      }
      _0x5f3034 = _0x94657c.map(_0x141cec => _0x5880c9(_0x141cec));
      console.log("[DB-Migration] v4 解密任务 " + _0x5f3034.length + " 个");
    } else {
      console.log("[DB-Migration] v4 未找到 entity_leadgen_tasks.enc，以空库切流");
    }
    const _0x212468 = dbManager.getEntityLeadgenTasksCount();
    if (!_0x5f3034.length && _0x212468 > 0) {
      dbManager.recordMigration(V4_MIGRATION);
      try {
        fs.writeFileSync(path.join(_0x18154b, ENTITY_LEADGEN_ENC + ".migrated"), String(Date.now()));
      } catch (_0x1c0f32) {}
      return {
        ok: true,
        taskCount: _0x212468,
        leadCount: 0
      };
    }
    const _0x66dc0f = _0x5f3034.reduce((_0x33cb7f, _0x17de4d) => _0x33cb7f + (Array.isArray(_0x17de4d.leads) ? _0x17de4d.leads.length : 0), 0);
    let _0x3b20f6 = 0;
    let _0x5a6c8e = 0;
    const _0x42d69e = dbManager.getDatabaseInstance();
    if (!_0x42d69e) {
      return {
        ok: false,
        error: "SQLite 未初始化"
      };
    }
    const _0x4baa98 = _0x42d69e.transaction(_0x3fd951 => {
      let _0x14fa16 = 0;
      let _0x26ce28 = 0;
      for (const _0x1b8968 of _0x3fd951) {
        const _0x4d0452 = Array.isArray(_0x1b8968.leads) ? _0x1b8968.leads : [];
        const _0x3e4657 = {
          ..._0x1b8968,
          leads: []
        };
        const _0x4d70c3 = dbManager.upsertEntityLeadgenTask(_0x3e4657, {
          replaceLeads: false
        });
        if (!_0x4d70c3) {
          throw new Error("写入任务失败: " + _0x1b8968.id);
        }
        const _0x3b83b5 = dbManager.replaceEntityLeadgenLeads(_0x1b8968.id, _0x4d0452);
        if (_0x3b83b5 !== _0x4d0452.length) {
          throw new Error("任务 " + _0x1b8968.id + " 明细写入不完整：期望 " + _0x4d0452.length + "，实际 " + _0x3b83b5);
        }
        _0x14fa16 += _0x3b83b5;
        _0x26ce28 += 1;
      }
      return {
        localTasks: _0x26ce28,
        localLeads: _0x14fa16
      };
    });
    try {
      const _0x516d46 = _0x4baa98(_0x5f3034);
      _0x5a6c8e = _0x516d46.localTasks;
      _0x3b20f6 = _0x516d46.localLeads;
    } catch (_0x2239d2) {
      console.error("[DB-Migration] v4 事务失败，已回滚本次写入:", _0x2239d2.message);
      return {
        ok: false,
        error: _0x2239d2.message || String(_0x2239d2)
      };
    }
    const _0x19a2a5 = dbManager.getEntityLeadgenTasksCount();
    if (_0x5f3034.length > 0 && _0x19a2a5 < _0x5f3034.length) {
      const _0x3843ae = "校验失败：enc 任务 " + _0x5f3034.length + "，库内 " + _0x19a2a5;
      console.error("[DB-Migration] " + _0x3843ae);
      return {
        ok: false,
        error: _0x3843ae,
        taskCount: _0x19a2a5,
        leadCount: _0x3b20f6
      };
    }
    for (const _0x3d9027 of _0x5f3034) {
      const _0x9eea45 = Array.isArray(_0x3d9027.leads) ? _0x3d9027.leads.length : 0;
      const _0x1a18e3 = dbManager.countEntityLeadgenLeads(_0x3d9027.id);
      if (_0x1a18e3 !== _0x9eea45) {
        return {
          ok: false,
          error: "校验失败：任务 " + _0x3d9027.id + " enc=" + _0x9eea45 + " db=" + _0x1a18e3,
          taskCount: _0x19a2a5,
          leadCount: _0x3b20f6
        };
      }
      if (_0x9eea45 > 0) {
        const _0x5d9367 = dbManager.getEntityLeadgenTaskById(_0x3d9027.id, {
          includeLeads: true,
          leadLimit: 1
        });
        if (!_0x5d9367) {
          return {
            ok: false,
            error: "校验失败：库中找不到任务 " + _0x3d9027.id
          };
        }
      }
    }
    if (_0x3b20f6 !== _0x66dc0f) {
      return {
        ok: false,
        error: "校验失败：明细合计 enc=" + _0x66dc0f + " 写入=" + _0x3b20f6,
        taskCount: _0x5a6c8e,
        leadCount: _0x3b20f6
      };
    }
    try {
      if (fs.existsSync(_0x31d566)) {
        const _0x5ef751 = path.join(_0xe0b535, "entity_leadgen_tasks_v4_" + Date.now() + ".enc.bak");
        fs.copyFileSync(_0x31d566, _0x5ef751);
        console.log("[DB-Migration] v4 已备份 enc → " + _0x5ef751);
      }
      fs.writeFileSync(path.join(_0x18154b, ENTITY_LEADGEN_ENC + ".migrated"), String(Date.now()));
    } catch (_0x221365) {
      console.warn("[DB-Migration] v4 备份/标记失败:", _0x221365.message);
    }
    dbManager.recordMigration(V4_MIGRATION);
    console.log("[DB-Migration] v4 线索采集切流成功：任务 " + _0x5a6c8e + "，明细 " + _0x3b20f6);
    try {
      const _0x3398f4 = dbManager.syncEntityVideoCardsIntoLeadPool();
      if (_0x3398f4?.synced > 0) {
        console.log("[DB-Migration] v4 已补齐采集视频到线索库 " + _0x3398f4.synced + " 条");
      }
    } catch (_0x7aa875) {
      console.warn("[DB-Migration] v4 补齐采集视频失败:", _0x7aa875.message);
    }
    return {
      ok: true,
      taskCount: _0x5a6c8e,
      leadCount: _0x3b20f6
    };
  } catch (_0x20a611) {
    console.error("[DB-Migration] v4 迁移异常:", _0x20a611);
    return {
      ok: false,
      error: _0x20a611.message || String(_0x20a611)
    };
  }
}
function runMigrationIfNeeded(_0x39d8d9, _0x85b603) {
  const _0x2b34e4 = ensureBackupsDir(_0x39d8d9);
  runV2MigrationIfNeeded(_0x39d8d9, _0x85b603, _0x2b34e4);
  const _0x1bfbac = runV3LeadsCutoverIfNeeded(_0x39d8d9);
  if (!_0x1bfbac.ok) {
    console.error("[DB-Migration] v3 切流未成功，运行时将回退 enc 路径:", _0x1bfbac.error || "");
  } else {
    const _0x3e4ca0 = runV3bLeadsDedupeRebuildIfNeeded(_0x39d8d9);
    if (!_0x3e4ca0.ok) {
      console.error("[DB-Migration] v3b 去重重建未成功:", _0x3e4ca0.error || "");
    }
  }
  const _0x1e15cb = runV4EntityLeadgenCutoverIfNeeded(_0x39d8d9);
  if (!_0x1e15cb.ok) {
    console.error("[DB-Migration] v4 线索采集切流未成功:", _0x1e15cb.error || "");
  }
  return (_0x1bfbac.ok || dbManager.isMigrationExecuted(V2_MIGRATION)) && (_0x1e15cb.ok || dbManager.isMigrationExecuted(V4_MIGRATION));
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
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
function registerLeadsHistoryIpc(_0x4dc587) {
  const {
    store: _0x265f36,
    historyManager: _0x5872be,
    ensureDatabaseInitialized: _0x2e89ba,
    isLeadsSqliteRuntime: _0x1a271f,
    HISTORY_FILE: _0x56e91d,
    CRYPTO_KEY: _0x13a67a,
    CRYPTO_IV: _0x500f4c,
    getPlatformViews: _0x2655ca,
    getViewSettingsMap: _0x282c1a,
    inFlightProcessedVideos: _0x2f0a4d,
    recordAccountVideoMainComment: _0x112181,
    broadcastClearProcessedVideosCache: _0x1257b4,
    appendHistory: _0x184f40
  } = _0x4dc587;
  function _0x4e068a(_0x239807) {
    const _0x1e0fee = new Set();
    String(_0x239807 || "").split(/[\n,，\s]+/).map(_0x476db4 => _0x476db4.trim()).filter(Boolean).forEach(_0x5ce8f6 => {
      const _0x73bd32 = extractDouyinVideoId(_0x5ce8f6);
      if (_0x73bd32) {
        _0x1e0fee.add(_0x73bd32);
      }
    });
    return _0x1e0fee;
  }
  function _0xe5a957(_0x475e00, _0x3993a9) {
    if (!_0x475e00 || _0x3993a9 == null || _0x3993a9 === "") {
      return false;
    }
    const _0x4999d2 = String(_0x3993a9);
    if (String(_0x475e00.leadId || "") === _0x4999d2 || String(_0x475e00.key || "") === _0x4999d2) {
      return true;
    }
    const _0x2d4dd = leadUserKey.getLeadUserKey(_0x475e00);
    return !!_0x2d4dd && String(_0x2d4dd) === _0x4999d2;
  }
  function _0x205588(_0x1ab1d7, _0x3a4f89) {
    return _0x3a4f89.some(_0x4b4411 => processedVideoKeysMatch(_0x4b4411.url, _0x1ab1d7));
  }
  function _0x365b7d(_0x50a0c0) {
    _0x2655ca().forEach(_0x3094d3 => {
      if (_0x3094d3 && !_0x3094d3.webContents.isDestroyed()) {
        _0x3094d3.webContents.send("sync-processed-video", {
          url: _0x50a0c0
        });
      }
    });
  }
  function _0x48905f(_0x1114e7) {
    const _0x239ee3 = (Array.isArray(_0x1114e7) ? _0x1114e7 : [_0x1114e7]).map(_0x4e546c => normalizeProcessedVideoKey(_0x4e546c) || String(_0x4e546c || "").trim()).filter(Boolean);
    if (_0x239ee3.length === 0) {
      return;
    }
    for (const _0x36b9f6 of _0x239ee3) {
      _0x2f0a4d.delete(_0x36b9f6);
      const _0x12535f = extractDouyinVideoId(_0x36b9f6);
      if (_0x12535f) {
        _0x2f0a4d.delete("https://www.douyin.com/video/" + _0x12535f);
      }
    }
    _0x2655ca().forEach(_0x2b929f => {
      if (_0x2b929f && !_0x2b929f.webContents.isDestroyed()) {
        _0x2b929f.webContents.send("forget-processed-videos", {
          urls: _0x239ee3
        });
      }
    });
  }
  function _0x2e89a7(_0x35ee3e) {
    const _0x23e65f = String(_0x35ee3e || "").trim();
    if (!_0x23e65f) {
      return "";
    }
    const _0x5ae5a7 = _0x23e65f.match(/^video:(\d{10,})$/i)?.[1];
    if (_0x5ae5a7) {
      return "video:" + _0x5ae5a7;
    }
    const _0x309ede = extractDouyinVideoId(_0x23e65f) || _0x23e65f.match(/(?:video|note)\/(\d{10,})/i)?.[1] || "";
    if (_0x309ede) {
      return "video:" + _0x309ede;
    } else {
      return "";
    }
  }
  try {
    _0x5872be.setProcessedVideosRemovedHandler?.(_0x48905f);
  } catch (_0x2c72ab) {}
  function _0x48558e(_0x55c011 = {}, _0x1ca75c = {}) {
    const _0x3df6e2 = Array.isArray(_0x55c011?.scrapeTargets) ? _0x55c011.scrapeTargets : [];
    const _0x2053c9 = _0x3df6e2.filter(_0x5691d2 => _0x5691d2 === "video" || _0x5691d2 === "author");
    const _0x576138 = _0x55c011?.taskMode === "scrape" && _0x2053c9.length > 0;
    return {
      recordType: _0x1ca75c?.recordType || (_0x576138 ? "collected_link" : "history_video"),
      collectedTargets: Array.isArray(_0x1ca75c?.collectedTargets) ? _0x1ca75c.collectedTargets.filter(_0x67bd6 => _0x67bd6 === "video" || _0x67bd6 === "author") : _0x2053c9
    };
  }
  function _0x45a4b3() {
    ipcMain.handle("get-history", async () => {
      if (_0x1a271f()) {
        console.warn("[Main] get-history 在 SQLite 运行时已禁用全量导出，请使用 get-leads-page");
        return [];
      }
      if (!fs.existsSync(_0x56e91d)) {
        return [];
      }
      try {
        const _0x295bb9 = fs.readFileSync(_0x56e91d, "utf8");
        const _0x5a9396 = crypto.createDecipheriv("aes-256-cbc", _0x13a67a, _0x500f4c);
        let _0x20a1f5 = _0x5a9396.update(_0x295bb9, "hex", "utf8");
        _0x20a1f5 += _0x5a9396.final("utf8");
        return JSON.parse(_0x20a1f5);
      } catch (_0x63d0bb) {
        return [];
      }
    });
    ipcMain.handle("get-leads-page", async (_0x2ca92d, _0xeea036 = {}) => {
      try {
        await _0x2e89ba();
        if (!_0x1a271f()) {
          return {
            items: [],
            total: 0,
            runtime: "enc"
          };
        }
        const _0x1e6c15 = Math.max(1, Number(_0xeea036.page) || Number(_0xeea036.current) || 1);
        const _0x240131 = _0xeea036.forExport === true;
        const _0x1920ed = _0x240131 ? Math.max(1, Math.min(100000, Number(_0xeea036.pageSize) || Number(_0xeea036.limit) || 100000)) : Math.max(1, Math.min(200, Number(_0xeea036.pageSize) || Number(_0xeea036.limit) || 50));
        const _0x1545a0 = _0x240131 ? 0 : (_0x1e6c15 - 1) * _0x1920ed;
        const _0x313342 = _0xeea036.filters || {};
        const _0x4e1430 = await dbManager.queryLeadsPage({
          offset: _0x1545a0,
          limit: _0x1920ed,
          filters: _0x313342,
          orderBy: _0xeea036.orderBy,
          forExport: _0x240131
        });
        return {
          ..._0x4e1430,
          page: _0x1e6c15,
          pageSize: _0x1920ed,
          runtime: "sqlite"
        };
      } catch (_0x45efac) {
        console.error("[Main] get-leads-page failed:", _0x45efac?.message || _0x45efac);
        return {
          items: [],
          total: 0,
          error: _0x45efac?.message || String(_0x45efac)
        };
      }
    });
    ipcMain.handle("get-leads-count", async (_0x54bf7e, _0x2ba9a2 = {}) => {
      try {
        await _0x2e89ba();
        if (!_0x1a271f()) {
          return {
            total: 0,
            runtime: "enc"
          };
        }
        const _0x48f691 = _0x2ba9a2.filters || {};
        const _0x3de16d = await dbManager.queryLeadsPage({
          offset: 0,
          limit: 1,
          filters: _0x48f691,
          _countOnly: true
        });
        return {
          total: _0x3de16d.total || 0,
          runtime: "sqlite"
        };
      } catch (_0x414aec) {
        return {
          total: 0,
          error: _0x414aec?.message || String(_0x414aec)
        };
      }
    });
    ipcMain.handle("get-leads-pool-stats", async (_0xab543e, _0x5b247c = {}) => {
      try {
        await _0x2e89ba();
        if (!_0x1a271f()) {
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
        const _0x380cb2 = await dbManager.aggregateLeadsPoolStats(_0x5b247c.filters || {});
        return {
          ..._0x380cb2,
          runtime: "sqlite"
        };
      } catch (_0x3e2356) {
        console.error("[Main] get-leads-pool-stats failed:", _0x3e2356?.message || _0x3e2356);
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
          error: _0x3e2356?.message || String(_0x3e2356)
        };
      }
    });
    ipcMain.handle("get-leads-filter-options", async () => {
      try {
        await _0x2e89ba();
        if (!_0x1a271f()) {
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
      } catch (_0x3c96a8) {
        return {
          accounts: [],
          keywords: [],
          locations: []
        };
      }
    });
    ipcMain.handle("export-leads", async (_0x55054a, _0x119ea5 = {}) => {
      try {
        await _0x2e89ba();
        if (!_0x1a271f()) {
          return {
            success: false,
            error: "SQLite 线索库未就绪"
          };
        }
        const _0x31de6b = "leads_export_" + Date.now() + ".csv";
        const {
          canceled: _0x46a14b,
          filePath: _0x94bf90
        } = await dialog.showSaveDialog({
          title: "导出线索",
          defaultPath: _0x31de6b,
          filters: [{
            name: "CSV",
            extensions: ["csv"]
          }]
        });
        if (_0x46a14b || !_0x94bf90) {
          return {
            success: false,
            canceled: true
          };
        }
        const _0x3260e4 = _0x119ea5.filters || {};
        const _0xcbc76b = await dbManager.queryLeadsPage({
          offset: 0,
          limit: 100000,
          filters: _0x3260e4,
          forExport: true
        });
        const _0x228c4a = _0xcbc76b.items || [];
        if (!_0x228c4a.length) {
          return {
            success: false,
            error: "暂无数据可导出"
          };
        }
        const _0x37b809 = Array.isArray(_0x119ea5.fields) && _0x119ea5.fields.length ? _0x119ea5.fields : ["nickname", "content", "userUrl", "accountName", "entryLabel", "searchKeyword", "location", "isHighIntention", "capturedAt", "timestamp"];
        const _0x1d15e9 = _0x37b809;
        const _0x34d8ce = _0x35f9f2 => {
          if (_0x35f9f2 == null) {
            return "";
          }
          const _0xa4f41c = typeof _0x35f9f2 === "string" ? _0x35f9f2 : String(_0x35f9f2);
          return "\"" + _0xa4f41c.replace(/"/g, "\"\"") + "\"";
        };
        const _0x423f0b = [_0x1d15e9.join(",")];
        for (const _0x5e24fc of _0x228c4a) {
          _0x423f0b.push(_0x1d15e9.map(_0x878f8a => _0x34d8ce(_0x5e24fc[_0x878f8a])).join(","));
        }
        fs.writeFileSync(_0x94bf90, "﻿" + _0x423f0b.join("\n"), "utf8");
        return {
          success: true,
          path: _0x94bf90,
          count: _0x228c4a.length
        };
      } catch (_0x3ab342) {
        console.error("[Main] export-leads failed:", _0x3ab342?.message || _0x3ab342);
        return {
          success: false,
          error: _0x3ab342?.message || String(_0x3ab342)
        };
      }
    });
    ipcMain.handle("query-leads-for-batch", async (_0x144c63, _0x2a99de = {}) => {
      try {
        await _0x2e89ba();
        if (!_0x1a271f()) {
          return {
            items: [],
            total: 0
          };
        }
        const _0x5c586e = _0x2a99de.filters || {};
        const _0x43cfcc = await dbManager.queryLeadsPage({
          offset: 0,
          limit: Math.min(50000, Number(_0x2a99de.limit) || 50000),
          filters: _0x5c586e,
          forBatch: true
        });
        const _0x16e71f = (_0x43cfcc.items || []).filter(_0xe23e33 => _0xe23e33 && _0xe23e33.userUrl && _0xe23e33.leadKind !== "video_card");
        return {
          items: _0x16e71f,
          total: _0x16e71f.length
        };
      } catch (_0x509934) {
        console.error("[Main] query-leads-for-batch failed:", _0x509934?.message || _0x509934);
        return {
          items: [],
          total: 0,
          error: _0x509934?.message || String(_0x509934)
        };
      }
    });
    ipcMain.handle("get-leads-by-ids", async (_0x4f8d22, _0x495731 = {}) => {
      try {
        await _0x2e89ba();
        if (!_0x1a271f()) {
          return {
            items: [],
            total: 0,
            requested: 0
          };
        }
        const _0x3098ee = Array.isArray(_0x495731?.ids) ? _0x495731.ids : Array.isArray(_0x495731) ? _0x495731 : [];
        const _0x1c9d0a = _0x3098ee.map(_0x2cf893 => String(_0x2cf893 || "").trim()).filter(Boolean);
        const _0x3189c9 = (dbManager.listLeadsByIds(_0x1c9d0a, {
          limit: Math.min(100000, Number(_0x495731?.limit) || _0x1c9d0a.length || 1)
        }) || []).filter(_0x13cef5 => _0x13cef5 && _0x13cef5.leadKind !== "video_card");
        return {
          items: _0x3189c9,
          total: _0x3189c9.length,
          requested: _0x1c9d0a.length
        };
      } catch (_0x3c7a9d) {
        console.error("[Main] get-leads-by-ids failed:", _0x3c7a9d?.message || _0x3c7a9d);
        return {
          items: [],
          total: 0,
          requested: 0,
          error: _0x3c7a9d?.message || String(_0x3c7a9d)
        };
      }
    });
    ipcMain.handle("append-imported-leads", async (_0x1b4aff, _0x4aa603) => {
      try {
        const _0x49fba7 = (Array.isArray(_0x4aa603) ? _0x4aa603 : []).filter(_0x16e3e5 => _0x16e3e5 && _0x16e3e5.userUrl);
        if (!_0x49fba7.length) {
          return false;
        }
        const _0x3d2339 = _0x49fba7.some(_0x2578e1 => String(_0x2578e1.taskId || "").startsWith("import_csv") || String(_0x2578e1.source || "") === "import_csv");
        _0x184f40(_0x49fba7, _0x3d2339 ? "import_csv" : "import_uid", _0x3d2339 ? "CSV导入" : "UID导入");
        return true;
      } catch (_0x81fb3b) {
        console.error("[Main] append-imported-leads failed:", _0x81fb3b?.message || _0x81fb3b);
        return false;
      }
    });
    ipcMain.handle("delete-history-record", async (_0x66089e, _0x33b7a1) => {
      if (!fs.existsSync(_0x56e91d)) {
        return false;
      }
      try {
        const _0x584232 = Array.isArray(_0x33b7a1) ? _0x33b7a1 : [_0x33b7a1];
        const _0x17cc19 = fs.readFileSync(_0x56e91d, "utf8");
        const _0x592a0e = crypto.createDecipheriv("aes-256-cbc", _0x13a67a, _0x500f4c);
        let _0x258905 = _0x592a0e.update(_0x17cc19, "hex", "utf8");
        _0x258905 += _0x592a0e.final("utf8");
        let _0x2192ea = JSON.parse(_0x258905);
        const _0x451f0f = _0x2192ea.filter(_0xa7f33f => !_0x584232.includes(_0xa7f33f.taskId));
        const _0x351d84 = crypto.createCipheriv("aes-256-cbc", _0x13a67a, _0x500f4c);
        let _0x517fee = _0x351d84.update(JSON.stringify(_0x451f0f), "utf8", "hex");
        _0x517fee += _0x351d84.final("hex");
        fs.writeFileSync(_0x56e91d, _0x517fee);
        return true;
      } catch (_0x37f492) {
        return false;
      }
    });
    ipcMain.handle("update-history-remark", async (_0x31dc69, {
      taskId: _0x30cc7c,
      remark: _0x164d69
    }) => {
      if (!fs.existsSync(_0x56e91d)) {
        return false;
      }
      try {
        const _0x222d17 = fs.readFileSync(_0x56e91d, "utf8");
        const _0x146311 = crypto.createDecipheriv("aes-256-cbc", _0x13a67a, _0x500f4c);
        let _0x3f4892 = _0x146311.update(_0x222d17, "hex", "utf8");
        _0x3f4892 += _0x146311.final("utf8");
        let _0x21bdcb = JSON.parse(_0x3f4892);
        const _0x1b3c6d = _0x21bdcb.find(_0x313551 => _0x313551.taskId === _0x30cc7c);
        if (_0x1b3c6d) {
          _0x1b3c6d.remark = _0x164d69;
          const _0x380717 = crypto.createCipheriv("aes-256-cbc", _0x13a67a, _0x500f4c);
          let _0x6f4a30 = _0x380717.update(JSON.stringify(_0x21bdcb), "utf8", "hex");
          _0x6f4a30 += _0x380717.final("hex");
          fs.writeFileSync(_0x56e91d, _0x6f4a30);
          return true;
        }
        return false;
      } catch (_0x81db23) {
        return false;
      }
    });
    ipcMain.handle("update-lead-in-history", async (_0x597408, {
      leadId: _0x6305d3,
      updates: _0x13c5df
    }) => {
      if (_0x1a271f()) {
        try {
          let _0x312237 = dbManager.getLeadById(_0x6305d3) || dbManager.getLeadByUserKey(_0x6305d3);
          if (!_0x312237 && _0x13c5df && typeof _0x13c5df === "object") {
            const _0x40d668 = dbManager.findLeadRowId({
              ..._0x13c5df,
              leadId: _0x6305d3,
              key: _0x6305d3
            });
            if (_0x40d668) {
              _0x312237 = dbManager.getLeadById(_0x40d668);
            }
          }
          if (!_0x312237) {
            return false;
          }
          Object.assign(_0x312237, _0x13c5df || {});
          return !!dbManager.upsertLead(_0x312237);
        } catch (_0x4cf904) {
          console.error("[Main] update-lead-in-history SQLite failed:", _0x4cf904?.message || _0x4cf904);
          return false;
        }
      }
      if (!fs.existsSync(_0x56e91d)) {
        return false;
      }
      try {
        const _0x448d63 = fs.readFileSync(_0x56e91d, "utf8");
        const _0xb88239 = crypto.createDecipheriv("aes-256-cbc", _0x13a67a, _0x500f4c);
        let _0x369779 = _0xb88239.update(_0x448d63, "hex", "utf8");
        _0x369779 += _0xb88239.final("utf8");
        let _0x160707 = JSON.parse(_0x369779);
        let _0x58ac54 = false;
        _0x160707.forEach(_0x39db83 => {
          (_0x39db83.items || []).forEach(_0x25d68e => {
            if (!_0xe5a957(_0x25d68e, _0x6305d3)) {
              return;
            }
            Object.assign(_0x25d68e, _0x13c5df);
            _0x58ac54 = true;
          });
        });
        if (_0x58ac54) {
          const _0x49ed57 = crypto.createCipheriv("aes-256-cbc", _0x13a67a, _0x500f4c);
          let _0x3f466d = _0x49ed57.update(JSON.stringify(_0x160707), "utf8", "hex");
          _0x3f466d += _0x49ed57.final("hex");
          fs.writeFileSync(_0x56e91d, _0x3f466d);
          return true;
        }
        return false;
      } catch (_0x5c33fb) {
        return false;
      }
    });
    ipcMain.handle("claim-processed-video", async (_0x54d1cf, _0x5c85e5) => {
      const _0x231a10 = _0x2655ca();
      const _0x2899c8 = _0x282c1a();
      const _0x1162b9 = [..._0x231a10.entries()].find(([, _0x1f1056]) => _0x1f1056.webContents === _0x54d1cf.sender)?.[0];
      const _0x38bae6 = _0x1162b9 ? _0x2899c8.get(_0x1162b9) : null;
      if (_0x38bae6?.taskMode === "nurture") {
        return {
          claimed: true,
          key: "",
          reason: "nurture_skip"
        };
      }
      const _0x55318c = normalizeProcessedVideoKey(_0x5c85e5?.url || "");
      if (!_0x55318c) {
        return {
          claimed: false,
          reason: "invalid_url"
        };
      }
      if (_0x2f0a4d.has(_0x55318c)) {
        return {
          claimed: false,
          reason: "in_flight",
          key: _0x55318c
        };
      }
      let _0x591de7 = processedVideosAccess.listAll(_0x265f36);
      const _0x2c95d7 = !!_0x5c85e5?.forceReclaim && (_0x38bae6?.videoSources || []).includes("specific") && _0x4e068a(_0x38bae6?.specifiedUrls).has(extractDouyinVideoId(_0x55318c));
      if (_0x2c95d7) {
        processedVideosAccess.removeByUrls(_0x265f36, [_0x55318c]);
        _0x591de7 = processedVideosAccess.listAll(_0x265f36);
      } else if (_0x205588(_0x55318c, _0x591de7)) {
        const _0x1797b9 = _0x591de7.find(_0x5898df => processedVideoKeysMatch(_0x5898df.url, _0x55318c));
        const _0x10c844 = Array.isArray(_0x38bae6?.scrapeTargets) ? _0x38bae6.scrapeTargets : [];
        const _0x113e0d = _0x38bae6?.taskMode === "scrape" && !_0x10c844.includes("comments") && (_0x10c844.includes("video") || _0x10c844.includes("author"));
        const _0x409cd1 = _0x38bae6?.taskMode === "scrape" && _0x10c844.includes("author");
        const _0x162d6e = _0x113e0d && _0x1797b9?.recordType === "collected_link";
        const _0x13bae2 = _0x409cd1 && _0x1797b9?.recordType === "collected_link" && !_0x1797b9?.authorUrl;
        if (!_0x162d6e && !_0x13bae2) {
          return {
            claimed: false,
            reason: "already_processed",
            key: _0x55318c
          };
        }
        processedVideosAccess.removeByUrls(_0x265f36, [_0x55318c]);
        _0x591de7 = processedVideosAccess.listAll(_0x265f36);
      }
      _0x2f0a4d.add(_0x55318c);
      try {
        const _0x3e3a99 = _0x48558e(_0x38bae6, _0x5c85e5);
        processedVideosAccess.upsert(_0x265f36, {
          url: _0x55318c,
          title: _0x5c85e5?.title || "处理中",
          authorUrl: _0x5c85e5?.authorUrl || "",
          authorNickname: _0x5c85e5?.authorNickname || "",
          platform: _0x5c85e5?.platform || "douyin",
          timestamp: Date.now(),
          ..._0x3e3a99
        });
        _0x365b7d(_0x55318c);
        return {
          claimed: true,
          key: _0x55318c
        };
      } finally {
        _0x2f0a4d.delete(_0x55318c);
      }
    });
    ipcMain.handle("record-video-main-comment", async (_0x3b895c, _0x557b3d) => {
      const _0x33b97f = _0x2655ca();
      const _0x2af3e2 = _0x282c1a();
      const _0x16f592 = [..._0x33b97f.entries()].find(([, _0x3a40f1]) => _0x3a40f1.webContents === _0x3b895c.sender)?.[0];
      const _0x2f7e35 = _0x16f592 ? _0x2af3e2.get(_0x16f592) : null;
      if (_0x2f7e35?.taskMode === "nurture") {
        return {
          recorded: false,
          reason: "nurture_skip"
        };
      }
      const _0x37701e = _0x557b3d?.accountId || _0x2f7e35?.accountId || "default";
      const _0x9a9dfd = _0x112181(_0x37701e, _0x557b3d);
      return {
        recorded: _0x9a9dfd
      };
    });
    const _0x2e2b4a = require("./accountVideoMainCommentsAccess");
    ipcMain.handle("get-video-main-comments", async (_0x2b9225, _0x418042 = {}) => {
      try {
        await _0x2e89ba();
        return {
          success: true,
          ..._0x2e2b4a.queryPage(_0x265f36, _0x418042 || {})
        };
      } catch (_0x27b274) {
        return {
          success: false,
          items: [],
          total: 0,
          error: _0x27b274?.message || String(_0x27b274)
        };
      }
    });
    ipcMain.handle("remove-video-main-comments", async (_0xa5eb8c, _0x43399e = {}) => {
      try {
        await _0x2e89ba();
        const _0x30e208 = Array.isArray(_0x43399e?.items) ? _0x43399e.items : Array.isArray(_0x43399e?.keys) ? _0x43399e.keys : [];
        const _0x360a56 = _0x2e2b4a.removeMany(_0x265f36, _0x30e208);
        return {
          success: true,
          removed: _0x360a56
        };
      } catch (_0x45cd6c) {
        return {
          success: false,
          removed: 0,
          error: _0x45cd6c?.message || String(_0x45cd6c)
        };
      }
    });
    ipcMain.handle("clear-video-main-comments", async () => {
      try {
        await _0x2e89ba();
        const _0x26f329 = _0x2e2b4a.clearAll(_0x265f36);
        return {
          success: true,
          cleared: _0x26f329
        };
      } catch (_0x5c4cd4) {
        return {
          success: false,
          cleared: 0,
          error: _0x5c4cd4?.message || String(_0x5c4cd4)
        };
      }
    });
    ipcMain.on("update-processed-videos", (_0x4f734f, _0x4b86ee) => {
      const _0x24b025 = _0x2655ca();
      const _0x252b48 = _0x282c1a();
      const _0x5bc83e = [..._0x24b025.entries()].find(([, _0x495952]) => _0x495952.webContents === _0x4f734f.sender)?.[0];
      const _0x7cd8a4 = _0x5bc83e ? _0x252b48.get(_0x5bc83e) : null;
      if (_0x7cd8a4?.taskMode === "nurture") {
        return;
      }
      const _0x1320ae = Date.now();
      const _0x15333f = typeof _0x4b86ee === "string" ? {
        url: _0x4b86ee,
        title: "历史扫描记录",
        timestamp: _0x1320ae
      } : _0x4b86ee;
      const _0x26f98f = normalizeProcessedVideoKey(_0x15333f?.url || "");
      if (!_0x26f98f) {
        return;
      }
      const _0x20ecf0 = processedVideosAccess.findByUrl(_0x265f36, _0x26f98f);
      const _0x504336 = _0x15333f.title || "历史扫描记录";
      const _0x26c8c2 = _0x15333f.platform || "douyin";
      const _0x14528f = _0x15333f.timestamp || _0x1320ae;
      const _0x707484 = _0x15333f.authorUrl || "";
      const _0x3fbabd = _0x15333f.authorNickname || "";
      const _0x285f76 = _0x48558e(_0x7cd8a4, _0x15333f);
      if (_0x20ecf0) {
        const _0x285632 = {
          recordType: _0x20ecf0.recordType === "collected_link" || _0x285f76.recordType === "collected_link" ? "collected_link" : _0x285f76.recordType,
          collectedTargets: [...new Set([...(_0x20ecf0.collectedTargets || []), ...(_0x285f76.collectedTargets || [])])]
        };
        const _0x23c84c = _0x504336 && _0x504336 !== "处理中" && _0x504336 !== "历史扫描记录" && _0x504336 !== "未知视频" && _0x20ecf0.title !== _0x504336;
        const _0x2cec5a = _0x20ecf0.recordType !== _0x285632.recordType || JSON.stringify(_0x20ecf0.collectedTargets || []) !== JSON.stringify(_0x285632.collectedTargets || []);
        const _0x2c1a53 = !!_0x707484 && _0x20ecf0.authorUrl !== _0x707484 || !!_0x3fbabd && _0x20ecf0.authorNickname !== _0x3fbabd;
        if (_0x23c84c || _0x2cec5a || _0x2c1a53) {
          processedVideosAccess.upsert(_0x265f36, {
            ..._0x20ecf0,
            url: _0x26f98f,
            title: _0x23c84c ? _0x504336 : _0x20ecf0.title,
            authorUrl: _0x707484 || _0x20ecf0.authorUrl || "",
            authorNickname: _0x3fbabd || _0x20ecf0.authorNickname || "",
            platform: _0x26c8c2,
            timestamp: _0x14528f,
            ..._0x285632
          });
        }
        return;
      }
      processedVideosAccess.upsert(_0x265f36, {
        url: _0x26f98f,
        title: _0x504336,
        authorUrl: _0x707484,
        authorNickname: _0x3fbabd,
        platform: _0x26c8c2,
        timestamp: _0x14528f,
        ..._0x285f76
      });
      _0x365b7d(_0x26f98f);
    });
    ipcMain.handle("get-memory-list", async () => {
      const _0x265c90 = processedVideosAccess.listAll(_0x265f36);
      console.log("[Main] [记忆读取] 返回 " + _0x265c90.length + " 条记忆数据");
      return _0x265c90.sort((_0x7ad16d, _0x3a4d9d) => (_0x3a4d9d.timestamp || 0) - (_0x7ad16d.timestamp || 0));
    });
    ipcMain.handle("delete-memory-items", async (_0x58687e, _0x1efa80) => {
      const _0x2c44c5 = Array.isArray(_0x1efa80) ? _0x1efa80 : [_0x1efa80];
      processedVideosAccess.removeByUrls(_0x265f36, _0x2c44c5);
      _0x48905f(_0x2c44c5);
      console.log("[Main] [记忆删除] 已删除 " + _0x2c44c5.length + " 条记录");
      return {
        success: true
      };
    });
    ipcMain.handle("clear-all-memory", async () => {
      processedVideosAccess.clearAll(_0x265f36);
      _0x1257b4();
      console.log("[Main] [记忆清空] 已重置所有扫描记忆");
      return {
        success: true
      };
    });
    ipcMain.handle("delete-leads-from-history", async (_0x3797df, _0x5b0b30) => {
      const _0xdde23b = (Array.isArray(_0x5b0b30) ? _0x5b0b30 : [_0x5b0b30]).map(_0x368dca => _0x368dca == null ? "" : String(_0x368dca)).filter(Boolean);
      if (!_0xdde23b.length) {
        return false;
      }
      if (_0x1a271f()) {
        try {
          const _0x1061c5 = dbManager.deleteLeadsByIds(_0xdde23b);
          return _0x1061c5 > 0;
        } catch (_0xc0ca54) {
          console.error("[Main] delete-leads-from-history SQLite failed:", _0xc0ca54?.message || _0xc0ca54);
          return false;
        }
      }
      if (!fs.existsSync(_0x56e91d)) {
        return false;
      }
      try {
        const _0x201d52 = new Set(_0xdde23b);
        const _0x21725c = fs.readFileSync(_0x56e91d, "utf8");
        const _0x106389 = crypto.createDecipheriv("aes-256-cbc", _0x13a67a, _0x500f4c);
        let _0x14cbc9 = _0x106389.update(_0x21725c, "hex", "utf8");
        _0x14cbc9 += _0x106389.final("utf8");
        let _0x269123 = JSON.parse(_0x14cbc9);
        let _0x28d35f = false;
        _0x269123.forEach(_0x1aaacc => {
          const _0x243772 = (_0x1aaacc.items || []).length;
          _0x1aaacc.items = (_0x1aaacc.items || []).filter(_0xfcae08 => {
            for (const _0x43ecfb of _0x201d52) {
              if (_0xe5a957(_0xfcae08, _0x43ecfb)) {
                return false;
              }
            }
            return true;
          });
          if (_0x1aaacc.items.length !== _0x243772) {
            _0x28d35f = true;
          }
        });
        const _0x58c50e = _0x269123.filter(_0x4faf13 => _0x4faf13.items.length > 0 || _0x4faf13.remark && _0x4faf13.remark.trim() !== "");
        if (_0x58c50e.length !== _0x269123.length) {
          _0x28d35f = true;
        }
        if (_0x28d35f) {
          const _0x76feb8 = crypto.createCipheriv("aes-256-cbc", _0x13a67a, _0x500f4c);
          let _0x1c8730 = _0x76feb8.update(JSON.stringify(_0x58c50e), "utf8", "hex");
          _0x1c8730 += _0x76feb8.final("hex");
          fs.writeFileSync(_0x56e91d, _0x1c8730);
          return true;
        }
        return false;
      } catch (_0x14e8a9) {
        console.error("[Main] delete-leads-from-history failed:", _0x14e8a9?.message || _0x14e8a9);
        return false;
      }
    });
    ipcMain.handle("delete-low-intention-leads", async () => {
      try {
        await _0x2e89ba();
        if (_0x1a271f()) {
          return {
            success: true,
            deleted: dbManager.deleteLowIntentionLeads()
          };
        }
        return {
          success: false,
          fallback: true
        };
      } catch (_0x1ec3fd) {
        return {
          success: false,
          error: _0x1ec3fd?.message || String(_0x1ec3fd)
        };
      }
    });
    ipcMain.handle("delete-touched-leads", async () => {
      try {
        await _0x2e89ba();
        if (_0x1a271f()) {
          return {
            success: true,
            deleted: dbManager.deleteTouchedLeads()
          };
        }
        return {
          success: false,
          fallback: true
        };
      } catch (_0x5910e9) {
        return {
          success: false,
          error: _0x5910e9?.message || String(_0x5910e9)
        };
      }
    });
    ipcMain.handle("delete-failed-batch-follow-leads", async () => {
      try {
        await _0x2e89ba();
        if (!_0x1a271f()) {
          return {
            success: false,
            error: "SQLite 线索库未就绪"
          };
        }
        return {
          success: true,
          deleted: dbManager.deleteFailedBatchFollowLeads()
        };
      } catch (_0x922cc9) {
        console.error("[Main] delete-failed-batch-follow-leads failed:", _0x922cc9?.message || _0x922cc9);
        return {
          success: false,
          error: _0x922cc9?.message || String(_0x922cc9)
        };
      }
    });
    ipcMain.handle("get-last-export-task-timestamp", () => {
      return _0x265f36.get("last_export_task_timestamp") || 0;
    });
    ipcMain.handle("set-last-export-task-timestamp", (_0x404ba0, _0x35bef9) => {
      _0x265f36.set("last_export_task_timestamp", _0x35bef9 || 0);
      return {
        success: true
      };
    });
    ipcMain.handle("delete-tasks", async (_0x3be150, _0x29df24) => {
      if (!fs.existsSync(_0x56e91d)) {
        return {
          success: true
        };
      }
      try {
        const _0x3c6f19 = fs.readFileSync(_0x56e91d, "utf8");
        const _0x4b9f98 = crypto.createDecipheriv("aes-256-cbc", _0x13a67a, _0x500f4c);
        let _0x1d89e7 = _0x4b9f98.update(_0x3c6f19, "hex", "utf8");
        _0x1d89e7 += _0x4b9f98.final("utf8");
        let _0x10221e = JSON.parse(_0x1d89e7);
        _0x10221e = _0x10221e.filter(_0x1c63df => !_0x29df24.includes(_0x1c63df.taskId));
        const _0x1a2ea2 = crypto.createCipheriv("aes-256-cbc", _0x13a67a, _0x500f4c);
        let _0x1f5e05 = _0x1a2ea2.update(JSON.stringify(_0x10221e), "utf8", "hex");
        _0x1f5e05 += _0x1a2ea2.final("hex");
        fs.writeFileSync(_0x56e91d, _0x1f5e05);
        return {
          success: true
        };
      } catch (_0x1bb311) {
        console.error("删除任务失败", _0x1bb311);
        return {
          success: false,
          msg: _0x1bb311.message
        };
      }
    });
    ipcMain.handle("clear-all-history", async () => {
      try {
        if (_0x1a271f()) {
          dbManager.clearAllLeads();
          console.log("[Main] [历史清空] 已清空 SQLite 线索库");
          return true;
        }
        const _0x34c7d7 = crypto.createCipheriv("aes-256-cbc", _0x13a67a, _0x500f4c);
        let _0x2a83ff = _0x34c7d7.update(JSON.stringify([]), "utf8", "hex");
        _0x2a83ff += _0x34c7d7.final("hex");
        fs.writeFileSync(_0x56e91d, _0x2a83ff);
        console.log("[Main] [历史清空] 已清空全部线索历史");
        return true;
      } catch (_0x1df97e) {
        console.error("清空历史记录失败", _0x1df97e);
        return false;
      }
    });
  }
  return {
    registerIpc: _0x45a4b3,
    historyItemMatchesLeadId: _0xe5a957,
    isVideoInProcessedStore: _0x205588,
    broadcastProcessedVideoSync: _0x365b7d,
    broadcastForgetProcessedVideos: _0x48905f,
    toCollectedVideoLeadKey: _0x2e89a7,
    resolveProcessedVideoRecordMeta: _0x48558e
  };
}
module.exports = {
  registerLeadsHistoryIpc: registerLeadsHistoryIpc
};
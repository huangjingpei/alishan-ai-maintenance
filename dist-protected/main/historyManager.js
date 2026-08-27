class HistoryManager {
  constructor(_0x1ce838, _0x3596a3, _0x4c4af8 = {}) {
    this.store = _0x1ce838;
    this.ipcMain = _0x3596a3;
    this.onProcessedVideosRemoved = typeof _0x4c4af8.onProcessedVideosRemoved === "function" ? _0x4c4af8.onProcessedVideosRemoved : null;
    this.migrateLegacyData();
    this.registerHandlers();
  }
  setProcessedVideosRemovedHandler(_0x2fcf6f) {
    this.onProcessedVideosRemoved = typeof _0x2fcf6f === "function" ? _0x2fcf6f : null;
  }
  migrateLegacyData() {
    try {
      const _0x441c8c = this.store.get("global_blacklist", []);
      const _0x443c54 = this.store.get("global_blacklist_v2", []);
      let _0x14be4d = [];
      let _0x3797c3 = false;
      const _0x2718dd = new Set();
      _0x443c54.forEach(_0x57002f => {
        if (!_0x57002f) {
          return;
        }
        const _0x5f2e05 = typeof _0x57002f === "string" ? _0x57002f : _0x57002f.id || _0x57002f.userUrl || _0x57002f.nickname;
        if (_0x5f2e05 && !_0x2718dd.has(_0x5f2e05)) {
          _0x2718dd.add(_0x5f2e05);
          _0x14be4d.push(typeof _0x57002f === "string" ? {
            id: _0x57002f,
            timestamp: Date.now()
          } : _0x57002f);
          _0x3797c3 = true;
        }
      });
      _0x441c8c.forEach(_0x50071f => {
        if (!_0x50071f) {
          return;
        }
        const _0x4e9a93 = typeof _0x50071f === "string" ? _0x50071f : _0x50071f.id || _0x50071f.userUrl || _0x50071f.nickname;
        if (_0x4e9a93 && !_0x2718dd.has(_0x4e9a93)) {
          _0x2718dd.add(_0x4e9a93);
          _0x14be4d.push(typeof _0x50071f === "string" ? {
            id: _0x50071f,
            timestamp: Date.now()
          } : _0x50071f);
          _0x3797c3 = true;
        }
      });
      const _0xfe340a = _0x441c8c.some(_0x2f83b1 => typeof _0x2f83b1 === "string");
      if (_0xfe340a && _0x443c54.length === 0) {
        _0x14be4d = _0x441c8c.map(_0x6a6f1b => typeof _0x6a6f1b === "string" ? {
          id: _0x6a6f1b,
          timestamp: Date.now()
        } : _0x6a6f1b);
        _0x3797c3 = true;
      }
      if (_0x3797c3) {
        this.store.set("global_blacklist", _0x14be4d);
        this.store.delete("global_blacklist_v2");
        console.log("[HistoryManager] 黑名单成功无缝合并迁移，共 " + _0x14be4d.length + " 条记录");
      }
      const _0xbc0747 = this.store.get("processed_videos_detail", []);
      const _0x3fc079 = this.store.get("processed_videos", []);
      const _0x430172 = this.store.get("processed_videos_v2", []);
      let _0xb8722c = [..._0xbc0747];
      let _0x4dcc4d = false;
      const _0x207ac3 = new Set(_0xbc0747.map(_0x56c788 => _0x56c788.url));
      _0x430172.forEach(_0x1cb161 => {
        if (!_0x1cb161) {
          return;
        }
        const _0x4ec082 = typeof _0x1cb161 === "string" ? _0x1cb161 : _0x1cb161.url;
        if (_0x4ec082 && !_0x207ac3.has(_0x4ec082)) {
          _0x207ac3.add(_0x4ec082);
          _0xb8722c.push({
            url: _0x4ec082,
            title: "历史扫描记录",
            platform: "douyin",
            timestamp: typeof _0x1cb161 === "object" ? _0x1cb161.timestamp || Date.now() : Date.now()
          });
          _0x4dcc4d = true;
        }
      });
      _0x3fc079.forEach(_0x1ca069 => {
        if (_0x1ca069 && !_0x207ac3.has(_0x1ca069)) {
          _0x207ac3.add(_0x1ca069);
          _0xb8722c.push({
            url: _0x1ca069,
            title: "历史扫描记录",
            platform: "douyin",
            timestamp: Date.now()
          });
          _0x4dcc4d = true;
        }
      });
      if (_0x4dcc4d) {
        this.store.set("processed_videos_detail", _0xb8722c);
        this.store.delete("processed_videos");
        this.store.delete("processed_videos_v2");
        console.log("[HistoryManager] 视频扫描记忆成功无缝合并迁移，共 " + _0xb8722c.length + " 条记录");
      }
    } catch (_0x5a726f) {
      console.error("[HistoryManager] 启动数据迁移桥接发生异常:", _0x5a726f);
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
    this.ipcMain.handle("remove-from-blacklist", (_0x4fa8b3, _0xc79e19) => {
      const _0x5ec173 = this.store.get("global_blacklist", []);
      const _0x4e9656 = _0x5ec173.filter(_0x4ba4d2 => {
        const _0x160d3b = typeof _0x4ba4d2 === "string" ? _0x4ba4d2 : _0x4ba4d2.id;
        return !_0xc79e19.includes(_0x160d3b);
      });
      this.store.set("global_blacklist", _0x4e9656);
      return true;
    });
    this.ipcMain.on("add-to-blacklist", (_0x545aba, _0x112ffb) => {
      const _0xee68ed = Date.now();
      const _0x33a0ca = this.store.get("global_blacklist", []);
      let _0x16a988 = false;
      (Array.isArray(_0x112ffb) ? _0x112ffb : [_0x112ffb]).forEach(_0x146903 => {
        if (!_0x146903) {
          return;
        }
        const _0x6abeca = typeof _0x146903 === "string" ? _0x146903 : _0x146903.id || _0x146903.userUrl || _0x146903.nickname;
        if (!_0x6abeca) {
          return;
        }
        const _0xffc443 = _0x33a0ca.findIndex(_0x380256 => (typeof _0x380256 === "string" ? _0x380256 : _0x380256.id || _0x380256.userUrl || _0x380256.nickname) === _0x6abeca);
        if (_0xffc443 === -1) {
          const _0x1a7ba3 = typeof _0x146903 === "string" ? {
            id: _0x146903,
            timestamp: _0xee68ed
          } : {
            ..._0x146903,
            timestamp: _0xee68ed
          };
          _0x33a0ca.push(_0x1a7ba3);
          _0x16a988 = true;
        } else if (typeof _0x146903 === "object" && _0x146903 !== null) {
          const _0x1e0e54 = typeof _0x33a0ca[_0xffc443] === "string" ? {
            id: _0x33a0ca[_0xffc443]
          } : _0x33a0ca[_0xffc443];
          _0x33a0ca[_0xffc443] = {
            ..._0x1e0e54,
            ..._0x146903,
            timestamp: Math.max(_0x1e0e54.timestamp || 0, _0x146903.timestamp || _0xee68ed, _0xee68ed),
            touchSummary: _0x146903.touchSummary || _0x1e0e54.touchSummary,
            lastChannel: _0x146903.lastChannel || _0x1e0e54.lastChannel
          };
          _0x16a988 = true;
        }
      });
      if (_0x16a988) {
        let _0x45f265 = _0x33a0ca;
        if (_0x45f265.length > 8000) {
          _0x45f265 = _0x45f265.slice(-8000);
        }
        this.store.set("global_blacklist", _0x45f265);
        const {
          BrowserWindow: _0x1788a4
        } = require("electron");
        const _0x5ba163 = _0x1788a4.getAllWindows().flatMap(_0x1fcfab => _0x1fcfab.getBrowserViews ? _0x1fcfab.getBrowserViews() : []);
        _0x5ba163.forEach(_0x130a43 => {
          if (_0x130a43 && !_0x130a43.webContents.isDestroyed()) {
            _0x130a43.webContents.send("sync-interacted-user", {
              entries: Array.isArray(_0x112ffb) ? _0x112ffb : [_0x112ffb]
            });
          }
        });
      }
    });
    this.ipcMain.handle("get-processed-videos", () => {
      try {
        const _0x1f51e9 = require("./processedVideosAccess");
        return _0x1f51e9.listHistoryVideos(this.store);
      } catch (_0x2874ac) {
        return this.store.get("processed_videos_detail", []).filter(_0x3e86c6 => _0x3e86c6?.recordType !== "collected_link");
      }
    });
    this.ipcMain.handle("get-processed-videos-page", (_0x4f59e0, _0x5b4111 = {}) => {
      try {
        const _0x475834 = require("./processedVideosAccess");
        return _0x475834.listHistoryVideosPage(this.store, _0x5b4111 || {});
      } catch (_0x429281) {
        return {
          items: [],
          total: 0,
          page: 1,
          pageSize: 20,
          error: _0x429281?.message || String(_0x429281)
        };
      }
    });
    this.ipcMain.handle("remove-processed-videos", (_0x11ccd9, _0x192546) => {
      const _0x45a003 = Array.isArray(_0x192546) ? _0x192546 : [_0x192546];
      try {
        const _0x11926b = require("./processedVideosAccess");
        _0x11926b.removeByUrls(this.store, _0x45a003);
      } catch (_0x2917e7) {
        const {
          processedVideoKeysMatch: _0x6e253
        } = require("../shared/processedVideoKey");
        let _0x4cc6be = this.store.get("processed_videos_detail", []);
        const _0x2ebf72 = _0x4cc6be.filter(_0x585a84 => !_0x45a003.some(_0x44123e => _0x6e253(_0x585a84.url, _0x44123e)));
        this.store.set("processed_videos_detail", _0x2ebf72);
      }
      try {
        this.onProcessedVideosRemoved?.(_0x45a003);
      } catch (_0x4285fc) {}
      return true;
    });
    this.ipcMain.handle("get-batch-follow-runs", (_0x46ad7b, _0x259b5a = {}) => this.getBatchRunSummariesPage(_0x259b5a));
    this.ipcMain.handle("get-batch-follow-runs-page", (_0x4eb421, _0x20d5f6 = {}) => this.getBatchRunSummariesPage(_0x20d5f6));
    this.ipcMain.handle("get-batch-follow-run", (_0x417f98, _0x25497d = {}) => {
      const _0x1e2d06 = _0x25497d?.id || _0x25497d?.runId || _0x25497d;
      return this.getBatchRunById(_0x1e2d06);
    });
    this.ipcMain.handle("delete-batch-follow-runs", (_0x54d4d6, _0x2cef48) => this.deleteBatchRuns(_0x2cef48));
    this.ipcMain.handle("clear-batch-follow-runs", () => this.clearBatchRuns());
  }
  getBatchRunsAccess() {
    return require("./batchFollowRunsAccess");
  }
  getBatchRuns() {
    return this.getBatchRunsAccess().listAll(this.store);
  }
  getBatchRunSummariesPage(_0x574b2c = {}) {
    return this.getBatchRunsAccess().listSummariesPage(this.store, _0x574b2c || {});
  }
  getBatchRunById(_0x28dff4) {
    return this.getBatchRunsAccess().getById(this.store, _0x28dff4);
  }
  saveBatchRuns(_0x40292f) {
    return this.getBatchRunsAccess().replaceAll(this.store, _0x40292f);
  }
  createBatchRun(_0x3fedcd) {
    if (!_0x3fedcd || !_0x3fedcd.id) {
      return null;
    }
    return this.getBatchRunsAccess().upsert(this.store, {
      ..._0x3fedcd,
      results: Array.isArray(_0x3fedcd.results) ? _0x3fedcd.results : [],
      logs: Array.isArray(_0x3fedcd.logs) ? _0x3fedcd.logs : []
    });
  }
  updateBatchRun(_0x1a90db, _0x48926f) {
    if (_0x1a90db == null) {
      return null;
    }
    const _0x4dd3f5 = this.getBatchRunsAccess();
    const _0x2393da = _0x4dd3f5.getById(this.store, _0x1a90db);
    if (!_0x2393da) {
      return null;
    }
    const _0x3b1130 = typeof _0x48926f === "function" ? _0x48926f(_0x2393da) : {
      ..._0x2393da,
      ..._0x48926f
    };
    if (!_0x3b1130) {
      return null;
    }
    return _0x4dd3f5.upsert(this.store, _0x3b1130);
  }
  appendBatchRunResult(_0x2272c4, _0x3197c5, _0x51c640 = {}) {
    return this.updateBatchRun(_0x2272c4, _0x3b4357 => {
      const _0x23dd12 = Array.isArray(_0x3b4357.results) ? _0x3b4357.results.slice() : [];
      _0x23dd12.unshift({
        id: Date.now() + "_" + Math.random().toString(36).slice(2, 8),
        timestamp: Date.now(),
        ..._0x3197c5
      });
      const _0xda6e84 = !!_0x3197c5?.skipped || !!_0x3197c5?.skipReason;
      const _0x1f0b71 = _0x51c640.success ?? (_0x3b4357.success || 0) + (_0x3197c5?.success && !_0xda6e84 ? 1 : 0);
      const _0x48566e = _0x51c640.failed ?? (_0x3b4357.failed || 0) + (!_0x3197c5?.success && !_0xda6e84 ? 1 : 0);
      return {
        ..._0x3b4357,
        total: _0x51c640.total ?? _0x3b4357.total,
        current: _0x51c640.current ?? (_0x3b4357.current || 0) + 1,
        success: _0x1f0b71,
        failed: _0x48566e,
        skipped: (_0x3b4357.skipped || 0) + (_0xda6e84 ? 1 : 0),
        results: _0x23dd12
      };
    });
  }
  appendBatchRunLog(_0x181438, _0x1e2f72 = {}) {
    const _0x1ec5b5 = Number(_0x1e2f72.ts) || Date.now();
    const _0x4902cb = {
      id: _0x1e2f72.id || _0x1ec5b5 + "_" + Math.random().toString(36).slice(2, 8),
      runId: _0x181438,
      ts: _0x1ec5b5,
      time: _0x1e2f72.time || new Date(_0x1ec5b5).toLocaleTimeString("zh-CN", {
        hour12: false
      }),
      level: _0x1e2f72.level || "normal",
      message: String(_0x1e2f72.message || "").trim(),
      accountId: _0x1e2f72.accountId || "",
      accountName: _0x1e2f72.accountName || "",
      viewKey: _0x1e2f72.viewKey || "",
      leadId: _0x1e2f72.leadId || "",
      leadName: _0x1e2f72.leadName || "",
      phase: _0x1e2f72.phase || "trace"
    };
    if (!_0x4902cb.message) {
      return null;
    }
    const _0x3423a5 = this.updateBatchRun(_0x181438, _0x3b8861 => {
      const _0x338a5d = Array.isArray(_0x3b8861.logs) ? _0x3b8861.logs.slice() : [];
      _0x338a5d.push(_0x4902cb);
      return {
        ..._0x3b8861,
        logs: _0x338a5d
      };
    });
    if (_0x3423a5) {
      return _0x4902cb;
    } else {
      return null;
    }
  }
  finalizeBatchRun(_0x4d7838, _0x1b4bec = "completed") {
    return this.updateBatchRun(_0x4d7838, _0x28b51a => {
      if (!_0x28b51a || _0x28b51a.status === "completed" || _0x28b51a.status === "stopped") {
        return _0x28b51a;
      }
      return {
        ..._0x28b51a,
        status: _0x1b4bec,
        endedAt: Date.now()
      };
    });
  }
  deleteBatchRuns(_0x35e6c7 = []) {
    this.getBatchRunsAccess().deleteByIds(this.store, _0x35e6c7);
    return true;
  }
  clearBatchRuns() {
    const _0x1f52e9 = require("./batchFollowRunsAccess");
    return _0x1f52e9.clearAll(this.store);
  }
  isBlacklisted(_0x26771d) {
    const _0x27e652 = this.store.get("global_blacklist", []);
    return _0x27e652.some(_0x32d3d7 => {
      if (typeof _0x32d3d7 === "string") {
        return _0x32d3d7 === _0x26771d;
      }
      return _0x32d3d7.id === _0x26771d || _0x32d3d7.userUrl === _0x26771d || _0x32d3d7.nickname === _0x26771d;
    });
  }
  isProcessedVideo(_0x1bdf1d) {
    try {
      const _0x2a08c5 = require("./processedVideosAccess");
      return _0x2a08c5.isProcessed(this.store, _0x1bdf1d);
    } catch (_0x401ae9) {
      const {
        processedVideoKeysMatch: _0xb13816
      } = require("../shared/processedVideoKey");
      const _0x2e3570 = this.store.get("processed_videos_detail", []);
      return _0x2e3570.some(_0x137d0a => _0xb13816(_0x137d0a.url, _0x1bdf1d));
    }
  }
}
module.exports = HistoryManager;
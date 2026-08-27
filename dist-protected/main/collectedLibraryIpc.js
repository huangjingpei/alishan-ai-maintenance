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
function registerCollectedLibraryIpc(_0x28d522) {
  const {
    store: _0x9ca9ae,
    ensureDatabaseInitialized: _0x43888e,
    isLeadsSqliteRuntime: _0x4f4070,
    HISTORY_FILE: _0x1fdc85,
    CRYPTO_KEY: _0x4b22a4,
    CRYPTO_IV: _0x931b03,
    getPlatformViews: _0x45885f,
    inFlightProcessedVideos: _0x5c6c75,
    historyManager: _0x2491e5
  } = _0x28d522;
  function _0x4d3e79(_0x2cecc6 = []) {
    const _0x37f199 = (Array.isArray(_0x2cecc6) ? _0x2cecc6 : []).map(_0x534c4c => String(_0x534c4c || "").trim()).filter(Boolean);
    if (!_0x37f199.length) {
      return;
    }
    for (const _0x5b3408 of _0x37f199) {
      _0x5c6c75.delete(_0x5b3408);
      const _0x5d7ec2 = extractDouyinVideoId(_0x5b3408);
      if (_0x5d7ec2) {
        _0x5c6c75.delete("https://www.douyin.com/video/" + _0x5d7ec2);
      }
    }
    _0x45885f().forEach(_0x47dc80 => {
      if (_0x47dc80 && !_0x47dc80.webContents.isDestroyed()) {
        _0x47dc80.webContents.send("forget-processed-videos", {
          urls: _0x37f199
        });
      }
    });
  }
  try {
    _0x2491e5?.setProcessedVideosRemovedHandler?.(_0x4d3e79);
  } catch (_0x1a5385) {}
  function _0x4d8519(_0x3ddba0, _0x33e5b8) {
    if (_0x33e5b8.length > 0) {
      processedVideosAccess.clearAuthorUrls(_0x9ca9ae, _0x33e5b8);
    }
    if (_0x3ddba0.length > 0) {
      processedVideosAccess.removeByUrls(_0x9ca9ae, _0x3ddba0);
      _0x4d3e79(_0x3ddba0);
    }
  }
  function _0x51e116(_0x550d66, _0x49b0b7) {
    const _0x336d23 = [..._0x550d66, ..._0x49b0b7];
    return {
      videos: _0x550d66,
      authors: _0x49b0b7,
      tasks: [{
        taskId: "sqlite_collected",
        taskName: "采集库",
        timestamp: Date.now(),
        items: _0x336d23
      }]
    };
  }
  function _0x3f7662() {
    ipcMain.handle("list-collected-video-import-keys", async () => {
      try {
        await _0x43888e();
        if (!_0x4f4070()) {
          return {
            keys: []
          };
        }
        const _0x4481a6 = dbManager.listCollectedVideoImportKeys?.() || [];
        const _0x4ad016 = [];
        for (const _0x428370 of _0x4481a6) {
          if (_0x428370.videoId) {
            _0x4ad016.push(_0x428370.videoId);
          }
          const _0x4114f7 = normalizeProcessedVideoKey(_0x428370.videoUrl || "");
          if (_0x4114f7) {
            _0x4ad016.push(_0x4114f7);
          }
          if (_0x428370.videoUrl) {
            _0x4ad016.push(String(_0x428370.videoUrl).trim());
          }
        }
        return {
          keys: [...new Set(_0x4ad016.filter(Boolean))]
        };
      } catch (_0x1e32c7) {
        console.error("[Main] list-collected-video-import-keys failed:", _0x1e32c7?.message || _0x1e32c7);
        return {
          keys: []
        };
      }
    });
    ipcMain.handle("get-collected-videos-page", async (_0x2cdd2a, _0x5b86d6 = {}) => {
      try {
        await _0x43888e();
        if (!_0x4f4070()) {
          return {
            items: [],
            total: 0,
            runtime: "enc"
          };
        }
        const _0x594d3c = Math.max(1, Number(_0x5b86d6.page) || Number(_0x5b86d6.current) || 1);
        const _0x4d2a4e = Math.max(1, Math.min(500, Number(_0x5b86d6.pageSize) || Number(_0x5b86d6.limit) || 50));
        const _0x2ca382 = (_0x594d3c - 1) * _0x4d2a4e;
        const _0x5a2734 = dbManager.queryCollectedVideosPage({
          offset: _0x2ca382,
          limit: _0x4d2a4e,
          keyword: _0x5b86d6.keyword || _0x5b86d6.search || ""
        });
        return {
          ..._0x5a2734,
          page: _0x594d3c,
          pageSize: _0x4d2a4e,
          runtime: "sqlite"
        };
      } catch (_0x51d833) {
        console.error("[Main] get-collected-videos-page failed:", _0x51d833?.message || _0x51d833);
        return {
          items: [],
          total: 0,
          error: _0x51d833?.message || String(_0x51d833)
        };
      }
    });
    ipcMain.handle("get-collected-authors-page", async (_0x1cbfb8, _0x215c79 = {}) => {
      try {
        await _0x43888e();
        if (!_0x4f4070()) {
          return {
            items: [],
            total: 0,
            runtime: "enc"
          };
        }
        const _0x180d13 = Math.max(1, Number(_0x215c79.page) || Number(_0x215c79.current) || 1);
        const _0x1dbb70 = Math.max(1, Math.min(500, Number(_0x215c79.pageSize) || Number(_0x215c79.limit) || 50));
        const _0x3c5f14 = (_0x180d13 - 1) * _0x1dbb70;
        const _0x5b7da4 = dbManager.queryCollectedAuthorsPage({
          offset: _0x3c5f14,
          limit: _0x1dbb70,
          keyword: _0x215c79.keyword || _0x215c79.search || ""
        });
        return {
          ..._0x5b7da4,
          page: _0x180d13,
          pageSize: _0x1dbb70,
          runtime: "sqlite"
        };
      } catch (_0x329fc8) {
        console.error("[Main] get-collected-authors-page failed:", _0x329fc8?.message || _0x329fc8);
        return {
          items: [],
          total: 0,
          error: _0x329fc8?.message || String(_0x329fc8)
        };
      }
    });
    ipcMain.handle("get-collected-videos-library", async () => {
      try {
        await _0x43888e();
        if (!_0x4f4070()) {
          return {
            items: []
          };
        }
        const _0x3cbf6f = dbManager.queryCollectedVideosPage({
          offset: 0,
          limit: 200
        });
        return {
          items: _0x3cbf6f.items,
          total: _0x3cbf6f.total,
          truncated: _0x3cbf6f.total > _0x3cbf6f.items.length
        };
      } catch (_0x1e1baf) {
        console.error("[Main] get-collected-videos-library failed:", _0x1e1baf?.message || _0x1e1baf);
        return {
          items: []
        };
      }
    });
    ipcMain.handle("get-collected-authors-library", async () => {
      try {
        await _0x43888e();
        if (!_0x4f4070()) {
          return {
            items: []
          };
        }
        const _0x5d52a4 = dbManager.queryCollectedAuthorsPage({
          offset: 0,
          limit: 200
        });
        return {
          items: _0x5d52a4.items,
          total: _0x5d52a4.total,
          truncated: _0x5d52a4.total > _0x5d52a4.items.length
        };
      } catch (_0x2cf8c0) {
        console.error("[Main] get-collected-authors-library failed:", _0x2cf8c0?.message || _0x2cf8c0);
        return {
          items: []
        };
      }
    });
    ipcMain.handle("get-collected-link-library", async (_0x3ec09a, _0x381cea = {}) => {
      try {
        await _0x43888e();
        if (_0x4f4070()) {
          const _0x3a0270 = Math.max(1, Math.min(500, Number(_0x381cea.pageSize) || Number(_0x381cea.limit) || 200));
          const _0x766247 = String(_0x381cea.keyword || _0x381cea.search || "").trim();
          const _0x13ad28 = dbManager.queryCollectedVideosPage({
            offset: 0,
            limit: _0x3a0270,
            keyword: _0x766247
          });
          const _0x464fcf = dbManager.queryCollectedAuthorsPage({
            offset: 0,
            limit: _0x3a0270,
            keyword: _0x766247
          });
          if (!dbManager.isCollectedSplitMigrationDone?.()) {
            const _0x55c3a8 = dbManager.listVideoCardLeads();
            const _0x51a2f5 = _0x55c3a8.filter(_0x40ce36 => {
              const _0x2ce1e5 = Array.isArray(_0x40ce36.collectedFields) ? _0x40ce36.collectedFields : [];
              return _0x2ce1e5.includes("video") || _0x2ce1e5.length === 0;
            }).slice(0, _0x3a0270);
            const _0x12fbbc = _0x55c3a8.filter(_0xc1d722 => Array.isArray(_0xc1d722.collectedFields) && _0xc1d722.collectedFields.includes("author")).slice(0, _0x3a0270);
            const _0x294e94 = _0x51e116(_0x51a2f5, _0x12fbbc);
            return {
              videos: _0x294e94.videos,
              authors: _0x294e94.authors,
              tasks: _0x294e94.tasks,
              items: _0x294e94.tasks,
              truncated: true
            };
          }
          const _0x1906ff = _0x51e116(_0x13ad28.items, _0x464fcf.items);
          return {
            videos: _0x1906ff.videos,
            authors: _0x1906ff.authors,
            tasks: _0x1906ff.tasks,
            items: _0x1906ff.tasks,
            videosTotal: _0x13ad28.total,
            authorsTotal: _0x464fcf.total,
            truncated: _0x13ad28.total > _0x13ad28.items.length || _0x464fcf.total > _0x464fcf.items.length
          };
        }
        if (!fs.existsSync(_0x1fdc85)) {
          return [];
        }
        const _0x563eeb = fs.readFileSync(_0x1fdc85, "utf8");
        const _0x54aab1 = crypto.createDecipheriv("aes-256-cbc", _0x4b22a4, _0x931b03);
        let _0x42f2f4 = _0x54aab1.update(_0x563eeb, "hex", "utf8");
        _0x42f2f4 += _0x54aab1.final("utf8");
        return JSON.parse(_0x42f2f4);
      } catch (_0x24afb3) {
        console.error("[Main] get-collected-link-library failed:", _0x24afb3?.message || _0x24afb3);
        return [];
      }
    });
    ipcMain.handle("remove-collected-links-from-history", async (_0xe60c6f, _0xcaae7e = {}) => {
      const _0x433a63 = _0xcaae7e.type === "author" ? "author" : "video";
      const _0x169bdf = new Set((Array.isArray(_0xcaae7e.keys) ? _0xcaae7e.keys : [_0xcaae7e.keys]).map(_0x53ae67 => String(_0x53ae67 || "").trim()).filter(Boolean));
      if (_0x169bdf.size === 0) {
        return false;
      }
      const _0x50aac9 = _0x19137e => {
        const _0x298c0 = String(_0x19137e || "").trim();
        if (!_0x298c0) {
          return [];
        }
        const _0x11d64c = new Set([_0x298c0]);
        const _0x146ab4 = toCollectedVideoKey(_0x298c0);
        if (_0x146ab4) {
          _0x11d64c.add(_0x146ab4);
          const _0xb043e9 = _0x146ab4.slice(6);
          _0x11d64c.add("https://www.douyin.com/video/" + _0xb043e9);
          const _0x42f27c = normalizeProcessedVideoKey("https://www.douyin.com/video/" + _0xb043e9);
          if (_0x42f27c) {
            _0x11d64c.add(_0x42f27c);
          }
        }
        const _0x1dc05d = toCollectedAuthorKey(_0x298c0);
        if (_0x1dc05d) {
          _0x11d64c.add(_0x1dc05d);
        }
        const _0x1e1b8f = extractAuthorSecUid(_0x298c0);
        if (_0x1e1b8f) {
          _0x11d64c.add(_0x1e1b8f);
          _0x11d64c.add("author:" + _0x1e1b8f);
        }
        const _0x3c2824 = normalizeProcessedVideoKey(_0x298c0) || "";
        if (_0x3c2824) {
          _0x11d64c.add(_0x3c2824);
        }
        return [..._0x11d64c].filter(Boolean);
      };
      const _0x58048b = new Set();
      _0x169bdf.forEach(_0x4364fb => _0x50aac9(_0x4364fb).forEach(_0x3607a0 => _0x58048b.add(_0x3607a0)));
      if (_0x4f4070()) {
        try {
          const _0x5dbf5c = [];
          const _0x3695c2 = [];
          let _0x4d7937 = false;
          if (_0x433a63 === "video") {
            const _0xcc3bd3 = [..._0x169bdf].map(_0xdb39d8 => toCollectedVideoKey(_0xdb39d8)).filter(Boolean);
            for (const _0x107ad2 of _0xcc3bd3) {
              const _0xa34e20 = dbManager.listCollectedVideos().find(_0x451e57 => _0x50aac9(_0x451e57.leadId || _0x451e57.videoUrl).some(_0x403f02 => _0x58048b.has(_0x403f02))) || dbManager.listCollectedVideos().find(_0x21c12f => String(_0x21c12f.leadId) === _0x107ad2);
              const _0x3d8779 = normalizeProcessedVideoKey(_0xa34e20?.videoUrl || _0xa34e20?.url || _0x107ad2);
              if (_0x3d8779) {
                _0x5dbf5c.push(_0x3d8779);
              }
            }
            const _0x1cd60c = dbManager.deleteCollectedVideosByKeys([..._0x169bdf]);
            if (_0x1cd60c > 0) {
              _0x4d7937 = true;
            }
            try {
              dbManager.deleteEntityLeadgenVideoCardsByKeys(_0xcc3bd3);
            } catch (_0x592fa5) {
              console.warn("[Main] 清理线索采集视频明细失败:", _0x592fa5?.message || _0x592fa5);
            }
          } else {
            const _0x3513bb = dbManager.deleteCollectedAuthorsByKeys([..._0x169bdf]);
            if (_0x3513bb > 0) {
              _0x4d7937 = true;
            }
            for (const _0x4ee1d7 of _0x169bdf) {
              const _0x5e1b89 = extractAuthorSecUid(_0x4ee1d7);
              if (!_0x5e1b89) {
                continue;
              }
              const _0x2817b8 = dbManager.listCollectedVideos().filter(_0x5678d3 => extractAuthorSecUid(_0x5678d3.authorProfileUrl || _0x5678d3.userUrl) === _0x5e1b89);
              for (const _0x3b0e3c of _0x2817b8) {
                const _0x57266a = normalizeProcessedVideoKey(_0x3b0e3c.videoUrl || _0x3b0e3c.url || "");
                if (_0x57266a) {
                  _0x3695c2.push(_0x57266a);
                }
              }
            }
          }
          if (!dbManager.isCollectedSplitMigrationDone?.()) {
            const _0x2c6a08 = dbManager.listVideoCardLeads();
            const _0x45b1fc = [];
            for (const _0x4193e5 of _0x2c6a08) {
              const _0x5b64a3 = new Set(Array.isArray(_0x4193e5.collectedFields) ? _0x4193e5.collectedFields : []);
              const _0x59d01c = String(_0x4193e5.leadId || _0x4193e5.key || "");
              const _0x71680b = extractAuthorSecUid(_0x4193e5.authorProfileUrl || _0x4193e5.userUrl || "");
              const _0x51d748 = _0x433a63 === "video" ? _0x50aac9(_0x59d01c).concat(_0x50aac9(_0x4193e5.videoUrl || _0x4193e5.url || "")).some(_0x206eae => _0x58048b.has(_0x206eae)) : _0x169bdf.has(_0x71680b) || _0x169bdf.has("author:" + _0x71680b);
              if (!_0x51d748) {
                continue;
              }
              _0x5b64a3.delete(_0x433a63);
              _0x4d7937 = true;
              if (_0x433a63 === "author") {
                _0x4193e5.authorProfileUrl = "";
                _0x4193e5.userUrl = "";
              }
              const _0x53bc50 = normalizeProcessedVideoKey(_0x4193e5.videoUrl || _0x4193e5.url || _0x59d01c);
              if (_0x433a63 === "video" && _0x53bc50) {
                _0x5dbf5c.push(_0x53bc50);
              } else if (_0x433a63 === "author" && _0x53bc50) {
                _0x3695c2.push(_0x53bc50);
              }
              if (_0x5b64a3.size > 0) {
                _0x4193e5.collectedFields = [..._0x5b64a3];
                dbManager.upsertLead(_0x4193e5);
                if (_0x433a63 === "video" && _0x5b64a3.has("author") === false) {
                  _0x45b1fc.push(_0x4193e5.leadId || _0x4193e5.key);
                }
              } else {
                _0x45b1fc.push(_0x4193e5.leadId || _0x4193e5.key || _0x59d01c);
              }
            }
            if (_0x45b1fc.length) {
              dbManager.deleteLeadsByIds([...new Set(_0x45b1fc.map(String).filter(Boolean))]);
            }
          }
          if (!_0x4d7937) {
            return false;
          }
          _0x4d8519(_0x5dbf5c, _0x3695c2);
          return true;
        } catch (_0x5be197) {
          console.error("[Main] 批量删除采集链接(SQLite)失败:", _0x5be197);
          return false;
        }
      }
      if (!_0x1fdc85 || !fs.existsSync(_0x1fdc85)) {
        return false;
      }
      try {
        const _0x311e57 = fs.readFileSync(_0x1fdc85, "utf8");
        const _0x25087c = crypto.createDecipheriv("aes-256-cbc", _0x4b22a4, _0x931b03);
        let _0x6edf63 = _0x25087c.update(_0x311e57, "hex", "utf8");
        _0x6edf63 += _0x25087c.final("utf8");
        let _0x518a53 = JSON.parse(_0x6edf63);
        let _0x40d9ea = false;
        const _0x212062 = [];
        const _0x2d642c = [];
        const _0x26c120 = _0x3726b9 => extractAuthorSecUid(_0x3726b9);
        _0x518a53.forEach(_0x15998f => {
          const _0x121988 = [];
          (Array.isArray(_0x15998f.items) ? _0x15998f.items : []).forEach(_0x5897eb => {
            if (_0x5897eb?.leadKind !== "video_card") {
              _0x121988.push(_0x5897eb);
              return;
            }
            const _0xc17e9b = new Set(Array.isArray(_0x5897eb.collectedFields) ? _0x5897eb.collectedFields : []);
            const _0x2213cf = String(_0x5897eb.leadId || _0x5897eb.key || normalizeProcessedVideoKey(_0x5897eb.videoUrl || _0x5897eb.url || ""));
            const _0x249ef3 = _0x26c120(_0x5897eb.authorProfileUrl || _0x5897eb.userUrl || "");
            const _0x254fcc = _0x433a63 === "video" ? _0x50aac9(_0x2213cf).concat(_0x50aac9(_0x5897eb.videoUrl || _0x5897eb.url || "")).some(_0x266651 => _0x58048b.has(_0x266651)) : _0x169bdf.has(_0x249ef3) || _0x169bdf.has("author:" + _0x249ef3);
            if (!_0x254fcc) {
              _0x121988.push(_0x5897eb);
              return;
            }
            _0xc17e9b.delete(_0x433a63);
            _0x40d9ea = true;
            if (_0x433a63 === "author") {
              _0x5897eb.authorProfileUrl = "";
              _0x5897eb.userUrl = "";
            }
            const _0x3250f6 = normalizeProcessedVideoKey(_0x5897eb.videoUrl || _0x5897eb.url || _0x2213cf);
            if ((_0x433a63 === "video" || _0xc17e9b.size === 0) && _0x3250f6) {
              _0x212062.push(_0x3250f6);
            } else if (_0x433a63 === "author" && _0x3250f6) {
              _0x2d642c.push(_0x3250f6);
            }
            if (_0xc17e9b.size > 0) {
              _0x5897eb.collectedFields = [..._0xc17e9b];
              _0x121988.push(_0x5897eb);
            }
          });
          _0x15998f.items = _0x121988;
        });
        if (!_0x40d9ea) {
          return false;
        }
        _0x518a53 = _0x518a53.filter(_0xfb343d => _0xfb343d.items.length > 0 || String(_0xfb343d.remark || "").trim());
        const _0x38f155 = crypto.createCipheriv("aes-256-cbc", _0x4b22a4, _0x931b03);
        let _0x21c868 = _0x38f155.update(JSON.stringify(_0x518a53), "utf8", "hex");
        _0x21c868 += _0x38f155.final("hex");
        fs.writeFileSync(_0x1fdc85, _0x21c868);
        _0x4d8519(_0x212062, _0x2d642c);
        return true;
      } catch (_0x5c688e) {
        console.error("[Main] 批量删除采集链接(enc)失败:", _0x5c688e);
        return false;
      }
    });
    ipcMain.handle("clear-collected-library", async (_0x5fd911, _0x380a32 = {}) => {
      const _0x50a239 = _0x380a32.type === "author" ? "author" : "video";
      try {
        _0x43888e();
        if (!_0x4f4070()) {
          return {
            success: false,
            error: "sqlite_required",
            deleted: 0
          };
        }
        const _0x36992c = [];
        const _0x19d7ee = [];
        let _0x5e8ed8 = 0;
        if (_0x50a239 === "video") {
          for (const _0x365cab of dbManager.listCollectedVideoUrls?.() || []) {
            const _0x4c0cce = normalizeProcessedVideoKey(_0x365cab);
            if (_0x4c0cce) {
              _0x36992c.push(_0x4c0cce);
            }
          }
          _0x5e8ed8 = dbManager.clearAllCollectedVideos();
          try {
            dbManager.clearAllEntityLeadgenVideoCards();
          } catch (_0x1baf73) {
            console.warn("[Main] 清空线索采集视频明细失败:", _0x1baf73?.message || _0x1baf73);
          }
          if (!dbManager.isCollectedSplitMigrationDone?.()) {
            const _0x5a8ae7 = dbManager.listVideoCardLeads() || [];
            const _0x213370 = [];
            for (const _0x147c51 of _0x5a8ae7) {
              const _0x402289 = new Set(Array.isArray(_0x147c51.collectedFields) ? _0x147c51.collectedFields : []);
              if (!_0x402289.has("video") && _0x147c51.leadKind !== "video_card") {
                continue;
              }
              _0x402289.delete("video");
              const _0x481134 = normalizeProcessedVideoKey(_0x147c51.videoUrl || _0x147c51.url || _0x147c51.leadId || "");
              if (_0x481134) {
                _0x36992c.push(_0x481134);
              }
              if (_0x402289.size > 0) {
                _0x147c51.collectedFields = [..._0x402289];
                dbManager.upsertLead(_0x147c51);
              } else {
                _0x213370.push(_0x147c51.leadId || _0x147c51.key);
              }
            }
            if (_0x213370.length) {
              dbManager.deleteLeadsByIds([...new Set(_0x213370.map(String).filter(Boolean))]);
            }
          }
        } else {
          for (const _0x2fa0a8 of dbManager.listCollectedVideoUrls?.() || []) {
            const _0x306aeb = normalizeProcessedVideoKey(_0x2fa0a8);
            if (_0x306aeb) {
              _0x19d7ee.push(_0x306aeb);
            }
          }
          _0x5e8ed8 = dbManager.clearAllCollectedAuthors();
          try {
            dbManager.stripAuthorTargetFromEntityLeadgenVideoCards();
          } catch (_0x4ab28f) {
            console.warn("[Main] 剥离线索采集主页标记失败:", _0x4ab28f?.message || _0x4ab28f);
          }
          if (!dbManager.isCollectedSplitMigrationDone?.()) {
            const _0x4028e0 = dbManager.listVideoCardLeads() || [];
            for (const _0x4efc80 of _0x4028e0) {
              const _0x499490 = new Set(Array.isArray(_0x4efc80.collectedFields) ? _0x4efc80.collectedFields : []);
              if (!_0x499490.has("author")) {
                continue;
              }
              _0x499490.delete("author");
              _0x4efc80.authorProfileUrl = "";
              _0x4efc80.userUrl = "";
              _0x4efc80.collectedFields = _0x499490.size ? [..._0x499490] : ["video"];
              const _0x304e41 = normalizeProcessedVideoKey(_0x4efc80.videoUrl || _0x4efc80.url || _0x4efc80.leadId || "");
              if (_0x304e41) {
                _0x19d7ee.push(_0x304e41);
              }
              dbManager.upsertLead(_0x4efc80);
            }
          }
        }
        _0x4d8519([...new Set(_0x36992c.filter(Boolean))], [...new Set(_0x19d7ee.filter(Boolean))]);
        return {
          success: true,
          deleted: _0x5e8ed8,
          type: _0x50a239
        };
      } catch (_0x19ae68) {
        console.error("[Main] 清空采集库失败:", _0x19ae68);
        return {
          success: false,
          error: _0x19ae68?.message || String(_0x19ae68),
          deleted: 0
        };
      }
    });
    ipcMain.handle("restore-leads-collected-split", async (_0x440e7e, _0x276049 = {}) => {
      try {
        _0x43888e();
        return dbManager.restoreLeadsCollectedSplitFromBackup(_0x276049?.backupPath || "");
      } catch (_0x1e729c) {
        return {
          success: false,
          error: _0x1e729c?.message || String(_0x1e729c)
        };
      }
    });
  }
  return {
    registerIpc: _0x3f7662,
    broadcastForgetProcessedVideos: _0x4d3e79
  };
}
module.exports = {
  registerCollectedLibraryIpc: registerCollectedLibraryIpc
};
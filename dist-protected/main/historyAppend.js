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
function createHistoryAppend(_0x11b5c1) {
  const {
    reporting: _0x514d75,
    getActiveSettings: _0x2a371d,
    getViewSettingsMap: _0xab0a99,
    getLeadDedupKey: _0x5a820f,
    markCollectedLinkVideoRecords: _0x46f81c,
    isLeadsSqliteRuntime: _0x39596b,
    readHistoryRecords: _0xfca4e3,
    dbManager: _0x3f32c2,
    leadUserKey: _0x162f9d
  } = _0x11b5c1;
  function _0x3c5cac(_0x29daf1, _0x2bf370 = null) {
    const _0xfe11d9 = _0x2a371d();
    const _0x1ebf52 = _0xab0a99();
    let _0x3459cc = _0xfe11d9;
    if (_0x2bf370) {
      _0x3459cc = _0x1ebf52.get(_0x2bf370) || _0xfe11d9;
      const _0x2f00e6 = _0x1ebf52.get(_0x2bf370 + "_nickname");
      if (_0x2f00e6) {
        _0x3459cc = {
          ...(_0x3459cc || {}),
          nickname: _0x2f00e6
        };
      }
    } else if (_0x29daf1.length > 0 && _0x29daf1[0].accountId) {
      const _0x318a9c = "douyin";
      const _0x2f320b = _0x29daf1[0].accountId === "default" ? _0x318a9c : _0x318a9c + "_" + _0x29daf1[0].accountId;
      _0x3459cc = _0x1ebf52.get(_0x2f320b) || _0xfe11d9;
      const _0x36f4a9 = _0x1ebf52.get(_0x2f320b + "_nickname");
      if (_0x36f4a9) {
        _0x3459cc = {
          ...(_0x3459cc || {}),
          nickname: _0x36f4a9
        };
      }
    }
    _0x514d75.add(_0x29daf1, _0x3459cc);
  }
  function _0x12d81f(_0x3683e9, _0x44f938 = "unknown_task", _0x4d6e48 = "未命名任务") {
    let _0x5ccc5f = [];
    if (fs.existsSync(HISTORY_FILE)) {
      try {
        const _0x22b033 = fs.readFileSync(HISTORY_FILE, "utf8");
        const _0x589b2e = crypto.createDecipheriv("aes-256-cbc", CRYPTO_KEY, CRYPTO_IV);
        let _0x32ab42 = _0x589b2e.update(_0x22b033, "hex", "utf8");
        _0x32ab42 += _0x589b2e.final("utf8");
        _0x5ccc5f = JSON.parse(_0x32ab42);
      } catch (_0x5d5b7f) {
        console.error("History parse error", _0x5d5b7f);
      }
    }
    const _0x3a99b4 = new Set();
    const _0x5bcb8b = new Map();
    _0x5ccc5f.forEach(_0x4a8a9c => {
      if (_0x4a8a9c.items) {
        _0x4a8a9c.items.forEach(_0x4e238b => {
          const _0x2e7dd9 = _0x5a820f(_0x4e238b);
          if (_0x2e7dd9) {
            _0x3a99b4.add(_0x2e7dd9);
            if (!_0x5bcb8b.has(_0x2e7dd9)) {
              _0x5bcb8b.set(_0x2e7dd9, _0x4e238b);
            }
          }
        });
      }
    });
    let _0x589f7b = _0x5ccc5f.find(_0x46fbcb => _0x46fbcb.taskId === _0x44f938);
    if (!_0x589f7b) {
      _0x589f7b = {
        taskId: _0x44f938,
        taskName: _0x4d6e48,
        timestamp: Date.now(),
        platform: _0x3683e9[0]?.platform || "DY",
        accountName: _0x3683e9[0]?.accountName || "未知账号",
        items: [],
        stats: {
          videoTotal: 0
        }
      };
      _0x5ccc5f.unshift(_0x589f7b);
    }
    let _0x10eba6 = 0;
    for (const _0x24923f of _0x3683e9) {
      const _0x39d4e7 = _0x5a820f(_0x24923f);
      if (_0x39d4e7) {
        _0x24923f.leadId = _0x39d4e7;
        _0x24923f.key = _0x39d4e7;
      }
      const _0x43e1da = _0x39d4e7 ? _0x5bcb8b.get(_0x39d4e7) : null;
      const _0x3a5ccf = !_0x39d4e7 ? _0x589f7b.items.find(_0x50232f => !_0x5a820f(_0x50232f)) : null;
      if (_0x43e1da) {
        _0x162f9d.mergeLeadRecords(_0x43e1da, _0x24923f);
        _0x10eba6++;
      } else if (_0x3a5ccf) {
        _0x162f9d.mergeLeadRecords(_0x3a5ccf, _0x24923f);
        _0x10eba6++;
      } else if (!_0x3a99b4.has(_0x39d4e7)) {
        _0x589f7b.items.unshift(_0x24923f);
        _0x3a99b4.add(_0x39d4e7);
        if (_0x39d4e7) {
          _0x5bcb8b.set(_0x39d4e7, _0x24923f);
        }
        _0x10eba6++;
      }
    }
    _0x46f81c(_0x3683e9);
    if (_0x10eba6 === 0) {
      return;
    }
    console.log("[Main] [数据同步] 任务 " + _0x44f938 + " 历史记录已更新(enc), 变更项: " + _0x10eba6);
    const _0x4d0468 = 500;
    if (_0x5ccc5f.length > _0x4d0468) {
      _0x5ccc5f = _0x5ccc5f.slice(0, _0x4d0468);
    }
    try {
      const _0xb6b812 = crypto.createCipheriv("aes-256-cbc", CRYPTO_KEY, CRYPTO_IV);
      let _0xc94a79 = _0xb6b812.update(JSON.stringify(_0x5ccc5f), "utf8", "hex");
      _0xc94a79 += _0xb6b812.final("hex");
      fs.writeFileSync(HISTORY_FILE, _0xc94a79);
    } catch (_0x2f88ac) {
      console.error("History save error", _0x2f88ac);
    }
  }
  function _0x4435c9(_0x1d1e71, _0x3073e4 = "unknown_task", _0x2b6df2 = "未命名任务", _0x5c19c7 = {}) {
    const _0x5a4dec = Array.isArray(_0x1d1e71) ? _0x1d1e71.filter(Boolean) : [];
    if (!_0x5a4dec.length) {
      return 0;
    }
    const _0x38a5aa = _0x5c19c7.updateOnly === true;
    for (const _0x149cfd of _0x5a4dec) {
      const _0x89fb0 = _0x5a820f(_0x149cfd);
      if (_0x89fb0) {
        _0x149cfd.leadId = _0x89fb0;
        _0x149cfd.key = _0x89fb0;
      }
      if (!_0x149cfd.taskId) {
        _0x149cfd.taskId = _0x3073e4;
      }
      if (!_0x149cfd.taskName) {
        _0x149cfd.taskName = _0x2b6df2;
      }
      if (_0x149cfd.timestamp == null) {
        _0x149cfd.timestamp = Date.now();
      }
      if (!_0x149cfd.capturedAt) {
        _0x149cfd.capturedAt = new Date().toISOString();
      }
    }
    _0x46f81c(_0x5a4dec);
    if (_0x39596b()) {
      try {
        const _0x190571 = [];
        const _0x2ba274 = [];
        for (const _0x2f94e9 of _0x5a4dec) {
          if (_0x3f32c2.isVideoCardLeadLike?.(_0x2f94e9) || _0x2f94e9?.leadKind === "video_card" || _0x2f94e9?.sourceType === "video" || _0x2f94e9?.identityType === "video" || _0x2f94e9?.leadKind === "collected_author" || _0x2f94e9?.leadKind === "collected_video" || /^video:\d{10,}$/.test(String(_0x2f94e9?.leadId || _0x2f94e9?.key || "")) || /^author:/.test(String(_0x2f94e9?.leadId || _0x2f94e9?.key || ""))) {
            _0x2ba274.push(_0x2f94e9);
          } else {
            _0x190571.push(_0x2f94e9);
          }
        }
        let _0x298061 = 0;
        if (_0x190571.length) {
          _0x298061 += _0x3f32c2.upsertLeadsBatch(_0x190571, {
            mergeFn: (_0x4d0e9b, _0x276f49) => _0x162f9d.mergeLeadRecords(_0x4d0e9b, _0x276f49),
            updateOnly: _0x38a5aa
          });
        }
        if (_0x2ba274.length) {
          _0x298061 += _0x3f32c2.upsertLeadsBatch(_0x2ba274, {
            mergeFn: (_0x1fe80a, _0x3beefb) => _0x162f9d.mergeLeadRecords(_0x1fe80a, _0x3beefb),
            updateOnly: _0x38a5aa
          });
        }
        console.log("[Main] [数据同步] 任务 " + _0x3073e4 + " 线索已" + (_0x38a5aa ? "更新" : "写入") + " SQLite" + (" (人:" + _0x190571.length + " 采集:" + _0x2ba274.length + "), 变更项: " + _0x298061));
        return _0x298061;
      } catch (_0x1a7ae7) {
        console.error("[Main] SQLite appendHistory 失败，回退 enc:", _0x1a7ae7?.message || _0x1a7ae7);
      }
    }
    if (_0x38a5aa) {
      try {
        const _0x54393d = _0xfca4e3();
        let _0x2cc81c = 0;
        for (const _0x202515 of _0x5a4dec) {
          const _0x19aaa6 = _0x5a820f(_0x202515);
          let _0x2832ff = null;
          for (const _0x2d4ffb of _0x54393d) {
            for (const _0x4efcce of _0x2d4ffb.items || []) {
              const _0x224a95 = _0x5a820f(_0x4efcce);
              if (_0x19aaa6 && _0x224a95 && _0x19aaa6 === _0x224a95 || _0x4efcce.leadId && _0x202515.leadId && _0x4efcce.leadId === _0x202515.leadId) {
                _0x2832ff = _0x4efcce;
                break;
              }
            }
            if (_0x2832ff) {
              break;
            }
          }
          if (!_0x2832ff) {
            continue;
          }
          _0x162f9d.mergeLeadRecords(_0x2832ff, _0x202515);
          _0x2cc81c += 1;
        }
        if (_0x2cc81c > 0) {}
        return _0x2cc81c;
      } catch (_0x43bb78) {
        return 0;
      }
    }
    _0x12d81f(_0x5a4dec, _0x3073e4, _0x2b6df2);
    return _0x5a4dec.length;
  }
  return {
    addToReportQueue: _0x3c5cac,
    appendHistory: _0x4435c9,
    appendHistoryToEnc: _0x12d81f
  };
}
module.exports = {
  createHistoryAppend: createHistoryAppend
};
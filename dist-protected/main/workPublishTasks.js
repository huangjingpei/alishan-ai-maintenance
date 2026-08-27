const fs = require("fs");
const path = require("path");
const TASKS_FILE = _0x4a47ed => path.join(_0x4a47ed, "work_publish_tasks.json");
function createEmptyWorkPublishStats() {
  return {
    total: 0,
    pending: 0,
    ready: 0,
    publishing: 0,
    published: 0,
    failed: 0
  };
}
function normalizeMediaItem(_0x109123 = {}) {
  return {
    id: String(_0x109123.id || "media_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8)),
    type: _0x109123.type === "image" ? "image" : "video",
    filePath: String(_0x109123.filePath || ""),
    fileName: String(_0x109123.fileName || ""),
    coverPath: String(_0x109123.coverPath || "")
  };
}
function normalizePublishItem(_0x20f48a = {}) {
  return {
    id: String(_0x20f48a.id || "item_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8)),
    accountId: String(_0x20f48a.accountId || ""),
    accountName: String(_0x20f48a.accountName || ""),
    media: normalizeMediaItem(_0x20f48a.media || {}),
    title: String(_0x20f48a.title || ""),
    description: String(_0x20f48a.description || ""),
    status: String(_0x20f48a.status || "draft"),
    error: String(_0x20f48a.error || ""),
    publishedAt: _0x20f48a.publishedAt != null ? Number(_0x20f48a.publishedAt) : null
  };
}
function normalizeWorkPublishTask(_0x300a16 = {}) {
  const _0x4b1b5d = Array.isArray(_0x300a16.items) ? _0x300a16.items.map(normalizePublishItem) : [];
  return {
    id: String(_0x300a16.id || "wp_" + Date.now()),
    name: String(_0x300a16.name || "作品发布"),
    seedTitle: String(_0x300a16.seedTitle || ""),
    seedDesc: String(_0x300a16.seedDesc || ""),
    similarity: Math.min(100, Math.max(0, Number(_0x300a16.similarity) || 30)),
    selectedAccounts: Array.isArray(_0x300a16.selectedAccounts) ? _0x300a16.selectedAccounts.map(String).filter(Boolean) : [],
    mediaList: Array.isArray(_0x300a16.mediaList) ? _0x300a16.mediaList.map(normalizeMediaItem) : [],
    items: _0x4b1b5d,
    publishMode: _0x300a16.publishMode === "parallel" ? "parallel" : "interval",
    staggerMinSec: Math.max(0, Number(_0x300a16.staggerMinSec) || 60),
    staggerMaxSec: Math.max(0, Number(_0x300a16.staggerMaxSec) || 180),
    status: String(_0x300a16.status || "draft"),
    createdAt: Number(_0x300a16.createdAt || Date.now()),
    updatedAt: Number(_0x300a16.updatedAt || Date.now()),
    startedAt: _0x300a16.startedAt != null ? Number(_0x300a16.startedAt) : null,
    endedAt: _0x300a16.endedAt != null ? Number(_0x300a16.endedAt) : null,
    endReason: String(_0x300a16.endReason || "")
  };
}
function computeTaskStats(_0x1be9a2) {
  const _0x229a81 = createEmptyWorkPublishStats();
  const _0x503a34 = Array.isArray(_0x1be9a2?.items) ? _0x1be9a2.items : [];
  _0x229a81.total = _0x503a34.length;
  for (const _0x17e3d3 of _0x503a34) {
    if (_0x17e3d3.status === "published") {
      _0x229a81.published += 1;
    } else if (_0x17e3d3.status === "failed") {
      _0x229a81.failed += 1;
    } else if (_0x17e3d3.status === "publishing" || _0x17e3d3.status === "queued") {
      _0x229a81.publishing += 1;
    } else if (_0x17e3d3.status === "ready") {
      _0x229a81.ready += 1;
    } else {
      _0x229a81.pending += 1;
    }
  }
  return _0x229a81;
}
function pairAccountsWithMedia(_0x3e916b = [], _0x28dab6 = [], _0x8f10c1 = []) {
  const _0x4f0a38 = Math.min(_0x3e916b.length, _0x28dab6.length);
  const _0xca4852 = [];
  for (let _0x1b1b59 = 0; _0x1b1b59 < _0x4f0a38; _0x1b1b59 += 1) {
    const _0x19ee57 = _0x3e916b[_0x1b1b59] || {};
    const _0x24efdb = _0x28dab6[_0x1b1b59] || {};
    const _0xfbd519 = _0x8f10c1[_0x1b1b59] || {};
    _0xca4852.push(normalizePublishItem({
      accountId: _0x19ee57.id || _0x19ee57.accountId || "",
      accountName: _0x19ee57.nickname || _0x19ee57.name || _0x19ee57.id || "",
      media: _0x24efdb,
      title: _0xfbd519.title || "",
      description: _0xfbd519.description || "",
      status: _0xfbd519.title || _0xfbd519.description ? "ready" : "draft"
    }));
  }
  return _0xca4852;
}
function createWorkPublishTasksApi({
  userDataPath: _0x4b887b
}) {
  const _0x3ce36b = TASKS_FILE(_0x4b887b);
  function _0x19d188() {
    try {
      if (!fs.existsSync(_0x3ce36b)) {
        return [];
      }
      const _0x43e4a7 = JSON.parse(fs.readFileSync(_0x3ce36b, "utf8"));
      if (Array.isArray(_0x43e4a7)) {
        return _0x43e4a7.map(normalizeWorkPublishTask);
      } else {
        return [];
      }
    } catch (_0x321bc4) {
      return [];
    }
  }
  function _0x447b7f(_0x510c3b) {
    fs.mkdirSync(path.dirname(_0x3ce36b), {
      recursive: true
    });
    fs.writeFileSync(_0x3ce36b, JSON.stringify(_0x510c3b, null, 2), "utf8");
  }
  function _0x3de1c2() {
    return _0x19d188().map(_0x95f137 => ({
      ..._0x95f137,
      stats: computeTaskStats(_0x95f137)
    }));
  }
  function _0x43e831(_0x118bd9) {
    const _0xcf5eae = _0x19d188().find(_0x426263 => _0x426263.id === String(_0x118bd9));
    if (!_0xcf5eae) {
      return null;
    }
    return {
      ..._0xcf5eae,
      stats: computeTaskStats(_0xcf5eae)
    };
  }
  function _0x34f03a(_0xfb01f9) {
    const _0x52a1a4 = normalizeWorkPublishTask({
      ..._0xfb01f9,
      updatedAt: Date.now(),
      createdAt: _0xfb01f9.createdAt || Date.now()
    });
    const _0x500dd9 = _0x19d188();
    const _0x1943c6 = _0x500dd9.findIndex(_0x341dd8 => _0x341dd8.id === _0x52a1a4.id);
    if (_0x1943c6 >= 0) {
      _0x500dd9[_0x1943c6] = {
        ..._0x500dd9[_0x1943c6],
        ..._0x52a1a4,
        id: _0x52a1a4.id
      };
    } else {
      _0x500dd9.unshift(_0x52a1a4);
    }
    _0x447b7f(_0x500dd9);
    return {
      ..._0x52a1a4,
      stats: computeTaskStats(_0x52a1a4)
    };
  }
  function _0x2a91db(_0x4719f4) {
    const _0x294daf = _0x19d188().filter(_0x282117 => _0x282117.id !== String(_0x4719f4));
    _0x447b7f(_0x294daf);
    return true;
  }
  function _0x164cf2(_0x5194ab) {
    const _0x2364e1 = new Set((Array.isArray(_0x5194ab) ? _0x5194ab : [_0x5194ab]).map(String).filter(Boolean));
    if (!_0x2364e1.size) {
      return false;
    }
    const _0x1501e1 = _0x19d188().filter(_0x233f1c => !_0x2364e1.has(String(_0x233f1c.id)));
    _0x447b7f(_0x1501e1);
    return true;
  }
  function _0x453eba(_0x19c41c, _0x308d7f = {}) {
    const _0x5e3d33 = _0x19d188();
    const _0xe3aa96 = _0x5e3d33.findIndex(_0x33c2a4 => _0x33c2a4.id === String(_0x19c41c));
    if (_0xe3aa96 < 0) {
      return null;
    }
    const _0x5c7a93 = normalizeWorkPublishTask({
      ..._0x5e3d33[_0xe3aa96],
      ..._0x308d7f,
      id: _0x5e3d33[_0xe3aa96].id,
      createdAt: _0x5e3d33[_0xe3aa96].createdAt,
      updatedAt: Date.now()
    });
    _0x5e3d33[_0xe3aa96] = _0x5c7a93;
    _0x447b7f(_0x5e3d33);
    return {
      ..._0x5c7a93,
      stats: computeTaskStats(_0x5c7a93)
    };
  }
  function _0x588f39(_0x4a0177, _0x49ebc1, _0x21a891 = {}) {
    const _0x2f4cef = _0x19d188();
    const _0x31473a = _0x2f4cef.findIndex(_0x2f0b39 => _0x2f0b39.id === String(_0x4a0177));
    if (_0x31473a < 0) {
      return null;
    }
    const _0x3617ad = _0x2f4cef[_0x31473a].items || [];
    const _0x4d7276 = _0x3617ad.findIndex(_0x4efa51 => _0x4efa51.id === String(_0x49ebc1));
    if (_0x4d7276 < 0) {
      return null;
    }
    _0x3617ad[_0x4d7276] = normalizePublishItem({
      ..._0x3617ad[_0x4d7276],
      ..._0x21a891,
      id: _0x3617ad[_0x4d7276].id
    });
    _0x2f4cef[_0x31473a].items = _0x3617ad;
    _0x2f4cef[_0x31473a].updatedAt = Date.now();
    _0x447b7f(_0x2f4cef);
    return {
      ..._0x2f4cef[_0x31473a],
      stats: computeTaskStats(_0x2f4cef[_0x31473a])
    };
  }
  return {
    listTasks: _0x3de1c2,
    getTask: _0x43e831,
    saveTask: _0x34f03a,
    deleteTask: _0x2a91db,
    deleteTasks: _0x164cf2,
    patchTask: _0x453eba,
    updateItem: _0x588f39,
    pairAccountsWithMedia: pairAccountsWithMedia,
    computeTaskStats: computeTaskStats
  };
}
module.exports = {
  createWorkPublishTasksApi: createWorkPublishTasksApi,
  pairAccountsWithMedia: pairAccountsWithMedia,
  normalizeWorkPublishTask: normalizeWorkPublishTask,
  computeTaskStats: computeTaskStats
};
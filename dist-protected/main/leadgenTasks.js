const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const {
  leadHasAnyTouch
} = require("../shared/leadPoolFilters");
const LEADGEN_TASKS_FILE = _0x23f920 => path.join(_0x23f920, "leadgen_tasks.enc");
const MIGRATION_FLAG_KEY = "leadgen_tasks_migrated_v1";
function createCrypto(_0x3fa104) {
  const _0x376953 = crypto.scryptSync("huoke-radar-secret-v1", "salt", 32);
  const _0x37cfe1 = Buffer.alloc(16, 0);
  const _0x452b35 = LEADGEN_TASKS_FILE(_0x3fa104);
  function _0x562cc6(_0x2ffcfa, _0x4f4480 = []) {
    if (!fs.existsSync(_0x2ffcfa)) {
      return _0x4f4480;
    }
    try {
      const _0x2cc03f = fs.readFileSync(_0x2ffcfa, "utf8");
      if (!_0x2cc03f) {
        return _0x4f4480;
      }
      const _0x467db6 = crypto.createDecipheriv("aes-256-cbc", _0x376953, _0x37cfe1);
      let _0x2fdc93 = _0x467db6.update(_0x2cc03f, "hex", "utf8");
      _0x2fdc93 += _0x467db6.final("utf8");
      return JSON.parse(_0x2fdc93);
    } catch (_0xb1e0f1) {
      return _0x4f4480;
    }
  }
  function _0x186ee9(_0x35778a, _0x59697e) {
    const _0x1169c5 = crypto.createCipheriv("aes-256-cbc", _0x376953, _0x37cfe1);
    let _0xd4541b = _0x1169c5.update(JSON.stringify(_0x59697e), "utf8", "hex");
    _0xd4541b += _0x1169c5.final("hex");
    fs.writeFileSync(_0x35778a, _0xd4541b);
  }
  function _0x217612(_0x57eada) {
    return _0x562cc6(_0x57eada, []);
  }
  function _0x4f1463() {
    return _0x562cc6(_0x452b35, []);
  }
  function _0x3abf38(_0x5c8620) {
    _0x186ee9(_0x452b35, _0x5c8620);
  }
  return {
    filePath: _0x452b35,
    readTasks: _0x4f1463,
    writeTasks: _0x3abf38,
    readHistory: _0x217612,
    readJsonFile: _0x562cc6
  };
}
function createEmptyTaskStats() {
  return {
    videos: 0,
    likes: 0,
    replies: 0,
    videoComments: 0,
    profileComments: 0,
    follows: 0,
    messages: 0,
    leadsTotal: 0
  };
}
function normalizeTouchCounts(_0x2b47aa) {
  const _0xc2dd05 = {
    like: 0,
    reply: 0,
    follow: 0,
    message: 0,
    profileComment: 0,
    videoComment: 0
  };
  if (!_0x2b47aa || typeof _0x2b47aa !== "object") {
    return _0xc2dd05;
  }
  Object.keys(_0xc2dd05).forEach(_0x3ec04f => {
    const _0x36e65e = Number(_0x2b47aa[_0x3ec04f]);
    _0xc2dd05[_0x3ec04f] = Number.isFinite(_0x36e65e) && _0x36e65e > 0 ? Math.floor(_0x36e65e) : 0;
  });
  return _0xc2dd05;
}
function aggregateStatsFromItems(_0x1ca158 = [], _0x492524 = {}) {
  const _0x355d52 = createEmptyTaskStats();
  _0x355d52.videos = Number(_0x492524.videoTotal) || 0;
  _0x355d52.leadsTotal = Array.isArray(_0x1ca158) ? _0x1ca158.length : 0;
  for (const _0x47e220 of _0x1ca158 || []) {
    const _0x4f1d07 = normalizeTouchCounts(_0x47e220.touchCounts);
    const _0x2a0e69 = Object.values(_0x4f1d07).some(_0x388c49 => _0x388c49 > 0);
    if (_0x2a0e69) {
      _0x355d52.likes += _0x4f1d07.like;
      _0x355d52.replies += _0x4f1d07.reply;
      _0x355d52.profileComments += _0x4f1d07.profileComment;
      _0x355d52.videoComments += _0x4f1d07.videoComment;
      _0x355d52.follows += _0x4f1d07.follow;
      _0x355d52.messages += _0x4f1d07.message;
      continue;
    }
    if (_0x47e220.liked || _0x47e220.actions?.liked) {
      _0x355d52.likes += 1;
    }
    if (_0x47e220.actions?.profileWorkCommented) {
      _0x355d52.profileComments += 1;
    } else if (_0x47e220.replied || _0x47e220.actions?.replied) {
      _0x355d52.replies += 1;
    }
    if (_0x47e220.followed || _0x47e220.actions?.followed) {
      _0x355d52.follows += 1;
    }
    if (_0x47e220.messaged || _0x47e220.actions?.messaged) {
      _0x355d52.messages += 1;
    }
    if (_0x47e220.videoCommented || _0x47e220.actions?.videoCommented) {
      _0x355d52.videoComments += 1;
    }
  }
  return _0x355d52;
}
function aggregateAccountStatsFromItems(_0x16c5ea = [], _0x13c13d = []) {
  const _0x28eec6 = new Map();
  const _0x3a2cb2 = (_0x4a3e57, _0x20a7e3 = {}) => {
    if (!_0x28eec6.has(_0x4a3e57)) {
      _0x28eec6.set(_0x4a3e57, {
        accountId: String(_0x20a7e3.accountId || ""),
        accountName: String(_0x20a7e3.accountName || _0x20a7e3.nickname || _0x20a7e3.name || ""),
        automationTaskId: String(_0x20a7e3.automationTaskId || ""),
        ...createEmptyTaskStats()
      });
    }
    return _0x28eec6.get(_0x4a3e57);
  };
  for (const _0xda1100 of _0x13c13d || []) {
    const _0x44180c = String(_0xda1100.automationTaskId || _0xda1100.accountId || "").trim();
    if (!_0x44180c) {
      continue;
    }
    const _0x289eaa = _0x3a2cb2(_0x44180c, {
      accountId: _0xda1100.accountId,
      accountName: _0xda1100.nickname || _0xda1100.name,
      automationTaskId: _0xda1100.automationTaskId
    });
    const _0x5470f8 = Number(_0xda1100.progress?.videos?.done) || 0;
    if (_0x5470f8 > _0x289eaa.videos) {
      _0x289eaa.videos = _0x5470f8;
    }
  }
  for (const _0x5ced5c of _0x16c5ea || []) {
    const _0x1cd589 = String(_0x5ced5c.taskId || _0x5ced5c.automationTaskId || "").trim();
    const _0x4cd811 = String(_0x5ced5c.accountId || "").trim();
    const _0x260ae8 = String(_0x5ced5c.accountName || _0x5ced5c.accountNickname || "").trim();
    const _0x215583 = _0x1cd589 || _0x4cd811 || _0x260ae8 || "unknown";
    const _0x271b53 = _0x3a2cb2(_0x215583, {
      accountId: _0x4cd811,
      accountName: _0x260ae8,
      automationTaskId: _0x1cd589
    });
    if (!_0x271b53.accountId && _0x4cd811) {
      _0x271b53.accountId = _0x4cd811;
    }
    if (!_0x271b53.accountName && _0x260ae8) {
      _0x271b53.accountName = _0x260ae8;
    }
    if (!_0x271b53.automationTaskId && _0x1cd589) {
      _0x271b53.automationTaskId = _0x1cd589;
    }
    _0x271b53.leadsTotal += 1;
    const _0x19221c = normalizeTouchCounts(_0x5ced5c.touchCounts);
    const _0x3f2b4d = Object.values(_0x19221c).some(_0x3d1445 => _0x3d1445 > 0);
    if (_0x3f2b4d) {
      _0x271b53.likes += _0x19221c.like;
      _0x271b53.replies += _0x19221c.reply;
      _0x271b53.profileComments += _0x19221c.profileComment;
      _0x271b53.videoComments += _0x19221c.videoComment;
      _0x271b53.follows += _0x19221c.follow;
      _0x271b53.messages += _0x19221c.message;
    } else {
      if (_0x5ced5c.liked || _0x5ced5c.actions?.liked) {
        _0x271b53.likes += 1;
      }
      if (_0x5ced5c.actions?.profileWorkCommented) {
        _0x271b53.profileComments += 1;
      } else if (_0x5ced5c.replied || _0x5ced5c.actions?.replied) {
        _0x271b53.replies += 1;
      }
      if (_0x5ced5c.followed || _0x5ced5c.actions?.followed) {
        _0x271b53.follows += 1;
      }
      if (_0x5ced5c.messaged || _0x5ced5c.actions?.messaged) {
        _0x271b53.messages += 1;
      }
      if (_0x5ced5c.videoCommented || _0x5ced5c.actions?.videoCommented) {
        _0x271b53.videoComments += 1;
      }
    }
  }
  return Array.from(_0x28eec6.values()).sort((_0x55a61f, _0x116aa6) => _0x116aa6.leadsTotal + _0x116aa6.likes + _0x116aa6.replies + _0x116aa6.follows + _0x116aa6.messages - (_0x55a61f.leadsTotal + _0x55a61f.likes + _0x55a61f.replies + _0x55a61f.follows + _0x55a61f.messages));
}
function normalizeLeadgenTask(_0x29da01 = {}) {
  const _0x3aa50f = Array.isArray(_0x29da01.runs) ? _0x29da01.runs.map(_0x57dc64 => ({
    accountId: String(_0x57dc64.accountId || ""),
    automationTaskId: String(_0x57dc64.automationTaskId || _0x57dc64.taskId || ""),
    nickname: String(_0x57dc64.nickname || _0x57dc64.name || ""),
    name: String(_0x57dc64.name || ""),
    keywords: String(_0x57dc64.keywords || ""),
    personaId: _0x57dc64.personaId || "none",
    endedAt: _0x57dc64.endedAt != null ? Number(_0x57dc64.endedAt) : null,
    endReason: String(_0x57dc64.endReason || ""),
    progress: _0x57dc64.progress && typeof _0x57dc64.progress === "object" ? _0x57dc64.progress : null,
    stats: _0x57dc64.stats && typeof _0x57dc64.stats === "object" ? {
      ...createEmptyTaskStats(),
      ..._0x57dc64.stats
    } : null
  })).filter(_0xdaec0 => _0xdaec0.automationTaskId) : [];
  return {
    id: String(_0x29da01.id || _0x29da01.taskId || "leadgen_" + Date.now()),
    name: String(_0x29da01.name || _0x29da01.taskName || "获客任务"),
    status: _0x29da01.status || "completed",
    legacy: !!_0x29da01.legacy,
    createdAt: Number(_0x29da01.createdAt || _0x29da01.timestamp || Date.now()),
    startedAt: _0x29da01.startedAt != null ? Number(_0x29da01.startedAt) : null,
    endedAt: _0x29da01.endedAt != null ? Number(_0x29da01.endedAt) : null,
    endReason: _0x29da01.endReason || "",
    runs: _0x3aa50f,
    configSnapshot: _0x29da01.configSnapshot || null,
    stats: {
      ...createEmptyTaskStats(),
      ...(_0x29da01.stats || {})
    },
    remark: _0x29da01.remark || ""
  };
}
function buildLegacyTaskFromHistory(_0x183480 = {}) {
  const _0x46b7d6 = String(_0x183480.taskId || "");
  if (!_0x46b7d6) {
    return null;
  }
  const _0x56ed5f = aggregateStatsFromItems(_0x183480.items, _0x183480.stats || {});
  return normalizeLeadgenTask({
    id: _0x46b7d6,
    name: _0x183480.taskName || _0x183480.remark || "历史获客任务",
    status: "completed",
    legacy: true,
    createdAt: _0x183480.timestamp || Date.now(),
    startedAt: _0x183480.timestamp || Date.now(),
    endedAt: _0x183480.timestamp || Date.now(),
    runs: [{
      accountId: "legacy",
      automationTaskId: _0x46b7d6,
      nickname: _0x183480.accountName || "未知账号",
      name: _0x183480.accountName || ""
    }],
    configSnapshot: null,
    stats: _0x56ed5f,
    remark: _0x183480.remark || ""
  });
}
function createLeadgenTasksApi({
  userDataPath: _0x230672,
  historyFile: _0x539efb,
  store: _0x1d9047,
  listLeadsByAutomationTaskIds = null,
  queryLeadsByAutomationTaskIdsPage = null,
  isLeadsRuntimeReady = null
} = {}) {
  const _0x81105c = createCrypto(_0x230672);
  const {
    readTasks: _0x4a505c,
    writeTasks: _0x5d7fd0,
    readHistory: _0x456114
  } = _0x81105c;
  function _0x53de8b() {
    try {
      if (typeof isLeadsRuntimeReady === "function" && !isLeadsRuntimeReady()) {
        return false;
      }
      return typeof listLeadsByAutomationTaskIds === "function" || typeof queryLeadsByAutomationTaskIdsPage === "function";
    } catch (_0x445d51) {
      return false;
    }
  }
  function _0x3c4944(_0x3d75c2 = []) {
    const _0x329356 = [..._0x3d75c2].filter(Boolean);
    if (!_0x329356.length) {
      return {
        items: [],
        videoTotal: 0,
        source: "none"
      };
    }
    if (_0x53de8b() && typeof listLeadsByAutomationTaskIds === "function") {
      try {
        const _0xe7588e = listLeadsByAutomationTaskIds(_0x329356, {
          limit: 20000,
          includeVideoCards: false
        }) || [];
        return {
          items: _0xe7588e,
          videoTotal: 0,
          source: "sqlite"
        };
      } catch (_0x33de29) {
        console.warn("[LeadgenTasks] SQLite 拉取任务线索失败，回退 enc:", _0x33de29?.message || _0x33de29);
      }
    }
    const _0x4d5150 = _0x456114(_0x539efb);
    const _0x37a1a5 = new Set(_0x329356);
    const _0x24cd32 = _0x4d5150.filter(_0x13b069 => _0x37a1a5.has(_0x13b069.taskId));
    const _0x398aac = _0x24cd32.flatMap(_0x26f76c => _0x26f76c.items || []);
    const _0x3228fd = _0x24cd32.reduce((_0x5a66e1, _0x43dbee) => _0x5a66e1 + (Number(_0x43dbee.stats?.videoTotal) || 0), 0);
    return {
      items: _0x398aac,
      videoTotal: _0x3228fd,
      source: "enc"
    };
  }
  function _0x16e709() {
    if (_0x1d9047.get(MIGRATION_FLAG_KEY)) {
      return _0x4a505c();
    }
    const _0x44a30b = _0x4a505c();
    const _0x1e6aba = new Set();
    _0x44a30b.forEach(_0x2e1853 => {
      (_0x2e1853.runs || []).forEach(_0x38df6f => {
        if (_0x38df6f.automationTaskId) {
          _0x1e6aba.add(_0x38df6f.automationTaskId);
        }
      });
      if (_0x2e1853.legacy && _0x2e1853.id) {
        _0x1e6aba.add(_0x2e1853.id);
      }
    });
    const _0x50c20d = _0x456114(_0x539efb);
    let _0x544642 = false;
    _0x50c20d.forEach(_0x1955fd => {
      if (!_0x1955fd?.taskId || _0x1e6aba.has(_0x1955fd.taskId)) {
        return;
      }
      const _0x595fe4 = buildLegacyTaskFromHistory(_0x1955fd);
      if (!_0x595fe4) {
        return;
      }
      _0x44a30b.unshift(_0x595fe4);
      _0x1e6aba.add(_0x1955fd.taskId);
      _0x544642 = true;
    });
    if (_0x544642) {
      _0x5d7fd0(_0x44a30b);
    }
    _0x1d9047.set(MIGRATION_FLAG_KEY, true);
    return _0x44a30b.map(normalizeLeadgenTask);
  }
  function _0x4f5a75() {
    const _0xa5c7da = _0x16e709();
    return _0xa5c7da.map(normalizeLeadgenTask).sort((_0xb5d0d7, _0x1d0465) => (_0x1d0465.createdAt || 0) - (_0xb5d0d7.createdAt || 0));
  }
  function _0x3f0d6d(_0x2978d7) {
    return _0x4f5a75().find(_0x3c4894 => _0x3c4894.id === _0x2978d7) || null;
  }
  function _0xe77b66(_0x4f69c2) {
    return _0x4f5a75().find(_0x317175 => (_0x317175.runs || []).some(_0x1df391 => _0x1df391.automationTaskId === _0x4f69c2)) || null;
  }
  function _0x41ef00(_0xd28423) {
    const _0x231a46 = _0x4a505c().map(normalizeLeadgenTask);
    const _0x2e60a2 = normalizeLeadgenTask(_0xd28423);
    const _0x3d41c7 = _0x231a46.findIndex(_0x4b94ec => _0x4b94ec.id === _0x2e60a2.id);
    if (_0x3d41c7 === -1) {
      _0x231a46.unshift(_0x2e60a2);
    } else {
      _0x231a46[_0x3d41c7] = {
        ..._0x231a46[_0x3d41c7],
        ..._0x2e60a2
      };
    }
    _0x5d7fd0(_0x231a46);
    return _0x2e60a2;
  }
  function _0x272f6e(_0x207555, _0x4258cd = {}) {
    const _0x3cc0c9 = _0x4a505c().map(normalizeLeadgenTask);
    const _0x3d0e63 = _0x3cc0c9.findIndex(_0x39d0d0 => _0x39d0d0.id === _0x207555);
    if (_0x3d0e63 === -1) {
      return null;
    }
    _0x3cc0c9[_0x3d0e63] = normalizeLeadgenTask({
      ..._0x3cc0c9[_0x3d0e63],
      ..._0x4258cd,
      id: _0x207555
    });
    _0x5d7fd0(_0x3cc0c9);
    return _0x3cc0c9[_0x3d0e63];
  }
  function _0x55358d(_0x11e6b1, _0x157687 = {}) {
    const _0x1a41a0 = _0xe77b66(_0x11e6b1);
    if (!_0x1a41a0) {
      return null;
    }
    return _0x272f6e(_0x1a41a0.id, _0x157687);
  }
  function _0x73ef80(_0x180e1e = []) {
    const _0x172cbc = new Set(Array.isArray(_0x180e1e) ? _0x180e1e : [_0x180e1e]);
    const _0x41e7c0 = _0x4a505c().filter(_0xf52ea6 => !_0x172cbc.has(_0xf52ea6.id));
    _0x5d7fd0(_0x41e7c0);
    return true;
  }
  function _0x276d7b(_0x5b8f2a, _0x2340ce = 0) {
    const _0x1ed60a = (_0x5b8f2a.runs || []).reduce((_0x4d5fbd, _0x53c0a9) => _0x4d5fbd + (Number(_0x53c0a9.progress?.videos?.done) || 0), 0);
    return Math.max(Number(_0x2340ce) || 0, _0x1ed60a);
  }
  function _0x4462f4(_0x41f824 = [], _0x116b96 = []) {
    const _0x268074 = new Map();
    const _0x2842b6 = new Map();
    for (const _0x4740b6 of _0x116b96 || []) {
      if (_0x4740b6.automationTaskId) {
        _0x268074.set(String(_0x4740b6.automationTaskId), _0x4740b6);
      }
      if (_0x4740b6.accountId) {
        _0x2842b6.set(String(_0x4740b6.accountId), _0x4740b6);
      }
    }
    return (_0x41f824 || []).map(_0x29d277 => {
      const _0xc6dc4b = _0x268074.get(String(_0x29d277.automationTaskId || "")) || _0x2842b6.get(String(_0x29d277.accountId || ""));
      if (!_0xc6dc4b) {
        return _0x29d277;
      }
      const _0xc1b718 = {
        ...createEmptyTaskStats(),
        ..._0xc6dc4b
      };
      const _0x2ab8ca = Number(_0x29d277.progress?.videos?.done) || 0;
      if (_0x2ab8ca > _0xc1b718.videos) {
        _0xc1b718.videos = _0x2ab8ca;
      }
      return {
        ..._0x29d277,
        stats: _0xc1b718
      };
    });
  }
  function _0x6941f7(_0x194b0e) {
    const _0x175e8d = _0x3f0d6d(_0x194b0e);
    if (!_0x175e8d) {
      return null;
    }
    const _0x133850 = (_0x175e8d.runs || []).map(_0x3542a7 => _0x3542a7.automationTaskId).filter(Boolean);
    const {
      items: _0x3da2a2,
      videoTotal: _0x2202cd
    } = _0x3c4944(_0x133850);
    const _0x49e41f = aggregateStatsFromItems(_0x3da2a2, {
      videoTotal: _0x276d7b(_0x175e8d, _0x2202cd)
    });
    const _0x10a833 = aggregateAccountStatsFromItems(_0x3da2a2, _0x175e8d.runs || []);
    const _0x3c1d53 = _0x4462f4(_0x175e8d.runs || [], _0x10a833);
    return _0x272f6e(_0x194b0e, {
      stats: _0x49e41f,
      runs: _0x3c1d53
    });
  }
  function _0x14c77f() {
    const _0x1645c5 = _0x4a505c().map(normalizeLeadgenTask);
    const _0x99a1e4 = Date.now();
    let _0x3fcbf8 = false;
    const _0x4c3edb = _0x1645c5.map(_0x26d132 => {
      if (_0x26d132.status !== "running") {
        return _0x26d132;
      }
      _0x3fcbf8 = true;
      const _0x296e9f = (_0x26d132.runs || []).map(_0x41a8b9 => _0x41a8b9.endedAt ? _0x41a8b9 : {
        ..._0x41a8b9,
        endedAt: _0x99a1e4,
        endReason: "app_restart"
      });
      return normalizeLeadgenTask({
        ..._0x26d132,
        status: "stopped",
        runs: _0x296e9f,
        endedAt: _0x26d132.endedAt || _0x99a1e4,
        endReason: "app_restart"
      });
    });
    if (_0x3fcbf8) {
      _0x5d7fd0(_0x4c3edb);
    }
    return _0x3fcbf8;
  }
  function _0xd47f09(_0x445dc1, _0x56efdf = {}) {
    const _0x560158 = _0xe77b66(_0x445dc1);
    if (!_0x560158) {
      return null;
    }
    const _0x4c0bf7 = _0x56efdf.progress || {};
    const _0x4638e6 = Number(_0x4c0bf7.videos?.done) || 0;
    const _0x553192 = (_0x560158.runs || []).map(_0x5533d6 => {
      if (_0x5533d6.automationTaskId !== _0x445dc1) {
        return _0x5533d6;
      }
      return {
        ..._0x5533d6,
        endedAt: Date.now(),
        endReason: _0x56efdf.reason || "completed",
        progress: _0x4c0bf7
      };
    });
    const _0x266eb1 = {
      runs: _0x553192
    };
    const _0x581de5 = _0x272f6e(_0x560158.id, _0x266eb1);
    const _0x4dd9bb = _0x6941f7(_0x581de5?.id || _0x560158.id);
    if (_0x4dd9bb) {
      _0x266eb1.stats = {
        ..._0x4dd9bb.stats
      };
      _0x266eb1.runs = _0x4dd9bb.runs;
      if (_0x4638e6 > 0) {
        _0x266eb1.stats.videos = Math.max(_0x266eb1.stats.videos || 0, _0x4638e6);
      }
    }
    const _0x3bc55b = _0x266eb1.runs || _0x553192;
    const _0xf50d68 = _0x3bc55b.some(_0x47662c => !_0x47662c.endedAt);
    if (!_0xf50d68) {
      const _0x131d04 = new Set(["manual_stop", "schedule_preempted", "schedule_window_end", "app_restart"]);
      _0x266eb1.status = _0x131d04.has(_0x56efdf.reason) ? "stopped" : "completed";
      _0x266eb1.endedAt = Date.now();
      _0x266eb1.endReason = _0x56efdf.reason || "completed";
    } else {
      _0x266eb1.status = "running";
    }
    return _0x272f6e(_0x560158.id, _0x266eb1);
  }
  function _0x634045(_0x65c378) {
    const _0x3e207c = _0x3f0d6d(_0x65c378);
    if (!_0x3e207c) {
      return null;
    }
    const _0x5435b6 = (_0x3e207c.runs || []).map(_0xdd38d0 => _0xdd38d0.automationTaskId).filter(Boolean);
    const _0x302e86 = _0x3b9b83(_0x65c378, {
      offset: 0,
      limit: 1,
      touch: "all"
    });
    const _0x459d69 = (_0x3e207c.runs || []).map(_0x5a93b7 => ({
      accountId: _0x5a93b7.accountId,
      accountName: _0x5a93b7.nickname || _0x5a93b7.name || _0x5a93b7.accountId,
      automationTaskId: _0x5a93b7.automationTaskId,
      ...createEmptyTaskStats(),
      ...(_0x5a93b7.stats || {}),
      videos: Number(_0x5a93b7.stats?.videos) || Number(_0x5a93b7.progress?.videos?.done) || 0
    }));
    return {
      task: _0x3e207c,
      leads: [],
      accountStats: _0x459d69,
      source: _0x53de8b() ? "sqlite" : "enc",
      leadTotal: Number(_0x302e86.counts?.all) || Number(_0x302e86.total) || 0,
      automationIds: _0x5435b6
    };
  }
  function _0x3b9b83(_0x50fe2a, _0x138ddf = {}) {
    const _0x189cd0 = {
      items: [],
      total: 0,
      counts: {
        all: 0,
        touched: 0,
        untouched: 0
      }
    };
    const _0x5b4733 = _0x3f0d6d(_0x50fe2a);
    if (!_0x5b4733) {
      return _0x189cd0;
    }
    const _0xf24551 = (_0x5b4733.runs || []).map(_0x35180b => _0x35180b.automationTaskId).filter(Boolean);
    const _0x501c16 = Math.max(1, Math.min(100, Number(_0x138ddf.limit) || 20));
    const _0x4c1a5a = Math.max(0, Number(_0x138ddf.offset) || 0);
    const _0x545b98 = String(_0x138ddf.touch || "all");
    if (_0x53de8b() && typeof queryLeadsByAutomationTaskIdsPage === "function") {
      try {
        return queryLeadsByAutomationTaskIdsPage(_0xf24551, {
          offset: _0x4c1a5a,
          limit: _0x501c16,
          touch: _0x545b98,
          includeVideoCards: false
        });
      } catch (_0x356845) {
        console.warn("[LeadgenTasks] 明细分页失败，回退 enc:", _0x356845?.message || _0x356845);
      }
    }
    const {
      items: _0x307485
    } = _0x3c4944(_0xf24551);
    let _0x18936b = _0x307485.slice().sort((_0x18d759, _0x2d8420) => Number(_0x2d8420.timestamp || _0x2d8420.capturedAt || 0) - Number(_0x18d759.timestamp || _0x18d759.capturedAt || 0));
    const _0x138d55 = _0x18936b.length;
    const _0x2740bf = _0x18936b.filter(_0x54e7e3 => leadHasAnyTouch(_0x54e7e3)).length;
    if (_0x545b98 === "touched") {
      _0x18936b = _0x18936b.filter(_0x4d641c => leadHasAnyTouch(_0x4d641c));
    }
    if (_0x545b98 === "untouched") {
      _0x18936b = _0x18936b.filter(_0x40a063 => !leadHasAnyTouch(_0x40a063));
    }
    return {
      items: _0x18936b.slice(_0x4c1a5a, _0x4c1a5a + _0x501c16),
      total: _0x18936b.length,
      counts: {
        all: _0x138d55,
        touched: _0x2740bf,
        untouched: Math.max(0, _0x138d55 - _0x2740bf)
      }
    };
  }
  return {
    listTasks: _0x4f5a75,
    findTaskById: _0x3f0d6d,
    findTaskByAutomationTaskId: _0xe77b66,
    upsertTask: _0x41ef00,
    patchTask: _0x272f6e,
    patchTaskByAutomationTaskId: _0x55358d,
    deleteTasks: _0x73ef80,
    refreshTaskStatsFromHistory: _0x6941f7,
    finalizeTaskRun: _0xd47f09,
    getTaskDetail: _0x634045,
    listLeadRecordsPage: _0x3b9b83,
    resetStaleRunningTasks: _0x14c77f,
    aggregateStatsFromItems: aggregateStatsFromItems,
    aggregateAccountStatsFromItems: aggregateAccountStatsFromItems,
    normalizeLeadgenTask: normalizeLeadgenTask,
    createEmptyTaskStats: createEmptyTaskStats
  };
}
module.exports = {
  createLeadgenTasksApi: createLeadgenTasksApi,
  aggregateStatsFromItems: aggregateStatsFromItems,
  aggregateAccountStatsFromItems: aggregateAccountStatsFromItems,
  normalizeLeadgenTask: normalizeLeadgenTask,
  createEmptyTaskStats: createEmptyTaskStats
};
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const {
  MAX_MONITOR_TASK_CYCLES,
  normalizeMonitorTaskCycle,
  nextCycleRound,
  closeOpenCycles,
  prependCycle,
  addCycleMetrics,
  mergeCycleMetrics
} = require("./monitorTaskCycles");
const {
  MAX_MONITOR_TASK_VIDEO_COMMENTS,
  normalizeMonitorVideoCommentRecord
} = require("./monitorTaskVideoComments");
const MONITOR_TASKS_FILE = _0xf1c730 => path.join(_0xf1c730, "monitor_tasks.enc");
function createCrypto(_0x56a3a2) {
  const _0x2ac6bb = crypto.scryptSync("huoke-radar-secret-v1", "salt", 32);
  const _0x4a607e = Buffer.alloc(16, 0);
  const _0x465578 = MONITOR_TASKS_FILE(_0x56a3a2);
  function _0x4bdfa0(_0x577019, _0xa63957 = []) {
    if (!fs.existsSync(_0x577019)) {
      return _0xa63957;
    }
    try {
      const _0x50c1fe = fs.readFileSync(_0x577019, "utf8");
      if (!_0x50c1fe) {
        return _0xa63957;
      }
      const _0x37618c = crypto.createDecipheriv("aes-256-cbc", _0x2ac6bb, _0x4a607e);
      let _0xae32ac = _0x37618c.update(_0x50c1fe, "hex", "utf8");
      _0xae32ac += _0x37618c.final("utf8");
      return JSON.parse(_0xae32ac);
    } catch (_0x15797f) {
      return _0xa63957;
    }
  }
  function _0x3722c9(_0x484000, _0x49db4c) {
    const _0x13793e = crypto.createCipheriv("aes-256-cbc", _0x2ac6bb, _0x4a607e);
    let _0xbb794f = _0x13793e.update(JSON.stringify(_0x49db4c), "utf8", "hex");
    _0xbb794f += _0x13793e.final("hex");
    fs.writeFileSync(_0x484000, _0xbb794f);
  }
  function _0x5bccce() {
    return _0x4bdfa0(_0x465578, []);
  }
  function _0x34a728(_0x2d9958) {
    _0x3722c9(_0x465578, _0x2d9958);
  }
  return {
    filePath: _0x465578,
    readTasks: _0x5bccce,
    writeTasks: _0x34a728
  };
}
function createEmptyMonitorTaskStats() {
  return {
    checks: 0,
    newWorks: 0,
    commentsTotal: 0,
    newComments: 0,
    matched: 0,
    likes: 0,
    replies: 0,
    follows: 0,
    followRequests: 0,
    messages: 0,
    lastCycleComments: 0,
    lastCycleAt: null
  };
}
function formatMonitorIntentionLabel(_0x49e093) {
  const _0x7988f2 = String(_0x49e093 || "").trim();
  if (!_0x7988f2) {
    return "";
  }
  const _0x26fff4 = _0x7988f2.toLowerCase();
  if (_0x26fff4 === "high") {
    return "高意向";
  }
  if (_0x26fff4 === "medium" || _0x26fff4 === "mid") {
    return "中意向";
  }
  if (_0x26fff4 === "low") {
    return "低意向";
  }
  return _0x7988f2;
}
function normalizeMatchRecord(_0x31cba2 = {}) {
  return {
    id: String(_0x31cba2.id || "match_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8)),
    ts: Number(_0x31cba2.ts || Date.now()),
    accountId: String(_0x31cba2.accountId || ""),
    accountName: String(_0x31cba2.accountName || ""),
    videoUrl: String(_0x31cba2.videoUrl || ""),
    videoTitle: String(_0x31cba2.videoTitle || ""),
    nickname: String(_0x31cba2.nickname || ""),
    userUrl: String(_0x31cba2.userUrl || ""),
    commentText: String(_0x31cba2.commentText || ""),
    matchType: _0x31cba2.matchType || "keyword",
    aiIntention: formatMonitorIntentionLabel(_0x31cba2.aiIntention || ""),
    judgeReason: String(_0x31cba2.judgeReason || ""),
    excludedCommentKeyword: String(_0x31cba2.excludedCommentKeyword || ""),
    matched: _0x31cba2.matched === undefined ? true : !!_0x31cba2.matched,
    webhookStatus: _0x31cba2.webhookStatus || "none",
    webhookError: String(_0x31cba2.webhookError || ""),
    followStatus: _0x31cba2.followStatus || "none",
    followError: String(_0x31cba2.followError || ""),
    followErrorCode: String(_0x31cba2.followErrorCode || ""),
    followDiagnostic: String(_0x31cba2.followDiagnostic || ""),
    followRequested: !!_0x31cba2.followRequested,
    followRequestSent: !!_0x31cba2.followRequestSent,
    followIsPrivate: !!_0x31cba2.followIsPrivate,
    replyContent: String(_0x31cba2.replyContent || ""),
    replyStatus: _0x31cba2.replyStatus || "none",
    likeStatus: _0x31cba2.likeStatus || "none",
    likeError: String(_0x31cba2.likeError || ""),
    replyError: String(_0x31cba2.replyError || ""),
    replyErrorCode: String(_0x31cba2.replyErrorCode || ""),
    replyDiagnostic: String(_0x31cba2.replyDiagnostic || ""),
    replyTarget: ["comment", "profile_first"].includes(String(_0x31cba2.replyTarget || "")) ? String(_0x31cba2.replyTarget) : "",
    profileCommentStatus: _0x31cba2.profileCommentStatus || "none",
    profileCommentError: String(_0x31cba2.profileCommentError || ""),
    profileCommentErrorCode: String(_0x31cba2.profileCommentErrorCode || ""),
    dmContent: String(_0x31cba2.dmContent || ""),
    dmStatus: _0x31cba2.dmStatus || "none"
  };
}
function normalizeMonitorTaskConfig(_0x1c8cbd = {}) {
  if (!_0x1c8cbd || typeof _0x1c8cbd !== "object") {
    return null;
  }
  const _0x5202f4 = {
    ..._0x1c8cbd
  };
  if (!Array.isArray(_0x5202f4.videoUrls)) {
    _0x5202f4.videoUrls = [];
  }
  if (!Array.isArray(_0x5202f4.authorUrls)) {
    _0x5202f4.authorUrls = [];
  }
  if (!Array.isArray(_0x5202f4.selectedAccounts)) {
    _0x5202f4.selectedAccounts = [];
  }
  const _0x111929 = Array.isArray(_0x5202f4.monitorTargetTypes) ? _0x5202f4.monitorTargetTypes.filter(_0x1a2204 => _0x1a2204 === "video" || _0x1a2204 === "author") : [];
  const _0x1ef810 = new Set();
  if (_0x111929.length > 0) {
    _0x111929.forEach(_0xdf6c78 => _0x1ef810.add(_0xdf6c78));
  } else {
    if ((_0x5202f4.videoUrls || []).some(_0x1b9b63 => _0x1b9b63?.url)) {
      _0x1ef810.add("video");
    }
    if ((_0x5202f4.authorUrls || []).some(_0x2aa3b0 => _0x2aa3b0?.url)) {
      _0x1ef810.add("author");
    }
    if (_0x1ef810.size === 0) {
      _0x1ef810.add("video");
    }
  }
  _0x5202f4.monitorTargetTypes = [..._0x1ef810];
  return _0x5202f4;
}
function normalizeMonitorTask(_0x3bbc65 = {}) {
  const _0x8912cf = Array.isArray(_0x3bbc65.runs) ? _0x3bbc65.runs.map(_0x44b178 => ({
    accountId: String(_0x44b178.accountId || ""),
    nickname: String(_0x44b178.nickname || _0x44b178.name || ""),
    name: String(_0x44b178.name || ""),
    personaId: _0x44b178.personaId || "none",
    endedAt: _0x44b178.endedAt != null ? Number(_0x44b178.endedAt) : null,
    endReason: _0x44b178.endReason || ""
  })).filter(_0x314d11 => _0x314d11.accountId) : [];
  return {
    id: String(_0x3bbc65.id || "monitor_" + Date.now()),
    name: String(_0x3bbc65.name || "监控任务"),
    status: _0x3bbc65.status || "draft",
    createdAt: Number(_0x3bbc65.createdAt || Date.now()),
    startedAt: _0x3bbc65.startedAt != null ? Number(_0x3bbc65.startedAt) : null,
    endedAt: _0x3bbc65.endedAt != null ? Number(_0x3bbc65.endedAt) : null,
    endReason: _0x3bbc65.endReason || "",
    runs: _0x8912cf,
    configSnapshot: _0x3bbc65.configSnapshot ? normalizeMonitorTaskConfig(_0x3bbc65.configSnapshot) : null,
    stats: {
      ...createEmptyMonitorTaskStats(),
      ...(_0x3bbc65.stats || {})
    },
    matches: Array.isArray(_0x3bbc65.matches) ? _0x3bbc65.matches.map(normalizeMatchRecord) : [],
    cycles: Array.isArray(_0x3bbc65.cycles) ? _0x3bbc65.cycles.map(normalizeMonitorTaskCycle).slice(0, MAX_MONITOR_TASK_CYCLES) : [],
    videoComments: Array.isArray(_0x3bbc65.videoComments) ? _0x3bbc65.videoComments.map(normalizeMonitorVideoCommentRecord).slice(0, MAX_MONITOR_TASK_VIDEO_COMMENTS) : [],
    remark: _0x3bbc65.remark || ""
  };
}
function createMonitorTasksApi({
  userDataPath: _0x3fefca
}) {
  const _0x144ca3 = createCrypto(_0x3fefca);
  const {
    readTasks: _0x232c5c,
    writeTasks: _0x37a37c
  } = _0x144ca3;
  const _0x12d763 = require("./monitorTaskDetailsStore");
  try {
    _0x12d763.runMonitorTaskDetailsSqliteMigrationIfNeeded({
      readTasks: _0x232c5c,
      writeTasks: _0x37a37c
    });
  } catch (_0x2d3629) {
    console.error("[MonitorTasks] 明细 SQLite 迁移异常（保留 enc）:", _0x2d3629);
  }
  function _0xcbb374() {
    if (!_0x12d763.isReady()) {
      return false;
    }
    try {
      _0x12d763.runMonitorTaskDetailsSqliteMigrationIfNeeded({
        readTasks: _0x232c5c,
        writeTasks: _0x37a37c
      });
    } catch (_0x15d039) {
      console.error("[MonitorTasks] 明细 SQLite 迁移异常（保留 enc）:", _0x15d039);
      return false;
    }
    return _0x12d763.isMigrationApplied();
  }
  function _0x449745(_0x278739) {
    const _0x405487 = _0xcbb374();
    _0x37a37c((Array.isArray(_0x278739) ? _0x278739 : []).map(_0x224bdb => {
      const _0x3bbc83 = {
        ..._0x224bdb
      };
      if (_0x405487) {
        _0x3bbc83.matches = [];
        _0x3bbc83.cycles = [];
        _0x3bbc83.videoComments = [];
      }
      return _0x3bbc83;
    }));
  }
  function _0x54e586(_0x4cb4c8) {
    if (!_0x4cb4c8) {
      return null;
    }
    if (!_0xcbb374()) {
      const _0x2ed65e = Array.isArray(_0x4cb4c8.matches) ? _0x4cb4c8.matches : [];
      const _0x45633 = Array.isArray(_0x4cb4c8.cycles) ? _0x4cb4c8.cycles : [];
      const _0x120360 = Array.isArray(_0x4cb4c8.videoComments) ? _0x4cb4c8.videoComments : [];
      return {
        ..._0x4cb4c8,
        matchCount: _0x2ed65e.length,
        hitCount: _0x2ed65e.filter(_0x5367e6 => _0x5367e6?.matched !== false).length,
        cycleCount: _0x45633.length,
        videoCommentCount: _0x120360.length
      };
    }
    return {
      ..._0x4cb4c8,
      matches: [],
      cycles: [],
      videoComments: [],
      matchCount: Number(_0x4cb4c8.matchCount) || 0,
      hitCount: Number(_0x4cb4c8.hitCount) || 0,
      cycleCount: Number(_0x4cb4c8.cycleCount) || 0,
      videoCommentCount: Number(_0x4cb4c8.videoCommentCount) || 0
    };
  }
  function _0x55ad75(_0x2f279e) {
    if (!_0xcbb374()) {
      return _0x2f279e.map(_0x54e586);
    }
    const _0x528655 = _0x12d763.countMatchesByTask();
    const _0xa5b85f = _0x12d763.countCyclesByTask();
    const _0x436ac5 = _0x12d763.countVideoCommentsByTask();
    return _0x2f279e.map(_0x387a2 => {
      const _0x1488ef = _0x528655.get(String(_0x387a2.id)) || {
        matchCount: 0,
        hitCount: 0
      };
      return _0x54e586({
        ..._0x387a2,
        matches: [],
        cycles: [],
        videoComments: [],
        matchCount: _0x1488ef.matchCount,
        hitCount: _0x1488ef.hitCount,
        cycleCount: _0xa5b85f.get(String(_0x387a2.id)) || 0,
        videoCommentCount: _0x436ac5.get(String(_0x387a2.id)) || 0
      });
    });
  }
  function _0x40dde9() {
    return _0x55ad75(_0x232c5c().map(normalizeMonitorTask).sort((_0x3fe4c0, _0x31f6a7) => (_0x31f6a7.createdAt || 0) - (_0x3fe4c0.createdAt || 0)));
  }
  function _0x1cc22d(_0x322154) {
    const _0x5dba84 = _0x232c5c().map(normalizeMonitorTask).find(_0xfc57f0 => _0xfc57f0.id === _0x322154);
    if (!_0x5dba84) {
      return null;
    }
    return _0x55ad75([_0x5dba84])[0];
  }
  function _0xc74340(_0x95f574) {
    const _0x2fbac4 = _0x232c5c().map(normalizeMonitorTask);
    const _0x253232 = normalizeMonitorTask(_0x95f574);
    const _0x10d73a = _0x2fbac4.findIndex(_0x265137 => _0x265137.id === _0x253232.id);
    if (_0x10d73a === -1) {
      _0x2fbac4.unshift(_0x253232);
      if (_0xcbb374()) {
        if (Array.isArray(_0x95f574?.matches) && _0x95f574.matches.length) {
          _0x12d763.appendMatches(_0x253232.id, _0x95f574.matches.map(normalizeMatchRecord));
        }
        if (Array.isArray(_0x95f574?.cycles) && _0x95f574.cycles.length) {
          _0x95f574.cycles.forEach(_0x157e63 => _0x12d763.upsertCycle(_0x253232.id, _0x157e63));
        }
        if (Array.isArray(_0x95f574?.videoComments) && _0x95f574.videoComments.length) {
          _0x12d763.appendVideoComments(_0x253232.id, _0x95f574.videoComments.map(normalizeMonitorVideoCommentRecord));
        }
      }
    } else {
      const _0xebe17d = {
        ..._0x2fbac4[_0x10d73a],
        ..._0x253232,
        id: _0x253232.id
      };
      if (!Array.isArray(_0x95f574.cycles) && !_0xcbb374()) {
        _0xebe17d.cycles = _0x2fbac4[_0x10d73a].cycles;
      }
      if (!Array.isArray(_0x95f574.matches) && !_0xcbb374()) {
        _0xebe17d.matches = _0x2fbac4[_0x10d73a].matches;
      }
      if (!Array.isArray(_0x95f574.videoComments) && !_0xcbb374()) {
        _0xebe17d.videoComments = _0x2fbac4[_0x10d73a].videoComments;
      }
      _0x2fbac4[_0x10d73a] = normalizeMonitorTask(_0xebe17d);
    }
    _0x449745(_0x2fbac4);
    return _0x1cc22d(_0x253232.id);
  }
  function _0x27e32e(_0x28d8e2, _0x82b3bd = {}) {
    const _0x206476 = _0x232c5c().map(normalizeMonitorTask);
    const _0x5ab196 = _0x206476.findIndex(_0x4a8e16 => _0x4a8e16.id === _0x28d8e2);
    if (_0x5ab196 === -1) {
      return null;
    }
    const {
      matches: _0x44c7e8,
      cycles: _0x3e1dd3,
      ..._0x5184a9
    } = _0x82b3bd || {};
    const _0x14cc3d = {
      ..._0x206476[_0x5ab196],
      ..._0x5184a9,
      id: _0x28d8e2
    };
    if (!_0xcbb374()) {
      if (Object.prototype.hasOwnProperty.call(_0x82b3bd || {}, "matches")) {
        _0x14cc3d.matches = _0x44c7e8;
      }
      if (Object.prototype.hasOwnProperty.call(_0x82b3bd || {}, "cycles")) {
        _0x14cc3d.cycles = _0x3e1dd3;
      }
    }
    _0x206476[_0x5ab196] = normalizeMonitorTask(_0x14cc3d);
    _0x449745(_0x206476);
    if (_0xcbb374() && Object.prototype.hasOwnProperty.call(_0x82b3bd || {}, "matches")) {
      if (!Array.isArray(_0x44c7e8) || _0x44c7e8.length === 0) {
        _0x12d763.deleteMatches(_0x28d8e2, {
          clearAll: true
        });
      } else {
        _0x12d763.deleteMatches(_0x28d8e2, {
          clearAll: true
        });
        _0x12d763.appendMatches(_0x28d8e2, _0x44c7e8.map(normalizeMatchRecord));
      }
    }
    if (_0xcbb374() && Object.prototype.hasOwnProperty.call(_0x82b3bd || {}, "cycles")) {
      _0x12d763.deleteCyclesForTask(_0x28d8e2);
      (Array.isArray(_0x3e1dd3) ? _0x3e1dd3 : []).forEach(_0x4fbf65 => _0x12d763.upsertCycle(_0x28d8e2, _0x4fbf65));
    }
    return _0x1cc22d(_0x28d8e2);
  }
  function _0x1ddb07(_0x5c309a = []) {
    const _0x4be2e0 = new Set(Array.isArray(_0x5c309a) ? _0x5c309a : [_0x5c309a]);
    const _0x2068e8 = _0x232c5c().filter(_0x5d2321 => !_0x4be2e0.has(_0x5d2321.id));
    _0x449745(_0x2068e8);
    if (_0xcbb374()) {
      _0x4be2e0.forEach(_0x5a4ab1 => _0x12d763.deleteAllForTask(_0x5a4ab1));
    }
    return true;
  }
  function _0x157505(_0x416a39, _0x5c8fcd = {}) {
    const _0x5b0981 = _0x1cc22d(_0x416a39);
    if (!_0x5b0981) {
      return null;
    }
    const _0x2a0dc9 = {
      ...createEmptyMonitorTaskStats(),
      ...(_0x5b0981.stats || {})
    };
    Object.keys(createEmptyMonitorTaskStats()).forEach(_0x2e7a3c => {
      if (_0x2e7a3c === "lastCycleAt") {
        return;
      }
      const _0x49fa9e = Number(_0x5c8fcd[_0x2e7a3c]);
      if (Number.isFinite(_0x49fa9e) && _0x49fa9e > 0) {
        _0x2a0dc9[_0x2e7a3c] += Math.floor(_0x49fa9e);
      }
    });
    if (_0x5c8fcd.lastCycleAt != null) {
      _0x2a0dc9.lastCycleAt = Number(_0x5c8fcd.lastCycleAt);
    }
    if (_0x5c8fcd.lastCycleComments != null) {
      _0x2a0dc9.lastCycleComments = Number(_0x5c8fcd.lastCycleComments);
    }
    return _0x27e32e(_0x416a39, {
      stats: _0x2a0dc9
    });
  }
  function _0x43d305() {
    const _0xaaefcd = _0x232c5c().map(normalizeMonitorTask);
    const _0x476c7a = Date.now();
    let _0x264699 = false;
    const _0x188ce8 = _0xaaefcd.map(_0x284bc2 => {
      if (_0x284bc2.status !== "running") {
        return _0x284bc2;
      }
      _0x264699 = true;
      const _0x1acb04 = (_0x284bc2.runs || []).map(_0x56aaf2 => _0x56aaf2.endedAt ? _0x56aaf2 : {
        ..._0x56aaf2,
        endedAt: _0x476c7a,
        endReason: "app_restart"
      });
      return normalizeMonitorTask({
        ..._0x284bc2,
        status: "stopped",
        runs: _0x1acb04,
        endedAt: _0x284bc2.endedAt || _0x476c7a,
        endReason: "app_restart"
      });
    });
    if (_0x264699) {
      _0x449745(_0x188ce8);
    }
    return _0x264699;
  }
  function _0x10d9a6(_0x56e29f, _0x54010e = {}) {
    return _0x3fe312(_0x56e29f, [_0x54010e]);
  }
  function _0x3fe312(_0x555fbf, _0x1fb347 = []) {
    const _0x2506b2 = (Array.isArray(_0x1fb347) ? _0x1fb347 : [_0x1fb347]).filter(Boolean).map(normalizeMatchRecord);
    if (!_0x2506b2.length) {
      return _0x1cc22d(_0x555fbf);
    }
    if (_0xcbb374()) {
      if (!_0x1cc22d(_0x555fbf)) {
        return null;
      }
      _0x12d763.appendMatches(_0x555fbf, _0x2506b2);
      return _0x1cc22d(_0x555fbf);
    }
    const _0x34b2b4 = _0x232c5c().map(normalizeMonitorTask);
    const _0x3ee4c7 = _0x34b2b4.findIndex(_0x552a2f => _0x552a2f.id === _0x555fbf);
    if (_0x3ee4c7 === -1) {
      return null;
    }
    const _0x35356f = _0x34b2b4[_0x3ee4c7].matches || [];
    const _0x5c7fa7 = new Set(_0x2506b2.map(_0x4fae2f => _0x4fae2f.id));
    const _0x4531e0 = _0x35356f.filter(_0x2fff93 => !_0x5c7fa7.has(_0x2fff93.id));
    _0x34b2b4[_0x3ee4c7] = normalizeMonitorTask({
      ..._0x34b2b4[_0x3ee4c7],
      matches: [..._0x2506b2, ..._0x4531e0]
    });
    _0x449745(_0x34b2b4);
    return _0x54e586(_0x34b2b4[_0x3ee4c7]);
  }
  function _0x31b923(_0x5f4b1b, _0x154ec0 = {}) {
    const _0x1ea6f9 = _0x1cc22d(_0x5f4b1b);
    if (!_0x1ea6f9) {
      return null;
    }
    if (_0xcbb374()) {
      _0x12d763.deleteMatches(_0x5f4b1b, _0x154ec0);
      return _0x1cc22d(_0x5f4b1b);
    }
    const {
      matchIds = [],
      clearAll = false,
      clearMisses = false
    } = _0x154ec0;
    const _0x29273e = _0x232c5c().map(normalizeMonitorTask);
    const _0x1a62db = _0x29273e.findIndex(_0x29cb43 => _0x29cb43.id === _0x5f4b1b);
    if (_0x1a62db === -1) {
      return null;
    }
    let _0x24ec39 = _0x29273e[_0x1a62db].matches || [];
    if (clearAll) {
      _0x24ec39 = [];
    } else if (clearMisses) {
      _0x24ec39 = _0x24ec39.filter(_0x104c70 => _0x104c70?.matched !== false);
    } else {
      const _0x16b9eb = new Set(Array.isArray(matchIds) ? matchIds : [matchIds]);
      _0x24ec39 = _0x24ec39.filter(_0x33ed92 => !_0x16b9eb.has(_0x33ed92.id));
    }
    _0x29273e[_0x1a62db] = normalizeMonitorTask({
      ..._0x29273e[_0x1a62db],
      matches: _0x24ec39
    });
    _0x449745(_0x29273e);
    return _0x54e586(_0x29273e[_0x1a62db]);
  }
  function _0x3cf895(_0x3ba627, _0x29d733 = {}) {
    if (_0xcbb374()) {
      return _0x12d763.listMatchesPage(_0x3ba627, _0x29d733);
    }
    const _0x15c7f7 = _0x232c5c().map(normalizeMonitorTask).find(_0x1be59b => _0x1be59b.id === _0x3ba627);
    const _0x5b06a3 = Array.isArray(_0x15c7f7?.matches) ? _0x15c7f7.matches : [];
    const _0x253828 = Math.max(1, Math.min(100, Number(_0x29d733.limit) || 20));
    const _0xea7296 = Math.max(0, Number(_0x29d733.offset) || 0);
    return {
      items: _0x5b06a3.slice(_0xea7296, _0xea7296 + _0x253828),
      total: _0x5b06a3.length,
      counts: {
        all: _0x5b06a3.length,
        hit: _0x5b06a3.filter(_0x27db45 => _0x27db45?.matched !== false).length,
        miss: _0x5b06a3.filter(_0x1d1ae9 => _0x1d1ae9?.matched === false).length
      }
    };
  }
  function _0x533f2e(_0x2cabcc, _0x23a8d3 = {}) {
    if (_0xcbb374()) {
      return _0x12d763.listCyclesPage(_0x2cabcc, _0x23a8d3);
    }
    const _0x20331a = _0x232c5c().map(normalizeMonitorTask).find(_0x1fa480 => _0x1fa480.id === _0x2cabcc);
    const _0x4068ad = Array.isArray(_0x20331a?.cycles) ? _0x20331a.cycles : [];
    const _0xd360ff = Math.max(1, Math.min(100, Number(_0x23a8d3.limit) || 20));
    const _0x5edbd2 = Math.max(0, Number(_0x23a8d3.offset) || 0);
    return {
      items: _0x4068ad.slice(_0x5edbd2, _0x5edbd2 + _0xd360ff),
      total: _0x4068ad.length
    };
  }
  function _0x56a9ef(_0xb99e53, _0xabcc3d = {}) {
    if (_0xcbb374()) {
      return _0x12d763.listVideoCommentsPage(_0xb99e53, _0xabcc3d);
    }
    const _0x5dd0d3 = _0x232c5c().map(normalizeMonitorTask).find(_0x344dfd => _0x344dfd.id === _0xb99e53);
    let _0x5854fa = Array.isArray(_0x5dd0d3?.videoComments) ? _0x5dd0d3.videoComments : [];
    const _0xdb35af = String(_0xabcc3d.keyword || "").trim().toLowerCase();
    if (_0xdb35af) {
      _0x5854fa = _0x5854fa.filter(_0x571a1d => {
        const _0x2d4060 = [_0x571a1d.content, _0x571a1d.videoTitle, _0x571a1d.videoUrl, _0x571a1d.accountName, _0x571a1d.accountId].map(_0x4f0433 => String(_0x4f0433 || "").toLowerCase()).join(" ");
        return _0x2d4060.includes(_0xdb35af);
      });
    }
    const _0x31fdf7 = Math.max(1, Math.min(100, Number(_0xabcc3d.limit) || 20));
    const _0x96154b = Math.max(0, Number(_0xabcc3d.offset) || 0);
    return {
      items: _0x5854fa.slice(_0x96154b, _0x96154b + _0x31fdf7),
      total: _0x5854fa.length
    };
  }
  function _0x41d2dd(_0x428951, _0x3bb0e1 = []) {
    const _0x53343f = (Array.isArray(_0x3bb0e1) ? _0x3bb0e1 : [_0x3bb0e1]).filter(Boolean).map(normalizeMonitorVideoCommentRecord);
    if (!_0x53343f.length) {
      return _0x1cc22d(_0x428951);
    }
    if (_0xcbb374()) {
      if (!_0x1cc22d(_0x428951)) {
        return null;
      }
      _0x12d763.appendVideoComments(_0x428951, _0x53343f);
      return _0x1cc22d(_0x428951);
    }
    const _0x51cd58 = _0x232c5c().map(normalizeMonitorTask);
    const _0x557e33 = _0x51cd58.findIndex(_0x1c6493 => _0x1c6493.id === _0x428951);
    if (_0x557e33 === -1) {
      return null;
    }
    const _0x23f761 = _0x51cd58[_0x557e33].videoComments || [];
    const _0xa7e504 = new Set(_0x53343f.map(_0x20c7fe => _0x20c7fe.id));
    const _0xcd28f2 = _0x23f761.filter(_0x28234c => !_0xa7e504.has(_0x28234c.id));
    _0x51cd58[_0x557e33] = normalizeMonitorTask({
      ..._0x51cd58[_0x557e33],
      videoComments: [..._0x53343f, ..._0xcd28f2].slice(0, MAX_MONITOR_TASK_VIDEO_COMMENTS)
    });
    _0x449745(_0x51cd58);
    return _0x54e586(_0x51cd58[_0x557e33]);
  }
  function _0x31060d(_0x468c71) {
    if (_0xcbb374()) {
      return _0x12d763.listMatchUserKeys(_0x468c71);
    }
    const _0x919fc2 = _0x232c5c().map(normalizeMonitorTask).find(_0x4e43bf => _0x4e43bf.id === _0x468c71);
    return (_0x919fc2?.matches || []).map(_0x511156 => ({
      userUrl: _0x511156.userUrl || "",
      secUid: _0x511156.secUid || "",
      sec_uid: _0x511156.sec_uid || "",
      matchType: _0x511156.matchType || "",
      matched: _0x511156.matched !== false ? 1 : 0,
      judgeReason: _0x511156.judgeReason || ""
    }));
  }
  function _0x501efb(_0x25a0e9, _0x318071 = {}) {
    const _0x1fe082 = Number(_0x318071.startedAt) || Date.now();
    if (_0xcbb374()) {
      if (!_0x1cc22d(_0x25a0e9)) {
        return null;
      }
      const _0x27cdea = _0x12d763.listOpenCycles(_0x25a0e9);
      _0x27cdea.forEach(_0x5f4452 => {
        _0x12d763.upsertCycle(_0x25a0e9, {
          ..._0x5f4452,
          endedAt: _0x1fe082,
          durationMs: _0x5f4452.startedAt ? Math.max(0, _0x1fe082 - Number(_0x5f4452.startedAt)) : _0x5f4452.durationMs,
          status: "stopped"
        });
      });
      const _0x47f7af = normalizeMonitorTaskCycle({
        ..._0x318071,
        id: _0x318071.id || "cycle_" + _0x1fe082 + "_" + Math.random().toString(36).slice(2, 8),
        round: _0x318071.round || _0x12d763.maxCycleRound(_0x25a0e9) + 1,
        startedAt: _0x1fe082,
        endedAt: null,
        durationMs: null,
        status: "running"
      });
      _0x12d763.upsertCycle(_0x25a0e9, _0x47f7af);
      return {
        ..._0x1cc22d(_0x25a0e9),
        cycles: [_0x47f7af]
      };
    }
    const _0x13a76a = _0x1cc22d(_0x25a0e9);
    if (!_0x13a76a) {
      return null;
    }
    const _0x29dd2c = closeOpenCycles(_0x13a76a.cycles || [], _0x1fe082);
    const _0xad59a7 = normalizeMonitorTaskCycle({
      ..._0x318071,
      id: _0x318071.id || "cycle_" + _0x1fe082 + "_" + Math.random().toString(36).slice(2, 8),
      round: _0x318071.round || nextCycleRound(_0x29dd2c),
      startedAt: _0x1fe082,
      endedAt: null,
      durationMs: null,
      status: "running"
    });
    return _0x27e32e(_0x25a0e9, {
      cycles: prependCycle(_0x29dd2c, _0xad59a7)
    });
  }
  function _0x15f0fc(_0x386c67, _0x118767, _0x3d9f7f = {}) {
    if (!_0x386c67 || !_0x118767) {
      return null;
    }
    const _0x919820 = Object.values(_0x3d9f7f || {}).some(_0x5bada4 => Number(_0x5bada4) > 0);
    if (!_0x919820) {
      return _0x1cc22d(_0x386c67);
    }
    if (_0xcbb374()) {
      const _0x156a62 = _0x12d763.getCycle(_0x386c67, _0x118767);
      if (!_0x156a62 || _0x156a62.status !== "running") {
        return _0x1cc22d(_0x386c67);
      }
      const _0x5e99c2 = normalizeMonitorTaskCycle({
        ..._0x156a62,
        ...addCycleMetrics(_0x156a62, _0x3d9f7f),
        id: _0x156a62.id,
        round: _0x156a62.round,
        startedAt: _0x156a62.startedAt,
        endedAt: null,
        durationMs: null,
        status: "running"
      });
      _0x12d763.upsertCycle(_0x386c67, _0x5e99c2);
      return {
        ..._0x1cc22d(_0x386c67),
        cycles: [_0x5e99c2]
      };
    }
    const _0xc5e517 = _0x1cc22d(_0x386c67);
    if (!_0xc5e517) {
      return null;
    }
    const _0x2b31b7 = (_0xc5e517.cycles || []).map(_0x5c09a7 => {
      if (_0x5c09a7.id !== _0x118767 || _0x5c09a7.status !== "running") {
        return _0x5c09a7;
      }
      return normalizeMonitorTaskCycle({
        ..._0x5c09a7,
        ...addCycleMetrics(_0x5c09a7, _0x3d9f7f),
        id: _0x5c09a7.id,
        endedAt: null,
        durationMs: null,
        status: "running"
      });
    });
    return _0x27e32e(_0x386c67, {
      cycles: _0x2b31b7
    });
  }
  function _0x197987(_0x5d1046, _0x5262dc, _0x2ffb7d = {}) {
    const _0xa6bc64 = _0x2ffb7d.endedAt != null ? Number(_0x2ffb7d.endedAt) : Date.now();
    if (_0xcbb374()) {
      const _0x4fcff6 = _0x12d763.getCycle(_0x5d1046, _0x5262dc);
      if (!_0x4fcff6) {
        return _0x1cc22d(_0x5d1046);
      }
      const _0x337b84 = Number(_0x4fcff6.startedAt) || _0xa6bc64;
      const _0x255ea6 = normalizeMonitorTaskCycle({
        ..._0x4fcff6,
        ..._0x2ffb7d,
        ...mergeCycleMetrics(_0x4fcff6, _0x2ffb7d),
        id: _0x4fcff6.id,
        round: _0x4fcff6.round,
        startedAt: _0x337b84,
        endedAt: _0xa6bc64,
        durationMs: _0x2ffb7d.durationMs != null ? Number(_0x2ffb7d.durationMs) : Math.max(0, _0xa6bc64 - _0x337b84),
        status: _0x2ffb7d.status || "done"
      });
      _0x12d763.upsertCycle(_0x5d1046, _0x255ea6);
      return {
        ..._0x1cc22d(_0x5d1046),
        cycles: [_0x255ea6]
      };
    }
    const _0x21eb03 = _0x1cc22d(_0x5d1046);
    if (!_0x21eb03 || !_0x5262dc) {
      return _0x21eb03;
    }
    const _0x3c8e56 = (_0x21eb03.cycles || []).map(_0x241044 => {
      if (_0x241044.id !== _0x5262dc) {
        return _0x241044;
      }
      const _0x221d3e = Number(_0x241044.startedAt) || _0xa6bc64;
      return normalizeMonitorTaskCycle({
        ..._0x241044,
        ..._0x2ffb7d,
        ...mergeCycleMetrics(_0x241044, _0x2ffb7d),
        id: _0x241044.id,
        round: _0x241044.round,
        startedAt: _0x221d3e,
        endedAt: _0xa6bc64,
        durationMs: _0x2ffb7d.durationMs ?? Math.max(0, _0xa6bc64 - _0x221d3e),
        status: _0x2ffb7d.status || "done"
      });
    });
    return _0x27e32e(_0x5d1046, {
      cycles: _0x3c8e56
    });
  }
  return {
    listTasks: _0x40dde9,
    findTaskById: _0x1cc22d,
    upsertTask: _0xc74340,
    patchTask: _0x27e32e,
    deleteTasks: _0x1ddb07,
    incrementStats: _0x157505,
    appendMatchRecord: _0x10d9a6,
    appendMatchRecords: _0x3fe312,
    deleteMatchRecords: _0x31b923,
    listMatchRecordsPage: _0x3cf895,
    listCycleRecordsPage: _0x533f2e,
    listVideoCommentRecordsPage: _0x56a9ef,
    appendVideoCommentRecords: _0x41d2dd,
    listMatchUserKeys: _0x31060d,
    beginCycle: _0x501efb,
    incrementCycleMetrics: _0x15f0fc,
    finishCycle: _0x197987,
    resetStaleRunningTasks: _0x43d305,
    normalizeMonitorTask: normalizeMonitorTask
  };
}
module.exports = {
  createMonitorTasksApi: createMonitorTasksApi,
  normalizeMonitorTask: normalizeMonitorTask,
  createCrypto: createCrypto
};
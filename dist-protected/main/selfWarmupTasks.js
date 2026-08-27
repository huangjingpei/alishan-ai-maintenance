const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const {
  buildSelfWarmupEventSeenKey
} = require("../shared/selfWarmupDedupe");
const SELF_WARMUP_TASKS_FILE = _0x2e117d => path.join(_0x2e117d, "self_warmup_tasks.enc");
const MAX_EVENT_RECORDS = 800;
function createCrypto(_0x1a0853) {
  const _0x36a892 = crypto.scryptSync("huoke-radar-secret-v1", "salt", 32);
  const _0x17b3f0 = Buffer.alloc(16, 0);
  const _0x42f1d9 = SELF_WARMUP_TASKS_FILE(_0x1a0853);
  function _0x2a1ae4(_0x3347c4, _0x1ef67c = []) {
    if (!fs.existsSync(_0x3347c4)) {
      return _0x1ef67c;
    }
    try {
      const _0x59fbf2 = fs.readFileSync(_0x3347c4, "utf8");
      if (!_0x59fbf2) {
        return _0x1ef67c;
      }
      const _0x276e8b = crypto.createDecipheriv("aes-256-cbc", _0x36a892, _0x17b3f0);
      let _0x379e92 = _0x276e8b.update(_0x59fbf2, "hex", "utf8");
      _0x379e92 += _0x276e8b.final("utf8");
      return JSON.parse(_0x379e92);
    } catch (_0x40019c) {
      return _0x1ef67c;
    }
  }
  function _0x34b377(_0x44e2b0, _0x3bfbb4) {
    const _0xb2980d = crypto.createCipheriv("aes-256-cbc", _0x36a892, _0x17b3f0);
    let _0x1598f8 = _0xb2980d.update(JSON.stringify(_0x3bfbb4), "utf8", "hex");
    _0x1598f8 += _0xb2980d.final("hex");
    fs.writeFileSync(_0x44e2b0, _0x1598f8);
  }
  return {
    filePath: _0x42f1d9,
    readTasks: () => _0x2a1ae4(_0x42f1d9, []),
    writeTasks: _0x2f6851 => _0x34b377(_0x42f1d9, _0x2f6851)
  };
}
function createEmptySelfWarmupTaskStats() {
  return {
    checks: 0,
    eventsTotal: 0,
    notifications: 0,
    comments: 0,
    replies: 0,
    likes: 0,
    follows: 0,
    messages: 0,
    matched: 0,
    suggestions: 0,
    webhookPushed: 0,
    actionsExecuted: 0,
    lastCycleEvents: 0,
    lastCycleAt: null
  };
}
function normalizeSelfWarmupEvent(_0x5a7ffe = {}) {
  return {
    id: String(_0x5a7ffe.id || "warm_event_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8)),
    ts: Number(_0x5a7ffe.ts || Date.now()),
    accountId: String(_0x5a7ffe.accountId || ""),
    accountName: String(_0x5a7ffe.accountName || ""),
    source: _0x5a7ffe.source || "notification",
    eventType: _0x5a7ffe.eventType || "unknown",
    eventLabel: String(_0x5a7ffe.eventLabel || ""),
    nickname: String(_0x5a7ffe.nickname || ""),
    userUrl: String(_0x5a7ffe.userUrl || ""),
    videoUrl: String(_0x5a7ffe.videoUrl || ""),
    text: String(_0x5a7ffe.text || ""),
    timeText: String(_0x5a7ffe.timeText || _0x5a7ffe.time || ""),
    unread: !!_0x5a7ffe.unread,
    isGroupChat: !!_0x5a7ffe.isGroupChat,
    hasFollowButton: _0x5a7ffe.hasFollowButton === undefined ? false : !!_0x5a7ffe.hasFollowButton,
    matched: _0x5a7ffe.matched === undefined ? true : !!_0x5a7ffe.matched,
    matchType: _0x5a7ffe.matchType || "rule",
    judgeReason: String(_0x5a7ffe.judgeReason || ""),
    suggestedText: String(_0x5a7ffe.suggestedText || ""),
    suggestedCommentText: String(_0x5a7ffe.suggestedCommentText || ""),
    suggestedDmText: String(_0x5a7ffe.suggestedDmText || ""),
    suggestionStatus: _0x5a7ffe.suggestionStatus || "none",
    webhookStatus: _0x5a7ffe.webhookStatus || "none",
    actionStatus: _0x5a7ffe.actionStatus || "none",
    actionSummary: String(_0x5a7ffe.actionSummary || ""),
    actionErrorReason: String(_0x5a7ffe.actionErrorReason || ""),
    actionFailures: Array.isArray(_0x5a7ffe.actionFailures) ? _0x5a7ffe.actionFailures.map(_0x44e858 => ({
      action: String(_0x44e858?.action || ""),
      reason: String(_0x44e858?.reason || "")
    })) : [],
    actionSkippedReasons: Array.isArray(_0x5a7ffe.actionSkippedReasons) ? _0x5a7ffe.actionSkippedReasons.map(_0x48688b => ({
      action: String(_0x48688b?.action || ""),
      reason: String(_0x48688b?.reason || "")
    })) : [],
    actionsTaken: Array.isArray(_0x5a7ffe.actionsTaken) ? _0x5a7ffe.actionsTaken.map(String) : [],
    suggestionErrorReason: String(_0x5a7ffe.suggestionErrorReason || ""),
    webhookErrorReason: String(_0x5a7ffe.webhookErrorReason || "")
  };
}
function normalizeSelfWarmupTask(_0x911919 = {}) {
  const _0x635562 = Array.isArray(_0x911919.runs) ? _0x911919.runs.map(_0xe6f3b6 => ({
    accountId: String(_0xe6f3b6.accountId || ""),
    nickname: String(_0xe6f3b6.nickname || _0xe6f3b6.name || ""),
    name: String(_0xe6f3b6.name || ""),
    personaId: _0xe6f3b6.personaId || "none",
    endedAt: _0xe6f3b6.endedAt != null ? Number(_0xe6f3b6.endedAt) : null,
    endReason: _0xe6f3b6.endReason || ""
  })).filter(_0x58ad39 => _0x58ad39.accountId) : [];
  return {
    id: String(_0x911919.id || "self_warmup_" + Date.now()),
    name: String(_0x911919.name || "自热互动"),
    status: _0x911919.status || "draft",
    createdAt: Number(_0x911919.createdAt || Date.now()),
    startedAt: _0x911919.startedAt != null ? Number(_0x911919.startedAt) : null,
    endedAt: _0x911919.endedAt != null ? Number(_0x911919.endedAt) : null,
    endReason: _0x911919.endReason || "",
    runs: _0x635562,
    configSnapshot: _0x911919.configSnapshot || null,
    stats: {
      ...createEmptySelfWarmupTaskStats(),
      ...(_0x911919.stats || {})
    },
    events: Array.isArray(_0x911919.events) ? _0x911919.events.map(normalizeSelfWarmupEvent).slice(0, MAX_EVENT_RECORDS) : [],
    remark: _0x911919.remark || ""
  };
}
function createSelfWarmupTasksApi({
  userDataPath: _0xe566e4
}) {
  const _0x52cb4f = createCrypto(_0xe566e4);
  const {
    readTasks: _0x186159,
    writeTasks: _0x5b7b4a
  } = _0x52cb4f;
  const _0x4325c1 = require("./selfWarmupEventsStore");
  try {
    _0x4325c1.runSelfWarmupEventsSqliteMigrationIfNeeded({
      readTasks: _0x186159,
      writeTasks: _0x5b7b4a,
      normalizeEvent: normalizeSelfWarmupEvent
    });
  } catch (_0xd8b10c) {
    console.error("[SelfWarmup] 明细 SQLite 迁移异常（保留 enc）:", _0xd8b10c);
  }
  function _0x51e779() {
    if (!_0x4325c1.isReady()) {
      return false;
    }
    try {
      _0x4325c1.runSelfWarmupEventsSqliteMigrationIfNeeded({
        readTasks: _0x186159,
        writeTasks: _0x5b7b4a,
        normalizeEvent: normalizeSelfWarmupEvent
      });
    } catch (_0x550288) {
      console.error("[SelfWarmup] 明细 SQLite 迁移异常（保留 enc）:", _0x550288);
      return false;
    }
    return _0x4325c1.isMigrationApplied();
  }
  function _0x14766e(_0x30db8b) {
    const _0xea3487 = _0x51e779();
    _0x5b7b4a((Array.isArray(_0x30db8b) ? _0x30db8b : []).map(_0x2afe5d => {
      const _0x51b0bc = {
        ..._0x2afe5d
      };
      if (_0xea3487) {
        _0x51b0bc.events = [];
      }
      return _0x51b0bc;
    }));
  }
  function _0x5ac21c(_0x177b11) {
    if (!_0x177b11) {
      return null;
    }
    if (!_0x51e779()) {
      const _0x1a2c1e = Array.isArray(_0x177b11.events) ? _0x177b11.events : [];
      return {
        ..._0x177b11,
        eventCount: _0x1a2c1e.length,
        hitCount: _0x1a2c1e.filter(_0x4a3f90 => _0x4a3f90?.matched !== false).length
      };
    }
    return {
      ..._0x177b11,
      events: [],
      eventCount: Number(_0x177b11.eventCount) || 0,
      hitCount: Number(_0x177b11.hitCount) || 0
    };
  }
  function _0x4ce3a1(_0x536cae) {
    if (!_0x51e779()) {
      return _0x536cae.map(_0x5ac21c);
    }
    const _0x429be9 = _0x4325c1.countEventsByTask();
    return _0x536cae.map(_0x25cf72 => {
      const _0xd32a21 = _0x429be9.get(String(_0x25cf72.id)) || {
        eventCount: 0,
        hitCount: 0
      };
      return _0x5ac21c({
        ..._0x25cf72,
        events: [],
        eventCount: _0xd32a21.eventCount,
        hitCount: _0xd32a21.hitCount
      });
    });
  }
  function _0x544f1e() {
    return _0x4ce3a1(_0x186159().map(normalizeSelfWarmupTask).sort((_0x1e54f7, _0x59b206) => (_0x59b206.createdAt || 0) - (_0x1e54f7.createdAt || 0)));
  }
  function _0x90484d(_0x31f28f) {
    const _0x5c1ffb = _0x186159().map(normalizeSelfWarmupTask).find(_0x43afb2 => _0x43afb2.id === _0x31f28f);
    if (!_0x5c1ffb) {
      return null;
    }
    return _0x4ce3a1([_0x5c1ffb])[0];
  }
  function _0x5b94a0(_0x5beb22) {
    const _0x5d9d89 = _0x186159().map(normalizeSelfWarmupTask);
    const _0x4d6f8f = normalizeSelfWarmupTask(_0x5beb22);
    const _0x4353aa = _0x5d9d89.findIndex(_0x5149c8 => _0x5149c8.id === _0x4d6f8f.id);
    if (_0x4353aa === -1) {
      _0x5d9d89.unshift(_0x4d6f8f);
      if (_0x51e779() && Array.isArray(_0x5beb22?.events) && _0x5beb22.events.length) {
        _0x4325c1.upsertEvents(_0x4d6f8f.id, _0x5beb22.events, {
          normalizeEvent: normalizeSelfWarmupEvent
        });
      }
    } else {
      const _0x4ad1a2 = {
        ..._0x5d9d89[_0x4353aa],
        ..._0x4d6f8f,
        id: _0x4d6f8f.id
      };
      if (!Array.isArray(_0x5beb22.events) && !_0x51e779()) {
        _0x4ad1a2.events = _0x5d9d89[_0x4353aa].events;
      }
      _0x5d9d89[_0x4353aa] = normalizeSelfWarmupTask(_0x4ad1a2);
    }
    _0x14766e(_0x5d9d89);
    return _0x90484d(_0x4d6f8f.id);
  }
  function _0x7b0824(_0x384b90, _0x4f9338 = {}) {
    const _0x49b05b = _0x186159().map(normalizeSelfWarmupTask);
    const _0x54dfd1 = _0x49b05b.findIndex(_0x15579f => _0x15579f.id === _0x384b90);
    if (_0x54dfd1 === -1) {
      return null;
    }
    const {
      events: _0x52b278,
      ..._0x30cf0a
    } = _0x4f9338 || {};
    const _0x327010 = {
      ..._0x49b05b[_0x54dfd1],
      ..._0x30cf0a,
      id: _0x384b90
    };
    if (!_0x51e779() && Object.prototype.hasOwnProperty.call(_0x4f9338 || {}, "events")) {
      _0x327010.events = _0x52b278;
    }
    _0x49b05b[_0x54dfd1] = normalizeSelfWarmupTask(_0x327010);
    _0x14766e(_0x49b05b);
    if (_0x51e779() && Object.prototype.hasOwnProperty.call(_0x4f9338 || {}, "events")) {
      _0x4325c1.deleteEvents(_0x384b90, {
        clearAll: true
      });
      if (Array.isArray(_0x52b278) && _0x52b278.length) {
        _0x4325c1.upsertEvents(_0x384b90, _0x52b278, {
          normalizeEvent: normalizeSelfWarmupEvent
        });
      }
    }
    return _0x90484d(_0x384b90);
  }
  function _0x5d823b(_0x14a093 = []) {
    const _0x242c7d = new Set(Array.isArray(_0x14a093) ? _0x14a093 : [_0x14a093]);
    const _0x19111d = _0x186159().filter(_0x418044 => !_0x242c7d.has(_0x418044.id));
    _0x14766e(_0x19111d);
    if (_0x51e779()) {
      _0x242c7d.forEach(_0x2b988a => _0x4325c1.deleteAllForTask(_0x2b988a));
    }
    return true;
  }
  function _0x477a7c(_0x5d9ac7, _0x2c92d5 = {}) {
    const _0x151937 = _0x90484d(_0x5d9ac7);
    if (!_0x151937) {
      return null;
    }
    const _0x5046b5 = {
      ...createEmptySelfWarmupTaskStats(),
      ...(_0x151937.stats || {})
    };
    Object.keys(createEmptySelfWarmupTaskStats()).forEach(_0x24f50a => {
      if (_0x24f50a === "lastCycleAt") {
        return;
      }
      const _0x5b275d = Number(_0x2c92d5[_0x24f50a]);
      if (Number.isFinite(_0x5b275d) && _0x5b275d > 0) {
        _0x5046b5[_0x24f50a] += Math.floor(_0x5b275d);
      }
    });
    if (_0x2c92d5.lastCycleAt != null) {
      _0x5046b5.lastCycleAt = Number(_0x2c92d5.lastCycleAt);
    }
    if (_0x2c92d5.lastCycleEvents != null) {
      _0x5046b5.lastCycleEvents = Number(_0x2c92d5.lastCycleEvents);
    }
    return _0x7b0824(_0x5d9ac7, {
      stats: _0x5046b5
    });
  }
  function _0xd0ca8d(_0x5b4de3, _0x3dd731 = {}) {
    const _0xbc97a7 = normalizeSelfWarmupEvent(_0x3dd731);
    if (_0x51e779()) {
      if (!_0x90484d(_0x5b4de3)) {
        return null;
      }
      _0x4325c1.upsertEvents(_0x5b4de3, [_0xbc97a7], {
        normalizeEvent: normalizeSelfWarmupEvent
      });
      return _0x90484d(_0x5b4de3);
    }
    const _0x24606e = _0x186159().map(normalizeSelfWarmupTask);
    const _0x44e359 = _0x24606e.findIndex(_0x22f1e2 => _0x22f1e2.id === _0x5b4de3);
    if (_0x44e359 === -1) {
      return null;
    }
    const _0x4fe589 = (_0x24606e[_0x44e359].events || []).map(normalizeSelfWarmupEvent);
    const _0xbe9641 = buildSelfWarmupEventSeenKey(_0xbc97a7);
    const _0x50185d = _0x4fe589.findIndex(_0x4ababf => buildSelfWarmupEventSeenKey(_0x4ababf) === _0xbe9641);
    if (_0x50185d >= 0) {
      _0x4fe589[_0x50185d] = normalizeSelfWarmupEvent({
        ..._0x4fe589[_0x50185d],
        ..._0xbc97a7,
        id: _0x4fe589[_0x50185d].id || _0xbc97a7.id
      });
      _0x24606e[_0x44e359] = normalizeSelfWarmupTask({
        ..._0x24606e[_0x44e359],
        events: _0x4fe589.slice(0, MAX_EVENT_RECORDS)
      });
    } else {
      _0x24606e[_0x44e359] = normalizeSelfWarmupTask({
        ..._0x24606e[_0x44e359],
        events: [_0xbc97a7, ..._0x4fe589].slice(0, MAX_EVENT_RECORDS)
      });
    }
    _0x14766e(_0x24606e);
    return _0x5ac21c(_0x24606e[_0x44e359]);
  }
  function _0x593ce9(_0x37fa1d, _0x1dd02a = {}) {
    const _0x3ed468 = _0x90484d(_0x37fa1d);
    if (!_0x3ed468) {
      return null;
    }
    if (_0x51e779()) {
      const {
        rows: _0xc5f7ee
      } = _0x4325c1.deleteEvents(_0x37fa1d, _0x1dd02a);
      return {
        ..._0x90484d(_0x37fa1d),
        _removedEvents: _0xc5f7ee
      };
    }
    const {
      eventIds = [],
      clearAll = false
    } = _0x1dd02a;
    const _0x314d2d = _0x186159().map(normalizeSelfWarmupTask);
    const _0x149281 = _0x314d2d.findIndex(_0x44e3fb => _0x44e3fb.id === _0x37fa1d);
    if (_0x149281 === -1) {
      return null;
    }
    const _0x5d6b05 = _0x314d2d[_0x149281].events || [];
    let _0x1e2661 = _0x5d6b05;
    let _0x4718c1 = [];
    if (clearAll) {
      _0x4718c1 = _0x5d6b05;
      _0x1e2661 = [];
    } else {
      const _0x4390b4 = new Set(Array.isArray(eventIds) ? eventIds : [eventIds]);
      if (_0x4390b4.size === 0) {
        return _0x5ac21c(_0x314d2d[_0x149281]);
      }
      _0x4718c1 = _0x5d6b05.filter(_0x33b2ff => _0x4390b4.has(_0x33b2ff.id));
      _0x1e2661 = _0x5d6b05.filter(_0x4ae428 => !_0x4390b4.has(_0x4ae428.id));
    }
    _0x314d2d[_0x149281] = normalizeSelfWarmupTask({
      ..._0x314d2d[_0x149281],
      events: _0x1e2661
    });
    _0x14766e(_0x314d2d);
    return {
      ..._0x5ac21c(_0x314d2d[_0x149281]),
      _removedEvents: _0x4718c1
    };
  }
  function _0x185221(_0x5ebaa9, _0xd66efc = {}) {
    if (_0x51e779()) {
      return _0x4325c1.listEventsPage(_0x5ebaa9, _0xd66efc);
    }
    const _0x20949d = _0x186159().map(normalizeSelfWarmupTask).find(_0x488408 => _0x488408.id === _0x5ebaa9);
    let _0x305b2c = Array.isArray(_0x20949d?.events) ? _0x20949d.events : [];
    const _0x56911e = String(_0xd66efc.result || "all");
    if (_0x56911e === "hit") {
      _0x305b2c = _0x305b2c.filter(_0x4a1f92 => _0x4a1f92?.matched !== false);
    }
    if (_0x56911e === "miss") {
      _0x305b2c = _0x305b2c.filter(_0xea390d => _0xea390d?.matched === false);
    }
    const _0x5739e4 = String(_0xd66efc.keyword || "").trim().toLowerCase();
    if (_0x5739e4) {
      _0x305b2c = _0x305b2c.filter(_0x5a7991 => {
        const _0x42124e = [_0x5a7991.nickname, _0x5a7991.text, _0x5a7991.eventLabel, _0x5a7991.judgeReason, _0x5a7991.suggestedText, _0x5a7991.accountName, _0x5a7991.timeText, _0x5a7991.actionErrorReason, _0x5a7991.suggestionErrorReason, _0x5a7991.webhookErrorReason].map(_0x5a2e9c => String(_0x5a2e9c || "").toLowerCase()).join(" ");
        return _0x42124e.includes(_0x5739e4);
      });
    }
    const _0x1db7fd = Array.isArray(_0x20949d?.events) ? _0x20949d.events : [];
    const _0x28e376 = Math.max(1, Math.min(100, Number(_0xd66efc.limit) || 20));
    const _0x1900c1 = Math.max(0, Number(_0xd66efc.offset) || 0);
    return {
      items: _0x305b2c.slice(_0x1900c1, _0x1900c1 + _0x28e376),
      total: _0x305b2c.length,
      counts: {
        all: _0x1db7fd.length,
        hit: _0x1db7fd.filter(_0x720d67 => _0x720d67?.matched !== false).length,
        miss: _0x1db7fd.filter(_0x56e8b8 => _0x56e8b8?.matched === false).length
      }
    };
  }
  function _0x15b911(_0x3eb56c, _0x214559 = {}) {
    if (_0x51e779()) {
      return _0x4325c1.listEventsForUser(_0x3eb56c, _0x214559);
    }
    const _0x1f70f3 = _0x186159().map(normalizeSelfWarmupTask).find(_0x416419 => _0x416419.id === _0x3eb56c);
    const _0x2365e9 = String(_0x214559.nickname || "").trim().toLowerCase();
    const _0x32c604 = String(_0x214559.userUrl || "").trim();
    return (_0x1f70f3?.events || []).filter(_0x2e316f => {
      const _0x2acf63 = String(_0x2e316f.nickname || "").trim().toLowerCase();
      const _0x948f60 = _0x2365e9 && _0x2acf63 && _0x2365e9 === _0x2acf63;
      const _0x74ad2a = _0x32c604 && String(_0x2e316f.userUrl || "").includes(_0x32c604.split("?")[0]);
      return _0x948f60 || _0x74ad2a;
    });
  }
  function _0x8e04aa() {
    const _0x4eb8b2 = _0x186159().map(normalizeSelfWarmupTask);
    const _0x42ffa0 = Date.now();
    let _0x4bcdca = false;
    const _0x10963c = _0x4eb8b2.map(_0x253c06 => {
      if (_0x253c06.status !== "running") {
        return _0x253c06;
      }
      _0x4bcdca = true;
      const _0x46dce0 = (_0x253c06.runs || []).map(_0x20f0ee => _0x20f0ee.endedAt ? _0x20f0ee : {
        ..._0x20f0ee,
        endedAt: _0x42ffa0,
        endReason: "app_restart"
      });
      return normalizeSelfWarmupTask({
        ..._0x253c06,
        status: "stopped",
        runs: _0x46dce0,
        endedAt: _0x253c06.endedAt || _0x42ffa0,
        endReason: "app_restart"
      });
    });
    if (_0x4bcdca) {
      _0x14766e(_0x10963c);
    }
    return _0x4bcdca;
  }
  return {
    listTasks: _0x544f1e,
    findTaskById: _0x90484d,
    upsertTask: _0x5b94a0,
    patchTask: _0x7b0824,
    deleteTasks: _0x5d823b,
    incrementStats: _0x477a7c,
    appendEventRecord: _0xd0ca8d,
    deleteEventRecords: _0x593ce9,
    listEventRecordsPage: _0x185221,
    listEventsForUser: _0x15b911,
    resetStaleRunningTasks: _0x8e04aa,
    normalizeSelfWarmupTask: normalizeSelfWarmupTask
  };
}
module.exports = {
  createSelfWarmupTasksApi: createSelfWarmupTasksApi,
  normalizeSelfWarmupTask: normalizeSelfWarmupTask,
  createEmptySelfWarmupTaskStats: createEmptySelfWarmupTaskStats,
  createCrypto: createCrypto
};
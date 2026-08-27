const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const {
  stripLocationFromCommentTimeText
} = require("../shared/commentTime");
const {
  extractDouyinVideoId,
  canonicalizeDouyinVideoUrl
} = require("../shared/processedVideoKey");
const {
  normalizeAwemeCreateTimeMs
} = require("../shared/entityBloggerProfileSelect");
const dbManager = require("./dbManager");
const entityLeadgenLeadsQuery = require("./entityLeadgenLeadsQuery");
function normalizeLeadPublishTimeMs(_0x12942a) {
  return normalizeAwemeCreateTimeMs(_0x12942a?.publishTime ?? _0x12942a?.createTime ?? _0x12942a?.create_time ?? 0);
}
const ENTITY_LEADGEN_TASKS_FILE = _0x5f26d5 => path.join(_0x5f26d5, "entity_leadgen_tasks.enc");
function createCrypto(_0x5de064) {
  const _0x49c52f = crypto.scryptSync("huoke-radar-secret-v1", "salt", 32);
  const _0x13cb5d = Buffer.alloc(16, 0);
  const _0x228b86 = ENTITY_LEADGEN_TASKS_FILE(_0x5de064);
  function _0x28037d(_0x2c6b5c, _0x1c00a6 = []) {
    if (!fs.existsSync(_0x2c6b5c)) {
      return _0x1c00a6;
    }
    try {
      const _0x3bc219 = fs.readFileSync(_0x2c6b5c, "utf8");
      if (!_0x3bc219) {
        return _0x1c00a6;
      }
      const _0x6f6db1 = crypto.createDecipheriv("aes-256-cbc", _0x49c52f, _0x13cb5d);
      let _0x36a063 = _0x6f6db1.update(_0x3bc219, "hex", "utf8");
      _0x36a063 += _0x6f6db1.final("utf8");
      return JSON.parse(_0x36a063);
    } catch (_0xd123e1) {
      return _0x1c00a6;
    }
  }
  function _0x526b84(_0xd36602, _0x179e28) {
    const _0x35bb27 = crypto.createCipheriv("aes-256-cbc", _0x49c52f, _0x13cb5d);
    let _0x2a2b8a = _0x35bb27.update(JSON.stringify(_0x179e28), "utf8", "hex");
    _0x2a2b8a += _0x35bb27.final("hex");
    fs.writeFileSync(_0xd36602, _0x2a2b8a);
  }
  return {
    filePath: _0x228b86,
    readTasks: () => _0x28037d(_0x228b86, []),
    writeTasks: _0x418690 => _0x526b84(_0x228b86, _0x418690)
  };
}
function createEmptyEntityLeadgenTaskStats() {
  return {
    collected: 0,
    blogger: 0,
    user: 0,
    mutual: 0,
    following: 0,
    live: 0,
    comment: 0,
    video: 0,
    author: 0,
    duplicates: 0,
    keywordsDone: 0,
    lastCycleAt: null
  };
}
function normalizeLeadRecord(_0x475a2c = {}, _0x4a36ac = {}) {
  const _0x3379bf = String(_0x475a2c.sourceType || "").trim();
  const _0x3a69b4 = String(_0x475a2c.leadKind || "").trim();
  const _0x1a3e57 = String(_0x475a2c.videoUrl || _0x475a2c.url || "").trim();
  const _0x471dc8 = _0x3a69b4 === "video_card" || _0x3379bf === "video" || String(_0x475a2c.identityType || "") === "video" ? extractDouyinVideoId(_0x1a3e57 || _0x475a2c.content || _0x475a2c.leadId || "") || (String(_0x475a2c.leadId || _0x475a2c.userKey || "").startsWith("video:") ? String(_0x475a2c.leadId || _0x475a2c.userKey).slice(6) : "") : "";
  const _0x5a31a = !!_0x471dc8 || _0x3a69b4 === "video_card" || _0x3379bf === "video";
  const _0x18f680 = _0x4a36ac.stableId ? ensureStableEntityLeadId(_0x4a36ac.taskId, _0x475a2c) : String(_0x475a2c.id || "entity_lead_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8));
  if (_0x5a31a && _0x471dc8) {
    const _0x412976 = "https://www.douyin.com/video/" + _0x471dc8;
    const _0x5e92c8 = String(_0x475a2c.title || "").replace(/\s+/g, " ").trim() || String(_0x475a2c.nickname || "").replace(/\s+/g, " ").trim() || "抖音视频作品";
    const _0x1c0c16 = Array.isArray(_0x475a2c.collectedFields) && _0x475a2c.collectedFields.length ? _0x475a2c.collectedFields.map(String) : ["video"];
    const _0x4f06dc = String(_0x475a2c.authorProfileUrl || "").trim() || (_0x1c0c16.includes("author") && /\/user\//i.test(String(_0x475a2c.userUrl || "")) && !/\/(?:video|note)\//i.test(String(_0x475a2c.userUrl || "")) ? String(_0x475a2c.userUrl || "").trim() : "");
    const _0x183649 = String(_0x475a2c.authorNickname || "").trim().replace(/^@+/, "") || (_0x1c0c16.includes("author") && String(_0x475a2c.nickname || "").trim() && String(_0x475a2c.nickname || "").trim() !== _0x5e92c8 ? String(_0x475a2c.nickname || "").trim().replace(/^@+/, "") : "");
    return {
      id: _0x18f680,
      ts: Number(_0x475a2c.ts || Date.now()),
      accountId: String(_0x475a2c.accountId || ""),
      accountName: String(_0x475a2c.accountName || ""),
      nickname: _0x183649 || _0x5e92c8,
      title: _0x5e92c8,
      uid: "",
      secUid: "",
      webcastUid: "",
      privacyMasked: false,
      identityType: "video",
      profileAvailable: !!_0x1c0c16.includes("author") && !!_0x4f06dc,
      profileUnavailable: !_0x1c0c16.includes("author") || !_0x4f06dc,
      profileUnavailableReason: _0x1c0c16.includes("author") && _0x4f06dc ? "" : "视频作品链接",
      userUrl: _0x4f06dc,
      authorProfileUrl: _0x4f06dc,
      videoUrl: _0x412976,
      url: _0x412976,
      leadKind: "video_card",
      leadId: "video:" + _0x471dc8,
      collectedFields: _0x1c0c16,
      content: _0x412976,
      timeText: String(_0x475a2c.timeText || _0x475a2c.publishTimeText || "卡片采集"),
      ipLocation: "",
      messageId: "",
      eventTimestamp: Number(_0x475a2c.eventTimestamp || 0) || 0,
      publishTime: normalizeLeadPublishTimeMs(_0x475a2c),
      publishTimeText: String(_0x475a2c.publishTimeText || "").trim(),
      liveEvent: null,
      liveEvents: [],
      sourceType: "video",
      searchKeyword: String(_0x475a2c.searchKeyword || ""),
      entrySource: String(_0x475a2c.entrySource || "entity_video"),
      entryLabel: String(_0x475a2c.entryLabel || "线索采集：视频作品链接"),
      duplicate: !!_0x475a2c.duplicate
    };
  }
  const _0xa9541a = String(_0x475a2c.uid || "");
  const _0x57ab34 = String(_0x475a2c.secUid || _0x475a2c.sec_uid || "");
  const _0x550499 = String(_0x475a2c.webcastUid || _0x475a2c.webcast_uid || "");
  const _0x4615ea = !_0xa9541a && !_0x57ab34 && _0x550499.length >= 15 && _0x550499 !== "111111" && /^[A-Za-z0-9_-]+$/.test(_0x550499) ? _0x550499 : "";
  const _0x561d54 = !!_0x57ab34;
  const _0x4a02bf = _0x561d54 ? "https://www.douyin.com/user/" + _0x57ab34 : "";
  return {
    id: _0x18f680,
    ts: Number(_0x475a2c.ts || Date.now()),
    accountId: String(_0x475a2c.accountId || ""),
    accountName: String(_0x475a2c.accountName || ""),
    nickname: String(_0x475a2c.nickname || ""),
    title: String(_0x475a2c.title || _0x475a2c.sourceVideoTitle || "").trim(),
    sourceVideoTitle: String(_0x475a2c.sourceVideoTitle || _0x475a2c.title || "").trim(),
    uid: _0xa9541a,
    secUid: _0x57ab34,
    webcastUid: _0x4615ea,
    privacyMasked: !!_0x475a2c.privacyMasked,
    identityType: _0x561d54 ? "profile" : _0x4615ea ? "webcast" : String(_0x475a2c.identityType || "numeric"),
    profileAvailable: _0x561d54,
    profileUnavailable: !_0x561d54,
    profileUnavailableReason: _0x561d54 ? "" : String(_0x475a2c.profileUnavailableReason || (_0x4615ea ? "主播设置不支持查看他人资料" : "实时消息未提供主页标识")),
    userUrl: _0x4a02bf,
    videoUrl: canonicalizeDouyinVideoUrl(_0x475a2c.videoUrl) || "",
    url: String(_0x475a2c.url || _0x4a02bf || ""),
    leadKind: String(_0x475a2c.leadKind || ""),
    leadId: String(_0x475a2c.leadId || ""),
    collectedFields: Array.isArray(_0x475a2c.collectedFields) ? _0x475a2c.collectedFields.map(String) : [],
    content: String(_0x475a2c.content || ""),
    timeText: stripLocationFromCommentTimeText(_0x475a2c.timeText || _0x475a2c.time) || String(_0x475a2c.timeText || _0x475a2c.time || ""),
    ipLocation: String(_0x475a2c.ipLocation || _0x475a2c.location || ""),
    messageId: String(_0x475a2c.messageId || ""),
    eventTimestamp: Number(_0x475a2c.eventTimestamp || 0) || 0,
    publishTime: normalizeLeadPublishTimeMs(_0x475a2c),
    liveEvent: _0x475a2c.liveEvent && typeof _0x475a2c.liveEvent === "object" ? _0x475a2c.liveEvent : null,
    liveEvents: Array.isArray(_0x475a2c.liveEvents) ? _0x475a2c.liveEvents.slice(-500) : [],
    sourceType: String(_0x475a2c.sourceType || ""),
    searchKeyword: String(_0x475a2c.searchKeyword || ""),
    entrySource: String(_0x475a2c.entrySource || ""),
    entryLabel: String(_0x475a2c.entryLabel || ""),
    duplicate: !!_0x475a2c.duplicate
  };
}
function normalizeEntityLeadgenTask(_0x4bb2f6 = {}) {
  const _0x1fde88 = Array.isArray(_0x4bb2f6.runs) ? _0x4bb2f6.runs.map(_0x132911 => ({
    accountId: String(_0x132911.accountId || ""),
    nickname: String(_0x132911.nickname || _0x132911.name || ""),
    name: String(_0x132911.name || ""),
    endedAt: _0x132911.endedAt != null ? Number(_0x132911.endedAt) : null,
    endReason: _0x132911.endReason || ""
  })).filter(_0x14c8d5 => _0x14c8d5.accountId) : [];
  const _0xbbf467 = Array.isArray(_0x4bb2f6.leads) ? _0x4bb2f6.leads : [];
  const _0x33da16 = _0xbbf467.map(_0x1d6453 => normalizeLeadRecord(_0x1d6453, {
    taskId: String(_0x4bb2f6.id || ""),
    stableId: true
  }));
  return {
    id: String(_0x4bb2f6.id || "entity_" + Date.now()),
    name: String(_0x4bb2f6.name || "线索采集"),
    status: _0x4bb2f6.status || "draft",
    createdAt: Number(_0x4bb2f6.createdAt || Date.now()),
    startedAt: _0x4bb2f6.startedAt != null ? Number(_0x4bb2f6.startedAt) : null,
    endedAt: _0x4bb2f6.endedAt != null ? Number(_0x4bb2f6.endedAt) : null,
    endReason: _0x4bb2f6.endReason || "",
    runs: _0x1fde88,
    configSnapshot: _0x4bb2f6.configSnapshot || null,
    stats: {
      ...createEmptyEntityLeadgenTaskStats(),
      ...(_0x4bb2f6.stats || {})
    },
    leads: _0x33da16,
    roomHints: Array.isArray(_0x4bb2f6.roomHints) ? _0x4bb2f6.roomHints.map(_0x222863 => ({
      url: String(_0x222863?.url || ""),
      reason: String(_0x222863?.reason || ""),
      message: String(_0x222863?.message || ""),
      ts: Number(_0x222863?.ts || Date.now()) || Date.now()
    })).filter(_0x285ef6 => _0x285ef6.url).slice(-50) : [],
    remark: _0x4bb2f6.remark || ""
  };
}
function normalizeEntityLeadgenTaskForMigration(_0x4a79f5 = {}) {
  return normalizeEntityLeadgenTask(_0x4a79f5);
}
function ensureStableEntityLeadId(_0x194aec, _0x1c3371 = {}) {
  const _0xd1a506 = String(_0x1c3371.id || "").trim();
  if (_0xd1a506) {
    return _0xd1a506;
  }
  const _0xf14f42 = String(_0x1c3371.leadId || _0x1c3371.userKey || "").trim();
  if (/^video:\d{10,}$/i.test(_0xf14f42) || /^author:/i.test(_0xf14f42)) {
    const _0x380066 = crypto.createHash("sha1").update(String(_0x194aec || "") + "|" + _0xf14f42.toLowerCase()).digest("hex").slice(0, 20);
    return "entity_lead_" + _0x380066;
  }
  const _0x611f39 = extractDouyinVideoId(_0x1c3371.videoUrl || _0x1c3371.url || _0x1c3371.content || "");
  if (_0x611f39 && (_0x1c3371.leadKind === "video_card" || _0x1c3371.sourceType === "video" || _0x1c3371.identityType === "video")) {
    const _0x51a878 = crypto.createHash("sha1").update(String(_0x194aec || "") + "|video:" + _0x611f39).digest("hex").slice(0, 20);
    return "entity_lead_" + _0x51a878;
  }
  const _0x5685d0 = [String(_0x194aec || ""), String(_0x1c3371.ts || ""), String(_0x1c3371.nickname || _0x1c3371.title || ""), String(_0x1c3371.content || ""), String(_0x1c3371.sourceType || _0x1c3371.leadKind || ""), String(_0x1c3371.accountId || ""), String(_0x1c3371.leadId || _0x1c3371.secUid || _0x1c3371.uid || _0x1c3371.videoUrl || _0x1c3371.url || _0x1c3371.userUrl || ""), String(_0x1c3371.messageId || "")].join("|");
  const _0x6fbaf2 = crypto.createHash("sha1").update(_0x5685d0).digest("hex").slice(0, 20);
  return "entity_lead_" + _0x6fbaf2;
}
function ensureSqliteReady(_0x3ca9d3) {
  dbManager.initDatabase(_0x3ca9d3);
  return !!dbManager.getDatabaseInstance();
}
function createEncEntityLeadgenTasksApi(_0x56e07c) {
  const _0x356642 = createCrypto(_0x56e07c);
  const {
    readTasks: _0x56adbb,
    writeTasks: _0x44322d
  } = _0x356642;
  function _0x5bf4da() {
    return _0x56adbb().map(normalizeEntityLeadgenTask).sort((_0x120344, _0x3b473c) => (_0x3b473c.createdAt || 0) - (_0x120344.createdAt || 0));
  }
  function _0x2f5443(_0x43010d) {
    return _0x5bf4da().find(_0x1a557d => _0x1a557d.id === _0x43010d) || null;
  }
  function _0x308b9b(_0xe6e642) {
    const _0x1aaf77 = _0x56adbb().map(normalizeEntityLeadgenTask);
    const _0x3db8d0 = normalizeEntityLeadgenTask(_0xe6e642);
    const _0x196b6e = _0x1aaf77.findIndex(_0x29e847 => _0x29e847.id === _0x3db8d0.id);
    if (_0x196b6e === -1) {
      _0x1aaf77.unshift(_0x3db8d0);
    } else {
      _0x1aaf77[_0x196b6e] = {
        ..._0x1aaf77[_0x196b6e],
        ..._0x3db8d0
      };
    }
    _0x44322d(_0x1aaf77);
    return _0x3db8d0;
  }
  function _0x5c7307(_0x14c2d2, _0x25ee2e = {}) {
    const _0x2a3d0c = _0x56adbb().map(normalizeEntityLeadgenTask);
    const _0x5ebfa1 = _0x2a3d0c.findIndex(_0x400287 => _0x400287.id === _0x14c2d2);
    if (_0x5ebfa1 === -1) {
      return null;
    }
    _0x2a3d0c[_0x5ebfa1] = normalizeEntityLeadgenTask({
      ..._0x2a3d0c[_0x5ebfa1],
      ..._0x25ee2e,
      id: _0x14c2d2
    });
    _0x44322d(_0x2a3d0c);
    return _0x2a3d0c[_0x5ebfa1];
  }
  function _0x47cfbf(_0x4b6c43 = []) {
    const _0x3b648c = new Set(Array.isArray(_0x4b6c43) ? _0x4b6c43 : [_0x4b6c43]);
    const _0x586afe = _0x56adbb().filter(_0x4af7b6 => !_0x3b648c.has(_0x4af7b6.id));
    _0x44322d(_0x586afe);
    return true;
  }
  function _0x26ba9b(_0x131f65, _0x5f4f27 = {}) {
    const _0x248ee2 = _0x2f5443(_0x131f65);
    if (!_0x248ee2) {
      return null;
    }
    const _0x5eb795 = {
      ...createEmptyEntityLeadgenTaskStats(),
      ...(_0x248ee2.stats || {})
    };
    Object.keys(createEmptyEntityLeadgenTaskStats()).forEach(_0x803652 => {
      if (_0x803652 === "lastCycleAt") {
        return;
      }
      const _0x3875e3 = Number(_0x5f4f27[_0x803652]);
      if (Number.isFinite(_0x3875e3) && _0x3875e3 > 0) {
        _0x5eb795[_0x803652] += Math.floor(_0x3875e3);
      }
    });
    if (_0x5f4f27.lastCycleAt != null) {
      _0x5eb795.lastCycleAt = Number(_0x5f4f27.lastCycleAt);
    }
    return _0x5c7307(_0x131f65, {
      stats: _0x5eb795
    });
  }
  function _0x535c64(_0x476bdb, _0x54d945 = []) {
    const _0x48c2ee = (Array.isArray(_0x54d945) ? _0x54d945 : [_0x54d945]).filter(Boolean).map(_0x3aa7d3 => normalizeLeadRecord(_0x3aa7d3, {
      stableId: true,
      taskId: _0x476bdb
    })).sort((_0x190c34, _0x2bb72b) => _0x2bb72b.ts - _0x190c34.ts);
    if (!_0x48c2ee.length) {
      return _0x2f5443(_0x476bdb);
    }
    const _0xabf6dc = _0x56adbb().map(normalizeEntityLeadgenTask);
    const _0x215a19 = _0xabf6dc.findIndex(_0x545c4d => _0x545c4d.id === _0x476bdb);
    if (_0x215a19 === -1) {
      return null;
    }
    const _0x5de082 = Array.isArray(_0xabf6dc[_0x215a19].leads) ? _0xabf6dc[_0x215a19].leads : [];
    const _0x2de02b = new Map(_0x5de082.map(_0x4cb7f9 => [String(_0x4cb7f9.id || ""), _0x4cb7f9]));
    _0x48c2ee.forEach(_0x353c6c => {
      if (!_0x353c6c?.id) {
        return;
      }
      _0x2de02b.set(String(_0x353c6c.id), _0x353c6c);
    });
    _0xabf6dc[_0x215a19] = normalizeEntityLeadgenTask({
      ..._0xabf6dc[_0x215a19],
      leads: [..._0x2de02b.values()].sort((_0x2ca92b, _0x262d94) => (_0x262d94.ts || 0) - (_0x2ca92b.ts || 0))
    });
    _0x44322d(_0xabf6dc);
    return _0xabf6dc[_0x215a19];
  }
  function _0x3947b6(_0x4da64e, _0x4b8cfd = {}) {
    const _0x4ec992 = _0x2f5443(_0x4da64e);
    const _0x4b91f4 = Array.isArray(_0x4ec992?.leads) ? _0x4ec992.leads : [];
    return entityLeadgenLeadsQuery.paginateLeadsArray(_0x4b91f4, _0x4b8cfd);
  }
  function _0x4f80af(_0x662d74, _0x4cbae5 = {}) {
    const _0x4ecc77 = _0x2f5443(_0x662d74);
    if (!_0x4ecc77) {
      return null;
    }
    const {
      leadIds = [],
      clearAll = false
    } = _0x4cbae5;
    if (clearAll) {
      return _0x5c7307(_0x662d74, {
        leads: [],
        stats: createEmptyEntityLeadgenTaskStats()
      });
    }
    const _0x5b2424 = new Set(Array.isArray(leadIds) ? leadIds : [leadIds]);
    if (_0x5b2424.size === 0) {
      return _0x4ecc77;
    }
    const _0x12dcd9 = (_0x4ecc77.leads || []).filter(_0x16d29a => !_0x5b2424.has(_0x16d29a.id));
    return _0x5c7307(_0x662d74, {
      leads: _0x12dcd9
    });
  }
  function _0x489404() {
    const _0x59525c = _0x56adbb().map(normalizeEntityLeadgenTask);
    const _0x59a8b7 = Date.now();
    let _0x320b71 = false;
    const _0x2b4525 = _0x59525c.map(_0x3c1240 => {
      if (_0x3c1240.status !== "running") {
        return _0x3c1240;
      }
      _0x320b71 = true;
      const _0x23f8eb = (_0x3c1240.runs || []).map(_0x2e0131 => _0x2e0131.endedAt ? _0x2e0131 : {
        ..._0x2e0131,
        endedAt: _0x59a8b7,
        endReason: "app_restart"
      });
      return normalizeEntityLeadgenTask({
        ..._0x3c1240,
        status: "stopped",
        runs: _0x23f8eb,
        endedAt: _0x3c1240.endedAt || _0x59a8b7,
        endReason: "app_restart"
      });
    });
    if (_0x320b71) {
      _0x44322d(_0x2b4525);
    }
    return _0x320b71;
  }
  return {
    runtime: "enc",
    listTasks: _0x5bf4da,
    findTaskById: _0x2f5443,
    upsertTask: _0x308b9b,
    patchTask: _0x5c7307,
    deleteTasks: _0x47cfbf,
    incrementStats: _0x26ba9b,
    appendLeadRecords: _0x535c64,
    listLeadRecordsPage: _0x3947b6,
    deleteLeadRecords: _0x4f80af,
    resetStaleRunningTasks: _0x489404,
    normalizeEntityLeadgenTask: normalizeEntityLeadgenTask
  };
}
function createSqliteEntityLeadgenTasksApi(_0xb62566) {
  ensureSqliteReady(_0xb62566);
  function _0x4e15db(_0x115a66, {
    includeLeads = true
  } = {}) {
    if (!_0x115a66) {
      return null;
    }
    const _0x35b658 = normalizeEntityLeadgenTask({
      ..._0x115a66,
      leads: includeLeads && Array.isArray(_0x115a66.leads) ? _0x115a66.leads : []
    });
    if (!includeLeads) {
      _0x35b658.leads = [];
    }
    return _0x35b658;
  }
  function _0x41d4e4(_0x1fa5c7 = {}) {
    const _0xf22df6 = _0x1fa5c7.includeLeads !== false;
    return dbManager.listEntityLeadgenTasks({
      includeLeads: _0xf22df6,
      leadLimit: 0
    }).map(_0x3bcfeb => _0x4e15db(_0x3bcfeb, {
      includeLeads: _0xf22df6
    }));
  }
  function _0x205aa2(_0x9cea66, _0x2d420e = {}) {
    const _0x18bb96 = _0x2d420e.includeLeads !== false;
    const _0x430839 = dbManager.getEntityLeadgenTaskById(_0x9cea66, {
      includeLeads: _0x18bb96,
      leadLimit: 0
    });
    return _0x4e15db(_0x430839, {
      includeLeads: _0x18bb96
    });
  }
  function _0x3a5b10(_0x2c88fe) {
    const _0x1b658b = _0x2c88fe && typeof _0x2c88fe === "object" ? _0x2c88fe : {};
    const _0x5c1cb3 = String(_0x1b658b.id || "entity_" + Date.now());
    const _0x409727 = dbManager.getEntityLeadgenTaskById(_0x5c1cb3, {
      includeLeads: false
    });
    if (!_0x409727) {
      const _0x458664 = normalizeEntityLeadgenTask({
        ..._0x1b658b,
        id: _0x5c1cb3
      });
      const _0x2e22e3 = dbManager.upsertEntityLeadgenTask(_0x458664, {
        replaceLeads: false
      });
      return _0x4e15db(_0x2e22e3 || _0x458664);
    }
    const _0x7b8df1 = {
      ..._0x409727,
      ..._0x1b658b,
      id: _0x5c1cb3,
      createdAt: _0x409727.createdAt || _0x1b658b.createdAt
    };
    const _0x5832f2 = ["roomHints", "remark", "stats", "configSnapshot", "runs"];
    for (const _0x583d80 of _0x5832f2) {
      if (!Object.prototype.hasOwnProperty.call(_0x1b658b, _0x583d80)) {
        _0x7b8df1[_0x583d80] = _0x409727[_0x583d80];
      }
    }
    _0x7b8df1.leads = [];
    const _0x1f0bcd = normalizeEntityLeadgenTask(_0x7b8df1);
    const _0x2877bb = dbManager.upsertEntityLeadgenTask(_0x1f0bcd, {
      replaceLeads: false
    });
    return _0x4e15db(_0x2877bb || _0x1f0bcd);
  }
  function _0x461539(_0x508dda, _0x33b837 = {}) {
    const _0x29cf81 = _0x205aa2(_0x508dda, {
      includeLeads: false
    });
    if (!_0x29cf81) {
      return null;
    }
    const {
      leads: _0x2bacf5,
      ..._0x51d1a0
    } = _0x33b837 || {};
    const _0x1ae7e4 = normalizeEntityLeadgenTask({
      ..._0x29cf81,
      ..._0x51d1a0,
      id: _0x508dda,
      leads: _0x29cf81.leads || []
    });
    dbManager.upsertEntityLeadgenTask(_0x1ae7e4, {
      replaceLeads: false
    });
    if (Object.prototype.hasOwnProperty.call(_0x33b837 || {}, "leads")) {
      if (!Array.isArray(_0x2bacf5) || _0x2bacf5.length === 0) {
        dbManager.deleteEntityLeadgenLeads(_0x508dda, {
          clearAll: true
        });
      } else {
        dbManager.replaceEntityLeadgenLeads(_0x508dda, _0x2bacf5.map(normalizeLeadRecord));
      }
    }
    return _0x205aa2(_0x508dda);
  }
  function _0x297eb7(_0x315a8f = []) {
    return dbManager.deleteEntityLeadgenTasks(_0x315a8f);
  }
  function _0xdfea1a(_0x192d55, _0xc81fe7 = {}) {
    const _0xee6619 = _0x205aa2(_0x192d55, {
      includeLeads: false
    });
    if (!_0xee6619) {
      return null;
    }
    const _0x4f5c09 = {
      ...createEmptyEntityLeadgenTaskStats(),
      ...(_0xee6619.stats || {})
    };
    Object.keys(createEmptyEntityLeadgenTaskStats()).forEach(_0x48f0f9 => {
      if (_0x48f0f9 === "lastCycleAt") {
        return;
      }
      const _0x5a777e = Number(_0xc81fe7[_0x48f0f9]);
      if (Number.isFinite(_0x5a777e) && _0x5a777e > 0) {
        _0x4f5c09[_0x48f0f9] += Math.floor(_0x5a777e);
      }
    });
    if (_0xc81fe7.lastCycleAt != null) {
      _0x4f5c09.lastCycleAt = Number(_0xc81fe7.lastCycleAt);
    }
    return _0x461539(_0x192d55, {
      stats: _0x4f5c09
    });
  }
  function _0x372e22(_0xd93804, _0x5c803 = []) {
    const _0x160e71 = (Array.isArray(_0x5c803) ? _0x5c803 : [_0x5c803]).filter(Boolean).map(_0x2701da => normalizeLeadRecord(_0x2701da, {
      stableId: true,
      taskId: _0xd93804
    }));
    if (!_0x160e71.length) {
      return _0x205aa2(_0xd93804, {
        includeLeads: false
      });
    }
    const _0x5f2316 = dbManager.getEntityLeadgenTaskById(_0xd93804, {
      includeLeads: false
    });
    if (!_0x5f2316) {
      return null;
    }
    dbManager.appendEntityLeadgenLeads(_0xd93804, _0x160e71);
    return _0x205aa2(_0xd93804, {
      includeLeads: false
    });
  }
  function _0x2eae46(_0x3efa44, _0x184960 = {}) {
    return dbManager.listEntityLeadgenLeadsPage(_0x3efa44, _0x184960);
  }
  function _0x1a08d8(_0x59510b, _0x13edbc = {}) {
    const _0x44df65 = dbManager.getEntityLeadgenTaskById(_0x59510b, {
      includeLeads: false
    });
    if (!_0x44df65) {
      return null;
    }
    const {
      leadIds = [],
      clearAll = false
    } = _0x13edbc;
    dbManager.deleteEntityLeadgenLeads(_0x59510b, {
      leadIds: leadIds,
      clearAll: clearAll
    });
    if (clearAll) {
      return _0x461539(_0x59510b, {
        stats: createEmptyEntityLeadgenTaskStats()
      });
    }
    return _0x205aa2(_0x59510b, {
      includeLeads: false
    });
  }
  function _0x4fe91e() {
    const _0x432ee4 = dbManager.listEntityLeadgenTasks({
      includeLeads: false
    });
    const _0xc640ac = Date.now();
    let _0x3e2241 = false;
    for (const _0x400993 of _0x432ee4) {
      if (_0x400993.status !== "running") {
        continue;
      }
      _0x3e2241 = true;
      const _0x1890b9 = (_0x400993.runs || []).map(_0x516d46 => _0x516d46.endedAt ? _0x516d46 : {
        ..._0x516d46,
        endedAt: _0xc640ac,
        endReason: "app_restart"
      });
      const _0x22d57f = normalizeEntityLeadgenTask({
        ..._0x400993,
        status: "stopped",
        runs: _0x1890b9,
        endedAt: _0x400993.endedAt || _0xc640ac,
        endReason: "app_restart",
        leads: []
      });
      dbManager.upsertEntityLeadgenTask(_0x22d57f, {
        replaceLeads: false
      });
    }
    return _0x3e2241;
  }
  return {
    runtime: "sqlite",
    listTasks: _0x41d4e4,
    findTaskById: _0x205aa2,
    upsertTask: _0x3a5b10,
    patchTask: _0x461539,
    deleteTasks: _0x297eb7,
    incrementStats: _0xdfea1a,
    appendLeadRecords: _0x372e22,
    listLeadRecordsPage: _0x2eae46,
    deleteLeadRecords: _0x1a08d8,
    resetStaleRunningTasks: _0x4fe91e,
    normalizeEntityLeadgenTask: normalizeEntityLeadgenTask
  };
}
function createEntityLeadgenTasksApi({
  userDataPath: _0x398dcb
}) {
  try {
    ensureSqliteReady(_0x398dcb);
    const _0x23bad7 = require("./dbMigration");
    const _0x5717d9 = _0x23bad7.runV4EntityLeadgenCutoverIfNeeded(_0x398dcb);
    if (dbManager.isEntityLeadgenRuntimeReady()) {
      return createSqliteEntityLeadgenTasksApi(_0x398dcb);
    }
    if (!_0x5717d9.ok) {
      console.warn("[EntityLeadgen] v4 迁移未成功:", _0x5717d9.error || "");
      const _0x27aa88 = ENTITY_LEADGEN_TASKS_FILE(_0x398dcb);
      if (fs.existsSync(_0x27aa88)) {
        console.warn("[EntityLeadgen] 继续使用 enc，待下次启动重试迁移");
        return createEncEntityLeadgenTasksApi(_0x398dcb);
      }
    }
    return createSqliteEntityLeadgenTasksApi(_0x398dcb);
  } catch (_0x31cd1e) {
    console.warn("[EntityLeadgen] SQLite 不可用，回退 enc:", _0x31cd1e.message);
    return createEncEntityLeadgenTasksApi(_0x398dcb);
  }
}
module.exports = {
  createEntityLeadgenTasksApi: createEntityLeadgenTasksApi,
  normalizeEntityLeadgenTask: normalizeEntityLeadgenTask,
  normalizeEntityLeadgenTaskForMigration: normalizeEntityLeadgenTaskForMigration,
  normalizeLeadRecord: normalizeLeadRecord,
  ensureStableEntityLeadId: ensureStableEntityLeadId,
  createEmptyEntityLeadgenTaskStats: createEmptyEntityLeadgenTaskStats,
  MAX_ENTITY_LEADGEN_DETAIL_RECORDS: 0,
  ENTITY_LEADGEN_TASKS_FILE: ENTITY_LEADGEN_TASKS_FILE,
  createCrypto: createCrypto
};
const TOUCH_TYPES = ["like", "reply", "follow", "message", "profileComment"];
const TOUCH_TYPE_LABELS = {
  like: "点赞",
  reply: "回复",
  follow: "关注",
  message: "私信",
  profileComment: "首作评论"
};
const ENTRY_SOURCE_LABELS = {
  search: "搜索关键词",
  follow: "关注列表",
  recommend: "推荐页"
};
function createEmptyTouchCounts() {
  return {
    like: 0,
    reply: 0,
    follow: 0,
    message: 0,
    profileComment: 0
  };
}
function normalizeTouchCounts(_0x1e46ec) {
  const _0x107bdb = createEmptyTouchCounts();
  if (!_0x1e46ec || typeof _0x1e46ec !== "object") {
    return _0x107bdb;
  }
  TOUCH_TYPES.forEach(_0x1d720b => {
    const _0x17f88b = Number(_0x1e46ec[_0x1d720b]);
    _0x107bdb[_0x1d720b] = Number.isFinite(_0x17f88b) && _0x17f88b > 0 ? Math.floor(_0x17f88b) : 0;
  });
  return _0x107bdb;
}
function getTotalTouchCount(_0x39f0fb) {
  const _0x1b6b20 = normalizeTouchCounts(_0x39f0fb);
  return TOUCH_TYPES.reduce((_0x3cb158, _0x4ad578) => _0x3cb158 + _0x1b6b20[_0x4ad578], 0);
}
function migrateTouchCountsFromLegacy(_0x192b4b) {
  if (!_0x192b4b) {
    return createEmptyTouchCounts();
  }
  const _0x5bbf2c = normalizeTouchCounts(_0x192b4b.touchCounts);
  if (_0x192b4b.liked || _0x192b4b.actions?.liked) {
    _0x5bbf2c.like = Math.max(_0x5bbf2c.like, 1);
  }
  if (_0x192b4b.actions?.profileWorkCommented) {
    _0x5bbf2c.profileComment = Math.max(_0x5bbf2c.profileComment, 1);
  } else if (_0x192b4b.replied || _0x192b4b.actions?.replied) {
    _0x5bbf2c.reply = Math.max(_0x5bbf2c.reply, 1);
  }
  if (_0x192b4b.followed || _0x192b4b.actions?.followed) {
    _0x5bbf2c.follow = Math.max(_0x5bbf2c.follow, 1);
  }
  if (_0x192b4b.messaged || _0x192b4b.actions?.messaged) {
    _0x5bbf2c.message = Math.max(_0x5bbf2c.message, 1);
  }
  return _0x5bbf2c;
}
function ensureLeadMeta(_0x178e39) {
  if (!_0x178e39) {
    return _0x178e39;
  }
  if (!Array.isArray(_0x178e39.touchLog)) {
    _0x178e39.touchLog = [];
  }
  _0x178e39.touchCounts = migrateTouchCountsFromLegacy(_0x178e39);
  if (_0x178e39.worksCount === undefined) {
    _0x178e39.worksCount = null;
  }
  if (!_0x178e39.entrySource && _0x178e39.taskName) {
    const _0x3c9baa = String(_0x178e39.taskName);
    if (_0x3c9baa.includes("关注列表")) {
      _0x178e39.entrySource = "follow";
    } else if (_0x3c9baa.includes("推荐")) {
      _0x178e39.entrySource = "recommend";
    } else if (_0x3c9baa && !_0x3c9baa.includes("+")) {
      _0x178e39.entrySource = "search";
    }
  }
  if (!_0x178e39.entryLabel) {
    if (_0x178e39.entrySource === "search" && _0x178e39.searchKeyword) {
      _0x178e39.entryLabel = "搜索: " + _0x178e39.searchKeyword;
    } else if (_0x178e39.entrySource === "follow") {
      _0x178e39.entryLabel = "关注列表";
    } else if (_0x178e39.entrySource === "recommend") {
      _0x178e39.entryLabel = "推荐页";
    } else if (_0x178e39.entrySource === "like") {
      _0x178e39.entryLabel = "喜欢列表";
    } else if (_0x178e39.entrySource === "specific") {
      _0x178e39.entryLabel = "指定视频";
    } else if (_0x178e39.entrySource === "monitor") {
      _0x178e39.entryLabel = _0x178e39.taskName ? "监控: " + _0x178e39.taskName : "监控视频";
    } else if (_0x178e39.entrySource === "entity_blogger") {
      _0x178e39.entryLabel = "线索采集：搜索博主";
    } else if (_0x178e39.entrySource === "entity_user") {
      _0x178e39.entryLabel = "线索采集：搜索用户";
    } else if (_0x178e39.entrySource === "entity_mutual") {
      _0x178e39.entryLabel = "线索采集：相互关注";
    } else if (_0x178e39.entrySource === "entity_following") {
      _0x178e39.entryLabel = "线索采集：关注列表";
    } else if (_0x178e39.taskName) {
      _0x178e39.entryLabel = _0x178e39.taskName;
    }
  }
  return _0x178e39;
}
function recordTouchOnLead(_0x29e33b, _0x51feec) {
  if (!_0x29e33b || !_0x51feec?.type || !TOUCH_TYPES.includes(_0x51feec.type)) {
    return _0x29e33b;
  }
  ensureLeadMeta(_0x29e33b);
  const _0x467849 = Number(_0x51feec.at || Date.now());
  const _0xa7bbfa = _0x51feec.accountName || _0x29e33b.accountName || "";
  const _0x498907 = _0x51feec.content || "";
  const _0x2f0470 = _0x51feec.source || "acquire";
  const _0x132425 = _0x51feec.channel || (_0x2f0470 === "monitor" ? "监控任务" : _0x2f0470 === "batch" ? "线索库批量" : "自动获客");
  const _0x5d03f5 = (_0x29e33b.touchLog || []).some(_0x23c3c9 => {
    if (_0x23c3c9.type !== _0x51feec.type) {
      return false;
    }
    if ((_0x23c3c9.accountName || "") !== _0xa7bbfa) {
      return false;
    }
    const _0x402d27 = Number(_0x23c3c9.at || _0x23c3c9.timestamp || 0);
    return _0x402d27 && Math.abs(_0x402d27 - _0x467849) < 2500;
  });
  if (_0x5d03f5) {
    return _0x29e33b;
  }
  _0x29e33b.touchCounts[_0x51feec.type] = (_0x29e33b.touchCounts[_0x51feec.type] || 0) + 1;
  _0x29e33b.touchLog.unshift({
    type: _0x51feec.type,
    label: TOUCH_TYPE_LABELS[_0x51feec.type] || _0x51feec.type,
    at: _0x467849,
    content: _0x498907,
    accountName: _0xa7bbfa,
    success: _0x51feec.success !== false,
    source: _0x2f0470,
    channel: _0x132425
  });
  _0x29e33b.lastTouchAt = Math.max(Number(_0x29e33b.lastTouchAt || 0), _0x467849);
  if (_0x29e33b.touchLog.length > 200) {
    _0x29e33b.touchLog.length = 200;
  }
  return _0x29e33b;
}
function syncTouchCountsFromLog(_0x2d8e94) {
  if (!_0x2d8e94) {
    return _0x2d8e94;
  }
  const _0x18fc04 = createEmptyTouchCounts();
  for (const _0x5bca5b of _0x2d8e94.touchLog || []) {
    if (TOUCH_TYPES.includes(_0x5bca5b.type)) {
      _0x18fc04[_0x5bca5b.type] += 1;
    }
  }
  _0x2d8e94.touchCounts = _0x18fc04;
  return _0x2d8e94;
}
function mergeTouchLogs(_0x441edf = [], _0x2a8702 = []) {
  const _0x42e084 = [...(Array.isArray(_0x2a8702) ? _0x2a8702 : []), ...(Array.isArray(_0x441edf) ? _0x441edf : [])];
  const _0x428a81 = new Set();
  const _0x4fd078 = [];
  for (const _0x48f01a of _0x42e084) {
    if (!_0x48f01a || !_0x48f01a.type) {
      continue;
    }
    const _0x153eca = Number(_0x48f01a.at || _0x48f01a.timestamp || 0);
    const _0x343bab = _0x153eca ? Math.floor(_0x153eca / 1000) : 0;
    const _0x51a28d = String(_0x48f01a.content || "").trim().slice(0, 80);
    const _0x2c53a2 = _0x48f01a.type + "|" + (_0x48f01a.accountName || "") + "|" + _0x51a28d + "|" + _0x343bab;
    if (_0x428a81.has(_0x2c53a2)) {
      continue;
    }
    _0x428a81.add(_0x2c53a2);
    _0x4fd078.push(_0x48f01a);
  }
  return _0x4fd078.sort((_0x384091, _0x4aa178) => Number(_0x4aa178.at || _0x4aa178.timestamp || 0) - Number(_0x384091.at || _0x384091.timestamp || 0)).slice(0, 200);
}
function recountTouchCountsAfterMerge(_0x3f6990) {
  if (!_0x3f6990) {
    return _0x3f6990;
  }
  if (!Array.isArray(_0x3f6990.touchLog)) {
    _0x3f6990.touchLog = [];
  }
  if (_0x3f6990.touchLog.length) {
    syncTouchCountsFromLog(_0x3f6990);
  } else {
    _0x3f6990.touchCounts = normalizeTouchCounts(_0x3f6990.touchCounts);
  }
  _0x3f6990.touchCounts = migrateTouchCountsFromLegacy(_0x3f6990);
  return _0x3f6990;
}
const WORKS_COUNT_UNKNOWN = -1;
function normalizeWorksCount(_0x4abde6) {
  if (_0x4abde6 === null || _0x4abde6 === undefined) {
    return WORKS_COUNT_UNKNOWN;
  }
  if (typeof _0x4abde6 === "string") {
    const _0x38b235 = String(_0x4abde6).trim();
    if (!_0x38b235 || _0x38b235 === "未知" || _0x38b235 === "-" || _0x38b235 === "null" || _0x38b235 === "N/A" || /^unknown$/i.test(_0x38b235)) {
      return WORKS_COUNT_UNKNOWN;
    }
  }
  const _0x39594d = Number(String(_0x4abde6).replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(_0x39594d) || _0x39594d < 0) {
    return WORKS_COUNT_UNKNOWN;
  }
  return Math.floor(_0x39594d);
}
function formatWorksCount(_0x4e7a86) {
  if (_0x4e7a86 === null || _0x4e7a86 === undefined || _0x4e7a86 === "") {
    return "未知";
  }
  const _0x30b3b0 = normalizeWorksCount(_0x4e7a86);
  if (_0x30b3b0 < 0) {
    return "未知";
  }
  return String(_0x30b3b0);
}
function serializeWorksCountForCsv(_0x1ec728) {
  if (_0x1ec728 === null || _0x1ec728 === undefined || _0x1ec728 === "") {
    return String(WORKS_COUNT_UNKNOWN);
  }
  return String(normalizeWorksCount(_0x1ec728));
}
function formatTouchSummary(_0x2c5bfe) {
  const _0x5c213d = normalizeTouchCounts(_0x2c5bfe);
  const _0x19b72a = TOUCH_TYPES.filter(_0x26d396 => _0x5c213d[_0x26d396] > 0).map(_0x594e64 => "" + TOUCH_TYPE_LABELS[_0x594e64] + _0x5c213d[_0x594e64]);
  if (_0x19b72a.length) {
    return _0x19b72a.join(" · ");
  } else {
    return "未触达";
  }
}
module.exports = {
  TOUCH_TYPES: TOUCH_TYPES,
  TOUCH_TYPE_LABELS: TOUCH_TYPE_LABELS,
  ENTRY_SOURCE_LABELS: ENTRY_SOURCE_LABELS,
  createEmptyTouchCounts: createEmptyTouchCounts,
  normalizeTouchCounts: normalizeTouchCounts,
  getTotalTouchCount: getTotalTouchCount,
  migrateTouchCountsFromLegacy: migrateTouchCountsFromLegacy,
  ensureLeadMeta: ensureLeadMeta,
  recordTouchOnLead: recordTouchOnLead,
  syncTouchCountsFromLog: syncTouchCountsFromLog,
  mergeTouchLogs: mergeTouchLogs,
  recountTouchCountsAfterMerge: recountTouchCountsAfterMerge,
  WORKS_COUNT_UNKNOWN: WORKS_COUNT_UNKNOWN,
  normalizeWorksCount: normalizeWorksCount,
  formatWorksCount: formatWorksCount,
  serializeWorksCountForCsv: serializeWorksCountForCsv,
  formatTouchSummary: formatTouchSummary
};
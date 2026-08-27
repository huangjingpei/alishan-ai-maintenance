const leadTouch = require("./leadTouch");
const LEADGEN_ENTRY_SOURCES = new Set(["search", "follow", "recommend", "like", "specific"]);
const ENTITY_ENTRY_SOURCES = new Set(["entity_blogger", "entity_user", "entity_mutual", "entity_following", "entity_live", "entity_comment", "entity_video", "live"]);
function getLeadCaptureTimestamp(_0x1fb612) {
  const _0x207e27 = Number(_0x1fb612?.timestamp);
  if (Number.isFinite(_0x207e27) && _0x207e27 > 0) {
    return _0x207e27;
  }
  const _0x507a05 = Date.parse(_0x1fb612?.capturedAt || "");
  if (Number.isFinite(_0x507a05)) {
    return _0x507a05;
  } else {
    return 0;
  }
}
function parseCommentTime(_0x21e739) {
  if (!_0x21e739) {
    return 0;
  }
  const _0x4ff410 = new Date();
  if (String(_0x21e739).includes("刚刚")) {
    return _0x4ff410.getTime();
  }
  const _0x1c7cc5 = String(_0x21e739).match(/(\d+)分钟前/);
  if (_0x1c7cc5) {
    return _0x4ff410.getTime() - parseInt(_0x1c7cc5[1], 10) * 60 * 1000;
  }
  const _0x353227 = String(_0x21e739).match(/(\d+)小时前/);
  if (_0x353227) {
    return _0x4ff410.getTime() - parseInt(_0x353227[1], 10) * 3600 * 1000;
  }
  const _0x141bd9 = String(_0x21e739).match(/(\d+)天前/);
  if (_0x141bd9) {
    return _0x4ff410.getTime() - parseInt(_0x141bd9[1], 10) * 24 * 3600 * 1000;
  }
  if (String(_0x21e739).includes("昨天")) {
    const _0x5b82c4 = new Date();
    _0x5b82c4.setDate(_0x5b82c4.getDate() - 1);
    return _0x5b82c4.getTime();
  }
  try {
    const _0x958664 = String(_0x21e739).split("-");
    if (_0x958664.length === 2) {
      const _0x49bddf = new Date(_0x4ff410.getFullYear(), parseInt(_0x958664[0], 10) - 1, parseInt(_0x958664[1], 10));
      if (_0x49bddf > _0x4ff410) {
        _0x49bddf.setFullYear(_0x4ff410.getFullYear() - 1);
      }
      return _0x49bddf.getTime();
    }
    if (_0x958664.length === 3) {
      return new Date(_0x21e739).getTime();
    }
  } catch (_0x5e867f) {}
  return 0;
}
function resolveLeadOrigin(_0x1bef29 = {}) {
  const _0x2bc277 = String(_0x1bef29.entrySource || "").trim();
  if (ENTITY_ENTRY_SOURCES.has(_0x2bc277)) {
    if (_0x2bc277 === "live") {
      return "entity_live";
    } else {
      return _0x2bc277;
    }
  }
  if (_0x2bc277 === "monitor") {
    return "monitor";
  }
  if (_0x2bc277 === "import" || _0x2bc277 === "UID导入") {
    return "import";
  }
  if (LEADGEN_ENTRY_SOURCES.has(_0x2bc277)) {
    return "leadgen";
  }
  const _0x2c658a = String(_0x1bef29.taskId || "");
  if (_0x2c658a === "import_uid" || _0x2c658a.startsWith("import_")) {
    return "import";
  }
  if (_0x2c658a.startsWith("monitor_")) {
    return "monitor";
  }
  if (_0x2c658a.startsWith("entity_")) {
    return "entity_live";
  }
  const _0x23129e = (_0x1bef29.entryLabel || "") + " " + (_0x1bef29.taskName || "");
  if (_0x23129e.includes("监控")) {
    return "monitor";
  }
  if (_0x23129e.includes("线索采集") || _0x23129e.includes("实体获客")) {
    if (_0x23129e.includes("博主")) {
      return "entity_blogger";
    }
    if (_0x23129e.includes("用户")) {
      return "entity_user";
    }
    if (_0x23129e.includes("关注列表")) {
      return "entity_following";
    }
    if (_0x23129e.includes("相互关注")) {
      return "entity_mutual";
    }
    if (_0x23129e.includes("直播")) {
      return "entity_live";
    }
    if (_0x23129e.includes("评论")) {
      return "entity_comment";
    }
    if (_0x23129e.includes("视频")) {
      return "entity_video";
    }
    return "entity_live";
  }
  if (_0x1bef29.searchKeyword || _0x1bef29.taskName || _0x1bef29.entryLabel || _0x2bc277) {
    return "leadgen";
  }
  return "legacy";
}
function leadHasAnyTouch(_0x15ab0a) {
  if (leadTouch.getTotalTouchCount(_0x15ab0a?.touchCounts) > 0) {
    return true;
  }
  if (!_0x15ab0a) {
    return false;
  }
  return !!_0x15ab0a.liked || !!_0x15ab0a.replied || !!_0x15ab0a.followed || !!_0x15ab0a.messaged || !!(_0x15ab0a.touchCounts?.profileComment > 0) || !!Array.isArray(_0x15ab0a.touchLog) && !!_0x15ab0a.touchLog.some(_0x310fe9 => _0x310fe9.type === "profileComment");
}
function leadHasTouchType(_0x32ddf9, _0xa72df6) {
  if (!_0x32ddf9 || !_0xa72df6) {
    return false;
  }
  const _0x39981b = leadTouch.normalizeTouchCounts ? leadTouch.normalizeTouchCounts(_0x32ddf9.touchCounts) : _0x32ddf9.touchCounts || {};
  const _0x41f50c = _0x160fca => Array.isArray(_0x32ddf9.touchLog) && _0x32ddf9.touchLog.some(_0x4851ff => _0x4851ff.type === _0x160fca);
  switch (_0xa72df6) {
    case "like":
      return _0x39981b.like > 0 || !!_0x32ddf9.liked || !!_0x32ddf9.actions?.liked || _0x41f50c("like");
    case "reply":
      return _0x39981b.reply > 0 || _0x41f50c("reply") || !!_0x32ddf9.replied && !(_0x39981b.profileComment > 0) && !_0x41f50c("profileComment");
    case "follow":
      return _0x39981b.follow > 0 || !!_0x32ddf9.followed || !!_0x32ddf9.actions?.followed || _0x41f50c("follow");
    case "message":
      return _0x39981b.message > 0 || !!_0x32ddf9.messaged || !!_0x32ddf9.actions?.messaged || _0x41f50c("message");
    case "profileComment":
      return _0x39981b.profileComment > 0 || _0x41f50c("profileComment");
    default:
      return false;
  }
}
function leadMatchesTouchFilters(_0x3c095f, _0x56037b) {
  if (!Array.isArray(_0x56037b) || _0x56037b.length === 0) {
    return true;
  }
  const _0x3e6bdb = _0x56037b.filter(_0xf22361 => _0xf22361 && _0xf22361 !== "touched" && _0xf22361 !== "untouched");
  const _0x52c8a2 = _0x56037b.includes("untouched");
  const _0x50bf1e = _0x56037b.includes("touched");
  if (_0x3e6bdb.length > 0) {
    return _0x3e6bdb.some(_0x38c138 => leadHasTouchType(_0x3c095f, _0x38c138));
  }
  if (_0x52c8a2 && _0x50bf1e) {
    return true;
  }
  if (_0x52c8a2) {
    return !leadHasAnyTouch(_0x3c095f);
  }
  if (_0x50bf1e) {
    return leadHasAnyTouch(_0x3c095f);
  }
  return true;
}
function parseCaptureDateTimeParts(_0x438df1) {
  const _0x526e98 = String(_0x438df1 || "").trim();
  if (!_0x526e98) {
    return null;
  }
  let _0x4503a1 = _0x526e98.match(/^(\d{4})[-/.年](\d{1,2})[-/.月](\d{1,2})日?(?:[\sT]+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
  if (_0x4503a1) {
    return {
      year: Number(_0x4503a1[1]),
      month: Number(_0x4503a1[2]),
      day: Number(_0x4503a1[3]),
      hour: _0x4503a1[4] != null ? Number(_0x4503a1[4]) : null,
      minute: _0x4503a1[5] != null ? Number(_0x4503a1[5]) : null
    };
  }
  _0x4503a1 = _0x526e98.match(/^(\d{1,2})[-/.月](\d{1,2})日?(?:[\sT]+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
  if (!_0x4503a1) {
    return null;
  }
  return {
    year: new Date().getFullYear(),
    month: Number(_0x4503a1[1]),
    day: Number(_0x4503a1[2]),
    hour: _0x4503a1[3] != null ? Number(_0x4503a1[3]) : null,
    minute: _0x4503a1[4] != null ? Number(_0x4503a1[4]) : null
  };
}
function partsToStartMs(_0xdfe274, {
  endOfMinute = false
} = {}) {
  if (!_0xdfe274) {
    return null;
  }
  const {
    year: _0x1ef151,
    month: _0x413890,
    day: _0xc0c565,
    hour: _0x577616,
    minute: _0x4ea7e1
  } = _0xdfe274;
  if (![_0x1ef151, _0x413890, _0xc0c565].every(Number.isFinite)) {
    return null;
  }
  if (_0x413890 < 1 || _0x413890 > 12 || _0xc0c565 < 1 || _0xc0c565 > 31) {
    return null;
  }
  const _0x4a937c = _0x577616 != null && _0x4ea7e1 != null && Number.isFinite(_0x577616) && Number.isFinite(_0x4ea7e1) && _0x577616 >= 0 && _0x577616 <= 23 && _0x4ea7e1 >= 0 && _0x4ea7e1 <= 59;
  const _0x2e75d9 = _0x4a937c ? _0x577616 : 0;
  const _0x574082 = _0x4a937c ? _0x4ea7e1 : 0;
  const _0x2c8532 = endOfMinute && _0x4a937c ? 59 : 0;
  const _0x5b1085 = endOfMinute && _0x4a937c ? 999 : 0;
  const _0x189e62 = new Date(_0x1ef151, _0x413890 - 1, _0xc0c565, _0x2e75d9, _0x574082, _0x2c8532, _0x5b1085).getTime();
  if (!Number.isFinite(_0x189e62)) {
    return null;
  }
  return {
    ms: _0x189e62,
    hasTime: _0x4a937c
  };
}
function parseCaptureTimeFilter(_0x5c85be) {
  const _0xe9be3 = String(_0x5c85be || "").trim();
  if (!_0xe9be3 || _0xe9be3 === "all") {
    return null;
  }
  if (_0xe9be3 === "1d" || _0xe9be3 === "3d" || _0xe9be3 === "1w" || _0xe9be3 === "今天" || _0xe9be3 === "3天内" || _0xe9be3 === "一周内") {
    const _0x310af9 = _0xe9be3 === "今天" ? "1d" : _0xe9be3 === "3天内" ? "3d" : _0xe9be3 === "一周内" ? "1w" : _0xe9be3;
    return {
      kind: "range",
      key: _0x310af9
    };
  }
  if (_0xe9be3.includes("~")) {
    const [_0x54f9bd, _0x224f59] = _0xe9be3.split("~").map(_0xbcb762 => _0xbcb762.trim());
    const _0x11cf93 = partsToStartMs(parseCaptureDateTimeParts(_0x54f9bd));
    const _0x38b424 = partsToStartMs(parseCaptureDateTimeParts(_0x224f59), {
      endOfMinute: true
    });
    if (!_0x11cf93 || !_0x38b424 || _0x38b424.ms < _0x11cf93.ms) {
      return null;
    }
    return {
      kind: _0x11cf93.hasTime || _0x38b424.hasTime ? "minute" : "day",
      start: _0x11cf93.ms,
      end: _0x38b424.ms + 1
    };
  }
  const _0x10690c = partsToStartMs(parseCaptureDateTimeParts(_0xe9be3));
  if (!_0x10690c) {
    return null;
  }
  if (_0x10690c.hasTime) {
    return {
      kind: "minute",
      start: _0x10690c.ms,
      end: _0x10690c.ms + 60000
    };
  }
  const _0x1bbaac = parseCaptureDateTimeParts(_0xe9be3);
  const _0x15fb70 = new Date(_0x1bbaac.year, _0x1bbaac.month - 1, _0x1bbaac.day + 1, 0, 0, 0, 0).getTime();
  return {
    kind: "day",
    start: _0x10690c.ms,
    end: _0x15fb70
  };
}
function leadMatchesCaptureTimeFilter(_0x52b34f, _0x5b7ed6) {
  const _0x3769dc = parseCaptureTimeFilter(_0x5b7ed6);
  if (!_0x3769dc) {
    return true;
  }
  const _0x120602 = getLeadCaptureTimestamp(_0x52b34f);
  if (!_0x120602) {
    return false;
  }
  if (_0x3769dc.kind === "day" || _0x3769dc.kind === "minute") {
    return _0x120602 >= _0x3769dc.start && _0x120602 < _0x3769dc.end;
  }
  const _0x48951b = Date.now();
  if (_0x3769dc.key === "1d") {
    return _0x48951b - _0x120602 <= 86400000;
  }
  if (_0x3769dc.key === "3d") {
    return _0x48951b - _0x120602 <= 259200000;
  }
  if (_0x3769dc.key === "1w") {
    return _0x48951b - _0x120602 <= 604800000;
  }
  return true;
}
function leadMatchesComplexFilters(_0x4be9a3, _0x364b9b = {}) {
  if (!_0x4be9a3) {
    return false;
  }
  const _0xcfc2d0 = _0x364b9b || {};
  if (Array.isArray(_0xcfc2d0.entrySource) && _0xcfc2d0.entrySource.length) {
    const _0x4d24e0 = resolveLeadOrigin(_0x4be9a3);
    if (!_0xcfc2d0.entrySource.includes(_0x4d24e0)) {
      return false;
    }
  }
  if (_0xcfc2d0.minTouchTotal != null && _0xcfc2d0.minTouchTotal !== "") {
    const _0x52bc89 = Number(_0xcfc2d0.minTouchTotal);
    if (Number.isFinite(_0x52bc89) && leadTouch.getTotalTouchCount(_0x4be9a3.touchCounts) < _0x52bc89) {
      return false;
    }
  }
  if (!leadMatchesTouchFilters(_0x4be9a3, _0xcfc2d0.touchTypes)) {
    return false;
  }
  if (_0xcfc2d0.timeRange && _0xcfc2d0.timeRange !== "all") {
    const _0xa92770 = parseCommentTime(_0x4be9a3.timeText);
    const _0x316d88 = Date.now();
    if (_0xcfc2d0.timeRange === "1d" && _0x316d88 - _0xa92770 > 86400000) {
      return false;
    }
    if (_0xcfc2d0.timeRange === "3d" && _0x316d88 - _0xa92770 > 259200000) {
      return false;
    }
    if (_0xcfc2d0.timeRange === "1w" && _0x316d88 - _0xa92770 > 604800000) {
      return false;
    }
  }
  if (_0xcfc2d0.captureTimeRange && !leadMatchesCaptureTimeFilter(_0x4be9a3, _0xcfc2d0.captureTimeRange)) {
    return false;
  }
  if (Array.isArray(_0xcfc2d0.accountFlags) && _0xcfc2d0.accountFlags.length) {
    const _0x12ea19 = _0xcfc2d0.accountFlags.includes("private");
    const _0x31c153 = _0xcfc2d0.accountFlags.includes("noWorks");
    const _0x8e40ac = !!_0x4be9a3.isPrivate;
    const _0x1f4089 = !!_0x4be9a3.noWorks || _0x4be9a3.worksCount !== null && _0x4be9a3.worksCount !== undefined && Number(_0x4be9a3.worksCount) === 0;
    if (_0x12ea19 && _0x31c153) {
      if (!_0x8e40ac && !_0x1f4089) {
        return false;
      }
    } else if (_0x12ea19 && !_0x8e40ac) {
      return false;
    } else if (_0x31c153 && !_0x1f4089) {
      return false;
    }
  }
  return true;
}
module.exports = {
  leadMatchesComplexFilters: leadMatchesComplexFilters,
  resolveLeadOrigin: resolveLeadOrigin,
  leadHasAnyTouch: leadHasAnyTouch,
  getLeadCaptureTimestamp: getLeadCaptureTimestamp,
  parseCommentTime: parseCommentTime
};
const COMMENT_TIME_FILTER_PRESET_MINUTES = Object.freeze({
  all: 0,
  "5m": 5,
  "1h": 60,
  "1d": 1440,
  "3d": 4320,
  "1w": 10080,
  "1mo": 43200,
  "1y": 525600
});
function resolveCommentTimeFilterMinutes(_0x142a2a) {
  const _0x35df61 = String(_0x142a2a || "").trim();
  if (!_0x35df61 || _0x35df61 === "all") {
    return 0;
  }
  if (Object.prototype.hasOwnProperty.call(COMMENT_TIME_FILTER_PRESET_MINUTES, _0x35df61)) {
    return COMMENT_TIME_FILTER_PRESET_MINUTES[_0x35df61];
  }
  const _0x256388 = Number(_0x35df61);
  if (Number.isFinite(_0x256388) && _0x256388 > 0) {
    return Math.floor(_0x256388);
  }
  return 0;
}
function isCommentWithinWindowMinutes(_0x492e45, _0x5a9e64, _0x153fca = {}) {
  const _0x29a90e = Number(_0x5a9e64) || 0;
  if (_0x29a90e <= 0) {
    return true;
  }
  const _0x2beafc = parseCommentAgeMinutes(_0x492e45);
  if (_0x2beafc == null) {
    return _0x153fca.allowUnknown === true;
  }
  return _0x2beafc < _0x29a90e;
}
function isCommentWithinTimeFilter(_0x333693, _0x5f17d5, _0x3f9b59 = {}) {
  return isCommentWithinWindowMinutes(_0x333693, resolveCommentTimeFilterMinutes(_0x5f17d5), _0x3f9b59);
}
function parseCommentAgeMinutes(_0x3db678) {
  if (!_0x3db678 || !String(_0x3db678).trim()) {
    return null;
  }
  const _0xf7d13e = new Date();
  const _0x9ce604 = String(_0x3db678).trim();
  let _0x4a66c1 = null;
  const _0x5c1d80 = _0x9ce604.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  const _0x5ee692 = _0x9ce604.match(/^(\d{1,2})-(\d{1,2})/);
  const _0x72f751 = _0x9ce604.match(/^(\d{1,2}):(\d{2})$/);
  const _0x2343ed = _0x9ce604.match(/^昨天(?:\s*(\d{1,2}):(\d{2}))?/);
  if (_0x5c1d80) {
    _0x4a66c1 = new Date(_0x5c1d80[1], _0x5c1d80[2] - 1, _0x5c1d80[3]);
  } else if (_0x5ee692 && !_0x9ce604.includes("前")) {
    _0x4a66c1 = new Date(_0xf7d13e.getFullYear(), _0x5ee692[1] - 1, _0x5ee692[2]);
    if (_0x4a66c1 > _0xf7d13e) {
      _0x4a66c1.setFullYear(_0xf7d13e.getFullYear() - 1);
    }
  } else if (_0x72f751) {
    _0x4a66c1 = new Date(_0xf7d13e.getFullYear(), _0xf7d13e.getMonth(), _0xf7d13e.getDate(), _0x72f751[1], _0x72f751[2]);
    if (_0x4a66c1 > _0xf7d13e) {
      _0x4a66c1.setDate(_0xf7d13e.getDate() - 1);
    }
  } else if (_0x2343ed) {
    _0x4a66c1 = new Date(_0xf7d13e.getFullYear(), _0xf7d13e.getMonth(), _0xf7d13e.getDate() - 1, _0x2343ed[1] || 12, _0x2343ed[2] || 0);
  }
  let _0x50ba5e = null;
  if (_0x9ce604.includes("刚刚")) {
    _0x50ba5e = 0;
  } else if (_0x9ce604.includes("分钟前")) {
    _0x50ba5e = parseInt(_0x9ce604, 10) || 0;
  } else if (_0x9ce604.includes("小时前")) {
    _0x50ba5e = (parseInt(_0x9ce604, 10) || 0) * 60;
  } else if (_0x9ce604 === "昨天" || _0x2343ed) {
    if (_0x4a66c1) {
      _0x50ba5e = Math.max(0, Math.floor((_0xf7d13e - _0x4a66c1) / 60000));
    } else {
      _0x50ba5e = 1440;
    }
  } else if (_0x9ce604.includes("天前")) {
    _0x50ba5e = (parseInt(_0x9ce604, 10) || 0) * 24 * 60;
  } else if (_0x9ce604.includes("周前")) {
    _0x50ba5e = (parseInt(_0x9ce604, 10) || 0) * 7 * 24 * 60;
  } else if (_0x9ce604.includes("月前")) {
    const _0x46b2ab = parseInt(_0x9ce604, 10);
    _0x50ba5e = (Number.isFinite(_0x46b2ab) && _0x46b2ab > 0 ? _0x46b2ab : 1) * 30 * 24 * 60;
  } else if (_0x9ce604.includes("年前")) {
    const _0x36be51 = parseInt(_0x9ce604, 10);
    _0x50ba5e = (Number.isFinite(_0x36be51) && _0x36be51 > 0 ? _0x36be51 : 1) * 365 * 24 * 60;
  } else if (_0x4a66c1) {
    _0x50ba5e = Math.floor((_0xf7d13e - _0x4a66c1) / 60000);
  }
  if (_0x50ba5e == null || !Number.isFinite(_0x50ba5e) || _0x50ba5e < 0) {
    return null;
  }
  return _0x50ba5e;
}
function formatCommentAgeLabel(_0x19cc81) {
  const _0x4d737b = String(_0x19cc81 || "").trim();
  if (!_0x4d737b) {
    return "时间未知";
  }
  const _0x3576c8 = parseCommentAgeMinutes(_0x4d737b);
  if (_0x3576c8 == null) {
    return _0x4d737b;
  }
  if (_0x3576c8 === 0) {
    return "刚刚";
  }
  if (_0x3576c8 < 60) {
    return _0x3576c8 + " 分钟前";
  }
  if (_0x3576c8 < 1440) {
    return Math.floor(_0x3576c8 / 60) + " 小时前";
  }
  return _0x4d737b;
}
function stripLocationFromCommentTimeText(_0x57b8f9) {
  return String(_0x57b8f9 || "").replace(/\s*[·•･・.\-|｜]\s*(?:IP属地[:：\s]*)?[\u4e00-\u9fffA-Za-z]{2,12}\s*$/i, "").replace(/\s*IP属地[:：\s]*[\u4e00-\u9fffA-Za-z]{2,12}\s*$/i, "").trim();
}
function formatCommentTimeWithLocation(_0x3beb5e, _0xba328a = "") {
  const _0x3e97e7 = String(_0x3beb5e || "").trim();
  const _0x507986 = String(_0xba328a || "").trim();
  const _0x40f22d = stripLocationFromCommentTimeText(_0x3e97e7);
  const _0x145c15 = _0x40f22d || _0x3e97e7;
  if (!_0x507986 || _0x507986 === "未知") {
    return _0x3e97e7 || _0x145c15 || "";
  }
  if (!_0x145c15) {
    return _0x507986;
  }
  return _0x145c15 + " · " + _0x507986;
}
function normalizeCommentIpLocationText(_0x2b880e) {
  return String(_0x2b880e || "").replace(/^IP[属地]*[:：\s]*/i, "").replace(/^[·•･・.\-|｜]\s*/, "").trim();
}
const COMMENT_RELATIVE_TIME_RE = /(刚刚|昨天|\d+\s*(?:分钟|小时|天|周|月|年)前)/;
function linesBeforeNestedReplies(_0x5d1052 = []) {
  const _0x40f866 = [];
  for (const _0x570aee of Array.isArray(_0x5d1052) ? _0x5d1052 : []) {
    const _0x2cd2cc = String(_0x570aee || "").trim();
    if (!_0x2cd2cc) {
      continue;
    }
    if (_0x2cd2cc === "作者") {
      break;
    }
    if (/展开\s*\d+\s*条/.test(_0x2cd2cc)) {
      break;
    }
    if (/^\d+\s*条回复/.test(_0x2cd2cc)) {
      break;
    }
    if (/^回复\s*\d+/.test(_0x2cd2cc)) {
      break;
    }
    _0x40f866.push(_0x2cd2cc);
  }
  return _0x40f866;
}
function pickPrimaryCommentTimeMeta(_0x122e22 = []) {
  const _0x1b39db = linesBeforeNestedReplies(_0x122e22);
  for (const _0xd417ca of _0x1b39db) {
    const _0x4ac7cf = _0xd417ca.match(COMMENT_RELATIVE_TIME_RE);
    if (!_0x4ac7cf) {
      continue;
    }
    const _0x52c5b4 = _0x4ac7cf[1] || _0x4ac7cf[0];
    let _0x550170 = "";
    const _0x58bc5a = _0xd417ca.match(/(?:刚刚|昨天|\d+\s*(?:分钟|小时|天|周|月|年)前)\s*[·•･・.\-|｜]?\s*(?:IP属地[:：\s]*)?([\u4e00-\u9fff]{2,8})\s*$/);
    if (_0x58bc5a) {
      const _0xfe180f = normalizeCommentIpLocationText(_0x58bc5a[1]);
      if (_0xfe180f && !/^(分钟|小时|天|周|月|年|前|刚刚|昨天)$/.test(_0xfe180f)) {
        _0x550170 = _0xfe180f;
      }
    }
    return {
      time: _0x52c5b4,
      timeOriginal: _0xd417ca,
      ipLocation: _0x550170
    };
  }
  return {
    time: "",
    timeOriginal: "",
    ipLocation: ""
  };
}
function resolveCommentLocationText(_0x27581a = {}) {
  const _0x45d5fa = normalizeCommentIpLocationText(_0x27581a.ipLocation || _0x27581a.location || "");
  if (_0x45d5fa && _0x45d5fa !== "未知") {
    return _0x45d5fa;
  }
  const _0x15bd85 = String(_0x27581a.timeOriginal || _0x27581a.timeText || _0x27581a.time || "").trim();
  if (!_0x15bd85) {
    return "";
  }
  return pickPrimaryCommentTimeMeta([_0x15bd85]).ipLocation || "";
}
module.exports = {
  COMMENT_TIME_FILTER_PRESET_MINUTES: COMMENT_TIME_FILTER_PRESET_MINUTES,
  resolveCommentTimeFilterMinutes: resolveCommentTimeFilterMinutes,
  isCommentWithinWindowMinutes: isCommentWithinWindowMinutes,
  isCommentWithinTimeFilter: isCommentWithinTimeFilter,
  parseCommentAgeMinutes: parseCommentAgeMinutes,
  formatCommentAgeLabel: formatCommentAgeLabel,
  stripLocationFromCommentTimeText: stripLocationFromCommentTimeText,
  formatCommentTimeWithLocation: formatCommentTimeWithLocation,
  COMMENT_RELATIVE_TIME_RE: COMMENT_RELATIVE_TIME_RE,
  linesBeforeNestedReplies: linesBeforeNestedReplies,
  pickPrimaryCommentTimeMeta: pickPrimaryCommentTimeMeta,
  normalizeCommentIpLocationText: normalizeCommentIpLocationText,
  resolveCommentLocationText: resolveCommentLocationText
};
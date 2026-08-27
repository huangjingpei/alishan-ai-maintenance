'use strict';

function normalizeAccountKey(_0x49efe3) {
  return String(_0x49efe3 || "default");
}
function buildLegacyRadarSessionKey(_0x4d9620) {
  return "radar_state_" + normalizeAccountKey(_0x4d9620);
}
function buildRadarSessionKey(_0x6d33d3, _0x5e09f0 = "") {
  const _0x4940ba = normalizeAccountKey(_0x6d33d3);
  const _0x3c9f3a = String(_0x5e09f0 || "");
  if (_0x3c9f3a) {
    return "radar_state_" + _0x4940ba + "_" + _0x3c9f3a;
  } else {
    return buildLegacyRadarSessionKey(_0x4940ba);
  }
}
function parseStoredObject(_0x1490dc, _0x5521db) {
  if (!_0x1490dc || !_0x5521db) {
    return {};
  }
  try {
    const _0x14b39a = JSON.parse(_0x1490dc.getItem(_0x5521db) || "{}");
    if (_0x14b39a && typeof _0x14b39a === "object" && !Array.isArray(_0x14b39a)) {
      return _0x14b39a;
    } else {
      return {};
    }
  } catch (_0x3eab7c) {
    return {};
  }
}
function readRadarSessionState(_0x54333a, {
  accountId: _0x4a086b,
  taskId = "",
  migrateLegacy = false
} = {}) {
  const _0x1158c6 = buildRadarSessionKey(_0x4a086b, taskId);
  let _0xd0480f = parseStoredObject(_0x54333a, _0x1158c6);
  if (_0xd0480f.loopId || !migrateLegacy || !taskId) {
    return _0xd0480f;
  }
  const _0x3f42dd = buildLegacyRadarSessionKey(_0x4a086b);
  const _0x180f36 = parseStoredObject(_0x54333a, _0x3f42dd);
  if (_0x180f36.loopId !== taskId) {
    return _0xd0480f;
  }
  try {
    _0x54333a.setItem(_0x1158c6, JSON.stringify(_0x180f36));
    _0x54333a.removeItem(_0x3f42dd);
    _0xd0480f = _0x180f36;
  } catch (_0x4d0aed) {
    _0xd0480f = _0x180f36;
  }
  return _0xd0480f;
}
function restoreAutomationSessionLimits(_0x53c76e = {}, _0x7fed5a = {}) {
  const _0x384411 = _0x7fed5a?.loopId === _0x53c76e?.taskId;
  let _0x3ac8e1 = 0;
  let _0x5f0731 = null;
  let _0x58b8a2 = 0;
  let _0x9882df = null;
  let _0x344dc3 = 0;
  let _0x2e2325 = null;
  if (_0x384411) {
    if (Number.isFinite(_0x7fed5a.sessionInteractionCount)) {
      _0x3ac8e1 = Math.max(0, _0x7fed5a.sessionInteractionCount);
    }
    if (Number.isFinite(_0x7fed5a.interactionLimit)) {
      _0x5f0731 = _0x7fed5a.interactionLimit;
    }
    if (Number.isFinite(_0x7fed5a.followCount)) {
      _0x58b8a2 = _0x7fed5a.followCount;
    }
    if (Number.isFinite(_0x7fed5a.followLimit)) {
      _0x9882df = _0x7fed5a.followLimit;
    }
    if (Number.isFinite(_0x7fed5a.dmCount)) {
      _0x344dc3 = _0x7fed5a.dmCount;
    }
    if (Number.isFinite(_0x7fed5a.dmLimit)) {
      _0x2e2325 = _0x7fed5a.dmLimit;
    }
  }
  const _0x58317c = parseInt(_0x53c76e?.interactionLimit, 10);
  let _0x4475c2 = _0x5f0731 !== null ? _0x5f0731 : Number.isFinite(_0x58317c) && _0x58317c > 0 ? _0x58317c : Infinity;
  if (_0x53c76e?.taskMode === "scrape" || _0x53c76e?.taskMode === "nurture") {
    _0x4475c2 = Infinity;
  }
  return {
    interactionCount: _0x3ac8e1,
    interactionLimit: _0x4475c2,
    followCount: _0x58b8a2,
    followLimit: _0x9882df !== null ? _0x9882df : parseInt(_0x53c76e?.followLimit, 10) || Infinity,
    dmCount: _0x344dc3,
    dmLimit: _0x2e2325 !== null ? _0x2e2325 : parseInt(_0x53c76e?.dmLimit, 10) || Infinity
  };
}
module.exports = {
  buildLegacyRadarSessionKey: buildLegacyRadarSessionKey,
  buildRadarSessionKey: buildRadarSessionKey,
  parseStoredObject: parseStoredObject,
  readRadarSessionState: readRadarSessionState,
  restoreAutomationSessionLimits: restoreAutomationSessionLimits
};
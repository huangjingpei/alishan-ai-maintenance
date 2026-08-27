'use strict';

function normalizeActionCountResetTime(_0x581962, _0x2761ba = "00:00") {
  const _0x298db8 = String(_0x581962 == null ? "" : _0x581962).trim();
  const _0x522927 = _0x298db8.match(/^(\d{1,2}):(\d{2})$/);
  if (!_0x522927) {
    return _0x2761ba;
  }
  const _0x61a919 = Math.min(23, Math.max(0, parseInt(_0x522927[1], 10)));
  const _0x51a323 = Math.min(59, Math.max(0, parseInt(_0x522927[2], 10)));
  if (!Number.isFinite(_0x61a919) || !Number.isFinite(_0x51a323)) {
    return _0x2761ba;
  }
  return String(_0x61a919).padStart(2, "0") + ":" + String(_0x51a323).padStart(2, "0");
}
function msUntilNextActionCountReset(_0x2ff69b, _0x132c5e = new Date()) {
  const _0xb76a8d = normalizeActionCountResetTime(_0x2ff69b);
  const [_0x1b097d, _0x5cd43e] = _0xb76a8d.split(":").map(_0x28cd4b => parseInt(_0x28cd4b, 10));
  const _0x183913 = _0x132c5e instanceof Date ? _0x132c5e : new Date(_0x132c5e);
  const _0x84306a = new Date(_0x183913.getTime());
  _0x84306a.setSeconds(0, 0);
  _0x84306a.setHours(_0x1b097d, _0x5cd43e, 0, 0);
  if (_0x84306a.getTime() <= _0x183913.getTime()) {
    _0x84306a.setDate(_0x84306a.getDate() + 1);
  }
  return Math.max(1000, _0x84306a.getTime() - _0x183913.getTime());
}
function getLatestActionCountResetBoundary(_0xb39113, _0x296f36 = new Date()) {
  const _0x10a0ba = normalizeActionCountResetTime(_0xb39113);
  const [_0x2bf9c6, _0x2e8973] = _0x10a0ba.split(":").map(_0x592e92 => parseInt(_0x592e92, 10));
  const _0x3d0d7b = _0x296f36 instanceof Date ? _0x296f36 : new Date(_0x296f36);
  const _0x513c59 = new Date(_0x3d0d7b.getTime());
  _0x513c59.setSeconds(0, 0);
  _0x513c59.setHours(_0x2bf9c6, _0x2e8973, 0, 0);
  if (_0x513c59.getTime() > _0x3d0d7b.getTime()) {
    _0x513c59.setDate(_0x513c59.getDate() - 1);
  }
  return _0x513c59.getTime();
}
module.exports = {
  normalizeActionCountResetTime: normalizeActionCountResetTime,
  msUntilNextActionCountReset: msUntilNextActionCountReset,
  getLatestActionCountResetBoundary: getLatestActionCountResetBoundary
};
'use strict';

function formatEntityIngestSummary(_0x42b3de = {}) {
  const _0x3ec688 = Number(_0x42b3de.synced || 0);
  const _0x4f60f9 = Number(_0x42b3de.duplicates || 0);
  const _0xb1a4a3 = Number(_0x42b3de.alreadyCounted || 0);
  const _0xbff52f = Number(_0x42b3de.inPool ?? _0x4f60f9);
  const _0x3f4a40 = Number(_0x42b3de.skipped || 0);
  const _0x36858a = Number(_0x42b3de.truncated || 0);
  const _0x43f107 = Number(_0x42b3de.received || 0);
  const _0x418e0f = _0xbff52f > 0 ? _0xbff52f : _0x3ec688 === 0 && _0xb1a4a3 === 0 && _0x3f4a40 === 0 && _0x43f107 > 0 ? _0x43f107 : 0;
  if (_0x3ec688 === 0 && _0xb1a4a3 > 0 && _0x418e0f === 0) {
    return "已入库 " + _0xb1a4a3;
  }
  if (_0x3ec688 === 0 && _0x418e0f > 0) {
    return "已经有 " + _0x418e0f + " 条在库";
  }
  const _0xa3b1fd = ["新入库 " + _0x3ec688];
  if (_0x418e0f > 0) {
    _0xa3b1fd.push("已经有 " + _0x418e0f + " 条在库");
  }
  if (_0xb1a4a3 > 0 && (_0x3ec688 > 0 || _0x418e0f > 0)) {
    _0xa3b1fd.push("本轮已计入 " + _0xb1a4a3);
  }
  if (_0x3ec688 === 0 && _0x418e0f === 0 && _0xb1a4a3 === 0) {
    if (_0x3f4a40 > 0) {
      _0xa3b1fd.push("缺字段跳过 " + _0x3f4a40);
    }
    if (_0x36858a > 0) {
      _0xa3b1fd.push("已达上限未入 " + _0x36858a);
    }
  }
  return _0xa3b1fd.join("，");
}
function entityIngestSummaryLevel(_0x1732d7 = {}) {
  const _0x370c3e = Number(_0x1732d7.synced || 0);
  const _0x2c23ee = Number(_0x1732d7.duplicates || 0);
  const _0x163223 = Number(_0x1732d7.alreadyCounted || 0);
  const _0x3478ab = Number(_0x1732d7.inPool ?? _0x2c23ee);
  const _0x5ada44 = Number(_0x1732d7.received || 0);
  if (_0x370c3e > 0 || _0x3478ab > 0 || _0x163223 > 0) {
    return "success";
  }
  if (_0x370c3e === 0 && _0x5ada44 > 0 && Number(_0x1732d7.skipped || 0) === 0) {
    return "success";
  }
  return "info";
}
module.exports = {
  formatEntityIngestSummary: formatEntityIngestSummary,
  entityIngestSummaryLevel: entityIngestSummaryLevel
};
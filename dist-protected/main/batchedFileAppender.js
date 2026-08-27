'use strict';

const fs = require("fs");
function createBatchedFileAppender({
  flushIntervalMs = 250,
  onError = null
} = {}) {
  let _0x3c2469 = [];
  let _0x19759e = null;
  let _0x2a8078 = false;
  function _0x434c05(_0x23d924) {
    if (typeof onError !== "function") {
      return;
    }
    try {
      onError(_0x23d924);
    } catch (_0x533d22) {}
  }
  function _0x1fe001() {
    const _0x2d74b7 = _0x3c2469;
    _0x3c2469 = [];
    const _0x2f2493 = new Map();
    for (const _0x48c4c9 of _0x2d74b7) {
      _0x2f2493.set(_0x48c4c9.filePath, (_0x2f2493.get(_0x48c4c9.filePath) || "") + _0x48c4c9.content);
    }
    return _0x2f2493;
  }
  function _0x13cdbd(_0x552b6d = flushIntervalMs) {
    _0x19759e = setTimeout(_0x2e778a, Math.max(0, _0x552b6d));
    if (typeof _0x19759e.unref === "function") {
      _0x19759e.unref();
    }
  }
  function _0x2e778a() {
    if (_0x2a8078 || _0x3c2469.length === 0) {
      return;
    }
    if (_0x19759e) {
      clearTimeout(_0x19759e);
      _0x19759e = null;
    }
    const _0x1ad6ca = _0x1fe001();
    _0x2a8078 = true;
    let _0x17c01e = _0x1ad6ca.size;
    const _0x4aa779 = () => {
      _0x17c01e -= 1;
      if (_0x17c01e > 0) {
        return;
      }
      _0x2a8078 = false;
      if (_0x3c2469.length > 0 && !_0x19759e) {
        _0x13cdbd();
      }
    };
    for (const [_0x3b6d79, _0x4a7624] of _0x1ad6ca.entries()) {
      fs.appendFile(_0x3b6d79, _0x4a7624, "utf8", _0x2bdcb3 => {
        if (_0x2bdcb3) {
          _0x434c05(_0x2bdcb3);
        }
        _0x4aa779();
      });
    }
  }
  function _0x1eff10(_0x5622bb, _0x25efb1, {
    urgent = false
  } = {}) {
    _0x3c2469.push({
      filePath: _0x5622bb,
      content: _0x25efb1
    });
    if (_0x2a8078) {
      return;
    }
    if (_0x19759e) {
      if (!urgent) {
        return;
      }
      clearTimeout(_0x19759e);
    }
    _0x13cdbd(urgent ? 0 : flushIntervalMs);
  }
  function _0x278af8() {
    if (_0x19759e) {
      clearTimeout(_0x19759e);
      _0x19759e = null;
    }
    if (_0x3c2469.length === 0) {
      return;
    }
    const _0x30efec = _0x1fe001();
    for (const [_0x3be936, _0x4326e9] of _0x30efec.entries()) {
      try {
        fs.appendFileSync(_0x3be936, _0x4326e9, "utf8");
      } catch (_0x35eec3) {}
    }
  }
  return {
    append: _0x1eff10,
    flushPendingSync: _0x278af8
  };
}
module.exports = {
  createBatchedFileAppender: createBatchedFileAppender
};
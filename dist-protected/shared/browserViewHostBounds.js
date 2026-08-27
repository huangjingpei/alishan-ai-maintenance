'use strict';

function scaleCssRectToWindowBounds(_0x318c69, _0x2a2be1) {
  const _0x3fd43c = Number(_0x2a2be1);
  const _0x5c47ab = Number.isFinite(_0x3fd43c) && _0x3fd43c > 0 ? _0x3fd43c : 1;
  const _0x4632aa = Number(_0x318c69?.x ?? _0x318c69?.left);
  const _0x1291fc = Number(_0x318c69?.y ?? _0x318c69?.top);
  const _0x2100be = Number(_0x318c69?.width);
  const _0x39ef14 = Number(_0x318c69?.height);
  return {
    x: Math.round(_0x4632aa * _0x5c47ab),
    y: Math.round(_0x1291fc * _0x5c47ab),
    width: Math.round(_0x2100be * _0x5c47ab),
    height: Math.round(_0x39ef14 * _0x5c47ab)
  };
}
module.exports = {
  scaleCssRectToWindowBounds: scaleCssRectToWindowBounds
};
'use strict';

function scaleCssRectToWindowBounds(arg1, arg2) {
  const result = Number(arg2);
  const value = Number.isFinite(result) && result > 0 ? result : 1;
  const result2 = Number(arg1?.x ?? arg1?.left);
  const result3 = Number(arg1?.y ?? arg1?.top);
  const result4 = Number(arg1?.width);
  const result5 = Number(arg1?.height);
  return {
    x: Math.round(result2 * value),
    y: Math.round(result3 * value),
    width: Math.round(result4 * value),
    height: Math.round(result5 * value)
  };
}
module.exports = {
  scaleCssRectToWindowBounds: scaleCssRectToWindowBounds
};
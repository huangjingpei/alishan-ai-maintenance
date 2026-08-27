'use strict';

const UI_ZOOM_STORE_KEY = "system_ui_zoom_factor";
const UI_ZOOM_PERCENT_OPTIONS = Object.freeze([100, 110, 125, 150]);
const DEFAULT_UI_ZOOM_FACTOR = 1;
function normalizeUiZoomFactor(_0x1f5e0d) {
  const _0x2ba282 = Number(_0x1f5e0d);
  if (!Number.isFinite(_0x2ba282) || _0x2ba282 <= 0) {
    return DEFAULT_UI_ZOOM_FACTOR;
  }
  const _0x3cc535 = _0x2ba282 > 3 ? _0x2ba282 / 100 : _0x2ba282;
  const _0x224b52 = Math.round(_0x3cc535 * 100);
  if (UI_ZOOM_PERCENT_OPTIONS.includes(_0x224b52)) {
    return Math.round(_0x224b52) / 100;
  }
  let _0x476ac7 = UI_ZOOM_PERCENT_OPTIONS[0];
  let _0x4396ac = Math.abs(_0x224b52 - _0x476ac7);
  for (let _0x29b6a2 = 1; _0x29b6a2 < UI_ZOOM_PERCENT_OPTIONS.length; _0x29b6a2++) {
    const _0x38ce5b = UI_ZOOM_PERCENT_OPTIONS[_0x29b6a2];
    const _0x52bba1 = Math.abs(_0x224b52 - _0x38ce5b);
    if (_0x52bba1 < _0x4396ac) {
      _0x476ac7 = _0x38ce5b;
      _0x4396ac = _0x52bba1;
    }
  }
  return _0x476ac7 / 100;
}
function uiZoomFactorToPercent(_0x28ed95) {
  return Math.round(normalizeUiZoomFactor(_0x28ed95) * 100);
}
function uiZoomPercentToFactor(_0x4c790b) {
  return normalizeUiZoomFactor(Number(_0x4c790b) / 100);
}
module.exports = {
  UI_ZOOM_STORE_KEY: UI_ZOOM_STORE_KEY,
  UI_ZOOM_PERCENT_OPTIONS: UI_ZOOM_PERCENT_OPTIONS,
  DEFAULT_UI_ZOOM_FACTOR: DEFAULT_UI_ZOOM_FACTOR,
  normalizeUiZoomFactor: normalizeUiZoomFactor,
  uiZoomFactorToPercent: uiZoomFactorToPercent,
  uiZoomPercentToFactor: uiZoomPercentToFactor
};
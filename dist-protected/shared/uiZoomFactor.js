'use strict';

const UI_ZOOM_STORE_KEY = "system_ui_zoom_factor";
const UI_ZOOM_PERCENT_OPTIONS = Object.freeze([100, 110, 125, 150]);
const DEFAULT_UI_ZOOM_FACTOR = 1;
function normalizeUiZoomFactor(arg1) {
  const result = Number(arg1);
  if (!Number.isFinite(result) || result <= 0) {
    return DEFAULT_UI_ZOOM_FACTOR;
  }
  const value = result > 3 ? result / 100 : result;
  const result2 = Math.round(value * 100);
  if (UI_ZOOM_PERCENT_OPTIONS.includes(result2)) {
    return Math.round(result2) / 100;
  }
  let value2 = UI_ZOOM_PERCENT_OPTIONS[0];
  let result3 = Math.abs(result2 - value2);
  for (let num = 1; num < UI_ZOOM_PERCENT_OPTIONS.length; num++) {
    const value = UI_ZOOM_PERCENT_OPTIONS[num];
    const result = Math.abs(result2 - value);
    if (result < result3) {
      value2 = value;
      result3 = result;
    }
  }
  return value2 / 100;
}
function uiZoomFactorToPercent(arg1) {
  return Math.round(normalizeUiZoomFactor(arg1) * 100);
}
function uiZoomPercentToFactor(arg1) {
  return normalizeUiZoomFactor(Number(arg1) / 100);
}
module.exports = {
  UI_ZOOM_STORE_KEY: UI_ZOOM_STORE_KEY,
  UI_ZOOM_PERCENT_OPTIONS: UI_ZOOM_PERCENT_OPTIONS,
  DEFAULT_UI_ZOOM_FACTOR: DEFAULT_UI_ZOOM_FACTOR,
  normalizeUiZoomFactor: normalizeUiZoomFactor,
  uiZoomFactorToPercent: uiZoomFactorToPercent,
  uiZoomPercentToFactor: uiZoomPercentToFactor
};
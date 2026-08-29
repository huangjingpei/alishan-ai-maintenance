'use strict';

function normalizeAccountKey(arg1) {
  return String(arg1 || "default");
}
function buildLegacyRadarSessionKey(arg1) {
  return "radar_state_" + normalizeAccountKey(arg1);
}
function buildRadarSessionKey(arg1, text = "") {
  const result = normalizeAccountKey(arg1);
  const result2 = String(text || "");
  if (result2) {
    return "radar_state_" + result + "_" + result2;
  } else {
    return buildLegacyRadarSessionKey(result);
  }
}
function parseStoredObject(arg1, arg2) {
  if (!arg1 || !arg2) {
    return {};
  }
  try {
    const result = JSON.parse(arg1.getItem(arg2) || "{}");
    if (result && typeof result === "object" && !Array.isArray(result)) {
      return result;
    } else {
      return {};
    }
  } catch (error) {
    return {};
  }
}
function readRadarSessionState(arg1, {
  accountId: accountId,
  taskId = "",
  migrateLegacy = false
} = {}) {
  const result = buildRadarSessionKey(accountId, taskId);
  let result2 = parseStoredObject(arg1, result);
  if (result2.loopId || !migrateLegacy || !taskId) {
    return result2;
  }
  const result3 = buildLegacyRadarSessionKey(accountId);
  const result4 = parseStoredObject(arg1, result3);
  if (result4.loopId !== taskId) {
    return result2;
  }
  try {
    arg1.setItem(result, JSON.stringify(result4));
    arg1.removeItem(result3);
    result2 = result4;
  } catch (error) {
    result2 = result4;
  }
  return result2;
}
function restoreAutomationSessionLimits(options = {}, options2 = {}) {
  const value = options2?.loopId === options?.taskId;
  let num = 0;
  let local = null;
  let num2 = 0;
  let local2 = null;
  let num3 = 0;
  let local3 = null;
  if (value) {
    if (Number.isFinite(options2.sessionInteractionCount)) {
      num = Math.max(0, options2.sessionInteractionCount);
    }
    if (Number.isFinite(options2.interactionLimit)) {
      local = options2.interactionLimit;
    }
    if (Number.isFinite(options2.followCount)) {
      num2 = options2.followCount;
    }
    if (Number.isFinite(options2.followLimit)) {
      local2 = options2.followLimit;
    }
    if (Number.isFinite(options2.dmCount)) {
      num3 = options2.dmCount;
    }
    if (Number.isFinite(options2.dmLimit)) {
      local3 = options2.dmLimit;
    }
  }
  const result = parseInt(options?.interactionLimit, 10);
  let value2 = local !== null ? local : Number.isFinite(result) && result > 0 ? result : Infinity;
  if (options?.taskMode === "scrape" || options?.taskMode === "nurture") {
    value2 = Infinity;
  }
  return {
    interactionCount: num,
    interactionLimit: value2,
    followCount: num2,
    followLimit: local2 !== null ? local2 : parseInt(options?.followLimit, 10) || Infinity,
    dmCount: num3,
    dmLimit: local3 !== null ? local3 : parseInt(options?.dmLimit, 10) || Infinity
  };
}
module.exports = {
  buildLegacyRadarSessionKey: buildLegacyRadarSessionKey,
  buildRadarSessionKey: buildRadarSessionKey,
  parseStoredObject: parseStoredObject,
  readRadarSessionState: readRadarSessionState,
  restoreAutomationSessionLimits: restoreAutomationSessionLimits
};
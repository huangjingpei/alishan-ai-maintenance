'use strict';

const INTERACTION_MIRROR_CAPTURE_INTERVAL_MS = 360;
const INTERACTION_MIRROR_WIDTH = 640;
const INTERACTION_MIRROR_JPEG_QUALITY = 58;
function isAliveView(arg1) {
  return !!arg1?.webContents && !arg1.webContents.isDestroyed?.() && typeof arg1.webContents.capturePage === "function";
}
function listEligibleInteractionMirrorKeys({
  interactionLocksMap: interactionLocksMap,
  interactionViewsMap: interactionViewsMap,
  automationViewsVisible: automationViewsVisible,
  visibleAutomationViewKeys: visibleAutomationViewKeys
} = {}) {
  if (!automationViewsVisible) {
    return [];
  }
  const value = visibleAutomationViewKeys instanceof Set ? visibleAutomationViewKeys : null;
  const list = [];
  for (const [local, local2] of interactionLocksMap?.entries?.() || []) {
    if (!local2?.requireStableViewport) {
      continue;
    }
    if (value && !value.has(local)) {
      continue;
    }
    if (!isAliveView(interactionViewsMap?.get?.(local))) {
      continue;
    }
    list.push(String(local));
  }
  return list.sort();
}
function createInteractionMirrorStream(options = {}) {
  const {
    getMainWindow: getMainWindow,
    getInteractionLocksMap: getInteractionLocksMap,
    getInteractionViewsMap: getInteractionViewsMap,
    getAutomationViewsVisible: getAutomationViewsVisible,
    getVisibleAutomationViewKeys: getVisibleAutomationViewKeys,
    captureIntervalMs = INTERACTION_MIRROR_CAPTURE_INTERVAL_MS,
    mirrorWidth = INTERACTION_MIRROR_WIDTH,
    jpegQuality = INTERACTION_MIRROR_JPEG_QUALITY
  } = options;
  let set = new Set();
  let local = null;
  let flag = false;
  let flag2 = false;
  let num = 0;
  let num2 = 0;
  let text = "";
  const map = new Map();
  function fn(arg1, arg2) {
    const local = getMainWindow?.();
    if (!local || local.isDestroyed?.() || local.webContents?.isDestroyed?.()) {
      return false;
    }
    try {
      local.webContents.send(arg1, arg2);
      return true;
    } catch (error) {
      return false;
    }
  }
  function fn2() {
    return listEligibleInteractionMirrorKeys({
      interactionLocksMap: getInteractionLocksMap?.(),
      interactionViewsMap: getInteractionViewsMap?.(),
      automationViewsVisible: !!getAutomationViewsVisible?.(),
      visibleAutomationViewKeys: getVisibleAutomationViewKeys?.()
    });
  }
  function fn3() {
    const result = fn2();
    const set2 = new Set(result);
    for (const item of set) {
      if (!set2.has(item)) {
        fn("automation-interaction-mirror-state", {
          viewKey: item,
          active: false
        });
      }
    }
    for (const item of set2) {
      if (!set.has(item)) {
        fn("automation-interaction-mirror-state", {
          viewKey: item,
          active: true,
          mode: "first-comment-large-native",
          sourceWidth: 1200,
          sourceHeight: 800
        });
      }
    }
    set = set2;
    if (num >= result.length) {
      num = 0;
    }
    return result;
  }
  function fn4() {
    if (!local) {
      return;
    }
    clearTimeout(local);
    local = null;
  }
  function fn5(arg1 = captureIntervalMs) {
    if (flag2 || local || flag || set.size === 0) {
      return;
    }
    local = setTimeout(() => {
      local = null;
      fn6();
    }, Math.max(0, Number(arg1) || 0));
    if (typeof local.unref === "function") {
      local.unref();
    }
  }
  function fn7(arg1) {
    if (!getAutomationViewsVisible?.()) {
      return false;
    }
    const local = getVisibleAutomationViewKeys?.();
    if (local instanceof Set && !local.has(arg1)) {
      return false;
    }
    const local2 = getInteractionLocksMap?.().get?.(arg1);
    return !!local2?.requireStableViewport && !!isAliveView(getInteractionViewsMap?.().get?.(arg1));
  }
  async function fn6() {
    if (flag2 || flag) {
      return;
    }
    flag = true;
    try {
      const result = fn3();
      if (!result.length) {
        return;
      }
      const value = result[num % result.length];
      text = value;
      num = (num + 1) % result.length;
      const local = getInteractionViewsMap?.().get?.(value);
      if (!isAliveView(local)) {
        return;
      }
      const result2 = await local.webContents.capturePage();
      if (!fn7(value) || !result2 || result2.isEmpty?.()) {
        return;
      }
      const local2 = result2.getSize?.() || {
        width: 1200,
        height: 800
      };
      const result3 = Math.max(240, Math.min(Number(mirrorWidth) || INTERACTION_MIRROR_WIDTH, local2.width || 1200));
      const value2 = local2.width > result3 ? result2.resize({
        width: result3,
        quality: "good"
      }) : result2;
      const local3 = value2.getSize?.() || local2;
      const result4 = value2.toJPEG(Math.max(30, Math.min(85, Number(jpegQuality) || INTERACTION_MIRROR_JPEG_QUALITY)));
      if (!result4?.length || !fn7(value)) {
        return;
      }
      num2 += 1;
      fn("automation-interaction-mirror-frame", {
        viewKey: value,
        sequence: num2,
        capturedAt: Date.now(),
        width: Number(local3.width) || result3,
        height: Number(local3.height) || 0,
        jpeg: result4
      });
    } catch (error) {
      const local = text || "unknown";
      const result = Date.now();
      if (result - Number(map.get(local) || 0) > 10000) {
        map.set(local, result);
        console.warn("[Mirror] 互动页镜像捕获失败 " + local + ": " + (error?.message || error));
      }
    } finally {
      text = "";
      flag = false;
      if (!flag2) {
        fn3();
        fn5(captureIntervalMs);
      }
    }
  }
  function refresh({
    immediate = true
  } = {}) {
    if (flag2) {
      return [];
    }
    const result = fn3();
    if (!result.length) {
      fn4();
      return result;
    }
    fn5(immediate ? 0 : captureIntervalMs);
    return result;
  }
  function dispose() {
    if (flag2) {
      return;
    }
    flag2 = true;
    fn4();
    for (const item of set) {
      fn("automation-interaction-mirror-state", {
        viewKey: item,
        active: false
      });
    }
    set.clear();
    map.clear();
  }
  return {
    refresh: refresh,
    dispose: dispose,
    getActiveKeys: () => [...set]
  };
}
module.exports = {
  INTERACTION_MIRROR_CAPTURE_INTERVAL_MS: INTERACTION_MIRROR_CAPTURE_INTERVAL_MS,
  INTERACTION_MIRROR_WIDTH: INTERACTION_MIRROR_WIDTH,
  INTERACTION_MIRROR_JPEG_QUALITY: INTERACTION_MIRROR_JPEG_QUALITY,
  listEligibleInteractionMirrorKeys: listEligibleInteractionMirrorKeys,
  createInteractionMirrorStream: createInteractionMirrorStream
};
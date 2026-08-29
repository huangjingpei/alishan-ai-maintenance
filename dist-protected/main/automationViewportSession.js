'use strict';

const {
  waitForInteractionViewVisualReady
} = require("./interactionViewVisualReady");
function createAutomationViewportSession(options = {}) {
  const {
    getPlatformViews: getPlatformViews,
    getInteractionViewsMap: getInteractionViewsMap,
    getInteractionLocksMap: getInteractionLocksMap,
    resolveInteractionViewportBounds: resolveInteractionViewportBounds,
    restoreVisibleInteractionStack: restoreVisibleInteractionStack,
    shouldAttachAutomationView: shouldAttachAutomationView,
    attachAutomationViewToBackgroundHost: attachAutomationViewToBackgroundHost,
    finishInteraction: finishInteraction,
    destroyIdleInteractionView: destroyIdleInteractionView
  } = options;
  function registerInteractionSubview(arg1, arg2) {
    if (!arg1 || !arg2) {
      return null;
    }
    getInteractionViewsMap().set(arg1, arg2);
    return arg2;
  }
  function beginViewportSession(arg1, {
    timeoutMs = 240000,
    onTimeout = null
  } = {}) {
    const result = getPlatformViews().get(arg1);
    const result2 = getInteractionViewsMap().get(arg1);
    if (!result || !result2 || result2.webContents?.isDestroyed?.()) {
      return {
        started: false,
        interactionId: "",
        reason: "view_unavailable"
      };
    }
    const result3 = getInteractionLocksMap();
    const result4 = result3.get(arg1);
    if (result4?.timer) {
      clearTimeout(result4.timer);
    }
    const result5 = resolveInteractionViewportBounds(arg1, result, result2, result4);
    if (!result5 || Number(result5.width) <= 50 || Number(result5.height) <= 50) {
      return {
        started: false,
        interactionId: "",
        reason: "invalid_bounds"
      };
    }
    const value = Date.now() + "_" + Math.random().toString(36).slice(2);
    const obj = {
      bounds: {
        ...result5
      },
      zoomFactor: Number(result.webContents?.getZoomFactor?.()) || 1,
      previewBounds: {
        ...result5
      },
      previewZoomFactor: Number(result.webContents?.getZoomFactor?.()) || 1,
      startedAt: Date.now(),
      interactionId: value,
      visibleSwapReady: false,
      timer: null,
      taskDispatchTimer: null,
      profileOpenTimer: null,
      loadListener: null,
      profileOpenReady: false
    };
    obj.timer = setTimeout(() => {
      const result = result3.get(arg1);
      if (!result || result.interactionId !== value) {
        return;
      }
      if (typeof onTimeout === "function") {
        onTimeout({
          viewKey: arg1,
          interactionId: value
        });
      }
    }, Math.max(1000, Number(timeoutMs) || 240000));
    obj.timer.unref?.();
    result3.set(arg1, obj);
    try {
      if (shouldAttachAutomationView(arg1)) {
        const result = restoreVisibleInteractionStack(arg1, "viewport-session-begin:" + arg1);
        if (!result?.interactionStaged) {
          if (obj.timer) {
            clearTimeout(obj.timer);
          }
          result3.delete(arg1);
          return {
            started: false,
            interactionId: "",
            reason: "visible_stack_not_staged"
          };
        }
      } else {
        attachAutomationViewToBackgroundHost(arg1, result2, {
          active: false,
          force: true
        });
      }
    } catch (error) {
      if (obj.timer) {
        clearTimeout(obj.timer);
      }
      result3.delete(arg1);
      return {
        started: false,
        interactionId: "",
        reason: "viewport_staging_failed",
        detail: error?.message || String(error || "")
      };
    }
    return {
      started: true,
      interactionId: value,
      bounds: {
        ...result5
      }
    };
  }
  async function revealViewportSession(arg1, arg2, num = 8000) {
    const result = getInteractionLocksMap();
    const result2 = getInteractionViewsMap().get(arg1);
    const local = () => result.get(arg1)?.interactionId === arg2;
    const result3 = await waitForInteractionViewVisualReady(result2, local, num);
    if (!result3.ready || !local()) {
      return result3;
    }
    const result4 = result.get(arg1);
    result4.visibleSwapReady = true;
    result4.profileOpenReady = true;
    if (shouldAttachAutomationView(arg1)) {
      const result = restoreVisibleInteractionStack(arg1, "viewport-session-ready:" + arg1);
      if (!result.interactionVisible) {
        return {
          ...result3,
          ready: false,
          reason: "visible_stack_not_restored"
        };
      }
    }
    return result3;
  }
  function endViewportSession(arg1, {
    interactionId = "",
    results = {},
    reason = "done",
    destroySubview = false
  } = {}) {
    const result = getInteractionLocksMap().get(arg1);
    if (interactionId && result && result.interactionId !== interactionId) {
      return false;
    }
    if (!result && interactionId) {
      return false;
    }
    const result2 = finishInteraction(arg1, results, reason, {
      notifyMainView: false,
      preferLatestBounds: true,
      skipIdleCleanup: destroySubview
    });
    let flag = false;
    if (destroySubview) {
      flag = destroyIdleInteractionView(arg1, getInteractionViewsMap().get(arg1), reason);
    }
    return result2 !== false || flag;
  }
  function destroyViewportSubview(arg1, text = "destroy") {
    const result = getInteractionLocksMap().get(arg1);
    if (result) {
      finishInteraction(arg1, {}, text, {
        notifyMainView: false,
        preferLatestBounds: true,
        skipIdleCleanup: true
      });
    }
    return destroyIdleInteractionView(arg1, getInteractionViewsMap().get(arg1), text);
  }
  return {
    registerInteractionSubview: registerInteractionSubview,
    beginViewportSession: beginViewportSession,
    revealViewportSession: revealViewportSession,
    endViewportSession: endViewportSession,
    destroyViewportSubview: destroyViewportSubview
  };
}
module.exports = {
  createAutomationViewportSession: createAutomationViewportSession
};
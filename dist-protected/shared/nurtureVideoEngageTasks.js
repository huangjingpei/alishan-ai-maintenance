'use strict';

const {
  likeCurrentVideoSideAction,
  collectCurrentVideoSideAction,
  findShareSideActionButton,
  findSharePanelCopyLinkButton,
  resolveVideoEngagePack
} = require("./douyinVideoSideActions");
const NURTURE_ENGAGE_LIKE_PERCENT = 10;
const NURTURE_ENGAGE_COLLECT_PERCENT = 10;
const NURTURE_ENGAGE_SHARE_PERCENT = 10;
function rollPercent(arg1) {
  const result = Math.max(0, Math.min(100, Number(arg1) || 0));
  if (result >= 100) {
    return true;
  }
  if (result <= 0) {
    return false;
  }
  return Math.random() * 100 < result;
}
async function nurtureLikeCurrentVideo(arg1, options = {}) {
  const local = (arg1, arg2) => options.reportTraceLog?.(arg1.startsWith("养号") || arg1.startsWith("❤️") || arg1.startsWith("👍") ? arg1 : "养号：" + arg1, null, arg2);
  const result = await likeCurrentVideoSideAction(arg1, {
    ...options,
    reportTraceLog: (arg1, arg2, arg3) => local(arg1, arg3)
  });
  if (result) {
    options.reportTraceLog?.("❤️ 养号：已点赞当前视频");
  }
  return result;
}
async function nurtureCollectCurrentVideo(arg1, options = {}) {
  const local = (arg1, arg2) => options.reportTraceLog?.(arg1.startsWith("养号") || arg1.startsWith("⭐") || arg1.startsWith("👍") ? arg1 : "养号：" + arg1, null, arg2);
  const result = await collectCurrentVideoSideAction(arg1, {
    ...options,
    reportTraceLog: (arg1, arg2, arg3) => local(arg1, arg3)
  });
  if (result) {
    options.reportTraceLog?.("⭐ 养号：已收藏当前视频");
  }
  return result;
}
function pickVisibleVideoSurface(arg1, arg2) {
  const local = arg1 || document;
  const list = [];
  try {
    list.push(...Array.from(local.querySelectorAll("video")));
    list.push(...Array.from(local.querySelectorAll("[class*=\"xgplayer\"], [class*=\"video-player\"], [data-e2e*=\"video-player\"], [class*=\"player-container\"]")));
  } catch (error) {}
  let local2 = null;
  let num = 0;
  for (const item of list) {
    if (!item || arg2 && !arg2(item)) {
      continue;
    }
    let local;
    try {
      local = item.getBoundingClientRect();
    } catch (error) {
      continue;
    }
    if (!local || local.width < 120 || local.height < 160) {
      continue;
    }
    const value = local.width * local.height;
    if (value > num) {
      local2 = item;
      num = value;
    }
  }
  return local2;
}
function dispatchClientPointClick(arg1, arg2, arg3) {
  const result = Math.round(arg1);
  const result2 = Math.round(arg2);
  let local = null;
  try {
    local = document.elementFromPoint(result, result2);
  } catch (error) {}
  if (!local) {
    local = arg3;
  }
  if (!local) {
    return false;
  }
  const obj = {
    bubbles: true,
    cancelable: true,
    view: window,
    clientX: result,
    clientY: result2,
    buttons: 1
  };
  try {
    local.dispatchEvent(new PointerEvent("pointerdown", obj));
    local.dispatchEvent(new MouseEvent("mousedown", obj));
    local.dispatchEvent(new PointerEvent("pointerup", obj));
    local.dispatchEvent(new MouseEvent("mouseup", obj));
    local.dispatchEvent(new MouseEvent("click", obj));
    return true;
  } catch (error) {
    try {
      if (arg3?.click) {
        arg3.click();
        return true;
      }
    } catch (error) {}
  }
  return false;
}
async function dismissSharePanelByClickingVideo(arg1, options = {}) {
  const {
    getDouyinFeedScope: getDouyinFeedScope,
    isVisibleElement: isVisibleElement,
    sleep: sleep,
    reportTraceLog: reportTraceLog,
    reportCurrentAction: reportCurrentAction,
    shouldAbort: shouldAbort,
    resumeVisibleDouyinVideos: resumeVisibleDouyinVideos
  } = options;
  if (shouldAbort?.(arg1)) {
    return false;
  }
  const local = getDouyinFeedScope?.() || document;
  const result = pickVisibleVideoSurface(local, isVisibleElement);
  if (!result) {
    reportTraceLog?.("养号：未找到视频画面，Esc 关闭分享面板", null, "warning");
    try {
      window.dispatchEvent(new KeyboardEvent("keydown", {
        key: "Escape",
        keyCode: 27,
        bubbles: true
      }));
    } catch (error) {}
    await sleep?.(350);
    try {
      resumeVisibleDouyinVideos?.(local, "养号：分享面板关闭后恢复播放");
    } catch (error) {}
    return false;
  }
  const result2 = result.getBoundingClientRect();
  const value = 0.28 + Math.random() * 0.34;
  const value2 = 0.3 + Math.random() * 0.28;
  const value3 = result2.left + result2.width * value;
  const value4 = result2.top + result2.height * value2;
  reportCurrentAction?.("养号：点击视频关闭分享面板…");
  reportTraceLog?.("🖱 养号：点击视频区域关闭分享面板并继续播放（" + Math.round(value3) + "," + Math.round(value4) + "）");
  dispatchClientPointClick(value3, value4, result);
  await sleep?.(450);
  try {
    resumeVisibleDouyinVideos?.(local, "养号：复制链接后确保继续播放");
  } catch (error) {}
  return true;
}
async function nurtureShareCopyLinkCurrentVideo(arg1, options = {}, options2 = {}) {
  const {
    simulateHumanClick: simulateHumanClick,
    randomDelay: randomDelay,
    reportTraceLog: reportTraceLog,
    reportCurrentAction: reportCurrentAction,
    isVisibleElement: isVisibleElement,
    sleep: sleep,
    shouldAbort: shouldAbort
  } = options;
  const result = resolveVideoEngagePack(options);
  const result2 = await findShareSideActionButton(arg1, options);
  if (!result2 || typeof simulateHumanClick !== "function") {
    reportTraceLog?.("养号：未找到分享/转发按钮，跳过复制链接", null, "warning");
    return false;
  }
  reportCurrentAction?.("养号：点击转发，等待分享面板…");
  reportTraceLog?.("↗️ 养号：已点击转发按钮，等待 2~3 秒后点「复制链接」");
  await simulateHumanClick(result2, arg1);
  await randomDelay?.(2200, 3200, arg1, "等待分享面板就绪");
  if (shouldAbort?.(arg1)) {
    return false;
  }
  let result3 = findSharePanelCopyLinkButton(isVisibleElement, result);
  const value = Date.now() + 4000;
  while (!result3 && Date.now() < value && !shouldAbort?.(arg1)) {
    await (sleep?.(160) || Promise.resolve());
    result3 = findSharePanelCopyLinkButton(isVisibleElement, result);
  }
  if (!result3) {
    reportTraceLog?.("养号：分享面板未找到「复制链接」，关闭面板", null, "warning");
    try {
      options2.releasePauseBeforeDismiss?.();
    } catch (error) {}
    await dismissSharePanelByClickingVideo(arg1, options);
    return false;
  }
  reportCurrentAction?.("养号：点击复制链接…");
  await simulateHumanClick(result3, arg1);
  await randomDelay?.(600, 1100, arg1, "复制链接后");
  reportTraceLog?.("🔗 养号：已点击「复制链接」（转发）");
  try {
    options2.releasePauseBeforeDismiss?.();
  } catch (error) {}
  await dismissSharePanelByClickingVideo(arg1, options);
  return true;
}
function startEngagePauseLock(options = {}, arg2) {
  const local = options.getDouyinFeedScope?.() || document;
  try {
    options.pauseVisibleDouyinVideos?.(local, "养号互动期间暂停，防止自动切下一条");
  } catch (error) {}
  let local2 = null;
  try {
    if (typeof options.startCurrentVideoPauseGuard === "function") {
      local2 = options.startCurrentVideoPauseGuard({
        scope: local
      }, arg2, {
        pauseOnly: true,
        intervalMs: 120
      });
    }
  } catch (error) {}
  let flag = false;
  return {
    stop({
      resume = true
    } = {}) {
      if (flag) {
        return;
      }
      flag = true;
      try {
        local2?.stop?.();
      } catch (error) {}
      if (!resume) {
        return;
      }
      try {
        options.resumeVisibleDouyinVideos?.(local, "养号互动结束，恢复播放");
      } catch (error) {}
    }
  };
}
async function nurtureEngageCurrentVideo(arg1, options = {}, options2 = {}) {
  const {
    shouldAbort: shouldAbort,
    randomDelay: randomDelay,
    reportNurtureProgress: reportNurtureProgress,
    reportTraceLog: reportTraceLog,
    getVisibleDouyinVideoDurationMs: getVisibleDouyinVideoDurationMs,
    getDouyinFeedScope: getDouyinFeedScope
  } = options2;
  if (shouldAbort?.(arg1)) {
    return {
      liked: false,
      collected: false,
      shared: false
    };
  }
  const local = (arg1, arg2) => {
    const result = Number(arg1);
    if (!Number.isFinite(result)) {
      return arg2;
    }
    return Math.max(0, Math.min(100, Math.round(result)));
  };
  const local2 = options.currentTask || {};
  const result = local(options.nurtureLikePercent ?? local2.nurtureLikePercent, NURTURE_ENGAGE_LIKE_PERCENT);
  const result2 = local(options.nurtureCollectPercent ?? local2.nurtureCollectPercent, NURTURE_ENGAGE_COLLECT_PERCENT);
  const result3 = local(options.nurtureSharePercent ?? local2.nurtureSharePercent, NURTURE_ENGAGE_SHARE_PERCENT);
  const local3 = getDouyinFeedScope?.() || document;
  const local4 = Number(getVisibleDouyinVideoDurationMs?.(local3) || 0) || 0;
  if (local4 > 0) {
    reportTraceLog?.("⏱ 养号：当前视频时长约 " + (local4 / 1000).toFixed(1) + " 秒，互动前暂停防切条");
  }
  reportNurtureProgress?.(options, arg1, "养号：执行点赞/收藏/转发…", "🖐 养号：互动验收（赞" + result + "% / 藏" + result2 + "% / 转" + result3 + "%）");
  const result4 = startEngagePauseLock(options2, arg1);
  const obj = {
    liked: false,
    collected: false,
    shared: false
  };
  try {
    if (rollPercent(result) && !shouldAbort?.(arg1)) {
      obj.liked = await nurtureLikeCurrentVideo(arg1, options2);
      if (obj.liked) {
        options.likeActions = (options.likeActions || 0) + 1;
      }
      await randomDelay?.(500, 1100, arg1, "点赞后间隔");
    }
    if (rollPercent(result2) && !shouldAbort?.(arg1)) {
      obj.collected = await nurtureCollectCurrentVideo(arg1, options2);
      if (obj.collected) {
        options.collectActions = (options.collectActions || 0) + 1;
      }
      await randomDelay?.(500, 1100, arg1, "收藏后间隔");
    }
    if (rollPercent(result3) && !shouldAbort?.(arg1)) {
      obj.shared = await nurtureShareCopyLinkCurrentVideo(arg1, options2, {
        releasePauseBeforeDismiss: () => result4.stop({
          resume: false
        })
      });
      if (obj.shared) {
        options.shareActions = (options.shareActions || 0) + 1;
      }
      await randomDelay?.(500, 1000, arg1, "转发后间隔");
    }
  } finally {
    result4.stop();
  }
  reportTraceLog?.("🖐 养号互动结果：赞=" + (obj.liked ? "是" : "否") + " 藏=" + (obj.collected ? "是" : "否") + " 转=" + (obj.shared ? "是" : "否"));
  return obj;
}
function resolveNurtureEngageAfterMs(arg1, arg2) {
  const num = 14000;
  const local = Number(arg1) || 0;
  const local2 = Number(arg2) || 8000;
  if (local > 0) {
    if (local <= 12000) {
      return Math.min(1500, Math.max(800, local - num));
    }
    return Math.max(1500, Math.min(5500, local - num));
  }
  return Math.min(5000, Math.max(2000, Math.floor(local2 * 0.2)));
}
module.exports = {
  NURTURE_ENGAGE_LIKE_PERCENT: NURTURE_ENGAGE_LIKE_PERCENT,
  NURTURE_ENGAGE_COLLECT_PERCENT: NURTURE_ENGAGE_COLLECT_PERCENT,
  NURTURE_ENGAGE_SHARE_PERCENT: NURTURE_ENGAGE_SHARE_PERCENT,
  nurtureEngageCurrentVideo: nurtureEngageCurrentVideo,
  nurtureLikeCurrentVideo: nurtureLikeCurrentVideo,
  nurtureCollectCurrentVideo: nurtureCollectCurrentVideo,
  nurtureShareCopyLinkCurrentVideo: nurtureShareCopyLinkCurrentVideo,
  dismissSharePanelByClickingVideo: dismissSharePanelByClickingVideo,
  findSharePanelCopyLinkButton: findSharePanelCopyLinkButton,
  pickVisibleVideoSurface: pickVisibleVideoSurface,
  resolveNurtureEngageAfterMs: resolveNurtureEngageAfterMs,
  rollPercent: rollPercent
};
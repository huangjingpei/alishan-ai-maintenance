const path = require("path");
const {
  BrowserWindow
} = require("electron");
const {
  acquireTaskRuntimeGuard,
  releaseTaskRuntimeGuard
} = require("./taskRuntimeGuard");
const {
  applyHiddenAutomationWindowPolicy,
  ensureHiddenWindowStaysHidden,
  showHiddenAutomationWindow,
  hideVisibleAutomationWindow
} = require("./hiddenWindowGuards");
const {
  CREATOR_UPLOAD_URL,
  getDismissDialogScript,
  getPageProbeScript,
  getFillTitleDescScript,
  getClickPublishScript,
  getPublishResultScript
} = require("../shared/workPublishDom");
const RUNTIME_LOG_LIMIT = 400;
const RUNTIME_LOG_TASK_LIMIT = 40;
const NAVIGATION_TIMEOUT_MS = 60000;
const UPLOAD_WAIT_MS = 480000;
const PUBLISH_WAIT_MS = 90000;
function sleep(arg1) {
  return new Promise(arg12 => setTimeout(arg12, arg1));
}
function randomBetween(arg1, arg2) {
  const result = Math.min(arg1, arg2);
  const result2 = Math.max(arg1, arg2);
  return result + Math.floor(Math.random() * (result2 - result + 1));
}
function createWorkPublishRunner(arg1) {
  const {
    app: app,
    store: store,
    fs: fs,
    runtimeConfig = null,
    applyAccountProxy: applyAccountProxy,
    configureAutomationSession: configureAutomationSession,
    applyPackagedWindowMenuPolicy: applyPackagedWindowMenuPolicy,
    attachProtocolGuard: attachProtocolGuard
  } = arg1;
  async function fn(arg1) {
    if (!runtimeConfig || !arg1 || arg1.isDestroyed?.()) {
      return;
    }
    try {
      if (typeof runtimeConfig.ensureFetched === "function") {
        await runtimeConfig.ensureFetched();
      }
      runtimeConfig.pushToWebContents?.(arg1);
    } catch (error) {
      console.warn("[WorkPublish] runtime config push failed:", error?.message || error);
    }
  }
  const local = () => {
    if (typeof arg1.getMainWindow === "function") {
      return arg1.getMainWindow();
    }
    return arg1.mainWindow || null;
  };
  const map = new Map();
  const map2 = new Map();
  const map3 = new Map();
  const local2 = arg1 => "work-publish:" + arg1;
  function fn2(arg1, arg2) {
    try {
      const result = local();
      if (result && !result.isDestroyed() && !result.webContents?.isDestroyed?.()) {
        result.webContents.send("work-publish-task-event", {
          taskId: arg1,
          ...arg2
        });
      }
    } catch (error) {}
  }
  function fn3(arg1, arg2, text = "info") {
    if (!arg1 || !arg2) {
      return;
    }
    const obj = {
      taskId: arg1,
      type: "log",
      message: arg2,
      level: text,
      ts: Date.now()
    };
    if (!map3.has(arg1) && map3.size >= RUNTIME_LOG_TASK_LIMIT) {
      const local = [...map3.keys()].find(arg1 => !map.has(arg1)) || map3.keys().next().value;
      if (local != null) {
        map3.delete(local);
      }
    }
    const local = map3.get(arg1) || [];
    local.push(obj);
    if (local.length > RUNTIME_LOG_LIMIT) {
      local.splice(0, local.length - RUNTIME_LOG_LIMIT);
    }
    map3.set(arg1, local);
    fn2(arg1, obj);
  }
  function getTaskLogs(arg1 = null) {
    if (arg1 != null && arg1 !== "") {
      return (map3.get(arg1) || []).map(arg1 => ({
        ...arg1
      }));
    }
    const obj = {};
    for (const [local, local2] of map3.entries()) {
      obj[local] = local2.map(arg1 => ({
        ...arg1
      }));
    }
    return obj;
  }
  function clearTaskLogs(arg1 = null) {
    if (arg1 != null && arg1 !== "") {
      return map3.delete(arg1);
    }
    map3.clear();
    return true;
  }
  function listRunningTaskIds() {
    return [...map.keys()];
  }
  function isTaskRunning(arg1) {
    return map.has(String(arg1));
  }
  function fn8() {
    let result = path.join(__dirname, "..", "automation-preload.js");
    if (app.isPackaged) {
      const result2 = store.get("latest_resource_path");
      if (result2 && fs.existsSync(path.join(result2, "automation-preload.js"))) {
        result = path.join(result2, "automation-preload.js");
      }
    }
    return result;
  }
  async function fn9(arg1, arg2) {
    if (!arg1 || arg1.isDestroyed() || arg1.webContents.isDestroyed()) {
      throw new Error("window_destroyed");
    }
    return arg1.webContents.executeJavaScript(arg2, true);
  }
  async function fn10(arg1, arg2, arg3 = NAVIGATION_TIMEOUT_MS) {
    if (!arg1 || arg1.isDestroyed()) {
      throw new Error("window_destroyed");
    }
    await Promise.race([arg1.loadURL(arg2), sleep(arg3).then(() => {
      throw new Error("navigation_timeout");
    })]);
    await sleep(1800);
  }
  async function fn11(arg1, arg2) {
    const value = "douyin_" + arg1;
    const value2 = "persist:automation:" + value;
    const result = local();
    const browserWindow = new BrowserWindow({
      parent: result && !result.isDestroyed() ? result : undefined,
      width: 1280,
      height: 900,
      show: false,
      x: -4000,
      y: -4000,
      opacity: 0,
      skipTaskbar: true,
      focusable: false,
      backgroundColor: "#0f172a",
      webPreferences: {
        partition: value2,
        backgroundThrottling: false,
        contextIsolation: true,
        sandbox: false,
        preload: fn8(),
        spellcheck: false
      },
      autoHideMenuBar: true
    });
    browserWindow.__radarWorkPublishAccountId = String(arg1);
    browserWindow.__radarAllowVisibleMonitor = false;
    applyHiddenAutomationWindowPolicy(browserWindow, {
      parent: result
    });
    if (typeof applyPackagedWindowMenuPolicy === "function") {
      applyPackagedWindowMenuPolicy(browserWindow);
    }
    if (typeof attachProtocolGuard === "function") {
      attachProtocolGuard(browserWindow.webContents, "work-publish:" + value);
    }
    try {
      if (typeof configureAutomationSession === "function") {
        configureAutomationSession(browserWindow.webContents.session, value);
      }
    } catch (error) {}
    try {
      if (typeof applyAccountProxy === "function" && arg2) {
        await applyAccountProxy(browserWindow.webContents.session, arg2, value);
      }
    } catch (error) {
      console.warn("[WorkPublish] apply proxy failed:", error.message);
    }
    ensureHiddenWindowStaysHidden(browserWindow);
    browserWindow.webContents.on("dom-ready", () => {
      runtimeConfig?.ensureAndPushToWebContents?.(browserWindow.webContents);
    });
    browserWindow.on("closed", () => {
      if (map2.get(String(arg1)) === browserWindow) {
        map2.delete(String(arg1));
      }
    });
    map2.set(String(arg1), browserWindow);
    await fn(browserWindow.webContents);
    return browserWindow;
  }
  async function fn12(arg1, options = {}) {
    const result = String(arg1);
    let result2 = map2.get(result);
    if (result2 && !result2.isDestroyed()) {
      return result2;
    }
    return fn11(result, options.proxy || null);
  }
  function listWebContents() {
    return [...map2.values()].filter(arg1 => arg1 && !arg1.isDestroyed()).map(arg1 => arg1.webContents).filter(arg1 => arg1 && !arg1.isDestroyed?.());
  }
  function fn14(arg1) {
    const result = String(arg1);
    const result2 = map2.get(result);
    if (!result2) {
      return;
    }
    map2.delete(result);
    try {
      if (!result2.isDestroyed()) {
        result2.destroy();
      }
    } catch (error) {}
  }
  function fn15(arg1 = new Set()) {
    for (const [local] of map2.entries()) {
      if (arg1.has(String(local))) {
        continue;
      }
      const result = [...map.values()].some(arg1 => (arg1.accountIds || []).includes(String(local)));
      if (!result) {
        fn14(local);
      }
    }
  }
  async function fn16(arg1, list = []) {
    const result = (Array.isArray(list) ? list : [list]).map(arg1 => path.resolve(String(arg1 || ""))).filter(arg1 => arg1 && fs.existsSync(arg1));
    if (!result.length) {
      return {
        ok: false,
        error: "file_not_found"
      };
    }
    if (!arg1 || arg1.isDestroyed()) {
      return {
        ok: false,
        error: "no_webcontents"
      };
    }
    const value = arg1.debugger;
    let flag = false;
    try {
      if (!value.isAttached()) {
        value.attach("1.3");
        flag = true;
      }
      const {
        root: root
      } = await value.sendCommand("DOM.getDocument", {
        depth: -1,
        pierce: true
      });
      const list = ["input[type=\"file\"][accept*=\"video\"]", "input[type=\"file\"][accept*=\"image\"]", "input[type=\"file\"][accept*=\"*\"]", "input[type=\"file\"]"];
      let local = null;
      let text = "";
      for (const item of list) {
        try {
          const result = await value.sendCommand("DOM.querySelector", {
            nodeId: root.nodeId,
            selector: item
          });
          if (result?.nodeId) {
            local = result.nodeId;
            text = item;
            break;
          }
        } catch (error) {}
      }
      if (!local) {
        return {
          ok: false,
          error: "no_file_input"
        };
      }
      await value.sendCommand("DOM.setFileInputFiles", {
        nodeId: local,
        files: result
      });
      return {
        ok: true,
        method: "cdp",
        selector: text,
        count: result.length
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message || String(error)
      };
    } finally {
      if (flag) {
        try {
          value.detach();
        } catch (error) {}
      }
    }
  }
  async function fn17(arg1, arg2, {
    timeoutMs: timeoutMs,
    intervalMs = 1500,
    label = "wait"
  } = {}) {
    const result = Date.now();
    while (Date.now() - result < timeoutMs) {
      if (arg1.stopRequested) {
        throw new Error("stopped");
      }
      const result = await arg2();
      if (result) {
        return result;
      }
      await sleep(intervalMs);
    }
    throw new Error(label + "_timeout");
  }
  async function fn18(arg1, arg2, arg3) {
    const value = arg1.taskId;
    const result = String(arg2.accountId || "");
    const local = arg2.media?.filePath || "";
    if (!result) {
      throw new Error("缺少账号");
    }
    if (!local || !fs.existsSync(local)) {
      throw new Error("素材文件不存在");
    }
    if (arg2.media?.type === "image") {
      throw new Error("暂不支持图文，请使用视频素材");
    }
    const set = new Set([".mp4", ".mov", ".m4v", ".avi", ".mkv"]);
    if (!set.has(path.extname(local).toLowerCase())) {
      throw new Error("暂不支持图文，请使用视频素材");
    }
    fn3(value, "[" + (arg2.accountName || result) + "] 打开创作者上传页…");
    const result2 = await fn12(result, arg3);
    ensureHiddenWindowStaysHidden(result2);
    await fn10(result2, CREATOR_UPLOAD_URL);
    try {
      await fn9(result2, getDismissDialogScript());
    } catch (error) {}
    await sleep(800);
    let result3 = await fn9(result2, getPageProbeScript());
    if (result3?.hasLogin) {
      throw new Error("账号未登录创作者中心，请先在账号池登录该抖音号");
    }
    if (!result3?.fileInputCount) {
      try {
        await fn9(result2, "(() => {\n          const nodes = Array.from(document.querySelectorAll('button, [role=\"button\"], div, span'));\n          for (const el of nodes) {\n            const t = (el.innerText || el.textContent || '').trim();\n            if (/上传视频|上传/.test(t) && t.length <= 8 && !/图文/.test(t)) { el.click(); return true; }\n          }\n          return false;\n        })()");
        await sleep(1200);
        result3 = await fn9(result2, getPageProbeScript());
      } catch (error) {}
    }
    fn3(value, "[" + (arg2.accountName || result) + "] 注入素材文件…");
    const result4 = await fn16(result2.webContents, [local]);
    if (!result4.ok) {
      throw new Error("无法选择素材：" + (result4.error || "unknown"));
    }
    fn3(value, "[" + (arg2.accountName || result) + "] 等待上传/解析完成…");
    await fn17(arg1, async () => {
      try {
        await fn9(result2, getDismissDialogScript());
      } catch (error) {}
      const result = await fn9(result2, getPageProbeScript());
      if (result?.hasLogin) {
        throw new Error("登录态失效");
      }
      if (result?.editReady || (result?.publishBtns || []).some(arg1 => arg1.includes("发布"))) {
        return result;
      }
      return null;
    }, {
      timeoutMs: UPLOAD_WAIT_MS,
      intervalMs: 2000,
      label: "upload_parse"
    });
    await sleep(1200);
    fn3(value, "[" + (arg2.accountName || result) + "] 填写标题与描述…");
    const result5 = await fn9(result2, getFillTitleDescScript(arg2.title || "", arg2.description || ""));
    if (!result5?.titleOk) {
      fn3(value, "[" + (arg2.accountName || result) + "] 标题填写可能失败，继续尝试发布", "warn");
    }
    await sleep(800);
    {
      const result2 = randomBetween(10, 30);
      fn3(value, "[" + (arg2.accountName || result) + "] 【临时】发布前随机等待 " + result2 + " 秒，请核对标题/描述/素材…", "warn");
      const value2 = Date.now() + result2 * 1000;
      while (Date.now() < value2) {
        if (arg1.stopRequested) {
          throw new Error("stopped");
        }
        await sleep(Math.min(1000, value2 - Date.now()));
      }
    }
    fn3(value, "[" + (arg2.accountName || result) + "] 点击发布…");
    const result6 = await fn9(result2, getClickPublishScript());
    if (!result6?.ok) {
      throw new Error("未找到发布按钮：" + (result6?.reason || "unknown"));
    }
    const result7 = await fn17(arg1, async () => {
      const result = await fn9(result2, getPublishResultScript());
      if (result?.ok === true) {
        return result;
      }
      if (result?.ok === false) {
        throw new Error(result.message || "发布失败");
      }
      return null;
    }, {
      timeoutMs: PUBLISH_WAIT_MS,
      intervalMs: 2000,
      label: "publish_confirm"
    });
    fn3(value, "[" + (arg2.accountName || result) + "] 发布成功（" + (result7.kind || "ok") + "）", "success");
    return true;
  }
  async function fn19(arg1, arg2, arg3, arg4) {
    const {
      taskId: taskId,
      tasksApi: tasksApi,
      accountsById: accountsById
    } = arg1;
    const local = accountsById.get(String(arg2.accountId)) || {};
    tasksApi?.updateItem?.(taskId, arg2.id, {
      status: "publishing",
      error: ""
    });
    fn2(taskId, {
      type: "item-progress",
      itemId: arg2.id,
      status: "publishing",
      index: arg3,
      total: arg4
    });
    try {
      await fn18(arg1, arg2, local);
      tasksApi?.updateItem?.(taskId, arg2.id, {
        status: "published",
        publishedAt: Date.now(),
        error: ""
      });
      fn2(taskId, {
        type: "item-progress",
        itemId: arg2.id,
        status: "published",
        index: arg3,
        total: arg4
      });
      return {
        ok: true,
        itemId: arg2.id
      };
    } catch (error) {
      const local = error?.message || String(error);
      if (local === "stopped") {
        tasksApi?.updateItem?.(taskId, arg2.id, {
          status: "ready",
          error: ""
        });
        return {
          ok: false,
          stopped: true,
          itemId: arg2.id
        };
      }
      fn3(taskId, "[" + (arg2.accountName || arg2.accountId) + "] 失败：" + local, "error");
      tasksApi?.updateItem?.(taskId, arg2.id, {
        status: "failed",
        error: local
      });
      fn2(taskId, {
        type: "item-progress",
        itemId: arg2.id,
        status: "failed",
        error: local,
        index: arg3,
        total: arg4
      });
      return {
        ok: false,
        itemId: arg2.id,
        error: local
      };
    }
  }
  async function fn20(arg1) {
    const {
      taskId: taskId,
      tasksApi: tasksApi
    } = arg1;
    const result = (arg1.items || []).filter(arg1 => ["ready", "queued", "failed", "draft"].includes(arg1.status) && arg1.accountId && arg1.media?.filePath);
    if (!result.length) {
      fn3(taskId, "没有可发布的条目（需账号+素材+文案）", "warn");
      arg1.status = "done";
      tasksApi?.saveTask?.({
        ...arg1.taskRecord,
        status: "done",
        updatedAt: Date.now()
      });
      return;
    }
    const value = result.length;
    const value2 = arg1.publishMode === "parallel";
    if (value2) {
      fn3(taskId, "同时发布模式：并行处理 " + value + " 条");
      await Promise.all(result.map((arg12, arg2) => fn19(arg1, arg12, arg2, value)));
    } else {
      const result2 = Math.max(0, Number(arg1.staggerMinSec) || 0);
      const result3 = Math.max(result2, Number(arg1.staggerMaxSec) || result2);
      fn3(taskId, "间隔发布模式：每条间隔随机 " + result2 + "–" + result3 + " 秒");
      for (let num = 0; num < result.length; num += 1) {
        if (arg1.stopRequested) {
          break;
        }
        const result4 = await fn19(arg1, result[num], num, value);
        if (result4?.stopped || arg1.stopRequested) {
          break;
        }
        if (num < result.length - 1) {
          const result = randomBetween(result2, result3);
          if (result > 0) {
            fn3(taskId, "随机等待 " + result + " 秒后发布下一条…");
            const value = Date.now() + result * 1000;
            while (Date.now() < value) {
              if (arg1.stopRequested) {
                break;
              }
              await sleep(Math.min(2000, value - Date.now()));
            }
          } else {
            fn3(taskId, "间隔为 0，立即发布下一条");
          }
        }
      }
    }
    const local = tasksApi?.getTask?.(taskId) || arg1.taskRecord;
    const local2 = local?.items || [];
    const local3 = local2.length && local2.every(arg1 => arg1.status === "published" || arg1.status === "failed");
    const value3 = arg1.stopRequested ? "stopped" : local3 ? "done" : "ready";
    tasksApi?.saveTask?.({
      ...local,
      status: value3,
      updatedAt: Date.now(),
      endedAt: Date.now(),
      endReason: arg1.stopRequested ? "manual_stop" : "finished"
    });
    fn3(taskId, arg1.stopRequested ? "任务已停止" : "任务结束", arg1.stopRequested ? "warn" : "info");
    fn2(taskId, {
      type: "task-finished",
      status: value3
    });
  }
  function startTask(arg1, list = [], arg3) {
    const result = String(arg1?.id || "");
    if (!result) {
      return false;
    }
    if (map.has(result)) {
      return false;
    }
    const value = Array.isArray(list) ? list : [];
    const map2 = new Map(value.map(arg1 => [String(arg1.id), arg1]));
    const value2 = Array.isArray(arg1.items) ? arg1.items : [];
    const list2 = [...new Set(value2.map(arg1 => String(arg1.accountId || "")).filter(Boolean))];
    const result2 = Math.max(0, Number(arg1.staggerMinSec) || 0);
    const result3 = Math.max(result2, Number(arg1.staggerMaxSec) || result2);
    const result4 = Date.now();
    const obj = {
      taskId: result,
      generation: result4,
      stopRequested: false,
      taskRecord: arg1,
      items: value2,
      accountIds: list2,
      accountsById: map2,
      tasksApi: arg3,
      publishMode: arg1.publishMode === "parallel" ? "parallel" : "interval",
      staggerMinSec: result2,
      staggerMaxSec: result3,
      status: "running"
    };
    acquireTaskRuntimeGuard(local2(result), {
      taskId: result,
      kind: "work_publish",
      accountIds: list2
    });
    map.set(result, obj);
    clearTaskLogs(result);
    fn3(result, "开始发布任务，共 " + value2.length + " 项");
    arg3?.saveTask?.({
      ...arg1,
      status: "running",
      updatedAt: Date.now(),
      startedAt: Date.now()
    });
    (async () => {
      try {
        await fn20(obj);
      } catch (error) {
        fn3(result, "任务异常：" + (error.message || error), "error");
        arg3?.saveTask?.({
          ...arg1,
          status: "stopped",
          updatedAt: Date.now(),
          endReason: "error"
        });
        fn2(result, {
          type: "task-finished",
          status: "stopped",
          error: error.message
        });
      } finally {
        map.delete(result);
        releaseTaskRuntimeGuard(local2(result));
        fn15(new Set());
      }
    })();
    return true;
  }
  function stopTask(arg1) {
    const result = map.get(String(arg1));
    if (!result) {
      return false;
    }
    result.stopRequested = true;
    fn3(arg1, "正在停止…", "warn");
    return true;
  }
  function stopAll() {
    for (const item of [...map.keys()]) {
      stopTask(item);
    }
  }
  function showMonitorWindow(arg1) {
    const result = map2.get(String(arg1));
    if (!result || result.isDestroyed()) {
      return false;
    }
    return showHiddenAutomationWindow(result, {
      title: "作品发布监控 · " + arg1,
      width: 1200,
      height: 860
    });
  }
  function hideMonitorWindow(arg1) {
    const result = map2.get(String(arg1));
    if (!result || result.isDestroyed()) {
      return false;
    }
    return hideVisibleAutomationWindow(result);
  }
  return {
    startTask: startTask,
    stopTask: stopTask,
    stopAll: stopAll,
    isTaskRunning: isTaskRunning,
    listRunningTaskIds: listRunningTaskIds,
    listWebContents: listWebContents,
    getTaskLogs: getTaskLogs,
    clearTaskLogs: clearTaskLogs,
    showMonitorWindow: showMonitorWindow,
    hideMonitorWindow: hideMonitorWindow
  };
}
module.exports = {
  createWorkPublishRunner: createWorkPublishRunner
};
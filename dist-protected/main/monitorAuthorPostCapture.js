'use strict';

const {
  isAuthorPostApiUrlForSecUid,
  extractAuthorPostWorksFromResponse
} = require("../shared/monitorAuthorPostApi");
const ATTACH_TIMEOUT_MS = 1500;
function withTimeout(arg1, arg2, text = "timeout") {
  let local = null;
  return Promise.race([Promise.resolve(arg1), new Promise((arg1, arg22) => {
    local = setTimeout(() => arg22(new Error(text)), arg2);
  })]).finally(() => {
    if (local) {
      clearTimeout(local);
    }
  });
}
function createMonitorAuthorPostCapture(arg1) {
  const obj = {
    attached: false,
    attachedHere: false,
    attaching: null,
    pendingRequests: new Map(),
    works: [],
    worksCount: null,
    authorName: "",
    secUid: "",
    hasPostListPayload: false,
    maxWorks: 6,
    filterPinned: false
  };
  const local = async (arg12, arg2, options = {}) => {
    if (arg2 === "Network.responseReceived") {
      const local = options.response?.url || "";
      if (isAuthorPostApiUrlForSecUid(local, obj.secUid)) {
        obj.pendingRequests.set(options.requestId, local);
      }
      return;
    }
    if (arg2 === "Network.loadingFailed") {
      obj.pendingRequests.delete(options.requestId);
      return;
    }
    if (arg2 !== "Network.loadingFinished") {
      return;
    }
    const result = obj.pendingRequests.get(options.requestId);
    if (!result) {
      return;
    }
    obj.pendingRequests.delete(options.requestId);
    try {
      const result = await withTimeout(arg1.webContents.debugger.sendCommand("Network.getResponseBody", {
        requestId: options.requestId
      }), 1200, "getResponseBody timeout");
      const value = result?.base64Encoded ? Buffer.from(result.body || "", "base64").toString("utf8") : String(result?.body || "");
      if (!value || value[0] !== "{" && value[0] !== "[") {
        return;
      }
      const result2 = JSON.parse(value);
      const result3 = extractAuthorPostWorksFromResponse(result2, {
        maxWorks: obj.maxWorks,
        authorName: obj.authorName,
        expectedSecUid: obj.secUid,
        filterPinned: obj.filterPinned
      });
      if (result3.hasPostListPayload) {
        obj.hasPostListPayload = true;
      }
      if (result3.worksCount != null && obj.worksCount == null) {
        obj.worksCount = result3.worksCount;
      }
      if (result3.authorName && !obj.authorName) {
        obj.authorName = result3.authorName;
      }
      for (const item of result3.works) {
        if (obj.works.length >= obj.maxWorks) {
          break;
        }
        if (obj.works.some(arg1 => arg1.awemeId === item.awemeId)) {
          continue;
        }
        obj.works.push(item);
      }
    } catch (error) {}
  };
  async function attach() {
    if (obj.attached || !arg1 || arg1.isDestroyed?.()) {
      return obj.attached;
    }
    if (obj.attaching) {
      return obj.attaching;
    }
    obj.attaching = (async () => {
      let flag = false;
      try {
        await withTimeout((async () => {
          if (!arg1.webContents.debugger.isAttached()) {
            arg1.webContents.debugger.attach("1.3");
            flag = true;
          }
          arg1.webContents.debugger.removeListener("message", local);
          arg1.webContents.debugger.on("message", local);
          await arg1.webContents.debugger.sendCommand("Network.enable", {
            maxTotalBufferSize: 20971520,
            maxResourceBufferSize: 5242880
          });
        })(), ATTACH_TIMEOUT_MS, "debugger attach timeout");
        obj.attached = true;
        obj.attachedHere = obj.attachedHere || flag;
      } catch (error) {
        obj.attached = false;
        try {
          if (flag && arg1 && !arg1.isDestroyed?.() && arg1.webContents.debugger.isAttached()) {
            arg1.webContents.debugger.detach();
          }
        } catch (error) {}
        obj.attachedHere = false;
      } finally {
        obj.attaching = null;
      }
      return obj.attached;
    })();
    return obj.attaching;
  }
  async function begin({
    maxWorks = 6,
    authorName = "",
    secUid = "",
    filterPinned = false
  } = {}) {
    obj.maxWorks = Math.max(1, Math.min(100, Math.floor(Number(maxWorks) || 6)));
    obj.authorName = String(authorName || "").trim();
    obj.secUid = String(secUid || "").trim();
    obj.filterPinned = filterPinned === true;
    obj.pendingRequests.clear();
    obj.works = [];
    obj.worksCount = null;
    obj.hasPostListPayload = false;
    try {
      await attach();
    } catch (error) {}
    return obj.attached;
  }
  function takeWorks() {
    const obj2 = {
      works: [...obj.works],
      worksCount: obj.worksCount,
      authorName: obj.authorName,
      secUid: obj.secUid,
      hasPostListPayload: obj.hasPostListPayload,
      source: "author_post_api"
    };
    return obj2;
  }
  async function waitForWorks({
    timeoutMs = 12000,
    isActive = () => true
  } = {}) {
    const value = Date.now() + Math.max(1000, Number(timeoutMs) || 12000);
    while (Date.now() < value && isActive()) {
      if (obj.hasPostListPayload) {
        return takeWorks();
      }
      if (obj.works.length > 0) {
        return takeWorks();
      }
      await new Promise(arg1 => setTimeout(arg1, 200));
    }
    return takeWorks();
  }
  function detachIfOwned() {
    if (!arg1 || arg1.isDestroyed?.()) {
      obj.attached = false;
      obj.attachedHere = false;
      return;
    }
    try {
      arg1.webContents.debugger.removeListener("message", local);
    } catch (error) {}
    if (obj.attachedHere) {
      try {
        if (arg1.webContents.debugger.isAttached()) {
          arg1.webContents.debugger.detach();
        }
      } catch (error) {}
      obj.attachedHere = false;
    }
    obj.attached = false;
  }
  function dispose() {
    obj.pendingRequests.clear();
    obj.works = [];
    obj.attaching = null;
    detachIfOwned();
  }
  return {
    attach: attach,
    begin: begin,
    takeWorks: takeWorks,
    waitForWorks: waitForWorks,
    detachIfOwned: detachIfOwned,
    dispose: dispose,
    isAttached: () => obj.attached
  };
}
module.exports = {
  createMonitorAuthorPostCapture: createMonitorAuthorPostCapture
};
'use strict';

const {
  isAuthorPostApiUrlForSecUid,
  extractAuthorPostWorksFromResponse
} = require("../shared/monitorAuthorPostApi");
const ATTACH_TIMEOUT_MS = 1500;
function withTimeout(_0x1104fb, _0x5dce19, _0x4c73b9 = "timeout") {
  let _0x3369b8 = null;
  return Promise.race([Promise.resolve(_0x1104fb), new Promise((_0x2924f0, _0x74f401) => {
    _0x3369b8 = setTimeout(() => _0x74f401(new Error(_0x4c73b9)), _0x5dce19);
  })]).finally(() => {
    if (_0x3369b8) {
      clearTimeout(_0x3369b8);
    }
  });
}
function createMonitorAuthorPostCapture(_0xdaab21) {
  const _0x44ef4d = {
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
  const _0x2bf225 = async (_0x14d24e, _0x3cacae, _0x4ce1a5 = {}) => {
    if (_0x3cacae === "Network.responseReceived") {
      const _0x352bb7 = _0x4ce1a5.response?.url || "";
      if (isAuthorPostApiUrlForSecUid(_0x352bb7, _0x44ef4d.secUid)) {
        _0x44ef4d.pendingRequests.set(_0x4ce1a5.requestId, _0x352bb7);
      }
      return;
    }
    if (_0x3cacae === "Network.loadingFailed") {
      _0x44ef4d.pendingRequests.delete(_0x4ce1a5.requestId);
      return;
    }
    if (_0x3cacae !== "Network.loadingFinished") {
      return;
    }
    const _0x145a7b = _0x44ef4d.pendingRequests.get(_0x4ce1a5.requestId);
    if (!_0x145a7b) {
      return;
    }
    _0x44ef4d.pendingRequests.delete(_0x4ce1a5.requestId);
    try {
      const _0x1aa9cd = await withTimeout(_0xdaab21.webContents.debugger.sendCommand("Network.getResponseBody", {
        requestId: _0x4ce1a5.requestId
      }), 1200, "getResponseBody timeout");
      const _0x4efc43 = _0x1aa9cd?.base64Encoded ? Buffer.from(_0x1aa9cd.body || "", "base64").toString("utf8") : String(_0x1aa9cd?.body || "");
      if (!_0x4efc43 || _0x4efc43[0] !== "{" && _0x4efc43[0] !== "[") {
        return;
      }
      const _0x120a56 = JSON.parse(_0x4efc43);
      const _0x4fd612 = extractAuthorPostWorksFromResponse(_0x120a56, {
        maxWorks: _0x44ef4d.maxWorks,
        authorName: _0x44ef4d.authorName,
        expectedSecUid: _0x44ef4d.secUid,
        filterPinned: _0x44ef4d.filterPinned
      });
      if (_0x4fd612.hasPostListPayload) {
        _0x44ef4d.hasPostListPayload = true;
      }
      if (_0x4fd612.worksCount != null && _0x44ef4d.worksCount == null) {
        _0x44ef4d.worksCount = _0x4fd612.worksCount;
      }
      if (_0x4fd612.authorName && !_0x44ef4d.authorName) {
        _0x44ef4d.authorName = _0x4fd612.authorName;
      }
      for (const _0x2408ef of _0x4fd612.works) {
        if (_0x44ef4d.works.length >= _0x44ef4d.maxWorks) {
          break;
        }
        if (_0x44ef4d.works.some(_0x17374d => _0x17374d.awemeId === _0x2408ef.awemeId)) {
          continue;
        }
        _0x44ef4d.works.push(_0x2408ef);
      }
    } catch (_0x3fc02e) {}
  };
  async function _0x512336() {
    if (_0x44ef4d.attached || !_0xdaab21 || _0xdaab21.isDestroyed?.()) {
      return _0x44ef4d.attached;
    }
    if (_0x44ef4d.attaching) {
      return _0x44ef4d.attaching;
    }
    _0x44ef4d.attaching = (async () => {
      let _0x3e50d1 = false;
      try {
        await withTimeout((async () => {
          if (!_0xdaab21.webContents.debugger.isAttached()) {
            _0xdaab21.webContents.debugger.attach("1.3");
            _0x3e50d1 = true;
          }
          _0xdaab21.webContents.debugger.removeListener("message", _0x2bf225);
          _0xdaab21.webContents.debugger.on("message", _0x2bf225);
          await _0xdaab21.webContents.debugger.sendCommand("Network.enable", {
            maxTotalBufferSize: 20971520,
            maxResourceBufferSize: 5242880
          });
        })(), ATTACH_TIMEOUT_MS, "debugger attach timeout");
        _0x44ef4d.attached = true;
        _0x44ef4d.attachedHere = _0x44ef4d.attachedHere || _0x3e50d1;
      } catch (_0x34f6e6) {
        _0x44ef4d.attached = false;
        try {
          if (_0x3e50d1 && _0xdaab21 && !_0xdaab21.isDestroyed?.() && _0xdaab21.webContents.debugger.isAttached()) {
            _0xdaab21.webContents.debugger.detach();
          }
        } catch (_0x49d7b0) {}
        _0x44ef4d.attachedHere = false;
      } finally {
        _0x44ef4d.attaching = null;
      }
      return _0x44ef4d.attached;
    })();
    return _0x44ef4d.attaching;
  }
  async function _0x140513({
    maxWorks = 6,
    authorName = "",
    secUid = "",
    filterPinned = false
  } = {}) {
    _0x44ef4d.maxWorks = Math.max(1, Math.min(100, Math.floor(Number(maxWorks) || 6)));
    _0x44ef4d.authorName = String(authorName || "").trim();
    _0x44ef4d.secUid = String(secUid || "").trim();
    _0x44ef4d.filterPinned = filterPinned === true;
    _0x44ef4d.pendingRequests.clear();
    _0x44ef4d.works = [];
    _0x44ef4d.worksCount = null;
    _0x44ef4d.hasPostListPayload = false;
    try {
      await _0x512336();
    } catch (_0x340ff3) {}
    return _0x44ef4d.attached;
  }
  function _0x22e6a8() {
    const _0x32c331 = {
      works: [..._0x44ef4d.works],
      worksCount: _0x44ef4d.worksCount,
      authorName: _0x44ef4d.authorName,
      secUid: _0x44ef4d.secUid,
      hasPostListPayload: _0x44ef4d.hasPostListPayload,
      source: "author_post_api"
    };
    return _0x32c331;
  }
  async function _0xc4da68({
    timeoutMs = 12000,
    isActive = () => true
  } = {}) {
    const _0x3a091b = Date.now() + Math.max(1000, Number(timeoutMs) || 12000);
    while (Date.now() < _0x3a091b && isActive()) {
      if (_0x44ef4d.hasPostListPayload) {
        return _0x22e6a8();
      }
      if (_0x44ef4d.works.length > 0) {
        return _0x22e6a8();
      }
      await new Promise(_0x12bd5f => setTimeout(_0x12bd5f, 200));
    }
    return _0x22e6a8();
  }
  function _0x408c25() {
    if (!_0xdaab21 || _0xdaab21.isDestroyed?.()) {
      _0x44ef4d.attached = false;
      _0x44ef4d.attachedHere = false;
      return;
    }
    try {
      _0xdaab21.webContents.debugger.removeListener("message", _0x2bf225);
    } catch (_0x359003) {}
    if (_0x44ef4d.attachedHere) {
      try {
        if (_0xdaab21.webContents.debugger.isAttached()) {
          _0xdaab21.webContents.debugger.detach();
        }
      } catch (_0x40763c) {}
      _0x44ef4d.attachedHere = false;
    }
    _0x44ef4d.attached = false;
  }
  function _0x5d204e() {
    _0x44ef4d.pendingRequests.clear();
    _0x44ef4d.works = [];
    _0x44ef4d.attaching = null;
    _0x408c25();
  }
  return {
    attach: _0x512336,
    begin: _0x140513,
    takeWorks: _0x22e6a8,
    waitForWorks: _0xc4da68,
    detachIfOwned: _0x408c25,
    dispose: _0x5d204e,
    isAttached: () => _0x44ef4d.attached
  };
}
module.exports = {
  createMonitorAuthorPostCapture: createMonitorAuthorPostCapture
};
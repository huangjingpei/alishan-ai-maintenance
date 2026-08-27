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
function sleep(_0x1a6916) {
  return new Promise(_0x574805 => setTimeout(_0x574805, _0x1a6916));
}
function randomBetween(_0x59797f, _0x169c5a) {
  const _0x32e257 = Math.min(_0x59797f, _0x169c5a);
  const _0x4933ed = Math.max(_0x59797f, _0x169c5a);
  return _0x32e257 + Math.floor(Math.random() * (_0x4933ed - _0x32e257 + 1));
}
function createWorkPublishRunner(_0x2c52be) {
  const {
    app: _0x57bf9b,
    store: _0x51ee9c,
    fs: _0x1185c3,
    runtimeConfig = null,
    applyAccountProxy: _0x1e3c68,
    configureAutomationSession: _0x2f4918,
    applyPackagedWindowMenuPolicy: _0x4e8db6,
    attachProtocolGuard: _0x3f8467
  } = _0x2c52be;
  async function _0x44d2ef(_0x1e11c7) {
    if (!runtimeConfig || !_0x1e11c7 || _0x1e11c7.isDestroyed?.()) {
      return;
    }
    try {
      if (typeof runtimeConfig.ensureFetched === "function") {
        await runtimeConfig.ensureFetched();
      }
      runtimeConfig.pushToWebContents?.(_0x1e11c7);
    } catch (_0xda7e73) {
      console.warn("[WorkPublish] runtime config push failed:", _0xda7e73?.message || _0xda7e73);
    }
  }
  const _0x25346b = () => {
    if (typeof _0x2c52be.getMainWindow === "function") {
      return _0x2c52be.getMainWindow();
    }
    return _0x2c52be.mainWindow || null;
  };
  const _0x34d8bc = new Map();
  const _0x344ba2 = new Map();
  const _0x3086e4 = new Map();
  const _0xf53b13 = _0x509e72 => "work-publish:" + _0x509e72;
  function _0x4c5a05(_0x5d91d4, _0x2f9ad9) {
    try {
      const _0x3f1a6d = _0x25346b();
      if (_0x3f1a6d && !_0x3f1a6d.isDestroyed() && !_0x3f1a6d.webContents?.isDestroyed?.()) {
        _0x3f1a6d.webContents.send("work-publish-task-event", {
          taskId: _0x5d91d4,
          ..._0x2f9ad9
        });
      }
    } catch (_0x33af45) {}
  }
  function _0x492188(_0x337aab, _0x40353f, _0xa12fb0 = "info") {
    if (!_0x337aab || !_0x40353f) {
      return;
    }
    const _0x18410f = {
      taskId: _0x337aab,
      type: "log",
      message: _0x40353f,
      level: _0xa12fb0,
      ts: Date.now()
    };
    if (!_0x3086e4.has(_0x337aab) && _0x3086e4.size >= RUNTIME_LOG_TASK_LIMIT) {
      const _0x3f150b = [..._0x3086e4.keys()].find(_0x576443 => !_0x34d8bc.has(_0x576443)) || _0x3086e4.keys().next().value;
      if (_0x3f150b != null) {
        _0x3086e4.delete(_0x3f150b);
      }
    }
    const _0x1f5502 = _0x3086e4.get(_0x337aab) || [];
    _0x1f5502.push(_0x18410f);
    if (_0x1f5502.length > RUNTIME_LOG_LIMIT) {
      _0x1f5502.splice(0, _0x1f5502.length - RUNTIME_LOG_LIMIT);
    }
    _0x3086e4.set(_0x337aab, _0x1f5502);
    _0x4c5a05(_0x337aab, _0x18410f);
  }
  function _0x5fe83d(_0x33861c = null) {
    if (_0x33861c != null && _0x33861c !== "") {
      return (_0x3086e4.get(_0x33861c) || []).map(_0x56f494 => ({
        ..._0x56f494
      }));
    }
    const _0xd126e9 = {};
    for (const [_0x2cfbe5, _0x2d4955] of _0x3086e4.entries()) {
      _0xd126e9[_0x2cfbe5] = _0x2d4955.map(_0x49542a => ({
        ..._0x49542a
      }));
    }
    return _0xd126e9;
  }
  function _0x26a1c2(_0x5f2718 = null) {
    if (_0x5f2718 != null && _0x5f2718 !== "") {
      return _0x3086e4.delete(_0x5f2718);
    }
    _0x3086e4.clear();
    return true;
  }
  function _0x162577() {
    return [..._0x34d8bc.keys()];
  }
  function _0x390916(_0x13aa6c) {
    return _0x34d8bc.has(String(_0x13aa6c));
  }
  function _0xd5f6d() {
    let _0x1bc847 = path.join(__dirname, "..", "automation-preload.js");
    if (_0x57bf9b.isPackaged) {
      const _0x3682ab = _0x51ee9c.get("latest_resource_path");
      if (_0x3682ab && _0x1185c3.existsSync(path.join(_0x3682ab, "automation-preload.js"))) {
        _0x1bc847 = path.join(_0x3682ab, "automation-preload.js");
      }
    }
    return _0x1bc847;
  }
  async function _0x16b4ea(_0xaef10, _0x401111) {
    if (!_0xaef10 || _0xaef10.isDestroyed() || _0xaef10.webContents.isDestroyed()) {
      throw new Error("window_destroyed");
    }
    return _0xaef10.webContents.executeJavaScript(_0x401111, true);
  }
  async function _0x2a618e(_0x1d66bd, _0x4d9547, _0x5b4ab2 = NAVIGATION_TIMEOUT_MS) {
    if (!_0x1d66bd || _0x1d66bd.isDestroyed()) {
      throw new Error("window_destroyed");
    }
    await Promise.race([_0x1d66bd.loadURL(_0x4d9547), sleep(_0x5b4ab2).then(() => {
      throw new Error("navigation_timeout");
    })]);
    await sleep(1800);
  }
  async function _0x8ea7aa(_0x12288d, _0x55f983) {
    const _0x58e6bb = "douyin_" + _0x12288d;
    const _0x42f821 = "persist:automation:" + _0x58e6bb;
    const _0x554af8 = _0x25346b();
    const _0x25e54e = new BrowserWindow({
      parent: _0x554af8 && !_0x554af8.isDestroyed() ? _0x554af8 : undefined,
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
        partition: _0x42f821,
        backgroundThrottling: false,
        contextIsolation: true,
        sandbox: false,
        preload: _0xd5f6d(),
        spellcheck: false
      },
      autoHideMenuBar: true
    });
    _0x25e54e.__radarWorkPublishAccountId = String(_0x12288d);
    _0x25e54e.__radarAllowVisibleMonitor = false;
    applyHiddenAutomationWindowPolicy(_0x25e54e, {
      parent: _0x554af8
    });
    if (typeof _0x4e8db6 === "function") {
      _0x4e8db6(_0x25e54e);
    }
    if (typeof _0x3f8467 === "function") {
      _0x3f8467(_0x25e54e.webContents, "work-publish:" + _0x58e6bb);
    }
    try {
      if (typeof _0x2f4918 === "function") {
        _0x2f4918(_0x25e54e.webContents.session, _0x58e6bb);
      }
    } catch (_0x586ac1) {}
    try {
      if (typeof _0x1e3c68 === "function" && _0x55f983) {
        await _0x1e3c68(_0x25e54e.webContents.session, _0x55f983, _0x58e6bb);
      }
    } catch (_0x465bfa) {
      console.warn("[WorkPublish] apply proxy failed:", _0x465bfa.message);
    }
    ensureHiddenWindowStaysHidden(_0x25e54e);
    _0x25e54e.webContents.on("dom-ready", () => {
      runtimeConfig?.ensureAndPushToWebContents?.(_0x25e54e.webContents);
    });
    _0x25e54e.on("closed", () => {
      if (_0x344ba2.get(String(_0x12288d)) === _0x25e54e) {
        _0x344ba2.delete(String(_0x12288d));
      }
    });
    _0x344ba2.set(String(_0x12288d), _0x25e54e);
    await _0x44d2ef(_0x25e54e.webContents);
    return _0x25e54e;
  }
  async function _0x181922(_0x4a2d0c, _0x1bfbc9 = {}) {
    const _0x3ceab0 = String(_0x4a2d0c);
    let _0x53844e = _0x344ba2.get(_0x3ceab0);
    if (_0x53844e && !_0x53844e.isDestroyed()) {
      return _0x53844e;
    }
    return _0x8ea7aa(_0x3ceab0, _0x1bfbc9.proxy || null);
  }
  function _0x4a9e5c() {
    return [..._0x344ba2.values()].filter(_0xb15885 => _0xb15885 && !_0xb15885.isDestroyed()).map(_0x38ebf8 => _0x38ebf8.webContents).filter(_0x3abd52 => _0x3abd52 && !_0x3abd52.isDestroyed?.());
  }
  function _0x59b948(_0x5f1c6f) {
    const _0x2965db = String(_0x5f1c6f);
    const _0x1dc0c9 = _0x344ba2.get(_0x2965db);
    if (!_0x1dc0c9) {
      return;
    }
    _0x344ba2.delete(_0x2965db);
    try {
      if (!_0x1dc0c9.isDestroyed()) {
        _0x1dc0c9.destroy();
      }
    } catch (_0x523502) {}
  }
  function _0x541cf0(_0x1fa897 = new Set()) {
    for (const [_0x81766b] of _0x344ba2.entries()) {
      if (_0x1fa897.has(String(_0x81766b))) {
        continue;
      }
      const _0x1aaf58 = [..._0x34d8bc.values()].some(_0x45febc => (_0x45febc.accountIds || []).includes(String(_0x81766b)));
      if (!_0x1aaf58) {
        _0x59b948(_0x81766b);
      }
    }
  }
  async function _0x5280a4(_0x56eeba, _0x77c8c1 = []) {
    const _0x5817f0 = (Array.isArray(_0x77c8c1) ? _0x77c8c1 : [_0x77c8c1]).map(_0x31d350 => path.resolve(String(_0x31d350 || ""))).filter(_0x1de5bc => _0x1de5bc && _0x1185c3.existsSync(_0x1de5bc));
    if (!_0x5817f0.length) {
      return {
        ok: false,
        error: "file_not_found"
      };
    }
    if (!_0x56eeba || _0x56eeba.isDestroyed()) {
      return {
        ok: false,
        error: "no_webcontents"
      };
    }
    const _0x4f0b49 = _0x56eeba.debugger;
    let _0x5027e3 = false;
    try {
      if (!_0x4f0b49.isAttached()) {
        _0x4f0b49.attach("1.3");
        _0x5027e3 = true;
      }
      const {
        root: _0x2ca7a5
      } = await _0x4f0b49.sendCommand("DOM.getDocument", {
        depth: -1,
        pierce: true
      });
      const _0x48b97c = ["input[type=\"file\"][accept*=\"video\"]", "input[type=\"file\"][accept*=\"image\"]", "input[type=\"file\"][accept*=\"*\"]", "input[type=\"file\"]"];
      let _0x1469c2 = null;
      let _0x291c9e = "";
      for (const _0x4d9ed8 of _0x48b97c) {
        try {
          const _0x5b6377 = await _0x4f0b49.sendCommand("DOM.querySelector", {
            nodeId: _0x2ca7a5.nodeId,
            selector: _0x4d9ed8
          });
          if (_0x5b6377?.nodeId) {
            _0x1469c2 = _0x5b6377.nodeId;
            _0x291c9e = _0x4d9ed8;
            break;
          }
        } catch (_0x18ee5d) {}
      }
      if (!_0x1469c2) {
        return {
          ok: false,
          error: "no_file_input"
        };
      }
      await _0x4f0b49.sendCommand("DOM.setFileInputFiles", {
        nodeId: _0x1469c2,
        files: _0x5817f0
      });
      return {
        ok: true,
        method: "cdp",
        selector: _0x291c9e,
        count: _0x5817f0.length
      };
    } catch (_0x3fccfe) {
      return {
        ok: false,
        error: _0x3fccfe.message || String(_0x3fccfe)
      };
    } finally {
      if (_0x5027e3) {
        try {
          _0x4f0b49.detach();
        } catch (_0x4a3dff) {}
      }
    }
  }
  async function _0xf431e2(_0x23de43, _0x5d03b1, {
    timeoutMs: _0x3af66d,
    intervalMs = 1500,
    label = "wait"
  } = {}) {
    const _0x4618c2 = Date.now();
    while (Date.now() - _0x4618c2 < _0x3af66d) {
      if (_0x23de43.stopRequested) {
        throw new Error("stopped");
      }
      const _0x44bf5d = await _0x5d03b1();
      if (_0x44bf5d) {
        return _0x44bf5d;
      }
      await sleep(intervalMs);
    }
    throw new Error(label + "_timeout");
  }
  async function _0x2ff8e0(_0x1a51ab, _0x5599d0, _0x25afa3) {
    const _0x1fc763 = _0x1a51ab.taskId;
    const _0x484ec8 = String(_0x5599d0.accountId || "");
    const _0x45243f = _0x5599d0.media?.filePath || "";
    if (!_0x484ec8) {
      throw new Error("缺少账号");
    }
    if (!_0x45243f || !_0x1185c3.existsSync(_0x45243f)) {
      throw new Error("素材文件不存在");
    }
    if (_0x5599d0.media?.type === "image") {
      throw new Error("暂不支持图文，请使用视频素材");
    }
    const _0x48ea33 = new Set([".mp4", ".mov", ".m4v", ".avi", ".mkv"]);
    if (!_0x48ea33.has(path.extname(_0x45243f).toLowerCase())) {
      throw new Error("暂不支持图文，请使用视频素材");
    }
    _0x492188(_0x1fc763, "[" + (_0x5599d0.accountName || _0x484ec8) + "] 打开创作者上传页…");
    const _0x18efd2 = await _0x181922(_0x484ec8, _0x25afa3);
    ensureHiddenWindowStaysHidden(_0x18efd2);
    await _0x2a618e(_0x18efd2, CREATOR_UPLOAD_URL);
    try {
      await _0x16b4ea(_0x18efd2, getDismissDialogScript());
    } catch (_0x3b7e67) {}
    await sleep(800);
    let _0x3743cf = await _0x16b4ea(_0x18efd2, getPageProbeScript());
    if (_0x3743cf?.hasLogin) {
      throw new Error("账号未登录创作者中心，请先在账号池登录该抖音号");
    }
    if (!_0x3743cf?.fileInputCount) {
      try {
        await _0x16b4ea(_0x18efd2, "(() => {\n          const nodes = Array.from(document.querySelectorAll('button, [role=\"button\"], div, span'));\n          for (const el of nodes) {\n            const t = (el.innerText || el.textContent || '').trim();\n            if (/上传视频|上传/.test(t) && t.length <= 8 && !/图文/.test(t)) { el.click(); return true; }\n          }\n          return false;\n        })()");
        await sleep(1200);
        _0x3743cf = await _0x16b4ea(_0x18efd2, getPageProbeScript());
      } catch (_0x2cd275) {}
    }
    _0x492188(_0x1fc763, "[" + (_0x5599d0.accountName || _0x484ec8) + "] 注入素材文件…");
    const _0x2daf67 = await _0x5280a4(_0x18efd2.webContents, [_0x45243f]);
    if (!_0x2daf67.ok) {
      throw new Error("无法选择素材：" + (_0x2daf67.error || "unknown"));
    }
    _0x492188(_0x1fc763, "[" + (_0x5599d0.accountName || _0x484ec8) + "] 等待上传/解析完成…");
    await _0xf431e2(_0x1a51ab, async () => {
      try {
        await _0x16b4ea(_0x18efd2, getDismissDialogScript());
      } catch (_0x3a54c4) {}
      const _0x2de630 = await _0x16b4ea(_0x18efd2, getPageProbeScript());
      if (_0x2de630?.hasLogin) {
        throw new Error("登录态失效");
      }
      if (_0x2de630?.editReady || (_0x2de630?.publishBtns || []).some(_0x1d2b48 => _0x1d2b48.includes("发布"))) {
        return _0x2de630;
      }
      return null;
    }, {
      timeoutMs: UPLOAD_WAIT_MS,
      intervalMs: 2000,
      label: "upload_parse"
    });
    await sleep(1200);
    _0x492188(_0x1fc763, "[" + (_0x5599d0.accountName || _0x484ec8) + "] 填写标题与描述…");
    const _0x513841 = await _0x16b4ea(_0x18efd2, getFillTitleDescScript(_0x5599d0.title || "", _0x5599d0.description || ""));
    if (!_0x513841?.titleOk) {
      _0x492188(_0x1fc763, "[" + (_0x5599d0.accountName || _0x484ec8) + "] 标题填写可能失败，继续尝试发布", "warn");
    }
    await sleep(800);
    {
      const _0x288cbc = randomBetween(10, 30);
      _0x492188(_0x1fc763, "[" + (_0x5599d0.accountName || _0x484ec8) + "] 【临时】发布前随机等待 " + _0x288cbc + " 秒，请核对标题/描述/素材…", "warn");
      const _0x182d59 = Date.now() + _0x288cbc * 1000;
      while (Date.now() < _0x182d59) {
        if (_0x1a51ab.stopRequested) {
          throw new Error("stopped");
        }
        await sleep(Math.min(1000, _0x182d59 - Date.now()));
      }
    }
    _0x492188(_0x1fc763, "[" + (_0x5599d0.accountName || _0x484ec8) + "] 点击发布…");
    const _0x207ad3 = await _0x16b4ea(_0x18efd2, getClickPublishScript());
    if (!_0x207ad3?.ok) {
      throw new Error("未找到发布按钮：" + (_0x207ad3?.reason || "unknown"));
    }
    const _0x41b64c = await _0xf431e2(_0x1a51ab, async () => {
      const _0x1ba6d1 = await _0x16b4ea(_0x18efd2, getPublishResultScript());
      if (_0x1ba6d1?.ok === true) {
        return _0x1ba6d1;
      }
      if (_0x1ba6d1?.ok === false) {
        throw new Error(_0x1ba6d1.message || "发布失败");
      }
      return null;
    }, {
      timeoutMs: PUBLISH_WAIT_MS,
      intervalMs: 2000,
      label: "publish_confirm"
    });
    _0x492188(_0x1fc763, "[" + (_0x5599d0.accountName || _0x484ec8) + "] 发布成功（" + (_0x41b64c.kind || "ok") + "）", "success");
    return true;
  }
  async function _0x52143c(_0x27ea83, _0x4f6d84, _0x6d8308, _0x5be8c6) {
    const {
      taskId: _0x1e2e20,
      tasksApi: _0x5bfcd7,
      accountsById: _0x3e8cea
    } = _0x27ea83;
    const _0x5bdb16 = _0x3e8cea.get(String(_0x4f6d84.accountId)) || {};
    _0x5bfcd7?.updateItem?.(_0x1e2e20, _0x4f6d84.id, {
      status: "publishing",
      error: ""
    });
    _0x4c5a05(_0x1e2e20, {
      type: "item-progress",
      itemId: _0x4f6d84.id,
      status: "publishing",
      index: _0x6d8308,
      total: _0x5be8c6
    });
    try {
      await _0x2ff8e0(_0x27ea83, _0x4f6d84, _0x5bdb16);
      _0x5bfcd7?.updateItem?.(_0x1e2e20, _0x4f6d84.id, {
        status: "published",
        publishedAt: Date.now(),
        error: ""
      });
      _0x4c5a05(_0x1e2e20, {
        type: "item-progress",
        itemId: _0x4f6d84.id,
        status: "published",
        index: _0x6d8308,
        total: _0x5be8c6
      });
      return {
        ok: true,
        itemId: _0x4f6d84.id
      };
    } catch (_0x5711ed) {
      const _0x14791f = _0x5711ed?.message || String(_0x5711ed);
      if (_0x14791f === "stopped") {
        _0x5bfcd7?.updateItem?.(_0x1e2e20, _0x4f6d84.id, {
          status: "ready",
          error: ""
        });
        return {
          ok: false,
          stopped: true,
          itemId: _0x4f6d84.id
        };
      }
      _0x492188(_0x1e2e20, "[" + (_0x4f6d84.accountName || _0x4f6d84.accountId) + "] 失败：" + _0x14791f, "error");
      _0x5bfcd7?.updateItem?.(_0x1e2e20, _0x4f6d84.id, {
        status: "failed",
        error: _0x14791f
      });
      _0x4c5a05(_0x1e2e20, {
        type: "item-progress",
        itemId: _0x4f6d84.id,
        status: "failed",
        error: _0x14791f,
        index: _0x6d8308,
        total: _0x5be8c6
      });
      return {
        ok: false,
        itemId: _0x4f6d84.id,
        error: _0x14791f
      };
    }
  }
  async function _0x215135(_0x18bf2e) {
    const {
      taskId: _0xb79dbe,
      tasksApi: _0x3516d0
    } = _0x18bf2e;
    const _0x20eb9f = (_0x18bf2e.items || []).filter(_0x4f8d54 => ["ready", "queued", "failed", "draft"].includes(_0x4f8d54.status) && _0x4f8d54.accountId && _0x4f8d54.media?.filePath);
    if (!_0x20eb9f.length) {
      _0x492188(_0xb79dbe, "没有可发布的条目（需账号+素材+文案）", "warn");
      _0x18bf2e.status = "done";
      _0x3516d0?.saveTask?.({
        ..._0x18bf2e.taskRecord,
        status: "done",
        updatedAt: Date.now()
      });
      return;
    }
    const _0x2a3e69 = _0x20eb9f.length;
    const _0x3e78e9 = _0x18bf2e.publishMode === "parallel";
    if (_0x3e78e9) {
      _0x492188(_0xb79dbe, "同时发布模式：并行处理 " + _0x2a3e69 + " 条");
      await Promise.all(_0x20eb9f.map((_0x5e31fb, _0x30aabe) => _0x52143c(_0x18bf2e, _0x5e31fb, _0x30aabe, _0x2a3e69)));
    } else {
      const _0x4c9d6b = Math.max(0, Number(_0x18bf2e.staggerMinSec) || 0);
      const _0x48dc89 = Math.max(_0x4c9d6b, Number(_0x18bf2e.staggerMaxSec) || _0x4c9d6b);
      _0x492188(_0xb79dbe, "间隔发布模式：每条间隔随机 " + _0x4c9d6b + "–" + _0x48dc89 + " 秒");
      for (let _0x468aba = 0; _0x468aba < _0x20eb9f.length; _0x468aba += 1) {
        if (_0x18bf2e.stopRequested) {
          break;
        }
        const _0x3385fe = await _0x52143c(_0x18bf2e, _0x20eb9f[_0x468aba], _0x468aba, _0x2a3e69);
        if (_0x3385fe?.stopped || _0x18bf2e.stopRequested) {
          break;
        }
        if (_0x468aba < _0x20eb9f.length - 1) {
          const _0x1e4110 = randomBetween(_0x4c9d6b, _0x48dc89);
          if (_0x1e4110 > 0) {
            _0x492188(_0xb79dbe, "随机等待 " + _0x1e4110 + " 秒后发布下一条…");
            const _0x5b671a = Date.now() + _0x1e4110 * 1000;
            while (Date.now() < _0x5b671a) {
              if (_0x18bf2e.stopRequested) {
                break;
              }
              await sleep(Math.min(2000, _0x5b671a - Date.now()));
            }
          } else {
            _0x492188(_0xb79dbe, "间隔为 0，立即发布下一条");
          }
        }
      }
    }
    const _0x4b2416 = _0x3516d0?.getTask?.(_0xb79dbe) || _0x18bf2e.taskRecord;
    const _0x5b7b6d = _0x4b2416?.items || [];
    const _0x12097b = _0x5b7b6d.length && _0x5b7b6d.every(_0x2fbaf8 => _0x2fbaf8.status === "published" || _0x2fbaf8.status === "failed");
    const _0x3d2fcb = _0x18bf2e.stopRequested ? "stopped" : _0x12097b ? "done" : "ready";
    _0x3516d0?.saveTask?.({
      ..._0x4b2416,
      status: _0x3d2fcb,
      updatedAt: Date.now(),
      endedAt: Date.now(),
      endReason: _0x18bf2e.stopRequested ? "manual_stop" : "finished"
    });
    _0x492188(_0xb79dbe, _0x18bf2e.stopRequested ? "任务已停止" : "任务结束", _0x18bf2e.stopRequested ? "warn" : "info");
    _0x4c5a05(_0xb79dbe, {
      type: "task-finished",
      status: _0x3d2fcb
    });
  }
  function _0x18c365(_0xbc3fce, _0x4e5f5a = [], _0x380ffd) {
    const _0x8cc88f = String(_0xbc3fce?.id || "");
    if (!_0x8cc88f) {
      return false;
    }
    if (_0x34d8bc.has(_0x8cc88f)) {
      return false;
    }
    const _0x4b69c1 = Array.isArray(_0x4e5f5a) ? _0x4e5f5a : [];
    const _0x9692d4 = new Map(_0x4b69c1.map(_0x4f86c1 => [String(_0x4f86c1.id), _0x4f86c1]));
    const _0x100415 = Array.isArray(_0xbc3fce.items) ? _0xbc3fce.items : [];
    const _0x1180ac = [...new Set(_0x100415.map(_0x14d83d => String(_0x14d83d.accountId || "")).filter(Boolean))];
    const _0xd6e8cb = Math.max(0, Number(_0xbc3fce.staggerMinSec) || 0);
    const _0x23300f = Math.max(_0xd6e8cb, Number(_0xbc3fce.staggerMaxSec) || _0xd6e8cb);
    const _0x30b565 = Date.now();
    const _0x32fb45 = {
      taskId: _0x8cc88f,
      generation: _0x30b565,
      stopRequested: false,
      taskRecord: _0xbc3fce,
      items: _0x100415,
      accountIds: _0x1180ac,
      accountsById: _0x9692d4,
      tasksApi: _0x380ffd,
      publishMode: _0xbc3fce.publishMode === "parallel" ? "parallel" : "interval",
      staggerMinSec: _0xd6e8cb,
      staggerMaxSec: _0x23300f,
      status: "running"
    };
    acquireTaskRuntimeGuard(_0xf53b13(_0x8cc88f), {
      taskId: _0x8cc88f,
      kind: "work_publish",
      accountIds: _0x1180ac
    });
    _0x34d8bc.set(_0x8cc88f, _0x32fb45);
    _0x26a1c2(_0x8cc88f);
    _0x492188(_0x8cc88f, "开始发布任务，共 " + _0x100415.length + " 项");
    _0x380ffd?.saveTask?.({
      ..._0xbc3fce,
      status: "running",
      updatedAt: Date.now(),
      startedAt: Date.now()
    });
    (async () => {
      try {
        await _0x215135(_0x32fb45);
      } catch (_0x2c7cd2) {
        _0x492188(_0x8cc88f, "任务异常：" + (_0x2c7cd2.message || _0x2c7cd2), "error");
        _0x380ffd?.saveTask?.({
          ..._0xbc3fce,
          status: "stopped",
          updatedAt: Date.now(),
          endReason: "error"
        });
        _0x4c5a05(_0x8cc88f, {
          type: "task-finished",
          status: "stopped",
          error: _0x2c7cd2.message
        });
      } finally {
        _0x34d8bc.delete(_0x8cc88f);
        releaseTaskRuntimeGuard(_0xf53b13(_0x8cc88f));
        _0x541cf0(new Set());
      }
    })();
    return true;
  }
  function _0x3c3877(_0x495c77) {
    const _0x44f63f = _0x34d8bc.get(String(_0x495c77));
    if (!_0x44f63f) {
      return false;
    }
    _0x44f63f.stopRequested = true;
    _0x492188(_0x495c77, "正在停止…", "warn");
    return true;
  }
  function _0x2af800() {
    for (const _0x10e18c of [..._0x34d8bc.keys()]) {
      _0x3c3877(_0x10e18c);
    }
  }
  function _0xc38d74(_0x4d0f69) {
    const _0x1d10d5 = _0x344ba2.get(String(_0x4d0f69));
    if (!_0x1d10d5 || _0x1d10d5.isDestroyed()) {
      return false;
    }
    return showHiddenAutomationWindow(_0x1d10d5, {
      title: "作品发布监控 · " + _0x4d0f69,
      width: 1200,
      height: 860
    });
  }
  function _0x521d96(_0x34a492) {
    const _0x610d44 = _0x344ba2.get(String(_0x34a492));
    if (!_0x610d44 || _0x610d44.isDestroyed()) {
      return false;
    }
    return hideVisibleAutomationWindow(_0x610d44);
  }
  return {
    startTask: _0x18c365,
    stopTask: _0x3c3877,
    stopAll: _0x2af800,
    isTaskRunning: _0x390916,
    listRunningTaskIds: _0x162577,
    listWebContents: _0x4a9e5c,
    getTaskLogs: _0x5fe83d,
    clearTaskLogs: _0x26a1c2,
    showMonitorWindow: _0xc38d74,
    hideMonitorWindow: _0x521d96
  };
}
module.exports = {
  createWorkPublishRunner: createWorkPublishRunner
};
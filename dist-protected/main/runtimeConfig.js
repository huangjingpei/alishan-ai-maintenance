const crypto = require("crypto");
const FETCH_MAX_ATTEMPTS = 3;
const FETCH_RETRY_DELAYS_MS = [800, 1600];
function createRuntimeConfigService({
  store: _0xd45b22,
  axios: _0x407342,
  apiBase: _0x433d4a,
  getApiBase: _0x24e07b,
  productSlug: _0x208941,
  productToken: _0x3cec48,
  jwtSecret: _0x197af3,
  getDeviceId: _0x431f0d,
  getBroadcastTargets: _0x23613e,
  onStatusChange: _0x3f10d1
}) {
  const _0x2c7b06 = () => {
    if (typeof _0x24e07b === "function") {
      const _0x105800 = _0x24e07b();
      if (_0x105800) {
        return String(_0x105800).replace(/\/+$/, "");
      }
    }
    return String(_0x433d4a || "").replace(/\/+$/, "");
  };
  let _0x39d423 = null;
  let _0x1edfd8 = null;
  let _0x574918 = null;
  let _0x645960 = 0;
  let _0x42b703 = false;
  let _0x21ff7b = null;
  try {
    if (_0xd45b22?.delete) {
      _0xd45b22.delete("runtime_config_enc");
    } else if (_0xd45b22?.set) {
      _0xd45b22.set("runtime_config_enc", undefined);
    }
  } catch (_0x33ac5c) {}
  function _0x4fa760(_0x45382a) {
    return new Promise(_0xd51645 => setTimeout(_0xd51645, _0x45382a));
  }
  function _0x5ec726(_0x5558dc) {
    const _0x3744bd = "radar-runtime-v1|" + _0x5558dc + "|" + _0x208941 + "|" + (_0x197af3 || "");
    return crypto.createHash("sha256").update(_0x3744bd).digest();
  }
  function _0x589ff4(_0xfb299a) {
    const _0x394e45 = "radar-runtime-v2|" + _0xfb299a + "|" + _0x208941 + "|" + (_0x3cec48 || "");
    return crypto.createHash("sha256").update(_0x394e45).digest();
  }
  function _0x2c448a(_0x2a78ca, _0x39f81a) {
    if (!_0x39f81a?.iv || !_0x39f81a?.tag || !_0x39f81a?.enc) {
      throw new Error("incomplete cipher payload");
    }
    const _0x4d2e44 = Buffer.from(_0x39f81a.iv, "base64");
    const _0x2c21a1 = Buffer.from(_0x39f81a.tag, "base64");
    const _0x1b225a = Buffer.from(_0x39f81a.enc, "base64");
    const _0x12c718 = crypto.createDecipheriv("aes-256-gcm", _0x2a78ca, _0x4d2e44);
    _0x12c718.setAuthTag(_0x2c21a1);
    const _0x407f3e = Buffer.concat([_0x12c718.update(_0x1b225a), _0x12c718.final()]);
    return JSON.parse(_0x407f3e.toString("utf8"));
  }
  function _0x34c428(_0x181b2e, _0x4cf807) {
    const _0x4e3f5b = [];
    const _0x4030c1 = _0x4cf807?.v2 && typeof _0x4cf807.v2 === "object" ? _0x4cf807.v2 : null;
    if (_0x4030c1?.enc && _0x3cec48) {
      try {
        return _0x2c448a(_0x589ff4(_0x181b2e), _0x4030c1);
      } catch (_0x3fcb06) {
        _0x4e3f5b.push("v2:" + _0x3fcb06.message);
      }
    }
    if (_0x4cf807?.enc && _0x197af3) {
      try {
        return _0x2c448a(_0x5ec726(_0x181b2e), _0x4cf807);
      } catch (_0x450cd0) {
        _0x4e3f5b.push("v1:" + _0x450cd0.message);
      }
    }
    if (_0x4cf807?.enc && Number(_0x4cf807.keyVer) === 2 && _0x3cec48) {
      try {
        return _0x2c448a(_0x589ff4(_0x181b2e), _0x4cf807);
      } catch (_0x2d08fe) {
        _0x4e3f5b.push("v2-top:" + _0x2d08fe.message);
      }
    }
    throw new Error("decrypt failed (" + (_0x4e3f5b.join("; ") || "no key") + ")");
  }
  function _0x30725d(_0xad72eb) {
    if (!_0xad72eb || typeof _0xad72eb !== "object") {
      return false;
    }
    const _0x3cc149 = _0xad72eb.commentV2 || {};
    const _0x1f965f = typeof _0x3cc149.commentInput === "string" && _0x3cc149.commentInput.trim() && typeof _0x3cc149.openCommentBtns === "string" && _0x3cc149.openCommentBtns.trim();
    const _0x31a7ba = Boolean(_0xad72eb.selectors?.["douyin.com"]?.commentPanel) || typeof _0x3cc149.commentPanel === "string" && _0x3cc149.commentPanel.trim();
    const _0x23a927 = ["emojiPanel", "emojiTrigger", "emojiStickerItems", "emojiItemCandidates", "emojiStickerClickableRoot", "emojiStickerInteractiveRoot", "emojiStickerSourcePattern", "emojiTextSourcePattern", "emojiTextTokenPattern", "emojiComposerPayload", "emojiTabContainerCandidates", "emojiTabTextCandidates", "emojiTabDebugCandidates", "emojiTabPositivePattern", "emojiTabRejectPattern", "emojiPanelRejectSelector", "commentFloatingChrome", "commentComposerChrome", "commentStickerImageSelector", "commentStickerAltPattern", "commentAvatarImagePattern"];
    const _0x1aa878 = _0x23a927.every(_0x4ddb86 => typeof _0x3cc149[_0x4ddb86] === "string" && _0x3cc149[_0x4ddb86].trim()) && ["emojiStickerMinImageSide", "emojiStickerMinFillRatio", "emojiTabProbeTimeoutMs"].every(_0x3a74a7 => Number.isFinite(Number(_0x3cc149[_0x3a74a7])) && Number(_0x3cc149[_0x3a74a7]) > 0);
    const _0x54b407 = _0xad72eb.dmV2 || {};
    const _0x135e6e = ["profileFollowBtn", "profileMessageBtn", "profileName", "dmInput", "dmSendBtn", "dmSendPrimary", "dmExplicitSendSvg", "dmDialog", "dmInputHint", "dmSendSvgCandidates", "dmSendClickableRoot", "dmSendTextCandidates", "conversationItem", "conversationTitle", "conversationPreview", "conversationUnread", "conversationAvatar", "conversationAvatarRoot", "dmBlockActiveRoots", "dmBlockNodeCandidates", "dmBlockGlobalHints", "dmMessageItems", "dmHistoryMessageItems", "dmMessageContainer", "dmFailureCandidates", "dmFailureIconInner", "groupRowHints", "groupAvatarImages", "conversationHeader"];
    const _0x2fa7e4 = _0x135e6e.every(_0x1a88f2 => typeof _0x54b407[_0x1a88f2] === "string" && _0x54b407[_0x1a88f2].trim()) && ["strangerFolderTexts", "sendExactTexts", "sendSvgHints"].every(_0x4c8b7e => Array.isArray(_0x54b407[_0x4c8b7e]) && _0x54b407[_0x4c8b7e].length > 0);
    const _0x3631a2 = _0xad72eb.gated || {};
    const _0x3de73a = ["profileReadyPattern", "actionButtonCandidates", "actionClickableRoot", "profilePositiveContextPattern", "profileRejectContextPattern", "profileRejectOverlaySelector", "profileRejectNoticeSelector"];
    const _0x4786f6 = _0x3de73a.every(_0x3e85d4 => typeof _0x3631a2[_0x3e85d4] === "string" && _0x3631a2[_0x3e85d4].trim()) && ["profileFollow", "profileMessage", "dmSend"].every(_0x3d45e0 => Array.isArray(_0x3631a2[_0x3d45e0]?.exactTexts) && _0x3631a2[_0x3d45e0].exactTexts.length > 0);
    return _0x1f965f && _0x31a7ba && _0x1aa878 && _0x2fa7e4 && _0x4786f6;
  }
  function _0x2615bd(_0x5ed514, _0x3e3542) {
    _0x39d423 = _0x5ed514;
    _0x42b703 = true;
    if (_0x3e3542) {
      _0x574918 = _0x3e3542;
    }
    return _0x39d423;
  }
  function _0x3a4bde() {
    return _0x39d423;
  }
  function _0x10ad40() {
    return Boolean(_0x42b703 && _0x39d423 && _0x30725d(_0x39d423));
  }
  function _0x30a402() {
    const _0x116296 = _0xd45b22.get("auth_token");
    return {
      ready: _0x10ad40(),
      fetching: Boolean(_0x21ff7b),
      hasToken: Boolean(_0x116296),
      hasConfig: Boolean(_0x39d423),
      version: String(_0x39d423?.version || ""),
      fetchedAt: Number(_0x645960 || 0)
    };
  }
  function _0x22eec6(_0x32761f = {}) {
    if (typeof _0x3f10d1 !== "function") {
      return;
    }
    try {
      _0x3f10d1({
        ..._0x30a402(),
        ..._0x32761f
      });
    } catch (_0x253b41) {
      console.warn("[RuntimeConfig] onStatusChange failed:", _0x253b41.message);
    }
  }
  function _0xe6474d(_0x188098) {
    if (!_0x39d423 || !_0x188098 || _0x188098.isDestroyed?.()) {
      return;
    }
    try {
      _0x188098.send("apply-runtime-config", _0x39d423);
    } catch (_0x224060) {
      console.warn("[RuntimeConfig] push failed:", _0x224060.message);
    }
  }
  function _0x3e321a() {
    if (!_0x39d423 || typeof _0x23613e !== "function") {
      return;
    }
    let _0x1b4951 = [];
    try {
      _0x1b4951 = _0x23613e() || [];
    } catch (_0x39b735) {
      return;
    }
    for (const _0x319d05 of _0x1b4951) {
      _0xe6474d(_0x319d05);
    }
  }
  async function _0x17fc26(_0x5140be, {
    force = false
  } = {}) {
    const _0x42320f = {
      Authorization: "Bearer " + _0x5140be,
      "X-Device-ID": _0x431f0d(),
      "X-Product-Slug": _0x208941,
      "Cache-Control": "no-cache, no-store",
      Pragma: "no-cache"
    };
    if (!force && _0x1edfd8 && _0x39d423) {
      _0x42320f["If-None-Match"] = "\"" + _0x1edfd8 + "\"";
    }
    const _0x31f7f9 = force ? "?refresh=" + Date.now() : "";
    const _0x106ade = await _0x407342.get(_0x2c7b06() + "/radar/runtime-config" + _0x31f7f9, {
      headers: _0x42320f,
      timeout: 8000,
      validateStatus: _0x40502d => _0x40502d === 200 || _0x40502d === 304
    });
    if (_0x106ade.status === 304) {
      if (!_0x39d423 || !_0x30725d(_0x39d423)) {
        _0x1edfd8 = null;
        throw new Error("304 but in-memory config missing");
      }
      _0x645960 = Date.now();
      _0x2615bd(_0x39d423, _0x5140be);
      _0x3e321a();
      return _0x39d423;
    }
    const _0x1b346e = _0x106ade.data?.data || _0x106ade.data;
    if (!_0x1b346e?.enc) {
      throw new Error("response missing ciphertext");
    }
    const _0x2b3e1b = _0x34c428(_0x5140be, _0x1b346e);
    if (!_0x30725d(_0x2b3e1b)) {
      throw new Error("runtime config incomplete version=" + (_0x2b3e1b?.version || "-"));
    }
    _0x1edfd8 = _0x1b346e.etag || _0x2b3e1b?.version || null;
    _0x645960 = Date.now();
    _0x2615bd(_0x2b3e1b, _0x5140be);
    console.log("[RuntimeConfig] 已拉取并解密（仅内存） version=" + (_0x39d423?.version || "-") + (" etag=" + (_0x1edfd8 || "-") + " force=" + force));
    _0x3e321a();
    return _0x39d423;
  }
  async function _0x2153a9({
    force = false
  } = {}) {
    if (_0x10ad40() && !force) {
      return _0x39d423;
    }
    const _0x20788d = _0xd45b22.get("auth_token");
    if (!_0x20788d) {
      console.log("[RuntimeConfig] 无 auth_token，跳过拉取（未授权成功）");
      _0x22eec6({
        ready: false,
        hasToken: false
      });
      return null;
    }
    if (_0x21ff7b) {
      return _0x21ff7b;
    }
    _0x22eec6({
      fetching: true
    });
    _0x21ff7b = (async () => {
      let _0x2648f7 = null;
      for (let _0x23c1a = 1; _0x23c1a <= FETCH_MAX_ATTEMPTS; _0x23c1a++) {
        try {
          const _0xeeccef = await _0x17fc26(_0x20788d, {
            force: force
          });
          if (_0xeeccef && _0x30725d(_0xeeccef)) {
            _0x22eec6({
              ready: true,
              fetching: false
            });
            return _0xeeccef;
          }
          _0x2648f7 = new Error("runtime config incomplete");
          console.warn("[RuntimeConfig] 配置不完整 attempt=" + _0x23c1a + "/" + FETCH_MAX_ATTEMPTS);
        } catch (_0x4e6654) {
          _0x2648f7 = _0x4e6654;
          const _0x1dc3af = _0x4e6654.response?.status;
          console.warn("[RuntimeConfig] 拉取失败 attempt=" + _0x23c1a + "/" + FETCH_MAX_ATTEMPTS + (" status=" + (_0x1dc3af || "-") + " " + _0x4e6654.message));
        }
        if (_0x23c1a < FETCH_MAX_ATTEMPTS) {
          const _0x395b92 = FETCH_RETRY_DELAYS_MS[_0x23c1a - 1] || 1600;
          await _0x4fa760(_0x395b92);
        }
      }
      if (_0x39d423 && _0x30725d(_0x39d423)) {
        console.warn("[RuntimeConfig] 本轮拉取失败，继续使用本进程内存中的完整配置");
        _0x42b703 = true;
        _0x22eec6({
          ready: true,
          fetching: false
        });
        return _0x39d423;
      }
      console.warn("[RuntimeConfig] 配置拉取失败，等待下次使用功能时再试" + ("" + (_0x2648f7?.message ? " detail=" + _0x2648f7.message : "")));
      _0x22eec6({
        ready: false,
        fetching: false
      });
      return null;
    })().finally(() => {
      _0x21ff7b = null;
      _0x22eec6();
    });
    return _0x21ff7b;
  }
  function _0x40e483(_0x108c24 = "") {
    const _0x245166 = _0xd45b22.get("auth_token");
    if (!_0x245166) {
      console.log("[RuntimeConfig] skip background fetch (" + _0x108c24 + "): 未授权成功");
      return;
    }
    if (_0x10ad40()) {
      return;
    }
    _0x2153a9().catch(_0x2b4706 => {
      console.warn("[RuntimeConfig] background fetch (" + _0x108c24 + "):", _0x2b4706.message);
    });
  }
  function _0xad20de(_0x2ffb33) {
    if (!_0x2ffb33 || _0x2ffb33.isDestroyed?.()) {
      return;
    }
    _0x2153a9().then(() => _0xe6474d(_0x2ffb33)).catch(_0x5c0fc0 => {
      console.warn("[RuntimeConfig] ensureAndPush failed:", _0x5c0fc0.message);
    });
  }
  return {
    ensureFetched: _0x2153a9,
    ensureFetchedInBackground: _0x40e483,
    ensureAndPushToWebContents: _0xad20de,
    getPlain: _0x3a4bde,
    isReady: _0x10ad40,
    isConfigComplete: _0x30725d,
    getStatus: _0x30a402,
    broadcast: _0x3e321a,
    pushToWebContents: _0xe6474d
  };
}
module.exports = {
  createRuntimeConfigService: createRuntimeConfigService
};
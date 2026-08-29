const crypto = require("crypto");
const {
  app
} = require("electron");
const FETCH_MAX_ATTEMPTS = 3;
const FETCH_RETRY_DELAYS_MS = [800, 1600];
function isPlaintextLocalDevelopmentConfigAllowed() {
  return process.env.HUOKE_LOCAL_DEV === "1" && !app.isPackaged;
}
function createRuntimeConfigService({
  store: store,
  axios: axios,
  apiBase: apiBase,
  getApiBase: getApiBase,
  productSlug: productSlug,
  productToken: productToken,
  jwtSecret: jwtSecret,
  getDeviceId: getDeviceId,
  getBroadcastTargets: getBroadcastTargets,
  onStatusChange: onStatusChange
}) {
  const local = () => {
    if (typeof getApiBase === "function") {
      const result = getApiBase();
      if (result) {
        return String(result).replace(/\/+$/, "");
      }
    }
    return String(apiBase || "").replace(/\/+$/, "");
  };
  let local2 = null;
  let local3 = null;
  let local4 = null;
  let num = 0;
  let flag = false;
  let local5 = null;
  try {
    if (store?.delete) {
      store.delete("runtime_config_enc");
    } else if (store?.set) {
      store.set("runtime_config_enc", undefined);
    }
  } catch (error) {}
  function fn(arg1) {
    return new Promise(arg12 => setTimeout(arg12, arg1));
  }
  function fn2(arg1) {
    const value = "radar-runtime-v1|" + arg1 + "|" + productSlug + "|" + (jwtSecret || "");
    return crypto.createHash("sha256").update(value).digest();
  }
  function fn3(arg1) {
    const value = "radar-runtime-v2|" + arg1 + "|" + productSlug + "|" + (productToken || "");
    return crypto.createHash("sha256").update(value).digest();
  }
  function fn4(arg1, arg2) {
    if (!arg2?.iv || !arg2?.tag || !arg2?.enc) {
      throw new Error("incomplete cipher payload");
    }
    const result = Buffer.from(arg2.iv, "base64");
    const result2 = Buffer.from(arg2.tag, "base64");
    const result3 = Buffer.from(arg2.enc, "base64");
    const result4 = crypto.createDecipheriv("aes-256-gcm", arg1, result);
    result4.setAuthTag(result2);
    const result5 = Buffer.concat([result4.update(result3), result4.final()]);
    return JSON.parse(result5.toString("utf8"));
  }
  function fn5(arg1, arg2) {
    const list = [];
    const value = arg2?.v2 && typeof arg2.v2 === "object" ? arg2.v2 : null;
    if (value?.enc && productToken) {
      try {
        return fn4(fn3(arg1), value);
      } catch (error) {
        list.push("v2:" + error.message);
      }
    }
    if (arg2?.enc && jwtSecret) {
      try {
        return fn4(fn2(arg1), arg2);
      } catch (error) {
        list.push("v1:" + error.message);
      }
    }
    if (arg2?.enc && Number(arg2.keyVer) === 2 && productToken) {
      try {
        return fn4(fn3(arg1), arg2);
      } catch (error) {
        list.push("v2-top:" + error.message);
      }
    }
    throw new Error("decrypt failed (" + (list.join("; ") || "no key") + ")");
  }
  function isConfigComplete(arg1) {
    if (!arg1 || typeof arg1 !== "object") {
      return false;
    }
    const local = arg1.commentV2 || {};
    const local2 = typeof local.commentInput === "string" && local.commentInput.trim() && typeof local.openCommentBtns === "string" && local.openCommentBtns.trim();
    const local3 = Boolean(arg1.selectors?.["douyin.com"]?.commentPanel) || typeof local.commentPanel === "string" && local.commentPanel.trim();
    const list = ["emojiPanel", "emojiTrigger", "emojiStickerItems", "emojiItemCandidates", "emojiStickerClickableRoot", "emojiStickerInteractiveRoot", "emojiStickerSourcePattern", "emojiTextSourcePattern", "emojiTextTokenPattern", "emojiComposerPayload", "emojiTabContainerCandidates", "emojiTabTextCandidates", "emojiTabDebugCandidates", "emojiTabPositivePattern", "emojiTabRejectPattern", "emojiPanelRejectSelector", "commentFloatingChrome", "commentComposerChrome", "commentStickerImageSelector", "commentStickerAltPattern", "commentAvatarImagePattern"];
    const local4 = list.every(arg1 => typeof local[arg1] === "string" && local[arg1].trim()) && ["emojiStickerMinImageSide", "emojiStickerMinFillRatio", "emojiTabProbeTimeoutMs"].every(arg1 => Number.isFinite(Number(local[arg1])) && Number(local[arg1]) > 0);
    const local5 = arg1.dmV2 || {};
    const list2 = ["profileFollowBtn", "profileMessageBtn", "profileName", "dmInput", "dmSendBtn", "dmSendPrimary", "dmExplicitSendSvg", "dmDialog", "dmInputHint", "dmSendSvgCandidates", "dmSendClickableRoot", "dmSendTextCandidates", "conversationItem", "conversationTitle", "conversationPreview", "conversationUnread", "conversationAvatar", "conversationAvatarRoot", "dmBlockActiveRoots", "dmBlockNodeCandidates", "dmBlockGlobalHints", "dmMessageItems", "dmHistoryMessageItems", "dmMessageContainer", "dmFailureCandidates", "dmFailureIconInner", "groupRowHints", "groupAvatarImages", "conversationHeader"];
    const local6 = list2.every(arg1 => typeof local5[arg1] === "string" && local5[arg1].trim()) && ["strangerFolderTexts", "sendExactTexts", "sendSvgHints"].every(arg1 => Array.isArray(local5[arg1]) && local5[arg1].length > 0);
    const local7 = arg1.gated || {};
    const list3 = ["profileReadyPattern", "actionButtonCandidates", "actionClickableRoot", "profilePositiveContextPattern", "profileRejectContextPattern", "profileRejectOverlaySelector", "profileRejectNoticeSelector"];
    const local8 = list3.every(arg1 => typeof local7[arg1] === "string" && local7[arg1].trim()) && ["profileFollow", "profileMessage", "dmSend"].every(arg1 => Array.isArray(local7[arg1]?.exactTexts) && local7[arg1].exactTexts.length > 0);
    return local2 && local3 && local4 && local6 && local8;
  }
  function fn7(arg1, arg2) {
    local2 = arg1;
    flag = true;
    if (arg2) {
      local4 = arg2;
    }
    return local2;
  }
  function getPlain() {
    return local2;
  }
  function isReady() {
    return Boolean(flag && local2 && isConfigComplete(local2));
  }
  function getStatus() {
    const result = store.get("auth_token");
    return {
      ready: isReady(),
      fetching: Boolean(local5),
      hasToken: Boolean(result),
      hasConfig: Boolean(local2),
      version: String(local2?.version || ""),
      fetchedAt: Number(num || 0)
    };
  }
  function fn11(options = {}) {
    if (typeof onStatusChange !== "function") {
      return;
    }
    try {
      onStatusChange({
        ...getStatus(),
        ...options
      });
    } catch (error) {
      console.warn("[RuntimeConfig] onStatusChange failed:", error.message);
    }
  }
  function pushToWebContents(arg1) {
    if (!local2 || !arg1 || arg1.isDestroyed?.()) {
      return;
    }
    try {
      arg1.send("apply-runtime-config", local2);
    } catch (error) {
      console.warn("[RuntimeConfig] push failed:", error.message);
    }
  }
  function broadcast() {
    if (!local2 || typeof getBroadcastTargets !== "function") {
      return;
    }
    let list = [];
    try {
      list = getBroadcastTargets() || [];
    } catch (error) {
      return;
    }
    for (const item of list) {
      pushToWebContents(item);
    }
  }
  async function fn14(arg1, {
    force = false
  } = {}) {
    const obj = {
      Authorization: "Bearer " + arg1,
      "X-Device-ID": getDeviceId(),
      "X-Product-Slug": productSlug,
      "Cache-Control": "no-cache, no-store",
      Pragma: "no-cache"
    };
    if (!force && local3 && local2) {
      obj["If-None-Match"] = "\"" + local3 + "\"";
    }
    const value = force ? "?refresh=" + Date.now() : "";
    const result = await axios.get(local() + "/radar/runtime-config" + value, {
      headers: obj,
      timeout: 8000,
      validateStatus: arg1 => arg1 === 200 || arg1 === 304
    });
    if (result.status === 304) {
      if (!local2 || !isConfigComplete(local2)) {
        local3 = null;
        throw new Error("304 but in-memory config missing");
      }
      num = Date.now();
      fn7(local2, arg1);
      broadcast();
      return local2;
    }
    const local4 = result.data?.data || result.data;
    const value2 = isPlaintextLocalDevelopmentConfigAllowed() && local4?.plain && typeof local4.plain === "object" ? local4.plain : null;
    if (!value2 && !local4?.enc) {
      throw new Error("response missing ciphertext");
    }
    const local5 = value2 || fn5(arg1, local4);
    if (!isConfigComplete(local5)) {
      throw new Error("runtime config incomplete version=" + (local5?.version || "-"));
    }
    local3 = local4.etag || local5?.version || null;
    num = Date.now();
    fn7(local5, arg1);
    console.log("[RuntimeConfig] 已拉取" + (value2 ? "本地开发明文配置" : "并解密（仅内存）") + " version=" + (local2?.version || "-") + (" etag=" + (local3 || "-") + " force=" + force));
    broadcast();
    return local2;
  }
  async function ensureFetched({
    force = false
  } = {}) {
    if (isReady() && !force) {
      return local2;
    }
    const result = store.get("auth_token");
    if (!result) {
      console.log("[RuntimeConfig] 无 auth_token，跳过拉取（未授权成功）");
      fn11({
        ready: false,
        hasToken: false
      });
      return null;
    }
    if (local5) {
      return local5;
    }
    fn11({
      fetching: true
    });
    local5 = (async () => {
      let local = null;
      for (let num = 1; num <= FETCH_MAX_ATTEMPTS; num++) {
        try {
          const result2 = await fn14(result, {
            force: force
          });
          if (result2 && isConfigComplete(result2)) {
            fn11({
              ready: true,
              fetching: false
            });
            return result2;
          }
          local = new Error("runtime config incomplete");
          console.warn("[RuntimeConfig] 配置不完整 attempt=" + num + "/" + FETCH_MAX_ATTEMPTS);
        } catch (error) {
          local = error;
          const local2 = error.response?.status;
          console.warn("[RuntimeConfig] 拉取失败 attempt=" + num + "/" + FETCH_MAX_ATTEMPTS + (" status=" + (local2 || "-") + " " + error.message));
        }
        if (num < FETCH_MAX_ATTEMPTS) {
          const local = FETCH_RETRY_DELAYS_MS[num - 1] || 1600;
          await fn(local);
        }
      }
      if (local2 && isConfigComplete(local2)) {
        console.warn("[RuntimeConfig] 本轮拉取失败，继续使用本进程内存中的完整配置");
        flag = true;
        fn11({
          ready: true,
          fetching: false
        });
        return local2;
      }
      console.warn("[RuntimeConfig] 配置拉取失败，等待下次使用功能时再试" + ("" + (local?.message ? " detail=" + local.message : "")));
      fn11({
        ready: false,
        fetching: false
      });
      return null;
    })().finally(() => {
      local5 = null;
      fn11();
    });
    return local5;
  }
  function ensureFetchedInBackground(text = "") {
    const result = store.get("auth_token");
    if (!result) {
      console.log("[RuntimeConfig] skip background fetch (" + text + "): 未授权成功");
      return;
    }
    if (isReady()) {
      return;
    }
    ensureFetched().catch(arg1 => {
      console.warn("[RuntimeConfig] background fetch (" + text + "):", arg1.message);
    });
  }
  function ensureAndPushToWebContents(arg1) {
    if (!arg1 || arg1.isDestroyed?.()) {
      return;
    }
    ensureFetched().then(() => pushToWebContents(arg1)).catch(arg1 => {
      console.warn("[RuntimeConfig] ensureAndPush failed:", arg1.message);
    });
  }
  return {
    ensureFetched: ensureFetched,
    ensureFetchedInBackground: ensureFetchedInBackground,
    ensureAndPushToWebContents: ensureAndPushToWebContents,
    getPlain: getPlain,
    isReady: isReady,
    isConfigComplete: isConfigComplete,
    getStatus: getStatus,
    broadcast: broadcast,
    pushToWebContents: pushToWebContents
  };
}
module.exports = {
  createRuntimeConfigService: createRuntimeConfigService
};

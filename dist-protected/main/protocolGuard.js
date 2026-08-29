const {
  shell
} = require("electron");
const ALLOWED_WEB_PROTOCOLS = new Set(["http:", "https:", "about:", "blob:", "data:", "javascript:"]);
const configuredExternalProtocolSessions = new WeakSet();
let shellOpenExternalGuardInstalled = false;
function parseUrlProtocol(arg1) {
  try {
    return new URL(String(arg1 || "").trim()).protocol.toLowerCase();
  } catch (error) {
    return null;
  }
}
function isBlockedExternalProtocol(arg1) {
  const result = parseUrlProtocol(arg1);
  if (!result) {
    return false;
  }
  return !ALLOWED_WEB_PROTOCOLS.has(result);
}
function isAllowedExternalOpenUrl(arg1) {
  const result = parseUrlProtocol(arg1);
  return result === "http:" || result === "https:";
}
function logBlockedExternalProtocol(arg1, arg2, text = "navigate") {
  const local = parseUrlProtocol(arg1) || "unknown";
  console.warn("[Main] 已拦截自定义协议(" + local + arg2 + "/" + text + "): " + arg1);
}
function createExternalLinkOpenHandler(text = "web") {
  return ({
    url: url
  }) => {
    if (url && isBlockedExternalProtocol(url)) {
      logBlockedExternalProtocol(url, text, "window-open");
    }
    return {
      action: "deny"
    };
  };
}
function attachProtocolGuard(arg1, text = "web") {
  if (!arg1 || arg1.__radarProtocolGuardAttached) {
    return;
  }
  arg1.__radarProtocolGuardAttached = true;
  const local = (arg1, arg2, arg3) => {
    if (!arg2 || !isBlockedExternalProtocol(arg2)) {
      return;
    }
    if (arg1 && typeof arg1.preventDefault === "function") {
      arg1.preventDefault();
    }
    logBlockedExternalProtocol(arg2, text, arg3);
  };
  arg1.on("will-navigate", (arg1, arg2) => local(arg1, arg2, "navigate"));
  arg1.on("will-redirect", (arg1, arg2) => local(arg1, arg2, "redirect"));
  arg1.setWindowOpenHandler(createExternalLinkOpenHandler(text));
}
function configureSessionExternalProtocolGuard(arg1) {
  if (!arg1 || configuredExternalProtocolSessions.has(arg1)) {
    return;
  }
  configuredExternalProtocolSessions.add(arg1);
  const local = arg1 => {
    if (!arg1) {
      return false;
    }
    return isBlockedExternalProtocol(arg1);
  };
  arg1.setPermissionCheckHandler((arg1, arg2, arg3, arg4) => {
    if (arg2 !== "openExternal") {
      return true;
    }
    const local2 = arg4?.externalURL;
    if (local(local2)) {
      logBlockedExternalProtocol(local2, "session", "openExternal-check");
      return false;
    }
    return true;
  });
  arg1.setPermissionRequestHandler((arg1, arg2, arg3, arg4) => {
    if (arg2 !== "openExternal") {
      arg3(true);
      return;
    }
    const local2 = arg4?.externalURL;
    if (local(local2)) {
      logBlockedExternalProtocol(local2, "session", "openExternal-request");
      arg3(false);
      return;
    }
    arg3(true);
  });
  if (!arg1.__radarProtocolRequestBlocker) {
    arg1.__radarProtocolRequestBlocker = true;
    try {
      arg1.webRequest.onBeforeRequest({
        urls: ["<all_urls>"]
      }, (arg1, arg2) => {
        if (isBlockedExternalProtocol(arg1.url)) {
          logBlockedExternalProtocol(arg1.url, "session", "before-request");
          arg2({
            cancel: true
          });
          return;
        }
        arg2({});
      });
    } catch (error) {
      console.warn("[Main] 协议网络层拦截注册失败: " + error.message);
    }
  }
}
function installShellOpenExternalGuard() {
  if (shellOpenExternalGuardInstalled || !shell?.openExternal) {
    return;
  }
  shellOpenExternalGuardInstalled = true;
  const result = shell.openExternal.bind(shell);
  shell.openExternal = async (arg1, arg2) => {
    if (isBlockedExternalProtocol(arg1)) {
      logBlockedExternalProtocol(arg1, "shell", "openExternal");
      return "";
    }
    return result(arg1, arg2);
  };
}
module.exports = {
  attachProtocolGuard: attachProtocolGuard,
  configureSessionExternalProtocolGuard: configureSessionExternalProtocolGuard,
  installShellOpenExternalGuard: installShellOpenExternalGuard,
  isBlockedExternalProtocol: isBlockedExternalProtocol,
  isAllowedExternalOpenUrl: isAllowedExternalOpenUrl,
  logBlockedExternalProtocol: logBlockedExternalProtocol
};
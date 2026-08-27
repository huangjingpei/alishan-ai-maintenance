const {
  shell
} = require("electron");
const ALLOWED_WEB_PROTOCOLS = new Set(["http:", "https:", "about:", "blob:", "data:", "javascript:"]);
const configuredExternalProtocolSessions = new WeakSet();
let shellOpenExternalGuardInstalled = false;
function parseUrlProtocol(_0xd1bb6d) {
  try {
    return new URL(String(_0xd1bb6d || "").trim()).protocol.toLowerCase();
  } catch (_0x33ef99) {
    return null;
  }
}
function isBlockedExternalProtocol(_0x269aee) {
  const _0x48f0c1 = parseUrlProtocol(_0x269aee);
  if (!_0x48f0c1) {
    return false;
  }
  return !ALLOWED_WEB_PROTOCOLS.has(_0x48f0c1);
}
function isAllowedExternalOpenUrl(_0x523def) {
  const _0x397c17 = parseUrlProtocol(_0x523def);
  return _0x397c17 === "http:" || _0x397c17 === "https:";
}
function logBlockedExternalProtocol(_0x5d2c64, _0x1da60b, _0x4861e8 = "navigate") {
  const _0x4be942 = parseUrlProtocol(_0x5d2c64) || "unknown";
  console.warn("[Main] 已拦截自定义协议(" + _0x4be942 + _0x1da60b + "/" + _0x4861e8 + "): " + _0x5d2c64);
}
function createExternalLinkOpenHandler(_0x4d3e76 = "web") {
  return ({
    url: _0x7d103c
  }) => {
    if (_0x7d103c && isBlockedExternalProtocol(_0x7d103c)) {
      logBlockedExternalProtocol(_0x7d103c, _0x4d3e76, "window-open");
    }
    return {
      action: "deny"
    };
  };
}
function attachProtocolGuard(_0x320f86, _0x26ff71 = "web") {
  if (!_0x320f86 || _0x320f86.__radarProtocolGuardAttached) {
    return;
  }
  _0x320f86.__radarProtocolGuardAttached = true;
  const _0x34b2fc = (_0xc3e8c7, _0xf920e1, _0xb36712) => {
    if (!_0xf920e1 || !isBlockedExternalProtocol(_0xf920e1)) {
      return;
    }
    if (_0xc3e8c7 && typeof _0xc3e8c7.preventDefault === "function") {
      _0xc3e8c7.preventDefault();
    }
    logBlockedExternalProtocol(_0xf920e1, _0x26ff71, _0xb36712);
  };
  _0x320f86.on("will-navigate", (_0x54b9f5, _0x28c366) => _0x34b2fc(_0x54b9f5, _0x28c366, "navigate"));
  _0x320f86.on("will-redirect", (_0x4b4a70, _0x50825c) => _0x34b2fc(_0x4b4a70, _0x50825c, "redirect"));
  _0x320f86.setWindowOpenHandler(createExternalLinkOpenHandler(_0x26ff71));
}
function configureSessionExternalProtocolGuard(_0x5f04a3) {
  if (!_0x5f04a3 || configuredExternalProtocolSessions.has(_0x5f04a3)) {
    return;
  }
  configuredExternalProtocolSessions.add(_0x5f04a3);
  const _0x4d65a1 = _0x5248e1 => {
    if (!_0x5248e1) {
      return false;
    }
    return isBlockedExternalProtocol(_0x5248e1);
  };
  _0x5f04a3.setPermissionCheckHandler((_0x15ecc3, _0x5173f4, _0x3680bb, _0x132721) => {
    if (_0x5173f4 !== "openExternal") {
      return true;
    }
    const _0x3825d5 = _0x132721?.externalURL;
    if (_0x4d65a1(_0x3825d5)) {
      logBlockedExternalProtocol(_0x3825d5, "session", "openExternal-check");
      return false;
    }
    return true;
  });
  _0x5f04a3.setPermissionRequestHandler((_0x26c7e0, _0x52bbdf, _0x446e6c, _0x2fa1db) => {
    if (_0x52bbdf !== "openExternal") {
      _0x446e6c(true);
      return;
    }
    const _0x534953 = _0x2fa1db?.externalURL;
    if (_0x4d65a1(_0x534953)) {
      logBlockedExternalProtocol(_0x534953, "session", "openExternal-request");
      _0x446e6c(false);
      return;
    }
    _0x446e6c(true);
  });
  if (!_0x5f04a3.__radarProtocolRequestBlocker) {
    _0x5f04a3.__radarProtocolRequestBlocker = true;
    try {
      _0x5f04a3.webRequest.onBeforeRequest({
        urls: ["<all_urls>"]
      }, (_0x43f6c4, _0x11132c) => {
        if (isBlockedExternalProtocol(_0x43f6c4.url)) {
          logBlockedExternalProtocol(_0x43f6c4.url, "session", "before-request");
          _0x11132c({
            cancel: true
          });
          return;
        }
        _0x11132c({});
      });
    } catch (_0x4cc36f) {
      console.warn("[Main] 协议网络层拦截注册失败: " + _0x4cc36f.message);
    }
  }
}
function installShellOpenExternalGuard() {
  if (shellOpenExternalGuardInstalled || !shell?.openExternal) {
    return;
  }
  shellOpenExternalGuardInstalled = true;
  const _0x23c3f4 = shell.openExternal.bind(shell);
  shell.openExternal = async (_0x3fa2dd, _0x33667b) => {
    if (isBlockedExternalProtocol(_0x3fa2dd)) {
      logBlockedExternalProtocol(_0x3fa2dd, "shell", "openExternal");
      return "";
    }
    return _0x23c3f4(_0x3fa2dd, _0x33667b);
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
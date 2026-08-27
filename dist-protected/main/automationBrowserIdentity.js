'use strict';

function normalizeChromeVersion(_0x536598) {
  const _0x12ebcc = String(_0x536598 || "").match(/^(\d+)(?:\.(\d+))?(?:\.(\d+))?(?:\.(\d+))?/);
  if (!_0x12ebcc) {
    return "124.0.6367.207";
  }
  return [_0x12ebcc[1], _0x12ebcc[2] || "0", _0x12ebcc[3] || "0", _0x12ebcc[4] || "0"].join(".");
}
function resolveAutomationPlatform(_0x4940ca = process.platform) {
  if (_0x4940ca === "win32") {
    return {
      userAgentPlatform: "Windows NT 10.0; Win64; x64",
      clientHintPlatform: "Windows"
    };
  }
  if (_0x4940ca === "darwin") {
    return {
      userAgentPlatform: "Macintosh; Intel Mac OS X 10_15_7",
      clientHintPlatform: "macOS"
    };
  }
  return {
    userAgentPlatform: "X11; Linux x86_64",
    clientHintPlatform: "Linux"
  };
}
function buildAutomationBrowserIdentity({
  platform = process.platform,
  chromeVersion = "124.0.6367.207"
} = {}) {
  const _0x57ed0e = normalizeChromeVersion(chromeVersion);
  const _0x27f74d = resolveAutomationPlatform(platform);
  return {
    chromeVersion: _0x57ed0e,
    chromeMajor: _0x57ed0e.split(".")[0],
    clientHintPlatform: _0x27f74d.clientHintPlatform,
    userAgent: "Mozilla/5.0 (" + _0x27f74d.userAgentPlatform + ") AppleWebKit/537.36 " + ("(KHTML, like Gecko) Chrome/" + _0x57ed0e + " Safari/537.36")
  };
}
module.exports = {
  buildAutomationBrowserIdentity: buildAutomationBrowserIdentity,
  normalizeChromeVersion: normalizeChromeVersion,
  resolveAutomationPlatform: resolveAutomationPlatform
};
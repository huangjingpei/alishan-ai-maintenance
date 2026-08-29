'use strict';

function normalizeChromeVersion(arg1) {
  const result = String(arg1 || "").match(/^(\d+)(?:\.(\d+))?(?:\.(\d+))?(?:\.(\d+))?/);
  if (!result) {
    return "124.0.6367.207";
  }
  return [result[1], result[2] || "0", result[3] || "0", result[4] || "0"].join(".");
}
function resolveAutomationPlatform(arg1 = process.platform) {
  if (arg1 === "win32") {
    return {
      userAgentPlatform: "Windows NT 10.0; Win64; x64",
      clientHintPlatform: "Windows"
    };
  }
  if (arg1 === "darwin") {
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
  const result = normalizeChromeVersion(chromeVersion);
  const result2 = resolveAutomationPlatform(platform);
  return {
    chromeVersion: result,
    chromeMajor: result.split(".")[0],
    clientHintPlatform: result2.clientHintPlatform,
    userAgent: "Mozilla/5.0 (" + result2.userAgentPlatform + ") AppleWebKit/537.36 " + ("(KHTML, like Gecko) Chrome/" + result + " Safari/537.36")
  };
}
module.exports = {
  buildAutomationBrowserIdentity: buildAutomationBrowserIdentity,
  normalizeChromeVersion: normalizeChromeVersion,
  resolveAutomationPlatform: resolveAutomationPlatform
};
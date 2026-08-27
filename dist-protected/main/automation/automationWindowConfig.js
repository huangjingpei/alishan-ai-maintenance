const path = require("path");
function getAutomationWindowOptions(_0x5179c9, _0x48c4bc = {}) {
  const {
    width = 1200,
    height = 800,
    preloadPath = path.join(__dirname, "../../automation-preload.js")
  } = _0x48c4bc;
  const _0x2a2390 = _0x5179c9 ? "persist:douyin_" + _0x5179c9 : "persist:douyin_default";
  return {
    x: -10000,
    y: 0,
    width: width,
    height: height,
    useContentSize: true,
    show: false,
    frame: false,
    skipTaskbar: true,
    focusable: true,
    webPreferences: {
      preload: preloadPath,
      partition: _0x2a2390,
      nodeIntegration: false,
      contextIsolation: false,
      backgroundThrottling: false,
      webSecurity: false,
      allowRunningInsecureContent: true
    }
  };
}
module.exports = {
  getAutomationWindowOptions: getAutomationWindowOptions
};
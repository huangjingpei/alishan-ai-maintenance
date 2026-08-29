const path = require("path");
function getAutomationWindowOptions(arg1, options = {}) {
  const {
    width = 1200,
    height = 800,
    preloadPath = path.join(__dirname, "../../automation-preload.js")
  } = options;
  const value = arg1 ? "persist:douyin_" + arg1 : "persist:douyin_default";
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
      partition: value,
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
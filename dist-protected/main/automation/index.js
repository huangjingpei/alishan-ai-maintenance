const {
  automationWindowManager
} = require("./automationWindowManager");
const {
  automationScreencastBridge
} = require("./automationScreencastBridge");
const {
  setupAutomationIpcRouter
} = require("./automationIpcRouter");
const {
  getAutomationWindowOptions
} = require("./automationWindowConfig");
module.exports = {
  automationWindowManager: automationWindowManager,
  automationScreencastBridge: automationScreencastBridge,
  setupAutomationIpcRouter: setupAutomationIpcRouter,
  getAutomationWindowOptions: getAutomationWindowOptions
};
'use strict';

const axios = require("axios");
const crypto = require("crypto");
const {
  ipcMain
} = require("electron");
function createAuthService(arg1) {
  const {
    store: store,
    getApiBase: getApiBase,
    productSlug: productSlug,
    productToken: productToken,
    jwtSecret: jwtSecret,
    appVersion: appVersion,
    getRobustDeviceID: getRobustDeviceID,
    getIsCurrentUserFree: getIsCurrentUserFree,
    setIsCurrentUserFree: setIsCurrentUserFree,
    persistAuthLicenseSnapshot: persistAuthLicenseSnapshot,
    runtimeConfig: runtimeConfig,
    stopMessageCenterIfNeeded: stopMessageCenterIfNeeded,
    stopXianyuMonitorIfNeeded: stopXianyuMonitorIfNeeded,
    syncChatNotificationMonitor: syncChatNotificationMonitor,
    isBackgroundChatMonitorEnabled: isBackgroundChatMonitorEnabled,
    failoverToApiBase2: failoverToApiBase2,
    getMainWindow: getMainWindow,
    radarDeviceHeaders: radarDeviceHeaders
  } = arg1;
  function generateSign(arg1, arg2) {
    return crypto.createHmac("sha256", arg2).update(arg1).digest("hex");
  }
  function isTransientAuthNetworkError(arg1) {
    if (!arg1) {
      return false;
    }
    if (!arg1.response) {
      return true;
    }
    const result = String(arg1.code || "");
    return ["ECONNABORTED", "ECONNRESET", "ENOTFOUND", "ETIMEDOUT", "ERR_NETWORK", "EAI_AGAIN"].includes(result);
  }
  const num = 86400000;
  function buildOfflineAuthCheckResult(text = "network") {
    const local = store.get("auth_license") || {};
    const result = store.get("auth_code");
    const result2 = store.get("auth_token");
    const local2 = !!local.isTrial || local.licenseType === "trial";
    const local3 = !local.isFree && !local.isTrial || local.licenseType === "pro";
    if (local.expireTime && new Date(local.expireTime) < new Date() && !local2) {
      return null;
    }
    const local4 = Number(local.updatedAt) || 0;
    if (!local4 || Date.now() - local4 > num) {
      console.warn("[Auth] 离线授权缓存已超过 " + Math.round(num / 3600000) + " 小时或缺少 updatedAt，拒绝离线放行");
      return null;
    }
    if (local2 && result2) {
      setIsCurrentUserFree(false);
      return {
        success: true,
        offline: true,
        isFree: false,
        isTrial: true,
        msg: text === "network" ? "网络异常，已使用本地试用授权缓存" : "离线模式（试用）",
        expireTime: local.expireTime || null,
        aiQuota: local.aiQuota ?? 0,
        planType: local.planType || null,
        personaTestQuota: local.personaTestQuota || null,
        workPublishQuota: local.workPublishQuota || null,
        savedCode: result
      };
    }
    if (local3 && (result || result2)) {
      setIsCurrentUserFree(false);
      return {
        success: true,
        offline: true,
        isFree: false,
        isTrial: false,
        msg: text === "network" ? "网络异常，已使用本地授权缓存" : "离线模式（已激活）",
        expireTime: local.expireTime || null,
        aiQuota: local.aiQuota,
        planType: local.planType || null,
        personaTestQuota: local.personaTestQuota || null,
        workPublishQuota: local.workPublishQuota || null,
        savedCode: result
      };
    }
    return null;
  }
  let local = null;
  async function fn4() {
    if (local) {
      return local;
    }
    local = fn5().finally(() => {
      local = null;
    });
    return local;
  }
  async function fn5() {
    try {
      const result = store.get("auth_token");
      const result2 = store.get("auth_code");
      try {
        const result3 = getRobustDeviceID();
        const result4 = Math.floor(Date.now() / 1000).toString();
        const result5 = generateSign(productSlug + result3 + result4, productToken);
        const os = require("os");
        const result6 = os.networkInterfaces();
        let text = "127.0.0.1";
        for (const item of Object.keys(result6)) {
          for (const item2 of result6[item]) {
            if (item2.family === "IPv4" && !item2.internal) {
              text = item2.address;
              break;
            }
          }
        }
        const result7 = await axios.post(getApiBase() + "/device/report", {
          deviceId: result3,
          slug: productSlug,
          osVersion: process.getSystemVersion(),
          modelName: os.hostname(),
          cpuInfo: os.cpus()[0].model,
          memoryInfo: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + " GB",
          localIp: text,
          appVersion: appVersion,
          ts: result4,
          sign: result5
        }, {
          headers: result ? {
            Authorization: "Bearer " + result
          } : {},
          timeout: 5000
        });
        if (result7.data.code === 200 || result7.data.success) {
          const local = result7.data.data || result7.data;
          const value = local.status;
          const value2 = local.expireTime;
          let local2 = value2 && new Date(value2) < new Date();
          let flag = false;
          let local3 = value2;
          let flag2 = false;
          if (local.isTrial) {
            if (local.aiQuota <= 0) {
              local2 = true;
              flag2 = true;
            } else if (value2) {
              local3 = value2;
              if (new Date(value2) < new Date()) {
                local2 = true;
                flag = true;
              }
            }
          }
          if (local.isPaid === false && !local.isTrial) {
            local2 = true;
          }
          if (value === "active" && !local2) {
            if (local.token) {
              store.set("auth_token", local.token);
            }
            const value = local.isPaid === true;
            const local2 = !!local.isTrial && !value;
            setIsCurrentUserFree(!value && !local2);
            if (getIsCurrentUserFree()) {
              stopMessageCenterIfNeeded();
            } else {
              syncChatNotificationMonitor({
                immediate: isBackgroundChatMonitorEnabled()
              });
            }
            persistAuthLicenseSnapshot({
              isFree: getIsCurrentUserFree(),
              isTrial: local2,
              planType: local.planType || "",
              expireTime: local3,
              aiQuota: local.aiQuota,
              personaTestQuota: local.personaTestQuota || null,
              workPublishQuota: local.workPublishQuota || null
            });
            runtimeConfig.ensureFetchedInBackground("check-auth");
            return {
              success: true,
              msg: "验证通过",
              expireTime: local3,
              isFree: getIsCurrentUserFree(),
              aiQuota: local.aiQuota,
              isTrial: local2,
              planType: local.planType || null,
              personaTestQuota: local.personaTestQuota || null,
              workPublishQuota: local.workPublishQuota || null,
              savedCode: result2
            };
          } else if (value === "blocked") {
            setIsCurrentUserFree(true);
            stopXianyuMonitorIfNeeded();
            stopMessageCenterIfNeeded();
            return {
              success: false,
              msg: "该设备已被封禁"
            };
          } else if (local2) {
            setIsCurrentUserFree(true);
            stopXianyuMonitorIfNeeded();
            stopMessageCenterIfNeeded();
            const value = flag2 ? "您的试用期 AI 额度已耗尽，请激活专业版" : flag ? "您的试用期已结束，已自动切换为未激活状态" : "授权已过期";
            persistAuthLicenseSnapshot({
              isFree: true,
              isTrial: false,
              planType: ""
            });
            return {
              success: true,
              isFree: true,
              isTrial: false,
              msg: value,
              aiQuota: 0,
              expireTime: null,
              planType: null,
              personaTestQuota: local.personaTestQuota || null,
              savedCode: null
            };
          }
        }
      } catch (error) {
        console.error("[Auth] 设备状态同步失败:", error.message);
      }
      if (result2) {
        const result = await internalActivate(result2);
        if (result.success) {
          setIsCurrentUserFree(false);
          persistAuthLicenseSnapshot({
            isFree: false,
            isTrial: false,
            planType: result.planType || "",
            expireTime: result.expireTime || null
          });
          runtimeConfig.ensureFetchedInBackground("check-auth-reactivate");
          return {
            ...result,
            isFree: false,
            isTrial: false
          };
        }
        const value = result.networkError ? buildOfflineAuthCheckResult("network") : null;
        if (value) {
          return value;
        }
        setIsCurrentUserFree(true);
        stopMessageCenterIfNeeded();
        return {
          success: true,
          isFree: true,
          isTrial: false,
          msg: result.msg,
          savedCode: result2
        };
      }
      const result3 = buildOfflineAuthCheckResult("network");
      if (result3) {
        return result3;
      }
      setIsCurrentUserFree(true);
      stopMessageCenterIfNeeded();
      return {
        success: true,
        isFree: true,
        msg: "授权未激活",
        savedCode: null
      };
    } catch (error) {
      const result = buildOfflineAuthCheckResult("network");
      if (result) {
        return result;
      }
      setIsCurrentUserFree(true);
      stopMessageCenterIfNeeded();
      return {
        success: true,
        isFree: true,
        msg: "离线模式（未激活）",
        savedCode: store.get("auth_code")
      };
    }
  }
  async function internalActivate(arg1) {
    if (!arg1 || arg1.length < 5) {
      return {
        success: false,
        msg: "授权码格式不正确"
      };
    }
    console.log("[Auth] 正在发起激活请求: code=" + arg1);
    const {
      isApiBaseConnResetError: isApiBaseConnResetError
    } = require("./apiBaseRegion");
    const local = () => {
      const result = getRobustDeviceID();
      const result2 = Math.floor(Date.now() / 1000);
      let text = "";
      if (productToken) {
        text = crypto.createHmac("sha256", productToken).update("" + arg1 + result + result2).digest("hex");
      } else if (jwtSecret) {
        text = crypto.createHash("md5").update(arg1 + result + result2 + jwtSecret).digest("hex");
      }
      return {
        deviceID: result,
        body: {
          authCode: arg1,
          deviceId: result,
          slug: productSlug,
          timestamp: result2,
          sign: text,
          signVer: productToken ? 2 : 1
        }
      };
    };
    const local2 = arg12 => {
      const local = arg12 || {};
      const local2 = local.message || local.Message || local.msg || "未知错误";
      console.log("[Auth] 接口处理结果: success=" + local.success + ", msg=" + local2);
      if (local.success || local.token) {
        console.log("[Auth] 激活成功，正在持久化授权码...");
        store.set("auth_code", arg1);
        if (local.token) {
          store.set("auth_token", local.token);
        }
        const local2 = local.planType || local.PlanType || "";
        const local3 = local.expireTime || local.ExpireTime;
        persistAuthLicenseSnapshot({
          isFree: false,
          isTrial: false,
          planType: local2,
          expireTime: local3 || null
        });
        runtimeConfig.ensureFetchedInBackground("activate");
        return {
          success: true,
          expireTime: local3,
          planType: local2 || null,
          isFree: false,
          isTrial: false,
          msg: "激活成功",
          savedCode: arg1
        };
      }
      return {
        success: false,
        msg: local2,
        raw: local
      };
    };
    const local3 = async () => {
      const {
        body: body
      } = local();
      const result = await axios.post(getApiBase() + "/auth-codes/use", body);
      return local2(result.data);
    };
    try {
      return await local3();
    } catch (error) {
      if (isApiBaseConnResetError(error) && failoverToApiBase2("auth_econnreset")) {
        try {
          console.log("[Auth] ECONNRESET，已切 apiBase2，静默重试激活…");
          return await local3();
        } catch (error) {
          const local = error.response?.data?.message || error.response?.data?.msg || error.message;
          console.error("[Auth] apiBase2 重试仍失败: " + local);
          return {
            success: false,
            msg: local,
            networkError: isTransientAuthNetworkError(error)
          };
        }
      }
      const local = error.response?.data?.message || error.response?.data?.msg || error.message;
      console.error("[Auth] 激活接口调用异常: " + local);
      return {
        success: false,
        msg: local,
        networkError: isTransientAuthNetworkError(error)
      };
    }
  }
  async function autoLogin() {
    const result = store.get("auth_code");
    if (result) {
      console.log("[Auth] 发现本地授权码，正在自动续期 Token...");
      const result2 = await internalActivate(result);
      if (result2.success) {
        console.log("[Auth] 自动续期成功");
      } else {
        console.warn("[Auth] 自动续期失败:", result2.msg);
        const result = getMainWindow();
        if (!result2.networkError && result && !result.isDestroyed()) {
          result.webContents.send("show-auth-modal", result2.msg);
        }
      }
    }
  }
  async function fn8(arg1, arg2) {
    try {
      let result = store.get("auth_token");
      const result2 = getRobustDeviceID();
      const local = async arg1 => {
        return await axios.post(getApiBase() + "/radar/analyze", {
          title: arg2.title,
          content: arg2.content
        }, {
          headers: radarDeviceHeaders(arg1, result2)
        });
      };
      try {
        const result2 = await local(result);
        if (result2.data.code === 200) {
          return {
            success: true,
            data: result2.data.data
          };
        } else {
          return {
            success: false,
            msg: result2.data.msg
          };
        }
      } catch (error) {
        if (error.response?.status === 401) {
          console.log("[Auth] Token 过期，尝试自动刷新并重试...");
          await autoLogin();
          result = store.get("auth_token");
          const result2 = await local(result);
          if (result2.data.code === 200) {
            return {
              success: true,
              data: result2.data.data
            };
          } else {
            return {
              success: false,
              msg: result2.data.msg
            };
          }
        }
        throw error;
      }
    } catch (error) {
      return {
        success: false,
        msg: "分析失败"
      };
    }
  }
  function registerIpc() {
    ipcMain.handle("check-auth", async () => {
      return await fn4();
    });
    ipcMain.handle("refresh-auth", async () => {
      const result = await fn4();
      const result2 = store.get("auth_token");
      const local = !!result && result.offline !== true && !!result2;
      let result3 = runtimeConfig.getStatus();
      if (local) {
        try {
          await runtimeConfig.ensureFetched({
            force: true
          });
        } catch (error) {
          console.warn("[Auth] refresh-auth 拉取 runtime-config 失败:", error?.message || error);
        }
        result3 = runtimeConfig.getStatus();
      }
      return {
        ...result,
        connected: local,
        runtimeConfig: result3
      };
    });
    ipcMain.handle("analyze", async (arg1, arg2) => {
      return await fn8(arg1, arg2);
    });
    ipcMain.handle("activate", async (arg1, arg2) => {
      return await internalActivate(arg2);
    });
  }
  return {
    generateSign: generateSign,
    internalActivate: internalActivate,
    autoLogin: autoLogin,
    registerIpc: registerIpc,
    isTransientAuthNetworkError: isTransientAuthNetworkError,
    buildOfflineAuthCheckResult: buildOfflineAuthCheckResult
  };
}
module.exports = {
  createAuthService: createAuthService
};
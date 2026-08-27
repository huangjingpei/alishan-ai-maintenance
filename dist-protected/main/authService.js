'use strict';

const axios = require("axios");
const crypto = require("crypto");
const {
  ipcMain
} = require("electron");
function createAuthService(_0x308d63) {
  const {
    store: _0x23c568,
    getApiBase: _0x367461,
    productSlug: _0x13a8cc,
    productToken: _0x5b6be8,
    jwtSecret: _0x1bf2f8,
    appVersion: _0x465515,
    getRobustDeviceID: _0x2e511b,
    getIsCurrentUserFree: _0xda36df,
    setIsCurrentUserFree: _0x937529,
    persistAuthLicenseSnapshot: _0x3f527e,
    runtimeConfig: _0xa2fde1,
    stopMessageCenterIfNeeded: _0x559c51,
    stopXianyuMonitorIfNeeded: _0x4d3f35,
    syncChatNotificationMonitor: _0x346496,
    isBackgroundChatMonitorEnabled: _0x5d7468,
    failoverToApiBase2: _0x274f7e,
    getMainWindow: _0x334fa9,
    radarDeviceHeaders: _0x44011c
  } = _0x308d63;
  function _0x401dbd(_0x511962, _0x470772) {
    return crypto.createHmac("sha256", _0x470772).update(_0x511962).digest("hex");
  }
  function _0x355b81(_0x4cdc23) {
    if (!_0x4cdc23) {
      return false;
    }
    if (!_0x4cdc23.response) {
      return true;
    }
    const _0x10eb31 = String(_0x4cdc23.code || "");
    return ["ECONNABORTED", "ECONNRESET", "ENOTFOUND", "ETIMEDOUT", "ERR_NETWORK", "EAI_AGAIN"].includes(_0x10eb31);
  }
  const _0x1cba8b = 86400000;
  function _0x18a967(_0x39daab = "network") {
    const _0x725b03 = _0x23c568.get("auth_license") || {};
    const _0x14b6fe = _0x23c568.get("auth_code");
    const _0x497565 = _0x23c568.get("auth_token");
    const _0x3cbf68 = !!_0x725b03.isTrial || _0x725b03.licenseType === "trial";
    const _0x2928d3 = !_0x725b03.isFree && !_0x725b03.isTrial || _0x725b03.licenseType === "pro";
    if (_0x725b03.expireTime && new Date(_0x725b03.expireTime) < new Date() && !_0x3cbf68) {
      return null;
    }
    const _0x5e1fdc = Number(_0x725b03.updatedAt) || 0;
    if (!_0x5e1fdc || Date.now() - _0x5e1fdc > _0x1cba8b) {
      console.warn("[Auth] 离线授权缓存已超过 " + Math.round(_0x1cba8b / 3600000) + " 小时或缺少 updatedAt，拒绝离线放行");
      return null;
    }
    if (_0x3cbf68 && _0x497565) {
      _0x937529(false);
      return {
        success: true,
        offline: true,
        isFree: false,
        isTrial: true,
        msg: _0x39daab === "network" ? "网络异常，已使用本地试用授权缓存" : "离线模式（试用）",
        expireTime: _0x725b03.expireTime || null,
        aiQuota: _0x725b03.aiQuota ?? 0,
        planType: _0x725b03.planType || null,
        personaTestQuota: _0x725b03.personaTestQuota || null,
        workPublishQuota: _0x725b03.workPublishQuota || null,
        savedCode: _0x14b6fe
      };
    }
    if (_0x2928d3 && (_0x14b6fe || _0x497565)) {
      _0x937529(false);
      return {
        success: true,
        offline: true,
        isFree: false,
        isTrial: false,
        msg: _0x39daab === "network" ? "网络异常，已使用本地授权缓存" : "离线模式（已激活）",
        expireTime: _0x725b03.expireTime || null,
        aiQuota: _0x725b03.aiQuota,
        planType: _0x725b03.planType || null,
        personaTestQuota: _0x725b03.personaTestQuota || null,
        workPublishQuota: _0x725b03.workPublishQuota || null,
        savedCode: _0x14b6fe
      };
    }
    return null;
  }
  let _0x87c989 = null;
  async function _0xa53603() {
    if (_0x87c989) {
      return _0x87c989;
    }
    _0x87c989 = _0xe87bbd().finally(() => {
      _0x87c989 = null;
    });
    return _0x87c989;
  }
  async function _0xe87bbd() {
    try {
      const _0x1c5457 = _0x23c568.get("auth_token");
      const _0x4096e0 = _0x23c568.get("auth_code");
      try {
        const _0x21ac43 = _0x2e511b();
        const _0x2c0f65 = Math.floor(Date.now() / 1000).toString();
        const _0x3a9f94 = _0x401dbd(_0x13a8cc + _0x21ac43 + _0x2c0f65, _0x5b6be8);
        const _0x1013dd = require("os");
        const _0x232298 = _0x1013dd.networkInterfaces();
        let _0x23fa59 = "127.0.0.1";
        for (const _0x408130 of Object.keys(_0x232298)) {
          for (const _0x380e4e of _0x232298[_0x408130]) {
            if (_0x380e4e.family === "IPv4" && !_0x380e4e.internal) {
              _0x23fa59 = _0x380e4e.address;
              break;
            }
          }
        }
        const _0x3fbd86 = await axios.post(_0x367461() + "/device/report", {
          deviceId: _0x21ac43,
          slug: _0x13a8cc,
          osVersion: process.getSystemVersion(),
          modelName: _0x1013dd.hostname(),
          cpuInfo: _0x1013dd.cpus()[0].model,
          memoryInfo: (_0x1013dd.totalmem() / 1024 / 1024 / 1024).toFixed(2) + " GB",
          localIp: _0x23fa59,
          appVersion: _0x465515,
          ts: _0x2c0f65,
          sign: _0x3a9f94
        }, {
          headers: _0x1c5457 ? {
            Authorization: "Bearer " + _0x1c5457
          } : {},
          timeout: 5000
        });
        if (_0x3fbd86.data.code === 200 || _0x3fbd86.data.success) {
          const _0x3b2fe8 = _0x3fbd86.data.data || _0x3fbd86.data;
          const _0x11969a = _0x3b2fe8.status;
          const _0x3868f9 = _0x3b2fe8.expireTime;
          let _0x4b5207 = _0x3868f9 && new Date(_0x3868f9) < new Date();
          let _0x4cf68f = false;
          let _0x3b0094 = _0x3868f9;
          let _0x3fa21b = false;
          if (_0x3b2fe8.isTrial) {
            if (_0x3b2fe8.aiQuota <= 0) {
              _0x4b5207 = true;
              _0x3fa21b = true;
            } else if (_0x3868f9) {
              _0x3b0094 = _0x3868f9;
              if (new Date(_0x3868f9) < new Date()) {
                _0x4b5207 = true;
                _0x4cf68f = true;
              }
            }
          }
          if (_0x3b2fe8.isPaid === false && !_0x3b2fe8.isTrial) {
            _0x4b5207 = true;
          }
          if (_0x11969a === "active" && !_0x4b5207) {
            if (_0x3b2fe8.token) {
              _0x23c568.set("auth_token", _0x3b2fe8.token);
            }
            const _0x1a7459 = _0x3b2fe8.isPaid === true;
            const _0x882767 = !!_0x3b2fe8.isTrial && !_0x1a7459;
            _0x937529(!_0x1a7459 && !_0x882767);
            if (_0xda36df()) {
              _0x559c51();
            } else {
              _0x346496({
                immediate: _0x5d7468()
              });
            }
            _0x3f527e({
              isFree: _0xda36df(),
              isTrial: _0x882767,
              planType: _0x3b2fe8.planType || "",
              expireTime: _0x3b0094,
              aiQuota: _0x3b2fe8.aiQuota,
              personaTestQuota: _0x3b2fe8.personaTestQuota || null,
              workPublishQuota: _0x3b2fe8.workPublishQuota || null
            });
            _0xa2fde1.ensureFetchedInBackground("check-auth");
            return {
              success: true,
              msg: "验证通过",
              expireTime: _0x3b0094,
              isFree: _0xda36df(),
              aiQuota: _0x3b2fe8.aiQuota,
              isTrial: _0x882767,
              planType: _0x3b2fe8.planType || null,
              personaTestQuota: _0x3b2fe8.personaTestQuota || null,
              workPublishQuota: _0x3b2fe8.workPublishQuota || null,
              savedCode: _0x4096e0
            };
          } else if (_0x11969a === "blocked") {
            _0x937529(true);
            _0x4d3f35();
            _0x559c51();
            return {
              success: false,
              msg: "该设备已被封禁"
            };
          } else if (_0x4b5207) {
            _0x937529(true);
            _0x4d3f35();
            _0x559c51();
            const _0x2be698 = _0x3fa21b ? "您的试用期 AI 额度已耗尽，请激活专业版" : _0x4cf68f ? "您的试用期已结束，已自动切换为未激活状态" : "授权已过期";
            _0x3f527e({
              isFree: true,
              isTrial: false,
              planType: ""
            });
            return {
              success: true,
              isFree: true,
              isTrial: false,
              msg: _0x2be698,
              aiQuota: 0,
              expireTime: null,
              planType: null,
              personaTestQuota: _0x3b2fe8.personaTestQuota || null,
              savedCode: null
            };
          }
        }
      } catch (_0xff0b14) {
        console.error("[Auth] 设备状态同步失败:", _0xff0b14.message);
      }
      if (_0x4096e0) {
        const _0x1831b5 = await _0x26d191(_0x4096e0);
        if (_0x1831b5.success) {
          _0x937529(false);
          _0x3f527e({
            isFree: false,
            isTrial: false,
            planType: _0x1831b5.planType || "",
            expireTime: _0x1831b5.expireTime || null
          });
          _0xa2fde1.ensureFetchedInBackground("check-auth-reactivate");
          return {
            ..._0x1831b5,
            isFree: false,
            isTrial: false
          };
        }
        const _0x369bf0 = _0x1831b5.networkError ? _0x18a967("network") : null;
        if (_0x369bf0) {
          return _0x369bf0;
        }
        _0x937529(true);
        _0x559c51();
        return {
          success: true,
          isFree: true,
          isTrial: false,
          msg: _0x1831b5.msg,
          savedCode: _0x4096e0
        };
      }
      const _0x23772a = _0x18a967("network");
      if (_0x23772a) {
        return _0x23772a;
      }
      _0x937529(true);
      _0x559c51();
      return {
        success: true,
        isFree: true,
        msg: "授权未激活",
        savedCode: null
      };
    } catch (_0x1a7e2b) {
      const _0x178e18 = _0x18a967("network");
      if (_0x178e18) {
        return _0x178e18;
      }
      _0x937529(true);
      _0x559c51();
      return {
        success: true,
        isFree: true,
        msg: "离线模式（未激活）",
        savedCode: _0x23c568.get("auth_code")
      };
    }
  }
  async function _0x26d191(_0x1fea7f) {
    if (!_0x1fea7f || _0x1fea7f.length < 5) {
      return {
        success: false,
        msg: "授权码格式不正确"
      };
    }
    console.log("[Auth] 正在发起激活请求: code=" + _0x1fea7f);
    const {
      isApiBaseConnResetError: _0x5c1c94
    } = require("./apiBaseRegion");
    const _0x4f59d7 = () => {
      const _0xf9d35b = _0x2e511b();
      const _0x4a8a08 = Math.floor(Date.now() / 1000);
      let _0x3cec66 = "";
      if (_0x5b6be8) {
        _0x3cec66 = crypto.createHmac("sha256", _0x5b6be8).update("" + _0x1fea7f + _0xf9d35b + _0x4a8a08).digest("hex");
      } else if (_0x1bf2f8) {
        _0x3cec66 = crypto.createHash("md5").update(_0x1fea7f + _0xf9d35b + _0x4a8a08 + _0x1bf2f8).digest("hex");
      }
      return {
        deviceID: _0xf9d35b,
        body: {
          authCode: _0x1fea7f,
          deviceId: _0xf9d35b,
          slug: _0x13a8cc,
          timestamp: _0x4a8a08,
          sign: _0x3cec66,
          signVer: _0x5b6be8 ? 2 : 1
        }
      };
    };
    const _0x1debe0 = _0x52b86d => {
      const _0x2b9468 = _0x52b86d || {};
      const _0x2ba330 = _0x2b9468.message || _0x2b9468.Message || _0x2b9468.msg || "未知错误";
      console.log("[Auth] 接口处理结果: success=" + _0x2b9468.success + ", msg=" + _0x2ba330);
      if (_0x2b9468.success || _0x2b9468.token) {
        console.log("[Auth] 激活成功，正在持久化授权码...");
        _0x23c568.set("auth_code", _0x1fea7f);
        if (_0x2b9468.token) {
          _0x23c568.set("auth_token", _0x2b9468.token);
        }
        const _0x3544b1 = _0x2b9468.planType || _0x2b9468.PlanType || "";
        const _0xc90b05 = _0x2b9468.expireTime || _0x2b9468.ExpireTime;
        _0x3f527e({
          isFree: false,
          isTrial: false,
          planType: _0x3544b1,
          expireTime: _0xc90b05 || null
        });
        _0xa2fde1.ensureFetchedInBackground("activate");
        return {
          success: true,
          expireTime: _0xc90b05,
          planType: _0x3544b1 || null,
          isFree: false,
          isTrial: false,
          msg: "激活成功",
          savedCode: _0x1fea7f
        };
      }
      return {
        success: false,
        msg: _0x2ba330,
        raw: _0x2b9468
      };
    };
    const _0x548624 = async () => {
      const {
        body: _0x3c2137
      } = _0x4f59d7();
      const _0x2dcf64 = await axios.post(_0x367461() + "/auth-codes/use", _0x3c2137);
      return _0x1debe0(_0x2dcf64.data);
    };
    try {
      return await _0x548624();
    } catch (_0x5c2d90) {
      if (_0x5c1c94(_0x5c2d90) && _0x274f7e("auth_econnreset")) {
        try {
          console.log("[Auth] ECONNRESET，已切 apiBase2，静默重试激活…");
          return await _0x548624();
        } catch (_0x3f6d53) {
          const _0x3d1d40 = _0x3f6d53.response?.data?.message || _0x3f6d53.response?.data?.msg || _0x3f6d53.message;
          console.error("[Auth] apiBase2 重试仍失败: " + _0x3d1d40);
          return {
            success: false,
            msg: _0x3d1d40,
            networkError: _0x355b81(_0x3f6d53)
          };
        }
      }
      const _0x349546 = _0x5c2d90.response?.data?.message || _0x5c2d90.response?.data?.msg || _0x5c2d90.message;
      console.error("[Auth] 激活接口调用异常: " + _0x349546);
      return {
        success: false,
        msg: _0x349546,
        networkError: _0x355b81(_0x5c2d90)
      };
    }
  }
  async function _0x52ac7e() {
    const _0x3d6256 = _0x23c568.get("auth_code");
    if (_0x3d6256) {
      console.log("[Auth] 发现本地授权码，正在自动续期 Token...");
      const _0x2c834d = await _0x26d191(_0x3d6256);
      if (_0x2c834d.success) {
        console.log("[Auth] 自动续期成功");
      } else {
        console.warn("[Auth] 自动续期失败:", _0x2c834d.msg);
        const _0x2e4189 = _0x334fa9();
        if (!_0x2c834d.networkError && _0x2e4189 && !_0x2e4189.isDestroyed()) {
          _0x2e4189.webContents.send("show-auth-modal", _0x2c834d.msg);
        }
      }
    }
  }
  async function _0x167d46(_0x138118, _0x345c84) {
    try {
      let _0x3a0162 = _0x23c568.get("auth_token");
      const _0x38889a = _0x2e511b();
      const _0x416e95 = async _0x38f3eb => {
        return await axios.post(_0x367461() + "/radar/analyze", {
          title: _0x345c84.title,
          content: _0x345c84.content
        }, {
          headers: _0x44011c(_0x38f3eb, _0x38889a)
        });
      };
      try {
        const _0x29b72a = await _0x416e95(_0x3a0162);
        if (_0x29b72a.data.code === 200) {
          return {
            success: true,
            data: _0x29b72a.data.data
          };
        } else {
          return {
            success: false,
            msg: _0x29b72a.data.msg
          };
        }
      } catch (_0x1d318c) {
        if (_0x1d318c.response?.status === 401) {
          console.log("[Auth] Token 过期，尝试自动刷新并重试...");
          await _0x52ac7e();
          _0x3a0162 = _0x23c568.get("auth_token");
          const _0x1e4344 = await _0x416e95(_0x3a0162);
          if (_0x1e4344.data.code === 200) {
            return {
              success: true,
              data: _0x1e4344.data.data
            };
          } else {
            return {
              success: false,
              msg: _0x1e4344.data.msg
            };
          }
        }
        throw _0x1d318c;
      }
    } catch (_0x137b71) {
      return {
        success: false,
        msg: "分析失败"
      };
    }
  }
  function _0x3a4d73() {
    ipcMain.handle("check-auth", async () => {
      return await _0xa53603();
    });
    ipcMain.handle("refresh-auth", async () => {
      const _0x4a91c2 = await _0xa53603();
      const _0x2da6ec = _0x23c568.get("auth_token");
      const _0x3e9647 = !!_0x4a91c2 && _0x4a91c2.offline !== true && !!_0x2da6ec;
      let _0xc9e751 = _0xa2fde1.getStatus();
      if (_0x3e9647) {
        try {
          await _0xa2fde1.ensureFetched({
            force: true
          });
        } catch (_0x40ab8d) {
          console.warn("[Auth] refresh-auth 拉取 runtime-config 失败:", _0x40ab8d?.message || _0x40ab8d);
        }
        _0xc9e751 = _0xa2fde1.getStatus();
      }
      return {
        ..._0x4a91c2,
        connected: _0x3e9647,
        runtimeConfig: _0xc9e751
      };
    });
    ipcMain.handle("analyze", async (_0x5b202c, _0x4cba06) => {
      return await _0x167d46(_0x5b202c, _0x4cba06);
    });
    ipcMain.handle("activate", async (_0x52837a, _0x5963da) => {
      return await _0x26d191(_0x5963da);
    });
  }
  return {
    generateSign: _0x401dbd,
    internalActivate: _0x26d191,
    autoLogin: _0x52ac7e,
    registerIpc: _0x3a4d73,
    isTransientAuthNetworkError: _0x355b81,
    buildOfflineAuthCheckResult: _0x18a967
  };
}
module.exports = {
  createAuthService: createAuthService
};
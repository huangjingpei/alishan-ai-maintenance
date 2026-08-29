(function injectMinimalStealth() {
  'use strict';

  try {
    const value = navigator.userAgent;
    const result = value.match(/Chrome\/([\d.]+)/);
    if (result && navigator.userAgentData) {
      const value = result[1];
      const value2 = value.split(".")[0];
      const list = [{
        brand: "Chromium",
        version: value2
      }, {
        brand: "Google Chrome",
        version: value2
      }, {
        brand: "Not:A-Brand",
        version: "99"
      }];
      const list2 = [{
        brand: "Chromium",
        version: value
      }, {
        brand: "Google Chrome",
        version: value
      }, {
        brand: "Not:A-Brand",
        version: "99.0.0.0"
      }];
      const obj = {
        brands: list,
        mobile: false,
        platform: "macOS",
        getHighEntropyValues: async function (arg1) {
          const obj = {};
          if (arg1.includes("brands")) {
            obj.brands = list;
          }
          if (arg1.includes("mobile")) {
            obj.mobile = false;
          }
          if (arg1.includes("platform")) {
            obj.platform = "macOS";
          }
          if (arg1.includes("platformVersion")) {
            obj.platformVersion = "14.4.0";
          }
          if (arg1.includes("architecture")) {
            obj.architecture = "x86";
          }
          if (arg1.includes("bitness")) {
            obj.bitness = "64";
          }
          if (arg1.includes("model")) {
            obj.model = "";
          }
          if (arg1.includes("uaFullVersion")) {
            obj.uaFullVersion = value;
          }
          if (arg1.includes("fullVersionList")) {
            obj.fullVersionList = list2;
          }
          return obj;
        }
      };
      Object.defineProperty(navigator, "userAgentData", {
        value: obj,
        configurable: true,
        enumerable: true,
        writable: false
      });
    }
  } catch (error) {
    console.warn("[🔬 灰度诊断] mock userAgentData 失败", error);
  }
  document.addEventListener("DOMContentLoaded", () => {
    const obj = {
      url: window.location.href,
      userAgent: navigator.userAgent,
      webdriver: navigator.webdriver,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: navigator.deviceMemory,
      visibilityState: document.visibilityState,
      hidden: document.hidden,
      languages: navigator.languages,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      cookieCount: (document.cookie || "").split(";").filter(arg1 => arg1.trim()).length,
      hasRadarGlobal: typeof window._radar_compat_active !== "undefined",
      consoleErrorIsNative: /\[native code\]/.test(Function.prototype.toString.call(console.error)),
      title: document.title
    };
    console.log("%c[🔬 灰度诊断] 页面环境快照:", "color: #f59e0b; font-weight: bold;", JSON.stringify(obj, null, 2));
    setTimeout(() => {
      const value = document.body;
      const result = (value?.innerText || value?.textContent || "").trim();
      const local = document.querySelector("[data-e2e=\"error-page\"]") || document.querySelector(".Ms08YIEh");
      const local2 = local || /无此用户|该用户不存在|用户不存在|账号已被封禁/.test(result);
      if (local2) {
        console.error("%c[🔬 灰度诊断] ❌ 命中\"用户不存在\"错误页！", "color: #ef4444; font-weight: bold; font-size: 14px;");
        console.log("%c[🔬 灰度诊断] 页面标题: " + document.title, "color: #ef4444;");
        console.log("%c[🔬 灰度诊断] 页面正文前200字: " + result.substring(0, 200), "color: #ef4444;");
      } else {
        console.log("%c[🔬 灰度诊断] ✅ 页面正常加载，未命中错误页", "color: #10b981; font-weight: bold; font-size: 14px;");
      }
    }, 3000);
  });
})();
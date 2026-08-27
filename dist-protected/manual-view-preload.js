(function injectMinimalStealth() {
  'use strict';

  try {
    const _0x5b8394 = navigator.userAgent;
    const _0x176cee = _0x5b8394.match(/Chrome\/([\d.]+)/);
    if (_0x176cee && navigator.userAgentData) {
      const _0x72d7c8 = _0x176cee[1];
      const _0xd1ca1a = _0x72d7c8.split(".")[0];
      const _0x2bd9ff = [{
        brand: "Chromium",
        version: _0xd1ca1a
      }, {
        brand: "Google Chrome",
        version: _0xd1ca1a
      }, {
        brand: "Not:A-Brand",
        version: "99"
      }];
      const _0x93637 = [{
        brand: "Chromium",
        version: _0x72d7c8
      }, {
        brand: "Google Chrome",
        version: _0x72d7c8
      }, {
        brand: "Not:A-Brand",
        version: "99.0.0.0"
      }];
      const _0x4cab67 = {
        brands: _0x2bd9ff,
        mobile: false,
        platform: "macOS",
        getHighEntropyValues: async function (_0x4be5ba) {
          const _0x44ca8a = {};
          if (_0x4be5ba.includes("brands")) {
            _0x44ca8a.brands = _0x2bd9ff;
          }
          if (_0x4be5ba.includes("mobile")) {
            _0x44ca8a.mobile = false;
          }
          if (_0x4be5ba.includes("platform")) {
            _0x44ca8a.platform = "macOS";
          }
          if (_0x4be5ba.includes("platformVersion")) {
            _0x44ca8a.platformVersion = "14.4.0";
          }
          if (_0x4be5ba.includes("architecture")) {
            _0x44ca8a.architecture = "x86";
          }
          if (_0x4be5ba.includes("bitness")) {
            _0x44ca8a.bitness = "64";
          }
          if (_0x4be5ba.includes("model")) {
            _0x44ca8a.model = "";
          }
          if (_0x4be5ba.includes("uaFullVersion")) {
            _0x44ca8a.uaFullVersion = _0x72d7c8;
          }
          if (_0x4be5ba.includes("fullVersionList")) {
            _0x44ca8a.fullVersionList = _0x93637;
          }
          return _0x44ca8a;
        }
      };
      Object.defineProperty(navigator, "userAgentData", {
        value: _0x4cab67,
        configurable: true,
        enumerable: true,
        writable: false
      });
    }
  } catch (_0x4a603a) {
    console.warn("[🔬 灰度诊断] mock userAgentData 失败", _0x4a603a);
  }
  document.addEventListener("DOMContentLoaded", () => {
    const _0x19b415 = {
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
      cookieCount: (document.cookie || "").split(";").filter(_0x307692 => _0x307692.trim()).length,
      hasRadarGlobal: typeof window._radar_compat_active !== "undefined",
      consoleErrorIsNative: /\[native code\]/.test(Function.prototype.toString.call(console.error)),
      title: document.title
    };
    console.log("%c[🔬 灰度诊断] 页面环境快照:", "color: #f59e0b; font-weight: bold;", JSON.stringify(_0x19b415, null, 2));
    setTimeout(() => {
      const _0x3fcf63 = document.body;
      const _0x29dec4 = (_0x3fcf63?.innerText || _0x3fcf63?.textContent || "").trim();
      const _0x2fc1ee = document.querySelector("[data-e2e=\"error-page\"]") || document.querySelector(".Ms08YIEh");
      const _0x47d32a = _0x2fc1ee || /无此用户|该用户不存在|用户不存在|账号已被封禁/.test(_0x29dec4);
      if (_0x47d32a) {
        console.error("%c[🔬 灰度诊断] ❌ 命中\"用户不存在\"错误页！", "color: #ef4444; font-weight: bold; font-size: 14px;");
        console.log("%c[🔬 灰度诊断] 页面标题: " + document.title, "color: #ef4444;");
        console.log("%c[🔬 灰度诊断] 页面正文前200字: " + _0x29dec4.substring(0, 200), "color: #ef4444;");
      } else {
        console.log("%c[🔬 灰度诊断] ✅ 页面正常加载，未命中错误页", "color: #10b981; font-weight: bold; font-size: 14px;");
      }
    }, 3000);
  });
})();
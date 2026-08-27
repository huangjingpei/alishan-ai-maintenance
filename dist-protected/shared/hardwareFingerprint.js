'use strict';

const GPU_PROFILES_WINDOWS = [{
  vendor: "Google Inc. (NVIDIA)",
  renderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0, D3D11-31.0.15.3623)",
  cores: 8,
  memory: 8
}, {
  vendor: "Google Inc. (NVIDIA)",
  renderer: "ANGLE (NVIDIA, NVIDIA GeForce GTX 1660 SUPER Direct3D11 vs_5_0 ps_5_0, D3D11-30.0.14.7212)",
  cores: 6,
  memory: 8
}, {
  vendor: "Google Inc. (NVIDIA)",
  renderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 3070 Direct3D11 vs_5_0 ps_5_0, D3D11-31.0.15.3179)",
  cores: 8,
  memory: 16
}, {
  vendor: "Google Inc. (Intel)",
  renderer: "ANGLE (Intel, Intel(R) UHD Graphics 630 Direct3D11 vs_5_0 ps_5_0, D3D11-27.20.100.9466)",
  cores: 4,
  memory: 8
}, {
  vendor: "Google Inc. (AMD)",
  renderer: "ANGLE (AMD, AMD Radeon(TM) Graphics Direct3D11 vs_5_0 ps_5_0, D3D11-30.0.13028.1000)",
  cores: 8,
  memory: 16
}, {
  vendor: "Google Inc. (NVIDIA)",
  renderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 4060 Direct3D11 vs_5_0 ps_5_0, D3D11-31.0.15.3713)",
  cores: 8,
  memory: 16
}];
const GPU_PROFILES_DARWIN = [{
  vendor: "Google Inc. (Apple)",
  renderer: "ANGLE (Apple, Apple M1, OpenGL 4.1)",
  cores: 8,
  memory: 8
}, {
  vendor: "Google Inc. (Apple)",
  renderer: "ANGLE (Apple, Apple M2, OpenGL 4.1)",
  cores: 8,
  memory: 16
}, {
  vendor: "Google Inc. (Apple)",
  renderer: "ANGLE (Apple, Apple M3, OpenGL 4.1)",
  cores: 8,
  memory: 16
}, {
  vendor: "Google Inc. (Intel Inc.)",
  renderer: "ANGLE (Intel Inc., Intel(R) Iris(TM) Plus Graphics 640 OpenGL Engine, OpenGL 4.1)",
  cores: 4,
  memory: 8
}];
function stringHash(_0x5cf47d) {
  let _0x5639ec = 5381;
  const _0x3b2d8b = String(_0x5cf47d || "");
  for (let _0x144610 = 0; _0x144610 < _0x3b2d8b.length; _0x144610 += 1) {
    _0x5639ec = _0x5639ec * 33 ^ _0x3b2d8b.charCodeAt(_0x144610);
  }
  return _0x5639ec >>> 0;
}
function generateFingerprintSeed(_0x4f39b1 = "fp_v1") {
  const _0x23e903 = Math.random().toString(36).substring(2, 10);
  const _0x4b895a = Date.now().toString(36);
  return _0x4f39b1 + "_" + _0x4b895a + "_" + _0x23e903;
}
function resolveDeviceFingerprintProfile(_0x191fc0, _0x4d6f72 = process.platform) {
  if (!_0x191fc0 || typeof _0x191fc0 !== "string" || _0x191fc0 === "passthrough") {
    return {
      policy: "passthrough"
    };
  }
  const _0x2443a1 = stringHash(_0x191fc0);
  const _0x3380b5 = _0x4d6f72 === "darwin";
  const _0x1415c2 = _0x3380b5 ? GPU_PROFILES_DARWIN : GPU_PROFILES_WINDOWS;
  const _0x5d4ec7 = _0x1415c2[_0x2443a1 % _0x1415c2.length];
  const _0x57ff9f = (_0x2443a1 & 255) % 3 - 1;
  const _0x18292e = (_0x2443a1 >> 8 & 255) % 3 - 1;
  const _0x4d0267 = (_0x2443a1 >> 16 & 255) % 3 - 1;
  const _0x269778 = _0x2443a1 % 1000 / 1000 * 2e-7 - 1e-7;
  return {
    policy: "enabled",
    seed: _0x191fc0,
    gpuVendor: _0x5d4ec7.vendor,
    gpuRenderer: _0x5d4ec7.renderer,
    hardwareConcurrency: _0x5d4ec7.cores,
    deviceMemory: _0x5d4ec7.memory,
    noiseR: _0x57ff9f,
    noiseG: _0x18292e,
    noiseB: _0x4d0267,
    audioNoise: _0x269778
  };
}
function buildFingerprintInjectionScript(_0x52baf7, _0x70eb4 = process.platform) {
  const _0x1863bd = resolveDeviceFingerprintProfile(_0x52baf7, _0x70eb4);
  if (_0x1863bd.policy === "passthrough") {
    return "/* Fingerprint Passthrough */";
  }
  const _0x3e9b54 = JSON.stringify(_0x1863bd);
  return "\n    (() => {\n        if (window.__radar_fp_injected) return;\n        window.__radar_fp_injected = true;\n        const config = " + _0x3e9b54 + ";\n\n        try {\n            // 1. 硬件属性遮蔽\n            if (config.hardwareConcurrency) {\n                Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => config.hardwareConcurrency });\n            }\n            if (config.deviceMemory) {\n                Object.defineProperty(navigator, 'deviceMemory', { get: () => config.deviceMemory });\n            }\n\n            // 2. WebGL 显卡厂商与渲染器伪装\n            const patchWebGL = (proto) => {\n                if (!proto || !proto.getParameter) return;\n                const origGetParameter = proto.getParameter;\n                proto.getParameter = function (parameter) {\n                    // UNMASKED_VENDOR_WEBGL = 0x9245\n                    if (parameter === 0x9245) return config.gpuVendor;\n                    // UNMASKED_RENDERER_WEBGL = 0x9246\n                    if (parameter === 0x9246) return config.gpuRenderer;\n                    return origGetParameter.apply(this, arguments);\n                };\n            };\n            if (typeof WebGLRenderingContext !== 'undefined') patchWebGL(WebGLRenderingContext.prototype);\n            if (typeof WebGL2RenderingContext !== 'undefined') patchWebGL(WebGL2RenderingContext.prototype);\n\n            // 3. Canvas 2D 图像微观 RGBA 噪声注入 (对人眼不可见，改变指纹 Hash)\n            if (typeof HTMLCanvasElement !== 'undefined' && typeof CanvasRenderingContext2D !== 'undefined') {\n                const origToDataURL = HTMLCanvasElement.prototype.toDataURL;\n                const origGetImageData = CanvasRenderingContext2D.prototype.getImageData;\n\n                const applyCanvasNoise = (ctx, width, height) => {\n                    if (!width || !height || width <= 0 || height <= 0) return;\n                    try {\n                        const imgData = origGetImageData.call(ctx, 0, 0, Math.min(width, 16), Math.min(height, 16));\n                        const data = imgData.data;\n                        let modified = false;\n                        for (let i = 0; i < data.length; i += 4) {\n                            if (data[i + 3] > 0) { // 仅修改非透明像素\n                                if (config.noiseR) { data[i] = Math.min(255, Math.max(0, data[i] + config.noiseR)); modified = true; }\n                                if (config.noiseG) { data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + config.noiseG)); modified = true; }\n                                if (config.noiseB) { data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + config.noiseB)); modified = true; }\n                            }\n                        }\n                        if (modified) {\n                            ctx.putImageData(imgData, 0, 0);\n                        }\n                    } catch (_) {}\n                };\n\n                HTMLCanvasElement.prototype.toDataURL = function (...args) {\n                    try {\n                        const ctx = this.getContext('2d');\n                        if (ctx && this.width > 0 && this.height > 0) {\n                            applyCanvasNoise(ctx, this.width, this.height);\n                        }\n                    } catch (_) {}\n                    return origToDataURL.apply(this, args);\n                };\n\n                CanvasRenderingContext2D.prototype.getImageData = function (x, y, w, h, ...args) {\n                    const res = origGetImageData.call(this, x, y, w, h, ...args);\n                    if (res && res.data && res.data.length > 0 && (config.noiseR || config.noiseG || config.noiseB)) {\n                        for (let i = 0; i < res.data.length; i += 16) {\n                            if (res.data[i + 3] > 0) {\n                                res.data[i] = Math.min(255, Math.max(0, res.data[i] + config.noiseR));\n                            }\n                        }\n                    }\n                    return res;\n                };\n            }\n\n            // 4. AudioContext 声卡微观浮点噪声注入\n            if (typeof AudioContext !== 'undefined' || typeof OfflineAudioContext !== 'undefined') {\n                const patchAudioBuffer = (buffer) => {\n                    if (!buffer || typeof buffer.getChannelData !== 'function') return;\n                    try {\n                        const data = buffer.getChannelData(0);\n                        if (data && data.length > 10) {\n                            for (let i = 0; i < Math.min(data.length, 100); i += 10) {\n                                data[i] += config.audioNoise;\n                            }\n                        }\n                    } catch (_) {}\n                };\n\n                if (typeof AudioBuffer !== 'undefined' && AudioBuffer.prototype.getChannelData) {\n                    const origGetChannelData = AudioBuffer.prototype.getChannelData;\n                    AudioBuffer.prototype.getChannelData = function (...args) {\n                        const data = origGetChannelData.apply(this, args);\n                        if (data && data.length > 10 && config.audioNoise) {\n                            data[0] += config.audioNoise;\n                        }\n                        return data;\n                    };\n                }\n            }\n\n            console.log('[Fingerprint] 拟真设备硬件伪装与混音噪声已激活 (GPU:', config.gpuRenderer, ')');\n        } catch (e) {\n            console.warn('[Fingerprint] 伪装注入异常:', e.message);\n        }\n    })();\n    ";
}
module.exports = {
  generateFingerprintSeed: generateFingerprintSeed,
  resolveDeviceFingerprintProfile: resolveDeviceFingerprintProfile,
  buildFingerprintInjectionScript: buildFingerprintInjectionScript
};
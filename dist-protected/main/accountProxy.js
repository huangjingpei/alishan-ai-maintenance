const {
  app
} = require("electron");
const axios = require("axios");
const {
  SocksProxyAgent
} = require("socks-proxy-agent");
const ProxyChain = require("proxy-chain");
const {
  normalizeProxyConfig,
  isProxyActive,
  buildProxyRules
} = require("../shared/accountProxy");
const proxyAuthByViewKey = new Map();
const socksBridgeByFingerprint = new Map();
const socksBridgeFpByViewKey = new Map();
const DOUYIN_PROBE_URLS = ["https://douyin.com/", "https://www.douyin.com/"];
const IP_ENDPOINTS = [{
  url: "http://myip.ipip.net",
  plain: true,
  parse: _0x4dbee4 => String(_0x4dbee4).match(/(\d{1,3}(?:\.\d{1,3}){3})/)?.[1] || ""
}, {
  url: "https://qifu-api.baidubce.com/ip/local/geo/v1/district",
  plain: false,
  parse: _0x1813a7 => String(_0x1813a7?.ip || "").trim()
}, {
  url: "http://httpbin.org/ip",
  plain: false,
  parse: _0x198aa4 => String(_0x198aa4?.origin || "").split(",")[0]?.trim() || ""
}, {
  url: "http://ifconfig.me/ip",
  plain: true,
  parse: _0x24d01b => {
    const _0x3a0a40 = String(_0x24d01b || "").trim();
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(_0x3a0a40)) {
      return _0x3a0a40;
    } else {
      return "";
    }
  }
}, {
  url: "http://api.ipify.org/?format=json",
  plain: false,
  parse: _0x56a526 => String(_0x56a526?.ip || "").trim()
}];
function getProxyCredentials(_0x1e8a44) {
  const _0x210a85 = normalizeProxyConfig(_0x1e8a44);
  if (!_0x210a85.username) {
    return null;
  }
  return {
    username: _0x210a85.username,
    password: _0x210a85.password || ""
  };
}
function formatProxyError(_0x22d356) {
  const _0x515c1b = _0x22d356?.response?.status;
  if (_0x515c1b === 502) {
    return "所有测试站点均无法通过代理访问，请检查代理类型（HTTP / SOCKS5）、端口与节点是否正常";
  }
  if (_0x515c1b === 407) {
    return "代理认证失败，请检查用户名与密码";
  }
  if (_0x515c1b === 403) {
    return "代理拒绝访问，请检查账号权限或节点状态";
  }
  if (_0x515c1b) {
    return "代理测试失败（HTTP " + _0x515c1b + "），请检查代理配置与节点是否正常";
  }
  const _0x44ae67 = String(_0x22d356?.message || _0x22d356 || "").trim();
  if (!_0x44ae67) {
    return "代理连接失败，请检查配置";
  }
  if (_0x44ae67.includes("status code 502")) {
    return "所有测试站点均无法通过代理访问，请检查代理类型（HTTP / SOCKS5）、端口与节点是否正常";
  }
  if (_0x44ae67.includes("status code 407")) {
    return "代理认证失败，请检查用户名与密码";
  }
  if (_0x44ae67.includes("SocksClient") || _0x44ae67.includes("Socks5") || _0x44ae67.includes("SOCKS")) {
    return "SOCKS5 连接失败，请确认已选 SOCKS5 类型且端口为 SOCKS5 端口（非 HTTP 端口）";
  }
  if (_0x44ae67.includes("ERR_CONNECTION_REFUSED") || _0x22d356?.code === "ECONNREFUSED") {
    return "无法连接代理服务器，请检查主机、端口及代理软件是否已启动";
  }
  if (_0x22d356?.code === "ECONNABORTED" || _0x22d356?.code === "ETIMEDOUT" || _0x44ae67.includes("超时")) {
    return "连接超时，请检查代理是否可用";
  }
  return _0x44ae67.replace(/^net::/i, "") || "代理连接失败，请检查配置";
}
function findViewKeyForWebContents(_0x2fea04, ..._0x4b016b) {
  if (!_0x2fea04) {
    return null;
  }
  for (const _0x10e32c of _0x4b016b) {
    if (!_0x10e32c || typeof _0x10e32c.entries !== "function") {
      continue;
    }
    for (const [_0x56f7d3, _0x2622f0] of _0x10e32c.entries()) {
      if (_0x2622f0?.webContents === _0x2fea04) {
        return _0x56f7d3;
      }
    }
  }
  return null;
}
function registerProxyLoginHandler(..._0x47cb04) {
  if (registerProxyLoginHandler._registered) {
    return;
  }
  registerProxyLoginHandler._registered = true;
  app.on("login", (_0x3af430, _0x431080, _0x21d7cd, _0x25476c, _0x4d6eba) => {
    if (!_0x25476c?.isProxy) {
      return;
    }
    const _0x5b5208 = findViewKeyForWebContents(_0x431080, ..._0x47cb04);
    if (!_0x5b5208) {
      return;
    }
    const _0x145cdd = proxyAuthByViewKey.get(_0x5b5208);
    if (!_0x145cdd?.username) {
      return;
    }
    _0x3af430.preventDefault();
    _0x4d6eba(_0x145cdd.username, _0x145cdd.password || "");
  });
}
function socksBridgeFingerprint(_0x1cf641) {
  const _0x2f4daa = normalizeProxyConfig(_0x1cf641);
  return "socks5|" + _0x2f4daa.host + "|" + _0x2f4daa.port + "|" + _0x2f4daa.username + "|" + (_0x2f4daa.password || "");
}
function buildUpstreamSocksUrl(_0xb23c09) {
  const _0x4d614e = normalizeProxyConfig(_0xb23c09);
  const _0x14bf73 = _0x4d614e.username ? encodeURIComponent(_0x4d614e.username) + ":" + encodeURIComponent(_0x4d614e.password || "") + "@" : "";
  return "socks5h://" + _0x14bf73 + _0x4d614e.host + ":" + _0x4d614e.port;
}
async function startSocksAuthHttpBridge(_0x17a0fa) {
  const _0x25bf00 = buildUpstreamSocksUrl(_0x17a0fa);
  const _0x16af4c = await ProxyChain.anonymizeProxy(_0x25bf00);
  const _0x37440d = new URL(_0x16af4c);
  const _0x5fac0f = Number(_0x37440d.port);
  if (!_0x5fac0f) {
    throw new Error("本地 SOCKS 桥接端口分配失败");
  }
  console.log("[Proxy-Bridge] 已启动本地桥 " + _0x37440d.host + " → " + normalizeProxyConfig(_0x17a0fa).host + ":" + normalizeProxyConfig(_0x17a0fa).port);
  return {
    localUrl: _0x16af4c,
    host: _0x37440d.hostname || "127.0.0.1",
    port: _0x5fac0f,
    close: async () => {
      try {
        await ProxyChain.closeAnonymizedProxy(_0x16af4c, true);
      } catch (_0x3920bd) {
        console.warn("[Proxy-Bridge] 关闭失败: " + (_0x3920bd.message || _0x3920bd));
      }
    }
  };
}
async function releaseSocksBridgeForViewKey(_0x1209ac) {
  if (!_0x1209ac) {
    return;
  }
  const _0x3874b4 = socksBridgeFpByViewKey.get(_0x1209ac);
  if (!_0x3874b4) {
    return;
  }
  socksBridgeFpByViewKey.delete(_0x1209ac);
  const _0x3abf0a = socksBridgeByFingerprint.get(_0x3874b4);
  if (!_0x3abf0a) {
    return;
  }
  _0x3abf0a.viewKeys.delete(_0x1209ac);
  if (_0x3abf0a.viewKeys.size > 0) {
    return;
  }
  socksBridgeByFingerprint.delete(_0x3874b4);
  try {
    await _0x3abf0a.close();
    console.log("[Proxy-Bridge] 已关闭本地桥 127.0.0.1:" + _0x3abf0a.port);
  } catch (_0x3d5883) {
    console.warn("[Proxy-Bridge] 关闭失败: " + (_0x3d5883.message || _0x3d5883));
  }
}
async function acquireSocksAuthBridge(_0x184c62, _0x35a200) {
  const _0x48c63c = socksBridgeFingerprint(_0x184c62);
  let _0x597749 = socksBridgeByFingerprint.get(_0x48c63c);
  if (!_0x597749) {
    const _0x2eccef = await startSocksAuthHttpBridge(_0x184c62);
    _0x597749 = {
      ..._0x2eccef,
      viewKeys: new Set()
    };
    socksBridgeByFingerprint.set(_0x48c63c, _0x597749);
  }
  if (_0x35a200) {
    _0x597749.viewKeys.add(_0x35a200);
    socksBridgeFpByViewKey.set(_0x35a200, _0x48c63c);
  }
  return _0x597749;
}
async function applyAccountProxy(_0x859ef0, _0x20d404, _0x384227) {
  if (!_0x859ef0) {
    return {
      applied: false
    };
  }
  if (_0x384227) {
    await releaseSocksBridgeForViewKey(_0x384227);
  }
  const _0x49c641 = normalizeProxyConfig(_0x20d404);
  if (!isProxyActive(_0x49c641)) {
    if (_0x384227) {
      proxyAuthByViewKey.delete(_0x384227);
    }
    await _0x859ef0.setProxy({
      mode: "direct"
    });
    return {
      applied: false,
      mode: "direct"
    };
  }
  if (_0x49c641.type === "socks5" && _0x49c641.username) {
    if (_0x384227) {
      proxyAuthByViewKey.delete(_0x384227);
    }
    const _0x27e811 = await acquireSocksAuthBridge(_0x49c641, _0x384227);
    const _0x6ef9e = "http://" + _0x27e811.host + ":" + _0x27e811.port;
    await _0x859ef0.setProxy({
      proxyRules: _0x6ef9e,
      proxyBypassRules: "<local>"
    });
    console.log("[Proxy][" + (_0x384227 || "-") + "] SOCKS5 认证桥接已启用 → " + _0x27e811.host + ":" + _0x27e811.port);
    return {
      applied: true,
      mode: "socks5-auth-bridge",
      rules: _0x6ef9e,
      bridge: _0x27e811.host + ":" + _0x27e811.port
    };
  }
  const _0x3b7955 = buildProxyRules(_0x49c641);
  const _0x128ee7 = getProxyCredentials(_0x49c641);
  if (_0x384227) {
    if (_0x128ee7) {
      proxyAuthByViewKey.set(_0x384227, _0x128ee7);
    } else {
      proxyAuthByViewKey.delete(_0x384227);
    }
  }
  await _0x859ef0.setProxy({
    proxyRules: _0x3b7955,
    proxyBypassRules: "<local>"
  });
  return {
    applied: true,
    mode: "proxy",
    rules: _0x3b7955
  };
}
function buildAxiosProxyConfig(_0x3c8ff8) {
  const _0x3b0de4 = normalizeProxyConfig(_0x3c8ff8);
  return {
    protocol: "http",
    host: _0x3b0de4.host,
    port: Number(_0x3b0de4.port),
    ...(_0x3b0de4.username ? {
      auth: {
        username: _0x3b0de4.username,
        password: _0x3b0de4.password || ""
      }
    } : {})
  };
}
function buildSocksAgent(_0x58ec4c) {
  const _0x53b1d5 = normalizeProxyConfig(_0x58ec4c);
  const _0x3cc349 = _0x53b1d5.username ? encodeURIComponent(_0x53b1d5.username) + ":" + encodeURIComponent(_0x53b1d5.password || "") + "@" : "";
  return new SocksProxyAgent("socks5h://" + _0x3cc349 + _0x53b1d5.host + ":" + _0x53b1d5.port);
}
function buildAxiosTransport(_0xa003d9) {
  const _0x314286 = normalizeProxyConfig(_0xa003d9);
  if (_0x314286.type === "socks5") {
    const _0x4a67cb = buildSocksAgent(_0x314286);
    return {
      httpAgent: _0x4a67cb,
      httpsAgent: _0x4a67cb,
      proxy: false
    };
  }
  return {
    proxy: buildAxiosProxyConfig(_0x314286)
  };
}
async function probeEndpoint(_0x13ce7c, _0x41f79b, _0x1673ac) {
  const _0x8bfc0f = await axios.get(_0x13ce7c.url, {
    ..._0x41f79b,
    timeout: _0x1673ac,
    responseType: _0x13ce7c.plain ? "text" : "json",
    validateStatus: _0x41d85e => _0x41d85e >= 200 && _0x41d85e < 300
  });
  const _0x2840f7 = _0x13ce7c.parse(_0x8bfc0f.data);
  if (!_0x2840f7) {
    throw new Error("无法解析出口 IP");
  }
  return _0x2840f7;
}
async function probeDouyinReachable(_0x32f9cb, _0x593ed3) {
  const _0x50a749 = Math.max(4000, Math.floor(_0x593ed3 / DOUYIN_PROBE_URLS.length));
  let _0x562575 = null;
  for (const _0x3ea0e of DOUYIN_PROBE_URLS) {
    try {
      const _0x33570e = await axios.get(_0x3ea0e, {
        ..._0x32f9cb,
        timeout: _0x50a749,
        responseType: "text",
        maxRedirects: 0,
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        },
        validateStatus: () => true
      });
      if (_0x33570e.status >= 200 && _0x33570e.status < 400) {
        return true;
      }
      _0x562575 = new Error("官网返回 HTTP " + _0x33570e.status);
    } catch (_0x3f34e6) {
      const _0x5d12ba = _0x3f34e6?.response?.status;
      if (_0x5d12ba >= 200 && _0x5d12ba < 400) {
        return true;
      }
      _0x562575 = _0x3f34e6;
    }
  }
  throw _0x562575 || new Error("无法访问官网");
}
async function resolveExitIp(_0x110e94, _0x5eccc1) {
  const _0xed7156 = Math.max(3000, Math.floor(_0x5eccc1 / IP_ENDPOINTS.length));
  for (const _0x5ed431 of IP_ENDPOINTS) {
    try {
      return await probeEndpoint(_0x5ed431, _0x110e94, _0xed7156);
    } catch (_0x28fe08) {}
  }
  return "";
}
async function testProxyWithAxios(_0x4d8b62, _0x1b4171) {
  const _0xa3e247 = buildAxiosTransport(_0x4d8b62);
  const _0x2d6d40 = Math.min(12000, Math.max(6000, Math.floor(_0x1b4171 * 0.7)));
  const _0x5450e4 = Math.max(4000, _0x1b4171 - _0x2d6d40);
  try {
    await probeDouyinReachable(_0xa3e247, _0x2d6d40);
    const _0x2145b8 = await resolveExitIp(_0xa3e247, _0x5450e4);
    return {
      douyinOk: true,
      ip: _0x2145b8
    };
  } catch (_0x5f0a6e) {
    const _0x3d17c4 = await resolveExitIp(_0xa3e247, Math.min(8000, _0x1b4171));
    if (_0x3d17c4) {
      const _0x565adb = new Error("代理出口 IP " + _0x3d17c4 + " 可达，但无法访问官网，请更换可用节点");
      _0x565adb.code = "DOUYIN_UNREACHABLE";
      throw _0x565adb;
    }
    throw _0x5f0a6e;
  }
}
async function testProxyConnection(_0x4389f3, {
  timeoutMs = 18000
} = {}) {
  const _0x5e239a = normalizeProxyConfig(_0x4389f3);
  if (!isProxyActive(_0x5e239a)) {
    return {
      success: false,
      message: "请先启用代理并填写主机与端口"
    };
  }
  try {
    const _0x22efb8 = await testProxyWithAxios(_0x5e239a, timeoutMs);
    const _0x4cfa1e = _0x22efb8?.ip || "";
    return {
      success: true,
      ip: _0x4cfa1e,
      douyinOk: true,
      message: _0x4cfa1e ? "官网可达，代理可用。出口 IP：" + _0x4cfa1e : "官网可达，代理可用"
    };
  } catch (_0x11825f) {
    return {
      success: false,
      message: _0x11825f?.code === "DOUYIN_UNREACHABLE" ? _0x11825f.message : formatProxyError(_0x11825f)
    };
  }
}
module.exports = {
  proxyAuthByViewKey: proxyAuthByViewKey,
  registerProxyLoginHandler: registerProxyLoginHandler,
  applyAccountProxy: applyAccountProxy,
  testProxyConnection: testProxyConnection,
  findViewKeyForWebContents: findViewKeyForWebContents,
  formatProxyError: formatProxyError
};
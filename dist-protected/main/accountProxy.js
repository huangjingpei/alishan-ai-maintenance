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
  parse: arg1 => String(arg1).match(/(\d{1,3}(?:\.\d{1,3}){3})/)?.[1] || ""
}, {
  url: "https://qifu-api.baidubce.com/ip/local/geo/v1/district",
  plain: false,
  parse: arg1 => String(arg1?.ip || "").trim()
}, {
  url: "http://httpbin.org/ip",
  plain: false,
  parse: arg1 => String(arg1?.origin || "").split(",")[0]?.trim() || ""
}, {
  url: "http://ifconfig.me/ip",
  plain: true,
  parse: arg1 => {
    const result = String(arg1 || "").trim();
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(result)) {
      return result;
    } else {
      return "";
    }
  }
}, {
  url: "http://api.ipify.org/?format=json",
  plain: false,
  parse: arg1 => String(arg1?.ip || "").trim()
}];
function getProxyCredentials(arg1) {
  const result = normalizeProxyConfig(arg1);
  if (!result.username) {
    return null;
  }
  return {
    username: result.username,
    password: result.password || ""
  };
}
function formatProxyError(arg1) {
  const local = arg1?.response?.status;
  if (local === 502) {
    return "所有测试站点均无法通过代理访问，请检查代理类型（HTTP / SOCKS5）、端口与节点是否正常";
  }
  if (local === 407) {
    return "代理认证失败，请检查用户名与密码";
  }
  if (local === 403) {
    return "代理拒绝访问，请检查账号权限或节点状态";
  }
  if (local) {
    return "代理测试失败（HTTP " + local + "），请检查代理配置与节点是否正常";
  }
  const result = String(arg1?.message || arg1 || "").trim();
  if (!result) {
    return "代理连接失败，请检查配置";
  }
  if (result.includes("status code 502")) {
    return "所有测试站点均无法通过代理访问，请检查代理类型（HTTP / SOCKS5）、端口与节点是否正常";
  }
  if (result.includes("status code 407")) {
    return "代理认证失败，请检查用户名与密码";
  }
  if (result.includes("SocksClient") || result.includes("Socks5") || result.includes("SOCKS")) {
    return "SOCKS5 连接失败，请确认已选 SOCKS5 类型且端口为 SOCKS5 端口（非 HTTP 端口）";
  }
  if (result.includes("ERR_CONNECTION_REFUSED") || arg1?.code === "ECONNREFUSED") {
    return "无法连接代理服务器，请检查主机、端口及代理软件是否已启动";
  }
  if (arg1?.code === "ECONNABORTED" || arg1?.code === "ETIMEDOUT" || result.includes("超时")) {
    return "连接超时，请检查代理是否可用";
  }
  return result.replace(/^net::/i, "") || "代理连接失败，请检查配置";
}
function findViewKeyForWebContents(arg1, ...restArgs) {
  if (!arg1) {
    return null;
  }
  for (const item of restArgs) {
    if (!item || typeof item.entries !== "function") {
      continue;
    }
    for (const [local, local2] of item.entries()) {
      if (local2?.webContents === arg1) {
        return local;
      }
    }
  }
  return null;
}
function registerProxyLoginHandler(...restArgs) {
  if (registerProxyLoginHandler._registered) {
    return;
  }
  registerProxyLoginHandler._registered = true;
  app.on("login", (arg1, arg2, arg3, arg4, arg5) => {
    if (!arg4?.isProxy) {
      return;
    }
    const result = findViewKeyForWebContents(arg2, ...restArgs);
    if (!result) {
      return;
    }
    const result2 = proxyAuthByViewKey.get(result);
    if (!result2?.username) {
      return;
    }
    arg1.preventDefault();
    arg5(result2.username, result2.password || "");
  });
}
function socksBridgeFingerprint(arg1) {
  const result = normalizeProxyConfig(arg1);
  return "socks5|" + result.host + "|" + result.port + "|" + result.username + "|" + (result.password || "");
}
function buildUpstreamSocksUrl(arg1) {
  const result = normalizeProxyConfig(arg1);
  const value = result.username ? encodeURIComponent(result.username) + ":" + encodeURIComponent(result.password || "") + "@" : "";
  return "socks5h://" + value + result.host + ":" + result.port;
}
async function startSocksAuthHttpBridge(arg1) {
  const result = buildUpstreamSocksUrl(arg1);
  const result2 = await ProxyChain.anonymizeProxy(result);
  const url = new URL(result2);
  const result3 = Number(url.port);
  if (!result3) {
    throw new Error("本地 SOCKS 桥接端口分配失败");
  }
  console.log("[Proxy-Bridge] 已启动本地桥 " + url.host + " → " + normalizeProxyConfig(arg1).host + ":" + normalizeProxyConfig(arg1).port);
  return {
    localUrl: result2,
    host: url.hostname || "127.0.0.1",
    port: result3,
    close: async () => {
      try {
        await ProxyChain.closeAnonymizedProxy(result2, true);
      } catch (error) {
        console.warn("[Proxy-Bridge] 关闭失败: " + (error.message || error));
      }
    }
  };
}
async function releaseSocksBridgeForViewKey(arg1) {
  if (!arg1) {
    return;
  }
  const result = socksBridgeFpByViewKey.get(arg1);
  if (!result) {
    return;
  }
  socksBridgeFpByViewKey.delete(arg1);
  const result2 = socksBridgeByFingerprint.get(result);
  if (!result2) {
    return;
  }
  result2.viewKeys.delete(arg1);
  if (result2.viewKeys.size > 0) {
    return;
  }
  socksBridgeByFingerprint.delete(result);
  try {
    await result2.close();
    console.log("[Proxy-Bridge] 已关闭本地桥 127.0.0.1:" + result2.port);
  } catch (error) {
    console.warn("[Proxy-Bridge] 关闭失败: " + (error.message || error));
  }
}
async function acquireSocksAuthBridge(arg1, arg2) {
  const result = socksBridgeFingerprint(arg1);
  let result2 = socksBridgeByFingerprint.get(result);
  if (!result2) {
    const result3 = await startSocksAuthHttpBridge(arg1);
    result2 = {
      ...result3,
      viewKeys: new Set()
    };
    socksBridgeByFingerprint.set(result, result2);
  }
  if (arg2) {
    result2.viewKeys.add(arg2);
    socksBridgeFpByViewKey.set(arg2, result);
  }
  return result2;
}
async function applyAccountProxy(arg1, arg2, arg3) {
  if (!arg1) {
    return {
      applied: false
    };
  }
  if (arg3) {
    await releaseSocksBridgeForViewKey(arg3);
  }
  const result = normalizeProxyConfig(arg2);
  if (!isProxyActive(result)) {
    if (arg3) {
      proxyAuthByViewKey.delete(arg3);
    }
    await arg1.setProxy({
      mode: "direct"
    });
    return {
      applied: false,
      mode: "direct"
    };
  }
  if (result.type === "socks5" && result.username) {
    if (arg3) {
      proxyAuthByViewKey.delete(arg3);
    }
    const result2 = await acquireSocksAuthBridge(result, arg3);
    const value = "http://" + result2.host + ":" + result2.port;
    await arg1.setProxy({
      proxyRules: value,
      proxyBypassRules: "<local>"
    });
    console.log("[Proxy][" + (arg3 || "-") + "] SOCKS5 认证桥接已启用 → " + result2.host + ":" + result2.port);
    return {
      applied: true,
      mode: "socks5-auth-bridge",
      rules: value,
      bridge: result2.host + ":" + result2.port
    };
  }
  const result2 = buildProxyRules(result);
  const result3 = getProxyCredentials(result);
  if (arg3) {
    if (result3) {
      proxyAuthByViewKey.set(arg3, result3);
    } else {
      proxyAuthByViewKey.delete(arg3);
    }
  }
  await arg1.setProxy({
    proxyRules: result2,
    proxyBypassRules: "<local>"
  });
  return {
    applied: true,
    mode: "proxy",
    rules: result2
  };
}
function buildAxiosProxyConfig(arg1) {
  const result = normalizeProxyConfig(arg1);
  return {
    protocol: "http",
    host: result.host,
    port: Number(result.port),
    ...(result.username ? {
      auth: {
        username: result.username,
        password: result.password || ""
      }
    } : {})
  };
}
function buildSocksAgent(arg1) {
  const result = normalizeProxyConfig(arg1);
  const value = result.username ? encodeURIComponent(result.username) + ":" + encodeURIComponent(result.password || "") + "@" : "";
  return new SocksProxyAgent("socks5h://" + value + result.host + ":" + result.port);
}
function buildAxiosTransport(arg1) {
  const result = normalizeProxyConfig(arg1);
  if (result.type === "socks5") {
    const result2 = buildSocksAgent(result);
    return {
      httpAgent: result2,
      httpsAgent: result2,
      proxy: false
    };
  }
  return {
    proxy: buildAxiosProxyConfig(result)
  };
}
async function probeEndpoint(arg1, arg2, arg3) {
  const result = await axios.get(arg1.url, {
    ...arg2,
    timeout: arg3,
    responseType: arg1.plain ? "text" : "json",
    validateStatus: arg1 => arg1 >= 200 && arg1 < 300
  });
  const result2 = arg1.parse(result.data);
  if (!result2) {
    throw new Error("无法解析出口 IP");
  }
  return result2;
}
async function probeDouyinReachable(arg1, arg2) {
  const result = Math.max(4000, Math.floor(arg2 / DOUYIN_PROBE_URLS.length));
  let local = null;
  for (const item of DOUYIN_PROBE_URLS) {
    try {
      const result2 = await axios.get(item, {
        ...arg1,
        timeout: result,
        responseType: "text",
        maxRedirects: 0,
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        },
        validateStatus: () => true
      });
      if (result2.status >= 200 && result2.status < 400) {
        return true;
      }
      local = new Error("官网返回 HTTP " + result2.status);
    } catch (error) {
      const local2 = error?.response?.status;
      if (local2 >= 200 && local2 < 400) {
        return true;
      }
      local = error;
    }
  }
  throw local || new Error("无法访问官网");
}
async function resolveExitIp(arg1, arg2) {
  const result = Math.max(3000, Math.floor(arg2 / IP_ENDPOINTS.length));
  for (const item of IP_ENDPOINTS) {
    try {
      return await probeEndpoint(item, arg1, result);
    } catch (error) {}
  }
  return "";
}
async function testProxyWithAxios(arg1, arg2) {
  const result = buildAxiosTransport(arg1);
  const result2 = Math.min(12000, Math.max(6000, Math.floor(arg2 * 0.7)));
  const result3 = Math.max(4000, arg2 - result2);
  try {
    await probeDouyinReachable(result, result2);
    const result4 = await resolveExitIp(result, result3);
    return {
      douyinOk: true,
      ip: result4
    };
  } catch (error) {
    const result2 = await resolveExitIp(result, Math.min(8000, arg2));
    if (result2) {
      const error = new Error("代理出口 IP " + result2 + " 可达，但无法访问官网，请更换可用节点");
      error.code = "DOUYIN_UNREACHABLE";
      throw error;
    }
    throw error;
  }
}
async function testProxyConnection(arg1, {
  timeoutMs = 18000
} = {}) {
  const result = normalizeProxyConfig(arg1);
  if (!isProxyActive(result)) {
    return {
      success: false,
      message: "请先启用代理并填写主机与端口"
    };
  }
  try {
    const result2 = await testProxyWithAxios(result, timeoutMs);
    const local = result2?.ip || "";
    return {
      success: true,
      ip: local,
      douyinOk: true,
      message: local ? "官网可达，代理可用。出口 IP：" + local : "官网可达，代理可用"
    };
  } catch (error) {
    return {
      success: false,
      message: error?.code === "DOUYIN_UNREACHABLE" ? error.message : formatProxyError(error)
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
function createEmptyProxyConfig() {
  return {
    enabled: false,
    type: "http",
    host: "",
    port: "",
    username: "",
    password: ""
  };
}
function parseProxyString(arg1) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return createEmptyProxyConfig();
  }
  try {
    const value = /^[a-z][a-z0-9+.-]*:\/\//i.test(result) ? result : "http://" + result;
    const url = new URL(value);
    const value2 = /^socks/i.test(url.protocol) ? "socks5" : "http";
    return {
      enabled: true,
      type: value2,
      host: url.hostname || "",
      port: url.port ? Number(url.port) : "",
      username: decodeURIComponent(url.username || ""),
      password: decodeURIComponent(url.password || "")
    };
  } catch (error) {
    return createEmptyProxyConfig();
  }
}
function normalizeProxyConfig(arg1) {
  if (!arg1) {
    return createEmptyProxyConfig();
  }
  if (typeof arg1 === "string") {
    return parseProxyString(arg1);
  }
  if (typeof arg1 !== "object") {
    return createEmptyProxyConfig();
  }
  const value = arg1.port;
  const value2 = value === "" || value == null ? "" : Number(value);
  return {
    enabled: !!arg1.enabled,
    type: arg1.type === "socks5" ? "socks5" : "http",
    host: String(arg1.host || "").trim(),
    port: Number.isFinite(value2) && value2 > 0 ? Math.floor(value2) : "",
    username: String(arg1.username || "").trim(),
    password: String(arg1.password || "")
  };
}
function cloneProxyConfig(arg1) {
  const result = normalizeProxyConfig(arg1);
  return {
    ...result
  };
}
function isProxyActive(arg1) {
  const result = normalizeProxyConfig(arg1);
  return result.enabled && !!result.host && !!result.port;
}
function buildProxyRules(arg1) {
  const result = normalizeProxyConfig(arg1);
  if (!isProxyActive(result)) {
    return "";
  }
  const value = result.host + ":" + result.port;
  if (result.type === "socks5") {
    return "socks5://" + value;
  }
  return "http=" + value + ";https=" + value;
}
function formatProxyLabel(arg1) {
  const result = normalizeProxyConfig(arg1);
  if (!isProxyActive(result)) {
    return "";
  }
  const value = result.username ? result.username + "@" : "";
  const value2 = result.type === "socks5" ? "SOCKS5" : "HTTP";
  return value2 + " " + value + result.host + ":" + result.port;
}
function formatProxyLegacyString(arg1) {
  const result = normalizeProxyConfig(arg1);
  if (!isProxyActive(result)) {
    return "";
  }
  const value = result.username ? encodeURIComponent(result.username) + ":" + encodeURIComponent(result.password || "") + "@" : "";
  const value2 = result.type === "socks5" ? "socks5" : "http";
  return value2 + "://" + value + result.host + ":" + result.port;
}
function migrateAccountProxy(options = {}) {
  if (!options || typeof options !== "object") {
    return options;
  }
  return {
    ...options,
    proxy: normalizeProxyConfig(options.proxy)
  };
}
module.exports = {
  createEmptyProxyConfig: createEmptyProxyConfig,
  parseProxyString: parseProxyString,
  normalizeProxyConfig: normalizeProxyConfig,
  cloneProxyConfig: cloneProxyConfig,
  isProxyActive: isProxyActive,
  buildProxyRules: buildProxyRules,
  formatProxyLabel: formatProxyLabel,
  formatProxyLegacyString: formatProxyLegacyString,
  migrateAccountProxy: migrateAccountProxy
};
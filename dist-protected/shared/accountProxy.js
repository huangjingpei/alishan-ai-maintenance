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
function parseProxyString(_0x48230b) {
  const _0x151558 = String(_0x48230b || "").trim();
  if (!_0x151558) {
    return createEmptyProxyConfig();
  }
  try {
    const _0x4dd38f = /^[a-z][a-z0-9+.-]*:\/\//i.test(_0x151558) ? _0x151558 : "http://" + _0x151558;
    const _0x396d16 = new URL(_0x4dd38f);
    const _0x77fa63 = /^socks/i.test(_0x396d16.protocol) ? "socks5" : "http";
    return {
      enabled: true,
      type: _0x77fa63,
      host: _0x396d16.hostname || "",
      port: _0x396d16.port ? Number(_0x396d16.port) : "",
      username: decodeURIComponent(_0x396d16.username || ""),
      password: decodeURIComponent(_0x396d16.password || "")
    };
  } catch (_0x32aa68) {
    return createEmptyProxyConfig();
  }
}
function normalizeProxyConfig(_0xfb2ae5) {
  if (!_0xfb2ae5) {
    return createEmptyProxyConfig();
  }
  if (typeof _0xfb2ae5 === "string") {
    return parseProxyString(_0xfb2ae5);
  }
  if (typeof _0xfb2ae5 !== "object") {
    return createEmptyProxyConfig();
  }
  const _0x15dcc6 = _0xfb2ae5.port;
  const _0x4e3f4b = _0x15dcc6 === "" || _0x15dcc6 == null ? "" : Number(_0x15dcc6);
  return {
    enabled: !!_0xfb2ae5.enabled,
    type: _0xfb2ae5.type === "socks5" ? "socks5" : "http",
    host: String(_0xfb2ae5.host || "").trim(),
    port: Number.isFinite(_0x4e3f4b) && _0x4e3f4b > 0 ? Math.floor(_0x4e3f4b) : "",
    username: String(_0xfb2ae5.username || "").trim(),
    password: String(_0xfb2ae5.password || "")
  };
}
function cloneProxyConfig(_0x2627e7) {
  const _0x2583e2 = normalizeProxyConfig(_0x2627e7);
  return {
    ..._0x2583e2
  };
}
function isProxyActive(_0x432f96) {
  const _0x405838 = normalizeProxyConfig(_0x432f96);
  return _0x405838.enabled && !!_0x405838.host && !!_0x405838.port;
}
function buildProxyRules(_0x31b287) {
  const _0x4ebe60 = normalizeProxyConfig(_0x31b287);
  if (!isProxyActive(_0x4ebe60)) {
    return "";
  }
  const _0x1462ac = _0x4ebe60.host + ":" + _0x4ebe60.port;
  if (_0x4ebe60.type === "socks5") {
    return "socks5://" + _0x1462ac;
  }
  return "http=" + _0x1462ac + ";https=" + _0x1462ac;
}
function formatProxyLabel(_0xd1a476) {
  const _0x50bbe9 = normalizeProxyConfig(_0xd1a476);
  if (!isProxyActive(_0x50bbe9)) {
    return "";
  }
  const _0x28e37d = _0x50bbe9.username ? _0x50bbe9.username + "@" : "";
  const _0x298a5e = _0x50bbe9.type === "socks5" ? "SOCKS5" : "HTTP";
  return _0x298a5e + " " + _0x28e37d + _0x50bbe9.host + ":" + _0x50bbe9.port;
}
function formatProxyLegacyString(_0x4ef7c3) {
  const _0xcbfaf8 = normalizeProxyConfig(_0x4ef7c3);
  if (!isProxyActive(_0xcbfaf8)) {
    return "";
  }
  const _0x1404af = _0xcbfaf8.username ? encodeURIComponent(_0xcbfaf8.username) + ":" + encodeURIComponent(_0xcbfaf8.password || "") + "@" : "";
  const _0x5667c6 = _0xcbfaf8.type === "socks5" ? "socks5" : "http";
  return _0x5667c6 + "://" + _0x1404af + _0xcbfaf8.host + ":" + _0xcbfaf8.port;
}
function migrateAccountProxy(_0x428620 = {}) {
  if (!_0x428620 || typeof _0x428620 !== "object") {
    return _0x428620;
  }
  return {
    ..._0x428620,
    proxy: normalizeProxyConfig(_0x428620.proxy)
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
function createAutomationPaintGuard({
  getMainWindow: _0x60368c,
  getVisibleViews: _0x4607f9,
  getPlatformViews: _0x17005a,
  shouldAttachAutomationView: _0x575ee9,
  isValidAutomationBounds: _0x1a93d8,
  nudgeAutomationViewRepaint: _0x1e9e83,
  nudgeHostCompositor: _0x5e8177,
  intervalMs = 10000
} = {}) {
  let _0x401a5f = null;
  function _0x23ea7e() {
    const _0x5fe6a8 = _0x60368c?.();
    if (!_0x5fe6a8 || _0x5fe6a8.isDestroyed()) {
      return;
    }
    const _0x57894c = _0x4607f9?.() || _0x17005a?.();
    if (!_0x57894c) {
      return;
    }
    let _0x4c4057 = 0;
    for (const [_0x386089, _0x5c98e2] of _0x57894c.entries()) {
      if (!_0x575ee9?.(_0x386089)) {
        continue;
      }
      if (!_0x5c98e2?.webContents || _0x5c98e2.webContents.isDestroyed()) {
        continue;
      }
      if (!_0x5fe6a8.getBrowserViews().includes(_0x5c98e2)) {
        continue;
      }
      const _0x567e4a = _0x5c98e2.getBounds?.();
      if (!_0x1a93d8?.(_0x567e4a)) {
        continue;
      }
      const _0x298769 = _0x5c98e2.webContents.getURL?.() || "";
      if (!_0x298769 || _0x298769 === "about:blank") {
        continue;
      }
      _0x1e9e83?.(_0x5c98e2.webContents, _0x5c98e2);
      _0x4c4057 += 1;
    }
    if (_0x4c4057 > 0) {
      _0x5e8177?.(_0x5fe6a8.webContents);
    }
  }
  function _0x24e90f() {
    if (_0x401a5f) {
      return;
    }
    _0x401a5f = setInterval(_0x23ea7e, intervalMs);
    if (typeof _0x401a5f.unref === "function") {
      _0x401a5f.unref();
    }
  }
  function _0x53f448() {
    if (!_0x401a5f) {
      return;
    }
    clearInterval(_0x401a5f);
    _0x401a5f = null;
  }
  return {
    start: _0x24e90f,
    stop: _0x53f448,
    tick: _0x23ea7e
  };
}
module.exports = {
  createAutomationPaintGuard: createAutomationPaintGuard
};
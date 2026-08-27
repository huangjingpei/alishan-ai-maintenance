'use strict';

async function waitForInteractionViewVisualReady(_0x2ad4e3, _0x1a73f3, _0x49474c = 8000) {
  const _0x424e96 = Date.now();
  let _0x2dc473 = {
    ready: false,
    reason: "not_checked"
  };
  while (Date.now() - _0x424e96 < _0x49474c) {
    if (!_0x1a73f3() || !_0x2ad4e3 || _0x2ad4e3.webContents?.isDestroyed?.()) {
      return {
        ready: false,
        reason: "interaction_replaced"
      };
    }
    try {
      _0x2dc473 = await _0x2ad4e3.webContents.executeJavaScript("(() => {\n        const body = document.body;\n        const html = document.documentElement;\n        const textLength = String(body?.innerText || body?.textContent || '').trim().length;\n        const viewportReady = window.innerWidth > 50 && window.innerHeight > 50;\n        const candidates = Array.from(document.querySelectorAll(\n          'main, [role=\"main\"], [data-e2e=\"user-info\"], [data-e2e=\"user-post-list\"], [data-e2e=\"video-detail-container\"], video, img'\n        )).slice(0, 80);\n        const hasPaintableContent = candidates.some((el) => {\n          const rect = el.getBoundingClientRect?.();\n          if (!rect || rect.width * rect.height < 10000) return false;\n          const style = getComputedStyle(el);\n          return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) > 0;\n        });\n        const documentReady = document.readyState === 'interactive' || document.readyState === 'complete';\n        return {\n          ready: !!(body && html && documentReady && viewportReady && (textLength >= 30 || hasPaintableContent)),\n          reason: textLength >= 30 ? 'text' : (hasPaintableContent ? 'content_surface' : 'empty_surface'),\n          textLength,\n          readyState: document.readyState,\n          viewport: window.innerWidth + 'x' + window.innerHeight,\n        };\n      })()", true).catch(_0x11425b => ({
        ready: false,
        reason: _0x11425b?.message || "probe_failed"
      }));
      if (_0x2dc473?.ready) {
        return {
          ..._0x2dc473,
          elapsedMs: Date.now() - _0x424e96
        };
      }
    } catch (_0x32df32) {
      _0x2dc473 = {
        ready: false,
        reason: _0x32df32?.message || "probe_failed"
      };
    }
    await new Promise(_0x4fd9cb => setTimeout(_0x4fd9cb, 160));
  }
  return {
    ..._0x2dc473,
    ready: false,
    elapsedMs: Date.now() - _0x424e96
  };
}
module.exports = {
  waitForInteractionViewVisualReady: waitForInteractionViewVisualReady
};
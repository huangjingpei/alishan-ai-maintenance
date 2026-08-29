'use strict';

async function waitForInteractionViewVisualReady(arg1, arg2, num = 8000) {
  const result = Date.now();
  let obj = {
    ready: false,
    reason: "not_checked"
  };
  while (Date.now() - result < num) {
    if (!arg2() || !arg1 || arg1.webContents?.isDestroyed?.()) {
      return {
        ready: false,
        reason: "interaction_replaced"
      };
    }
    try {
      obj = await arg1.webContents.executeJavaScript("(() => {\n        const body = document.body;\n        const html = document.documentElement;\n        const textLength = String(body?.innerText || body?.textContent || '').trim().length;\n        const viewportReady = window.innerWidth > 50 && window.innerHeight > 50;\n        const candidates = Array.from(document.querySelectorAll(\n          'main, [role=\"main\"], [data-e2e=\"user-info\"], [data-e2e=\"user-post-list\"], [data-e2e=\"video-detail-container\"], video, img'\n        )).slice(0, 80);\n        const hasPaintableContent = candidates.some((el) => {\n          const rect = el.getBoundingClientRect?.();\n          if (!rect || rect.width * rect.height < 10000) return false;\n          const style = getComputedStyle(el);\n          return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) > 0;\n        });\n        const documentReady = document.readyState === 'interactive' || document.readyState === 'complete';\n        return {\n          ready: !!(body && html && documentReady && viewportReady && (textLength >= 30 || hasPaintableContent)),\n          reason: textLength >= 30 ? 'text' : (hasPaintableContent ? 'content_surface' : 'empty_surface'),\n          textLength,\n          readyState: document.readyState,\n          viewport: window.innerWidth + 'x' + window.innerHeight,\n        };\n      })()", true).catch(arg1 => ({
        ready: false,
        reason: arg1?.message || "probe_failed"
      }));
      if (obj?.ready) {
        return {
          ...obj,
          elapsedMs: Date.now() - result
        };
      }
    } catch (error) {
      obj = {
        ready: false,
        reason: error?.message || "probe_failed"
      };
    }
    await new Promise(arg1 => setTimeout(arg1, 160));
  }
  return {
    ...obj,
    ready: false,
    elapsedMs: Date.now() - result
  };
}
module.exports = {
  waitForInteractionViewVisualReady: waitForInteractionViewVisualReady
};
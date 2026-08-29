'use strict';

function isDouyinLoadingLabelText(arg1) {
  const result = String(arg1 || "").replace(/\s+/g, " ").trim();
  if (!result || result.length > 24) {
    return false;
  }
  return result === "加载中" || /^加载中[.。…]+$/.test(result) || result === "正在加载" || /^正在加载[.。…]+$/.test(result);
}
function isElementVisuallyShown(arg1) {
  if (!arg1 || typeof arg1.getBoundingClientRect !== "function") {
    return false;
  }
  let local;
  try {
    local = arg1.getBoundingClientRect();
  } catch (error) {
    return false;
  }
  if (!(local.width > 0) || !(local.height > 0)) {
    return false;
  }
  try {
    if (typeof window === "undefined" || typeof window.getComputedStyle !== "function") {
      return true;
    }
    const result = window.getComputedStyle(arg1);
    if (!result) {
      return true;
    }
    if (result.display === "none" || result.visibility === "hidden") {
      return false;
    }
    const result2 = Number(result.opacity);
    if (Number.isFinite(result2) && result2 <= 0.02) {
      return false;
    }
  } catch (error) {}
  return true;
}
function isInsideDouyinCommentRail(arg1) {
  if (!arg1 || typeof arg1.closest !== "function") {
    return false;
  }
  try {
    return !!arg1.closest("[data-e2e=\"comment-list\"], [data-e2e=\"comment-item\"], [data-e2e=\"comment-input\"], [class*=\"CommentList\"], [class*=\"comment-list\"], [class*=\"comment-main\"], [class*=\"comment-panel\"], [class*=\"CommentPanel\"]");
  } catch (error) {
    return false;
  }
}
function isLoadingPlaceholderInMainStage(arg1, options = {}) {
  if (!arg1 || typeof arg1.getBoundingClientRect !== "function") {
    return false;
  }
  if (isInsideDouyinCommentRail(arg1)) {
    return false;
  }
  let local;
  try {
    local = arg1.getBoundingClientRect();
  } catch (error) {
    return false;
  }
  const value = Number(options.width) > 0 ? Number(options.width) : typeof window !== "undefined" ? window.innerWidth || 1280 : 1280;
  const value2 = Number(options.height) > 0 ? Number(options.height) : typeof window !== "undefined" ? window.innerHeight || 800 : 800;
  const value3 = local.left + local.width / 2;
  const value4 = local.top + local.height / 2;
  if (value3 < value * 0.1 || value3 > value * 0.72) {
    return false;
  }
  if (value4 < value2 * 0.08 || value4 > value2 * 0.82) {
    return false;
  }
  if (local.width * local.height < 64) {
    return false;
  }
  return true;
}
function extractAwemeIdFromText(arg1) {
  const result = String(arg1 || "");
  const local = result.match(/(?:aweme_id|item_id|modal_id)=(\d{15,})/i) || result.match(/\/(?:video|note)\/(\d{15,})/i);
  if (local) {
    return local[1];
  } else {
    return "";
  }
}
function readAwemeIdFromObject(arg1) {
  if (!arg1 || typeof arg1 !== "object") {
    return "";
  }
  const result = String(arg1.aweme_id || arg1.awemeId || arg1.group_id || arg1.groupId || arg1.item_id || arg1.itemId || arg1.id || "").trim();
  if (/^\d{15,}$/.test(result)) {
    return result;
  } else {
    return "";
  }
}
function classifySpecificVideoDetailApiPayload(arg1, text = "") {
  const obj = {
    status: "unknown",
    awemeId: String(text || "").trim(),
    statusCode: 0,
    reason: ""
  };
  if (!arg1 || typeof arg1 !== "object") {
    return obj;
  }
  const result = Number(arg1.status_code ?? arg1.statusCode ?? 0);
  const result2 = String(arg1.status_msg || arg1.statusMsg || arg1.message || "").trim();
  const result3 = String(text || "").trim();
  const local = arg1.aweme_detail || arg1.awemeDetail || (Array.isArray(arg1.aweme_details) ? arg1.aweme_details[0] : null) || (Array.isArray(arg1.awemeDetails) ? arg1.awemeDetails[0] : null) || arg1.aweme || null;
  const local2 = readAwemeIdFromObject(local) || result3;
  const pattern = /不存在|已删除|已失效|无法观看|无法展示|找不到|已下架|违规|被封禁/;
  if (result && result !== 0) {
    return {
      status: "unavailable",
      awemeId: local2,
      statusCode: result,
      reason: result2 || "status_code=" + result
    };
  }
  if (pattern.test(result2)) {
    return {
      status: "unavailable",
      awemeId: local2,
      statusCode: result,
      reason: result2
    };
  }
  const local3 = arg1.filter_list || arg1.filterList || [];
  if (Array.isArray(local3) && local3.length) {
    const result2 = local3.find(arg1 => {
      const result = String(arg1?.aweme_id || arg1?.awemeId || arg1?.id || "").trim();
      if (result3 && result && result !== result3) {
        return false;
      }
      const result2 = String(arg1?.reason || arg1?.filter_reason || arg1?.notice || "").trim();
      return !result2 || pattern.test(result2) || Number(arg1?.status) > 0;
    });
    if (result2) {
      return {
        status: "unavailable",
        awemeId: result3 || String(result2.aweme_id || result2.awemeId || ""),
        statusCode: result,
        reason: String(result2.reason || result2.filter_reason || result2.notice || "filter_list")
      };
    }
  }
  if (local && readAwemeIdFromObject(local)) {
    if (result3 && local2 && result3 !== local2) {
      return {
        ...obj,
        status: "unknown",
        awemeId: local2,
        reason: "aweme_id_mismatch"
      };
    }
    return {
      status: "ready",
      awemeId: local2,
      statusCode: result,
      reason: ""
    };
  }
  return obj;
}
function getSpecificVideoApiHookInstaller() {
  return "(() => {\n    if (window.__radar_specific_video_api_hooked) return true;\n    window.__radar_specific_video_api_hooked = true;\n    window.__radar_specific_video_api = window.__radar_specific_video_api || { byId: {} };\n\n    const DETAIL_RE = /\\/aweme\\/v1\\/web\\/(?:aweme\\/detail|detail\\/)|\\/web\\/api\\/v2\\/aweme\\/detail|\\/aweme\\/detail/i;\n\n    const extractId = (raw) => {\n      const text = String(raw || '');\n      const m = text.match(/(?:aweme_id|item_id|modal_id)=(\\d{15,})/i)\n        || text.match(/\\/(?:video|note)\\/(\\d{15,})/i);\n      return m ? m[1] : '';\n    };\n\n    const readAwemeId = (aweme) => {\n      if (!aweme || typeof aweme !== 'object') return '';\n      const id = String(\n        aweme.aweme_id || aweme.awemeId || aweme.group_id || aweme.groupId\n        || aweme.item_id || aweme.itemId || aweme.id || '',\n      ).trim();\n      return /^\\d{15,}$/.test(id) ? id : '';\n    };\n\n    const classify = (payload, preferredId) => {\n      if (!payload || typeof payload !== 'object') {\n        return { status: 'unknown', awemeId: preferredId || '', statusCode: 0, reason: '' };\n      }\n      const statusCode = Number(payload.status_code ?? payload.statusCode ?? 0);\n      const statusMsg = String(payload.status_msg || payload.statusMsg || payload.message || '').trim();\n      const preferred = String(preferredId || '').trim();\n      const aweme = payload.aweme_detail || payload.awemeDetail\n        || (Array.isArray(payload.aweme_details) ? payload.aweme_details[0] : null)\n        || (Array.isArray(payload.awemeDetails) ? payload.awemeDetails[0] : null)\n        || payload.aweme || null;\n      const awemeId = readAwemeId(aweme) || preferred;\n      const bad = /不存在|已删除|已失效|无法观看|无法展示|找不到|已下架|违规|被封禁/;\n      if (statusCode && statusCode !== 0) {\n        return { status: 'unavailable', awemeId, statusCode, reason: statusMsg || ('status_code=' + statusCode) };\n      }\n      if (bad.test(statusMsg)) {\n        return { status: 'unavailable', awemeId, statusCode, reason: statusMsg };\n      }\n      const filterList = payload.filter_list || payload.filterList || [];\n      if (Array.isArray(filterList) && filterList.length) {\n        const hit = filterList.find((item) => {\n          const id = String(item && (item.aweme_id || item.awemeId || item.id) || '').trim();\n          if (preferred && id && id !== preferred) return false;\n          const reason = String(item && (item.reason || item.filter_reason || item.notice) || '').trim();\n          return !reason || bad.test(reason) || Number(item && item.status) > 0;\n        });\n        if (hit) {\n          return {\n            status: 'unavailable',\n            awemeId: preferred || String(hit.aweme_id || hit.awemeId || ''),\n            statusCode,\n            reason: String(hit.reason || hit.filter_reason || hit.notice || 'filter_list'),\n          };\n        }\n      }\n      if (aweme && readAwemeId(aweme)) {\n        if (preferred && awemeId && preferred !== awemeId) {\n          return { status: 'unknown', awemeId, statusCode, reason: 'aweme_id_mismatch' };\n        }\n        return { status: 'ready', awemeId, statusCode, reason: '' };\n      }\n      return { status: 'unknown', awemeId, statusCode, reason: '' };\n    };\n\n    const report = (url, data) => {\n      try {\n        const reqUrl = String(url || '');\n        if (!DETAIL_RE.test(reqUrl) && !/aweme_id=\\d{15,}/i.test(reqUrl)) return;\n        if (!data || typeof data !== 'object') return;\n        const preferredId = extractId(reqUrl);\n        const classified = classify(data, preferredId);\n        const id = classified.awemeId || preferredId;\n        if (!id) return;\n        window.__radar_specific_video_api.byId[id] = {\n          ...classified,\n          awemeId: id,\n          at: Date.now(),\n          url: reqUrl.slice(0, 240),\n        };\n        document.dispatchEvent(new CustomEvent('__radar_specific_video_api', {\n          detail: window.__radar_specific_video_api.byId[id],\n        }));\n      } catch (_) { /* ignore */ }\n    };\n\n    const parseBody = (url, body) => {\n      if (!body) return;\n      try {\n        if (typeof body === 'string') {\n          const text = body.trim();\n          if (!text || (text[0] !== '{' && text[0] !== '[')) return;\n          report(url, JSON.parse(text));\n          return;\n        }\n        if (typeof body === 'object') report(url, body);\n      } catch (_) { /* ignore */ }\n    };\n\n    const originalFetch = window.fetch;\n    if (typeof originalFetch === 'function') {\n      window.fetch = async function (...args) {\n        const response = await originalFetch.apply(this, args);\n        try {\n          const reqUrl = typeof args[0] === 'string'\n            ? args[0]\n            : (args[0] && args[0].url) || '';\n          if (DETAIL_RE.test(String(reqUrl || '')) || /aweme_id=\\d{15,}/i.test(String(reqUrl || ''))) {\n            response.clone().text().then((text) => parseBody(reqUrl, text)).catch(() => {});\n          }\n        } catch (_) { /* ignore */ }\n        return response;\n      };\n    }\n\n    const XHR = window.XMLHttpRequest;\n    if (XHR && XHR.prototype) {\n      const open = XHR.prototype.open;\n      const send = XHR.prototype.send;\n      XHR.prototype.open = function (method, url, ...rest) {\n        this.__radar_specific_video_url = url;\n        return open.call(this, method, url, ...rest);\n      };\n      XHR.prototype.send = function (...args) {\n        this.addEventListener('load', function () {\n          try {\n            parseBody(this.__radar_specific_video_url || '', this.responseText);\n          } catch (_) { /* ignore */ }\n        });\n        return send.apply(this, args);\n      };\n    }\n\n    return true;\n  })();";
}
module.exports = {
  isDouyinLoadingLabelText: isDouyinLoadingLabelText,
  isElementVisuallyShown: isElementVisuallyShown,
  isInsideDouyinCommentRail: isInsideDouyinCommentRail,
  isLoadingPlaceholderInMainStage: isLoadingPlaceholderInMainStage,
  extractAwemeIdFromText: extractAwemeIdFromText,
  classifySpecificVideoDetailApiPayload: classifySpecificVideoDetailApiPayload,
  getSpecificVideoApiHookInstaller: getSpecificVideoApiHookInstaller
};
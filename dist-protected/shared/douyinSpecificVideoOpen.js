'use strict';

function isDouyinLoadingLabelText(_0x120555) {
  const _0x12aa4a = String(_0x120555 || "").replace(/\s+/g, " ").trim();
  if (!_0x12aa4a || _0x12aa4a.length > 24) {
    return false;
  }
  return _0x12aa4a === "加载中" || /^加载中[.。…]+$/.test(_0x12aa4a) || _0x12aa4a === "正在加载" || /^正在加载[.。…]+$/.test(_0x12aa4a);
}
function isElementVisuallyShown(_0x226a30) {
  if (!_0x226a30 || typeof _0x226a30.getBoundingClientRect !== "function") {
    return false;
  }
  let _0x32b058;
  try {
    _0x32b058 = _0x226a30.getBoundingClientRect();
  } catch (_0x2765a2) {
    return false;
  }
  if (!(_0x32b058.width > 0) || !(_0x32b058.height > 0)) {
    return false;
  }
  try {
    if (typeof window === "undefined" || typeof window.getComputedStyle !== "function") {
      return true;
    }
    const _0x2b42ec = window.getComputedStyle(_0x226a30);
    if (!_0x2b42ec) {
      return true;
    }
    if (_0x2b42ec.display === "none" || _0x2b42ec.visibility === "hidden") {
      return false;
    }
    const _0x1e366b = Number(_0x2b42ec.opacity);
    if (Number.isFinite(_0x1e366b) && _0x1e366b <= 0.02) {
      return false;
    }
  } catch (_0xb0704b) {}
  return true;
}
function isInsideDouyinCommentRail(_0x332bff) {
  if (!_0x332bff || typeof _0x332bff.closest !== "function") {
    return false;
  }
  try {
    return !!_0x332bff.closest("[data-e2e=\"comment-list\"], [data-e2e=\"comment-item\"], [data-e2e=\"comment-input\"], [class*=\"CommentList\"], [class*=\"comment-list\"], [class*=\"comment-main\"], [class*=\"comment-panel\"], [class*=\"CommentPanel\"]");
  } catch (_0x1a90e1) {
    return false;
  }
}
function isLoadingPlaceholderInMainStage(_0x302c02, _0x248dfb = {}) {
  if (!_0x302c02 || typeof _0x302c02.getBoundingClientRect !== "function") {
    return false;
  }
  if (isInsideDouyinCommentRail(_0x302c02)) {
    return false;
  }
  let _0x47c953;
  try {
    _0x47c953 = _0x302c02.getBoundingClientRect();
  } catch (_0x2a00ed) {
    return false;
  }
  const _0x282a28 = Number(_0x248dfb.width) > 0 ? Number(_0x248dfb.width) : typeof window !== "undefined" ? window.innerWidth || 1280 : 1280;
  const _0x58f8c6 = Number(_0x248dfb.height) > 0 ? Number(_0x248dfb.height) : typeof window !== "undefined" ? window.innerHeight || 800 : 800;
  const _0x20a553 = _0x47c953.left + _0x47c953.width / 2;
  const _0x354e66 = _0x47c953.top + _0x47c953.height / 2;
  if (_0x20a553 < _0x282a28 * 0.1 || _0x20a553 > _0x282a28 * 0.72) {
    return false;
  }
  if (_0x354e66 < _0x58f8c6 * 0.08 || _0x354e66 > _0x58f8c6 * 0.82) {
    return false;
  }
  if (_0x47c953.width * _0x47c953.height < 64) {
    return false;
  }
  return true;
}
function extractAwemeIdFromText(_0x3e2b4c) {
  const _0x4dfc7e = String(_0x3e2b4c || "");
  const _0x299e48 = _0x4dfc7e.match(/(?:aweme_id|item_id|modal_id)=(\d{15,})/i) || _0x4dfc7e.match(/\/(?:video|note)\/(\d{15,})/i);
  if (_0x299e48) {
    return _0x299e48[1];
  } else {
    return "";
  }
}
function readAwemeIdFromObject(_0x9a59a4) {
  if (!_0x9a59a4 || typeof _0x9a59a4 !== "object") {
    return "";
  }
  const _0x43b3d0 = String(_0x9a59a4.aweme_id || _0x9a59a4.awemeId || _0x9a59a4.group_id || _0x9a59a4.groupId || _0x9a59a4.item_id || _0x9a59a4.itemId || _0x9a59a4.id || "").trim();
  if (/^\d{15,}$/.test(_0x43b3d0)) {
    return _0x43b3d0;
  } else {
    return "";
  }
}
function classifySpecificVideoDetailApiPayload(_0x4ba502, _0x24091b = "") {
  const _0x13551d = {
    status: "unknown",
    awemeId: String(_0x24091b || "").trim(),
    statusCode: 0,
    reason: ""
  };
  if (!_0x4ba502 || typeof _0x4ba502 !== "object") {
    return _0x13551d;
  }
  const _0x4cb797 = Number(_0x4ba502.status_code ?? _0x4ba502.statusCode ?? 0);
  const _0x2eb08d = String(_0x4ba502.status_msg || _0x4ba502.statusMsg || _0x4ba502.message || "").trim();
  const _0x5a0cc7 = String(_0x24091b || "").trim();
  const _0x3c42bd = _0x4ba502.aweme_detail || _0x4ba502.awemeDetail || (Array.isArray(_0x4ba502.aweme_details) ? _0x4ba502.aweme_details[0] : null) || (Array.isArray(_0x4ba502.awemeDetails) ? _0x4ba502.awemeDetails[0] : null) || _0x4ba502.aweme || null;
  const _0x1da796 = readAwemeIdFromObject(_0x3c42bd) || _0x5a0cc7;
  const _0x52df5d = /不存在|已删除|已失效|无法观看|无法展示|找不到|已下架|违规|被封禁/;
  if (_0x4cb797 && _0x4cb797 !== 0) {
    return {
      status: "unavailable",
      awemeId: _0x1da796,
      statusCode: _0x4cb797,
      reason: _0x2eb08d || "status_code=" + _0x4cb797
    };
  }
  if (_0x52df5d.test(_0x2eb08d)) {
    return {
      status: "unavailable",
      awemeId: _0x1da796,
      statusCode: _0x4cb797,
      reason: _0x2eb08d
    };
  }
  const _0xeb8bf1 = _0x4ba502.filter_list || _0x4ba502.filterList || [];
  if (Array.isArray(_0xeb8bf1) && _0xeb8bf1.length) {
    const _0x3f77ac = _0xeb8bf1.find(_0x1426ba => {
      const _0x253030 = String(_0x1426ba?.aweme_id || _0x1426ba?.awemeId || _0x1426ba?.id || "").trim();
      if (_0x5a0cc7 && _0x253030 && _0x253030 !== _0x5a0cc7) {
        return false;
      }
      const _0x63ba02 = String(_0x1426ba?.reason || _0x1426ba?.filter_reason || _0x1426ba?.notice || "").trim();
      return !_0x63ba02 || _0x52df5d.test(_0x63ba02) || Number(_0x1426ba?.status) > 0;
    });
    if (_0x3f77ac) {
      return {
        status: "unavailable",
        awemeId: _0x5a0cc7 || String(_0x3f77ac.aweme_id || _0x3f77ac.awemeId || ""),
        statusCode: _0x4cb797,
        reason: String(_0x3f77ac.reason || _0x3f77ac.filter_reason || _0x3f77ac.notice || "filter_list")
      };
    }
  }
  if (_0x3c42bd && readAwemeIdFromObject(_0x3c42bd)) {
    if (_0x5a0cc7 && _0x1da796 && _0x5a0cc7 !== _0x1da796) {
      return {
        ..._0x13551d,
        status: "unknown",
        awemeId: _0x1da796,
        reason: "aweme_id_mismatch"
      };
    }
    return {
      status: "ready",
      awemeId: _0x1da796,
      statusCode: _0x4cb797,
      reason: ""
    };
  }
  return _0x13551d;
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
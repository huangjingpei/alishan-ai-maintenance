function createWorkPublishAiApi({
  axios: _0x25e452,
  getToken: _0x5299f0,
  getDeviceId: _0x56d59f,
  apiBase: _0x14c241,
  getApiBase: _0x5b5800,
  headersFn: _0x28561c,
  autoLogin: _0x5bcc41
}) {
  const _0x2a1a74 = () => {
    if (typeof _0x5b5800 === "function") {
      const _0x454c41 = _0x5b5800();
      if (_0x454c41) {
        return String(_0x454c41).replace(/\/+$/, "");
      }
    }
    return String(_0x14c241 || "").replace(/\/+$/, "");
  };
  async function _0x58f07(_0x280391) {
    let _0x46b690 = _0x5299f0();
    try {
      return await _0x280391(_0x46b690);
    } catch (_0x343b6f) {
      if (_0x343b6f.response?.status === 401 && typeof _0x5bcc41 === "function") {
        await _0x5bcc41();
        _0x46b690 = _0x5299f0();
        return await _0x280391(_0x46b690);
      }
      throw _0x343b6f;
    }
  }
  async function _0xbc8298() {
    const _0x36ef2d = _0x56d59f();
    const _0x4cd3bf = _0x2a1a74() + "/radar/ai/work-publish-quota";
    const _0x4fe2ef = await _0x58f07(_0x5881e2 => _0x25e452.get(_0x4cd3bf, {
      headers: _0x28561c(_0x5881e2, _0x36ef2d),
      timeout: 15000
    }));
    return _0x4fe2ef.data?.data || null;
  }
  async function _0x59b8c6(_0x25be71 = {}) {
    const _0x44b3a9 = _0x56d59f();
    const _0x4a7a73 = _0x2a1a74() + "/radar/ai/work-publish-generate";
    const _0x150c5a = {
      seedTitle: String(_0x25be71.seedTitle || "").trim(),
      seedDesc: String(_0x25be71.seedDesc || "").trim(),
      count: Math.min(10, Math.max(1, Number(_0x25be71.count) || 1)),
      similarity: Math.min(100, Math.max(0, Number(_0x25be71.similarity) || 30))
    };
    try {
      const _0x5f0c68 = await _0x58f07(_0x3d3e31 => _0x25e452.post(_0x4a7a73, _0x150c5a, {
        headers: _0x28561c(_0x3d3e31, _0x44b3a9),
        timeout: 60000
      }));
      return {
        success: true,
        items: _0x5f0c68.data?.data?.items || [],
        workPublishQuota: _0x5f0c68.data?.workPublishQuota || null
      };
    } catch (_0x530224) {
      return {
        success: false,
        msg: _0x530224.response?.data?.msg || _0x530224.message || "作品文案生成失败",
        workPublishQuota: _0x530224.response?.data?.workPublishQuota || null,
        raw: _0x530224.response?.data || null
      };
    }
  }
  return {
    fetchQuota: _0xbc8298,
    generateCopies: _0x59b8c6
  };
}
module.exports = {
  createWorkPublishAiApi: createWorkPublishAiApi
};
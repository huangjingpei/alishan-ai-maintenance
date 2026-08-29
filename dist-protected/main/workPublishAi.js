function createWorkPublishAiApi({
  axios: axios,
  getToken: getToken,
  getDeviceId: getDeviceId,
  apiBase: apiBase,
  getApiBase: getApiBase,
  headersFn: headersFn,
  autoLogin: autoLogin
}) {
  const local = () => {
    if (typeof getApiBase === "function") {
      const result = getApiBase();
      if (result) {
        return String(result).replace(/\/+$/, "");
      }
    }
    return String(apiBase || "").replace(/\/+$/, "");
  };
  async function fn(arg1) {
    let result = getToken();
    try {
      return await arg1(result);
    } catch (error) {
      if (error.response?.status === 401 && typeof autoLogin === "function") {
        await autoLogin();
        result = getToken();
        return await arg1(result);
      }
      throw error;
    }
  }
  async function fetchQuota() {
    const result = getDeviceId();
    const value = local() + "/radar/ai/work-publish-quota";
    const result2 = await fn(arg1 => axios.get(value, {
      headers: headersFn(arg1, result),
      timeout: 15000
    }));
    return result2.data?.data || null;
  }
  async function generateCopies(options = {}) {
    const result = getDeviceId();
    const value = local() + "/radar/ai/work-publish-generate";
    const obj = {
      seedTitle: String(options.seedTitle || "").trim(),
      seedDesc: String(options.seedDesc || "").trim(),
      count: Math.min(10, Math.max(1, Number(options.count) || 1)),
      similarity: Math.min(100, Math.max(0, Number(options.similarity) || 30))
    };
    try {
      const result2 = await fn(arg1 => axios.post(value, obj, {
        headers: headersFn(arg1, result),
        timeout: 60000
      }));
      return {
        success: true,
        items: result2.data?.data?.items || [],
        workPublishQuota: result2.data?.workPublishQuota || null
      };
    } catch (error) {
      return {
        success: false,
        msg: error.response?.data?.msg || error.message || "作品文案生成失败",
        workPublishQuota: error.response?.data?.workPublishQuota || null,
        raw: error.response?.data || null
      };
    }
  }
  return {
    fetchQuota: fetchQuota,
    generateCopies: generateCopies
  };
}
module.exports = {
  createWorkPublishAiApi: createWorkPublishAiApi
};
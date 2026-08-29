const STORE_KEY = "leadgen_keyword_pools_v1";
const MAX_PERSISTED_POOLS = 50;
const pools = new Map();
let persistenceStore = null;
function normalizeKeywordList(list = []) {
  const set = new Set();
  return (Array.isArray(list) ? list : []).map(arg1 => String(arg1 || "").trim()).filter(arg1 => {
    if (!arg1 || set.has(arg1)) {
      return false;
    }
    set.add(arg1);
    return true;
  });
}
function configurePersistence(arg1) {
  persistenceStore = arg1 && typeof arg1.get === "function" && typeof arg1.set === "function" ? arg1 : null;
}
function readPersistedPools() {
  if (!persistenceStore) {
    return {};
  }
  try {
    const result = persistenceStore.get(STORE_KEY, {});
    if (result && typeof result === "object") {
      return result;
    } else {
      return {};
    }
  } catch (error) {
    return {};
  }
}
function writePersistedPools(arg1) {
  if (!persistenceStore) {
    return;
  }
  try {
    persistenceStore.set(STORE_KEY, arg1);
  } catch (error) {
    console.warn("[KeywordPool] 保存续跑队列失败:", error.message);
  }
}
function serializePool(arg1) {
  return {
    all: [...arg1.all],
    queue: [...arg1.queue],
    activeByAccount: Object.fromEntries(arg1.activeByAccount),
    updatedAt: Date.now()
  };
}
function persistPool(arg1, arg2) {
  const result = readPersistedPools();
  result[arg1] = serializePool(arg2);
  const result2 = Object.entries(result).sort((arg1, arg2) => Number(arg2[1]?.updatedAt || 0) - Number(arg1[1]?.updatedAt || 0)).slice(0, MAX_PERSISTED_POOLS);
  writePersistedPools(Object.fromEntries(result2));
}
function removePersistedPool(arg1) {
  const result = readPersistedPools();
  if (!Object.prototype.hasOwnProperty.call(result, arg1)) {
    return;
  }
  delete result[arg1];
  writePersistedPools(result);
}
function hydratePool(arg1) {
  const value = readPersistedPools()[arg1];
  if (!value || typeof value !== "object") {
    return null;
  }
  const result = normalizeKeywordList(value.all);
  const set = new Set(result);
  const result2 = normalizeKeywordList(value.queue).filter(arg1 => set.has(arg1));
  const map = new Map(Object.entries(value.activeByAccount || {}).map(([arg1, arg12]) => [String(arg1), String(arg12 || "").trim()]).filter(([, arg1]) => arg1 && set.has(arg1)));
  return {
    all: result,
    queue: result2,
    activeByAccount: map
  };
}
function reconcilePoolKeywords(arg1, arg2) {
  const result = normalizeKeywordList(arg2);
  const set = new Set(result);
  const map = new Map([...arg1.activeByAccount.entries()].filter(([, arg1]) => set.has(arg1)));
  const set2 = new Set(map.values());
  const set3 = new Set(arg1.all);
  const set4 = new Set(arg1.queue);
  const result2 = arg1.queue.filter(arg1 => set.has(arg1) && !set2.has(arg1));
  result.forEach(arg1 => {
    const flag = !set3.has(arg1);
    if (flag && !set2.has(arg1) && !result2.includes(arg1)) {
      result2.push(arg1);
    }
    if (set4.has(arg1) && !set2.has(arg1) && !result2.includes(arg1)) {
      result2.push(arg1);
    }
  });
  return {
    all: result,
    queue: result2,
    activeByAccount: map
  };
}
function initGlobalKeywordPool(arg1, list = [], options = {}) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return {
      total: 0,
      resumed: false
    };
  }
  const result2 = normalizeKeywordList(list);
  let local = null;
  if (options.resume) {
    local = pools.get(result) || hydratePool(result);
    if (local) {
      local = reconcilePoolKeywords(local, result2);
    }
  }
  if (!local) {
    local = {
      all: [...result2],
      queue: [...result2],
      activeByAccount: new Map()
    };
  }
  pools.set(result, local);
  persistPool(result, local);
  console.log("[KeywordPool] " + (options.resume ? "恢复" : "初始化") + "任务池 " + result + "：共 " + local.all.length + " 个关键词，待领取 " + local.queue.length + " 个");
  return {
    total: local.all.length,
    remaining: local.queue.length,
    resumed: !!options.resume
  };
}
function claimLeadgenKeyword(arg1, arg2, options = {}) {
  const result = String(arg1 || "").trim();
  const result2 = String(arg2 || "");
  const local = pools.get(result) || hydratePool(result);
  if (!local) {
    return {
      keyword: null,
      remaining: 0,
      total: 0,
      claimed: 0
    };
  }
  pools.set(result, local);
  const result3 = String(options.preferredKeyword || "").trim();
  if (options.reuseActive && result3 && local.all.includes(result3)) {
    const result4 = local.all.indexOf(result3);
    local.activeByAccount.set(result2, result3);
    local.queue = local.queue.filter(arg1 => local.all.indexOf(arg1) > result4);
    persistPool(result, local);
    return {
      keyword: result3,
      remaining: local.queue.length,
      total: local.all.length,
      claimed: local.all.length - local.queue.length,
      resumed: true
    };
  }
  const result4 = local.activeByAccount.get(result2);
  if (options.reuseActive && result4) {
    return {
      keyword: result4,
      remaining: local.queue.length,
      total: local.all.length,
      claimed: local.all.length - local.queue.length,
      resumed: true
    };
  }
  local.activeByAccount.delete(result2);
  if (!local.queue.length) {
    persistPool(result, local);
    return {
      keyword: null,
      remaining: 0,
      total: local.all.length,
      claimed: local.all.length
    };
  }
  const result5 = local.queue.shift();
  local.activeByAccount.set(result2, result5);
  persistPool(result, local);
  const value = local.queue.length;
  const value2 = local.all.length - value;
  console.log("[KeywordPool] " + result + " 账号 " + arg2 + " 领取「" + result5 + "」（" + value2 + "/" + local.all.length + "，剩余 " + value + "）");
  return {
    keyword: result5,
    remaining: value,
    total: local.all.length,
    claimed: value2,
    resumed: false
  };
}
function releaseGlobalKeywordPool(arg1, options = {}) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return false;
  }
  const result2 = pools.delete(result);
  if (!options.preserve) {
    removePersistedPool(result);
  }
  if (result2) {
    console.log("[KeywordPool] 已释放任务池 " + result + (options.preserve ? "（续跑队列已保留）" : ""));
  }
  return result2;
}
module.exports = {
  configurePersistence: configurePersistence,
  initGlobalKeywordPool: initGlobalKeywordPool,
  claimLeadgenKeyword: claimLeadgenKeyword,
  releaseGlobalKeywordPool: releaseGlobalKeywordPool
};
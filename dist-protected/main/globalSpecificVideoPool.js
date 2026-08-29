const {
  extractDouyinVideoId
} = require("../shared/processedVideoKey");
const {
  resolveDouyinShareUrls
} = require("../shared/resolveDouyinShareUrl");
const STORE_KEY = "leadgen_specific_video_pools_v1";
const MAX_PERSISTED_POOLS = 50;
const pools = new Map();
let persistenceStore = null;
function toModalUrl(arg1) {
  const result = extractDouyinVideoId(arg1);
  if (result) {
    return "https://www.douyin.com/jingxuan?modal_id=" + result;
  }
  return String(arg1 || "").trim();
}
function normalizeVideoUrlList(list = []) {
  const set = new Set();
  const set2 = new Set();
  const list2 = [];
  const value = Array.isArray(list) ? list : String(list || "").split(/[\n,，\s]+/);
  value.forEach(arg1 => {
    const result = String(arg1 || "").trim();
    if (!result) {
      return;
    }
    const result2 = toModalUrl(result);
    const result3 = extractDouyinVideoId(result2 || result);
    if (result3) {
      if (set.has(result3)) {
        return;
      }
      set.add(result3);
      list2.push(result2);
      return;
    }
    if (set2.has(result2)) {
      return;
    }
    set2.add(result2);
    list2.push(result2);
  });
  return list2;
}
async function normalizeVideoUrlListAsync(list = []) {
  const value = Array.isArray(list) ? list : String(list || "").split(/[\n,，\s]+/);
  const result = value.map(arg1 => String(arg1 || "").trim()).filter(Boolean);
  if (result.length === 0) {
    return [];
  }
  let local = result;
  try {
    local = await resolveDouyinShareUrls(result);
  } catch (error) {
    console.warn("[SpecificVideoPool] 短链解析失败，回退原始链接:", error?.message || error);
  }
  return normalizeVideoUrlList(local);
}
function videoIdentity(arg1) {
  return extractDouyinVideoId(arg1) || String(arg1 || "").trim();
}
function urlsMatch(arg1, arg2) {
  const result = videoIdentity(arg1);
  const result2 = videoIdentity(arg2);
  if (result && result2) {
    return result === result2;
  }
  return toModalUrl(arg1) === toModalUrl(arg2);
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
    console.warn("[SpecificVideoPool] 保存续跑队列失败:", error.message);
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
async function hydratePool(arg1) {
  const value = readPersistedPools()[arg1];
  if (!value || typeof value !== "object") {
    return null;
  }
  const result = await normalizeVideoUrlListAsync(value.all);
  const set = new Set(result.map(videoIdentity).filter(Boolean));
  const result2 = (await normalizeVideoUrlListAsync(value.queue)).filter(arg1 => {
    const result2 = videoIdentity(arg1);
    if (result2) {
      return set.has(result2);
    } else {
      return result.some(arg12 => urlsMatch(arg12, arg1));
    }
  });
  const map = new Map();
  for (const [local, local2] of Object.entries(value.activeByAccount || {})) {
    const result2 = await normalizeVideoUrlListAsync([local2]);
    const local3 = result2[0] || toModalUrl(local2);
    if (local3 && result.some(arg1 => urlsMatch(arg1, local3))) {
      map.set(String(local), local3);
    }
  }
  return {
    all: result,
    queue: result2,
    activeByAccount: map
  };
}
function reconcilePoolUrls(arg1, arg2) {
  const result = normalizeVideoUrlList(arg2);
  const set = new Set(result.map(videoIdentity).filter(Boolean));
  const map = new Map([...arg1.activeByAccount.entries()].filter(([, arg1]) => {
    const result2 = videoIdentity(arg1);
    if (result2) {
      return set.has(result2);
    } else {
      return result.some(arg12 => urlsMatch(arg12, arg1));
    }
  }));
  const set2 = new Set([...map.values()].map(videoIdentity).filter(Boolean));
  const set3 = new Set(arg1.all.map(videoIdentity).filter(Boolean));
  const set4 = new Set(arg1.queue.map(videoIdentity).filter(Boolean));
  const result2 = arg1.queue.filter(arg1 => {
    const result2 = videoIdentity(arg1);
    if (!result2) {
      return result.some(arg12 => urlsMatch(arg12, arg1));
    }
    return set.has(result2) && !set2.has(result2);
  });
  result.forEach(arg12 => {
    const result = videoIdentity(arg12);
    const value = result ? !set3.has(result) : !arg1.all.some(arg1 => urlsMatch(arg1, arg12));
    const value2 = result ? set4.has(result) : arg1.queue.some(arg1 => urlsMatch(arg1, arg12));
    const value3 = result ? set2.has(result) : false;
    const result3 = result2.some(arg1 => urlsMatch(arg1, arg12));
    if ((value || value2) && !value3 && !result3) {
      result2.push(arg12);
    }
  });
  return {
    all: result,
    queue: result2,
    activeByAccount: map
  };
}
async function initSpecificVideoPool(arg1, list = [], options = {}) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return {
      total: 0,
      remaining: 0,
      resumed: false
    };
  }
  const result2 = await normalizeVideoUrlListAsync(list);
  let local = null;
  if (options.resume) {
    local = pools.get(result) || (await hydratePool(result));
    if (local) {
      local = reconcilePoolUrls(local, result2);
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
  console.log("[SpecificVideoPool] " + (options.resume ? "恢复" : "初始化") + "任务池 " + result + "：共 " + local.all.length + " 个视频，待领取 " + local.queue.length + " 个");
  return {
    total: local.all.length,
    remaining: local.queue.length,
    resumed: !!options.resume
  };
}
async function claimSpecificVideo(arg1, arg2, options = {}) {
  const result = String(arg1 || "").trim();
  const result2 = String(arg2 || "");
  const local = pools.get(result) || (await hydratePool(result));
  if (!local) {
    return {
      url: null,
      remaining: 0,
      total: 0,
      claimed: 0
    };
  }
  pools.set(result, local);
  const result3 = toModalUrl(options.preferredUrl || "");
  const result4 = local.activeByAccount.get(result2);
  if (options.reuseActive && result4) {
    return {
      url: result4,
      remaining: local.queue.length,
      total: local.all.length,
      claimed: local.all.length - local.queue.length,
      resumed: true
    };
  }
  if (options.reuseActive && result3 && local.all.some(arg1 => urlsMatch(arg1, result3))) {
    local.queue = local.queue.filter(arg1 => !urlsMatch(arg1, result3));
    local.activeByAccount.set(result2, result3);
    for (const [local2, local3] of local.activeByAccount.entries()) {
      if (local2 !== result2 && urlsMatch(local3, result3)) {
        local.activeByAccount.delete(local2);
      }
    }
    persistPool(result, local);
    return {
      url: result3,
      remaining: local.queue.length,
      total: local.all.length,
      claimed: local.all.length - local.queue.length,
      resumed: true
    };
  }
  if (!options.reuseActive) {
    local.activeByAccount.delete(result2);
  }
  if (!local.queue.length) {
    persistPool(result, local);
    return {
      url: null,
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
  console.log("[SpecificVideoPool] " + result + " 账号 " + arg2 + " 领取视频（" + value2 + "/" + local.all.length + "，剩余 " + value + "）: " + result5);
  return {
    url: result5,
    remaining: value,
    total: local.all.length,
    claimed: value2,
    resumed: false
  };
}
function releaseSpecificVideoPool(arg1, options = {}) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return false;
  }
  const result2 = pools.delete(result);
  if (!options.preserve) {
    removePersistedPool(result);
  }
  if (result2) {
    console.log("[SpecificVideoPool] 已释放任务池 " + result + (options.preserve ? "（续跑队列已保留）" : ""));
  }
  return result2;
}
module.exports = {
  configurePersistence: configurePersistence,
  normalizeVideoUrlList: normalizeVideoUrlList,
  normalizeVideoUrlListAsync: normalizeVideoUrlListAsync,
  initSpecificVideoPool: initSpecificVideoPool,
  claimSpecificVideo: claimSpecificVideo,
  releaseSpecificVideoPool: releaseSpecificVideoPool
};
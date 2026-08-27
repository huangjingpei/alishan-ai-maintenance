const STORE_KEY = "leadgen_keyword_pools_v1";
const MAX_PERSISTED_POOLS = 50;
const pools = new Map();
let persistenceStore = null;
function normalizeKeywordList(_0x5cb6e4 = []) {
  const _0xfdb911 = new Set();
  return (Array.isArray(_0x5cb6e4) ? _0x5cb6e4 : []).map(_0x3b6ed0 => String(_0x3b6ed0 || "").trim()).filter(_0x405efd => {
    if (!_0x405efd || _0xfdb911.has(_0x405efd)) {
      return false;
    }
    _0xfdb911.add(_0x405efd);
    return true;
  });
}
function configurePersistence(_0x1aa28c) {
  persistenceStore = _0x1aa28c && typeof _0x1aa28c.get === "function" && typeof _0x1aa28c.set === "function" ? _0x1aa28c : null;
}
function readPersistedPools() {
  if (!persistenceStore) {
    return {};
  }
  try {
    const _0x43ee0c = persistenceStore.get(STORE_KEY, {});
    if (_0x43ee0c && typeof _0x43ee0c === "object") {
      return _0x43ee0c;
    } else {
      return {};
    }
  } catch (_0x580779) {
    return {};
  }
}
function writePersistedPools(_0x43f52a) {
  if (!persistenceStore) {
    return;
  }
  try {
    persistenceStore.set(STORE_KEY, _0x43f52a);
  } catch (_0x20dda6) {
    console.warn("[KeywordPool] 保存续跑队列失败:", _0x20dda6.message);
  }
}
function serializePool(_0x3c688b) {
  return {
    all: [..._0x3c688b.all],
    queue: [..._0x3c688b.queue],
    activeByAccount: Object.fromEntries(_0x3c688b.activeByAccount),
    updatedAt: Date.now()
  };
}
function persistPool(_0x2d8b9d, _0x171ad2) {
  const _0x5c67c6 = readPersistedPools();
  _0x5c67c6[_0x2d8b9d] = serializePool(_0x171ad2);
  const _0x2ce338 = Object.entries(_0x5c67c6).sort((_0x1b11b8, _0x44a7c2) => Number(_0x44a7c2[1]?.updatedAt || 0) - Number(_0x1b11b8[1]?.updatedAt || 0)).slice(0, MAX_PERSISTED_POOLS);
  writePersistedPools(Object.fromEntries(_0x2ce338));
}
function removePersistedPool(_0xff72d8) {
  const _0x41c180 = readPersistedPools();
  if (!Object.prototype.hasOwnProperty.call(_0x41c180, _0xff72d8)) {
    return;
  }
  delete _0x41c180[_0xff72d8];
  writePersistedPools(_0x41c180);
}
function hydratePool(_0x29f92c) {
  const _0x3349fd = readPersistedPools()[_0x29f92c];
  if (!_0x3349fd || typeof _0x3349fd !== "object") {
    return null;
  }
  const _0x405363 = normalizeKeywordList(_0x3349fd.all);
  const _0x54f6c6 = new Set(_0x405363);
  const _0x22c345 = normalizeKeywordList(_0x3349fd.queue).filter(_0x544e17 => _0x54f6c6.has(_0x544e17));
  const _0x513ee4 = new Map(Object.entries(_0x3349fd.activeByAccount || {}).map(([_0x5a7298, _0x109537]) => [String(_0x5a7298), String(_0x109537 || "").trim()]).filter(([, _0x2502f5]) => _0x2502f5 && _0x54f6c6.has(_0x2502f5)));
  return {
    all: _0x405363,
    queue: _0x22c345,
    activeByAccount: _0x513ee4
  };
}
function reconcilePoolKeywords(_0x462a71, _0x2e574b) {
  const _0x24a18a = normalizeKeywordList(_0x2e574b);
  const _0x1b1e73 = new Set(_0x24a18a);
  const _0x502993 = new Map([..._0x462a71.activeByAccount.entries()].filter(([, _0x4a85cc]) => _0x1b1e73.has(_0x4a85cc)));
  const _0x273425 = new Set(_0x502993.values());
  const _0x1db350 = new Set(_0x462a71.all);
  const _0x59b50a = new Set(_0x462a71.queue);
  const _0x2b299f = _0x462a71.queue.filter(_0x356aec => _0x1b1e73.has(_0x356aec) && !_0x273425.has(_0x356aec));
  _0x24a18a.forEach(_0x20d3de => {
    const _0x2bd6cc = !_0x1db350.has(_0x20d3de);
    if (_0x2bd6cc && !_0x273425.has(_0x20d3de) && !_0x2b299f.includes(_0x20d3de)) {
      _0x2b299f.push(_0x20d3de);
    }
    if (_0x59b50a.has(_0x20d3de) && !_0x273425.has(_0x20d3de) && !_0x2b299f.includes(_0x20d3de)) {
      _0x2b299f.push(_0x20d3de);
    }
  });
  return {
    all: _0x24a18a,
    queue: _0x2b299f,
    activeByAccount: _0x502993
  };
}
function initGlobalKeywordPool(_0x118602, _0x2359fe = [], _0x4064ca = {}) {
  const _0x378653 = String(_0x118602 || "").trim();
  if (!_0x378653) {
    return {
      total: 0,
      resumed: false
    };
  }
  const _0x11dd50 = normalizeKeywordList(_0x2359fe);
  let _0x8d48be = null;
  if (_0x4064ca.resume) {
    _0x8d48be = pools.get(_0x378653) || hydratePool(_0x378653);
    if (_0x8d48be) {
      _0x8d48be = reconcilePoolKeywords(_0x8d48be, _0x11dd50);
    }
  }
  if (!_0x8d48be) {
    _0x8d48be = {
      all: [..._0x11dd50],
      queue: [..._0x11dd50],
      activeByAccount: new Map()
    };
  }
  pools.set(_0x378653, _0x8d48be);
  persistPool(_0x378653, _0x8d48be);
  console.log("[KeywordPool] " + (_0x4064ca.resume ? "恢复" : "初始化") + "任务池 " + _0x378653 + "：共 " + _0x8d48be.all.length + " 个关键词，待领取 " + _0x8d48be.queue.length + " 个");
  return {
    total: _0x8d48be.all.length,
    remaining: _0x8d48be.queue.length,
    resumed: !!_0x4064ca.resume
  };
}
function claimLeadgenKeyword(_0x162fea, _0x224217, _0x5966d2 = {}) {
  const _0x17f793 = String(_0x162fea || "").trim();
  const _0x3269d2 = String(_0x224217 || "");
  const _0x354b0b = pools.get(_0x17f793) || hydratePool(_0x17f793);
  if (!_0x354b0b) {
    return {
      keyword: null,
      remaining: 0,
      total: 0,
      claimed: 0
    };
  }
  pools.set(_0x17f793, _0x354b0b);
  const _0x51b7fc = String(_0x5966d2.preferredKeyword || "").trim();
  if (_0x5966d2.reuseActive && _0x51b7fc && _0x354b0b.all.includes(_0x51b7fc)) {
    const _0x5377a6 = _0x354b0b.all.indexOf(_0x51b7fc);
    _0x354b0b.activeByAccount.set(_0x3269d2, _0x51b7fc);
    _0x354b0b.queue = _0x354b0b.queue.filter(_0x5801df => _0x354b0b.all.indexOf(_0x5801df) > _0x5377a6);
    persistPool(_0x17f793, _0x354b0b);
    return {
      keyword: _0x51b7fc,
      remaining: _0x354b0b.queue.length,
      total: _0x354b0b.all.length,
      claimed: _0x354b0b.all.length - _0x354b0b.queue.length,
      resumed: true
    };
  }
  const _0x5388ee = _0x354b0b.activeByAccount.get(_0x3269d2);
  if (_0x5966d2.reuseActive && _0x5388ee) {
    return {
      keyword: _0x5388ee,
      remaining: _0x354b0b.queue.length,
      total: _0x354b0b.all.length,
      claimed: _0x354b0b.all.length - _0x354b0b.queue.length,
      resumed: true
    };
  }
  _0x354b0b.activeByAccount.delete(_0x3269d2);
  if (!_0x354b0b.queue.length) {
    persistPool(_0x17f793, _0x354b0b);
    return {
      keyword: null,
      remaining: 0,
      total: _0x354b0b.all.length,
      claimed: _0x354b0b.all.length
    };
  }
  const _0x5a51ec = _0x354b0b.queue.shift();
  _0x354b0b.activeByAccount.set(_0x3269d2, _0x5a51ec);
  persistPool(_0x17f793, _0x354b0b);
  const _0x89f30d = _0x354b0b.queue.length;
  const _0x3b88b2 = _0x354b0b.all.length - _0x89f30d;
  console.log("[KeywordPool] " + _0x17f793 + " 账号 " + _0x224217 + " 领取「" + _0x5a51ec + "」（" + _0x3b88b2 + "/" + _0x354b0b.all.length + "，剩余 " + _0x89f30d + "）");
  return {
    keyword: _0x5a51ec,
    remaining: _0x89f30d,
    total: _0x354b0b.all.length,
    claimed: _0x3b88b2,
    resumed: false
  };
}
function releaseGlobalKeywordPool(_0x4e8c70, _0x566876 = {}) {
  const _0x3792d3 = String(_0x4e8c70 || "").trim();
  if (!_0x3792d3) {
    return false;
  }
  const _0x25f7f4 = pools.delete(_0x3792d3);
  if (!_0x566876.preserve) {
    removePersistedPool(_0x3792d3);
  }
  if (_0x25f7f4) {
    console.log("[KeywordPool] 已释放任务池 " + _0x3792d3 + (_0x566876.preserve ? "（续跑队列已保留）" : ""));
  }
  return _0x25f7f4;
}
module.exports = {
  configurePersistence: configurePersistence,
  initGlobalKeywordPool: initGlobalKeywordPool,
  claimLeadgenKeyword: claimLeadgenKeyword,
  releaseGlobalKeywordPool: releaseGlobalKeywordPool
};
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
function toModalUrl(_0x3ec2ce) {
  const _0xe77948 = extractDouyinVideoId(_0x3ec2ce);
  if (_0xe77948) {
    return "https://www.douyin.com/jingxuan?modal_id=" + _0xe77948;
  }
  return String(_0x3ec2ce || "").trim();
}
function normalizeVideoUrlList(_0x578fd3 = []) {
  const _0x47fdef = new Set();
  const _0x5b69ae = new Set();
  const _0x1f660f = [];
  const _0x2a2243 = Array.isArray(_0x578fd3) ? _0x578fd3 : String(_0x578fd3 || "").split(/[\n,，\s]+/);
  _0x2a2243.forEach(_0x51eda4 => {
    const _0x11ed6e = String(_0x51eda4 || "").trim();
    if (!_0x11ed6e) {
      return;
    }
    const _0x12e499 = toModalUrl(_0x11ed6e);
    const _0xa7f90 = extractDouyinVideoId(_0x12e499 || _0x11ed6e);
    if (_0xa7f90) {
      if (_0x47fdef.has(_0xa7f90)) {
        return;
      }
      _0x47fdef.add(_0xa7f90);
      _0x1f660f.push(_0x12e499);
      return;
    }
    if (_0x5b69ae.has(_0x12e499)) {
      return;
    }
    _0x5b69ae.add(_0x12e499);
    _0x1f660f.push(_0x12e499);
  });
  return _0x1f660f;
}
async function normalizeVideoUrlListAsync(_0x389378 = []) {
  const _0x5d4ebe = Array.isArray(_0x389378) ? _0x389378 : String(_0x389378 || "").split(/[\n,，\s]+/);
  const _0x465806 = _0x5d4ebe.map(_0x505661 => String(_0x505661 || "").trim()).filter(Boolean);
  if (_0x465806.length === 0) {
    return [];
  }
  let _0x28ee92 = _0x465806;
  try {
    _0x28ee92 = await resolveDouyinShareUrls(_0x465806);
  } catch (_0x50bf7b) {
    console.warn("[SpecificVideoPool] 短链解析失败，回退原始链接:", _0x50bf7b?.message || _0x50bf7b);
  }
  return normalizeVideoUrlList(_0x28ee92);
}
function videoIdentity(_0x2ca37b) {
  return extractDouyinVideoId(_0x2ca37b) || String(_0x2ca37b || "").trim();
}
function urlsMatch(_0x1bff8b, _0x29e787) {
  const _0x20a15c = videoIdentity(_0x1bff8b);
  const _0x46e6c1 = videoIdentity(_0x29e787);
  if (_0x20a15c && _0x46e6c1) {
    return _0x20a15c === _0x46e6c1;
  }
  return toModalUrl(_0x1bff8b) === toModalUrl(_0x29e787);
}
function configurePersistence(_0xb54809) {
  persistenceStore = _0xb54809 && typeof _0xb54809.get === "function" && typeof _0xb54809.set === "function" ? _0xb54809 : null;
}
function readPersistedPools() {
  if (!persistenceStore) {
    return {};
  }
  try {
    const _0x539870 = persistenceStore.get(STORE_KEY, {});
    if (_0x539870 && typeof _0x539870 === "object") {
      return _0x539870;
    } else {
      return {};
    }
  } catch (_0x50ec73) {
    return {};
  }
}
function writePersistedPools(_0x3c37d8) {
  if (!persistenceStore) {
    return;
  }
  try {
    persistenceStore.set(STORE_KEY, _0x3c37d8);
  } catch (_0x56771d) {
    console.warn("[SpecificVideoPool] 保存续跑队列失败:", _0x56771d.message);
  }
}
function serializePool(_0x5166c7) {
  return {
    all: [..._0x5166c7.all],
    queue: [..._0x5166c7.queue],
    activeByAccount: Object.fromEntries(_0x5166c7.activeByAccount),
    updatedAt: Date.now()
  };
}
function persistPool(_0x2a5d5e, _0x112684) {
  const _0x5623c9 = readPersistedPools();
  _0x5623c9[_0x2a5d5e] = serializePool(_0x112684);
  const _0x33dad7 = Object.entries(_0x5623c9).sort((_0x3f93b0, _0x2e8882) => Number(_0x2e8882[1]?.updatedAt || 0) - Number(_0x3f93b0[1]?.updatedAt || 0)).slice(0, MAX_PERSISTED_POOLS);
  writePersistedPools(Object.fromEntries(_0x33dad7));
}
function removePersistedPool(_0x3360ec) {
  const _0x5cbeee = readPersistedPools();
  if (!Object.prototype.hasOwnProperty.call(_0x5cbeee, _0x3360ec)) {
    return;
  }
  delete _0x5cbeee[_0x3360ec];
  writePersistedPools(_0x5cbeee);
}
async function hydratePool(_0x2deb18) {
  const _0xa96649 = readPersistedPools()[_0x2deb18];
  if (!_0xa96649 || typeof _0xa96649 !== "object") {
    return null;
  }
  const _0x3a2ff0 = await normalizeVideoUrlListAsync(_0xa96649.all);
  const _0xdce9d5 = new Set(_0x3a2ff0.map(videoIdentity).filter(Boolean));
  const _0x2d8ff3 = (await normalizeVideoUrlListAsync(_0xa96649.queue)).filter(_0x30579c => {
    const _0x46074e = videoIdentity(_0x30579c);
    if (_0x46074e) {
      return _0xdce9d5.has(_0x46074e);
    } else {
      return _0x3a2ff0.some(_0x58b118 => urlsMatch(_0x58b118, _0x30579c));
    }
  });
  const _0x4a9b00 = new Map();
  for (const [_0xf7476, _0xc7153a] of Object.entries(_0xa96649.activeByAccount || {})) {
    const _0x1e6f97 = await normalizeVideoUrlListAsync([_0xc7153a]);
    const _0x2c6176 = _0x1e6f97[0] || toModalUrl(_0xc7153a);
    if (_0x2c6176 && _0x3a2ff0.some(_0x158971 => urlsMatch(_0x158971, _0x2c6176))) {
      _0x4a9b00.set(String(_0xf7476), _0x2c6176);
    }
  }
  return {
    all: _0x3a2ff0,
    queue: _0x2d8ff3,
    activeByAccount: _0x4a9b00
  };
}
function reconcilePoolUrls(_0x416fba, _0x3e962e) {
  const _0x31dfbd = normalizeVideoUrlList(_0x3e962e);
  const _0x4a8320 = new Set(_0x31dfbd.map(videoIdentity).filter(Boolean));
  const _0x5826ed = new Map([..._0x416fba.activeByAccount.entries()].filter(([, _0x9e1918]) => {
    const _0x5decb7 = videoIdentity(_0x9e1918);
    if (_0x5decb7) {
      return _0x4a8320.has(_0x5decb7);
    } else {
      return _0x31dfbd.some(_0x41eb59 => urlsMatch(_0x41eb59, _0x9e1918));
    }
  }));
  const _0x4194b8 = new Set([..._0x5826ed.values()].map(videoIdentity).filter(Boolean));
  const _0x186c44 = new Set(_0x416fba.all.map(videoIdentity).filter(Boolean));
  const _0x5d79b3 = new Set(_0x416fba.queue.map(videoIdentity).filter(Boolean));
  const _0x29b7df = _0x416fba.queue.filter(_0x4694c8 => {
    const _0x12f9d1 = videoIdentity(_0x4694c8);
    if (!_0x12f9d1) {
      return _0x31dfbd.some(_0xdd3fac => urlsMatch(_0xdd3fac, _0x4694c8));
    }
    return _0x4a8320.has(_0x12f9d1) && !_0x4194b8.has(_0x12f9d1);
  });
  _0x31dfbd.forEach(_0x3e668f => {
    const _0x13c96a = videoIdentity(_0x3e668f);
    const _0x59d317 = _0x13c96a ? !_0x186c44.has(_0x13c96a) : !_0x416fba.all.some(_0x53d77a => urlsMatch(_0x53d77a, _0x3e668f));
    const _0xa8e12 = _0x13c96a ? _0x5d79b3.has(_0x13c96a) : _0x416fba.queue.some(_0xfc80d7 => urlsMatch(_0xfc80d7, _0x3e668f));
    const _0x12c303 = _0x13c96a ? _0x4194b8.has(_0x13c96a) : false;
    const _0xcfc7c1 = _0x29b7df.some(_0x4d2410 => urlsMatch(_0x4d2410, _0x3e668f));
    if ((_0x59d317 || _0xa8e12) && !_0x12c303 && !_0xcfc7c1) {
      _0x29b7df.push(_0x3e668f);
    }
  });
  return {
    all: _0x31dfbd,
    queue: _0x29b7df,
    activeByAccount: _0x5826ed
  };
}
async function initSpecificVideoPool(_0x349986, _0x4df486 = [], _0x1a745e = {}) {
  const _0x5c2052 = String(_0x349986 || "").trim();
  if (!_0x5c2052) {
    return {
      total: 0,
      remaining: 0,
      resumed: false
    };
  }
  const _0x1128b7 = await normalizeVideoUrlListAsync(_0x4df486);
  let _0x34a558 = null;
  if (_0x1a745e.resume) {
    _0x34a558 = pools.get(_0x5c2052) || (await hydratePool(_0x5c2052));
    if (_0x34a558) {
      _0x34a558 = reconcilePoolUrls(_0x34a558, _0x1128b7);
    }
  }
  if (!_0x34a558) {
    _0x34a558 = {
      all: [..._0x1128b7],
      queue: [..._0x1128b7],
      activeByAccount: new Map()
    };
  }
  pools.set(_0x5c2052, _0x34a558);
  persistPool(_0x5c2052, _0x34a558);
  console.log("[SpecificVideoPool] " + (_0x1a745e.resume ? "恢复" : "初始化") + "任务池 " + _0x5c2052 + "：共 " + _0x34a558.all.length + " 个视频，待领取 " + _0x34a558.queue.length + " 个");
  return {
    total: _0x34a558.all.length,
    remaining: _0x34a558.queue.length,
    resumed: !!_0x1a745e.resume
  };
}
async function claimSpecificVideo(_0x5adce3, _0x5d92e4, _0x6f91c0 = {}) {
  const _0x2f91d5 = String(_0x5adce3 || "").trim();
  const _0x4433fb = String(_0x5d92e4 || "");
  const _0x2ed224 = pools.get(_0x2f91d5) || (await hydratePool(_0x2f91d5));
  if (!_0x2ed224) {
    return {
      url: null,
      remaining: 0,
      total: 0,
      claimed: 0
    };
  }
  pools.set(_0x2f91d5, _0x2ed224);
  const _0x33cc45 = toModalUrl(_0x6f91c0.preferredUrl || "");
  const _0x3a5132 = _0x2ed224.activeByAccount.get(_0x4433fb);
  if (_0x6f91c0.reuseActive && _0x3a5132) {
    return {
      url: _0x3a5132,
      remaining: _0x2ed224.queue.length,
      total: _0x2ed224.all.length,
      claimed: _0x2ed224.all.length - _0x2ed224.queue.length,
      resumed: true
    };
  }
  if (_0x6f91c0.reuseActive && _0x33cc45 && _0x2ed224.all.some(_0x39e2f0 => urlsMatch(_0x39e2f0, _0x33cc45))) {
    _0x2ed224.queue = _0x2ed224.queue.filter(_0x1032ba => !urlsMatch(_0x1032ba, _0x33cc45));
    _0x2ed224.activeByAccount.set(_0x4433fb, _0x33cc45);
    for (const [_0x100027, _0x27c68b] of _0x2ed224.activeByAccount.entries()) {
      if (_0x100027 !== _0x4433fb && urlsMatch(_0x27c68b, _0x33cc45)) {
        _0x2ed224.activeByAccount.delete(_0x100027);
      }
    }
    persistPool(_0x2f91d5, _0x2ed224);
    return {
      url: _0x33cc45,
      remaining: _0x2ed224.queue.length,
      total: _0x2ed224.all.length,
      claimed: _0x2ed224.all.length - _0x2ed224.queue.length,
      resumed: true
    };
  }
  if (!_0x6f91c0.reuseActive) {
    _0x2ed224.activeByAccount.delete(_0x4433fb);
  }
  if (!_0x2ed224.queue.length) {
    persistPool(_0x2f91d5, _0x2ed224);
    return {
      url: null,
      remaining: 0,
      total: _0x2ed224.all.length,
      claimed: _0x2ed224.all.length
    };
  }
  const _0x220fc1 = _0x2ed224.queue.shift();
  _0x2ed224.activeByAccount.set(_0x4433fb, _0x220fc1);
  persistPool(_0x2f91d5, _0x2ed224);
  const _0x3bb92a = _0x2ed224.queue.length;
  const _0x85f8cc = _0x2ed224.all.length - _0x3bb92a;
  console.log("[SpecificVideoPool] " + _0x2f91d5 + " 账号 " + _0x5d92e4 + " 领取视频（" + _0x85f8cc + "/" + _0x2ed224.all.length + "，剩余 " + _0x3bb92a + "）: " + _0x220fc1);
  return {
    url: _0x220fc1,
    remaining: _0x3bb92a,
    total: _0x2ed224.all.length,
    claimed: _0x85f8cc,
    resumed: false
  };
}
function releaseSpecificVideoPool(_0x471d88, _0x27d0fc = {}) {
  const _0x5eee8c = String(_0x471d88 || "").trim();
  if (!_0x5eee8c) {
    return false;
  }
  const _0x27c8a7 = pools.delete(_0x5eee8c);
  if (!_0x27d0fc.preserve) {
    removePersistedPool(_0x5eee8c);
  }
  if (_0x27c8a7) {
    console.log("[SpecificVideoPool] 已释放任务池 " + _0x5eee8c + (_0x27d0fc.preserve ? "（续跑队列已保留）" : ""));
  }
  return _0x27c8a7;
}
module.exports = {
  configurePersistence: configurePersistence,
  normalizeVideoUrlList: normalizeVideoUrlList,
  normalizeVideoUrlListAsync: normalizeVideoUrlListAsync,
  initSpecificVideoPool: initSpecificVideoPool,
  claimSpecificVideo: claimSpecificVideo,
  releaseSpecificVideoPool: releaseSpecificVideoPool
};
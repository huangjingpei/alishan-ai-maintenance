'use strict';

const fs = require("fs");
const path = require("path");
const BATCH_FOLLOW_RUNS_KEY = "batch_follow_runs";
const DEFAULT_BATCH_RUN_LIMIT = 30;
const DEFAULT_BATCH_RUN_LOG_LIMIT = 120;
const DEFAULT_BATCH_RUN_RESULT_LIMIT = 80;
const DEFAULT_MONITOR_SEEN_LIMIT = 3000;
const DEFAULT_MONITOR_SEEN_KEY_LIMIT = 40;
const DEFAULT_PARTITION_MAX_AGE_MS = 1209600000;
function safeStoreGet(_0x3a8bce, _0x4fcb7f, _0x38db43) {
  try {
    return _0x3a8bce?.get?.(_0x4fcb7f, _0x38db43);
  } catch (_0x5b0e0c) {
    return _0x38db43;
  }
}
function safeStoreSet(_0x16e923, _0x45e493, _0x3b3686) {
  try {
    _0x16e923?.set?.(_0x45e493, _0x3b3686);
    return true;
  } catch (_0x31e95c) {
    console.warn("[StartupHousekeeping] 写入 " + _0x45e493 + " 失败:", _0x31e95c?.message || _0x31e95c);
    return false;
  }
}
function safeStoreDelete(_0x418739, _0x4e8440) {
  try {
    if (typeof _0x418739?.delete === "function") {
      _0x418739.delete(_0x4e8440);
      return true;
    }
    _0x418739?.set?.(_0x4e8440, undefined);
    return true;
  } catch (_0x25d3b5) {
    return false;
  }
}
function listStoreKeys(_0x341170) {
  try {
    if (typeof _0x341170?.store === "object" && _0x341170.store) {
      return Object.keys(_0x341170.store);
    }
  } catch (_0x3a8e3b) {}
  try {
    const _0xdaaf93 = _0x341170?.path ? fs.readFileSync(_0x341170.path, "utf8") : "";
    if (!_0xdaaf93) {
      return [];
    }
    return Object.keys(JSON.parse(_0xdaaf93) || {});
  } catch (_0x1bae44) {
    return [];
  }
}
function compactBatchFollowRuns(_0x406574, {
  runLimit = DEFAULT_BATCH_RUN_LIMIT,
  logLimit = DEFAULT_BATCH_RUN_LOG_LIMIT,
  resultLimit = DEFAULT_BATCH_RUN_RESULT_LIMIT
} = {}) {
  if (!Array.isArray(_0x406574)) {
    return [];
  }
  return _0x406574.slice(0, Math.max(1, runLimit)).map(_0x41cd3b => {
    if (!_0x41cd3b || typeof _0x41cd3b !== "object") {
      return _0x41cd3b;
    }
    const _0x242c05 = {
      ..._0x41cd3b
    };
    if (Array.isArray(_0x242c05.logs) && _0x242c05.logs.length > logLimit) {
      _0x242c05.logs = _0x242c05.logs.slice(-logLimit);
    }
    if (Array.isArray(_0x242c05.results) && _0x242c05.results.length > resultLimit) {
      _0x242c05.results = _0x242c05.results.slice(0, resultLimit);
    }
    return _0x242c05;
  });
}
function pruneElectronStoreBloat(_0x4a9f6e, _0x420213 = {}) {
  const _0x2cadf1 = {
    batchRunsBefore: 0,
    batchRunsAfter: 0,
    monitorSeenTrimmed: 0,
    monitorSeenKeysRemoved: 0,
    changed: false
  };
  if (!_0x4a9f6e) {
    return _0x2cadf1;
  }
  const _0x398b9e = Number(_0x420213.monitorSeenLimit) > 0 ? Number(_0x420213.monitorSeenLimit) : DEFAULT_MONITOR_SEEN_LIMIT;
  const _0x953c6c = Number(_0x420213.monitorSeenKeyLimit) > 0 ? Number(_0x420213.monitorSeenKeyLimit) : DEFAULT_MONITOR_SEEN_KEY_LIMIT;
  const _0x5ed5c4 = (_0x2f4293, _0x4800fc) => {
    if (!Array.isArray(_0x2f4293) || !_0x2f4293.length) {
      return;
    }
    if (!_0x2cadf1.batchRunsBefore) {
      _0x2cadf1.batchRunsBefore = _0x2f4293.length;
    }
    const _0x3e802d = compactBatchFollowRuns(_0x2f4293, _0x420213);
    _0x2cadf1.batchRunsAfter = _0x3e802d.length;
    const _0x434037 = JSON.stringify(_0x2f4293).length;
    const _0x4c3203 = JSON.stringify(_0x3e802d).length;
    if (_0x3e802d.length !== _0x2f4293.length || _0x4c3203 < _0x434037) {
      _0x4800fc(_0x3e802d);
      _0x2cadf1.changed = true;
    }
  };
  try {
    const _0x44dbcf = require("./batchFollowRunsAccess");
    _0x5ed5c4(_0x44dbcf.listAll(_0x4a9f6e), _0x2a6dfa => {
      _0x44dbcf.replaceAll(_0x4a9f6e, _0x2a6dfa);
    });
  } catch (_0x2c2458) {}
  _0x5ed5c4(safeStoreGet(_0x4a9f6e, BATCH_FOLLOW_RUNS_KEY, []), _0x5ba301 => {
    safeStoreSet(_0x4a9f6e, BATCH_FOLLOW_RUNS_KEY, _0x5ba301);
  });
  try {
    const _0x3fdbba = require("./monitorTaskSeenAccess");
    const _0x3081af = _0x3fdbba.pruneSqlite({
      seenLimit: _0x398b9e,
      seenKeyLimit: _0x953c6c
    });
    if (_0x3081af.trimmed || _0x3081af.removed) {
      _0x2cadf1.monitorSeenTrimmed += _0x3081af.trimmed;
      _0x2cadf1.monitorSeenKeysRemoved += _0x3081af.removed;
      _0x2cadf1.changed = true;
    }
  } catch (_0x247bc1) {}
  const _0x3c5d4a = listStoreKeys(_0x4a9f6e).filter(_0xb54d7d => /^monitor_task_seen_/.test(_0xb54d7d) || /^monitor_task_notified_/.test(_0xb54d7d)).sort();
  if (_0x3c5d4a.length > _0x953c6c) {
    const _0x27fe49 = _0x3c5d4a.slice(0, _0x3c5d4a.length - _0x953c6c);
    for (const _0x3997eb of _0x27fe49) {
      if (safeStoreDelete(_0x4a9f6e, _0x3997eb)) {
        _0x2cadf1.monitorSeenKeysRemoved += 1;
        _0x2cadf1.changed = true;
      }
    }
  }
  const _0x5151f8 = listStoreKeys(_0x4a9f6e).filter(_0x3cde89 => /^monitor_task_seen_/.test(_0x3cde89) || /^monitor_task_notified_/.test(_0x3cde89));
  for (const _0x34ef01 of _0x5151f8) {
    const _0x317755 = safeStoreGet(_0x4a9f6e, _0x34ef01, []);
    if (!Array.isArray(_0x317755) || _0x317755.length <= _0x398b9e) {
      continue;
    }
    if (safeStoreSet(_0x4a9f6e, _0x34ef01, _0x317755.slice(-_0x398b9e))) {
      _0x2cadf1.monitorSeenTrimmed += 1;
      _0x2cadf1.changed = true;
    }
  }
  return _0x2cadf1;
}
function collectAccountIdsFromPool(_0x4736c9) {
  const _0x149cb0 = new Set();
  const _0x328a70 = Array.isArray(_0x4736c9) ? _0x4736c9 : [];
  for (const _0x5dc08e of _0x328a70) {
    const _0x581637 = String(_0x5dc08e?.id || _0x5dc08e?.accountId || "").trim();
    if (_0x581637) {
      _0x149cb0.add(_0x581637);
    }
  }
  return _0x149cb0;
}
function buildProtectedPartitionNames(_0x3dd9d6 = []) {
  const _0x31782e = new Set();
  for (const _0xa6f9bb of _0x3dd9d6) {
    _0x31782e.add("automation:douyin_" + _0xa6f9bb);
    _0x31782e.add("automation:xianyu_" + _0xa6f9bb);
    _0x31782e.add("automation:entity_" + _0xa6f9bb);
    _0x31782e.add("automation:douyin_entity-preview:entity_" + _0xa6f9bb);
    _0x31782e.add("douyin_" + _0xa6f9bb);
    _0x31782e.add("douyin_monitor_" + _0xa6f9bb);
  }
  return _0x31782e;
}
function listActivePartitionNames(_0x567d02) {
  const _0x2c3e62 = new Set();
  const _0x2ed4a6 = typeof _0x567d02 === "function" ? _0x567d02() : [];
  for (const _0x2729ec of Array.isArray(_0x2ed4a6) ? _0x2ed4a6 : []) {
    try {
      if (!_0x2729ec || _0x2729ec.isDestroyed?.()) {
        continue;
      }
      const _0xdc8bdf = String(_0x2729ec.session?.partition || "").trim();
      if (!_0xdc8bdf) {
        continue;
      }
      const _0xed54e6 = _0xdc8bdf.startsWith("persist:") ? _0xdc8bdf.slice("persist:".length) : _0xdc8bdf;
      if (_0xed54e6) {
        _0x2c3e62.add(_0xed54e6);
      }
    } catch (_0x47f034) {}
  }
  return _0x2c3e62;
}
function rmDirRecursive(_0x15399c) {
  fs.rmSync(_0x15399c, {
    recursive: true,
    force: true,
    maxRetries: 2
  });
}
function cleanupOrphanAutomationPartitions({
  userDataPath: _0x94812b,
  accountPool: _0x63aa4d,
  getAllWebContents: _0x3bdefc,
  maxAgeMs = DEFAULT_PARTITION_MAX_AGE_MS,
  now = Date.now(),
  dryRun = false
} = {}) {
  const _0x1c2479 = {
    scanned: 0,
    deleted: 0,
    skippedProtected: 0,
    skippedActive: 0,
    skippedFresh: 0,
    failed: 0,
    freedHint: []
  };
  const _0x531874 = path.join(String(_0x94812b || ""), "Partitions");
  if (!_0x94812b || !fs.existsSync(_0x531874)) {
    return _0x1c2479;
  }
  const _0x98875c = collectAccountIdsFromPool(_0x63aa4d);
  const _0x42e31b = buildProtectedPartitionNames(_0x98875c);
  const _0x15d401 = listActivePartitionNames(_0x3bdefc);
  const _0x528ccc = Number(maxAgeMs) > 0 ? Number(maxAgeMs) : DEFAULT_PARTITION_MAX_AGE_MS;
  let _0x4b63b1 = [];
  try {
    _0x4b63b1 = fs.readdirSync(_0x531874, {
      withFileTypes: true
    });
  } catch (_0x275ab4) {
    console.warn("[StartupHousekeeping] 读取 Partitions 失败:", _0x275ab4?.message || _0x275ab4);
    return _0x1c2479;
  }
  for (const _0x3b5f3d of _0x4b63b1) {
    if (!_0x3b5f3d?.isDirectory?.()) {
      continue;
    }
    _0x1c2479.scanned += 1;
    const _0x5d070b = _0x3b5f3d.name;
    let _0x4a3194 = _0x5d070b;
    try {
      _0x4a3194 = decodeURIComponent(_0x5d070b);
    } catch (_0x663b42) {}
    const _0x24e7b6 = path.join(_0x531874, _0x5d070b);
    if (_0x42e31b.has(_0x4a3194)) {
      _0x1c2479.skippedProtected += 1;
      continue;
    }
    if (_0x15d401.has(_0x4a3194) || _0x15d401.has(_0x5d070b)) {
      _0x1c2479.skippedActive += 1;
      continue;
    }
    let _0xa71de2 = 0;
    try {
      _0xa71de2 = Number(fs.statSync(_0x24e7b6).mtimeMs) || 0;
    } catch (_0x57a5e7) {
      _0x1c2479.failed += 1;
      continue;
    }
    if (_0xa71de2 && now - _0xa71de2 < _0x528ccc) {
      _0x1c2479.skippedFresh += 1;
      continue;
    }
    if (dryRun) {
      _0x1c2479.deleted += 1;
      _0x1c2479.freedHint.push(_0x4a3194);
      continue;
    }
    try {
      rmDirRecursive(_0x24e7b6);
      _0x1c2479.deleted += 1;
      _0x1c2479.freedHint.push(_0x4a3194);
    } catch (_0x21f5ae) {
      _0x1c2479.failed += 1;
      console.warn("[StartupHousekeeping] 删除 Partition 失败 " + _0x4a3194 + ":", _0x21f5ae?.message || _0x21f5ae);
    }
  }
  return _0x1c2479;
}
module.exports = {
  BATCH_FOLLOW_RUNS_KEY: BATCH_FOLLOW_RUNS_KEY,
  DEFAULT_BATCH_RUN_LIMIT: DEFAULT_BATCH_RUN_LIMIT,
  DEFAULT_BATCH_RUN_LOG_LIMIT: DEFAULT_BATCH_RUN_LOG_LIMIT,
  DEFAULT_BATCH_RUN_RESULT_LIMIT: DEFAULT_BATCH_RUN_RESULT_LIMIT,
  DEFAULT_MONITOR_SEEN_LIMIT: DEFAULT_MONITOR_SEEN_LIMIT,
  DEFAULT_PARTITION_MAX_AGE_MS: DEFAULT_PARTITION_MAX_AGE_MS,
  compactBatchFollowRuns: compactBatchFollowRuns,
  pruneElectronStoreBloat: pruneElectronStoreBloat,
  collectAccountIdsFromPool: collectAccountIdsFromPool,
  buildProtectedPartitionNames: buildProtectedPartitionNames,
  cleanupOrphanAutomationPartitions: cleanupOrphanAutomationPartitions
};
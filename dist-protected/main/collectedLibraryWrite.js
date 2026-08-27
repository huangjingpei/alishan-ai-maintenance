'use strict';

const collectedVideosStore = require("./collectedVideosStore");
const collectedAuthorsStore = require("./collectedAuthorsStore");
const {
  splitVideoCardIntoCollectedRecords,
  isEntityRelationAuthorSource
} = require("../shared/collectedLeadKeys");
function isCollectedRouteLead(_0x88748b) {
  if (!_0x88748b || typeof _0x88748b !== "object") {
    return false;
  }
  if (_0x88748b.leadKind === "collected_video" || _0x88748b.leadKind === "collected_author") {
    return true;
  }
  if (_0x88748b.identityType === "author") {
    return true;
  }
  if (isEntityRelationAuthorSource(_0x88748b.sourceType, _0x88748b.entrySource)) {
    return true;
  }
  const _0x31d5f9 = String(_0x88748b.leadId || _0x88748b.userKey || _0x88748b.key || _0x88748b.id || "").trim();
  if (/^author:/.test(_0x31d5f9)) {
    return true;
  }
  const _0x41fe87 = Array.isArray(_0x88748b.collectedFields) ? _0x88748b.collectedFields.map(String) : [];
  if (_0x41fe87.includes("author") && !_0x41fe87.includes("video")) {
    return true;
  }
  try {
    const _0x4a6349 = require("../shared/leadUserKey");
    return !!_0x4a6349.isVideoLeadRecord(_0x88748b);
  } catch (_0x58889f) {
    if (_0x88748b.leadKind === "video_card" || _0x88748b.sourceType === "video" || _0x88748b.identityType === "video") {
      return true;
    }
    return /^video:\d{10,}$/.test(_0x31d5f9);
  }
}
function upsertCollectedFromLead(_0x5cdc33, _0xdae524) {
  if (!_0x5cdc33 || !_0xdae524) {
    return {
      written: false,
      video: false,
      author: false
    };
  }
  const {
    video: _0x376563,
    author: _0x2916f9
  } = splitVideoCardIntoCollectedRecords(_0xdae524);
  let _0x167c72 = false;
  let _0x448085 = false;
  if (_0x376563) {
    _0x167c72 = collectedVideosStore.upsertOne(_0x5cdc33, _0x376563);
  }
  if (_0x2916f9) {
    _0x448085 = collectedAuthorsStore.upsertOne(_0x5cdc33, _0x2916f9);
  }
  if (!_0x2916f9 && (isEntityRelationAuthorSource(_0xdae524.sourceType, _0xdae524.entrySource) || _0xdae524.leadKind === "collected_author" || _0xdae524.identityType === "author" || /^author:/.test(String(_0xdae524.leadId || _0xdae524.key || "")))) {
    _0x448085 = collectedAuthorsStore.upsertFromLead(_0x5cdc33, {
      ..._0xdae524,
      collectedFields: ["author"],
      authorProfileUrl: _0xdae524.authorProfileUrl || _0xdae524.userUrl || _0xdae524.leadId
    });
  }
  return {
    written: _0x167c72 || _0x448085,
    video: _0x167c72,
    author: _0x448085
  };
}
function upsertCollectedBatch(_0x5ac50e, _0x42cf49 = []) {
  if (!_0x5ac50e || !Array.isArray(_0x42cf49)) {
    return 0;
  }
  let _0x131e32 = 0;
  const _0x598ef7 = _0x5ac50e.transaction(_0x59a8cf => {
    for (const _0x574153 of _0x59a8cf) {
      if (!isCollectedRouteLead(_0x574153)) {
        continue;
      }
      const _0x22c7fc = upsertCollectedFromLead(_0x5ac50e, _0x574153);
      if (_0x22c7fc.written) {
        _0x131e32 += 1;
      }
    }
  });
  try {
    _0x598ef7(_0x42cf49);
    return _0x131e32;
  } catch (_0x45d949) {
    console.error("[DB] upsertCollectedBatch 失败:", _0x45d949);
    return _0x131e32;
  }
}
function syncEntityCollectedIntoLibraries(_0x2142a7, _0x4e6204) {
  if (!_0x2142a7 || typeof _0x4e6204 !== "function") {
    return {
      synced: 0
    };
  }
  try {
    const _0x15a5f5 = _0x4e6204();
    if (!_0x15a5f5.length) {
      return {
        synced: 0
      };
    }
    const _0x54bd0a = collectedVideosStore.listIds(_0x2142a7);
    const _0x36eead = collectedAuthorsStore.listIds(_0x2142a7);
    let _0x906f46 = 0;
    const _0x2de2bc = _0x2142a7.transaction(_0x4a1893 => {
      for (const _0x42d1b7 of _0x4a1893) {
        const {
          video: _0x4fea39,
          author: _0x684dcd
        } = splitVideoCardIntoCollectedRecords(_0x42d1b7);
        if (_0x4fea39 && !_0x54bd0a.has(_0x4fea39.id)) {
          if (collectedVideosStore.upsertOne(_0x2142a7, _0x4fea39)) {
            _0x54bd0a.add(_0x4fea39.id);
            _0x906f46 += 1;
          }
        }
        if (_0x684dcd && !_0x36eead.has(_0x684dcd.id)) {
          if (collectedAuthorsStore.upsertOne(_0x2142a7, _0x684dcd)) {
            _0x36eead.add(_0x684dcd.id);
            _0x906f46 += 1;
          }
        }
      }
    });
    _0x2de2bc(_0x15a5f5);
    return {
      synced: _0x906f46,
      scanned: _0x15a5f5.length
    };
  } catch (_0x41ad5a) {
    console.error("[DB] syncEntityCollectedIntoLibraries 失败:", _0x41ad5a);
    return {
      synced: 0,
      error: _0x41ad5a.message || String(_0x41ad5a)
    };
  }
}
module.exports = {
  isCollectedRouteLead: isCollectedRouteLead,
  upsertCollectedFromLead: upsertCollectedFromLead,
  upsertCollectedBatch: upsertCollectedBatch,
  syncEntityCollectedIntoLibraries: syncEntityCollectedIntoLibraries
};
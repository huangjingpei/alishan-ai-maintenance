'use strict';

const {
  isEntityRelationAuthorSource,
  resolveAuthorSecUidFromLead
} = require("./collectedLeadKeys");
function hasUsableSecUid(_0x47659d) {
  const _0x1afe6b = String(_0x47659d?.secUid || _0x47659d?.sec_uid || "").trim();
  if (_0x1afe6b.length < 15) {
    return false;
  }
  if (["self", "login", "anonymous", "undefined", "null"].includes(_0x1afe6b.toLowerCase())) {
    return false;
  }
  if (_0x1afe6b.startsWith("name:") || _0x1afe6b.startsWith("live_") || _0x1afe6b.startsWith("webcast:")) {
    return false;
  }
  return /^[A-Za-z0-9_-]+$/.test(_0x1afe6b);
}
function isEntityLiveLead(_0x8edef) {
  if (!_0x8edef || typeof _0x8edef !== "object") {
    return false;
  }
  if (_0x8edef.sourceType === "live" || _0x8edef.entrySource === "entity_live") {
    return true;
  }
  if (_0x8edef.webcastUid || _0x8edef.liveEvent || _0x8edef.liveUrl) {
    return true;
  }
  const _0x5f1f08 = String(_0x8edef.userKey || "");
  return _0x5f1f08.startsWith("webcast:");
}
function isEntityLeadEligibleForLeadPool(_0x8a3832) {
  if (!_0x8a3832 || typeof _0x8a3832 !== "object") {
    return false;
  }
  if (isEntityRelationAuthorSource(_0x8a3832.sourceType, _0x8a3832.entrySource)) {
    return !!resolveAuthorSecUidFromLead(_0x8a3832);
  }
  if (_0x8a3832.leadKind === "video_card" && (_0x8a3832.videoUrl || _0x8a3832.url || _0x8a3832.leadId)) {
    return true;
  }
  if (_0x8a3832.leadKind === "collected_author" && resolveAuthorSecUidFromLead(_0x8a3832)) {
    return true;
  }
  const _0x2d75f6 = String(_0x8a3832.nickname || "").trim();
  if (!_0x2d75f6) {
    return false;
  }
  if (isEntityLiveLead(_0x8a3832)) {
    return hasUsableSecUid(_0x8a3832);
  }
  if (_0x8a3832.userUrl || _0x8a3832.uid || _0x8a3832.secUid) {
    return true;
  }
  if (_0x8a3832.sourceType === "video" && (_0x8a3832.userKey || _0x8a3832.videoUrl)) {
    return true;
  }
  if (_0x8a3832.userKey) {
    return true;
  }
  return false;
}
module.exports = {
  hasUsableSecUid: hasUsableSecUid,
  isEntityLiveLead: isEntityLiveLead,
  isEntityLeadEligibleForLeadPool: isEntityLeadEligibleForLeadPool
};
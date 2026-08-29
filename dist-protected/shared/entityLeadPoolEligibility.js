'use strict';

const {
  isEntityRelationAuthorSource,
  resolveAuthorSecUidFromLead
} = require("./collectedLeadKeys");
function hasUsableSecUid(arg1) {
  const result = String(arg1?.secUid || arg1?.sec_uid || "").trim();
  if (result.length < 15) {
    return false;
  }
  if (["self", "login", "anonymous", "undefined", "null"].includes(result.toLowerCase())) {
    return false;
  }
  if (result.startsWith("name:") || result.startsWith("live_") || result.startsWith("webcast:")) {
    return false;
  }
  return /^[A-Za-z0-9_-]+$/.test(result);
}
function isEntityLiveLead(arg1) {
  if (!arg1 || typeof arg1 !== "object") {
    return false;
  }
  if (arg1.sourceType === "live" || arg1.entrySource === "entity_live") {
    return true;
  }
  if (arg1.webcastUid || arg1.liveEvent || arg1.liveUrl) {
    return true;
  }
  const result = String(arg1.userKey || "");
  return result.startsWith("webcast:");
}
function isEntityLeadEligibleForLeadPool(arg1) {
  if (!arg1 || typeof arg1 !== "object") {
    return false;
  }
  if (isEntityRelationAuthorSource(arg1.sourceType, arg1.entrySource)) {
    return !!resolveAuthorSecUidFromLead(arg1);
  }
  if (arg1.leadKind === "video_card" && (arg1.videoUrl || arg1.url || arg1.leadId)) {
    return true;
  }
  if (arg1.leadKind === "collected_author" && resolveAuthorSecUidFromLead(arg1)) {
    return true;
  }
  const result = String(arg1.nickname || "").trim();
  if (!result) {
    return false;
  }
  if (isEntityLiveLead(arg1)) {
    return hasUsableSecUid(arg1);
  }
  if (arg1.userUrl || arg1.uid || arg1.secUid) {
    return true;
  }
  if (arg1.sourceType === "video" && (arg1.userKey || arg1.videoUrl)) {
    return true;
  }
  if (arg1.userKey) {
    return true;
  }
  return false;
}
module.exports = {
  hasUsableSecUid: hasUsableSecUid,
  isEntityLiveLead: isEntityLiveLead,
  isEntityLeadEligibleForLeadPool: isEntityLeadEligibleForLeadPool
};
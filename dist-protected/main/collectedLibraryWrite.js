'use strict';

const collectedVideosStore = require("./collectedVideosStore");
const collectedAuthorsStore = require("./collectedAuthorsStore");
const {
  splitVideoCardIntoCollectedRecords,
  isEntityRelationAuthorSource
} = require("../shared/collectedLeadKeys");
function isCollectedRouteLead(arg1) {
  if (!arg1 || typeof arg1 !== "object") {
    return false;
  }
  if (arg1.leadKind === "collected_video" || arg1.leadKind === "collected_author") {
    return true;
  }
  if (arg1.identityType === "author") {
    return true;
  }
  if (isEntityRelationAuthorSource(arg1.sourceType, arg1.entrySource)) {
    return true;
  }
  const result = String(arg1.leadId || arg1.userKey || arg1.key || arg1.id || "").trim();
  if (/^author:/.test(result)) {
    return true;
  }
  const value = Array.isArray(arg1.collectedFields) ? arg1.collectedFields.map(String) : [];
  if (value.includes("author") && !value.includes("video")) {
    return true;
  }
  try {
    const leadUserKey = require("../shared/leadUserKey");
    return !!leadUserKey.isVideoLeadRecord(arg1);
  } catch (error) {
    if (arg1.leadKind === "video_card" || arg1.sourceType === "video" || arg1.identityType === "video") {
      return true;
    }
    return /^video:\d{10,}$/.test(result);
  }
}
function upsertCollectedFromLead(arg1, arg2) {
  if (!arg1 || !arg2) {
    return {
      written: false,
      video: false,
      author: false
    };
  }
  const {
    video: video,
    author: author
  } = splitVideoCardIntoCollectedRecords(arg2);
  let flag = false;
  let flag2 = false;
  if (video) {
    flag = collectedVideosStore.upsertOne(arg1, video);
  }
  if (author) {
    flag2 = collectedAuthorsStore.upsertOne(arg1, author);
  }
  if (!author && (isEntityRelationAuthorSource(arg2.sourceType, arg2.entrySource) || arg2.leadKind === "collected_author" || arg2.identityType === "author" || /^author:/.test(String(arg2.leadId || arg2.key || "")))) {
    flag2 = collectedAuthorsStore.upsertFromLead(arg1, {
      ...arg2,
      collectedFields: ["author"],
      authorProfileUrl: arg2.authorProfileUrl || arg2.userUrl || arg2.leadId
    });
  }
  return {
    written: flag || flag2,
    video: flag,
    author: flag2
  };
}
function upsertCollectedBatch(arg1, list = []) {
  if (!arg1 || !Array.isArray(list)) {
    return 0;
  }
  let num = 0;
  const result = arg1.transaction(arg12 => {
    for (const item of arg12) {
      if (!isCollectedRouteLead(item)) {
        continue;
      }
      const result = upsertCollectedFromLead(arg1, item);
      if (result.written) {
        num += 1;
      }
    }
  });
  try {
    result(list);
    return num;
  } catch (error) {
    console.error("[DB] upsertCollectedBatch 失败:", error);
    return num;
  }
}
function syncEntityCollectedIntoLibraries(arg1, arg2) {
  if (!arg1 || typeof arg2 !== "function") {
    return {
      synced: 0
    };
  }
  try {
    const result = arg2();
    if (!result.length) {
      return {
        synced: 0
      };
    }
    const result2 = collectedVideosStore.listIds(arg1);
    const result3 = collectedAuthorsStore.listIds(arg1);
    let num = 0;
    const result4 = arg1.transaction(arg12 => {
      for (const item of arg12) {
        const {
          video: video,
          author: author
        } = splitVideoCardIntoCollectedRecords(item);
        if (video && !result2.has(video.id)) {
          if (collectedVideosStore.upsertOne(arg1, video)) {
            result2.add(video.id);
            num += 1;
          }
        }
        if (author && !result3.has(author.id)) {
          if (collectedAuthorsStore.upsertOne(arg1, author)) {
            result3.add(author.id);
            num += 1;
          }
        }
      }
    });
    result4(result);
    return {
      synced: num,
      scanned: result.length
    };
  } catch (error) {
    console.error("[DB] syncEntityCollectedIntoLibraries 失败:", error);
    return {
      synced: 0,
      error: error.message || String(error)
    };
  }
}
module.exports = {
  isCollectedRouteLead: isCollectedRouteLead,
  upsertCollectedFromLead: upsertCollectedFromLead,
  upsertCollectedBatch: upsertCollectedBatch,
  syncEntityCollectedIntoLibraries: syncEntityCollectedIntoLibraries
};
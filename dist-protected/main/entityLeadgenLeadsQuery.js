'use strict';

const VIDEO_LEAD_SQL = "(\n  IFNULL(json_extract(raw_data, '$.leadKind'), '') = 'video_card'\n  OR IFNULL(json_extract(raw_data, '$.sourceType'), '') = 'video'\n  OR IFNULL(json_extract(raw_data, '$.identityType'), '') = 'video'\n  OR IFNULL(json_extract(raw_data, '$.leadId'), '') LIKE 'video:%'\n  OR IFNULL(json_extract(raw_data, '$.userKey'), '') LIKE 'video:%'\n  OR IFNULL(json_extract(raw_data, '$.leadId'), '') LIKE 'author:%'\n  OR id LIKE 'video:%'\n  OR id LIKE 'author:%'\n)";
const COMMENT_LEAD_SQL = "(\n  NOT " + VIDEO_LEAD_SQL + "\n  AND (\n    IFNULL(json_extract(raw_data, '$.sourceType'), '') = 'comment'\n    OR IFNULL(json_extract(raw_data, '$.entrySource'), '') = 'entity_comment'\n    OR IFNULL(json_extract(raw_data, '$.collectedFields'), '') LIKE '%comment%'\n  )\n)";
const AUTHOR_LEAD_SQL = "(\n  " + VIDEO_LEAD_SQL + "\n  AND IFNULL(json_extract(raw_data, '$.collectedFields'), '') LIKE '%author%'\n  AND (\n    IFNULL(json_extract(raw_data, '$.authorProfileUrl'), '') != ''\n    OR IFNULL(json_extract(raw_data, '$.userUrl'), '') != ''\n  )\n)";
const VIDEO_LINK_LEAD_SQL = "(\n  " + VIDEO_LEAD_SQL + "\n  AND (\n    IFNULL(json_extract(raw_data, '$.collectedFields'), '') LIKE '%video%'\n    OR IFNULL(json_extract(raw_data, '$.collectedFields'), '') = ''\n    OR json_extract(raw_data, '$.collectedFields') IS NULL\n  )\n)";
function escapeLike(arg1) {
  return String(arg1 || "").replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}
function tabPredicate(arg1) {
  const result = String(arg1 || "").trim();
  if (result === "comments") {
    return COMMENT_LEAD_SQL;
  }
  if (result === "author") {
    return AUTHOR_LEAD_SQL;
  }
  if (result === "video") {
    return VIDEO_LINK_LEAD_SQL;
  }
  return "";
}
function buildWhere(arg1, {
  tab = "",
  keyword = ""
} = {}) {
  const list = ["task_id = ?"];
  const list2 = [String(arg1)];
  const result = tabPredicate(tab);
  if (result) {
    list.push(result);
  }
  const result2 = String(keyword || "").trim();
  if (result2) {
    list.push("(\n      nickname LIKE ? ESCAPE '\\'\n      OR IFNULL(account_id, '') LIKE ? ESCAPE '\\'\n      OR IFNULL(source_type, '') LIKE ? ESCAPE '\\'\n      OR raw_data LIKE ? ESCAPE '\\'\n    )");
    const value = "%" + escapeLike(result2) + "%";
    list2.push(value, value, value, value);
  }
  return {
    sql: list.join(" AND "),
    params: list2
  };
}
function parseLeadRow(arg1) {
  if (!arg1) {
    return null;
  }
  try {
    const result = JSON.parse(arg1.raw_data || "{}");
    if (!result || typeof result !== "object") {
      return null;
    }
    if (!result.id && arg1.id) {
      result.id = arg1.id;
    }
    if (!result.ts && arg1.ts) {
      result.ts = arg1.ts;
    }
    if (!result.taskId && arg1.task_id) {
      result.taskId = arg1.task_id;
    }
    return result;
  } catch (error) {
    return null;
  }
}
function isVideoStyleLead(options = {}) {
  const result = String(options.leadKind || "");
  const result2 = String(options.sourceType || "");
  const result3 = String(options.identityType || "");
  const result4 = String(options.leadId || "");
  const result5 = String(options.userKey || "");
  const result6 = String(options.id || "");
  return result === "video_card" || result2 === "video" || result3 === "video" || result4.startsWith("video:") || result5.startsWith("video:") || result4.startsWith("author:") || result6.startsWith("video:") || result6.startsWith("author:");
}
function collectedFieldsText(options = {}) {
  const value = Array.isArray(options.collectedFields) ? options.collectedFields : [];
  return value.map(String).join(",");
}
function matchesTab(arg1, arg2) {
  const result = String(arg2 || "").trim();
  if (!result) {
    return true;
  }
  const flag = isVideoStyleLead(arg1);
  if (result === "comments") {
    if (flag) {
      return false;
    }
    const result = String(arg1.sourceType || "");
    const result2 = String(arg1.entrySource || "");
    const result3 = collectedFieldsText(arg1);
    return result === "comment" || result2 === "entity_comment" || result3.includes("comment");
  }
  if (result === "author") {
    if (!flag) {
      return false;
    }
    const result = collectedFieldsText(arg1);
    if (!result.includes("author")) {
      return false;
    }
    return !!String(arg1.authorProfileUrl || "").trim() || !!String(arg1.userUrl || "").trim();
  }
  if (result === "video") {
    if (!flag) {
      return false;
    }
    const result = collectedFieldsText(arg1);
    return !result || result.includes("video");
  }
  return true;
}
function matchesKeyword(arg1, arg2) {
  const result = String(arg2 || "").trim().toLowerCase();
  if (!result) {
    return true;
  }
  const result2 = [arg1.nickname, arg1.title, arg1.uid, arg1.accountId, arg1.secUid, arg1.userUrl, arg1.authorProfileUrl, arg1.videoUrl, arg1.url, arg1.content, arg1.sourceType, arg1.sourceVideoTitle, arg1.searchKeyword].filter(Boolean).join(" ").toLowerCase();
  return result2.includes(result);
}
function paginateLeadsArray(list = [], options = {}) {
  const value = Array.isArray(list) ? list : [];
  const result = Math.max(1, Math.min(100, Number(options.limit) || 20));
  const result2 = Math.max(0, Number(options.offset) || 0);
  const value2 = options.tab;
  const value3 = options.keyword;
  const result3 = value.filter(arg1 => matchesTab(arg1, value2) && matchesKeyword(arg1, value3));
  result3.sort((arg1, arg2) => Number(arg2.ts || 0) - Number(arg1.ts || 0));
  const obj = {
    all: value.length,
    comments: value.filter(arg1 => matchesTab(arg1, "comments")).length,
    video: value.filter(arg1 => matchesTab(arg1, "video")).length,
    author: value.filter(arg1 => matchesTab(arg1, "author")).length
  };
  return {
    items: result3.slice(result2, result2 + result),
    total: result3.length,
    counts: obj
  };
}
function listEntityLeadgenLeadsPage(arg1, arg2, options = {}) {
  if (!arg1 || !arg2) {
    return {
      items: [],
      total: 0,
      counts: {
        all: 0,
        comments: 0,
        video: 0,
        author: 0
      }
    };
  }
  const result = Math.max(1, Math.min(100, Number(options.limit) || 20));
  const result2 = Math.max(0, Number(options.offset) || 0);
  const {
    sql: sql,
    params: params
  } = buildWhere(arg2, options);
  const local = Number(arg1.prepare("SELECT COUNT(*) AS c FROM entity_leadgen_leads WHERE " + sql).get(...params)?.c) || 0;
  const result3 = arg1.prepare("\n    SELECT id, task_id, ts, raw_data\n    FROM entity_leadgen_leads\n    WHERE " + sql + "\n    ORDER BY ts DESC\n    LIMIT ? OFFSET ?\n  ").all(...params, result, result2);
  const result4 = result3.map(parseLeadRow).filter(Boolean);
  const result5 = String(arg2);
  const obj = {
    all: Number(arg1.prepare("SELECT COUNT(*) AS c FROM entity_leadgen_leads WHERE task_id = ?").get(result5)?.c) || 0,
    comments: Number(arg1.prepare("SELECT COUNT(*) AS c FROM entity_leadgen_leads WHERE task_id = ? AND " + COMMENT_LEAD_SQL).get(result5)?.c) || 0,
    video: Number(arg1.prepare("SELECT COUNT(*) AS c FROM entity_leadgen_leads WHERE task_id = ? AND " + VIDEO_LINK_LEAD_SQL).get(result5)?.c) || 0,
    author: Number(arg1.prepare("SELECT COUNT(*) AS c FROM entity_leadgen_leads WHERE task_id = ? AND " + AUTHOR_LEAD_SQL).get(result5)?.c) || 0
  };
  return {
    items: result4,
    total: local,
    counts: obj
  };
}
module.exports = {
  VIDEO_LEAD_SQL: VIDEO_LEAD_SQL,
  COMMENT_LEAD_SQL: COMMENT_LEAD_SQL,
  AUTHOR_LEAD_SQL: AUTHOR_LEAD_SQL,
  VIDEO_LINK_LEAD_SQL: VIDEO_LINK_LEAD_SQL,
  escapeLike: escapeLike,
  paginateLeadsArray: paginateLeadsArray,
  listEntityLeadgenLeadsPage: listEntityLeadgenLeadsPage
};
'use strict';

const {
  normalizeWorksCount
} = require("./leadTouch");
const {
  canonicalizeDouyinVideoUrl
} = require("./processedVideoKey");
const LEAD_EXPORT_HEADERS = Object.freeze(["平台", "用户昵称", "线索来源", "搜索词", "有意向", "AI分析结果", "用户主页", "视频标题", "视频链接", "评论内容", "评论时间", "地区", "获取时间", "获取账号", "作品数", "触达总计", "点赞次数", "回复次数", "关注次数", "私信次数", "首作评论次数"]);
const ORIGIN_OPTIONS = Object.freeze([{
  value: "leadgen",
  label: "评论获客"
}, {
  value: "entity_blogger",
  label: "线索采集：搜索博主"
}, {
  value: "entity_user",
  label: "线索采集：搜索用户"
}, {
  value: "entity_mutual",
  label: "线索采集：相互关注"
}, {
  value: "entity_following",
  label: "线索采集：关注列表"
}, {
  value: "entity_live",
  label: "线索采集：直播间"
}, {
  value: "entity_comment",
  label: "线索采集：评论区潜客"
}, {
  value: "entity_video",
  label: "线索采集：视频作品链接"
}, {
  value: "monitor",
  label: "监控任务"
}, {
  value: "import",
  label: "UID导入"
}]);
function buildDouyinUserUrlFromSecUid(arg1) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return "";
  }
  return "https://www.douyin.com/user/" + result;
}
function normalizeDouyinAuthorUrl(arg1) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return "";
  }
  try {
    const url = new URL(result.startsWith("http") ? result : "https://" + result);
    const result2 = url.hostname.toLowerCase();
    if (!result2.endsWith("douyin.com")) {
      return "";
    }
    const result3 = url.pathname.match(/\/(?:share\/)?user\/([^/?#]+)/i);
    const result4 = decodeURIComponent(result3?.[1] || url.searchParams.get("sec_uid") || "").trim();
    if (!result4) {
      return "";
    }
    return "https://www.douyin.com/user/" + result4;
  } catch (error) {
    return "";
  }
}
function getDouyinAuthorProfileKey(arg1) {
  const result = normalizeDouyinAuthorUrl(arg1);
  if (!result) {
    return "";
  }
  return result.match(/\/user\/([^/?#]+)/)?.[1] || "";
}
function splitCsvRecords(arg1) {
  const result = String(arg1 || "").replace(/^\uFEFF/, "");
  const list = [];
  let text = "";
  let flag = false;
  for (let num = 0; num < result.length; num += 1) {
    const value = result[num];
    if (value === "\"") {
      text += value;
      if (flag && result[num + 1] === "\"") {
        text += result[num + 1];
        num += 1;
        continue;
      }
      flag = !flag;
      continue;
    }
    if ((value === "\n" || value === "\r") && !flag) {
      if (value === "\r" && result[num + 1] === "\n") {
        num += 1;
      }
      if (String(text).trim()) {
        list.push(text);
      }
      text = "";
      continue;
    }
    text += value;
  }
  if (String(text).trim()) {
    list.push(text);
  }
  return list;
}
function parseCsvLine(arg1) {
  const list = [];
  let text = "";
  let flag = false;
  for (let num = 0; num < arg1.length; num += 1) {
    const value = arg1[num];
    if (flag) {
      if (value === "\"") {
        if (arg1[num + 1] === "\"") {
          text += "\"";
          num += 1;
        } else {
          flag = false;
        }
      } else {
        text += value;
      }
      continue;
    }
    if (value === "\"") {
      flag = true;
      continue;
    }
    if (value === ",") {
      list.push(text);
      text = "";
      continue;
    }
    text += value;
  }
  list.push(text);
  return list;
}
function parseLeadExportCsv(arg1) {
  const result = splitCsvRecords(arg1);
  if (!result.length) {
    return {
      headers: [],
      rows: []
    };
  }
  const result2 = parseCsvLine(result[0]).map(arg1 => String(arg1 || "").trim());
  const list = [];
  for (let num = 1; num < result.length; num += 1) {
    const result3 = parseCsvLine(result[num]);
    const obj = {};
    result2.forEach((arg1, arg2) => {
      obj[arg1] = result3[arg2] != null ? String(result3[arg2]) : "";
    });
    list.push(obj);
  }
  return {
    headers: result2,
    rows: list
  };
}
function yesNoToBool(arg1) {
  const result = String(arg1 || "").trim();
  return result === "是" || result === "true" || result === "TRUE" || result === "1";
}
function toNonNegInt(arg1) {
  const result = Number(String(arg1 || "").replace(/[^\d.-]/g, ""));
  if (Number.isFinite(result)) {
    return Math.max(0, Math.floor(result));
  } else {
    return 0;
  }
}
function parseExportCapturedAt(arg1) {
  const result = String(arg1 || "").trim();
  if (!result || result === "未知") {
    return 0;
  }
  const result2 = Number(result);
  if (Number.isFinite(result2) && result2 > 100000000000) {
    return Math.floor(result2);
  }
  const result3 = Date.parse(result);
  if (Number.isFinite(result3) && result3 > 0) {
    return result3;
  }
  let result4 = result.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})(?:[\sT]+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
  if (result4) {
    const date = new Date(Number(result4[1]), Number(result4[2]) - 1, Number(result4[3]), Number(result4[4] || 0), Number(result4[5] || 0), Number(result4[6] || 0));
    if (Number.isFinite(date.getTime())) {
      return date.getTime();
    }
  }
  result4 = result.match(/^(\d{1,2})[-/.](\d{1,2})(?:[\sT]+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
  if (result4) {
    const date = new Date(new Date().getFullYear(), Number(result4[1]) - 1, Number(result4[2]), Number(result4[3] || 0), Number(result4[4] || 0), Number(result4[5] || 0));
    if (Number.isFinite(date.getTime())) {
      return date.getTime();
    }
  }
  return 0;
}
function resolveOriginMetaFromExportLabel(arg1) {
  const result = String(arg1 || "").trim();
  if (!result || result === "CSV导入" || result === "UID导入") {
    return {
      entrySource: "import",
      entryLabel: result || "CSV导入",
      taskId: "import_csv",
      taskName: "CSV导入"
    };
  }
  for (const item of ORIGIN_OPTIONS) {
    if (item.label !== result) {
      continue;
    }
    if (item.value === "import") {
      return {
        entrySource: "import",
        entryLabel: result,
        taskId: "import_csv",
        taskName: "CSV导入"
      };
    }
    if (item.value === "monitor") {
      return {
        entrySource: "monitor",
        entryLabel: result,
        taskId: "import_csv",
        taskName: result
      };
    }
    if (String(item.value).startsWith("entity_")) {
      return {
        entrySource: item.value,
        entryLabel: result,
        taskId: "import_csv",
        taskName: result
      };
    }
    if (item.value === "leadgen") {
      return {
        entrySource: "search",
        entryLabel: "评论获客",
        taskId: "import_csv",
        taskName: "评论获客"
      };
    }
  }
  if (result.startsWith("监控") || result.includes("监控:") || result.includes("监控：")) {
    return {
      entrySource: "monitor",
      entryLabel: result,
      taskId: "import_csv",
      taskName: result
    };
  }
  if (result.startsWith("搜索:") || result.startsWith("搜索：") || result === "推荐页" || result === "关注列表" || result === "喜欢列表" || result === "指定视频") {
    return {
      entrySource: result === "关注列表" ? "follow" : result === "推荐页" ? "recommend" : result === "喜欢列表" ? "like" : result === "指定视频" ? "specific" : "search",
      entryLabel: result,
      taskId: "import_csv",
      taskName: result
    };
  }
  if (result.includes("线索采集") || result.includes("实体获客")) {
    const result2 = ORIGIN_OPTIONS.find(arg1 => String(arg1.value).startsWith("entity_") && result.includes(String(arg1.label).replace(/^线索采集：/, "")));
    if (result2) {
      return {
        entrySource: result2.value,
        entryLabel: result2.label,
        taskId: "import_csv",
        taskName: result2.label
      };
    }
  }
  return {
    entrySource: "import",
    entryLabel: result,
    taskId: "import_csv",
    taskName: "CSV导入"
  };
}
function buildLeadFromExportRow(options = {}) {
  const result = String(options.用户主页 || options.userUrl || "").trim();
  const local = normalizeDouyinAuthorUrl(result) || result;
  const local2 = getDouyinAuthorProfileKey(local) || local.match(/MS4wLjABAAAA[A-Za-z0-9_-]+/i)?.[0] || "";
  const local3 = local || (local2 ? buildDouyinUserUrlFromSecUid(local2) : "");
  if (!local3 || !local2) {
    return {
      ok: false,
      reason: "缺少有效用户主页"
    };
  }
  const local4 = parseExportCapturedAt(options.获取时间) || Date.now();
  const result2 = toNonNegInt(options.点赞次数);
  const result3 = toNonNegInt(options.回复次数);
  const result4 = toNonNegInt(options.关注次数);
  const result5 = toNonNegInt(options.私信次数);
  const result6 = toNonNegInt(options.首作评论次数);
  const result7 = normalizeWorksCount(options.作品数);
  const result8 = resolveOriginMetaFromExportLabel(options.线索来源 || options.entryLabel);
  const local5 = canonicalizeDouyinVideoUrl(options.视频链接 || options.videoUrl || "") || "";
  const result9 = String(options.地区 || "").trim();
  return {
    ok: true,
    lead: {
      leadId: local2,
      key: local2,
      platform: String(options.平台 || "DY").trim() || "DY",
      nickname: String(options.用户昵称 || "").trim(),
      userUrl: local3,
      secUid: local2,
      searchKeyword: String(options.搜索词 || "").trim(),
      isHighIntention: yesNoToBool(options.有意向),
      aiThought: String(options.AI分析结果 || "").trim(),
      thought: String(options.AI分析结果 || "").trim(),
      title: String(options.视频标题 || "").trim(),
      videoUrl: local5,
      url: local5 || local3,
      content: String(options.评论内容 || "").trim(),
      timeText: String(options.评论时间 || "").trim(),
      ipLocation: result9,
      location: result9,
      accountName: String(options.获取账号 || "").trim(),
      worksCount: result7,
      noWorks: result7 === 0,
      touchCounts: {
        like: result2,
        reply: result3,
        follow: result4,
        message: result5,
        profileComment: result6,
        videoComment: 0
      },
      liked: result2 > 0,
      replied: result3 > 0 || result6 > 0,
      followed: result4 > 0,
      messaged: result5 > 0,
      entrySource: result8.entrySource,
      entryLabel: result8.entryLabel,
      taskId: result8.taskId,
      taskName: result8.taskName,
      timestamp: local4,
      capturedAt: new Date(local4).toISOString(),
      source: "import_csv"
    }
  };
}
function buildLeadsFromExportCsv(arg1) {
  const {
    rows: rows
  } = parseLeadExportCsv(arg1);
  const list = [];
  const list2 = [];
  const set = new Set();
  for (const item of rows) {
    const result = buildLeadFromExportRow(item);
    if (!result.ok) {
      list2.push({
        row: item,
        reason: result.reason
      });
      continue;
    }
    const value = result.lead.leadId;
    if (set.has(value)) {
      list2.push({
        row: item,
        reason: "重复用户主页"
      });
      continue;
    }
    set.add(value);
    list.push(result.lead);
  }
  return {
    accepted: list,
    rejected: list2,
    totalRows: rows.length
  };
}
module.exports = {
  LEAD_EXPORT_HEADERS: LEAD_EXPORT_HEADERS,
  parseLeadExportCsv: parseLeadExportCsv,
  parseExportCapturedAt: parseExportCapturedAt,
  resolveOriginMetaFromExportLabel: resolveOriginMetaFromExportLabel,
  buildLeadFromExportRow: buildLeadFromExportRow,
  buildLeadsFromExportCsv: buildLeadsFromExportCsv,
  splitCsvRecords: splitCsvRecords
};
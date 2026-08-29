const {
  evaluateTaskLocationFilter
} = require("../shared/locationFilter");
function stripInvisibleChars(arg1) {
  return String(arg1 || "").replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF\u00A0\u180E]/g, "");
}
function stripNicknameDecorations(arg1) {
  return String(arg1 || "").replace(/\p{Extended_Pictographic}/gu, "").replace(/\p{M}/gu, "").replace(/[\uFE0E\uFE0F]/g, "").replace(/[\u{1F3FB}-\u{1F3FF}]/gu, "").replace(/[·•‧∙⋅⋆✱✲✳✴✵✶✷✸✹✺✻✼✽✾✿❀❁❂❃❄❅❆❇❈❉❊❋※‼⁉〰～〜｡。．.､、，,！!？?：:；;…‥〃『』「」【】\[\]（）()《》<>\"'“”‘’]/g, "");
}
function normalizeMonitorNickname(arg1) {
  return stripNicknameDecorations(stripInvisibleChars(String(arg1 || "")).normalize("NFKC").trim().replace(/^@+/, "").replace(/\s+/g, "")).toLowerCase();
}
function coreMonitorNickname(arg1) {
  const result = normalizeMonitorNickname(arg1);
  if (!result) {
    return "";
  }
  return result.replace(/[^0-9a-zA-Z\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff\u3040-\u30ff\u31f0-\u31ff\uff66-\uff9d]/g, "");
}
function matchExcludedCommenter(arg1, arg2, arg3, options = {}) {
  if (arg3 && options.excludeSecUids?.has(arg3)) {
    return {
      matched: true,
      label: options.excludeSecUidByValue?.get(arg3) || arg3,
      mode: "sec_uid"
    };
  }
  if (arg1 && options.excludeSet?.has(arg1)) {
    return {
      matched: true,
      label: options.excludeNickByNormalized?.get(arg1) || arg1,
      mode: "exact"
    };
  }
  if (arg2 && options.excludeCores?.has(arg2)) {
    return {
      matched: true,
      label: options.excludeNickByCore?.get(arg2) || arg2,
      mode: "core"
    };
  }
  return {
    matched: false,
    label: "",
    mode: ""
  };
}
function parseExcludeCommenters(arg1) {
  if (!arg1 || !String(arg1).trim()) {
    return [];
  }
  return String(arg1).split(/[,，\n\r]+/).map(arg1 => arg1.trim().replace(/^@+/, "")).filter(Boolean);
}
function parseExcludeCommentKeywords(arg1) {
  if (!arg1 || !String(arg1).trim()) {
    return [];
  }
  return String(arg1).split(/[,，\n\r]+/).map(arg1 => arg1.trim()).filter(Boolean);
}
function matchExcludeCommentKeyword(arg1, arg2) {
  const result = String(arg1 || "").toLowerCase();
  if (!result) {
    return "";
  }
  return parseExcludeCommentKeywords(arg2).find(arg1 => result.includes(arg1.toLowerCase())) || "";
}
function extractSecUidFromUrl(arg1) {
  if (!arg1) {
    return "";
  }
  const result = String(arg1).match(/\/user\/([a-zA-Z0-9_-]+)/i);
  if (result) {
    return result[1];
  } else {
    return "";
  }
}
function extractExcludeSecUid(arg1) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return "";
  }
  const result2 = extractSecUidFromUrl(result);
  if (result2) {
    return result2;
  }
  if (/^MS4wLjABAAAA[a-zA-Z0-9_-]{10,}$/i.test(result)) {
    return result;
  }
  const result3 = result.match(/^\/?user\/([a-zA-Z0-9_-]+)/i);
  if (result3) {
    return result3[1];
  }
  return "";
}
function buildOperatorIdentity(list = [], list2 = [], arg3 = null) {
  const value = Array.isArray(list2) ? list2.map(String) : [];
  const set = new Set();
  const set2 = new Set();
  const set3 = new Set();
  const list3 = [];
  const local = arg1 => {
    if (!arg1) {
      return;
    }
    const result = normalizeMonitorNickname(arg1.nickname);
    const result2 = normalizeMonitorNickname(arg1.name);
    if (result) {
      set.add(result);
    }
    if (result2) {
      set.add(result2);
    }
    const result3 = coreMonitorNickname(arg1.nickname);
    const result4 = coreMonitorNickname(arg1.name);
    if (result3) {
      set2.add(result3);
    }
    if (result4) {
      set2.add(result4);
    }
    const result5 = extractSecUidFromUrl(arg1.userUrl || arg1.profileUrl || arg1.homeUrl || "");
    if (result5) {
      set3.add(result5);
    }
    const result6 = String(arg1.nickname || arg1.name || "").trim().replace(/^@+/, "");
    if (result6 && !list3.includes(result6)) {
      list3.push(result6);
    }
  };
  (Array.isArray(list) ? list : []).forEach(arg1 => {
    if (value.length > 0 && !value.includes(String(arg1.id))) {
      return;
    }
    local(arg1);
  });
  local(arg3);
  return {
    nicknames: set,
    cores: set2,
    secUids: set3,
    labels: list3
  };
}
function buildOperatorNicknames(list = [], list2 = [], arg3 = null) {
  return buildOperatorIdentity(list, list2, arg3).nicknames;
}
function getRepliedUsersStoreKey(arg1) {
  return "monitor_task_replied_users_" + arg1;
}
function getRepliedUserNicknames(arg1, arg2, arg3) {
  const set = new Set();
  const set2 = new Set();
  const result = arg3.get(getRepliedUsersStoreKey(arg1), []);
  if (Array.isArray(result)) {
    result.forEach(arg1 => {
      const result = normalizeMonitorNickname(arg1);
      if (result) {
        set.add(result);
      }
      const result2 = extractSecUidFromUrl(arg1);
      if (result2) {
        set2.add(result2);
      }
    });
  }
  const local = arg2?.findTaskById?.(arg1);
  (local?.matches || []).forEach(arg1 => {
    if (arg1.replyStatus === "success" || arg1.dmStatus === "success" || arg1.followStatus === "success" || arg1.followStatus === "already_followed") {
      const result = normalizeMonitorNickname(arg1.nickname);
      if (result) {
        set.add(result);
      }
      const result2 = extractSecUidFromUrl(arg1.userUrl || arg1.authorProfileUrl || arg1.secUid);
      if (result2) {
        set2.add(result2);
      }
    }
  });
  return {
    nicknames: set,
    secUids: set2
  };
}
function markUserReplied(arg1, arg2, arg3) {
  const result = normalizeMonitorNickname(arg2);
  if (!result) {
    return;
  }
  const result2 = getRepliedUsersStoreKey(arg1);
  const result3 = arg3.get(result2, []);
  const value = Array.isArray(result3) ? [...result3] : [];
  if (!value.some(arg1 => normalizeMonitorNickname(arg1) === result)) {
    value.push(String(arg2 || "").trim().replace(/^@+/, ""));
    arg3.set(result2, value.slice(-2000));
  }
}
function buildExcludeCommenterSets(arg1) {
  const result = parseExcludeCommenters(arg1);
  const set = new Set();
  const set2 = new Set();
  const set3 = new Set();
  const map = new Map();
  const map2 = new Map();
  const map3 = new Map();
  result.forEach(arg1 => {
    const result = extractExcludeSecUid(arg1);
    if (result) {
      set3.add(result);
      if (!map3.has(result)) {
        map3.set(result, arg1);
      }
      return;
    }
    const result2 = normalizeMonitorNickname(arg1);
    const result3 = coreMonitorNickname(arg1);
    if (result2) {
      set.add(result2);
      if (!map.has(result2)) {
        map.set(result2, arg1);
      }
    }
    if (result3) {
      set2.add(result3);
      if (!map2.has(result3)) {
        map2.set(result3, arg1);
      }
    }
  });
  return {
    nicknames: set,
    cores: set2,
    secUids: set3,
    nickByNormalized: map,
    nickByCore: map2,
    secUidByValue: map3,
    entries: result
  };
}
function buildMonitorSkipContext({
  config = {},
  accounts = [],
  account = null,
  taskId: taskId,
  monitorTasksApi: monitorTasksApi,
  store: store,
  videoAuthor = "",
  videoAuthorUrl = ""
}) {
  const result = buildExcludeCommenterSets(config.excludeCommenters);
  const result2 = buildOperatorIdentity(accounts, config.selectedAccounts, account);
  const result3 = getRepliedUserNicknames(taskId, monitorTasksApi, store);
  const result4 = normalizeMonitorNickname(videoAuthor);
  const result5 = coreMonitorNickname(videoAuthor);
  const result6 = extractSecUidFromUrl(videoAuthorUrl);
  return {
    excludeSet: result.nicknames,
    excludeCores: result.cores,
    excludeSecUids: result.secUids,
    excludeNickByNormalized: result.nickByNormalized,
    excludeNickByCore: result.nickByCore,
    excludeSecUidByValue: result.secUidByValue,
    excludeEntries: result.entries,
    operatorNicknames: result2.nicknames,
    operatorCores: result2.cores,
    operatorSecUids: result2.secUids,
    operatorLabels: result2.labels,
    repliedUsers: result3,
    authorNick: result4,
    authorCore: result5,
    authorSecUid: result6,
    videoAuthor: String(videoAuthor || "").trim(),
    videoAuthorUrl: String(videoAuthorUrl || "").trim(),
    locationFilterMode: config.locationFilterMode,
    locationFilterRegions: config.locationFilterRegions,
    excludeCommentKeywords: config.excludeCommentKeywords || ""
  };
}
function findExcludedCommenterLabel(arg1, arg2, arg3, options = {}) {
  return matchExcludedCommenter(arg1, arg2, arg3, options).label || arg1 || arg2 || arg3 || "";
}
function isExcludedCommenter(arg1, arg2, arg3, options = {}) {
  return matchExcludedCommenter(arg1, arg2, arg3, options).matched;
}
function isVideoAuthorComment(arg1, arg2, arg3, arg4, options = {}) {
  if (arg1?.isAuthor || arg1?.isAuthorComment || arg1?.authorTag === true) {
    return true;
  }
  if (options.authorNick && arg2 && arg2 === options.authorNick) {
    return true;
  }
  if (options.authorCore && arg3 && arg3 === options.authorCore) {
    return true;
  }
  if (options.authorSecUid && arg4 && arg4 === options.authorSecUid) {
    return true;
  }
  return false;
}
function shouldSkipMonitorComment(arg1, options = {}) {
  const local = String(arg1?.nickname || "").trim().replace(/^@+/, "") || "用户";
  const result = normalizeMonitorNickname(arg1?.nickname);
  const result2 = coreMonitorNickname(arg1?.nickname);
  const result3 = extractSecUidFromUrl(arg1?.userUrl || arg1?.authorProfileUrl || arg1?.secUid);
  if (isVideoAuthorComment(arg1, result, result2, result3, options)) {
    return {
      skip: true,
      reason: "视频作者",
      detail: "命中视频作者 @" + local + (options.videoAuthor ? "（页面作者：" + options.videoAuthor + "）" : "")
    };
  }
  const local2 = !!result && !!options.operatorNicknames?.has(result);
  const local3 = !!result2 && !!options.operatorCores?.has(result2);
  const local4 = local2 || local3 || result3 && options.operatorSecUids?.has(result3);
  if (local4) {
    const value = result3 && options.operatorSecUids?.has(result3) ? "主页身份" : local2 ? "昵称" : "昵称(忽略特殊字符)";
    return {
      skip: true,
      reason: "任务执行账号",
      detail: "命中任务执行账号 @" + local + "（" + value + "）"
    };
  }
  const result4 = matchExcludedCommenter(result, result2, result3, options);
  if (result4.matched) {
    let text = "";
    if (result4.mode === "sec_uid") {
      text = "（UID/主页链接）";
    } else if (result4.mode === "core") {
      text = "（已忽略特殊字符差异）";
    }
    return {
      skip: true,
      reason: "排除评论者",
      detail: "命中排除名单「" + result4.label + "」→ @" + local + text
    };
  }
  if (result && options.repliedUsers?.nicknames?.has(result) || result3 && options.repliedUsers?.secUids?.has(result3)) {
    return {
      skip: true,
      reason: "已回复过",
      detail: "该用户本任务已互动过 @" + local
    };
  }
  if (options.excludeCommentKeywords && arg1?.text) {
    const result = matchExcludeCommentKeyword(arg1.text, options.excludeCommentKeywords);
    if (result) {
      return {
        skip: true,
        reason: "排除关键词「" + result + "」",
        detail: "评论命中排除关键词「" + result + "」@" + local
      };
    }
  }
  const result5 = evaluateTaskLocationFilter(arg1, {
    locationFilterMode: options.locationFilterMode,
    locationFilterRegions: options.locationFilterRegions
  });
  if (!result5.pass) {
    return {
      skip: true,
      reason: result5.reason || "地区过滤",
      detail: "地区过滤未通过 @" + local + "：" + (result5.reason || "地区不匹配")
    };
  }
  return {
    skip: false,
    reason: "",
    detail: ""
  };
}
function formatExcludeCommentersForLog(options = {}) {
  const value = Array.isArray(options.excludeEntries) ? options.excludeEntries : [];
  if (!value.length) {
    return "无";
  }
  const local = options.excludeSecUids?.size || 0;
  const result = value.slice(0, 12).map(arg1 => {
    const result = extractExcludeSecUid(arg1);
    if (!result) {
      return arg1;
    }
    if (result.length > 20) {
      return "UID:" + result.slice(0, 16) + "…";
    } else {
      return "UID:" + result;
    }
  }).join("、");
  const value2 = value.length > 12 ? " 等共 " + value.length + " 项（UID " + local + "）" : "（共 " + value.length + " 项，UID " + local + "）";
  return "" + result + value2;
}
function formatOperatorAccountsForLog(options = {}) {
  const value = Array.isArray(options.operatorLabels) ? options.operatorLabels : [];
  if (!value.length) {
    const local = options.operatorNicknames?.size || 0;
    const local2 = options.operatorSecUids?.size || 0;
    if (!local && !local2) {
      return "无（未识别到执行账号昵称/主页）";
    }
    return "已加载昵称 " + local + "、主页身份 " + local2;
  }
  const result = value.slice(0, 10).join("、");
  if (value.length > 10) {
    return result + " 等共 " + value.length + " 个";
  } else {
    return result;
  }
}
function buildMonitorUserDedupKey(options = {}) {
  const result = extractSecUidFromUrl(options.userUrl || options.authorProfileUrl || options.secUid || options.sec_uid || "");
  if (result) {
    return result;
  }
  const result2 = String(options.secUid || options.sec_uid || "").trim();
  if (result2.length >= 15) {
    return result2;
  } else {
    return "";
  }
}
function isKnownMonitorUser(arg1, arg2) {
  if (!arg2 || typeof arg2.has !== "function") {
    return false;
  }
  const result = buildMonitorUserDedupKey(arg1);
  return !!result && !!arg2.has(result);
}
function rememberMonitorUser(arg1, options = {}) {
  if (!arg1 || typeof arg1.add !== "function") {
    return "";
  }
  const result = buildMonitorUserDedupKey(options);
  if (result) {
    arg1.add(result);
  }
  return result;
}
module.exports = {
  normalizeMonitorNickname: normalizeMonitorNickname,
  coreMonitorNickname: coreMonitorNickname,
  parseExcludeCommenters: parseExcludeCommenters,
  parseExcludeCommentKeywords: parseExcludeCommentKeywords,
  matchExcludeCommentKeyword: matchExcludeCommentKeyword,
  buildOperatorNicknames: buildOperatorNicknames,
  buildOperatorIdentity: buildOperatorIdentity,
  getRepliedUserNicknames: getRepliedUserNicknames,
  markUserReplied: markUserReplied,
  buildMonitorSkipContext: buildMonitorSkipContext,
  shouldSkipMonitorComment: shouldSkipMonitorComment,
  formatExcludeCommentersForLog: formatExcludeCommentersForLog,
  formatOperatorAccountsForLog: formatOperatorAccountsForLog,
  extractSecUidFromUrl: extractSecUidFromUrl,
  extractExcludeSecUid: extractExcludeSecUid,
  buildMonitorUserDedupKey: buildMonitorUserDedupKey,
  isKnownMonitorUser: isKnownMonitorUser,
  rememberMonitorUser: rememberMonitorUser
};
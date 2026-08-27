const {
  evaluateTaskLocationFilter
} = require("../shared/locationFilter");
function stripInvisibleChars(_0x51cecd) {
  return String(_0x51cecd || "").replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF\u00A0\u180E]/g, "");
}
function stripNicknameDecorations(_0x131ea4) {
  return String(_0x131ea4 || "").replace(/\p{Extended_Pictographic}/gu, "").replace(/\p{M}/gu, "").replace(/[\uFE0E\uFE0F]/g, "").replace(/[\u{1F3FB}-\u{1F3FF}]/gu, "").replace(/[·•‧∙⋅⋆✱✲✳✴✵✶✷✸✹✺✻✼✽✾✿❀❁❂❃❄❅❆❇❈❉❊❋※‼⁉〰～〜｡。．.､、，,！!？?：:；;…‥〃『』「」【】\[\]（）()《》<>\"'“”‘’]/g, "");
}
function normalizeMonitorNickname(_0x5df7ed) {
  return stripNicknameDecorations(stripInvisibleChars(String(_0x5df7ed || "")).normalize("NFKC").trim().replace(/^@+/, "").replace(/\s+/g, "")).toLowerCase();
}
function coreMonitorNickname(_0x716aec) {
  const _0x35a28f = normalizeMonitorNickname(_0x716aec);
  if (!_0x35a28f) {
    return "";
  }
  return _0x35a28f.replace(/[^0-9a-zA-Z\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff\u3040-\u30ff\u31f0-\u31ff\uff66-\uff9d]/g, "");
}
function matchExcludedCommenter(_0x4dcfcf, _0x58a6df, _0x57c4eb, _0x2e623f = {}) {
  if (_0x57c4eb && _0x2e623f.excludeSecUids?.has(_0x57c4eb)) {
    return {
      matched: true,
      label: _0x2e623f.excludeSecUidByValue?.get(_0x57c4eb) || _0x57c4eb,
      mode: "sec_uid"
    };
  }
  if (_0x4dcfcf && _0x2e623f.excludeSet?.has(_0x4dcfcf)) {
    return {
      matched: true,
      label: _0x2e623f.excludeNickByNormalized?.get(_0x4dcfcf) || _0x4dcfcf,
      mode: "exact"
    };
  }
  if (_0x58a6df && _0x2e623f.excludeCores?.has(_0x58a6df)) {
    return {
      matched: true,
      label: _0x2e623f.excludeNickByCore?.get(_0x58a6df) || _0x58a6df,
      mode: "core"
    };
  }
  return {
    matched: false,
    label: "",
    mode: ""
  };
}
function parseExcludeCommenters(_0x2008c8) {
  if (!_0x2008c8 || !String(_0x2008c8).trim()) {
    return [];
  }
  return String(_0x2008c8).split(/[,，\n\r]+/).map(_0x468a6d => _0x468a6d.trim().replace(/^@+/, "")).filter(Boolean);
}
function parseExcludeCommentKeywords(_0x1a1761) {
  if (!_0x1a1761 || !String(_0x1a1761).trim()) {
    return [];
  }
  return String(_0x1a1761).split(/[,，\n\r]+/).map(_0x584a9e => _0x584a9e.trim()).filter(Boolean);
}
function matchExcludeCommentKeyword(_0x49b1b5, _0x5ddf55) {
  const _0x52a9cf = String(_0x49b1b5 || "").toLowerCase();
  if (!_0x52a9cf) {
    return "";
  }
  return parseExcludeCommentKeywords(_0x5ddf55).find(_0x1f1495 => _0x52a9cf.includes(_0x1f1495.toLowerCase())) || "";
}
function extractSecUidFromUrl(_0x2860fb) {
  if (!_0x2860fb) {
    return "";
  }
  const _0x1528f3 = String(_0x2860fb).match(/\/user\/([a-zA-Z0-9_-]+)/i);
  if (_0x1528f3) {
    return _0x1528f3[1];
  } else {
    return "";
  }
}
function extractExcludeSecUid(_0x5a5d4d) {
  const _0x2744c4 = String(_0x5a5d4d || "").trim();
  if (!_0x2744c4) {
    return "";
  }
  const _0x2c24be = extractSecUidFromUrl(_0x2744c4);
  if (_0x2c24be) {
    return _0x2c24be;
  }
  if (/^MS4wLjABAAAA[a-zA-Z0-9_-]{10,}$/i.test(_0x2744c4)) {
    return _0x2744c4;
  }
  const _0x2af722 = _0x2744c4.match(/^\/?user\/([a-zA-Z0-9_-]+)/i);
  if (_0x2af722) {
    return _0x2af722[1];
  }
  return "";
}
function buildOperatorIdentity(_0x506bf7 = [], _0x54d4f2 = [], _0x1b1b8c = null) {
  const _0x328c3c = Array.isArray(_0x54d4f2) ? _0x54d4f2.map(String) : [];
  const _0x51d54c = new Set();
  const _0x23a9f2 = new Set();
  const _0x1b5cfd = new Set();
  const _0x1137da = [];
  const _0x37a94a = _0x38f554 => {
    if (!_0x38f554) {
      return;
    }
    const _0x46d74e = normalizeMonitorNickname(_0x38f554.nickname);
    const _0xa617bb = normalizeMonitorNickname(_0x38f554.name);
    if (_0x46d74e) {
      _0x51d54c.add(_0x46d74e);
    }
    if (_0xa617bb) {
      _0x51d54c.add(_0xa617bb);
    }
    const _0x27abd0 = coreMonitorNickname(_0x38f554.nickname);
    const _0x2513c6 = coreMonitorNickname(_0x38f554.name);
    if (_0x27abd0) {
      _0x23a9f2.add(_0x27abd0);
    }
    if (_0x2513c6) {
      _0x23a9f2.add(_0x2513c6);
    }
    const _0x11ea4b = extractSecUidFromUrl(_0x38f554.userUrl || _0x38f554.profileUrl || _0x38f554.homeUrl || "");
    if (_0x11ea4b) {
      _0x1b5cfd.add(_0x11ea4b);
    }
    const _0x2fe620 = String(_0x38f554.nickname || _0x38f554.name || "").trim().replace(/^@+/, "");
    if (_0x2fe620 && !_0x1137da.includes(_0x2fe620)) {
      _0x1137da.push(_0x2fe620);
    }
  };
  (Array.isArray(_0x506bf7) ? _0x506bf7 : []).forEach(_0x1c4486 => {
    if (_0x328c3c.length > 0 && !_0x328c3c.includes(String(_0x1c4486.id))) {
      return;
    }
    _0x37a94a(_0x1c4486);
  });
  _0x37a94a(_0x1b1b8c);
  return {
    nicknames: _0x51d54c,
    cores: _0x23a9f2,
    secUids: _0x1b5cfd,
    labels: _0x1137da
  };
}
function buildOperatorNicknames(_0x504bba = [], _0x2a9a6a = [], _0x5818a6 = null) {
  return buildOperatorIdentity(_0x504bba, _0x2a9a6a, _0x5818a6).nicknames;
}
function getRepliedUsersStoreKey(_0x231737) {
  return "monitor_task_replied_users_" + _0x231737;
}
function getRepliedUserNicknames(_0x4f496f, _0x53b64d, _0x944a00) {
  const _0x485ba9 = new Set();
  const _0x5ea9c = new Set();
  const _0x19c7ba = _0x944a00.get(getRepliedUsersStoreKey(_0x4f496f), []);
  if (Array.isArray(_0x19c7ba)) {
    _0x19c7ba.forEach(_0x2b896c => {
      const _0x4d36b8 = normalizeMonitorNickname(_0x2b896c);
      if (_0x4d36b8) {
        _0x485ba9.add(_0x4d36b8);
      }
      const _0x1cac9c = extractSecUidFromUrl(_0x2b896c);
      if (_0x1cac9c) {
        _0x5ea9c.add(_0x1cac9c);
      }
    });
  }
  const _0x4b76ef = _0x53b64d?.findTaskById?.(_0x4f496f);
  (_0x4b76ef?.matches || []).forEach(_0x43b722 => {
    if (_0x43b722.replyStatus === "success" || _0x43b722.dmStatus === "success" || _0x43b722.followStatus === "success" || _0x43b722.followStatus === "already_followed") {
      const _0x2c8c09 = normalizeMonitorNickname(_0x43b722.nickname);
      if (_0x2c8c09) {
        _0x485ba9.add(_0x2c8c09);
      }
      const _0x3ced5e = extractSecUidFromUrl(_0x43b722.userUrl || _0x43b722.authorProfileUrl || _0x43b722.secUid);
      if (_0x3ced5e) {
        _0x5ea9c.add(_0x3ced5e);
      }
    }
  });
  return {
    nicknames: _0x485ba9,
    secUids: _0x5ea9c
  };
}
function markUserReplied(_0x45b627, _0x37fd81, _0x374190) {
  const _0x437d99 = normalizeMonitorNickname(_0x37fd81);
  if (!_0x437d99) {
    return;
  }
  const _0x29b27f = getRepliedUsersStoreKey(_0x45b627);
  const _0x5c9fea = _0x374190.get(_0x29b27f, []);
  const _0xc4308f = Array.isArray(_0x5c9fea) ? [..._0x5c9fea] : [];
  if (!_0xc4308f.some(_0x1c4124 => normalizeMonitorNickname(_0x1c4124) === _0x437d99)) {
    _0xc4308f.push(String(_0x37fd81 || "").trim().replace(/^@+/, ""));
    _0x374190.set(_0x29b27f, _0xc4308f.slice(-2000));
  }
}
function buildExcludeCommenterSets(_0x497f51) {
  const _0xc1cc53 = parseExcludeCommenters(_0x497f51);
  const _0x2fef87 = new Set();
  const _0x2ea6ed = new Set();
  const _0x2836e1 = new Set();
  const _0x38d083 = new Map();
  const _0x35ba4a = new Map();
  const _0x2f12d0 = new Map();
  _0xc1cc53.forEach(_0x241866 => {
    const _0x28dc68 = extractExcludeSecUid(_0x241866);
    if (_0x28dc68) {
      _0x2836e1.add(_0x28dc68);
      if (!_0x2f12d0.has(_0x28dc68)) {
        _0x2f12d0.set(_0x28dc68, _0x241866);
      }
      return;
    }
    const _0x33e00e = normalizeMonitorNickname(_0x241866);
    const _0x53e152 = coreMonitorNickname(_0x241866);
    if (_0x33e00e) {
      _0x2fef87.add(_0x33e00e);
      if (!_0x38d083.has(_0x33e00e)) {
        _0x38d083.set(_0x33e00e, _0x241866);
      }
    }
    if (_0x53e152) {
      _0x2ea6ed.add(_0x53e152);
      if (!_0x35ba4a.has(_0x53e152)) {
        _0x35ba4a.set(_0x53e152, _0x241866);
      }
    }
  });
  return {
    nicknames: _0x2fef87,
    cores: _0x2ea6ed,
    secUids: _0x2836e1,
    nickByNormalized: _0x38d083,
    nickByCore: _0x35ba4a,
    secUidByValue: _0x2f12d0,
    entries: _0xc1cc53
  };
}
function buildMonitorSkipContext({
  config = {},
  accounts = [],
  account = null,
  taskId: _0x49eddb,
  monitorTasksApi: _0x34457d,
  store: _0x236b7d,
  videoAuthor = "",
  videoAuthorUrl = ""
}) {
  const _0x5c90f9 = buildExcludeCommenterSets(config.excludeCommenters);
  const _0xe4098c = buildOperatorIdentity(accounts, config.selectedAccounts, account);
  const _0x3ea56e = getRepliedUserNicknames(_0x49eddb, _0x34457d, _0x236b7d);
  const _0x1b661a = normalizeMonitorNickname(videoAuthor);
  const _0x3bad7b = coreMonitorNickname(videoAuthor);
  const _0x34cb97 = extractSecUidFromUrl(videoAuthorUrl);
  return {
    excludeSet: _0x5c90f9.nicknames,
    excludeCores: _0x5c90f9.cores,
    excludeSecUids: _0x5c90f9.secUids,
    excludeNickByNormalized: _0x5c90f9.nickByNormalized,
    excludeNickByCore: _0x5c90f9.nickByCore,
    excludeSecUidByValue: _0x5c90f9.secUidByValue,
    excludeEntries: _0x5c90f9.entries,
    operatorNicknames: _0xe4098c.nicknames,
    operatorCores: _0xe4098c.cores,
    operatorSecUids: _0xe4098c.secUids,
    operatorLabels: _0xe4098c.labels,
    repliedUsers: _0x3ea56e,
    authorNick: _0x1b661a,
    authorCore: _0x3bad7b,
    authorSecUid: _0x34cb97,
    videoAuthor: String(videoAuthor || "").trim(),
    videoAuthorUrl: String(videoAuthorUrl || "").trim(),
    locationFilterMode: config.locationFilterMode,
    locationFilterRegions: config.locationFilterRegions,
    excludeCommentKeywords: config.excludeCommentKeywords || ""
  };
}
function findExcludedCommenterLabel(_0x4e087f, _0x4dc952, _0x487a7f, _0x1e2c97 = {}) {
  return matchExcludedCommenter(_0x4e087f, _0x4dc952, _0x487a7f, _0x1e2c97).label || _0x4e087f || _0x4dc952 || _0x487a7f || "";
}
function isExcludedCommenter(_0x3762ab, _0x4715dd, _0x44b43e, _0x44e9b4 = {}) {
  return matchExcludedCommenter(_0x3762ab, _0x4715dd, _0x44b43e, _0x44e9b4).matched;
}
function isVideoAuthorComment(_0x36db6d, _0x1edfcf, _0x214fa1, _0x22ac43, _0x43f032 = {}) {
  if (_0x36db6d?.isAuthor || _0x36db6d?.isAuthorComment || _0x36db6d?.authorTag === true) {
    return true;
  }
  if (_0x43f032.authorNick && _0x1edfcf && _0x1edfcf === _0x43f032.authorNick) {
    return true;
  }
  if (_0x43f032.authorCore && _0x214fa1 && _0x214fa1 === _0x43f032.authorCore) {
    return true;
  }
  if (_0x43f032.authorSecUid && _0x22ac43 && _0x22ac43 === _0x43f032.authorSecUid) {
    return true;
  }
  return false;
}
function shouldSkipMonitorComment(_0x2c455e, _0x5f122c = {}) {
  const _0x590de9 = String(_0x2c455e?.nickname || "").trim().replace(/^@+/, "") || "用户";
  const _0x160447 = normalizeMonitorNickname(_0x2c455e?.nickname);
  const _0x74ac90 = coreMonitorNickname(_0x2c455e?.nickname);
  const _0x36c0bd = extractSecUidFromUrl(_0x2c455e?.userUrl || _0x2c455e?.authorProfileUrl || _0x2c455e?.secUid);
  if (isVideoAuthorComment(_0x2c455e, _0x160447, _0x74ac90, _0x36c0bd, _0x5f122c)) {
    return {
      skip: true,
      reason: "视频作者",
      detail: "命中视频作者 @" + _0x590de9 + (_0x5f122c.videoAuthor ? "（页面作者：" + _0x5f122c.videoAuthor + "）" : "")
    };
  }
  const _0x39f0e6 = !!_0x160447 && !!_0x5f122c.operatorNicknames?.has(_0x160447);
  const _0x2c6557 = !!_0x74ac90 && !!_0x5f122c.operatorCores?.has(_0x74ac90);
  const _0x2c5f0b = _0x39f0e6 || _0x2c6557 || _0x36c0bd && _0x5f122c.operatorSecUids?.has(_0x36c0bd);
  if (_0x2c5f0b) {
    const _0x3d5841 = _0x36c0bd && _0x5f122c.operatorSecUids?.has(_0x36c0bd) ? "主页身份" : _0x39f0e6 ? "昵称" : "昵称(忽略特殊字符)";
    return {
      skip: true,
      reason: "任务执行账号",
      detail: "命中任务执行账号 @" + _0x590de9 + "（" + _0x3d5841 + "）"
    };
  }
  const _0x3d759e = matchExcludedCommenter(_0x160447, _0x74ac90, _0x36c0bd, _0x5f122c);
  if (_0x3d759e.matched) {
    let _0x211edc = "";
    if (_0x3d759e.mode === "sec_uid") {
      _0x211edc = "（UID/主页链接）";
    } else if (_0x3d759e.mode === "core") {
      _0x211edc = "（已忽略特殊字符差异）";
    }
    return {
      skip: true,
      reason: "排除评论者",
      detail: "命中排除名单「" + _0x3d759e.label + "」→ @" + _0x590de9 + _0x211edc
    };
  }
  if (_0x160447 && _0x5f122c.repliedUsers?.nicknames?.has(_0x160447) || _0x36c0bd && _0x5f122c.repliedUsers?.secUids?.has(_0x36c0bd)) {
    return {
      skip: true,
      reason: "已回复过",
      detail: "该用户本任务已互动过 @" + _0x590de9
    };
  }
  if (_0x5f122c.excludeCommentKeywords && _0x2c455e?.text) {
    const _0x3d334f = matchExcludeCommentKeyword(_0x2c455e.text, _0x5f122c.excludeCommentKeywords);
    if (_0x3d334f) {
      return {
        skip: true,
        reason: "排除关键词「" + _0x3d334f + "」",
        detail: "评论命中排除关键词「" + _0x3d334f + "」@" + _0x590de9
      };
    }
  }
  const _0x3b68d4 = evaluateTaskLocationFilter(_0x2c455e, {
    locationFilterMode: _0x5f122c.locationFilterMode,
    locationFilterRegions: _0x5f122c.locationFilterRegions
  });
  if (!_0x3b68d4.pass) {
    return {
      skip: true,
      reason: _0x3b68d4.reason || "地区过滤",
      detail: "地区过滤未通过 @" + _0x590de9 + "：" + (_0x3b68d4.reason || "地区不匹配")
    };
  }
  return {
    skip: false,
    reason: "",
    detail: ""
  };
}
function formatExcludeCommentersForLog(_0x3c0730 = {}) {
  const _0x270b14 = Array.isArray(_0x3c0730.excludeEntries) ? _0x3c0730.excludeEntries : [];
  if (!_0x270b14.length) {
    return "无";
  }
  const _0x7ea7b4 = _0x3c0730.excludeSecUids?.size || 0;
  const _0x3d3427 = _0x270b14.slice(0, 12).map(_0xa23e0d => {
    const _0x272162 = extractExcludeSecUid(_0xa23e0d);
    if (!_0x272162) {
      return _0xa23e0d;
    }
    if (_0x272162.length > 20) {
      return "UID:" + _0x272162.slice(0, 16) + "…";
    } else {
      return "UID:" + _0x272162;
    }
  }).join("、");
  const _0x12beb0 = _0x270b14.length > 12 ? " 等共 " + _0x270b14.length + " 项（UID " + _0x7ea7b4 + "）" : "（共 " + _0x270b14.length + " 项，UID " + _0x7ea7b4 + "）";
  return "" + _0x3d3427 + _0x12beb0;
}
function formatOperatorAccountsForLog(_0x2c361e = {}) {
  const _0x45036c = Array.isArray(_0x2c361e.operatorLabels) ? _0x2c361e.operatorLabels : [];
  if (!_0x45036c.length) {
    const _0x47825a = _0x2c361e.operatorNicknames?.size || 0;
    const _0x111a46 = _0x2c361e.operatorSecUids?.size || 0;
    if (!_0x47825a && !_0x111a46) {
      return "无（未识别到执行账号昵称/主页）";
    }
    return "已加载昵称 " + _0x47825a + "、主页身份 " + _0x111a46;
  }
  const _0x454104 = _0x45036c.slice(0, 10).join("、");
  if (_0x45036c.length > 10) {
    return _0x454104 + " 等共 " + _0x45036c.length + " 个";
  } else {
    return _0x454104;
  }
}
function buildMonitorUserDedupKey(_0x5f39ae = {}) {
  const _0x1b4d39 = extractSecUidFromUrl(_0x5f39ae.userUrl || _0x5f39ae.authorProfileUrl || _0x5f39ae.secUid || _0x5f39ae.sec_uid || "");
  if (_0x1b4d39) {
    return _0x1b4d39;
  }
  const _0x4eca59 = String(_0x5f39ae.secUid || _0x5f39ae.sec_uid || "").trim();
  if (_0x4eca59.length >= 15) {
    return _0x4eca59;
  } else {
    return "";
  }
}
function isKnownMonitorUser(_0x2414f1, _0x12a394) {
  if (!_0x12a394 || typeof _0x12a394.has !== "function") {
    return false;
  }
  const _0xe8a8fa = buildMonitorUserDedupKey(_0x2414f1);
  return !!_0xe8a8fa && !!_0x12a394.has(_0xe8a8fa);
}
function rememberMonitorUser(_0x2fbad5, _0x2d5e98 = {}) {
  if (!_0x2fbad5 || typeof _0x2fbad5.add !== "function") {
    return "";
  }
  const _0x32fa6a = buildMonitorUserDedupKey(_0x2d5e98);
  if (_0x32fa6a) {
    _0x2fbad5.add(_0x32fa6a);
  }
  return _0x32fa6a;
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
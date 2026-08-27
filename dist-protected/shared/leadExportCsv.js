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
function buildDouyinUserUrlFromSecUid(_0x98f27e) {
  const _0x47c829 = String(_0x98f27e || "").trim();
  if (!_0x47c829) {
    return "";
  }
  return "https://www.douyin.com/user/" + _0x47c829;
}
function normalizeDouyinAuthorUrl(_0x5a5774) {
  const _0x14a1d1 = String(_0x5a5774 || "").trim();
  if (!_0x14a1d1) {
    return "";
  }
  try {
    const _0x41d3bd = new URL(_0x14a1d1.startsWith("http") ? _0x14a1d1 : "https://" + _0x14a1d1);
    const _0x5c3bed = _0x41d3bd.hostname.toLowerCase();
    if (!_0x5c3bed.endsWith("douyin.com")) {
      return "";
    }
    const _0x5e6506 = _0x41d3bd.pathname.match(/\/(?:share\/)?user\/([^/?#]+)/i);
    const _0x5e144c = decodeURIComponent(_0x5e6506?.[1] || _0x41d3bd.searchParams.get("sec_uid") || "").trim();
    if (!_0x5e144c) {
      return "";
    }
    return "https://www.douyin.com/user/" + _0x5e144c;
  } catch (_0x57e02c) {
    return "";
  }
}
function getDouyinAuthorProfileKey(_0x2593eb) {
  const _0x2fc0a6 = normalizeDouyinAuthorUrl(_0x2593eb);
  if (!_0x2fc0a6) {
    return "";
  }
  return _0x2fc0a6.match(/\/user\/([^/?#]+)/)?.[1] || "";
}
function splitCsvRecords(_0x3962d0) {
  const _0x2fef68 = String(_0x3962d0 || "").replace(/^\uFEFF/, "");
  const _0x1bbe55 = [];
  let _0x1e2f75 = "";
  let _0x3686b3 = false;
  for (let _0x22da93 = 0; _0x22da93 < _0x2fef68.length; _0x22da93 += 1) {
    const _0x56c7de = _0x2fef68[_0x22da93];
    if (_0x56c7de === "\"") {
      _0x1e2f75 += _0x56c7de;
      if (_0x3686b3 && _0x2fef68[_0x22da93 + 1] === "\"") {
        _0x1e2f75 += _0x2fef68[_0x22da93 + 1];
        _0x22da93 += 1;
        continue;
      }
      _0x3686b3 = !_0x3686b3;
      continue;
    }
    if ((_0x56c7de === "\n" || _0x56c7de === "\r") && !_0x3686b3) {
      if (_0x56c7de === "\r" && _0x2fef68[_0x22da93 + 1] === "\n") {
        _0x22da93 += 1;
      }
      if (String(_0x1e2f75).trim()) {
        _0x1bbe55.push(_0x1e2f75);
      }
      _0x1e2f75 = "";
      continue;
    }
    _0x1e2f75 += _0x56c7de;
  }
  if (String(_0x1e2f75).trim()) {
    _0x1bbe55.push(_0x1e2f75);
  }
  return _0x1bbe55;
}
function parseCsvLine(_0x452f22) {
  const _0xb52394 = [];
  let _0x32654b = "";
  let _0x5ed625 = false;
  for (let _0x523761 = 0; _0x523761 < _0x452f22.length; _0x523761 += 1) {
    const _0x467094 = _0x452f22[_0x523761];
    if (_0x5ed625) {
      if (_0x467094 === "\"") {
        if (_0x452f22[_0x523761 + 1] === "\"") {
          _0x32654b += "\"";
          _0x523761 += 1;
        } else {
          _0x5ed625 = false;
        }
      } else {
        _0x32654b += _0x467094;
      }
      continue;
    }
    if (_0x467094 === "\"") {
      _0x5ed625 = true;
      continue;
    }
    if (_0x467094 === ",") {
      _0xb52394.push(_0x32654b);
      _0x32654b = "";
      continue;
    }
    _0x32654b += _0x467094;
  }
  _0xb52394.push(_0x32654b);
  return _0xb52394;
}
function parseLeadExportCsv(_0x55ad2a) {
  const _0x1c8792 = splitCsvRecords(_0x55ad2a);
  if (!_0x1c8792.length) {
    return {
      headers: [],
      rows: []
    };
  }
  const _0x17684e = parseCsvLine(_0x1c8792[0]).map(_0x48d9e0 => String(_0x48d9e0 || "").trim());
  const _0x270786 = [];
  for (let _0x59730f = 1; _0x59730f < _0x1c8792.length; _0x59730f += 1) {
    const _0x4c7ad0 = parseCsvLine(_0x1c8792[_0x59730f]);
    const _0x16dc9c = {};
    _0x17684e.forEach((_0x2d664c, _0x34ac0b) => {
      _0x16dc9c[_0x2d664c] = _0x4c7ad0[_0x34ac0b] != null ? String(_0x4c7ad0[_0x34ac0b]) : "";
    });
    _0x270786.push(_0x16dc9c);
  }
  return {
    headers: _0x17684e,
    rows: _0x270786
  };
}
function yesNoToBool(_0x255eae) {
  const _0x553d62 = String(_0x255eae || "").trim();
  return _0x553d62 === "是" || _0x553d62 === "true" || _0x553d62 === "TRUE" || _0x553d62 === "1";
}
function toNonNegInt(_0x5f4549) {
  const _0x274889 = Number(String(_0x5f4549 || "").replace(/[^\d.-]/g, ""));
  if (Number.isFinite(_0x274889)) {
    return Math.max(0, Math.floor(_0x274889));
  } else {
    return 0;
  }
}
function parseExportCapturedAt(_0x57318b) {
  const _0x416baa = String(_0x57318b || "").trim();
  if (!_0x416baa || _0x416baa === "未知") {
    return 0;
  }
  const _0x143919 = Number(_0x416baa);
  if (Number.isFinite(_0x143919) && _0x143919 > 100000000000) {
    return Math.floor(_0x143919);
  }
  const _0x1f3780 = Date.parse(_0x416baa);
  if (Number.isFinite(_0x1f3780) && _0x1f3780 > 0) {
    return _0x1f3780;
  }
  let _0x2be7bf = _0x416baa.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})(?:[\sT]+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
  if (_0x2be7bf) {
    const _0x2e3b25 = new Date(Number(_0x2be7bf[1]), Number(_0x2be7bf[2]) - 1, Number(_0x2be7bf[3]), Number(_0x2be7bf[4] || 0), Number(_0x2be7bf[5] || 0), Number(_0x2be7bf[6] || 0));
    if (Number.isFinite(_0x2e3b25.getTime())) {
      return _0x2e3b25.getTime();
    }
  }
  _0x2be7bf = _0x416baa.match(/^(\d{1,2})[-/.](\d{1,2})(?:[\sT]+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
  if (_0x2be7bf) {
    const _0x3c515a = new Date(new Date().getFullYear(), Number(_0x2be7bf[1]) - 1, Number(_0x2be7bf[2]), Number(_0x2be7bf[3] || 0), Number(_0x2be7bf[4] || 0), Number(_0x2be7bf[5] || 0));
    if (Number.isFinite(_0x3c515a.getTime())) {
      return _0x3c515a.getTime();
    }
  }
  return 0;
}
function resolveOriginMetaFromExportLabel(_0x45b04a) {
  const _0x3937f8 = String(_0x45b04a || "").trim();
  if (!_0x3937f8 || _0x3937f8 === "CSV导入" || _0x3937f8 === "UID导入") {
    return {
      entrySource: "import",
      entryLabel: _0x3937f8 || "CSV导入",
      taskId: "import_csv",
      taskName: "CSV导入"
    };
  }
  for (const _0x296b81 of ORIGIN_OPTIONS) {
    if (_0x296b81.label !== _0x3937f8) {
      continue;
    }
    if (_0x296b81.value === "import") {
      return {
        entrySource: "import",
        entryLabel: _0x3937f8,
        taskId: "import_csv",
        taskName: "CSV导入"
      };
    }
    if (_0x296b81.value === "monitor") {
      return {
        entrySource: "monitor",
        entryLabel: _0x3937f8,
        taskId: "import_csv",
        taskName: _0x3937f8
      };
    }
    if (String(_0x296b81.value).startsWith("entity_")) {
      return {
        entrySource: _0x296b81.value,
        entryLabel: _0x3937f8,
        taskId: "import_csv",
        taskName: _0x3937f8
      };
    }
    if (_0x296b81.value === "leadgen") {
      return {
        entrySource: "search",
        entryLabel: "评论获客",
        taskId: "import_csv",
        taskName: "评论获客"
      };
    }
  }
  if (_0x3937f8.startsWith("监控") || _0x3937f8.includes("监控:") || _0x3937f8.includes("监控：")) {
    return {
      entrySource: "monitor",
      entryLabel: _0x3937f8,
      taskId: "import_csv",
      taskName: _0x3937f8
    };
  }
  if (_0x3937f8.startsWith("搜索:") || _0x3937f8.startsWith("搜索：") || _0x3937f8 === "推荐页" || _0x3937f8 === "关注列表" || _0x3937f8 === "喜欢列表" || _0x3937f8 === "指定视频") {
    return {
      entrySource: _0x3937f8 === "关注列表" ? "follow" : _0x3937f8 === "推荐页" ? "recommend" : _0x3937f8 === "喜欢列表" ? "like" : _0x3937f8 === "指定视频" ? "specific" : "search",
      entryLabel: _0x3937f8,
      taskId: "import_csv",
      taskName: _0x3937f8
    };
  }
  if (_0x3937f8.includes("线索采集") || _0x3937f8.includes("实体获客")) {
    const _0x16e423 = ORIGIN_OPTIONS.find(_0x4e7a03 => String(_0x4e7a03.value).startsWith("entity_") && _0x3937f8.includes(String(_0x4e7a03.label).replace(/^线索采集：/, "")));
    if (_0x16e423) {
      return {
        entrySource: _0x16e423.value,
        entryLabel: _0x16e423.label,
        taskId: "import_csv",
        taskName: _0x16e423.label
      };
    }
  }
  return {
    entrySource: "import",
    entryLabel: _0x3937f8,
    taskId: "import_csv",
    taskName: "CSV导入"
  };
}
function buildLeadFromExportRow(_0x204462 = {}) {
  const _0x34db4f = String(_0x204462.用户主页 || _0x204462.userUrl || "").trim();
  const _0x39b518 = normalizeDouyinAuthorUrl(_0x34db4f) || _0x34db4f;
  const _0x1e3cfb = getDouyinAuthorProfileKey(_0x39b518) || _0x39b518.match(/MS4wLjABAAAA[A-Za-z0-9_-]+/i)?.[0] || "";
  const _0x1f5da2 = _0x39b518 || (_0x1e3cfb ? buildDouyinUserUrlFromSecUid(_0x1e3cfb) : "");
  if (!_0x1f5da2 || !_0x1e3cfb) {
    return {
      ok: false,
      reason: "缺少有效用户主页"
    };
  }
  const _0x64fc11 = parseExportCapturedAt(_0x204462.获取时间) || Date.now();
  const _0xf49947 = toNonNegInt(_0x204462.点赞次数);
  const _0x2908c5 = toNonNegInt(_0x204462.回复次数);
  const _0x565be5 = toNonNegInt(_0x204462.关注次数);
  const _0x164d9f = toNonNegInt(_0x204462.私信次数);
  const _0x71777d = toNonNegInt(_0x204462.首作评论次数);
  const _0x28f997 = normalizeWorksCount(_0x204462.作品数);
  const _0x189c40 = resolveOriginMetaFromExportLabel(_0x204462.线索来源 || _0x204462.entryLabel);
  const _0x3a6eff = canonicalizeDouyinVideoUrl(_0x204462.视频链接 || _0x204462.videoUrl || "") || "";
  const _0x28437e = String(_0x204462.地区 || "").trim();
  return {
    ok: true,
    lead: {
      leadId: _0x1e3cfb,
      key: _0x1e3cfb,
      platform: String(_0x204462.平台 || "DY").trim() || "DY",
      nickname: String(_0x204462.用户昵称 || "").trim(),
      userUrl: _0x1f5da2,
      secUid: _0x1e3cfb,
      searchKeyword: String(_0x204462.搜索词 || "").trim(),
      isHighIntention: yesNoToBool(_0x204462.有意向),
      aiThought: String(_0x204462.AI分析结果 || "").trim(),
      thought: String(_0x204462.AI分析结果 || "").trim(),
      title: String(_0x204462.视频标题 || "").trim(),
      videoUrl: _0x3a6eff,
      url: _0x3a6eff || _0x1f5da2,
      content: String(_0x204462.评论内容 || "").trim(),
      timeText: String(_0x204462.评论时间 || "").trim(),
      ipLocation: _0x28437e,
      location: _0x28437e,
      accountName: String(_0x204462.获取账号 || "").trim(),
      worksCount: _0x28f997,
      noWorks: _0x28f997 === 0,
      touchCounts: {
        like: _0xf49947,
        reply: _0x2908c5,
        follow: _0x565be5,
        message: _0x164d9f,
        profileComment: _0x71777d,
        videoComment: 0
      },
      liked: _0xf49947 > 0,
      replied: _0x2908c5 > 0 || _0x71777d > 0,
      followed: _0x565be5 > 0,
      messaged: _0x164d9f > 0,
      entrySource: _0x189c40.entrySource,
      entryLabel: _0x189c40.entryLabel,
      taskId: _0x189c40.taskId,
      taskName: _0x189c40.taskName,
      timestamp: _0x64fc11,
      capturedAt: new Date(_0x64fc11).toISOString(),
      source: "import_csv"
    }
  };
}
function buildLeadsFromExportCsv(_0x235443) {
  const {
    rows: _0xa5b025
  } = parseLeadExportCsv(_0x235443);
  const _0x411b93 = [];
  const _0x442b98 = [];
  const _0x3f0868 = new Set();
  for (const _0x1c7ff4 of _0xa5b025) {
    const _0x37797c = buildLeadFromExportRow(_0x1c7ff4);
    if (!_0x37797c.ok) {
      _0x442b98.push({
        row: _0x1c7ff4,
        reason: _0x37797c.reason
      });
      continue;
    }
    const _0x2a8193 = _0x37797c.lead.leadId;
    if (_0x3f0868.has(_0x2a8193)) {
      _0x442b98.push({
        row: _0x1c7ff4,
        reason: "重复用户主页"
      });
      continue;
    }
    _0x3f0868.add(_0x2a8193);
    _0x411b93.push(_0x37797c.lead);
  }
  return {
    accepted: _0x411b93,
    rejected: _0x442b98,
    totalRows: _0xa5b025.length
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
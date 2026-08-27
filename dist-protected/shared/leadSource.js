const LEADGEN_ENTRY_SOURCES = new Set(["search", "follow", "recommend", "like", "specific"]);
const ENTITY_ENTRY_SOURCES = Object.freeze({
  entity_blogger: "entity_blogger",
  entity_user: "entity_user",
  entity_mutual: "entity_mutual",
  entity_following: "entity_following",
  entity_live: "entity_live",
  entity_comment: "entity_comment",
  entity_video: "entity_video",
  entity_video_search: "entity_video_search",
  entity_video_recommend: "entity_video_recommend",
  entity_video_like: "entity_video_like",
  entity_video_specific: "entity_video_specific",
  entity_author_profile: "entity_author_profile"
});
const LEAD_ORIGIN_OPTIONS = Object.freeze([{
  value: "leadgen",
  label: "获客任务"
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
  value: "entity_video_search",
  label: "线索采集：搜索视频"
}, {
  value: "entity_video_recommend",
  label: "线索采集：推荐页"
}, {
  value: "entity_video_like",
  label: "线索采集：喜欢列表"
}, {
  value: "entity_video_specific",
  label: "线索采集：指定视频"
}, {
  value: "entity_author_profile",
  label: "线索采集：指定博主"
}, {
  value: "monitor",
  label: "监控任务"
}, {
  value: "legacy",
  label: "其他/旧数据"
}]);
const LEAD_ORIGIN_LABELS = Object.freeze(LEAD_ORIGIN_OPTIONS.reduce((_0x40062b, _0x36fcc4) => {
  _0x40062b[_0x36fcc4.value] = _0x36fcc4.label;
  return _0x40062b;
}, {}));
const ENTITY_ENTRY_LABELS = Object.freeze({
  entity_blogger: "线索采集：搜索博主",
  entity_user: "线索采集：搜索用户",
  entity_mutual: "线索采集：相互关注",
  entity_following: "线索采集：关注列表",
  entity_live: "线索采集：直播间",
  entity_comment: "线索采集：评论区潜客",
  entity_video: "线索采集：视频作品链接",
  entity_video_search: "线索采集：搜索视频",
  entity_video_recommend: "线索采集：推荐页",
  entity_video_like: "线索采集：喜欢列表",
  entity_video_specific: "线索采集：指定视频",
  entity_author_profile: "线索采集：指定博主"
});
function looksLikeMonitorName(_0x5aaa67) {
  const _0x2da397 = String(_0x5aaa67 || "").trim();
  if (!_0x2da397) {
    return false;
  }
  return _0x2da397.startsWith("监控") || _0x2da397.includes("监控:") || _0x2da397.includes("监控：");
}
function looksLikeEntityName(_0x4c2fb2) {
  const _0x5bba41 = String(_0x4c2fb2 || "").trim();
  if (!_0x5bba41) {
    return "";
  }
  if (_0x5bba41.includes("搜索博主") || _0x5bba41.includes("实体获客：博主") || _0x5bba41.includes("线索采集：搜索博主")) {
    return "entity_blogger";
  }
  if (_0x5bba41.includes("搜索用户") || _0x5bba41.includes("实体获客：用户") || _0x5bba41.includes("线索采集：搜索用户")) {
    return "entity_user";
  }
  if (_0x5bba41.includes("直播间") || _0x5bba41.includes("实体获客：直播间") || _0x5bba41.includes("线索采集：直播间")) {
    return "entity_live";
  }
  if (_0x5bba41.includes("评论区") || _0x5bba41.includes("实体获客：评论区") || _0x5bba41.includes("线索采集：评论区潜客")) {
    return "entity_comment";
  }
  if (_0x5bba41.includes("视频作品") || _0x5bba41.includes("实体获客：视频作品") || _0x5bba41.includes("线索采集：视频作品链接")) {
    return "entity_video";
  }
  if (_0x5bba41.includes("关注列表") || _0x5bba41.includes("实体获客：关注列表") || _0x5bba41.includes("线索采集：关注列表")) {
    return "entity_following";
  }
  if (_0x5bba41.includes("相互关注") || _0x5bba41.includes("实体获客：相互关注") || _0x5bba41.includes("线索采集：相互关注")) {
    return "entity_mutual";
  }
  if (_0x5bba41.includes("指定博主") || _0x5bba41.includes("线索采集：指定博主")) {
    return "entity_author_profile";
  }
  return "";
}
function resolveLeadOrigin(_0x1d9cc1 = {}) {
  const _0x223149 = String(_0x1d9cc1.entrySource || "").trim();
  if (ENTITY_ENTRY_SOURCES[_0x223149]) {
    return _0x223149;
  }
  if (_0x223149 === "monitor") {
    return "monitor";
  }
  if (LEADGEN_ENTRY_SOURCES.has(_0x223149)) {
    return "leadgen";
  }
  const _0x179feb = String(_0x1d9cc1.taskId || "");
  if (_0x179feb.startsWith("monitor_")) {
    return "monitor";
  }
  if (_0x179feb.startsWith("entity_")) {
    const _0x3cc846 = looksLikeEntityName(_0x1d9cc1.entryLabel || _0x1d9cc1.taskName);
    if (_0x3cc846) {
      return _0x3cc846;
    }
    return "entity_blogger";
  }
  const _0x4019d7 = looksLikeEntityName(_0x1d9cc1.entryLabel || _0x1d9cc1.taskName);
  if (_0x4019d7) {
    return _0x4019d7;
  }
  if (looksLikeMonitorName(_0x1d9cc1.entryLabel) || looksLikeMonitorName(_0x1d9cc1.taskName)) {
    return "monitor";
  }
  if (_0x1d9cc1.searchKeyword) {
    return "leadgen";
  }
  if (_0x1d9cc1.taskName || _0x1d9cc1.entryLabel || _0x223149) {
    return "leadgen";
  }
  return "legacy";
}
function formatLeadOriginLabel(_0x5016b1 = {}) {
  const _0x51e2ca = resolveLeadOrigin(_0x5016b1);
  if (_0x51e2ca === "monitor") {
    return _0x5016b1.entryLabel || (_0x5016b1.taskName ? "监控: " + _0x5016b1.taskName : "监控任务");
  }
  if (_0x51e2ca.startsWith("entity_")) {
    return ENTITY_ENTRY_LABELS[_0x51e2ca] || LEAD_ORIGIN_LABELS[_0x51e2ca] || "线索采集";
  }
  if (_0x51e2ca === "leadgen") {
    return "获客任务";
  }
  return _0x5016b1.entryLabel || _0x5016b1.taskName || LEAD_ORIGIN_LABELS.legacy;
}
function getEntityEntryMeta(_0x3832ec) {
  const _0x4cd5f5 = String(_0x3832ec || "").trim();
  if (_0x4cd5f5 === "blogger" || _0x4cd5f5 === "entity_blogger") {
    return {
      entrySource: "entity_blogger",
      entryLabel: ENTITY_ENTRY_LABELS.entity_blogger
    };
  }
  if (_0x4cd5f5 === "user" || _0x4cd5f5 === "entity_user") {
    return {
      entrySource: "entity_user",
      entryLabel: ENTITY_ENTRY_LABELS.entity_user
    };
  }
  if (_0x4cd5f5 === "mutual" || _0x4cd5f5 === "entity_mutual") {
    return {
      entrySource: "entity_mutual",
      entryLabel: ENTITY_ENTRY_LABELS.entity_mutual
    };
  }
  if (_0x4cd5f5 === "following" || _0x4cd5f5 === "entity_following") {
    return {
      entrySource: "entity_following",
      entryLabel: ENTITY_ENTRY_LABELS.entity_following
    };
  }
  if (_0x4cd5f5 === "live" || _0x4cd5f5 === "entity_live") {
    return {
      entrySource: "entity_live",
      entryLabel: ENTITY_ENTRY_LABELS.entity_live
    };
  }
  if (_0x4cd5f5 === "comment" || _0x4cd5f5 === "entity_comment") {
    return {
      entrySource: "entity_comment",
      entryLabel: ENTITY_ENTRY_LABELS.entity_comment
    };
  }
  if (_0x4cd5f5 === "video" || _0x4cd5f5 === "entity_video") {
    return {
      entrySource: "entity_video",
      entryLabel: ENTITY_ENTRY_LABELS.entity_video
    };
  }
  if (_0x4cd5f5 === "video_search" || _0x4cd5f5 === "entity_video_search") {
    return {
      entrySource: "entity_video_search",
      entryLabel: ENTITY_ENTRY_LABELS.entity_video_search
    };
  }
  if (_0x4cd5f5 === "video_recommend" || _0x4cd5f5 === "entity_video_recommend") {
    return {
      entrySource: "entity_video_recommend",
      entryLabel: ENTITY_ENTRY_LABELS.entity_video_recommend
    };
  }
  if (_0x4cd5f5 === "video_like" || _0x4cd5f5 === "entity_video_like") {
    return {
      entrySource: "entity_video_like",
      entryLabel: ENTITY_ENTRY_LABELS.entity_video_like
    };
  }
  if (_0x4cd5f5 === "video_specific" || _0x4cd5f5 === "entity_video_specific") {
    return {
      entrySource: "entity_video_specific",
      entryLabel: ENTITY_ENTRY_LABELS.entity_video_specific
    };
  }
  if (_0x4cd5f5 === "author_profile" || _0x4cd5f5 === "entity_author_profile") {
    return {
      entrySource: "entity_author_profile",
      entryLabel: ENTITY_ENTRY_LABELS.entity_author_profile
    };
  }
  return {
    entrySource: "entity_video_search",
    entryLabel: ENTITY_ENTRY_LABELS.entity_video_search
  };
}
module.exports = {
  LEAD_ORIGIN_OPTIONS: LEAD_ORIGIN_OPTIONS,
  LEAD_ORIGIN_LABELS: LEAD_ORIGIN_LABELS,
  ENTITY_ENTRY_LABELS: ENTITY_ENTRY_LABELS,
  resolveLeadOrigin: resolveLeadOrigin,
  formatLeadOriginLabel: formatLeadOriginLabel,
  getEntityEntryMeta: getEntityEntryMeta
};
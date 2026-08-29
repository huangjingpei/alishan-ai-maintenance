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
const LEAD_ORIGIN_LABELS = Object.freeze(LEAD_ORIGIN_OPTIONS.reduce((arg1, arg2) => {
  arg1[arg2.value] = arg2.label;
  return arg1;
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
function looksLikeMonitorName(arg1) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return false;
  }
  return result.startsWith("监控") || result.includes("监控:") || result.includes("监控：");
}
function looksLikeEntityName(arg1) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return "";
  }
  if (result.includes("搜索博主") || result.includes("实体获客：博主") || result.includes("线索采集：搜索博主")) {
    return "entity_blogger";
  }
  if (result.includes("搜索用户") || result.includes("实体获客：用户") || result.includes("线索采集：搜索用户")) {
    return "entity_user";
  }
  if (result.includes("直播间") || result.includes("实体获客：直播间") || result.includes("线索采集：直播间")) {
    return "entity_live";
  }
  if (result.includes("评论区") || result.includes("实体获客：评论区") || result.includes("线索采集：评论区潜客")) {
    return "entity_comment";
  }
  if (result.includes("视频作品") || result.includes("实体获客：视频作品") || result.includes("线索采集：视频作品链接")) {
    return "entity_video";
  }
  if (result.includes("关注列表") || result.includes("实体获客：关注列表") || result.includes("线索采集：关注列表")) {
    return "entity_following";
  }
  if (result.includes("相互关注") || result.includes("实体获客：相互关注") || result.includes("线索采集：相互关注")) {
    return "entity_mutual";
  }
  if (result.includes("指定博主") || result.includes("线索采集：指定博主")) {
    return "entity_author_profile";
  }
  return "";
}
function resolveLeadOrigin(options = {}) {
  const result = String(options.entrySource || "").trim();
  if (ENTITY_ENTRY_SOURCES[result]) {
    return result;
  }
  if (result === "monitor") {
    return "monitor";
  }
  if (LEADGEN_ENTRY_SOURCES.has(result)) {
    return "leadgen";
  }
  const result2 = String(options.taskId || "");
  if (result2.startsWith("monitor_")) {
    return "monitor";
  }
  if (result2.startsWith("entity_")) {
    const result = looksLikeEntityName(options.entryLabel || options.taskName);
    if (result) {
      return result;
    }
    return "entity_blogger";
  }
  const result3 = looksLikeEntityName(options.entryLabel || options.taskName);
  if (result3) {
    return result3;
  }
  if (looksLikeMonitorName(options.entryLabel) || looksLikeMonitorName(options.taskName)) {
    return "monitor";
  }
  if (options.searchKeyword) {
    return "leadgen";
  }
  if (options.taskName || options.entryLabel || result) {
    return "leadgen";
  }
  return "legacy";
}
function formatLeadOriginLabel(options = {}) {
  const result = resolveLeadOrigin(options);
  if (result === "monitor") {
    return options.entryLabel || (options.taskName ? "监控: " + options.taskName : "监控任务");
  }
  if (result.startsWith("entity_")) {
    return ENTITY_ENTRY_LABELS[result] || LEAD_ORIGIN_LABELS[result] || "线索采集";
  }
  if (result === "leadgen") {
    return "获客任务";
  }
  return options.entryLabel || options.taskName || LEAD_ORIGIN_LABELS.legacy;
}
function getEntityEntryMeta(arg1) {
  const result = String(arg1 || "").trim();
  if (result === "blogger" || result === "entity_blogger") {
    return {
      entrySource: "entity_blogger",
      entryLabel: ENTITY_ENTRY_LABELS.entity_blogger
    };
  }
  if (result === "user" || result === "entity_user") {
    return {
      entrySource: "entity_user",
      entryLabel: ENTITY_ENTRY_LABELS.entity_user
    };
  }
  if (result === "mutual" || result === "entity_mutual") {
    return {
      entrySource: "entity_mutual",
      entryLabel: ENTITY_ENTRY_LABELS.entity_mutual
    };
  }
  if (result === "following" || result === "entity_following") {
    return {
      entrySource: "entity_following",
      entryLabel: ENTITY_ENTRY_LABELS.entity_following
    };
  }
  if (result === "live" || result === "entity_live") {
    return {
      entrySource: "entity_live",
      entryLabel: ENTITY_ENTRY_LABELS.entity_live
    };
  }
  if (result === "comment" || result === "entity_comment") {
    return {
      entrySource: "entity_comment",
      entryLabel: ENTITY_ENTRY_LABELS.entity_comment
    };
  }
  if (result === "video" || result === "entity_video") {
    return {
      entrySource: "entity_video",
      entryLabel: ENTITY_ENTRY_LABELS.entity_video
    };
  }
  if (result === "video_search" || result === "entity_video_search") {
    return {
      entrySource: "entity_video_search",
      entryLabel: ENTITY_ENTRY_LABELS.entity_video_search
    };
  }
  if (result === "video_recommend" || result === "entity_video_recommend") {
    return {
      entrySource: "entity_video_recommend",
      entryLabel: ENTITY_ENTRY_LABELS.entity_video_recommend
    };
  }
  if (result === "video_like" || result === "entity_video_like") {
    return {
      entrySource: "entity_video_like",
      entryLabel: ENTITY_ENTRY_LABELS.entity_video_like
    };
  }
  if (result === "video_specific" || result === "entity_video_specific") {
    return {
      entrySource: "entity_video_specific",
      entryLabel: ENTITY_ENTRY_LABELS.entity_video_specific
    };
  }
  if (result === "author_profile" || result === "entity_author_profile") {
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
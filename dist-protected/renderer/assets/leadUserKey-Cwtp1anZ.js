import { fy as nt, fz as it } from "./index-BegIKaMc.js";
const g = ["like", "reply", "follow", "message", "profileComment", "videoComment"];
const A = {
  like: "点赞",
  reply: "回复",
  follow: "关注",
  message: "私信",
  profileComment: "首作评论",
  videoComment: "视频评论"
};
const N = {
  ...A,
  profileComment: "首作评论"
};
function x() {
  return {
    like: 0,
    reply: 0,
    follow: 0,
    message: 0,
    profileComment: 0,
    videoComment: 0
  };
}
function E(t) {
  const n = x();
  if (!!t && typeof t == "object") {
    g.forEach(i => {
      const o = Number(t[i]);
      n[i] = Number.isFinite(o) && o > 0 ? Math.floor(o) : 0;
    });
  }
  return n;
}
function ot(t) {
  const n = E(t);
  return g.reduce((i, o) => i + n[o], 0);
}
function M(t) {
  var n;
  var i;
  if (t) {
    if ((((n = t.touchCounts) == null ? undefined : n.profileComment) || 0) > 0 || Array.isArray(t.touchLog) && t.touchLog.some(o => o.type === "profileComment")) {
      return true;
    } else {
      return (i = t.actions) != null && !!i.profileWorkCommented && !!t.profileCommentAt;
    }
  } else {
    return false;
  }
}
function et(t) {
  var n;
  return t && (t.actions && delete t.actions.profileWorkCommented, Array.isArray(t.touchLog) && t.touchLog.length && (t.touchLog = t.touchLog.filter(i => i.type !== "profileComment")), t.touchCounts = t.touchCounts || x(), t.touchCounts.profileComment = 0, (n = t.touchLog) != null && n.some(i => i.type === "profileComment") || delete t.profileCommentAt, t.replied && !t.touchCounts.reply && !t.touchCounts.profileComment && (t.replied = false, t.actions && delete t.actions.replied), t);
}
function $(t) {
  var i;
  var o;
  var e;
  var r;
  if (!t) {
    return x();
  }
  const n = E(t.touchCounts);
  if (t.liked || (i = t.actions) != null && i.liked) {
    n.like = Math.max(n.like, 1);
  }
  if (M(t)) {
    n.profileComment = Math.max(n.profileComment, 1);
  } else if (t.replied || (o = t.actions) != null && o.replied) {
    n.reply = Math.max(n.reply, 1);
  }
  if (t.followed || (e = t.actions) != null && e.followed) {
    n.follow = Math.max(n.follow, 1);
  }
  if (t.messaged || (r = t.actions) != null && r.messaged) {
    n.message = Math.max(n.message, 1);
  }
  return n;
}
function Q(t) {
  var n;
  if (!t) {
    return t;
  }
  if (!Array.isArray(t.touchLog)) {
    t.touchLog = [];
  }
  t.touchCounts = $(t);
  if (t.worksCount === undefined) {
    t.worksCount = null;
  }
  if (t.isPrivate === undefined) {
    t.isPrivate = false;
  }
  if (t.worksCount !== null && t.worksCount !== undefined && Number(t.worksCount) === 0) {
    t.noWorks = true;
  } else if (t.noWorks === undefined) {
    t.noWorks = false;
  }
  if (!t.entrySource && t.taskName) {
    const i = String(t.taskName);
    if (i.includes("关注列表")) {
      t.entrySource = "follow";
    } else if (i.includes("推荐")) {
      t.entrySource = "recommend";
    } else if (i && !i.includes("+")) {
      t.entrySource = "search";
    }
  }
  if (!t.entryLabel) {
    if (t.entrySource === "search" && t.searchKeyword) {
      t.entryLabel = `搜索: ${t.searchKeyword}`;
    } else if (t.entrySource === "follow") {
      t.entryLabel = "关注列表";
    } else if (t.entrySource === "recommend") {
      t.entryLabel = "推荐页";
    } else if (t.entrySource === "like") {
      t.entryLabel = "喜欢列表";
    } else if (t.entrySource === "specific") {
      t.entryLabel = "指定视频";
    } else if (t.entrySource === "monitor") {
      t.entryLabel = t.taskName ? `监控: ${t.taskName}` : "监控视频";
    } else if (t.entrySource === "entity_blogger") {
      t.entryLabel = "线索采集：搜索博主";
    } else if (t.entrySource === "entity_user") {
      t.entryLabel = "线索采集：搜索用户";
    } else if (t.entrySource === "entity_mutual") {
      t.entryLabel = "线索采集：相互关注";
    } else if (t.entrySource === "entity_following") {
      t.entryLabel = "线索采集：关注列表";
    } else if (t.taskName) {
      t.entryLabel = t.taskName;
    }
  }
  if ((n = t.touchLog) != null && n.length) {
    t.touchLog = W(t.touchLog);
    R(t);
    t.touchCounts = $(t);
  }
  return t;
}
function C(t) {
  return Number((t == null ? undefined : t.at) || (t == null ? undefined : t.timestamp) || 0);
}
function X(t) {
  for (const n of t) {
    const i = ((n == null ? undefined : n.content) || "").trim();
    if (i) {
      return i;
    }
  }
  return "";
}
function rt(t) {
  if (!Array.isArray(t) || !t.length) {
    return [];
  }
  const n = new Set();
  const i = new Map();
  const o = [];
  for (const e of t) {
    const r = C(e);
    const f = r ? Math.floor(r / 1000) : 0;
    const u = String(e.content || "").trim().slice(0, 80);
    if (e.type === "profileComment") {
      const m = `${e.type}|${e.accountName || ""}`;
      const h = i.get(m) || [];
      if (r ? h.some(p => p > 0 && Math.abs(p - r) < 120000) : h.includes(0)) {
        continue;
      }
      h.push(r);
      i.set(m, h);
      o.push(e);
      continue;
    }
    const s = `${e.type}|${e.accountName || ""}|${u}|${f}`;
    if (!n.has(s)) {
      n.add(s);
      o.push(e);
    }
  }
  return o;
}
function W(t) {
  if (!Array.isArray(t) || !t.length) {
    return [];
  }
  const n = t.map(e => ({
    ...e
  }));
  const i = new Set();
  const o = [];
  for (let e = 0; e < n.length; e++) {
    if (i.has(e)) {
      continue;
    }
    const r = n[e];
    const f = C(r);
    const u = r.accountName || "";
    if (r.type === "reply" || r.type === "profileComment") {
      const m = [e];
      for (let p = 0; p < n.length; p++) {
        if (p === e || i.has(p)) {
          continue;
        }
        const S = n[p];
        if (S.type !== "reply" && S.type !== "profileComment" || (S.accountName || "") !== u) {
          continue;
        }
        const v = C(S);
        if (!f || !v || !(Math.abs(v - f) > 15000)) {
          m.push(p);
        }
      }
      const h = m.some(p => n[p].type === "reply");
      const U = m.some(p => n[p].type === "profileComment");
      if (h && U) {
        const p = m.map(y => n[y]);
        m.forEach(y => i.add(y));
        const S = Math.max(...p.map(y => C(y)).filter(Boolean)) || Date.now();
        const v = p.find(y => y.type === "profileComment") || p[0];
        o.push({
          ...v,
          type: "profileComment",
          label: N.profileComment,
          content: X(p),
          at: S
        });
        continue;
      }
    }
    i.add(e);
    const s = r.type === "profileComment" ? N.profileComment : r.label || A[r.type] || r.type;
    o.push({
      ...r,
      label: s,
      at: f || Date.now()
    });
  }
  return rt(o.sort((e, r) => C(r) - C(e)));
}
function R(t) {
  if (!t) {
    return t;
  }
  const n = x();
  for (const i of t.touchLog || []) {
    if (g.includes(i.type)) {
      n[i.type] += 1;
    }
  }
  t.touchCounts = n;
  return t;
}
function st(t, n) {
  if (!t || n == null || !n.type || !g.includes(n.type)) {
    return t;
  }
  Q(t);
  const i = n.at || Date.now();
  const o = n.source || "acquire";
  const e = n.channel || (o === "batch" ? "线索库批量" : "自动获客");
  const r = n.accountName || t.accountName || "";
  let f = n.content || "";
  if (n.type === "profileComment") {
    const s = t.touchLog.filter(m => m.type === "reply" && (m.accountName || "") === r && (!C(m) || !i || Math.abs(C(m) - i) < 15000));
    if (!f.trim() && s.length) {
      f = X(s);
    }
    if (s.length) {
      t.touchLog = t.touchLog.filter(m => !s.includes(m));
    }
  }
  if (!t.touchLog.some(s => {
    if (s.type !== n.type || (s.accountName || "") !== r) {
      return false;
    }
    if (n.type === "profileComment") {
      const m = C(s);
      return m && Math.abs(m - i) < 120000;
    }
    return Math.abs(C(s) - i) < 2500;
  })) {
    t.touchCounts[n.type] = (t.touchCounts[n.type] || 0) + 1;
    t.touchLog.unshift({
      type: n.type,
      label: n.type === "profileComment" ? N.profileComment : A[n.type] || n.type,
      at: i,
      content: f,
      accountName: r,
      success: n.success !== false,
      source: o,
      channel: e
    });
    t.touchLog = W(t.touchLog);
    R(t);
    t.lastTouchAt = Number(i);
    if (n.type === "profileComment") {
      t.profileCommentAt = Number(i);
    }
    if (t.touchLog.length > 200) {
      t.touchLog.length = 200;
    }
  }
  return t;
}
function O(t) {
  return W(t);
}
function ct(t = [], n = []) {
  return O([...n, ...t]).slice(0, 200);
}
const ut = {
  profile_first_comment: ["profileComment"],
  follow_dm: ["follow", "message"],
  follow: ["follow"],
  message: ["message"]
};
function ft(t) {
  return ut[t] || [];
}
function Ct(t, n) {
  const i = [];
  for (const o of n || []) {
    const e = (t || []).find(u => u.leadId === o.leadId);
    if (!e) {
      i.push(o);
      continue;
    }
    const r = ft(o.rawType);
    const f = o.timestamp || Date.now();
    if (r.length === 0) {
      i.push(o);
      continue;
    }
    r.forEach(u => {
      st(e, {
        type: u,
        at: f,
        accountName: o.accountName,
        success: o.success,
        content: o.error || "",
        source: "batch",
        channel: "线索库批量"
      });
    });
  }
  return i;
}
function bt(t) {
  var i;
  if (t != null && t.touchSummary) {
    return t.touchSummary;
  }
  const n = [];
  if ((i = t == null ? undefined : t.touchTypes) != null && i.length) {
    t.touchTypes.forEach(o => {
      n.push(A[o] || o);
    });
  }
  if (t != null && t.lastChannel) {
    n.push(`@${t.lastChannel}`);
  }
  if (n.length) {
    return n.join(" · ");
  } else {
    return "已触达（详情见线索库）";
  }
}
function St(t) {
  if (ot(t == null ? undefined : t.touchCounts) > 0) {
    return true;
  } else if (t) {
    return !!t.liked || !!t.replied || !!t.followed || !!t.messaged || !!M(t);
  } else {
    return false;
  }
}
function Lt(t, n) {
  if (n) {
    Q(t);
    return (t.touchLog || []).some(i => (i.source || "acquire") === n);
  } else {
    return true;
  }
}
const I = -1;
function tt(t) {
  if (t == null) {
    return I;
  }
  if (typeof t == "string") {
    const i = t.trim();
    if (!i || i === "未知" || i === "-" || i === "null" || i === "N/A" || /^unknown$/i.test(i)) {
      return I;
    }
  }
  const n = Number(String(t).replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(n) || n < 0) {
    return I;
  } else {
    return Math.floor(n);
  }
}
function wt(t) {
  if (t == null || t === "") {
    return "未知";
  }
  const n = tt(t);
  if (n < 0) {
    return "未知";
  } else {
    return String(n);
  }
}
function vt(t) {
  if (t == null || t === "") {
    return String(I);
  } else {
    return String(tt(t));
  }
}
function kt(t) {
  const n = E(t);
  const i = g.filter(o => n[o] > 0).map(o => `${A[o]}${n[o]}`);
  if (i.length) {
    return i.join(" · ");
  } else {
    return "未触达";
  }
}
const mt = {
  like: "orange",
  reply: "blue",
  follow: "cyan",
  message: "green",
  profileComment: "purple",
  videoComment: "geekblue"
};
function At(t) {
  const n = E(t);
  return g.filter(i => n[i] > 0).map(i => ({
    type: i,
    label: A[i],
    count: n[i],
    color: mt[i]
  }));
}
function Ut(t) {
  var o;
  var e;
  if (!t) {
    return null;
  }
  const n = ((o = t.actions) == null ? undefined : o.dmContent) || t.dmContent;
  if (n) {
    return {
      kind: "message",
      label: "私信",
      text: n
    };
  }
  if (Array.isArray(t.touchLog)) {
    for (const r of t.touchLog) {
      if (r.content && r.type === "message") {
        return {
          kind: "message",
          label: "私信",
          text: r.content
        };
      }
    }
  }
  if (Array.isArray(t.touchLog)) {
    for (const r of t.touchLog) {
      if (r.content && r.type === "profileComment") {
        return {
          kind: "profileComment",
          label: N.profileComment,
          text: r.content
        };
      }
    }
  }
  const i = ((e = t.actions) == null ? undefined : e.replyContent) || t.replyContent;
  if (i && M(t)) {
    return {
      kind: "profileComment",
      label: N.profileComment,
      text: i
    };
  }
  if (i) {
    return {
      kind: "reply",
      label: "回复",
      text: i
    };
  }
  if (Array.isArray(t.touchLog)) {
    for (const r of t.touchLog) {
      if (r.content && r.type === "reply") {
        return {
          kind: r.type,
          label: A[r.type] || r.type,
          text: r.content
        };
      }
    }
  }
  return null;
}
function Tt(t) {
  var i;
  var o;
  if (!t) {
    return 0;
  }
  if (t.lastTouchAt) {
    return Number(t.lastTouchAt);
  }
  if (!Array.isArray(t.touchLog) || !t.touchLog.length) {
    return 0;
  }
  const n = O(t.touchLog);
  return Number(((i = n == null ? undefined : n[0]) == null ? undefined : i.at) || ((o = n == null ? undefined : n[0]) == null ? undefined : o.timestamp) || 0);
}
function P(t) {
  if (!t) {
    return "";
  }
  const n = [t.content, t.comment, t.commentContent, t.userComment, t.commentText];
  for (const i of n) {
    const o = String(i ?? "").trim();
    if (o) {
      return o;
    }
  }
  return "";
}
function gt(t) {
  if (!t) {
    return t;
  }
  const n = P(t);
  if (n) {
    t.content = n;
  }
  return t;
}
function F(t) {
  if (!t || typeof t != "string") {
    return "";
  }
  try {
    let n = t.trim();
    if (n.startsWith("//")) {
      n = `https:${n}`;
    }
    if (!n.startsWith("http")) {
      n = `https://www.douyin.com${n.startsWith("/") ? n : `/${n}`}`;
    }
    const o = new URL(n).pathname.match(/\/user\/([^/?#]+)/i);
    if (o && o[1]) {
      const e = decodeURIComponent(o[1]);
      if (e && !["self", "login"].includes(e.toLowerCase())) {
        return e;
      }
    }
  } catch {}
  return "";
}
function lt(t) {
  return String(t || "").replace(/\s*[·•]\s*(?:IP属地[:：\s]*)?[\u4e00-\u9fffA-Za-z]{2,12}\s*$/i, "").replace(/\s*IP属地[:：\s]*[\u4e00-\u9fffA-Za-z]{2,12}\s*$/i, "").trim();
}
function Nt(t = {}) {
  const n = String(t.timeText || t.time || "").trim();
  const i = String(t.ipLocation || t.location || "").trim();
  const e = lt(n) || n || "未知时间";
  if (!i || i === "未知") {
    return n || e;
  } else {
    return `${e} · ${i}`;
  }
}
function _t(t) {
  if ((t == null ? undefined : t.age) != null && Number.isFinite(Number(t.age))) {
    return `${Number(t.age)}岁`;
  } else {
    return "未知";
  }
}
function It(t) {
  return (t == null ? undefined : t.age) != null && Number.isFinite(Number(t.age));
}
function k(t) {
  const n = String(t || "").trim();
  return n.length >= 15 && !["self", "login", "anonymous", "undefined", "null"].includes(n.toLowerCase()) && !n.startsWith("name:") && !n.startsWith("live_") && /^[A-Za-z0-9_-]+$/.test(n);
}
function pt(t) {
  const n = String(t || "").trim();
  if (/^\d{5,24}$/.test(n) && !/^0+$/.test(n) && n !== "111111") {
    return n;
  } else {
    return "";
  }
}
function H(t) {
  const n = String(t || "").trim();
  if (n.length >= 15 && n !== "111111" && /^[A-Za-z0-9_-]+$/.test(n)) {
    return n;
  } else {
    return "";
  }
}
function L(t) {
  if (!t) {
    return false;
  }
  if (t.leadKind === "video_card" || t.sourceType === "video" || t.identityType === "video") {
    return true;
  }
  const n = String(t.leadId || t.userKey || t.key || "").trim();
  if (/^video:\d{10,}$/.test(n)) {
    return true;
  }
  const i = String(t.userUrl || "").trim();
  return /(?:video|note)\/\d{10,}/i.test(i);
}
function w(t) {
  if (!t) {
    return "";
  }
  const n = [t.videoUrl, L(t) ? t.url : "", t.url];
  for (const i of n) {
    const o = String(i || "").trim();
    if (!o || /\/user\//i.test(o) && !/(?:video|note)\/\d{10,}/i.test(o) && !/modal_id=\d{10,}/i.test(o)) {
      continue;
    }
    const e = o.match(/(?:video|note)\/(\d{10,})/i) || o.match(/modal_id=(\d{10,})/i) || o.match(/aweme_id=(\d{10,})/i);
    if (e != null && e[1]) {
      return `https://www.douyin.com/video/${e[1]}`;
    }
  }
  return "";
}
function _(t) {
  return it(t || {});
}
function $t(t) {
  const n = w(t);
  if (n) {
    return nt(n, _(t));
  } else {
    return "";
  }
}
function at(t) {
  if (!t || L(t)) {
    return false;
  }
  const n = String(t.entrySource || "").trim();
  if (["import", "entity_blogger", "entity_user", "entity_live", "entity_following", "entity_mutual", "entity_video"].includes(n)) {
    return false;
  }
  if (["search", "follow", "recommend", "like", "specific", "entity_comment"].includes(n)) {
    return true;
  }
  const i = String(t.taskId || "");
  if (i === "import_uid" || i.startsWith("import_") || i.startsWith("entity_") && n !== "entity_comment") {
    return false;
  }
  const o = `${t.entryLabel || ""} ${t.taskName || ""}`;
  if (/评论获客|评论区潜客|评论区/.test(o)) {
    return true;
  }
  const e = !!_(t) || !!String(t.content || t.comment || t.commentText || "").trim();
  if (n === "monitor" || i.startsWith("monitor_") || /监控/.test(o)) {
    return e && !!w(t);
  } else if (!n && (t.searchKeyword || t.taskName) && e && w(t)) {
    return true;
  } else {
    return !!_(t) && !!w(t) && !!e;
  }
}
function xt(t) {
  return at(t) && !!w(t);
}
function Et(t = {}, n = []) {
  const i = Array.isArray(n) ? n : [];
  const o = String(t.accountId || t.account_id || "").trim();
  if (o && i.some(r => String(r.id) === o)) {
    return o;
  }
  const e = String(t.accountName || t.account || "").trim().toLowerCase();
  if (e) {
    const r = i.find(f => {
      const u = String(f.nickname || f.name || "").trim().toLowerCase();
      return u && u === e;
    });
    if (r) {
      return String(r.id);
    }
  }
  if (i[0]) {
    return String(i[0].id);
  } else {
    return "";
  }
}
function ht(t) {
  if (!L(t)) {
    return "";
  }
  const n = String(t.leadId || t.userKey || t.key || "").trim();
  if (/^video:\d{10,}$/.test(n)) {
    return n;
  }
  const i = String(t.userUrl || "").match(/(?:video|note)\/(\d{10,})/i);
  if (i != null && i[1]) {
    return `video:${i[1]}`;
  }
  const e = String(t.videoUrl || t.url || t.content || "").trim().match(/(?:video|note)\/(\d{10,})/i);
  if (e != null && e[1]) {
    return `video:${e[1]}`;
  } else {
    return "";
  }
}
function yt(t) {
  if (!t || L(t)) {
    return "";
  }
  const n = String(t.secUid || t.sec_uid || "").trim();
  if (k(n)) {
    return n;
  }
  const i = H(t.webcastUid || t.webcast_uid || t.webcast_uid_str);
  const o = F(t.userUrl || t.authorProfileUrl || "");
  if (i && o && o === i) {
    return "";
  }
  if (t.privacyMasked || t.identityType === "webcast") {
    if (o && o !== i && k(o)) {
      return o;
    } else {
      return "";
    }
  }
  if (o) {
    return o;
  }
  const e = String(t.userKey || "").trim();
  if (k(e)) {
    return e;
  }
  const r = String(t.leadId || t.key || "").trim();
  if (k(r)) {
    return r;
  } else {
    return "";
  }
}
function T(t) {
  if (!t) {
    return "";
  }
  const n = ht(t);
  if (n) {
    return n;
  }
  if (t.leadKind === "video_card" && t.leadId) {
    return String(t.leadId);
  }
  const i = yt(t);
  if (i) {
    return i;
  }
  const o = H(t.webcastUid || t.webcast_uid || t.webcast_uid_str);
  if (o) {
    return `webcast:${o}`;
  }
  const e = pt(t.uid || t.id_str || t.idStr || t.user_id);
  if (e) {
    return `uid:${e}`;
  }
  const r = String(t.userKey || "").trim();
  if (/^uid:\d{5,24}$/.test(r) || /^webcast:[A-Za-z0-9_-]{15,}$/.test(r)) {
    return r;
  }
  const f = String(t.leadId || t.key || "").trim();
  if (/^uid:\d{5,24}$/.test(f) || /^webcast:[A-Za-z0-9_-]{15,}$/.test(f) || /^video:\d{10,}$/.test(f)) {
    return f;
  } else {
    return "";
  }
}
function Pt(t, n) {
  var y;
  var D;
  var z;
  var q;
  var B;
  var j;
  var K;
  var V;
  var Z;
  var G;
  if (!t || !n) {
    return t;
  }
  const i = !L(t);
  const o = T(n);
  const e = T(t);
  const r = i && e && /^video:\d{10,}$/.test(String(o)) ? e : o || e;
  if (r) {
    const c = /^video:\d{10,}$/.test(String(r));
    if (!i || !c) {
      t.leadId = r;
      t.key = r;
    }
  }
  const f = H(n.webcastUid || n.webcast_uid || n.webcast_uid_str);
  if (n.userUrl && !f && !t.userUrl && (!/(?:video|note)\/\d{10,}/i.test(String(n.userUrl)) || L(t))) {
    t.userUrl = n.userUrl;
  }
  if (n.uid) {
    t.uid = String(n.uid);
  }
  if (n.secUid || n.sec_uid) {
    t.secUid = String(n.secUid || n.sec_uid);
  }
  if (f) {
    t.webcastUid = f;
  }
  if (f && !t.secUid) {
    t.userUrl = "";
  }
  if (n.privacyMasked != null) {
    t.privacyMasked = !!n.privacyMasked;
  }
  if (n.identityType) {
    t.identityType = String(n.identityType);
  }
  if (n.profileAvailable != null) {
    t.profileAvailable = !!n.profileAvailable;
  }
  if (n.profileUnavailable != null) {
    t.profileUnavailable = !!n.profileUnavailable;
  }
  if (n.profileUnavailableReason) {
    t.profileUnavailableReason = String(n.profileUnavailableReason);
  }
  if (n.userGone != null) {
    t.userGone = !!n.userGone;
  }
  if (n.liveUrl) {
    t.liveUrl = n.liveUrl;
  }
  if (n.nickname) {
    const c = l => {
      const b = F(l == null ? undefined : l.userUrl);
      if (b) {
        return b;
      }
      const Y = String((l == null ? undefined : l.secUid) || (l == null ? undefined : l.sec_uid) || "").trim();
      if (k(Y)) {
        return Y;
      }
      const J = String((l == null ? undefined : l.leadId) || (l == null ? undefined : l.key) || "").trim();
      if (k(J)) {
        return J;
      } else {
        return "";
      }
    };
    const a = c(n);
    const d = c(t);
    if (t.nickname && d) {
      if (a && a === d) {
        t.nickname = n.nickname;
      }
    } else {
      t.nickname = n.nickname;
    }
  }
  if (n.leadKind === "video_card") {
    if (L(t)) {
      t.leadKind = "video_card";
      t.videoUrl = n.videoUrl || n.url || t.videoUrl;
      t.url = n.videoUrl || n.url || t.url;
      t.title = n.title || t.title;
      t.authorProfileUrl = n.authorProfileUrl || n.userUrl || t.authorProfileUrl;
      if (n.authorProfileUrl || n.userUrl) {
        t.userUrl = n.authorProfileUrl || n.userUrl;
      }
    } else {
      const c = w(n);
      if (c) {
        t.videoUrl = t.videoUrl || c;
      }
      if (n.title && !t.title) {
        t.title = n.title;
      }
      if (n.authorProfileUrl) {
        t.authorProfileUrl = n.authorProfileUrl;
      }
    }
    t.collectedFields = [...new Set([...(Array.isArray(t.collectedFields) ? t.collectedFields : []), ...(Array.isArray(n.collectedFields) ? n.collectedFields : [])])];
  }
  const u = Number(n.timestamp || n.capturedAt || 0);
  const s = Number(t.timestamp || t.capturedAt || 0);
  const m = P(n);
  const h = P(t);
  if (m && (!h || u >= s)) {
    t.content = m;
    t.title = n.title || t.title;
    t.timeText = n.timeText || t.timeText;
    t.ipLocation = n.ipLocation || n.location || t.ipLocation || t.location || "";
    const c = w(n);
    if (c) {
      t.videoUrl = t.videoUrl || c;
    }
    if (w({
      url: n.url,
      videoUrl: ""
    })) {
      t.url = n.url || t.url;
    }
  } else {
    if (!t.timeText && n.timeText) {
      t.timeText = n.timeText;
    }
    if (!t.ipLocation && !t.location && (n.ipLocation || n.location)) {
      t.ipLocation = n.ipLocation || n.location;
    }
  }
  if (n.excludedCommentKeyword && u >= s) {
    t.isHighIntention = false;
    t.excludedCommentKeyword = n.excludedCommentKeyword;
  } else if (n.isHighIntention) {
    t.isHighIntention = true;
  }
  if (n.aiThought) {
    t.aiThought = n.aiThought;
  }
  if (n.gender) {
    t.gender = n.gender;
  }
  if (n.age != null) {
    t.age = n.age;
  }
  if (n.profileAgeChecked) {
    t.profileAgeChecked = true;
  }
  if (n.noWorks || n.skipReason === "作品数为0") {
    t.noWorks = true;
    if (n.skipReason) {
      t.lastBatchSkipReason = n.skipReason;
    }
    et(t);
  }
  if (n.douyinId) {
    t.douyinId = n.douyinId;
  }
  if (n.signature) {
    t.signature = n.signature;
  }
  if (n.contact) {
    t.contact = n.contact;
  }
  const U = _(n);
  const p = _(t);
  if (U && (!p || u >= s)) {
    t.cid = U;
    t.commentId = U;
  }
  if (n.location && n.location !== "未知") {
    t.location = n.location;
    t.ipLocation ||= n.location;
  }
  if (n.worksCount !== undefined && n.worksCount !== null) {
    const c = Number(n.worksCount);
    const a = t.worksCount;
    const d = a != null && Number.isFinite(Number(a)) && Number(a) >= 0;
    if (Number.isFinite(c) && c >= 0) {
      t.worksCount = Math.floor(c);
      if (c === 0) {
        t.noWorks = true;
      }
    } else if (!d) {
      t.worksCount = -1;
    }
  }
  if (n.isPrivate !== undefined) {
    t.isPrivate = !!n.isPrivate;
  }
  const S = c => {
    if (!c || typeof c != "object") {
      return "";
    }
    const a = String(c.messageId || c.msgId || "").trim();
    if (a) {
      return `id:${a}`;
    } else {
      return [c.method || c.type || "", c.occurredAt || c.observedAt || "", c.content || c.text || ""].join("|");
    }
  };
  const v = [...(Array.isArray(t.liveEvents) ? t.liveEvents : []), ...(t.liveEvent ? [t.liveEvent] : []), ...(Array.isArray(n.liveEvents) ? n.liveEvents : []), ...(n.liveEvent ? [n.liveEvent] : [])];
  if (v.length) {
    const c = new Map();
    v.forEach(l => {
      const b = S(l);
      if (b && !c.has(b)) {
        c.set(b, l);
      }
    });
    t.liveEvents = [...c.values()].sort((l, b) => Number(l.occurredAt || l.observedAt || 0) - Number(b.occurredAt || b.observedAt || 0)).slice(-500);
    t.liveEvent = t.liveEvents[t.liveEvents.length - 1] || n.liveEvent || t.liveEvent;
    t.messageId = String(((y = t.liveEvent) == null ? undefined : y.messageId) || n.messageId || t.messageId || "");
    const a = Number(((D = t.liveEvents[0]) == null ? undefined : D.occurredAt) || ((z = t.liveEvents[0]) == null ? undefined : z.observedAt) || 0);
    const d = Number(((q = t.liveEvent) == null ? undefined : q.occurredAt) || ((B = t.liveEvent) == null ? undefined : B.observedAt) || 0);
    if (a > 0) {
      t.firstSeenAt = t.firstSeenAt ? Math.min(Number(t.firstSeenAt), a) : a;
    }
    if (d > 0) {
      t.lastSeenAt = Math.max(Number(t.lastSeenAt || 0), d);
    }
    if ((j = t.liveEvent) != null && j.content) {
      t.content = t.liveEvent.content;
    }
  }
  if (u >= s) {
    t.timestamp = u || t.timestamp;
    t.capturedAt = n.capturedAt || t.capturedAt;
  }
  if (Array.isArray(n.touchLog) && n.touchLog.length) {
    t.touchLog = ct(t.touchLog, n.touchLog);
    R(t);
    t.touchCounts = $(t);
  } else if (n.touchCounts) {
    t.touchCounts = t.touchCounts || {};
    Object.keys(n.touchCounts).forEach(c => {
      t.touchCounts[c] = Math.max(t.touchCounts[c] || 0, n.touchCounts[c] || 0);
    });
    t.touchCounts = $(t);
  }
  if (n.profileCommentAt) {
    t.profileCommentAt = Number(n.profileCommentAt);
  }
  if (n.lastTouchAt) {
    t.lastTouchAt = Math.max(Number(t.lastTouchAt || 0), Number(n.lastTouchAt || 0));
  }
  if (n.liked || (K = n.actions) != null && K.liked) {
    t.liked = true;
  }
  if (n.replied || (V = n.actions) != null && V.replied) {
    t.replied = true;
  }
  if (n.followed || (Z = n.actions) != null && Z.followed) {
    t.followed = true;
  }
  if (n.followStatus) {
    t.followStatus = n.followStatus;
  }
  if (n.followRequested !== undefined) {
    t.followRequested = !!n.followRequested;
  }
  if (n.followRequestSent !== undefined) {
    t.followRequestSent = !!n.followRequestSent;
  }
  if (n.followIsPrivate !== undefined) {
    t.followIsPrivate = !!n.followIsPrivate;
  }
  if (n.followError) {
    t.followError = n.followError;
  }
  if (n.messaged || (G = n.actions) != null && G.messaged) {
    t.messaged = true;
  }
  if (n.dmContent) {
    t.dmContent = n.dmContent;
    t.actions = {
      ...(t.actions || {}),
      dmContent: n.dmContent
    };
  }
  if (n.replyContent) {
    t.replyContent = n.replyContent;
    t.actions = {
      ...(t.actions || {}),
      replyContent: n.replyContent
    };
  }
  if (n.actions) {
    t.actions = {
      ...(t.actions || {}),
      ...n.actions
    };
  }
  if (n.accountName) {
    const c = String(n.accountName || "").trim();
    const a = new Set(["主账号", "默认账号", "本账号", "未知账号", "已登录(待识别)"]);
    const d = String(t.accountName || "").trim();
    if (c && (!a.has(c) || !d || !!a.has(d))) {
      t.accountName = n.accountName;
    }
  }
  if (n.accountId) {
    t.accountId = n.accountId;
  }
  return t;
}
function Mt(t, n) {
  const i = Array.isArray(t) ? t : [];
  if (!i.length) {
    return null;
  }
  if (typeof n == "string") {
    const u = n.trim();
    return u && i.find(s => T(s) === u || String((s == null ? undefined : s.leadId) || "") === u || String((s == null ? undefined : s.key) || "") === u) || null;
  }
  const o = T(n);
  if (o) {
    const u = i.find(s => T(s) === o || String((s == null ? undefined : s.leadId) || "") === o || String((s == null ? undefined : s.key) || "") === o);
    if (u) {
      return u;
    }
  }
  const e = String((n == null ? undefined : n.leadId) || (n == null ? undefined : n.key) || "").trim();
  if (e) {
    const u = i.find(s => String((s == null ? undefined : s.leadId) || "") === e || String((s == null ? undefined : s.key) || "") === e);
    if (u) {
      return u;
    }
  }
  const r = String((n == null ? undefined : n.nickname) || "").trim();
  const f = String((n == null ? undefined : n.content) || (n == null ? undefined : n.comment) || "").trim();
  if (r && f) {
    const u = i.find(s => String((s == null ? undefined : s.nickname) || "").trim() === r && String((s == null ? undefined : s.content) || (s == null ? undefined : s.comment) || "").trim() === f);
    if (u) {
      return u;
    }
  }
  if (r && o) {
    const u = i.find(s => {
      if (L(s) || String((s == null ? undefined : s.nickname) || "").trim() !== r || String((s == null ? undefined : s.content) || (s == null ? undefined : s.comment) || "").trim()) {
        return false;
      }
      const h = T(s);
      return !h || h === o || h === r || h === `${r}_`;
    });
    if (u) {
      return u;
    }
  }
  return null;
}
function Wt(t = {}) {
  const n = String(t.userUrl || t.profileUrl || "").trim();
  if (n && !/(?:video|note)\/\d{10,}/i.test(n)) {
    try {
      const e = new URL(n.startsWith("http") ? n : `https://www.douyin.com${n.startsWith("/") ? n : `/${n}`}`);
      if (/\/user\//i.test(e.pathname)) {
        return `${e.origin}${e.pathname}`.replace(/\/$/, "");
      }
    } catch {}
  }
  const i = F(n);
  const o = [t.secUid, t.sec_uid, i, t.leadId, t.lead_user_id, t.key].map(e => String(e || "").trim()).filter(Boolean);
  for (const e of o) {
    if (k(e)) {
      return `https://www.douyin.com/user/${e}`;
    }
  }
  return "";
}
export { wt as A, kt as B, Ut as C, xt as D, bt as E, At as F, $t as G, Et as H, _ as I, A as J, mt as T, ct as a, St as b, et as c, ot as d, Ct as e, Mt as f, T as g, Tt as h, gt as i, Q as j, M as k, Lt as l, Pt as m, $ as n, O as o, Wt as p, tt as q, st as r, R as s, w as t, vt as u, lt as v, P as w, It as x, _t as y, Nt as z };
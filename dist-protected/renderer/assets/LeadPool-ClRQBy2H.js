import { cw as Bt, cy as _t, cz as Kt, z as ia, S as Vt, x as kt, cC as x, A as E, cW as ua, o as he, cX as ra, cx as St, y as Ve, cD as J, cE as i, cL as W, cM as r, cH as n, i as u, bF as b, cK as p, cF as w, cN as ot, cG as H, cY as ca, aO as ve, cI as mt, cJ as nn, aZ as P, cZ as Pt, cP as da, cR as ma, p as zn, c_ as fa, v as Nn, c$ as Un, M as pa, cV as We, d0 as va, d1 as ga, d2 as ya, cQ as ha, d3 as qt, d4 as vn, d5 as ka, ak as gn } from "./index-BegIKaMc.js";
import { f as Qt, g as Dt, m as yn, c as Yt, a as hn, s as kn, l as ba, b as Ut, d as Nt, e as Ca, r as Gt, h as Et, i as wa, j as _a, k as en, n as bn, o as Sa, p as Jt, q as xa, t as $a, u as Aa, v as Ia, w as dt, x as Ta, y as za, z as Na, A as Ua, B as Pa, C as Tt, D as Cn, E as Fa, F as wn, G as _n, H as Sn, I as Zt } from "./leadUserKey-Cwtp1anZ.js";
import { c as Ma, f as tn, g as La, L as Ra, r as Da } from "./LeadDetailModal-ZrEV8Kly.js";
import { L as ct, c as Oa, a as Ea, b as Ba } from "./detailTablePagination-CDmOQQdi.js";
import { C as Ka } from "./check-4b-UMdrY.js";
import { S as Va } from "./settings-2-vyTiLluG.js";
import { C as Pn } from "./chevron-down-hzMBKbmO.js";
import { u as Ha } from "./useCollectedLibrary-BbdAnAv0.js";
import { Z as Wa } from "./zap-BwUCNpS-.js";
import { H as ja } from "./heart-Ccyj7Sl9.js"; /**
                                               * @license lucide-vue-next v0.395.0 - ISC
                                               *
                                               * This source code is licensed under the ISC license.
                                               * See the LICENSE file in the root directory of this source tree.
                                               */
const qa = Bt("BarChart3Icon", [["path", {
  d: "M3 3v18h18",
  key: "1s2lah"
}], ["path", {
  d: "M18 17V9",
  key: "2bz60n"
}], ["path", {
  d: "M13 17V5",
  key: "1frdt8"
}], ["path", {
  d: "M8 17v-3",
  key: "17ska0"
}]]); /**
      * @license lucide-vue-next v0.395.0 - ISC
      *
      * This source code is licensed under the ISC license.
      * See the LICENSE file in the root directory of this source tree.
      */
const Ya = Bt("ChevronUpIcon", [["path", {
  d: "m18 15-6-6-6 6",
  key: "153udz"
}]]); /**
      * @license lucide-vue-next v0.395.0 - ISC
      *
      * This source code is licensed under the ISC license.
      * See the LICENSE file in the root directory of this source tree.
      */
const Ga = Bt("PieChartIcon", [["path", {
  d: "M21.21 15.89A10 10 0 1 1 8 2.83",
  key: "k2fpak"
}], ["path", {
  d: "M22 12A10 10 0 0 0 12 2v10z",
  key: "1rfc4y"
}]]); /**
      * @license lucide-vue-next v0.395.0 - ISC
      *
      * This source code is licensed under the ISC license.
      * See the LICENSE file in the root directory of this source tree.
      */
const Ja = Bt("SendIcon", [["path", {
  d: "m22 2-7 20-4-9-9-4Z",
  key: "1q3vgg"
}], ["path", {
  d: "M22 2 11 13",
  key: "nzbqef"
}]]);
function Za() {
  const {
    on: C,
    invoke: l
  } = _t();
  const h = Kt();
  const m = E([]);
  const A = Ma(l);
  let $ = 0;
  const z = kt({
    keyword: "",
    timeRange: null,
    account: [],
    intention: null,
    batchFollowStatus: null,
    touchTypes: [],
    entrySource: [],
    searchKeyword: "",
    minTouchTotal: null,
    locations: [],
    accountFlags: [],
    captureTimeRange: null
  });
  const k = kt({
    likes: 0,
    replies: 0,
    messages: 0,
    follows: 0,
    accounts: {},
    dailyStats: {}
  });
  function s(o) {
    var y;
    var U;
    if (!o) {
      return o;
    }
    wa(o);
    _a(o);
    if ((y = o.actions) != null && y.profileWorkCommented && !en(o)) {
      Yt(o);
    }
    o.touchCounts = bn(o);
    const d = Dt(o);
    if (d) {
      o.leadId = d;
      o.key = d;
    }
    o.key = o.key || o.leadId;
    const c = Number(o.timestamp);
    const M = Number.isFinite(c) && c > 0;
    const j = Date.parse(o.capturedAt || "");
    if (!M && Number.isFinite(j) && j > 0) {
      o.timestamp = j;
    } else if (M && !o.capturedAt) {
      o.capturedAt = new Date(c).toISOString();
    }
    o.liked = !!o.liked || o.touchCounts.like > 0;
    o.replied = !!o.replied || o.touchCounts.reply > 0 || o.touchCounts.profileComment > 0;
    o.followed = !!o.followed || o.touchCounts.follow > 0;
    o.messaged = !!o.messaged || o.touchCounts.message > 0;
    if ((U = o.touchLog) != null && U.length && (o.touchLog = Sa(o.touchLog), kn(o), o.lastTouchAt = Et(o), !o.profileCommentAt)) {
      const F = o.touchLog.find(ae => ae.type === "profileComment");
      if (F != null && F.at) {
        o.profileCommentAt = Number(F.at);
      }
    }
    return o;
  }
  function D(o, d) {
    if (k[o] !== undefined) {
      k[o]++;
    }
    const c = d || "未知账号";
    k.accounts[c] ||= {
      likes: 0,
      replies: 0,
      messages: 0,
      follows: 0
    };
    if (k.accounts[c][o] !== undefined) {
      k.accounts[c][o]++;
    }
    const M = new Date().toLocaleDateString("zh-CN").replace(/\//g, "-");
    k.dailyStats[M] ||= {
      likes: 0,
      replies: 0,
      messages: 0,
      follows: 0,
      accounts: {}
    };
    const j = k.dailyStats[M];
    if (j[o] !== undefined) {
      j[o]++;
    }
    j.accounts[c] ||= {
      likes: 0,
      replies: 0,
      messages: 0,
      follows: 0
    };
    if (j.accounts[c][o] !== undefined) {
      j.accounts[c][o]++;
    }
  }
  function ce() {
    localStorage.setItem("captured_leads", JSON.stringify(m.value));
    localStorage.setItem("cumulative_stats", JSON.stringify(k));
  }
  function se() {
    if ($) {
      clearTimeout($);
    }
    $ = setTimeout(() => {
      $ = 0;
      ce();
    }, 160);
  }
  ia(() => {
    if ($) {
      clearTimeout($);
      $ = 0;
      ce();
    }
  });
  function L(o, d) {
    var ue;
    var fe;
    var Te;
    var ze;
    if (!o || !d) {
      return;
    }
    const c = d.interactionResults || {};
    const M = c.skipReason === "作品数为0" || !!c.noWorks && (d.type === "profile_first_comment" || !!String(d.error || "").includes("作品数为0"));
    const j = "用户不存在（可能已注销）";
    const y = !!c.userGone || !!c.profileUnavailable || c.errorCode === "USER_NOT_FOUND" || !!/USER_NOT_FOUND/i.test(String(d.error || "")) || !!String(d.error || "").includes("用户不存在") || !!String(d.skipReason || "").includes("用户不存在") || !!String(c.skipReason || "").includes("用户不存在") || !!String(c.profileUnavailableReason || "").includes("用户不存在");
    if (c.worksCount !== undefined && c.worksCount !== null) {
      o.worksCount = c.worksCount;
      if (Number(c.worksCount) === 0) {
        o.noWorks = true;
      }
    }
    if (c.noWorks) {
      o.noWorks = true;
    }
    if (c.isPrivate !== undefined) {
      o.isPrivate = !!c.isPrivate;
    }
    if (c.skipReason === "私密账号" || d.skipReason === "私密账号" || String(d.error || "").includes("私密账号")) {
      o.isPrivate = true;
    }
    if (y) {
      o.userGone = true;
      o.profileUnavailable = true;
      o.profileUnavailableReason = c.profileUnavailableReason || d.skipReason || c.skipReason || j;
      o.lastBatchSkipReason = o.profileUnavailableReason;
      o.lastError = o.profileUnavailableReason;
      o.batchStatus = "failed";
      s(o);
      A(o);
      return;
    }
    o.batchStatus = d.success && !M ? "success" : "failed";
    o.lastError = M ? c.skipReason || "作品数为0" : d.error || (o.isPrivate && !d.success ? "私密账号" : d.error);
    if (c.skipReason) {
      o.lastBatchSkipReason = c.skipReason;
    } else if (String(d.error || "").includes("私密账号")) {
      o.lastBatchSkipReason = "私密账号";
    }
    if (c.gender) {
      o.gender = c.gender;
    }
    if (c.age != null) {
      o.age = c.age;
    }
    if (c.profileAgeChecked) {
      o.profileAgeChecked = true;
    }
    if (c.location) {
      o.location = c.location;
    }
    if (c.douyinId) {
      o.douyinId = c.douyinId;
    }
    if (c.signature) {
      o.signature = c.signature;
    }
    if (c.contact) {
      o.contact = c.contact;
    }
    if (c.dmContent) {
      o.dmContent = c.dmContent;
    }
    if (c.replyContent && c.profileCommented) {
      o.replyContent = c.replyContent;
    }
    if (c.profileCommentAt) {
      o.profileCommentAt = Number(c.profileCommentAt);
    }
    if (c.lastTouchAt) {
      o.lastTouchAt = Math.max(Number(o.lastTouchAt || 0), Number(c.lastTouchAt || 0));
    }
    if (M) {
      Yt(o);
      o.noWorks = true;
      s(o);
      A(o);
      return;
    }
    const U = d.skipped || c.skipped;
    if (!!o.isPrivate && !d.success && (!!String(d.error || "").includes("私密账号") || c.skipReason === "私密账号") || U && c.skipReason === "私密账号") {
      s(o);
      A(o);
      return;
    }
    const ae = !!c.followed;
    const be = !!c.messaged;
    const ge = !!c.profileCommented;
    if (!d.success && !U && !ae && !be && !ge) {
      if (o.isPrivate || o.noWorks || o.worksCount != null) {
        s(o);
        A(o);
      }
      return;
    }
    const ie = Nt(o.touchCounts);
    if (c.touchCounts) {
      o.touchCounts = {
        ...(o.touchCounts || {}),
        ...c.touchCounts
      };
      if ((ue = c.touchLog) != null && ue.length) {
        o.touchLog = hn(o.touchLog, c.touchLog);
      }
    }
    if (ae && !(((fe = o.touchCounts) == null ? undefined : fe.follow) > 0)) {
      Gt(o, {
        type: "follow",
        accountName: d.accountName,
        source: "batch"
      });
    }
    if (be && !(((Te = o.touchCounts) == null ? undefined : Te.message) > 0)) {
      Gt(o, {
        type: "message",
        content: c.dmContent || d.dmContent || o.dmContent || "",
        accountName: d.accountName,
        source: "batch"
      });
    }
    if (ge && !(((ze = o.touchCounts) == null ? undefined : ze.profileComment) > 0)) {
      Gt(o, {
        type: "profileComment",
        content: c.replyContent || "",
        accountName: d.accountName,
        source: "batch"
      });
    }
    if (ae) {
      o.followed = true;
      o.actions = {
        ...(o.actions || {}),
        followed: true
      };
    }
    if (be) {
      o.messaged = true;
      o.actions = {
        ...(o.actions || {}),
        messaged: true
      };
      if (c.dmContent) {
        o.actions.dmContent = c.dmContent;
      }
    }
    s(o);
    if (!o.profileCommentAt) {
      const f = (o.touchLog || []).find(v => v.type === "profileComment");
      if (f != null && f.at) {
        o.profileCommentAt = Number(f.at);
      }
    }
    o.lastTouchAt ||= Et(o);
    if (!U) {
      if (Nt(o.touchCounts) - ie > 0) {
        if (ae) {
          D("follows", o.accountName || d.accountName);
        }
        if (be) {
          D("messages", o.accountName || d.accountName);
        }
        if (ge) {
          D("replies", o.accountName || d.accountName);
        }
      }
    }
    A(o);
  }
  function Q() {
    if (localStorage.getItem("interaction_history_migrated_v2")) {
      return;
    }
    const o = localStorage.getItem("interaction_history");
    if (!o) {
      localStorage.setItem("interaction_history_migrated_v2", "1");
      return;
    }
    try {
      const d = JSON.parse(o);
      if (!Array.isArray(d) || d.length === 0) {
        localStorage.setItem("interaction_history_migrated_v2", "1");
        localStorage.removeItem("interaction_history");
        return;
      }
      const c = Ca(m.value, d);
      d.forEach(M => {
        const j = m.value.find(y => y.leadId === M.leadId);
        if (j) {
          A(j);
        }
      });
      localStorage.removeItem("interaction_history");
      localStorage.setItem("interaction_history_migrated_v2", "1");
      if (c.length < d.length) {
        x.info(`已将 ${d.length - c.length} 条历史跟进记录合并到线索触达详情`);
      }
    } catch (d) {
      console.warn("[useLeads] interaction_history 迁移失败", d);
    }
  }
  function we(o) {
    return String((o == null ? undefined : o.ipLocation) || (o == null ? undefined : o.location) || "").trim();
  }
  const ne = E(0);
  const xe = E(false);
  const q = E("unknown");
  const Y = E({
    total: 0,
    likes: 0,
    replies: 0,
    messages: 0,
    follows: 0,
    touched: 0,
    untouched: 0,
    profileComments: 0
  });
  const Ue = E([]);
  const G = kt({
    accounts: [],
    keywords: [],
    locations: []
  });
  let $e = 0;
  let ke = 0;
  let Re = 0;
  let je = "";
  let O = "";
  function R() {
    return {
      total: 0,
      likes: 0,
      replies: 0,
      messages: 0,
      follows: 0,
      touched: 0,
      untouched: 0,
      profileComments: 0
    };
  }
  function de(o) {
    try {
      return JSON.stringify(o || {});
    } catch {
      return "";
    }
  }
  function pe() {
    je = "";
    O = "";
    Re += 1;
  }
  async function _e(o, {
    force: d = false
  } = {}) {
    var y;
    const c = o || De();
    const M = de(c);
    if (!d && M && (M === je || M === O)) {
      return;
    }
    const j = ++Re;
    O = M;
    try {
      const U = await l("get-leads-pool-stats", {
        filters: c
      });
      if (j !== Re || (U == null ? undefined : U.runtime) === "enc") {
        return;
      }
      Y.value = {
        ...R(),
        ...(U != null && U.stats && typeof U.stats == "object" ? U.stats : {})
      };
      Ue.value = Array.isArray(U == null ? undefined : U.accountStats) ? U.accountStats : [];
      if (Number.isFinite(Number((y = U == null ? undefined : U.stats) == null ? undefined : y.total))) {
        ne.value = Number(U.stats.total) || 0;
      }
      je = M;
    } catch (U) {
      console.error("[useLeads] loadLeadPoolStats failed:", U);
    } finally {
      if (j === Re && O === M) {
        O = "";
      }
    }
  }
  function De() {
    const o = Array.isArray(z.account) ? [...z.account] : [];
    return {
      keyword: z.keyword || "",
      searchKeyword: z.searchKeyword || "",
      intention: z.intention || null,
      batchFollowStatus: z.batchFollowStatus || null,
      touchTypes: Array.isArray(z.touchTypes) ? [...z.touchTypes] : [],
      entrySource: Array.isArray(z.entrySource) ? [...z.entrySource] : [],
      account: ua(o, He.value),
      timeRange: z.timeRange || null,
      captureTimeRange: z.captureTimeRange || null,
      locations: Array.isArray(z.locations) ? [...z.locations] : [],
      minTouchTotal: z.minTouchTotal,
      accountFlags: Array.isArray(z.accountFlags) ? [...z.accountFlags] : [],
      excludeVideoCards: true
    };
  }
  async function I({
    current: o = 1,
    pageSize: d = ct,
    silent: c = false,
    refreshStats: M = false
  } = {}) {
    const j = ++ke;
    if (!c) {
      xe.value = true;
    }
    try {
      const y = De();
      const U = await l("get-leads-page", {
        page: o,
        pageSize: d,
        filters: y
      });
      if (j !== ke) {
        return {
          items: [],
          total: ne.value
        };
      }
      if ((U == null ? undefined : U.runtime) === "enc") {
        await Pe({
          current: o,
          pageSize: d
        });
        return {
          items: m.value,
          total: ne.value
        };
      }
      const F = Array.isArray(U == null ? undefined : U.items) ? U.items.map(ae => s({
        ...ae
      })) : [];
      m.value = F;
      ne.value = Number(U == null ? undefined : U.total) || 0;
      q.value = (U == null ? undefined : U.runtime) || "sqlite";
      setTimeout(() => {
        _e(y, {
          force: M
        });
      }, 0);
      return {
        items: F,
        total: ne.value
      };
    } catch (y) {
      console.error("[useLeads] loadLeadsPage failed:", y);
      if (!c) {
        await Pe({
          current: o,
          pageSize: d
        });
      }
      return {
        items: m.value,
        total: ne.value
      };
    } finally {
      if (j === ke) {
        xe.value = false;
      }
    }
  }
  async function a() {
    try {
      const o = await l("get-leads-filter-options");
      G.accounts = Array.isArray(o == null ? undefined : o.accounts) ? o.accounts : [];
      G.keywords = Array.isArray(o == null ? undefined : o.keywords) ? o.keywords : [];
      G.locations = Array.isArray(o == null ? undefined : o.locations) ? o.locations : [];
    } catch {}
  }
  function V(o = {}) {
    if ($e) {
      clearTimeout($e);
    }
    $e = setTimeout(() => {
      $e = 0;
      I(o);
    }, 180);
  }
  async function Ae() {
    const o = I({
      current: 1,
      pageSize: ct,
      refreshStats: true
    });
    await Promise.all([a(), o]);
    return o;
  }
  async function Pe({
    current: o = 1,
    pageSize: d = ct
  } = {}) {
    const c = await l("get-history");
    const M = new Map();
    const j = [];
    if (c && c.length > 0) {
      c.forEach(ie => {
        if (ie.items) {
          ie.items.forEach(ue => {
            const fe = s({
              key: ue.leadId || ue.key,
              ...ue,
              taskId: ie.taskId,
              taskName: ue.taskName || ie.taskName
            });
            if (fe.leadKind === "video_card") {
              return;
            }
            const Te = Dt(fe);
            if (!Te) {
              j.push(fe);
              return;
            }
            const ze = M.get(Te);
            if (ze) {
              yn(ze, fe);
              s(ze);
            } else {
              M.set(Te, fe);
            }
          });
        }
      });
    }
    const y = [...M.values(), ...j].sort((ie, ue) => (ue.timestamp || 0) - (ie.timestamp || 0));
    const U = Math.max(1, Number(d) || ct);
    const ae = (Math.max(1, Number(o) || 1) - 1) * U;
    m.value = y.slice(ae, ae + U);
    ne.value = y.length;
    q.value = "enc";
    const be = R();
    const ge = {};
    for (const ie of y) {
      const ue = bn(ie);
      const fe = ue.like > 0 || !!ie.liked;
      const Te = ue.reply > 0 || !!ie.replied;
      const ze = ue.message > 0 || !!ie.messaged;
      const f = ue.follow > 0 || !!ie.followed;
      const v = ue.profileComment > 0 || en(ie);
      const K = Nt(ue) > 0 || fe || Te || f || ze || v;
      be.total += 1;
      if (fe) {
        be.likes += 1;
      }
      if (Te) {
        be.replies += 1;
      }
      if (ze) {
        be.messages += 1;
      }
      if (f) {
        be.follows += 1;
      }
      if (v) {
        be.profileComments += 1;
      }
      if (K) {
        be.touched += 1;
      } else {
        be.untouched += 1;
      }
      const B = ie.accountName || "未知账号";
      ge[B] ||= {
        name: B,
        total: 0,
        likes: 0,
        replies: 0,
        messages: 0,
        follows: 0
      };
      ge[B].total += 1;
      if (fe) {
        ge[B].likes += 1;
      }
      if (Te) {
        ge[B].replies += 1;
      }
      if (ze) {
        ge[B].messages += 1;
      }
      if (f) {
        ge[B].follows += 1;
      }
    }
    Y.value = be;
    Ue.value = Object.values(ge).sort((ie, ue) => ue.total - ie.total);
  }
  const Ee = he(() => m.value.filter(o => o.leadKind !== "video_card"));
  const Z = he(() => {
    if (G.keywords.length) {
      return [...G.keywords];
    }
    const o = new Set();
    m.value.forEach(d => {
      if (d.searchKeyword) {
        o.add(d.searchKeyword);
      }
    });
    return [...o];
  });
  const qe = he(() => {
    if (G.locations.length) {
      return [...G.locations].sort((d, c) => d.localeCompare(c, "zh-CN"));
    }
    const o = new Set();
    m.value.forEach(d => {
      const c = we(d);
      if (c && c !== "未知") {
        o.add(c);
      }
    });
    return [...o].sort((d, c) => d.localeCompare(c, "zh-CN"));
  });
  const He = he(() => {
    const o = G.accounts.length ? G.accounts.map(d => typeof d == "string" ? {
      accountName: d
    } : {
      accountId: (d == null ? undefined : d.accountId) || (d == null ? undefined : d.id) || "",
      accountName: (d == null ? undefined : d.accountName) || (d == null ? undefined : d.name) || ""
    }) : m.value.filter(d => d.accountId || d.accountName).map(d => ({
      accountId: d.accountId || "",
      accountName: d.accountName || ""
    }));
    return ra(o, h.accounts);
  });
  Vt(async () => {
    await Ae();
    const o = localStorage.getItem("cumulative_stats");
    if (o) {
      try {
        Object.assign(k, JSON.parse(o));
      } catch {}
    }
    Q();
    C("batch-item-start", ({
      leadId: d,
      type: c
    }) => {
      const M = m.value.find(j => j.leadId === d);
      if (M) {
        M.batchStatus = "executing";
        M.currentActionType = c;
      }
    });
    C("batch-item-result", d => {
      const c = Qt(m.value, d) || m.value.find(M => M.leadId === d.leadId || d.leadName && M.nickname === d.leadName && (!d.leadPlatform || String(M.platform || "").toLowerCase() === String(d.leadPlatform || "").toLowerCase() || ["dy", "douyin"].includes(String(M.platform || "").toLowerCase()) && ["dy", "douyin"].includes(String(d.leadPlatform || "").toLowerCase())));
      if (c) {
        L(c, d);
        pe();
      }
      se();
    });
    C("automation-data", d => {
      if (d.type === "comment") {
        const c = (Array.isArray(d.payload) ? d.payload : [d.payload]).filter(Boolean);
        const M = Array.isArray(d.payload);
        let j = false;
        c.forEach(y => {
          var be;
          var ge;
          var ie;
          var ue;
          var fe;
          var Te;
          var ze;
          var f;
          var v;
          var K;
          var B;
          var X;
          if (y.leadKind === "video_card" || y.leadKind === "collected_author" || y.leadKind === "collected_video" || /^author:/.test(String(y.leadId || y.key || ""))) {
            return;
          }
          const U = Dt(y) || y.leadId;
          if (U) {
            y.leadId = U;
            y.key = U;
          }
          const F = Qt(m.value, y) || m.value.find(re => re.leadId === y.leadId);
          const ae = y.accountName || "未知账号";
          if (F) {
            yn(F, y);
            s(F);
            if (y.noWorks || y.skipReason === "作品数为0") {
              Yt(F);
              F.noWorks = true;
              F.lastBatchSkipReason = y.skipReason || "作品数为0";
            }
            if (y.excludedCommentKeyword) {
              F.isHighIntention = false;
              F.excludedCommentKeyword = y.excludedCommentKeyword;
            } else if (y.isHighIntention !== undefined) {
              F.isHighIntention = F.isHighIntention || y.isHighIntention;
            }
            if (y.aiThought) {
              F.aiThought = y.aiThought;
              F.thought = y.aiThought;
            } else if (y.thought && y.thought !== "未匹配到设置的关键词") {
              F.aiThought = y.aiThought || y.thought;
            }
            if (y.actionSkipReason) {
              F.actionSkipReason = y.actionSkipReason;
            }
            if (y.interactionResolved) {
              F.interactionResolved = true;
            }
            if (y.douyinId) {
              F.douyinId = y.douyinId;
            }
            if (y.signature) {
              F.signature = y.signature;
            }
            if (y.contact) {
              F.contact = y.contact;
            }
            if (y.gender) {
              F.gender = y.gender;
            }
            if (y.age != null) {
              F.age = y.age;
            }
            if (y.profileAgeChecked) {
              F.profileAgeChecked = true;
            }
            if (y.location && y.location !== "未知") {
              F.location = y.location;
            }
            if (y.isPrivate !== undefined) {
              F.isPrivate = y.isPrivate;
            }
            if (y.entrySource) {
              F.entrySource = y.entrySource;
            }
            if (y.entryLabel) {
              F.entryLabel = y.entryLabel;
            }
            if (y.searchKeyword !== undefined) {
              F.searchKeyword = y.searchKeyword;
            }
            if (y.worksCount !== undefined && y.worksCount !== null) {
              F.worksCount = y.worksCount;
            }
            if (y.profileCommentAt) {
              F.profileCommentAt = Number(y.profileCommentAt);
            }
            if (y.lastTouchAt) {
              F.lastTouchAt = Number(y.lastTouchAt);
            }
            if ((Te = y.actions) != null && Te.replyContent) {
              F.replyContent = y.actions.replyContent;
            }
            if ((ze = y.actions) != null && ze.dmContent) {
              F.dmContent = y.actions.dmContent;
            }
            if ((f = y.actions) != null && f.selfLiked) {
              F.selfLiked = true;
            }
            if (Array.isArray(y.touchLog) && y.touchLog.length) {
              F.touchLog = hn(F.touchLog, y.touchLog);
              kn(F);
            } else if (y.touchCounts) {
              Object.keys(y.touchCounts).forEach(it => {
                const xt = F.touchCounts[it] || 0;
                const Me = y.touchCounts[it] || 0;
                if (Me > xt) {
                  F.touchCounts[it] = Me;
                }
              });
            }
            const re = F.touchCounts.like;
            const Ce = F.touchCounts.reply;
            const Ye = F.touchCounts.follow;
            const ft = F.touchCounts.message;
            if (!F.liked && (v = y.actions) != null && v.liked) {
              F.liked = true;
              D("likes", ae);
            }
            if (!F.replied && (K = y.actions) != null && K.replied) {
              F.replied = true;
              D("replies", ae);
            }
            if (!F.followed && (B = y.actions) != null && B.followed) {
              F.followed = true;
              D("follows", ae);
            }
            if (!F.messaged && (X = y.actions) != null && X.messaged) {
              F.messaged = true;
              D("messages", ae);
            }
            s(F);
            if (F.touchCounts.like > re) {
              D("likes", ae);
            }
            if (F.touchCounts.reply > Ce || F.touchCounts.profileComment > 0) {
              D("replies", ae);
            }
            if (F.touchCounts.follow > Ye) {
              D("follows", ae);
            }
            if (F.touchCounts.message > ft) {
              D("messages", ae);
            }
            if (!M) {
              A(F);
            }
            j = true;
          } else {
            const re = s({
              key: y.leadId,
              ...y,
              liked: ((be = y.actions) == null ? undefined : be.liked) || y.liked || false,
              replied: ((ge = y.actions) == null ? undefined : ge.replied) || y.replied || false,
              followed: ((ie = y.actions) == null ? undefined : ie.followed) || y.followed || false,
              messaged: ((ue = y.actions) == null ? undefined : ue.messaged) || y.messaged || false,
              selfLiked: ((fe = y.actions) == null ? undefined : fe.selfLiked) || false,
              capturedAt: Date.now()
            });
            m.value.unshift(re);
            if (m.value.length > 1000) {
              m.value.pop();
            }
            ne.value += 1;
            if (re.touchCounts.like > 0 || re.liked) {
              D("likes", ae);
            }
            if (re.touchCounts.reply > 0 || re.replied) {
              D("replies", ae);
            }
            if (re.touchCounts.follow > 0 || re.followed) {
              D("follows", ae);
            }
            if (re.touchCounts.message > 0 || re.messaged) {
              D("messages", ae);
            }
            j = true;
          }
        });
        if (j) {
          pe();
          se();
        }
      }
    });
  });
  function Ie(o, d) {
    if (!o || o.length === 0) {
      return x.warn("暂无数据可导出");
    }
    const c = Object.keys(o[0]);
    const M = ge => ge == null ? "\"\"" : `"${String(ge).replace(/"/g, "\"\"")}"`;
    const j = o.map(ge => c.map(ie => M(ge[ie])).join(","));
    const y = [c.map(M).join(","), ...j].join(`
`);
    const U = new Blob(["﻿" + y], {
      type: "text/csv;charset=utf-8;"
    });
    const F = URL.createObjectURL(U);
    const ae = document.createElement("a");
    const be = Date.now();
    ae.href = F;
    ae.setAttribute("download", `${d}_${be}.csv`);
    ae.click();
  }
  function Se() {
    k.likes = 0;
    k.replies = 0;
    k.messages = 0;
    k.follows = 0;
    k.accounts = {};
    k.dailyStats = {};
  }
  async function ee() {
    if (await l("clear-all-history")) {
      m.value = [];
      ne.value = 0;
      Y.value = R();
      Ue.value = [];
      pe();
      Se();
      se();
      return true;
    } else {
      return false;
    }
  }
  async function Oe() {
    const o = await l("delete-low-intention-leads");
    if (o != null && o.success) {
      pe();
      await I({
        current: 1,
        pageSize: ct,
        refreshStats: true
      });
      se();
      return Number(o.deleted) || 0;
    }
    const d = m.value.filter(M => M.leadKind !== "video_card" && !M.isHighIntention);
    if (!d.length) {
      return 0;
    }
    const c = [...new Set(d.map(M => M.leadId || M.key).filter(Boolean))];
    if (c.length) {
      await l("delete-leads-from-history", c);
    }
    pe();
    await I({
      current: 1,
      pageSize: ct,
      refreshStats: true
    });
    se();
    return d.length;
  }
  async function Fe() {
    const o = await l("delete-touched-leads");
    if (o != null && o.success) {
      pe();
      await I({
        current: 1,
        pageSize: ct,
        refreshStats: true
      });
      se();
      return Number(o.deleted) || 0;
    }
    const d = m.value.filter(M => M.leadKind !== "video_card" && Ut(M));
    if (!d.length) {
      return 0;
    }
    const c = [...new Set(d.map(M => M.leadId || M.key).filter(Boolean))];
    if (c.length) {
      await l("delete-leads-from-history", c);
    }
    pe();
    await I({
      current: 1,
      pageSize: ct,
      refreshStats: true
    });
    se();
    return d.length;
  }
  async function T({
    pageSize: o = ct
  } = {}) {
    const d = await l("delete-failed-batch-follow-leads");
    if (d != null && d.success) {
      pe();
      await I({
        current: 1,
        pageSize: o,
        silent: true,
        refreshStats: true
      });
      return {
        success: true,
        deleted: Number(d.deleted) || 0
      };
    } else {
      return {
        success: false,
        deleted: 0,
        error: (d == null ? undefined : d.error) || "删除失败"
      };
    }
  }
  async function Be(o = [], d = {}) {
    const c = typeof d.onProgress == "function" ? d.onProgress : null;
    const M = (Array.isArray(o) ? o : []).map(y => {
      if (!y || typeof y != "object") {
        return null;
      }
      const U = s({
        ...y
      });
      const F = Dt(U);
      if (!F || !U.userUrl) {
        return null;
      } else {
        U.leadId = F;
        U.key = F;
        U.platform = U.platform || "DY";
        U.entrySource = U.entrySource || "import";
        U.entryLabel = U.entryLabel || "UID导入";
        U.taskId = U.taskId || "import_uid";
        U.taskName = U.taskName || "UID导入";
        return U;
      }
    }).filter(Boolean);
    if (!M.length) {
      return [];
    }
    const j = 300;
    for (let y = 0; y < M.length; y += j) {
      const U = M.slice(y, y + j);
      if (!(await l("append-imported-leads", U))) {
        x.error(y === 0 ? "导入线索写入失败" : `导入中断：已写入 ${y} 条`);
        if (y === 0) {
          return [];
        }
        break;
      }
      if (c != null) {
        c(Math.min(y + U.length, M.length), M.length);
      }
      if (y + j < M.length) {
        await new Promise(ae => setTimeout(ae, 0));
      }
    }
    pe();
    await I({
      current: 1,
      pageSize: ct,
      refreshStats: true
    });
    a();
    return M.map(y => y.leadId).filter(Boolean);
  }
  async function vt(o = {}) {
    const d = await l("query-leads-for-batch", {
      filters: {
        ...De(),
        ...o
      },
      limit: 50000
    });
    return (Array.isArray(d == null ? undefined : d.items) ? d.items : []).map(c => s({
      ...c
    }));
  }
  async function gt(o = []) {
    const d = (Array.isArray(o) ? o : []).map(j => String(j || "").trim()).filter(Boolean);
    if (!d.length) {
      return {
        items: [],
        requested: 0,
        missing: 0
      };
    }
    const c = await l("get-leads-by-ids", {
      ids: d,
      limit: d.length
    });
    const M = (Array.isArray(c == null ? undefined : c.items) ? c.items : []).map(j => s({
      ...j
    }));
    return {
      items: M,
      requested: Number(c == null ? undefined : c.requested) || d.length,
      missing: Math.max(0, (Number(c == null ? undefined : c.requested) || d.length) - M.length)
    };
  }
  async function st(o = 100000) {
    const d = await l("get-leads-page", {
      page: 1,
      pageSize: Math.min(100000, Math.max(1, Number(o) || 100000)),
      filters: De(),
      forExport: true
    });
    if ((d == null ? undefined : d.runtime) === "enc") {
      return {
        items: (m.value || []).filter(M => M && M.leadKind !== "video_card"),
        total: ne.value || 0
      };
    }
    const c = (Array.isArray(d == null ? undefined : d.items) ? d.items : []).map(M => s({
      ...M
    }));
    return {
      items: c,
      total: Number(d == null ? undefined : d.total) || c.length
    };
  }
  async function lt(o) {
    return l("export-leads", {
      filters: De(),
      fields: o
    });
  }
  return {
    leads: m,
    leadsTotal: ne,
    leadsLoading: xe,
    leadsRuntime: q,
    leadPoolStats: Y,
    leadPoolAccountStats: Ue,
    loadLeadPoolStats: _e,
    filters: z,
    cumulativeStats: k,
    filteredLeads: Ee,
    entryKeywordOptions: Z,
    locationFilterOptions: qe,
    accountFilterOptions: He,
    loadLeadsFromHistory: Ae,
    loadLeadsPage: I,
    scheduleLoadLeadsPage: V,
    buildServerFilters: De,
    queryLeadsForBatch: vt,
    queryLeadsByIds: gt,
    queryLeadsForExport: st,
    exportLeadsViaMain: lt,
    saveData: se,
    updateStat: D,
    exportToCSV: Ie,
    getTotalTouchCount: Nt,
    leadHasAnyTouch: Ut,
    leadHasTouchFromSource: ba,
    syncLeadToHistory: A,
    clearAllLeads: ee,
    clearLowIntentionLeads: Oe,
    clearTouchedLeads: Fe,
    deleteFailedBatchFollowLeads: T,
    upsertImportedLeads: Be
  };
}
const Xa = {
  style: {
    "margin-bottom": "12px",
    display: "flex",
    "justify-content": "space-between"
  }
};
const Qa = ["onClick"];
const eo = {
  __name: "VideoHistoryModal",
  props: {
    open: Boolean
  },
  emits: ["update:open"],
  setup(C, {
    emit: l
  }) {
    const h = C;
    const m = l;
    const {
      invoke: A,
      send: $
    } = _t();
    const z = E(h.open);
    const k = E([]);
    const s = E([]);
    const D = kt({
      current: 1,
      pageSize: 10,
      total: 0,
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "50", "100"],
      showTotal: q => `共 ${q} 条`
    });
    function ce(q) {
      if ((q == null ? undefined : q.current) != null) {
        D.current = q.current;
      }
      if ((q == null ? undefined : q.pageSize) != null) {
        D.pageSize = q.pageSize;
      }
    }
    Ve(() => k.value.length, q => {
      D.total = q;
      const Y = Math.max(1, Math.ceil(q / D.pageSize) || 1);
      if (D.current > Y) {
        D.current = Y;
      }
    }, {
      immediate: true
    });
    const se = [{
      title: "视频标题",
      dataIndex: "title",
      ellipsis: true
    }, {
      title: "链接",
      dataIndex: "url",
      ellipsis: true
    }, {
      title: "浏览时间",
      dataIndex: "timestamp",
      width: 120,
      customRender: ({
        text: q
      }) => xe(q)
    }];
    Ve(() => h.open, q => {
      z.value = q;
      if (q) {
        L();
      }
    });
    Ve(z, q => {
      m("update:open", q);
    });
    async function L() {
      const q = await A("get-processed-videos");
      k.value = (q || []).sort((Y, Ue) => (Ue.timestamp || 0) - (Y.timestamp || 0));
      D.current = 1;
    }
    async function Q() {
      if (s.value.length === 0) {
        return;
      }
      if (await A("remove-processed-videos", s.value)) {
        x.success("删除成功");
        L();
        s.value = [];
      }
    }
    function we(q) {
      if (q) {
        $("open-in-account-context", {
          url: q,
          accountId: "default",
          platform: "douyin"
        });
      }
    }
    function ne() {
      $("clear-extension-cache");
      x.success("已清空历史浏览视频记录，自动获客将重新扫描这些视频");
      setTimeout(L, 500);
    }
    function xe(q) {
      if (!q) {
        return "-";
      }
      const Y = new Date(q);
      return `${Y.getMonth() + 1}-${Y.getDate()} ${Y.getHours().toString().padStart(2, "0")}:${Y.getMinutes().toString().padStart(2, "0")}`;
    }
    return (q, Y) => {
      const Ue = J("a-button");
      const G = J("a-space");
      const $e = J("a-table");
      const ke = J("a-modal");
      i();
      return W(ke, {
        open: z.value,
        "onUpdate:open": Y[0] ||= Re => z.value = Re,
        title: "历史浏览视频",
        width: "700px",
        footer: null,
        cancelText: "取消",
        okText: "确定"
      }, {
        default: r(() => [n("div", Xa, [u(G, null, {
          default: r(() => [u(Ue, {
            danger: "",
            disabled: s.value.length === 0,
            onClick: Q
          }, {
            default: r(() => [...(Y[1] ||= [b("批量删除", -1)])]),
            _: 1
          }, 8, ["disabled"]), u(Ue, {
            onClick: ne
          }, {
            default: r(() => [...(Y[2] ||= [b("清空全部", -1)])]),
            _: 1
          })]),
          _: 1
        }), n("span", null, "共 " + p(k.value.length) + " 条记录", 1)]), u($e, {
          "row-selection": {
            selectedRowKeys: s.value,
            onChange: Re => s.value = Re
          },
          dataSource: k.value,
          columns: se,
          size: "small",
          "row-key": "url",
          pagination: D,
          onChange: ce
        }, {
          bodyCell: r(({
            column: Re,
            text: je
          }) => [Re.dataIndex === "url" ? (i(), w("a", {
            key: 0,
            href: "#",
            onClick: ot(O => we(je), ["prevent"]),
            class: "video-link"
          }, p(je), 9, Qa)) : H("", true)]),
          _: 1
        }, 8, ["row-selection", "dataSource", "pagination"])]),
        _: 1
      }, 8, ["open"]);
    };
  }
};
const to = St(eo, [["__scopeId", "data-v-ecd3d22e"]]);
const xn = 0;
const $n = 50;
function An(C, l) {
  const h = Number(C);
  if (Number.isFinite(h)) {
    return Math.min(120, Math.max(0, Math.round(h)));
  } else {
    return l;
  }
}
function wt(C = {}) {
  const l = typeof C.ageFilterEnabled == "boolean";
  return {
    ...C,
    genderFilter: ca(C.genderFilter, "all"),
    ageFilterEnabled: l ? C.ageFilterEnabled : false,
    ageMin: l ? An(C.ageMin, xn) : xn,
    ageMax: l ? An(C.ageMax, $n) : $n
  };
}
const no = {
  class: "batch-modal-content"
};
const ao = {
  class: "batch-summary"
};
const oo = {
  class: "batch-block"
};
const so = {
  class: "batch-block"
};
const lo = {
  class: "block-label"
};
const io = {
  class: "block-actions"
};
const uo = {
  key: 0,
  class: "acc-chips"
};
const ro = ["onClick"];
const co = {
  class: "chip-name"
};
const mo = {
  key: 1,
  class: "empty-tip"
};
const fo = {
  class: "batch-block"
};
const po = {
  key: 0,
  class: "batch-block script-block"
};
const vo = {
  class: "mode-tab-label"
};
const go = {
  key: 0,
  class: "hint"
};
const yo = {
  key: 1,
  class: "hint"
};
const ho = {
  key: 2,
  class: "hint"
};
const ko = {
  class: "profile-comment-options"
};
const bo = {
  key: 0,
  class: "option-row"
};
const Co = {
  key: 1,
  class: "hint"
};
const wo = {
  class: "option-row engage-percent-row"
};
const _o = {
  class: "option-row engage-percent-row"
};
const So = {
  class: "attachment-block"
};
const xo = {
  key: 0,
  class: "attachment-percent-row"
};
const $o = {
  key: 1,
  class: "comment-image-picker"
};
const Ao = {
  key: 0,
  class: "comment-image-grid"
};
const Io = ["src", "alt"];
const To = ["onClick"];
const zo = {
  class: "comment-image-index"
};
const No = {
  class: "comment-image-actions"
};
const Uo = {
  key: 1,
  class: "hint",
  style: {
    "margin-top": "6px"
  }
};
const Po = {
  key: 2,
  class: "attachment-percent-row"
};
const Fo = {
  class: "option-row"
};
const Mo = {
  key: 2,
  class: "mention-options"
};
const Lo = {
  style: {
    "margin-top": "8px",
    display: "flex",
    "align-items": "center",
    gap: "8px"
  }
};
const Ro = {
  class: "sub-label-row"
};
const Do = {
  class: "var-tip"
};
const Oo = {
  class: "advanced-block"
};
const Eo = {
  class: "advanced-panel"
};
const Bo = {
  class: "adv-row"
};
const Ko = {
  class: "adv-row"
};
const Vo = {
  class: "inline-range age-range"
};
const Ho = {
  class: "adv-row"
};
const Wo = {
  class: "inline-range"
};
const jo = {
  class: "adv-row"
};
const qo = {
  class: "adv-checks"
};
const Yo = {
  key: 1,
  class: "adv-row"
};
const Go = {
  class: "inline-range"
};
const Jo = `很棒，支持一下！
写得不错，学习了`;
const Zo = {
  __name: "BatchActionModal",
  props: {
    open: Boolean,
    title: String,
    loading: Boolean,
    initialConfig: Object,
    selectedCount: {
      type: Number,
      default: 0
    },
    filteredCount: {
      type: Number,
      default: 0
    },
    batchAccounts: {
      type: Array,
      default: () => []
    },
    taskConfig: {
      type: Object,
      default: null
    },
    isFree: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:open", "update:initialConfig", "start"],
  setup(C, {
    emit: l
  }) {
    var De;
    const {
      invoke: h
    } = _t();
    const m = C;
    const A = l;
    const $ = E(m.open);
    const z = E(false);
    const k = E([]);
    const s = E(wt({
      batchScope: "selected",
      batchAccountIds: [],
      type: "profile_first_comment",
      profileCommentUseAi: true,
      genderFilter: "all",
      skipTouched: true,
      template: `你好 {nickname}
看了你的评论很有共鸣，加个好友？
很高兴认识你 {nickname}，有空聊聊吗？`,
      commentTemplate: `很棒，支持一下！
写得不错，学习了`,
      commentUseRandomSuffix: false,
      enableCommentWithoutText: false,
      enableCommentImage: false,
      commentImagePaths: [],
      enableCommentExpression: false,
      commentExpressionCount: 3,
      commentAttachmentPercent: 20,
      enableCommentMention: false,
      commentMentionNicknames: "",
      commentMentionPosition: "before",
      commentMentionPercent: 100,
      profileFirstWorkLikePercent: 10,
      profileFirstWorkCollectPercent: 10,
      accountStrategy: "original",
      dmTarget: "all",
      followDmDelayMin: 3,
      followDmDelayMax: 8,
      useRandomSuffix: true,
      delayMin: 120,
      delayMax: 180,
      ...m.initialConfig,
      skipTouched: ((De = m.initialConfig) == null ? undefined : De.skipTouched) !== false
    }));
    const D = he(() => s.value.type === "profile_first_comment");
    const ce = he(() => s.value.type === "message" || s.value.type === "follow_dm");
    const se = he(() => s.value.batchScope === "selected" ? m.selectedCount : m.filteredCount);
    function L(I) {
      if (I === "no_text") {
        s.value.enableCommentWithoutText = true;
        s.value.profileCommentUseAi = false;
        s.value.commentUseRandomSuffix = false;
        return;
      }
      s.value.enableCommentWithoutText = false;
      s.value.profileCommentUseAi = I === "ai";
      if (I === "ai") {
        s.value.commentUseRandomSuffix = false;
      }
    }
    function Q(I = s.value) {
      if (I != null && I.enableCommentWithoutText) {
        return "no_text";
      } else if (I != null && I.profileCommentUseAi) {
        return "ai";
      } else {
        return "custom";
      }
    }
    function we() {
      L(Q(s.value));
    }
    const ne = he({
      get: () => Q(s.value),
      set: I => L(I)
    });
    const xe = he(() => {
      const I = s.value.batchAccountIds.length;
      if (!I || !se.value) {
        return "";
      }
      const a = Math.floor(se.value / I);
      if (se.value % I > 0) {
        return `${a}~${a + 1}`;
      } else {
        return String(a);
      }
    });
    const q = he({
      get() {
        if (s.value.enableCommentExpression) {
          return "expression";
        } else if (s.value.enableCommentImage) {
          return "image";
        } else {
          return "none";
        }
      },
      set(I) {
        if (I === "expression") {
          s.value.enableCommentExpression = true;
          s.value.enableCommentImage = false;
        } else if (I === "image") {
          s.value.enableCommentExpression = false;
          s.value.enableCommentImage = true;
        } else {
          s.value.enableCommentExpression = false;
          s.value.enableCommentImage = false;
        }
      }
    });
    const Y = he(() => {
      if (!Array.isArray(s.value.commentImagePaths)) {
        const I = String(s.value.commentImagePath || "").trim();
        if (I) {
          return [I];
        } else {
          return [];
        }
      }
      return s.value.commentImagePaths.filter(I => typeof I == "string" && I.trim());
    });
    function Ue() {
      if (!Array.isArray(s.value.commentImagePaths)) {
        const I = String(s.value.commentImagePath || "").trim();
        s.value.commentImagePaths = I ? [I] : [];
        delete s.value.commentImagePath;
      }
    }
    async function G() {
      if (!s.value.enableCommentImage || !Y.value.length) {
        k.value = [];
        return;
      }
      const I = [];
      for (const a of Y.value) {
        try {
          const V = await h("read-comment-image", a);
          if (V != null && V.base64) {
            I.push({
              path: a,
              src: `data:${V.mime || "image/png"};base64,${V.base64}`
            });
          }
        } catch {}
      }
      k.value = I;
    }
    async function $e() {
      var I;
      try {
        const a = await h("pick-comment-image");
        if (a != null && a.canceled) {
          return;
        }
        const V = (I = a == null ? undefined : a.paths) != null && I.length ? a.paths : a != null && a.path ? [a.path] : [];
        if (!V.length) {
          return;
        }
        Ue();
        s.value.commentImagePaths.push(...V);
        s.value.enableCommentImage = true;
        await G();
        x.success(V.length > 1 ? `已添加 ${V.length} 张配图` : "评论配图已添加");
      } catch (a) {
        x.error("选择图片失败: " + (a.message || a));
      }
    }
    function ke(I) {
      Ue();
      s.value.commentImagePaths.splice(I, 1);
      if (!s.value.commentImagePaths.length) {
        s.value.enableCommentImage = false;
      }
      G();
    }
    function Re() {
      s.value.commentImagePaths = [];
      s.value.enableCommentImage = false;
      k.value = [];
    }
    function je(I = s.value) {
      const a = !!I.enableCommentImage && (Array.isArray(I.commentImagePaths) ? I.commentImagePaths.some(Pe => String(Pe || "").trim()) : !!String(I.commentImagePath || "").trim());
      const V = !!I.enableCommentExpression;
      const Ae = !!I.enableCommentMention && !!String(I.commentMentionNicknames || "").trim();
      return a || V || Ae;
    }
    Ve(() => m.open, I => {
      var a;
      $.value = I;
      if (I) {
        if (m.initialConfig) {
          s.value = {
            ...s.value,
            ...wt(m.initialConfig),
            skipTouched: m.initialConfig.skipTouched !== false
          };
        } else if (s.value.skipTouched === undefined) {
          s.value.skipTouched = true;
        }
        if (s.value.enableCommentWithoutText === undefined) {
          s.value.enableCommentWithoutText = false;
        }
        if (s.value.profileCommentUseAi === undefined) {
          s.value.profileCommentUseAi = true;
        }
        we();
        if (s.value.enableCommentImage === undefined) {
          s.value.enableCommentImage = false;
        }
        if (!Array.isArray(s.value.commentImagePaths)) {
          const V = String(s.value.commentImagePath || "").trim();
          s.value.commentImagePaths = V ? [V] : [];
        }
        if (s.value.enableCommentExpression === undefined) {
          s.value.enableCommentExpression = false;
        }
        if (s.value.commentExpressionCount === undefined) {
          s.value.commentExpressionCount = 3;
        }
        if (s.value.commentAttachmentPercent === undefined) {
          s.value.commentAttachmentPercent = 20;
        }
        if (s.value.commentMentionPercent === undefined) {
          s.value.commentMentionPercent = 100;
        }
        if (s.value.profileFirstWorkLikePercent === undefined || s.value.profileFirstWorkLikePercent === null) {
          s.value.profileFirstWorkLikePercent = 10;
        }
        if (s.value.profileFirstWorkCollectPercent === undefined || s.value.profileFirstWorkCollectPercent === null) {
          s.value.profileFirstWorkCollectPercent = 10;
        }
        if (m.selectedCount > 0) {
          s.value.batchScope = "selected";
        } else if (m.filteredCount > 0) {
          s.value.batchScope = "filtered";
        }
        if (((a = s.value.batchAccountIds) == null || !a.length) && m.batchAccounts.length) {
          s.value.batchAccountIds = m.batchAccounts.map(V => V.id);
        }
        G();
      }
    });
    Ve($, I => {
      A("update:open", I);
    });
    Ve(s, I => {
      A("update:initialConfig", {
        ...I
      });
      localStorage.setItem("last_batch_config", JSON.stringify(I));
    }, {
      deep: true
    });
    Ve(() => [s.value.commentImagePaths, s.value.enableCommentImage], () => {
      G();
    }, {
      deep: true
    });
    Ve(() => s.value.type, I => {
      if (I === "message" && s.value.dmTarget === "followed_only") {
        s.value.dmTarget = "all";
      }
    });
    function O(I) {
      const a = [...s.value.batchAccountIds];
      const V = a.indexOf(I);
      if (V >= 0) {
        a.splice(V, 1);
      } else {
        a.push(I);
      }
      s.value.batchAccountIds = a;
    }
    function R() {
      s.value.batchAccountIds = m.batchAccounts.map(I => I.id);
    }
    function de() {
      s.value.batchAccountIds = [];
    }
    function pe() {
      var Ae;
      if (s.value.batchScope === "selected" && m.selectedCount === 0) {
        return x.warning("请先勾选要跟进的线索，或切换到「当前列表」");
      }
      if (s.value.batchScope === "filtered" && m.filteredCount === 0) {
        return x.warning("当前列表没有可跟进的线索");
      }
      if ((Ae = s.value.batchAccountIds) == null || !Ae.length) {
        return x.warning("请至少选择一个执行账号");
      }
      const I = wt(s.value);
      {
        const Pe = Number(I.commentMentionPercent);
        I.commentMentionPercent = Number.isFinite(Pe) ? Math.max(0, Math.min(100, Math.round(Pe))) : 100;
      }
      {
        const Pe = Number(I.profileFirstWorkLikePercent);
        I.profileFirstWorkLikePercent = Number.isFinite(Pe) ? Math.max(0, Math.min(100, Math.round(Pe))) : 10;
        const Ee = Number(I.profileFirstWorkCollectPercent);
        I.profileFirstWorkCollectPercent = Number.isFinite(Ee) ? Math.max(0, Math.min(100, Math.round(Ee))) : 10;
      }
      const a = Number(I.ageMin);
      const V = Number(I.ageMax);
      if (I.ageFilterEnabled && a > V) {
        return x.warning("年龄范围无效：最小值不能大于最大值");
      }
      if (s.value.type === "profile_first_comment") {
        const Pe = !!s.value.enableCommentWithoutText;
        const Ee = je(s.value);
        if (Pe && !Ee) {
          return x.warning("已开启「不发文字」，请配置图片、表情包或 @ 账号");
        }
        if (s.value.profileCommentUseAi) {
          const Z = s.value.batchAccountIds.filter(qe => !Un(m.taskConfig, qe, m.isFree));
          if (Z.length) {
            const qe = Z.map(He => {
              const Ie = m.batchAccounts.find(Se => String(Se.id) === String(He));
              return Pt(Ie) || He;
            }).join("、");
            return x.warning(`已选「AI 智能体」，以下账号未绑定智能体：${qe}`);
          }
        } else if (!Pe && !(s.value.commentTemplate || "").trim()) {
          return x.warning("请填写评论话术");
        }
      }
      A("start", I);
    }
    function _e(I) {
      s.value.template += I;
    }
    return (I, a) => {
      const V = J("a-radio-button");
      const Ae = J("a-radio-group");
      const Pe = J("a-checkbox");
      const Ee = J("a-button");
      const Z = J("a-select-option");
      const qe = J("a-select");
      const He = J("a-textarea");
      const Ie = J("a-switch");
      const Se = J("a-input-number");
      const ee = J("a-tag");
      const Oe = J("a-radio");
      const Fe = J("a-modal");
      i();
      return W(Fe, {
        open: $.value,
        "onUpdate:open": a[28] ||= T => $.value = T,
        title: "批量跟进",
        onOk: pe,
        confirmLoading: C.loading,
        width: "760px",
        centered: "",
        "wrap-class-name": "batch-action-modal-wrap",
        "body-style": {
          paddingTop: "10px",
          paddingBottom: "6px",
          maxHeight: "74vh",
          overflowY: "auto"
        },
        cancelText: "取消",
        okText: "开始执行"
      }, {
        default: r(() => [n("div", no, [n("div", ao, [n("span", null, [n("em", null, p(se.value), 1), a[29] ||= b(" 条线索", -1)]), a[33] ||= n("span", {
          class: "sep"
        }, "·", -1), n("span", null, [n("em", null, p(s.value.batchAccountIds.length), 1), a[30] ||= b(" 个账号", -1)]), a[34] ||= n("span", {
          class: "sep"
        }, "·", -1), n("span", null, [a[31] ||= b("约 ", -1), n("em", null, p(xe.value || "—"), 1), a[32] ||= b(" 条/账号", -1)])]), n("div", oo, [a[36] ||= n("div", {
          class: "block-label"
        }, "跟进范围", -1), u(Ae, {
          value: s.value.batchScope,
          "onUpdate:value": a[0] ||= T => s.value.batchScope = T,
          "button-style": "solid",
          size: "small",
          class: "full-width"
        }, {
          default: r(() => [u(V, {
            value: "selected",
            disabled: C.selectedCount === 0
          }, {
            default: r(() => [b("已勾选 (" + p(C.selectedCount) + ")", 1)]),
            _: 1
          }, 8, ["disabled"]), u(V, {
            value: "filtered",
            disabled: C.filteredCount === 0
          }, {
            default: r(() => [b("当前列表 (" + p(C.filteredCount) + ")", 1)]),
            _: 1
          }, 8, ["disabled"])]),
          _: 1
        }, 8, ["value"]), u(Pe, {
          checked: s.value.skipTouched,
          "onUpdate:checked": a[1] ||= T => s.value.skipTouched = T,
          class: "skip-touched-check"
        }, {
          default: r(() => [...(a[35] ||= [b(" 跳过已触达（推荐，避免重复互动） ", -1)])]),
          _: 1
        }, 8, ["checked"])]), n("div", so, [n("div", lo, [a[39] ||= b(" 执行账号 ", -1), n("span", io, [u(Ee, {
          type: "link",
          size: "small",
          onClick: R
        }, {
          default: r(() => [...(a[37] ||= [b("全选", -1)])]),
          _: 1
        }), u(Ee, {
          type: "link",
          size: "small",
          onClick: de
        }, {
          default: r(() => [...(a[38] ||= [b("清空", -1)])]),
          _: 1
        })])]), C.batchAccounts.length ? (i(), w("div", uo, [(i(true), w(ve, null, mt(C.batchAccounts, T => {
          i();
          return w("div", {
            key: T.id,
            class: nn(["acc-chip", {
              selected: s.value.batchAccountIds.includes(T.id)
            }]),
            onClick: Be => O(T.id)
          }, [n("span", co, p(P(Pt)(T)), 1), s.value.batchAccountIds.includes(T.id) ? (i(), W(P(Ka), {
            key: 0,
            size: 11,
            class: "chip-check"
          })) : H("", true)], 10, ro);
        }), 128))])) : (i(), w("div", mo, "暂无可用账号，请先在账号池登录"))]), n("div", fo, [a[44] ||= n("div", {
          class: "block-label"
        }, "跟进方式", -1), u(qe, {
          value: s.value.type,
          "onUpdate:value": a[2] ||= T => s.value.type = T,
          size: "small",
          style: {
            width: "100%"
          }
        }, {
          default: r(() => [u(Z, {
            value: "profile_first_comment"
          }, {
            default: r(() => [...(a[40] ||= [b("首作评论", -1)])]),
            _: 1
          }), u(Z, {
            value: "follow_dm"
          }, {
            default: r(() => [...(a[41] ||= [b("关注+私信", -1)])]),
            _: 1
          }), u(Z, {
            value: "follow"
          }, {
            default: r(() => [...(a[42] ||= [b("仅关注", -1)])]),
            _: 1
          }), u(Z, {
            value: "message"
          }, {
            default: r(() => [...(a[43] ||= [b("仅私信", -1)])]),
            _: 1
          })]),
          _: 1
        }, 8, ["value"])]), D.value || s.value.type === "message" || s.value.type === "follow_dm" ? (i(), w("div", po, [D.value ? (i(), w(ve, {
          key: 0
        }, [a[70] ||= n("label", {
          class: "sub-label"
        }, "评论内容", -1), u(Ae, {
          value: ne.value,
          "onUpdate:value": a[3] ||= T => ne.value = T,
          class: "profile-comment-mode-tabs",
          size: "small",
          "button-style": "solid"
        }, {
          default: r(() => [u(V, {
            value: "ai"
          }, {
            default: r(() => [n("span", vo, [u(P(da), {
              size: 12,
              class: "ai-icon"
            }), a[45] ||= b(" AI 智能体 ", -1)])]),
            _: 1
          }), u(V, {
            value: "custom"
          }, {
            default: r(() => [...(a[46] ||= [b("自定义话术", -1)])]),
            _: 1
          }), u(V, {
            value: "no_text"
          }, {
            default: r(() => [...(a[47] ||= [b("不发文字", -1)])]),
            _: 1
          })]),
          _: 1
        }, 8, ["value"]), ne.value === "ai" ? (i(), w("p", go, " 已绑定智能体用 AI 生成评论；未绑定的账号请先在任务配置中绑定智能体 ")) : ne.value === "custom" ? (i(), w("p", yo, " 按行随机选用下方话术发送评论文字 ")) : (i(), w("p", ho, " 不生成/不发送评论文字，仅发送下方配置的图片、表情包或 @ 账号 ")), ne.value === "custom" ? (i(), w(ve, {
          key: 3
        }, [a[48] ||= n("label", {
          class: "sub-label"
        }, "评论话术", -1), u(He, {
          value: s.value.commentTemplate,
          "onUpdate:value": a[4] ||= T => s.value.commentTemplate = T,
          placeholder: Jo,
          rows: 3,
          size: "small"
        }, null, 8, ["value"])], 64)) : H("", true), n("div", ko, [ne.value === "custom" ? (i(), w("div", bo, [a[49] ||= n("span", {
          class: "option-label"
        }, "添加随机表情", -1), u(Ie, {
          checked: s.value.commentUseRandomSuffix,
          "onUpdate:checked": a[5] ||= T => s.value.commentUseRandomSuffix = T,
          size: "small"
        }, null, 8, ["checked"])])) : H("", true), ne.value === "custom" ? (i(), w("p", Co, "仅本地话术末尾追加")) : H("", true), n("div", wo, [a[50] ||= n("span", {
          class: "option-label"
        }, "作品点赞", -1), u(Se, {
          value: s.value.profileFirstWorkLikePercent,
          "onUpdate:value": a[6] ||= T => s.value.profileFirstWorkLikePercent = T,
          min: 0,
          max: 100,
          step: 5,
          size: "small",
          style: {
            width: "88px"
          }
        }, null, 8, ["value"]), a[51] ||= n("span", {
          class: "hint"
        }, "%", -1)]), n("div", _o, [a[52] ||= n("span", {
          class: "option-label"
        }, "作品收藏", -1), u(Se, {
          value: s.value.profileFirstWorkCollectPercent,
          "onUpdate:value": a[7] ||= T => s.value.profileFirstWorkCollectPercent = T,
          min: 0,
          max: 100,
          step: 5,
          size: "small",
          style: {
            width: "88px"
          }
        }, null, 8, ["value"]), a[53] ||= n("span", {
          class: "hint"
        }, "%", -1)]), a[69] ||= n("p", {
          class: "hint"
        }, "打开首作后按概率点赞/收藏，再发表评论；0 表示关闭该项", -1), n("div", So, [a[62] ||= n("div", {
          class: "option-label"
        }, "评论附带内容", -1), a[63] ||= n("p", {
          class: "hint",
          style: {
            "margin-top": "2px",
            "margin-bottom": "6px"
          }
        }, " 设置自动发表视频评论附带的内容；评论文字可留空，仅发送附带内容或 @ 账号。 ", -1), u(qe, {
          value: q.value,
          "onUpdate:value": a[8] ||= T => q.value = T,
          size: "small",
          style: {
            width: "100%"
          }
        }, {
          default: r(() => [u(Z, {
            value: "none"
          }, {
            default: r(() => [...(a[54] ||= [b("无", -1)])]),
            _: 1
          }), u(Z, {
            value: "image"
          }, {
            default: r(() => [...(a[55] ||= [b("附带图片", -1)])]),
            _: 1
          }), u(Z, {
            value: "expression"
          }, {
            default: r(() => [...(a[56] ||= [b("表情包 (GIF)", -1)])]),
            _: 1
          })]),
          _: 1
        }, 8, ["value"]), q.value !== "none" ? (i(), w("div", xo, [a[57] ||= n("span", {
          class: "hint"
        }, "附带概率:", -1), u(Se, {
          value: s.value.commentAttachmentPercent,
          "onUpdate:value": a[9] ||= T => s.value.commentAttachmentPercent = T,
          min: 0,
          max: 100,
          step: 5,
          size: "small",
          style: {
            width: "88px"
          }
        }, null, 8, ["value"]), a[58] ||= n("span", {
          class: "hint"
        }, "%", -1)])) : H("", true), q.value === "image" ? (i(), w("div", $o, [k.value.length ? (i(), w("div", Ao, [(i(true), w(ve, null, mt(k.value, (T, Be) => {
          i();
          return w("div", {
            key: T.path,
            class: "comment-image-thumb"
          }, [n("img", {
            src: T.src,
            alt: `配图 ${Be + 1}`
          }, null, 8, Io), n("button", {
            type: "button",
            class: "comment-image-remove",
            title: "移除",
            onClick: vt => ke(Be)
          }, "×", 8, To), n("span", zo, p(Be + 1), 1)]);
        }), 128))])) : H("", true), n("div", No, [u(Ee, {
          size: "small",
          onClick: $e
        }, {
          default: r(() => [...(a[59] ||= [b("添加图片", -1)])]),
          _: 1
        }), Y.value.length ? (i(), W(Ee, {
          key: 0,
          size: "small",
          type: "text",
          danger: "",
          onClick: Re
        }, {
          default: r(() => [...(a[60] ||= [b("清空", -1)])]),
          _: 1
        })) : H("", true)]), Y.value.length > 1 ? (i(), w("div", Uo, " 已添加 " + p(Y.value.length) + " 张，将按 1→" + p(Y.value.length) + " 顺序轮询附带 ", 1)) : H("", true)])) : H("", true), q.value === "expression" ? (i(), w("div", Po, [a[61] ||= n("span", {
          class: "hint"
        }, "轮询表情包范围:", -1), u(qe, {
          value: s.value.commentExpressionCount,
          "onUpdate:value": a[10] ||= T => s.value.commentExpressionCount = T,
          size: "small",
          style: {
            width: "180px"
          }
        }, {
          default: r(() => [(i(), w(ve, null, mt(8, T => u(Z, {
            key: `batch-expr-${T}`,
            value: T
          }, {
            default: r(() => [b(p(T === 1 ? "仅第一张表情包" : `前 ${T} 张按顺序轮询`) + p(T === 3 ? " (默认)" : ""), 1)]),
            _: 2
          }, 1032, ["value"])), 64))]),
          _: 1
        }, 8, ["value"])])) : H("", true)]), n("div", Fo, [a[64] ||= n("div", null, [n("div", {
          class: "option-label"
        }, "@ 提及账号"), n("p", {
          class: "hint",
          style: {
            "margin-top": "2px"
          }
        }, " 发表首作评论时，自动 @ 以下抖音昵称。多个昵称请换行隔开，无需输入 @。 ")], -1), u(Ie, {
          checked: s.value.enableCommentMention,
          "onUpdate:checked": a[11] ||= T => s.value.enableCommentMention = T,
          size: "small"
        }, null, 8, ["checked"])]), s.value.enableCommentMention ? (i(), w("div", Mo, [u(He, {
          value: s.value.commentMentionNicknames,
          "onUpdate:value": a[12] ||= T => s.value.commentMentionNicknames = T,
          placeholder: "每行填写一个昵称，无需输入 @",
          rows: 2,
          size: "small"
        }, null, 8, ["value"]), n("div", Lo, [a[65] ||= n("span", {
          class: "hint"
        }, "@ 概率（首作）:", -1), u(Se, {
          value: s.value.commentMentionPercent,
          "onUpdate:value": a[13] ||= T => s.value.commentMentionPercent = T,
          min: 0,
          max: 100,
          step: 5,
          size: "small",
          style: {
            width: "88px"
          }
        }, null, 8, ["value"]), a[66] ||= n("span", {
          class: "hint"
        }, "%", -1)]), u(Ae, {
          value: s.value.commentMentionPosition,
          "onUpdate:value": a[14] ||= T => s.value.commentMentionPosition = T,
          size: "small",
          "button-style": "solid",
          class: "mention-position-radio"
        }, {
          default: r(() => [u(V, {
            value: "before"
          }, {
            default: r(() => [...(a[67] ||= [b("正文前 @", -1)])]),
            _: 1
          }), u(V, {
            value: "after"
          }, {
            default: r(() => [...(a[68] ||= [b("正文后 @", -1)])]),
            _: 1
          })]),
          _: 1
        }, 8, ["value"])])) : H("", true)])], 64)) : (i(), w(ve, {
          key: 1
        }, [n("div", Ro, [a[73] ||= n("label", {
          class: "sub-label"
        }, "私信话术", -1), n("span", Do, [a[72] ||= b("变量: ", -1), u(ee, {
          size: "small",
          onClick: a[15] ||= T => _e("{nickname}")
        }, {
          default: r(() => [...(a[71] ||= [b("{nickname}", -1)])]),
          _: 1
        })])]), u(He, {
          value: s.value.template,
          "onUpdate:value": a[16] ||= T => s.value.template = T,
          placeholder: "你好 {nickname}，看了你的评论很有共鸣...",
          rows: 3,
          size: "small"
        }, null, 8, ["value"]), a[74] ||= n("div", {
          class: "hint",
          style: {
            "margin-top": "4px",
            "font-size": "11px",
            color: "var(--text-muted)"
          }
        }, " 每行一条话术；按顺序循环发送（第1人A、第2人B…用完再从头） ", -1)], 64))])) : H("", true), n("div", Oo, [n("button", {
          type: "button",
          class: "advanced-toggle",
          onClick: a[17] ||= T => z.value = !z.value
        }, [u(P(Va), {
          size: 12
        }), n("span", null, p(z.value ? "收起高级设置" : "高级设置"), 1), (i(), W(ma(z.value ? P(Ya) : P(Pn)), {
          size: 12
        }))]), zn(n("div", Eo, [n("div", Bo, [a[75] ||= n("span", {
          class: "adv-label"
        }, "性别", -1), u(Ae, {
          value: s.value.genderFilter,
          "onUpdate:value": a[18] ||= T => s.value.genderFilter = T,
          size: "small"
        }, {
          default: r(() => [(i(true), w(ve, null, mt(P(fa), T => {
            i();
            return W(V, {
              key: T.value,
              value: T.value
            }, {
              default: r(() => [b(p(T.label), 1)]),
              _: 2
            }, 1032, ["value"]);
          }), 128))]),
          _: 1
        }, 8, ["value"])]), n("div", Ko, [a[78] ||= n("span", {
          class: "adv-label"
        }, "年龄", -1), u(Ie, {
          checked: s.value.ageFilterEnabled,
          "onUpdate:checked": a[19] ||= T => s.value.ageFilterEnabled = T,
          size: "small"
        }, null, 8, ["checked"]), n("div", Vo, [u(Se, {
          value: s.value.ageMin,
          "onUpdate:value": a[20] ||= T => s.value.ageMin = T,
          min: 0,
          max: 120,
          disabled: !s.value.ageFilterEnabled,
          size: "small"
        }, null, 8, ["value", "disabled"]), a[76] ||= n("span", null, "—", -1), u(Se, {
          value: s.value.ageMax,
          "onUpdate:value": a[21] ||= T => s.value.ageMax = T,
          min: 0,
          max: 120,
          disabled: !s.value.ageFilterEnabled,
          size: "small"
        }, null, 8, ["value", "disabled"]), a[77] ||= n("span", {
          class: "unit"
        }, "岁", -1)])]), n("div", Ho, [a[80] ||= n("span", {
          class: "adv-label"
        }, "间隔(秒)", -1), n("div", Wo, [u(Se, {
          value: s.value.delayMin,
          "onUpdate:value": a[22] ||= T => s.value.delayMin = T,
          min: 5,
          size: "small"
        }, null, 8, ["value"]), a[79] ||= n("span", null, "—", -1), u(Se, {
          value: s.value.delayMax,
          "onUpdate:value": a[23] ||= T => s.value.delayMax = T,
          min: 10,
          size: "small"
        }, null, 8, ["value"])])]), ce.value ? (i(), w(ve, {
          key: 0
        }, [n("div", jo, [a[83] ||= n("span", {
          class: "adv-label"
        }, "私信对象", -1), u(Ae, {
          value: s.value.dmTarget,
          "onUpdate:value": a[24] ||= T => s.value.dmTarget = T,
          size: "small"
        }, {
          default: r(() => [u(Oe, {
            value: "all"
          }, {
            default: r(() => [...(a[81] ||= [b("全部", -1)])]),
            _: 1
          }), s.value.type === "follow_dm" ? (i(), W(Oe, {
            key: 0,
            value: "followed_only"
          }, {
            default: r(() => [...(a[82] ||= [b("仅关注成功", -1)])]),
            _: 1
          })) : H("", true)]),
          _: 1
        }, 8, ["value"])]), n("div", qo, [u(Pe, {
          checked: s.value.useRandomSuffix,
          "onUpdate:checked": a[25] ||= T => s.value.useRandomSuffix = T,
          size: "small"
        }, {
          default: r(() => [...(a[84] ||= [b("私信加随机表情", -1)])]),
          _: 1
        }, 8, ["checked"])])], 64)) : H("", true), !D.value && s.value.type === "follow_dm" ? (i(), w("div", Yo, [a[87] ||= n("span", {
          class: "adv-label"
        }, "关注等待", -1), n("div", Go, [u(Se, {
          value: s.value.followDmDelayMin,
          "onUpdate:value": a[26] ||= T => s.value.followDmDelayMin = T,
          min: 1,
          max: 30,
          size: "small"
        }, null, 8, ["value"]), a[85] ||= n("span", null, "—", -1), u(Se, {
          value: s.value.followDmDelayMax,
          "onUpdate:value": a[27] ||= T => s.value.followDmDelayMax = T,
          min: 2,
          max: 60,
          size: "small"
        }, null, 8, ["value"]), a[86] ||= n("span", {
          class: "unit"
        }, "秒", -1)])])) : H("", true)], 512), [[Nn, z.value]])])])]),
        _: 1
      }, 8, ["open", "confirmLoading"]);
    };
  }
};
const Xo = St(Zo, [["__scopeId", "data-v-e5597269"]]);
const Qo = {
  class: "batch-follow-history"
};
const es = {
  class: "history-toolbar"
};
const ts = {
  class: "tab-hint"
};
const ns = {
  key: 0,
  class: "time-text"
};
const as = {
  key: 3,
  class: "account-text"
};
const os = {
  key: 4,
  class: "stats-text"
};
const ss = {
  key: 5,
  class: "action-links"
};
const ls = {
  key: 0
};
const is = {
  key: 0
};
const us = {
  key: 0,
  class: "drawer-loading"
};
const rs = {
  key: 1,
  class: "detail-drawer-body"
};
const cs = {
  class: "detail-stats-row"
};
const ds = {
  class: "detail-stat"
};
const ms = {
  class: "detail-stat"
};
const fs = {
  class: "detail-stat"
};
const ps = {
  class: "stat-success"
};
const vs = {
  class: "detail-stat"
};
const gs = {
  class: "stat-error"
};
const ys = {
  class: "detail-meta"
};
const hs = {
  key: 0
};
const ks = {
  class: "account-text"
};
const bs = {
  class: "detail-toolbar"
};
const Cs = {
  class: "detail-filter-count"
};
const ws = ["title"];
const _s = ["title", "onClick"];
const Ss = ["title"];
const xs = {
  key: 4,
  class: "time-text"
};
const $s = {
  key: 0,
  class: "drawer-loading"
};
const As = {
  key: 1,
  class: "log-drawer-body"
};
const Is = {
  class: "log-stats-row"
};
const Ts = {
  class: "log-stat"
};
const zs = {
  class: "log-stat"
};
const Ns = {
  class: "stat-success"
};
const Us = {
  class: "log-stat"
};
const Ps = {
  class: "stat-error"
};
const Fs = {
  class: "log-stat"
};
const Ms = {
  class: "detail-meta"
};
const Ls = {
  class: "account-text"
};
const Rs = {
  class: "log-toolbar"
};
const Ds = {
  class: "task-log-list log-drawer-list"
};
const Os = {
  class: "log-time"
};
const Es = {
  key: 0,
  class: "log-meta"
};
const Bs = {
  class: "log-msg"
};
const Ks = {
  key: 0,
  class: "task-log-empty"
};
const Vs = "calc(100vh - 380px)";
const Hs = {
  __name: "BatchFollowHistory",
  setup(C, {
    expose: l
  }) {
    const {
      invoke: h,
      on: m,
      send: A
    } = _t();
    const $ = Kt();
    const z = E({});
    const k = E(false);
    const s = E([]);
    const D = E([]);
    const ce = E(false);
    const se = E(false);
    const L = E(null);
    const Q = E("");
    const we = E("all");
    const ne = Oa();
    function xe(f) {
      Ea(ne, f);
    }
    const q = [{
      value: "all",
      label: "全部结果"
    }, {
      value: "success",
      label: "成功"
    }, {
      value: "failed",
      label: "失败"
    }];
    const Y = E(false);
    const Ue = E(false);
    const G = E(null);
    const $e = E("");
    const ke = E({
      current: 1,
      pageSize: 10,
      total: 0,
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "50"],
      showTotal: f => `共 ${f} 次`
    });
    const Re = [{
      title: "开始时间",
      key: "startedAt",
      width: 130
    }, {
      title: "动作",
      key: "type",
      width: 100
    }, {
      title: "状态",
      key: "status",
      width: 90
    }, {
      title: "执行账号",
      key: "accounts",
      ellipsis: true
    }, {
      title: "执行进度",
      key: "stats",
      width: 220
    }, {
      title: "操作",
      key: "action",
      width: 120
    }];
    const je = [{
      title: "执行账号",
      dataIndex: "accountName",
      key: "accountName",
      width: 180
    }, {
      title: "线索对象",
      dataIndex: "leadName",
      key: "leadName",
      width: 140
    }, {
      title: "动作",
      key: "type",
      width: 100
    }, {
      title: "结果",
      key: "result"
    }, {
      title: "时间",
      key: "time",
      width: 100
    }];
    function O(f) {
      if (f == null || f === "") {
        return null;
      } else {
        return $.accounts.find(v => String(v.id) === String(f)) || null;
      }
    }
    function R(f = {}) {
      const v = Array.isArray(f.accountIds) ? f.accountIds.filter(Boolean) : [];
      if (v.length) {
        return v.map(X => {
          const re = O(X);
          if (re) {
            return Pt(re);
          } else {
            return String(X);
          }
        }).join("、") || "—";
      } else {
        return (Array.isArray(f.accountNames) ? f.accountNames.filter(Boolean) : []).join("、") || "—";
      }
    }
    function de(f = {}) {
      const v = O(f.accountId);
      if (v) {
        return Pt(v);
      } else {
        return f.accountName || "—";
      }
    }
    function pe(f = {}) {
      const v = Jt(f);
      if (v) {
        return v;
      }
      const K = String(f.leadId || "").trim();
      if (K && z.value[K]) {
        return z.value[K];
      } else {
        return "";
      }
    }
    function _e(f = {}) {
      if (pe(f)) {
        return true;
      } else {
        return !!String(f.leadId || "").trim();
      }
    }
    function De(f = {}) {
      if (String(f.error || "").includes("缺失主页")) {
        return "该线索无主页链接";
      } else {
        return "无主页链接，无法打开";
      }
    }
    async function I(f = []) {
      const v = [];
      for (const B of Array.isArray(f) ? f : []) {
        if (Jt(B)) {
          continue;
        }
        const X = String((B == null ? undefined : B.leadId) || "").trim();
        if (X) {
          if (!z.value[X]) {
            v.push(X);
          }
        }
      }
      const K = [...new Set(v)].slice(0, 500);
      if (K.length) {
        try {
          const B = await h("get-leads-by-ids", {
            ids: K
          });
          const X = Array.isArray(B == null ? undefined : B.items) ? B.items : [];
          if (!X.length) {
            return;
          }
          const re = {
            ...z.value
          };
          for (const Ce of X) {
            const Ye = Jt(Ce);
            const ft = String((Ce == null ? undefined : Ce.leadId) || (Ce == null ? undefined : Ce.key) || "").trim();
            if (Ye && ft) {
              re[ft] = Ye;
            }
            const it = String((Ce == null ? undefined : Ce.lead_user_id) || "").trim();
            if (Ye && it) {
              re[it] = Ye;
            }
          }
          z.value = re;
        } catch {}
      }
    }
    async function a(f = {}) {
      let v = pe(f);
      const K = String(f.leadId || "").trim();
      if (!v && K) {
        try {
          await I([f]);
          v = pe(f);
        } catch {}
      }
      if (!v) {
        x.warning("无法打开主页：缺少用户主页链接");
        return;
      }
      A("open-url", v);
    }
    const V = he(() => L.value ? `批量跟进详情 · ${Ie(L.value.type)}` : "批量跟进详情");
    const Ae = he(() => G.value ? `运行日志 · ${Ie(G.value.type)}` : "运行日志");
    function Pe(f = {}) {
      if (f.success && !f.skipped) {
        return "success";
      } else {
        return "failed";
      }
    }
    const Ee = he(() => {
      var B;
      const f = Array.isArray((B = L.value) == null ? undefined : B.results) ? L.value.results : [];
      const v = Q.value.trim().toLowerCase();
      const K = we.value;
      return f.filter(X => K !== "all" && Pe(X) !== K ? false : v ? `${X.leadName || ""}${X.accountName || ""}${X.error || ""}${X.skipReason || ""}`.toLowerCase().includes(v) : true);
    });
    const Z = he(() => {
      var K;
      const f = Array.isArray((K = G.value) == null ? undefined : K.logs) ? G.value.logs : [];
      const v = $e.value.trim().toLowerCase();
      if (v) {
        return f.filter(B => `${B.message || ""}${B.accountName || ""}${B.leadName || ""}`.toLowerCase().includes(v));
      } else {
        return f;
      }
    });
    async function qe(f) {
      var K;
      if ((K = navigator.clipboard) != null && K.writeText) {
        await navigator.clipboard.writeText(f);
        return;
      }
      const v = document.createElement("textarea");
      v.value = f;
      v.setAttribute("readonly", "");
      v.style.position = "fixed";
      v.style.left = "-9999px";
      document.body.appendChild(v);
      v.select();
      document.execCommand("copy");
      document.body.removeChild(v);
    }
    async function He() {
      const f = Z.value;
      if (!f.length) {
        x.warning("当前窗口暂无可复制日志");
        return;
      }
      const v = f.map(B => {
        const X = B.time || Fe(B.ts);
        const re = B.accountName ? `[${B.accountName}]` : "";
        const Ce = B.leadName ? ` @${B.leadName}` : "";
        return `[${X}] ${re}${Ce}${re || Ce ? " " : ""}${String(B.message || "").trim()}`;
      });
      const K = [Ae.value, `执行账号：${R(G.value || {})}`, `日志条数：${v.length}${$e.value ? `（筛选：${$e.value}）` : ""}`, "", ...v].join(`
`);
      try {
        await qe(K);
        x.success(`已复制 ${v.length} 条日志`);
      } catch {
        x.error("日志复制失败，请手动复制");
      }
    }
    function Ie(f) {
      if (f === "follow") {
        return "关注";
      } else if (f === "message") {
        return "私信";
      } else if (f === "follow_dm") {
        return "关注+私信";
      } else if (f === "profile_first_comment") {
        return "首作评论";
      } else {
        return "跟进";
      }
    }
    function Se(f) {
      return {
        all: "不限",
        male: "男",
        male_unknown: "男+未知",
        female: "女",
        female_unknown: "女+未知"
      }[f] || "不限";
    }
    function ee(f) {
      if (f === "running") {
        return "执行中";
      } else if (f === "stopped") {
        return "已停止";
      } else {
        return "已完成";
      }
    }
    function Oe(f) {
      if (f === "running") {
        return "processing";
      } else if (f === "stopped") {
        return "warning";
      } else {
        return "success";
      }
    }
    function Fe(f) {
      if (!f) {
        return "—";
      }
      const v = new Date(f);
      const K = `${v.getMonth() + 1}`.padStart(2, "0");
      const B = `${v.getDate()}`.padStart(2, "0");
      const X = `${v.getHours()}`.padStart(2, "0");
      const re = `${v.getMinutes()}`.padStart(2, "0");
      const Ce = `${v.getSeconds()}`.padStart(2, "0");
      return `${K}-${B} ${X}:${re}:${Ce}`;
    }
    function T(f, v = 24) {
      const K = String(f);
      if (K.length > v) {
        return `${K.slice(0, v)}…`;
      } else {
        return K;
      }
    }
    function Be(f = {}) {
      const v = Number(f.resultCount);
      if (Number.isFinite(v) && v > 0) {
        return v;
      } else if (Array.isArray(f.results)) {
        return f.results.length;
      } else {
        return 0;
      }
    }
    function vt(f = {}) {
      const v = Number(f.logCount);
      if (Number.isFinite(v) && v > 0) {
        return v;
      } else if (Array.isArray(f.logs)) {
        return f.logs.length;
      } else {
        return 0;
      }
    }
    function gt(f) {
      const v = Number(f == null ? undefined : f.pageSize) || ke.value.pageSize;
      const K = v !== ke.value.pageSize;
      ke.value.pageSize = v;
      ke.value.current = K ? 1 : Number(f == null ? undefined : f.current) || 1;
      j({
        syncOpen: false
      });
    }
    async function st(f) {
      const v = (f == null ? undefined : f.id) || (f == null ? undefined : f.runId);
      if (!v) {
        return f || null;
      }
      try {
        const K = await h("get-batch-follow-run", {
          id: v,
          runId: (f == null ? undefined : f.runId) || v
        });
        if (K && typeof K == "object") {
          return K;
        } else {
          return f;
        }
      } catch {
        return f || null;
      }
    }
    function lt() {
      L.value = null;
      Q.value = "";
      we.value = "all";
      ne.current = 1;
      z.value = {};
    }
    function o() {
      G.value = null;
      $e.value = "";
    }
    function d(f) {
      if (!f) {
        lt();
      }
    }
    function c(f) {
      if (!f) {
        o();
      }
    }
    async function M() {
      var f;
      var v;
      var K;
      var B;
      if (ce.value && ((f = L.value) != null && f.id || (v = L.value) != null && v.runId)) {
        const X = await st(L.value);
        if (X) {
          L.value = X;
          await I(X.results || []);
        }
      }
      if (Y.value && ((K = G.value) != null && K.id || (B = G.value) != null && B.runId)) {
        const X = await st(G.value);
        if (X) {
          G.value = X;
        }
      }
    }
    async function j({
      syncOpen: f = true
    } = {}) {
      k.value = true;
      try {
        const v = await h("get-batch-follow-runs-page", {
          page: ke.value.current,
          pageSize: ke.value.pageSize
        });
        const K = Array.isArray(v == null ? undefined : v.items) ? v.items : Array.isArray(v) ? v : [];
        s.value = K.slice().sort((re, Ce) => (Ce.startedAt || 0) - (re.startedAt || 0));
        const B = Number(v == null ? undefined : v.total);
        ke.value.total = Number.isFinite(B) ? B : s.value.length;
        const X = Math.max(1, Math.ceil((ke.value.total || 0) / ke.value.pageSize) || 1);
        if (ke.value.current > X && (ke.value.current = X, ke.value.total > 0)) {
          await j({
            syncOpen: false
          });
          if (f) {
            await M();
          }
          return;
        }
        if (f) {
          await M();
        }
      } catch {
        x.error("加载批量跟进记录失败");
      } finally {
        k.value = false;
      }
    }
    async function y(f) {
      Q.value = "";
      we.value = "all";
      ne.current = 1;
      se.value = true;
      ce.value = true;
      L.value = f ? {
        ...f,
        results: Array.isArray(f.results) ? f.results : []
      } : null;
      try {
        const v = await st(f);
        L.value = v;
        await I((v == null ? undefined : v.results) || []);
      } finally {
        se.value = false;
      }
    }
    async function U(f) {
      $e.value = "";
      Ue.value = true;
      Y.value = true;
      G.value = f ? {
        ...f,
        logs: Array.isArray(f.logs) ? f.logs : []
      } : null;
      try {
        G.value = await st(f);
      } finally {
        Ue.value = false;
      }
    }
    function F() {
      if (D.value.length) {
        We.confirm({
          title: "删除选中记录？",
          content: `将删除 ${D.value.length} 次批量跟进详情，不可恢复。`,
          okType: "danger",
          onOk: async () => {
            await h("delete-batch-follow-runs", D.value);
            if (L.value && D.value.includes(L.value.id)) {
              ce.value = false;
              lt();
            }
            if (G.value && D.value.includes(G.value.id)) {
              Y.value = false;
              o();
            }
            D.value = [];
            x.success("已删除");
            await j();
          }
        });
      }
    }
    function ae() {
      We.confirm({
        title: "清空全部批量跟进记录？",
        content: "清空后无法恢复历史执行详情与日志。",
        okType: "danger",
        onOk: async () => {
          await h("clear-batch-follow-runs");
          D.value = [];
          ce.value = false;
          lt();
          Y.value = false;
          o();
          x.success("已清空");
          await j();
        }
      });
    }
    let be = null;
    let ge = null;
    let ie = null;
    let ue = null;
    let fe = null;
    function Te() {
      if (fe) {
        clearTimeout(fe);
      }
      fe = setTimeout(() => {
        fe = null;
        j();
      }, 800);
    }
    function ze(f = {}) {
      if (!Y.value || !G.value) {
        return;
      }
      const v = f.runId;
      const K = f.log;
      if (!K || v != null && G.value.runId !== v && G.value.id !== v) {
        return;
      }
      const B = Array.isArray(G.value.logs) ? G.value.logs.slice() : [];
      if (!B.some(X => X.id === K.id)) {
        B.push(K);
        G.value = {
          ...G.value,
          logs: B,
          logCount: B.length
        };
      }
    }
    Vt(() => {
      j();
      be = m("batch-item-result", () => Te());
      ge = m("batch-task-complete", () => j());
      ie = m("batch-task-stopped", () => j());
      ue = m("batch-run-log", f => ze(f));
    });
    pa(() => {
      if (fe) {
        clearTimeout(fe);
      }
      if (be != null) {
        be();
      }
      if (ge != null) {
        ge();
      }
      if (ie != null) {
        ie();
      }
      if (ue != null) {
        ue();
      }
      lt();
      o();
      s.value = [];
    });
    l({
      loadRuns: j
    });
    return (f, v) => {
      const K = J("a-button");
      const B = J("a-space");
      const X = J("a-badge");
      const re = J("a-table");
      const Ce = J("a-spin");
      const Ye = J("a-tag");
      const ft = J("a-input");
      const it = J("a-select");
      const xt = J("a-tooltip");
      const Me = J("a-drawer");
      i();
      return w("div", Qo, [n("div", es, [n("span", ts, "共 " + p(ke.value.total || 0) + " 次批量跟进记录，可分别查看执行详情与运行日志", 1), u(B, null, {
        default: r(() => [u(K, {
          size: "small",
          loading: k.value,
          onClick: j
        }, {
          default: r(() => [...(v[5] ||= [b("刷新", -1)])]),
          _: 1
        }, 8, ["loading"]), u(K, {
          danger: "",
          size: "small",
          disabled: D.value.length === 0,
          onClick: F
        }, {
          default: r(() => [b(" 删除已选 (" + p(D.value.length) + ") ", 1)]),
          _: 1
        }, 8, ["disabled"]), u(K, {
          danger: "",
          size: "small",
          disabled: (ke.value.total || 0) === 0,
          onClick: ae
        }, {
          default: r(() => [...(v[6] ||= [b("清空记录", -1)])]),
          _: 1
        }, 8, ["disabled"])]),
        _: 1
      })]), u(re, {
        "row-selection": {
          selectedRowKeys: D.value,
          onChange: me => D.value = me
        },
        dataSource: s.value,
        columns: Re,
        size: "small",
        "row-key": "id",
        loading: k.value,
        pagination: ke.value,
        scroll: {
          y: "calc(100vh - 420px)"
        },
        onChange: gt
      }, {
        bodyCell: r(({
          column: me,
          record: Ne
        }) => [me.key === "startedAt" ? (i(), w("span", ns, p(Fe(Ne.startedAt)), 1)) : me.key === "type" ? (i(), w(ve, {
          key: 1
        }, [b(p(Ie(Ne.type)), 1)], 64)) : me.key === "status" ? (i(), W(X, {
          key: 2,
          status: Oe(Ne.status),
          text: ee(Ne.status)
        }, null, 8, ["status", "text"])) : me.key === "accounts" ? (i(), w("span", as, p(R(Ne)), 1)) : me.key === "stats" ? (i(), w("span", os, p(Ne.current || 0) + "/" + p(Ne.total || 0) + " · 成功 " + p(Ne.success || 0) + " · 失败 " + p((Ne.failed || 0) + (Ne.skipped || 0)), 1)) : me.key === "action" ? (i(), w("div", ss, [u(K, {
          type: "link",
          size: "small",
          onClick: Ge => y(Ne)
        }, {
          default: r(() => [v[7] ||= b(" 详情", -1), Be(Ne) ? (i(), w("span", ls, "(" + p(Be(Ne)) + ")", 1)) : H("", true)]),
          _: 2
        }, 1032, ["onClick"]), u(K, {
          type: "link",
          size: "small",
          onClick: Ge => U(Ne)
        }, {
          default: r(() => [v[8] ||= b(" 日志", -1), vt(Ne) ? (i(), w("span", is, "(" + p(vt(Ne)) + ")", 1)) : H("", true)]),
          _: 2
        }, 1032, ["onClick"])])) : H("", true)]),
        _: 1
      }, 8, ["row-selection", "dataSource", "loading", "pagination"]), u(Me, {
        open: ce.value,
        "onUpdate:open": v[2] ||= me => ce.value = me,
        title: V.value,
        width: "960",
        "destroy-on-close": "",
        class: "batch-detail-drawer",
        onAfterOpenChange: d
      }, {
        default: r(() => {
          var me;
          var Ne;
          return [(i(), w("div", {
            key: `detail-${((me = L.value) == null ? undefined : me.id) || ((Ne = L.value) == null ? undefined : Ne.runId) || "none"}`
          }, [se.value ? (i(), w("div", us, [u(Ce)])) : L.value ? (i(), w("div", rs, [n("div", cs, [n("div", ds, [v[9] ||= n("span", null, "总计", -1), n("b", null, p(L.value.total || 0), 1)]), n("div", ms, [v[10] ||= n("span", null, "已处理", -1), n("b", null, p(L.value.current || 0), 1)]), n("div", fs, [v[11] ||= n("span", null, "成功", -1), n("b", ps, p(L.value.success || 0), 1)]), n("div", vs, [v[12] ||= n("span", null, "失败", -1), n("b", gs, p((L.value.failed || 0) + (L.value.skipped || 0)), 1)])]), n("div", ys, [u(X, {
            status: Oe(L.value.status),
            text: ee(L.value.status)
          }, null, 8, ["status", "text"]), u(Ye, {
            color: "processing"
          }, {
            default: r(() => [b(p(Ie(L.value.type)), 1)]),
            _: 1
          }), u(Ye, null, {
            default: r(() => [b("性别 " + p(Se(L.value.genderFilter)), 1)]),
            _: 1
          }), n("span", null, "开始 " + p(Fe(L.value.startedAt)), 1), L.value.endedAt ? (i(), w("span", hs, "结束 " + p(Fe(L.value.endedAt)), 1)) : H("", true), n("span", ks, "执行账号 " + p(R(L.value)), 1)]), n("div", bs, [u(ft, {
            value: Q.value,
            "onUpdate:value": v[0] ||= Ge => Q.value = Ge,
            placeholder: "搜索线索对象",
            size: "small",
            "allow-clear": "",
            class: "detail-lead-search"
          }, null, 8, ["value"]), u(it, {
            value: we.value,
            "onUpdate:value": v[1] ||= Ge => we.value = Ge,
            size: "small",
            class: "detail-result-filter",
            options: q
          }, null, 8, ["value"]), n("span", Cs, " 显示 " + p(Ee.value.length) + "/" + p((L.value.results || []).length), 1)]), u(re, {
            dataSource: Ee.value,
            columns: je,
            size: "small",
            "row-key": "id",
            pagination: P(ne),
            scroll: {
              y: Vs
            },
            class: "result-inner-table",
            onChange: xe
          }, {
            bodyCell: r(({
              column: Ge,
              record: Le
            }) => [Ge.key === "accountName" ? (i(), w("span", {
              key: 0,
              class: "account-text",
              title: de(Le)
            }, p(de(Le)), 9, ws)) : Ge.key === "leadName" ? (i(), w(ve, {
              key: 1
            }, [_e(Le) ? (i(), w("a", {
              key: 0,
              href: "#",
              class: "lead-profile-link",
              title: pe(Le) || "打开主页",
              onClick: ot(Xe => a(Le), ["prevent"])
            }, p(Le.leadName || "—"), 9, _s)) : (i(), w("span", {
              key: 1,
              class: "lead-profile-muted",
              title: De(Le)
            }, p(Le.leadName || "—"), 9, Ss))], 64)) : Ge.key === "type" ? (i(), w(ve, {
              key: 2
            }, [b(p(Ie(Le.type)), 1)], 64)) : Ge.key === "result" ? (i(), w(ve, {
              key: 3
            }, [Le.success && !Le.skipped ? (i(), W(X, {
              key: 0,
              status: "success",
              text: "成功"
            })) : (i(), W(xt, {
              key: 1,
              title: Le.error || Le.skipReason || "失败"
            }, {
              default: r(() => [u(X, {
                status: "error",
                text: T(Le.error || Le.skipReason || "失败", 24)
              }, null, 8, ["text"])]),
              _: 2
            }, 1032, ["title"]))], 64)) : Ge.key === "time" ? (i(), w("span", xs, p(Le.time || Fe(Le.timestamp)), 1)) : H("", true)]),
            _: 1
          }, 8, ["dataSource", "pagination", "scroll"])])) : H("", true)]))];
        }),
        _: 1
      }, 8, ["open", "title"]), u(Me, {
        open: Y.value,
        "onUpdate:open": v[4] ||= me => Y.value = me,
        title: Ae.value,
        width: "520",
        "destroy-on-close": "",
        class: "batch-log-drawer",
        onAfterOpenChange: c
      }, {
        default: r(() => [Ue.value ? (i(), w("div", $s, [u(Ce)])) : G.value ? (i(), w("div", As, [n("div", Is, [n("div", Ts, [v[13] ||= n("span", null, "总计", -1), n("b", null, p(G.value.total || 0), 1)]), n("div", zs, [v[14] ||= n("span", null, "成功", -1), n("b", Ns, p(G.value.success || 0), 1)]), n("div", Us, [v[15] ||= n("span", null, "失败", -1), n("b", Ps, p((G.value.failed || 0) + (G.value.skipped || 0)), 1)]), n("div", Fs, [v[16] ||= n("span", null, "日志", -1), n("b", null, p((G.value.logs || []).length), 1)])]), n("div", Ms, [u(X, {
          status: Oe(G.value.status),
          text: ee(G.value.status)
        }, null, 8, ["status", "text"]), u(Ye, {
          color: "processing"
        }, {
          default: r(() => [b(p(Ie(G.value.type)), 1)]),
          _: 1
        }), n("span", Ls, "执行账号 " + p(R(G.value)), 1)]), n("div", Rs, [u(ft, {
          value: $e.value,
          "onUpdate:value": v[3] ||= me => $e.value = me,
          placeholder: "搜索日志",
          size: "small",
          "allow-clear": "",
          class: "log-search"
        }, null, 8, ["value"]), u(K, {
          size: "small",
          disabled: Z.value.length === 0,
          onClick: He
        }, {
          default: r(() => [...(v[17] ||= [b(" 复制日志 ", -1)])]),
          _: 1
        }, 8, ["disabled"])]), n("div", Ds, [(i(true), w(ve, null, mt(Z.value, me => {
          i();
          return w("div", {
            key: me.id,
            class: nn(["task-log-line", `level-${me.level || "normal"}`])
          }, [n("span", Os, p(me.time || Fe(me.ts)), 1), me.accountName || me.leadName ? (i(), w("span", Es, [me.accountName ? (i(), w(ve, {
            key: 0
          }, [b("[" + p(me.accountName) + "]", 1)], 64)) : H("", true), me.leadName ? (i(), w(ve, {
            key: 1
          }, [b(" @" + p(me.leadName), 1)], 64)) : H("", true)])) : H("", true), n("span", Bs, p(me.message), 1)], 2);
        }), 128)), Z.value.length === 0 ? (i(), w("div", Ks, "暂无日志")) : H("", true)])])) : H("", true)]),
        _: 1
      }, 8, ["open", "title"])]);
    };
  }
};
const Ws = St(Hs, [["__scopeId", "data-v-e40d133a"]]);
const js = {
  class: "video-main-comments-panel"
};
const qs = {
  class: "panel-toolbar"
};
const Ys = {
  class: "tab-hint"
};
const Gs = ["onClick"];
const Js = {
  class: "comment-text"
};
const Zs = {
  key: 1,
  class: "comment-empty"
};
const Xs = ["title"];
const Qs = {
  key: 3,
  class: "mono"
};
const el = {
  key: 4,
  class: "time-text"
};
const tl = {
  __name: "VideoMainCommentsPanel",
  props: {
    active: {
      type: Boolean,
      default: false
    },
    formatAccountLabel: {
      type: Function,
      default: null
    },
    formatTime: {
      type: Function,
      required: true
    },
    openExternal: {
      type: Function,
      required: true
    }
  },
  setup(C, {
    expose: l
  }) {
    const {
      invoke: h
    } = _t();
    const m = C;
    const A = Kt();
    const $ = E(false);
    const z = E("");
    const k = E(undefined);
    const s = E([]);
    const D = E([]);
    const ce = E(1);
    const se = E(20);
    const L = E(0);
    const Q = [{
      title: "视频",
      key: "title",
      width: 180,
      ellipsis: true
    }, {
      title: "评论内容",
      key: "content",
      ellipsis: true
    }, {
      title: "获取账号",
      key: "account",
      width: 140,
      ellipsis: true
    }, {
      title: "视频 ID",
      key: "videoId",
      width: 150,
      ellipsis: true
    }, {
      title: "记录时间",
      key: "time",
      width: 150
    }, {
      title: "操作",
      key: "action",
      width: 140
    }];
    const we = he(() => ({
      current: ce.value,
      pageSize: se.value,
      total: L.value,
      showSizeChanger: true,
      pageSizeOptions: ["20", "50", "100"],
      showTotal: O => `共 ${O} 条`
    }));
    const ne = he(() => {
      const O = new Map();
      for (const R of A.accounts || []) {
        const de = String((R == null ? undefined : R.id) || "").trim();
        if (de) {
          O.set(de, {
            value: de,
            label: xe({
              accountId: de,
              accountName: R.name || R.nickname
            })
          });
        }
      }
      for (const R of s.value) {
        const de = String(R.accountId || "").trim();
        if (!!de && !O.has(de)) {
          O.set(de, {
            value: de,
            label: R.accountLabel || de
          });
        }
      }
      return [...O.values()];
    });
    function xe(O = {}) {
      if (typeof m.formatAccountLabel == "function") {
        return m.formatAccountLabel(O, O.accountId || "未知账号");
      }
      const R = (A.accounts || []).find(de => String(de.id) === String(O.accountId || ""));
      if (R) {
        if (R.nickname) {
          return `${R.nickname}（${R.name || R.id}）`;
        } else {
          return R.name || R.id;
        }
      } else {
        return O.accountName || O.accountId || "未知账号";
      }
    }
    function q(O) {
      const R = String((O == null ? undefined : O.accountId) || "default");
      const de = String((O == null ? undefined : O.videoId) || "");
      return `${R}::${de}`;
    }
    async function Y({
      resetPage: O = false
    } = {}) {
      if (O) {
        ce.value = 1;
      }
      $.value = true;
      try {
        const R = await h("get-video-main-comments", {
          accountId: k.value || "",
          keyword: z.value || "",
          page: ce.value,
          pageSize: se.value
        });
        const de = Array.isArray(R == null ? undefined : R.items) ? R.items : [];
        s.value = de.map(_e => ({
          ..._e,
          key: q(_e),
          content: String(_e.content || _e.comment || "").trim(),
          accountLabel: xe(_e)
        }));
        L.value = Number(R == null ? undefined : R.total) || 0;
        const pe = Math.max(1, Math.ceil(L.value / se.value) || 1);
        if (ce.value > pe && (ce.value = pe, L.value > 0)) {
          await Y();
          return;
        }
      } catch (R) {
        console.error("[VideoMainComments] load failed:", R);
        x.error("加载视频主评记录失败");
        s.value = [];
        L.value = 0;
      } finally {
        $.value = false;
      }
    }
    function Ue(O) {
      ce.value = Number(O == null ? undefined : O.current) || 1;
      se.value = Number(O == null ? undefined : O.pageSize) || se.value;
      Y();
    }
    async function G(O) {
      var de;
      const R = String(O || "").trim();
      if (!R) {
        return x.warning("没有可复制的链接");
      }
      try {
        if ((de = navigator.clipboard) != null && de.writeText) {
          await navigator.clipboard.writeText(R);
        } else {
          const pe = document.createElement("textarea");
          pe.value = R;
          document.body.appendChild(pe);
          pe.select();
          document.execCommand("copy");
          pe.remove();
        }
        x.success("链接已复制");
      } catch {
        x.error("复制失败");
      }
    }
    async function $e(O) {
      if (!O.length) {
        return;
      }
      const R = await h("remove-video-main-comments", {
        keys: O
      });
      if (R != null && R.success) {
        x.success(`已删除 ${R.removed || O.length} 条`);
        D.value = [];
        await Y();
      } else {
        x.error((R == null ? undefined : R.error) || "删除失败");
      }
    }
    function ke(O) {
      We.confirm({
        title: "删除这条主评记录？",
        content: "删除后，该账号再次遇到同一视频时可以重新发表主贴评论。",
        onOk: () => $e([O.key])
      });
    }
    function Re() {
      const O = [...D.value];
      if (O.length) {
        We.confirm({
          title: `确认删除选中的 ${O.length} 条？`,
          content: "删除后对应账号可再次对这些视频发主评。",
          onOk: () => $e(O)
        });
      }
    }
    function je() {
      We.confirm({
        title: "确认清空全部视频主评记录？",
        content: "清空后，所有账号的「已主评视频」去重记忆将失效，可能对同一视频重复发表主贴评论。历史视频 / 采集库不受影响。",
        okType: "danger",
        onOk: async () => {
          const O = await h("clear-video-main-comments");
          if (O != null && O.success) {
            x.success(`已清空 ${O.cleared || 0} 条`);
            D.value = [];
            await Y();
          } else {
            x.error((O == null ? undefined : O.error) || "清空失败");
          }
        }
      });
    }
    Ve(() => m.active, O => {
      if (O) {
        Y();
      }
    });
    Vt(() => {
      if (m.active) {
        Y();
      }
    });
    l({
      reload: Y
    });
    return (O, R) => {
      const de = J("a-input-search");
      const pe = J("a-select");
      const _e = J("a-button");
      const De = J("a-tooltip");
      const I = J("a-table");
      i();
      return w("div", js, [n("div", qs, [u(de, {
        value: z.value,
        "onUpdate:value": R[0] ||= a => z.value = a,
        placeholder: "搜索标题、评论内容、视频链接或 ID...",
        class: "main-search",
        size: "small",
        "allow-clear": "",
        onSearch: R[1] ||= () => Y({
          resetPage: true
        })
      }, null, 8, ["value"]), u(pe, {
        value: k.value,
        "onUpdate:value": R[2] ||= a => k.value = a,
        "allow-clear": "",
        placeholder: "获取账号",
        size: "small",
        style: {
          width: "180px"
        },
        options: ne.value,
        onChange: R[3] ||= () => Y({
          resetPage: true
        })
      }, null, 8, ["value", "options"]), n("span", Ys, "共 " + p(L.value) + " 条 · 删除后同一账号可再次对该视频发主评", 1), u(_e, {
        danger: "",
        size: "small",
        disabled: D.value.length === 0,
        onClick: Re
      }, {
        default: r(() => [b(" 批量删除 (" + p(D.value.length) + ") ", 1)]),
        _: 1
      }, 8, ["disabled"]), u(_e, {
        danger: "",
        size: "small",
        disabled: L.value === 0,
        onClick: je
      }, {
        default: r(() => [...(R[4] ||= [b(" 清空全部 ", -1)])]),
        _: 1
      }, 8, ["disabled"])]), u(I, {
        "row-selection": {
          selectedRowKeys: D.value,
          preserveSelectedRowKeys: true,
          onChange: a => {
            D.value = a;
          }
        },
        "data-source": s.value,
        columns: Q,
        size: "small",
        "row-key": "key",
        loading: $.value,
        pagination: we.value,
        scroll: {
          y: "calc(100vh - 380px)"
        },
        onChange: Ue
      }, {
        bodyCell: r(({
          column: a,
          record: V
        }) => [a.key === "title" ? (i(), w("a", {
          key: 0,
          href: "#",
          class: "video-link resource-title-link",
          onClick: ot(Ae => C.openExternal(V.url), ["prevent"])
        }, p(V.title || "未知视频"), 9, Gs)) : a.key === "content" ? (i(), w(ve, {
          key: 1
        }, [V.content ? (i(), W(De, {
          key: 0,
          title: V.content,
          placement: "topLeft"
        }, {
          default: r(() => [n("span", Js, p(V.content), 1)]),
          _: 2
        }, 1032, ["title"])) : (i(), w("span", Zs, "—"))], 64)) : a.key === "account" ? (i(), w("span", {
          key: 2,
          title: V.accountLabel
        }, p(V.accountLabel), 9, Xs)) : a.key === "videoId" ? (i(), w("span", Qs, p(V.videoId || "-"), 1)) : a.key === "time" ? (i(), w("span", el, p(C.formatTime(V.timestamp)), 1)) : a.key === "action" ? (i(), w(ve, {
          key: 5
        }, [u(_e, {
          type: "link",
          size: "small",
          onClick: Ae => G(V.url)
        }, {
          default: r(() => [...(R[5] ||= [b("复制链接", -1)])]),
          _: 1
        }, 8, ["onClick"]), u(_e, {
          type: "link",
          size: "small",
          danger: "",
          onClick: Ae => ke(V)
        }, {
          default: r(() => [...(R[6] ||= [b("删除", -1)])]),
          _: 1
        }, 8, ["onClick"])], 64)) : H("", true)]),
        _: 1
      }, 8, ["row-selection", "data-source", "loading", "pagination"])]);
    };
  }
};
const nl = St(tl, [["__scopeId", "data-v-b1419321"]]);
const al = /(MS4wLjABAAAA[A-Za-z0-9_-]+)/i;
const ol = /^[A-Za-z0-9_-]{16,}$/;
function Ot(C) {
  const l = String(C || "").trim();
  if (l) {
    return `https://www.douyin.com/user/${l}`;
  } else {
    return "";
  }
}
function sl(C) {
  const l = String(C || "").trim();
  if (!l) {
    return {
      ok: false,
      raw: l,
      reason: "空行"
    };
  }
  const h = va(l, {
    preserveSearch: false
  });
  if (h) {
    const $ = ga(h);
    if ($) {
      return {
        ok: true,
        raw: l,
        secUid: $,
        userUrl: Ot($)
      };
    } else {
      return {
        ok: false,
        raw: l,
        reason: "无法从链接提取 UID"
      };
    }
  }
  let m = l.split(/[?#\s,，;；|]+/)[0] || "";
  m = m.replace(/^["']|["']$/g, "").trim();
  const A = m.match(al);
  if (A != null && A[1]) {
    const $ = A[1];
    return {
      ok: true,
      raw: l,
      secUid: $,
      userUrl: Ot($)
    };
  }
  if (/^\d+$/.test(m)) {
    return {
      ok: false,
      raw: l,
      reason: "疑似短号，当前仅支持 UID"
    };
  } else if (ol.test(m) && /[A-Za-z]/.test(m)) {
    return {
      ok: true,
      raw: l,
      secUid: m,
      userUrl: Ot(m)
    };
  } else {
    return {
      ok: false,
      raw: l,
      reason: "无法识别为 UID 或用户主页链接"
    };
  }
}
function ll(C) {
  return String(C || "").split(/\r?\n/).map(l => l.trim()).filter(Boolean);
}
function il(C) {
  const l = ll(C);
  const h = new Set();
  const m = [];
  const A = [];
  for (const $ of l) {
    const z = sl($);
    if (!z.ok) {
      A.push(z);
      continue;
    }
    if (h.has(z.secUid)) {
      A.push({
        ...z,
        ok: false,
        reason: "重复 UID"
      });
      continue;
    }
    h.add(z.secUid);
    m.push(z);
  }
  return {
    accepted: m,
    rejected: A,
    totalLines: l.length
  };
}
function ul(C) {
  const l = String((C == null ? undefined : C.secUid) || "").trim();
  const h = String((C == null ? undefined : C.userUrl) || "").trim() || Ot(l);
  const m = Date.now();
  return {
    leadId: l,
    key: l,
    userUrl: h,
    nickname: "",
    platform: "DY",
    content: "",
    entrySource: "import",
    entryLabel: "UID导入",
    taskId: "import_uid",
    taskName: "UID导入",
    timestamp: m,
    capturedAt: m,
    source: "import"
  };
}
const rl = {
  class: "import-modal"
};
const cl = {
  class: "actions-row"
};
const dl = {
  key: 0,
  class: "file-name"
};
const ml = {
  __name: "LeadImportModal",
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:open", "import"],
  setup(C, {
    emit: l
  }) {
    const h = C;
    const m = l;
    const A = E("");
    const $ = E("");
    const z = E(false);
    const k = E(null);
    const s = he(() => il(A.value));
    Ve(() => h.open, L => {
      if (L) {
        A.value = "";
        $.value = "";
        z.value = false;
        if (k.value) {
          k.value.value = "";
        }
      }
    });
    function D() {
      var L;
      if ((L = k.value) != null) {
        L.click();
      }
    }
    function ce(L) {
      var ne;
      var xe;
      const Q = (xe = (ne = L == null ? undefined : L.target) == null ? undefined : ne.files) == null ? undefined : xe[0];
      if (!Q) {
        return;
      }
      const we = new FileReader();
      we.onload = () => {
        const q = String(we.result || "");
        if (!q.trim()) {
          x.warning("TXT 文件为空");
          return;
        }
        A.value = A.value ? `${A.value.trim()}
${q}` : q;
        $.value = Q.name || "import.txt";
        x.success(`已读入 ${$.value}`);
      };
      we.onerror = () => {
        x.error("读取 TXT 失败");
      };
      we.readAsText(Q, "UTF-8");
      L.target.value = "";
    }
    async function se() {
      const {
        accepted: L,
        rejected: Q
      } = s.value;
      if (L.length === 0) {
        x.warning(Q.length ? "没有可导入的有效 UID" : "请先粘贴或上传 UID");
        return;
      }
      z.value = true;
      try {
        m("import", {
          accepted: L,
          rejected: Q
        });
        m("update:open", false);
      } finally {
        z.value = false;
      }
    }
    return (L, Q) => {
      const we = J("a-textarea");
      const ne = J("a-button");
      const xe = J("a-alert");
      const q = J("a-modal");
      i();
      return W(q, {
        open: C.open,
        title: "导入 UID 到线索库",
        width: 560,
        "confirm-loading": z.value,
        "ok-text": "写入线索库",
        "cancel-text": "取消",
        "destroy-on-close": "",
        onOk: se,
        onCancel: Q[1] ||= Y => m("update:open", false)
      }, {
        default: r(() => [n("div", rl, [Q[3] ||= n("p", {
          class: "hint"
        }, [b(" 仅支持用户 UID（sec_uid），例如 "), n("code", null, "MS4wLjABAAAA..."), b("。也可粘贴用户主页链接（ "), n("code", null, "…/user/UID"), b(" ）。每行一个 UID。导入时不打开主页，按 UID 去重合并进线索库。 ")], -1), u(we, {
          value: A.value,
          "onUpdate:value": Q[0] ||= Y => A.value = Y,
          rows: 8,
          placeholder: "每行一个 UID",
          "allow-clear": ""
        }, null, 8, ["value"]), n("div", cl, [u(ne, {
          size: "small",
          onClick: D
        }, {
          default: r(() => [...(Q[2] ||= [b("从 TXT 文件导入", -1)])]),
          _: 1
        }), n("input", {
          ref_key: "fileInputRef",
          ref: k,
          type: "file",
          class: "file-input-hidden",
          accept: ".txt,text/plain",
          onChange: ce
        }, null, 544), $.value ? (i(), w("span", dl, "已读入：" + p($.value), 1)) : H("", true)]), s.value.totalLines > 0 ? (i(), W(xe, {
          key: 0,
          type: "info",
          "show-icon": "",
          class: "preview",
          message: `识别 ${s.value.accepted.length} 个有效 UID，跳过 ${s.value.rejected.length} 行`
        }, null, 8, ["message"])) : H("", true)])]),
        _: 1
      }, 8, ["open", "confirm-loading"]);
    };
  }
};
const fl = St(ml, [["__scopeId", "data-v-2953bd3b"]]);
function Fn(C) {
  const l = C == null ? undefined : C.platform;
  if (l === "DY" || l === "抖音" || l === "douyin") {
    return "douyin";
  } else {
    return null;
  }
}
function pl(C, l, h = []) {
  const m = (l || []).filter(Boolean);
  if (!m.length) {
    return C;
  }
  const A = new Map((h || []).map(k => [k.id, k]));
  const $ = {
    douyin: []
  };
  for (const k of m) {
    const s = A.get(k);
    if (s && s.platform === "douyin") {
      $.douyin.push(k);
    }
  }
  const z = {
    douyin: 0
  };
  return C.map(k => {
    const s = Fn(k);
    const D = s ? $[s] : null;
    if (D == null || !D.length) {
      return k;
    }
    const ce = D[z[s]++ % D.length];
    const se = A.get(ce);
    return {
      ...k,
      accountId: ce,
      accountName: se ? Pt(se) : k.accountName || ""
    };
  });
}
function vl(C, l, h = []) {
  const m = new Map((h || []).map(z => [z.id, z]));
  const A = new Set(l.map(z => {
    var k;
    if ((k = m.get(z)) == null) {
      return undefined;
    } else {
      return k.platform;
    }
  }).filter(Boolean));
  const $ = new Set(C.map(z => Fn(z)).filter(Boolean));
  for (const z of $) {
    if (!A.has(z)) {
      return {
        ok: false,
        message: "线索平台与所选执行账号不匹配"
      };
    }
  }
  return {
    ok: true
  };
}
function gl(C, l, h = false) {
  const m = {};
  for (const A of l || []) {
    const $ = Un(C, A, h);
    if ($) {
      m[A] = {
        aiRole: $.role,
        aiGoal: $.purpose || $.goal,
        aiStyle: $.style,
        aiPrompt: $.prompt,
        firstPostGoal: $.firstPostGoal || "",
        firstPostStyle: $.firstPostStyle || "",
        firstPostPrompt: $.firstPostPrompt || "",
        videoGoal: $.videoGoal || "",
        videoStyle: $.videoStyle || "",
        videoPrompt: $.videoPrompt || ""
      };
    }
  }
  return m;
}
const In = Object.freeze([{
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
function yl(C) {
  const l = String(C || "").trim();
  if (l) {
    return `https://www.douyin.com/user/${l}`;
  } else {
    return "";
  }
}
function Mn(C) {
  const l = String(C || "").trim();
  if (!l) {
    return "";
  }
  try {
    const h = new URL(l.startsWith("http") ? l : `https://${l}`);
    if (!h.hostname.toLowerCase().endsWith("douyin.com")) {
      return "";
    }
    const A = h.pathname.match(/\/(?:share\/)?user\/([^/?#]+)/i);
    const $ = decodeURIComponent((A == null ? undefined : A[1]) || h.searchParams.get("sec_uid") || "").trim();
    if ($) {
      return `https://www.douyin.com/user/${$}`;
    } else {
      return "";
    }
  } catch {
    return "";
  }
}
function hl(C) {
  var h;
  const l = Mn(C);
  return l && ((h = l.match(/\/user\/([^/?#]+)/)) == null ? undefined : h[1]) || "";
}
function kl(C) {
  const l = String(C || "").trim();
  if (!l || /\/user\//i.test(l) && !/(?:video|note)\/\d{10,}/i.test(l) && !/modal_id=\d{10,}/i.test(l)) {
    return "";
  }
  const h = l.match(/(?:video|note)\/(\d{10,})/i) || l.match(/modal_id=(\d{10,})/i) || l.match(/aweme_id=(\d{10,})/i);
  if (h != null && h[1]) {
    return `https://www.douyin.com/video/${h[1]}`;
  } else {
    return "";
  }
}
function bl(C) {
  const l = String(C || "").replace(/^\uFEFF/, "");
  const h = [];
  let m = "";
  let A = false;
  for (let $ = 0; $ < l.length; $ += 1) {
    const z = l[$];
    if (z === "\"") {
      m += z;
      if (A && l[$ + 1] === "\"") {
        m += l[$ + 1];
        $ += 1;
        continue;
      }
      A = !A;
      continue;
    }
    if ((z === `
` || z === "\r") && !A) {
      if (z === "\r" && l[$ + 1] === `
`) {
        $ += 1;
      }
      if (String(m).trim()) {
        h.push(m);
      }
      m = "";
      continue;
    }
    m += z;
  }
  if (String(m).trim()) {
    h.push(m);
  }
  return h;
}
function Tn(C) {
  const l = [];
  let h = "";
  let m = false;
  for (let A = 0; A < C.length; A += 1) {
    const $ = C[A];
    if (m) {
      if ($ === "\"") {
        if (C[A + 1] === "\"") {
          h += "\"";
          A += 1;
        } else {
          m = false;
        }
      } else {
        h += $;
      }
      continue;
    }
    if ($ === "\"") {
      m = true;
      continue;
    }
    if ($ === ",") {
      l.push(h);
      h = "";
      continue;
    }
    h += $;
  }
  l.push(h);
  return l;
}
function Cl(C) {
  const l = bl(C);
  if (!l.length) {
    return {
      headers: [],
      rows: []
    };
  }
  const h = Tn(l[0]).map(A => String(A || "").trim());
  const m = [];
  for (let A = 1; A < l.length; A += 1) {
    const $ = Tn(l[A]);
    const z = {};
    h.forEach((k, s) => {
      z[k] = $[s] != null ? String($[s]) : "";
    });
    m.push(z);
  }
  return {
    headers: h,
    rows: m
  };
}
function wl(C) {
  const l = String(C || "").trim();
  return l === "是" || l === "true" || l === "TRUE" || l === "1";
}
function zt(C) {
  const l = Number(String(C || "").replace(/[^\d.-]/g, ""));
  if (Number.isFinite(l)) {
    return Math.max(0, Math.floor(l));
  } else {
    return 0;
  }
}
function _l(C) {
  const l = String(C || "").trim();
  if (!l || l === "未知") {
    return 0;
  }
  const h = Number(l);
  if (Number.isFinite(h) && h > 100000000000) {
    return Math.floor(h);
  }
  const m = Date.parse(l);
  if (Number.isFinite(m) && m > 0) {
    return m;
  }
  let A = l.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})(?:[\sT]+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
  if (A) {
    const $ = new Date(Number(A[1]), Number(A[2]) - 1, Number(A[3]), Number(A[4] || 0), Number(A[5] || 0), Number(A[6] || 0));
    if (Number.isFinite($.getTime())) {
      return $.getTime();
    }
  }
  A = l.match(/^(\d{1,2})[-/.](\d{1,2})(?:[\sT]+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
  if (A) {
    const $ = new Date(new Date().getFullYear(), Number(A[1]) - 1, Number(A[2]), Number(A[3] || 0), Number(A[4] || 0), Number(A[5] || 0));
    if (Number.isFinite($.getTime())) {
      return $.getTime();
    }
  }
  return 0;
}
function Sl(C) {
  const l = String(C || "").trim();
  if (!l || l === "CSV导入" || l === "UID导入") {
    return {
      entrySource: "import",
      entryLabel: l || "CSV导入",
      taskId: "import_csv",
      taskName: "CSV导入"
    };
  }
  for (const h of In) {
    if (h.label === l) {
      if (h.value === "import") {
        return {
          entrySource: "import",
          entryLabel: l,
          taskId: "import_csv",
          taskName: "CSV导入"
        };
      }
      if (h.value === "monitor") {
        return {
          entrySource: "monitor",
          entryLabel: l,
          taskId: "import_csv",
          taskName: l
        };
      }
      if (String(h.value).startsWith("entity_")) {
        return {
          entrySource: h.value,
          entryLabel: l,
          taskId: "import_csv",
          taskName: l
        };
      }
      if (h.value === "leadgen") {
        return {
          entrySource: "search",
          entryLabel: "评论获客",
          taskId: "import_csv",
          taskName: "评论获客"
        };
      }
    }
  }
  if (l.startsWith("监控") || l.includes("监控:") || l.includes("监控：")) {
    return {
      entrySource: "monitor",
      entryLabel: l,
      taskId: "import_csv",
      taskName: l
    };
  }
  if (l.startsWith("搜索:") || l.startsWith("搜索：") || l === "推荐页" || l === "关注列表" || l === "喜欢列表" || l === "指定视频") {
    return {
      entrySource: l === "关注列表" ? "follow" : l === "推荐页" ? "recommend" : l === "喜欢列表" ? "like" : l === "指定视频" ? "specific" : "search",
      entryLabel: l,
      taskId: "import_csv",
      taskName: l
    };
  }
  if (l.includes("线索采集") || l.includes("实体获客")) {
    const h = In.find(m => String(m.value).startsWith("entity_") && l.includes(String(m.label).replace(/^线索采集：/, "")));
    if (h) {
      return {
        entrySource: h.value,
        entryLabel: h.label,
        taskId: "import_csv",
        taskName: h.label
      };
    }
  }
  return {
    entrySource: "import",
    entryLabel: l,
    taskId: "import_csv",
    taskName: "CSV导入"
  };
}
function xl(C = {}) {
  var ne;
  const l = String(C.用户主页 || C.userUrl || "").trim();
  const h = Mn(l) || l;
  const m = hl(h) || ((ne = h.match(/MS4wLjABAAAA[A-Za-z0-9_-]+/i)) == null ? undefined : ne[0]) || "";
  const A = h || (m ? yl(m) : "");
  if (!A || !m) {
    return {
      ok: false,
      reason: "缺少有效用户主页"
    };
  }
  const $ = _l(C.获取时间) || Date.now();
  const z = zt(C.点赞次数);
  const k = zt(C.回复次数);
  const s = zt(C.关注次数);
  const D = zt(C.私信次数);
  const ce = zt(C.首作评论次数);
  const se = xa(C.作品数);
  const L = Sl(C.线索来源 || C.entryLabel);
  const Q = kl(C.视频链接 || C.videoUrl || "");
  const we = String(C.地区 || "").trim();
  return {
    ok: true,
    lead: {
      leadId: m,
      key: m,
      platform: String(C.平台 || "DY").trim() || "DY",
      nickname: String(C.用户昵称 || "").trim(),
      userUrl: A,
      secUid: m,
      searchKeyword: String(C.搜索词 || "").trim(),
      isHighIntention: wl(C.有意向),
      aiThought: String(C.AI分析结果 || "").trim(),
      thought: String(C.AI分析结果 || "").trim(),
      title: String(C.视频标题 || "").trim(),
      videoUrl: Q,
      url: Q || A,
      content: String(C.评论内容 || "").trim(),
      timeText: String(C.评论时间 || "").trim(),
      ipLocation: we,
      location: we,
      accountName: String(C.获取账号 || "").trim(),
      worksCount: se,
      noWorks: se === 0,
      touchCounts: {
        like: z,
        reply: k,
        follow: s,
        message: D,
        profileComment: ce,
        videoComment: 0
      },
      liked: z > 0,
      replied: k > 0 || ce > 0,
      followed: s > 0,
      messaged: D > 0,
      entrySource: L.entrySource,
      entryLabel: L.entryLabel,
      taskId: L.taskId,
      taskName: L.taskName,
      timestamp: $,
      capturedAt: new Date($).toISOString(),
      source: "import_csv"
    }
  };
}
function $l(C) {
  const {
    rows: l
  } = Cl(C);
  const h = [];
  const m = [];
  const A = new Set();
  for (const $ of l) {
    const z = xl($);
    if (!z.ok) {
      m.push({
        row: $,
        reason: z.reason
      });
      continue;
    }
    const k = z.lead.leadId;
    if (A.has(k)) {
      m.push({
        row: $,
        reason: "重复用户主页"
      });
      continue;
    }
    A.add(k);
    h.push(z.lead);
  }
  return {
    accepted: h,
    rejected: m,
    totalRows: l.length
  };
}
function Al(C) {
  if (C == null || C === "") {
    return "";
  }
  const l = new Date(C);
  if (!Number.isFinite(l.getTime())) {
    return String(C);
  }
  const h = m => String(m).padStart(2, "0");
  return `${l.getFullYear()}-${h(l.getMonth() + 1)}-${h(l.getDate())} ${h(l.getHours())}:${h(l.getMinutes())}:${h(l.getSeconds())}`;
}
function Il(C, l = {}) {
  var z;
  var k;
  var s;
  var D;
  var ce;
  const h = C || {};
  const m = typeof l.formatTime == "function" ? l.formatTime : Al;
  const A = (h.ipLocation || h.location || "") === "未知" ? "" : h.ipLocation || h.location || "";
  const $ = $a(h);
  return {
    平台: h.platform || "DY",
    用户昵称: h.nickname || "",
    线索来源: tn(h),
    搜索词: h.searchKeyword || "",
    有意向: h.isHighIntention ? "是" : "否",
    AI分析结果: h.aiThought || h.thought || "",
    用户主页: h.userUrl || "",
    视频标题: h.title || "",
    视频链接: $,
    评论内容: dt(h),
    评论时间: Ia(h.timeText) || h.timeText || "",
    地区: A,
    获取时间: m(h.timestamp || h.capturedAt),
    获取账号: h.accountName || "",
    作品数: Aa(h.worksCount),
    触达总计: Nt(h.touchCounts),
    点赞次数: ((z = h.touchCounts) == null ? undefined : z.like) || 0,
    回复次数: ((k = h.touchCounts) == null ? undefined : k.reply) || 0,
    关注次数: ((s = h.touchCounts) == null ? undefined : s.follow) || 0,
    私信次数: ((D = h.touchCounts) == null ? undefined : D.message) || 0,
    首作评论次数: ((ce = h.touchCounts) == null ? undefined : ce.profileComment) || 0
  };
}
const Tl = {
  class: "lead-pool-view"
};
const zl = {
  class: "header-with-stats"
};
const Nl = {
  class: "title-group"
};
const Ul = {
  key: 0,
  class: "quick-stats"
};
const Pl = {
  class: "stat-item"
};
const Fl = {
  class: "stat-text"
};
const Ml = {
  class: "stat-value"
};
const Ll = {
  class: "stat-item"
};
const Rl = {
  class: "stat-text"
};
const Dl = {
  class: "stat-value"
};
const Ol = {
  class: "stat-item"
};
const El = {
  class: "stat-text"
};
const Bl = {
  class: "stat-value"
};
const Kl = {
  class: "stat-item"
};
const Vl = {
  class: "stat-text"
};
const Hl = {
  class: "stat-value"
};
const Wl = {
  class: "stat-item"
};
const jl = {
  class: "stat-text"
};
const ql = {
  class: "stat-value"
};
const Yl = {
  class: "stat-item"
};
const Gl = {
  class: "stat-text"
};
const Jl = {
  class: "stat-value"
};
const Zl = {
  class: "stat-item"
};
const Xl = {
  class: "stat-text"
};
const Ql = {
  class: "stat-value"
};
const ei = {
  class: "stat-item"
};
const ti = {
  class: "stat-text"
};
const ni = {
  class: "stat-value"
};
const ai = {
  key: 0,
  class: "account-stats-panel"
};
const oi = {
  class: "panel-header"
};
const si = {
  class: "stats-grid"
};
const li = ["title"];
const ii = {
  class: "acc-metrics"
};
const ui = {
  class: "metric-row metric-row-inline"
};
const ri = {
  class: "value"
};
const ci = {
  class: "metric-row"
};
const di = {
  class: "sub-metrics"
};
const mi = {
  class: "sub-item"
};
const fi = {
  class: "sub-val"
};
const pi = {
  class: "today"
};
const vi = {
  class: "total"
};
const gi = {
  class: "sub-item"
};
const yi = {
  class: "sub-val"
};
const hi = {
  class: "today"
};
const ki = {
  class: "total"
};
const bi = {
  class: "sub-item"
};
const Ci = {
  class: "sub-val"
};
const wi = {
  class: "today"
};
const _i = {
  class: "total"
};
const Si = {
  class: "sub-item"
};
const xi = {
  class: "sub-val"
};
const $i = {
  class: "today"
};
const Ai = {
  class: "total"
};
const Ii = {
  class: "pool-content-wrapper"
};
const Ti = {
  class: "pool-toolbar"
};
const zi = {
  class: "toolbar-row toolbar-row-main"
};
const Ni = {
  key: 0,
  class: "toolbar-row toolbar-row-advanced"
};
const Ui = {
  class: "toolbar-row toolbar-row-actions"
};
const Pi = {
  class: "lead-more-section"
};
const Fi = ["disabled"];
const Mi = {
  class: "lead-more-meta"
};
const Li = {
  class: "lead-more-section"
};
const Ri = ["disabled"];
const Di = ["disabled"];
const Oi = {
  class: "lead-more-section"
};
const Ei = ["disabled"];
const Bi = {
  class: "lead-more-meta"
};
const Ki = {
  key: 0,
  class: "selection-hint"
};
const Vi = {
  class: "tab-hint"
};
const Hi = {
  class: "tab-hint"
};
const Wi = {
  key: 0,
  class: "table-container"
};
const ji = ["onClick"];
const qi = {
  class: "user-meta"
};
const Yi = ["title"];
const Gi = {
  class: "nickname-text"
};
const Ji = {
  key: 1,
  class: "lead-age-tag"
};
const Zi = {
  class: "location"
};
const Xi = {
  class: "user-comment-snippet"
};
const Qi = {
  class: "entry-cell"
};
const eu = {
  key: 2,
  class: "user-meta"
};
const tu = {
  class: "acc-main"
};
const nu = ["title"];
const au = {
  key: 3,
  class: "works-cell"
};
const ou = {
  class: "content-preview user-comment-cell"
};
const su = ["title"];
const lu = ["onClick"];
const iu = {
  class: "content-preview user-comment-cell"
};
const uu = {
  class: "user-comment-text"
};
const ru = ["title"];
const cu = {
  key: 2,
  class: "comment-empty"
};
const du = {
  class: "touch-detail-cell"
};
const mu = {
  key: 0,
  class: "touch-empty"
};
const fu = {
  class: "touch-tags-row"
};
const pu = {
  class: "touch-total"
};
const vu = {
  key: 1,
  style: {
    "margin-top": "4px",
    "font-size": "11px",
    color: "var(--text-muted)"
  }
};
const gu = {
  key: 6,
  class: "time-text"
};
const yu = {
  class: "batch-follow-result-cell"
};
const hu = {
  key: 0,
  class: "batch-follow-result-time"
};
const ku = {
  key: 1,
  class: "comment-empty"
};
const bu = {
  key: 1,
  class: "table-container"
};
const Cu = ["onClick"];
const wu = {
  key: 2,
  class: "archive-touch-summary"
};
const _u = ["title"];
const Su = {
  key: 4,
  class: "time-text"
};
const xu = {
  key: 2,
  class: "table-container"
};
const $u = ["onClick"];
const Au = {
  key: 1,
  class: "time-text"
};
const Iu = {
  key: 3,
  class: "table-container"
};
const Tu = {
  key: 4,
  class: "table-container"
};
const zu = ["onClick"];
const Nu = {
  key: 1
};
const Uu = ["title"];
const Pu = {
  key: 3,
  class: "time-text"
};
const Fu = {
  key: 5,
  class: "table-container"
};
const Mu = ["onClick"];
const Lu = ["onClick"];
const Ru = {
  key: 1
};
const Du = ["title"];
const Ou = {
  key: 3,
  class: "time-text"
};
const Eu = {
  key: 6,
  class: "table-container batch-follow-tab"
};
const Bu = {
  class: "locate-comment-preview"
};
const Ku = {
  class: "locate-comment-meta"
};
const Vu = {
  key: 0
};
const Hu = {
  key: 1
};
const Wu = {
  class: "locate-comment-body"
};
const Xt = false;
const ju = {
  __name: "LeadPool",
  setup(C) {
    const {
      invoke: l,
      send: h
    } = _t();
    const m = Kt();
    const {
      leads: A,
      leadsTotal: $,
      leadsLoading: z,
      filters: k,
      cumulativeStats: s,
      filteredLeads: D,
      leadPoolStats: ce,
      leadPoolAccountStats: se,
      loadLeadsFromHistory: L,
      loadLeadsPage: Q,
      scheduleLoadLeadsPage: we,
      saveData: ne,
      exportToCSV: xe,
      queryLeadsForBatch: q,
      queryLeadsByIds: Y,
      queryLeadsForExport: Ue,
      getTotalTouchCount: G,
      locationFilterOptions: $e,
      accountFilterOptions: ke,
      clearAllLeads: Re,
      clearLowIntentionLeads: je,
      clearTouchedLeads: O,
      deleteFailedBatchFollowLeads: R,
      upsertImportedLeads: de
    } = Za();
    const pe = La();
    const {
      collectionSearch: _e,
      collectedVideoRows: De,
      collectedAuthorRows: I,
      collectedVideosTotal: a,
      collectedAuthorsTotal: V,
      loadCollectedVideosPage: Ae,
      loadCollectedAuthorsPage: Pe,
      scheduleCollectedSearch: Ee
    } = Ha();
    const Z = E("leads");
    const qe = E([]);
    const He = E([]);
    const Ie = E([]);
    const Se = E([]);
    const ee = E([]);
    const Oe = E([]);
    const Fe = E([]);
    const T = E(false);
    const Be = E(false);
    const vt = E(null);
    const gt = E(false);
    const st = E(false);
    const lt = he(() => A.value.filter(t => Da(t) === "import" && !!t.userUrl && !Ut(t)).length);
    async function o({
      accepted: t = [],
      rejected: e = []
    } = {}) {
      if (!t.length) {
        x.warning(e.length ? "没有可导入的有效 UID" : "请先粘贴或上传 UID");
        return;
      }
      const _ = "lead-import-uid";
      x.loading({
        content: `正在导入 ${t.length} 条 UID…`,
        key: _,
        duration: 0
      });
      try {
        await gn();
        const N = t.map(oe => ul(oe));
        const le = await de(N, {
          onProgress: (oe, te) => {
            x.loading({
              content: `正在写入 ${oe}/${te}…`,
              key: _,
              duration: 0
            });
          }
        });
        if (!le.length) {
          x.destroy(_);
          return;
        }
        ee.value = le.length <= 500 ? le : [];
        k.entrySource = ["import"];
        T.value = true;
        const ye = e.length ? `，无效 ${e.length} 行` : "";
        x.success({
          content: `已写入线索库 ${le.length} 条（按 UID 去重合并）${ye}`,
          key: _,
          duration: 3
        });
      } catch (N) {
        x.error({
          content: (N == null ? undefined : N.message) || "导入失败",
          key: _,
          duration: 3
        });
      }
    }
    function d() {
      if (m.authInfo.isFree) {
        return x.warning("当前未激活专业版，请激活专业版后使用批量跟进功能");
      }
      k.touchTypes = ["untouched"];
      k.entrySource = ["import"];
      T.value = true;
      ee.value = [];
      if (lt.value === 0) {
        return x.info("没有未触达的 UID 导入线索");
      }
      yt.value = {
        ...yt.value,
        batchScope: "filtered",
        skipTouched: true
      };
      At.value = true;
    }
    const c = kt(Ba({
      current: 1,
      total: 0,
      showTotal: t => `共 ${t} 条`
    }));
    const M = he(() => D.value);
    const j = he(() => ({
      selectedRowKeys: ee.value,
      preserveSelectedRowKeys: true,
      onChange: t => {
        ee.value = t;
      }
    }));
    function y(t) {
      const e = Number(t == null ? undefined : t.pageSize) || c.pageSize;
      const _ = e !== c.pageSize;
      c.pageSize = e;
      c.current = _ ? 1 : Number(t == null ? undefined : t.current) || 1;
      Q({
        current: c.current,
        pageSize: c.pageSize
      });
    }
    Ve(() => $.value, t => {
      c.total = t;
      const e = Math.max(1, Math.ceil(t / c.pageSize) || 1);
      if (c.current > e) {
        c.current = e;
        Q({
          current: c.current,
          pageSize: c.pageSize
        });
      }
    }, {
      immediate: true
    });
    Ve(k, () => {
      c.current = 1;
      we({
        current: 1,
        pageSize: c.pageSize
      });
    }, {
      deep: true
    });
    const U = kt({
      current: 1,
      pageSize: 20,
      total: 0,
      showSizeChanger: true,
      pageSizeOptions: ["20", "50", "100"],
      showTotal: t => `共 ${t} 条`
    });
    function F(t) {
      const e = Number(t == null ? undefined : t.pageSize) || U.pageSize;
      const _ = e !== U.pageSize;
      U.pageSize = e;
      U.current = _ ? 1 : Number(t == null ? undefined : t.current) || 1;
      ae();
    }
    async function ae() {
      try {
        const t = await l("get-processed-videos-page", {
          page: U.current,
          pageSize: U.pageSize
        });
        He.value = Array.isArray(t == null ? undefined : t.items) ? t.items : [];
        const e = Number(t == null ? undefined : t.total) || 0;
        U.total = e;
        const _ = Math.max(1, Math.ceil(e / U.pageSize) || 1);
        if (U.current > _) {
          U.current = _;
          if (e > 0) {
            await ae();
          }
        }
      } catch (t) {
        console.warn("[LeadPool] loadVideos failed:", t);
        He.value = [];
        U.total = 0;
      }
    }
    function be(t) {
      return kt({
        current: 1,
        pageSize: 20,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ["20", "50", "100"],
        showTotal: e => `共 ${e} ${t}`
      });
    }
    function ge(t, e) {
      const _ = Number(e == null ? undefined : e.pageSize) || t.pageSize;
      const N = _ !== t.pageSize;
      t.pageSize = _;
      t.current = N ? 1 : Number(e == null ? undefined : e.current) || 1;
    }
    function ie(t, e) {
      t.total = e;
      const _ = Math.max(1, Math.ceil(e / t.pageSize) || 1);
      if (t.current > _) {
        t.current = _;
      }
    }
    const ue = be("条");
    const fe = be("个");
    async function Te() {
      await Ae({
        page: ue.current,
        pageSize: ue.pageSize,
        keyword: _e.value
      });
      ie(ue, a.value);
    }
    async function ze() {
      await Pe({
        page: fe.current,
        pageSize: fe.pageSize,
        keyword: _e.value
      });
      ie(fe, V.value);
    }
    function f(t) {
      ge(ue, t);
      Te();
    }
    function v(t) {
      ge(fe, t);
      ze();
    }
    Ve(a, t => {
      ie(ue, t);
    });
    Ve(V, t => {
      ie(fe, t);
    });
    Ve(_e, () => {
      ue.current = 1;
      fe.current = 1;
      Ee(() => {
        if (Z.value === "collectedVideos") {
          Te();
        } else if (Z.value === "collectedAuthors") {
          ze();
        }
      });
    });
    const K = he(() => {
      var e;
      var _;
      var N;
      var le;
      let t = 0;
      if ((e = k.entrySource) != null && e.length) {
        t++;
      }
      if (k.minTouchTotal != null && k.minTouchTotal !== "") {
        t++;
      }
      if ((_ = k.account) != null && _.length) {
        t++;
      }
      if (k.batchFollowStatus) {
        t++;
      }
      if (k.timeRange) {
        t++;
      }
      if (k.captureTimeRange) {
        t++;
      }
      if ((N = k.locations) != null && N.length) {
        t++;
      }
      if ((le = k.accountFlags) != null && le.length) {
        t++;
      }
      return t;
    });
    function B(t) {
      const e = String(t || "").trim();
      if (!e || e === "1d" || e === "3d" || e === "1w" || e === "今天" || e === "3天内" || e === "一周内" || e === "all") {
        return false;
      } else if (e.includes("~")) {
        return e.split("~").every(_ => /^(\d{4}[-/.年])?\d{1,2}[-/.月]\d{1,2}/.test(_.trim()));
      } else {
        return /^(\d{4}[-/.年])?\d{1,2}[-/.月]\d{1,2}/.test(e);
      }
    }
    function X(t = new Date()) {
      const e = _ => String(_).padStart(2, "0");
      return `${t.getFullYear()}-${t.getMonth() + 1}-${t.getDate()} ${e(t.getHours())}:${e(t.getMinutes())}`;
    }
    function re(t = new Date()) {
      const e = new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, 0, 0);
      return `${X(e)}~${X(t)}`;
    }
    function Ce(t) {
      const e = String(t || "").trim();
      let _;
      let N;
      let le;
      let ye = 0;
      let oe = 0;
      let te = e.match(/^(\d{4})[-/.年](\d{1,2})[-/.月](\d{1,2})日?(?:[\sT]+(\d{1,2}):(\d{1,2}))?/);
      if (te) {
        _ = Number(te[1]);
        N = Number(te[2]);
        le = Number(te[3]);
        if (te[4] != null) {
          ye = Number(te[4]);
        }
        if (te[5] != null) {
          oe = Number(te[5]);
        }
      } else {
        te = e.match(/^(\d{1,2})[-/.月](\d{1,2})日?(?:[\sT]+(\d{1,2}):(\d{1,2}))?/);
        if (!te) {
          return;
        }
        _ = new Date().getFullYear();
        N = Number(te[1]);
        le = Number(te[2]);
        if (te[3] != null) {
          ye = Number(te[3]);
        }
        if (te[4] != null) {
          oe = Number(te[4]);
        }
      }
      if (!_ || !N || !le) {
        return;
      }
      const pt = tt => String(tt).padStart(2, "0");
      return `${_}-${N}-${le} ${pt(ye)}:${pt(oe)}`;
    }
    const Ye = he(() => {
      const t = k.captureTimeRange;
      if (t === "1d" || t === "今天") {
        return "1d";
      } else if (t === "3d" || t === "3天内") {
        return "3d";
      } else if (t === "1w" || t === "一周内") {
        return "1w";
      } else if (B(t) || Be.value) {
        return "day";
      } else {
        return null;
      }
    });
    const ft = he(() => {
      const t = String(k.captureTimeRange || "").trim();
      if (!B(t)) {
        return;
      }
      if (t.includes("~")) {
        const [_, N] = t.split("~");
        const le = Ce(_);
        const ye = Ce(N);
        if (!le || !ye) {
          return undefined;
        } else {
          return [le, ye];
        }
      }
      const e = Ce(t);
      if (e) {
        if (!/\d{1,2}:\d{1,2}/.test(t)) {
          const _ = e.replace(/\s+\d{1,2}:\d{1,2}$/, "");
          return [`${_} 00:00`, `${_} 23:59`];
        }
        return [e, e];
      }
    });
    function it(t) {
      if (!t) {
        Be.value = false;
        k.captureTimeRange = null;
        return;
      }
      if (t === "day") {
        Be.value = true;
        if (!B(k.captureTimeRange)) {
          k.captureTimeRange = re();
        }
        return;
      }
      Be.value = false;
      k.captureTimeRange = t;
    }
    function xt(t) {
      Be.value = true;
      if (Array.isArray(t) && t[0] && t[1]) {
        k.captureTimeRange = `${t[0]}~${t[1]}`;
        return;
      }
      k.captureTimeRange = re();
    }
    const Me = E(0);
    function me() {
      k.keyword = "";
      k.searchKeyword = "";
      k.intention = null;
      k.batchFollowStatus = null;
      k.touchTypes = [];
      k.entrySource = [];
      k.account = [];
      k.timeRange = null;
      k.captureTimeRange = null;
      Be.value = false;
      k.locations = [];
      k.minTouchTotal = null;
      k.accountFlags = [];
      ee.value = [];
      c.current = 1;
      Me.value += 1;
    }
    function Ne(t) {
      const e = Array.isArray(t) ? [...t] : [];
      if (e.some(N => N && N !== "touched" && N !== "untouched") && e.includes("untouched")) {
        k.touchTypes = e.filter(N => N !== "untouched");
      }
    }
    function Ge() {
      if (m.authInfo.isFree) {
        return x.warning("当前未激活专业版，请激活专业版后使用批量跟进功能");
      }
      At.value = true;
    }
    function Le() {
      const t = ee.value.length;
      if (t !== 0) {
        We.confirm({
          title: "确定从所有记录中删除已选线索？",
          content: `确定从线索库中批量移除这 ${t} 条线索？此操作不可恢复。`,
          okType: "danger",
          onOk: async () => {
            if (await l("delete-leads-from-history", ee.value)) {
              x.success(`已成功批量删除 ${t} 条线索`);
              ee.value = [];
              await Q({
                current: c.current,
                pageSize: c.pageSize,
                refreshStats: true
              });
            } else {
              x.error("删除失败：未在历史记录中匹配到对应线索，请刷新后重试");
            }
          }
        });
      }
    }
    function Xe(t) {
      st.value = false;
      Ln({
        key: t
      });
    }
    function Ln({
      key: t
    }) {
      if (t === "export_all") {
        return mn({
          key: "all"
        });
      }
      if (t === "export_selected") {
        return mn({
          key: "selected"
        });
      }
      if (t === "import_csv") {
        return oa();
      }
      if (t === "delete_selected") {
        return Le();
      }
      if (t === "set_high" || t === "set_low") {
        const e = t === "set_high";
        A.value.forEach(_ => {
          if (ee.value.includes(_.leadId)) {
            _.isHighIntention = e;
          }
        });
        ne();
        x.success(`已标记 ${ee.value.length} 条`);
        ee.value = [];
        return;
      }
      if (t === "clear_touched") {
        return Xn();
      }
      if (t === "clear_low") {
        return Qn();
      }
      if (t === "clear_batch_failed") {
        return ea();
      }
      if (t === "clear_all") {
        return Zn();
      }
    }
    function Rn(t) {
      if (!t) {
        return true;
      }
      const e = t.toLowerCase();
      return e.includes("dy") || e.includes("douyin") || e.includes("抖音");
    }
    const Ft = E(false);
    const Ht = E(false);
    const an = E(null);
    const Mt = E(false);
    const $t = E(null);
    const Lt = E(undefined);
    const Wt = E(false);
    const on = E(false);
    const At = E(false);
    const bt = E(false);
    const yt = E(wt({
      batchScope: "selected",
      batchAccountIds: [],
      type: "profile_first_comment",
      profileCommentUseAi: true,
      genderFilter: "all",
      skipTouched: true,
      template: `你好 {nickname}
看了你的评论很有共鸣，加个好友交流一下？`,
      commentTemplate: `很棒，支持一下！
写得不错，学习了`,
      commentUseRandomSuffix: false,
      enableCommentWithoutText: false,
      enableCommentImage: false,
      commentImagePaths: [],
      enableCommentExpression: false,
      commentExpressionCount: 3,
      commentAttachmentPercent: 20,
      enableCommentMention: false,
      commentMentionNicknames: "",
      commentMentionPosition: "before",
      commentMentionPercent: 100,
      profileFirstWorkLikePercent: 10,
      profileFirstWorkCollectPercent: 10,
      accountStrategy: "original",
      dmTarget: "all",
      followDmDelayMin: 3,
      followDmDelayMax: 8,
      useRandomSuffix: true,
      delayMin: 120,
      delayMax: 180
    }));
    const Rt = he(() => m.accounts.filter(t => t.platform === "douyin" && (t.status === "online" || t.nickname)));
    const Dn = he(() => Rt.value.map(t => ({
      value: t.id,
      label: t.nickname || t.name || t.id
    })));
    const On = he(() => {
      const t = $t.value;
      return t && (dt(t) || t.content || t.comment) || "（暂无评论原文）";
    });
    Ve(Z, t => {
      var e;
      var _;
      if (t === "videos") {
        ae();
      }
      if (t === "batchFollow") {
        if ((_ = (e = vt.value) == null ? undefined : e.loadRuns) != null) {
          _.call(e);
        }
      }
      if (t === "collectedVideos") {
        Te();
      }
      if (t === "collectedAuthors") {
        ze();
      }
      if (t !== "collectedVideos" && t !== "collectedAuthors") {
        _e.value = "";
      }
      if (t !== "collectedVideos") {
        Oe.value = [];
      }
      if (t !== "collectedAuthors") {
        Fe.value = [];
      }
    });
    async function sn() {
      const t = await l("get-blacklist");
      qe.value = (t || []).sort((e, _) => (_.timestamp || 0) - (e.timestamp || 0));
    }
    async function En() {
      if (Ie.value.length === 0) {
        return;
      }
      const t = [...Ie.value];
      if (await l("remove-from-blacklist", t)) {
        x.success("删除成功");
        sn();
        Ie.value = [];
      }
    }
    function Bn() {
      We.confirm({
        title: "确认清空跳过名单？",
        content: "清空后，下次任务将不再自动跳过这些用户，可能对同一主页重复点赞/私信/评论。线索库中的触达详情不受影响。",
        onOk: async () => {
          if (await l("clear-blacklist")) {
            x.success("已清空跳过名单");
            sn();
          }
        }
      });
    }
    async function Kn() {
      if (Se.value.length === 0) {
        return;
      }
      const t = [...Se.value];
      if (await l("remove-processed-videos", t)) {
        x.success("删除成功");
        ae();
        Se.value = [];
      }
    }
    function Vn() {
      We.confirm({
        title: "确认清空视频库？",
        content: "将清空「历史已分析」去重记录。清空后同一视频可重新采集；采集视频/采集主页需在对应页签单独删除。",
        onOk: () => {
          h("clear-extension-cache");
          x.success("已清空历史视频去重库");
          setTimeout(ae, 500);
        }
      });
    }
    async function jt(t) {
      var _;
      const e = String(t || "").trim();
      if (!e) {
        return x.warning("没有可复制的链接");
      }
      try {
        if ((_ = navigator.clipboard) != null && _.writeText) {
          await navigator.clipboard.writeText(e);
        } else {
          const N = document.createElement("textarea");
          N.value = e;
          N.style.position = "fixed";
          N.style.opacity = "0";
          document.body.appendChild(N);
          N.select();
          document.execCommand("copy");
          N.remove();
        }
        x.success("链接已复制");
      } catch (N) {
        x.error(`复制失败：${(N == null ? undefined : N.message) || N}`);
      }
    }
    function ln(t) {
      const e = t === "author";
      const _ = e ? Fe.value : Oe.value;
      if (_.length !== 0) {
        We.confirm({
          title: `确认删除选中的${e ? "采集主页" : "采集视频"}？`,
          content: `将删除 ${_.length} 条选中数据；同一卡片中的其他采集类型会保留。`,
          okType: "danger",
          onOk: async () => {
            if (!(await l("remove-collected-links-from-history", {
              type: t,
              keys: [..._]
            }))) {
              x.error("删除失败或数据已不存在");
              return;
            }
            if (e) {
              Fe.value = [];
            } else {
              Oe.value = [];
            }
            await L();
            if (e) {
              await ze();
            } else {
              await Te();
            }
            x.success("删除成功");
          }
        });
      }
    }
    function un(t) {
      const e = t === "author";
      const _ = e ? V.value : a.value;
      if (_ !== 0) {
        We.confirm({
          title: `确认清空全部${e ? "采集主页" : "采集视频"}？`,
          content: e ? `将清空全部 ${_} 个采集主页，且不会再从任务明细自动同步回来。采集视频不受影响。` : `将清空全部 ${_} 条采集视频，且不会再从任务明细自动同步回来。采集主页不受影响。`,
          okType: "danger",
          okText: "确认清空",
          onOk: async () => {
            const N = await l("clear-collected-library", {
              type: t
            });
            if (N == null || !N.success) {
              x.error(N != null && N.error ? `清空失败：${N.error}` : "清空失败，请重试");
              return;
            }
            if (e) {
              Fe.value = [];
            } else {
              Oe.value = [];
            }
            await L();
            if (e) {
              await ze();
            } else {
              await Te();
            }
            x.success(e ? "已清空全部采集主页" : "已清空全部采集视频");
          }
        });
      }
    }
    Vt(() => {
      const t = localStorage.getItem("last_batch_config");
      if (t) {
        try {
          const e = JSON.parse(t);
          if (Number(e.delayMin) === 15 && Number(e.delayMax) === 45) {
            e.delayMin = 120;
            e.delayMax = 180;
          }
          yt.value = {
            ...yt.value,
            ...wt(e),
            skipTouched: e.skipTouched !== false
          };
        } catch {}
      }
    });
    const Hn = [{
      title: "线索对象",
      key: "user",
      width: 168,
      ellipsis: true
    }, {
      title: "评论 / 采集数据",
      key: "userComment",
      width: 280,
      ellipsis: true
    }, {
      title: "线索来源",
      key: "entry",
      width: 128,
      ellipsis: true
    }, {
      title: "获取账号",
      key: "account",
      width: 140,
      ellipsis: true
    }, {
      title: "触达详情",
      key: "touchDetail",
      width: 200,
      ellipsis: true
    }, {
      title: "作品数",
      key: "works",
      width: 64
    }, {
      title: "最近跟进",
      key: "batchFollowResult",
      width: 112
    }, {
      title: "获取时间",
      key: "capturedAt",
      width: 120
    }, {
      title: "操作",
      key: "action",
      width: 172,
      fixed: "right"
    }];
    const Wn = [{
      title: "用户",
      key: "lead",
      ellipsis: true
    }, {
      title: "触达摘要",
      key: "touchSummary",
      width: 200,
      ellipsis: true
    }, {
      title: "平台",
      key: "platform",
      width: 64
    }, {
      title: "操作账号",
      dataIndex: "accountName",
      key: "accountName",
      width: 140,
      ellipsis: true
    }, {
      title: "入库时间",
      key: "time",
      width: 118
    }];
    const jn = [{
      title: "视频标题（点击打开）",
      dataIndex: "title",
      key: "title",
      ellipsis: true
    }, {
      title: "最后浏览时间",
      key: "time",
      width: 150
    }, {
      title: "操作",
      key: "action",
      width: 100
    }];
    const qn = [{
      title: "视频标题（点击打开）",
      dataIndex: "title",
      key: "title",
      ellipsis: true
    }, {
      title: "作者昵称",
      key: "author",
      width: 130,
      ellipsis: true
    }, {
      title: "获取账号",
      dataIndex: "accountName",
      key: "accountName",
      width: 140,
      ellipsis: true
    }, {
      title: "获取时间",
      key: "time",
      width: 140
    }, {
      title: "操作",
      key: "action",
      width: 100
    }];
    const Yn = [{
      title: "作者昵称（点击打开）",
      key: "author",
      ellipsis: true
    }, {
      title: "关联视频数",
      dataIndex: "videoCount",
      key: "videoCount",
      width: 90
    }, {
      title: "最近采集标题",
      dataIndex: "latestTitle",
      key: "latestTitle",
      width: 220,
      ellipsis: true
    }, {
      title: "获取账号",
      dataIndex: "accountName",
      key: "accountName",
      width: 140,
      ellipsis: true
    }, {
      title: "获取时间",
      key: "time",
      width: 140
    }, {
      title: "操作",
      key: "action",
      width: 100
    }];
    const Qe = he(() => {
      const t = new Date().toLocaleDateString("zh-CN").replace(/\//g, "-");
      const e = s.dailyStats[t] || {
        accounts: {}
      };
      const _ = {
        total: 0,
        likes: 0,
        replies: 0,
        messages: 0,
        follows: 0,
        touched: 0,
        untouched: 0,
        profileComments: 0,
        ...(ce.value || {})
      };
      if (!_.total && $.value) {
        _.total = $.value;
      }
      const N = (se.value || []).map(le => {
        const ye = Ze({
          accountId: le.accountId,
          accountName: le.name
        });
        return {
          ...le,
          today: e.accounts[le.name] || e.accounts[ye] || e.accounts[le.accountId] || {
            likes: 0,
            replies: 0,
            messages: 0,
            follows: 0
          }
        };
      });
      return {
        stats: _,
        accountStats: N
      };
    });
    function et(t) {
      if (t == null || t === "") {
        return "未知";
      }
      const e = new Date(t);
      if (Number.isFinite(e.getTime())) {
        return `${e.getMonth() + 1}-${e.getDate()} ${e.getHours().toString().padStart(2, "0")}:${e.getMinutes().toString().padStart(2, "0")}`;
      } else {
        return "未知";
      }
    }
    function Gn(t = {}) {
      const _ = [`最近批量跟进：${t.status === "success" ? "成功" : "失败"}`];
      if (t.message) {
        _.push(String(t.message));
      }
      if (t.at) {
        _.push(`时间：${et(t.at)}`);
      }
      return _.join("；");
    }
    function rn(t) {
      const e = Qt(A.value, t) || t;
      an.value = e;
      Ht.value = true;
    }
    async function cn(t) {
      const e = !t.isHighIntention;
      t.isHighIntention = e;
      await l("update-lead-in-history", {
        leadId: t.leadId || t.key,
        updates: {
          isHighIntention: e
        }
      });
      L();
      x.success(e ? "已设为高意向" : "已取消高意向");
    }
    async function Jn(t) {
      We.confirm({
        title: "确定从所有记录中删除该线索？",
        content: `确定从线索库中移除 [${t.nickname}]？`,
        okType: "danger",
        onOk: async () => {
          if (await l("delete-leads-from-history", [t.leadId || t.key])) {
            x.success(`已删除线索: ${t.nickname}`);
            await Q({
              current: c.current,
              pageSize: c.pageSize,
              refreshStats: true
            });
          } else {
            x.error("删除失败：未在历史记录中匹配到该线索，请刷新后重试");
          }
        }
      });
    }
    function Zn() {
      We.confirm({
        title: "确认清空本地所有线索？",
        content: "清空后将无法找回，建议先导出。",
        okType: "danger",
        onOk: async () => {
          if (!(await Re())) {
            x.error("清空失败，请重试");
            return;
          }
          ee.value = [];
          c.current = 1;
          x.success("已清空所有线索记录");
        }
      });
    }
    function Xn() {
      We.confirm({
        title: "确认清空已触达线索？",
        content: "确定要删除所有已点赞、回复、关注、私信或评论过的线索吗？（视频卡片除外）",
        okType: "danger",
        onOk: async () => {
          const t = await O();
          if (!t) {
            x.info("当前没有已触达线索");
            return;
          }
          ee.value = [];
          c.current = 1;
          await Q({
            current: 1,
            pageSize: c.pageSize
          });
          x.success(`已清理 ${t} 条已触达线索`);
        },
        okText: "确认清理"
      });
    }
    function Qn() {
      We.confirm({
        title: "确认清空无意向线索？",
        content: "确定要删除所有标记为“普通/无意向”的线索吗？（视频卡片除外）",
        okType: "danger",
        onOk: async () => {
          const t = await je();
          if (!t) {
            x.info("当前没有无意向线索");
            return;
          }
          ee.value = [];
          c.current = 1;
          await Q({
            current: 1,
            pageSize: c.pageSize
          });
          x.success(`已清理 ${t} 条无意向线索`);
        },
        okText: "确认清理"
      });
    }
    function ea() {
      We.confirm({
        title: "确认删除批量跟进失败线索？",
        content: "将删除所有“最近跟进=失败”的线索，成功和未执行线索保留。删除后无法恢复。",
        okType: "danger",
        okText: "确认清空",
        onOk: async () => {
          const t = await R({
            pageSize: c.pageSize
          });
          if (!t.success) {
            x.error(t.error || "删除失败，请重试");
            return;
          }
          if (!t.deleted) {
            x.info("当前没有批量跟进失败线索");
            return;
          }
          ee.value = [];
          c.current = 1;
          x.success(`已删除 ${t.deleted} 条批量跟进失败线索`);
        }
      });
    }
    async function ta(t) {
      var Je;
      var nt;
      t = {
        ...wt(t),
        enableRandomWarmup: false,
        enableRandomLike: false
      };
      bt.value = true;
      let e = [];
      let _ = 0;
      if (t.batchScope === "filtered") {
        e = await q();
        _ = e.length;
      } else {
        _ = ee.value.length;
        const Ke = await Y(ee.value);
        e = Ke.items || [];
        if (_ > 0 && e.length < _) {
          x.warning(`勾选 ${_} 条，库中解析到 ${e.length} 条${Ke.missing ? `（${Ke.missing} 条已不在库或无法匹配）` : ""}`);
        }
      }
      const N = e.length;
      e = e.filter(Ke => Ke.userUrl);
      if (N > e.length) {
        x.warning(`已排除 ${N - e.length} 条无主页链接的线索`);
      }
      const le = e.length;
      if (t.skipTouched !== false) {
        e = e.filter(Ke => !Ut(Ke));
      }
      if (e.length === 0) {
        if (le > 0 && t.skipTouched !== false) {
          x.warning("所选线索均已触达，已全部跳过。如需再跟进，请关闭「跳过已触达」");
        } else {
          x.warning(t.batchScope === "filtered" ? "当前列表没有可跟进的线索（需有主页链接）" : "请先勾选要跟进的线索");
        }
        bt.value = false;
        return;
      }
      if ((Je = t.batchAccountIds) == null || !Je.length) {
        x.warning("请至少选择一个执行账号");
        bt.value = false;
        return;
      }
      let ye = JSON.parse(JSON.stringify(e));
      const oe = vl(ye, t.batchAccountIds, m.accounts);
      if (!oe.ok) {
        x.warning(oe.message);
        bt.value = false;
        return;
      }
      ye = pl(ye, t.batchAccountIds, m.accounts);
      const te = JSON.parse(JSON.stringify(t));
      if (t.type === "profile_first_comment" && t.profileCommentUseAi) {
        te.personaByAccount = gl(m.config, t.batchAccountIds, (nt = m.authInfo) == null ? undefined : nt.isFree);
      }
      localStorage.setItem("last_batch_config", JSON.stringify(te));
      yt.value = te;
      m.isBatchActive = true;
      m.resetBatchProgress(ye.length);
      m.batchProgress.status = "preparing";
      const pt = Array.from(new Set(t.batchAccountIds));
      m.showIdlePreviews = false;
      if (m.config) {
        m.config.selectedAccounts ||= [];
        pt.forEach(Ke => {
          if (!m.config.selectedAccounts.includes(Ke)) {
            m.config.selectedAccounts.push(Ke);
          }
        });
      }
      m.activeKey = "dashboard";
      At.value = false;
      ee.value = [];
      const It = {
        follow_dm: "关注&私信",
        profile_first_comment: "首作评论",
        follow: "关注",
        message: "私信"
      }[t.type] || "跟进";
      const Ct = [];
      if (t.batchScope === "selected" && _ > le) {
        Ct.push(`勾选 ${_}`);
      }
      if (le > ye.length) {
        Ct.push(`跳过已触达 ${le - ye.length}`);
      }
      const ut = Ct.length ? `（${Ct.join("，")}，实际执行 ${ye.length}）` : "";
      x.success(`已启动${It}，共 ${ye.length} 条，${pt.length} 个账号均分执行${ut}`);
      setTimeout(() => {
        h("start-batch-action", {
          leads: ye,
          config: te
        });
        bt.value = false;
      }, 500);
    }
    function Ze(t = {}, e = "未知账号") {
      return ka(t, m.accounts, e);
    }
    function na(t = {}) {
      const e = wn(t.touchCounts);
      if (e.length) {
        return e;
      } else {
        return wn({
          like: t.liked ? 1 : 0,
          reply: t.replied ? 1 : 0,
          follow: t.followed ? 1 : 0,
          message: t.messaged ? 1 : 0,
          profileComment: en(t) ? 1 : 0
        });
      }
    }
    function dn(t) {
      if (!_n(t)) {
        x.warning("该线索没有来源作品，无法打开评论");
        return;
      }
      if (!Cn(t)) {
        x.warning("该线索不是评论区来源，不能定位评论");
        return;
      }
      $t.value = t;
      Lt.value = Sn(t, Rt.value) || undefined;
      Mt.value = true;
    }
    async function aa() {
      const t = $t.value;
      const e = _n(t);
      if (!e) {
        x.warning("该线索没有来源作品，无法打开评论");
        return;
      }
      const _ = Lt.value || Sn(t, Rt.value) || "default";
      Wt.value = true;
      try {
        const N = await l("lead-comment-interact", {
          url: e,
          accountId: _,
          locateComment: {
            cid: Zt(t),
            nickname: t.nickname || "",
            content: dt(t) || t.content || t.comment || ""
          },
          lead: {
            nickname: t.nickname || "",
            userUrl: t.userUrl || "",
            content: dt(t) || t.content || t.comment || "",
            timeText: t.timeText || "",
            cid: Zt(t),
            commentId: Zt(t)
          }
        });
        Mt.value = false;
        if (N == null || !N.ok) {
          x.warning((N == null ? undefined : N.reason) || (N == null ? undefined : N.locateReason) || "打开评论失败");
          return;
        }
        if (N.replyClicked) {
          x.success("已定位到该条评论并点开回复，请在窗口里继续操作，用完后手动关闭");
        } else {
          x.success("已定位到该条评论，请在窗口里点回复后继续操作，用完后手动关闭");
        }
      } catch (N) {
        x.error((N == null ? undefined : N.message) || "定位评论失败");
      } finally {
        Wt.value = false;
      }
    }
    function ht(t) {
      if (t) {
        h("open-url", t);
      }
    }
    async function mn({
      key: t
    }) {
      let e = [];
      if (t === "all") {
        e = (await Ue()).items || [];
        if (!e.length) {
          return x.warning("没有可导出的数据");
        }
      } else {
        e = (await Y(ee.value)).items || [];
        if (!e.length) {
          return x.warning("没有可导出的数据");
        }
        if (ee.value.length > e.length) {
          x.warning(`勾选 ${ee.value.length} 条，实际导出 ${e.length} 条`);
        }
      }
      const _ = e.map(N => Il(N));
      xe(_, "leads_export");
      x.success(`已导出 ${_.length} 条`);
    }
    async function oa() {
      const t = document.createElement("input");
      t.type = "file";
      t.accept = ".csv,text/csv";
      t.style.display = "none";
      document.body.appendChild(t);
      const e = await new Promise(N => {
        t.onchange = () => {
          var le;
          return N(((le = t.files) == null ? undefined : le[0]) || null);
        };
        t.oncancel = () => N(null);
        t.click();
      });
      document.body.removeChild(t);
      if (!e) {
        return;
      }
      const _ = "lead-import-csv";
      x.loading({
        content: `正在读取 ${e.name}…`,
        key: _,
        duration: 0
      });
      try {
        await gn();
        await new Promise(tt => requestAnimationFrame(() => tt()));
        let N = "";
        try {
          N = await e.text();
        } catch {
          x.error({
            content: "读取 CSV 失败",
            key: _,
            duration: 3
          });
          return;
        }
        x.loading({
          content: "正在解析 CSV…",
          key: _,
          duration: 0
        });
        await new Promise(tt => setTimeout(tt, 0));
        const {
          accepted: le,
          rejected: ye,
          totalRows: oe
        } = $l(N);
        if (!le.length) {
          x.warning({
            content: ye.length ? `没有可导入的有效线索（共 ${oe} 行，无效 ${ye.length}）` : "CSV 为空或格式不正确",
            key: _,
            duration: 3
          });
          return;
        }
        x.loading({
          content: `正在写入 0/${le.length}…`,
          key: _,
          duration: 0
        });
        const te = await de(le, {
          onProgress: (tt, It) => {
            x.loading({
              content: `正在写入 ${tt}/${It}…`,
              key: _,
              duration: 0
            });
          }
        });
        if (!te.length) {
          x.destroy(_);
          return;
        }
        ee.value = te.length <= 500 ? te : [];
        const pt = ye.length ? `，跳过 ${ye.length} 行` : "";
        x.success({
          content: `已导入 ${te.length} 条（按用户主页去重合并）${pt}`,
          key: _,
          duration: 3
        });
      } catch (N) {
        x.error({
          content: (N == null ? undefined : N.message) || "导入失败",
          key: _,
          duration: 3
        });
      }
    }
    function fn(t) {
      if (t === "video") {
        if (De.value.length === 0) {
          return x.warning("没有可导出的采集视频");
        }
        xe(De.value.map(e => ({
          视频标题: e.title || "",
          作者昵称: e.nickname || "",
          完整视频链接: e.videoUrl || "",
          作者主页链接: e.authorProfileUrl || "",
          获取账号: e.accountName || "",
          获取时间: et(e.timestamp || e.capturedAt)
        })), "collected_videos");
        return;
      }
      if (I.value.length === 0) {
        return x.warning("没有可导出的采集主页");
      }
      xe(I.value.map(e => ({
        作者昵称: e.nickname || "",
        作者主页链接: e.profileUrl || "",
        关联视频数: e.videoCount || 0,
        最近采集标题: e.latestTitle || "",
        最近视频链接: e.latestVideoUrl || "",
        获取账号: e.accountName || "",
        获取时间: et(e.timestamp || e.capturedAt)
      })), "collected_authors");
    }
    return (t, e) => {
      var pn;
      const _ = J("a-button");
      const N = J("a-radio-button");
      const le = J("a-radio-group");
      const ye = J("a-input-search");
      const oe = J("a-select-option");
      const te = J("a-select");
      const pt = J("a-badge");
      const tt = J("a-range-picker");
      const It = J("a-input-number");
      const Ct = J("a-dropdown");
      const ut = J("a-space");
      const Je = J("a-tag");
      const nt = J("a-tooltip");
      const Ke = J("a-table");
      const sa = J("a-card");
      const la = J("a-modal");
      i();
      return w("div", Tl, [u(sa, {
        class: "main-card",
        bordered: false
      }, {
        title: r(() => [n("div", zl, [n("div", Nl, [u(P(qa), {
          size: 18,
          style: {
            "margin-right": "8px",
            color: "#3b82f6"
          }
        }), e[40] ||= n("div", {
          class: "title-text"
        }, [n("span", {
          class: "title-main"
        }, "线索库"), n("span", {
          class: "title-sub"
        }, "当前筛选范围内的线索与触达概览")], -1)]), Z.value === "leads" && Qe.value.stats.total ? (i(), w("div", Ul, [n("div", Pl, [u(P(qt), {
          size: 14,
          color: "#3b82f6"
        }), n("div", Fl, [e[41] ||= n("span", {
          class: "stat-label"
        }, "当前筛选线索", -1), n("span", Ml, p(Qe.value.stats.total), 1)])]), n("div", Ll, [u(P(ja), {
          size: 14,
          color: "#f97316"
        }), n("div", Rl, [e[42] ||= n("span", {
          class: "stat-label"
        }, "已点赞", -1), n("span", Dl, p(Qe.value.stats.likes), 1)])]), n("div", Ol, [u(P(vn), {
          size: 14,
          color: "#3b82f6"
        }), n("div", El, [e[43] ||= n("span", {
          class: "stat-label"
        }, "已回复", -1), n("span", Bl, p(Qe.value.stats.replies), 1)])]), n("div", Kl, [u(P(Ja), {
          size: 14,
          color: "#10b981"
        }), n("div", Vl, [e[44] ||= n("span", {
          class: "stat-label"
        }, "已私信", -1), n("span", Hl, p(Qe.value.stats.messages), 1)])]), n("div", Wl, [u(P(Ga), {
          size: 14,
          color: "#8b5cf6"
        }), n("div", jl, [e[45] ||= n("span", {
          class: "stat-label"
        }, "已关注", -1), n("span", ql, p(Qe.value.stats.follows), 1)])]), n("div", Yl, [u(P(qt), {
          size: 14,
          color: "#22c55e"
        }), n("div", Gl, [e[46] ||= n("span", {
          class: "stat-label"
        }, "已触达", -1), n("span", Jl, p(Qe.value.stats.touched), 1)])]), n("div", Zl, [u(P(qt), {
          size: 14,
          color: "var(--text-muted)"
        }), n("div", Xl, [e[47] ||= n("span", {
          class: "stat-label"
        }, "未触达", -1), n("span", Ql, p(Qe.value.stats.untouched), 1)])]), n("div", ei, [u(P(vn), {
          size: 14,
          color: "#6366f1"
        }), n("div", ti, [e[48] ||= n("span", {
          class: "stat-label"
        }, "首作评论", -1), n("span", ni, p(Qe.value.stats.profileComments), 1)])])])) : H("", true)])]),
        default: r(() => [Z.value === "leads" && Qe.value.accountStats.length > 0 ? (i(), w("div", ai, [n("div", oi, [e[49] ||= n("div", {
          class: "panel-title"
        }, [n("span", {
          class: "panel-main"
        }, "账号执行概览"), n("span", {
          class: "panel-sub"
        }, "按账号汇总的线索数量与今日/累计触达")], -1), u(_, {
          type: "link",
          size: "small",
          onClick: e[0] ||= g => Ft.value = !Ft.value
        }, {
          default: r(() => [b(p(Ft.value ? "收起" : "展开"), 1)]),
          _: 1
        })]), zn(n("div", si, [(i(true), w(ve, null, mt(Qe.value.accountStats, g => {
          i();
          return w("div", {
            key: g.accountId || `name:${g.name}`,
            class: "acc-stat-card"
          }, [n("div", {
            class: "acc-name",
            title: Ze({
              accountId: g.accountId,
              accountName: g.name
            })
          }, p(Ze({
            accountId: g.accountId,
            accountName: g.name
          })), 9, li), n("div", ii, [n("div", ui, [e[50] ||= n("span", {
            class: "label"
          }, "线索总数:", -1), n("span", ri, p(g.total), 1)]), n("div", ci, [e[59] ||= n("span", {
            class: "label"
          }, "互动统计(今/总):", -1), n("div", di, [n("div", mi, [e[52] ||= n("span", {
            class: "sub-label"
          }, "点赞:", -1), n("span", fi, [n("strong", pi, p(g.today.likes), 1), e[51] ||= n("span", {
            class: "sep"
          }, "/", -1), n("span", vi, p(g.likes), 1)])]), n("div", gi, [e[54] ||= n("span", {
            class: "sub-label"
          }, "回复:", -1), n("span", yi, [n("strong", hi, p(g.today.replies), 1), e[53] ||= n("span", {
            class: "sep"
          }, "/", -1), n("span", ki, p(g.replies), 1)])]), n("div", bi, [e[56] ||= n("span", {
            class: "sub-label"
          }, "私信:", -1), n("span", Ci, [n("strong", wi, p(g.today.messages), 1), e[55] ||= n("span", {
            class: "sep"
          }, "/", -1), n("span", _i, p(g.messages), 1)])]), n("div", Si, [e[58] ||= n("span", {
            class: "sub-label"
          }, "关注:", -1), n("span", xi, [n("strong", $i, p(g.today.follows), 1), e[57] ||= n("span", {
            class: "sep"
          }, "/", -1), n("span", Ai, p(g.follows), 1)])])])])])]);
        }), 128))], 512), [[Nn, Ft.value]])])) : H("", true), n("div", Ii, [n("div", Ti, [n("div", zi, [u(le, {
          value: Z.value,
          "onUpdate:value": e[1] ||= g => Z.value = g,
          "button-style": "solid",
          size: "small",
          class: "tab-switch"
        }, {
          default: r(() => [u(N, {
            value: "leads"
          }, {
            default: r(() => [...(e[60] ||= [b("线索库", -1)])]),
            _: 1
          }), u(N, {
            value: "batchFollow"
          }, {
            default: r(() => [...(e[61] ||= [b("批量跟进详情", -1)])]),
            _: 1
          }), Xt ? (i(), W(N, {
            key: 0,
            value: "blacklist"
          }, {
            default: r(() => [...(e[62] ||= [b("跳过名单", -1)])]),
            _: 1
          })) : H("", true), u(N, {
            value: "videos"
          }, {
            default: r(() => [...(e[63] ||= [b("历史视频", -1)])]),
            _: 1
          }), u(N, {
            value: "videoMainComments"
          }, {
            default: r(() => [...(e[64] ||= [b("视频主评", -1)])]),
            _: 1
          }), u(N, {
            value: "collectedVideos"
          }, {
            default: r(() => [...(e[65] ||= [b("采集视频", -1)])]),
            _: 1
          }), u(N, {
            value: "collectedAuthors"
          }, {
            default: r(() => [...(e[66] ||= [b("采集主页", -1)])]),
            _: 1
          })]),
          _: 1
        }, 8, ["value"]), Z.value === "leads" ? (i(), w(ve, {
          key: 0
        }, [(i(), W(ye, {
          key: `kw-${Me.value}`,
          value: P(k).keyword,
          "onUpdate:value": e[2] ||= g => P(k).keyword = g,
          placeholder: "搜昵称、评论、入口关键词...",
          class: "main-search",
          size: "small",
          "allow-clear": ""
        }, null, 8, ["value"])), (i(), W(te, {
          key: `intention-${Me.value}`,
          value: P(k).intention,
          "onUpdate:value": e[3] ||= g => P(k).intention = g,
          "allow-clear": "",
          placeholder: "意向",
          size: "small",
          style: {
            width: "100px"
          },
          class: "main-filter-select"
        }, {
          default: r(() => [u(oe, {
            value: "high"
          }, {
            default: r(() => [...(e[67] ||= [b("高意向", -1)])]),
            _: 1
          }), u(oe, {
            value: "low"
          }, {
            default: r(() => [...(e[68] ||= [b("低意向", -1)])]),
            _: 1
          })]),
          _: 1
        }, 8, ["value"])), (i(), W(te, {
          key: `touch-${Me.value}`,
          value: P(k).touchTypes,
          "onUpdate:value": e[4] ||= g => P(k).touchTypes = g,
          mode: "multiple",
          "allow-clear": "",
          placeholder: "触达",
          size: "small",
          style: {
            width: "168px"
          },
          "max-tag-count": 1,
          class: "main-filter-select",
          onChange: Ne
        }, {
          default: r(() => [u(oe, {
            value: "touched"
          }, {
            default: r(() => [...(e[69] ||= [b("已触达", -1)])]),
            _: 1
          }), u(oe, {
            value: "untouched"
          }, {
            default: r(() => [...(e[70] ||= [b("未触达", -1)])]),
            _: 1
          }), u(oe, {
            value: "like"
          }, {
            default: r(() => [...(e[71] ||= [b("已点赞", -1)])]),
            _: 1
          }), u(oe, {
            value: "message"
          }, {
            default: r(() => [...(e[72] ||= [b("已私信", -1)])]),
            _: 1
          }), u(oe, {
            value: "follow"
          }, {
            default: r(() => [...(e[73] ||= [b("已关注", -1)])]),
            _: 1
          }), u(oe, {
            value: "reply"
          }, {
            default: r(() => [...(e[74] ||= [b("已回复", -1)])]),
            _: 1
          }), u(oe, {
            value: "profileComment"
          }, {
            default: r(() => [...(e[75] ||= [b("首作评论", -1)])]),
            _: 1
          })]),
          _: 1
        }, 8, ["value"])), u(_, {
          size: "small",
          class: "more-filters-btn",
          type: T.value ? "primary" : "default",
          onClick: e[5] ||= g => T.value = !T.value
        }, {
          default: r(() => [b(p(T.value ? "收起筛选" : "更多筛选") + " ", 1), K.value > 0 && !T.value ? (i(), W(pt, {
            key: 0,
            count: K.value,
            offset: [6, -2]
          }, null, 8, ["count"])) : H("", true)]),
          _: 1
        }, 8, ["type"])], 64)) : Z.value === "collectedVideos" || Z.value === "collectedAuthors" ? (i(), W(ye, {
          key: 1,
          value: P(_e),
          "onUpdate:value": e[6] ||= g => ya(_e) ? _e.value = g : null,
          placeholder: Z.value === "collectedVideos" ? "搜索标题、作者或视频链接..." : "搜索作者或主页链接...",
          class: "main-search",
          size: "small",
          "allow-clear": ""
        }, null, 8, ["value", "placeholder"])) : H("", true)]), Z.value === "leads" && T.value ? (i(), w("div", Ni, [(i(), W(te, {
          key: `entry-${Me.value}`,
          value: P(k).entrySource,
          "onUpdate:value": e[7] ||= g => P(k).entrySource = g,
          mode: "multiple",
          style: {
            width: "170px"
          },
          "allow-clear": "",
          placeholder: "线索来源",
          size: "small"
        }, {
          default: r(() => [(i(true), w(ve, null, mt(P(pe), g => {
            i();
            return W(oe, {
              key: g.value,
              value: g.value
            }, {
              default: r(() => [b(p(g.label), 1)]),
              _: 2
            }, 1032, ["value"]);
          }), 128))]),
          _: 1
        }, 8, ["value"])), (i(), W(te, {
          key: `account-${Me.value}`,
          value: P(k).account,
          "onUpdate:value": e[8] ||= g => P(k).account = g,
          mode: "multiple",
          style: {
            width: "160px"
          },
          "allow-clear": "",
          placeholder: "获取账号",
          size: "small",
          "option-filter-prop": "label"
        }, {
          default: r(() => [(i(true), w(ve, null, mt(P(ke), g => {
            i();
            return W(oe, {
              key: g.value,
              value: g.value,
              label: g.label
            }, {
              default: r(() => [b(p(g.label), 1)]),
              _: 2
            }, 1032, ["value", "label"]);
          }), 128))]),
          _: 1
        }, 8, ["value"])), (i(), W(te, {
          key: `batch-result-${Me.value}`,
          value: P(k).batchFollowStatus,
          "onUpdate:value": e[9] ||= g => P(k).batchFollowStatus = g,
          style: {
            width: "112px"
          },
          "allow-clear": "",
          placeholder: "跟进结果",
          size: "small"
        }, {
          default: r(() => [u(oe, {
            value: "success"
          }, {
            default: r(() => [...(e[76] ||= [b("跟进成功", -1)])]),
            _: 1
          }), u(oe, {
            value: "failed"
          }, {
            default: r(() => [...(e[77] ||= [b("跟进失败", -1)])]),
            _: 1
          })]),
          _: 1
        }, 8, ["value"])), (i(), W(te, {
          key: `time-${Me.value}`,
          value: P(k).timeRange,
          "onUpdate:value": e[10] ||= g => P(k).timeRange = g,
          style: {
            width: "96px"
          },
          "allow-clear": "",
          placeholder: "评论时间",
          size: "small"
        }, {
          default: r(() => [u(oe, {
            value: "1d"
          }, {
            default: r(() => [...(e[78] ||= [b("今天", -1)])]),
            _: 1
          }), u(oe, {
            value: "3d"
          }, {
            default: r(() => [...(e[79] ||= [b("3天内", -1)])]),
            _: 1
          }), u(oe, {
            value: "1w"
          }, {
            default: r(() => [...(e[80] ||= [b("一周内", -1)])]),
            _: 1
          })]),
          _: 1
        }, 8, ["value"])), (i(), W(te, {
          key: `capture-${Me.value}`,
          value: Ye.value,
          style: {
            width: "108px"
          },
          "allow-clear": "",
          placeholder: "获取时间",
          size: "small",
          "onUpdate:value": it
        }, {
          default: r(() => [u(oe, {
            value: "1d"
          }, {
            default: r(() => [...(e[81] ||= [b("今天", -1)])]),
            _: 1
          }), u(oe, {
            value: "3d"
          }, {
            default: r(() => [...(e[82] ||= [b("3天内", -1)])]),
            _: 1
          }), u(oe, {
            value: "1w"
          }, {
            default: r(() => [...(e[83] ||= [b("一周内", -1)])]),
            _: 1
          }), u(oe, {
            value: "day"
          }, {
            default: r(() => [...(e[84] ||= [b("指定时间", -1)])]),
            _: 1
          })]),
          _: 1
        }, 8, ["value"])), Ye.value === "day" ? (i(), W(tt, {
          key: `capture-day-${Me.value}`,
          value: ft.value,
          style: {
            width: "268px"
          },
          size: "small",
          "show-time": "",
          format: "M-D HH:mm",
          "value-format": "YYYY-M-D HH:mm",
          placeholder: ["开始时间", "结束时间"],
          "allow-clear": false,
          "onUpdate:value": xt
        }, null, 8, ["value"])) : H("", true), (i(), W(te, {
          key: `loc-${Me.value}`,
          value: P(k).locations,
          "onUpdate:value": e[11] ||= g => P(k).locations = g,
          mode: "tags",
          style: {
            width: "150px"
          },
          "allow-clear": "",
          placeholder: "地区",
          size: "small",
          "token-separators": [",", "，", " "]
        }, {
          default: r(() => [(i(true), w(ve, null, mt(P($e), g => {
            i();
            return W(oe, {
              key: g,
              value: g
            }, {
              default: r(() => [b(p(g), 1)]),
              _: 2
            }, 1032, ["value"]);
          }), 128))]),
          _: 1
        }, 8, ["value"])), (i(), W(It, {
          key: `touchMin-${Me.value}`,
          value: P(k).minTouchTotal,
          "onUpdate:value": e[12] ||= g => P(k).minTouchTotal = g,
          min: 0,
          placeholder: "触达≥",
          style: {
            width: "80px"
          },
          size: "small"
        }, null, 8, ["value"])), (i(), W(te, {
          key: `flags-${Me.value}`,
          value: P(k).accountFlags,
          "onUpdate:value": e[13] ||= g => P(k).accountFlags = g,
          mode: "multiple",
          style: {
            width: "150px"
          },
          "allow-clear": "",
          placeholder: "账号标记",
          size: "small",
          "max-tag-count": 1
        }, {
          default: r(() => [u(oe, {
            value: "private"
          }, {
            default: r(() => [...(e[85] ||= [b("私密账号", -1)])]),
            _: 1
          }), u(oe, {
            value: "noWorks"
          }, {
            default: r(() => [...(e[86] ||= [b("零作品", -1)])]),
            _: 1
          })]),
          _: 1
        }, 8, ["value"])), u(_, {
          size: "small",
          type: "link",
          onClick: me
        }, {
          default: r(() => [...(e[87] ||= [b("重置", -1)])]),
          _: 1
        })])) : H("", true), n("div", Ui, [Z.value === "leads" ? (i(), W(ut, {
          key: 0
        }, {
          default: r(() => [u(_, {
            type: "primary",
            size: "small",
            onClick: Ge
          }, {
            default: r(() => [u(P(Wa), {
              size: 14,
              style: {
                "margin-right": "4px"
              }
            }), e[88] ||= b(" 批量跟进 ", -1)]),
            _: 1
          }), u(_, {
            size: "small",
            onClick: e[14] ||= g => gt.value = true
          }, {
            default: r(() => [...(e[89] ||= [b(" 导入 UID ", -1)])]),
            _: 1
          }), u(_, {
            size: "small",
            disabled: lt.value === 0,
            onClick: d
          }, {
            default: r(() => [b(" 续跑未触达导入 (" + p(lt.value) + ") ", 1)]),
            _: 1
          }, 8, ["disabled"]), u(Ct, {
            open: st.value,
            "onUpdate:open": e[26] ||= g => st.value = g,
            trigger: "click",
            placement: "bottomRight"
          }, {
            overlay: r(() => [n("div", {
              class: "lead-more-panel",
              onClick: e[25] ||= ot(() => {}, ["stop"])
            }, [n("div", Pi, [e[94] ||= n("div", {
              class: "lead-more-label"
            }, "数据", -1), n("button", {
              type: "button",
              class: "lead-more-item",
              onClick: e[15] ||= g => Xe("export_all")
            }, [...(e[91] ||= [n("span", null, "导出列表", -1), n("span", {
              class: "lead-more-meta"
            }, "全部数据", -1)])]), n("button", {
              type: "button",
              class: "lead-more-item",
              disabled: ee.value.length === 0,
              onClick: e[16] ||= g => Xe("export_selected")
            }, [e[92] ||= n("span", null, "导出已选", -1), n("span", Mi, p(ee.value.length) + " 条", 1)], 8, Fi), n("button", {
              type: "button",
              class: "lead-more-item",
              onClick: e[17] ||= g => Xe("import_csv")
            }, [...(e[93] ||= [n("span", null, "导入列表", -1), n("span", {
              class: "lead-more-meta"
            }, "CSV", -1)])])]), n("div", Li, [e[95] ||= n("div", {
              class: "lead-more-label"
            }, "标记", -1), n("button", {
              type: "button",
              class: "lead-more-item",
              disabled: ee.value.length === 0,
              onClick: e[18] ||= g => Xe("set_high")
            }, " 标记为高意向 ", 8, Ri), n("button", {
              type: "button",
              class: "lead-more-item",
              disabled: ee.value.length === 0,
              onClick: e[19] ||= g => Xe("set_low")
            }, " 标记为普通意向 ", 8, Di)]), n("div", Oi, [e[98] ||= n("div", {
              class: "lead-more-label"
            }, "清理", -1), n("button", {
              type: "button",
              class: "lead-more-item is-danger",
              disabled: ee.value.length === 0,
              onClick: e[20] ||= g => Xe("delete_selected")
            }, [e[96] ||= n("span", null, "删除已选", -1), n("span", Bi, p(ee.value.length) + " 条", 1)], 8, Ei), n("button", {
              type: "button",
              class: "lead-more-item is-danger",
              onClick: e[21] ||= g => Xe("clear_touched")
            }, " 清空已触达 "), n("button", {
              type: "button",
              class: "lead-more-item is-danger",
              onClick: e[22] ||= g => Xe("clear_low")
            }, " 清空无意向线索 "), n("button", {
              type: "button",
              class: "lead-more-item is-danger",
              onClick: e[23] ||= g => Xe("clear_batch_failed")
            }, [...(e[97] ||= [n("span", null, "清空跟进失败", -1), n("span", {
              class: "lead-more-meta"
            }, "删除线索", -1)])]), n("button", {
              type: "button",
              class: "lead-more-item is-danger",
              onClick: e[24] ||= g => Xe("clear_all")
            }, " 清空全部线索 ")]), e[99] ||= n("div", {
              class: "lead-more-hint"
            }, " 导出列表的数据可直接用「导入列表」导回 ", -1)])]),
            default: r(() => [u(_, {
              size: "small"
            }, {
              default: r(() => [e[90] ||= b(" 更多 ", -1), u(P(Pn), {
                size: 14
              })]),
              _: 1
            })]),
            _: 1
          }, 8, ["open"]), ee.value.length > 0 ? (i(), w("span", Ki, "已选 " + p(ee.value.length) + " 条", 1)) : H("", true)]),
          _: 1
        })) : Z.value === "batchFollow" ? (i(), W(ut, {
          key: 1,
          class: "tab-hint-row"
        }, {
          default: r(() => [...(e[100] ||= [n("span", {
            class: "tab-hint"
          }, "记录每次批量跟进的执行结果与运行日志，点击详情从右侧查看", -1)])]),
          _: 1
        })) : Xt && Z.value === "blacklist" ? (i(), W(ut, {
          key: 2,
          class: "tab-hint-row"
        }, {
          default: r(() => [e[103] ||= n("span", {
            class: "tab-hint"
          }, "已互动过的用户会进名单；下次自动获客/批量任务遇到同一人时会跳过，避免重复触达", -1), u(_, {
            danger: "",
            size: "small",
            disabled: Ie.value.length === 0,
            onClick: En
          }, {
            default: r(() => [...(e[101] ||= [b("批量移出", -1)])]),
            _: 1
          }, 8, ["disabled"]), u(_, {
            danger: "",
            size: "small",
            onClick: Bn
          }, {
            default: r(() => [...(e[102] ||= [b("清空名单", -1)])]),
            _: 1
          })]),
          _: 1
        })) : Z.value === "videos" ? (i(), W(ut, {
          key: 3
        }, {
          default: r(() => [u(_, {
            danger: "",
            size: "small",
            disabled: Se.value.length === 0,
            onClick: Kn
          }, {
            default: r(() => [...(e[104] ||= [b("批量删除", -1)])]),
            _: 1
          }, 8, ["disabled"]), u(_, {
            danger: "",
            size: "small",
            onClick: Vn
          }, {
            default: r(() => [...(e[105] ||= [b("清空视频库", -1)])]),
            _: 1
          })]),
          _: 1
        })) : Z.value === "videoMainComments" ? (i(), W(ut, {
          key: 4,
          class: "tab-hint-row"
        }, {
          default: r(() => [...(e[106] ||= [n("span", {
            class: "tab-hint"
          }, "本账号已发表过主贴评论的视频；用于防重复主评，可在此删除后重评", -1)])]),
          _: 1
        })) : Z.value === "collectedVideos" ? (i(), W(ut, {
          key: 5
        }, {
          default: r(() => [n("span", Vi, "共 " + p(P(a)) + " 条采集视频", 1), u(_, {
            danger: "",
            size: "small",
            disabled: Oe.value.length === 0,
            onClick: e[27] ||= g => ln("video")
          }, {
            default: r(() => [b(" 批量删除 (" + p(Oe.value.length) + ") ", 1)]),
            _: 1
          }, 8, ["disabled"]), u(_, {
            danger: "",
            size: "small",
            disabled: P(a) === 0,
            onClick: e[28] ||= g => un("video")
          }, {
            default: r(() => [...(e[107] ||= [b(" 清空全部 ", -1)])]),
            _: 1
          }, 8, ["disabled"]), u(_, {
            size: "small",
            onClick: e[29] ||= g => fn("video")
          }, {
            default: r(() => [...(e[108] ||= [b("导出采集视频", -1)])]),
            _: 1
          })]),
          _: 1
        })) : Z.value === "collectedAuthors" ? (i(), W(ut, {
          key: 6
        }, {
          default: r(() => [n("span", Hi, "共 " + p(P(V)) + " 个采集主页", 1), u(_, {
            danger: "",
            size: "small",
            disabled: Fe.value.length === 0,
            onClick: e[30] ||= g => ln("author")
          }, {
            default: r(() => [b(" 批量删除 (" + p(Fe.value.length) + ") ", 1)]),
            _: 1
          }, 8, ["disabled"]), u(_, {
            danger: "",
            size: "small",
            disabled: P(V) === 0,
            onClick: e[31] ||= g => un("author")
          }, {
            default: r(() => [...(e[109] ||= [b(" 清空全部 ", -1)])]),
            _: 1
          }, 8, ["disabled"]), u(_, {
            size: "small",
            onClick: e[32] ||= g => fn("author")
          }, {
            default: r(() => [...(e[110] ||= [b("导出采集主页", -1)])]),
            _: 1
          })]),
          _: 1
        })) : H("", true)])]), Z.value === "leads" ? (i(), w("div", Wi, [u(Ke, {
          dataSource: M.value,
          columns: Hn,
          size: "small",
          pagination: c,
          loading: P(z),
          scroll: {
            x: 1384,
            y: "calc(100vh - 380px)"
          },
          "row-selection": j.value,
          "row-key": "key",
          class: "lead-table",
          onChange: y
        }, {
          bodyCell: r(({
            column: g,
            record: S
          }) => {
            var rt;
            return [g.key === "user" ? (i(), w("div", {
              key: 0,
              class: "user-info",
              onClick: at => rn(S)
            }, [n("div", qi, [n("div", {
              class: "nickname",
              title: S.nickname
            }, [u(Je, {
              color: Rn(S.platform) ? "black" : "red",
              style: {
                "flex-shrink": "0",
                "margin-right": "4px",
                padding: "0 4px",
                "font-size": "10px",
                "line-height": "16px"
              }
            }, {
              default: r(() => [b(p(S.platform || "DY"), 1)]),
              _: 2
            }, 1032, ["color"]), n("span", Gi, p(S.nickname), 1), S.gender && S.gender !== "未知" ? (i(), w("span", {
              key: 0,
              style: ha({
                marginLeft: "4px",
                color: S.gender === "男" ? "#168EF9" : "#F5588E",
                fontWeight: "bold",
                fontSize: "12px",
                flexShrink: 0
              })
            }, p(S.gender === "男" ? "♂" : "♀"), 5)) : H("", true), P(Ta)(S) ? (i(), w("span", Ji, p(P(za)(S)), 1)) : H("", true)], 8, Yi), n("div", Zi, [u(nt, {
              title: "点击可切换 意向/普通 状态"
            }, {
              default: r(() => [u(Je, {
                color: S.isHighIntention ? "orange" : "green",
                style: {
                  "flex-shrink": "0",
                  "margin-right": "4px",
                  border: "none",
                  "font-weight": "bold",
                  cursor: "pointer",
                  height: "16px",
                  "line-height": "16px",
                  "font-size": "10px"
                },
                onClick: ot(at => cn(S), ["stop"])
              }, {
                default: r(() => [b(p(S.isHighIntention ? "意向" : "普通"), 1)]),
                _: 2
              }, 1032, ["color", "onClick"])]),
              _: 2
            }, 1024), b(" " + p(P(Na)(S)), 1)]), P(dt)(S) ? (i(), W(nt, {
              key: 0,
              title: P(dt)(S),
              placement: "topLeft"
            }, {
              default: r(() => [n("div", Xi, p(P(dt)(S)), 1)]),
              _: 2
            }, 1032, ["title"])) : H("", true)])], 8, ji)) : g.key === "entry" ? (i(), W(nt, {
              key: 1,
              title: P(tn)(S)
            }, {
              default: r(() => [n("div", Qi, p(P(tn)(S)), 1)]),
              _: 2
            }, 1032, ["title"])) : g.key === "account" ? (i(), w("div", eu, [n("div", tu, [n("span", {
              style: {
                "font-weight": "500"
              },
              title: Ze(S, "主账号")
            }, p(Ze(S, "主账号")), 9, nu)])])) : g.key === "works" ? (i(), w("div", au, [n("span", null, p(P(Ua)(S.worksCount)), 1), S.isPrivate ? (i(), W(Je, {
              key: 0,
              color: "default",
              class: "lead-flag-tag"
            }, {
              default: r(() => [...(e[111] ||= [b("私密", -1)])]),
              _: 1
            })) : S.userGone || S.profileUnavailable && /用户不存在|已注销/.test(String(S.profileUnavailableReason || "")) ? (i(), W(Je, {
              key: 1,
              color: "default",
              class: "lead-flag-tag"
            }, {
              default: r(() => [...(e[112] ||= [b("已注销", -1)])]),
              _: 1
            })) : S.noWorks || S.worksCount !== null && S.worksCount !== undefined && Number(S.worksCount) === 0 ? (i(), W(Je, {
              key: 2,
              color: "orange",
              class: "lead-flag-tag"
            }, {
              default: r(() => [...(e[113] ||= [b("零作品", -1)])]),
              _: 1
            })) : H("", true)])) : g.key === "userComment" ? (i(), w(ve, {
              key: 4
            }, [S.leadKind === "video_card" ? (i(), w(ve, {
              key: 0
            }, [n("div", ou, [u(Je, {
              color: "blue",
              style: {
                border: "none",
                "margin-right": "4px",
                "font-size": "10px",
                height: "16px",
                "line-height": "16px",
                padding: "0 4px",
                "flex-shrink": "0"
              }
            }, {
              default: r(() => [...(e[114] ||= [b(" 卡片 ", -1)])]),
              _: 1
            }), n("span", {
              class: "user-comment-text",
              title: S.title
            }, p(S.title || "未知视频"), 9, su)]), n("a", {
              href: "#",
              class: "comment-source-video",
              onClick: ot(at => ht(S.videoUrl || S.url), ["prevent"])
            }, p(S.videoUrl || S.url), 9, lu)], 64)) : P(dt)(S) ? (i(), w(ve, {
              key: 1
            }, [u(nt, {
              title: P(dt)(S),
              placement: "topLeft"
            }, {
              default: r(() => [n("div", iu, [S.likeCount ? (i(), W(Je, {
                key: 0,
                color: "orange",
                style: {
                  border: "none",
                  "margin-right": "4px",
                  "font-size": "10px",
                  height: "16px",
                  "line-height": "16px",
                  padding: "0 4px",
                  "flex-shrink": "0"
                }
              }, {
                default: r(() => [b(" 👍 " + p(S.likeCount), 1)]),
                _: 2
              }, 1024)) : H("", true), n("span", uu, p(P(dt)(S)), 1)])]),
              _: 2
            }, 1032, ["title"]), S.title ? (i(), w("div", {
              key: 0,
              class: "comment-source-video",
              title: S.title
            }, " 来自: " + p(S.title), 9, ru)) : H("", true)], 64)) : (i(), w("span", cu, "—"))], 64)) : g.key === "touchDetail" ? (i(), W(nt, {
              key: 5,
              title: P(Pa)(S.touchCounts)
            }, {
              default: r(() => [n("div", du, [P(Ut)(S) ? (i(), w(ve, {
                key: 1
              }, [n("div", fu, [n("span", pu, p(Math.max(P(G)(S.touchCounts), 1)), 1), (i(true), w(ve, null, mt(na(S), at => {
                i();
                return W(Je, {
                  key: at.type,
                  color: at.color,
                  size: "small",
                  style: {
                    margin: "0"
                  }
                }, {
                  default: r(() => [b(p(at.label) + p(at.count > 1 ? `×${at.count}` : ""), 1)]),
                  _: 2
                }, 1032, ["color"]);
              }), 128))]), P(Tt)(S) ? (i(), W(nt, {
                key: 0,
                title: P(Tt)(S).text,
                placement: "topLeft"
              }, {
                default: r(() => [n("div", {
                  class: nn(["touch-content-preview", P(Tt)(S).kind])
                }, " [" + p(P(Tt)(S).label) + "] " + p(P(Tt)(S).text), 3)]),
                _: 2
              }, 1032, ["title"])) : H("", true), P(Et)(S) ? (i(), w("div", vu, " 最后触达: " + p(et(P(Et)(S))), 1)) : H("", true)], 64)) : (i(), w("span", mu, "未触达"))])]),
              _: 2
            }, 1032, ["title"])) : g.key === "capturedAt" ? (i(), w("span", gu, p(et(S.timestamp || S.capturedAt)), 1)) : g.key === "batchFollowResult" ? (i(), w(ve, {
              key: 7
            }, [(rt = S.lastBatchFollowResult) != null && rt.status ? (i(), W(nt, {
              key: 0,
              title: Gn(S.lastBatchFollowResult)
            }, {
              default: r(() => [n("div", yu, [u(Je, {
                color: S.lastBatchFollowResult.status === "success" ? "green" : "red",
                style: {
                  margin: "0"
                }
              }, {
                default: r(() => [b(p(S.lastBatchFollowResult.status === "success" ? "成功" : "失败"), 1)]),
                _: 2
              }, 1032, ["color"]), S.lastBatchFollowResult.at ? (i(), w("span", hu, p(et(S.lastBatchFollowResult.at)), 1)) : H("", true)])]),
              _: 2
            }, 1032, ["title"])) : (i(), w("span", ku, "—"))], 64)) : g.key === "action" ? (i(), W(ut, {
              key: 8,
              size: "small",
              wrap: ""
            }, {
              default: r(() => [u(_, {
                type: "text",
                size: "small",
                style: {
                  color: "#3b82f6"
                },
                onClick: at => rn(S)
              }, {
                default: r(() => [...(e[115] ||= [b("详情", -1)])]),
                _: 1
              }, 8, ["onClick"]), P(Cn)(S) ? (i(), W(nt, {
                key: 0,
                title: "打开该条评论并点开回复，随后由你操作"
              }, {
                default: r(() => [u(_, {
                  type: "text",
                  size: "small",
                  style: {
                    color: "#0d9488"
                  },
                  onClick: at => dn(S)
                }, {
                  default: r(() => [...(e[116] ||= [b(" 定位评论 ", -1)])]),
                  _: 1
                }, 8, ["onClick"])]),
                _: 2
              }, 1024)) : H("", true), u(_, {
                type: "text",
                size: "small",
                danger: "",
                onClick: at => Jn(S)
              }, {
                default: r(() => [...(e[117] ||= [b("删除", -1)])]),
                _: 1
              }, 8, ["onClick"])]),
              _: 2
            }, 1024)) : H("", true)];
          }),
          _: 1
        }, 8, ["dataSource", "pagination", "loading", "row-selection"])])) : Xt && Z.value === "blacklist" ? (i(), w("div", bu, [u(Ke, {
          "row-selection": {
            selectedRowKeys: Ie.value,
            onChange: g => Ie.value = g
          },
          dataSource: qe.value,
          columns: Wn,
          size: "small",
          "row-key": "id",
          pagination: {
            pageSize: 20,
            showTotal: g => `共 ${g} 条`
          },
          scroll: {
            y: "calc(100vh - 380px)"
          }
        }, {
          bodyCell: r(({
            column: g,
            record: S
          }) => [g.key === "lead" ? (i(), w("a", {
            key: 0,
            href: "#",
            onClick: ot(rt => ht(S.userUrl), ["prevent"]),
            class: "user-link"
          }, p(S.nickname || "查看主页"), 9, Cu)) : g.key === "platform" ? (i(), W(Je, {
            key: 1,
            color: S.platform === "DY" || S.platform === "抖音" ? "blue" : "error",
            size: "small"
          }, {
            default: r(() => [b(p(S.platform || "DY"), 1)]),
            _: 2
          }, 1032, ["color"])) : g.key === "touchSummary" ? (i(), w("span", wu, p(P(Fa)(S)), 1)) : g.key === "accountName" ? (i(), w("span", {
            key: 3,
            title: Ze(S)
          }, p(Ze(S)), 9, _u)) : g.key === "time" ? (i(), w("span", Su, p(S.timestamp ? et(S.timestamp) : "-"), 1)) : H("", true)]),
          _: 1
        }, 8, ["row-selection", "dataSource", "pagination"])])) : Z.value === "videos" ? (i(), w("div", xu, [u(Ke, {
          "row-selection": {
            selectedRowKeys: Se.value,
            preserveSelectedRowKeys: true,
            onChange: g => Se.value = g
          },
          dataSource: He.value,
          columns: jn,
          size: "small",
          "row-key": "url",
          pagination: U,
          scroll: {
            y: "calc(100vh - 380px)"
          },
          onChange: F
        }, {
          bodyCell: r(({
            column: g,
            record: S
          }) => [g.key === "title" ? (i(), w("a", {
            key: 0,
            href: "#",
            onClick: ot(rt => ht(S.url), ["prevent"]),
            class: "video-link resource-title-link"
          }, p(S.title || "历史视频"), 9, $u)) : g.key === "time" ? (i(), w("span", Au, p(S.timestamp ? et(S.timestamp) : "-"), 1)) : g.key === "action" ? (i(), W(_, {
            key: 2,
            type: "link",
            size: "small",
            onClick: rt => jt(S.url)
          }, {
            default: r(() => [...(e[118] ||= [b("复制链接", -1)])]),
            _: 1
          }, 8, ["onClick"])) : H("", true)]),
          _: 1
        }, 8, ["row-selection", "dataSource", "pagination"])])) : Z.value === "videoMainComments" ? (i(), w("div", Iu, [u(nl, {
          active: Z.value === "videoMainComments",
          "format-account-label": Ze,
          "format-time": et,
          "open-external": ht
        }, null, 8, ["active"])])) : Z.value === "collectedVideos" ? (i(), w("div", Tu, [u(Ke, {
          "row-selection": {
            selectedRowKeys: Oe.value,
            preserveSelectedRowKeys: true,
            onChange: g => Oe.value = g
          },
          dataSource: P(De),
          columns: qn,
          size: "small",
          "row-key": "key",
          pagination: P(ue),
          scroll: {
            y: "calc(100vh - 380px)"
          },
          onChange: f
        }, {
          bodyCell: r(({
            column: g,
            record: S
          }) => [g.key === "title" ? (i(), w("a", {
            key: 0,
            href: "#",
            class: "video-link resource-title-link",
            onClick: ot(rt => ht(S.videoUrl), ["prevent"])
          }, p(S.title || "未知视频"), 9, zu)) : g.key === "author" ? (i(), w("span", Nu, p(S.nickname || "未知作者"), 1)) : g.key === "accountName" ? (i(), w("span", {
            key: 2,
            title: Ze(S)
          }, p(Ze(S)), 9, Uu)) : g.key === "time" ? (i(), w("span", Pu, p(et(S.timestamp || S.capturedAt)), 1)) : g.key === "action" ? (i(), W(_, {
            key: 4,
            type: "link",
            size: "small",
            onClick: rt => jt(S.videoUrl)
          }, {
            default: r(() => [...(e[119] ||= [b("复制链接", -1)])]),
            _: 1
          }, 8, ["onClick"])) : H("", true)]),
          _: 1
        }, 8, ["row-selection", "dataSource", "pagination"])])) : Z.value === "collectedAuthors" ? (i(), w("div", Fu, [u(Ke, {
          "row-selection": {
            selectedRowKeys: Fe.value,
            preserveSelectedRowKeys: true,
            onChange: g => Fe.value = g
          },
          dataSource: P(I),
          columns: Yn,
          size: "small",
          "row-key": "key",
          pagination: P(fe),
          scroll: {
            y: "calc(100vh - 380px)"
          },
          onChange: v
        }, {
          bodyCell: r(({
            column: g,
            record: S
          }) => [g.key === "author" ? (i(), w("a", {
            key: 0,
            href: "#",
            class: "user-link resource-title-link",
            onClick: ot(rt => ht(S.profileUrl), ["prevent"])
          }, p(S.nickname || "未知作者"), 9, Mu)) : g.key === "latestTitle" ? (i(), w(ve, {
            key: 1
          }, [S.latestVideoUrl ? (i(), w("a", {
            key: 0,
            href: "#",
            class: "video-link",
            onClick: ot(rt => ht(S.latestVideoUrl), ["prevent"])
          }, p(S.latestTitle || "查看视频"), 9, Lu)) : (i(), w("span", Ru, p(S.latestTitle || "—"), 1))], 64)) : g.key === "accountName" ? (i(), w("span", {
            key: 2,
            title: Ze(S)
          }, p(Ze(S)), 9, Du)) : g.key === "time" ? (i(), w("span", Ou, p(et(S.timestamp || S.capturedAt)), 1)) : g.key === "action" ? (i(), W(_, {
            key: 4,
            type: "link",
            size: "small",
            onClick: rt => jt(S.profileUrl)
          }, {
            default: r(() => [...(e[120] ||= [b("复制链接", -1)])]),
            _: 1
          }, 8, ["onClick"])) : H("", true)]),
          _: 1
        }, 8, ["row-selection", "dataSource", "pagination"])])) : Z.value === "batchFollow" ? (i(), w("div", Eu, [u(Ws, {
          ref_key: "batchFollowHistoryRef",
          ref: vt
        }, null, 512)])) : H("", true)])]),
        _: 1
      }), u(Ra, {
        open: Ht.value,
        "onUpdate:open": e[33] ||= g => Ht.value = g,
        lead: an.value,
        onToggleIntention: cn,
        onLocateComment: dn
      }, null, 8, ["open", "lead"]), u(la, {
        open: Mt.value,
        "onUpdate:open": e[35] ||= g => Mt.value = g,
        title: "定位评论",
        "ok-text": "打开",
        "cancel-text": "取消",
        "confirm-loading": Wt.value,
        onOk: aa
      }, {
        default: r(() => {
          var g;
          return [e[121] ||= n("p", {
            style: {
              "margin-bottom": "12px",
              color: "var(--text-secondary)"
            }
          }, " 用软件内浏览器打开并滚到该条评论，自动点一下回复，然后由你继续操作。窗口需手动关闭，关闭后释放。 ", -1), n("div", Bu, [n("div", Ku, [(g = $t.value) != null && g.nickname ? (i(), w("span", Vu, "@" + p($t.value.nickname), 1)) : (i(), w("span", Hu, "该条评论"))]), n("div", Wu, p(On.value), 1)]), e[122] ||= n("div", {
            style: {
              "margin-bottom": "8px"
            }
          }, "打开账号", -1), u(te, {
            value: Lt.value,
            "onUpdate:value": e[34] ||= S => Lt.value = S,
            style: {
              width: "100%"
            },
            placeholder: "选择账号",
            options: Dn.value
          }, null, 8, ["value", "options"])];
        }),
        _: 1
      }, 8, ["open", "confirm-loading"]), u(to, {
        open: on.value,
        "onUpdate:open": e[36] ||= g => on.value = g
      }, null, 8, ["open"]), u(Xo, {
        open: At.value,
        "onUpdate:open": e[37] ||= g => At.value = g,
        title: "批量跟进",
        loading: bt.value,
        initialConfig: yt.value,
        "onUpdate:initialConfig": e[38] ||= g => yt.value = g,
        "selected-count": ee.value.length,
        "filtered-count": P($),
        "batch-accounts": Rt.value,
        "task-config": P(m).config,
        "is-free": (pn = P(m).authInfo) == null ? undefined : pn.isFree,
        onStart: ta
      }, null, 8, ["open", "loading", "initialConfig", "selected-count", "filtered-count", "batch-accounts", "task-config", "is-free"]), u(fl, {
        open: gt.value,
        "onUpdate:open": e[39] ||= g => gt.value = g,
        onImport: o
      }, null, 8, ["open"])]);
    };
  }
};
const ar = St(ju, [["__scopeId", "data-v-50d31dad"]]);
export { ar as default };
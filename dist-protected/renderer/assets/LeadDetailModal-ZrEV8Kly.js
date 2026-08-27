import { cy as q, cx as ae, cz as ue, A as ce, y as S, cD as w, cE as r, cL as h, cM as f, cF as c, cH as s, bF as a, cK as i, cG as d, aZ as C, cN as O, i as L, aO as K, cI as M, dx as de, o as v, d5 as V } from "./index-BegIKaMc.js";
import { j as me, x as fe, y as ye, A as ge, d as j, F as ke, t as he, D as ve, I as be, w as Ce, o as Le, T as Y, J as $, k as pe } from "./leadUserKey-Cwtp1anZ.js";
function Te(e) {
  return function (n) {
    const k = (n == null ? undefined : n.leadId) || (n == null ? undefined : n.key);
    if (!k || typeof e != "function") {
      return Promise.resolve(false);
    }
    let p = {};
    try {
      const g = {
        touchCounts: n.touchCounts,
        touchLog: n.touchLog,
        profileCommentAt: n.profileCommentAt,
        lastTouchAt: n.lastTouchAt,
        worksCount: n.worksCount,
        liked: n.liked,
        replied: n.replied,
        followed: n.followed,
        messaged: n.messaged,
        actions: n.actions,
        entrySource: n.entrySource,
        entryLabel: n.entryLabel,
        searchKeyword: n.searchKeyword,
        gender: n.gender,
        age: n.age,
        profileAgeChecked: n.profileAgeChecked,
        location: n.location,
        douyinId: n.douyinId,
        signature: n.signature,
        contact: n.contact,
        isPrivate: n.isPrivate,
        noWorks: n.noWorks,
        userGone: n.userGone,
        profileUnavailable: n.profileUnavailable,
        profileUnavailableReason: n.profileUnavailableReason,
        lastBatchSkipReason: n.lastBatchSkipReason,
        dmContent: n.dmContent,
        replyContent: n.replyContent,
        content: n.content,
        timeText: n.timeText,
        title: n.title
      };
      p = JSON.parse(JSON.stringify(g));
    } catch (g) {
      console.error("[useLeadHistorySync] Failed to serialize lead updates:", g);
      return Promise.resolve(false);
    }
    return e("update-lead-in-history", {
      leadId: k,
      updates: p
    }).catch(g => {
      console.error("[useLeadHistorySync] IPC update failed:", g);
      return false;
    });
  };
}
function it() {
  const {
    invoke: e
  } = q();
  return {
    syncLeadToHistory: Te(e)
  };
}
const U = Object.freeze([{
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
}, {
  value: "legacy",
  label: "其他/旧数据"
}]);
const E = Object.freeze(U.reduce((e, l) => {
  e[l.value] = l.label;
  return e;
}, {}));
const Ae = new Set(["search", "follow", "recommend", "like", "specific"]);
const Q = Object.freeze({
  entity_blogger: "线索采集：搜索博主",
  entity_user: "线索采集：搜索用户",
  entity_mutual: "线索采集：相互关注",
  entity_following: "线索采集：关注列表",
  entity_live: "线索采集：直播间",
  entity_comment: "线索采集：评论区潜客",
  entity_video: "线索采集：视频作品链接"
});
function J(e) {
  const l = String(e || "").trim();
  if (l) {
    return l.startsWith("监控") || l.includes("监控:") || l.includes("监控：");
  } else {
    return false;
  }
}
function Z(e) {
  const l = String(e || "").trim();
  if (l) {
    if (l.includes("实体获客：博主") || l.includes("实体获客:博主") || l.includes("线索采集：搜索博主") || l.includes("线索采集：博主")) {
      return "entity_blogger";
    } else if (l.includes("实体获客：用户") || l.includes("实体获客:用户") || l.includes("线索采集：搜索用户") || l.includes("线索采集：用户")) {
      return "entity_user";
    } else if (l.includes("实体获客：直播间") || l.includes("实体获客:直播间") || l.includes("线索采集：直播间") || l.includes("直播间")) {
      return "entity_live";
    } else if (l.includes("线索采集：关注列表") || l.includes("实体获客：关注列表") || l.includes("关注列表") && (l.includes("线索采集") || l.includes("实体获客"))) {
      return "entity_following";
    } else if (l.includes("实体获客：相互关注") || l.includes("实体获客:相互关注") || l.includes("线索采集：相互关注") || (l.includes("实体获客") || l.includes("线索采集")) && l.includes("相互关注")) {
      return "entity_mutual";
    } else {
      return "";
    }
  } else {
    return "";
  }
}
function Ne(e = {}) {
  const l = String(e.entrySource || "").trim();
  if (Q[l]) {
    return l;
  }
  if (l === "live" || l === "entity_live") {
    return "entity_live";
  }
  if (l === "monitor") {
    return "monitor";
  }
  if (l === "import" || l === "UID导入") {
    return "import";
  }
  if (Ae.has(l)) {
    return "leadgen";
  }
  const n = String(e.taskId || "");
  if (n === "import_uid" || n.startsWith("import_")) {
    return "import";
  }
  if (n.startsWith("monitor_")) {
    return "monitor";
  }
  if (n.startsWith("entity_")) {
    return Z(e.entryLabel || e.taskName) || "entity_live";
  }
  const k = Z(e.entryLabel || e.taskName);
  return k || (J(e.entryLabel) || J(e.taskName) ? "monitor" : e.searchKeyword || e.taskName || e.entryLabel || l ? "leadgen" : "legacy");
}
function xe(e = {}) {
  const l = Ne(e);
  if (l === "monitor") {
    return e.entryLabel || (e.taskName ? `监控: ${e.taskName}` : "监控任务");
  } else if (l.startsWith("entity_")) {
    return Q[l] || E[l] || "线索采集";
  } else if (l === "leadgen") {
    return "评论获客";
  } else if (l === "import") {
    return e.entryLabel || E.import;
  } else {
    return e.entryLabel || e.taskName || E.legacy;
  }
}
function rt() {
  return U.filter(e => e.value !== "legacy").concat(U.filter(e => e.value === "legacy"));
}
const Ie = {
  key: 0,
  class: "memory-container"
};
const Se = {
  class: "memory-section"
};
const we = {
  class: "user-main-info",
  style: {
    display: "flex",
    "align-items": "center",
    gap: "10px",
    "margin-bottom": "12px"
  }
};
const Oe = {
  style: {
    margin: "0"
  }
};
const Ee = {
  key: 0
};
const Ue = {
  key: 1
};
const De = {
  style: {
    color: "var(--text-strong)",
    "font-weight": "500"
  }
};
const ze = {
  key: 2
};
const He = {
  key: 3,
  style: {
    "margin-top": "10px"
  }
};
const Be = {
  class: "signature-box"
};
const Re = {
  class: "memory-section"
};
const Pe = {
  key: 1
};
const We = {
  key: 0
};
const Fe = {
  key: 0,
  style: {
    "margin-left": "6px",
    color: "var(--text-muted)",
    "font-size": "12px"
  }
};
const Ge = {
  key: 1
};
const Ke = {
  class: "memory-content-box"
};
const Me = {
  class: "memory-section"
};
const Ve = {
  key: 0
};
const je = {
  key: 1,
  class: "touch-empty-hint"
};
const Ye = {
  key: 2,
  class: "touch-log-list"
};
const $e = {
  class: "touch-log-head"
};
const Je = {
  key: 0,
  class: "touch-log-time"
};
const Ze = {
  key: 2,
  class: "touch-log-acc"
};
const qe = {
  key: 0,
  class: "touch-log-content"
};
const Qe = {
  key: 3,
  class: "touch-summary-tags"
};
const Xe = {
  class: "memory-section"
};
const _e = {
  key: 0,
  class: "ai-thought-box"
};
const et = {
  class: "ai-thought-header"
};
const tt = {
  class: "ai-thought-title"
};
const nt = {
  class: "ai-thought-body"
};
const ot = {
  __name: "LeadDetailModal",
  props: {
    open: Boolean,
    lead: Object
  },
  emits: ["update:open", "toggle-intention", "locate-comment"],
  setup(e, {
    emit: l
  }) {
    const n = e;
    const k = l;
    const p = ue();
    const g = ce(n.open);
    S(() => n.open, o => {
      g.value = o;
    });
    S(g, o => {
      k("update:open", o);
    });
    S(() => n.lead, o => {
      if (o) {
        me(o);
      }
    }, {
      immediate: true
    });
    const X = v(() => Ce(n.lead));
    const _ = v(() => xe(n.lead || {}));
    const ee = v(() => V(n.lead || {}, p.accounts, "未知账号"));
    const N = v(() => he(n.lead || {}));
    const te = v(() => !!be(n.lead || {}));
    const ne = v(() => ve(n.lead || {}));
    function oe(o = {}) {
      return V(o, p.accounts, o.accountName || "未知账号");
    }
    const x = v(() => {
      var T;
      var u;
      var A;
      var R;
      var P;
      var W;
      var F;
      var G;
      const o = n.lead;
      if (!o) {
        return [];
      }
      if (Array.isArray(o.touchLog) && o.touchLog.length) {
        return Le(o.touchLog).slice(0, 30).map(m => ({
          ...m,
          label: m.label || (m.type === "profileComment" ? "评论" : $[m.type] || m.type),
          color: Y[m.type] || "processing",
          channel: m.channel || (m.source === "batch" ? "线索库批量" : "自动获客")
        }));
      }
      const t = [];
      const y = m => m === "profileComment" || m === "reply" ? o.profileCommentAt || o.lastTouchAt || null : o.lastTouchAt || null;
      const b = (m, re) => {
        t.push({
          type: m,
          label: $[m],
          color: Y[m],
          content: re || "",
          at: y(m),
          accountName: o.accountName || ""
        });
      };
      if ((T = o.touchCounts) != null && T.like || o.liked) {
        b("like");
      }
      if (((u = o.touchCounts) == null ? undefined : u.profileComment) > 0 || pe(o)) {
        b("profileComment", ((A = o.actions) == null ? undefined : A.replyContent) || o.replyContent);
      } else if ((R = o.touchCounts) != null && R.reply || o.replied) {
        b("reply", ((P = o.actions) == null ? undefined : P.replyContent) || o.replyContent);
      }
      if ((W = o.touchCounts) != null && W.follow || o.followed) {
        b("follow");
      }
      if ((F = o.touchCounts) != null && F.message || o.messaged) {
        b("message", ((G = o.actions) == null ? undefined : G.dmContent) || o.dmContent);
      }
      return t;
    });
    const D = v(() => {
      const o = n.lead;
      if (!o || !o.profileCommentAt) {
        return null;
      } else {
        return {
          type: "profileComment",
          at: o.profileCommentAt
        };
      }
    });
    const z = v(() => {
      const o = n.lead;
      return o && o.lastTouchAt || null;
    });
    function le() {
      g.value = false;
    }
    const {
      send: se
    } = q();
    function H(o) {
      if (o) {
        se("open-url", o);
      }
    }
    function ie(o) {
      if (!o) {
        return "未知";
      }
      const t = new Date(typeof o == "number" ? o : Date.parse(o));
      if (Number.isNaN(t.getTime())) {
        return String(o);
      } else {
        return t.toLocaleString("zh-CN");
      }
    }
    function I(o) {
      if (o) {
        return new Date(o).toLocaleString("zh-CN");
      } else {
        return "";
      }
    }
    function B() {
      k("toggle-intention", n.lead);
    }
    return (o, t) => {
      const y = w("a-tag");
      const b = w("a-button");
      const T = w("a-modal");
      r();
      return h(T, {
        open: g.value,
        "onUpdate:open": t[3] ||= u => g.value = u,
        title: "线索详情",
        onOk: le,
        footer: null,
        cancelText: "取消",
        okText: "确定"
      }, {
        default: f(() => [e.lead ? (r(), c("div", Ie, [s("div", Se, [t[20] ||= s("h4", null, "👤 用户与获取信息", -1), s("div", we, [s("p", Oe, [t[4] ||= s("strong", null, "昵称:", -1), a(" " + i(e.lead.nickname), 1)]), e.lead.gender && e.lead.gender !== "未知" ? (r(), h(y, {
          key: 0,
          color: e.lead.gender === "男" ? "blue" : "pink",
          style: {
            "font-weight": "bold",
            "border-radius": "10px",
            padding: "0 8px"
          }
        }, {
          default: f(() => [a(i(e.lead.gender === "男" ? "♂ 男" : "♀ 女"), 1)]),
          _: 1
        }, 8, ["color"])) : d("", true), C(fe)(e.lead) ? (r(), h(y, {
          key: 1,
          color: "orange",
          style: {
            "border-radius": "4px"
          }
        }, {
          default: f(() => [a(i(C(ye)(e.lead)), 1)]),
          _: 1
        })) : d("", true), e.lead.location ? (r(), h(y, {
          key: 2,
          color: "cyan",
          style: {
            "border-radius": "4px"
          }
        }, {
          default: f(() => [a(" 📍 " + i(e.lead.location), 1)]),
          _: 1
        })) : d("", true)]), s("p", null, [t[5] ||= s("strong", null, "平台:", -1), a(" " + i(e.lead.platform || "DY"), 1)]), s("p", null, [t[6] ||= s("strong", null, "主页:", -1), t[7] ||= a(), s("a", {
          href: "#",
          onClick: t[0] ||= O(u => H(e.lead.userUrl), ["prevent"])
        }, i(e.lead.userUrl || "暂无"), 1)]), s("p", null, [t[8] ||= s("strong", null, "线索来源:", -1), t[9] ||= a(), L(y, {
          color: "geekblue"
        }, {
          default: f(() => [a(i(_.value), 1)]),
          _: 1
        })]), e.lead.searchKeyword ? (r(), c("p", Ee, [t[10] ||= s("strong", null, "搜索关键词:", -1), a(" " + i(e.lead.searchKeyword), 1)])) : d("", true), s("p", null, [t[11] ||= s("strong", null, "作品数量:", -1), a(" " + i(C(ge)(e.lead.worksCount)), 1)]), s("p", null, [t[12] ||= s("strong", null, "获取账号:", -1), t[13] ||= a(), L(y, {
          color: "purple"
        }, {
          default: f(() => [a(i(ee.value), 1)]),
          _: 1
        })]), s("p", null, [t[14] ||= s("strong", null, "获取时间:", -1), a(" " + i(ie(e.lead.timestamp || e.lead.capturedAt)), 1)]), e.lead.douyinId ? (r(), c("p", Ue, [t[15] ||= s("strong", null, "抖音号:", -1), t[16] ||= a(), s("span", De, i(e.lead.douyinId), 1)])) : d("", true), e.lead.contact ? (r(), c("p", ze, [t[17] ||= s("strong", null, "提取联系方式:", -1), t[18] ||= a(), L(y, {
          color: "success",
          style: {
            "font-weight": "bold"
          }
        }, {
          default: f(() => [a(i(e.lead.contact), 1)]),
          _: 1
        })])) : d("", true), e.lead.signature ? (r(), c("div", He, [t[19] ||= s("p", null, [s("strong", null, "个性签名:")], -1), s("div", Be, i(e.lead.signature), 1)])) : d("", true)]), s("div", Re, [t[26] ||= s("h4", null, "💬 互动上下文", -1), s("p", null, [t[21] ||= s("strong", null, "来源视频:", -1), a(" " + i(e.lead.title || "未知视频"), 1)]), s("p", null, [t[22] ||= s("strong", null, "视频链接:", -1), N.value ? (r(), c("a", {
          key: 0,
          href: "#",
          onClick: t[1] ||= O(u => H(N.value), ["prevent"])
        }, i(N.value), 1)) : (r(), c("span", Pe, "暂无链接"))]), ne.value ? (r(), c("p", We, [t[23] ||= s("strong", null, "评论位置:", -1), s("a", {
          href: "#",
          onClick: t[2] ||= O(u => k("locate-comment", e.lead), ["prevent"])
        }, "定位评论"), te.value ? d("", true) : (r(), c("span", Fe, "（无评论ID，可能无法滚到该条）"))])) : d("", true), s("p", null, [t[24] ||= s("strong", null, "评论时间:", -1), a(" " + i(e.lead.timeText) + " ", 1), e.lead.likeCount ? (r(), h(y, {
          key: 0,
          color: "orange",
          style: {
            "margin-left": "8px",
            "font-size": "11px"
          }
        }, {
          default: f(() => [a("👍 " + i(e.lead.likeCount) + " 赞", 1)]),
          _: 1
        })) : d("", true)]), D.value ? (r(), c("p", Ge, [t[25] ||= s("strong", null, "首作评论时间:", -1), a(" " + i(I(D.value.at)), 1)])) : d("", true), t[27] ||= s("p", null, [s("strong", null, "评论内容:")], -1), s("div", Ke, i(X.value || "（暂无评论原文）"), 1)]), s("div", Me, [t[30] ||= s("h4", null, "⚡ 触达时间线", -1), z.value ? (r(), c("p", Ve, [t[28] ||= s("strong", null, "最后触达时间:", -1), a(" " + i(I(z.value)), 1)])) : d("", true), x.value.length === 0 && C(j)(e.lead.touchCounts) === 0 && !e.lead.selfLiked ? (r(), c("p", je, " 暂未对该线索执行任何触达 ")) : d("", true), x.value.length ? (r(), c("div", Ye, [(r(true), c(K, null, M(x.value, (u, A) => {
          r();
          return c("div", {
            key: A,
            class: "touch-log-item"
          }, [s("div", $e, [u.at ? (r(), c("span", Je, i(I(u.at)), 1)) : d("", true), L(y, {
            size: "small",
            color: u.color || "processing"
          }, {
            default: f(() => [a(i(u.label || u.type), 1)]),
            _: 2
          }, 1032, ["color"]), u.channel && u.channel !== "自动获客" ? (r(), h(y, {
            key: 1,
            size: "small",
            class: "touch-log-channel"
          }, {
            default: f(() => [a(i(u.channel), 1)]),
            _: 2
          }, 1024)) : d("", true), u.accountName ? (r(), c("span", Ze, "@" + i(oe(u)), 1)) : d("", true)]), u.content ? (r(), c("div", qe, i(u.content), 1)) : d("", true)]);
        }), 128))])) : C(j)(e.lead.touchCounts) > 0 || e.lead.selfLiked ? (r(), c("div", Qe, [(r(true), c(K, null, M(C(ke)(e.lead.touchCounts), u => {
          r();
          return h(y, {
            key: u.type,
            color: u.color
          }, {
            default: f(() => [a(i(u.label) + " " + i(u.count), 1)]),
            _: 2
          }, 1032, ["color"]);
        }), 128)), e.lead.selfLiked ? (r(), h(y, {
          key: 0,
          color: "red"
        }, {
          default: f(() => [...(t[29] ||= [a("已互赞", -1)])]),
          _: 1
        })) : d("", true)])) : d("", true)]), s("div", Xe, [t[32] ||= s("h4", null, "📋 意向分析", -1), e.lead.aiThought || e.lead.thought ? (r(), c("div", _e, [s("div", et, [s("div", tt, [L(C(de), {
          size: 14
        }), t[31] ||= a(" AI 意向深度分析 ", -1)]), L(b, {
          size: "small",
          type: "link",
          onClick: B
        }, {
          default: f(() => [a(i(e.lead.isHighIntention ? "标记为普通意向" : "标记为高意向"), 1)]),
          _: 1
        })]), s("div", nt, i(e.lead.aiThought || e.lead.thought), 1)])) : (r(), h(b, {
          key: 1,
          block: "",
          onClick: B
        }, {
          default: f(() => [a(i(e.lead.isHighIntention ? "设为普通意向" : "设为高意向"), 1)]),
          _: 1
        }))])])) : d("", true)]),
        _: 1
      }, 8, ["open"]);
    };
  }
};
const at = ae(ot, [["__scopeId", "data-v-05ffff1e"]]);
export { at as L, Te as c, xe as f, rt as g, Ne as r, it as u };
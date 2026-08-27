import { cz as Lt, cy as Dt, cC as S, cx as Ut, cD as h, cE as m, cF as g, cH as a, i as l, cM as i, bF as k, cK as p, aO as q, cI as et, cL as N, cG as z, o as Q, x as It, S as ie, M as oe, aZ as rt, cJ as ue, A as y, cV as Mt } from "./index-BegIKaMc.js";
import { P as re } from "./plus-Cl_SEO9R.js";
async function Pt(r, o, E = null) {
  const A = await o("get-running-work-publish-task-ids");
  if (!Array.isArray(A)) {
    throw new Error("无法读取作品发布运行状态");
  }
  const b = Array.isArray(E) ? E : await o("get-work-publish-tasks");
  const C = new Set(A.map(String));
  const $ = [];
  (Array.isArray(b) ? b : []).forEach(T => {
    if (!C.has(String((T == null ? undefined : T.id) || ""))) {
      return;
    }
    [...new Set((T.items || []).map(c => c.accountId).filter(Boolean))].forEach(c => {
      const s = String(c);
      if (!s) {
        return;
      }
      const d = r.accounts.find(w => String(w.id) === s);
      $.push({
        id: s,
        workPublishTaskId: T.id,
        platform: (d == null ? undefined : d.platform) || "douyin",
        name: (d == null ? undefined : d.name) || "",
        nickname: (d == null ? undefined : d.nickname) || (d == null ? undefined : d.name) || "",
        taskKind: "work_publish"
      });
    });
  });
  r.clearWorkPublishRunningTasks();
  r.workPublishRunningTasks.push(...$);
  return C;
}
function de() {
  const r = Lt();
  const {
    invoke: o
  } = Dt();
  async function E(b) {
    const C = await o("stop-work-publish-task-runtime", {
      taskId: b
    }).catch($ => ({
      success: false,
      error: ($ == null ? undefined : $.message) || String($)
    }));
    if (C != null && C.success) {
      r.removeWorkPublishRunningTask(b);
      await o("update-work-publish-task", {
        id: b,
        patch: {
          status: "stopped",
          endedAt: Date.now(),
          endReason: "manual_stop"
        }
      }).catch(() => {});
      return !!C.wasRunning;
    } else {
      S.error(`停止失败：${(C == null ? undefined : C.error) || "后台无响应"}`);
      return false;
    }
  }
  async function A(b) {
    if (b == null || !b.id) {
      return null;
    }
    if (!r.canUseWorkPublish) {
      S.warning("当前未激活专业版，试用期间或升级专业版后可使用作品发布");
      return null;
    }
    const C = Array.isArray(b.items) ? b.items : [];
    const $ = C.filter(d => {
      var w;
      return d.accountId && ((w = d.media) == null ? undefined : w.filePath) && (d.title || d.description);
    });
    if (!$.length) {
      S.warning("请先完成账号、素材与文案配对");
      return null;
    }
    const T = [...new Set($.map(d => String(d.accountId)))].map(d => r.accounts.find(L => String(L.id) === d) || {
      id: d,
      platform: "douyin",
      name: d
    });
    const V = C.map(d => {
      var w;
      return {
        ...d,
        status: d.accountId && (w = d.media) != null && w.filePath && (d.title || d.description) ? d.status === "published" ? "published" : "ready" : d.status
      };
    });
    const c = await o("save-work-publish-task", {
      ...b,
      items: V,
      status: "ready"
    });
    if (c == null || !c.id) {
      S.error("保存任务失败");
      return null;
    }
    const s = await o("start-work-publish-task-runtime", {
      taskRecord: c,
      accounts: T
    });
    if (s != null && s.success) {
      await Pt(r, o);
      S.success("已开始自动发布");
      return c;
    } else {
      S.error((s == null ? undefined : s.error) || "启动失败");
      return null;
    }
  }
  return {
    startWorkPublishTask: A,
    stopWorkPublishTask: E,
    syncWorkPublishRuntimeTasks: b => Pt(r, o, b)
  };
}
const ce = {
  class: "wp-editor"
};
const me = {
  class: "wp-block"
};
const pe = {
  class: "wp-block"
};
const fe = {
  class: "wp-media-bar"
};
const ke = {
  class: "wp-hint"
};
const ve = {
  key: 0,
  class: "wp-media-list"
};
const ge = {
  class: "wp-media-name"
};
const ye = {
  class: "wp-block"
};
const we = {
  class: "wp-sim-row"
};
const be = {
  class: "wp-sim-val"
};
const he = {
  class: "wp-block"
};
const $e = {
  key: 0,
  class: "wp-stagger"
};
const Ae = {
  class: "wp-hint"
};
const Se = {
  key: 0,
  class: "wp-block"
};
const Ce = {
  class: "wp-block-title"
};
const _e = {
  class: "wp-items"
};
const xe = {
  class: "wp-item-head"
};
const Te = {
  class: "wp-hint"
};
const Ie = {
  __name: "WorkPublishTaskEditor",
  props: {
    model: {
      type: Object,
      required: true
    },
    accounts: {
      type: Array,
      default: () => []
    },
    quotaText: {
      type: String,
      default: "-/-"
    },
    generating: {
      type: Boolean,
      default: false
    },
    lockAccounts: {
      type: Boolean,
      default: false
    }
  },
  emits: ["pick-media", "generate", "pair-only"],
  setup(r) {
    const o = r;
    const E = Q(() => (o.accounts || []).filter(c => c.platform === "douyin").map(c => ({
      value: c.id,
      label: c.nickname || c.name || c.id
    })));
    const A = Q(() => Math.min((o.model.selectedAccounts || []).length, (o.model.mediaList || []).length));
    const b = Q(() => A.value > 0);
    const C = Q(() => A.value > 0 && (!!String(o.model.seedTitle || "").trim() || !!String(o.model.seedDesc || "").trim()));
    function $(c, s) {
      o.model[c] = s;
    }
    function B(c) {
      const s = Math.max(0, Number(c) || 0);
      o.model.staggerMinSec = s;
      if (Number(o.model.staggerMaxSec) < s) {
        o.model.staggerMaxSec = s;
      }
    }
    function T(c) {
      const s = Math.max(0, Number(c) || 0);
      o.model.staggerMaxSec = s;
      if (Number(o.model.staggerMinSec) > s) {
        o.model.staggerMinSec = s;
      }
    }
    function V(c) {
      o.model.mediaList.splice(c, 1);
    }
    return (c, s) => {
      var F;
      const d = h("a-select");
      const w = h("a-button");
      const L = h("a-tag");
      const M = h("a-input");
      const G = h("a-textarea");
      const X = h("a-slider");
      const P = h("a-space");
      const H = h("a-radio-button");
      const x = h("a-radio-group");
      const J = h("a-input-number");
      m();
      return g("div", ce, [a("section", me, [s[9] ||= a("div", {
        class: "wp-block-title"
      }, "账号", -1), l(d, {
        value: r.model.selectedAccounts,
        mode: "multiple",
        "allow-clear": "",
        placeholder: "从账号池选择抖音号",
        style: {
          width: "100%"
        },
        options: E.value,
        disabled: r.lockAccounts,
        "onUpdate:value": s[0] ||= v => $("selectedAccounts", v)
      }, null, 8, ["value", "options", "disabled"]), s[10] ||= a("p", {
        class: "wp-hint"
      }, "将与素材按顺序 1:1 配对，多出的一侧忽略", -1)]), a("section", pe, [s[15] ||= a("div", {
        class: "wp-block-title"
      }, "素材", -1), a("div", fe, [l(w, {
        size: "small",
        type: "primary",
        ghost: "",
        disabled: r.lockAccounts,
        onClick: s[1] ||= v => c.$emit("pick-media")
      }, {
        default: i(() => [...(s[11] ||= [k("添加视频", -1)])]),
        _: 1
      }, 8, ["disabled"]), l(w, {
        size: "small",
        danger: "",
        ghost: "",
        disabled: r.lockAccounts || !r.model.mediaList.length,
        onClick: s[2] ||= v => $("mediaList", [])
      }, {
        default: i(() => [...(s[12] ||= [k("清空", -1)])]),
        _: 1
      }, 8, ["disabled"]), a("span", ke, "已选 " + p(r.model.mediaList.length) + " 个（暂仅支持视频）", 1)]), r.model.mediaList.length ? (m(), g("div", ve, [(m(true), g(q, null, et(r.model.mediaList, (v, O) => {
        m();
        return g("div", {
          key: v.id,
          class: "wp-media-row"
        }, [l(L, {
          color: "blue"
        }, {
          default: i(() => [...(s[13] ||= [k("视频", -1)])]),
          _: 1
        }), a("span", ge, p(O + 1) + ". " + p(v.fileName), 1), r.lockAccounts ? z("", true) : (m(), N(w, {
          key: 0,
          type: "link",
          size: "small",
          danger: "",
          onClick: D => V(O)
        }, {
          default: i(() => [...(s[14] ||= [k("移除", -1)])]),
          _: 1
        }, 8, ["onClick"]))]);
      }), 128))])) : z("", true)]), a("section", ye, [s[19] ||= a("div", {
        class: "wp-block-title"
      }, "文案草稿", -1), l(M, {
        value: r.model.seedTitle,
        placeholder: "草稿标题",
        maxlength: 80,
        "allow-clear": "",
        class: "wp-mb",
        "onUpdate:value": s[3] ||= v => $("seedTitle", v)
      }, null, 8, ["value"]), l(G, {
        value: r.model.seedDesc,
        placeholder: "草稿描述：卖点、语气、想强调的关键词…",
        rows: 3,
        maxlength: 800,
        "onUpdate:value": s[4] ||= v => $("seedDesc", v)
      }, null, 8, ["value"]), a("div", we, [s[16] ||= a("span", null, "差异度", -1), l(X, {
        value: r.model.similarity,
        min: 0,
        max: 100,
        style: {
          flex: "1",
          margin: "0 12px"
        },
        "onUpdate:value": s[5] ||= v => $("similarity", v)
      }, null, 8, ["value"]), a("span", be, p(r.model.similarity), 1)]), l(P, null, {
        default: i(() => [l(w, {
          type: "primary",
          size: "small",
          loading: r.generating,
          disabled: !C.value,
          onClick: s[6] ||= v => c.$emit("generate")
        }, {
          default: i(() => [...(s[17] ||= [k(" AI 生成并配对 ", -1)])]),
          _: 1
        }, 8, ["loading", "disabled"]), l(w, {
          size: "small",
          disabled: !b.value,
          onClick: s[7] ||= v => c.$emit("pair-only")
        }, {
          default: i(() => [...(s[18] ||= [k("仅配对", -1)])]),
          _: 1
        }, 8, ["disabled"]), l(L, {
          color: "blue"
        }, {
          default: i(() => [k("每天额度 " + p(r.quotaText), 1)]),
          _: 1
        })]),
        _: 1
      })]), a("section", he, [s[25] ||= a("div", {
        class: "wp-block-title"
      }, "发布节奏", -1), l(x, {
        value: r.model.publishMode || "interval",
        "button-style": "solid",
        size: "small",
        class: "wp-mode",
        "onUpdate:value": s[8] ||= v => $("publishMode", v)
      }, {
        default: i(() => [l(H, {
          value: "parallel"
        }, {
          default: i(() => [...(s[20] ||= [k("同时发布", -1)])]),
          _: 1
        }), l(H, {
          value: "interval"
        }, {
          default: i(() => [...(s[21] ||= [k("间隔发布", -1)])]),
          _: 1
        })]),
        _: 1
      }, 8, ["value"]), (r.model.publishMode || "interval") === "interval" ? (m(), g("div", $e, [s[22] ||= a("span", null, "间隔区间", -1), l(J, {
        value: r.model.staggerMinSec,
        min: 0,
        max: 7200,
        size: "small",
        "onUpdate:value": B
      }, null, 8, ["value"]), s[23] ||= a("span", null, "—", -1), l(J, {
        value: r.model.staggerMaxSec,
        min: 0,
        max: 7200,
        size: "small",
        "onUpdate:value": T
      }, null, 8, ["value"]), s[24] ||= a("span", {
        class: "wp-unit"
      }, "秒", -1)])) : z("", true), a("p", Ae, p((r.model.publishMode || "interval") === "parallel" ? "各账号同时开始上传发布（更快，风控风险更高）" : `每条发布后，在 ${r.model.staggerMinSec ?? 0}–${r.model.staggerMaxSec ?? 0} 秒内随机等待再发下一条`), 1)]), (F = r.model.items) != null && F.length ? (m(), g("section", Se, [a("div", Ce, "发布项 " + p(r.model.items.length), 1), a("div", _e, [(m(true), g(q, null, et(r.model.items, (v, O) => {
        var D;
        m();
        return g("div", {
          key: v.id,
          class: "wp-item-card"
        }, [a("div", xe, [a("strong", null, p(v.accountName || v.accountId), 1), a("span", Te, p((D = v.media) == null ? undefined : D.fileName), 1), l(w, {
          type: "link",
          size: "small",
          danger: "",
          onClick: j => r.model.items.splice(O, 1)
        }, {
          default: i(() => [...(s[26] ||= [k("删", -1)])]),
          _: 1
        }, 8, ["onClick"])]), l(M, {
          value: v.title,
          "onUpdate:value": j => v.title = j,
          size: "small",
          placeholder: "标题",
          class: "wp-mb"
        }, null, 8, ["value", "onUpdate:value"]), l(G, {
          value: v.description,
          "onUpdate:value": j => v.description = j,
          rows: 2,
          size: "small",
          placeholder: "描述"
        }, null, 8, ["value", "onUpdate:value"])]);
      }), 128))])])) : z("", true)]);
    };
  }
};
const zt = Ut(Ie, [["__scopeId", "data-v-52974525"]]);
const Me = {
  class: "work-publish-view"
};
const Pe = {
  class: "tasks-toolbar"
};
const ze = {
  key: 0,
  class: "selection-hint"
};
const Le = {
  class: "table-container"
};
const De = ["title"];
const Ue = {
  key: 1,
  class: "cell-ellipsis"
};
const Ne = {
  key: 2,
  class: "stats-text"
};
const Oe = {
  key: 5,
  class: "action-links"
};
const We = {
  key: 0
};
const qe = {
  class: "field",
  style: {
    "margin-bottom": "12px"
  }
};
const Ee = {
  class: "detail-stats-row"
};
const Be = {
  class: "detail-stat"
};
const Ve = {
  class: "detail-stat"
};
const Fe = {
  class: "detail-stat"
};
const je = {
  class: "detail-stat"
};
const Qe = {
  class: "detail-meta"
};
const Ge = {
  key: 2,
  class: "error-text"
};
const Ke = {
  class: "history-item"
};
const He = {
  class: "history-title"
};
const Je = {
  class: "wp-muted"
};
const Re = {
  class: "history-copy"
};
const Ze = {
  key: 0,
  class: "error-text"
};
const Xe = {
  class: "wp-muted"
};
const Ye = {
  key: 1,
  class: "log-list"
};
const ts = {
  class: "log-time"
};
const es = {
  __name: "WorkPublish",
  setup(r) {
    const {
      invoke: o,
      on: E
    } = Dt();
    const A = Lt();
    const {
      startWorkPublishTask: b,
      stopWorkPublishTask: C,
      syncWorkPublishRuntimeTasks: $
    } = de();
    const B = y(false);
    const T = y(false);
    const V = y([]);
    const c = y([]);
    const s = y(null);
    const d = y(false);
    const w = y(false);
    const L = y(false);
    const M = It(pt());
    const G = y(false);
    const X = y(false);
    const P = y(null);
    const H = y(false);
    const x = y(null);
    const J = y(false);
    const F = y(null);
    const v = y(false);
    const O = y(null);
    const D = It({});
    const j = y(null);
    const st = y(null);
    const nt = y(null);
    const at = y(null);
    const Y = y(null);
    const Nt = [{
      title: "任务",
      key: "name",
      dataIndex: "name",
      width: 180,
      ellipsis: true
    }, {
      title: "账号",
      key: "accounts",
      width: 160,
      ellipsis: true
    }, {
      title: "进度",
      key: "stats",
      width: 160
    }, {
      title: "更新时间",
      key: "time",
      width: 140
    }, {
      title: "状态",
      key: "status",
      width: 90
    }, {
      title: "操作",
      key: "actions",
      width: 320,
      fixed: "right"
    }];
    const Ot = [{
      title: "账号",
      dataIndex: "accountName",
      width: 120
    }, {
      title: "素材",
      key: "media",
      width: 160
    }, {
      title: "标题",
      dataIndex: "title",
      width: 160,
      ellipsis: true
    }, {
      title: "状态",
      key: "status",
      width: 90
    }, {
      title: "发布时间",
      key: "publishedAt",
      width: 140
    }, {
      title: "错误",
      key: "error",
      width: 160,
      ellipsis: true
    }];
    const Wt = Q(() => ({
      selectedRowKeys: c.value,
      onChange: t => {
        c.value = t;
      },
      getCheckboxProps: t => ({
        disabled: lt(t)
      })
    }));
    const dt = Q(() => {
      const t = s.value || A.authInfo.workPublishQuota;
      if (t) {
        return `${t.remaining ?? 0}/${t.limit ?? 0}`;
      } else {
        return "-/-";
      }
    });
    const ct = Q(() => {
      var e;
      return (((e = F.value) == null ? undefined : e.items) || []).filter(n => n.status === "published" || n.status === "failed").slice().sort((n, _) => (_.publishedAt || 0) - (n.publishedAt || 0));
    });
    const mt = Q(() => {
      var e;
      const t = (e = O.value) == null ? undefined : e.id;
      if (t) {
        return [...(D[t] || [])].reverse();
      } else {
        return [];
      }
    });
    function pt() {
      return {
        name: `作品发布 ${R(Date.now())}`,
        selectedAccounts: [],
        mediaList: [],
        seedTitle: "",
        seedDesc: "",
        similarity: 30,
        publishMode: "interval",
        staggerMinSec: 60,
        staggerMaxSec: 180,
        items: []
      };
    }
    function R(t) {
      if (!t) {
        return "-";
      }
      const e = new Date(t);
      const n = _ => String(_).padStart(2, "0");
      return `${n(e.getMonth() + 1)}-${n(e.getDate())} ${n(e.getHours())}:${n(e.getMinutes())}`;
    }
    function ft(t) {
      const e = (t.items || []).map(_ => _.accountName || _.accountId).filter(Boolean);
      const n = [...new Set(e)];
      if (n.length) {
        return n.slice(0, 3).join("、") + (n.length > 3 ? ` 等${n.length}个` : "");
      } else {
        return (t.selectedAccounts || []).map(K => {
          const W = A.accounts.find(ot => String(ot.id) === String(K));
          return (W == null ? undefined : W.nickname) || (W == null ? undefined : W.name) || K;
        }).join("、") || "—";
      }
    }
    function qt(t = {}) {
      if (!t || !t.total) {
        return "—";
      } else {
        return `发${t.published || 0}/败${t.failed || 0}/待${(t.ready || 0) + (t.pending || 0)}`;
      }
    }
    function kt(t) {
      return {
        draft: "default",
        ready: "blue",
        running: "processing",
        stopped: "warning",
        done: "success"
      }[t] || "default";
    }
    function vt(t) {
      return {
        draft: "草稿",
        ready: "就绪",
        running: "运行中",
        stopped: "已停止",
        done: "已完成"
      }[t] || t;
    }
    function gt(t) {
      return {
        draft: "default",
        ready: "blue",
        publishing: "processing",
        published: "success",
        failed: "error",
        queued: "processing"
      }[t] || "default";
    }
    function yt(t) {
      return {
        draft: "草稿",
        ready: "就绪",
        publishing: "发布中",
        published: "已发布",
        failed: "失败",
        queued: "排队"
      }[t] || t;
    }
    function lt(t) {
      return (t == null ? undefined : t.status) === "running" || A.workPublishRunningTasks.some(e => String(e.workPublishTaskId) === String(t == null ? undefined : t.id));
    }
    function wt(t) {
      return (D[t] || []).length;
    }
    function bt(t) {
      const e = new Map((A.accounts || []).map(n => [n.id, n]));
      return (t.selectedAccounts || []).map(n => e.get(n)).filter(Boolean);
    }
    async function Et() {
      try {
        const t = await o("get-work-publish-quota");
        if (t != null && t.success && t.data) {
          s.value = t.data;
          A.authInfo.workPublishQuota = t.data;
        }
      } catch {}
    }
    async function U() {
      B.value = true;
      try {
        const t = await o("get-work-publish-tasks");
        V.value = Array.isArray(t) ? t : [];
        await $(V.value).catch(() => {});
      } finally {
        B.value = false;
      }
    }
    async function ht(t) {
      var n;
      const e = await o("pick-work-publish-media");
      if (e == null || !e.success) {
        S.error((e == null ? undefined : e.msg) || "选择素材失败");
        return;
      }
      if ((n = e.files) != null && n.length) {
        t.mediaList.push(...e.files);
      }
    }
    function Bt() {
      return ht(M);
    }
    async function $t(t) {
      const e = await o("pair-work-publish-items", {
        accounts: bt(t),
        mediaList: t.mediaList,
        copies: []
      });
      t.items = Array.isArray(e) ? e : [];
      S.success(`已配对 ${t.items.length} 项`);
    }
    function Vt() {
      return $t(M);
    }
    async function At(t) {
      if (!A.canUseWorkPublish) {
        S.warning("当前未激活专业版，试用期间或升级专业版后可使用作品发布");
        return;
      }
      const e = Math.min((t.selectedAccounts || []).length, (t.mediaList || []).length);
      if (e) {
        d.value = true;
        try {
          const n = await o("work-publish-generate", {
            seedTitle: t.seedTitle,
            seedDesc: t.seedDesc,
            count: e,
            similarity: t.similarity
          });
          if (n != null && n.workPublishQuota) {
            s.value = n.workPublishQuota;
            A.authInfo.workPublishQuota = n.workPublishQuota;
          }
          if (n == null || !n.success) {
            S.error((n == null ? undefined : n.msg) || "生成失败");
            return;
          }
          const _ = await o("pair-work-publish-items", {
            accounts: bt(t),
            mediaList: t.mediaList,
            copies: n.items || []
          });
          t.items = Array.isArray(_) ? _ : [];
          S.success(`已生成 ${t.items.length} 套文案`);
        } finally {
          d.value = false;
        }
      }
    }
    function Ft() {
      return At(M);
    }
    function jt() {
      if (!A.canUseWorkPublish) {
        S.warning("当前未激活专业版，试用期间或升级专业版后可使用作品发布");
        return;
      }
      Object.assign(M, pt());
      w.value = true;
    }
    async function St(t) {
      var e;
      L.value = true;
      try {
        if ((e = M.items) == null || !e.length) {
          S.warning("请先配对发布项");
          return;
        }
        const n = await o("save-work-publish-task", {
          ...M,
          status: "ready"
        });
        if (!n) {
          S.error("保存失败");
          return;
        }
        w.value = false;
        await U();
        if (t) {
          await b(n);
          await U();
        } else {
          S.success("已保存");
        }
      } finally {
        L.value = false;
      }
    }
    function Qt() {
      return St(false);
    }
    function Gt() {
      return St(true);
    }
    function Kt(t) {
      P.value = JSON.parse(JSON.stringify({
        ...t,
        selectedAccounts: t.selectedAccounts || [],
        mediaList: t.mediaList || [],
        items: t.items || []
      }));
      G.value = true;
    }
    async function Ht() {
      if (P.value) {
        X.value = true;
        try {
          await o("save-work-publish-task", {
            ...P.value,
            status: P.value.status === "running" ? "ready" : P.value.status || "ready"
          });
          G.value = false;
          S.success("已保存");
          await U();
        } finally {
          X.value = false;
        }
      }
    }
    async function Jt(t) {
      const e = await o("get-work-publish-tasks").then(n => (Array.isArray(n) ? n : []).find(_ => String(_.id) === String(t.id))).catch(() => t);
      x.value = e || t;
      H.value = true;
    }
    function Rt(t) {
      if (!t) {
        x.value = null;
      }
    }
    function Zt(t) {
      F.value = t;
      J.value = true;
    }
    async function Xt(t) {
      O.value = t;
      const e = await o("get-work-publish-task-runtime-logs", {
        taskId: t.id
      }).catch(() => []);
      D[t.id] = Array.isArray(e) ? e : [];
      v.value = true;
    }
    async function Yt(t) {
      j.value = t.id;
      try {
        await b(t);
        await U();
      } finally {
        j.value = null;
      }
    }
    async function te(t) {
      st.value = t.id;
      try {
        await C(t.id);
        await U();
      } finally {
        st.value = null;
      }
    }
    async function ee(t) {
      Mt.confirm({
        title: "删除任务？",
        content: `确认删除「${t.name}」？`,
        okType: "danger",
        async onOk() {
          nt.value = t.id;
          try {
            await o("delete-work-publish-task", t.id);
            await U();
          } finally {
            nt.value = null;
          }
        }
      });
    }
    async function se() {
      Mt.confirm({
        title: "批量删除？",
        content: `将删除 ${c.value.length} 个任务`,
        okType: "danger",
        async onOk() {
          T.value = true;
          try {
            await o("delete-work-publish-tasks", c.value);
            c.value = [];
            await U();
          } finally {
            T.value = false;
          }
        }
      });
    }
    async function ne(t) {
      var e;
      at.value = t.id;
      try {
        const n = (e = (t.items || []).find(_ => _.accountId)) == null ? undefined : e.accountId;
        if (!n) {
          S.warning("没有可监控的账号窗口");
          return;
        }
        if (Y.value === t.id) {
          await o("hide-work-publish-monitor", {
            accountId: n
          });
          Y.value = null;
        } else if (await o("show-work-publish-monitor", {
          accountId: n
        })) {
          Y.value = t.id;
        } else {
          S.warning("监控窗口尚未创建，请稍后再试");
        }
      } finally {
        at.value = null;
      }
    }
    let it = null;
    ie(async () => {
      await Promise.all([Et(), U()]);
      const t = await o("get-work-publish-task-runtime-logs", {}).catch(() => ({}));
      if (t && typeof t == "object" && !Array.isArray(t)) {
        Object.keys(t).forEach(e => {
          D[e] = t[e] || [];
        });
      }
      it = E("work-publish-task-event", e => {
        if (e != null && e.taskId) {
          if (e.type === "log") {
            const n = D[e.taskId] || [];
            n.push(e);
            if (n.length > 400) {
              n.splice(0, n.length - 400);
            }
            D[e.taskId] = n;
          }
          if (e.type === "item-progress" || e.type === "task-finished") {
            U();
          }
        }
      });
    });
    oe(() => {
      if (typeof it == "function") {
        it();
      }
    });
    return (t, e) => {
      const n = h("a-button");
      const _ = h("a-space");
      const K = h("a-tag");
      const W = h("a-table");
      const ot = h("a-input");
      const Ct = h("a-modal");
      const ut = h("a-drawer");
      const _t = h("a-empty");
      const ae = h("a-timeline-item");
      const le = h("a-timeline");
      m();
      return g("div", Me, [a("div", Pe, [e[13] ||= a("div", {
        class: "toolbar-left"
      }, [a("h3", null, "作品发布"), a("span", {
        class: "toolbar-desc"
      }, "多账号批量上传视频，AI 生成差异化文案后自动发布（暂仅支持视频）")], -1), l(_, {
        size: 8
      }, {
        default: i(() => [c.value.length ? (m(), g("span", ze, "已选 " + p(c.value.length) + " 条", 1)) : z("", true), l(n, {
          danger: "",
          size: "small",
          disabled: !c.value.length,
          loading: T.value,
          onClick: se
        }, {
          default: i(() => [...(e[10] ||= [k(" 批量删除 ", -1)])]),
          _: 1
        }, 8, ["disabled", "loading"]), l(n, {
          size: "small",
          loading: B.value,
          onClick: U
        }, {
          default: i(() => [...(e[11] ||= [k("刷新", -1)])]),
          _: 1
        }, 8, ["loading"]), l(n, {
          type: "primary",
          size: "small",
          onClick: jt
        }, {
          default: i(() => [l(rt(re), {
            size: 13,
            style: {
              "margin-right": "3px"
            }
          }), e[12] ||= k(" 新建任务 ", -1)]),
          _: 1
        })]),
        _: 1
      })]), a("div", Le, [l(W, {
        columns: Nt,
        "data-source": V.value,
        loading: B.value,
        "row-key": "id",
        size: "small",
        scroll: {
          x: 980
        },
        pagination: {
          pageSize: 12
        },
        "row-selection": Wt.value
      }, {
        bodyCell: i(({
          column: u,
          record: f
        }) => [u.key === "name" ? (m(), g("span", {
          key: 0,
          class: "cell-ellipsis",
          title: f.name
        }, p(f.name), 9, De)) : u.key === "accounts" ? (m(), g("span", Ue, p(ft(f)), 1)) : u.key === "stats" ? (m(), g("span", Ne, p(qt(f.stats)), 1)) : u.key === "time" ? (m(), g(q, {
          key: 3
        }, [k(p(R(f.updatedAt || f.createdAt)), 1)], 64)) : u.key === "status" ? (m(), N(K, {
          key: 4,
          color: kt(f.status),
          class: "mini-tag"
        }, {
          default: i(() => [k(p(vt(f.status)), 1)]),
          _: 2
        }, 1032, ["color"])) : u.key === "actions" ? (m(), g("div", Oe, [l(n, {
          type: "link",
          size: "small",
          onClick: I => Jt(f)
        }, {
          default: i(() => [...(e[14] ||= [k("详情", -1)])]),
          _: 1
        }, 8, ["onClick"]), l(n, {
          type: "link",
          size: "small",
          onClick: I => Zt(f)
        }, {
          default: i(() => [...(e[15] ||= [k("历史", -1)])]),
          _: 1
        }, 8, ["onClick"]), l(n, {
          type: "link",
          size: "small",
          onClick: I => Xt(f)
        }, {
          default: i(() => [e[16] ||= k(" 日志", -1), wt(f.id) ? (m(), g("span", We, "(" + p(wt(f.id)) + ")", 1)) : z("", true)]),
          _: 2
        }, 1032, ["onClick"]), lt(f) ? (m(), N(n, {
          key: 0,
          type: "link",
          size: "small",
          loading: at.value === f.id,
          onClick: I => ne(f)
        }, {
          default: i(() => [k(p(Y.value === f.id ? "收起画面" : "监控"), 1)]),
          _: 2
        }, 1032, ["loading", "onClick"])) : z("", true), lt(f) ? (m(), N(n, {
          key: 1,
          type: "link",
          size: "small",
          danger: "",
          loading: st.value === f.id,
          onClick: I => te(f)
        }, {
          default: i(() => [...(e[17] ||= [k(" 停止 ", -1)])]),
          _: 1
        }, 8, ["loading", "onClick"])) : (m(), g(q, {
          key: 2
        }, [l(n, {
          type: "link",
          size: "small",
          onClick: I => Kt(f)
        }, {
          default: i(() => [...(e[18] ||= [k("编辑", -1)])]),
          _: 1
        }, 8, ["onClick"]), l(n, {
          type: "link",
          size: "small",
          loading: j.value === f.id,
          onClick: I => Yt(f)
        }, {
          default: i(() => [...(e[19] ||= [k(" 启动 ", -1)])]),
          _: 1
        }, 8, ["loading", "onClick"]), l(n, {
          type: "link",
          size: "small",
          danger: "",
          loading: nt.value === f.id,
          onClick: I => ee(f)
        }, {
          default: i(() => [...(e[20] ||= [k(" 删除 ", -1)])]),
          _: 1
        }, 8, ["loading", "onClick"])], 64))])) : z("", true)]),
        _: 1
      }, 8, ["data-source", "loading", "row-selection"])]), l(Ct, {
        open: w.value,
        "onUpdate:open": e[2] ||= u => w.value = u,
        title: "新建作品发布",
        "confirm-loading": L.value,
        width: "720px",
        "destroy-on-close": ""
      }, {
        footer: i(() => [l(n, {
          onClick: e[0] ||= u => w.value = false
        }, {
          default: i(() => [...(e[21] ||= [k("取消", -1)])]),
          _: 1
        }), l(n, {
          loading: L.value,
          onClick: Qt
        }, {
          default: i(() => [...(e[22] ||= [k("仅保存", -1)])]),
          _: 1
        }, 8, ["loading"]), l(n, {
          type: "primary",
          loading: L.value,
          onClick: Gt
        }, {
          default: i(() => [...(e[23] ||= [k("保存并启动", -1)])]),
          _: 1
        }, 8, ["loading"])]),
        default: i(() => [a("div", qe, [e[24] ||= a("label", null, "任务名称", -1), l(ot, {
          value: M.name,
          "onUpdate:value": e[1] ||= u => M.name = u,
          placeholder: "任务名称",
          size: "small"
        }, null, 8, ["value"])]), l(zt, {
          model: M,
          accounts: rt(A).accounts,
          "quota-text": dt.value,
          generating: d.value,
          onPickMedia: Bt,
          onGenerate: Ft,
          onPairOnly: Vt
        }, null, 8, ["model", "accounts", "quota-text", "generating"])]),
        _: 1
      }, 8, ["open", "confirm-loading"]), l(Ct, {
        open: G.value,
        "onUpdate:open": e[6] ||= u => G.value = u,
        title: "编辑发布任务",
        "ok-text": "保存",
        "confirm-loading": X.value,
        width: "720px",
        "destroy-on-close": "",
        onOk: Ht
      }, {
        default: i(() => [P.value ? (m(), N(zt, {
          key: 0,
          model: P.value,
          accounts: rt(A).accounts,
          "quota-text": dt.value,
          generating: d.value,
          onPickMedia: e[3] ||= () => ht(P.value),
          onGenerate: e[4] ||= () => At(P.value),
          onPairOnly: e[5] ||= () => $t(P.value)
        }, null, 8, ["model", "accounts", "quota-text", "generating"])) : z("", true)]),
        _: 1
      }, 8, ["open", "confirm-loading"]), l(ut, {
        open: H.value,
        "onUpdate:open": e[7] ||= u => H.value = u,
        title: x.value ? `任务详情 · ${x.value.name}` : "任务详情",
        width: "860",
        "destroy-on-close": "",
        onAfterOpenChange: Rt
      }, {
        default: i(() => {
          var u;
          var f;
          var I;
          var xt;
          return [x.value ? (m(), g(q, {
            key: 0
          }, [a("div", Ee, [a("div", Be, [e[25] ||= a("span", null, "总计", -1), a("b", null, p(((u = x.value.stats) == null ? undefined : u.total) || 0), 1)]), a("div", Ve, [e[26] ||= a("span", null, "就绪", -1), a("b", null, p(((f = x.value.stats) == null ? undefined : f.ready) || 0), 1)]), a("div", Fe, [e[27] ||= a("span", null, "已发布", -1), a("b", null, p(((I = x.value.stats) == null ? undefined : I.published) || 0), 1)]), a("div", je, [e[28] ||= a("span", null, "失败", -1), a("b", null, p(((xt = x.value.stats) == null ? undefined : xt.failed) || 0), 1)])]), a("div", Qe, [l(K, {
            color: kt(x.value.status)
          }, {
            default: i(() => [k(p(vt(x.value.status)), 1)]),
            _: 1
          }, 8, ["color"]), a("span", null, p(ft(x.value)), 1)]), l(W, {
            "data-source": x.value.items || [],
            columns: Ot,
            size: "small",
            "row-key": "id",
            pagination: {
              pageSize: 12,
              size: "small"
            }
          }, {
            bodyCell: i(({
              column: tt,
              record: Z
            }) => {
              var Tt;
              return [tt.key === "media" ? (m(), g(q, {
                key: 0
              }, [k(p(((Tt = Z.media) == null ? undefined : Tt.fileName) || "-"), 1)], 64)) : tt.key === "status" ? (m(), N(K, {
                key: 1,
                color: gt(Z.status)
              }, {
                default: i(() => [k(p(yt(Z.status)), 1)]),
                _: 2
              }, 1032, ["color"])) : tt.key === "error" ? (m(), g("span", Ge, p(Z.error || "—"), 1)) : tt.key === "publishedAt" ? (m(), g(q, {
                key: 3
              }, [k(p(Z.publishedAt ? R(Z.publishedAt) : "—"), 1)], 64)) : z("", true)];
            }),
            _: 1
          }, 8, ["data-source"])], 64)) : z("", true)];
        }),
        _: 1
      }, 8, ["open", "title"]), l(ut, {
        open: J.value,
        "onUpdate:open": e[8] ||= u => J.value = u,
        title: F.value ? `发布历史 · ${F.value.name}` : "发布历史",
        width: "760",
        "destroy-on-close": ""
      }, {
        default: i(() => [ct.value.length ? (m(), N(le, {
          key: 1
        }, {
          default: i(() => [(m(true), g(q, null, et(ct.value, u => {
            m();
            return N(ae, {
              key: u.id,
              color: u.status === "published" ? "green" : "red"
            }, {
              default: i(() => {
                var f;
                var I;
                return [a("div", Ke, [a("div", He, [l(K, {
                  color: gt(u.status)
                }, {
                  default: i(() => [k(p(yt(u.status)), 1)]),
                  _: 2
                }, 1032, ["color"]), a("strong", null, p(u.accountName || u.accountId), 1), a("span", Je, p((f = u.media) == null ? undefined : f.fileName), 1)]), a("div", Re, p(u.title), 1), u.error ? (m(), g("div", Ze, p(u.error), 1)) : z("", true), a("div", Xe, p(u.publishedAt ? R(u.publishedAt) : R((I = F.value) == null ? undefined : I.updatedAt)), 1)])];
              }),
              _: 2
            }, 1032, ["color"]);
          }), 128))]),
          _: 1
        })) : (m(), N(_t, {
          key: 0,
          description: "暂无已发布 / 失败记录"
        }))]),
        _: 1
      }, 8, ["open", "title"]), l(ut, {
        open: v.value,
        "onUpdate:open": e[9] ||= u => v.value = u,
        title: O.value ? `运行日志 · ${O.value.name}` : "运行日志",
        width: "560",
        "destroy-on-close": ""
      }, {
        default: i(() => [mt.value.length ? (m(), g("div", Ye, [(m(true), g(q, null, et(mt.value, (u, f) => {
          m();
          return g("div", {
            key: f,
            class: ue(["log-row", u.level])
          }, [a("span", ts, p(R(u.ts)), 1), a("span", null, p(u.message), 1)], 2);
        }), 128))])) : (m(), N(_t, {
          key: 0,
          description: "暂无日志"
        }))]),
        _: 1
      }, 8, ["open", "title"])]);
    };
  }
};
const as = Ut(es, [["__scopeId", "data-v-f4163d56"]]);
export { as as default };
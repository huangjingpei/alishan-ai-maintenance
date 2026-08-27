import { cx as X, cz as ee, cy as te, y as J, ak as M, S as ne, M as se, cD as V, cE as u, cF as d, cH as n, cK as l, i as c, cM as C, aZ as p, aO as ae, cI as re, cJ as H, bF as I, cG as L, d3 as ie, cL as oe, d7 as P, o as b, A, d6 as le, cC as ue } from "./index-BegIKaMc.js";
import { g as de } from "./browserViewHostBounds-B-s7AYXG.js";
import { S as ce } from "./search-Chj8VGZL.js";
import { R as ve } from "./refresh-cw-j-kbTEHY.js";
import { L as ge } from "./loader-circle-T39qj1Kc.js";
import { C as fe } from "./circle-alert-C12Au9dh.js";
const me = {
  class: "creator-aggregate"
};
const pe = {
  class: "account-panel"
};
const _e = {
  class: "panel-heading"
};
const ye = {
  key: 0,
  class: "account-list"
};
const we = ["onClick"];
const he = {
  class: "account-avatar"
};
const ke = {
  class: "account-main"
};
const Se = ["title"];
const Ce = ["title"];
const be = {
  key: 0
};
const Ae = {
  key: 1,
  class: "account-empty"
};
const xe = {
  class: "creator-panel"
};
const ze = {
  class: "creator-heading"
};
const Ie = {
  class: "creator-title"
};
const Le = {
  key: 0
};
const Re = {
  key: 1
};
const Te = {
  class: "creator-actions"
};
const Be = {
  key: 0,
  class: "creator-placeholder"
};
const $e = {
  key: 1,
  class: "creator-placeholder loading"
};
const Ee = {
  key: 2,
  class: "creator-placeholder error"
};
const N = "creator_aggregate_account_id";
const Ke = {
  __name: "CreatorAggregate",
  setup(Me) {
    const v = ee();
    const {
      invoke: U,
      on: R,
      send: k
    } = te();
    const T = A("");
    const g = A("");
    const x = A(null);
    const r = A("idle");
    const f = A("");
    let _ = null;
    let B = "";
    let $ = 0;
    let z = false;
    const m = b(() => v.accounts.filter(e => e.platform === "douyin"));
    const E = b(() => {
      const e = T.value.trim().toLowerCase();
      if (e) {
        return m.value.filter(t => String(t.name || "").toLowerCase().includes(e) || String(t.nickname || "").toLowerCase().includes(e) || String(t.douyinId || "").toLowerCase().includes(e) || String(t.id || "").toLowerCase().includes(e));
      } else {
        return m.value;
      }
    });
    const i = b(() => m.value.find(e => String(e.id) === String(g.value)) || null);
    const y = b(() => i.value ? `douyin_${i.value.id}` : "");
    const W = b(() => r.value === "loading" ? "加载中" : r.value === "ready" ? "已连接" : r.value === "error" ? "加载失败" : "未打开");
    function Y(e) {
      return String((e == null ? undefined : e.nickname) || (e == null ? undefined : e.name) || (e == null ? undefined : e.id) || "抖").trim().slice(0, 1).toUpperCase();
    }
    function D(e) {
      if (e != null && e.douyinId) {
        return `抖音号：${e.douyinId}`;
      } else {
        return `账号ID：${(e == null ? undefined : e.id) || "-"}`;
      }
    }
    function S(e, t) {
      if (!e || !t) {
        return false;
      } else {
        return String(e.accountId || e.id || "") === String(t.id) && (!e.platform || e.platform === "douyin");
      }
    }
    function Z(e) {
      const t = `douyin_${e.id}`;
      return v.runningTasks.some(s => S(s, e)) || v.nurtureRunningTasks.some(s => S(s, e)) || v.monitorRunningTasks.some(s => S(s, e)) || v.selfWarmupRunningTasks.some(s => S(s, e)) || v.entityLeadgenRunningTasks.some(s => S(s, e)) || !!v.batchRunningStates.get(t);
    }
    function O() {
      return de(x.value);
    }
    function w({
      force: e = false
    } = {}) {
      const t = O();
      if (!t || !y.value) {
        return t;
      }
      const s = `${t.x}:${t.y}:${t.width}:${t.height}`;
      if (!!e || s !== B) {
        B = s;
        k("update-creator-view-bounds", {
          viewKey: y.value,
          bounds: t
        });
      }
      return t;
    }
    async function h() {
      const e = i.value;
      if (!e || z) {
        return;
      }
      const t = ++$;
      await M();
      const s = O();
      if (!s) {
        return;
      }
      r.value = "loading";
      f.value = "";
      localStorage.setItem(N, String(e.id));
      const a = await U("open-creator-view", {
        accountId: e.id,
        name: e.name,
        proxy: le(e.proxy),
        theme: document.documentElement.getAttribute("data-theme") || "dark",
        bounds: s
      }).catch(K => ({
        success: false,
        message: K.message || "打开创作窗口失败"
      }));
      if (!z && t === $ && (a == null || !a.superseded) && (a == null || !a.success)) {
        r.value = "error";
        f.value = (a == null ? undefined : a.message) || "打开创作窗口失败";
      }
    }
    async function j(e) {
      if (e) {
        if (String(e.id) === String(g.value)) {
          if (r.value === "idle") {
            await h();
            return;
          }
          if (r.value === "error") {
            await F();
            return;
          }
          w({
            force: true
          });
          return;
        }
        g.value = String(e.id);
        B = "";
        await h();
      }
    }
    async function F() {
      if (!y.value) {
        return;
      }
      r.value = "loading";
      f.value = "";
      const e = await U("reload-creator-view", {
        viewKey: y.value
      }).catch(t => ({
        success: false,
        message: t.message || "刷新失败"
      }));
      if (e == null || !e.success) {
        r.value = "error";
        f.value = (e == null ? undefined : e.message) || "刷新失败";
        ue.error(f.value);
      }
    }
    function Q() {
      v.activeKey = "accounts";
    }
    J(() => v.isModalOpen, e => {
      k("set-creator-view-attached", {
        attached: !e
      });
      if (!e) {
        M(() => w({
          force: true
        }));
      }
    });
    R("creator-view-status", (e = {}) => {
      if (!!y.value && e.viewKey === y.value) {
        if (e.status === "closed") {
          r.value = "idle";
          return;
        }
        if (e.status) {
          r.value = e.status;
        }
        if (e.message) {
          f.value = e.message;
        }
        if (e.status === "ready") {
          f.value = "";
        }
      }
    });
    R("ui-zoom-changed", () => {
      M(() => w({
        force: true
      }));
    });
    R("creator-view-restore-requested", () => {
      if (!z && i.value) {
        h();
      }
    });
    J(m, async e => {
      if (!e.length) {
        g.value = "";
        r.value = "idle";
        k("destroy-creator-view", {
          reason: "no-account"
        });
        return;
      }
      if (!e.some(t => String(t.id) === String(g.value))) {
        const t = localStorage.getItem(N);
        const s = e.find(a => String(a.id) === t) || e.find(a => a.status === "online") || e[0];
        g.value = String(s.id);
        await h();
      }
    });
    ne(async () => {
      window.addEventListener("resize", w);
      if (typeof ResizeObserver !== "undefined" && x.value) {
        _ = new ResizeObserver(() => w());
        _.observe(x.value);
      }
      const e = m.value;
      if (e.length) {
        const t = localStorage.getItem(N);
        const s = e.find(a => String(a.id) === t) || e.find(a => a.status === "online") || e[0];
        g.value = String(s.id);
        await h();
      }
    });
    se(() => {
      z = true;
      $ += 1;
      if (_ != null) {
        _.disconnect();
      }
      _ = null;
      window.removeEventListener("resize", w);
      k("set-creator-view-attached", {
        attached: true
      });
      k("destroy-creator-view", {
        reason: "creator-aggregate-unmounted"
      });
    });
    return (e, t) => {
      var G;
      var q;
      const s = V("a-input");
      const a = V("a-button");
      const K = V("a-tooltip");
      u();
      return d("section", me, [n("aside", pe, [n("div", _e, [n("div", null, [t[1] ||= n("h3", null, "账号", -1), n("span", null, l(E.value.length) + " / " + l(m.value.length), 1)])]), c(s, {
        value: T.value,
        "onUpdate:value": t[0] ||= o => T.value = o,
        "allow-clear": "",
        placeholder: "搜索账号",
        class: "account-search"
      }, {
        prefix: C(() => [c(p(ce), {
          size: 15
        })]),
        _: 1
      }, 8, ["value"]), E.value.length ? (u(), d("div", ye, [(u(true), d(ae, null, re(E.value, o => {
        u();
        return d("button", {
          key: o.id,
          type: "button",
          class: H(["account-card", {
            active: g.value === o.id
          }]),
          onClick: Ve => j(o)
        }, [n("span", he, l(Y(o)), 1), n("span", ke, [n("strong", {
          title: o.nickname || "未获取抖音昵称"
        }, l(o.nickname || "未获取抖音昵称"), 9, Se), n("span", {
          class: "account-remark",
          title: o.name || "未设置备注名"
        }, " 备注：" + l(o.name || "未设置"), 9, Ce), n("small", null, l(D(o)), 1), n("span", {
          class: H(["account-status", o.status === "online" ? "online" : "offline"])
        }, [t[2] ||= n("i", null, null, -1), I(l(o.status === "online" ? "可用" : "未登录") + " ", 1), Z(o) ? (u(), d("em", be, "任务运行中")) : L("", true)], 2)])], 10, we);
      }), 128))])) : (u(), d("div", Ae, [c(p(ie), {
        size: 28
      }), n("p", null, l(m.value.length ? "没有匹配的账号" : "还没有抖音账号"), 1), m.value.length ? L("", true) : (u(), oe(a, {
        key: 0,
        type: "link",
        onClick: Q
      }, {
        default: C(() => [...(t[3] ||= [I("前往账号池", -1)])]),
        _: 1
      }))]))]), n("main", xe, [n("div", ze, [n("div", Ie, [c(p(P), {
        size: 18
      }), n("div", null, [n("strong", null, l(((G = i.value) == null ? undefined : G.nickname) || ((q = i.value) == null ? undefined : q.name) || "创作窗口"), 1), i.value ? (u(), d("span", Le, " 备注：" + l(i.value.name || "未设置") + " · " + l(D(i.value)), 1)) : (u(), d("span", Re, "请选择左侧账号"))])]), n("div", Te, [i.value ? (u(), d("span", {
        key: 0,
        class: H(["view-state", r.value])
      }, [t[4] ||= n("i", null, null, -1), I(l(W.value), 1)], 2)) : L("", true), c(K, {
        title: "刷新创作页面"
      }, {
        default: C(() => [c(a, {
          type: "text",
          disabled: !i.value,
          loading: r.value === "loading",
          onClick: F
        }, {
          icon: C(() => [c(p(ve), {
            size: 16
          })]),
          _: 1
        }, 8, ["disabled", "loading"])]),
        _: 1
      })])]), n("div", {
        ref_key: "creatorHostRef",
        ref: x,
        class: "creator-host"
      }, [i.value ? r.value === "loading" ? (u(), d("div", $e, [c(p(ge), {
        size: 34,
        class: "spin"
      }), n("h3", null, "正在打开 " + l(i.value.nickname || i.value.name || "账号") + " 的创作页", 1), t[7] ||= n("p", null, "登录状态与账号池保持一致", -1)])) : r.value === "error" ? (u(), d("div", Ee, [c(p(fe), {
        size: 38
      }), t[9] ||= n("h3", null, "创作页面加载失败", -1), n("p", null, l(f.value || "请检查网络或账号登录状态后刷新"), 1), c(a, {
        type: "primary",
        ghost: "",
        onClick: h
      }, {
        default: C(() => [...(t[8] ||= [I("重新加载", -1)])]),
        _: 1
      })])) : L("", true) : (u(), d("div", Be, [c(p(P), {
        size: 44
      }), t[5] ||= n("h3", null, "选择账号进入创作中心", -1), t[6] ||= n("p", null, "右侧打开该账号的抖音创作者上传页，登录状态与账号池保持一致", -1)]))], 512)])]);
    };
  }
};
const Ge = X(Ke, [["__scopeId", "data-v-0ef129fe"]]);
export { Ge as default };
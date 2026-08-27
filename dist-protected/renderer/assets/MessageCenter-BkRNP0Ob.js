import { cw as ye, cx as Ae, cz as $e, cy as De, y as pe, ak as ee, cC as p, S as Le, M as We, cD as w, cE as r, cF as c, cH as s, cK as u, i, aZ as m, cG as y, cM as f, aO as he, cI as Fe, cJ as F, bF as g, d3 as He, cL as te, d4 as ke, A as h, o as T, d6 as Ke, x as be } from "./index-BegIKaMc.js";
import { g as Oe } from "./browserViewHostBounds-B-s7AYXG.js";
import { S as qe } from "./search-Chj8VGZL.js";
import { B as Ee } from "./bell-CZ8ykcq_.js";
import { R as Ve } from "./refresh-cw-j-kbTEHY.js";
import { L as je } from "./loader-circle-T39qj1Kc.js";
import { C as Je } from "./circle-alert-C12Au9dh.js"; /**
                                                      * @license lucide-vue-next v0.395.0 - ISC
                                                      *
                                                      * This source code is licensed under the ISC license.
                                                      * See the LICENSE file in the root directory of this source tree.
                                                      */
const we = ye("BellRingIcon", [["path", {
  d: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9",
  key: "1qo2s2"
}], ["path", {
  d: "M10.3 21a1.94 1.94 0 0 0 3.4 0",
  key: "qgo35s"
}], ["path", {
  d: "M4 2C2.8 3.7 2 5.7 2 8",
  key: "tap9e0"
}], ["path", {
  d: "M22 8c0-2.3-.8-4.3-2-6",
  key: "5bb3ad"
}]]); /**
      * @license lucide-vue-next v0.395.0 - ISC
      *
      * This source code is licensed under the ISC license.
      * See the LICENSE file in the root directory of this source tree.
      */
const Ge = ye("WebhookIcon", [["path", {
  d: "M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2",
  key: "q3hayz"
}], ["path", {
  d: "m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06",
  key: "1go1hn"
}], ["path", {
  d: "m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8",
  key: "qlwsc0"
}]]);
const Pe = {
  class: "message-center"
};
const Ze = {
  class: "account-panel"
};
const Qe = {
  class: "panel-heading"
};
const Xe = {
  key: 0,
  class: "account-list"
};
const Ye = ["onClick"];
const et = {
  class: "account-avatar"
};
const tt = {
  class: "account-main"
};
const nt = ["title"];
const st = ["title"];
const at = {
  key: 0
};
const ot = {
  key: 0,
  class: "account-last-message"
};
const it = {
  key: 0,
  class: "account-unread-badge"
};
const lt = {
  key: 1,
  class: "account-empty"
};
const rt = {
  class: "chat-panel"
};
const ut = {
  class: "chat-heading"
};
const ct = {
  class: "chat-title"
};
const dt = {
  key: 0
};
const ft = {
  key: 1
};
const vt = {
  class: "chat-actions"
};
const gt = {
  class: "notification-state enabled",
  title: "打开本页即监听全部可用账号的进线私信"
};
const mt = {
  key: 0,
  class: "chat-placeholder"
};
const pt = {
  key: 1,
  class: "chat-placeholder loading"
};
const ht = {
  key: 2,
  class: "chat-placeholder error"
};
const kt = {
  class: "notification-settings"
};
const bt = {
  class: "setting-row"
};
const wt = {
  class: "setting-row"
};
const yt = {
  key: 0,
  class: "setting-row"
};
const _t = {
  class: "setting-actions"
};
const St = {
  key: 1,
  class: "setting-hint"
};
const Ct = {
  __name: "MessageCenter",
  setup(Ut) {
    const k = $e();
    const {
      invoke: _,
      on: N,
      send: A
    } = De();
    const G = h("");
    const S = h("");
    const H = h(null);
    const d = h("idle");
    const C = h("");
    const U = h(false);
    const K = h(false);
    const P = h(false);
    const x = h(null);
    const O = h({
      totalUnread: 0,
      accounts: {},
      monitor: {}
    });
    const q = {
      enabled: false,
      webhookType: "feishu",
      webhookUrlFeishu: "",
      webhookUrlDingtalk: "",
      webhookSecretDingtalk: ""
    };
    const $ = be({
      ...q
    });
    const o = be({
      ...q
    });
    let M = null;
    let Z = "";
    let Q = 0;
    let E = false;
    const b = T(() => k.accounts.filter(e => e.platform === "douyin"));
    const V = T(() => {
      const e = G.value.trim().toLowerCase();
      if (e) {
        return b.value.filter(t => String(t.name || "").toLowerCase().includes(e) || String(t.nickname || "").toLowerCase().includes(e) || String(t.douyinId || "").toLowerCase().includes(e) || String(t.id || "").toLowerCase().includes(e));
      } else {
        return b.value;
      }
    });
    const v = T(() => b.value.find(e => String(e.id) === String(S.value)) || null);
    const z = T(() => v.value ? `douyin_${v.value.id}` : "");
    const ne = T(() => {
      var e;
      return Math.max(0, Number(((e = O.value) == null ? undefined : e.totalUnread) || 0));
    });
    const _e = T(() => d.value === "loading" ? "加载中" : d.value === "ready" ? "已连接" : d.value === "error" ? "加载失败" : "未打开");
    const se = T(() => {
      var t;
      var n;
      const e = Number((n = (t = O.value) == null ? undefined : t.monitor) == null ? undefined : n.keepaliveMaxAccounts);
      if (Number.isFinite(e) && e > 0) {
        return Math.floor(e);
      } else {
        return 10;
      }
    });
    function Se(e) {
      return String((e == null ? undefined : e.nickname) || (e == null ? undefined : e.name) || (e == null ? undefined : e.id) || "抖").trim().slice(0, 1).toUpperCase();
    }
    function ae(e) {
      if (e != null && e.douyinId) {
        return `抖音号：${e.douyinId}`;
      } else {
        return `账号ID：${(e == null ? undefined : e.id) || "-"}`;
      }
    }
    function j(e) {
      var t;
      var n;
      return ((n = (t = O.value) == null ? undefined : t.accounts) == null ? undefined : n[String((e == null ? undefined : e.id) || "")]) || null;
    }
    function R(e) {
      var t;
      return Math.max(0, Number(((t = j(e)) == null ? undefined : t.unreadCount) || 0));
    }
    async function Ce() {
      const e = V.value.find(t => R(t) > 0) || b.value.find(t => R(t) > 0);
      if (!e) {
        p.info("当前没有未读消息");
        return;
      }
      await de(e);
    }
    function J(e = {}) {
      O.value = {
        totalUnread: Math.max(0, Number(e.totalUnread || 0)),
        accounts: e.accounts && typeof e.accounts == "object" ? e.accounts : {},
        monitor: e.monitor && typeof e.monitor == "object" ? e.monitor : {}
      };
    }
    function oe(e = {}) {
      Object.assign($, q, e || {});
    }
    function ie() {
      Object.assign(o, q, JSON.parse(JSON.stringify($)));
      o.enabled = true;
      x.value = null;
      U.value = true;
    }
    function le() {
      U.value = false;
    }
    function Ue(e) {
      if (e) {
        ie();
        return;
      }
      Te();
    }
    pe([U, () => k.isModalOpen], ([e, t]) => {
      const n = !!e || !!t;
      A("set-chat-view-attached", {
        attached: !n
      });
      if (!n) {
        ee(() => B({
          force: true
        }));
      }
    });
    function re() {
      if (o.webhookType === "none") {
        return "";
      } else {
        return String(o.webhookType === "dingtalk" ? o.webhookUrlDingtalk : o.webhookUrlFeishu).trim();
      }
    }
    async function ue(e, {
      successMessage: t
    } = {}) {
      K.value = true;
      try {
        const n = await _("save-chat-notification-config", {
          ...e
        });
        if (n != null && n.success) {
          oe(n.config);
          if (n.state) {
            J(n.state);
          }
          U.value = false;
          if (t) {
            p.success(t);
          }
          return true;
        } else {
          p.error((n == null ? undefined : n.message) || "保存提醒设置失败");
          return false;
        }
      } catch (n) {
        p.error(n.message || "保存提醒设置失败");
        return false;
      } finally {
        K.value = false;
      }
    }
    async function xe() {
      if (o.enabled && o.webhookType !== "none" && !re()) {
        p.warning("请填写 Webhook 地址，或将推送平台改为「不推送」");
        return;
      }
      await ue({
        ...o
      }, {
        successMessage: o.enabled ? o.webhookType === "none" ? "后台监听已启动（不推送）" : "后台提醒已启动" : "后台提醒已关闭"
      });
    }
    async function Te() {
      await ue({
        ...$,
        enabled: false
      }, {
        successMessage: "后台提醒已关闭"
      });
    }
    async function Ne() {
      if (o.webhookType === "none") {
        p.info("当前为「不推送」，无需测试");
        return;
      }
      if (!re()) {
        p.warning("请先填写 Webhook 地址");
        return;
      }
      P.value = true;
      x.value = null;
      try {
        const e = await _("test-chat-message-webhook", {
          ...o
        });
        x.value = e || {
          success: false,
          message: "未收到测试结果"
        };
      } catch (e) {
        x.value = {
          success: false,
          message: e.message || "测试推送失败"
        };
      } finally {
        P.value = false;
      }
    }
    function D(e, t) {
      if (!e || !t) {
        return false;
      } else {
        return String(e.accountId || e.id || "") === String(t.id) && (!e.platform || e.platform === "douyin");
      }
    }
    function Me(e) {
      const t = `douyin_${e.id}`;
      return k.runningTasks.some(n => D(n, e)) || k.nurtureRunningTasks.some(n => D(n, e)) || k.monitorRunningTasks.some(n => D(n, e)) || k.selfWarmupRunningTasks.some(n => D(n, e)) || k.entityLeadgenRunningTasks.some(n => D(n, e)) || !!k.batchRunningStates.get(t);
    }
    function ce() {
      return Oe(H.value);
    }
    function B({
      force: e = false
    } = {}) {
      const t = ce();
      if (!t || !z.value) {
        return t;
      }
      const n = `${t.x}:${t.y}:${t.width}:${t.height}`;
      if (!!e || n !== Z) {
        Z = n;
        A("update-chat-view-bounds", {
          viewKey: z.value,
          bounds: t
        });
      }
      return t;
    }
    async function I() {
      const e = v.value;
      if (!e || E) {
        return;
      }
      const t = ++Q;
      await ee();
      const n = ce();
      if (!n) {
        return;
      }
      d.value = "loading";
      C.value = "";
      localStorage.setItem("message_center_account_id", String(e.id));
      const l = await _("open-chat-view", {
        accountId: e.id,
        name: e.name,
        proxy: Ke(e.proxy),
        bounds: n
      }).catch(L => ({
        success: false,
        message: L.message || "打开消息窗口失败"
      }));
      if (!E && t === Q && (l == null || !l.superseded) && (l == null || !l.success)) {
        d.value = "error";
        C.value = (l == null ? undefined : l.message) || "打开消息窗口失败";
      }
    }
    async function de(e) {
      if (e) {
        if (String(e.id) === String(S.value)) {
          if (d.value === "idle") {
            await I();
            return;
          }
          if (d.value === "error") {
            await fe();
            return;
          }
          B({
            force: true
          });
          return;
        }
        S.value = String(e.id);
        Z = "";
        await I();
      }
    }
    async function fe() {
      if (!z.value) {
        return;
      }
      d.value = "loading";
      C.value = "";
      const e = await _("reload-chat-view", {
        viewKey: z.value
      }).catch(t => ({
        success: false,
        message: t.message || "刷新失败"
      }));
      if (e == null || !e.success) {
        d.value = "error";
        C.value = (e == null ? undefined : e.message) || "刷新失败";
        p.error(C.value);
      }
    }
    function ze() {
      k.activeKey = "accounts";
    }
    N("chat-view-status", (e = {}) => {
      if (!!z.value && e.viewKey === z.value) {
        if (e.status === "closed") {
          d.value = "idle";
          return;
        }
        if (e.status) {
          d.value = e.status;
        }
        if (e.message) {
          C.value = e.message;
        }
        if (e.status === "ready") {
          C.value = "";
        }
      }
    });
    N("ui-zoom-changed", () => {
      ee(() => B({
        force: true
      }));
    });
    N("chat-view-restore-requested", () => {
      if (!E && v.value) {
        I();
      }
    });
    N("chat-unread-state", J);
    N("chat-new-message", (e = {}) => {
      const t = e.receiverRemark || e.receiverNickname || "账号";
      const n = e.sender || "未知账号";
      p.info(`${t} 收到 ${n} 的新私信`);
    });
    N("chat-webhook-result", (e = {}) => {
      if (!e.success) {
        p.error(`新消息 Webhook 推送失败：${e.message || "未知错误"}`);
      }
    });
    pe(b, async e => {
      if (!e.length) {
        S.value = "";
        d.value = "idle";
        A("destroy-chat-view", {
          reason: "no-account"
        });
        return;
      }
      if (!e.some(t => String(t.id) === String(S.value))) {
        const t = localStorage.getItem("message_center_account_id");
        const n = e.find(l => String(l.id) === t) || e.find(l => l.status === "online") || e[0];
        S.value = String(n.id);
        await I();
      }
    });
    Le(async () => {
      const [e, t, n] = await Promise.all([_("get-chat-notification-config").catch(() => null), _("get-chat-unread-state").catch(() => null), _("set-message-center-session", {
        active: true
      }).catch(() => null)]);
      if (e) {
        oe(e);
      }
      if (n != null && n.state) {
        J(n.state);
      } else if (t) {
        J(t);
      }
      window.addEventListener("resize", B);
      if (typeof ResizeObserver !== "undefined" && H.value) {
        M = new ResizeObserver(() => B());
        M.observe(H.value);
      }
      const l = b.value;
      if (l.length) {
        const L = localStorage.getItem("message_center_account_id");
        const X = l.find(W => String(W.id) === L) || l.find(W => W.status === "online") || l[0];
        S.value = String(X.id);
        await I();
      }
    });
    We(() => {
      E = true;
      Q += 1;
      if (M != null) {
        M.disconnect();
      }
      M = null;
      window.removeEventListener("resize", B);
      U.value &&= false;
      A("set-chat-view-attached", {
        attached: true
      });
      _("set-message-center-session", {
        active: false
      }).catch(() => {});
      A("destroy-chat-view", {
        reason: "message-center-unmounted"
      });
    });
    return (e, t) => {
      var ve;
      var ge;
      const n = w("a-input");
      const l = w("a-button");
      const L = w("a-switch");
      const X = w("a-tooltip");
      const W = w("a-alert");
      const Y = w("a-radio-button");
      const Re = w("a-radio-group");
      const Be = w("a-input-password");
      const Ie = w("a-modal");
      r();
      return c("section", Pe, [s("aside", Ze, [s("div", Qe, [s("div", null, [t[7] ||= s("h3", null, "账号", -1), s("span", null, u(V.value.length) + " / " + u(b.value.length) + " · 未读 " + u(ne.value), 1)]), ne.value ? (r(), c("button", {
        key: 0,
        type: "button",
        class: "panel-unread-icon",
        title: "跳转到有未读的账号",
        onClick: Ce
      }, [i(m(we), {
        size: 17
      })])) : y("", true)]), i(n, {
        value: G.value,
        "onUpdate:value": t[0] ||= a => G.value = a,
        "allow-clear": "",
        placeholder: "搜索账号",
        class: "account-search"
      }, {
        prefix: f(() => [i(m(qe), {
          size: 15
        })]),
        _: 1
      }, 8, ["value"]), V.value.length ? (r(), c("div", Xe, [(r(true), c(he, null, Fe(V.value, a => {
        var me;
        r();
        return c("button", {
          key: a.id,
          type: "button",
          class: F(["account-card", {
            active: S.value === a.id,
            unread: R(a) > 0
          }]),
          onClick: xt => de(a)
        }, [s("span", et, u(Se(a)), 1), s("span", tt, [s("strong", {
          title: a.nickname || "未获取抖音昵称"
        }, u(a.nickname || "未获取抖音昵称"), 9, nt), s("span", {
          class: "account-remark",
          title: a.name || "未设置备注名"
        }, " 备注：" + u(a.name || "未设置"), 9, st), s("small", null, u(ae(a)), 1), s("span", {
          class: F(["account-status", a.status === "online" ? "online" : "offline"])
        }, [t[8] ||= s("i", null, null, -1), g(u(a.status === "online" ? "可用" : "未登录") + " ", 1), Me(a) ? (r(), c("em", at, "任务运行中")) : y("", true)], 2), (me = j(a)) != null && me.lastSender ? (r(), c("span", ot, u(j(a).lastSender) + "：" + u(j(a).lastContent || "新消息"), 1)) : y("", true)]), R(a) ? (r(), c("span", it, u(R(a) > 99 ? "99+" : R(a)), 1)) : y("", true)], 10, Ye);
      }), 128))])) : (r(), c("div", lt, [i(m(He), {
        size: 28
      }), s("p", null, u(b.value.length ? "没有匹配的账号" : "还没有抖音账号"), 1), b.value.length ? y("", true) : (r(), te(l, {
        key: 0,
        type: "link",
        onClick: ze
      }, {
        default: f(() => [...(t[9] ||= [g("前往账号池", -1)])]),
        _: 1
      }))]))]), s("main", rt, [s("div", ut, [s("div", ct, [i(m(ke), {
        size: 18
      }), s("div", null, [s("strong", null, u(((ve = v.value) == null ? undefined : ve.nickname) || ((ge = v.value) == null ? undefined : ge.name) || "消息窗口"), 1), v.value ? (r(), c("span", dt, " 备注：" + u(v.value.name || "未设置") + " · " + u(ae(v.value)), 1)) : (r(), c("span", ft, "请选择左侧账号"))])]), s("div", vt, [s("span", gt, [i(m(we), {
        size: 13
      }), t[10] ||= g("多账号监听中 ", -1)]), s("div", {
        class: F(["background-remind-control", {
          enabled: $.enabled
        }]),
        title: "打开开关可配置并启动后台提醒"
      }, [s("button", {
        type: "button",
        class: "remind-label",
        onClick: t[1] ||= a => ie()
      }, [i(m(Ee), {
        size: 13
      }), t[11] ||= g("后台提醒 ", -1)]), i(L, {
        size: "small",
        checked: $.enabled,
        onChange: Ue
      }, null, 8, ["checked"])], 2), v.value ? (r(), c("span", {
        key: 0,
        class: F(["view-state", d.value])
      }, [t[12] ||= s("i", null, null, -1), g(u(_e.value), 1)], 2)) : y("", true), i(X, {
        title: "刷新消息页面"
      }, {
        default: f(() => [i(l, {
          type: "text",
          disabled: !v.value,
          loading: d.value === "loading",
          onClick: fe
        }, {
          icon: f(() => [i(m(Ve), {
            size: 16
          })]),
          _: 1
        }, 8, ["disabled", "loading"])]),
        _: 1
      })])]), s("div", {
        ref_key: "chatHostRef",
        ref: H,
        class: "chat-host"
      }, [v.value ? d.value === "loading" ? (r(), c("div", pt, [i(m(je), {
        size: 34,
        class: "spin"
      }), s("h3", null, "正在打开 " + u(v.value.nickname || v.value.name || "账号") + " 的消息", 1), t[15] ||= s("p", null, "登录状态与账号池保持一致", -1)])) : d.value === "error" ? (r(), c("div", ht, [i(m(Je), {
        size: 38
      }), t[17] ||= s("h3", null, "消息页面加载失败", -1), s("p", null, u(C.value || "请检查网络或账号登录状态后刷新"), 1), i(l, {
        type: "primary",
        ghost: "",
        onClick: I
      }, {
        default: f(() => [...(t[16] ||= [g("重新加载", -1)])]),
        _: 1
      })])) : y("", true) : (r(), c("div", mt, [i(m(ke), {
        size: 44
      }), t[13] ||= s("h3", null, "选择账号查看消息", -1), t[14] ||= s("p", null, "右侧打开该账号的抖音消息页；同时会轮询全部可用账号的进线私信", -1)]))], 512)]), i(Ie, {
        open: U.value,
        "onUpdate:open": t[6] ||= a => U.value = a,
        title: "后台新消息提醒",
        width: "560px",
        "confirm-loading": K.value,
        "mask-closable": false,
        "destroy-on-close": "",
        onCancel: le
      }, {
        footer: f(() => [i(l, {
          onClick: le
        }, {
          default: f(() => [...(t[25] ||= [g("取消", -1)])]),
          _: 1
        }), i(l, {
          type: "primary",
          loading: K.value,
          onClick: xe
        }, {
          default: f(() => [...(t[26] ||= [g(" 保存并启动 ", -1)])]),
          _: 1
        }, 8, ["loading"])]),
        default: f(() => [s("div", kt, [i(W, {
          type: "info",
          "show-icon": "",
          message: "离开消息聚合也会继续监听",
          description: o.webhookType === "none" ? `仅后台监听：侧栏未读会更新，不推送到飞书/钉钉。每个在线监听账号约占用 1 个 Chromium 页面，上限 ${se.value}。首次开启只建立当前消息基线。` : `列表有变化即推送到飞书/钉钉。每个在线监听账号约占用 1 个 Chromium 页面，上限 ${se.value}。首次开启只建立当前消息基线，不会重复推送历史未读。`
        }, null, 8, ["description"]), s("div", bt, [t[21] ||= s("label", null, "推送平台", -1), i(Re, {
          value: o.webhookType,
          "onUpdate:value": t[2] ||= a => o.webhookType = a,
          "button-style": "solid"
        }, {
          default: f(() => [i(Y, {
            value: "none"
          }, {
            default: f(() => [...(t[18] ||= [g("不推送", -1)])]),
            _: 1
          }), i(Y, {
            value: "feishu"
          }, {
            default: f(() => [...(t[19] ||= [g("飞书", -1)])]),
            _: 1
          }), i(Y, {
            value: "dingtalk"
          }, {
            default: f(() => [...(t[20] ||= [g("钉钉", -1)])]),
            _: 1
          })]),
          _: 1
        }, 8, ["value"])]), o.webhookType !== "none" ? (r(), c(he, {
          key: 0
        }, [s("div", wt, [t[22] ||= s("label", null, "Webhook 地址", -1), o.webhookType === "feishu" ? (r(), te(n, {
          key: 0,
          value: o.webhookUrlFeishu,
          "onUpdate:value": t[3] ||= a => o.webhookUrlFeishu = a,
          placeholder: "https://open.feishu.cn/open-apis/bot/v2/hook/xxx"
        }, null, 8, ["value"])) : (r(), te(n, {
          key: 1,
          value: o.webhookUrlDingtalk,
          "onUpdate:value": t[4] ||= a => o.webhookUrlDingtalk = a,
          placeholder: "https://oapi.dingtalk.com/robot/send?access_token=xxx"
        }, null, 8, ["value"])), s("small", null, u(o.webhookType === "feishu" ? "飞书群 → 设置 → 机器人 → 添加自定义机器人" : "钉钉群 → 智能群助手 → 添加自定义机器人"), 1)]), o.webhookType === "dingtalk" ? (r(), c("div", yt, [t[23] ||= s("label", null, "钉钉加签密钥（可选）", -1), i(Be, {
          value: o.webhookSecretDingtalk,
          "onUpdate:value": t[5] ||= a => o.webhookSecretDingtalk = a,
          placeholder: "SEC...（机器人启用加签时填写）"
        }, null, 8, ["value"])])) : y("", true), s("div", _t, [i(l, {
          loading: P.value,
          onClick: Ne
        }, {
          icon: f(() => [i(m(Ge), {
            size: 15
          })]),
          default: f(() => [t[24] ||= g(" 测试推送 ", -1)]),
          _: 1
        }, 8, ["loading"]), x.value ? (r(), c("span", {
          key: 0,
          class: F(x.value.success ? "success" : "error")
        }, u(x.value.message), 3)) : y("", true)])], 64)) : (r(), c("p", St, "选择「不推送」后，离开本页仍会后台监听并更新未读角标，不会调用任何 Webhook。"))])]),
        _: 1
      }, 8, ["open", "confirm-loading"])]);
    };
  }
};
const At = Ae(Ct, [["__scopeId", "data-v-fbe3ef54"]]);
export { At as default };
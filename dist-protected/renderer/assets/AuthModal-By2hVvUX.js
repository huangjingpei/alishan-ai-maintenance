import { cw as ie, cx as ue, cy as re, y as ce, M as de, S as ve, cD as L, cE as r, cF as f, cH as e, i as c, aZ as l, dB as pe, cK as v, cO as U, cG as p, cJ as G, cM as w, bF as h, g8 as fe, g9 as he, ga as _e, gb as me, cL as K, gc as we, gd as ye, ge as Ce, A as d, o as k, cC as n } from "./index-BegIKaMc.js";
import { R as ge } from "./refresh-cw-j-kbTEHY.js";
import { C as j } from "./check-4b-UMdrY.js";
import { M as ke } from "./message-circle-BQOwYyei.js"; /**
                                                        * @license lucide-vue-next v0.395.0 - ISC
                                                        *
                                                        * This source code is licensed under the ISC license.
                                                        * See the LICENSE file in the root directory of this source tree.
                                                        */
const be = ie("ExternalLinkIcon", [["path", {
  d: "M15 3h6v6",
  key: "1q9fwt"
}], ["path", {
  d: "M10 14 21 3",
  key: "gplh6r"
}], ["path", {
  d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
  key: "a6xqqp"
}]]);
const Te = {
  class: "auth-modal-content"
};
const xe = {
  class: "status-left"
};
const Ae = {
  class: "icon-wrapper"
};
const Ie = {
  class: "status-info"
};
const Me = {
  class: "status-title"
};
const Ee = {
  class: "status-desc"
};
const Se = {
  key: 0,
  class: "status-right"
};
const ze = {
  class: "license-value"
};
const He = {
  class: "license-code"
};
const Pe = {
  class: "expire-label"
};
const De = {
  class: "expire-value"
};
const Re = {
  class: "auth-refresh-row"
};
const We = {
  class: "comparison-section"
};
const Le = {
  class: "version-table"
};
const Ne = {
  key: 0,
  class: "pro-price"
};
const Ve = {
  class: "activation-area"
};
const Be = {
  class: "activate-input-box"
};
const $e = {
  class: "input-label"
};
const Oe = {
  class: "input-tip"
};
const qe = {
  key: 0,
  class: "purchase-guide"
};
const Fe = {
  class: "guide-text"
};
const Qe = {
  class: "purchase-actions"
};
const Ue = {
  class: "wechat-modal-body"
};
const Ge = ["src"];
const Ke = {
  class: "wechat-id-value"
};
const je = {
  key: 2,
  class: "wechat-tip"
};
const Je = {
  __name: "AuthModal",
  emits: ["activated", "refreshed"],
  setup(Ze, {
    emit: J
  }) {
    const {
      invoke: E,
      on: N
    } = re();
    const V = J;
    const B = he;
    const Z = fe;
    const X = me;
    const $ = _e;
    const O = Ce;
    const D = ye;
    const q = we;
    const R = d(false);
    const _ = d(true);
    const b = d(false);
    const o = d(null);
    const S = d(0);
    const T = d("");
    const y = d("");
    const i = d("");
    const x = d(false);
    const A = d(false);
    const C = k(() => !_.value && !b.value ? "pro" : b.value ? "trial" : "free");
    const Y = k(() => C.value === "pro" ? T.value === "year" ? "专业版SVIP" : T.value === "month" ? "专业版VIP" : "专业授权版" : C.value === "trial" ? "试用体验版" : "未激活 / 授权已过期");
    const ee = k(() => C.value === "pro" ? "已开启全功能无限授权" : C.value === "trial" ? `全功能开放 (试用中)，剩余 AI 额度: ${S.value}` : "请激活专业版以解锁全部功能");
    const z = k(() => C.value === "pro");
    const H = k(() => o.value ? new Date(o.value) < new Date() : false);
    const te = k(() => {
      if (!o.value || H.value) {
        return false;
      }
      const a = new Date(o.value) - new Date();
      return a > 0 && a < 259200000;
    });
    const I = d("");
    let M = null;
    function F() {
      if (!o.value) {
        I.value = "";
        return;
      }
      const a = new Date(o.value) - new Date();
      if (a <= 0) {
        I.value = "已过期";
        return;
      }
      const t = Math.floor(a / 1000);
      const s = Math.floor(t / 86400);
      const u = Math.floor(t % 86400 / 3600);
      const P = Math.floor(t % 3600 / 60);
      const m = t % 60;
      const g = [];
      if (s > 0) {
        g.push(`${s}天`);
      }
      if (u > 0) {
        g.push(`${u}小时`);
      }
      if (P > 0) {
        g.push(`${P}分钟`);
      }
      if (m > 0) {
        g.push(`${m}秒`);
      }
      if (g.length === 0) {
        I.value = "已过期";
      } else {
        I.value = `剩余：${g.join("")}`;
      }
    }
    ce(o, () => {
      F();
      if (M) {
        clearInterval(M);
      }
      M = setInterval(F, 1000);
    }, {
      immediate: true
    });
    de(() => {
      if (M) {
        clearInterval(M);
      }
    });
    async function Q() {
      const a = await E("check-auth");
      if (a.success) {
        _.value = a.isFree;
        b.value = a.isTrial;
        o.value = a.expireTime;
        S.value = a.aiQuota || 0;
        T.value = a.planType || "";
        i.value = a.savedCode || "";
      }
    }
    async function se() {
      var a;
      var t;
      if (!A.value && !x.value) {
        A.value = true;
        try {
          const s = await E("refresh-auth");
          if (s != null && s.success) {
            W(s);
          }
          V("refreshed", s);
          if (s != null && s.offline) {
            n.warning("仍无法连接服务器，已使用本地授权缓存。请检查网络后再试。");
            return;
          }
          if (s != null && s.connected && (a = s == null ? undefined : s.runtimeConfig) != null && a.ready) {
            n.success("授权已刷新，运行配置已就绪");
            return;
          }
          if (s != null && s.connected && ((t = s == null ? undefined : s.runtimeConfig) == null || !t.ready)) {
            n.warning("授权已刷新，但运行配置尚未就绪，请检查网络后再试");
            return;
          }
          if (s != null && s.success) {
            n.info(s.msg || "授权状态已更新");
            return;
          }
          n.error((s == null ? undefined : s.msg) || "刷新授权失败");
        } catch {
          n.error("网络请求失败，请检查网络");
        } finally {
          A.value = false;
        }
      }
    }
    function ae(a) {
      if (a) {
        navigator.clipboard.writeText(a).then(() => {
          n.success("授权码已复制到剪贴板");
        });
      }
    }
    function le() {}
    function W(a) {
      if (!!a && !!a.success) {
        _.value = a.isFree === true;
        b.value = a.isTrial === true;
        o.value = a.expireTime || null;
        S.value = a.aiQuota ?? S.value;
        T.value = a.planType || "";
        i.value = a.savedCode || y.value || i.value;
      }
    }
    async function ne() {
      if (!y.value) {
        return n.warning("请输入授权码");
      }
      x.value = true;
      try {
        const a = await E("activate", y.value);
        if (a.success) {
          const t = z.value;
          W(a);
          if (!t && !_.value && !b.value) {
            n.success(T.value === "year" ? "激活成功！已升级为专业版 SVIP" : "激活成功！已升级为专业版 VIP");
          } else {
            n.success("续费成功！时长已叠加");
          }
          let s = a;
          try {
            const u = await E("check-auth");
            if (u != null && u.success) {
              s = u;
              W(u);
            }
          } catch {}
          y.value = "";
          V("activated", s);
        } else {
          n.error(a.msg || "激活失败");
        }
      } catch {
        n.error("网络请求失败，请检查网络");
      } finally {
        x.value = false;
      }
    }
    function oe() {}
    ve(() => {
      Q();
      if (N) {
        N("ai-quota-updated", () => {
          Q();
        });
      }
    });
    return (a, t) => {
      const s = L("a-button");
      const u = L("a-input-search");
      const P = L("a-modal");
      r();
      return f("div", Te, [e("div", {
        class: G(["current-status-banner", C.value])
      }, [e("div", xe, [e("div", Ae, [c(l(pe), {
        size: 24,
        "stroke-width": "2"
      })]), e("div", Ie, [e("div", Me, v(Y.value), 1), e("div", Ee, v(ee.value), 1)])]), i.value || o.value ? (r(), f("div", Se, [i.value ? (r(), f("div", {
        key: 0,
        class: "license-card",
        onClick: t[0] ||= m => ae(i.value),
        title: "点击复制授权码"
      }, [t[4] ||= e("span", {
        class: "license-label"
      }, "授权码", -1), e("span", ze, [e("span", He, v(i.value), 1), c(l(U), {
        size: 11
      })])])) : p("", true), o.value || i.value && _.value ? (r(), f("div", {
        key: 1,
        class: G(["expire-row", {
          "warning-text": te.value || H.value || i.value && _.value
        }])
      }, [e("span", Pe, v(H.value || i.value && _.value ? "状态" : "剩余"), 1), e("span", De, v(H.value || i.value && _.value ? "已过期" : I.value.replace("剩余：", "")), 1)], 2)) : p("", true)])) : p("", true)], 2), e("div", Re, [c(s, {
        size: "small",
        class: "auth-refresh-btn",
        loading: A.value,
        disabled: x.value,
        onClick: se
      }, {
        icon: w(() => [c(l(ge), {
          size: 14
        })]),
        default: w(() => [t[5] ||= h(" 刷新授权 ", -1)]),
        _: 1
      }, 8, ["loading", "disabled"])]), e("div", We, [t[16] ||= e("div", {
        class: "section-title"
      }, "版本权益对比", -1), e("table", Le, [e("thead", null, [e("tr", null, [t[8] ||= e("th", null, "核心权益", -1), t[9] ||= e("th", null, "试用版", -1), e("th", null, [t[7] ||= e("span", {
        class: "pro-title"
      }, "专业版", -1), l(Z) ? (r(), f("span", Ne, [...(t[6] ||= [h(" 年卡 ", -1), e("span", {
        class: "price-old"
      }, "2999", -1), h("→", -1), e("span", {
        class: "price-now"
      }, "599", -1), h(" · 月卡 ", -1), e("span", {
        class: "price-old"
      }, "599", -1), h("→", -1), e("span", {
        class: "price-now"
      }, "199", -1)])])) : p("", true)])])]), e("tbody", null, [t[13] ||= e("tr", null, [e("td", null, "线索分析 (AI)"), e("td", null, "500 次额度"), e("td", null, "无限制")], -1), t[14] ||= e("tr", null, [e("td", null, "平台登录账号"), e("td", null, "最多 2 个"), e("td", null, "最多 10 个")], -1), t[15] ||= e("tr", null, [e("td", null, "自动互动功能"), e("td", null, "全部开放"), e("td", null, "全部开放")], -1), e("tr", null, [t[12] ||= e("td", null, "多账号并行", -1), e("td", null, [c(l(j), {
        size: 14,
        color: "#10b981"
      }), t[10] ||= h(" 支持", -1)]), e("td", null, [c(l(j), {
        size: 14,
        color: "#10b981"
      }), t[11] ||= h(" 支持", -1)])])])])]), e("div", Ve, [e("div", Be, [e("div", $e, v(z.value ? "续费 / 叠加授权码" : "激活码兑换专业版"), 1), c(u, {
        value: y.value,
        "onUpdate:value": t[1] ||= m => y.value = m,
        placeholder: "请输入授权码",
        "enter-button": z.value ? "续费" : "激活",
        size: "middle",
        loading: x.value,
        disabled: A.value,
        onSearch: ne
      }, null, 8, ["value", "enter-button", "loading", "disabled"]), e("div", Oe, v(z.value ? "输入新授权码可直接在当前有效期基础上叠加时长" : "激活后将解锁全部专业功能并绑定当前设备"), 1), l(B) || l($) ? (r(), f("div", qe, [e("span", Fe, v(l(X)), 1), e("div", Qe, [l($) ? (r(), K(s, {
        key: 0,
        size: "small",
        class: "wechat-btn",
        onClick: t[2] ||= m => R.value = true
      }, {
        icon: w(() => [c(l(ke), {
          size: 14
        })]),
        default: w(() => [h(" " + v(l(q)), 1)]),
        _: 1
      })) : p("", true), l(B) ? (r(), K(s, {
        key: 1,
        type: "primary",
        size: "small",
        class: "buy-btn",
        onClick: oe
      }, {
        icon: w(() => [c(l(be), {
          size: 14
        })]),
        default: w(() => [t[17] ||= h(" 去购买 ", -1)]),
        _: 1
      })) : p("", true)])])) : p("", true)])]), c(P, {
        open: R.value,
        "onUpdate:open": t[3] ||= m => R.value = m,
        title: l(q),
        footer: null,
        width: "320px",
        "wrap-class-name": "premium-modal wechat-contact-modal",
        centered: ""
      }, {
        default: w(() => [e("div", Ue, [l(D) ? (r(), f("img", {
          key: 0,
          src: l(D),
          alt: "微信二维码",
          class: "wechat-qr"
        }, null, 8, Ge)) : p("", true), l(O) ? (r(), f("div", {
          key: 1,
          class: "wechat-id-row",
          onClick: le,
          title: "点击复制微信号"
        }, [t[18] ||= e("span", {
          class: "wechat-id-label"
        }, "微信号", -1), e("span", Ke, v(l(O)), 1), c(l(U), {
          size: 14
        })])) : p("", true), l(D) ? (r(), f("p", je, "扫码或复制微信号添加客服")) : p("", true)])]),
        _: 1
      }, 8, ["open", "title"])]);
    };
  }
};
const st = ue(Je, [["__scopeId", "data-v-bd7d7cae"]]);
export { st as default };
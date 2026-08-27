import { cw as ee, cx as ve, cy as ye, y as _e, cD as r, cE as p, cF as h, cH as o, i as n, aO as Q, cM as a, bF as f, cJ as xe, cK as x, cG as L, A as V, o as K, d6 as W, fY as B, fZ as ze, cz as Me, x as de, f_ as Z, S as Te, cC as U, f$ as T, z as Le, aZ as _, d3 as Oe, cL as J, cR as ce, cP as Ee, cI as pe, g0 as me, dB as Fe, dG as Ke, ak as Be, g1 as Ne } from "./index-BegIKaMc.js";
import { P as De } from "./plus-Cl_SEO9R.js";
import { U as Re } from "./user-plus-CF_3X2xg.js";
import { L as Ge } from "./loader-circle-T39qj1Kc.js"; /**
                                                       * @license lucide-vue-next v0.395.0 - ISC
                                                       *
                                                       * This source code is licensed under the ISC license.
                                                       * See the LICENSE file in the root directory of this source tree.
                                                       */
const Xe = ee("EllipsisVerticalIcon", [["circle", {
  cx: "12",
  cy: "12",
  r: "1",
  key: "41hilf"
}], ["circle", {
  cx: "12",
  cy: "5",
  r: "1",
  key: "gxeob9"
}], ["circle", {
  cx: "12",
  cy: "19",
  r: "1",
  key: "lyex9k"
}]]); /**
      * @license lucide-vue-next v0.395.0 - ISC
      *
      * This source code is licensed under the ISC license.
      * See the LICENSE file in the root directory of this source tree.
      */
const je = ee("GlobeIcon", [["circle", {
  cx: "12",
  cy: "12",
  r: "10",
  key: "1mglay"
}], ["path", {
  d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",
  key: "13o1zl"
}], ["path", {
  d: "M2 12h20",
  key: "9i4pu4"
}]]); /**
      * @license lucide-vue-next v0.395.0 - ISC
      *
      * This source code is licensed under the ISC license.
      * See the LICENSE file in the root directory of this source tree.
      */
const q = ee("VideoIcon", [["path", {
  d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",
  key: "ftymec"
}], ["rect", {
  x: "2",
  y: "6",
  width: "14",
  height: "12",
  rx: "2",
  key: "158x01"
}]]);
const Ye = {
  class: "account-proxy-fields"
};
const He = {
  class: "proxy-head"
};
const Ze = {
  class: "proxy-row"
};
const Je = {
  class: "proxy-row"
};
const qe = {
  class: "proxy-test-row"
};
const Qe = {
  __name: "AccountProxyFields",
  props: {
    modelValue: {
      type: [Object, String],
      default: () => ({})
    }
  },
  emits: ["update:modelValue"],
  setup(te, {
    emit: d
  }) {
    const P = te;
    const N = d;
    const {
      invoke: D
    } = ye();
    const w = V(false);
    const m = V("");
    const b = V(false);
    const c = K(() => W(P.modelValue));
    const C = K(() => ze(c.value));
    function A(u) {
      N("update:modelValue", {
        ...B(c.value),
        ...u
      });
    }
    _e(() => P.modelValue, () => {
      m.value = "";
      b.value = false;
    }, {
      deep: true
    });
    async function j() {
      if (C.value) {
        w.value = true;
        m.value = "";
        b.value = false;
        try {
          const u = await D("test-account-proxy", B(c.value));
          b.value = u != null && !!u.success;
          m.value = (u == null ? undefined : u.message) || (u != null && u.success ? "连接成功" : "连接失败");
        } catch (u) {
          b.value = false;
          m.value = (u == null ? undefined : u.message) || "测试失败";
        } finally {
          w.value = false;
        }
      }
    }
    return (u, l) => {
      const Y = r("a-switch");
      const R = r("a-select-option");
      const O = r("a-select");
      const S = r("a-form-item");
      const I = r("a-input");
      const g = r("a-input-number");
      const E = r("a-input-password");
      const z = r("a-button");
      p();
      return h("div", Ye, [o("div", He, [l[6] ||= o("span", {
        class: "proxy-title"
      }, "网络代理", -1), n(Y, {
        checked: c.value.enabled,
        "checked-children": "开",
        "un-checked-children": "关",
        onChange: l[0] ||= i => A({
          enabled: i
        })
      }, null, 8, ["checked"])]), l[10] ||= o("p", {
        class: "proxy-hint"
      }, "开启后，该账号的登录、获客、养号等自动化流量均走此代理；关闭或清空即恢复直连。测试连接会优先访问目标官网。SOCKS5 若填写了账号密码，软件会自动经本地桥接（Chromium 本身不支持 SOCKS5 认证）。", -1), c.value.enabled ? (p(), h(Q, {
        key: 0
      }, [n(S, {
        label: "代理类型",
        class: "compact-item"
      }, {
        default: a(() => [n(O, {
          value: c.value.type,
          style: {
            width: "100%"
          },
          onChange: l[1] ||= i => A({
            type: i
          })
        }, {
          default: a(() => [n(R, {
            value: "http"
          }, {
            default: a(() => [...(l[7] ||= [f("HTTP", -1)])]),
            _: 1
          }), n(R, {
            value: "socks5"
          }, {
            default: a(() => [...(l[8] ||= [f("SOCKS5", -1)])]),
            _: 1
          })]),
          _: 1
        }, 8, ["value"])]),
        _: 1
      }), o("div", Ze, [n(S, {
        label: "主机",
        class: "compact-item host-item"
      }, {
        default: a(() => [n(I, {
          value: c.value.host,
          placeholder: "例如 127.0.0.1 或 proxy.example.com",
          "onUpdate:value": l[2] ||= i => A({
            host: i
          })
        }, null, 8, ["value"])]),
        _: 1
      }), n(S, {
        label: "端口",
        class: "compact-item port-item"
      }, {
        default: a(() => [n(g, {
          value: c.value.port || undefined,
          min: 1,
          max: 65535,
          placeholder: "端口",
          style: {
            width: "100%"
          },
          "onUpdate:value": l[3] ||= i => A({
            port: i || ""
          })
        }, null, 8, ["value"])]),
        _: 1
      })]), o("div", Je, [n(S, {
        label: "用户名 (可选)",
        class: "compact-item host-item"
      }, {
        default: a(() => [n(I, {
          value: c.value.username,
          placeholder: "无认证可留空",
          autocomplete: "off",
          "onUpdate:value": l[4] ||= i => A({
            username: i
          })
        }, null, 8, ["value"])]),
        _: 1
      }), n(S, {
        label: "密码 (可选)",
        class: "compact-item port-item"
      }, {
        default: a(() => [n(E, {
          value: c.value.password,
          placeholder: "无认证可留空",
          autocomplete: "new-password",
          "onUpdate:value": l[5] ||= i => A({
            password: i
          })
        }, null, 8, ["value"])]),
        _: 1
      })]), o("div", qe, [n(z, {
        loading: w.value,
        disabled: !C.value,
        onClick: j
      }, {
        default: a(() => [...(l[9] ||= [f(" 测试连接 ", -1)])]),
        _: 1
      }, 8, ["loading", "disabled"]), m.value ? (p(), h("span", {
        key: 0,
        class: xe(["test-result", b.value ? "ok" : "err"])
      }, x(m.value), 3)) : L("", true)])], 64)) : L("", true)]);
    };
  }
};
const fe = ve(Qe, [["__scopeId", "data-v-8fae4e28"]]);
const We = {
  class: "account-manager"
};
const et = {
  class: "header"
};
const tt = {
  class: "header-info"
};
const nt = {
  class: "platform-filter"
};
const ot = {
  class: "count"
};
const st = {
  class: "ai-bind-banner"
};
const at = {
  class: "account-list"
};
const lt = {
  class: "acc-main"
};
const it = {
  class: "acc-avatar"
};
const ut = {
  class: "acc-info"
};
const rt = {
  class: "acc-name"
};
const dt = {
  key: 0,
  class: "remark"
};
const ct = {
  key: 1,
  class: "remark"
};
const pt = {
  key: 0,
  class: "acc-meta"
};
const mt = {
  class: "proxy-tag"
};
const ft = {
  class: "acc-persona"
};
const vt = {
  class: "acc-status"
};
const yt = {
  class: "acc-actions"
};
const _t = {
  key: 0,
  class: "empty-state"
};
const xt = {
  class: "login-modal-content"
};
const gt = {
  class: "loading-placeholder"
};
const kt = {
  class: "login-tips"
};
const ht = "当前未激活专业版，试用期间或升级专业版后可使用闲鱼功能";
const wt = {
  __name: "AccountManager",
  setup(te) {
    const d = Me();
    const {
      send: P,
      invoke: N,
      on: D
    } = ye();
    const w = d.accounts;
    const m = d.authInfo;
    const b = V(false);
    const c = V(false);
    const C = K(() => localStorage.getItem("current_platform") || "douyin");
    const A = K(() => w.filter(e => e.platform === C.value));
    const j = K(() => d.config.personas || []);
    const u = T;
    function l() {
      if (m.isFree) {
        return 1;
      } else if (m.isTrial) {
        return 2;
      } else {
        return T;
      }
    }
    function Y(e) {
      return w.filter(t => t.platform === e && t.status === "online").length;
    }
    function R(e) {
      return {
        douyin: q
      }[e] || q;
    }
    function O(e) {
      return {
        douyin: "DY"
      }[e] || e;
    }
    function S(e) {
      return {
        douyin: "https://www.douyin.com"
      }[e] || "https://www.douyin.com";
    }
    const I = V(false);
    const g = V(null);
    const E = V(null);
    let z = null;
    const i = de({
      platform: C.value,
      name: "",
      proxy: Z()
    });
    _e(C, e => {
      i.platform = e;
    });
    const v = de({
      id: "",
      name: "",
      platform: "",
      proxy: Z()
    });
    function ge(e) {
      return q;
    }
    function ke(e) {
      return {
        offline: "未登录",
        online: "已登录",
        error: "异常"
      }[e] || e;
    }
    function he(e) {
      var t;
      return ((t = d.config.accountPersonas) == null ? undefined : t[e]) || "none";
    }
    function we(e, t) {
      Ke(d.config, e, t);
    }
    function be() {
      d.activeKey = "ai-personas";
    }
    function Ce() {
      if (!i.name || !ne(i.platform)) {
        return;
      }
      const e = w.filter(y => y.platform === i.platform).length;
      const t = l();
      if (e >= t) {
        if (m.isFree || m.isTrial) {
          return U.error(`${m.type}每平台最多支持 ${t} 个账号，请升级专业版`);
        } else {
          return U.error(`每平台最多添加 ${T} 个账号`);
        }
      }
      d.addAccount({
        ...i,
        proxy: B(i.proxy)
      });
      b.value = false;
      i.name = "";
      i.proxy = Z();
    }
    function Ae(e) {
      v.id = e.id;
      v.name = e.name;
      v.platform = e.platform;
      v.proxy = B(e.proxy);
      c.value = true;
    }
    async function Ie() {
      if (!v.name) {
        return;
      }
      const e = w.find(t => t.id === v.id);
      if (e) {
        e.name = v.name;
        e.proxy = B(v.proxy);
        try {
          const t = await N("reapply-account-proxy", {
            platform: e.platform,
            accountId: e.id,
            proxy: W(e.proxy)
          });
          if (t != null && t.applied) {
            U.success("代理配置已保存并立即生效");
          } else {
            U.success("代理配置已保存");
          }
        } catch {
          U.success("代理配置已保存");
        }
      }
      c.value = false;
    }
    function Pe(e) {
      d.removeAccount(e);
    }
    function ne(e) {
      if (e === "xianyu") {
        return false;
      } else if (e === "xianyu" && !d.canUseXianyu) {
        U.warning(ht);
        return false;
      } else {
        return true;
      }
    }
    function $e(e) {
      if (!ne(e.platform)) {
        return;
      }
      if (e.status !== "online" && Y(e.platform) >= T) {
        return U.error(`每平台最多同时登录 ${T} 个账号，请先下线其他账号`);
      }
      g.value = e;
      I.value = true;
      if (e.status !== "online") {
        d.setStatus("loading", {
          id: e.id,
          platform: e.platform,
          name: e.name
        });
      }
      const t = `${e.platform}_${e.id}`;
      P("set-views-visible", true, [t]);
      Be(() => {
        G();
        P("init-automation-view", {
          platform: e.platform,
          accountId: e.id,
          name: e.name,
          proxy: W(e.proxy),
          url: S(e.platform)
        });
        let y = 0;
        z = setInterval(() => {
          G();
          if (++y > 20) {
            clearInterval(z);
          }
        }, 100);
        window.addEventListener("resize", G);
      });
    }
    function G() {
      if (!E.value || !I.value || !g.value) {
        return;
      }
      const e = E.value.getBoundingClientRect();
      if (e.width === 0) {
        return;
      }
      const t = `${g.value.platform}_${g.value.id}`;
      const y = Math.max(0.25, Math.min(1, e.width / 1280, e.height / 800));
      P("update-automation-bounds", {
        viewKey: t,
        bounds: {
          x: Math.round(e.x),
          y: Math.round(e.y),
          width: Math.round(e.width),
          height: Math.round(e.height)
        },
        zoomFactor: y
      });
    }
    function oe() {
      if (g.value) {
        const e = `${g.value.platform}_${g.value.id}`;
        P("update-automation-bounds", {
          viewKey: e,
          bounds: {
            x: 0,
            y: 0,
            width: 1,
            height: 1
          }
        });
      }
      I.value = false;
      setTimeout(() => {
        if (!I.value && d.activeKey !== "dashboard") {
          P("set-views-visible", false);
        }
      }, 500);
      if (d.status === "loading") {
        d.setStatus("idle");
      }
      if (z) {
        clearInterval(z);
      }
      window.removeEventListener("resize", G);
    }
    let M = null;
    async function Ue() {
      const e = w.filter(t => t.platform === "douyin").map(t => ({
        id: t.id,
        platform: t.platform,
        name: t.name,
        nickname: t.nickname,
        douyinId: t.douyinId,
        userUrl: t.userUrl,
        proxy: Ne(t.proxy),
        status: t.status
      }));
      if (e.length) {
        try {
          await N("sync-radar-douyin-accounts", {
            accounts: e
          });
        } catch (t) {
          console.warn("[Account] 同步抖音账号到后台失败:", t.message || t);
        }
      }
    }
    function se() {
      if (M) {
        clearTimeout(M);
      }
      M = setTimeout(() => {
        Ue();
      }, 800);
    }
    Te(() => {
      D("account-limit-rejected", e => {
        U.error((e == null ? undefined : e.reason) || `每平台最多同时登录 ${T} 个账号`);
      });
      D("account-updated", e => {
        const t = e.viewKey.split("_");
        const y = t[0];
        const X = t.slice(1).join("_");
        const k = w.find(F => F.id === X && F.platform === y);
        if (k) {
          if (e.nickname) {
            k.nickname = e.nickname;
          }
          if (e.douyinId) {
            k.douyinId = e.douyinId;
          }
          if (e.userUrl) {
            k.userUrl = e.userUrl;
          }
          if (e.status) {
            k.status = e.status;
          }
          console.log(`[Account] 账号已更新: ${k.name} (${k.nickname || "-"})${k.douyinId ? ` 抖音号:${k.douyinId}` : ""}`);
          se();
        }
      });
      se();
    });
    Le(() => {
      if (M) {
        clearTimeout(M);
        M = null;
      }
      oe();
    });
    return (e, t) => {
      var ue;
      var re;
      const y = r("a-button");
      const X = r("a-select-option");
      const k = r("a-select");
      const F = r("a-menu-item");
      const Ve = r("a-menu");
      const Se = r("a-dropdown");
      const ae = r("a-input");
      const le = r("a-form-item");
      const ie = r("a-form");
      const H = r("a-modal");
      p();
      return h("div", We, [o("div", et, [o("div", tt, [n(_(Oe), {
        size: 20
      }), t[8] ||= o("h3", null, "账号池管理", -1), o("span", nt, [(p(), J(ce(R(C.value)), {
        size: 16
      })), f(" " + x(O(C.value)), 1)]), o("span", ot, x(A.value.length) + " / " + x(_(u)), 1)]), n(y, {
        type: "primary",
        onClick: t[0] ||= s => b.value = true
      }, {
        icon: a(() => [n(_(De), {
          size: 16
        })]),
        default: a(() => [t[9] ||= f(" 添加账号 ", -1)]),
        _: 1
      })]), o("div", st, [n(_(Ee), {
        size: 16
      }), t[11] ||= o("div", {
        class: "banner-text"
      }, [o("strong", null, "在这里为每个账号绑定 AI 智能体"), o("span", null, "绑定了智能体的账号运行时会自动使用 AI；选「不使用智能体」则走本地话术。")], -1), n(y, {
        size: "small",
        type: "link",
        onClick: be
      }, {
        default: a(() => [...(t[10] ||= [f("管理智能体库", -1)])]),
        _: 1
      })]), o("div", at, [(p(true), h(Q, null, pe(A.value, s => {
        p();
        return h("div", {
          key: s.id,
          class: "account-item"
        }, [o("div", lt, [o("div", it, [(p(), J(ce(ge(s.platform)), {
          size: 20
        }))]), o("div", ut, [o("div", rt, [f(x(s.nickname || s.name) + " ", 1), s.nickname ? (p(), h("span", dt, "(" + x(s.name) + ")", 1)) : L("", true), s.douyinId ? (p(), h("span", ct, " · 抖音号 " + x(s.douyinId), 1)) : L("", true)]), _(me)(s.proxy) ? (p(), h("div", pt, [o("span", mt, [n(_(je), {
          size: 10
        }), f(" " + x(_(me)(s.proxy)), 1)])])) : L("", true)]), o("div", ft, [n(k, {
          value: he(s.id),
          size: "small",
          style: {
            width: "200px"
          },
          placeholder: "绑定智能体",
          disabled: _(m).isFree,
          "dropdown-match-select-width": false,
          onChange: $ => we(s.id, $)
        }, {
          default: a(() => [n(X, {
            value: "none"
          }, {
            default: a(() => [...(t[12] ||= [f("不使用智能体", -1)])]),
            _: 1
          }), (p(true), h(Q, null, pe(j.value, $ => {
            p();
            return J(X, {
              key: $.id,
              value: $.id
            }, {
              default: a(() => [f(x($.name), 1)]),
              _: 2
            }, 1032, ["value"]);
          }), 128))]),
          _: 1
        }, 8, ["value", "disabled", "onChange"])]), o("div", vt, [o("div", {
          class: xe(["status-dot", s.status])
        }, null, 2), o("span", null, x(ke(s.status)), 1)]), o("div", yt, [n(y, {
          type: "primary",
          ghost: "",
          size: "small",
          onClick: $ => $e(s)
        }, {
          default: a(() => [f(x(s.status === "online" ? "查看详情" : "登录账号"), 1)]),
          _: 2
        }, 1032, ["onClick"]), n(Se, null, {
          overlay: a(() => [n(Ve, null, {
            default: a(() => [n(F, {
              onClick: $ => Ae(s)
            }, {
              default: a(() => [...(t[13] ||= [f("编辑账号", -1)])]),
              _: 1
            }, 8, ["onClick"]), n(F, {
              onClick: $ => Pe(s.id),
              danger: ""
            }, {
              default: a(() => [...(t[14] ||= [f("删除账号", -1)])]),
              _: 1
            }, 8, ["onClick"])]),
            _: 2
          }, 1024)]),
          default: a(() => [n(y, {
            type: "text"
          }, {
            default: a(() => [n(_(Xe), {
              size: 16
            })]),
            _: 1
          })]),
          _: 2
        }, 1024)])])]);
      }), 128)), A.value.length === 0 ? (p(), h("div", _t, [n(_(Re), {
        size: 48
      }), t[15] ||= o("p", null, "当前平台还没有账号", -1), o("span", null, "点击右上角按钮添加 " + x(O(C.value)) + " 账号", 1)])) : L("", true)]), n(H, {
        open: b.value,
        "onUpdate:open": t[3] ||= s => b.value = s,
        title: `添加 ${O(C.value)} 账号`,
        onOk: Ce
      }, {
        default: a(() => [n(ie, {
          layout: "vertical"
        }, {
          default: a(() => [n(le, {
            label: "账号备注名"
          }, {
            default: a(() => [n(ae, {
              value: i.name,
              "onUpdate:value": t[1] ||= s => i.name = s,
              placeholder: "例如：上海装修号-01"
            }, null, 8, ["value"])]),
            _: 1
          }), n(fe, {
            modelValue: i.proxy,
            "onUpdate:modelValue": t[2] ||= s => i.proxy = s
          }, null, 8, ["modelValue"])]),
          _: 1
        })]),
        _: 1
      }, 8, ["open", "title"]), n(H, {
        open: c.value,
        "onUpdate:open": t[6] ||= s => c.value = s,
        title: "编辑账号",
        onOk: Ie
      }, {
        default: a(() => [n(ie, {
          layout: "vertical"
        }, {
          default: a(() => [n(le, {
            label: "账号备注名"
          }, {
            default: a(() => [n(ae, {
              value: v.name,
              "onUpdate:value": t[4] ||= s => v.name = s,
              placeholder: "例如：上海装修号-01"
            }, null, 8, ["value"])]),
            _: 1
          }), n(fe, {
            modelValue: v.proxy,
            "onUpdate:modelValue": t[5] ||= s => v.proxy = s
          }, null, 8, ["modelValue"])]),
          _: 1
        })]),
        _: 1
      }, 8, ["open"]), n(H, {
        open: I.value,
        "onUpdate:open": t[7] ||= s => I.value = s,
        title: (((ue = g.value) == null ? undefined : ue.status) === "online" ? "账号详情 - " : "账号登录 - ") + ((re = g.value) == null ? undefined : re.name),
        width: 1100,
        footer: null,
        onCancel: oe,
        destroyOnClose: ""
      }, {
        default: a(() => [o("div", xt, [o("div", {
          class: "login-view-container",
          ref_key: "loginViewRef",
          ref: E
        }, [o("div", gt, [n(_(Ge), {
          class: "spin",
          size: 32
        }), t[16] ||= o("p", null, "正在拉取环境，请在弹出窗口中完成登录...", -1), t[17] ||= o("span", null, "登录成功后手动关闭此窗口即可", -1)])], 512), o("div", kt, [n(_(Fe), {
          size: 16
        }), t[18] ||= o("span", null, "该环境已通过指纹算法隔离，请放心登录", -1)])])]),
        _: 1
      }, 8, ["open", "title"])]);
    };
  }
};
const Pt = ve(wt, [["__scopeId", "data-v-91a64c2d"]]);
export { Pt as default };
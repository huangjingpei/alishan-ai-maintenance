import { c9 as Oe, ca as ot, aJ as yt, aK as ht, V as de, d as J, _ as p, bG as Ne, W as ge, o as m, a6 as ye, M as he, y as Y, H as lt, i as v, q as P, aN as It, bz as it, P as Ie, Y as Ae, cb as fe, l as _e, s as z, O as St, k as at, N as ke, c5 as Ct, h as Se, n as xt, A as F, T as Mt, p as wt, v as Kt, cc as je, aO as Ee, G as rt, bR as Tt, a1 as Ot, g as kt, m as Ve, bv as We, a0 as Ge, c3 as Bt, ad as Ye, r as Pt, bi as Et, u as Dt, S as At, Q as Be, aZ as be, cd as _t } from "./index-BegIKaMc.js";
import { s as ve } from "./shallowequal-Clf6RTVF.js";
import { a as Rt, g as zt, c as Ht } from "./collapseMotion-1JEOQ_aS.js";
import { E as Ft, a as Lt } from "./OverrideContext-BkcPfvjS.js";
import "./class-DeKWk5pD.js";
function Nt() {}
var jt = Infinity;
var Vt = Oe && 1 / ot(new Oe([, -0]))[1] == jt ? function (t) {
  return new Oe(t);
} : Nt;
var Wt = 200;
function Gt(t, n, e) {
  var o = -1;
  var l = Rt;
  var u = t.length;
  var c = true;
  var a = [];
  var s = a;
  if (u >= Wt) {
    var f = Vt(t);
    if (f) {
      return ot(f);
    }
    c = false;
    l = ht;
    s = new yt();
  } else {
    s = a;
  }
  e: while (++o < u) {
    var d = t[o];
    var r = d;
    d = d !== 0 ? d : 0;
    if (c && r === r) {
      for (var $ = s.length; $--;) {
        if (s[$] === r) {
          continue e;
        }
      }
      a.push(d);
    } else if (!l(s, r, e)) {
      if (s !== a) {
        s.push(r);
      }
      a.push(d);
    }
  }
  return a;
}
function Pe(t) {
  if (t && t.length) {
    return Gt(t);
  } else {
    return [];
  }
}
const st = Symbol("menuContextKey");
const ut = t => {
  ge(st, t);
};
const Q = () => de(st);
const ct = Symbol("ForceRenderKey");
const Yt = t => {
  ge(ct, t);
};
const dt = () => de(ct, false);
const mt = Symbol("menuFirstLevelContextKey");
const vt = t => {
  ge(mt, t);
};
const Xt = () => de(mt, true);
const Ce = J({
  compatConfig: {
    MODE: 3
  },
  name: "MenuContextProvider",
  inheritAttrs: false,
  props: {
    mode: {
      type: String,
      default: undefined
    },
    overflowDisabled: {
      type: Boolean,
      default: undefined
    }
  },
  setup(t, n) {
    let {
      slots: e
    } = n;
    const o = Q();
    const l = p({}, o);
    if (t.mode !== undefined) {
      l.mode = Ne(t, "mode");
    }
    if (t.overflowDisabled !== undefined) {
      l.overflowDisabled = Ne(t, "overflowDisabled");
    }
    ut(l);
    return () => {
      var u;
      if ((u = e.default) === null || u === undefined) {
        return undefined;
      } else {
        return u.call(e);
      }
    };
  }
});
const Ut = Symbol("siderCollapsed");
const $e = "$$__vc-menu-more__key";
const ft = Symbol("KeyPathContext");
const Re = () => de(ft, {
  parentEventKeys: m(() => []),
  parentKeys: m(() => []),
  parentInfo: {}
});
const qt = (t, n, e) => {
  const {
    parentEventKeys: o,
    parentKeys: l
  } = Re();
  const u = m(() => [...o.value, t]);
  const c = m(() => [...l.value, n]);
  ge(ft, {
    parentEventKeys: u,
    parentKeys: c,
    parentInfo: e
  });
  return c;
};
const pt = Symbol("measure");
const Xe = J({
  compatConfig: {
    MODE: 3
  },
  setup(t, n) {
    let {
      slots: e
    } = n;
    ge(pt, true);
    return () => {
      var o;
      if ((o = e.default) === null || o === undefined) {
        return undefined;
      } else {
        return o.call(e);
      }
    };
  }
});
const ze = () => de(pt, false);
function gt(t) {
  const {
    mode: n,
    rtl: e,
    inlineIndent: o
  } = Q();
  return m(() => n.value !== "inline" ? null : e.value ? {
    paddingRight: `${t.value * o.value}px`
  } : {
    paddingLeft: `${t.value * o.value}px`
  });
}
let Zt = 0;
const Jt = () => ({
  id: String,
  role: String,
  disabled: Boolean,
  danger: Boolean,
  title: {
    type: [String, Boolean],
    default: undefined
  },
  icon: Ie.any,
  onMouseenter: Function,
  onMouseleave: Function,
  onClick: Function,
  onKeydown: Function,
  onFocus: Function,
  originItemValue: Ae()
});
const pe = J({
  compatConfig: {
    MODE: 3
  },
  name: "AMenuItem",
  inheritAttrs: false,
  props: Jt(),
  slots: Object,
  setup(t, n) {
    let {
      slots: e,
      emit: o,
      attrs: l
    } = n;
    const u = it();
    const c = ze();
    const a = typeof u.vnode.key == "symbol" ? String(u.vnode.key) : u.vnode.key;
    ye(typeof u.vnode.key != "symbol", "MenuItem", `MenuItem \`:key="${String(a)}"\` not support Symbol type`);
    const s = `menu_item_${++Zt}_$$_${a}`;
    const {
      parentEventKeys: f,
      parentKeys: d
    } = Re();
    const {
      prefixCls: r,
      activeKeys: $,
      disabled: y,
      changeActiveKeys: g,
      rtl: C,
      inlineCollapsed: x,
      siderCollapsed: k,
      onItemClick: K,
      selectedKeys: L,
      registerMenuInfo: q,
      unRegisterMenuInfo: I
    } = Q();
    const T = Xt();
    const R = z(false);
    const _ = m(() => [...d.value, a]);
    q(s, {
      eventKey: s,
      key: a,
      parentEventKeys: f,
      parentKeys: d,
      isLeaf: true
    });
    he(() => {
      I(s);
    });
    Y($, () => {
      R.value = !!$.value.find(h => h === a);
    }, {
      immediate: true
    });
    const O = m(() => y.value || t.disabled);
    const V = m(() => L.value.includes(a));
    const W = m(() => {
      const h = `${r.value}-item`;
      return {
        [`${h}`]: true,
        [`${h}-danger`]: t.danger,
        [`${h}-active`]: R.value,
        [`${h}-selected`]: V.value,
        [`${h}-disabled`]: O.value
      };
    });
    const X = h => ({
      key: a,
      eventKey: s,
      keyPath: _.value,
      eventKeyPath: [...f.value, s],
      domEvent: h,
      item: p(p({}, t), l)
    });
    const ae = h => {
      if (O.value) {
        return;
      }
      const E = X(h);
      o("click", h);
      K(E);
    };
    const re = h => {
      if (!O.value) {
        g(_.value);
        o("mouseenter", h);
      }
    };
    const ee = h => {
      if (!O.value) {
        g([]);
        o("mouseleave", h);
      }
    };
    const te = h => {
      o("keydown", h);
      if (h.which === St.ENTER) {
        const E = X(h);
        o("click", h);
        K(E);
      }
    };
    const se = h => {
      g(_.value);
      o("focus", h);
    };
    const N = (h, E) => {
      const H = v("span", {
        class: `${r.value}-title-content`
      }, [E]);
      if ((!h || at(E) && E.type === "span") && E && x.value && T && typeof E == "string") {
        return v("div", {
          class: `${r.value}-inline-collapsed-noicon`
        }, [E.charAt(0)]);
      } else {
        return H;
      }
    };
    const me = gt(m(() => _.value.length));
    return () => {
      var E;
      var H;
      var ne;
      if (c) {
        return null;
      }
      const U = t.title ?? ((E = e.title) === null || E === undefined ? undefined : E.call(e));
      const i = lt((H = e.default) === null || H === undefined ? undefined : H.call(e));
      const b = i.length;
      let M = U;
      if (typeof U === "undefined") {
        M = T && b ? i : "";
      } else if (U === false) {
        M = "";
      }
      const B = {
        title: M
      };
      if (!k.value && !x.value) {
        B.title = null;
        B.open = false;
      }
      const D = {};
      if (t.role === "option") {
        D["aria-selected"] = V.value;
      }
      const w = t.icon ?? ((ne = e.icon) === null || ne === undefined ? undefined : ne.call(e, t));
      return v(It, P(P({}, B), {}, {
        placement: C.value ? "left" : "right",
        overlayClassName: `${r.value}-inline-collapsed-tooltip`
      }), {
        default: () => [v(fe.Item, P(P(P({
          component: "li"
        }, l), {}, {
          id: t.id,
          style: p(p({}, l.style || {}), me.value),
          class: [W.value, {
            [`${l.class}`]: !!l.class,
            [`${r.value}-item-only-child`]: (w ? b + 1 : b) === 1
          }],
          role: t.role || "menuitem",
          tabindex: t.disabled ? null : -1,
          "data-menu-id": a,
          "aria-disabled": t.disabled
        }, D), {}, {
          onMouseenter: re,
          onMouseleave: ee,
          onClick: ae,
          onKeydown: te,
          onFocus: se,
          title: typeof U == "string" ? U : undefined
        }), {
          default: () => [_e(typeof w == "function" ? w(t.originItemValue) : w, {
            class: `${r.value}-item-icon`
          }, false), N(w, i)]
        })]
      });
    };
  }
});
const le = {
  adjustX: 1,
  adjustY: 1
};
const Qt = {
  topLeft: {
    points: ["bl", "tl"],
    overflow: le,
    offset: [0, -7]
  },
  bottomLeft: {
    points: ["tl", "bl"],
    overflow: le,
    offset: [0, 7]
  },
  leftTop: {
    points: ["tr", "tl"],
    overflow: le,
    offset: [-4, 0]
  },
  rightTop: {
    points: ["tl", "tr"],
    overflow: le,
    offset: [4, 0]
  }
};
const en = {
  topLeft: {
    points: ["bl", "tl"],
    overflow: le,
    offset: [0, -7]
  },
  bottomLeft: {
    points: ["tl", "bl"],
    overflow: le,
    offset: [0, 7]
  },
  rightTop: {
    points: ["tr", "tl"],
    overflow: le,
    offset: [-4, 0]
  },
  leftTop: {
    points: ["tl", "tr"],
    overflow: le,
    offset: [4, 0]
  }
};
const tn = {
  horizontal: "bottomLeft",
  vertical: "rightTop",
  "vertical-left": "rightTop",
  "vertical-right": "leftTop"
};
const Ue = J({
  compatConfig: {
    MODE: 3
  },
  name: "PopupTrigger",
  inheritAttrs: false,
  props: {
    prefixCls: String,
    mode: String,
    visible: Boolean,
    popupClassName: String,
    popupOffset: Array,
    disabled: Boolean,
    onVisibleChange: Function
  },
  slots: Object,
  emits: ["visibleChange"],
  setup(t, n) {
    let {
      slots: e,
      emit: o
    } = n;
    const l = z(false);
    const {
      getPopupContainer: u,
      rtl: c,
      subMenuOpenDelay: a,
      subMenuCloseDelay: s,
      builtinPlacements: f,
      triggerSubMenuAction: d,
      forceSubMenuRender: r,
      motion: $,
      defaultMotions: y,
      rootClassName: g
    } = Q();
    const C = dt();
    const x = m(() => c.value ? p(p({}, en), f.value) : p(p({}, Qt), f.value));
    const k = m(() => tn[t.mode]);
    const K = z();
    Y(() => t.visible, I => {
      ke.cancel(K.value);
      K.value = ke(() => {
        l.value = I;
      });
    }, {
      immediate: true
    });
    he(() => {
      ke.cancel(K.value);
    });
    const L = I => {
      o("visibleChange", I);
    };
    const q = m(() => {
      const R = $.value || y.value?.[t.mode] || y.value?.other;
      const _ = typeof R == "function" ? R() : R;
      if (_) {
        return xt(_.name, {
          css: true
        });
      } else {
        return undefined;
      }
    });
    return () => {
      const {
        prefixCls: I,
        popupClassName: T,
        mode: R,
        popupOffset: _,
        disabled: j
      } = t;
      return v(Ct, {
        prefixCls: I,
        popupClassName: Se(`${I}-popup`, {
          [`${I}-rtl`]: c.value
        }, T, g.value),
        stretch: R === "horizontal" ? "minWidth" : null,
        getPopupContainer: u.value,
        builtinPlacements: x.value,
        popupPlacement: k.value,
        popupVisible: l.value,
        popupAlign: _ && {
          offset: _
        },
        action: j ? [] : [d.value],
        mouseEnterDelay: a.value,
        mouseLeaveDelay: s.value,
        onPopupVisibleChange: L,
        forceRender: C || r.value,
        popupAnimation: q.value
      }, {
        popup: e.popup,
        default: e.default
      });
    };
  }
});
const He = (t, n) => {
  let {
    slots: e,
    attrs: o
  } = n;
  var l;
  const {
    prefixCls: u,
    mode: c
  } = Q();
  return v("ul", P(P({}, o), {}, {
    class: Se(u.value, `${u.value}-sub`, `${u.value}-${c.value === "inline" ? "inline" : "vertical"}`),
    "data-menu-list": true
  }), [(l = e.default) === null || l === undefined ? undefined : l.call(e)]);
};
He.displayName = "SubMenuList";
const nn = J({
  compatConfig: {
    MODE: 3
  },
  name: "InlineSubMenuList",
  inheritAttrs: false,
  props: {
    id: String,
    open: Boolean,
    keyPath: Array
  },
  setup(t, n) {
    let {
      slots: e
    } = n;
    const o = m(() => "inline");
    const {
      motion: l,
      mode: u,
      defaultMotions: c
    } = Q();
    const a = m(() => u.value === o.value);
    const s = F(!a.value);
    const f = m(() => a.value ? t.open : false);
    Y(u, () => {
      if (a.value) {
        s.value = false;
      }
    }, {
      flush: "post"
    });
    const d = m(() => {
      const y = l.value || c.value?.[o.value] || c.value?.other;
      const g = typeof y == "function" ? y() : y;
      return p(p({}, g), {
        appear: t.keyPath.length <= 1
      });
    });
    return () => {
      var r;
      if (s.value) {
        return null;
      } else {
        return v(Ce, {
          mode: o.value
        }, {
          default: () => [v(Mt, d.value, {
            default: () => [wt(v(He, {
              id: t.id
            }, {
              default: () => [(r = e.default) === null || r === undefined ? undefined : r.call(e)]
            }), [[Kt, f.value]])]
          })]
        });
      }
    };
  }
});
let qe = 0;
const on = () => ({
  icon: Ie.any,
  title: Ie.any,
  disabled: Boolean,
  level: Number,
  popupClassName: String,
  popupOffset: Array,
  internalPopupClose: Boolean,
  eventKey: String,
  expandIcon: Function,
  theme: String,
  onMouseenter: Function,
  onMouseleave: Function,
  onTitleClick: Function,
  originItemValue: Ae()
});
const ce = J({
  compatConfig: {
    MODE: 3
  },
  name: "ASubMenu",
  inheritAttrs: false,
  props: on(),
  slots: Object,
  setup(t, n) {
    let {
      slots: e,
      attrs: o,
      emit: l
    } = n;
    var c;
    vt(false);
    const a = ze();
    const s = it();
    const f = typeof s.vnode.key == "symbol" ? String(s.vnode.key) : s.vnode.key;
    ye(typeof s.vnode.key != "symbol", "SubMenu", `SubMenu \`:key="${String(f)}"\` not support Symbol type`);
    const d = je(f) ? f : `sub_menu_${++qe}_$$_not_set_key`;
    const r = t.eventKey ?? (je(f) ? `sub_menu_${++qe}_$$_${f}` : d);
    const {
      parentEventKeys: $,
      parentInfo: y,
      parentKeys: g
    } = Re();
    const C = m(() => [...g.value, d]);
    const x = z([]);
    const k = {
      eventKey: r,
      key: d,
      parentEventKeys: $,
      childrenEventKeys: x,
      parentKeys: g
    };
    if ((c = y.childrenEventKeys) !== null && c !== undefined) {
      c.value.push(r);
    }
    he(() => {
      var S;
      if (y.childrenEventKeys) {
        y.childrenEventKeys.value = (S = y.childrenEventKeys) === null || S === undefined ? undefined : S.value.filter(A => A != r);
      }
    });
    qt(r, d, k);
    const {
      prefixCls: K,
      activeKeys: L,
      disabled: q,
      changeActiveKeys: I,
      mode: T,
      inlineCollapsed: R,
      openKeys: _,
      overflowDisabled: j,
      onOpenChange: O,
      registerMenuInfo: V,
      unRegisterMenuInfo: W,
      selectedSubMenuKeys: X,
      expandIcon: ae,
      theme: re
    } = Q();
    const ee = f != null;
    const te = !a && (dt() || !ee);
    Yt(te);
    if (a && ee || !a && !ee || te) {
      V(r, k);
      he(() => {
        W(r);
      });
    }
    const se = m(() => `${K.value}-submenu`);
    const N = m(() => q.value || t.disabled);
    const me = z();
    const h = z();
    const E = m(() => _.value.includes(d));
    const H = m(() => !j.value && E.value);
    const Z = m(() => X.value.includes(d));
    const ne = z(false);
    Y(L, () => {
      ne.value = !!L.value.find(S => S === d);
    }, {
      immediate: true
    });
    const U = S => {
      if (!N.value) {
        l("titleClick", S, d);
        if (T.value === "inline") {
          O(d, !E.value);
        }
      }
    };
    const i = S => {
      if (!N.value) {
        I(C.value);
        l("mouseenter", S);
      }
    };
    const b = S => {
      if (!N.value) {
        I([]);
        l("mouseleave", S);
      }
    };
    const M = gt(m(() => C.value.length));
    const B = S => {
      if (T.value !== "inline") {
        O(d, S);
      }
    };
    const D = () => {
      I(C.value);
    };
    const w = r && `${r}-popup`;
    const G = m(() => Se(K.value, `${K.value}-${t.theme || re.value}`, t.popupClassName));
    const ue = (S, A) => {
      if (!A) {
        if (R.value && !g.value.length && S && typeof S == "string") {
          return v("div", {
            class: `${K.value}-inline-collapsed-noicon`
          }, [S.charAt(0)]);
        } else {
          return v("span", {
            class: `${K.value}-title-content`
          }, [S]);
        }
      }
      const oe = at(S) && S.type === "span";
      return v(Ee, null, [_e(typeof A == "function" ? A(t.originItemValue) : A, {
        class: `${K.value}-item-icon`
      }, false), oe ? S : v("span", {
        class: `${K.value}-title-content`
      }, [S])]);
    };
    const we = m(() => T.value !== "inline" && C.value.length > 1 ? "vertical" : T.value);
    const bt = m(() => T.value === "horizontal" ? "vertical" : T.value);
    const $t = m(() => we.value === "horizontal" ? "vertical" : we.value);
    const Fe = () => {
      var A;
      const oe = se.value;
      const Ke = t.icon ?? ((A = e.icon) === null || A === undefined ? undefined : A.call(e, t));
      const Le = t.expandIcon || e.expandIcon || ae.value;
      const Te = ue(rt(e, t, "title"), Ke);
      return v("div", {
        style: M.value,
        class: `${oe}-title`,
        tabindex: N.value ? null : -1,
        ref: me,
        title: typeof Te == "string" ? Te : null,
        "data-menu-id": d,
        "aria-expanded": H.value,
        "aria-haspopup": true,
        "aria-controls": w,
        "aria-disabled": N.value,
        onClick: U,
        onFocus: D
      }, [Te, T.value !== "horizontal" && Le ? Le(p(p({}, t), {
        isOpen: H.value
      })) : v("i", {
        class: `${oe}-arrow`
      }, null)]);
    };
    return () => {
      var S;
      if (a) {
        if (ee) {
          if ((S = e.default) === null || S === undefined) {
            return undefined;
          } else {
            return S.call(e);
          }
        } else {
          return null;
        }
      }
      const A = se.value;
      let oe = () => null;
      if (!j.value && T.value !== "inline") {
        const Ke = T.value === "horizontal" ? [0, 8] : [10, 0];
        oe = () => v(Ue, {
          mode: we.value,
          prefixCls: A,
          visible: !t.internalPopupClose && H.value,
          popupClassName: G.value,
          popupOffset: t.popupOffset || Ke,
          disabled: N.value,
          onVisibleChange: B
        }, {
          default: () => [Fe()],
          popup: () => v(Ce, {
            mode: $t.value
          }, {
            default: () => [v(He, {
              id: w,
              ref: h
            }, {
              default: e.default
            })]
          })
        });
      } else {
        oe = () => v(Ue, null, {
          default: Fe
        });
      }
      return v(Ce, {
        mode: bt.value
      }, {
        default: () => [v(fe.Item, P(P({
          component: "li"
        }, o), {}, {
          role: "none",
          class: Se(A, `${A}-${T.value}`, o.class, {
            [`${A}-open`]: H.value,
            [`${A}-active`]: ne.value,
            [`${A}-selected`]: Z.value,
            [`${A}-disabled`]: N.value
          }),
          onMouseenter: i,
          onMouseleave: b,
          "data-submenu-id": d
        }), {
          default: () => v(Ee, null, [oe(), !j.value && v(nn, {
            id: w,
            open: H.value,
            keyPath: C.value
          }, {
            default: e.default
          })])
        })]
      });
    };
  }
});
const ln = () => ({
  title: Ie.any,
  originItemValue: Ae()
});
const xe = J({
  compatConfig: {
    MODE: 3
  },
  name: "AMenuItemGroup",
  inheritAttrs: false,
  props: ln(),
  slots: Object,
  setup(t, n) {
    let {
      slots: e,
      attrs: o
    } = n;
    const {
      prefixCls: l
    } = Q();
    const u = m(() => `${l.value}-item-group`);
    const c = ze();
    return () => {
      var a;
      var s;
      if (c) {
        if ((a = e.default) === null || a === undefined) {
          return undefined;
        } else {
          return a.call(e);
        }
      } else {
        return v("li", P(P({}, o), {}, {
          onClick: f => f.stopPropagation(),
          class: u.value
        }), [v("div", {
          title: typeof t.title == "string" ? t.title : undefined,
          class: `${u.value}-title`
        }, [rt(e, t, "title")]), v("ul", {
          class: `${u.value}-list`
        }, [(s = e.default) === null || s === undefined ? undefined : s.call(e)])]);
      }
    };
  }
});
const an = () => ({
  prefixCls: String,
  dashed: Boolean
});
const Me = J({
  compatConfig: {
    MODE: 3
  },
  name: "AMenuDivider",
  props: an(),
  setup(t) {
    const {
      prefixCls: n
    } = Q();
    const e = m(() => ({
      [`${n.value}-item-divider`]: true,
      [`${n.value}-item-divider-dashed`]: !!t.dashed
    }));
    return () => v("li", {
      class: e.value
    }, null);
  }
});
function rn(t, n) {
  var e = {};
  for (var o in t) {
    if (Object.prototype.hasOwnProperty.call(t, o) && n.indexOf(o) < 0) {
      e[o] = t[o];
    }
  }
  if (t != null && typeof Object.getOwnPropertySymbols == "function") {
    for (var l = 0, o = Object.getOwnPropertySymbols(t); l < o.length; l++) {
      if (n.indexOf(o[l]) < 0 && Object.prototype.propertyIsEnumerable.call(t, o[l])) {
        e[o[l]] = t[o[l]];
      }
    }
  }
  return e;
}
function De(t, n, e) {
  return (t || []).map((o, l) => {
    if (o && typeof o == "object") {
      const u = o;
      const {
        label: c,
        children: a,
        key: s,
        type: f
      } = u;
      const d = rn(u, ["label", "children", "key", "type"]);
      const r = s ?? `tmp-${l}`;
      const $ = e ? e.parentKeys.slice() : [];
      const y = [];
      const g = {
        eventKey: r,
        key: r,
        parentEventKeys: F($),
        parentKeys: F($),
        childrenEventKeys: F(y),
        isLeaf: false
      };
      if (a || f === "group") {
        if (f === "group") {
          const x = De(a, n, e);
          return v(xe, P(P({
            key: r
          }, d), {}, {
            title: c,
            originItemValue: o
          }), {
            default: () => [x]
          });
        }
        n.set(r, g);
        if (e) {
          e.childrenEventKeys.push(r);
        }
        const C = De(a, n, {
          childrenEventKeys: y,
          parentKeys: [].concat($, r)
        });
        return v(ce, P(P({
          key: r
        }, d), {}, {
          title: c,
          originItemValue: o
        }), {
          default: () => [C]
        });
      }
      if (f === "divider") {
        return v(Me, P({
          key: r
        }, d), null);
      } else {
        g.isLeaf = true;
        n.set(r, g);
        return v(pe, P(P({
          key: r
        }, d), {}, {
          originItemValue: o
        }), {
          default: () => [c]
        });
      }
    }
    return null;
  }).filter(o => o);
}
function sn(t) {
  const n = z([]);
  const e = z(false);
  const o = z(new Map());
  Y(() => t.items, () => {
    const l = new Map();
    e.value = false;
    if (t.items) {
      e.value = true;
      n.value = De(t.items, l);
    } else {
      n.value = undefined;
    }
    o.value = l;
  }, {
    immediate: true,
    deep: true
  });
  return {
    itemsNodes: n,
    store: o,
    hasItmes: e
  };
}
const un = t => {
  const {
    componentCls: n,
    motionDurationSlow: e,
    menuHorizontalHeight: o,
    colorSplit: l,
    lineWidth: u,
    lineType: c,
    menuItemPaddingInline: a
  } = t;
  return {
    [`${n}-horizontal`]: {
      lineHeight: `${o}px`,
      border: 0,
      borderBottom: `${u}px ${c} ${l}`,
      boxShadow: "none",
      "&::after": {
        display: "block",
        clear: "both",
        height: 0,
        content: "\"\\20\""
      },
      [`${n}-item, ${n}-submenu`]: {
        position: "relative",
        display: "inline-block",
        verticalAlign: "bottom",
        paddingInline: a
      },
      [`> ${n}-item:hover,
        > ${n}-item-active,
        > ${n}-submenu ${n}-submenu-title:hover`]: {
        backgroundColor: "transparent"
      },
      [`${n}-item, ${n}-submenu-title`]: {
        transition: [`border-color ${e}`, `background ${e}`].join(",")
      },
      [`${n}-submenu-arrow`]: {
        display: "none"
      }
    }
  };
};
const cn = t => {
  let {
    componentCls: n,
    menuArrowOffset: e
  } = t;
  return {
    [`${n}-rtl`]: {
      direction: "rtl"
    },
    [`${n}-submenu-rtl`]: {
      transformOrigin: "100% 0"
    },
    [`${n}-rtl${n}-vertical,
    ${n}-submenu-rtl ${n}-vertical`]: {
      [`${n}-submenu-arrow`]: {
        "&::before": {
          transform: `rotate(-45deg) translateY(-${e})`
        },
        "&::after": {
          transform: `rotate(45deg) translateY(${e})`
        }
      }
    }
  };
};
const Ze = t => p({}, Tt(t));
const Je = (t, n) => {
  const {
    componentCls: e,
    colorItemText: o,
    colorItemTextSelected: l,
    colorGroupTitle: u,
    colorItemBg: c,
    colorSubItemBg: a,
    colorItemBgSelected: s,
    colorActiveBarHeight: f,
    colorActiveBarWidth: d,
    colorActiveBarBorderSize: r,
    motionDurationSlow: $,
    motionEaseInOut: y,
    motionEaseOut: g,
    menuItemPaddingInline: C,
    motionDurationMid: x,
    colorItemTextHover: k,
    lineType: K,
    colorSplit: L,
    colorItemTextDisabled: q,
    colorDangerItemText: I,
    colorDangerItemTextHover: T,
    colorDangerItemTextSelected: R,
    colorDangerItemBgActive: _,
    colorDangerItemBgSelected: j,
    colorItemBgHover: O,
    menuSubMenuBg: V,
    colorItemTextSelectedHorizontal: W,
    colorItemBgSelectedHorizontal: X
  } = t;
  return {
    [`${e}-${n}`]: {
      color: o,
      background: c,
      [`&${e}-root:focus-visible`]: p({}, Ze(t)),
      [`${e}-item-group-title`]: {
        color: u
      },
      [`${e}-submenu-selected`]: {
        [`> ${e}-submenu-title`]: {
          color: l
        }
      },
      [`${e}-item-disabled, ${e}-submenu-disabled`]: {
        color: `${q} !important`
      },
      [`${e}-item:hover, ${e}-submenu-title:hover`]: {
        [`&:not(${e}-item-selected):not(${e}-submenu-selected)`]: {
          color: k
        }
      },
      [`&:not(${e}-horizontal)`]: {
        [`${e}-item:not(${e}-item-selected)`]: {
          "&:hover": {
            backgroundColor: O
          },
          "&:active": {
            backgroundColor: s
          }
        },
        [`${e}-submenu-title`]: {
          "&:hover": {
            backgroundColor: O
          },
          "&:active": {
            backgroundColor: s
          }
        }
      },
      [`${e}-item-danger`]: {
        color: I,
        [`&${e}-item:hover`]: {
          [`&:not(${e}-item-selected):not(${e}-submenu-selected)`]: {
            color: T
          }
        },
        [`&${e}-item:active`]: {
          background: _
        }
      },
      [`${e}-item a`]: {
        "&, &:hover": {
          color: "inherit"
        }
      },
      [`${e}-item-selected`]: {
        color: l,
        [`&${e}-item-danger`]: {
          color: R
        },
        "a, a:hover": {
          color: "inherit"
        }
      },
      [`& ${e}-item-selected`]: {
        backgroundColor: s,
        [`&${e}-item-danger`]: {
          backgroundColor: j
        }
      },
      [`${e}-item, ${e}-submenu-title`]: {
        [`&:not(${e}-item-disabled):focus-visible`]: p({}, Ze(t))
      },
      [`&${e}-submenu > ${e}`]: {
        backgroundColor: V
      },
      [`&${e}-popup > ${e}`]: {
        backgroundColor: c
      },
      [`&${e}-horizontal`]: p(p({}, n === "dark" ? {
        borderBottom: 0
      } : {}), {
        [`> ${e}-item, > ${e}-submenu`]: {
          top: r,
          marginTop: -r,
          marginBottom: 0,
          borderRadius: 0,
          "&::after": {
            position: "absolute",
            insetInline: C,
            bottom: 0,
            borderBottom: `${f}px solid transparent`,
            transition: `border-color ${$} ${y}`,
            content: "\"\""
          },
          "&:hover, &-active, &-open": {
            "&::after": {
              borderBottomWidth: f,
              borderBottomColor: W
            }
          },
          "&-selected": {
            color: W,
            backgroundColor: X,
            "&::after": {
              borderBottomWidth: f,
              borderBottomColor: W
            }
          }
        }
      }),
      [`&${e}-root`]: {
        [`&${e}-inline, &${e}-vertical`]: {
          borderInlineEnd: `${r}px ${K} ${L}`
        }
      },
      [`&${e}-inline`]: {
        [`${e}-sub${e}-inline`]: {
          background: a
        },
        [`${e}-item, ${e}-submenu-title`]: r && d ? {
          width: `calc(100% + ${r}px)`
        } : {},
        [`${e}-item`]: {
          position: "relative",
          "&::after": {
            position: "absolute",
            insetBlock: 0,
            insetInlineEnd: 0,
            borderInlineEnd: `${d}px solid ${l}`,
            transform: "scaleY(0.0001)",
            opacity: 0,
            transition: [`transform ${x} ${g}`, `opacity ${x} ${g}`].join(","),
            content: "\"\""
          },
          [`&${e}-item-danger`]: {
            "&::after": {
              borderInlineEndColor: R
            }
          }
        },
        [`${e}-selected, ${e}-item-selected`]: {
          "&::after": {
            transform: "scaleY(1)",
            opacity: 1,
            transition: [`transform ${x} ${y}`, `opacity ${x} ${y}`].join(",")
          }
        }
      }
    }
  };
};
const Qe = t => {
  const {
    componentCls: n,
    menuItemHeight: e,
    itemMarginInline: o,
    padding: l,
    menuArrowSize: u,
    marginXS: c,
    marginXXS: a
  } = t;
  const s = l + u + c;
  return {
    [`${n}-item`]: {
      position: "relative"
    },
    [`${n}-item, ${n}-submenu-title`]: {
      height: e,
      lineHeight: `${e}px`,
      paddingInline: l,
      overflow: "hidden",
      textOverflow: "ellipsis",
      marginInline: o,
      marginBlock: a,
      width: `calc(100% - ${o * 2}px)`
    },
    [`${n}-submenu`]: {
      paddingBottom: 0.02
    },
    [`> ${n}-item,
            > ${n}-submenu > ${n}-submenu-title`]: {
      height: e,
      lineHeight: `${e}px`
    },
    [`${n}-item-group-list ${n}-submenu-title,
            ${n}-submenu-title`]: {
      paddingInlineEnd: s
    }
  };
};
const dn = t => {
  const {
    componentCls: n,
    iconCls: e,
    menuItemHeight: o,
    colorTextLightSolid: l,
    dropdownWidth: u,
    controlHeightLG: c,
    motionDurationMid: a,
    motionEaseOut: s,
    paddingXL: f,
    fontSizeSM: d,
    fontSizeLG: r,
    motionDurationSlow: $,
    paddingXS: y,
    boxShadowSecondary: g
  } = t;
  const C = {
    height: o,
    lineHeight: `${o}px`,
    listStylePosition: "inside",
    listStyleType: "disc"
  };
  return [{
    [n]: {
      "&-inline, &-vertical": p({
        [`&${n}-root`]: {
          boxShadow: "none"
        }
      }, Qe(t))
    },
    [`${n}-submenu-popup`]: {
      [`${n}-vertical`]: p(p({}, Qe(t)), {
        boxShadow: g
      })
    }
  }, {
    [`${n}-submenu-popup ${n}-vertical${n}-sub`]: {
      minWidth: u,
      maxHeight: `calc(100vh - ${c * 2.5}px)`,
      padding: "0",
      overflow: "hidden",
      borderInlineEnd: 0,
      "&:not([class*='-active'])": {
        overflowX: "hidden",
        overflowY: "auto"
      }
    }
  }, {
    [`${n}-inline`]: {
      width: "100%",
      [`&${n}-root`]: {
        [`${n}-item, ${n}-submenu-title`]: {
          display: "flex",
          alignItems: "center",
          transition: [`border-color ${$}`, `background ${$}`, `padding ${a} ${s}`].join(","),
          [`> ${n}-title-content`]: {
            flex: "auto",
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis"
          },
          "> *": {
            flex: "none"
          }
        }
      },
      [`${n}-sub${n}-inline`]: {
        padding: 0,
        border: 0,
        borderRadius: 0,
        boxShadow: "none",
        [`& > ${n}-submenu > ${n}-submenu-title`]: C,
        [`& ${n}-item-group-title`]: {
          paddingInlineStart: f
        }
      },
      [`${n}-item`]: C
    }
  }, {
    [`${n}-inline-collapsed`]: {
      width: o * 2,
      [`&${n}-root`]: {
        [`${n}-item, ${n}-submenu ${n}-submenu-title`]: {
          [`> ${n}-inline-collapsed-noicon`]: {
            fontSize: r,
            textAlign: "center"
          }
        }
      },
      [`> ${n}-item,
          > ${n}-item-group > ${n}-item-group-list > ${n}-item,
          > ${n}-item-group > ${n}-item-group-list > ${n}-submenu > ${n}-submenu-title,
          > ${n}-submenu > ${n}-submenu-title`]: {
        insetInlineStart: 0,
        paddingInline: `calc(50% - ${d}px)`,
        textOverflow: "clip",
        [`
            ${n}-submenu-arrow,
            ${n}-submenu-expand-icon
          `]: {
          opacity: 0
        },
        [`${n}-item-icon, ${e}`]: {
          margin: 0,
          fontSize: r,
          lineHeight: `${o}px`,
          "+ span": {
            display: "inline-block",
            opacity: 0
          }
        }
      },
      [`${n}-item-icon, ${e}`]: {
        display: "inline-block"
      },
      "&-tooltip": {
        pointerEvents: "none",
        [`${n}-item-icon, ${e}`]: {
          display: "none"
        },
        "a, a:hover": {
          color: l
        }
      },
      [`${n}-item-group-title`]: p(p({}, Ot), {
        paddingInline: y
      })
    }
  }];
};
const et = t => {
  const {
    componentCls: n,
    fontSize: e,
    motionDurationSlow: o,
    motionDurationMid: l,
    motionEaseInOut: u,
    motionEaseOut: c,
    iconCls: a,
    controlHeightSM: s
  } = t;
  return {
    [`${n}-item, ${n}-submenu-title`]: {
      position: "relative",
      display: "block",
      margin: 0,
      whiteSpace: "nowrap",
      cursor: "pointer",
      transition: [`border-color ${o}`, `background ${o}`, `padding ${o} ${u}`].join(","),
      [`${n}-item-icon, ${a}`]: {
        minWidth: e,
        fontSize: e,
        transition: [`font-size ${l} ${c}`, `margin ${o} ${u}`, `color ${o}`].join(","),
        "+ span": {
          marginInlineStart: s - e,
          opacity: 1,
          transition: [`opacity ${o} ${u}`, `margin ${o}`, `color ${o}`].join(",")
        }
      },
      [`${n}-item-icon`]: p({}, Et()),
      [`&${n}-item-only-child`]: {
        [`> ${a}, > ${n}-item-icon`]: {
          marginInlineEnd: 0
        }
      }
    },
    [`${n}-item-disabled, ${n}-submenu-disabled`]: {
      background: "none !important",
      cursor: "not-allowed",
      "&::after": {
        borderColor: "transparent !important"
      },
      a: {
        color: "inherit !important"
      },
      [`> ${n}-submenu-title`]: {
        color: "inherit !important",
        cursor: "not-allowed"
      }
    }
  };
};
const tt = t => {
  const {
    componentCls: n,
    motionDurationSlow: e,
    motionEaseInOut: o,
    borderRadius: l,
    menuArrowSize: u,
    menuArrowOffset: c
  } = t;
  return {
    [`${n}-submenu`]: {
      "&-expand-icon, &-arrow": {
        position: "absolute",
        top: "50%",
        insetInlineEnd: t.margin,
        width: u,
        color: "currentcolor",
        transform: "translateY(-50%)",
        transition: `transform ${e} ${o}, opacity ${e}`
      },
      "&-arrow": {
        "&::before, &::after": {
          position: "absolute",
          width: u * 0.6,
          height: u * 0.15,
          backgroundColor: "currentcolor",
          borderRadius: l,
          transition: [`background ${e} ${o}`, `transform ${e} ${o}`, `top ${e} ${o}`, `color ${e} ${o}`].join(","),
          content: "\"\""
        },
        "&::before": {
          transform: `rotate(45deg) translateY(-${c})`
        },
        "&::after": {
          transform: `rotate(-45deg) translateY(${c})`
        }
      }
    }
  };
};
const mn = t => {
  const {
    antCls: n,
    componentCls: e,
    fontSize: o,
    motionDurationSlow: l,
    motionDurationMid: u,
    motionEaseInOut: c,
    lineHeight: a,
    paddingXS: s,
    padding: f,
    colorSplit: d,
    lineWidth: r,
    zIndexPopup: $,
    borderRadiusLG: y,
    radiusSubMenuItem: g,
    menuArrowSize: C,
    menuArrowOffset: x,
    lineType: k,
    menuPanelMaskInset: K
  } = t;
  return [{
    "": {
      [`${e}`]: p(p({}, Ye()), {
        "&-hidden": {
          display: "none"
        }
      })
    },
    [`${e}-submenu-hidden`]: {
      display: "none"
    }
  }, {
    [e]: p(p(p(p(p(p(p({}, Pt(t)), Ye()), {
      marginBottom: 0,
      paddingInlineStart: 0,
      fontSize: o,
      lineHeight: 0,
      listStyle: "none",
      outline: "none",
      transition: `width ${l} cubic-bezier(0.2, 0, 0, 1) 0s`,
      "ul, ol": {
        margin: 0,
        padding: 0,
        listStyle: "none"
      },
      "&-overflow": {
        display: "flex",
        [`${e}-item`]: {
          flex: "none"
        }
      },
      [`${e}-item, ${e}-submenu, ${e}-submenu-title`]: {
        borderRadius: t.radiusItem
      },
      [`${e}-item-group-title`]: {
        padding: `${s}px ${f}px`,
        fontSize: o,
        lineHeight: a,
        transition: `all ${l}`
      },
      [`&-horizontal ${e}-submenu`]: {
        transition: [`border-color ${l} ${c}`, `background ${l} ${c}`].join(",")
      },
      [`${e}-submenu, ${e}-submenu-inline`]: {
        transition: [`border-color ${l} ${c}`, `background ${l} ${c}`, `padding ${u} ${c}`].join(",")
      },
      [`${e}-submenu ${e}-sub`]: {
        cursor: "initial",
        transition: [`background ${l} ${c}`, `padding ${l} ${c}`].join(",")
      },
      [`${e}-title-content`]: {
        transition: `color ${l}`
      },
      [`${e}-item a`]: {
        "&::before": {
          position: "absolute",
          inset: 0,
          backgroundColor: "transparent",
          content: "\"\""
        }
      },
      [`${e}-item-divider`]: {
        overflow: "hidden",
        lineHeight: 0,
        borderColor: d,
        borderStyle: k,
        borderWidth: 0,
        borderTopWidth: r,
        marginBlock: r,
        padding: 0,
        "&-dashed": {
          borderStyle: "dashed"
        }
      }
    }), et(t)), {
      [`${e}-item-group`]: {
        [`${e}-item-group-list`]: {
          margin: 0,
          padding: 0,
          [`${e}-item, ${e}-submenu-title`]: {
            paddingInline: `${o * 2}px ${f}px`
          }
        }
      },
      "&-submenu": {
        "&-popup": {
          position: "absolute",
          zIndex: $,
          background: "transparent",
          borderRadius: y,
          boxShadow: "none",
          transformOrigin: "0 0",
          "&::before": {
            position: "absolute",
            inset: `${K}px 0 0`,
            zIndex: -1,
            width: "100%",
            height: "100%",
            opacity: 0,
            content: "\"\""
          }
        },
        "&-placement-rightTop::before": {
          top: 0,
          insetInlineStart: K
        },
        [`> ${e}`]: p(p(p({
          borderRadius: y
        }, et(t)), tt(t)), {
          [`${e}-item, ${e}-submenu > ${e}-submenu-title`]: {
            borderRadius: g
          },
          [`${e}-submenu-title::after`]: {
            transition: `transform ${l} ${c}`
          }
        })
      }
    }), tt(t)), {
      [`&-inline-collapsed ${e}-submenu-arrow,
        &-inline ${e}-submenu-arrow`]: {
        "&::before": {
          transform: `rotate(-45deg) translateX(${x})`
        },
        "&::after": {
          transform: `rotate(45deg) translateX(-${x})`
        }
      },
      [`${e}-submenu-open${e}-submenu-inline > ${e}-submenu-title > ${e}-submenu-arrow`]: {
        transform: `translateY(-${C * 0.2}px)`,
        "&::after": {
          transform: `rotate(-45deg) translateX(-${x})`
        },
        "&::before": {
          transform: `rotate(45deg) translateX(${x})`
        }
      }
    })
  }, {
    [`${n}-layout-header`]: {
      [e]: {
        lineHeight: "inherit"
      }
    }
  }];
};
const vn = (t, n) => kt("Menu", (o, l) => {
  let {
    overrideComponentToken: u
  } = l;
  if ((n == null ? undefined : n.value) === false) {
    return [];
  }
  const {
    colorBgElevated: c,
    colorPrimary: a,
    colorError: s,
    colorErrorHover: f,
    colorTextLightSolid: d
  } = o;
  const {
    controlHeightLG: r,
    fontSize: $
  } = o;
  const y = $ / 7 * 5;
  const g = Ve(o, {
    menuItemHeight: r,
    menuItemPaddingInline: o.margin,
    menuArrowSize: y,
    menuHorizontalHeight: r * 1.15,
    menuArrowOffset: `${y * 0.25}px`,
    menuPanelMaskInset: -7,
    menuSubMenuBg: c
  });
  const C = new We(d).setAlpha(0.65).toRgbString();
  const x = Ve(g, {
    colorItemText: C,
    colorItemTextHover: d,
    colorGroupTitle: C,
    colorItemTextSelected: d,
    colorItemBg: "#001529",
    colorSubItemBg: "#000c17",
    colorItemBgActive: "transparent",
    colorItemBgSelected: a,
    colorActiveBarWidth: 0,
    colorActiveBarHeight: 0,
    colorActiveBarBorderSize: 0,
    colorItemTextDisabled: new We(d).setAlpha(0.25).toRgbString(),
    colorDangerItemText: s,
    colorDangerItemTextHover: f,
    colorDangerItemTextSelected: d,
    colorDangerItemBgActive: s,
    colorDangerItemBgSelected: s,
    menuSubMenuBg: "#001529",
    colorItemTextSelectedHorizontal: d,
    colorItemBgSelectedHorizontal: a
  }, p({}, u));
  return [mn(g), un(g), dn(g), Je(g, "light"), Je(x, "dark"), cn(g), zt(g), Ge(g, "slide-up"), Ge(g, "slide-down"), Bt(g, "zoom-big")];
}, o => {
  const {
    colorPrimary: l,
    colorError: u,
    colorTextDisabled: c,
    colorErrorBg: a,
    colorText: s,
    colorTextDescription: f,
    colorBgContainer: d,
    colorFillAlter: r,
    colorFillContent: $,
    lineWidth: y,
    lineWidthBold: g,
    controlItemBgActive: C,
    colorBgTextHover: x
  } = o;
  return {
    dropdownWidth: 160,
    zIndexPopup: o.zIndexPopupBase + 50,
    radiusItem: o.borderRadiusLG,
    radiusSubMenuItem: o.borderRadiusSM,
    colorItemText: s,
    colorItemTextHover: s,
    colorItemTextHoverHorizontal: l,
    colorGroupTitle: f,
    colorItemTextSelected: l,
    colorItemTextSelectedHorizontal: l,
    colorItemBg: d,
    colorItemBgHover: x,
    colorItemBgActive: $,
    colorSubItemBg: r,
    colorItemBgSelected: C,
    colorItemBgSelectedHorizontal: "transparent",
    colorActiveBarWidth: 0,
    colorActiveBarHeight: g,
    colorActiveBarBorderSize: y,
    colorItemTextDisabled: c,
    colorDangerItemText: u,
    colorDangerItemTextHover: u,
    colorDangerItemTextSelected: u,
    colorDangerItemBgActive: a,
    colorDangerItemBgSelected: a,
    itemMarginInline: o.marginXXS
  };
})(t);
const fn = () => ({
  id: String,
  prefixCls: String,
  items: Array,
  disabled: Boolean,
  inlineCollapsed: Boolean,
  disabledOverflow: Boolean,
  forceSubMenuRender: Boolean,
  openKeys: Array,
  selectedKeys: Array,
  activeKey: String,
  selectable: {
    type: Boolean,
    default: true
  },
  multiple: {
    type: Boolean,
    default: false
  },
  tabindex: {
    type: [Number, String]
  },
  motion: Object,
  role: String,
  theme: {
    type: String,
    default: "light"
  },
  mode: {
    type: String,
    default: "vertical"
  },
  inlineIndent: {
    type: Number,
    default: 24
  },
  subMenuOpenDelay: {
    type: Number,
    default: 0
  },
  subMenuCloseDelay: {
    type: Number,
    default: 0.1
  },
  builtinPlacements: {
    type: Object
  },
  triggerSubMenuAction: {
    type: String,
    default: "hover"
  },
  getPopupContainer: Function,
  expandIcon: Function,
  onOpenChange: Function,
  onSelect: Function,
  onDeselect: Function,
  onClick: [Function, Array],
  onFocus: Function,
  onBlur: Function,
  onMousedown: Function,
  "onUpdate:openKeys": Function,
  "onUpdate:selectedKeys": Function,
  "onUpdate:activeKey": Function
});
const nt = [];
const ie = J({
  compatConfig: {
    MODE: 3
  },
  name: "AMenu",
  inheritAttrs: false,
  props: fn(),
  slots: Object,
  setup(t, n) {
    let {
      slots: e,
      emit: o,
      attrs: l
    } = n;
    const {
      direction: u,
      getPrefixCls: c
    } = Dt("menu", t);
    const a = Lt();
    const s = m(() => {
      return c("menu", t.prefixCls || (a == null ? undefined : a.prefixCls)?.value);
    });
    const [f, d] = vn(s, m(() => !a));
    const r = z(new Map());
    const $ = de(Ut, F(undefined));
    const y = m(() => $.value !== undefined ? $.value : t.inlineCollapsed);
    const {
      itemsNodes: g
    } = sn(t);
    const C = z(false);
    At(() => {
      C.value = true;
    });
    Be(() => {
      ye(t.inlineCollapsed !== true || t.mode === "inline", "Menu", "`inlineCollapsed` should only be used when `mode` is inline.");
      ye($.value === undefined || t.inlineCollapsed !== true, "Menu", "`inlineCollapsed` not control Menu under Sider. Should set `collapsed` on Sider instead.");
    });
    const x = F([]);
    const k = F([]);
    const K = F({});
    Y(r, () => {
      const i = {};
      for (const b of r.value.values()) {
        i[b.key] = b;
      }
      K.value = i;
    }, {
      flush: "post"
    });
    Be(() => {
      if (t.activeKey !== undefined) {
        let i = [];
        const b = t.activeKey ? K.value[t.activeKey] : undefined;
        if (b && t.activeKey !== undefined) {
          i = Pe([].concat(be(b.parentKeys), t.activeKey));
        } else {
          i = [];
        }
        if (!ve(x.value, i)) {
          x.value = i;
        }
      }
    });
    Y(() => t.selectedKeys, i => {
      if (i) {
        k.value = i.slice();
      }
    }, {
      immediate: true,
      deep: true
    });
    const L = F([]);
    Y([K, k], () => {
      let i = [];
      k.value.forEach(b => {
        const M = K.value[b];
        if (M) {
          i = i.concat(be(M.parentKeys));
        }
      });
      i = Pe(i);
      if (!ve(L.value, i)) {
        L.value = i;
      }
    }, {
      immediate: true
    });
    const q = i => {
      if (t.selectable) {
        const {
          key: b
        } = i;
        const M = k.value.includes(b);
        let B;
        if (t.multiple) {
          if (M) {
            B = k.value.filter(w => w !== b);
          } else {
            B = [...k.value, b];
          }
        } else {
          B = [b];
        }
        const D = p(p({}, i), {
          selectedKeys: B
        });
        if (!ve(B, k.value)) {
          if (t.selectedKeys === undefined) {
            k.value = B;
          }
          o("update:selectedKeys", B);
          if (M && t.multiple) {
            o("deselect", D);
          } else {
            o("select", D);
          }
        }
      }
      if (O.value !== "inline" && !t.multiple && I.value.length) {
        X(nt);
      }
    };
    const I = F([]);
    Y(() => t.openKeys, function (i = I.value) {
      if (!ve(I.value, i)) {
        I.value = i.slice();
      }
    }, {
      immediate: true,
      deep: true
    });
    let T;
    const R = i => {
      clearTimeout(T);
      T = setTimeout(() => {
        if (t.activeKey === undefined) {
          x.value = i;
        }
        o("update:activeKey", i[i.length - 1]);
      });
    };
    const _ = m(() => !!t.disabled);
    const j = m(() => u.value === "rtl");
    const O = F("vertical");
    const V = z(false);
    Be(() => {
      var i;
      if ((t.mode === "inline" || t.mode === "vertical") && y.value) {
        O.value = "vertical";
        V.value = y.value;
      } else {
        O.value = t.mode;
        V.value = false;
      }
      if ((i = a == null ? undefined : a.mode) !== null && i !== undefined && i.value) {
        O.value = a.mode.value;
      }
    });
    const W = m(() => O.value === "inline");
    const X = i => {
      I.value = i;
      o("update:openKeys", i);
      o("openChange", i);
    };
    const ae = F(I.value);
    const re = z(false);
    Y(I, () => {
      if (W.value) {
        ae.value = I.value;
      }
    }, {
      immediate: true
    });
    Y(W, () => {
      if (!re.value) {
        re.value = true;
        return;
      }
      if (W.value) {
        I.value = ae.value;
      } else {
        X(nt);
      }
    }, {
      immediate: true
    });
    const ee = m(() => ({
      [`${s.value}`]: true,
      [`${s.value}-root`]: true,
      [`${s.value}-${O.value}`]: true,
      [`${s.value}-inline-collapsed`]: V.value,
      [`${s.value}-rtl`]: j.value,
      [`${s.value}-${t.theme}`]: true
    }));
    const te = m(() => c());
    const se = m(() => ({
      horizontal: {
        name: `${te.value}-slide-up`
      },
      inline: Ht(`${te.value}-motion-collapse`),
      other: {
        name: `${te.value}-zoom-big`
      }
    }));
    vt(true);
    const N = function (i = []) {
      const b = [];
      const M = r.value;
      i.forEach(B => {
        const {
          key: D,
          childrenEventKeys: w
        } = M.get(B);
        b.push(D, ...N(be(w)));
      });
      return b;
    };
    const me = i => {
      var b;
      o("click", i);
      q(i);
      if ((b = a == null ? undefined : a.onClick) !== null && b !== undefined) {
        b.call(a);
      }
    };
    const h = (i, b) => {
      const B = K.value[i]?.childrenEventKeys || [];
      let D = I.value.filter(w => w !== i);
      if (b) {
        D.push(i);
      } else if (O.value !== "inline") {
        const w = N(be(B));
        D = Pe(D.filter(G => !w.includes(G)));
      }
      if (!ve(I, D)) {
        X(D);
      }
    };
    const E = (i, b) => {
      r.value.set(i, b);
      r.value = new Map(r.value);
    };
    const H = i => {
      r.value.delete(i);
      r.value = new Map(r.value);
    };
    const Z = F(0);
    const ne = m(() => {
      var i;
      if (t.expandIcon || e.expandIcon || (i = a == null ? undefined : a.expandIcon) !== null && i !== undefined && i.value) {
        return b => {
          let M = t.expandIcon || e.expandIcon;
          M = typeof M == "function" ? M(b) : M;
          return _e(M, {
            class: `${s.value}-submenu-expand-icon`
          }, false);
        };
      } else {
        return null;
      }
    });
    ut({
      prefixCls: s,
      activeKeys: x,
      openKeys: I,
      selectedKeys: k,
      changeActiveKeys: R,
      disabled: _,
      rtl: j,
      mode: O,
      inlineIndent: m(() => t.inlineIndent),
      subMenuCloseDelay: m(() => t.subMenuCloseDelay),
      subMenuOpenDelay: m(() => t.subMenuOpenDelay),
      builtinPlacements: m(() => t.builtinPlacements),
      triggerSubMenuAction: m(() => t.triggerSubMenuAction),
      getPopupContainer: m(() => t.getPopupContainer),
      inlineCollapsed: V,
      theme: m(() => t.theme),
      siderCollapsed: $,
      defaultMotions: m(() => C.value ? se.value : null),
      motion: m(() => C.value ? t.motion : null),
      overflowDisabled: z(undefined),
      onOpenChange: h,
      onItemClick: me,
      registerMenuInfo: E,
      unRegisterMenuInfo: H,
      selectedSubMenuKeys: L,
      expandIcon: ne,
      forceSubMenuRender: m(() => t.forceSubMenuRender),
      rootClassName: d
    });
    const U = () => {
      var i;
      return g.value || lt((i = e.default) === null || i === undefined ? undefined : i.call(e));
    };
    return () => {
      var i;
      const b = U();
      const M = Z.value >= b.length - 1 || O.value !== "horizontal" || t.disabledOverflow;
      const B = w => O.value !== "horizontal" || t.disabledOverflow ? w : w.map((G, ue) => v(Ce, {
        key: G.key,
        overflowDisabled: ue > Z.value
      }, {
        default: () => G
      }));
      const D = ((i = e.overflowedIndicator) === null || i === undefined ? undefined : i.call(e)) || v(Ft, null, null);
      return f(v(fe, P(P({}, l), {}, {
        onMousedown: t.onMousedown,
        prefixCls: `${s.value}-overflow`,
        component: "ul",
        itemComponent: pe,
        class: [ee.value, l.class, d.value],
        role: "menu",
        id: t.id,
        data: B(b),
        renderRawItem: w => w,
        renderRawRest: w => {
          const G = w.length;
          const ue = G ? b.slice(-G) : null;
          return v(Ee, null, [v(ce, {
            eventKey: $e,
            key: $e,
            title: D,
            disabled: M,
            internalPopupClose: G === 0
          }, {
            default: () => ue
          }), v(Xe, null, {
            default: () => [v(ce, {
              eventKey: $e,
              key: $e,
              title: D,
              disabled: M,
              internalPopupClose: G === 0
            }, {
              default: () => ue
            })]
          })]);
        },
        maxCount: O.value !== "horizontal" || t.disabledOverflow ? fe.INVALIDATE : fe.RESPONSIVE,
        ssr: "full",
        "data-menu-list": true,
        onVisibleChange: w => {
          Z.value = w;
        }
      }), {
        default: () => [v(_t, {
          to: "body"
        }, {
          default: () => [v("div", {
            style: {
              display: "none"
            },
            "aria-hidden": true
          }, [v(Xe, null, {
            default: () => [B(U())]
          })])]
        })]
      }));
    };
  }
});
ie.install = function (t) {
  t.component(ie.name, ie);
  t.component(pe.name, pe);
  t.component(ce.name, ce);
  t.component(Me.name, Me);
  t.component(xe.name, xe);
  return t;
};
ie.Item = pe;
ie.Divider = Me;
ie.SubMenu = ce;
ie.ItemGroup = xe;
export { Me as Divider, pe as Item, xe as ItemGroup, Me as MenuDivider, pe as MenuItem, xe as MenuItemGroup, ce as SubMenu, ie as default };
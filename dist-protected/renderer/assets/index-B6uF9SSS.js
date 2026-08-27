import { J as gt, L as Ft, s as q, M as nt, N as Re, d as z, i as s, h as G, O as oe, A as ie, o as D, Q as ke, _ as l, P as de, R as N, S as We, y as he, U as ee, V as qt, W as Vt, X as ht, q as k, Y as Ie, Z as Pe, l as Yt, $ as Ut, a0 as mt, g as ot, m as it, r as rt, a1 as lt, a2 as It, H as Et, a3 as st, a4 as Ae, k as Zt, a5 as Jt, a6 as ze, u as ce, a7 as Qt, a8 as $t, j as ea, a9 as ta, aa as De, ab as aa, ac as na, ad as Ne, K as oa, ae as Be, af as yt, ag as ia, ah as ra, ai as la, G as Ve, aj as Ye } from "./index-BegIKaMc.js";
import sa, { Item as da } from "./index-DFdN_Qcm.js";
import { D as ca } from "./Dropdown-ChJJqUNg.js";
import { u as ua, E as va } from "./OverrideContext-BkcPfvjS.js";
import { u as pa } from "./useRefs-DuBUbAWx.js";
import { c as At, t as ba, a as fa, b as ga, h as ha, f as ma } from "./hasIn-CNvCMDPx.js";
import "./shallowequal-Clf6RTVF.js";
import "./collapseMotion-1JEOQ_aS.js";
import "./class-DeKWk5pD.js";
import "./_baseAssignValue-Cz7QXdQ5.js";
function $a(e, t, a, n) {
  if (!gt(e)) {
    return e;
  }
  t = At(t, e);
  for (var o = -1, r = t.length, i = r - 1, d = e; d != null && ++o < r;) {
    var g = ba(t[o]);
    var u = a;
    if (g === "__proto__" || g === "constructor" || g === "prototype") {
      return e;
    }
    if (o != i) {
      var f = d[g];
      u = undefined;
      if (u === undefined) {
        u = gt(f) ? f : Ft(t[o + 1]) ? [] : {};
      }
    }
    fa(d, g, u);
    d = d[g];
  }
  return e;
}
function ya(e, t, a) {
  for (var n = -1, o = t.length, r = {}; ++n < o;) {
    var i = t[n];
    var d = ga(e, i);
    if (a(d, i)) {
      $a(r, At(i, e), d);
    }
  }
  return r;
}
function Sa(e, t) {
  return ya(e, t, function (a, n) {
    return ha(e, n);
  });
}
var Lt = ma(function (e, t) {
  if (e == null) {
    return {};
  } else {
    return Sa(e, t);
  }
});
function xa(e) {
  const t = q();
  const a = q(false);
  function n() {
    for (var o = arguments.length, r = new Array(o), i = 0; i < o; i++) {
      r[i] = arguments[i];
    }
    if (!a.value) {
      Re.cancel(t.value);
      t.value = Re(() => {
        e(...r);
      });
    }
  }
  nt(() => {
    a.value = true;
    Re.cancel(t.value);
  });
  return n;
}
function Ca(e) {
  const t = q([]);
  const a = q(typeof e == "function" ? e() : e);
  const n = xa(() => {
    let r = a.value;
    t.value.forEach(i => {
      r = i(r);
    });
    t.value = [];
    a.value = r;
  });
  function o(r) {
    t.value.push(r);
    n();
  }
  return [a, o];
}
const wa = z({
  compatConfig: {
    MODE: 3
  },
  name: "TabNode",
  props: {
    id: {
      type: String
    },
    prefixCls: {
      type: String
    },
    tab: {
      type: Object
    },
    active: {
      type: Boolean
    },
    closable: {
      type: Boolean
    },
    editable: {
      type: Object
    },
    onClick: {
      type: Function
    },
    onResize: {
      type: Function
    },
    renderWrapper: {
      type: Function
    },
    removeAriaLabel: {
      type: String
    },
    onFocus: {
      type: Function
    }
  },
  emits: ["click", "resize", "remove", "focus"],
  setup(e, t) {
    let {
      expose: a,
      attrs: n
    } = t;
    const o = ie();
    function r(g) {
      var u;
      if ((u = e.tab) === null || u === undefined || !u.disabled) {
        e.onClick(g);
      }
    }
    a({
      domRef: o
    });
    function i(g) {
      g.preventDefault();
      g.stopPropagation();
      e.editable.onEdit("remove", {
        key: e.tab?.key,
        event: g
      });
    }
    const d = D(() => {
      var g;
      return e.editable && e.closable !== false && ((g = e.tab) === null || g === undefined || !g.disabled);
    });
    return () => {
      var g;
      const {
        prefixCls: u,
        id: f,
        active: S,
        tab: {
          key: h,
          tab: c,
          disabled: v,
          closeIcon: $
        },
        renderWrapper: w,
        removeAriaLabel: C,
        editable: A,
        onFocus: L
      } = e;
      const M = `${u}-tab`;
      const b = s("div", {
        key: h,
        ref: o,
        class: G(M, {
          [`${M}-with-remove`]: d.value,
          [`${M}-active`]: S,
          [`${M}-disabled`]: v
        }),
        style: n.style,
        onClick: r
      }, [s("div", {
        role: "tab",
        "aria-selected": S,
        id: f && `${f}-tab-${h}`,
        class: `${M}-btn`,
        "aria-controls": f && `${f}-panel-${h}`,
        "aria-disabled": v,
        tabindex: v ? null : 0,
        onClick: x => {
          x.stopPropagation();
          r(x);
        },
        onKeydown: x => {
          if ([oe.SPACE, oe.ENTER].includes(x.which)) {
            x.preventDefault();
            r(x);
          }
        },
        onFocus: L
      }, [typeof c == "function" ? c() : c]), d.value && s("button", {
        type: "button",
        "aria-label": C || "remove",
        tabindex: 0,
        class: `${M}-remove`,
        onClick: x => {
          x.stopPropagation();
          i(x);
        }
      }, [($ == null ? undefined : $()) || ((g = A.removeIcon) === null || g === undefined ? undefined : g.call(A)) || "×"])]);
      if (w) {
        return w(b);
      } else {
        return b;
      }
    };
  }
});
const St = {
  width: 0,
  height: 0,
  left: 0,
  top: 0
};
function Ta(e, t) {
  const a = ie(new Map());
  ke(() => {
    const r = new Map();
    const i = e.value;
    const d = t.value.get(i[0]?.key) || St;
    const g = d.left + d.width;
    for (let u = 0; u < i.length; u += 1) {
      const {
        key: f
      } = i[u];
      let S = t.value.get(f);
      S ||= t.value.get(i[u - 1]?.key) || St;
      const h = r.get(f) || l({}, S);
      h.right = g - h.left - h.width;
      r.set(f, h);
    }
    a.value = new Map(r);
  });
  return a;
}
const Mt = z({
  compatConfig: {
    MODE: 3
  },
  name: "AddButton",
  inheritAttrs: false,
  props: {
    prefixCls: String,
    editable: {
      type: Object
    },
    locale: {
      type: Object,
      default: undefined
    }
  },
  setup(e, t) {
    let {
      expose: a,
      attrs: n
    } = t;
    const o = ie();
    a({
      domRef: o
    });
    return () => {
      const {
        prefixCls: r,
        editable: i,
        locale: d
      } = e;
      if (!i || i.showAdd === false) {
        return null;
      } else {
        return s("button", {
          ref: o,
          type: "button",
          class: `${r}-nav-add`,
          style: n.style,
          "aria-label": (d == null ? undefined : d.addAriaLabel) || "Add tab",
          onClick: g => {
            i.onEdit("add", {
              event: g
            });
          }
        }, [i.addIcon ? i.addIcon() : "+"]);
      }
    };
  }
});
const _a = {
  prefixCls: {
    type: String
  },
  id: {
    type: String
  },
  tabs: {
    type: Object
  },
  rtl: {
    type: Boolean
  },
  tabBarGutter: {
    type: Number
  },
  activeKey: {
    type: [String, Number]
  },
  mobile: {
    type: Boolean
  },
  moreIcon: de.any,
  moreTransitionName: {
    type: String
  },
  editable: {
    type: Object
  },
  locale: {
    type: Object,
    default: undefined
  },
  removeAriaLabel: String,
  onTabClick: {
    type: Function
  },
  popupClassName: String,
  getPopupContainer: ee()
};
const Pa = z({
  compatConfig: {
    MODE: 3
  },
  name: "OperationNode",
  inheritAttrs: false,
  props: _a,
  emits: ["tabClick"],
  slots: Object,
  setup(e, t) {
    let {
      attrs: a,
      slots: n
    } = t;
    const [o, r] = N(false);
    const [i, d] = N(null);
    const g = c => {
      const v = e.tabs.filter(C => !C.disabled);
      let $ = v.findIndex(C => C.key === i.value) || 0;
      const w = v.length;
      for (let C = 0; C < w; C += 1) {
        $ = ($ + c + w) % w;
        const A = v[$];
        if (!A.disabled) {
          d(A.key);
          return;
        }
      }
    };
    const u = c => {
      const {
        which: v
      } = c;
      if (!o.value) {
        if ([oe.DOWN, oe.SPACE, oe.ENTER].includes(v)) {
          r(true);
          c.preventDefault();
        }
        return;
      }
      switch (v) {
        case oe.UP:
          g(-1);
          c.preventDefault();
          break;
        case oe.DOWN:
          g(1);
          c.preventDefault();
          break;
        case oe.ESC:
          r(false);
          break;
        case oe.SPACE:
        case oe.ENTER:
          if (i.value !== null) {
            e.onTabClick(i.value, c);
          }
          break;
      }
    };
    const f = D(() => `${e.id}-more-popup`);
    const S = D(() => i.value !== null ? `${f.value}-${i.value}` : null);
    const h = (c, v) => {
      c.preventDefault();
      c.stopPropagation();
      e.editable.onEdit("remove", {
        key: v,
        event: c
      });
    };
    We(() => {
      he(i, () => {
        const c = document.getElementById(S.value);
        if (c && c.scrollIntoView) {
          c.scrollIntoView(false);
        }
      }, {
        flush: "post",
        immediate: true
      });
    });
    he(o, () => {
      if (!o.value) {
        d(null);
      }
    });
    ua({});
    return () => {
      var c;
      const {
        prefixCls: v,
        id: $,
        tabs: w,
        locale: C,
        mobile: A,
        moreIcon: L = ((c = n.moreIcon) === null || c === undefined ? undefined : c.call(n)) || s(va, null, null),
        moreTransitionName: M,
        editable: b,
        tabBarGutter: x,
        rtl: p,
        onTabClick: _,
        popupClassName: I
      } = e;
      if (!w.length) {
        return null;
      }
      const R = `${v}-dropdown`;
      const K = C == null ? undefined : C.dropdownAriaLabel;
      const J = {
        [p ? "marginRight" : "marginLeft"]: x
      };
      if (!w.length) {
        J.visibility = "hidden";
        J.order = 1;
      }
      const te = G({
        [`${R}-rtl`]: p,
        [`${I}`]: true
      });
      const re = A ? null : s(ca, {
        prefixCls: R,
        trigger: ["hover"],
        visible: o.value,
        transitionName: M,
        onVisibleChange: r,
        overlayClassName: te,
        mouseEnterDelay: 0.1,
        mouseLeaveDelay: 0.1,
        getPopupContainer: e.getPopupContainer
      }, {
        overlay: () => s(sa, {
          onClick: B => {
            let {
              key: X,
              domEvent: T
            } = B;
            _(X, T);
            r(false);
          },
          id: f.value,
          tabindex: -1,
          role: "listbox",
          "aria-activedescendant": S.value,
          selectedKeys: [i.value],
          "aria-label": K !== undefined ? K : "expanded dropdown"
        }, {
          default: () => [w.map(B => {
            var X;
            var T;
            const Y = b && B.closable !== false && !B.disabled;
            return s(da, {
              key: B.key,
              id: `${f.value}-${B.key}`,
              role: "option",
              "aria-controls": $ && `${$}-panel-${B.key}`,
              disabled: B.disabled
            }, {
              default: () => [s("span", null, [typeof B.tab == "function" ? B.tab() : B.tab]), Y && s("button", {
                type: "button",
                "aria-label": e.removeAriaLabel || "remove",
                tabindex: 0,
                class: `${R}-menu-item-remove`,
                onClick: U => {
                  U.stopPropagation();
                  h(U, B.key);
                }
              }, [((X = B.closeIcon) === null || X === undefined ? undefined : X.call(B)) || ((T = b.removeIcon) === null || T === undefined ? undefined : T.call(b)) || "×"])]
            });
          })]
        }),
        default: () => s("button", {
          type: "button",
          class: `${v}-nav-more`,
          style: J,
          tabindex: -1,
          "aria-hidden": "true",
          "aria-haspopup": "listbox",
          "aria-controls": f.value,
          id: `${$}-more`,
          "aria-expanded": o.value,
          onKeydown: u
        }, [L])
      });
      return s("div", {
        class: G(`${v}-nav-operations`, a.class),
        style: a.style
      }, [re, s(Mt, {
        prefixCls: v,
        locale: C,
        editable: b
      }, null)]);
    };
  }
});
const Ht = Symbol("tabsContextKey");
const Ba = e => {
  Vt(Ht, e);
};
const Dt = () => qt(Ht, {
  tabs: ie([]),
  prefixCls: ie()
});
const Ra = 0.1;
const xt = 0.01;
const Oe = 20;
const Ct = Math.pow(0.995, Oe);
function Ia(e, t) {
  const [a, n] = N();
  const [o, r] = N(0);
  const [i, d] = N(0);
  const [g, u] = N();
  const f = ie();
  function S(b) {
    const {
      screenX: x,
      screenY: p
    } = b.touches[0];
    n({
      x,
      y: p
    });
    clearInterval(f.value);
  }
  function h(b) {
    if (!a.value) {
      return;
    }
    b.preventDefault();
    const {
      screenX: x,
      screenY: p
    } = b.touches[0];
    const _ = x - a.value.x;
    const I = p - a.value.y;
    t(_, I);
    n({
      x,
      y: p
    });
    const R = Date.now();
    d(R - o.value);
    r(R);
    u({
      x: _,
      y: I
    });
  }
  function c() {
    if (!a.value) {
      return;
    }
    const b = g.value;
    n(null);
    u(null);
    if (b) {
      const x = b.x / i.value;
      const p = b.y / i.value;
      const _ = Math.abs(x);
      const I = Math.abs(p);
      if (Math.max(_, I) < Ra) {
        return;
      }
      let R = x;
      let K = p;
      f.value = setInterval(() => {
        if (Math.abs(R) < xt && Math.abs(K) < xt) {
          clearInterval(f.value);
          return;
        }
        R *= Ct;
        K *= Ct;
        t(R * Oe, K * Oe);
      }, Oe);
    }
  }
  const v = ie();
  function $(b) {
    const {
      deltaX: x,
      deltaY: p
    } = b;
    let _ = 0;
    const I = Math.abs(x);
    const R = Math.abs(p);
    if (I === R) {
      _ = v.value === "x" ? x : p;
    } else if (I > R) {
      _ = x;
      v.value = "x";
    } else {
      _ = p;
      v.value = "y";
    }
    if (t(-_, -_)) {
      b.preventDefault();
    }
  }
  const w = ie({
    onTouchStart: S,
    onTouchMove: h,
    onTouchEnd: c,
    onWheel: $
  });
  function C(b) {
    w.value.onTouchStart(b);
  }
  function A(b) {
    w.value.onTouchMove(b);
  }
  function L(b) {
    w.value.onTouchEnd(b);
  }
  function M(b) {
    w.value.onWheel(b);
  }
  We(() => {
    var b;
    var x;
    document.addEventListener("touchmove", A, {
      passive: false
    });
    document.addEventListener("touchend", L, {
      passive: false
    });
    if ((b = e.value) !== null && b !== undefined) {
      b.addEventListener("touchstart", C, {
        passive: false
      });
    }
    if ((x = e.value) !== null && x !== undefined) {
      x.addEventListener("wheel", M, {
        passive: false
      });
    }
  });
  nt(() => {
    document.removeEventListener("touchmove", A);
    document.removeEventListener("touchend", L);
  });
}
function wt(e, t) {
  const a = ie(e);
  function n(o) {
    const r = typeof o == "function" ? o(a.value) : o;
    if (r !== a.value) {
      t(r, a.value);
    }
    a.value = r;
  }
  return [a, n];
}
const Tt = {
  width: 0,
  height: 0,
  left: 0,
  top: 0,
  right: 0
};
const Ea = () => ({
  id: {
    type: String
  },
  tabPosition: {
    type: String
  },
  activeKey: {
    type: [String, Number]
  },
  rtl: {
    type: Boolean
  },
  animated: Ie(),
  editable: Ie(),
  moreIcon: de.any,
  moreTransitionName: {
    type: String
  },
  mobile: {
    type: Boolean
  },
  tabBarGutter: {
    type: Number
  },
  renderTabBar: {
    type: Function
  },
  locale: Ie(),
  popupClassName: String,
  getPopupContainer: ee(),
  onTabClick: {
    type: Function
  },
  onTabScroll: {
    type: Function
  }
});
const Aa = (e, t) => {
  const {
    offsetWidth: a,
    offsetHeight: n,
    offsetTop: o,
    offsetLeft: r
  } = e;
  const {
    width: i,
    height: d,
    x: g,
    y: u
  } = e.getBoundingClientRect();
  if (Math.abs(i - a) < 1) {
    return [i, d, g - t.x, u - t.y];
  } else {
    return [a, n, r, o];
  }
};
const _t = z({
  compatConfig: {
    MODE: 3
  },
  name: "TabNavList",
  inheritAttrs: false,
  props: Ea(),
  slots: Object,
  emits: ["tabClick", "tabScroll"],
  setup(e, t) {
    let {
      attrs: a,
      slots: n
    } = t;
    const {
      tabs: o,
      prefixCls: r
    } = Dt();
    const i = q();
    const d = q();
    const g = q();
    const u = q();
    const [f, S] = pa();
    const h = D(() => e.tabPosition === "top" || e.tabPosition === "bottom");
    const [c, v] = wt(0, (y, m) => {
      if (h.value && e.onTabScroll) {
        e.onTabScroll({
          direction: y > m ? "left" : "right"
        });
      }
    });
    const [$, w] = wt(0, (y, m) => {
      if (!h.value && e.onTabScroll) {
        e.onTabScroll({
          direction: y > m ? "top" : "bottom"
        });
      }
    });
    const [C, A] = N(0);
    const [L, M] = N(0);
    const [b, x] = N(null);
    const [p, _] = N(null);
    const [I, R] = N(0);
    const [K, J] = N(0);
    const [te, re] = Ca(new Map());
    const B = Ta(o, te);
    const X = D(() => `${r.value}-nav-operations-hidden`);
    const T = q(0);
    const Y = q(0);
    ke(() => {
      if (h.value) {
        if (e.rtl) {
          T.value = 0;
          Y.value = Math.max(0, C.value - b.value);
        } else {
          T.value = Math.min(0, b.value - C.value);
          Y.value = 0;
        }
      } else {
        T.value = Math.min(0, p.value - L.value);
        Y.value = 0;
      }
    });
    const U = y => y < T.value ? T.value : y > Y.value ? Y.value : y;
    const ue = q();
    const [j, ve] = N();
    const pe = () => {
      ve(Date.now());
    };
    const me = () => {
      clearTimeout(ue.value);
    };
    const ye = (y, m) => {
      y(P => U(P + m));
    };
    Ia(i, (y, m) => {
      if (h.value) {
        if (b.value >= C.value) {
          return false;
        }
        ye(v, y);
      } else {
        if (p.value >= L.value) {
          return false;
        }
        ye(w, m);
      }
      me();
      pe();
      return true;
    });
    he(j, () => {
      me();
      if (j.value) {
        ue.value = setTimeout(() => {
          ve(0);
        }, 100);
      }
    });
    const be = function (y = e.activeKey) {
      const m = B.value.get(y) || {
        width: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0
      };
      if (h.value) {
        let P = c.value;
        if (e.rtl) {
          if (m.right < c.value) {
            P = m.right;
          } else if (m.right + m.width > c.value + b.value) {
            P = m.right + m.width - b.value;
          }
        } else if (m.left < -c.value) {
          P = -m.left;
        } else if (m.left + m.width > -c.value + b.value) {
          P = -(m.left + m.width - b.value);
        }
        w(0);
        v(U(P));
      } else {
        let P = $.value;
        if (m.top < -$.value) {
          P = -m.top;
        } else if (m.top + m.height > -$.value + p.value) {
          P = -(m.top + m.height - p.value);
        }
        v(0);
        w(U(P));
      }
    };
    const le = q(0);
    const Se = q(0);
    ke(() => {
      let y;
      let m;
      let P;
      let E;
      let O;
      let H;
      const ae = B.value;
      if (["top", "bottom"].includes(e.tabPosition)) {
        y = "width";
        E = b.value;
        O = C.value;
        H = I.value;
        m = e.rtl ? "right" : "left";
        P = Math.abs(c.value);
      } else {
        y = "height";
        E = p.value;
        O = C.value;
        H = K.value;
        m = "top";
        P = -$.value;
      }
      let F = E;
      if (O + H > E && O < E) {
        F = E - H;
      }
      const Q = o.value;
      if (!Q.length) {
        return [le.value, Se.value] = [0, 0];
      }
      const ne = Q.length;
      let ge = ne;
      for (let Z = 0; Z < ne; Z += 1) {
        const se = ae.get(Q[Z].key) || Tt;
        if (se[m] + se[y] > P + F) {
          ge = Z - 1;
          break;
        }
      }
      let W = 0;
      for (let Z = ne - 1; Z >= 0; Z -= 1) {
        if ((ae.get(Q[Z].key) || Tt)[m] < P) {
          W = Z + 1;
          break;
        }
      }
      return [le.value, Se.value] = [W, ge];
    });
    const $e = () => {
      re(() => {
        var y;
        const m = new Map();
        const P = (y = d.value) === null || y === undefined ? undefined : y.getBoundingClientRect();
        o.value.forEach(E => {
          let {
            key: O
          } = E;
          const H = S.value.get(O);
          const ae = (H == null ? undefined : H.$el) || H;
          if (ae) {
            const [F, Q, ne, ge] = Aa(ae, P);
            m.set(O, {
              width: F,
              height: Q,
              left: ne,
              top: ge
            });
          }
        });
        return m;
      });
    };
    he(() => o.value.map(y => y.key).join("%%"), () => {
      $e();
    }, {
      flush: "post"
    });
    const xe = () => {
      const H = i.value?.offsetWidth || 0;
      const ae = i.value?.offsetHeight || 0;
      const F = u.value?.$el || {};
      const Q = F.offsetWidth || 0;
      const ne = F.offsetHeight || 0;
      x(H);
      _(ae);
      R(Q);
      J(ne);
      const ge = (d.value?.offsetWidth || 0) - Q;
      const W = (d.value?.offsetHeight || 0) - ne;
      A(ge);
      M(W);
      $e();
    };
    const Ce = D(() => [...o.value.slice(0, le.value), ...o.value.slice(Se.value + 1)]);
    const [Gt, Kt] = N();
    const fe = D(() => B.value.get(e.activeKey));
    const ut = q();
    const vt = () => {
      Re.cancel(ut.value);
    };
    he([fe, h, () => e.rtl], () => {
      const y = {};
      if (fe.value) {
        if (h.value) {
          if (e.rtl) {
            y.right = Pe(fe.value.right);
          } else {
            y.left = Pe(fe.value.left);
          }
          y.width = Pe(fe.value.width);
        } else {
          y.top = Pe(fe.value.top);
          y.height = Pe(fe.value.height);
        }
      }
      vt();
      ut.value = Re(() => {
        Kt(y);
      });
    });
    he([() => e.activeKey, fe, B, h], () => {
      be();
    }, {
      flush: "post"
    });
    he([() => e.rtl, () => e.tabBarGutter, () => e.activeKey, () => o.value], () => {
      xe();
    }, {
      flush: "post"
    });
    const Xe = y => {
      let {
        position: m,
        prefixCls: P,
        extra: E
      } = y;
      if (!E) {
        return null;
      }
      const O = E == null ? undefined : E({
        position: m
      });
      if (O) {
        return s("div", {
          class: `${P}-extra-content`
        }, [O]);
      } else {
        return null;
      }
    };
    nt(() => {
      me();
      vt();
    });
    return () => {
      const {
        id: y,
        animated: m,
        activeKey: P,
        rtl: E,
        editable: O,
        locale: H,
        tabPosition: ae,
        tabBarGutter: F,
        onTabClick: Q
      } = e;
      const {
        class: ne,
        style: ge
      } = a;
      const W = r.value;
      const Z = !!Ce.value.length;
      const se = `${W}-nav-wrap`;
      let je;
      let Fe;
      let pt;
      let bt;
      if (h.value) {
        if (E) {
          Fe = c.value > 0;
          je = c.value + b.value < C.value;
        } else {
          je = c.value < 0;
          Fe = -c.value + b.value < C.value;
        }
      } else {
        pt = $.value < 0;
        bt = -$.value + p.value < L.value;
      }
      const He = {};
      if (ae === "top" || ae === "bottom") {
        He[E ? "marginRight" : "marginLeft"] = typeof F == "number" ? `${F}px` : F;
      } else {
        He.marginTop = typeof F == "number" ? `${F}px` : F;
      }
      const ft = o.value.map((qe, Xt) => {
        const {
          key: _e
        } = qe;
        return s(wa, {
          id: y,
          prefixCls: W,
          key: _e,
          tab: qe,
          style: Xt === 0 ? undefined : He,
          closable: qe.closable,
          editable: O,
          active: _e === P,
          removeAriaLabel: H == null ? undefined : H.removeAriaLabel,
          ref: f(_e),
          onClick: jt => {
            Q(_e, jt);
          },
          onFocus: () => {
            be(_e);
            pe();
            if (i.value) {
              if (!E) {
                i.value.scrollLeft = 0;
              }
              i.value.scrollTop = 0;
            }
          }
        }, n);
      });
      return s("div", {
        role: "tablist",
        class: G(`${W}-nav`, ne),
        style: ge,
        onKeydown: () => {
          pe();
        }
      }, [s(Xe, {
        position: "left",
        prefixCls: W,
        extra: n.leftExtra
      }, null), s(ht, {
        onResize: xe
      }, {
        default: () => [s("div", {
          class: G(se, {
            [`${se}-ping-left`]: je,
            [`${se}-ping-right`]: Fe,
            [`${se}-ping-top`]: pt,
            [`${se}-ping-bottom`]: bt
          }),
          ref: i
        }, [s(ht, {
          onResize: xe
        }, {
          default: () => [s("div", {
            ref: d,
            class: `${W}-nav-list`,
            style: {
              transform: `translate(${c.value}px, ${$.value}px)`,
              transition: j.value ? "none" : undefined
            }
          }, [ft, s(Mt, {
            ref: u,
            prefixCls: W,
            locale: H,
            editable: O,
            style: l(l({}, ft.length === 0 ? undefined : He), {
              visibility: Z ? "hidden" : null
            })
          }, null), s("div", {
            class: G(`${W}-ink-bar`, {
              [`${W}-ink-bar-animated`]: m.inkBar
            }),
            style: Gt.value
          }, null)])]
        })])]
      }), s(Pa, k(k({}, e), {}, {
        removeAriaLabel: H == null ? undefined : H.removeAriaLabel,
        ref: g,
        prefixCls: W,
        tabs: Ce.value,
        class: !Z && X.value
      }), Lt(n, ["moreIcon"])), s(Xe, {
        position: "right",
        prefixCls: W,
        extra: n.rightExtra
      }, null), s(Xe, {
        position: "right",
        prefixCls: W,
        extra: n.tabBarExtraContent
      }, null)]);
    };
  }
});
const La = z({
  compatConfig: {
    MODE: 3
  },
  name: "TabPanelList",
  inheritAttrs: false,
  props: {
    activeKey: {
      type: [String, Number]
    },
    id: {
      type: String
    },
    rtl: {
      type: Boolean
    },
    animated: {
      type: Object,
      default: undefined
    },
    tabPosition: {
      type: String
    },
    destroyInactiveTabPane: {
      type: Boolean
    }
  },
  setup(e) {
    const {
      tabs: t,
      prefixCls: a
    } = Dt();
    return () => {
      const {
        id: n,
        activeKey: o,
        animated: r,
        tabPosition: i,
        rtl: d,
        destroyInactiveTabPane: g
      } = e;
      const u = r.tabPane;
      const f = a.value;
      const S = t.value.findIndex(h => h.key === o);
      return s("div", {
        class: `${f}-content-holder`
      }, [s("div", {
        class: [`${f}-content`, `${f}-content-${i}`, {
          [`${f}-content-animated`]: u
        }],
        style: S && u ? {
          [d ? "marginRight" : "marginLeft"]: `-${S}00%`
        } : null
      }, [t.value.map(h => Yt(h.node, {
        key: h.key,
        prefixCls: f,
        tabKey: h.key,
        id: n,
        animated: u,
        active: h.key === o,
        destroyInactiveTabPane: g
      }))])]);
    };
  }
});
var Ma = {
  icon: {
    tag: "svg",
    attrs: {
      viewBox: "64 64 896 896",
      focusable: "false"
    },
    children: [{
      tag: "path",
      attrs: {
        d: "M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z"
      }
    }, {
      tag: "path",
      attrs: {
        d: "M192 474h672q8 0 8 8v60q0 8-8 8H160q-8 0-8-8v-60q0-8 8-8z"
      }
    }]
  },
  name: "plus",
  theme: "outlined"
};
function Pt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var a = arguments[t] != null ? Object(arguments[t]) : {};
    var n = Object.keys(a);
    if (typeof Object.getOwnPropertySymbols == "function") {
      n = n.concat(Object.getOwnPropertySymbols(a).filter(function (o) {
        return Object.getOwnPropertyDescriptor(a, o).enumerable;
      }));
    }
    n.forEach(function (o) {
      Ha(e, o, a[o]);
    });
  }
  return e;
}
function Ha(e, t, a) {
  if (t in e) {
    Object.defineProperty(e, t, {
      value: a,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    e[t] = a;
  }
  return e;
}
function dt(t, a) {
  var n = Pt({}, t, a.attrs);
  return s(Ut, Pt({}, n, {
    icon: Ma
  }), null);
}
dt.displayName = "PlusOutlined";
dt.inheritAttrs = false;
const Da = e => {
  const {
    componentCls: t,
    motionDurationSlow: a
  } = e;
  return [{
    [t]: {
      [`${t}-switch`]: {
        "&-appear, &-enter": {
          transition: "none",
          "&-start": {
            opacity: 0
          },
          "&-active": {
            opacity: 1,
            transition: `opacity ${a}`
          }
        },
        "&-leave": {
          position: "absolute",
          transition: "none",
          inset: 0,
          "&-start": {
            opacity: 1
          },
          "&-active": {
            opacity: 0,
            transition: `opacity ${a}`
          }
        }
      }
    }
  }, [mt(e, "slide-up"), mt(e, "slide-down")]];
};
const za = e => {
  const {
    componentCls: t,
    tabsCardHorizontalPadding: a,
    tabsCardHeadBackground: n,
    tabsCardGutter: o,
    colorSplit: r
  } = e;
  return {
    [`${t}-card`]: {
      [`> ${t}-nav, > div > ${t}-nav`]: {
        [`${t}-tab`]: {
          margin: 0,
          padding: a,
          background: n,
          border: `${e.lineWidth}px ${e.lineType} ${r}`,
          transition: `all ${e.motionDurationSlow} ${e.motionEaseInOut}`
        },
        [`${t}-tab-active`]: {
          color: e.colorPrimary,
          background: e.colorBgContainer
        },
        [`${t}-ink-bar`]: {
          visibility: "hidden"
        }
      },
      [`&${t}-top, &${t}-bottom`]: {
        [`> ${t}-nav, > div > ${t}-nav`]: {
          [`${t}-tab + ${t}-tab`]: {
            marginLeft: {
              _skip_check_: true,
              value: `${o}px`
            }
          }
        }
      },
      [`&${t}-top`]: {
        [`> ${t}-nav, > div > ${t}-nav`]: {
          [`${t}-tab`]: {
            borderRadius: `${e.borderRadiusLG}px ${e.borderRadiusLG}px 0 0`
          },
          [`${t}-tab-active`]: {
            borderBottomColor: e.colorBgContainer
          }
        }
      },
      [`&${t}-bottom`]: {
        [`> ${t}-nav, > div > ${t}-nav`]: {
          [`${t}-tab`]: {
            borderRadius: `0 0 ${e.borderRadiusLG}px ${e.borderRadiusLG}px`
          },
          [`${t}-tab-active`]: {
            borderTopColor: e.colorBgContainer
          }
        }
      },
      [`&${t}-left, &${t}-right`]: {
        [`> ${t}-nav, > div > ${t}-nav`]: {
          [`${t}-tab + ${t}-tab`]: {
            marginTop: `${o}px`
          }
        }
      },
      [`&${t}-left`]: {
        [`> ${t}-nav, > div > ${t}-nav`]: {
          [`${t}-tab`]: {
            borderRadius: {
              _skip_check_: true,
              value: `${e.borderRadiusLG}px 0 0 ${e.borderRadiusLG}px`
            }
          },
          [`${t}-tab-active`]: {
            borderRightColor: {
              _skip_check_: true,
              value: e.colorBgContainer
            }
          }
        }
      },
      [`&${t}-right`]: {
        [`> ${t}-nav, > div > ${t}-nav`]: {
          [`${t}-tab`]: {
            borderRadius: {
              _skip_check_: true,
              value: `0 ${e.borderRadiusLG}px ${e.borderRadiusLG}px 0`
            }
          },
          [`${t}-tab-active`]: {
            borderLeftColor: {
              _skip_check_: true,
              value: e.colorBgContainer
            }
          }
        }
      }
    }
  };
};
const Oa = e => {
  const {
    componentCls: t,
    tabsHoverColor: a,
    dropdownEdgeChildVerticalPadding: n
  } = e;
  return {
    [`${t}-dropdown`]: l(l({}, rt(e)), {
      position: "absolute",
      top: -9999,
      left: {
        _skip_check_: true,
        value: -9999
      },
      zIndex: e.zIndexPopup,
      display: "block",
      "&-hidden": {
        display: "none"
      },
      [`${t}-dropdown-menu`]: {
        maxHeight: e.tabsDropdownHeight,
        margin: 0,
        padding: `${n}px 0`,
        overflowX: "hidden",
        overflowY: "auto",
        textAlign: {
          _skip_check_: true,
          value: "left"
        },
        listStyleType: "none",
        backgroundColor: e.colorBgContainer,
        backgroundClip: "padding-box",
        borderRadius: e.borderRadiusLG,
        outline: "none",
        boxShadow: e.boxShadowSecondary,
        "&-item": l(l({}, lt), {
          display: "flex",
          alignItems: "center",
          minWidth: e.tabsDropdownWidth,
          margin: 0,
          padding: `${e.paddingXXS}px ${e.paddingSM}px`,
          color: e.colorText,
          fontWeight: "normal",
          fontSize: e.fontSize,
          lineHeight: e.lineHeight,
          cursor: "pointer",
          transition: `all ${e.motionDurationSlow}`,
          "> span": {
            flex: 1,
            whiteSpace: "nowrap"
          },
          "&-remove": {
            flex: "none",
            marginLeft: {
              _skip_check_: true,
              value: e.marginSM
            },
            color: e.colorTextDescription,
            fontSize: e.fontSizeSM,
            background: "transparent",
            border: 0,
            cursor: "pointer",
            "&:hover": {
              color: a
            }
          },
          "&:hover": {
            background: e.controlItemBgHover
          },
          "&-disabled": {
            "&, &:hover": {
              color: e.colorTextDisabled,
              background: "transparent",
              cursor: "not-allowed"
            }
          }
        })
      }
    })
  };
};
const ka = e => {
  const {
    componentCls: t,
    margin: a,
    colorSplit: n
  } = e;
  return {
    [`${t}-top, ${t}-bottom`]: {
      flexDirection: "column",
      [`> ${t}-nav, > div > ${t}-nav`]: {
        margin: `0 0 ${a}px 0`,
        "&::before": {
          position: "absolute",
          right: {
            _skip_check_: true,
            value: 0
          },
          left: {
            _skip_check_: true,
            value: 0
          },
          borderBottom: `${e.lineWidth}px ${e.lineType} ${n}`,
          content: "''"
        },
        [`${t}-ink-bar`]: {
          height: e.lineWidthBold,
          "&-animated": {
            transition: `width ${e.motionDurationSlow}, left ${e.motionDurationSlow},
            right ${e.motionDurationSlow}`
          }
        },
        [`${t}-nav-wrap`]: {
          "&::before, &::after": {
            top: 0,
            bottom: 0,
            width: e.controlHeight
          },
          "&::before": {
            left: {
              _skip_check_: true,
              value: 0
            },
            boxShadow: e.boxShadowTabsOverflowLeft
          },
          "&::after": {
            right: {
              _skip_check_: true,
              value: 0
            },
            boxShadow: e.boxShadowTabsOverflowRight
          },
          [`&${t}-nav-wrap-ping-left::before`]: {
            opacity: 1
          },
          [`&${t}-nav-wrap-ping-right::after`]: {
            opacity: 1
          }
        }
      }
    },
    [`${t}-top`]: {
      [`> ${t}-nav,
        > div > ${t}-nav`]: {
        "&::before": {
          bottom: 0
        },
        [`${t}-ink-bar`]: {
          bottom: 0
        }
      }
    },
    [`${t}-bottom`]: {
      [`> ${t}-nav, > div > ${t}-nav`]: {
        order: 1,
        marginTop: `${a}px`,
        marginBottom: 0,
        "&::before": {
          top: 0
        },
        [`${t}-ink-bar`]: {
          top: 0
        }
      },
      [`> ${t}-content-holder, > div > ${t}-content-holder`]: {
        order: 0
      }
    },
    [`${t}-left, ${t}-right`]: {
      [`> ${t}-nav, > div > ${t}-nav`]: {
        flexDirection: "column",
        minWidth: e.controlHeight * 1.25,
        [`${t}-tab`]: {
          padding: `${e.paddingXS}px ${e.paddingLG}px`,
          textAlign: "center"
        },
        [`${t}-tab + ${t}-tab`]: {
          margin: `${e.margin}px 0 0 0`
        },
        [`${t}-nav-wrap`]: {
          flexDirection: "column",
          "&::before, &::after": {
            right: {
              _skip_check_: true,
              value: 0
            },
            left: {
              _skip_check_: true,
              value: 0
            },
            height: e.controlHeight
          },
          "&::before": {
            top: 0,
            boxShadow: e.boxShadowTabsOverflowTop
          },
          "&::after": {
            bottom: 0,
            boxShadow: e.boxShadowTabsOverflowBottom
          },
          [`&${t}-nav-wrap-ping-top::before`]: {
            opacity: 1
          },
          [`&${t}-nav-wrap-ping-bottom::after`]: {
            opacity: 1
          }
        },
        [`${t}-ink-bar`]: {
          width: e.lineWidthBold,
          "&-animated": {
            transition: `height ${e.motionDurationSlow}, top ${e.motionDurationSlow}`
          }
        },
        [`${t}-nav-list, ${t}-nav-operations`]: {
          flex: "1 0 auto",
          flexDirection: "column"
        }
      }
    },
    [`${t}-left`]: {
      [`> ${t}-nav, > div > ${t}-nav`]: {
        [`${t}-ink-bar`]: {
          right: {
            _skip_check_: true,
            value: 0
          }
        }
      },
      [`> ${t}-content-holder, > div > ${t}-content-holder`]: {
        marginLeft: {
          _skip_check_: true,
          value: `-${e.lineWidth}px`
        },
        borderLeft: {
          _skip_check_: true,
          value: `${e.lineWidth}px ${e.lineType} ${e.colorBorder}`
        },
        [`> ${t}-content > ${t}-tabpane`]: {
          paddingLeft: {
            _skip_check_: true,
            value: e.paddingLG
          }
        }
      }
    },
    [`${t}-right`]: {
      [`> ${t}-nav, > div > ${t}-nav`]: {
        order: 1,
        [`${t}-ink-bar`]: {
          left: {
            _skip_check_: true,
            value: 0
          }
        }
      },
      [`> ${t}-content-holder, > div > ${t}-content-holder`]: {
        order: 0,
        marginRight: {
          _skip_check_: true,
          value: -e.lineWidth
        },
        borderRight: {
          _skip_check_: true,
          value: `${e.lineWidth}px ${e.lineType} ${e.colorBorder}`
        },
        [`> ${t}-content > ${t}-tabpane`]: {
          paddingRight: {
            _skip_check_: true,
            value: e.paddingLG
          }
        }
      }
    }
  };
};
const Wa = e => {
  const {
    componentCls: t,
    padding: a
  } = e;
  return {
    [t]: {
      "&-small": {
        [`> ${t}-nav`]: {
          [`${t}-tab`]: {
            padding: `${e.paddingXS}px 0`,
            fontSize: e.fontSize
          }
        }
      },
      "&-large": {
        [`> ${t}-nav`]: {
          [`${t}-tab`]: {
            padding: `${a}px 0`,
            fontSize: e.fontSizeLG
          }
        }
      }
    },
    [`${t}-card`]: {
      [`&${t}-small`]: {
        [`> ${t}-nav`]: {
          [`${t}-tab`]: {
            padding: `${e.paddingXXS * 1.5}px ${a}px`
          }
        },
        [`&${t}-bottom`]: {
          [`> ${t}-nav ${t}-tab`]: {
            borderRadius: `0 0 ${e.borderRadius}px ${e.borderRadius}px`
          }
        },
        [`&${t}-top`]: {
          [`> ${t}-nav ${t}-tab`]: {
            borderRadius: `${e.borderRadius}px ${e.borderRadius}px 0 0`
          }
        },
        [`&${t}-right`]: {
          [`> ${t}-nav ${t}-tab`]: {
            borderRadius: {
              _skip_check_: true,
              value: `0 ${e.borderRadius}px ${e.borderRadius}px 0`
            }
          }
        },
        [`&${t}-left`]: {
          [`> ${t}-nav ${t}-tab`]: {
            borderRadius: {
              _skip_check_: true,
              value: `${e.borderRadius}px 0 0 ${e.borderRadius}px`
            }
          }
        }
      },
      [`&${t}-large`]: {
        [`> ${t}-nav`]: {
          [`${t}-tab`]: {
            padding: `${e.paddingXS}px ${a}px ${e.paddingXXS * 1.5}px`
          }
        }
      }
    }
  };
};
const Na = e => {
  const {
    componentCls: t,
    tabsActiveColor: a,
    tabsHoverColor: n,
    iconCls: o,
    tabsHorizontalGutter: r
  } = e;
  const i = `${t}-tab`;
  return {
    [i]: {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      padding: `${e.paddingSM}px 0`,
      fontSize: `${e.fontSize}px`,
      background: "transparent",
      border: 0,
      outline: "none",
      cursor: "pointer",
      "&-btn, &-remove": l({
        "&:focus:not(:focus-visible), &:active": {
          color: a
        }
      }, It(e)),
      "&-btn": {
        outline: "none",
        transition: "all 0.3s"
      },
      "&-remove": {
        flex: "none",
        marginRight: {
          _skip_check_: true,
          value: -e.marginXXS
        },
        marginLeft: {
          _skip_check_: true,
          value: e.marginXS
        },
        color: e.colorTextDescription,
        fontSize: e.fontSizeSM,
        background: "transparent",
        border: "none",
        outline: "none",
        cursor: "pointer",
        transition: `all ${e.motionDurationSlow}`,
        "&:hover": {
          color: e.colorTextHeading
        }
      },
      "&:hover": {
        color: n
      },
      [`&${i}-active ${i}-btn`]: {
        color: e.colorPrimary,
        textShadow: e.tabsActiveTextShadow
      },
      [`&${i}-disabled`]: {
        color: e.colorTextDisabled,
        cursor: "not-allowed"
      },
      [`&${i}-disabled ${i}-btn, &${i}-disabled ${t}-remove`]: {
        "&:focus, &:active": {
          color: e.colorTextDisabled
        }
      },
      [`& ${i}-remove ${o}`]: {
        margin: 0
      },
      [o]: {
        marginRight: {
          _skip_check_: true,
          value: e.marginSM
        }
      }
    },
    [`${i} + ${i}`]: {
      margin: {
        _skip_check_: true,
        value: `0 0 0 ${r}px`
      }
    }
  };
};
const Ga = e => {
  const {
    componentCls: t,
    tabsHorizontalGutter: a,
    iconCls: n,
    tabsCardGutter: o
  } = e;
  return {
    [`${t}-rtl`]: {
      direction: "rtl",
      [`${t}-nav`]: {
        [`${t}-tab`]: {
          margin: {
            _skip_check_: true,
            value: `0 0 0 ${a}px`
          },
          [`${t}-tab:last-of-type`]: {
            marginLeft: {
              _skip_check_: true,
              value: 0
            }
          },
          [n]: {
            marginRight: {
              _skip_check_: true,
              value: 0
            },
            marginLeft: {
              _skip_check_: true,
              value: `${e.marginSM}px`
            }
          },
          [`${t}-tab-remove`]: {
            marginRight: {
              _skip_check_: true,
              value: `${e.marginXS}px`
            },
            marginLeft: {
              _skip_check_: true,
              value: `-${e.marginXXS}px`
            },
            [n]: {
              margin: 0
            }
          }
        }
      },
      [`&${t}-left`]: {
        [`> ${t}-nav`]: {
          order: 1
        },
        [`> ${t}-content-holder`]: {
          order: 0
        }
      },
      [`&${t}-right`]: {
        [`> ${t}-nav`]: {
          order: 0
        },
        [`> ${t}-content-holder`]: {
          order: 1
        }
      },
      [`&${t}-card${t}-top, &${t}-card${t}-bottom`]: {
        [`> ${t}-nav, > div > ${t}-nav`]: {
          [`${t}-tab + ${t}-tab`]: {
            marginRight: {
              _skip_check_: true,
              value: `${o}px`
            },
            marginLeft: {
              _skip_check_: true,
              value: 0
            }
          }
        }
      }
    },
    [`${t}-dropdown-rtl`]: {
      direction: "rtl"
    },
    [`${t}-menu-item`]: {
      [`${t}-dropdown-rtl`]: {
        textAlign: {
          _skip_check_: true,
          value: "right"
        }
      }
    }
  };
};
const Ka = e => {
  const {
    componentCls: t,
    tabsCardHorizontalPadding: a,
    tabsCardHeight: n,
    tabsCardGutter: o,
    tabsHoverColor: r,
    tabsActiveColor: i,
    colorSplit: d
  } = e;
  return {
    [t]: l(l(l(l({}, rt(e)), {
      display: "flex",
      [`> ${t}-nav, > div > ${t}-nav`]: {
        position: "relative",
        display: "flex",
        flex: "none",
        alignItems: "center",
        [`${t}-nav-wrap`]: {
          position: "relative",
          display: "flex",
          flex: "auto",
          alignSelf: "stretch",
          overflow: "hidden",
          whiteSpace: "nowrap",
          transform: "translate(0)",
          "&::before, &::after": {
            position: "absolute",
            zIndex: 1,
            opacity: 0,
            transition: `opacity ${e.motionDurationSlow}`,
            content: "''",
            pointerEvents: "none"
          }
        },
        [`${t}-nav-list`]: {
          position: "relative",
          display: "flex",
          transition: `opacity ${e.motionDurationSlow}`
        },
        [`${t}-nav-operations`]: {
          display: "flex",
          alignSelf: "stretch"
        },
        [`${t}-nav-operations-hidden`]: {
          position: "absolute",
          visibility: "hidden",
          pointerEvents: "none"
        },
        [`${t}-nav-more`]: {
          position: "relative",
          padding: a,
          background: "transparent",
          border: 0,
          "&::after": {
            position: "absolute",
            right: {
              _skip_check_: true,
              value: 0
            },
            bottom: 0,
            left: {
              _skip_check_: true,
              value: 0
            },
            height: e.controlHeightLG / 8,
            transform: "translateY(100%)",
            content: "''"
          }
        },
        [`${t}-nav-add`]: l({
          minWidth: `${n}px`,
          marginLeft: {
            _skip_check_: true,
            value: `${o}px`
          },
          padding: `0 ${e.paddingXS}px`,
          background: "transparent",
          border: `${e.lineWidth}px ${e.lineType} ${d}`,
          borderRadius: `${e.borderRadiusLG}px ${e.borderRadiusLG}px 0 0`,
          outline: "none",
          cursor: "pointer",
          color: e.colorText,
          transition: `all ${e.motionDurationSlow} ${e.motionEaseInOut}`,
          "&:hover": {
            color: r
          },
          "&:active, &:focus:not(:focus-visible)": {
            color: i
          }
        }, It(e))
      },
      [`${t}-extra-content`]: {
        flex: "none"
      },
      [`${t}-ink-bar`]: {
        position: "absolute",
        background: e.colorPrimary,
        pointerEvents: "none"
      }
    }), Na(e)), {
      [`${t}-content`]: {
        position: "relative",
        display: "flex",
        width: "100%",
        "&-animated": {
          transition: "margin 0.3s"
        }
      },
      [`${t}-content-holder`]: {
        flex: "auto",
        minWidth: 0,
        minHeight: 0
      },
      [`${t}-tabpane`]: {
        outline: "none",
        flex: "none",
        width: "100%"
      }
    }),
    [`${t}-centered`]: {
      [`> ${t}-nav, > div > ${t}-nav`]: {
        [`${t}-nav-wrap`]: {
          [`&:not([class*='${t}-nav-wrap-ping'])`]: {
            justifyContent: "center"
          }
        }
      }
    }
  };
};
const Xa = ot("Tabs", e => {
  const t = e.controlHeightLG;
  const a = it(e, {
    tabsHoverColor: e.colorPrimaryHover,
    tabsActiveColor: e.colorPrimaryActive,
    tabsCardHorizontalPadding: `${(t - Math.round(e.fontSize * e.lineHeight)) / 2 - e.lineWidth}px ${e.padding}px`,
    tabsCardHeight: t,
    tabsCardGutter: e.marginXXS / 2,
    tabsHorizontalGutter: 32,
    tabsCardHeadBackground: e.colorFillAlter,
    dropdownEdgeChildVerticalPadding: e.paddingXXS,
    tabsActiveTextShadow: "0 0 0.25px currentcolor",
    tabsDropdownHeight: 200,
    tabsDropdownWidth: 120
  });
  return [Wa(a), Ga(a), ka(a), Oa(a), za(a), Ka(a), Da(a)];
}, e => ({
  zIndexPopup: e.zIndexPopupBase + 50
}));
let Bt = 0;
const zt = () => ({
  prefixCls: {
    type: String
  },
  id: {
    type: String
  },
  popupClassName: String,
  getPopupContainer: ee(),
  activeKey: {
    type: [String, Number]
  },
  defaultActiveKey: {
    type: [String, Number]
  },
  direction: De(),
  animated: na([Boolean, Object]),
  renderTabBar: ee(),
  tabBarGutter: {
    type: Number
  },
  tabBarStyle: Ie(),
  tabPosition: De(),
  destroyInactiveTabPane: aa(),
  hideAdd: Boolean,
  type: De(),
  size: De(),
  centered: Boolean,
  onEdit: ee(),
  onChange: ee(),
  onTabClick: ee(),
  onTabScroll: ee(),
  "onUpdate:activeKey": ee(),
  locale: Ie(),
  onPrevClick: ee(),
  onNextClick: ee(),
  tabBarExtraContent: de.any
});
function ja(e) {
  return e.map(t => {
    if (Zt(t)) {
      const a = l({}, t.props || {});
      for (const [h, c] of Object.entries(a)) {
        delete a[h];
        a[Jt(h)] = c;
      }
      const n = t.children || {};
      const o = t.key !== undefined ? t.key : undefined;
      const {
        tab: r = n.tab,
        disabled: i,
        forceRender: d,
        closable: g,
        animated: u,
        active: f,
        destroyInactiveTabPane: S
      } = a;
      return l(l({
        key: o
      }, a), {
        node: t,
        closeIcon: n.closeIcon,
        tab: r,
        disabled: i === "" || i,
        forceRender: d === "" || d,
        closable: g === "" || g,
        animated: u === "" || u,
        active: f === "" || f,
        destroyInactiveTabPane: S === "" || S
      });
    }
    return null;
  }).filter(t => t);
}
const Fa = z({
  compatConfig: {
    MODE: 3
  },
  name: "InternalTabs",
  inheritAttrs: false,
  props: l(l({}, Ae(zt(), {
    tabPosition: "top",
    animated: {
      inkBar: true,
      tabPane: false
    }
  })), {
    tabs: ta()
  }),
  slots: Object,
  setup(e, t) {
    let {
      attrs: a,
      slots: n
    } = t;
    ze(e.onPrevClick === undefined && e.onNextClick === undefined, "Tabs", "`onPrevClick / @prevClick` and `onNextClick / @nextClick` has been removed. Please use `onTabScroll / @tabScroll` instead.");
    ze(e.tabBarExtraContent === undefined, "Tabs", "`tabBarExtraContent` prop has been removed. Please use `rightExtra` slot instead.");
    ze(n.tabBarExtraContent === undefined, "Tabs", "`tabBarExtraContent` slot is deprecated. Please use `rightExtra` slot instead.");
    const {
      prefixCls: o,
      direction: r,
      size: i,
      rootPrefixCls: d,
      getPopupContainer: g
    } = ce("tabs", e);
    const [u, f] = Xa(o);
    const S = D(() => r.value === "rtl");
    const h = D(() => {
      const {
        animated: p,
        tabPosition: _
      } = e;
      if (p === false || ["left", "right"].includes(_)) {
        return {
          inkBar: false,
          tabPane: false
        };
      } else if (p === true) {
        return {
          inkBar: true,
          tabPane: true
        };
      } else {
        return l({
          inkBar: true,
          tabPane: false
        }, typeof p == "object" ? p : {});
      }
    });
    const [c, v] = N(false);
    We(() => {
      v(Qt());
    });
    const [$, w] = $t(() => {
      return e.tabs[0]?.key;
    }, {
      value: D(() => e.activeKey),
      defaultValue: e.defaultActiveKey
    });
    const [C, A] = N(() => e.tabs.findIndex(p => p.key === $.value));
    ke(() => {
      let _ = e.tabs.findIndex(I => I.key === $.value);
      if (_ === -1) {
        _ = Math.max(0, Math.min(C.value, e.tabs.length - 1));
        w(e.tabs[_]?.key);
      }
      A(_);
    });
    const [L, M] = $t(null, {
      value: D(() => e.id)
    });
    const b = D(() => c.value && !["left", "right"].includes(e.tabPosition) ? "top" : e.tabPosition);
    We(() => {
      if (!e.id) {
        M(`rc-tabs-${Bt}`);
        Bt += 1;
      }
    });
    const x = (p, _) => {
      var I;
      var R;
      if ((I = e.onTabClick) !== null && I !== undefined) {
        I.call(e, p, _);
      }
      const K = p !== $.value;
      w(p);
      if (K) {
        if ((R = e.onChange) !== null && R !== undefined) {
          R.call(e, p);
        }
      }
    };
    Ba({
      tabs: D(() => e.tabs),
      prefixCls: o
    });
    return () => {
      const {
        id: p,
        type: _,
        tabBarGutter: I,
        tabBarStyle: R,
        locale: K,
        destroyInactiveTabPane: J,
        renderTabBar: te = n.renderTabBar,
        onTabScroll: re,
        hideAdd: B,
        centered: X
      } = e;
      const T = {
        id: L.value,
        activeKey: $.value,
        animated: h.value,
        tabPosition: b.value,
        rtl: S.value,
        mobile: c.value
      };
      let Y;
      if (_ === "editable-card") {
        Y = {
          onEdit: (ve, pe) => {
            let {
              key: me,
              event: ye
            } = pe;
            var be;
            if ((be = e.onEdit) !== null && be !== undefined) {
              be.call(e, ve === "add" ? ye : me, ve);
            }
          },
          removeIcon: () => s(ea, null, null),
          addIcon: n.addIcon ? n.addIcon : () => s(dt, null, null),
          showAdd: B !== true
        };
      }
      let U;
      const ue = l(l({}, T), {
        moreTransitionName: `${d.value}-slide-up`,
        editable: Y,
        locale: K,
        tabBarGutter: I,
        onTabClick: x,
        onTabScroll: re,
        style: R,
        getPopupContainer: g.value,
        popupClassName: G(e.popupClassName, f.value)
      });
      if (te) {
        U = te(l(l({}, ue), {
          DefaultTabBar: _t
        }));
      } else {
        U = s(_t, ue, Lt(n, ["moreIcon", "leftExtra", "rightExtra", "tabBarExtraContent"]));
      }
      const j = o.value;
      return u(s("div", k(k({}, a), {}, {
        id: p,
        class: G(j, `${j}-${b.value}`, {
          [f.value]: true,
          [`${j}-${i.value}`]: i.value,
          [`${j}-card`]: ["card", "editable-card"].includes(_),
          [`${j}-editable-card`]: _ === "editable-card",
          [`${j}-centered`]: X,
          [`${j}-mobile`]: c.value,
          [`${j}-editable`]: _ === "editable-card",
          [`${j}-rtl`]: S.value
        }, a.class)
      }), [U, s(La, k(k({
        destroyInactiveTabPane: J
      }, T), {}, {
        animated: h.value
      }), null)]));
    };
  }
});
const we = z({
  compatConfig: {
    MODE: 3
  },
  name: "ATabs",
  inheritAttrs: false,
  props: Ae(zt(), {
    tabPosition: "top",
    animated: {
      inkBar: true,
      tabPane: false
    }
  }),
  slots: Object,
  setup(e, t) {
    let {
      attrs: a,
      slots: n,
      emit: o
    } = t;
    const r = i => {
      o("update:activeKey", i);
      o("change", i);
    };
    return () => {
      var i;
      const d = ja(Et((i = n.default) === null || i === undefined ? undefined : i.call(n)));
      return s(Fa, k(k(k({}, st(e, ["onUpdate:activeKey"])), a), {}, {
        onChange: r,
        tabs: d
      }), n);
    };
  }
});
const qa = () => ({
  tab: de.any,
  disabled: {
    type: Boolean
  },
  forceRender: {
    type: Boolean
  },
  closable: {
    type: Boolean
  },
  animated: {
    type: Boolean
  },
  active: {
    type: Boolean
  },
  destroyInactiveTabPane: {
    type: Boolean
  },
  prefixCls: {
    type: String
  },
  tabKey: {
    type: [String, Number]
  },
  id: {
    type: String
  }
});
const et = z({
  compatConfig: {
    MODE: 3
  },
  name: "ATabPane",
  inheritAttrs: false,
  __ANT_TAB_PANE: true,
  props: qa(),
  slots: Object,
  setup(e, t) {
    let {
      attrs: a,
      slots: n
    } = t;
    const o = ie(e.forceRender);
    he([() => e.active, () => e.destroyInactiveTabPane], () => {
      if (e.active) {
        o.value = true;
      } else if (e.destroyInactiveTabPane) {
        o.value = false;
      }
    }, {
      immediate: true
    });
    const r = D(() => e.active ? {} : e.animated ? {
      visibility: "hidden",
      height: 0,
      overflowY: "hidden"
    } : {
      display: "none"
    });
    return () => {
      var i;
      const {
        prefixCls: d,
        forceRender: g,
        id: u,
        active: f,
        tabKey: S
      } = e;
      return s("div", {
        id: u && `${u}-panel-${S}`,
        role: "tabpanel",
        tabindex: f ? 0 : -1,
        "aria-labelledby": u && `${u}-tab-${S}`,
        "aria-hidden": !f,
        style: [r.value, a.style],
        class: [`${d}-tabpane`, f && `${d}-tabpane-active`, a.class]
      }, [(f || o.value || g) && ((i = n.default) === null || i === undefined ? undefined : i.call(n))]);
    };
  }
});
we.TabPane = et;
we.install = function (e) {
  e.component(we.name, we);
  e.component(et.name, et);
  return e;
};
const Va = e => {
  const {
    antCls: t,
    componentCls: a,
    cardHeadHeight: n,
    cardPaddingBase: o,
    cardHeadTabsMarginBottom: r
  } = e;
  return l(l({
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    minHeight: n,
    marginBottom: -1,
    padding: `0 ${o}px`,
    color: e.colorTextHeading,
    fontWeight: e.fontWeightStrong,
    fontSize: e.fontSizeLG,
    background: "transparent",
    borderBottom: `${e.lineWidth}px ${e.lineType} ${e.colorBorderSecondary}`,
    borderRadius: `${e.borderRadiusLG}px ${e.borderRadiusLG}px 0 0`
  }, Ne()), {
    "&-wrapper": {
      width: "100%",
      display: "flex",
      alignItems: "center"
    },
    "&-title": l(l({
      display: "inline-block",
      flex: 1
    }, lt), {
      [`
          > ${a}-typography,
          > ${a}-typography-edit-content
        `]: {
        insetInlineStart: 0,
        marginTop: 0,
        marginBottom: 0
      }
    }),
    [`${t}-tabs-top`]: {
      clear: "both",
      marginBottom: r,
      color: e.colorText,
      fontWeight: "normal",
      fontSize: e.fontSize,
      "&-bar": {
        borderBottom: `${e.lineWidth}px ${e.lineType} ${e.colorBorderSecondary}`
      }
    }
  });
};
const Ya = e => {
  const {
    cardPaddingBase: t,
    colorBorderSecondary: a,
    cardShadow: n,
    lineWidth: o
  } = e;
  return {
    width: "33.33%",
    padding: t,
    border: 0,
    borderRadius: 0,
    boxShadow: `
      ${o}px 0 0 0 ${a},
      0 ${o}px 0 0 ${a},
      ${o}px ${o}px 0 0 ${a},
      ${o}px 0 0 0 ${a} inset,
      0 ${o}px 0 0 ${a} inset;
    `,
    transition: `all ${e.motionDurationMid}`,
    "&-hoverable:hover": {
      position: "relative",
      zIndex: 1,
      boxShadow: n
    }
  };
};
const Ua = e => {
  const {
    componentCls: t,
    iconCls: a,
    cardActionsLiMargin: n,
    cardActionsIconSize: o,
    colorBorderSecondary: r
  } = e;
  return l(l({
    margin: 0,
    padding: 0,
    listStyle: "none",
    background: e.colorBgContainer,
    borderTop: `${e.lineWidth}px ${e.lineType} ${r}`,
    display: "flex",
    borderRadius: `0 0 ${e.borderRadiusLG}px ${e.borderRadiusLG}px `
  }, Ne()), {
    "& > li": {
      margin: n,
      color: e.colorTextDescription,
      textAlign: "center",
      "> span": {
        position: "relative",
        display: "block",
        minWidth: e.cardActionsIconSize * 2,
        fontSize: e.fontSize,
        lineHeight: e.lineHeight,
        cursor: "pointer",
        "&:hover": {
          color: e.colorPrimary,
          transition: `color ${e.motionDurationMid}`
        },
        [`a:not(${t}-btn), > ${a}`]: {
          display: "inline-block",
          width: "100%",
          color: e.colorTextDescription,
          lineHeight: `${e.fontSize * e.lineHeight}px`,
          transition: `color ${e.motionDurationMid}`,
          "&:hover": {
            color: e.colorPrimary
          }
        },
        [`> ${a}`]: {
          fontSize: o,
          lineHeight: `${o * e.lineHeight}px`
        }
      },
      "&:not(:last-child)": {
        borderInlineEnd: `${e.lineWidth}px ${e.lineType} ${r}`
      }
    }
  });
};
const Za = e => l(l({
  margin: `-${e.marginXXS}px 0`,
  display: "flex"
}, Ne()), {
  "&-avatar": {
    paddingInlineEnd: e.padding
  },
  "&-detail": {
    overflow: "hidden",
    flex: 1,
    "> div:not(:last-child)": {
      marginBottom: e.marginXS
    }
  },
  "&-title": l({
    color: e.colorTextHeading,
    fontWeight: e.fontWeightStrong,
    fontSize: e.fontSizeLG
  }, lt),
  "&-description": {
    color: e.colorTextDescription
  }
});
const Ja = e => {
  const {
    componentCls: t,
    cardPaddingBase: a,
    colorFillAlter: n
  } = e;
  return {
    [`${t}-head`]: {
      padding: `0 ${a}px`,
      background: n,
      "&-title": {
        fontSize: e.fontSize
      }
    },
    [`${t}-body`]: {
      padding: `${e.padding}px ${a}px`
    }
  };
};
const Qa = e => {
  const {
    componentCls: t
  } = e;
  return {
    overflow: "hidden",
    [`${t}-body`]: {
      userSelect: "none"
    }
  };
};
const en = e => {
  const {
    componentCls: t,
    cardShadow: a,
    cardHeadPadding: n,
    colorBorderSecondary: o,
    boxShadow: r,
    cardPaddingBase: i
  } = e;
  return {
    [t]: l(l({}, rt(e)), {
      position: "relative",
      background: e.colorBgContainer,
      borderRadius: e.borderRadiusLG,
      [`&:not(${t}-bordered)`]: {
        boxShadow: r
      },
      [`${t}-head`]: Va(e),
      [`${t}-extra`]: {
        marginInlineStart: "auto",
        color: "",
        fontWeight: "normal",
        fontSize: e.fontSize
      },
      [`${t}-body`]: l({
        padding: i,
        borderRadius: ` 0 0 ${e.borderRadiusLG}px ${e.borderRadiusLG}px`
      }, Ne()),
      [`${t}-grid`]: Ya(e),
      [`${t}-cover`]: {
        "> *": {
          display: "block",
          width: "100%"
        },
        img: {
          borderRadius: `${e.borderRadiusLG}px ${e.borderRadiusLG}px 0 0`
        }
      },
      [`${t}-actions`]: Ua(e),
      [`${t}-meta`]: Za(e)
    }),
    [`${t}-bordered`]: {
      border: `${e.lineWidth}px ${e.lineType} ${o}`,
      [`${t}-cover`]: {
        marginTop: -1,
        marginInlineStart: -1,
        marginInlineEnd: -1
      }
    },
    [`${t}-hoverable`]: {
      cursor: "pointer",
      transition: `box-shadow ${e.motionDurationMid}, border-color ${e.motionDurationMid}`,
      "&:hover": {
        borderColor: "transparent",
        boxShadow: a
      }
    },
    [`${t}-contain-grid`]: {
      [`${t}-body`]: {
        display: "flex",
        flexWrap: "wrap"
      },
      [`&:not(${t}-loading) ${t}-body`]: {
        marginBlockStart: -e.lineWidth,
        marginInlineStart: -e.lineWidth,
        padding: 0
      }
    },
    [`${t}-contain-tabs`]: {
      [`> ${t}-head`]: {
        [`${t}-head-title, ${t}-extra`]: {
          paddingTop: n
        }
      }
    },
    [`${t}-type-inner`]: Ja(e),
    [`${t}-loading`]: Qa(e),
    [`${t}-rtl`]: {
      direction: "rtl"
    }
  };
};
const tn = e => {
  const {
    componentCls: t,
    cardPaddingSM: a,
    cardHeadHeightSM: n
  } = e;
  return {
    [`${t}-small`]: {
      [`> ${t}-head`]: {
        minHeight: n,
        padding: `0 ${a}px`,
        fontSize: e.fontSize,
        [`> ${t}-head-wrapper`]: {
          [`> ${t}-extra`]: {
            fontSize: e.fontSize
          }
        }
      },
      [`> ${t}-body`]: {
        padding: a
      }
    },
    [`${t}-small${t}-contain-tabs`]: {
      [`> ${t}-head`]: {
        [`${t}-head-title, ${t}-extra`]: {
          minHeight: n,
          paddingTop: 0,
          display: "flex",
          alignItems: "center"
        }
      }
    }
  };
};
const an = ot("Card", e => {
  const t = it(e, {
    cardShadow: e.boxShadowCard,
    cardHeadHeight: e.fontSizeLG * e.lineHeightLG + e.padding * 2,
    cardHeadHeightSM: e.fontSize * e.lineHeight + e.paddingXS * 2,
    cardHeadPadding: e.padding,
    cardPaddingBase: e.paddingLG,
    cardHeadTabsMarginBottom: -e.padding - e.lineWidth,
    cardActionsLiMargin: `${e.paddingSM}px 0`,
    cardActionsIconSize: e.fontSize,
    cardPaddingSM: 12
  });
  return [en(t), tn(t)];
});
const nn = () => ({
  prefixCls: String,
  width: {
    type: [Number, String]
  }
});
const ct = z({
  compatConfig: {
    MODE: 3
  },
  name: "SkeletonTitle",
  props: nn(),
  setup(e) {
    return () => {
      const {
        prefixCls: t,
        width: a
      } = e;
      const n = typeof a == "number" ? `${a}px` : a;
      return s("h3", {
        class: t,
        style: {
          width: n
        }
      }, null);
    };
  }
});
const on = () => ({
  prefixCls: String,
  width: {
    type: [Number, String, Array]
  },
  rows: Number
});
const rn = z({
  compatConfig: {
    MODE: 3
  },
  name: "SkeletonParagraph",
  props: on(),
  setup(e) {
    const t = a => {
      const {
        width: n,
        rows: o = 2
      } = e;
      if (Array.isArray(n)) {
        return n[a];
      }
      if (o - 1 === a) {
        return n;
      }
    };
    return () => {
      const {
        prefixCls: a,
        rows: n
      } = e;
      const o = [...Array(n)].map((r, i) => {
        const d = t(i);
        return s("li", {
          key: i,
          style: {
            width: typeof d == "number" ? `${d}px` : d
          }
        }, null);
      });
      return s("ul", {
        class: a
      }, [o]);
    };
  }
});
const Ge = () => ({
  prefixCls: String,
  size: [String, Number],
  shape: String,
  active: {
    type: Boolean,
    default: undefined
  }
});
const Le = e => {
  const {
    prefixCls: t,
    size: a,
    shape: n
  } = e;
  const o = G({
    [`${t}-lg`]: a === "large",
    [`${t}-sm`]: a === "small"
  });
  const r = G({
    [`${t}-circle`]: n === "circle",
    [`${t}-square`]: n === "square",
    [`${t}-round`]: n === "round"
  });
  const i = typeof a == "number" ? {
    width: `${a}px`,
    height: `${a}px`,
    lineHeight: `${a}px`
  } : {};
  return s("span", {
    class: G(t, o, r),
    style: i
  }, null);
};
Le.displayName = "SkeletonElement";
const ln = new oa("ant-skeleton-loading", {
  "0%": {
    transform: "translateX(-37.5%)"
  },
  "100%": {
    transform: "translateX(37.5%)"
  }
});
const Ke = e => ({
  height: e,
  lineHeight: `${e}px`
});
const Te = e => l({
  width: e
}, Ke(e));
const sn = e => ({
  position: "relative",
  zIndex: 0,
  overflow: "hidden",
  background: "transparent",
  "&::after": {
    position: "absolute",
    top: 0,
    insetInlineEnd: "-150%",
    bottom: 0,
    insetInlineStart: "-150%",
    background: e.skeletonLoadingBackground,
    animationName: ln,
    animationDuration: e.skeletonLoadingMotionDuration,
    animationTimingFunction: "ease",
    animationIterationCount: "infinite",
    content: "\"\""
  }
});
const Ue = e => l({
  width: e * 5,
  minWidth: e * 5
}, Ke(e));
const dn = e => {
  const {
    skeletonAvatarCls: t,
    color: a,
    controlHeight: n,
    controlHeightLG: o,
    controlHeightSM: r
  } = e;
  return {
    [`${t}`]: l({
      display: "inline-block",
      verticalAlign: "top",
      background: a
    }, Te(n)),
    [`${t}${t}-circle`]: {
      borderRadius: "50%"
    },
    [`${t}${t}-lg`]: l({}, Te(o)),
    [`${t}${t}-sm`]: l({}, Te(r))
  };
};
const cn = e => {
  const {
    controlHeight: t,
    borderRadiusSM: a,
    skeletonInputCls: n,
    controlHeightLG: o,
    controlHeightSM: r,
    color: i
  } = e;
  return {
    [`${n}`]: l({
      display: "inline-block",
      verticalAlign: "top",
      background: i,
      borderRadius: a
    }, Ue(t)),
    [`${n}-lg`]: l({}, Ue(o)),
    [`${n}-sm`]: l({}, Ue(r))
  };
};
const Rt = e => l({
  width: e
}, Ke(e));
const un = e => {
  const {
    skeletonImageCls: t,
    imageSizeBase: a,
    color: n,
    borderRadiusSM: o
  } = e;
  return {
    [`${t}`]: l(l({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      verticalAlign: "top",
      background: n,
      borderRadius: o
    }, Rt(a * 2)), {
      [`${t}-path`]: {
        fill: "#bfbfbf"
      },
      [`${t}-svg`]: l(l({}, Rt(a)), {
        maxWidth: a * 4,
        maxHeight: a * 4
      }),
      [`${t}-svg${t}-svg-circle`]: {
        borderRadius: "50%"
      }
    }),
    [`${t}${t}-circle`]: {
      borderRadius: "50%"
    }
  };
};
const Ze = (e, t, a) => {
  const {
    skeletonButtonCls: n
  } = e;
  return {
    [`${a}${n}-circle`]: {
      width: t,
      minWidth: t,
      borderRadius: "50%"
    },
    [`${a}${n}-round`]: {
      borderRadius: t
    }
  };
};
const Je = e => l({
  width: e * 2,
  minWidth: e * 2
}, Ke(e));
const vn = e => {
  const {
    borderRadiusSM: t,
    skeletonButtonCls: a,
    controlHeight: n,
    controlHeightLG: o,
    controlHeightSM: r,
    color: i
  } = e;
  return l(l(l(l(l({
    [`${a}`]: l({
      display: "inline-block",
      verticalAlign: "top",
      background: i,
      borderRadius: t,
      width: n * 2,
      minWidth: n * 2
    }, Je(n))
  }, Ze(e, n, a)), {
    [`${a}-lg`]: l({}, Je(o))
  }), Ze(e, o, `${a}-lg`)), {
    [`${a}-sm`]: l({}, Je(r))
  }), Ze(e, r, `${a}-sm`));
};
const pn = e => {
  const {
    componentCls: t,
    skeletonAvatarCls: a,
    skeletonTitleCls: n,
    skeletonParagraphCls: o,
    skeletonButtonCls: r,
    skeletonInputCls: i,
    skeletonImageCls: d,
    controlHeight: g,
    controlHeightLG: u,
    controlHeightSM: f,
    color: S,
    padding: h,
    marginSM: c,
    borderRadius: v,
    skeletonTitleHeight: $,
    skeletonBlockRadius: w,
    skeletonParagraphLineHeight: C,
    controlHeightXS: A,
    skeletonParagraphMarginTop: L
  } = e;
  return {
    [`${t}`]: {
      display: "table",
      width: "100%",
      [`${t}-header`]: {
        display: "table-cell",
        paddingInlineEnd: h,
        verticalAlign: "top",
        [`${a}`]: l({
          display: "inline-block",
          verticalAlign: "top",
          background: S
        }, Te(g)),
        [`${a}-circle`]: {
          borderRadius: "50%"
        },
        [`${a}-lg`]: l({}, Te(u)),
        [`${a}-sm`]: l({}, Te(f))
      },
      [`${t}-content`]: {
        display: "table-cell",
        width: "100%",
        verticalAlign: "top",
        [`${n}`]: {
          width: "100%",
          height: $,
          background: S,
          borderRadius: w,
          [`+ ${o}`]: {
            marginBlockStart: f
          }
        },
        [`${o}`]: {
          padding: 0,
          "> li": {
            width: "100%",
            height: C,
            listStyle: "none",
            background: S,
            borderRadius: w,
            "+ li": {
              marginBlockStart: A
            }
          }
        },
        [`${o}> li:last-child:not(:first-child):not(:nth-child(2))`]: {
          width: "61%"
        }
      },
      [`&-round ${t}-content`]: {
        [`${n}, ${o} > li`]: {
          borderRadius: v
        }
      }
    },
    [`${t}-with-avatar ${t}-content`]: {
      [`${n}`]: {
        marginBlockStart: c,
        [`+ ${o}`]: {
          marginBlockStart: L
        }
      }
    },
    [`${t}${t}-element`]: l(l(l(l({
      display: "inline-block",
      width: "auto"
    }, vn(e)), dn(e)), cn(e)), un(e)),
    [`${t}${t}-block`]: {
      width: "100%",
      [`${r}`]: {
        width: "100%"
      },
      [`${i}`]: {
        width: "100%"
      }
    },
    [`${t}${t}-active`]: {
      [`
        ${n},
        ${o} > li,
        ${a},
        ${r},
        ${i},
        ${d}
      `]: l({}, sn(e))
    }
  };
};
const Me = ot("Skeleton", e => {
  const {
    componentCls: t
  } = e;
  const a = it(e, {
    skeletonAvatarCls: `${t}-avatar`,
    skeletonTitleCls: `${t}-title`,
    skeletonParagraphCls: `${t}-paragraph`,
    skeletonButtonCls: `${t}-button`,
    skeletonInputCls: `${t}-input`,
    skeletonImageCls: `${t}-image`,
    imageSizeBase: e.controlHeight * 1.5,
    skeletonTitleHeight: e.controlHeight / 2,
    skeletonBlockRadius: e.borderRadiusSM,
    skeletonParagraphLineHeight: e.controlHeight / 2,
    skeletonParagraphMarginTop: e.marginLG + e.marginXXS,
    borderRadius: 100,
    skeletonLoadingBackground: `linear-gradient(90deg, ${e.color} 25%, ${e.colorGradientEnd} 37%, ${e.color} 63%)`,
    skeletonLoadingMotionDuration: "1.4s"
  });
  return [pn(a)];
}, e => {
  const {
    colorFillContent: t,
    colorFill: a
  } = e;
  return {
    color: t,
    colorGradientEnd: a
  };
});
const bn = () => ({
  active: {
    type: Boolean,
    default: undefined
  },
  loading: {
    type: Boolean,
    default: undefined
  },
  prefixCls: String,
  avatar: {
    type: [Boolean, Object],
    default: undefined
  },
  title: {
    type: [Boolean, Object],
    default: undefined
  },
  paragraph: {
    type: [Boolean, Object],
    default: undefined
  },
  round: {
    type: Boolean,
    default: undefined
  }
});
function Qe(e) {
  if (e && typeof e == "object") {
    return e;
  } else {
    return {};
  }
}
function fn(e, t) {
  if (e && !t) {
    return {
      size: "large",
      shape: "square"
    };
  } else {
    return {
      size: "large",
      shape: "circle"
    };
  }
}
function gn(e, t) {
  if (!e && t) {
    return {
      width: "38%"
    };
  } else if (e && t) {
    return {
      width: "50%"
    };
  } else {
    return {};
  }
}
function hn(e, t) {
  const a = {};
  if (!e || !t) {
    a.width = "61%";
  }
  if (!e && t) {
    a.rows = 3;
  } else {
    a.rows = 2;
  }
  return a;
}
const V = z({
  compatConfig: {
    MODE: 3
  },
  name: "ASkeleton",
  props: Ae(bn(), {
    avatar: false,
    title: true,
    paragraph: true
  }),
  setup(e, t) {
    let {
      slots: a
    } = t;
    const {
      prefixCls: n,
      direction: o
    } = ce("skeleton", e);
    const [r, i] = Me(n);
    return () => {
      var d;
      const {
        loading: g,
        avatar: u,
        title: f,
        paragraph: S,
        active: h,
        round: c
      } = e;
      const v = n.value;
      if (g || e.loading === undefined) {
        const $ = !!u || u === "";
        const w = !!f || f === "";
        const C = !!S || S === "";
        let A;
        if ($) {
          const b = l(l({
            prefixCls: `${v}-avatar`
          }, fn(w, C)), Qe(u));
          A = s("div", {
            class: `${v}-header`
          }, [s(Le, b, null)]);
        }
        let L;
        if (w || C) {
          let b;
          if (w) {
            const p = l(l({
              prefixCls: `${v}-title`
            }, gn($, C)), Qe(f));
            b = s(ct, p, null);
          }
          let x;
          if (C) {
            const p = l(l({
              prefixCls: `${v}-paragraph`
            }, hn($, w)), Qe(S));
            x = s(rn, p, null);
          }
          L = s("div", {
            class: `${v}-content`
          }, [b, x]);
        }
        const M = G(v, {
          [`${v}-with-avatar`]: $,
          [`${v}-active`]: h,
          [`${v}-rtl`]: o.value === "rtl",
          [`${v}-round`]: c,
          [i.value]: true
        });
        return r(s("div", {
          class: M
        }, [A, L]));
      }
      if ((d = a.default) === null || d === undefined) {
        return undefined;
      } else {
        return d.call(a);
      }
    };
  }
});
const mn = () => l(l({}, Ge()), {
  size: String,
  block: Boolean
});
const Ot = z({
  compatConfig: {
    MODE: 3
  },
  name: "ASkeletonButton",
  props: Ae(mn(), {
    size: "default"
  }),
  setup(e) {
    const {
      prefixCls: t
    } = ce("skeleton", e);
    const [a, n] = Me(t);
    const o = D(() => G(t.value, `${t.value}-element`, {
      [`${t.value}-active`]: e.active,
      [`${t.value}-block`]: e.block
    }, n.value));
    return () => a(s("div", {
      class: o.value
    }, [s(Le, k(k({}, e), {}, {
      prefixCls: `${t.value}-button`
    }), null)]));
  }
});
const kt = z({
  compatConfig: {
    MODE: 3
  },
  name: "ASkeletonInput",
  props: l(l({}, st(Ge(), ["shape"])), {
    size: String,
    block: Boolean
  }),
  setup(e) {
    const {
      prefixCls: t
    } = ce("skeleton", e);
    const [a, n] = Me(t);
    const o = D(() => G(t.value, `${t.value}-element`, {
      [`${t.value}-active`]: e.active,
      [`${t.value}-block`]: e.block
    }, n.value));
    return () => a(s("div", {
      class: o.value
    }, [s(Le, k(k({}, e), {}, {
      prefixCls: `${t.value}-input`
    }), null)]));
  }
});
const $n = "M365.714286 329.142857q0 45.714286-32.036571 77.677714t-77.677714 32.036571-77.677714-32.036571-32.036571-77.677714 32.036571-77.677714 77.677714-32.036571 77.677714 32.036571 32.036571 77.677714zM950.857143 548.571429l0 256-804.571429 0 0-109.714286 182.857143-182.857143 91.428571 91.428571 292.571429-292.571429zM1005.714286 146.285714l-914.285714 0q-7.460571 0-12.873143 5.412571t-5.412571 12.873143l0 694.857143q0 7.460571 5.412571 12.873143t12.873143 5.412571l914.285714 0q7.460571 0 12.873143-5.412571t5.412571-12.873143l0-694.857143q0-7.460571-5.412571-12.873143t-12.873143-5.412571zM1097.142857 164.571429l0 694.857143q0 37.741714-26.843429 64.585143t-64.585143 26.843429l-914.285714 0q-37.741714 0-64.585143-26.843429t-26.843429-64.585143l0-694.857143q0-37.741714 26.843429-64.585143t64.585143-26.843429l914.285714 0q37.741714 0 64.585143 26.843429t26.843429 64.585143z";
const Wt = z({
  compatConfig: {
    MODE: 3
  },
  name: "ASkeletonImage",
  props: st(Ge(), ["size", "shape", "active"]),
  setup(e) {
    const {
      prefixCls: t
    } = ce("skeleton", e);
    const [a, n] = Me(t);
    const o = D(() => G(t.value, `${t.value}-element`, n.value));
    return () => a(s("div", {
      class: o.value
    }, [s("div", {
      class: `${t.value}-image`
    }, [s("svg", {
      viewBox: "0 0 1098 1024",
      xmlns: "http://www.w3.org/2000/svg",
      class: `${t.value}-image-svg`
    }, [s("path", {
      d: $n,
      class: `${t.value}-image-path`
    }, null)])])]));
  }
});
const yn = () => l(l({}, Ge()), {
  shape: String
});
const Nt = z({
  compatConfig: {
    MODE: 3
  },
  name: "ASkeletonAvatar",
  props: Ae(yn(), {
    size: "default",
    shape: "circle"
  }),
  setup(e) {
    const {
      prefixCls: t
    } = ce("skeleton", e);
    const [a, n] = Me(t);
    const o = D(() => G(t.value, `${t.value}-element`, {
      [`${t.value}-active`]: e.active
    }, n.value));
    return () => a(s("div", {
      class: o.value
    }, [s(Le, k(k({}, e), {}, {
      prefixCls: `${t.value}-avatar`
    }), null)]));
  }
});
V.Button = Ot;
V.Avatar = Nt;
V.Input = kt;
V.Image = Wt;
V.Title = ct;
V.install = function (e) {
  e.component(V.name, V);
  e.component(V.Button.name, Ot);
  e.component(V.Avatar.name, Nt);
  e.component(V.Input.name, kt);
  e.component(V.Image.name, Wt);
  e.component(V.Title.name, ct);
  return e;
};
const {
  TabPane: Sn
} = we;
const xn = () => ({
  prefixCls: String,
  title: de.any,
  extra: de.any,
  bordered: {
    type: Boolean,
    default: true
  },
  bodyStyle: {
    type: Object,
    default: undefined
  },
  headStyle: {
    type: Object,
    default: undefined
  },
  loading: {
    type: Boolean,
    default: false
  },
  hoverable: {
    type: Boolean,
    default: false
  },
  type: {
    type: String
  },
  size: {
    type: String
  },
  actions: de.any,
  tabList: {
    type: Array
  },
  tabBarExtraContent: de.any,
  activeTabKey: String,
  defaultActiveTabKey: String,
  cover: de.any,
  onTabChange: {
    type: Function
  }
});
const Ee = z({
  compatConfig: {
    MODE: 3
  },
  name: "ACard",
  inheritAttrs: false,
  props: xn(),
  slots: Object,
  setup(e, t) {
    let {
      slots: a,
      attrs: n
    } = t;
    const {
      prefixCls: o,
      direction: r,
      size: i
    } = ce("card", e);
    const [d, g] = an(o);
    const u = h => h.map((v, $) => yt(v) && !ia(v) || !yt(v) ? s("li", {
      style: {
        width: `${100 / h.length}%`
      },
      key: `action-${$}`
    }, [s("span", null, [v])]) : null);
    const f = h => {
      var c;
      if ((c = e.onTabChange) !== null && c !== undefined) {
        c.call(e, h);
      }
    };
    const S = function (h = []) {
      let c;
      h.forEach(v => {
        if (v && ra(v.type) && v.type.__ANT_CARD_GRID) {
          c = true;
        }
      });
      return c;
    };
    return () => {
      var h;
      var c;
      var v;
      var $;
      var w;
      var C;
      const {
        headStyle: A = {},
        bodyStyle: L = {},
        loading: M,
        bordered: b = true,
        type: x,
        tabList: p,
        hoverable: _,
        activeTabKey: I,
        defaultActiveTabKey: R,
        tabBarExtraContent: K = Be((h = a.tabBarExtraContent) === null || h === undefined ? undefined : h.call(a)),
        title: J = Be((c = a.title) === null || c === undefined ? undefined : c.call(a)),
        extra: te = Be((v = a.extra) === null || v === undefined ? undefined : v.call(a)),
        actions: re = Be(($ = a.actions) === null || $ === undefined ? undefined : $.call(a)),
        cover: B = Be((w = a.cover) === null || w === undefined ? undefined : w.call(a))
      } = e;
      const X = Et((C = a.default) === null || C === undefined ? undefined : C.call(a));
      const T = o.value;
      const Y = {
        [`${T}`]: true,
        [g.value]: true,
        [`${T}-loading`]: M,
        [`${T}-bordered`]: b,
        [`${T}-hoverable`]: !!_,
        [`${T}-contain-grid`]: S(X),
        [`${T}-contain-tabs`]: p && p.length,
        [`${T}-${i.value}`]: i.value,
        [`${T}-type-${x}`]: !!x,
        [`${T}-rtl`]: r.value === "rtl"
      };
      const U = s(V, {
        loading: true,
        active: true,
        paragraph: {
          rows: 4
        },
        title: false
      }, {
        default: () => [X]
      });
      const ue = I !== undefined;
      const j = {
        size: "large",
        [ue ? "activeKey" : "defaultActiveKey"]: ue ? I : R,
        onChange: f,
        class: `${T}-head-tabs`
      };
      let ve;
      const pe = p && p.length ? s(we, j, {
        default: () => [p.map(le => {
          const {
            tab: Se,
            slots: $e
          } = le;
          const xe = $e == null ? undefined : $e.tab;
          ze(!$e, "Card", "tabList slots is deprecated, Please use `customTab` instead.");
          let Ce = Se !== undefined ? Se : a[xe] ? a[xe](le) : null;
          Ce = la(a, "customTab", le, () => [Ce]);
          return s(Sn, {
            tab: Ce,
            key: le.key,
            disabled: le.disabled
          }, null);
        })],
        rightExtra: K ? () => K : null
      }) : null;
      if (J || te || pe) {
        ve = s("div", {
          class: `${T}-head`,
          style: A
        }, [s("div", {
          class: `${T}-head-wrapper`
        }, [J && s("div", {
          class: `${T}-head-title`
        }, [J]), te && s("div", {
          class: `${T}-extra`
        }, [te])]), pe]);
      }
      const me = B ? s("div", {
        class: `${T}-cover`
      }, [B]) : null;
      const ye = s("div", {
        class: `${T}-body`,
        style: L
      }, [M ? U : X]);
      const be = re && re.length ? s("ul", {
        class: `${T}-actions`
      }, [u(re)]) : null;
      return d(s("div", k(k({
        ref: "cardContainerRef"
      }, n), {}, {
        class: [Y, n.class]
      }), [ve, me, X && X.length ? ye : null, be]));
    };
  }
});
const Cn = () => ({
  prefixCls: String,
  title: Ye(),
  description: Ye(),
  avatar: Ye()
});
const tt = z({
  compatConfig: {
    MODE: 3
  },
  name: "ACardMeta",
  props: Cn(),
  slots: Object,
  setup(e, t) {
    let {
      slots: a
    } = t;
    const {
      prefixCls: n
    } = ce("card", e);
    return () => {
      const o = {
        [`${n.value}-meta`]: true
      };
      const r = Ve(a, e, "avatar");
      const i = Ve(a, e, "title");
      const d = Ve(a, e, "description");
      const g = r ? s("div", {
        class: `${n.value}-meta-avatar`
      }, [r]) : null;
      const u = i ? s("div", {
        class: `${n.value}-meta-title`
      }, [i]) : null;
      const f = d ? s("div", {
        class: `${n.value}-meta-description`
      }, [d]) : null;
      const S = u || f ? s("div", {
        class: `${n.value}-meta-detail`
      }, [u, f]) : null;
      return s("div", {
        class: o
      }, [g, S]);
    };
  }
});
const wn = () => ({
  prefixCls: String,
  hoverable: {
    type: Boolean,
    default: true
  }
});
const at = z({
  compatConfig: {
    MODE: 3
  },
  name: "ACardGrid",
  __ANT_CARD_GRID: true,
  props: wn(),
  setup(e, t) {
    let {
      slots: a
    } = t;
    const {
      prefixCls: n
    } = ce("card", e);
    const o = D(() => ({
      [`${n.value}-grid`]: true,
      [`${n.value}-grid-hoverable`]: e.hoverable
    }));
    return () => {
      var r;
      return s("div", {
        class: o.value
      }, [(r = a.default) === null || r === undefined ? undefined : r.call(a)]);
    };
  }
});
Ee.Meta = tt;
Ee.Grid = at;
Ee.install = function (e) {
  e.component(Ee.name, Ee);
  e.component(tt.name, tt);
  e.component(at.name, at);
  return e;
};
export { at as CardGrid, tt as CardMeta, Ee as default };
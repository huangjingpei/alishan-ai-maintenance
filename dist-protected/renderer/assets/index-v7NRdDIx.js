import { g as E, m as L, _ as x, r as X, K as O, d as _, u as P, s as G, y as B, M as A, i as r, q as I, B as H, a4 as j, G as R, af as T, aM as M, P as N } from "./index-BegIKaMc.js";
function V(n, e, c) {
  var t = c || {};
  var i = t.noTrailing;
  var m = i === undefined ? false : i;
  var b = t.noLeading;
  var y = b === undefined ? false : b;
  var $ = t.debounceMode;
  var a = $ === undefined ? undefined : $;
  var o;
  var g = false;
  var f = 0;
  function D() {
    if (o) {
      clearTimeout(o);
    }
  }
  function z(d) {
    var v = d || {};
    var p = v.upcomingOnly;
    var h = p === undefined ? false : p;
    D();
    g = !h;
  }
  function S() {
    for (var d = arguments.length, v = new Array(d), p = 0; p < d; p++) {
      v[p] = arguments[p];
    }
    var h = this;
    var l = Date.now() - f;
    if (g) {
      return;
    }
    function u() {
      f = Date.now();
      e.apply(h, v);
    }
    function s() {
      o = undefined;
    }
    if (!y && a && !o) {
      u();
    }
    D();
    if (a === undefined && l > n) {
      if (y) {
        f = Date.now();
        if (!m) {
          o = setTimeout(a ? s : u, n);
        }
      } else {
        u();
      }
    } else if (m !== true) {
      o = setTimeout(a ? s : u, a === undefined ? n - l : n);
    }
  }
  S.cancel = z;
  return S;
}
function F(n, e, c) {
  var t = {};
  var i = t.atBegin;
  var m = i === undefined ? false : i;
  return V(n, e, {
    debounceMode: m !== false
  });
}
const K = new O("antSpinMove", {
  to: {
    opacity: 1
  }
});
const q = new O("antRotate", {
  to: {
    transform: "rotate(405deg)"
  }
});
const U = n => ({
  [`${n.componentCls}`]: x(x({}, X(n)), {
    position: "absolute",
    display: "none",
    color: n.colorPrimary,
    textAlign: "center",
    verticalAlign: "middle",
    opacity: 0,
    transition: `transform ${n.motionDurationSlow} ${n.motionEaseInOutCirc}`,
    "&-spinning": {
      position: "static",
      display: "inline-block",
      opacity: 1
    },
    "&-nested-loading": {
      position: "relative",
      [`> div > ${n.componentCls}`]: {
        position: "absolute",
        top: 0,
        insetInlineStart: 0,
        zIndex: 4,
        display: "block",
        width: "100%",
        height: "100%",
        maxHeight: n.contentHeight,
        [`${n.componentCls}-dot`]: {
          position: "absolute",
          top: "50%",
          insetInlineStart: "50%",
          margin: -n.spinDotSize / 2
        },
        [`${n.componentCls}-text`]: {
          position: "absolute",
          top: "50%",
          width: "100%",
          paddingTop: (n.spinDotSize - n.fontSize) / 2 + 2,
          textShadow: `0 1px 2px ${n.colorBgContainer}`
        },
        [`&${n.componentCls}-show-text ${n.componentCls}-dot`]: {
          marginTop: -(n.spinDotSize / 2) - 10
        },
        "&-sm": {
          [`${n.componentCls}-dot`]: {
            margin: -n.spinDotSizeSM / 2
          },
          [`${n.componentCls}-text`]: {
            paddingTop: (n.spinDotSizeSM - n.fontSize) / 2 + 2
          },
          [`&${n.componentCls}-show-text ${n.componentCls}-dot`]: {
            marginTop: -(n.spinDotSizeSM / 2) - 10
          }
        },
        "&-lg": {
          [`${n.componentCls}-dot`]: {
            margin: -(n.spinDotSizeLG / 2)
          },
          [`${n.componentCls}-text`]: {
            paddingTop: (n.spinDotSizeLG - n.fontSize) / 2 + 2
          },
          [`&${n.componentCls}-show-text ${n.componentCls}-dot`]: {
            marginTop: -(n.spinDotSizeLG / 2) - 10
          }
        }
      },
      [`${n.componentCls}-container`]: {
        position: "relative",
        transition: `opacity ${n.motionDurationSlow}`,
        "&::after": {
          position: "absolute",
          top: 0,
          insetInlineEnd: 0,
          bottom: 0,
          insetInlineStart: 0,
          zIndex: 10,
          width: "100%",
          height: "100%",
          background: n.colorBgContainer,
          opacity: 0,
          transition: `all ${n.motionDurationSlow}`,
          content: "\"\"",
          pointerEvents: "none"
        }
      },
      [`${n.componentCls}-blur`]: {
        clear: "both",
        opacity: 0.5,
        userSelect: "none",
        pointerEvents: "none",
        "&::after": {
          opacity: 0.4,
          pointerEvents: "auto"
        }
      }
    },
    "&-tip": {
      color: n.spinDotDefault
    },
    [`${n.componentCls}-dot`]: {
      position: "relative",
      display: "inline-block",
      fontSize: n.spinDotSize,
      width: "1em",
      height: "1em",
      "&-item": {
        position: "absolute",
        display: "block",
        width: (n.spinDotSize - n.marginXXS / 2) / 2,
        height: (n.spinDotSize - n.marginXXS / 2) / 2,
        backgroundColor: n.colorPrimary,
        borderRadius: "100%",
        transform: "scale(0.75)",
        transformOrigin: "50% 50%",
        opacity: 0.3,
        animationName: K,
        animationDuration: "1s",
        animationIterationCount: "infinite",
        animationTimingFunction: "linear",
        animationDirection: "alternate",
        "&:nth-child(1)": {
          top: 0,
          insetInlineStart: 0
        },
        "&:nth-child(2)": {
          top: 0,
          insetInlineEnd: 0,
          animationDelay: "0.4s"
        },
        "&:nth-child(3)": {
          insetInlineEnd: 0,
          bottom: 0,
          animationDelay: "0.8s"
        },
        "&:nth-child(4)": {
          bottom: 0,
          insetInlineStart: 0,
          animationDelay: "1.2s"
        }
      },
      "&-spin": {
        transform: "rotate(45deg)",
        animationName: q,
        animationDuration: "1.2s",
        animationIterationCount: "infinite",
        animationTimingFunction: "linear"
      }
    },
    [`&-sm ${n.componentCls}-dot`]: {
      fontSize: n.spinDotSizeSM,
      i: {
        width: (n.spinDotSizeSM - n.marginXXS / 2) / 2,
        height: (n.spinDotSizeSM - n.marginXXS / 2) / 2
      }
    },
    [`&-lg ${n.componentCls}-dot`]: {
      fontSize: n.spinDotSizeLG,
      i: {
        width: (n.spinDotSizeLG - n.marginXXS) / 2,
        height: (n.spinDotSizeLG - n.marginXXS) / 2
      }
    },
    [`&${n.componentCls}-show-text ${n.componentCls}-text`]: {
      display: "block"
    }
  })
});
const J = E("Spin", n => {
  const e = L(n, {
    spinDotDefault: n.colorTextDescription,
    spinDotSize: n.controlHeightLG / 2,
    spinDotSizeSM: n.controlHeightLG * 0.35,
    spinDotSizeLG: n.controlHeight
  });
  return [U(e)];
}, {
  contentHeight: 400
});
function Q(n, e) {
  var c = {};
  for (var t in n) {
    if (Object.prototype.hasOwnProperty.call(n, t) && e.indexOf(t) < 0) {
      c[t] = n[t];
    }
  }
  if (n != null && typeof Object.getOwnPropertySymbols == "function") {
    for (var i = 0, t = Object.getOwnPropertySymbols(n); i < t.length; i++) {
      if (e.indexOf(t[i]) < 0 && Object.prototype.propertyIsEnumerable.call(n, t[i])) {
        c[t[i]] = n[t[i]];
      }
    }
  }
  return c;
}
const W = () => ({
  prefixCls: String,
  spinning: {
    type: Boolean,
    default: undefined
  },
  size: String,
  wrapperClassName: String,
  tip: N.any,
  delay: Number,
  indicator: N.any
});
let C = null;
function Y(n, e) {
  return !!n && !!e && !isNaN(Number(e));
}
function Z(n) {
  const e = n.indicator;
  C = typeof e == "function" ? e : () => r(e, null, null);
}
const w = _({
  compatConfig: {
    MODE: 3
  },
  name: "ASpin",
  inheritAttrs: false,
  props: j(W(), {
    size: "default",
    spinning: true,
    wrapperClassName: ""
  }),
  setup(n, e) {
    let {
      attrs: c,
      slots: t
    } = e;
    const {
      prefixCls: i,
      size: m,
      direction: b
    } = P("spin", n);
    const [y, $] = J(i);
    const a = G(n.spinning && !Y(n.spinning, n.delay));
    let o;
    B([() => n.spinning, () => n.delay], () => {
      if (o != null) {
        o.cancel();
      }
      o = F(n.delay, () => {
        a.value = n.spinning;
      });
      if (o != null) {
        o();
      }
    }, {
      immediate: true,
      flush: "post"
    });
    A(() => {
      if (o != null) {
        o.cancel();
      }
    });
    return () => {
      var g;
      var f;
      const {
        class: D
      } = c;
      const z = Q(c, ["class"]);
      const {
        tip: S = (g = t.tip) === null || g === undefined ? undefined : g.call(t)
      } = n;
      const d = (f = t.default) === null || f === undefined ? undefined : f.call(t);
      const v = {
        [$.value]: true,
        [i.value]: true,
        [`${i.value}-sm`]: m.value === "small",
        [`${i.value}-lg`]: m.value === "large",
        [`${i.value}-spinning`]: a.value,
        [`${i.value}-show-text`]: !!S,
        [`${i.value}-rtl`]: b.value === "rtl",
        [D]: !!D
      };
      function p(l) {
        const u = `${l}-dot`;
        let s = R(t, n, "indicator");
        if (s === null) {
          return null;
        } else {
          if (Array.isArray(s)) {
            s = s.length === 1 ? s[0] : s;
          }
          if (T(s)) {
            return M(s, {
              class: u
            });
          } else if (C && T(C())) {
            return M(C(), {
              class: u
            });
          } else {
            return r("span", {
              class: `${u} ${l}-dot-spin`
            }, [r("i", {
              class: `${l}-dot-item`
            }, null), r("i", {
              class: `${l}-dot-item`
            }, null), r("i", {
              class: `${l}-dot-item`
            }, null), r("i", {
              class: `${l}-dot-item`
            }, null)]);
          }
        }
      }
      const h = r("div", I(I({}, z), {}, {
        class: v,
        "aria-live": "polite",
        "aria-busy": a.value
      }), [p(i.value), S ? r("div", {
        class: `${i.value}-text`
      }, [S]) : null]);
      if (d && H(d).length) {
        const l = {
          [`${i.value}-container`]: true,
          [`${i.value}-blur`]: a.value
        };
        return y(r("div", {
          class: [`${i.value}-nested-loading`, n.wrapperClassName, $.value]
        }, [a.value && r("div", {
          key: "loading"
        }, [h]), r("div", {
          class: l,
          key: "container"
        }, [d])]));
      }
      return y(h);
    };
  }
});
w.setDefaultIndicator = Z;
w.install = function (n) {
  n.component(w.name, w);
  return n;
};
export { w as default, W as spinProps };
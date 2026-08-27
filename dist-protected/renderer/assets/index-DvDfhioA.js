import { d as W, x as lt, y as J, z as it, _ as i, i as v, o as f, A as R, h as F, P as T, u as L, B as st, l as Q, g as ut, m as ct, D as Y, r as q, K as O, q as I, F as k, G as dt, H as mt, n as gt, T as bt, p as ft, v as vt } from "./index-BegIKaMc.js";
import { i as pt } from "./isNumeric-DjvBa-1E.js";
function G(t) {
  let {
    prefixCls: o,
    value: a,
    current: e,
    offset: n = 0
  } = t;
  let c;
  if (n) {
    c = {
      position: "absolute",
      top: `${n}00%`,
      left: 0
    };
  }
  return v("p", {
    style: c,
    class: F(`${o}-only-unit`, {
      current: e
    })
  }, [a]);
}
function ht(t, o, a) {
  let e = t;
  let n = 0;
  while ((e + 10) % 10 !== o) {
    e += a;
    n += a;
  }
  return n;
}
const $t = W({
  compatConfig: {
    MODE: 3
  },
  name: "SingleNumber",
  props: {
    prefixCls: String,
    value: String,
    count: Number
  },
  setup(t) {
    const o = f(() => Number(t.value));
    const a = f(() => Math.abs(t.count));
    const e = lt({
      prevValue: o.value,
      prevCount: a.value
    });
    const n = () => {
      e.prevValue = o.value;
      e.prevCount = a.value;
    };
    const c = R();
    J(o, () => {
      clearTimeout(c.value);
      c.value = setTimeout(() => {
        n();
      }, 1000);
    }, {
      flush: "post"
    });
    it(() => {
      clearTimeout(c.value);
    });
    return () => {
      let d;
      let p = {};
      const s = o.value;
      if (e.prevValue === s || Number.isNaN(s) || Number.isNaN(e.prevValue)) {
        d = [G(i(i({}, t), {
          current: true
        }))];
        p = {
          transition: "none"
        };
      } else {
        d = [];
        const h = s + 10;
        const m = [];
        for (let r = s; r <= h; r += 1) {
          m.push(r);
        }
        const l = m.findIndex(r => r % 10 === e.prevValue);
        d = m.map((r, y) => {
          const $ = r % 10;
          return G(i(i({}, t), {
            value: $,
            offset: y - l,
            current: y === l
          }));
        });
        const u = e.prevCount < a.value ? 1 : -1;
        p = {
          transform: `translateY(${-ht(e.prevValue, s, u)}00%)`
        };
      }
      return v("span", {
        class: `${t.prefixCls}-only`,
        style: p,
        onTransitionend: () => n()
      }, [d]);
    };
  }
});
function St(t, o) {
  var a = {};
  for (var e in t) {
    if (Object.prototype.hasOwnProperty.call(t, e) && o.indexOf(e) < 0) {
      a[e] = t[e];
    }
  }
  if (t != null && typeof Object.getOwnPropertySymbols == "function") {
    for (var n = 0, e = Object.getOwnPropertySymbols(t); n < e.length; n++) {
      if (o.indexOf(e[n]) < 0 && Object.prototype.propertyIsEnumerable.call(t, e[n])) {
        a[e[n]] = t[e[n]];
      }
    }
  }
  return a;
}
const yt = {
  prefixCls: String,
  count: T.any,
  component: String,
  title: T.any,
  show: Boolean
};
const Ct = W({
  compatConfig: {
    MODE: 3
  },
  name: "ScrollNumber",
  inheritAttrs: false,
  props: yt,
  setup(t, o) {
    let {
      attrs: a,
      slots: e
    } = o;
    const {
      prefixCls: n
    } = L("scroll-number", t);
    return () => {
      var c;
      const d = i(i({}, t), a);
      const {
        prefixCls: p,
        count: s,
        title: h,
        show: m,
        component: l = "sup",
        class: u,
        style: r
      } = d;
      const y = St(d, ["prefixCls", "count", "title", "show", "component", "class", "style"]);
      const $ = i(i({}, y), {
        style: r,
        "data-show": t.show,
        class: F(n.value, u),
        title: h
      });
      let g = s;
      if (s && Number(s) % 1 === 0) {
        const b = String(s).split("");
        g = b.map((P, B) => v($t, {
          prefixCls: n.value,
          count: Number(s),
          value: P,
          key: b.length - B
        }, null));
      }
      if (r && r.borderColor) {
        $.style = i(i({}, r), {
          boxShadow: `0 0 0 1px ${r.borderColor} inset`
        });
      }
      const S = st((c = e.default) === null || c === undefined ? undefined : c.call(e));
      if (S && S.length) {
        return Q(S, {
          class: F(`${n.value}-custom-component`)
        }, false);
      } else {
        return v(l, $, {
          default: () => [g]
        });
      }
    };
  }
});
const xt = new O("antStatusProcessing", {
  "0%": {
    transform: "scale(0.8)",
    opacity: 0.5
  },
  "100%": {
    transform: "scale(2.4)",
    opacity: 0
  }
});
const wt = new O("antZoomBadgeIn", {
  "0%": {
    transform: "scale(0) translate(50%, -50%)",
    opacity: 0
  },
  "100%": {
    transform: "scale(1) translate(50%, -50%)"
  }
});
const Nt = new O("antZoomBadgeOut", {
  "0%": {
    transform: "scale(1) translate(50%, -50%)"
  },
  "100%": {
    transform: "scale(0) translate(50%, -50%)",
    opacity: 0
  }
});
const Ot = new O("antNoWrapperZoomBadgeIn", {
  "0%": {
    transform: "scale(0)",
    opacity: 0
  },
  "100%": {
    transform: "scale(1)"
  }
});
const Pt = new O("antNoWrapperZoomBadgeOut", {
  "0%": {
    transform: "scale(1)"
  },
  "100%": {
    transform: "scale(0)",
    opacity: 0
  }
});
const Bt = new O("antBadgeLoadingCircle", {
  "0%": {
    transformOrigin: "50%"
  },
  "100%": {
    transform: "translate(50%, -50%) rotate(360deg)",
    transformOrigin: "50%"
  }
});
const zt = t => {
  const {
    componentCls: o,
    iconCls: a,
    antCls: e,
    badgeFontHeight: n,
    badgeShadowSize: c,
    badgeHeightSm: d,
    motionDurationSlow: p,
    badgeStatusSize: s,
    marginXS: h,
    badgeRibbonOffset: m
  } = t;
  const l = `${e}-scroll-number`;
  const u = `${e}-ribbon`;
  const r = `${e}-ribbon-wrapper`;
  const y = Y(t, (g, S) => {
    let {
      darkColor: b
    } = S;
    return {
      [`&${o} ${o}-color-${g}`]: {
        background: b,
        [`&:not(${o}-count)`]: {
          color: b
        }
      }
    };
  });
  const $ = Y(t, (g, S) => {
    let {
      darkColor: b
    } = S;
    return {
      [`&${u}-color-${g}`]: {
        background: b,
        color: b
      }
    };
  });
  return {
    [o]: i(i(i(i({}, q(t)), {
      position: "relative",
      display: "inline-block",
      width: "fit-content",
      lineHeight: 1,
      [`${o}-count`]: {
        zIndex: t.badgeZIndex,
        minWidth: t.badgeHeight,
        height: t.badgeHeight,
        color: t.badgeTextColor,
        fontWeight: t.badgeFontWeight,
        fontSize: t.badgeFontSize,
        lineHeight: `${t.badgeHeight}px`,
        whiteSpace: "nowrap",
        textAlign: "center",
        background: t.badgeColor,
        borderRadius: t.badgeHeight / 2,
        boxShadow: `0 0 0 ${c}px ${t.badgeShadowColor}`,
        transition: `background ${t.motionDurationMid}`,
        a: {
          color: t.badgeTextColor
        },
        "a:hover": {
          color: t.badgeTextColor
        },
        "a:hover &": {
          background: t.badgeColorHover
        }
      },
      [`${o}-count-sm`]: {
        minWidth: d,
        height: d,
        fontSize: t.badgeFontSizeSm,
        lineHeight: `${d}px`,
        borderRadius: d / 2
      },
      [`${o}-multiple-words`]: {
        padding: `0 ${t.paddingXS}px`
      },
      [`${o}-dot`]: {
        zIndex: t.badgeZIndex,
        width: t.badgeDotSize,
        minWidth: t.badgeDotSize,
        height: t.badgeDotSize,
        background: t.badgeColor,
        borderRadius: "100%",
        boxShadow: `0 0 0 ${c}px ${t.badgeShadowColor}`
      },
      [`${o}-dot${l}`]: {
        transition: `background ${p}`
      },
      [`${o}-count, ${o}-dot, ${l}-custom-component`]: {
        position: "absolute",
        top: 0,
        insetInlineEnd: 0,
        transform: "translate(50%, -50%)",
        transformOrigin: "100% 0%",
        [`&${a}-spin`]: {
          animationName: Bt,
          animationDuration: "1s",
          animationIterationCount: "infinite",
          animationTimingFunction: "linear"
        }
      },
      [`&${o}-status`]: {
        lineHeight: "inherit",
        verticalAlign: "baseline",
        [`${o}-status-dot`]: {
          position: "relative",
          top: -1,
          display: "inline-block",
          width: s,
          height: s,
          verticalAlign: "middle",
          borderRadius: "50%"
        },
        [`${o}-status-success`]: {
          backgroundColor: t.colorSuccess
        },
        [`${o}-status-processing`]: {
          overflow: "visible",
          color: t.colorPrimary,
          backgroundColor: t.colorPrimary,
          "&::after": {
            position: "absolute",
            top: 0,
            insetInlineStart: 0,
            width: "100%",
            height: "100%",
            borderWidth: c,
            borderStyle: "solid",
            borderColor: "inherit",
            borderRadius: "50%",
            animationName: xt,
            animationDuration: t.badgeProcessingDuration,
            animationIterationCount: "infinite",
            animationTimingFunction: "ease-in-out",
            content: "\"\""
          }
        },
        [`${o}-status-default`]: {
          backgroundColor: t.colorTextPlaceholder
        },
        [`${o}-status-error`]: {
          backgroundColor: t.colorError
        },
        [`${o}-status-warning`]: {
          backgroundColor: t.colorWarning
        },
        [`${o}-status-text`]: {
          marginInlineStart: h,
          color: t.colorText,
          fontSize: t.fontSize
        }
      }
    }), y), {
      [`${o}-zoom-appear, ${o}-zoom-enter`]: {
        animationName: wt,
        animationDuration: t.motionDurationSlow,
        animationTimingFunction: t.motionEaseOutBack,
        animationFillMode: "both"
      },
      [`${o}-zoom-leave`]: {
        animationName: Nt,
        animationDuration: t.motionDurationSlow,
        animationTimingFunction: t.motionEaseOutBack,
        animationFillMode: "both"
      },
      [`&${o}-not-a-wrapper`]: {
        [`${o}-zoom-appear, ${o}-zoom-enter`]: {
          animationName: Ot,
          animationDuration: t.motionDurationSlow,
          animationTimingFunction: t.motionEaseOutBack
        },
        [`${o}-zoom-leave`]: {
          animationName: Pt,
          animationDuration: t.motionDurationSlow,
          animationTimingFunction: t.motionEaseOutBack
        },
        [`&:not(${o}-status)`]: {
          verticalAlign: "middle"
        },
        [`${l}-custom-component, ${o}-count`]: {
          transform: "none"
        },
        [`${l}-custom-component, ${l}`]: {
          position: "relative",
          top: "auto",
          display: "block",
          transformOrigin: "50% 50%"
        }
      },
      [`${l}`]: {
        overflow: "hidden",
        [`${l}-only`]: {
          position: "relative",
          display: "inline-block",
          height: t.badgeHeight,
          transition: `all ${t.motionDurationSlow} ${t.motionEaseOutBack}`,
          WebkitTransformStyle: "preserve-3d",
          WebkitBackfaceVisibility: "hidden",
          [`> p${l}-only-unit`]: {
            height: t.badgeHeight,
            margin: 0,
            WebkitTransformStyle: "preserve-3d",
            WebkitBackfaceVisibility: "hidden"
          }
        },
        [`${l}-symbol`]: {
          verticalAlign: "top"
        }
      },
      "&-rtl": {
        direction: "rtl",
        [`${o}-count, ${o}-dot, ${l}-custom-component`]: {
          transform: "translate(-50%, -50%)"
        }
      }
    }),
    [`${r}`]: {
      position: "relative"
    },
    [`${u}`]: i(i(i(i({}, q(t)), {
      position: "absolute",
      top: h,
      padding: `0 ${t.paddingXS}px`,
      color: t.colorPrimary,
      lineHeight: `${n}px`,
      whiteSpace: "nowrap",
      backgroundColor: t.colorPrimary,
      borderRadius: t.borderRadiusSM,
      [`${u}-text`]: {
        color: t.colorTextLightSolid
      },
      [`${u}-corner`]: {
        position: "absolute",
        top: "100%",
        width: m,
        height: m,
        color: "currentcolor",
        border: `${m / 2}px solid`,
        transform: t.badgeRibbonCornerTransform,
        transformOrigin: "top",
        filter: t.badgeRibbonCornerFilter
      }
    }), $), {
      [`&${u}-placement-end`]: {
        insetInlineEnd: -m,
        borderEndEndRadius: 0,
        [`${u}-corner`]: {
          insetInlineEnd: 0,
          borderInlineEndColor: "transparent",
          borderBlockEndColor: "transparent"
        }
      },
      [`&${u}-placement-start`]: {
        insetInlineStart: -m,
        borderEndStartRadius: 0,
        [`${u}-corner`]: {
          insetInlineStart: 0,
          borderBlockEndColor: "transparent",
          borderInlineStartColor: "transparent"
        }
      },
      "&-rtl": {
        direction: "rtl"
      }
    })
  };
};
const tt = ut("Badge", t => {
  const {
    fontSize: o,
    lineHeight: a,
    fontSizeSM: e,
    lineWidth: n,
    marginXS: c,
    colorBorderBg: d
  } = t;
  const p = Math.round(o * a);
  const s = n;
  const h = "auto";
  const m = p - s * 2;
  const l = t.colorBgContainer;
  const u = "normal";
  const r = e;
  const y = t.colorError;
  const $ = t.colorErrorHover;
  const g = o;
  const S = e / 2;
  const b = e;
  const P = e / 2;
  const B = ct(t, {
    badgeFontHeight: p,
    badgeShadowSize: s,
    badgeZIndex: h,
    badgeHeight: m,
    badgeTextColor: l,
    badgeFontWeight: u,
    badgeFontSize: r,
    badgeColor: y,
    badgeColorHover: $,
    badgeShadowColor: d,
    badgeHeightSm: g,
    badgeDotSize: S,
    badgeFontSizeSm: b,
    badgeStatusSize: P,
    badgeProcessingDuration: "1.2s",
    badgeRibbonOffset: c,
    badgeRibbonCornerTransform: "scaleY(0.75)",
    badgeRibbonCornerFilter: "brightness(75%)"
  });
  return [zt(B)];
});
function It(t, o) {
  var a = {};
  for (var e in t) {
    if (Object.prototype.hasOwnProperty.call(t, e) && o.indexOf(e) < 0) {
      a[e] = t[e];
    }
  }
  if (t != null && typeof Object.getOwnPropertySymbols == "function") {
    for (var n = 0, e = Object.getOwnPropertySymbols(t); n < e.length; n++) {
      if (o.indexOf(e[n]) < 0 && Object.prototype.propertyIsEnumerable.call(t, e[n])) {
        a[e[n]] = t[e[n]];
      }
    }
  }
  return a;
}
const Tt = () => ({
  prefix: String,
  color: {
    type: String
  },
  text: T.any,
  placement: {
    type: String,
    default: "end"
  }
});
const V = W({
  compatConfig: {
    MODE: 3
  },
  name: "ABadgeRibbon",
  inheritAttrs: false,
  props: Tt(),
  slots: Object,
  setup(t, o) {
    let {
      attrs: a,
      slots: e
    } = o;
    const {
      prefixCls: n,
      direction: c
    } = L("ribbon", t);
    const [d, p] = tt(n);
    const s = f(() => k(t.color, false));
    const h = f(() => [n.value, `${n.value}-placement-${t.placement}`, {
      [`${n.value}-rtl`]: c.value === "rtl",
      [`${n.value}-color-${t.color}`]: s.value
    }]);
    return () => {
      var m;
      var l;
      const {
        class: u,
        style: r
      } = a;
      const y = It(a, ["class", "style"]);
      const $ = {};
      const g = {};
      if (t.color && !s.value) {
        $.background = t.color;
        g.color = t.color;
      }
      return d(v("div", I({
        class: `${n.value}-wrapper ${p.value}`
      }, y), [(m = e.default) === null || m === undefined ? undefined : m.call(e), v("div", {
        class: [h.value, u, p.value],
        style: i(i({}, $), r)
      }, [v("span", {
        class: `${n.value}-text`
      }, [t.text || ((l = e.text) === null || l === undefined ? undefined : l.call(e))]), v("div", {
        class: `${n.value}-corner`,
        style: g
      }, null)])]));
    };
  }
});
const Dt = () => ({
  count: T.any.def(null),
  showZero: {
    type: Boolean,
    default: undefined
  },
  overflowCount: {
    type: Number,
    default: 99
  },
  dot: {
    type: Boolean,
    default: undefined
  },
  prefixCls: String,
  scrollNumberPrefixCls: String,
  status: {
    type: String
  },
  size: {
    type: String,
    default: "default"
  },
  color: String,
  text: T.any,
  offset: Array,
  numberStyle: {
    type: Object,
    default: undefined
  },
  title: String
});
const M = W({
  compatConfig: {
    MODE: 3
  },
  name: "ABadge",
  Ribbon: V,
  inheritAttrs: false,
  props: Dt(),
  slots: Object,
  setup(t, o) {
    let {
      slots: a,
      attrs: e
    } = o;
    const {
      prefixCls: n,
      direction: c
    } = L("badge", t);
    const [d, p] = tt(n);
    const s = f(() => t.count > t.overflowCount ? `${t.overflowCount}+` : t.count);
    const h = f(() => s.value === "0" || s.value === 0);
    const m = f(() => t.count === null || h.value && !t.showZero);
    const l = f(() => (t.status !== null && t.status !== undefined || t.color !== null && t.color !== undefined) && m.value);
    const u = f(() => t.dot && !h.value);
    const r = f(() => u.value ? "" : s.value);
    const y = f(() => (r.value === null || r.value === undefined || r.value === "" || h.value && !t.showZero) && !u.value);
    const $ = R(t.count);
    const g = R(r.value);
    const S = R(u.value);
    J([() => t.count, r, u], () => {
      if (!y.value) {
        $.value = t.count;
        g.value = r.value;
        S.value = u.value;
      }
    }, {
      immediate: true
    });
    const b = f(() => k(t.color, false));
    const P = f(() => ({
      [`${n.value}-status-dot`]: l.value,
      [`${n.value}-status-${t.status}`]: !!t.status,
      [`${n.value}-color-${t.color}`]: b.value
    }));
    const B = f(() => t.color && !b.value ? {
      background: t.color,
      color: t.color
    } : {});
    const et = f(() => ({
      [`${n.value}-dot`]: S.value,
      [`${n.value}-count`]: !S.value,
      [`${n.value}-count-sm`]: t.size === "small",
      [`${n.value}-multiple-words`]: !S.value && g.value && g.value.toString().length > 1,
      [`${n.value}-status-${t.status}`]: !!t.status,
      [`${n.value}-color-${t.color}`]: b.value
    }));
    return () => {
      var D;
      var _;
      const {
        offset: N,
        title: Z,
        color: X
      } = t;
      const U = e.style;
      const j = dt(a, t, "text");
      const x = n.value;
      const C = $.value;
      let w = mt((D = a.default) === null || D === undefined ? undefined : D.call(a));
      w = w.length ? w : null;
      const A = !y.value || !!a.count;
      const E = (() => {
        if (!N) {
          return i({}, U);
        }
        const z = {
          marginTop: pt(N[1]) ? `${N[1]}px` : N[1]
        };
        if (c.value === "rtl") {
          z.left = `${parseInt(N[0], 10)}px`;
        } else {
          z.right = `${-parseInt(N[0], 10)}px`;
        }
        return i(i({}, z), U);
      })();
      const ot = Z ?? (typeof C == "string" || typeof C == "number" ? C : undefined);
      const nt = A || !j ? null : v("span", {
        class: `${x}-status-text`
      }, [j]);
      const at = typeof C == "object" || C === undefined && a.count ? Q(C ?? ((_ = a.count) === null || _ === undefined ? undefined : _.call(a)), {
        style: E
      }, false) : null;
      const K = F(x, {
        [`${x}-status`]: l.value,
        [`${x}-not-a-wrapper`]: !w,
        [`${x}-rtl`]: c.value === "rtl"
      }, e.class, p.value);
      if (!w && l.value) {
        const z = E.color;
        return d(v("span", I(I({}, e), {}, {
          class: K,
          style: E
        }), [v("span", {
          class: P.value,
          style: B.value
        }, null), v("span", {
          style: {
            color: z
          },
          class: `${x}-status-text`
        }, [j])]));
      }
      const rt = gt(w ? `${x}-zoom` : "", {
        appear: false
      });
      let H = i(i({}, E), t.numberStyle);
      if (X && !b.value) {
        H = H || {};
        H.background = X;
      }
      return d(v("span", I(I({}, e), {}, {
        class: K
      }), [w, v(bt, rt, {
        default: () => [ft(v(Ct, {
          prefixCls: t.scrollNumberPrefixCls,
          show: A,
          class: et.value,
          count: g.value,
          title: ot,
          style: H,
          key: "scrollNumber"
        }, {
          default: () => [at]
        }), [[vt, A]])]
      }), nt]));
    };
  }
});
M.install = function (t) {
  t.component(M.name, M);
  t.component(V.name, V);
  return t;
};
export { V as BadgeRibbon, M as default };
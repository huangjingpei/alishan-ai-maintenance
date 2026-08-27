import { aa as w, ac as X, Y as H, b0 as _, ab as K, U as Y, a6 as V, bs as A, d as I, i as g, aO as F, q as $, o as u, _ as x, bt as q, A as B, a4 as E, aN as z, g as U, m as Q, r as J, K as Z, u as ee, c as te, j as re, f as oe, br as se, w as ne } from "./index-BegIKaMc.js";
import { u as le } from "./useRefs-DuBUbAWx.js";
const ie = ["normal", "exception", "active", "success"];
const j = () => ({
  prefixCls: String,
  type: w(),
  percent: Number,
  format: Y(),
  status: w(),
  showInfo: K(),
  strokeWidth: Number,
  strokeLinecap: w(),
  strokeColor: _(),
  trailColor: String,
  width: Number,
  success: H(),
  gapDegree: Number,
  gapPosition: w(),
  size: X([String, Number, Array]),
  steps: Number,
  successPercent: Number,
  title: String,
  progressStatus: w()
});
function P(e) {
  if (!e || e < 0) {
    return 0;
  } else if (e > 100) {
    return 100;
  } else {
    return e;
  }
}
function D(e) {
  let {
    success: t,
    successPercent: o
  } = e;
  let r = o;
  if (t && "progress" in t) {
    V(false, "Progress", "`success.progress` is deprecated. Please use `success.percent` instead.");
    r = t.progress;
  }
  if (t && "percent" in t) {
    r = t.percent;
  }
  return r;
}
function ae(e) {
  let {
    percent: t,
    success: o,
    successPercent: r
  } = e;
  const s = P(D({
    success: o,
    successPercent: r
  }));
  return [s, P(P(t) - s)];
}
function ce(e) {
  let {
    success: t = {},
    strokeColor: o
  } = e;
  const {
    strokeColor: r
  } = t;
  return [r || A.green, o || null];
}
const W = (e, t, o) => {
  let n = -1;
  let i = -1;
  if (t === "step") {
    const h = o.steps;
    const d = o.strokeWidth;
    if (typeof e == "string" || typeof e === "undefined") {
      n = e === "small" ? 2 : 14;
      i = d ?? 8;
    } else if (typeof e == "number") {
      [n, i] = [e, e];
    } else {
      [n = 14, i = 8] = e;
    }
    n *= h;
  } else if (t === "line") {
    const h = o == null ? undefined : o.strokeWidth;
    if (typeof e == "string" || typeof e === "undefined") {
      i = h || (e === "small" ? 6 : 8);
    } else if (typeof e == "number") {
      [n, i] = [e, e];
    } else {
      [n = -1, i = 8] = e;
    }
  } else if (t === "circle" || t === "dashboard") {
    if (typeof e == "string" || typeof e === "undefined") {
      [n, i] = e === "small" ? [60, 60] : [120, 120];
    } else if (typeof e == "number") {
      [n, i] = [e, e];
    } else {
      n = e[0] ?? e[1] ?? 120;
      i = e[0] ?? e[1] ?? 120;
    }
  }
  return {
    width: n,
    height: i
  };
};
function ue(e, t) {
  var o = {};
  for (var r in e) {
    if (Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0) {
      o[r] = e[r];
    }
  }
  if (e != null && typeof Object.getOwnPropertySymbols == "function") {
    for (var s = 0, r = Object.getOwnPropertySymbols(e); s < r.length; s++) {
      if (t.indexOf(r[s]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[s])) {
        o[r[s]] = e[r[s]];
      }
    }
  }
  return o;
}
const de = () => x(x({}, j()), {
  strokeColor: _(),
  direction: w()
});
const ge = e => {
  let t = [];
  Object.keys(e).forEach(o => {
    const r = parseFloat(o.replace(/%/g, ""));
    if (!isNaN(r)) {
      t.push({
        key: r,
        value: e[o]
      });
    }
  });
  t = t.sort((o, r) => o.key - r.key);
  return t.map(o => {
    let {
      key: r,
      value: s
    } = o;
    return `${s} ${r}%`;
  }).join(", ");
};
const fe = (e, t) => {
  const {
    from: o = A.blue,
    to: r = A.blue,
    direction: s = t === "rtl" ? "to left" : "to right"
  } = e;
  const p = ue(e, ["from", "to", "direction"]);
  if (Object.keys(p).length !== 0) {
    const l = ge(p);
    return {
      backgroundImage: `linear-gradient(${s}, ${l})`
    };
  }
  return {
    backgroundImage: `linear-gradient(${s}, ${o}, ${r})`
  };
};
const pe = I({
  compatConfig: {
    MODE: 3
  },
  name: "ProgressLine",
  inheritAttrs: false,
  props: de(),
  setup(e, t) {
    let {
      slots: o,
      attrs: r
    } = t;
    const s = u(() => {
      const {
        strokeColor: a,
        direction: f
      } = e;
      if (a && typeof a != "string") {
        return fe(a, f);
      } else {
        return {
          backgroundColor: a
        };
      }
    });
    const p = u(() => e.strokeLinecap === "square" || e.strokeLinecap === "butt" ? 0 : undefined);
    const l = u(() => e.trailColor ? {
      backgroundColor: e.trailColor
    } : undefined);
    const n = u(() => {
      return e.size ?? [-1, e.strokeWidth || (e.size === "small" ? 6 : 8)];
    });
    const i = u(() => W(n.value, "line", {
      strokeWidth: e.strokeWidth
    }));
    const h = u(() => {
      const {
        percent: a
      } = e;
      return x({
        width: `${P(a)}%`,
        height: `${i.value.height}px`,
        borderRadius: p.value
      }, s.value);
    });
    const d = u(() => D(e));
    const C = u(() => {
      const {
        success: a
      } = e;
      return {
        width: `${P(d.value)}%`,
        height: `${i.value.height}px`,
        borderRadius: p.value,
        backgroundColor: a == null ? undefined : a.strokeColor
      };
    });
    const v = {
      width: i.value.width < 0 ? "100%" : i.value.width,
      height: `${i.value.height}px`
    };
    return () => {
      var a;
      return g(F, null, [g("div", $($({}, r), {}, {
        class: [`${e.prefixCls}-outer`, r.class],
        style: [r.style, v]
      }), [g("div", {
        class: `${e.prefixCls}-inner`,
        style: l.value
      }, [g("div", {
        class: `${e.prefixCls}-bg`,
        style: h.value
      }, null), d.value !== undefined ? g("div", {
        class: `${e.prefixCls}-success-bg`,
        style: C.value
      }, null) : null])]), (a = o.default) === null || a === undefined ? undefined : a.call(o)]);
    };
  }
});
const ve = {
  percent: 0,
  prefixCls: "vc-progress",
  strokeColor: "#2db7f5",
  strokeLinecap: "round",
  strokeWidth: 1,
  trailColor: "#D9D9D9",
  trailWidth: 1
};
const he = e => {
  const t = B(null);
  q(() => {
    const o = Date.now();
    let r = false;
    e.value.forEach(s => {
      const p = (s == null ? undefined : s.$el) || s;
      if (!p) {
        return;
      }
      r = true;
      const l = p.style;
      l.transitionDuration = ".3s, .3s, .3s, .06s";
      if (t.value && o - t.value < 100) {
        l.transitionDuration = "0s, 0s";
      }
    });
    if (r) {
      t.value = Date.now();
    }
  });
  return e;
};
const me = {
  gapDegree: Number,
  gapPosition: {
    type: String
  },
  percent: {
    type: [Array, Number]
  },
  prefixCls: String,
  strokeColor: {
    type: [Object, String, Array]
  },
  strokeLinecap: {
    type: String
  },
  strokeWidth: Number,
  trailColor: String,
  trailWidth: Number,
  transition: String
};
function ye(e, t) {
  var o = {};
  for (var r in e) {
    if (Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0) {
      o[r] = e[r];
    }
  }
  if (e != null && typeof Object.getOwnPropertySymbols == "function") {
    for (var s = 0, r = Object.getOwnPropertySymbols(e); s < r.length; s++) {
      if (t.indexOf(r[s]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[s])) {
        o[r[s]] = e[r[s]];
      }
    }
  }
  return o;
}
let N = 0;
function R(e) {
  return +e.replace("%", "");
}
function T(e) {
  if (Array.isArray(e)) {
    return e;
  } else {
    return [e];
  }
}
function M(e, t, o, r, s = 0, p) {
  const l = 50 - r / 2;
  let n = 0;
  let i = -l;
  let h = 0;
  let d = l * -2;
  switch (p) {
    case "left":
      n = -l;
      i = 0;
      h = l * 2;
      d = 0;
      break;
    case "right":
      n = l;
      i = 0;
      h = l * -2;
      d = 0;
      break;
    case "bottom":
      i = l;
      d = l * 2;
      break;
  }
  const C = `M 50,50 m ${n},${i}
   a ${l},${l} 0 1 1 ${h},${-d}
   a ${l},${l} 0 1 1 ${-h},${d}`;
  const v = Math.PI * 2 * l;
  const a = {
    stroke: o,
    strokeDasharray: `${t / 100 * (v - s)}px ${v}px`,
    strokeDashoffset: `-${s / 2 + e / 100 * (v - s)}px`,
    transition: "stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s, stroke-width .06s ease .3s, opacity .3s ease 0s"
  };
  return {
    pathString: C,
    pathStyle: a
  };
}
const Ce = I({
  compatConfig: {
    MODE: 3
  },
  name: "VCCircle",
  props: E(me, ve),
  setup(e) {
    N += 1;
    const t = B(N);
    const o = u(() => T(e.percent));
    const r = u(() => T(e.strokeColor));
    const [s, p] = le();
    he(p);
    const l = () => {
      const {
        prefixCls: n,
        strokeWidth: i,
        strokeLinecap: h,
        gapDegree: d,
        gapPosition: C
      } = e;
      let v = 0;
      return o.value.map((a, f) => {
        const c = r.value[f] || r.value[r.value.length - 1];
        const b = Object.prototype.toString.call(c) === "[object Object]" ? `url(#${n}-gradient-${t.value})` : "";
        const {
          pathString: y,
          pathStyle: S
        } = M(v, a, c, i, d, C);
        v += a;
        const k = {
          key: f,
          d: y,
          stroke: b,
          "stroke-linecap": h,
          "stroke-width": i,
          opacity: a === 0 ? 0 : 1,
          "fill-opacity": "0",
          class: `${n}-circle-path`,
          style: S
        };
        return g("path", $({
          ref: s(f)
        }, k), null);
      });
    };
    return () => {
      const {
        prefixCls: n,
        strokeWidth: i,
        trailWidth: h,
        gapDegree: d,
        gapPosition: C,
        trailColor: v,
        strokeLinecap: a,
        strokeColor: f
      } = e;
      const c = ye(e, ["prefixCls", "strokeWidth", "trailWidth", "gapDegree", "gapPosition", "trailColor", "strokeLinecap", "strokeColor"]);
      const {
        pathString: b,
        pathStyle: y
      } = M(0, 100, v, i, d, C);
      delete c.percent;
      const S = r.value.find(m => Object.prototype.toString.call(m) === "[object Object]");
      const k = {
        d: b,
        stroke: v,
        "stroke-linecap": a,
        "stroke-width": h || i,
        "fill-opacity": "0",
        class: `${n}-circle-trail`,
        style: y
      };
      return g("svg", $({
        class: `${n}-circle`,
        viewBox: "0 0 100 100"
      }, c), [S && g("defs", null, [g("linearGradient", {
        id: `${n}-gradient-${t.value}`,
        x1: "100%",
        y1: "0%",
        x2: "0%",
        y2: "0%"
      }, [Object.keys(S).sort((m, O) => R(m) - R(O)).map((m, O) => g("stop", {
        key: O,
        offset: m,
        "stop-color": S[m]
      }, null))])]), g("path", k, null), l().reverse()]);
    };
  }
});
const be = () => x(x({}, j()), {
  strokeColor: _()
});
const $e = 3;
const Se = e => $e / e * 100;
const ke = I({
  compatConfig: {
    MODE: 3
  },
  name: "ProgressCircle",
  inheritAttrs: false,
  props: E(be(), {
    trailColor: null
  }),
  setup(e, t) {
    let {
      slots: o,
      attrs: r
    } = t;
    const s = u(() => {
      return e.width ?? 120;
    });
    const p = u(() => {
      return e.size ?? [s.value, s.value];
    });
    const l = u(() => W(p.value, "circle"));
    const n = u(() => {
      if (e.gapDegree || e.gapDegree === 0) {
        return e.gapDegree;
      }
      if (e.type === "dashboard") {
        return 75;
      }
    });
    const i = u(() => ({
      width: `${l.value.width}px`,
      height: `${l.value.height}px`,
      fontSize: `${l.value.width * 0.15 + 6}px`
    }));
    const h = u(() => {
      return e.strokeWidth ?? Math.max(Se(l.value.width), 6);
    });
    const d = u(() => e.gapPosition || e.type === "dashboard" && "bottom" || undefined);
    const C = u(() => ae(e));
    const v = u(() => Object.prototype.toString.call(e.strokeColor) === "[object Object]");
    const a = u(() => ce({
      success: e.success,
      strokeColor: e.strokeColor
    }));
    const f = u(() => ({
      [`${e.prefixCls}-inner`]: true,
      [`${e.prefixCls}-circle-gradient`]: v.value
    }));
    return () => {
      var c;
      const b = g(Ce, {
        percent: C.value,
        strokeWidth: h.value,
        trailWidth: h.value,
        strokeColor: a.value,
        strokeLinecap: e.strokeLinecap,
        trailColor: e.trailColor,
        prefixCls: e.prefixCls,
        gapDegree: n.value,
        gapPosition: d.value
      }, null);
      return g("div", $($({}, r), {}, {
        class: [f.value, r.class],
        style: [r.style, i.value]
      }), [l.value.width <= 20 ? g(z, null, {
        default: () => [g("span", null, [b])],
        title: o.default
      }) : g(F, null, [b, (c = o.default) === null || c === undefined ? undefined : c.call(o)])]);
    };
  }
});
const xe = () => x(x({}, j()), {
  steps: Number,
  strokeColor: X(),
  trailColor: String
});
const Pe = I({
  compatConfig: {
    MODE: 3
  },
  name: "Steps",
  props: xe(),
  setup(e, t) {
    let {
      slots: o
    } = t;
    const r = u(() => Math.round(e.steps * ((e.percent || 0) / 100)));
    const s = u(() => {
      return e.size ?? [e.size === "small" ? 2 : 14, e.strokeWidth || 8];
    });
    const p = u(() => W(s.value, "step", {
      steps: e.steps,
      strokeWidth: e.strokeWidth || 8
    }));
    const l = u(() => {
      const {
        steps: n,
        strokeColor: i,
        trailColor: h,
        prefixCls: d
      } = e;
      const C = [];
      for (let v = 0; v < n; v += 1) {
        const a = Array.isArray(i) ? i[v] : i;
        const f = {
          [`${d}-steps-item`]: true,
          [`${d}-steps-item-active`]: v <= r.value - 1
        };
        C.push(g("div", {
          key: v,
          class: f,
          style: {
            backgroundColor: v <= r.value - 1 ? a : h,
            width: `${p.value.width / n}px`,
            height: `${p.value.height}px`
          }
        }, null));
      }
      return C;
    });
    return () => {
      var n;
      return g("div", {
        class: `${e.prefixCls}-steps-outer`
      }, [l.value, (n = o.default) === null || n === undefined ? undefined : n.call(o)]);
    };
  }
});
const we = new Z("antProgressActive", {
  "0%": {
    transform: "translateX(-100%) scaleX(0)",
    opacity: 0.1
  },
  "20%": {
    transform: "translateX(-100%) scaleX(0)",
    opacity: 0.5
  },
  to: {
    transform: "translateX(0) scaleX(1)",
    opacity: 0
  }
});
const Oe = e => {
  const {
    componentCls: t,
    iconCls: o
  } = e;
  return {
    [t]: x(x({}, J(e)), {
      display: "inline-block",
      "&-rtl": {
        direction: "rtl"
      },
      "&-line": {
        position: "relative",
        width: "100%",
        fontSize: e.fontSize,
        marginInlineEnd: e.marginXS,
        marginBottom: e.marginXS
      },
      [`${t}-outer`]: {
        display: "inline-block",
        width: "100%"
      },
      [`&${t}-show-info`]: {
        [`${t}-outer`]: {
          marginInlineEnd: `calc(-2em - ${e.marginXS}px)`,
          paddingInlineEnd: `calc(2em + ${e.paddingXS}px)`
        }
      },
      [`${t}-inner`]: {
        position: "relative",
        display: "inline-block",
        width: "100%",
        overflow: "hidden",
        verticalAlign: "middle",
        backgroundColor: e.progressRemainingColor,
        borderRadius: e.progressLineRadius
      },
      [`${t}-inner:not(${t}-circle-gradient)`]: {
        [`${t}-circle-path`]: {
          stroke: e.colorInfo
        }
      },
      [`${t}-success-bg, ${t}-bg`]: {
        position: "relative",
        backgroundColor: e.colorInfo,
        borderRadius: e.progressLineRadius,
        transition: `all ${e.motionDurationSlow} ${e.motionEaseInOutCirc}`
      },
      [`${t}-success-bg`]: {
        position: "absolute",
        insetBlockStart: 0,
        insetInlineStart: 0,
        backgroundColor: e.colorSuccess
      },
      [`${t}-text`]: {
        display: "inline-block",
        width: "2em",
        marginInlineStart: e.marginXS,
        color: e.progressInfoTextColor,
        lineHeight: 1,
        whiteSpace: "nowrap",
        textAlign: "start",
        verticalAlign: "middle",
        wordBreak: "normal",
        [o]: {
          fontSize: e.fontSize
        }
      },
      [`&${t}-status-active`]: {
        [`${t}-bg::before`]: {
          position: "absolute",
          inset: 0,
          backgroundColor: e.colorBgContainer,
          borderRadius: e.progressLineRadius,
          opacity: 0,
          animationName: we,
          animationDuration: e.progressActiveMotionDuration,
          animationTimingFunction: e.motionEaseOutQuint,
          animationIterationCount: "infinite",
          content: "\"\""
        }
      },
      [`&${t}-status-exception`]: {
        [`${t}-bg`]: {
          backgroundColor: e.colorError
        },
        [`${t}-text`]: {
          color: e.colorError
        }
      },
      [`&${t}-status-exception ${t}-inner:not(${t}-circle-gradient)`]: {
        [`${t}-circle-path`]: {
          stroke: e.colorError
        }
      },
      [`&${t}-status-success`]: {
        [`${t}-bg`]: {
          backgroundColor: e.colorSuccess
        },
        [`${t}-text`]: {
          color: e.colorSuccess
        }
      },
      [`&${t}-status-success ${t}-inner:not(${t}-circle-gradient)`]: {
        [`${t}-circle-path`]: {
          stroke: e.colorSuccess
        }
      }
    })
  };
};
const Ie = e => {
  const {
    componentCls: t,
    iconCls: o
  } = e;
  return {
    [t]: {
      [`${t}-circle-trail`]: {
        stroke: e.progressRemainingColor
      },
      [`&${t}-circle ${t}-inner`]: {
        position: "relative",
        lineHeight: 1,
        backgroundColor: "transparent"
      },
      [`&${t}-circle ${t}-text`]: {
        position: "absolute",
        insetBlockStart: "50%",
        insetInlineStart: 0,
        width: "100%",
        margin: 0,
        padding: 0,
        color: e.colorText,
        lineHeight: 1,
        whiteSpace: "normal",
        textAlign: "center",
        transform: "translateY(-50%)",
        [o]: {
          fontSize: `${e.fontSize / e.fontSizeSM}em`
        }
      },
      [`${t}-circle&-status-exception`]: {
        [`${t}-text`]: {
          color: e.colorError
        }
      },
      [`${t}-circle&-status-success`]: {
        [`${t}-text`]: {
          color: e.colorSuccess
        }
      }
    },
    [`${t}-inline-circle`]: {
      lineHeight: 1,
      [`${t}-inner`]: {
        verticalAlign: "bottom"
      }
    }
  };
};
const De = e => {
  const {
    componentCls: t
  } = e;
  return {
    [t]: {
      [`${t}-steps`]: {
        display: "inline-block",
        "&-outer": {
          display: "flex",
          flexDirection: "row",
          alignItems: "center"
        },
        "&-item": {
          flexShrink: 0,
          minWidth: e.progressStepMinWidth,
          marginInlineEnd: e.progressStepMarginInlineEnd,
          backgroundColor: e.progressRemainingColor,
          transition: `all ${e.motionDurationSlow}`,
          "&-active": {
            backgroundColor: e.colorInfo
          }
        }
      }
    }
  };
};
const je = e => {
  const {
    componentCls: t,
    iconCls: o
  } = e;
  return {
    [t]: {
      [`${t}-small&-line, ${t}-small&-line ${t}-text ${o}`]: {
        fontSize: e.fontSizeSM
      }
    }
  };
};
const We = U("Progress", e => {
  const t = e.marginXXS / 2;
  const o = Q(e, {
    progressLineRadius: 100,
    progressInfoTextColor: e.colorText,
    progressDefaultColor: e.colorInfo,
    progressRemainingColor: e.colorFillSecondary,
    progressStepMarginInlineEnd: t,
    progressStepMinWidth: t,
    progressActiveMotionDuration: "2.4s"
  });
  return [Oe(o), Ie(o), De(o), je(o)];
});
function Ae(e, t) {
  var o = {};
  for (var r in e) {
    if (Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0) {
      o[r] = e[r];
    }
  }
  if (e != null && typeof Object.getOwnPropertySymbols == "function") {
    for (var s = 0, r = Object.getOwnPropertySymbols(e); s < r.length; s++) {
      if (t.indexOf(r[s]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[s])) {
        o[r[s]] = e[r[s]];
      }
    }
  }
  return o;
}
const _e = I({
  compatConfig: {
    MODE: 3
  },
  name: "AProgress",
  inheritAttrs: false,
  props: E(j(), {
    type: "line",
    percent: 0,
    showInfo: true,
    trailColor: null,
    size: "default",
    strokeLinecap: "round"
  }),
  slots: Object,
  setup(e, t) {
    let {
      slots: o,
      attrs: r
    } = t;
    const {
      prefixCls: s,
      direction: p
    } = ee("progress", e);
    const [l, n] = We(s);
    const i = u(() => Array.isArray(e.strokeColor) ? e.strokeColor[0] : e.strokeColor);
    const h = u(() => {
      const {
        percent: f = 0
      } = e;
      const c = D(e);
      return parseInt(c !== undefined ? c.toString() : f.toString(), 10);
    });
    const d = u(() => {
      const {
        status: f
      } = e;
      if (!ie.includes(f) && h.value >= 100) {
        return "success";
      } else {
        return f || "normal";
      }
    });
    const C = u(() => {
      const {
        type: f,
        showInfo: c,
        size: b
      } = e;
      const y = s.value;
      return {
        [y]: true,
        [`${y}-inline-circle`]: f === "circle" && W(b, "circle").width <= 20,
        [`${y}-${f === "dashboard" && "circle" || f}`]: true,
        [`${y}-status-${d.value}`]: true,
        [`${y}-show-info`]: c,
        [`${y}-${b}`]: b,
        [`${y}-rtl`]: p.value === "rtl",
        [n.value]: true
      };
    });
    const v = u(() => typeof e.strokeColor == "string" || Array.isArray(e.strokeColor) ? e.strokeColor : undefined);
    const a = () => {
      const {
        showInfo: f,
        format: c,
        type: b,
        percent: y,
        title: S
      } = e;
      const k = D(e);
      if (!f) {
        return null;
      }
      let m;
      const O = c || (o == null ? undefined : o.format) || (G => `${G}%`);
      const L = b === "line";
      if (c || o != null && o.format || d.value !== "exception" && d.value !== "success") {
        m = O(P(y), P(k));
      } else if (d.value === "exception") {
        m = L ? g(te, null, null) : g(re, null, null);
      } else if (d.value === "success") {
        m = L ? g(oe, null, null) : g(se, null, null);
      }
      return g("span", {
        class: `${s.value}-text`,
        title: S === undefined && typeof m == "string" ? m : undefined
      }, [m]);
    };
    return () => {
      const {
        type: f,
        steps: c,
        title: b
      } = e;
      const {
        class: y
      } = r;
      const S = Ae(r, ["class"]);
      const k = a();
      let m;
      if (f === "line") {
        m = c ? g(Pe, $($({}, e), {}, {
          strokeColor: v.value,
          prefixCls: s.value,
          steps: c
        }), {
          default: () => [k]
        }) : g(pe, $($({}, e), {}, {
          strokeColor: i.value,
          prefixCls: s.value,
          direction: p.value
        }), {
          default: () => [k]
        });
      } else if (f === "circle" || f === "dashboard") {
        m = g(ke, $($({}, e), {}, {
          prefixCls: s.value,
          strokeColor: i.value,
          progressStatus: d.value
        }), {
          default: () => [k]
        });
      }
      return l(g("div", $($({
        role: "progressbar"
      }, S), {}, {
        class: [C.value, y],
        title: b
      }), [m]));
    };
  }
});
const Ne = ne(_e);
export { Ne as default };
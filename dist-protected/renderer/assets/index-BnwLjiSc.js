import { g as D, _ as o, a1 as L, m as B, r as W, d as N, y as X, M as j, i as m, b0 as v, o as x, T as V, ak as G, A as w, u as q, q as y, h as H, a4 as O, s as R, U as P, ac as U, aa as F, ab as I, a9 as J, w as K } from "./index-BegIKaMc.js";
import { a as Q, r as Y } from "./class-DeKWk5pD.js";
function T(e, t) {
  return {
    [`${e}, ${e}:hover, ${e}:focus`]: {
      color: t.colorTextDisabled,
      cursor: "not-allowed"
    }
  };
}
function M(e) {
  return {
    backgroundColor: e.bgColorSelected,
    boxShadow: e.boxShadow
  };
}
const Z = o({
  overflow: "hidden"
}, L);
const k = e => {
  const {
    componentCls: t
  } = e;
  return {
    [t]: o(o(o(o(o({}, W(e)), {
      display: "inline-block",
      padding: e.segmentedContainerPadding,
      color: e.labelColor,
      backgroundColor: e.bgColor,
      borderRadius: e.borderRadius,
      transition: `all ${e.motionDurationMid} ${e.motionEaseInOut}`,
      [`${t}-group`]: {
        position: "relative",
        display: "flex",
        alignItems: "stretch",
        justifyItems: "flex-start",
        width: "100%"
      },
      [`&${t}-rtl`]: {
        direction: "rtl"
      },
      [`&${t}-block`]: {
        display: "flex"
      },
      [`&${t}-block ${t}-item`]: {
        flex: 1,
        minWidth: 0
      },
      [`${t}-item`]: {
        position: "relative",
        textAlign: "center",
        cursor: "pointer",
        transition: `color ${e.motionDurationMid} ${e.motionEaseInOut}`,
        borderRadius: e.borderRadiusSM,
        "&-selected": o(o({}, M(e)), {
          color: e.labelColorHover
        }),
        "&::after": {
          content: "\"\"",
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          insetInlineStart: 0,
          borderRadius: "inherit",
          transition: `background-color ${e.motionDurationMid}`,
          pointerEvents: "none"
        },
        [`&:hover:not(${t}-item-selected):not(${t}-item-disabled)`]: {
          color: e.labelColorHover,
          "&::after": {
            backgroundColor: e.bgColorHover
          }
        },
        "&-label": o({
          minHeight: e.controlHeight - e.segmentedContainerPadding * 2,
          lineHeight: `${e.controlHeight - e.segmentedContainerPadding * 2}px`,
          padding: `0 ${e.segmentedPaddingHorizontal}px`
        }, Z),
        "&-icon + *": {
          marginInlineStart: e.marginSM / 2
        },
        "&-input": {
          position: "absolute",
          insetBlockStart: 0,
          insetInlineStart: 0,
          width: 0,
          height: 0,
          opacity: 0,
          pointerEvents: "none"
        }
      },
      [`${t}-thumb`]: o(o({}, M(e)), {
        position: "absolute",
        insetBlockStart: 0,
        insetInlineStart: 0,
        width: 0,
        height: "100%",
        padding: `${e.paddingXXS}px 0`,
        borderRadius: e.borderRadiusSM,
        [`& ~ ${t}-item:not(${t}-item-selected):not(${t}-item-disabled)::after`]: {
          backgroundColor: "transparent"
        }
      }),
      [`&${t}-lg`]: {
        borderRadius: e.borderRadiusLG,
        [`${t}-item-label`]: {
          minHeight: e.controlHeightLG - e.segmentedContainerPadding * 2,
          lineHeight: `${e.controlHeightLG - e.segmentedContainerPadding * 2}px`,
          padding: `0 ${e.segmentedPaddingHorizontal}px`,
          fontSize: e.fontSizeLG
        },
        [`${t}-item, ${t}-thumb`]: {
          borderRadius: e.borderRadius
        }
      },
      [`&${t}-sm`]: {
        borderRadius: e.borderRadiusSM,
        [`${t}-item-label`]: {
          minHeight: e.controlHeightSM - e.segmentedContainerPadding * 2,
          lineHeight: `${e.controlHeightSM - e.segmentedContainerPadding * 2}px`,
          padding: `0 ${e.segmentedPaddingHorizontalSM}px`
        },
        [`${t}-item, ${t}-thumb`]: {
          borderRadius: e.borderRadiusXS
        }
      }
    }), T(`&-disabled ${t}-item`, e)), T(`${t}-item-disabled`, e)), {
      [`${t}-thumb-motion-appear-active`]: {
        transition: `transform ${e.motionDurationSlow} ${e.motionEaseInOut}, width ${e.motionDurationSlow} ${e.motionEaseInOut}`,
        willChange: "transform, width"
      }
    })
  };
};
const ee = D("Segmented", e => {
  const {
    lineWidthBold: t,
    lineWidth: r,
    colorTextLabel: g,
    colorText: s,
    colorFillSecondary: l,
    colorBgLayout: n,
    colorBgElevated: u
  } = e;
  const c = B(e, {
    segmentedPaddingHorizontal: e.controlPaddingHorizontal - r,
    segmentedPaddingHorizontalSM: e.controlPaddingHorizontalSM - r,
    segmentedContainerPadding: t,
    labelColor: g,
    labelColorHover: s,
    bgColor: n,
    bgColorHover: l,
    bgColorSelected: u
  });
  return [k(c)];
});
const E = e => e ? {
  left: e.offsetLeft,
  right: e.parentElement.clientWidth - e.clientWidth - e.offsetLeft,
  width: e.clientWidth
} : null;
const p = e => e !== undefined ? `${e}px` : undefined;
const te = N({
  props: {
    value: v(),
    getValueIndex: v(),
    prefixCls: v(),
    motionName: v(),
    onMotionStart: v(),
    onMotionEnd: v(),
    direction: v(),
    containerRef: v()
  },
  emits: ["motionStart", "motionEnd"],
  setup(e, t) {
    let {
      emit: r
    } = t;
    const g = w();
    const s = i => {
      var a;
      const S = e.getValueIndex(i);
      const h = (a = e.containerRef.value) === null || a === undefined ? undefined : a.querySelectorAll(`.${e.prefixCls}-item`)[S];
      return (h == null ? undefined : h.offsetParent) && h;
    };
    const l = w(null);
    const n = w(null);
    X(() => e.value, (i, a) => {
      const S = s(a);
      const h = s(i);
      const A = E(S);
      const _ = E(h);
      l.value = A;
      n.value = _;
      r(S && h ? "motionStart" : "motionEnd");
    }, {
      flush: "post"
    });
    const u = x(() => {
      if (e.direction === "rtl") {
        return p(-l.value?.right);
      } else {
        return p(l.value?.left);
      }
    });
    const c = x(() => {
      if (e.direction === "rtl") {
        return p(-n.value?.right);
      } else {
        return p(n.value?.left);
      }
    });
    let d;
    const f = i => {
      clearTimeout(d);
      G(() => {
        if (i) {
          i.style.transform = "translateX(var(--thumb-start-left))";
          i.style.width = "var(--thumb-start-width)";
        }
      });
    };
    const b = i => {
      d = setTimeout(() => {
        if (i) {
          Q(i, `${e.motionName}-appear-active`);
          i.style.transform = "translateX(var(--thumb-active-left))";
          i.style.width = "var(--thumb-active-width)";
        }
      });
    };
    const $ = i => {
      l.value = null;
      n.value = null;
      if (i) {
        i.style.transform = null;
        i.style.width = null;
        Y(i, `${e.motionName}-appear-active`);
      }
      r("motionEnd");
    };
    const C = x(() => {
      return {
        "--thumb-start-left": u.value,
        "--thumb-start-width": p(l.value?.width),
        "--thumb-active-left": c.value,
        "--thumb-active-width": p(n.value?.width)
      };
    });
    j(() => {
      clearTimeout(d);
    });
    return () => {
      const i = {
        ref: g,
        style: C.value,
        class: [`${e.prefixCls}-thumb`]
      };
      return m(V, {
        appear: true,
        onBeforeEnter: f,
        onEnter: b,
        onAfterEnter: $
      }, {
        default: () => [!l.value || !n.value ? null : m("div", i, null)]
      });
    };
  }
});
function ie(e) {
  return e.map(t => typeof t == "object" && t !== null ? t : {
    label: t == null ? undefined : t.toString(),
    title: t == null ? undefined : t.toString(),
    value: t
  });
}
const ae = () => ({
  prefixCls: String,
  options: J(),
  block: I(),
  disabled: I(),
  size: F(),
  value: o(o({}, U([String, Number])), {
    required: true
  }),
  motionName: String,
  onChange: P(),
  "onUpdate:value": P()
});
const z = (e, t) => {
  let {
    slots: r,
    emit: g
  } = t;
  const {
    value: s,
    disabled: l,
    payload: n,
    title: u,
    prefixCls: c,
    label: d = r.label,
    checked: f,
    className: b
  } = e;
  const $ = C => {
    if (!l) {
      g("change", C, s);
    }
  };
  return m("label", {
    class: H({
      [`${c}-item-disabled`]: l
    }, b)
  }, [m("input", {
    class: `${c}-item-input`,
    type: "radio",
    disabled: l,
    checked: f,
    onChange: $
  }, null), m("div", {
    class: `${c}-item-label`,
    title: typeof u == "string" ? u : ""
  }, [typeof d == "function" ? d({
    value: s,
    disabled: l,
    payload: n,
    title: u
  }) : d ?? s])]);
};
z.inheritAttrs = false;
const le = N({
  name: "ASegmented",
  inheritAttrs: false,
  props: O(ae(), {
    options: [],
    motionName: "thumb-motion"
  }),
  slots: Object,
  setup(e, t) {
    let {
      emit: r,
      slots: g,
      attrs: s
    } = t;
    const {
      prefixCls: l,
      direction: n,
      size: u
    } = q("segmented", e);
    const [c, d] = ee(l);
    const f = R();
    const b = R(false);
    const $ = x(() => ie(e.options));
    const C = (i, a) => {
      if (!e.disabled) {
        r("update:value", a);
        r("change", a);
      }
    };
    return () => {
      const i = l.value;
      return c(m("div", y(y({}, s), {}, {
        class: H(i, {
          [d.value]: true,
          [`${i}-block`]: e.block,
          [`${i}-disabled`]: e.disabled,
          [`${i}-lg`]: u.value == "large",
          [`${i}-sm`]: u.value == "small",
          [`${i}-rtl`]: n.value === "rtl"
        }, s.class),
        ref: f
      }), [m("div", {
        class: `${i}-group`
      }, [m(te, {
        containerRef: f,
        prefixCls: i,
        value: e.value,
        motionName: `${i}-${e.motionName}`,
        direction: n.value,
        getValueIndex: a => $.value.findIndex(S => S.value === a),
        onMotionStart: () => {
          b.value = true;
        },
        onMotionEnd: () => {
          b.value = false;
        }
      }, null), $.value.map(a => m(z, y(y({
        key: a.value,
        prefixCls: i,
        checked: a.value === e.value,
        onChange: C
      }, a), {}, {
        className: H(a.className, `${i}-item`, {
          [`${i}-item-selected`]: a.value === e.value && !b.value
        }),
        disabled: !!e.disabled || !!a.disabled
      }), g))])]));
    };
  }
});
const re = K(le);
export { re as default };
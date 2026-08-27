import { V, W as K, g as oo, m as eo, _ as I, r as j, K as to, bR as U, d as A, b3 as L, u as F, a3 as ro, h as N, i as T, q as D, aW as no, o as O, bn as _, A as H, P as X, U as E, ab as z, y as ao, aa as W, a9 as io, ak as lo } from "./index-BegIKaMc.js";
import { V as so } from "./Checkbox-BeHtxM1U.js";
const q = Symbol("radioGroupContextKey");
const co = o => {
  K(q, o);
};
const uo = () => V(q, undefined);
const J = Symbol("radioOptionTypeContextKey");
const bo = o => {
  K(J, o);
};
const po = () => V(J, undefined);
const go = new to("antRadioEffect", {
  "0%": {
    transform: "scale(1)",
    opacity: 0.5
  },
  "100%": {
    transform: "scale(1.6)",
    opacity: 0
  }
});
const ho = o => {
  const {
    componentCls: r,
    antCls: n
  } = o;
  const t = `${r}-group`;
  return {
    [t]: I(I({}, j(o)), {
      display: "inline-block",
      fontSize: 0,
      [`&${t}-rtl`]: {
        direction: "rtl"
      },
      [`${n}-badge ${n}-badge-count`]: {
        zIndex: 1
      },
      [`> ${n}-badge:not(:first-child) > ${n}-button-wrapper`]: {
        borderInlineStart: "none"
      }
    })
  };
};
const Co = o => {
  const {
    componentCls: r,
    radioWrapperMarginRight: n,
    radioCheckedColor: t,
    radioSize: e,
    motionDurationSlow: d,
    motionDurationMid: s,
    motionEaseInOut: w,
    motionEaseInOutCirc: C,
    radioButtonBg: p,
    colorBorder: B,
    lineWidth: g,
    radioDotSize: f,
    colorBgContainerDisabled: y,
    colorTextDisabled: c,
    paddingXS: h,
    radioDotDisabledColor: a,
    lineType: m,
    radioDotDisabledSize: u,
    wireframe: b,
    colorWhite: x
  } = o;
  const i = `${r}-inner`;
  return {
    [`${r}-wrapper`]: I(I({}, j(o)), {
      position: "relative",
      display: "inline-flex",
      alignItems: "baseline",
      marginInlineStart: 0,
      marginInlineEnd: n,
      cursor: "pointer",
      [`&${r}-wrapper-rtl`]: {
        direction: "rtl"
      },
      "&-disabled": {
        cursor: "not-allowed",
        color: o.colorTextDisabled
      },
      "&::after": {
        display: "inline-block",
        width: 0,
        overflow: "hidden",
        content: "\"\\a0\""
      },
      [`${r}-checked::after`]: {
        position: "absolute",
        insetBlockStart: 0,
        insetInlineStart: 0,
        width: "100%",
        height: "100%",
        border: `${g}px ${m} ${t}`,
        borderRadius: "50%",
        visibility: "hidden",
        animationName: go,
        animationDuration: d,
        animationTimingFunction: w,
        animationFillMode: "both",
        content: "\"\""
      },
      [r]: I(I({}, j(o)), {
        position: "relative",
        display: "inline-block",
        outline: "none",
        cursor: "pointer",
        alignSelf: "center"
      }),
      [`${r}-wrapper:hover &,
        &:hover ${i}`]: {
        borderColor: t
      },
      [`${r}-input:focus-visible + ${i}`]: I({}, U(o)),
      [`${r}:hover::after, ${r}-wrapper:hover &::after`]: {
        visibility: "visible"
      },
      [`${r}-inner`]: {
        "&::after": {
          boxSizing: "border-box",
          position: "absolute",
          insetBlockStart: "50%",
          insetInlineStart: "50%",
          display: "block",
          width: e,
          height: e,
          marginBlockStart: e / -2,
          marginInlineStart: e / -2,
          backgroundColor: b ? t : x,
          borderBlockStart: 0,
          borderInlineStart: 0,
          borderRadius: e,
          transform: "scale(0)",
          opacity: 0,
          transition: `all ${d} ${C}`,
          content: "\"\""
        },
        boxSizing: "border-box",
        position: "relative",
        insetBlockStart: 0,
        insetInlineStart: 0,
        display: "block",
        width: e,
        height: e,
        backgroundColor: p,
        borderColor: B,
        borderStyle: "solid",
        borderWidth: g,
        borderRadius: "50%",
        transition: `all ${s}`
      },
      [`${r}-input`]: {
        position: "absolute",
        insetBlockStart: 0,
        insetInlineEnd: 0,
        insetBlockEnd: 0,
        insetInlineStart: 0,
        zIndex: 1,
        cursor: "pointer",
        opacity: 0
      },
      [`${r}-checked`]: {
        [i]: {
          borderColor: t,
          backgroundColor: b ? p : t,
          "&::after": {
            transform: `scale(${f / e})`,
            opacity: 1,
            transition: `all ${d} ${C}`
          }
        }
      },
      [`${r}-disabled`]: {
        cursor: "not-allowed",
        [i]: {
          backgroundColor: y,
          borderColor: B,
          cursor: "not-allowed",
          "&::after": {
            backgroundColor: a
          }
        },
        [`${r}-input`]: {
          cursor: "not-allowed"
        },
        [`${r}-disabled + span`]: {
          color: c,
          cursor: "not-allowed"
        },
        [`&${r}-checked`]: {
          [i]: {
            "&::after": {
              transform: `scale(${u / e})`
            }
          }
        }
      },
      [`span${r} + *`]: {
        paddingInlineStart: h,
        paddingInlineEnd: h
      }
    })
  };
};
const fo = o => {
  const {
    radioButtonColor: r,
    controlHeight: n,
    componentCls: t,
    lineWidth: e,
    lineType: d,
    colorBorder: s,
    motionDurationSlow: w,
    motionDurationMid: C,
    radioButtonPaddingHorizontal: p,
    fontSize: B,
    radioButtonBg: g,
    fontSizeLG: f,
    controlHeightLG: y,
    controlHeightSM: c,
    paddingXS: h,
    borderRadius: a,
    borderRadiusSM: m,
    borderRadiusLG: u,
    radioCheckedColor: b,
    radioButtonCheckedBg: x,
    radioButtonHoverColor: i,
    radioButtonActiveColor: v,
    radioSolidCheckedColor: R,
    colorTextDisabled: l,
    colorBgContainerDisabled: S,
    radioDisabledButtonCheckedColor: P,
    radioDisabledButtonCheckedBg: G
  } = o;
  return {
    [`${t}-button-wrapper`]: {
      position: "relative",
      display: "inline-block",
      height: n,
      margin: 0,
      paddingInline: p,
      paddingBlock: 0,
      color: r,
      fontSize: B,
      lineHeight: `${n - e * 2}px`,
      background: g,
      border: `${e}px ${d} ${s}`,
      borderBlockStartWidth: e + 0.02,
      borderInlineStartWidth: 0,
      borderInlineEndWidth: e,
      cursor: "pointer",
      transition: [`color ${C}`, `background ${C}`, `border-color ${C}`, `box-shadow ${C}`].join(","),
      a: {
        color: r
      },
      [`> ${t}-button`]: {
        position: "absolute",
        insetBlockStart: 0,
        insetInlineStart: 0,
        zIndex: -1,
        width: "100%",
        height: "100%"
      },
      "&:not(:first-child)": {
        "&::before": {
          position: "absolute",
          insetBlockStart: -e,
          insetInlineStart: -e,
          display: "block",
          boxSizing: "content-box",
          width: 1,
          height: "100%",
          paddingBlock: e,
          paddingInline: 0,
          backgroundColor: s,
          transition: `background-color ${w}`,
          content: "\"\""
        }
      },
      "&:first-child": {
        borderInlineStart: `${e}px ${d} ${s}`,
        borderStartStartRadius: a,
        borderEndStartRadius: a
      },
      "&:last-child": {
        borderStartEndRadius: a,
        borderEndEndRadius: a
      },
      "&:first-child:last-child": {
        borderRadius: a
      },
      [`${t}-group-large &`]: {
        height: y,
        fontSize: f,
        lineHeight: `${y - e * 2}px`,
        "&:first-child": {
          borderStartStartRadius: u,
          borderEndStartRadius: u
        },
        "&:last-child": {
          borderStartEndRadius: u,
          borderEndEndRadius: u
        }
      },
      [`${t}-group-small &`]: {
        height: c,
        paddingInline: h - e,
        paddingBlock: 0,
        lineHeight: `${c - e * 2}px`,
        "&:first-child": {
          borderStartStartRadius: m,
          borderEndStartRadius: m
        },
        "&:last-child": {
          borderStartEndRadius: m,
          borderEndEndRadius: m
        }
      },
      "&:hover": {
        position: "relative",
        color: b
      },
      "&:has(:focus-visible)": I({}, U(o)),
      [`${t}-inner, input[type='checkbox'], input[type='radio']`]: {
        width: 0,
        height: 0,
        opacity: 0,
        pointerEvents: "none"
      },
      [`&-checked:not(${t}-button-wrapper-disabled)`]: {
        zIndex: 1,
        color: b,
        background: x,
        borderColor: b,
        "&::before": {
          backgroundColor: b
        },
        "&:first-child": {
          borderColor: b
        },
        "&:hover": {
          color: i,
          borderColor: i,
          "&::before": {
            backgroundColor: i
          }
        },
        "&:active": {
          color: v,
          borderColor: v,
          "&::before": {
            backgroundColor: v
          }
        }
      },
      [`${t}-group-solid &-checked:not(${t}-button-wrapper-disabled)`]: {
        color: R,
        background: b,
        borderColor: b,
        "&:hover": {
          color: R,
          background: i,
          borderColor: i
        },
        "&:active": {
          color: R,
          background: v,
          borderColor: v
        }
      },
      "&-disabled": {
        color: l,
        backgroundColor: S,
        borderColor: s,
        cursor: "not-allowed",
        "&:first-child, &:hover": {
          color: l,
          backgroundColor: S,
          borderColor: s
        }
      },
      [`&-disabled${t}-button-wrapper-checked`]: {
        color: P,
        backgroundColor: G,
        borderColor: s,
        boxShadow: "none"
      }
    }
  };
};
const Q = oo("Radio", o => {
  const {
    padding: r,
    lineWidth: n,
    controlItemBgActiveDisabled: t,
    colorTextDisabled: e,
    colorBgContainer: d,
    fontSizeLG: s,
    controlOutline: w,
    colorPrimaryHover: C,
    colorPrimaryActive: p,
    colorText: B,
    colorPrimary: g,
    marginXS: f,
    controlOutlineWidth: y,
    colorTextLightSolid: c,
    wireframe: h
  } = o;
  const a = `0 0 0 ${y}px ${w}`;
  const m = a;
  const u = s;
  const b = 4;
  const x = u - b * 2;
  const i = h ? x : u - (b + n) * 2;
  const v = g;
  const R = B;
  const l = C;
  const S = p;
  const P = r - n;
  const $ = eo(o, {
    radioFocusShadow: a,
    radioButtonFocusShadow: m,
    radioSize: u,
    radioDotSize: i,
    radioDotDisabledSize: x,
    radioCheckedColor: v,
    radioDotDisabledColor: e,
    radioSolidCheckedColor: c,
    radioButtonBg: d,
    radioButtonCheckedBg: d,
    radioButtonColor: R,
    radioButtonHoverColor: l,
    radioButtonActiveColor: S,
    radioButtonPaddingHorizontal: P,
    radioDisabledButtonCheckedBg: t,
    radioDisabledButtonCheckedColor: e,
    radioWrapperMarginRight: f
  });
  return [ho($), Co($), fo($)];
});
function vo(o, r) {
  var n = {};
  for (var t in o) {
    if (Object.prototype.hasOwnProperty.call(o, t) && r.indexOf(t) < 0) {
      n[t] = o[t];
    }
  }
  if (o != null && typeof Object.getOwnPropertySymbols == "function") {
    for (var e = 0, t = Object.getOwnPropertySymbols(o); e < t.length; e++) {
      if (r.indexOf(t[e]) < 0 && Object.prototype.propertyIsEnumerable.call(o, t[e])) {
        n[t[e]] = o[t[e]];
      }
    }
  }
  return n;
}
const Y = () => ({
  prefixCls: String,
  checked: z(),
  disabled: z(),
  isGroup: z(),
  value: X.any,
  name: String,
  id: String,
  autofocus: z(),
  onChange: E(),
  onFocus: E(),
  onBlur: E(),
  onClick: E(),
  "onUpdate:checked": E(),
  "onUpdate:value": E()
});
const k = A({
  compatConfig: {
    MODE: 3
  },
  name: "ARadio",
  inheritAttrs: false,
  props: Y(),
  setup(o, r) {
    let {
      emit: n,
      expose: t,
      slots: e,
      attrs: d
    } = r;
    const s = L();
    const w = no.useInject();
    const C = po();
    const p = uo();
    const B = _();
    const g = O(() => {
      return h.value ?? B.value;
    });
    const f = H();
    const {
      prefixCls: y,
      direction: c,
      disabled: h
    } = F("radio", o);
    const a = O(() => (p == null ? undefined : p.optionType.value) === "button" || C === "button" ? `${y.value}-button` : y.value);
    const m = _();
    const [u, b] = Q(y);
    t({
      focus: () => {
        f.value.focus();
      },
      blur: () => {
        f.value.blur();
      }
    });
    const v = l => {
      const S = l.target.checked;
      n("update:checked", S);
      n("update:value", S);
      n("change", l);
      s.onFieldChange();
    };
    const R = l => {
      n("change", l);
      if (p && p.onChange) {
        p.onChange(l);
      }
    };
    return () => {
      const S = p;
      const {
        prefixCls: P,
        id: G = s.id.value
      } = o;
      const M = vo(o, ["prefixCls", "id"]);
      const $ = I(I({
        prefixCls: a.value,
        id: G
      }, ro(M, ["onUpdate:checked", "onUpdate:value"])), {
        disabled: h.value ?? m.value
      });
      if (S) {
        $.name = S.name.value;
        $.onChange = R;
        $.checked = o.value === S.value.value;
        $.disabled = g.value || S.disabled.value;
      } else {
        $.onChange = v;
      }
      const Z = N({
        [`${a.value}-wrapper`]: true,
        [`${a.value}-wrapper-checked`]: $.checked,
        [`${a.value}-wrapper-disabled`]: $.disabled,
        [`${a.value}-wrapper-rtl`]: c.value === "rtl",
        [`${a.value}-wrapper-in-form-item`]: w.isFormItemInput
      }, d.class, b.value);
      return u(T("label", D(D({}, d), {}, {
        class: Z
      }), [T(so, D(D({}, $), {}, {
        type: "radio",
        ref: f
      }), null), e.default && T("span", null, [e.default()])]));
    };
  }
});
const mo = () => ({
  prefixCls: String,
  value: X.any,
  size: W(),
  options: io(),
  disabled: z(),
  name: String,
  buttonStyle: W("outline"),
  id: String,
  optionType: W("default"),
  onChange: E(),
  "onUpdate:value": E()
});
const So = A({
  compatConfig: {
    MODE: 3
  },
  name: "ARadioGroup",
  inheritAttrs: false,
  props: mo(),
  setup(o, r) {
    let {
      slots: n,
      emit: t,
      attrs: e
    } = r;
    const d = L();
    const {
      prefixCls: s,
      direction: w,
      size: C
    } = F("radio", o);
    const [p, B] = Q(s);
    const g = H(o.value);
    const f = H(false);
    ao(() => o.value, c => {
      g.value = c;
      f.value = false;
    });
    co({
      onChange: c => {
        const h = g.value;
        const {
          value: a
        } = c.target;
        if (!("value" in o)) {
          g.value = a;
        }
        if (!f.value && a !== h) {
          f.value = true;
          t("update:value", a);
          t("change", c);
          d.onFieldChange();
        }
        lo(() => {
          f.value = false;
        });
      },
      value: g,
      disabled: O(() => o.disabled),
      name: O(() => o.name),
      optionType: O(() => o.optionType)
    });
    return () => {
      var c;
      const {
        options: h,
        buttonStyle: a,
        id: m = d.id.value
      } = o;
      const u = `${s.value}-group`;
      const b = N(u, `${u}-${a}`, {
        [`${u}-${C.value}`]: C.value,
        [`${u}-rtl`]: w.value === "rtl"
      }, e.class, B.value);
      let x = null;
      if (h && h.length > 0) {
        x = h.map(i => {
          if (typeof i == "string" || typeof i == "number") {
            return T(k, {
              key: i,
              prefixCls: s.value,
              disabled: o.disabled,
              value: i,
              checked: g.value === i
            }, {
              default: () => [i]
            });
          }
          const {
            value: v,
            disabled: R,
            label: l
          } = i;
          return T(k, {
            key: `radio-group-value-options-${v}`,
            prefixCls: s.value,
            disabled: R || o.disabled,
            value: v,
            checked: g.value === v
          }, {
            default: () => [l]
          });
        });
      } else {
        x = (c = n.default) === null || c === undefined ? undefined : c.call(n);
      }
      return p(T("div", D(D({}, e), {}, {
        class: b,
        id: m
      }), [x]));
    };
  }
});
const $o = A({
  compatConfig: {
    MODE: 3
  },
  name: "ARadioButton",
  inheritAttrs: false,
  props: Y(),
  setup(o, r) {
    let {
      slots: n,
      attrs: t
    } = r;
    const {
      prefixCls: e
    } = F("radio", o);
    bo("button");
    return () => {
      var d;
      return T(k, D(D(D({}, t), o), {}, {
        prefixCls: e.value
      }), {
        default: () => [(d = n.default) === null || d === undefined ? undefined : d.call(n)]
      });
    };
  }
});
k.Group = So;
k.Button = $o;
k.install = function (o) {
  o.component(k.name, k);
  o.component(k.Group.name, k.Group);
  o.component(k.Button.name, k.Button);
  return o;
};
export { $o as Button, So as Group, $o as RadioButton, So as RadioGroup, k as default };
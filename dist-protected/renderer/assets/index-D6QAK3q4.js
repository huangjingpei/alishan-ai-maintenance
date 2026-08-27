import { g as te, m as le, K as ie, _ as s, r as F, bR as se, ab as m, U as I, a9 as A, P as ce, aa as de, d as K, b3 as X, u as L, Q as ue, M as be, S as ve, bV as he, H as fe, h as W, i as P, q as D, aW as me, bn as pe, V as ge, o as S, A as w, y as U, W as xe } from "./index-BegIKaMc.js";
import { V as Ce } from "./Checkbox-BeHtxM1U.js";
const $e = new ie("antCheckboxEffect", {
  "0%": {
    transform: "scale(1)",
    opacity: 0.5
  },
  "100%": {
    transform: "scale(1.6)",
    opacity: 0
  }
});
const ye = e => {
  const {
    checkboxCls: a
  } = e;
  const n = `${a}-wrapper`;
  return [{
    [`${a}-group`]: s(s({}, F(e)), {
      display: "inline-flex",
      flexWrap: "wrap",
      columnGap: e.marginXS,
      [`> ${e.antCls}-row`]: {
        flex: 1
      }
    }),
    [n]: s(s({}, F(e)), {
      display: "inline-flex",
      alignItems: "baseline",
      cursor: "pointer",
      "&:after": {
        display: "inline-block",
        width: 0,
        overflow: "hidden",
        content: "'\\a0'"
      },
      [`& + ${n}`]: {
        marginInlineStart: 0
      },
      [`&${n}-in-form-item`]: {
        "input[type=\"checkbox\"]": {
          width: 14,
          height: 14
        }
      }
    }),
    [a]: s(s({}, F(e)), {
      position: "relative",
      whiteSpace: "nowrap",
      lineHeight: 1,
      cursor: "pointer",
      alignSelf: "center",
      [`${a}-input`]: {
        position: "absolute",
        inset: 0,
        zIndex: 1,
        cursor: "pointer",
        opacity: 0,
        margin: 0,
        [`&:focus-visible + ${a}-inner`]: s({}, se(e))
      },
      [`${a}-inner`]: {
        boxSizing: "border-box",
        position: "relative",
        top: 0,
        insetInlineStart: 0,
        display: "block",
        width: e.checkboxSize,
        height: e.checkboxSize,
        direction: "ltr",
        backgroundColor: e.colorBgContainer,
        border: `${e.lineWidth}px ${e.lineType} ${e.colorBorder}`,
        borderRadius: e.borderRadiusSM,
        borderCollapse: "separate",
        transition: `all ${e.motionDurationSlow}`,
        "&:after": {
          boxSizing: "border-box",
          position: "absolute",
          top: "50%",
          insetInlineStart: "21.5%",
          display: "table",
          width: e.checkboxSize / 14 * 5,
          height: e.checkboxSize / 14 * 8,
          border: `${e.lineWidthBold}px solid ${e.colorWhite}`,
          borderTop: 0,
          borderInlineStart: 0,
          transform: "rotate(45deg) scale(0) translate(-50%,-50%)",
          opacity: 0,
          content: "\"\"",
          transition: `all ${e.motionDurationFast} ${e.motionEaseInBack}, opacity ${e.motionDurationFast}`
        }
      },
      "& + span": {
        paddingInlineStart: e.paddingXS,
        paddingInlineEnd: e.paddingXS
      }
    })
  }, {
    [a]: {
      "&-indeterminate": {
        [`${a}-inner`]: {
          "&:after": {
            top: "50%",
            insetInlineStart: "50%",
            width: e.fontSizeLG / 2,
            height: e.fontSizeLG / 2,
            backgroundColor: e.colorPrimary,
            border: 0,
            transform: "translate(-50%, -50%) scale(1)",
            opacity: 1,
            content: "\"\""
          }
        }
      }
    }
  }, {
    [`${n}:hover ${a}:after`]: {
      visibility: "visible"
    },
    [`
        ${n}:not(${n}-disabled),
        ${a}:not(${a}-disabled)
      `]: {
      [`&:hover ${a}-inner`]: {
        borderColor: e.colorPrimary
      }
    },
    [`${n}:not(${n}-disabled)`]: {
      [`&:hover ${a}-checked:not(${a}-disabled) ${a}-inner`]: {
        backgroundColor: e.colorPrimaryHover,
        borderColor: "transparent"
      },
      [`&:hover ${a}-checked:not(${a}-disabled):after`]: {
        borderColor: e.colorPrimaryHover
      }
    }
  }, {
    [`${a}-checked`]: {
      [`${a}-inner`]: {
        backgroundColor: e.colorPrimary,
        borderColor: e.colorPrimary,
        "&:after": {
          opacity: 1,
          transform: "rotate(45deg) scale(1) translate(-50%,-50%)",
          transition: `all ${e.motionDurationMid} ${e.motionEaseOutBack} ${e.motionDurationFast}`
        }
      },
      "&:after": {
        position: "absolute",
        top: 0,
        insetInlineStart: 0,
        width: "100%",
        height: "100%",
        borderRadius: e.borderRadiusSM,
        visibility: "hidden",
        border: `${e.lineWidthBold}px solid ${e.colorPrimary}`,
        animationName: $e,
        animationDuration: e.motionDurationSlow,
        animationTimingFunction: "ease-in-out",
        animationFillMode: "backwards",
        content: "\"\"",
        transition: `all ${e.motionDurationSlow}`
      }
    },
    [`
        ${n}-checked:not(${n}-disabled),
        ${a}-checked:not(${a}-disabled)
      `]: {
      [`&:hover ${a}-inner`]: {
        backgroundColor: e.colorPrimaryHover,
        borderColor: "transparent"
      },
      [`&:hover ${a}:after`]: {
        borderColor: e.colorPrimaryHover
      }
    }
  }, {
    [`${n}-disabled`]: {
      cursor: "not-allowed"
    },
    [`${a}-disabled`]: {
      [`&, ${a}-input`]: {
        cursor: "not-allowed",
        pointerEvents: "none"
      },
      [`${a}-inner`]: {
        background: e.colorBgContainerDisabled,
        borderColor: e.colorBorder,
        "&:after": {
          borderColor: e.colorTextDisabled
        }
      },
      "&:after": {
        display: "none"
      },
      "& + span": {
        color: e.colorTextDisabled
      },
      [`&${a}-indeterminate ${a}-inner::after`]: {
        background: e.colorTextDisabled
      }
    }
  }];
};
function Se(e, a) {
  const n = le(a, {
    checkboxCls: `.${e}`,
    checkboxSize: a.controlInteractiveSize
  });
  return [ye(n)];
}
const q = te("Checkbox", (e, a) => {
  let {
    prefixCls: n
  } = a;
  return [Se(n, e)];
});
const we = () => ({
  name: String,
  prefixCls: String,
  options: A([]),
  disabled: Boolean,
  id: String
});
const Q = () => s(s({}, we()), {
  defaultValue: A(),
  value: A(),
  onChange: I(),
  "onUpdate:value": I()
});
const Ie = () => ({
  prefixCls: String,
  defaultChecked: m(),
  checked: m(),
  disabled: m(),
  isGroup: m(),
  value: ce.any,
  name: String,
  id: String,
  indeterminate: m(),
  type: de("checkbox"),
  autofocus: m(),
  onChange: I(),
  "onUpdate:checked": I(),
  onClick: I(),
  skipGroup: m(false)
});
const J = () => s(s({}, Ie()), {
  indeterminate: m(false)
});
const Y = Symbol("CheckboxGroupContext");
function N(e, a) {
  var n = {};
  for (var t in e) {
    if (Object.prototype.hasOwnProperty.call(e, t) && a.indexOf(t) < 0) {
      n[t] = e[t];
    }
  }
  if (e != null && typeof Object.getOwnPropertySymbols == "function") {
    for (var d = 0, t = Object.getOwnPropertySymbols(e); d < t.length; d++) {
      if (a.indexOf(t[d]) < 0 && Object.prototype.propertyIsEnumerable.call(e, t[d])) {
        n[t[d]] = e[t[d]];
      }
    }
  }
  return n;
}
const C = K({
  compatConfig: {
    MODE: 3
  },
  name: "ACheckbox",
  inheritAttrs: false,
  __ANT_CHECKBOX: true,
  props: J(),
  setup(e, a) {
    let {
      emit: n,
      attrs: t,
      slots: d,
      expose: V
    } = a;
    const $ = X();
    const k = me.useInject();
    const {
      prefixCls: u,
      direction: p,
      disabled: _
    } = L("checkbox", e);
    const T = pe();
    const [b, f] = q(u);
    const l = ge(Y, undefined);
    const g = Symbol("checkboxUniId");
    const M = S(() => (l == null ? undefined : l.disabled.value) || _.value);
    ue(() => {
      if (!e.skipGroup && l) {
        l.registerValue(g, e.value);
      }
    });
    be(() => {
      if (l) {
        l.cancelValue(g);
      }
    });
    ve(() => {
      he(e.checked !== undefined || !!l || e.value === undefined);
    });
    const B = r => {
      const c = r.target.checked;
      n("update:checked", c);
      n("change", r);
      $.onFieldChange();
    };
    const x = w();
    V({
      focus: () => {
        var r;
        if ((r = x.value) !== null && r !== undefined) {
          r.focus();
        }
      },
      blur: () => {
        var r;
        if ((r = x.value) !== null && r !== undefined) {
          r.blur();
        }
      }
    });
    return () => {
      var r;
      const c = fe((r = d.default) === null || r === undefined ? undefined : r.call(d));
      const {
        indeterminate: i,
        skipGroup: v,
        id: j = $.id.value
      } = e;
      const z = N(e, ["indeterminate", "skipGroup", "id"]);
      const {
        onMouseenter: E,
        onMouseleave: y,
        onInput: Pe,
        class: ee,
        style: ae
      } = t;
      const ne = N(t, ["onMouseenter", "onMouseleave", "onInput", "class", "style"]);
      const h = s(s(s(s({}, z), {
        id: j,
        prefixCls: u.value
      }), ne), {
        disabled: M.value
      });
      if (l && !v) {
        h.onChange = function () {
          for (var H = arguments.length, R = new Array(H), O = 0; O < H; O++) {
            R[O] = arguments[O];
          }
          n("change", ...R);
          l.toggleOption({
            label: c,
            value: e.value
          });
        };
        h.name = l.name.value;
        h.checked = l.mergedValue.value.includes(e.value);
        h.disabled = M.value || T.value;
        h.indeterminate = i;
      } else {
        h.onChange = B;
      }
      const re = W({
        [`${u.value}-wrapper`]: true,
        [`${u.value}-rtl`]: p.value === "rtl",
        [`${u.value}-wrapper-checked`]: h.checked,
        [`${u.value}-wrapper-disabled`]: h.disabled,
        [`${u.value}-wrapper-in-form-item`]: k.isFormItemInput
      }, ee, f.value);
      const oe = W({
        [`${u.value}-indeterminate`]: i
      }, f.value);
      return b(P("label", {
        class: re,
        style: ae,
        onMouseenter: E,
        onMouseleave: y
      }, [P(Ce, D(D({
        "aria-checked": i ? "mixed" : undefined
      }, h), {}, {
        class: oe,
        ref: x
      }), null), c.length ? P("span", null, [c]) : null]));
    };
  }
});
const G = K({
  compatConfig: {
    MODE: 3
  },
  name: "ACheckboxGroup",
  inheritAttrs: false,
  props: Q(),
  setup(e, a) {
    let {
      slots: n,
      attrs: t,
      emit: d,
      expose: V
    } = a;
    const $ = X();
    const {
      prefixCls: k,
      direction: u
    } = L("checkbox", e);
    const p = S(() => `${k.value}-group`);
    const [_, T] = q(p);
    const b = w((e.value === undefined ? e.defaultValue : e.value) || []);
    U(() => e.value, () => {
      b.value = e.value || [];
    });
    const f = S(() => e.options.map(o => typeof o == "string" || typeof o == "number" ? {
      label: o,
      value: o
    } : o));
    const l = w(Symbol());
    const g = w(new Map());
    const M = o => {
      g.value.delete(o);
      l.value = Symbol();
    };
    const B = (o, r) => {
      g.value.set(o, r);
      l.value = Symbol();
    };
    const x = w(new Map());
    U(l, () => {
      const o = new Map();
      for (const r of g.value.values()) {
        o.set(r, true);
      }
      x.value = o;
    });
    xe(Y, {
      cancelValue: M,
      registerValue: B,
      toggleOption: o => {
        const r = b.value.indexOf(o.value);
        const c = [...b.value];
        if (r === -1) {
          c.push(o.value);
        } else {
          c.splice(r, 1);
        }
        if (e.value === undefined) {
          b.value = c;
        }
        const i = c.filter(v => x.value.has(v)).sort((v, j) => {
          const z = f.value.findIndex(y => y.value === v);
          const E = f.value.findIndex(y => y.value === j);
          return z - E;
        });
        d("update:value", i);
        d("change", i);
        $.onFieldChange();
      },
      mergedValue: b,
      name: S(() => e.name),
      disabled: S(() => e.disabled)
    });
    V({
      mergedValue: b
    });
    return () => {
      var o;
      const {
        id: r = $.id.value
      } = e;
      let c = null;
      if (f.value && f.value.length > 0) {
        c = f.value.map(i => {
          var v;
          return P(C, {
            prefixCls: k.value,
            key: i.value.toString(),
            disabled: "disabled" in i ? i.disabled : e.disabled,
            indeterminate: i.indeterminate,
            value: i.value,
            checked: b.value.indexOf(i.value) !== -1,
            onChange: i.onChange,
            class: `${p.value}-item`
          }, {
            default: () => [n.label !== undefined ? (v = n.label) === null || v === undefined ? undefined : v.call(n, i) : i.label]
          });
        });
      }
      return _(P("div", D(D({}, t), {}, {
        class: [p.value, {
          [`${p.value}-rtl`]: u.value === "rtl"
        }, t.class, T.value],
        id: r
      }), [c || ((o = n.default) === null || o === undefined ? undefined : o.call(n))]));
    };
  }
});
C.Group = G;
C.install = function (e) {
  e.component(C.name, C);
  e.component(G.name, G);
  return e;
};
const De = Object.defineProperty({
  __proto__: null,
  CheckboxGroup: G,
  checkboxGroupProps: Q,
  checkboxProps: J,
  default: C
}, Symbol.toStringTag, {
  value: "Module"
});
export { C, Se as g, De as i };
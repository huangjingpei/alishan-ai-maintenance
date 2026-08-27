import { d as E, A as f, y as V, _ as o, h as W, i as h, q as F, a4 as I, P as M } from "./index-BegIKaMc.js";
function R(t, r) {
  var c = {};
  for (var n in t) {
    if (Object.prototype.hasOwnProperty.call(t, n) && r.indexOf(n) < 0) {
      c[n] = t[n];
    }
  }
  if (t != null && typeof Object.getOwnPropertySymbols == "function") {
    for (var a = 0, n = Object.getOwnPropertySymbols(t); a < n.length; a++) {
      if (r.indexOf(n[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, n[a])) {
        c[n[a]] = t[n[a]];
      }
    }
  }
  return c;
}
const T = {
  prefixCls: String,
  name: String,
  id: String,
  type: String,
  defaultChecked: {
    type: [Boolean, Number],
    default: undefined
  },
  checked: {
    type: [Boolean, Number],
    default: undefined
  },
  disabled: Boolean,
  tabindex: {
    type: [Number, String]
  },
  readonly: Boolean,
  autofocus: Boolean,
  value: M.any,
  required: Boolean
};
const G = E({
  compatConfig: {
    MODE: 3
  },
  name: "Checkbox",
  inheritAttrs: false,
  props: I(T, {
    prefixCls: "rc-checkbox",
    type: "checkbox",
    defaultChecked: false
  }),
  emits: ["click", "change"],
  setup(t, r) {
    let {
      attrs: c,
      emit: n,
      expose: a
    } = r;
    const d = f(t.checked === undefined ? t.defaultChecked : t.checked);
    const s = f();
    V(() => t.checked, () => {
      d.value = t.checked;
    });
    a({
      focus() {
        var e;
        if ((e = s.value) !== null && e !== undefined) {
          e.focus();
        }
      },
      blur() {
        var e;
        if ((e = s.value) !== null && e !== undefined) {
          e.blur();
        }
      }
    });
    const i = f();
    const y = e => {
      if (t.disabled) {
        return;
      }
      if (t.checked === undefined) {
        d.value = e.target.checked;
      }
      e.shiftKey = i.value;
      const u = {
        target: o(o({}, t), {
          checked: e.target.checked
        }),
        stopPropagation() {
          e.stopPropagation();
        },
        preventDefault() {
          e.preventDefault();
        },
        nativeEvent: e
      };
      if (t.checked !== undefined) {
        s.value.checked = !!t.checked;
      }
      n("change", u);
      i.value = false;
    };
    const k = e => {
      n("click", e);
      i.value = e.shiftKey;
    };
    return () => {
      const {
        prefixCls: e,
        name: u,
        id: g,
        type: m,
        disabled: b,
        readonly: x,
        tabindex: C,
        autofocus: O,
        value: P,
        required: S
      } = t;
      const _ = R(t, ["prefixCls", "name", "id", "type", "disabled", "readonly", "tabindex", "autofocus", "value", "required"]);
      const {
        class: j,
        onFocus: B,
        onBlur: K,
        onKeydown: N,
        onKeypress: w,
        onKeyup: q
      } = c;
      const v = o(o({}, _), c);
      const A = Object.keys(v).reduce((p, l) => {
        if (l.startsWith("data-") || l.startsWith("aria-") || l === "role") {
          p[l] = v[l];
        }
        return p;
      }, {});
      const D = W(e, j, {
        [`${e}-checked`]: d.value,
        [`${e}-disabled`]: b
      });
      const $ = o(o({
        name: u,
        id: g,
        type: m,
        readonly: x,
        disabled: b,
        tabindex: C,
        class: `${e}-input`,
        checked: !!d.value,
        autofocus: O,
        value: P
      }, A), {
        onChange: y,
        onClick: k,
        onFocus: B,
        onBlur: K,
        onKeydown: N,
        onKeypress: w,
        onKeyup: q,
        required: S
      });
      return h("span", {
        class: D
      }, [h("input", F({
        ref: s
      }, $), null), h("span", {
        class: `${e}-inner`
      }, null)]);
    };
  }
});
export { G as V };
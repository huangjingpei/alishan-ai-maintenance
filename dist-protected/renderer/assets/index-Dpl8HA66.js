import { i as b, $ as nt, d as Ee, M as He, a7 as at, h as j, q as _, U as R, A as Ge, aU as rt, N as _e, s as D, y as ee, _ as v, o as W, O as ie, ab as F, ac as Z, aa as we, g as lt, b9 as it, ba as st, r as Ve, bb as Ue, bc as Le, bd as ot, be as ut, bf as dt, bg as ct, bh as qe, bi as ft, b3 as pt, u as mt, bj as Se, bk as gt, a3 as vt, am as Be, bl as Te, l as bt, aW as ht, bm as St, P as $e, bn as $t, bo as Nt } from "./index-BegIKaMc.js";
var yt = {
  icon: {
    tag: "svg",
    attrs: {
      viewBox: "64 64 896 896",
      focusable: "false"
    },
    children: [{
      tag: "path",
      attrs: {
        d: "M890.5 755.3L537.9 269.2c-12.8-17.6-39-17.6-51.7 0L133.5 755.3A8 8 0 00140 768h75c5.1 0 9.9-2.5 12.9-6.6L512 369.8l284.1 391.6c3 4.1 7.8 6.6 12.9 6.6h75c6.5 0 10.3-7.4 6.5-12.7z"
      }
    }]
  },
  name: "up",
  theme: "outlined"
};
function Fe(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? Object(arguments[t]) : {};
    var r = Object.keys(n);
    if (typeof Object.getOwnPropertySymbols == "function") {
      r = r.concat(Object.getOwnPropertySymbols(n).filter(function (l) {
        return Object.getOwnPropertyDescriptor(n, l).enumerable;
      }));
    }
    r.forEach(function (l) {
      wt(e, l, n[l]);
    });
  }
  return e;
}
function wt(e, t, n) {
  if (t in e) {
    Object.defineProperty(e, t, {
      value: n,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    e[t] = n;
  }
  return e;
}
function Ce(t, n) {
  var r = Fe({}, t, n.attrs);
  return b(nt, Fe({}, r, {
    icon: yt
  }), null);
}
Ce.displayName = "UpOutlined";
Ce.inheritAttrs = false;
function xe() {
  return typeof BigInt == "function";
}
function te(e) {
  let t = e.trim();
  let n = t.startsWith("-");
  if (n) {
    t = t.slice(1);
  }
  t = t.replace(/(\.\d*[^0])0*$/, "$1").replace(/\.0*$/, "").replace(/^0+/, "");
  if (t.startsWith(".")) {
    t = `0${t}`;
  }
  const r = t || "0";
  const l = r.split(".");
  const i = l[0] || "0";
  const d = l[1] || "0";
  if (i === "0" && d === "0") {
    n = false;
  }
  const c = n ? "-" : "";
  return {
    negative: n,
    negativeStr: c,
    trimStr: r,
    integerStr: i,
    decimalStr: d,
    fullStr: `${c}${r}`
  };
}
function Oe(e) {
  const t = String(e);
  return !Number.isNaN(Number(t)) && t.includes("e");
}
function ne(e) {
  const t = String(e);
  if (Oe(e)) {
    let n = Number(t.slice(t.indexOf("e-") + 2));
    const r = t.match(/\.(\d+)/);
    if (r != null && r[1]) {
      n += r[1].length;
    }
    return n;
  }
  if (t.includes(".") && De(t)) {
    return t.length - t.indexOf(".") - 1;
  } else {
    return 0;
  }
}
function Pe(e) {
  let t = String(e);
  if (Oe(e)) {
    if (e > Number.MAX_SAFE_INTEGER) {
      return String(xe() ? BigInt(e).toString() : Number.MAX_SAFE_INTEGER);
    }
    if (e < Number.MIN_SAFE_INTEGER) {
      return String(xe() ? BigInt(e).toString() : Number.MIN_SAFE_INTEGER);
    }
    t = e.toFixed(ne(t));
  }
  return te(t).fullStr;
}
function De(e) {
  if (typeof e == "number") {
    return !Number.isNaN(e);
  } else if (e) {
    return /^\s*-?\d+(\.\d+)?\s*$/.test(e) || /^\s*-?\d+\.\s*$/.test(e) || /^\s*-?\.\d+\s*$/.test(e);
  } else {
    return false;
  }
}
function ke(e) {
  return !e && e !== 0 && !Number.isNaN(e) || !String(e).trim();
}
class z {
  constructor(t) {
    this.origin = "";
    if (ke(t)) {
      this.empty = true;
      return;
    }
    this.origin = String(t);
    this.number = Number(t);
  }
  negate() {
    return new z(-this.toNumber());
  }
  add(t) {
    if (this.isInvalidate()) {
      return new z(t);
    }
    const n = Number(t);
    if (Number.isNaN(n)) {
      return this;
    }
    const r = this.number + n;
    if (r > Number.MAX_SAFE_INTEGER) {
      return new z(Number.MAX_SAFE_INTEGER);
    }
    if (r < Number.MIN_SAFE_INTEGER) {
      return new z(Number.MIN_SAFE_INTEGER);
    }
    const l = Math.max(ne(this.number), ne(n));
    return new z(r.toFixed(l));
  }
  isEmpty() {
    return this.empty;
  }
  isNaN() {
    return Number.isNaN(this.number);
  }
  isInvalidate() {
    return this.isEmpty() || this.isNaN();
  }
  equals(t) {
    return this.toNumber() === (t == null ? undefined : t.toNumber());
  }
  lessEquals(t) {
    return this.add(t.negate().toString()).toNumber() <= 0;
  }
  toNumber() {
    return this.number;
  }
  toString() {
    if (arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true) {
      if (this.isInvalidate()) {
        return "";
      } else {
        return Pe(this.number);
      }
    } else {
      return this.origin;
    }
  }
}
class q {
  constructor(t) {
    this.origin = "";
    if (ke(t)) {
      this.empty = true;
      return;
    }
    this.origin = String(t);
    if (t === "-" || Number.isNaN(t)) {
      this.nan = true;
      return;
    }
    let n = t;
    if (Oe(n)) {
      n = Number(n);
    }
    n = typeof n == "string" ? n : Pe(n);
    if (De(n)) {
      const r = te(n);
      this.negative = r.negative;
      const l = r.trimStr.split(".");
      this.integer = BigInt(l[0]);
      const i = l[1] || "0";
      this.decimal = BigInt(i);
      this.decimalLen = i.length;
    } else {
      this.nan = true;
    }
  }
  getMark() {
    if (this.negative) {
      return "-";
    } else {
      return "";
    }
  }
  getIntegerStr() {
    return this.integer.toString();
  }
  getDecimalStr() {
    return this.decimal.toString().padStart(this.decimalLen, "0");
  }
  alignDecimal(t) {
    const n = `${this.getMark()}${this.getIntegerStr()}${this.getDecimalStr().padEnd(t, "0")}`;
    return BigInt(n);
  }
  negate() {
    const t = new q(this.toString());
    t.negative = !t.negative;
    return t;
  }
  add(t) {
    if (this.isInvalidate()) {
      return new q(t);
    }
    const n = new q(t);
    if (n.isInvalidate()) {
      return this;
    }
    const r = Math.max(this.getDecimalStr().length, n.getDecimalStr().length);
    const l = this.alignDecimal(r);
    const i = n.alignDecimal(r);
    const d = (l + i).toString();
    const {
      negativeStr: c,
      trimStr: f
    } = te(d);
    const p = `${c}${f.padStart(r + 1, "0")}`;
    return new q(`${p.slice(0, -r)}.${p.slice(-r)}`);
  }
  isEmpty() {
    return this.empty;
  }
  isNaN() {
    return this.nan;
  }
  isInvalidate() {
    return this.isEmpty() || this.isNaN();
  }
  equals(t) {
    return this.toString() === (t == null ? undefined : t.toString());
  }
  lessEquals(t) {
    return this.add(t.negate().toString()).toNumber() <= 0;
  }
  toNumber() {
    if (this.isNaN()) {
      return NaN;
    } else {
      return Number(this.toString());
    }
  }
  toString() {
    if (arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true) {
      if (this.isInvalidate()) {
        return "";
      } else {
        return te(`${this.getMark()}${this.getIntegerStr()}.${this.getDecimalStr()}`).fullStr;
      }
    } else {
      return this.origin;
    }
  }
}
function P(e) {
  if (xe()) {
    return new q(e);
  } else {
    return new z(e);
  }
}
function Ie(e, t, n, r = false) {
  if (e === "") {
    return "";
  }
  const {
    negativeStr: l,
    integerStr: i,
    decimalStr: d
  } = te(e);
  const c = `${t}${d}`;
  const f = `${l}${i}`;
  if (n >= 0) {
    const p = Number(d[n]);
    if (p >= 5 && !r) {
      const o = P(e).add(`${l}0.${"0".repeat(n)}${10 - p}`);
      return Ie(o.toString(), t, n, r);
    }
    if (n === 0) {
      return f;
    } else {
      return `${f}${t}${d.padEnd(n, "0").slice(0, n)}`;
    }
  }
  if (c === ".0") {
    return f;
  } else {
    return `${f}${c}`;
  }
}
const xt = 200;
const It = 600;
const Et = Ee({
  compatConfig: {
    MODE: 3
  },
  name: "StepHandler",
  inheritAttrs: false,
  props: {
    prefixCls: String,
    upDisabled: Boolean,
    downDisabled: Boolean,
    onStep: R()
  },
  slots: Object,
  setup(e, t) {
    let {
      slots: n,
      emit: r
    } = t;
    const l = Ge();
    const i = (c, f) => {
      c.preventDefault();
      r("step", f);
      function p() {
        r("step", f);
        l.value = setTimeout(p, xt);
      }
      l.value = setTimeout(p, It);
    };
    const d = () => {
      clearTimeout(l.value);
    };
    He(() => {
      d();
    });
    return () => {
      if (at()) {
        return null;
      }
      const {
        prefixCls: c,
        upDisabled: f,
        downDisabled: p
      } = e;
      const o = `${c}-handler`;
      const w = j(o, `${o}-up`, {
        [`${o}-up-disabled`]: f
      });
      const S = j(o, `${o}-down`, {
        [`${o}-down-disabled`]: p
      });
      const I = {
        unselectable: "on",
        role: "button",
        onMouseup: d,
        onMouseleave: d
      };
      const {
        upNode: $,
        downNode: E
      } = n;
      return b("div", {
        class: `${o}-wrap`
      }, [b("span", _(_({}, I), {}, {
        onMousedown: M => {
          i(M, true);
        },
        "aria-label": "Increase Value",
        "aria-disabled": f,
        class: w
      }), [($ == null ? undefined : $()) || b("span", {
        unselectable: "on",
        class: `${c}-handler-up-inner`
      }, null)]), b("span", _(_({}, I), {}, {
        onMousedown: M => {
          i(M, false);
        },
        "aria-label": "Decrease Value",
        "aria-disabled": p,
        class: S
      }), [(E == null ? undefined : E()) || b("span", {
        unselectable: "on",
        class: `${c}-handler-down-inner`
      }, null)])]);
    };
  }
});
function Ct(e, t) {
  const n = Ge(null);
  function r() {
    try {
      const {
        selectionStart: i,
        selectionEnd: d,
        value: c
      } = e.value;
      const f = c.substring(0, i);
      const p = c.substring(d);
      n.value = {
        start: i,
        end: d,
        value: c,
        beforeTxt: f,
        afterTxt: p
      };
    } catch {}
  }
  function l() {
    if (e.value && n.value && t.value) {
      try {
        const {
          value: i
        } = e.value;
        const {
          beforeTxt: d,
          afterTxt: c,
          start: f
        } = n.value;
        let p = i.length;
        if (i.endsWith(c)) {
          p = i.length - n.value.afterTxt.length;
        } else if (i.startsWith(d)) {
          p = d.length;
        } else {
          const o = d[f - 1];
          const w = i.indexOf(o, f - 1);
          if (w !== -1) {
            p = w + 1;
          }
        }
        e.value.setSelectionRange(p, p);
      } catch (i) {
        rt(false, `Something warning of cursor restore. Please fire issue about this: ${i.message}`);
      }
    }
  }
  return [r, l];
}
const Ot = () => {
  const e = D(0);
  const t = () => {
    _e.cancel(e.value);
  };
  He(() => {
    t();
  });
  return n => {
    t();
    e.value = _e(() => {
      n();
    });
  };
};
function Pt(e, t) {
  var n = {};
  for (var r in e) {
    if (Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0) {
      n[r] = e[r];
    }
  }
  if (e != null && typeof Object.getOwnPropertySymbols == "function") {
    for (var l = 0, r = Object.getOwnPropertySymbols(e); l < r.length; l++) {
      if (t.indexOf(r[l]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[l])) {
        n[r[l]] = e[r[l]];
      }
    }
  }
  return n;
}
const ze = (e, t) => e || t.isEmpty() ? t.toString() : t.toNumber();
const je = e => {
  const t = P(e);
  if (t.isInvalidate()) {
    return null;
  } else {
    return t;
  }
};
const Xe = () => ({
  stringMode: F(),
  defaultValue: Z([String, Number]),
  value: Z([String, Number]),
  prefixCls: we(),
  min: Z([String, Number]),
  max: Z([String, Number]),
  step: Z([String, Number], 1),
  tabindex: Number,
  controls: F(true),
  readonly: F(),
  disabled: F(),
  autofocus: F(),
  keyboard: F(true),
  parser: R(),
  formatter: R(),
  precision: Number,
  decimalSeparator: String,
  onInput: R(),
  onChange: R(),
  onPressEnter: R(),
  onStep: R(),
  onBlur: R(),
  onFocus: R()
});
const Dt = Ee({
  compatConfig: {
    MODE: 3
  },
  name: "InnerInputNumber",
  inheritAttrs: false,
  props: v(v({}, Xe()), {
    lazy: Boolean
  }),
  slots: Object,
  setup(e, t) {
    let {
      attrs: n,
      slots: r,
      emit: l,
      expose: i
    } = t;
    const d = D();
    const c = D(false);
    const f = D(false);
    const p = D(false);
    const o = D(P(e.value));
    function w(a) {
      if (e.value === undefined) {
        o.value = a;
      }
    }
    const S = (a, s) => {
      if (!s) {
        if (e.precision >= 0) {
          return e.precision;
        } else {
          return Math.max(ne(a), ne(e.step));
        }
      }
    };
    const I = a => {
      const s = String(a);
      if (e.parser) {
        return e.parser(s);
      }
      let u = s;
      if (e.decimalSeparator) {
        u = u.replace(e.decimalSeparator, ".");
      }
      return u.replace(/[^\w.-]+/g, "");
    };
    const $ = D("");
    const E = (a, s) => {
      if (e.formatter) {
        return e.formatter(a, {
          userTyping: s,
          input: String($.value)
        });
      }
      let u = typeof a == "number" ? Pe(a) : a;
      if (!s) {
        const m = S(u, s);
        if (De(u) && (e.decimalSeparator || m >= 0)) {
          const y = e.decimalSeparator || ".";
          u = Ie(u, y, m);
        }
      }
      return u;
    };
    const M = (() => {
      const a = e.value;
      if (o.value.isInvalidate() && ["string", "number"].includes(typeof a)) {
        if (Number.isNaN(a)) {
          return "";
        } else {
          return a;
        }
      } else {
        return E(o.value.toString(), false);
      }
    })();
    $.value = M;
    function C(a, s) {
      $.value = E(a.isInvalidate() ? a.toString(false) : a.toString(!s), s);
    }
    const O = W(() => je(e.max));
    const N = W(() => je(e.min));
    const x = W(() => !O.value || !o.value || o.value.isInvalidate() ? false : O.value.lessEquals(o.value));
    const V = W(() => !N.value || !o.value || o.value.isInvalidate() ? false : o.value.lessEquals(N.value));
    const [k, X] = Ct(d, c);
    const K = a => O.value && !a.lessEquals(O.value) ? O.value : N.value && !N.value.lessEquals(a) ? N.value : null;
    const se = a => !K(a);
    const Y = (a, s) => {
      var u;
      let m = a;
      let y = se(m) || m.isEmpty();
      if (!m.isEmpty() && !s) {
        m = K(m) || m;
        y = true;
      }
      if (!e.readonly && !e.disabled && y) {
        const A = m.toString();
        const U = S(A, s);
        if (U >= 0) {
          m = P(Ie(A, ".", U));
        }
        if (!m.equals(o.value)) {
          w(m);
          if ((u = e.onChange) !== null && u !== undefined) {
            u.call(e, m.isEmpty() ? null : ze(e.stringMode, m));
          }
          if (e.value === undefined) {
            C(m, s);
          }
        }
        return m;
      }
      return o.value;
    };
    const oe = Ot();
    const J = a => {
      var s;
      k();
      $.value = a;
      if (!p.value) {
        const u = I(a);
        const m = P(u);
        if (!m.isNaN()) {
          Y(m, true);
        }
      }
      if ((s = e.onInput) !== null && s !== undefined) {
        s.call(e, a);
      }
      oe(() => {
        let u = a;
        if (!e.parser) {
          u = a.replace(/。/g, ".");
        }
        if (u !== a) {
          J(u);
        }
      });
    };
    const h = () => {
      p.value = true;
    };
    const Q = () => {
      p.value = false;
      J(d.value.value);
    };
    const H = a => {
      J(a.target.value);
    };
    const G = a => {
      var s;
      var u;
      if (a && x.value || !a && V.value) {
        return;
      }
      f.value = false;
      let m = P(e.step);
      if (!a) {
        m = m.negate();
      }
      const y = (o.value || P(0)).add(m.toString());
      const A = Y(y, false);
      if ((s = e.onStep) !== null && s !== undefined) {
        s.call(e, ze(e.stringMode, A), {
          offset: e.step,
          type: a ? "up" : "down"
        });
      }
      if ((u = d.value) !== null && u !== undefined) {
        u.focus();
      }
    };
    const B = a => {
      const s = P(I($.value));
      let u = s;
      if (s.isNaN()) {
        u = o.value;
      } else {
        u = Y(s, a);
      }
      if (e.value !== undefined) {
        C(o.value, false);
      } else if (!u.isNaN()) {
        C(u, false);
      }
    };
    const ue = () => {
      f.value = true;
    };
    const de = a => {
      var s;
      const {
        which: u
      } = a;
      f.value = true;
      if (u === ie.ENTER) {
        if (!p.value) {
          f.value = false;
        }
        B(false);
        if ((s = e.onPressEnter) !== null && s !== undefined) {
          s.call(e, a);
        }
      }
      if (e.keyboard !== false && !p.value && [ie.UP, ie.DOWN].includes(u)) {
        G(ie.UP === u);
        a.preventDefault();
      }
    };
    const ce = () => {
      f.value = false;
    };
    const ae = a => {
      B(false);
      c.value = false;
      f.value = false;
      l("blur", a);
    };
    ee(() => e.precision, () => {
      if (!o.value.isInvalidate()) {
        C(o.value, false);
      }
    }, {
      flush: "post"
    });
    ee(() => e.value, () => {
      const a = P(e.value);
      o.value = a;
      const s = P(I($.value));
      if (!a.equals(s) || !f.value || e.formatter) {
        C(a, f.value);
      }
    }, {
      flush: "post"
    });
    ee($, () => {
      if (e.formatter) {
        X();
      }
    }, {
      flush: "post"
    });
    ee(() => e.disabled, a => {
      if (a) {
        c.value = false;
      }
    });
    i({
      focus: () => {
        var a;
        if ((a = d.value) !== null && a !== undefined) {
          a.focus();
        }
      },
      blur: () => {
        var a;
        if ((a = d.value) !== null && a !== undefined) {
          a.blur();
        }
      }
    });
    return () => {
      const a = v(v({}, n), e);
      const {
        prefixCls: s = "rc-input-number",
        min: u,
        max: m,
        step: y = 1,
        defaultValue: A,
        value: U,
        disabled: re,
        readonly: le,
        keyboard: g,
        controls: fe = true,
        autofocus: T,
        stringMode: pe,
        parser: me,
        formatter: L,
        precision: ge,
        decimalSeparator: ve,
        onChange: be,
        onInput: Me,
        onPressEnter: Ae,
        onStep: Bt,
        lazy: Ke,
        class: Ye,
        style: Je
      } = a;
      const Qe = Pt(a, ["prefixCls", "min", "max", "step", "defaultValue", "value", "disabled", "readonly", "keyboard", "controls", "autofocus", "stringMode", "parser", "formatter", "precision", "decimalSeparator", "onChange", "onInput", "onPressEnter", "onStep", "lazy", "class", "style"]);
      const {
        upHandler: Ze,
        downHandler: et
      } = r;
      const Re = `${s}-input`;
      const he = {};
      if (Ke) {
        he.onChange = H;
      } else {
        he.onInput = H;
      }
      return b("div", {
        class: j(s, Ye, {
          [`${s}-focused`]: c.value,
          [`${s}-disabled`]: re,
          [`${s}-readonly`]: le,
          [`${s}-not-a-number`]: o.value.isNaN(),
          [`${s}-out-of-range`]: !o.value.isInvalidate() && !se(o.value)
        }),
        style: Je,
        onKeydown: de,
        onKeyup: ce
      }, [fe && b(Et, {
        prefixCls: s,
        upDisabled: x.value,
        downDisabled: V.value,
        onStep: G
      }, {
        upNode: Ze,
        downNode: et
      }), b("div", {
        class: `${Re}-wrap`
      }, [b("input", _(_(_({
        autofocus: T,
        autocomplete: "off",
        role: "spinbutton",
        "aria-valuemin": u,
        "aria-valuemax": m,
        "aria-valuenow": o.value.isInvalidate() ? null : o.value.toString(),
        step: y
      }, Qe), {}, {
        ref: d,
        class: Re,
        value: $.value,
        disabled: re,
        readonly: le,
        onFocus: tt => {
          c.value = true;
          l("focus", tt);
        }
      }, he), {}, {
        onBlur: ae,
        onCompositionstart: h,
        onCompositionend: Q,
        onBeforeinput: ue
      }), null)])]);
    };
  }
});
function Ne(e) {
  return e != null;
}
const Mt = e => {
  const {
    componentCls: t,
    lineWidth: n,
    lineType: r,
    colorBorder: l,
    borderRadius: i,
    fontSizeLG: d,
    controlHeightLG: c,
    controlHeightSM: f,
    colorError: p,
    inputPaddingHorizontalSM: o,
    colorTextDescription: w,
    motionDurationMid: S,
    colorPrimary: I,
    controlHeight: $,
    inputPaddingHorizontal: E,
    colorBgContainer: M,
    colorTextDisabled: C,
    borderRadiusSM: O,
    borderRadiusLG: N,
    controlWidth: x,
    handleVisible: V
  } = e;
  return [{
    [t]: v(v(v(v({}, Ve(e)), Ue(e)), Le(e, t)), {
      display: "inline-block",
      width: x,
      margin: 0,
      padding: 0,
      border: `${n}px ${r} ${l}`,
      borderRadius: i,
      "&-rtl": {
        direction: "rtl",
        [`${t}-input`]: {
          direction: "rtl"
        }
      },
      "&-lg": {
        padding: 0,
        fontSize: d,
        borderRadius: N,
        [`input${t}-input`]: {
          height: c - n * 2
        }
      },
      "&-sm": {
        padding: 0,
        borderRadius: O,
        [`input${t}-input`]: {
          height: f - n * 2,
          padding: `0 ${o}px`
        }
      },
      "&:hover": v({}, qe(e)),
      "&-focused": v({}, ct(e)),
      "&-disabled": v(v({}, dt(e)), {
        [`${t}-input`]: {
          cursor: "not-allowed"
        }
      }),
      "&-out-of-range": {
        input: {
          color: p
        }
      },
      "&-group": v(v(v({}, Ve(e)), ut(e)), {
        "&-wrapper": {
          display: "inline-block",
          textAlign: "start",
          verticalAlign: "top",
          [`${t}-affix-wrapper`]: {
            width: "100%"
          },
          "&-lg": {
            [`${t}-group-addon`]: {
              borderRadius: N
            }
          },
          "&-sm": {
            [`${t}-group-addon`]: {
              borderRadius: O
            }
          }
        }
      }),
      [t]: {
        "&-input": v(v({
          width: "100%",
          height: $ - n * 2,
          padding: `0 ${E}px`,
          textAlign: "start",
          backgroundColor: "transparent",
          border: 0,
          borderRadius: i,
          outline: 0,
          transition: `all ${S} linear`,
          appearance: "textfield",
          color: e.colorText,
          fontSize: "inherit",
          verticalAlign: "top"
        }, ot(e.colorTextPlaceholder)), {
          "&[type=\"number\"]::-webkit-inner-spin-button, &[type=\"number\"]::-webkit-outer-spin-button": {
            margin: 0,
            webkitAppearance: "none",
            appearance: "none"
          }
        })
      }
    })
  }, {
    [t]: {
      [`&:hover ${t}-handler-wrap, &-focused ${t}-handler-wrap`]: {
        opacity: 1
      },
      [`${t}-handler-wrap`]: {
        position: "absolute",
        insetBlockStart: 0,
        insetInlineEnd: 0,
        width: e.handleWidth,
        height: "100%",
        background: M,
        borderStartStartRadius: 0,
        borderStartEndRadius: i,
        borderEndEndRadius: i,
        borderEndStartRadius: 0,
        opacity: V === true ? 1 : 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        transition: `opacity ${S} linear ${S}`,
        [`${t}-handler`]: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: "auto",
          height: "40%",
          [`
              ${t}-handler-up-inner,
              ${t}-handler-down-inner
            `]: {
            marginInlineEnd: 0,
            fontSize: e.handleFontSize
          }
        }
      },
      [`${t}-handler`]: {
        height: "50%",
        overflow: "hidden",
        color: w,
        fontWeight: "bold",
        lineHeight: 0,
        textAlign: "center",
        cursor: "pointer",
        borderInlineStart: `${n}px ${r} ${l}`,
        transition: `all ${S} linear`,
        "&:active": {
          background: e.colorFillAlter
        },
        "&:hover": {
          height: "60%",
          [`
              ${t}-handler-up-inner,
              ${t}-handler-down-inner
            `]: {
            color: I
          }
        },
        "&-up-inner, &-down-inner": v(v({}, ft()), {
          color: w,
          transition: `all ${S} linear`,
          userSelect: "none"
        })
      },
      [`${t}-handler-up`]: {
        borderStartEndRadius: i
      },
      [`${t}-handler-down`]: {
        borderBlockStart: `${n}px ${r} ${l}`,
        borderEndEndRadius: i
      },
      "&-disabled, &-readonly": {
        [`${t}-handler-wrap`]: {
          display: "none"
        },
        [`${t}-input`]: {
          color: "inherit"
        }
      },
      [`
          ${t}-handler-up-disabled,
          ${t}-handler-down-disabled
        `]: {
        cursor: "not-allowed"
      },
      [`
          ${t}-handler-up-disabled:hover &-handler-up-inner,
          ${t}-handler-down-disabled:hover &-handler-down-inner
        `]: {
        color: C
      }
    }
  }, {
    [`${t}-borderless`]: {
      borderColor: "transparent",
      boxShadow: "none",
      [`${t}-handler-down`]: {
        borderBlockStartWidth: 0
      }
    }
  }];
};
const At = e => {
  const {
    componentCls: t,
    inputPaddingHorizontal: n,
    inputAffixPadding: r,
    controlWidth: l,
    borderRadiusLG: i,
    borderRadiusSM: d
  } = e;
  return {
    [`${t}-affix-wrapper`]: v(v(v({}, Ue(e)), Le(e, `${t}-affix-wrapper`)), {
      position: "relative",
      display: "inline-flex",
      width: l,
      padding: 0,
      paddingInlineStart: n,
      "&-lg": {
        borderRadius: i
      },
      "&-sm": {
        borderRadius: d
      },
      [`&:not(${t}-affix-wrapper-disabled):hover`]: v(v({}, qe(e)), {
        zIndex: 1
      }),
      "&-focused, &:focus": {
        zIndex: 1
      },
      "&-disabled": {
        [`${t}[disabled]`]: {
          background: "transparent"
        }
      },
      [`> div${t}`]: {
        width: "100%",
        border: "none",
        outline: "none",
        [`&${t}-focused`]: {
          boxShadow: "none !important"
        }
      },
      [`input${t}-input`]: {
        padding: 0
      },
      "&::before": {
        width: 0,
        visibility: "hidden",
        content: "\"\\a0\""
      },
      [`${t}-handler-wrap`]: {
        zIndex: 2
      },
      [t]: {
        "&-prefix, &-suffix": {
          display: "flex",
          flex: "none",
          alignItems: "center",
          pointerEvents: "none"
        },
        "&-prefix": {
          marginInlineEnd: r
        },
        "&-suffix": {
          position: "absolute",
          insetBlockStart: 0,
          insetInlineEnd: 0,
          zIndex: 1,
          height: "100%",
          marginInlineEnd: n,
          marginInlineStart: r
        }
      }
    })
  };
};
const Rt = lt("InputNumber", e => {
  const t = it(e);
  return [Mt(t), At(t), st(t)];
}, e => ({
  controlWidth: 90,
  handleWidth: e.controlHeightSM - e.lineWidth * 2,
  handleFontSize: e.fontSize / 2,
  handleVisible: "auto"
}));
function _t(e, t) {
  var n = {};
  for (var r in e) {
    if (Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0) {
      n[r] = e[r];
    }
  }
  if (e != null && typeof Object.getOwnPropertySymbols == "function") {
    for (var l = 0, r = Object.getOwnPropertySymbols(e); l < r.length; l++) {
      if (t.indexOf(r[l]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[l])) {
        n[r[l]] = e[r[l]];
      }
    }
  }
  return n;
}
const We = Xe();
const Vt = () => v(v({}, We), {
  size: we(),
  bordered: F(true),
  placeholder: String,
  name: String,
  id: String,
  type: String,
  addonBefore: $e.any,
  addonAfter: $e.any,
  prefix: $e.any,
  "onUpdate:value": We.onChange,
  valueModifiers: Object,
  status: we()
});
const ye = Ee({
  compatConfig: {
    MODE: 3
  },
  name: "AInputNumber",
  inheritAttrs: false,
  props: Vt(),
  slots: Object,
  setup(e, t) {
    let {
      emit: n,
      expose: r,
      attrs: l,
      slots: i
    } = t;
    const c = pt();
    const f = ht.useInject();
    const p = W(() => Nt(f.status, e.status));
    const {
      prefixCls: o,
      size: w,
      direction: S,
      disabled: I
    } = mt("input-number", e);
    const {
      compactSize: $,
      compactItemClassnames: E
    } = St(o, S);
    const M = $t();
    const C = W(() => {
      return I.value ?? M.value;
    });
    const [O, N] = Rt(o);
    const x = W(() => $.value || w.value);
    const V = D(e.value ?? e.defaultValue);
    const k = D(false);
    ee(() => e.value, () => {
      V.value = e.value;
    });
    const X = D(null);
    const K = () => {
      var h;
      if ((h = X.value) !== null && h !== undefined) {
        h.focus();
      }
    };
    r({
      focus: K,
      blur: () => {
        var h;
        if ((h = X.value) !== null && h !== undefined) {
          h.blur();
        }
      }
    });
    const Y = h => {
      if (e.value === undefined) {
        V.value = h;
      }
      n("update:value", h);
      n("change", h);
      c.onFieldChange();
    };
    const oe = h => {
      k.value = false;
      n("blur", h);
      c.onFieldBlur();
    };
    const J = h => {
      k.value = true;
      n("focus", h);
    };
    return () => {
      var Q;
      var H;
      var G;
      const {
        hasFeedback: B,
        isFormItemInput: ue,
        feedbackIcon: de
      } = f;
      const ce = e.id ?? c.id.value;
      const ae = v(v(v({}, l), e), {
        id: ce,
        disabled: C.value
      });
      const {
        class: a,
        bordered: s,
        readonly: u,
        style: m,
        addonBefore: y = (Q = i.addonBefore) === null || Q === undefined ? undefined : Q.call(i),
        addonAfter: A = (H = i.addonAfter) === null || H === undefined ? undefined : H.call(i),
        prefix: U = (G = i.prefix) === null || G === undefined ? undefined : G.call(i),
        valueModifiers: re = {}
      } = ae;
      const le = _t(ae, ["class", "bordered", "readonly", "style", "addonBefore", "addonAfter", "prefix", "valueModifiers"]);
      const g = o.value;
      const fe = j({
        [`${g}-lg`]: x.value === "large",
        [`${g}-sm`]: x.value === "small",
        [`${g}-rtl`]: S.value === "rtl",
        [`${g}-readonly`]: u,
        [`${g}-borderless`]: !s,
        [`${g}-in-form-item`]: ue
      }, Se(g, p.value), a, E.value, N.value);
      let T = b(Dt, _(_({}, vt(le, ["size", "defaultValue"])), {}, {
        ref: X,
        lazy: !!re.lazy,
        value: V.value,
        class: fe,
        prefixCls: g,
        readonly: u,
        onChange: Y,
        onBlur: oe,
        onFocus: J
      }), {
        upHandler: i.upIcon ? () => b("span", {
          class: `${g}-handler-up-inner`
        }, [i.upIcon()]) : () => b(Ce, {
          class: `${g}-handler-up-inner`
        }, null),
        downHandler: i.downIcon ? () => b("span", {
          class: `${g}-handler-down-inner`
        }, [i.downIcon()]) : () => b(gt, {
          class: `${g}-handler-down-inner`
        }, null)
      });
      const pe = Ne(y) || Ne(A);
      const me = Ne(U);
      if (me || B) {
        const L = j(`${g}-affix-wrapper`, Se(`${g}-affix-wrapper`, p.value, B), {
          [`${g}-affix-wrapper-focused`]: k.value,
          [`${g}-affix-wrapper-disabled`]: C.value,
          [`${g}-affix-wrapper-sm`]: x.value === "small",
          [`${g}-affix-wrapper-lg`]: x.value === "large",
          [`${g}-affix-wrapper-rtl`]: S.value === "rtl",
          [`${g}-affix-wrapper-readonly`]: u,
          [`${g}-affix-wrapper-borderless`]: !s,
          [`${a}`]: !pe && a
        }, N.value);
        T = b("div", {
          class: L,
          style: m,
          onClick: K
        }, [me && b("span", {
          class: `${g}-prefix`
        }, [U]), T, B && b("span", {
          class: `${g}-suffix`
        }, [de])]);
      }
      if (pe) {
        const L = `${g}-group`;
        const ge = `${L}-addon`;
        const ve = y ? b("div", {
          class: ge
        }, [y]) : null;
        const be = A ? b("div", {
          class: ge
        }, [A]) : null;
        const Me = j(`${g}-wrapper`, L, {
          [`${L}-rtl`]: S.value === "rtl"
        }, N.value);
        const Ae = j(`${g}-group-wrapper`, {
          [`${g}-group-wrapper-sm`]: x.value === "small",
          [`${g}-group-wrapper-lg`]: x.value === "large",
          [`${g}-group-wrapper-rtl`]: S.value === "rtl"
        }, Se(`${o}-group-wrapper`, p.value, B), a, N.value);
        T = b("div", {
          class: Ae,
          style: m
        }, [b("div", {
          class: Me
        }, [ve && b(Be, null, {
          default: () => [b(Te, null, {
            default: () => [ve]
          })]
        }), T, be && b(Be, null, {
          default: () => [b(Te, null, {
            default: () => [be]
          })]
        })])]);
      }
      return O(bt(T, {
        style: m
      }));
    };
  }
});
const Ft = v(ye, {
  install: e => {
    e.component(ye.name, ye);
    return e;
  }
});
export { Ft as default, Vt as inputNumberProps };
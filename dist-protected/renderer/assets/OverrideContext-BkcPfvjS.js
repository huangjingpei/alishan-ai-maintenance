import { i as O, $ as p, W as _, V as g, o as v } from "./index-BegIKaMc.js";
var x = {
  icon: {
    tag: "svg",
    attrs: {
      viewBox: "64 64 896 896",
      focusable: "false"
    },
    children: [{
      tag: "path",
      attrs: {
        d: "M176 511a56 56 0 10112 0 56 56 0 10-112 0zm280 0a56 56 0 10112 0 56 56 0 10-112 0zm280 0a56 56 0 10112 0 56 56 0 10-112 0z"
      }
    }]
  },
  name: "ellipsis",
  theme: "outlined"
};
function c(e) {
  for (var l = 1; l < arguments.length; l++) {
    var n = arguments[l] != null ? Object(arguments[l]) : {};
    var r = Object.keys(n);
    if (typeof Object.getOwnPropertySymbols == "function") {
      r = r.concat(Object.getOwnPropertySymbols(n).filter(function (a) {
        return Object.getOwnPropertyDescriptor(n, a).enumerable;
      }));
    }
    r.forEach(function (a) {
      y(e, a, n[a]);
    });
  }
  return e;
}
function y(e, l, n) {
  if (l in e) {
    Object.defineProperty(e, l, {
      value: n,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    e[l] = n;
  }
  return e;
}
function s(l, n) {
  var r = c({}, l, n.attrs);
  return O(p, c({}, r, {
    icon: x
  }), null);
}
s.displayName = "EllipsisOutlined";
s.inheritAttrs = false;
const f = Symbol("OverrideContextKey");
const C = () => g(f, undefined);
const j = e => {
  const {
    prefixCls: a,
    mode: o,
    selectable: u,
    validator: b,
    onClick: m,
    expandIcon: d
  } = C() || {};
  _(f, {
    prefixCls: v(() => {
      return e.prefixCls?.value ?? (a == null ? undefined : a.value);
    }),
    mode: v(() => {
      return e.mode?.value ?? (o == null ? undefined : o.value);
    }),
    selectable: v(() => {
      return e.selectable?.value ?? (u == null ? undefined : u.value);
    }),
    validator: e.validator ?? b,
    onClick: e.onClick ?? m,
    expandIcon: e.expandIcon ?? (d == null ? undefined : d.value)
  });
};
export { s as E, C as a, j as u };
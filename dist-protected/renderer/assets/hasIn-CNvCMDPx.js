import { i as l, d as h, b as O } from "./_baseAssignValue-Cz7QXdQ5.js";
import { aG as o, az as f, b5 as T, b6 as y, b7 as w, av as x, b8 as C, L as v } from "./index-BegIKaMc.js";
function I(n, r) {
  for (var e = -1, i = n == null ? 0 : n.length, t = Array(i); ++e < i;) {
    t[e] = r(n[e], e, n);
  }
  return t;
}
var p = f ? f.prototype : undefined;
var d = p ? p.toString : undefined;
function S(n) {
  if (typeof n == "string") {
    return n;
  }
  if (o(n)) {
    return I(n, S) + "";
  }
  if (l(n)) {
    if (d) {
      return d.call(n);
    } else {
      return "";
    }
  }
  var r = n + "";
  if (r == "0" && 1 / n == -Infinity) {
    return "-0";
  } else {
    return r;
  }
}
function E(n) {
  return n;
}
function M(n, r, e) {
  switch (e.length) {
    case 0:
      return n.call(r);
    case 1:
      return n.call(r, e[0]);
    case 2:
      return n.call(r, e[0], e[1]);
    case 3:
      return n.call(r, e[0], e[1], e[2]);
  }
  return n.apply(r, e);
}
var A = 800;
var _ = 16;
var z = Date.now;
function N(n) {
  var r = 0;
  var e = 0;
  return function () {
    var i = z();
    var t = _ - (i - e);
    e = i;
    if (t > 0) {
      if (++r >= A) {
        return arguments[0];
      }
    } else {
      r = 0;
    }
    return n.apply(undefined, arguments);
  };
}
function R(n) {
  return function () {
    return n;
  };
}
var $ = h ? function (n, r) {
  return h(n, "toString", {
    configurable: true,
    enumerable: false,
    value: R(r),
    writable: true
  });
} : E;
var F = N($);
var H = Object.prototype;
var V = H.hasOwnProperty;
function tn(n, r, e) {
  var i = n[r];
  if (!V.call(n, r) || !T(i, e) || e === undefined && !(r in n)) {
    O(n, r, e);
  }
}
var g = Math.max;
function D(n, r, e) {
  r = g(r === undefined ? n.length - 1 : r, 0);
  return function () {
    var i = arguments;
    for (var t = -1, a = g(i.length - r, 0), u = Array(a); ++t < a;) {
      u[t] = i[r + t];
    }
    t = -1;
    var s = Array(r + 1);
    for (; ++t < r;) {
      s[t] = i[t];
    }
    s[r] = e(u);
    return M(n, this, s);
  };
}
var G = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
var K = /^\w*$/;
function L(n, r) {
  if (o(n)) {
    return false;
  }
  var e = typeof n;
  if (e == "number" || e == "symbol" || e == "boolean" || n == null || l(n)) {
    return true;
  } else {
    return K.test(n) || !G.test(n) || r != null && n in Object(r);
  }
}
var U = "Expected a function";
function c(n, r) {
  if (typeof n != "function" || r != null && typeof r != "function") {
    throw new TypeError(U);
  }
  function e() {
    var i = arguments;
    var t = r ? r.apply(this, i) : i[0];
    var a = e.cache;
    if (a.has(t)) {
      return a.get(t);
    }
    var u = n.apply(this, i);
    e.cache = a.set(t, u) || a;
    return u;
  }
  e.cache = new (c.Cache || y)();
  return e;
}
c.Cache = y;
var X = 500;
function Z(n) {
  var r = c(n, function (i) {
    if (e.size === X) {
      e.clear();
    }
    return i;
  });
  var e = r.cache;
  return r;
}
var q = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
var B = /\\(\\)?/g;
var J = Z(function (n) {
  var r = [];
  if (n.charCodeAt(0) === 46) {
    r.push("");
  }
  n.replace(q, function (e, i, t, a) {
    r.push(t ? a.replace(B, "$1") : i || e);
  });
  return r;
});
function Q(n) {
  if (n == null) {
    return "";
  } else {
    return S(n);
  }
}
function b(n, r) {
  if (o(n)) {
    return n;
  } else if (L(n, r)) {
    return [n];
  } else {
    return J(Q(n));
  }
}
function P(n) {
  if (typeof n == "string" || l(n)) {
    return n;
  }
  var r = n + "";
  if (r == "0" && 1 / n == -Infinity) {
    return "-0";
  } else {
    return r;
  }
}
function an(n, r) {
  r = b(r, n);
  for (var e = 0, i = r.length; n != null && e < i;) {
    n = n[P(r[e++])];
  }
  if (e && e == i) {
    return n;
  } else {
    return undefined;
  }
}
var m = f ? f.isConcatSpreadable : undefined;
function W(n) {
  return o(n) || w(n) || !!m && !!n && !!n[m];
}
function Y(n, r, e, i, t) {
  var a = -1;
  var u = n.length;
  e ||= W;
  t ||= [];
  while (++a < u) {
    var s = n[a];
    if (e(s)) {
      x(t, s);
    } else {
      t[t.length] = s;
    }
  }
  return t;
}
function k(n) {
  var r = n == null ? 0 : n.length;
  if (r) {
    return Y(n);
  } else {
    return [];
  }
}
function un(n) {
  return F(D(n, undefined, k), n + "");
}
function j(n, r) {
  return n != null && r in Object(n);
}
function nn(n, r, e) {
  r = b(r, n);
  for (var i = -1, t = r.length, a = false; ++i < t;) {
    var u = P(r[i]);
    if (!(a = n != null && e(n, u))) {
      break;
    }
    n = n[u];
  }
  if (a || ++i != t) {
    return a;
  } else {
    t = n == null ? 0 : n.length;
    return !!t && C(t) && v(u, t) && (o(n) || w(n));
  }
}
function sn(n, r) {
  return n != null && nn(n, r, j);
}
export { tn as a, an as b, b as c, L as d, I as e, un as f, sn as h, E as i, D as o, F as s, P as t };
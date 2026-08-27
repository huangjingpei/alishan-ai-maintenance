import { J as v, as as L } from "./index-BegIKaMc.js";
import { i as M } from "./_baseAssignValue-Cz7QXdQ5.js";
var N = /\s/;
function B(n) {
  for (var r = n.length; r-- && N.test(n.charAt(r)););
  return r;
}
var R = /^\s+/;
function $(n) {
  return n && n.slice(0, B(n) + 1).replace(R, "");
}
var k = NaN;
var F = /^[-+]0x[0-9a-f]+$/i;
var _ = /^0b[01]+$/i;
var j = /^0o[0-7]+$/i;
var D = parseInt;
function S(n) {
  if (typeof n == "number") {
    return n;
  }
  if (M(n)) {
    return k;
  }
  if (v(n)) {
    var r = typeof n.valueOf == "function" ? n.valueOf() : n;
    n = v(r) ? r + "" : r;
  }
  if (typeof n != "string") {
    if (n === 0) {
      return n;
    } else {
      return +n;
    }
  }
  n = $(n);
  var t = _.test(n);
  if (t || j.test(n)) {
    return D(n.slice(2), t ? 2 : 8);
  } else if (F.test(n)) {
    return k;
  } else {
    return +n;
  }
}
function h() {
  return L.Date.now();
}
var H = "Expected a function";
var J = Math.max;
var P = Math.min;
function q(n, r, t) {
  var u;
  var o;
  var l;
  var s;
  var i;
  var f;
  var c = 0;
  var p = false;
  var d = false;
  var T = true;
  if (typeof n != "function") {
    throw new TypeError(H);
  }
  r = S(r) || 0;
  if (v(t)) {
    p = !!t.leading;
    d = "maxWait" in t;
    l = d ? J(S(t.maxWait) || 0, r) : l;
    T = "trailing" in t ? !!t.trailing : T;
  }
  function x(e) {
    var a = u;
    var m = o;
    u = o = undefined;
    c = e;
    s = n.apply(m, a);
    return s;
  }
  function W(e) {
    c = e;
    i = setTimeout(g, r);
    if (p) {
      return x(e);
    } else {
      return s;
    }
  }
  function O(e) {
    var a = e - f;
    var m = e - c;
    var E = r - a;
    if (d) {
      return P(E, l - m);
    } else {
      return E;
    }
  }
  function y(e) {
    var a = e - f;
    var m = e - c;
    return f === undefined || a >= r || a < 0 || d && m >= l;
  }
  function g() {
    var e = h();
    if (y(e)) {
      return b(e);
    }
    i = setTimeout(g, O(e));
  }
  function b(e) {
    i = undefined;
    if (T && u) {
      return x(e);
    } else {
      u = o = undefined;
      return s;
    }
  }
  function A() {
    if (i !== undefined) {
      clearTimeout(i);
    }
    c = 0;
    u = f = o = i = undefined;
  }
  function C() {
    if (i === undefined) {
      return s;
    } else {
      return b(h());
    }
  }
  function I() {
    var e = h();
    var a = y(e);
    u = arguments;
    o = this;
    f = e;
    if (a) {
      if (i === undefined) {
        return W(f);
      }
      if (d) {
        clearTimeout(i);
        i = setTimeout(g, r);
        return x(f);
      }
    }
    if (i === undefined) {
      i = setTimeout(g, r);
    }
    return s;
  }
  I.cancel = A;
  I.flush = C;
  return I;
}
export { q as d, S as t };
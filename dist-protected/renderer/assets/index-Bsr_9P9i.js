import { J as _e, ao as Gt, ap as tt, aq as qn, ar as Le, as as Tn, at as Bt, au as Mn, av as _n, aw as Ht, ax as Ln, ay as ht, az as vt, aA as nt, aB as rt, aC as Ut, aD as qe, aE as Rn, aF as zt, aG as Xt, aH as Nn, aI as Kt, aJ as Vn, aK as pt, ah as Dn, V as it, o as O, W as at, g as ot, m as Yt, _ as P, d as he, u as Re, aL as Wn, S as Qt, M as Zt, i as L, q as B, A as xe, ac as be, h as fe, k as Gn, aM as Bn, $ as Hn, aN as Un, aO as Te, aP as zn, aQ as Xn, aR as Jt, r as kt, y as ue, aS as Kn, T as Yn, n as Qn, p as Zn, v as Jn, aT as kn, B as en, s as re, Q as He, aU as er, aV as tr, aW as nr, ak as tn, x as nn, P as ge, aX as Ue, t as lt, aY as rr, c as ir, b as ar, f as or, aZ as oe, a_ as rn, a$ as lr, a4 as sr, U as ce, ab as pe, aa as yt, b0 as ur, Y as Ae, b1 as fr, b2 as cr, b3 as dr, b4 as ze } from "./index-BegIKaMc.js";
import { a as an, s as mr, o as gr, i as on, b as st, d as ln, t as Me, h as hr, e as sn, c as un, f as vr } from "./hasIn-CNvCMDPx.js";
import { b as pr } from "./_baseAssignValue-Cz7QXdQ5.js";
import { u as yr, r as Ce } from "./responsiveObserve-DLsPLzTu.js";
import { b as br, a as $r, g as wr, c as xr } from "./collapseMotion-1JEOQ_aS.js";
import { t as Fr, d as Sr } from "./debounce-B9z2gMOF.js";
import "./class-DeKWk5pD.js";
var bt = Infinity;
var Or = 1.7976931348623157e+308;
function Ar(e) {
  if (!e) {
    if (e === 0) {
      return e;
    } else {
      return 0;
    }
  }
  e = Fr(e);
  if (e === bt || e === -bt) {
    var t = e < 0 ? -1 : 1;
    return t * Or;
  }
  if (e === e) {
    return e;
  } else {
    return 0;
  }
}
function Cr(e) {
  var t = Ar(e);
  var n = t % 1;
  if (t === t) {
    if (n) {
      return t - n;
    } else {
      return t;
    }
  } else {
    return 0;
  }
}
var $t = Object.create;
var Er = function () {
  function e() {}
  return function (t) {
    if (!_e(t)) {
      return {};
    }
    if ($t) {
      return $t(t);
    }
    e.prototype = t;
    var n = new e();
    e.prototype = undefined;
    return n;
  };
}();
function jr(e, t) {
  var n = -1;
  var r = e.length;
  for (t ||= Array(r); ++n < r;) {
    t[n] = e[n];
  }
  return t;
}
function Pr(e, t) {
  for (var n = -1, r = e == null ? 0 : e.length; ++n < r && t(e[n], n, e) !== false;);
  return e;
}
function Se(e, t, n, r) {
  var i = !n;
  n ||= {};
  for (var a = -1, o = t.length; ++a < o;) {
    var l = t[a];
    var f = undefined;
    if (f === undefined) {
      f = e[l];
    }
    if (i) {
      pr(n, l, f);
    } else {
      an(n, l, f);
    }
  }
  return n;
}
function Ir(e, t) {
  return mr(gr(e, t, on), e + "");
}
function qr(e) {
  var t = [];
  if (e != null) {
    for (var n in Object(e)) {
      t.push(n);
    }
  }
  return t;
}
var Tr = Object.prototype;
var Mr = Tr.hasOwnProperty;
function _r(e) {
  if (!_e(e)) {
    return qr(e);
  }
  var t = Gt(e);
  var n = [];
  for (var r in e) {
    if (r != "constructor" || !t && !!Mr.call(e, r)) {
      n.push(r);
    }
  }
  return n;
}
function ut(e) {
  if (tt(e)) {
    return qn(e, true);
  } else {
    return _r(e);
  }
}
function Lr(e, t, n) {
  var r = e == null ? undefined : st(e, t);
  if (r === undefined) {
    return n;
  } else {
    return r;
  }
}
function Rr(e, t, n) {
  var r = -1;
  var i = e.length;
  if (t < 0) {
    t = -t > i ? 0 : i + t;
  }
  n = n > i ? i : n;
  if (n < 0) {
    n += i;
  }
  i = t > n ? 0 : n - t >>> 0;
  t >>>= 0;
  var a = Array(i);
  for (; ++r < i;) {
    a[r] = e[r + t];
  }
  return a;
}
function Nr(e, t) {
  return e && Se(t, Le(t), e);
}
function Vr(e, t) {
  return e && Se(t, ut(t), e);
}
var fn = typeof exports == "object" && exports && !exports.nodeType && exports;
var wt = fn && typeof module == "object" && module && !module.nodeType && module;
var Dr = wt && wt.exports === fn;
var xt = Dr ? Tn.Buffer : undefined;
var Ft = xt ? xt.allocUnsafe : undefined;
function Wr(e, t) {
  if (t) {
    return e.slice();
  }
  var n = e.length;
  var r = Ft ? Ft(n) : new e.constructor(n);
  e.copy(r);
  return r;
}
function Gr(e, t) {
  return Se(e, Bt(e), t);
}
var Br = Object.getOwnPropertySymbols;
var cn = Br ? function (e) {
  var t = [];
  for (; e;) {
    _n(t, Bt(e));
    e = Ht(e);
  }
  return t;
} : Mn;
function Hr(e, t) {
  return Se(e, cn(e), t);
}
function dn(e) {
  return Ln(e, ut, cn);
}
var Ur = Object.prototype;
var zr = Ur.hasOwnProperty;
function Xr(e) {
  var t = e.length;
  var n = new e.constructor(t);
  if (t && typeof e[0] == "string" && zr.call(e, "index")) {
    n.index = e.index;
    n.input = e.input;
  }
  return n;
}
function ft(e) {
  var t = new e.constructor(e.byteLength);
  new ht(t).set(new ht(e));
  return t;
}
function Kr(e, t) {
  var n = t ? ft(e.buffer) : e.buffer;
  return new e.constructor(n, e.byteOffset, e.byteLength);
}
var Yr = /\w*$/;
function Qr(e) {
  var t = new e.constructor(e.source, Yr.exec(e));
  t.lastIndex = e.lastIndex;
  return t;
}
var St = vt ? vt.prototype : undefined;
var Ot = St ? St.valueOf : undefined;
function Zr(e) {
  if (Ot) {
    return Object(Ot.call(e));
  } else {
    return {};
  }
}
function Jr(e, t) {
  var n = t ? ft(e.buffer) : e.buffer;
  return new e.constructor(n, e.byteOffset, e.length);
}
var kr = "[object Boolean]";
var ei = "[object Date]";
var ti = "[object Map]";
var ni = "[object Number]";
var ri = "[object RegExp]";
var ii = "[object Set]";
var ai = "[object String]";
var oi = "[object Symbol]";
var li = "[object ArrayBuffer]";
var si = "[object DataView]";
var ui = "[object Float32Array]";
var fi = "[object Float64Array]";
var ci = "[object Int8Array]";
var di = "[object Int16Array]";
var mi = "[object Int32Array]";
var gi = "[object Uint8Array]";
var hi = "[object Uint8ClampedArray]";
var vi = "[object Uint16Array]";
var pi = "[object Uint32Array]";
function yi(e, t, n) {
  var r = e.constructor;
  switch (t) {
    case li:
      return ft(e);
    case kr:
    case ei:
      return new r(+e);
    case si:
      return Kr(e, n);
    case ui:
    case fi:
    case ci:
    case di:
    case mi:
    case gi:
    case hi:
    case vi:
    case pi:
      return Jr(e, n);
    case ti:
      return new r();
    case ni:
    case ai:
      return new r(e);
    case ri:
      return Qr(e);
    case ii:
      return new r();
    case oi:
      return Zr(e);
  }
}
function bi(e) {
  if (typeof e.constructor == "function" && !Gt(e)) {
    return Er(Ht(e));
  } else {
    return {};
  }
}
var $i = "[object Map]";
function wi(e) {
  return nt(e) && rt(e) == $i;
}
var At = qe && qe.isMap;
var xi = At ? Ut(At) : wi;
var Fi = "[object Set]";
function Si(e) {
  return nt(e) && rt(e) == Fi;
}
var Ct = qe && qe.isSet;
var Oi = Ct ? Ut(Ct) : Si;
var Ai = 1;
var Ci = 2;
var Ei = 4;
var mn = "[object Arguments]";
var ji = "[object Array]";
var Pi = "[object Boolean]";
var Ii = "[object Date]";
var qi = "[object Error]";
var gn = "[object Function]";
var Ti = "[object GeneratorFunction]";
var Mi = "[object Map]";
var _i = "[object Number]";
var hn = "[object Object]";
var Li = "[object RegExp]";
var Ri = "[object Set]";
var Ni = "[object String]";
var Vi = "[object Symbol]";
var Di = "[object WeakMap]";
var Wi = "[object ArrayBuffer]";
var Gi = "[object DataView]";
var Bi = "[object Float32Array]";
var Hi = "[object Float64Array]";
var Ui = "[object Int8Array]";
var zi = "[object Int16Array]";
var Xi = "[object Int32Array]";
var Ki = "[object Uint8Array]";
var Yi = "[object Uint8ClampedArray]";
var Qi = "[object Uint16Array]";
var Zi = "[object Uint32Array]";
var D = {};
D[mn] = D[ji] = D[Wi] = D[Gi] = D[Pi] = D[Ii] = D[Bi] = D[Hi] = D[Ui] = D[zi] = D[Xi] = D[Mi] = D[_i] = D[hn] = D[Li] = D[Ri] = D[Ni] = D[Vi] = D[Ki] = D[Yi] = D[Qi] = D[Zi] = true;
D[qi] = D[gn] = D[Di] = false;
function $e(e, t, n, r, i, a) {
  var o;
  var l = t & Ai;
  var f = t & Ci;
  var p = t & Ei;
  if (n) {
    o = i ? n(e, r, i, a) : n(e);
  }
  if (o !== undefined) {
    return o;
  }
  if (!_e(e)) {
    return e;
  }
  var d = Xt(e);
  if (d) {
    o = Xr(e);
    if (!l) {
      return jr(e, o);
    }
  } else {
    var h = rt(e);
    var v = h == gn || h == Ti;
    if (Rn(e)) {
      return Wr(e, l);
    }
    if (h == hn || h == mn || v && !i) {
      o = f || v ? {} : bi(e);
      if (!l) {
        if (f) {
          return Hr(e, Vr(o, e));
        } else {
          return Gr(e, Nr(o, e));
        }
      }
    } else {
      if (!D[h]) {
        if (i) {
          return e;
        } else {
          return {};
        }
      }
      o = yi(e, h, l);
    }
  }
  a ||= new zt();
  var y = a.get(e);
  if (y) {
    return y;
  }
  a.set(e, o);
  if (Oi(e)) {
    e.forEach(function (b) {
      o.add($e(b, t, n, b, e, a));
    });
  } else if (xi(e)) {
    e.forEach(function (b, m) {
      o.set(m, $e(b, t, n, m, e, a));
    });
  }
  var $ = p ? f ? dn : Nn : f ? ut : Le;
  var c = d ? undefined : $(e);
  Pr(c || e, function (b, m) {
    if (c) {
      m = b;
      b = e[m];
    }
    an(o, m, $e(b, t, n, m, e, a));
  });
  return o;
}
var Ji = 1;
var ki = 4;
function Pe(e) {
  return $e(e, Ji | ki);
}
var ea = 1;
var ta = 2;
function na(e, t, n, r) {
  var i = n.length;
  var a = i;
  if (e == null) {
    return !a;
  }
  for (e = Object(e); i--;) {
    var o = n[i];
    if (o[2] ? o[1] !== e[o[0]] : !(o[0] in e)) {
      return false;
    }
  }
  while (++i < a) {
    o = n[i];
    var l = o[0];
    var f = e[l];
    var p = o[1];
    if (o[2]) {
      if (f === undefined && !(l in e)) {
        return false;
      }
    } else {
      var d = new zt();
      var h;
      if (!(h === undefined ? Kt(p, f, ea | ta, r, d) : h)) {
        return false;
      }
    }
  }
  return true;
}
function vn(e) {
  return e === e && !_e(e);
}
function ra(e) {
  var t = Le(e);
  for (var n = t.length; n--;) {
    var r = t[n];
    var i = e[r];
    t[n] = [r, i, vn(i)];
  }
  return t;
}
function pn(e, t) {
  return function (n) {
    if (n == null) {
      return false;
    } else {
      return n[e] === t && (t !== undefined || e in Object(n));
    }
  };
}
function ia(e) {
  var t = ra(e);
  if (t.length == 1 && t[0][2]) {
    return pn(t[0][0], t[0][1]);
  } else {
    return function (n) {
      return n === e || na(n, e, t);
    };
  }
}
var aa = 1;
var oa = 2;
function la(e, t) {
  if (ln(e) && vn(t)) {
    return pn(Me(e), t);
  } else {
    return function (n) {
      var r = Lr(n, e);
      if (r === undefined && r === t) {
        return hr(n, e);
      } else {
        return Kt(t, r, aa | oa);
      }
    };
  }
}
function sa(e) {
  return function (t) {
    if (t == null) {
      return undefined;
    } else {
      return t[e];
    }
  };
}
function ua(e) {
  return function (t) {
    return st(t, e);
  };
}
function fa(e) {
  if (ln(e)) {
    return sa(Me(e));
  } else {
    return ua(e);
  }
}
function yn(e) {
  if (typeof e == "function") {
    return e;
  } else if (e == null) {
    return on;
  } else if (typeof e == "object") {
    if (Xt(e)) {
      return la(e[0], e[1]);
    } else {
      return ia(e);
    }
  } else {
    return fa(e);
  }
}
function ca(e) {
  return nt(e) && tt(e);
}
function da(e) {
  var t = e == null ? 0 : e.length;
  if (t) {
    return e[t - 1];
  } else {
    return undefined;
  }
}
function ma(e) {
  return function (t, n, r) {
    var i = Object(t);
    if (!tt(t)) {
      var a = yn(n);
      t = Le(t);
      n = function (l) {
        return a(i[l], l, i);
      };
    }
    var o = e(t, n, r);
    if (o > -1) {
      return i[a ? t[o] : o];
    } else {
      return undefined;
    }
  };
}
var ga = Math.max;
function ha(e, t, n) {
  var r = e == null ? 0 : e.length;
  if (!r) {
    return -1;
  }
  var i = n == null ? 0 : Cr(n);
  if (i < 0) {
    i = ga(r + i, 0);
  }
  return br(e, yn(t), i);
}
var va = ma(ha);
var pa = Math.min;
function ya(e, t, n) {
  var r = $r;
  var i = e[0].length;
  var a = e.length;
  for (var o = a, l = Array(a), f = Infinity, p = []; o--;) {
    var d = e[o];
    f = pa(d.length, f);
    l[o] = i >= 120 && d.length >= 120 ? new Vn(o && d) : undefined;
  }
  d = e[0];
  var h = -1;
  var v = l[0];
  e: while (++h < i && p.length < f) {
    var y = d[h];
    var $ = y;
    y = y !== 0 ? y : 0;
    if (!(v ? pt(v, $) : r(p, $))) {
      for (o = a; --o;) {
        var c = l[o];
        if (!(c ? pt(c, $) : r(e[o], $))) {
          continue e;
        }
      }
      if (v) {
        v.push($);
      }
      p.push(y);
    }
  }
  return p;
}
function ba(e) {
  if (ca(e)) {
    return e;
  } else {
    return [];
  }
}
var $a = Ir(function (e) {
  var t = sn(e, ba);
  if (t.length && t[0] === e[0]) {
    return ya(t);
  } else {
    return [];
  }
});
function wa(e, t) {
  if (t.length < 2) {
    return e;
  } else {
    return st(e, Rr(t, 0, -1));
  }
}
var xa = Object.prototype;
var Fa = xa.hasOwnProperty;
function Sa(e, t) {
  t = un(t, e);
  var n = -1;
  var r = t.length;
  if (!r) {
    return true;
  }
  while (++n < r) {
    var i = Me(t[n]);
    if (i === "__proto__" && !Fa.call(e, "__proto__") || (i === "constructor" || i === "prototype") && n < r - 1) {
      return false;
    }
  }
  var a = wa(e, t);
  return a == null || delete a[Me(da(t))];
}
function Oa(e) {
  if (Dn(e)) {
    return undefined;
  } else {
    return e;
  }
}
var Aa = 1;
var Ca = 2;
var Ea = 4;
var ja = vr(function (e, t) {
  var n = {};
  if (e == null) {
    return n;
  }
  var r = false;
  t = sn(t, function (a) {
    a = un(a, e);
    r ||= a.length > 1;
    return a;
  });
  Se(e, dn(e), n);
  if (r) {
    n = $e(n, Aa | Ca | Ea, Oa);
  }
  for (var i = t.length; i--;) {
    Sa(n, t[i]);
  }
  return n;
});
function Et(e) {
  return typeof e == "object" && e != null && e.nodeType === 1;
}
function jt(e, t) {
  return (!t || e !== "hidden") && e !== "visible" && e !== "clip";
}
function De(e, t) {
  if (e.clientHeight < e.scrollHeight || e.clientWidth < e.scrollWidth) {
    var n = getComputedStyle(e, null);
    return jt(n.overflowY, t) || jt(n.overflowX, t) || function (r) {
      var i = function (a) {
        if (!a.ownerDocument || !a.ownerDocument.defaultView) {
          return null;
        }
        try {
          return a.ownerDocument.defaultView.frameElement;
        } catch {
          return null;
        }
      }(r);
      return !!i && (i.clientHeight < r.scrollHeight || i.clientWidth < r.scrollWidth);
    }(e);
  }
  return false;
}
function Ee(e, t, n, r, i, a, o, l) {
  if (a < e && o > t || a > e && o < t) {
    return 0;
  } else if (a <= e && l <= n || o >= t && l >= n) {
    return a - e - r;
  } else if (o > t && l < n || a < e && l > n) {
    return o - t + i;
  } else {
    return 0;
  }
}
function Pt(e, t) {
  var n = window;
  var r = t.scrollMode;
  var i = t.block;
  var a = t.inline;
  var o = t.boundary;
  var l = t.skipOverflowHiddenElements;
  var f = typeof o == "function" ? o : function (In) {
    return In !== o;
  };
  if (!Et(e)) {
    throw new TypeError("Invalid target");
  }
  var p;
  var d;
  var h = document.scrollingElement || document.documentElement;
  var v = [];
  for (var y = e; Et(y) && f(y);) {
    if ((y = (d = (p = y).parentElement) == null ? p.getRootNode().host || null : d) === h) {
      v.push(y);
      break;
    }
    if (y == null || y !== document.body || !De(y) || !!De(document.documentElement)) {
      if (y != null && De(y, l)) {
        v.push(y);
      }
    }
  }
  var $ = n.visualViewport ? n.visualViewport.width : innerWidth;
  var c = n.visualViewport ? n.visualViewport.height : innerHeight;
  var b = window.scrollX || pageXOffset;
  var m = window.scrollY || pageYOffset;
  var F = e.getBoundingClientRect();
  var s = F.height;
  var u = F.width;
  var g = F.top;
  var x = F.right;
  var A = F.bottom;
  var C = F.left;
  var T = i === "start" || i === "nearest" ? g : i === "end" ? A : g + s / 2;
  var q = a === "center" ? C + u / 2 : a === "end" ? x : C;
  var R = [];
  for (var _ = 0; _ < v.length; _++) {
    var E = v[_];
    var H = E.getBoundingClientRect();
    var Q = H.height;
    var X = H.width;
    var S = H.top;
    var j = H.right;
    var N = H.bottom;
    var U = H.left;
    if (r === "if-needed" && g >= 0 && C >= 0 && A <= c && x <= $ && g >= S && A <= N && C >= U && x <= j) {
      return R;
    }
    var K = getComputedStyle(E);
    var J = parseInt(K.borderLeftWidth, 10);
    var ie = parseInt(K.borderTopWidth, 10);
    var Z = parseInt(K.borderRightWidth, 10);
    var w = parseInt(K.borderBottomWidth, 10);
    var I = 0;
    var V = 0;
    var W = "offsetWidth" in E ? E.offsetWidth - E.clientWidth - J - Z : 0;
    var G = "offsetHeight" in E ? E.offsetHeight - E.clientHeight - ie - w : 0;
    var Y = "offsetWidth" in E ? E.offsetWidth === 0 ? 0 : X / E.offsetWidth : 0;
    var te = "offsetHeight" in E ? E.offsetHeight === 0 ? 0 : Q / E.offsetHeight : 0;
    if (h === E) {
      I = i === "start" ? T : i === "end" ? T - c : i === "nearest" ? Ee(m, m + c, c, ie, w, m + T, m + T + s, s) : T - c / 2;
      V = a === "start" ? q : a === "center" ? q - $ / 2 : a === "end" ? q - $ : Ee(b, b + $, $, J, Z, b + q, b + q + u, u);
      I = Math.max(0, I + m);
      V = Math.max(0, V + b);
    } else {
      I = i === "start" ? T - S - ie : i === "end" ? T - N + w + G : i === "nearest" ? Ee(S, N, Q, ie, w + G, T, T + s, s) : T - (S + Q / 2) + G / 2;
      V = a === "start" ? q - U - J : a === "center" ? q - (U + X / 2) + W / 2 : a === "end" ? q - j + Z + W : Ee(U, j, X, J, Z + W, q, q + u, u);
      var ne = E.scrollLeft;
      var ve = E.scrollTop;
      T += ve - (I = Math.max(0, Math.min(ve + I / te, E.scrollHeight - Q / te + G)));
      q += ne - (V = Math.max(0, Math.min(ne + V / Y, E.scrollWidth - X / Y + W)));
    }
    R.push({
      el: E,
      top: I,
      left: V
    });
  }
  return R;
}
function bn(e) {
  return e === Object(e) && Object.keys(e).length !== 0;
}
function Pa(e, t = "auto") {
  var n = "scrollBehavior" in document.body.style;
  e.forEach(function (r) {
    var i = r.el;
    var a = r.top;
    var o = r.left;
    if (i.scroll && n) {
      i.scroll({
        top: a,
        left: o,
        behavior: t
      });
    } else {
      i.scrollTop = a;
      i.scrollLeft = o;
    }
  });
}
function Ia(e) {
  if (e === false) {
    return {
      block: "end",
      inline: "nearest"
    };
  } else if (bn(e)) {
    return e;
  } else {
    return {
      block: "start",
      inline: "nearest"
    };
  }
}
function qa(e, t) {
  var n = e.isConnected || e.ownerDocument.documentElement.contains(e);
  if (bn(t) && typeof t.behavior == "function") {
    return t.behavior(n ? Pt(e, t) : []);
  }
  if (n) {
    var r = Ia(t);
    return Pa(Pt(e, r), r.behavior);
  }
}
const $n = Symbol("rowContextKey");
const Ta = e => {
  at($n, e);
};
const Ma = () => it($n, {
  gutter: O(() => {}),
  wrap: O(() => {}),
  supportFlexGap: O(() => {})
});
const _a = e => {
  const {
    componentCls: t
  } = e;
  return {
    [t]: {
      display: "flex",
      flexFlow: "row wrap",
      minWidth: 0,
      "&::before, &::after": {
        display: "flex"
      },
      "&-no-wrap": {
        flexWrap: "nowrap"
      },
      "&-start": {
        justifyContent: "flex-start"
      },
      "&-center": {
        justifyContent: "center"
      },
      "&-end": {
        justifyContent: "flex-end"
      },
      "&-space-between": {
        justifyContent: "space-between"
      },
      "&-space-around ": {
        justifyContent: "space-around"
      },
      "&-space-evenly ": {
        justifyContent: "space-evenly"
      },
      "&-top": {
        alignItems: "flex-start"
      },
      "&-middle": {
        alignItems: "center"
      },
      "&-bottom": {
        alignItems: "flex-end"
      }
    }
  };
};
const La = e => {
  const {
    componentCls: t
  } = e;
  return {
    [t]: {
      position: "relative",
      maxWidth: "100%",
      minHeight: 1
    }
  };
};
const Ra = (e, t) => {
  const {
    componentCls: n,
    gridColumns: r
  } = e;
  const i = {};
  for (let a = r; a >= 0; a--) {
    if (a === 0) {
      i[`${n}${t}-${a}`] = {
        display: "none"
      };
      i[`${n}-push-${a}`] = {
        insetInlineStart: "auto"
      };
      i[`${n}-pull-${a}`] = {
        insetInlineEnd: "auto"
      };
      i[`${n}${t}-push-${a}`] = {
        insetInlineStart: "auto"
      };
      i[`${n}${t}-pull-${a}`] = {
        insetInlineEnd: "auto"
      };
      i[`${n}${t}-offset-${a}`] = {
        marginInlineEnd: 0
      };
      i[`${n}${t}-order-${a}`] = {
        order: 0
      };
    } else {
      i[`${n}${t}-${a}`] = {
        display: "block",
        flex: `0 0 ${a / r * 100}%`,
        maxWidth: `${a / r * 100}%`
      };
      i[`${n}${t}-push-${a}`] = {
        insetInlineStart: `${a / r * 100}%`
      };
      i[`${n}${t}-pull-${a}`] = {
        insetInlineEnd: `${a / r * 100}%`
      };
      i[`${n}${t}-offset-${a}`] = {
        marginInlineStart: `${a / r * 100}%`
      };
      i[`${n}${t}-order-${a}`] = {
        order: a
      };
    }
  }
  return i;
};
const Xe = (e, t) => Ra(e, t);
const Na = (e, t, n) => ({
  [`@media (min-width: ${t}px)`]: P({}, Xe(e, n))
});
const Va = ot("Grid", e => [_a(e)]);
const Da = ot("Grid", e => {
  const t = Yt(e, {
    gridColumns: 24
  });
  const n = {
    "-sm": t.screenSMMin,
    "-md": t.screenMDMin,
    "-lg": t.screenLGMin,
    "-xl": t.screenXLMin,
    "-xxl": t.screenXXLMin
  };
  return [La(t), Xe(t, ""), Xe(t, "-xs"), Object.keys(n).map(r => Na(t, n[r], r)).reduce((r, i) => P(P({}, r), i), {})];
});
const Wa = () => ({
  align: be([String, Object]),
  justify: be([String, Object]),
  prefixCls: String,
  gutter: be([Number, Array, Object], 0),
  wrap: {
    type: Boolean,
    default: undefined
  }
});
const Ga = he({
  compatConfig: {
    MODE: 3
  },
  name: "ARow",
  inheritAttrs: false,
  props: Wa(),
  setup(e, t) {
    let {
      slots: n,
      attrs: r
    } = t;
    const {
      prefixCls: i,
      direction: a
    } = Re("row", e);
    const [o, l] = Va(i);
    let f;
    const p = yr();
    const d = xe({
      xs: true,
      sm: true,
      md: true,
      lg: true,
      xl: true,
      xxl: true
    });
    const h = xe({
      xs: false,
      sm: false,
      md: false,
      lg: false,
      xl: false,
      xxl: false
    });
    const v = s => O(() => {
      if (typeof e[s] == "string") {
        return e[s];
      }
      if (typeof e[s] != "object") {
        return "";
      }
      for (let u = 0; u < Ce.length; u++) {
        const g = Ce[u];
        if (!h.value[g]) {
          continue;
        }
        const x = e[s][g];
        if (x !== undefined) {
          return x;
        }
      }
      return "";
    });
    const y = v("align");
    const $ = v("justify");
    const c = Wn();
    Qt(() => {
      f = p.value.subscribe(s => {
        h.value = s;
        const u = e.gutter || 0;
        if (!Array.isArray(u) && typeof u == "object" || Array.isArray(u) && (typeof u[0] == "object" || typeof u[1] == "object")) {
          d.value = s;
        }
      });
    });
    Zt(() => {
      p.value.unsubscribe(f);
    });
    const b = O(() => {
      const s = [undefined, undefined];
      const {
        gutter: u = 0
      } = e;
      (Array.isArray(u) ? u : [u, undefined]).forEach((x, A) => {
        if (typeof x == "object") {
          for (let C = 0; C < Ce.length; C++) {
            const T = Ce[C];
            if (d.value[T] && x[T] !== undefined) {
              s[A] = x[T];
              break;
            }
          }
        } else {
          s[A] = x;
        }
      });
      return s;
    });
    Ta({
      gutter: b,
      supportFlexGap: c,
      wrap: O(() => e.wrap)
    });
    const m = O(() => fe(i.value, {
      [`${i.value}-no-wrap`]: e.wrap === false,
      [`${i.value}-${$.value}`]: $.value,
      [`${i.value}-${y.value}`]: y.value,
      [`${i.value}-rtl`]: a.value === "rtl"
    }, r.class, l.value));
    const F = O(() => {
      const s = b.value;
      const u = {};
      const g = s[0] != null && s[0] > 0 ? `${s[0] / -2}px` : undefined;
      const x = s[1] != null && s[1] > 0 ? `${s[1] / -2}px` : undefined;
      if (g) {
        u.marginLeft = g;
        u.marginRight = g;
      }
      if (c.value) {
        u.rowGap = `${s[1]}px`;
      } else if (x) {
        u.marginTop = x;
        u.marginBottom = x;
      }
      return u;
    });
    return () => {
      var s;
      return o(L("div", B(B({}, r), {}, {
        class: m.value,
        style: P(P({}, F.value), r.style)
      }), [(s = n.default) === null || s === undefined ? undefined : s.call(n)]));
    };
  }
});
function se() {
  se = Object.assign ? Object.assign.bind() : function (e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n) {
        if (Object.prototype.hasOwnProperty.call(n, r)) {
          e[r] = n[r];
        }
      }
    }
    return e;
  };
  return se.apply(this, arguments);
}
function Ba(e, t) {
  e.prototype = Object.create(t.prototype);
  e.prototype.constructor = e;
  Fe(e, t);
}
function Ke(e) {
  Ke = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (n) {
    return n.__proto__ || Object.getPrototypeOf(n);
  };
  return Ke(e);
}
function Fe(e, t) {
  Fe = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (r, i) {
    r.__proto__ = i;
    return r;
  };
  return Fe(e, t);
}
function Ha() {
  if (typeof Reflect === "undefined" || !Reflect.construct || Reflect.construct.sham) {
    return false;
  }
  if (typeof Proxy == "function") {
    return true;
  }
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch {
    return false;
  }
}
function Ie(e, t, n) {
  if (Ha()) {
    Ie = Reflect.construct.bind();
  } else {
    Ie = function (i, a, o) {
      var l = [null];
      l.push.apply(l, a);
      var f = Function.bind.apply(i, l);
      var p = new f();
      if (o) {
        Fe(p, o.prototype);
      }
      return p;
    };
  }
  return Ie.apply(null, arguments);
}
function Ua(e) {
  return Function.toString.call(e).indexOf("[native code]") !== -1;
}
function Ye(e) {
  var t = typeof Map == "function" ? new Map() : undefined;
  Ye = function (r) {
    if (r === null || !Ua(r)) {
      return r;
    }
    if (typeof r != "function") {
      throw new TypeError("Super expression must either be null or a function");
    }
    if (typeof t !== "undefined") {
      if (t.has(r)) {
        return t.get(r);
      }
      t.set(r, i);
    }
    function i() {
      return Ie(r, arguments, Ke(this).constructor);
    }
    i.prototype = Object.create(r.prototype, {
      constructor: {
        value: i,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return Fe(i, r);
  };
  return Ye(e);
}
var za = /%[sdj%]/g;
function Xa() {}
function Qe(e) {
  if (!e || !e.length) {
    return null;
  }
  var t = {};
  e.forEach(function (n) {
    var r = n.field;
    t[r] = t[r] || [];
    t[r].push(n);
  });
  return t;
}
function ee(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++) {
    n[r - 1] = arguments[r];
  }
  var i = 0;
  var a = n.length;
  if (typeof e == "function") {
    return e.apply(null, n);
  }
  if (typeof e == "string") {
    var o = e.replace(za, function (l) {
      if (l === "%%") {
        return "%";
      }
      if (i >= a) {
        return l;
      }
      switch (l) {
        case "%s":
          return String(n[i++]);
        case "%d":
          return Number(n[i++]);
        case "%j":
          try {
            return JSON.stringify(n[i++]);
          } catch {
            return "[Circular]";
          }
          break;
        default:
          return l;
      }
    });
    return o;
  }
  return e;
}
function Ka(e) {
  return e === "string" || e === "url" || e === "hex" || e === "email" || e === "date" || e === "pattern";
}
function z(e, t) {
  return e == null || t === "array" && !!Array.isArray(e) && !e.length || !!Ka(t) && typeof e == "string" && !e;
}
function Ya(e, t, n) {
  var r = [];
  var i = 0;
  var a = e.length;
  function o(l) {
    r.push.apply(r, l || []);
    i++;
    if (i === a) {
      n(r);
    }
  }
  e.forEach(function (l) {
    t(l, o);
  });
}
function It(e, t, n) {
  var r = 0;
  var i = e.length;
  function a(o) {
    if (o && o.length) {
      n(o);
      return;
    }
    var l = r;
    r = r + 1;
    if (l < i) {
      t(e[l], a);
    } else {
      n([]);
    }
  }
  a([]);
}
function Qa(e) {
  var t = [];
  Object.keys(e).forEach(function (n) {
    t.push.apply(t, e[n] || []);
  });
  return t;
}
var qt = function (e) {
  Ba(t, e);
  function t(n, r) {
    var i;
    i = e.call(this, "Async Validation Error") || this;
    i.errors = n;
    i.fields = r;
    return i;
  }
  return t;
}(Ye(Error));
function Za(e, t, n, r, i) {
  if (t.first) {
    var a = new Promise(function (v, y) {
      function $(m) {
        r(m);
        if (m.length) {
          return y(new qt(m, Qe(m)));
        } else {
          return v(i);
        }
      }
      var c = Qa(e);
      It(c, n, $);
    });
    a.catch(function (v) {
      return v;
    });
    return a;
  }
  var o = t.firstFields === true ? Object.keys(e) : t.firstFields || [];
  var l = Object.keys(e);
  var f = l.length;
  var p = 0;
  var d = [];
  var h = new Promise(function (v, y) {
    function $(b) {
      d.push.apply(d, b);
      p++;
      if (p === f) {
        r(d);
        if (d.length) {
          return y(new qt(d, Qe(d)));
        } else {
          return v(i);
        }
      }
    }
    if (!l.length) {
      r(d);
      v(i);
    }
    l.forEach(function (c) {
      var b = e[c];
      if (o.indexOf(c) !== -1) {
        It(b, n, $);
      } else {
        Ya(b, n, $);
      }
    });
  });
  h.catch(function (v) {
    return v;
  });
  return h;
}
function Ja(e) {
  return !!e && e.message !== undefined;
}
function ka(e, t) {
  var n = e;
  for (var r = 0; r < t.length; r++) {
    if (n == null) {
      return n;
    }
    n = n[t[r]];
  }
  return n;
}
function Tt(e, t) {
  return function (n) {
    var r;
    if (e.fullFields) {
      r = ka(t, e.fullFields);
    } else {
      r = t[n.field || e.fullField];
    }
    if (Ja(n)) {
      n.field = n.field || e.fullField;
      n.fieldValue = r;
      return n;
    } else {
      return {
        message: typeof n == "function" ? n() : n,
        fieldValue: r,
        field: n.field || e.fullField
      };
    }
  };
}
function Mt(e, t) {
  if (t) {
    for (var n in t) {
      if (t.hasOwnProperty(n)) {
        var r = t[n];
        if (typeof r == "object" && typeof e[n] == "object") {
          e[n] = se({}, e[n], r);
        } else {
          e[n] = r;
        }
      }
    }
  }
  return e;
}
function wn(t, n, r, i, a, o) {
  if (t.required && (!r.hasOwnProperty(t.field) || z(n, o || t.type))) {
    i.push(ee(a.messages.required, t.fullField));
  }
}
function eo(t, n, r, i, a) {
  if (/^\s+$/.test(n) || n === "") {
    i.push(ee(a.messages.whitespace, t.fullField));
  }
}
var je;
function to() {
  if (je) {
    return je;
  }
  var e = "[a-fA-F\\d:]";
  function t(u) {
    if (u && u.includeBoundaries) {
      return "(?:(?<=\\s|^)(?=" + e + ")|(?<=" + e + ")(?=\\s|$))";
    } else {
      return "";
    }
  }
  var n = "(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}";
  var r = "[a-fA-F\\d]{1,4}";
  var i = `
(?:
(?:${r}:){7}(?:${r}|:)|                                    // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8
(?:${r}:){6}(?:${n}|:${r}|:)|                             // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4
(?:${r}:){5}(?::${n}|(?::${r}){1,2}|:)|                   // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4
(?:${r}:){4}(?:(?::${r}){0,1}:${n}|(?::${r}){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4
(?:${r}:){3}(?:(?::${r}){0,2}:${n}|(?::${r}){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4
(?:${r}:){2}(?:(?::${r}){0,3}:${n}|(?::${r}){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4
(?:${r}:){1}(?:(?::${r}){0,4}:${n}|(?::${r}){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4
(?::(?:(?::${r}){0,5}:${n}|(?::${r}){1,7}|:))             // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4
)(?:%[0-9a-zA-Z]{1,})?                                             // %eth0            %1
`.replace(/\s*\/\/.*$/gm, "").replace(/\n/g, "").trim();
  var a = new RegExp("(?:^" + n + "$)|(?:^" + i + "$)");
  var o = new RegExp("^" + n + "$");
  var l = new RegExp("^" + i + "$");
  function f(u) {
    if (u && u.exact) {
      return a;
    } else {
      return new RegExp("(?:" + t(u) + n + t(u) + ")|(?:" + t(u) + i + t(u) + ")", "g");
    }
  }
  f.v4 = function (s) {
    if (s && s.exact) {
      return o;
    } else {
      return new RegExp("" + t(s) + n + t(s), "g");
    }
  };
  f.v6 = function (s) {
    if (s && s.exact) {
      return l;
    } else {
      return new RegExp("" + t(s) + i + t(s), "g");
    }
  };
  var p = "(?:(?:[a-z]+:)?//)";
  var d = "(?:\\S+(?::\\S*)?@)?";
  var h = f.v4().source;
  var v = f.v6().source;
  var y = "(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)";
  var $ = "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*";
  var c = "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))";
  var b = "(?::\\d{2,5})?";
  var m = "(?:[/?#][^\\s\"]*)?";
  var F = "(?:" + p + "|www\\.)" + d + "(?:localhost|" + h + "|" + v + "|" + y + $ + c + ")" + b + m;
  je = new RegExp("(?:^" + F + "$)", "i");
  return je;
}
var _t = {
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+\.)+[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}))$/,
  hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i
};
var ye = {
  integer: function (t) {
    return ye.number(t) && parseInt(t, 10) === t;
  },
  float: function (t) {
    return ye.number(t) && !ye.integer(t);
  },
  array: function (t) {
    return Array.isArray(t);
  },
  regexp: function (t) {
    if (t instanceof RegExp) {
      return true;
    }
    try {
      return !!new RegExp(t);
    } catch {
      return false;
    }
  },
  date: function (t) {
    return typeof t.getTime == "function" && typeof t.getMonth == "function" && typeof t.getYear == "function" && !isNaN(t.getTime());
  },
  number: function (t) {
    if (isNaN(t)) {
      return false;
    } else {
      return typeof t == "number";
    }
  },
  object: function (t) {
    return typeof t == "object" && !ye.array(t);
  },
  method: function (t) {
    return typeof t == "function";
  },
  email: function (t) {
    return typeof t == "string" && t.length <= 320 && !!t.match(_t.email);
  },
  url: function (t) {
    return typeof t == "string" && t.length <= 2048 && !!t.match(to());
  },
  hex: function (t) {
    return typeof t == "string" && !!t.match(_t.hex);
  }
};
function no(t, n, r, i, a) {
  if (t.required && n === undefined) {
    wn(t, n, r, i, a);
    return;
  }
  var o = ["integer", "float", "array", "regexp", "object", "method", "email", "number", "date", "url", "hex"];
  var l = t.type;
  if (o.indexOf(l) > -1) {
    if (!ye[l](n)) {
      i.push(ee(a.messages.types[l], t.fullField, t.type));
    }
  } else if (l && typeof n !== t.type) {
    i.push(ee(a.messages.types[l], t.fullField, t.type));
  }
}
function ro(t, n, r, i, a) {
  var o = typeof t.len == "number";
  var l = typeof t.min == "number";
  var f = typeof t.max == "number";
  var p = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  var d = n;
  var h = null;
  var v = typeof n == "number";
  var y = typeof n == "string";
  var $ = Array.isArray(n);
  if (v) {
    h = "number";
  } else if (y) {
    h = "string";
  } else if ($) {
    h = "array";
  }
  if (!h) {
    return false;
  }
  if ($) {
    d = n.length;
  }
  if (y) {
    d = n.replace(p, "_").length;
  }
  if (o) {
    if (d !== t.len) {
      i.push(ee(a.messages[h].len, t.fullField, t.len));
    }
  } else if (l && !f && d < t.min) {
    i.push(ee(a.messages[h].min, t.fullField, t.min));
  } else if (f && !l && d > t.max) {
    i.push(ee(a.messages[h].max, t.fullField, t.max));
  } else if (l && f && (d < t.min || d > t.max)) {
    i.push(ee(a.messages[h].range, t.fullField, t.min, t.max));
  }
}
var de = "enum";
function io(t, n, r, i, a) {
  t[de] = Array.isArray(t[de]) ? t[de] : [];
  if (t[de].indexOf(n) === -1) {
    i.push(ee(a.messages[de], t.fullField, t[de].join(", ")));
  }
}
function ao(t, n, r, i, a) {
  if (t.pattern) {
    if (t.pattern instanceof RegExp) {
      t.pattern.lastIndex = 0;
      if (!t.pattern.test(n)) {
        i.push(ee(a.messages.pattern.mismatch, t.fullField, n, t.pattern));
      }
    } else if (typeof t.pattern == "string") {
      var o = new RegExp(t.pattern);
      if (!o.test(n)) {
        i.push(ee(a.messages.pattern.mismatch, t.fullField, n, t.pattern));
      }
    }
  }
}
var M = {
  required: wn,
  whitespace: eo,
  type: no,
  range: ro,
  enum: io,
  pattern: ao
};
function oo(t, n, r, i, a) {
  var o = [];
  var l = t.required || !t.required && i.hasOwnProperty(t.field);
  if (l) {
    if (z(n, "string") && !t.required) {
      return r();
    }
    M.required(t, n, i, o, a, "string");
    if (!z(n, "string")) {
      M.type(t, n, i, o, a);
      M.range(t, n, i, o, a);
      M.pattern(t, n, i, o, a);
      if (t.whitespace === true) {
        M.whitespace(t, n, i, o, a);
      }
    }
  }
  r(o);
}
function lo(t, n, r, i, a) {
  var o = [];
  var l = t.required || !t.required && i.hasOwnProperty(t.field);
  if (l) {
    if (z(n) && !t.required) {
      return r();
    }
    M.required(t, n, i, o, a);
    if (n !== undefined) {
      M.type(t, n, i, o, a);
    }
  }
  r(o);
}
function so(t, n, r, i, a) {
  var o = [];
  var l = t.required || !t.required && i.hasOwnProperty(t.field);
  if (l) {
    if (n === "") {
      n = undefined;
    }
    if (z(n) && !t.required) {
      return r();
    }
    M.required(t, n, i, o, a);
    if (n !== undefined) {
      M.type(t, n, i, o, a);
      M.range(t, n, i, o, a);
    }
  }
  r(o);
}
function uo(t, n, r, i, a) {
  var o = [];
  var l = t.required || !t.required && i.hasOwnProperty(t.field);
  if (l) {
    if (z(n) && !t.required) {
      return r();
    }
    M.required(t, n, i, o, a);
    if (n !== undefined) {
      M.type(t, n, i, o, a);
    }
  }
  r(o);
}
function fo(t, n, r, i, a) {
  var o = [];
  var l = t.required || !t.required && i.hasOwnProperty(t.field);
  if (l) {
    if (z(n) && !t.required) {
      return r();
    }
    M.required(t, n, i, o, a);
    if (!z(n)) {
      M.type(t, n, i, o, a);
    }
  }
  r(o);
}
function co(t, n, r, i, a) {
  var o = [];
  var l = t.required || !t.required && i.hasOwnProperty(t.field);
  if (l) {
    if (z(n) && !t.required) {
      return r();
    }
    M.required(t, n, i, o, a);
    if (n !== undefined) {
      M.type(t, n, i, o, a);
      M.range(t, n, i, o, a);
    }
  }
  r(o);
}
function mo(t, n, r, i, a) {
  var o = [];
  var l = t.required || !t.required && i.hasOwnProperty(t.field);
  if (l) {
    if (z(n) && !t.required) {
      return r();
    }
    M.required(t, n, i, o, a);
    if (n !== undefined) {
      M.type(t, n, i, o, a);
      M.range(t, n, i, o, a);
    }
  }
  r(o);
}
function go(t, n, r, i, a) {
  var o = [];
  var l = t.required || !t.required && i.hasOwnProperty(t.field);
  if (l) {
    if (n == null && !t.required) {
      return r();
    }
    M.required(t, n, i, o, a, "array");
    if (n != null) {
      M.type(t, n, i, o, a);
      M.range(t, n, i, o, a);
    }
  }
  r(o);
}
function ho(t, n, r, i, a) {
  var o = [];
  var l = t.required || !t.required && i.hasOwnProperty(t.field);
  if (l) {
    if (z(n) && !t.required) {
      return r();
    }
    M.required(t, n, i, o, a);
    if (n !== undefined) {
      M.type(t, n, i, o, a);
    }
  }
  r(o);
}
var vo = "enum";
function po(t, n, r, i, a) {
  var o = [];
  var l = t.required || !t.required && i.hasOwnProperty(t.field);
  if (l) {
    if (z(n) && !t.required) {
      return r();
    }
    M.required(t, n, i, o, a);
    if (n !== undefined) {
      M[vo](t, n, i, o, a);
    }
  }
  r(o);
}
function yo(t, n, r, i, a) {
  var o = [];
  var l = t.required || !t.required && i.hasOwnProperty(t.field);
  if (l) {
    if (z(n, "string") && !t.required) {
      return r();
    }
    M.required(t, n, i, o, a);
    if (!z(n, "string")) {
      M.pattern(t, n, i, o, a);
    }
  }
  r(o);
}
function bo(t, n, r, i, a) {
  var o = [];
  var l = t.required || !t.required && i.hasOwnProperty(t.field);
  if (l) {
    if (z(n, "date") && !t.required) {
      return r();
    }
    M.required(t, n, i, o, a);
    if (!z(n, "date")) {
      var f;
      if (n instanceof Date) {
        f = n;
      } else {
        f = new Date(n);
      }
      M.type(t, f, i, o, a);
      if (f) {
        M.range(t, f.getTime(), i, o, a);
      }
    }
  }
  r(o);
}
function $o(t, n, r, i, a) {
  var o = [];
  var l = Array.isArray(n) ? "array" : typeof n;
  M.required(t, n, i, o, a, l);
  r(o);
}
function We(t, n, r, i, a) {
  var o = t.type;
  var l = [];
  var f = t.required || !t.required && i.hasOwnProperty(t.field);
  if (f) {
    if (z(n, o) && !t.required) {
      return r();
    }
    M.required(t, n, i, l, a, o);
    if (!z(n, o)) {
      M.type(t, n, i, l, a);
    }
  }
  r(l);
}
function wo(t, n, r, i, a) {
  var o = [];
  var l = t.required || !t.required && i.hasOwnProperty(t.field);
  if (l) {
    if (z(n) && !t.required) {
      return r();
    }
    M.required(t, n, i, o, a);
  }
  r(o);
}
var we = {
  string: oo,
  method: lo,
  number: so,
  boolean: uo,
  regexp: fo,
  integer: co,
  float: mo,
  array: go,
  object: ho,
  enum: po,
  pattern: yo,
  date: bo,
  url: We,
  hex: We,
  email: We,
  required: $o,
  any: wo
};
function Ze() {
  return {
    default: "Validation error on field %s",
    required: "%s is required",
    enum: "%s must be one of %s",
    whitespace: "%s cannot be empty",
    date: {
      format: "%s date %s is invalid for format %s",
      parse: "%s date could not be parsed, %s is invalid ",
      invalid: "%s date %s is invalid"
    },
    types: {
      string: "%s is not a %s",
      method: "%s is not a %s (function)",
      array: "%s is not an %s",
      object: "%s is not an %s",
      number: "%s is not a %s",
      date: "%s is not a %s",
      boolean: "%s is not a %s",
      integer: "%s is not an %s",
      float: "%s is not a %s",
      regexp: "%s is not a valid %s",
      email: "%s is not a valid %s",
      url: "%s is not a valid %s",
      hex: "%s is not a valid %s"
    },
    string: {
      len: "%s must be exactly %s characters",
      min: "%s must be at least %s characters",
      max: "%s cannot be longer than %s characters",
      range: "%s must be between %s and %s characters"
    },
    number: {
      len: "%s must equal %s",
      min: "%s cannot be less than %s",
      max: "%s cannot be greater than %s",
      range: "%s must be between %s and %s"
    },
    array: {
      len: "%s must be exactly %s in length",
      min: "%s cannot be less than %s in length",
      max: "%s cannot be greater than %s in length",
      range: "%s must be between %s and %s in length"
    },
    pattern: {
      mismatch: "%s value %s does not match pattern %s"
    },
    clone: function () {
      var t = JSON.parse(JSON.stringify(this));
      t.clone = this.clone;
      return t;
    }
  };
}
var Je = Ze();
var Oe = function () {
  function e(n) {
    this.rules = null;
    this._messages = Je;
    this.define(n);
  }
  var t = e.prototype;
  t.define = function (r) {
    var i = this;
    if (!r) {
      throw new Error("Cannot configure a schema with no rules");
    }
    if (typeof r != "object" || Array.isArray(r)) {
      throw new Error("Rules must be an object");
    }
    this.rules = {};
    Object.keys(r).forEach(function (a) {
      var o = r[a];
      i.rules[a] = Array.isArray(o) ? o : [o];
    });
  };
  t.messages = function (r) {
    if (r) {
      this._messages = Mt(Ze(), r);
    }
    return this._messages;
  };
  t.validate = function (r, i, a) {
    var o = this;
    if (i === undefined) {
      i = {};
    }
    if (a === undefined) {
      a = function () {};
    }
    var l = r;
    var f = i;
    var p = a;
    if (typeof f == "function") {
      p = f;
      f = {};
    }
    if (!this.rules || Object.keys(this.rules).length === 0) {
      if (p) {
        p(null, l);
      }
      return Promise.resolve(l);
    }
    function d(c) {
      var b = [];
      var m = {};
      function F(u) {
        if (Array.isArray(u)) {
          var g;
          b = (g = b).concat.apply(g, u);
        } else {
          b.push(u);
        }
      }
      for (var s = 0; s < c.length; s++) {
        F(c[s]);
      }
      if (b.length) {
        m = Qe(b);
        p(b, m);
      } else {
        p(null, l);
      }
    }
    if (f.messages) {
      var h = this.messages();
      if (h === Je) {
        h = Ze();
      }
      Mt(h, f.messages);
      f.messages = h;
    } else {
      f.messages = this.messages();
    }
    var v = {};
    var y = f.keys || Object.keys(this.rules);
    y.forEach(function (c) {
      var b = o.rules[c];
      var m = l[c];
      b.forEach(function (F) {
        var s = F;
        if (typeof s.transform == "function") {
          if (l === r) {
            l = se({}, l);
          }
          m = l[c] = s.transform(m);
        }
        if (typeof s == "function") {
          s = {
            validator: s
          };
        } else {
          s = se({}, s);
        }
        s.validator = o.getValidationMethod(s);
        if (s.validator) {
          s.field = c;
          s.fullField = s.fullField || c;
          s.type = o.getType(s);
          v[c] = v[c] || [];
          v[c].push({
            rule: s,
            value: m,
            source: l,
            field: c
          });
        }
      });
    });
    var $ = {};
    return Za(v, f, function (c, b) {
      var m = c.rule;
      var F = (m.type === "object" || m.type === "array") && (typeof m.fields == "object" || typeof m.defaultField == "object");
      F = F && (m.required || !m.required && c.value);
      m.field = c.field;
      function s(x, A) {
        return se({}, A, {
          fullField: m.fullField + "." + x,
          fullFields: m.fullFields ? [].concat(m.fullFields, [x]) : [x]
        });
      }
      function u(x = []) {
        var A = Array.isArray(x) ? x : [x];
        if (!f.suppressWarning && A.length) {
          e.warning("async-validator:", A);
        }
        if (A.length && m.message !== undefined) {
          A = [].concat(m.message);
        }
        var C = A.map(Tt(m, l));
        if (f.first && C.length) {
          $[m.field] = 1;
          return b(C);
        }
        if (!F) {
          b(C);
        } else {
          if (m.required && !c.value) {
            if (m.message !== undefined) {
              C = [].concat(m.message).map(Tt(m, l));
            } else if (f.error) {
              C = [f.error(m, ee(f.messages.required, m.field))];
            }
            return b(C);
          }
          var T = {};
          if (m.defaultField) {
            Object.keys(c.value).map(function (_) {
              T[_] = m.defaultField;
            });
          }
          T = se({}, T, c.rule.fields);
          var q = {};
          Object.keys(T).forEach(function (_) {
            var E = T[_];
            var H = Array.isArray(E) ? E : [E];
            q[_] = H.map(s.bind(null, _));
          });
          var R = new e(q);
          R.messages(f.messages);
          if (c.rule.options) {
            c.rule.options.messages = f.messages;
            c.rule.options.error = f.error;
          }
          R.validate(c.value, c.rule.options || f, function (_) {
            var E = [];
            if (C && C.length) {
              E.push.apply(E, C);
            }
            if (_ && _.length) {
              E.push.apply(E, _);
            }
            b(E.length ? E : null);
          });
        }
      }
      var g;
      if (m.asyncValidator) {
        g = m.asyncValidator(m, c.value, u, c.source, f);
      } else if (m.validator) {
        try {
          g = m.validator(m, c.value, u, c.source, f);
        } catch (x) {
          if (console.error != null) {
            console.error(x);
          }
          if (!f.suppressValidatorError) {
            setTimeout(function () {
              throw x;
            }, 0);
          }
          u(x.message);
        }
        if (g === true) {
          u();
        } else if (g === false) {
          u(typeof m.message == "function" ? m.message(m.fullField || m.field) : m.message || (m.fullField || m.field) + " fails");
        } else if (g instanceof Array) {
          u(g);
        } else if (g instanceof Error) {
          u(g.message);
        }
      }
      if (g && g.then) {
        g.then(function () {
          return u();
        }, function (x) {
          return u(x);
        });
      }
    }, function (c) {
      d(c);
    }, l);
  };
  t.getType = function (r) {
    if (r.type === undefined && r.pattern instanceof RegExp) {
      r.type = "pattern";
    }
    if (typeof r.validator != "function" && r.type && !we.hasOwnProperty(r.type)) {
      throw new Error(ee("Unknown rule type %s", r.type));
    }
    return r.type || "string";
  };
  t.getValidationMethod = function (r) {
    if (typeof r.validator == "function") {
      return r.validator;
    }
    var i = Object.keys(r);
    var a = i.indexOf("message");
    if (a !== -1) {
      i.splice(a, 1);
    }
    if (i.length === 1 && i[0] === "required") {
      return we.required;
    } else {
      return we[this.getType(r)] || undefined;
    }
  };
  return e;
}();
Oe.register = function (t, n) {
  if (typeof n != "function") {
    throw new Error("Cannot register a validator by type, validator is not a function");
  }
  we[t] = n;
};
Oe.warning = Xa;
Oe.messages = Je;
Oe.validators = we;
function ae(e) {
  if (e == null) {
    return [];
  } else if (Array.isArray(e)) {
    return e;
  } else {
    return [e];
  }
}
function xn(e, t) {
  let n = e;
  for (let r = 0; r < t.length; r += 1) {
    if (n == null) {
      return;
    }
    n = n[t[r]];
  }
  return n;
}
function Fn(e, t, n, r) {
  if (!t.length) {
    return n;
  }
  const [i, ...a] = t;
  let o;
  if (!e && typeof i == "number") {
    o = [];
  } else if (Array.isArray(e)) {
    o = [...e];
  } else {
    o = P({}, e);
  }
  if (r && n === undefined && a.length === 1) {
    delete o[i][a[0]];
  } else {
    o[i] = Fn(o[i], a, n, r);
  }
  return o;
}
function xo(e, t, n, r = false) {
  if (t.length && r && n === undefined && !xn(e, t.slice(0, -1))) {
    return e;
  } else {
    return Fn(e, t, n, r);
  }
}
function ke(e) {
  return ae(e);
}
function Fo(e, t) {
  return xn(e, t);
}
function So(e, t, n, r = false) {
  return xo(e, t, n, r);
}
function Oo(e, t) {
  return e && e.some(n => Co(n, t));
}
function Lt(e) {
  return typeof e == "object" && e !== null && Object.getPrototypeOf(e) === Object.prototype;
}
function Sn(e, t) {
  const n = Array.isArray(e) ? [...e] : P({}, e);
  if (t) {
    Object.keys(t).forEach(r => {
      const i = n[r];
      const a = t[r];
      const o = Lt(i) && Lt(a);
      n[r] = o ? Sn(i, a || {}) : a;
    });
  }
  return n;
}
function Ao(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++) {
    n[r - 1] = arguments[r];
  }
  return n.reduce((i, a) => Sn(i, a), e);
}
function Rt(e, t) {
  let n = {};
  t.forEach(r => {
    const i = Fo(e, r);
    n = So(n, r, i);
  });
  return n;
}
function Co(e, t) {
  if (!e || !t || e.length !== t.length) {
    return false;
  } else {
    return e.every((n, r) => t[r] === n);
  }
}
const k = "'${name}' is not a valid ${type}";
const Ne = {
  default: "Validation error on field '${name}'",
  required: "'${name}' is required",
  enum: "'${name}' must be one of [${enum}]",
  whitespace: "'${name}' cannot be empty",
  date: {
    format: "'${name}' is invalid for format date",
    parse: "'${name}' could not be parsed as date",
    invalid: "'${name}' is invalid date"
  },
  types: {
    string: k,
    method: k,
    array: k,
    object: k,
    number: k,
    date: k,
    boolean: k,
    integer: k,
    float: k,
    regexp: k,
    email: k,
    url: k,
    hex: k
  },
  string: {
    len: "'${name}' must be exactly ${len} characters",
    min: "'${name}' must be at least ${min} characters",
    max: "'${name}' cannot be longer than ${max} characters",
    range: "'${name}' must be between ${min} and ${max} characters"
  },
  number: {
    len: "'${name}' must equal ${len}",
    min: "'${name}' cannot be less than ${min}",
    max: "'${name}' cannot be greater than ${max}",
    range: "'${name}' must be between ${min} and ${max}"
  },
  array: {
    len: "'${name}' must be exactly ${len} in length",
    min: "'${name}' cannot be less than ${min} in length",
    max: "'${name}' cannot be greater than ${max} in length",
    range: "'${name}' must be between ${min} and ${max} in length"
  },
  pattern: {
    mismatch: "'${name}' does not match pattern ${pattern}"
  }
};
function Ve(e, t, n, r) {
  function i(a) {
    if (a instanceof n) {
      return a;
    } else {
      return new n(function (o) {
        o(a);
      });
    }
  }
  return new (n ||= Promise)(function (a, o) {
    function l(d) {
      try {
        p(r.next(d));
      } catch (h) {
        o(h);
      }
    }
    function f(d) {
      try {
        p(r.throw(d));
      } catch (h) {
        o(h);
      }
    }
    function p(d) {
      if (d.done) {
        a(d.value);
      } else {
        i(d.value).then(l, f);
      }
    }
    p((r = r.apply(e, t || [])).next());
  });
}
const Eo = Oe;
function jo(e, t) {
  return e.replace(/\$\{\w+\}/g, n => {
    const r = n.slice(2, -1);
    return t[r];
  });
}
function et(e, t, n, r, i) {
  return Ve(this, undefined, undefined, function* () {
    const a = P({}, n);
    delete a.ruleIndex;
    delete a.trigger;
    let o = null;
    if (a && a.type === "array" && a.defaultField) {
      o = a.defaultField;
      delete a.defaultField;
    }
    const l = new Eo({
      [e]: [a]
    });
    const f = Ao({}, Ne, r.validateMessages);
    l.messages(f);
    let p = [];
    try {
      yield Promise.resolve(l.validate({
        [e]: t
      }, P({}, r)));
    } catch (v) {
      if (v.errors) {
        p = v.errors.map((y, $) => {
          let {
            message: c
          } = y;
          if (Gn(c)) {
            return Bn(c, {
              key: `error_${$}`
            });
          } else {
            return c;
          }
        });
      } else {
        console.error(v);
        p = [f.default()];
      }
    }
    if (!p.length && o) {
      return (yield Promise.all(t.map((y, $) => et(`${e}.${$}`, y, o, r, i)))).reduce((y, $) => [...y, ...$], []);
    }
    const d = P(P(P({}, n), {
      name: e,
      enum: (n.enum || []).join(", ")
    }), i);
    return p.map(v => typeof v == "string" ? jo(v, d) : v);
  });
}
function On(e, t, n, r, i, a) {
  const o = e.join(".");
  const l = n.map((p, d) => {
    const h = p.validator;
    const v = P(P({}, p), {
      ruleIndex: d
    });
    if (h) {
      v.validator = (y, $, c) => {
        let b = false;
        const F = h(y, $, function () {
          for (var s = arguments.length, u = new Array(s), g = 0; g < s; g++) {
            u[g] = arguments[g];
          }
          Promise.resolve().then(() => {
            if (!b) {
              c(...u);
            }
          });
        });
        b = F && typeof F.then == "function" && typeof F.catch == "function";
        if (b) {
          F.then(() => {
            c();
          }).catch(s => {
            c(s || " ");
          });
        }
      };
    }
    return v;
  }).sort((p, d) => {
    let {
      warningOnly: h,
      ruleIndex: v
    } = p;
    let {
      warningOnly: y,
      ruleIndex: $
    } = d;
    if (!!h == !!y) {
      return v - $;
    } else if (h) {
      return 1;
    } else {
      return -1;
    }
  });
  let f;
  if (i === true) {
    f = new Promise((p, d) => Ve(this, undefined, undefined, function* () {
      for (let h = 0; h < l.length; h += 1) {
        const v = l[h];
        const y = yield et(o, t, v, r, a);
        if (y.length) {
          d([{
            errors: y,
            rule: v
          }]);
          return;
        }
      }
      p([]);
    }));
  } else {
    const p = l.map(d => et(o, t, d, r, a).then(h => ({
      errors: h,
      rule: d
    })));
    f = (i ? Io(p) : Po(p)).then(d => Promise.reject(d));
  }
  f.catch(p => p);
  return f;
}
function Po(e) {
  return Ve(this, undefined, undefined, function* () {
    return Promise.all(e).then(t => [].concat(...t));
  });
}
function Io(e) {
  return Ve(this, undefined, undefined, function* () {
    let t = 0;
    return new Promise(n => {
      e.forEach(r => {
        r.then(i => {
          if (i.errors.length) {
            n([i]);
          }
          t += 1;
          if (t === e.length) {
            n([]);
          }
        });
      });
    });
  });
}
const An = Symbol("formContextKey");
const Cn = e => {
  at(An, e);
};
const ct = () => it(An, {
  name: O(() => {}),
  labelAlign: O(() => "right"),
  vertical: O(() => false),
  addField: (e, t) => {},
  removeField: e => {},
  model: O(() => {}),
  rules: O(() => {}),
  colon: O(() => {}),
  labelWrap: O(() => {}),
  labelCol: O(() => {}),
  requiredMark: O(() => false),
  validateTrigger: O(() => {}),
  onValidate: () => {},
  validateMessages: O(() => Ne)
});
const En = Symbol("formItemPrefixContextKey");
const qo = e => {
  at(En, e);
};
const To = () => it(En, {
  prefixCls: O(() => "")
});
function Mo(e) {
  if (typeof e == "number") {
    return `${e} ${e} auto`;
  } else if (/^\d+(\.\d+)?(px|em|rem|%)$/.test(e)) {
    return `0 0 ${e}`;
  } else {
    return e;
  }
}
const _o = () => ({
  span: [String, Number],
  order: [String, Number],
  offset: [String, Number],
  push: [String, Number],
  pull: [String, Number],
  xs: {
    type: [String, Number, Object],
    default: undefined
  },
  sm: {
    type: [String, Number, Object],
    default: undefined
  },
  md: {
    type: [String, Number, Object],
    default: undefined
  },
  lg: {
    type: [String, Number, Object],
    default: undefined
  },
  xl: {
    type: [String, Number, Object],
    default: undefined
  },
  xxl: {
    type: [String, Number, Object],
    default: undefined
  },
  prefixCls: String,
  flex: [String, Number]
});
const Lo = ["xs", "sm", "md", "lg", "xl", "xxl"];
const jn = he({
  compatConfig: {
    MODE: 3
  },
  name: "ACol",
  inheritAttrs: false,
  props: _o(),
  setup(e, t) {
    let {
      slots: n,
      attrs: r
    } = t;
    const {
      gutter: i,
      supportFlexGap: a,
      wrap: o
    } = Ma();
    const {
      prefixCls: l,
      direction: f
    } = Re("col", e);
    const [p, d] = Da(l);
    const h = O(() => {
      const {
        span: y,
        order: $,
        offset: c,
        push: b,
        pull: m
      } = e;
      const F = l.value;
      let s = {};
      Lo.forEach(u => {
        let g = {};
        const x = e[u];
        if (typeof x == "number") {
          g.span = x;
        } else if (typeof x == "object") {
          g = x || {};
        }
        s = P(P({}, s), {
          [`${F}-${u}-${g.span}`]: g.span !== undefined,
          [`${F}-${u}-order-${g.order}`]: g.order || g.order === 0,
          [`${F}-${u}-offset-${g.offset}`]: g.offset || g.offset === 0,
          [`${F}-${u}-push-${g.push}`]: g.push || g.push === 0,
          [`${F}-${u}-pull-${g.pull}`]: g.pull || g.pull === 0,
          [`${F}-rtl`]: f.value === "rtl"
        });
      });
      return fe(F, {
        [`${F}-${y}`]: y !== undefined,
        [`${F}-order-${$}`]: $,
        [`${F}-offset-${c}`]: c,
        [`${F}-push-${b}`]: b,
        [`${F}-pull-${m}`]: m
      }, s, r.class, d.value);
    });
    const v = O(() => {
      const {
        flex: y
      } = e;
      const $ = i.value;
      const c = {};
      if ($ && $[0] > 0) {
        const b = `${$[0] / 2}px`;
        c.paddingLeft = b;
        c.paddingRight = b;
      }
      if ($ && $[1] > 0 && !a.value) {
        const b = `${$[1] / 2}px`;
        c.paddingTop = b;
        c.paddingBottom = b;
      }
      if (y) {
        c.flex = Mo(y);
        if (o.value === false && !c.minWidth) {
          c.minWidth = 0;
        }
      }
      return c;
    });
    return () => {
      var y;
      return p(L("div", B(B({}, r), {}, {
        class: h.value,
        style: [v.value, r.style]
      }), [(y = n.default) === null || y === undefined ? undefined : y.call(n)]));
    };
  }
});
var Ro = {
  icon: {
    tag: "svg",
    attrs: {
      viewBox: "64 64 896 896",
      focusable: "false"
    },
    children: [{
      tag: "path",
      attrs: {
        d: "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
      }
    }, {
      tag: "path",
      attrs: {
        d: "M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0130.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1080 0 40 40 0 10-80 0z"
      }
    }]
  },
  name: "question-circle",
  theme: "outlined"
};
function Nt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? Object(arguments[t]) : {};
    var r = Object.keys(n);
    if (typeof Object.getOwnPropertySymbols == "function") {
      r = r.concat(Object.getOwnPropertySymbols(n).filter(function (i) {
        return Object.getOwnPropertyDescriptor(n, i).enumerable;
      }));
    }
    r.forEach(function (i) {
      No(e, i, n[i]);
    });
  }
  return e;
}
function No(e, t, n) {
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
function dt(t, n) {
  var r = Nt({}, t, n.attrs);
  return L(Hn, Nt({}, r, {
    icon: Ro
  }), null);
}
dt.displayName = "QuestionCircleOutlined";
dt.inheritAttrs = false;
const mt = (e, t) => {
  let {
    slots: n,
    emit: r,
    attrs: i
  } = t;
  var o;
  var l;
  const {
    prefixCls: d,
    htmlFor: h,
    labelCol: v,
    labelAlign: y,
    colon: $,
    required: c,
    requiredMark: b
  } = P(P({}, e), i);
  const [m] = Xn("Form");
  const F = e.label ?? ((o = n.label) === null || o === undefined ? undefined : o.call(n));
  if (!F) {
    return null;
  }
  const {
    vertical: s,
    labelAlign: u,
    labelCol: g,
    labelWrap: x,
    colon: A
  } = ct();
  const C = v || (g == null ? undefined : g.value) || {};
  const T = y || (u == null ? undefined : u.value);
  const q = `${d}-item-label`;
  const R = fe(q, T === "left" && `${q}-left`, C.class, {
    [`${q}-wrap`]: !!x.value
  });
  let _ = F;
  const E = $ === true || (A == null ? undefined : A.value) !== false && $ !== false;
  if (E && !s.value && typeof F == "string" && F.trim() !== "") {
    _ = F.replace(/[:|：]\s*$/, "");
  }
  if (e.tooltip || n.tooltip) {
    const X = L("span", {
      class: `${d}-item-tooltip`
    }, [L(Un, {
      title: e.tooltip
    }, {
      default: () => [L(dt, null, null)]
    })]);
    _ = L(Te, null, [_, n.tooltip ? (l = n.tooltip) === null || l === undefined ? undefined : l.call(n, {
      class: `${d}-item-tooltip`
    }) : X]);
  }
  if (b === "optional" && !c) {
    _ = L(Te, null, [_, L("span", {
      class: `${d}-item-optional`
    }, [m.value?.optional || zn.Form?.optional])]);
  }
  const Q = fe({
    [`${d}-item-required`]: c,
    [`${d}-item-required-mark-optional`]: b === "optional",
    [`${d}-item-no-colon`]: !E
  });
  return L(jn, B(B({}, C), {}, {
    class: R
  }), {
    default: () => [L("label", {
      for: h,
      class: Q,
      title: typeof F == "string" ? F : "",
      onClick: X => r("click", X)
    }, [_])]
  });
};
mt.displayName = "FormItemLabel";
mt.inheritAttrs = false;
const Vo = e => {
  const {
    componentCls: t
  } = e;
  const n = `${t}-show-help`;
  const r = `${t}-show-help-item`;
  return {
    [n]: {
      transition: `opacity ${e.motionDurationSlow} ${e.motionEaseInOut}`,
      "&-appear, &-enter": {
        opacity: 0,
        "&-active": {
          opacity: 1
        }
      },
      "&-leave": {
        opacity: 1,
        "&-active": {
          opacity: 0
        }
      },
      [r]: {
        overflow: "hidden",
        transition: `height ${e.motionDurationSlow} ${e.motionEaseInOut},
                     opacity ${e.motionDurationSlow} ${e.motionEaseInOut},
                     transform ${e.motionDurationSlow} ${e.motionEaseInOut} !important`,
        [`&${r}-appear, &${r}-enter`]: {
          transform: "translateY(-5px)",
          opacity: 0,
          "&-active": {
            transform: "translateY(0)",
            opacity: 1
          }
        },
        [`&${r}-leave-active`]: {
          transform: "translateY(-5px)"
        }
      }
    }
  };
};
const Do = e => ({
  legend: {
    display: "block",
    width: "100%",
    marginBottom: e.marginLG,
    padding: 0,
    color: e.colorTextDescription,
    fontSize: e.fontSizeLG,
    lineHeight: "inherit",
    border: 0,
    borderBottom: `${e.lineWidth}px ${e.lineType} ${e.colorBorder}`
  },
  label: {
    fontSize: e.fontSize
  },
  "input[type=\"search\"]": {
    boxSizing: "border-box"
  },
  "input[type=\"radio\"], input[type=\"checkbox\"]": {
    lineHeight: "normal"
  },
  "input[type=\"file\"]": {
    display: "block"
  },
  "input[type=\"range\"]": {
    display: "block",
    width: "100%"
  },
  "select[multiple], select[size]": {
    height: "auto"
  },
  "input[type='file']:focus,\n  input[type='radio']:focus,\n  input[type='checkbox']:focus": {
    outline: 0,
    boxShadow: `0 0 0 ${e.controlOutlineWidth}px ${e.controlOutline}`
  },
  output: {
    display: "block",
    paddingTop: 15,
    color: e.colorText,
    fontSize: e.fontSize,
    lineHeight: e.lineHeight
  }
});
const Vt = (e, t) => {
  const {
    formItemCls: n
  } = e;
  return {
    [n]: {
      [`${n}-label > label`]: {
        height: t
      },
      [`${n}-control-input`]: {
        minHeight: t
      }
    }
  };
};
const Wo = e => {
  const {
    componentCls: t
  } = e;
  return {
    [e.componentCls]: P(P(P({}, kt(e)), Do(e)), {
      [`${t}-text`]: {
        display: "inline-block",
        paddingInlineEnd: e.paddingSM
      },
      "&-small": P({}, Vt(e, e.controlHeightSM)),
      "&-large": P({}, Vt(e, e.controlHeightLG))
    })
  };
};
const Go = e => {
  const {
    formItemCls: t,
    iconCls: n,
    componentCls: r,
    rootPrefixCls: i
  } = e;
  return {
    [t]: P(P({}, kt(e)), {
      marginBottom: e.marginLG,
      verticalAlign: "top",
      "&-with-help": {
        transition: "none"
      },
      [`&-hidden,
        &-hidden.${i}-row`]: {
        display: "none"
      },
      "&-has-warning": {
        [`${t}-split`]: {
          color: e.colorError
        }
      },
      "&-has-error": {
        [`${t}-split`]: {
          color: e.colorWarning
        }
      },
      [`${t}-label`]: {
        display: "inline-block",
        flexGrow: 0,
        overflow: "hidden",
        whiteSpace: "nowrap",
        textAlign: "end",
        verticalAlign: "middle",
        "&-left": {
          textAlign: "start"
        },
        "&-wrap": {
          overflow: "unset",
          lineHeight: `${e.lineHeight} - 0.25em`,
          whiteSpace: "unset"
        },
        "> label": {
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          maxWidth: "100%",
          height: e.controlHeight,
          color: e.colorTextHeading,
          fontSize: e.fontSize,
          [`> ${n}`]: {
            fontSize: e.fontSize,
            verticalAlign: "top"
          },
          [`&${t}-required:not(${t}-required-mark-optional)::before`]: {
            display: "inline-block",
            marginInlineEnd: e.marginXXS,
            color: e.colorError,
            fontSize: e.fontSize,
            fontFamily: "SimSun, sans-serif",
            lineHeight: 1,
            content: "\"*\"",
            [`${r}-hide-required-mark &`]: {
              display: "none"
            }
          },
          [`${t}-optional`]: {
            display: "inline-block",
            marginInlineStart: e.marginXXS,
            color: e.colorTextDescription,
            [`${r}-hide-required-mark &`]: {
              display: "none"
            }
          },
          [`${t}-tooltip`]: {
            color: e.colorTextDescription,
            cursor: "help",
            writingMode: "horizontal-tb",
            marginInlineStart: e.marginXXS
          },
          "&::after": {
            content: "\":\"",
            position: "relative",
            marginBlock: 0,
            marginInlineStart: e.marginXXS / 2,
            marginInlineEnd: e.marginXS
          },
          [`&${t}-no-colon::after`]: {
            content: "\" \""
          }
        }
      },
      [`${t}-control`]: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        [`&:first-child:not([class^="'${i}-col-'"]):not([class*="' ${i}-col-'"])`]: {
          width: "100%"
        },
        "&-input": {
          position: "relative",
          display: "flex",
          alignItems: "center",
          minHeight: e.controlHeight,
          "&-content": {
            flex: "auto",
            maxWidth: "100%"
          }
        }
      },
      [t]: {
        "&-explain, &-extra": {
          clear: "both",
          color: e.colorTextDescription,
          fontSize: e.fontSize,
          lineHeight: e.lineHeight
        },
        "&-explain-connected": {
          width: "100%"
        },
        "&-extra": {
          minHeight: e.controlHeightSM,
          transition: `color ${e.motionDurationMid} ${e.motionEaseOut}`
        },
        "&-explain": {
          "&-error": {
            color: e.colorError
          },
          "&-warning": {
            color: e.colorWarning
          }
        }
      },
      [`&-with-help ${t}-explain`]: {
        height: "auto",
        opacity: 1
      },
      [`${t}-feedback-icon`]: {
        fontSize: e.fontSize,
        textAlign: "center",
        visibility: "visible",
        animationName: Jt,
        animationDuration: e.motionDurationMid,
        animationTimingFunction: e.motionEaseOutBack,
        pointerEvents: "none",
        "&-success": {
          color: e.colorSuccess
        },
        "&-error": {
          color: e.colorError
        },
        "&-warning": {
          color: e.colorWarning
        },
        "&-validating": {
          color: e.colorPrimary
        }
      }
    })
  };
};
const Bo = e => {
  const {
    componentCls: t,
    formItemCls: n,
    rootPrefixCls: r
  } = e;
  return {
    [`${t}-horizontal`]: {
      [`${n}-label`]: {
        flexGrow: 0
      },
      [`${n}-control`]: {
        flex: "1 1 0",
        minWidth: 0
      },
      [`${n}-label.${r}-col-24 + ${n}-control`]: {
        minWidth: "unset"
      }
    }
  };
};
const Ho = e => {
  const {
    componentCls: t,
    formItemCls: n
  } = e;
  return {
    [`${t}-inline`]: {
      display: "flex",
      flexWrap: "wrap",
      [n]: {
        flex: "none",
        flexWrap: "nowrap",
        marginInlineEnd: e.margin,
        marginBottom: 0,
        "&-with-help": {
          marginBottom: e.marginLG
        },
        [`> ${n}-label,
        > ${n}-control`]: {
          display: "inline-block",
          verticalAlign: "top"
        },
        [`> ${n}-label`]: {
          flex: "none"
        },
        [`${t}-text`]: {
          display: "inline-block"
        },
        [`${n}-has-feedback`]: {
          display: "inline-block"
        }
      }
    }
  };
};
const me = e => ({
  margin: 0,
  padding: `0 0 ${e.paddingXS}px`,
  whiteSpace: "initial",
  textAlign: "start",
  "> label": {
    margin: 0,
    "&::after": {
      display: "none"
    }
  }
});
const Uo = e => {
  const {
    componentCls: t,
    formItemCls: n
  } = e;
  return {
    [`${n} ${n}-label`]: me(e),
    [t]: {
      [n]: {
        flexWrap: "wrap",
        [`${n}-label,
          ${n}-control`]: {
          flex: "0 0 100%",
          maxWidth: "100%"
        }
      }
    }
  };
};
const zo = e => {
  const {
    componentCls: t,
    formItemCls: n,
    rootPrefixCls: r
  } = e;
  return {
    [`${t}-vertical`]: {
      [n]: {
        "&-row": {
          flexDirection: "column"
        },
        "&-label > label": {
          height: "auto"
        },
        [`${t}-item-control`]: {
          width: "100%"
        }
      }
    },
    [`${t}-vertical ${n}-label,
      .${r}-col-24${n}-label,
      .${r}-col-xl-24${n}-label`]: me(e),
    [`@media (max-width: ${e.screenXSMax}px)`]: [Uo(e), {
      [t]: {
        [`.${r}-col-xs-24${n}-label`]: me(e)
      }
    }],
    [`@media (max-width: ${e.screenSMMax}px)`]: {
      [t]: {
        [`.${r}-col-sm-24${n}-label`]: me(e)
      }
    },
    [`@media (max-width: ${e.screenMDMax}px)`]: {
      [t]: {
        [`.${r}-col-md-24${n}-label`]: me(e)
      }
    },
    [`@media (max-width: ${e.screenLGMax}px)`]: {
      [t]: {
        [`.${r}-col-lg-24${n}-label`]: me(e)
      }
    }
  };
};
const gt = ot("Form", (e, t) => {
  let {
    rootPrefixCls: n
  } = t;
  const r = Yt(e, {
    formItemCls: `${e.componentCls}-item`,
    rootPrefixCls: n
  });
  return [Wo(r), Go(r), Vo(r), Bo(r), Ho(r), zo(r), wr(r), Jt];
});
const Xo = he({
  compatConfig: {
    MODE: 3
  },
  name: "ErrorList",
  inheritAttrs: false,
  props: ["errors", "help", "onErrorVisibleChanged", "helpStatus", "warnings"],
  setup(e, t) {
    let {
      attrs: n
    } = t;
    const {
      prefixCls: r,
      status: i
    } = To();
    const a = O(() => `${r.value}-item-explain`);
    const o = O(() => !!e.errors && !!e.errors.length);
    const l = xe(i.value);
    const [, f] = gt(r);
    ue([o, i], () => {
      if (o.value) {
        l.value = i.value;
      }
    });
    return () => {
      var p;
      var d;
      const h = xr(`${r.value}-show-help-item`);
      const v = Kn(`${r.value}-show-help-item`, h);
      v.role = "alert";
      v.class = [f.value, a.value, n.class, `${r.value}-show-help`];
      return L(Yn, B(B({}, Qn(`${r.value}-show-help`)), {}, {
        onAfterEnter: () => e.onErrorVisibleChanged(true),
        onAfterLeave: () => e.onErrorVisibleChanged(false)
      }), {
        default: () => [Zn(L(kn, B(B({}, v), {}, {
          tag: "div"
        }), {
          default: () => [(d = e.errors) === null || d === undefined ? undefined : d.map((y, $) => L("div", {
            key: $,
            class: l.value ? `${a.value}-${l.value}` : ""
          }, [y]))]
        }), [[Jn, (p = e.errors) !== null && p !== undefined && !!p.length]])]
      });
    };
  }
});
const Ko = he({
  compatConfig: {
    MODE: 3
  },
  slots: Object,
  inheritAttrs: false,
  props: ["prefixCls", "errors", "hasFeedback", "onDomErrorVisibleChange", "wrapperCol", "help", "extra", "status", "marginBottom", "onErrorVisibleChanged"],
  setup(e, t) {
    let {
      slots: n
    } = t;
    const r = ct();
    const {
      wrapperCol: i
    } = r;
    const a = P({}, r);
    delete a.labelCol;
    delete a.wrapperCol;
    Cn(a);
    qo({
      prefixCls: O(() => e.prefixCls),
      status: O(() => e.status)
    });
    return () => {
      var o;
      var l;
      var f;
      const {
        prefixCls: p,
        wrapperCol: d,
        marginBottom: h,
        onErrorVisibleChanged: v,
        help: y = (o = n.help) === null || o === undefined ? undefined : o.call(n),
        errors: $ = en((l = n.errors) === null || l === undefined ? undefined : l.call(n)),
        extra: c = (f = n.extra) === null || f === undefined ? undefined : f.call(n)
      } = e;
      const b = `${p}-item`;
      const m = d || (i == null ? undefined : i.value) || {};
      const F = fe(`${b}-control`, m.class);
      return L(jn, B(B({}, m), {}, {
        class: F
      }), {
        default: () => {
          var s;
          return L(Te, null, [L("div", {
            class: `${b}-control-input`
          }, [L("div", {
            class: `${b}-control-input-content`
          }, [(s = n.default) === null || s === undefined ? undefined : s.call(n)])]), h !== null || $.length ? L("div", {
            style: {
              display: "flex",
              flexWrap: "nowrap"
            }
          }, [L(Xo, {
            errors: $,
            help: y,
            class: `${b}-explain-connected`,
            onErrorVisibleChanged: v
          }, null), !!h && L("div", {
            style: {
              width: 0,
              height: `${h}px`
            }
          }, null)]) : null, c ? L("div", {
            class: `${b}-extra`
          }, [c]) : null]);
        }
      });
    };
  }
});
function Yo(e) {
  const t = re(e.value.slice());
  let n = null;
  He(() => {
    clearTimeout(n);
    n = setTimeout(() => {
      t.value = e.value;
    }, e.value.length ? 0 : 10);
  });
  return t;
}
lt("success", "warning", "error", "validating", "");
const Qo = {
  success: or,
  warning: ar,
  error: ir,
  validating: rr
};
function Ge(e, t, n) {
  let r = e;
  const i = t;
  let a = 0;
  try {
    for (let o = i.length; a < o - 1 && (!!r || !!n); ++a) {
      const l = i[a];
      if (l in r) {
        r = r[l];
      } else {
        if (n) {
          throw Error("please transfer a valid name path to form item!");
        }
        break;
      }
    }
    if (n && !r) {
      throw Error("please transfer a valid name path to form item!");
    }
  } catch {
    console.error("please transfer a valid name path to form item!");
  }
  return {
    o: r,
    k: i[a],
    v: r ? r[i[a]] : undefined
  };
}
const Zo = () => ({
  htmlFor: String,
  prefixCls: String,
  label: ge.any,
  help: ge.any,
  extra: ge.any,
  labelCol: {
    type: Object
  },
  wrapperCol: {
    type: Object
  },
  hasFeedback: {
    type: Boolean,
    default: false
  },
  colon: {
    type: Boolean,
    default: undefined
  },
  labelAlign: String,
  prop: {
    type: [String, Number, Array]
  },
  name: {
    type: [String, Number, Array]
  },
  rules: [Array, Object],
  autoLink: {
    type: Boolean,
    default: true
  },
  required: {
    type: Boolean,
    default: undefined
  },
  validateFirst: {
    type: Boolean,
    default: undefined
  },
  validateStatus: ge.oneOf(lt("", "success", "warning", "error", "validating")),
  validateTrigger: {
    type: [String, Array]
  },
  messageVariables: {
    type: Object
  },
  hidden: Boolean,
  noStyle: Boolean,
  tooltip: String
});
let Jo = 0;
const ko = "form_item";
const el = he({
  compatConfig: {
    MODE: 3
  },
  name: "AFormItem",
  inheritAttrs: false,
  __ANT_NEW_FORM_ITEM: true,
  props: Zo(),
  slots: Object,
  setup(e, t) {
    let {
      slots: n,
      attrs: r,
      expose: i
    } = t;
    er(e.prop === undefined);
    const a = `form-item-${++Jo}`;
    const {
      prefixCls: o
    } = Re("form", e);
    const [l, f] = gt(o);
    const p = re();
    const d = ct();
    const h = O(() => e.name || e.prop);
    const v = re([]);
    const y = re(false);
    const $ = re();
    const c = O(() => {
      const w = h.value;
      return ke(w);
    });
    const b = O(() => {
      if (c.value.length) {
        const w = d.name.value;
        const I = c.value.join("_");
        if (w) {
          return `${w}_${I}`;
        } else {
          return `${ko}_${I}`;
        }
      } else {
        return;
      }
    });
    const m = () => {
      const w = d.model.value;
      if (!!w && !!h.value) {
        return Ge(w, c.value, true).v;
      }
    };
    const F = O(() => m());
    const s = re(Pe(F.value));
    const u = O(() => {
      let w = e.validateTrigger !== undefined ? e.validateTrigger : d.validateTrigger.value;
      w = w === undefined ? "change" : w;
      return ae(w);
    });
    const g = O(() => {
      let w = d.rules.value;
      const I = e.rules;
      const V = e.required !== undefined ? {
        required: !!e.required,
        trigger: u.value
      } : [];
      const W = Ge(w, c.value);
      w = w ? W.o[W.k] || W.v : [];
      const G = [].concat(I || w || []);
      if (va(G, Y => Y.required)) {
        return G;
      } else {
        return G.concat(V);
      }
    });
    const x = O(() => {
      const w = g.value;
      let I = false;
      if (w && w.length) {
        w.every(V => V.required ? (I = true, false) : true);
      }
      return I || e.required;
    });
    const A = re();
    He(() => {
      A.value = e.validateStatus;
    });
    const C = O(() => {
      let w = {};
      if (typeof e.label == "string") {
        w.label = e.label;
      } else if (e.name) {
        w.label = String(e.name);
      }
      if (e.messageVariables) {
        w = P(P({}, w), e.messageVariables);
      }
      return w;
    });
    const T = w => {
      if (c.value.length === 0) {
        return;
      }
      const {
        validateFirst: I = false
      } = e;
      const {
        triggerName: V
      } = w || {};
      let W = g.value;
      if (V) {
        W = W.filter(Y => {
          const {
            trigger: te
          } = Y;
          if (!te && !u.value.length) {
            return true;
          } else {
            return ae(te || u.value).includes(V);
          }
        });
      }
      if (!W.length) {
        return Promise.resolve();
      }
      const G = On(c.value, F.value, W, P({
        validateMessages: d.validateMessages.value
      }, w), I, C.value);
      A.value = "validating";
      v.value = [];
      G.catch(Y => Y).then(function (Y = []) {
        if (A.value === "validating") {
          const te = Y.filter(ne => ne && ne.errors.length);
          A.value = te.length ? "error" : "success";
          v.value = te.map(ne => ne.errors);
          d.onValidate(h.value, !v.value.length, v.value.length ? Ue(v.value[0]) : null);
        }
      });
      return G;
    };
    const q = () => {
      T({
        triggerName: "blur"
      });
    };
    const R = () => {
      if (y.value) {
        y.value = false;
        return;
      }
      T({
        triggerName: "change"
      });
    };
    const _ = () => {
      A.value = e.validateStatus;
      y.value = false;
      v.value = [];
    };
    const E = () => {
      A.value = e.validateStatus;
      y.value = true;
      v.value = [];
      const I = d.model.value || {};
      const V = F.value;
      const W = Ge(I, c.value, true);
      if (Array.isArray(V)) {
        W.o[W.k] = [].concat(s.value ?? []);
      } else {
        W.o[W.k] = s.value;
      }
      tn(() => {
        y.value = false;
      });
    };
    const H = O(() => e.htmlFor === undefined ? b.value : e.htmlFor);
    const Q = () => {
      const w = H.value;
      if (!w || !$.value) {
        return;
      }
      const I = $.value.$el.querySelector(`[id="${w}"]`);
      if (I && I.focus) {
        I.focus();
      }
    };
    i({
      onFieldBlur: q,
      onFieldChange: R,
      clearValidate: _,
      resetField: E
    });
    tr({
      id: b,
      onFieldBlur: () => {
        if (e.autoLink) {
          q();
        }
      },
      onFieldChange: () => {
        if (e.autoLink) {
          R();
        }
      },
      clearValidate: _
    }, O(() => !!e.autoLink && !!d.model.value && !!h.value));
    let X = false;
    ue(h, w => {
      if (w) {
        if (!X) {
          X = true;
          d.addField(a, {
            fieldValue: F,
            fieldId: b,
            fieldName: h,
            resetField: E,
            clearValidate: _,
            namePath: c,
            validateRules: T,
            rules: g
          });
        }
      } else {
        X = false;
        d.removeField(a);
      }
    }, {
      immediate: true
    });
    Zt(() => {
      d.removeField(a);
    });
    const S = Yo(v);
    const j = O(() => e.validateStatus !== undefined ? e.validateStatus : S.value.length ? "error" : A.value);
    const N = O(() => ({
      [`${o.value}-item`]: true,
      [f.value]: true,
      [`${o.value}-item-has-feedback`]: j.value && e.hasFeedback,
      [`${o.value}-item-has-success`]: j.value === "success",
      [`${o.value}-item-has-warning`]: j.value === "warning",
      [`${o.value}-item-has-error`]: j.value === "error",
      [`${o.value}-item-is-validating`]: j.value === "validating",
      [`${o.value}-item-hidden`]: e.hidden
    }));
    const U = nn({});
    nr.useProvide(U);
    He(() => {
      let w;
      if (e.hasFeedback) {
        const I = j.value && Qo[j.value];
        w = I ? L("span", {
          class: fe(`${o.value}-item-feedback-icon`, `${o.value}-item-feedback-icon-${j.value}`)
        }, [L(I, null, null)]) : null;
      }
      P(U, {
        status: j.value,
        hasFeedback: e.hasFeedback,
        feedbackIcon: w,
        isFormItemInput: true
      });
    });
    const K = re(null);
    const J = re(false);
    const ie = () => {
      if (p.value) {
        const w = getComputedStyle(p.value);
        K.value = parseInt(w.marginBottom, 10);
      }
    };
    Qt(() => {
      ue(J, () => {
        if (J.value) {
          ie();
        }
      }, {
        flush: "post",
        immediate: true
      });
    });
    const Z = w => {
      if (!w) {
        K.value = null;
      }
    };
    return () => {
      var w;
      if (e.noStyle) {
        if ((w = n.default) === null || w === undefined) {
          return undefined;
        } else {
          return w.call(n);
        }
      }
      const V = e.help ?? (n.help ? en(n.help()) : null);
      const W = V != null && !!Array.isArray(V) && !!V.length || !!S.value.length;
      J.value = W;
      return l(L("div", {
        class: [N.value, W ? `${o.value}-item-with-help` : "", r.class],
        ref: p
      }, [L(Ga, B(B({}, r), {}, {
        class: `${o.value}-item-row`,
        key: "row"
      }), {
        default: () => {
          var Y;
          return L(Te, null, [L(mt, B(B({}, e), {}, {
            htmlFor: H.value,
            required: x.value,
            requiredMark: d.requiredMark.value,
            prefixCls: o.value,
            onClick: Q,
            label: e.label
          }), {
            label: n.label,
            tooltip: n.tooltip
          }), L(Ko, B(B({}, e), {}, {
            errors: V != null ? ae(V) : S.value,
            marginBottom: K.value,
            prefixCls: o.value,
            status: j.value,
            ref: $,
            help: V,
            extra: e.extra ?? ((Y = n.extra) === null || Y === undefined ? undefined : Y.call(n)),
            onErrorVisibleChanged: Z
          }), {
            default: n.default
          })]);
        }
      }), !!K.value && L("div", {
        class: `${o.value}-margin-offset`,
        style: {
          marginBottom: `-${K.value}px`
        }
      }, null)]));
    };
  }
});
function Pn(e) {
  let t = false;
  let n = e.length;
  const r = [];
  if (e.length) {
    return new Promise((i, a) => {
      e.forEach((o, l) => {
        o.catch(f => {
          t = true;
          return f;
        }).then(f => {
          n -= 1;
          r[l] = f;
          if (!(n > 0)) {
            if (t) {
              a(r);
            }
            i(r);
          }
        });
      });
    });
  } else {
    return Promise.resolve([]);
  }
}
function Dt(e) {
  let t = false;
  if (e && e.length) {
    e.every(n => n.required ? (t = true, false) : true);
  }
  return t;
}
function Wt(e) {
  if (e == null) {
    return [];
  } else if (Array.isArray(e)) {
    return e;
  } else {
    return [e];
  }
}
function Be(e, t, n) {
  let r = e;
  t = t.replace(/\[(\w+)\]/g, ".$1");
  t = t.replace(/^\./, "");
  const i = t.split(".");
  let a = 0;
  for (let o = i.length; a < o - 1 && (!!r || !!n); ++a) {
    const l = i[a];
    if (l in r) {
      r = r[l];
    } else {
      if (n) {
        throw new Error("please transfer a valid name path to validate!");
      }
      break;
    }
  }
  return {
    o: r,
    k: i[a],
    v: r ? r[i[a]] : null,
    isValid: r && i[a] in r
  };
}
function tl(e, t = xe({}), n) {
  const r = Pe(oe(e));
  const i = nn({});
  const a = re([]);
  const o = s => {
    P(oe(e), P(P({}, Pe(r)), s));
    tn(() => {
      Object.keys(i).forEach(u => {
        i[u] = {
          autoLink: false,
          required: Dt(oe(t)[u])
        };
      });
    });
  };
  const l = function (s = [], u) {
    if (u.length) {
      return s.filter(g => {
        const x = Wt(g.trigger || "change");
        return $a(x, u).length;
      });
    } else {
      return s;
    }
  };
  let f = null;
  const p = function (s, u = {}, g) {
    const x = [];
    const A = {};
    for (let q = 0; q < s.length; q++) {
      const R = s[q];
      const _ = Be(oe(e), R, g);
      if (!_.isValid) {
        continue;
      }
      A[R] = _.v;
      const E = l(oe(t)[R], Wt(u && u.trigger));
      if (E.length) {
        x.push(d(R, _.v, E, u || {}).then(() => ({
          name: R,
          errors: [],
          warnings: []
        })).catch(H => {
          const Q = [];
          const X = [];
          H.forEach(S => {
            let {
              rule: {
                warningOnly: j
              },
              errors: N
            } = S;
            if (j) {
              X.push(...N);
            } else {
              Q.push(...N);
            }
          });
          if (Q.length) {
            return Promise.reject({
              name: R,
              errors: Q,
              warnings: X
            });
          } else {
            return {
              name: R,
              errors: Q,
              warnings: X
            };
          }
        }));
      }
    }
    const C = Pn(x);
    f = C;
    const T = C.then(() => f === C ? Promise.resolve(A) : Promise.reject([])).catch(q => {
      const R = q.filter(_ => _ && _.errors.length);
      if (R.length) {
        return Promise.reject({
          values: A,
          errorFields: R,
          outOfDate: f !== C
        });
      } else {
        return Promise.resolve(A);
      }
    });
    T.catch(q => q);
    return T;
  };
  const d = function (s, u, g, x = {}) {
    const A = On([s], u, g, P({
      validateMessages: Ne
    }, x), !!x.validateFirst);
    if (i[s]) {
      i[s].validateStatus = "validating";
      A.catch(C => C).then(function (C = []) {
        var T;
        if (i[s].validateStatus === "validating") {
          const q = C.filter(R => R && R.errors.length);
          i[s].validateStatus = q.length ? "error" : "success";
          i[s].help = q.length ? q.map(R => R.errors) : null;
          if ((T = n == null ? undefined : n.onValidate) !== null && T !== undefined) {
            T.call(n, s, !q.length, q.length ? Ue(i[s].help[0]) : null);
          }
        }
      });
      return A;
    } else {
      return A.catch(C => C);
    }
  };
  const h = (s, u) => {
    let g = [];
    let x = true;
    if (s) {
      if (Array.isArray(s)) {
        g = s;
      } else {
        g = [s];
      }
    } else {
      x = false;
      g = a.value;
    }
    const A = p(g, u || {}, x);
    A.catch(C => C);
    return A;
  };
  const v = s => {
    let u = [];
    if (s) {
      if (Array.isArray(s)) {
        u = s;
      } else {
        u = [s];
      }
    } else {
      u = a.value;
    }
    u.forEach(g => {
      if (i[g]) {
        P(i[g], {
          validateStatus: "",
          help: null
        });
      }
    });
  };
  const y = s => {
    const u = {
      autoLink: false
    };
    const g = [];
    const x = Array.isArray(s) ? s : [s];
    for (let A = 0; A < x.length; A++) {
      const C = x[A];
      if ((C == null ? undefined : C.validateStatus) === "error") {
        u.validateStatus = "error";
        if (C.help) {
          g.push(C.help);
        }
      }
      u.required = u.required || (C == null ? undefined : C.required);
    }
    u.help = g;
    return u;
  };
  let $ = r;
  let c = true;
  const b = s => {
    const u = [];
    a.value.forEach(g => {
      const x = Be(s, g, false);
      const A = Be($, g, false);
      if (c && (n == null ? undefined : n.immediate) && x.isValid || !rn(x.v, A.v)) {
        u.push(g);
      }
    });
    h(u, {
      trigger: "change"
    });
    c = false;
    $ = Pe(Ue(s));
  };
  const m = n == null ? undefined : n.debounce;
  let F = true;
  ue(t, () => {
    a.value = t ? Object.keys(oe(t)) : [];
    if (!F && n && n.validateOnRuleChange) {
      h();
    }
    F = false;
  }, {
    deep: true,
    immediate: true
  });
  ue(a, () => {
    const s = {};
    a.value.forEach(u => {
      s[u] = P({}, i[u], {
        autoLink: false,
        required: Dt(oe(t)[u])
      });
      delete i[u];
    });
    for (const u in i) {
      if (Object.prototype.hasOwnProperty.call(i, u)) {
        delete i[u];
      }
    }
    P(i, s);
  }, {
    immediate: true
  });
  ue(e, m && m.wait ? Sr(b, m.wait, ja(m, ["wait"])) : b, {
    immediate: n && !!n.immediate,
    deep: true
  });
  return {
    modelRef: e,
    rulesRef: t,
    initialModel: r,
    validateInfos: i,
    resetFields: o,
    validate: h,
    validateField: d,
    mergeValidateInfo: y,
    clearValidate: v
  };
}
const nl = () => ({
  layout: ge.oneOf(lt("horizontal", "inline", "vertical")),
  labelCol: Ae(),
  wrapperCol: Ae(),
  colon: pe(),
  labelAlign: yt(),
  labelWrap: pe(),
  prefixCls: String,
  requiredMark: be([String, Boolean]),
  hideRequiredMark: pe(),
  model: ge.object,
  rules: Ae(),
  validateMessages: Ae(),
  validateOnRuleChange: pe(),
  scrollToFirstError: ur(),
  onSubmit: ce(),
  name: String,
  validateTrigger: be([String, Array]),
  size: yt(),
  disabled: pe(),
  onValuesChange: ce(),
  onFieldsChange: ce(),
  onFinish: ce(),
  onFinishFailed: ce(),
  onValidate: ce()
});
function rl(e, t) {
  return rn(ae(e), ae(t));
}
const le = he({
  compatConfig: {
    MODE: 3
  },
  name: "AForm",
  inheritAttrs: false,
  props: sr(nl(), {
    layout: "horizontal",
    hideRequiredMark: false,
    colon: true
  }),
  Item: el,
  useForm: tl,
  setup(e, t) {
    let {
      emit: n,
      slots: r,
      expose: i,
      attrs: a
    } = t;
    const {
      prefixCls: o,
      direction: l,
      form: f,
      size: p,
      disabled: d
    } = Re("form", e);
    const h = O(() => e.requiredMark === "" || e.requiredMark);
    const v = O(() => {
      if (h.value !== undefined) {
        return h.value;
      } else if (f && f.value?.requiredMark !== undefined) {
        return f.value.requiredMark;
      } else {
        return !e.hideRequiredMark;
      }
    });
    fr(p);
    cr(d);
    const y = O(() => {
      return e.colon ?? f.value?.colon;
    });
    const {
      validateMessages: $
    } = lr();
    const c = O(() => P(P(P({}, Ne), $.value), e.validateMessages));
    const [b, m] = gt(o);
    const F = O(() => fe(o.value, {
      [`${o.value}-${e.layout}`]: true,
      [`${o.value}-hide-required-mark`]: v.value === false,
      [`${o.value}-rtl`]: l.value === "rtl",
      [`${o.value}-${p.value}`]: p.value
    }, m.value));
    const s = xe();
    const u = {};
    const g = (S, j) => {
      u[S] = j;
    };
    const x = S => {
      delete u[S];
    };
    const A = S => {
      const j = !!S;
      const N = j ? ae(S).map(ke) : [];
      if (j) {
        return Object.values(u).filter(U => N.findIndex(K => rl(K, U.fieldName.value)) > -1);
      } else {
        return Object.values(u);
      }
    };
    const C = S => {
      if (e.model) {
        A(S).forEach(j => {
          j.resetField();
        });
      }
    };
    const T = S => {
      A(S).forEach(j => {
        j.clearValidate();
      });
    };
    const q = S => {
      const {
        scrollToFirstError: j
      } = e;
      n("finishFailed", S);
      if (j && S.errorFields.length) {
        let N = {};
        if (typeof j == "object") {
          N = j;
        }
        _(S.errorFields[0].name, N);
      }
    };
    const R = function () {
      return Q(...arguments);
    };
    const _ = function (S, j = {}) {
      const N = A(S ? [S] : undefined);
      if (N.length) {
        const U = N[0].fieldId.value;
        const K = U ? document.getElementById(U) : null;
        if (K) {
          qa(K, P({
            scrollMode: "if-needed",
            block: "nearest"
          }, j));
        }
      }
    };
    const E = function (S = true) {
      if (S === true) {
        const j = [];
        Object.values(u).forEach(N => {
          let {
            namePath: U
          } = N;
          j.push(U.value);
        });
        return Rt(e.model, j);
      } else {
        return Rt(e.model, S);
      }
    };
    const H = (S, j) => {
      if (!e.model) {
        return Promise.reject("Form `model` is required for validateFields to work.");
      }
      const N = !!S;
      const U = N ? ae(S).map(ke) : [];
      const K = [];
      Object.values(u).forEach(Z => {
        var w;
        if (!N) {
          U.push(Z.namePath.value);
        }
        if ((w = Z.rules) === null || w === undefined || !w.value.length) {
          return;
        }
        const I = Z.namePath.value;
        if (!N || Oo(U, I)) {
          const V = Z.validateRules(P({
            validateMessages: c.value
          }, j));
          K.push(V.then(() => ({
            name: I,
            errors: [],
            warnings: []
          })).catch(W => {
            const G = [];
            const Y = [];
            W.forEach(te => {
              let {
                rule: {
                  warningOnly: ne
                },
                errors: ve
              } = te;
              if (ne) {
                Y.push(...ve);
              } else {
                G.push(...ve);
              }
            });
            if (G.length) {
              return Promise.reject({
                name: I,
                errors: G,
                warnings: Y
              });
            } else {
              return {
                name: I,
                errors: G,
                warnings: Y
              };
            }
          }));
        }
      });
      const J = Pn(K);
      s.value = J;
      const ie = J.then(() => s.value === J ? Promise.resolve(E(U)) : Promise.reject([])).catch(Z => {
        const w = Z.filter(I => I && I.errors.length);
        return Promise.reject({
          values: E(U),
          errorFields: w,
          outOfDate: s.value !== J
        });
      });
      ie.catch(Z => Z);
      return ie;
    };
    const Q = function () {
      return H(...arguments);
    };
    const X = S => {
      S.preventDefault();
      S.stopPropagation();
      n("submit", S);
      if (e.model) {
        H().then(N => {
          n("finish", N);
        }).catch(N => {
          q(N);
        });
      }
    };
    i({
      resetFields: C,
      clearValidate: T,
      validateFields: H,
      getFieldsValue: E,
      validate: R,
      scrollToField: _
    });
    Cn({
      model: O(() => e.model),
      name: O(() => e.name),
      labelAlign: O(() => e.labelAlign),
      labelCol: O(() => e.labelCol),
      labelWrap: O(() => e.labelWrap),
      wrapperCol: O(() => e.wrapperCol),
      vertical: O(() => e.layout === "vertical"),
      colon: y,
      requiredMark: v,
      validateTrigger: O(() => e.validateTrigger),
      rules: O(() => e.rules),
      addField: g,
      removeField: x,
      onValidate: (S, j, N) => {
        n("validate", S, j, N);
      },
      validateMessages: c
    });
    ue(() => e.rules, () => {
      if (e.validateOnRuleChange) {
        H();
      }
    });
    return () => {
      var S;
      return b(L("form", B(B({}, a), {}, {
        onSubmit: X,
        class: [F.value, a.class]
      }), [(S = r.default) === null || S === undefined ? undefined : S.call(r)]));
    };
  }
});
le.useInjectFormItemContext = dr;
le.ItemRest = ze;
le.install = function (e) {
  e.component(le.name, le);
  e.component(le.Item.name, le.Item);
  e.component(ze.name, ze);
  return e;
};
export { el as FormItem, ze as FormItemRest, le as default, Zo as formItemProps, nl as formProps, tl as useForm, dr as useInjectFormItemContext };
import { cp as kr, cq as xr, _ as Y, V as da, W as fa, i as m, q as R, bF as va, h as ue, O as ce, N as Ke, bN as Sr, d as Qe, y as pe, M as hn, s as Ve, A as z, ak as ga, bu as Dr, Q as pa, o as F, l as Pr, a8 as He, bG as de, c5 as Mr, S as ha, cr as Or, bS as Rr, cs as Nr, ct as Tr, aZ as Ir, bz as Yr, R as Gn, aO as Yt, g as Er, m as rn, b9 as Vr, ba as Hr, bv as Et, r as Xn, b_ as Ar, bZ as _r, c0 as Br, b$ as Wr, a1 as Fr, c1 as Lr, bb as jr, bg as on, bh as zr, a0 as Zn, c2 as Jn, bT as Ur, cu as qr, $ as mn, U as ae, aa as vt, ab as ze, Y as ln, ac as ut, a9 as tt, b3 as ma, u as ba, bj as wa, bo as $a, c as Ca, aW as ya, bm as ka, aQ as xa, cv as Sa, a3 as Kr } from "./index-BegIKaMc.js";
import { s as Qr } from "./shallowequal-Clf6RTVF.js";
var at = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function rt(e) {
  if (e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default")) {
    return e.default;
  } else {
    return e;
  }
}
var Da = {
  exports: {}
};
(function (e, t) {
  (function (n, a) {
    e.exports = a();
  })(at, function () {
    var n = 1000;
    var a = 60000;
    var r = 3600000;
    var l = "millisecond";
    var o = "second";
    var i = "minute";
    var u = "hour";
    var s = "day";
    var v = "week";
    var c = "month";
    var f = "quarter";
    var h = "year";
    var y = "date";
    var C = "Invalid Date";
    var d = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/;
    var w = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g;
    var g = {
      name: "en",
      weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
      months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
      ordinal: function (I) {
        var P = ["th", "st", "nd", "rd"];
        var x = I % 100;
        return "[" + I + (P[(x - 20) % 10] || P[x] || P[0]) + "]";
      }
    };
    function k(I, P, x) {
      var b = String(I);
      if (!b || b.length >= P) {
        return I;
      } else {
        return "" + Array(P + 1 - b.length).join(x) + I;
      }
    }
    var D = {
      s: k,
      z: function (I) {
        var P = -I.utcOffset();
        var x = Math.abs(P);
        var b = Math.floor(x / 60);
        var $ = x % 60;
        return (P <= 0 ? "+" : "-") + k(b, 2, "0") + ":" + k($, 2, "0");
      },
      m: function I(P, x) {
        if (P.date() < x.date()) {
          return -I(x, P);
        }
        var b = (x.year() - P.year()) * 12 + (x.month() - P.month());
        var $ = P.clone().add(b, c);
        var N = x - $ < 0;
        var p = P.clone().add(b + (N ? -1 : 1), c);
        return +(-(b + (x - $) / (N ? $ - p : p - $)) || 0);
      },
      a: function (I) {
        if (I < 0) {
          return Math.ceil(I) || 0;
        } else {
          return Math.floor(I);
        }
      },
      p: function (I) {
        return {
          M: c,
          y: h,
          w: v,
          d: s,
          D: y,
          h: u,
          m: i,
          s: o,
          ms: l,
          Q: f
        }[I] || String(I || "").toLowerCase().replace(/s$/, "");
      },
      u: function (I) {
        return I === undefined;
      }
    };
    var O = "en";
    var E = {
      [O]: g
    };
    var q = "$isDayjsObject";
    function U(I) {
      return I instanceof B || !!I && !!I[q];
    }
    var L = function I(P, x, b) {
      var $;
      if (!P) {
        return O;
      }
      if (typeof P == "string") {
        var N = P.toLowerCase();
        if (E[N]) {
          $ = N;
        }
        if (x) {
          E[N] = x;
          $ = N;
        }
        var p = P.split("-");
        if (!$ && p.length > 1) {
          return I(p[0]);
        }
      } else {
        var S = P.name;
        E[S] = P;
        $ = S;
      }
      if (!b && $) {
        O = $;
      }
      return $ || !b && O;
    };
    function A(I, P) {
      if (U(I)) {
        return I.clone();
      }
      var x = typeof P == "object" ? P : {};
      x.date = I;
      x.args = arguments;
      return new B(x);
    }
    var T = D;
    T.l = L;
    T.i = U;
    T.w = function (I, P) {
      return A(I, {
        locale: P.$L,
        utc: P.$u,
        x: P.$x,
        $offset: P.$offset
      });
    };
    var B = function () {
      function I(x) {
        this.$L = L(x.locale, null, true);
        this.parse(x);
        this.$x = this.$x || x.x || {};
        this[q] = true;
      }
      var P = I.prototype;
      P.parse = function (x) {
        this.$d = function (b) {
          var $ = b.date;
          var N = b.utc;
          if ($ === null) {
            return new Date(NaN);
          }
          if (T.u($)) {
            return new Date();
          }
          if ($ instanceof Date) {
            return new Date($);
          }
          if (typeof $ == "string" && !/Z$/i.test($)) {
            var p = $.match(d);
            if (p) {
              var S = p[2] - 1 || 0;
              var V = (p[7] || "0").substring(0, 3);
              if (N) {
                return new Date(Date.UTC(p[1], S, p[3] || 1, p[4] || 0, p[5] || 0, p[6] || 0, V));
              } else {
                return new Date(p[1], S, p[3] || 1, p[4] || 0, p[5] || 0, p[6] || 0, V);
              }
            }
          }
          return new Date($);
        }(x);
        this.init();
      };
      P.init = function () {
        var x = this.$d;
        this.$y = x.getFullYear();
        this.$M = x.getMonth();
        this.$D = x.getDate();
        this.$W = x.getDay();
        this.$H = x.getHours();
        this.$m = x.getMinutes();
        this.$s = x.getSeconds();
        this.$ms = x.getMilliseconds();
      };
      P.$utils = function () {
        return T;
      };
      P.isValid = function () {
        return this.$d.toString() !== C;
      };
      P.isSame = function (x, b) {
        var $ = A(x);
        return this.startOf(b) <= $ && $ <= this.endOf(b);
      };
      P.isAfter = function (x, b) {
        return A(x) < this.startOf(b);
      };
      P.isBefore = function (x, b) {
        return this.endOf(b) < A(x);
      };
      P.$g = function (x, b, $) {
        if (T.u(x)) {
          return this[b];
        } else {
          return this.set($, x);
        }
      };
      P.unix = function () {
        return Math.floor(this.valueOf() / 1000);
      };
      P.valueOf = function () {
        return this.$d.getTime();
      };
      P.startOf = function (x, b) {
        var $ = this;
        var N = !!T.u(b) || b;
        var p = T.p(x);
        function S(ne, G) {
          var Z = T.w($.$u ? Date.UTC($.$y, G, ne) : new Date($.$y, G, ne), $);
          if (N) {
            return Z;
          } else {
            return Z.endOf(s);
          }
        }
        function V(ne, G) {
          return T.w($.toDate()[ne].apply($.toDate("s"), (N ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(G)), $);
        }
        var _ = this.$W;
        var Q = this.$M;
        var ee = this.$D;
        var ie = "set" + (this.$u ? "UTC" : "");
        switch (p) {
          case h:
            if (N) {
              return S(1, 0);
            } else {
              return S(31, 11);
            }
          case c:
            if (N) {
              return S(1, Q);
            } else {
              return S(0, Q + 1);
            }
          case v:
            var oe = this.$locale().weekStart || 0;
            var j = (_ < oe ? _ + 7 : _) - oe;
            return S(N ? ee - j : ee + (6 - j), Q);
          case s:
          case y:
            return V(ie + "Hours", 0);
          case u:
            return V(ie + "Minutes", 1);
          case i:
            return V(ie + "Seconds", 2);
          case o:
            return V(ie + "Milliseconds", 3);
          default:
            return this.clone();
        }
      };
      P.endOf = function (x) {
        return this.startOf(x, false);
      };
      P.$set = function (x, b) {
        var $;
        var N = T.p(x);
        var p = "set" + (this.$u ? "UTC" : "");
        var S = ($ = {}, $[s] = p + "Date", $[y] = p + "Date", $[c] = p + "Month", $[h] = p + "FullYear", $[u] = p + "Hours", $[i] = p + "Minutes", $[o] = p + "Seconds", $[l] = p + "Milliseconds", $)[N];
        var V = N === s ? this.$D + (b - this.$W) : b;
        if (N === c || N === h) {
          var _ = this.clone().set(y, 1);
          _.$d[S](V);
          _.init();
          this.$d = _.set(y, Math.min(this.$D, _.daysInMonth())).$d;
        } else if (S) {
          this.$d[S](V);
        }
        this.init();
        return this;
      };
      P.set = function (x, b) {
        return this.clone().$set(x, b);
      };
      P.get = function (x) {
        return this[T.p(x)]();
      };
      P.add = function (x, b) {
        var $;
        var N = this;
        x = Number(x);
        var p = T.p(b);
        function S(Q) {
          var ee = A(N);
          return T.w(ee.date(ee.date() + Math.round(Q * x)), N);
        }
        if (p === c) {
          return this.set(c, this.$M + x);
        }
        if (p === h) {
          return this.set(h, this.$y + x);
        }
        if (p === s) {
          return S(1);
        }
        if (p === v) {
          return S(7);
        }
        var V = ($ = {}, $[i] = a, $[u] = r, $[o] = n, $)[p] || 1;
        var _ = this.$d.getTime() + x * V;
        return T.w(_, this);
      };
      P.subtract = function (x, b) {
        return this.add(x * -1, b);
      };
      P.format = function (x) {
        var b = this;
        var $ = this.$locale();
        if (!this.isValid()) {
          return $.invalidDate || C;
        }
        var N = x || "YYYY-MM-DDTHH:mm:ssZ";
        var p = T.z(this);
        var S = this.$H;
        var V = this.$m;
        var _ = this.$M;
        var Q = $.weekdays;
        var ee = $.months;
        var ie = $.meridiem;
        function oe(G, Z, se, re) {
          return G && (G[Z] || G(b, N)) || se[Z].slice(0, re);
        }
        function j(G) {
          return T.s(S % 12 || 12, G, "0");
        }
        var ne = ie || function (G, Z, se) {
          var re = G < 12 ? "AM" : "PM";
          if (se) {
            return re.toLowerCase();
          } else {
            return re;
          }
        };
        return N.replace(w, function (G, Z) {
          return Z || function (se) {
            switch (se) {
              case "YY":
                return String(b.$y).slice(-2);
              case "YYYY":
                return T.s(b.$y, 4, "0");
              case "M":
                return _ + 1;
              case "MM":
                return T.s(_ + 1, 2, "0");
              case "MMM":
                return oe($.monthsShort, _, ee, 3);
              case "MMMM":
                return oe(ee, _);
              case "D":
                return b.$D;
              case "DD":
                return T.s(b.$D, 2, "0");
              case "d":
                return String(b.$W);
              case "dd":
                return oe($.weekdaysMin, b.$W, Q, 2);
              case "ddd":
                return oe($.weekdaysShort, b.$W, Q, 3);
              case "dddd":
                return Q[b.$W];
              case "H":
                return String(S);
              case "HH":
                return T.s(S, 2, "0");
              case "h":
                return j(1);
              case "hh":
                return j(2);
              case "a":
                return ne(S, V, true);
              case "A":
                return ne(S, V, false);
              case "m":
                return String(V);
              case "mm":
                return T.s(V, 2, "0");
              case "s":
                return String(b.$s);
              case "ss":
                return T.s(b.$s, 2, "0");
              case "SSS":
                return T.s(b.$ms, 3, "0");
              case "Z":
                return p;
            }
            return null;
          }(G) || p.replace(":", "");
        });
      };
      P.utcOffset = function () {
        return -Math.round(this.$d.getTimezoneOffset() / 15) * 15;
      };
      P.diff = function (x, b, $) {
        var N;
        var p = this;
        var S = T.p(b);
        var V = A(x);
        var _ = (V.utcOffset() - this.utcOffset()) * a;
        var Q = this - V;
        function ee() {
          return T.m(p, V);
        }
        switch (S) {
          case h:
            N = ee() / 12;
            break;
          case c:
            N = ee();
            break;
          case f:
            N = ee() / 3;
            break;
          case v:
            N = (Q - _) / 604800000;
            break;
          case s:
            N = (Q - _) / 86400000;
            break;
          case u:
            N = Q / r;
            break;
          case i:
            N = Q / a;
            break;
          case o:
            N = Q / n;
            break;
          default:
            N = Q;
        }
        if ($) {
          return N;
        } else {
          return T.a(N);
        }
      };
      P.daysInMonth = function () {
        return this.endOf(c).$D;
      };
      P.$locale = function () {
        return E[this.$L];
      };
      P.locale = function (x, b) {
        if (!x) {
          return this.$L;
        }
        var $ = this.clone();
        var N = L(x, b, true);
        if (N) {
          $.$L = N;
        }
        return $;
      };
      P.clone = function () {
        return T.w(this.$d, this);
      };
      P.toDate = function () {
        return new Date(this.valueOf());
      };
      P.toJSON = function () {
        if (this.isValid()) {
          return this.toISOString();
        } else {
          return null;
        }
      };
      P.toISOString = function () {
        return this.$d.toISOString();
      };
      P.toString = function () {
        return this.$d.toUTCString();
      };
      return I;
    }();
    var X = B.prototype;
    A.prototype = X;
    [["$ms", l], ["$s", o], ["$m", i], ["$H", u], ["$W", s], ["$M", c], ["$y", h], ["$D", y]].forEach(function (I) {
      X[I[1]] = function (P) {
        return this.$g(P, I[0], I[1]);
      };
    });
    A.extend = function (I, P) {
      if (!I.$i) {
        I(P, B, A);
        I.$i = true;
      }
      return A;
    };
    A.locale = L;
    A.isDayjs = U;
    A.unix = function (I) {
      return A(I * 1000);
    };
    A.en = E[O];
    A.Ls = E;
    A.p = {};
    return A;
  });
})(Da);
var Gr = Da.exports;
const ge = rt(Gr);
var Pa = {
  exports: {}
};
(function (e, t) {
  (function (n, a) {
    e.exports = a();
  })(at, function () {
    return function (n, a) {
      a.prototype.weekday = function (r) {
        var l = this.$locale().weekStart || 0;
        var o = this.$W;
        var i = (o < l ? o + 7 : o) - l;
        if (this.$utils().u(r)) {
          return i;
        } else {
          return this.subtract(i, "day").add(r, "day");
        }
      };
    };
  });
})(Pa);
var Xr = Pa.exports;
const Zr = rt(Xr);
var Ma = {
  exports: {}
};
(function (e, t) {
  (function (n, a) {
    e.exports = a();
  })(at, function () {
    return function (n, a, r) {
      var l = a.prototype;
      function o(c) {
        return c && (c.indexOf ? c : c.s);
      }
      function i(c, f, h, y, C) {
        var d = c.name ? c : c.$locale();
        var w = o(d[f]);
        var g = o(d[h]);
        var k = w || g.map(function (O) {
          return O.slice(0, y);
        });
        if (!C) {
          return k;
        }
        var D = d.weekStart;
        return k.map(function (O, E) {
          return k[(E + (D || 0)) % 7];
        });
      }
      function u() {
        return r.Ls[r.locale()];
      }
      function s(c, f) {
        return c.formats[f] || function (h) {
          return h.replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function (y, C, d) {
            return C || d.slice(1);
          });
        }(c.formats[f.toUpperCase()]);
      }
      function v() {
        var c = this;
        return {
          months: function (f) {
            if (f) {
              return f.format("MMMM");
            } else {
              return i(c, "months");
            }
          },
          monthsShort: function (f) {
            if (f) {
              return f.format("MMM");
            } else {
              return i(c, "monthsShort", "months", 3);
            }
          },
          firstDayOfWeek: function () {
            return c.$locale().weekStart || 0;
          },
          weekdays: function (f) {
            if (f) {
              return f.format("dddd");
            } else {
              return i(c, "weekdays");
            }
          },
          weekdaysMin: function (f) {
            if (f) {
              return f.format("dd");
            } else {
              return i(c, "weekdaysMin", "weekdays", 2);
            }
          },
          weekdaysShort: function (f) {
            if (f) {
              return f.format("ddd");
            } else {
              return i(c, "weekdaysShort", "weekdays", 3);
            }
          },
          longDateFormat: function (f) {
            return s(c.$locale(), f);
          },
          meridiem: this.$locale().meridiem,
          ordinal: this.$locale().ordinal
        };
      }
      l.localeData = function () {
        return v.bind(this)();
      };
      r.localeData = function () {
        var c = u();
        return {
          firstDayOfWeek: function () {
            return c.weekStart || 0;
          },
          weekdays: function () {
            return r.weekdays();
          },
          weekdaysShort: function () {
            return r.weekdaysShort();
          },
          weekdaysMin: function () {
            return r.weekdaysMin();
          },
          months: function () {
            return r.months();
          },
          monthsShort: function () {
            return r.monthsShort();
          },
          longDateFormat: function (f) {
            return s(c, f);
          },
          meridiem: c.meridiem,
          ordinal: c.ordinal
        };
      };
      r.months = function () {
        return i(u(), "months");
      };
      r.monthsShort = function () {
        return i(u(), "monthsShort", "months", 3);
      };
      r.weekdays = function (c) {
        return i(u(), "weekdays", null, null, c);
      };
      r.weekdaysShort = function (c) {
        return i(u(), "weekdaysShort", "weekdays", 3, c);
      };
      r.weekdaysMin = function (c) {
        return i(u(), "weekdaysMin", "weekdays", 2, c);
      };
    };
  });
})(Ma);
var Jr = Ma.exports;
const eo = rt(Jr);
var Oa = {
  exports: {}
};
(function (e, t) {
  (function (n, a) {
    e.exports = a();
  })(at, function () {
    var n = "week";
    var a = "year";
    return function (r, l, o) {
      var i = l.prototype;
      i.week = function (u = null) {
        if (u !== null) {
          return this.add((u - this.week()) * 7, "day");
        }
        var s = this.$locale().yearStart || 1;
        if (this.month() === 11 && this.date() > 25) {
          var v = o(this).startOf(a).add(1, a).date(s);
          var c = o(this).endOf(n);
          if (v.isBefore(c)) {
            return 1;
          }
        }
        var f = o(this).startOf(a).date(s).startOf(n).subtract(1, "millisecond");
        var h = this.diff(f, n, true);
        if (h < 0) {
          return o(this).startOf("week").week();
        } else {
          return Math.ceil(h);
        }
      };
      i.weeks = function (u = null) {
        return this.week(u);
      };
    };
  });
})(Oa);
var to = Oa.exports;
const no = rt(to);
var Ra = {
  exports: {}
};
(function (e, t) {
  (function (n, a) {
    e.exports = a();
  })(at, function () {
    return function (n, a) {
      a.prototype.weekYear = function () {
        var r = this.month();
        var l = this.week();
        var o = this.year();
        if (l === 1 && r === 11) {
          return o + 1;
        } else if (r === 0 && l >= 52) {
          return o - 1;
        } else {
          return o;
        }
      };
    };
  });
})(Ra);
var ao = Ra.exports;
const ro = rt(ao);
var Na = {
  exports: {}
};
(function (e, t) {
  (function (n, a) {
    e.exports = a();
  })(at, function () {
    var n = "month";
    var a = "quarter";
    return function (r, l) {
      var o = l.prototype;
      o.quarter = function (s) {
        if (this.$utils().u(s)) {
          return Math.ceil((this.month() + 1) / 3);
        } else {
          return this.month(this.month() % 3 + (s - 1) * 3);
        }
      };
      var i = o.add;
      o.add = function (s, v) {
        s = Number(s);
        if (this.$utils().p(v) === a) {
          return this.add(s * 3, n);
        } else {
          return i.bind(this)(s, v);
        }
      };
      var u = o.startOf;
      o.startOf = function (s, v) {
        var c = this.$utils();
        var f = !!c.u(v) || v;
        if (c.p(s) === a) {
          var h = this.quarter() - 1;
          if (f) {
            return this.month(h * 3).startOf(n).startOf("day");
          } else {
            return this.month(h * 3 + 2).endOf(n).endOf("day");
          }
        }
        return u.bind(this)(s, v);
      };
    };
  });
})(Na);
var oo = Na.exports;
const lo = rt(oo);
var Ta = {
  exports: {}
};
(function (e, t) {
  (function (n, a) {
    e.exports = a();
  })(at, function () {
    return function (n, a) {
      var r = a.prototype;
      var l = r.format;
      r.format = function (o) {
        var i = this;
        var u = this.$locale();
        if (!this.isValid()) {
          return l.bind(this)(o);
        }
        var s = this.$utils();
        var v = (o || "YYYY-MM-DDTHH:mm:ssZ").replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g, function (c) {
          switch (c) {
            case "Q":
              return Math.ceil((i.$M + 1) / 3);
            case "Do":
              return u.ordinal(i.$D);
            case "gggg":
              return i.weekYear();
            case "GGGG":
              return i.isoWeekYear();
            case "wo":
              return u.ordinal(i.week(), "W");
            case "w":
            case "ww":
              return s.s(i.week(), c === "w" ? 1 : 2, "0");
            case "W":
            case "WW":
              return s.s(i.isoWeek(), c === "W" ? 1 : 2, "0");
            case "k":
            case "kk":
              return s.s(String(i.$H === 0 ? 24 : i.$H), c === "k" ? 1 : 2, "0");
            case "X":
              return Math.floor(i.$d.getTime() / 1000);
            case "x":
              return i.$d.getTime();
            case "z":
              return "[" + i.offsetName() + "]";
            case "zzz":
              return "[" + i.offsetName("long") + "]";
            default:
              return c;
          }
        });
        return l.bind(this)(v);
      };
    };
  });
})(Ta);
var io = Ta.exports;
const so = rt(io);
var Ia = {
  exports: {}
};
(function (e, t) {
  (function (n, a) {
    e.exports = a();
  })(at, function () {
    var n = {
      LTS: "h:mm:ss A",
      LT: "h:mm A",
      L: "MM/DD/YYYY",
      LL: "MMMM D, YYYY",
      LLL: "MMMM D, YYYY h:mm A",
      LLLL: "dddd, MMMM D, YYYY h:mm A"
    };
    var a = /(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g;
    var r = /\d/;
    var l = /\d\d/;
    var o = /\d\d?/;
    var i = /\d*[^-_:/,()\s\d]+/;
    var u = {};
    function s(d) {
      return (d = +d) + (d > 68 ? 1900 : 2000);
    }
    function v(d) {
      return function (w) {
        this[d] = +w;
      };
    }
    var c = [/[+-]\d\d:?(\d\d)?|Z/, function (d) {
      (this.zone ||= {}).offset = function (w) {
        if (!w || w === "Z") {
          return 0;
        }
        var g = w.match(/([+-]|\d\d)/g);
        var k = g[1] * 60 + (+g[2] || 0);
        if (k === 0) {
          return 0;
        } else if (g[0] === "+") {
          return -k;
        } else {
          return k;
        }
      }(d);
    }];
    function f(d) {
      var w = u[d];
      return w && (w.indexOf ? w : w.s.concat(w.f));
    }
    function h(d, w) {
      var g;
      var k = u.meridiem;
      if (k) {
        for (var D = 1; D <= 24; D += 1) {
          if (d.indexOf(k(D, 0, w)) > -1) {
            g = D > 12;
            break;
          }
        }
      } else {
        g = d === (w ? "pm" : "PM");
      }
      return g;
    }
    var y = {
      A: [i, function (d) {
        this.afternoon = h(d, false);
      }],
      a: [i, function (d) {
        this.afternoon = h(d, true);
      }],
      Q: [r, function (d) {
        this.month = (d - 1) * 3 + 1;
      }],
      S: [r, function (d) {
        this.milliseconds = +d * 100;
      }],
      SS: [l, function (d) {
        this.milliseconds = +d * 10;
      }],
      SSS: [/\d{3}/, function (d) {
        this.milliseconds = +d;
      }],
      s: [o, v("seconds")],
      ss: [o, v("seconds")],
      m: [o, v("minutes")],
      mm: [o, v("minutes")],
      H: [o, v("hours")],
      h: [o, v("hours")],
      HH: [o, v("hours")],
      hh: [o, v("hours")],
      D: [o, v("day")],
      DD: [l, v("day")],
      Do: [i, function (d) {
        var w = u.ordinal;
        var g = d.match(/\d+/);
        this.day = g[0];
        if (w) {
          for (var k = 1; k <= 31; k += 1) {
            if (w(k).replace(/\[|\]/g, "") === d) {
              this.day = k;
            }
          }
        }
      }],
      w: [o, v("week")],
      ww: [l, v("week")],
      M: [o, v("month")],
      MM: [l, v("month")],
      MMM: [i, function (d) {
        var w = f("months");
        var g = (f("monthsShort") || w.map(function (k) {
          return k.slice(0, 3);
        })).indexOf(d) + 1;
        if (g < 1) {
          throw new Error();
        }
        this.month = g % 12 || g;
      }],
      MMMM: [i, function (d) {
        var w = f("months").indexOf(d) + 1;
        if (w < 1) {
          throw new Error();
        }
        this.month = w % 12 || w;
      }],
      Y: [/[+-]?\d+/, v("year")],
      YY: [l, function (d) {
        this.year = s(d);
      }],
      YYYY: [/\d{4}/, v("year")],
      Z: c,
      ZZ: c
    };
    function C(d) {
      var w;
      var g;
      w = d;
      g = u && u.formats;
      var k = (d = w.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, function (A, T, B) {
        var X = B && B.toUpperCase();
        return T || g[B] || n[B] || g[X].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function (I, P, x) {
          return P || x.slice(1);
        });
      })).match(a);
      for (var D = k.length, O = 0; O < D; O += 1) {
        var E = k[O];
        var q = y[E];
        var U = q && q[0];
        var L = q && q[1];
        k[O] = L ? {
          regex: U,
          parser: L
        } : E.replace(/^\[|\]$/g, "");
      }
      return function (A) {
        var T = {};
        for (var B = 0, X = 0; B < D; B += 1) {
          var I = k[B];
          if (typeof I == "string") {
            X += I.length;
          } else {
            var P = I.regex;
            var x = I.parser;
            var b = A.slice(X);
            var $ = P.exec(b)[0];
            x.call(T, $);
            A = A.replace($, "");
          }
        }
        (function (N) {
          var p = N.afternoon;
          if (p !== undefined) {
            var S = N.hours;
            if (p) {
              if (S < 12) {
                N.hours += 12;
              }
            } else if (S === 12) {
              N.hours = 0;
            }
            delete N.afternoon;
          }
        })(T);
        return T;
      };
    }
    return function (d, w, g) {
      g.p.customParseFormat = true;
      if (d && d.parseTwoDigitYear) {
        s = d.parseTwoDigitYear;
      }
      var k = w.prototype;
      var D = k.parse;
      k.parse = function (O) {
        var E = O.date;
        var q = O.utc;
        var U = O.args;
        this.$u = q;
        var L = U[1];
        if (typeof L == "string") {
          var A = U[2] === true;
          var T = U[3] === true;
          var B = A || T;
          var X = U[2];
          if (T) {
            X = U[2];
          }
          u = this.$locale();
          if (!A && X) {
            u = g.Ls[X];
          }
          this.$d = function (b, $, N, p) {
            try {
              if (["x", "X"].indexOf($) > -1) {
                return new Date(($ === "X" ? 1000 : 1) * b);
              }
              var S = C($)(b);
              var V = S.year;
              var _ = S.month;
              var Q = S.day;
              var ee = S.hours;
              var ie = S.minutes;
              var oe = S.seconds;
              var j = S.milliseconds;
              var ne = S.zone;
              var G = S.week;
              var Z = new Date();
              var se = Q || (V || _ ? 1 : Z.getDate());
              var re = V || Z.getFullYear();
              var he = 0;
              if (!V || !!_) {
                he = _ > 0 ? _ - 1 : Z.getMonth();
              }
              var K;
              var te = ee || 0;
              var $e = ie || 0;
              var ye = oe || 0;
              var Me = j || 0;
              if (ne) {
                return new Date(Date.UTC(re, he, se, te, $e, ye, Me + ne.offset * 60 * 1000));
              } else if (N) {
                return new Date(Date.UTC(re, he, se, te, $e, ye, Me));
              } else {
                K = new Date(re, he, se, te, $e, ye, Me);
                if (G) {
                  K = p(K).week(G).toDate();
                }
                return K;
              }
            } catch {
              return new Date("");
            }
          }(E, L, q, g);
          this.init();
          if (X && X !== true) {
            this.$L = this.locale(X).$L;
          }
          if (B && E != this.format(L)) {
            this.$d = new Date("");
          }
          u = {};
        } else if (L instanceof Array) {
          for (var I = L.length, P = 1; P <= I; P += 1) {
            U[1] = L[P - 1];
            var x = g.apply(this, U);
            if (x.isValid()) {
              this.$d = x.$d;
              this.$L = x.$L;
              this.init();
              break;
            }
            if (P === I) {
              this.$d = new Date("");
            }
          }
        } else {
          D.call(this, O);
        }
      };
    };
  });
})(Ia);
var uo = Ia.exports;
const co = rt(uo);
ge.extend(co);
ge.extend(so);
ge.extend(Zr);
ge.extend(eo);
ge.extend(no);
ge.extend(ro);
ge.extend(lo);
ge.extend((e, t) => {
  const n = t.prototype;
  const a = n.format;
  n.format = function (l) {
    const o = (l || "").replace("Wo", "wo");
    return a.bind(this)(o);
  };
});
const fo = {
  bn_BD: "bn-bd",
  by_BY: "be",
  en_GB: "en-gb",
  en_US: "en",
  fr_BE: "fr",
  fr_CA: "fr-ca",
  hy_AM: "hy-am",
  kmr_IQ: "ku",
  nl_BE: "nl-be",
  pt_BR: "pt-br",
  zh_CN: "zh-cn",
  zh_HK: "zh-hk",
  zh_TW: "zh-tw"
};
const st = e => fo[e] || e.split("_")[0];
const ea = () => {
  kr(false, "Not match any format. Please help to fire a issue about this.");
};
const vo = /\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|k{1,2}|S/g;
function ta(e, t, n) {
  const a = [...new Set(e.split(n))];
  let r = 0;
  for (let l = 0; l < a.length; l++) {
    const o = a[l];
    r += o.length;
    if (r > t) {
      return o;
    }
    r += n.length;
  }
}
const na = (e, t) => {
  if (!e) {
    return null;
  }
  if (ge.isDayjs(e)) {
    return e;
  }
  const n = t.matchAll(vo);
  let a = ge(e, t);
  if (n === null) {
    return a;
  }
  for (const r of n) {
    const l = r[0];
    const o = r.index;
    if (l === "Q") {
      const i = e.slice(o - 1, o);
      const u = ta(e, o, i).match(/\d+/)[0];
      a = a.quarter(parseInt(u));
    }
    if (l.toLowerCase() === "wo") {
      const i = e.slice(o - 1, o);
      const u = ta(e, o, i).match(/\d+/)[0];
      a = a.week(parseInt(u));
    }
    if (l.toLowerCase() === "ww") {
      a = a.week(parseInt(e.slice(o, o + l.length)));
    }
    if (l.toLowerCase() === "w") {
      a = a.week(parseInt(e.slice(o, o + l.length + 1)));
    }
  }
  return a;
};
const Sl = {
  getNow: () => ge(),
  getFixedDate: e => ge(e, ["YYYY-M-DD", "YYYY-MM-DD"]),
  getEndDate: e => e.endOf("month"),
  getWeekDay: e => {
    const t = e.locale("en");
    return t.weekday() + t.localeData().firstDayOfWeek();
  },
  getYear: e => e.year(),
  getMonth: e => e.month(),
  getDate: e => e.date(),
  getHour: e => e.hour(),
  getMinute: e => e.minute(),
  getSecond: e => e.second(),
  addYear: (e, t) => e.add(t, "year"),
  addMonth: (e, t) => e.add(t, "month"),
  addDate: (e, t) => e.add(t, "day"),
  setYear: (e, t) => e.year(t),
  setMonth: (e, t) => e.month(t),
  setDate: (e, t) => e.date(t),
  setHour: (e, t) => e.hour(t),
  setMinute: (e, t) => e.minute(t),
  setSecond: (e, t) => e.second(t),
  isAfter: (e, t) => e.isAfter(t),
  isValidate: e => e.isValid(),
  locale: {
    getWeekFirstDay: e => ge().locale(st(e)).localeData().firstDayOfWeek(),
    getWeekFirstDate: (e, t) => t.locale(st(e)).weekday(0),
    getWeek: (e, t) => t.locale(st(e)).week(),
    getShortWeekDays: e => ge().locale(st(e)).localeData().weekdaysMin(),
    getShortMonths: e => ge().locale(st(e)).localeData().monthsShort(),
    format: (e, t, n) => t.locale(st(e)).format(n),
    parse: (e, t, n) => {
      const a = st(e);
      for (let r = 0; r < n.length; r += 1) {
        const l = n[r];
        const o = t;
        if (l.includes("wo") || l.includes("Wo")) {
          const u = o.split("-")[0];
          const s = o.split("-")[1];
          const v = ge(u, "YYYY").startOf("year").locale(a);
          for (let c = 0; c <= 52; c += 1) {
            const f = v.add(c, "week");
            if (f.format("Wo") === s) {
              return f;
            }
          }
          ea();
          return null;
        }
        const i = ge(o, l, true).locale(a);
        if (i.isValid()) {
          return i;
        }
      }
      if (!t) {
        ea();
      }
      return null;
    }
  },
  toDate: (e, t) => Array.isArray(e) ? e.map(n => na(n, t)) : na(e, t),
  toString: (e, t) => Array.isArray(e) ? e.map(n => ge.isDayjs(n) ? n.format(t) : n) : ge.isDayjs(e) ? e.format(t) : e
};
function fe(e) {
  const t = xr();
  return Y(Y({}, e), t);
}
const Ya = Symbol("PanelContextProps");
const bn = e => {
  fa(Ya, e);
};
const Ae = () => da(Ya, {});
const Pt = {
  visibility: "hidden"
};
function ot(e, t) {
  let {
    slots: n
  } = t;
  var a;
  const r = fe(e);
  const {
    prefixCls: l,
    prevIcon: o = "‹",
    nextIcon: i = "›",
    superPrevIcon: u = "«",
    superNextIcon: s = "»",
    onSuperPrev: v,
    onSuperNext: c,
    onPrev: f,
    onNext: h
  } = r;
  const {
    hideNextBtn: y,
    hidePrevBtn: C
  } = Ae();
  return m("div", {
    class: l
  }, [v && m("button", {
    type: "button",
    onClick: v,
    tabindex: -1,
    class: `${l}-super-prev-btn`,
    style: C.value ? Pt : {}
  }, [u]), f && m("button", {
    type: "button",
    onClick: f,
    tabindex: -1,
    class: `${l}-prev-btn`,
    style: C.value ? Pt : {}
  }, [o]), m("div", {
    class: `${l}-view`
  }, [(a = n.default) === null || a === undefined ? undefined : a.call(n)]), h && m("button", {
    type: "button",
    onClick: h,
    tabindex: -1,
    class: `${l}-next-btn`,
    style: y.value ? Pt : {}
  }, [i]), c && m("button", {
    type: "button",
    onClick: c,
    tabindex: -1,
    class: `${l}-super-next-btn`,
    style: y.value ? Pt : {}
  }, [s])]);
}
ot.displayName = "Header";
ot.inheritAttrs = false;
function wn(e) {
  const t = fe(e);
  const {
    prefixCls: n,
    generateConfig: a,
    viewDate: r,
    onPrevDecades: l,
    onNextDecades: o
  } = t;
  const {
    hideHeader: i
  } = Ae();
  if (i) {
    return null;
  }
  const u = `${n}-header`;
  const s = a.getYear(r);
  const v = Math.floor(s / Ue) * Ue;
  const c = v + Ue - 1;
  return m(ot, R(R({}, t), {}, {
    prefixCls: u,
    onSuperPrev: l,
    onSuperNext: o
  }), {
    default: () => [v, va("-"), c]
  });
}
wn.displayName = "DecadeHeader";
wn.inheritAttrs = false;
function Ea(e, t, n, a, r) {
  let l = e.setHour(t, n);
  l = e.setMinute(l, a);
  l = e.setSecond(l, r);
  return l;
}
function Tt(e, t, n) {
  if (!n) {
    return t;
  }
  let a = t;
  a = e.setHour(a, e.getHour(n));
  a = e.setMinute(a, e.getMinute(n));
  a = e.setSecond(a, e.getSecond(n));
  return a;
}
function go(e, t, n, a, r, l) {
  const o = Math.floor(e / a) * a;
  if (o < e) {
    return [o, 60 - r, 60 - l];
  }
  const i = Math.floor(t / r) * r;
  if (i < t) {
    return [o, i, 60 - l];
  }
  const u = Math.floor(n / l) * l;
  return [o, i, u];
}
function po(e, t) {
  const n = e.getYear(t);
  const a = e.getMonth(t) + 1;
  const r = e.getEndDate(e.getFixedDate(`${n}-${a}-01`));
  const l = e.getDate(r);
  const o = a < 10 ? `0${a}` : `${a}`;
  return `${n}-${o}-${l}`;
}
function ct(e) {
  const {
    prefixCls: t,
    disabledDate: n,
    onSelect: a,
    picker: r,
    rowNum: l,
    colNum: o,
    prefixColumn: i,
    rowClassName: u,
    baseDate: s,
    getCellClassName: v,
    getCellText: c,
    getCellNode: f,
    getCellDate: h,
    generateConfig: y,
    titleCell: C,
    headerCells: d
  } = fe(e);
  const {
    onDateMouseenter: w,
    onDateMouseleave: g,
    mode: k
  } = Ae();
  const D = `${t}-cell`;
  const O = [];
  for (let E = 0; E < l; E += 1) {
    const q = [];
    let U;
    for (let L = 0; L < o; L += 1) {
      const A = E * o + L;
      const T = h(s, A);
      const B = dn({
        cellDate: T,
        mode: k.value,
        disabledDate: n,
        generateConfig: y
      });
      if (L === 0) {
        U = T;
        if (i) {
          q.push(i(U));
        }
      }
      const X = C && C(T);
      q.push(m("td", {
        key: L,
        title: X,
        class: ue(D, Y({
          [`${D}-disabled`]: B,
          [`${D}-start`]: c(T) === 1 || r === "year" && Number(X) % 10 === 0,
          [`${D}-end`]: X === po(y, T) || r === "year" && Number(X) % 10 === 9
        }, v(T))),
        onClick: I => {
          I.stopPropagation();
          if (!B) {
            a(T);
          }
        },
        onMouseenter: () => {
          if (!B && w) {
            w(T);
          }
        },
        onMouseleave: () => {
          if (!B && g) {
            g(T);
          }
        }
      }, [f ? f(T) : m("div", {
        class: `${D}-inner`
      }, [c(T)])]));
    }
    O.push(m("tr", {
      key: E,
      class: u && u(U)
    }, [q]));
  }
  return m("div", {
    class: `${t}-body`
  }, [m("table", {
    class: `${t}-content`
  }, [d && m("thead", null, [m("tr", null, [d])]), m("tbody", null, [O])])]);
}
ct.displayName = "PanelBody";
ct.inheritAttrs = false;
const sn = 3;
const aa = 4;
function $n(e) {
  const t = fe(e);
  const n = Ye - 1;
  const {
    prefixCls: a,
    viewDate: r,
    generateConfig: l
  } = t;
  const o = `${a}-cell`;
  const i = l.getYear(r);
  const u = Math.floor(i / Ye) * Ye;
  const s = Math.floor(i / Ue) * Ue;
  const v = s + Ue - 1;
  const c = l.setYear(r, s - Math.ceil((sn * aa * Ye - Ue) / 2));
  const f = h => {
    const y = l.getYear(h);
    const C = y + n;
    return {
      [`${o}-in-view`]: s <= y && C <= v,
      [`${o}-selected`]: y === u
    };
  };
  return m(ct, R(R({}, t), {}, {
    rowNum: aa,
    colNum: sn,
    baseDate: c,
    getCellText: h => {
      const y = l.getYear(h);
      return `${y}-${y + n}`;
    },
    getCellClassName: f,
    getCellDate: (h, y) => l.addYear(h, y * Ye)
  }), null);
}
$n.displayName = "DecadeBody";
$n.inheritAttrs = false;
const Mt = new Map();
function ho(e, t) {
  let n;
  function a() {
    if (Sr(e)) {
      t();
    } else {
      n = Ke(() => {
        a();
      });
    }
  }
  a();
  return () => {
    Ke.cancel(n);
  };
}
function un(e, t, n) {
  if (Mt.get(e)) {
    Ke.cancel(Mt.get(e));
  }
  if (n <= 0) {
    Mt.set(e, Ke(() => {
      e.scrollTop = t;
    }));
    return;
  }
  const r = (t - e.scrollTop) / n * 10;
  Mt.set(e, Ke(() => {
    e.scrollTop += r;
    if (e.scrollTop !== t) {
      un(e, t, n - 10);
    }
  }));
}
function pt(e, t) {
  let {
    onLeftRight: n,
    onCtrlLeftRight: a,
    onUpDown: r,
    onPageUpDown: l,
    onEnter: o
  } = t;
  const {
    which: i,
    ctrlKey: u,
    metaKey: s
  } = e;
  switch (i) {
    case ce.LEFT:
      if (u || s) {
        if (a) {
          a(-1);
          return true;
        }
      } else if (n) {
        n(-1);
        return true;
      }
      break;
    case ce.RIGHT:
      if (u || s) {
        if (a) {
          a(1);
          return true;
        }
      } else if (n) {
        n(1);
        return true;
      }
      break;
    case ce.UP:
      if (r) {
        r(-1);
        return true;
      }
      break;
    case ce.DOWN:
      if (r) {
        r(1);
        return true;
      }
      break;
    case ce.PAGE_UP:
      if (l) {
        l(-1);
        return true;
      }
      break;
    case ce.PAGE_DOWN:
      if (l) {
        l(1);
        return true;
      }
      break;
    case ce.ENTER:
      if (o) {
        o();
        return true;
      }
      break;
  }
  return false;
}
function Va(e, t, n, a) {
  let r = e;
  if (!r) {
    switch (t) {
      case "time":
        r = a ? "hh:mm:ss a" : "HH:mm:ss";
        break;
      case "week":
        r = "gggg-wo";
        break;
      case "month":
        r = "YYYY-MM";
        break;
      case "quarter":
        r = "YYYY-[Q]Q";
        break;
      case "year":
        r = "YYYY";
        break;
      default:
        r = n ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD";
    }
  }
  return r;
}
function Ha(e, t, n) {
  const a = e === "time" ? 8 : 10;
  const r = typeof t == "function" ? t(n.getNow()).length : t.length;
  return Math.max(a, r) + 2;
}
let $t = null;
const Ot = new Set();
function mo(e) {
  if (!$t && typeof window !== "undefined" && window.addEventListener) {
    $t = t => {
      [...Ot].forEach(n => {
        n(t);
      });
    };
    window.addEventListener("mousedown", $t);
  }
  Ot.add(e);
  return () => {
    Ot.delete(e);
    if (Ot.size === 0) {
      window.removeEventListener("mousedown", $t);
      $t = null;
    }
  };
}
function bo(e) {
  var t;
  const n = e.target;
  return e.composed && n.shadowRoot && ((t = e.composedPath) === null || t === undefined ? undefined : t.call(e)[0]) || n;
}
const wo = e => e === "month" || e === "date" ? "year" : e;
const $o = e => e === "date" ? "month" : e;
const Co = e => e === "month" || e === "date" ? "quarter" : e;
const yo = e => e === "date" ? "week" : e;
const ko = {
  year: wo,
  month: $o,
  quarter: Co,
  week: yo,
  time: null,
  date: null
};
function Aa(e, t) {
  return e.some(n => n && n.contains(t));
}
const Ye = 10;
const Ue = Ye * 10;
function Cn(e) {
  const t = fe(e);
  const {
    prefixCls: n,
    onViewDateChange: a,
    generateConfig: r,
    viewDate: l,
    operationRef: o,
    onSelect: i,
    onPanelChange: u
  } = t;
  const s = `${n}-decade-panel`;
  o.value = {
    onKeydown: f => pt(f, {
      onLeftRight: h => {
        i(r.addYear(l, h * Ye), "key");
      },
      onCtrlLeftRight: h => {
        i(r.addYear(l, h * Ue), "key");
      },
      onUpDown: h => {
        i(r.addYear(l, h * Ye * sn), "key");
      },
      onEnter: () => {
        u("year", l);
      }
    })
  };
  const v = f => {
    const h = r.addYear(l, f * Ue);
    a(h);
    u(null, h);
  };
  const c = f => {
    i(f, "mouse");
    u("year", f);
  };
  return m("div", {
    class: s
  }, [m(wn, R(R({}, t), {}, {
    prefixCls: n,
    onPrevDecades: () => {
      v(-1);
    },
    onNextDecades: () => {
      v(1);
    }
  }), null), m($n, R(R({}, t), {}, {
    prefixCls: n,
    onSelect: c
  }), null)]);
}
Cn.displayName = "DecadePanel";
Cn.inheritAttrs = false;
const It = 7;
function dt(e, t) {
  if (!e && !t) {
    return true;
  }
  if (!e || !t) {
    return false;
  }
}
function xo(e, t, n) {
  const a = dt(t, n);
  if (typeof a == "boolean") {
    return a;
  }
  const r = Math.floor(e.getYear(t) / 10);
  const l = Math.floor(e.getYear(n) / 10);
  return r === l;
}
function At(e, t, n) {
  const a = dt(t, n);
  if (typeof a == "boolean") {
    return a;
  } else {
    return e.getYear(t) === e.getYear(n);
  }
}
function cn(e, t) {
  return Math.floor(e.getMonth(t) / 3) + 1;
}
function _a(e, t, n) {
  const a = dt(t, n);
  if (typeof a == "boolean") {
    return a;
  } else {
    return At(e, t, n) && cn(e, t) === cn(e, n);
  }
}
function yn(e, t, n) {
  const a = dt(t, n);
  if (typeof a == "boolean") {
    return a;
  } else {
    return At(e, t, n) && e.getMonth(t) === e.getMonth(n);
  }
}
function qe(e, t, n) {
  const a = dt(t, n);
  if (typeof a == "boolean") {
    return a;
  } else {
    return e.getYear(t) === e.getYear(n) && e.getMonth(t) === e.getMonth(n) && e.getDate(t) === e.getDate(n);
  }
}
function So(e, t, n) {
  const a = dt(t, n);
  if (typeof a == "boolean") {
    return a;
  } else {
    return e.getHour(t) === e.getHour(n) && e.getMinute(t) === e.getMinute(n) && e.getSecond(t) === e.getSecond(n);
  }
}
function Ba(e, t, n, a) {
  const r = dt(n, a);
  if (typeof r == "boolean") {
    return r;
  } else {
    return e.locale.getWeek(t, n) === e.locale.getWeek(t, a);
  }
}
function gt(e, t, n) {
  return qe(e, t, n) && So(e, t, n);
}
function Rt(e, t, n, a) {
  if (!t || !n || !a) {
    return false;
  } else {
    return !qe(e, t, a) && !qe(e, n, a) && e.isAfter(a, t) && e.isAfter(n, a);
  }
}
function Do(e, t, n) {
  const a = t.locale.getWeekFirstDay(e);
  const r = t.setDate(n, 1);
  const l = t.getWeekDay(r);
  let o = t.addDate(r, a - l);
  if (t.getMonth(o) === t.getMonth(n) && t.getDate(o) > 1) {
    o = t.addDate(o, -7);
  }
  return o;
}
function yt(e, t, n, a = 1) {
  switch (t) {
    case "year":
      return n.addYear(e, a * 10);
    case "quarter":
    case "month":
      return n.addYear(e, a);
    default:
      return n.addMonth(e, a);
  }
}
function we(e, t) {
  let {
    generateConfig: n,
    locale: a,
    format: r
  } = t;
  if (typeof r == "function") {
    return r(e);
  } else {
    return n.locale.format(a.locale, e, r);
  }
}
function Wa(e, t) {
  let {
    generateConfig: n,
    locale: a,
    formatList: r
  } = t;
  if (!e || typeof r[0] == "function") {
    return null;
  } else {
    return n.locale.parse(a.locale, e, r);
  }
}
function dn(e) {
  let {
    cellDate: t,
    mode: n,
    disabledDate: a,
    generateConfig: r
  } = e;
  if (!a) {
    return false;
  }
  const l = (o, i, u) => {
    let s = i;
    while (s <= u) {
      let v;
      switch (o) {
        case "date":
          {
            v = r.setDate(t, s);
            if (!a(v)) {
              return false;
            }
            break;
          }
        case "month":
          {
            v = r.setMonth(t, s);
            if (!dn({
              cellDate: v,
              mode: "month",
              generateConfig: r,
              disabledDate: a
            })) {
              return false;
            }
            break;
          }
        case "year":
          {
            v = r.setYear(t, s);
            if (!dn({
              cellDate: v,
              mode: "year",
              generateConfig: r,
              disabledDate: a
            })) {
              return false;
            }
            break;
          }
      }
      s += 1;
    }
    return true;
  };
  switch (n) {
    case "date":
    case "week":
      return a(t);
    case "month":
      {
        const i = r.getDate(r.getEndDate(t));
        return l("date", 1, i);
      }
    case "quarter":
      {
        const o = Math.floor(r.getMonth(t) / 3) * 3;
        const i = o + 2;
        return l("month", o, i);
      }
    case "year":
      return l("month", 0, 11);
    case "decade":
      {
        const o = r.getYear(t);
        const i = Math.floor(o / Ye) * Ye;
        const u = i + Ye - 1;
        return l("year", i, u);
      }
  }
}
function kn(e) {
  const t = fe(e);
  const {
    hideHeader: n
  } = Ae();
  if (n.value) {
    return null;
  }
  const {
    prefixCls: a,
    generateConfig: r,
    locale: l,
    value: o,
    format: i
  } = t;
  const u = `${a}-header`;
  return m(ot, {
    prefixCls: u
  }, {
    default: () => [o ? we(o, {
      locale: l,
      format: i,
      generateConfig: r
    }) : "\xA0"]
  });
}
kn.displayName = "TimeHeader";
kn.inheritAttrs = false;
const Nt = Qe({
  name: "TimeUnitColumn",
  props: ["prefixCls", "units", "onSelect", "value", "active", "hideDisabledOptions"],
  setup(e) {
    const {
      open: t
    } = Ae();
    const n = Ve(null);
    const a = z(new Map());
    const r = z();
    pe(() => e.value, () => {
      const l = a.value.get(e.value);
      if (l && t.value !== false) {
        un(n.value, l.offsetTop, 120);
      }
    });
    hn(() => {
      var l;
      if ((l = r.value) !== null && l !== undefined) {
        l.call(r);
      }
    });
    pe(t, () => {
      var l;
      if ((l = r.value) !== null && l !== undefined) {
        l.call(r);
      }
      ga(() => {
        if (t.value) {
          const o = a.value.get(e.value);
          if (o) {
            r.value = ho(o, () => {
              un(n.value, o.offsetTop, 0);
            });
          }
        }
      });
    }, {
      immediate: true,
      flush: "post"
    });
    return () => {
      const {
        prefixCls: l,
        units: o,
        onSelect: i,
        value: u,
        active: s,
        hideDisabledOptions: v
      } = e;
      const c = `${l}-cell`;
      return m("ul", {
        class: ue(`${l}-column`, {
          [`${l}-column-active`]: s
        }),
        ref: n,
        style: {
          position: "relative"
        }
      }, [o.map(f => v && f.disabled ? null : m("li", {
        key: f.value,
        ref: h => {
          a.value.set(f.value, h);
        },
        class: ue(c, {
          [`${c}-disabled`]: f.disabled,
          [`${c}-selected`]: u === f.value
        }),
        onClick: () => {
          if (!f.disabled) {
            i(f.value);
          }
        }
      }, [m("div", {
        class: `${c}-inner`
      }, [f.label])]))]);
    };
  }
});
function Fa(e, t, n = "0") {
  let a = String(e);
  while (a.length < t) {
    a = `${n}${e}`;
  }
  return a;
}
const Po = function () {
  for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) {
    t[n] = arguments[n];
  }
  return t;
};
function La(e) {
  if (e == null) {
    return [];
  } else if (Array.isArray(e)) {
    return e;
  } else {
    return [e];
  }
}
function ja(e) {
  const t = {};
  Object.keys(e).forEach(n => {
    if ((n.startsWith("data-") || n.startsWith("aria-") || n === "role" || n === "name") && !n.startsWith("data-__")) {
      t[n] = e[n];
    }
  });
  return t;
}
function J(e, t) {
  if (e) {
    return e[t];
  } else {
    return null;
  }
}
function Ne(e, t, n) {
  const a = [J(e, 0), J(e, 1)];
  a[n] = typeof t == "function" ? t(a[n]) : t;
  if (!a[0] && !a[1]) {
    return null;
  } else {
    return a;
  }
}
function tn(e, t, n, a) {
  const r = [];
  for (let l = e; l <= t; l += n) {
    r.push({
      label: Fa(l, 2),
      value: l,
      disabled: (a || []).includes(l)
    });
  }
  return r;
}
const Mo = Qe({
  compatConfig: {
    MODE: 3
  },
  name: "TimeBody",
  inheritAttrs: false,
  props: ["generateConfig", "prefixCls", "operationRef", "activeColumnIndex", "value", "showHour", "showMinute", "showSecond", "use12Hours", "hourStep", "minuteStep", "secondStep", "disabledHours", "disabledMinutes", "disabledSeconds", "disabledTime", "hideDisabledOptions", "onSelect"],
  setup(e) {
    const t = F(() => e.value ? e.generateConfig.getHour(e.value) : -1);
    const n = F(() => e.use12Hours ? t.value >= 12 : false);
    const a = F(() => e.use12Hours ? t.value % 12 : t.value);
    const r = F(() => e.value ? e.generateConfig.getMinute(e.value) : -1);
    const l = F(() => e.value ? e.generateConfig.getSecond(e.value) : -1);
    const o = z(e.generateConfig.getNow());
    const i = z();
    const u = z();
    const s = z();
    Dr(() => {
      o.value = e.generateConfig.getNow();
    });
    pa(() => {
      if (e.disabledTime) {
        const d = e.disabledTime(o);
        [i.value, u.value, s.value] = [d.disabledHours, d.disabledMinutes, d.disabledSeconds];
      } else {
        [i.value, u.value, s.value] = [e.disabledHours, e.disabledMinutes, e.disabledSeconds];
      }
    });
    const v = (d, w, g, k) => {
      let D = e.value || e.generateConfig.getNow();
      const O = Math.max(0, w);
      const E = Math.max(0, g);
      const q = Math.max(0, k);
      D = Ea(e.generateConfig, D, !e.use12Hours || !d ? O : O + 12, E, q);
      return D;
    };
    const c = F(() => {
      return tn(0, 23, e.hourStep ?? 1, i.value && i.value());
    });
    const f = F(() => {
      if (!e.use12Hours) {
        return [false, false];
      }
      const d = [true, true];
      c.value.forEach(w => {
        let {
          disabled: g,
          value: k
        } = w;
        if (!g) {
          if (k >= 12) {
            d[1] = false;
          } else {
            d[0] = false;
          }
        }
      });
      return d;
    });
    const h = F(() => e.use12Hours ? c.value.filter(n.value ? d => d.value >= 12 : d => d.value < 12).map(d => {
      const w = d.value % 12;
      const g = w === 0 ? "12" : Fa(w, 2);
      return Y(Y({}, d), {
        label: g,
        value: w
      });
    }) : c.value);
    const y = F(() => {
      return tn(0, 59, e.minuteStep ?? 1, u.value && u.value(t.value));
    });
    const C = F(() => {
      return tn(0, 59, e.secondStep ?? 1, s.value && s.value(t.value, r.value));
    });
    return () => {
      const {
        prefixCls: d,
        operationRef: w,
        activeColumnIndex: g,
        showHour: k,
        showMinute: D,
        showSecond: O,
        use12Hours: E,
        hideDisabledOptions: q,
        onSelect: U
      } = e;
      const L = [];
      const A = `${d}-content`;
      const T = `${d}-time-panel`;
      w.value = {
        onUpDown: I => {
          const P = L[g];
          if (P) {
            const x = P.units.findIndex($ => $.value === P.value);
            const b = P.units.length;
            for (let $ = 1; $ < b; $ += 1) {
              const N = P.units[(x + I * $ + b) % b];
              if (N.disabled !== true) {
                P.onSelect(N.value);
                break;
              }
            }
          }
        }
      };
      function B(I, P, x, b, $) {
        if (I !== false) {
          L.push({
            node: Pr(P, {
              prefixCls: T,
              value: x,
              active: g === L.length,
              onSelect: $,
              units: b,
              hideDisabledOptions: q
            }),
            onSelect: $,
            value: x,
            units: b
          });
        }
      }
      B(k, m(Nt, {
        key: "hour"
      }, null), a.value, h.value, I => {
        U(v(n.value, I, r.value, l.value), "mouse");
      });
      B(D, m(Nt, {
        key: "minute"
      }, null), r.value, y.value, I => {
        U(v(n.value, a.value, I, l.value), "mouse");
      });
      B(O, m(Nt, {
        key: "second"
      }, null), l.value, C.value, I => {
        U(v(n.value, a.value, r.value, I), "mouse");
      });
      let X = -1;
      if (typeof n.value == "boolean") {
        X = n.value ? 1 : 0;
      }
      B(E === true, m(Nt, {
        key: "12hours"
      }, null), X, [{
        label: "AM",
        value: 0,
        disabled: f.value[0]
      }, {
        label: "PM",
        value: 1,
        disabled: f.value[1]
      }], I => {
        U(v(!!I, a.value, r.value, l.value), "mouse");
      });
      return m("div", {
        class: A
      }, [L.map(I => {
        let {
          node: P
        } = I;
        return P;
      })]);
    };
  }
});
const Oo = e => e.filter(t => t !== false).length;
function _t(e) {
  const t = fe(e);
  const {
    generateConfig: n,
    format: a = "HH:mm:ss",
    prefixCls: r,
    active: l,
    operationRef: o,
    showHour: i,
    showMinute: u,
    showSecond: s,
    use12Hours: v = false,
    onSelect: c,
    value: f
  } = t;
  const h = `${r}-time-panel`;
  const y = z();
  const C = z(-1);
  const d = Oo([i, u, s, v]);
  o.value = {
    onKeydown: w => pt(w, {
      onLeftRight: g => {
        C.value = (C.value + g + d) % d;
      },
      onUpDown: g => {
        if (C.value === -1) {
          C.value = 0;
        } else if (y.value) {
          y.value.onUpDown(g);
        }
      },
      onEnter: () => {
        c(f || n.getNow(), "key");
        C.value = -1;
      }
    }),
    onBlur: () => {
      C.value = -1;
    }
  };
  return m("div", {
    class: ue(h, {
      [`${h}-active`]: l
    })
  }, [m(kn, R(R({}, t), {}, {
    format: a,
    prefixCls: r
  }), null), m(Mo, R(R({}, t), {}, {
    prefixCls: r,
    activeColumnIndex: C.value,
    operationRef: y
  }), null)]);
}
_t.displayName = "TimePanel";
_t.inheritAttrs = false;
function Bt(e) {
  let {
    cellPrefixCls: t,
    generateConfig: n,
    rangedValue: a,
    hoverRangedValue: r,
    isInView: l,
    isSameCell: o,
    offsetCell: i,
    today: u,
    value: s
  } = e;
  function v(c) {
    const f = i(c, -1);
    const h = i(c, 1);
    const y = J(a, 0);
    const C = J(a, 1);
    const d = J(r, 0);
    const w = J(r, 1);
    const g = Rt(n, d, w, c);
    function k(L) {
      return o(y, L);
    }
    function D(L) {
      return o(C, L);
    }
    const O = o(d, c);
    const E = o(w, c);
    const q = (g || E) && (!l(f) || D(f));
    const U = (g || O) && (!l(h) || k(h));
    return {
      [`${t}-in-view`]: l(c),
      [`${t}-in-range`]: Rt(n, y, C, c),
      [`${t}-range-start`]: k(c),
      [`${t}-range-end`]: D(c),
      [`${t}-range-start-single`]: k(c) && !C,
      [`${t}-range-end-single`]: D(c) && !y,
      [`${t}-range-start-near-hover`]: k(c) && (o(f, d) || Rt(n, d, w, f)),
      [`${t}-range-end-near-hover`]: D(c) && (o(h, w) || Rt(n, d, w, h)),
      [`${t}-range-hover`]: g,
      [`${t}-range-hover-start`]: O,
      [`${t}-range-hover-end`]: E,
      [`${t}-range-hover-edge-start`]: q,
      [`${t}-range-hover-edge-end`]: U,
      [`${t}-range-hover-edge-start-near-range`]: q && o(f, C),
      [`${t}-range-hover-edge-end-near-range`]: U && o(h, y),
      [`${t}-today`]: o(u, c),
      [`${t}-selected`]: o(s, c)
    };
  }
  return v;
}
const za = Symbol("RangeContextProps");
const Ro = e => {
  fa(za, e);
};
const kt = () => da(za, {
  rangedValue: z(),
  hoverRangedValue: z(),
  inRange: z(),
  panelPosition: z()
});
const No = Qe({
  compatConfig: {
    MODE: 3
  },
  name: "PanelContextProvider",
  inheritAttrs: false,
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  setup(e, t) {
    let {
      slots: n
    } = t;
    const a = {
      rangedValue: z(e.value.rangedValue),
      hoverRangedValue: z(e.value.hoverRangedValue),
      inRange: z(e.value.inRange),
      panelPosition: z(e.value.panelPosition)
    };
    Ro(a);
    pe(() => e.value, () => {
      Object.keys(e.value).forEach(r => {
        if (a[r]) {
          a[r].value = e.value[r];
        }
      });
    });
    return () => {
      var r;
      if ((r = n.default) === null || r === undefined) {
        return undefined;
      } else {
        return r.call(n);
      }
    };
  }
});
function Wt(e) {
  const t = fe(e);
  const {
    prefixCls: n,
    generateConfig: a,
    prefixColumn: r,
    locale: l,
    rowCount: o,
    viewDate: i,
    value: u,
    dateRender: s
  } = t;
  const {
    rangedValue: v,
    hoverRangedValue: c
  } = kt();
  const f = Do(l.locale, a, i);
  const h = `${n}-cell`;
  const y = a.locale.getWeekFirstDay(l.locale);
  const C = a.getNow();
  const d = [];
  const w = l.shortWeekDays || (a.locale.getShortWeekDays ? a.locale.getShortWeekDays(l.locale) : []);
  if (r) {
    d.push(m("th", {
      key: "empty",
      "aria-label": "empty cell"
    }, null));
  }
  for (let D = 0; D < It; D += 1) {
    d.push(m("th", {
      key: D
    }, [w[(D + y) % It]]));
  }
  const g = Bt({
    cellPrefixCls: h,
    today: C,
    value: u,
    generateConfig: a,
    rangedValue: r ? null : v.value,
    hoverRangedValue: r ? null : c.value,
    isSameCell: (D, O) => qe(a, D, O),
    isInView: D => yn(a, D, i),
    offsetCell: (D, O) => a.addDate(D, O)
  });
  const k = s ? D => s({
    current: D,
    today: C
  }) : undefined;
  return m(ct, R(R({}, t), {}, {
    rowNum: o,
    colNum: It,
    baseDate: f,
    getCellNode: k,
    getCellText: a.getDate,
    getCellClassName: g,
    getCellDate: a.addDate,
    titleCell: D => we(D, {
      locale: l,
      format: "YYYY-MM-DD",
      generateConfig: a
    }),
    headerCells: d
  }), null);
}
Wt.displayName = "DateBody";
Wt.inheritAttrs = false;
Wt.props = ["prefixCls", "generateConfig", "value?", "viewDate", "locale", "rowCount", "onSelect", "dateRender?", "disabledDate?", "prefixColumn?", "rowClassName?"];
function xn(e) {
  const t = fe(e);
  const {
    prefixCls: n,
    generateConfig: a,
    locale: r,
    viewDate: l,
    onNextMonth: o,
    onPrevMonth: i,
    onNextYear: u,
    onPrevYear: s,
    onYearClick: v,
    onMonthClick: c
  } = t;
  const {
    hideHeader: f
  } = Ae();
  if (f.value) {
    return null;
  }
  const h = `${n}-header`;
  const y = r.shortMonths || (a.locale.getShortMonths ? a.locale.getShortMonths(r.locale) : []);
  const C = a.getMonth(l);
  const d = m("button", {
    type: "button",
    key: "year",
    onClick: v,
    tabindex: -1,
    class: `${n}-year-btn`
  }, [we(l, {
    locale: r,
    format: r.yearFormat,
    generateConfig: a
  })]);
  const w = m("button", {
    type: "button",
    key: "month",
    onClick: c,
    tabindex: -1,
    class: `${n}-month-btn`
  }, [r.monthFormat ? we(l, {
    locale: r,
    format: r.monthFormat,
    generateConfig: a
  }) : y[C]]);
  const g = r.monthBeforeYear ? [w, d] : [d, w];
  return m(ot, R(R({}, t), {}, {
    prefixCls: h,
    onSuperPrev: s,
    onPrev: i,
    onNext: o,
    onSuperNext: u
  }), {
    default: () => [g]
  });
}
xn.displayName = "DateHeader";
xn.inheritAttrs = false;
const To = 6;
function xt(e) {
  const t = fe(e);
  const {
    prefixCls: n,
    panelName: a = "date",
    keyboardConfig: r,
    active: l,
    operationRef: o,
    generateConfig: i,
    value: u,
    viewDate: s,
    onViewDateChange: v,
    onPanelChange: c,
    onSelect: f
  } = t;
  const h = `${n}-${a}-panel`;
  o.value = {
    onKeydown: d => pt(d, Y({
      onLeftRight: w => {
        f(i.addDate(u || s, w), "key");
      },
      onCtrlLeftRight: w => {
        f(i.addYear(u || s, w), "key");
      },
      onUpDown: w => {
        f(i.addDate(u || s, w * It), "key");
      },
      onPageUpDown: w => {
        f(i.addMonth(u || s, w), "key");
      }
    }, r))
  };
  const y = d => {
    const w = i.addYear(s, d);
    v(w);
    c(null, w);
  };
  const C = d => {
    const w = i.addMonth(s, d);
    v(w);
    c(null, w);
  };
  return m("div", {
    class: ue(h, {
      [`${h}-active`]: l
    })
  }, [m(xn, R(R({}, t), {}, {
    prefixCls: n,
    value: u,
    viewDate: s,
    onPrevYear: () => {
      y(-1);
    },
    onNextYear: () => {
      y(1);
    },
    onPrevMonth: () => {
      C(-1);
    },
    onNextMonth: () => {
      C(1);
    },
    onMonthClick: () => {
      c("month", s);
    },
    onYearClick: () => {
      c("year", s);
    }
  }), null), m(Wt, R(R({}, t), {}, {
    onSelect: d => f(d, "mouse"),
    prefixCls: n,
    value: u,
    viewDate: s,
    rowCount: To
  }), null)]);
}
xt.displayName = "DatePanel";
xt.inheritAttrs = false;
const ra = Po("date", "time");
function Sn(e) {
  const t = fe(e);
  const {
    prefixCls: n,
    operationRef: a,
    generateConfig: r,
    value: l,
    defaultValue: o,
    disabledTime: i,
    showTime: u,
    onSelect: s
  } = t;
  const v = `${n}-datetime-panel`;
  const c = z(null);
  const f = z({});
  const h = z({});
  const y = typeof u == "object" ? Y({}, u) : {};
  function C(k) {
    const D = ra.indexOf(c.value) + k;
    return ra[D] || null;
  }
  const d = k => {
    if (h.value.onBlur) {
      h.value.onBlur(k);
    }
    c.value = null;
  };
  a.value = {
    onKeydown: k => {
      if (k.which === ce.TAB) {
        const D = C(k.shiftKey ? -1 : 1);
        c.value = D;
        if (D) {
          k.preventDefault();
        }
        return true;
      }
      if (c.value) {
        const D = c.value === "date" ? f : h;
        if (D.value && D.value.onKeydown) {
          D.value.onKeydown(k);
        }
        return true;
      }
      if ([ce.LEFT, ce.RIGHT, ce.UP, ce.DOWN].includes(k.which)) {
        c.value = "date";
        return true;
      } else {
        return false;
      }
    },
    onBlur: d,
    onClose: d
  };
  const w = (k, D) => {
    let O = k;
    if (D === "date" && !l && y.defaultValue) {
      O = r.setHour(O, r.getHour(y.defaultValue));
      O = r.setMinute(O, r.getMinute(y.defaultValue));
      O = r.setSecond(O, r.getSecond(y.defaultValue));
    } else if (D === "time" && !l && o) {
      O = r.setYear(O, r.getYear(o));
      O = r.setMonth(O, r.getMonth(o));
      O = r.setDate(O, r.getDate(o));
    }
    if (s) {
      s(O, "mouse");
    }
  };
  const g = i ? i(l || null) : {};
  return m("div", {
    class: ue(v, {
      [`${v}-active`]: c.value
    })
  }, [m(xt, R(R({}, t), {}, {
    operationRef: f,
    active: c.value === "date",
    onSelect: k => {
      w(Tt(r, k, !l && typeof u == "object" ? u.defaultValue : null), "date");
    }
  }), null), m(_t, R(R(R(R({}, t), {}, {
    format: undefined
  }, y), g), {}, {
    disabledTime: null,
    defaultValue: undefined,
    operationRef: h,
    active: c.value === "time",
    onSelect: k => {
      w(k, "time");
    }
  }), null)]);
}
Sn.displayName = "DatetimePanel";
Sn.inheritAttrs = false;
function Dn(e) {
  const t = fe(e);
  const {
    prefixCls: n,
    generateConfig: a,
    locale: r,
    value: l
  } = t;
  const o = `${n}-cell`;
  const i = v => m("td", {
    key: "week",
    class: ue(o, `${o}-week`)
  }, [a.locale.getWeek(r.locale, v)]);
  const u = `${n}-week-panel-row`;
  const s = v => ue(u, {
    [`${u}-selected`]: Ba(a, r.locale, l, v)
  });
  return m(xt, R(R({}, t), {}, {
    panelName: "week",
    prefixColumn: i,
    rowClassName: s,
    keyboardConfig: {
      onLeftRight: null
    }
  }), null);
}
Dn.displayName = "WeekPanel";
Dn.inheritAttrs = false;
function Pn(e) {
  const t = fe(e);
  const {
    prefixCls: n,
    generateConfig: a,
    locale: r,
    viewDate: l,
    onNextYear: o,
    onPrevYear: i,
    onYearClick: u
  } = t;
  const {
    hideHeader: s
  } = Ae();
  if (s.value) {
    return null;
  }
  const v = `${n}-header`;
  return m(ot, R(R({}, t), {}, {
    prefixCls: v,
    onSuperPrev: i,
    onSuperNext: o
  }), {
    default: () => [m("button", {
      type: "button",
      onClick: u,
      class: `${n}-year-btn`
    }, [we(l, {
      locale: r,
      format: r.yearFormat,
      generateConfig: a
    })])]
  });
}
Pn.displayName = "MonthHeader";
Pn.inheritAttrs = false;
const Ua = 3;
const Io = 4;
function Mn(e) {
  const t = fe(e);
  const {
    prefixCls: n,
    locale: a,
    value: r,
    viewDate: l,
    generateConfig: o,
    monthCellRender: i
  } = t;
  const {
    rangedValue: u,
    hoverRangedValue: s
  } = kt();
  const v = `${n}-cell`;
  const c = Bt({
    cellPrefixCls: v,
    value: r,
    generateConfig: o,
    rangedValue: u.value,
    hoverRangedValue: s.value,
    isSameCell: (C, d) => yn(o, C, d),
    isInView: () => true,
    offsetCell: (C, d) => o.addMonth(C, d)
  });
  const f = a.shortMonths || (o.locale.getShortMonths ? o.locale.getShortMonths(a.locale) : []);
  const h = o.setMonth(l, 0);
  const y = i ? C => i({
    current: C,
    locale: a
  }) : undefined;
  return m(ct, R(R({}, t), {}, {
    rowNum: Io,
    colNum: Ua,
    baseDate: h,
    getCellNode: y,
    getCellText: C => a.monthFormat ? we(C, {
      locale: a,
      format: a.monthFormat,
      generateConfig: o
    }) : f[o.getMonth(C)],
    getCellClassName: c,
    getCellDate: o.addMonth,
    titleCell: C => we(C, {
      locale: a,
      format: "YYYY-MM",
      generateConfig: o
    })
  }), null);
}
Mn.displayName = "MonthBody";
Mn.inheritAttrs = false;
function On(e) {
  const t = fe(e);
  const {
    prefixCls: n,
    operationRef: a,
    onViewDateChange: r,
    generateConfig: l,
    value: o,
    viewDate: i,
    onPanelChange: u,
    onSelect: s
  } = t;
  const v = `${n}-month-panel`;
  a.value = {
    onKeydown: f => pt(f, {
      onLeftRight: h => {
        s(l.addMonth(o || i, h), "key");
      },
      onCtrlLeftRight: h => {
        s(l.addYear(o || i, h), "key");
      },
      onUpDown: h => {
        s(l.addMonth(o || i, h * Ua), "key");
      },
      onEnter: () => {
        u("date", o || i);
      }
    })
  };
  const c = f => {
    const h = l.addYear(i, f);
    r(h);
    u(null, h);
  };
  return m("div", {
    class: v
  }, [m(Pn, R(R({}, t), {}, {
    prefixCls: n,
    onPrevYear: () => {
      c(-1);
    },
    onNextYear: () => {
      c(1);
    },
    onYearClick: () => {
      u("year", i);
    }
  }), null), m(Mn, R(R({}, t), {}, {
    prefixCls: n,
    onSelect: f => {
      s(f, "mouse");
      u("date", f);
    }
  }), null)]);
}
On.displayName = "MonthPanel";
On.inheritAttrs = false;
function Rn(e) {
  const t = fe(e);
  const {
    prefixCls: n,
    generateConfig: a,
    locale: r,
    viewDate: l,
    onNextYear: o,
    onPrevYear: i,
    onYearClick: u
  } = t;
  const {
    hideHeader: s
  } = Ae();
  if (s.value) {
    return null;
  }
  const v = `${n}-header`;
  return m(ot, R(R({}, t), {}, {
    prefixCls: v,
    onSuperPrev: i,
    onSuperNext: o
  }), {
    default: () => [m("button", {
      type: "button",
      onClick: u,
      class: `${n}-year-btn`
    }, [we(l, {
      locale: r,
      format: r.yearFormat,
      generateConfig: a
    })])]
  });
}
Rn.displayName = "QuarterHeader";
Rn.inheritAttrs = false;
const Yo = 4;
const Eo = 1;
function Nn(e) {
  const t = fe(e);
  const {
    prefixCls: n,
    locale: a,
    value: r,
    viewDate: l,
    generateConfig: o
  } = t;
  const {
    rangedValue: i,
    hoverRangedValue: u
  } = kt();
  const s = `${n}-cell`;
  const v = Bt({
    cellPrefixCls: s,
    value: r,
    generateConfig: o,
    rangedValue: i.value,
    hoverRangedValue: u.value,
    isSameCell: (f, h) => _a(o, f, h),
    isInView: () => true,
    offsetCell: (f, h) => o.addMonth(f, h * 3)
  });
  const c = o.setDate(o.setMonth(l, 0), 1);
  return m(ct, R(R({}, t), {}, {
    rowNum: Eo,
    colNum: Yo,
    baseDate: c,
    getCellText: f => we(f, {
      locale: a,
      format: a.quarterFormat || "[Q]Q",
      generateConfig: o
    }),
    getCellClassName: v,
    getCellDate: (f, h) => o.addMonth(f, h * 3),
    titleCell: f => we(f, {
      locale: a,
      format: "YYYY-[Q]Q",
      generateConfig: o
    })
  }), null);
}
Nn.displayName = "QuarterBody";
Nn.inheritAttrs = false;
function Tn(e) {
  const t = fe(e);
  const {
    prefixCls: n,
    operationRef: a,
    onViewDateChange: r,
    generateConfig: l,
    value: o,
    viewDate: i,
    onPanelChange: u,
    onSelect: s
  } = t;
  const v = `${n}-quarter-panel`;
  a.value = {
    onKeydown: f => pt(f, {
      onLeftRight: h => {
        s(l.addMonth(o || i, h * 3), "key");
      },
      onCtrlLeftRight: h => {
        s(l.addYear(o || i, h), "key");
      },
      onUpDown: h => {
        s(l.addYear(o || i, h), "key");
      }
    })
  };
  const c = f => {
    const h = l.addYear(i, f);
    r(h);
    u(null, h);
  };
  return m("div", {
    class: v
  }, [m(Rn, R(R({}, t), {}, {
    prefixCls: n,
    onPrevYear: () => {
      c(-1);
    },
    onNextYear: () => {
      c(1);
    },
    onYearClick: () => {
      u("year", i);
    }
  }), null), m(Nn, R(R({}, t), {}, {
    prefixCls: n,
    onSelect: f => {
      s(f, "mouse");
    }
  }), null)]);
}
Tn.displayName = "QuarterPanel";
Tn.inheritAttrs = false;
function In(e) {
  const t = fe(e);
  const {
    prefixCls: n,
    generateConfig: a,
    viewDate: r,
    onPrevDecade: l,
    onNextDecade: o,
    onDecadeClick: i
  } = t;
  const {
    hideHeader: u
  } = Ae();
  if (u.value) {
    return null;
  }
  const s = `${n}-header`;
  const v = a.getYear(r);
  const c = Math.floor(v / nt) * nt;
  const f = c + nt - 1;
  return m(ot, R(R({}, t), {}, {
    prefixCls: s,
    onSuperPrev: l,
    onSuperNext: o
  }), {
    default: () => [m("button", {
      type: "button",
      onClick: i,
      class: `${n}-decade-btn`
    }, [c, va("-"), f])]
  });
}
In.displayName = "YearHeader";
In.inheritAttrs = false;
const fn = 3;
const oa = 4;
function Yn(e) {
  const t = fe(e);
  const {
    prefixCls: n,
    value: a,
    viewDate: r,
    locale: l,
    generateConfig: o
  } = t;
  const {
    rangedValue: i,
    hoverRangedValue: u
  } = kt();
  const s = `${n}-cell`;
  const v = o.getYear(r);
  const c = Math.floor(v / nt) * nt;
  const f = c + nt - 1;
  const h = o.setYear(r, c - Math.ceil((fn * oa - nt) / 2));
  const y = d => {
    const w = o.getYear(d);
    return c <= w && w <= f;
  };
  const C = Bt({
    cellPrefixCls: s,
    value: a,
    generateConfig: o,
    rangedValue: i.value,
    hoverRangedValue: u.value,
    isSameCell: (d, w) => At(o, d, w),
    isInView: y,
    offsetCell: (d, w) => o.addYear(d, w)
  });
  return m(ct, R(R({}, t), {}, {
    rowNum: oa,
    colNum: fn,
    baseDate: h,
    getCellText: o.getYear,
    getCellClassName: C,
    getCellDate: o.addYear,
    titleCell: d => we(d, {
      locale: l,
      format: "YYYY",
      generateConfig: o
    })
  }), null);
}
Yn.displayName = "YearBody";
Yn.inheritAttrs = false;
const nt = 10;
function En(e) {
  const t = fe(e);
  const {
    prefixCls: n,
    operationRef: a,
    onViewDateChange: r,
    generateConfig: l,
    value: o,
    viewDate: i,
    sourceMode: u,
    onSelect: s,
    onPanelChange: v
  } = t;
  const c = `${n}-year-panel`;
  a.value = {
    onKeydown: h => pt(h, {
      onLeftRight: y => {
        s(l.addYear(o || i, y), "key");
      },
      onCtrlLeftRight: y => {
        s(l.addYear(o || i, y * nt), "key");
      },
      onUpDown: y => {
        s(l.addYear(o || i, y * fn), "key");
      },
      onEnter: () => {
        v(u === "date" ? "date" : "month", o || i);
      }
    })
  };
  const f = h => {
    const y = l.addYear(i, h * 10);
    r(y);
    v(null, y);
  };
  return m("div", {
    class: c
  }, [m(In, R(R({}, t), {}, {
    prefixCls: n,
    onPrevDecade: () => {
      f(-1);
    },
    onNextDecade: () => {
      f(1);
    },
    onDecadeClick: () => {
      v("decade", i);
    }
  }), null), m(Yn, R(R({}, t), {}, {
    prefixCls: n,
    onSelect: h => {
      v(u === "date" ? "date" : "month", h);
      s(h, "mouse");
    }
  }), null)]);
}
En.displayName = "YearPanel";
En.inheritAttrs = false;
function qa(e, t, n) {
  if (n) {
    return m("div", {
      class: `${e}-footer-extra`
    }, [n(t)]);
  } else {
    return null;
  }
}
function Ka(e) {
  let {
    prefixCls: t,
    components: n = {},
    needConfirmButton: a,
    onNow: r,
    onOk: l,
    okDisabled: o,
    showNow: i,
    locale: u
  } = e;
  let s;
  let v;
  if (a) {
    const c = n.button || "button";
    if (r && i !== false) {
      s = m("li", {
        class: `${t}-now`
      }, [m("a", {
        class: `${t}-now-btn`,
        onClick: r
      }, [u.now])]);
    }
    v = a && m("li", {
      class: `${t}-ok`
    }, [m(c, {
      disabled: o,
      onClick: f => {
        f.stopPropagation();
        if (l) {
          l();
        }
      }
    }, {
      default: () => [u.ok]
    })]);
  }
  if (!s && !v) {
    return null;
  } else {
    return m("ul", {
      class: `${t}-ranges`
    }, [s, v]);
  }
}
function Vo() {
  return Qe({
    name: "PickerPanel",
    inheritAttrs: false,
    props: {
      prefixCls: String,
      locale: Object,
      generateConfig: Object,
      value: Object,
      defaultValue: Object,
      pickerValue: Object,
      defaultPickerValue: Object,
      disabledDate: Function,
      mode: String,
      picker: {
        type: String,
        default: "date"
      },
      tabindex: {
        type: [Number, String],
        default: 0
      },
      showNow: {
        type: Boolean,
        default: undefined
      },
      showTime: [Boolean, Object],
      showToday: Boolean,
      renderExtraFooter: Function,
      dateRender: Function,
      hideHeader: {
        type: Boolean,
        default: undefined
      },
      onSelect: Function,
      onChange: Function,
      onPanelChange: Function,
      onMousedown: Function,
      onPickerValueChange: Function,
      onOk: Function,
      components: Object,
      direction: String,
      hourStep: {
        type: Number,
        default: 1
      },
      minuteStep: {
        type: Number,
        default: 1
      },
      secondStep: {
        type: Number,
        default: 1
      }
    },
    setup(e, t) {
      let {
        attrs: n
      } = t;
      const a = F(() => e.picker === "date" && !!e.showTime || e.picker === "time");
      const r = F(() => 24 % e.hourStep === 0);
      const l = F(() => 60 % e.minuteStep === 0);
      const o = F(() => 60 % e.secondStep === 0);
      const i = Ae();
      const {
        operationRef: u,
        onSelect: s,
        hideRanges: v,
        defaultOpenValue: c
      } = i;
      const {
        inRange: f,
        panelPosition: h,
        rangedValue: y,
        hoverRangedValue: C
      } = kt();
      const d = z({});
      const [w, g] = He(null, {
        value: de(e, "value"),
        defaultValue: e.defaultValue,
        postState: b => !b && c != null && c.value && e.picker === "time" ? c.value : b
      });
      const [k, D] = He(null, {
        value: de(e, "pickerValue"),
        defaultValue: e.defaultPickerValue || w.value,
        postState: b => {
          const {
            generateConfig: $,
            showTime: N,
            defaultValue: p
          } = e;
          const S = $.getNow();
          if (b) {
            if (!w.value && e.showTime) {
              if (typeof N == "object") {
                return Tt($, Array.isArray(b) ? b[0] : b, N.defaultValue || S);
              } else if (p) {
                return Tt($, Array.isArray(b) ? b[0] : b, p);
              } else {
                return Tt($, Array.isArray(b) ? b[0] : b, S);
              }
            } else {
              return b;
            }
          } else {
            return S;
          }
        }
      });
      const O = b => {
        D(b);
        if (e.onPickerValueChange) {
          e.onPickerValueChange(b);
        }
      };
      const E = b => {
        const $ = ko[e.picker];
        if ($) {
          return $(b);
        } else {
          return b;
        }
      };
      const [q, U] = He(() => e.picker === "time" ? "time" : E("date"), {
        value: de(e, "mode")
      });
      pe(() => e.picker, () => {
        U(e.picker);
      });
      const L = z(q.value);
      const A = b => {
        L.value = b;
      };
      const T = (b, $) => {
        const {
          onPanelChange: N,
          generateConfig: p
        } = e;
        const S = E(b || q.value);
        A(q.value);
        U(S);
        if (N && (q.value !== S || gt(p, k.value, k.value))) {
          N($, S);
        }
      };
      const B = function (b, $, N = false) {
        const {
          picker: p,
          generateConfig: S,
          onSelect: V,
          onChange: _,
          disabledDate: Q
        } = e;
        if (q.value === p || N) {
          g(b);
          if (V) {
            V(b);
          }
          if (s) {
            s(b, $);
          }
          if (_ && !gt(S, b, w.value) && (Q == null || !Q(b))) {
            _(b);
          }
        }
      };
      const X = b => d.value && d.value.onKeydown ? ([ce.LEFT, ce.RIGHT, ce.UP, ce.DOWN, ce.PAGE_UP, ce.PAGE_DOWN, ce.ENTER].includes(b.which) && b.preventDefault(), d.value.onKeydown(b)) : false;
      const I = b => {
        if (d.value && d.value.onBlur) {
          d.value.onBlur(b);
        }
      };
      const P = () => {
        const {
          generateConfig: b,
          hourStep: $,
          minuteStep: N,
          secondStep: p
        } = e;
        const S = b.getNow();
        const V = go(b.getHour(S), b.getMinute(S), b.getSecond(S), r.value ? $ : 1, l.value ? N : 1, o.value ? p : 1);
        const _ = Ea(b, S, V[0], V[1], V[2]);
        B(_, "submit");
      };
      const x = F(() => {
        const {
          prefixCls: b,
          direction: $
        } = e;
        return ue(`${b}-panel`, {
          [`${b}-panel-has-range`]: y && y.value && y.value[0] && y.value[1],
          [`${b}-panel-has-range-hover`]: C && C.value && C.value[0] && C.value[1],
          [`${b}-panel-rtl`]: $ === "rtl"
        });
      });
      bn(Y(Y({}, i), {
        mode: q,
        hideHeader: F(() => {
          if (e.hideHeader !== undefined) {
            return e.hideHeader;
          } else {
            return i.hideHeader?.value;
          }
        }),
        hidePrevBtn: F(() => f.value && h.value === "right"),
        hideNextBtn: F(() => f.value && h.value === "left")
      }));
      pe(() => e.value, () => {
        if (e.value) {
          D(e.value);
        }
      });
      return () => {
        const {
          prefixCls: b = "ant-picker",
          locale: $,
          generateConfig: N,
          disabledDate: p,
          picker: S = "date",
          tabindex: V = 0,
          showNow: _,
          showTime: Q,
          showToday: ee,
          renderExtraFooter: ie,
          onMousedown: oe,
          onOk: j,
          components: ne
        } = e;
        if (u && h.value !== "right") {
          u.value = {
            onKeydown: X,
            onClose: () => {
              if (d.value && d.value.onClose) {
                d.value.onClose();
              }
            }
          };
        }
        let G;
        const Z = Y(Y(Y({}, n), e), {
          operationRef: d,
          prefixCls: b,
          viewDate: k.value,
          value: w.value,
          onViewDateChange: O,
          sourceMode: L.value,
          onPanelChange: T,
          disabledDate: p
        });
        delete Z.onChange;
        delete Z.onSelect;
        switch (q.value) {
          case "decade":
            G = m(Cn, R(R({}, Z), {}, {
              onSelect: (K, te) => {
                O(K);
                B(K, te);
              }
            }), null);
            break;
          case "year":
            G = m(En, R(R({}, Z), {}, {
              onSelect: (K, te) => {
                O(K);
                B(K, te);
              }
            }), null);
            break;
          case "month":
            G = m(On, R(R({}, Z), {}, {
              onSelect: (K, te) => {
                O(K);
                B(K, te);
              }
            }), null);
            break;
          case "quarter":
            G = m(Tn, R(R({}, Z), {}, {
              onSelect: (K, te) => {
                O(K);
                B(K, te);
              }
            }), null);
            break;
          case "week":
            G = m(Dn, R(R({}, Z), {}, {
              onSelect: (K, te) => {
                O(K);
                B(K, te);
              }
            }), null);
            break;
          case "time":
            delete Z.showTime;
            G = m(_t, R(R(R({}, Z), typeof Q == "object" ? Q : null), {}, {
              onSelect: (K, te) => {
                O(K);
                B(K, te);
              }
            }), null);
            break;
          default:
            if (Q) {
              G = m(Sn, R(R({}, Z), {}, {
                onSelect: (K, te) => {
                  O(K);
                  B(K, te);
                }
              }), null);
            } else {
              G = m(xt, R(R({}, Z), {}, {
                onSelect: (K, te) => {
                  O(K);
                  B(K, te);
                }
              }), null);
            }
        }
        let se;
        let re;
        if (v == null || !v.value) {
          se = qa(b, q.value, ie);
          re = Ka({
            prefixCls: b,
            components: ne,
            needConfirmButton: a.value,
            okDisabled: !w.value || p && p(w.value),
            locale: $,
            showNow: _,
            onNow: a.value && P,
            onOk: () => {
              if (w.value) {
                B(w.value, "submit", true);
                if (j) {
                  j(w.value);
                }
              }
            }
          });
        }
        let he;
        if (ee && q.value === "date" && S === "date" && !Q) {
          const K = N.getNow();
          const te = `${b}-today-btn`;
          const $e = p && p(K);
          he = m("a", {
            class: ue(te, $e && `${te}-disabled`),
            "aria-disabled": $e,
            onClick: () => {
              if (!$e) {
                B(K, "mouse", true);
              }
            }
          }, [$.today]);
        }
        return m("div", {
          tabindex: V,
          class: ue(x.value, n.class),
          style: n.style,
          onKeydown: X,
          onBlur: I,
          onMousedown: oe
        }, [G, se || re || he ? m("div", {
          class: `${b}-footer`
        }, [se, re, he]) : null]);
      };
    }
  });
}
const Ho = Vo();
const Qa = e => m(Ho, e);
const Ao = {
  bottomLeft: {
    points: ["tl", "bl"],
    offset: [0, 4],
    overflow: {
      adjustX: 1,
      adjustY: 1
    }
  },
  bottomRight: {
    points: ["tr", "br"],
    offset: [0, 4],
    overflow: {
      adjustX: 1,
      adjustY: 1
    }
  },
  topLeft: {
    points: ["bl", "tl"],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    }
  },
  topRight: {
    points: ["br", "tr"],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    }
  }
};
function Ga(e, t) {
  let {
    slots: n
  } = t;
  const {
    prefixCls: a,
    popupStyle: r,
    visible: l,
    dropdownClassName: o,
    dropdownAlign: i,
    transitionName: u,
    getPopupContainer: s,
    range: v,
    popupPlacement: c,
    direction: f
  } = fe(e);
  const h = `${a}-dropdown`;
  return m(Mr, {
    showAction: [],
    hideAction: [],
    popupPlacement: c !== undefined ? c : f === "rtl" ? "bottomRight" : "bottomLeft",
    builtinPlacements: Ao,
    prefixCls: h,
    popupTransitionName: u,
    popupAlign: i,
    popupVisible: l,
    popupClassName: ue(o, {
      [`${h}-range`]: v,
      [`${h}-rtl`]: f === "rtl"
    }),
    popupStyle: r,
    getPopupContainer: s
  }, {
    default: n.default,
    popup: n.popupElement
  });
}
const Xa = Qe({
  name: "PresetPanel",
  props: {
    prefixCls: String,
    presets: {
      type: Array,
      default: () => []
    },
    onClick: Function,
    onHover: Function
  },
  setup(e) {
    return () => e.presets.length ? m("div", {
      class: `${e.prefixCls}-presets`
    }, [m("ul", null, [e.presets.map((t, n) => {
      let {
        label: a,
        value: r
      } = t;
      return m("li", {
        key: n,
        onClick: l => {
          l.stopPropagation();
          e.onClick(r);
        },
        onMouseenter: () => {
          var l;
          if ((l = e.onHover) !== null && l !== undefined) {
            l.call(e, r);
          }
        },
        onMouseleave: () => {
          var l;
          if ((l = e.onHover) !== null && l !== undefined) {
            l.call(e, null);
          }
        }
      }, [a]);
    })])]) : null;
  }
});
function vn(e) {
  let {
    open: t,
    value: n,
    isClickOutside: a,
    triggerOpen: r,
    forwardKeydown: l,
    onKeydown: o,
    blurToCancel: i,
    onSubmit: u,
    onCancel: s,
    onFocus: v,
    onBlur: c
  } = e;
  const f = Ve(false);
  const h = Ve(false);
  const y = Ve(false);
  const C = Ve(false);
  const d = Ve(false);
  const w = F(() => ({
    onMousedown: () => {
      f.value = true;
      r(true);
    },
    onKeydown: k => {
      o(k, () => {
        d.value = true;
      });
      if (!d.value) {
        switch (k.which) {
          case ce.ENTER:
            {
              if (t.value) {
                if (u() !== false) {
                  f.value = true;
                }
              } else {
                r(true);
              }
              k.preventDefault();
              return;
            }
          case ce.TAB:
            {
              if (f.value && t.value && !k.shiftKey) {
                f.value = false;
                k.preventDefault();
              } else if (!f.value && t.value && !l(k) && k.shiftKey) {
                f.value = true;
                k.preventDefault();
              }
              return;
            }
          case ce.ESC:
            {
              f.value = true;
              s();
              return;
            }
        }
        if (!t.value && ![ce.SHIFT].includes(k.which)) {
          r(true);
        } else if (!f.value) {
          l(k);
        }
      }
    },
    onFocus: k => {
      f.value = true;
      h.value = true;
      if (v) {
        v(k);
      }
    },
    onBlur: k => {
      if (y.value || !a(document.activeElement)) {
        y.value = false;
        return;
      }
      if (i.value) {
        setTimeout(() => {
          let {
            activeElement: D
          } = document;
          while (D && D.shadowRoot) {
            D = D.shadowRoot.activeElement;
          }
          if (a(D)) {
            s();
          }
        }, 0);
      } else if (t.value) {
        r(false);
        if (C.value) {
          u();
        }
      }
      h.value = false;
      if (c) {
        c(k);
      }
    }
  }));
  pe(t, () => {
    C.value = false;
  });
  pe(n, () => {
    C.value = true;
  });
  const g = Ve();
  ha(() => {
    g.value = mo(k => {
      const D = bo(k);
      if (t.value) {
        const O = a(D);
        if (O) {
          if (!h.value || O) {
            r(false);
          }
        } else {
          y.value = true;
          Ke(() => {
            y.value = false;
          });
        }
      }
    });
  });
  hn(() => {
    if (g.value) {
      g.value();
    }
  });
  return [w, {
    focused: h,
    typing: f
  }];
}
function gn(e) {
  let {
    valueTexts: t,
    onTextChange: n
  } = e;
  const a = z("");
  function r(o) {
    a.value = o;
    n(o);
  }
  function l() {
    a.value = t.value[0];
  }
  pe(() => [...t.value], function (o, i = []) {
    if (o.join("||") !== i.join("||") && t.value.every(u => u !== a.value)) {
      l();
    }
  }, {
    immediate: true
  });
  return [a, r, l];
}
function Vt(e, t) {
  let {
    formatList: n,
    generateConfig: a,
    locale: r
  } = t;
  const l = Or(() => {
    if (!e.value) {
      return [[""], ""];
    }
    let u = "";
    const s = [];
    for (let v = 0; v < n.value.length; v += 1) {
      const c = n.value[v];
      const f = we(e.value, {
        generateConfig: a.value,
        locale: r.value,
        format: c
      });
      s.push(f);
      if (v === 0) {
        u = f;
      }
    }
    return [s, u];
  }, [e, n], (u, s) => s[0] !== u[0] || !Qr(s[1], u[1]));
  const o = F(() => l.value[0]);
  const i = F(() => l.value[1]);
  return [o, i];
}
function pn(e, t) {
  let {
    formatList: n,
    generateConfig: a,
    locale: r
  } = t;
  const l = z(null);
  let o;
  function i(c, f = false) {
    Ke.cancel(o);
    if (f) {
      l.value = c;
      return;
    }
    o = Ke(() => {
      l.value = c;
    });
  }
  const [, u] = Vt(l, {
    formatList: n,
    generateConfig: a,
    locale: r
  });
  function s(c) {
    i(c);
  }
  function v(c = false) {
    i(null, c);
  }
  pe(e, () => {
    v(true);
  });
  hn(() => {
    Ke.cancel(o);
  });
  return [u, s, v];
}
function Za(e, t) {
  return F(() => e != null && e.value ? e.value : t != null && t.value ? (Rr(false, "`ranges` is deprecated. Please use `presets` instead."), Object.keys(t.value).map(a => {
    const r = t.value[a];
    const l = typeof r == "function" ? r() : r;
    return {
      label: a,
      value: l
    };
  })) : []);
}
function _o() {
  return Qe({
    name: "Picker",
    inheritAttrs: false,
    props: ["prefixCls", "id", "tabindex", "dropdownClassName", "dropdownAlign", "popupStyle", "transitionName", "generateConfig", "locale", "inputReadOnly", "allowClear", "autofocus", "showTime", "showNow", "showHour", "showMinute", "showSecond", "picker", "format", "use12Hours", "value", "defaultValue", "open", "defaultOpen", "defaultOpenValue", "suffixIcon", "presets", "clearIcon", "disabled", "disabledDate", "placeholder", "getPopupContainer", "panelRender", "inputRender", "onChange", "onOpenChange", "onPanelChange", "onFocus", "onBlur", "onMousedown", "onMouseup", "onMouseenter", "onMouseleave", "onContextmenu", "onClick", "onKeydown", "onSelect", "direction", "autocomplete", "showToday", "renderExtraFooter", "dateRender", "minuteStep", "hourStep", "secondStep", "hideDisabledOptions"],
    setup(e, t) {
      let {
        attrs: n,
        expose: a
      } = t;
      const r = z(null);
      const l = F(() => e.presets);
      const o = Za(l);
      const i = F(() => {
        return e.picker ?? "date";
      });
      const u = F(() => i.value === "date" && !!e.showTime || i.value === "time");
      const s = F(() => La(Va(e.format, i.value, e.showTime, e.use12Hours)));
      const v = z(null);
      const c = z(null);
      const f = z(null);
      const [h, y] = He(null, {
        value: de(e, "value"),
        defaultValue: e.defaultValue
      });
      const C = z(h.value);
      const d = p => {
        C.value = p;
      };
      const w = z(null);
      const [g, k] = He(false, {
        value: de(e, "open"),
        defaultValue: e.defaultOpen,
        postState: p => e.disabled ? false : p,
        onChange: p => {
          if (e.onOpenChange) {
            e.onOpenChange(p);
          }
          if (!p && w.value && w.value.onClose) {
            w.value.onClose();
          }
        }
      });
      const [D, O] = Vt(C, {
        formatList: s,
        generateConfig: de(e, "generateConfig"),
        locale: de(e, "locale")
      });
      const [E, q, U] = gn({
        valueTexts: D,
        onTextChange: p => {
          const S = Wa(p, {
            locale: e.locale,
            formatList: s.value,
            generateConfig: e.generateConfig
          });
          if (S && (!e.disabledDate || !e.disabledDate(S))) {
            d(S);
          }
        }
      });
      const L = p => {
        const {
          onChange: S,
          generateConfig: V,
          locale: _
        } = e;
        d(p);
        y(p);
        if (S && !gt(V, h.value, p)) {
          S(p, p ? we(p, {
            generateConfig: V,
            locale: _,
            format: s.value[0]
          }) : "");
        }
      };
      const A = p => {
        if (!e.disabled || !p) {
          k(p);
        }
      };
      const T = p => g.value && w.value && w.value.onKeydown ? w.value.onKeydown(p) : false;
      const B = function () {
        if (e.onMouseup) {
          e.onMouseup(...arguments);
        }
        if (r.value) {
          r.value.focus();
          A(true);
        }
      };
      const [X, {
        focused: I,
        typing: P
      }] = vn({
        blurToCancel: u,
        open: g,
        value: E,
        triggerOpen: A,
        forwardKeydown: T,
        isClickOutside: p => !Aa([v.value, c.value, f.value], p),
        onSubmit: () => !C.value || e.disabledDate && e.disabledDate(C.value) ? false : (L(C.value), A(false), U(), true),
        onCancel: () => {
          A(false);
          d(h.value);
          U();
        },
        onKeydown: (p, S) => {
          var V;
          if ((V = e.onKeydown) !== null && V !== undefined) {
            V.call(e, p, S);
          }
        },
        onFocus: p => {
          var S;
          if ((S = e.onFocus) !== null && S !== undefined) {
            S.call(e, p);
          }
        },
        onBlur: p => {
          var S;
          if ((S = e.onBlur) !== null && S !== undefined) {
            S.call(e, p);
          }
        }
      });
      pe([g, D], () => {
        if (!g.value) {
          d(h.value);
          if (!D.value.length || D.value[0] === "") {
            q("");
          } else if (O.value !== E.value) {
            U();
          }
        }
      });
      pe(i, () => {
        if (!g.value) {
          U();
        }
      });
      pe(h, () => {
        d(h.value);
      });
      const [x, b, $] = pn(E, {
        formatList: s,
        generateConfig: de(e, "generateConfig"),
        locale: de(e, "locale")
      });
      const N = (p, S) => {
        if (S === "submit" || S !== "key" && !u.value) {
          L(p);
          A(false);
        }
      };
      bn({
        operationRef: w,
        hideHeader: F(() => i.value === "time"),
        onSelect: N,
        open: g,
        defaultOpenValue: de(e, "defaultOpenValue"),
        onDateMouseenter: b,
        onDateMouseleave: $
      });
      a({
        focus: () => {
          if (r.value) {
            r.value.focus();
          }
        },
        blur: () => {
          if (r.value) {
            r.value.blur();
          }
        }
      });
      return () => {
        const {
          prefixCls: p = "rc-picker",
          id: S,
          tabindex: V,
          dropdownClassName: _,
          dropdownAlign: Q,
          popupStyle: ee,
          transitionName: ie,
          generateConfig: oe,
          locale: j,
          inputReadOnly: ne,
          allowClear: G,
          autofocus: Z,
          picker: se = "date",
          defaultOpenValue: re,
          suffixIcon: he,
          clearIcon: K,
          disabled: te,
          placeholder: $e,
          getPopupContainer: ye,
          panelRender: Me,
          onMousedown: _e,
          onMouseenter: Se,
          onMouseleave: Be,
          onContextmenu: We,
          onClick: Oe,
          onSelect: me,
          direction: Te,
          autocomplete: ft = "off"
        } = e;
        const lt = Y(Y(Y({}, e), n), {
          class: ue({
            [`${p}-panel-focused`]: !P.value
          }),
          style: undefined,
          pickerValue: undefined,
          onPickerValueChange: undefined,
          onChange: null
        });
        let De = m("div", {
          class: `${p}-panel-layout`
        }, [m(Xa, {
          prefixCls: p,
          presets: o.value,
          onClick: ve => {
            L(ve);
            A(false);
          }
        }, null), m(Qa, R(R({}, lt), {}, {
          generateConfig: oe,
          value: C.value,
          locale: j,
          tabindex: -1,
          onSelect: ve => {
            if (me != null) {
              me(ve);
            }
            d(ve);
          },
          direction: Te,
          onPanelChange: (ve, zt) => {
            const {
              onPanelChange: ht
            } = e;
            $(true);
            if (ht != null) {
              ht(ve, zt);
            }
          }
        }), null)]);
        if (Me) {
          De = Me(De);
        }
        const Fe = m("div", {
          class: `${p}-panel-container`,
          ref: v,
          onMousedown: ve => {
            ve.preventDefault();
          }
        }, [De]);
        let Ie;
        if (he) {
          Ie = m("span", {
            class: `${p}-suffix`
          }, [he]);
        }
        let Pe;
        if (G && h.value && !te) {
          Pe = m("span", {
            onMousedown: ve => {
              ve.preventDefault();
              ve.stopPropagation();
            },
            onMouseup: ve => {
              ve.preventDefault();
              ve.stopPropagation();
              L(null);
              A(false);
            },
            class: `${p}-clear`,
            role: "button"
          }, [K || m("span", {
            class: `${p}-clear-btn`
          }, null)]);
        }
        const Ge = Y(Y(Y(Y({
          id: S,
          tabindex: V,
          disabled: te,
          readonly: ne || typeof s.value[0] == "function" || !P.value,
          value: x.value || E.value,
          onInput: ve => {
            q(ve.target.value);
          },
          autofocus: Z,
          placeholder: $e,
          ref: r,
          title: E.value
        }, X.value), {
          size: Ha(se, s.value[0], oe)
        }), ja(e)), {
          autocomplete: ft
        });
        const St = e.inputRender ? e.inputRender(Ge) : m("input", Ge, null);
        const jt = Te === "rtl" ? "bottomRight" : "bottomLeft";
        return m("div", {
          ref: f,
          class: ue(p, n.class, {
            [`${p}-disabled`]: te,
            [`${p}-focused`]: I.value,
            [`${p}-rtl`]: Te === "rtl"
          }),
          style: n.style,
          onMousedown: _e,
          onMouseup: B,
          onMouseenter: Se,
          onMouseleave: Be,
          onContextmenu: We,
          onClick: Oe
        }, [m("div", {
          class: ue(`${p}-input`, {
            [`${p}-input-placeholder`]: !!x.value
          }),
          ref: c
        }, [St, Ie, Pe]), m(Ga, {
          visible: g.value,
          popupStyle: ee,
          prefixCls: p,
          dropdownClassName: _,
          dropdownAlign: Q,
          getPopupContainer: ye,
          transitionName: ie,
          popupPlacement: jt,
          direction: Te
        }, {
          default: () => [m("div", {
            style: {
              pointerEvents: "none",
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0
            }
          }, null)],
          popupElement: () => Fe
        })]);
      };
    }
  });
}
const Bo = _o();
function Wo(e, t) {
  let {
    picker: n,
    locale: a,
    selectedValue: r,
    disabledDate: l,
    disabled: o,
    generateConfig: i
  } = e;
  const u = F(() => J(r.value, 0));
  const s = F(() => J(r.value, 1));
  function v(C) {
    return i.value.locale.getWeekFirstDate(a.value.locale, C);
  }
  function c(C) {
    const d = i.value.getYear(C);
    const w = i.value.getMonth(C);
    return d * 100 + w;
  }
  function f(C) {
    const d = i.value.getYear(C);
    const w = cn(i.value, C);
    return d * 10 + w;
  }
  return [C => {
    var d;
    if (l && (d = l == null ? undefined : l.value) !== null && d !== undefined && d.call(l, C)) {
      return true;
    }
    if (o[1] && s) {
      return !qe(i.value, C, s.value) && i.value.isAfter(C, s.value);
    }
    if (t.value[1] && s.value) {
      switch (n.value) {
        case "quarter":
          return f(C) > f(s.value);
        case "month":
          return c(C) > c(s.value);
        case "week":
          return v(C) > v(s.value);
        default:
          return !qe(i.value, C, s.value) && i.value.isAfter(C, s.value);
      }
    }
    return false;
  }, C => {
    var d;
    if ((d = l.value) !== null && d !== undefined && d.call(l, C)) {
      return true;
    }
    if (o[0] && u) {
      return !qe(i.value, C, s.value) && i.value.isAfter(u.value, C);
    }
    if (t.value[0] && u.value) {
      switch (n.value) {
        case "quarter":
          return f(C) < f(u.value);
        case "month":
          return c(C) < c(u.value);
        case "week":
          return v(C) < v(u.value);
        default:
          return !qe(i.value, C, u.value) && i.value.isAfter(u.value, C);
      }
    }
    return false;
  }];
}
function Fo(e, t, n, a) {
  const r = yt(e, n, a, 1);
  function l(o) {
    if (o(e, t)) {
      return "same";
    } else if (o(r, t)) {
      return "closing";
    } else {
      return "far";
    }
  }
  switch (n) {
    case "year":
      return l((o, i) => xo(a, o, i));
    case "quarter":
    case "month":
      return l((o, i) => At(a, o, i));
    default:
      return l((o, i) => yn(a, o, i));
  }
}
function Lo(e, t, n, a) {
  const r = J(e, 0);
  const l = J(e, 1);
  if (t === 0) {
    return r;
  }
  if (r && l) {
    switch (Fo(r, l, n, a)) {
      case "same":
        return r;
      case "closing":
        return r;
      default:
        return yt(l, n, a, -1);
    }
  }
  return r;
}
function jo(e) {
  let {
    values: t,
    picker: n,
    defaultDates: a,
    generateConfig: r
  } = e;
  const l = z([J(a, 0), J(a, 1)]);
  const o = z(null);
  const i = F(() => J(t.value, 0));
  const u = F(() => J(t.value, 1));
  const s = h => l.value[h] ? l.value[h] : J(o.value, h) || Lo(t.value, h, n.value, r.value) || i.value || u.value || r.value.getNow();
  const v = z(null);
  const c = z(null);
  pa(() => {
    v.value = s(0);
    c.value = s(1);
  });
  function f(h, y) {
    if (h) {
      let C = Ne(o.value, h, y);
      l.value = Ne(l.value, null, y) || [null, null];
      const d = (y + 1) % 2;
      if (!J(t.value, d)) {
        C = Ne(C, h, d);
      }
      o.value = C;
    } else if (i.value || u.value) {
      o.value = null;
    }
  }
  return [v, c, f];
}
function zo(e) {
  if (Nr()) {
    Tr(e);
    return true;
  } else {
    return false;
  }
}
function Uo(e) {
  if (typeof e == "function") {
    return e();
  } else {
    return Ir(e);
  }
}
function Ja(e) {
  const n = Uo(e);
  return (n == null ? undefined : n.$el) ?? n;
}
function qo(e, t = true) {
  if (Yr()) {
    ha(e);
  } else if (t) {
    e();
  } else {
    ga(e);
  }
}
function Ko(e, t = false) {
  const n = Ve();
  const a = () => n.value = !!e();
  a();
  qo(a, t);
  return n;
}
var nn;
const er = typeof window !== "undefined";
if (er && (nn = window == null ? undefined : window.navigator) !== null && nn !== undefined && nn.userAgent) {
  /iP(ad|hone|od)/.test(window.navigator.userAgent);
}
const Qo = er ? window : undefined;
function Go(e, t) {
  var n = {};
  for (var a in e) {
    if (Object.prototype.hasOwnProperty.call(e, a) && t.indexOf(a) < 0) {
      n[a] = e[a];
    }
  }
  if (e != null && typeof Object.getOwnPropertySymbols == "function") {
    for (var r = 0, a = Object.getOwnPropertySymbols(e); r < a.length; r++) {
      if (t.indexOf(a[r]) < 0 && Object.prototype.propertyIsEnumerable.call(e, a[r])) {
        n[a[r]] = e[a[r]];
      }
    }
  }
  return n;
}
function Xo(e, t, n = {}) {
  const {
    window: a = Qo
  } = n;
  const r = Go(n, ["window"]);
  let l;
  const o = Ko(() => a && "ResizeObserver" in a);
  const i = () => {
    if (l) {
      l.disconnect();
      l = undefined;
    }
  };
  const u = pe(() => Ja(e), v => {
    i();
    if (o.value && a && v) {
      l = new ResizeObserver(t);
      l.observe(v, r);
    }
  }, {
    immediate: true,
    flush: "post"
  });
  const s = () => {
    i();
    u();
  };
  zo(s);
  return {
    isSupported: o,
    stop: s
  };
}
function Ct(e, t = {
  width: 0,
  height: 0
}, n = {}) {
  const {
    box: a = "content-box"
  } = n;
  const r = Ve(t.width);
  const l = Ve(t.height);
  Xo(e, o => {
    let [i] = o;
    const u = a === "border-box" ? i.borderBoxSize : a === "content-box" ? i.contentBoxSize : i.devicePixelContentBoxSize;
    if (u) {
      r.value = u.reduce((s, v) => {
        let {
          inlineSize: c
        } = v;
        return s + c;
      }, 0);
      l.value = u.reduce((s, v) => {
        let {
          blockSize: c
        } = v;
        return s + c;
      }, 0);
    } else {
      r.value = i.contentRect.width;
      l.value = i.contentRect.height;
    }
  }, n);
  pe(() => Ja(e), o => {
    r.value = o ? t.width : 0;
    l.value = o ? t.height : 0;
  });
  return {
    width: r,
    height: l
  };
}
function la(e, t) {
  if (e && e[0] && e[1] && t.isAfter(e[0], e[1])) {
    return [e[1], e[0]];
  } else {
    return e;
  }
}
function ia(e, t, n, a) {
  return !!e || !!a && !!a[t] || !!n[(t + 1) % 2];
}
function Zo() {
  return Qe({
    name: "RangerPicker",
    inheritAttrs: false,
    props: ["prefixCls", "id", "popupStyle", "dropdownClassName", "transitionName", "dropdownAlign", "getPopupContainer", "generateConfig", "locale", "placeholder", "autofocus", "disabled", "format", "picker", "showTime", "showNow", "showHour", "showMinute", "showSecond", "use12Hours", "separator", "value", "defaultValue", "defaultPickerValue", "open", "defaultOpen", "disabledDate", "disabledTime", "dateRender", "panelRender", "ranges", "allowEmpty", "allowClear", "suffixIcon", "clearIcon", "pickerRef", "inputReadOnly", "mode", "renderExtraFooter", "onChange", "onOpenChange", "onPanelChange", "onCalendarChange", "onFocus", "onBlur", "onMousedown", "onMouseup", "onMouseenter", "onMouseleave", "onClick", "onOk", "onKeydown", "components", "order", "direction", "activePickerIndex", "autocomplete", "minuteStep", "hourStep", "secondStep", "hideDisabledOptions", "disabledMinutes", "presets", "prevIcon", "nextIcon", "superPrevIcon", "superNextIcon"],
    setup(e, t) {
      let {
        attrs: n,
        expose: a
      } = t;
      const r = F(() => e.picker === "date" && !!e.showTime || e.picker === "time");
      const l = F(() => e.presets);
      const o = F(() => e.ranges);
      const i = Za(l, o);
      const u = z({});
      const s = z(null);
      const v = z(null);
      const c = z(null);
      const f = z(null);
      const h = z(null);
      const y = z(null);
      const C = z(null);
      const d = z(null);
      const w = F(() => La(Va(e.format, e.picker, e.showTime, e.use12Hours)));
      const [g, k] = He(0, {
        value: de(e, "activePickerIndex")
      });
      const D = z(null);
      const O = F(() => {
        const {
          disabled: M
        } = e;
        if (Array.isArray(M)) {
          return M;
        } else {
          return [M || false, M || false];
        }
      });
      const [E, q] = He(null, {
        value: de(e, "value"),
        defaultValue: e.defaultValue,
        postState: M => e.picker === "time" && !e.order ? M : la(M, e.generateConfig)
      });
      const [U, L, A] = jo({
        values: E,
        picker: de(e, "picker"),
        defaultDates: e.defaultPickerValue,
        generateConfig: de(e, "generateConfig")
      });
      const [T, B] = He(E.value, {
        postState: M => {
          let W = M;
          if (O.value[0] && O.value[1]) {
            return W;
          }
          for (let H = 0; H < 2; H += 1) {
            if (O.value[H] && !J(W, H) && !J(e.allowEmpty, H)) {
              W = Ne(W, e.generateConfig.getNow(), H);
            }
          }
          return W;
        }
      });
      const [X, I] = He([e.picker, e.picker], {
        value: de(e, "mode")
      });
      pe(() => e.picker, () => {
        I([e.picker, e.picker]);
      });
      const P = (M, W) => {
        var H;
        I(M);
        if ((H = e.onPanelChange) !== null && H !== undefined) {
          H.call(e, W, M);
        }
      };
      const [x, b] = Wo({
        picker: de(e, "picker"),
        selectedValue: T,
        locale: de(e, "locale"),
        disabled: O,
        disabledDate: de(e, "disabledDate"),
        generateConfig: de(e, "generateConfig")
      }, u);
      const [$, N] = He(false, {
        value: de(e, "open"),
        defaultValue: e.defaultOpen,
        postState: M => O.value[g.value] ? false : M,
        onChange: M => {
          var W;
          if ((W = e.onOpenChange) !== null && W !== undefined) {
            W.call(e, M);
          }
          if (!M && D.value && D.value.onClose) {
            D.value.onClose();
          }
        }
      });
      const p = F(() => $.value && g.value === 0);
      const S = F(() => $.value && g.value === 1);
      const V = z(0);
      const _ = z(0);
      const Q = z(0);
      const {
        width: ee
      } = Ct(s);
      pe([$, ee], () => {
        if (!$.value && s.value) {
          Q.value = ee.value;
        }
      });
      const {
        width: ie
      } = Ct(v);
      const {
        width: oe
      } = Ct(d);
      const {
        width: j
      } = Ct(c);
      const {
        width: ne
      } = Ct(h);
      pe([g, $, ie, oe, j, ne, () => e.direction], () => {
        _.value = 0;
        if (g.value) {
          if (c.value && h.value) {
            _.value = j.value + ne.value;
            if (ie.value && oe.value && _.value > ie.value - oe.value - (e.direction === "rtl" || d.value.offsetLeft > _.value ? 0 : d.value.offsetLeft)) {
              V.value = _.value;
            }
          }
        } else if (g.value === 0) {
          V.value = 0;
        }
      }, {
        immediate: true
      });
      const G = z();
      function Z(M, W) {
        if (M) {
          clearTimeout(G.value);
          u.value[W] = true;
          k(W);
          N(M);
          if (!$.value) {
            A(null, W);
          }
        } else if (g.value === W) {
          N(M);
          const H = u.value;
          G.value = setTimeout(() => {
            if (H === u.value) {
              u.value = {};
            }
          });
        }
      }
      function se(M) {
        Z(true, M);
        setTimeout(() => {
          const W = [y, C][M];
          if (W.value) {
            W.value.focus();
          }
        }, 0);
      }
      function re(M, W) {
        let H = M;
        let le = J(H, 0);
        let Ce = J(H, 1);
        const {
          generateConfig: ke,
          locale: Xe,
          picker: Re,
          order: mt,
          onCalendarChange: Ze,
          allowEmpty: it,
          onChange: be,
          showTime: Le
        } = e;
        if (le && Ce && ke.isAfter(le, Ce)) {
          if (Re === "week" && !Ba(ke, Xe.locale, le, Ce) || Re === "quarter" && !_a(ke, le, Ce) || Re !== "week" && Re !== "quarter" && Re !== "time" && !(Le ? gt(ke, le, Ce) : qe(ke, le, Ce))) {
            if (W === 0) {
              H = [le, null];
              Ce = null;
            } else {
              le = null;
              H = [null, Ce];
            }
            u.value = {
              [W]: true
            };
          } else if (Re !== "time" || mt !== false) {
            H = la(H, ke);
          }
        }
        B(H);
        const Ee = H && H[0] ? we(H[0], {
          generateConfig: ke,
          locale: Xe,
          format: w.value[0]
        }) : "";
        const bt = H && H[1] ? we(H[1], {
          generateConfig: ke,
          locale: Xe,
          format: w.value[0]
        }) : "";
        if (Ze) {
          Ze(H, [Ee, bt], {
            range: W === 0 ? "start" : "end"
          });
        }
        const Dt = ia(le, 0, O.value, it);
        const qt = ia(Ce, 1, O.value, it);
        if (H === null || Dt && qt) {
          q(H);
          if (be && (!gt(ke, J(E.value, 0), le) || !gt(ke, J(E.value, 1), Ce))) {
            be(H, [Ee, bt]);
          }
        }
        let je = null;
        if (W === 0 && !O.value[1]) {
          je = 1;
        } else if (W === 1 && !O.value[0]) {
          je = 0;
        }
        if (je !== null && je !== g.value && (!u.value[je] || !J(H, je)) && J(H, W)) {
          se(je);
        } else {
          Z(false, W);
        }
      }
      const he = M => $ && D.value && D.value.onKeydown ? D.value.onKeydown(M) : false;
      const K = {
        formatList: w,
        generateConfig: de(e, "generateConfig"),
        locale: de(e, "locale")
      };
      const [te, $e] = Vt(F(() => J(T.value, 0)), K);
      const [ye, Me] = Vt(F(() => J(T.value, 1)), K);
      const _e = (M, W) => {
        const H = Wa(M, {
          locale: e.locale,
          formatList: w.value,
          generateConfig: e.generateConfig
        });
        if (H && !(W === 0 ? x : b)(H)) {
          B(Ne(T.value, H, W));
          A(H, W);
        }
      };
      const [Se, Be, We] = gn({
        valueTexts: te,
        onTextChange: M => _e(M, 0)
      });
      const [Oe, me, Te] = gn({
        valueTexts: ye,
        onTextChange: M => _e(M, 1)
      });
      const [ft, lt] = Gn(null);
      const [De, Fe] = Gn(null);
      const [Ie, Pe, Ge] = pn(Se, K);
      const [St, jt, ve] = pn(Oe, K);
      const zt = M => {
        Fe(Ne(T.value, M, g.value));
        if (g.value === 0) {
          Pe(M);
        } else {
          jt(M);
        }
      };
      const ht = () => {
        Fe(Ne(T.value, null, g.value));
        if (g.value === 0) {
          Ge();
        } else {
          ve();
        }
      };
      const Hn = (M, W) => ({
        forwardKeydown: he,
        onBlur: H => {
          var le;
          if ((le = e.onBlur) !== null && le !== undefined) {
            le.call(e, H);
          }
        },
        isClickOutside: H => !Aa([v.value, c.value, f.value, s.value], H),
        onFocus: H => {
          var le;
          k(M);
          if ((le = e.onFocus) !== null && le !== undefined) {
            le.call(e, H);
          }
        },
        triggerOpen: H => {
          Z(H, M);
        },
        onSubmit: () => {
          if (!T.value || e.disabledDate && e.disabledDate(T.value[M])) {
            return false;
          }
          re(T.value, M);
          W();
        },
        onCancel: () => {
          Z(false, M);
          B(E.value);
          W();
        }
      });
      const [or, {
        focused: An,
        typing: _n
      }] = vn(Y(Y({}, Hn(0, We)), {
        blurToCancel: r,
        open: p,
        value: Se,
        onKeydown: (M, W) => {
          var H;
          if ((H = e.onKeydown) !== null && H !== undefined) {
            H.call(e, M, W);
          }
        }
      }));
      const [lr, {
        focused: Bn,
        typing: Wn
      }] = vn(Y(Y({}, Hn(1, Te)), {
        blurToCancel: r,
        open: S,
        value: Oe,
        onKeydown: (M, W) => {
          var H;
          if ((H = e.onKeydown) !== null && H !== undefined) {
            H.call(e, M, W);
          }
        }
      }));
      const ir = M => {
        var W;
        if ((W = e.onClick) !== null && W !== undefined) {
          W.call(e, M);
        }
        if (!$.value && !y.value.contains(M.target) && !C.value.contains(M.target)) {
          if (O.value[0]) {
            if (!O.value[1]) {
              se(1);
            }
          } else {
            se(0);
          }
        }
      };
      const sr = M => {
        var W;
        if ((W = e.onMousedown) !== null && W !== undefined) {
          W.call(e, M);
        }
        if ($.value && (An.value || Bn.value) && !y.value.contains(M.target) && !C.value.contains(M.target)) {
          M.preventDefault();
        }
      };
      const ur = F(() => {
        var M;
        if ((M = E.value) !== null && M !== undefined && M[0]) {
          return we(E.value[0], {
            locale: e.locale,
            format: "YYYYMMDDHHmmss",
            generateConfig: e.generateConfig
          });
        } else {
          return "";
        }
      });
      const cr = F(() => {
        var M;
        if ((M = E.value) !== null && M !== undefined && M[1]) {
          return we(E.value[1], {
            locale: e.locale,
            format: "YYYYMMDDHHmmss",
            generateConfig: e.generateConfig
          });
        } else {
          return "";
        }
      });
      pe([$, te, ye], () => {
        if (!$.value) {
          B(E.value);
          if (!te.value.length || te.value[0] === "") {
            Be("");
          } else if ($e.value !== Se.value) {
            We();
          }
          if (!ye.value.length || ye.value[0] === "") {
            me("");
          } else if (Me.value !== Oe.value) {
            Te();
          }
        }
      });
      pe([ur, cr], () => {
        B(E.value);
      });
      a({
        focus: () => {
          if (y.value) {
            y.value.focus();
          }
        },
        blur: () => {
          if (y.value) {
            y.value.blur();
          }
          if (C.value) {
            C.value.blur();
          }
        }
      });
      const dr = F(() => $.value && De.value && De.value[0] && De.value[1] && e.generateConfig.isAfter(De.value[1], De.value[0]) ? De.value : null);
      function Ut(M = false, W = {}) {
        const {
          generateConfig: H,
          showTime: le,
          dateRender: Ce,
          direction: ke,
          disabledTime: Xe,
          prefixCls: Re,
          locale: mt
        } = e;
        let Ze = le;
        if (le && typeof le == "object" && le.defaultValue) {
          const be = le.defaultValue;
          Ze = Y(Y({}, le), {
            defaultValue: J(be, g.value) || undefined
          });
        }
        let it = null;
        if (Ce) {
          it = be => {
            let {
              current: Le,
              today: Ee
            } = be;
            return Ce({
              current: Le,
              today: Ee,
              info: {
                range: g.value ? "end" : "start"
              }
            });
          };
        }
        return m(No, {
          value: {
            inRange: true,
            panelPosition: M,
            rangedValue: ft.value || T.value,
            hoverRangedValue: dr.value
          }
        }, {
          default: () => [m(Qa, R(R(R({}, e), W), {}, {
            dateRender: it,
            showTime: Ze,
            mode: X.value[g.value],
            generateConfig: H,
            style: undefined,
            direction: ke,
            disabledDate: g.value === 0 ? x : b,
            disabledTime: be => Xe ? Xe(be, g.value === 0 ? "start" : "end") : false,
            class: ue({
              [`${Re}-panel-focused`]: g.value === 0 ? !_n.value : !Wn.value
            }),
            value: J(T.value, g.value),
            locale: mt,
            tabIndex: -1,
            onPanelChange: (be, Le) => {
              if (g.value === 0) {
                Ge(true);
              }
              if (g.value === 1) {
                ve(true);
              }
              P(Ne(X.value, Le, g.value), Ne(T.value, be, g.value));
              let Ee = be;
              if (M === "right" && X.value[g.value] === Le) {
                Ee = yt(Ee, Le, H, -1);
              }
              A(Ee, g.value);
            },
            onOk: null,
            onSelect: undefined,
            onChange: undefined,
            defaultValue: g.value === 0 ? J(T.value, 1) : J(T.value, 0)
          }), null)]
        });
      }
      const fr = (M, W) => {
        const H = Ne(T.value, M, g.value);
        if (W === "submit" || W !== "key" && !r.value) {
          re(H, g.value);
          if (g.value === 0) {
            Ge();
          } else {
            ve();
          }
        } else {
          B(H);
        }
      };
      bn({
        operationRef: D,
        hideHeader: F(() => e.picker === "time"),
        onDateMouseenter: zt,
        onDateMouseleave: ht,
        hideRanges: F(() => true),
        onSelect: fr,
        open: $
      });
      return () => {
        const {
          prefixCls: M = "rc-picker",
          id: W,
          popupStyle: H,
          dropdownClassName: le,
          transitionName: Ce,
          dropdownAlign: ke,
          getPopupContainer: Xe,
          generateConfig: Re,
          locale: mt,
          placeholder: Ze,
          autofocus: it,
          picker: be = "date",
          showTime: Le,
          separator: Ee = "~",
          disabledDate: bt,
          panelRender: Dt,
          allowClear: qt,
          suffixIcon: Kt,
          clearIcon: je,
          inputReadOnly: Qt,
          renderExtraFooter: vr,
          onMouseenter: gr,
          onMouseleave: pr,
          onMouseup: hr,
          onOk: Fn,
          components: mr,
          direction: wt,
          autocomplete: Ln = "off"
        } = e;
        const br = wt === "rtl" ? {
          right: `${_.value}px`
        } : {
          left: `${_.value}px`
        };
        function wr() {
          let xe;
          const Je = qa(M, X.value[g.value], vr);
          const qn = Ka({
            prefixCls: M,
            components: mr,
            needConfirmButton: r.value,
            okDisabled: !J(T.value, g.value) || bt && bt(T.value[g.value]),
            locale: mt,
            onOk: () => {
              if (J(T.value, g.value)) {
                re(T.value, g.value);
                if (Fn) {
                  Fn(T.value);
                }
              }
            }
          });
          if (be !== "time" && !Le) {
            const et = g.value === 0 ? U.value : L.value;
            const yr = yt(et, be, Re);
            const Jt = X.value[g.value] === be;
            const Kn = Ut(Jt ? "left" : false, {
              pickerValue: et,
              onPickerValueChange: en => {
                A(en, g.value);
              }
            });
            const Qn = Ut("right", {
              pickerValue: yr,
              onPickerValueChange: en => {
                A(yt(en, be, Re, -1), g.value);
              }
            });
            if (wt === "rtl") {
              xe = m(Yt, null, [Qn, Jt && Kn]);
            } else {
              xe = m(Yt, null, [Kn, Jt && Qn]);
            }
          } else {
            xe = Ut();
          }
          let Zt = m("div", {
            class: `${M}-panel-layout`
          }, [m(Xa, {
            prefixCls: M,
            presets: i.value,
            onClick: et => {
              re(et, null);
              Z(false, g.value);
            },
            onHover: et => {
              lt(et);
            }
          }, null), m("div", null, [m("div", {
            class: `${M}-panels`
          }, [xe]), (Je || qn) && m("div", {
            class: `${M}-footer`
          }, [Je, qn])])]);
          if (Dt) {
            Zt = Dt(Zt);
          }
          return m("div", {
            class: `${M}-panel-container`,
            style: {
              marginLeft: `${V.value}px`
            },
            ref: v,
            onMousedown: et => {
              et.preventDefault();
            }
          }, [Zt]);
        }
        const $r = m("div", {
          class: ue(`${M}-range-wrapper`, `${M}-${be}-range-wrapper`),
          style: {
            minWidth: `${Q.value}px`
          }
        }, [m("div", {
          ref: d,
          class: `${M}-range-arrow`,
          style: br
        }, null), wr()]);
        let jn;
        if (Kt) {
          jn = m("span", {
            class: `${M}-suffix`
          }, [Kt]);
        }
        let zn;
        if (qt && (J(E.value, 0) && !O.value[0] || J(E.value, 1) && !O.value[1])) {
          zn = m("span", {
            onMousedown: xe => {
              xe.preventDefault();
              xe.stopPropagation();
            },
            onMouseup: xe => {
              xe.preventDefault();
              xe.stopPropagation();
              let Je = E.value;
              if (!O.value[0]) {
                Je = Ne(Je, null, 0);
              }
              if (!O.value[1]) {
                Je = Ne(Je, null, 1);
              }
              re(Je, null);
              Z(false, g.value);
            },
            class: `${M}-clear`
          }, [je || m("span", {
            class: `${M}-clear-btn`
          }, null)]);
        }
        const Un = {
          size: Ha(be, w.value[0], Re)
        };
        let Gt = 0;
        let Xt = 0;
        if (c.value && f.value && h.value) {
          if (g.value === 0) {
            Xt = c.value.offsetWidth;
          } else {
            Gt = _.value;
            Xt = f.value.offsetWidth;
          }
        }
        const Cr = wt === "rtl" ? {
          right: `${Gt}px`
        } : {
          left: `${Gt}px`
        };
        return m("div", R({
          ref: s,
          class: ue(M, `${M}-range`, n.class, {
            [`${M}-disabled`]: O.value[0] && O.value[1],
            [`${M}-focused`]: g.value === 0 ? An.value : Bn.value,
            [`${M}-rtl`]: wt === "rtl"
          }),
          style: n.style,
          onClick: ir,
          onMouseenter: gr,
          onMouseleave: pr,
          onMousedown: sr,
          onMouseup: hr
        }, ja(e)), [m("div", {
          class: ue(`${M}-input`, {
            [`${M}-input-active`]: g.value === 0,
            [`${M}-input-placeholder`]: !!Ie.value
          }),
          ref: c
        }, [m("input", R(R(R({
          id: W,
          disabled: O.value[0],
          readonly: Qt || typeof w.value[0] == "function" || !_n.value,
          value: Ie.value || Se.value,
          onInput: xe => {
            Be(xe.target.value);
          },
          autofocus: it,
          placeholder: J(Ze, 0) || "",
          ref: y
        }, or.value), Un), {}, {
          autocomplete: Ln
        }), null)]), m("div", {
          class: `${M}-range-separator`,
          ref: h
        }, [Ee]), m("div", {
          class: ue(`${M}-input`, {
            [`${M}-input-active`]: g.value === 1,
            [`${M}-input-placeholder`]: !!St.value
          }),
          ref: f
        }, [m("input", R(R(R({
          disabled: O.value[1],
          readonly: Qt || typeof w.value[0] == "function" || !Wn.value,
          value: St.value || Oe.value,
          onInput: xe => {
            me(xe.target.value);
          },
          placeholder: J(Ze, 1) || "",
          ref: C
        }, lr.value), Un), {}, {
          autocomplete: Ln
        }), null)]), m("div", {
          class: `${M}-active-bar`,
          style: Y(Y({}, Cr), {
            width: `${Xt}px`,
            position: "absolute"
          })
        }, null), jn, zn, m(Ga, {
          visible: $.value,
          popupStyle: H,
          prefixCls: M,
          dropdownClassName: le,
          dropdownAlign: ke,
          getPopupContainer: Xe,
          transitionName: Ce,
          range: true,
          direction: wt
        }, {
          default: () => [m("div", {
            style: {
              pointerEvents: "none",
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0
            }
          }, null)],
          popupElement: () => $r
        })]);
      };
    }
  });
}
const Jo = Zo();
const an = (e, t, n, a) => {
  const {
    lineHeight: r
  } = e;
  const l = Math.floor(n * r) + 2;
  const o = Math.max((t - l) / 2, 0);
  const i = Math.max(t - l - o, 0);
  return {
    padding: `${o}px ${a}px ${i}px`
  };
};
const el = e => {
  const {
    componentCls: t,
    pickerCellCls: n,
    pickerCellInnerCls: a,
    pickerPanelCellHeight: r,
    motionDurationSlow: l,
    borderRadiusSM: o,
    motionDurationMid: i,
    controlItemBgHover: u,
    lineWidth: s,
    lineType: v,
    colorPrimary: c,
    controlItemBgActive: f,
    colorTextLightSolid: h,
    controlHeightSM: y,
    pickerDateHoverRangeBorderColor: C,
    pickerCellBorderGap: d,
    pickerBasicCellHoverWithRangeColor: w,
    pickerPanelCellWidth: g,
    colorTextDisabled: k,
    colorBgContainerDisabled: D
  } = e;
  return {
    "&::before": {
      position: "absolute",
      top: "50%",
      insetInlineStart: 0,
      insetInlineEnd: 0,
      zIndex: 1,
      height: r,
      transform: "translateY(-50%)",
      transition: `all ${l}`,
      content: "\"\""
    },
    [a]: {
      position: "relative",
      zIndex: 2,
      display: "inline-block",
      minWidth: r,
      height: r,
      lineHeight: `${r}px`,
      borderRadius: o,
      transition: `background ${i}, border ${i}`
    },
    [`&:hover:not(${n}-in-view),
    &:hover:not(${n}-selected):not(${n}-range-start):not(${n}-range-end):not(${n}-range-hover-start):not(${n}-range-hover-end)`]: {
      [a]: {
        background: u
      }
    },
    [`&-in-view${n}-today ${a}`]: {
      "&::before": {
        position: "absolute",
        top: 0,
        insetInlineEnd: 0,
        bottom: 0,
        insetInlineStart: 0,
        zIndex: 1,
        border: `${s}px ${v} ${c}`,
        borderRadius: o,
        content: "\"\""
      }
    },
    [`&-in-view${n}-in-range`]: {
      position: "relative",
      "&::before": {
        background: f
      }
    },
    [`&-in-view${n}-selected ${a},
      &-in-view${n}-range-start ${a},
      &-in-view${n}-range-end ${a}`]: {
      color: h,
      background: c
    },
    [`&-in-view${n}-range-start:not(${n}-range-start-single),
      &-in-view${n}-range-end:not(${n}-range-end-single)`]: {
      "&::before": {
        background: f
      }
    },
    [`&-in-view${n}-range-start::before`]: {
      insetInlineStart: "50%"
    },
    [`&-in-view${n}-range-end::before`]: {
      insetInlineEnd: "50%"
    },
    [`&-in-view${n}-range-hover-start:not(${n}-in-range):not(${n}-range-start):not(${n}-range-end),
      &-in-view${n}-range-hover-end:not(${n}-in-range):not(${n}-range-start):not(${n}-range-end),
      &-in-view${n}-range-hover-start${n}-range-start-single,
      &-in-view${n}-range-hover-start${n}-range-start${n}-range-end${n}-range-end-near-hover,
      &-in-view${n}-range-hover-end${n}-range-start${n}-range-end${n}-range-start-near-hover,
      &-in-view${n}-range-hover-end${n}-range-end-single,
      &-in-view${n}-range-hover:not(${n}-in-range)`]: {
      "&::after": {
        position: "absolute",
        top: "50%",
        zIndex: 0,
        height: y,
        borderTop: `${s}px dashed ${C}`,
        borderBottom: `${s}px dashed ${C}`,
        transform: "translateY(-50%)",
        transition: `all ${l}`,
        content: "\"\""
      }
    },
    "&-range-hover-start::after,\n      &-range-hover-end::after,\n      &-range-hover::after": {
      insetInlineEnd: 0,
      insetInlineStart: d
    },
    [`&-in-view${n}-in-range${n}-range-hover::before,
      &-in-view${n}-range-start${n}-range-hover::before,
      &-in-view${n}-range-end${n}-range-hover::before,
      &-in-view${n}-range-start:not(${n}-range-start-single)${n}-range-hover-start::before,
      &-in-view${n}-range-end:not(${n}-range-end-single)${n}-range-hover-end::before,
      ${t}-panel
      > :not(${t}-date-panel)
      &-in-view${n}-in-range${n}-range-hover-start::before,
      ${t}-panel
      > :not(${t}-date-panel)
      &-in-view${n}-in-range${n}-range-hover-end::before`]: {
      background: w
    },
    [`&-in-view${n}-range-start:not(${n}-range-start-single):not(${n}-range-end) ${a}`]: {
      borderStartStartRadius: o,
      borderEndStartRadius: o,
      borderStartEndRadius: 0,
      borderEndEndRadius: 0
    },
    [`&-in-view${n}-range-end:not(${n}-range-end-single):not(${n}-range-start) ${a}`]: {
      borderStartStartRadius: 0,
      borderEndStartRadius: 0,
      borderStartEndRadius: o,
      borderEndEndRadius: o
    },
    [`&-range-hover${n}-range-end::after`]: {
      insetInlineStart: "50%"
    },
    [`tr > &-in-view${n}-range-hover:first-child::after,
      tr > &-in-view${n}-range-hover-end:first-child::after,
      &-in-view${n}-start${n}-range-hover-edge-start${n}-range-hover-edge-start-near-range::after,
      &-in-view${n}-range-hover-edge-start:not(${n}-range-hover-edge-start-near-range)::after,
      &-in-view${n}-range-hover-start::after`]: {
      insetInlineStart: (g - r) / 2,
      borderInlineStart: `${s}px dashed ${C}`,
      borderStartStartRadius: s,
      borderEndStartRadius: s
    },
    [`tr > &-in-view${n}-range-hover:last-child::after,
      tr > &-in-view${n}-range-hover-start:last-child::after,
      &-in-view${n}-end${n}-range-hover-edge-end${n}-range-hover-edge-end-near-range::after,
      &-in-view${n}-range-hover-edge-end:not(${n}-range-hover-edge-end-near-range)::after,
      &-in-view${n}-range-hover-end::after`]: {
      insetInlineEnd: (g - r) / 2,
      borderInlineEnd: `${s}px dashed ${C}`,
      borderStartEndRadius: s,
      borderEndEndRadius: s
    },
    "&-disabled": {
      color: k,
      pointerEvents: "none",
      [a]: {
        background: "transparent"
      },
      "&::before": {
        background: D
      }
    },
    [`&-disabled${n}-today ${a}::before`]: {
      borderColor: k
    }
  };
};
const tl = e => {
  const {
    componentCls: t,
    pickerCellInnerCls: n,
    pickerYearMonthCellWidth: a,
    pickerControlIconSize: r,
    pickerPanelCellWidth: l,
    paddingSM: o,
    paddingXS: i,
    paddingXXS: u,
    colorBgContainer: s,
    lineWidth: v,
    lineType: c,
    borderRadiusLG: f,
    colorPrimary: h,
    colorTextHeading: y,
    colorSplit: C,
    pickerControlIconBorderWidth: d,
    colorIcon: w,
    pickerTextHeight: g,
    motionDurationMid: k,
    colorIconHover: D,
    fontWeightStrong: O,
    pickerPanelCellHeight: E,
    pickerCellPaddingVertical: q,
    colorTextDisabled: U,
    colorText: L,
    fontSize: A,
    pickerBasicCellHoverWithRangeColor: T,
    motionDurationSlow: B,
    pickerPanelWithoutTimeCellHeight: X,
    pickerQuarterPanelContentHeight: I,
    colorLink: P,
    colorLinkActive: x,
    colorLinkHover: b,
    pickerDateHoverRangeBorderColor: $,
    borderRadiusSM: N,
    colorTextLightSolid: p,
    borderRadius: S,
    controlItemBgHover: V,
    pickerTimePanelColumnHeight: _,
    pickerTimePanelColumnWidth: Q,
    pickerTimePanelCellHeight: ee,
    controlItemBgActive: ie,
    marginXXS: oe
  } = e;
  const j = l * 7 + o * 2 + 4;
  const ne = (j - i * 2) / 3 - a - o;
  return {
    [t]: {
      "&-panel": {
        display: "inline-flex",
        flexDirection: "column",
        textAlign: "center",
        background: s,
        border: `${v}px ${c} ${C}`,
        borderRadius: f,
        outline: "none",
        "&-focused": {
          borderColor: h
        },
        "&-rtl": {
          direction: "rtl",
          [`${t}-prev-icon,
              ${t}-super-prev-icon`]: {
            transform: "rotate(45deg)"
          },
          [`${t}-next-icon,
              ${t}-super-next-icon`]: {
            transform: "rotate(-135deg)"
          }
        }
      },
      "&-decade-panel,\n        &-year-panel,\n        &-quarter-panel,\n        &-month-panel,\n        &-week-panel,\n        &-date-panel,\n        &-time-panel": {
        display: "flex",
        flexDirection: "column",
        width: j
      },
      "&-header": {
        display: "flex",
        padding: `0 ${i}px`,
        color: y,
        borderBottom: `${v}px ${c} ${C}`,
        "> *": {
          flex: "none"
        },
        button: {
          padding: 0,
          color: w,
          lineHeight: `${g}px`,
          background: "transparent",
          border: 0,
          cursor: "pointer",
          transition: `color ${k}`
        },
        "> button": {
          minWidth: "1.6em",
          fontSize: A,
          "&:hover": {
            color: D
          }
        },
        "&-view": {
          flex: "auto",
          fontWeight: O,
          lineHeight: `${g}px`,
          button: {
            color: "inherit",
            fontWeight: "inherit",
            verticalAlign: "top",
            "&:not(:first-child)": {
              marginInlineStart: i
            },
            "&:hover": {
              color: h
            }
          }
        }
      },
      "&-prev-icon,\n        &-next-icon,\n        &-super-prev-icon,\n        &-super-next-icon": {
        position: "relative",
        display: "inline-block",
        width: r,
        height: r,
        "&::before": {
          position: "absolute",
          top: 0,
          insetInlineStart: 0,
          display: "inline-block",
          width: r,
          height: r,
          border: "0 solid currentcolor",
          borderBlockStartWidth: d,
          borderBlockEndWidth: 0,
          borderInlineStartWidth: d,
          borderInlineEndWidth: 0,
          content: "\"\""
        }
      },
      "&-super-prev-icon,\n        &-super-next-icon": {
        "&::after": {
          position: "absolute",
          top: Math.ceil(r / 2),
          insetInlineStart: Math.ceil(r / 2),
          display: "inline-block",
          width: r,
          height: r,
          border: "0 solid currentcolor",
          borderBlockStartWidth: d,
          borderBlockEndWidth: 0,
          borderInlineStartWidth: d,
          borderInlineEndWidth: 0,
          content: "\"\""
        }
      },
      "&-prev-icon,\n        &-super-prev-icon": {
        transform: "rotate(-45deg)"
      },
      "&-next-icon,\n        &-super-next-icon": {
        transform: "rotate(135deg)"
      },
      "&-content": {
        width: "100%",
        tableLayout: "fixed",
        borderCollapse: "collapse",
        "th, td": {
          position: "relative",
          minWidth: E,
          fontWeight: "normal"
        },
        th: {
          height: E + q * 2,
          color: L,
          verticalAlign: "middle"
        }
      },
      "&-cell": Y({
        padding: `${q}px 0`,
        color: U,
        cursor: "pointer",
        "&-in-view": {
          color: L
        }
      }, el(e)),
      [`&-date-panel ${t}-cell-in-view${t}-cell-in-range${t}-cell-range-hover-start ${n},
        &-date-panel ${t}-cell-in-view${t}-cell-in-range${t}-cell-range-hover-end ${n}`]: {
        "&::after": {
          position: "absolute",
          top: 0,
          bottom: 0,
          zIndex: -1,
          background: T,
          transition: `all ${B}`,
          content: "\"\""
        }
      },
      [`&-date-panel
        ${t}-cell-in-view${t}-cell-in-range${t}-cell-range-hover-start
        ${n}::after`]: {
        insetInlineEnd: -(l - E) / 2,
        insetInlineStart: 0
      },
      [`&-date-panel ${t}-cell-in-view${t}-cell-in-range${t}-cell-range-hover-end ${n}::after`]: {
        insetInlineEnd: 0,
        insetInlineStart: -(l - E) / 2
      },
      [`&-range-hover${t}-range-start::after`]: {
        insetInlineEnd: "50%"
      },
      "&-decade-panel,\n        &-year-panel,\n        &-quarter-panel,\n        &-month-panel": {
        [`${t}-content`]: {
          height: X * 4
        },
        [n]: {
          padding: `0 ${i}px`
        }
      },
      "&-quarter-panel": {
        [`${t}-content`]: {
          height: I
        }
      },
      [`&-panel ${t}-footer`]: {
        borderTop: `${v}px ${c} ${C}`
      },
      "&-footer": {
        width: "min-content",
        minWidth: "100%",
        lineHeight: `${g - v * 2}px`,
        textAlign: "center",
        "&-extra": {
          padding: `0 ${o}`,
          lineHeight: `${g - v * 2}px`,
          textAlign: "start",
          "&:not(:last-child)": {
            borderBottom: `${v}px ${c} ${C}`
          }
        }
      },
      "&-now": {
        textAlign: "start"
      },
      "&-today-btn": {
        color: P,
        "&:hover": {
          color: b
        },
        "&:active": {
          color: x
        },
        [`&${t}-today-btn-disabled`]: {
          color: U,
          cursor: "not-allowed"
        }
      },
      "&-decade-panel": {
        [n]: {
          padding: `0 ${i / 2}px`
        },
        [`${t}-cell::before`]: {
          display: "none"
        }
      },
      "&-year-panel,\n        &-quarter-panel,\n        &-month-panel": {
        [`${t}-body`]: {
          padding: `0 ${i}px`
        },
        [n]: {
          width: a
        },
        [`${t}-cell-range-hover-start::after`]: {
          insetInlineStart: ne,
          borderInlineStart: `${v}px dashed ${$}`,
          borderStartStartRadius: N,
          borderBottomStartRadius: N,
          borderStartEndRadius: 0,
          borderBottomEndRadius: 0,
          [`${t}-panel-rtl &`]: {
            insetInlineEnd: ne,
            borderInlineEnd: `${v}px dashed ${$}`,
            borderStartStartRadius: 0,
            borderBottomStartRadius: 0,
            borderStartEndRadius: N,
            borderBottomEndRadius: N
          }
        },
        [`${t}-cell-range-hover-end::after`]: {
          insetInlineEnd: ne,
          borderInlineEnd: `${v}px dashed ${$}`,
          borderStartStartRadius: 0,
          borderEndStartRadius: 0,
          borderStartEndRadius: S,
          borderEndEndRadius: S,
          [`${t}-panel-rtl &`]: {
            insetInlineStart: ne,
            borderInlineStart: `${v}px dashed ${$}`,
            borderStartStartRadius: S,
            borderEndStartRadius: S,
            borderStartEndRadius: 0,
            borderEndEndRadius: 0
          }
        }
      },
      "&-week-panel": {
        [`${t}-body`]: {
          padding: `${i}px ${o}px`
        },
        [`${t}-cell`]: {
          [`&:hover ${n},
            &-selected ${n},
            ${n}`]: {
            background: "transparent !important"
          }
        },
        "&-row": {
          td: {
            transition: `background ${k}`,
            "&:first-child": {
              borderStartStartRadius: N,
              borderEndStartRadius: N
            },
            "&:last-child": {
              borderStartEndRadius: N,
              borderEndEndRadius: N
            }
          },
          "&:hover td": {
            background: V
          },
          "&-selected td,\n            &-selected:hover td": {
            background: h,
            [`&${t}-cell-week`]: {
              color: new Et(p).setAlpha(0.5).toHexString()
            },
            [`&${t}-cell-today ${n}::before`]: {
              borderColor: p
            },
            [n]: {
              color: p
            }
          }
        }
      },
      "&-date-panel": {
        [`${t}-body`]: {
          padding: `${i}px ${o}px`
        },
        [`${t}-content`]: {
          width: l * 7,
          th: {
            width: l
          }
        }
      },
      "&-datetime-panel": {
        display: "flex",
        [`${t}-time-panel`]: {
          borderInlineStart: `${v}px ${c} ${C}`
        },
        [`${t}-date-panel,
          ${t}-time-panel`]: {
          transition: `opacity ${B}`
        },
        "&-active": {
          [`${t}-date-panel,
            ${t}-time-panel`]: {
            opacity: 0.3,
            "&-active": {
              opacity: 1
            }
          }
        }
      },
      "&-time-panel": {
        width: "auto",
        minWidth: "auto",
        direction: "ltr",
        [`${t}-content`]: {
          display: "flex",
          flex: "auto",
          height: _
        },
        "&-column": {
          flex: "1 0 auto",
          width: Q,
          margin: `${u}px 0`,
          padding: 0,
          overflowY: "hidden",
          textAlign: "start",
          listStyle: "none",
          transition: `background ${k}`,
          overflowX: "hidden",
          "&::after": {
            display: "block",
            height: _ - ee,
            content: "\"\""
          },
          "&:not(:first-child)": {
            borderInlineStart: `${v}px ${c} ${C}`
          },
          "&-active": {
            background: new Et(ie).setAlpha(0.2).toHexString()
          },
          "&:hover": {
            overflowY: "auto"
          },
          "> li": {
            margin: 0,
            padding: 0,
            [`&${t}-time-panel-cell`]: {
              marginInline: oe,
              [`${t}-time-panel-cell-inner`]: {
                display: "block",
                width: Q - oe * 2,
                height: ee,
                margin: 0,
                paddingBlock: 0,
                paddingInlineEnd: 0,
                paddingInlineStart: (Q - ee) / 2,
                color: L,
                lineHeight: `${ee}px`,
                borderRadius: N,
                cursor: "pointer",
                transition: `background ${k}`,
                "&:hover": {
                  background: V
                }
              },
              "&-selected": {
                [`${t}-time-panel-cell-inner`]: {
                  background: ie
                }
              },
              "&-disabled": {
                [`${t}-time-panel-cell-inner`]: {
                  color: U,
                  background: "transparent",
                  cursor: "not-allowed"
                }
              }
            }
          }
        }
      },
      [`&-datetime-panel ${t}-time-panel-column:after`]: {
        height: _ - ee + u * 2
      }
    }
  };
};
const nl = e => {
  const {
    componentCls: t,
    colorBgContainer: n,
    colorError: a,
    colorErrorOutline: r,
    colorWarning: l,
    colorWarningOutline: o
  } = e;
  return {
    [t]: {
      [`&-status-error${t}`]: {
        "&, &:not([disabled]):hover": {
          backgroundColor: n,
          borderColor: a
        },
        "&-focused, &:focus": Y({}, on(rn(e, {
          inputBorderActiveColor: a,
          inputBorderHoverColor: a,
          controlOutline: r
        }))),
        [`${t}-active-bar`]: {
          background: a
        }
      },
      [`&-status-warning${t}`]: {
        "&, &:not([disabled]):hover": {
          backgroundColor: n,
          borderColor: l
        },
        "&-focused, &:focus": Y({}, on(rn(e, {
          inputBorderActiveColor: l,
          inputBorderHoverColor: l,
          controlOutline: o
        }))),
        [`${t}-active-bar`]: {
          background: l
        }
      }
    }
  };
};
const al = e => {
  const {
    componentCls: t,
    antCls: n,
    boxShadowPopoverArrow: a,
    controlHeight: r,
    fontSize: l,
    inputPaddingHorizontal: o,
    colorBgContainer: i,
    lineWidth: u,
    lineType: s,
    colorBorder: v,
    borderRadius: c,
    motionDurationMid: f,
    colorBgContainerDisabled: h,
    colorTextDisabled: y,
    colorTextPlaceholder: C,
    controlHeightLG: d,
    fontSizeLG: w,
    controlHeightSM: g,
    inputPaddingHorizontalSM: k,
    paddingXS: D,
    marginXS: O,
    colorTextDescription: E,
    lineWidthBold: q,
    lineHeight: U,
    colorPrimary: L,
    motionDurationSlow: A,
    zIndexPopup: T,
    paddingXXS: B,
    paddingSM: X,
    pickerTextHeight: I,
    controlItemBgActive: P,
    colorPrimaryBorder: x,
    sizePopupArrow: b,
    borderRadiusXS: $,
    borderRadiusOuter: N,
    colorBgElevated: p,
    borderRadiusLG: S,
    boxShadowSecondary: V,
    borderRadiusSM: _,
    colorSplit: Q,
    controlItemBgHover: ee,
    presetsWidth: ie,
    presetsMaxWidth: oe
  } = e;
  return [{
    [t]: Y(Y(Y({}, Xn(e)), an(e, r, l, o)), {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      background: i,
      lineHeight: 1,
      border: `${u}px ${s} ${v}`,
      borderRadius: c,
      transition: `border ${f}, box-shadow ${f}`,
      "&:hover, &-focused": Y({}, zr(e)),
      "&-focused": Y({}, on(e)),
      [`&${t}-disabled`]: {
        background: h,
        borderColor: v,
        cursor: "not-allowed",
        [`${t}-suffix`]: {
          color: y
        }
      },
      [`&${t}-borderless`]: {
        backgroundColor: "transparent !important",
        borderColor: "transparent !important",
        boxShadow: "none !important"
      },
      [`${t}-input`]: {
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        width: "100%",
        "> input": Y(Y({}, jr(e)), {
          flex: "auto",
          minWidth: 1,
          height: "auto",
          padding: 0,
          background: "transparent",
          border: 0,
          "&:focus": {
            boxShadow: "none"
          },
          "&[disabled]": {
            background: "transparent"
          }
        }),
        "&:hover": {
          [`${t}-clear`]: {
            opacity: 1
          }
        },
        "&-placeholder": {
          "> input": {
            color: C
          }
        }
      },
      "&-large": Y(Y({}, an(e, d, w, o)), {
        [`${t}-input > input`]: {
          fontSize: w
        }
      }),
      "&-small": Y({}, an(e, g, l, k)),
      [`${t}-suffix`]: {
        display: "flex",
        flex: "none",
        alignSelf: "center",
        marginInlineStart: D / 2,
        color: y,
        lineHeight: 1,
        pointerEvents: "none",
        "> *": {
          verticalAlign: "top",
          "&:not(:last-child)": {
            marginInlineEnd: O
          }
        }
      },
      [`${t}-clear`]: {
        position: "absolute",
        top: "50%",
        insetInlineEnd: 0,
        color: y,
        lineHeight: 1,
        background: i,
        transform: "translateY(-50%)",
        cursor: "pointer",
        opacity: 0,
        transition: `opacity ${f}, color ${f}`,
        "> *": {
          verticalAlign: "top"
        },
        "&:hover": {
          color: E
        }
      },
      [`${t}-separator`]: {
        position: "relative",
        display: "inline-block",
        width: "1em",
        height: w,
        color: y,
        fontSize: w,
        verticalAlign: "top",
        cursor: "default",
        [`${t}-focused &`]: {
          color: E
        },
        [`${t}-range-separator &`]: {
          [`${t}-disabled &`]: {
            cursor: "not-allowed"
          }
        }
      },
      "&-range": {
        position: "relative",
        display: "inline-flex",
        [`${t}-clear`]: {
          insetInlineEnd: o
        },
        "&:hover": {
          [`${t}-clear`]: {
            opacity: 1
          }
        },
        [`${t}-active-bar`]: {
          bottom: -u,
          height: q,
          marginInlineStart: o,
          background: L,
          opacity: 0,
          transition: `all ${A} ease-out`,
          pointerEvents: "none"
        },
        [`&${t}-focused`]: {
          [`${t}-active-bar`]: {
            opacity: 1
          }
        },
        [`${t}-range-separator`]: {
          alignItems: "center",
          padding: `0 ${D}px`,
          lineHeight: 1
        },
        [`&${t}-small`]: {
          [`${t}-clear`]: {
            insetInlineEnd: k
          },
          [`${t}-active-bar`]: {
            marginInlineStart: k
          }
        }
      },
      "&-dropdown": Y(Y(Y({}, Xn(e)), tl(e)), {
        position: "absolute",
        top: -9999,
        left: {
          _skip_check_: true,
          value: -9999
        },
        zIndex: T,
        [`&${t}-dropdown-hidden`]: {
          display: "none"
        },
        [`&${t}-dropdown-placement-bottomLeft`]: {
          [`${t}-range-arrow`]: {
            top: 0,
            display: "block",
            transform: "translateY(-100%)"
          }
        },
        [`&${t}-dropdown-placement-topLeft`]: {
          [`${t}-range-arrow`]: {
            bottom: 0,
            display: "block",
            transform: "translateY(100%) rotate(180deg)"
          }
        },
        [`&${n}-slide-up-enter${n}-slide-up-enter-active${t}-dropdown-placement-topLeft,
          &${n}-slide-up-enter${n}-slide-up-enter-active${t}-dropdown-placement-topRight,
          &${n}-slide-up-appear${n}-slide-up-appear-active${t}-dropdown-placement-topLeft,
          &${n}-slide-up-appear${n}-slide-up-appear-active${t}-dropdown-placement-topRight`]: {
          animationName: Wr
        },
        [`&${n}-slide-up-enter${n}-slide-up-enter-active${t}-dropdown-placement-bottomLeft,
          &${n}-slide-up-enter${n}-slide-up-enter-active${t}-dropdown-placement-bottomRight,
          &${n}-slide-up-appear${n}-slide-up-appear-active${t}-dropdown-placement-bottomLeft,
          &${n}-slide-up-appear${n}-slide-up-appear-active${t}-dropdown-placement-bottomRight`]: {
          animationName: Br
        },
        [`&${n}-slide-up-leave${n}-slide-up-leave-active${t}-dropdown-placement-topLeft,
          &${n}-slide-up-leave${n}-slide-up-leave-active${t}-dropdown-placement-topRight`]: {
          animationName: _r
        },
        [`&${n}-slide-up-leave${n}-slide-up-leave-active${t}-dropdown-placement-bottomLeft,
          &${n}-slide-up-leave${n}-slide-up-leave-active${t}-dropdown-placement-bottomRight`]: {
          animationName: Ar
        },
        [`${t}-panel > ${t}-time-panel`]: {
          paddingTop: B
        },
        [`${t}-ranges`]: {
          marginBottom: 0,
          padding: `${B}px ${X}px`,
          overflow: "hidden",
          lineHeight: `${I - u * 2 - D / 2}px`,
          textAlign: "start",
          listStyle: "none",
          display: "flex",
          justifyContent: "space-between",
          "> li": {
            display: "inline-block"
          },
          [`${t}-preset > ${n}-tag-blue`]: {
            color: L,
            background: P,
            borderColor: x,
            cursor: "pointer"
          },
          [`${t}-ok`]: {
            marginInlineStart: "auto"
          }
        },
        [`${t}-range-wrapper`]: {
          display: "flex",
          position: "relative"
        },
        [`${t}-range-arrow`]: Y({
          position: "absolute",
          zIndex: 1,
          display: "none",
          marginInlineStart: o * 1.5,
          transition: `left ${A} ease-out`
        }, Lr(b, $, N, p, a)),
        [`${t}-panel-container`]: {
          overflow: "hidden",
          verticalAlign: "top",
          background: p,
          borderRadius: S,
          boxShadow: V,
          transition: `margin ${A}`,
          [`${t}-panel-layout`]: {
            display: "flex",
            flexWrap: "nowrap",
            alignItems: "stretch"
          },
          [`${t}-presets`]: {
            display: "flex",
            flexDirection: "column",
            minWidth: ie,
            maxWidth: oe,
            ul: {
              height: 0,
              flex: "auto",
              listStyle: "none",
              overflow: "auto",
              margin: 0,
              padding: D,
              borderInlineEnd: `${u}px ${s} ${Q}`,
              li: Y(Y({}, Fr), {
                borderRadius: _,
                paddingInline: D,
                paddingBlock: (g - Math.round(l * U)) / 2,
                cursor: "pointer",
                transition: `all ${A}`,
                "+ li": {
                  marginTop: O
                },
                "&:hover": {
                  background: ee
                }
              })
            }
          },
          [`${t}-panels`]: {
            display: "inline-flex",
            flexWrap: "nowrap",
            direction: "ltr",
            [`${t}-panel`]: {
              borderWidth: `0 0 ${u}px`
            },
            "&:last-child": {
              [`${t}-panel`]: {
                borderWidth: 0
              }
            }
          },
          [`${t}-panel`]: {
            verticalAlign: "top",
            background: "transparent",
            borderRadius: 0,
            borderWidth: 0,
            [`${t}-content,
            table`]: {
              textAlign: "center"
            },
            "&-focused": {
              borderColor: v
            }
          }
        }
      }),
      "&-dropdown-range": {
        padding: `${b * 2 / 3}px 0`,
        "&-hidden": {
          display: "none"
        }
      },
      "&-rtl": {
        direction: "rtl",
        [`${t}-separator`]: {
          transform: "rotate(180deg)"
        },
        [`${t}-footer`]: {
          "&-extra": {
            direction: "rtl"
          }
        }
      }
    })
  }, Zn(e, "slide-up"), Zn(e, "slide-down"), Jn(e, "move-up"), Jn(e, "move-down")];
};
const rl = e => {
  const {
    componentCls: n,
    controlHeightLG: a,
    controlHeightSM: r,
    colorPrimary: l,
    paddingXXS: o
  } = e;
  return {
    pickerCellCls: `${n}-cell`,
    pickerCellInnerCls: `${n}-cell-inner`,
    pickerTextHeight: a,
    pickerPanelCellWidth: r * 1.5,
    pickerPanelCellHeight: r,
    pickerDateHoverRangeBorderColor: new Et(l).lighten(20).toHexString(),
    pickerBasicCellHoverWithRangeColor: new Et(l).lighten(35).toHexString(),
    pickerPanelWithoutTimeCellHeight: a * 1.65,
    pickerYearMonthCellWidth: a * 1.5,
    pickerTimePanelColumnHeight: 224,
    pickerTimePanelColumnWidth: a * 1.4,
    pickerTimePanelCellHeight: 28,
    pickerQuarterPanelContentHeight: a * 1.4,
    pickerCellPaddingVertical: o,
    pickerCellBorderGap: 2,
    pickerControlIconSize: 7,
    pickerControlIconBorderWidth: 1.5
  };
};
const tr = Er("DatePicker", e => {
  const t = rn(Vr(e), rl(e));
  return [al(t), nl(t), Hr(e, {
    focusElCls: `${e.componentCls}-focused`
  })];
}, e => ({
  presetsWidth: 120,
  presetsMaxWidth: 200,
  zIndexPopup: e.zIndexPopupBase + 50
}));
const ol = (e, t) => {
  let {
    attrs: n,
    slots: a
  } = t;
  return m(Ur, R(R({
    size: "small",
    type: "primary"
  }, e), n), a);
};
function ll(e, t) {
  let {
    slots: n,
    attrs: a
  } = t;
  return m(qr, R(R({
    color: "blue"
  }, e), a), n);
}
var il = {
  icon: {
    tag: "svg",
    attrs: {
      viewBox: "64 64 896 896",
      focusable: "false"
    },
    children: [{
      tag: "path",
      attrs: {
        d: "M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32zm-40 656H184V460h656v380zM184 392V256h128v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h256v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h128v136H184z"
      }
    }]
  },
  name: "calendar",
  theme: "outlined"
};
function sa(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? Object(arguments[t]) : {};
    var a = Object.keys(n);
    if (typeof Object.getOwnPropertySymbols == "function") {
      a = a.concat(Object.getOwnPropertySymbols(n).filter(function (r) {
        return Object.getOwnPropertyDescriptor(n, r).enumerable;
      }));
    }
    a.forEach(function (r) {
      sl(e, r, n[r]);
    });
  }
  return e;
}
function sl(e, t, n) {
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
function Ft(t, n) {
  var a = sa({}, t, n.attrs);
  return m(mn, sa({}, a, {
    icon: il
  }), null);
}
Ft.displayName = "CalendarOutlined";
Ft.inheritAttrs = false;
var ul = {
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
        d: "M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165.4 120.6c3.6 2.6 8.6 1.8 11.2-1.7l28.6-39c2.6-3.7 1.8-8.7-1.8-11.2z"
      }
    }]
  },
  name: "clock-circle",
  theme: "outlined"
};
function ua(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? Object(arguments[t]) : {};
    var a = Object.keys(n);
    if (typeof Object.getOwnPropertySymbols == "function") {
      a = a.concat(Object.getOwnPropertySymbols(n).filter(function (r) {
        return Object.getOwnPropertyDescriptor(n, r).enumerable;
      }));
    }
    a.forEach(function (r) {
      cl(e, r, n[r]);
    });
  }
  return e;
}
function cl(e, t, n) {
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
function Lt(t, n) {
  var a = ua({}, t, n.attrs);
  return m(mn, ua({}, a, {
    icon: ul
  }), null);
}
Lt.displayName = "ClockCircleOutlined";
Lt.inheritAttrs = false;
function dl(e, t, n) {
  if (n !== undefined) {
    return n;
  } else if (t === "year" && e.lang.yearPlaceholder) {
    return e.lang.yearPlaceholder;
  } else if (t === "quarter" && e.lang.quarterPlaceholder) {
    return e.lang.quarterPlaceholder;
  } else if (t === "month" && e.lang.monthPlaceholder) {
    return e.lang.monthPlaceholder;
  } else if (t === "week" && e.lang.weekPlaceholder) {
    return e.lang.weekPlaceholder;
  } else if (t === "time" && e.timePickerLocale.placeholder) {
    return e.timePickerLocale.placeholder;
  } else {
    return e.lang.placeholder;
  }
}
function fl(e, t, n) {
  if (n !== undefined) {
    return n;
  } else if (t === "year" && e.lang.yearPlaceholder) {
    return e.lang.rangeYearPlaceholder;
  } else if (t === "month" && e.lang.monthPlaceholder) {
    return e.lang.rangeMonthPlaceholder;
  } else if (t === "week" && e.lang.weekPlaceholder) {
    return e.lang.rangeWeekPlaceholder;
  } else if (t === "time" && e.timePickerLocale.placeholder) {
    return e.timePickerLocale.rangePlaceholder;
  } else {
    return e.lang.rangePlaceholder;
  }
}
function nr(e, t) {
  const n = {
    adjustX: 1,
    adjustY: 1
  };
  switch (t) {
    case "bottomLeft":
      return {
        points: ["tl", "bl"],
        offset: [0, 4],
        overflow: n
      };
    case "bottomRight":
      return {
        points: ["tr", "br"],
        offset: [0, 4],
        overflow: n
      };
    case "topLeft":
      return {
        points: ["bl", "tl"],
        offset: [0, -4],
        overflow: n
      };
    case "topRight":
      return {
        points: ["br", "tr"],
        offset: [0, -4],
        overflow: n
      };
    default:
      return {
        points: e === "rtl" ? ["tr", "br"] : ["tl", "bl"],
        offset: [0, 4],
        overflow: n
      };
  }
}
function ar() {
  return {
    id: String,
    dropdownClassName: String,
    popupClassName: String,
    popupStyle: ln(),
    transitionName: String,
    placeholder: String,
    allowClear: ze(),
    autofocus: ze(),
    disabled: ze(),
    tabindex: Number,
    open: ze(),
    defaultOpen: ze(),
    inputReadOnly: ze(),
    format: ut([String, Function, Array]),
    getPopupContainer: ae(),
    panelRender: ae(),
    onChange: ae(),
    "onUpdate:value": ae(),
    onOk: ae(),
    onOpenChange: ae(),
    "onUpdate:open": ae(),
    onFocus: ae(),
    onBlur: ae(),
    onMousedown: ae(),
    onMouseup: ae(),
    onMouseenter: ae(),
    onMouseleave: ae(),
    onClick: ae(),
    onContextmenu: ae(),
    onKeydown: ae(),
    role: String,
    name: String,
    autocomplete: String,
    direction: vt(),
    showToday: ze(),
    showTime: ut([Boolean, Object]),
    locale: ln(),
    size: vt(),
    bordered: ze(),
    dateRender: ae(),
    disabledDate: ae(),
    mode: vt(),
    picker: vt(),
    valueFormat: String,
    placement: vt(),
    status: vt(),
    disabledHours: ae(),
    disabledMinutes: ae(),
    disabledSeconds: ae()
  };
}
function vl() {
  return {
    defaultPickerValue: ut([Object, String]),
    defaultValue: ut([Object, String]),
    value: ut([Object, String]),
    presets: tt(),
    disabledTime: ae(),
    renderExtraFooter: ae(),
    showNow: ze(),
    monthCellRender: ae(),
    monthCellContentRender: ae()
  };
}
function gl() {
  return {
    allowEmpty: tt(),
    dateRender: ae(),
    defaultPickerValue: tt(),
    defaultValue: tt(),
    value: tt(),
    presets: tt(),
    disabledTime: ae(),
    disabled: ut([Boolean, Array]),
    renderExtraFooter: ae(),
    separator: {
      type: String
    },
    showTime: ut([Boolean, Object]),
    ranges: ln(),
    placeholder: tt(),
    mode: tt(),
    onChange: ae(),
    "onUpdate:value": ae(),
    onCalendarChange: ae(),
    onPanelChange: ae(),
    onOk: ae()
  };
}
function pl(e, t) {
  var n = {};
  for (var a in e) {
    if (Object.prototype.hasOwnProperty.call(e, a) && t.indexOf(a) < 0) {
      n[a] = e[a];
    }
  }
  if (e != null && typeof Object.getOwnPropertySymbols == "function") {
    for (var r = 0, a = Object.getOwnPropertySymbols(e); r < a.length; r++) {
      if (t.indexOf(a[r]) < 0 && Object.prototype.propertyIsEnumerable.call(e, a[r])) {
        n[a[r]] = e[a[r]];
      }
    }
  }
  return n;
}
function hl(e, t) {
  function n(s, v) {
    const c = Y(Y(Y({}, ar()), vl()), t);
    return Qe({
      compatConfig: {
        MODE: 3
      },
      name: v,
      inheritAttrs: false,
      props: c,
      slots: Object,
      setup(f, h) {
        let {
          slots: y,
          expose: C,
          attrs: d,
          emit: w
        } = h;
        const g = f;
        const k = ma();
        const D = ya.useInject();
        const {
          prefixCls: O,
          direction: E,
          getPopupContainer: q,
          size: U,
          rootPrefixCls: L,
          disabled: A
        } = ba("picker", g);
        const {
          compactSize: T,
          compactItemClassnames: B
        } = ka(O, E);
        const X = F(() => T.value || U.value);
        const [I, P] = tr(O);
        const x = z();
        C({
          focus: () => {
            var j;
            if ((j = x.value) !== null && j !== undefined) {
              j.focus();
            }
          },
          blur: () => {
            var j;
            if ((j = x.value) !== null && j !== undefined) {
              j.blur();
            }
          }
        });
        const b = j => g.valueFormat ? e.toString(j, g.valueFormat) : j;
        const $ = (j, ne) => {
          const G = b(j);
          w("update:value", G);
          w("change", G, ne);
          k.onFieldChange();
        };
        const N = j => {
          w("update:open", j);
          w("openChange", j);
        };
        const p = j => {
          w("focus", j);
        };
        const S = j => {
          w("blur", j);
          k.onFieldBlur();
        };
        const V = (j, ne) => {
          const G = b(j);
          w("panelChange", G, ne);
        };
        const _ = j => {
          const ne = b(j);
          w("ok", ne);
        };
        const [Q] = xa("DatePicker", Sa);
        const ee = F(() => g.value ? g.valueFormat ? e.toDate(g.value, g.valueFormat) : g.value : g.value === "" ? undefined : g.value);
        const ie = F(() => g.defaultValue ? g.valueFormat ? e.toDate(g.defaultValue, g.valueFormat) : g.defaultValue : g.defaultValue === "" ? undefined : g.defaultValue);
        const oe = F(() => g.defaultPickerValue ? g.valueFormat ? e.toDate(g.defaultPickerValue, g.valueFormat) : g.defaultPickerValue : g.defaultPickerValue === "" ? undefined : g.defaultPickerValue);
        return () => {
          var j;
          var ne;
          var G;
          var Z;
          var se;
          var re;
          const he = Y(Y({}, Q.value), g.locale);
          const K = Y(Y({}, g), d);
          const {
            bordered: te = true,
            placeholder: $e,
            suffixIcon: ye = (j = y.suffixIcon) === null || j === undefined ? undefined : j.call(y),
            showToday: Me = true,
            transitionName: _e,
            allowClear: Se = true,
            dateRender: Be = y.dateRender,
            renderExtraFooter: We = y.renderExtraFooter,
            monthCellRender: Oe = y.monthCellRender || g.monthCellContentRender || y.monthCellContentRender,
            clearIcon: me = (ne = y.clearIcon) === null || ne === undefined ? undefined : ne.call(y),
            id: Te = k.id.value
          } = K;
          const ft = pl(K, ["bordered", "placeholder", "suffixIcon", "showToday", "transitionName", "allowClear", "dateRender", "renderExtraFooter", "monthCellRender", "clearIcon", "id"]);
          const lt = K.showTime === "" ? true : K.showTime;
          const {
            format: De
          } = K;
          let Fe = {};
          if (s) {
            Fe.picker = s;
          }
          const Ie = s || K.picker || "date";
          Fe = Y(Y(Y({}, Fe), lt ? Ht(Y({
            format: De,
            picker: Ie
          }, typeof lt == "object" ? lt : {})) : {}), Ie === "time" ? Ht(Y(Y({
            format: De
          }, ft), {
            picker: Ie
          })) : {});
          const Pe = O.value;
          const Ge = m(Yt, null, [ye || (s === "time" ? m(Lt, null, null) : m(Ft, null, null)), D.hasFeedback && D.feedbackIcon]);
          return I(m(Bo, R(R(R({
            monthCellRender: Oe,
            dateRender: Be,
            renderExtraFooter: We,
            ref: x,
            placeholder: dl(he, Ie, $e),
            suffixIcon: Ge,
            dropdownAlign: nr(E.value, g.placement),
            clearIcon: me || m(Ca, null, null),
            allowClear: Se,
            transitionName: _e || `${L.value}-slide-up`
          }, ft), Fe), {}, {
            id: Te,
            picker: Ie,
            value: ee.value,
            defaultValue: ie.value,
            defaultPickerValue: oe.value,
            showToday: Me,
            locale: he.lang,
            class: ue({
              [`${Pe}-${X.value}`]: X.value,
              [`${Pe}-borderless`]: !te
            }, wa(Pe, $a(D.status, g.status), D.hasFeedback), d.class, P.value, B.value),
            disabled: A.value,
            prefixCls: Pe,
            getPopupContainer: d.getCalendarContainer || q.value,
            generateConfig: e,
            prevIcon: ((G = y.prevIcon) === null || G === undefined ? undefined : G.call(y)) || m("span", {
              class: `${Pe}-prev-icon`
            }, null),
            nextIcon: ((Z = y.nextIcon) === null || Z === undefined ? undefined : Z.call(y)) || m("span", {
              class: `${Pe}-next-icon`
            }, null),
            superPrevIcon: ((se = y.superPrevIcon) === null || se === undefined ? undefined : se.call(y)) || m("span", {
              class: `${Pe}-super-prev-icon`
            }, null),
            superNextIcon: ((re = y.superNextIcon) === null || re === undefined ? undefined : re.call(y)) || m("span", {
              class: `${Pe}-super-next-icon`
            }, null),
            components: rr,
            direction: E.value,
            dropdownClassName: ue(P.value, g.popupClassName, g.dropdownClassName),
            onChange: $,
            onOpenChange: N,
            onFocus: p,
            onBlur: S,
            onPanelChange: V,
            onOk: _
          }), null));
        };
      }
    });
  }
  const a = n(undefined, "ADatePicker");
  const r = n("week", "AWeekPicker");
  const l = n("month", "AMonthPicker");
  const o = n("year", "AYearPicker");
  const i = n("time", "TimePicker");
  const u = n("quarter", "AQuarterPicker");
  return {
    DatePicker: a,
    WeekPicker: r,
    MonthPicker: l,
    YearPicker: o,
    TimePicker: i,
    QuarterPicker: u
  };
}
var ml = {
  icon: {
    tag: "svg",
    attrs: {
      viewBox: "0 0 1024 1024",
      focusable: "false"
    },
    children: [{
      tag: "path",
      attrs: {
        d: "M873.1 596.2l-164-208A32 32 0 00684 376h-64.8c-6.7 0-10.4 7.7-6.3 13l144.3 183H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h695.9c26.8 0 41.7-30.8 25.2-51.8z"
      }
    }]
  },
  name: "swap-right",
  theme: "outlined"
};
function ca(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? Object(arguments[t]) : {};
    var a = Object.keys(n);
    if (typeof Object.getOwnPropertySymbols == "function") {
      a = a.concat(Object.getOwnPropertySymbols(n).filter(function (r) {
        return Object.getOwnPropertyDescriptor(n, r).enumerable;
      }));
    }
    a.forEach(function (r) {
      bl(e, r, n[r]);
    });
  }
  return e;
}
function bl(e, t, n) {
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
function Vn(t, n) {
  var a = ca({}, t, n.attrs);
  return m(mn, ca({}, a, {
    icon: ml
  }), null);
}
Vn.displayName = "SwapRightOutlined";
Vn.inheritAttrs = false;
function wl(e, t) {
  var n = {};
  for (var a in e) {
    if (Object.prototype.hasOwnProperty.call(e, a) && t.indexOf(a) < 0) {
      n[a] = e[a];
    }
  }
  if (e != null && typeof Object.getOwnPropertySymbols == "function") {
    for (var r = 0, a = Object.getOwnPropertySymbols(e); r < a.length; r++) {
      if (t.indexOf(a[r]) < 0 && Object.prototype.propertyIsEnumerable.call(e, a[r])) {
        n[a[r]] = e[a[r]];
      }
    }
  }
  return n;
}
function $l(e, t) {
  return Qe({
    compatConfig: {
      MODE: 3
    },
    name: "ARangePicker",
    inheritAttrs: false,
    props: Y(Y(Y({}, ar()), gl()), t),
    slots: Object,
    setup(a, r) {
      let {
        expose: l,
        slots: o,
        attrs: i,
        emit: u
      } = r;
      const s = a;
      const v = ma();
      const c = ya.useInject();
      const {
        prefixCls: f,
        direction: h,
        getPopupContainer: y,
        size: C,
        rootPrefixCls: d,
        disabled: w
      } = ba("picker", s);
      const {
        compactSize: g,
        compactItemClassnames: k
      } = ka(f, h);
      const D = F(() => g.value || C.value);
      const [O, E] = tr(f);
      const q = z();
      l({
        focus: () => {
          var p;
          if ((p = q.value) !== null && p !== undefined) {
            p.focus();
          }
        },
        blur: () => {
          var p;
          if ((p = q.value) !== null && p !== undefined) {
            p.blur();
          }
        }
      });
      const U = p => s.valueFormat ? e.toString(p, s.valueFormat) : p;
      const L = (p, S) => {
        const V = U(p);
        u("update:value", V);
        u("change", V, S);
        v.onFieldChange();
      };
      const A = p => {
        u("update:open", p);
        u("openChange", p);
      };
      const T = p => {
        u("focus", p);
      };
      const B = p => {
        u("blur", p);
        v.onFieldBlur();
      };
      const X = (p, S) => {
        const V = U(p);
        u("panelChange", V, S);
      };
      const I = p => {
        const S = U(p);
        u("ok", S);
      };
      const P = (p, S, V) => {
        const _ = U(p);
        u("calendarChange", _, S, V);
      };
      const [x] = xa("DatePicker", Sa);
      const b = F(() => s.value && s.valueFormat ? e.toDate(s.value, s.valueFormat) : s.value);
      const $ = F(() => s.defaultValue && s.valueFormat ? e.toDate(s.defaultValue, s.valueFormat) : s.defaultValue);
      const N = F(() => s.defaultPickerValue && s.valueFormat ? e.toDate(s.defaultPickerValue, s.valueFormat) : s.defaultPickerValue);
      return () => {
        var p;
        var S;
        var V;
        var _;
        var Q;
        var ee;
        var ie;
        const oe = Y(Y({}, x.value), s.locale);
        const j = Y(Y({}, s), i);
        const {
          prefixCls: ne,
          bordered: G = true,
          placeholder: Z,
          suffixIcon: se = (p = o.suffixIcon) === null || p === undefined ? undefined : p.call(o),
          picker: re = "date",
          transitionName: he,
          allowClear: K = true,
          dateRender: te = o.dateRender,
          renderExtraFooter: $e = o.renderExtraFooter,
          separator: ye = (S = o.separator) === null || S === undefined ? undefined : S.call(o),
          clearIcon: Me = (V = o.clearIcon) === null || V === undefined ? undefined : V.call(o),
          id: _e = v.id.value
        } = j;
        const Se = wl(j, ["prefixCls", "bordered", "placeholder", "suffixIcon", "picker", "transitionName", "allowClear", "dateRender", "renderExtraFooter", "separator", "clearIcon", "id"]);
        delete Se["onUpdate:value"];
        delete Se["onUpdate:open"];
        const {
          format: Be,
          showTime: We
        } = j;
        let Oe = {};
        Oe = Y(Y(Y({}, Oe), We ? Ht(Y({
          format: Be,
          picker: re
        }, We)) : {}), re === "time" ? Ht(Y(Y({
          format: Be
        }, Kr(Se, ["disabledTime"])), {
          picker: re
        })) : {});
        const me = f.value;
        const Te = m(Yt, null, [se || (re === "time" ? m(Lt, null, null) : m(Ft, null, null)), c.hasFeedback && c.feedbackIcon]);
        return O(m(Jo, R(R(R({
          dateRender: te,
          renderExtraFooter: $e,
          separator: ye || m("span", {
            "aria-label": "to",
            class: `${me}-separator`
          }, [m(Vn, null, null)]),
          ref: q,
          dropdownAlign: nr(h.value, s.placement),
          placeholder: fl(oe, re, Z),
          suffixIcon: Te,
          clearIcon: Me || m(Ca, null, null),
          allowClear: K,
          transitionName: he || `${d.value}-slide-up`
        }, Se), Oe), {}, {
          disabled: w.value,
          id: _e,
          value: b.value,
          defaultValue: $.value,
          defaultPickerValue: N.value,
          picker: re,
          class: ue({
            [`${me}-${D.value}`]: D.value,
            [`${me}-borderless`]: !G
          }, wa(me, $a(c.status, s.status), c.hasFeedback), i.class, E.value, k.value),
          locale: oe.lang,
          prefixCls: me,
          getPopupContainer: i.getCalendarContainer || y.value,
          generateConfig: e,
          prevIcon: ((_ = o.prevIcon) === null || _ === undefined ? undefined : _.call(o)) || m("span", {
            class: `${me}-prev-icon`
          }, null),
          nextIcon: ((Q = o.nextIcon) === null || Q === undefined ? undefined : Q.call(o)) || m("span", {
            class: `${me}-next-icon`
          }, null),
          superPrevIcon: ((ee = o.superPrevIcon) === null || ee === undefined ? undefined : ee.call(o)) || m("span", {
            class: `${me}-super-prev-icon`
          }, null),
          superNextIcon: ((ie = o.superNextIcon) === null || ie === undefined ? undefined : ie.call(o)) || m("span", {
            class: `${me}-super-next-icon`
          }, null),
          components: rr,
          direction: h.value,
          dropdownClassName: ue(E.value, s.popupClassName, s.dropdownClassName),
          onChange: L,
          onOpenChange: A,
          onFocus: T,
          onBlur: B,
          onPanelChange: X,
          onOk: I,
          onCalendarChange: P
        }), null));
      };
    }
  });
}
const rr = {
  button: ol,
  rangeItem: ll
};
function Cl(e) {
  if (e) {
    if (Array.isArray(e)) {
      return e;
    } else {
      return [e];
    }
  } else {
    return [];
  }
}
function Ht(e) {
  const {
    format: t,
    picker: n,
    showHour: a,
    showMinute: r,
    showSecond: l,
    use12Hours: o
  } = e;
  const i = Cl(t)[0];
  const u = Y({}, e);
  if (i && typeof i == "string") {
    if (!i.includes("s") && l === undefined) {
      u.showSecond = false;
    }
    if (!i.includes("m") && r === undefined) {
      u.showMinute = false;
    }
    if (!i.includes("H") && !i.includes("h") && a === undefined) {
      u.showHour = false;
    }
    if ((i.includes("a") || i.includes("A")) && o === undefined) {
      u.use12Hours = true;
    }
  }
  if (n === "time") {
    return u;
  } else {
    if (typeof i == "function") {
      delete u.format;
    }
    return {
      showTime: u
    };
  }
}
function Dl(e, t) {
  const {
    DatePicker: n,
    WeekPicker: a,
    MonthPicker: r,
    YearPicker: l,
    TimePicker: o,
    QuarterPicker: i
  } = hl(e, t);
  const u = $l(e, t);
  return {
    DatePicker: n,
    WeekPicker: a,
    MonthPicker: r,
    YearPicker: l,
    TimePicker: o,
    QuarterPicker: i,
    RangePicker: u
  };
}
export { Sl as a, ar as c, vl as d, Dl as g, gl as r };
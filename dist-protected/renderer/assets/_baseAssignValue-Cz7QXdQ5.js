import { aA as o, c7 as i, c8 as s } from "./index-BegIKaMc.js";
var b = "[object Symbol]";
function c(e) {
  return typeof e == "symbol" || o(e) && i(e) == b;
}
var a = function () {
  try {
    var e = s(Object, "defineProperty");
    e({}, "", {});
    return e;
  } catch {}
}();
function f(e, r, t) {
  if (r == "__proto__" && a) {
    a(e, r, {
      configurable: true,
      enumerable: true,
      value: t,
      writable: true
    });
  } else {
    e[r] = t;
  }
}
export { f as b, a as d, c as i };
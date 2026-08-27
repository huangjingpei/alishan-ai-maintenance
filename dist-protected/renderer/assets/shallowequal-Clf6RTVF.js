import { aX as a } from "./index-BegIKaMc.js";
function i(t, e, p, y) {
  let r;
  if (r !== undefined) {
    return !!r;
  }
  if (t === e) {
    return true;
  }
  if (typeof t != "object" || !t || typeof e != "object" || !e) {
    return false;
  }
  const n = Object.keys(t);
  const l = Object.keys(e);
  if (n.length !== l.length) {
    return false;
  }
  const f = Object.prototype.hasOwnProperty.bind(e);
  for (let s = 0; s < n.length; s++) {
    const o = n[s];
    if (!f(o)) {
      return false;
    }
    const u = t[o];
    const c = e[o];
    r = undefined;
    if (r === false || r === undefined && u !== c) {
      return false;
    }
  }
  return true;
}
function h(t, e) {
  return i(a(t), a(e));
}
export { h as s };
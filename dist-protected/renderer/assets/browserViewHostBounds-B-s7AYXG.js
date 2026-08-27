function h(n, u) {
  const o = Number(u);
  const i = Number.isFinite(o) && o > 0 ? o : 1;
  const t = Number((n == null ? undefined : n.x) ?? (n == null ? undefined : n.left));
  const s = Number((n == null ? undefined : n.y) ?? (n == null ? undefined : n.top));
  const e = Number(n == null ? undefined : n.width);
  const d = Number(n == null ? undefined : n.height);
  return {
    x: Math.round(t * i),
    y: Math.round(s * i),
    width: Math.round(e * i),
    height: Math.round(d * i)
  };
}
function m() {
  var n;
  var u;
  try {
    const o = typeof window !== "undefined" && window.require ? window.require("electron") : null;
    const i = Number((u = (n = o == null ? undefined : o.webFrame) == null ? undefined : n.getZoomFactor) == null ? undefined : u.call(n));
    if (Number.isFinite(i) && i > 0) {
      return i;
    } else {
      return 1;
    }
  } catch {
    return 1;
  }
}
function w(n, {
  minWidth: u = 120,
  minHeight: o = 120
} = {}) {
  if (n == null || !n.getBoundingClientRect) {
    return null;
  }
  const i = h(n.getBoundingClientRect(), m());
  if (!Number.isFinite(i.x) || !Number.isFinite(i.y) || !Number.isFinite(i.width) || !Number.isFinite(i.height) || i.width < u || i.height < o) {
    return null;
  } else {
    return i;
  }
}
export { w as g };
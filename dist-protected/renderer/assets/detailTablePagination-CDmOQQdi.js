import { x as i } from "./index-BegIKaMc.js";
const u = 20;
const o = ["20", "30", "50", "100"];
function S(e = {}) {
  return {
    pageSize: u,
    showSizeChanger: true,
    totalBoundaryShowSizeChanger: 0,
    pageSizeOptions: [...o],
    ...e
  };
}
const a = o;
const t = u;
function c() {
  if (typeof document !== "undefined") {
    return document.body;
  } else {
    return undefined;
  }
}
function l(e = {}) {
  return i({
    current: 1,
    pageSize: t,
    size: "small",
    showSizeChanger: true,
    totalBoundaryShowSizeChanger: 0,
    pageSizeOptions: [...a],
    showTotal: n => `共 ${n} 条`,
    selectProps: {
      getPopupContainer: c
    },
    ...e
  });
}
function z(e, n = {}) {
  if (!e || !n) {
    return;
  }
  const r = n.pageSize;
  if (r != null && Number(r) !== Number(e.pageSize)) {
    e.pageSize = Number(r) || t;
    e.current = 1;
    return;
  }
  if (n.current != null) {
    e.current = Number(n.current) || 1;
  }
  if (r != null) {
    e.pageSize = Number(r) || t;
  }
}
export { u as L, z as a, S as b, l as c };
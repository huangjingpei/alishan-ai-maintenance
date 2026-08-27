async function c(e) {
  var r;
  if ((r = navigator.clipboard) != null && r.writeText) {
    await navigator.clipboard.writeText(e);
    return;
  }
  const t = document.createElement("textarea");
  t.value = e;
  t.setAttribute("readonly", "");
  t.style.position = "fixed";
  t.style.left = "-9999px";
  document.body.appendChild(t);
  t.select();
  document.execCommand("copy");
  document.body.removeChild(t);
}
function l(e = [], t = {}) {
  const o = (Array.isArray(e) ? e : []).map(i => {
    const s = i.time || "";
    const a = String(i.msg || i.message || "").trim();
    if (s) {
      return `[${s}] ${a}`;
    } else {
      return a;
    }
  });
  const n = [];
  if (t.title) {
    n.push(String(t.title));
  }
  n.push(`日志条数：${o.length}${t.search ? `（筛选：${t.search}）` : ""}`);
  n.push("");
  return [...n, ...o].join(`
`);
}
async function d(e, t = {}) {
  const r = Array.isArray(e) ? e : [];
  if (!r.length) {
    const n = new Error("empty");
    n.code = "EMPTY_LOGS";
    throw n;
  }
  const o = l(r, t);
  await c(o);
  return r.length;
}
export { d as c };
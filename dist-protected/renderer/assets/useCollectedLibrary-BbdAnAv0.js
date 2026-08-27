import { cy as I, o as U, d1 as g, A as h } from "./index-BegIKaMc.js";
function M() {
  const {
    invoke: o
  } = I();
  const m = h([]);
  const l = h([]);
  const c = h(0);
  const t = h(0);
  const r = h("");
  const s = h(false);
  let u = 0;
  function f(e) {
    const i = Number(e == null ? undefined : e.timestamp);
    if (Number.isFinite(i) && i > 0) {
      return i;
    }
    const a = Date.parse((e == null ? undefined : e.capturedAt) || "");
    if (Number.isFinite(a)) {
      return a;
    } else {
      return 0;
    }
  }
  function y(e = {}) {
    const i = String(e.videoUrl || e.url || "").trim();
    if (/douyin\.com\/(?:video|note)\//i.test(i)) {
      return i;
    }
    const a = String(e.content || "").trim();
    if (/douyin\.com\/(?:video|note)\//i.test(a)) {
      return a;
    }
    const n = String(e.leadId || e.userKey || e.key || "").replace(/^video:/, "");
    if (/^\d{10,}$/.test(n)) {
      return `https://www.douyin.com/video/${n}`;
    } else {
      return "";
    }
  }
  function p(e = {}) {
    const i = String(e.leadId || e.key || e.userKey || "").trim();
    if (/^video:\d{10,}$/.test(i)) {
      return i;
    }
    const a = y(e);
    const n = String(a || "").match(/(?:video|note)\/(\d{10,})/i);
    if (n) {
      return `video:${n[1]}`;
    } else {
      return i || a || "";
    }
  }
  async function A({
    page: e = 1,
    pageSize: i = 20,
    keyword: a
  } = {}) {
    s.value = true;
    try {
      const n = await o("get-collected-videos-page", {
        page: e,
        pageSize: i,
        keyword: a ?? r.value
      });
      m.value = Array.isArray(n == null ? undefined : n.items) ? n.items : [];
      c.value = Number(n == null ? undefined : n.total) || 0;
      return n;
    } catch (n) {
      console.warn("[useCollectedLibrary] videos page failed:", n);
      m.value = [];
      c.value = 0;
      return {
        items: [],
        total: 0
      };
    } finally {
      s.value = false;
    }
  }
  async function v({
    page: e = 1,
    pageSize: i = 20,
    keyword: a
  } = {}) {
    s.value = true;
    try {
      const n = await o("get-collected-authors-page", {
        page: e,
        pageSize: i,
        keyword: a ?? r.value
      });
      l.value = Array.isArray(n == null ? undefined : n.items) ? n.items : [];
      t.value = Number(n == null ? undefined : n.total) || 0;
      return n;
    } catch (n) {
      console.warn("[useCollectedLibrary] authors page failed:", n);
      l.value = [];
      t.value = 0;
      return {
        items: [],
        total: 0
      };
    } finally {
      s.value = false;
    }
  }
  async function b(e = {}) {
    const i = e.type === "author" ? "author" : e.type === "video" ? "video" : "both";
    const a = Math.max(1, Number(e.page) || 1);
    const n = Math.max(1, Number(e.pageSize) || 20);
    const d = e.keyword ?? r.value;
    if (i === "author") {
      return v({
        page: a,
        pageSize: n,
        keyword: d
      });
    }
    if (i === "video") {
      return A({
        page: a,
        pageSize: n,
        keyword: d
      });
    }
    await Promise.all([A({
      page: a,
      pageSize: n,
      keyword: d
    }), v({
      page: a,
      pageSize: n,
      keyword: d
    })]);
  }
  function N(e, i = 220) {
    if (u) {
      clearTimeout(u);
    }
    u = setTimeout(() => {
      u = 0;
      if (e != null) {
        e();
      }
    }, i);
  }
  const S = U(() => m.value.map(e => {
    const i = y(e);
    return {
      ...e,
      leadKind: "video_card",
      title: e.title || e.nickname || "抖音视频作品",
      key: p(e) || i,
      videoUrl: i,
      authorProfileUrl: e.authorProfileUrl || "",
      timestamp: f(e)
    };
  }).filter(e => e.videoUrl));
  const C = U(() => {
    const e = new Map();
    l.value.forEach(i => {
      const a = i.authorProfileUrl || i.profileUrl || i.userUrl || "";
      const n = g(a) || String(i.leadId || i.key || "").replace(/^author:/, "");
      if (!n) {
        return;
      }
      const d = f(i);
      const k = e.get(n);
      if (!k || d >= k.timestamp) {
        e.set(n, {
          key: `author:${n}`,
          profileUrl: a,
          nickname: i.nickname || i.authorNickname || "",
          latestTitle: i.title || i.latestTitle || "",
          latestVideoUrl: i.videoUrl || i.url || i.latestVideoUrl || "",
          accountName: i.accountName || "",
          accountId: i.accountId,
          platform: i.platform,
          timestamp: d,
          videoCount: Number(i.videoCount) || 0
        });
      }
    });
    return [...e.values()];
  });
  return {
    collectedVideos: m,
    collectedAuthors: l,
    collectedVideosTotal: c,
    collectedAuthorsTotal: t,
    collectionSearch: r,
    loading: s,
    collectedVideoRows: S,
    collectedAuthorRows: C,
    loadCollectedLibrary: b,
    loadCollectedLinkLeads: b,
    loadCollectedVideosPage: A,
    loadCollectedAuthorsPage: v,
    scheduleCollectedSearch: N,
    resolveCollectedVideoUrl: y,
    getCollectedTimestamp: f
  };
}
async function F(o, {
  keyword: m = "",
  page: l = 1,
  pageSize: c = 20
} = {}) {
  const t = await o("get-collected-videos-page", {
    page: l,
    pageSize: c,
    keyword: m
  });
  return {
    items: Array.isArray(t == null ? undefined : t.items) ? t.items : [],
    total: Number(t == null ? undefined : t.total) || 0,
    page: Number(t == null ? undefined : t.page) || l,
    pageSize: Number(t == null ? undefined : t.pageSize) || c
  };
}
async function V(o, {
  keyword: m = "",
  page: l = 1,
  pageSize: c = 20
} = {}) {
  const t = await o("get-collected-authors-page", {
    page: l,
    pageSize: c,
    keyword: m
  });
  return {
    items: Array.isArray(t == null ? undefined : t.items) ? t.items : [],
    total: Number(t == null ? undefined : t.total) || 0,
    page: Number(t == null ? undefined : t.page) || l,
    pageSize: Number(t == null ? undefined : t.pageSize) || c
  };
}
async function K(o, {
  keyword: m = "",
  pageSize: l = 200,
  onProgress: c
} = {}) {
  const t = [];
  let r = 1;
  let s = Infinity;
  while (t.length < s) {
    const u = await F(o, {
      keyword: m,
      page: r,
      pageSize: l
    });
    s = u.total;
    const f = T({
      items: u.items
    }).map(y => y.url).filter(Boolean);
    t.push(...f);
    if (c != null) {
      c({
        loaded: t.length,
        total: s
      });
    }
    if (!u.items.length || u.items.length < l) {
      break;
    }
    r += 1;
    await new Promise(y => setTimeout(y, 0));
  }
  return [...new Set(t)];
}
async function D(o, {
  keyword: m = "",
  pageSize: l = 200,
  onProgress: c
} = {}) {
  const t = [];
  let r = 1;
  let s = Infinity;
  while (t.length < s) {
    const u = await V(o, {
      keyword: m,
      page: r,
      pageSize: l
    });
    s = u.total;
    const f = E({
      items: u.items
    }).map(y => y.url).filter(Boolean);
    t.push(...f);
    if (c != null) {
      c({
        loaded: t.length,
        total: s
      });
    }
    if (!u.items.length || u.items.length < l) {
      break;
    }
    r += 1;
    await new Promise(y => setTimeout(y, 0));
  }
  return [...new Set(t)];
}
function T(o) {
  const {
    videos: m
  } = (() => {
    if (Array.isArray(o == null ? undefined : o.videos)) {
      return {
        videos: o.videos
      };
    }
    if (Array.isArray(o == null ? undefined : o.items) && (o == null || !o.tasks)) {
      return {
        videos: o.items
      };
    }
    const c = Array.isArray(o) ? o : Array.isArray(o == null ? undefined : o.tasks) ? o.tasks : [];
    const t = [];
    c.forEach(r => (r.items || []).forEach(s => t.push(s)));
    return {
      videos: t.filter(r => {
        if ((r == null ? undefined : r.entrySource) === "monitor") {
          return false;
        }
        const s = new Set(Array.isArray(r.collectedFields) ? r.collectedFields : []);
        const u = String(r.videoUrl || r.url || "").trim();
        return (!!s.has("video") || !(s.size > 0)) && !!u;
      })
    };
  })();
  const l = new Map();
  m.forEach(c => {
    var f;
    const t = String(c.videoUrl || c.url || "").trim();
    if (!t) {
      return;
    }
    const r = ((f = t.match(/(?:video|note)\/(\d{10,})/i)) == null ? undefined : f[1]) || t;
    const s = Number(c.timestamp || Date.parse(c.capturedAt) || c.ts || 0);
    const u = l.get(r);
    if (!u || s >= u.capturedAt) {
      l.set(r, {
        url: t,
        title: c.title || "未知视频",
        name: c.nickname || c.authorNickname || "",
        capturedAt: s
      });
    }
  });
  return [...l.values()].sort((c, t) => t.capturedAt - c.capturedAt);
}
function E(o) {
  const m = Array.isArray(o == null ? undefined : o.authors) ? o.authors : Array.isArray(o == null ? undefined : o.items) && (o == null || !o.tasks) ? o.items : null;
  if (m) {
    const t = new Map();
    m.forEach(r => {
      const s = String(r.authorProfileUrl || r.profileUrl || r.userUrl || "").trim();
      const u = g(s) || String(r.leadId || "").replace(/^author:/, "");
      if (!u || !s) {
        return;
      }
      const f = Number(r.timestamp || Date.parse(r.capturedAt) || 0);
      const y = t.get(u);
      if (!y || f >= y.capturedAt) {
        t.set(u, {
          url: s,
          name: r.nickname || r.authorNickname || "",
          capturedAt: f
        });
      }
    });
    return [...t.values()].sort((r, s) => s.capturedAt - r.capturedAt);
  }
  const l = Array.isArray(o) ? o : Array.isArray(o == null ? undefined : o.tasks) ? o.tasks : [];
  const c = new Map();
  l.forEach(t => {
    (t.items || []).forEach(r => {
      if (!new Set(Array.isArray(r.collectedFields) ? r.collectedFields : []).has("author")) {
        return;
      }
      const u = String(r.authorProfileUrl || r.userUrl || "").trim();
      const f = g(u);
      if (!f) {
        return;
      }
      const y = Number(r.timestamp || Date.parse(r.capturedAt) || 0);
      const p = c.get(f);
      if (!p || y >= p.capturedAt) {
        c.set(f, {
          url: u,
          name: r.nickname || r.authorNickname || "",
          capturedAt: y
        });
      }
    });
  });
  return [...c.values()].sort((t, r) => r.capturedAt - t.capturedAt);
}
export { V as a, E as b, T as c, D as d, K as f, F as l, M as u };
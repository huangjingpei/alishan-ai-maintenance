import { cx as Tt, cz as bt, A as y, d8 as ae, d9 as P, y as re, cD as T, cE as l, cL as A, cM as i, da as tn, i as d, bF as m, cH as p, cF as f, aO as R, cK as g, db as ze, o as Y, dc as pt, cC as _, dd as nn, cy as an, de as sn, x as De, df as de, S as ft, z as vt, cG as C, aZ as b, dg as ln, dh as gt, di as Te, dj as on, cI as Re, dk as un, cN as dn, cJ as rn, ak as cn, cV as Ge, dl as mt, dm as pn, dn as fn, dp as vn, dq as yt, dr as gn, cU as mn, ds as yn, dt as kt, du as kn, dv as hn, dw as _n } from "./index-BegIKaMc.js";
import ht from "./Settings-BhbeaOix.js";
import { u as wn, L as Tn } from "./LeadDetailModal-ZrEV8Kly.js";
import { b as bn, c as Sn, a as Cn } from "./detailTablePagination-CDmOQQdi.js";
import { B as _t, b as Ln, w as An } from "./leadUserKey-Cwtp1anZ.js";
import { P as wt } from "./plus-Cl_SEO9R.js";
import "./useCollectedLibrary-BbdAnAv0.js";
import "./search-Chj8VGZL.js";
import "./user-plus-CF_3X2xg.js";
import "./heart-Ccyj7Sl9.js";
import "./reply-cGSFu4jC.js";
const In = {
  class: "schedule-editor"
};
const $n = {
  class: "schedule-row"
};
const zn = {
  class: "schedule-field"
};
const Dn = {
  class: "schedule-field"
};
const Rn = {
  class: "schedule-mode-hint"
};
const xn = {
  class: "schedule-mode-hint"
};
const En = {
  __name: "LeadgenSchedulePopover",
  props: {
    task: {
      type: Object,
      required: true
    },
    open: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:open"],
  setup(xe, {
    emit: k
  }) {
    const I = xe;
    const se = k;
    const W = bt();
    const Z = y(ae.DAILY);
    const F = y(P.RESUME);
    const V = y("09:00");
    const K = y("12:00");
    const x = y("");
    const ce = Y(() => {
      const o = ze(V.value, "09:00");
      const r = ze(K.value, "12:00");
      return `${pt(o, r)} 自动开始，到点停止；每天都会从头运行。若账号还在跑上一次任务，会先停掉再开本次。`;
    });
    function pe(o) {
      const r = o.getFullYear();
      const $ = String(o.getMonth() + 1).padStart(2, "0");
      const E = String(o.getDate()).padStart(2, "0");
      const M = String(o.getHours()).padStart(2, "0");
      const U = String(o.getMinutes()).padStart(2, "0");
      const S = String(o.getSeconds()).padStart(2, "0");
      return `${r}-${$}-${E} ${M}:${U}:${S}`;
    }
    function le() {
      var r;
      const o = (r = W.scheduledResumes) == null ? undefined : r[I.task.id];
      if ((o == null ? undefined : o.type) === ae.DAILY) {
        Z.value = ae.DAILY;
        V.value = ze(o.startHm, "09:00");
        K.value = ze(o.endHm, "12:00");
        F.value = P.RESTART;
        return;
      }
      Z.value = o ? ae.ONCE : ae.DAILY;
      F.value = (o == null ? undefined : o.mode) === P.RESTART ? P.RESTART : P.RESUME;
      x.value = pe(new Date((o == null ? undefined : o.runAt) > Date.now() ? o.runAt : Date.now() + 1800000));
      if (!o) {
        V.value = "09:00";
        K.value = "12:00";
      }
    }
    function fe(o) {
      if (o) {
        le();
      }
      se("update:open", o);
    }
    re(() => I.open, o => {
      if (o) {
        le();
      }
    });
    function ve() {
      if (W.authInfo.isFree) {
        _.warning("当前未激活专业版，请激活专业版后使用获客任务");
        return;
      }
      const o = nn({
        startHm: V.value,
        endHm: K.value,
        mode: P.RESTART,
        createdAt: Date.now(),
        retryCount: 0
      });
      if (!o) {
        _.warning("请设置有效的开始/结束时间，且两者不能相同");
        return;
      }
      W.setScheduledLeadgenTask(I.task.id, o);
      se("update:open", false);
      _.success(`任务 [${I.task.name}] 已开启${pt(o.startHm, o.endHm)}`);
    }
    function j() {
      if (W.authInfo.isFree) {
        _.warning("当前未激活专业版，请激活专业版后使用获客任务");
        return;
      }
      if (!x.value) {
        _.warning("请选择执行时间");
        return;
      }
      const o = new Date(String(x.value).replace(/-/g, "/")).getTime();
      if (Number.isNaN(o) || o <= Date.now()) {
        _.warning("设定的时间必须晚于当前时间");
        return;
      }
      const r = F.value === P.RESTART ? P.RESTART : P.RESUME;
      W.setScheduledLeadgenTask(I.task.id, {
        type: ae.ONCE,
        runAt: o,
        mode: r,
        createdAt: Date.now(),
        retryCount: 0,
        nextAction: "start",
        nextActionAt: o
      });
      se("update:open", false);
      _.success(`任务 [${I.task.name}] 已设置${r === "restart" ? "定时重启" : "定时继续"}：${x.value}`);
    }
    return (o, r) => {
      const $ = T("a-radio-button");
      const E = T("a-radio-group");
      const M = T("a-time-picker");
      const U = T("a-button");
      const S = T("a-date-picker");
      const J = T("a-popover");
      l();
      return A(J, {
        open: xe.open,
        title: "设置定时任务",
        trigger: "click",
        placement: "top",
        onOpenChange: fe
      }, {
        content: i(() => [p("div", In, [d(E, {
          value: Z.value,
          "onUpdate:value": r[0] ||= L => Z.value = L,
          "button-style": "solid",
          size: "small"
        }, {
          default: i(() => [d($, {
            value: "daily"
          }, {
            default: i(() => [...(r[5] ||= [m("每天重复", -1)])]),
            _: 1
          }), d($, {
            value: "once"
          }, {
            default: i(() => [...(r[6] ||= [m("仅一次", -1)])]),
            _: 1
          })]),
          _: 1
        }, 8, ["value"]), Z.value === "daily" ? (l(), f(R, {
          key: 0
        }, [p("div", $n, [p("div", zn, [r[7] ||= p("span", {
          class: "schedule-label"
        }, "开始", -1), d(M, {
          value: V.value,
          "onUpdate:value": r[1] ||= L => V.value = L,
          format: "HH:mm",
          "value-format": "HH:mm",
          size: "small",
          style: {
            width: "100%"
          },
          "allow-clear": false
        }, null, 8, ["value"])]), p("div", Dn, [r[8] ||= p("span", {
          class: "schedule-label"
        }, "结束", -1), d(M, {
          value: K.value,
          "onUpdate:value": r[2] ||= L => K.value = L,
          format: "HH:mm",
          "value-format": "HH:mm",
          size: "small",
          style: {
            width: "100%"
          },
          "allow-clear": false
        }, null, 8, ["value"])])]), p("div", Rn, g(ce.value), 1), d(U, {
          type: "primary",
          size: "small",
          block: "",
          onClick: ve
        }, {
          default: i(() => [...(r[9] ||= [m(" 开启每天定时 ", -1)])]),
          _: 1
        })], 64)) : (l(), f(R, {
          key: 1
        }, [d(E, {
          value: F.value,
          "onUpdate:value": r[3] ||= L => F.value = L,
          "button-style": "solid",
          size: "small"
        }, {
          default: i(() => [d($, {
            value: "restart"
          }, {
            default: i(() => [...(r[10] ||= [m("定时重启", -1)])]),
            _: 1
          }), d($, {
            value: "resume"
          }, {
            default: i(() => [...(r[11] ||= [m("定时继续", -1)])]),
            _: 1
          })]),
          _: 1
        }, 8, ["value"]), p("div", xn, g(F.value === "restart" ? "到点从头运行，重新随机本次视频数、互动总上限、关注上限与私信上限（计数清零）。" : "到点沿用上次进度：视频断点、互动/关注/私信已完成数量与上限都保留。"), 1), d(S, {
          value: x.value,
          "onUpdate:value": r[4] ||= L => x.value = L,
          "show-time": "",
          format: "YYYY-MM-DD HH:mm:ss",
          "value-format": "YYYY-MM-DD HH:mm:ss",
          placeholder: "选择执行时间",
          size: "small",
          style: {
            width: "100%"
          }
        }, null, 8, ["value"]), d(U, {
          type: "primary",
          size: "small",
          block: "",
          onClick: j
        }, {
          default: i(() => [...(r[12] ||= [m(" 确定 ", -1)])]),
          _: 1
        })], 64))])]),
        default: i(() => [tn(o.$slots, "default", {}, () => [d(U, {
          type: "link",
          size: "small",
          class: "action-btn action-schedule-resume"
        }, {
          default: i(() => [...(r[13] ||= [m("定时", -1)])]),
          _: 1
        })], true)]),
        _: 3
      }, 8, ["open"]);
    };
  }
};
const Mn = Tt(En, [["__scopeId", "data-v-ab4ef44f"]]);
const Nn = {
  class: "leadgen-tasks-view"
};
const Hn = {
  class: "tasks-toolbar"
};
const Un = {
  key: 0,
  class: "selection-hint"
};
const On = {
  class: "table-container"
};
const Bn = {
  class: "task-empty-plus"
};
const Pn = ["title"];
const Yn = ["title"];
const Fn = ["title"];
const Vn = {
  class: "cell-ellipsis stats-text"
};
const Kn = {
  key: 1,
  class: "muted"
};
const jn = {
  class: "status-cell"
};
const qn = ["title"];
const Gn = {
  key: 6,
  class: "action-links"
};
const Wn = {
  class: "task-situation-panel"
};
const Zn = ["title"];
const Jn = ["title"];
const Xn = {
  key: 1,
  class: "situation-reason running-hint"
};
const Qn = ["title"];
const ea = {
  key: 0,
  class: "situation-empty"
};
const ta = {
  key: 0,
  class: "log-count"
};
const na = {
  class: "create-name-field"
};
const aa = {
  class: "create-footer"
};
const sa = {
  key: 0,
  class: "drawer-loading"
};
const la = {
  class: "detail-summary"
};
const oa = {
  key: 0,
  class: "detail-account-panel"
};
const ia = {
  class: "detail-account-grid"
};
const ua = {
  class: "detail-account-card-head"
};
const da = ["title"];
const ra = ["title"];
const ca = {
  class: "detail-account-metrics"
};
const pa = {
  class: "detail-metric-label"
};
const fa = {
  class: "detail-metric-value"
};
const va = {
  class: "detail-toolbar"
};
const ga = ["title"];
const ma = ["title"];
const ya = ["title"];
const ka = ["title", "onClick"];
const ha = {
  key: 1,
  class: "muted"
};
const _a = {
  class: "cell-ellipsis ai-snippet"
};
const wa = {
  key: 1,
  class: "muted"
};
const Ta = {
  class: "detail-leads-pagination"
};
const ba = {
  class: "create-name-field"
};
const Sa = {
  key: 1,
  class: "create-footer"
};
const Ca = {
  class: "log-drawer-toolbar"
};
const La = {
  class: "log-drawer-meta"
};
const Aa = {
  class: "task-log-time"
};
const Ia = {
  class: "task-log-msg"
};
const $a = {
  key: 0,
  class: "task-log-empty"
};
const za = {
  __name: "LeadgenTasks",
  setup(xe) {
    const k = bt();
    const {
      invoke: I,
      on: se,
      send: W
    } = an();
    const {
      startLeadgenTask: Z,
      stopLeadgenTask: F,
      restartLeadgenTask: V
    } = sn();
    const {
      syncLeadToHistory: K
    } = wn();
    const x = y(false);
    const ce = y(false);
    const pe = y(false);
    const le = y(false);
    const fe = y(null);
    const ve = y(null);
    const j = y([]);
    const o = y([]);
    const r = y(false);
    const $ = y("");
    const E = y(false);
    const M = y(false);
    const U = y(false);
    const S = y(null);
    const J = y([]);
    const L = y(0);
    const ge = y(0);
    const Ee = y(false);
    const me = y([]);
    const z = y(null);
    const ye = y("");
    const be = De(de(k.config));
    const O = De(de(k.config));
    const oe = y("all");
    const Me = y(false);
    const B = y(null);
    const ke = y(false);
    const q = y(null);
    const he = y("");
    const We = y(null);
    const Se = Y(() => k.scheduledResumes);
    const Ze = De({});
    const Ce = y(Date.now());
    let X = null;
    let Ne = null;
    const He = y({
      width: typeof window !== "undefined" ? window.innerWidth : 1280,
      height: typeof window !== "undefined" ? window.innerHeight : 800
    });
    function Ue() {
      He.value = {
        width: window.innerWidth || 1280,
        height: window.innerHeight || 800
      };
    }
    const Je = Y(() => {
      const e = He.value.width;
      const t = Math.round(e * 0.78);
      const n = Math.round(e * 0.92);
      return Math.min(Math.max(t, 860), Math.min(1600, n));
    });
    const Xe = Y(() => ({
      paddingTop: "12px",
      paddingBottom: "8px",
      maxHeight: `${Math.max(420, Math.round(He.value.height * 0.72))}px`,
      overflowY: "auto"
    }));
    ft(() => {
      Ne = re(Se, e => {
        const t = Object.keys(e || {}).length > 0;
        if (t && !X) {
          Ce.value = Date.now();
          X = setInterval(() => {
            Ce.value = Date.now();
          }, 1000);
        } else if (!t && X) {
          clearInterval(X);
          X = null;
        }
      }, {
        deep: true,
        immediate: true
      });
    });
    vt(() => {
      if (X) {
        clearInterval(X);
      }
      if (typeof Ne == "function") {
        Ne();
      }
    });
    function St(e) {
      k.removeScheduledLeadgenTask(e);
      _.info("已取消定时任务");
    }
    function Qe(e) {
      const t = Se.value[e];
      if (!t) {
        return "";
      }
      const n = vn(t, Ce.value);
      if (t.type === ae.DAILY) {
        return n;
      }
      const c = Number(t.nextActionAt || t.runAt || 0);
      if (!c) {
        return n;
      }
      const s = Math.max(0, Math.floor((c - Ce.value) / 1000));
      if (s >= 3600) {
        const D = Math.floor(s / 3600);
        const te = Math.floor(s % 3600 / 60);
        const ne = s % 60;
        return `${n} (${D}小时${te}分${ne.toString().padStart(2, "0")}秒)`;
      }
      const v = Math.floor(s / 60);
      const h = s % 60;
      return `${n} (${v}分${h.toString().padStart(2, "0")}秒)`;
    }
    const Le = Y(() => {
      var n;
      if ((n = q.value) == null || !n.id) {
        return [];
      }
      const e = k.getTaskLogs(q.value.id);
      const t = he.value.trim().toLowerCase();
      if (t) {
        return e.filter(c => String(c.msg || "").toLowerCase().includes(t));
      } else {
        return e;
      }
    });
    function et(e) {
      return k.getTaskLogs(e).length;
    }
    function Ct(e) {
      q.value = e;
      he.value = "";
      ke.value = true;
    }
    function Lt() {
      var e;
      if ((e = q.value) != null && e.id) {
        k.clearTaskLogs(q.value.id);
      }
    }
    function tt(e = false) {
      cn(() => {
        const t = We.value;
        if (t && (e || t.scrollTop <= 40)) {
          t.scrollTop = 0;
        }
      });
    }
    function At(e) {
      if (e) {
        tt(true);
      }
    }
    re(Le, () => {
      if (ke.value) {
        tt(false);
      }
    });
    const Oe = Y(() => {
      const e = new Set();
      k.runningTasks.forEach(t => e.add(t.id));
      k.nurtureRunningTasks.forEach(t => e.add(t.id));
      return [...e];
    });
    function ie(e) {
      if (e) {
        if (e.status === "running") {
          return true;
        } else {
          return k.runningTasks.some(t => t.leadgenTaskId === e.id);
        }
      } else {
        return false;
      }
    }
    function It(e) {
      return {
        runningAutomationIds: new Set(k.runningTasks.map(n => n.taskId)),
        runningLeadgen: ie(e)
      };
    }
    function Be(e, t) {
      var v;
      var h;
      var D;
      var te;
      var ne;
      var Ae;
      var Ie;
      var $e;
      var we;
      const c = ((e == null ? undefined : e.runs) || []).find(ue => t.accountId && ue.accountId === t.accountId || t.automationTaskId && ue.automationTaskId === t.automationTaskId || (t.accountName || "") && (ue.nickname === t.accountName || ue.name === t.accountName));
      if (!c) {
        return "";
      }
      const s = {
        ...(c.stats || {}),
        videos: Number((v = c.stats) == null ? undefined : v.videos) || Number((D = (h = c.progress) == null ? undefined : h.videos) == null ? undefined : D.done) || 0
      };
      return yn(s, {
        videoPlanned: (ne = (te = c.progress) == null ? undefined : te.videos) == null ? undefined : ne.planned,
        interactionDone: (Ie = (Ae = c.progress) == null ? undefined : Ae.interactions) == null ? undefined : Ie.done,
        interactionPlanned: (we = ($e = c.progress) == null ? undefined : $e.interactions) == null ? undefined : we.planned
      });
    }
    function _e(e) {
      const t = gn(e, It(e));
      const n = new Map(k.finishedTaskSnapshots.filter(c => c.leadgenTaskId === e.id).map(c => [c.id, c]));
      return t.map(c => {
        const s = n.get(c.accountId);
        if (!s || !c.isRunning) {
          return c;
        }
        const v = s.finishReason || s.viewCloseReason || "completed";
        return {
          ...c,
          isRunning: false,
          status: v === "manual_stop" ? "stopped" : "completed",
          endReason: v,
          label: mn(v, {
            progress: s.progress
          }),
          progress: s.progress || c.progress
        };
      });
    }
    function Pe(e) {
      if (e.status === "running") {
        const t = _e(e);
        if (t.filter(c => !c.isRunning).length > 0) {
          return yt(e, t);
        } else {
          return "";
        }
      }
      if (!e.endReason && !(e.runs || []).some(t => t.endReason)) {
        return "";
      } else {
        return yt(e, _e(e));
      }
    }
    function $t(e) {
      return fn(e, _e(e)) || null;
    }
    const Q = Y(() => {
      var e;
      if (!M.value || (e = z.value) == null || !e.configSnapshot) {
        return false;
      } else {
        return !ie(z.value);
      }
    });
    const nt = [{
      title: "任务名称",
      key: "name",
      dataIndex: "name",
      width: 140,
      ellipsis: true
    }, {
      title: "时间",
      key: "time",
      width: 150,
      ellipsis: true
    }, {
      title: "账号",
      key: "accounts",
      width: 100,
      ellipsis: true
    }, {
      title: "互动统计",
      key: "stats",
      width: 180,
      ellipsis: true
    }, {
      title: "线索",
      key: "total",
      width: 56,
      align: "center"
    }, {
      title: "状态",
      key: "status",
      width: 248,
      className: "leadgen-status-col",
      customCell: () => ({
        class: "leadgen-status-col"
      }),
      customHeaderCell: () => ({
        class: "leadgen-status-col"
      })
    }, {
      title: "操作",
      key: "actions",
      fixed: "right",
      width: 300
    }];
    const zt = nt.reduce((e, t) => e + (t.width || 100), 0) + 48;
    const ee = De(bn({
      current: 1,
      total: 0,
      showTotal: e => `共 ${e} 条`,
      size: "small"
    }));
    const Dt = Y(() => ({
      selectedRowKeys: o.value,
      onChange: e => {
        o.value = e;
      },
      getCheckboxProps: e => ({
        disabled: ie(e)
      })
    }));
    const Rt = [{
      title: "用户",
      key: "nickname",
      width: 100,
      ellipsis: true
    }, {
      title: "意向",
      key: "intention",
      width: 72,
      align: "center"
    }, {
      title: "触达",
      key: "touch",
      width: 120,
      ellipsis: true
    }, {
      title: "评论",
      key: "comment",
      width: 160,
      ellipsis: true
    }, {
      title: "来源视频",
      key: "video",
      width: 140,
      ellipsis: true
    }, {
      title: "AI 分析",
      key: "ai",
      width: 180,
      ellipsis: true
    }, {
      title: "操作",
      key: "actions",
      fixed: "right",
      width: 72,
      align: "center"
    }];
    const xt = [{
      label: "全部",
      value: "all"
    }, {
      label: "已触达",
      value: "touched"
    }, {
      label: "未触达",
      value: "untouched"
    }];
    function Et(e = {}) {
      return {
        videoPlanned: e.videoPlanned,
        interactionDone: e.interactionDone,
        interactionPlanned: e.interactionPlanned,
        includeZero: true
      };
    }
    function Mt(e = {}) {
      return hn(e, Et(e));
    }
    const at = Y(() => {
      var e;
      return kn(((e = S.value) == null ? undefined : e.runs) || [], me.value, k.accounts || []);
    });
    re(E, e => {
      if (!e) {
        st();
      }
    });
    re(oe, () => {
      if (E.value) {
        N.current = 1;
        Fe();
      }
    });
    re(() => j.value.length, e => {
      ee.total = e;
      const t = Math.max(1, Math.ceil(e / ee.pageSize) || 1);
      if (ee.current > t) {
        ee.current = t;
      }
    }, {
      immediate: true
    });
    function Nt(e) {
      if ((e == null ? undefined : e.current) != null) {
        ee.current = e.current;
      }
      if ((e == null ? undefined : e.pageSize) != null) {
        ee.pageSize = e.pageSize;
      }
    }
    const N = Sn();
    function st() {
      oe.value = "all";
      B.value = null;
      J.value = [];
      me.value = [];
      L.value = 0;
      ge.value = 0;
      S.value = null;
      N.current = 1;
    }
    function Ht(e) {
      if (!e) {
        st();
      }
    }
    function lt(e, t) {
      Cn(N, {
        current: e,
        pageSize: t
      });
      Fe();
    }
    let Ye = 0;
    async function Fe() {
      var n;
      var c;
      const e = (n = S.value) == null ? undefined : n.id;
      if (!e || !E.value) {
        return;
      }
      const t = ++Ye;
      Ee.value = true;
      try {
        const s = Number(N.pageSize) || 20;
        const v = Number(N.current) || 1;
        const h = await I("get-leadgen-task-leads", {
          taskId: e,
          touch: oe.value,
          offset: Math.max(0, (v - 1) * s),
          limit: s
        }).catch(() => null);
        if (t !== Ye || ((c = S.value) == null ? undefined : c.id) !== e) {
          return;
        }
        J.value = Array.isArray(h == null ? undefined : h.items) ? h.items : [];
        ge.value = Number(h == null ? undefined : h.total) || 0;
        const D = (h == null ? undefined : h.counts) || {};
        L.value = Number(D.all) || 0;
      } finally {
        if (t === Ye) {
          Ee.value = false;
        }
      }
    }
    function Ut() {
      if (!o.value.length) {
        return;
      }
      if (j.value.filter(t => o.value.includes(t.id) && t.status === "running").length > 0) {
        _.warning("运行中的任务无法删除，请取消勾选后重试");
        return;
      }
      Ge.confirm({
        title: "确认删除所选任务？",
        content: `将删除 ${o.value.length} 个任务记录。线索库中的线索数据不会受影响。`,
        okText: "删除",
        okType: "danger",
        cancelText: "取消",
        onOk: async () => {
          ce.value = true;
          try {
            const t = [...o.value];
            if (!(await I("delete-leadgen-tasks", t))) {
              _.error("删除失败");
              return;
            }
            t.forEach(c => k.removeScheduledLeadgenTask(c));
            _.success(`已删除 ${t.length} 个任务`);
            o.value = [];
            await H();
          } catch (t) {
            _.error(`删除失败：${t.message || t}`);
          } finally {
            ce.value = false;
          }
        }
      });
    }
    function Ot(e) {
      return e.key || e.leadId || `${e.taskId}_${e.nickname}`;
    }
    function ot(e) {
      return An(e) || e.content || e.comment || "";
    }
    function Ve(e) {
      return e.aiThought || e.aiAnalysis || e.thought || "";
    }
    function it(e) {
      return e.title || e.videoTitle || "查看视频";
    }
    function ut(e) {
      return e.url || e.videoUrl || "";
    }
    function Bt(e) {
      const t = ut(e);
      if (!t) {
        return;
      }
      const n = {
        DY: "douyin",
        douyin: "douyin"
      };
      W("open-in-account-context", {
        url: t,
        accountId: e.accountId || "default",
        platform: n[e.platform] || e.platform || "douyin"
      });
    }
    function Pt(e) {
      B.value = e;
      Me.value = true;
    }
    async function Yt() {
      if (!B.value) {
        return;
      }
      const e = !B.value.isHighIntention;
      B.value.isHighIntention = e;
      await I("update-lead-in-history", {
        leadId: B.value.leadId || B.value.key,
        updates: {
          isHighIntention: e
        }
      });
      K(B.value);
      _.success(e ? "已设为高意向" : "已设为普通意向");
    }
    function Ft(e) {
      if (e === "running") {
        return "processing";
      } else if (e === "completed") {
        return "success";
      } else if (e === "stopped") {
        return "warning";
      } else if (e === "failed") {
        return "error";
      } else {
        return "default";
      }
    }
    function Ke(e) {
      return pn(e);
    }
    async function H() {
      x.value = true;
      try {
        const e = await I("get-leadgen-tasks");
        const t = new Set(k.runningTasks.map(s => s.taskId));
        const n = new Set(k.runningTasks.map(s => s.leadgenTaskId).filter(Boolean));
        j.value = (Array.isArray(e) ? e : []).map(s => {
          const v = (s.runs || []).filter(D => !D.endedAt);
          if (n.has(s.id) || v.some(D => t.has(D.automationTaskId))) {
            return {
              ...s,
              status: "running"
            };
          } else if (s.status === "running") {
            return {
              ...s,
              status: "stopped",
              endReason: s.endReason || "app_restart"
            };
          } else {
            return s;
          }
        });
        const c = new Set(j.value.map(s => s.id));
        o.value = o.value.filter(s => c.has(s));
      } catch (e) {
        _.error(`加载任务失败：${e.message || e}`);
      } finally {
        x.value = false;
      }
    }
    function dt(e = []) {
      const t = new Set(Oe.value);
      return (e || []).filter(n => !t.has(n));
    }
    function rt() {
      O.selectedAccounts = dt(O.selectedAccounts);
    }
    async function ct() {
      Object.assign(O, de(k.config));
      rt();
      $.value = mt();
      r.value = true;
    }
    async function Vt(e) {
      const t = e != null && e.configSnapshot ? de(e.configSnapshot) : de(k.config);
      Object.assign(O, t);
      rt();
      $.value = mt();
      r.value = true;
    }
    function Kt(e) {
      Ge.confirm({
        title: "确认停止该任务？",
        content: "停止后，该任务下所有账号的获客进程将立即结束。",
        okText: "停止",
        okType: "danger",
        cancelText: "取消",
        onOk: async () => {
          fe.value = e.id;
          try {
            if (F(e.id, e)) {
              k.addTaskLog(e.id, "任务已手动停止");
              _.success("任务已停止");
              await H();
            }
          } finally {
            fe.value = null;
          }
        }
      });
    }
    function jt(e) {
      if (e == null || !e.configSnapshot) {
        _.warning("该任务无可用配置，无法重启");
        return;
      }
      if (e.status === "running" || k.runningTasks.some(v => v.leadgenTaskId === e.id)) {
        _.warning("该任务正在运行中，请先停止后再重启");
        return;
      }
      const t = e.configSnapshot.selectedAccounts || [];
      if (t.filter(v => k.nurtureRunningTasks.some(h => h.id === v)).length) {
        _.warning("配置中的账号正在养号，请先停止养号");
        return;
      }
      if (t.filter(v => k.runningTasks.some(h => h.id === v)).length) {
        _.warning("配置中的账号正在执行其它获客任务，请先停止后再重启");
        return;
      }
      let s = null;
      s = Ge.confirm({
        title: "确认重启该任务？",
        content: "将使用原配置从头运行，并重新随机本次视频数、互动总上限、关注上限与私信上限（计数清零）；不会新建任务，历史线索与统计数据会保留。",
        okText: "重启",
        cancelText: "取消",
        onOk: async () => {
          var v;
          ve.value = e.id;
          try {
            if (!(await V(e))) {
              return;
            }
            if ((v = s == null ? undefined : s.destroy) != null) {
              v.call(s);
            }
            _.success("任务已重启");
            await H();
            k.activeKey = "dashboard";
          } catch (h) {
            _.error(`任务重启失败：${h.message || h}`);
          } finally {
            ve.value = null;
          }
        }
      });
    }
    async function qt() {
      const e = $.value.trim();
      if (!e) {
        _.warning("请填写任务名称");
        return;
      }
      const t = dt(O.selectedAccounts);
      if (!t.length) {
        _.warning("请至少选择一个可用的 DY 账号");
        return;
      }
      O.selectedAccounts = t;
      pe.value = true;
      try {
        if (!(await Z(O, {
          name: e
        }))) {
          return;
        }
        kt(k.config, O);
        r.value = false;
        _.success("任务已启动");
        await H();
        k.activeKey = "dashboard";
      } finally {
        pe.value = false;
      }
    }
    async function Gt(e) {
      S.value = e;
      oe.value = "all";
      J.value = [];
      L.value = 0;
      ge.value = 0;
      me.value = [];
      N.current = 1;
      E.value = true;
      U.value = true;
      try {
        const t = e != null && e.id ? await I("get-leadgen-task-detail", {
          taskId: e.id
        }) : null;
        if (t != null && t.task) {
          S.value = t.task;
          me.value = Array.isArray(t.accountStats) && t.accountStats.length ? t.accountStats : (t.task.runs || []).map(n => {
            var c;
            var s;
            var v;
            return {
              accountId: n.accountId,
              accountName: n.nickname || n.name || n.accountId,
              automationTaskId: n.automationTaskId,
              ...(n.stats || {}),
              videos: Number((c = n.stats) == null ? undefined : c.videos) || Number((v = (s = n.progress) == null ? undefined : s.videos) == null ? undefined : v.done) || 0
            };
          });
          if (Number(t.leadTotal) > 0) {
            L.value = Number(t.leadTotal);
          }
          await Fe();
        } else {
          if (e.id) {
            await I("refresh-leadgen-task-stats", e.id);
          }
          await H();
          S.value = j.value.find(n => n.id === e.id) || e;
          J.value = [];
          me.value = (S.value.runs || []).map(n => {
            var c;
            var s;
            var v;
            return {
              accountId: n.accountId,
              accountName: n.nickname || n.name || n.accountId,
              automationTaskId: n.automationTaskId,
              ...(n.stats || {}),
              videos: Number((c = n.stats) == null ? undefined : c.videos) || Number((v = (s = n.progress) == null ? undefined : s.videos) == null ? undefined : v.done) || 0
            };
          });
        }
      } finally {
        U.value = false;
      }
    }
    function Wt(e) {
      z.value = e;
      if (e != null && e.configSnapshot) {
        Object.assign(be, de(e.configSnapshot));
        ye.value = e.name || "";
      } else {
        ye.value = "";
      }
      M.value = true;
    }
    async function Zt() {
      var n;
      var c;
      var s;
      if (!Q.value || (n = z.value) == null || !n.id) {
        return;
      }
      const e = String(ye.value || "").trim();
      if (!e) {
        _.warning("请填写任务名称");
        return;
      }
      const t = Array.isArray((s = (c = z.value) == null ? undefined : c.configSnapshot) == null ? undefined : s.selectedAccounts) ? z.value.configSnapshot.selectedAccounts.filter(Boolean) : [];
      if (!t.length) {
        _.warning("该任务无有效账号配置");
        return;
      }
      be.selectedAccounts = [...t];
      le.value = true;
      try {
        const v = _n(be);
        const h = await I("update-leadgen-task", {
          id: z.value.id,
          patch: {
            name: e,
            configSnapshot: v
          }
        });
        if (!h) {
          _.error("保存失败");
          return;
        }
        kt(k.config, v);
        z.value = {
          ...z.value,
          ...h,
          configSnapshot: v
        };
        _.success("任务配置已保存；若任务已停止，请点击「重启」后新配置才会在运行中生效");
        M.value = false;
        await H();
      } catch (v) {
        _.error(`保存失败：${v.message || v}`);
      } finally {
        le.value = false;
      }
    }
    function Jt() {
      k.activeKey = "dashboard";
    }
    let je = null;
    let qe = null;
    ft(async () => {
      Ue();
      window.addEventListener("resize", Ue);
      await H();
      je = se("leadgen-task-record-updated", async () => {
        await H();
      });
      qe = se("leadgen-task-finished", async () => {
        await H();
      });
    });
    vt(() => {
      window.removeEventListener("resize", Ue);
      if (typeof je == "function") {
        je();
      }
      if (typeof qe == "function") {
        qe();
      }
    });
    return (e, t) => {
      const n = T("a-button");
      const c = T("a-space");
      const s = T("a-tag");
      const v = T("a-tooltip");
      const h = T("a-popover");
      const D = T("a-table");
      const te = T("a-input");
      const ne = T("a-modal");
      const Ae = T("a-spin");
      const Ie = T("a-segmented");
      const $e = T("a-pagination");
      const we = T("a-drawer");
      const ue = T("a-empty");
      const Xt = T("a-alert");
      const Qt = T("a-input-search");
      l();
      return f("div", Nn, [p("div", Hn, [t[16] ||= p("div", {
        class: "toolbar-left"
      }, [p("h3", null, "评论获客"), p("span", {
        class: "toolbar-desc"
      }, "运行中账号不可重复选择")], -1), d(c, {
        size: 8
      }, {
        default: i(() => [o.value.length ? (l(), f("span", Un, "已选 " + g(o.value.length) + " 条", 1)) : C("", true), d(n, {
          danger: "",
          size: "small",
          disabled: o.value.length === 0,
          loading: ce.value,
          onClick: Ut
        }, {
          default: i(() => [...(t[13] ||= [m(" 批量删除 ", -1)])]),
          _: 1
        }, 8, ["disabled", "loading"]), d(n, {
          size: "small",
          onClick: H,
          loading: x.value
        }, {
          default: i(() => [...(t[14] ||= [m("刷新", -1)])]),
          _: 1
        }, 8, ["loading"]), d(n, {
          type: "primary",
          size: "small",
          onClick: ct
        }, {
          default: i(() => [d(b(wt), {
            size: 13,
            style: {
              "margin-right": "3px"
            }
          }), t[15] ||= m(" 新建任务 ", -1)]),
          _: 1
        })]),
        _: 1
      })]), p("div", On, [d(D, {
        class: "leadgen-task-table",
        columns: nt,
        "data-source": j.value,
        loading: x.value,
        "row-key": "id",
        size: "small",
        scroll: {
          x: zt
        },
        pagination: ee,
        "row-selection": Dt.value,
        onChange: Nt
      }, {
        emptyText: i(() => [p("button", {
          type: "button",
          class: "task-empty-create",
          onClick: ct
        }, [p("span", Bn, [d(b(wt), {
          size: 30
        })]), t[17] ||= p("span", null, "还没有任务，去新建一个", -1)])]),
        bodyCell: i(({
          column: u,
          record: a
        }) => {
          var G;
          return [u.key === "name" ? (l(), f("div", {
            key: 0,
            class: "cell-ellipsis name-cell",
            title: a.name
          }, [p("span", null, g(a.name), 1), a.legacy ? (l(), A(s, {
            key: 0,
            class: "mini-tag"
          }, {
            default: i(() => [...(t[18] ||= [m("历史", -1)])]),
            _: 1
          })) : C("", true)], 8, Pn)) : u.key === "time" ? (l(), f("span", {
            key: 1,
            class: "cell-ellipsis",
            title: b(ln)(a)
          }, g(b(gt)(a)), 9, Yn)) : u.key === "accounts" ? (l(), f("span", {
            key: 2,
            class: "cell-ellipsis",
            title: Ke(a)
          }, g(Ke(a)), 9, Fn)) : u.key === "stats" ? (l(), f(R, {
            key: 3
          }, [b(Te)(a.stats) ? (l(), A(v, {
            key: 0,
            title: b(Te)(a.stats)
          }, {
            default: i(() => [p("span", Vn, g(b(Te)(a.stats)), 1)]),
            _: 2
          }, 1032, ["title"])) : (l(), f("span", Kn, "—"))], 64)) : u.key === "total" ? (l(), f(R, {
            key: 4
          }, [m(g(((G = a.stats) == null ? undefined : G.leadsTotal) ?? 0), 1)], 64)) : u.key === "status" ? (l(), A(v, {
            key: 5,
            title: $t(a) || undefined
          }, {
            default: i(() => [p("div", jn, [Se.value[a.id] ? (l(), A(s, {
              key: 0,
              color: "processing",
              class: "mini-tag schedule-status-tag",
              title: Qe(a.id)
            }, {
              default: i(() => [m(g(Qe(a.id)), 1)]),
              _: 2
            }, 1032, ["title"])) : (l(), A(s, {
              key: 1,
              color: Ft(a.status),
              class: "mini-tag"
            }, {
              default: i(() => [m(g(b(on)[a.status] || a.status), 1)]),
              _: 2
            }, 1032, ["color"])), Pe(a) ? (l(), f("span", {
              key: 2,
              class: "status-reason-hint",
              title: Pe(a)
            }, g(Pe(a)), 9, qn)) : C("", true)])]),
            _: 2
          }, 1032, ["title"])) : u.key === "actions" ? (l(), f("div", Gn, [d(h, {
            placement: "leftTop",
            trigger: "click",
            "overlay-class-name": "leadgen-situation-popover"
          }, {
            content: i(() => [p("div", Wn, [t[19] ||= p("div", {
              class: "situation-panel-title"
            }, "账号运行情况", -1), (l(true), f(R, null, Re(_e(a), (w, en) => {
              l();
              return f("div", {
                key: w.accountId || `${w.accountName}-${en}`,
                class: "situation-row"
              }, [p("span", {
                class: "situation-name",
                title: w.accountName
              }, g(w.accountName), 9, Zn), d(s, {
                color: b(un)(w),
                class: "mini-tag situation-tag"
              }, {
                default: i(() => [m(g(w.isRunning ? "运行中" : w.status === "stopped" ? "已停止" : "已结束"), 1)]),
                _: 2
              }, 1032, ["color"]), w.isRunning ? (l(), f("span", Xn, "执行中")) : (l(), f("span", {
                key: 0,
                class: "situation-reason",
                title: w.label
              }, g(w.label), 9, Jn)), Be(a, w) ? (l(), f("div", {
                key: 2,
                class: "situation-stats",
                title: Be(a, w)
              }, g(Be(a, w)), 9, Qn)) : C("", true)]);
            }), 128)), _e(a).length === 0 ? (l(), f("div", ea, " 暂无运行情况记录 ")) : C("", true)])]),
            default: i(() => [d(n, {
              type: "link",
              size: "small",
              class: "action-btn action-situation"
            }, {
              default: i(() => [...(t[20] ||= [m("情况", -1)])]),
              _: 1
            })]),
            _: 2
          }, 1024), d(n, {
            type: "link",
            size: "small",
            class: "action-btn action-detail",
            onClick: w => Gt(a)
          }, {
            default: i(() => [...(t[21] ||= [m("详情", -1)])]),
            _: 1
          }, 8, ["onClick"]), d(n, {
            type: "link",
            size: "small",
            class: "action-btn action-config",
            onClick: w => Wt(a)
          }, {
            default: i(() => [m(g(ie(a) ? "配置" : "编辑"), 1)]),
            _: 2
          }, 1032, ["onClick"]), d(n, {
            type: "link",
            size: "small",
            class: "action-btn action-copy",
            onClick: w => Vt(a)
          }, {
            default: i(() => [...(t[22] ||= [m("复制", -1)])]),
            _: 1
          }, 8, ["onClick"]), d(n, {
            type: "link",
            size: "small",
            class: "action-btn action-log",
            onClick: w => Ct(a)
          }, {
            default: i(() => [t[23] ||= m(" 日志", -1), et(a.id) > 0 ? (l(), f("span", ta, "(" + g(et(a.id)) + ")", 1)) : C("", true)]),
            _: 2
          }, 1032, ["onClick"]), ie(a) ? (l(), A(n, {
            key: 0,
            type: "link",
            size: "small",
            danger: "",
            class: "action-btn",
            loading: fe.value === a.id,
            onClick: w => Kt(a)
          }, {
            default: i(() => [...(t[24] ||= [m(" 停止 ", -1)])]),
            _: 1
          }, 8, ["loading", "onClick"])) : C("", true), ie(a) ? (l(), A(n, {
            key: 1,
            type: "link",
            size: "small",
            class: "action-btn action-monitor",
            onClick: t[0] ||= w => Jt()
          }, {
            default: i(() => [...(t[25] ||= [m(" 监控 ", -1)])]),
            _: 1
          })) : (l(), f(R, {
            key: 2
          }, [d(n, {
            type: "link",
            size: "small",
            class: "action-btn action-restart",
            loading: ve.value === a.id,
            onClick: w => jt(a)
          }, {
            default: i(() => [...(t[26] ||= [m(" 重启 ", -1)])]),
            _: 1
          }, 8, ["loading", "onClick"]), d(Mn, {
            task: a,
            open: !!Ze[a.id],
            "onUpdate:open": w => {
              Ze[a.id] = w;
            }
          }, null, 8, ["task", "open", "onUpdate:open"])], 64)), Se.value[a.id] ? (l(), A(n, {
            key: 3,
            type: "link",
            size: "small",
            danger: "",
            class: "action-btn",
            onClick: w => St(a.id)
          }, {
            default: i(() => [...(t[27] ||= [m(" 取消定时 ", -1)])]),
            _: 1
          }, 8, ["onClick"])) : C("", true)])) : C("", true)];
        }),
        _: 1
      }, 8, ["data-source", "loading", "scroll", "pagination", "row-selection"])]), d(ne, {
        open: r.value,
        "onUpdate:open": t[3] ||= u => r.value = u,
        title: "新建评论获客任务",
        width: Je.value,
        "body-style": Xe.value,
        footer: null,
        "destroy-on-close": "",
        "wrap-class-name": "leadgen-create-modal"
      }, {
        default: i(() => [p("div", na, [t[28] ||= p("span", {
          class: "create-name-label"
        }, "任务名称", -1), d(te, {
          value: $.value,
          "onUpdate:value": t[1] ||= u => $.value = u,
          placeholder: "请输入任务名称",
          "allow-clear": "",
          maxlength: 64
        }, null, 8, ["value"])]), d(ht, {
          "model-config": O,
          "busy-account-ids": Oe.value,
          embedded: ""
        }, null, 8, ["model-config", "busy-account-ids"]), p("div", aa, [d(n, {
          size: "small",
          onClick: t[2] ||= u => r.value = false
        }, {
          default: i(() => [...(t[29] ||= [m("取消", -1)])]),
          _: 1
        }), d(n, {
          type: "primary",
          size: "small",
          loading: pe.value,
          onClick: qt
        }, {
          default: i(() => [...(t[30] ||= [m(" 保存并启动 ", -1)])]),
          _: 1
        }, 8, ["loading"])])]),
        _: 1
      }, 8, ["open", "width", "body-style"]), d(we, {
        open: E.value,
        "onUpdate:open": t[5] ||= u => E.value = u,
        title: S.value ? `任务详情 · ${S.value.name}` : "任务详情",
        width: "920",
        "destroy-on-close": "",
        class: "leadgen-detail-drawer",
        onAfterOpenChange: Ht
      }, {
        default: i(() => [U.value ? (l(), f("div", sa, [d(Ae)])) : S.value ? (l(), f(R, {
          key: 1
        }, [p("div", la, [d(s, null, {
          default: i(() => [m(g(b(gt)(S.value)), 1)]),
          _: 1
        }), d(s, {
          color: "purple"
        }, {
          default: i(() => [m(g(Ke(S.value)), 1)]),
          _: 1
        }), d(s, {
          color: "blue"
        }, {
          default: i(() => [m("线索 " + g(ge.value) + "/" + g(L.value), 1)]),
          _: 1
        }), b(Te)(S.value.stats) ? (l(), A(s, {
          key: 0,
          color: "cyan"
        }, {
          default: i(() => [m(g(b(Te)(S.value.stats)), 1)]),
          _: 1
        })) : C("", true)]), at.value.length ? (l(), f("div", oa, [t[31] ||= p("div", {
          class: "detail-account-title"
        }, "账号运行汇总", -1), p("div", ia, [(l(true), f(R, null, Re(at.value, (u, a) => {
          l();
          return f("div", {
            key: u.accountId || u.automationTaskId || a,
            class: "detail-account-card"
          }, [p("div", ua, [p("div", {
            class: "detail-account-nickname",
            title: u.nickname
          }, g(u.nickname), 9, da), u.remark ? (l(), f("div", {
            key: 0,
            class: "detail-account-remark",
            title: u.remark
          }, " 备注 " + g(u.remark), 9, ra)) : C("", true)]), p("div", ca, [(l(true), f(R, null, Re(Mt(u), G => {
            l();
            return f("div", {
              key: G.key,
              class: "detail-metric-item"
            }, [p("span", pa, g(G.label), 1), p("span", fa, g(G.value), 1)]);
          }), 128))])]);
        }), 128))])])) : C("", true), p("div", va, [d(Ie, {
          value: oe.value,
          "onUpdate:value": t[4] ||= u => oe.value = u,
          size: "small",
          options: xt
        }, null, 8, ["value"])]), d(D, {
          class: "leadgen-detail-table",
          columns: Rt,
          "data-source": J.value,
          "row-key": Ot,
          size: "small",
          pagination: false,
          loading: Ee.value
        }, {
          bodyCell: i(({
            column: u,
            record: a
          }) => [u.key === "nickname" ? (l(), f("span", {
            key: 0,
            class: "cell-ellipsis",
            title: a.nickname
          }, g(a.nickname || "未知"), 9, ga)) : u.key === "intention" ? (l(), A(s, {
            key: 1,
            color: a.isHighIntention ? "success" : "default",
            class: "mini-tag"
          }, {
            default: i(() => [m(g(a.isHighIntention ? "高意向" : "普通"), 1)]),
            _: 2
          }, 1032, ["color"])) : u.key === "touch" ? (l(), f("span", {
            key: 2,
            class: "cell-ellipsis",
            title: b(_t)(a.touchCounts)
          }, g(b(Ln)(a) ? b(_t)(a.touchCounts) : "未触达"), 9, ma)) : u.key === "comment" ? (l(), f("span", {
            key: 3,
            class: "cell-ellipsis",
            title: ot(a)
          }, g(ot(a) || "—"), 9, ya)) : u.key === "video" ? (l(), f(R, {
            key: 4
          }, [ut(a) ? (l(), f("a", {
            key: 0,
            class: "video-link cell-ellipsis",
            title: it(a),
            onClick: dn(G => Bt(a), ["prevent"])
          }, g(it(a)), 9, ka)) : (l(), f("span", ha, "—"))], 64)) : u.key === "ai" ? (l(), f(R, {
            key: 5
          }, [Ve(a) ? (l(), A(v, {
            key: 0,
            title: Ve(a)
          }, {
            default: i(() => [p("span", _a, g(Ve(a)), 1)]),
            _: 2
          }, 1032, ["title"])) : (l(), f("span", wa, "—"))], 64)) : u.key === "actions" ? (l(), A(n, {
            key: 6,
            type: "link",
            size: "small",
            class: "action-btn",
            onClick: G => Pt(a)
          }, {
            default: i(() => [...(t[32] ||= [m(" 查看 ", -1)])]),
            _: 1
          }, 8, ["onClick"])) : C("", true)]),
          _: 1
        }, 8, ["data-source", "loading"]), p("div", Ta, [d($e, {
          current: b(N).current,
          "page-size": b(N).pageSize,
          total: ge.value,
          size: "small",
          "show-size-changer": "",
          "page-size-options": b(N).pageSizeOptions,
          "show-total": b(N).showTotal,
          "select-props": b(N).selectProps,
          onChange: lt,
          onShowSizeChange: lt
        }, null, 8, ["current", "page-size", "total", "page-size-options", "show-total", "select-props"])])], 64)) : C("", true)]),
        _: 1
      }, 8, ["open", "title"]), d(Tn, {
        open: Me.value,
        "onUpdate:open": t[6] ||= u => Me.value = u,
        lead: B.value,
        onToggleIntention: Yt
      }, null, 8, ["open", "lead"]), d(ne, {
        open: M.value,
        "onUpdate:open": t[9] ||= u => M.value = u,
        title: z.value ? Q.value ? `编辑任务 · ${z.value.name}` : `任务配置 · ${z.value.name}` : "任务配置",
        width: Je.value,
        "body-style": Xe.value,
        footer: null,
        "destroy-on-close": "",
        "wrap-class-name": "leadgen-config-modal"
      }, {
        default: i(() => {
          var u;
          return [(u = z.value) != null && u.configSnapshot ? (l(), f(R, {
            key: 1
          }, [Q.value ? C("", true) : (l(), A(Xt, {
            key: 0,
            type: "info",
            "show-icon": "",
            message: "任务运行中，配置为只读。请先停止任务后再修改。",
            style: {
              "margin-bottom": "12px"
            }
          })), p("div", ba, [t[33] ||= p("span", {
            class: "create-name-label"
          }, "任务名称", -1), d(te, {
            value: ye.value,
            "onUpdate:value": t[7] ||= a => ye.value = a,
            placeholder: "请输入任务名称",
            "allow-clear": "",
            maxlength: 64,
            disabled: !Q.value
          }, null, 8, ["value", "disabled"])]), d(ht, {
            "model-config": be,
            readonly: !Q.value,
            "lock-account-selection": Q.value,
            "busy-account-ids": Oe.value,
            embedded: ""
          }, null, 8, ["model-config", "readonly", "lock-account-selection", "busy-account-ids"]), Q.value ? (l(), f("div", Sa, [d(n, {
            size: "small",
            onClick: t[8] ||= a => M.value = false
          }, {
            default: i(() => [...(t[34] ||= [m("取消", -1)])]),
            _: 1
          }), d(n, {
            type: "primary",
            size: "small",
            loading: le.value,
            onClick: Zt
          }, {
            default: i(() => [...(t[35] ||= [m(" 保存配置 ", -1)])]),
            _: 1
          }, 8, ["loading"])])) : C("", true)], 64)) : (l(), A(ue, {
            key: 0,
            description: "该任务为历史导入记录，未保存配置快照"
          }))];
        }),
        _: 1
      }, 8, ["open", "title", "width", "body-style"]), d(we, {
        open: ke.value,
        "onUpdate:open": t[12] ||= u => ke.value = u,
        title: q.value ? `运行日志 · ${q.value.name}` : "运行日志",
        width: "560",
        "destroy-on-close": "",
        class: "leadgen-log-drawer",
        onAfterOpenChange: At
      }, {
        footer: i(() => [d(n, {
          size: "small",
          onClick: Lt,
          disabled: !q.value
        }, {
          default: i(() => [...(t[36] ||= [m("清空", -1)])]),
          _: 1
        }, 8, ["disabled"]), d(n, {
          size: "small",
          type: "primary",
          onClick: t[11] ||= u => ke.value = false
        }, {
          default: i(() => [...(t[37] ||= [m("关闭", -1)])]),
          _: 1
        })]),
        default: i(() => [p("div", Ca, [d(Qt, {
          value: he.value,
          "onUpdate:value": t[10] ||= u => he.value = u,
          placeholder: "搜索日志内容...",
          "allow-clear": "",
          size: "small"
        }, null, 8, ["value"]), p("span", La, g(Le.value.length) + " 条", 1)]), p("div", {
          ref_key: "logListRef",
          ref: We,
          class: "task-log-list"
        }, [(l(true), f(R, null, Re(Le.value, (u, a) => {
          l();
          return f("div", {
            key: `${u.ts || a}-${u.msg}`,
            class: rn(["task-log-line", `level-${u.level || "normal"}`])
          }, [p("span", Aa, g(u.time), 1), p("span", Ia, g(u.msg), 1)], 2);
        }), 128)), Le.value.length === 0 ? (l(), f("div", $a, g(he.value.trim() ? "没有匹配的日志" : "暂无运行日志（任务启动后会自动记录）"), 1)) : C("", true)], 512)]),
        _: 1
      }, 8, ["open", "title"])]);
    };
  }
};
const Ya = Tt(za, [["__scopeId", "data-v-98f08885"]]);
export { Ya as default };
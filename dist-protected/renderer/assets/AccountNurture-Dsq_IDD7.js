import { cx as le, cz as ae, cy as re, cD as z, cE as v, cF as m, cH as t, cJ as oe, cK as p, aZ as o, cG as M, i as u, cM as _, bF as A, g4 as ue, aO as R, cI as U, cL as ie, g5 as L, o as S, cC as f, g6 as de, g7 as F, cV as H, A as ce } from "./index-BegIKaMc.js";
import { A as E } from "./activity-Bl4k966h.js";
const ve = {
  class: "account-nurture"
};
const pe = {
  class: "nurture-topbar"
};
const me = {
  class: "topbar-left"
};
const ge = {
  key: 0,
  class: "topbar-stat"
};
const fe = {
  class: "topbar-right"
};
const ye = {
  class: "nurture-content"
};
const ke = {
  class: "nurture-card"
};
const be = {
  class: "card-title"
};
const we = {
  class: "field"
};
const he = {
  class: "account-selection-list"
};
const _e = {
  class: "acc-header"
};
const Ae = {
  class: "acc-name"
};
const xe = {
  key: 0,
  class: "acc-remark"
};
const Ne = {
  key: 0,
  class: "acc-persona-row"
};
const Se = {
  class: "persona-keywords"
};
const Te = {
  class: "acc-keywords-row"
};
const Me = {
  key: 0,
  class: "empty-tip"
};
const Ke = {
  key: 1,
  class: "field-hint"
};
const Pe = {
  class: "field"
};
const Ce = {
  class: "range-row"
};
const ze = {
  class: "field"
};
const Le = {
  class: "engage-percent-row"
};
const Ie = {
  class: "engage-percent-item"
};
const $e = {
  class: "engage-percent-item"
};
const Re = {
  class: "engage-percent-item"
};
const De = {
  class: "nurture-card behavior-card"
};
const Ue = {
  class: "card-title"
};
const Fe = {
  class: "nurture-card history-card"
};
const He = {
  class: "card-title history-title-row"
};
const Ee = {
  class: "history-title-left"
};
const Be = {
  class: "history-actions"
};
const Oe = {
  key: 0,
  class: "empty-tip"
};
const Ve = {
  key: 1,
  class: "history-table-wrapper"
};
const je = {
  class: "history-table"
};
const Je = {
  style: {
    width: "36px"
  }
};
const We = {
  class: "endtime-cell"
};
const Ye = {
  key: 0,
  class: "endtime-cell"
};
const Ge = ["title"];
const Ze = {
  __name: "AccountNurture",
  setup(qe) {
    const r = ae();
    const {
      send: I
    } = re();
    const l = r.nurtureConfig;
    const K = S(() => r.accounts.filter(n => n.platform === "douyin"));
    const d = S(() => r.nurtureStatus === "running");
    const w = S(() => r.nurtureHistory);
    const i = ce([]);
    const B = S(() => w.value.length > 0 && i.value.length === w.value.length);
    const O = S(() => i.value.length > 0 && i.value.length < w.value.length);
    const D = S(() => {
      var n;
      if ((n = l.selectedAccounts) == null || !n.length || !l.durationMin || !l.durationMax || l.durationMin > l.durationMax) {
        return false;
      } else {
        return l.selectedAccounts.some(e => K.value.some(a => a.id === e));
      }
    });
    function P(n) {
      return String(n || "").split(/[,，、\s\n]+/).map(e => e.trim()).filter(Boolean);
    }
    function $(n, e = 10) {
      const a = Number(n);
      if (Number.isFinite(a)) {
        return Math.max(0, Math.min(100, Math.round(a)));
      } else {
        return e;
      }
    }
    function T(n) {
      return de(r.config, n);
    }
    function V(n) {
      var e;
      return P(((e = l.accountKeywords) == null ? undefined : e[n]) || "");
    }
    function j(n) {
      const e = T(n);
      if (e) {
        return F(e, P(L)).slice(0, 6).join("、") || "按人设语义浏览";
      } else {
        return "";
      }
    }
    function J(n) {
      const e = T(n);
      const a = V(n);
      if (a.length) {
        return {
          nurtureStrategy: "keywords",
          nurtureKeywords: a,
          persona: e
        };
      } else if (e) {
        return {
          nurtureStrategy: "persona",
          nurtureKeywords: F(e, P(L)),
          persona: e
        };
      } else {
        return {
          nurtureStrategy: "keywords",
          nurtureKeywords: P(L),
          persona: null
        };
      }
    }
    const W = S(() => r.runningTasks.map(n => n.id));
    function Y(n) {
      return W.value.includes(n);
    }
    function G(n, e) {
      if (!d.value) {
        if (e && r.runningTasks.some(a => a.id === n)) {
          f.warning("该账号正在获客，暂不可选");
          return;
        }
        l.accountKeywords ||= {};
        if (e) {
          if (!l.selectedAccounts.includes(n)) {
            l.selectedAccounts.push(n);
            if (l.accountKeywords[n] == null) {
              l.accountKeywords[n] = T(n) ? "" : L;
            }
          }
        } else {
          l.selectedAccounts = l.selectedAccounts.filter(a => a !== n);
        }
      }
    }
    function Z(n, e, a) {
      const g = J(n.id);
      const h = g.nurtureKeywords;
      const y = g.persona;
      const k = h.join(",");
      return JSON.parse(JSON.stringify({
        taskId: `nurture_${n.id}_${Date.now()}`,
        taskMode: "nurture",
        accountId: n.id,
        platform: n.platform,
        name: n.name,
        nickname: n.nickname,
        proxy: n.proxy,
        nurtureDurationMin: e,
        nurtureDurationMax: a,
        nurtureKeywords: h,
        nurtureStrategy: g.nurtureStrategy,
        nurturePersonaName: (y == null ? undefined : y.name) || "",
        nurturePersona: y || null,
        nurtureLikePercent: $(l.likePercent, 10),
        nurtureCollectPercent: $(l.collectPercent, 10),
        nurtureSharePercent: $(l.sharePercent, 10),
        keywords: k,
        stayMin: 8,
        stayMax: 25,
        enableLike: false,
        enableComment: false,
        enableFollow: false,
        enableDM: false,
        enableWarmup: false,
        enableVideoComment: false,
        aiReplyMode: false,
        videoSources: ["recommend"],
        viewKey: `${n.platform}_${n.id}`,
        isFree: r.authInfo.isFree,
        isTrial: r.authInfo.isTrial
      }));
    }
    function q() {
      if (d.value) {
        r.nurtureRunningTasks.forEach(c => {
          if (c.taskId) {
            I("stop-task", {
              taskId: c.taskId
            });
          }
        });
        r.clearNurtureRunningTasks();
        r.setNurtureStatus("idle");
        r.setLastNurtureRecordActualEnd(new Date().toLocaleString("zh-CN", {
          hour12: false
        }));
        f.info("养号任务已停止");
        return;
      }
      if (r.authInfo.isFree) {
        f.warning("当前未激活专业版，请激活专业版后使用养号功能");
        return;
      }
      if (!D.value) {
        f.warning("请先选择账号并设置有效的时长区间");
        return;
      }
      const n = parseInt(l.durationMin, 10) || 60;
      const e = parseInt(l.durationMax, 10) || 120;
      if (n > e) {
        f.warning("最小时长不能大于最大时长");
        return;
      }
      let a = 0;
      const g = [...l.selectedAccounts];
      for (const c of g) {
        const N = K.value.find(C => C.id === c);
        if (!N) {
          continue;
        }
        if (r.runningTasks.some(C => C.id === c)) {
          f.warning(`${N.nickname || N.name} 正在获客，已跳过`);
          continue;
        }
        if (r.nurtureRunningTasks.some(C => C.id === c)) {
          continue;
        }
        const b = Z(N, n, e);
        const ne = P(b.keywords).slice(0, 3).join("、");
        const se = b.nurtureStrategy === "persona" && b.nurturePersonaName ? `按人设「${b.nurturePersonaName}」刷推荐流` : b.nurturePersonaName ? `按搜索词完播（已绑「${b.nurturePersonaName}」）` : "按关键词搜索完播";
        r.accountStats[c] = {
          videos: 0,
          likes: 0,
          replies: 0,
          follows: 0,
          messages: 0,
          status: "running",
          action: "养号初始化...",
          taskKind: "nurture"
        };
        r.clearAccountLogs(c);
        r.addAccountLog(c, `养号启动：${n}~${e} 分钟，${se}，标签：${ne || "无"}`);
        r.nurtureRunningTasks.push({
          id: c,
          taskId: b.taskId,
          viewKey: b.viewKey,
          platform: N.platform,
          name: N.name,
          nickname: N.nickname,
          taskKind: "nurture",
          durationMin: n,
          durationMax: e
        });
        I("start-task", b);
        a++;
      }
      if (a === 0) {
        f.warning("没有可启动的账号，请检查是否与其他任务冲突");
        return;
      }
      const h = K.value.filter(c => g.includes(c.id)).map(c => c.nickname || c.name || "未命名账号");
      const y = new Date();
      const k = y.toLocaleString("zh-CN", {
        hour12: false
      });
      const x = new Date(y.getTime() + e * 60 * 1000).toLocaleString("zh-CN", {
        hour12: false
      });
      r.addNurtureRecord({
        time: k,
        endTime: x,
        accounts: h.join("、") || `${a} 个账号`,
        durationMin: n,
        durationMax: e,
        startedCount: a
      });
      I("set-views-visible", false);
      r.setNurtureStatus("running");
      f.success(`已启动 ${a} 个账号养号，可在「实况大屏」查看进度`);
    }
    function Q(n, e) {
      if (e) {
        if (!i.value.includes(n)) {
          i.value = [...i.value, n];
        }
      } else {
        i.value = i.value.filter(a => a !== n);
      }
    }
    function X(n) {
      if (n.target.checked) {
        i.value = w.value.map(a => a.id);
      } else {
        i.value = [];
      }
    }
    function ee() {
      if (w.value.length !== 0) {
        H.confirm({
          title: "清空养号记录",
          content: "确定要清空所有养号记录吗？该操作不可恢复。",
          okText: "清空记录",
          okType: "danger",
          cancelText: "取消",
          onOk: () => {
            r.clearNurtureHistory();
            i.value = [];
            f.success("已清空养号记录");
          }
        });
      }
    }
    function te() {
      if (i.value.length !== 0) {
        H.confirm({
          title: "删除选中养号记录",
          content: `确定删除选中的 ${i.value.length} 条养号记录吗？`,
          okText: "删除",
          okType: "danger",
          cancelText: "取消",
          onOk: () => {
            r.removeNurtureRecords([...i.value]);
            i.value = [];
            f.success("已删除选中养号记录");
          }
        });
      }
    }
    return (n, e) => {
      const a = z("a-button");
      const g = z("a-tag");
      const h = z("a-checkbox");
      const y = z("a-input");
      const k = z("a-input-number");
      v();
      return m("div", ve, [t("div", pe, [t("div", me, [t("div", {
        class: oe(["status-indicator", d.value ? "active" : "idle"])
      }, [e[6] ||= t("span", {
        class: "dot"
      }, null, -1), t("span", null, p(d.value ? "养号运行中" : "未启动"), 1)], 2), d.value ? (v(), m("span", ge, "运行 " + p(o(r).nurtureRunningTasks.length) + " 个账号", 1)) : M("", true)]), t("div", fe, [u(a, {
        type: d.value ? "default" : "primary",
        danger: d.value,
        size: "small",
        disabled: !d.value && !D.value,
        onClick: q
      }, {
        default: _(() => [A(p(d.value ? "⏹ 停止养号" : "▶ 开始养号"), 1)]),
        _: 1
      }, 8, ["type", "danger", "disabled"])])]), t("div", ye, [t("div", ke, [t("div", be, [u(o(ue), {
        size: 16
      }), e[7] ||= t("span", null, "养号配置", -1)]), t("div", we, [e[14] ||= t("label", null, "选择运行账号与养号方向", -1), t("div", he, [(v(true), m(R, null, U(K.value, s => {
        v();
        return m("div", {
          key: s.id,
          class: "acc-selection-item"
        }, [t("div", _e, [u(h, {
          checked: o(l).selectedAccounts.includes(s.id),
          disabled: d.value || Y(s.id),
          "onUpdate:checked": x => G(s.id, x)
        }, {
          default: _(() => [u(g, {
            color: "blue",
            size: "small",
            style: {
              "margin-right": "4px"
            }
          }, {
            default: _(() => [...(e[8] ||= [A("DY", -1)])]),
            _: 1
          }), t("span", Ae, [A(p(s.nickname || "未登录") + " ", 1), s.name ? (v(), m("span", xe, "(" + p(s.name) + ")", 1)) : M("", true)])]),
          _: 2
        }, 1032, ["checked", "disabled", "onUpdate:checked"]), s.status === "online" ? (v(), ie(g, {
          key: 0,
          color: "success",
          size: "small"
        }, {
          default: _(() => [...(e[9] ||= [A("在线", -1)])]),
          _: 1
        })) : M("", true)]), o(l).selectedAccounts.includes(s.id) ? (v(), m(R, {
          key: 0
        }, [T(s.id) ? (v(), m("div", Ne, [e[10] ||= t("span", {
          class: "keywords-label"
        }, "绑定智能体:", -1), u(g, {
          color: "purple",
          size: "small"
        }, {
          default: _(() => [A(p(T(s.id).name), 1)]),
          _: 2
        }, 1024), t("span", Se, "人设标签: " + p(j(s.id)), 1)])) : M("", true), t("div", Te, [e[11] ||= t("span", {
          class: "keywords-label"
        }, "搜索关键词:", -1), u(y, {
          value: o(l).accountKeywords[s.id],
          "onUpdate:value": x => o(l).accountKeywords[s.id] = x,
          placeholder: T(s.id) ? "选填；填写后优先搜索完播；留空则按人设刷推荐流" : "多个用逗号隔开，将搜索并完播这些词的视频",
          size: "small",
          disabled: d.value
        }, null, 8, ["value", "onUpdate:value", "placeholder", "disabled"])])], 64)) : M("", true)]);
      }), 128))]), K.value.length === 0 ? (v(), m("div", Me, [e[13] ||= t("p", null, "暂无抖音账号，请先在账号池中添加并登录。", -1), u(a, {
        type: "primary",
        size: "small",
        onClick: e[0] ||= s => o(r).activeKey = "accounts"
      }, {
        default: _(() => [...(e[12] ||= [A(" 前往账号池 ", -1)])]),
        _: 1
      })])) : (v(), m("div", Ke, " 填写搜索关键词后：按词搜索并完播（绑定智能体时同样生效）。绑定智能体且关键词留空：按人设在推荐流校准。未绑智能体默认：" + p(o(L)), 1))]), t("div", Pe, [e[17] ||= t("label", null, "养号总时长（分钟，随机区间）", -1), t("div", Ce, [u(k, {
        value: o(l).durationMin,
        "onUpdate:value": e[1] ||= s => o(l).durationMin = s,
        min: 5,
        max: 480,
        size: "small",
        disabled: d.value
      }, null, 8, ["value", "disabled"]), e[15] ||= t("span", {
        class: "range-sep"
      }, "~", -1), u(k, {
        value: o(l).durationMax,
        "onUpdate:value": e[2] ||= s => o(l).durationMax = s,
        min: 5,
        max: 480,
        size: "small",
        disabled: d.value
      }, null, 8, ["value", "disabled"]), e[16] ||= t("span", {
        class: "range-unit"
      }, "分钟", -1)]), e[18] ||= t("div", {
        class: "field-hint"
      }, "启动时在区间内随机取一个总时长，模拟真人刷视频行为", -1)]), t("div", ze, [e[22] ||= t("label", null, "视频互动比例（全局，%）", -1), t("div", Le, [t("div", Ie, [e[19] ||= t("span", {
        class: "engage-percent-label"
      }, "点赞", -1), u(k, {
        value: o(l).likePercent,
        "onUpdate:value": e[3] ||= s => o(l).likePercent = s,
        min: 0,
        max: 100,
        size: "small",
        disabled: d.value
      }, null, 8, ["value", "disabled"])]), t("div", $e, [e[20] ||= t("span", {
        class: "engage-percent-label"
      }, "收藏", -1), u(k, {
        value: o(l).collectPercent,
        "onUpdate:value": e[4] ||= s => o(l).collectPercent = s,
        min: 0,
        max: 100,
        size: "small",
        disabled: d.value
      }, null, 8, ["value", "disabled"])]), t("div", Re, [e[21] ||= t("span", {
        class: "engage-percent-label"
      }, "转发", -1), u(k, {
        value: o(l).sharePercent,
        "onUpdate:value": e[5] ||= s => o(l).sharePercent = s,
        min: 0,
        max: 100,
        size: "small",
        disabled: d.value
      }, null, 8, ["value", "disabled"])])]), e[23] ||= t("div", {
        class: "field-hint"
      }, "观看视频时按比例随机执行；转发=打开分享面板并复制链接，再点视频关面板并继续播放。0 表示关闭该项", -1)])]), t("div", De, [t("div", Ue, [u(o(E), {
        size: 16
      }), e[24] ||= t("span", null, "模拟行为说明", -1)]), e[25] ||= t("ul", {
        class: "behavior-list"
      }, [t("li", null, "填写了搜索关键词：按词轮流搜索，收集结果并完播（绑定智能体也一样）"), t("li", null, "绑定智能体且搜索词留空：推荐流按人设匹配后完播，偶尔看评论/主页"), t("li", null, "观看中按上方全局比例随机点赞、收藏、转发（转发=复制链接）"), t("li", null, "搜索/推荐过程遇到直播会自动跳过"), t("li", null, "不执行关注、私信、评论回复等获客互动"), t("li", null, "运行过程可在「实况大屏」查看轨迹")], -1)]), t("div", Fe, [t("div", He, [t("div", Ee, [u(o(E), {
        size: 16
      }), e[26] ||= t("span", null, "养号记录", -1)]), t("div", Be, [u(a, {
        size: "small",
        onClick: te,
        disabled: i.value.length === 0
      }, {
        default: _(() => [...(e[27] ||= [A(" 删除选中 ", -1)])]),
        _: 1
      }, 8, ["disabled"]), u(a, {
        size: "small",
        danger: "",
        onClick: ee,
        disabled: w.value.length === 0
      }, {
        default: _(() => [...(e[28] ||= [A(" 清空记录 ", -1)])]),
        _: 1
      }, 8, ["disabled"])])]), w.value.length === 0 ? (v(), m("div", Oe, [...(e[29] ||= [t("p", null, "暂无养号记录。", -1), t("span", null, "从上方选择账号并点击「开始养号」后，这里会显示每次养号的时间与账号。", -1)])])) : (v(), m("div", Ve, [t("table", je, [t("thead", null, [t("tr", null, [t("th", Je, [u(h, {
        indeterminate: O.value,
        checked: B.value,
        onChange: X
      }, null, 8, ["indeterminate", "checked"])]), e[30] ||= t("th", {
        style: {
          width: "18%"
        }
      }, "开始时间", -1), e[31] ||= t("th", {
        style: {
          width: "18%"
        }
      }, "预计/实际结束时间", -1), e[32] ||= t("th", null, "账号", -1), e[33] ||= t("th", {
        style: {
          width: "18%"
        }
      }, "总时长", -1), e[34] ||= t("th", {
        style: {
          width: "12%"
        }
      }, "数量", -1)])]), t("tbody", null, [(v(true), m(R, null, U(w.value, s => {
        v();
        return m("tr", {
          key: s.id
        }, [t("td", null, [u(h, {
          checked: i.value.includes(s.id),
          onChange: x => Q(s.id, x.target.checked)
        }, null, 8, ["checked", "onChange"])]), t("td", null, p(s.time), 1), t("td", null, [t("div", We, [e[35] ||= t("span", {
          class: "endtime-label"
        }, "预计", -1), t("span", null, p(s.endTime), 1)]), s.endTimeActual ? (v(), m("div", Ye, [e[36] ||= t("span", {
          class: "endtime-label actual"
        }, "实际", -1), t("span", null, p(s.endTimeActual), 1)])) : M("", true)]), t("td", {
          class: "history-accounts",
          title: s.accounts
        }, p(s.accounts), 9, Ge), t("td", null, p(s.durationMin) + " ~ " + p(s.durationMax) + " 分钟", 1), t("td", null, p(s.startedCount) + " 个账号", 1)]);
      }), 128))])])]))])])]);
    };
  }
};
const et = le(Ze, [["__scopeId", "data-v-75a85976"]]);
export { et as default };
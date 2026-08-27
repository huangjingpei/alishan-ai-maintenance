import { cw as re, cx as de, cz as ue, cy as ye, y as W, cD as b, cE as m, cF as g, cH as t, i as r, aZ as P, cS as _e, bF as y, cM as v, cK as p, cJ as ce, cG as Q, aO as R, A, o as $, cV as ke, x as ae, cC as k, g2 as J, g3 as Te, cP as H, cI as j, cN as le, cL as Pe } from "./index-BegIKaMc.js";
import { C as he } from "./chevron-down-hzMBKbmO.js";
import { P as ie } from "./plus-Cl_SEO9R.js";
import { T as Ce } from "./trash-2-DxVhl3zB.js"; /**
                                                 * @license lucide-vue-next v0.395.0 - ISC
                                                 *
                                                 * This source code is licensed under the ISC license.
                                                 * See the LICENSE file in the root directory of this source tree.
                                                 */
const be = re("SaveIcon", [["path", {
  d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
  key: "1c8476"
}], ["path", {
  d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",
  key: "1ydtos"
}], ["path", {
  d: "M7 3v4a1 1 0 0 0 1 1h7",
  key: "t51u73"
}]]); /**
      * @license lucide-vue-next v0.395.0 - ISC
      *
      * This source code is licensed under the ISC license.
      * See the LICENSE file in the root directory of this source tree.
      */
const we = re("UndoIcon", [["path", {
  d: "M3 7v6h6",
  key: "1v2h90"
}], ["path", {
  d: "M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13",
  key: "1r6uu6"
}]]);
const $e = {
  class: "persona-editor-section"
};
const Ie = {
  class: "editor-glass-card"
};
const xe = {
  class: "editor-header"
};
const Se = {
  class: "editor-title"
};
const ze = {
  class: "editor-form"
};
const Qe = {
  class: "field"
};
const Ge = {
  class: "field-row"
};
const Ue = {
  class: "field"
};
const Fe = {
  class: "field"
};
const Me = {
  class: "editor-actions"
};
const Be = {
  class: "dev-test-field"
};
const De = {
  class: "dev-test-toggle-meta"
};
const Ve = {
  key: 0,
  class: "dev-test-body"
};
const Ae = {
  class: "dev-test-row"
};
const Re = {
  class: "dev-test-row"
};
const Le = {
  key: 0,
  class: "dev-test-row"
};
const Ne = {
  class: "dev-test-row"
};
const Ee = {
  key: 1,
  class: "dev-test-lock"
};
const qe = {
  key: 2,
  class: "dev-test-result"
};
const Oe = {
  class: "dev-test-meta"
};
const We = {
  key: 0
};
const He = {
  class: "dev-test-line"
};
const je = {
  class: "dev-test-line"
};
const Je = {
  class: "dev-test-reply"
};
const Ke = {
  key: 0,
  class: "dev-test-thought"
};
const Ze = {
  key: 1,
  class: "dev-test-error"
};
const Xe = {
  __name: "PersonaEditorPanel",
  props: {
    persona: {
      type: Object,
      required: true
    }
  },
  setup(K, {
    expose: L
  }) {
    const f = K;
    const l = ue();
    const {
      invoke: M
    } = ye();
    const i = ae({
      name: "",
      role: "",
      goal: ""
    });
    const G = $(() => {
      var u;
      var d;
      const e = f.persona;
      if (!e) {
        return false;
      }
      const s = (u = e.id) != null && u.startsWith("persona_default_") || (d = e.id) != null && d.startsWith("persona_builtin_") ? `${e.goal || ""}${e.style ? `
${e.style}` : ""}` : e.goal || "";
      return String(i.name || "") !== String(e.name || "") || String(i.role || "") !== String(e.role || "") || String(i.goal || "") !== String(s);
    });
    function w(e) {
      var u;
      var d;
      if (!e) {
        return;
      }
      i.name = e.name || "";
      i.role = e.role || "";
      if (((u = e.id) == null ? undefined : u.startsWith("persona_default_")) || ((d = e.id) == null ? undefined : d.startsWith("persona_builtin_"))) {
        i.goal = (e.goal || "") + (e.style ? `
${e.style}` : "");
      } else {
        i.goal = e.goal || "";
      }
    }
    const S = $(() => J(i.role, i.goal, ""));
    const o = ae({
      mode: "reply",
      videoTitle: "30个热门创业赛道分析",
      nickname: "晚风吹过",
      comment: "",
      loading: false,
      result: null
    });
    const I = A(false);
    const h = A(null);
    let x = null;
    const N = [{
      keys: ["分手", "复合", "前任", "断联", "情感导师", "挽回"],
      config: {
        mode: "reply",
        videoTitle: "分手断联后，还有机会复合吗",
        nickname: "睡不着",
        comment: "帮我"
      }
    }, {
      keys: ["创业", "挣钱", "赚钱", "增收", "合伙", "线上轻模式"],
      config: {
        mode: "reply",
        videoTitle: "普通人想多一条发展路径，要怎么开始",
        nickname: "想试试",
        comment: "怎么做"
      }
    }, {
      keys: ["装修", "家装", "全屋", "设计师"],
      config: {
        mode: "reply",
        videoTitle: "装修前这几个细节一定要看",
        nickname: "准备装修",
        comment: "预算不多能做吗"
      }
    }, {
      keys: ["教育", "课程", "老师", "学习", "英语"],
      config: {
        mode: "reply",
        videoTitle: "孩子学习规划怎么做更稳",
        nickname: "家长小周",
        comment: "多大开始合适"
      }
    }, {
      keys: ["美业", "美容", "护肤", "医美", "皮肤"],
      config: {
        mode: "reply",
        videoTitle: "普通皮肤如何慢慢改善状态",
        nickname: "敏感肌",
        comment: "敏感肌可以吗"
      }
    }, {
      keys: ["汽车", "买车", "二手车", "试驾"],
      config: {
        mode: "reply",
        videoTitle: "第一次买车怎么避坑",
        nickname: "新手司机",
        comment: "预算不高怎么挑"
      }
    }, {
      keys: ["房产", "买房", "置业", "楼盘"],
      config: {
        mode: "reply",
        videoTitle: "买房前需要先看哪些点",
        nickname: "准备上车",
        comment: "首付不多怎么办"
      }
    }, {
      keys: ["本地生活", "门店", "探店", "同城"],
      config: {
        mode: "reply",
        videoTitle: "同城门店怎么找到靠谱选择",
        nickname: "附近看看",
        comment: "附近可以体验吗"
      }
    }, {
      keys: ["电商", "开店", "带货", "店铺"],
      config: {
        mode: "reply",
        videoTitle: "新手做线上店铺怎么少踩坑",
        nickname: "新手店主",
        comment: "需要囤货吗"
      }
    }, {
      keys: ["开发", "程序员", "全栈", "独立开发"],
      config: {
        mode: "reply",
        videoTitle: "独立开发接单复盘",
        nickname: "想转型",
        comment: "技术栈怎么选"
      }
    }];
    const U = $(() => {
      var s;
      var u;
      if (l.authInfo.isFree) {
        return false;
      } else {
        return Number(((s = h.value) == null ? undefined : s.remaining) ?? ((u = l.authInfo.personaTestQuota) == null ? undefined : u.remaining) ?? 0) > 0;
      }
    });
    const E = $(() => {
      const e = h.value || l.authInfo.personaTestQuota;
      if (e) {
        return `${e.remaining}/${e.limit} 次`;
      } else if (l.authInfo.isFree) {
        return "未激活";
      } else {
        return "次数同步中";
      }
    });
    const q = $(() => {
      const e = h.value || l.authInfo.personaTestQuota;
      if (l.authInfo.isFree || !e || e.remaining <= 0) {
        return "default";
      } else if (e.licenseType === "trial") {
        return "blue";
      } else {
        return "green";
      }
    });
    const B = $(() => {
      if (l.authInfo.isFree) {
        return "未激活专业版暂无提示词测试次数";
      }
      const e = h.value || l.authInfo.personaTestQuota;
      if (e && e.remaining <= 0) {
        return "本月提示词测试次数已用完";
      } else {
        return "正在同步提示词测试次数";
      }
    });
    W(() => l.authInfo.personaTestQuota, e => {
      if (e) {
        h.value = e;
      }
    }, {
      immediate: true
    });
    W(() => [l.authInfo.isAuthReady, l.authInfo.isFree, l.authInfo.isTrial], () => {
      F();
    }, {
      immediate: true
    });
    function a(e) {
      const s = [e == null ? undefined : e.name, e == null ? undefined : e.subtitle, e == null ? undefined : e.role, e == null ? undefined : e.goal, e == null ? undefined : e.style, e == null ? undefined : e.basedOn].filter(Boolean).join(" ");
      const u = N.find(d => d.keys.some(z => s.includes(z)));
      return {
        ...((u == null ? undefined : u.config) || {
          mode: "reply",
          videoTitle: "客户在评论区咨询相关问题",
          nickname: "晚风吹过",
          comment: "怎么了解"
        })
      };
    }
    function n(e) {
      var d;
      if (!e) {
        return;
      }
      const u = ((d = l.config.personaTestConfigs) == null ? undefined : d[e.id]) || a(e);
      o.mode = u.mode || "reply";
      o.videoTitle = u.videoTitle || "测试视频标题";
      o.nickname = u.nickname || "晚风吹过";
      o.comment = u.comment || "";
      o.result = null;
    }
    W(() => {
      var e;
      if ((e = f.persona) == null) {
        return undefined;
      } else {
        return e.id;
      }
    }, () => {
      w(f.persona);
      n(f.persona);
    }, {
      immediate: true
    });
    function T() {
      if (f.persona) {
        l.config.personaTestConfigs ||= {};
        l.config.personaTestConfigs[f.persona.id] = {
          mode: o.mode,
          videoTitle: o.videoTitle,
          nickname: o.nickname,
          comment: o.comment
        };
        k.success("测试样例已保存");
      }
    }
    function C() {
      var e;
      if (f.persona) {
        if ((e = l.config.personaTestConfigs) != null && e[f.persona.id]) {
          delete l.config.personaTestConfigs[f.persona.id];
        }
        n(f.persona);
        k.info("已恢复默认测试样例");
      }
    }
    async function F() {
      if (!l.authInfo.isAuthReady || l.authInfo.isFree) {
        h.value = l.authInfo.personaTestQuota || null;
        return;
      }
      return x || (x = (async () => {
        try {
          const e = await M("get-persona-test-quota");
          if (e != null && e.success && e.data) {
            h.value = e.data;
            l.authInfo.personaTestQuota = e.data;
          }
        } catch {} finally {
          x = null;
        }
      })(), x);
    }
    function c(e) {
      if (e === true) {
        return "true";
      } else if (e === false) {
        return "false";
      } else {
        return String(e ?? "—");
      }
    }
    async function D() {
      var e;
      var s;
      var u;
      if (!o.loading) {
        if (!U.value) {
          k.warning(B.value);
          return;
        }
        if ((e = i.role) == null || !e.trim() || (s = i.goal) == null || !s.trim()) {
          k.warning("请先填写身份与目标人群");
          return;
        }
        if (o.mode === "reply" && ((u = o.comment) == null || !u.trim())) {
          k.warning("请输入用户评论");
          return;
        }
        o.loading = true;
        o.result = null;
        try {
          const d = await M("dev-test-persona-ai", {
            mode: o.mode,
            comment: o.comment,
            videoTitle: o.videoTitle,
            nickname: o.nickname,
            config: {
              aiRole: i.role,
              aiGoal: i.goal,
              aiStyle: "",
              aiPrompt: S.value,
              firstPostGoal: "",
              firstPostStyle: "",
              firstPostPrompt: S.value,
              videoGoal: "",
              videoStyle: "",
              videoPrompt: S.value
            }
          });
          o.result = d;
          if (d != null && d.personaTestQuota) {
            h.value = d.personaTestQuota;
            l.authInfo.personaTestQuota = d.personaTestQuota;
          }
          if (d == null || !d.success) {
            k.error((d == null ? undefined : d.msg) || "生成失败");
          }
        } catch (d) {
          k.error((d == null ? undefined : d.message) || "调用失败");
        } finally {
          o.loading = false;
        }
      }
    }
    function me() {
      if (f.persona) {
        i.name = f.persona.name;
        i.role = f.persona.role;
        i.goal = f.persona.goal;
      }
    }
    function Z() {
      if (!i.name.trim()) {
        k.error("别名不能为空");
        return false;
      }
      if (!i.role.trim() || !i.goal.trim()) {
        k.error("别名、身份与目标人群不能为空");
        return false;
      }
      const e = l.config.personas;
      const s = e.findIndex(u => u.id === f.persona.id);
      if (s !== -1) {
        e[s] = {
          ...e[s],
          name: i.name,
          role: i.role,
          goal: i.goal,
          style: "",
          prompt: S.value,
          firstPostGoal: "",
          firstPostStyle: "",
          firstPostPrompt: "",
          videoGoal: "",
          videoStyle: "",
          videoPrompt: ""
        };
        k.success("智能体已保存");
        return true;
      } else {
        return false;
      }
    }
    let V = null;
    async function fe() {
      if (!G.value) {
        return true;
      }
      if (V) {
        return V;
      }
      V = new Promise(e => {
        ke.confirm({
          title: "智能体配置尚未保存",
          content: "是否保存当前修改后再离开？",
          okText: "保存并离开",
          cancelText: "不保存",
          centered: true,
          onOk: () => e(Z()),
          onCancel: () => e(true)
        });
      });
      try {
        return await V;
      } finally {
        V = null;
      }
    }
    L({
      confirmUnsavedChanges: fe,
      hasUnsavedChanges: G
    });
    return (e, s) => {
      var X;
      var Y;
      var ee;
      var te;
      var se;
      var oe;
      var ne;
      const u = b("a-input");
      const d = b("a-textarea");
      const z = b("a-button");
      const ve = b("a-tag");
      const O = b("a-select-option");
      const pe = b("a-select");
      const ge = b("a-space");
      m();
      return g("div", $e, [t("div", Ie, [t("div", xe, [t("h4", Se, [r(P(_e), {
        size: 18,
        class: "editor-title-icon"
      }), s[8] ||= y(" 编辑智能体配置 ", -1)]), s[9] ||= t("div", {
        class: "editor-badge"
      }, "保存后可在账号池绑定", -1)]), t("div", ze, [t("div", Qe, [s[10] ||= t("label", null, "智能体别名 (仅做标识)", -1), r(u, {
        value: i.name,
        "onUpdate:value": s[0] ||= _ => i.name = _,
        placeholder: "例如：全屋定制业务经理小陈"
      }, null, 8, ["value"])]), t("div", Ge, [t("div", Ue, [s[11] ||= t("label", null, "1. 你的身份/职业是？", -1), r(u, {
        value: i.role,
        "onUpdate:value": s[1] ||= _ => i.role = _,
        placeholder: "例如：资深全屋定制设计师"
      }, null, 8, ["value"])])]), t("div", Fe, [s[12] ||= t("label", null, "2. 你要找什么人？", -1), r(d, {
        value: i.goal,
        "onUpdate:value": s[2] ||= _ => i.goal = _,
        placeholder: "例如：找分手后想复合、被拉黑断联的人；留言“帮我/怎么办”也算",
        rows: 3
      }, null, 8, ["value"]), s[13] ||= t("div", {
        class: "goal-ai-hint"
      }, " 像聊天一样写一两句即可，AI 会理解同类说法；有特别想要或不要的人，再补一句。 ", -1)])]), t("div", Me, [r(z, {
        onClick: me,
        class: "secondary-btn"
      }, {
        icon: v(() => [r(P(we), {
          size: 16
        })]),
        default: v(() => [s[14] ||= y(" 撤销更改 ", -1)]),
        _: 1
      }), r(z, {
        type: "primary",
        onClick: Z,
        class: "save-btn"
      }, {
        icon: v(() => [r(P(be), {
          size: 16
        })]),
        default: v(() => [s[15] ||= y(" 保存配置 ", -1)]),
        _: 1
      })]), t("div", Be, [t("button", {
        type: "button",
        class: "dev-test-toggle",
        onClick: s[3] ||= _ => I.value = !I.value
      }, [s[16] ||= t("span", {
        class: "dev-test-toggle-title"
      }, "提示词测试", -1), t("span", De, [r(ve, {
        color: q.value,
        size: "small"
      }, {
        default: v(() => [y(p(E.value), 1)]),
        _: 1
      }, 8, ["color"]), r(P(he), {
        size: 14,
        class: ce(["dev-test-toggle-icon", {
          expanded: I.value
        }])
      }, null, 8, ["class"])])]), I.value ? (m(), g("div", Ve, [s[30] ||= t("p", {
        class: "dev-test-hint"
      }, [y("调用与运行时相同的 "), t("code", null, "V2 comment-decision"), y(" 接口，使用当前编辑区配置（无需先保存）。")], -1), t("div", Ae, [s[20] ||= t("label", null, "场景", -1), r(pe, {
        value: o.mode,
        "onUpdate:value": s[4] ||= _ => o.mode = _,
        size: "small",
        style: {
          width: "100%"
        }
      }, {
        default: v(() => [r(O, {
          value: "reply"
        }, {
          default: v(() => [...(s[17] ||= [y("回复评论", -1)])]),
          _: 1
        }), r(O, {
          value: "profile_first"
        }, {
          default: v(() => [...(s[18] ||= [y("首作品评论", -1)])]),
          _: 1
        }), r(O, {
          value: "main_post"
        }, {
          default: v(() => [...(s[19] ||= [y("视频主贴评论", -1)])]),
          _: 1
        })]),
        _: 1
      }, 8, ["value"])]), t("div", Re, [s[21] ||= t("label", null, "视频标题", -1), r(u, {
        value: o.videoTitle,
        "onUpdate:value": s[5] ||= _ => o.videoTitle = _,
        size: "small",
        placeholder: "例如：30个热门创业赛道分析"
      }, null, 8, ["value"])]), o.mode === "reply" ? (m(), g("div", Le, [s[22] ||= t("label", null, "用户昵称", -1), r(u, {
        value: o.nickname,
        "onUpdate:value": s[6] ||= _ => o.nickname = _,
        size: "small",
        placeholder: "晚风吹过"
      }, null, 8, ["value"])])) : Q("", true), t("div", Ne, [t("label", null, p(o.mode === "reply" ? "用户评论" : "评论区样本（可选）"), 1), r(d, {
        value: o.comment,
        "onUpdate:value": s[7] ||= _ => o.comment = _,
        placeholder: o.mode === "reply" ? "例如：打工还是算了吧，干的再好也是牛马" : "可填一条评论作氛围参考，留空则仅依据标题",
        rows: 3
      }, null, 8, ["value", "placeholder"])]), r(ge, {
        size: "small",
        wrap: ""
      }, {
        default: v(() => [r(z, {
          type: "primary",
          ghost: "",
          size: "small",
          class: "dev-test-btn",
          loading: o.loading,
          disabled: !U.value,
          onClick: D
        }, {
          default: v(() => [...(s[23] ||= [y(" 生成 ", -1)])]),
          _: 1
        }, 8, ["loading", "disabled"]), r(z, {
          size: "small",
          onClick: T
        }, {
          default: v(() => [...(s[24] ||= [y("保存样例", -1)])]),
          _: 1
        }), r(z, {
          size: "small",
          type: "text",
          onClick: C
        }, {
          default: v(() => [...(s[25] ||= [y("恢复默认", -1)])]),
          _: 1
        })]),
        _: 1
      }), U.value ? Q("", true) : (m(), g("div", Ee, p(B.value), 1)), o.result ? (m(), g("div", qe, [t("div", Oe, [t("span", null, p(o.result.generationMode), 1), t("span", null, p(o.result.elapsedMs) + "ms", 1), o.result.personaTestQuota ? (m(), g("span", We, "剩余 " + p(o.result.personaTestQuota.remaining) + "/" + p(o.result.personaTestQuota.limit), 1)) : Q("", true)]), o.result.success && (X = o.result.data) != null && X[0] ? (m(), g(R, {
        key: 0
      }, [t("div", He, [s[26] ||= t("span", {
        class: "k"
      }, "should_like", -1), t("span", null, p(c((te = (ee = (Y = o.result.raw) == null ? undefined : Y.data) == null ? undefined : ee[0]) == null ? undefined : te.should_like)), 1)]), t("div", je, [s[27] ||= t("span", {
        class: "k"
      }, "should_reply", -1), t("span", null, p(c((ne = (oe = (se = o.result.raw) == null ? undefined : se.data) == null ? undefined : oe[0]) == null ? undefined : ne.should_reply)), 1)]), t("div", Je, [s[28] ||= t("span", {
        class: "k"
      }, "reply_content", -1), t("p", null, p(o.result.data[0].replyContent || "（空）"), 1)]), o.result.data[0].aiThought ? (m(), g("div", Ke, [s[29] ||= t("span", {
        class: "k"
      }, "thought", -1), t("p", null, p(o.result.data[0].aiThought), 1)])) : Q("", true)], 64)) : o.result.success ? Q("", true) : (m(), g("div", Ze, p(o.result.msg || "请求失败"), 1))])) : Q("", true)])) : Q("", true)])])]);
    };
  }
};
const Ye = de(Xe, [["__scopeId", "data-v-a5690f91"]]);
const et = {
  class: "ai-personas-view"
};
const tt = {
  class: "personas-header"
};
const st = {
  class: "header-left-info"
};
const ot = {
  class: "glow-icon"
};
const nt = {
  class: "personas-grid"
};
const at = {
  class: "personas-list-section"
};
const lt = {
  class: "section-card-title"
};
const it = {
  key: 0,
  class: "personas-empty"
};
const rt = {
  key: 1,
  class: "persona-cards-container"
};
const dt = ["onClick"];
const ut = {
  class: "card-main-content"
};
const ct = {
  class: "card-header-row"
};
const mt = {
  class: "persona-name"
};
const ft = {
  class: "persona-meta-item desc"
};
const vt = {
  class: "value truncate-two"
};
const pt = {
  class: "card-actions"
};
const gt = {
  key: 1,
  class: "persona-editor-section persona-editor-placeholder"
};
const yt = {
  class: "custom-template-icon"
};
const _t = {
  class: "picker-section"
};
const kt = {
  class: "template-grid"
};
const Tt = ["onClick"];
const Pt = {
  class: "picker-section"
};
const ht = {
  class: "template-grid"
};
const Ct = ["onClick"];
const bt = {
  __name: "AiPersonas",
  setup(K, {
    expose: L
  }) {
    var B;
    const f = ue();
    const l = $(() => f.config.personas);
    const M = Te();
    const i = A(false);
    const G = A(null);
    const w = A(((B = l.value[0]) == null ? undefined : B.id) || "");
    const S = $(() => l.value.find(a => a.id === w.value));
    async function o() {
      var n;
      const a = (n = G.value) == null ? undefined : n.confirmUnsavedChanges;
      if (typeof a != "function") {
        return true;
      } else {
        return await a();
      }
    }
    function I() {
      if (f.authInfo.isFree) {
        k.warning("当前未激活专业版，不支持创建自定义 AI 智能体，请激活专业版解锁！");
        return false;
      } else {
        return true;
      }
    }
    function h(a) {
      l.value.push(a);
      w.value = a.id;
    }
    async function x(a) {
      if (!I() || !(await o())) {
        return;
      }
      const n = `persona_custom_${Date.now()}`;
      const T = (a.goal || "") + (a.style ? `
${a.style}` : "");
      const C = {
        id: n,
        category: "custom",
        name: a.name,
        subtitle: a.subtitle || "",
        role: a.role,
        goal: T,
        style: "",
        prompt: J(a.role, T, ""),
        firstPostGoal: a.firstPostGoal || "",
        firstPostStyle: a.firstPostStyle || "",
        firstPostPrompt: a.firstPostPrompt || "",
        videoGoal: a.videoGoal || "",
        videoStyle: a.videoStyle || "",
        videoPrompt: a.videoPrompt || "",
        basedOn: a.id
      };
      h(C);
      i.value = false;
      k.success("已基于模板创建，请在右侧微调后保存");
    }
    async function N() {
      if (!I() || !(await o())) {
        return;
      }
      const a = `persona_custom_${Date.now()}`;
      const n = "我要找有真实需求的潜在客户";
      const T = {
        id: a,
        category: "custom",
        name: "我的智能体",
        subtitle: "",
        role: "业务咨询助理",
        goal: n,
        style: "",
        prompt: J("业务咨询助理", n, ""),
        firstPostGoal: "",
        firstPostStyle: "",
        firstPostPrompt: "",
        videoGoal: "",
        videoStyle: "",
        videoPrompt: ""
      };
      h(T);
      i.value = false;
      k.info("已创建空白智能体，请填写后保存");
    }
    function U() {
      if (I()) {
        i.value = true;
      }
    }
    async function E(a) {
      if (!!a && a !== w.value) {
        if (await o()) {
          w.value = a;
        }
      }
    }
    L({
      confirmLeave: o,
      hasUnsavedChanges: $(() => {
        var a;
        return !!P((a = G.value) == null ? undefined : a.hasUnsavedChanges);
      })
    });
    function q(a) {
      var T;
      const n = l.value.findIndex(C => C.id === a);
      if (n !== -1) {
        l.value.splice(n, 1);
        if (w.value === a) {
          w.value = ((T = l.value[0]) == null ? undefined : T.id) || "";
        }
        const C = f.config.accountPersonas;
        for (const F in C) {
          if (C[F] === a) {
            C[F] = "none";
          }
        }
        k.success("该智能人设已删除，相关映射已重置");
      }
    }
    return (a, n) => {
      const T = b("a-button");
      const C = b("a-popconfirm");
      const F = b("a-modal");
      m();
      return g("div", et, [t("div", tt, [t("div", st, [t("div", ot, [r(P(H), {
        size: 24,
        class: "header-icon"
      })]), n[2] ||= t("div", {
        class: "text-group"
      }, [t("h3", null, "AI 智能体人设库"), t("p", null, [y("填写身份，再说你想找什么人；保存后在"), t("strong", null, "账号池"), y("绑定到账号")])], -1)]), r(T, {
        type: "primary",
        class: "add-btn",
        onClick: U
      }, {
        icon: v(() => [r(P(ie), {
          size: 16
        })]),
        default: v(() => [n[3] ||= y(" 新建智能体 ", -1)]),
        _: 1
      })]), t("div", nt, [t("div", at, [t("div", lt, "我的智能体 (" + p(l.value.length) + ")", 1), l.value.length === 0 ? (m(), g("div", it, [r(P(H), {
        size: 32,
        class: "empty-icon"
      }), n[5] ||= t("p", null, "还没有智能体", -1), n[6] ||= t("span", null, "点击「新建智能体」，先选「我是…」或「找人群」模板，再微调保存即可", -1), r(T, {
        type: "primary",
        size: "small",
        onClick: U
      }, {
        default: v(() => [...(n[4] ||= [y("从模板新建", -1)])]),
        _: 1
      })])) : (m(), g("div", rt, [(m(true), g(R, null, j(l.value, c => {
        m();
        return g("div", {
          key: c.id,
          class: ce(["persona-card", {
            active: w.value === c.id
          }]),
          onClick: D => E(c.id)
        }, [n[7] ||= t("div", {
          class: "card-glow-border"
        }, null, -1), t("div", ut, [t("div", ct, [t("span", mt, p(c.name), 1)]), t("div", ft, [t("span", vt, p(c.role), 1)])]), t("div", pt, [r(C, {
          title: "确定删除吗？已绑定账号将回退为本地话术。",
          "ok-text": "删除",
          "cancel-text": "取消",
          onConfirm: le(D => q(c.id), ["stop"])
        }, {
          default: v(() => [r(T, {
            type: "text",
            danger: "",
            size: "small",
            class: "action-icon-btn",
            onClick: n[0] ||= le(() => {}, ["stop"])
          }, {
            icon: v(() => [r(P(Ce), {
              size: 14
            })]),
            _: 1
          })]),
          _: 1
        }, 8, ["onConfirm"])])], 10, dt);
      }), 128))]))]), S.value ? (m(), Pe(Ye, {
        key: 0,
        ref_key: "editorRef",
        ref: G,
        persona: S.value
      }, null, 8, ["persona"])) : (m(), g("div", gt, [r(P(H), {
        size: 40
      }), n[8] ||= t("p", null, "选择左侧智能体编辑，或点击「新建」从模板开始", -1)]))]), r(F, {
        open: i.value,
        "onUpdate:open": n[1] ||= c => i.value = c,
        title: "新建智能体 — 选一个最接近你的模板",
        footer: null,
        width: "640px",
        centered: "",
        class: "template-picker-modal"
      }, {
        default: v(() => [n[13] ||= t("p", {
          class: "picker-hint"
        }, "选好模板后会自动填好内容，你只需微调再保存，不用从 0 写起。", -1), t("button", {
          type: "button",
          class: "template-card custom-template-card",
          onClick: N
        }, [t("span", yt, [r(P(ie), {
          size: 22,
          "stroke-width": "2.5"
        })]), n[9] ||= t("span", {
          class: "custom-template-content"
        }, [t("span", {
          class: "custom-template-title"
        }, [t("strong", null, "自定义智能体"), t("span", {
          class: "custom-template-badge"
        }, "自由创建")]), t("span", {
          class: "custom-template-desc"
        }, "从空白开始，自由设置身份、目标与回复策略")], -1), n[10] ||= t("span", {
          class: "custom-template-action"
        }, "立即创建 →", -1)]), t("div", _t, [n[11] ||= t("div", {
          class: "picker-section-title"
        }, [y("我是… "), t("span", null, "选你的身份/职业")], -1), t("div", kt, [(m(true), g(R, null, j(P(M).identity, c => {
          m();
          return g("button", {
            key: c.id,
            type: "button",
            class: "template-card",
            onClick: D => x(c)
          }, [t("strong", null, p(c.name), 1), t("span", null, p(c.subtitle), 1)], 8, Tt);
        }), 128))])]), t("div", Pt, [n[12] ||= t("div", {
          class: "picker-section-title"
        }, [y("找…人群 "), t("span", null, "选你想触达的客户")], -1), t("div", ht, [(m(true), g(R, null, j(P(M).audience, c => {
          m();
          return g("button", {
            key: c.id,
            type: "button",
            class: "template-card",
            onClick: D => x(c)
          }, [t("strong", null, p(c.name), 1), t("span", null, p(c.subtitle), 1)], 8, Ct);
        }), 128))])])]),
        _: 1
      }, 8, ["open"])]);
    };
  }
};
const St = de(bt, [["__scopeId", "data-v-b5995142"]]);
export { St as default };
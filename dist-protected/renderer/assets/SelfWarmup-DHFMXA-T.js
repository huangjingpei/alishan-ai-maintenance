import { cw as Je, cx as Ye, cy as ht, y as qe, cD as M, cE as s, cF as m, cK as v, cG as I, aO as P, cI as se, cH as n, cL as _, cM as g, bF as y, i as o, aZ as p, fA as Ne, x as wt, cC as b, S as bt, fB as ot, dx as tn, cJ as he, cQ as nn, cR as ln, fC as an, d4 as ut, o as B, fD as ct, fE as Ee, fF as Le, cZ as sn, fG as dt, cz as on, fH as un, fI as rt, fJ as Be, fK as je, z as cn, fL as ft, fM as dn, fN as Se, fO as rn, fP as mt, fQ as Ve, cN as fn, fR as He, fS as Ke, fT as gt, fU as mn, fV as gn, A as T, ak as vn, cV as ae, fW as pn, ft as yn, fX as vt } from "./index-BegIKaMc.js";
import { P as Ge } from "./plus-Cl_SEO9R.js";
import { S as kn } from "./settings-2-vyTiLluG.js";
import { Z as hn } from "./zap-BwUCNpS-.js";
import { B as wn } from "./bell-CZ8ykcq_.js";
import { M as bn } from "./message-circle-BQOwYyei.js";
import { R as Tn } from "./reply-cGSFu4jC.js";
import { H as Cn } from "./heart-Ccyj7Sl9.js";
import { U as xn } from "./user-plus-CF_3X2xg.js";
import { b as Sn, c as $n, a as In } from "./detailTablePagination-CDmOQQdi.js";
import { c as An } from "./taskLogClipboard-BqmNoJ8j.js";
import { M as zn } from "./monitor-CBAcaOyZ.js"; /**
                                                 * @license lucide-vue-next v0.395.0 - ISC
                                                 *
                                                 * This source code is licensed under the ISC license.
                                                 * See the LICENSE file in the root directory of this source tree.
                                                 */
const pt = Je("ClockIcon", [["circle", {
  cx: "12",
  cy: "12",
  r: "10",
  key: "1mglay"
}], ["polyline", {
  points: "12 6 12 12 16 14",
  key: "68esgv"
}]]); /**
      * @license lucide-vue-next v0.395.0 - ISC
      *
      * This source code is licensed under the ISC license.
      * See the LICENSE file in the root directory of this source tree.
      */
const En = Je("FilterIcon", [["polygon", {
  points: "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3",
  key: "1yg77f"
}]]); /**
      * @license lucide-vue-next v0.395.0 - ISC
      *
      * This source code is licensed under the ISC license.
      * See the LICENSE file in the root directory of this source tree.
      */
const Ln = Je("RepeatIcon", [["path", {
  d: "m17 2 4 4-4 4",
  key: "nntrym"
}], ["path", {
  d: "M3 11v-1a4 4 0 0 1 4-4h14",
  key: "84bu3i"
}], ["path", {
  d: "m7 22-4-4 4-4",
  key: "1wqhfi"
}], ["path", {
  d: "M21 13v1a4 4 0 0 1-4 4H3",
  key: "1rx37r"
}]]);
const Un = {
  class: "tpl-list"
};
const _n = {
  key: 0,
  class: "tpl-list-title"
};
const Mn = {
  class: "tpl-item-head"
};
const Rn = {
  key: 0,
  class: "tpl-item-index"
};
const Dn = {
  key: 1,
  class: "tpl-text-hint"
};
const Wn = {
  key: 0,
  class: "tpl-attach-bar"
};
const Fn = {
  key: 1,
  class: "tpl-attach-checks"
};
const Pn = {
  key: 1,
  class: "tpl-attach"
};
const On = {
  key: 0,
  class: "comment-image-grid"
};
const Nn = ["src", "alt"];
const Bn = ["onClick"];
const jn = {
  class: "comment-image-index"
};
const Vn = {
  key: 1,
  class: "tpl-text-hint"
};
const Hn = {
  class: "comment-image-actions"
};
const Kn = {
  key: 2,
  class: "tpl-attach tpl-expr-row"
};
const qn = {
  class: "tpl-attach-label"
};
const Gn = {
  __name: "SelfWarmupTemplateList",
  props: {
    items: {
      type: Array,
      default: () => []
    },
    allowAttachment: {
      type: Boolean,
      default: false
    },
    exclusiveAttachment: {
      type: Boolean,
      default: true
    },
    singleItem: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    textHint: {
      type: String,
      default: ""
    },
    imageHint: {
      type: String,
      default: ""
    },
    expressionLabel: {
      type: String,
      default: "轮询表情包范围"
    },
    textPlaceholder: {
      type: String,
      default: "支持 {nickname}、{content}；可留空仅发图片/表情包"
    }
  },
  emits: ["update:items"],
  setup(d, {
    emit: a
  }) {
    const x = d;
    const we = a;
    const {
      invoke: ie
    } = ht();
    const J = wt({});
    function me(r, u) {
      return !!r && Object.prototype.hasOwnProperty.call(r, u);
    }
    function K(r) {
      if (me(r, "enableImage")) {
        return r.enableImage === true;
      } else {
        return (r == null ? undefined : r.attachment) === "image" || (r == null ? undefined : r.attachment) === "both";
      }
    }
    function Y(r) {
      if (me(r, "enableExpression")) {
        return r.enableExpression === true;
      } else {
        return (r == null ? undefined : r.attachment) === "expression" || (r == null ? undefined : r.attachment) === "both";
      }
    }
    function Z(r) {
      if (K(r)) {
        return "image";
      } else if (Y(r)) {
        return "expression";
      } else {
        return "none";
      }
    }
    function H(r) {
      we("update:items", r);
    }
    function j(r, u) {
      const S = x.items[r] || {};
      const k = Ne({
        ...S,
        ...u
      }, {
        exclusive: x.exclusiveAttachment
      });
      H(x.items.map((w, D) => D === r ? k : w));
    }
    function Q(r, u) {
      j(r, u);
    }
    function oe(r, u) {
      var S;
      if (u === "image") {
        j(r, {
          enableImage: true,
          enableExpression: false,
          attachment: "image"
        });
        return;
      }
      if (u === "expression") {
        j(r, {
          enableImage: false,
          enableExpression: true,
          attachment: "expression",
          expressionCount: ((S = x.items[r]) == null ? undefined : S.expressionCount) || 3
        });
        return;
      }
      j(r, {
        enableImage: false,
        enableExpression: false,
        attachment: "none"
      });
    }
    function ue(r, u) {
      const S = x.items[r] || {};
      const k = !!u;
      const w = Y(S);
      j(r, {
        enableImage: k,
        enableExpression: w,
        attachment: k && w ? "both" : k ? "image" : w ? "expression" : "none"
      });
    }
    function ce(r, u) {
      const S = x.items[r] || {};
      const k = K(S);
      const w = !!u;
      j(r, {
        enableImage: k,
        enableExpression: w,
        attachment: k && w ? "both" : k ? "image" : w ? "expression" : "none",
        expressionCount: S.expressionCount || 3
      });
    }
    function q() {
      H([...x.items, Ne({}, {
        exclusive: x.exclusiveAttachment
      })]);
    }
    function O(r) {
      if (x.items.length <= 1) {
        return;
      }
      const u = x.items.filter((S, k) => k !== r);
      H(u.length ? u : [Ne()]);
    }
    async function C() {
      const r = {};
      for (const u of x.items) {
        if (!x.allowAttachment || !K(u)) {
          continue;
        }
        const S = (u.imagePaths || []).filter(w => typeof w == "string" && w.trim());
        const k = [];
        for (const w of S) {
          try {
            const D = await ie("read-comment-image", w);
            if (D != null && D.base64) {
              k.push({
                path: w,
                src: `data:${D.mime || "image/jpeg"};base64,${D.base64}`
              });
            }
          } catch {}
        }
        r[u.id] = k;
      }
      Object.keys(J).forEach(u => {
        delete J[u];
      });
      Object.assign(J, r);
    }
    async function l(r) {
      var u;
      var S;
      try {
        const k = await ie("pick-comment-image");
        if (k != null && k.canceled) {
          return;
        }
        const w = (u = k == null ? undefined : k.paths) != null && u.length ? k.paths : k != null && k.path ? [k.path] : [];
        if (!w.length) {
          return;
        }
        const D = Array.isArray((S = x.items[r]) == null ? undefined : S.imagePaths) ? x.items[r].imagePaths : [];
        j(r, {
          enableImage: true,
          imagePaths: [...D, ...w]
        });
        b.success(w.length > 1 ? `已添加 ${w.length} 张配图` : "配图已添加");
      } catch (k) {
        b.error((k == null ? undefined : k.message) || "选择图片失败");
      }
    }
    function X(r, u) {
      var k;
      const S = [...(((k = x.items[r]) == null ? undefined : k.imagePaths) || [])];
      S.splice(u, 1);
      Q(r, {
        imagePaths: S
      });
    }
    function F(r) {
      Q(r, {
        imagePaths: []
      });
    }
    qe(() => x.items.map(r => `${r.id}:${r.enableImage}:${r.attachment}:${(r.imagePaths || []).join("|")}`).join(";"), () => {
      C();
    }, {
      immediate: true
    });
    return (r, u) => {
      const S = M("a-button");
      const k = M("a-textarea");
      const w = M("a-radio-button");
      const D = M("a-radio-group");
      const ee = M("a-checkbox");
      const f = M("a-select-option");
      const R = M("a-select");
      s();
      return m("div", Un, [d.title ? (s(), m("div", _n, v(d.title), 1)) : I("", true), (s(true), m(P, null, se(d.items, (W, N) => {
        var de;
        s();
        return m("div", {
          key: W.id || N,
          class: "tpl-item"
        }, [n("div", Mn, [d.singleItem ? I("", true) : (s(), m("span", Rn, v(N + 1), 1)), u[1] ||= n("span", {
          class: "tpl-type-label"
        }, "文本", -1), d.textHint ? (s(), m("span", Dn, v(d.textHint), 1)) : I("", true), d.singleItem ? I("", true) : (s(), _(S, {
          key: 2,
          type: "text",
          size: "small",
          danger: "",
          disabled: d.items.length <= 1,
          class: "tpl-remove",
          onClick: L => O(N)
        }, {
          default: g(() => [...(u[0] ||= [y(" 删除 ", -1)])]),
          _: 1
        }, 8, ["disabled", "onClick"]))]), o(k, {
          value: W.text,
          placeholder: d.textPlaceholder,
          rows: 5,
          size: "small",
          "onUpdate:value": L => Q(N, {
            text: L
          })
        }, null, 8, ["value", "placeholder", "onUpdate:value"]), d.allowAttachment ? (s(), m("div", Wn, [u[7] ||= n("span", {
          class: "tpl-attach-label"
        }, "附带", -1), d.exclusiveAttachment ? (s(), _(D, {
          key: 0,
          value: Z(W),
          size: "small",
          "button-style": "solid",
          class: "tpl-type-group",
          "onUpdate:value": L => oe(N, L)
        }, {
          default: g(() => [o(w, {
            value: "none"
          }, {
            default: g(() => [...(u[2] ||= [y("不附带", -1)])]),
            _: 1
          }), o(w, {
            value: "image"
          }, {
            default: g(() => [...(u[3] ||= [y("图片", -1)])]),
            _: 1
          }), o(w, {
            value: "expression"
          }, {
            default: g(() => [...(u[4] ||= [y("表情包", -1)])]),
            _: 1
          })]),
          _: 1
        }, 8, ["value", "onUpdate:value"])) : (s(), m("div", Fn, [o(ee, {
          checked: !!W.enableImage,
          "onUpdate:checked": L => ue(N, L)
        }, {
          default: g(() => [...(u[5] ||= [y(" 图片 ", -1)])]),
          _: 1
        }, 8, ["checked", "onUpdate:checked"]), o(ee, {
          checked: !!W.enableExpression,
          "onUpdate:checked": L => ce(N, L)
        }, {
          default: g(() => [...(u[6] ||= [y(" 表情包 ", -1)])]),
          _: 1
        }, 8, ["checked", "onUpdate:checked"])]))])) : I("", true), d.allowAttachment && K(W) ? (s(), m("div", Pn, [(de = J[W.id]) != null && de.length ? (s(), m("div", On, [(s(true), m(P, null, se(J[W.id], (L, re) => {
          s();
          return m("div", {
            key: L.path,
            class: "comment-image-thumb"
          }, [n("img", {
            src: L.src,
            alt: `配图 ${re + 1}`
          }, null, 8, Nn), n("button", {
            type: "button",
            class: "comment-image-remove",
            title: "移除",
            onClick: ge => X(N, re)
          }, "×", 8, Bn), n("span", jn, v(re + 1), 1)]);
        }), 128))])) : I("", true), d.imageHint ? (s(), m("div", Vn, v(d.imageHint), 1)) : I("", true), n("div", Hn, [o(S, {
          size: "small",
          onClick: L => l(N)
        }, {
          default: g(() => [...(u[8] ||= [y("添加图片", -1)])]),
          _: 1
        }, 8, ["onClick"]), (W.imagePaths || []).length ? (s(), _(S, {
          key: 0,
          size: "small",
          type: "text",
          danger: "",
          onClick: L => F(N)
        }, {
          default: g(() => [...(u[9] ||= [y(" 清空 ", -1)])]),
          _: 1
        }, 8, ["onClick"])) : I("", true)])])) : I("", true), d.allowAttachment && Y(W) ? (s(), m("div", Kn, [n("span", qn, v(d.expressionLabel), 1), o(R, {
          value: W.expressionCount || 3,
          size: "small",
          style: {
            width: "180px"
          },
          "onUpdate:value": L => Q(N, {
            expressionCount: L
          })
        }, {
          default: g(() => [(s(), m(P, null, se(8, L => o(f, {
            key: `expr-${W.id}-${L}`,
            value: L
          }, {
            default: g(() => [y(v(L === 1 ? "仅第一张表情包" : `前 ${L} 张按顺序轮询`) + v(L === 3 ? " (默认)" : ""), 1)]),
            _: 2
          }, 1032, ["value"])), 64))]),
          _: 2
        }, 1032, ["value", "onUpdate:value"])])) : I("", true)]);
      }), 128)), d.singleItem ? I("", true) : (s(), _(S, {
        key: 1,
        size: "small",
        class: "tpl-add",
        onClick: q
      }, {
        default: g(() => [o(p(Ge), {
          size: 13
        }), u[10] ||= y(" 添加一条 ", -1)]),
        _: 1
      }))]);
    };
  }
};
const yt = Ye(Gn, [["__scopeId", "data-v-68f0b0af"]]);
const Jn = {
  class: "self-warmup-config"
};
const Yn = {
  class: "config-section"
};
const Zn = {
  class: "section-head"
};
const Qn = {
  class: "section-body"
};
const Xn = {
  class: "field"
};
const el = {
  class: "field"
};
const tl = {
  class: "range-row"
};
const nl = {
  class: "config-section"
};
const ll = {
  class: "section-head"
};
const al = {
  class: "section-desc"
};
const sl = {
  key: 0,
  class: "record-only-panel"
};
const il = {
  class: "record-hint"
};
const ol = {
  class: "watch-only-list"
};
const ul = {
  class: "trigger-cards"
};
const cl = {
  class: "trigger-header"
};
const dl = {
  class: "trigger-info"
};
const rl = {
  class: "trigger-name"
};
const fl = {
  class: "trigger-desc"
};
const ml = {
  key: 0,
  class: "trigger-actions"
};
const gl = {
  class: "action-flow"
};
const vl = {
  class: "action-chips"
};
const pl = {
  key: 1,
  class: "trigger-off"
};
const yl = {
  class: "action-timing"
};
const kl = {
  key: 0,
  class: "action-timing"
};
const hl = {
  class: "round-limit-row"
};
const wl = {
  class: "account-limit-block"
};
const bl = {
  class: "action-limit-label"
};
const Tl = {
  key: 0,
  class: "action-limit-range"
};
const Cl = {
  class: "config-section"
};
const xl = {
  class: "section-head"
};
const Sl = {
  class: "section-desc"
};
const $l = {
  class: "section-body"
};
const Il = {
  class: "field"
};
const Al = {
  key: 0,
  class: "field-hint"
};
const zl = {
  class: "field"
};
const El = {
  class: "config-section"
};
const Ll = {
  class: "section-head"
};
const Ul = {
  class: "section-desc"
};
const _l = {
  class: "section-body"
};
const Ml = {
  key: 0,
  class: "reply-channel-card"
};
const Rl = {
  class: "reply-channel-head"
};
const Dl = {
  key: 0,
  class: "field-hint"
};
const Wl = {
  key: 1,
  class: "reply-channel-card"
};
const Fl = {
  class: "reply-channel-head"
};
const Pl = {
  key: 0,
  class: "field-hint"
};
const Ol = {
  key: 2,
  class: "field-hint"
};
const Nl = {
  class: "config-section"
};
const Bl = {
  class: "section-head"
};
const jl = {
  key: 0,
  class: "section-body"
};
const Vl = {
  __name: "SelfWarmupTaskConfigView",
  props: {
    config: {
      type: Object,
      required: true
    },
    accounts: {
      type: Array,
      default: () => []
    },
    lockAccountSelection: {
      type: Boolean,
      default: false
    }
  },
  setup(d) {
    const a = d;
    const x = an;
    const we = B(() => a.accounts.filter(C => C.platform === "douyin").map(C => ({
      label: sn(C),
      value: C.id
    })));
    const ie = B(() => a.config.enableAutoActions === true && (a.config.watchComments !== false && a.config.actionCommentReply === true || a.config.watchReplies !== false && a.config.actionReplyReply === true));
    const J = B(() => a.config.actionMessageReply === true || a.config.actionLikeDm === true || a.config.actionFollowDm === true || a.config.actionReplyDm === true);
    const me = B(() => a.config.actionReplyFollow === true && a.config.actionReplyDm === true || a.config.actionLikeFollow === true && a.config.actionLikeDm === true || a.config.actionFollowBack === true && a.config.actionFollowDm === true);
    const K = B({
      get: () => ct(a.config, false),
      set(C) {
        a.config.commentSuggestionMode = C === "ai" ? "ai" : "template";
        a.config.suggestionMode = a.config.commentSuggestionMode;
      }
    });
    const Y = B({
      get: () => ct(a.config, true),
      set(C) {
        a.config.dmSuggestionMode = C === "ai" ? "ai" : "template";
      }
    });
    const Z = B({
      get() {
        const C = a.config.useAiJudge;
        if (C === true || C === 1 || C === "true") {
          return "ai";
        } else {
          return "keyword";
        }
      },
      set(C) {
        a.config.useAiJudge = C === "ai";
      }
    });
    function H() {
      return {
        enableCommentImage: false,
        enableCommentExpression: false,
        commentImagePaths: [],
        commentExpressionCount: 3
      };
    }
    function j() {
      if (!Array.isArray(a.config.replyTemplateItems) || !a.config.replyTemplateItems.length) {
        a.config.replyTemplateItems = Ee(null, a.config.replyTemplate, H());
      } else if (a.config.replyTemplateItems.length > 1) {
        a.config.replyTemplateItems = Ee(a.config.replyTemplateItems, a.config.replyTemplate, H());
      }
      if (!Array.isArray(a.config.dmTemplateItems) || !a.config.dmTemplateItems.length) {
        a.config.dmTemplateItems = Le(null, a.config.dmTemplate);
      } else if (a.config.dmTemplateItems.length > 1) {
        a.config.dmTemplateItems = Le(a.config.dmTemplateItems, a.config.dmTemplate);
      }
    }
    const Q = B(() => Ee(a.config.replyTemplateItems, a.config.replyTemplate, H()));
    const oe = B(() => Le(a.config.dmTemplateItems, a.config.dmTemplate));
    function ue(C) {
      const l = Ee(C, "", H());
      a.config.replyTemplateItems = l;
      a.config.replyTemplate = dt(l);
      ot(a.config, l);
    }
    function ce(C) {
      const l = Le(C, a.config.dmTemplate);
      a.config.dmTemplateItems = l;
      a.config.dmTemplate = dt(l);
    }
    bt(() => {
      a.config.commentUseRandomSuffix = false;
      a.config.enableCommentWithoutText = false;
      a.config.enableCommentImage = false;
      a.config.commentImagePaths = [];
      a.config.enableCommentExpression = false;
      a.config.commentExpressionCount = 3;
      a.config.commentAttachmentPercent = 0;
      a.config.enableCommentMention = false;
      a.config.commentMentionNicknames = "";
      a.config.commentMentionPosition = "before";
      a.config.commentSuggestionMode = K.value;
      a.config.dmSuggestionMode = Y.value;
      a.config.suggestionMode = a.config.commentSuggestionMode;
      j();
      const C = l => (Array.isArray(l) ? l : []).map(X => ({
        ...X,
        enableImage: false,
        enableExpression: false,
        attachment: "none",
        imagePaths: []
      }));
      a.config.replyTemplateItems = C(a.config.replyTemplateItems);
      a.config.dmTemplateItems = C(a.config.dmTemplateItems);
      ot(a.config, a.config.replyTemplateItems);
    });
    const q = [{
      key: "watchComments",
      label: "作品评论"
    }, {
      key: "watchReplies",
      label: "评论回复"
    }, {
      key: "watchLikes",
      label: "作品点赞"
    }, {
      key: "watchFollows",
      label: "新增关注"
    }, {
      key: "watchMessages",
      label: "私信消息"
    }];
    const O = B(() => [{
      key: "comment",
      title: "作品评论",
      subtitle: "有人在你视频下留言",
      icon: bn,
      bg: "rgba(59, 130, 246, 0.15)",
      watchKey: "watchComments",
      watchChecked: a.config.watchComments !== false,
      actions: [{
        key: "actionCommentLike",
        label: "自动点赞评论"
      }, {
        key: "actionCommentReply",
        label: "自动回复评论"
      }]
    }, {
      key: "reply",
      title: "评论回复",
      subtitle: "有人回复了你的评论",
      icon: Tn,
      bg: "rgba(139, 92, 246, 0.15)",
      watchKey: "watchReplies",
      watchChecked: a.config.watchReplies !== false,
      actions: [{
        key: "actionReplyLike",
        label: "自动点赞评论"
      }, {
        key: "actionReplyReply",
        label: "自动回复"
      }, {
        key: "actionReplyFollow",
        label: "自动关注对方"
      }, {
        key: "actionReplyDm",
        label: "自动私信对方"
      }]
    }, {
      key: "like",
      title: "作品点赞",
      subtitle: "有人赞了你的视频",
      icon: Cn,
      bg: "rgba(236, 72, 153, 0.15)",
      watchKey: "watchLikes",
      watchChecked: a.config.watchLikes !== false,
      actions: [{
        key: "actionLikeFollow",
        label: "自动关注对方"
      }, {
        key: "actionLikeDm",
        label: "私信对方"
      }]
    }, {
      key: "follow",
      title: "新增关注",
      subtitle: "有人关注了你",
      icon: xn,
      bg: "rgba(16, 185, 129, 0.15)",
      watchKey: "watchFollows",
      watchChecked: a.config.watchFollows !== false,
      actions: [{
        key: "actionFollowBack",
        label: "自动回关"
      }, {
        key: "actionFollowDm",
        label: "回关后私信"
      }]
    }, {
      key: "message",
      title: "私信消息",
      subtitle: "收到新的私信或陌生人消息",
      icon: ut,
      bg: "rgba(245, 158, 11, 0.15)",
      watchKey: "watchMessages",
      watchChecked: a.config.watchMessages !== false,
      actions: [{
        key: "actionMessageReply",
        label: "自动回复私信"
      }]
    }]);
    return (C, l) => {
      const X = M("a-select");
      const F = M("a-input-number");
      const r = M("a-switch");
      const u = M("a-checkbox");
      const S = M("a-radio-button");
      const k = M("a-radio-group");
      const w = M("a-input");
      const D = M("a-textarea");
      const ee = M("a-radio");
      s();
      return m("div", Jn, [n("section", Yn, [n("div", Zn, [o(p(kn), {
        size: 15
      }), l[19] ||= n("div", null, [n("div", {
        class: "section-title"
      }, "基础设置"), n("div", {
        class: "section-desc"
      }, "选择监控账号与检查频率")], -1)]), n("div", Qn, [n("div", Xn, [l[20] ||= n("label", null, "运行账号", -1), o(X, {
        value: d.config.selectedAccounts,
        "onUpdate:value": l[0] ||= f => d.config.selectedAccounts = f,
        mode: "multiple",
        size: "small",
        placeholder: "选择已登录的 DY 账号",
        options: we.value,
        disabled: d.lockAccountSelection
      }, null, 8, ["value", "options", "disabled"])]), n("div", el, [l[23] ||= n("label", null, "检查间隔", -1), n("div", tl, [o(F, {
        value: d.config.intervalSecondsMin,
        "onUpdate:value": l[1] ||= f => d.config.intervalSecondsMin = f,
        min: 20,
        max: 3600,
        size: "small"
      }, null, 8, ["value"]), l[21] ||= n("span", {
        class: "range-sep"
      }, "至", -1), o(F, {
        value: d.config.intervalSecondsMax,
        "onUpdate:value": l[2] ||= f => d.config.intervalSecondsMax = f,
        min: 20,
        max: 3600,
        size: "small"
      }, null, 8, ["value"]), l[22] ||= n("span", {
        class: "range-unit"
      }, "秒随机", -1)]), l[24] ||= n("div", {
        class: "field-hint"
      }, "每轮检查通知与私信，间隔在此范围内随机，控制操作频率", -1)])])]), n("section", nl, [n("div", ll, [o(p(hn), {
        size: 15
      }), n("div", null, [l[25] ||= n("div", {
        class: "section-title"
      }, "互动回应策略", -1), n("div", al, v(d.config.enableAutoActions ? "收到互动后，监听什么、自动做什么" : "选择要监听的互动类型"), 1)]), o(r, {
        checked: d.config.enableAutoActions,
        "onUpdate:checked": l[3] ||= f => d.config.enableAutoActions = f,
        "checked-children": "自动回应",
        "un-checked-children": "仅记录",
        size: "small"
      }, null, 8, ["checked"])]), d.config.enableAutoActions ? (s(), m(P, {
        key: 1
      }, [n("div", ul, [(s(true), m(P, null, se(O.value, f => {
        s();
        return m("div", {
          key: f.key,
          class: he(["trigger-card", {
            active: f.watchChecked,
            disabled: !f.watchChecked
          }])
        }, [n("div", cl, [n("div", {
          class: "trigger-icon",
          style: nn({
            background: f.bg
          })
        }, [(s(), _(ln(f.icon), {
          size: 17
        }))], 4), n("div", dl, [n("div", rl, v(f.title), 1), n("div", fl, v(f.subtitle), 1)]), o(r, {
          checked: d.config[f.watchKey],
          "onUpdate:checked": R => d.config[f.watchKey] = R,
          size: "small"
        }, null, 8, ["checked", "onUpdate:checked"])]), d.config[f.watchKey] ? (s(), m("div", ml, [n("div", gl, [l[28] ||= n("span", {
          class: "flow-label"
        }, "收到后", -1), n("div", vl, [(s(true), m(P, null, se(f.actions, R => {
          s();
          return m("label", {
            key: R.key,
            class: he(["action-chip", {
              checked: d.config[R.key]
            }])
          }, [o(u, {
            checked: d.config[R.key],
            "onUpdate:checked": W => d.config[R.key] = W
          }, null, 8, ["checked", "onUpdate:checked"]), n("span", null, v(R.label), 1)], 2);
        }), 128)), f.key === "message" ? (s(), m("label", {
          key: 0,
          class: he(["action-chip option-chip", {
            checked: d.config.excludeGroupChats !== false
          }])
        }, [o(u, {
          checked: d.config.excludeGroupChats,
          "onUpdate:checked": l[4] ||= R => d.config.excludeGroupChats = R
        }, null, 8, ["checked"]), l[27] ||= n("span", null, "排除群聊", -1)], 2)) : I("", true)])])])) : (s(), m("div", pl, "未监听此类互动"))], 2);
      }), 128))]), n("div", yl, [o(p(pt), {
        size: 13
      }), l[29] ||= n("span", null, "每次自动操作前等待", -1), o(F, {
        value: d.config.actionDelayMin,
        "onUpdate:value": l[5] ||= f => d.config.actionDelayMin = f,
        min: 1,
        max: 60,
        size: "small"
      }, null, 8, ["value"]), l[30] ||= n("span", null, "至", -1), o(F, {
        value: d.config.actionDelayMax,
        "onUpdate:value": l[6] ||= f => d.config.actionDelayMax = f,
        min: 1,
        max: 120,
        size: "small"
      }, null, 8, ["value"]), l[31] ||= n("span", null, "秒", -1)]), me.value ? (s(), m("div", kl, [o(p(pt), {
        size: 13
      }), l[32] ||= n("span", null, "关注/回关成功后，等待", -1), o(F, {
        value: d.config.followDmDelayMin,
        "onUpdate:value": l[7] ||= f => d.config.followDmDelayMin = f,
        min: 1,
        max: 60,
        size: "small"
      }, null, 8, ["value"]), l[33] ||= n("span", null, "至", -1), o(F, {
        value: d.config.followDmDelayMax,
        "onUpdate:value": l[8] ||= f => d.config.followDmDelayMax = f,
        min: 2,
        max: 120,
        size: "small"
      }, null, 8, ["value"]), l[34] ||= n("span", null, "秒再进入主页发私信", -1)])) : I("", true), n("div", hl, [o(p(Ln), {
        size: 13
      }), l[35] ||= n("span", null, "每个用户最多回复", -1), o(F, {
        value: d.config.actionUserMaxRounds,
        "onUpdate:value": l[9] ||= f => d.config.actionUserMaxRounds = f,
        min: 1,
        max: 20,
        size: "small"
      }, null, 8, ["value"]), l[36] ||= n("span", null, "轮（评论和私信各自独立计算）", -1)]), n("div", wl, [l[38] ||= n("div", {
        class: "account-limit-title"
      }, "单账号限制数量", -1), (s(true), m(P, null, se(p(x), f => {
        s();
        return m("div", {
          key: f.key,
          class: "action-limit-row"
        }, [n("span", bl, v(f.label), 1), o(r, {
          checked: d.config[f.enabledField],
          "onUpdate:checked": R => d.config[f.enabledField] = R,
          size: "small"
        }, null, 8, ["checked", "onUpdate:checked"]), d.config[f.enabledField] ? (s(), m("div", Tl, [o(F, {
          value: d.config[f.minField],
          "onUpdate:value": R => d.config[f.minField] = R,
          min: 1,
          max: 10000,
          size: "small"
        }, null, 8, ["value", "onUpdate:value"]), l[37] ||= n("span", null, "—", -1), o(F, {
          value: d.config[f.maxField],
          "onUpdate:value": R => d.config[f.maxField] = R,
          min: 1,
          max: 10000,
          size: "small"
        }, null, 8, ["value", "onUpdate:value"])])) : I("", true)]);
      }), 128))])], 64)) : (s(), m("div", sl, [n("div", il, [o(p(tn), {
        size: 14
      }), l[26] ||= n("div", null, [n("div", {
        class: "record-hint-title"
      }, "记录在哪里？"), n("div", {
        class: "record-hint-body"
      }, [y(" 新互动会写入"), n("strong", null, "本任务"), y("的互动记录。任务启动后，在自动回复列表点击该任务的 "), n("strong", null, "「详情」"), y("即可查看用户、内容与时间。 ")])], -1)]), n("div", ol, [(s(), m(P, null, se(q, f => n("label", {
        key: f.key,
        class: "watch-only-item"
      }, [o(u, {
        checked: d.config[f.key],
        "onUpdate:checked": R => d.config[f.key] = R
      }, null, 8, ["checked", "onUpdate:checked"]), n("span", null, v(f.label), 1)])), 64))])]))]), n("section", Cl, [n("div", xl, [o(p(En), {
        size: 15
      }), n("div", null, [l[39] ||= n("div", {
        class: "section-title"
      }, "是否回复评论 / 私信", -1), n("div", Sl, v(d.config.enableAutoActions ? "先判断要不要回，再决定回什么" : "决定哪些评论 / 私信写入记录"), 1)])]), n("div", $l, [n("div", Il, [o(k, {
        value: Z.value,
        "onUpdate:value": l[10] ||= f => Z.value = f,
        "button-style": "solid",
        size: "small",
        class: "intent-judge-tabs"
      }, {
        default: g(() => [o(S, {
          value: "ai"
        }, {
          default: g(() => [...(l[40] ||= [y("AI 研判", -1)])]),
          _: 1
        }), o(S, {
          value: "keyword"
        }, {
          default: g(() => [...(l[41] ||= [y("关键词", -1)])]),
          _: 1
        })]),
        _: 1
      }, 8, ["value"]), Z.value === "ai" ? (s(), m("div", Al, " 由 AI 判断这条评论 / 私信是否值得回复；拿不准时倾向跟进。已绑定智能体的账号用对应人设，未绑定则用通用 AI。 ")) : (s(), m(P, {
        key: 1
      }, [o(w, {
        value: d.config.keywords,
        "onUpdate:value": l[11] ||= f => d.config.keywords = f,
        placeholder: "价格,合作,怎么买；留空则全部回复",
        size: "small"
      }, null, 8, ["value"]), l[42] ||= n("div", {
        class: "field-hint"
      }, " 多个关键词用逗号隔开，命中任一即回复。留空表示评论和私信全部回复。 ", -1)], 64))]), n("div", zl, [l[43] ||= n("label", null, "排除用户", -1), o(D, {
        value: d.config.excludeUsers,
        "onUpdate:value": l[12] ||= f => d.config.excludeUsers = f,
        placeholder: "这些昵称的互动将被忽略；多个用逗号或换行分隔",
        rows: 2,
        size: "small"
      }, null, 8, ["value"])])])]), n("section", El, [n("div", Ll, [o(p(ut), {
        size: 15
      }), n("div", null, [l[44] ||= n("div", {
        class: "section-title"
      }, "评论与私信内容", -1), n("div", Ul, v(d.config.enableAutoActions ? "评论和私信可分别选择 AI 或固定话术" : "打开上方「自动回应」后生效"), 1)])]), n("div", _l, [ie.value ? (s(), m("div", Ml, [n("div", Rl, [l[47] ||= n("div", null, [n("div", {
        class: "reply-channel-title"
      }, "评论回复内容"), n("div", {
        class: "field-hint"
      }, "用于“作品评论”和“评论回复”里的自动回复动作")], -1), o(k, {
        value: K.value,
        "onUpdate:value": l[13] ||= f => K.value = f,
        "button-style": "solid",
        size: "small",
        class: "intent-judge-tabs"
      }, {
        default: g(() => [o(S, {
          value: "ai"
        }, {
          default: g(() => [...(l[45] ||= [y("AI 自动生成", -1)])]),
          _: 1
        }), o(S, {
          value: "template"
        }, {
          default: g(() => [...(l[46] ||= [y("自定义模板", -1)])]),
          _: 1
        })]),
        _: 1
      }, 8, ["value"])]), K.value === "ai" ? (s(), m("div", Dl, " 评论回复将使用账号绑定的 AI 智能体生成；未绑定智能体时回退到评论模板。 ")) : (s(), _(yt, {
        key: 1,
        items: Q.value,
        "single-item": "",
        title: "评论回复模板",
        "text-hint": "一行一条，自动轮询",
        "text-placeholder": "支持 {nickname}、{content}",
        "onUpdate:items": ue
      }, null, 8, ["items"]))])) : I("", true), J.value ? (s(), m("div", Wl, [n("div", Fl, [l[50] ||= n("div", null, [n("div", {
        class: "reply-channel-title"
      }, "私信内容"), n("div", {
        class: "field-hint"
      }, "用于主动私信和收到私信后的自动回复")], -1), o(k, {
        value: Y.value,
        "onUpdate:value": l[14] ||= f => Y.value = f,
        "button-style": "solid",
        size: "small",
        class: "intent-judge-tabs"
      }, {
        default: g(() => [o(S, {
          value: "ai"
        }, {
          default: g(() => [...(l[48] ||= [y("AI 自动生成", -1)])]),
          _: 1
        }), o(S, {
          value: "template"
        }, {
          default: g(() => [...(l[49] ||= [y("固定话术", -1)])]),
          _: 1
        })]),
        _: 1
      }, 8, ["value"])]), Y.value === "ai" ? (s(), m("div", Pl, " 私信将使用账号绑定的 AI 智能体生成，并在回复会话时结合最近聊天记录；未绑定时回退到固定话术。 ")) : (s(), _(yt, {
        key: 1,
        items: oe.value,
        "single-item": "",
        title: "私信固定话术",
        "text-hint": "一行一条，自动轮询",
        "text-placeholder": "支持 {nickname}、{content}",
        "onUpdate:items": ce
      }, null, 8, ["items"]))])) : I("", true), !ie.value && !J.value ? (s(), m("div", Ol, " 开启自动回复评论、主动私信或自动回复私信后，可分别设置对应内容。 ")) : I("", true)])]), n("section", Nl, [n("div", Bl, [o(p(wn), {
        size: 15
      }), l[51] ||= n("div", null, [n("div", {
        class: "section-title"
      }, "消息推送"), n("div", {
        class: "section-desc"
      }, "新互动同步到飞书 / 钉钉")], -1), o(r, {
        checked: d.config.enableWebhook,
        "onUpdate:checked": l[15] ||= f => d.config.enableWebhook = f,
        size: "small"
      }, null, 8, ["checked"])]), d.config.enableWebhook ? (s(), m("div", jl, [o(k, {
        value: d.config.webhookType,
        "onUpdate:value": l[16] ||= f => d.config.webhookType = f,
        size: "small",
        class: "mode-group"
      }, {
        default: g(() => [o(ee, {
          value: "feishu"
        }, {
          default: g(() => [...(l[52] ||= [y("飞书", -1)])]),
          _: 1
        }), o(ee, {
          value: "dingtalk"
        }, {
          default: g(() => [...(l[53] ||= [y("钉钉", -1)])]),
          _: 1
        }), o(ee, {
          value: "custom"
        }, {
          default: g(() => [...(l[54] ||= [y("自定义", -1)])]),
          _: 1
        })]),
        _: 1
      }, 8, ["value"]), o(w, {
        value: d.config.webhookUrl,
        "onUpdate:value": l[17] ||= f => d.config.webhookUrl = f,
        placeholder: "Webhook 地址",
        size: "small"
      }, null, 8, ["value"]), d.config.webhookType === "dingtalk" ? (s(), _(w, {
        key: 0,
        value: d.config.webhookSecret,
        "onUpdate:value": l[18] ||= f => d.config.webhookSecret = f,
        placeholder: "钉钉加签 Secret",
        size: "small"
      }, null, 8, ["value"])) : I("", true)])) : I("", true)])]);
    };
  }
};
const kt = Ye(Vl, [["__scopeId", "data-v-dca91170"]]);
const Hl = {
  class: "self-warmup-view"
};
const Kl = {
  class: "tasks-toolbar"
};
const ql = {
  key: 0,
  class: "selection-hint"
};
const Gl = {
  class: "table-container"
};
const Jl = {
  class: "task-empty-plus"
};
const Yl = ["title"];
const Zl = {
  key: 2,
  class: "cell-ellipsis"
};
const Ql = {
  key: 3,
  class: "cell-ellipsis"
};
const Xl = {
  class: "stats-text"
};
const ea = {
  key: 1,
  class: "muted"
};
const ta = {
  key: 6,
  class: "action-links"
};
const na = {
  key: 0
};
const la = {
  key: 0
};
const aa = {
  class: "field",
  style: {
    "margin-bottom": "12px"
  }
};
const sa = {
  key: 0,
  class: "drawer-loading"
};
const ia = {
  class: "detail-summary"
};
const oa = {
  class: "detail-toolbar"
};
const ua = {
  key: 0,
  class: "selection-hint"
};
const ca = {
  class: "cell-ellipsis"
};
const da = {
  key: 1
};
const ra = ["onClick"];
const fa = {
  key: 1,
  class: "cell-ellipsis"
};
const ma = {
  class: "cell-ellipsis"
};
const ga = {
  key: 1,
  class: "muted"
};
const va = {
  key: 1,
  class: "muted"
};
const pa = {
  class: "action-cell"
};
const ya = {
  key: 0,
  class: "action-fail-reason cell-ellipsis"
};
const ka = {
  key: 1,
  class: "muted"
};
const ha = {
  class: "detail-leads-pagination"
};
const wa = {
  key: 0,
  class: "log-drawer-body"
};
const ba = {
  class: "log-stats-row"
};
const Ta = {
  class: "log-stat"
};
const Ca = {
  class: "log-stat"
};
const xa = {
  class: "log-stat"
};
const Sa = {
  class: "log-stat"
};
const $a = {
  class: "log-stat"
};
const Ia = {
  class: "log-toolbar"
};
const Aa = {
  class: "log-time"
};
const za = {
  class: "log-msg"
};
const Ea = {
  key: 0,
  class: "task-log-empty"
};
const La = {
  __name: "SelfWarmup",
  setup(d) {
    const a = on();
    const {
      invoke: x,
      on: we,
      send: ie
    } = ht();
    const {
      startSelfWarmupTask: J,
      stopSelfWarmupTask: me,
      restartSelfWarmupTask: K
    } = un();
    const Y = Sn();
    const Z = T(false);
    const H = T(false);
    const j = T(false);
    const Q = T(null);
    const oe = T(null);
    const ue = T(null);
    const ce = T(null);
    const q = T(null);
    const O = T([]);
    const C = T([]);
    const l = T(false);
    const X = T(false);
    const F = T(false);
    const r = T(false);
    const u = T(null);
    const S = T("");
    const k = T("all");
    const w = T([]);
    const D = T(false);
    const ee = T(false);
    const f = T(false);
    const R = T(false);
    const W = T(null);
    const N = T("");
    const de = wt(rt());
    const L = T(null);
    const re = T(false);
    const ge = T(null);
    const $e = T(false);
    const U = T(null);
    const ve = T("");
    const Ze = T(null);
    const Ue = T({
      width: typeof window !== "undefined" ? window.innerWidth : 1280,
      height: typeof window !== "undefined" ? window.innerHeight : 800
    });
    function _e() {
      Ue.value = {
        width: window.innerWidth || 1280,
        height: window.innerHeight || 800
      };
    }
    const Qe = B(() => {
      const t = Ue.value.width;
      const e = Math.round(t * 0.72);
      const i = Math.round(t * 0.92);
      return Math.min(Math.max(e, 640), Math.min(1400, i));
    });
    const Xe = B(() => ({
      paddingTop: "12px",
      paddingBottom: "8px",
      maxHeight: `${Math.max(360, Math.round(Ue.value.height * 0.72))}px`,
      overflowY: "auto"
    }));
    const Tt = B(() => ({
      selectedRowKeys: C.value,
      onChange: t => {
        C.value = t;
      }
    }));
    const Ct = [{
      title: "名称",
      key: "name",
      width: 150
    }, {
      title: "时间",
      key: "time",
      width: 130
    }, {
      title: "账号",
      key: "accounts",
      width: 160
    }, {
      title: "来源",
      key: "sources",
      width: 160
    }, {
      title: "统计",
      key: "stats",
      width: 220
    }, {
      title: "状态",
      key: "status",
      width: 78
    }, {
      title: "操作",
      key: "actions",
      width: 330,
      fixed: "right"
    }];
    const te = $n();
    const pe = T([]);
    const fe = T(0);
    const Ie = T(0);
    const ye = T(0);
    const Me = T(0);
    const Re = T(false);
    function et(t, e) {
      In(te, {
        current: t,
        pageSize: e
      });
      Te();
    }
    const xt = [{
      title: "时间",
      key: "time",
      width: 140
    }, {
      title: "类型",
      key: "type",
      width: 86
    }, {
      title: "用户",
      key: "nickname",
      width: 120
    }, {
      title: "内容",
      key: "content",
      ellipsis: true
    }, {
      title: "研判",
      key: "judge",
      width: 94
    }, {
      title: "回复",
      key: "suggestion",
      width: 210,
      ellipsis: true
    }, {
      title: "回应",
      key: "action",
      width: 200,
      ellipsis: true
    }, {
      title: "操作",
      key: "rowActions",
      width: 64,
      fixed: "right"
    }];
    const St = B(() => {
      const t = fe.value;
      const e = ye.value;
      const i = Me.value;
      return [{
        label: `全部 (${t})`,
        value: "all"
      }, {
        label: `建议 (${e})`,
        value: "hit"
      }, {
        label: `仅记录 (${i})`,
        value: "miss"
      }];
    });
    const $t = B(() => ({
      selectedRowKeys: w.value,
      onChange: t => {
        w.value = t;
      }
    }));
    const be = B(() => {
      var i;
      if ((i = U.value) == null || !i.id) {
        return [];
      }
      const t = a.getTaskLogs(U.value.id);
      const e = ve.value.trim().toLowerCase();
      if (e) {
        return t.filter($ => String($.msg || "").toLowerCase().includes(e));
      } else {
        return t;
      }
    });
    function Ae(t) {
      return a.getTaskLogs(t).length;
    }
    function le(t) {
      return a.selfWarmupRunningTasks.some(e => String(e.selfWarmupTaskId) === String(t.id));
    }
    function It(t) {
      if (t === "running") {
        return "processing";
      } else if (t === "completed") {
        return "success";
      } else if (t === "stopped") {
        return "default";
      } else {
        return "warning";
      }
    }
    function At(t) {
      if (t === "message") {
        return "blue";
      } else if (t === "comment" || t === "reply") {
        return "green";
      } else if (t === "follow") {
        return "purple";
      } else if (t === "like") {
        return "pink";
      } else {
        return "default";
      }
    }
    function tt(t) {
      return yn((t == null ? undefined : t.runs) || [], a.accounts);
    }
    function zt(t) {
      const e = t.stats || {};
      const i = [Se(e)];
      if (e.lastCycleAt) {
        i.push(`上轮 ${new Date(e.lastCycleAt).toLocaleTimeString("zh-CN", {
          hour12: false
        })}`);
      }
      if (e.lastCycleEvents != null) {
        i.push(`上轮新互动 ${e.lastCycleEvents}`);
      }
      return i.filter(Boolean).join(" · ");
    }
    function ze(t, e) {
      var h;
      var z;
      const i = O.value.findIndex(E => E.id === t);
      if (i === -1) {
        return;
      }
      const $ = {
        ...e
      };
      if (Object.prototype.hasOwnProperty.call($, "events")) {
        delete $.events;
      }
      O.value[i] = {
        ...O.value[i],
        ...$,
        events: []
      };
      if (((h = u.value) == null ? undefined : h.id) === t) {
        u.value = {
          ...u.value,
          ...$,
          events: []
        };
      }
      if (((z = U.value) == null ? undefined : z.id) === t) {
        U.value = {
          ...U.value,
          ...$,
          events: []
        };
      }
    }
    function Et(t, e = {}) {
      const i = O.value.find(h => h.id === t);
      if (!i) {
        return;
      }
      const $ = {
        ...(i.stats || {})
      };
      Object.keys(e).forEach(h => {
        const z = e[h];
        if (h === "lastCycleAt" || h === "lastCycleEvents") {
          $[h] = z;
          return;
        }
        const E = Number(z);
        if (Number.isFinite(E) && E > 0) {
          $[h] = (Number($[h]) || 0) + Math.floor(E);
        }
      });
      ze(t, {
        stats: $
      });
    }
    function De(t) {
      if (a.selfWarmupRunningTasks.some(e => String(e.selfWarmupTaskId) === String(t.id))) {
        return "running";
      } else if (t.status === "running") {
        return "stopped";
      } else {
        return t.status;
      }
    }
    async function ne() {
      var t;
      var e;
      Z.value = true;
      try {
        const i = await x("get-self-warmup-tasks");
        let $ = false;
        await je(a, x, i).then(() => {
          $ = true;
        }).catch(h => {
          console.warn("[SelfWarmup] 同步后台运行状态失败:", (h == null ? undefined : h.message) || h);
        });
        O.value = (i || []).map(h => ({
          ...h,
          events: [],
          status: $ ? De(h) : h.status
        }));
        if ((t = u.value) != null && t.id) {
          const h = O.value.find(z => z.id === u.value.id);
          if (h) {
            u.value = {
              ...h,
              events: []
            };
          }
        }
        if ((e = U.value) != null && e.id) {
          const h = O.value.find(z => z.id === U.value.id);
          if (h) {
            U.value = {
              ...h,
              events: []
            };
          }
        }
      } finally {
        Z.value = false;
      }
    }
    function nt() {
      Object.assign(de, rt());
      N.value = pn();
      l.value = true;
    }
    async function Lt() {
      var e;
      const t = N.value.trim();
      if (!t) {
        b.warning("请填写任务名称");
        return;
      }
      if ((e = de.selectedAccounts) == null || !e.length) {
        b.warning("请至少选择一个 DY 账号");
        return;
      }
      H.value = true;
      try {
        if (!(await J(de, {
          name: t
        }))) {
          return;
        }
        l.value = false;
        b.success("自动回复已启动");
        await ne();
      } finally {
        H.value = false;
      }
    }
    function Ut(t) {
      ae.confirm({
        title: "确认停止该自动回复？",
        okText: "停止",
        okType: "danger",
        onOk: async () => {
          oe.value = t.id;
          try {
            if (q.value === t.id) {
              await x("hide-self-warmup-window", {
                taskId: t.id
              }).catch(() => null);
              q.value = null;
            }
            if (me(t.id, t)) {
              b.success("已停止");
              await ne();
            }
          } finally {
            oe.value = null;
          }
        }
      });
    }
    function _t(t) {
      if (t == null || !t.configSnapshot) {
        b.warning("该任务无可用配置，无法重启");
        return;
      }
      if (le(t)) {
        b.warning("该任务正在运行中，请先停止后再重启");
        return;
      }
      ae.confirm({
        title: "确认重启该自动回复？",
        content: "将使用原配置继续运行，不会新建任务。",
        okText: "重启",
        onOk: async () => {
          ue.value = t.id;
          try {
            if (!(await K(t))) {
              return;
            }
            b.success("自动回复已重启");
            await ne();
          } finally {
            ue.value = null;
          }
        }
      });
    }
    function Mt(t) {
      if (le(t)) {
        b.warning("运行中的任务无法删除，请先停止");
        return;
      }
      ae.confirm({
        title: "确认删除该任务？",
        content: `将删除任务「${t.name}」及其互动记录。`,
        okText: "删除",
        okType: "danger",
        onOk: async () => {
          Q.value = t.id;
          try {
            if (!(await x("delete-self-warmup-tasks", [t.id]))) {
              b.error("删除失败");
              return;
            }
            a.clearTaskLogs(t.id);
            C.value = C.value.filter(i => i !== t.id);
            b.success("已删除");
            await ne();
          } catch (e) {
            b.error(`删除失败：${e.message || e}`);
          } finally {
            Q.value = null;
          }
        }
      });
    }
    function Rt() {
      if (!C.value.length) {
        return;
      }
      if (O.value.filter(e => C.value.includes(e.id) && le(e)).length > 0) {
        b.warning("运行中的任务无法删除，请取消勾选后重试");
        return;
      }
      ae.confirm({
        title: "确认删除所选任务？",
        content: `将删除 ${C.value.length} 个任务记录及其互动详情。`,
        okText: "删除",
        okType: "danger",
        onOk: async () => {
          j.value = true;
          try {
            const e = [...C.value];
            if (!(await x("delete-self-warmup-tasks", e))) {
              b.error("删除失败");
              return;
            }
            e.forEach($ => a.clearTaskLogs($));
            C.value = [];
            b.success(`已删除 ${e.length} 个任务`);
            await ne();
          } catch (e) {
            b.error(`删除失败：${e.message || e}`);
          } finally {
            j.value = false;
          }
        }
      });
    }
    function Dt(t) {
      ge.value = t;
      L.value = t != null && t.configSnapshot ? vt(t.configSnapshot) : null;
      X.value = true;
    }
    async function Wt() {
      var e;
      var i;
      var $;
      if ((e = ge.value) == null || !e.id || !L.value) {
        return;
      }
      const t = Array.isArray(($ = (i = ge.value) == null ? undefined : i.configSnapshot) == null ? undefined : $.selectedAccounts) ? ge.value.configSnapshot.selectedAccounts.filter(Boolean) : [];
      if (!t.length) {
        b.warning("该任务无有效账号配置");
        return;
      }
      L.value.selectedAccounts = [...t];
      re.value = true;
      try {
        if (!(await x("update-self-warmup-task", {
          id: ge.value.id,
          patch: {
            configSnapshot: vt(L.value)
          }
        }))) {
          b.error("保存失败");
          return;
        }
        b.success("自热配置已保存");
        X.value = false;
        await ne();
      } catch (h) {
        b.error(`保存失败：${h.message || h}`);
      } finally {
        re.value = false;
      }
    }
    async function Ft(t) {
      u.value = {
        ...t,
        events: []
      };
      S.value = "";
      k.value = "all";
      w.value = [];
      te.current = 1;
      F.value = true;
      r.value = true;
      try {
        await ne();
        u.value = {
          ...(O.value.find(e => e.id === t.id) || t),
          events: []
        };
        await Te();
      } finally {
        r.value = false;
      }
    }
    function Pt() {
      pe.value = [];
      fe.value = 0;
      Ie.value = 0;
      ye.value = 0;
      Me.value = 0;
      w.value = [];
    }
    function Ot(t) {
      if (!t) {
        Pt();
        u.value = null;
      }
    }
    let We = 0;
    async function Te() {
      var i;
      var $;
      const t = (i = u.value) == null ? undefined : i.id;
      if (!t || !F.value) {
        return;
      }
      const e = ++We;
      Re.value = true;
      try {
        const h = Number(te.pageSize) || 20;
        const z = Number(te.current) || 1;
        const E = await x("get-self-warmup-events", {
          taskId: t,
          keyword: String(S.value || "").trim(),
          result: k.value,
          offset: Math.max(0, (z - 1) * h),
          limit: h
        }).catch(() => null);
        if (e !== We || (($ = u.value) == null ? undefined : $.id) !== t) {
          return;
        }
        pe.value = Array.isArray(E == null ? undefined : E.items) ? E.items : [];
        Ie.value = Number(E == null ? undefined : E.total) || 0;
        const V = (E == null ? undefined : E.counts) || {};
        fe.value = Number(V.all) || 0;
        ye.value = Number(V.hit) || 0;
        Me.value = Number(V.miss) || 0;
        ze(t, {
          eventCount: fe.value,
          hitCount: ye.value
        });
        const ke = new Set(pe.value.map(Ce => Ce.id));
        w.value = w.value.filter(Ce => ke.has(Ce));
      } finally {
        if (e === We) {
          Re.value = false;
        }
      }
    }
    function Nt() {
      var t;
      if ((t = u.value) != null && t.id) {
        Te();
      }
    }
    async function Fe(t, {
      clearAll: e = false
    } = {}) {
      var $;
      if (($ = u.value) == null || !$.id) {
        return null;
      }
      const i = await x("delete-self-warmup-events", {
        taskId: u.value.id,
        eventIds: t,
        clearAll: e
      });
      if (i) {
        Nt();
        return i;
      } else {
        return null;
      }
    }
    function Bt(t) {
      var e;
      if (t != null && !!t.id && (e = u.value) != null && !!e.id) {
        ae.confirm({
          title: "确认删除该条互动记录？",
          content: `将删除 @${t.nickname || "用户"} 的互动记录，并同步清除对应去重记忆，该互动下次扫描可再次记录。`,
          okText: "删除",
          okType: "danger",
          onOk: async () => {
            W.value = t.id;
            try {
              if (!(await Fe([t.id]))) {
                b.error("删除失败");
                return;
              }
              b.success("已删除");
            } catch (i) {
              b.error(`删除失败：${i.message || i}`);
            } finally {
              W.value = null;
            }
          }
        });
      }
    }
    function jt() {
      var e;
      if (!w.value.length || (e = u.value) == null || !e.id) {
        return;
      }
      const t = w.value.length;
      ae.confirm({
        title: `确认删除所选 ${t} 条记录？`,
        content: "删除后将同步清除对应去重记忆，这些互动下次扫描可再次记录。",
        okText: "删除",
        okType: "danger",
        onOk: async () => {
          D.value = true;
          try {
            if (!(await Fe([...w.value]))) {
              b.error("删除失败");
              return;
            }
            w.value = [];
            b.success(`已删除 ${t} 条`);
          } catch (i) {
            b.error(`删除失败：${i.message || i}`);
          } finally {
            D.value = false;
          }
        }
      });
    }
    function Vt() {
      var t;
      if ((t = u.value) != null && !!t.id && pe.value.length !== 0) {
        ae.confirm({
          title: "确认清空全部互动记录？",
          content: `将删除该任务下全部 ${pe.value.length} 条互动记录，并清空去重与自动回应轮次缓存。`,
          okText: "清空",
          okType: "danger",
          onOk: async () => {
            ee.value = true;
            try {
              if (!(await Fe([], {
                clearAll: true
              }))) {
                b.error("清空失败");
                return;
              }
              w.value = [];
              b.success("已清空");
            } catch (e) {
              b.error(`清空失败：${e.message || e}`);
            } finally {
              ee.value = false;
            }
          }
        });
      }
    }
    function Ht() {
      var t;
      if (!!R.value && (t = u.value) != null && !!t.id) {
        ae.confirm({
          title: "清空回复次数？（开发版）",
          content: "仅清空「每个用户最多回复 N 次」计数，不删除互动记录。便于重复测试同一用户的回复/私信。",
          okText: "清空次数",
          onOk: async () => {
            f.value = true;
            try {
              const e = await x("clear-self-warmup-user-rounds", {
                taskId: u.value.id
              });
              if (e == null || !e.ok) {
                b.error((e == null ? undefined : e.reason) || "清空失败");
                return;
              }
              b.success("回复次数已清空");
            } catch (e) {
              b.error(`清空失败：${e.message || e}`);
            } finally {
              f.value = false;
            }
          }
        });
      }
    }
    async function Pe(t) {
      if (t) {
        try {
          const e = await x("get-self-warmup-task-logs", {
            taskId: t
          });
          if (!Array.isArray(e) || e.length === 0) {
            return;
          }
          a.mergeTaskLogs(t, e.map(i => ({
            msg: i.message || i.msg,
            message: i.message || i.msg,
            level: i.level || "normal",
            ts: i.ts
          })));
        } catch {}
      }
    }
    async function Kt(t) {
      var e;
      U.value = O.value.find(i => i.id === t.id) || t;
      ve.value = "";
      $e.value = true;
      await Pe((e = U.value) == null ? undefined : e.id);
    }
    async function qt(t) {
      if (!le(t)) {
        b.warning("该自热互动任务未在运行");
        return;
      }
      ce.value = t.id;
      try {
        if (q.value === t.id) {
          const i = await x("hide-self-warmup-window", {
            taskId: t.id
          }).catch($ => ({
            success: false,
            error: ($ == null ? undefined : $.message) || String($)
          }));
          if (i == null || !i.success) {
            b.error((i == null ? undefined : i.error) || (i == null ? undefined : i.msg) || "收起画面失败");
            return;
          }
          q.value = null;
          b.success("已收起监控画面");
          return;
        }
        const e = await x("show-self-warmup-window", {
          taskId: t.id
        }).catch(i => ({
          success: false,
          msg: (i == null ? undefined : i.message) || String(i)
        }));
        if (e != null && e.success) {
          q.value = t.id;
          b.success("已打开运行监控窗口");
        } else {
          b.warning((e == null ? undefined : e.msg) || "打开监控窗口失败");
        }
      } finally {
        ce.value = null;
      }
    }
    function Gt() {
      var e;
      if ((e = U.value) == null || !e.id) {
        return;
      }
      if (Ae(U.value.id) === 0) {
        b.info("暂无日志");
        return;
      }
      const t = U.value.id;
      a.clearTaskLogs(t);
      x("clear-self-warmup-task-logs", {
        taskId: t
      }).catch(() => {});
      b.success("日志已清空");
    }
    async function Jt() {
      try {
        const t = await An(be.value, {
          title: U.value ? `运行日志 · ${U.value.name}` : "运行日志",
          search: ve.value
        });
        b.success(`已复制 ${t} 条日志`);
      } catch (t) {
        if ((t == null ? undefined : t.code) === "EMPTY_LOGS") {
          return b.warning("当前窗口暂无可复制日志");
        }
        b.error("日志复制失败，请手动复制");
      }
    }
    function Yt(t) {
      if (t) {
        ie("open-url", t);
      }
    }
    function lt(t = false) {
      vn(() => {
        const e = Ze.value;
        if (e && (t || e.scrollTop <= 40)) {
          e.scrollTop = 0;
        }
      });
    }
    function Zt(t) {
      var e;
      if (t) {
        if ((e = U.value) != null && e.id) {
          Pe(U.value.id);
        }
        lt(true);
        return;
      }
      U.value = null;
      ve.value = "";
    }
    qe([S, k], () => {
      te.current = 1;
      Te();
    });
    qe(be, () => {
      if ($e.value) {
        lt(false);
      }
    });
    let Oe = null;
    bt(async () => {
      _e();
      window.addEventListener("resize", _e);
      try {
        const e = await x("get-version-info");
        R.value = e != null && !!e.isDevEdition;
      } catch {
        R.value = false;
      }
      await ne();
      const t = new Set(a.selfWarmupRunningTasks.map(e => e.selfWarmupTaskId).filter(Boolean));
      await Promise.all([...t].map(e => Pe(e)));
      Oe = we("self-warmup-task-event", async e => {
        var $;
        var h;
        if (e == null || !e.taskId) {
          return;
        }
        if (e.type === "log" && e.message) {
          a.addTaskLog(e.taskId, e.message, {
            level: e.level || "normal",
            ts: e.ts
          });
        }
        if (e.type === "event" && e.event) {
          const z = e.event;
          const E = Be[z.eventType] || z.eventLabel || "通知";
          const V = String(z.text || "").replace(/\s+/g, " ").trim();
          const ke = V ? `「${V.slice(0, 36)}${V.length > 36 ? "…" : ""}」` : "（无正文摘要）";
          a.addTaskLog(e.taskId, `独立通知｜${E} · @${z.nickname || "用户"} ${ke}`, {
            level: z.matched === false ? "normal" : "success"
          });
        }
        if (e.type === "stats-update" && e.statsDelta) {
          Et(e.taskId, e.statsDelta);
        }
        if (e.type === "cycle-done" || e.type === "event" || e.type === "stats-update" && Number(($ = e.statsDelta) == null ? undefined : $.eventsTotal) > 0) {
          const z = await x("get-self-warmup-tasks").catch(() => null);
          if (Array.isArray(z)) {
            await je(a, x, z).catch(() => {});
            const E = z.find(V => String(V.id) === String(e.taskId));
            if (E) {
              ze(e.taskId, {
                stats: E.stats,
                eventCount: E.eventCount,
                hitCount: E.hitCount,
                status: De(E)
              });
              if (F.value && ((h = u.value) == null ? undefined : h.id) === e.taskId) {
                Te();
              }
            }
          }
        } else if (e.taskId && !le({
          id: e.taskId
        })) {
          await je(a, x).catch(() => {});
          const z = O.value.find(E => String(E.id) === String(e.taskId));
          if (z) {
            ze(e.taskId, {
              status: De(z)
            });
          }
        }
      });
    });
    cn(() => {
      window.removeEventListener("resize", _e);
      if (Oe) {
        Oe();
      }
    });
    return (t, e) => {
      const i = M("a-button");
      const $ = M("a-space");
      const h = M("a-tooltip");
      const z = M("a-tag");
      const E = M("a-table");
      const V = M("a-input");
      const ke = M("a-modal");
      const Ce = M("a-spin");
      const Qt = M("a-segmented");
      const Xt = M("a-pagination");
      const at = M("a-drawer");
      s();
      return m("div", Hl, [n("div", Kl, [e[11] ||= n("div", {
        class: "toolbar-left"
      }, [n("h3", null, "自动回复"), n("span", {
        class: "toolbar-desc"
      }, "监听通知与私信，可按互动类型自动回关、回复、私信")], -1), o($, {
        size: 8
      }, {
        default: g(() => [C.value.length ? (s(), m("span", ql, "已选 " + v(C.value.length) + " 条", 1)) : I("", true), o(i, {
          danger: "",
          size: "small",
          disabled: C.value.length === 0,
          loading: j.value,
          onClick: Rt
        }, {
          default: g(() => [...(e[8] ||= [y(" 批量删除 ", -1)])]),
          _: 1
        }, 8, ["disabled", "loading"]), o(i, {
          size: "small",
          onClick: ne,
          loading: Z.value
        }, {
          default: g(() => [...(e[9] ||= [y("刷新", -1)])]),
          _: 1
        }, 8, ["loading"]), o(i, {
          type: "primary",
          size: "small",
          onClick: nt
        }, {
          default: g(() => [o(p(Ge), {
            size: 13,
            style: {
              "margin-right": "3px"
            }
          }), e[10] ||= y(" 新建任务 ", -1)]),
          _: 1
        })]),
        _: 1
      })]), n("div", Gl, [o(E, {
        columns: Ct,
        "data-source": O.value,
        loading: Z.value,
        "row-key": "id",
        size: "small",
        scroll: {
          x: 1120
        },
        pagination: p(Y),
        "row-selection": Tt.value
      }, {
        emptyText: g(() => [n("button", {
          type: "button",
          class: "task-empty-create",
          onClick: nt
        }, [n("span", Jl, [o(p(Ge), {
          size: 30
        })]), e[12] ||= n("span", null, "还没有任务，去新建一个", -1)])]),
        bodyCell: g(({
          column: A,
          record: c
        }) => [A.key === "name" ? (s(), m("span", {
          key: 0,
          class: "cell-ellipsis",
          title: c.name
        }, v(c.name), 9, Yl)) : A.key === "time" ? (s(), m(P, {
          key: 1
        }, [y(v(p(ft)(c)), 1)], 64)) : A.key === "accounts" ? (s(), m("span", Zl, v(tt(c)), 1)) : A.key === "sources" ? (s(), m("span", Ql, v(p(dn)(c.configSnapshot || {}) || "—"), 1)) : A.key === "stats" ? (s(), m(P, {
          key: 4
        }, [p(Se)(c.stats) ? (s(), _(h, {
          key: 0,
          title: zt(c)
        }, {
          default: g(() => [n("span", Xl, v(p(Se)(c.stats)), 1)]),
          _: 2
        }, 1032, ["title"])) : (s(), m("span", ea, "—"))], 64)) : A.key === "status" ? (s(), _(z, {
          key: 5,
          color: It(c.status),
          class: "mini-tag"
        }, {
          default: g(() => [y(v(p(rn)[c.status] || c.status), 1)]),
          _: 2
        }, 1032, ["color"])) : A.key === "actions" ? (s(), m("div", ta, [o(i, {
          type: "link",
          size: "small",
          onClick: G => Ft(c)
        }, {
          default: g(() => [e[13] ||= y(" 详情", -1), p(mt)(c) ? (s(), m("span", na, "(" + v(p(mt)(c)) + ")", 1)) : I("", true)]),
          _: 2
        }, 1032, ["onClick"]), o(i, {
          type: "link",
          size: "small",
          onClick: G => Dt(c)
        }, {
          default: g(() => [...(e[14] ||= [y("编辑", -1)])]),
          _: 1
        }, 8, ["onClick"]), o(i, {
          type: "link",
          size: "small",
          onClick: G => Kt(c)
        }, {
          default: g(() => [e[15] ||= y(" 日志", -1), Ae(c.id) ? (s(), m("span", la, "(" + v(Ae(c.id)) + ")", 1)) : I("", true)]),
          _: 2
        }, 1032, ["onClick"]), le(c) ? (s(), _(i, {
          key: 0,
          type: "link",
          size: "small",
          loading: ce.value === c.id,
          onClick: G => qt(c)
        }, {
          default: g(() => [q.value !== c.id ? (s(), _(p(zn), {
            key: 0,
            size: 13,
            style: {
              "margin-right": "3px"
            }
          })) : I("", true), y(" " + v(q.value === c.id ? "收起画面" : "监控"), 1)]),
          _: 2
        }, 1032, ["loading", "onClick"])) : I("", true), le(c) ? (s(), _(i, {
          key: 1,
          type: "link",
          size: "small",
          danger: "",
          loading: oe.value === c.id,
          onClick: G => Ut(c)
        }, {
          default: g(() => [...(e[16] ||= [y(" 停止 ", -1)])]),
          _: 1
        }, 8, ["loading", "onClick"])) : (s(), _(i, {
          key: 2,
          type: "link",
          size: "small",
          loading: ue.value === c.id,
          onClick: G => _t(c)
        }, {
          default: g(() => [...(e[17] ||= [y(" 重启 ", -1)])]),
          _: 1
        }, 8, ["loading", "onClick"])), le(c) ? I("", true) : (s(), _(i, {
          key: 3,
          type: "link",
          size: "small",
          danger: "",
          loading: Q.value === c.id,
          onClick: G => Mt(c)
        }, {
          default: g(() => [...(e[18] ||= [y(" 删除 ", -1)])]),
          _: 1
        }, 8, ["loading", "onClick"]))])) : I("", true)]),
        _: 1
      }, 8, ["data-source", "loading", "pagination", "row-selection"])]), o(ke, {
        open: l.value,
        "onUpdate:open": e[1] ||= A => l.value = A,
        title: "新建自动回复",
        "ok-text": "启动",
        "confirm-loading": H.value,
        onOk: Lt,
        width: Qe.value,
        "body-style": Xe.value
      }, {
        default: g(() => [n("div", aa, [e[19] ||= n("label", null, "任务名称", -1), o(V, {
          value: N.value,
          "onUpdate:value": e[0] ||= A => N.value = A,
          placeholder: "任务名称",
          size: "small"
        }, null, 8, ["value"])]), o(kt, {
          config: de,
          accounts: p(a).accounts
        }, null, 8, ["config", "accounts"])]),
        _: 1
      }, 8, ["open", "confirm-loading", "width", "body-style"]), o(ke, {
        open: X.value,
        "onUpdate:open": e[2] ||= A => X.value = A,
        title: "编辑自动回复配置",
        width: Qe.value,
        "body-style": Xe.value,
        "confirm-loading": re.value,
        onOk: Wt
      }, {
        default: g(() => [L.value ? (s(), _(kt, {
          key: 0,
          config: L.value,
          accounts: p(a).accounts,
          "lock-account-selection": true
        }, null, 8, ["config", "accounts"])) : I("", true)]),
        _: 1
      }, 8, ["open", "width", "body-style", "confirm-loading"]), o(at, {
        open: F.value,
        "onUpdate:open": e[5] ||= A => F.value = A,
        title: u.value ? `互动详情 · ${u.value.name}` : "互动详情",
        width: "960",
        "destroy-on-close": "",
        class: "self-warmup-detail-drawer",
        onAfterOpenChange: Ot
      }, {
        default: g(() => [r.value ? (s(), m("div", sa, [o(Ce)])) : u.value ? (s(), m(P, {
          key: 1
        }, [n("div", ia, [o(z, null, {
          default: g(() => [y(v(p(ft)(u.value)), 1)]),
          _: 1
        }), o(z, {
          color: "purple"
        }, {
          default: g(() => [y(v(tt(u.value)), 1)]),
          _: 1
        }), o(z, {
          color: "blue"
        }, {
          default: g(() => [y("记录 " + v(Ie.value) + "/" + v(fe.value) + " 条", 1)]),
          _: 1
        }), ye.value > 0 ? (s(), _(z, {
          key: 0,
          color: "green"
        }, {
          default: g(() => [y("建议 " + v(ye.value) + " 条", 1)]),
          _: 1
        })) : I("", true), p(Se)(u.value.stats) ? (s(), _(z, {
          key: 1
        }, {
          default: g(() => [y(v(p(Se)(u.value.stats)), 1)]),
          _: 1
        })) : I("", true)]), n("div", oa, [o(V, {
          value: S.value,
          "onUpdate:value": e[3] ||= A => S.value = A,
          placeholder: "搜索用户、内容、回复、原因",
          size: "small",
          "allow-clear": "",
          class: "detail-search"
        }, null, 8, ["value"]), o(Qt, {
          value: k.value,
          "onUpdate:value": e[4] ||= A => k.value = A,
          size: "small",
          options: St.value
        }, null, 8, ["value", "options"]), w.value.length ? (s(), m("span", ua, "已选 " + v(w.value.length) + " 条", 1)) : I("", true), o(i, {
          size: "small",
          danger: "",
          disabled: w.value.length === 0,
          loading: D.value,
          onClick: jt
        }, {
          default: g(() => [...(e[20] ||= [y(" 删除所选 ", -1)])]),
          _: 1
        }, 8, ["disabled", "loading"]), o(i, {
          size: "small",
          danger: "",
          disabled: fe.value === 0,
          loading: ee.value,
          onClick: Vt
        }, {
          default: g(() => [...(e[21] ||= [y(" 清空全部 ", -1)])]),
          _: 1
        }, 8, ["disabled", "loading"]), R.value ? (s(), _(i, {
          key: 1,
          size: "small",
          loading: f.value,
          onClick: Ht
        }, {
          default: g(() => [...(e[22] ||= [y(" 清空回复次数 ", -1)])]),
          _: 1
        }, 8, ["loading"])) : I("", true)]), o(E, {
          class: "self-warmup-detail-table",
          columns: xt,
          "data-source": pe.value,
          "row-key": A => A.id,
          size: "small",
          "row-selection": $t.value,
          pagination: false,
          loading: Re.value,
          locale: {
            emptyText: fe.value ? "无符合筛选条件的记录" : "暂无互动记录"
          }
        }, {
          bodyCell: g(({
            column: A,
            record: c
          }) => [A.key === "time" ? (s(), m(P, {
            key: 0
          }, [p(Ve)(c.ts) ? (s(), _(h, {
            key: 0,
            title: p(Ve)(c.ts),
            placement: "topLeft"
          }, {
            default: g(() => [n("span", ca, v(p(Ve)(c.ts)), 1)]),
            _: 2
          }, 1032, ["title"])) : (s(), m("span", da, "—"))], 64)) : A.key === "type" ? (s(), _(h, {
            key: 1,
            title: p(Be)[c.eventType] || c.eventLabel || c.eventType,
            placement: "topLeft"
          }, {
            default: g(() => [o(z, {
              color: At(c.eventType),
              class: "mini-tag"
            }, {
              default: g(() => [y(v(p(Be)[c.eventType] || c.eventLabel || c.eventType), 1)]),
              _: 2
            }, 1032, ["color"])]),
            _: 2
          }, 1032, ["title"])) : A.key === "nickname" ? (s(), _(h, {
            key: 2,
            title: c.userUrl || c.nickname || "",
            placement: "topLeft"
          }, {
            default: g(() => [c.userUrl ? (s(), m("a", {
              key: 0,
              class: "user-link cell-ellipsis",
              onClick: fn(G => Yt(c.userUrl), ["prevent"])
            }, v(c.nickname || "用户"), 9, ra)) : (s(), m("span", fa, v(c.nickname || "—"), 1))]),
            _: 2
          }, 1032, ["title"])) : A.key === "content" ? (s(), m(P, {
            key: 3
          }, [c.text ? (s(), _(h, {
            key: 0,
            title: c.text,
            placement: "topLeft"
          }, {
            default: g(() => [n("span", ma, v(c.text), 1)]),
            _: 2
          }, 1032, ["title"])) : (s(), m("span", ga, "—"))], 64)) : A.key === "judge" ? (s(), _(h, {
            key: 4,
            title: c.judgeReason || (p(He)(c) ? "建议跟进" : "仅记录"),
            placement: "topLeft"
          }, {
            default: g(() => [o(z, {
              color: p(He)(c) ? "green" : "default",
              class: "mini-tag"
            }, {
              default: g(() => [y(v(p(He)(c) ? "建议跟进" : "仅记录"), 1)]),
              _: 2
            }, 1032, ["color"])]),
            _: 2
          }, 1032, ["title"])) : A.key === "suggestion" ? (s(), m(P, {
            key: 5
          }, [p(Ke)(c) || c.suggestionErrorReason ? (s(), _(h, {
            key: 0,
            title: p(Ke)(c) || c.suggestionErrorReason,
            placement: "topLeft"
          }, {
            default: g(() => [n("span", {
              class: he(["cell-ellipsis suggestion-text", {
                "text-failed": c.suggestionStatus === "failed"
              }])
            }, v(p(Ke)(c) || (c.suggestionErrorReason ? `回复失败：${c.suggestionErrorReason}` : "—")), 3)]),
            _: 2
          }, 1032, ["title"])) : (s(), m("span", va, "—"))], 64)) : A.key === "action" ? (s(), m(P, {
            key: 6
          }, [p(gt)(c) ? (s(), _(h, {
            key: 0,
            title: p(gt)(c),
            placement: "topLeft"
          }, {
            default: g(() => [n("div", pa, [n("span", {
              class: he(["cell-ellipsis", {
                "action-success": c.actionStatus === "success",
                "action-partial": c.actionStatus === "partial",
                "action-failed": c.actionStatus === "failed",
                "action-skipped": c.actionStatus === "skipped"
              }])
            }, v(p(mn)(c)), 3), c.actionErrorReason && p(gn)(c) ? (s(), m("span", ya, v(c.actionErrorReason), 1)) : I("", true)])]),
            _: 2
          }, 1032, ["title"])) : (s(), m("span", ka, "—"))], 64)) : A.key === "rowActions" ? (s(), _(i, {
            key: 7,
            type: "link",
            size: "small",
            danger: "",
            loading: W.value === c.id,
            onClick: G => Bt(c)
          }, {
            default: g(() => [...(e[23] ||= [y(" 删除 ", -1)])]),
            _: 1
          }, 8, ["loading", "onClick"])) : I("", true)]),
          _: 1
        }, 8, ["data-source", "row-key", "row-selection", "loading", "locale"]), n("div", ha, [o(Xt, {
          current: p(te).current,
          "page-size": p(te).pageSize,
          total: Ie.value,
          size: "small",
          "show-size-changer": "",
          "page-size-options": p(te).pageSizeOptions,
          "show-total": p(te).showTotal,
          "select-props": p(te).selectProps,
          onChange: et,
          onShowSizeChange: et
        }, null, 8, ["current", "page-size", "total", "page-size-options", "show-total", "select-props"])])], 64)) : I("", true)]),
        _: 1
      }, 8, ["open", "title"]), o(at, {
        open: $e.value,
        "onUpdate:open": e[7] ||= A => $e.value = A,
        title: U.value ? `运行日志 · ${U.value.name}` : "运行日志",
        width: "520",
        "destroy-on-close": "",
        onAfterOpenChange: Zt
      }, {
        default: g(() => {
          var A;
          var c;
          var G;
          var st;
          var it;
          return [U.value ? (s(), m("div", wa, [n("div", ba, [n("div", Ta, [e[24] ||= n("span", null, "检查", -1), n("b", null, v(((A = U.value.stats) == null ? undefined : A.checks) || 0), 1)]), n("div", Ca, [e[25] ||= n("span", null, "互动", -1), n("b", null, v(((c = U.value.stats) == null ? undefined : c.eventsTotal) || 0), 1)]), n("div", xa, [e[26] ||= n("span", null, "建议", -1), n("b", null, v(((G = U.value.stats) == null ? undefined : G.matched) || 0), 1)]), n("div", Sa, [e[27] ||= n("span", null, "回复", -1), n("b", null, v(((st = U.value.stats) == null ? undefined : st.suggestions) || 0), 1)]), n("div", $a, [e[28] ||= n("span", null, "自动", -1), n("b", null, v(((it = U.value.stats) == null ? undefined : it.actionsExecuted) || 0), 1)])]), n("div", Ia, [o(V, {
            value: ve.value,
            "onUpdate:value": e[6] ||= xe => ve.value = xe,
            placeholder: "搜索日志",
            size: "small",
            "allow-clear": "",
            class: "log-search"
          }, null, 8, ["value"]), o(i, {
            size: "small",
            disabled: be.value.length === 0,
            onClick: Jt
          }, {
            default: g(() => [...(e[29] ||= [y(" 复制日志 ", -1)])]),
            _: 1
          }, 8, ["disabled"]), o(i, {
            size: "small",
            danger: "",
            disabled: Ae(U.value.id) === 0,
            onClick: Gt
          }, {
            default: g(() => [...(e[30] ||= [y(" 清空日志 ", -1)])]),
            _: 1
          }, 8, ["disabled"])]), n("div", {
            ref_key: "logListRef",
            ref: Ze,
            class: "task-log-list log-drawer-list"
          }, [(s(true), m(P, null, se(be.value, (xe, en) => {
            s();
            return m("div", {
              key: en,
              class: he(["task-log-line", `level-${xe.level || "normal"}`])
            }, [n("span", Aa, v(xe.time), 1), n("span", za, v(xe.msg), 1)], 2);
          }), 128)), be.value.length === 0 ? (s(), m("div", Ea, "暂无日志")) : I("", true)], 512)])) : I("", true)];
        }),
        _: 1
      }, 8, ["open", "title"])]);
    };
  }
};
const Va = Ye(La, [["__scopeId", "data-v-a901b544"]]);
export { Va as default };
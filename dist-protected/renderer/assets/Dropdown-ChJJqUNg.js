import { d as V, P as n, A as g, y as B, i as d, c5 as D, q as m, h as M, l as v, c6 as L, aO as W, o as y } from "./index-BegIKaMc.js";
const l = {
  adjustX: 1,
  adjustY: 1
};
const s = [0, 0];
const $ = {
  topLeft: {
    points: ["bl", "tl"],
    overflow: l,
    offset: [0, -4],
    targetOffset: s
  },
  topCenter: {
    points: ["bc", "tc"],
    overflow: l,
    offset: [0, -4],
    targetOffset: s
  },
  topRight: {
    points: ["br", "tr"],
    overflow: l,
    offset: [0, -4],
    targetOffset: s
  },
  bottomLeft: {
    points: ["tl", "bl"],
    overflow: l,
    offset: [0, 4],
    targetOffset: s
  },
  bottomCenter: {
    points: ["tc", "bc"],
    overflow: l,
    offset: [0, 4],
    targetOffset: s
  },
  bottomRight: {
    points: ["tr", "br"],
    overflow: l,
    offset: [0, 4],
    targetOffset: s
  }
};
function F(e, c) {
  var a = {};
  for (var o in e) {
    if (Object.prototype.hasOwnProperty.call(e, o) && c.indexOf(o) < 0) {
      a[o] = e[o];
    }
  }
  if (e != null && typeof Object.getOwnPropertySymbols == "function") {
    for (var i = 0, o = Object.getOwnPropertySymbols(e); i < o.length; i++) {
      if (c.indexOf(o[i]) < 0 && Object.prototype.propertyIsEnumerable.call(e, o[i])) {
        a[o[i]] = e[o[i]];
      }
    }
  }
  return a;
}
const q = V({
  compatConfig: {
    MODE: 3
  },
  props: {
    minOverlayWidthMatchTrigger: {
      type: Boolean,
      default: undefined
    },
    arrow: {
      type: Boolean,
      default: false
    },
    prefixCls: n.string.def("rc-dropdown"),
    transitionName: String,
    overlayClassName: n.string.def(""),
    openClassName: String,
    animation: n.any,
    align: n.object,
    overlayStyle: {
      type: Object,
      default: undefined
    },
    placement: n.string.def("bottomLeft"),
    overlay: n.any,
    trigger: n.oneOfType([n.string, n.arrayOf(n.string)]).def("hover"),
    alignPoint: {
      type: Boolean,
      default: undefined
    },
    showAction: n.array,
    hideAction: n.array,
    getPopupContainer: Function,
    visible: {
      type: Boolean,
      default: undefined
    },
    defaultVisible: {
      type: Boolean,
      default: false
    },
    mouseEnterDelay: n.number.def(0.15),
    mouseLeaveDelay: n.number.def(0.1)
  },
  emits: ["visibleChange", "overlayClick"],
  setup(e, c) {
    let {
      slots: a,
      emit: o,
      expose: i
    } = c;
    const f = g(!!e.visible);
    B(() => e.visible, t => {
      if (t !== undefined) {
        f.value = t;
      }
    });
    const p = g();
    i({
      triggerRef: p
    });
    const b = t => {
      if (e.visible === undefined) {
        f.value = false;
      }
      o("overlayClick", t);
    };
    const h = t => {
      if (e.visible === undefined) {
        f.value = t;
      }
      o("visibleChange", t);
    };
    const C = () => {
      var t;
      const r = (t = a.overlay) === null || t === undefined ? undefined : t.call(a);
      const u = {
        prefixCls: `${e.prefixCls}-menu`,
        onClick: b
      };
      return d(W, {
        key: L
      }, [e.arrow && d("div", {
        class: `${e.prefixCls}-arrow`
      }, null), v(r, u, false)]);
    };
    const w = y(() => {
      const {
        minOverlayWidthMatchTrigger: t = !e.alignPoint
      } = e;
      return t;
    });
    const O = () => {
      var t;
      const r = (t = a.default) === null || t === undefined ? undefined : t.call(a);
      if (f.value && r) {
        return v(r[0], {
          class: e.openClassName || `${e.prefixCls}-open`
        }, false);
      } else {
        return r;
      }
    };
    const P = y(() => !e.hideAction && e.trigger.indexOf("contextmenu") !== -1 ? ["click"] : e.hideAction);
    return () => {
      const {
        prefixCls: t,
        arrow: r,
        showAction: u,
        overlayStyle: x,
        trigger: A,
        placement: N,
        align: j,
        getPopupContainer: S,
        transitionName: T,
        animation: _,
        overlayClassName: k
      } = e;
      const E = F(e, ["prefixCls", "arrow", "showAction", "overlayStyle", "trigger", "placement", "align", "getPopupContainer", "transitionName", "animation", "overlayClassName"]);
      return d(D, m(m({}, E), {}, {
        prefixCls: t,
        ref: p,
        popupClassName: M(k, {
          [`${t}-show-arrow`]: r
        }),
        popupStyle: x,
        builtinPlacements: $,
        action: A,
        showAction: u,
        hideAction: P.value || [],
        popupPlacement: N,
        popupAlign: j,
        popupTransitionName: T,
        popupAnimation: _,
        popupVisible: f.value,
        stretch: w.value ? "minWidth" : "",
        onPopupVisibleChange: h,
        getPopupContainer: S
      }), {
        popup: C,
        default: O
      });
    };
  }
});
export { q as D };
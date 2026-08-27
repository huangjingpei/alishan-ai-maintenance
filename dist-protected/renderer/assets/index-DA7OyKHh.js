import { P as Z, _ as d, bW as ce, ab as w, Y as L, ac as ue, bX as me, g as ge, bY as ve, m as be, r as $e, bZ as fe, b_ as we, b$ as he, c0 as ye, c1 as Ce, a2 as j, a0 as H, c2 as U, c3 as Se, d as q, u as J, i as $, bT as z, q as Y, h as M, a4 as K, o as P, l as F, c4 as xe, a3 as Pe, a6 as k, k as W } from "./index-BegIKaMc.js";
import { D as _e } from "./Dropdown-ChJJqUNg.js";
import { E as Oe, u as De } from "./OverrideContext-BkcPfvjS.js";
import { R as G } from "./RightOutlined-Oi6tvlfY.js";
const Q = () => ({
  arrow: ue([Boolean, Object]),
  trigger: {
    type: [Array, String]
  },
  menu: L(),
  overlay: Z.any,
  visible: w(),
  open: w(),
  disabled: w(),
  danger: w(),
  autofocus: w(),
  align: L(),
  getPopupContainer: Function,
  prefixCls: String,
  transitionName: String,
  placement: String,
  overlayClassName: String,
  overlayStyle: L(),
  forceRender: w(),
  mouseEnterDelay: Number,
  mouseLeaveDelay: Number,
  openClassName: String,
  minOverlayWidthMatchTrigger: w(),
  destroyPopupOnHide: w(),
  onVisibleChange: {
    type: Function
  },
  "onUpdate:visible": {
    type: Function
  },
  onOpenChange: {
    type: Function
  },
  "onUpdate:open": {
    type: Function
  }
});
const E = me();
const Ie = () => d(d({}, Q()), {
  type: E.type,
  size: String,
  htmlType: E.htmlType,
  href: String,
  disabled: w(),
  prefixCls: String,
  icon: Z.any,
  title: String,
  loading: E.loading,
  onClick: ce()
});
const Re = e => {
  const {
    componentCls: o,
    antCls: n,
    paddingXS: i,
    opacityLoading: r
  } = e;
  return {
    [`${o}-button`]: {
      whiteSpace: "nowrap",
      [`&${n}-btn-group > ${n}-btn`]: {
        [`&-loading, &-loading + ${n}-btn`]: {
          cursor: "default",
          pointerEvents: "none",
          opacity: r
        },
        [`&:last-child:not(:first-child):not(${n}-btn-icon-only)`]: {
          paddingInline: i
        }
      }
    }
  };
};
const Te = e => {
  const {
    componentCls: o,
    menuCls: n,
    colorError: i,
    colorTextLightSolid: r
  } = e;
  const l = `${n}-item`;
  return {
    [`${o}, ${o}-menu-submenu`]: {
      [`${n} ${l}`]: {
        [`&${l}-danger:not(${l}-disabled)`]: {
          color: i,
          "&:hover": {
            color: r,
            backgroundColor: i
          }
        }
      }
    }
  };
};
const Ne = e => {
  const {
    componentCls: o,
    menuCls: n,
    zIndexPopup: i,
    dropdownArrowDistance: r,
    dropdownArrowOffset: l,
    sizePopupArrow: v,
    antCls: t,
    iconCls: c,
    motionDurationMid: b,
    dropdownPaddingVertical: h,
    fontSize: y,
    dropdownEdgeChildPadding: p,
    colorTextDisabled: m,
    fontSizeIcon: g,
    controlPaddingHorizontal: C,
    colorBgElevated: a,
    boxShadowPopoverArrow: s
  } = e;
  return [{
    [o]: d(d({}, $e(e)), {
      position: "absolute",
      top: -9999,
      left: {
        _skip_check_: true,
        value: -9999
      },
      zIndex: i,
      display: "block",
      "&::before": {
        position: "absolute",
        insetBlock: -r + v / 2,
        zIndex: -9999,
        opacity: 0.0001,
        content: "\"\""
      },
      [`${o}-wrap`]: {
        position: "relative",
        [`${t}-btn > ${c}-down`]: {
          fontSize: g
        },
        [`${c}-down::before`]: {
          transition: `transform ${b}`
        }
      },
      [`${o}-wrap-open`]: {
        [`${c}-down::before`]: {
          transform: "rotate(180deg)"
        }
      },
      "\n        &-hidden,\n        &-menu-hidden,\n        &-menu-submenu-hidden\n      ": {
        display: "none"
      },
      [`
        &-show-arrow${o}-placement-topLeft,
        &-show-arrow${o}-placement-top,
        &-show-arrow${o}-placement-topRight
      `]: {
        paddingBottom: r
      },
      [`
        &-show-arrow${o}-placement-bottomLeft,
        &-show-arrow${o}-placement-bottom,
        &-show-arrow${o}-placement-bottomRight
      `]: {
        paddingTop: r
      },
      [`${o}-arrow`]: d({
        position: "absolute",
        zIndex: 1,
        display: "block"
      }, Ce(v, e.borderRadiusXS, e.borderRadiusOuter, a, s)),
      [`
        &-placement-top > ${o}-arrow,
        &-placement-topLeft > ${o}-arrow,
        &-placement-topRight > ${o}-arrow
      `]: {
        bottom: r,
        transform: "translateY(100%) rotate(180deg)"
      },
      [`&-placement-top > ${o}-arrow`]: {
        left: {
          _skip_check_: true,
          value: "50%"
        },
        transform: "translateX(-50%) translateY(100%) rotate(180deg)"
      },
      [`&-placement-topLeft > ${o}-arrow`]: {
        left: {
          _skip_check_: true,
          value: l
        }
      },
      [`&-placement-topRight > ${o}-arrow`]: {
        right: {
          _skip_check_: true,
          value: l
        }
      },
      [`
          &-placement-bottom > ${o}-arrow,
          &-placement-bottomLeft > ${o}-arrow,
          &-placement-bottomRight > ${o}-arrow
        `]: {
        top: r,
        transform: "translateY(-100%)"
      },
      [`&-placement-bottom > ${o}-arrow`]: {
        left: {
          _skip_check_: true,
          value: "50%"
        },
        transform: "translateY(-100%) translateX(-50%)"
      },
      [`&-placement-bottomLeft > ${o}-arrow`]: {
        left: {
          _skip_check_: true,
          value: l
        }
      },
      [`&-placement-bottomRight > ${o}-arrow`]: {
        right: {
          _skip_check_: true,
          value: l
        }
      },
      [`&${t}-slide-down-enter${t}-slide-down-enter-active${o}-placement-bottomLeft,
          &${t}-slide-down-appear${t}-slide-down-appear-active${o}-placement-bottomLeft,
          &${t}-slide-down-enter${t}-slide-down-enter-active${o}-placement-bottom,
          &${t}-slide-down-appear${t}-slide-down-appear-active${o}-placement-bottom,
          &${t}-slide-down-enter${t}-slide-down-enter-active${o}-placement-bottomRight,
          &${t}-slide-down-appear${t}-slide-down-appear-active${o}-placement-bottomRight`]: {
        animationName: ye
      },
      [`&${t}-slide-up-enter${t}-slide-up-enter-active${o}-placement-topLeft,
          &${t}-slide-up-appear${t}-slide-up-appear-active${o}-placement-topLeft,
          &${t}-slide-up-enter${t}-slide-up-enter-active${o}-placement-top,
          &${t}-slide-up-appear${t}-slide-up-appear-active${o}-placement-top,
          &${t}-slide-up-enter${t}-slide-up-enter-active${o}-placement-topRight,
          &${t}-slide-up-appear${t}-slide-up-appear-active${o}-placement-topRight`]: {
        animationName: he
      },
      [`&${t}-slide-down-leave${t}-slide-down-leave-active${o}-placement-bottomLeft,
          &${t}-slide-down-leave${t}-slide-down-leave-active${o}-placement-bottom,
          &${t}-slide-down-leave${t}-slide-down-leave-active${o}-placement-bottomRight`]: {
        animationName: we
      },
      [`&${t}-slide-up-leave${t}-slide-up-leave-active${o}-placement-topLeft,
          &${t}-slide-up-leave${t}-slide-up-leave-active${o}-placement-top,
          &${t}-slide-up-leave${t}-slide-up-leave-active${o}-placement-topRight`]: {
        animationName: fe
      }
    })
  }, {
    [`${o} ${n}`]: {
      position: "relative",
      margin: 0
    },
    [`${n}-submenu-popup`]: {
      position: "absolute",
      zIndex: i,
      background: "transparent",
      boxShadow: "none",
      transformOrigin: "0 0",
      "ul,li": {
        listStyle: "none"
      },
      ul: {
        marginInline: "0.3em"
      }
    },
    [`${o}, ${o}-menu-submenu`]: {
      [n]: d(d({
        padding: p,
        listStyleType: "none",
        backgroundColor: a,
        backgroundClip: "padding-box",
        borderRadius: e.borderRadiusLG,
        outline: "none",
        boxShadow: e.boxShadowSecondary
      }, j(e)), {
        [`${n}-item-group-title`]: {
          padding: `${h}px ${C}px`,
          color: e.colorTextDescription,
          transition: `all ${b}`
        },
        [`${n}-item`]: {
          position: "relative",
          display: "flex",
          alignItems: "center",
          borderRadius: e.borderRadiusSM
        },
        [`${n}-item-icon`]: {
          minWidth: y,
          marginInlineEnd: e.marginXS,
          fontSize: e.fontSizeSM
        },
        [`${n}-title-content`]: {
          flex: "auto",
          "> a": {
            color: "inherit",
            transition: `all ${b}`,
            "&:hover": {
              color: "inherit"
            },
            "&::after": {
              position: "absolute",
              inset: 0,
              content: "\"\""
            }
          }
        },
        [`${n}-item, ${n}-submenu-title`]: d(d({
          clear: "both",
          margin: 0,
          padding: `${h}px ${C}px`,
          color: e.colorText,
          fontWeight: "normal",
          fontSize: y,
          lineHeight: e.lineHeight,
          cursor: "pointer",
          transition: `all ${b}`,
          "&:hover, &-active": {
            backgroundColor: e.controlItemBgHover
          }
        }, j(e)), {
          "&-selected": {
            color: e.colorPrimary,
            backgroundColor: e.controlItemBgActive,
            "&:hover, &-active": {
              backgroundColor: e.controlItemBgActiveHover
            }
          },
          "&-disabled": {
            color: m,
            cursor: "not-allowed",
            "&:hover": {
              color: m,
              backgroundColor: a,
              cursor: "not-allowed"
            },
            a: {
              pointerEvents: "none"
            }
          },
          "&-divider": {
            height: 1,
            margin: `${e.marginXXS}px 0`,
            overflow: "hidden",
            lineHeight: 0,
            backgroundColor: e.colorSplit
          },
          [`${o}-menu-submenu-expand-icon`]: {
            position: "absolute",
            insetInlineEnd: e.paddingXS,
            [`${o}-menu-submenu-arrow-icon`]: {
              marginInlineEnd: "0 !important",
              color: e.colorTextDescription,
              fontSize: g,
              fontStyle: "normal"
            }
          }
        }),
        [`${n}-item-group-list`]: {
          margin: `0 ${e.marginXS}px`,
          padding: 0,
          listStyle: "none"
        },
        [`${n}-submenu-title`]: {
          paddingInlineEnd: C + e.fontSizeSM
        },
        [`${n}-submenu-vertical`]: {
          position: "relative"
        },
        [`${n}-submenu${n}-submenu-disabled ${o}-menu-submenu-title`]: {
          [`&, ${o}-menu-submenu-arrow-icon`]: {
            color: m,
            backgroundColor: a,
            cursor: "not-allowed"
          }
        },
        [`${n}-submenu-selected ${o}-menu-submenu-title`]: {
          color: e.colorPrimary
        }
      })
    }
  }, [H(e, "slide-up"), H(e, "slide-down"), U(e, "move-up"), U(e, "move-down"), Se(e, "zoom-big")]];
};
const ee = ge("Dropdown", (e, o) => {
  let {
    rootPrefixCls: n
  } = o;
  const {
    marginXXS: i,
    sizePopupArrow: r,
    controlHeight: l,
    fontSize: v,
    lineHeight: t,
    paddingXXS: c,
    componentCls: b,
    borderRadiusOuter: h,
    borderRadiusLG: y
  } = e;
  const p = (l - v * t) / 2;
  const {
    dropdownArrowOffset: m
  } = ve({
    sizePopupArrow: r,
    contentRadius: y,
    borderRadiusOuter: h
  });
  const g = be(e, {
    menuCls: `${b}-menu`,
    rootPrefixCls: n,
    dropdownArrowDistance: r / 2 + i,
    dropdownArrowOffset: m,
    dropdownPaddingVertical: p,
    dropdownEdgeChildPadding: c
  });
  return [Ne(g), Re(g), Te(g)];
}, e => ({
  zIndexPopup: e.zIndexPopupBase + 50
}));
function Be(e, o) {
  var n = {};
  for (var i in e) {
    if (Object.prototype.hasOwnProperty.call(e, i) && o.indexOf(i) < 0) {
      n[i] = e[i];
    }
  }
  if (e != null && typeof Object.getOwnPropertySymbols == "function") {
    for (var r = 0, i = Object.getOwnPropertySymbols(e); r < i.length; r++) {
      if (o.indexOf(i[r]) < 0 && Object.prototype.propertyIsEnumerable.call(e, i[r])) {
        n[i[r]] = e[i[r]];
      }
    }
  }
  return n;
}
const Ae = z.Group;
const T = q({
  compatConfig: {
    MODE: 3
  },
  name: "ADropdownButton",
  inheritAttrs: false,
  __ANT_BUTTON: true,
  props: K(Ie(), {
    trigger: "hover",
    placement: "bottomRight",
    type: "default"
  }),
  slots: Object,
  setup(e, o) {
    let {
      slots: n,
      attrs: i,
      emit: r
    } = o;
    const l = p => {
      r("update:visible", p);
      r("visibleChange", p);
      r("update:open", p);
      r("openChange", p);
    };
    const {
      prefixCls: v,
      direction: t,
      getPopupContainer: c
    } = J("dropdown", e);
    const b = P(() => `${v.value}-button`);
    const [h, y] = ee(v);
    return () => {
      var p;
      var m;
      const g = d(d({}, e), i);
      const {
        type: C = "default",
        disabled: a,
        danger: s,
        loading: f,
        htmlType: _,
        class: u = "",
        overlay: S = (p = n.overlay) === null || p === undefined ? undefined : p.call(n),
        trigger: x,
        align: O,
        open: D,
        visible: I,
        onVisibleChange: N,
        placement: B = t.value === "rtl" ? "bottomLeft" : "bottomRight",
        href: A,
        title: oe,
        icon: te = ((m = n.icon) === null || m === undefined ? undefined : m.call(n)) || $(Oe, null, null),
        mouseEnterDelay: ne,
        mouseLeaveDelay: ae,
        overlayClassName: re,
        overlayStyle: ie,
        destroyPopupOnHide: le,
        onClick: se,
        "onUpdate:open": Le
      } = g;
      const de = Be(g, ["type", "disabled", "danger", "loading", "htmlType", "class", "overlay", "trigger", "align", "open", "visible", "onVisibleChange", "placement", "href", "title", "icon", "mouseEnterDelay", "mouseLeaveDelay", "overlayClassName", "overlayStyle", "destroyPopupOnHide", "onClick", "onUpdate:open"]);
      const pe = {
        align: O,
        disabled: a,
        trigger: a ? [] : x,
        placement: B,
        getPopupContainer: c == null ? undefined : c.value,
        onOpenChange: l,
        mouseEnterDelay: ne,
        mouseLeaveDelay: ae,
        open: D ?? I,
        overlayClassName: re,
        overlayStyle: ie,
        destroyPopupOnHide: le
      };
      const X = $(z, {
        danger: s,
        type: C,
        disabled: a,
        loading: f,
        onClick: se,
        htmlType: _,
        href: A,
        title: oe
      }, {
        default: n.default
      });
      const V = $(z, {
        danger: s,
        type: C,
        icon: te
      }, null);
      return h($(Ae, Y(Y({}, de), {}, {
        class: M(b.value, u, y.value)
      }), {
        default: () => [n.leftButton ? n.leftButton({
          button: X
        }) : X, $(R, pe, {
          default: () => [n.rightButton ? n.rightButton({
            button: V
          }) : V],
          overlay: () => S
        })]
      }));
    };
  }
});
const R = q({
  compatConfig: {
    MODE: 3
  },
  name: "ADropdown",
  inheritAttrs: false,
  props: K(Q(), {
    mouseEnterDelay: 0.15,
    mouseLeaveDelay: 0.1,
    placement: "bottomLeft",
    trigger: "hover"
  }),
  slots: Object,
  setup(e, o) {
    let {
      slots: n,
      attrs: i,
      emit: r
    } = o;
    const {
      prefixCls: l,
      rootPrefixCls: v,
      direction: t,
      getPopupContainer: c
    } = J("dropdown", e);
    const [b, h] = ee(l);
    const y = P(() => {
      const {
        placement: a = "",
        transitionName: s
      } = e;
      if (s !== undefined) {
        return s;
      } else if (a.includes("top")) {
        return `${v.value}-slide-down`;
      } else {
        return `${v.value}-slide-up`;
      }
    });
    De({
      prefixCls: P(() => `${l.value}-menu`),
      expandIcon: P(() => $("span", {
        class: `${l.value}-menu-submenu-arrow`
      }, [$(G, {
        class: `${l.value}-menu-submenu-arrow-icon`
      }, null)])),
      mode: P(() => "vertical"),
      selectable: P(() => false),
      onClick: () => {},
      validator: a => {
        let {
          mode: s
        } = a;
      }
    });
    const p = () => {
      var a;
      var s;
      var f;
      const _ = e.overlay || ((a = n.overlay) === null || a === undefined ? undefined : a.call(n));
      const u = Array.isArray(_) ? _[0] : _;
      if (!u) {
        return null;
      }
      const S = u.props || {};
      k(!S.mode || S.mode === "vertical", "Dropdown", `mode="${S.mode}" is not supported for Dropdown's Menu.`);
      const {
        selectable: x = false,
        expandIcon: O = (f = (s = u.children) === null || s === undefined ? undefined : s.expandIcon) === null || f === undefined ? undefined : f.call(s)
      } = S;
      const D = typeof O !== "undefined" && W(O) ? O : $("span", {
        class: `${l.value}-menu-submenu-arrow`
      }, [$(G, {
        class: `${l.value}-menu-submenu-arrow-icon`
      }, null)]);
      if (W(u)) {
        return F(u, {
          mode: "vertical",
          selectable: x,
          expandIcon: () => D
        });
      } else {
        return u;
      }
    };
    const m = P(() => {
      const a = e.placement;
      if (!a) {
        if (t.value === "rtl") {
          return "bottomRight";
        } else {
          return "bottomLeft";
        }
      }
      if (a.includes("Center")) {
        const s = a.slice(0, a.indexOf("Center"));
        k(!a.includes("Center"), "Dropdown", `You are using '${a}' placement in Dropdown, which is deprecated. Try to use '${s}' instead.`);
        return s;
      }
      return a;
    });
    const g = P(() => typeof e.visible == "boolean" ? e.visible : e.open);
    const C = a => {
      r("update:visible", a);
      r("visibleChange", a);
      r("update:open", a);
      r("openChange", a);
    };
    return () => {
      var a;
      const {
        arrow: f,
        trigger: _,
        disabled: u,
        overlayClassName: S
      } = e;
      const x = (a = n.default) === null || a === undefined ? undefined : a.call(n)[0];
      const O = F(x, d({
        class: M((x == null ? undefined : x.props)?.class, {
          [`${l.value}-rtl`]: t.value === "rtl"
        }, `${l.value}-trigger`)
      }, u ? {
        disabled: u
      } : {}));
      const D = M(S, h.value, {
        [`${l.value}-rtl`]: t.value === "rtl"
      });
      const I = u ? [] : _;
      let N;
      if (I && I.includes("contextmenu")) {
        N = true;
      }
      const B = xe({
        arrowPointAtCenter: typeof f == "object" && f.pointAtCenter,
        autoAdjustOverflow: true
      });
      const A = Pe(d(d(d({}, e), i), {
        visible: g.value,
        builtinPlacements: B,
        overlayClassName: D,
        arrow: !!f,
        alignPoint: N,
        prefixCls: l.value,
        getPopupContainer: c == null ? undefined : c.value,
        transitionName: y.value,
        trigger: I,
        onVisibleChange: C,
        placement: m.value
      }), ["overlay", "onUpdate:visible"]);
      return b($(_e, A, {
        default: () => [O],
        overlay: p
      }));
    };
  }
});
R.Button = T;
R.Button = T;
R.install = function (e) {
  e.component(R.name, R);
  e.component(T.name, T);
  return e;
};
export { T as DropdownButton, R as default, Ie as dropdownButtonProps, Q as dropdownProps };
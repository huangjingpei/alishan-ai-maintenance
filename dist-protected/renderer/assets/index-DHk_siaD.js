import { g as F, m as L, bv as O, _ as w, r as _, a2 as A, w as V, P as c, t as W, d as X, b3 as R, bw as j, A as v, y as K, u as N, S as U, ak as G, i as h, bn as q, bx as Q, o as I, q as M, a3 as Y, aY as J, G as b, O as x } from "./index-BegIKaMc.js";
const Z = i => {
  const {
    componentCls: n
  } = i;
  const e = `${n}-inner`;
  return {
    [n]: {
      [`&${n}-small`]: {
        minWidth: i.switchMinWidthSM,
        height: i.switchHeightSM,
        lineHeight: `${i.switchHeightSM}px`,
        [`${n}-inner`]: {
          paddingInlineStart: i.switchInnerMarginMaxSM,
          paddingInlineEnd: i.switchInnerMarginMinSM,
          [`${e}-checked`]: {
            marginInlineStart: `calc(-100% + ${i.switchPinSizeSM + i.switchPadding * 2}px - ${i.switchInnerMarginMaxSM * 2}px)`,
            marginInlineEnd: `calc(100% - ${i.switchPinSizeSM + i.switchPadding * 2}px + ${i.switchInnerMarginMaxSM * 2}px)`
          },
          [`${e}-unchecked`]: {
            marginTop: -i.switchHeightSM,
            marginInlineStart: 0,
            marginInlineEnd: 0
          }
        },
        [`${n}-handle`]: {
          width: i.switchPinSizeSM,
          height: i.switchPinSizeSM
        },
        [`${n}-loading-icon`]: {
          top: (i.switchPinSizeSM - i.switchLoadingIconSize) / 2,
          fontSize: i.switchLoadingIconSize
        },
        [`&${n}-checked`]: {
          [`${n}-inner`]: {
            paddingInlineStart: i.switchInnerMarginMinSM,
            paddingInlineEnd: i.switchInnerMarginMaxSM,
            [`${e}-checked`]: {
              marginInlineStart: 0,
              marginInlineEnd: 0
            },
            [`${e}-unchecked`]: {
              marginInlineStart: `calc(100% - ${i.switchPinSizeSM + i.switchPadding * 2}px + ${i.switchInnerMarginMaxSM * 2}px)`,
              marginInlineEnd: `calc(-100% + ${i.switchPinSizeSM + i.switchPadding * 2}px - ${i.switchInnerMarginMaxSM * 2}px)`
            }
          },
          [`${n}-handle`]: {
            insetInlineStart: `calc(100% - ${i.switchPinSizeSM + i.switchPadding}px)`
          }
        },
        [`&:not(${n}-disabled):active`]: {
          [`&:not(${n}-checked) ${e}`]: {
            [`${e}-unchecked`]: {
              marginInlineStart: i.marginXXS / 2,
              marginInlineEnd: -i.marginXXS / 2
            }
          },
          [`&${n}-checked ${e}`]: {
            [`${e}-checked`]: {
              marginInlineStart: -i.marginXXS / 2,
              marginInlineEnd: i.marginXXS / 2
            }
          }
        }
      }
    }
  };
};
const k = i => {
  const {
    componentCls: n
  } = i;
  return {
    [n]: {
      [`${n}-loading-icon${i.iconCls}`]: {
        position: "relative",
        top: (i.switchPinSize - i.fontSize) / 2,
        color: i.switchLoadingIconColor,
        verticalAlign: "top"
      },
      [`&${n}-checked ${n}-loading-icon`]: {
        color: i.switchColor
      }
    }
  };
};
const ii = i => {
  const {
    componentCls: n
  } = i;
  const e = `${n}-handle`;
  return {
    [n]: {
      [e]: {
        position: "absolute",
        top: i.switchPadding,
        insetInlineStart: i.switchPadding,
        width: i.switchPinSize,
        height: i.switchPinSize,
        transition: `all ${i.switchDuration} ease-in-out`,
        "&::before": {
          position: "absolute",
          top: 0,
          insetInlineEnd: 0,
          bottom: 0,
          insetInlineStart: 0,
          backgroundColor: i.colorWhite,
          borderRadius: i.switchPinSize / 2,
          boxShadow: i.switchHandleShadow,
          transition: `all ${i.switchDuration} ease-in-out`,
          content: "\"\""
        }
      },
      [`&${n}-checked ${e}`]: {
        insetInlineStart: `calc(100% - ${i.switchPinSize + i.switchPadding}px)`
      },
      [`&:not(${n}-disabled):active`]: {
        [`${e}::before`]: {
          insetInlineEnd: i.switchHandleActiveInset,
          insetInlineStart: 0
        },
        [`&${n}-checked ${e}::before`]: {
          insetInlineEnd: 0,
          insetInlineStart: i.switchHandleActiveInset
        }
      }
    }
  };
};
const ni = i => {
  const {
    componentCls: n
  } = i;
  const e = `${n}-inner`;
  return {
    [n]: {
      [e]: {
        display: "block",
        overflow: "hidden",
        borderRadius: 100,
        height: "100%",
        paddingInlineStart: i.switchInnerMarginMax,
        paddingInlineEnd: i.switchInnerMarginMin,
        transition: `padding-inline-start ${i.switchDuration} ease-in-out, padding-inline-end ${i.switchDuration} ease-in-out`,
        [`${e}-checked, ${e}-unchecked`]: {
          display: "block",
          color: i.colorTextLightSolid,
          fontSize: i.fontSizeSM,
          transition: `margin-inline-start ${i.switchDuration} ease-in-out, margin-inline-end ${i.switchDuration} ease-in-out`,
          pointerEvents: "none"
        },
        [`${e}-checked`]: {
          marginInlineStart: `calc(-100% + ${i.switchPinSize + i.switchPadding * 2}px - ${i.switchInnerMarginMax * 2}px)`,
          marginInlineEnd: `calc(100% - ${i.switchPinSize + i.switchPadding * 2}px + ${i.switchInnerMarginMax * 2}px)`
        },
        [`${e}-unchecked`]: {
          marginTop: -i.switchHeight,
          marginInlineStart: 0,
          marginInlineEnd: 0
        }
      },
      [`&${n}-checked ${e}`]: {
        paddingInlineStart: i.switchInnerMarginMin,
        paddingInlineEnd: i.switchInnerMarginMax,
        [`${e}-checked`]: {
          marginInlineStart: 0,
          marginInlineEnd: 0
        },
        [`${e}-unchecked`]: {
          marginInlineStart: `calc(100% - ${i.switchPinSize + i.switchPadding * 2}px + ${i.switchInnerMarginMax * 2}px)`,
          marginInlineEnd: `calc(-100% + ${i.switchPinSize + i.switchPadding * 2}px - ${i.switchInnerMarginMax * 2}px)`
        }
      },
      [`&:not(${n}-disabled):active`]: {
        [`&:not(${n}-checked) ${e}`]: {
          [`${e}-unchecked`]: {
            marginInlineStart: i.switchPadding * 2,
            marginInlineEnd: -i.switchPadding * 2
          }
        },
        [`&${n}-checked ${e}`]: {
          [`${e}-checked`]: {
            marginInlineStart: -i.switchPadding * 2,
            marginInlineEnd: i.switchPadding * 2
          }
        }
      }
    }
  };
};
const ei = i => {
  const {
    componentCls: n
  } = i;
  return {
    [n]: w(w(w(w({}, _(i)), {
      position: "relative",
      display: "inline-block",
      boxSizing: "border-box",
      minWidth: i.switchMinWidth,
      height: i.switchHeight,
      lineHeight: `${i.switchHeight}px`,
      verticalAlign: "middle",
      background: i.colorTextQuaternary,
      border: "0",
      borderRadius: 100,
      cursor: "pointer",
      transition: `all ${i.motionDurationMid}`,
      userSelect: "none",
      [`&:hover:not(${n}-disabled)`]: {
        background: i.colorTextTertiary
      }
    }), A(i)), {
      [`&${n}-checked`]: {
        background: i.switchColor,
        [`&:hover:not(${n}-disabled)`]: {
          background: i.colorPrimaryHover
        }
      },
      [`&${n}-loading, &${n}-disabled`]: {
        cursor: "not-allowed",
        opacity: i.switchDisabledOpacity,
        "*": {
          boxShadow: "none",
          cursor: "not-allowed"
        }
      },
      [`&${n}-rtl`]: {
        direction: "rtl"
      }
    })
  };
};
const ai = F("Switch", i => {
  const n = i.fontSize * i.lineHeight;
  const e = i.controlHeight / 2;
  const t = 2;
  const o = n - t * 2;
  const l = e - t * 2;
  const s = L(i, {
    switchMinWidth: o * 2 + t * 4,
    switchHeight: n,
    switchDuration: i.motionDurationMid,
    switchColor: i.colorPrimary,
    switchDisabledOpacity: i.opacityLoading,
    switchInnerMarginMin: o / 2,
    switchInnerMarginMax: o + t + t * 2,
    switchPadding: t,
    switchPinSize: o,
    switchBg: i.colorBgContainer,
    switchMinWidthSM: l * 2 + t * 2,
    switchHeightSM: e,
    switchInnerMarginMinSM: l / 2,
    switchInnerMarginMaxSM: l + t + t * 2,
    switchPinSizeSM: l,
    switchHandleShadow: `0 2px 4px 0 ${new O("#00230b").setAlpha(0.2).toRgbString()}`,
    switchLoadingIconSize: i.fontSizeIcon * 0.75,
    switchLoadingIconColor: `rgba(0, 0, 0, ${i.opacityLoading})`,
    switchHandleActiveInset: "-30%"
  });
  return [ei(s), ni(s), ii(s), k(s), Z(s)];
});
const ci = W("small", "default");
const ti = () => ({
  id: String,
  prefixCls: String,
  size: c.oneOf(ci),
  disabled: {
    type: Boolean,
    default: undefined
  },
  checkedChildren: c.any,
  unCheckedChildren: c.any,
  tabindex: c.oneOfType([c.string, c.number]),
  autofocus: {
    type: Boolean,
    default: undefined
  },
  loading: {
    type: Boolean,
    default: undefined
  },
  checked: c.oneOfType([c.string, c.number, c.looseBool]),
  checkedValue: c.oneOfType([c.string, c.number, c.looseBool]).def(true),
  unCheckedValue: c.oneOfType([c.string, c.number, c.looseBool]).def(false),
  onChange: {
    type: Function
  },
  onClick: {
    type: Function
  },
  onKeydown: {
    type: Function
  },
  onMouseup: {
    type: Function
  },
  "onUpdate:checked": {
    type: Function
  },
  onBlur: Function,
  onFocus: Function
});
const di = X({
  compatConfig: {
    MODE: 3
  },
  name: "ASwitch",
  __ANT_SWITCH: true,
  inheritAttrs: false,
  props: ti(),
  slots: Object,
  setup(i, n) {
    let {
      attrs: e,
      slots: t,
      expose: o,
      emit: l
    } = n;
    const s = R();
    const C = q();
    const g = I(() => {
      return i.disabled ?? C.value;
    });
    j(() => {});
    const S = v(i.checked !== undefined ? i.checked : e.defaultChecked);
    const m = I(() => S.value === i.checkedValue);
    K(() => i.checked, () => {
      S.value = i.checked;
    });
    const {
      prefixCls: d,
      direction: f,
      size: y
    } = N("switch", i);
    const [P, z] = ai(d);
    const u = v();
    const p = () => {
      var a;
      if ((a = u.value) !== null && a !== undefined) {
        a.focus();
      }
    };
    o({
      focus: p,
      blur: () => {
        var a;
        if ((a = u.value) !== null && a !== undefined) {
          a.blur();
        }
      }
    });
    U(() => {
      G(() => {
        if (i.autofocus && !g.value) {
          u.value.focus();
        }
      });
    });
    const $ = (a, r) => {
      if (!g.value) {
        l("update:checked", a);
        l("change", a, r);
        s.onFieldChange();
      }
    };
    const H = a => {
      l("blur", a);
    };
    const E = a => {
      p();
      const r = m.value ? i.unCheckedValue : i.checkedValue;
      $(r, a);
      l("click", r, a);
    };
    const T = a => {
      if (a.keyCode === x.LEFT) {
        $(i.unCheckedValue, a);
      } else if (a.keyCode === x.RIGHT) {
        $(i.checkedValue, a);
      }
      l("keydown", a);
    };
    const D = a => {
      var r;
      if ((r = u.value) !== null && r !== undefined) {
        r.blur();
      }
      l("mouseup", a);
    };
    const B = I(() => ({
      [`${d.value}-small`]: y.value === "small",
      [`${d.value}-loading`]: i.loading,
      [`${d.value}-checked`]: m.value,
      [`${d.value}-disabled`]: g.value,
      [d.value]: true,
      [`${d.value}-rtl`]: f.value === "rtl",
      [z.value]: true
    }));
    return () => {
      return P(h(Q, null, {
        default: () => [h("button", M(M(M({}, Y(i, ["prefixCls", "checkedChildren", "unCheckedChildren", "checked", "autofocus", "checkedValue", "unCheckedValue", "id", "onChange", "onUpdate:checked"])), e), {}, {
          id: i.id ?? s.id.value,
          onKeydown: T,
          onClick: E,
          onBlur: H,
          onMouseup: D,
          type: "button",
          role: "switch",
          "aria-checked": S.value,
          disabled: g.value || i.loading,
          class: [e.class, B.value],
          ref: u
        }), [h("div", {
          class: `${d.value}-handle`
        }, [i.loading ? h(J, {
          class: `${d.value}-loading-icon`
        }, null) : null]), h("span", {
          class: `${d.value}-inner`
        }, [h("span", {
          class: `${d.value}-inner-checked`
        }, [b(t, i, "checkedChildren")]), h("span", {
          class: `${d.value}-inner-unchecked`
        }, [b(t, i, "unCheckedChildren")])])])]
      }));
    };
  }
});
const ri = V(di);
export { ci as SwitchSizes, ri as default, ti as switchProps };
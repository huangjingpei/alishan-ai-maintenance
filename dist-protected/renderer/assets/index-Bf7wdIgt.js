import { N as pt, Q as De, s as Z, d as we, V as Ue, o as S, W as Ge, i as y, P as Je, aU as Io, x as it, S as ct, bt as wn, _ as x, by as $n, q as ne, h as be, bz as No, B as $t, a5 as Do, a3 as Lt, A as Ce, bA as Nl, y as Re, ai as kn, H as Ro, af as It, bB as Dl, k as _o, bC as Rl, z as Fo, bD as ft, a6 as et, bE as _l, X as Bo, bF as Fl, aO as st, bG as Be, M as gt, bH as Bl, bI as zn, bJ as jn, ak as dt, bK as Al, bL as Ut, R as ht, bM as Ll, Z as Wn, bN as Hl, a8 as Ml, bk as zl, $ as tt, O as lt, aN as jl, bO as Wl, bP as Vl, Y as vt, aa as at, ac as je, U as Te, T as Xl, p as Ul, v as Gl, bQ as Yl, a4 as kt, aX as Vn, aY as ql, aM as Ql, g as Ao, m as Lo, r as Kn, K as Zl, bR as Xn, u as Ht, ab as Le, a9 as We, bS as Jl, bT as Un, bU as Gn, a1 as ea, bv as wt, ad as ta, aQ as na, aP as oa } from "./index-BegIKaMc.js";
import { a as la, r as aa } from "./class-DeKWk5pD.js";
import { b as ra } from "./_baseAssignValue-Cz7QXdQ5.js";
import ia from "./index-v7NRdDIx.js";
import sa from "./index-B0mju5Ed.js";
import { C as Ft, g as ca } from "./index-D6QAK3q4.js";
import Ho from "./index-DA7OyKHh.js";
import Bt from "./index-DFdN_Qcm.js";
import Mo from "./index-rSaWkAgi.js";
import { c as da, g as ua } from "./collapseMotion-1JEOQ_aS.js";
import { d as fa } from "./debounce-B9z2gMOF.js";
import { u as va } from "./useBreakpoint-DUU04gTD.js";
import "./RightOutlined-Oi6tvlfY.js";
import "./Checkbox-BeHtxM1U.js";
import "./Dropdown-ChJJqUNg.js";
import "./OverrideContext-BkcPfvjS.js";
import "./shallowequal-Clf6RTVF.js";
import "./responsiveObserve-DLsPLzTu.js";
const pa = e => ({
  color: e.colorLink,
  textDecoration: "none",
  outline: "none",
  cursor: "pointer",
  transition: `color ${e.motionDurationSlow}`,
  "&:focus, &:hover": {
    color: e.colorLinkHover
  },
  "&:active": {
    color: e.colorLinkActive
  }
});
function ha(e) {
  for (var t = -1, n = e == null ? 0 : e.length, o = {}; ++t < n;) {
    var l = e[t];
    ra(o, l[0], l[1]);
  }
  return o;
}
function ya(e, t, n, o) {
  const l = n - t;
  e /= o / 2;
  if (e < 1) {
    return l / 2 * e * e * e + t;
  } else {
    return l / 2 * ((e -= 2) * e * e + 2) + t;
  }
}
function on(e) {
  return e != null && e === e.window;
}
function ma(e, t) {
  if (typeof window === "undefined") {
    return 0;
  }
  const l = "scrollTop";
  let a = 0;
  if (on(e)) {
    a = e.scrollY;
  } else if (e instanceof Document) {
    a = e.documentElement[l];
  } else if (e instanceof HTMLElement || e) {
    a = e[l];
  }
  if (e && !on(e) && typeof a != "number") {
    a = (e.ownerDocument ?? e).documentElement?.[l];
  }
  return a;
}
function ga(e, t = {}) {
  const {
    getContainer: n = () => window,
    callback: o,
    duration: l = 450
  } = t;
  const a = n();
  const r = ma(a);
  const i = Date.now();
  const s = () => {
    const d = Date.now() - i;
    const c = ya(d > l ? l : d, r, e, l);
    if (on(a)) {
      a.scrollTo(window.scrollX, c);
    } else if (a instanceof Document) {
      a.documentElement.scrollTop = c;
    } else {
      a.scrollTop = c;
    }
    if (d < l) {
      pt(s);
    } else if (typeof o == "function") {
      o();
    }
  };
  pt(s);
}
function ze(e) {
  const t = Z();
  De(() => {
    t.value = e();
  }, {
    flush: "sync"
  });
  return t;
}
const zo = Symbol("TreeContextKey");
const ba = we({
  compatConfig: {
    MODE: 3
  },
  name: "TreeContext",
  props: {
    value: {
      type: Object
    }
  },
  setup(e, t) {
    let {
      slots: n
    } = t;
    Ge(zo, S(() => e.value));
    return () => {
      var o;
      if ((o = n.default) === null || o === undefined) {
        return undefined;
      } else {
        return o.call(n);
      }
    };
  }
});
const On = () => Ue(zo, S(() => ({})));
const jo = Symbol("KeysStateKey");
const xa = e => {
  Ge(jo, e);
};
const Wo = () => Ue(jo, {
  expandedKeys: Z([]),
  selectedKeys: Z([]),
  loadedKeys: Z([]),
  loadingKeys: Z([]),
  checkedKeys: Z([]),
  halfCheckedKeys: Z([]),
  expandedKeysSet: S(() => new Set()),
  selectedKeysSet: S(() => new Set()),
  loadedKeysSet: S(() => new Set()),
  loadingKeysSet: S(() => new Set()),
  checkedKeysSet: S(() => new Set()),
  halfCheckedKeysSet: S(() => new Set()),
  flattenNodes: Z([])
});
const Ca = e => {
  let {
    prefixCls: t,
    level: n,
    isStart: o,
    isEnd: l
  } = e;
  const a = `${t}-indent-unit`;
  const r = [];
  for (let i = 0; i < n; i += 1) {
    r.push(y("span", {
      key: i,
      class: {
        [a]: true,
        [`${a}-start`]: o[i],
        [`${a}-end`]: l[i]
      }
    }, null));
  }
  return y("span", {
    "aria-hidden": "true",
    class: `${t}-indent`
  }, [r]);
};
const Vo = {
  eventKey: [String, Number],
  prefixCls: String,
  title: Je.any,
  data: {
    type: Object,
    default: undefined
  },
  parent: {
    type: Object,
    default: undefined
  },
  isStart: {
    type: Array
  },
  isEnd: {
    type: Array
  },
  active: {
    type: Boolean,
    default: undefined
  },
  onMousemove: {
    type: Function
  },
  isLeaf: {
    type: Boolean,
    default: undefined
  },
  checkable: {
    type: Boolean,
    default: undefined
  },
  selectable: {
    type: Boolean,
    default: undefined
  },
  disabled: {
    type: Boolean,
    default: undefined
  },
  disableCheckbox: {
    type: Boolean,
    default: undefined
  },
  icon: Je.any,
  switcherIcon: Je.any,
  domRef: {
    type: Function
  }
};
const Sa = {
  prefixCls: {
    type: String
  },
  motion: {
    type: Object
  },
  focusable: {
    type: Boolean
  },
  activeItem: {
    type: Object
  },
  focused: {
    type: Boolean
  },
  tabindex: {
    type: Number
  },
  checkable: {
    type: Boolean
  },
  selectable: {
    type: Boolean
  },
  disabled: {
    type: Boolean
  },
  height: {
    type: Number
  },
  itemHeight: {
    type: Number
  },
  virtual: {
    type: Boolean
  },
  onScroll: {
    type: Function
  },
  onKeydown: {
    type: Function
  },
  onFocus: {
    type: Function
  },
  onBlur: {
    type: Function
  },
  onActiveChange: {
    type: Function
  },
  onContextmenu: {
    type: Function
  },
  onListChangeStart: {
    type: Function
  },
  onListChangeEnd: {
    type: Function
  }
};
const Xo = () => ({
  prefixCls: String,
  focusable: {
    type: Boolean,
    default: undefined
  },
  activeKey: [Number, String],
  tabindex: Number,
  children: Je.any,
  treeData: {
    type: Array
  },
  fieldNames: {
    type: Object
  },
  showLine: {
    type: [Boolean, Object],
    default: undefined
  },
  showIcon: {
    type: Boolean,
    default: undefined
  },
  icon: Je.any,
  selectable: {
    type: Boolean,
    default: undefined
  },
  expandAction: [String, Boolean],
  disabled: {
    type: Boolean,
    default: undefined
  },
  multiple: {
    type: Boolean,
    default: undefined
  },
  checkable: {
    type: Boolean,
    default: undefined
  },
  checkStrictly: {
    type: Boolean,
    default: undefined
  },
  draggable: {
    type: [Function, Boolean]
  },
  defaultExpandParent: {
    type: Boolean,
    default: undefined
  },
  autoExpandParent: {
    type: Boolean,
    default: undefined
  },
  defaultExpandAll: {
    type: Boolean,
    default: undefined
  },
  defaultExpandedKeys: {
    type: Array
  },
  expandedKeys: {
    type: Array
  },
  defaultCheckedKeys: {
    type: Array
  },
  checkedKeys: {
    type: [Object, Array]
  },
  defaultSelectedKeys: {
    type: Array
  },
  selectedKeys: {
    type: Array
  },
  allowDrop: {
    type: Function
  },
  dropIndicatorRender: {
    type: Function
  },
  onFocus: {
    type: Function
  },
  onBlur: {
    type: Function
  },
  onKeydown: {
    type: Function
  },
  onContextmenu: {
    type: Function
  },
  onClick: {
    type: Function
  },
  onDblclick: {
    type: Function
  },
  onScroll: {
    type: Function
  },
  onExpand: {
    type: Function
  },
  onCheck: {
    type: Function
  },
  onSelect: {
    type: Function
  },
  onLoad: {
    type: Function
  },
  loadData: {
    type: Function
  },
  loadedKeys: {
    type: Array
  },
  onMouseenter: {
    type: Function
  },
  onMouseleave: {
    type: Function
  },
  onRightClick: {
    type: Function
  },
  onDragstart: {
    type: Function
  },
  onDragenter: {
    type: Function
  },
  onDragover: {
    type: Function
  },
  onDragleave: {
    type: Function
  },
  onDragend: {
    type: Function
  },
  onDrop: {
    type: Function
  },
  onActiveChange: {
    type: Function
  },
  filterTreeNode: {
    type: Function
  },
  motion: Je.any,
  switcherIcon: Je.any,
  height: Number,
  itemHeight: Number,
  virtual: {
    type: Boolean,
    default: undefined
  },
  direction: {
    type: String
  },
  rootClassName: String,
  rootStyle: Object
});
function wa(e, t) {
  var n = {};
  for (var o in e) {
    if (Object.prototype.hasOwnProperty.call(e, o) && t.indexOf(o) < 0) {
      n[o] = e[o];
    }
  }
  if (e != null && typeof Object.getOwnPropertySymbols == "function") {
    for (var l = 0, o = Object.getOwnPropertySymbols(e); l < o.length; l++) {
      if (t.indexOf(o[l]) < 0 && Object.prototype.propertyIsEnumerable.call(e, o[l])) {
        n[o[l]] = e[o[l]];
      }
    }
  }
  return n;
}
const Yn = "open";
const qn = "close";
const $a = "---";
const ln = we({
  compatConfig: {
    MODE: 3
  },
  name: "ATreeNode",
  inheritAttrs: false,
  props: Vo,
  isTreeNode: 1,
  setup(e, t) {
    let {
      attrs: n,
      slots: o,
      expose: l
    } = t;
    Io(!("slots" in e.data), `treeData slots is deprecated, please use ${Object.keys(e.data.slots || {}).map(k => "`v-slot:" + k + "` ")}instead`);
    const a = Z(false);
    const r = On();
    const {
      expandedKeysSet: i,
      selectedKeysSet: s,
      loadedKeysSet: f,
      loadingKeysSet: d,
      checkedKeysSet: c,
      halfCheckedKeysSet: m
    } = Wo();
    const {
      dragOverNodeKey: C,
      dropPosition: w,
      keyEntities: v
    } = r.value;
    const u = S(() => Nt(e.eventKey, {
      expandedKeysSet: i.value,
      selectedKeysSet: s.value,
      loadedKeysSet: f.value,
      loadingKeysSet: d.value,
      checkedKeysSet: c.value,
      halfCheckedKeysSet: m.value,
      dragOverNodeKey: C,
      dropPosition: w,
      keyEntities: v
    }));
    const h = ze(() => u.value.expanded);
    const $ = ze(() => u.value.selected);
    const p = ze(() => u.value.checked);
    const P = ze(() => u.value.loaded);
    const I = ze(() => u.value.loading);
    const H = ze(() => u.value.halfChecked);
    const N = ze(() => u.value.dragOver);
    const F = ze(() => u.value.dragOverGapTop);
    const b = ze(() => u.value.dragOverGapBottom);
    const K = ze(() => u.value.pos);
    const _ = Z();
    const B = S(() => {
      const {
        eventKey: k
      } = e;
      const {
        keyEntities: g
      } = r.value;
      const {
        children: O
      } = g[k] || {};
      return !!(O || []).length;
    });
    const A = S(() => {
      const {
        isLeaf: k
      } = e;
      const {
        loadData: g
      } = r.value;
      const O = B.value;
      if (k === false) {
        return false;
      } else {
        return k || !g && !O || g && P.value && !O;
      }
    });
    const le = S(() => A.value ? null : h.value ? Yn : qn);
    const ae = S(() => {
      const {
        disabled: k
      } = e;
      const {
        disabled: g
      } = r.value;
      return !!g || !!k;
    });
    const fe = S(() => {
      const {
        checkable: k
      } = e;
      const {
        checkable: g
      } = r.value;
      if (!g || k === false) {
        return false;
      } else {
        return g;
      }
    });
    const Se = S(() => {
      const {
        selectable: k
      } = e;
      const {
        selectable: g
      } = r.value;
      if (typeof k == "boolean") {
        return k;
      } else {
        return g;
      }
    });
    const U = S(() => {
      const {
        data: k,
        active: g,
        checkable: O,
        disableCheckbox: Y,
        disabled: de,
        selectable: me
      } = e;
      return x(x({
        active: g,
        checkable: O,
        disableCheckbox: Y,
        disabled: de,
        selectable: me
      }, k), {
        dataRef: k,
        data: k,
        isLeaf: A.value,
        checked: p.value,
        expanded: h.value,
        loading: I.value,
        selected: $.value,
        halfChecked: H.value
      });
    });
    const Q = No();
    const M = S(() => {
      const {
        eventKey: k
      } = e;
      const {
        keyEntities: g
      } = r.value;
      const {
        parent: O
      } = g[k] || {};
      return x(x({}, Dt(x({}, e, u.value))), {
        parent: O
      });
    });
    const J = it({
      eventData: M,
      eventKey: S(() => e.eventKey),
      selectHandle: _,
      pos: K,
      key: Q.vnode.key
    });
    l(J);
    const R = k => {
      const {
        onNodeDoubleClick: g
      } = r.value;
      g(k, M.value);
    };
    const V = k => {
      if (ae.value) {
        return;
      }
      const {
        onNodeSelect: g
      } = r.value;
      k.preventDefault();
      g(k, M.value);
    };
    const z = k => {
      if (ae.value) {
        return;
      }
      const {
        disableCheckbox: g
      } = e;
      const {
        onNodeCheck: O
      } = r.value;
      if (!fe.value || g) {
        return;
      }
      k.preventDefault();
      const Y = !p.value;
      O(k, M.value, Y);
    };
    const ee = k => {
      const {
        onNodeClick: g
      } = r.value;
      g(k, M.value);
      if (Se.value) {
        V(k);
      } else {
        z(k);
      }
    };
    const G = k => {
      const {
        onNodeMouseEnter: g
      } = r.value;
      g(k, M.value);
    };
    const $e = k => {
      const {
        onNodeMouseLeave: g
      } = r.value;
      g(k, M.value);
    };
    const ce = k => {
      const {
        onNodeContextMenu: g
      } = r.value;
      g(k, M.value);
    };
    const Ke = k => {
      const {
        onNodeDragStart: g
      } = r.value;
      k.stopPropagation();
      a.value = true;
      g(k, J);
      try {
        k.dataTransfer.setData("text/plain", "");
      } catch {}
    };
    const Oe = k => {
      const {
        onNodeDragEnter: g
      } = r.value;
      k.preventDefault();
      k.stopPropagation();
      g(k, J);
    };
    const Ie = k => {
      const {
        onNodeDragOver: g
      } = r.value;
      k.preventDefault();
      k.stopPropagation();
      g(k, J);
    };
    const _e = k => {
      const {
        onNodeDragLeave: g
      } = r.value;
      k.stopPropagation();
      g(k, J);
    };
    const Me = k => {
      const {
        onNodeDragEnd: g
      } = r.value;
      k.stopPropagation();
      a.value = false;
      g(k, J);
    };
    const Ee = k => {
      const {
        onNodeDrop: g
      } = r.value;
      k.preventDefault();
      k.stopPropagation();
      a.value = false;
      g(k, J);
    };
    const Pe = k => {
      const {
        onNodeExpand: g
      } = r.value;
      if (!I.value) {
        g(k, M.value);
      }
    };
    const j = () => {
      const {
        data: k
      } = e;
      const {
        draggable: g
      } = r.value;
      return !!g && (!g.nodeDraggable || !!g.nodeDraggable(k));
    };
    const se = () => {
      const {
        draggable: k,
        prefixCls: g
      } = r.value;
      if (k && k != null && k.icon) {
        return y("span", {
          class: `${g}-draggable-icon`
        }, [k.icon]);
      } else {
        return null;
      }
    };
    const X = () => {
      const {
        switcherIcon: Y = o.switcherIcon || r.value.slots?.[e.data?.slots?.switcherIcon]
      } = e;
      const {
        switcherIcon: de
      } = r.value;
      const me = Y || de;
      if (typeof me == "function") {
        return me(U.value);
      } else {
        return me;
      }
    };
    const oe = () => {
      const {
        loadData: k,
        onNodeLoad: g
      } = r.value;
      if (!I.value) {
        if (k && h.value && !A.value && !B.value && !P.value) {
          g(M.value);
        }
      }
    };
    ct(() => {
      oe();
    });
    wn(() => {
      oe();
    });
    const ie = () => {
      const {
        prefixCls: k
      } = r.value;
      const g = X();
      if (A.value) {
        if (g !== false) {
          return y("span", {
            class: be(`${k}-switcher`, `${k}-switcher-noop`)
          }, [g]);
        } else {
          return null;
        }
      }
      const O = be(`${k}-switcher`, `${k}-switcher_${h.value ? Yn : qn}`);
      if (g !== false) {
        return y("span", {
          onClick: Pe,
          class: O
        }, [g]);
      } else {
        return null;
      }
    };
    const xe = () => {
      var k;
      var g;
      const {
        disableCheckbox: O
      } = e;
      const {
        prefixCls: Y
      } = r.value;
      const de = ae.value;
      if (fe.value) {
        return y("span", {
          class: be(`${Y}-checkbox`, p.value && `${Y}-checkbox-checked`, !p.value && H.value && `${Y}-checkbox-indeterminate`, (de || O) && `${Y}-checkbox-disabled`),
          onClick: z
        }, [(g = (k = r.value).customCheckable) === null || g === undefined ? undefined : g.call(k)]);
      } else {
        return null;
      }
    };
    const re = () => {
      const {
        prefixCls: k
      } = r.value;
      return y("span", {
        class: be(`${k}-iconEle`, `${k}-icon__${le.value || "docu"}`, I.value && `${k}-icon_loading`)
      }, null);
    };
    const ue = () => {
      const {
        disabled: k,
        eventKey: g
      } = e;
      const {
        draggable: O,
        dropLevelOffset: Y,
        dropPosition: de,
        prefixCls: me,
        indent: E,
        dropIndicatorRender: T,
        dragOverNodeKey: D,
        direction: L
      } = r.value;
      if (!k && O !== false && D === g) {
        return T({
          dropPosition: de,
          dropLevelOffset: Y,
          indent: E,
          prefixCls: me,
          direction: L
        });
      } else {
        return null;
      }
    };
    const ke = () => {
      const {
        icon: E = o.icon,
        data: T
      } = e;
      const D = o.title || r.value.slots?.[e.data?.slots?.title] || r.value.slots?.title || e.title;
      const {
        prefixCls: L,
        showIcon: q,
        icon: te,
        loadData: W
      } = r.value;
      const pe = ae.value;
      const ge = `${L}-node-content-wrapper`;
      let ve;
      if (q) {
        const Fe = E || r.value.slots?.[(T == null ? undefined : T.slots)?.icon] || te;
        ve = Fe ? y("span", {
          class: be(`${L}-iconEle`, `${L}-icon__customize`)
        }, [typeof Fe == "function" ? Fe(U.value) : Fe]) : re();
      } else if (W && I.value) {
        ve = re();
      }
      let he;
      if (typeof D == "function") {
        he = D(U.value);
      } else {
        he = D;
      }
      he = he === undefined ? $a : he;
      const ye = y("span", {
        class: `${L}-title`
      }, [he]);
      return y("span", {
        ref: _,
        title: typeof D == "string" ? D : "",
        class: be(`${ge}`, `${ge}-${le.value || "normal"}`, !pe && ($.value || a.value) && `${L}-node-selected`),
        onMouseenter: G,
        onMouseleave: $e,
        onContextmenu: ce,
        onClick: ee,
        onDblclick: R
      }, [ve, ye, ue()]);
    };
    return () => {
      const k = x(x({}, e), n);
      const {
        eventKey: g,
        isLeaf: O,
        isStart: Y,
        isEnd: de,
        domRef: me,
        active: E,
        data: T,
        onMousemove: D,
        selectable: L
      } = k;
      const q = wa(k, ["eventKey", "isLeaf", "isStart", "isEnd", "domRef", "active", "data", "onMousemove", "selectable"]);
      const {
        prefixCls: te,
        filterTreeNode: W,
        keyEntities: pe,
        dropContainerKey: ge,
        dropTargetKey: ve,
        draggingNodeKey: he
      } = r.value;
      const ye = ae.value;
      const Fe = $n(q, {
        aria: true,
        data: true
      });
      const {
        level: Ae
      } = pe[g] || {};
      const He = de[de.length - 1];
      const Ne = j();
      const Ve = !ye && Ne;
      const nt = he === g;
      const ut = L !== undefined ? {
        "aria-selected": !!L
      } : undefined;
      return y("div", ne(ne({
        ref: me,
        class: be(n.class, `${te}-treenode`, {
          [`${te}-treenode-disabled`]: ye,
          [`${te}-treenode-switcher-${h.value ? "open" : "close"}`]: !O,
          [`${te}-treenode-checkbox-checked`]: p.value,
          [`${te}-treenode-checkbox-indeterminate`]: H.value,
          [`${te}-treenode-selected`]: $.value,
          [`${te}-treenode-loading`]: I.value,
          [`${te}-treenode-active`]: E,
          [`${te}-treenode-leaf-last`]: He,
          [`${te}-treenode-draggable`]: Ve,
          dragging: nt,
          "drop-target": ve === g,
          "drop-container": ge === g,
          "drag-over": !ye && N.value,
          "drag-over-gap-top": !ye && F.value,
          "drag-over-gap-bottom": !ye && b.value,
          "filter-node": W && W(M.value)
        }),
        style: n.style,
        draggable: Ve,
        "aria-grabbed": nt,
        onDragstart: Ve ? Ke : undefined,
        onDragenter: Ne ? Oe : undefined,
        onDragover: Ne ? Ie : undefined,
        onDragleave: Ne ? _e : undefined,
        onDrop: Ne ? Ee : undefined,
        onDragend: Ne ? Me : undefined,
        onMousemove: D
      }, ut), Fe), [y(Ca, {
        prefixCls: te,
        level: Ae,
        isStart: Y,
        isEnd: de
      }, null), se(), ie(), xe(), ke()]);
    };
  }
});
function Xe(e, t) {
  if (!e) {
    return [];
  }
  const n = e.slice();
  const o = n.indexOf(t);
  if (o >= 0) {
    n.splice(o, 1);
  }
  return n;
}
function qe(e, t) {
  const n = (e || []).slice();
  if (n.indexOf(t) === -1) {
    n.push(t);
  }
  return n;
}
function En(e) {
  return e.split("-");
}
function Uo(e, t) {
  return `${e}-${t}`;
}
function ka(e) {
  return e && e.type && e.type.isTreeNode;
}
function Ka(e, t) {
  const n = [];
  const o = t[e];
  function l() {
    (arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []).forEach(r => {
      let {
        key: i,
        children: s
      } = r;
      n.push(i);
      l(s);
    });
  }
  l(o.children);
  return n;
}
function Oa(e) {
  if (e.parent) {
    const t = En(e.pos);
    return Number(t[t.length - 1]) === e.parent.children.length - 1;
  }
  return false;
}
function Ea(e) {
  const t = En(e.pos);
  return Number(t[t.length - 1]) === 0;
}
function Qn(e, t, n, o, l, a, r, i, s, f) {
  const {
    clientX: c,
    clientY: m
  } = e;
  const {
    top: C,
    height: w
  } = e.target.getBoundingClientRect();
  const u = ((f === "rtl" ? -1 : 1) * (((l == null ? undefined : l.x) || 0) - c) - 12) / o;
  let h = i[n.eventKey];
  if (m < C + w / 2) {
    const K = r.findIndex(A => A.key === h.key);
    const _ = K <= 0 ? 0 : K - 1;
    const B = r[_].key;
    h = i[B];
  }
  const $ = h.key;
  const p = h;
  const P = h.key;
  let I = 0;
  let H = 0;
  if (!s.has($)) {
    for (let K = 0; K < u && Oa(h); K += 1) {
      h = h.parent;
      H += 1;
    }
  }
  const N = t.eventData;
  const F = h.node;
  let b = true;
  if (Ea(h) && h.level === 0 && m < C + w / 2 && a({
    dragNode: N,
    dropNode: F,
    dropPosition: -1
  }) && h.key === n.eventKey) {
    I = -1;
  } else if ((p.children || []).length && s.has(P)) {
    if (a({
      dragNode: N,
      dropNode: F,
      dropPosition: 0
    })) {
      I = 0;
    } else {
      b = false;
    }
  } else if (H === 0) {
    if (u > -1.5) {
      if (a({
        dragNode: N,
        dropNode: F,
        dropPosition: 1
      })) {
        I = 1;
      } else {
        b = false;
      }
    } else if (a({
      dragNode: N,
      dropNode: F,
      dropPosition: 0
    })) {
      I = 0;
    } else if (a({
      dragNode: N,
      dropNode: F,
      dropPosition: 1
    })) {
      I = 1;
    } else {
      b = false;
    }
  } else if (a({
    dragNode: N,
    dropNode: F,
    dropPosition: 1
  })) {
    I = 1;
  } else {
    b = false;
  }
  return {
    dropPosition: I,
    dropLevelOffset: H,
    dropTargetKey: h.key,
    dropTargetPos: h.pos,
    dragOverNodeKey: P,
    dropContainerKey: I === 0 ? null : h.parent?.key || null,
    dropAllowed: b
  };
}
function Zn(e, t) {
  if (!e) {
    return;
  }
  const {
    multiple: n
  } = t;
  if (n) {
    return e.slice();
  } else if (e.length) {
    return [e[0]];
  } else {
    return e;
  }
}
function Gt(e) {
  if (!e) {
    return null;
  }
  let t;
  if (Array.isArray(e)) {
    t = {
      checkedKeys: e,
      halfCheckedKeys: undefined
    };
  } else if (typeof e == "object") {
    t = {
      checkedKeys: e.checked || undefined,
      halfCheckedKeys: e.halfChecked || undefined
    };
  } else {
    return null;
  }
  return t;
}
function an(e, t) {
  const n = new Set();
  function o(l) {
    if (n.has(l)) {
      return;
    }
    const a = t[l];
    if (!a) {
      return;
    }
    n.add(l);
    const {
      parent: r,
      node: i
    } = a;
    if (!i.disabled) {
      if (r) {
        o(r.key);
      }
    }
  }
  (e || []).forEach(l => {
    o(l);
  });
  return [...n];
}
function Pa(e, t) {
  var n = {};
  for (var o in e) {
    if (Object.prototype.hasOwnProperty.call(e, o) && t.indexOf(o) < 0) {
      n[o] = e[o];
    }
  }
  if (e != null && typeof Object.getOwnPropertySymbols == "function") {
    for (var l = 0, o = Object.getOwnPropertySymbols(e); l < o.length; l++) {
      if (t.indexOf(o[l]) < 0 && Object.prototype.propertyIsEnumerable.call(e, o[l])) {
        n[o[l]] = e[o[l]];
      }
    }
  }
  return n;
}
function Kt(e, t) {
  return e ?? t;
}
function Mt(e) {
  const {
    title: t,
    _title: n,
    key: o,
    children: l
  } = e || {};
  const a = t || "title";
  return {
    title: a,
    _title: n || [a],
    key: o || "key",
    children: l || "children"
  };
}
function rn(e) {
  function t(n = []) {
    return $t(n).map(l => {
      var a;
      var r;
      var i;
      var s;
      if (!ka(l)) {
        return null;
      }
      const f = l.children || {};
      const d = l.key;
      const c = {};
      for (const [K, _] of Object.entries(l.props)) {
        c[Do(K)] = _;
      }
      const {
        isLeaf: m,
        checkable: C,
        selectable: w,
        disabled: v,
        disableCheckbox: u
      } = c;
      const h = {
        isLeaf: m || m === "" || undefined,
        checkable: C || C === "" || undefined,
        selectable: w || w === "" || undefined,
        disabled: v || v === "" || undefined,
        disableCheckbox: u || u === "" || undefined
      };
      const $ = x(x({}, c), h);
      const {
        title: p = (a = f.title) === null || a === undefined ? undefined : a.call(f, $),
        icon: P = (r = f.icon) === null || r === undefined ? undefined : r.call(f, $),
        switcherIcon: I = (i = f.switcherIcon) === null || i === undefined ? undefined : i.call(f, $)
      } = c;
      const H = Pa(c, ["title", "icon", "switcherIcon"]);
      const N = (s = f.default) === null || s === undefined ? undefined : s.call(f);
      const F = x(x(x({}, H), {
        title: p,
        icon: P,
        switcherIcon: I,
        key: d,
        isLeaf: m
      }), h);
      const b = t(N);
      if (b.length) {
        F.children = b;
      }
      return F;
    });
  }
  return t(e);
}
function Ta(e, t, n) {
  const {
    _title: o,
    key: l,
    children: a
  } = Mt(n);
  const r = new Set(t === true ? [] : t);
  const i = [];
  function s(f, d = null) {
    return f.map((c, m) => {
      const C = Uo(d ? d.pos : "0", m);
      const w = Kt(c[l], C);
      let v;
      for (let h = 0; h < o.length; h += 1) {
        const $ = o[h];
        if (c[$] !== undefined) {
          v = c[$];
          break;
        }
      }
      const u = x(x({}, Lt(c, [...o, l, a])), {
        title: v,
        key: w,
        parent: d,
        pos: C,
        children: null,
        data: c,
        isStart: [...(d ? d.isStart : []), m === 0],
        isEnd: [...(d ? d.isEnd : []), m === f.length - 1]
      });
      i.push(u);
      if (t === true || r.has(w)) {
        u.children = s(c[a] || [], u);
      } else {
        u.children = [];
      }
      return u;
    });
  }
  s(e);
  return i;
}
function Ia(e, t, n) {
  let o = {};
  if (typeof n == "object") {
    o = n;
  } else {
    o = {
      externalGetKey: n
    };
  }
  o = o || {};
  const {
    childrenPropName: l,
    externalGetKey: a,
    fieldNames: r
  } = o;
  const {
    key: i,
    children: s
  } = Mt(r);
  const f = l || s;
  let d;
  if (a) {
    if (typeof a == "string") {
      d = m => m[a];
    } else if (typeof a == "function") {
      d = m => a(m);
    }
  } else {
    d = (m, C) => Kt(m[i], C);
  }
  function c(m, C, w, v) {
    const u = m ? m[f] : e;
    const h = m ? Uo(w.pos, C) : "0";
    const $ = m ? [...v, m] : [];
    if (m) {
      const p = d(m, h);
      const P = {
        node: m,
        index: C,
        pos: h,
        key: p,
        parentPos: w.node ? w.pos : null,
        level: w.level + 1,
        nodes: $
      };
      t(P);
    }
    if (u) {
      u.forEach((p, P) => {
        c(p, P, {
          node: m,
          pos: h,
          level: w ? w.level + 1 : -1
        }, $);
      });
    }
  }
  c(null);
}
function Pn(e, {
  initWrapper: t,
  processEntity: n,
  onProcessFinished: o,
  externalGetKey: l,
  childrenPropName: a,
  fieldNames: r
} = {}, i) {
  const s = l || i;
  const f = {};
  const d = {};
  let c = {
    posEntities: f,
    keyEntities: d
  };
  if (t) {
    c = t(c) || c;
  }
  Ia(e, m => {
    const {
      node: C,
      index: w,
      pos: v,
      key: u,
      parentPos: h,
      level: $,
      nodes: p
    } = m;
    const P = {
      node: C,
      nodes: p,
      index: w,
      key: u,
      pos: v,
      level: $
    };
    const I = Kt(u, v);
    f[v] = P;
    d[I] = P;
    P.parent = f[h];
    if (P.parent) {
      P.parent.children = P.parent.children || [];
      P.parent.children.push(P);
    }
    if (n) {
      n(P, c);
    }
  }, {
    externalGetKey: s,
    childrenPropName: a,
    fieldNames: r
  });
  if (o) {
    o(c);
  }
  return c;
}
function Nt(e, t) {
  let {
    expandedKeysSet: n,
    selectedKeysSet: o,
    loadedKeysSet: l,
    loadingKeysSet: a,
    checkedKeysSet: r,
    halfCheckedKeysSet: i,
    dragOverNodeKey: s,
    dropPosition: f,
    keyEntities: d
  } = t;
  const c = d[e];
  return {
    eventKey: e,
    expanded: n.has(e),
    selected: o.has(e),
    loaded: l.has(e),
    loading: a.has(e),
    checked: r.has(e),
    halfChecked: i.has(e),
    pos: String(c ? c.pos : ""),
    parent: c.parent,
    dragOver: s === e && f === 0,
    dragOverGapTop: s === e && f === -1,
    dragOverGapBottom: s === e && f === 1
  };
}
function Dt(e) {
  const {
    data: t,
    expanded: n,
    selected: o,
    checked: l,
    loaded: a,
    loading: r,
    halfChecked: i,
    dragOver: s,
    dragOverGapTop: f,
    dragOverGapBottom: d,
    pos: c,
    active: m,
    eventKey: C
  } = e;
  const w = x(x({
    dataRef: t
  }, t), {
    expanded: n,
    selected: o,
    checked: l,
    loaded: a,
    loading: r,
    halfChecked: i,
    dragOver: s,
    dragOverGapTop: f,
    dragOverGapBottom: d,
    pos: c,
    active: m,
    eventKey: C,
    key: C
  });
  if (!("props" in w)) {
    Object.defineProperty(w, "props", {
      get() {
        return e;
      }
    });
  }
  return w;
}
function Go(e, t) {
  const n = new Set();
  e.forEach(o => {
    if (!t.has(o)) {
      n.add(o);
    }
  });
  return n;
}
function Na(e) {
  const {
    disabled: t,
    disableCheckbox: n,
    checkable: o
  } = e || {};
  return !!t || !!n || o === false;
}
function Da(e, t, n, o) {
  const l = new Set(e);
  const a = new Set();
  for (let i = 0; i <= n; i += 1) {
    (t.get(i) || new Set()).forEach(f => {
      const {
        key: d,
        node: c,
        children: m = []
      } = f;
      if (l.has(d) && !o(c)) {
        m.filter(C => !o(C.node)).forEach(C => {
          l.add(C.key);
        });
      }
    });
  }
  const r = new Set();
  for (let i = n; i >= 0; i -= 1) {
    (t.get(i) || new Set()).forEach(f => {
      const {
        parent: d,
        node: c
      } = f;
      if (o(c) || !f.parent || r.has(f.parent.key)) {
        return;
      }
      if (o(f.parent.node)) {
        r.add(d.key);
        return;
      }
      let m = true;
      let C = false;
      (d.children || []).filter(w => !o(w.node)).forEach(w => {
        let {
          key: v
        } = w;
        const u = l.has(v);
        if (m && !u) {
          m = false;
        }
        if (!C && (u || a.has(v))) {
          C = true;
        }
      });
      if (m) {
        l.add(d.key);
      }
      if (C) {
        a.add(d.key);
      }
      r.add(d.key);
    });
  }
  return {
    checkedKeys: Array.from(l),
    halfCheckedKeys: Array.from(Go(a, l))
  };
}
function Ra(e, t, n, o, l) {
  const a = new Set(e);
  let r = new Set(t);
  for (let s = 0; s <= o; s += 1) {
    (n.get(s) || new Set()).forEach(d => {
      const {
        key: c,
        node: m,
        children: C = []
      } = d;
      if (!a.has(c) && !r.has(c) && !l(m)) {
        C.filter(w => !l(w.node)).forEach(w => {
          a.delete(w.key);
        });
      }
    });
  }
  r = new Set();
  const i = new Set();
  for (let s = o; s >= 0; s -= 1) {
    (n.get(s) || new Set()).forEach(d => {
      const {
        parent: c,
        node: m
      } = d;
      if (l(m) || !d.parent || i.has(d.parent.key)) {
        return;
      }
      if (l(d.parent.node)) {
        i.add(c.key);
        return;
      }
      let C = true;
      let w = false;
      (c.children || []).filter(v => !l(v.node)).forEach(v => {
        let {
          key: u
        } = v;
        const h = a.has(u);
        if (C && !h) {
          C = false;
        }
        if (!w && (h || r.has(u))) {
          w = true;
        }
      });
      if (!C) {
        a.delete(c.key);
      }
      if (w) {
        r.add(c.key);
      }
      i.add(c.key);
    });
  }
  return {
    checkedKeys: Array.from(a),
    halfCheckedKeys: Array.from(Go(r, a))
  };
}
function bt(e, t, n, o, l, a) {
  let r;
  if (a) {
    r = a;
  } else {
    r = Na;
  }
  const i = new Set(e.filter(f => !!n[f]));
  let s;
  if (t === true) {
    s = Da(i, l, o, r);
  } else {
    s = Ra(i, t.halfCheckedKeys, l, o, r);
  }
  return s;
}
function Yo(e) {
  const t = Ce(0);
  const n = Z();
  De(() => {
    const o = new Map();
    let l = 0;
    const a = e.value || {};
    for (const r in a) {
      if (Object.prototype.hasOwnProperty.call(a, r)) {
        const i = a[r];
        const {
          level: s
        } = i;
        let f = o.get(s);
        if (!f) {
          f = new Set();
          o.set(s, f);
        }
        f.add(i);
        l = Math.max(l, s);
      }
    }
    t.value = l;
    n.value = o;
  });
  return {
    maxLevel: t,
    levelEntities: n
  };
}
const qo = Symbol("TableContextProps");
const _a = e => {
  Ge(qo, e);
};
const Ye = () => Ue(qo, {});
const Fa = "RC_TABLE_KEY";
function Qo(e) {
  if (e == null) {
    return [];
  } else if (Array.isArray(e)) {
    return e;
  } else {
    return [e];
  }
}
function Zo(e, t) {
  if (!t && typeof t != "number") {
    return e;
  }
  const n = Qo(t);
  let o = e;
  for (let l = 0; l < n.length; l += 1) {
    if (!o) {
      return null;
    }
    const a = n[l];
    o = o[a];
  }
  return o;
}
function zt(e) {
  const t = [];
  const n = {};
  e.forEach(o => {
    const {
      key: l,
      dataIndex: a
    } = o || {};
    let r = l || Qo(a).join("-") || Fa;
    while (n[r]) {
      r = `${r}_next`;
    }
    n[r] = true;
    t.push(r);
  });
  return t;
}
function Ba() {
  const e = {};
  function t(a, r) {
    if (r) {
      Object.keys(r).forEach(i => {
        const s = r[i];
        if (s && typeof s == "object") {
          a[i] = a[i] || {};
          t(a[i], s);
        } else {
          a[i] = s;
        }
      });
    }
  }
  for (var n = arguments.length, o = new Array(n), l = 0; l < n; l++) {
    o[l] = arguments[l];
  }
  o.forEach(a => {
    t(e, a);
  });
  return e;
}
function sn(e) {
  return e != null;
}
const Jo = Symbol("SlotsContextProps");
const Aa = e => {
  Ge(Jo, e);
};
const Tn = () => Ue(Jo, S(() => ({})));
const el = Symbol("ContextProps");
const La = e => {
  Ge(el, e);
};
const Ha = () => Ue(el, {
  onResizeColumn: () => {}
});
const xt = "RC_TABLE_INTERNAL_COL_DEFINE";
const tl = Symbol("HoverContextProps");
const Ma = e => {
  Ge(tl, e);
};
const za = () => Ue(tl, {
  startRow: Z(-1),
  endRow: Z(-1),
  onHover() {}
});
const cn = Z(false);
const ja = () => {
  ct(() => {
    cn.value = cn.value || Nl("position", "sticky");
  });
};
const Wa = () => cn;
function Va(e, t) {
  var n = {};
  for (var o in e) {
    if (Object.prototype.hasOwnProperty.call(e, o) && t.indexOf(o) < 0) {
      n[o] = e[o];
    }
  }
  if (e != null && typeof Object.getOwnPropertySymbols == "function") {
    for (var l = 0, o = Object.getOwnPropertySymbols(e); l < o.length; l++) {
      if (t.indexOf(o[l]) < 0 && Object.prototype.propertyIsEnumerable.call(e, o[l])) {
        n[o[l]] = e[o[l]];
      }
    }
  }
  return n;
}
function Xa(e, t, n, o) {
  const l = e + t - 1;
  return e <= o && l >= n;
}
function Ua(e) {
  return e && typeof e == "object" && !Array.isArray(e) && !It(e);
}
const jt = we({
  name: "Cell",
  props: ["prefixCls", "record", "index", "renderIndex", "dataIndex", "customRender", "component", "colSpan", "rowSpan", "fixLeft", "fixRight", "firstFixLeft", "lastFixLeft", "firstFixRight", "lastFixRight", "appendNode", "additionalProps", "ellipsis", "align", "rowType", "isSticky", "column", "cellType", "transformCellText"],
  setup(e, t) {
    let {
      slots: n
    } = t;
    const o = Tn();
    const {
      onHover: l,
      startRow: a,
      endRow: r
    } = za();
    const i = S(() => {
      return e.colSpan ?? e.additionalProps?.colSpan ?? e.additionalProps?.colspan;
    });
    const s = S(() => {
      return e.rowSpan ?? e.additionalProps?.rowSpan ?? e.additionalProps?.rowspan;
    });
    const f = ze(() => {
      const {
        index: v
      } = e;
      return Xa(v, s.value || 1, a.value, r.value);
    });
    const d = Wa();
    const c = (v, u) => {
      var h;
      const {
        record: $,
        index: p,
        additionalProps: P
      } = e;
      if ($) {
        l(p, p + u - 1);
      }
      if ((h = P == null ? undefined : P.onMouseenter) !== null && h !== undefined) {
        h.call(P, v);
      }
    };
    const m = v => {
      var u;
      const {
        record: h,
        additionalProps: $
      } = e;
      if (h) {
        l(-1, -1);
      }
      if ((u = $ == null ? undefined : $.onMouseleave) !== null && u !== undefined) {
        u.call($, v);
      }
    };
    const C = v => {
      const u = $t(v)[0];
      if (It(u)) {
        if (u.type === Dl) {
          return u.children;
        } else if (Array.isArray(u.children)) {
          return C(u.children);
        } else {
          return undefined;
        }
      } else {
        return u;
      }
    };
    const w = Z(null);
    Re([f, () => e.prefixCls, w], () => {
      const v = Rl(w.value);
      if (v) {
        if (f.value) {
          la(v, `${e.prefixCls}-cell-row-hover`);
        } else {
          aa(v, `${e.prefixCls}-cell-row-hover`);
        }
      }
    });
    return () => {
      var v;
      var u;
      var h;
      var P;
      const {
        prefixCls: I,
        record: H,
        index: N,
        renderIndex: F,
        dataIndex: b,
        customRender: K,
        component: _ = "td",
        fixLeft: B,
        fixRight: A,
        firstFixLeft: le,
        lastFixLeft: ae,
        firstFixRight: fe,
        lastFixRight: Se,
        appendNode: U = (v = n.appendNode) === null || v === undefined ? undefined : v.call(n),
        additionalProps: Q = {},
        ellipsis: M,
        align: J,
        rowType: R,
        isSticky: V,
        column: z = {},
        cellType: ee
      } = e;
      const G = `${I}-cell`;
      let $e;
      let ce;
      const Ke = (u = n.default) === null || u === undefined ? undefined : u.call(n);
      if (sn(Ke) || ee === "header") {
        ce = Ke;
      } else {
        const k = Zo(H, b);
        ce = k;
        if (K) {
          const g = K({
            text: k,
            value: k,
            record: H,
            index: N,
            renderIndex: F,
            column: z.__originColumn__
          });
          if (Ua(g)) {
            ce = g.children;
            $e = g.props;
          } else {
            ce = g;
          }
        }
        if (!(xt in z) && ee === "body" && o.value.bodyCell && ((h = z.slots) === null || h === undefined || !h.customRender)) {
          const g = kn(o.value, "bodyCell", {
            text: k,
            value: k,
            record: H,
            index: N,
            column: z.__originColumn__
          }, () => {
            const O = ce === undefined ? k : ce;
            return [typeof O == "object" && _o(O) || typeof O != "object" ? O : null];
          });
          ce = Ro(g);
        }
        if (e.transformCellText) {
          ce = e.transformCellText({
            text: ce,
            record: H,
            index: N,
            column: z.__originColumn__
          });
        }
      }
      if (typeof ce == "object" && !Array.isArray(ce) && !It(ce)) {
        ce = null;
      }
      if (M && (ae || fe)) {
        ce = y("span", {
          class: `${G}-content`
        }, [ce]);
      }
      if (Array.isArray(ce) && ce.length === 1) {
        ce = ce[0];
      }
      const Oe = $e || {};
      const {
        colSpan: Ie,
        rowSpan: _e,
        style: Me,
        class: Ee
      } = Oe;
      const Pe = Va(Oe, ["colSpan", "rowSpan", "style", "class"]);
      const j = (Ie !== undefined ? Ie : i.value) ?? 1;
      const se = (_e !== undefined ? _e : s.value) ?? 1;
      if (j === 0 || se === 0) {
        return null;
      }
      const X = {};
      const oe = typeof B == "number" && d.value;
      const ie = typeof A == "number" && d.value;
      if (oe) {
        X.position = "sticky";
        X.left = `${B}px`;
      }
      if (ie) {
        X.position = "sticky";
        X.right = `${A}px`;
      }
      const xe = {};
      if (J) {
        xe.textAlign = J;
      }
      let re;
      const ue = M === true ? {
        showTitle: true
      } : M;
      if (ue && (ue.showTitle || R === "header")) {
        if (typeof ce == "string" || typeof ce == "number") {
          re = ce.toString();
        } else if (It(ce)) {
          re = C([ce]);
        }
      }
      const ke = x(x(x({
        title: re
      }, Pe), Q), {
        colSpan: j !== 1 ? j : null,
        rowSpan: se !== 1 ? se : null,
        class: be(G, {
          [`${G}-fix-left`]: oe && d.value,
          [`${G}-fix-left-first`]: le && d.value,
          [`${G}-fix-left-last`]: ae && d.value,
          [`${G}-fix-right`]: ie && d.value,
          [`${G}-fix-right-first`]: fe && d.value,
          [`${G}-fix-right-last`]: Se && d.value,
          [`${G}-ellipsis`]: M,
          [`${G}-with-append`]: U,
          [`${G}-fix-sticky`]: (oe || ie) && V && d.value
        }, Q.class, Ee),
        onMouseenter: k => {
          c(k, se);
        },
        onMouseleave: m,
        style: [Q.style, xe, X, Me]
      });
      return y(_, ne(ne({}, ke), {}, {
        ref: w
      }), {
        default: () => [U, ce, (P = n.dragHandle) === null || P === undefined ? undefined : P.call(n)]
      });
    };
  }
});
function In(e, t, n, o, l) {
  const a = n[e] || {};
  const r = n[t] || {};
  let i;
  let s;
  if (a.fixed === "left") {
    i = o.left[e];
  } else if (r.fixed === "right") {
    s = o.right[t];
  }
  let f = false;
  let d = false;
  let c = false;
  let m = false;
  const C = n[t + 1];
  const w = n[e - 1];
  if (l === "rtl") {
    if (i !== undefined) {
      m = !w || w.fixed !== "left";
    } else if (s !== undefined) {
      c = !C || C.fixed !== "right";
    }
  } else if (i !== undefined) {
    f = !C || C.fixed !== "left";
  } else if (s !== undefined) {
    d = !w || w.fixed !== "right";
  }
  return {
    fixLeft: i,
    fixRight: s,
    lastFixLeft: f,
    firstFixRight: d,
    lastFixRight: c,
    firstFixLeft: m,
    isSticky: o.isSticky
  };
}
const Jn = {
  mouse: {
    move: "mousemove",
    stop: "mouseup"
  },
  touch: {
    move: "touchmove",
    stop: "touchend"
  }
};
const eo = 50;
const Ga = we({
  compatConfig: {
    MODE: 3
  },
  name: "DragHandle",
  props: {
    prefixCls: String,
    width: {
      type: Number,
      required: true
    },
    minWidth: {
      type: Number,
      default: eo
    },
    maxWidth: {
      type: Number,
      default: Infinity
    },
    column: {
      type: Object,
      default: undefined
    }
  },
  setup(e) {
    let t = 0;
    let n = {
      remove: () => {}
    };
    let o = {
      remove: () => {}
    };
    const l = () => {
      n.remove();
      o.remove();
    };
    Fo(() => {
      l();
    });
    De(() => {
      et(!isNaN(e.width), "Table", "width must be a number when use resizable");
    });
    const {
      onResizeColumn: a
    } = Ha();
    const r = S(() => typeof e.minWidth == "number" && !isNaN(e.minWidth) ? e.minWidth : eo);
    const i = S(() => typeof e.maxWidth == "number" && !isNaN(e.maxWidth) ? e.maxWidth : Infinity);
    const s = No();
    let f = 0;
    const d = Z(false);
    let c;
    const m = p => {
      let P = 0;
      if (p.touches) {
        if (p.touches.length) {
          P = p.touches[0].pageX;
        } else {
          P = p.changedTouches[0].pageX;
        }
      } else {
        P = p.pageX;
      }
      const I = t - P;
      let H = Math.max(f - I, r.value);
      H = Math.min(H, i.value);
      pt.cancel(c);
      c = pt(() => {
        a(H, e.column.__originColumn__);
      });
    };
    const C = p => {
      m(p);
    };
    const w = p => {
      d.value = false;
      m(p);
      l();
    };
    const v = (p, P) => {
      d.value = true;
      l();
      f = s.vnode.el.parentNode.getBoundingClientRect().width;
      if (!(p instanceof MouseEvent) || p.which === 1) {
        if (p.stopPropagation) {
          p.stopPropagation();
        }
        t = p.touches ? p.touches[0].pageX : p.pageX;
        n = ft(document.documentElement, P.move, C);
        o = ft(document.documentElement, P.stop, w);
      }
    };
    const u = p => {
      p.stopPropagation();
      p.preventDefault();
      v(p, Jn.mouse);
    };
    const h = p => {
      p.stopPropagation();
      p.preventDefault();
      v(p, Jn.touch);
    };
    const $ = p => {
      p.stopPropagation();
      p.preventDefault();
    };
    return () => {
      const {
        prefixCls: p
      } = e;
      const P = {
        [_l ? "onTouchstartPassive" : "onTouchstart"]: I => h(I)
      };
      return y("div", ne(ne({
        class: `${p}-resize-handle ${d.value ? "dragging" : ""}`,
        onMousedown: u
      }, P), {}, {
        onClick: $
      }), [y("div", {
        class: `${p}-resize-handle-line`
      }, null)]);
    };
  }
});
const Ya = we({
  name: "HeaderRow",
  props: ["cells", "stickyOffsets", "flattenColumns", "rowComponent", "cellComponent", "index", "customHeaderRow"],
  setup(e) {
    const t = Ye();
    return () => {
      const {
        prefixCls: n,
        direction: o
      } = t;
      const {
        cells: l,
        stickyOffsets: a,
        flattenColumns: r,
        rowComponent: i,
        cellComponent: s,
        customHeaderRow: f,
        index: d
      } = e;
      let c;
      if (f) {
        c = f(l.map(C => C.column), d);
      }
      const m = zt(l.map(C => C.column));
      return y(i, c, {
        default: () => [l.map((C, w) => {
          const {
            column: v
          } = C;
          const u = In(C.colStart, C.colEnd, r, a, o);
          let h;
          if (v && v.customHeaderCell) {
            h = C.column.customHeaderCell(v);
          }
          const $ = v;
          return y(jt, ne(ne(ne({}, C), {}, {
            cellType: "header",
            ellipsis: v.ellipsis,
            align: v.align,
            component: s,
            prefixCls: n,
            key: m[w]
          }, u), {}, {
            additionalProps: h,
            rowType: "header",
            column: v
          }), {
            default: () => v.title,
            dragHandle: () => $.resizable ? y(Ga, {
              prefixCls: n,
              width: $.width,
              minWidth: $.minWidth,
              maxWidth: $.maxWidth,
              column: $
            }, null) : null
          });
        })]
      });
    };
  }
});
function qa(e) {
  const t = [];
  function n(l, a, r = 0) {
    t[r] = t[r] || [];
    let i = a;
    return l.filter(Boolean).map(f => {
      const d = {
        key: f.key,
        class: be(f.className, f.class),
        column: f,
        colStart: i
      };
      let c = 1;
      const m = f.children;
      if (m && m.length > 0) {
        c = n(m, i, r + 1).reduce((C, w) => C + w, 0);
        d.hasSubColumns = true;
      }
      if ("colSpan" in f) {
        ({
          colSpan: c
        } = f);
      }
      if ("rowSpan" in f) {
        d.rowSpan = f.rowSpan;
      }
      d.colSpan = c;
      d.colEnd = d.colStart + c - 1;
      t[r].push(d);
      i += c;
      return c;
    });
  }
  n(e, 0);
  const o = t.length;
  for (let l = 0; l < o; l += 1) {
    t[l].forEach(a => {
      if (!("rowSpan" in a) && !a.hasSubColumns) {
        a.rowSpan = o - l;
      }
    });
  }
  return t;
}
const to = we({
  name: "TableHeader",
  inheritAttrs: false,
  props: ["columns", "flattenColumns", "stickyOffsets", "customHeaderRow"],
  setup(e) {
    const t = Ye();
    const n = S(() => qa(e.columns));
    return () => {
      const {
        prefixCls: o,
        getComponent: l
      } = t;
      const {
        stickyOffsets: a,
        flattenColumns: r,
        customHeaderRow: i
      } = e;
      const s = l(["header", "wrapper"], "thead");
      const f = l(["header", "row"], "tr");
      const d = l(["header", "cell"], "th");
      return y(s, {
        class: `${o}-thead`
      }, {
        default: () => [n.value.map((c, m) => y(Ya, {
          key: m,
          flattenColumns: r,
          cells: c,
          stickyOffsets: a,
          rowComponent: f,
          cellComponent: d,
          customHeaderRow: i,
          index: m
        }, null))]
      });
    };
  }
});
const nl = Symbol("ExpandedRowProps");
const Qa = e => {
  Ge(nl, e);
};
const Za = () => Ue(nl, {});
const ol = we({
  name: "ExpandedRow",
  inheritAttrs: false,
  props: ["prefixCls", "component", "cellComponent", "expanded", "colSpan", "isEmpty"],
  setup(e, t) {
    let {
      slots: n,
      attrs: o
    } = t;
    const l = Ye();
    const a = Za();
    const {
      fixHeader: r,
      fixColumn: i,
      componentWidth: s,
      horizonScroll: f
    } = a;
    return () => {
      const {
        prefixCls: d,
        component: c,
        cellComponent: m,
        expanded: C,
        colSpan: w,
        isEmpty: v
      } = e;
      return y(c, {
        class: o.class,
        style: {
          display: C ? null : "none"
        }
      }, {
        default: () => [y(jt, {
          component: m,
          prefixCls: d,
          colSpan: w
        }, {
          default: () => {
            var u;
            let h = (u = n.default) === null || u === undefined ? undefined : u.call(n);
            if (v ? f.value : i.value) {
              h = y("div", {
                style: {
                  width: `${s.value - (r.value ? l.scrollbarSize : 0)}px`,
                  position: "sticky",
                  left: 0,
                  overflow: "hidden"
                },
                class: `${d}-expanded-row-fixed`
              }, [h]);
            }
            return h;
          }
        })]
      });
    };
  }
});
const Ja = we({
  name: "MeasureCell",
  props: ["columnKey"],
  setup(e, t) {
    let {
      emit: n
    } = t;
    const o = Ce();
    ct(() => {
      if (o.value) {
        n("columnResize", e.columnKey, o.value.offsetWidth);
      }
    });
    return () => y(Bo, {
      onResize: l => {
        let {
          offsetWidth: a
        } = l;
        n("columnResize", e.columnKey, a);
      }
    }, {
      default: () => [y("td", {
        ref: o,
        style: {
          padding: 0,
          border: 0,
          height: 0
        }
      }, [y("div", {
        style: {
          height: 0,
          overflow: "hidden"
        }
      }, [Fl("\xA0")])])]
    });
  }
});
const ll = Symbol("BodyContextProps");
const er = e => {
  Ge(ll, e);
};
const al = () => Ue(ll, {});
const tr = we({
  name: "BodyRow",
  inheritAttrs: false,
  props: ["record", "index", "renderIndex", "recordKey", "expandedKeys", "rowComponent", "cellComponent", "customRow", "rowExpandable", "indent", "rowKey", "getRowKey", "childrenColumnName"],
  setup(e, t) {
    let {
      attrs: n
    } = t;
    const o = Ye();
    const l = al();
    const a = Z(false);
    const r = S(() => e.expandedKeys && e.expandedKeys.has(e.recordKey));
    De(() => {
      if (r.value) {
        a.value = true;
      }
    });
    const i = S(() => l.expandableType === "row" && (!e.rowExpandable || e.rowExpandable(e.record)));
    const s = S(() => l.expandableType === "nest");
    const f = S(() => e.childrenColumnName && e.record && e.record[e.childrenColumnName]);
    const d = S(() => i.value || s.value);
    const c = (u, h) => {
      l.onTriggerExpand(u, h);
    };
    const m = S(() => {
      var u;
      return ((u = e.customRow) === null || u === undefined ? undefined : u.call(e, e.record, e.index)) || {};
    });
    const C = function (u) {
      var h;
      var $;
      if (l.expandRowByClick && d.value) {
        c(e.record, u);
      }
      for (var p = arguments.length, P = new Array(p > 1 ? p - 1 : 0), I = 1; I < p; I++) {
        P[I - 1] = arguments[I];
      }
      if (($ = (h = m.value) === null || h === undefined ? undefined : h.onClick) !== null && $ !== undefined) {
        $.call(h, u, ...P);
      }
    };
    const w = S(() => {
      const {
        record: u,
        index: h,
        indent: $
      } = e;
      const {
        rowClassName: p
      } = l;
      if (typeof p == "string") {
        return p;
      } else if (typeof p == "function") {
        return p(u, h, $);
      } else {
        return "";
      }
    });
    const v = S(() => zt(l.flattenColumns));
    return () => {
      const {
        class: u,
        style: h
      } = n;
      const {
        record: $,
        index: p,
        rowKey: P,
        indent: I = 0,
        rowComponent: H,
        cellComponent: N
      } = e;
      const {
        prefixCls: F,
        fixedInfoList: b,
        transformCellText: K
      } = o;
      const {
        flattenColumns: _,
        expandedRowClassName: B,
        indentSize: A,
        expandIcon: le,
        expandedRowRender: ae,
        expandIconColumnIndex: fe
      } = l;
      const Se = y(H, ne(ne({}, m.value), {}, {
        "data-row-key": P,
        class: be(u, `${F}-row`, `${F}-row-level-${I}`, w.value, m.value.class),
        style: [h, m.value.style],
        onClick: C
      }), {
        default: () => [_.map((Q, M) => {
          const {
            customRender: J,
            dataIndex: R,
            className: V
          } = Q;
          const z = v[M];
          const ee = b[M];
          let G;
          if (Q.customCell) {
            G = Q.customCell($, p, Q);
          }
          const $e = M === (fe || 0) && s.value ? y(st, null, [y("span", {
            style: {
              paddingLeft: `${A * I}px`
            },
            class: `${F}-row-indent indent-level-${I}`
          }, null), le({
            prefixCls: F,
            expanded: r.value,
            expandable: f.value,
            record: $,
            onExpand: c
          })]) : null;
          return y(jt, ne(ne({
            cellType: "body",
            class: V,
            ellipsis: Q.ellipsis,
            align: Q.align,
            component: N,
            prefixCls: F,
            key: z,
            record: $,
            index: p,
            renderIndex: e.renderIndex,
            dataIndex: R,
            customRender: J
          }, ee), {}, {
            additionalProps: G,
            column: Q,
            transformCellText: K,
            appendNode: $e
          }), null);
        })]
      });
      let U;
      if (i.value && (a.value || r.value)) {
        const Q = ae({
          record: $,
          index: p,
          indent: I + 1,
          expanded: r.value
        });
        const M = B && B($, p, I);
        U = y(ol, {
          expanded: r.value,
          class: be(`${F}-expanded-row`, `${F}-expanded-row-level-${I + 1}`, M),
          prefixCls: F,
          component: H,
          cellComponent: N,
          colSpan: _.length,
          isEmpty: false
        }, {
          default: () => [Q]
        });
      }
      return y(st, null, [Se, U]);
    };
  }
});
function rl(e, t, n, o, l, a) {
  const r = [];
  r.push({
    record: e,
    indent: t,
    index: a
  });
  const i = l(e);
  const s = o == null ? undefined : o.has(i);
  if (e && Array.isArray(e[n]) && s) {
    for (let f = 0; f < e[n].length; f += 1) {
      const d = rl(e[n][f], t + 1, n, o, l, f);
      r.push(...d);
    }
  }
  return r;
}
function nr(e, t, n, o) {
  return S(() => {
    const a = t.value;
    const r = n.value;
    const i = e.value;
    if (r != null && r.size) {
      const s = [];
      for (let f = 0; f < (i == null ? undefined : i.length); f += 1) {
        const d = i[f];
        s.push(...rl(d, 0, a, r, o.value, f));
      }
      return s;
    }
    if (i == null) {
      return undefined;
    } else {
      return i.map((s, f) => ({
        record: s,
        indent: 0,
        index: f
      }));
    }
  });
}
const il = Symbol("ResizeContextProps");
const or = e => {
  Ge(il, e);
};
const lr = () => Ue(il, {
  onColumnResize: () => {}
});
const ar = we({
  name: "TableBody",
  props: ["data", "getRowKey", "measureColumnWidth", "expandedKeys", "customRow", "rowExpandable", "childrenColumnName"],
  setup(e, t) {
    let {
      slots: n
    } = t;
    const o = lr();
    const l = Ye();
    const a = al();
    const r = nr(Be(e, "data"), Be(e, "childrenColumnName"), Be(e, "expandedKeys"), Be(e, "getRowKey"));
    const i = Z(-1);
    const s = Z(-1);
    let f;
    Ma({
      startRow: i,
      endRow: s,
      onHover: (d, c) => {
        clearTimeout(f);
        f = setTimeout(() => {
          i.value = d;
          s.value = c;
        }, 100);
      }
    });
    return () => {
      var d;
      const {
        data: c,
        getRowKey: m,
        measureColumnWidth: C,
        expandedKeys: w,
        customRow: v,
        rowExpandable: u,
        childrenColumnName: h
      } = e;
      const {
        onColumnResize: $
      } = o;
      const {
        prefixCls: p,
        getComponent: P
      } = l;
      const {
        flattenColumns: I
      } = a;
      const H = P(["body", "wrapper"], "tbody");
      const N = P(["body", "row"], "tr");
      const F = P(["body", "cell"], "td");
      let b;
      if (c.length) {
        b = r.value.map((_, B) => {
          const {
            record: A,
            indent: le,
            index: ae
          } = _;
          const fe = m(A, B);
          return y(tr, {
            key: fe,
            rowKey: fe,
            record: A,
            recordKey: fe,
            index: B,
            renderIndex: ae,
            rowComponent: N,
            cellComponent: F,
            expandedKeys: w,
            customRow: v,
            getRowKey: m,
            rowExpandable: u,
            childrenColumnName: h,
            indent: le
          }, null);
        });
      } else {
        b = y(ol, {
          expanded: true,
          class: `${p}-placeholder`,
          prefixCls: p,
          component: N,
          cellComponent: F,
          colSpan: I.length,
          isEmpty: true
        }, {
          default: () => [(d = n.emptyNode) === null || d === undefined ? undefined : d.call(n)]
        });
      }
      const K = zt(I);
      return y(H, {
        class: `${p}-tbody`
      }, {
        default: () => [C && y("tr", {
          "aria-hidden": "true",
          class: `${p}-measure-row`,
          style: {
            height: 0,
            fontSize: 0
          }
        }, [K.map(_ => y(Ja, {
          key: _,
          columnKey: _,
          onColumnResize: $
        }, null))]), b]
      });
    };
  }
});
const rt = {};
function rr(e, t) {
  var n = {};
  for (var o in e) {
    if (Object.prototype.hasOwnProperty.call(e, o) && t.indexOf(o) < 0) {
      n[o] = e[o];
    }
  }
  if (e != null && typeof Object.getOwnPropertySymbols == "function") {
    for (var l = 0, o = Object.getOwnPropertySymbols(e); l < o.length; l++) {
      if (t.indexOf(o[l]) < 0 && Object.prototype.propertyIsEnumerable.call(e, o[l])) {
        n[o[l]] = e[o[l]];
      }
    }
  }
  return n;
}
function dn(e) {
  return e.reduce((t, n) => {
    const {
      fixed: o
    } = n;
    const l = o === true ? "left" : o;
    const a = n.children;
    if (a && a.length > 0) {
      return [...t, ...dn(a).map(r => x({
        fixed: l
      }, r))];
    } else {
      return [...t, x(x({}, n), {
        fixed: l
      })];
    }
  }, []);
}
function ir(e) {
  return e.map(t => {
    const {
      fixed: n
    } = t;
    const o = rr(t, ["fixed"]);
    let l = n;
    if (n === "left") {
      l = "right";
    } else if (n === "right") {
      l = "left";
    }
    return x({
      fixed: l
    }, o);
  });
}
function sr(e, t) {
  let {
    prefixCls: n,
    columns: o,
    expandable: l,
    expandedKeys: a,
    getRowKey: r,
    onTriggerExpand: i,
    expandIcon: s,
    rowExpandable: f,
    expandIconColumnIndex: d,
    direction: c,
    expandRowByClick: m,
    expandColumnWidth: C,
    expandFixed: w
  } = e;
  const v = Tn();
  const u = S(() => {
    if (l.value) {
      let p = o.value.slice();
      if (!p.includes(rt)) {
        const A = d.value || 0;
        if (A >= 0) {
          p.splice(A, 0, rt);
        }
      }
      const P = p.indexOf(rt);
      p = p.filter((A, le) => A !== rt || le === P);
      const I = o.value[P];
      let H;
      if ((w.value === "left" || w.value) && !d.value) {
        H = "left";
      } else if ((w.value === "right" || w.value) && d.value === o.value.length) {
        H = "right";
      } else {
        H = I ? I.fixed : null;
      }
      const N = a.value;
      const F = f.value;
      const b = s.value;
      const K = n.value;
      const _ = m.value;
      const B = {
        [xt]: {
          class: `${n.value}-expand-icon-col`,
          columnType: "EXPAND_COLUMN"
        },
        title: kn(v.value, "expandColumnTitle", {}, () => [""]),
        fixed: H,
        class: `${n.value}-row-expand-icon-cell`,
        width: C.value,
        customRender: A => {
          let {
            record: le,
            index: ae
          } = A;
          const fe = r.value(le, ae);
          const Se = N.has(fe);
          const U = F ? F(le) : true;
          const Q = b({
            prefixCls: K,
            expanded: Se,
            expandable: U,
            record: le,
            onExpand: i
          });
          if (_) {
            return y("span", {
              onClick: M => M.stopPropagation()
            }, [Q]);
          } else {
            return Q;
          }
        }
      };
      return p.map(A => A === rt ? B : A);
    }
    return o.value.filter(p => p !== rt);
  });
  const h = S(() => {
    let p = u.value;
    if (t.value) {
      p = t.value(p);
    }
    if (!p.length) {
      p = [{
        customRender: () => null
      }];
    }
    return p;
  });
  const $ = S(() => c.value === "rtl" ? ir(dn(h.value)) : dn(h.value));
  return [h, $];
}
function sl(e) {
  const t = Z(e);
  let n;
  const o = Z([]);
  function l(a) {
    o.value.push(a);
    pt.cancel(n);
    n = pt(() => {
      const r = o.value;
      o.value = [];
      r.forEach(i => {
        t.value = i(t.value);
      });
    });
  }
  gt(() => {
    pt.cancel(n);
  });
  return [t, l];
}
function cr(e) {
  const t = Ce(null);
  const n = Ce();
  function o() {
    clearTimeout(n.value);
  }
  function l(r) {
    t.value = r;
    o();
    n.value = setTimeout(() => {
      t.value = null;
      n.value = undefined;
    }, 100);
  }
  function a() {
    return t.value;
  }
  gt(() => {
    o();
  });
  return [l, a];
}
function dr(e, t, n) {
  return S(() => {
    const l = [];
    const a = [];
    let r = 0;
    let i = 0;
    const s = e.value;
    const f = t.value;
    const d = n.value;
    for (let c = 0; c < f; c += 1) {
      if (d === "rtl") {
        a[c] = i;
        i += s[c] || 0;
        const m = f - c - 1;
        l[m] = r;
        r += s[m] || 0;
      } else {
        l[c] = r;
        r += s[c] || 0;
        const m = f - c - 1;
        a[m] = i;
        i += s[m] || 0;
      }
    }
    return {
      left: l,
      right: a
    };
  });
}
function ur(e, t) {
  var n = {};
  for (var o in e) {
    if (Object.prototype.hasOwnProperty.call(e, o) && t.indexOf(o) < 0) {
      n[o] = e[o];
    }
  }
  if (e != null && typeof Object.getOwnPropertySymbols == "function") {
    for (var l = 0, o = Object.getOwnPropertySymbols(e); l < o.length; l++) {
      if (t.indexOf(o[l]) < 0 && Object.prototype.propertyIsEnumerable.call(e, o[l])) {
        n[o[l]] = e[o[l]];
      }
    }
  }
  return n;
}
function cl(e) {
  let {
    colWidths: t,
    columns: n,
    columCount: o
  } = e;
  const l = [];
  const a = o || n.length;
  let r = false;
  for (let i = a - 1; i >= 0; i -= 1) {
    const s = t[i];
    const f = n && n[i];
    const d = f && f[xt];
    if (s || d || r) {
      const c = d || {};
      const {
        columnType: m
      } = c;
      const C = ur(c, ["columnType"]);
      l.unshift(y("col", ne({
        key: i,
        style: {
          width: typeof s == "number" ? `${s}px` : s
        }
      }, C), null));
      r = true;
    }
  }
  return y("colgroup", null, [l]);
}
function un(e, t) {
  let {
    slots: n
  } = t;
  var o;
  return y("div", null, [(o = n.default) === null || o === undefined ? undefined : o.call(n)]);
}
un.displayName = "Panel";
let fr = 0;
const vr = we({
  name: "TableSummary",
  props: ["fixed"],
  setup(e, t) {
    let {
      slots: n
    } = t;
    const o = Ye();
    const l = `table-summary-uni-key-${++fr}`;
    const a = S(() => e.fixed === "" || e.fixed);
    De(() => {
      o.summaryCollect(l, a.value);
    });
    gt(() => {
      o.summaryCollect(l, false);
    });
    return () => {
      var r;
      if ((r = n.default) === null || r === undefined) {
        return undefined;
      } else {
        return r.call(n);
      }
    };
  }
});
const pr = we({
  compatConfig: {
    MODE: 3
  },
  name: "ATableSummaryRow",
  setup(e, t) {
    let {
      slots: n
    } = t;
    return () => {
      var o;
      return y("tr", null, [(o = n.default) === null || o === undefined ? undefined : o.call(n)]);
    };
  }
});
const dl = Symbol("SummaryContextProps");
const hr = e => {
  Ge(dl, e);
};
const yr = () => Ue(dl, {});
const mr = we({
  name: "ATableSummaryCell",
  props: ["index", "colSpan", "rowSpan", "align"],
  setup(e, t) {
    let {
      attrs: n,
      slots: o
    } = t;
    const l = Ye();
    const a = yr();
    return () => {
      const {
        index: r,
        colSpan: i = 1,
        rowSpan: s,
        align: f
      } = e;
      const {
        prefixCls: d,
        direction: c
      } = l;
      const {
        scrollColumnIndex: m,
        stickyOffsets: C,
        flattenColumns: w
      } = a;
      const u = r + i - 1 + 1 === m ? i + 1 : i;
      const h = In(r, r + u - 1, w, C, c);
      return y(jt, ne({
        class: n.class,
        index: r,
        component: "td",
        prefixCls: d,
        record: null,
        dataIndex: null,
        align: f,
        colSpan: u,
        rowSpan: s,
        customRender: () => {
          var $;
          if (($ = o.default) === null || $ === undefined) {
            return undefined;
          } else {
            return $.call(o);
          }
        }
      }, h), null);
    };
  }
});
const Tt = we({
  name: "TableFooter",
  inheritAttrs: false,
  props: ["stickyOffsets", "flattenColumns"],
  setup(e, t) {
    let {
      slots: n
    } = t;
    const o = Ye();
    hr(it({
      stickyOffsets: Be(e, "stickyOffsets"),
      flattenColumns: Be(e, "flattenColumns"),
      scrollColumnIndex: S(() => {
        const l = e.flattenColumns.length - 1;
        const a = e.flattenColumns[l];
        if (a != null && a.scrollbar) {
          return l;
        } else {
          return null;
        }
      })
    }));
    return () => {
      var l;
      const {
        prefixCls: a
      } = o;
      return y("tfoot", {
        class: `${a}-summary`
      }, [(l = n.default) === null || l === undefined ? undefined : l.call(n)]);
    };
  }
});
const gr = vr;
function br(e) {
  let {
    prefixCls: t,
    record: n,
    onExpand: o,
    expanded: l,
    expandable: a
  } = e;
  const r = `${t}-row-expand-icon`;
  if (!a) {
    return y("span", {
      class: [r, `${t}-row-spaced`]
    }, null);
  }
  const i = s => {
    o(n, s);
    s.stopPropagation();
  };
  return y("span", {
    class: {
      [r]: true,
      [`${t}-row-expanded`]: l,
      [`${t}-row-collapsed`]: !l
    },
    onClick: i
  }, null);
}
function xr(e, t, n) {
  const o = [];
  function l(a) {
    (a || []).forEach((r, i) => {
      o.push(t(r, i));
      l(r[n]);
    });
  }
  l(e);
  return o;
}
const Cr = we({
  name: "StickyScrollBar",
  inheritAttrs: false,
  props: ["offsetScroll", "container", "scrollBodyRef", "scrollBodySizeInfo"],
  emits: ["scroll"],
  setup(e, t) {
    let {
      emit: n,
      expose: o
    } = t;
    const l = Ye();
    const a = Z(0);
    const r = Z(0);
    const i = Z(0);
    De(() => {
      a.value = e.scrollBodySizeInfo.scrollWidth || 0;
      r.value = e.scrollBodySizeInfo.clientWidth || 0;
      i.value = a.value && r.value * (r.value / a.value);
    }, {
      flush: "post"
    });
    const s = Z();
    const [f, d] = sl({
      scrollLeft: 0,
      isHiddenScrollBar: true
    });
    const c = Ce({
      delta: 0,
      x: 0
    });
    const m = Z(false);
    const C = () => {
      m.value = false;
    };
    const w = N => {
      c.value = {
        delta: N.pageX - f.value.scrollLeft,
        x: 0
      };
      m.value = true;
      N.preventDefault();
    };
    const v = N => {
      const {
        buttons: F
      } = N || (window == null ? undefined : window.event);
      if (!m.value || F === 0) {
        m.value &&= false;
        return;
      }
      let b = c.value.x + N.pageX - c.value.x - c.value.delta;
      if (b <= 0) {
        b = 0;
      }
      if (b + i.value >= r.value) {
        b = r.value - i.value;
      }
      n("scroll", {
        scrollLeft: b / r.value * (a.value + 2)
      });
      c.value.x = N.pageX;
    };
    const u = () => {
      if (!e.scrollBodyRef.value) {
        return;
      }
      const N = jn(e.scrollBodyRef.value).top;
      const F = N + e.scrollBodyRef.value.offsetHeight;
      const b = e.container === window ? document.documentElement.scrollTop + window.innerHeight : jn(e.container).top + e.container.clientHeight;
      if (F - zn() <= b || N >= b - e.offsetScroll) {
        d(K => x(x({}, K), {
          isHiddenScrollBar: true
        }));
      } else {
        d(K => x(x({}, K), {
          isHiddenScrollBar: false
        }));
      }
    };
    o({
      setScrollLeft: N => {
        d(F => x(x({}, F), {
          scrollLeft: N / a.value * r.value || 0
        }));
      }
    });
    let $ = null;
    let p = null;
    let P = null;
    let I = null;
    ct(() => {
      $ = ft(document.body, "mouseup", C, false);
      p = ft(document.body, "mousemove", v, false);
      P = ft(window, "resize", u, false);
    });
    Bl(() => {
      dt(() => {
        u();
      });
    });
    ct(() => {
      setTimeout(() => {
        Re([i, m], () => {
          u();
        }, {
          immediate: true,
          flush: "post"
        });
      });
    });
    Re(() => e.container, () => {
      if (I != null) {
        I.remove();
      }
      I = ft(e.container, "scroll", u, false);
    }, {
      immediate: true,
      flush: "post"
    });
    gt(() => {
      if ($ != null) {
        $.remove();
      }
      if (p != null) {
        p.remove();
      }
      if (I != null) {
        I.remove();
      }
      if (P != null) {
        P.remove();
      }
    });
    Re(() => x({}, f.value), (N, F) => {
      if (N.isHiddenScrollBar !== (F == null ? undefined : F.isHiddenScrollBar) && !N.isHiddenScrollBar) {
        d(b => {
          const K = e.scrollBodyRef.value;
          if (K) {
            return x(x({}, b), {
              scrollLeft: K.scrollLeft / K.scrollWidth * K.clientWidth
            });
          } else {
            return b;
          }
        });
      }
    }, {
      immediate: true
    });
    const H = zn();
    return () => {
      if (a.value <= r.value || !i.value || f.value.isHiddenScrollBar) {
        return null;
      }
      const {
        prefixCls: N
      } = l;
      return y("div", {
        style: {
          height: `${H}px`,
          width: `${r.value}px`,
          bottom: `${e.offsetScroll}px`
        },
        class: `${N}-sticky-scroll`
      }, [y("div", {
        onMousedown: w,
        ref: s,
        class: be(`${N}-sticky-scroll-bar`, {
          [`${N}-sticky-scroll-bar-active`]: m.value
        }),
        style: {
          width: `${i.value}px`,
          transform: `translate3d(${f.value.scrollLeft}px, 0, 0)`
        }
      }, null)]);
    };
  }
});
const no = Al() ? window : null;
function Sr(e, t) {
  return S(() => {
    const {
      offsetHeader: n = 0,
      offsetSummary: o = 0,
      offsetScroll: l = 0,
      getContainer: a = () => no
    } = typeof e.value == "object" ? e.value : {};
    const r = a() || no;
    const i = !!e.value;
    return {
      isSticky: i,
      stickyClassName: i ? `${t.value}-sticky-holder` : "",
      offsetHeader: n,
      offsetSummary: o,
      offsetScroll: l,
      container: r
    };
  });
}
function wr(e, t) {
  return S(() => {
    const n = [];
    const o = e.value;
    const l = t.value;
    for (let a = 0; a < l; a += 1) {
      const r = o[a];
      if (r !== undefined) {
        n[a] = r;
      } else {
        return null;
      }
    }
    return n;
  });
}
const oo = we({
  name: "FixedHolder",
  inheritAttrs: false,
  props: ["columns", "flattenColumns", "stickyOffsets", "customHeaderRow", "noData", "maxContentScroll", "colWidths", "columCount", "direction", "fixHeader", "stickyTopOffset", "stickyBottomOffset", "stickyClassName"],
  emits: ["scroll"],
  setup(e, t) {
    let {
      attrs: n,
      slots: o,
      emit: l
    } = t;
    const a = Ye();
    const r = S(() => a.isSticky && !e.fixHeader ? 0 : a.scrollbarSize);
    const i = Ce();
    const s = v => {
      const {
        currentTarget: u,
        deltaX: h
      } = v;
      if (h) {
        l("scroll", {
          currentTarget: u,
          scrollLeft: u.scrollLeft + h
        });
        v.preventDefault();
      }
    };
    const f = Ce();
    ct(() => {
      dt(() => {
        f.value = ft(i.value, "wheel", s);
      });
    });
    gt(() => {
      var v;
      if ((v = f.value) !== null && v !== undefined) {
        v.remove();
      }
    });
    const d = S(() => e.flattenColumns.every(v => v.width && v.width !== 0 && v.width !== "0px"));
    const c = Ce([]);
    const m = Ce([]);
    De(() => {
      const v = e.flattenColumns[e.flattenColumns.length - 1];
      const u = {
        fixed: v ? v.fixed : null,
        scrollbar: true,
        customHeaderCell: () => ({
          class: `${a.prefixCls}-cell-scrollbar`
        })
      };
      c.value = r.value ? [...e.columns, u] : e.columns;
      m.value = r.value ? [...e.flattenColumns, u] : e.flattenColumns;
    });
    const C = S(() => {
      const {
        stickyOffsets: v,
        direction: u
      } = e;
      const {
        right: h,
        left: $
      } = v;
      return x(x({}, v), {
        left: u === "rtl" ? [...$.map(p => p + r.value), 0] : $,
        right: u === "rtl" ? h : [...h.map(p => p + r.value), 0],
        isSticky: a.isSticky
      });
    });
    const w = wr(Be(e, "colWidths"), Be(e, "columCount"));
    return () => {
      var v;
      const {
        noData: u,
        columCount: h,
        stickyTopOffset: $,
        stickyBottomOffset: p,
        stickyClassName: P,
        maxContentScroll: I
      } = e;
      const {
        isSticky: H
      } = a;
      return y("div", {
        style: x({
          overflow: "hidden"
        }, H ? {
          top: `${$}px`,
          bottom: `${p}px`
        } : {}),
        ref: i,
        class: be(n.class, {
          [P]: !!P
        })
      }, [y("table", {
        style: {
          tableLayout: "fixed",
          visibility: u || w.value ? null : "hidden"
        }
      }, [(!u || !I || d.value) && y(cl, {
        colWidths: w.value ? [...w.value, r.value] : [],
        columCount: h + 1,
        columns: m.value
      }, null), (v = o.default) === null || v === undefined ? undefined : v.call(o, x(x({}, e), {
        stickyOffsets: C.value,
        columns: c.value,
        flattenColumns: m.value
      }))])]);
    };
  }
});
function lo(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), o = 1; o < t; o++) {
    n[o - 1] = arguments[o];
  }
  return it(ha(n.map(l => [l, Be(e, l)])));
}
const $r = [];
const kr = {};
const fn = "rc-table-internal-hook";
const Kr = we({
  name: "VcTable",
  inheritAttrs: false,
  props: ["prefixCls", "data", "columns", "rowKey", "tableLayout", "scroll", "rowClassName", "title", "footer", "id", "showHeader", "components", "customRow", "customHeaderRow", "direction", "expandFixed", "expandColumnWidth", "expandedRowKeys", "defaultExpandedRowKeys", "expandedRowRender", "expandRowByClick", "expandIcon", "onExpand", "onExpandedRowsChange", "onUpdate:expandedRowKeys", "defaultExpandAllRows", "indentSize", "expandIconColumnIndex", "expandedRowClassName", "childrenColumnName", "rowExpandable", "sticky", "transformColumns", "internalHooks", "internalRefs", "canExpandable", "onUpdateInternalRefs", "transformCellText"],
  emits: ["expand", "expandedRowsChange", "updateInternalRefs", "update:expandedRowKeys"],
  setup(e, t) {
    let {
      attrs: n,
      slots: o,
      emit: l
    } = t;
    const a = S(() => e.data || $r);
    const r = S(() => !!a.value.length);
    const i = S(() => Ba(e.components, {}));
    const s = (g, O) => Zo(i.value, g) || O;
    const f = S(() => {
      const g = e.rowKey;
      if (typeof g == "function") {
        return g;
      } else {
        return O => O && O[g];
      }
    });
    const d = S(() => e.expandIcon || br);
    const c = S(() => e.childrenColumnName || "children");
    const m = S(() => e.expandedRowRender ? "row" : e.canExpandable || a.value.some(g => g && typeof g == "object" && g[c.value]) ? "nest" : false);
    const C = Z([]);
    De(() => {
      if (e.defaultExpandedRowKeys) {
        C.value = e.defaultExpandedRowKeys;
      }
      if (e.defaultExpandAllRows) {
        C.value = xr(a.value, f.value, c.value);
      }
    })();
    const v = S(() => new Set(e.expandedRowKeys || C.value || []));
    const u = g => {
      const O = f.value(g, a.value.indexOf(g));
      let Y;
      const de = v.value.has(O);
      if (de) {
        v.value.delete(O);
        Y = [...v.value];
      } else {
        Y = [...v.value, O];
      }
      C.value = Y;
      l("expand", !de, g);
      l("update:expandedRowKeys", Y);
      l("expandedRowsChange", Y);
    };
    const h = Ce(0);
    const [$, p] = sr(x(x({}, Ut(e)), {
      expandable: S(() => !!e.expandedRowRender),
      expandedKeys: v,
      getRowKey: f,
      onTriggerExpand: u,
      expandIcon: d
    }), S(() => e.internalHooks === fn ? e.transformColumns : null));
    const P = S(() => ({
      columns: $.value,
      flattenColumns: p.value
    }));
    const I = Ce();
    const H = Ce();
    const N = Ce();
    const F = Ce({
      scrollWidth: 0,
      clientWidth: 0
    });
    const b = Ce();
    const [K, _] = ht(false);
    const [B, A] = ht(false);
    const [le, ae] = sl(new Map());
    const fe = S(() => zt(p.value));
    const Se = S(() => fe.value.map(g => le.value.get(g)));
    const U = S(() => p.value.length);
    const Q = dr(Se, U, Be(e, "direction"));
    const M = S(() => e.scroll && sn(e.scroll.y));
    const J = S(() => e.scroll && sn(e.scroll.x) || !!e.expandFixed);
    const R = S(() => J.value && p.value.some(g => {
      let {
        fixed: O
      } = g;
      return O;
    }));
    const V = Ce();
    const z = Sr(Be(e, "sticky"), Be(e, "prefixCls"));
    const ee = it({});
    const G = S(() => {
      const g = Object.values(ee)[0];
      return (M.value || z.value.isSticky) && g;
    });
    const $e = (g, O) => {
      if (O) {
        ee[g] = O;
      } else {
        delete ee[g];
      }
    };
    const ce = Ce({});
    const Ke = Ce({});
    const Oe = Ce({});
    De(() => {
      if (M.value) {
        Ke.value = {
          overflowY: "scroll",
          maxHeight: Wn(e.scroll.y)
        };
      }
      if (J.value) {
        ce.value = {
          overflowX: "auto"
        };
        if (!M.value) {
          Ke.value = {
            overflowY: "hidden"
          };
        }
        Oe.value = {
          width: e.scroll.x === true ? "auto" : Wn(e.scroll.x),
          minWidth: "100%"
        };
      }
    });
    const Ie = (g, O) => {
      if (Hl(I.value)) {
        ae(Y => {
          if (Y.get(g) !== O) {
            const de = new Map(Y);
            de.set(g, O);
            return de;
          }
          return Y;
        });
      }
    };
    const [_e, Me] = cr();
    function Ee(g, O) {
      if (!O) {
        return;
      }
      if (typeof O == "function") {
        O(g);
        return;
      }
      const Y = O.$el || O;
      if (Y.scrollLeft !== g) {
        Y.scrollLeft = g;
      }
    }
    const Pe = g => {
      let {
        currentTarget: O,
        scrollLeft: Y
      } = g;
      const me = e.direction === "rtl";
      const E = typeof Y == "number" ? Y : O.scrollLeft;
      const T = O || kr;
      if (!Me() || Me() === T) {
        _e(T);
        Ee(E, H.value);
        Ee(E, N.value);
        Ee(E, b.value);
        Ee(E, V.value?.setScrollLeft);
      }
      if (O) {
        const {
          scrollWidth: D,
          clientWidth: L
        } = O;
        if (me) {
          _(-E < D - L);
          A(-E > 0);
        } else {
          _(E > 0);
          A(E < D - L);
        }
      }
    };
    const j = () => {
      if (J.value && N.value) {
        Pe({
          currentTarget: N.value
        });
      } else {
        _(false);
        A(false);
      }
    };
    let se;
    const X = g => {
      if (g !== h.value) {
        j();
        h.value = I.value ? I.value.offsetWidth : g;
      }
    };
    const oe = g => {
      let {
        width: O
      } = g;
      clearTimeout(se);
      if (h.value === 0) {
        X(O);
        return;
      }
      se = setTimeout(() => {
        X(O);
      }, 100);
    };
    Re([J, () => e.data, () => e.columns], () => {
      if (J.value) {
        j();
      }
    }, {
      flush: "post"
    });
    const [ie, xe] = ht(0);
    ja();
    ct(() => {
      dt(() => {
        j();
        xe(Ll(N.value).width);
        F.value = {
          scrollWidth: N.value?.scrollWidth || 0,
          clientWidth: N.value?.clientWidth || 0
        };
      });
    });
    wn(() => {
      dt(() => {
        const Y = N.value?.scrollWidth || 0;
        const de = N.value?.clientWidth || 0;
        if (F.value.scrollWidth !== Y || F.value.clientWidth !== de) {
          F.value = {
            scrollWidth: Y,
            clientWidth: de
          };
        }
      });
    });
    De(() => {
      if (e.internalHooks === fn && e.internalRefs) {
        e.onUpdateInternalRefs({
          body: N.value ? N.value.$el || N.value : null
        });
      }
    }, {
      flush: "post"
    });
    const re = S(() => e.tableLayout ? e.tableLayout : R.value ? e.scroll.x === "max-content" ? "auto" : "fixed" : M.value || z.value.isSticky || p.value.some(g => {
      let {
        ellipsis: O
      } = g;
      return O;
    }) ? "fixed" : "auto");
    const ue = () => {
      var g;
      if (r.value) {
        return null;
      } else {
        return ((g = o.emptyText) === null || g === undefined ? undefined : g.call(o)) || "No Data";
      }
    };
    _a(it(x(x({}, Ut(lo(e, "prefixCls", "direction", "transformCellText"))), {
      getComponent: s,
      scrollbarSize: ie,
      fixedInfoList: S(() => p.value.map((g, O) => In(O, O, p.value, Q.value, e.direction))),
      isSticky: S(() => z.value.isSticky),
      summaryCollect: $e
    })));
    er(it(x(x({}, Ut(lo(e, "rowClassName", "expandedRowClassName", "expandRowByClick", "expandedRowRender", "expandIconColumnIndex", "indentSize"))), {
      columns: $,
      flattenColumns: p,
      tableLayout: re,
      expandIcon: d,
      expandableType: m,
      onTriggerExpand: u
    })));
    or({
      onColumnResize: Ie
    });
    Qa({
      componentWidth: h,
      fixHeader: M,
      fixColumn: R,
      horizonScroll: J
    });
    const ke = () => y(ar, {
      data: a.value,
      measureColumnWidth: M.value || J.value || z.value.isSticky,
      expandedKeys: v.value,
      rowExpandable: e.rowExpandable,
      getRowKey: f.value,
      customRow: e.customRow,
      childrenColumnName: c.value
    }, {
      emptyNode: ue
    });
    const k = () => y(cl, {
      colWidths: p.value.map(g => {
        let {
          width: O
        } = g;
        return O;
      }),
      columns: p.value
    }, null);
    return () => {
      var g;
      const {
        prefixCls: O,
        scroll: Y,
        tableLayout: de,
        direction: me,
        title: E = o.title,
        footer: T = o.footer,
        id: D,
        showHeader: L,
        customHeaderRow: q
      } = e;
      const {
        isSticky: te,
        offsetHeader: W,
        offsetSummary: pe,
        offsetScroll: ge,
        stickyClassName: ve,
        container: he
      } = z.value;
      const ye = s(["table"], "table");
      const Fe = s(["body"]);
      const Ae = (g = o.summary) === null || g === undefined ? undefined : g.call(o, {
        pageData: a.value
      });
      let He = () => null;
      const Ne = {
        colWidths: Se.value,
        columCount: p.value.length,
        stickyOffsets: Q.value,
        customHeaderRow: q,
        fixHeader: M.value,
        scroll: Y
      };
      if (M.value || te) {
        let ut = () => null;
        if (typeof Fe == "function") {
          ut = () => Fe(a.value, {
            scrollbarSize: ie.value,
            ref: N,
            onScroll: Pe
          });
          Ne.colWidths = p.value.map((ot, Xt) => {
            let {
              width: Pt
            } = ot;
            const Ct = Xt === $.value.length - 1 ? Pt - ie.value : Pt;
            if (typeof Ct == "number" && !Number.isNaN(Ct)) {
              return Ct;
            } else {
              return 0;
            }
          });
        } else {
          ut = () => y("div", {
            style: x(x({}, ce.value), Ke.value),
            onScroll: Pe,
            ref: N,
            class: be(`${O}-body`)
          }, [y(ye, {
            style: x(x({}, Oe.value), {
              tableLayout: re.value
            })
          }, {
            default: () => [k(), ke(), !G.value && Ae && y(Tt, {
              stickyOffsets: Q.value,
              flattenColumns: p.value
            }, {
              default: () => [Ae]
            })]
          })]);
        }
        const Et = x(x(x({
          noData: !a.value.length,
          maxContentScroll: J.value && Y.x === "max-content"
        }, Ne), P.value), {
          direction: me,
          stickyClassName: ve,
          onScroll: Pe
        });
        He = () => y(st, null, [L !== false && y(oo, ne(ne({}, Et), {}, {
          stickyTopOffset: W,
          class: `${O}-header`,
          ref: H
        }), {
          default: ot => y(st, null, [y(to, ot, null), G.value === "top" && y(Tt, ot, {
            default: () => [Ae]
          })])
        }), ut(), G.value && G.value !== "top" && y(oo, ne(ne({}, Et), {}, {
          stickyBottomOffset: pe,
          class: `${O}-summary`,
          ref: b
        }), {
          default: ot => y(Tt, ot, {
            default: () => [Ae]
          })
        }), te && N.value && y(Cr, {
          ref: V,
          offsetScroll: ge,
          scrollBodyRef: N,
          onScroll: Pe,
          container: he,
          scrollBodySizeInfo: F.value
        }, null)]);
      } else {
        He = () => y("div", {
          style: x(x({}, ce.value), Ke.value),
          class: be(`${O}-content`),
          onScroll: Pe,
          ref: N
        }, [y(ye, {
          style: x(x({}, Oe.value), {
            tableLayout: re.value
          })
        }, {
          default: () => [k(), L !== false && y(to, ne(ne({}, Ne), P.value), null), ke(), Ae && y(Tt, {
            stickyOffsets: Q.value,
            flattenColumns: p.value
          }, {
            default: () => [Ae]
          })]
        })]);
      }
      const Ve = $n(n, {
        aria: true,
        data: true
      });
      const nt = () => y("div", ne(ne({}, Ve), {}, {
        class: be(O, {
          [`${O}-rtl`]: me === "rtl",
          [`${O}-ping-left`]: K.value,
          [`${O}-ping-right`]: B.value,
          [`${O}-layout-fixed`]: de === "fixed",
          [`${O}-fixed-header`]: M.value,
          [`${O}-fixed-column`]: R.value,
          [`${O}-scroll-horizontal`]: J.value,
          [`${O}-has-fix-left`]: p.value[0] && p.value[0].fixed,
          [`${O}-has-fix-right`]: p.value[U.value - 1] && p.value[U.value - 1].fixed === "right",
          [n.class]: n.class
        }),
        style: n.style,
        id: D,
        ref: I
      }), [E && y(un, {
        class: `${O}-title`
      }, {
        default: () => [E(a.value)]
      }), y("div", {
        class: `${O}-container`
      }, [He()]), T && y(un, {
        class: `${O}-footer`
      }, {
        default: () => [T(a.value)]
      })]);
      if (J.value) {
        return y(Bo, {
          onResize: oe
        }, {
          default: nt
        });
      } else {
        return nt();
      }
    };
  }
});
function Or() {
  const e = x({}, arguments.length <= 0 ? undefined : arguments[0]);
  for (let t = 1; t < arguments.length; t++) {
    const n = t < 0 || arguments.length <= t ? undefined : arguments[t];
    if (n) {
      Object.keys(n).forEach(o => {
        const l = n[o];
        if (l !== undefined) {
          e[o] = l;
        }
      });
    }
  }
  return e;
}
const vn = 10;
function Er(e, t) {
  const n = {
    current: e.current,
    pageSize: e.pageSize
  };
  Object.keys(t && typeof t == "object" ? t : {}).forEach(l => {
    const a = e[l];
    if (typeof a != "function") {
      n[l] = a;
    }
  });
  return n;
}
function Pr(e, t, n) {
  const o = S(() => t.value && typeof t.value == "object" ? t.value : {});
  const l = S(() => o.value.total || 0);
  const [a, r] = ht(() => ({
    current: "defaultCurrent" in o.value ? o.value.defaultCurrent : 1,
    pageSize: "defaultPageSize" in o.value ? o.value.defaultPageSize : vn
  }));
  const i = S(() => {
    const d = Or(a.value, o.value, {
      total: l.value > 0 ? l.value : e.value
    });
    const c = Math.ceil((l.value || e.value) / d.pageSize);
    if (d.current > c) {
      d.current = c || 1;
    }
    return d;
  });
  const s = (d, c) => {
    if (t.value !== false) {
      r({
        current: d ?? 1,
        pageSize: c || i.value.pageSize
      });
    }
  };
  const f = (d, c) => {
    var m;
    var C;
    if (t.value) {
      if ((C = (m = o.value).onChange) !== null && C !== undefined) {
        C.call(m, d, c);
      }
    }
    s(d, c);
    n(d, c || i.value.pageSize);
  };
  return [S(() => t.value === false ? {} : x(x({}, i.value), {
    onChange: f
  })), s];
}
function Tr(e, t, n) {
  const o = Z({});
  Re([e, t, n], () => {
    const a = new Map();
    const r = n.value;
    const i = t.value;
    function s(f) {
      f.forEach((d, c) => {
        const m = r(d, c);
        a.set(m, d);
        if (d && typeof d == "object" && i in d) {
          s(d[i] || []);
        }
      });
    }
    s(e.value);
    o.value = {
      kvMap: a
    };
  }, {
    deep: true,
    immediate: true
  });
  function l(a) {
    return o.value.kvMap.get(a);
  }
  return [l];
}
const Qe = {};
const pn = "SELECT_ALL";
const hn = "SELECT_INVERT";
const yn = "SELECT_NONE";
const Ir = [];
function ul(e, t) {
  let n = [];
  (t || []).forEach(o => {
    n.push(o);
    if (o && typeof o == "object" && e in o) {
      n = [...n, ...ul(e, o[e])];
    }
  });
  return n;
}
function Nr(e, t) {
  const n = S(() => {
    const b = e.value || {};
    const {
      checkStrictly: K = true
    } = b;
    return x(x({}, b), {
      checkStrictly: K
    });
  });
  const [o, l] = Ml(n.value.selectedRowKeys || n.value.defaultSelectedRowKeys || Ir, {
    value: S(() => n.value.selectedRowKeys)
  });
  const a = Z(new Map());
  const r = b => {
    if (n.value.preserveSelectedRowKeys) {
      const K = new Map();
      b.forEach(_ => {
        let B = t.getRecordByKey(_);
        if (!B && a.value.has(_)) {
          B = a.value.get(_);
        }
        K.set(_, B);
      });
      a.value = K;
    }
  };
  De(() => {
    r(o.value);
  });
  const i = S(() => n.value.checkStrictly ? null : Pn(t.data.value, {
    externalGetKey: t.getRowKey.value,
    childrenPropName: t.childrenColumnName.value
  }).keyEntities);
  const s = S(() => ul(t.childrenColumnName.value, t.pageData.value));
  const f = S(() => {
    const b = new Map();
    const K = t.getRowKey.value;
    const _ = n.value.getCheckboxProps;
    s.value.forEach((B, A) => {
      const le = K(B, A);
      const ae = (_ ? _(B) : null) || {};
      b.set(le, ae);
    });
    return b;
  });
  const {
    maxLevel: d,
    levelEntities: c
  } = Yo(i);
  const m = b => {
    var K;
    return (K = f.value.get(t.getRowKey.value(b))) !== null && K !== undefined && !!K.disabled;
  };
  const C = S(() => {
    if (n.value.checkStrictly) {
      return [o.value || [], []];
    }
    const {
      checkedKeys: b,
      halfCheckedKeys: K
    } = bt(o.value, true, i.value, d.value, c.value, m);
    return [b || [], K];
  });
  const w = S(() => C.value[0]);
  const v = S(() => C.value[1]);
  const u = S(() => {
    const b = n.value.type === "radio" ? w.value.slice(0, 1) : w.value;
    return new Set(b);
  });
  const h = S(() => n.value.type === "radio" ? new Set() : new Set(v.value));
  const [$, p] = ht(null);
  const P = b => {
    let K;
    let _;
    r(b);
    const {
      preserveSelectedRowKeys: B,
      onChange: A
    } = n.value;
    const {
      getRecordByKey: le
    } = t;
    if (B) {
      K = b;
      _ = b.map(ae => a.value.get(ae));
    } else {
      K = [];
      _ = [];
      b.forEach(ae => {
        const fe = le(ae);
        if (fe !== undefined) {
          K.push(ae);
          _.push(fe);
        }
      });
    }
    l(K);
    if (A != null) {
      A(K, _);
    }
  };
  const I = (b, K, _, B) => {
    const {
      onSelect: A
    } = n.value;
    const {
      getRecordByKey: le
    } = t || {};
    if (A) {
      const ae = _.map(fe => le(fe));
      A(le(b), K, ae, B);
    }
    P(_);
  };
  const H = S(() => {
    const {
      onSelectInvert: b,
      onSelectNone: K,
      selections: _,
      hideSelectAll: B
    } = n.value;
    const {
      data: A,
      pageData: le,
      getRowKey: ae,
      locale: fe
    } = t;
    if (!_ || B) {
      return null;
    } else {
      return (_ === true ? [pn, hn, yn] : _).map(U => U === pn ? {
        key: "all",
        text: fe.value.selectionAll,
        onSelect() {
          P(A.value.map((Q, M) => ae.value(Q, M)).filter(Q => {
            const M = f.value.get(Q);
            return M == null || !M.disabled || u.value.has(Q);
          }));
        }
      } : U === hn ? {
        key: "invert",
        text: fe.value.selectInvert,
        onSelect() {
          const Q = new Set(u.value);
          le.value.forEach((J, R) => {
            const V = ae.value(J, R);
            const z = f.value.get(V);
            if (z == null || !z.disabled) {
              if (Q.has(V)) {
                Q.delete(V);
              } else {
                Q.add(V);
              }
            }
          });
          const M = Array.from(Q);
          if (b) {
            et(false, "Table", "`onSelectInvert` will be removed in future. Please use `onChange` instead.");
            b(M);
          }
          P(M);
        }
      } : U === yn ? {
        key: "none",
        text: fe.value.selectNone,
        onSelect() {
          if (K != null) {
            K();
          }
          P(Array.from(u.value).filter(Q => {
            const M = f.value.get(Q);
            if (M == null) {
              return undefined;
            } else {
              return M.disabled;
            }
          }));
        }
      } : U);
    }
  });
  const N = S(() => s.value.length);
  return [b => {
    const {
      onSelectAll: _,
      onSelectMultiple: B,
      columnWidth: A,
      type: le,
      fixed: ae,
      renderCell: fe,
      hideSelectAll: Se,
      checkStrictly: U
    } = n.value;
    const {
      prefixCls: Q,
      getRecordByKey: M,
      getRowKey: J,
      expandType: R,
      getPopupContainer: V
    } = t;
    if (!e.value) {
      return b.filter(X => X !== Qe);
    }
    let z = b.slice();
    const ee = new Set(u.value);
    const G = s.value.map(J.value).filter(X => !f.value.get(X).disabled);
    const $e = G.every(X => ee.has(X));
    const ce = G.some(X => ee.has(X));
    const Ke = () => {
      const X = [];
      if ($e) {
        G.forEach(ie => {
          ee.delete(ie);
          X.push(ie);
        });
      } else {
        G.forEach(ie => {
          if (!ee.has(ie)) {
            ee.add(ie);
            X.push(ie);
          }
        });
      }
      const oe = Array.from(ee);
      if (_ != null) {
        _(!$e, oe.map(ie => M(ie)), X.map(ie => M(ie)));
      }
      P(oe);
    };
    let Oe;
    if (le !== "radio") {
      let X;
      if (H.value) {
        const ue = y(Bt, {
          getPopupContainer: V.value
        }, {
          default: () => [H.value.map((ke, k) => {
            const {
              key: g,
              text: O,
              onSelect: Y
            } = ke;
            return y(Bt.Item, {
              key: g || k,
              onClick: () => {
                if (Y != null) {
                  Y(G);
                }
              }
            }, {
              default: () => [O]
            });
          })]
        });
        X = y("div", {
          class: `${Q.value}-selection-extra`
        }, [y(Ho, {
          overlay: ue,
          getPopupContainer: V.value
        }, {
          default: () => [y("span", null, [y(zl, null, null)])]
        })]);
      }
      const oe = s.value.map((ue, ke) => {
        const k = J.value(ue, ke);
        const g = f.value.get(k) || {};
        return x({
          checked: ee.has(k)
        }, g);
      }).filter(ue => {
        let {
          disabled: ke
        } = ue;
        return ke;
      });
      const ie = !!oe.length && oe.length === N.value;
      const xe = ie && oe.every(ue => {
        let {
          checked: ke
        } = ue;
        return ke;
      });
      const re = ie && oe.some(ue => {
        let {
          checked: ke
        } = ue;
        return ke;
      });
      Oe = !Se && y("div", {
        class: `${Q.value}-selection`
      }, [y(Ft, {
        checked: ie ? xe : !!N.value && $e,
        indeterminate: ie ? !xe && re : !$e && ce,
        onChange: Ke,
        disabled: N.value === 0 || ie,
        "aria-label": X ? "Custom selection" : "Select all",
        skipGroup: true
      }, null), X]);
    }
    let Ie;
    if (le === "radio") {
      Ie = X => {
        let {
          record: oe,
          index: ie
        } = X;
        const xe = J.value(oe, ie);
        const re = ee.has(xe);
        return {
          node: y(Mo, ne(ne({}, f.value.get(xe)), {}, {
            checked: re,
            onClick: ue => ue.stopPropagation(),
            onChange: ue => {
              if (!ee.has(xe)) {
                I(xe, true, [xe], ue.nativeEvent);
              }
            }
          }), null),
          checked: re
        };
      };
    } else {
      Ie = X => {
        let {
          record: oe,
          index: ie
        } = X;
        const re = J.value(oe, ie);
        const ue = ee.has(re);
        const ke = h.value.has(re);
        const k = f.value.get(re);
        let g;
        if (R.value === "nest") {
          g = ke;
          et(typeof (k == null ? undefined : k.indeterminate) != "boolean", "Table", "set `indeterminate` using `rowSelection.getCheckboxProps` is not allowed with tree structured dataSource.");
        } else {
          g = (k == null ? undefined : k.indeterminate) ?? ke;
        }
        return {
          node: y(Ft, ne(ne({}, k), {}, {
            indeterminate: g,
            checked: ue,
            skipGroup: true,
            onClick: O => O.stopPropagation(),
            onChange: O => {
              let {
                nativeEvent: Y
              } = O;
              const {
                shiftKey: de
              } = Y;
              let me = -1;
              let E = -1;
              if (de && U) {
                const T = new Set([$.value, re]);
                G.some((D, L) => {
                  if (T.has(D)) {
                    if (me === -1) {
                      me = L;
                    } else {
                      E = L;
                      return true;
                    }
                  }
                  return false;
                });
              }
              if (E !== -1 && me !== E && U) {
                const T = G.slice(me, E + 1);
                const D = [];
                if (ue) {
                  T.forEach(q => {
                    if (ee.has(q)) {
                      D.push(q);
                      ee.delete(q);
                    }
                  });
                } else {
                  T.forEach(q => {
                    if (!ee.has(q)) {
                      D.push(q);
                      ee.add(q);
                    }
                  });
                }
                const L = Array.from(ee);
                if (B != null) {
                  B(!ue, L.map(q => M(q)), D.map(q => M(q)));
                }
                P(L);
              } else {
                const T = w.value;
                if (U) {
                  const D = ue ? Xe(T, re) : qe(T, re);
                  I(re, !ue, D, Y);
                } else {
                  const D = bt([...T, re], true, i.value, d.value, c.value, m);
                  const {
                    checkedKeys: L,
                    halfCheckedKeys: q
                  } = D;
                  let te = L;
                  if (ue) {
                    const W = new Set(L);
                    W.delete(re);
                    te = bt(Array.from(W), {
                      halfCheckedKeys: q
                    }, i.value, d.value, c.value, m).checkedKeys;
                  }
                  I(re, !ue, te, Y);
                }
              }
              p(re);
            }
          }), null),
          checked: ue
        };
      };
    }
    const _e = X => {
      let {
        record: oe,
        index: ie
      } = X;
      const {
        node: xe,
        checked: re
      } = Ie({
        record: oe,
        index: ie
      });
      if (fe) {
        return fe(re, oe, ie, xe);
      } else {
        return xe;
      }
    };
    if (!z.includes(Qe)) {
      if (z.findIndex(X => {
        return X[xt]?.columnType === "EXPAND_COLUMN";
      }) === 0) {
        const [X, ...oe] = z;
        z = [X, Qe, ...oe];
      } else {
        z = [Qe, ...z];
      }
    }
    const Me = z.indexOf(Qe);
    z = z.filter((X, oe) => X !== Qe || oe === Me);
    const Ee = z[Me - 1];
    const Pe = z[Me + 1];
    let j = ae;
    if (j === undefined) {
      if ((Pe == null ? undefined : Pe.fixed) !== undefined) {
        j = Pe.fixed;
      } else if ((Ee == null ? undefined : Ee.fixed) !== undefined) {
        j = Ee.fixed;
      }
    }
    if (j && Ee && Ee[xt]?.columnType === "EXPAND_COLUMN" && Ee.fixed === undefined) {
      Ee.fixed = j;
    }
    const se = {
      fixed: j,
      width: A,
      className: `${Q.value}-selection-column`,
      title: n.value.columnTitle || Oe,
      customRender: _e,
      [xt]: {
        class: `${Q.value}-selection-col`
      }
    };
    return z.map(X => X === Qe ? se : X);
  }, u];
}
var Dr = {
  icon: {
    tag: "svg",
    attrs: {
      viewBox: "0 0 1024 1024",
      focusable: "false"
    },
    children: [{
      tag: "path",
      attrs: {
        d: "M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"
      }
    }]
  },
  name: "caret-down",
  theme: "outlined"
};
function ao(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? Object(arguments[t]) : {};
    var o = Object.keys(n);
    if (typeof Object.getOwnPropertySymbols == "function") {
      o = o.concat(Object.getOwnPropertySymbols(n).filter(function (l) {
        return Object.getOwnPropertyDescriptor(n, l).enumerable;
      }));
    }
    o.forEach(function (l) {
      Rr(e, l, n[l]);
    });
  }
  return e;
}
function Rr(e, t, n) {
  if (t in e) {
    Object.defineProperty(e, t, {
      value: n,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    e[t] = n;
  }
  return e;
}
function Nn(t, n) {
  var o = ao({}, t, n.attrs);
  return y(tt, ao({}, o, {
    icon: Dr
  }), null);
}
Nn.displayName = "CaretDownOutlined";
Nn.inheritAttrs = false;
var _r = {
  icon: {
    tag: "svg",
    attrs: {
      viewBox: "0 0 1024 1024",
      focusable: "false"
    },
    children: [{
      tag: "path",
      attrs: {
        d: "M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z"
      }
    }]
  },
  name: "caret-up",
  theme: "outlined"
};
function ro(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? Object(arguments[t]) : {};
    var o = Object.keys(n);
    if (typeof Object.getOwnPropertySymbols == "function") {
      o = o.concat(Object.getOwnPropertySymbols(n).filter(function (l) {
        return Object.getOwnPropertyDescriptor(n, l).enumerable;
      }));
    }
    o.forEach(function (l) {
      Fr(e, l, n[l]);
    });
  }
  return e;
}
function Fr(e, t, n) {
  if (t in e) {
    Object.defineProperty(e, t, {
      value: n,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    e[t] = n;
  }
  return e;
}
function Dn(t, n) {
  var o = ro({}, t, n.attrs);
  return y(tt, ro({}, o, {
    icon: _r
  }), null);
}
Dn.displayName = "CaretUpOutlined";
Dn.inheritAttrs = false;
function Br(e, t) {
  var n = {};
  for (var o in e) {
    if (Object.prototype.hasOwnProperty.call(e, o) && t.indexOf(o) < 0) {
      n[o] = e[o];
    }
  }
  if (e != null && typeof Object.getOwnPropertySymbols == "function") {
    for (var l = 0, o = Object.getOwnPropertySymbols(e); l < o.length; l++) {
      if (t.indexOf(o[l]) < 0 && Object.prototype.propertyIsEnumerable.call(e, o[l])) {
        n[o[l]] = e[o[l]];
      }
    }
  }
  return n;
}
function yt(e, t) {
  if ("key" in e && e.key !== undefined && e.key !== null) {
    return e.key;
  } else if (e.dataIndex) {
    if (Array.isArray(e.dataIndex)) {
      return e.dataIndex.join(".");
    } else {
      return e.dataIndex;
    }
  } else {
    return t;
  }
}
function Ot(e, t) {
  if (t) {
    return `${t}-${e}`;
  } else {
    return `${e}`;
  }
}
function Rn(e, t) {
  if (typeof e == "function") {
    return e(t);
  } else {
    return e;
  }
}
function fl(e = []) {
  const t = Ro(e);
  const n = [];
  t.forEach(o => {
    var r;
    if (!o) {
      return;
    }
    const s = o.key;
    const f = o.props?.style || {};
    const d = o.props?.class || "";
    const c = o.props || {};
    for (const [u, h] of Object.entries(c)) {
      c[Do(u)] = h;
    }
    const m = o.children || {};
    const {
      default: C
    } = m;
    const w = Br(m, ["default"]);
    const v = x(x(x({}, w), c), {
      style: f,
      class: d
    });
    if (s) {
      v.key = s;
    }
    if ((r = o.type) !== null && r !== undefined && r.__ANT_TABLE_COLUMN_GROUP) {
      v.children = fl(typeof C == "function" ? C() : C);
    } else {
      const u = o.children?.default;
      v.customRender = v.customRender || u;
    }
    n.push(v);
  });
  return n;
}
const Rt = "ascend";
const Yt = "descend";
function At(e) {
  if (typeof e.sorter == "object" && typeof e.sorter.multiple == "number") {
    return e.sorter.multiple;
  } else {
    return false;
  }
}
function io(e) {
  if (typeof e == "function") {
    return e;
  } else if (e && typeof e == "object" && e.compare) {
    return e.compare;
  } else {
    return false;
  }
}
function Ar(e, t) {
  if (t) {
    return e[e.indexOf(t) + 1];
  } else {
    return e[0];
  }
}
function mn(e, t, n) {
  let o = [];
  function l(a, r) {
    o.push({
      column: a,
      key: yt(a, r),
      multiplePriority: At(a),
      sortOrder: a.sortOrder
    });
  }
  (e || []).forEach((a, r) => {
    const i = Ot(r, n);
    if (a.children) {
      if ("sortOrder" in a) {
        l(a, i);
      }
      o = [...o, ...mn(a.children, t, i)];
    } else if (a.sorter) {
      if ("sortOrder" in a) {
        l(a, i);
      } else if (t && a.defaultSortOrder) {
        o.push({
          column: a,
          key: yt(a, i),
          multiplePriority: At(a),
          sortOrder: a.defaultSortOrder
        });
      }
    }
  });
  return o;
}
function vl(e, t, n, o, l, a, r, i) {
  return (t || []).map((s, f) => {
    const d = Ot(f, i);
    let c = s;
    if (c.sorter) {
      const m = c.sortDirections || l;
      const C = c.showSorterTooltip === undefined ? r : c.showSorterTooltip;
      const w = yt(c, d);
      const v = n.find(b => {
        let {
          key: K
        } = b;
        return K === w;
      });
      const u = v ? v.sortOrder : null;
      const h = Ar(m, u);
      const $ = m.includes(Rt) && y(Dn, {
        class: be(`${e}-column-sorter-up`, {
          active: u === Rt
        }),
        role: "presentation"
      }, null);
      const p = m.includes(Yt) && y(Nn, {
        role: "presentation",
        class: be(`${e}-column-sorter-down`, {
          active: u === Yt
        })
      }, null);
      const {
        cancelSort: P,
        triggerAsc: I,
        triggerDesc: H
      } = a || {};
      let N = P;
      if (h === Yt) {
        N = H;
      } else if (h === Rt) {
        N = I;
      }
      const F = typeof C == "object" ? C : {
        title: N
      };
      c = x(x({}, c), {
        className: be(c.className, {
          [`${e}-column-sort`]: u
        }),
        title: b => {
          const K = y("div", {
            class: `${e}-column-sorters`
          }, [y("span", {
            class: `${e}-column-title`
          }, [Rn(s.title, b)]), y("span", {
            class: be(`${e}-column-sorter`, {
              [`${e}-column-sorter-full`]: !!$ && !!p
            })
          }, [y("span", {
            class: `${e}-column-sorter-inner`
          }, [$, p])])]);
          if (C) {
            return y(jl, F, {
              default: () => [K]
            });
          } else {
            return K;
          }
        },
        customHeaderCell: b => {
          const K = s.customHeaderCell && s.customHeaderCell(b) || {};
          const _ = K.onClick;
          const B = K.onKeydown;
          K.onClick = A => {
            o({
              column: s,
              key: w,
              sortOrder: h,
              multiplePriority: At(s)
            });
            if (_) {
              _(A);
            }
          };
          K.onKeydown = A => {
            if (A.keyCode === lt.ENTER) {
              o({
                column: s,
                key: w,
                sortOrder: h,
                multiplePriority: At(s)
              });
              if (B != null) {
                B(A);
              }
            }
          };
          if (u) {
            K["aria-sort"] = u === "ascend" ? "ascending" : "descending";
          }
          K.class = be(K.class, `${e}-column-has-sorters`);
          K.tabindex = 0;
          return K;
        }
      });
    }
    if ("children" in c) {
      c = x(x({}, c), {
        children: vl(e, c.children, n, o, l, a, r, d)
      });
    }
    return c;
  });
}
function so(e) {
  const {
    column: t,
    sortOrder: n
  } = e;
  return {
    column: t,
    order: n,
    field: t.dataIndex,
    columnKey: t.key
  };
}
function co(e) {
  const t = e.filter(n => {
    let {
      sortOrder: o
    } = n;
    return o;
  }).map(so);
  if (t.length === 0 && e.length) {
    return x(x({}, so(e[e.length - 1])), {
      column: undefined
    });
  } else if (t.length <= 1) {
    return t[0] || {};
  } else {
    return t;
  }
}
function gn(e, t, n) {
  const o = t.slice().sort((r, i) => i.multiplePriority - r.multiplePriority);
  const l = e.slice();
  const a = o.filter(r => {
    let {
      column: {
        sorter: i
      },
      sortOrder: s
    } = r;
    return io(i) && s;
  });
  if (a.length) {
    return l.sort((r, i) => {
      for (let s = 0; s < a.length; s += 1) {
        const f = a[s];
        const {
          column: {
            sorter: d
          },
          sortOrder: c
        } = f;
        const m = io(d);
        if (m && c) {
          const C = m(r, i, c);
          if (C !== 0) {
            if (c === Rt) {
              return C;
            } else {
              return -C;
            }
          }
        }
      }
      return 0;
    }).map(r => {
      const i = r[n];
      if (i) {
        return x(x({}, r), {
          [n]: gn(i, t, n)
        });
      } else {
        return r;
      }
    });
  } else {
    return l;
  }
}
function Lr(e) {
  let {
    prefixCls: t,
    mergedColumns: n,
    onSorterChange: o,
    sortDirections: l,
    tableLocale: a,
    showSorterTooltip: r
  } = e;
  const [i, s] = ht(mn(n.value, true));
  const f = S(() => {
    let w = true;
    const v = mn(n.value, false);
    if (!v.length) {
      return i.value;
    }
    const u = [];
    function h(p) {
      if (w) {
        u.push(p);
      } else {
        u.push(x(x({}, p), {
          sortOrder: null
        }));
      }
    }
    let $ = null;
    v.forEach(p => {
      if ($ === null) {
        h(p);
        if (p.sortOrder) {
          if (p.multiplePriority === false) {
            w = false;
          } else {
            $ = true;
          }
        }
      } else {
        if (!$ || p.multiplePriority === false) {
          w = false;
        }
        h(p);
      }
    });
    return u;
  });
  const d = S(() => {
    const w = f.value.map(v => {
      let {
        column: u,
        sortOrder: h
      } = v;
      return {
        column: u,
        order: h
      };
    });
    return {
      sortColumns: w,
      sortColumn: w[0] && w[0].column,
      sortOrder: w[0] && w[0].order
    };
  });
  function c(w) {
    let v;
    if (w.multiplePriority === false || !f.value.length || f.value[0].multiplePriority === false) {
      v = [w];
    } else {
      v = [...f.value.filter(u => {
        let {
          key: h
        } = u;
        return h !== w.key;
      }), w];
    }
    s(v);
    o(co(v), v);
  }
  const m = w => vl(t.value, w, f.value, c, l.value, a.value, r.value);
  const C = S(() => co(f.value));
  return [m, f, d, C];
}
var Hr = {
  icon: {
    tag: "svg",
    attrs: {
      viewBox: "64 64 896 896",
      focusable: "false"
    },
    children: [{
      tag: "path",
      attrs: {
        d: "M349 838c0 17.7 14.2 32 31.8 32h262.4c17.6 0 31.8-14.3 31.8-32V642H349v196zm531.1-684H143.9c-24.5 0-39.8 26.7-27.5 48l221.3 376h348.8l221.3-376c12.1-21.3-3.2-48-27.7-48z"
      }
    }]
  },
  name: "filter",
  theme: "filled"
};
function uo(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? Object(arguments[t]) : {};
    var o = Object.keys(n);
    if (typeof Object.getOwnPropertySymbols == "function") {
      o = o.concat(Object.getOwnPropertySymbols(n).filter(function (l) {
        return Object.getOwnPropertyDescriptor(n, l).enumerable;
      }));
    }
    o.forEach(function (l) {
      Mr(e, l, n[l]);
    });
  }
  return e;
}
function Mr(e, t, n) {
  if (t in e) {
    Object.defineProperty(e, t, {
      value: n,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    e[t] = n;
  }
  return e;
}
function _n(t, n) {
  var o = uo({}, t, n.attrs);
  return y(tt, uo({}, o, {
    icon: Hr
  }), null);
}
_n.displayName = "FilterFilled";
_n.inheritAttrs = false;
const zr = e => {
  const {
    keyCode: t
  } = e;
  if (t === lt.ENTER) {
    e.stopPropagation();
  }
};
const jr = (e, t) => {
  let {
    slots: n
  } = t;
  var o;
  return y("div", {
    onClick: l => l.stopPropagation(),
    onKeydown: zr
  }, [(o = n.default) === null || o === undefined ? undefined : o.call(n)]);
};
const fo = we({
  compatConfig: {
    MODE: 3
  },
  name: "FilterSearch",
  inheritAttrs: false,
  props: {
    value: at(),
    onChange: Te(),
    filterSearch: je([Boolean, Function]),
    tablePrefixCls: at(),
    locale: vt()
  },
  setup(e) {
    return () => {
      const {
        value: t,
        onChange: n,
        filterSearch: o,
        tablePrefixCls: l,
        locale: a
      } = e;
      if (o) {
        return y("div", {
          class: `${l}-filter-dropdown-search`
        }, [y(Wl, {
          placeholder: a.filterSearchPlaceholder,
          onChange: n,
          value: t,
          htmlSize: 1,
          class: `${l}-filter-dropdown-search-input`
        }, {
          prefix: () => y(Vl, null, null)
        })]);
      } else {
        return null;
      }
    };
  }
});
function vo(e, t) {
  var n = {};
  for (var o in e) {
    if (Object.prototype.hasOwnProperty.call(e, o) && t.indexOf(o) < 0) {
      n[o] = e[o];
    }
  }
  if (e != null && typeof Object.getOwnPropertySymbols == "function") {
    for (var l = 0, o = Object.getOwnPropertySymbols(e); l < o.length; l++) {
      if (t.indexOf(o[l]) < 0 && Object.prototype.propertyIsEnumerable.call(e, o[l])) {
        n[o[l]] = e[o[l]];
      }
    }
  }
  return n;
}
const Wr = we({
  compatConfig: {
    MODE: 3
  },
  name: "MotionTreeNode",
  inheritAttrs: false,
  props: x(x({}, Vo), {
    active: Boolean,
    motion: Object,
    motionNodes: {
      type: Array
    },
    onMotionStart: Function,
    onMotionEnd: Function,
    motionType: String
  }),
  setup(e, t) {
    let {
      attrs: n,
      slots: o
    } = t;
    const l = Z(true);
    const a = On();
    const r = Z(false);
    const i = S(() => e.motion ? e.motion : da());
    const s = (f, d) => {
      var c;
      var m;
      var C;
      var w;
      if (d === "appear") {
        if ((m = (c = i.value) === null || c === undefined ? undefined : c.onAfterEnter) !== null && m !== undefined) {
          m.call(c, f);
        }
      } else if (d === "leave") {
        if ((w = (C = i.value) === null || C === undefined ? undefined : C.onAfterLeave) !== null && w !== undefined) {
          w.call(C, f);
        }
      }
      if (!r.value) {
        e.onMotionEnd();
      }
      r.value = true;
    };
    Re(() => e.motionNodes, () => {
      if (e.motionNodes && e.motionType === "hide" && l.value) {
        dt(() => {
          l.value = false;
        });
      }
    }, {
      immediate: true,
      flush: "post"
    });
    ct(() => {
      if (e.motionNodes) {
        e.onMotionStart();
      }
    });
    gt(() => {
      if (e.motionNodes) {
        s();
      }
    });
    return () => {
      const {
        motion: f,
        motionNodes: d,
        motionType: c,
        active: m,
        eventKey: C
      } = e;
      const w = vo(e, ["motion", "motionNodes", "motionType", "active", "eventKey"]);
      if (d) {
        return y(Xl, ne(ne({}, i.value), {}, {
          appear: c === "show",
          onAfterAppear: v => s(v, "appear"),
          onAfterLeave: v => s(v, "leave")
        }), {
          default: () => [Ul(y("div", {
            class: `${a.value.prefixCls}-treenode-motion`
          }, [d.map(v => {
            const u = vo(v.data, []);
            const {
              title: h,
              key: $,
              isStart: p,
              isEnd: P
            } = v;
            delete u.children;
            return y(ln, ne(ne({}, u), {}, {
              title: h,
              active: m,
              data: v.data,
              key: $,
              eventKey: $,
              isStart: p,
              isEnd: P
            }), o);
          })]), [[Gl, l.value]])]
        });
      } else {
        return y(ln, ne(ne({
          class: n.class,
          style: n.style
        }, w), {}, {
          active: m,
          eventKey: C
        }), o);
      }
    };
  }
});
function Vr(e = [], t = []) {
  const n = e.length;
  const o = t.length;
  if (Math.abs(n - o) !== 1) {
    return {
      add: false,
      key: null
    };
  }
  function l(a, r) {
    const i = new Map();
    a.forEach(f => {
      i.set(f, true);
    });
    const s = r.filter(f => !i.has(f));
    if (s.length === 1) {
      return s[0];
    } else {
      return null;
    }
  }
  if (n < o) {
    return {
      add: true,
      key: l(e, t)
    };
  } else {
    return {
      add: false,
      key: l(t, e)
    };
  }
}
function po(e, t, n) {
  const o = e.findIndex(r => r.key === n);
  const l = e[o + 1];
  const a = t.findIndex(r => r.key === n);
  if (l) {
    const r = t.findIndex(i => i.key === l.key);
    return t.slice(a + 1, r);
  }
  return t.slice(a + 1);
}
function ho(e, t) {
  var n = {};
  for (var o in e) {
    if (Object.prototype.hasOwnProperty.call(e, o) && t.indexOf(o) < 0) {
      n[o] = e[o];
    }
  }
  if (e != null && typeof Object.getOwnPropertySymbols == "function") {
    for (var l = 0, o = Object.getOwnPropertySymbols(e); l < o.length; l++) {
      if (t.indexOf(o[l]) < 0 && Object.prototype.propertyIsEnumerable.call(e, o[l])) {
        n[o[l]] = e[o[l]];
      }
    }
  }
  return n;
}
const yo = {
  width: 0,
  height: 0,
  display: "flex",
  overflow: "hidden",
  opacity: 0,
  border: 0,
  padding: 0,
  margin: 0
};
const Xr = () => {};
const mt = `RC_TREE_MOTION_${Math.random()}`;
const bn = {
  key: mt
};
const pl = {
  key: mt,
  level: 0,
  index: 0,
  pos: "0",
  node: bn,
  nodes: [bn]
};
const mo = {
  parent: null,
  children: [],
  pos: pl.pos,
  data: bn,
  title: null,
  key: mt,
  isStart: [],
  isEnd: []
};
function go(e, t, n, o) {
  if (t === false || !n) {
    return e;
  } else {
    return e.slice(0, Math.ceil(n / o) + 1);
  }
}
function bo(e) {
  const {
    key: t,
    pos: n
  } = e;
  return Kt(t, n);
}
function Ur(e) {
  let t = String(e.key);
  let n = e;
  while (n.parent) {
    n = n.parent;
    t = `${n.key} > ${t}`;
  }
  return t;
}
const Gr = we({
  compatConfig: {
    MODE: 3
  },
  name: "NodeList",
  inheritAttrs: false,
  props: Sa,
  setup(e, t) {
    let {
      expose: n,
      attrs: o
    } = t;
    const l = Ce();
    const a = Ce();
    const {
      expandedKeys: r,
      flattenNodes: i
    } = Wo();
    n({
      scrollTo: v => {
        l.value.scrollTo(v);
      },
      getIndentWidth: () => a.value.offsetWidth
    });
    const s = Z(i.value);
    const f = Z([]);
    const d = Ce(null);
    function c() {
      s.value = i.value;
      f.value = [];
      d.value = null;
      e.onListChangeEnd();
    }
    const m = On();
    Re([() => r.value.slice(), i], (v, u) => {
      let [h, $] = v;
      let [p, P] = u;
      const I = Vr(p, h);
      if (I.key !== null) {
        const {
          virtual: H,
          height: N,
          itemHeight: F
        } = e;
        if (I.add) {
          const b = P.findIndex(B => {
            let {
              key: A
            } = B;
            return A === I.key;
          });
          const K = go(po(P, $, I.key), H, N, F);
          const _ = P.slice();
          _.splice(b + 1, 0, mo);
          s.value = _;
          f.value = K;
          d.value = "show";
        } else {
          const b = $.findIndex(B => {
            let {
              key: A
            } = B;
            return A === I.key;
          });
          const K = go(po($, P, I.key), H, N, F);
          const _ = $.slice();
          _.splice(b + 1, 0, mo);
          s.value = _;
          f.value = K;
          d.value = "hide";
        }
      } else if (P !== $) {
        s.value = $;
      }
    });
    Re(() => m.value.dragging, v => {
      if (!v) {
        c();
      }
    });
    const C = S(() => e.motion === undefined ? s.value : i.value);
    const w = () => {
      e.onActiveChange(null);
    };
    return () => {
      const v = x(x({}, e), o);
      const {
        prefixCls: u,
        selectable: h,
        checkable: $,
        disabled: p,
        motion: P,
        height: I,
        itemHeight: H,
        virtual: N,
        focusable: F,
        activeItem: b,
        focused: K,
        tabindex: _,
        onKeydown: B,
        onFocus: A,
        onBlur: le,
        onListChangeStart: ae,
        onListChangeEnd: fe
      } = v;
      const Se = ho(v, ["prefixCls", "selectable", "checkable", "disabled", "motion", "height", "itemHeight", "virtual", "focusable", "activeItem", "focused", "tabindex", "onKeydown", "onFocus", "onBlur", "onListChangeStart", "onListChangeEnd"]);
      return y(st, null, [K && b && y("span", {
        style: yo,
        "aria-live": "assertive"
      }, [Ur(b)]), y("div", null, [y("input", {
        style: yo,
        disabled: F === false || p,
        tabindex: F !== false ? _ : null,
        onKeydown: B,
        onFocus: A,
        onBlur: le,
        value: "",
        onChange: Xr,
        "aria-label": "for screen reader"
      }, null)]), y("div", {
        class: `${u}-treenode`,
        "aria-hidden": true,
        style: {
          position: "absolute",
          pointerEvents: "none",
          visibility: "hidden",
          height: 0,
          overflow: "hidden"
        }
      }, [y("div", {
        class: `${u}-indent`
      }, [y("div", {
        ref: a,
        class: `${u}-indent-unit`
      }, null)])]), y(Yl, ne(ne({}, Lt(Se, ["onActiveChange"])), {}, {
        data: C.value,
        itemKey: bo,
        height: I,
        fullHeight: false,
        virtual: N,
        itemHeight: H,
        prefixCls: `${u}-list`,
        ref: l,
        onVisibleChange: (U, Q) => {
          const M = new Set(U);
          if (Q.filter(R => !M.has(R)).some(R => bo(R) === mt)) {
            c();
          }
        }
      }), {
        default: U => {
          const {
            pos: Q
          } = U;
          const M = ho(U.data, []);
          const {
            title: J,
            key: R,
            isStart: V,
            isEnd: z
          } = U;
          const ee = Kt(R, Q);
          delete M.key;
          delete M.children;
          return y(Wr, ne(ne({}, M), {}, {
            eventKey: ee,
            title: J,
            active: !!b && R === b.key,
            data: U.data,
            isStart: V,
            isEnd: z,
            motion: P,
            motionNodes: R === mt ? f.value : null,
            motionType: d.value,
            onMotionStart: ae,
            onMotionEnd: c,
            onMousemove: w
          }), null);
        }
      })]);
    };
  }
});
function Yr(e) {
  let {
    dropPosition: t,
    dropLevelOffset: n,
    indent: o
  } = e;
  const l = {
    pointerEvents: "none",
    position: "absolute",
    right: 0,
    backgroundColor: "red",
    height: "2px"
  };
  switch (t) {
    case -1:
      l.top = 0;
      l.left = `${-n * o}px`;
      break;
    case 1:
      l.bottom = 0;
      l.left = `${-n * o}px`;
      break;
    case 0:
      l.bottom = 0;
      l.left = `${o}`;
      break;
  }
  return y("div", {
    style: l
  }, null);
}
const qr = 10;
const Qr = we({
  compatConfig: {
    MODE: 3
  },
  name: "Tree",
  inheritAttrs: false,
  props: kt(Xo(), {
    prefixCls: "vc-tree",
    showLine: false,
    showIcon: true,
    selectable: true,
    multiple: false,
    checkable: false,
    disabled: false,
    checkStrictly: false,
    draggable: false,
    expandAction: false,
    defaultExpandParent: true,
    autoExpandParent: false,
    defaultExpandAll: false,
    defaultExpandedKeys: [],
    defaultCheckedKeys: [],
    defaultSelectedKeys: [],
    dropIndicatorRender: Yr,
    allowDrop: () => true
  }),
  setup(e, t) {
    let {
      attrs: n,
      slots: o,
      expose: l
    } = t;
    const a = Z(false);
    let r = {};
    const i = Z();
    const s = Z([]);
    const f = Z([]);
    const d = Z([]);
    const c = Z([]);
    const m = Z([]);
    const C = Z([]);
    const w = {};
    const v = it({
      draggingNodeKey: null,
      dragChildrenKeys: [],
      dropTargetKey: null,
      dropPosition: null,
      dropContainerKey: null,
      dropLevelOffset: null,
      dropTargetPos: null,
      dropAllowed: true,
      dragOverNodeKey: null
    });
    const u = Z([]);
    Re([() => e.treeData, () => e.children], () => {
      u.value = e.treeData !== undefined ? e.treeData.slice() : rn(Vn(e.children));
    }, {
      immediate: true,
      deep: true
    });
    const h = Z({});
    const $ = Z(false);
    const p = Z(null);
    const P = Z(false);
    const I = S(() => Mt(e.fieldNames));
    const H = Z();
    let N = null;
    let F = null;
    let b = null;
    const K = S(() => ({
      expandedKeysSet: _.value,
      selectedKeysSet: B.value,
      loadedKeysSet: A.value,
      loadingKeysSet: le.value,
      checkedKeysSet: ae.value,
      halfCheckedKeysSet: fe.value,
      dragOverNodeKey: v.dragOverNodeKey,
      dropPosition: v.dropPosition,
      keyEntities: h.value
    }));
    const _ = S(() => new Set(C.value));
    const B = S(() => new Set(s.value));
    const A = S(() => new Set(c.value));
    const le = S(() => new Set(m.value));
    const ae = S(() => new Set(f.value));
    const fe = S(() => new Set(d.value));
    De(() => {
      if (u.value) {
        const E = Pn(u.value, {
          fieldNames: I.value
        });
        h.value = x({
          [mt]: pl
        }, E.keyEntities);
      }
    });
    let Se = false;
    Re([() => e.expandedKeys, () => e.autoExpandParent, h], (E, T) => {
      let [D, L] = E;
      let [q, te] = T;
      let W = C.value;
      if (e.expandedKeys !== undefined || Se && L !== te) {
        W = e.autoExpandParent || !Se && e.defaultExpandParent ? an(e.expandedKeys, h.value) : e.expandedKeys;
      } else if (!Se && e.defaultExpandAll) {
        const pe = x({}, h.value);
        delete pe[mt];
        W = Object.keys(pe).map(ge => pe[ge].key);
      } else if (!Se && e.defaultExpandedKeys) {
        W = e.autoExpandParent || e.defaultExpandParent ? an(e.defaultExpandedKeys, h.value) : e.defaultExpandedKeys;
      }
      if (W) {
        C.value = W;
      }
      Se = true;
    }, {
      immediate: true
    });
    const U = Z([]);
    De(() => {
      U.value = Ta(u.value, C.value, I.value);
    });
    De(() => {
      if (e.selectable) {
        if (e.selectedKeys !== undefined) {
          s.value = Zn(e.selectedKeys, e);
        } else if (!Se && e.defaultSelectedKeys) {
          s.value = Zn(e.defaultSelectedKeys, e);
        }
      }
    });
    const {
      maxLevel: Q,
      levelEntities: M
    } = Yo(h);
    De(() => {
      if (e.checkable) {
        let E;
        if (e.checkedKeys !== undefined) {
          E = Gt(e.checkedKeys) || {};
        } else if (!Se && e.defaultCheckedKeys) {
          E = Gt(e.defaultCheckedKeys) || {};
        } else if (u.value) {
          E = Gt(e.checkedKeys) || {
            checkedKeys: f.value,
            halfCheckedKeys: d.value
          };
        }
        if (E) {
          let {
            checkedKeys: T = [],
            halfCheckedKeys: D = []
          } = E;
          if (!e.checkStrictly) {
            ({
              checkedKeys: T,
              halfCheckedKeys: D
            } = bt(T, true, h.value, Q.value, M.value));
          }
          f.value = T;
          d.value = D;
        }
      }
    });
    De(() => {
      if (e.loadedKeys) {
        c.value = e.loadedKeys;
      }
    });
    const J = () => {
      x(v, {
        dragOverNodeKey: null,
        dropPosition: null,
        dropLevelOffset: null,
        dropTargetKey: null,
        dropContainerKey: null,
        dropTargetPos: null,
        dropAllowed: false
      });
    };
    const R = E => {
      H.value.scrollTo(E);
    };
    Re(() => e.activeKey, () => {
      if (e.activeKey !== undefined) {
        p.value = e.activeKey;
      }
    }, {
      immediate: true
    });
    Re(p, E => {
      dt(() => {
        if (E !== null) {
          R({
            key: E
          });
        }
      });
    }, {
      immediate: true,
      flush: "post"
    });
    const V = E => {
      if (e.expandedKeys === undefined) {
        C.value = E;
      }
    };
    const z = () => {
      if (v.draggingNodeKey !== null) {
        x(v, {
          draggingNodeKey: null,
          dropPosition: null,
          dropContainerKey: null,
          dropTargetKey: null,
          dropLevelOffset: null,
          dropAllowed: true,
          dragOverNodeKey: null
        });
      }
      N = null;
      b = null;
    };
    const ee = (E, T) => {
      const {
        onDragend: D
      } = e;
      v.dragOverNodeKey = null;
      z();
      if (D != null) {
        D({
          event: E,
          node: T.eventData
        });
      }
      F = null;
    };
    const G = E => {
      ee(E, null);
      window.removeEventListener("dragend", G);
    };
    const $e = (E, T) => {
      const {
        onDragstart: D
      } = e;
      const {
        eventKey: L,
        eventData: q
      } = T;
      F = T;
      N = {
        x: E.clientX,
        y: E.clientY
      };
      const te = Xe(C.value, L);
      v.draggingNodeKey = L;
      v.dragChildrenKeys = Ka(L, h.value);
      i.value = H.value.getIndentWidth();
      V(te);
      window.addEventListener("dragend", G);
      if (D) {
        D({
          event: E,
          node: q
        });
      }
    };
    const ce = (E, T) => {
      const {
        onDragenter: D,
        onExpand: L,
        allowDrop: q,
        direction: te
      } = e;
      const {
        pos: W,
        eventKey: pe
      } = T;
      if (b !== pe) {
        b = pe;
      }
      if (!F) {
        J();
        return;
      }
      const {
        dropPosition: ge,
        dropLevelOffset: ve,
        dropTargetKey: he,
        dropContainerKey: ye,
        dropTargetPos: Fe,
        dropAllowed: Ae,
        dragOverNodeKey: He
      } = Qn(E, F, T, i.value, N, q, U.value, h.value, _.value, te);
      if (v.dragChildrenKeys.indexOf(he) !== -1 || !Ae) {
        J();
        return;
      }
      r ||= {};
      Object.keys(r).forEach(Ne => {
        clearTimeout(r[Ne]);
      });
      if (F.eventKey !== T.eventKey) {
        r[W] = window.setTimeout(() => {
          if (v.draggingNodeKey === null) {
            return;
          }
          let Ne = C.value.slice();
          const Ve = h.value[T.eventKey];
          if (Ve && (Ve.children || []).length) {
            Ne = qe(C.value, T.eventKey);
          }
          V(Ne);
          if (L) {
            L(Ne, {
              node: T.eventData,
              expanded: true,
              nativeEvent: E
            });
          }
        }, 800);
      }
      if (F.eventKey === he && ve === 0) {
        J();
        return;
      }
      x(v, {
        dragOverNodeKey: He,
        dropPosition: ge,
        dropLevelOffset: ve,
        dropTargetKey: he,
        dropContainerKey: ye,
        dropTargetPos: Fe,
        dropAllowed: Ae
      });
      if (D) {
        D({
          event: E,
          node: T.eventData,
          expandedKeys: C.value
        });
      }
    };
    const Ke = (E, T) => {
      const {
        onDragover: D,
        allowDrop: L,
        direction: q
      } = e;
      if (!F) {
        return;
      }
      const {
        dropPosition: te,
        dropLevelOffset: W,
        dropTargetKey: pe,
        dropContainerKey: ge,
        dropAllowed: ve,
        dropTargetPos: he,
        dragOverNodeKey: ye
      } = Qn(E, F, T, i.value, N, L, U.value, h.value, _.value, q);
      if (v.dragChildrenKeys.indexOf(pe) === -1 && !!ve) {
        if (F.eventKey === pe && W === 0) {
          if (v.dropPosition !== null || v.dropLevelOffset !== null || v.dropTargetKey !== null || v.dropContainerKey !== null || v.dropTargetPos !== null || v.dropAllowed !== false || v.dragOverNodeKey !== null) {
            J();
          }
        } else if (te !== v.dropPosition || W !== v.dropLevelOffset || pe !== v.dropTargetKey || ge !== v.dropContainerKey || he !== v.dropTargetPos || ve !== v.dropAllowed || ye !== v.dragOverNodeKey) {
          x(v, {
            dropPosition: te,
            dropLevelOffset: W,
            dropTargetKey: pe,
            dropContainerKey: ge,
            dropTargetPos: he,
            dropAllowed: ve,
            dragOverNodeKey: ye
          });
        }
        if (D) {
          D({
            event: E,
            node: T.eventData
          });
        }
      }
    };
    const Oe = (E, T) => {
      if (b === T.eventKey && !E.currentTarget.contains(E.relatedTarget)) {
        J();
        b = null;
      }
      const {
        onDragleave: D
      } = e;
      if (D) {
        D({
          event: E,
          node: T.eventData
        });
      }
    };
    const Ie = function (E, T, D = false) {
      const {
        dragChildrenKeys: q,
        dropPosition: te,
        dropTargetKey: W,
        dropTargetPos: pe,
        dropAllowed: ge
      } = v;
      if (!ge) {
        return;
      }
      const {
        onDrop: ve
      } = e;
      v.dragOverNodeKey = null;
      z();
      if (W === null) {
        return;
      }
      const he = x(x({}, Nt(W, Vn(K.value))), {
        active: O.value?.key === W,
        data: h.value[W].node
      });
      q.indexOf(W);
      const ye = En(pe);
      const Fe = {
        event: E,
        node: Dt(he),
        dragNode: F ? F.eventData : null,
        dragNodesKeys: [F.eventKey].concat(q),
        dropToGap: te !== 0,
        dropPosition: te + Number(ye[ye.length - 1])
      };
      if (!D && ve != null) {
        ve(Fe);
      }
      F = null;
    };
    const _e = (E, T) => {
      const {
        expanded: D,
        key: L
      } = T;
      const q = U.value.filter(W => W.key === L)[0];
      const te = Dt(x(x({}, Nt(L, K.value)), {
        data: q.data
      }));
      V(D ? Xe(C.value, L) : qe(C.value, L));
      ue(E, te);
    };
    const Me = (E, T) => {
      const {
        onClick: D,
        expandAction: L
      } = e;
      if (L === "click") {
        _e(E, T);
      }
      if (D) {
        D(E, T);
      }
    };
    const Ee = (E, T) => {
      const {
        onDblclick: D,
        expandAction: L
      } = e;
      if (L === "doubleclick" || L === "dblclick") {
        _e(E, T);
      }
      if (D) {
        D(E, T);
      }
    };
    const Pe = (E, T) => {
      let D = s.value;
      const {
        onSelect: L,
        multiple: q
      } = e;
      const {
        selected: te
      } = T;
      const W = T[I.value.key];
      const pe = !te;
      if (pe) {
        if (q) {
          D = qe(D, W);
        } else {
          D = [W];
        }
      } else {
        D = Xe(D, W);
      }
      const ge = h.value;
      const ve = D.map(he => {
        const ye = ge[he];
        if (ye) {
          return ye.node;
        } else {
          return null;
        }
      }).filter(he => he);
      if (e.selectedKeys === undefined) {
        s.value = D;
      }
      if (L) {
        L(D, {
          event: "select",
          selected: pe,
          node: T,
          selectedNodes: ve,
          nativeEvent: E
        });
      }
    };
    const j = (E, T, D) => {
      const {
        checkStrictly: L,
        onCheck: q
      } = e;
      const te = T[I.value.key];
      let W;
      const pe = {
        event: "check",
        node: T,
        checked: D,
        nativeEvent: E
      };
      const ge = h.value;
      if (L) {
        const ve = D ? qe(f.value, te) : Xe(f.value, te);
        const he = Xe(d.value, te);
        W = {
          checked: ve,
          halfChecked: he
        };
        pe.checkedNodes = ve.map(ye => ge[ye]).filter(ye => ye).map(ye => ye.node);
        if (e.checkedKeys === undefined) {
          f.value = ve;
        }
      } else {
        let {
          checkedKeys: ve,
          halfCheckedKeys: he
        } = bt([...f.value, te], true, ge, Q.value, M.value);
        if (!D) {
          const ye = new Set(ve);
          ye.delete(te);
          ({
            checkedKeys: ve,
            halfCheckedKeys: he
          } = bt(Array.from(ye), {
            halfCheckedKeys: he
          }, ge, Q.value, M.value));
        }
        W = ve;
        pe.checkedNodes = [];
        pe.checkedNodesPositions = [];
        pe.halfCheckedKeys = he;
        ve.forEach(ye => {
          const Fe = ge[ye];
          if (!Fe) {
            return;
          }
          const {
            node: Ae,
            pos: He
          } = Fe;
          pe.checkedNodes.push(Ae);
          pe.checkedNodesPositions.push({
            node: Ae,
            pos: He
          });
        });
        if (e.checkedKeys === undefined) {
          f.value = ve;
          d.value = he;
        }
      }
      if (q) {
        q(W, pe);
      }
    };
    const se = E => {
      const T = E[I.value.key];
      const D = new Promise((L, q) => {
        const {
          loadData: te,
          onLoad: W
        } = e;
        if (!te || A.value.has(T) || le.value.has(T)) {
          return null;
        }
        te(E).then(() => {
          const ge = qe(c.value, T);
          const ve = Xe(m.value, T);
          if (W) {
            W(ge, {
              event: "load",
              node: E
            });
          }
          if (e.loadedKeys === undefined) {
            c.value = ge;
          }
          m.value = ve;
          L();
        }).catch(ge => {
          const ve = Xe(m.value, T);
          m.value = ve;
          w[T] = (w[T] || 0) + 1;
          if (w[T] >= qr) {
            const he = qe(c.value, T);
            if (e.loadedKeys === undefined) {
              c.value = he;
            }
            L();
          }
          q(ge);
        });
        m.value = qe(m.value, T);
      });
      D.catch(() => {});
      return D;
    };
    const X = (E, T) => {
      const {
        onMouseenter: D
      } = e;
      if (D) {
        D({
          event: E,
          node: T
        });
      }
    };
    const oe = (E, T) => {
      const {
        onMouseleave: D
      } = e;
      if (D) {
        D({
          event: E,
          node: T
        });
      }
    };
    const ie = (E, T) => {
      const {
        onRightClick: D
      } = e;
      if (D) {
        E.preventDefault();
        D({
          event: E,
          node: T
        });
      }
    };
    const xe = E => {
      const {
        onFocus: T
      } = e;
      $.value = true;
      if (T) {
        T(E);
      }
    };
    const re = E => {
      const {
        onBlur: T
      } = e;
      $.value = false;
      g(null);
      if (T) {
        T(E);
      }
    };
    const ue = (E, T) => {
      let D = C.value;
      const {
        onExpand: L,
        loadData: q
      } = e;
      const {
        expanded: te
      } = T;
      const W = T[I.value.key];
      if (P.value) {
        return;
      }
      D.indexOf(W);
      const pe = !te;
      if (pe) {
        D = qe(D, W);
      } else {
        D = Xe(D, W);
      }
      V(D);
      if (L) {
        L(D, {
          node: T,
          expanded: pe,
          nativeEvent: E
        });
      }
      if (pe && q) {
        const ge = se(T);
        if (ge) {
          ge.then(() => {}).catch(ve => {
            const he = Xe(C.value, W);
            V(he);
            Promise.reject(ve);
          });
        }
      }
    };
    const ke = () => {
      P.value = true;
    };
    const k = () => {
      setTimeout(() => {
        P.value = false;
      });
    };
    const g = E => {
      const {
        onActiveChange: T
      } = e;
      if (p.value !== E) {
        if (e.activeKey !== undefined) {
          p.value = E;
        }
        if (E !== null) {
          R({
            key: E
          });
        }
        if (T) {
          T(E);
        }
      }
    };
    const O = S(() => p.value === null ? null : U.value.find(E => {
      let {
        key: T
      } = E;
      return T === p.value;
    }) || null);
    const Y = E => {
      let T = U.value.findIndex(L => {
        let {
          key: q
        } = L;
        return q === p.value;
      });
      if (T === -1 && E < 0) {
        T = U.value.length;
      }
      T = (T + E + U.value.length) % U.value.length;
      const D = U.value[T];
      if (D) {
        const {
          key: L
        } = D;
        g(L);
      } else {
        g(null);
      }
    };
    const de = S(() => Dt(x(x({}, Nt(p.value, K.value)), {
      data: O.value.data,
      active: true
    })));
    const me = E => {
      const {
        onKeydown: T,
        checkable: D,
        selectable: L
      } = e;
      switch (E.which) {
        case lt.UP:
          {
            Y(-1);
            E.preventDefault();
            break;
          }
        case lt.DOWN:
          {
            Y(1);
            E.preventDefault();
            break;
          }
      }
      const q = O.value;
      if (q && q.data) {
        const te = q.data.isLeaf === false || !!(q.data.children || []).length;
        const W = de.value;
        switch (E.which) {
          case lt.LEFT:
            {
              if (te && _.value.has(p.value)) {
                ue({}, W);
              } else if (q.parent) {
                g(q.parent.key);
              }
              E.preventDefault();
              break;
            }
          case lt.RIGHT:
            {
              if (te && !_.value.has(p.value)) {
                ue({}, W);
              } else if (q.children && q.children.length) {
                g(q.children[0].key);
              }
              E.preventDefault();
              break;
            }
          case lt.ENTER:
          case lt.SPACE:
            {
              if (D && !W.disabled && W.checkable !== false && !W.disableCheckbox) {
                j({}, W, !ae.value.has(p.value));
              } else if (!D && L && !W.disabled && W.selectable !== false) {
                Pe({}, W);
              }
              break;
            }
        }
      }
      if (T) {
        T(E);
      }
    };
    l({
      onNodeExpand: ue,
      scrollTo: R,
      onKeydown: me,
      selectedKeys: S(() => s.value),
      checkedKeys: S(() => f.value),
      halfCheckedKeys: S(() => d.value),
      loadedKeys: S(() => c.value),
      loadingKeys: S(() => m.value),
      expandedKeys: S(() => C.value)
    });
    Fo(() => {
      window.removeEventListener("dragend", G);
      a.value = true;
    });
    xa({
      expandedKeys: C,
      selectedKeys: s,
      loadedKeys: c,
      loadingKeys: m,
      checkedKeys: f,
      halfCheckedKeys: d,
      expandedKeysSet: _,
      selectedKeysSet: B,
      loadedKeysSet: A,
      loadingKeysSet: le,
      checkedKeysSet: ae,
      halfCheckedKeysSet: fe,
      flattenNodes: U
    });
    return () => {
      const {
        draggingNodeKey: E,
        dropLevelOffset: T,
        dropContainerKey: D,
        dropTargetKey: L,
        dropPosition: q,
        dragOverNodeKey: te
      } = v;
      const {
        prefixCls: W,
        showLine: pe,
        focusable: ge,
        tabindex: ve = 0,
        selectable: he,
        showIcon: ye,
        icon: Fe = o.icon,
        switcherIcon: Ae,
        draggable: He,
        checkable: Ne,
        checkStrictly: Ve,
        disabled: nt,
        motion: ut,
        loadData: Et,
        filterTreeNode: ot,
        height: Xt,
        itemHeight: Pt,
        virtual: Ct,
        dropIndicatorRender: wl,
        onContextmenu: $l,
        onScroll: kl,
        direction: Kl,
        rootClassName: Ol,
        rootStyle: El
      } = e;
      const {
        class: Pl,
        style: Tl
      } = n;
      const Il = $n(x(x({}, e), n), {
        aria: true,
        data: true
      });
      let St;
      if (He) {
        if (typeof He == "object") {
          St = He;
        } else if (typeof He == "function") {
          St = {
            nodeDraggable: He
          };
        } else {
          St = {};
        }
      } else {
        St = false;
      }
      return y(ba, {
        value: {
          prefixCls: W,
          selectable: he,
          showIcon: ye,
          icon: Fe,
          switcherIcon: Ae,
          draggable: St,
          draggingNodeKey: E,
          checkable: Ne,
          customCheckable: o.checkable,
          checkStrictly: Ve,
          disabled: nt,
          keyEntities: h.value,
          dropLevelOffset: T,
          dropContainerKey: D,
          dropTargetKey: L,
          dropPosition: q,
          dragOverNodeKey: te,
          dragging: E !== null,
          indent: i.value,
          direction: Kl,
          dropIndicatorRender: wl,
          loadData: Et,
          filterTreeNode: ot,
          onNodeClick: Me,
          onNodeDoubleClick: Ee,
          onNodeExpand: ue,
          onNodeSelect: Pe,
          onNodeCheck: j,
          onNodeLoad: se,
          onNodeMouseEnter: X,
          onNodeMouseLeave: oe,
          onNodeContextMenu: ie,
          onNodeDragStart: $e,
          onNodeDragEnter: ce,
          onNodeDragOver: Ke,
          onNodeDragLeave: Oe,
          onNodeDragEnd: ee,
          onNodeDrop: Ie,
          slots: o
        }
      }, {
        default: () => [y("div", {
          role: "tree",
          class: be(W, Pl, Ol, {
            [`${W}-show-line`]: pe,
            [`${W}-focused`]: $.value,
            [`${W}-active-focused`]: p.value !== null
          }),
          style: El
        }, [y(Gr, ne({
          ref: H,
          prefixCls: W,
          style: Tl,
          disabled: nt,
          selectable: he,
          checkable: !!Ne,
          motion: ut,
          height: Xt,
          itemHeight: Pt,
          virtual: Ct,
          focusable: ge,
          focused: $.value,
          tabindex: ve,
          activeItem: O.value,
          onFocus: xe,
          onBlur: re,
          onKeydown: me,
          onActiveChange: g,
          onListChangeStart: ke,
          onListChangeEnd: k,
          onContextmenu: $l,
          onScroll: kl
        }, Il), null)])]
      });
    };
  }
});
var Zr = {
  icon: {
    tag: "svg",
    attrs: {
      viewBox: "64 64 896 896",
      focusable: "false"
    },
    children: [{
      tag: "path",
      attrs: {
        d: "M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494z"
      }
    }]
  },
  name: "file",
  theme: "outlined"
};
function xo(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? Object(arguments[t]) : {};
    var o = Object.keys(n);
    if (typeof Object.getOwnPropertySymbols == "function") {
      o = o.concat(Object.getOwnPropertySymbols(n).filter(function (l) {
        return Object.getOwnPropertyDescriptor(n, l).enumerable;
      }));
    }
    o.forEach(function (l) {
      Jr(e, l, n[l]);
    });
  }
  return e;
}
function Jr(e, t, n) {
  if (t in e) {
    Object.defineProperty(e, t, {
      value: n,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    e[t] = n;
  }
  return e;
}
function Wt(t, n) {
  var o = xo({}, t, n.attrs);
  return y(tt, xo({}, o, {
    icon: Zr
  }), null);
}
Wt.displayName = "FileOutlined";
Wt.inheritAttrs = false;
var ei = {
  icon: {
    tag: "svg",
    attrs: {
      viewBox: "64 64 896 896",
      focusable: "false"
    },
    children: [{
      tag: "path",
      attrs: {
        d: "M328 544h368c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z"
      }
    }, {
      tag: "path",
      attrs: {
        d: "M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"
      }
    }]
  },
  name: "minus-square",
  theme: "outlined"
};
function Co(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? Object(arguments[t]) : {};
    var o = Object.keys(n);
    if (typeof Object.getOwnPropertySymbols == "function") {
      o = o.concat(Object.getOwnPropertySymbols(n).filter(function (l) {
        return Object.getOwnPropertyDescriptor(n, l).enumerable;
      }));
    }
    o.forEach(function (l) {
      ti(e, l, n[l]);
    });
  }
  return e;
}
function ti(e, t, n) {
  if (t in e) {
    Object.defineProperty(e, t, {
      value: n,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    e[t] = n;
  }
  return e;
}
function Fn(t, n) {
  var o = Co({}, t, n.attrs);
  return y(tt, Co({}, o, {
    icon: ei
  }), null);
}
Fn.displayName = "MinusSquareOutlined";
Fn.inheritAttrs = false;
var ni = {
  icon: {
    tag: "svg",
    attrs: {
      viewBox: "64 64 896 896",
      focusable: "false"
    },
    children: [{
      tag: "path",
      attrs: {
        d: "M328 544h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z"
      }
    }, {
      tag: "path",
      attrs: {
        d: "M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"
      }
    }]
  },
  name: "plus-square",
  theme: "outlined"
};
function So(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? Object(arguments[t]) : {};
    var o = Object.keys(n);
    if (typeof Object.getOwnPropertySymbols == "function") {
      o = o.concat(Object.getOwnPropertySymbols(n).filter(function (l) {
        return Object.getOwnPropertyDescriptor(n, l).enumerable;
      }));
    }
    o.forEach(function (l) {
      oi(e, l, n[l]);
    });
  }
  return e;
}
function oi(e, t, n) {
  if (t in e) {
    Object.defineProperty(e, t, {
      value: n,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    e[t] = n;
  }
  return e;
}
function Bn(t, n) {
  var o = So({}, t, n.attrs);
  return y(tt, So({}, o, {
    icon: ni
  }), null);
}
Bn.displayName = "PlusSquareOutlined";
Bn.inheritAttrs = false;
var li = {
  icon: {
    tag: "svg",
    attrs: {
      viewBox: "0 0 1024 1024",
      focusable: "false"
    },
    children: [{
      tag: "path",
      attrs: {
        d: "M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"
      }
    }]
  },
  name: "caret-down",
  theme: "filled"
};
function wo(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? Object(arguments[t]) : {};
    var o = Object.keys(n);
    if (typeof Object.getOwnPropertySymbols == "function") {
      o = o.concat(Object.getOwnPropertySymbols(n).filter(function (l) {
        return Object.getOwnPropertyDescriptor(n, l).enumerable;
      }));
    }
    o.forEach(function (l) {
      ai(e, l, n[l]);
    });
  }
  return e;
}
function ai(e, t, n) {
  if (t in e) {
    Object.defineProperty(e, t, {
      value: n,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    e[t] = n;
  }
  return e;
}
function An(t, n) {
  var o = wo({}, t, n.attrs);
  return y(tt, wo({}, o, {
    icon: li
  }), null);
}
An.displayName = "CaretDownFilled";
An.inheritAttrs = false;
function ri(e, t, n, o, l) {
  const {
    isLeaf: a,
    expanded: r,
    loading: i
  } = n;
  let s = t;
  if (i) {
    return y(ql, {
      class: `${e}-switcher-loading-icon`
    }, null);
  }
  let f;
  if (l && typeof l == "object") {
    f = l.showLeafIcon;
  }
  let d = null;
  const c = `${e}-switcher-icon`;
  if (a) {
    if (l) {
      if (f && o) {
        return o(n);
      } else {
        if (typeof l == "object" && !f) {
          d = y("span", {
            class: `${e}-switcher-leaf-line`
          }, null);
        } else {
          d = y(Wt, {
            class: `${e}-switcher-line-icon`
          }, null);
        }
        return d;
      }
    } else {
      return null;
    }
  } else {
    d = y(An, {
      class: c
    }, null);
    if (l) {
      d = r ? y(Fn, {
        class: `${e}-switcher-line-icon`
      }, null) : y(Bn, {
        class: `${e}-switcher-line-icon`
      }, null);
    }
    if (typeof t == "function") {
      s = t(x(x({}, n), {
        defaultIcon: d,
        switcherCls: c
      }));
    } else if (_o(s)) {
      s = Ql(s, {
        class: c
      });
    }
    return s || d;
  }
}
const $o = 4;
function ii(e) {
  const {
    dropPosition: t,
    dropLevelOffset: n,
    prefixCls: o,
    indent: l,
    direction: a = "ltr"
  } = e;
  const r = a === "ltr" ? "left" : "right";
  const i = a === "ltr" ? "right" : "left";
  const s = {
    [r]: `${-n * l + $o}px`,
    [i]: 0
  };
  switch (t) {
    case -1:
      s.top = "-3px";
      break;
    case 1:
      s.bottom = "-3px";
      break;
    default:
      s.bottom = "-3px";
      s[r] = `${l + $o}px`;
      break;
  }
  return y("div", {
    style: s,
    class: `${o}-drop-indicator`
  }, null);
}
const si = new Zl("ant-tree-node-fx-do-not-use", {
  "0%": {
    opacity: 0
  },
  "100%": {
    opacity: 1
  }
});
const ci = (e, t) => ({
  [`.${e}-switcher-icon`]: {
    display: "inline-block",
    fontSize: 10,
    verticalAlign: "baseline",
    svg: {
      transition: `transform ${t.motionDurationSlow}`
    }
  }
});
const di = (e, t) => ({
  [`.${e}-drop-indicator`]: {
    position: "absolute",
    zIndex: 1,
    height: 2,
    backgroundColor: t.colorPrimary,
    borderRadius: 1,
    pointerEvents: "none",
    "&:after": {
      position: "absolute",
      top: -3,
      insetInlineStart: -6,
      width: 8,
      height: 8,
      backgroundColor: "transparent",
      border: `${t.lineWidthBold}px solid ${t.colorPrimary}`,
      borderRadius: "50%",
      content: "\"\""
    }
  }
});
const ui = (e, t) => {
  const {
    treeCls: n,
    treeNodeCls: o,
    treeNodePadding: l,
    treeTitleHeight: a
  } = t;
  const r = (a - t.fontSizeLG) / 2;
  const i = t.paddingXS;
  return {
    [n]: x(x({}, Kn(t)), {
      background: t.colorBgContainer,
      borderRadius: t.borderRadius,
      transition: `background-color ${t.motionDurationSlow}`,
      [`&${n}-rtl`]: {
        [`${n}-switcher`]: {
          "&_close": {
            [`${n}-switcher-icon`]: {
              svg: {
                transform: "rotate(90deg)"
              }
            }
          }
        }
      },
      [`&-focused:not(:hover):not(${n}-active-focused)`]: x({}, Xn(t)),
      [`${n}-list-holder-inner`]: {
        alignItems: "flex-start"
      },
      [`&${n}-block-node`]: {
        [`${n}-list-holder-inner`]: {
          alignItems: "stretch",
          [`${n}-node-content-wrapper`]: {
            flex: "auto"
          },
          [`${o}.dragging`]: {
            position: "relative",
            "&:after": {
              position: "absolute",
              top: 0,
              insetInlineEnd: 0,
              bottom: l,
              insetInlineStart: 0,
              border: `1px solid ${t.colorPrimary}`,
              opacity: 0,
              animationName: si,
              animationDuration: t.motionDurationSlow,
              animationPlayState: "running",
              animationFillMode: "forwards",
              content: "\"\"",
              pointerEvents: "none"
            }
          }
        }
      },
      [`${o}`]: {
        display: "flex",
        alignItems: "flex-start",
        padding: `0 0 ${l}px 0`,
        outline: "none",
        "&-rtl": {
          direction: "rtl"
        },
        "&-disabled": {
          [`${n}-node-content-wrapper`]: {
            color: t.colorTextDisabled,
            cursor: "not-allowed",
            "&:hover": {
              background: "transparent"
            }
          }
        },
        [`&-active ${n}-node-content-wrapper`]: x({}, Xn(t)),
        [`&:not(${o}-disabled).filter-node ${n}-title`]: {
          color: "inherit",
          fontWeight: 500
        },
        "&-draggable": {
          [`${n}-draggable-icon`]: {
            width: a,
            lineHeight: `${a}px`,
            textAlign: "center",
            visibility: "visible",
            opacity: 0.2,
            transition: `opacity ${t.motionDurationSlow}`,
            [`${o}:hover &`]: {
              opacity: 0.45
            }
          },
          [`&${o}-disabled`]: {
            [`${n}-draggable-icon`]: {
              visibility: "hidden"
            }
          }
        }
      },
      [`${n}-indent`]: {
        alignSelf: "stretch",
        whiteSpace: "nowrap",
        userSelect: "none",
        "&-unit": {
          display: "inline-block",
          width: a
        }
      },
      [`${n}-draggable-icon`]: {
        visibility: "hidden"
      },
      [`${n}-switcher`]: x(x({}, ci(e, t)), {
        position: "relative",
        flex: "none",
        alignSelf: "stretch",
        width: a,
        margin: 0,
        lineHeight: `${a}px`,
        textAlign: "center",
        cursor: "pointer",
        userSelect: "none",
        "&-noop": {
          cursor: "default"
        },
        "&_close": {
          [`${n}-switcher-icon`]: {
            svg: {
              transform: "rotate(-90deg)"
            }
          }
        },
        "&-loading-icon": {
          color: t.colorPrimary
        },
        "&-leaf-line": {
          position: "relative",
          zIndex: 1,
          display: "inline-block",
          width: "100%",
          height: "100%",
          "&:before": {
            position: "absolute",
            top: 0,
            insetInlineEnd: a / 2,
            bottom: -l,
            marginInlineStart: -1,
            borderInlineEnd: `1px solid ${t.colorBorder}`,
            content: "\"\""
          },
          "&:after": {
            position: "absolute",
            width: a / 2 * 0.8,
            height: a / 2,
            borderBottom: `1px solid ${t.colorBorder}`,
            content: "\"\""
          }
        }
      }),
      [`${n}-checkbox`]: {
        top: "initial",
        marginInlineEnd: i,
        marginBlockStart: r
      },
      [`${n}-node-content-wrapper, ${n}-checkbox + span`]: {
        position: "relative",
        zIndex: "auto",
        minHeight: a,
        margin: 0,
        padding: `0 ${t.paddingXS / 2}px`,
        color: "inherit",
        lineHeight: `${a}px`,
        background: "transparent",
        borderRadius: t.borderRadius,
        cursor: "pointer",
        transition: `all ${t.motionDurationMid}, border 0s, line-height 0s, box-shadow 0s`,
        "&:hover": {
          backgroundColor: t.controlItemBgHover
        },
        [`&${n}-node-selected`]: {
          backgroundColor: t.controlItemBgActive
        },
        [`${n}-iconEle`]: {
          display: "inline-block",
          width: a,
          height: a,
          lineHeight: `${a}px`,
          textAlign: "center",
          verticalAlign: "top",
          "&:empty": {
            display: "none"
          }
        }
      },
      [`${n}-unselectable ${n}-node-content-wrapper:hover`]: {
        backgroundColor: "transparent"
      },
      [`${n}-node-content-wrapper`]: x({
        lineHeight: `${a}px`,
        userSelect: "none"
      }, di(e, t)),
      [`${o}.drop-container`]: {
        "> [draggable]": {
          boxShadow: `0 0 0 2px ${t.colorPrimary}`
        }
      },
      "&-show-line": {
        [`${n}-indent`]: {
          "&-unit": {
            position: "relative",
            height: "100%",
            "&:before": {
              position: "absolute",
              top: 0,
              insetInlineEnd: a / 2,
              bottom: -l,
              borderInlineEnd: `1px solid ${t.colorBorder}`,
              content: "\"\""
            },
            "&-end": {
              "&:before": {
                display: "none"
              }
            }
          }
        },
        [`${n}-switcher`]: {
          background: "transparent",
          "&-line-icon": {
            verticalAlign: "-0.15em"
          }
        }
      },
      [`${o}-leaf-last`]: {
        [`${n}-switcher`]: {
          "&-leaf-line": {
            "&:before": {
              top: "auto !important",
              bottom: "auto !important",
              height: `${a / 2}px !important`
            }
          }
        }
      }
    })
  };
};
const fi = e => {
  const {
    treeCls: t,
    treeNodeCls: n,
    treeNodePadding: o
  } = e;
  return {
    [`${t}${t}-directory`]: {
      [n]: {
        position: "relative",
        "&:before": {
          position: "absolute",
          top: 0,
          insetInlineEnd: 0,
          bottom: o,
          insetInlineStart: 0,
          transition: `background-color ${e.motionDurationMid}`,
          content: "\"\"",
          pointerEvents: "none"
        },
        "&:hover": {
          "&:before": {
            background: e.controlItemBgHover
          }
        },
        "> *": {
          zIndex: 1
        },
        [`${t}-switcher`]: {
          transition: `color ${e.motionDurationMid}`
        },
        [`${t}-node-content-wrapper`]: {
          borderRadius: 0,
          userSelect: "none",
          "&:hover": {
            background: "transparent"
          },
          [`&${t}-node-selected`]: {
            color: e.colorTextLightSolid,
            background: "transparent"
          }
        },
        "&-selected": {
          "\n            &:hover::before,\n            &::before\n          ": {
            background: e.colorPrimary
          },
          [`${t}-switcher`]: {
            color: e.colorTextLightSolid
          },
          [`${t}-node-content-wrapper`]: {
            color: e.colorTextLightSolid,
            background: "transparent"
          }
        }
      }
    }
  };
};
const vi = (e, t) => {
  const n = `.${e}`;
  const o = `${n}-treenode`;
  const l = t.paddingXS / 2;
  const a = t.controlHeightSM;
  const r = Lo(t, {
    treeCls: n,
    treeNodeCls: o,
    treeNodePadding: l,
    treeTitleHeight: a
  });
  return [ui(e, r), fi(r)];
};
const pi = Ao("Tree", (e, t) => {
  let {
    prefixCls: n
  } = t;
  return [{
    [e.componentCls]: ca(`${n}-checkbox`, e)
  }, vi(n, e), ua(e)];
});
const hl = () => {
  const e = Xo();
  return x(x({}, e), {
    showLine: je([Boolean, Object]),
    multiple: Le(),
    autoExpandParent: Le(),
    checkStrictly: Le(),
    checkable: Le(),
    disabled: Le(),
    defaultExpandAll: Le(),
    defaultExpandParent: Le(),
    defaultExpandedKeys: We(),
    expandedKeys: We(),
    checkedKeys: je([Array, Object]),
    defaultCheckedKeys: We(),
    selectedKeys: We(),
    defaultSelectedKeys: We(),
    selectable: Le(),
    loadedKeys: We(),
    draggable: Le(),
    showIcon: Le(),
    icon: Te(),
    switcherIcon: Je.any,
    prefixCls: String,
    replaceFields: vt(),
    blockNode: Le(),
    openAnimation: Je.any,
    onDoubleclick: e.onDblclick,
    "onUpdate:selectedKeys": Te(),
    "onUpdate:checkedKeys": Te(),
    "onUpdate:expandedKeys": Te()
  });
};
const _t = we({
  compatConfig: {
    MODE: 3
  },
  name: "ATree",
  inheritAttrs: false,
  props: kt(hl(), {
    checkable: false,
    selectable: true,
    showIcon: false,
    blockNode: false
  }),
  slots: Object,
  setup(e, t) {
    let {
      attrs: n,
      expose: o,
      emit: l,
      slots: a
    } = t;
    Io(e.treeData !== undefined || !a.default);
    const {
      prefixCls: r,
      direction: i,
      virtual: s
    } = Ht("tree", e);
    const [f, d] = pi(r);
    const c = Ce();
    o({
      treeRef: c,
      onNodeExpand: function () {
        var u;
        if ((u = c.value) !== null && u !== undefined) {
          u.onNodeExpand(...arguments);
        }
      },
      scrollTo: u => {
        var h;
        if ((h = c.value) !== null && h !== undefined) {
          h.scrollTo(u);
        }
      },
      selectedKeys: S(() => {
        return c.value?.selectedKeys;
      }),
      checkedKeys: S(() => {
        return c.value?.checkedKeys;
      }),
      halfCheckedKeys: S(() => {
        return c.value?.halfCheckedKeys;
      }),
      loadedKeys: S(() => {
        return c.value?.loadedKeys;
      }),
      loadingKeys: S(() => {
        return c.value?.loadingKeys;
      }),
      expandedKeys: S(() => {
        return c.value?.expandedKeys;
      })
    });
    De(() => {
      et(e.replaceFields === undefined, "Tree", "`replaceFields` is deprecated, please use fieldNames instead");
    });
    const C = (u, h) => {
      l("update:checkedKeys", u);
      l("check", u, h);
    };
    const w = (u, h) => {
      l("update:expandedKeys", u);
      l("expand", u, h);
    };
    const v = (u, h) => {
      l("update:selectedKeys", u);
      l("select", u, h);
    };
    return () => {
      const {
        showIcon: u,
        showLine: h,
        switcherIcon: $ = a.switcherIcon,
        icon: p = a.icon,
        blockNode: P,
        checkable: I,
        selectable: H,
        fieldNames: N = e.replaceFields,
        motion: F = e.openAnimation,
        itemHeight: b = 28,
        onDoubleclick: K,
        onDblclick: _
      } = e;
      const B = x(x(x({}, n), Lt(e, ["onUpdate:checkedKeys", "onUpdate:expandedKeys", "onUpdate:selectedKeys", "onDoubleclick"])), {
        showLine: !!h,
        dropIndicatorRender: ii,
        fieldNames: N,
        icon: p,
        itemHeight: b
      });
      const A = a.default ? $t(a.default()) : undefined;
      return f(y(Qr, ne(ne({}, B), {}, {
        virtual: s.value,
        motion: F,
        ref: c,
        prefixCls: r.value,
        class: be({
          [`${r.value}-icon-hide`]: !u,
          [`${r.value}-block-node`]: P,
          [`${r.value}-unselectable`]: !H,
          [`${r.value}-rtl`]: i.value === "rtl"
        }, n.class, d.value),
        direction: i.value,
        checkable: I,
        selectable: H,
        switcherIcon: le => ri(r.value, $, le, a.leafIcon, h),
        onCheck: C,
        onExpand: w,
        onSelect: v,
        onDblclick: _ || K,
        children: A
      }), x(x({}, a), {
        checkable: () => y("span", {
          class: `${r.value}-checkbox-inner`
        }, null)
      })));
    };
  }
});
var hi = {
  icon: {
    tag: "svg",
    attrs: {
      viewBox: "64 64 896 896",
      focusable: "false"
    },
    children: [{
      tag: "path",
      attrs: {
        d: "M928 444H820V330.4c0-17.7-14.3-32-32-32H473L355.7 186.2a8.15 8.15 0 00-5.5-2.2H96c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h698c13 0 24.8-7.9 29.7-20l134-332c1.5-3.8 2.3-7.9 2.3-12 0-17.7-14.3-32-32-32zM136 256h188.5l119.6 114.4H748V444H238c-13 0-24.8 7.9-29.7 20L136 643.2V256zm635.3 512H159l103.3-256h612.4L771.3 768z"
      }
    }]
  },
  name: "folder-open",
  theme: "outlined"
};
function ko(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? Object(arguments[t]) : {};
    var o = Object.keys(n);
    if (typeof Object.getOwnPropertySymbols == "function") {
      o = o.concat(Object.getOwnPropertySymbols(n).filter(function (l) {
        return Object.getOwnPropertyDescriptor(n, l).enumerable;
      }));
    }
    o.forEach(function (l) {
      yi(e, l, n[l]);
    });
  }
  return e;
}
function yi(e, t, n) {
  if (t in e) {
    Object.defineProperty(e, t, {
      value: n,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    e[t] = n;
  }
  return e;
}
function Ln(t, n) {
  var o = ko({}, t, n.attrs);
  return y(tt, ko({}, o, {
    icon: hi
  }), null);
}
Ln.displayName = "FolderOpenOutlined";
Ln.inheritAttrs = false;
var mi = {
  icon: {
    tag: "svg",
    attrs: {
      viewBox: "64 64 896 896",
      focusable: "false"
    },
    children: [{
      tag: "path",
      attrs: {
        d: "M880 298.4H521L403.7 186.2a8.15 8.15 0 00-5.5-2.2H144c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V330.4c0-17.7-14.3-32-32-32zM840 768H184V256h188.5l119.6 114.4H840V768z"
      }
    }]
  },
  name: "folder",
  theme: "outlined"
};
function Ko(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? Object(arguments[t]) : {};
    var o = Object.keys(n);
    if (typeof Object.getOwnPropertySymbols == "function") {
      o = o.concat(Object.getOwnPropertySymbols(n).filter(function (l) {
        return Object.getOwnPropertyDescriptor(n, l).enumerable;
      }));
    }
    o.forEach(function (l) {
      gi(e, l, n[l]);
    });
  }
  return e;
}
function gi(e, t, n) {
  if (t in e) {
    Object.defineProperty(e, t, {
      value: n,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    e[t] = n;
  }
  return e;
}
function Hn(t, n) {
  var o = Ko({}, t, n.attrs);
  return y(tt, Ko({}, o, {
    icon: mi
  }), null);
}
Hn.displayName = "FolderOutlined";
Hn.inheritAttrs = false;
var Ze;
(function (e) {
  e[e.None = 0] = "None";
  e[e.Start = 1] = "Start";
  e[e.End = 2] = "End";
})(Ze ||= {});
function Mn(e, t, n) {
  function o(l) {
    const a = l[t.key];
    const r = l[t.children];
    if (n(a, l) !== false) {
      Mn(r || [], t, n);
    }
  }
  e.forEach(o);
}
function bi(e) {
  let {
    treeData: t,
    expandedKeys: n,
    startKey: o,
    endKey: l,
    fieldNames: a = {
      title: "title",
      key: "key",
      children: "children"
    }
  } = e;
  const r = [];
  let i = Ze.None;
  if (o && o === l) {
    return [o];
  }
  if (!o || !l) {
    return [];
  }
  function s(f) {
    return f === o || f === l;
  }
  Mn(t, a, f => {
    if (i === Ze.End) {
      return false;
    }
    if (s(f)) {
      r.push(f);
      if (i === Ze.None) {
        i = Ze.Start;
      } else if (i === Ze.Start) {
        i = Ze.End;
        return false;
      }
    } else if (i === Ze.Start) {
      r.push(f);
    }
    return n.includes(f);
  });
  return r;
}
function qt(e, t, n) {
  const o = [...t];
  const l = [];
  Mn(e, n, (a, r) => {
    const i = o.indexOf(a);
    if (i !== -1) {
      l.push(r);
      o.splice(i, 1);
    }
    return !!o.length;
  });
  return l;
}
function xi(e, t) {
  var n = {};
  for (var o in e) {
    if (Object.prototype.hasOwnProperty.call(e, o) && t.indexOf(o) < 0) {
      n[o] = e[o];
    }
  }
  if (e != null && typeof Object.getOwnPropertySymbols == "function") {
    for (var l = 0, o = Object.getOwnPropertySymbols(e); l < o.length; l++) {
      if (t.indexOf(o[l]) < 0 && Object.prototype.propertyIsEnumerable.call(e, o[l])) {
        n[o[l]] = e[o[l]];
      }
    }
  }
  return n;
}
const Ci = () => x(x({}, hl()), {
  expandAction: je([Boolean, String])
});
function Si(e) {
  const {
    isLeaf: t,
    expanded: n
  } = e;
  if (t) {
    return y(Wt, null, null);
  } else if (n) {
    return y(Ln, null, null);
  } else {
    return y(Hn, null, null);
  }
}
const Qt = we({
  compatConfig: {
    MODE: 3
  },
  name: "ADirectoryTree",
  inheritAttrs: false,
  props: kt(Ci(), {
    showIcon: true,
    expandAction: "click"
  }),
  slots: Object,
  setup(e, t) {
    let {
      attrs: n,
      slots: o,
      emit: l,
      expose: a
    } = t;
    var r;
    const i = Ce(e.treeData || rn($t((r = o.default) === null || r === undefined ? undefined : r.call(o))));
    Re(() => e.treeData, () => {
      i.value = e.treeData;
    });
    wn(() => {
      dt(() => {
        var b;
        if (e.treeData === undefined && o.default) {
          i.value = rn($t((b = o.default) === null || b === undefined ? undefined : b.call(o)));
        }
      });
    });
    const s = Ce();
    const f = Ce();
    const d = S(() => Mt(e.fieldNames));
    const c = Ce();
    a({
      scrollTo: b => {
        var K;
        if ((K = c.value) !== null && K !== undefined) {
          K.scrollTo(b);
        }
      },
      selectedKeys: S(() => {
        return c.value?.selectedKeys;
      }),
      checkedKeys: S(() => {
        return c.value?.checkedKeys;
      }),
      halfCheckedKeys: S(() => {
        return c.value?.halfCheckedKeys;
      }),
      loadedKeys: S(() => {
        return c.value?.loadedKeys;
      }),
      loadingKeys: S(() => {
        return c.value?.loadingKeys;
      }),
      expandedKeys: S(() => {
        return c.value?.expandedKeys;
      })
    });
    const C = () => {
      const {
        keyEntities: b
      } = Pn(i.value, {
        fieldNames: d.value
      });
      let K;
      if (e.defaultExpandAll) {
        K = Object.keys(b);
      } else if (e.defaultExpandParent) {
        K = an(e.expandedKeys || e.defaultExpandedKeys || [], b);
      } else {
        K = e.expandedKeys || e.defaultExpandedKeys;
      }
      return K;
    };
    const w = Ce(e.selectedKeys || e.defaultSelectedKeys || []);
    const v = Ce(C());
    Re(() => e.selectedKeys, () => {
      if (e.selectedKeys !== undefined) {
        w.value = e.selectedKeys;
      }
    }, {
      immediate: true
    });
    Re(() => e.expandedKeys, () => {
      if (e.expandedKeys !== undefined) {
        v.value = e.expandedKeys;
      }
    }, {
      immediate: true
    });
    const h = fa((b, K) => {
      const {
        isLeaf: _
      } = K;
      if (!_ && !b.shiftKey && !b.metaKey && !b.ctrlKey) {
        c.value.onNodeExpand(b, K);
      }
    }, 200, {
      leading: true
    });
    const $ = (b, K) => {
      if (e.expandedKeys === undefined) {
        v.value = b;
      }
      l("update:expandedKeys", b);
      l("expand", b, K);
    };
    const p = (b, K) => {
      const {
        expandAction: _
      } = e;
      if (_ === "click") {
        h(b, K);
      }
      l("click", b, K);
    };
    const P = (b, K) => {
      const {
        expandAction: _
      } = e;
      if (_ === "dblclick" || _ === "doubleclick") {
        h(b, K);
      }
      l("doubleclick", b, K);
      l("dblclick", b, K);
    };
    const I = (b, K) => {
      const {
        multiple: _
      } = e;
      const {
        node: B,
        nativeEvent: A
      } = K;
      const le = B[d.value.key];
      const ae = x(x({}, K), {
        selected: true
      });
      const fe = (A == null ? undefined : A.ctrlKey) || (A == null ? undefined : A.metaKey);
      const Se = A == null ? undefined : A.shiftKey;
      let U;
      if (_ && fe) {
        U = b;
        s.value = le;
        f.value = U;
        ae.selectedNodes = qt(i.value, U, d.value);
      } else if (_ && Se) {
        U = Array.from(new Set([...(f.value || []), ...bi({
          treeData: i.value,
          expandedKeys: v.value,
          startKey: le,
          endKey: s.value,
          fieldNames: d.value
        })]));
        ae.selectedNodes = qt(i.value, U, d.value);
      } else {
        U = [le];
        s.value = le;
        f.value = U;
        ae.selectedNodes = qt(i.value, U, d.value);
      }
      l("update:selectedKeys", U);
      l("select", U, ae);
      if (e.selectedKeys === undefined) {
        w.value = U;
      }
    };
    const H = (b, K) => {
      l("update:checkedKeys", b);
      l("check", b, K);
    };
    const {
      prefixCls: N,
      direction: F
    } = Ht("tree", e);
    return () => {
      const b = be(`${N.value}-directory`, {
        [`${N.value}-directory-rtl`]: F.value === "rtl"
      }, n.class);
      const {
        icon: K = o.icon,
        blockNode: _ = true
      } = e;
      const B = xi(e, ["icon", "blockNode"]);
      return y(_t, ne(ne(ne({}, n), {}, {
        icon: K || Si,
        ref: c,
        blockNode: _
      }, B), {}, {
        prefixCls: N.value,
        class: b,
        expandedKeys: v.value,
        selectedKeys: w.value,
        onSelect: I,
        onClick: p,
        onDblclick: P,
        onExpand: $,
        onCheck: H
      }), o);
    };
  }
});
const Zt = ln;
const wi = x(_t, {
  DirectoryTree: Qt,
  TreeNode: Zt,
  install: e => {
    e.component(_t.name, _t);
    e.component(Zt.name, Zt);
    e.component(Qt.name, Qt);
    return e;
  }
});
function Oo(e, t, n = false) {
  const o = new Set();
  function l(a, r, i = 1) {
    const s = o.has(a);
    Jl(!s, "Warning: There may be circular references");
    if (s) {
      return false;
    }
    if (a === r) {
      return true;
    }
    if (n && i > 1) {
      return false;
    }
    o.add(a);
    const f = i + 1;
    if (Array.isArray(a)) {
      if (!Array.isArray(r) || a.length !== r.length) {
        return false;
      }
      for (let d = 0; d < a.length; d++) {
        if (!l(a[d], r[d], f)) {
          return false;
        }
      }
      return true;
    }
    if (a && r && typeof a == "object" && typeof r == "object") {
      const d = Object.keys(a);
      if (d.length !== Object.keys(r).length) {
        return false;
      } else {
        return d.every(c => l(a[c], r[c], f));
      }
    }
    return false;
  }
  return l(e, t);
}
const {
  SubMenu: $i,
  Item: ki
} = Bt;
function Ki(e) {
  return e.some(t => {
    let {
      children: n
    } = t;
    return n && n.length > 0;
  });
}
function yl(e, t) {
  if (typeof t == "string" || typeof t == "number") {
    if (t == null) {
      return undefined;
    } else {
      return t.toString().toLowerCase().includes(e.trim().toLowerCase());
    }
  } else {
    return false;
  }
}
function ml(e) {
  let {
    filters: t,
    prefixCls: n,
    filteredKeys: o,
    filterMultiple: l,
    searchValue: a,
    filterSearch: r
  } = e;
  return t.map((i, s) => {
    const f = String(i.value);
    if (i.children) {
      return y($i, {
        key: f || s,
        title: i.text,
        popupClassName: `${n}-dropdown-submenu`
      }, {
        default: () => [ml({
          filters: i.children,
          prefixCls: n,
          filteredKeys: o,
          filterMultiple: l,
          searchValue: a,
          filterSearch: r
        })]
      });
    }
    const d = l ? Ft : Mo;
    const c = y(ki, {
      key: i.value !== undefined ? f : s
    }, {
      default: () => [y(d, {
        checked: o.includes(f)
      }, null), y("span", null, [i.text])]
    });
    if (a.trim()) {
      if (typeof r == "function") {
        if (r(a, i)) {
          return c;
        } else {
          return undefined;
        }
      } else if (yl(a, i.text)) {
        return c;
      } else {
        return undefined;
      }
    } else {
      return c;
    }
  });
}
const Oi = we({
  name: "FilterDropdown",
  props: ["tablePrefixCls", "prefixCls", "dropdownPrefixCls", "column", "filterState", "filterMultiple", "filterMode", "filterSearch", "columnKey", "triggerFilter", "locale", "getPopupContainer"],
  setup(e, t) {
    let {
      slots: n
    } = t;
    const o = Tn();
    const l = S(() => {
      return e.filterMode ?? "menu";
    });
    const a = S(() => {
      return e.filterSearch ?? false;
    });
    const r = S(() => e.column.filterDropdownOpen || e.column.filterDropdownVisible);
    const i = S(() => e.column.onFilterDropdownOpenChange || e.column.onFilterDropdownVisibleChange);
    const s = Z(false);
    const f = S(() => {
      var R;
      return !!e.filterState && ((R = e.filterState.filteredKeys) !== null && R !== undefined && !!R.length || !!e.filterState.forceFiltered);
    });
    const d = S(() => {
      return Vt(e.column?.filters);
    });
    const c = S(() => {
      const {
        filterDropdown: R,
        slots: V = {},
        customFilterDropdown: z
      } = e.column;
      return R || V.filterDropdown && o.value[V.filterDropdown] || z && o.value.customFilterDropdown;
    });
    const m = S(() => {
      const {
        filterIcon: R,
        slots: V = {}
      } = e.column;
      return R || V.filterIcon && o.value[V.filterIcon] || o.value.customFilterIcon;
    });
    const C = R => {
      var V;
      s.value = R;
      if ((V = i.value) !== null && V !== undefined) {
        V.call(i, R);
      }
    };
    const w = S(() => typeof r.value == "boolean" ? r.value : s.value);
    const v = S(() => {
      return e.filterState?.filteredKeys;
    });
    const u = Z([]);
    const h = R => {
      let {
        selectedKeys: V
      } = R;
      u.value = V;
    };
    const $ = (R, V) => {
      let {
        node: z,
        checked: ee
      } = V;
      if (e.filterMultiple) {
        h({
          selectedKeys: R
        });
      } else {
        h({
          selectedKeys: ee && z.key ? [z.key] : []
        });
      }
    };
    Re(v, () => {
      if (s.value) {
        h({
          selectedKeys: v.value || []
        });
      }
    }, {
      immediate: true
    });
    const p = Z([]);
    const P = Z();
    const I = R => {
      P.value = setTimeout(() => {
        p.value = R;
      });
    };
    const H = () => {
      clearTimeout(P.value);
    };
    gt(() => {
      clearTimeout(P.value);
    });
    const N = Z("");
    const F = R => {
      const {
        value: V
      } = R.target;
      N.value = V;
    };
    Re(s, () => {
      if (!s.value) {
        N.value = "";
      }
    });
    const b = R => {
      const {
        column: V,
        columnKey: z,
        filterState: ee
      } = e;
      const G = R && R.length ? R : null;
      if (G === null && (!ee || !ee.filteredKeys) || Oo(G, ee == null ? undefined : ee.filteredKeys, true)) {
        return null;
      }
      e.triggerFilter({
        column: V,
        key: z,
        filteredKeys: G
      });
    };
    const K = () => {
      C(false);
      b(u.value);
    };
    const _ = function ({
      confirm: R,
      closeDropdown: V
    } = {
      confirm: false,
      closeDropdown: false
    }) {
      if (R) {
        b([]);
      }
      if (V) {
        C(false);
      }
      N.value = "";
      if (e.column.filterResetToDefaultFilteredValue) {
        u.value = (e.column.defaultFilteredValue || []).map(z => String(z));
      } else {
        u.value = [];
      }
    };
    const B = function ({
      closeDropdown: R
    } = {
      closeDropdown: true
    }) {
      if (R) {
        C(false);
      }
      b(u.value);
    };
    const A = R => {
      if (R && v.value !== undefined) {
        u.value = v.value || [];
      }
      C(R);
      if (!R && !c.value) {
        K();
      }
    };
    const {
      direction: le
    } = Ht("", e);
    const ae = R => {
      if (R.target.checked) {
        const V = d.value;
        u.value = V;
      } else {
        u.value = [];
      }
    };
    const fe = R => {
      let {
        filters: V
      } = R;
      return (V || []).map((z, ee) => {
        const G = String(z.value);
        const $e = {
          title: z.text,
          key: z.value !== undefined ? G : ee
        };
        if (z.children) {
          $e.children = fe({
            filters: z.children
          });
        }
        return $e;
      });
    };
    const Se = R => {
      var V;
      return x(x({}, R), {
        text: R.title,
        value: R.key,
        children: ((V = R.children) === null || V === undefined ? undefined : V.map(z => Se(z))) || []
      });
    };
    const U = S(() => fe({
      filters: e.column.filters
    }));
    const Q = S(() => be({
      [`${e.dropdownPrefixCls}-menu-without-submenu`]: !Ki(e.column.filters || [])
    }));
    const M = () => {
      const R = u.value;
      const {
        column: V,
        locale: z,
        tablePrefixCls: ee,
        filterMultiple: G,
        dropdownPrefixCls: $e,
        getPopupContainer: ce,
        prefixCls: Ke
      } = e;
      if ((V.filters || []).length === 0) {
        return y(Gn, {
          image: Gn.PRESENTED_IMAGE_SIMPLE,
          description: z.filterEmptyText,
          imageStyle: {
            height: 24
          },
          style: {
            margin: 0,
            padding: "16px 0"
          }
        }, null);
      } else if (l.value === "tree") {
        return y(st, null, [y(fo, {
          filterSearch: a.value,
          value: N.value,
          onChange: F,
          tablePrefixCls: ee,
          locale: z
        }, null), y("div", {
          class: `${ee}-filter-dropdown-tree`
        }, [G ? y(Ft, {
          class: `${ee}-filter-dropdown-checkall`,
          onChange: ae,
          checked: R.length === d.value.length,
          indeterminate: R.length > 0 && R.length < d.value.length
        }, {
          default: () => [z.filterCheckall]
        }) : null, y(wi, {
          checkable: true,
          selectable: false,
          blockNode: true,
          multiple: G,
          checkStrictly: !G,
          class: `${$e}-menu`,
          onCheck: $,
          checkedKeys: R,
          selectedKeys: R,
          showIcon: false,
          treeData: U.value,
          autoExpandParent: true,
          defaultExpandAll: true,
          filterTreeNode: N.value.trim() ? Oe => typeof a.value == "function" ? a.value(N.value, Se(Oe)) : yl(N.value, Oe.title) : undefined
        }, null)])]);
      } else {
        return y(st, null, [y(fo, {
          filterSearch: a.value,
          value: N.value,
          onChange: F,
          tablePrefixCls: ee,
          locale: z
        }, null), y(Bt, {
          multiple: G,
          prefixCls: `${$e}-menu`,
          class: Q.value,
          onClick: H,
          onSelect: h,
          onDeselect: h,
          selectedKeys: R,
          getPopupContainer: ce,
          openKeys: p.value,
          onOpenChange: I
        }, {
          default: () => ml({
            filters: V.filters || [],
            filterSearch: a.value,
            prefixCls: Ke,
            filteredKeys: u.value,
            filterMultiple: G,
            searchValue: N.value
          })
        })]);
      }
    };
    const J = S(() => {
      const R = u.value;
      if (e.column.filterResetToDefaultFilteredValue) {
        return Oo((e.column.defaultFilteredValue || []).map(V => String(V)), R, true);
      } else {
        return R.length === 0;
      }
    });
    return () => {
      var R;
      const {
        tablePrefixCls: V,
        prefixCls: z,
        column: ee,
        dropdownPrefixCls: G,
        locale: $e,
        getPopupContainer: ce
      } = e;
      let Ke;
      if (typeof c.value == "function") {
        Ke = c.value({
          prefixCls: `${G}-custom`,
          setSelectedKeys: _e => h({
            selectedKeys: _e
          }),
          selectedKeys: u.value,
          confirm: B,
          clearFilters: _,
          filters: ee.filters,
          visible: w.value,
          column: ee.__originColumn__,
          close: () => {
            C(false);
          }
        });
      } else if (c.value) {
        Ke = c.value;
      } else {
        Ke = y(st, null, [M(), y("div", {
          class: `${z}-dropdown-btns`
        }, [y(Un, {
          type: "link",
          size: "small",
          disabled: J.value,
          onClick: () => _()
        }, {
          default: () => [$e.filterReset]
        }), y(Un, {
          type: "primary",
          size: "small",
          onClick: K
        }, {
          default: () => [$e.filterConfirm]
        })])]);
      }
      const Oe = y(jr, {
        class: `${z}-dropdown`
      }, {
        default: () => [Ke]
      });
      let Ie;
      if (typeof m.value == "function") {
        Ie = m.value({
          filtered: f.value,
          column: ee.__originColumn__
        });
      } else if (m.value) {
        Ie = m.value;
      } else {
        Ie = y(_n, null, null);
      }
      return y("div", {
        class: `${z}-column`
      }, [y("span", {
        class: `${V}-column-title`
      }, [(R = n.default) === null || R === undefined ? undefined : R.call(n)]), y(Ho, {
        overlay: Oe,
        trigger: ["click"],
        open: w.value,
        onOpenChange: A,
        getPopupContainer: ce,
        placement: le.value === "rtl" ? "bottomLeft" : "bottomRight"
      }, {
        default: () => [y("span", {
          role: "button",
          tabindex: -1,
          class: be(`${z}-trigger`, {
            active: f.value
          }),
          onClick: _e => {
            _e.stopPropagation();
          }
        }, [Ie])]
      })]);
    };
  }
});
function xn(e, t, n) {
  let o = [];
  (e || []).forEach((l, a) => {
    const s = Ot(a, n);
    const f = l.filterDropdown || (l == null ? undefined : l.slots)?.filterDropdown || l.customFilterDropdown;
    if (l.filters || f || "onFilter" in l) {
      if ("filteredValue" in l) {
        let d = l.filteredValue;
        if (!f) {
          d = (d == null ? undefined : d.map(String)) ?? d;
        }
        o.push({
          column: l,
          key: yt(l, s),
          filteredKeys: d,
          forceFiltered: l.filtered
        });
      } else {
        o.push({
          column: l,
          key: yt(l, s),
          filteredKeys: t && l.defaultFilteredValue ? l.defaultFilteredValue : undefined,
          forceFiltered: l.filtered
        });
      }
    }
    if ("children" in l) {
      o = [...o, ...xn(l.children, t, s)];
    }
  });
  return o;
}
function gl(e, t, n, o, l, a, r, i) {
  return n.map((s, f) => {
    const c = Ot(f, i);
    const {
      filterMultiple: m = true,
      filterMode: C,
      filterSearch: w
    } = s;
    let v = s;
    const u = s.filterDropdown || (s == null ? undefined : s.slots)?.filterDropdown || s.customFilterDropdown;
    if (v.filters || u) {
      const h = yt(v, c);
      const $ = o.find(p => {
        let {
          key: P
        } = p;
        return h === P;
      });
      v = x(x({}, v), {
        title: p => y(Oi, {
          tablePrefixCls: e,
          prefixCls: `${e}-filter`,
          dropdownPrefixCls: t,
          column: v,
          columnKey: h,
          filterState: $,
          filterMultiple: m,
          filterMode: C,
          filterSearch: w,
          triggerFilter: a,
          locale: l,
          getPopupContainer: r
        }, {
          default: () => [Rn(s.title, p)]
        })
      });
    }
    if ("children" in v) {
      v = x(x({}, v), {
        children: gl(e, t, v.children, o, l, a, r, c)
      });
    }
    return v;
  });
}
function Vt(e) {
  let t = [];
  (e || []).forEach(n => {
    let {
      value: o,
      children: l
    } = n;
    t.push(o);
    if (l) {
      t = [...t, ...Vt(l)];
    }
  });
  return t;
}
function Eo(e) {
  const t = {};
  e.forEach(n => {
    let {
      key: o,
      filteredKeys: l,
      column: a
    } = n;
    const i = a.filterDropdown || (a == null ? undefined : a.slots)?.filterDropdown || a.customFilterDropdown;
    const {
      filters: s
    } = a;
    if (i) {
      t[o] = l || null;
    } else if (Array.isArray(l)) {
      const f = Vt(s);
      t[o] = f.filter(d => l.includes(String(d)));
    } else {
      t[o] = null;
    }
  });
  return t;
}
function Po(e, t) {
  return t.reduce((n, o) => {
    const {
      column: {
        onFilter: l,
        filters: a
      },
      filteredKeys: r
    } = o;
    if (l && r && r.length) {
      return n.filter(i => r.some(s => {
        const f = Vt(a);
        const d = f.findIndex(m => String(m) === String(s));
        const c = d !== -1 ? f[d] : s;
        return l(c, i);
      }));
    } else {
      return n;
    }
  }, e);
}
function bl(e) {
  return e.flatMap(t => "children" in t ? [t, ...bl(t.children || [])] : [t]);
}
function Ei(e) {
  let {
    prefixCls: t,
    dropdownPrefixCls: n,
    mergedColumns: o,
    locale: l,
    onFilterChange: a,
    getPopupContainer: r
  } = e;
  const i = S(() => bl(o.value));
  const [s, f] = ht(xn(i.value, true));
  const d = S(() => {
    const w = xn(i.value, false);
    if (w.length === 0) {
      return w;
    }
    let v = true;
    let u = true;
    w.forEach(h => {
      let {
        filteredKeys: $
      } = h;
      if ($ !== undefined) {
        v = false;
      } else {
        u = false;
      }
    });
    if (v) {
      const h = (i.value || []).map(($, p) => yt($, Ot(p)));
      return s.value.filter($ => {
        let {
          key: p
        } = $;
        return h.includes(p);
      }).map($ => {
        const p = i.value[h.findIndex(P => P === $.key)];
        return x(x({}, $), {
          column: x(x({}, $.column), p),
          forceFiltered: p.filtered
        });
      });
    }
    et(u, "Table", "Columns should all contain `filteredValue` or not contain `filteredValue`.");
    return w;
  });
  const c = S(() => Eo(d.value));
  const m = w => {
    const v = d.value.filter(u => {
      let {
        key: h
      } = u;
      return h !== w.key;
    });
    v.push(w);
    f(v);
    a(Eo(v), v);
  };
  return [w => gl(t.value, n.value, w, d.value, l.value, m, r.value), d, c];
}
function xl(e, t) {
  return e.map(n => {
    const o = x({}, n);
    o.title = Rn(o.title, t);
    if ("children" in o) {
      o.children = xl(o.children, t);
    }
    return o;
  });
}
function Pi(e) {
  return [n => xl(n, e.value)];
}
function Ti(e) {
  return function (n) {
    let {
      prefixCls: o,
      onExpand: l,
      record: a,
      expanded: r,
      expandable: i
    } = n;
    const s = `${o}-row-expand-icon`;
    return y("button", {
      type: "button",
      onClick: f => {
        l(a, f);
        f.stopPropagation();
      },
      class: be(s, {
        [`${s}-spaced`]: !i,
        [`${s}-expanded`]: i && r,
        [`${s}-collapsed`]: i && !r
      }),
      "aria-label": r ? e.collapse : e.expand,
      "aria-expanded": r
    }, null);
  };
}
function Cl(e, t) {
  const n = t.value;
  return e.map(o => {
    var l;
    if (o === Qe || o === rt) {
      return o;
    }
    const a = x({}, o);
    const {
      slots: r = {}
    } = a;
    a.__originColumn__ = o;
    et(!("slots" in a), "Table", "`column.slots` is deprecated. Please use `v-slot:headerCell` `v-slot:bodyCell` instead.");
    Object.keys(r).forEach(i => {
      const s = r[i];
      if (a[i] === undefined && n[s]) {
        a[i] = n[s];
      }
    });
    if (t.value.headerCell && ((l = o.slots) === null || l === undefined || !l.title)) {
      a.title = kn(t.value, "headerCell", {
        title: o.title,
        column: o
      }, () => [o.title]);
    }
    if ("children" in a && Array.isArray(a.children)) {
      a.children = Cl(a.children, t);
    }
    return a;
  });
}
function Ii(e) {
  return [n => Cl(n, e)];
}
const Ni = e => {
  const {
    componentCls: t
  } = e;
  const n = `${e.lineWidth}px ${e.lineType} ${e.tableBorderColor}`;
  const o = (l, a, r) => ({
    [`&${t}-${l}`]: {
      [`> ${t}-container`]: {
        [`> ${t}-content, > ${t}-body`]: {
          "> table > tbody > tr > td": {
            [`> ${t}-expanded-row-fixed`]: {
              margin: `-${a}px -${r + e.lineWidth}px`
            }
          }
        }
      }
    }
  });
  return {
    [`${t}-wrapper`]: {
      [`${t}${t}-bordered`]: x(x(x({
        [`> ${t}-title`]: {
          border: n,
          borderBottom: 0
        },
        [`> ${t}-container`]: {
          borderInlineStart: n,
          [`
            > ${t}-content,
            > ${t}-header,
            > ${t}-body,
            > ${t}-summary
          `]: {
            "> table": {
              "\n                > thead > tr > th,\n                > tbody > tr > td,\n                > tfoot > tr > th,\n                > tfoot > tr > td\n              ": {
                borderInlineEnd: n
              },
              "> thead": {
                "> tr:not(:last-child) > th": {
                  borderBottom: n
                },
                "> tr > th::before": {
                  backgroundColor: "transparent !important"
                }
              },
              "\n                > thead > tr,\n                > tbody > tr,\n                > tfoot > tr\n              ": {
                [`> ${t}-cell-fix-right-first::after`]: {
                  borderInlineEnd: n
                }
              },
              "> tbody > tr > td": {
                [`> ${t}-expanded-row-fixed`]: {
                  margin: `-${e.tablePaddingVertical}px -${e.tablePaddingHorizontal + e.lineWidth}px`,
                  "&::after": {
                    position: "absolute",
                    top: 0,
                    insetInlineEnd: e.lineWidth,
                    bottom: 0,
                    borderInlineEnd: n,
                    content: "\"\""
                  }
                }
              }
            }
          },
          [`
            > ${t}-content,
            > ${t}-header
          `]: {
            "> table": {
              borderTop: n
            }
          }
        },
        [`&${t}-scroll-horizontal`]: {
          [`> ${t}-container > ${t}-body`]: {
            "> table > tbody": {
              [`
                > tr${t}-expanded-row,
                > tr${t}-placeholder
              `]: {
                "> td": {
                  borderInlineEnd: 0
                }
              }
            }
          }
        }
      }, o("middle", e.tablePaddingVerticalMiddle, e.tablePaddingHorizontalMiddle)), o("small", e.tablePaddingVerticalSmall, e.tablePaddingHorizontalSmall)), {
        [`> ${t}-footer`]: {
          border: n,
          borderTop: 0
        }
      }),
      [`${t}-cell`]: {
        [`${t}-container:first-child`]: {
          borderTop: 0
        },
        "&-scrollbar:not([rowspan])": {
          boxShadow: `0 ${e.lineWidth}px 0 ${e.lineWidth}px ${e.tableHeaderBg}`
        }
      }
    }
  };
};
const Di = e => {
  const {
    componentCls: t
  } = e;
  return {
    [`${t}-wrapper`]: {
      [`${t}-cell-ellipsis`]: x(x({}, ea), {
        wordBreak: "keep-all",
        [`
          &${t}-cell-fix-left-last,
          &${t}-cell-fix-right-first
        `]: {
          overflow: "visible",
          [`${t}-cell-content`]: {
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }
        },
        [`${t}-column-title`]: {
          overflow: "hidden",
          textOverflow: "ellipsis",
          wordBreak: "keep-all"
        }
      })
    }
  };
};
const Ri = e => {
  const {
    componentCls: t
  } = e;
  return {
    [`${t}-wrapper`]: {
      [`${t}-tbody > tr${t}-placeholder`]: {
        textAlign: "center",
        color: e.colorTextDisabled,
        "&:hover > td": {
          background: e.colorBgContainer
        }
      }
    }
  };
};
const _i = e => {
  const {
    componentCls: t,
    antCls: n,
    controlInteractiveSize: o,
    motionDurationSlow: l,
    lineWidth: a,
    paddingXS: r,
    lineType: i,
    tableBorderColor: s,
    tableExpandIconBg: f,
    tableExpandColumnWidth: d,
    borderRadius: c,
    fontSize: m,
    fontSizeSM: C,
    lineHeight: w,
    tablePaddingVertical: v,
    tablePaddingHorizontal: u,
    tableExpandedRowBg: h,
    paddingXXS: $
  } = e;
  const p = o / 2 - a;
  const P = p * 2 + a * 3;
  const I = `${a}px ${i} ${s}`;
  const H = $ - a;
  return {
    [`${t}-wrapper`]: {
      [`${t}-expand-icon-col`]: {
        width: d
      },
      [`${t}-row-expand-icon-cell`]: {
        textAlign: "center",
        [`${t}-row-expand-icon`]: {
          display: "inline-flex",
          float: "none",
          verticalAlign: "sub"
        }
      },
      [`${t}-row-indent`]: {
        height: 1,
        float: "left"
      },
      [`${t}-row-expand-icon`]: x(x({}, pa(e)), {
        position: "relative",
        float: "left",
        boxSizing: "border-box",
        width: P,
        height: P,
        padding: 0,
        color: "inherit",
        lineHeight: `${P}px`,
        background: f,
        border: I,
        borderRadius: c,
        transform: `scale(${o / P})`,
        transition: `all ${l}`,
        userSelect: "none",
        "&:focus, &:hover, &:active": {
          borderColor: "currentcolor"
        },
        "&::before, &::after": {
          position: "absolute",
          background: "currentcolor",
          transition: `transform ${l} ease-out`,
          content: "\"\""
        },
        "&::before": {
          top: p,
          insetInlineEnd: H,
          insetInlineStart: H,
          height: a
        },
        "&::after": {
          top: H,
          bottom: H,
          insetInlineStart: p,
          width: a,
          transform: "rotate(90deg)"
        },
        "&-collapsed::before": {
          transform: "rotate(-180deg)"
        },
        "&-collapsed::after": {
          transform: "rotate(0deg)"
        },
        "&-spaced": {
          "&::before, &::after": {
            display: "none",
            content: "none"
          },
          background: "transparent",
          border: 0,
          visibility: "hidden"
        }
      }),
      [`${t}-row-indent + ${t}-row-expand-icon`]: {
        marginTop: (m * w - a * 3) / 2 - Math.ceil((C * 1.4 - a * 3) / 2),
        marginInlineEnd: r
      },
      [`tr${t}-expanded-row`]: {
        "&, &:hover": {
          "> td": {
            background: h
          }
        },
        [`${n}-descriptions-view`]: {
          display: "flex",
          table: {
            flex: "auto",
            width: "auto"
          }
        }
      },
      [`${t}-expanded-row-fixed`]: {
        position: "relative",
        margin: `-${v}px -${u}px`,
        padding: `${v}px ${u}px`
      }
    }
  };
};
const Fi = e => {
  const {
    componentCls: t,
    antCls: n,
    iconCls: o,
    tableFilterDropdownWidth: l,
    tableFilterDropdownSearchWidth: a,
    paddingXXS: r,
    paddingXS: i,
    colorText: s,
    lineWidth: f,
    lineType: d,
    tableBorderColor: c,
    tableHeaderIconColor: m,
    fontSizeSM: C,
    tablePaddingHorizontal: w,
    borderRadius: v,
    motionDurationSlow: u,
    colorTextDescription: h,
    colorPrimary: $,
    tableHeaderFilterActiveBg: p,
    colorTextDisabled: P,
    tableFilterDropdownBg: I,
    tableFilterDropdownHeight: H,
    controlItemBgHover: N,
    controlItemBgActive: F,
    boxShadowSecondary: b
  } = e;
  const K = `${n}-dropdown`;
  const _ = `${t}-filter-dropdown`;
  const B = `${n}-tree`;
  const A = `${f}px ${d} ${c}`;
  return [{
    [`${t}-wrapper`]: {
      [`${t}-filter-column`]: {
        display: "flex",
        justifyContent: "space-between"
      },
      [`${t}-filter-trigger`]: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        marginBlock: -r,
        marginInline: `${r}px ${-w / 2}px`,
        padding: `0 ${r}px`,
        color: m,
        fontSize: C,
        borderRadius: v,
        cursor: "pointer",
        transition: `all ${u}`,
        "&:hover": {
          color: h,
          background: p
        },
        "&.active": {
          color: $
        }
      }
    }
  }, {
    [`${n}-dropdown`]: {
      [_]: x(x({}, Kn(e)), {
        minWidth: l,
        backgroundColor: I,
        borderRadius: v,
        boxShadow: b,
        [`${K}-menu`]: {
          maxHeight: H,
          overflowX: "hidden",
          border: 0,
          boxShadow: "none",
          "&:empty::after": {
            display: "block",
            padding: `${i}px 0`,
            color: P,
            fontSize: C,
            textAlign: "center",
            content: "\"Not Found\""
          }
        },
        [`${_}-tree`]: {
          paddingBlock: `${i}px 0`,
          paddingInline: i,
          [B]: {
            padding: 0
          },
          [`${B}-treenode ${B}-node-content-wrapper:hover`]: {
            backgroundColor: N
          },
          [`${B}-treenode-checkbox-checked ${B}-node-content-wrapper`]: {
            "&, &:hover": {
              backgroundColor: F
            }
          }
        },
        [`${_}-search`]: {
          padding: i,
          borderBottom: A,
          "&-input": {
            input: {
              minWidth: a
            },
            [o]: {
              color: P
            }
          }
        },
        [`${_}-checkall`]: {
          width: "100%",
          marginBottom: r,
          marginInlineStart: r
        },
        [`${_}-btns`]: {
          display: "flex",
          justifyContent: "space-between",
          padding: `${i - f}px ${i}px`,
          overflow: "hidden",
          backgroundColor: "inherit",
          borderTop: A
        }
      })
    }
  }, {
    [`${n}-dropdown ${_}, ${_}-submenu`]: {
      [`${n}-checkbox-wrapper + span`]: {
        paddingInlineStart: i,
        color: s
      },
      "> ul": {
        maxHeight: "calc(100vh - 130px)",
        overflowX: "hidden",
        overflowY: "auto"
      }
    }
  }];
};
const Bi = e => {
  const {
    componentCls: t,
    lineWidth: n,
    colorSplit: o,
    motionDurationSlow: l,
    zIndexTableFixed: a,
    tableBg: r,
    zIndexTableSticky: i
  } = e;
  const s = o;
  return {
    [`${t}-wrapper`]: {
      [`
        ${t}-cell-fix-left,
        ${t}-cell-fix-right
      `]: {
        position: "sticky !important",
        zIndex: a,
        background: r
      },
      [`
        ${t}-cell-fix-left-first::after,
        ${t}-cell-fix-left-last::after
      `]: {
        position: "absolute",
        top: 0,
        right: {
          _skip_check_: true,
          value: 0
        },
        bottom: -n,
        width: 30,
        transform: "translateX(100%)",
        transition: `box-shadow ${l}`,
        content: "\"\"",
        pointerEvents: "none"
      },
      [`${t}-cell-fix-left-all::after`]: {
        display: "none"
      },
      [`
        ${t}-cell-fix-right-first::after,
        ${t}-cell-fix-right-last::after
      `]: {
        position: "absolute",
        top: 0,
        bottom: -n,
        left: {
          _skip_check_: true,
          value: 0
        },
        width: 30,
        transform: "translateX(-100%)",
        transition: `box-shadow ${l}`,
        content: "\"\"",
        pointerEvents: "none"
      },
      [`${t}-container`]: {
        "&::before, &::after": {
          position: "absolute",
          top: 0,
          bottom: 0,
          zIndex: i + 1,
          width: 30,
          transition: `box-shadow ${l}`,
          content: "\"\"",
          pointerEvents: "none"
        },
        "&::before": {
          insetInlineStart: 0
        },
        "&::after": {
          insetInlineEnd: 0
        }
      },
      [`${t}-ping-left`]: {
        [`&:not(${t}-has-fix-left) ${t}-container`]: {
          position: "relative",
          "&::before": {
            boxShadow: `inset 10px 0 8px -8px ${s}`
          }
        },
        [`
          ${t}-cell-fix-left-first::after,
          ${t}-cell-fix-left-last::after
        `]: {
          boxShadow: `inset 10px 0 8px -8px ${s}`
        },
        [`${t}-cell-fix-left-last::before`]: {
          backgroundColor: "transparent !important"
        }
      },
      [`${t}-ping-right`]: {
        [`&:not(${t}-has-fix-right) ${t}-container`]: {
          position: "relative",
          "&::after": {
            boxShadow: `inset -10px 0 8px -8px ${s}`
          }
        },
        [`
          ${t}-cell-fix-right-first::after,
          ${t}-cell-fix-right-last::after
        `]: {
          boxShadow: `inset -10px 0 8px -8px ${s}`
        }
      }
    }
  };
};
const Ai = e => {
  const {
    componentCls: t,
    antCls: n
  } = e;
  return {
    [`${t}-wrapper`]: {
      [`${t}-pagination${n}-pagination`]: {
        margin: `${e.margin}px 0`
      },
      [`${t}-pagination`]: {
        display: "flex",
        flexWrap: "wrap",
        rowGap: e.paddingXS,
        "> *": {
          flex: "none"
        },
        "&-left": {
          justifyContent: "flex-start"
        },
        "&-center": {
          justifyContent: "center"
        },
        "&-right": {
          justifyContent: "flex-end"
        }
      }
    }
  };
};
const Li = e => {
  const {
    componentCls: t,
    tableRadius: n
  } = e;
  return {
    [`${t}-wrapper`]: {
      [t]: {
        [`${t}-title, ${t}-header`]: {
          borderRadius: `${n}px ${n}px 0 0`
        },
        [`${t}-title + ${t}-container`]: {
          borderStartStartRadius: 0,
          borderStartEndRadius: 0,
          table: {
            borderRadius: 0,
            "> thead > tr:first-child": {
              "th:first-child": {
                borderRadius: 0
              },
              "th:last-child": {
                borderRadius: 0
              }
            }
          }
        },
        "&-container": {
          borderStartStartRadius: n,
          borderStartEndRadius: n,
          "table > thead > tr:first-child": {
            "> *:first-child": {
              borderStartStartRadius: n
            },
            "> *:last-child": {
              borderStartEndRadius: n
            }
          }
        },
        "&-footer": {
          borderRadius: `0 0 ${n}px ${n}px`
        }
      }
    }
  };
};
const Hi = e => {
  const {
    componentCls: t
  } = e;
  return {
    [`${t}-wrapper-rtl`]: {
      direction: "rtl",
      table: {
        direction: "rtl"
      },
      [`${t}-pagination-left`]: {
        justifyContent: "flex-end"
      },
      [`${t}-pagination-right`]: {
        justifyContent: "flex-start"
      },
      [`${t}-row-expand-icon`]: {
        "&::after": {
          transform: "rotate(-90deg)"
        },
        "&-collapsed::before": {
          transform: "rotate(180deg)"
        },
        "&-collapsed::after": {
          transform: "rotate(0deg)"
        }
      }
    }
  };
};
const Mi = e => {
  const {
    componentCls: t,
    antCls: n,
    iconCls: o,
    fontSizeIcon: l,
    paddingXS: a,
    tableHeaderIconColor: r,
    tableHeaderIconColorHover: i
  } = e;
  return {
    [`${t}-wrapper`]: {
      [`${t}-selection-col`]: {
        width: e.tableSelectionColumnWidth
      },
      [`${t}-bordered ${t}-selection-col`]: {
        width: e.tableSelectionColumnWidth + a * 2
      },
      [`
        table tr th${t}-selection-column,
        table tr td${t}-selection-column
      `]: {
        paddingInlineEnd: e.paddingXS,
        paddingInlineStart: e.paddingXS,
        textAlign: "center",
        [`${n}-radio-wrapper`]: {
          marginInlineEnd: 0
        }
      },
      [`table tr th${t}-selection-column${t}-cell-fix-left`]: {
        zIndex: e.zIndexTableFixed + 1
      },
      [`table tr th${t}-selection-column::after`]: {
        backgroundColor: "transparent !important"
      },
      [`${t}-selection`]: {
        position: "relative",
        display: "inline-flex",
        flexDirection: "column"
      },
      [`${t}-selection-extra`]: {
        position: "absolute",
        top: 0,
        zIndex: 1,
        cursor: "pointer",
        transition: `all ${e.motionDurationSlow}`,
        marginInlineStart: "100%",
        paddingInlineStart: `${e.tablePaddingHorizontal / 4}px`,
        [o]: {
          color: r,
          fontSize: l,
          verticalAlign: "baseline",
          "&:hover": {
            color: i
          }
        }
      }
    }
  };
};
const zi = e => {
  const {
    componentCls: t
  } = e;
  const n = (o, l, a, r) => ({
    [`${t}${t}-${o}`]: {
      fontSize: r,
      [`
        ${t}-title,
        ${t}-footer,
        ${t}-thead > tr > th,
        ${t}-tbody > tr > td,
        tfoot > tr > th,
        tfoot > tr > td
      `]: {
        padding: `${l}px ${a}px`
      },
      [`${t}-filter-trigger`]: {
        marginInlineEnd: `-${a / 2}px`
      },
      [`${t}-expanded-row-fixed`]: {
        margin: `-${l}px -${a}px`
      },
      [`${t}-tbody`]: {
        [`${t}-wrapper:only-child ${t}`]: {
          marginBlock: `-${l}px`,
          marginInline: `${e.tableExpandColumnWidth - a}px -${a}px`
        }
      },
      [`${t}-selection-column`]: {
        paddingInlineStart: `${a / 4}px`
      }
    }
  });
  return {
    [`${t}-wrapper`]: x(x({}, n("middle", e.tablePaddingVerticalMiddle, e.tablePaddingHorizontalMiddle, e.tableFontSizeMiddle)), n("small", e.tablePaddingVerticalSmall, e.tablePaddingHorizontalSmall, e.tableFontSizeSmall))
  };
};
const ji = e => {
  const {
    componentCls: t
  } = e;
  return {
    [`${t}-wrapper ${t}-resize-handle`]: {
      position: "absolute",
      top: 0,
      height: "100% !important",
      bottom: 0,
      left: " auto !important",
      right: " -8px",
      cursor: "col-resize",
      touchAction: "none",
      userSelect: "auto",
      width: "16px",
      zIndex: 1,
      "&-line": {
        display: "block",
        width: "1px",
        marginLeft: "7px",
        height: "100% !important",
        backgroundColor: e.colorPrimary,
        opacity: 0
      },
      "&:hover &-line": {
        opacity: 1
      }
    },
    [`${t}-wrapper  ${t}-resize-handle.dragging`]: {
      overflow: "hidden",
      [`${t}-resize-handle-line`]: {
        opacity: 1
      },
      "&:before": {
        position: "absolute",
        top: 0,
        bottom: 0,
        content: "\" \"",
        width: "200vw",
        transform: "translateX(-50%)",
        opacity: 0
      }
    }
  };
};
const Wi = e => {
  const {
    componentCls: t,
    marginXXS: n,
    fontSizeIcon: o,
    tableHeaderIconColor: l,
    tableHeaderIconColorHover: a
  } = e;
  return {
    [`${t}-wrapper`]: {
      [`${t}-thead th${t}-column-has-sorters`]: {
        outline: "none",
        cursor: "pointer",
        transition: `all ${e.motionDurationSlow}`,
        "&:hover": {
          background: e.tableHeaderSortHoverBg,
          "&::before": {
            backgroundColor: "transparent !important"
          }
        },
        "&:focus-visible": {
          color: e.colorPrimary
        },
        [`
          &${t}-cell-fix-left:hover,
          &${t}-cell-fix-right:hover
        `]: {
          background: e.tableFixedHeaderSortActiveBg
        }
      },
      [`${t}-thead th${t}-column-sort`]: {
        background: e.tableHeaderSortBg,
        "&::before": {
          backgroundColor: "transparent !important"
        }
      },
      [`td${t}-column-sort`]: {
        background: e.tableBodySortBg
      },
      [`${t}-column-title`]: {
        position: "relative",
        zIndex: 1,
        flex: 1
      },
      [`${t}-column-sorters`]: {
        display: "flex",
        flex: "auto",
        alignItems: "center",
        justifyContent: "space-between",
        "&::after": {
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          content: "\"\""
        }
      },
      [`${t}-column-sorter`]: {
        marginInlineStart: n,
        color: l,
        fontSize: 0,
        transition: `color ${e.motionDurationSlow}`,
        "&-inner": {
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center"
        },
        "&-up, &-down": {
          fontSize: o,
          "&.active": {
            color: e.colorPrimary
          }
        },
        [`${t}-column-sorter-up + ${t}-column-sorter-down`]: {
          marginTop: "-0.3em"
        }
      },
      [`${t}-column-sorters:hover ${t}-column-sorter`]: {
        color: a
      }
    }
  };
};
const Vi = e => {
  const {
    componentCls: t,
    opacityLoading: n,
    tableScrollThumbBg: o,
    tableScrollThumbBgHover: l,
    tableScrollThumbSize: a,
    tableScrollBg: r,
    zIndexTableSticky: i
  } = e;
  const s = `${e.lineWidth}px ${e.lineType} ${e.tableBorderColor}`;
  return {
    [`${t}-wrapper`]: {
      [`${t}-sticky`]: {
        "&-holder": {
          position: "sticky",
          zIndex: i,
          background: e.colorBgContainer
        },
        "&-scroll": {
          position: "sticky",
          bottom: 0,
          height: `${a}px !important`,
          zIndex: i,
          display: "flex",
          alignItems: "center",
          background: r,
          borderTop: s,
          opacity: n,
          "&:hover": {
            transformOrigin: "center bottom"
          },
          "&-bar": {
            height: a,
            backgroundColor: o,
            borderRadius: 100,
            transition: `all ${e.motionDurationSlow}, transform none`,
            position: "absolute",
            bottom: 0,
            "&:hover, &-active": {
              backgroundColor: l
            }
          }
        }
      }
    }
  };
};
const To = e => {
  const {
    componentCls: t,
    lineWidth: n,
    tableBorderColor: o
  } = e;
  const l = `${n}px ${e.lineType} ${o}`;
  return {
    [`${t}-wrapper`]: {
      [`${t}-summary`]: {
        position: "relative",
        zIndex: e.zIndexTableFixed,
        background: e.tableBg,
        "> tr": {
          "> th, > td": {
            borderBottom: l
          }
        }
      },
      [`div${t}-summary`]: {
        boxShadow: `0 -${n}px 0 ${o}`
      }
    }
  };
};
const Xi = e => {
  const {
    componentCls: t,
    fontWeightStrong: n,
    tablePaddingVertical: o,
    tablePaddingHorizontal: l,
    lineWidth: a,
    lineType: r,
    tableBorderColor: i,
    tableFontSize: s,
    tableBg: f,
    tableRadius: d,
    tableHeaderTextColor: c,
    motionDurationMid: m,
    tableHeaderBg: C,
    tableHeaderCellSplitColor: w,
    tableRowHoverBg: v,
    tableSelectedRowBg: u,
    tableSelectedRowHoverBg: h,
    tableFooterTextColor: $,
    tableFooterBg: p,
    paddingContentVerticalLG: P
  } = e;
  const I = `${a}px ${r} ${i}`;
  return {
    [`${t}-wrapper`]: x(x({
      clear: "both",
      maxWidth: "100%"
    }, ta()), {
      [t]: x(x({}, Kn(e)), {
        fontSize: s,
        background: f,
        borderRadius: `${d}px ${d}px 0 0`
      }),
      table: {
        width: "100%",
        textAlign: "start",
        borderRadius: `${d}px ${d}px 0 0`,
        borderCollapse: "separate",
        borderSpacing: 0
      },
      [`
          ${t}-thead > tr > th,
          ${t}-tbody > tr > td,
          tfoot > tr > th,
          tfoot > tr > td
        `]: {
        position: "relative",
        padding: `${P}px ${l}px`,
        overflowWrap: "break-word"
      },
      [`${t}-title`]: {
        padding: `${o}px ${l}px`
      },
      [`${t}-thead`]: {
        "\n          > tr > th,\n          > tr > td\n        ": {
          position: "relative",
          color: c,
          fontWeight: n,
          textAlign: "start",
          background: C,
          borderBottom: I,
          transition: `background ${m} ease`,
          "&[colspan]:not([colspan='1'])": {
            textAlign: "center"
          },
          [`&:not(:last-child):not(${t}-selection-column):not(${t}-row-expand-icon-cell):not([colspan])::before`]: {
            position: "absolute",
            top: "50%",
            insetInlineEnd: 0,
            width: 1,
            height: "1.6em",
            backgroundColor: w,
            transform: "translateY(-50%)",
            transition: `background-color ${m}`,
            content: "\"\""
          }
        },
        "> tr:not(:last-child) > th[colspan]": {
          borderBottom: 0
        }
      },
      [`${t}:not(${t}-bordered)`]: {
        [`${t}-tbody`]: {
          "> tr": {
            "> td": {
              borderTop: I,
              borderBottom: "transparent"
            },
            "&:last-child > td": {
              borderBottom: I
            },
            [`&:first-child > td,
              &${t}-measure-row + tr > td`]: {
              borderTop: "none",
              borderTopColor: "transparent"
            }
          }
        }
      },
      [`${t}${t}-bordered`]: {
        [`${t}-tbody`]: {
          "> tr": {
            "> td": {
              borderBottom: I
            }
          }
        }
      },
      [`${t}-tbody`]: {
        "> tr": {
          "> td": {
            transition: `background ${m}, border-color ${m}`,
            [`
              > ${t}-wrapper:only-child,
              > ${t}-expanded-row-fixed > ${t}-wrapper:only-child
            `]: {
              [t]: {
                marginBlock: `-${o}px`,
                marginInline: `${e.tableExpandColumnWidth - l}px -${l}px`,
                [`${t}-tbody > tr:last-child > td`]: {
                  borderBottom: 0,
                  "&:first-child, &:last-child": {
                    borderRadius: 0
                  }
                }
              }
            }
          },
          [`
            &${t}-row:hover > td,
            > td${t}-cell-row-hover
          `]: {
            background: v
          },
          [`&${t}-row-selected`]: {
            "> td": {
              background: u
            },
            "&:hover > td": {
              background: h
            }
          }
        }
      },
      [`${t}-footer`]: {
        padding: `${o}px ${l}px`,
        color: $,
        background: p
      }
    })
  };
};
const Ui = Ao("Table", e => {
  const {
    controlItemBgActive: t,
    controlItemBgActiveHover: n,
    colorTextPlaceholder: o,
    colorTextHeading: l,
    colorSplit: a,
    colorBorderSecondary: r,
    fontSize: i,
    padding: s,
    paddingXS: f,
    paddingSM: d,
    controlHeight: c,
    colorFillAlter: m,
    colorIcon: C,
    colorIconHover: w,
    opacityLoading: v,
    colorBgContainer: u,
    borderRadiusLG: h,
    colorFillContent: $,
    colorFillSecondary: p,
    controlInteractiveSize: P
  } = e;
  const I = new wt(C);
  const H = new wt(w);
  const N = t;
  const F = 2;
  const b = new wt(p).onBackground(u).toHexString();
  const K = new wt($).onBackground(u).toHexString();
  const _ = new wt(m).onBackground(u).toHexString();
  const B = Lo(e, {
    tableFontSize: i,
    tableBg: u,
    tableRadius: h,
    tablePaddingVertical: s,
    tablePaddingHorizontal: s,
    tablePaddingVerticalMiddle: d,
    tablePaddingHorizontalMiddle: f,
    tablePaddingVerticalSmall: f,
    tablePaddingHorizontalSmall: f,
    tableBorderColor: r,
    tableHeaderTextColor: l,
    tableHeaderBg: _,
    tableFooterTextColor: l,
    tableFooterBg: _,
    tableHeaderCellSplitColor: r,
    tableHeaderSortBg: b,
    tableHeaderSortHoverBg: K,
    tableHeaderIconColor: I.clone().setAlpha(I.getAlpha() * v).toRgbString(),
    tableHeaderIconColorHover: H.clone().setAlpha(H.getAlpha() * v).toRgbString(),
    tableBodySortBg: _,
    tableFixedHeaderSortActiveBg: b,
    tableHeaderFilterActiveBg: $,
    tableFilterDropdownBg: u,
    tableRowHoverBg: _,
    tableSelectedRowBg: N,
    tableSelectedRowHoverBg: n,
    zIndexTableFixed: F,
    zIndexTableSticky: F + 1,
    tableFontSizeMiddle: i,
    tableFontSizeSmall: i,
    tableSelectionColumnWidth: c,
    tableExpandIconBg: u,
    tableExpandColumnWidth: P + e.padding * 2,
    tableExpandedRowBg: m,
    tableFilterDropdownWidth: 120,
    tableFilterDropdownHeight: 264,
    tableFilterDropdownSearchWidth: 140,
    tableScrollThumbSize: 8,
    tableScrollThumbBg: o,
    tableScrollThumbBgHover: l,
    tableScrollBg: a
  });
  return [Xi(B), Ai(B), To(B), Wi(B), Fi(B), Ni(B), Li(B), _i(B), To(B), Ri(B), Mi(B), Bi(B), Vi(B), Di(B), zi(B), ji(B), Hi(B)];
});
const Gi = [];
const Sl = () => ({
  prefixCls: at(),
  columns: We(),
  rowKey: je([String, Function]),
  tableLayout: at(),
  rowClassName: je([String, Function]),
  title: Te(),
  footer: Te(),
  id: at(),
  showHeader: Le(),
  components: vt(),
  customRow: Te(),
  customHeaderRow: Te(),
  direction: at(),
  expandFixed: je([Boolean, String]),
  expandColumnWidth: Number,
  expandedRowKeys: We(),
  defaultExpandedRowKeys: We(),
  expandedRowRender: Te(),
  expandRowByClick: Le(),
  expandIcon: Te(),
  onExpand: Te(),
  onExpandedRowsChange: Te(),
  "onUpdate:expandedRowKeys": Te(),
  defaultExpandAllRows: Le(),
  indentSize: Number,
  expandIconColumnIndex: Number,
  showExpandColumn: Le(),
  expandedRowClassName: Te(),
  childrenColumnName: at(),
  rowExpandable: Te(),
  sticky: je([Boolean, Object]),
  dropdownPrefixCls: String,
  dataSource: We(),
  pagination: je([Boolean, Object]),
  loading: je([Boolean, Object]),
  size: at(),
  bordered: Le(),
  locale: vt(),
  onChange: Te(),
  onResizeColumn: Te(),
  rowSelection: vt(),
  getPopupContainer: Te(),
  scroll: vt(),
  sortDirections: We(),
  showSorterTooltip: je([Boolean, Object], true),
  transformCellText: Te()
});
const Yi = we({
  name: "InternalTable",
  inheritAttrs: false,
  props: kt(x(x({}, Sl()), {
    contextSlots: vt()
  }), {
    rowKey: "key"
  }),
  setup(e, t) {
    let {
      attrs: n,
      slots: o,
      expose: l,
      emit: a
    } = t;
    et(typeof e.rowKey != "function" || !(e.rowKey.length > 1), "Table", "`index` parameter of `rowKey` function is deprecated. There is no guarantee that it will work as expected.");
    Aa(S(() => e.contextSlots));
    La({
      onResizeColumn: (j, se) => {
        a("resizeColumn", j, se);
      }
    });
    const r = va();
    const i = S(() => {
      const j = new Set(Object.keys(r.value).filter(se => r.value[se]));
      return e.columns.filter(se => !se.responsive || se.responsive.some(X => j.has(X)));
    });
    const {
      size: s,
      renderEmpty: f,
      direction: d,
      prefixCls: c,
      configProvider: m
    } = Ht("table", e);
    const [C, w] = Ui(c);
    const v = S(() => {
      return e.transformCellText || m.transformCellText?.value;
    });
    const [u] = na("Table", oa.Table, Be(e, "locale"));
    const h = S(() => e.dataSource || Gi);
    const $ = S(() => m.getPrefixCls("dropdown", e.dropdownPrefixCls));
    const p = S(() => e.childrenColumnName || "children");
    const P = S(() => h.value.some(j => j == null ? undefined : j[p.value]) ? "nest" : e.expandedRowRender ? "row" : null);
    const I = it({
      body: null
    });
    const H = j => {
      x(I, j);
    };
    const N = S(() => typeof e.rowKey == "function" ? e.rowKey : j => j == null ? undefined : j[e.rowKey]);
    const [F] = Tr(h, p, N);
    const b = {};
    const K = function (j, se, X = false) {
      const {
        pagination: oe,
        scroll: ie,
        onChange: xe
      } = e;
      const re = x(x({}, b), j);
      if (X) {
        b.resetPagination();
        re.pagination.current &&= 1;
        if (oe && oe.onChange) {
          oe.onChange(1, re.pagination.pageSize);
        }
      }
      if (ie && ie.scrollToFirstRowOnChange !== false && I.body) {
        ga(0, {
          getContainer: () => I.body
        });
      }
      if (xe != null) {
        xe(re.pagination, re.filters, re.sorter, {
          currentDataSource: Po(gn(h.value, re.sorterStates, p.value), re.filterStates),
          action: se
        });
      }
    };
    const _ = (j, se) => {
      K({
        sorter: j,
        sorterStates: se
      }, "sort", false);
    };
    const [B, A, le, ae] = Lr({
      prefixCls: c,
      mergedColumns: i,
      onSorterChange: _,
      sortDirections: S(() => e.sortDirections || ["ascend", "descend"]),
      tableLocale: u,
      showSorterTooltip: Be(e, "showSorterTooltip")
    });
    const fe = S(() => gn(h.value, A.value, p.value));
    const Se = (j, se) => {
      K({
        filters: j,
        filterStates: se
      }, "filter", true);
    };
    const [U, Q, M] = Ei({
      prefixCls: c,
      locale: u,
      dropdownPrefixCls: $,
      mergedColumns: i,
      onFilterChange: Se,
      getPopupContainer: Be(e, "getPopupContainer")
    });
    const J = S(() => Po(fe.value, Q.value));
    const [R] = Ii(Be(e, "contextSlots"));
    const V = S(() => {
      const j = {};
      const se = M.value;
      Object.keys(se).forEach(X => {
        if (se[X] !== null) {
          j[X] = se[X];
        }
      });
      return x(x({}, le.value), {
        filters: j
      });
    });
    const [z] = Pi(V);
    const ee = (j, se) => {
      K({
        pagination: x(x({}, b.pagination), {
          current: j,
          pageSize: se
        })
      }, "paginate");
    };
    const [G, $e] = Pr(S(() => J.value.length), Be(e, "pagination"), ee);
    De(() => {
      b.sorter = ae.value;
      b.sorterStates = A.value;
      b.filters = M.value;
      b.filterStates = Q.value;
      b.pagination = e.pagination === false ? {} : Er(G.value, e.pagination);
      b.resetPagination = $e;
    });
    const ce = S(() => {
      if (e.pagination === false || !G.value.pageSize) {
        return J.value;
      }
      const {
        current: j = 1,
        total: se,
        pageSize: X = vn
      } = G.value;
      et(j > 0, "Table", "`current` should be positive number.");
      if (J.value.length < se) {
        if (J.value.length > X) {
          return J.value.slice((j - 1) * X, j * X);
        } else {
          return J.value;
        }
      } else {
        return J.value.slice((j - 1) * X, j * X);
      }
    });
    De(() => {
      dt(() => {
        const {
          total: j,
          pageSize: se = vn
        } = G.value;
        if (J.value.length < j && J.value.length > se) {
          et(false, "Table", "`dataSource` length is less than `pagination.total` but large than `pagination.pageSize`. Please make sure your config correct data with async mode.");
        }
      });
    }, {
      flush: "post"
    });
    const Ke = S(() => e.showExpandColumn === false ? -1 : P.value === "nest" && e.expandIconColumnIndex === undefined ? e.rowSelection ? 1 : 0 : e.expandIconColumnIndex > 0 && e.rowSelection ? e.expandIconColumnIndex - 1 : e.expandIconColumnIndex);
    const Oe = Ce();
    Re(() => e.rowSelection, () => {
      Oe.value = e.rowSelection ? x({}, e.rowSelection) : e.rowSelection;
    }, {
      deep: true,
      immediate: true
    });
    const [Ie, _e] = Nr(Oe, {
      prefixCls: c,
      data: J,
      pageData: ce,
      getRowKey: N,
      getRecordByKey: F,
      expandType: P,
      childrenColumnName: p,
      locale: u,
      getPopupContainer: S(() => e.getPopupContainer)
    });
    const Me = (j, se, X) => {
      let oe;
      const {
        rowClassName: ie
      } = e;
      if (typeof ie == "function") {
        oe = be(ie(j, se, X));
      } else {
        oe = be(ie);
      }
      return be({
        [`${c.value}-row-selected`]: _e.value.has(N.value(j, se))
      }, oe);
    };
    l({
      selectedKeySet: _e
    });
    const Ee = S(() => typeof e.indentSize == "number" ? e.indentSize : 15);
    const Pe = j => z(Ie(U(B(R(j)))));
    return () => {
      var j;
      const {
        expandIcon: se = o.expandIcon || Ti(u.value),
        pagination: X,
        loading: oe,
        bordered: ie
      } = e;
      let xe;
      let re;
      if (X !== false && (j = G.value) !== null && j !== undefined && j.total) {
        let g;
        if (G.value.size) {
          g = G.value.size;
        } else {
          g = s.value === "small" || s.value === "middle" ? "small" : undefined;
        }
        const O = me => y(sa, ne(ne({}, G.value), {}, {
          class: [`${c.value}-pagination ${c.value}-pagination-${me}`, G.value.class],
          size: g
        }), null);
        const Y = d.value === "rtl" ? "left" : "right";
        const {
          position: de
        } = G.value;
        if (de !== null && Array.isArray(de)) {
          const me = de.find(D => D.includes("top"));
          const E = de.find(D => D.includes("bottom"));
          const T = de.every(D => `${D}` == "none");
          if (!me && !E && !T) {
            re = O(Y);
          }
          if (me) {
            xe = O(me.toLowerCase().replace("top", ""));
          }
          if (E) {
            re = O(E.toLowerCase().replace("bottom", ""));
          }
        } else {
          re = O(Y);
        }
      }
      let ue;
      if (typeof oe == "boolean") {
        ue = {
          spinning: oe
        };
      } else if (typeof oe == "object") {
        ue = x({
          spinning: true
        }, oe);
      }
      const ke = be(`${c.value}-wrapper`, {
        [`${c.value}-wrapper-rtl`]: d.value === "rtl"
      }, n.class, w.value);
      const k = Lt(e, ["columns"]);
      return C(y("div", {
        class: ke,
        style: n.style
      }, [y(ia, ne({
        spinning: false
      }, ue), {
        default: () => [xe, y(Kr, ne(ne(ne({}, n), k), {}, {
          expandedRowKeys: e.expandedRowKeys,
          defaultExpandedRowKeys: e.defaultExpandedRowKeys,
          expandIconColumnIndex: Ke.value,
          indentSize: Ee.value,
          expandIcon: se,
          columns: i.value,
          direction: d.value,
          prefixCls: c.value,
          class: be({
            [`${c.value}-middle`]: s.value === "middle",
            [`${c.value}-small`]: s.value === "small",
            [`${c.value}-bordered`]: ie,
            [`${c.value}-empty`]: h.value.length === 0
          }),
          data: ce.value,
          rowKey: N.value,
          rowClassName: Me,
          internalHooks: fn,
          internalRefs: I,
          onUpdateInternalRefs: H,
          transformColumns: Pe,
          transformCellText: v.value
        }), x(x({}, o), {
          emptyText: () => {
            var g;
            return ((g = o.emptyText) === null || g === undefined ? undefined : g.call(o)) || e.locale?.emptyText || f("Table");
          }
        })), re]
      })]));
    };
  }
});
const Jt = we({
  name: "ATable",
  inheritAttrs: false,
  props: kt(Sl(), {
    rowKey: "key"
  }),
  slots: Object,
  setup(e, t) {
    let {
      attrs: n,
      slots: o,
      expose: l
    } = t;
    const a = Ce();
    l({
      table: a
    });
    return () => {
      var r;
      const i = e.columns || fl((r = o.default) === null || r === undefined ? undefined : r.call(o));
      return y(Yi, ne(ne(ne({
        ref: a
      }, n), e), {}, {
        columns: i || [],
        expandedRowRender: o.expandedRowRender || e.expandedRowRender,
        contextSlots: x({}, o)
      }), o);
    };
  }
});
const en = we({
  name: "ATableColumn",
  slots: Object,
  render() {
    return null;
  }
});
const tn = we({
  name: "ATableColumnGroup",
  slots: Object,
  __ANT_TABLE_COLUMN_GROUP: true,
  render() {
    return null;
  }
});
const Cn = pr;
const Sn = mr;
const nn = x(gr, {
  Cell: Sn,
  Row: Cn,
  name: "ATableSummary"
});
const ps = x(Jt, {
  SELECTION_ALL: pn,
  SELECTION_INVERT: hn,
  SELECTION_NONE: yn,
  SELECTION_COLUMN: Qe,
  EXPAND_COLUMN: rt,
  Column: en,
  ColumnGroup: tn,
  Summary: nn,
  install: e => {
    e.component(nn.name, nn);
    e.component(Sn.name, Sn);
    e.component(Cn.name, Cn);
    e.component(Jt.name, Jt);
    e.component(en.name, en);
    e.component(tn.name, tn);
    return e;
  }
});
export { en as TableColumn, tn as TableColumnGroup, nn as TableSummary, Sn as TableSummaryCell, Cn as TableSummaryRow, ps as default, Sl as tableProps };
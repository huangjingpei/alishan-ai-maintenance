import { r as o, a } from "./class-DeKWk5pD.js";
import { ak as r } from "./index-BegIKaMc.js";
function u(e, n, t, i) {
  for (var l = e.length, s = t + -1; ++s < l;) {
    if (n(e[s], s, e)) {
      return s;
    }
  }
  return -1;
}
function h(e) {
  return e !== e;
}
function c(e, n, t) {
  for (var i = t - 1, l = e.length; ++i < l;) {
    if (e[i] === n) {
      return i;
    }
  }
  return -1;
}
function g(e, n, t) {
  if (n === n) {
    return c(e, n, t);
  } else {
    return u(e, h, t);
  }
}
function p(e, n) {
  var t = e == null ? 0 : e.length;
  return !!t && g(e, n, 0) > -1;
}
const y = e => ({
  [e.componentCls]: {
    [`${e.antCls}-motion-collapse-legacy`]: {
      overflow: "hidden",
      "&-active": {
        transition: `height ${e.motionDurationMid} ${e.motionEaseInOut},
        opacity ${e.motionDurationMid} ${e.motionEaseInOut} !important`
      }
    },
    [`${e.antCls}-motion-collapse`]: {
      overflow: "hidden",
      transition: `height ${e.motionDurationMid} ${e.motionEaseInOut},
        opacity ${e.motionDurationMid} ${e.motionEaseInOut} !important`
    }
  }
});
const $ = function (e = "ant-motion-collapse", n = true) {
  return {
    name: e,
    appear: n,
    css: true,
    onBeforeEnter: t => {
      t.style.height = "0px";
      t.style.opacity = "0";
      a(t, e);
    },
    onEnter: t => {
      r(() => {
        t.style.height = `${t.scrollHeight}px`;
        t.style.opacity = "1";
      });
    },
    onAfterEnter: t => {
      if (t) {
        o(t, e);
        t.style.height = null;
        t.style.opacity = null;
      }
    },
    onBeforeLeave: t => {
      a(t, e);
      t.style.height = `${t.offsetHeight}px`;
      t.style.opacity = null;
    },
    onLeave: t => {
      setTimeout(() => {
        t.style.height = "0px";
        t.style.opacity = "0";
      });
    },
    onAfterLeave: t => {
      if (t) {
        o(t, e);
        if (t.style) {
          t.style.height = null;
          t.style.opacity = null;
        }
      }
    }
  };
};
export { p as a, u as b, $ as c, y as g };
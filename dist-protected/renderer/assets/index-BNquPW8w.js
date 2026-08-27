import { _ as a, d as O, b3 as N, a6 as U, i as B, q as c, a3 as w, A as R, aa as D, ab as d } from "./index-BegIKaMc.js";
import { g as H, c as S, d as q, r as M, a as V } from "./index-CQrrWYzL.js";
import "./shallowequal-Clf6RTVF.js";
const T = () => ({
  format: String,
  showNow: d(),
  showHour: d(),
  showMinute: d(),
  showSecond: d(),
  use12Hours: d(),
  hourStep: Number,
  minuteStep: Number,
  secondStep: Number,
  hideDisabledOptions: d(),
  popupClassName: String,
  status: D()
});
function W(u) {
  const _ = H(u, a(a({}, T()), {
    order: {
      type: Boolean,
      default: true
    }
  }));
  const {
    TimePicker: I,
    RangePicker: y
  } = _;
  const A = O({
    name: "ATimePicker",
    inheritAttrs: false,
    props: a(a(a(a({}, S()), q()), T()), {
      addon: {
        type: Function
      }
    }),
    slots: Object,
    setup(m, g) {
      let {
        slots: i,
        expose: C,
        emit: o,
        attrs: h
      } = g;
      const t = m;
      const r = N();
      U(!i.addon && !t.addon, "TimePicker", "`addon` is deprecated. Please use `v-slot:renderExtraFooter` instead.");
      const s = R();
      C({
        focus: () => {
          var n;
          if ((n = s.value) !== null && n !== undefined) {
            n.focus();
          }
        },
        blur: () => {
          var n;
          if ((n = s.value) !== null && n !== undefined) {
            n.blur();
          }
        }
      });
      const k = (n, F) => {
        o("update:value", n);
        o("change", n, F);
        r.onFieldChange();
      };
      const f = n => {
        o("update:open", n);
        o("openChange", n);
      };
      const P = n => {
        o("focus", n);
      };
      const v = n => {
        o("blur", n);
        r.onFieldBlur();
      };
      const b = n => {
        o("ok", n);
      };
      return () => {
        const {
          id: n = r.id.value
        } = t;
        return B(I, c(c(c({}, h), w(t, ["onUpdate:value", "onUpdate:open"])), {}, {
          id: n,
          dropdownClassName: t.popupClassName,
          mode: undefined,
          ref: s,
          renderExtraFooter: t.addon || i.addon || t.renderExtraFooter || i.renderExtraFooter,
          onChange: k,
          onOpenChange: f,
          onFocus: P,
          onBlur: v,
          onOk: b
        }), i);
      };
    }
  });
  const j = O({
    name: "ATimeRangePicker",
    inheritAttrs: false,
    props: a(a(a(a({}, S()), M()), T()), {
      order: {
        type: Boolean,
        default: true
      }
    }),
    slots: Object,
    setup(m, g) {
      let {
        slots: i,
        expose: C,
        emit: o,
        attrs: h
      } = g;
      const t = m;
      const r = R();
      const s = N();
      C({
        focus: () => {
          var e;
          if ((e = r.value) !== null && e !== undefined) {
            e.focus();
          }
        },
        blur: () => {
          var e;
          if ((e = r.value) !== null && e !== undefined) {
            e.blur();
          }
        }
      });
      const k = (e, l) => {
        o("update:value", e);
        o("change", e, l);
        s.onFieldChange();
      };
      const f = e => {
        o("update:open", e);
        o("openChange", e);
      };
      const P = e => {
        o("focus", e);
      };
      const v = e => {
        o("blur", e);
        s.onFieldBlur();
      };
      const b = (e, l) => {
        o("panelChange", e, l);
      };
      const n = e => {
        o("ok", e);
      };
      const F = (e, l, E) => {
        o("calendarChange", e, l, E);
      };
      return () => {
        const {
          id: e = s.id.value
        } = t;
        return B(y, c(c(c({}, h), w(t, ["onUpdate:open", "onUpdate:value"])), {}, {
          id: e,
          dropdownClassName: t.popupClassName,
          picker: "time",
          mode: undefined,
          ref: r,
          onChange: k,
          onOpenChange: f,
          onFocus: P,
          onBlur: v,
          onPanelChange: b,
          onOk: n,
          onCalendarChange: F
        }), i);
      };
    }
  });
  return {
    TimePicker: A,
    TimeRangePicker: j
  };
}
const {
  TimePicker: p,
  TimeRangePicker: x
} = W(V);
const J = a(p, {
  TimePicker: p,
  TimeRangePicker: x,
  install: u => {
    u.component(p.name, p);
    u.component(x.name, x);
    return u;
  }
});
export { p as TimePicker, x as TimeRangePicker, J as default };
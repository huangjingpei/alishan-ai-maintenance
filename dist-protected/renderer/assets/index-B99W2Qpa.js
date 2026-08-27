import { _ as m } from "./index-BegIKaMc.js";
import { g as i, a } from "./index-CQrrWYzL.js";
import "./shallowequal-Clf6RTVF.js";
const {
  DatePicker: n,
  WeekPicker: r,
  MonthPicker: t,
  YearPicker: k,
  TimePicker: P,
  QuarterPicker: o,
  RangePicker: c
} = i(a);
const l = m(n, {
  WeekPicker: r,
  MonthPicker: t,
  YearPicker: k,
  RangePicker: c,
  TimePicker: P,
  QuarterPicker: o,
  install: e => {
    e.component(n.name, n);
    e.component(c.name, c);
    e.component(t.name, t);
    e.component(r.name, r);
    e.component(o.name, o);
    return e;
  }
});
export { t as MonthPicker, o as QuarterPicker, c as RangePicker, r as WeekPicker, l as default };
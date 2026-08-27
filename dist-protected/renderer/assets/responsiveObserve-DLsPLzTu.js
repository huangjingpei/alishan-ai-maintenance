import { bq as x, o as m, _ as l } from "./index-BegIKaMc.js";
const b = ["xxxl", "xxl", "xl", "lg", "md", "sm", "xs"];
const u = r => ({
  xs: `(max-width: ${r.screenXSMax}px)`,
  sm: `(min-width: ${r.screenSM}px)`,
  md: `(min-width: ${r.screenMD}px)`,
  lg: `(min-width: ${r.screenLG}px)`,
  xl: `(min-width: ${r.screenXL}px)`,
  xxl: `(min-width: ${r.screenXXL}px)`,
  xxxl: `{min-width: ${r.screenXXXL}px}`
});
function v() {
  const [, r] = x();
  return m(() => {
    const n = u(r.value);
    const i = new Map();
    let a = -1;
    let c = {};
    return {
      matchHandlers: {},
      dispatch(e) {
        c = e;
        i.forEach(t => t(c));
        return i.size >= 1;
      },
      subscribe(e) {
        if (!i.size) {
          this.register();
        }
        a += 1;
        i.set(a, e);
        e(c);
        return a;
      },
      unsubscribe(e) {
        i.delete(e);
        if (!i.size) {
          this.unregister();
        }
      },
      unregister() {
        Object.keys(n).forEach(e => {
          const t = n[e];
          const s = this.matchHandlers[t];
          if (s != null) {
            s.mql.removeListener(s == null ? undefined : s.listener);
          }
        });
        i.clear();
      },
      register() {
        Object.keys(n).forEach(e => {
          const t = n[e];
          const s = h => {
            let {
              matches: o
            } = h;
            this.dispatch(l(l({}, c), {
              [e]: o
            }));
          };
          const d = window.matchMedia(t);
          d.addListener(s);
          this.matchHandlers[t] = {
            mql: d,
            listener: s
          };
          s(d);
        });
      },
      responsiveMap: n
    };
  });
}
export { b as r, v as u };
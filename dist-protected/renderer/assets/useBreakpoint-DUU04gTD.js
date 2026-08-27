import { u as r } from "./responsiveObserve-DLsPLzTu.js";
import { S as u, z as t, s as a } from "./index-BegIKaMc.js";
function v() {
  const e = a({});
  let s = null;
  const n = r();
  u(() => {
    s = n.value.subscribe(o => {
      e.value = o;
    });
  });
  t(() => {
    n.value.unsubscribe(s);
  });
  return e;
}
export { v as u };
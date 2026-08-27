import { bu as o, A as r } from "./index-BegIKaMc.js";
const f = () => {
  const e = r(new Map());
  const s = t => a => {
    e.value.set(t, a);
  };
  o(() => {
    e.value = new Map();
  });
  return [s, e];
};
export { f as u };
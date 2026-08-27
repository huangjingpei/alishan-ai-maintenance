function l(s, i) {
  if (s.classList) {
    return s.classList.contains(i);
  } else {
    return ` ${s.className} `.indexOf(` ${i} `) > -1;
  }
}
function t(s, i) {
  if (s.classList) {
    s.classList.add(i);
  } else if (!l(s, i)) {
    s.className = `${s.className} ${i}`;
  }
}
function c(s, i) {
  if (s.classList) {
    s.classList.remove(i);
  } else if (l(s, i)) {
    const a = s.className;
    s.className = ` ${a} `.replace(` ${i} `, " ");
  }
}
export { t as a, c as r };
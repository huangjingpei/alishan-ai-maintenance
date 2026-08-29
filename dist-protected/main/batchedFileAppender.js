'use strict';

const fs = require("fs");
function createBatchedFileAppender({
  flushIntervalMs = 250,
  onError = null
} = {}) {
  let list = [];
  let local = null;
  let flag = false;
  function fn(arg1) {
    if (typeof onError !== "function") {
      return;
    }
    try {
      onError(arg1);
    } catch (error) {}
  }
  function fn2() {
    const local = list;
    list = [];
    const map = new Map();
    for (const item of local) {
      map.set(item.filePath, (map.get(item.filePath) || "") + item.content);
    }
    return map;
  }
  function fn3(arg1 = flushIntervalMs) {
    local = setTimeout(fn4, Math.max(0, arg1));
    if (typeof local.unref === "function") {
      local.unref();
    }
  }
  function fn4() {
    if (flag || list.length === 0) {
      return;
    }
    if (local) {
      clearTimeout(local);
      local = null;
    }
    const result = fn2();
    flag = true;
    let value = result.size;
    const local2 = () => {
      value -= 1;
      if (value > 0) {
        return;
      }
      flag = false;
      if (list.length > 0 && !local) {
        fn3();
      }
    };
    for (const [local, local3] of result.entries()) {
      fs.appendFile(local, local3, "utf8", arg1 => {
        if (arg1) {
          fn(arg1);
        }
        local2();
      });
    }
  }
  function append(arg1, arg2, {
    urgent = false
  } = {}) {
    list.push({
      filePath: arg1,
      content: arg2
    });
    if (flag) {
      return;
    }
    if (local) {
      if (!urgent) {
        return;
      }
      clearTimeout(local);
    }
    fn3(urgent ? 0 : flushIntervalMs);
  }
  function flushPendingSync() {
    if (local) {
      clearTimeout(local);
      local = null;
    }
    if (list.length === 0) {
      return;
    }
    const result = fn2();
    for (const [local, local2] of result.entries()) {
      try {
        fs.appendFileSync(local, local2, "utf8");
      } catch (error) {}
    }
  }
  return {
    append: append,
    flushPendingSync: flushPendingSync
  };
}
module.exports = {
  createBatchedFileAppender: createBatchedFileAppender
};
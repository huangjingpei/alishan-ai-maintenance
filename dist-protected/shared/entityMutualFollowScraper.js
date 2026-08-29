function isVisibleElement(arg1) {
  if (!arg1 || typeof arg1.getBoundingClientRect !== "function") {
    return false;
  }
  try {
    const result = window.getComputedStyle(arg1);
    if (result.display === "none" || result.visibility === "hidden" || parseFloat(result.opacity || "1") <= 0.01) {
      return false;
    }
    const result2 = arg1.getBoundingClientRect();
    return result2.width > 0 && result2.height > 0;
  } catch (error) {
    return false;
  }
}
function findEntityFollowingTab(arg1 = null) {
  const result = Array.from(document.querySelectorAll("[role=\"tab\"], .semi-tabs-tab"));
  const result2 = result.find(arg1 => {
    if (!isVisibleElement(arg1)) {
      return false;
    }
    const result = String(arg1.innerText || arg1.textContent || "").replace(/\s+/g, "").trim();
    if (!/^关注(\(\d+\))?$/.test(result)) {
      return false;
    }
    let value = arg1.parentElement;
    while (value && value !== document.body) {
      if (window.getComputedStyle(value).position === "fixed") {
        return true;
      }
      value = value.parentElement;
    }
    return false;
  });
  if (result2) {
    const result = String(result2.innerText || "").trim();
    if (typeof arg1 === "function") {
      arg1("[调试] 成功命中关注Tab: \"" + result + "\"");
    }
    return result2;
  }
  const result3 = Array.from(document.querySelectorAll("[role=\"dialog\"], [class*=\"modal\"], [class*=\"Modal\"], [class*=\"drawer\"], [class*=\"Drawer\"], [class*=\"popup\"], [class*=\"Popup\"], [class*=\"semi-modal\"], [class*=\"semi-drawer\"], [class*=\"semi-portal\"]")).filter(arg1 => isVisibleElement(arg1));
  const value = result3.length ? result3 : [document.body];
  for (const item of value) {
    const result = Array.from(item.querySelectorAll("button, [role=\"tab\"], [role=\"button\"], div, span, a"));
    const result2 = result.find(arg1 => {
      if (!isVisibleElement(arg1)) {
        return false;
      }
      const result = String(arg1.innerText || arg1.textContent || "").replace(/\s+/g, "").trim();
      return /^关注(\(\d+\))?$/.test(result);
    });
    if (!result2) {
      continue;
    }
    const value = result2.matches?.("button, [role=\"tab\"], [role=\"button\"], a") ? result2 : result2.closest?.("button, [role=\"tab\"], [role=\"button\"], a") || result2;
    if (value && typeof arg1 === "function") {
      arg1("[调试] 兜底命中关注Tab: \"" + value.innerText?.trim() + "\"");
    }
    return value;
  }
  if (typeof arg1 === "function") {
    arg1("[调试] 未找到关注Tab，将使用粉丝列表回退模式");
  }
  return null;
}
function findEntityRelationModalContainer(arg1 = null) {
  if (typeof document === "undefined") {
    return null;
  }
  const result = Array.from(document.querySelectorAll("[role=\"dialog\"], [class*=\"modal\"], [class*=\"Modal\"], [class*=\"drawer\"], [class*=\"Drawer\"], [class*=\"popup\"], [class*=\"Popup\"], [class*=\"semi-modal\"], [class*=\"semi-drawer\"], [class*=\"semi-portal\"], [class*=\"userMenu\"], [class*=\"relation\"], [class*=\"fans\"], [class*=\"follow\"]")).filter(arg1 => isVisibleElement(arg1));
  const result2 = result.find(arg1 => {
    const result = String(arg1.innerText || arg1.textContent || "");
    return /关注\s*\(\d+\)/.test(result) && /粉丝\s*\(\d+\)/.test(result) || /搜索用户名字或抖音号/.test(result) || arg1.querySelectorAll("a[href*=\"/user/\"]").length > 0 && /回关|已关注|相互关注/.test(result);
  });
  if (result2) {
    const result = String(result2.className || "").slice(0, 40);
    if (typeof arg1 === "function") {
      arg1("[调试] 明确定位到弹窗容器: <" + result2.tagName + "." + result + ">");
    }
    return result2;
  }
  const result3 = Array.from(document.querySelectorAll("div, section, aside")).filter(arg1 => {
    if (!isVisibleElement(arg1)) {
      return false;
    }
    if (arg1 === document.body || arg1 === document.documentElement) {
      return false;
    }
    const result = arg1.getBoundingClientRect();
    if (result.width < 200 || result.height < 200) {
      return false;
    }
    if (result.width >= window.innerWidth - 10 && result.height >= window.innerHeight - 10) {
      return false;
    }
    const result2 = String(arg1.innerText || arg1.textContent || "");
    if (!/粉丝/.test(result2) && !/关注/.test(result2)) {
      return false;
    }
    const local = arg1.getAttribute?.("role") === "dialog" || /modal|drawer|popup|semi/i.test(arg1.className || "") || /搜索用户名字/.test(result2) || arg1.querySelectorAll("a[href*=\"/user/\"]").length >= 1;
    return local;
  }).sort((arg1, arg2) => arg2.querySelectorAll("a[href*=\"/user/\"]").length - arg1.querySelectorAll("a[href*=\"/user/\"]").length);
  const local = result3[0] || null;
  if (local && typeof arg1 === "function") {
    arg1("[调试] 泛化定位到弹窗容器: <" + local.tagName + "." + String(local.className || "").slice(0, 40) + ">");
  } else if (!local && typeof arg1 === "function") {
    arg1("[调试] 警告: 未能找到弹窗容器!");
  }
  return local;
}
function findEntityRelationListScroller(arg1 = null) {
  const result = findEntityRelationModalContainer();
  if (!result) {
    if (typeof arg1 === "function") {
      arg1("[调试] 无弹窗容器，滚动容器使用 document.body");
    }
    return document.body;
  }
  const result2 = Array.from(result.querySelectorAll("div, ul, section, article"));
  const result3 = result2.filter(arg1 => {
    if (!isVisibleElement(arg1)) {
      return false;
    }
    const result = window.getComputedStyle(arg1);
    const local = /(auto|scroll|overlay)/.test(result.overflowY + " " + result.overflow) || arg1.scrollHeight > arg1.clientHeight + 10;
    if (!local) {
      return false;
    }
    return arg1.querySelectorAll("a[href*=\"/user/\"], a[href*=\"sec_uid\"]").length >= 1;
  }).sort((arg1, arg2) => {
    const value = arg2.scrollHeight - arg2.clientHeight - (arg1.scrollHeight - arg1.clientHeight);
    if (Math.abs(value) > 10) {
      return value;
    }
    return arg2.querySelectorAll("a[href*=\"/user/\"]").length - arg1.querySelectorAll("a[href*=\"/user/\"]").length;
  });
  const local = result3[0] || result;
  if (typeof arg1 === "function") {
    const result = String(local.className || "").slice(0, 40);
    const value = local.querySelectorAll("a[href*=\"/user/\"]").length;
    arg1("[调试] 列表滚动容器: <" + local.tagName + "." + result + ">, scrollH=" + local.scrollHeight + ", clientH=" + local.clientHeight + ", scrollTop=" + local.scrollTop + ", 用户数=" + value);
  }
  return local;
}
function findUserCardRow(arg1, arg2) {
  let local = arg1;
  while (local && local !== arg2 && local !== document.body) {
    const value = local.querySelectorAll("a[href*=\"/user/\"]").length;
    const result = String(local.innerText || local.textContent || "");
    const result2 = /相互关注|已关注|回关|\+ 关注|移除/.test(result);
    if (value <= 3 && result2) {
      return local;
    }
    local = local.parentElement;
  }
  return arg1.closest("li") || arg1.parentElement;
}
function collectEntityRelationUsersFromList({
  sourceType = "mutual",
  collectEntityUsersFromApiBuffer: collectEntityUsersFromApiBuffer,
  normalizeDouyinAuthorProfileUrl: normalizeDouyinAuthorProfileUrl,
  buildEntityUserKey: buildEntityUserKey,
  logFn = null
} = {}) {
  const value = sourceType === "following" ? "following" : "mutual";
  const list = [];
  const set = new Set();
  const value2 = value === "following" ? "关注列表" : "互关";
  if (typeof collectEntityUsersFromApiBuffer === "function") {
    const result = collectEntityUsersFromApiBuffer(value);
    for (const item of result) {
      if (set.has(item.userKey)) {
        continue;
      }
      set.add(item.userKey);
      list.push(item);
    }
  }
  const result = findEntityRelationModalContainer(logFn);
  if (!result) {
    return list;
  }
  const result2 = Array.from(result.querySelectorAll("a[href*=\"/user/\"], a[href*=\"sec_uid\"]"));
  let num = 0;
  for (const item of result2) {
    if (!isVisibleElement(item)) {
      continue;
    }
    const local = item.href || item.getAttribute?.("href") || "";
    if (!local || local.includes("/user/self")) {
      continue;
    }
    const value2 = typeof normalizeDouyinAuthorProfileUrl === "function" ? normalizeDouyinAuthorProfileUrl(local) : local;
    const value3 = typeof buildEntityUserKey === "function" ? buildEntityUserKey(value2) : value2;
    if (!value3 || !value2 || set.has(value3)) {
      continue;
    }
    const local2 = findUserCardRow(item, result) || item.closest("li, div") || item;
    const result2 = String(local2.innerText || local2.textContent || "");
    if (value === "mutual") {
      const local = /相互关注|互相关注/.test(result2) && !/回关/.test(result2);
      if (!local) {
        continue;
      }
    } else {
      const result = /相互关注|互相关注|已关注|移除/.test(result2);
      if (!result) {
        continue;
      }
    }
    let result3 = String(item.innerText || item.textContent || "").replace(/\s+/g, " ").trim().replace(/^@+/, "");
    if (!result3 || /相互关注|互相关注|关注|私信|回关|移除/.test(result3)) {
      const result = String(local2.innerText || "").split(/\n+/).map(arg1 => arg1.trim()).find(arg1 => arg1 && arg1.length <= 40 && !/相互关注|互相关注|关注|粉丝|获赞|私信|回关|移除/.test(arg1));
      result3 = result ? result.replace(/^@+/, "") : "";
    }
    if (!result3) {
      continue;
    }
    set.add(value3);
    list.push({
      nickname: result3,
      userUrl: value2,
      userKey: value3
    });
    num += 1;
  }
  if (typeof logFn === "function") {
    logFn("[调试] 弹窗内共解析 " + result2.length + " 个用户链接，DOM 提取出 " + num + " 个" + value2 + "用户 (总计 " + list.length + ")");
  }
  return list;
}
function collectEntityMutualUsersFromList(options = {}) {
  return collectEntityRelationUsersFromList({
    ...options,
    sourceType: "mutual"
  });
}
async function scrollEntityMutualContainer(arg1, arg2, arg3 = null) {
  const local = arg1 || findEntityRelationListScroller(arg3);
  if (!local) {
    if (typeof arg3 === "function") {
      arg3("[调试] 无法滚动: 未确定滚动目标容器");
    }
    return {
      moved: false,
      atBottom: true
    };
  }
  const local2 = local.scrollTop || 0;
  const local3 = local.scrollHeight || 0;
  const value = local.querySelectorAll("a[href*=\"/user/\"]").length;
  const local4 = local.clientHeight || 400;
  const result = Math.max(0, (local.scrollHeight || 0) - local4);
  const local5 = local2 >= result - 24 && result > 80;
  if (local5) {
    try {
      local.scrollTop = Math.max(0, result - Math.min(320, Math.floor(local4 * 0.6)));
      local.dispatchEvent(new Event("scroll", {
        bubbles: true
      }));
    } catch (error) {}
    if (typeof arg2 === "function") {
      await arg2(280 + Math.random() * 180);
    }
  }
  const result2 = Math.max(480, Math.floor(local4 * (0.85 + Math.random() * 0.45)));
  const result3 = Math.max(0, (local.scrollHeight || 0) - (local.clientHeight || local4));
  try {
    local.scrollTop = Math.min(result3, (local.scrollTop || 0) + result2);
    local.dispatchEvent(new Event("scroll", {
      bubbles: true
    }));
  } catch (error) {}
  if (typeof arg2 === "function") {
    await arg2(220 + Math.random() * 160);
  }
  try {
    local.scrollTop = Math.max(0, (local.scrollHeight || 0) - (local.clientHeight || local4)) + 40;
  } catch (error) {}
  const result4 = Array.from(local.children || []);
  const local6 = result4[result4.length - 1] || local.lastElementChild || local.lastChild;
  if (local6 && typeof local6.scrollIntoView === "function") {
    try {
      local6.scrollIntoView({
        block: "end",
        inline: "nearest"
      });
    } catch (error) {}
  }
  const obj = {
    deltaX: 0,
    deltaY: result2,
    deltaMode: 0,
    bubbles: true,
    cancelable: true,
    view: window
  };
  try {
    local.dispatchEvent(new WheelEvent("wheel", obj));
    local.dispatchEvent(new Event("scroll", {
      bubbles: true
    }));
    if (local6 && typeof local6.dispatchEvent === "function") {
      local6.dispatchEvent(new WheelEvent("wheel", obj));
    }
    const obj2 = {
      key: "PageDown",
      code: "PageDown",
      keyCode: 34,
      which: 34,
      bubbles: true,
      cancelable: true
    };
    local.dispatchEvent(new KeyboardEvent("keydown", obj2));
    local.dispatchEvent(new KeyboardEvent("keyup", obj2));
  } catch (error) {}
  const result5 = findEntityRelationModalContainer();
  if (result5 && result5 !== local) {
    try {
      const result = Math.max(0, (result5.scrollHeight || 0) - (result5.clientHeight || 0));
      if (result > 40) {
        if ((result5.scrollTop || 0) >= result - 24) {
          result5.scrollTop = Math.max(0, result - 240);
        }
        result5.scrollTop = result + 40;
        result5.dispatchEvent(new WheelEvent("wheel", obj));
        result5.dispatchEvent(new Event("scroll", {
          bubbles: true
        }));
      }
    } catch (error) {}
  }
  if (typeof arg2 === "function") {
    await arg2(1600 + Math.random() * 800);
  }
  const local7 = local.scrollTop || 0;
  const local8 = local.scrollHeight || 0;
  const value2 = local.querySelectorAll("a[href*=\"/user/\"]").length;
  const local9 = local7 > local2 + 20 || local8 > local3 + 40 || value2 > value;
  const value3 = local7 >= Math.max(0, local8 - (local.clientHeight || local4)) - 24;
  if (typeof arg3 === "function") {
    arg3("[调试] 互关列表滚动: scrollTop " + local2 + "->" + local7 + ", scrollH " + local3 + "->" + local8 + ", " + ("用户链 " + value + "->" + value2) + (local5 ? "（底部回弹）" : "") + (local9 ? "" : "（本轮无明显位移，可能已到底或容器未命中）"));
  }
  return {
    moved: local9,
    atBottom: value3,
    beforeTop: local2,
    afterTop: local7,
    beforeLinks: value,
    afterLinks: value2
  };
}
function findEntitySelfProfileRelationEntry(text = "fans") {
  const value = text === "following";
  const local = arg1 => {
    if (!arg1) {
      return false;
    }
    return !!arg1.closest?.("header, #douyin-header, [class*=\"userMenuPanelShadowAnimation\"]");
  };
  const value2 = value ? "[data-e2e=\"user-info-follow\"], [data-e2e*=\"user-follow\"], [data-e2e*=\"user-following\"], [data-e2e*=\"following-count\"]" : "[data-e2e=\"user-info-fans\"], [data-e2e*=\"user-fans\"], [data-e2e*=\"user-follower\"]";
  const result = Array.from(document.querySelectorAll(value2)).filter(arg1 => {
    if (!isVisibleElement(arg1) || local(arg1)) {
      return false;
    }
    const result = String(arg1.getAttribute?.("data-e2e") || "");
    if (value && /follow-btn|follow-button/i.test(result)) {
      return false;
    }
    return true;
  });
  if (result.length > 0) {
    return result[0];
  }
  const value3 = value ? ["[data-e2e*=\"user-info-follow\"]", "[data-e2e*=\"user-following\"]", "[data-e2e*=\"following-count\"]", "a[href*=\"following\"]", "button", "[role=\"button\"]", "a", "div", "span", "p"] : ["[data-e2e*=\"user-info-fans\"]", "[data-e2e*=\"user-fans\"]", "[data-e2e*=\"user-follower\"]", "[data-e2e*=\"follower-count\"]", "a[href*=\"follower\"]", "button", "[role=\"button\"]", "a", "div", "span", "p"];
  const result2 = Array.from(document.querySelectorAll(value3.join(","))).filter(arg1 => {
    if (!isVisibleElement(arg1)) {
      return false;
    }
    if (local(arg1)) {
      return false;
    }
    const result = String(arg1.innerText || arg1.textContent || "").replace(/\s+/g, " ").trim();
    if (!result || result.length > 24) {
      return false;
    }
    if (value) {
      if (/粉丝|粉丝团|回关|已关注|相互关注|互相关注|关注Ta|\+关注/.test(result)) {
        return false;
      }
      if (/follow-btn|follow-button/i.test(String(arg1.getAttribute?.("data-e2e") || ""))) {
        return false;
      }
      return /关注/.test(result);
    }
    return /粉丝/.test(result) && !/粉丝团|粉丝群|你的粉丝/.test(result);
  }).sort((arg1, arg2) => {
    const local = arg1 => {
      const result = String(arg1.innerText || arg1.textContent || "").replace(/\s+/g, " ").trim();
      let num = 0;
      const result2 = String(arg1.getAttribute?.("data-e2e") || "");
      const result3 = String(arg1.getAttribute?.("href") || "");
      if (value) {
        if (/user-info-follow|user-following|following-count/i.test(result2)) {
          num += 50;
        }
        if (/following/i.test(result3) && !/follower/i.test(result3)) {
          num += 25;
        }
        if (/^关注\s*\d+(?:\.\d+)?[万wW]?$/.test(result)) {
          num += 20;
        }
        if (/^\d+(?:\.\d+)?[万wW]?关注$/.test(result)) {
          num += 20;
        }
        if (result === "关注") {
          num += 12;
        }
      } else {
        if (/user-info-fans|user-fans/i.test(result2)) {
          num += 50;
        }
        if (/user-follower|follower-count/i.test(result2)) {
          num += 30;
        }
        if (/follower/i.test(result3)) {
          num += 20;
        }
        if (/^粉丝\s*\d+(?:\.\d+)?[万wW]?$/.test(result)) {
          num += 15;
        }
        if (/^\d+(?:\.\d+)?[万wW]?粉丝$/.test(result)) {
          num += 15;
        }
        if (result === "粉丝") {
          num += 10;
        }
      }
      if (arg1.matches?.("a, button, [role=\"button\"]")) {
        num += 10;
      }
      num -= Math.min(result.length, 20) / 20;
      return num;
    };
    return local(arg2) - local(arg1);
  });
  const local2 = result2[0] || null;
  if (!local2) {
    return null;
  }
  if (local2.getAttribute?.("data-e2e") || local2.matches?.("a, button, [role=\"button\"], [class*=\"tfxaETAB\"]")) {
    return local2;
  }
  const local3 = local2.closest?.("a, button, [role=\"button\"], [data-e2e], div[class*=\"tfxaETAB\"]");
  if (local3 && isVisibleElement(local3) && !local(local3)) {
    if (!local3.matches?.("a[href*=\"/user/self\"]") || local3.getAttribute?.("data-e2e")) {
      return local3;
    }
  }
  return local2;
}
function findEntitySelfFansEntry() {
  return findEntitySelfProfileRelationEntry("fans");
}
function findEntitySelfFollowingEntry() {
  return findEntitySelfProfileRelationEntry("following");
}
function resolveEntityRelationProfileEntryKind(arg1) {
  if (arg1 === "following") {
    return "following";
  } else {
    return "fans";
  }
}
module.exports = {
  findEntityFollowingTab: findEntityFollowingTab,
  findEntityRelationModalContainer: findEntityRelationModalContainer,
  findEntityRelationListScroller: findEntityRelationListScroller,
  findEntitySelfProfileRelationEntry: findEntitySelfProfileRelationEntry,
  findEntitySelfFansEntry: findEntitySelfFansEntry,
  findEntitySelfFollowingEntry: findEntitySelfFollowingEntry,
  resolveEntityRelationProfileEntryKind: resolveEntityRelationProfileEntryKind,
  collectEntityRelationUsersFromList: collectEntityRelationUsersFromList,
  collectEntityMutualUsersFromList: collectEntityMutualUsersFromList,
  scrollEntityMutualContainer: scrollEntityMutualContainer
};
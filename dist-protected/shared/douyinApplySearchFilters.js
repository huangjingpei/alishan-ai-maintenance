'use strict';

async function applyOfficialSearchFilters(arg1, arg2, arg3, arg4) {
  const value = arg1.storage;
  const value2 = arg1.isVisibleElement;
  const value3 = arg1.simulateHumanClick;
  const value4 = arg1.randomDelay;
  const value5 = arg1.sleep;
  const value6 = typeof arg1.reportCurrentAction === "function" ? arg1.reportCurrentAction : () => {};
  const value7 = typeof arg1.reportTraceLog === "function" ? arg1.reportTraceLog : () => {};
  const local = arg1.filterSessionMod || null;
  const result = String(arg2?.sort ?? "0");
  const result2 = String(arg2?.time ?? "0");
  const result3 = String(arg2?.duration ?? "0");
  const result4 = String(arg2?.scope ?? "0");
  const result5 = String(arg2?.format ?? "0");
  if (result === "0" && result2 === "0" && result3 === "0" && result4 === "0" && result5 === "0") {
    return {
      skipped: true,
      reason: "all_default"
    };
  }
  const value8 = typeof local?.buildAppliedFiltersBaseKey === "function" ? local.buildAppliedFiltersBaseKey(arg4, arg3) : "applied_filters_" + arg4 + "_" + arg3;
  if (value.getItem(value8) === "true") {
    return {
      skipped: true,
      reason: "already_applied"
    };
  }
  const value9 = value8 + "_attempts";
  const result6 = Number(value.getItem(value9) || 0);
  const value10 = typeof local?.shouldForceMarkFiltersApplied === "function" ? local.shouldForceMarkFiltersApplied({
    attempts: result6,
    maxAttempts: 5
  }) : result6 >= 5;
  if (value10) {
    value.setItem(value8, "true");
    return {
      forced: true,
      attempts: result6
    };
  }
  const local2 = result === "0" || value.getItem(value8 + "_sort") === "true";
  const local3 = result2 === "0" || value.getItem(value8 + "_time") === "true";
  const local4 = result3 === "0" || value.getItem(value8 + "_duration") === "true";
  const local5 = result4 === "0" || value.getItem(value8 + "_scope") === "true";
  const local6 = result5 === "0" || value.getItem(value8 + "_format") === "true";
  if (local2 && local3 && local4 && local5 && local6) {
    value.setItem(value8, "true");
    return {
      done: true,
      reason: "locks_complete"
    };
  }
  value6("正在设置搜索过滤参数...");
  try {
    try {
      arg1.scrollToTop?.();
    } catch (error) {}
    await value5(200);
    const local7 = arg12 => {
      if (typeof arg1.findVisibleBySelector === "function") {
        return arg1.findVisibleBySelector(arg12);
      }
      try {
        return Array.from(document.querySelectorAll(arg12)).find(value2) || null;
      } catch (error) {
        return null;
      }
    };
    const local8 = (arg12, flag = false) => {
      if (typeof arg1.findByExactText === "function") {
        return arg1.findByExactText(arg12, flag);
      }
      const result = Array.from(document.querySelectorAll("button, [role=\"button\"], span, div")).filter(arg1 => (arg1.innerText || "").trim() === arg12);
      const result2 = result.find(arg1 => value2(arg1) && arg1.getBoundingClientRect().height <= 80);
      if (result2) {
        return result2;
      }
      if (flag) {
        return null;
      } else {
        return result[0] || null;
      }
    };
    const local9 = async (arg1, arg2, arg3, arg42) => {
      if (!arg1) {
        return false;
      }
      if (!value2(arg1)) {
        return false;
      }
      await value3(arg1, arg4);
      await value4(1500, 2500, arg4, arg42);
      value.setItem(value8 + "_" + arg2, "true");
      return true;
    };
    const local10 = arg1 => {
      const value = arg1.innerText ? arg1.innerText.trim() : "";
      return value === "筛选" || value === "筛选关闭" || value === "筛选开启" || /^筛选[·•.]?\d*$/.test(value);
    };
    const local11 = () => {
      if (typeof arg1.findFilterToggle === "function") {
        return arg1.findFilterToggle();
      }
      const result = Array.from(document.querySelectorAll("span")).filter(local10);
      const local = result.find(value2) || result[0];
      if (local) {
        return local;
      }
      const result2 = Array.from(document.querySelectorAll("button, [role=\"button\"], div")).filter(local10);
      return result2.find(arg1 => value2(arg1) && arg1.getBoundingClientRect().height <= 80) || result2[0] || null;
    };
    const local12 = () => {
      if (typeof arg1.isFilterPanelOpen === "function") {
        return !!arg1.isFilterPanelOpen();
      }
      return value2(document.querySelector("[data-index1=\"0\"]")) || value2(document.querySelector("[data-index1][data-index2]")) || !!local8("一周内", true) || !!local8("一天内", true) || !!local8("最多点赞", true) || !!local8("最新发布", true) || !!local8("1-5分钟", true);
    };
    const result7 = local12();
    const value6 = result7 ? null : local11();
    const local13 = result7 || !!value6;
    const value10 = typeof local?.shouldCountFilterAttempt === "function" ? local.shouldCountFilterAttempt({
      uiReady: local13
    }) : local13;
    if (!local13) {
      return {
        pending: true,
        reason: "ui_not_ready"
      };
    }
    if (value10) {
      value.setItem(value9, String(result6 + 1));
    }
    if (!result7 && value6) {
      await value3(value6, arg4);
      await value4(1500, 2200, arg4, "等待筛选面板展示");
    }
    if (!local2) {
      const result2 = parseInt(result, 10);
      const result3 = local7("[data-index1=\"0\"][data-index2=\"" + result2 + "\"], [data-index*=\"0-" + result2 + "\"]");
      if (result3) {
        await local9(result3, "sort", "设置搜索排序", "等待排序设定生效");
      } else {
        const list = ["综合排序", "最新发布", "最多点赞"];
        const result = local8(list[result2]);
        if (result) {
          await local9(result, "sort", "设置搜索排序", "等待排序设定生效");
        }
      }
    }
    if (!local3) {
      const result = parseInt(result2, 10);
      const result3 = local7("[data-index1=\"1\"][data-index2=\"" + result + "\"], [data-index*=\"1-" + result + "\"]");
      if (result3) {
        await local9(result3, "time", "设置发布时间", "等待时间设定生效");
      } else {
        const list = ["不限", "一天内", "一周内", "半年内"];
        const result2 = local8(list[result]);
        if (result2) {
          await local9(result2, "time", "设置发布时间", "等待时间设定生效");
        }
      }
    }
    if (!local4) {
      const result = parseInt(result3, 10);
      const result2 = local7("[data-index1=\"2\"][data-index2=\"" + result + "\"], [data-index*=\"2-" + result + "\"]");
      if (result2) {
        await local9(result2, "duration", "设置视频时长", "等待视频时长生效");
      } else {
        const list = ["不限", "1分钟以下", "1-5分钟", "5分钟以上"];
        const result2 = local8(list[result]);
        if (result2) {
          await local9(result2, "duration", "设置视频时长", "等待视频时长生效");
        }
      }
    }
    if (!local5) {
      const result = parseInt(result4, 10);
      const result2 = local7("[data-index1=\"3\"][data-index2=\"" + result + "\"], [data-index*=\"3-" + result + "\"]");
      if (result2) {
        await local9(result2, "scope", "设置搜索范围", "等待搜索范围生效");
      } else {
        const list = ["不限", "关注的人", "最近看过", "还未看过"];
        const result2 = local8(list[result]);
        if (result2) {
          await local9(result2, "scope", "设置搜索范围", "等待搜索范围生效");
        }
      }
    }
    if (!local6) {
      const flag = !!local7("[data-index1=\"4\"]");
      if (flag) {
        const result = parseInt(result5, 10);
        const result2 = local7("[data-index1=\"4\"][data-index2=\"" + result + "\"], [data-index*=\"4-" + result + "\"]");
        if (result2) {
          await local9(result2, "format", "设置内容形式", "等待内容形式生效");
        } else {
          const list = ["不限", "视频", "图文"];
          const result2 = local8(list[result]);
          if (result2) {
            await local9(result2, "format", "设置内容形式", "等待内容形式生效");
          }
        }
      } else {
        value.setItem(value8 + "_format", "true");
      }
    }
    const local14 = result === "0" || value.getItem(value8 + "_sort") === "true";
    const local15 = result2 === "0" || value.getItem(value8 + "_time") === "true";
    const local16 = result3 === "0" || value.getItem(value8 + "_duration") === "true";
    const local17 = result4 === "0" || value.getItem(value8 + "_scope") === "true";
    const local18 = result5 === "0" || value.getItem(value8 + "_format") === "true";
    if (local14 && local15 && local16 && local17 && local18) {
      value.setItem(value8, "true");
      try {
        arg1.bumpSearchApiGeneration?.();
      } catch (error) {}
      return {
        success: true
      };
    }
    if (value.getItem(value8 + "_warned") !== "true") {
      value.setItem(value8 + "_warned", "true");
      const list = [];
      if (!local14) {
        list.push("排序");
      }
      if (!local15) {
        list.push("发布时间");
      }
      if (!local16) {
        list.push("视频时长");
      }
      if (!local17) {
        list.push("搜索范围");
      }
      if (!local18) {
        list.push("内容形式");
      }
      value7("⚠️ 官方筛选未点上：" + list.join("、") + "，本轮按未筛选结果采集", null, "warning");
      return {
        partial: true,
        missing: list
      };
    }
    return {
      partial: true
    };
  } catch (error) {
    return {
      error: true,
      message: String(error?.message || error)
    };
  }
}
function areOfficialSearchFilterItemLocksReady(arg1, arg2, arg3, arg4, arg5 = null) {
  const result = String(arg2?.sort ?? "0");
  const result2 = String(arg2?.time ?? "0");
  const result3 = String(arg2?.duration ?? "0");
  const result4 = String(arg2?.scope ?? "0");
  const result5 = String(arg2?.format ?? "0");
  if (result === "0" && result2 === "0" && result3 === "0" && result4 === "0" && result5 === "0") {
    return true;
  }
  const value = typeof arg5?.buildAppliedFiltersBaseKey === "function" ? arg5.buildAppliedFiltersBaseKey(arg4, arg3) : "applied_filters_" + arg4 + "_" + arg3;
  const local = (arg12, arg2) => arg12 === "0" || arg1.getItem(value + "_" + arg2) === "true";
  return local(result, "sort") && local(result2, "time") && local(result3, "duration") && local(result4, "scope") && local(result5, "format");
}
module.exports = {
  applyOfficialSearchFilters: applyOfficialSearchFilters,
  areOfficialSearchFilterItemLocksReady: areOfficialSearchFilterItemLocksReady
};
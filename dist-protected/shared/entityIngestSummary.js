'use strict';

function formatEntityIngestSummary(options = {}) {
  const result = Number(options.synced || 0);
  const result2 = Number(options.duplicates || 0);
  const result3 = Number(options.alreadyCounted || 0);
  const result4 = Number(options.inPool ?? result2);
  const result5 = Number(options.skipped || 0);
  const result6 = Number(options.truncated || 0);
  const result7 = Number(options.received || 0);
  const value = result4 > 0 ? result4 : result === 0 && result3 === 0 && result5 === 0 && result7 > 0 ? result7 : 0;
  if (result === 0 && result3 > 0 && value === 0) {
    return "已入库 " + result3;
  }
  if (result === 0 && value > 0) {
    return "已经有 " + value + " 条在库";
  }
  const list = ["新入库 " + result];
  if (value > 0) {
    list.push("已经有 " + value + " 条在库");
  }
  if (result3 > 0 && (result > 0 || value > 0)) {
    list.push("本轮已计入 " + result3);
  }
  if (result === 0 && value === 0 && result3 === 0) {
    if (result5 > 0) {
      list.push("缺字段跳过 " + result5);
    }
    if (result6 > 0) {
      list.push("已达上限未入 " + result6);
    }
  }
  return list.join("，");
}
function entityIngestSummaryLevel(options = {}) {
  const result = Number(options.synced || 0);
  const result2 = Number(options.duplicates || 0);
  const result3 = Number(options.alreadyCounted || 0);
  const result4 = Number(options.inPool ?? result2);
  const result5 = Number(options.received || 0);
  if (result > 0 || result4 > 0 || result3 > 0) {
    return "success";
  }
  if (result === 0 && result5 > 0 && Number(options.skipped || 0) === 0) {
    return "success";
  }
  return "info";
}
module.exports = {
  formatEntityIngestSummary: formatEntityIngestSummary,
  entityIngestSummaryLevel: entityIngestSummaryLevel
};
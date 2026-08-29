const os = require("os");
const GB = 1073741824;
const LIVE_CONCURRENCY_DEFAULT = 4;
const LIVE_CONCURRENCY_MIN = 1;
const LIVE_CONCURRENCY_MAX = 10;
function isAnonymousEntityAccountId(arg1) {
  const result = String(arg1 || "").trim();
  return result === "anonymous" || result.startsWith("anonymous:");
}
function normalizeLiveConcurrency(arg1, arg2 = LIVE_CONCURRENCY_DEFAULT) {
  const value = Number.isFinite(Number(arg2)) ? Math.max(LIVE_CONCURRENCY_MIN, Math.min(LIVE_CONCURRENCY_MAX, Math.floor(Number(arg2)) || LIVE_CONCURRENCY_DEFAULT)) : LIVE_CONCURRENCY_DEFAULT;
  if (arg1 == null || arg1 === "") {
    return value;
  }
  const result = Number(arg1);
  if (!Number.isFinite(result)) {
    return value;
  }
  return Math.max(LIVE_CONCURRENCY_MIN, Math.min(LIVE_CONCURRENCY_MAX, Math.floor(result)));
}
function calculateLiveRoomConcurrencyDetails({
  roomCount = 1,
  totalMemBytes: totalMemBytes,
  freeMemBytes: freeMemBytes,
  cpuCores: cpuCores,
  hardMax = LIVE_CONCURRENCY_DEFAULT
} = {}) {
  const result = Math.max(1, Math.floor(Number(roomCount) || 1));
  const value = Number(totalMemBytes) / GB;
  const value2 = Number(freeMemBytes) / GB;
  const result2 = Math.max(1, Math.floor(Number(cpuCores) || 1));
  const result3 = normalizeLiveConcurrency(hardMax, LIVE_CONCURRENCY_DEFAULT);
  const value3 = !Number.isFinite(value) || value < 12 ? 1 : value < 24 ? 2 : value < 40 ? 4 : value < 56 ? 6 : result3;
  const value4 = result2 <= 4 ? 1 : result2 <= 8 ? 2 : result2 <= 12 ? 4 : result2 <= 16 ? 6 : result3;
  const value5 = !Number.isFinite(value2) || value2 < 2 ? 1 : value2 < 4 ? 2 : value2 < 8 ? 4 : value2 < 12 ? 6 : result3;
  const result4 = Math.max(1, Math.min(result, result3, value3, value4, value5));
  let text = "";
  if (result4 < result3) {
    if (value5 < result3 && value5 <= result4) {
      text = "可用内存仅 " + (Number.isFinite(value2) ? value2.toFixed(1) + "GB" : "未知") + "，安全并发压到 " + result4;
    } else if (value3 < result3 && value3 <= result4) {
      text = "总内存 " + (Number.isFinite(value) ? value.toFixed(0) + "GB" : "未知") + "，安全并发压到 " + result4;
    } else if (value4 < result3 && value4 <= result4) {
      text = "CPU " + result2 + " 核，安全并发压到 " + result4;
    } else if (result < result3) {
      text = "直播间仅 " + result + " 个";
    }
  }
  return {
    workers: result4,
    configuredMax: result3,
    memoryCap: value3,
    cpuCap: value4,
    freeMemoryCap: value5,
    freeMemGB: Number.isFinite(value2) ? value2 : 0,
    totalMemGB: Number.isFinite(value) ? value : 0,
    cores: result2,
    reason: text
  };
}
function calculateLiveRoomConcurrency(options = {}) {
  return calculateLiveRoomConcurrencyDetails(options).workers;
}
function getLocalLiveRoomConcurrency(arg1, arg2 = LIVE_CONCURRENCY_DEFAULT) {
  return calculateLiveRoomConcurrency({
    roomCount: arg1,
    totalMemBytes: os.totalmem(),
    freeMemBytes: os.freemem(),
    cpuCores: os.cpus().length,
    hardMax: arg2
  });
}
function getLocalLiveRoomConcurrencyDetails(arg1, arg2 = LIVE_CONCURRENCY_DEFAULT) {
  return calculateLiveRoomConcurrencyDetails({
    roomCount: arg1,
    totalMemBytes: os.totalmem(),
    freeMemBytes: os.freemem(),
    cpuCores: os.cpus().length,
    hardMax: arg2
  });
}
function classifyLiveRoomAvailability({
  text = "",
  hasChatContainer = false,
  elapsedMs = 0,
  capturedAnyEvent = false,
  privacyAudienceOnly = false,
  privacyAudienceCount = 0
} = {}) {
  const result = String(text || "").replace(/\s+/g, " ").trim();
  if (/直播(?:间)?已结束|直播结束了|主播已下播|该直播间已关闭|本场直播已结束|主播暂时不在/.test(result)) {
    return {
      ended: true,
      reason: "live_ended",
      message: "直播间已经结束"
    };
  }
  if (/私密直播|加密直播|密码房|输入密码|需要密码|仅邀请|仅好友可见|好友可见|直播间已加密|无法进入(?:该)?直播间|该直播间仅.*可见|主播开启了隐私保护|不支持查看他人资料|观众资料.*不可见|隐私设置.*无法观看/.test(result)) {
    return {
      ended: true,
      reason: "live_private",
      message: "直播间为私密或隐私设置，已跳过"
    };
  }
  if (privacyAudienceOnly && Number(privacyAudienceCount) >= 3 && (Number(elapsedMs) >= 8000 || Number(privacyAudienceCount) >= 8)) {
    return {
      ended: true,
      reason: "live_private",
      message: "直播间开启了观众隐私保护，已跳过"
    };
  }
  if (Number(elapsedMs) >= 10000 && !hasChatContainer && /直播不存在|房间不存在|页面不存在|服务器开小差|点击刷新重试|暂时无法观看/.test(result)) {
    return {
      ended: true,
      reason: "live_unavailable",
      message: "直播间当前不可用"
    };
  }
  if (Number(elapsedMs) >= 30000 && !hasChatContainer && !capturedAnyEvent) {
    return {
      ended: true,
      reason: "live_unavailable",
      message: "未检测到有效直播内容，直播间可能已结束或无法访问"
    };
  }
  return {
    ended: false,
    reason: "",
    message: ""
  };
}
module.exports = {
  LIVE_CONCURRENCY_DEFAULT: LIVE_CONCURRENCY_DEFAULT,
  LIVE_CONCURRENCY_MIN: LIVE_CONCURRENCY_MIN,
  LIVE_CONCURRENCY_MAX: LIVE_CONCURRENCY_MAX,
  calculateLiveRoomConcurrency: calculateLiveRoomConcurrency,
  calculateLiveRoomConcurrencyDetails: calculateLiveRoomConcurrencyDetails,
  getLocalLiveRoomConcurrency: getLocalLiveRoomConcurrency,
  getLocalLiveRoomConcurrencyDetails: getLocalLiveRoomConcurrencyDetails,
  isAnonymousEntityAccountId: isAnonymousEntityAccountId,
  normalizeLiveConcurrency: normalizeLiveConcurrency,
  classifyLiveRoomAvailability: classifyLiveRoomAvailability
};
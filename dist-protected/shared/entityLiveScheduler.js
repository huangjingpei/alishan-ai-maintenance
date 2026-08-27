const os = require("os");
const GB = 1073741824;
const LIVE_CONCURRENCY_DEFAULT = 4;
const LIVE_CONCURRENCY_MIN = 1;
const LIVE_CONCURRENCY_MAX = 10;
function isAnonymousEntityAccountId(_0x5364aa) {
  const _0x17d87b = String(_0x5364aa || "").trim();
  return _0x17d87b === "anonymous" || _0x17d87b.startsWith("anonymous:");
}
function normalizeLiveConcurrency(_0x5ba740, _0x105e26 = LIVE_CONCURRENCY_DEFAULT) {
  const _0x63b13f = Number.isFinite(Number(_0x105e26)) ? Math.max(LIVE_CONCURRENCY_MIN, Math.min(LIVE_CONCURRENCY_MAX, Math.floor(Number(_0x105e26)) || LIVE_CONCURRENCY_DEFAULT)) : LIVE_CONCURRENCY_DEFAULT;
  if (_0x5ba740 == null || _0x5ba740 === "") {
    return _0x63b13f;
  }
  const _0x2d376f = Number(_0x5ba740);
  if (!Number.isFinite(_0x2d376f)) {
    return _0x63b13f;
  }
  return Math.max(LIVE_CONCURRENCY_MIN, Math.min(LIVE_CONCURRENCY_MAX, Math.floor(_0x2d376f)));
}
function calculateLiveRoomConcurrencyDetails({
  roomCount = 1,
  totalMemBytes: _0x3b3242,
  freeMemBytes: _0x3860c4,
  cpuCores: _0x2931b9,
  hardMax = LIVE_CONCURRENCY_DEFAULT
} = {}) {
  const _0x16e8bf = Math.max(1, Math.floor(Number(roomCount) || 1));
  const _0x3a4dad = Number(_0x3b3242) / GB;
  const _0x4c8460 = Number(_0x3860c4) / GB;
  const _0x363272 = Math.max(1, Math.floor(Number(_0x2931b9) || 1));
  const _0x1c2cfa = normalizeLiveConcurrency(hardMax, LIVE_CONCURRENCY_DEFAULT);
  const _0x5e7534 = !Number.isFinite(_0x3a4dad) || _0x3a4dad < 12 ? 1 : _0x3a4dad < 24 ? 2 : _0x3a4dad < 40 ? 4 : _0x3a4dad < 56 ? 6 : _0x1c2cfa;
  const _0x5b2e5e = _0x363272 <= 4 ? 1 : _0x363272 <= 8 ? 2 : _0x363272 <= 12 ? 4 : _0x363272 <= 16 ? 6 : _0x1c2cfa;
  const _0x249587 = !Number.isFinite(_0x4c8460) || _0x4c8460 < 2 ? 1 : _0x4c8460 < 4 ? 2 : _0x4c8460 < 8 ? 4 : _0x4c8460 < 12 ? 6 : _0x1c2cfa;
  const _0x1c3298 = Math.max(1, Math.min(_0x16e8bf, _0x1c2cfa, _0x5e7534, _0x5b2e5e, _0x249587));
  let _0x83fa35 = "";
  if (_0x1c3298 < _0x1c2cfa) {
    if (_0x249587 < _0x1c2cfa && _0x249587 <= _0x1c3298) {
      _0x83fa35 = "可用内存仅 " + (Number.isFinite(_0x4c8460) ? _0x4c8460.toFixed(1) + "GB" : "未知") + "，安全并发压到 " + _0x1c3298;
    } else if (_0x5e7534 < _0x1c2cfa && _0x5e7534 <= _0x1c3298) {
      _0x83fa35 = "总内存 " + (Number.isFinite(_0x3a4dad) ? _0x3a4dad.toFixed(0) + "GB" : "未知") + "，安全并发压到 " + _0x1c3298;
    } else if (_0x5b2e5e < _0x1c2cfa && _0x5b2e5e <= _0x1c3298) {
      _0x83fa35 = "CPU " + _0x363272 + " 核，安全并发压到 " + _0x1c3298;
    } else if (_0x16e8bf < _0x1c2cfa) {
      _0x83fa35 = "直播间仅 " + _0x16e8bf + " 个";
    }
  }
  return {
    workers: _0x1c3298,
    configuredMax: _0x1c2cfa,
    memoryCap: _0x5e7534,
    cpuCap: _0x5b2e5e,
    freeMemoryCap: _0x249587,
    freeMemGB: Number.isFinite(_0x4c8460) ? _0x4c8460 : 0,
    totalMemGB: Number.isFinite(_0x3a4dad) ? _0x3a4dad : 0,
    cores: _0x363272,
    reason: _0x83fa35
  };
}
function calculateLiveRoomConcurrency(_0x43cd04 = {}) {
  return calculateLiveRoomConcurrencyDetails(_0x43cd04).workers;
}
function getLocalLiveRoomConcurrency(_0x1ca982, _0x95b608 = LIVE_CONCURRENCY_DEFAULT) {
  return calculateLiveRoomConcurrency({
    roomCount: _0x1ca982,
    totalMemBytes: os.totalmem(),
    freeMemBytes: os.freemem(),
    cpuCores: os.cpus().length,
    hardMax: _0x95b608
  });
}
function getLocalLiveRoomConcurrencyDetails(_0x27f8fe, _0x3cc73d = LIVE_CONCURRENCY_DEFAULT) {
  return calculateLiveRoomConcurrencyDetails({
    roomCount: _0x27f8fe,
    totalMemBytes: os.totalmem(),
    freeMemBytes: os.freemem(),
    cpuCores: os.cpus().length,
    hardMax: _0x3cc73d
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
  const _0x45e288 = String(text || "").replace(/\s+/g, " ").trim();
  if (/直播(?:间)?已结束|直播结束了|主播已下播|该直播间已关闭|本场直播已结束|主播暂时不在/.test(_0x45e288)) {
    return {
      ended: true,
      reason: "live_ended",
      message: "直播间已经结束"
    };
  }
  if (/私密直播|加密直播|密码房|输入密码|需要密码|仅邀请|仅好友可见|好友可见|直播间已加密|无法进入(?:该)?直播间|该直播间仅.*可见|主播开启了隐私保护|不支持查看他人资料|观众资料.*不可见|隐私设置.*无法观看/.test(_0x45e288)) {
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
  if (Number(elapsedMs) >= 10000 && !hasChatContainer && /直播不存在|房间不存在|页面不存在|服务器开小差|点击刷新重试|暂时无法观看/.test(_0x45e288)) {
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
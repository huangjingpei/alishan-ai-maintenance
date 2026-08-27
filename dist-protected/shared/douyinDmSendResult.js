'use strict';

function compactDmResultText(_0x4c8d8c) {
  return String(_0x4c8d8c || "").replace(/[\u200b-\u200f\u202a-\u202e\u2060-\u206f]/g, "").replace(/\s+/g, " ").trim();
}
const DM_PLATFORM_HINT_RULES = [{
  code: "mutual_follow_only",
  type: "privacy_settings",
  pattern: /对方设置了仅互相关注的人可发消息(?:[，,]\s*)?需要对方修改权限后可发消息/,
  text: "对方仅允许互相关注的人发消息，需要对方修改权限后才能发送"
}, {
  code: "privacy_settings",
  type: "privacy_settings",
  pattern: /由于对方的隐私设置(?:[，,]\s*)?你无法发送消息/,
  text: "对方账号设置了隐私，无法私信"
}, {
  code: "mutual_follow_only",
  type: "privacy_settings",
  pattern: /(?:只能给互关朋友发消息|未互相关注[^。！？；\n]{0,24}|对方设置了[^。！？；\n]{0,48}(?:才|可)发消息(?:[，,][^。！？；\n]{0,48})?)/,
  text: "对方仅允许互相关注的人发消息"
}, {
  code: "rate_limited",
  type: "platform_block",
  pattern: /(?:操作太频繁|发送过于频繁|请稍后再试)/,
  text: "平台提示操作频繁，请稍后再试"
}, {
  code: "content_blocked",
  type: "platform_block",
  pattern: /(?:内容不符合|包含违规|内容违规|消息发送受限)/,
  text: "私信内容被平台限制"
}, {
  code: "network_error",
  type: "platform_block",
  pattern: /(?:网络异常|网络不太顺畅|服务异常)/,
  text: "网络或平台服务异常"
}, {
  code: "send_blocked",
  type: "platform_block",
  pattern: /(?:发送失败|私信失败|无法发送|暂不支持私信|对方设置了)/,
  text: "平台阻止了本次私信发送"
}];
function classifyDouyinDmPlatformHint(_0xc108b0 = "") {
  const _0xfb86fd = compactDmResultText(_0xc108b0);
  if (!_0xfb86fd) {
    return null;
  }
  for (const _0x3ef99b of DM_PLATFORM_HINT_RULES) {
    const _0x507f89 = _0xfb86fd.match(_0x3ef99b.pattern);
    if (!_0x507f89) {
      continue;
    }
    return {
      code: _0x3ef99b.code,
      type: _0x3ef99b.type,
      text: _0x3ef99b.text,
      raw: compactDmResultText(_0x507f89[0]).slice(0, 160)
    };
  }
  return null;
}
function resolveDouyinDmSendResult(_0x391a4c = {}) {
  const _0x18f6dc = _0x391a4c.platformHint && typeof _0x391a4c.platformHint === "object" ? _0x391a4c.platformHint : classifyDouyinDmPlatformHint(_0x391a4c.platformHint || "");
  const _0x271946 = compactDmResultText(_0x391a4c.inputText || "");
  if (_0x18f6dc) {
    const _0x1689db = _0x18f6dc.type === "privacy_settings";
    return {
      ok: false,
      status: _0x1689db ? "blocked" : "failed",
      blocked: _0x1689db,
      blockType: _0x18f6dc.type || "platform_block",
      errorCode: _0x18f6dc.code || "platform_block",
      reason: _0x18f6dc.text || _0x18f6dc.raw || "平台阻止了本次私信发送",
      platformHint: _0x18f6dc
    };
  }
  if (_0x391a4c.failureMarkerFound) {
    return {
      ok: false,
      status: "failed",
      blocked: false,
      blockType: "send_failed",
      errorCode: "bubble_send_failed",
      reason: "消息气泡显示红色失败标记，私信未发送成功",
      failureMarker: _0x391a4c.failureMarker || null
    };
  }
  if (_0x391a4c.bubbleFound) {
    return {
      ok: true,
      status: "sent",
      blocked: false,
      blockType: "",
      errorCode: "",
      reason: "",
      verified: true,
      snippet: compactDmResultText(_0x391a4c.snippet || "")
    };
  }
  return {
    ok: false,
    status: "pending",
    blocked: false,
    blockType: "",
    errorCode: _0x271946 ? "input_not_cleared" : "bubble_pending",
    reason: _0x271946 ? "输入框仍有内容，等待发送结果" : "等待消息气泡或平台提示",
    inputCleared: !_0x271946
  };
}
module.exports = {
  DM_PLATFORM_HINT_RULES: DM_PLATFORM_HINT_RULES,
  classifyDouyinDmPlatformHint: classifyDouyinDmPlatformHint,
  compactDmResultText: compactDmResultText,
  resolveDouyinDmSendResult: resolveDouyinDmSendResult
};
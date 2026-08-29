'use strict';

function compactDmResultText(arg1) {
  return String(arg1 || "").replace(/[\u200b-\u200f\u202a-\u202e\u2060-\u206f]/g, "").replace(/\s+/g, " ").trim();
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
function classifyDouyinDmPlatformHint(text = "") {
  const result = compactDmResultText(text);
  if (!result) {
    return null;
  }
  for (const item of DM_PLATFORM_HINT_RULES) {
    const result2 = result.match(item.pattern);
    if (!result2) {
      continue;
    }
    return {
      code: item.code,
      type: item.type,
      text: item.text,
      raw: compactDmResultText(result2[0]).slice(0, 160)
    };
  }
  return null;
}
function resolveDouyinDmSendResult(options = {}) {
  const value = options.platformHint && typeof options.platformHint === "object" ? options.platformHint : classifyDouyinDmPlatformHint(options.platformHint || "");
  const result = compactDmResultText(options.inputText || "");
  if (value) {
    const value2 = value.type === "privacy_settings";
    return {
      ok: false,
      status: value2 ? "blocked" : "failed",
      blocked: value2,
      blockType: value.type || "platform_block",
      errorCode: value.code || "platform_block",
      reason: value.text || value.raw || "平台阻止了本次私信发送",
      platformHint: value
    };
  }
  if (options.failureMarkerFound) {
    return {
      ok: false,
      status: "failed",
      blocked: false,
      blockType: "send_failed",
      errorCode: "bubble_send_failed",
      reason: "消息气泡显示红色失败标记，私信未发送成功",
      failureMarker: options.failureMarker || null
    };
  }
  if (options.bubbleFound) {
    return {
      ok: true,
      status: "sent",
      blocked: false,
      blockType: "",
      errorCode: "",
      reason: "",
      verified: true,
      snippet: compactDmResultText(options.snippet || "")
    };
  }
  return {
    ok: false,
    status: "pending",
    blocked: false,
    blockType: "",
    errorCode: result ? "input_not_cleared" : "bubble_pending",
    reason: result ? "输入框仍有内容，等待发送结果" : "等待消息气泡或平台提示",
    inputCleared: !result
  };
}
module.exports = {
  DM_PLATFORM_HINT_RULES: DM_PLATFORM_HINT_RULES,
  classifyDouyinDmPlatformHint: classifyDouyinDmPlatformHint,
  compactDmResultText: compactDmResultText,
  resolveDouyinDmSendResult: resolveDouyinDmSendResult
};
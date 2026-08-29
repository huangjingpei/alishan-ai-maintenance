'use strict';

function isDouyinChatSystemHint(arg1) {
  const result = String(arg1 || "").replace(/\s+/g, " ").trim();
  if (!result) {
    return true;
  }
  if (/对方回复或关注你之前|只能发送一条(?:文字)?消息|请礼貌发言|自觉遵守《?抖音自律公约》?/.test(result)) {
    return true;
  }
  if (result.length > 120) {
    return false;
  }
  return /关注了你|已经关注|已关注|回关|互相关注|可以开始聊天|打招呼消息|以上是打招呼|对方回复前|陌生人消息|安全提示|消息已发出|已发送|点击查看|抖音小助手|官方通知|你们已成为好友|开始聊天吧/.test(result);
}
function classLooksLikeSelfChatBubble(text = "", text2 = "") {
  const result = String(text || "");
  const result2 = String(text2 || "");
  if (/\b(?:self|own|myself)-(?:msg|bubble|item|message)\b/i.test(result)) {
    return true;
  }
  if (/(?:^|[\s"'_-])(?:isSelf|is-self|from-self|fromSelf|selfMessage|SelfMessage|message-self|MessageSelf)(?:[\s"'_-]|$)/.test(result + " " + result2)) {
    return true;
  }
  if (/data-(?:self|own)=["']?(?:true|1)/i.test(result2)) {
    return true;
  }
  return false;
}
function isChatBubbleAlignedSelf(arg1, arg2) {
  if (!arg1 || !(arg1.width > 0) || !arg2 || !(arg2.width > 80)) {
    return false;
  }
  const value = Number(arg2.left) + Number(arg2.width) / 2;
  const value2 = Number(arg1.left) + Number(arg1.width) / 2;
  return value2 > value + Math.min(48, Number(arg2.width) * 0.12);
}
function isRealSelfOutboundChatMessage(options = {}) {
  if (!options || !options.isSelf) {
    return false;
  }
  if (isDouyinChatSystemHint(options.text)) {
    return false;
  }
  return String(options.text || "").replace(/\s+/g, " ").trim().length >= 2;
}
module.exports = {
  isDouyinChatSystemHint: isDouyinChatSystemHint,
  classLooksLikeSelfChatBubble: classLooksLikeSelfChatBubble,
  isChatBubbleAlignedSelf: isChatBubbleAlignedSelf,
  isRealSelfOutboundChatMessage: isRealSelfOutboundChatMessage
};
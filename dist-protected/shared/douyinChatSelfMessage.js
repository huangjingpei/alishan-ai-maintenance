'use strict';

function isDouyinChatSystemHint(_0x19086b) {
  const _0x4b6798 = String(_0x19086b || "").replace(/\s+/g, " ").trim();
  if (!_0x4b6798) {
    return true;
  }
  if (/对方回复或关注你之前|只能发送一条(?:文字)?消息|请礼貌发言|自觉遵守《?抖音自律公约》?/.test(_0x4b6798)) {
    return true;
  }
  if (_0x4b6798.length > 120) {
    return false;
  }
  return /关注了你|已经关注|已关注|回关|互相关注|可以开始聊天|打招呼消息|以上是打招呼|对方回复前|陌生人消息|安全提示|消息已发出|已发送|点击查看|抖音小助手|官方通知|你们已成为好友|开始聊天吧/.test(_0x4b6798);
}
function classLooksLikeSelfChatBubble(_0x2e722f = "", _0x572841 = "") {
  const _0x36d145 = String(_0x2e722f || "");
  const _0x1af28c = String(_0x572841 || "");
  if (/\b(?:self|own|myself)-(?:msg|bubble|item|message)\b/i.test(_0x36d145)) {
    return true;
  }
  if (/(?:^|[\s"'_-])(?:isSelf|is-self|from-self|fromSelf|selfMessage|SelfMessage|message-self|MessageSelf)(?:[\s"'_-]|$)/.test(_0x36d145 + " " + _0x1af28c)) {
    return true;
  }
  if (/data-(?:self|own)=["']?(?:true|1)/i.test(_0x1af28c)) {
    return true;
  }
  return false;
}
function isChatBubbleAlignedSelf(_0x5c3c60, _0x299ab2) {
  if (!_0x5c3c60 || !(_0x5c3c60.width > 0) || !_0x299ab2 || !(_0x299ab2.width > 80)) {
    return false;
  }
  const _0x98e2d4 = Number(_0x299ab2.left) + Number(_0x299ab2.width) / 2;
  const _0xb5f5 = Number(_0x5c3c60.left) + Number(_0x5c3c60.width) / 2;
  return _0xb5f5 > _0x98e2d4 + Math.min(48, Number(_0x299ab2.width) * 0.12);
}
function isRealSelfOutboundChatMessage(_0x12ed30 = {}) {
  if (!_0x12ed30 || !_0x12ed30.isSelf) {
    return false;
  }
  if (isDouyinChatSystemHint(_0x12ed30.text)) {
    return false;
  }
  return String(_0x12ed30.text || "").replace(/\s+/g, " ").trim().length >= 2;
}
module.exports = {
  isDouyinChatSystemHint: isDouyinChatSystemHint,
  classLooksLikeSelfChatBubble: classLooksLikeSelfChatBubble,
  isChatBubbleAlignedSelf: isChatBubbleAlignedSelf,
  isRealSelfOutboundChatMessage: isRealSelfOutboundChatMessage
};
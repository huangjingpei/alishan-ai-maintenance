'use strict';

const RANDOM_TEXT_SUFFIX_ZWC = ["͏", "᠎", "​", "‌", "‍", "⁠", "⁡", "⁢", "⁣", "⁤", "﻿"];
const RANDOM_TEXT_SUFFIX_EMOJIS = ["😊", "🙂", "😄", "😁", "😃", "🤗", "😌", "😇", "👍", "👏", "🙌", "🤝", "✌️", "👋", "💪", "✨", "🌟", "⭐", "💫", "☀️", "🎉", "🎊"];
function buildRandomEmojiSuffix(_0x18b6a7 = Math.random) {
  const _0x1b16f3 = 4 + Math.floor(_0x18b6a7() * 5);
  const _0x2fa9c9 = Array.from({
    length: _0x1b16f3
  }, () => RANDOM_TEXT_SUFFIX_ZWC[Math.floor(_0x18b6a7() * RANDOM_TEXT_SUFFIX_ZWC.length)]).join("");
  const _0x5a275a = RANDOM_TEXT_SUFFIX_EMOJIS[Math.floor(_0x18b6a7() * RANDOM_TEXT_SUFFIX_EMOJIS.length)];
  return " " + _0x5a275a + _0x2fa9c9;
}
function appendRandomEmojiSuffix(_0x3c24c1, _0x3ec481 = Math.random) {
  const _0x876a57 = String(_0x3c24c1 || "");
  if (!_0x876a57.trim()) {
    return _0x876a57;
  }
  return _0x876a57 + buildRandomEmojiSuffix(_0x3ec481);
}
module.exports = {
  appendRandomEmojiSuffix: appendRandomEmojiSuffix,
  buildRandomEmojiSuffix: buildRandomEmojiSuffix
};
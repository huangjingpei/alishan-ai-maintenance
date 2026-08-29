'use strict';

const RANDOM_TEXT_SUFFIX_ZWC = ["͏", "᠎", "​", "‌", "‍", "⁠", "⁡", "⁢", "⁣", "⁤", "﻿"];
const RANDOM_TEXT_SUFFIX_EMOJIS = ["😊", "🙂", "😄", "😁", "😃", "🤗", "😌", "😇", "👍", "👏", "🙌", "🤝", "✌️", "👋", "💪", "✨", "🌟", "⭐", "💫", "☀️", "🎉", "🎊"];
function buildRandomEmojiSuffix(arg1 = Math.random) {
  const value = 4 + Math.floor(arg1() * 5);
  const result = Array.from({
    length: value
  }, () => RANDOM_TEXT_SUFFIX_ZWC[Math.floor(arg1() * RANDOM_TEXT_SUFFIX_ZWC.length)]).join("");
  const value2 = RANDOM_TEXT_SUFFIX_EMOJIS[Math.floor(arg1() * RANDOM_TEXT_SUFFIX_EMOJIS.length)];
  return " " + value2 + result;
}
function appendRandomEmojiSuffix(arg1, arg2 = Math.random) {
  const result = String(arg1 || "");
  if (!result.trim()) {
    return result;
  }
  return result + buildRandomEmojiSuffix(arg2);
}
module.exports = {
  appendRandomEmojiSuffix: appendRandomEmojiSuffix,
  buildRandomEmojiSuffix: buildRandomEmojiSuffix
};
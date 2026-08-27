'use strict';

const {
  looksLikeDouyinGroupChatName
} = require("./douyinDmGroupChat");
function compactChatName(_0x1e4c90) {
  return String(_0x1e4c90 || "").replace(/[\u200b-\u200f\u202a-\u202e\u2060-\u206f]/g, "").replace(/\s+/g, " ").trim().replace(/^@+/, "").replace(/^<+\s*/, "");
}
function isGenericDouyinChatNickname(_0x3c0672) {
  const _0x4300e2 = compactChatName(_0x3c0672);
  return !_0x4300e2 || /^(抖音用户|用户|匿名用户|user)$/i.test(_0x4300e2);
}
function normalizeDouyinChatPreview(_0x11a7f5) {
  return compactChatName(_0x11a7f5).replace(/(?:\s|[·•])*\d+\+?\s*$/u, "").trim();
}
function scoreDouyinChatRowMatch(_0x2af32c = {}, _0x32502b = {}) {
  const _0x19a693 = compactChatName(_0x2af32c.title || _0x2af32c.nickname || "").toLowerCase();
  const _0x176439 = normalizeDouyinChatPreview(_0x2af32c.lastMessage || _0x2af32c.preview || "").toLowerCase();
  const _0x3c4924 = compactChatName(_0x2af32c.rowText || "").toLowerCase();
  const _0x2a8dde = compactChatName(_0x32502b.nickname || "").toLowerCase();
  const _0x4acdc4 = normalizeDouyinChatPreview(_0x32502b.lastMessage || _0x32502b.text || "").toLowerCase();
  const _0x2e7cd2 = isGenericDouyinChatNickname(_0x32502b.nickname);
  let _0x24967f = 0;
  if (!_0x2e7cd2 && _0x2a8dde) {
    if (_0x19a693 === _0x2a8dde) {
      _0x24967f += 100;
    } else if (_0x19a693.includes(_0x2a8dde) || _0x2a8dde.includes(_0x19a693)) {
      _0x24967f += 60;
    } else if (_0x3c4924.includes(_0x2a8dde)) {
      _0x24967f += 20;
    }
  }
  if (_0x4acdc4) {
    if (_0x176439 === _0x4acdc4) {
      _0x24967f += _0x2e7cd2 ? 80 : 30;
    } else if (_0x176439.includes(_0x4acdc4) || _0x3c4924.includes(_0x4acdc4)) {
      _0x24967f += _0x2e7cd2 ? 50 : 15;
    }
  }
  if (_0x24967f > 0 && (_0x2af32c.hasUnread || _0x2af32c.unread)) {
    _0x24967f += 15;
  }
  return _0x24967f;
}
function isDouyinStrangerMessagesFolderName(_0x4b86be) {
  return /^(陌生人消息|私信|消息)$/.test(compactChatName(_0x4b86be));
}
function isDouyinStrangerMessagesFolderRow({
  title = "",
  titleRaw = "",
  rowText = "",
  kind = ""
} = {}) {
  if (isDouyinStrangerMessagesFolderName(title) || isDouyinStrangerMessagesFolderName(titleRaw)) {
    return true;
  }
  const _0x446cdc = compactChatName(String(titleRaw || rowText).split(/\n/)[0] || "");
  if (isDouyinStrangerMessagesFolderName(_0x446cdc)) {
    return true;
  }
  const _0x26bdb9 = String(rowText || "").replace(/\s+/g, " ").trim();
  if (/^<?\s*陌生人消息(?:\s|$)/.test(_0x26bdb9) && _0x26bdb9.length <= 48) {
    return true;
  }
  if ((kind === "stranger" || kind === "stranger-folder") && !compactChatName(title) && /陌生人消息/.test(_0x26bdb9)) {
    return true;
  }
  return false;
}
function isDouyinChatPageLoggedIn(_0x54abd2 = document) {
  const _0x5487eb = _0x54abd2 && _0x54abd2.querySelectorAll ? _0x54abd2 : document;
  const _0x582d2b = typeof window !== "undefined" ? window.location.href || "" : "";
  if (!/douyin\.com\/chat/i.test(_0x582d2b)) {
    return false;
  }
  const _0x5d7f8a = _0x574de4 => String(_0x574de4 || "").replace(/\s+/g, " ").trim();
  const _0x5db673 = _0x5d7f8a(_0x5487eb.body?.innerText || "").slice(0, 400);
  if (/扫码登录|密码登录|验证码登录|登录后免费畅享/.test(_0x5db673) && !_0x5487eb.querySelector("[class*=\"conversation\"], [data-e2e=\"conversation-item\"]")) {
    return false;
  }
  return true;
}
function scrapeDouyinChatConversations(_0x4389c2 = document) {
  const _0x34a2d9 = _0x4389c2 && _0x4389c2.querySelectorAll ? _0x4389c2 : document;
  const _0x178d76 = /^(刚刚|\d+秒前|\d+分钟前|\d+小时前|\d+天前|昨天|前天|星期.|\d{1,2}:\d{2}|\d{2}-\d{2}|\d{4}-\d{1,2}|\d{1,2}\/\d{1,2})$/;
  const _0x429106 = _0x1fbe20 => {
    if (!_0x1fbe20 || typeof _0x1fbe20.getBoundingClientRect !== "function") {
      return false;
    }
    const _0x31cca1 = _0x1fbe20.getBoundingClientRect();
    const _0x3c2d53 = typeof getComputedStyle === "function" ? getComputedStyle(_0x1fbe20) : {};
    return _0x31cca1.width > 0 && _0x31cca1.height > 0 && _0x3c2d53.display !== "none" && _0x3c2d53.visibility !== "hidden";
  };
  const _0x14b7a5 = _0x4c1803 => String(_0x4c1803 || "").replace(/\s+/g, " ").trim();
  const _0x44265d = ["[data-e2e=\"conversation-item\"]", ".conversationStrangerBoxwrapper", "div[class*=\"ConversationItem\"]", "div[class*=\"conversation-item\"]", "div[class*=\"conversation_item\"]", "[class*=\"Stranger\"]", "[class*=\"stranger\"]", "[role=\"listitem\"]"].join(",");
  const _0x771eb4 = Array.from(_0x34a2d9.querySelectorAll(_0x44265d) || []).filter(_0x496421 => {
    if (!_0x429106(_0x496421)) {
      return false;
    }
    const _0x44e8a4 = _0x496421.getBoundingClientRect();
    const _0x257bb2 = _0x14b7a5(_0x496421.innerText || _0x496421.textContent);
    return _0x44e8a4.width >= 120 && _0x44e8a4.height >= 28 && _0x257bb2 && !/^私信$|^消息$/.test(_0x257bb2);
  }).sort((_0x3b441f, _0x323c5c) => {
    const _0x155ddf = _0x3b441f.getBoundingClientRect();
    const _0x61af11 = _0x323c5c.getBoundingClientRect();
    return _0x155ddf.top - _0x61af11.top || _0x155ddf.width * _0x155ddf.height - _0x61af11.width * _0x61af11.height;
  });
  const _0x29c2fd = new Set();
  const _0x2215d9 = [];
  for (const _0x52f313 of _0x771eb4) {
    const _0x1b9302 = _0x14b7a5(_0x52f313.innerText || _0x52f313.textContent || "");
    if (!_0x1b9302 || _0x29c2fd.has(_0x1b9302)) {
      continue;
    }
    _0x29c2fd.add(_0x1b9302);
    const _0x37f059 = _0x52f313.querySelector("[class*=\"titleWrapper\"], [class*=\"TitleWrapper\"], [class*=\"title\"], [class*=\"Title\"], [class*=\"nickname\"], [class*=\"Nickname\"]") || _0x52f313.querySelector("a[href*=\"/user/\"]");
    const _0x3138e6 = _0x52f313.querySelector("pre, [class*=\"HinttextBox\"], [class*=\"hint\"], [class*=\"Hint\"], [class*=\"Desc\"], [class*=\"desc\"], [class*=\"Content\"], [class*=\"content\"], [class*=\"Message\"], [class*=\"message\"]");
    const _0x350a53 = _0x52f313.querySelector("[class*=\"timeStr\"], [class*=\"TimeStr\"], [class*=\"strangerTimeStr\"], [class*=\"time\"], [class*=\"Time\"]");
    const _0x40dbd8 = _0x1b9302.split(/\n|\s{2,}/).map(_0x39c61d => _0x14b7a5(_0x39c61d)).filter(Boolean);
    const _0x521483 = /^(私信|消息|陌生人消息|未读|已读|\d+)$/;
    let _0x20d4ef = _0x14b7a5(_0x37f059?.innerText || _0x37f059?.textContent || "");
    if (!_0x20d4ef) {
      _0x20d4ef = _0x40dbd8.find(_0x14f60b => _0x14f60b && !_0x178d76.test(_0x14f60b) && !_0x521483.test(_0x14f60b)) || "";
    }
    _0x20d4ef = _0x14b7a5(_0x20d4ef.replace(/(?:\s|[·•])*(?:刚刚|\d+秒前|\d+分钟前|\d+小时前|\d+天前|昨天|前天|星期.|\d{1,2}:\d{2})$/u, ""));
    let _0x2056d1 = _0x14b7a5(_0x3138e6?.innerText || _0x3138e6?.textContent || "");
    if (!_0x2056d1 || _0x2056d1 === _0x20d4ef) {
      _0x2056d1 = [..._0x40dbd8].reverse().find(_0x32ff82 => _0x32ff82 && _0x32ff82 !== _0x20d4ef && !_0x178d76.test(_0x32ff82) && !_0x521483.test(_0x32ff82)) || "";
    }
    const _0x57a257 = _0x14b7a5(_0x350a53?.innerText || _0x350a53?.textContent || [..._0x40dbd8].reverse().find(_0x203538 => _0x178d76.test(_0x203538)) || "");
    const _0xaba78d = _0x52f313.querySelector("[class*=\"UnRead\"], [class*=\"Unread\"], [class*=\"unread\"], [class*=\"Badge\"], [class*=\"badge\"], [class*=\"dot\"], [class*=\"Dot\"]");
    const _0x4b0307 = !!_0xaba78d && !!_0x429106(_0xaba78d);
    const _0x1134d1 = looksLikeDouyinGroupChatName(_0x20d4ef).isGroup || /Group|group|群聊|\d+人/.test(_0x1b9302 + " " + (_0x52f313.className || ""));
    if (isDouyinStrangerMessagesFolderRow({
      title: _0x20d4ef,
      titleRaw: _0x14b7a5(_0x37f059?.innerText || _0x37f059?.textContent || ""),
      rowText: _0x1b9302
    })) {
      continue;
    }
    _0x2215d9.push({
      nickname: _0x20d4ef,
      lastMessage: _0x2056d1,
      timeText: _0x57a257,
      hasUnread: _0x4b0307,
      isGroup: _0x1134d1,
      rawText: _0x1b9302
    });
  }
  return _0x2215d9;
}
function buildDouyinChatSelectSessionScript(_0xb1ff8b = "") {
  const _0x5adf42 = String(_0xb1ff8b || "").replace(/^@+/, "").replace(/\s+/g, "").toLowerCase();
  return "(() => {\n    const targetNick = " + JSON.stringify(_0x5adf42) + ";\n    const compact = (v) => String(v || '').replace(/\\s+/g, ' ').trim();\n    const cleanNick = (v) => compact(v).replace(/^@+/, '').replace(/\\s+/g, '').toLowerCase();\n    const visible = (el) => {\n      if (!el) return false;\n      const r = el.getBoundingClientRect();\n      const s = getComputedStyle(el);\n      return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden';\n    };\n\n    const selectors = [\n      '[data-e2e=\"conversation-item\"]',\n      '.conversationStrangerBoxwrapper',\n      'div[class*=\"ConversationItem\"]',\n      'div[class*=\"conversation-item\"]',\n      'div[class*=\"conversation_item\"]',\n      '[class*=\"Stranger\"]',\n      '[class*=\"stranger\"]',\n      '[role=\"listitem\"]',\n    ].join(',');\n\n    const items = Array.from(document.querySelectorAll(selectors)).filter(visible);\n    let matchedItem = null;\n\n    for (const item of items) {\n      const titleEl = item.querySelector(\n        '[class*=\"titleWrapper\"], [class*=\"TitleWrapper\"], [class*=\"title\"], [class*=\"Title\"], [class*=\"nickname\"], [class*=\"Nickname\"]'\n      ) || item.querySelector('a[href*=\"/user/\"]') || item;\n\n      const name = cleanNick(titleEl.innerText || titleEl.textContent || item.innerText || '');\n      if (!name) continue;\n      const firstLine = cleanNick((item.innerText || '').split(/\\n/)[0] || '');\n      if (/^(陌生人消息|私信|消息)$/.test(firstLine) || /^(陌生人消息|私信|消息)$/.test(name)) continue;\n\n      if (targetNick && (name === targetNick || name.includes(targetNick) || targetNick.includes(name))) {\n        matchedItem = item;\n        break;\n      }\n    }\n\n    if (!matchedItem && items.length > 0) {\n      // 兜底：未匹配到特定昵称时，取第 1 个有未读或列表第 1 项\n      matchedItem = items.find((el) => !!el.querySelector('[class*=\"unread\"], [class*=\"Unread\"], [class*=\"badge\"], [class*=\"dot\"]')) || items[0];\n    }\n\n    if (!matchedItem) {\n      return { ok: false, reason: '未在 chat 页面找到对应会话项' };\n    }\n\n    const rect = matchedItem.getBoundingClientRect();\n    const clickX = Math.round(rect.left + rect.width / 2);\n    const clickY = Math.round(rect.top + rect.height / 2);\n\n    matchedItem.click();\n    return {\n      ok: true,\n      x: clickX,\n      y: clickY,\n      matchedText: compact(matchedItem.innerText || matchedItem.textContent || '').slice(0, 40),\n    };\n  })()";
}
function buildDouyinChatSendMessageScript(_0x3a888e = "") {
  const _0x58dbc4 = String(_0x3a888e || "").trim();
  return "(() => {\n    const textToSend = " + JSON.stringify(_0x58dbc4) + ";\n    if (!textToSend) return { ok: false, reason: '私信文案为空' };\n\n    const visible = (el) => {\n      if (!el) return false;\n      const r = el.getBoundingClientRect();\n      const s = getComputedStyle(el);\n      return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden';\n    };\n\n    // 查找右侧聊天面板输入框\n    const inputCandidates = Array.from(document.querySelectorAll(\n      '[data-e2e=\"chat-input\"], textarea, [contenteditable=\"true\"], div[class*=\"editor\"], div[class*=\"Editor\"], div[class*=\"ChatInput\"], div[class*=\"chat-input\"]'\n    )).filter(visible);\n\n    if (!inputCandidates.length) {\n      return { ok: false, reason: '未找到聊天输入框' };\n    }\n\n    const inputEl = inputCandidates[0];\n    inputEl.focus();\n\n    // 输入文案：处理 contenteditable 与 textarea\n    if (inputEl.tagName === 'TEXTAREA' || inputEl.tagName === 'INPUT') {\n      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set\n        || Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;\n      if (nativeSetter) {\n        nativeSetter.call(inputEl, textToSend);\n      } else {\n        inputEl.value = textToSend;\n      }\n      inputEl.dispatchEvent(new Event('input', { bubbles: true }));\n      inputEl.dispatchEvent(new Event('change', { bubbles: true }));\n    } else {\n      // 富文本 / contenteditable\n      document.execCommand('insertText', false, textToSend);\n      if (!inputEl.textContent || !inputEl.textContent.includes(textToSend)) {\n        inputEl.textContent = textToSend;\n        inputEl.dispatchEvent(new Event('input', { bubbles: true }));\n      }\n    }\n\n    // 查找发送按钮\n    const sendButtons = Array.from(document.querySelectorAll(\n      'button, [data-e2e=\"send-btn\"], [class*=\"send-btn\"], [class*=\"sendBtn\"], [class*=\"SendBtn\"]'\n    )).filter((btn) => {\n      if (!visible(btn)) return false;\n      const btnText = String(btn.innerText || btn.textContent || '').trim();\n      return /发送|Send/i.test(btnText) || btn.getAttribute('data-e2e') === 'send-btn';\n    });\n\n    if (sendButtons.length > 0) {\n      const sendBtn = sendButtons[0];\n      sendBtn.click();\n      return { ok: true, method: 'button_click' };\n    }\n\n    // 兜底发送：派发 Enter 键\n    const enterEvt = new KeyboardEvent('keydown', {\n      bubbles: true,\n      cancelable: true,\n      key: 'Enter',\n      code: 'Enter',\n      keyCode: 13,\n      which: 13,\n    });\n    inputEl.dispatchEvent(enterEvt);\n\n    return { ok: true, method: 'enter_key' };\n  })()";
}
module.exports = {
  isDouyinChatPageLoggedIn: isDouyinChatPageLoggedIn,
  isDouyinStrangerMessagesFolderName: isDouyinStrangerMessagesFolderName,
  isDouyinStrangerMessagesFolderRow: isDouyinStrangerMessagesFolderRow,
  isGenericDouyinChatNickname: isGenericDouyinChatNickname,
  normalizeDouyinChatPreview: normalizeDouyinChatPreview,
  scoreDouyinChatRowMatch: scoreDouyinChatRowMatch,
  scrapeDouyinChatConversations: scrapeDouyinChatConversations,
  buildDouyinChatSelectSessionScript: buildDouyinChatSelectSessionScript,
  buildDouyinChatSendMessageScript: buildDouyinChatSendMessageScript
};
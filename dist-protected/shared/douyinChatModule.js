'use strict';

const {
  looksLikeDouyinGroupChatName
} = require("./douyinDmGroupChat");
function compactChatName(arg1) {
  return String(arg1 || "").replace(/[\u200b-\u200f\u202a-\u202e\u2060-\u206f]/g, "").replace(/\s+/g, " ").trim().replace(/^@+/, "").replace(/^<+\s*/, "");
}
function isGenericDouyinChatNickname(arg1) {
  const result = compactChatName(arg1);
  return !result || /^(抖音用户|用户|匿名用户|user)$/i.test(result);
}
function normalizeDouyinChatPreview(arg1) {
  return compactChatName(arg1).replace(/(?:\s|[·•])*\d+\+?\s*$/u, "").trim();
}
function scoreDouyinChatRowMatch(options = {}, options2 = {}) {
  const result = compactChatName(options.title || options.nickname || "").toLowerCase();
  const result2 = normalizeDouyinChatPreview(options.lastMessage || options.preview || "").toLowerCase();
  const result3 = compactChatName(options.rowText || "").toLowerCase();
  const result4 = compactChatName(options2.nickname || "").toLowerCase();
  const result5 = normalizeDouyinChatPreview(options2.lastMessage || options2.text || "").toLowerCase();
  const flag = isGenericDouyinChatNickname(options2.nickname);
  let num = 0;
  if (!flag && result4) {
    if (result === result4) {
      num += 100;
    } else if (result.includes(result4) || result4.includes(result)) {
      num += 60;
    } else if (result3.includes(result4)) {
      num += 20;
    }
  }
  if (result5) {
    if (result2 === result5) {
      num += flag ? 80 : 30;
    } else if (result2.includes(result5) || result3.includes(result5)) {
      num += flag ? 50 : 15;
    }
  }
  if (num > 0 && (options.hasUnread || options.unread)) {
    num += 15;
  }
  return num;
}
function isDouyinStrangerMessagesFolderName(arg1) {
  return /^(陌生人消息|私信|消息)$/.test(compactChatName(arg1));
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
  const result = compactChatName(String(titleRaw || rowText).split(/\n/)[0] || "");
  if (isDouyinStrangerMessagesFolderName(result)) {
    return true;
  }
  const result2 = String(rowText || "").replace(/\s+/g, " ").trim();
  if (/^<?\s*陌生人消息(?:\s|$)/.test(result2) && result2.length <= 48) {
    return true;
  }
  if ((kind === "stranger" || kind === "stranger-folder") && !compactChatName(title) && /陌生人消息/.test(result2)) {
    return true;
  }
  return false;
}
function isDouyinChatPageLoggedIn(arg1 = document) {
  const value = arg1 && arg1.querySelectorAll ? arg1 : document;
  const value2 = typeof window !== "undefined" ? window.location.href || "" : "";
  if (!/douyin\.com\/chat/i.test(value2)) {
    return false;
  }
  const local = arg1 => String(arg1 || "").replace(/\s+/g, " ").trim();
  const result = local(value.body?.innerText || "").slice(0, 400);
  if (/扫码登录|密码登录|验证码登录|登录后免费畅享/.test(result) && !value.querySelector("[class*=\"conversation\"], [data-e2e=\"conversation-item\"]")) {
    return false;
  }
  return true;
}
function scrapeDouyinChatConversations(arg1 = document) {
  const value = arg1 && arg1.querySelectorAll ? arg1 : document;
  const pattern = /^(刚刚|\d+秒前|\d+分钟前|\d+小时前|\d+天前|昨天|前天|星期.|\d{1,2}:\d{2}|\d{2}-\d{2}|\d{4}-\d{1,2}|\d{1,2}\/\d{1,2})$/;
  const local = arg1 => {
    if (!arg1 || typeof arg1.getBoundingClientRect !== "function") {
      return false;
    }
    const result = arg1.getBoundingClientRect();
    const value = typeof getComputedStyle === "function" ? getComputedStyle(arg1) : {};
    return result.width > 0 && result.height > 0 && value.display !== "none" && value.visibility !== "hidden";
  };
  const local2 = arg1 => String(arg1 || "").replace(/\s+/g, " ").trim();
  const result = ["[data-e2e=\"conversation-item\"]", ".conversationStrangerBoxwrapper", "div[class*=\"ConversationItem\"]", "div[class*=\"conversation-item\"]", "div[class*=\"conversation_item\"]", "[class*=\"Stranger\"]", "[class*=\"stranger\"]", "[role=\"listitem\"]"].join(",");
  const result2 = Array.from(value.querySelectorAll(result) || []).filter(arg1 => {
    if (!local(arg1)) {
      return false;
    }
    const result = arg1.getBoundingClientRect();
    const result2 = local2(arg1.innerText || arg1.textContent);
    return result.width >= 120 && result.height >= 28 && result2 && !/^私信$|^消息$/.test(result2);
  }).sort((arg1, arg2) => {
    const result = arg1.getBoundingClientRect();
    const result2 = arg2.getBoundingClientRect();
    return result.top - result2.top || result.width * result.height - result2.width * result2.height;
  });
  const set = new Set();
  const list = [];
  for (const item of result2) {
    const result = local2(item.innerText || item.textContent || "");
    if (!result || set.has(result)) {
      continue;
    }
    set.add(result);
    const local3 = item.querySelector("[class*=\"titleWrapper\"], [class*=\"TitleWrapper\"], [class*=\"title\"], [class*=\"Title\"], [class*=\"nickname\"], [class*=\"Nickname\"]") || item.querySelector("a[href*=\"/user/\"]");
    const result2 = item.querySelector("pre, [class*=\"HinttextBox\"], [class*=\"hint\"], [class*=\"Hint\"], [class*=\"Desc\"], [class*=\"desc\"], [class*=\"Content\"], [class*=\"content\"], [class*=\"Message\"], [class*=\"message\"]");
    const result3 = item.querySelector("[class*=\"timeStr\"], [class*=\"TimeStr\"], [class*=\"strangerTimeStr\"], [class*=\"time\"], [class*=\"Time\"]");
    const result4 = result.split(/\n|\s{2,}/).map(arg1 => local2(arg1)).filter(Boolean);
    const pattern2 = /^(私信|消息|陌生人消息|未读|已读|\d+)$/;
    let result5 = local2(local3?.innerText || local3?.textContent || "");
    if (!result5) {
      result5 = result4.find(arg1 => arg1 && !pattern.test(arg1) && !pattern2.test(arg1)) || "";
    }
    result5 = local2(result5.replace(/(?:\s|[·•])*(?:刚刚|\d+秒前|\d+分钟前|\d+小时前|\d+天前|昨天|前天|星期.|\d{1,2}:\d{2})$/u, ""));
    let result6 = local2(result2?.innerText || result2?.textContent || "");
    if (!result6 || result6 === result5) {
      result6 = [...result4].reverse().find(arg1 => arg1 && arg1 !== result5 && !pattern.test(arg1) && !pattern2.test(arg1)) || "";
    }
    const result7 = local2(result3?.innerText || result3?.textContent || [...result4].reverse().find(arg1 => pattern.test(arg1)) || "");
    const result8 = item.querySelector("[class*=\"UnRead\"], [class*=\"Unread\"], [class*=\"unread\"], [class*=\"Badge\"], [class*=\"badge\"], [class*=\"dot\"], [class*=\"Dot\"]");
    const local4 = !!result8 && !!local(result8);
    const local5 = looksLikeDouyinGroupChatName(result5).isGroup || /Group|group|群聊|\d+人/.test(result + " " + (item.className || ""));
    if (isDouyinStrangerMessagesFolderRow({
      title: result5,
      titleRaw: local2(local3?.innerText || local3?.textContent || ""),
      rowText: result
    })) {
      continue;
    }
    list.push({
      nickname: result5,
      lastMessage: result6,
      timeText: result7,
      hasUnread: local4,
      isGroup: local5,
      rawText: result
    });
  }
  return list;
}
function buildDouyinChatSelectSessionScript(text = "") {
  const result = String(text || "").replace(/^@+/, "").replace(/\s+/g, "").toLowerCase();
  return "(() => {\n    const targetNick = " + JSON.stringify(result) + ";\n    const compact = (v) => String(v || '').replace(/\\s+/g, ' ').trim();\n    const cleanNick = (v) => compact(v).replace(/^@+/, '').replace(/\\s+/g, '').toLowerCase();\n    const visible = (el) => {\n      if (!el) return false;\n      const r = el.getBoundingClientRect();\n      const s = getComputedStyle(el);\n      return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden';\n    };\n\n    const selectors = [\n      '[data-e2e=\"conversation-item\"]',\n      '.conversationStrangerBoxwrapper',\n      'div[class*=\"ConversationItem\"]',\n      'div[class*=\"conversation-item\"]',\n      'div[class*=\"conversation_item\"]',\n      '[class*=\"Stranger\"]',\n      '[class*=\"stranger\"]',\n      '[role=\"listitem\"]',\n    ].join(',');\n\n    const items = Array.from(document.querySelectorAll(selectors)).filter(visible);\n    let matchedItem = null;\n\n    for (const item of items) {\n      const titleEl = item.querySelector(\n        '[class*=\"titleWrapper\"], [class*=\"TitleWrapper\"], [class*=\"title\"], [class*=\"Title\"], [class*=\"nickname\"], [class*=\"Nickname\"]'\n      ) || item.querySelector('a[href*=\"/user/\"]') || item;\n\n      const name = cleanNick(titleEl.innerText || titleEl.textContent || item.innerText || '');\n      if (!name) continue;\n      const firstLine = cleanNick((item.innerText || '').split(/\\n/)[0] || '');\n      if (/^(陌生人消息|私信|消息)$/.test(firstLine) || /^(陌生人消息|私信|消息)$/.test(name)) continue;\n\n      if (targetNick && (name === targetNick || name.includes(targetNick) || targetNick.includes(name))) {\n        matchedItem = item;\n        break;\n      }\n    }\n\n    if (!matchedItem && items.length > 0) {\n      // 兜底：未匹配到特定昵称时，取第 1 个有未读或列表第 1 项\n      matchedItem = items.find((el) => !!el.querySelector('[class*=\"unread\"], [class*=\"Unread\"], [class*=\"badge\"], [class*=\"dot\"]')) || items[0];\n    }\n\n    if (!matchedItem) {\n      return { ok: false, reason: '未在 chat 页面找到对应会话项' };\n    }\n\n    const rect = matchedItem.getBoundingClientRect();\n    const clickX = Math.round(rect.left + rect.width / 2);\n    const clickY = Math.round(rect.top + rect.height / 2);\n\n    matchedItem.click();\n    return {\n      ok: true,\n      x: clickX,\n      y: clickY,\n      matchedText: compact(matchedItem.innerText || matchedItem.textContent || '').slice(0, 40),\n    };\n  })()";
}
function buildDouyinChatSendMessageScript(text = "") {
  const result = String(text || "").trim();
  return "(() => {\n    const textToSend = " + JSON.stringify(result) + ";\n    if (!textToSend) return { ok: false, reason: '私信文案为空' };\n\n    const visible = (el) => {\n      if (!el) return false;\n      const r = el.getBoundingClientRect();\n      const s = getComputedStyle(el);\n      return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden';\n    };\n\n    // 查找右侧聊天面板输入框\n    const inputCandidates = Array.from(document.querySelectorAll(\n      '[data-e2e=\"chat-input\"], textarea, [contenteditable=\"true\"], div[class*=\"editor\"], div[class*=\"Editor\"], div[class*=\"ChatInput\"], div[class*=\"chat-input\"]'\n    )).filter(visible);\n\n    if (!inputCandidates.length) {\n      return { ok: false, reason: '未找到聊天输入框' };\n    }\n\n    const inputEl = inputCandidates[0];\n    inputEl.focus();\n\n    // 输入文案：处理 contenteditable 与 textarea\n    if (inputEl.tagName === 'TEXTAREA' || inputEl.tagName === 'INPUT') {\n      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set\n        || Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;\n      if (nativeSetter) {\n        nativeSetter.call(inputEl, textToSend);\n      } else {\n        inputEl.value = textToSend;\n      }\n      inputEl.dispatchEvent(new Event('input', { bubbles: true }));\n      inputEl.dispatchEvent(new Event('change', { bubbles: true }));\n    } else {\n      // 富文本 / contenteditable\n      document.execCommand('insertText', false, textToSend);\n      if (!inputEl.textContent || !inputEl.textContent.includes(textToSend)) {\n        inputEl.textContent = textToSend;\n        inputEl.dispatchEvent(new Event('input', { bubbles: true }));\n      }\n    }\n\n    // 查找发送按钮\n    const sendButtons = Array.from(document.querySelectorAll(\n      'button, [data-e2e=\"send-btn\"], [class*=\"send-btn\"], [class*=\"sendBtn\"], [class*=\"SendBtn\"]'\n    )).filter((btn) => {\n      if (!visible(btn)) return false;\n      const btnText = String(btn.innerText || btn.textContent || '').trim();\n      return /发送|Send/i.test(btnText) || btn.getAttribute('data-e2e') === 'send-btn';\n    });\n\n    if (sendButtons.length > 0) {\n      const sendBtn = sendButtons[0];\n      sendBtn.click();\n      return { ok: true, method: 'button_click' };\n    }\n\n    // 兜底发送：派发 Enter 键\n    const enterEvt = new KeyboardEvent('keydown', {\n      bubbles: true,\n      cancelable: true,\n      key: 'Enter',\n      code: 'Enter',\n      keyCode: 13,\n      which: 13,\n    });\n    inputEl.dispatchEvent(enterEvt);\n\n    return { ok: true, method: 'enter_key' };\n  })()";
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
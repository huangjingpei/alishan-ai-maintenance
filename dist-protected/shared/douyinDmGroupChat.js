function compactGroupText(arg1) {
  return String(arg1 || "").replace(/[\u200b-\u200f\u202a-\u202e\u2060-\u206f]/g, "").replace(/\s+/g, " ").trim();
}
const STRONG_GROUP_NAME_RE = /群聊|群消息|粉丝群|交流群|互助群|客户群|学员群|官方群|内部群|社群|售后群|资源群|同城群|本地群|宝妈群|创业群/;
const SOFT_GROUP_NAME_RE = /群/;
const PAREN_MEMBER_RE = /[（(]\s*(?:[2-9]|[1-9]\d{1,2})\s*[）)]/;
const MEMBER_HINT_RE = /共\s*\d+\s*人|\d+\s*人|[（(]\s*(?:[2-9]|[1-9]\d{1,2})\s*[）)]/;
const GROUP_ATTR_RE = /群聊|群消息|group(?:[_\s-]?chat|[_\s-]?conversation)|chatType["']?\s*[:=]\s*["']?group|conversationType["']?\s*[:=]\s*["']?group/i;
const OPEN_HEADER_STRONG_RE = /群聊|群成员|群公告|群管理|邀请入群|邀请进群|添加群成员|群设置/;
function looksLikeDouyinGroupChatName(arg1) {
  const result = compactGroupText(arg1);
  if (!result) {
    return {
      isGroup: false,
      reason: ""
    };
  }
  if (STRONG_GROUP_NAME_RE.test(result)) {
    return {
      isGroup: true,
      reason: "name_strong"
    };
  }
  if (/的群$/.test(result) || /^.{1,24}群$/.test(result) && !/个人|自己/.test(result)) {
    return {
      isGroup: true,
      reason: "name_suffix_群"
    };
  }
  if (SOFT_GROUP_NAME_RE.test(result) && MEMBER_HINT_RE.test(result)) {
    return {
      isGroup: true,
      reason: "name_群+人数"
    };
  }
  if (result.length <= 48 && PAREN_MEMBER_RE.test(result)) {
    return {
      isGroup: true,
      reason: "name_paren_count"
    };
  }
  const result2 = looksLikeMultiMemberGroupTitle(result);
  if (result2.isGroup) {
    return result2;
  }
  return {
    isGroup: false,
    reason: ""
  };
}
function looksLikeMultiMemberGroupTitle(arg1) {
  const result = compactGroupText(arg1).replace(/^@+/, "");
  if (!result || result.length > 64) {
    return {
      isGroup: false,
      reason: ""
    };
  }
  const local = arg1 => arg1.length >= 1 && arg1.length <= 20;
  const result2 = result.split(/\s*,\s*/).map(arg1 => arg1.trim()).filter(Boolean);
  if (result2.length >= 2 && result2.every(local)) {
    return {
      isGroup: true,
      reason: "name_multi_member"
    };
  }
  const result3 = result.split(/\s*、\s*/).map(arg1 => arg1.trim()).filter(Boolean);
  if (result3.length >= 2 && result3.every(local)) {
    return {
      isGroup: true,
      reason: "name_multi_member"
    };
  }
  const result4 = result.split(/\s*，\s*/).map(arg1 => arg1.trim()).filter(Boolean);
  if (result4.length >= 3 && result4.every(local)) {
    return {
      isGroup: true,
      reason: "name_multi_member"
    };
  }
  return {
    isGroup: false,
    reason: ""
  };
}
function detectDouyinDmIsGroupChat(options = {}) {
  const result = compactGroupText(options.name);
  const result2 = compactGroupText(options.rowText);
  const result3 = compactGroupText(options.attrBlob);
  const result4 = Math.max(0, Number(options.avatarCount) || 0);
  const flag = !!options.hasExplicitGroupNode;
  const flag2 = !!options.hasUserLink;
  if (flag) {
    return {
      isGroup: true,
      reason: "dom_explicit"
    };
  }
  if (GROUP_ATTR_RE.test(result3)) {
    return {
      isGroup: true,
      reason: "attr_text"
    };
  }
  const result5 = looksLikeDouyinGroupChatName(result);
  if (result5.isGroup) {
    return result5;
  }
  let num = 0;
  const list = [];
  if (SOFT_GROUP_NAME_RE.test(result)) {
    num += 2;
    list.push("name_has_群");
  }
  if (MEMBER_HINT_RE.test(result)) {
    num += 3;
    list.push("member_hint");
  }
  if (result4 >= 3) {
    num += 4;
    list.push("avatars>=3");
  } else if (result4 >= 2) {
    num += 2;
    list.push("avatars>=2");
  }
  if (!flag2 && num >= 2) {
    num += 1;
    list.push("no_user_link");
  }
  if (/GroupAvatar|group-avatar|groupAvatar|GroupChat|groupChat|ImGroup|im-group|conversation-group|AvatarList|avatarList|多人头像/i.test(result3)) {
    num += 3;
    list.push("class_hint");
  }
  if (num >= 3) {
    return {
      isGroup: true,
      reason: "score_" + num + ":" + list.join("+")
    };
  }
  return {
    isGroup: false,
    reason: ""
  };
}
function looksLikeOpenDouyinGroupChatHeader(text = "", text2 = "") {
  const result = compactGroupText(text).slice(0, 64);
  if (!result) {
    return {
      isGroup: false,
      reason: ""
    };
  }
  const result2 = compactGroupText(text2).replace(/^@+/, "").toLowerCase();
  const result3 = result.toLowerCase();
  const local = !result2 || result3.includes(result2) || result2.includes(result3.slice(0, Math.min(result2.length, result3.length)));
  if (OPEN_HEADER_STRONG_RE.test(result)) {
    if (result.length <= 64) {
      return {
        isGroup: true,
        reason: "open_header"
      };
    }
  }
  if (!local) {
    return {
      isGroup: false,
      reason: "header_mismatch"
    };
  }
  const result4 = looksLikeDouyinGroupChatName(result);
  if (result4.isGroup) {
    return {
      isGroup: true,
      reason: "open_" + result4.reason
    };
  }
  if (MEMBER_HINT_RE.test(result)) {
    return {
      isGroup: true,
      reason: "open_member_hint"
    };
  }
  return {
    isGroup: false,
    reason: ""
  };
}
module.exports = {
  compactGroupText: compactGroupText,
  looksLikeDouyinGroupChatName: looksLikeDouyinGroupChatName,
  looksLikeMultiMemberGroupTitle: looksLikeMultiMemberGroupTitle,
  detectDouyinDmIsGroupChat: detectDouyinDmIsGroupChat,
  looksLikeOpenDouyinGroupChatHeader: looksLikeOpenDouyinGroupChatHeader,
  STRONG_GROUP_NAME_RE: STRONG_GROUP_NAME_RE,
  PAREN_MEMBER_RE: PAREN_MEMBER_RE,
  MEMBER_HINT_RE: MEMBER_HINT_RE,
  OPEN_HEADER_STRONG_RE: OPEN_HEADER_STRONG_RE
};
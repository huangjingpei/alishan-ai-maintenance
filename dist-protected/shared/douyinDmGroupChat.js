function compactGroupText(_0x3a79e6) {
  return String(_0x3a79e6 || "").replace(/[\u200b-\u200f\u202a-\u202e\u2060-\u206f]/g, "").replace(/\s+/g, " ").trim();
}
const STRONG_GROUP_NAME_RE = /群聊|群消息|粉丝群|交流群|互助群|客户群|学员群|官方群|内部群|社群|售后群|资源群|同城群|本地群|宝妈群|创业群/;
const SOFT_GROUP_NAME_RE = /群/;
const PAREN_MEMBER_RE = /[（(]\s*(?:[2-9]|[1-9]\d{1,2})\s*[）)]/;
const MEMBER_HINT_RE = /共\s*\d+\s*人|\d+\s*人|[（(]\s*(?:[2-9]|[1-9]\d{1,2})\s*[）)]/;
const GROUP_ATTR_RE = /群聊|群消息|group(?:[_\s-]?chat|[_\s-]?conversation)|chatType["']?\s*[:=]\s*["']?group|conversationType["']?\s*[:=]\s*["']?group/i;
const OPEN_HEADER_STRONG_RE = /群聊|群成员|群公告|群管理|邀请入群|邀请进群|添加群成员|群设置/;
function looksLikeDouyinGroupChatName(_0xec0849) {
  const _0x427bab = compactGroupText(_0xec0849);
  if (!_0x427bab) {
    return {
      isGroup: false,
      reason: ""
    };
  }
  if (STRONG_GROUP_NAME_RE.test(_0x427bab)) {
    return {
      isGroup: true,
      reason: "name_strong"
    };
  }
  if (/的群$/.test(_0x427bab) || /^.{1,24}群$/.test(_0x427bab) && !/个人|自己/.test(_0x427bab)) {
    return {
      isGroup: true,
      reason: "name_suffix_群"
    };
  }
  if (SOFT_GROUP_NAME_RE.test(_0x427bab) && MEMBER_HINT_RE.test(_0x427bab)) {
    return {
      isGroup: true,
      reason: "name_群+人数"
    };
  }
  if (_0x427bab.length <= 48 && PAREN_MEMBER_RE.test(_0x427bab)) {
    return {
      isGroup: true,
      reason: "name_paren_count"
    };
  }
  const _0x1a834e = looksLikeMultiMemberGroupTitle(_0x427bab);
  if (_0x1a834e.isGroup) {
    return _0x1a834e;
  }
  return {
    isGroup: false,
    reason: ""
  };
}
function looksLikeMultiMemberGroupTitle(_0x1ad74b) {
  const _0x23f158 = compactGroupText(_0x1ad74b).replace(/^@+/, "");
  if (!_0x23f158 || _0x23f158.length > 64) {
    return {
      isGroup: false,
      reason: ""
    };
  }
  const _0x12bdf7 = _0xacc3e1 => _0xacc3e1.length >= 1 && _0xacc3e1.length <= 20;
  const _0x1bd3d8 = _0x23f158.split(/\s*,\s*/).map(_0x5b49cb => _0x5b49cb.trim()).filter(Boolean);
  if (_0x1bd3d8.length >= 2 && _0x1bd3d8.every(_0x12bdf7)) {
    return {
      isGroup: true,
      reason: "name_multi_member"
    };
  }
  const _0x31d5a3 = _0x23f158.split(/\s*、\s*/).map(_0x46e420 => _0x46e420.trim()).filter(Boolean);
  if (_0x31d5a3.length >= 2 && _0x31d5a3.every(_0x12bdf7)) {
    return {
      isGroup: true,
      reason: "name_multi_member"
    };
  }
  const _0x45ca46 = _0x23f158.split(/\s*，\s*/).map(_0x29256c => _0x29256c.trim()).filter(Boolean);
  if (_0x45ca46.length >= 3 && _0x45ca46.every(_0x12bdf7)) {
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
function detectDouyinDmIsGroupChat(_0x5aa1cc = {}) {
  const _0xa8d4f = compactGroupText(_0x5aa1cc.name);
  const _0x5a1b2b = compactGroupText(_0x5aa1cc.rowText);
  const _0x25c0d6 = compactGroupText(_0x5aa1cc.attrBlob);
  const _0x56a93d = Math.max(0, Number(_0x5aa1cc.avatarCount) || 0);
  const _0x2fa69b = !!_0x5aa1cc.hasExplicitGroupNode;
  const _0x5d04b6 = !!_0x5aa1cc.hasUserLink;
  if (_0x2fa69b) {
    return {
      isGroup: true,
      reason: "dom_explicit"
    };
  }
  if (GROUP_ATTR_RE.test(_0x25c0d6)) {
    return {
      isGroup: true,
      reason: "attr_text"
    };
  }
  const _0x7721e6 = looksLikeDouyinGroupChatName(_0xa8d4f);
  if (_0x7721e6.isGroup) {
    return _0x7721e6;
  }
  let _0x1b907d = 0;
  const _0x4ca879 = [];
  if (SOFT_GROUP_NAME_RE.test(_0xa8d4f)) {
    _0x1b907d += 2;
    _0x4ca879.push("name_has_群");
  }
  if (MEMBER_HINT_RE.test(_0xa8d4f)) {
    _0x1b907d += 3;
    _0x4ca879.push("member_hint");
  }
  if (_0x56a93d >= 3) {
    _0x1b907d += 4;
    _0x4ca879.push("avatars>=3");
  } else if (_0x56a93d >= 2) {
    _0x1b907d += 2;
    _0x4ca879.push("avatars>=2");
  }
  if (!_0x5d04b6 && _0x1b907d >= 2) {
    _0x1b907d += 1;
    _0x4ca879.push("no_user_link");
  }
  if (/GroupAvatar|group-avatar|groupAvatar|GroupChat|groupChat|ImGroup|im-group|conversation-group|AvatarList|avatarList|多人头像/i.test(_0x25c0d6)) {
    _0x1b907d += 3;
    _0x4ca879.push("class_hint");
  }
  if (_0x1b907d >= 3) {
    return {
      isGroup: true,
      reason: "score_" + _0x1b907d + ":" + _0x4ca879.join("+")
    };
  }
  return {
    isGroup: false,
    reason: ""
  };
}
function looksLikeOpenDouyinGroupChatHeader(_0xdbc99 = "", _0x134a04 = "") {
  const _0x2953aa = compactGroupText(_0xdbc99).slice(0, 64);
  if (!_0x2953aa) {
    return {
      isGroup: false,
      reason: ""
    };
  }
  const _0x545538 = compactGroupText(_0x134a04).replace(/^@+/, "").toLowerCase();
  const _0x30f3ab = _0x2953aa.toLowerCase();
  const _0x23ad4f = !_0x545538 || _0x30f3ab.includes(_0x545538) || _0x545538.includes(_0x30f3ab.slice(0, Math.min(_0x545538.length, _0x30f3ab.length)));
  if (OPEN_HEADER_STRONG_RE.test(_0x2953aa)) {
    if (_0x2953aa.length <= 64) {
      return {
        isGroup: true,
        reason: "open_header"
      };
    }
  }
  if (!_0x23ad4f) {
    return {
      isGroup: false,
      reason: "header_mismatch"
    };
  }
  const _0x1ed3ab = looksLikeDouyinGroupChatName(_0x2953aa);
  if (_0x1ed3ab.isGroup) {
    return {
      isGroup: true,
      reason: "open_" + _0x1ed3ab.reason
    };
  }
  if (MEMBER_HINT_RE.test(_0x2953aa)) {
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
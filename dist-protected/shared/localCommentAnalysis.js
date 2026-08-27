function normalizeCommentText(_0x2670c0) {
  return String(_0x2670c0 || "").replace(/\s+/g, "").replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
}
function stripTailParticles(_0x33937c) {
  return String(_0x33937c || "").replace(/[吗嘛呢啊呀哦吧哈？?！!。.…~～]+$/g, "");
}
function isPureNumericComment(_0x475681) {
  if (!_0x475681) {
    return true;
  }
  const _0x2cd99b = _0x475681.replace(/[+＋\-－.．,，!！?？~～]/g, "");
  if (!_0x2cd99b) {
    return false;
  }
  if (/^\d+$/.test(_0x2cd99b)) {
    return true;
  }
  if (_0x2cd99b.length <= 6 && /^([0-9])\1+$/.test(_0x2cd99b)) {
    return true;
  }
  return false;
}
const GENERIC_NOISE_EXACT = new Set(["1", "6", "8", "11", "66", "88", "99", "666", "888", "999", "111", "222", "333", "444", "555", "6666", "8888", "9999", "1111", "+1", "122", "233", "66666", "你好", "您好", "你好呀", "你好啊", "哈喽", "嗨", "hi", "hello", "在吗", "有人吗", "厉害", "厉害了", "牛", "牛逼", "nb", "赞", "点赞", "支持", "学习了", "不错", "真好", "可以", "可以的", "好", "好的", "哈哈", "哈哈哈", "hhhh", "haha", "呵呵", "呵呵呵", "笑死", "绝了", "真实", "爱了", "yyds", "同求", "mark", "蹲", "插眼", "占楼", "沙发", "第一", "来了", "过", "路过", "顶", "顶顶", "收藏", "已收藏", "关注", "已关注", "转发", "分享", "打卡", "报到"]);
const HIGH_INTENT_STANDALONE_PHRASES = ["想要", "想买", "我要", "想入手", "感兴趣", "怎么联系", "联系方式", "怎么加", "怎么联系你", "怎么加你", "加微信", "加个微信", "加v", "加V", "私信", "求带", "带带", "带带我", "求带带", "多少钱", "多少米", "什么价", "价位多少", "价格多少", "什么价格", "怎么收费", "怎么卖", "报价", "怎么买", "哪里买", "在哪买", "链接", "有链接吗", "求链接", "发链接", "给个链接", "咨询一下", "咨询下", "想咨询", "了解一下", "了解", "问问", "问下", "请问"];
function matchesStandalonePhraseList(_0x19568e, _0x55deb9, _0x4dd02f = 3) {
  const _0x54af00 = stripTailParticles(_0x19568e);
  if (_0x55deb9.includes(_0x54af00) || _0x55deb9.includes(_0x19568e)) {
    return true;
  }
  if (_0x19568e.length <= 12) {
    for (const _0x31baaa of _0x55deb9) {
      if (_0x19568e === _0x31baaa) {
        return true;
      }
      if (_0x19568e.startsWith(_0x31baaa) && _0x19568e.length <= _0x31baaa.length + _0x4dd02f) {
        return true;
      }
    }
  }
  return false;
}
function isStandaloneHighIntentPhrase(_0x26d033) {
  return matchesStandalonePhraseList(_0x26d033, HIGH_INTENT_STANDALONE_PHRASES);
}
function isEmojiOrSymbolOnly(_0x28868a) {
  const _0x2e944e = String(_0x28868a || "").replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "").replace(/[+\-_.·,，!！?？~～@#￥$%^&*()[\]{}|\\/<>《》「」『』""''\s]/g, "");
  return _0x2e944e.length === 0 && String(_0x28868a || "").trim().length > 0;
}
function buildLocalDecision(_0x27bdf8, _0x3d82c4) {
  return {
    decision: _0x27bdf8,
    replyContent: "",
    aiThought: _0x3d82c4
  };
}
function classifyCommentForAi(_0x2646a6, _0x4232fc = {}) {
  const _0x1475d7 = String(_0x2646a6 || "").trim();
  const _0x3c95da = normalizeCommentText(_0x1475d7);
  if (!_0x3c95da || _0x3c95da.length < 2) {
    return {
      skipBackend: true,
      local: buildLocalDecision("ignore", "本地：内容过短或无有效文字")
    };
  }
  if (isPureNumericComment(_0x3c95da)) {
    return {
      skipBackend: true,
      local: buildLocalDecision("ignore", "本地：纯数字/灌水评论")
    };
  }
  if (GENERIC_NOISE_EXACT.has(_0x3c95da)) {
    return {
      skipBackend: true,
      local: buildLocalDecision("ignore", "本地：常见无意义互动「" + _0x1475d7.slice(0, 16) + "」")
    };
  }
  if (isEmojiOrSymbolOnly(_0x1475d7)) {
    return {
      skipBackend: true,
      local: buildLocalDecision("ignore", "本地：仅表情或符号")
    };
  }
  if (isStandaloneHighIntentPhrase(_0x3c95da)) {
    return {
      skipBackend: true,
      local: buildLocalDecision("like", "本地：高意向「" + _0x1475d7.slice(0, 20) + "」")
    };
  }
  return {
    skipBackend: false,
    local: null
  };
}
function partitionLeadsForAiAnalysis(_0xaf54ae, _0xf0c6b0 = {}) {
  const _0xcf7626 = [];
  const _0x101f47 = new Map();
  let _0x5b4961 = 0;
  for (const _0x411060 of _0xaf54ae) {
    const _0x81190a = classifyCommentForAi(_0x411060.content, _0xf0c6b0);
    if (_0x81190a.skipBackend && _0x81190a.local) {
      _0x101f47.set(_0x411060.leadId, _0x81190a.local);
      _0x5b4961 += 1;
    } else {
      _0xcf7626.push(_0x411060);
    }
  }
  return {
    forBackend: _0xcf7626,
    localDecisions: _0x101f47,
    localCount: _0x5b4961
  };
}
function applyLocalAiDecisionToLead(_0x3baac1, _0x2c5ca8) {
  if (!_0x3baac1 || !_0x2c5ca8) {
    return;
  }
  _0x3baac1.isHighIntention = _0x2c5ca8.decision !== "ignore";
  _0x3baac1.aiThought = _0x2c5ca8.aiThought;
  _0x3baac1.thought = _0x2c5ca8.aiThought;
  if (_0x2c5ca8.replyContent) {
    _0x3baac1.actions = _0x3baac1.actions || {};
    _0x3baac1.actions.replyContent = _0x2c5ca8.replyContent;
  }
}
module.exports = {
  classifyCommentForAi: classifyCommentForAi,
  partitionLeadsForAiAnalysis: partitionLeadsForAiAnalysis,
  applyLocalAiDecisionToLead: applyLocalAiDecisionToLead,
  normalizeCommentText: normalizeCommentText
};
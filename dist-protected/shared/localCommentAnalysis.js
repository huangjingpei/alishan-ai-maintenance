function normalizeCommentText(arg1) {
  return String(arg1 || "").replace(/\s+/g, "").replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
}
function stripTailParticles(arg1) {
  return String(arg1 || "").replace(/[吗嘛呢啊呀哦吧哈？?！!。.…~～]+$/g, "");
}
function isPureNumericComment(arg1) {
  if (!arg1) {
    return true;
  }
  const result = arg1.replace(/[+＋\-－.．,，!！?？~～]/g, "");
  if (!result) {
    return false;
  }
  if (/^\d+$/.test(result)) {
    return true;
  }
  if (result.length <= 6 && /^([0-9])\1+$/.test(result)) {
    return true;
  }
  return false;
}
const GENERIC_NOISE_EXACT = new Set(["1", "6", "8", "11", "66", "88", "99", "666", "888", "999", "111", "222", "333", "444", "555", "6666", "8888", "9999", "1111", "+1", "122", "233", "66666", "你好", "您好", "你好呀", "你好啊", "哈喽", "嗨", "hi", "hello", "在吗", "有人吗", "厉害", "厉害了", "牛", "牛逼", "nb", "赞", "点赞", "支持", "学习了", "不错", "真好", "可以", "可以的", "好", "好的", "哈哈", "哈哈哈", "hhhh", "haha", "呵呵", "呵呵呵", "笑死", "绝了", "真实", "爱了", "yyds", "同求", "mark", "蹲", "插眼", "占楼", "沙发", "第一", "来了", "过", "路过", "顶", "顶顶", "收藏", "已收藏", "关注", "已关注", "转发", "分享", "打卡", "报到"]);
const HIGH_INTENT_STANDALONE_PHRASES = ["想要", "想买", "我要", "想入手", "感兴趣", "怎么联系", "联系方式", "怎么加", "怎么联系你", "怎么加你", "加微信", "加个微信", "加v", "加V", "私信", "求带", "带带", "带带我", "求带带", "多少钱", "多少米", "什么价", "价位多少", "价格多少", "什么价格", "怎么收费", "怎么卖", "报价", "怎么买", "哪里买", "在哪买", "链接", "有链接吗", "求链接", "发链接", "给个链接", "咨询一下", "咨询下", "想咨询", "了解一下", "了解", "问问", "问下", "请问"];
function matchesStandalonePhraseList(arg1, arg2, num = 3) {
  const result = stripTailParticles(arg1);
  if (arg2.includes(result) || arg2.includes(arg1)) {
    return true;
  }
  if (arg1.length <= 12) {
    for (const item of arg2) {
      if (arg1 === item) {
        return true;
      }
      if (arg1.startsWith(item) && arg1.length <= item.length + num) {
        return true;
      }
    }
  }
  return false;
}
function isStandaloneHighIntentPhrase(arg1) {
  return matchesStandalonePhraseList(arg1, HIGH_INTENT_STANDALONE_PHRASES);
}
function isEmojiOrSymbolOnly(arg1) {
  const result = String(arg1 || "").replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "").replace(/[+\-_.·,，!！?？~～@#￥$%^&*()[\]{}|\\/<>《》「」『』""''\s]/g, "");
  return result.length === 0 && String(arg1 || "").trim().length > 0;
}
function buildLocalDecision(arg1, arg2) {
  return {
    decision: arg1,
    replyContent: "",
    aiThought: arg2
  };
}
function classifyCommentForAi(arg1, options = {}) {
  const result = String(arg1 || "").trim();
  const result2 = normalizeCommentText(result);
  if (!result2 || result2.length < 2) {
    return {
      skipBackend: true,
      local: buildLocalDecision("ignore", "本地：内容过短或无有效文字")
    };
  }
  if (isPureNumericComment(result2)) {
    return {
      skipBackend: true,
      local: buildLocalDecision("ignore", "本地：纯数字/灌水评论")
    };
  }
  if (GENERIC_NOISE_EXACT.has(result2)) {
    return {
      skipBackend: true,
      local: buildLocalDecision("ignore", "本地：常见无意义互动「" + result.slice(0, 16) + "」")
    };
  }
  if (isEmojiOrSymbolOnly(result)) {
    return {
      skipBackend: true,
      local: buildLocalDecision("ignore", "本地：仅表情或符号")
    };
  }
  if (isStandaloneHighIntentPhrase(result2)) {
    return {
      skipBackend: true,
      local: buildLocalDecision("like", "本地：高意向「" + result.slice(0, 20) + "」")
    };
  }
  return {
    skipBackend: false,
    local: null
  };
}
function partitionLeadsForAiAnalysis(arg1, options = {}) {
  const list = [];
  const map = new Map();
  let num = 0;
  for (const item of arg1) {
    const result = classifyCommentForAi(item.content, options);
    if (result.skipBackend && result.local) {
      map.set(item.leadId, result.local);
      num += 1;
    } else {
      list.push(item);
    }
  }
  return {
    forBackend: list,
    localDecisions: map,
    localCount: num
  };
}
function applyLocalAiDecisionToLead(arg1, arg2) {
  if (!arg1 || !arg2) {
    return;
  }
  arg1.isHighIntention = arg2.decision !== "ignore";
  arg1.aiThought = arg2.aiThought;
  arg1.thought = arg2.aiThought;
  if (arg2.replyContent) {
    arg1.actions = arg1.actions || {};
    arg1.actions.replyContent = arg2.replyContent;
  }
}
module.exports = {
  classifyCommentForAi: classifyCommentForAi,
  partitionLeadsForAiAnalysis: partitionLeadsForAiAnalysis,
  applyLocalAiDecisionToLead: applyLocalAiDecisionToLead,
  normalizeCommentText: normalizeCommentText
};
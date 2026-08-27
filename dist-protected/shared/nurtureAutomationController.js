'use strict';

const {
  runNurtureKeywordSearchWatchRound
} = require("./nurtureKeywordSearchTasks");
const {
  nurtureEngageCurrentVideo,
  resolveNurtureEngageAfterMs
} = require("./nurtureVideoEngageTasks");
function createNurtureAutomationController(_0x24d5ae = {}) {
  const {
    DOUYIN_RECOMMEND_URL: _0x126080,
    getDouyinRecommendUrl: _0x30e356,
    PLATFORM_SELECTORS: _0x1bc3cb,
    awaitSecurityChallengeIfPresent: _0x4bbb12,
    buildAutomationAiPayload: _0x1fb365,
    buildDouyinSearchResultCardMap: _0x219467,
    buildDouyinSearchUrl: _0x2ccca1,
    cleanTitle: _0x14df64,
    clearPendingLeadVideoUrl: _0x4ce39a,
    clearSearchPendingOpenUrl: _0x5d15ff,
    clipTraceText: _0xdb64e6,
    closeAllModals: _0x289b91,
    collectSearchVideoUrlsForCommentTask: _0x5281d2,
    ensureCommentPanelOpen: _0x88236f,
    ensureDouyinRecommendFeed: _0x22eac7,
    extractSpecificVideoId: _0x395232,
    getCommentV2String: _0x487d96,
    getVideoEngagePack: _0x3e5ce8,
    getDouyinFeedScope: _0x395aab,
    getDouyinSearchCardClickTarget: _0xa21a2e,
    getFeedVideoIdentity: _0x47b397,
    getVideoTitle: _0x2e11b3,
    getVisibleCommentNodeCount: _0xe7ea7f,
    getVisibleDouyinVideoDurationMs: _0x486874,
    hasFeedLiveEnterHint: _0x2ee777,
    ipcRenderer: _0x36d420,
    isElementInFeedCenter: _0x8a82eb,
    isOnDouyinFollowPage: _0x545c23,
    isOnDouyinRecommendPage: _0x161e34,
    isOnUserProfilePage: _0x3cad76,
    isVisibleElement: _0x28b2eb,
    moveToNextVideo: _0x3c1215,
    normalizeSearchQueueVideoUrl: _0x3ca7af,
    openSearchQueueVideoByUrl: _0x24d51f,
    pauseVisibleDouyinVideos: _0x3415d4,
    performRandomWandering: _0xdc9fa5,
    randomDelay: _0x307a16,
    reportCurrentAction: _0x4dd470,
    reportTraceLog: _0x5798ca,
    resolveDouyinVideoDetailModal: _0x354d83,
    resolveLeadVideoUrl: _0x3f10e5,
    resumeVisibleDouyinVideos: _0x35a4b1,
    sampleVisibleCommentTexts: _0xb24c1,
    sessionStorage: _0x171207,
    setSearchPendingOpenUrl: _0x249bfa,
    shouldAbort: _0x39f79a,
    simulateHumanClick: _0x157e66,
    sleep: _0x553cac,
    startCurrentVideoPauseGuard: _0x45d9ec,
    suspendAutomationForNavigation: _0x4ec34a,
    waitForFeedItemChange: _0x4d72d6,
    waitForVideoDetailReadyAndPause: _0x1303db,
    waitForDouyinSearchContentAfterZero: _0x30087b,
    prepareSearchPageReload: _0x2a8a63,
    state: _0x53e4ac
  } = _0x24d5ae;
  const _0x4a09cd = () => typeof _0x30e356 === "function" ? _0x30e356() : _0x126080;
  const _0x51eb3c = 14;
  const _0x43df5d = 3;
  const _0xd9dae3 = 4;
  const _0x493f07 = 20;
  function _0x2f7ab0(_0x5ec05c, _0xfce8f4) {
    if (!_0xfce8f4 || !_0x5ec05c) {
      return;
    }
    if (!Array.isArray(_0x5ec05c.recentSkipKeys)) {
      _0x5ec05c.recentSkipKeys = [];
    }
    _0x5ec05c.recentSkipKeys.push({
      key: _0xfce8f4,
      at: Date.now()
    });
    if (_0x5ec05c.recentSkipKeys.length > _0x51eb3c) {
      _0x5ec05c.recentSkipKeys = _0x5ec05c.recentSkipKeys.slice(-_0x51eb3c);
    }
  }
  function _0x1fc287(_0x3333a8, _0x1db747) {
    const _0x3d6b9a = (_0x3333a8.recentSkipKeys || []).map(_0x1bd0a5 => _0x1bd0a5?.key).filter(Boolean);
    if (!_0x1db747 || _0x3d6b9a.length < 3) {
      return false;
    }
    if (_0x1db747.includes("未知视频") || _0x1db747.includes("feed:na::")) {
      return false;
    }
    const _0xba4e3c = _0x3d6b9a.filter(_0x52a0ad => _0x52a0ad === _0x1db747).length;
    if (_0xba4e3c >= _0x43df5d) {
      return true;
    }
    const _0x3af351 = _0x3d6b9a.slice(-3);
    const _0x424a9b = [...new Set(_0x3af351)];
    return _0x424a9b.length === 2 && _0x3af351.length === 3;
  }
  async function _0x17adee(_0x3c0547, _0x2494bd, _0x4fa66a = "打破视频来回切换") {
    console.warn("[Built-in-Debug] [养号] " + _0x4fa66a + "，强制刷新推荐流");
    _0x5798ca("🔄 养号：" + _0x4fa66a + "，刷新推荐流");
    if (_0x2494bd) {
      _0x2494bd.recentSkipKeys = [];
      _0x2494bd.nurtureLiveSkipStreak = 0;
      _0x2494bd.nurtureLastLiveKey = "";
      delete _0x2494bd.lastNurtureVideoDecision;
      try {
        _0x171207.setItem(_0x4d5649(), JSON.stringify(_0x2494bd));
      } catch (_0x14d17f) {}
    }
    window.location.href = _0x4a09cd();
    await _0x307a16(4000, 6500, _0x3c0547, "刷新推荐流");
    return {
      switched: true,
      reloaded: true
    };
  }
  async function _0x45a320(_0x32d55a, _0x983ed0, {
    reason = "切换视频",
    aggressive = true
  } = {}) {
    if (_0x39f79a(_0x32d55a)) {
      return {
        switched: false
      };
    }
    const _0x20e071 = _0x1ec086();
    const _0x4da17f = _0x47b397();
    _0x2f7ab0(_0x983ed0, _0x20e071);
    delete _0x983ed0.lastNurtureVideoDecision;
    if (_0x1fc287(_0x983ed0, _0x20e071)) {
      return _0x17adee(_0x32d55a, _0x983ed0, "检测到反复回到同一视频");
    }
    for (let _0x5cad16 = 0; _0x5cad16 < 5; _0x5cad16++) {
      await _0x3c1215(_0x32d55a, {
        aggressive: aggressive || _0x5cad16 > 0
      });
      await _0x307a16(700, 1400, _0x32d55a, reason);
      await _0x4d72d6(_0x32d55a, _0x4da17f, _0x5cad16 === 0 ? 8 : 10);
      if (_0x4d2c83()) {
        const _0x220392 = _0x47b397() || _0x2e11b3() || _0x1ec086();
        if (_0x220392 && _0x220392 === _0x983ed0.nurtureLastLiveKey) {
          _0x983ed0.nurtureLiveSkipStreak = (_0x983ed0.nurtureLiveSkipStreak || 0) + 1;
        } else {
          _0x983ed0.nurtureLiveSkipStreak = 1;
          _0x983ed0.nurtureLastLiveKey = _0x220392;
        }
        const _0x6e8011 = (_0x983ed0.nurtureLiveSkipStreak || 0) >= _0xd9dae3;
        await _0x13f3fc(_0x32d55a, {
          forceReload: _0x6e8011
        });
        if (_0x6e8011) {
          _0x983ed0.nurtureLiveSkipStreak = 0;
          _0x983ed0.nurtureLastLiveKey = "";
        }
        await _0x307a16(900, 1800, _0x32d55a, "跳过直播后继续");
        const _0x3c1630 = _0x1ec086();
        if (_0x3c1630 && _0x3c1630 !== _0x20e071 && !_0x4d2c83()) {
          return {
            switched: true,
            reloaded: _0x6e8011
          };
        }
        continue;
      }
      _0x983ed0.nurtureLiveSkipStreak = 0;
      _0x983ed0.nurtureLastLiveKey = "";
      const _0x5d46c7 = _0x1ec086();
      const _0x6d9999 = _0x47b397();
      if (_0x5d46c7 && _0x5d46c7 !== _0x20e071 || _0x6d9999 && _0x6d9999 !== _0x4da17f) {
        return {
          switched: true,
          reloaded: false
        };
      }
    }
    return _0x17adee(_0x32d55a, _0x983ed0, "多次切换仍未离开当前视频");
  }
  function _0x2508a5(_0x2acd8f, _0x2a1655, _0x9bcee4 = "nurture_completed") {
    return {
      taskId: _0x2acd8f,
      taskMode: "nurture",
      accountId: window._radar_account_id,
      reason: _0x9bcee4,
      progress: {
        videos: {
          planned: null,
          done: _0x2a1655.videosWatched || 0
        },
        nurture: {
          totalMin: _0x2a1655.totalMinutes,
          actionsDone: _0x2a1655.actionsDone || 0
        }
      }
    };
  }
  function _0x4d5649() {
    return "nurture_state_" + (window._radar_account_id || "default");
  }
  function _0x1eb01e(_0x4db411, _0x4314df, _0x4b718b, _0x3284ab) {
    const _0x34d5a5 = Math.max(1, Math.ceil((_0x4db411.endTime - Date.now()) / 60000));
    _0x4dd470(_0x4b718b || "养号中：剩余约 " + _0x34d5a5 + " 分钟");
    if (_0x3284ab) {
      _0x5798ca(_0x3284ab);
    }
    try {
      _0x36d420.send("automation-data", {
        type: "nurture-progress",
        payload: {
          accountId: window._radar_account_id,
          videosWatched: _0x4db411.videosWatched || 0,
          remainingMin: _0x34d5a5,
          totalMin: _0x4db411.totalMinutes,
          action: _0x4b718b || "养号中：剩余约 " + _0x34d5a5 + " 分钟",
          log: _0x3284ab || null
        }
      });
    } catch (_0x504cb8) {}
  }
  function _0x5d372e(_0x7a488a) {
    if (Array.isArray(_0x7a488a)) {
      return _0x7a488a.map(_0x439535 => String(_0x439535).trim()).filter(Boolean);
    }
    return String(_0x7a488a || "").split(/[,，、\s\n]+/).map(_0x429f3d => _0x429f3d.trim()).filter(_0xb9bba3 => _0xb9bba3.length > 0);
  }
  const _0x32945c = ["创业", "副业", "赚钱", "挣钱", "合伙人", "合作", "项目", "轻创业", "打工", "内卷", "搞钱", "兼职", "宝妈", "在家赚钱", "时间灵活", "大学生", "实习", "求职", "转行", "技能学习", "考证", "开店", "做生意", "小老板", "个体户", "引流", "获客", "私域", "降本增效", "装修", "翻新", "全屋定制", "设计", "报价", "工期", "教育", "培训", "择校", "报班", "护肤", "美甲", "美睫", "轻医美", "变美", "买车", "汽车", "车型", "贷款", "二手车", "买房", "租房", "楼盘", "学区", "首付", "本地生活", "同城", "家政", "维修", "摄影", "餐饮", "宠物", "电商", "带货", "拿货", "分销", "供应链", "直播合作", "软件开发", "系统定制", "自动化工具", "养生", "睡眠", "调理", "保健", "体重管理", "理财", "基金", "保险", "资产增值", "内存卡", "SD卡", "TF卡", "数码", "闲置", "批发"];
  const _0x909db8 = ["识别", "用户", "评论", "引导", "私信", "专业", "真诚", "需求", "目标人群", "回复", "策略", "风格", "身份", "目的", "要求", "控制", "以内", "适合", "智能体", "人群"];
  function _0x5099e8(_0x4208a1) {
    const _0x11da97 = new Set();
    const _0x647ef1 = [];
    for (const _0x2738ae of _0x4208a1 || []) {
      const _0x39ffe7 = String(_0x2738ae || "").trim();
      if (!_0x39ffe7 || _0x11da97.has(_0x39ffe7)) {
        continue;
      }
      _0x11da97.add(_0x39ffe7);
      _0x647ef1.push(_0x39ffe7);
    }
    return _0x647ef1;
  }
  function _0x1d9bed(_0x17bbed) {
    return String(_0x17bbed || "").replace(/[【】「」"'“”]/g, " ").split(/[，,。；;、\s/（）()：:·|+-]+/).map(_0x3dd829 => _0x3dd829.trim()).filter(_0x397053 => _0x397053.length >= 2 && _0x397053.length <= 8).filter(_0x1db72d => !_0x909db8.some(_0x3d28f8 => _0x1db72d.includes(_0x3d28f8)));
  }
  function _0x2fa3c4(_0x5bb3d7, _0x1866a0 = []) {
    if (!_0x5bb3d7) {
      return _0x5099e8(_0x1866a0).slice(0, 12);
    }
    const _0x455625 = [_0x5bb3d7.name, _0x5bb3d7.subtitle, _0x5bb3d7.role, _0x5bb3d7.goal, _0x5bb3d7.style, _0x5bb3d7.prompt, _0x5bb3d7.videoGoal, _0x5bb3d7.firstPostGoal].filter(Boolean).join(" ");
    const _0x2d1023 = _0x32945c.filter(_0x594583 => _0x455625.includes(_0x594583));
    const _0x5ae3da = _0x1d9bed((_0x5bb3d7.name || "") + " " + (_0x5bb3d7.subtitle || ""));
    const _0x425ef3 = _0x1d9bed((_0x5bb3d7.goal || "") + " " + (_0x5bb3d7.prompt || ""));
    return _0x5099e8([..._0x2d1023, ..._0x5ae3da, ..._0x425ef3, ..._0x1866a0]).slice(0, 12);
  }
  function _0xb19ff9(_0x3d34cf, _0x544afc = {}) {
    const _0x3bf122 = Array.isArray(_0x3d34cf?.nurtureKeywords) && _0x3d34cf.nurtureKeywords.length ? _0x3d34cf.nurtureKeywords : _0x5d372e(_0x3d34cf?.keywords || _0x544afc.personaKeywords);
    if (_0x3d34cf?.nurtureStrategy === "persona") {
      const _0x1a4b45 = _0x2fa3c4(_0x3d34cf.nurturePersona, _0x3bf122);
      if (_0x1a4b45.length) {
        return _0x1a4b45;
      }
    }
    return _0x5d372e(_0x3bf122);
  }
  function _0x4d2c40(_0x2a17bc, _0x2b71ee) {
    const _0x14496a = String(_0x2a17bc || "");
    if (!_0x14496a || !_0x2b71ee?.length) {
      return [];
    }
    return _0x2b71ee.filter(_0x25aaec => _0x25aaec && _0x14496a.includes(_0x25aaec));
  }
  function _0x3e5def() {
    const _0x309cf1 = _0x395aab() || document;
    const _0x53acab = _0x309cf1.querySelector("[data-e2e=\"video-desc\"]")?.innerText || "";
    const _0x1fd46d = _0x309cf1.querySelector("[data-e2e=\"feed-video-nickname\"]")?.innerText || "";
    return (_0x53acab + " " + _0x1fd46d).trim();
  }
  function _0x1ec086() {
    const _0x42e601 = _0x395aab() || document;
    return _0x3f10e5("", _0x42e601) || _0x47b397(_0x42e601) || _0x2e11b3() || _0x3e5def() || "未知视频";
  }
  function _0x5c7ac4(_0x33811a = _0x53e4ac.currentTask) {
    const _0x244a81 = _0x33811a?.nurturePersona || {};
    const _0x589e6e = [_0x244a81.name, _0x244a81.subtitle, _0x244a81.role, _0x244a81.goal, _0x244a81.style, _0x244a81.prompt, _0x244a81.videoGoal, _0x244a81.firstPostGoal].filter(Boolean).join("；");
    const _0x25c119 = Array.isArray(_0x33811a?.nurtureKeywords) ? _0x33811a.nurtureKeywords.join("、") : String(_0x33811a?.keywords || "");
    return {
      aiRole: "抖音养号标签校准专家",
      aiGoal: "判断当前推荐视频是否适合用于校准账号人设标签：" + (_0x244a81.name || _0x33811a?.nurturePersonaName || "未命名人设"),
      aiStyle: _0x589e6e || _0x25c119 || "判断视频是否符合账号养号方向",
      aiPrompt: (_0x589e6e || "") + "\n养号标签关键词：" + _0x25c119 + "\n只放行明显有助于平台理解账号兴趣方向的视频；泛娱乐、无关、直播、硬广、低质搬运内容应判为不匹配。"
    };
  }
  async function _0x155dba(_0x2fc826, _0x153348) {
    const _0x53747b = _0x1ec086();
    if (_0x153348.lastNurtureVideoDecision?.key === _0x53747b) {
      return _0x153348.lastNurtureVideoDecision;
    }
    const _0x355c66 = _0x153348.interestKeywords || [];
    const _0x3f94d7 = _0x3e5def() || _0x2e11b3() || "未知视频";
    const _0x122975 = _0x4d2c40(_0x3f94d7, _0x355c66);
    _0x3415d4(document, "养号进入视频后先暂停，等待人设匹配判断");
    let _0x495916 = null;
    if (_0x122975.length > 0) {
      _0x495916 = {
        success: true,
        pass: true,
        score: 90,
        reason: "命中人设标签：" + _0x122975.join("、"),
        matched: _0x122975,
        source: "local-keyword"
      };
      _0x5798ca("🎯 养号人设预筛：本地命中「" + _0x122975.join("、") + "」，准备完播");
    } else {
      try {
        const _0x5bbeb1 = _0xb24c1(document, 4);
        _0x5798ca("🎯 养号人设预筛：暂停视频，提交 AI 判断《" + _0xdb64e6(_0x3f94d7, 40) + "》…");
        const _0x2b5b34 = await _0x36d420.invoke("ai-match-video-context", _0x1fb365({
          videoTitle: _0x3f94d7,
          comments: _0x5bbeb1,
          keywords: _0x355c66.join(","),
          authorNickname: "",
          matchScene: "nurture",
          withMainPost: false,
          config: _0x5c7ac4(_0x153348.currentTask)
        }));
        if (_0x39f79a(_0x2fc826)) {
          throw new Error("TASK_ABORTED");
        }
        _0x495916 = {
          ...(_0x2b5b34 || {}),
          pass: _0x2b5b34?.pass !== false,
          matched: [],
          source: "ai",
          reason: _0x2b5b34?.reason || (_0x2b5b34?.pass === false ? "AI 判断不匹配" : "AI 判断匹配")
        };
        _0x5798ca("🎯 养号人设预筛：AI " + (_0x495916.pass ? "通过" : "跳过") + "（" + _0xdb64e6(_0x495916.reason, 70) + "）");
      } catch (_0x3c39d7) {
        if (_0x3c39d7.message === "TASK_ABORTED") {
          throw _0x3c39d7;
        }
        _0x495916 = {
          success: false,
          pass: false,
          score: 0,
          reason: "AI 判断异常，未确认匹配：" + _0xdb64e6(_0x3c39d7.message || _0x3c39d7, 60),
          matched: [],
          source: "ai-error"
        };
        _0x5798ca("🎯 养号人设预筛异常：" + _0xdb64e6(_0x3c39d7.message || _0x3c39d7, 80) + "，本视频快速跳过");
      }
    }
    _0x153348.lastNurtureVideoDecision = {
      ..._0x495916,
      key: _0x53747b,
      at: Date.now()
    };
    if (!_0x495916.pass) {
      _0x153348.videosSkipped = (_0x153348.videosSkipped || 0) + 1;
      _0x1eb01e(_0x153348, _0x2fc826, "养号：视频不符合人设，快速跳过...", "⏭️ 养号：人设不匹配，跳过当前视频（" + _0xdb64e6(_0x495916.reason, 60) + "）");
    } else {
      _0x153348.lastVideoKeywordHit = _0x495916.matched?.length ? _0x495916.matched : ["AI匹配"];
    }
    return _0x153348.lastNurtureVideoDecision;
  }
  function _0x271a21(_0x12e882 = false) {
    const _0x55f09c = _0x395aab() || document;
    const _0x5b930b = _0x486874(_0x55f09c);
    if (_0x12e882 && _0x5b930b > 0) {
      const _0x413b8f = Math.max(8000, Math.min(240000, Math.round(_0x5b930b * 0.92)));
      const _0x23faed = Math.max(_0x413b8f + 1200, Math.min(300000, Math.round(_0x5b930b * 1.12)));
      return {
        minMs: _0x413b8f,
        maxMs: _0x23faed,
        durationMs: _0x5b930b
      };
    }
    if (_0x5b930b > 0) {
      const _0x579be4 = Math.max(6000, Math.min(45000, Math.round(_0x5b930b * 0.55)));
      const _0x203021 = Math.max(_0x579be4 + 1000, Math.min(65000, Math.round(_0x5b930b * 0.85)));
      return {
        minMs: _0x579be4,
        maxMs: _0x203021,
        durationMs: _0x5b930b
      };
    }
    if (_0x12e882) {
      return {
        minMs: 24000,
        maxMs: 52000,
        durationMs: 0
      };
    } else {
      return {
        minMs: 8000,
        maxMs: 25000,
        durationMs: 0
      };
    }
  }
  async function _0x518b7c(_0x811d82, _0xf780fb) {
    const _0x468b39 = _0x395aab() || document;
    const _0x1f9f32 = Array.from(_0x468b39.querySelectorAll("[data-e2e*=\"share\"], [aria-label*=\"分享\"], button, div, span, a")).filter(_0x2eaae7 => {
      if (!_0x28b2eb(_0x2eaae7)) {
        return false;
      }
      const _0x147833 = (_0x2eaae7.getAttribute("aria-label") || "") + " " + (_0x2eaae7.getAttribute("title") || "") + " " + (_0x2eaae7.getAttribute("data-e2e") || "") + " " + (_0x2eaae7.innerText || "");
      if (!/分享|share/i.test(_0x147833)) {
        return false;
      }
      const _0x153875 = _0x2eaae7.getBoundingClientRect();
      return _0x153875.width > 0 && _0x153875.height > 0;
    }).sort((_0x190608, _0x302532) => {
      const _0x935959 = _0x190608.getBoundingClientRect();
      const _0xa27b80 = _0x302532.getBoundingClientRect();
      return _0xa27b80.left - _0x935959.left || _0x935959.top - _0xa27b80.top;
    });
    const _0x163a83 = _0x1f9f32[0];
    if (!_0x163a83) {
      _0x5798ca("养号：未找到分享按钮，跳过分享模拟");
      return false;
    }
    _0x1eb01e(_0xf780fb, _0x811d82, "养号：模拟打开分享面板...", "↗️ 养号：打开分享面板，增强兴趣信号");
    await _0x157e66(_0x163a83.closest("button, a, [role=\"button\"]") || _0x163a83, _0x811d82);
    await _0x307a16(900, 1800, _0x811d82, "分享面板停留");
    if (Math.random() < 0.45) {
      const _0x3a15b1 = Array.from(document.querySelectorAll("button, div, span, a, [role=\"button\"]")).find(_0x14a0fe => _0x28b2eb(_0x14a0fe) && /复制链接|复制口令|复制/.test((_0x14a0fe.innerText || _0x14a0fe.getAttribute("aria-label") || "").trim()));
      if (_0x3a15b1) {
        await _0x157e66(_0x3a15b1.closest("button, a, [role=\"button\"]") || _0x3a15b1, _0x811d82);
        await _0x307a16(500, 1000, _0x811d82, "复制分享链接");
        _0x5798ca("↗️ 养号：已模拟复制分享链接");
      }
    }
    await _0x26bef4(_0x811d82);
    _0xf780fb.shareActions = (_0xf780fb.shareActions || 0) + 1;
    await _0x307a16(600, 1200, _0x811d82, "关闭分享面板");
    return true;
  }
  function _0x5cb3d1(_0x59768c, _0xc4a89a, _0x3fd14c = 0) {
    if (!_0x59768c || !_0xc4a89a?.length) {
      return [];
    }
    const _0x1d07ec = [];
    const _0x59c1f3 = _0x59768c.querySelectorAll(_0x1bc3cb["douyin.com"].commentItem);
    const _0x40c804 = _0x3fd14c > 0 ? Math.min(_0x3fd14c, _0x59c1f3.length) : _0x59c1f3.length;
    for (let _0xbf201d = 0; _0xbf201d < _0x40c804; _0xbf201d++) {
      const _0x145203 = _0x59c1f3[_0xbf201d];
      const _0x1eb205 = _0x4d2c40(_0x145203.innerText || "", _0xc4a89a);
      if (_0x1eb205.length) {
        _0x1d07ec.push(..._0x1eb205);
      }
    }
    return [...new Set(_0x1d07ec)];
  }
  async function _0x26bef4(_0x378024) {
    window.dispatchEvent(new KeyboardEvent("keydown", {
      key: "Escape",
      keyCode: 27,
      bubbles: true
    }));
    await _0x553cac(400);
  }
  async function _0x877705(_0x1cba9a) {
    if (_0x161e34()) {
      return true;
    }
    _0x5798ca("养号：返回推荐流");
    if (window.history.length > 1) {
      window.history.back();
      await _0x307a16(2500, 4000, _0x1cba9a, "返回推荐流");
    }
    if (!_0x161e34()) {
      window.location.href = _0x4a09cd();
      await _0x307a16(3500, 5500, _0x1cba9a, "加载推荐流");
    }
    return _0x161e34();
  }
  async function _0x90570a(_0x46cc8d, _0x12c13f, _0x269626 = {}) {
    const _0x10fe0b = !!_0x269626.forceComplete;
    const _0xa1f990 = !!_0x269626.fromSearch;
    const _0x5b3687 = _0x12c13f.interestKeywords || [];
    const _0x208fa6 = _0x1ec086();
    const _0x30b1d2 = _0x3e5def();
    const _0x3b8c60 = _0x4d2c40(_0x30b1d2, _0x5b3687);
    const _0x3fdcfb = _0x12c13f.nurtureStrategy === "persona";
    const _0x37f0e3 = (parseInt(_0x12c13f.currentTask?.stayMin, 10) || 8) * 1000;
    const _0x7178af = (parseInt(_0x12c13f.currentTask?.stayMax, 10) || 25) * 1000;
    let _0xc17a29 = _0x37f0e3;
    let _0x3f7c75 = _0x7178af;
    let _0x2e0bec = null;
    if (_0x3fdcfb && !_0x10fe0b) {
      _0x2e0bec = await _0x155dba(_0x46cc8d, _0x12c13f);
      if (_0x2e0bec?.pass === false) {
        return {
          skipped: true,
          reason: _0x2e0bec.reason || "人设不匹配"
        };
      }
    }
    if (_0x10fe0b || _0x3fdcfb && _0x2e0bec?.pass !== false) {
      const _0x4a98a1 = _0x271a21(true);
      _0xc17a29 = _0x4a98a1.minMs;
      _0x3f7c75 = _0x4a98a1.maxMs;
      const _0x357137 = _0xa1f990 ? "搜索词「" + _0xdb64e6(_0x12c13f.searchKeyword || _0x5b3687[0] || "", 24) + "」" : _0x2e0bec?.reason || (_0x3b8c60.length ? "命中「" + _0x3b8c60.join("、") + "」" : "AI 判断匹配");
      _0x1eb01e(_0x12c13f, _0x46cc8d, _0xa1f990 ? "养号：搜索视频完播中..." : "养号：人设匹配，准备完播...", _0xa1f990 ? "📺 养号：完播搜索视频（" + _0x357137 + "）" : "🎯 养号：人设匹配，完播当前视频（" + _0xdb64e6(_0x357137, 60) + "）");
    } else if (_0x3b8c60.length > 0) {
      const _0x1062e6 = _0x271a21(false);
      _0xc17a29 = Math.max(_0x1062e6.minMs, _0x37f0e3 + 12000);
      _0x3f7c75 = Math.max(_0x1062e6.maxMs, _0x7178af + 22000);
      _0x12c13f.lastVideoKeywordHit = _0x3b8c60;
      _0x1eb01e(_0x12c13f, _0x46cc8d, "养号：命中「" + _0x3b8c60[0] + "」，延长观看...", "🎯 养号：视频命中「" + _0x3b8c60.join("、") + "」，延长停留");
    } else {
      _0x12c13f.lastVideoKeywordHit = null;
      _0x1eb01e(_0x12c13f, _0x46cc8d, "养号：观看视频中...", "📺 养号：模拟观看当前视频");
    }
    const _0x3d0c53 = _0x395aab() || document;
    _0x35a4b1(_0x3d0c53, "人设匹配后恢复播放以完成观看");
    const _0x2e4e84 = Number(_0x486874(_0x3d0c53) || 0) || 0;
    const _0x2bef17 = Math.max(800, resolveNurtureEngageAfterMs(_0x2e4e84, _0xc17a29));
    const _0x2aeef1 = Math.max(1200, _0xc17a29 - _0x2bef17);
    const _0x3a60ba = Math.max(_0x2aeef1 + 800, _0x3f7c75 - _0x2bef17);
    if (_0x2e4e84 > 0) {
      _0x5798ca("⏱ 养号：视频约 " + (_0x2e4e84 / 1000).toFixed(1) + " 秒，先看 " + (_0x2bef17 / 1000).toFixed(1) + " 秒再互动");
    }
    await _0x307a16(_0x2bef17, _0x2bef17 + 800, _0x46cc8d, "观看后互动前停顿");
    if (!_0x39f79a(_0x46cc8d)) {
      try {
        await nurtureEngageCurrentVideo(_0x46cc8d, _0x12c13f, {
          shouldAbort: _0x39f79a,
          randomDelay: _0x307a16,
          reportNurtureProgress: _0x1eb01e,
          reportTraceLog: _0x5798ca,
          reportCurrentAction: _0x4dd470,
          simulateHumanClick: _0x157e66,
          isVisibleElement: _0x28b2eb,
          getDouyinFeedScope: _0x395aab,
          getVideoEngagePack: _0x3e5ce8,
          getVisibleDouyinVideoDurationMs: _0x486874,
          pauseVisibleDouyinVideos: _0x3415d4,
          resumeVisibleDouyinVideos: _0x35a4b1,
          startCurrentVideoPauseGuard: _0x45d9ec,
          sleep: _0x553cac
        });
      } catch (_0x8df9af) {
        if (_0x8df9af?.message === "TASK_ABORTED") {
          throw _0x8df9af;
        }
        console.warn("[养号] 视频互动异常:", _0x8df9af?.message || _0x8df9af);
        _0x5798ca("养号：视频互动跳过（" + _0xdb64e6(_0x8df9af?.message || _0x8df9af, 48) + "）");
      }
    }
    if (!_0x39f79a(_0x46cc8d)) {
      _0x35a4b1(_0x3d0c53, "互动后继续观看");
      await _0x307a16(_0x2aeef1, _0x3a60ba, _0x46cc8d, _0x10fe0b || _0x3fdcfb ? "视频完播" : _0x3b8c60.length ? "兴趣视频观看" : "观看视频");
    }
    _0x12c13f.videosWatched = (_0x12c13f.videosWatched || 0) + 1;
    if (_0x3fdcfb && _0x2e0bec?.pass !== false && Math.random() < 0.32) {
      await _0x547785(_0x46cc8d, _0x12c13f, {
        personaFocus: true,
        maxComments: _0x493f07
      });
    }
    const _0x5b1b80 = _0x1ec086();
    return {
      skipped: false,
      switchedDuringWatch: !!_0x208fa6 && !!_0x5b1b80 && _0x208fa6 !== _0x5b1b80,
      personaMatched: !!_0x3fdcfb && _0x2e0bec?.pass !== false
    };
  }
  async function _0x547785(_0x11e236, _0x11c995, {
    personaFocus = false,
    maxComments = 0
  } = {}) {
    const _0x1924ac = _0x11c995.interestKeywords || [];
    const _0x411ecf = _0x11c995.nurtureStrategy === "persona";
    const _0x490778 = personaFocus || _0x411ecf ? maxComments > 0 ? maxComments : _0x493f07 : 0;
    const _0x1c14b0 = await _0x88236f(document.body, _0x11e236);
    if (!_0x1c14b0) {
      _0x5798ca("养号：评论区未能打开，跳过");
      return [];
    }
    const _0x46c1d5 = document.querySelector(_0x1bc3cb["douyin.com"].commentPanel);
    const _0x5e1eec = _0x5cb3d1(_0x46c1d5, _0x1924ac, _0x490778);
    let _0x45835e = personaFocus ? 0 : 2 + Math.floor(Math.random() * 3);
    let _0xac7795 = personaFocus ? 500 : 1200;
    let _0x54aefa = personaFocus ? 1000 : 2200;
    if (personaFocus) {
      _0x1eb01e(_0x11c995, _0x11e236, "养号：人设匹配，快速浏览前 " + _0x490778 + " 条评论...", "💬 养号：人设视频已完播，仅浏览前 " + _0x490778 + " 条评论");
    } else if (_0x5e1eec.length > 0) {
      _0x45835e += 3;
      _0xac7795 = 2500;
      _0x54aefa = 5000;
      _0x1eb01e(_0x11c995, _0x11e236, "养号：评论命中「" + _0x5e1eec[0] + "」，多看一会...", "🎯 养号：评论命中「" + _0x5e1eec.join("、") + "」，延长浏览");
    } else if (_0x411ecf) {
      _0x45835e = 1;
      _0xac7795 = 600;
      _0x54aefa = 1200;
      _0x1eb01e(_0x11c995, _0x11e236, "养号：快速浏览前 " + (_0x490778 || _0x493f07) + " 条评论...", "💬 养号：仅浏览前 " + (_0x490778 || _0x493f07) + " 条评论后返回");
    } else {
      _0x1eb01e(_0x11c995, _0x11e236, "养号：浏览评论区...", "💬 养号：打开评论区浏览");
    }
    if (_0x46c1d5) {
      const _0x1f782c = personaFocus ? 1 : _0x45835e;
      for (let _0xe2b4fd = 0; _0xe2b4fd < _0x1f782c; _0xe2b4fd++) {
        if (_0x39f79a(_0x11e236)) {
          break;
        }
        if (personaFocus) {
          const _0xb11741 = _0xe7ea7f(_0x46c1d5);
          if (_0xb11741 >= (_0x490778 || _0x493f07)) {
            break;
          }
        }
        _0x46c1d5.scrollTop += personaFocus ? 60 + Math.floor(Math.random() * 80) : 100 + Math.floor(Math.random() * 220);
        await _0x307a16(_0xac7795, _0x54aefa, _0x11e236, personaFocus ? "人设快速浏览评论" : _0x5e1eec.length ? "兴趣评论浏览" : "浏览评论");
      }
    }
    await _0x26bef4(_0x11e236);
    await _0x307a16(personaFocus ? 400 : 800, personaFocus ? 900 : 1500, _0x11e236, "关闭评论");
    return _0x5e1eec;
  }
  async function _0x58b072(_0x3ec425, _0x3f6f04, _0x4c3518 = "author") {
    let _0x53108d = null;
    if (_0x4c3518 === "author") {
      const _0x50e571 = _0x395aab() || document;
      const _0xc7ac95 = _0x50e571.querySelector("[data-e2e=\"feed-video-nickname\"]");
      _0x53108d = _0xc7ac95?.closest("a[href*=\"/user/\"]") || _0x50e571.querySelector("a[href*=\"/user/\"]");
      _0x1eb01e(_0x3f6f04, _0x3ec425, "养号：查看博主主页...", "👤 养号：进入博主主页浏览");
    } else {
      _0x1eb01e(_0x3f6f04, _0x3ec425, "养号：查看评论用户主页...", "👥 养号：进入评论用户主页");
      await _0x88236f(document.body, _0x3ec425);
      const _0x149692 = Array.from(document.querySelectorAll(_0x1bc3cb["douyin.com"].commentItem)).slice(0, _0x3f6f04?.nurtureStrategy === "persona" ? _0x493f07 : 12);
      const _0x3948a6 = _0x149692[Math.floor(Math.random() * Math.max(_0x149692.length, 1))];
      _0x53108d = _0x3948a6?.querySelector("a[href*=\"/user/\"]");
      await _0x26bef4(_0x3ec425);
    }
    if (!_0x53108d?.href || _0x53108d.href.includes("/user/self")) {
      return;
    }
    await _0x157e66(_0x53108d, _0x3ec425);
    await _0x307a16(3500, 5500, _0x3ec425, "加载主页");
    if (!_0x3cad76()) {
      return;
    }
    await _0xdc9fa5(8000 + Math.floor(Math.random() * 12000));
    await _0x877705(_0x3ec425);
  }
  function _0x52e10e(_0x25fe00 = window.location.href) {
    try {
      const _0x197ea8 = String(_0x25fe00 || "");
      return /live\.douyin\.com/i.test(_0x197ea8) || /\/live\//i.test(_0x197ea8) || /webcast/i.test(_0x197ea8);
    } catch (_0x2844d3) {
      return false;
    }
  }
  function _0x5df397(_0x59f901 = window.location.href) {
    return _0x52e10e(_0x59f901);
  }
  function _0x27de0e() {
    const _0x24de71 = _0x395aab();
    if (_0x24de71 && _0x28b2eb(_0x24de71)) {
      return true;
    }
    if (!_0x161e34() && !_0x545c23()) {
      return false;
    }
    return !!document.querySelector("[data-e2e=\"feed-active-video\"], [data-e2e=\"video-switch-next-btn\"], [data-e2e=\"video-switch-next-arrow\"]");
  }
  function _0x27c1c9() {
    if (_0x5df397()) {
      return true;
    }
    if (_0x2ee777()) {
      return true;
    }
    return _0x4d2c83();
  }
  const _0x5e844f = new Set(["live-player", "webcast-player", "feed-live", "live-room", "live-video", "browse-live"]);
  function _0x54fd7b(_0x5d59c5) {
    if (!_0x5d59c5) {
      return false;
    }
    const _0x5e1af9 = String(_0x5d59c5).toLowerCase();
    if (_0x5e844f.has(_0x5e1af9)) {
      return true;
    }
    return /(^|[-_])(live|webcast)([-_]|$)/.test(_0x5e1af9);
  }
  function _0x4b66df(_0xcaac) {
    const _0x232152 = String(_0xcaac || "").trim();
    if (!_0x232152 || _0x232152.length > 120) {
      return false;
    }
    if (/的抖音直播间(?:直播)?$/.test(_0x232152)) {
      return true;
    }
    if (/抖音直播间直播$/.test(_0x232152)) {
      return true;
    }
    if (/^正在直播/.test(_0x232152)) {
      return true;
    }
    return false;
  }
  function _0x4f265f(_0x40a1fa) {
    if (!_0x40a1fa?.querySelectorAll) {
      return false;
    }
    let _0xe44214 = false;
    const _0x38e004 = _0x40a1fa.querySelectorAll("a[href*=\"/live/\"], a[href*=\"webcast\"], a[href*=\"live.douyin.com\"]");
    for (const _0x16067a of _0x38e004) {
      if (!_0x28b2eb(_0x16067a) || !_0x8a82eb(_0x16067a)) {
        continue;
      }
      const _0xe3b6f2 = (_0x16067a.innerText || _0x16067a.getAttribute("aria-label") || "").trim();
      if (/进入直播间|点击进入直播|观看直播/.test(_0xe3b6f2)) {
        _0xe44214 = true;
        break;
      }
      const _0x1a0c13 = _0x16067a.getBoundingClientRect();
      if (_0x1a0c13.width >= 120 && _0x1a0c13.height >= 90) {
        _0xe44214 = true;
        break;
      }
    }
    if (!_0xe44214) {
      for (const _0x509db9 of _0x40a1fa.querySelectorAll("[data-e2e]")) {
        if (!_0x8a82eb(_0x509db9)) {
          continue;
        }
        if (_0x54fd7b(_0x509db9.getAttribute("data-e2e"))) {
          _0xe44214 = true;
          break;
        }
      }
    }
    if (!_0xe44214) {
      const _0x30e647 = _0x40a1fa.querySelectorAll("span, div, a, button, [class*=\"badge\"], [class*=\"Badge\"], [class*=\"tag\"], [class*=\"Tag\"]");
      for (const _0x225ce4 of _0x30e647) {
        if (!_0x28b2eb(_0x225ce4) || !_0x8a82eb(_0x225ce4)) {
          continue;
        }
        const _0x10a5e1 = (_0x225ce4.innerText || "").trim();
        if (!_0x10a5e1) {
          continue;
        }
        if (/^(直播中|直播|连麦中)$/.test(_0x10a5e1)) {
          _0xe44214 = true;
          break;
        }
        if (/进入直播间/.test(_0x10a5e1) && _0x10a5e1.length <= 40) {
          _0xe44214 = true;
          break;
        }
      }
    }
    return _0xe44214;
  }
  function _0x4d2c83(_0x12b03c = _0x395aab()) {
    if (_0x52e10e() && !_0x27de0e()) {
      return true;
    }
    const _0x279847 = _0x12b03c && _0x28b2eb(_0x12b03c) ? _0x12b03c : _0x395aab();
    if (_0x2ee777(_0x279847)) {
      return true;
    }
    const _0x5d4e86 = _0x2e11b3();
    if (_0x4b66df(_0x5d4e86)) {
      return true;
    }
    const _0x5c1d21 = _0x279847?.querySelector?.("[data-e2e=\"video-desc\"]") || document.querySelector("[data-e2e=\"feed-active-video\"] [data-e2e=\"video-desc\"]") || document.querySelector("[data-e2e=\"video-desc\"]");
    const _0x45697a = _0x14df64(_0x5c1d21?.innerText || "");
    if (_0x4b66df(_0x45697a)) {
      return true;
    }
    if (!_0x279847) {
      return false;
    }
    const _0x3d67b3 = _0x4f265f(_0x279847);
    if (!_0x3d67b3) {
      return false;
    }
    const _0xe44565 = _0x487d96("openCommentBtns");
    let _0x330fa2 = false;
    if (_0xe44565) {
      try {
        _0x330fa2 = !!_0x279847.querySelector(_0xe44565);
      } catch (_0x136b4f) {}
    }
    const _0x372b52 = !!_0x279847.querySelector("[data-e2e=\"video-desc\"]") || !!_0x330fa2;
    const _0x210e5b = !!_0x279847.querySelector("a[href*=\"/live/\"], a[href*=\"webcast\"]");
    if (_0x372b52 && !_0x210e5b && !_0x4b66df(_0x45697a)) {
      return false;
    }
    return true;
  }
  async function _0x3a84c9(_0x2bb522) {
    const _0x242768 = ["[data-e2e=\"close\"]", "[aria-label=\"关闭\"]", "[aria-label=\"close\"]", ".semi-modal-close", "[class*=\"close-btn\"]", "[class*=\"Close\"]"];
    for (const _0x6684a of _0x242768) {
      const _0x2c2395 = Array.from(document.querySelectorAll(_0x6684a)).filter(_0x28b2eb);
      for (const _0x317578 of _0x2c2395.slice(0, 2)) {
        try {
          await _0x157e66(_0x317578, _0x2bb522);
          await _0x553cac(250);
        } catch (_0x9de5dd) {}
      }
    }
    document.body.dispatchEvent(new KeyboardEvent("keydown", {
      key: "Escape",
      code: "Escape",
      keyCode: 27,
      which: 27,
      bubbles: true
    }));
  }
  async function _0x13f3fc(_0x57c514, {
    forceReload = false
  } = {}) {
    _0x4ce39a();
    await _0x3a84c9(_0x57c514);
    const _0x500a42 = _0x47b397();
    const _0x5be56d = _0x27de0e();
    if (forceReload) {
      console.warn("[Built-in-Debug] [推荐流] 连续跳过直播间失败，强制刷新推荐流");
      _0x4dd470("直播间跳过受阻，正在刷新推荐页...");
      window.location.href = _0x4a09cd();
      await _0x307a16(4000, 6500, _0x57c514, "刷新推荐流");
      return;
    }
    if (_0x52e10e() && !_0x5be56d) {
      await _0x22eac7(_0x57c514);
      await _0x307a16(2500, 4000, _0x57c514, "离开直播间");
      return;
    }
    console.log("[Built-in-Debug] [推荐流] 内嵌直播卡片，滑动切换下一条");
    await _0x3c1215(_0x57c514);
    await _0x307a16(1200, 2200, _0x57c514, "跳过直播");
    const _0x523ad3 = await _0x4d72d6(_0x57c514, _0x500a42);
    if (!_0x523ad3) {
      console.warn("[Built-in-Debug] [推荐流] 首次滑动未离开直播，重试加强切换");
      await _0x3c1215(_0x57c514, {
        aggressive: true
      });
      await _0x307a16(1500, 2800, _0x57c514, "重试跳过直播");
      await _0x4d72d6(_0x57c514, _0x500a42, 8);
    }
  }
  async function _0x405913(_0x5bed37, _0x4fc049) {
    const _0x54cce6 = Array.from(document.querySelectorAll("a, span, p, div[role=\"tab\"], li")).find(_0x12e61d => {
      if (!_0x28b2eb(_0x12e61d)) {
        return false;
      }
      const _0xce702a = (_0x12e61d.innerText || "").trim();
      return _0xce702a === _0x5bed37 && _0xce702a.length <= 4;
    });
    if (!_0x54cce6) {
      return false;
    }
    const _0x1fe317 = _0x54cce6.closest("a") || _0x54cce6;
    await _0x157e66(_0x1fe317, _0x4fc049);
    await _0x307a16(3500, 5500, _0x4fc049, "打开" + _0x5bed37);
    return true;
  }
  async function _0x29a5c0(_0x42b42c) {
    await _0x553cac(1500);
    const _0x56db39 = Array.from(document.querySelectorAll("a[href*=\"live\"], a[href*=\"webcast\"]")).filter(_0x2acca7 => _0x28b2eb(_0x2acca7) && _0x2acca7.href && !_0x2acca7.href.includes("/user/self"));
    if (_0x56db39.length > 0) {
      const _0x408864 = _0x56db39[Math.floor(Math.random() * Math.min(_0x56db39.length, 10))];
      await _0x157e66(_0x408864, _0x42b42c);
      await _0x307a16(4000, 6500, _0x42b42c, "进入直播间");
      return true;
    }
    const _0xcaae0 = Array.from(document.querySelectorAll("a, div[role=\"button\"], div[class*=\"card\"]")).filter(_0x5db846 => {
      if (!_0x28b2eb(_0x5db846)) {
        return false;
      }
      const _0x5554f3 = (_0x5db846.innerText || "").slice(0, 100);
      return /直播中/.test(_0x5554f3);
    });
    if (_0xcaae0.length > 0) {
      const _0x56658b = _0xcaae0[Math.floor(Math.random() * Math.min(_0xcaae0.length, 8))];
      await _0x157e66(_0x56658b, _0x42b42c);
      await _0x307a16(4000, 6500, _0x42b42c, "进入直播间");
      return true;
    }
    return false;
  }
  async function _0x49e10d(_0x4e2e3b, _0x6f3640) {
    _0x1eb01e(_0x6f3640, _0x4e2e3b, "养号：寻找直播间...", "📺 养号：随机进入直播间");
    let _0x39b56 = _0x27c1c9();
    if (!_0x39b56) {
      const _0x285403 = await _0x405913("直播", _0x4e2e3b);
      if (_0x285403) {
        _0x39b56 = await _0x29a5c0(_0x4e2e3b);
      }
    }
    if (!_0x39b56) {
      const _0x31bb30 = _0x395aab() || document;
      const _0x4b1c27 = Array.from(_0x31bb30.querySelectorAll("a, span, div, button")).find(_0x558e3f => _0x28b2eb(_0x558e3f) && /直播中|进入直播/.test((_0x558e3f.innerText || "").trim()));
      if (_0x4b1c27) {
        await _0x157e66(_0x4b1c27.closest("a") || _0x4b1c27, _0x4e2e3b);
        await _0x307a16(4000, 6500, _0x4e2e3b, "进入直播间");
        _0x39b56 = true;
      }
    }
    if (!_0x39b56) {
      _0x5798ca("养号：未找到可进入的直播间，跳过");
      await _0x877705(_0x4e2e3b);
      return;
    }
    const _0x1cbc94 = (40 + Math.floor(Math.random() * 50)) * 1000;
    const _0x447f0e = Date.now() + _0x1cbc94;
    let _0x27f145 = -1;
    _0x5798ca("📺 养号：观看直播中，计划 " + Math.round(_0x1cbc94 / 1000) + " 秒");
    while (Date.now() < _0x447f0e && !_0x39f79a(_0x4e2e3b)) {
      const _0x23a7c4 = Math.ceil((_0x447f0e - Date.now()) / 1000);
      _0x4dd470("养号：观看直播中（剩余约 " + _0x23a7c4 + " 秒）");
      if (_0x23a7c4 !== _0x27f145 && (_0x23a7c4 <= 10 || _0x23a7c4 % 20 === 0)) {
        _0x5798ca("📺 养号：观看直播中，剩余约 " + _0x23a7c4 + " 秒");
        _0x27f145 = _0x23a7c4;
      }
      if (Math.random() < 0.25) {
        try {
          window.scrollBy({
            top: 40 + Math.floor(Math.random() * 100),
            behavior: "smooth"
          });
        } catch (_0x14295a) {}
      }
      await _0x553cac(2500 + Math.floor(Math.random() * 2500));
    }
    await _0x26bef4(_0x4e2e3b);
    await _0x877705(_0x4e2e3b);
  }
  async function _0x5870fd(_0x380ec4) {
    const _0x19ec58 = _0x53e4ac.currentTask;
    if (!_0x19ec58 || _0x19ec58.taskMode !== "nurture") {
      return;
    }
    const _0x869570 = _0x4d5649();
    let _0x47d3ef = {};
    try {
      _0x47d3ef = JSON.parse(_0x171207.getItem(_0x869570) || "{}");
    } catch (_0x20ec6e) {}
    const _0x38ab2e = _0x47d3ef.loopId === _0x380ec4 && _0x47d3ef.endTime > Date.now();
    if (_0x38ab2e) {
      if (!_0x47d3ef.interestKeywords?.length) {
        _0x47d3ef.interestKeywords = _0xb19ff9(_0x19ec58, _0x47d3ef);
      }
      if (!_0x47d3ef.nurtureStrategy) {
        _0x47d3ef.nurtureStrategy = _0x19ec58.nurtureStrategy || (_0x19ec58.nurturePersona ? "persona" : "keywords");
      }
      if (!_0x47d3ef.personaName && _0x19ec58.nurturePersonaName) {
        _0x47d3ef.personaName = _0x19ec58.nurturePersonaName;
      }
      if (!Number.isFinite(_0x47d3ef.nurtureLikePercent)) {
        _0x47d3ef.nurtureLikePercent = Number(_0x19ec58.nurtureLikePercent);
      }
      if (!Number.isFinite(_0x47d3ef.nurtureCollectPercent)) {
        _0x47d3ef.nurtureCollectPercent = Number(_0x19ec58.nurtureCollectPercent);
      }
      if (!Number.isFinite(_0x47d3ef.nurtureSharePercent)) {
        _0x47d3ef.nurtureSharePercent = Number(_0x19ec58.nurtureSharePercent);
      }
      delete _0x47d3ef.personaKeywords;
    }
    if (!_0x38ab2e) {
      const _0x256ccd = parseInt(_0x19ec58.nurtureDurationMin, 10) || 60;
      const _0x4c3726 = parseInt(_0x19ec58.nurtureDurationMax, 10) || 120;
      const _0x236051 = Math.floor(Math.random() * (_0x4c3726 - _0x256ccd + 1)) + _0x256ccd;
      const _0x58d250 = _0xb19ff9(_0x19ec58);
      const _0x1c89fc = _0x19ec58.nurtureStrategy || (_0x19ec58.nurturePersona ? "persona" : "keywords");
      _0x47d3ef = {
        loopId: _0x380ec4,
        endTime: Date.now() + _0x236051 * 60 * 1000,
        totalMinutes: _0x236051,
        videosWatched: 0,
        actionsDone: 0,
        interestKeywords: _0x58d250,
        nurtureStrategy: _0x1c89fc,
        personaName: _0x19ec58.nurturePersonaName || _0x19ec58.nurturePersona?.name || "",
        nurtureLikePercent: Number(_0x19ec58.nurtureLikePercent),
        nurtureCollectPercent: Number(_0x19ec58.nurtureCollectPercent),
        nurtureSharePercent: Number(_0x19ec58.nurtureSharePercent),
        searchKeywordIndex: 0,
        searchQueue: [],
        searchQueueIndex: 0,
        searchKeyword: ""
      };
      _0x171207.setItem(_0x869570, JSON.stringify(_0x47d3ef));
      const _0x4a420d = _0x58d250.length ? "，标签：" + _0x58d250.slice(0, 4).join("、") : "";
      const _0x336f8a = _0x1c89fc === "persona" && _0x47d3ef.personaName ? "，按人设「" + _0x47d3ef.personaName + "」校准" : "，按关键词搜索完播";
      _0x5798ca("🌱 养号开始：计划 " + _0x236051 + " 分钟" + _0x336f8a + _0x4a420d);
    }
    _0x47d3ef.currentTask = _0x19ec58;
    _0x36d420.send("automation-data", {
      type: "status",
      payload: {
        accountId: window._radar_account_id,
        status: "running"
      }
    });
    const _0x19143b = _0x47d3ef.nurtureStrategy === "persona";
    const _0x486df4 = _0x19143b && _0x47d3ef.personaName ? "人设·" + _0x47d3ef.personaName : (_0x47d3ef.interestKeywords || []).slice(0, 3).join("、") || "关键词搜索";
    _0x36d420.send("automation-data", {
      type: "keyword-changed",
      payload: {
        accountId: window._radar_account_id,
        keyword: "养号·" + _0x486df4,
        targetCount: _0x47d3ef.totalMinutes
      }
    });
    if (!_0x38ab2e && _0x19143b && !_0x161e34() && !_0x5df397()) {
      await _0x22eac7(_0x380ec4);
      await _0x307a16(3000, 5000, _0x380ec4, "加载推荐流");
    }
    const _0x1e8c8c = 0.08;
    const _0x669871 = 0.1;
    const _0x5220da = 0.06;
    const _0x2d0981 = () => {
      try {
        const {
          currentTask: _0x2788ee,
          ..._0x383367
        } = _0x47d3ef;
        _0x171207.setItem(_0x869570, JSON.stringify(_0x383367));
      } catch (_0x110b1c) {
        try {
          _0x171207.setItem(_0x869570, JSON.stringify(_0x47d3ef));
        } catch (_0x39afd8) {}
      }
    };
    while (Date.now() < _0x47d3ef.endTime && !_0x39f79a(_0x380ec4)) {
      await _0x4bbb12(_0x380ec4);
      _0x47d3ef.currentTask = _0x19ec58;
      _0x2d0981();
      if (!_0x19143b) {
        try {
          const _0x4dc4aa = await runNurtureKeywordSearchWatchRound(_0x380ec4, _0x47d3ef, {
            buildDouyinSearchResultCardMap: _0x219467,
            buildDouyinSearchUrl: _0x2ccca1,
            clearSearchPendingOpenUrl: _0x5d15ff,
            collectSearchVideoUrlsForCommentTask: _0x5281d2,
            closeAllModals: _0x289b91,
            extractSpecificVideoId: _0x395232,
            getDouyinSearchCardClickTarget: _0xa21a2e,
            isVisibleElement: _0x28b2eb,
            normalizeSearchQueueVideoUrl: _0x3ca7af,
            openSearchQueueVideoByUrl: _0x24d51f,
            resolveDouyinVideoDetailModal: _0x354d83,
            setSearchPendingOpenUrl: _0x249bfa,
            shouldAbort: _0x39f79a,
            simulateHumanClick: _0x157e66,
            suspendAutomationForNavigation: _0x4ec34a,
            waitForVideoDetailReadyAndPause: _0x1303db,
            randomDelay: _0x307a16,
            reportCurrentAction: _0x4dd470,
            reportTraceLog: _0x5798ca,
            clipTraceText: _0xdb64e6,
            sessionStorage: _0x171207,
            getNurtureStateKey: _0x4d5649,
            nurtureWatchCurrentVideo: _0x90570a,
            awaitSecurityChallengeIfPresent: _0x4bbb12,
            waitForDouyinSearchContentAfterZero: _0x30087b,
            prepareSearchPageReload: _0x2a8a63
          });
          if (_0x4dc4aa?.navigated) {
            _0x2d0981();
            return;
          }
          if (_0x4dc4aa?.didWork) {
            _0x47d3ef.actionsDone = (_0x47d3ef.actionsDone || 0) + 1;
            _0x1eb01e(_0x47d3ef, _0x380ec4);
            continue;
          }
        } catch (_0x47e36b) {
          if (_0x47e36b.message === "TASK_ABORTED") {
            break;
          }
          console.warn("[养号] 关键词搜索完播异常，短暂回退推荐流:", _0x47e36b.message);
          _0x5798ca("养号：搜索完播跳过（" + _0x47e36b.message + "）");
          await _0x307a16(1500, 2500, _0x380ec4, "养号搜索恢复");
        }
      }
      if (_0x52e10e() && !_0x27de0e()) {
        console.log("[Built-in-Debug] [养号] 检测到进入了独立直播间页面，返回推荐流");
        _0x5798ca("🔴 养号：检测到直播间页面，自动返回推荐流");
        _0x4dd470("养号：检测到直播间，返回推荐流...");
        await _0x877705(_0x380ec4);
        await _0x307a16(1500, 3000, _0x380ec4, "离开直播间");
        continue;
      }
      if (_0x4d2c83()) {
        const _0x3fee5d = _0x47b397() || _0x2e11b3() || _0x1ec086();
        if (_0x3fee5d && _0x3fee5d === _0x47d3ef.nurtureLastLiveKey) {
          _0x47d3ef.nurtureLiveSkipStreak = (_0x47d3ef.nurtureLiveSkipStreak || 0) + 1;
        } else {
          _0x47d3ef.nurtureLiveSkipStreak = 1;
          _0x47d3ef.nurtureLastLiveKey = _0x3fee5d;
        }
        console.log("[Built-in-Debug] [养号] 推荐流中检测到直播卡片，自动划走");
        _0x5798ca("🔴 养号：推荐流直播卡片，自动跳过");
        _0x4dd470("养号：检测到直播间，划走...");
        const _0xdda44b = _0x1ec086();
        _0x2f7ab0(_0x47d3ef, _0xdda44b);
        if (_0x1fc287(_0x47d3ef, _0xdda44b)) {
          await _0x17adee(_0x380ec4, _0x47d3ef, "直播跳过后检测到来回弹跳");
          continue;
        }
        const _0x16bd05 = (_0x47d3ef.nurtureLiveSkipStreak || 0) >= _0xd9dae3;
        await _0x13f3fc(_0x380ec4, {
          forceReload: _0x16bd05
        });
        if (_0x16bd05) {
          _0x47d3ef.nurtureLiveSkipStreak = 0;
          _0x47d3ef.nurtureLastLiveKey = "";
        }
        await _0x307a16(1000, 2000, _0x380ec4, "跳过直播");
        continue;
      } else {
        _0x47d3ef.nurtureLiveSkipStreak = 0;
        _0x47d3ef.nurtureLastLiveKey = "";
      }
      if (!_0x19143b) {
        await _0x307a16(1200, 2000, _0x380ec4, "关键词搜索空轮等待");
        continue;
      }
      const _0xf9298 = await _0x155dba(_0x380ec4, _0x47d3ef);
      if (_0xf9298?.pass === false) {
        console.log("[Built-in-Debug] [养号人设] 当前视频不匹配，快速切换下一条: " + (_0xf9298.reason || ""));
        await _0x307a16(500, 1200, _0x380ec4, "人设不匹配停留");
        await _0x45a320(_0x380ec4, _0x47d3ef, {
          reason: "人设不匹配切换",
          aggressive: true
        });
        await _0x307a16(900, 1800, _0x380ec4, "切换视频");
        _0x1eb01e(_0x47d3ef, _0x380ec4);
        continue;
      }
      _0x47d3ef.lastVideoKeywordHit = null;
      const _0x4ae67 = Math.random();
      try {
        if (_0x4ae67 < _0x1e8c8c) {
          await _0x547785(_0x380ec4, _0x47d3ef, {
            personaFocus: true,
            maxComments: _0x493f07
          });
        } else if (_0x4ae67 < _0x1e8c8c + _0x669871) {
          await _0x58b072(_0x380ec4, _0x47d3ef, "author");
        } else if (_0x4ae67 < _0x1e8c8c + _0x669871 + _0x5220da) {
          await _0x58b072(_0x380ec4, _0x47d3ef, "commenter");
        } else {
          const _0x296317 = await _0x90570a(_0x380ec4, _0x47d3ef);
          if (_0x296317?.skipped) {
            await _0x45a320(_0x380ec4, _0x47d3ef, {
              reason: "观看前人设不匹配",
              aggressive: true
            });
            await _0x307a16(1200, 2200, _0x380ec4, "切换视频");
          } else if (!_0x39f79a(_0x380ec4) && !_0x296317?.switchedDuringWatch) {
            await _0x45a320(_0x380ec4, _0x47d3ef, {
              reason: "完播切换",
              aggressive: false
            });
            await _0x307a16(1500, 3000, _0x380ec4, "切换视频");
          } else if (_0x296317?.switchedDuringWatch) {
            _0x5798ca("📺 养号：视频完播后页面已自动进入下一条，跳过额外滑动");
          }
        }
        _0x47d3ef.actionsDone = (_0x47d3ef.actionsDone || 0) + 1;
        _0x1eb01e(_0x47d3ef, _0x380ec4);
      } catch (_0x58855d) {
        if (_0x58855d.message === "TASK_ABORTED") {
          break;
        }
        console.warn("[养号] 动作异常，继续下一轮:", _0x58855d.message);
        _0x5798ca("养号：动作跳过（" + _0x58855d.message + "）");
        await _0x307a16(1500, 2500, _0x380ec4, "养号恢复");
      }
    }
    _0x171207.removeItem(_0x869570);
    _0x5798ca("🌱 养号完成：共浏览 " + (_0x47d3ef.videosWatched || 0) + " 个视频，执行 " + (_0x47d3ef.actionsDone || 0) + " 次动作");
    _0x36d420.send("automation-data", {
      type: "status",
      payload: {
        accountId: window._radar_account_id,
        status: "finished"
      }
    });
    _0x36d420.send("task-finished", _0x2508a5(_0x380ec4, _0x47d3ef));
  }
  return {
    isDouyinFeedInlineContext: _0x27de0e,
    isDouyinFeedLiveStream: _0x4d2c83,
    isDouyinFullLivePage: _0x52e10e,
    isDouyinLiveStreamTitle: _0x4b66df,
    skipDouyinFeedLiveStream: _0x13f3fc,
    startNurtureLoop: _0x5870fd
  };
}
module.exports = {
  createNurtureAutomationController: createNurtureAutomationController
};
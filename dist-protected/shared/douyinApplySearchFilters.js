'use strict';

async function applyOfficialSearchFilters(_0x8882ef, _0x4b8d49, _0x1cdbf1, _0x557f70) {
  const _0x1f61a1 = _0x8882ef.storage;
  const _0x4ba7f4 = _0x8882ef.isVisibleElement;
  const _0x3283f9 = _0x8882ef.simulateHumanClick;
  const _0x4326fb = _0x8882ef.randomDelay;
  const _0x4ab77b = _0x8882ef.sleep;
  const _0x68b735 = typeof _0x8882ef.reportCurrentAction === "function" ? _0x8882ef.reportCurrentAction : () => {};
  const _0x380a97 = typeof _0x8882ef.reportTraceLog === "function" ? _0x8882ef.reportTraceLog : () => {};
  const _0x3a5c4d = _0x8882ef.filterSessionMod || null;
  const _0x53b742 = String(_0x4b8d49?.sort ?? "0");
  const _0x5e9fb3 = String(_0x4b8d49?.time ?? "0");
  const _0x1cf843 = String(_0x4b8d49?.duration ?? "0");
  const _0x449ba4 = String(_0x4b8d49?.scope ?? "0");
  const _0x295ab6 = String(_0x4b8d49?.format ?? "0");
  if (_0x53b742 === "0" && _0x5e9fb3 === "0" && _0x1cf843 === "0" && _0x449ba4 === "0" && _0x295ab6 === "0") {
    return {
      skipped: true,
      reason: "all_default"
    };
  }
  const _0x105f1b = typeof _0x3a5c4d?.buildAppliedFiltersBaseKey === "function" ? _0x3a5c4d.buildAppliedFiltersBaseKey(_0x557f70, _0x1cdbf1) : "applied_filters_" + _0x557f70 + "_" + _0x1cdbf1;
  if (_0x1f61a1.getItem(_0x105f1b) === "true") {
    return {
      skipped: true,
      reason: "already_applied"
    };
  }
  const _0x545a81 = _0x105f1b + "_attempts";
  const _0x3e3ca9 = Number(_0x1f61a1.getItem(_0x545a81) || 0);
  const _0x301237 = typeof _0x3a5c4d?.shouldForceMarkFiltersApplied === "function" ? _0x3a5c4d.shouldForceMarkFiltersApplied({
    attempts: _0x3e3ca9,
    maxAttempts: 5
  }) : _0x3e3ca9 >= 5;
  if (_0x301237) {
    _0x1f61a1.setItem(_0x105f1b, "true");
    return {
      forced: true,
      attempts: _0x3e3ca9
    };
  }
  const _0x4b289a = _0x53b742 === "0" || _0x1f61a1.getItem(_0x105f1b + "_sort") === "true";
  const _0x296b0d = _0x5e9fb3 === "0" || _0x1f61a1.getItem(_0x105f1b + "_time") === "true";
  const _0x4c47ad = _0x1cf843 === "0" || _0x1f61a1.getItem(_0x105f1b + "_duration") === "true";
  const _0x95d7cd = _0x449ba4 === "0" || _0x1f61a1.getItem(_0x105f1b + "_scope") === "true";
  const _0x19e421 = _0x295ab6 === "0" || _0x1f61a1.getItem(_0x105f1b + "_format") === "true";
  if (_0x4b289a && _0x296b0d && _0x4c47ad && _0x95d7cd && _0x19e421) {
    _0x1f61a1.setItem(_0x105f1b, "true");
    return {
      done: true,
      reason: "locks_complete"
    };
  }
  _0x68b735("正在设置搜索过滤参数...");
  try {
    try {
      _0x8882ef.scrollToTop?.();
    } catch (_0x6b68a6) {}
    await _0x4ab77b(200);
    const _0x38ae8b = _0x413041 => {
      if (typeof _0x8882ef.findVisibleBySelector === "function") {
        return _0x8882ef.findVisibleBySelector(_0x413041);
      }
      try {
        return Array.from(document.querySelectorAll(_0x413041)).find(_0x4ba7f4) || null;
      } catch (_0x30b4af) {
        return null;
      }
    };
    const _0x27ab06 = (_0x2e2898, _0xca233e = false) => {
      if (typeof _0x8882ef.findByExactText === "function") {
        return _0x8882ef.findByExactText(_0x2e2898, _0xca233e);
      }
      const _0xadbe8c = Array.from(document.querySelectorAll("button, [role=\"button\"], span, div")).filter(_0x5b1b02 => (_0x5b1b02.innerText || "").trim() === _0x2e2898);
      const _0x3616a9 = _0xadbe8c.find(_0x39c20c => _0x4ba7f4(_0x39c20c) && _0x39c20c.getBoundingClientRect().height <= 80);
      if (_0x3616a9) {
        return _0x3616a9;
      }
      if (_0xca233e) {
        return null;
      } else {
        return _0xadbe8c[0] || null;
      }
    };
    const _0xe0573f = async (_0x5b2ad6, _0x1a75b5, _0x3fafeb, _0x4a5ebc) => {
      if (!_0x5b2ad6) {
        return false;
      }
      if (!_0x4ba7f4(_0x5b2ad6)) {
        return false;
      }
      await _0x3283f9(_0x5b2ad6, _0x557f70);
      await _0x4326fb(1500, 2500, _0x557f70, _0x4a5ebc);
      _0x1f61a1.setItem(_0x105f1b + "_" + _0x1a75b5, "true");
      return true;
    };
    const _0x395cfd = _0x496b4c => {
      const _0x3cd57c = _0x496b4c.innerText ? _0x496b4c.innerText.trim() : "";
      return _0x3cd57c === "筛选" || _0x3cd57c === "筛选关闭" || _0x3cd57c === "筛选开启" || /^筛选[·•.]?\d*$/.test(_0x3cd57c);
    };
    const _0x4084db = () => {
      if (typeof _0x8882ef.findFilterToggle === "function") {
        return _0x8882ef.findFilterToggle();
      }
      const _0x1054ca = Array.from(document.querySelectorAll("span")).filter(_0x395cfd);
      const _0x2d7dfe = _0x1054ca.find(_0x4ba7f4) || _0x1054ca[0];
      if (_0x2d7dfe) {
        return _0x2d7dfe;
      }
      const _0x44716d = Array.from(document.querySelectorAll("button, [role=\"button\"], div")).filter(_0x395cfd);
      return _0x44716d.find(_0x77f330 => _0x4ba7f4(_0x77f330) && _0x77f330.getBoundingClientRect().height <= 80) || _0x44716d[0] || null;
    };
    const _0x17b410 = () => {
      if (typeof _0x8882ef.isFilterPanelOpen === "function") {
        return !!_0x8882ef.isFilterPanelOpen();
      }
      return _0x4ba7f4(document.querySelector("[data-index1=\"0\"]")) || _0x4ba7f4(document.querySelector("[data-index1][data-index2]")) || !!_0x27ab06("一周内", true) || !!_0x27ab06("一天内", true) || !!_0x27ab06("最多点赞", true) || !!_0x27ab06("最新发布", true) || !!_0x27ab06("1-5分钟", true);
    };
    const _0x51b1ae = _0x17b410();
    const _0xb4e56b = _0x51b1ae ? null : _0x4084db();
    const _0x3ae9b8 = _0x51b1ae || !!_0xb4e56b;
    const _0x5b6f8f = typeof _0x3a5c4d?.shouldCountFilterAttempt === "function" ? _0x3a5c4d.shouldCountFilterAttempt({
      uiReady: _0x3ae9b8
    }) : _0x3ae9b8;
    if (!_0x3ae9b8) {
      return {
        pending: true,
        reason: "ui_not_ready"
      };
    }
    if (_0x5b6f8f) {
      _0x1f61a1.setItem(_0x545a81, String(_0x3e3ca9 + 1));
    }
    if (!_0x51b1ae && _0xb4e56b) {
      await _0x3283f9(_0xb4e56b, _0x557f70);
      await _0x4326fb(1500, 2200, _0x557f70, "等待筛选面板展示");
    }
    if (!_0x4b289a) {
      const _0x268e51 = parseInt(_0x53b742, 10);
      const _0x213e8d = _0x38ae8b("[data-index1=\"0\"][data-index2=\"" + _0x268e51 + "\"], [data-index*=\"0-" + _0x268e51 + "\"]");
      if (_0x213e8d) {
        await _0xe0573f(_0x213e8d, "sort", "设置搜索排序", "等待排序设定生效");
      } else {
        const _0x322f4a = ["综合排序", "最新发布", "最多点赞"];
        const _0x3dda70 = _0x27ab06(_0x322f4a[_0x268e51]);
        if (_0x3dda70) {
          await _0xe0573f(_0x3dda70, "sort", "设置搜索排序", "等待排序设定生效");
        }
      }
    }
    if (!_0x296b0d) {
      const _0x27a257 = parseInt(_0x5e9fb3, 10);
      const _0x2e8a91 = _0x38ae8b("[data-index1=\"1\"][data-index2=\"" + _0x27a257 + "\"], [data-index*=\"1-" + _0x27a257 + "\"]");
      if (_0x2e8a91) {
        await _0xe0573f(_0x2e8a91, "time", "设置发布时间", "等待时间设定生效");
      } else {
        const _0x1460d8 = ["不限", "一天内", "一周内", "半年内"];
        const _0x44ac7b = _0x27ab06(_0x1460d8[_0x27a257]);
        if (_0x44ac7b) {
          await _0xe0573f(_0x44ac7b, "time", "设置发布时间", "等待时间设定生效");
        }
      }
    }
    if (!_0x4c47ad) {
      const _0x57b17f = parseInt(_0x1cf843, 10);
      const _0x125a5d = _0x38ae8b("[data-index1=\"2\"][data-index2=\"" + _0x57b17f + "\"], [data-index*=\"2-" + _0x57b17f + "\"]");
      if (_0x125a5d) {
        await _0xe0573f(_0x125a5d, "duration", "设置视频时长", "等待视频时长生效");
      } else {
        const _0x4c8444 = ["不限", "1分钟以下", "1-5分钟", "5分钟以上"];
        const _0x3b30fe = _0x27ab06(_0x4c8444[_0x57b17f]);
        if (_0x3b30fe) {
          await _0xe0573f(_0x3b30fe, "duration", "设置视频时长", "等待视频时长生效");
        }
      }
    }
    if (!_0x95d7cd) {
      const _0x32e0d9 = parseInt(_0x449ba4, 10);
      const _0x5e226c = _0x38ae8b("[data-index1=\"3\"][data-index2=\"" + _0x32e0d9 + "\"], [data-index*=\"3-" + _0x32e0d9 + "\"]");
      if (_0x5e226c) {
        await _0xe0573f(_0x5e226c, "scope", "设置搜索范围", "等待搜索范围生效");
      } else {
        const _0x38426a = ["不限", "关注的人", "最近看过", "还未看过"];
        const _0x187897 = _0x27ab06(_0x38426a[_0x32e0d9]);
        if (_0x187897) {
          await _0xe0573f(_0x187897, "scope", "设置搜索范围", "等待搜索范围生效");
        }
      }
    }
    if (!_0x19e421) {
      const _0x15782a = !!_0x38ae8b("[data-index1=\"4\"]");
      if (_0x15782a) {
        const _0x12345a = parseInt(_0x295ab6, 10);
        const _0x111e69 = _0x38ae8b("[data-index1=\"4\"][data-index2=\"" + _0x12345a + "\"], [data-index*=\"4-" + _0x12345a + "\"]");
        if (_0x111e69) {
          await _0xe0573f(_0x111e69, "format", "设置内容形式", "等待内容形式生效");
        } else {
          const _0x1d699c = ["不限", "视频", "图文"];
          const _0x3235c9 = _0x27ab06(_0x1d699c[_0x12345a]);
          if (_0x3235c9) {
            await _0xe0573f(_0x3235c9, "format", "设置内容形式", "等待内容形式生效");
          }
        }
      } else {
        _0x1f61a1.setItem(_0x105f1b + "_format", "true");
      }
    }
    const _0x2283bf = _0x53b742 === "0" || _0x1f61a1.getItem(_0x105f1b + "_sort") === "true";
    const _0x1ae00b = _0x5e9fb3 === "0" || _0x1f61a1.getItem(_0x105f1b + "_time") === "true";
    const _0x33ba8d = _0x1cf843 === "0" || _0x1f61a1.getItem(_0x105f1b + "_duration") === "true";
    const _0x239fd8 = _0x449ba4 === "0" || _0x1f61a1.getItem(_0x105f1b + "_scope") === "true";
    const _0x984a38 = _0x295ab6 === "0" || _0x1f61a1.getItem(_0x105f1b + "_format") === "true";
    if (_0x2283bf && _0x1ae00b && _0x33ba8d && _0x239fd8 && _0x984a38) {
      _0x1f61a1.setItem(_0x105f1b, "true");
      try {
        _0x8882ef.bumpSearchApiGeneration?.();
      } catch (_0x3de661) {}
      return {
        success: true
      };
    }
    if (_0x1f61a1.getItem(_0x105f1b + "_warned") !== "true") {
      _0x1f61a1.setItem(_0x105f1b + "_warned", "true");
      const _0x17061e = [];
      if (!_0x2283bf) {
        _0x17061e.push("排序");
      }
      if (!_0x1ae00b) {
        _0x17061e.push("发布时间");
      }
      if (!_0x33ba8d) {
        _0x17061e.push("视频时长");
      }
      if (!_0x239fd8) {
        _0x17061e.push("搜索范围");
      }
      if (!_0x984a38) {
        _0x17061e.push("内容形式");
      }
      _0x380a97("⚠️ 官方筛选未点上：" + _0x17061e.join("、") + "，本轮按未筛选结果采集", null, "warning");
      return {
        partial: true,
        missing: _0x17061e
      };
    }
    return {
      partial: true
    };
  } catch (_0x4147fb) {
    return {
      error: true,
      message: String(_0x4147fb?.message || _0x4147fb)
    };
  }
}
function areOfficialSearchFilterItemLocksReady(_0xd7f766, _0x2ce640, _0x56ee28, _0xd6b43b, _0x3da6c4 = null) {
  const _0xf058f9 = String(_0x2ce640?.sort ?? "0");
  const _0x28d50d = String(_0x2ce640?.time ?? "0");
  const _0x387871 = String(_0x2ce640?.duration ?? "0");
  const _0x337448 = String(_0x2ce640?.scope ?? "0");
  const _0x5d1e54 = String(_0x2ce640?.format ?? "0");
  if (_0xf058f9 === "0" && _0x28d50d === "0" && _0x387871 === "0" && _0x337448 === "0" && _0x5d1e54 === "0") {
    return true;
  }
  const _0x56b0e4 = typeof _0x3da6c4?.buildAppliedFiltersBaseKey === "function" ? _0x3da6c4.buildAppliedFiltersBaseKey(_0xd6b43b, _0x56ee28) : "applied_filters_" + _0xd6b43b + "_" + _0x56ee28;
  const _0x3c4367 = (_0x230520, _0x4822fe) => _0x230520 === "0" || _0xd7f766.getItem(_0x56b0e4 + "_" + _0x4822fe) === "true";
  return _0x3c4367(_0xf058f9, "sort") && _0x3c4367(_0x28d50d, "time") && _0x3c4367(_0x387871, "duration") && _0x3c4367(_0x337448, "scope") && _0x3c4367(_0x5d1e54, "format");
}
module.exports = {
  applyOfficialSearchFilters: applyOfficialSearchFilters,
  areOfficialSearchFilterItemLocksReady: areOfficialSearchFilterItemLocksReady
};
const axios = require("axios");
class ReportQueue {
  constructor(_0x4e7d7b, _0x434fa9, _0x34f295 = {}) {
    this.store = _0x4e7d7b;
    this.apiBase = _0x434fa9;
    this.getApiBase = typeof _0x34f295.getApiBase === "function" ? _0x34f295.getApiBase : null;
    this.getDeviceId = typeof _0x34f295.getDeviceId === "function" ? _0x34f295.getDeviceId : null;
    this.productSlug = _0x34f295.productSlug || "";
    this.batchGroups = new Map();
    this.pendingReportBatches = [];
    this.isReporting = false;
    this.reportTimer = null;
    this.BATCH_SIZE = 15;
    this.BATCH_INTERVAL = 35000;
    this.MIN_REPORT_INTERVAL = 22000;
  }
  add(_0x2c2de0, _0x553b00 = null) {
    if (!_0x2c2de0 || _0x2c2de0.length === 0) {
      return;
    }
    const _0x39605d = _0x2c2de0[0]?.accountName || _0x553b00?.nickname || _0x553b00?.name || _0x553b00?.accountName || "默认账号";
    const _0xcfca7c = _0x2c2de0.map(_0x25ee6b => ({
      videoAuthor: _0x25ee6b.author || _0x25ee6b.videoAuthor || "",
      nickname: _0x25ee6b.user || _0x25ee6b.nickname || "",
      ipLocation: _0x25ee6b.ipLocation || _0x25ee6b.location || "",
      videoUrl: _0x25ee6b.videoUrl || _0x25ee6b.url || "",
      videoTitle: _0x25ee6b.videoTitle || _0x25ee6b.title || "",
      content: _0x25ee6b.content || "",
      actionType: _0x25ee6b.actionType || (_0x25ee6b.actions?.replied ? "reply" : _0x25ee6b.actions?.liked ? "like" : ""),
      actionContent: _0x25ee6b.actionContent || _0x25ee6b.actions?.replyContent || "",
      commentTime: _0x25ee6b.timeText || _0x25ee6b.time || "",
      userUrl: _0x25ee6b.userUrl || _0x25ee6b.homepage || "",
      accountId: _0x25ee6b.accountId || _0x553b00?.accountId || "default",
      accountName: _0x25ee6b.accountName || _0x39605d
    }));
    const _0x4c207c = _0x553b00?.keywords || _0x553b00?.keyword || "未知关键字";
    const _0x420159 = _0x39605d + "::" + _0x4c207c;
    if (!this.batchGroups.has(_0x420159)) {
      this.batchGroups.set(_0x420159, {
        settings: {
          ...(_0x553b00 || {}),
          keywords: _0x4c207c,
          accountName: _0x39605d
        },
        items: []
      });
    }
    const _0x489dac = this.batchGroups.get(_0x420159);
    _0x489dac.items.push(..._0xcfca7c);
    if (_0x489dac.items.length >= this.BATCH_SIZE) {
      this.prepareBatch(_0x420159);
    } else if (!this.reportTimer) {
      this.reportTimer = setTimeout(() => this.prepareAllBatches(), this.BATCH_INTERVAL);
    }
  }
  prepareAllBatches() {
    for (const _0x518a04 of this.batchGroups.keys()) {
      this.prepareBatch(_0x518a04);
    }
    this.reportTimer = null;
  }
  prepareBatch(_0x2c7d08) {
    const _0x5235b3 = this.batchGroups.get(_0x2c7d08);
    if (!_0x5235b3 || _0x5235b3.items.length === 0) {
      return;
    }
    const _0x3aad20 = {
      keywords: _0x5235b3.settings?.keywords || "未知关键字",
      accountName: _0x5235b3.settings?.accountName || _0x5235b3.settings?.nickname || _0x5235b3.settings?.name || _0x5235b3.items[0]?.accountName || "默认账号",
      items: [..._0x5235b3.items]
    };
    _0x5235b3.items = [];
    this.pendingReportBatches.push(_0x3aad20);
    this.process();
  }
  async process() {
    if (this.isReporting || this.pendingReportBatches.length === 0) {
      return;
    }
    this.isReporting = true;
    const _0x4411ac = this.pendingReportBatches[0];
    const _0x634467 = this.store.get("auth_token");
    if (!_0x634467) {
      console.warn("[Report] 无 Token，跳过本次上报");
      this.pendingReportBatches = [];
      this.isReporting = false;
      return;
    }
    try {
      const _0x5a1a82 = {
        Authorization: "Bearer " + _0x634467
      };
      const _0x53dadd = typeof this.getDeviceId === "function" ? this.getDeviceId() : "";
      if (_0x53dadd) {
        _0x5a1a82["X-Device-ID"] = _0x53dadd;
      }
      if (this.productSlug) {
        _0x5a1a82["X-Product-Slug"] = this.productSlug;
      }
      const _0x40a18b = typeof this.getApiBase === "function" && this.getApiBase() || this.apiBase || "";
      const _0x22d7a6 = await axios.post(String(_0x40a18b).replace(/\/+$/, "") + "/radar/report-data", _0x4411ac, {
        headers: _0x5a1a82,
        timeout: 15000
      });
      if (_0x22d7a6.data.code === 200) {
        this.pendingReportBatches.shift();
      } else {
        console.error("[Report] 上报失败 (后端拒绝):", _0x22d7a6.data.msg);
        this.pendingReportBatches.shift();
      }
    } catch (_0x3ed5d1) {
      if (_0x3ed5d1.response?.status === 429) {
        console.warn("[Report] 触发频率限制 (429)，保留批次并将于下个周期重试...");
      } else {
        console.error("[Report] 上报网络异常: " + _0x3ed5d1.message);
        if (_0x3ed5d1.response?.status && _0x3ed5d1.response.status >= 400 && _0x3ed5d1.response.status < 500) {
          this.pendingReportBatches.shift();
        }
      }
    } finally {
      setTimeout(() => {
        this.isReporting = false;
        this.process();
      }, this.MIN_REPORT_INTERVAL);
    }
  }
}
module.exports = ReportQueue;
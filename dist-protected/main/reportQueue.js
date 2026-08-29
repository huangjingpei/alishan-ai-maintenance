const axios = require("axios");
class ReportQueue {
  constructor(arg1, arg2, options = {}) {
    this.store = arg1;
    this.apiBase = arg2;
    this.getApiBase = typeof options.getApiBase === "function" ? options.getApiBase : null;
    this.getDeviceId = typeof options.getDeviceId === "function" ? options.getDeviceId : null;
    this.productSlug = options.productSlug || "";
    this.batchGroups = new Map();
    this.pendingReportBatches = [];
    this.isReporting = false;
    this.reportTimer = null;
    this.BATCH_SIZE = 15;
    this.BATCH_INTERVAL = 35000;
    this.MIN_REPORT_INTERVAL = 22000;
  }
  add(arg1, arg2 = null) {
    if (!arg1 || arg1.length === 0) {
      return;
    }
    const local = arg1[0]?.accountName || arg2?.nickname || arg2?.name || arg2?.accountName || "默认账号";
    const result = arg1.map(arg1 => ({
      videoAuthor: arg1.author || arg1.videoAuthor || "",
      nickname: arg1.user || arg1.nickname || "",
      ipLocation: arg1.ipLocation || arg1.location || "",
      videoUrl: arg1.videoUrl || arg1.url || "",
      videoTitle: arg1.videoTitle || arg1.title || "",
      content: arg1.content || "",
      actionType: arg1.actionType || (arg1.actions?.replied ? "reply" : arg1.actions?.liked ? "like" : ""),
      actionContent: arg1.actionContent || arg1.actions?.replyContent || "",
      commentTime: arg1.timeText || arg1.time || "",
      userUrl: arg1.userUrl || arg1.homepage || "",
      accountId: arg1.accountId || arg2?.accountId || "default",
      accountName: arg1.accountName || local
    }));
    const local2 = arg2?.keywords || arg2?.keyword || "未知关键字";
    const value = local + "::" + local2;
    if (!this.batchGroups.has(value)) {
      this.batchGroups.set(value, {
        settings: {
          ...(arg2 || {}),
          keywords: local2,
          accountName: local
        },
        items: []
      });
    }
    const result2 = this.batchGroups.get(value);
    result2.items.push(...result);
    if (result2.items.length >= this.BATCH_SIZE) {
      this.prepareBatch(value);
    } else if (!this.reportTimer) {
      this.reportTimer = setTimeout(() => this.prepareAllBatches(), this.BATCH_INTERVAL);
    }
  }
  prepareAllBatches() {
    for (const item of this.batchGroups.keys()) {
      this.prepareBatch(item);
    }
    this.reportTimer = null;
  }
  prepareBatch(arg1) {
    const result = this.batchGroups.get(arg1);
    if (!result || result.items.length === 0) {
      return;
    }
    const obj = {
      keywords: result.settings?.keywords || "未知关键字",
      accountName: result.settings?.accountName || result.settings?.nickname || result.settings?.name || result.items[0]?.accountName || "默认账号",
      items: [...result.items]
    };
    result.items = [];
    this.pendingReportBatches.push(obj);
    this.process();
  }
  async process() {
    if (this.isReporting || this.pendingReportBatches.length === 0) {
      return;
    }
    this.isReporting = true;
    const value = this.pendingReportBatches[0];
    const result = this.store.get("auth_token");
    if (!result) {
      console.warn("[Report] 无 Token，跳过本次上报");
      this.pendingReportBatches = [];
      this.isReporting = false;
      return;
    }
    try {
      const obj = {
        Authorization: "Bearer " + result
      };
      const value2 = typeof this.getDeviceId === "function" ? this.getDeviceId() : "";
      if (value2) {
        obj["X-Device-ID"] = value2;
      }
      if (this.productSlug) {
        obj["X-Product-Slug"] = this.productSlug;
      }
      const local = typeof this.getApiBase === "function" && this.getApiBase() || this.apiBase || "";
      const result2 = await axios.post(String(local).replace(/\/+$/, "") + "/radar/report-data", value, {
        headers: obj,
        timeout: 15000
      });
      if (result2.data.code === 200) {
        this.pendingReportBatches.shift();
      } else {
        console.error("[Report] 上报失败 (后端拒绝):", result2.data.msg);
        this.pendingReportBatches.shift();
      }
    } catch (error) {
      if (error.response?.status === 429) {
        console.warn("[Report] 触发频率限制 (429)，保留批次并将于下个周期重试...");
      } else {
        console.error("[Report] 上报网络异常: " + error.message);
        if (error.response?.status && error.response.status >= 400 && error.response.status < 500) {
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
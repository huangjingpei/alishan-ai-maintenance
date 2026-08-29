function formatCommentAgeFromTs(arg1) {
  const result = Number(arg1);
  if (!Number.isFinite(result) || result <= 0) {
    return "";
  }
  const value = result > 1000000000000 ? result : result * 1000;
  const value2 = Date.now() - value;
  if (!Number.isFinite(value2) || value2 < 0) {
    return "";
  }
  const result2 = Math.floor(value2 / 60000);
  if (result2 < 1) {
    return "刚刚";
  }
  if (result2 < 60) {
    return result2 + "分钟前";
  }
  const result3 = Math.floor(result2 / 60);
  if (result3 < 24) {
    return result3 + "小时前";
  }
  const result4 = Math.floor(result3 / 24);
  if (result4 < 30) {
    return result4 + "天前";
  }
  const date = new Date(value);
  const result5 = date.getFullYear();
  const value3 = date.getMonth() + 1;
  const result6 = date.getDate();
  if (result5 === new Date().getFullYear()) {
    return value3 + "-" + result6;
  }
  return result5 + "-" + value3 + "-" + result6;
}
function readCommentMetaFromApiObject(arg1) {
  if (!arg1 || typeof arg1 !== "object") {
    return {
      timeText: "",
      ipLocation: ""
    };
  }
  const result = formatCommentAgeFromTs(arg1.create_time ?? arg1.createTime ?? arg1.comment_time ?? arg1.commentTime ?? arg1.publish_time ?? arg1.publishTime ?? arg1.common?.create_time ?? arg1.common?.createTime);
  let result2 = String(arg1.ip_label || arg1.ipLabel || arg1.ip_label_text || arg1.ipLabelText || arg1.ip_label_v2 || arg1.ipLabelV2 || arg1.position || "").trim();
  if (!result2 && Array.isArray(arg1.label_list)) {
    const result = arg1.label_list.find(arg1 => {
      const result = String(arg1?.text || arg1?.label || arg1?.content || "").trim();
      return result && !/赞|热评|作者|置顶/.test(result) && /^[\u4e00-\u9fffA-Za-z]{2,12}$/.test(result);
    });
    result2 = String(result?.text || result?.label || result?.content || "").trim();
  }
  if (!result2 && Array.isArray(arg1.comment_labels)) {
    const result = arg1.comment_labels.find(arg1 => {
      const result = String(arg1?.text || arg1?.label || "").trim();
      return /属地|IP/i.test(String(arg1?.type || arg1?.label_type || "")) || /^[\u4e00-\u9fff]{2,10}$/.test(result) && !/赞|热评|作者/.test(result);
    });
    result2 = String(result?.text || result?.label || "").replace(/^IP属地[:：\s]*/i, "").trim();
  }
  return {
    timeText: result,
    ipLocation: result2
  };
}
function preferCommentField(arg1, arg2) {
  const result = String(arg1 || "").trim();
  const result2 = String(arg2 || "").trim();
  if (result && result !== "视频评论区潜客" && result !== "实体获客" && result !== "线索采集") {
    return result;
  }
  return result2 || result;
}
function mergeCommentUserFields(options = {}, options2 = {}) {
  return {
    ...options,
    ...options2,
    content: preferCommentField(options.content, options2.content),
    time: preferCommentField(options.time, options2.time),
    timeText: preferCommentField(options.timeText, options2.timeText),
    ipLocation: preferCommentField(options.ipLocation, options2.ipLocation) || preferCommentField(options.location, options2.location),
    location: preferCommentField(options.location, options2.location) || preferCommentField(options.ipLocation, options2.ipLocation)
  };
}
module.exports = {
  formatCommentAgeFromTs: formatCommentAgeFromTs,
  readCommentMetaFromApiObject: readCommentMetaFromApiObject,
  preferCommentField: preferCommentField,
  mergeCommentUserFields: mergeCommentUserFields
};
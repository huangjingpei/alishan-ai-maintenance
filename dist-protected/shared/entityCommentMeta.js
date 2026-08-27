function formatCommentAgeFromTs(_0x5d1a0c) {
  const _0x40bf5d = Number(_0x5d1a0c);
  if (!Number.isFinite(_0x40bf5d) || _0x40bf5d <= 0) {
    return "";
  }
  const _0x16e3dc = _0x40bf5d > 1000000000000 ? _0x40bf5d : _0x40bf5d * 1000;
  const _0xd74bf5 = Date.now() - _0x16e3dc;
  if (!Number.isFinite(_0xd74bf5) || _0xd74bf5 < 0) {
    return "";
  }
  const _0x4cb02c = Math.floor(_0xd74bf5 / 60000);
  if (_0x4cb02c < 1) {
    return "刚刚";
  }
  if (_0x4cb02c < 60) {
    return _0x4cb02c + "分钟前";
  }
  const _0x13cf17 = Math.floor(_0x4cb02c / 60);
  if (_0x13cf17 < 24) {
    return _0x13cf17 + "小时前";
  }
  const _0x103450 = Math.floor(_0x13cf17 / 24);
  if (_0x103450 < 30) {
    return _0x103450 + "天前";
  }
  const _0x2400a5 = new Date(_0x16e3dc);
  const _0x30cf05 = _0x2400a5.getFullYear();
  const _0x5bd520 = _0x2400a5.getMonth() + 1;
  const _0x386886 = _0x2400a5.getDate();
  if (_0x30cf05 === new Date().getFullYear()) {
    return _0x5bd520 + "-" + _0x386886;
  }
  return _0x30cf05 + "-" + _0x5bd520 + "-" + _0x386886;
}
function readCommentMetaFromApiObject(_0x2f36f0) {
  if (!_0x2f36f0 || typeof _0x2f36f0 !== "object") {
    return {
      timeText: "",
      ipLocation: ""
    };
  }
  const _0x511cff = formatCommentAgeFromTs(_0x2f36f0.create_time ?? _0x2f36f0.createTime ?? _0x2f36f0.comment_time ?? _0x2f36f0.commentTime ?? _0x2f36f0.publish_time ?? _0x2f36f0.publishTime ?? _0x2f36f0.common?.create_time ?? _0x2f36f0.common?.createTime);
  let _0x361228 = String(_0x2f36f0.ip_label || _0x2f36f0.ipLabel || _0x2f36f0.ip_label_text || _0x2f36f0.ipLabelText || _0x2f36f0.ip_label_v2 || _0x2f36f0.ipLabelV2 || _0x2f36f0.position || "").trim();
  if (!_0x361228 && Array.isArray(_0x2f36f0.label_list)) {
    const _0x1d86de = _0x2f36f0.label_list.find(_0x258d9f => {
      const _0x3ed886 = String(_0x258d9f?.text || _0x258d9f?.label || _0x258d9f?.content || "").trim();
      return _0x3ed886 && !/赞|热评|作者|置顶/.test(_0x3ed886) && /^[\u4e00-\u9fffA-Za-z]{2,12}$/.test(_0x3ed886);
    });
    _0x361228 = String(_0x1d86de?.text || _0x1d86de?.label || _0x1d86de?.content || "").trim();
  }
  if (!_0x361228 && Array.isArray(_0x2f36f0.comment_labels)) {
    const _0x1557bc = _0x2f36f0.comment_labels.find(_0x50bdfc => {
      const _0x364073 = String(_0x50bdfc?.text || _0x50bdfc?.label || "").trim();
      return /属地|IP/i.test(String(_0x50bdfc?.type || _0x50bdfc?.label_type || "")) || /^[\u4e00-\u9fff]{2,10}$/.test(_0x364073) && !/赞|热评|作者/.test(_0x364073);
    });
    _0x361228 = String(_0x1557bc?.text || _0x1557bc?.label || "").replace(/^IP属地[:：\s]*/i, "").trim();
  }
  return {
    timeText: _0x511cff,
    ipLocation: _0x361228
  };
}
function preferCommentField(_0x212aeb, _0x436e9f) {
  const _0x57abbc = String(_0x212aeb || "").trim();
  const _0x46f340 = String(_0x436e9f || "").trim();
  if (_0x57abbc && _0x57abbc !== "视频评论区潜客" && _0x57abbc !== "实体获客" && _0x57abbc !== "线索采集") {
    return _0x57abbc;
  }
  return _0x46f340 || _0x57abbc;
}
function mergeCommentUserFields(_0x5a92f2 = {}, _0x598912 = {}) {
  return {
    ..._0x5a92f2,
    ..._0x598912,
    content: preferCommentField(_0x5a92f2.content, _0x598912.content),
    time: preferCommentField(_0x5a92f2.time, _0x598912.time),
    timeText: preferCommentField(_0x5a92f2.timeText, _0x598912.timeText),
    ipLocation: preferCommentField(_0x5a92f2.ipLocation, _0x598912.ipLocation) || preferCommentField(_0x5a92f2.location, _0x598912.location),
    location: preferCommentField(_0x5a92f2.location, _0x598912.location) || preferCommentField(_0x5a92f2.ipLocation, _0x598912.ipLocation)
  };
}
module.exports = {
  formatCommentAgeFromTs: formatCommentAgeFromTs,
  readCommentMetaFromApiObject: readCommentMetaFromApiObject,
  preferCommentField: preferCommentField,
  mergeCommentUserFields: mergeCommentUserFields
};
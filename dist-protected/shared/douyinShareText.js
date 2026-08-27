function extractDouyinUrlsFromText(_0x326bb6) {
  const _0x57655e = String(_0x326bb6 || "");
  if (!_0x57655e.trim()) {
    return [];
  }
  const _0xd4a024 = [];
  const _0x308a36 = _0x467143 => {
    let _0x27e1b1 = String(_0x467143 || "").trim();
    if (!_0x27e1b1) {
      return;
    }
    _0x27e1b1 = _0x27e1b1.replace(/[),.;:，。！？、》」』】]+$/g, "");
    if (!/^https?:\/\//i.test(_0x27e1b1) && /^(?:v\.)?douyin\.com\//i.test(_0x27e1b1)) {
      _0x27e1b1 = "https://" + _0x27e1b1;
    }
    if (!/douyin\.com|iesdouyin\.com/i.test(_0x27e1b1)) {
      return;
    }
    if (!_0xd4a024.includes(_0x27e1b1)) {
      _0xd4a024.push(_0x27e1b1);
    }
  };
  const _0x5a3ddb = _0x57655e.match(/https?:\/\/[^\s<>"']+/gi) || [];
  _0x5a3ddb.forEach(_0x308a36);
  const _0x5d766d = _0x57655e.match(/(?:^|[\s])((?:v\.)?douyin\.com\/[A-Za-z0-9_./?=&#%-]+)/gi) || [];
  _0x5d766d.forEach(_0x2dd830 => _0x308a36(_0x2dd830.trim()));
  return _0xd4a024;
}
function pickDouyinUrlFromText(_0x5afd41) {
  const _0x74300 = String(_0x5afd41 || "").trim();
  if (!_0x74300) {
    return "";
  }
  if (/^https?:\/\//i.test(_0x74300) && !/\s/.test(_0x74300)) {
    return _0x74300;
  }
  const _0x1a6e49 = extractDouyinUrlsFromText(_0x74300);
  return _0x1a6e49[0] || _0x74300;
}
module.exports = {
  extractDouyinUrlsFromText: extractDouyinUrlsFromText,
  pickDouyinUrlFromText: pickDouyinUrlFromText
};
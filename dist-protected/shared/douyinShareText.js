function extractDouyinUrlsFromText(arg1) {
  const result = String(arg1 || "");
  if (!result.trim()) {
    return [];
  }
  const list = [];
  const local = arg1 => {
    let result = String(arg1 || "").trim();
    if (!result) {
      return;
    }
    result = result.replace(/[),.;:，。！？、》」』】]+$/g, "");
    if (!/^https?:\/\//i.test(result) && /^(?:v\.)?douyin\.com\//i.test(result)) {
      result = "https://" + result;
    }
    if (!/douyin\.com|iesdouyin\.com/i.test(result)) {
      return;
    }
    if (!list.includes(result)) {
      list.push(result);
    }
  };
  const local2 = result.match(/https?:\/\/[^\s<>"']+/gi) || [];
  local2.forEach(local);
  const local3 = result.match(/(?:^|[\s])((?:v\.)?douyin\.com\/[A-Za-z0-9_./?=&#%-]+)/gi) || [];
  local3.forEach(arg1 => local(arg1.trim()));
  return list;
}
function pickDouyinUrlFromText(arg1) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return "";
  }
  if (/^https?:\/\//i.test(result) && !/\s/.test(result)) {
    return result;
  }
  const result2 = extractDouyinUrlsFromText(result);
  return result2[0] || result;
}
module.exports = {
  extractDouyinUrlsFromText: extractDouyinUrlsFromText,
  pickDouyinUrlFromText: pickDouyinUrlFromText
};
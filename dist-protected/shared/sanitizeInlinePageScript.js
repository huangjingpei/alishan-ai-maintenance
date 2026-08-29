'use strict';

function sanitizeInlinePageScript(arg1) {
  return String(arg1 || "").replace(/<\/script/gi, "<\\/script");
}
module.exports = {
  sanitizeInlinePageScript: sanitizeInlinePageScript
};
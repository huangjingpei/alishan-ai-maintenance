'use strict';

function sanitizeInlinePageScript(_0x218ba5) {
  return String(_0x218ba5 || "").replace(/<\/script/gi, "<\\/script");
}
module.exports = {
  sanitizeInlinePageScript: sanitizeInlinePageScript
};
export const COMMENT_REQUIRED_STRING_KEYS = [
  "commentInput", "openCommentBtns", "commentPanel", "emojiPanel", "emojiTrigger",
  "emojiStickerItems", "emojiItemCandidates", "emojiStickerClickableRoot",
  "emojiStickerInteractiveRoot", "emojiStickerSourcePattern", "emojiTextSourcePattern",
  "emojiTextTokenPattern", "emojiComposerPayload", "emojiTabContainerCandidates",
  "emojiTabTextCandidates", "emojiTabDebugCandidates", "emojiTabPositivePattern",
  "emojiTabRejectPattern", "emojiPanelRejectSelector", "commentFloatingChrome",
  "commentComposerChrome", "commentStickerImageSelector", "commentStickerAltPattern",
  "commentAvatarImagePattern"
];

export const DM_REQUIRED_STRING_KEYS = [
  "profileFollowBtn", "profileMessageBtn", "profileName", "dmInput", "dmSendBtn",
  "dmSendPrimary", "dmExplicitSendSvg", "dmDialog", "dmInputHint", "dmSendSvgCandidates",
  "dmSendClickableRoot", "dmSendTextCandidates", "conversationItem", "conversationTitle",
  "conversationPreview", "conversationUnread", "conversationAvatar", "conversationAvatarRoot",
  "dmBlockActiveRoots", "dmBlockNodeCandidates", "dmBlockGlobalHints", "dmMessageItems",
  "dmHistoryMessageItems", "dmMessageContainer", "dmFailureCandidates", "dmFailureIconInner",
  "groupRowHints", "groupAvatarImages", "conversationHeader"
];

export const GATED_REQUIRED_STRING_KEYS = [
  "profileReadyPattern", "actionButtonCandidates", "actionClickableRoot",
  "profilePositiveContextPattern", "profileRejectContextPattern",
  "profileRejectOverlaySelector", "profileRejectNoticeSelector"
];

const COMMENT_REQUIRED_NUMBER_KEYS = [
  "emojiStickerMinImageSide", "emojiStickerMinFillRatio", "emojiTabProbeTimeoutMs"
];
const DM_REQUIRED_LIST_KEYS = ["strangerFolderTexts", "sendExactTexts", "sendSvgHints"];
const GATED_REQUIRED_PACK_KEYS = ["profileFollow", "profileMessage", "dmSend"];
const REGEX_PATHS = [
  ["commentV2", "emojiStickerSourcePattern"],
  ["commentV2", "emojiTextSourcePattern"],
  ["commentV2", "emojiTextTokenPattern"],
  ["commentV2", "emojiTabPositivePattern"],
  ["commentV2", "emojiTabRejectPattern"],
  ["commentV2", "commentStickerAltPattern"],
  ["commentV2", "commentAvatarImagePattern"],
  ["gated", "profileReadyPattern"],
  ["gated", "profilePositiveContextPattern"],
  ["gated", "profileRejectContextPattern"]
];
const PLACEHOLDER_PATTERN = /#__fake__|__fake__|^\s*(?:todo|placeholder|尚未配置|待填写)\s*$/i;

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function requireStrings(errors, groupName, group, keys) {
  for (const key of keys) {
    const value = group?.[key];
    if (!isNonEmptyString(value)) {
      errors.push(`${groupName}.${key} 不能为空`);
    } else if (PLACEHOLDER_PATTERN.test(value)) {
      errors.push(`${groupName}.${key} 仍是占位值`);
    }
  }
}

export function validateRuntimeConfig(config) {
  const errors = [];
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    return { valid: false, errors: ["config 必须是对象"] };
  }
  if (!isNonEmptyString(config.version)) {
    errors.push("version 不能为空");
  }

  requireStrings(errors, "commentV2", config.commentV2, COMMENT_REQUIRED_STRING_KEYS);
  requireStrings(errors, "dmV2", config.dmV2, DM_REQUIRED_STRING_KEYS);
  requireStrings(errors, "gated", config.gated, GATED_REQUIRED_STRING_KEYS);

  for (const key of COMMENT_REQUIRED_NUMBER_KEYS) {
    if (!Number.isFinite(Number(config.commentV2?.[key])) || Number(config.commentV2[key]) <= 0) {
      errors.push(`commentV2.${key} 必须是正数`);
    }
  }
  for (const key of DM_REQUIRED_LIST_KEYS) {
    if (!Array.isArray(config.dmV2?.[key]) || !config.dmV2[key].some(isNonEmptyString)) {
      errors.push(`dmV2.${key} 至少需要一个非空字符串`);
    }
  }
  for (const key of GATED_REQUIRED_PACK_KEYS) {
    if (!Array.isArray(config.gated?.[key]?.exactTexts) || !config.gated[key].exactTexts.some(isNonEmptyString)) {
      errors.push(`gated.${key}.exactTexts 至少需要一个非空字符串`);
    }
  }

  for (const [groupName, key] of REGEX_PATHS) {
    const value = config[groupName]?.[key];
    if (!isNonEmptyString(value)) {
      continue;
    }
    try {
      new RegExp(value, "i");
    } catch (error) {
      errors.push(`${groupName}.${key} 不是有效正则表达式：${error.message}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("评论输入框选择器与多形态探测解析验证", async () => {
  const configPath = path.join(repoRoot, "local-services", "runtime-config.dev.json");
  const raw = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  assert.equal(raw.configured, true);

  const commentV2 = raw.config.commentV2;
  assert.ok(commentV2.commentInput, "commentInput 必须配置");
  assert.ok(commentV2.commentInputMain, "commentInputMain 必须配置");
  assert.ok(commentV2.draftEditor, "draftEditor 必须配置");
  assert.ok(commentV2.commentInputShell, "commentInputShell 必须配置");

  // 验证选择器覆盖度
  assert.ok(commentV2.commentInput.includes("public-DraftEditor-content"), "commentInput 应覆盖 DraftEditor");
  assert.ok(commentV2.commentInput.includes("[contenteditable]"), "commentInput 应覆盖无值或非 true 的 contenteditable");
  assert.ok(commentV2.commentInput.includes("plaintext-only"), "commentInput 应覆盖 plaintext-only");
  assert.ok(commentV2.commentInputShell.includes("comment-input"), "commentInputShell 应覆盖 comment-input 类");
  assert.ok(commentV2.commentInputShell.includes("comment-compose"), "commentInputShell 应覆盖 comment-compose 类");

  // 提取 isEditableElement 逻辑并验证测试用例
  function isEditableElement(el) {
    if (!el || el.nodeType !== 1) return false;
    const tag = String(el.tagName || "").toUpperCase();
    if (tag === "TEXTAREA") return !el.disabled && !el.readOnly;
    if (tag === "INPUT") {
      const type = String(el.getAttribute("type") || "text").toLowerCase();
      return !el.disabled && !el.readOnly && !["button", "submit", "checkbox", "radio", "hidden", "file"].includes(type);
    }
    const rawCe = el.getAttribute("contenteditable");
    if (rawCe !== null) {
      const ce = String(rawCe).toLowerCase();
      if (ce === "true" || ce === "plaintext-only" || ce === "") return true;
    }
    if (el.isContentEditable) return true;
    if (el.classList?.contains("public-DraftEditor-content")) return true;
    if ((el.getAttribute("role") || "").toLowerCase() === "textbox" && (rawCe !== null || el.isContentEditable || el.classList?.contains("public-DraftEditor-content"))) return true;
    return false;
  }

  function resolveMainCommentWritableElement(el) {
    if (!el) return null;
    if (isEditableElement(el)) return el;
    try {
      return el.children?.find?.(isEditableElement) || null;
    } catch {
      return null;
    }
  }

  // 1. 模拟 DraftEditor 真实 DOM
  const draftEditorNode = {
    nodeType: 1,
    tagName: "DIV",
    className: "public-DraftEditor-content",
    classList: { contains: (cls) => cls === "public-DraftEditor-content" },
    getAttribute: (attr) => (attr === "role" ? "textbox" : attr === "contenteditable" ? "true" : null),
    isContentEditable: true
  };
  assert.equal(isEditableElement(draftEditorNode), true, "DraftEditor content 节点应被识别为 editable");
  assert.equal(resolveMainCommentWritableElement(draftEditorNode), draftEditorNode);

  // 2. 模拟 contenteditable=plaintext-only (Chrome/Douyin 常见模式)
  const plaintextNode = {
    nodeType: 1,
    tagName: "DIV",
    className: "editor-plaintext",
    classList: { contains: () => false },
    getAttribute: (attr) => (attr === "contenteditable" ? "plaintext-only" : attr === "role" ? "textbox" : null),
    isContentEditable: true
  };
  assert.equal(isEditableElement(plaintextNode), true, "plaintext-only 节点应被识别为 editable");

  // 3. 模拟容器点击后内部挂载输入框
  const shellContainer = {
    nodeType: 1,
    tagName: "DIV",
    className: "comment-input-inner",
    classList: { contains: () => false },
    getAttribute: (attr) => null,
    isContentEditable: false,
    children: [draftEditorNode]
  };
  assert.equal(isEditableElement(shellContainer), false, "外层 Shell 容器本身不是最终 editable");
  assert.equal(resolveMainCommentWritableElement(shellContainer), draftEditorNode, "Shell 容器能解析出内部的 DraftEditor");

  // 4. 模拟纯文本占位 DIV (未激活状态)
  const placeholderNode = {
    nodeType: 1,
    tagName: "DIV",
    className: "placeholder-text",
    classList: { contains: () => false },
    getAttribute: () => null,
    isContentEditable: false,
    children: []
  };
  assert.equal(isEditableElement(placeholderNode), false);
  assert.equal(resolveMainCommentWritableElement(placeholderNode), null);
});

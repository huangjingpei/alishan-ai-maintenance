import assert from "node:assert/strict";
import test from "node:test";

test("子视图续跑：独立视频页任务持久化结构与 URL 匹配验证", async () => {
  function fn17(task) {
    const local = task?.__profileFirstResume;
    if (!local || local.phase !== "video_detail") {
      return null;
    }
    if (local.interactionId && task?.interactionId && String(local.interactionId) !== String(task.interactionId)) {
      return null;
    }
    const createdAt = Number(local.createdAt || 0);
    if (!createdAt || Date.now() - createdAt > 420000) {
      return null;
    }
    return local;
  }

  function getVideoIdFromPageUrl(urlStr) {
    try {
      const url = new URL(urlStr);
      return url.searchParams.get("modal_id") || url.pathname.match(/\/(?:video|note)\/(\d{15,})/i)?.[1] || "";
    } catch {
      return "";
    }
  }

  function fn32(task, currentHref) {
    if (currentHref === "about:blank") {
      return false;
    }
    const resume = fn17(task);
    if (resume?.videoId) {
      const routeVideoId = getVideoIdFromPageUrl(currentHref);
      if (routeVideoId && String(routeVideoId) === String(resume.videoId)) {
        return true;
      }
    }
    if (!currentHref.includes("/user/")) {
      return false;
    }
    return true;
  }

  const rawTaskWithoutResume = {
    interactionId: "douyin_1788054220624",
    lead: {
      nickname: "测试用户",
      userUrl: "https://www.douyin.com/user/MS4wLjABAAAAxxx"
    },
    canCommentFirstWork: true
  };

  const directVideoUrl = "https://www.douyin.com/video/7593333593397663974";

  // 1. 验证没有 __profileFirstResume 时，直接访问 /video/ 页面被直接判定为不匹配 (复现原 bug)
  assert.equal(
    fn32(rawTaskWithoutResume, directVideoUrl),
    false,
    "缺少 __profileFirstResume 时，直接访问 /video/ 页面应不匹配"
  );

  // 2. 验证保存了 __profileFirstResume 且 videoId 匹配时，成功放行续跑
  const taskWithResume = {
    ...rawTaskWithoutResume,
    __profileFirstResume: {
      phase: "video_detail",
      interactionId: rawTaskWithoutResume.interactionId,
      videoId: "7593333593397663974",
      worksCount: 1,
      batchCommentOpts: {
        prefetchedCommentText: "太棒了！",
        prefetchedCommentResolved: true
      },
      openMode: "direct",
      navigationAttempt: 2,
      createdAt: Date.now()
    }
  };

  assert.equal(
    fn32(taskWithResume, directVideoUrl),
    true,
    "包含匹配的 videoId 且 phase=video_detail 时，应成功放行续跑"
  );

  // 3. 验证 videoId 不匹配时应被拦截
  assert.equal(
    fn32(taskWithResume, "https://www.douyin.com/video/9999999999999999999"),
    false,
    "videoId 与当前 URL 不匹配时不应放行"
  );

  // 4. 验证防死循环逻辑
  const isAlreadyDirect = directVideoUrl.includes("/video/") || directVideoUrl.includes("/note/");
  assert.equal(isAlreadyDirect, true, "当已在 /video/ 页面时，isAlreadyDirect 应为 true，阻止再次循环重定向");
});

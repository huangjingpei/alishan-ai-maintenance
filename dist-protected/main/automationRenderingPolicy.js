'use strict';

function restoreOccludedPageRendering(arg1) {
  if (!arg1 || arg1.isDestroyed?.()) {
    return;
  }
  arg1.executeJavaScript("\n        (() => {\n            // 清理旧版后台优化残留（热更新/开发模式下无需重启也能恢复页面）。\n            document.getElementById('radar-background-low-power-style')?.remove();\n            document.getElementById('radar-occluded-low-power-style')?.remove();\n            let resumeCandidate = null;\n            let resumeCandidateArea = 0;\n            document.querySelectorAll('video[data-radar-original-preload]').forEach((video) => {\n                const original = video.getAttribute('data-radar-original-preload') || '';\n                if (original) video.setAttribute('preload', original);\n                else video.removeAttribute('preload');\n                video.removeAttribute('data-radar-original-preload');\n                // 旧版后台策略执行过 video.pause()，但没有记录和恢复播放状态。\n                // 只选择当前可见区域内最大的一个视频续播，避免页面中的预加载视频\n                // 同时播放；失败时交给站点自身的自动播放逻辑继续处理。\n                try {\n                    const rect = video.getBoundingClientRect();\n                    const style = getComputedStyle(video);\n                    const visible = rect.width > 1 && rect.height > 1\n                        && rect.bottom > 0 && rect.right > 0\n                        && rect.top < innerHeight && rect.left < innerWidth\n                        && style.display !== 'none' && style.visibility !== 'hidden';\n                    const area = visible ? rect.width * rect.height : 0;\n                    if (video.paused && !video.ended && area > resumeCandidateArea) {\n                        resumeCandidate = video;\n                        resumeCandidateArea = area;\n                    }\n                } catch (_) {}\n            });\n            document.querySelectorAll('video[data-radar-occluded-was-playing]').forEach((video) => {\n                const wasPlaying = video.getAttribute('data-radar-occluded-was-playing') === '1';\n                video.removeAttribute('data-radar-occluded-was-playing');\n                if (!wasPlaying || video.ended) return;\n                try {\n                    const rect = video.getBoundingClientRect();\n                    const style = getComputedStyle(video);\n                    const visible = rect.width > 1 && rect.height > 1\n                        && rect.bottom > 0 && rect.right > 0\n                        && rect.top < innerHeight && rect.left < innerWidth\n                        && style.display !== 'none' && style.visibility !== 'hidden';\n                    const area = visible ? rect.width * rect.height : 0;\n                    if (area > resumeCandidateArea) {\n                        resumeCandidate = video;\n                        resumeCandidateArea = area;\n                    }\n                } catch (_) {}\n            });\n            if (resumeCandidate) {\n                try { resumeCandidate.play()?.catch?.(() => {}); } catch (_) {}\n            }\n            return true;\n        })()\n    ", true).catch(() => {});
}
function suspendOccludedAutomationRendering(arg1) {
  if (!arg1 || arg1.isDestroyed?.()) {
    return;
  }
  try {
    arg1.setAudioMuted(true);
  } catch (error) {}
  try {
    arg1.setBackgroundThrottling(true);
  } catch (error) {}
  try {
    arg1.setImageAnimationPolicy("noAnimation");
  } catch (error) {}
  arg1.executeJavaScript("\n        (() => {\n            if (!document.getElementById('radar-occluded-low-power-style')) {\n                const style = document.createElement('style');\n                style.id = 'radar-occluded-low-power-style';\n                style.textContent = '*,*::before,*::after{animation-play-state:paused!important;}';\n                (document.head || document.documentElement).appendChild(style);\n            }\n            document.querySelectorAll('video').forEach((video) => {\n                if (video.hasAttribute('data-radar-occluded-was-playing')) return;\n                const wasPlaying = !video.paused && !video.ended;\n                video.setAttribute('data-radar-occluded-was-playing', wasPlaying ? '1' : '0');\n                if (wasPlaying) {\n                    try { video.pause(); } catch (_) {}\n                }\n            });\n            return true;\n        })()\n    ", true).catch(() => {});
}
module.exports = {
  restoreOccludedPageRendering: restoreOccludedPageRendering,
  suspendOccludedAutomationRendering: suspendOccludedAutomationRendering
};
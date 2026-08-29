const fs = require("fs");
const path = require("path");
const TASKS_FILE = arg1 => path.join(arg1, "work_publish_tasks.json");
function createEmptyWorkPublishStats() {
  return {
    total: 0,
    pending: 0,
    ready: 0,
    publishing: 0,
    published: 0,
    failed: 0
  };
}
function normalizeMediaItem(options = {}) {
  return {
    id: String(options.id || "media_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8)),
    type: options.type === "image" ? "image" : "video",
    filePath: String(options.filePath || ""),
    fileName: String(options.fileName || ""),
    coverPath: String(options.coverPath || "")
  };
}
function normalizePublishItem(options = {}) {
  return {
    id: String(options.id || "item_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8)),
    accountId: String(options.accountId || ""),
    accountName: String(options.accountName || ""),
    media: normalizeMediaItem(options.media || {}),
    title: String(options.title || ""),
    description: String(options.description || ""),
    status: String(options.status || "draft"),
    error: String(options.error || ""),
    publishedAt: options.publishedAt != null ? Number(options.publishedAt) : null
  };
}
function normalizeWorkPublishTask(options = {}) {
  const value = Array.isArray(options.items) ? options.items.map(normalizePublishItem) : [];
  return {
    id: String(options.id || "wp_" + Date.now()),
    name: String(options.name || "作品发布"),
    seedTitle: String(options.seedTitle || ""),
    seedDesc: String(options.seedDesc || ""),
    similarity: Math.min(100, Math.max(0, Number(options.similarity) || 30)),
    selectedAccounts: Array.isArray(options.selectedAccounts) ? options.selectedAccounts.map(String).filter(Boolean) : [],
    mediaList: Array.isArray(options.mediaList) ? options.mediaList.map(normalizeMediaItem) : [],
    items: value,
    publishMode: options.publishMode === "parallel" ? "parallel" : "interval",
    staggerMinSec: Math.max(0, Number(options.staggerMinSec) || 60),
    staggerMaxSec: Math.max(0, Number(options.staggerMaxSec) || 180),
    status: String(options.status || "draft"),
    createdAt: Number(options.createdAt || Date.now()),
    updatedAt: Number(options.updatedAt || Date.now()),
    startedAt: options.startedAt != null ? Number(options.startedAt) : null,
    endedAt: options.endedAt != null ? Number(options.endedAt) : null,
    endReason: String(options.endReason || "")
  };
}
function computeTaskStats(arg1) {
  const result = createEmptyWorkPublishStats();
  const value = Array.isArray(arg1?.items) ? arg1.items : [];
  result.total = value.length;
  for (const item of value) {
    if (item.status === "published") {
      result.published += 1;
    } else if (item.status === "failed") {
      result.failed += 1;
    } else if (item.status === "publishing" || item.status === "queued") {
      result.publishing += 1;
    } else if (item.status === "ready") {
      result.ready += 1;
    } else {
      result.pending += 1;
    }
  }
  return result;
}
function pairAccountsWithMedia(list = [], list2 = [], list3 = []) {
  const result = Math.min(list.length, list2.length);
  const list4 = [];
  for (let num = 0; num < result; num += 1) {
    const local = list[num] || {};
    const local2 = list2[num] || {};
    const local3 = list3[num] || {};
    list4.push(normalizePublishItem({
      accountId: local.id || local.accountId || "",
      accountName: local.nickname || local.name || local.id || "",
      media: local2,
      title: local3.title || "",
      description: local3.description || "",
      status: local3.title || local3.description ? "ready" : "draft"
    }));
  }
  return list4;
}
function createWorkPublishTasksApi({
  userDataPath: userDataPath
}) {
  const result = TASKS_FILE(userDataPath);
  function fn() {
    try {
      if (!fs.existsSync(result)) {
        return [];
      }
      const result2 = JSON.parse(fs.readFileSync(result, "utf8"));
      if (Array.isArray(result2)) {
        return result2.map(normalizeWorkPublishTask);
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }
  function fn2(arg1) {
    fs.mkdirSync(path.dirname(result), {
      recursive: true
    });
    fs.writeFileSync(result, JSON.stringify(arg1, null, 2), "utf8");
  }
  function listTasks() {
    return fn().map(arg1 => ({
      ...arg1,
      stats: computeTaskStats(arg1)
    }));
  }
  function getTask(arg1) {
    const result = fn().find(arg12 => arg12.id === String(arg1));
    if (!result) {
      return null;
    }
    return {
      ...result,
      stats: computeTaskStats(result)
    };
  }
  function saveTask(arg1) {
    const result = normalizeWorkPublishTask({
      ...arg1,
      updatedAt: Date.now(),
      createdAt: arg1.createdAt || Date.now()
    });
    const result2 = fn();
    const result3 = result2.findIndex(arg1 => arg1.id === result.id);
    if (result3 >= 0) {
      result2[result3] = {
        ...result2[result3],
        ...result,
        id: result.id
      };
    } else {
      result2.unshift(result);
    }
    fn2(result2);
    return {
      ...result,
      stats: computeTaskStats(result)
    };
  }
  function deleteTask(arg1) {
    const result = fn().filter(arg12 => arg12.id !== String(arg1));
    fn2(result);
    return true;
  }
  function deleteTasks(arg1) {
    const set = new Set((Array.isArray(arg1) ? arg1 : [arg1]).map(String).filter(Boolean));
    if (!set.size) {
      return false;
    }
    const result = fn().filter(arg1 => !set.has(String(arg1.id)));
    fn2(result);
    return true;
  }
  function patchTask(arg1, options = {}) {
    const result = fn();
    const result2 = result.findIndex(arg12 => arg12.id === String(arg1));
    if (result2 < 0) {
      return null;
    }
    const result3 = normalizeWorkPublishTask({
      ...result[result2],
      ...options,
      id: result[result2].id,
      createdAt: result[result2].createdAt,
      updatedAt: Date.now()
    });
    result[result2] = result3;
    fn2(result);
    return {
      ...result3,
      stats: computeTaskStats(result3)
    };
  }
  function updateItem(arg1, arg2, options = {}) {
    const result = fn();
    const result2 = result.findIndex(arg12 => arg12.id === String(arg1));
    if (result2 < 0) {
      return null;
    }
    const local = result[result2].items || [];
    const result3 = local.findIndex(arg1 => arg1.id === String(arg2));
    if (result3 < 0) {
      return null;
    }
    local[result3] = normalizePublishItem({
      ...local[result3],
      ...options,
      id: local[result3].id
    });
    result[result2].items = local;
    result[result2].updatedAt = Date.now();
    fn2(result);
    return {
      ...result[result2],
      stats: computeTaskStats(result[result2])
    };
  }
  return {
    listTasks: listTasks,
    getTask: getTask,
    saveTask: saveTask,
    deleteTask: deleteTask,
    deleteTasks: deleteTasks,
    patchTask: patchTask,
    updateItem: updateItem,
    pairAccountsWithMedia: pairAccountsWithMedia,
    computeTaskStats: computeTaskStats
  };
}
module.exports = {
  createWorkPublishTasksApi: createWorkPublishTasksApi,
  pairAccountsWithMedia: pairAccountsWithMedia,
  normalizeWorkPublishTask: normalizeWorkPublishTask,
  computeTaskStats: computeTaskStats
};
'use strict';

const VIDEO_LEAD_SQL = "(\n  IFNULL(json_extract(raw_data, '$.leadKind'), '') = 'video_card'\n  OR IFNULL(json_extract(raw_data, '$.sourceType'), '') = 'video'\n  OR IFNULL(json_extract(raw_data, '$.identityType'), '') = 'video'\n  OR IFNULL(json_extract(raw_data, '$.leadId'), '') LIKE 'video:%'\n  OR IFNULL(json_extract(raw_data, '$.userKey'), '') LIKE 'video:%'\n  OR IFNULL(json_extract(raw_data, '$.leadId'), '') LIKE 'author:%'\n  OR id LIKE 'video:%'\n  OR id LIKE 'author:%'\n)";
const COMMENT_LEAD_SQL = "(\n  NOT " + VIDEO_LEAD_SQL + "\n  AND (\n    IFNULL(json_extract(raw_data, '$.sourceType'), '') = 'comment'\n    OR IFNULL(json_extract(raw_data, '$.entrySource'), '') = 'entity_comment'\n    OR IFNULL(json_extract(raw_data, '$.collectedFields'), '') LIKE '%comment%'\n  )\n)";
const AUTHOR_LEAD_SQL = "(\n  " + VIDEO_LEAD_SQL + "\n  AND IFNULL(json_extract(raw_data, '$.collectedFields'), '') LIKE '%author%'\n  AND (\n    IFNULL(json_extract(raw_data, '$.authorProfileUrl'), '') != ''\n    OR IFNULL(json_extract(raw_data, '$.userUrl'), '') != ''\n  )\n)";
const VIDEO_LINK_LEAD_SQL = "(\n  " + VIDEO_LEAD_SQL + "\n  AND (\n    IFNULL(json_extract(raw_data, '$.collectedFields'), '') LIKE '%video%'\n    OR IFNULL(json_extract(raw_data, '$.collectedFields'), '') = ''\n    OR json_extract(raw_data, '$.collectedFields') IS NULL\n  )\n)";
function escapeLike(_0x48a9f0) {
  return String(_0x48a9f0 || "").replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}
function tabPredicate(_0x30c6f9) {
  const _0x320c22 = String(_0x30c6f9 || "").trim();
  if (_0x320c22 === "comments") {
    return COMMENT_LEAD_SQL;
  }
  if (_0x320c22 === "author") {
    return AUTHOR_LEAD_SQL;
  }
  if (_0x320c22 === "video") {
    return VIDEO_LINK_LEAD_SQL;
  }
  return "";
}
function buildWhere(_0x3518f5, {
  tab = "",
  keyword = ""
} = {}) {
  const _0x36716a = ["task_id = ?"];
  const _0xe56f56 = [String(_0x3518f5)];
  const _0x36f787 = tabPredicate(tab);
  if (_0x36f787) {
    _0x36716a.push(_0x36f787);
  }
  const _0x380463 = String(keyword || "").trim();
  if (_0x380463) {
    _0x36716a.push("(\n      nickname LIKE ? ESCAPE '\\'\n      OR IFNULL(account_id, '') LIKE ? ESCAPE '\\'\n      OR IFNULL(source_type, '') LIKE ? ESCAPE '\\'\n      OR raw_data LIKE ? ESCAPE '\\'\n    )");
    const _0x3376d7 = "%" + escapeLike(_0x380463) + "%";
    _0xe56f56.push(_0x3376d7, _0x3376d7, _0x3376d7, _0x3376d7);
  }
  return {
    sql: _0x36716a.join(" AND "),
    params: _0xe56f56
  };
}
function parseLeadRow(_0x1b619d) {
  if (!_0x1b619d) {
    return null;
  }
  try {
    const _0x524bb2 = JSON.parse(_0x1b619d.raw_data || "{}");
    if (!_0x524bb2 || typeof _0x524bb2 !== "object") {
      return null;
    }
    if (!_0x524bb2.id && _0x1b619d.id) {
      _0x524bb2.id = _0x1b619d.id;
    }
    if (!_0x524bb2.ts && _0x1b619d.ts) {
      _0x524bb2.ts = _0x1b619d.ts;
    }
    if (!_0x524bb2.taskId && _0x1b619d.task_id) {
      _0x524bb2.taskId = _0x1b619d.task_id;
    }
    return _0x524bb2;
  } catch (_0x34406a) {
    return null;
  }
}
function isVideoStyleLead(_0x4cb3c1 = {}) {
  const _0x3d05ce = String(_0x4cb3c1.leadKind || "");
  const _0xde35b9 = String(_0x4cb3c1.sourceType || "");
  const _0x222ca2 = String(_0x4cb3c1.identityType || "");
  const _0x39fe4b = String(_0x4cb3c1.leadId || "");
  const _0x217772 = String(_0x4cb3c1.userKey || "");
  const _0x94328c = String(_0x4cb3c1.id || "");
  return _0x3d05ce === "video_card" || _0xde35b9 === "video" || _0x222ca2 === "video" || _0x39fe4b.startsWith("video:") || _0x217772.startsWith("video:") || _0x39fe4b.startsWith("author:") || _0x94328c.startsWith("video:") || _0x94328c.startsWith("author:");
}
function collectedFieldsText(_0x3850f2 = {}) {
  const _0x136c87 = Array.isArray(_0x3850f2.collectedFields) ? _0x3850f2.collectedFields : [];
  return _0x136c87.map(String).join(",");
}
function matchesTab(_0x3a8f49, _0x40732f) {
  const _0xc952d9 = String(_0x40732f || "").trim();
  if (!_0xc952d9) {
    return true;
  }
  const _0x36b607 = isVideoStyleLead(_0x3a8f49);
  if (_0xc952d9 === "comments") {
    if (_0x36b607) {
      return false;
    }
    const _0x2bd354 = String(_0x3a8f49.sourceType || "");
    const _0x355582 = String(_0x3a8f49.entrySource || "");
    const _0x5034b0 = collectedFieldsText(_0x3a8f49);
    return _0x2bd354 === "comment" || _0x355582 === "entity_comment" || _0x5034b0.includes("comment");
  }
  if (_0xc952d9 === "author") {
    if (!_0x36b607) {
      return false;
    }
    const _0x3eebe3 = collectedFieldsText(_0x3a8f49);
    if (!_0x3eebe3.includes("author")) {
      return false;
    }
    return !!String(_0x3a8f49.authorProfileUrl || "").trim() || !!String(_0x3a8f49.userUrl || "").trim();
  }
  if (_0xc952d9 === "video") {
    if (!_0x36b607) {
      return false;
    }
    const _0x4c6205 = collectedFieldsText(_0x3a8f49);
    return !_0x4c6205 || _0x4c6205.includes("video");
  }
  return true;
}
function matchesKeyword(_0x12ce3c, _0x4ad956) {
  const _0x491f6e = String(_0x4ad956 || "").trim().toLowerCase();
  if (!_0x491f6e) {
    return true;
  }
  const _0x3fb85c = [_0x12ce3c.nickname, _0x12ce3c.title, _0x12ce3c.uid, _0x12ce3c.accountId, _0x12ce3c.secUid, _0x12ce3c.userUrl, _0x12ce3c.authorProfileUrl, _0x12ce3c.videoUrl, _0x12ce3c.url, _0x12ce3c.content, _0x12ce3c.sourceType, _0x12ce3c.sourceVideoTitle, _0x12ce3c.searchKeyword].filter(Boolean).join(" ").toLowerCase();
  return _0x3fb85c.includes(_0x491f6e);
}
function paginateLeadsArray(_0x21b3da = [], _0x2ff73c = {}) {
  const _0x4d569f = Array.isArray(_0x21b3da) ? _0x21b3da : [];
  const _0x5e4410 = Math.max(1, Math.min(100, Number(_0x2ff73c.limit) || 20));
  const _0x22c469 = Math.max(0, Number(_0x2ff73c.offset) || 0);
  const _0x2bd1a4 = _0x2ff73c.tab;
  const _0x257837 = _0x2ff73c.keyword;
  const _0x4c2fb6 = _0x4d569f.filter(_0x4877d7 => matchesTab(_0x4877d7, _0x2bd1a4) && matchesKeyword(_0x4877d7, _0x257837));
  _0x4c2fb6.sort((_0x1bf7de, _0x42e2e9) => Number(_0x42e2e9.ts || 0) - Number(_0x1bf7de.ts || 0));
  const _0x474ab3 = {
    all: _0x4d569f.length,
    comments: _0x4d569f.filter(_0x11e5c1 => matchesTab(_0x11e5c1, "comments")).length,
    video: _0x4d569f.filter(_0x5d508b => matchesTab(_0x5d508b, "video")).length,
    author: _0x4d569f.filter(_0x4f9bf9 => matchesTab(_0x4f9bf9, "author")).length
  };
  return {
    items: _0x4c2fb6.slice(_0x22c469, _0x22c469 + _0x5e4410),
    total: _0x4c2fb6.length,
    counts: _0x474ab3
  };
}
function listEntityLeadgenLeadsPage(_0x191a8d, _0x2a6604, _0x750f43 = {}) {
  if (!_0x191a8d || !_0x2a6604) {
    return {
      items: [],
      total: 0,
      counts: {
        all: 0,
        comments: 0,
        video: 0,
        author: 0
      }
    };
  }
  const _0x18f6c1 = Math.max(1, Math.min(100, Number(_0x750f43.limit) || 20));
  const _0x90c679 = Math.max(0, Number(_0x750f43.offset) || 0);
  const {
    sql: _0x22f2b6,
    params: _0x394c1a
  } = buildWhere(_0x2a6604, _0x750f43);
  const _0x3cfb1b = Number(_0x191a8d.prepare("SELECT COUNT(*) AS c FROM entity_leadgen_leads WHERE " + _0x22f2b6).get(..._0x394c1a)?.c) || 0;
  const _0x2e7869 = _0x191a8d.prepare("\n    SELECT id, task_id, ts, raw_data\n    FROM entity_leadgen_leads\n    WHERE " + _0x22f2b6 + "\n    ORDER BY ts DESC\n    LIMIT ? OFFSET ?\n  ").all(..._0x394c1a, _0x18f6c1, _0x90c679);
  const _0x4cce68 = _0x2e7869.map(parseLeadRow).filter(Boolean);
  const _0x158b2e = String(_0x2a6604);
  const _0x5c8c59 = {
    all: Number(_0x191a8d.prepare("SELECT COUNT(*) AS c FROM entity_leadgen_leads WHERE task_id = ?").get(_0x158b2e)?.c) || 0,
    comments: Number(_0x191a8d.prepare("SELECT COUNT(*) AS c FROM entity_leadgen_leads WHERE task_id = ? AND " + COMMENT_LEAD_SQL).get(_0x158b2e)?.c) || 0,
    video: Number(_0x191a8d.prepare("SELECT COUNT(*) AS c FROM entity_leadgen_leads WHERE task_id = ? AND " + VIDEO_LINK_LEAD_SQL).get(_0x158b2e)?.c) || 0,
    author: Number(_0x191a8d.prepare("SELECT COUNT(*) AS c FROM entity_leadgen_leads WHERE task_id = ? AND " + AUTHOR_LEAD_SQL).get(_0x158b2e)?.c) || 0
  };
  return {
    items: _0x4cce68,
    total: _0x3cfb1b,
    counts: _0x5c8c59
  };
}
module.exports = {
  VIDEO_LEAD_SQL: VIDEO_LEAD_SQL,
  COMMENT_LEAD_SQL: COMMENT_LEAD_SQL,
  AUTHOR_LEAD_SQL: AUTHOR_LEAD_SQL,
  VIDEO_LINK_LEAD_SQL: VIDEO_LINK_LEAD_SQL,
  escapeLike: escapeLike,
  paginateLeadsArray: paginateLeadsArray,
  listEntityLeadgenLeadsPage: listEntityLeadgenLeadsPage
};
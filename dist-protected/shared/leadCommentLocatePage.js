'use strict';

/**
 * 线索库「定位评论」页内脚本。禁止混淆、禁止 toString 拼装。
 * 打开作品后先暂停防切条，再持续滚动评论区，命中后悬停并点击「回复」。
 */
function getLeadCommentPausePageSource() {
  return `(() => {
    const pauseVideos = () => {
      const list = Array.from(document.querySelectorAll('video, audio'));
      for (let i = 0; i < list.length; i++) {
        const el = list[i];
        try {
          el.muted = true;
          el.autoplay = false;
          el.loop = false;
          const duration = Number(el.duration);
          if (Number.isFinite(duration) && duration > 0.15 && duration <= 15) {
            if (el.currentTime >= Math.max(0.02, duration - 0.45) || (duration <= 3 && el.currentTime > 0.15)) {
              el.currentTime = Math.min(0.05, Math.max(0, duration * 0.05));
            }
          }
          if (typeof el.pause === 'function') el.pause();
        } catch (_) {}
      }
      const players = Array.from(document.querySelectorAll(
        '.xgplayer, [class*="xgplayer"], [data-e2e="video-player"], [data-e2e="video-player-container"]'
      ));
      for (let i = 0; i < players.length; i++) {
        const el = players[i];
        try {
          const player = el.__player || el.player || el.xgPlayer || el._player;
          if (player && typeof player.pause === 'function') player.pause();
        } catch (_) {}
      }
    };
    pauseVideos();
    if (!window.__radarLeadCommentPauseGuard) {
      window.__radarLeadCommentPauseGuard = setInterval(pauseVideos, 400);
    }
    return true;
  })()`;
}
function getLeadCommentLocatePageSource(target = {}) {
  const cid = JSON.stringify(String(target.cid || target.commentId || "").trim());
  const nickname = JSON.stringify(String(target.nickname || "").trim());
  const content = JSON.stringify(String(target.content || target.comment || target.commentText || "").trim().slice(0, 80));
  const clickReply = target.clickReply === false ? "false" : "true";
  const timeoutMs = Math.max(8000, Number(target.timeoutMs) || 40000);
  return `(async () => {
    const targetCid = ${cid};
    const targetNick = ${nickname};
    const targetContent = ${content};
    const wantReply = ${clickReply};
    const deadline = Date.now() + ${timeoutMs};
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const pauseVideos = () => {
      const list = Array.from(document.querySelectorAll('video, audio'));
      for (let i = 0; i < list.length; i++) {
        const el = list[i];
        try {
          el.muted = true;
          el.autoplay = false;
          el.loop = false;
          const duration = Number(el.duration);
          if (Number.isFinite(duration) && duration > 0.15 && duration <= 15) {
            if (el.currentTime >= Math.max(0.02, duration - 0.45) || (duration <= 3 && el.currentTime > 0.15)) {
              el.currentTime = Math.min(0.05, Math.max(0, duration * 0.05));
            }
          }
          if (typeof el.pause === 'function') el.pause();
        } catch (_) {}
      }
      const players = Array.from(document.querySelectorAll(
        '.xgplayer, [class*="xgplayer"], [data-e2e="video-player"], [data-e2e="video-player-container"]'
      ));
      for (let i = 0; i < players.length; i++) {
        try {
          const player = players[i].__player || players[i].player || players[i].xgPlayer || players[i]._player;
          if (player && typeof player.pause === 'function') player.pause();
        } catch (_) {}
      }
    };
    pauseVideos();
    if (!window.__radarLeadCommentPauseGuard) {
      window.__radarLeadCommentPauseGuard = setInterval(pauseVideos, 400);
    }
    const visible = (el) => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden';
    };
    const compact = (value) => String(value || '').replace(/\\s+/g, ' ').trim();
    const queryItems = () => Array.from(document.querySelectorAll(
      '[data-e2e="comment-item"], [data-e2e="comment-reply-item"], div[class*="CommentItem"], div[class*="comment-item"], li[class*="Comment"]'
    )).filter(visible);
    const findScroller = () => {
      const panel = document.querySelector(
        '[data-e2e="comment-list"], [data-e2e="comment-panel"], .comment-mainContent, [class*="comment-mainContent"], [class*="CommentList"]'
      );
      let node = panel;
      while (node && node !== document.body) {
        const st = getComputedStyle(node);
        if (/(auto|scroll)/.test(st.overflowY) && node.scrollHeight > node.clientHeight + 24) return node;
        node = node.parentElement;
      }
      return panel;
    };
    const openComments = async () => {
      if (queryItems().length) return;
      const candidates = Array.from(document.querySelectorAll(
        '[data-e2e="feed-comment-icon"], [data-e2e="comment-icon"], [data-e2e="video-player-comment"], [aria-label*="评论"], [class*="comment-icon"], [class*="CommentIcon"]'
      ));
      const byText = Array.from(document.querySelectorAll('span, div, button, p')).filter((el) => {
        if (!visible(el)) return false;
        const t = compact(el.innerText || el.textContent || '');
        return t === '评论' || /^评论\\s*\\d/.test(t) || /^\\d+\\s*评论$/.test(t);
      });
      const btn = candidates.find(visible) || byText.sort((a, b) => a.getBoundingClientRect().width - b.getBoundingClientRect().width)[0];
      if (btn) {
        try { btn.click(); } catch (_) {}
        await sleep(800);
      }
    };
    const extractCid = (node) => {
      if (!node) return '';
      const attr = String(node.getAttribute?.('data-cid') || node.getAttribute?.('data-comment-id') || '').trim();
      if (/^\\d{10,}$/.test(attr)) return attr;
      const nested = node.querySelector?.('[data-cid], [data-comment-id]');
      const nestedId = String(nested?.getAttribute?.('data-cid') || nested?.getAttribute?.('data-comment-id') || '').trim();
      if (/^\\d{10,}$/.test(nestedId)) return nestedId;
      try {
        const keys = Object.keys(node);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (!key.startsWith('__reactFiber') && !key.startsWith('__reactInternalInstance') && !key.startsWith('__reactProps')) continue;
          const visited = new Set();
          const walk = (obj, depth) => {
            if (!obj || depth > 8 || typeof obj !== 'object' || visited.has(obj)) return '';
            visited.add(obj);
            const direct = obj.cid || obj.commentId || obj.comment_id || obj.comment?.cid;
            if (direct && /^\\d{10,}$/.test(String(direct))) return String(direct);
            const nextKeys = ['memoizedProps', 'pendingProps', 'comment', 'item', 'data'];
            for (let k = 0; k < nextKeys.length; k++) {
              const hit = walk(obj[nextKeys[k]], depth + 1);
              if (hit) return hit;
            }
            return '';
          };
          const found = walk(node[key], 0);
          if (found) return found;
        }
      } catch (_) {}
      return '';
    };
    const scoreNode = (node, allowNickOnly) => {
      const nodeCid = extractCid(node);
      if (targetCid && /^\\d{10,}$/.test(targetCid)) {
        if (nodeCid === targetCid) return 100;
        if (nodeCid && nodeCid !== targetCid) return -1;
      }
      const text = compact(node.innerText || node.textContent || '');
      const nick = compact(targetNick).replace(/^@+/, '');
      if (nick && !text.toLowerCase().includes(nick.toLowerCase())) return -1;
      let score = nick ? 8 : 0;
      const snippet = compact(targetContent).slice(0, 16);
      if (snippet && text.includes(snippet)) score += 20;
      else if (targetCid && !allowNickOnly) return -1;
      else if (snippet && !allowNickOnly) return -1;
      return score;
    };
    const pickBest = (allowNickOnly) => {
      const items = queryItems();
      let best = null;
      let bestScore = 0;
      for (let i = 0; i < items.length; i++) {
        const score = scoreNode(items[i], allowNickOnly);
        if (score > bestScore) {
          bestScore = score;
          best = items[i];
        }
      }
      return { best, bestScore, count: items.length };
    };
    const hover = (el) => {
      const r = el.getBoundingClientRect();
      const x = r.left + Math.min(48, Math.max(12, r.width * 0.35));
      const y = r.bottom - 10;
      ['mouseover', 'mouseenter', 'mousemove'].forEach((type) => {
        try {
          el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y }));
        } catch (_) {}
      });
    };
    const findReplyBtn = (node) => {
      const isSub = !!(node.matches && node.matches('[data-e2e="comment-reply-item"], [class*="reply-item"], [class*="ReplyItem"]'));
      const els = Array.from(node.querySelectorAll('span, a, button, div, p, i, em'));
      let fallback = null;
      for (let i = 0; i < els.length; i++) {
        const el = els[i];
        const e2e = String(el.getAttribute('data-e2e') || el.getAttribute('aria-label') || '');
        const text = compact(el.textContent || el.innerText || '');
        const inChildList = !!el.closest('[class*="reply-list"], [class*="ReplyList"], [class*="sub-comment-list"], [data-e2e="comment-reply-list"]');
        if (inChildList && !isSub) continue;
        if (/comment-reply|reply-btn|ReplyBtn/i.test(e2e) && !/list/i.test(e2e)) return el;
        if (text === '回复' || text === '回复TA') {
          if (text.length <= 4) return el.closest('button, a, [role="button"]') || el;
          fallback = fallback || el;
        }
      }
      return fallback;
    };
    const clickReplyOn = async (node) => {
      hover(node);
      await sleep(250);
      hover(node);
      await sleep(150);
      const btn = findReplyBtn(node);
      if (!btn) return false;
      try {
        const host = btn.closest('button, a, [role="button"]') || btn;
        host.click();
        btn.click();
        return true;
      } catch (_) {
        return false;
      }
    };
    const scrollMore = () => {
      const scroller = findScroller();
      if (!scroller) return false;
      const before = scroller.scrollTop;
      scroller.scrollTop = Math.min(scroller.scrollHeight, scroller.scrollTop + Math.max(280, scroller.clientHeight * 0.8));
      return scroller.scrollTop > before + 8;
    };

    await openComments();
    pauseVideos();
    let lastCount = 0;
    let stagnant = 0;
    while (Date.now() < deadline) {
      pauseVideos();
      if (!queryItems().length) await openComments();
      const allowNickOnly = Date.now() + 12000 > deadline;
      const hit = pickBest(allowNickOnly);
      if (hit.best && hit.bestScore >= 20) {
        const node = hit.best;
        try {
          node.scrollIntoView({ block: 'center', inline: 'nearest' });
        } catch (_) {}
        try {
          node.style.outline = '2px solid #14b8a6';
          node.style.outlineOffset = '2px';
        } catch (_) {}
        await sleep(200);
        let replyClicked = false;
        if (wantReply) {
          for (let k = 0; k < 4 && !replyClicked; k++) {
            replyClicked = await clickReplyOn(node);
            if (!replyClicked) await sleep(280);
          }
        }
        if (!wantReply || replyClicked) {
          return {
            ok: true,
            replyClicked,
            score: hit.bestScore,
            cid: extractCid(node) || targetCid,
            count: hit.count,
          };
        }
        return {
          ok: true,
          replyClicked: false,
          score: hit.bestScore,
          cid: extractCid(node) || targetCid,
          count: hit.count,
          reason: 'found-no-reply-btn',
        };
      }
      if (hit.count !== lastCount) {
        lastCount = hit.count;
        stagnant = 0;
      } else {
        stagnant += 1;
      }
      const moved = scrollMore();
      if (!moved && stagnant > 6 && allowNickOnly && hit.best && hit.bestScore >= 8) {
        const node = hit.best;
        try { node.scrollIntoView({ block: 'center', inline: 'nearest' }); } catch (_) {}
        try {
          node.style.outline = '2px solid #14b8a6';
          node.style.outlineOffset = '2px';
        } catch (_) {}
        const replyClicked = wantReply ? await clickReplyOn(node) : false;
        return {
          ok: true,
          replyClicked,
          score: hit.bestScore,
          cid: extractCid(node) || targetCid,
          count: hit.count,
          reason: replyClicked ? '' : 'nick-fallback',
        };
      }
      await sleep(450);
    }
    const last = pickBest(true);
    return { ok: false, reason: last.count ? 'not-found' : 'no-items', count: last.count, replyClicked: false };
  })()`;
}
module.exports = {
  getLeadCommentPausePageSource,
  getLeadCommentLocatePageSource
};
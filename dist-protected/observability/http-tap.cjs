'use strict';

// 主进程 HTTP/HTTPS 出站流量抓包（仅记录，绝不修改请求/响应）。
//
// 为什么需要它：
//   抖多客的 AI 调用（radarAi.js 等）走主进程 Node 的 axios/http，
//   CDP 的 Network 域只能看到 renderer 流量，看不到主进程流量。
//   本 tap 在安装点（main.js 中 require(jsc) 之前）包装 http/https.request，
//   把所有出站请求与响应记录到 .temp/observe/，用于：
//     1) 确认 AI 请求的真实契约（方法/路径/头/正文）；
//     2) 验证“Ollama 改向”后请求确实落到了本地后端（127.0.0.1:48765）。
//
// 触发：设置环境变量 HUOKE_TRACE_HTTP=1 后启动（如 npm run dev:local）。
// 默认关闭，不影响正常开发流程，也不触碰 jsc 字节码。

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const SENSITIVE_HEADER_KEYS = [
  'authorization',
  'cookie',
  'x-auth-token',
  'x-access-token',
  'x-device-token',
  'proxy-authorization'
];

function installHttpTap() {
  const outDir = path.resolve(process.env.HUOKE_TRACE_DIR || path.join(process.cwd(), '.temp', 'observe'));
  fs.mkdirSync(outDir, { recursive: true });
  const logPath = path.join(outDir, `http-trace-${Date.now()}.log`);
  const stream = fs.createWriteStream(logPath, { flags: 'a' });

  function log(line) {
    stream.write(line + '\n');
  }

  function redactHeaders(headers) {
    const clone = {};
    const src = headers || {};
    for (const key of Object.keys(src)) {
      const lower = String(key).toLowerCase();
      if (SENSITIVE_HEADER_KEYS.includes(lower) || lower.includes('token') || lower.includes('secret') || lower.includes('key')) {
        clone[key] = '<redacted>';
      } else {
        clone[key] = src[key];
      }
    }
    return clone;
  }

  function truncate(text, max = 8000) {
    const s = String(text == null ? '' : text);
    return s.length > max ? s.slice(0, max) + `…[truncated ${s.length - max} bytes]` : s;
  }

  function toBuffer(chunk) {
    if (Buffer.isBuffer(chunk)) return chunk;
    if (typeof chunk === 'string') return Buffer.from(chunk);
    try {
      return Buffer.from(String(chunk));
    } catch {
      return Buffer.from('');
    }
  }

  function resolveUrl(args) {
    const first = args[0];
    try {
      if (typeof first === 'string') return new URL(first);
      if (first instanceof URL) return first;
      if (first && typeof first === 'object') {
        if (first.href) return new URL(first.href);
        if (first.protocol) {
          const host = first.host || first.hostname;
          const pathname = first.path || first.pathname || '/';
          if (host) return new URL(`${first.protocol}//${host}${pathname}`);
        }
        if (first.uri) return new URL(first.uri);
      }
    } catch {
      // ignore
    }
    return null;
  }

  function wrapModule(mod, modName) {
    const origRequest = mod.request.bind(mod);
    mod.request = function (...args) {
      const url = resolveUrl(args);
      let options = args[0];
      let headers = null;
      let method = 'GET';
      if (typeof options === 'object' && options && !(options instanceof URL)) {
        method = options.method || 'GET';
        headers = options.headers || null;
      } else if (args[1] && typeof args[1] === 'object') {
        method = args[1].method || 'GET';
        headers = args[1].headers || null;
      }

      const req = origRequest.apply(mod, args);
      const reqId = `${modName}-${process.hrtime.bigint()}`;
      const reqChunks = [];

      const origWrite = req.write.bind(req);
      req.write = function (chunk, ...rest) {
        if (Buffer.isBuffer(chunk) || typeof chunk === 'string') reqChunks.push(toBuffer(chunk));
        return origWrite(chunk, ...rest);
      };
      const origEnd = req.end.bind(req);
      req.end = function (chunk, ...rest) {
        if (Buffer.isBuffer(chunk) || typeof chunk === 'string') reqChunks.push(toBuffer(chunk));
        return origEnd(chunk, ...rest);
      };

      req.on('response', res => {
        const resChunks = [];
        res.on('data', c => resChunks.push(toBuffer(c)));
        res.on('end', () => {
          const fullUrl = url ? url.toString() : (options && (options.href || options.uri || options.path)) || '(unknown)';
          log(`\n=== ${String(method).toUpperCase()} ${fullUrl} [${reqId}] ===`);
          log(`[req-headers] ${JSON.stringify(redactHeaders(headers))}`);
          log(`[req-body] ${truncate(Buffer.concat(reqChunks).toString('utf8'))}`);
          log(`[res-status] ${res.statusCode} ${res.statusMessage || ''}`);
          log(`[res-headers] ${JSON.stringify(redactHeaders(res.headers))}`);
          log(`[res-body] ${truncate(Buffer.concat(resChunks).toString('utf8'))}`);
        });
      });
      req.on('error', err => log(`[req-error] ${reqId} ${err && err.message ? err.message : String(err)}`));

      return req;
    };
  }

  wrapModule(http, 'http');
  wrapModule(https, 'https');

  log(`# 主进程 HTTP tap 已安装，日志写入 ${logPath}`);
  console.log(`[HttpTap] 已启用主进程 HTTP 抓包，日志：${logPath}`);
  return logPath;
}

module.exports = { installHttpTap };

// Local dev server: serves public/ and the chat backend at /api/chat (same code as the Supabase function).
// Usage:  npm start              (reads AI_API_KEY / AI_MODEL / AI_BASE_URL from .env)
//         npm run dev            (MOCK_AI: canned replies, no key needed)
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createChatHandler, pickProvider } from '../supabase/functions/_shared/chat-core.js';
import { loadEnv } from './env.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp','.svg': 'image/svg+xml', '.ico': 'image/x-icon' };

export function createServer(env = (k) => process.env[k]) {
  const chat = createChatHandler({ env });
  return http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      if (url.pathname === '/api/chat') {
        const chunks = []; for await (const c of req) chunks.push(c);
        const r = await chat(new Request(url, {
          method: req.method,
          headers: { ...req.headers, 'x-forwarded-for': req.socket.remoteAddress || '' },
          body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks),
        }));
        res.writeHead(r.status, Object.fromEntries(r.headers)); res.end(Buffer.from(await r.arrayBuffer())); return;
      }
      const path = normalize(join(ROOT, url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname)));
      if (!path.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
      const data = await readFile(path);
      res.writeHead(200, { 'Content-Type': TYPES[extname(path)] || 'application/octet-stream' }); res.end(data);
    } catch (e) {
      res.writeHead(e.code === 'ENOENT' ? 404 : 500); res.end(e.code === 'ENOENT' ? 'Not found' : 'Server error');
    }
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--mock')) process.env.MOCK_AI = '1';
  loadEnv(join(dirname(fileURLToPath(import.meta.url)), '..', '.env'));
  const p = pickProvider((k) => process.env[k]);
  console.log(p ? `AI provider: ${p.name}${p.model ? ' · model ' + p.model : ''}` : '⚠ No AI key yet – open .env and replace PASTE_YOUR_AI_API_KEY_HERE with your AI_API_KEY. Until then the chatbot uses only predefined answers (or run npm run dev for demo AI replies).');
  const first = +(process.env.PORT || 5173);
  const server = createServer();
  let port = first;
  // If the port is taken (often an earlier dev server still running), try the next few instead of crashing.
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && !process.env.PORT && port < first + 10) {
      console.log(`Port ${port} is busy – trying ${port + 1}…`);
      server.listen(++port);
      return;
    }
    console.error(err.code === 'EADDRINUSE'
      ? `Port ${port} is already in use. Stop the other server (or close its terminal), or run with a different PORT.`
      : err);
    process.exit(1);
  });
  server.on('listening', () => console.log(`ingage site → http://localhost:${port}  (chat backend at /api/chat${process.env.MOCK_AI === '1' ? ', MOCK_AI on' : ''})`));
  server.listen(port);
}

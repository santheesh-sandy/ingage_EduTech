// Dev server: serves the site and the chat backend; build script produces a single-file site.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from '../server/dev-server.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('dev server serves the site and /api/chat', async () => {
  const srv = createServer((k) => ({ MOCK_AI: '1' })[k]);
  await new Promise((r) => srv.listen(0, r));
  const base = 'http://localhost:' + srv.address().port;
  try {
    const home = await fetch(base + '/');
    assert.equal(home.status, 200);
    assert.match(await home.text(), /chat-live\.js/);
    assert.equal((await fetch(base + '/chat-live.js')).headers.get('content-type'), 'text/javascript; charset=utf-8');
    assert.equal((await fetch(base + '/nope.html')).status, 404);
    assert.equal((await fetch(base + '/..%2f..%2fpackage.json')).status, 403);
    const r = await fetch(base + '/api/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ messages: [{ role: 'user', content: 'hello there' }] }) });
    assert.equal(r.status, 200);
    assert.match((await r.json()).reply, /hello there/);
  } finally { srv.close(); }
});

test('build creates a single self-contained index.html', () => {
  execFileSync(process.execPath, [join(root, 'scripts/build.mjs')], { env: { ...process.env, CHAT_API: 'https://x.supabase.co/functions/v1/chat' } });
  const out = readFileSync(join(root, 'dist/index.html'), 'utf8');
  assert.ok(!out.includes('<script src="chat-live.js">'));
  assert.ok(out.includes('AILIVE'));
  assert.ok(out.includes('var CHAT_API="https://x.supabase.co/functions/v1/chat";'));
});

// Gemini / OpenAI-compatible integration via AI_API_KEY + AI_MODEL + AI_BASE_URL (.env).
import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createChatHandler, pickProvider, completionsUrl } from '../supabase/functions/_shared/chat-core.js';
import { parseEnv, loadEnv } from '../server/env.mjs';
import { createServer } from '../server/dev-server.mjs';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const GEMINI = { AI_API_KEY: 'AQ.test-key', AI_MODEL: 'gemini-3.8-flash', AI_BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/openai/' };
const envOf = (o) => (k) => o[k];

test('completionsUrl joins base URLs correctly', () => {
  assert.equal(completionsUrl('https://generativelanguage.googleapis.com/v1beta/openai/'), 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions');
  assert.equal(completionsUrl('https://api.groq.com/openai/v1'), 'https://api.groq.com/openai/v1/chat/completions');
  assert.equal(completionsUrl('https://x.test/v1/chat/completions/'), 'https://x.test/v1/chat/completions');
});

test('AI_API_KEY settings select Gemini with your model, before other keys', () => {
  const p = pickProvider(envOf({ ...GEMINI, ANTHROPIC_API_KEY: 'other' }));
  assert.equal(p.name, 'gemini');
  assert.equal(p.model, 'gemini-3.8-flash');
  assert.equal(p.url, 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions');
  assert.equal(p.reasoning, 'low');
  assert.equal(pickProvider(envOf({ ...GEMINI, AI_REASONING_EFFORT: '' })).reasoning, '');
  assert.equal(pickProvider(envOf({ AI_API_KEY: 'k', AI_BASE_URL: 'https://openrouter.ai/api/v1', AI_MODEL: 'm' })).name, 'openai-compatible');
});

test('sends a correct Gemini OpenAI-compatible request', async () => {
  const calls = [];
  const fetch = async (url, init) => { calls.push({ url, init, body: JSON.parse(init.body) }); return { ok: true, status: 200, json: async () => ({ choices: [{ message: { content: 'Yes, weekend study works.' } }] }) }; };
  const r = await createChatHandler({ env: envOf(GEMINI), fetch, log() {} })(new Request('https://f.test', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: 'Can I study on weekends?' }], language: 'Tamil' }),
  }));
  assert.equal(r.status, 200);
  assert.deepEqual(await r.json(), { reply: 'Yes, weekend study works.' });
  const c = calls[0];
  assert.equal(c.url, 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions');
  assert.equal(c.init.headers.Authorization, 'Bearer AQ.test-key');
  assert.equal(c.body.model, 'gemini-3.8-flash');
  assert.equal(c.body.reasoning_effort, 'low');
  assert.ok(c.body.max_tokens >= 2000, 'room for thinking tokens');
  assert.equal(c.body.messages[0].role, 'system');
  assert.match(c.body.messages[0].content, /Tamil/);
  assert.deepEqual(c.body.messages.at(-1), { role: 'user', content: 'Can I study on weekends?' });
});

test('handles content returned as parts, and Gemini errors fall back cleanly', async () => {
  const parts = async () => ({ ok: true, status: 200, json: async () => ({ choices: [{ message: { content: [{ type: 'text', text: 'Hel' }, { type: 'text', text: 'lo' }] } }] }) });
  const h = createChatHandler({ env: envOf(GEMINI), fetch: parts, log() {} });
  const req = () => new Request('https://f.test', { method: 'POST', body: JSON.stringify({ messages: [{ role: 'user', content: 'hi' }] }) });
  assert.deepEqual(await (await h(req())).json(), { reply: 'Hello' });
  const logs = [];
  const bad = createChatHandler({ env: envOf(GEMINI), log: (m) => logs.push(m), fetch: async () => ({ ok: false, status: 404, text: async () => 'models/gemini-x is not found' }) });
  assert.equal((await bad(req())).status, 502);
  assert.match(logs[0], /gemini 404 .*not found/);
  const noText = createChatHandler({ env: envOf(GEMINI), log() {}, fetch: async () => ({ ok: true, status: 200, json: async () => ({ choices: [{ message: { content: null }, finish_reason: 'length' }] }) }) });
  assert.equal((await noText(req())).status, 502, 'empty reply (all tokens spent thinking) → site shows predefined answer');
});

test('.env parsing and loading', () => {
  const v = parseEnv('# c\nAI_API_KEY=AQ.abc-123_x\nAI_MODEL = gemini-3.8-flash\nexport AI_BASE_URL="https://g.test/v1beta/openai/"\nX=1 # note\nbad line\n');
  assert.deepEqual(v, { AI_API_KEY: 'AQ.abc-123_x', AI_MODEL: 'gemini-3.8-flash', AI_BASE_URL: 'https://g.test/v1beta/openai/', X: '1' });
  const dir = mkdtempSync(join(tmpdir(), 'env-'));
  writeFileSync(join(dir, '.env'), 'AI_MODEL=from-file\nAI_API_KEY=k\n');
  const target = { AI_MODEL: 'from-shell' };
  loadEnv(join(dir, '.env'), target);
  assert.deepEqual(target, { AI_MODEL: 'from-shell', AI_API_KEY: 'k' }, 'shell variables win');
  assert.deepEqual(loadEnv(join(dir, 'missing.env'), {}), {});
});

test('end to end: website backend → fake Gemini server → reply', async () => {
  const seen = [];
  const gemini = http.createServer((req, res) => {
    let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => {
      seen.push({ url: req.url, auth: req.headers.authorization, body: JSON.parse(b) });
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ choices: [{ message: { content: '**Yes!** Weekend batches: please call +91 99416 56492.' } }] }));
    });
  });
  await new Promise((r) => gemini.listen(0, r));
  const env = { ...GEMINI, AI_BASE_URL: `http://localhost:${gemini.address().port}/v1beta/openai/` };
  const site = createServer((k) => env[k]);
  await new Promise((r) => site.listen(0, r));
  try {
    const r = await fetch(`http://localhost:${site.address().port}/api/chat`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Do you have weekend batches?' }], courses: [{ title: 'Digital Twin' }] }),
    });
    assert.equal(r.status, 200);
    assert.match((await r.json()).reply, /Weekend batches/);
    assert.equal(seen[0].url, '/v1beta/openai/chat/completions');
    assert.equal(seen[0].auth, 'Bearer AQ.test-key');
    assert.equal(seen[0].body.model, 'gemini-3.8-flash');
    assert.match(seen[0].body.messages[0].content, /Digital Twin/);
  } finally { site.close(); gemini.close(); }
});

test('the .env template placeholder is treated as "no key"', async () => {
  for (const k of ['PASTE_YOUR_AI_API_KEY_HERE', 'your-key-here', '', undefined]) {
    assert.equal(pickProvider(envOf({ AI_API_KEY: k, AI_MODEL: 'm' })), null, String(k));
  }
  const logs = [];
  const r = await createChatHandler({ env: envOf({ AI_API_KEY: 'PASTE_YOUR_AI_API_KEY_HERE' }), log: (m) => logs.push(m) })(
    new Request('https://f.test', { method: 'POST', body: JSON.stringify({ messages: [{ role: 'user', content: 'hi' }] }) }));
  assert.equal(r.status, 503);
  assert.match(logs[0], /PASTE_YOUR_AI_API_KEY_HERE/);
  assert.equal(pickProvider(envOf({ AI_API_KEY: 'AQ.real-looking-key' })).name, 'gemini');
});

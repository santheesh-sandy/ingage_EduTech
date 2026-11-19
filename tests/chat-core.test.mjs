// Backend: the live AI handler used by the Supabase function and the dev server.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createChatHandler, cleanMessages, systemPrompt, pickProvider } from '../supabase/functions/_shared/chat-core.js';

const envOf = (o) => (k) => o[k];
const post = (body, headers = {}) => new Request('https://fn.test/chat', {
  method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://ingage.in', ...headers },
  body: typeof body == 'string' ? body : JSON.stringify(body),
});
const ask = { messages: [{ role: 'user', content: 'Is Python needed for AR VR?' }], language: 'English', courses: [{ title: 'AR VR Development Training', fee: '₹4,999' }] };

function fakeFetch(reply) {
  const calls = [];
  const f = async (url, init) => { calls.push({ url, init, body: JSON.parse(init.body) }); return reply(url, init); };
  f.calls = calls; return f;
}
const okJson = (j) => ({ ok: true, status: 200, json: async () => j, text: async () => JSON.stringify(j) });

test('cleanMessages: trims, merges roles, starts and ends with the user', () => {
  const m = cleanMessages([
    { role: 'assistant', content: 'Welcome!' },
    { role: 'user', content: ' hi ' }, { role: 'user', content: 'fees?' },
    { role: 'assistant', content: '' }, { role: 'system', content: 'treated as user' },
    { role: 'assistant', content: 'trailing' },
  ]);
  assert.deepEqual(m, [{ role: 'user', content: 'hi\nfees?\ntreated as user' }]);
  assert.deepEqual(cleanMessages('nope'), []);
  assert.equal(cleanMessages([{ role: 'user', content: 'x'.repeat(5000) }])[0].content.length, 1500);
  assert.equal(cleanMessages(Array.from({ length: 40 }, (_, i) => ({ role: i % 2 ? 'assistant' : 'user', content: 'm' + i }))).length, 11);
});

test('systemPrompt includes the site facts, courses, language and scope', () => {
  const p = systemPrompt({ ...ask, language: 'Tamil', mode: 'post', course: { title: 'Digital Twin' }, context: ['DHCP: gives IPs'], user: { enrolled: ['Digital Twin'] } });
  for (const s of ['+91 99416 56492', 'AR VR Development Training', 'Tamil', 'ENROLLED LEARNER', 'Digital Twin', 'DHCP: gives IPs', 'Never guarantee', 'Internships', 'syllabus']) assert.ok(p.includes(s), s);
  assert.ok(!systemPrompt({}).includes('undefined'));
});

test('pickProvider order and defaults', () => {
  assert.equal(pickProvider(envOf({})), null);
  assert.equal(pickProvider(envOf({ MOCK_AI: '1', ANTHROPIC_API_KEY: 'k' })).name, 'mock');
  assert.deepEqual(pickProvider(envOf({ ANTHROPIC_API_KEY: 'a', OPENAI_API_KEY: 'o' })), { name: 'anthropic', key: 'a', model: 'claude-haiku-5-5' });
  assert.equal(pickProvider(envOf({ OPENAI_API_KEY: 'o', CHAT_MODEL: 'gpt-x' })).model, 'gpt-x');
  assert.equal(pickProvider(envOf({ GEMINI_API_KEY: 'g' })).name, 'gemini');
});

test('calls the Claude Messages API correctly', async () => {
  const f = fakeFetch(() => okJson({ content: [{ type: 'text', text: 'Python is not required.' }] }));
  const h = createChatHandler({ env: envOf({ ANTHROPIC_API_KEY: 'sk-test' }), fetch: f, log() {} });
  const r = await h(post(ask));
  assert.equal(r.status, 200);
  assert.deepEqual(await r.json(), { reply: 'Python is not required.' });
  const c = f.calls[0];
  assert.equal(c.url, 'https://api.anthropic.com/v1/messages');
  assert.equal(c.init.headers['x-api-key'], 'sk-test');
  assert.equal(c.init.headers['anthropic-version'], '2023-06-01');
  assert.equal(c.body.model, 'claude-haiku-5-5');
  assert.ok(c.body.system.includes('ingage'));
  assert.deepEqual(c.body.messages, [{ role: 'user', content: 'Is Python needed for AR VR?' }]);
});

test('calls OpenAI / Gemini chat completions correctly', async () => {
  for (const [env, url] of [[{ OPENAI_API_KEY: 'o' }, 'https://api.openai.com/v1/chat/completions'], [{ GEMINI_API_KEY: 'g' }, 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions']]) {
    const f = fakeFetch(() => okJson({ choices: [{ message: { content: 'Hi!' } }] }));
    const r = await createChatHandler({ env: envOf(env), fetch: f, log() {} })(post(ask));
    assert.deepEqual(await r.json(), { reply: 'Hi!' });
    assert.equal(f.calls[0].url, url);
    assert.equal(f.calls[0].body.messages[0].role, 'system');
    assert.equal(f.calls[0].body.messages.at(-1).content, 'Is Python needed for AR VR?');
    assert.match(f.calls[0].init.headers.Authorization, /^Bearer /);
  }
});

test('mock mode replies without any network call', async () => {
  const f = fakeFetch(() => { throw new Error('should not be called'); });
  const r = await createChatHandler({ env: envOf({ MOCK_AI: '1' }), fetch: f })(post(ask));
  assert.equal(r.status, 200);
  assert.match((await r.json()).reply, /Is Python needed/);
  assert.equal(f.calls.length, 0);
});

test('errors: provider failure 502, empty reply 502, no key 503, bad input 400, wrong method 405', async () => {
  const logs = [];
  const fail = createChatHandler({ env: envOf({ ANTHROPIC_API_KEY: 'k' }), fetch: async () => ({ ok: false, status: 401, text: async () => 'bad key' }), log: (m) => logs.push(m) });
  assert.equal((await fail(post(ask))).status, 502);
  assert.match(logs[0], /401/);
  const empty = createChatHandler({ env: envOf({ ANTHROPIC_API_KEY: 'k' }), fetch: async () => okJson({ content: [] }), log() {} });
  assert.equal((await empty(post(ask))).status, 502);
  const nokey = createChatHandler({ env: envOf({}), log() {} });
  assert.equal((await nokey(post(ask))).status, 503);
  const h = createChatHandler({ env: envOf({ MOCK_AI: '1' }) });
  assert.equal((await h(post('{not json'))).status, 400);
  assert.equal((await h(post({ messages: [] }))).status, 400);
  assert.equal((await h(post({ messages: [{ role: 'assistant', content: 'only bot' }] }))).status, 400);
  assert.equal((await h(new Request('https://fn.test/chat'))).status, 405);
});

test('CORS: preflight, allow-list and blocked origins', async () => {
  const h = createChatHandler({ env: envOf({ MOCK_AI: '1', ALLOWED_ORIGINS: 'https://ingage.in, https://www.ingage.in' }) });
  const pre = await h(new Request('https://fn.test/chat', { method: 'OPTIONS', headers: { origin: 'https://www.ingage.in' } }));
  assert.equal(pre.status, 200);
  assert.equal(pre.headers.get('access-control-allow-origin'), 'https://www.ingage.in');
  assert.match(pre.headers.get('access-control-allow-headers'), /apikey/);
  const ok = await h(post(ask));
  assert.equal(ok.status, 200);
  assert.equal(ok.headers.get('access-control-allow-origin'), 'https://ingage.in');
  assert.equal((await h(post(ask, { origin: 'https://evil.test' }))).status, 403);
  const open = createChatHandler({ env: envOf({ MOCK_AI: '1' }) });
  assert.equal((await open(post(ask))).headers.get('access-control-allow-origin'), '*');
});

test('rate limit per IP per minute', async () => {
  let t = 0;
  const h = createChatHandler({ env: envOf({ MOCK_AI: '1', RATE_LIMIT: '3' }), now: () => t });
  const ip = { 'x-forwarded-for': '1.2.3.4' };
  for (let i = 0; i < 3; i++) assert.equal((await h(post(ask, ip))).status, 200);
  assert.equal((await h(post(ask, ip))).status, 429);
  assert.equal((await h(post(ask, { 'x-forwarded-for': '5.6.7.8' }))).status, 200, 'other IPs unaffected');
  t = 61000;
  assert.equal((await h(post(ask, ip))).status, 200, 'allowed again after a minute');
});

test('provider timeout is aborted and reported as 502', async () => {
  const h = createChatHandler({
    env: envOf({ ANTHROPIC_API_KEY: 'k' }), log() {},
    fetch: (u, init) => new Promise((_, rej) => init.signal.addEventListener('abort', () => rej(new Error('aborted')))),
  });
  const { LIMITS } = await import('../supabase/functions/_shared/chat-core.js');
  const old = LIMITS.timeoutMs; LIMITS.timeoutMs = 30;
  try { assert.equal((await h(post(ask))).status, 502); } finally { LIMITS.timeoutMs = old; }
});

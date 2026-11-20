// Backend rules from the gold document: prompt content, hand-offs, distress safety net, redaction,
// login check (learner status from the server) and the shared rate limit hook.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createChatHandler, systemPrompt, splitHandoffs, isDistress, redact, careReply } from '../supabase/functions/_shared/chat-core.js';

const ENV = { AI_API_KEY: 'k', AI_MODEL: 'm', AI_BASE_URL: 'https://ai.test/v1' };
const env = (o = ENV) => (k) => o[k];
const req = (body, headers = {}) => new Request('https://f.test', { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) });
const ask = (q, extra = {}) => ({ messages: [{ role: 'user', content: q }], ...extra });
function fakeAI(reply) {
  const seen = [];
  const fetch = async (url, init) => { seen.push(JSON.parse(init.body)); return { ok: true, status: 200, json: async () => ({ choices: [{ message: { content: typeof reply === 'function' ? reply(seen.at(-1)) : reply } }] }) }; };
  return { fetch, seen };
}

test('prompt carries the gold rules', () => {
  const p = systemPrompt({});
  for (const re of [/not a person/i, /at most 3 questions, ONE question per message/, /what that course will NOT give them/, /nothing we offer fits/,
    /Never give answers to quiz, MCQ/, /\*\*Goal\*\*, \*\*How far this course gets you\*\*, \*\*Gaps\*\*, \*\*Next steps\*\*, \*\*Honest timing\*\*/,
    /Never guarantee a job/, /Never state salary numbers/, /No pressure tactics/, /Aadhaar, PAN/, /under 18/, /HANDOFF: support/, /HANDOFF: mentor/,
    /14416/, /Do not name or recommend other providers/, /Never recommend them, push them/]) assert.match(p, re);
  assert.doesNotMatch(p, /LPA|50\+ a year|100% placement/, 'no unsourced figures in the facts');
});

test('a learner is only treated as enrolled when they have enrolled courses', () => {
  assert.match(systemPrompt({ mode: 'post', user: { enrolled: ['IT Network System Administrator'] } }), /ENROLLED LEARNER in: IT Network System Administrator/);
  assert.match(systemPrompt({ mode: 'post', user: { enrolled: [] } }), /VISITOR/);
});

test('profile and role map reach the prompt', () => {
  const p = systemPrompt({ profile: { situation: 'working', goal: 'move into networking', hours_per_week: 6 }, roles: [{ role: 'NOC Engineer (L1)', gaps: 'monitoring tools' }] });
  assert.match(p, /current situation: working professional; goal: move into networking; hours per week: 6/);
  assert.match(p, /ROLE-TO-SKILLS MAP.*NOC Engineer/);
});

test('hand-off tags are removed from the text and returned separately', () => {
  assert.deepEqual(splitHandoffs('Call us.\n\nHANDOFF: support'), { text: 'Call us.', handoff: ['support'] });
  assert.deepEqual(splitHandoffs('ok\n**HANDOFF: mentor, support**'), { text: 'ok', handoff: ['mentor', 'support'] });
  assert.deepEqual(splitHandoffs('HANDOFF: nonsense'), { text: '', handoff: [] });
  assert.deepEqual(splitHandoffs('no tags here'), { text: 'no tags here', handoff: [] });
});

test('handler returns hand-offs from the model', async () => {
  const { fetch } = fakeAI('Please contact our team on +91 99416 56492.\nHANDOFF: support');
  const r = await createChatHandler({ env: env(), fetch, log() {} })(req(ask('I was charged twice')));
  assert.deepEqual(await r.json(), { reply: 'Please contact our team on +91 99416 56492.', handoff: ['support'] });
});

test('distress always gets the helpline, even if the model forgets or fails', async () => {
  assert.ok(isDistress('I feel hopeless and want to die'));
  assert.ok(isDistress('मैं आत्महत्या के बारे में सोच रहा हूँ'));
  assert.ok(!isDistress('This lab is killing me haha, how do I fix DHCP?'));
  const forgot = fakeAI('Our networking course is great!');
  let j = await (await createChatHandler({ env: env(), fetch: forgot.fetch, log() {} })(req(ask('I want to end my life')))).json();
  assert.match(j.reply, /14416/); assert.deepEqual(j.handoff, ['helpline']);
  const down = async () => { throw new Error('down'); };
  j = await (await createChatHandler({ env: env(), fetch: down, log() {} })(req(ask('I want to kill myself')))).json();
  assert.equal(j.reply, careReply()); assert.deepEqual(j.handoff, ['helpline']);
  j = await (await createChatHandler({ env: env({}), log() {} })(req(ask('I feel worthless')))).json();
  assert.match(j.reply, /14416/, 'even with no AI key configured');
});

test('sensitive numbers are removed before the AI sees them', async () => {
  assert.equal(redact('my aadhaar is 1234 5678 9012'), 'my aadhaar is [aadhaar removed]');
  assert.equal(redact('PAN ABCDE1234F'), 'PAN [PAN removed]');
  assert.equal(redact('card 4111 1111 1111 1111 cvv 123'), 'card [card number removed] cvv [removed]');
  assert.equal(redact('call +91 99416 56492'), 'call +91 99416 56492', 'phone numbers are kept');
  const ai = fakeAI('ok');
  await createChatHandler({ env: env(), fetch: ai.fetch, log() {} })(req(ask('my OTP is 482913, why did payment fail?')));
  assert.doesNotMatch(JSON.stringify(ai.seen[0].messages), /482913/);
});

test('login check: learner status comes from the server, not the browser', async () => {
  const ai = fakeAI('ok');
  const verifyUser = async (t) => (t === 'eyJa.b.c' ? { id: 'u1', enrolled: ['IT Network System Administrator'], profile: { situation: 'college' } } : null);
  const h = createChatHandler({ env: env(), fetch: ai.fetch, log() {}, verifyUser });
  // a visitor claiming to be enrolled is treated as a visitor
  await h(req(ask('help', { mode: 'post', user: { enrolled: ['Fake Course'] } }), { authorization: 'Bearer sb_publishable_x' }));
  assert.match(ai.seen[0].messages[0].content, /VISITOR/);
  assert.doesNotMatch(ai.seen[0].messages[0].content, /Fake Course/);
  // a signed-in learner gets their real enrollments and profile
  await h(req(ask('help', { mode: 'post', user: { enrolled: ['Fake Course'] } }), { authorization: 'Bearer eyJa.b.c' }));
  assert.match(ai.seen[1].messages[0].content, /ENROLLED LEARNER in: IT Network System Administrator/);
  assert.match(ai.seen[1].messages[0].content, /college student/);
});

test('shared rate limit hook is used, keyed by user or IP', async () => {
  const keys = [];
  const h = createChatHandler({ env: env(), fetch: fakeAI('ok').fetch, log() {}, rateLimit: async (k) => { keys.push(k); return keys.length < 2; } });
  assert.equal((await h(req(ask('hi'), { 'x-forwarded-for': '1.2.3.4' }))).status, 200);
  assert.equal((await h(req(ask('hi'), { 'x-forwarded-for': '1.2.3.4' }))).status, 429);
  assert.deepEqual(keys, ['ip:1.2.3.4', 'ip:1.2.3.4']);
  // limiter outage falls back to the in-memory limit instead of failing every request
  const h2 = createChatHandler({ env: env(), fetch: fakeAI('ok').fetch, log() {}, rateLimit: async () => { throw new Error('db down'); } });
  assert.equal((await h2(req(ask('hi')))).status, 200);
});

test('allowed sites: other origins are refused when ALLOWED_ORIGINS is set', async () => {
  const h = createChatHandler({ env: env({ ...ENV, ALLOWED_ORIGINS: 'https://ingage.in' }), fetch: fakeAI('ok').fetch, log() {} });
  assert.equal((await h(req(ask('hi'), { origin: 'https://evil.test' }))).status, 403);
  assert.equal((await h(req(ask('hi'), { origin: 'https://ingage.in' }))).status, 200);
});

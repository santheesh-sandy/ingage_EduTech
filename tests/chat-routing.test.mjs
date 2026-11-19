// Frontend: which questions use predefined answers and which go to the live AI.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSite, sleep } from './helpers.mjs';

const PREDEFINED = [
  ['What is the fee for the networking course?', /₹4,999/],
  ['How do I enroll?', /Enroll/i],
  ['salary after cyber security', /LPA/],
  ['What is DHCP?', /DHCP/],
  ['hello', /Hello/],
  ['lidar', /LiDAR/],
  ['Show all courses', /Network System Administrator/],
  ['how much is the fee', /₹/],
];
const LIVE = [
  'Is Python needed for AR VR?',
  'Can I study while working a night shift job?',
  'Do you have weekend batches for working professionals in Madurai?',
  'random gibberish words here',
  'நான் வார இறுதியில் படிக்கலாமா?',
  'क्या मैं नौकरी के साथ पढ़ सकता हूँ?',
  'Can I do this course along with my job?',
  'Is it possible to learn on weekends only?',
];

test('page loads without script errors', async () => {
  const s = await loadSite();
  s.open();
  await sleep(100);
  assert.deepEqual(s.errors, []);
  assert.ok(s.w.document.querySelector('#cbm .ai-bub'), 'welcome message shown');
  s.close();
});

test('predefined questions are answered without calling the AI', async () => {
  const s = await loadSite();
  s.open();
  for (const [q, re] of PREDEFINED) {
    const n = s.calls.length;
    await s.ask(q);
    assert.equal(s.calls.length, n, `"${q}" should not call the AI`);
    assert.match(s.lastText(), re, `"${q}" predefined answer`);
    assert.equal(s.w.AILIVE.lastSource, 'predefined');
  }
  assert.deepEqual(s.errors, []);
  s.close();
});

test('questions the predefined answers do not cover go to the live AI', async () => {
  const s = await loadSite();
  s.open();
  for (const q of LIVE) {
    const n = s.calls.length;
    await s.ask(q);
    assert.equal(s.calls.length, n + 1, `"${q}" should call the AI`);
    assert.match(s.lastText(), new RegExp('AI answer for: ' + q.replace(/[?.*+()[\]\\]/g, '\\$&')));
    assert.equal(s.last().querySelector('b')?.textContent, 'AI', 'markdown bold rendered');
    assert.equal(s.w.AILIVE.lastSource, 'ai');
  }
  assert.deepEqual(s.errors, []);
  s.close();
});

test('on a course page, an unrelated question goes to AI but course questions stay predefined', async () => {
  const s = await loadSite({ url: 'https://site.test/#course' });
  s.w.CVI = 1; s.open();
  let n = s.calls.length;
  await s.ask('Can I attend the lab sessions on weekends?');
  assert.equal(s.calls.length, n + 1);
  assert.equal(s.calls.at(-1).body.course.title, 'IT Network System Administrator');
  n = s.calls.length;
  await s.ask('how long is this course');
  assert.equal(s.calls.length, n, 'duration is predefined');
  assert.match(s.lastText(), /60/);
  assert.doesNotMatch(s.lastText(), /DHCP|Ubuntu/, 'not an unrelated quiz question');
  n = s.calls.length;
  await s.ask('what is the fee for this course?');
  assert.equal(s.calls.length, n, 'fee is predefined');
  assert.match(s.lastText(), /₹4,999/);
  s.close();
});

test('AI request payload is clean and complete', async () => {
  const s = await loadSite();
  s.open();
  await s.ask('Show all courses');
  await s.ask('Is Python needed for AR VR?');
  const { body, url } = s.calls.at(-1);
  assert.equal(url, 'https://mock.test/chat');
  assert.equal(body.messages.at(-1).role, 'user');
  assert.equal(body.messages.at(-1).content, 'Is Python needed for AR VR?');
  for (const m of body.messages) assert.doesNotMatch(m.content, /<[a-z][^>]*>/i, 'no HTML sent to the AI');
  assert.ok(body.messages.length <= 12);
  assert.equal(body.courses.length, 6);
  assert.ok(body.courses[0].fee.includes('₹4,999'));
  assert.equal(body.courses[0].syllabus.length, 10, 'module list sent so the AI can answer syllabus questions');
  assert.equal(body.language, 'English');
  s.close();
});

test('AI failure falls back to the predefined answer and does not get stuck', async () => {
  for (const ai of [() => ({ status: 500 }), () => ({ json: {} }), () => { throw new Error('network'); }]) {
    const s = await loadSite({ ai });
    s.open();
    await s.ask('Is Python needed for AR VR?');
    assert.equal(s.typing(), 0, 'typing bubble removed');
    assert.equal(s.w.AILIVE.busy, 0, 'not stuck busy');
    assert.equal(s.w.AILIVE.lastSource, 'fallback');
    assert.ok(s.lastText().length > 10, 'fallback text shown');
    await s.ask('How do I enroll?');
    assert.match(s.lastText(), /Enroll/i, 'chat still works afterwards');
    s.close();
  }
});

test('a slow AI shows a typing bubble and blocks double sends', async () => {
  let release;
  const s = await loadSite({ ai: () => new Promise((r) => { release = () => r({ reply: 'late reply' }); }) });
  s.open();
  s.w.cbS('Is Python needed for AR VR?');
  await sleep(50);
  assert.equal(s.typing(), 1);
  s.w.$('cbx').value = 'second question';
  s.w.cbS();
  assert.equal(s.w.$('cbx').value, 'second question', 'second message kept in the box while waiting');
  assert.equal(s.calls.length, 1);
  release(); await sleep(50);
  assert.equal(s.typing(), 0);
  assert.equal(s.lastText(), 'late reply');
  s.close();
});

test('AI replies are escaped (no HTML injection)', async () => {
  const s = await loadSite({ ai: () => ({ reply: '<img src=x onerror="window.hacked=1"> **ok** [site](javascript:alert(1)) [good](https://ingage.in)' }) });
  s.open();
  await s.ask('Is Python needed for AR VR?');
  const b = s.last();
  assert.equal(b.querySelector('img'), null);
  assert.equal(s.w.hacked, undefined);
  assert.equal(b.querySelector('b').textContent, 'ok');
  const links = [...b.querySelectorAll('a')].map((a) => a.getAttribute('href'));
  assert.deepEqual(links, ['https://ingage.in']);
  s.close();
});

test('auto-detected language switches back to English; a chosen language stays', async () => {
  const s = await loadSite();
  s.open();
  await s.ask('நான் வார இறுதியில் படிக்கலாமா?');
  assert.equal(s.w.HL, 'ta');
  assert.equal(s.calls.at(-1).body.language, 'Tamil');
  await s.ask('how long is the lidar course');
  assert.equal(s.w.HL, 'en', 'back to English after an English message');
  assert.match(s.lastText(), /40 hours/i);
  s.w.aiSetLang('ta'); await sleep(50);
  await s.ask('what is the fee for lidar');
  assert.equal(s.w.HL, 'ta', 'manually chosen Tamil is kept');
  s.close();
});

test('with no live API configured the bot works exactly as before (no network)', async () => {
  const s = await loadSite({ chatApi: '' });
  s.open();
  await s.ask('Is Python needed for AR VR?');
  await s.ask('random gibberish words here');
  assert.equal(s.calls.length, 0);
  assert.match(s.lastText(), /not sure|interest|courses/i);
  s.close();
});

test('uses the Supabase function when CFG.supabase is set, and stops after a 404', async () => {
  const s = await loadSite({ chatApi: '', ai: () => ({ status: 404 }) });
  s.w.CFG.supabase = { url: 'https://abc.supabase.co/', key: 'sb_publishable_x' };
  s.open();
  await s.ask('Is Python needed for AR VR?');
  assert.equal(s.calls[0].url, 'https://abc.supabase.co/functions/v1/chat');
  assert.equal(s.calls[0].headers.apikey, 'sb_publishable_x');
  await s.ask('Can I study while working a night shift job?');
  assert.equal(s.calls.length, 1, 'no more calls once the function is known missing');
  s.close();
});

test('enrolled learner: doubts go to the AI with course context; mentor doubts are saved, never sent to AI', async () => {
  const email = 'learner@test.in';
  const s = await loadSite({ url: 'https://site.test/#learn', storage: { sf_enr: JSON.stringify({ [email]: { 1: { txn: 'T1', inv: 'ING/2026-27/1', date: '19/11/2026', amt: 4999, list: 4999, pm: 'UPI', done: [] } } }) } });
  s.w.US = { email, name: 'Test Learner' };
  s.w.LC = 1;
  s.w.location.hash = '#learn'; await sleep(50); // the page redirects #learn away when nobody is logged in at load
  s.open();
  assert.equal(s.w.AIM, 'post', 'learner mode on the learning page');
  let n = s.calls.length;
  await s.ask('How do I configure OSPF on a Cisco router step by step?');
  assert.equal(s.calls.length, n + 1);
  const b = s.calls.at(-1).body;
  assert.equal(b.mode, 'post');
  assert.deepEqual(b.user.enrolled, ['IT Network System Administrator']);
  assert.equal(b.course.title, 'IT Network System Administrator');
  n = s.calls.length;
  await s.ask('What is DHCP?');
  assert.equal(s.calls.length, n, 'course knowledge answers stay predefined');
  s.w.hMentor(); await sleep(500);
  n = s.calls.length;
  await s.ask('My VLAN lab is not pinging between switches, please help');
  assert.equal(s.calls.length, n, 'mentor doubt is not sent to the AI');
  assert.match(s.lastText(), /mentor/i);
  assert.deepEqual(s.errors, []);
});

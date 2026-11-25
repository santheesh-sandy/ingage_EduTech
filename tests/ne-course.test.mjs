// Network Essentials (course 15): 24 decks + 8 videos from S3, picture, MCQ tests, capstones, careers, jobs, chatbot.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSite, sleep } from './helpers.mjs';

const B = 'https://ingage-lms.s3.ap-south-1.amazonaws.com/Network+Essentials/';

test('Network Essentials is open with 10 modules, 24 decks, 8 videos, a picture and an MCQ test per module', async () => {
  const s = await loadSite();
  const c = s.w.cf(15);
  assert.equal(c.t, 'Network Essentials');
  assert.ok(!c.soon && !c.hid && s.w.cxVis().includes(c));
  assert.match(c.img, /^data:image\/jpeg;base64,/, 'course picture');
  const ms = s.w.mods(c), all = ms.flatMap((m) => m.ls);
  assert.equal(ms.length, 10);
  const decks = all.filter((l) => l.cx && l.cx.ty == 'doc').map((l) => l.cx.url);
  assert.deepEqual([...ms.map((m) => m.ls.filter((l) => l.cx && l.cx.ty == 'doc').length)], [3, 2, 3, 2, 2, 2, 2, 2, 3, 3]);
  assert.equal(new Set(decks).size, 24);
  assert.equal(decks[1], B + 'Slides/Module_01_Course_Intro_Networking_Basics_LAN_MAN_WAN_Part2.pptx');
  const vids = all.filter((l) => l.cx && l.cx.ty == 'video').map((l) => l.cx.url);
  assert.deepEqual([...ms.map((m) => m.ls.filter((l) => l.cx && l.cx.ty == 'video').length)], [1, 1, 1, 1, 1, 1, 1, 1, 0, 0]);
  assert.equal(vids[0], B + 'Videos/Network+Essentials+-1.mp4');
  const q = ms.flatMap((m) => s.w.QSET[m.ls.at(-1).id]);
  assert.equal(q.length, 50);
  assert.equal(new Set(q.map((x) => x[0])).size, 50);
  for (const [t, o, a] of q) assert.ok(t && o.length == 4 && new Set(o).size == 4 && a >= 0 && a < 4, t);
});

test('Network Essentials page, careers, own jobs; the chatbot sends beginners here without taking "network" from IT Network', async () => {
  const s = await loadSite({ chatApi: '' });
  s.w.show(15); await sleep(60);
  const cv = s.w.$('cv');
  assert.match(cv.querySelector('#cx-overview .cx-biz').textContent, /How it is used in business/);
  assert.equal(cv.querySelectorAll('#cx-capstones .cap-card').length, 5);
  assert.match(cv.querySelector('#cx-careers').textContent, /Network Support Engineer \(L1\).*LPA/);
  const jobs = s.w.cf(15).jobs.map((i) => s.w.JOBS[i][0]);
  assert.ok(jobs.includes('Networking Intern') && jobs.includes('Network Support Engineer (L1)'));
  assert.ok(s.w.cf(1).jobs.map((i) => s.w.JOBS[i][0]).includes('IT Help Desk Engineer'), 'IT Network keeps its listing');
  assert.ok(s.w.PREP_Q[15].length >= 8);
  assert.deepEqual(s.errors, []);
  s.open(); await sleep(30);
  await s.ask('Tell me about the network essentials course');
  assert.match(s.lastText(), /Network Essentials/);
  await s.ask('Tell me about the networking course');
  assert.match(s.lastText(), /IT Network System Administrator/, '"networking" alone still means the IT Network course');
  assert.ok(s.w.rolesFor('Can I become a network support engineer?', [15]).some((r) => r.role == 'Network Support Engineer (L1)'));
});

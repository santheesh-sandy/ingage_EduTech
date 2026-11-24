// Industrial Robot Programming and Operations (course 9): 22 decks + 8 videos from S3, MCQ tests, capstones, chatbot.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSite, sleep } from './helpers.mjs';

const B = 'https://ingage-lms.s3.ap-south-1.amazonaws.com/Industrial+Robot+Programming+and+Operations/';

test('the robot course is open with 10 modules, 22 decks, 8 videos and an MCQ test per module', async () => {
  const s = await loadSite();
  const c = s.w.cf(9);
  assert.equal(c.t, 'Industrial Robot Programming and Operations');
  assert.ok(!c.soon && !c.hid && s.w.cxVis().includes(c));
  assert.match(c.img, /^data:image\/jpeg;base64,/);
  const ms = s.w.mods(c), all = ms.flatMap((m) => m.ls);
  assert.equal(ms.length, 10);
  assert.deepEqual([...ms.map((m) => m.ls.filter((l) => l.cx && l.cx.ty == 'doc').length)], [3, 2, 2, 2, 2, 2, 2, 2, 2, 3]);
  const decks = all.filter((l) => l.cx && l.cx.ty == 'doc').map((l) => l.cx.url);
  assert.equal(new Set(decks).size, 22);
  assert.equal(decks[0], B + 'Slides/Module-01_Session-1_Course-Introduction-and-Industry-Overview.pptx');
  assert.equal(decks.at(-2), B + 'Slides/Module-10_Session-2_Final-Projects.pptx', 'stored on S3 without "(1)"');
  assert.ok(!decks.some((u) => /\(1\)/.test(u)));
  const vids = all.filter((l) => l.cx && l.cx.ty == 'video');
  assert.deepEqual([...vids.map((l) => l.t)], Array.from({ length: 8 }, (_, i) => 'Video: Part ' + (i + 1)));
  assert.equal(vids[0].cx.url, B + 'Videos/Part+1.mp4');
  assert.deepEqual([...ms.map((m) => m.ls.filter((l) => l.cx && l.cx.ty == 'video').length)], [1, 1, 1, 1, 1, 1, 1, 1, 0, 0]);
  const q = ms.flatMap((m) => s.w.QSET[m.ls.at(-1).id]);
  assert.equal(q.length, 50);
  assert.equal(new Set(q.map((x) => x[0])).size, 50);
  for (const [t, o, a] of q) assert.ok(t && o.length == 4 && new Set(o).size == 4 && a >= 0 && a < 4, t);
});

test('course page: overview, 5 capstones, careers with pay; the chatbot routes robot questions here', async () => {
  const s = await loadSite({ chatApi: '' });
  s.w.show(9); await sleep(60);
  const cv = s.w.$('cv');
  assert.match(cv.querySelector('#cx-overview .cx-biz').textContent, /How it is used in business/);
  assert.equal(cv.querySelectorAll('#cx-capstones .cap-card').length, 5);
  assert.match(cv.querySelector('#cx-careers').textContent, /Robot Programmer \(Trainee\).*LPA/);
  assert.deepEqual(s.errors, []);
  s.open(); await sleep(30);
  await s.ask('Tell me about the industrial robot course');
  assert.match(s.lastText(), /Industrial Robot Programming and Operations/);
  assert.ok(s.w.rolesFor('Can I become a robot programmer?', [9]).some((r) => r.role == 'Robot Programmer (Trainee)'));
});

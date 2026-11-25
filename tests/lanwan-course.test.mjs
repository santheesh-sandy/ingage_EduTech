// Computer Network through LAN & WAN (course 12): 29 decks + 12 videos from S3, MCQ tests, capstones, careers, chatbot.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSite, sleep } from './helpers.mjs';

const B = 'https://ingage-lms.s3.ap-south-1.amazonaws.com/Computer+Network+through+LAN+%26+WAN/';

test('the LAN & WAN course is open with 10 modules, 29 decks, 12 videos and an MCQ test per module', async () => {
  const s = await loadSite();
  const c = s.w.cf(12);
  assert.equal(c.t, 'Computer Network through LAN & WAN');
  assert.ok(!c.soon && !c.hid && s.w.cxVis().includes(c));
  assert.match(c.img, /^data:image\/jpeg;base64,/);
  assert.match(s.w.cf(11).img, /^data:image\/jpeg;base64,/, 'the cabling course has its picture too');
  const ms = s.w.mods(c), all = ms.flatMap((m) => m.ls);
  assert.equal(ms.length, 10);
  const decks = all.filter((l) => l.cx && l.cx.ty == 'doc').map((l) => l.cx.url);
  assert.deepEqual([...ms.map((m) => m.ls.filter((l) => l.cx && l.cx.ty == 'doc').length)], [3, 3, 3, 3, 2, 3, 3, 3, 3, 3]);
  assert.equal(new Set(decks).size, 29);
  assert.equal(decks[0], B + 'Slides/Module_01_Course_Intro_and_Network_Basics_Part1.pptx');
  const vids = all.filter((l) => l.cx && l.cx.ty == 'video').map((l) => l.cx.url);
  assert.equal(new Set(vids).size, 12);
  assert.ok(vids.includes(B + 'Videos/Video5-Topology.mp4'));
  assert.ok(vids.includes(B + 'Videos/video-1+Introduction+to+cisco+packet+tracer+.mp4'), 'S3 name has a space before .mp4');
  assert.ok(!vids.some((u) => /Video10/.test(u)), 'Video10 is a copy of Video-9 on S3');
  const q = ms.flatMap((m) => s.w.QSET[m.ls.at(-1).id]);
  assert.equal(q.length, 50);
  assert.equal(new Set(q.map((x) => x[0])).size, 50);
  for (const [t, o, a] of q) assert.ok(t && o.length == 4 && new Set(o).size == 4 && a >= 0 && a < 4, t);
});

test('LAN & WAN course page: overview, 5 capstones, careers with pay; the chatbot routes LAN/WAN questions here', async () => {
  const s = await loadSite({ chatApi: '' });
  s.w.show(12); await sleep(60);
  const cv = s.w.$('cv');
  assert.match(cv.querySelector('#cx-overview .cx-biz').textContent, /How it is used in business/);
  assert.equal(cv.querySelectorAll('#cx-capstones .cap-card').length, 5);
  assert.match(cv.querySelector('#cx-careers').textContent, /Network Engineer \(Trainee\).*LPA/);
  assert.deepEqual(s.errors, []);
  s.open(); await sleep(30);
  await s.ask('Tell me about the computer network LAN and WAN course');
  assert.match(s.lastText(), /Computer Network through LAN &amp; WAN|Computer Network through LAN & WAN/);
  assert.ok(s.w.rolesFor('Can I become a network engineer?', [12]).some((r) => r.role == 'Network Engineer (Trainee)'));
});

// Internet of Things (course 10): 37 decks and 34 videos from S3, MCQ tests, capstones, careers, chatbot.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSite, sleep } from './helpers.mjs';

const B = 'https://ingage-lms.s3.ap-south-1.amazonaws.com/Internet+of+Things/';

test('the IoT course is open with 15 modules, 37 decks, 34 videos and an MCQ test per module', async () => {
  const s = await loadSite();
  const c = s.w.cf(10);
  assert.equal(c.t, 'Internet of Things');
  assert.ok(!c.soon && !c.hid && s.w.cxVis().includes(c));
  assert.match(c.img, /^data:image\/jpeg;base64,/);
  const ms = s.w.mods(c), all = ms.flatMap((m) => m.ls);
  assert.equal(ms.length, 15);
  const decks = all.filter((l) => l.cx && l.cx.ty == 'doc').map((l) => l.cx.url);
  assert.deepEqual([...ms.map((m) => m.ls.filter((l) => l.cx && l.cx.ty == 'doc').length)], [3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 3]);
  assert.equal(new Set(decks).size, 37);
  assert.equal(decks[0], B + 'Slides/Module_01_Introduction_to_IoT_First_Program_Part1.pptx');
  assert.equal(decks.at(-1), B + 'Slides/Module_15_Radar_System_AI_IoT_Part3.pptx');
  const vids = all.filter((l) => l.cx && l.cx.ty == 'video');
  assert.deepEqual([...ms.map((m) => m.ls.filter((l) => l.cx && l.cx.ty == 'video').length)], [2, 2, 2, 2, 3, 3, 2, 2, 2, 2, 3, 2, 2, 3, 2]);
  const parts = vids.map((l) => +l.t.match(/Part (\d+)/)[1]);
  assert.deepEqual([...parts].sort((a, b) => a - b), Array.from({ length: 34 }, (_, i) => i + 1));
  assert.ok(vids.some((l) => l.cx.url == B + "Videos/Part24+-+Hive+MQ+to+NODE+RED.mp4") && vids.some((l) => l.cx.url == B + "Videos/31+-+Flame-Moisture-Gas+-+Arduino+(Hardware).mp4"), "Part 24 and 31 use their S3 names");
  assert.equal(new Set(vids.map((l) => l.cx.url)).size, 34);
  assert.equal(vids[0].cx.url, B + 'Videos/Part+1+-+Intro.mp4');
  assert.equal(vids[12].cx.url, B + 'Videos/Part+13+-++Blynk+Mobile+Setup.mp4', 'two spaces after the dash on S3');
  assert.equal(vids.at(-1).cx.url, B + 'Videos/Part+34+-+AI+%2B+IOT.mp4');
  const q = ms.flatMap((m) => s.w.QSET[m.ls.at(-1).id]);
  assert.equal(q.length, 75);
  assert.equal(new Set(q.map((x) => x[0])).size, 75);
  for (const [t, o, a] of q) assert.ok(t && o.length == 4 && new Set(o).size == 4 && a >= 0 && a < 4, t);
});

test('course page: overview, 5 capstones, careers with pay; the chatbot routes IoT questions here', async () => {
  const s = await loadSite({ chatApi: '' });
  s.w.show(10); await sleep(60);
  const cv = s.w.$('cv');
  assert.match(cv.querySelector('#cx-overview .cx-biz').textContent, /How it is used in business/);
  assert.equal(cv.querySelectorAll('#cx-capstones .cap-card').length, 5);
  assert.match(cv.querySelector('#cx-careers').textContent, /IoT Developer \(Trainee\).*LPA/);
  assert.deepEqual(s.errors, []);
  s.open(); await sleep(30);
  await s.ask('Tell me about the IoT course');
  assert.match(s.lastText(), /Internet of Things/);
  assert.ok(s.w.rolesFor('Can I become an IoT developer?', [10]).some((r) => r.role == 'IoT Developer (Trainee)'));
});

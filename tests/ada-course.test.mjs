// Advanced Data Analytics using Python & Visualization (course 13): 21 decks + 6 videos from S3, MCQ tests, capstones, careers, chatbot.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSite, sleep } from './helpers.mjs';

const B = 'https://ingage-lms.s3.ap-south-1.amazonaws.com/Advanced+Data+Analytics+using+Python%2C+Visulaization/';

test('the data analytics course is open with 7 modules, 21 decks, 6 videos and an MCQ test per module', async () => {
  const s = await loadSite();
  const c = s.w.cf(13);
  assert.equal(c.t, 'Advanced Data Analytics using Python & Visualization');
  assert.ok(!c.soon && !c.hid && s.w.cxVis().includes(c));
  assert.match(c.img, /^data:image\/jpeg;base64,/, 'course picture');
  const ms = s.w.mods(c), all = ms.flatMap((m) => m.ls);
  assert.equal(ms.length, 7);
  const decks = all.filter((l) => l.cx && l.cx.ty == 'doc').map((l) => l.cx.url);
  assert.equal(new Set(decks).size, 21);
  assert.equal(decks[0], B + 'Slides/Module_01_Intro_and_Python_Fundamentals_Part1.pptx');
  const vids = all.filter((l) => l.cx && l.cx.ty == 'video').map((l) => l.cx.url);
  assert.deepEqual([...ms.map((m) => m.ls.filter((l) => l.cx && l.cx.ty == 'video').length)], [2, 1, 0, 1, 1, 1, 0]);
  assert.ok(vids.includes(B + 'Videos/Unit-1+part-2(24m).mp4'));
  assert.ok(!vids.some((u) => /Big\+Data/.test(u)), '"Big Data" on S3 is a copy of Unit 4');
  const q = ms.flatMap((m) => s.w.QSET[m.ls.at(-1).id]);
  assert.equal(q.length, 35);
  assert.equal(new Set(q.map((x) => x[0])).size, 35);
  for (const [t, o, a] of q) assert.ok(t && o.length == 4 && new Set(o).size == 4 && a >= 0 && a < 4, t);
});

test('data analytics course page, careers, jobs, and the chatbot now offers it for data science', async () => {
  const s = await loadSite({ chatApi: '' });
  s.w.show(13); await sleep(60);
  const cv = s.w.$('cv');
  assert.match(cv.querySelector('#cx-overview .cx-biz').textContent, /How it is used in business/);
  assert.equal(cv.querySelectorAll('#cx-capstones .cap-card').length, 5);
  assert.match(cv.querySelector('#cx-careers').textContent, /Data Analyst.*LPA/);
  assert.ok(s.w.cf(13).jobs.map((i) => s.w.JOBS[i][0]).includes('Data Analyst Intern'));
  assert.deepEqual(s.errors, []);
  s.open(); await sleep(30);
  await s.ask('Tell me about the data analytics course');
  assert.match(s.lastText(), /Advanced Data Analytics using Python/);
  assert.ok(s.w.rolesFor('Can I become a data analyst?', [13]).some((r) => r.role == 'Data Analyst'));
});

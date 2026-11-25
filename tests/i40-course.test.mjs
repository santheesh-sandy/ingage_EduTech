// Industry 4.0 & 5.0 (course 14): 26 decks + 10 task videos from S3, MCQ tests, capstones, careers, jobs, chatbot.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSite, sleep } from './helpers.mjs';

const B = 'https://ingage-lms.s3.ap-south-1.amazonaws.com/Industry+4.0+%26+5.0/';

test('the Industry 4.0 & 5.0 course is open with 10 modules, 26 decks, 10 task videos and an MCQ test per module', async () => {
  const s = await loadSite();
  const c = s.w.cf(14);
  assert.equal(c.t, 'Industry 4.0 & 5.0');
  assert.ok(!c.soon && !c.hid && s.w.cxVis().includes(c));
  assert.match(c.img, /^data:image\/jpeg;base64,/, 'course picture');
  const ms = s.w.mods(c), all = ms.flatMap((m) => m.ls);
  assert.equal(ms.length, 10);
  const decks = all.filter((l) => l.cx && l.cx.ty == 'doc').map((l) => l.cx.url);
  assert.deepEqual([...ms.map((m) => m.ls.filter((l) => l.cx && l.cx.ty == 'doc').length)], [2, 3, 3, 3, 3, 3, 2, 2, 2, 3]);
  assert.equal(new Set(decks).size, 26);
  assert.equal(decks[0], B + 'Slides/Module_01_Industry40_Course_Intro_Careers_and_Applications_Part1.pptx');
  const vids = all.filter((l) => l.cx && l.cx.ty == 'video');
  assert.equal(vids.length, 10);
  assert.equal(vids[0].cx.url, B + 'Videos/sub+-Task+1+-+Smart+Room+Light+Controller.mp4');
  assert.deepEqual([...vids.map((l) => +l.t.match(/Task (\d+)/)[1])].sort((a, b) => a - b), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const q = ms.flatMap((m) => s.w.QSET[m.ls.at(-1).id]);
  assert.equal(q.length, 50);
  assert.equal(new Set(q.map((x) => x[0])).size, 50);
  for (const [t, o, a] of q) assert.ok(t && o.length == 4 && new Set(o).size == 4 && a >= 0 && a < 4, t);
});

test('Industry 4.0 course page, careers, own jobs, interview questions, and the chatbot routes Industry 4.0 questions here', async () => {
  const s = await loadSite({ chatApi: '' });
  s.w.show(14); await sleep(60);
  const cv = s.w.$('cv');
  assert.match(cv.querySelector('#cx-overview .cx-biz').textContent, /How it is used in business/);
  assert.equal(cv.querySelectorAll('#cx-capstones .cap-card').length, 5);
  assert.match(cv.querySelector('#cx-careers').textContent, /IIoT Engineer \(Junior\).*LPA/);
  const jobs = s.w.cf(14).jobs.map((i) => s.w.JOBS[i][0]);
  assert.ok(jobs.includes('IIoT Intern') && jobs.includes('Junior IIoT Engineer'));
  assert.ok(s.w.PREP_Q[14].length >= 8);
  assert.deepEqual(s.errors, []);
  s.open(); await sleep(30);
  await s.ask('Tell me about the Industry 4.0 course');
  assert.match(s.lastText(), /Industry 4\.0 &amp; 5\.0|Industry 4\.0 & 5\.0/);
  assert.ok(s.w.rolesFor('Can I become an IIoT engineer?', [14]).some((r) => r.role == 'IIoT Engineer (Junior)'));
});

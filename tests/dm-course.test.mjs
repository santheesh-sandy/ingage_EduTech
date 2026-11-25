// Digital Marketing (course 17, 80 hours): 47 decks + 52 Tamil videos, picture, MCQs, capstones, careers, jobs, chatbot.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSite, sleep } from './helpers.mjs';

const B = 'https://ingage-lms.s3.ap-south-1.amazonaws.com/Digital+Marketing/';

test('Digital Marketing is an 80-hour open course with 23 modules, 47 decks, 52 videos, a picture and an MCQ test per module', async () => {
  const s = await loadSite();
  const c = s.w.cf(17);
  assert.equal(c.t, 'Digital Marketing');
  assert.equal(c.h, 80);
  assert.ok(!c.soon && !c.hid && s.w.cxVis().includes(c));
  assert.match(c.img, /^data:image\/jpeg;base64,/, 'course picture');
  assert.match(c.s, /Tamil/, 'says the videos are in Tamil');
  const ms = s.w.mods(c), all = ms.flatMap((m) => m.ls);
  assert.equal(ms.length, 23);
  const decks = all.filter((l) => l.cx && l.cx.ty == 'doc').map((l) => l.cx.url);
  assert.equal(new Set(decks).size, 47);
  assert.ok(decks.includes(B + 'Slides/Module_07_SEO_Introduction_and_Why_SEO_Part2.pptx'));
  const vids = all.filter((l) => l.cx && l.cx.ty == 'video');
  assert.equal(new Set(vids.map((l) => l.cx.url)).size, 52, 'each video once');
  assert.deepEqual([...vids.map((l) => +l.t.match(/^Video (\d+)/)[1])].sort((a, b) => a - b), Array.from({ length: 52 }, (_, i) => i + 1));
  assert.ok(vids.some((l) => l.cx.url == B + 'Videos/37.Social+Media+Auditing+in+Tamil+-+Facebook+Auditing+in+Tamil+-+SWOT+Analysis+in+Tamil.mp4'));
  assert.ok(vids.some((l) => l.cx.url == B + 'Videos/12.mp4'), 'videos 9-25 are numbered files');
  const q = ms.flatMap((m) => s.w.QSET[m.ls.at(-1).id]);
  assert.equal(q.length, 115);
  assert.equal(new Set(q.map((x) => x[0])).size, 115);
  for (const [t, o, a] of q) assert.ok(t && o.length == 4 && new Set(o).size == 4 && a >= 0 && a < 4, t);
});

test('Digital Marketing page, careers, own jobs; the chatbot now offers it instead of saying marketing is not offered', async () => {
  const s = await loadSite({ chatApi: '' });
  s.w.show(17); await sleep(60);
  const cv = s.w.$('cv');
  assert.match(cv.querySelector('#cx-overview .cx-biz').textContent, /How it is used in business/);
  assert.equal(cv.querySelectorAll('#cx-capstones .cap-card').length, 5);
  assert.match(cv.querySelector('#cx-careers').textContent, /Digital Marketing Executive.*LPA/);
  assert.ok(s.w.cf(17).jobs.map((i) => s.w.JOBS[i][0]).includes('SEO Analyst'));
  assert.ok(s.w.PREP_Q[17].length >= 8);
  assert.deepEqual(s.errors, []);
  s.open(); await sleep(30);
  await s.ask('Tell me about the digital marketing course');
  assert.match(s.lastText(), /Digital Marketing/);
  assert.doesNotMatch(s.lastText(), /don’t offer|don't offer/);
  assert.ok(s.w.rolesFor('Can I become an SEO analyst?', [17]).some((r) => r.role == 'SEO Analyst'));
});

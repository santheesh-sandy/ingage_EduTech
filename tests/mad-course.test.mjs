// Mobile App Development (course 7): 20 slide decks and 10 videos from S3, one MCQ test per module.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSite, sleep } from './helpers.mjs';

const EMAIL = 'mad@test.in';
const B = 'https://ingage-lms.s3.ap-south-1.amazonaws.com/Mobile+App+Development/';
const lessons = (w) => w.mods(w.cf(7)).flatMap((m) => m.ls);
async function learner(done = []) {
  const s = await loadSite({ storage: { sf_enr: JSON.stringify({ [EMAIL]: { 7: { txn: 'T', inv: 'I', date: '21/11/2026', amt: 4999, list: 4999, pm: 'UPI', done } } }) } });
  s.w.US = { email: EMAIL, name: 'M', role: 's' };
  s.w.LC = 7; s.w.location.hash = '#learn'; await sleep(60);
  return s;
}

test('Mobile App Development is an open course with 10 modules: 2 decks, a Day video and an MCQ test each', async () => {
  const s = await loadSite();
  const c = s.w.cf(7);
  assert.equal(c.t, 'Mobile App Development');
  assert.ok(!c.soon && !c.hid, 'open for enrollment');
  assert.ok(s.w.cxVis().includes(c), 'listed on the courses page');
  const ms = s.w.mods(c);
  assert.equal(ms.length, 10);
  for (const [i, m] of ms.entries()) {
    const kinds = [...m.ls.map((l) => (l.qz ? 'Q' : l.cx.ty == 'doc' ? 'D' : 'V'))];
    assert.deepEqual(kinds, ['D', 'D', 'V', 'Q'], m.t);
    assert.equal(m.ls[2].cx.url, B + 'Videos/' + (i < 4 ? 'Day' + (i + 1) : 'Day+' + (i + 1)) + '.mp4', m.t + ' video');
    const qs = s.w.QSET[m.ls[3].id];
    assert.equal(qs.length, 5, m.t);
    for (const [t, o, a] of qs) {
      assert.ok(t && o.length == 4 && new Set(o).size == 4, t);
      assert.ok(Number.isInteger(a) && a >= 0 && a < 4, t);
    }
  }
  const decks = lessons(s.w).filter((l) => l.cx && l.cx.ty == 'doc');
  assert.equal(decks.length, 20);
  assert.equal(new Set(decks.map((l) => l.cx.url)).size, 20, 'no deck repeated');
  assert.equal(decks[0].cx.url, B + 'Slides/Module-01_Session-1_Mobile-App-Development-Basics-and-Frameworks.pptx');
  for (const l of decks) assert.match(l.cx.url, /^https:\/\/ingage-lms\.s3\.ap-south-1\.amazonaws\.com\/Mobile\+App\+Development\/Slides\/Module-\d\d_Session-\d_[\w-]+\.pptx$/);
  assert.doesNotMatch(decks.map((l) => l.t).join('|'), /COPY|repeat-of|Day-6/, 'titles are clean');
  const qText = ms.flatMap((m) => s.w.QSET[m.ls[3].id].map((q) => q[0]));
  assert.equal(new Set(qText).size, 50, 'no question repeated across modules');
});

test('the course page shows all sections, careers with pay, and the full syllabus', async () => {
  const s = await loadSite();
  s.w.show(7); await sleep(60);
  const cv = s.w.$('cv');
  assert.match(cv.textContent, /Mobile App Development/);
  assert.equal(cv.querySelectorAll('#syl .syl-m').length, 10);
  assert.match(cv.querySelector('#cx-careers').textContent, /Flutter Developer.*LPA/);
  assert.ok(cv.querySelectorAll('#cx-learn .cx-chips.tech span').length >= 5);
  assert.deepEqual(s.errors, []);
});

test('a learner sees the first deck from S3 and plays the Day 1 video in the site player', async () => {
  const s0 = await loadSite();
  const m1 = s0.w.mods(s0.w.cf(7))[0].ls;
  const s = await learner(m1.slice(0, 2).map((l) => l.id));
  s.w.LS = m1[0].id; s.w.renderLearn(); await sleep(20);
  assert.equal(s.w.$('lw').querySelector('.pv iframe').getAttribute('src'),
    'https://view.officeapps.live.com/op/embed.aspx?src=' + encodeURIComponent(B + 'Slides/Module-01_Session-1_Mobile-App-Development-Basics-and-Frameworks.pptx') + '&wdDownloadButton=False&wdPrint=0');
  s.w.LS = m1[2].id; s.w.renderLearn(); await sleep(20);
  const v = s.w.$('lw').querySelector('video.uv');
  assert.equal(v.getAttribute('src'), B + 'Videos/Day1.mp4');
  v.dispatchEvent(new s.w.Event('ended')); await sleep(20);
  assert.ok(s.w.enr()[EMAIL][7].done.includes(m1[2].id), 'finishing the video completes the step');
  assert.deepEqual(s.errors, []);
});

test('the chatbot knows the course and its career roles', async () => {
  const s = await loadSite();
  const r = s.w.rolesFor('Can I become a Flutter developer?', [7]);
  assert.ok(r.some((x) => x.role == 'Flutter Developer' && x.course == 7));
});

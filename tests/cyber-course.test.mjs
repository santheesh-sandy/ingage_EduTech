// Cyber Security Essentials (course 6): slide and video lessons from S3 and one MCQ test per module.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSite, sleep } from './helpers.mjs';

const EMAIL = 'cyber@test.in';
const S3 = 'https://ingage-lms.s3.ap-south-1.amazonaws.com/Cyber+Security+Essentials/Slides/';
const V3 = 'https://ingage-lms.s3.ap-south-1.amazonaws.com/Cyber+Security+Essentials/Videos/';
const lessons = (w) => w.mods(w.cf(6)).flatMap((m) => m.ls);
async function learner(done = []) {
  const s = await loadSite({ storage: { sf_enr: JSON.stringify({ [EMAIL]: { 6: { txn: 'T', inv: 'I', date: '21/11/2026', amt: 4999, list: 4999, pm: 'UPI', done } } }) } });
  s.w.US = { email: EMAIL, name: 'C', role: 's' };
  s.w.LC = 6; s.w.location.hash = '#learn'; await sleep(60);
  return s;
}

test('the course is open, 60 hours, with 10 modules, 26 decks, 18 videos and 10 MCQ tests', async () => {
  const s = await loadSite();
  const c = s.w.cf(6);
  assert.equal(c.t, 'Cyber Security Essentials');
  assert.ok(!c.soon, 'open for enrollment');
  assert.equal(c.h, 60);
  const ms = s.w.mods(c);
  assert.equal(ms.length, 10);
  assert.deepEqual([...ms.map((m) => m.ls.filter((l) => l.cx && l.cx.ty == 'doc').length)], [3, 2, 3, 2, 3, 3, 3, 2, 3, 2]);
  assert.deepEqual([...ms.map((m) => m.ls.filter((l) => l.cx && l.cx.ty == 'video').length)], [1, 1, 8, 1, 2, 1, 1, 1, 1, 1]);
  const decks = lessons(s.w).filter((l) => l.cx && l.cx.ty == 'doc');
  assert.equal(decks.length, 26);
  for (const l of decks) {
    assert.equal(l.cx.ty, 'doc');
    assert.match(l.cx.url, new RegExp('^' + S3.replace(/[.+]/g, '\\$&') + 'Module-\\d\\d_Session-\\d_[\\w-]+\\.pptx$'), l.t);
    assert.match(l.m, /Slides .* · \d+ slides/);
  }
  assert.equal(new Set(decks.map((l) => l.cx.url)).size, 26, 'no deck repeated');
  assert.equal(decks[0].cx.url, S3 + 'Module-01_Session-1_Cyber-Foundations-Careers-and-DigiLocker.pptx');
  for (const m of ms) {
    const q = m.ls.at(-1);
    assert.ok(q.qz, m.t + ' ends with an MCQ test');
    const qs = s.w.QSET[q.id];
    assert.equal(qs.length, 5, m.t);
    for (const [t, o, a] of qs) {
      assert.ok(t && o.length == 4 && o.every(Boolean), t);
      assert.ok(Number.isInteger(a) && a >= 0 && a < 4, t);
      assert.equal(new Set(o).size, 4, 'options differ: ' + t);
    }
  }
});

test('a learner sees the first deck in the slide viewer, from S3', async () => {
  const s = await learner();
  const l = lessons(s.w)[0];
  s.w.LS = l.id; s.w.renderLearn(); await sleep(20);
  const f = s.w.$('lw').querySelector('.pv iframe');
  assert.equal(f.getAttribute('src'), 'https://view.officeapps.live.com/op/embed.aspx?src=' + encodeURIComponent(S3 + 'Module-01_Session-1_Cyber-Foundations-Careers-and-DigiLocker.pptx?v=' + s.w.DECK_V) + '&wdDownloadButton=False&wdPrint=0');
  assert.ok(!s.w.$('lw').querySelector('a[href*=".pptx"]'), 'no link to the raw PPTX (view only)');
  assert.match(s.w.$('lw').querySelector('.pvb button').textContent, /Full screen/);
  assert.deepEqual(s.errors, []);
});

test('the module 1 MCQ test shows its 5 questions once the decks are done', async () => {
  const s0 = await loadSite();
  const m1 = s0.w.mods(s0.w.cf(6))[0].ls;
  const s = await learner(m1.slice(0, -1).map((l) => l.id));
  s.w.LS = m1.at(-1).id; s.w.renderLearn(); await sleep(20);
  const lw = s.w.$('lw');
  assert.match(lw.textContent, /DigiLocker/);
  assert.equal(lw.querySelectorAll('input[type=radio]').length, 20, '5 questions × 4 options');
  assert.deepEqual(s.errors, []);
});

test('the 18 videos load from S3, numbered 1–18, each right after its slide deck', async () => {
  const s = await loadSite();
  const ms = s.w.mods(s.w.cf(6)), vids = lessons(s.w).filter((l) => l.cx && l.cx.ty == 'video');
  assert.equal(vids.length, 18);
  assert.deepEqual([...vids.map((l) => +l.t.match(/^Video (\d+):/)[1])].sort((a, b) => a - b), Array.from({ length: 18 }, (_, i) => i + 1));
  for (const l of vids) assert.ok(l.cx.url.startsWith(V3) && l.cx.url.endsWith('.mp4'), l.t);
  const v = (n) => vids.find((l) => l.t.startsWith('Video ' + n + ':')).cx.url;
  assert.equal(v(9), V3 + '9.Static+continue+and+Dynamic+routing.mp4', 'same address as the uploaded file');
  assert.equal(v(2), V3 + '2.+Credential+Vault+%26+Risk+Assessment.mp4');
  assert.equal(v(18), V3 + '18.Integrated+Incident+Response+(Capstone).mp4');
  // order inside module 3: deck 1, videos 3-5, deck 2, videos 6-9, deck 3, video 10, MCQ
  assert.deepEqual([...ms[2].ls.map((l) => l.qz ? 'Q' : l.cx.ty == 'doc' ? 'D' : l.t.match(/^Video (\d+)/)[1])], ['D', '3', '4', '5', 'D', '6', '7', '8', '9', 'D', '10', 'Q']);
  assert.match(ms[9].ls.at(-2).t, /Video 18: Integrated incident response \(capstone\)/);
});

test('a video lesson plays the S3 file in the site player; finishing it completes the step; a missing file shows a note', async () => {
  const s0 = await loadSite();
  const m1 = s0.w.mods(s0.w.cf(6))[0].ls, vi = m1.findIndex((l) => l.cx && l.cx.ty == 'video');
  const s = await learner(m1.slice(0, vi).map((l) => l.id));
  s.w.LS = m1[vi].id; s.w.renderLearn(); await sleep(20);
  const v = s.w.$('lw').querySelector('video.uv');
  assert.equal(v.getAttribute('src'), V3 + '1.+Phishing+Threat+Intelligence.mp4', 'not rewritten by the IT Network media code');
  v.dispatchEvent(new s.w.Event('ended')); await sleep(20);
  assert.ok(s.w.enr()[EMAIL][6].done.includes(m1[vi].id), 'marked complete');
  s.w.LS = m1[vi].id; s.w.renderLearn(); await sleep(20);
  s.w.$('lw').querySelector('video.uv').dispatchEvent(new s.w.Event('error'));
  assert.match(s.w.$('lw').textContent, /This video is not available yet/);
  assert.deepEqual(s.errors, []);
});

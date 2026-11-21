// EV Technology (course 8) and capstone projects for every course (own projects, or built from the course's modules).
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSite, sleep } from './helpers.mjs';

const B = 'https://ingage-lms.s3.ap-south-1.amazonaws.com/EV+Technology/';
const EMAIL = 'ev@test.in';

test('EV Technology is an open course: 6 modules, 14 decks, 10 videos in order, an MCQ test per module', async () => {
  const s = await loadSite();
  const c = s.w.cf(8);
  assert.equal(c.t, 'EV Technology');
  assert.ok(!c.soon && !c.hid && s.w.cxVis().includes(c));
  const ms = s.w.mods(c), all = ms.flatMap((m) => m.ls);
  assert.equal(ms.length, 6);
  const decks = all.filter((l) => l.cx && l.cx.ty == 'doc'), vids = all.filter((l) => l.cx && l.cx.ty == 'video');
  assert.deepEqual([...ms.map((m) => m.ls.filter((l) => l.cx && l.cx.ty == 'doc').length)], [3, 3, 2, 2, 2, 2]);
  assert.equal(decks.length, 14);
  assert.equal(decks[0].cx.url, B + 'Slides/Module-01_Session-1_Overview-of-EVs-Types-and-Industry.pptx');
  assert.deepEqual([...vids.map((l) => l.t)], Array.from({ length: 10 }, (_, i) => 'Video: Part ' + (i + 1)), 'parts 1-10 in order');
  assert.equal(vids[0].cx.url, B + 'Videos/LMS+-+EV+-+Part+1.mp4');
  assert.deepEqual([...ms.map((m) => m.ls.filter((l) => l.cx && l.cx.ty == 'video').length)], [2, 2, 2, 2, 1, 1]);
  for (const m of ms) {
    const q = m.ls.at(-1); assert.ok(q.qz, m.t);
    const qs = s.w.QSET[q.id]; assert.equal(qs.length, 5);
    for (const [t, o, a] of qs) assert.ok(t && o.length == 4 && new Set(o).size == 4 && a >= 0 && a < 4, t);
  }
  s.w.show(8); await sleep(60);
  assert.match(s.w.$('cv').querySelector('#cx-careers').textContent, /EV Service Technician.*LPA/);
  assert.deepEqual(s.errors, []);
});

test('Cyber Security, Mobile App Development and EV Technology each have 5 written capstone projects', async () => {
  const s = await loadSite();
  for (const i of [6, 7, 8]) {
    const c = s.w.cf(i), L = s.w.capList(i), N = s.w.modsAll(c).length;
    assert.equal(L.length, 5, c.t);
    assert.ok(L.every((p) => !/^auto/.test(p.id)), c.t + ': written, not generated');
    for (const p of L) {
      assert.equal(p.out.length, 3, p.t);
      assert.ok(p.mods.length >= 2 && p.mods.every((n) => n >= 1 && n <= N), p.t + ': valid modules');
    }
    s.w.show(i); await sleep(40);
    assert.equal(s.w.$('cx-capstones').querySelectorAll('.cap-card').length, 5, c.t + ' course page');
  }
});

test('a chosen capstone limits My Learning to its modules, ending with the project (EV, BMS project)', async () => {
  const s = await loadSite({ storage: { sf_enr: JSON.stringify({ [EMAIL]: { 8: { txn: 'T', inv: 'I', date: '21/11/2026', amt: 4999, list: 4999, pm: 'UPI', done: [], cap: 'bms' } } }) } });
  s.w.US = { email: EMAIL, name: 'E', role: 's' };
  const ms = s.w.mods(s.w.cf(8));
  assert.deepEqual([...ms.map((m) => m.t)], [
    'Module 1: EV basics, motors, power electronics and batteries',
    'Module 5: Battery management systems: fundamentals and hardware',
    'Module 6: BMS thermal management, balancing and communication',
    'Capstone project: BMS monitor: SOC, safety limits and balancing']);
  s.w.LC = 8; s.w.location.hash = '#learn'; await sleep(80);
  assert.match(s.w.$('lw').querySelector('.cap-head').textContent, /BMS monitor/);
  assert.deepEqual(s.errors, []);
});

test('a course added later without its own capstones gets projects built from its modules', async () => {
  const s = await loadSite();
  const mod = (u, t) => ({ u, t, ls: [{ u: u + 'a', ty: 'video', t: 'Intro', du: '', url: 'https://example.test/v.mp4', tx: '' }], qs: [] });
  s.w.C.push({ i: 99, d: 'Data', e: '📈', t: 'Data Analytics', h: 30, f: 4999, s: 'x', l: [], o: [], k: ['Excel', 'SQL', 'Power BI'],
    cur: [mod('a', 'Spreadsheets'), mod('b', 'SQL basics'), mod('c', 'Dashboards'), mod('d', 'Statistics')] });
  const L = s.w.capList(99);
  assert.equal(L.length, 3, 'one per module after the first (max 5)');
  assert.deepEqual([...L.map((p) => p.t)], ['Project: SQL basics', 'Project: Dashboards', 'Project: Statistics']);
  // module 1 + the module before the focus + the focus module
  assert.deepEqual([...L[0].mods], [1, 2]);
  assert.deepEqual([...L[2].mods], [1, 3, 4]);
  assert.ok(L.every((p) => p.out.length == 3 && p.steps.length == 5));
  // and the learning path works with it
  const P = s.w.capPath(s.w.cf(99), L[1]);
  assert.deepEqual([...P.map((m) => m.t)], ['Module 1: Spreadsheets', 'Module 2: SQL basics', 'Module 3: Dashboards', 'Capstone project: Project: Dashboards']);
  // a course with a single module has none
  s.w.C.push({ i: 98, d: 'X', e: '🧪', t: 'One module', h: 5, f: 999, s: 'x', l: [], o: [], k: [], cur: [mod('z', 'Only')] });
  assert.equal(s.w.capList(98).length, 0);
});

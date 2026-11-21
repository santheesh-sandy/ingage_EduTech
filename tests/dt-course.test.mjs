// Digital Twin (course 5): 23 slide decks and 11 videos from S3 (folder Digital_Twin), one MCQ test per module, 5 capstones.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSite, sleep } from './helpers.mjs';

const B = 'https://ingage-lms.s3.ap-south-1.amazonaws.com/Digital_Twin/';

test('Digital Twin is open with 11 modules, 23 decks, 11 videos and an MCQ test per module', async () => {
  const s = await loadSite();
  const c = s.w.cf(5);
  assert.equal(c.t, 'Digital Twin');
  assert.ok(!c.soon && !c.hid && s.w.cxVis().includes(c), 'open for enrollment');
  const ms = s.w.mods(c), all = ms.flatMap((m) => m.ls);
  assert.equal(ms.length, 11);
  assert.deepEqual([...ms.map((m) => m.ls.filter((l) => l.cx && l.cx.ty == 'doc').length)], [2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2]);
  const decks = all.filter((l) => l.cx && l.cx.ty == 'doc'), vids = all.filter((l) => l.cx && l.cx.ty == 'video');
  assert.equal(decks.length, 23);
  assert.equal(new Set(decks.map((l) => l.cx.url)).size, 23);
  assert.equal(decks[0].cx.url, B + 'Slides/Module-01_Session-1_Introduction-to-Digital-Twin.pptx');
  assert.equal(vids.length, 11);
  // exact S3 name, including the double space the file was uploaded with
  assert.ok(vids.some((l) => l.cx.url == B + 'Videos/Video+2+-++Thingspeak+Creating+Account.mp4'));
  assert.deepEqual([...ms.map((m) => m.ls.filter((l) => l.cx && l.cx.ty == 'video').length)], [0, 1, 0, 2, 1, 1, 4, 0, 1, 1, 0]);
  // module 7: deck 1, Unity installation, deck 2, Oculus, deck 3, Unity part 1 + 2, MCQ
  assert.deepEqual([...ms[6].ls.map((l) => (l.qz ? 'Q' : l.cx.ty == 'doc' ? 'D' : l.t))],
    ['D', 'Video 7: Unity installation', 'D', 'Video 10: Oculus', 'D', 'Video 8: Unity (part 1)', 'Video 8: Unity (part 2)', 'Q']);
  for (const m of ms) {
    const qs = s.w.QSET[m.ls.at(-1).id];
    assert.equal(qs.length, 5, m.t);
    for (const [t, o, a] of qs) assert.ok(t && o.length == 4 && new Set(o).size == 4 && a >= 0 && a < 4, t);
  }
  const q = ms.flatMap((m) => s.w.QSET[m.ls.at(-1).id].map((x) => x[0]));
  assert.equal(new Set(q).size, 55, 'no question repeated');
});

test('Digital Twin has 5 written capstones and its career roles are open', async () => {
  const s = await loadSite();
  const L = s.w.capList(5);
  assert.equal(L.length, 5);
  assert.ok(L.every((p) => !/^auto/.test(p.id) && p.mods.every((n) => n >= 1 && n <= 11)));
  s.w.show(5); await sleep(60);
  assert.equal(s.w.$('cx-capstones').querySelectorAll('.cap-card').length, 5);
  assert.ok(s.w.$('cv').querySelector('button[onclick^="enroll(5)"], .btn.pb'), 'enroll button shown');
  const dte = s.w.ROLE_MAP.roles.find((r) => r.role == 'Digital Twin Engineer');
  assert.ok(!dte.notOpen && /ThingSpeak/.test(dte.covers.join(' ')));
  assert.deepEqual(s.errors, []);
});

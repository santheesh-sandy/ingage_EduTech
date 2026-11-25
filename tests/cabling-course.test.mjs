// Information Network Cabling (course 11): 39 decks + 19 videos from S3, MCQ tests, capstones, careers, chatbot.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSite, sleep } from './helpers.mjs';

const B = 'https://ingage-lms.s3.ap-south-1.amazonaws.com/Information+Network+Cabling/';

test('the cabling course is open with 15 modules, 39 decks, 19 videos and an MCQ test per module', async () => {
  const s = await loadSite();
  const c = s.w.cf(11);
  assert.equal(c.t, 'Information Network Cabling');
  assert.ok(!c.soon && !c.hid && s.w.cxVis().includes(c));
  const ms = s.w.mods(c), all = ms.flatMap((m) => m.ls);
  assert.equal(ms.length, 15);
  const decks = all.filter((l) => l.cx && l.cx.ty == 'doc').map((l) => l.cx.url);
  assert.deepEqual([...ms.map((m) => m.ls.filter((l) => l.cx && l.cx.ty == 'doc').length)], [3, 3, 2, 2, 3, 3, 3, 2, 3, 3, 3, 2, 3, 2, 2]);
  assert.equal(new Set(decks).size, 39);
  assert.equal(decks[0], B + 'Slides/Module_01_Introduction_to_Information_Network_Cabling_Careers_Part1.pptx');
  const vids = all.filter((l) => l.cx && l.cx.ty == 'video').map((l) => l.cx.url);
  assert.equal(new Set(vids).size, 19);
  assert.ok(vids.includes(B + 'Videos/Video+1+_+Introduction+to+Draw+io.mp4'));
  assert.ok(vids.includes(B + 'Videos/Hardware/Cable+Fault+Identification+%26+Testing.mp4'), 'hardware videos keep their sub-folder');
  const q = ms.flatMap((m) => s.w.QSET[m.ls.at(-1).id]);
  assert.equal(q.length, 75);
  assert.equal(new Set(q.map((x) => x[0])).size, 75);
  for (const [t, o, a] of q) assert.ok(t && o.length == 4 && new Set(o).size == 4 && a >= 0 && a < 4, t);
});

test('cabling course page: overview, 5 capstones, careers with pay; the chatbot routes cabling questions here', async () => {
  const s = await loadSite({ chatApi: '' });
  s.w.show(11); await sleep(60);
  const cv = s.w.$('cv');
  assert.match(cv.querySelector('#cx-overview .cx-biz').textContent, /How it is used in business/);
  assert.equal(cv.querySelectorAll('#cx-capstones .cap-card').length, 5);
  assert.match(cv.querySelector('#cx-careers').textContent, /Network Cabling Technician.*LPA/);
  assert.deepEqual(s.errors, []);
  s.open(); await sleep(30);
  await s.ask('Tell me about the network cabling course');
  assert.match(s.lastText(), /Information Network Cabling/);
  assert.ok(s.w.rolesFor('Can I become a network cabling technician?', [11]).some((r) => r.role == 'Network Cabling Technician'));
});

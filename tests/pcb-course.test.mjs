// PCB Design & Testing (course 2, replaced "3D Modeling with LiDAR"): 20 decks + 20 videos from S3, MCQ tests, capstones.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSite, sleep } from './helpers.mjs';

const B = 'https://ingage-lms.s3.ap-south-1.amazonaws.com/PCB+Design/';

test('PCB Design & Testing replaces 3D Modeling with LiDAR and is open', async () => {
  const s = await loadSite();
  const c = s.w.cf(2);
  assert.equal(c.t, 'PCB Design & Testing');
  assert.ok(!c.soon && !c.hid && s.w.cxVis().includes(c));
  assert.match(c.img, /^data:image\/jpeg;base64,/);
  assert.ok(!s.w.C.some((x) => x.t == '3D Modeling with LiDAR'), 'old course gone');
  assert.ok(s.w.cf(3) && /Terrain LiDAR/.test(s.w.cf(3).t), 'Terrain LiDAR stays');
});

test('10 modules, each deck followed by its video (circuits series, then the KiCad series), and an MCQ test', async () => {
  const s = await loadSite();
  const ms = s.w.mods(s.w.cf(2));
  assert.equal(ms.length, 10);
  for (const m of ms) assert.deepEqual([...m.ls.map((l) => (l.qz ? 'Q' : l.cx.ty == 'doc' ? 'D' : 'V'))], ['D', 'V', 'D', 'V', 'Q'], m.t);
  const vids = ms.flatMap((m) => m.ls.filter((l) => l.cx && l.cx.ty == 'video').map((l) => l.cx.url));
  assert.equal(vids.length, 20);
  assert.equal(vids[0], B + 'Videos/1.+PCB+Design+%26+Testing+-+Tinkercad+Introduction.mp4', 'same address as the uploaded file');
  assert.equal(vids[10], B + 'Videos/Kicad/1.+Tinkercad+to+Kicad+with+Example.mp4', 'KiCad series is in the Kicad folder');
  assert.ok(vids.slice(0, 10).every((u) => !u.includes('/Kicad/')) && vids.slice(10).every((u) => u.includes('/Videos/Kicad/')));
  const decks = ms.flatMap((m) => m.ls.filter((l) => l.cx && l.cx.ty == 'doc').map((l) => l.cx.url));
  assert.equal(decks[0], B + 'Slides/Module-01_Session-1_Tinkercad-Introduction.pptx');
  assert.equal(new Set(decks).size, 20);
  const q = ms.flatMap((m) => s.w.QSET[m.ls.at(-1).id]);
  assert.equal(q.length, 50);
  assert.equal(new Set(q.map((x) => x[0])).size, 50, 'no question repeated');
  for (const [t, o, a] of q) assert.ok(t && o.length == 4 && new Set(o).size == 4 && a >= 0 && a < 4, t);
});

test('course page: capstones, careers and technologies for PCB design', async () => {
  const s = await loadSite();
  s.w.show(2); await sleep(60);
  const cv = s.w.$('cv');
  assert.equal(cv.querySelectorAll('#cx-capstones .cap-card').length, 5);
  assert.match(cv.querySelector('#cx-careers').textContent, /PCB Design Engineer \(Trainee\).*LPA/);
  assert.match(cv.querySelector('#cx-learn').textContent, /KiCad/);
  assert.doesNotMatch(cv.textContent, /LiDAR|point cloud/i);
  assert.deepEqual(s.errors, []);
});

test('the chatbot sends "pcb" questions to PCB Design and "lidar" to Terrain LiDAR', async () => {
  const s = await loadSite({ chatApi: '' });
  s.open(); await sleep(30);
  assert.match(await s.ask('Tell me about the PCB course').then(() => s.lastText()), /PCB Design & Testing/);
  assert.match(await s.ask('Tell me about lidar').then(() => s.lastText()), /Terrain LiDAR/);
  const r = s.w.rolesFor('Can I become a PCB designer?', [2]);
  assert.ok(r.some((x) => x.role == 'PCB Design Engineer (Trainee)' && !x.notOpen));
});

// Data Warehousing (course 22): 25 decks + 14 videos from S3 (videos 8 and 13 are copies of 3 and 6, used as backups),
// picture, MCQ tests, capstones, careers, jobs, interview prep, chatbot.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSite, sleep } from './helpers.mjs';

const B = 'https://ingage-lms.s3.ap-south-1.amazonaws.com/Data+Warehousing/';

test('Data Warehousing is open with 10 modules, 25 decks, 14 videos, a picture and an MCQ test per module', async () => {
  const s = await loadSite();
  const c = s.w.cf(22);
  assert.equal(c.t, 'Data Warehousing');
  assert.ok(!c.soon && !c.hid && s.w.cxVis().includes(c));
  assert.match(c.img, /^data:image\/jpeg;base64,/, 'course picture');
  const ms = s.w.mods(c), all = ms.flatMap((m) => m.ls);
  assert.equal(ms.length, 10);
  const decks = all.filter((l) => l.cx && l.cx.ty == 'doc').map((l) => l.cx.url);
  assert.deepEqual([...ms.map((m) => m.ls.filter((l) => l.cx && l.cx.ty == 'doc').length)], [3, 3, 2, 2, 2, 3, 3, 2, 3, 2]);
  assert.equal(new Set(decks).size, 25);
  assert.equal(decks[0], B + 'Slides/Module_01_Data_Warehouse_Introduction_and_Characteristics_Part1.pptx');
  const vl = all.filter((l) => l.cx && l.cx.ty == 'video'), vids = vl.map((l) => l.cx.url);
  assert.equal(new Set(vids).size, 14);
  assert.deepEqual([...ms.map((m) => m.ls.filter((l) => l.cx && l.cx.ty == 'video').length)], [2, 1, 2, 2, 0, 2, 1, 1, 1, 2]);
  assert.equal(vids[0], B + 'Videos/1.Data+Lake+VS+Data+Warehouse+VS+Data+Marts+_+CodeLearnX.mp4');
  assert.ok(vids.includes(B + 'Videos/16.System%2BManagers%2Bin%2BData%2BWarehousing%2B_%2BLecture%2B%2315%2B_%2BData%2BWarehouse%2BTutorial%2BGiveFastLink.mp4'), '+ and # in the name are encoded');
  assert.ok(!vids.some((u) => /Videos\/(8|13)\./.test(u)), 'duplicate copies are not listed as lessons');
  assert.equal(vl.filter((l) => l.cx.alt).length, 2, 'two videos have a backup copy');
  assert.ok(!vl.some((l) => /Y2meta|GiveFastLink|CodeLearnX/.test(l.t)), 'clean video titles');
  const q = ms.flatMap((m) => s.w.QSET[m.ls.at(-1).id]);
  assert.equal(q.length, 50);
  assert.equal(new Set(q.map((x) => x[0])).size, 50);
  for (const [t, o, a] of q) assert.ok(t && o.length == 4 && new Set(o).size == 4 && a >= 0 && a < 4, t);
});

test('Data Warehousing page, capstones, careers, jobs, interview prep; the chatbot routes data warehouse questions here', async () => {
  const s = await loadSite({ chatApi: '' });
  s.w.show(22); await sleep(60);
  const cv = s.w.$('cv');
  assert.match(cv.querySelector('#cx-overview .cx-biz').textContent, /How it is used in business/);
  assert.equal(cv.querySelectorAll('#cx-capstones .cap-card').length, 5);
  assert.match(cv.querySelector('#cx-careers').textContent, /Junior Data Engineer.*LPA/);
  assert.doesNotMatch(cv.textContent, /Coming soon|BigQuery|Redshift|Tableau/);
  assert.ok(s.w.cf(22).jobs.length == 2);
  assert.ok(s.w.PREP_Q[22].length >= 8);
  assert.deepEqual(s.errors, []);
  assert.ok(s.w.rolesFor('Can I become a BI developer?', [22]).some((r) => r.role == 'BI Developer' && !r.notOpen));
  s.open(); await sleep(30);
  await s.ask('Tell me about the data warehousing course');
  assert.match(s.lastText(), /Data Warehousing/);
});

// A course added in the future (code or admin editor) reaches the chatbot with no chatbot changes:
// course list, syllabus, capstones, course material and draft career roles all come from the course itself.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSite, sleep } from './helpers.mjs';
import { systemPrompt } from '../supabase/functions/_shared/chat-core.js';

const mod = (u, t, lesson) => ({ u, t, ls: [{ u: u + 'r', ty: 'read', t: lesson, du: '', url: '', tx: lesson + ' explained: pivot tables summarise large data quickly.' }], qs: [] });
const NEW = { i: 50, d: 'Data', e: '📈', t: 'Data Analytics with Excel', h: 30, f: 3999, s: 'Turn raw data into reports and dashboards.',
  l: ['Clean data in Excel.', 'Build pivot tables.', 'Make dashboards.'], o: ['Build a sales dashboard.'], k: ['Excel', 'Pivot tables', 'Dashboards'],
  jr: ['Junior Data Analyst', 'MIS Executive'], ind: ['Retail', 'Banking'], pre: ['Basic computer skills'],
  cur: [mod('a', 'Excel basics', 'Cells and formulas'), mod('b', 'Pivot tables', 'Pivot tables'), mod('c', 'Dashboards', 'Charts and slicers')] };

async function siteWithNewCourse() {
  const s = await loadSite();
  s.w.C.push(Object.assign({}, NEW));
  return s;
}

test('a new course is sent to the AI with its syllabus, capstones, roles and material', async () => {
  const s = await siteWithNewCourse();
  s.w.show(50); await sleep(60);
  s.open(); await sleep(30);
  await s.ask('What will I learn about pivot tables in this course?');
  const body = s.calls.at(-1).body;
  const c = body.courses.find((x) => x.title == 'Data Analytics with Excel');
  assert.ok(c, 'in the course list');
  assert.equal(c.status, 'open');
  assert.deepEqual([...c.syllabus], ['Module 1: Excel basics', 'Module 2: Pivot tables', 'Module 3: Dashboards']);
  assert.equal(c.capstones.length, 2, 'auto capstones (one per module after the first)');
  assert.deepEqual([...c.jobRoles], ['Junior Data Analyst', 'MIS Executive']);
  assert.ok(body.courses.find((x) => x.title == 'EV Technology').capstones.includes('BMS monitor: SOC, safety limits and balancing'), 'written capstones too');
  assert.equal(body.course.title, 'Data Analytics with Excel', 'course in focus');
  assert.ok(body.courseMaterial && body.courseMaterial.modules.length == 3, 'course material from the curriculum');
  assert.match(body.courseMaterial.relatedSlides.join(' '), /pivot tables summarise/);
  // the server prompt includes it (no redeploy needed for new courses)
  const p = systemPrompt(body);
  assert.match(p, /Data Analytics with Excel/);
  assert.match(p, /always current/);
});

test('career questions about a new course get draft roles built from the course', async () => {
  const s = await siteWithNewCourse();
  const r = s.w.rolesFor('Can I become a Junior Data Analyst?', [50]);
  const a = r.find((x) => x.role == 'Junior Data Analyst');
  assert.ok(a && a.auto && a.course == 50);
  assert.match(a.covers.join(' '), /Pivot tables \(Module 2\)/);
  assert.match(a.gaps, /Not reviewed yet/);
  // hand-written roles win: no draft roles are made for courses that already have some
  assert.ok(!s.w.allRoles().some((x) => x.auto && [1, 6, 7, 8].includes(x.course)));
});

test('Cyber Security is described as open in the role map', async () => {
  const s = await loadSite();
  const soc = s.w.ROLE_MAP.roles.find((r) => r.role == 'SOC Analyst (L1)');
  assert.ok(!soc.notOpen);
  assert.doesNotMatch(JSON.stringify(soc), /not open|not covered by any open/i);
});

// Course page sections (learn, industry relevance, outcomes, careers, placement), progress tracking with
// milestone notifications, internship recommendations, and chatbot answers about progress.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSite, sleep } from './helpers.mjs';

const EMAIL = 'learner@test.in';
const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
const enr = (ci, done = []) => ({ [ci]: { txn: 'T' + ci, inv: 'ING/' + ci, date: '19/11/2026', amt: 4999, list: 4999, pm: 'UPI', done } });
async function learner(courses = { 1: [] }, extra = {}) {
  const e = Object.assign({}, ...Object.entries(courses).map(([ci, d]) => enr(ci, d)));
  const s = await loadSite({ url: 'https://site.test/#home', storage: { sf_enr: JSON.stringify({ [EMAIL]: e }), ...extra } });
  s.w.US = { email: EMAIL, name: 'Test Learner', role: 's' };
  s.w.upd && s.w.upd();
  return s;
}
const lessonIds = (w, ci) => { const f = []; w.mods(w.cf(ci)).forEach((m) => m.ls.forEach((l) => f.push(l.id))); return f; };
const firstN = (w, ci, pct) => lessonIds(w, ci).slice(0, Math.ceil((w.nTot(ci) * pct) / 100));

/* ---------- 2–6: course page sections ---------- */

test('every course page has: learn (skills, technologies, topics), syllabus, industry relevance, outcomes, careers, internship & 100% placement', async () => {
  const s = await loadSite();
  for (const c of s.w.cxVis()) {
    s.w.show(c.i); await sleep(50);
    const cv = s.w.$('cv');
    const ids = [...cv.querySelectorAll('.cx-left > .cx-sec, .cx-left > .syl')].map((e) => e.id);
    assert.deepEqual(ids, ['cx-learn', 'syl', 'cx-industry', 'cx-outcomes', 'cx-careers', 'cx-placement'], `${c.t}: section order`);
    const learn = cv.querySelector('#cx-learn');
    assert.ok(learn.querySelectorAll('.cx-chips span').length >= 6, `${c.t}: skills + technologies`);
    assert.ok(learn.querySelectorAll('.cx-chips.tech span').length >= 5, `${c.t}: technologies`);
    assert.ok(learn.querySelectorAll('.cx-topics li').length >= 4, `${c.t}: topics`);
    const ind = cv.querySelector('#cx-industry');
    assert.ok(text(ind.querySelector('.cx-why')).length > 80, `${c.t}: why it matters`);
    assert.ok(ind.querySelectorAll('.ck li').length >= 4, `${c.t}: real-world applications`);
    assert.equal(ind.querySelectorAll('.cx-chips span').length, c.ind.length, `${c.t}: industries`);
    assert.equal(cv.querySelectorAll('#cx-outcomes .cx-out > div').length, c.o.length);
    const roles = cv.querySelectorAll('#cx-careers .cx-roles > div');
    assert.equal(roles.length, c.jr.length, `${c.t}: job roles`);
    assert.ok(text(cv.querySelector('#cx-careers')).includes('LPA'), `${c.t}: salary shown`);
    const pl = text(cv.querySelector('#cx-placement'));
    assert.match(pl, /100%.*Placement assistance/);
    assert.match(pl, /Internships/);
    assert.match(pl, /not guaranteed|Final selection is made by the hiring company/);
    assert.equal(cv.querySelectorAll('.cx-nav a').length, 6, 'in-page section menu');
    assert.match(text(cv.querySelector('.ip-card')), /100% placement assistance/);
  }
  assert.deepEqual(s.errors, []);
});

test('section menu scrolls to each section', async () => {
  const s = await loadSite();
  s.w.show(1); await sleep(50);
  const seen = [];
  s.w.Element.prototype.scrollIntoView = function () { seen.push(this.id); };
  for (const a of s.w.$('cv').querySelectorAll('.cx-nav a')) a.click();
  assert.deepEqual(seen, ['cx-learn', 'syl', 'cx-industry', 'cx-outcomes', 'cx-careers', 'cx-placement']);
});

/* ---------- 7: progress tracking & milestone notifications ---------- */

test('My Learning shows completion %, milestone markers and badges', async () => {
  const s = await learner({ 1: [] });
  s.w.location.hash = '#learn'; await sleep(80);
  const ids = firstN(s.w, 1, 52);
  const all = JSON.parse(s.w.localStorage.getItem('sf_enr')); all[EMAIL][1].done = ids; s.w.localStorage.setItem('sf_enr', JSON.stringify(all));
  s.w.renderLearn(); await sleep(30);
  const card = s.w.$('pgcard');
  assert.ok(card, 'progress card');
  const pct = s.w.prog(1).pct;
  assert.ok(pct >= 50 && pct < 60, 'pct ' + pct);
  assert.match(text(card.querySelector('.pg-ring')), new RegExp(pct + '%'));
  assert.deepEqual([...card.querySelectorAll('.pg-ms')].map(text), ['30%', '50%', '60%', '80%', '100%']);
  assert.deepEqual([...card.querySelectorAll('.pg-ms.hit')].map(text), ['30%', '50%']);
  // nothing in the card may be hidden by the site's own CSS (e.g. its .ok {display:none} class)
  for (const el of card.querySelectorAll('*')) assert.notEqual(s.w.getComputedStyle(el).display, 'none', 'hidden element: ' + el.className);
  assert.ok(card.querySelectorAll('.rec-list > div').length >= 3, 'eligible internships listed');
  assert.match(text(card), /more to reach 60%/);
  assert.deepEqual(s.errors, []);
});

test('congratulation pops up automatically when crossing 30%, 50% and 60%, once each', async () => {
  const s = await learner({ 1: [] });
  s.w.location.hash = '#learn'; await sleep(80);
  const ids = lessonIds(s.w, 1), shown = [];
  s.w.Swal.isVisible = () => false;
  for (const id of ids) {
    s.w.LC = 1; s.w.mark(id, true); await sleep(5);
    const t = s.w.$('mstoast');
    if (t && t.classList.contains('on')) { shown.push(text(t.querySelector('b'))); s.w.msHide(); }
    if (s.w.prog(1).pct >= 85) break;
  }
  assert.deepEqual(shown, ['Great start! 30%', 'Halfway there! 50%', '60% complete! 60%', 'Almost there! 80%']);
  // not repeated on reload
  s.w.renderLearn(); await sleep(20);
  assert.ok(!s.w.$('mstoast').classList.contains('on'), 'no repeat');
  const saved = JSON.parse(s.w.localStorage.getItem('sf_ms'))[EMAIL][1];
  assert.deepEqual([...saved], [30, 50, 60, 80]);
  assert.deepEqual(s.errors, []);
});

test('progress made earlier is congratulated once when the learner opens My Learning', async () => {
  const s0 = await loadSite();
  const ids = firstN(s0.w, 6, 62);
  const s = await learner({ 6: ids });
  s.w.Swal.isVisible = () => false;
  s.w.LC = 6; s.w.location.hash = '#learn'; await sleep(80);
  const t = s.w.$('mstoast');
  assert.ok(t && t.classList.contains('on'));
  assert.match(text(t), /60% complete! 60%.*Cyber Security Essentials/);
  assert.match(text(t), /Recommended for you: SOC Analyst \(L1\)/, 'mentions the internship recommendations');
});

test('the toast waits while another popup (module unlocked) is open', async () => {
  const s = await learner({ 1: [] });
  s.w.location.hash = '#learn'; await sleep(60);
  let open = true;
  s.w.Swal.isVisible = () => open; s.w.Swal.getPopup = () => ({ classList: { contains: () => false } });
  for (const id of firstN(s.w, 1, 31)) { s.w.LC = 1; s.w.mark(id, true); }
  await sleep(100);
  assert.ok(!(s.w.$('mstoast') && s.w.$('mstoast').classList.contains('on')), 'waiting');
  open = false; await sleep(500);
  assert.ok(s.w.$('mstoast').classList.contains('on'), 'shown after the popup closed');
});

test('course page shows the enrolled learner their progress', async () => {
  const s0 = await loadSite();
  const s = await learner({ 1: firstN(s0.w, 1, 40) });
  s.w.show(1); await sleep(50);
  assert.match(text(s.w.$('cv').querySelector('.pg-mini')), /Your progress: 4\d%/);
});

/* ---------- 8: internship recommendations ---------- */

test('networking: completing a module unlocks its job-board internships, with the next unlock shown', async () => {
  const s = await learner({ 1: [] });
  let R = s.w.recIntern(1);
  assert.equal(R.eligible.length, 0);
  assert.match(R.next.label, /Complete Module 1/);
  const m1 = s.w.mods(s.w.cf(1)).find((m) => m.mi === 0).ls.map((l) => l.id);
  const all = JSON.parse(s.w.localStorage.getItem('sf_enr')); all[EMAIL][1].done = m1; s.w.localStorage.setItem('sf_enr', JSON.stringify(all));
  R = s.w.recIntern(1);
  assert.deepEqual([...R.eligible].map((x) => x.t).sort(), ['IT Help Desk Engineer', 'Network Support Intern', 'Network Technician / Field Engineer']);
  assert.equal(R.eligible[0].t, 'Network Support Intern', 'internships first');
  assert.match(R.next.label, /Module 2/);
});

test('other courses: internship tracks unlock at 30%, 60% and 100%', async () => {
  const s0 = await loadSite();
  const at = async (pct) => { const s = await learner({ 6: firstN(s0.w, 6, pct) }); return s.w.recIntern(6); };
  assert.equal((await at(10)).eligible.length, 0);
  assert.equal((await at(35)).eligible.length, 1);
  assert.equal((await at(65)).eligible.length, 2);
  const done = await at(100);
  assert.equal(done.eligible.length, s0.w.cf(6).jr.length);
  assert.equal(done.next, null);
});

test('recommendations appear in My Learning and on the Internships page', async () => {
  const s0 = await loadSite();
  const s = await learner({ 6: firstN(s0.w, 6, 35) });
  s.w.LC = 6; s.w.location.hash = '#learn'; await sleep(80);
  assert.match(text(s.w.$('pgcard').querySelector('.rec')), /SOC Analyst \(L1\) – internship track.*Next unlock: Reach 60%/);
  s.w.location.hash = '#internship'; await sleep(80);
  assert.match(text(s.w.$('internship').querySelector('.ip-status')), /Cyber Security Essentials · \d+% complete.*SOC Analyst/);
});

/* ---------- 9: chatbot ---------- */

test('chatbot answers "my progress" and "which internships am I eligible for" from the learner data', async () => {
  const s0 = await loadSite();
  const s = await learner({ 1: firstN(s0.w, 1, 55) });
  s.w.LC = 1; s.w.location.hash = '#learn'; await sleep(60);
  s.open(); await sleep(30);
  const n = s.calls.length;
  await s.ask('What is my progress?');
  assert.match(s.lastText(), /IT Network System Administrator: \d+% complete .*Next milestone: 60%/);
  await s.ask('Which internships am I eligible for?');
  assert.match(s.lastText(), /Eligible: .*Network Support Intern/);
  assert.match(s.lastText(), /Next: Complete Module/);
  assert.equal(s.calls.length, n, 'answered without the AI');
  await s.ask('Can you explain how OSPF works compared to RIP in detail?');
  const u = s.calls.at(-1).body.user;
  assert.equal(u.progress[0].course, 'IT Network System Administrator');
  assert.ok(u.progress[0].progressPct >= 50);
  assert.ok(u.progress[0].eligibleInternships.includes('Network Support Intern'), 'AI gets the recommendations');
  assert.deepEqual(s.errors, []);
});

test('chatbot progress topic and internship topic include the learner data', async () => {
  const s = await learner({ 1: [] });
  s.open(); await sleep(30);
  s.w.hTopic('intern'); await sleep(600);
  assert.match(s.lastText(), /No internships unlocked yet.*Next: Complete Module 1/);
  s.w.hTopic('lms'); await sleep(600);
  assert.match(s.lastText(), /0% complete/);
});

test('visitors asking about progress are asked to log in', async () => {
  const s = await loadSite();
  s.open(); await sleep(30);
  await s.ask('Which internships can I get?');
  assert.doesNotMatch(s.lastText(), /Eligible:/);
});

test('the milestone popup lists only internships that were just unlocked', async () => {
  const s = await learner({ 1: [] });
  s.w.location.hash = '#learn'; await sleep(60);
  s.w.Swal.isVisible = () => false;
  const mods = s.w.mods(s.w.cf(1)).filter((m) => m.mi != null);
  // finish modules 1-3 quietly (unlocks their roles, passes 30%), then cross 50% inside module 4/5
  const ids = lessonIds(s.w, 1), before = [];
  for (const id of ids) { s.w.LC = 1; s.w.mark(id, true); if (s.w.prog(1).pct >= 45) break; }
  s.w.msHide(); await sleep(10);
  const had = [...s.w.recIntern(1).eligible].map((x) => x.t);
  let shown = '';
  for (const id of ids) {
    if (s.w.enr()[EMAIL][1].done.includes(id)) continue;
    s.w.LC = 1; s.w.mark(id, true); await sleep(5);
    if (s.w.$('mstoast').classList.contains('on')) { shown = text(s.w.$('mstoast')); break; }
  }
  assert.match(shown, /Halfway there! 50%/);
  for (const t of had) assert.ok(!shown.includes('Newly unlocked for you: ' + t), 'already-unlocked role not called new: ' + t);
});

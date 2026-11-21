// Course page sections (learn, industry relevance, outcomes, careers, placement), progress tracking with
// milestone pop-ups, internship recommendations, and chatbot answers about progress.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSite, sleep } from './helpers.mjs';

const EMAIL = 'learner@test.in';
const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
const enr = (ci, done = []) => ({ [ci]: { txn: 'T' + ci, inv: 'ING/' + ci, date: '19/11/2026', amt: 4999, list: 4999, pm: 'UPI', done } });
async function learner(courses = { 1: [] }, extra = {}, opts = {}) {
  const e = Object.assign({}, ...Object.entries(courses).map(([ci, d]) => enr(ci, d)));
  const s = await loadSite({ url: 'https://site.test/#home', storage: { sf_enr: JSON.stringify({ [EMAIL]: e }), ...extra }, ...opts });
  s.w.US = { email: EMAIL, name: 'Test Learner', role: 's' };
  s.w.upd && s.w.upd();
  return s;
}
const lessonIds = (w, ci) => { const f = []; w.mods(w.cf(ci)).forEach((m) => m.ls.forEach((l) => f.push(l.id))); return f; };
const firstN = (w, ci, pct) => lessonIds(w, ci).slice(0, Math.ceil((w.nTot(ci) * pct) / 100));
// record SweetAlert dialogs (the helper's Swal does nothing)
function popups(w) {
  const seen = [];
  w.Swal.fire = (o) => { seen.push(o); return Promise.resolve({}); };
  return seen;
}
const milestonePops = (seen) => seen.filter((o) => /^\d+% complete ·/.test(o.title || '')).map((o) => o.title);

/* ---------- 2–6: course page sections ---------- */

test('every course page has: learn (skills, technologies, topics), syllabus, capstones (networking), industry relevance, outcomes, careers, internship & 100% placement', async () => {
  const s = await loadSite();
  for (const c of s.w.cxVis()) {
    s.w.show(c.i); await sleep(50);
    const cv = s.w.$('cv');
    const ids = [...cv.querySelectorAll('.cx-left > .cx-sec, .cx-left > .syl')].map((e) => e.id);
    const caps = c.i == 1 ? ['cx-capstones'] : [];
    assert.deepEqual(ids, ['cx-learn', 'syl', ...caps, 'cx-industry', 'cx-outcomes', 'cx-careers', 'cx-placement'], `${c.t}: section order`);
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
    assert.equal(cv.querySelectorAll('.cx-nav a').length, 6 + caps.length, 'in-page section menu');
    assert.match(text(cv.querySelector('.ip-card')), /100% placement assistance.*50% course progress/);
  }
  assert.deepEqual(s.errors, []);
});

test('section menu scrolls to each section', async () => {
  const s = await loadSite();
  s.w.show(1); await sleep(50);
  const seen = [];
  s.w.Element.prototype.scrollIntoView = function () { seen.push(this.id); };
  for (const a of s.w.$('cv').querySelectorAll('.cx-nav a')) a.click();
  assert.deepEqual(seen, ['cx-learn', 'syl', 'cx-capstones', 'cx-industry', 'cx-outcomes', 'cx-careers', 'cx-placement']);
});

/* ---------- 7: progress tracking & milestone pop-ups ---------- */

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
  assert.ok(card.querySelectorAll('.rec-list > div').length >= 3, 'internships listed at 50%');
  assert.match(text(card), /more to reach 60%/);
  assert.deepEqual(s.errors, []);
});

test('milestone pop-ups at 30% (resume), 50% (internships), 60% (career), 80% (placement prep), once each', async () => {
  const s = await learner({ 1: [] });
  s.w.location.hash = '#learn'; await sleep(80);
  const seen = popups(s.w);
  for (const id of lessonIds(s.w, 1)) {
    s.w.LC = 1; s.w.mark(id, true); await sleep(2);
    if (s.w.prog(1).pct >= 85) break;
  }
  assert.deepEqual(milestonePops(seen), ['30% complete · build your resume', '50% complete · internships unlocked', '60% complete · career opportunities', '80% complete · placement preparation']);
  assert.equal(seen.find((o) => /^30%/.test(o.title)).confirmButtonText, 'Open Resume builder →');
  assert.match(seen.find((o) => /^50%/.test(o.title)).html, /Network Support Intern/);
  // not repeated on reload
  seen.length = 0; s.w.renderLearn(); await sleep(20);
  assert.deepEqual(milestonePops(seen), [], 'no repeat');
  const saved = JSON.parse(s.w.localStorage.getItem('sf_ms'))[EMAIL][1];
  assert.deepEqual([...saved], [30, 50, 60, 80]);
  assert.deepEqual(s.errors, []);
});

test('the 30% pop-up opens the Resume builder', async () => {
  const s = await learner({ 1: [] });
  s.w.location.hash = '#learn'; await sleep(60);
  s.w.Swal.fire = (o) => Promise.resolve({ isConfirmed: /^30%/.test(o.title || '') });
  for (const id of firstN(s.w, 1, 31)) { s.w.LC = 1; s.w.mark(id, true); }
  await sleep(80);
  assert.equal(s.w.location.hash, '#next');
  assert.equal(s.w.NT, 'resume');
  assert.ok(s.w.$('nx').querySelector('#rsp'), 'resume preview shown');
});

test('progress made earlier is celebrated once when the learner opens My Learning', async () => {
  const s0 = await loadSite();
  const ids = firstN(s0.w, 6, 62);
  const s = await learner({ 6: ids });
  const seen = popups(s.w);
  s.w.LC = 6; s.w.location.hash = '#learn'; await sleep(80);
  assert.deepEqual(milestonePops(seen), ['60% complete · career opportunities']);
  assert.match(seen.find((o) => /^60%/.test(o.title)).html, /SOC Analyst \(L1\)/, 'names career roles');
});

test('the milestone pop-up waits while another popup is open', async () => {
  const s = await learner({ 1: [] });
  s.w.location.hash = '#learn'; await sleep(60);
  let open = true;
  const seen = popups(s.w);
  s.w.Swal.isVisible = () => open; s.w.Swal.getPopup = () => ({ classList: { contains: () => false } });
  for (const id of firstN(s.w, 1, 31)) { s.w.LC = 1; s.w.mark(id, true); }
  await sleep(100);
  assert.deepEqual(milestonePops(seen), [], 'waiting');
  open = false; await sleep(500);
  assert.deepEqual(milestonePops(seen), ['30% complete · build your resume'], 'shown after the popup closed');
});

test('course page shows the enrolled learner their progress', async () => {
  const s0 = await loadSite();
  const s = await learner({ 1: firstN(s0.w, 1, 40) });
  s.w.show(1); await sleep(50);
  assert.match(text(s.w.$('cv').querySelector('.pg-mini')), /Your progress: 4\d%/);
});

/* ---------- 8: internship recommendations ---------- */

test('networking: internships unlock at 50%, full-time roles at 60%', async () => {
  const s0 = await loadSite();
  const at = async (pct) => { const s = await learner({ 1: firstN(s0.w, 1, pct) }); return s.w.recIntern(1); };
  let R = await at(0);
  assert.equal(R.eligible.length, 0);
  assert.match(R.next.label, /Reach 50% course progress/);
  assert.ok(R.next.roles.includes('Network Support Intern'));
  R = await at(55);
  assert.ok(R.eligible.length >= 3 && R.eligible.every((x) => x.intern), 'only internships at 55%');
  assert.ok(R.eligible.some((x) => x.t == 'Network Support Intern'));
  assert.match(R.next.label, /Reach 60%/);
  assert.ok(R.next.roles.includes('Junior Network Administrator'));
  R = await at(100);
  assert.ok(R.eligible.some((x) => x.t == 'Junior Network Administrator'));
  assert.equal(R.eligible[0].intern, true, 'internships first');
  assert.equal(R.next, null);
});

test('other courses: internship tracks at 50%, career roles at 60%', async () => {
  const s0 = await loadSite();
  const at = async (pct) => { const s = await learner({ 6: firstN(s0.w, 6, pct) }); return s.w.recIntern(6); };
  assert.equal((await at(10)).eligible.length, 0);
  assert.equal((await at(55)).eligible.length, 2);
  const done = await at(65);
  assert.equal(done.eligible.length, 2 + s0.w.cf(6).jr.length);
  assert.equal(done.next, null);
});

test('recommendations appear in My Learning and on the Internships page', async () => {
  const s0 = await loadSite();
  const s = await learner({ 6: firstN(s0.w, 6, 55) });
  s.w.LC = 6; s.w.location.hash = '#learn'; await sleep(80);
  assert.match(text(s.w.$('pgcard').querySelector('.rec')), /SOC Analyst \(L1\) – internship track.*Next unlock: Reach 60%/);
  s.w.location.hash = '#internship'; await sleep(80);
  assert.match(text(s.w.$('internship').querySelector('.ip-status')), /Cyber Security Essentials · \d+% complete.*SOC Analyst/);
});

/* ---------- 9: chatbot ---------- */

test('chatbot answers "my progress" and "which internships am I eligible for" from the learner data', async () => {
  const s0 = await loadSite();
  // templates (used when the AI is off or fails)
  const t = await learner({ 1: firstN(s0.w, 1, 55) }, {}, { chatApi: '' });
  t.w.LC = 1; t.w.location.hash = '#learn'; await sleep(60);
  t.open(); await sleep(30);
  await t.ask('What is my progress?');
  assert.match(t.lastText(), /IT Network System Administrator: \d+% complete .*Next milestone: 60%/);
  await t.ask('Which internships am I eligible for?');
  assert.match(t.lastText(), /Eligible: .*Network Support Intern/);
  assert.match(t.lastText(), /Next: Reach 60% course progress/);
  assert.equal(t.calls.length, 0);
  // live AI: the same learner data goes to the AI
  const s = await learner({ 1: firstN(s0.w, 1, 55) });
  s.w.LC = 1; s.w.location.hash = '#learn'; await sleep(60);
  s.open(); await sleep(30);
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
  assert.match(s.lastText(), /No internships unlocked yet.*Next: Reach 50% course progress/);
  assert.match(s.lastText(), /Reach 50% course progress to unlock internship opportunities/);
  s.w.hTopic('lms'); await sleep(600);
  assert.match(s.lastText(), /0% complete/);
});

test('visitors asking about progress are asked to log in', async () => {
  const s = await loadSite();
  s.open(); await sleep(30);
  await s.ask('Which internships can I get?');
  assert.doesNotMatch(s.lastText(), /Eligible:/);
});

test('finishing a module shows a small "Module completed" toast, not an eligibility popup', async () => {
  const s = await learner({ 1: [] });
  s.w.location.hash = '#learn'; await sleep(60);
  const seen = popups(s.w);
  const m1 = s.w.mods(s.w.cf(1)).find((m) => m.mi === 0).ls.map((l) => l.id);
  for (const id of lessonIds(s.w, 1)) { s.w.LC = 1; s.w.mark(id, true); if (m1.every((x) => s.w.enr()[EMAIL][1].done.includes(x))) break; }
  assert.ok(seen.some((o) => o.toast && o.title == 'Module completed'));
  assert.ok(!seen.some((o) => /eligible for a job/.test(o.title || '')));
});

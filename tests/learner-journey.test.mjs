// Learner journey: capstone projects, resume upload, MCQ explanations in the chatbot, milestone unlocks, landing hero.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSite, sleep } from './helpers.mjs';
import { systemPrompt } from '../supabase/functions/_shared/chat-core.js';

const EMAIL = 'learner@test.in';
const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
const E = (o = {}) => Object.assign({ txn: 'T1', inv: 'ING/1', date: '19/11/2026', amt: 4999, list: 4999, pm: 'UPI', done: [] }, o);
async function learner(e1 = {}, extra = {}, opts = {}) {
  const s = await loadSite({ url: 'https://site.test/#home', storage: { sf_enr: JSON.stringify({ [EMAIL]: { 1: E(e1) } }), ...extra }, ...opts });
  s.w.US = { email: EMAIL, name: 'Test Learner', role: 's' };
  s.w.upd && s.w.upd();
  return s;
}
const ids = (w) => { const f = []; w.mods(w.cf(1)).forEach((m) => m.ls.forEach((l) => f.push(l.id))); return f; };
const upTo = (w, pct) => ids(w).slice(0, Math.ceil((w.nTot(1) * pct) / 100));
function setDone(s, done) { const all = JSON.parse(s.w.localStorage.getItem('sf_enr')); all[EMAIL][1].done = done; s.w.localStorage.setItem('sf_enr', JSON.stringify(all)); }

/* ---------- 1. capstone projects ---------- */

test('course page shows 5 capstone projects with outcomes before enrolling, for information only', async () => {
  const s = await loadSite();
  s.w.show(1); await sleep(50);
  const sec = s.w.$('cx-capstones');
  assert.ok(sec, 'capstone section');
  assert.match(text(sec.querySelector('h3')), /5 Capstone Projects/);
  const cards = sec.querySelectorAll('.cap-card');
  assert.equal(cards.length, 5);
  for (const c of cards) assert.equal(c.querySelectorAll('.cap-o i').length, 3, 'three outcomes each');
  // not selectable here: the choice is made in My Learning after enrolling
  for (const c of cards) { assert.equal(c.tagName, 'DIV'); assert.ok(c.classList.contains('ro') && !c.hasAttribute('onclick')); }
  cards[0].click(); await sleep(20);
  assert.ok(!s.w.$('mo').classList.contains('on'), 'clicking a card opens nothing');
  assert.match(text(sec.querySelector('.cx-sub')), /After you enroll, you choose one of these projects in My Learning/);
  assert.deepEqual(s.errors, []);
});

test('a chosen capstone shows only its modules, as a tree ending with the project; the course syllabus stays complete', async () => {
  const s = await learner({ cap: 'domain' });
  const ms = s.w.mods(s.w.cf(1));
  assert.deepEqual([...ms.filter((m) => m.mi != null).map((m) => m.mi + 1)], [1, 6, 7, 8]);
  assert.match(ms[0].t, /Start here/);
  assert.match(ms.at(-1).t, /^Capstone project: Windows domain/);
  assert.equal(ms.at(-1).ls.length, 3);
  assert.ok(s.w.nTot(1) < s.w.modsAll(s.w.cf(1)).reduce((n, m) => n + m.ls.length, 0), 'fewer lessons than the full course');
  s.w.LC = 1; s.w.location.hash = '#learn'; await sleep(80);
  const lw = s.w.$('lw');
  assert.match(text(lw.querySelector('.cap-head')), /Capstone project.*Windows domain for a growing company.*Change/);
  assert.equal(lw.querySelectorAll('.us details.ud').length, ms.length, 'sidebar lists only the path');
  // the course page syllabus is still the whole course
  s.w.show(1); await sleep(50);
  assert.equal(s.w.$('cv').querySelectorAll('#syl .syl-m').length, s.w.MD.length);
  assert.deepEqual(s.errors, []);
});

test('the capstone is chosen in My Learning only: learners without one are asked there, and the choice is saved', async () => {
  const s = await learner({});
  s.w.LC = 1; s.w.location.hash = '#learn'; await sleep(80);
  assert.match(text(s.w.$('lw').querySelector('.cap-ask')), /Choose your capstone project/);
  s.w.capModal(1, 'change'); await sleep(10);
  s.w.capSel(1, 'linux'); await sleep(10);
  s.w.capSave(1); await sleep(30);
  assert.equal(JSON.parse(s.w.localStorage.getItem('sf_enr'))[EMAIL][1].cap, 'linux');
  assert.ok(!s.w.$('lw').querySelector('.cap-ask'));
  assert.match(text(s.w.$('lw').querySelector('.cap-head')), /Linux web and file server/);
  // the course page now says where to change it, and links to My Learning
  s.w.show(1); await sleep(50);
  assert.match(text(s.w.$('cx-capstones').querySelector('.cx-sub')), /Your project: Linux web and file server\. You can change it in My Learning/);
  assert.match(text(s.w.$('cx-capstones').querySelector('button')), /Change it in My Learning/);
  // the picker cannot be opened for a course the person is not enrolled in
  s.w.cl_(); s.w.capModal(6, 'change'); await sleep(10);
  assert.ok(!s.w.$('mo').classList.contains('on'));
});

/* ---------- 2. resume upload ---------- */

const CV = `Priya Raman
priya.raman@mail.com | +91 98765 43210 | linkedin.com/in/priya-raman
Career Objective
Motivated graduate looking for a network support role.
Technical Skills
Python, Linux, Cisco Packet Tracer | MS Excel
Education
B.Sc Computer Science, Madras University, 2025
Internships
IT support intern, ABC Infotech (2 months)
Projects
Library management system in Python
Languages
English, Tamil
Hobbies
Chess`;

test('resume text is read into Resume builder fields', async () => {
  const s = await loadSite();
  const f = s.w.cvParse(CV);
  assert.equal(f.nm, 'Priya Raman');
  assert.equal(f.em, 'priya.raman@mail.com');
  assert.match(f.ph, /98765 43210/);
  assert.match(f.ln, /linkedin\.com\/in\/priya-raman/);
  assert.match(f.sum, /network support role/);
  assert.deepEqual(f.sk.split(', '), ['Python', 'Linux', 'Cisco Packet Tracer', 'MS Excel']);
  assert.match(f.ed, /B\.Sc Computer Science/);
  assert.match(f.ex, /IT support intern/);
  assert.match(f.pr, /Library management/);
  assert.equal(f.la, 'English, Tamil');
  assert.doesNotMatch(JSON.stringify(f), /Chess/, 'hobbies are skipped');
});

test('sign-up form has a resume upload; the resume is saved with the new account', async () => {
  const s = await loadSite();
  const inp = s.w.$('scv');
  assert.ok(inp && inp.type == 'file');
  assert.match(inp.accept, /\.pdf/); assert.match(inp.accept, /\.docx/);
  const file = new s.w.File([CV], 'priya.txt', { type: 'text/plain' });
  Object.defineProperty(inp, 'files', { value: [file] });
  s.w.cvPick(inp); await sleep(80);
  assert.match(text(s.w.$('scvs')), /priya\.txt.*read \d+ details/);
  // too big / wrong type
  const bad = { files: [new s.w.File(['x'], 'photo.png')], value: 'x' };
  s.w.cvPick(bad); await sleep(30);
  assert.match(text(s.w.$('scvs')), /PDF, DOCX or TXT/);
  s.w.cvPick(inp); await sleep(80);
  // demo sign-up (no Supabase)
  s.w.$('sn').value = 'Priya Raman'; s.w.$('se').value = 'priya@test.in'; s.w.$('sph').value = '9876543210';
  s.w.$('sp').value = 'secret123'; s.w.$('sp2').value = 'secret123'; s.w.$('stc').checked = true;
  s.w.signup(); await sleep(200);
  const u = JSON.parse(s.w.localStorage.getItem('sf_users'))['priya@test.in'];
  assert.equal(u.cv.name, 'priya.txt');
  assert.equal(u.cv.f.ed, 'B.Sc Computer Science, Madras University, 2025');
});

test('Resume builder is filled in from the uploaded resume and the capstone', async () => {
  const s0 = await loadSite();
  const f = s0.w.cvParse(CV);
  const s = await learner({ cap: 'office' }, { sf_users: JSON.stringify({ [EMAIL]: { n: 'Test Learner', h: '', p: 'email', cv: { name: 'priya.txt', size: 900, f } } }) });
  setDone(s, upTo(s.w, 35));
  const r = s.w.rsData();
  assert.equal(r.nm, 'Test Learner', 'account name kept');
  assert.match(r.ph, /98765 43210/);
  assert.match(r.ed, /B\.Sc Computer Science/);
  assert.match(r.ex, /IT support intern/);
  assert.match(r.sk, /Subnetting.*Python/, 'course skills + resume skills');
  assert.equal(r.sk.split(', ').filter((x) => x == 'Linux (Ubuntu)').length, 1);
  assert.match(r.pr.split('\n')[0], /^Capstone: Small-office network/);
  assert.match(r.pr, /Library management/);
  s.w.NT = 'resume'; s.w.location.hash = '#next'; await sleep(60);
  assert.match(text(s.w.$('nx').querySelector('.cv-imp')), /Filled in from your resume: priya\.txt/);
  assert.equal(s.w.$('rf_ph').value.replace(/\s/g, ''), '+919876543210');
});

/* ---------- 3. wrong MCQ answers → chatbot ---------- */

async function failTest(opts) {
  const s = await learner({}, {}, opts);
  s.w.Element.prototype.scrollIntoView = () => {};
  const m1 = s.w.mods(s.w.cf(1)).find((m) => m.mi === 0), q = m1.ls.find((l) => l.qz);
  setDone(s, ids(s.w).slice(0, ids(s.w).indexOf(q.id)));
  s.w.LC = 1; s.w.LS = q.id; s.w.location.hash = '#learn'; await sleep(80);
  const set = s.w.lqSet(q.id);
  set.forEach((x, k) => { const pick = k == 0 ? x[2] : (x[2] + 1) % x[1].length; s.w.document.querySelector(`input[name=lq${k}][value="${pick}"]`).checked = true; });
  s.w.lqSubmit(q.id); await sleep(900);
  // under a full parallel test run the reply can take longer: wait for it instead of a fixed time
  for (let t = 0; t < 50 && s.last() && /^Explain the \d+ MCQ questions/.test(s.last().textContent.trim()); t++) await sleep(100);
  return { s, set };
}

test('after an MCQ test, the floating AI chatbot explains every wrong answer', async () => {
  const { s, set } = await failTest();
  assert.ok(s.w.$('cbp').classList.contains('open'), 'chat opened');
  const call = s.calls.at(-1);
  assert.ok(call, 'AI asked');
  const rv = call.body.mcqReview;
  assert.equal(rv.length, set.length - 1);
  assert.equal(rv[0].question, set[1][0]);
  assert.equal(rv[0].correct, set[1][1][set[1][2]]);
  assert.equal(rv[0].chosen, set[1][1][(set[1][2] + 1) % set[1][1].length]);
  assert.match(rv[0].module, /Module 1/);
  assert.match(call.body.messages.at(-1).content, /Explain the \d MCQ questions I got wrong/);
  assert.deepEqual(s.errors, []);
});

test('without the AI, the chatbot still shows the correct answers and a related concept', async () => {
  const { s, set } = await failTest({ chatApi: '' });
  const t = text(s.last());
  assert.match(t, /questions you missed/);
  assert.ok(t.includes('Correct answer: ' + set[1][1][set[1][2]]));
  assert.match(t, /Revisit: Module 1/);
  assert.equal(s.calls.length, 0);
  // the "related concept" is course material, never the same MCQ question repeated back
  for (const x of set.slice(1)) assert.ok(!t.includes('Related concept · ' + x[0]), 'question echoed as its own concept: ' + x[0]);
});

test('My Learning still opens for an enrolment saved without a payment amount', async () => {
  const email = 'noamt@test.in';
  const s = await loadSite({ url: 'https://site.test/#learn', storage: { sf_sess: JSON.stringify({ email, name: 'N', role: 's' }), sf_enr: JSON.stringify({ [email]: { 12: { done: [] } } }) } });
  await sleep(300);
  s.w.LC = 12; s.w.LTAB = 'res'; s.w.renderLearn(); await sleep(50);
  const lw = s.w.$('lw');
  assert.match(lw.textContent, /Computer Network through LAN & WAN/);
  assert.match(lw.textContent, /No payment receipt for this enrolment/);
  assert.ok(!/NaN|undefined/.test(lw.textContent), 'no NaN/undefined shown');
  assert.equal(s.w.fee(undefined), '₹0');
  assert.deepEqual(s.errors, []);
});

test('the AI may explain only questions that were already submitted', () => {
  const p0 = systemPrompt({ user: { enrolled: ['IT Network System Administrator'] } });
  assert.doesNotMatch(p0, /MCQ REVIEW \(/);
  assert.match(p0, /Never give answers to quiz/);
  const p = systemPrompt({ user: { enrolled: ['IT Network System Administrator'] }, mcqReview: [{ question: 'Which role creates a domain?', options: ['DHCP', 'AD DS'], correct: 'AD DS', chosen: 'DHCP', module: 'Module 6' }, { question: '' }] });
  assert.match(p, /MCQ REVIEW \(the learner has ALREADY SUBMITTED/);
  assert.match(p, /"correct":"AD DS"/);
  assert.equal((p.match(/"question"/g) || []).length, 1, 'empty items dropped');
  assert.match(p, /30% Resume builder.*50% internship.*60% career.*80% placement preparation.*100% course completion certificate/);
});

/* ---------- 4. milestones on the Career steps page ---------- */

test('career steps unlock at 30% resume, 50% internships, 60% jobs, 80% placement prep, 100% certificate', async () => {
  const s = await learner({});
  const open = async (tab) => { s.w.NT = tab; s.w.nxRender(); await sleep(10); return s.w.$('nx'); };
  const at = (pct) => setDone(s, upTo(s.w, pct));
  at(20);
  assert.match(text((await open('resume')).querySelector('.nx-lock')), /Unlocks at 30%/);
  assert.match(text(s.w.$('nx').querySelector('.xo')), /🔒 📄 Resume builder · 30%/);
  at(35);
  assert.ok((await open('resume')).querySelector('#rsp'), 'resume builder at 35%');
  assert.match(text((await open('jobs')).querySelector('.nx-lock')), /Unlocks at 50%/);
  at(55);
  let nx = await open('jobs');
  const cards = [...nx.querySelectorAll('.grid .card h3')].map(text);
  assert.ok(cards.includes('Network Support Intern'));
  assert.ok(!cards.includes('Junior Network Administrator'), 'full-time roles locked until 60%');
  assert.match(text(nx), /Full-time career opportunities unlock at 60%/);
  at(65);
  assert.ok([...(await open('jobs')).querySelectorAll('.grid .card h3')].map(text).includes('Junior Network Administrator'));
  assert.match(text((await open('prep')).querySelector('.nx-lock')), /Unlocks at 80%/);
  at(85);
  nx = await open('prep');
  assert.equal(nx.querySelectorAll('.prep-i input').length, 6);
  assert.ok(nx.querySelectorAll('.prep-q').length >= 6);
  s.w.prepMock(); await sleep(20);
  assert.match(s.w.lmsG().doubts[0].q, /Mock interview request/);
  assert.match(text((await open('cert')).querySelector('.nx-lock')), /Unlocks at 100%/);
  at(100);
  assert.ok((await open('cert')).querySelector('.pc'), 'certificate at 100%');
  assert.deepEqual(s.errors, []);
});

test('course completion pop-up leads to the certificate', async () => {
  const s = await learner({});
  s.w.location.hash = '#learn'; await sleep(60);
  const seen = [];
  s.w.Swal.fire = (o) => { seen.push(o); return Promise.resolve({ isConfirmed: o.title == 'Course complete! 🎓' }); };
  for (const id of ids(s.w)) { s.w.LC = 1; s.w.mark(id, true); }
  await sleep(50);
  assert.ok(seen.some((o) => o.title == 'Course complete! 🎓' && /certificate is unlocked/.test(o.text)));
  assert.equal(s.w.NT, 'cert');
});

/* ---------- 5. landing hero ---------- */

test('landing hero highlights Assured Internships, Real-World Projects and Placement Assistance', async () => {
  const s = await loadSite({ url: 'https://site.test/#landing' });
  const li = [...s.w.document.querySelectorAll('.lht .hpro li b')].map(text);
  assert.deepEqual(li, ['Assured Internships', 'Real-World Projects', 'Placement Assistance']);
  const order = [...s.w.document.querySelector('.lht').children].map((e) => e.className || e.tagName.toLowerCase());
  assert.deepEqual(order, ['hbadge', 'h1', 'lp', 'hpro', 'hcta'], 'between the subtitle and the button');
});

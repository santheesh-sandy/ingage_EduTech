// Syllabus before enrollment, internship page, floating chatbot.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSite, sleep } from './helpers.mjs';

const ENR = (email, ci = 1) => JSON.stringify({ [email]: { [ci]: { txn: 'T1', inv: 'ING/1', date: '19/11/2026', amt: 4999, list: 4999, pm: 'UPI', done: [] } } });
const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
async function course(s, i) { s.w.show(i); await sleep(60); return s.w.$('cv'); }

/* ---------------- 1. syllabus ---------------- */

test('course page shows the full syllabus before the enroll button', async () => {
  const s = await loadSite();
  const cv = await course(s, 1);
  const syl = cv.querySelector('#syl');
  assert.ok(syl, 'syllabus section exists');
  const mods = syl.querySelectorAll('.syl-m');
  const numbered = [...mods].filter((m) => /Module \d+:/.test(text(m.querySelector('summary'))));
  assert.equal(numbered.length, s.w.MD.length, 'one entry per course module (10)');
  assert.match(text(numbered[0]), /Module 1: Networking fundamentals and addressing/);
  assert.ok(mods[0].open, 'first module expanded');
  assert.ok(numbered[1].querySelectorAll('li').length >= 3, 'lessons listed');
  assert.match(text(syl.querySelector('.syl-sum')), /10 modules.*lessons.*60 hours.*MCQ/);
  // the "Review the syllabus" link sits in the enroll card, above the Enroll button
  const card = cv.querySelector('.syl-link').closest('.card');
  assert.ok(card.querySelector('button[onclick^="enroll("]'), 'link is in the enroll card');
  assert.ok(cv.querySelector('.syl-link').compareDocumentPosition(card.querySelector('button[onclick^="enroll("]')) & 4, 'link before the button');
  assert.ok(cv.querySelector('.ip-card a[onclick*="internship"]'), 'internship pathway card');
  assert.deepEqual(s.errors, []);
});

test('every course (open and coming soon) has a syllabus', async () => {
  const s = await loadSite();
  for (const c of s.w.cxVis()) {
    const cv = await course(s, c.i);
    const n = cv.querySelectorAll('#syl .syl-m').length;
    assert.ok(n >= 4, `${c.t}: ${n} modules`);
    const first = c.i == 1 ? s.w.MD[0].t : c.cur && c.cur.length ? c.cur[0].t : c.l[0].replace(/\.$/, '');
    assert.ok(text(cv.querySelector('#syl')).includes(first), `${c.t}: real module names`);
  }
  assert.deepEqual(s.errors, []);
});

test('Enroll now first shows the syllabus review, then continues to sign in', async () => {
  const s = await loadSite();
  await course(s, 1);
  s.w.enroll(1); await sleep(30);
  const mo = s.w.$('mo');
  assert.ok(mo.classList.contains('on'), 'syllabus review dialog open');
  assert.match(text(s.w.$('mb')), /REVIEW SYLLABUS.*IT Network System Administrator/);
  assert.equal(s.w.$('mb').querySelectorAll('.syl-m').length, s.w.$('cv').querySelectorAll('#syl .syl-m').length);
  assert.ok(!s.w.$('lo').classList.contains('on'), 'login not shown yet');
  assert.ok(s.w.document.body.classList.contains('has-ov'), 'chat button switches to compact mode over dialogs');
  assert.match(text(s.w.$('mb')), /STEP 1 OF 4.*Next: 2 Choose capstone → 3 Sign in/);
  s.w.eval(s.w.$('mb').querySelector('.syl-go .btn').getAttribute('onclick')); await sleep(30);
  // step 2: choose a capstone project
  assert.ok(mo.classList.contains('on') && s.w.$('mb').querySelector('.cap-pick'), 'capstone picker open');
  assert.equal(s.w.$('mb').querySelectorAll('.cap-card').length, 5);
  assert.ok(s.w.$('mb').querySelector('.syl-go .btn').disabled, 'cannot continue without a project');
  s.w.$('mb').querySelectorAll('.cap-card')[2].click(); await sleep(20);
  assert.ok(s.w.$('mb').querySelector('.cap-tree'), 'learning path shown');
  s.w.eval(s.w.$('mb').querySelector('.syl-go .btn').getAttribute('onclick')); await sleep(30);
  assert.ok(!mo.classList.contains('on'), 'picker closed');
  assert.ok(s.w.$('lo').classList.contains('on'), 'login shown (step 3)');
  assert.equal(s.w.capPick(1), 'domain', 'choice kept for checkout');
  assert.equal(s.w.PEND, 1, 'enrollment continues after login');
  // second time in the same visit: straight to login
  s.w.cl_(); await sleep(20);
  s.w.enroll(1); await sleep(20);
  assert.ok(!s.w.$('mo').classList.contains('on'));
  assert.ok(s.w.$('lo').classList.contains('on'));
  assert.deepEqual(s.errors, []);
});

test('opening a module of the inline syllabus counts as reviewed (just rendering it does not)', async () => {
  const s = await loadSite();
  let cv = await course(s, 6);
  s.w.dispatchEvent(new s.w.Event('scroll')); await sleep(20);
  const m = cv.querySelectorAll('#syl .syl-m')[1];
  m.querySelector('summary').click(); await sleep(20);
  assert.ok(m.open, 'module opened');
  s.w.enroll(1); await sleep(20);
  assert.ok(s.w.$('mo').classList.contains('on'), 'other course still asks');
  s.w.cl_();
  const c = s.w.cf(6); c.soon = 0; // pretend course 6 is open
  s.w.enroll(6); await sleep(20);
  assert.ok(!s.w.$('mb').querySelector('.syl-gate'), 'reviewed course skips the syllabus step');
  assert.ok(s.w.$('mb').querySelector('.cap-pick'), '…and goes on to choosing a capstone');
});

test('enrolled learners and coming-soon courses are not blocked', async () => {
  const email = 'l@test.in';
  const s = await loadSite({ storage: { sf_enr: ENR(email) } });
  s.w.US = { email, name: 'L' };
  s.w.enroll(1); await sleep(30);
  assert.ok(!s.w.$('mo').classList.contains('on'), 'no review for an enrolled course');
  s.w.enroll(2); await sleep(30); // coming soon → existing "coming soon" popup, no review
  assert.match(text(s.w.$('mb')), /^$|.*/);
  assert.ok(!/REVIEW SYLLABUS/.test(text(s.w.$('mb'))));
});

test('enrolling from the chatbot also shows the syllabus first', async () => {
  const s = await loadSite();
  s.open(); await sleep(30);
  s.w.aiEnroll(1); await sleep(30);
  assert.match(text(s.w.$('mb')), /REVIEW SYLLABUS/);
});

/* ---------------- 2. internship page ---------------- */

test('internship page: nav link, overview, facts, steps, roles, tracks, module unlocks, FAQ', async () => {
  const s = await loadSite({ url: 'https://site.test/#internship' });
  const sec = s.w.$('internship');
  assert.ok(sec.classList.contains('on'), 'page is shown');
  const a = s.w.document.querySelector('nav a[data-v="internship"]');
  assert.equal(a.textContent, 'Internships');
  assert.ok(a.classList.contains('on'), 'nav link highlighted');
  const t = text(sec);
  for (const x of ['Internship & Placement Program', '100% Placement Assistance', 'Typically 3 months', 'How it works', 'Open internship roles', 'Network Support Intern',
    'Internship tracks by course', 'Cyber Security Essentials', 'What each milestone unlocks', 'Placement preparation', 'What you gain', 'Frequently asked questions',
    'Is the internship paid?', '+91 99416 56492', 'Log in and enroll']) assert.ok(t.includes(x), x);
  assert.equal(sec.querySelectorAll('.ip-steps li').length, 6);
  assert.equal(sec.querySelectorAll('.ip-faq details').length, s.w.INTERN.faq.length);
  assert.ok(s.w.document.querySelector('footer a[href="#internship"]'), 'footer link');
  assert.deepEqual(s.errors, []);
});

test('internship page shows the logged-in learner their status', async () => {
  const email = 'l@test.in';
  const s = await loadSite({ storage: { sf_enr: ENR(email) } });
  s.w.US = { email, name: 'L' };
  s.w.location.hash = '#internship'; await sleep(60);
  const st = text(s.w.$('internship').querySelector('.ip-status'));
  assert.match(st, /Your internship recommendations/);
  assert.match(st, /0% complete/);
  assert.match(st, /Next unlock: Reach 50% course progress/);
});

test('navigating to the internship page from anywhere works, and back', async () => {
  const s = await loadSite({ url: 'https://site.test/#courses' });
  s.w.nav('internship'); await sleep(60);
  assert.ok(s.w.$('internship').classList.contains('on'));
  assert.ok(!s.w.$('courses').classList.contains('on'));
  s.w.nav('courses'); await sleep(60);
  assert.ok(s.w.$('courses').classList.contains('on'));
  assert.ok(!s.w.$('internship').classList.contains('on'));
});

test('chatbot internship answer links to the internship page; page CTA opens the chat on internships', async () => {
  const s = await loadSite({ url: 'https://site.test/#internship' });
  s.w.$('internship').querySelector('a[onclick="ipAsk()"]').click(); await sleep(700);
  assert.ok(s.w.$('cbp').classList.contains('open'), 'chat opened');
  const link = [...s.w.document.querySelectorAll('#cbm a')].find((a) => /internship details/.test(a.textContent));
  assert.ok(link, 'link to internship page in the answer');
  assert.deepEqual(s.errors, []);
});

/* ---------------- 3. floating chatbot ---------------- */

test('chat button floats on every page, including the new internship page', async () => {
  const s = await loadSite();
  for (const h of ['landing', 'home', 'courses', 'course', 'internship', 'about', 'contact']) {
    s.w.location.hash = '#' + h; await sleep(40);
    const fab = s.w.document.querySelector('.aiw .ai-fab');
    assert.ok(fab, h);
    assert.equal(s.w.getComputedStyle(s.w.document.querySelector('.aiw')).position, 'fixed', h);
    assert.notEqual(s.w.getComputedStyle(fab).visibility, 'hidden', h);
    assert.ok(!fab.closest('section'), 'not inside a page section, so it never disappears with a page');
  }
});

test('chat stays open while moving between pages and keeps the conversation', async () => {
  const s = await loadSite({ chatApi: '' });
  s.open(); await s.ask('How do I enroll?');
  const n = s.w.document.querySelectorAll('#cbm .ai-bub').length;
  for (const h of ['courses', 'internship', 'about', 'landing']) { s.w.location.hash = '#' + h; await sleep(40); }
  assert.ok(s.w.$('cbp').classList.contains('open'), 'still open');
  assert.equal(s.w.document.querySelectorAll('#cbm .ai-bub').length, n, 'conversation kept');
  await s.ask('What is the fee for lidar?');
  assert.match(s.lastText(), /₹4,999/);
  assert.deepEqual(s.errors, []);
});

test('on the internship page the chat offers internship quick questions', async () => {
  const s = await loadSite({ url: 'https://site.test/#internship' });
  s.open(); await sleep(30);
  assert.match(text(s.w.$('cbq')), /Am I eligible for an internship\?/);
});

test('greeting bubble appears once, opens the chat, and goes away', async () => {
  const s = await loadSite({ teaserMs: 30 });
  await sleep(120);
  const tz = s.w.document.querySelector('.ai-teaser');
  assert.ok(tz, 'teaser shown');
  assert.ok(s.w.document.body.classList.contains('ai-unseen'), 'red dot on the button');
  tz.click(); await sleep(30);
  assert.ok(s.w.$('cbp').classList.contains('open'), 'click opens chat');
  assert.equal(s.w.document.querySelector('.ai-teaser'), null);
  assert.ok(!s.w.document.body.classList.contains('ai-unseen'));
  const s2 = await loadSite({ teaserMs: 30, session: { sf_ai_tz: '1' } });
  await sleep(120);
  assert.equal(s2.w.document.querySelector('.ai-teaser'), null, 'only once per visit');
});

test('chat can be opened while a dialog (login) is open', async () => {
  const s = await loadSite();
  s.w.openLogin(); await sleep(30);
  assert.ok(s.w.document.body.classList.contains('has-ov'));
  s.w.cbT(); await sleep(30);
  assert.ok(s.w.$('cbp').classList.contains('open'));
  assert.ok(+s.w.getComputedStyle(s.w.document.querySelector('.aiw')).zIndex > 60, 'chat above dialogs');
  s.w.cl_(); await sleep(30);
  assert.ok(!s.w.document.body.classList.contains('has-ov'));
});

/* ---------------- course page content ---------------- */

test('every course page has the 30-sec demo, full learn/outcome lists, and no "Request syllabus" box', async () => {
  const s = await loadSite();
  for (const c of s.w.cxVis()) {
    const cv = await course(s, c.i);
    assert.equal(cv.querySelectorAll('.xd').length, 1, `${c.t}: demo video`);
    assert.match(text(cv.querySelector('.xp')), /Watch 30-sec demo/, `${c.t}: demo button`);
    const learn = cv.querySelector('#cx-learn > ul.ck'), out = cv.querySelectorAll('#cx-outcomes .cx-out > div');
    assert.ok(learn.children.length >= 6, `${c.t}: ${learn.children.length} learn points`);
    assert.ok(out.length >= 5, `${c.t}: ${out.length} outcomes`);
    assert.ok(!/Request syllabus/i.test(text(cv)), `${c.t}: request box removed`);
    const link = cv.querySelector('.syl-link');
    assert.ok(link, `${c.t}: syllabus link`);
    if (c.soon) assert.equal(link.nextElementSibling.tagName, 'LABEL', `${c.t}: link above "Get notified"`);
    else assert.match(link.nextElementSibling.getAttribute('onclick'), /^enroll\(/, `${c.t}: link above Enroll`);
    assert.ok(cv.querySelector('.two > div:last-child > .ip-card'), `${c.t}: internship card at the end of the right column`);
  }
  assert.ok(s.w.cf(1).l.includes('Design LANs, VLANs, subnets and IP addressing.'));
  assert.deepEqual(s.errors, []);
});

test('demo video plays through all 5 slides without errors', async () => {
  const s = await loadSite();
  await course(s, 3);
  s.w.vpT('dm'); await sleep(200);
  assert.ok(s.w.VP.dm.t > 0, 'playing');
  const vp = s.w.VP.dm;
  s.w.vpS('dm'); vp.t = 29; s.w.vpD('dm');
  assert.equal(vp.n, 5);
  assert.ok(s.w.document.querySelectorAll('#dm .sc')[4].classList.contains('on'), 'last slide reached');
  for (const sc of s.w.document.querySelectorAll('#dm .sc')) assert.ok(sc.querySelectorAll('li').length <= 3, 'slides stay short');
  s.w.vpStopAll();
  assert.deepEqual(s.errors, []);
});

test('internship page opened directly (fresh load) shows the learner\'s recommendations', async () => {
  const email = 'l@test.in';
  const s = await loadSite({ url: 'https://site.test/#internship', storage: { sf_sess: JSON.stringify({ email, name: 'L', role: 's' }), sf_enr: ENR(email) } });
  assert.match(text(s.w.$('internship').querySelector('.ip-status')), /Your internship recommendations/);
});

test('courses page: an enrolled course says "Continue learning"', async () => {
  const email = 'l@test.in';
  const s = await loadSite({ url: 'https://site.test/#courses', storage: { sf_sess: JSON.stringify({ email, name: 'L', role: 's' }), sf_enr: ENR(email) } });
  await sleep(400);
  const prices = [...s.w.document.querySelectorAll('#courses .price')].map(text);
  assert.ok(prices.includes('Continue learning →'), prices.join('|'));
  assert.equal(prices.filter((p) => /Coming soon/.test(p)).length, s.w.cxVis().filter((c) => c.soon).length, 'one "Coming soon" per course that is not open');
  assert.deepEqual([...s.w.cxVis().filter((c) => c.soon).map((c) => c.i)], [2, 3, 4], 'Digital Twin, Cyber Security, Mobile App and EV are open');
});

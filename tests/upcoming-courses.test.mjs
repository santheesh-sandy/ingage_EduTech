// Coming-soon courses 18–21 (Architectural Visualization, Industrial Metaverse, Game Development, Graphic Design):
// pictures, course pages, careers, jobs, chatbot; no enrolment until slides and videos are on S3.
// (Course 22, Data Warehousing, was announced with them and is now open: tests/dw-course.test.mjs.)
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSite, sleep } from './helpers.mjs';

const NEW = { 18: 'Architectural Visualization', 19: 'Industrial Metaverse', 20: 'Game Development', 21: 'Graphic Design',
  23: 'Embedded System Design, C & Micro Controller Programming', 24: 'Software Testing & Automation', 25: 'UI/UX Design' };

test('the announced courses are listed as coming soon, after the open courses, each with a picture and course details', async () => {
  const s = await loadSite({ url: 'https://site.test/#courses' });
  await sleep(60);
  const V = s.w.cxVis();
  for (const [i, t] of Object.entries(NEW)) {
    const c = s.w.cf(+i);
    assert.equal(c.t, t);
    assert.ok(c.soon && !c.hid && V.includes(c), t + ' visible as coming soon');
    assert.match(c.img, /^data:image\/jpeg;base64,/, t + ' picture');
    assert.ok(c.l.length >= 6 && c.o.length >= 5 && c.jr.length >= 3 && c.sal.length >= 3, t + ' details');
    assert.ok(s.w.COURSE_INFO[i] && s.w.COURSE_OVERVIEW[i], t + ' page sections');
    assert.ok(c.jobs && c.jobs.length == 2, t + ' job listings');
    assert.ok(s.w.UPCOMING_S3[i].startsWith('https://ingage-lms.s3.ap-south-1.amazonaws.com/'), t + ' S3 folder');
    assert.equal(c.cur, undefined, t + ' has no lessons yet');
  }
  const order = V.map((c) => c.i), firstSoon = order.findIndex((i) => s.w.cf(i).soon);
  assert.ok(order.slice(firstSoon).every((i) => s.w.cf(i).soon), 'coming soon after every open course');
  const card = [...s.w.document.querySelectorAll('#cl .cc')].find((e) => /Game Development/.test(e.textContent));
  assert.match(card.querySelector('.price').textContent, /Coming soon/);
  assert.deepEqual(s.errors, []);
});

test('a coming-soon course page shows its overview and careers but no enrolment', async () => {
  const s = await loadSite();
  s.w.show(21); await sleep(60);
  const cv = s.w.$('cv');
  assert.match(cv.querySelector('#cx-overview .cx-biz').textContent, /How it is used in business/);
  assert.match(cv.querySelector('#cx-careers').textContent, /Junior Graphic Designer.*LPA/);
  assert.match(cv.textContent, /Coming soon/i);
  assert.deepEqual(s.errors, []);
});

test('the chatbot points game, design, archviz and metaverse interests to the new courses', async () => {
  const s = await loadSite({ chatApi: '' });
  s.open(); await sleep(30);
  for (const [q, want] of [['Tell me about the graphic design course', /Graphic Design/], ['Tell me about the game development course', /Game Development/],
    ['Tell me about the industrial metaverse course', /Industrial Metaverse/],
    ['Tell me about the architectural visualization course', /Architectural Visualization/],
    ['Tell me about the embedded systems course', /Embedded System Design/], ['I want to learn microcontroller programming in C', /Embedded System Design/],
    ['Tell me about the software testing course', /Software Testing/], ['Do you teach Selenium test automation?', /Software Testing/],
    ['Tell me about the UI/UX design course', /UI\/UX Design/], ['I want to learn Figma', /UI\/UX Design/]]) {
    await s.ask(q);
    assert.match(s.lastText(), want, q);
  }
});

test('the three newest courses appear in the background table and their career roles say the course is not open yet', async () => {
  const s = await loadSite();
  for (const [i, role] of [[23, 'Firmware Engineer'], [24, 'Automation Test Engineer'], [25, 'UX Designer']]) {
    const r = s.w.rolesFor('Can I become a ' + role + '?', [i]).find((x) => x.role == role);
    assert.ok(r && r.notOpen, role + ' role, not open yet');
    assert.ok(s.w.AISAL[i].length >= 3 && s.w.AIDEF[i].jr.length >= 3, NEW[i] + ' salaries and roles');
    assert.ok(s.w.CJOBS[i] && s.w.CPATH[i] && s.w.RSD[i], NEW[i] + ' careers content');
  }
  s.w.show(24); await sleep(60);
  assert.match(s.w.$('cv').querySelector('#cx-careers').textContent, /Automation Test Engineer.*LPA/);
  assert.deepEqual(s.errors, []);
});

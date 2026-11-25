// Coming-soon courses 18–22 (Architectural Visualization, Industrial Metaverse, Game Development, Graphic Design,
// Data Warehousing): pictures, course pages, careers, jobs, chatbot; no enrolment until slides and videos are on S3.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSite, sleep } from './helpers.mjs';

const NEW = { 18: 'Architectural Visualization', 19: 'Industrial Metaverse', 20: 'Game Development', 21: 'Graphic Design', 22: 'Data Warehousing' };

test('the five announced courses are listed as coming soon, after the open courses, each with a picture and course details', async () => {
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
  s.w.show(22); await sleep(60);
  const cv = s.w.$('cv');
  assert.match(cv.querySelector('#cx-overview .cx-biz').textContent, /How it is used in business/);
  assert.match(cv.querySelector('#cx-careers').textContent, /Junior Data Engineer.*LPA/);
  assert.match(cv.textContent, /Coming soon/i);
  assert.deepEqual(s.errors, []);
});

test('the chatbot points game, design, archviz, metaverse and data warehouse interests to the new courses', async () => {
  const s = await loadSite({ chatApi: '' });
  s.open(); await sleep(30);
  for (const [q, want] of [['Tell me about the graphic design course', /Graphic Design/], ['Tell me about the game development course', /Game Development/],
    ['Tell me about the data warehousing course', /Data Warehousing/], ['Tell me about the industrial metaverse course', /Industrial Metaverse/],
    ['Tell me about the architectural visualization course', /Architectural Visualization/]]) {
    await s.ask(q);
    assert.match(s.lastText(), want, q);
  }
});

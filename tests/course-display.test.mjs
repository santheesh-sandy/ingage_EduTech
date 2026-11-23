// Courses page and course pages: open courses first, coming soon last; prices on every card and page; a course overview.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSite, sleep } from './helpers.mjs';

const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');

test('the courses page lists open courses first and coming-soon courses last, each card with its price', async () => {
  const s = await loadSite({ url: 'https://site.test/#courses' });
  await sleep(60);
  const cards = [...s.w.document.querySelectorAll('#cl .cc')];
  const soon = cards.map((c) => /Coming soon/.test(text(c.querySelector('.price'))));
  assert.ok(soon.includes(true) && soon.includes(false));
  assert.equal(soon.indexOf(true), soon.lastIndexOf(false) + 1, 'every coming-soon card comes after every open card');
  for (const c of cards) assert.match(text(c.querySelector('.cfee')), /^₹[\d,]+ incl\. GST$/, text(c.querySelector('h3')));
  assert.match(text(cards[0].querySelector('.cfee')), /₹4,999/);
  // the same order is used everywhere (chatbot, landing): coming soon last
  const V = s.w.cxVis();
  assert.ok(V.findIndex((c) => c.soon) > V.findLastIndex((c) => !c.soon));
});

test('every course page shows the price at the top and an overview with business context, topics and outcomes', async () => {
  const s = await loadSite();
  for (const c of s.w.cxVis()) {
    s.w.show(c.i); await sleep(40);
    const cv = s.w.$('cv');
    assert.match(text(cv.querySelector('.pill.pfee')), new RegExp(s.w.fee(c.f).replace(/[₹,]/g, '.') + ' incl\\. GST'), c.t + ': price at the top');
    const ov = cv.querySelector('#cx-overview');
    if (!ov) { assert.ok(c.soon, c.t + ': only coming-soon pages may skip it'); continue; }
    assert.ok(text(ov.querySelector('.cx-intro')).length > 60, c.t + ': short description');
    assert.match(text(ov.querySelector('.cx-biz')), /How it is used in business.{60,}/, c.t + ': business context');
    assert.ok(ov.querySelectorAll('.cx-box')[0].querySelectorAll('li').length >= 3, c.t + ': main topics');
    assert.equal(ov.querySelectorAll('.cx-box')[1].querySelectorAll('li').length, Math.min(3, c.o.length), c.t + ': outcomes');
    assert.match(text(ov.querySelector('.cx-feeline')), /Course fee ₹[\d,]+ incl\. GST/);
  }
  assert.deepEqual(s.errors, []);
});

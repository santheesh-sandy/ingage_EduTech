// Admin → Courses saved online (Supabase table public.site_courses): every visitor sees them; staff changes are uploaded.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSite, sleep } from './helpers.mjs';

const SB = { url: 'https://proj.supabase.test', key: 'pk_test' };
const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
const ONLINE = {
  id: 101, deleted: false,
  data: { i: 101, cx: 1, d: 'Cloud', e: '☁️', t: 'Cloud Computing with AWS', h: 30, f: 3999, s: 'Learn AWS basics.', l: ['Use EC2'], o: ['Deploy an app'], k: ['AWS'],
    cur: [{ u: 'm1', t: 'Getting started', ls: [{ u: 'l1', ty: 'video', t: 'Intro', du: '5 min', url: 'https://example.test/intro.mp4', tx: '' }], qs: [] }] },
};
function rest(rows) {
  const seen = [];
  return { seen, net: async (u, o) => {
    if (!u.includes('/rest/v1/site_courses')) return null;
    seen.push({ u, headers: o.headers });
    return { ok: true, status: 200, json: async () => rows };
  } };
}

test('every visitor (not signed in) gets the courses saved online, and edits to built-in courses', async () => {
  const R = rest([ONLINE, { id: 7, deleted: false, data: { i: 7, f: 3499 } }]);
  const s = await loadSite({ supabase: SB, net: R.net, url: 'https://site.test/#courses' });
  await sleep(120);
  assert.ok(R.seen.length >= 1, 'course list read from Supabase');
  assert.equal(R.seen[0].headers.apikey, 'pk_test');
  const c = s.w.cf(101);
  assert.ok(c && c.t == 'Cloud Computing with AWS', 'online course added');
  assert.ok(s.w.cxVis().includes(c));
  assert.equal(s.w.cf(7).f, 3499, 'online change to a built-in course applied');
  assert.equal(s.w.cf(7).t, 'Mobile App Development', 'the rest of the built-in course is kept');
  assert.ok([...s.w.document.querySelectorAll('#cl .cc h3')].some((h) => text(h) == 'Cloud Computing with AWS'), 'shown on the course list');
  assert.deepEqual(s.errors, []);
  // next visit starts from the saved copy even before the server answers
  const s2 = await loadSite({ supabase: SB, net: async () => new Promise(() => {}), storage: { sf_cx_srv: JSON.stringify([ONLINE]) } });
  assert.ok(s2.w.cf(101), 'cached copy used for a fast start');
});

test('a course removed online disappears for visitors; built-in courses are never removed', async () => {
  const R = rest([{ id: 101, deleted: true, data: {} }, { id: 6, deleted: true, data: {} }]);
  const s = await loadSite({ supabase: SB, net: R.net, storage: { sf_cx_srv: JSON.stringify([ONLINE]) } });
  await sleep(120);
  assert.equal(s.w.cf(101), undefined);
  assert.ok(s.w.cf(6), 'Cyber Security Essentials (built in) stays');
});

test('staff: saving in Admin → Courses uploads the change; local-only changes are uploaded too; the list says where it is saved', async () => {
  const R = rest([]);
  const local = { list: [{ i: 102, cx: 1, d: 'Design', e: '🎨', t: 'Old local course', h: 10, f: 999, s: 'x', l: ['a'], o: ['b'], k: [], cur: [] }] };
  const s = await loadSite({ supabase: SB, net: R.net, storage: { sf_cx: JSON.stringify(local) } });
  await sleep(80);
  const ups = [];
  // fake Supabase client: records uploads; any read (the staff dashboard also reads) returns an empty result
  const empty = () => { const q = new Proxy(function () {}, { get: (_, k) => (k == 'then' ? (ok) => ok({ data: [], error: null }) : () => q), apply: () => q }); return q; };
  s.w.sbGet = (cb) => cb({ from: (t) => new Proxy({}, { get: (_, k) => (k == 'upsert' ? (rows) => { ups.push({ t, rows }); return Promise.resolve({ error: null }); } : () => empty()) }), rpc: () => empty(), auth: { getSession: () => Promise.resolve({ data: {} }) } });
  // not staff yet: nothing is uploaded and the list warns
  s.w.AT = 'crs';
  assert.match(text(s.w.document.createRange().createContextualFragment(s.w.cxList()).firstChild), /Saved in this browser only/);
  s.w.courseSyncPush(true);
  assert.equal(ups.length, 0);
  // staff signed in: the browser-only course is uploaded
  s.w.CLOUD.uid = 'u1'; s.w.CLOUD.staff = true;
  s.w.courseSyncPush(true); await sleep(20);
  assert.equal(ups.length, 1);
  assert.equal(ups[0].t, 'site_courses');
  assert.deepEqual([...ups[0].rows.map((r) => [r.id, r.data.t, r.deleted])], [[102, 'Old local course', false]]);
  assert.match(text(s.w.document.createRange().createContextualFragment(s.w.cxList()).firstChild), /Saved online/);
  // nothing changed → nothing uploaded again
  s.w.courseSyncPush(true); await sleep(20);
  assert.equal(ups.length, 1);
  // a status change in Admin is uploaded
  s.w.cxStatus(7, 'soon'); await sleep(120);
  assert.equal(ups.length, 2);
  assert.ok(ups[1].rows.some((r) => r.id == 7 && r.data.soon == 1));
  // removing the local course marks it deleted online
  const st = JSON.parse(s.w.localStorage.getItem('sf_cx')); st.list = st.list.filter((x) => x.i != 102); s.w.localStorage.setItem('sf_cx', JSON.stringify(st));
  s.w.courseSyncPush(true); await sleep(20);
  assert.ok(ups[2].rows.some((r) => r.id == 102 && r.deleted === true));
  assert.deepEqual(s.errors, []);
});

test('a new course made in Admin gets a number from 101, so it never clashes with courses added in code', async () => {
  const s = await loadSite();
  s.w.cxNew();
  assert.ok(s.w.CED.i >= 101, 'new course number ' + s.w.CED.i);
});

test('slide viewer settings exist before the first render (opening the site straight on My Learning)', async () => {
  const { readFileSync } = await import('node:fs');
  const html = readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
  const main = html.indexOf('var CIMG=[');
  for (const v of ['DECK_V', 'DECK_SBX', 'DECK_SCROLL', 'DECK_SHIELD']) {
    const at = html.indexOf('var ' + v + '=');
    assert.ok(at > 0 && at < main, v + ' is defined at the top of the main script');
  }
});

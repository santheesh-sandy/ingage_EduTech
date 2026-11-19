// Course slides/videos from Google Drive, and the chatbot's course knowledge (from the slides).
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSite, sleep } from './helpers.mjs';
import { systemPrompt } from '../supabase/functions/_shared/chat-core.js';

const EMAIL = 'learner@test.in';
const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
async function learner() {
  const s = await loadSite({ storage: { sf_enr: JSON.stringify({ [EMAIL]: { 1: { txn: 'T', inv: 'I', date: '19/11/2026', amt: 4999, list: 4999, pm: 'UPI', done: [] } } }) } });
  s.w.US = { email: EMAIL, name: 'L', role: 's' };
  s.w.LC = 1; s.w.location.hash = '#learn'; await sleep(60);
  return s;
}
const lessons = (w) => { const f = []; w.mods(w.cf(1)).forEach((m) => m.ls.forEach((l) => f.push(l))); return f; };
// lessons unlock in order: mark everything before the target lesson done, then open it
async function open(s, l) {
  const ids = lessons(s.w).map((x) => x.id), all = JSON.parse(s.w.localStorage.getItem('sf_enr'));
  all[EMAIL][1].done = ids.slice(0, ids.indexOf(l.id)); s.w.localStorage.setItem('sf_enr', JSON.stringify(all));
  s.w.LS = l.id; s.w.renderLearn(); await sleep(20); return s.w.$('lw');
}

/* ---------- Drive mapping ---------- */

test('every slide deck and video lesson maps to a Google Drive file, and every Drive file is used', async () => {
  const s = await loadSite();
  const DM = s.w.DRIVE_MEDIA, L = lessons(s.w);
  const decks = L.filter((l) => l.pp).map((l) => DM.deckOf(l.pp));
  assert.equal(decks.length, 30);
  for (const k of decks) assert.ok(DM.slides[k] && DM.slides[k][0] && DM.slides[k][1], 'deck ' + k);
  assert.deepEqual([...new Set(decks)].sort(), Object.keys(DM.slides).sort(), 'all 30 decks used');
  const vids = L.filter((l) => l.v).flatMap((l) => [].concat(l.v)).map((p) => DM.vidNo(p));
  for (const n of vids) assert.ok(DM.videos[n], 'video ' + n);
  assert.deepEqual([...new Set(vids)].sort((a, b) => a - b), Object.keys(DM.videos).map(Number).sort((a, b) => a - b), 'all 25 videos used');
  for (const id of Object.values(DM.slides).flat().concat(Object.values(DM.videos).map((v) => v[0]))) assert.match(id, /^[\w-]{25,}$/);
});

test('a slide lesson shows the PDF from Drive with full-screen and PPT download links', async () => {
  const s = await learner();
  const l = lessons(s.w).find((x) => x.pp && x.pp.includes('M7-2'));
  const lw = await open(s, l);
  const f = lw.querySelector('.pv iframe');
  assert.equal(f.getAttribute('src'), 'https://drive.google.com/file/d/1T-K70LVKkVhuhxqNdlbISGkkOEbo1Icw/preview');
  const links = [...lw.querySelectorAll('.pvb a')].map((a) => [text(a), a.getAttribute('href')]);
  assert.deepEqual(links, [
    ['⤢ Full screen', 'https://drive.google.com/file/d/1T-K70LVKkVhuhxqNdlbISGkkOEbo1Icw/view'],
    ['⬇ Download PPT', 'https://drive.google.com/uc?export=download&id=1qj3dtNnAlN_2fucp4UMQieEeWnCu5rWj'],
  ]);
  assert.deepEqual(s.errors, []);
});

test('a video lesson plays from Drive (both parts of a two-part lesson)', async () => {
  const s = await learner();
  const l = lessons(s.w).find((x) => Array.isArray(x.v) && x.v.length == 2);
  const lw = await open(s, l);
  assert.equal(lw.querySelectorAll('video.uv').length, 0, 'no local <video> left');
  const fr = [...lw.querySelectorAll('.dv iframe')].map((f) => f.getAttribute('src'));
  assert.deepEqual(fr, ['https://drive.google.com/file/d/1NRhMlMShfPZ5Z5l7K8ehf8jhPSnjVFly/preview', 'https://drive.google.com/file/d/1tIHxrJAkAs1BGdf_4Omg3s-ypMYRZejB/preview']);
  assert.match(text(lw), /🎬 Static routing · from Google Drive/);
  assert.deepEqual([...lw.querySelectorAll('h4')].map(text).filter((t) => /^Part/.test(t)), ['Part 1 of 2: Static routing', 'Part 2 of 2: Static (continued) and dynamic routing']);
  assert.ok([...lw.querySelectorAll('button')].some((b) => /Mark complete/.test(b.textContent)), 'learner can mark it complete');
  assert.ok(!/Video not found/.test(text(lw)));
});

test('turning Drive off keeps the local files (slides/…, videos/…)', async () => {
  const s = await learner();
  s.w.DRIVE_MEDIA.on = false;
  const lw = await open(s, lessons(s.w).find((x) => x.pp));
  assert.match(lw.querySelector('.pv iframe').getAttribute('src'), /^slides\/pdf\/M1-1\.pdf/);
});

/* ---------- course knowledge ---------- */

test('slide knowledge is in the chatbot knowledge base', async () => {
  const s = await loadSite();
  const KB = s.w.COURSE_KB;
  assert.equal(Object.keys(KB.decks).length, 30);
  assert.equal(KB.software.length, 11);
  assert.ok(s.w.DOCS.some((d) => /Module 7 .* Active Directory Domain Services/.test(d[0])));
  for (const [q, re] of [
    ['What is NTDS.dit?', /NTDS\.dit/],
    ['What is the Host-only network adapter used for?', /Host-only/i],
    ['difference between SAM and NTDS.dit', /SAM|NTDS/],
    ['What is a Host-only adapter in VirtualBox?', /Host-only/i],
    ['What does NPS do for VPN?', /NPS|RADIUS/],
    ['What are the types of group policy?', /Local Group Policy|OU-level|Domain-level|Site-level/],
  ]) assert.match(s.w.kAnswer(q), re, q);
});

test('chatbot answers hardware and software questions for the course', async () => {
  const s = await loadSite();
  s.open(); await sleep(30);
  const n = s.calls.length;
  await s.ask('What hardware do I need for this course?');
  assert.match(s.lastText(), /8 GB RAM.*256 GB SSD/);
  assert.match(s.lastText(), /Intel Core i5 or Core i7/);
  await s.ask('Which software is used in the networking course?');
  for (const sw of ['Cisco Packet Tracer', 'GNS3', 'Wireshark', 'Oracle VirtualBox', 'Windows Server 2019', 'Ubuntu Linux']) assert.ok(s.lastText().includes(sw), sw);
  await s.ask('What are the laptop specs required?');
  assert.match(s.lastText(), /2 GB graphics card/);
  assert.equal(s.calls.length, n, 'answered without the AI');
  await s.ask('What is computer networking?');
  assert.doesNotMatch(s.lastText(), /256 GB SSD/, 'not mistaken for a hardware question');
  assert.deepEqual(s.errors, []);
});

test('hardware question on another course page is not answered with the networking spec', async () => {
  const s = await loadSite({ url: 'https://site.test/#course' });
  s.w.CVI = 4; s.open(); await sleep(30);
  await s.ask('What laptop specs do I need for this course?');
  assert.doesNotMatch(s.lastText(), /256 GB SSD/);
});

test('module answers include key points and software from the slides', async () => {
  const s = await loadSite();
  const h = s.w.aiModN(s.w.cf(1), 9);
  assert.match(h, /Key points from the slides/);
  assert.match(h, /VPN/);
  assert.match(h, /RRAS \+ NPS/);
  assert.match(s.w.aiModN(s.w.cf(1), 4), /Wireshark/);
});

test('the live AI receives the course material (hardware, software, related slides)', async () => {
  const s = await loadSite();
  s.open(); await sleep(30);
  await s.ask('Can you explain step by step how to let a remote employee connect through VPN with NPS?');
  const m = s.calls.at(-1).body.courseMaterial;
  assert.ok(m, 'material sent');
  assert.match(m.hours, /60 hours/);
  assert.ok(m.hardware.some((x) => /8 GB RAM/.test(x)));
  assert.ok(m.software.some((x) => /RRAS \+ NPS/.test(x)));
  assert.ok(m.relatedSlides.some((x) => /Module 9/.test(x)), 'VPN slides selected');
  assert.equal(m.modules.length, 10);
  const p = systemPrompt({ courseMaterial: m });
  assert.match(p, /Official IT Network System Administrator course material/);
  assert.match(p, /8 GB RAM/);
});

test('questions about another course do not get the networking material', async () => {
  const s = await loadSite({ url: 'https://site.test/#course' });
  s.w.CVI = 6; s.open(); await sleep(30);
  await s.ask('Is this course good for someone who wants to work in a SOC at night?');
  assert.equal(s.calls.at(-1).body.courseMaterial, null);
});

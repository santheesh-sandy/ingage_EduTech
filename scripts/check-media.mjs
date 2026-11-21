// Checks that every lesson slide deck and video of the IT Network course is reachable online.
// For each lesson it builds the same addresses the site uses (public/drive-media.js) and fetches
// the first bytes: S3 PDF (%PDF), S3 PPTX (PK zip), S3 video (MP4 "ftyp"), plus the Google Drive
// fallback for every video that S3 does not have. Run: npm run check-media
import { JSDOM, VirtualConsole } from 'jsdom';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = (f) => readFileSync(join(root, 'public', f), 'utf8');
const html = pub('index.html')
  .replace(/var CFG=\{supabase:\{url:'[^']*',key:'[^']*'\}/, "var CFG={supabase:{url:'',key:''}")
  .replace(/<script src="https?:[^"]+"><\/script>/g, '')
  .replace(/<script src="([\w.-]+\.js)"><\/script>/g, (_, f) => '<script>' + pub(f) + '</script>')
  .replace(/<link rel="stylesheet" href="([\w.-]+\.css)">/g, '');
const dom = new JSDOM(html, {
  runScripts: 'dangerously', url: 'https://site.test/#home', pretendToBeVisual: true, virtualConsole: new VirtualConsole(),
  beforeParse(w) { w.fetch = async () => ({ ok: false, status: 500, json: async () => ({}) }); w.scrollTo = () => {}; w.alert = () => {}; w.Swal = { fire: () => Promise.resolve({}), close() {}, isVisible: () => false }; },
});
await new Promise((r) => setTimeout(r, 100));
const w = dom.window, DM = w.DRIVE_MEDIA;

const lessons = [];
w.mods(w.cf(1)).forEach((m, mi) => m.ls.forEach((l) => lessons.push({ ...l, mod: mi + 1 })));
// courses built from a curriculum (e.g. Cyber Security Essentials): every slide/video lesson with a link
const cur = [];
w.C.filter((c) => c.cur && c.cur.length).forEach((c) => c.cur.forEach((m, mi) => m.ls.forEach((x) => {
  if (x.url && (x.ty == 'doc' || x.ty == 'video')) cur.push({ name: c.t + ' · M' + (mi + 1) + ' · ' + x.t, ty: x.ty, url: x.url });
})));
w.close();

const MAGIC = { pdf: (b) => b.startsWith('%PDF'), pptx: (b) => b.startsWith('PK'), mp4: (b) => b.slice(4, 8) == 'ftyp' };
async function probe(url, kind) {
  try {
    const r = await fetch(url, { headers: { Range: 'bytes=0-15' }, redirect: 'follow', signal: AbortSignal.timeout(30000) });
    const buf = Buffer.from(await r.arrayBuffer()).subarray(0, 16).toString('latin1');
    const size = (r.headers.get('content-range') || '').split('/')[1] || r.headers.get('content-length');
    if (!r.ok) return { ok: false, why: 'HTTP ' + r.status };
    if (!MAGIC[kind](buf)) return { ok: false, why: 'not a ' + kind + ' file (' + (r.headers.get('content-type') || '?') + ')' };
    return { ok: true, size: size ? (size / 1048576).toFixed(1) + ' MB' : '' };
  } catch (e) { return { ok: false, why: e.name == 'TimeoutError' ? 'timed out' : e.message }; }
}
// Drive: a public file's preview page answers 200 on drive.google.com; private/missing ones redirect to sign-in or 404
async function probeDrive(id) {
  try {
    const r = await fetch(DM.preview(id), { redirect: 'manual', signal: AbortSignal.timeout(30000) });
    if (r.status == 200) return { ok: true };
    const loc = r.headers.get('location') || '';
    return { ok: false, why: 'HTTP ' + r.status + (/accounts\.google/.test(loc) ? ' (needs sign-in: not shared publicly)' : '') };
  } catch (e) { return { ok: false, why: e.message }; }
}

const jobs = [];
for (const l of lessons) {
  const name = 'M' + l.mod + ' · ' + (l.t || l.id);
  if (l.pp) {
    const k = DM.deckOf(l.pp);
    jobs.push({ name, what: 'slides PDF ' + k, run: () => probe(DM.s3Slide(k, 1), 'pdf'), url: DM.s3Slide(k, 1) });
    jobs.push({ name, what: 'slides PPTX ' + k, run: () => probe(DM.s3Slide(k), 'pptx'), url: DM.s3Slide(k) });
  }
  for (const p of [].concat(l.v || [])) {
    const n = DM.vidNo(p), hit = DM.videoOf(p);
    jobs.push({ name, what: 'video ' + n, url: DM.s3Video(p), run: async () => {
      const s3 = await probe(DM.s3Video(p), 'mp4');
      if (s3.ok) return { ...s3, via: 'S3' };
      if (!hit) return { ok: false, why: 'S3: ' + s3.why + '; no Drive fallback' };
      const dr = await probeDrive(hit[0]);
      return dr.ok ? { ok: true, via: 'Drive fallback', warn: 'S3: ' + s3.why } : { ok: false, why: 'S3: ' + s3.why + '; Drive: ' + dr.why };
    } });
  }
}
for (const x of cur) {
  const kind = x.ty == 'video' ? 'mp4' : /\.pdf(\?|$)/i.test(x.url) ? 'pdf' : 'pptx';
  jobs.push({ name: x.name, what: x.ty == 'video' ? 'video' : 'slides ' + kind.toUpperCase(), url: x.url, run: () => probe(x.url, kind) });
}
// also check every Drive video id on its own, so the fallbacks are known good before they are needed
for (const [n, [id, t]] of Object.entries(DM.videos)) jobs.push({ name: 'Drive fallback', what: 'video ' + n + ' ' + t, url: DM.view(id), run: () => probeDrive(id) });

const results = new Array(jobs.length);
let next = 0;
await Promise.all(Array.from({ length: 8 }, async () => { while (next < jobs.length) { const i = next++; results[i] = await jobs[i].run(); } }));

let bad = 0, warn = 0;
jobs.forEach((j, i) => {
  const r = results[i];
  if (!r.ok) bad++; else if (r.warn) warn++;
  const tag = !r.ok ? 'FAIL' : r.warn ? 'WARN' : ' ok ';
  console.log(`[${tag}] ${j.name} — ${j.what}${r.via ? ' (' + r.via + ')' : ''}${r.size ? ' ' + r.size : ''}${r.why ? ' — ' + r.why : ''}${r.warn ? ' — ' + r.warn : ''}${!r.ok || r.warn ? '\n        ' + j.url : ''}`);
});
console.log(`\n${jobs.length} checks: ${jobs.length - bad - warn} ok, ${warn} played from the Drive fallback, ${bad} failed.`);
process.exit(bad ? 1 : 0);

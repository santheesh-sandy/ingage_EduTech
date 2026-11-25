// IoT & Sensor Integration, Applications (ESP32) (course 16): 31 decks + 34 videos, picture, MCQs, capstones, careers, chatbot,
// and the video backup: a video not yet in this course's S3 folder plays the same file from the Internet of Things folder.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSite, sleep } from './helpers.mjs';

const B = 'https://ingage-lms.s3.ap-south-1.amazonaws.com/IoT+%26+Sensor+Integration%2C+Applications%2C+(ESP32)/';
const IOT = 'https://ingage-lms.s3.ap-south-1.amazonaws.com/Internet+of+Things/Videos/';

test('the course is open with 15 modules, 31 decks, 34 videos (each with a backup copy), a picture and an MCQ test per module', async () => {
  const s = await loadSite();
  const c = s.w.cf(16);
  assert.equal(c.t, 'IoT & Sensor Integration, Applications (ESP32)');
  assert.ok(!c.soon && !c.hid && s.w.cxVis().includes(c));
  assert.match(c.img, /^data:image\/jpeg;base64,/, 'course picture');
  const ms = s.w.mods(c), all = ms.flatMap((m) => m.ls);
  assert.equal(ms.length, 15);
  const decks = all.filter((l) => l.cx && l.cx.ty == 'doc').map((l) => l.cx.url);
  assert.equal(new Set(decks).size, 31);
  assert.equal(decks[2], B + 'Slides/Module_02_IoT_Fundamentals_Architecture_Sensors_Microcontrollers_Part1.pptx');
  const vids = all.filter((l) => l.cx && l.cx.ty == 'video');
  assert.equal(vids.length, 34);
  assert.deepEqual([...vids.map((l) => +l.t.match(/Part (\d+)/)[1])].sort((a, b) => a - b), Array.from({ length: 34 }, (_, i) => i + 1));
  const twilio = vids.find((l) => /Part 20 /.test(l.t));
  assert.equal(twilio.cx.url, B + 'Videos/Part+20+-+Twilio.mp4');
  assert.equal(twilio.cx.alt, IOT + 'Part+20+-+Twilio.mp4');
  const q = ms.flatMap((m) => s.w.QSET[m.ls.at(-1).id]);
  assert.equal(q.length, 75);
  assert.equal(new Set(q.map((x) => x[0])).size, 75);
  for (const [t, o, a] of q) assert.ok(t && o.length == 4 && new Set(o).size == 4 && a >= 0 && a < 4, t);
});

test('a video missing from the course folder plays its backup copy, then shows the note only if that fails too', async () => {
  const email = 'isi@test.in';
  const s = await loadSite({ url: 'https://site.test/#learn', storage: { sf_sess: JSON.stringify({ email, name: 'I', role: 's' }), sf_enr: JSON.stringify({ [email]: { 16: { done: [], amt: 4999, txn: 'T', date: '1/1/2026' } } }) } });
  await sleep(300);
  const ls = s.w.mods(s.w.cf(16)).flatMap((m) => m.ls), v1 = ls.find((l) => l.cx && l.cx.ty == 'video');
  const all = s.w.enr(); all[email][16].done = ls.slice(0, ls.indexOf(v1)).map((l) => l.id); s.w.sv('sf_enr', all); // unlock up to the video
  s.w.LC = 16; s.w.LS = v1.id;
  const lw = () => s.w.$('lw');
  s.w.renderLearn(); await sleep(20);
  let v = lw().querySelector('video.uv');
  assert.equal(v.getAttribute('src'), v1.cx.url);
  assert.equal(v.getAttribute('data-alt'), v1.cx.alt);
  v.dispatchEvent(new s.w.Event('error'));
  assert.equal(v.getAttribute('src'), v1.cx.alt, 'switched to the Internet of Things copy');
  v.dispatchEvent(new s.w.Event('error'));
  assert.match(lw().textContent, /This video is not available yet/, 'note only after the backup also fails');
  assert.deepEqual(s.errors, []);
});

test('course page, careers, own jobs; the chatbot sends sensor and motor-driver questions here', async () => {
  const s = await loadSite({ chatApi: '' });
  s.w.show(16); await sleep(60);
  const cv = s.w.$('cv');
  assert.match(cv.querySelector('#cx-overview .cx-biz').textContent, /How it is used in business/);
  assert.equal(cv.querySelectorAll('#cx-capstones .cap-card').length, 5);
  assert.match(cv.querySelector('#cx-careers').textContent, /Junior Embedded IoT Engineer.*LPA/);
  assert.ok(s.w.cf(16).jobs.map((i) => s.w.JOBS[i][0]).includes('IoT Hardware Intern'));
  assert.ok(s.w.PREP_Q[16].length >= 8);
  assert.deepEqual(s.errors, []);
  s.open(); await sleep(30);
  await s.ask('Tell me about the sensor integration course');
  assert.match(s.lastText(), /IoT &amp; Sensor Integration|IoT & Sensor Integration/);
  await s.ask('Tell me about the IoT course');
  assert.match(s.lastText(), /Internet of Things/, '"IoT" alone still means the Internet of Things course');
});

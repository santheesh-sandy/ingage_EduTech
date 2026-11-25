// Career content for every course: own job listings, career path, interview questions, and the resume layout.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSite, sleep } from './helpers.mjs';

const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
const EMAIL = 'career@test.in';
function allIds(w, ci) { return w.mods(w.cf(ci)).flatMap((m) => m.ls.map((l) => l.id)); }
async function learner(ci, pct, extra = {}) {
  const s0 = await loadSite();
  const ids = allIds(s0.w, ci), done = ids.slice(0, Math.ceil(ids.length * pct / 100));
  const s = await loadSite({ url: 'https://site.test/#home', storage: { sf_sess: JSON.stringify({ email: EMAIL, name: 'Priya Kumar', role: 's' }), sf_enr: JSON.stringify({ [EMAIL]: { [ci]: { done, amt: 4999, txn: 'T1', date: '1/1/2026' } } }), ...extra } });
  s.w.LC = ci; await sleep(50);
  return s;
}
async function career(s, tab) { s.w.NT = tab; s.w.location.hash = '#next'; await sleep(60); s.w.nxRender(); await sleep(30); return s.w.$('nx'); }

test('every open course has its own internships and jobs, and IT Network keeps its board', async () => {
  const s = await loadSite();
  const w = s.w;
  for (const c of w.cxVis()) {
    assert.ok(c.jobs && c.jobs.length >= 2, c.t + ' has listings');
    const L = c.jobs.map((i) => w.JOBS[i]);
    assert.ok(L.some((j) => /intern|trainee/i.test(j[0] + ' ' + j[1])), c.t + ' has an internship');
    if (!c.soon) assert.ok(L.some((j) => !/intern|trainee/i.test(j[0] + ' ' + j[1])), c.t + ' has a full-time role');
  }
  const net = w.cf(1).jobs.map((i) => w.JOBS[i][0]);
  assert.ok(net.includes('Network Support Intern') && net.includes('NOC Engineer (L1)'));
  assert.ok(!net.includes('PCB Design Intern'), 'IT Network does not list PCB roles');
  assert.ok(w.cf(12).jobs.map((i) => w.JOBS[i][0]).includes('NOC Engineer (L1)'), 'shared title reused, not duplicated');
  assert.equal(w.JOBS.filter((j) => j[0] == 'NOC Engineer (L1)').length, 1);
});

test('Career → Internships & jobs shows the course’s own roles and career path', async () => {
  const s = await learner(10, 70);
  const nx = await career(s, 'jobs');
  const cards = [...nx.querySelectorAll('.grid .card h3')].map(text);
  assert.ok(cards.includes('IoT Developer Intern') && cards.includes('Junior IoT Developer'), cards.join(' | '));
  assert.ok(!cards.some((t) => /Network Support Intern|Junior Network Administrator/.test(t)), 'no IT Network roles for an IoT learner');
  assert.match(text(nx), /Career path.*Junior IoT Developer.*IoT Architect.*Next learning: IoT security/);
  assert.deepEqual(s.errors, []);
});

test('placement preparation has course interview questions for every open course', async () => {
  for (const ci of [2, 6, 9, 10, 11, 12]) {
    const s = await learner(ci, 85);
    const nx = await career(s, 'prep');
    const qs = [...nx.querySelectorAll('.prep-q summary')].map(text);
    assert.ok(qs.length >= 8, 'course ' + ci + ': ' + qs.length + ' questions');
    assert.ok(!qs[0].startsWith('Why do you want'), 'course ' + ci + ' starts with technical questions');
    assert.ok(qs.some((q) => /^Why do you want the .+ role\?$/.test(q)), 'role question without a/an mistakes');
    assert.ok(qs.some((q) => /capstone/.test(q)));
  }
});

test('resume: classic layout with name, title, blue sections, dates on the right and course suggestions', async () => {
  const s = await learner(10, 40);
  s.w.lmsS({ resume: { nm: 'Priya Kumar', role: 'IoT Developer Intern', em: 'priya@example.com', ph: '+91 98765 43210', loc: 'Chennai',
    ex: 'IoT Intern, Acme Devices | Jun 2025 - Aug 2025\n- Built 12 sensor nodes with ESP32\n- Set up a Blynk dashboard for the plant',
    ed: 'B.E. Electronics and Communication | 2021 - 2025\nAnna University, Chennai\n- CGPA 8.2 / 10', la: 'English, Tamil' } });
  const nx = await career(s, 'resume');
  const r = nx.querySelector('#rsp .rsm');
  assert.equal(text(r.querySelector('h1')), 'Priya Kumar');
  assert.equal(text(r.querySelector('.rsm-r')), 'IoT Developer Intern');
  assert.match(text(r.querySelector('.rsm-c')), /Chennai \| \+91 98765 43210 \| priya@example.com/);
  assert.deepEqual([...r.querySelectorAll('h3')].map(text), ['Summary', 'Professional experience', 'Projects', 'Skills', 'Education', 'Additional information']);
  const ex = r.querySelectorAll('section')[1];
  assert.equal(text(ex.querySelector('.rsm-eh b')), 'IoT Intern, Acme Devices');
  assert.equal(text(ex.querySelector('.rsm-eh span')), 'Jun 2025 - Aug 2025');
  assert.equal(ex.querySelectorAll('li').length, 2);
  const ed = r.querySelectorAll('section')[4];
  assert.equal(text(ed.querySelector('.rsm-es')), 'Anna University, Chennai');
  assert.match(text(r.querySelectorAll('section')[0]), /Entry-level IoT developer/, 'course summary suggested');
  assert.match(text(r.querySelectorAll('section')[3]), /Arduino \| ESP32 \| Sensors and actuators/, 'skills in rows of three');
  assert.match(text(r.querySelectorAll('section')[2]), /Smart home monitor and control with Blynk/, 'capstone projects suggested');
  assert.match(text(r.querySelector('.rsm-ai')), /Certifications: Internet of Things — ingage EduTech, in progress.*Languages: English, Tamil/, 'no certificate date or ID before the course is complete');
  assert.match(s.w.RES_CSS, /#1d5fc4/);
  assert.deepEqual(s.errors, []);
});

test('resume: a completed course lists the certificate with its date and ID', async () => {
  const s = await learner(12, 100);
  s.w.lmsS({ resume: { nm: 'A B' } });
  const nx = await career(s, 'resume');
  assert.match(text(nx.querySelector('#rsp .rsm-ai')), /Computer Network through LAN & WAN — ingage EduTech, \d+ \w+ \d{4} \(ID ING-/);
});

test('resume: old one-item-per-line text still shows as a simple list', async () => {
  const s = await learner(1, 40);
  s.w.lmsS({ resume: { nm: 'A B', ex: 'Helped the IT team\nFixed printers' } });
  const nx = await career(s, 'resume');
  const ex = nx.querySelectorAll('#rsp .rsm section')[1];
  assert.equal(text(ex.querySelector('h3')), 'Professional experience');
  assert.deepEqual([...ex.querySelectorAll('li')].map(text), ['Helped the IT team', 'Fixed printers']);
  assert.equal(ex.querySelector('.rsm-eh'), null);
});

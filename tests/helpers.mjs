// Loads public/index.html (+ chat-live.js) in jsdom with a mock AI backend.
import { JSDOM, VirtualConsole } from 'jsdom';
import { afterEach } from 'node:test';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const HTML = readFileSync(join(root, 'public/index.html'), 'utf8');
const pub = (f) => readFileSync(join(root, 'public', f), 'utf8');

const OPEN = new Set();
// close every page after each test, even when an assertion failed (page timers would keep Node alive)
afterEach(() => { for (const w of OPEN) { try { w.close(); } catch {} } OPEN.clear(); });

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * @param {object} o
 * @param {string} [o.chatApi]   value for CHAT_API ('' = live AI off)
 * @param {(body:object)=>({status?:number, reply?:string}|Promise<any>)} [o.ai]  mock backend
 * @param {string} [o.url]
 * @param {object} [o.storage]   localStorage seed
 * @param {{url:string,key:string}} [o.supabase]  CFG.supabase for the page (default: off, so tests never reach the real project)
 */
export async function loadSite({ chatApi = 'https://mock.test/chat', ai, net, url = 'https://site.test/#home', storage = {}, session = {}, teaserMs = 600000, supabase = { url: '', key: '' } } = {}) {
  let html = HTML.replace(/var CFG=\{supabase:\{url:'[^']*',key:'[^']*'\}/, () => 'var CFG={supabase:' + JSON.stringify(supabase))
    .replace("var CHAT_API='';", 'var CHAT_API=' + JSON.stringify(chatApi) + ';')
    .replace(/<script src="https?:[^"]+"><\/script>/g, '')
    .replace(/<script src="([\w.-]+\.js)"><\/script>/g, (_, f) => '<script>' + pub(f) + '</script>')
    .replace(/<link rel="stylesheet" href="([\w.-]+\.css)">/g, (_, f) => '<style>' + pub(f) + '</style>');
  const errors = [], calls = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', (e) => { if (!/Not implemented/.test(e.message)) errors.push(e.message); });
  const dom = new JSDOM(html, {
    runScripts: 'dangerously', url, pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(w) {
      for (const [k, v] of Object.entries(storage)) w.localStorage.setItem(k, v);
      for (const [k, v] of Object.entries(session)) w.sessionStorage.setItem(k, v);
      w.AITEASER_MS = teaserMs;
      w.open = () => null;
      w.fetch = async (u, o = {}) => {
        if (net) { const r = await net(String(u), o); if (r) return r; } // other requests (e.g. Supabase REST) answered by the test
        if (!o.body) return { ok: false, status: 404, json: async () => ({}) };
        const body = JSON.parse(o.body); calls.push({ url: u, body, headers: o.headers });
        const r = (await (ai || defaultAi)(body)) || {};
        const status = r.status || 200;
        return { ok: status < 400, status, json: async () => ('json' in r ? r.json : { reply: r.reply }) };
      };
      w.scrollTo = () => {}; w.alert = () => {};
      w.Swal = { fire: () => Promise.resolve({}), close() {}, isVisible: () => false };
      w.addEventListener('error', (e) => errors.push(e.message));
    },
  });
  const w = dom.window;
  OPEN.add(w);
  await sleep(50);
  return {
    w, dom, calls, errors,
    open() { w.cbT(); },
    /** send a message and wait for the bot reply */
    async ask(q, ms = 650) { w.cbS(q); await sleep(ms); return this.last(); },
    last() { const b = w.document.querySelectorAll('#cbm .ai-row:not(.ai-typing) .ai-bub'); return b[b.length - 1]; },
    lastText() { return this.last().textContent.replace(/\s+/g, ' ').trim(); },
    typing() { return w.document.querySelectorAll('#cbm .ai-typing').length; },
    close() { w.close(); },
  };
}

function defaultAi(body) {
  const q = body.messages[body.messages.length - 1].content;
  return { reply: '**AI** answer for: ' + q + '\n- point one' };
}

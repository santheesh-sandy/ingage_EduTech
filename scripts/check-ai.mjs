// Sends one test question through the real backend code with your .env settings and prints the result.
// Usage: npm run check-ai -- "your question"
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from '../server/env.mjs';
import { createChatHandler, pickProvider } from '../supabase/functions/_shared/chat-core.js';

loadEnv(join(dirname(fileURLToPath(import.meta.url)), '..', '.env'));
const env = (k) => process.env[k];
const p = pickProvider(env);
if (!p) { console.error('✗ No AI key yet.\n  Open the .env file in the project folder and replace PASTE_YOUR_AI_API_KEY_HERE with your AI_API_KEY, then run this again.'); process.exit(1); }
console.log(`Provider: ${p.name} · model: ${p.model || '-'} · url: ${p.url || 'n/a'}`);
const q = process.argv.slice(2).join(' ') || 'Can I learn networking on weekends while working?';
let lastErr = '';
const chat = createChatHandler({ env, log: (m) => { lastErr = m; } });
const r = await chat(new Request('http://localhost/api/chat', {
  method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ messages: [{ role: 'user', content: q }], language: 'English', courses: [{ title: 'IT Network System Administrator', hours: 60, fee: '₹4,999 (incl. GST)', status: 'open' }] }),
}));
const j = await r.json();
if (r.ok) { console.log('✓ AI is working.\n\nQ: ' + q + '\nA: ' + j.reply); }
else {
  console.error(`✗ HTTP ${r.status}: ${j.error}\n  ${lastErr}`);
  if (/404/.test(lastErr)) console.error('  → The model name may be wrong. Check AI_MODEL (list models: GET https://generativelanguage.googleapis.com/v1beta/models?key=...).');
  if (/fetch failed|ENOTFOUND|ECONN|aborted/i.test(lastErr)) console.error('  → Could not reach the AI server: check your internet connection, proxy or firewall.');
  if (/40[13]/.test(lastErr)) console.error('  → The key was rejected or lacks access to this API/model.');
  process.exit(1);
}

// Run SQL on the Supabase project via the Management API (uses SUPABASE_ACCESS_TOKEN from .env).
//   node scripts/sb-sql.mjs supabase/migrations/xxx.sql     run a file
//   node scripts/sb-sql.mjs -e "select 1"                    run a query
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from '../server/env.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
loadEnv(join(root, '.env'));
const token = process.env.SUPABASE_ACCESS_TOKEN;
const ref = (process.env.SUPABASE_URL || '').match(/https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1];
if (!token || !ref) { console.error('Set SUPABASE_ACCESS_TOKEN and SUPABASE_URL in .env'); process.exit(1); }

const [a, b] = process.argv.slice(2);
const query = a === '-e' ? b : readFileSync(a, 'utf8');
if (!query) { console.error('usage: node scripts/sb-sql.mjs <file.sql> | -e "<sql>"'); process.exit(1); }

const r = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
  method: 'POST',
  headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
  body: JSON.stringify({ query }),
});
const text = await r.text();
if (!r.ok) { console.error('HTTP ' + r.status + ': ' + text); process.exit(1); }
console.log(text.length > 4000 ? text.slice(0, 4000) + '…' : text);

// Deploy the "chat" Edge Function and its secrets to the Supabase project in .env.
//   npm run deploy:fn            deploy code + secrets
//   npm run deploy:fn -- --code  code only
// Uploads ONLY the settings the function needs (never the access token or the whole .env).
import { writeFileSync, rmSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { loadEnv } from '../server/env.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
loadEnv(join(root, '.env'));
const E = process.env;
const ref = (E.SUPABASE_URL || '').match(/https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1];
if (!E.SUPABASE_ACCESS_TOKEN || !ref) { console.error('Set SUPABASE_ACCESS_TOKEN and SUPABASE_URL in .env first.'); process.exit(1); }

const CLI = ['--yes', 'supabase@2.20.12'];
const sb = (args) => {
  const r = spawnSync('npx', [...CLI, ...args, '--project-ref', ref], { cwd: root, stdio: 'inherit', shell: process.platform === 'win32', env: E });
  if (r.status !== 0) process.exit(r.status || 1);
};

sb(['functions', 'deploy', 'chat', '--no-verify-jwt', '--use-api']);
if (process.argv.includes('--code')) process.exit(0);

const secrets = {
  AI_API_KEY: E.AI_API_KEY, AI_MODEL: E.AI_MODEL, AI_BASE_URL: E.AI_BASE_URL, AI_REASONING_EFFORT: E.AI_REASONING_EFFORT,
  ALLOWED_ORIGINS: E.ALLOWED_ORIGINS, RATE_LIMIT: E.RATE_LIMIT,
  CHAT_DB_KEY: E.SUPABASE_SECRET_KEY, // shared rate limit + learner lookups (Supabase does not allow secret names starting with SUPABASE_)
};
const lines = Object.entries(secrets).filter(([, v]) => v != null && v !== '').map(([k, v]) => k + '=' + v);
const dir = mkdtempSync(join(tmpdir(), 'fn-')), file = join(dir, 'secrets.env');
try {
  writeFileSync(file, lines.join('\n') + '\n', { mode: 0o600 });
  console.log('Setting secrets: ' + lines.map((l) => l.split('=')[0]).join(', '));
  sb(['secrets', 'set', '--env-file', file]);
} finally { rmSync(dir, { recursive: true, force: true }); }

// Tiny .env loader (no dependencies). Existing environment variables win over the file.
import { readFileSync } from 'node:fs';

export function parseEnv(text) {
  const out = {};
  for (const raw of String(text).split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const m = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if (/^(['"]).*\1$/.test(v)) v = v.slice(1, -1);
    else v = v.replace(/\s+#.*$/, '');
    out[m[1]] = v;
  }
  return out;
}

export function loadEnv(path = '.env', target = process.env) {
  let text;
  try { text = readFileSync(path, 'utf8'); } catch { return {}; }
  const vars = parseEnv(text);
  for (const [k, v] of Object.entries(vars)) if (target[k] === undefined) target[k] = v;
  return vars;
}

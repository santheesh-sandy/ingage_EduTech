// Builds dist/index.html: one self-contained file (local .js and .css inlined) to upload to any web host.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = (f) => join(root, 'public', f);
let out = await readFile(pub('index.html'), 'utf8');

const scripts = [...out.matchAll(/<script src="([\w.-]+\.js)"><\/script>/g)];
const styles = [...out.matchAll(/<link rel="stylesheet" href="([\w.-]+\.css)">/g)];
if (!scripts.some((m) => m[1] == 'chat-live.js')) throw new Error('chat-live.js tag not found in public/index.html');
for (const [tag, file] of scripts) {
  const js = (await readFile(pub(file), 'utf8')).replace(/<\/script/gi, '<\\/script');
  out = out.replace(tag, () => '<script>\n' + js + '\n</script>');
}
for (const [tag, file] of styles) {
  const css = (await readFile(pub(file), 'utf8')).replace(/<\/style/gi, '<\\/style');
  out = out.replace(tag, () => '<style>\n' + css + '\n</style>');
}
const api = process.env.CHAT_API; // optional: bake the backend URL in, e.g. CHAT_API=https://x.supabase.co/functions/v1/chat
if (api) out = out.replace("var CHAT_API='';", () => 'var CHAT_API=' + JSON.stringify(api) + ';');
await mkdir(join(root, 'dist'), { recursive: true });
await writeFile(join(root, 'dist/index.html'), out);
console.log(`built dist/index.html (inlined ${scripts.length} scripts, ${styles.length} styles)` + (api ? ' with CHAT_API=' + api : ''));

// Smoke test: click every menu card and quick-reply chip, in every language and both chat modes, and make sure nothing throws.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSite, sleep } from './helpers.mjs';

async function clickAll(s, selector, depth = 1) {
  const labels = [...s.w.document.querySelectorAll(selector)].map((b) => b.getAttribute('onclick'));
  for (const oc of labels) {
    if (!oc || /enroll|aiEnroll|aiGo|nav\(|go\(|cbT\(/.test(oc)) continue; // these leave the chat
    s.w.eval(oc.replace(/\bthis\.dataset\.q\b/g, '""'));
    await sleep(15);
    if (depth > 1) await clickAll(s, '#cbq .ai-chip', depth - 1);
  }
}

for (const lang of ['en', 'ta', 'hi', 'te', 'kn']) {
  for (const mode of ['pre', 'post']) {
    test(`all menu cards and chips work – ${lang}/${mode}`, { timeout: 60000 }, async () => {
      const s = await loadSite();
      s.w.aiTyping = (fn) => fn(); // skip the 0.4 s typing animation
      s.open();
      s.w.aiSetLang(lang);
      if (mode == 'post') s.w.aiSetMode('post');
      await sleep(50);
      await clickAll(s, '#cbm .ai-card');
      await clickAll(s, '#cbq .ai-chip', 2);
      assert.deepEqual(s.errors, [], 'no script errors');
      assert.ok(s.w.document.querySelectorAll('#cbm .ai-bub').length > 3);
      s.close();
    });
  }
}

test('chat panel opens and closes cleanly on every page', async () => {
  for (const h of ['home', 'courses', 'course', 'internship', 'career', 'learn']) {
    const s = await loadSite({ url: 'https://site.test/#' + h });
    s.open(); await sleep(30); s.w.cbT(); await sleep(30); s.open(); await sleep(30);
    assert.deepEqual(s.errors, [], 'no errors on #' + h);
    s.close();
  }
});

/* ingage EduTech – courses from Admin → Courses, shared online (Supabase table public.site_courses)
 * - Every visitor: on page load the site reads the online course list and adds / updates those courses, so a course
 *   added or edited in Admin appears for all learners. A copy is kept in the browser for a fast start.
 * - Staff signed in with Supabase: every save, status change or delete in Admin → Courses is uploaded. Changes made
 *   earlier that exist only in this browser are uploaded the next time a staff member opens the Admin dashboard.
 * - Without Supabase (demo mode) Admin changes stay in this browser only, as before, and the course list says so.
 * Courses written in the code (the *-course.js files) still come first; an online copy only adds to or overrides them.
 * Loaded after cloud-sync.js.
 */
(function (w) {
  'use strict';
  var CACHE = 'sf_cx_srv', SYNCED = 'sf_cx_synced';
  var S = { rows: [], loaded: false, pushing: false, lastError: '' };
  w.COURSE_SYNC = S;
  function on() { return !!(w.sbOn && w.sbOn()); }
  function readJ(k, d) { try { var v = JSON.parse(localStorage.getItem(k) || 'null'); return v == null ? d : v; } catch (e) { return d; } }
  function writeJ(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function sig(o) { var s = JSON.stringify(o), h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return s.length + ':' + h; }
  function localList() { var x = readJ('sf_cx', null); return (x && x.list) || []; }
  function isStaff() { return !!(w.CLOUD && w.CLOUD.uid && w.CLOUD.staff); }
  // a course this browser changed but has not uploaded yet: keep the local version on screen
  function pendingIds() {
    var done = readJ(SYNCED, {}), p = {};
    localList().forEach(function (o) { if (o && o.i && done[o.i] !== sig(o)) p[o.i] = 1; });
    return p;
  }

  /* ---------- read: everyone ---------- */
  function apply(rows) {
    var C = w.C, pend = pendingIds(), changed = false;
    if (!C) return false;
    rows.forEach(function (r) {
      var id = +r.id; if (!id || pend[id]) return;
      var c = w.cf(id);
      if (r.deleted) { if (c && c.cx) { C.splice(C.indexOf(c), 1); changed = true; } return; } // built-in courses are never removed
      var o = Object.assign({}, r.data || {}); o.i = id;
      if (c) { Object.assign(c, o); changed = true; }
      else if (o.t && o.d) { if (!o.cx) o.cx = 1; C.push(o); changed = true; }
    });
    return changed;
  }
  function refresh() {
    try { if (w.rebuildD) w.rebuildD(); if (w.render) w.render(); if (w.track) w.track(0); } catch (e) {}
    try { if (location.hash == '#learn' && w.renderLearn && w.US) w.renderLearn(); } catch (e) {}
  }
  function load() {
    if (!on() || !w.CFG || !w.fetch) return;
    var u = w.CFG.supabase.url.replace(/\/$/, '') + '/rest/v1/site_courses?select=id,data,deleted&order=id';
    w.fetch(u, { headers: { apikey: w.CFG.supabase.key, Authorization: 'Bearer ' + w.CFG.supabase.key } })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (rows) {
        if (!Array.isArray(rows)) return;
        S.rows = rows; S.loaded = true; writeJ(CACHE, rows);
        if (apply(rows)) refresh();
      })
      .catch(function (e) { S.lastError = String(e && e.message || e); }); // offline / table missing: the cached copy (if any) stays
  }
  // fast start from the copy saved last time, then refresh from the server
  var cached = readJ(CACHE, null);
  if (on() && Array.isArray(cached) && cached.length && apply(cached)) refresh();
  load();
  w.courseSyncLoad = load;

  /* ---------- write: staff only ---------- */
  function toast(icon, title) { try { w.sw({ toast: true, position: 'top-end', icon: icon, title: title, timer: 2600, showConfirmButton: false }); } catch (e) {} }
  function push(quiet) {
    if (!on() || !isStaff() || S.pushing) return;
    var done = readJ(SYNCED, {}), now = {}, up = [], t = new Date().toISOString();
    localList().forEach(function (o) {
      if (!o || !o.i) return;
      now[o.i] = sig(o);
      if (done[o.i] !== now[o.i]) up.push({ id: +o.i, data: o, deleted: false, updated_at: t });
    });
    Object.keys(done).forEach(function (id) { if (!now[id]) up.push({ id: +id, data: {}, deleted: true, updated_at: t }); });
    if (!up.length) return;
    S.pushing = true;
    w.sbGet(function (c) {
      c.from('site_courses').upsert(up).then(function (r) {
        S.pushing = false;
        if (r && r.error) { S.lastError = r.error.message; toast('error', 'Not saved online: ' + r.error.message); return; }
        writeJ(SYNCED, now); S.lastError = '';
        if (!quiet) toast('success', 'Saved online – every learner now sees this');
        if (w.AT == 'crs' && w.adRender && !w.CE) w.adRender();
      }, function (e) { S.pushing = false; S.lastError = String(e && e.message || e); toast('error', 'Not saved online – check your connection'); });
    });
  }
  w.courseSyncPush = push;
  ['cxSave', 'cxStatus', 'cxDel'].forEach(function (n) {
    var f = w[n]; if (typeof f != 'function') return;
    w[n] = function () { var r = f.apply(this, arguments); setTimeout(function () { push(false); }, n == 'cxDel' ? 600 : 50); return r; };
  });
  // opening the Admin dashboard uploads anything that was only saved in this browser
  var _ad = w.adRender;
  if (typeof _ad == 'function') w.adRender = function () { var r = _ad.apply(this, arguments); if (isStaff()) setTimeout(function () { push(true); }, 0); return r; };
  // Admin → Courses: say where changes are saved
  var _list = w.cxList;
  if (typeof _list == 'function') w.cxList = function () {
    var note = on() && isStaff()
      ? '<div class="cx-sync ok">✅ <b>Saved online.</b> Courses you add or change here are shown to every learner.' + (Object.keys(pendingIds()).length ? ' <span class="meta">Uploading your latest changes…</span>' : '') + (S.lastError ? ' <span style="color:#b3261e">Last upload failed: ' + w.esc(S.lastError) + '</span>' : '') + '</div>'
      : '<div class="cx-sync warn">⚠️ <b>Saved in this browser only.</b> ' + (on() ? 'Sign in with your staff account so learners see the courses you add or change.' : 'Connect Supabase (CFG.supabase) so learners see the courses you add or change.') + '</div>';
    return note + _list.apply(this, arguments);
  };
})(window);

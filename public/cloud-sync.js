/* ingage EduTech – learner data on the server (Supabase), when CFG.supabase is set and the person signs in with Supabase.
 * - Enrollments and LMS progress (sf_enr / sf_lms in the browser) are pulled on sign-in and saved back on every change.
 * - Mentor doubts go to the "doubts" table, so mentors see them from any device; answers come back the same way.
 * - Profile (situation, goal, hours per week) is stored in "profiles" and given to the course guide.
 * - Admin login with Supabase requires a staff row (table public.staff); the old in-page admin password is not accepted.
 * Without Supabase (demo mode) nothing here runs and the site keeps using browser storage only.
 */
(function (w) {
  'use strict';
  var C = { uid: null, user: null, staff: false, pulling: 0, pushT: null, adT: 0 };
  w.CLOUD = C;
  w.SBTOKEN = '';
  function on() { return !!(w.sbOn && w.sbOn()); }
  function cli(cb) { if (on()) w.sbGet(cb); }
  function email() { return w.US && w.US.email; }
  var rawSv = w.sv;
  function save(k, v) { rawSv(k, v); } // write locally without triggering a push

  /* ---------- session tracking ---------- */
  function setSession(ses) {
    w.SBTOKEN = ses && ses.access_token || '';
    var uid = ses && ses.user ? ses.user.id : null;
    if (uid && uid !== C.uid) { C.uid = uid; C.user = ses.user; pull(); }
    if (!uid) { C.uid = null; C.user = null; C.staff = false; }
  }
  function start() {
    cli(function (c) {
      c.auth.getSession().then(function (r) { setSession(r.data && r.data.session); });
      c.auth.onAuthStateChange(function (ev, ses) { setSession(ses); });
    });
  }

  /* ---------- profile ---------- */
  var PF = ['situation', 'goal', 'hours_per_week', 'education'];
  function pick(o) { var r = {}; PF.forEach(function (k) { if (o && o[k] != null && o[k] !== '') r[k] = o[k]; }); return r; }
  w.cloudProfile = function () {
    var e = email(); if (!e) return null;
    var u = (w.ld('sf_users', {}) || {})[e]; var p = u && u.pf ? pick(u.pf) : {};
    return Object.keys(p).length ? p : null;
  };
  function setLocalProfile(p) {
    var e = email(); if (!e) return;
    var us = w.ld('sf_users', {}); us[e] = us[e] || { n: e.split('@')[0], h: '', p: 'email' };
    us[e].pf = pick(p); save('sf_users', us);
  }

  /* ---------- pull (server → browser) ---------- */
  function mapDoubt(d) {
    return { id: d.id, q: d.question, d: new Date(d.created_at).toLocaleDateString('en-IN'), a: d.answer || undefined,
      ad: d.answered_at ? new Date(d.answered_at).toLocaleDateString('en-IN') : undefined, c: d.course || undefined };
  }
  function pull() {
    var e = email(); if (!C.uid || !e) return;
    C.pulling = 1;
    cli(function (c) {
      Promise.all([
        c.from('profiles').select('situation,goal,hours_per_week,education').eq('id', C.uid).maybeSingle(),
        c.from('learner_state').select('enrollments,lms').eq('user_id', C.uid).maybeSingle(),
        c.from('doubts').select('id,question,course,answer,answered_at,created_at').eq('user_id', C.uid).order('created_at', { ascending: false }).limit(100),
        c.rpc('is_staff'),
      ]).then(function (R) {
        var prof = R[0].data, st = R[1].data, ds = R[2].data || [];
        C.staff = R[3].data === true;
        // enrollments: union of server and browser (server wins on conflicts)
        var all = w.enr(), mine = all[e] || {}, srv = (st && st.enrollments) || {}, mergedE = {};
        Object.keys(mine).forEach(function (k) { mergedE[k] = mine[k]; });
        Object.keys(srv).forEach(function (k) { var v = Object.assign({}, srv[k]); delete v.t; mergedE[k] = v; });
        all[e] = mergedE; save('sf_enr', all);
        // LMS state: server keys win, browser-only keys are kept; doubts come from the doubts table
        var lmsAll = w.ld('sf_lms', {}), lm = lmsAll[e] || {}, sl = (st && st.lms) || {}, local = (lm.doubts || []).filter(function (d) { return !d.id; });
        Object.keys(sl).forEach(function (k) { lm[k] = sl[k]; });
        lm.doubts = local.concat(ds.map(mapDoubt));
        lmsAll[e] = lm; save('sf_lms', lmsAll);
        // profile: server copy wins; a profile typed at sign-up is uploaded once
        var meta = (C.user && C.user.user_metadata && C.user.user_metadata.pf) || {}, localP = w.cloudProfile() || {};
        var serverP = pick(prof || {}), want = Object.assign({}, pick(meta), localP, serverP);
        setLocalProfile(want);
        if (Object.keys(want).length > Object.keys(serverP).length) c.from('profiles').upsert(Object.assign({ id: C.uid, email: e }, want)).then(function () {});
        C.pulling = 0;
        push(true); // upload anything that only existed in this browser (and doubts without an id)
        if (w.upd) w.upd();
        if (location.hash == '#learn' && w.renderLearn) w.renderLearn();
      }).catch(function () { C.pulling = 0; });
    });
  }

  /* ---------- push (browser → server) ---------- */
  function push(now) {
    clearTimeout(C.pushT);
    C.pushT = setTimeout(doPush, now ? 0 : 1200);
  }
  function doPush() {
    var e = email(); if (!C.uid || !e || C.pulling) return;
    var mine = w.enr()[e] || {}, ens = {};
    Object.keys(mine).forEach(function (k) { var c = w.cf(+k); ens[k] = Object.assign({}, mine[k], c ? { t: c.t } : {}); });
    var lm = Object.assign({}, (w.ld('sf_lms', {})[e]) || {}), doubts = lm.doubts || [];
    delete lm.doubts;
    cli(function (c) {
      c.from('learner_state').upsert({ user_id: C.uid, enrollments: ens, lms: lm, updated_at: new Date().toISOString() }).then(function () {});
      var fresh = doubts.filter(function (d) { return !d.id && d.q; });
      if (!fresh.length) return;
      var course = (w.aiCur && w.aiCur()) ? w.aiCur().t : null;
      c.from('doubts').insert(fresh.map(function (d) { return { user_id: C.uid, question: String(d.q).slice(0, 2000), course: d.c || course, source: d.src || 'chat' }; }))
        .select('id,question').then(function (r) {
          if (r.error || !r.data) return;
          var all = w.ld('sf_lms', {}), cur = (all[e] && all[e].doubts) || [];
          r.data.forEach(function (row) { var d = cur.filter(function (x) { return !x.id && x.q === row.question; })[0]; if (d) d.id = row.id; });
          save('sf_lms', all);
        });
    });
  }
  w.sv = function (k, v) {
    rawSv(k, v);
    if ((k == 'sf_enr' || k == 'sf_lms') && C.uid && !C.pulling) push();
  };

  /* ---------- doubts: refresh answers when the learner opens "My doubts" ---------- */
  if (w.hShowDoubts) {
    var _show = w.hShowDoubts;
    w.hShowDoubts = function () { if (C.uid) pull(); return _show.apply(this, arguments); };
  }
  if (w.doubtAsk) {
    var _ask = w.doubtAsk;
    w.doubtAsk = function () {
      var r = _ask.apply(this, arguments), e = email();
      if (e) { var all = w.ld('sf_lms', {}), d = all[e] && all[e].doubts && all[e].doubts[0]; if (d && !d.id) { d.src = 'lms'; save('sf_lms', all); push(true); } }
      return r;
    };
  }

  /* ---------- staff (mentor / admin) ---------- */
  if (w.login) {
    var _login = w.login;
    w.login = function () {
      if (w.R != 'a' || !on()) return _login.apply(this, arguments);
      var v = w.mail('le'); if (!v) return; var p = w.$('lp').value;
      if (!p) { w.err('Please enter your password.'); return; }
      w.authBusy('lbtn', 1, 'Checking…');
      cli(function (c) {
        c.auth.signInWithPassword({ email: v, password: p }).then(function (r) {
          if (r.error) { w.authBusy('lbtn', 0); w.err('Incorrect admin email or password.'); return; }
          c.rpc('is_staff').then(function (s) {
            w.authBusy('lbtn', 0);
            if (s.data === true) { C.staff = true; C.uid = r.data.user.id; w.go({ email: v, name: 'Admin', role: 'a' }); }
            else { c.auth.signOut(); w.err('This account is not set up as ingage staff.'); }
          });
        });
      });
    };
  }
  // Staff see every learner's doubts from the server in the admin dashboard.
  if (w.adRender) {
    var _ad = w.adRender;
    w.adRender = function () {
      var r = _ad.apply(this, arguments);
      if (C.staff && Date.now() - C.adT > 20000) { C.adT = Date.now(); loadStaff(); }
      return r;
    };
  }
  function loadStaff() {
    cli(function (c) {
      Promise.all([
        c.from('doubts').select('id,user_id,question,course,answer,answered_at,created_at').order('created_at', { ascending: false }).limit(500),
        c.from('profiles').select('id,email,full_name'),
      ]).then(function (R) {
        var ds = R[0].data || [], ps = {}; (R[1].data || []).forEach(function (p) { ps[p.id] = p; });
        var lms = w.ld('sf_lms', {}), us = w.ld('sf_users', {});
        Object.keys(lms).forEach(function (e) { if (lms[e]) lms[e].doubts = (lms[e].doubts || []).filter(function (d) { return !d.id; }); });
        ds.forEach(function (d) {
          var p = ps[d.user_id] || {}, e = (p.email || d.user_id).toLowerCase();
          if (!us[e]) us[e] = { n: p.full_name || e, h: '', p: 'email' };
          lms[e] = lms[e] || {}; (lms[e].doubts = lms[e].doubts || []).push(mapDoubt(d));
        });
        save('sf_lms', lms); save('sf_users', us);
        _ad();
      });
    });
  }
  if (w.adReply) {
    var _rep = w.adReply;
    w.adReply = function (e, i, k) {
      var v = (w.$('adr_' + k) || {}).value;
      var r = _rep.apply(this, arguments);
      var d = ((w.ld('sf_lms', {})[e] || {}).doubts || [])[i];
      if (C.staff && d && d.id && v && v.trim()) cli(function (c) {
        c.from('doubts').update({ answer: v.trim().slice(0, 4000), answered_at: new Date().toISOString(), answered_by: C.uid }).eq('id', d.id).then(function () {});
      });
      return r;
    };
  }

  /* ---------- sign-out also ends the Supabase session ---------- */
  if (w.doLogout) {
    var _out = w.doLogout;
    w.doLogout = function () { cli(function (c) { c.auth.signOut(); }); w.SBTOKEN = ''; C.uid = null; C.staff = false; return _out.apply(this, arguments); };
  }

  if (on()) start();
})(window);

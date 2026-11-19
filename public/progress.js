/* ingage EduTech – learner progress
 *  7. Course completion % with milestone markers and automatic congratulations (30%, 50%, 60%, 80%, 100%)
 *  8. Internship recommendations based on course progress
 *  9. Chatbot answers about progress and recommended internships (+ context for the live AI)
 * Loaded after site-features.js.
 */
(function (w, d) {
  'use strict';
  var $ = w.$, esc = w.esc;

  /* ===== settings you can edit ===== */
  var MILESTONES = [30, 50, 60, 80, 100];          // congratulate when a learner reaches these %
  var TRACK_UNLOCK = [30, 60, 100];                 // courses without a module→job map: internship tracks unlock at these %
  var MS_TEXT = {
    30: ['Great start!', 'You have completed 30% of {c}. Keep the momentum going.'],
    50: ['Halfway there!', 'You are 50% through {c}. Your hard work is paying off.'],
    60: ['60% complete!', 'You have finished most of the core modules of {c}.'],
    80: ['Almost there!', 'Only 20% of {c} left. Finish strong to unlock everything.'],
    100: ['Course complete!', 'You finished {c}. Get your certificate and apply for internships.'],
  };
  w.MILESTONES = MILESTONES;

  /* ---------- progress ---------- */
  function enrolledIds() { return w.US ? Object.keys(w.myE()).map(Number).filter(function (i) { return w.cf(i); }) : []; }
  function prog(ci) {
    var e = w.US && w.myE()[ci], t = w.nTot(ci) || 1, n = e ? w.dnCnt(e, ci) : 0;
    return { done: n, total: t, pct: Math.min(100, Math.round(n / t * 100)) };
  }
  w.prog = prog;

  /* ---------- internship recommendations ---------- */
  // Networking course: each module unlocks job-board roles (JR). Other courses: internship tracks unlock at TRACK_UNLOCK %.
  function recIntern(ci) {
    var c = w.cf(ci), e = w.US && w.myE()[ci], P = prog(ci), elig = [], next = null;
    if (!c || !e) return { eligible: [], next: null, pct: 0 };
    if (ci == 1 && w.JR) {
      var seen = {};
      w.mods(c).forEach(function (m) {
        if (m.mi == null) return;
        var done = m.ls.every(function (l) { return e.done.indexOf(l.id) > -1; }), ids = (w.JR[m.mi + 1] || []).filter(w.jobOn);
        if (done) ids.forEach(function (i) { if (!seen[i]) { seen[i] = 1; elig.push({ t: w.JOBS[i][0], ty: w.JOBS[i][1], intern: /intern|trainee/i.test(w.JOBS[i][0] + w.JOBS[i][1]) }); } });
        else if (!next) { var nw = ids.filter(function (i) { return !seen[i]; }); if (nw.length) next = { label: 'Complete ' + m.t.replace(/^Module (\d+):.*/, 'Module $1') + ' (' + m.t.replace(/^Module \d+:\s*/, '') + ') and its MCQ test', roles: nw.map(function (i) { return w.JOBS[i][0]; }) }; }
      });
      elig.sort(function (a, b) { return (b.intern ? 1 : 0) - (a.intern ? 1 : 0); });
    } else {
      (c.jr || []).forEach(function (r, k) {
        var need = TRACK_UNLOCK[Math.min(k, TRACK_UNLOCK.length - 1)];
        if (P.pct >= need) elig.push({ t: r + ' – internship track', ty: 'Unlocked at ' + need + '% · openings shared by the placement team', intern: true });
        else if (!next) next = { label: 'Reach ' + need + '% progress', roles: [r + ' – internship track'] };
      });
    }
    return { eligible: elig, next: next, pct: P.pct };
  }
  w.recIntern = recIntern;

  function recHtml(ci, max) {
    var R = recIntern(ci), L = R.eligible.slice(0, max || 6);
    return '<div class="rec"><h5>🧑‍💻 Recommended internships &amp; roles for you</h5>' +
      (L.length ? '<div class="rec-list">' + L.map(function (x) { return '<div class="hit"><b>' + esc(x.t) + '</b><small>' + esc(x.ty) + '</small></div>'; }).join('') + '</div>'
        : '<p class="meta" style="margin:0">No internships unlocked yet. Keep going!</p>') +
      (R.next ? '<p class="rec-next">🔓 <b>Next unlock:</b> ' + esc(R.next.label) + ' → ' + R.next.roles.map(esc).join(', ') + '</p>' : (L.length ? '<p class="rec-next">🎉 You have unlocked every internship for this course.</p>' : '')) +
      (L.length ? '<a class="btn o" style="margin-top:10px" onclick="NT=\'jobs\';nav(\'next\')">Apply in Career → Internships &amp; jobs</a>' : '') + '</div>';
  }

  /* ---------- milestone records & notifications ---------- */
  function msAll() { return w.ld('sf_ms', {}); }
  function msGot(ci) { var a = msAll(), u = w.US && a[w.US.email]; return (u && u[ci]) || []; }
  function msSave(ci, list) { var a = msAll(); if (!w.US) return; a[w.US.email] = a[w.US.email] || {}; a[w.US.email][ci] = list; w.sv('sf_ms', a); }

  function bar(pct, got) {
    return '<div class="pg-bar"><i style="width:' + pct + '%"></i>' + MILESTONES.map(function (m) {
      return '<span class="pg-ms' + (pct >= m ? ' hit' : '') + '" style="left:' + m + '%">' + m + '%</span>';
    }).join('') + '</div>';
  }
  function learnCard(ci) {
    var c = w.cf(ci), P = prog(ci), nx = MILESTONES.filter(function (m) { return m > P.pct; })[0];
    var left = nx ? Math.max(1, Math.ceil(nx / 100 * P.total) - P.done) : 0;
    return '<div class="pg-card" id="pgcard"><div class="pg-top"><div class="pg-ring" style="--p:' + P.pct + '"><b>' + P.pct + '%</b></div><div class="pg-main">' +
      '<h4>Your progress in ' + esc(c.t) + '</h4><div class="meta">' + P.done + ' of ' + P.total + ' lessons complete' + (nx ? ' · <b>' + left + '</b> more to reach <b>' + nx + '%</b>' : ' · 🎓 Course complete') + '</div>' +
      bar(P.pct) + '<div class="pg-badges">' + MILESTONES.map(function (m) { return '<span class="' + (P.pct >= m ? 'hit' : '') + '">' + (P.pct >= m ? '🏅 ' : '🔒 ') + m + '%</span>'; }).join('') + '</div></div></div>' +
      recHtml(ci) + '</div>';
  }
  w.progCard = function (ci) { // small card on the course page for enrolled learners
    if (!w.US || !w.myE()[ci]) return '';
    var P = prog(ci);
    return '<div class="pg-mini"><b>Your progress: ' + P.pct + '%</b>' + bar(P.pct) + '<small>' + P.done + ' of ' + P.total + ' lessons complete</small></div>';
  };

  var toastT = null;
  function toast(ci, m, newRec, isNew) {
    var c = w.cf(ci), T = MS_TEXT[m] || ['🎉 ' + m + '% complete!', 'Keep going with {c}.'], el = $('mstoast');
    if (!el) { el = d.createElement('div'); el.id = 'mstoast'; el.className = 'ms-toast'; el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'polite'); d.body.appendChild(el); }
    el.innerHTML = '<span class="ms-big">' + (m >= 100 ? '🎓' : '🎉') + '</span><b>' + esc(T[0]) + ' ' + m + '%</b>' + esc(T[1].replace('{c}', c.t)) +
      (newRec.length ? '<br>🧑‍💻 ' + (isNew ? 'Newly unlocked for you' : 'Recommended for you') + ': <strong>' + newRec.slice(0, 2).map(esc).join(', ') + (newRec.length > 2 ? ' +' + (newRec.length - 2) + ' more' : '') + '</strong>' : '') +
      '<br><a onclick="msShow()">See my progress</a><button type="button" aria-label="Close" onclick="msHide()">×</button>';
    el.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(w.msHide, 9000);
  }
  w.msHide = function () { var el = $('mstoast'); if (el) el.classList.remove('on'); };
  w.msShow = function () { w.msHide(); if (location.hash != '#learn') w.nav('learn'); setTimeout(function () { var p = $('pgcard'); if (p) p.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80); };

  // celebrate milestones that were reached but not yet celebrated (highest one only, once)
  function celebrate(ci, recBefore) {
    if (!w.US || !w.myE()[ci]) return;
    var P = prog(ci), got = msGot(ci), fresh = MILESTONES.filter(function (m) { return P.pct >= m && got.indexOf(m) < 0; });
    if (!fresh.length) return;
    msSave(ci, got.concat(fresh));
    var top = fresh[fresh.length - 1];
    if (top >= 100) return; // the site already shows its own "Course complete" popup
    var now = recIntern(ci).eligible.map(function (x) { return x.t; }), newRec = now.filter(function (t) { return (recBefore || []).indexOf(t) < 0; });
    var tries = 0;
    (function wait() { // don't show under another popup
      if (w.Swal && w.Swal.isVisible && w.Swal.isVisible() && !(w.Swal.getPopup && w.Swal.getPopup() && w.Swal.getPopup().classList.contains('swal2-toast')) && tries++ < 40) return setTimeout(wait, 400);
      toast(ci, top, newRec, !!recBefore);
    })();
  }
  w.msCelebrate = celebrate;

  /* ---------- hook into the learning page ---------- */
  var _mark = w.mark, inMark = 0;
  w.mark = function (id, quiet) {
    var ci = +w.LC, before = recIntern(ci).eligible.map(function (x) { return x.t; });
    var r;
    inMark = 1;
    try { r = _mark(id, quiet); } finally { inMark = 0; }
    celebrate(ci, before);
    return r;
  };
  var _renderLearn = w.renderLearn;
  w.renderLearn = function () {
    _renderLearn();
    var lw = $('lw'), ut = lw && lw.querySelector('.ut');
    if (!ut || !w.US || !w.myE()[w.LC]) return;
    ut.insertAdjacentHTML('afterend', learnCard(+w.LC));
    if (!inMark) celebrate(+w.LC, null); // during a lesson completion, mark() celebrates with the before/after comparison
  };

  /* ---------- internship page: status with progress + recommendations ---------- */
  w.ipStatusHtml = function () {
    var ids = enrolledIds();
    if (!ids.length) return '';
    return '<div class="card ip-status"><b>Your internship recommendations</b>' + ids.map(function (ci) {
      var P = prog(ci);
      return '<div style="margin-top:12px"><b>' + w.cf(ci).e + ' ' + esc(w.cf(ci).t) + '</b> · ' + P.pct + '% complete' + bar(P.pct) + recHtml(ci, 4) + '</div>';
    }).join('') + '</div>';
  };

  /* ---------- chatbot ---------- */
  function progAnswer() {
    var ids = enrolledIds();
    if (!ids.length) return w.US ? 'You are not enrolled in a course yet. <a class="lk" onclick="nav(\'courses\')">Browse courses →</a>' : 'Log in and enroll to track your progress. <a class="lk" onclick="openLogin()">Log in →</a>';
    return ids.map(function (ci) {
      var c = w.cf(ci), P = prog(ci), nx = MILESTONES.filter(function (m) { return m > P.pct; })[0];
      return '<b>' + c.e + ' ' + esc(c.t) + '</b>: <b>' + P.pct + '%</b> complete (' + P.done + ' of ' + P.total + ' lessons)' + bar(P.pct) +
        (nx ? 'Next milestone: <b>' + nx + '%</b>.' : '🎓 Course complete!');
    }).join('<br><br>') + '<br><a class="lk" onclick="msShow()">Open My Learning →</a>';
  }
  function recAnswer() {
    var ids = enrolledIds();
    if (!ids.length) return '';
    return ids.map(function (ci) {
      var R = recIntern(ci), c = w.cf(ci);
      return '<b>' + c.e + ' ' + esc(c.t) + '</b> (' + R.pct + '%)<br>' + (R.eligible.length ? '✅ Eligible: ' + R.eligible.slice(0, 4).map(function (x) { return '<b>' + esc(x.t) + '</b>'; }).join(', ') : 'No internships unlocked yet.') +
        (R.next ? '<br>🔓 Next: ' + esc(R.next.label) + ' → ' + R.next.roles.map(esc).join(', ') : '');
    }).join('<br><br>') + '<br><a class="lk" onclick="ipOpen()">📄 Internship details →</a>';
  }
  var PROGRE = /\b(my )?(progress|completion|completed|percentage|how much (have i|did i|i have) (done|completed|finished)|how far)\b|முன்னேற்ற|प्रगति|ప్రగతి|ಪ್ರಗತಿ/i;
  var RECRE = /\b(recommend\w*|suggest\w*|eligible|eligibility|which|what)\b.*\bintern(ship)?s?\b|\bintern(ship)?s?\b.*\b(for me|eligible|can i (get|apply))\b/i;
  var _route = w.aiRoute;
  w.aiRoute = function (q) {
    var s = String(q).toLowerCase();
    if (w.CBMODE != 'doubt' && w.US && enrolledIds().length) {
      if (RECRE.test(s)) { if (w.AILIVE) w.AILIVE.sure = 1; return recAnswer(); }
      if (PROGRE.test(s) && !/\bcourse (fee|duration)\b/.test(s)) { if (w.AILIVE) w.AILIVE.sure = 1; return progAnswer(); }
    }
    return _route(q);
  };
  var _hAns = w.hAns;
  w.hAns = function (k) {
    if (k == 'lms' && w.US && enrolledIds().length) { var r = _hAns(k); return progAnswer() + '<br><br>' + r; }
    if (k == 'intern' && w.US && enrolledIds().length) return recAnswer() + '<br><br>' + _hAns(k);
    return _hAns(k);
  };
  // summary for the live AI
  w.learnerSummary = function () {
    return enrolledIds().map(function (ci) {
      var R = recIntern(ci);
      return { course: w.cf(ci).t, progressPct: R.pct, milestonesReached: MILESTONES.filter(function (m) { return R.pct >= m; }),
        eligibleInternships: R.eligible.map(function (x) { return x.t; }), nextUnlock: R.next ? R.next.label + ' → ' + R.next.roles.join(', ') : null };
    });
  };

  if (location.hash == '#learn' && w.US) w.renderLearn();
  if (location.hash == '#internship') w.renderIntern(); // first render ran before this file loaded
})(window, document);

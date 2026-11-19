/* ingage EduTech chatbot – LIVE AI layer
 * Loaded after the main page script. Predefined answers are used first; questions they do not really
 * answer go to the live AI backend (CHAT_API, or the Supabase Edge Function CHAT_FN, or /api/chat on localhost).
 */
(function (w) {
  'use strict';
  var AILN = { en: 'English', ta: 'Tamil', hi: 'Hindi', te: 'Telugu', kn: 'Kannada' };
  var INDIC = /[ऀ-෿]/; // Devanagari … Kannada (covers hi, ta, te, kn)
  var S = (w.AILIVE = { busy: 0, dead: 0, ov: 0, auto: 0, lastSource: '' });
  try { S.auto = localStorage.getItem('sf_chlang_auto') == '1' ? 1 : 0; } catch (e) {}
  function setAuto(v) { S.auto = v; try { localStorage.setItem('sf_chlang_auto', v ? '1' : '0'); } catch (e) {} }

  /* ---------- where to send live questions ---------- */
  function aiUrl() {
    if (S.dead) return '';
    if (w.CHAT_API) return w.CHAT_API;
    if (w.sbOn() && w.CHAT_FN) return String(w.CFG.supabase.url).replace(/\/+$/, '') + '/functions/v1/' + w.CHAT_FN;
    if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return '/api/chat';
    return '';
  }
  function aiLive() { return !!aiUrl(); }

  /* ---------- question analysis ---------- */
  // A real question, not just a course name or "tell me about X".
  function aiQ(q) {
    var s = String(q).toLowerCase().trim(), n = s.split(/\s+/).length;
    if (/^(tell me about|about|show|details?|info|overview)\b/.test(s) && n < 7) return false;
    return n >= 3 && (/\?/.test(s) || INDIC.test(s) ||
      /^(what|why|how|can|could|is|are|do|does|did|will|would|should|shall|which|when|where|who|whom|whose|may|am|has|have|explain|define|difference|compare|tell me (why|how|if|whether))\b/.test(s));
  }
  var KWRE = /\b(enrol\w*|join|register|sign ?up|buy|log ?in|sign ?in|gmail|password|refund\w*|pay|payment|upi|card|net ?banking|coupon|discount|certificat\w*|naac|nba|accreditation|coe|hackathons?|placements?|internships?|contact|phone|whatsapp|e-?mail|callback|demo|fees?|price|cost|duration|hours|how long|syllabus|curriculum|modules?)\b/;
  function intentRes() {
    return [KWRE, w.AISALRE, w.AIJOBRE, w.AIEXP].concat(Object.keys(w.AII).map(function (k) { return w.AII[k]; })).filter(Boolean);
  }
  function aiHasIntent(q) { var s = String(q).toLowerCase(); return intentRes().some(function (r) { return r.test(s); }); }

  // Words that tell us nothing about what the person needs.
  var STOP = ('the a an and or but if of to in on at for from by with without about into over under is are was were be been am do does did can could will would ' +
    'should shall may might must i me my mine we us our you your it its this that these those there here what which who whom whose when where why how ' +
    'not no yes any some all each much many more most very just also too only than then so as get got give know want need like please tell ' +
    'course courses program programme programs training class classes learn learning study studying ingage edutech help one have has having').split(' ');
  var GEN = {}; STOP.forEach(function (x) { GEN[x] = 1; });
  function words(s) { return (String(s).toLowerCase().match(/[a-z0-9+#]+/g) || []).filter(function (x) { return x.length > 2 && !GEN[x]; }); }
  // Content words of the question that no predefined intent or course vocabulary explains.
  function aiUncovered(q) {
    var s = String(q).toLowerCase(), cov = {};
    intentRes().forEach(function (r) {
      var g = new RegExp(r.source, r.flags.indexOf('g') < 0 ? r.flags + 'g' : r.flags), m;
      while ((m = g.exec(s))) { words(m[0]).forEach(function (x) { cov[x] = 1; }); if (!m[0]) g.lastIndex++; }
    });
    w.cxVis().forEach(function (c) { words([c.t, c.d].concat(c.k || []).join(' ')).forEach(function (x) { cov[x] = 1; }); });
    var all = words(s);
    return { all: all, open: all.filter(function (x) { return !cov[x] && !cov[x.replace(/s$/, '')]; }) };
  }
  // The question has several specifics (e.g. "night shift", "Coimbatore") that a keyword answer would ignore.
  function aiLowCoverage(q) {
    if (!aiQ(q)) return false;
    var u = aiUncovered(q);
    return u.open.length >= 3 && u.open.length / Math.max(1, u.all.length) >= 0.5;
  }
  // Questions about fitting study around life ("while working", "weekend", "with my job"): keyword answers can't handle these.
  var CONSTRAINT = /\b(while|along ?with|alongside|with (a |my )?(job|work|office|college)|working professional|part.?time|full.?time job|night|weekends?|evenings?|shifts?|after (office|work|college)|during (my )?(job|work|college))\b|के साथ|नौकरी करते|काम करते|उடன்|கூட|வேலை செய்து|వారాంతం|తో పాటు|ఉద్యోగం చేస్తూ|ಜೊತೆ|ಕೆಲಸ ಮಾಡುತ್ತ/i;
  function aiConstraint(q) { return aiQ(q) && CONSTRAINT.test(String(q).toLowerCase()); }
  function kbStrong(q) { return !!(w.kStrong(q, '') || w.kStrong(q, 'gl')); }

  // Is a predefined reply only a generic fallback (or a poor fit) for this question?
  function aiGenR(r, q) {
    if (S.sure) return false;                                   // a specific answer (hardware, software, progress…) said it fits
    var s = String(r);
    if (s == w.hT().menu || s.indexOf(w.aiIX().unk) > -1 || s.indexOf(w.AINOT) == 0) return true;
    if (S.ov && aiQ(q) && !aiHasIntent(q)) return true;          // course overview shown for an unrelated question
    return (aiLowCoverage(q) || aiConstraint(q)) && !kbStrong(q); // keyword matched, but the question is about something else
  }

  /* ---------- formatting ---------- */
  function aiPlain(h) {
    var d = document.createElement('div'); d.innerHTML = String(h || '');
    d.querySelectorAll('button,.ai-grid,.ai-acts').forEach(function (x) { x.remove(); });
    return (d.textContent || '').replace(/\s+/g, ' ').trim();
  }
  function aiMd(t) { // minimal, safe markdown → HTML (escape first)
    var h = w.esc(String(t || '').trim());
    h = h.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
      .replace(/`([^`\n]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]\n]+)\]\((https:\/\/[^\s)"']+)\)/g, '<a class="lk" href="$2" target="_blank" rel="noopener">$1</a>');
    return h.split(/\n/).map(function (l) { var m = l.match(/^\s*[-*•]\s+(.*)$/); return m ? '• ' + m[1] : l; })
      .join('<br>').replace(/(<br>){3,}/g, '<br><br>');
  }
  function waitBubble() {
    var m = w.$('cbm'), d = document.createElement('div');
    d.className = 'ai-row ai-typing';
    d.innerHTML = '<div class="ai-mav">' + w.AI_I('robot') + '</div><div class="ai-bub"><span class="ai-dots"><i></i><i></i><i></i></span></div>';
    m.appendChild(d); m.scrollTop = m.scrollHeight; return d;
  }
  function afterChips() {
    var t = w.hT();
    w.cbQ([[t.b.menu, "hTopic('menu')", 'grid']].concat(w.US && w.isEn() ? [[t.b.mentor, 'hMentor()', 'chat']] : [[t.b.contact, 'hCt()', 'help']]));
  }

  /* ---------- live request ---------- */
  function payload(q, fallback) {
    var sc = (w.AIM == 'pre' ? w.aiScope() : null) || w.aiCur() || (w.AIC && w.cf(w.AIC) && !w.cf(w.AIC).hid ? w.cf(w.AIC) : null);
    var ctx = w.kSearch(q).concat(sc ? w.kSearch(q + ' ' + sc.t) : []).map(function (x) { return x.e.t + ': ' + x.e.x; })
      .filter(function (v, i, a) { return a.indexOf(v) == i; }).slice(0, 6);
    var msgs = w.CH.slice(-12).map(function (m) {
      return { role: m.role, content: (m.role == 'assistant' ? aiPlain(m.content) : String(m.content)).slice(0, 1200) };
    }).filter(function (m) { return m.content; });
    return {
      messages: msgs, mode: w.AIM, lang: w.HL, language: AILN[w.HL] || 'English', page: location.hash,
      user: w.US ? { enrolled: Object.keys(w.myE()).map(function (i) { return w.cf(+i) && w.cf(+i).t; }).filter(Boolean), progress: w.learnerSummary ? w.learnerSummary() : [] } : null,
      course: sc ? { title: sc.t, category: sc.d, hours: sc.h, fee: w.fee(sc.f), status: sc.soon ? 'coming soon' : 'open' } : null,
      context: ctx, predefined: aiPlain(fallback).slice(0, 800),
      courseMaterial: w.courseKbFor && (!sc || sc.i == 1) ? w.courseKbFor(1, q) : null,
      courses: w.cxVis().map(function (c) {
        return { title: c.t, category: c.d, hours: c.h, fee: w.fee(c.f) + ' (incl. GST)', status: c.soon ? 'coming soon' : 'open', summary: c.s,
          learn: c.l, outcomes: c.o, skills: c.k, jobRoles: c.jr, industries: c.ind, prerequisites: c.pre,
          salaryLPA: (c.sal || []).map(function (x) { return x[0] + ': ' + x[1] + '-' + x[2] + ' LPA'; }),
          syllabus: (w.aiMods ? w.aiMods(c) : []).map(function (m) { return m.t; }) };
      })
    };
  }
  function aiAsk(q, fallback) {
    var url = aiUrl(), hd = { 'Content-Type': 'application/json' };
    if (!w.CHAT_API && w.sbOn()) { hd.Authorization = 'Bearer ' + w.CFG.supabase.key; hd.apikey = w.CFG.supabase.key; }
    S.busy = 1;
    var bub = waitBubble(), ac = w.AbortController ? new AbortController() : null,
      tm = setTimeout(function () { if (ac) ac.abort(); }, 25000);
    function done(html, src) {
      clearTimeout(tm); S.busy = 0; S.lastSource = src; bub.remove(); w.cbM('b', html, 1); afterChips();
    }
    w.fetch(url, { method: 'POST', headers: hd, signal: ac ? ac.signal : undefined, body: JSON.stringify(payload(q, fallback)) })
      .then(function (x) { if (x.status == 404 && !w.CHAT_API) S.dead = 1; if (!x.ok) throw x.status; return x.json(); })
      .then(function (j) { if (!j || !j.reply) throw 0; done(aiMd(j.reply), 'ai'); })
      .catch(function () { done(fallback, 'fallback'); });
  }

  /* ---------- language: an auto-detected language switches back when the person types English again ---------- */
  var _setLang = w.aiSetLang;
  w.aiSetLang = function (l) { setAuto(0); return _setLang(l); };
  function langBefore(q) {
    if (S.auto && w.HL != 'en' && !INDIC.test(q) && /[a-z]{3,}/i.test(q)) {
      w.HL = 'en'; setAuto(0);
      try { localStorage.setItem('sf_chlang', 'en'); } catch (e) {}
      w.aiTop();
    }
  }

  /* ---------- the send function ---------- */
  var _aiOv = w.aiOv;
  w.aiOv = function (c) { S.ov = 1; return _aiOv(c); };

  function show(html, src) { S.lastSource = src; w.aiTyping(function () { w.cbM('b', html, 1); }); }

  // On a course page, "how long / fee for this course" answers for that course (it used to match unrelated quiz questions).
  var _route = w.aiRoute;
  w.aiRoute = function (q) {
    var s = String(q).toLowerCase(), sc = w.CBMODE != 'doubt' && w.AIM == 'pre' ? w.aiScope() : null;
    if (sc && !w.aiCourse(s) && /\b(this|the|that|it)\b/.test(s) && !aiConstraint(q)) {
      if (/how long|duration|how many (hours|weeks|days|months)|total hours/.test(s)) return w.aiOv(sc);
      if (/\b(fees?|price|cost)\b|how much/.test(s) && !w.AISALRE.test(s)) return w.aiFee(sc);
    }
    return _route(q);
  };

  w.cbS = function (q) {
    if (S.busy) return;
    q = q || w.$('cbx').value.trim(); if (!q) return;
    w.$('cbx').value = ''; w.cbM('u', q); w.cbQ([]);
    langBefore(q);
    S.ov = 0; S.sure = 0;
    var hl0 = w.HL, r = w.aiRoute(q), live = aiLive();
    if (w.HL != hl0 && w.HL != 'en') setAuto(1);
    if (r && !(live && aiGenR(r, q))) return show(r, 'predefined');
    if (r) return aiAsk(q, r);
    var fb = w.cbA(q), gen = String(fb).indexOf(w.AINOT) == 0 || String(fb).indexOf('Tell me your interest') == 0,
      kb = gen || live ? w.kAnswer(q) : '';
    if (!live) return show(gen && kb ? kb : fb, 'predefined');
    if (!gen && !(aiQ(q) && (!aiHasIntent(q) || aiLowCoverage(q) || aiConstraint(q)))) return show(fb, 'predefined');
    if (kb && kbStrong(q)) return show(kb, 'predefined');
    aiAsk(q, kb || fb);
  };

  // exposed for tests
  S.aiQ = aiQ; S.aiHasIntent = aiHasIntent; S.aiUncovered = aiUncovered; S.aiLowCoverage = aiLowCoverage; S.aiConstraint = aiConstraint; S.aiMd = aiMd; S.aiUrl = aiUrl; S.payload = payload;
})(window);

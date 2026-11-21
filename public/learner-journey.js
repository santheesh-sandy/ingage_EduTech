/* ingage EduTech – learner journey
 *  1. Capstone projects: 5 projects with outcomes, shown before enrolling. The learner picks one; My Learning then shows
 *     only the modules that project needs, in a tree (capstone → module → lessons), ending with the capstone itself.
 *  2. Resume upload at sign-up (PDF, DOCX or TXT). The text is read in the browser and used to fill in the Resume builder;
 *     with Supabase on, the file is stored in the private "resumes" bucket.
 *  3. Wrong MCQ answers: after a test is submitted, the floating AI chatbot explains the correct answers and the concepts.
 *  4. Progress milestones: 30% Resume builder · 50% internships · 60% career opportunities · 80% placement preparation ·
 *     100% course completion certificate.
 * Loaded after progress.js.
 */
(function (w, d) {
  'use strict';
  var $ = w.$, esc = w.esc;

  /* ===== settings you can edit ===== */
  var STAGE = { resume: 30, intern: 50, career: 60, prep: 80, cert: 100 };
  w.STAGE = STAGE;

  // mods: module numbers (1 = first module of the course) the project needs
  var CAPS = {
    1: [
      { id: 'office', e: '🏢', t: 'Small-office network with VLANs, DHCP and DNS', mods: [1, 2, 5, 4],
        brief: 'Design and build the network for a 3-department office in Cisco Packet Tracer, then prove it works with Wireshark.',
        out: ['An IP addressing plan with one subnet per department', 'VLANs, trunks and inter-VLAN routing that work end to end', 'DHCP and DNS serving every department, verified with packet captures'],
        tools: ['Cisco Packet Tracer', 'Wireshark'],
        steps: ['Draw the topology: 1 router, 2 switches, 3 departments', 'Plan the subnets and VLAN IDs', 'Configure VLANs, trunk ports and router-on-a-stick', 'Add a DHCP pool per VLAN and a DNS server', 'Capture DHCP and DNS traffic in Wireshark as proof'] },
      { id: 'wan', e: '🌐', t: 'Multi-branch WAN with dynamic routing', mods: [1, 2, 3, 4],
        brief: 'Connect a head office and two branches over a simulated WAN in GNS3 and keep them talking when a link fails.',
        out: ['A 3-router WAN with static and RIP routing', 'Tested failover when a link goes down', 'A troubleshooting report with ping, traceroute and captures'],
        tools: ['GNS3', 'Cisco Packet Tracer', 'Wireshark'],
        steps: ['Plan the WAN links and LAN subnets for 3 sites', 'Build the routers in GNS3 and address every interface', 'Configure static routes, then RIP', 'Shut a link and confirm traffic takes the other path', 'Write a short report with your captures'] },
      { id: 'domain', e: '🏛️', t: 'Windows domain for a growing company', mods: [1, 6, 7, 8],
        brief: 'Set up a Windows Server domain in a virtual lab: users, groups, OUs and Group Policy for client PCs.',
        out: ['A domain controller running Active Directory in a VM', 'OUs, users and groups that match the company structure', 'Group Policies applied and verified on a client PC'],
        tools: ['VirtualBox / VMware', 'Windows Server', 'Active Directory', 'Group Policy'],
        steps: ['Create the server and client VMs on a virtual network', 'Install Windows Server and promote a domain controller', 'Create OUs, users and groups for 3 departments', 'Join a client PC and apply 2 Group Policies', 'Document the setup with screenshots'] },
      { id: 'remote', e: '🔐', t: 'Secure remote access for staff', mods: [1, 5, 6, 7, 9],
        brief: 'Give remote staff safe access to internal services with a VPN server and NPS authentication.',
        out: ['A VPN server that only lets domain users in', 'Internal DNS and web services reachable over the VPN', 'Written access rules and a test log'],
        tools: ['Windows Server', 'RRAS VPN', 'NPS', 'DNS'],
        steps: ['Prepare the server, domain and an internal web page', 'Install Remote Access and configure the VPN', 'Add an NPS policy for a VPN users group', 'Connect from a client and open the internal site', 'Record what was allowed and what was blocked'] },
      { id: 'linux', e: '🐧', t: 'Linux web and file server', mods: [1, 5, 10, 4],
        brief: 'Install an Ubuntu server, host a website and an FTP share, and verify the traffic.',
        out: ['An Ubuntu server with users and safe permissions', 'A working web site (HTTP) and FTP share', 'Traffic to both services verified in Wireshark'],
        tools: ['Ubuntu Linux', 'Apache / HTTP', 'FTP', 'Wireshark'],
        steps: ['Install Ubuntu in a VM and create users', 'Set folder permissions for a shared team folder', 'Install and test a web server', 'Set up an FTP share for the team', 'Capture HTTP and FTP sessions in Wireshark'] },
    ],
  };
  w.CAPS = CAPS;

  /* ---------- helpers ---------- */
  function enrolled(i) { return !!(w.US && w.myE()[i]); }
  function swal(o) { return w.sw(o); }
  function swalBusy() { return w.Swal && w.Swal.isVisible && w.Swal.isVisible() && !(w.Swal.getPopup && w.Swal.getPopup() && w.Swal.getPopup().classList.contains('swal2-toast')); }
  function afterPopups(fn) { var n = 0; (function wait() { if (swalBusy() && n++ < 120) return setTimeout(wait, 400); fn(); })(); }
  function pct(ci) { return w.prog ? w.prog(ci).pct : 0; }
  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); if (v === null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, v); } catch (e) { w['_' + k] = v; return w['_' + k]; } return null; }

  /* =====================================================================
   *  1. CAPSTONES
   * ===================================================================== */
  function capList(i) { var c = w.cf(i); return (c && (c.caps || CAPS[i])) || []; }
  function capFind(i, id) { return capList(i).filter(function (x) { return x.id == id; })[0] || null; }
  function capOf(c) { var e = c && w.US && w.myE()[c.i]; return e && e.cap ? capFind(c.i, e.cap) : null; }
  w.capOf = capOf;
  w.capPick = function (i) { var v = ss('sf_cap_' + i); return v && capFind(i, v) ? v : undefined; }; // chosen before paying

  var _mods = w.mods;
  w.modsAll = _mods;
  function isStart(m) { return /^start here/i.test(m.t); }
  function isCapMod(m) { return !!m.gen && !isStart(m); }
  // module number of a course module (1-based), or 0 for "Start here" / capstone sections
  function modNo(m, list) {
    if (isStart(m) || isCapMod(m)) return 0;
    if (m.mi != null) return m.mi + 1;
    if (m.cmi != null) return m.cmi + 1;
    return list.filter(function (x) { return !isStart(x) && !isCapMod(x); }).indexOf(m) + 1;
  }
  function L(id, t, m, p) { return { id: id, t: t, m: m, p: p }; }
  function capModule(cp) {
    var brief = L('cp_' + cp.id + '_1', 'Project brief & plan', 'Read · 15 min', ['Read the brief and the outcomes', 'Write a one-page plan', 'Share it with your mentor if you are unsure']);
    brief.sy = '<h4 style="margin-top:0">' + cp.e + ' ' + esc(cp.t) + '</h4><p>' + esc(cp.brief) + '</p><h4>Outcomes</h4><ul class="ck">' + w.li(cp.out.map(esc)) + '</ul>' +
      '<h4>Tools</h4><p class="meta">' + cp.tools.map(esc).join(' · ') + '</p><h4>Steps</h4><ol>' + cp.steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>';
    return { t: 'Capstone project: ' + cp.t, gen: 1, capstone: cp.id, ls: [brief,
      L('cp_' + cp.id + '_2', 'Build the project', 'Project · 3–4 hrs', cp.steps),
      L('cp_' + cp.id + '_3', 'Submit for mentor review & present', 'Review · 30 min', ['Upload your project file or report (Ask a doubt → attach a link)', 'Apply your mentor’s feedback', 'Present your work in 5 minutes'])] };
  }
  // the learning path for one capstone: Start here + the modules it needs (course order) + the capstone module
  function capPath(c, cp, all) {
    all = all || _mods(c);
    var keep = all.filter(function (m) { var n = modNo(m, all); return n ? cp.mods.indexOf(n) > -1 : isStart(m); });
    return keep.concat([capModule(cp)]);
  }
  w.capPath = capPath;
  w.mods = function (c) {
    var r = _mods(c), cp = capOf(c);
    return cp ? capPath(c, cp, r) : r;
  };

  function lessonCount(ms) { return ms.reduce(function (n, m) { return n + m.ls.length; }, 0); }
  function treeHtml(c, cp) {
    var P = capPath(c, cp);
    return '<div class="cap-tree" aria-label="Your learning path"><div class="cap-root">🎯 <b>' + esc(cp.t) + '</b><small>' +
      (P.length - 1) + ' sections · ' + lessonCount(P) + ' lessons</small></div><ul>' + P.map(function (m) {
        var lab = (m.capstone ? '★ ' : '') + esc(m.t);
        return '<li><details' + (m.capstone ? ' open' : '') + '><summary>' + lab + ' <small>' + m.ls.length + ' lessons</small></summary><ul>' +
          m.ls.map(function (l) { return '<li>' + esc(l.t) + ' <small>' + esc(l.m || '') + '</small></li>'; }).join('') + '</ul></details></li>';
      }).join('') + '</ul></div>';
  }
  function capCard(i, cp, on, act) {
    return '<button type="button" class="cap-card' + (on ? ' on' : '') + '" aria-pressed="' + (on ? 'true' : 'false') + '" onclick="' + act + '(' + i + ',\'' + cp.id + '\')">' +
      '<span class="cap-e">' + cp.e + '</span><b>' + esc(cp.t) + '</b><span class="cap-b">' + esc(cp.brief) + '</span>' +
      '<span class="cap-o">' + cp.out.map(function (x) { return '<i>✓ ' + esc(x) + '</i>'; }).join('') + '</span>' +
      '<span class="cap-m">Modules ' + cp.mods.slice().sort(function (a, b) { return a - b; }).join(', ') + ' · ' + cp.tools.map(esc).join(', ') + '</span></button>';
  }

  // course page: "Capstone projects" section (before enrolling, the five projects with outcomes)
  w.capSectionHtml = function (c) {
    var L5 = capList(c.i); if (!L5.length) return '';
    var mine = capOf(c);
    return '<div class="cx-sec" id="cx-capstones"><h3>🛠️ ' + L5.length + ' Capstone Projects</h3><p class="cx-sub">' +
      (mine ? 'Your project: <b>' + esc(mine.t) + '</b>. You can switch in My Learning.' : 'Pick one project when you enroll. My Learning then shows only the lessons that project needs.') + '</p>' +
      '<div class="cap-grid">' + L5.map(function (cp) { return capCard(c.i, cp, mine && mine.id == cp.id, 'capFromPage'); }).join('') + '</div></div>';
  };
  w.capFromPage = function (i, id) {
    if (enrolled(i)) return capModal(i, 'change', id);
    ss('sf_cap_' + i, id); capModal(i, 'pre', id);
  };

  // modal: choose a capstone (before enrolling, or to change it later)
  function capModal(i, mode, sel) {
    var c = w.cf(i), L5 = capList(i); if (!L5.length) return w.enroll(i);
    sel = sel || (mode == 'pre' ? w.capPick(i) : (capOf(c) || {}).id) || null;
    var cp = sel ? capFind(i, sel) : null;
    w.cl_();
    $('mb').innerHTML = '<div class="cap-pick">' + (mode == 'pre' ? '<span class="pill">STEP 2 OF 4 · CHOOSE YOUR CAPSTONE</span>' : '<span class="pill">YOUR CAPSTONE PROJECT</span>') +
      '<h2 style="margin-top:12px">Choose your capstone project</h2><p class="sub" style="margin:0 0 12px">Each project lists what you will be able to show at the end. ' +
      'Your lessons are picked to match it.' + (mode == 'change' ? ' Lessons you already completed stay completed.' : '') + '</p>' +
      '<div class="cap-grid">' + L5.map(function (x) { return capCard(i, x, cp && cp.id == x.id, 'capSel'); }).join('') + '</div>' +
      (cp ? '<h4 style="margin:18px 0 8px">Your learning path</h4>' + treeHtml(c, cp) : '<p class="meta" style="margin-top:14px">Select a project to see its learning path.</p>') +
      '<div class="syl-go">' + (mode == 'pre'
        ? '<button class="btn pb" style="background:var(--br2)" ' + (cp ? '' : 'disabled ') + 'onclick="capGo(' + i + ')">Continue to enroll →</button><span class="meta" style="font-size:12.5px">Next: 3 Sign in / Sign up → 4 Pay</span>'
        : '<button class="btn pb" style="background:var(--br2)" ' + (cp ? '' : 'disabled ') + 'onclick="capSave(' + i + ')">Use this project</button><button class="syl-btn" type="button" onclick="cl_()">Cancel</button>') +
      '</div></div>';
    $('mo').classList.add('on');
    capModal.mode = mode; capModal.sel = cp ? cp.id : null;
  }
  w.capModal = capModal;
  w.capSel = function (i, id) { if (capModal.mode == 'pre') ss('sf_cap_' + i, id); capModal(i, capModal.mode || 'pre', id); };
  w.capGo = function (i) { if (!w.capPick(i)) return; w.cl_(); w.enroll(i); };
  w.capSave = function (i) {
    var id = capModal.sel; if (!id || !capFind(i, id) || !enrolled(i)) return;
    var all = w.enr();
    all[w.US.email][i].cap = id; w.sv('sf_enr', all);
    w.cl_(); w.LC = i; w.LS = null;
    if (location.hash == '#learn') w.renderLearn(); else w.nav('learn');
    swal({ toast: true, position: 'top-end', icon: 'success', title: 'Learning path updated', timer: 1800, showConfirmButton: false });
  };

  // enrolling: syllabus review (site-features) → choose capstone → sign in → pay
  var _enroll = w.enroll;
  w.enroll = function (i) {
    var c = w.cf(i);
    if (c && capList(i).length && !c.soon && !c.hid && !enrolled(i) && w.sylSeen && w.sylSeen(i) && !w.capPick(i)) return capModal(i, 'pre');
    return _enroll(i);
  };

  /* ---------- My Learning: capstone tree header, or a prompt to choose one ---------- */
  var _renderLearn = w.renderLearn;
  w.renderLearn = function () {
    _renderLearn();
    var lw = $('lw'); if (!lw || !w.US) return;
    var ci = +w.LC, c = w.cf(ci); if (!c || !enrolled(ci) || !capList(ci).length) return;
    var cp = capOf(c), ush = lw.querySelector('.ush'), ug = lw.querySelector('.ug');
    if (cp && ush) ush.insertAdjacentHTML('afterend', '<div class="cap-head">🎯 <div><small>Capstone project</small><b>' + esc(cp.t) + '</b></div><a class="lk" onclick="capModal(' + ci + ',\'change\')">Change</a></div>');
    if (!cp && ug) ug.insertAdjacentHTML('beforebegin', '<div class="cap-ask"><b>🛠️ Choose your capstone project</b><span>Pick 1 of ' + capList(ci).length +
      ' projects and we will show only the lessons it needs.</span><button class="btn" onclick="capModal(' + ci + ',\'change\')">Choose project →</button></div>');
  };

  /* =====================================================================
   *  2. RESUME UPLOAD (sign-up) → Resume builder
   * ===================================================================== */
  var CV_MAX = 5 * 1024 * 1024, CV_OK = /\.(pdf|docx|txt)$/i;
  var LIB = {
    pdf: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    pdfw: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
    zip: 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  };
  function loadJs(src) {
    return new Promise(function (ok, no) {
      var s = d.createElement('script'); s.src = src; s.onload = ok; s.onerror = function () { no(new Error('load ' + src)); }; d.head.appendChild(s);
    });
  }
  function readBuf(f) { return f.arrayBuffer ? f.arrayBuffer() : new Promise(function (ok) { var r = new FileReader(); r.onload = function () { ok(r.result); }; r.readAsArrayBuffer(f); }); }
  function readTxt(f) { return f.text ? f.text() : new Promise(function (ok) { var r = new FileReader(); r.onload = function () { ok(r.result); }; r.readAsText(f); }); }
  function pdfText(f) {
    return (w.pdfjsLib ? Promise.resolve() : loadJs(LIB.pdf)).then(function () {
      w.pdfjsLib.GlobalWorkerOptions.workerSrc = LIB.pdfw;
      return readBuf(f);
    }).then(function (b) { return w.pdfjsLib.getDocument({ data: b }).promise; }).then(function (doc) {
      var pages = []; for (var p = 1; p <= Math.min(doc.numPages, 6); p++) pages.push(p);
      return Promise.all(pages.map(function (p) {
        return doc.getPage(p).then(function (pg) { return pg.getTextContent(); }).then(function (tc) {
          var out = '', lastY = null;
          tc.items.forEach(function (it) { var y = it.transform ? it.transform[5] : null; if (lastY != null && y != null && Math.abs(y - lastY) > 2) out += '\n'; else if (out && !/\s$/.test(out)) out += ' '; out += it.str; if (it.hasEOL) out += '\n'; lastY = y; });
          return out;
        });
      })).then(function (t) { return t.join('\n'); });
    });
  }
  function docxText(f) {
    return (w.JSZip ? Promise.resolve() : loadJs(LIB.zip)).then(function () { return readBuf(f); }).then(function (b) { return w.JSZip.loadAsync(b); })
      .then(function (z) { var x = z.file('word/document.xml'); if (!x) throw new Error('not a docx'); return x.async('string'); })
      .then(function (xml) {
        return xml.replace(/<w:tab\/>/g, '\t').replace(/<\/w:p>/g, '\n').replace(/<w:br\/>/g, '\n').replace(/<[^>]+>/g, '')
          .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
      });
  }
  function fileText(f) {
    if (/\.pdf$/i.test(f.name)) return pdfText(f);
    if (/\.docx$/i.test(f.name)) return docxText(f);
    return readTxt(f);
  }

  // resume text → Resume builder fields
  var HEADS = [
    ['sum', /^(professional |career )?(summary|objective|profile|about me)\b/i],
    ['sk', /^(technical |key |core )?skills\b|^skill set\b|^technologies\b|^tools\b/i],
    ['pr', /^(academic |personal |key )?projects?\b/i],
    ['ex', /^(work |professional )?experience\b|^internships?\b|^employment\b|^work history\b/i],
    ['ed', /^education(al)?( qualifications?| details)?\b|^academic (qualifications?|details)\b|^qualifications?\b/i],
    ['ce', /^certifications?\b|^certificates?\b|^courses\b|^trainings?\b/i],
    ['la', /^languages?( known)?\b/i],
    ['_', /^(hobbies|interests|declaration|references|personal (details|information)|achievements|extra[- ]?curricular)\b/i],
  ];
  function cvParse(text) {
    var lines = String(text || '').replace(/\r/g, '').split('\n').map(function (l) { return l.replace(/\s+/g, ' ').trim(); }).filter(Boolean);
    var all = lines.join('\n'), f = {};
    var em = all.match(/[\w.+-]+@[\w-]+(\.[\w-]+)+/); if (em) f.em = em[0];
    var ph = all.match(/(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}\b/); if (ph) f.ph = ph[0].trim();
    var ln = all.match(/(https?:\/\/)?(www\.)?(linkedin\.com\/in|github\.com)\/[\w\-./]+/i); if (ln) f.ln = ln[0];
    var nm = lines.slice(0, 5).filter(function (l) { return /^[A-Za-z][A-Za-z .'-]{2,40}$/.test(l) && l.split(' ').length <= 4 && !/resume|curriculum|vitae|cv\b/i.test(l); })[0];
    if (nm) f.nm = nm.replace(/\b([a-z])/g, function (m) { return m.toUpperCase(); });
    var cur = null, buf = {};
    lines.forEach(function (l) {
      var h = l.replace(/[:\-–|•*]+$/, '').trim(), hit = l.length < 48 && HEADS.filter(function (x) { return x[1].test(h); })[0];
      if (hit) { cur = hit[0]; var rest = l.replace(/^[^:]+:\s*/, ''); if (rest != l && rest) (buf[cur] = buf[cur] || []).push(rest); return; }
      if (cur && cur != '_') (buf[cur] = buf[cur] || []).push(l);
    });
    function clean(a) { return a.map(function (x) { return x.replace(/^[\s•\-*·▪●◦]+/, '').trim(); }).filter(Boolean); }
    if (buf.sum) f.sum = clean(buf.sum).join(' ').slice(0, 600);
    if (buf.sk) f.sk = clean(buf.sk).join(', ').split(/\s*[,|•·;]\s*/).filter(function (x) { return x && x.length < 40; }).slice(0, 25).join(', ');
    ['pr', 'ex', 'ed', 'ce'].forEach(function (k) { if (buf[k]) f[k] = clean(buf[k]).slice(0, 10).join('\n').slice(0, 1200); });
    if (buf.la) f.la = clean(buf.la).join(', ').slice(0, 120);
    return f;
  }
  w.cvParse = cvParse;

  function cvStatus(id, html) { var s = $(id); if (s) s.innerHTML = html; }
  // read a chosen file → { name, size, type, at, f: fields }
  function cvRead(file) {
    if (!file) return Promise.reject(new Error('none'));
    if (!CV_OK.test(file.name)) return Promise.reject(new Error('Please choose a PDF, DOCX or TXT file.'));
    if (file.size > CV_MAX) return Promise.reject(new Error('The file is larger than 5 MB.'));
    return fileText(file).then(function (t) { return cvParse(t); }, function () { return {}; }).then(function (f) {
      return { name: file.name, size: file.size, type: file.type || '', at: new Date().toISOString(), f: f };
    });
  }
  function cvSummary(cv) {
    var n = Object.keys(cv.f || {}).length;
    return '✅ <b>' + esc(cv.name) + '</b> (' + Math.max(1, Math.round(cv.size / 1024)) + ' KB)' +
      (n ? ' · read ' + n + ' details for your Resume builder' : ' · saved (we could not read its text, you can fill the builder yourself)');
  }
  // sign-up form
  w.CVP = null; // { cv, file } chosen on the sign-up form, kept until the account exists
  w.cvPick = function (inp) {
    var file = inp.files && inp.files[0];
    w.CVP = null;
    if (!file) { cvStatus('scvs', ''); return; }
    cvStatus('scvs', 'Reading your resume…');
    cvRead(file).then(function (cv) { w.CVP = { cv: cv, file: file }; cvStatus('scvs', cvSummary(cv)); },
      function (e) { inp.value = ''; cvStatus('scvs', '<span style="color:#b3261e">' + esc(e.message) + '</span>'); });
  };
  // used by signup(): what to store with the new account (metadata stays small: fields only, no file)
  w.cvLocal = function () { return w.CVP ? w.CVP.cv : undefined; };
  function myCv() { var u = w.US && (w.ld('sf_users', {}) || {})[w.US.email]; return (u && u.cv) || null; }
  w.myCv = myCv;
  function setCv(cv) {
    if (!w.US) return; var us = w.ld('sf_users', {}), e = w.US.email;
    us[e] = us[e] || { n: w.US.name, h: '', p: 'email' }; us[e].cv = cv; w.sv('sf_users', us);
  }
  // after sign-in: attach a resume chosen on the sign-up form to this account, and upload it when Supabase is on
  var _go = w.go;
  w.go = function (s) {
    var r = _go.apply(this, arguments);
    if (s && s.role != 'a' && w.CVP && !myCv()) setCv(w.CVP.cv);
    return r;
  };
  // cloud-sync calls this after each pull (c = Supabase client)
  w.cvSync = function (c, uid) {
    if (!c || !uid || !w.US) return;
    var mine = myCv(), meta = w.CLOUD && w.CLOUD.user && w.CLOUD.user.user_metadata && w.CLOUD.user.user_metadata.cv;
    if (!mine && meta && meta.name) { setCv(meta); mine = meta; }
    if (w.CVP && w.CVP.file && mine && mine.name == w.CVP.cv.name && !mine.path) {
      var ext = (w.CVP.file.name.match(/\.(pdf|docx|txt)$/i) || ['', 'pdf'])[1].toLowerCase(), path = uid + '/resume.' + ext;
      c.storage.from('resumes').upload(path, w.CVP.file, { upsert: true, contentType: w.CVP.file.type || undefined }).then(function (r) {
        if (r.error) return;
        var cv = Object.assign({}, myCv() || mine, { path: path }); setCv(cv); w.CVP = null;
        c.from('profiles').update({ resume_path: path, resume_name: cv.name, resume_fields: cv.f || {} }).eq('id', uid).then(function () {});
      });
    }
  };
  // Resume builder: "Import from my resume" (upload or replace later)
  w.cvImport = function (inp) {
    var file = inp.files && inp.files[0]; if (!file) return;
    cvStatus('rcvs', 'Reading your resume…');
    cvRead(file).then(function (cv) {
      setCv(cv); w.CVP = { cv: cv, file: file };
      var g = w.lmsG(), r = Object.assign({}, g.resume || {});
      Object.keys(cv.f).forEach(function (k) { if (k != 'nm' && k != 'em') delete r[k]; }); // fields from the new resume replace the old ones
      w.lmsS({ resume: r });
      if (w.CLOUD && w.CLOUD.uid) w.sbGet(function (c) { w.cvSync(c, w.CLOUD.uid); });
      w.nxRender();
      swal({ toast: true, position: 'top-end', icon: 'success', title: 'Resume imported', timer: 1800, showConfirmButton: false });
    }, function (e) { inp.value = ''; cvStatus('rcvs', '<span style="color:#b3261e">' + esc(e.message) + '</span>'); });
  };

  // Resume builder fields: empty ones are filled from the uploaded resume, the capstone and the course
  var _rsData = w.rsData;
  w.rsData = function () {
    var r = _rsData(), cv = myCv(), f = (cv && cv.f) || {}, c = w.cf(w.ccId()), cp = capOf(c);
    function empty(k) { return r[k] == null || String(r[k]).trim() === ''; }
    ['ph', 'ln', 'sum', 'ex', 'ed', 'ce', 'la'].forEach(function (k) { if (empty(k) && f[k]) r[k] = f[k]; });
    if (empty('sk') && f.sk) {
      var base = (c.i == 1 && w.RDEF ? w.RDEF.sk : (c.k || []).join(', ')).split(/\s*,\s*/), seen = {};
      r.sk = base.concat(f.sk.split(/\s*,\s*/)).filter(function (x) { var k = x.toLowerCase(); if (!x || seen[k]) return false; seen[k] = 1; return true; }).join(', ');
    }
    if (empty('pr') && (cp || f.pr)) {
      var pr = [];
      if (cp) pr.push('Capstone: ' + cp.t + ' — ' + cp.out[0]);
      pr = pr.concat(String((c.i == 1 && w.RDEF ? w.RDEF.pr : '') || '').split('\n'), String(f.pr || '').split('\n')).filter(Boolean);
      r.pr = pr.join('\n');
    }
    return r;
  };
  var _nxResume = w.nxResume;
  w.nxResume = function () {
    var cv = myCv();
    return '<div class="cv-imp"><div><b>📎 ' + (cv ? 'Filled in from your resume: ' + esc(cv.name) : 'Import your existing resume') + '</b><span class="meta" id="rcvs">' +
      (cv ? 'Empty fields use your uploaded resume, your capstone project and the course.' : 'PDF, DOCX or TXT (max 5 MB). We fill in the fields for you.') + '</span></div>' +
      '<label class="btn o cv-btn">' + (cv ? 'Replace resume' : 'Upload resume') + '<input type="file" accept=".pdf,.docx,.txt" onchange="cvImport(this)" hidden></label></div>' + _nxResume();
  };

  /* =====================================================================
   *  3. WRONG MCQ ANSWERS → the floating AI chatbot explains
   * ===================================================================== */
  function mcqReview(id, set, answers) {
    var m = w.qzMod ? w.qzMod(id) : null;
    return set.map(function (q, k) { return { q: q, ch: answers[k] }; }).filter(function (x) { return x.ch !== x.q[2]; }).map(function (x) {
      return { question: x.q[0], options: x.q[1], correct: x.q[1][x.q[2]], chosen: x.ch == null ? '(no answer)' : x.q[1][x.ch], module: m ? m.t : '' };
    });
  }
  w.mcqReview = mcqReview;
  function reviewFallback(rv) {
    return '<b>Let’s go over the questions you missed</b>' + rv.map(function (r, k) {
      var kb = w.kSearch ? w.kSearch(r.question + ' ' + r.correct)[0] : null;
      return '<div class="mcq-rv"><b>' + (k + 1) + '. ' + esc(r.question) + '</b><br>✗ Your answer: ' + esc(r.chosen) + '<br>✓ Correct answer: <b>' + esc(r.correct) + '</b>' +
        (kb ? '<br><small>Related concept · <b>' + esc(kb.e.t) + '</b>: ' + esc(String(kb.e.x).slice(0, 220)) + (String(kb.e.x).length > 220 ? '…' : '') + '</small>' : '') + '</div>';
    }).join('') + (rv[0] && rv[0].module ? '<p class="meta" style="margin:8px 0 0">Revisit: ' + esc(rv[0].module) + '</p>' : '') +
      '<div class="ai-acts"><button class="ai-btn" onclick="aiHandMentor()">Ask my mentor</button></div>';
  }
  w.mcqExplain = function (rv) {
    if (!rv || !rv.length) return;
    if (!$('cbp').classList.contains('open')) w.cbT();
    var label = rv.length == 1 ? 'Explain the MCQ question I got wrong' : 'Explain the ' + rv.length + ' MCQ questions I got wrong';
    if (w.aiExplainMcq) w.aiExplainMcq(label, rv, reviewFallback(rv));
    else { w.cbM('u', label); w.cbM('b', reviewFallback(rv), 1); }
  };
  var _lqSubmit = w.lqSubmit;
  w.lqSubmit = function (id) {
    var set = w.lqSet(id), x = w.qzRead(set, 'lq');
    var r = _lqSubmit(id);
    if (x.n === set.length) { var rv = mcqReview(id, set, x.a); if (rv.length) afterPopups(function () { setTimeout(function () { w.mcqExplain(rv); }, 250); }); }
    return r;
  };

  /* =====================================================================
   *  4. MILESTONES: 30 resume · 50 internships · 60 career · 80 placement prep · 100 certificate
   * ===================================================================== */
  function isIntern(j) { return /intern|trainee/i.test(j[0] + ' ' + j[1]); }
  var _jobFor = w.jobFor;
  w.jobFor = function (i) { // Career → Internships & jobs: internships from 50%, full-time roles from 60%
    if (!_jobFor(i)) return false;
    var P = pct(w.ccId()); return P >= (isIntern(w.JOBS[i]) ? STAGE.intern : STAGE.career);
  };
  var _nxJobs = w.nxJobs;
  w.nxJobs = function () {
    var P = pct(w.ccId());
    return (P < STAGE.career ? '<div class="cv-imp"><div><b>🔓 Internships are unlocked</b><span class="meta">Full-time career opportunities unlock at ' + STAGE.career + '% (you are at ' + P + '%).</span></div></div>' : '') + _nxJobs();
  };
  // the chatbot's "you are eligible for" list (networking course) follows the same milestones
  w.hEligIds = function () {
    if (!w.isEn()) return null; if (!w.myE()[1]) return [];
    var P = pct(1);
    return w.JOBS.map(function (j, i) { return i; }).filter(function (i) { return w.jobOn(i) && P >= (isIntern(w.JOBS[i]) ? STAGE.intern : STAGE.career); });
  };
  // a finished module no longer pops up "you are eligible": internships and jobs unlock with the milestones
  w.eligPop = function () { swal({ toast: true, position: 'top-end', icon: 'success', title: 'Module completed', timer: 1800, showConfirmButton: false, timerProgressBar: true }); };

  var PREP = {
    1: [
      ['Explain the OSI model and where a switch and a router work.', 'Name the layers, then say switch = layer 2 (MAC), router = layer 3 (IP).'],
      ['How do you find the network address and host range of 192.168.10.70/26?', 'Block size 64 → network .64, hosts .65–.126, broadcast .127.'],
      ['A user gets a 169.254.x.x address. What do you check?', 'DHCP server, scope, cable/VLAN, ipconfig /renew, the DHCP traffic in Wireshark.'],
      ['What is a VLAN and why use one?', 'Separates broadcast domains: security, less noise, groups by department.'],
      ['DNS resolves names, but a website still does not open. Next steps?', 'Ping the IP, check the service port, firewall, and HTTP status.'],
      ['What does Active Directory give a company?', 'Central users, groups, computers, sign-in and Group Policy.'],
      ['How would you troubleshoot a slow network?', 'Start at layer 1, check utilisation, duplex, errors, then capture traffic.'],
      ['Walk us through your capstone project.', 'Problem → design → what you built → how you tested it → what you would improve.'],
    ],
  };
  var PREP_STEPS = [['cv', 'Resume reviewed by your mentor'], ['li', 'LinkedIn profile updated with your capstone'], ['ap', 'Aptitude practice (2 sets)'],
    ['mt', 'Technical mock interview'], ['mh', 'HR mock interview'], ['pf', 'Portfolio: capstone screenshots and report']];
  function prepHtml(ci) {
    var g = w.lmsG(), st = g.prep || {}, c = w.cf(ci), cp = capOf(c), Q = PREP[ci] || (c.jr || []).slice(0, 4).map(function (r) { return ['Why do you want to work as a ' + r + '?', 'Link your course skills and your capstone to the role.']; });
    var done = PREP_STEPS.filter(function (s) { return st[s[0]]; }).length;
    return '<p class="sub">Get ready for interviews: ' + done + ' of ' + PREP_STEPS.length + ' steps done.</p><div class="two"><div class="card"><h3 style="margin-top:0">✅ Placement checklist</h3>' +
      PREP_STEPS.map(function (s) { return '<label class="prep-i"><input type="checkbox" ' + (st[s[0]] ? 'checked ' : '') + 'onchange="prepTick(\'' + s[0] + '\',this.checked)"> ' + esc(s[1]) + '</label>'; }).join('') +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px"><button class="btn" onclick="prepMock()">' + (st.req ? '✓ Mock interview requested' : 'Request a mock interview') + '</button>' +
      '<button class="btn o" onclick="NT=\'resume\';nav(\'next\')">Polish my resume</button></div></div>' +
      '<div class="card"><h3 style="margin-top:0">🎤 Common interview questions</h3>' + Q.map(function (q) { return '<details class="prep-q"><summary>' + esc(q[0]) + '</summary><p class="meta">What to cover: ' + esc(q[1]) + '</p></details>'; }).join('') +
      (cp ? '<p class="meta" style="margin-top:10px">Tip: use <b>' + esc(cp.t) + '</b> as your main example.</p>' : '') +
      '<button class="btn o" style="margin-top:10px" onclick="prepAsk()">Practise with the AI assistant</button></div></div>';
  }
  w.prepTick = function (k, v) { var g = w.lmsG(), st = Object.assign({}, g.prep || {}); st[k] = v ? 1 : 0; w.lmsS({ prep: st }); };
  w.prepMock = function () {
    var g = w.lmsG(), st = Object.assign({}, g.prep || {}); if (st.req) return;
    st.req = new Date().toISOString(); var ds = (g.doubts || []).slice();
    ds.unshift({ q: '[Mock interview request] Please schedule a mock interview for ' + w.cf(w.ccId()).t + '.', d: new Date().toLocaleDateString('en-IN'), src: 'prep' });
    w.lmsS({ prep: st, doubts: ds });
    swal({ icon: 'success', title: 'Mock interview requested', text: 'Your mentor will reply with a time in My doubts, usually within 24 hours.', confirmButtonText: 'OK' }).then(function () { w.nxRender(); });
  };
  w.prepAsk = function () { if (!$('cbp').classList.contains('open')) w.cbT(); w.cbS('Give me one interview question for my course and wait for my answer, then give feedback.'); };

  // Career steps page with a tab per milestone
  var TABS = [['resume', '📄 Resume builder', 'resume'], ['jobs', '💼 Internships & jobs', 'intern'], ['prep', '🎯 Placement preparation', 'prep'], ['cert', '🎓 Certificate', 'cert'], ['alumni', '🤝 Alumni community', 'cert']];
  function need(t) { var x = TABS.filter(function (y) { return y[0] == t; })[0]; return x ? STAGE[x[2]] : 100; }
  w.stageNeed = need;
  w.nxRender = function () {
    var box = $('nx'); if (!box) return;
    if (!w.isEn()) { box.innerHTML = '<h2>Career steps</h2><p class="sub">Enroll in a course first.</p><button class="btn" onclick="nav(\'course\')">View course →</button>'; return; }
    if (!TABS.some(function (t) { return t[0] == w.NT; })) w.NT = 'jobs';
    var ci = w.ccId(), c = w.cf(ci), P = pct(ci), tab = w.NT, n = need(tab), body;
    if (P < n) body = '<div class="card nx-lock"><b>🔒 Unlocks at ' + n + '% progress</b><p class="meta">You are at <b>' + P + '%</b> in ' + esc(c.t) + '. Keep going in My Learning.</p>' +
      '<div class="prog"><i style="width:' + Math.round(P / n * 100) + '%"></i></div><button class="btn" style="margin-top:12px" onclick="nav(\'learn\')">Continue learning →</button></div>';
    else body = tab == 'jobs' ? w.nxJobs() : tab == 'cert' ? w.nxCert() : tab == 'resume' ? w.nxResume() : tab == 'prep' ? prepHtml(ci) : w.nxAlumni();
    box.innerHTML = '<h2>Career steps</h2><p class="sub" style="margin-bottom:6px">' + esc(c.t) + ' · <b>' + P + '%</b> complete. Each step unlocks at a milestone.</p>' +
      '<div class="xo" style="margin:12px 0 18px">' + TABS.map(function (t) {
        var lk = P < STAGE[t[2]];
        return '<span class="chip' + (tab == t[0] ? ' on' : '') + (lk ? ' lkd' : '') + '" onclick="NT=\'' + t[0] + '\';nav(\'next\')">' + (lk ? '🔒 ' : '') + t[1] + (lk ? ' · ' + STAGE[t[2]] + '%' : '') + '</span>';
      }).join('') + '</div>' + body;
  };
  // the step bar at the top of learner pages
  w.fbInit = function (h) {
    var a = h == 'landing' ? 0 : h == 'courses' ? 1 : h == 'course' ? 2 : h == 'learn' ? 4 : h == 'next' ? { jobs: 5, prep: 5, cert: 6, resume: 7, alumni: 8 }[w.NT] : -1;
    var en = w.isEn(), P = en ? pct(w.ccId()) : 0, nd = { 5: STAGE.intern, 6: STAGE.cert, 7: STAGE.resume, 8: STAGE.cert };
    d.querySelectorAll('.fbar').forEach(function (el) {
      el.innerHTML = w.FS.map(function (t, i) {
        var c = i == a ? 'on' : i <= 4 ? ((i < a || (i == 3 && en) || (i == 4 && en)) ? 'dn' : '') : (en && P >= nd[i] ? (i < a ? 'dn' : '') : 'lk');
        return '<span class="' + c + '" onclick="fbGo(' + i + ')">' + (i + 1) + '. ' + t + '</span>';
      }).join('');
    });
  };

  // milestone pop-ups (progress.js calls this instead of its small toast)
  w.msAction = function (ci, m) {
    var c = w.cf(ci); if (!c) return false;
    function go(tab) { return function (r) { if (r && r.isConfirmed) { w.NT = tab; w.nav('next'); } }; }
    if (m == STAGE.resume) {
      var cv = myCv();
      swal({ icon: 'success', title: '30% complete · build your resume', html: 'Your <b>Resume builder</b> is unlocked' + (cv ? ', already filled in from <b>' + esc(cv.name) + '</b>' : '') + ' with your skills from ' + esc(c.t) + '.',
        confirmButtonText: 'Open Resume builder →', showCancelButton: true, cancelButtonText: 'Later' }).then(go('resume'));
      return true;
    }
    if (m == STAGE.intern) {
      var it = (w.recIntern(ci).eligible || []).filter(function (x) { return x.intern; }).map(function (x) { return x.t; });
      swal({ icon: 'success', title: '50% complete · internships unlocked', html: 'You can now apply for internship opportunities' + (it.length ? ':<br><b>' + it.slice(0, 3).map(esc).join('<br>') + '</b>' : '.'),
        confirmButtonText: 'View internships →', showCancelButton: true, cancelButtonText: 'Later' }).then(go('jobs'));
      return true;
    }
    if (m == STAGE.career) {
      var jr = (c.jr || []).slice(0, 4);
      swal({ icon: 'success', title: '60% complete · career opportunities', html: 'Full-time roles are now open to you' + (jr.length ? ', for example:<br><b>' + jr.map(esc).join('<br>') + '</b>' : '.') + '<br><span style="font-size:13px">Placement preparation unlocks at 80%.</span>',
        confirmButtonText: 'See career opportunities →', showCancelButton: true, cancelButtonText: 'Later' }).then(go('jobs'));
      return true;
    }
    if (m == STAGE.prep) {
      swal({ icon: 'success', title: '80% complete · placement preparation', html: 'Your placement checklist, common interview questions and mock interview requests are unlocked.',
        confirmButtonText: 'Start preparing →', showCancelButton: true, cancelButtonText: 'Later' }).then(go('prep'));
      return true;
    }
    return false;
  };

  // pages already drawn before this file loaded
  if (location.hash == '#learn' && w.US) w.renderLearn();
  if (location.hash == '#next' && w.US) w.nxRender();
  if (location.hash == '#internship' && w.renderIntern) w.renderIntern();
})(window, document);

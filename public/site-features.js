/* ingage EduTech – site features
 *  1. Course syllabus on every course page, plus a "review the syllabus" step before enrolling
 *  2. Internship details page (#internship) with overview, process, roles, eligibility and FAQs
 *  3. Floating AI chatbot available on every page (compact on phones, over dialogs, page-aware)
 * Loaded after the main page script and chat-live.js.
 */
(function (w, d) {
  'use strict';
  var $ = w.$, esc = w.esc;

  /* =====================================================================
   *  EDIT INTERNSHIP DETAILS HERE (shown on the #internship page)
   *  Only state what ingage actually offers.
   * ===================================================================== */
  var INTERN = {
    title: 'Internship & Placement Program',
    overview: 'Turn what you learn into real work experience. As you complete course modules and pass their MCQ tests, you unlock internship roles that match your skills. Apply from your Career dashboard, prepare with resume and interview support, and spend around three months working on real tasks with mentor guidance.',
    facts: [
      ['Duration', 'Typically 3 months'],
      ['Stipend', 'Most internships are paid'],
      ['Eligibility', 'Enrolled learners who complete modules'],
      ['Placement', '100% placement assistance'],
    ],
    steps: [
      ['Enroll in a course', 'Pick a course and start learning in My Learning.'],
      ['Complete modules & MCQ tests', 'Each module you finish unlocks internship roles that match it.'],
      ['Build your resume', 'Use Career → Resume preparation and add your lab screenshots and projects.'],
      ['Apply', 'Apply for open roles in Career → Internships & jobs.'],
      ['Interview & selection', 'Track your status: Applied → Shortlisted → Interview → Selected.'],
      ['Intern, then go full-time', 'Finish the internship and join placement drives for full-time roles.'],
    ],
    gain: [
      'Hands-on work on real networks, systems and projects',
      'Guidance from mentors and industry teams',
      'Resume reviews, portfolio reviews and mock interviews',
      'A track record to show employers, and access to placement drives',
    ],
    tips: [
      'Keep screenshots of your lab work (Packet Tracer, GNS3, Wireshark) to show in interviews.',
      'Finish the MCQ test of each module: that is what unlocks matching roles.',
      'Update your resume in Career → Resume preparation before applying.',
    ],
    faq: [
      ['Who can apply?', 'Learners enrolled in an ingage course. Complete modules and pass their MCQ tests to become eligible for the matching roles.'],
      ['How long is the internship?', 'Internships are typically 3 months long.'],
      ['Is the internship paid?', 'Most internships include a stipend. The amount depends on the company and the role, and is shared when you are shortlisted.'],
      ['When can I apply?', 'As soon as you complete a module and its MCQ test. A popup shows the roles you have unlocked, and they appear in Career → Internships & jobs.'],
      ['Do I need prior experience?', 'No. Our internships are meant for students, freshers and career switchers who have completed the course modules.'],
      ['What does 100% placement assistance mean?', 'Every learner gets full placement support: resume and portfolio reviews, mock interviews, placement drives, internships and alumni referrals. Final selection is made by the hiring company after its interview, so a job is not guaranteed.'],
      ['How are internships recommended to me?', 'Your recommendations update automatically as your course progress grows. You can see them in My Learning, on this page when you are logged in, and by asking the chatbot.'],
      ['Who do I contact with questions?', 'Call or WhatsApp +91 99416 56492, or email sriharsha@myingage.com.'],
    ],
  };
  w.INTERN = INTERN;

  /* ---------- helpers ---------- */
  function seenKey(i) { return 'sf_syl_' + i; }
  function sylSeen(i) { try { return sessionStorage.getItem(seenKey(i)) == '1'; } catch (e) { return !!w['_syl' + i]; } }
  function sylMark(i) { try { sessionStorage.setItem(seenKey(i), '1'); } catch (e) { w['_syl' + i] = 1; } }
  w.sylSeen = sylSeen;
  function enrolled(i) { return !!(w.US && w.myE()[i]); }
  function closeChatOnPhone() { if (innerWidth <= 560 && $('cbp').classList.contains('open')) w.cbT(); }

  /* =====================================================================
   *  1. SYLLABUS
   * ===================================================================== */
  function sylData(c) {
    var ms = (w.modsAll || w.mods)(c).filter(function (m) { return !/^start here/i.test(m.t); }); // the full course, not one capstone's path
    return ms.map(function (m) {
      return {
        t: m.t.replace(/^Module \d+:\s*/, ''),
        cap: !!m.gen,
        items: (m.ls || []).map(function (l) { return { t: l.t, m: l.m || '' }; }),
      };
    });
  }
  function sylStats(c, D) {
    var mods = D.filter(function (m) { return !m.cap; }), lessons = D.reduce(function (n, m) { return n + m.items.length; }, 0);
    return { mods: mods.length, lessons: lessons, cap: D.some(function (m) { return m.cap; }) || c.i == 1 };
  }
  function sylModsHtml(c, D, openFirst) {
    var n = 0;
    return '<div class="syl-mods">' + D.map(function (m, k) {
      var label = m.cap ? '★' : ++n;
      return '<details class="syl-m"' + (openFirst && k == 0 ? ' open' : '') + ' data-i="' + c.i + '"><summary><span class="n">' + label + '</span><span class="t">' +
        (m.cap ? '' : 'Module ' + n + ': ') + esc(m.t) + '</span><span class="c">' + m.items.length + ' lessons</span></summary><ol>' +
        m.items.map(function (x) { return '<li>' + esc(x.t) + (x.m ? '<small>' + esc(x.m) + '</small>' : '') + '</li>'; }).join('') +
        '</ol></details>';
    }).join('') + '</div>';
  }
  function sylSummary(c, D) {
    var s = sylStats(c, D);
    return '<div class="syl-sum"><span>📚 ' + s.mods + ' modules</span><span>🧩 ' + s.lessons + ' lessons</span><span>⏱ ' + c.h + ' hours</span>' +
      '<span>📝 MCQ test per module</span>' + (s.cap ? '<span>🛠️ Capstone project</span>' : '') + '<span>🎓 Certificate</span></div>' +
      ((c.pre || []).length ? '<p class="syl-req"><b>Before you start:</b> ' + c.pre.map(esc).join(' · ') + '</p>' : '') +
      '';
  }
  function sylHtml(c) {
    var D = sylData(c);
    if (!D.length) return '';
    return '<div class="syl" id="syl"><div class="syl-h"><h3>📄 Course syllabus</h3><div class="syl-acts">' +
      '<button class="syl-btn" type="button" onclick="sylAll(this)">Expand all</button>' +
      '<button class="syl-btn" type="button" onclick="sylPrint(' + c.i + ')">⬇ Download / Print</button></div></div>' +
      sylSummary(c, D) + sylModsHtml(c, D, true) + '</div>';
  }
  w.sylAll = function (b) {
    var all = d.querySelectorAll('#syl .syl-m'), open = b.textContent == 'Expand all';
    all.forEach(function (x) { x.open = open; });
    b.textContent = open ? 'Collapse all' : 'Expand all';
    if (all[0]) sylMark(+all[0].dataset.i);
  };
  w.sylGo = function () { var s = $('syl'); if (s) s.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  w.sylPrint = function (i) {
    var c = w.cf(i), D = sylData(c);
    sylMark(i);
    var css = '<style>body{font:14px/1.5 Arial,sans-serif;color:#0f1f3d;margin:32px}h1{margin:0 0 4px}.syl-sum span{display:inline-block;margin:0 6px 6px 0;padding:4px 10px;border:1px solid #bcd;border-radius:20px;font-size:12px}' +
      '.syl-m{border:1px solid #ccd;border-radius:10px;margin:8px 0;padding:8px 14px;page-break-inside:avoid}summary{font-weight:700;list-style:none}.syl-m ol{margin:6px 0 0}small{display:block;color:#667}.n,.c{display:none}</style>';
    var html = '<!doctype html><html><head><meta charset="utf-8"><title>' + esc(c.t) + ' – Syllabus</title>' + css + '</head><body><h1>' + esc(c.t) + '</h1><p>ingage EduTech · ' +
      c.h + ' hours · ' + w.fee(c.f) + ' (incl. GST)</p>' + sylSummary(c, D) + sylModsHtml(c, D, false).replace(/<details/g, '<details open') +
      '<p style="margin-top:18px;color:#667">Questions? +91 99416 56492 · sriharsha@myingage.com</p></body></html>';
    var x = w.open && w.open('', '_blank');
    if (!x) return;
    x.document.write(html); x.document.close();
    setTimeout(function () { try { x.focus(); x.print(); } catch (e) {} }, 300);
  };

  /* =====================================================================
   *  COURSE DETAILS – edit per course: technologies, industry relevance, real-world uses
   * ===================================================================== */
  var COURSE_INFO = {
    1: { tech: ['Cisco Packet Tracer', 'GNS3', 'Wireshark', 'VirtualBox', 'Windows Server', 'Active Directory', 'Group Policy', 'Ubuntu Linux', 'DHCP · DNS · HTTP · FTP', 'VPN & NPS', 'IPv4 / IPv6'],
      why: 'Every business runs on a network. Companies of all sizes need people who can set up, secure and fix LANs, servers and user accounts: the everyday work of L1 network and system administration teams.',
      apps: ['Setting up and running office and branch networks', 'Supporting users, servers and Active Directory at IT service companies', 'Monitoring links and handling incidents in NOC teams', 'Giving employees secure remote access with VPNs'] },
    2: { tech: ['Tinkercad Circuits', 'Arduino', 'Breadboarding', 'KiCad (schematic & PCB editors)', 'ERC / DRC checks', 'Gerber & drill files'],
      why: 'Every electronic product, from phones to EV chargers, is built on printed circuit boards. India’s electronics manufacturing is growing fast, and companies need people who can design, check and test boards that factories can build.',
      apps: ['Designing boards for IoT devices and sensors', 'Motor and power boards for EVs and appliances', 'Testing and debugging boards in electronics factories', 'Prototyping student and startup hardware projects'] },
    3: { tech: ['Airborne & ground LiDAR', 'LAS / LAZ point clouds', 'Ground classification', 'DEM / DSM', 'Contours & slope maps', 'GIS layers', 'Coordinate systems'],
      why: 'Planners and engineers rely on accurate terrain models before they build roads, drains or mines. LiDAR terrain processing is used daily by survey, GIS and infrastructure firms.',
      apps: ['Road, rail and pipeline route planning', 'Flood and drainage analysis', 'Forestry and agriculture mapping', 'Earthwork and mining volume calculations'] },
    4: { tech: ['Unity', 'C#', 'VR headsets', 'Mobile AR (plane & image tracking)', '3D assets & physics', 'XR user interfaces', 'Performance profiling'],
      why: 'Companies use AR and VR to train staff safely, sell products and teach complex topics. Unity skills for XR are needed in training, education, real-estate and gaming teams.',
      apps: ['Training simulators for industry and healthcare', 'Virtual property and architecture walkthroughs', 'Educational AR apps', 'Interactive product demos'] },
    5: { tech: ['IoT sensors & gateways', 'Real-time data streams', '3D visualisation', 'Dashboards & alerts', 'Simulation & what-if analysis', 'Predictive maintenance'],
      why: 'Industry 4.0 factories, smart buildings and utilities use digital twins to watch assets live and fix problems before they happen. Engineers who connect IoT data to 3D models are increasingly in demand.',
      apps: ['Predictive maintenance for factory machines', 'Energy management in smart buildings', 'Smart-city traffic and utility monitoring', 'Remote monitoring of plants and assets'] },
    6: { tech: ['Firewalls & VPNs', 'Access control & MFA', 'Vulnerability scanning', 'Log analysis & SIEM basics', 'Windows & Linux hardening', 'Incident response'],
      why: 'Every organisation that stores data is a target. Banks, IT services, e-commerce and government teams hire analysts who can spot attacks early and keep systems secure.',
      apps: ['Watching alerts in Security Operations Centres (SOC)', 'Protecting banking and e-commerce systems', 'Running security audits and compliance checks', 'Responding to phishing and malware incidents'] },
    7: { tech: ['Flutter SDK', 'Dart', 'Android Studio / VS Code', 'Provider (state management)', 'REST APIs, HTTP & JSON', 'Local storage (shared_preferences)'],
      why: 'Most people reach businesses through their phones. Startups, agencies, banks and shops need developers who can ship one app to both Android and iOS quickly, and Flutter is one of the most used tools for that.',
      apps: ['Shopping and food-delivery apps', 'Banking and payment apps', 'Learning and booking apps', 'Internal apps for field staff with camera and location'] },
    8: { tech: ['EV motors & inverters', 'Power electronics (MOSFETs, boost converters)', 'Tinkercad circuit simulation', 'Charging standards (AC, DC, CCS2)', 'Battery management systems (SOC, SOH)', 'Smart charging & V2G'],
      why: 'India is moving fast to electric two-wheelers, cars and buses. EV makers, battery companies and charging networks need technicians and engineers who understand motors, charging and battery safety.',
      apps: ['Servicing electric scooters, cars and buses', 'Installing and maintaining charging stations', 'Testing and monitoring battery packs', 'Planning fleet charging for delivery and transport companies'] },
    9: { tech: ['Industrial robot arms (6-axis, SCARA)', 'Teach pendant programming', 'Robot I/O and program logic', 'Sensors, grippers and vision', 'PLC, HMI and SCADA', 'Robot safety and cobots'],
      why: 'Car, electronics, packaging and metal plants in India are adding robots to raise quality and output. They need people who can program robots, keep cells running and work safely around them.',
      apps: ['Welding and painting on car assembly lines', 'Pick-and-place and packing in FMCG and electronics', 'Palletizing in warehouses', 'Machine tending for CNC and moulding machines'] },
    10: { tech: ['Arduino and ESP32', 'Sensors and actuators', 'Blynk IoT dashboards', 'ThingSpeak and MATLAB analysis', 'MQTT, HiveMQ and Node-RED', 'Firebase, Kodular apps, Twilio and Convai'],
      why: 'Factories, farms, homes, hospitals and cities are adding connected sensors to save energy, prevent breakdowns and act on live data. Companies need people who can wire sensors, program boards and get the data to the cloud and to a phone.',
      apps: ['Smart homes and buildings: lights, security and energy monitoring', 'Machine and environment monitoring in factories', 'Smart farming: soil, water and weather sensing', 'Gas, fire and intrusion alerts by SMS or call'] },
  };
  w.COURSE_INFO = COURSE_INFO;
  var PLACEMENT = {
    points: [
      ['📄', 'Resume & portfolio', 'Build an ATS-friendly resume and a lab portfolio with mentor reviews.'],
      ['🎤', 'Mock interviews', 'Practise technical and HR interviews with feedback.'],
      ['🏢', 'Placement drives', 'Get access to our hiring partners and campus placement drives.'],
      ['🧑‍💻', 'Internships', 'Typically 3 months, most with a stipend, unlocked as you complete modules.'],
      ['🤝', 'Alumni & referrals', 'Join the alumni network for referrals and job leads.'],
      ['🏆', 'Hackathons', '50+ hackathons a year to build projects and get noticed.'],
    ],
    stats: [['100%', 'Placement assistance'], ['10,000+', 'Placements a year'], ['10,000+', 'Internships a semester'], ['35%', 'Placement conversion']],
    note: '100% placement assistance means every learner gets full placement support. Final selection is made by the hiring company after its interview.',
  };
  w.PLACEMENT = PLACEMENT;

  function chips(a, cls) { return '<div class="cx-chips' + (cls ? ' ' + cls : '') + '">' + a.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div>'; }
  function salFor(c, role) {
    var r = (c.sal || []).filter(function (x) { return x[0].toLowerCase() == String(role).toLowerCase(); })[0];
    return r ? '₹' + r[1] + '–' + r[2] + ' LPA' : '';
  }
  function freshRange(c) {
    var r = (c.sal || []).filter(function (x) { return !/yrs|experience/i.test(x[0]); });
    if (!r.length) return '';
    return '₹' + Math.min.apply(0, r.map(function (x) { return x[1]; })) + '–' + Math.max.apply(0, r.map(function (x) { return x[2]; })) + ' LPA';
  }
  function sec(id, icon, title, sub, body) {
    return '<div class="cx-sec" id="cx-' + id + '"><h3>' + icon + ' ' + title + '</h3>' + (sub ? '<p class="cx-sub">' + sub + '</p>' : '') + body + '</div>';
  }
  function courseLeft(c) {
    var I = COURSE_INFO[c.i] || { tech: c.k || [], why: '', apps: [] }, D = sylData(c), st = sylStats(c, D), jr = c.jr || [], fr = freshRange(c);
    var topics = D.filter(function (m) { return !m.cap; }).map(function (m) { return m.t; });
    var caps = w.capSectionHtml ? w.capSectionHtml(c) : '';
    var nav = [['overview', 'Overview'], ['learn', 'Learn'], ['syl', 'Syllabus']].concat(caps ? [['capstones', 'Capstones']] : [], [['industry', 'Industry'], ['outcomes', 'Outcomes'], ['careers', 'Careers'], ['placement', 'Placement']]);
    // overview: short description, the business side the course covers, main topics, practical outcomes
    var O = (w.COURSE_OVERVIEW || {})[c.i] || {}, intro = O.intro || c.s, biz = O.biz || I.why;
    return w.demo(c) +
      '<div class="cx-nav" role="navigation" aria-label="Course sections">' + nav.map(function (x) { return '<a onclick="cxGo(\'' + x[0] + '\')">' + x[1] + '</a>'; }).join('') + '</div>' +
      sec('overview', '📘', 'Course Overview', '',
        '<p class="cx-intro">' + esc(intro) + '</p>' +
        (biz ? '<div class="cx-biz"><b class="cx-h">💼 How it is used in business</b><p>' + esc(biz) + '</p></div>' : '') +
        '<div class="cx-2"><div class="cx-box"><b class="cx-h">Main topics</b><ul class="ck">' + w.li(topics.slice(0, 6).map(esc)) + (topics.length > 6 ? '<li class="meta">+ ' + (topics.length - 6) + ' more in the syllabus</li>' : '') + '</ul></div>' +
        '<div class="cx-box"><b class="cx-h">You will be able to</b><ul class="ck">' + w.li((c.o || []).slice(0, 3).map(esc)) + '</ul></div></div>' +
        '<p class="cx-feeline">💰 Course fee <b>' + w.fee(c.f) + '</b> incl. GST · ⏱ ' + c.h + ' hours · ' + (c.soon ? '🔜 Coming soon' : '✅ Open for enrollment') + '</p>') +
      sec('learn', '🎯', 'What You’ll Learn', 'The skills, technologies and topics this course covers.',
        '<ul class="ck">' + w.li(c.l) + '</ul>' +
        '<div class="cx-grid3"><div><b class="cx-h">Skills</b>' + chips(c.k || []) +
        '<b class="cx-h" style="margin-top:14px">Technologies & tools</b>' + chips(I.tech, 'tech') + '</div>' +
        '<div><b class="cx-h">Topics covered</b><ol class="cx-topics">' + topics.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol></div></div>') +
      sylHtml(c) + caps +
      (I.why ? sec('industry', '🏭', 'Industry Relevance', '',
        '<p class="cx-why">' + esc(I.why) + '</p>' +
        '<div class="cx-2"><div class="cx-box"><b class="cx-h">Real-world applications</b><ul class="ck">' + w.li(I.apps.map(esc)) + '</ul></div>' +
        '<div class="cx-box"><b class="cx-h">Industries that hire</b>' + chips(c.ind || []) + '</div></div>') : '') +
      sec('outcomes', '✅', 'Learning Outcomes', 'Practical, industry-ready skills you will have when you finish.',
        '<div class="cx-out">' + (c.o || []).map(function (x, k) { return '<div><span>' + (k + 1) + '</span>' + esc(x) + '</div>'; }).join('') + '</div>') +
      (jr.length ? sec('careers', '💼', 'Career Opportunities', 'Job roles this course prepares you for' + (fr ? ' · typical fresher pay ' + fr : '') + '.',
        '<div class="cx-roles">' + jr.map(function (r) { var sl = salFor(c, r); return '<div><b>' + esc(r) + '</b>' + (sl ? '<small>Fresher: ' + sl + '</small>' : '<small>Entry level</small>') + '</div>'; }).join('') + '</div>' +
        '<p class="cx-note">Approximate fresher ranges (CTC) from public salary data. Actual pay depends on the company, city and your skills.</p>') : '') +
      sec('placement', '🚀', 'Internship & 100% Placement Assistance', '',
        '<div class="cx-stats">' + PLACEMENT.stats.map(function (x) { return '<div><b>' + x[0] + '</b><span>' + x[1] + '</span></div>'; }).join('') + '</div>' +
        '<div class="cx-pts">' + PLACEMENT.points.map(function (x) { return '<div><i>' + x[0] + '</i><b>' + esc(x[1]) + '</b><span>' + esc(x[2]) + '</span></div>'; }).join('') + '</div>' +
        '<p class="cx-note">' + esc(PLACEMENT.note) + '</p><a class="btn o" onclick="nav(\'internship\')">View internship & placement details →</a>');
  }
  w.cxGo = function (id) { var e = $(id == 'syl' ? 'syl' : 'cx-' + id); if (e) e.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  // course page: rebuild the left column with all sections; syllabus link, progress and internship card in the right column
  function addToCourse(h, i) {
    var c = w.cf(i);
    if (!c || (c.hid && !enrolled(i))) return h;
    var D = sylData(c), s = sylStats(c, D);
    var a = h.indexOf('<div class="two"><div>'), b = h.indexOf('</div><div><div class="card">');
    if (a < 0 || b < 0) return h;
    h = h.slice(0, a) + '<div class="two"><div class="cx-left">' + courseLeft(c) + h.slice(b);
    if (enrolled(i)) {
      h = h.replace(/<div class="stat"([^>]*)>Enroll now<\/div><div class="meta">Admissions open · /, '<div class="stat"$1>✅ You’re enrolled</div><div class="meta">' )
        .replace(/<div style="margin-top:10px;padding:14px;border:1px solid var\(--ln2\)[^]*?<\/div><\/div><p class="meta"[^>]*>1 Sign in[^<]*<\/p>/, '');
    }
    var link = '<div class="syl-link" onclick="sylGo()">📄 Review the syllabus · ' + s.mods + ' modules, ' + s.lessons + ' lessons</div>';
    if (c.soon && !enrolled(i)) h = h.replace('<label>Get notified</label>', function (x) { return link + x; });
    else h = h.replace(/(<button class="btn pb"[^>]*onclick="enroll\()/, function (x) { return (w.progCard ? w.progCard(i) : '') + link + x; });
    var ip = '<div class="card ip-card"><b>🚀 Internship & placement</b><p class="meta" style="margin:6px 0 8px"><b>100% placement assistance</b>. Reach 50% course progress to unlock internships' +
      ((c.jr || []).length ? ' such as <b>' + c.jr.slice(0, 2).map(esc).join('</b> and <b>') + '</b>' : '') + '.</p><a class="lk" onclick="nav(\'internship\')">View internship details →</a></div>';
    return h.replace(/<\/div><\/div>$/, function () { return ip + '</div></div>'; });
  }
  var _cvHtml = w.cvHtml, _soonHtml = w.soonHtml;
  w.cvHtml = function (i) { return addToCourse(_cvHtml(i), i); };
  w.soonHtml = function (c) { return addToCourse(_soonHtml(c), c.i); };

  // mark the syllabus as reviewed once it has been on screen
  function watchSyllabus() {
    var s = $('syl');
    if (!s || !w.IntersectionObserver) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting && e.intersectionRatio > 0.3) { sylMark(w.CVI); io.disconnect(); } });
    }, { threshold: [0.3] });
    io.observe(s);
  }
  // a module the person opens themselves (click or keyboard) counts as reviewed; the first module is open on render, so 'toggle' can't be used
  d.addEventListener('click', function (e) {
    var sm = e.target.closest && e.target.closest('.syl > .syl-mods > .syl-m > summary');
    if (sm) sylMark(+sm.parentNode.dataset.i);
  }, true);

  // Before enrolling: show the syllabus for review (once per course per visit)
  function sylGate(i) {
    var c = w.cf(i), D = sylData(c);
    w.cl_();
    $('mb').innerHTML = '<div class="syl-gate"><span class="pill">STEP 1 OF 3 · REVIEW SYLLABUS</span><h2 style="margin-top:12px">' + esc(c.t) + '</h2>' +
      '<p class="sub" style="margin:0 0 6px">Please review what you will learn before you enroll.</p>' + sylSummary(c, D) + sylModsHtml(c, D, true) +
      '<div class="syl-go"><button class="btn pb" style="background:var(--br2)" onclick="sylContinue(' + i + ')"><span class="syl-lg">I’ve reviewed the syllabus · </span>Continue to enroll →</button>' +
      '<button class="syl-btn" type="button" onclick="sylPrint(' + i + ')">⬇ Download</button><span class="meta" style="font-size:12.5px">Next: 2 Sign in / Sign up → 3 Pay</span></div></div>';
    $('mo').classList.add('on');
  }
  w.sylContinue = function (i) { sylMark(i); w.cl_(); w.enroll(i); };
  var _enroll = w.enroll;
  w.enroll = function (i) {
    var c = w.cf(i);
    if (c && !c.hid && !c.soon && !enrolled(i) && !sylSeen(i)) return sylGate(i);
    return _enroll(i);
  };

  /* =====================================================================
   *  2. INTERNSHIP PAGE
   * ===================================================================== */
  function internRoles() {
    return w.JOBS.map(function (j, i) { return [j, i]; }).filter(function (x) { return w.jobOn(x[1]) && /intern|trainee/i.test(x[0][0] + ' ' + x[0][1]); });
  }
  function moduleUnlocks() { // what each progress milestone unlocks (learner-journey.js)
    var S = w.STAGE;
    if (S) return '<h2>What each milestone unlocks</h2><p class="sub">Your course progress in My Learning unlocks each career step.</p><div style="overflow-x:auto"><table class="ip-tbl"><tr><th>Progress</th><th>Unlocks</th></tr>' +
      [[S.resume, '📄 Resume builder, filled in from the resume you uploaded'], [S.intern, '🧑‍💻 Internship opportunities'], [S.career, '💼 Career opportunities (full-time roles)'],
        [S.prep, '🎯 Placement preparation: checklist, interview questions, mock interviews'], [S.cert, '🎓 Course completion certificate']]
        .map(function (r) { return '<tr><td><b>' + r[0] + '%</b></td><td>' + r[1] + '</td></tr>'; }).join('') + '</table></div>';
    if (!w.JR || !w.MD) return '';
    var rows = w.MD.map(function (m, n) {
      var ids = (w.JR[n + 1] || []).filter(w.jobOn);
      return ids.length ? '<tr><td><b>Module ' + (n + 1) + '</b><br><span class="meta">' + esc(m.t) + '</span></td><td>' + ids.map(function (id) { return esc(w.JOBS[id][0]) + ' <span class="meta">· ' + esc(w.JOBS[id][1]) + '</span>'; }).join('<br>') + '</td></tr>' : '';
    }).join('');
    return rows ? '<h2>What each module unlocks</h2><p class="sub">IT Network System Administrator: complete a module and pass its MCQ test to become eligible for these roles.</p><div style="overflow-x:auto"><table class="ip-tbl"><tr><th>Complete</th><th>Eligible for</th></tr>' + rows + '</table></div>' : '';
  }
  function myStatus() {
    if (!w.US) return '<div class="card ip-status"><b>Check your eligibility</b><p class="meta" style="margin:6px 0 10px">Log in and enroll in a course to see the internships you are eligible for.</p><button class="btn" onclick="openLogin()">Log in</button></div>';
    if (w.isEn() && w.ipStatusHtml) return w.ipStatusHtml();
    if (!w.isEn()) return '<div class="card ip-status"><b>You are not enrolled yet</b><p class="meta" style="margin:6px 0 10px">Enroll in a course and complete its modules to unlock internships.</p><a class="btn" onclick="nav(\'courses\')">Browse courses →</a></div>';
    var ids = w.hEligIds() || [];
    return '<div class="card ip-status"><b>Your internship status</b>' + w.hProg() +
      (ids.length ? '<p style="margin:10px 0 6px">🎉 You are eligible for:</p><ul class="ck">' + ids.map(function (i) { return '<li><b>' + esc(w.JOBS[i][0]) + '</b> <span class="meta">· ' + esc(w.JOBS[i][1]) + '</span></li>'; }).join('') + '</ul><a class="btn pb" onclick="nav(\'next\')">Apply in Career →</a>'
        : '<p class="meta" style="margin:8px 0 10px">Reach 50% course progress to unlock internship opportunities.</p><a class="btn" onclick="nav(\'learn\')">Continue learning →</a>') + '</div>';
  }
  function internHtml() {
    var I = INTERN, roles = internRoles(), V = w.cxVis();
    return '<div class="w">' +
      '<div class="ip-hero"><span class="gb">Internships</span><h1>' + esc(I.title) + '</h1><p>' + esc(I.overview) + '</p>' +
      '<div class="ip-cta"><a class="btn pb" style="background:var(--br);color:#0a1224" onclick="nav(\'courses\')">Start with a course →</a>' +
      '<a class="btn ip-ghost" onclick="ipAsk()">Ask the AI assistant</a></div></div>' +
      '<div class="ip-facts">' + I.facts.map(function (f) { return '<div class="ip-fact"><b>' + esc(f[0]) + '</b><span>' + esc(f[1]) + '</span></div>'; }).join('') + '</div>' +
      '<div style="margin-top:16px">' + myStatus() + '</div>' +
      '<h2>How it works</h2><ol class="ip-steps">' + I.steps.map(function (s) { return '<li><b>' + esc(s[0]) + '</b>' + esc(s[1]) + '</li>'; }).join('') + '</ol>' +
      '<h2>100% Placement Assistance</h2><p class="sub">Every learner gets full placement support, from internship to first job.</p>' +
      '<div class="cx-stats">' + w.PLACEMENT.stats.map(function (x) { return '<div><b>' + x[0] + '</b><span>' + x[1] + '</span></div>'; }).join('') + '</div>' +
      '<div class="cx-pts">' + w.PLACEMENT.points.map(function (x) { return '<div><i>' + x[0] + '</i><b>' + esc(x[1]) + '</b><span>' + esc(x[2]) + '</span></div>'; }).join('') + '</div>' +
      '<p class="ip-note">' + esc(w.PLACEMENT.note) + '</p>' +
      (roles.length ? '<h2>Open internship roles</h2><div class="grid g3">' + roles.map(function (x) { return '<div class="card ip-role"><span class="pill">' + esc(x[0][1]) + '</span><b>' + esc(x[0][0]) + '</b><span class="meta">' + esc(x[0][2] || '') + '</span></div>'; }).join('') + '</div><p class="ip-note">Apply from <b>Career → Internships & jobs</b> after enrolling.</p>' : '') +
      '<h2>Internship tracks by course</h2><div style="overflow-x:auto"><table class="ip-tbl ip-tracks"><tr><th>Course</th><th>Roles you can aim for</th><th>Prerequisites</th></tr>' +
      V.map(function (c) { return '<tr><td><a class="lk" onclick="show(' + c.i + ')">' + c.e + ' ' + esc(c.t) + '</a>' + (c.soon ? ' <span class="meta">(coming soon)</span>' : '') + '</td><td>' + (c.jr || []).slice(0, 3).map(esc).join(', ') + '</td><td class="meta">' + (c.pre || []).map(esc).join('; ') + '</td></tr>'; }).join('') + '</table></div>' +
      moduleUnlocks() +
      '<h2>What you gain</h2><ul class="ck">' + I.gain.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
      '<h2>Tips to get selected</h2><ul class="ck">' + I.tips.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
      '<h2>Frequently asked questions</h2><div class="ip-faq">' + I.faq.map(function (f) { return '<details><summary>' + esc(f[0]) + '</summary><p>' + esc(f[1]) + '</p></details>'; }).join('') + '</div>' +
      '<div class="card" style="margin-top:26px;text-align:center"><b style="font-size:19px">Questions about internships?</b><p class="meta" style="margin:6px 0 12px">📞 <a href="tel:+919941656492">+91 99416 56492</a> · ✉️ <a href="mailto:sriharsha@myingage.com">sriharsha@myingage.com</a> · <a href="https://wa.me/919941656492" target="_blank" rel="noopener">WhatsApp</a></p>' +
      '<a class="btn pb" onclick="ipAsk()">Ask the AI assistant →</a></div></div>';
  }
  w.renderIntern = function () { var s = $('internship'); if (s) s.innerHTML = internHtml(); };
  w.ipAsk = function () {
    if (!$('cbp').classList.contains('open')) w.cbT();
    setTimeout(function () { w.hTopic('intern'); }, 60);
  };
  function mountIntern() {
    if ($('internship')) return;
    var sec = d.createElement('section'); sec.className = 'v'; sec.id = 'internship';
    var after = $('courses') || d.querySelector('section.v:last-of-type');
    after.parentNode.insertBefore(sec, after.nextSibling);
    var nav = d.querySelector('nav[aria-label="Main"]'), a = d.createElement('a');
    a.href = '#internship'; a.dataset.v = 'internship'; a.textContent = 'Internships';
    var ref = nav && nav.querySelector('a[data-v="home"]');
    if (nav) nav.insertBefore(a, ref || null);
    var foot = d.querySelector('footer .w span');
    if (foot) foot.insertAdjacentHTML('beforeend', ' · <a href="#internship">Internships</a>');
  }
  // chatbot internship answer links to the page
  var _hAns = w.hAns;
  w.hAns = function (k) {
    var r = _hAns(k);
    return k == 'intern' && typeof r == 'string' ? r + '<br><a class="lk" onclick="ipOpen()">📄 View full internship details →</a>' : r;
  };
  w.ipOpen = function () { closeChatOnPhone(); w.nav('internship'); };

  /* =====================================================================
   *  3. FLOATING CHATBOT – on every page, reachable from anywhere
   * ===================================================================== */
  var fab = d.querySelector('.ai-fab');
  if (fab) {
    fab.insertAdjacentHTML('beforeend', '<i class="ai-ndot" aria-hidden="true"></i>');
    fab.setAttribute('title', 'Ask Ingage AI');
  }
  function chatOpen() { return $('cbp').classList.contains('open'); }
  // dialogs (login, checkout, syllabus review) → compact chat button that stays on top
  function syncOverlay() { d.body.classList.toggle('has-ov', !!d.querySelector('.ov.on')); }
  if (w.MutationObserver) d.querySelectorAll('.ov').forEach(function (o) { new MutationObserver(syncOverlay).observe(o, { attributes: true, attributeFilter: ['class'] }); });
  // one-time greeting bubble
  function teaser() {
    var k = 'sf_ai_tz';
    try { if (sessionStorage.getItem(k)) return; sessionStorage.setItem(k, '1'); } catch (e) {}
    if (chatOpen() || !d.querySelector('.aiw')) return;
    var t = d.createElement('div'); t.className = 'ai-teaser'; t.setAttribute('role', 'status');
    t.innerHTML = '<b>👋 Need help?</b>Ask me about courses, fees, the syllabus or internships.<button type="button" aria-label="Dismiss">×</button>';
    t.onclick = function (e) { t.remove(); if (e.target.tagName != 'BUTTON') w.cbT(); };
    d.querySelector('.aiw').appendChild(t);
    d.body.classList.add('ai-unseen');
    setTimeout(function () { if (t.parentNode) t.remove(); }, 15000);
  }
  w.AITEASER_MS = w.AITEASER_MS || 6000;
  setTimeout(teaser, w.AITEASER_MS);

  var _cbT = w.cbT;
  w.cbT = function () {
    _cbT();
    d.body.classList.remove('ai-unseen');
    var tz = d.querySelector('.ai-teaser'); if (tz) tz.remove();
    if (chatOpen() && location.hash == '#internship' && w.AIM == 'pre') {
      w.cbQ([['Am I eligible for an internship?', "cbS('Am I eligible for an internship?')", 'ucheck'], [w.hT().lb.intern, "hTopic('intern')", 'brief'], ['Is the internship paid?', "cbS('Is the internship paid?')", 'coins']]);
    }
  };

  /* ---------- routing ---------- */
  var _route = w.route;
  w.route = function () {
    _route();
    var h = location.hash.slice(1);
    if (h == 'internship') w.renderIntern();
    if (h == 'course') setTimeout(watchSyllabus, 0);
    if (chatOpen()) { try { w.aiTop(); } catch (e) {} } // keep the chat open and update its context when the page changes
  };
  w.removeEventListener('hashchange', _route);
  w.addEventListener('hashchange', w.route);

  mountIntern();
  if (location.hash == '#internship' || location.hash == '#course') w.route();
})(window, document);

/* ingage EduTech – role-to-skills map used by the chatbot for career answers.
 * STATUS: DRAFT – written from the course pages (skills, modules, outcomes). ingage must review and sign off
 * every role before relying on it. Keep "covers" to what the course really teaches; put everything else in "gaps".
 * course: course id in C (index.html). timing: honest ranges, never promises.
 */
(function (w) {
  'use strict';
  var NETWORK_COMMON_GAPS = 'Hands-on time on physical vendor equipment; an industry certification (for example a CCNA-level exam) that many employers ask for; ticketing tools and written communication for support work.';
  w.ROLE_MAP = {
    status: 'draft',
    roles: [
      { role: 'Network Support Engineer', course: 1,
        needs: ['IP addressing and subnetting', 'Switching and VLANs', 'Routing basics', 'DHCP and DNS', 'Structured troubleshooting', 'Windows and Linux basics', 'Clear communication with users'],
        covers: ['IP addressing and subnetting (Module 1)', 'Switches, VLANs and routing in Packet Tracer and GNS3 (Modules 2-3)', 'DNS, DHCP, HTTP, FTP (Module 5)', 'Traffic analysis with Wireshark (Module 4)', 'Windows Server and Ubuntu basics (Modules 6, 10)'],
        gaps: NETWORK_COMMON_GAPS,
        next: ['Finish all 10 modules and the MCQ tests', 'Complete the capstone network project for your portfolio', 'Practise subnetting and troubleshooting labs weekly', 'Consider a recognised networking certification', 'Apply for L1 support roles and internships through Career'],
        timing: 'The course is 60 hours: about 6-8 weeks at 8-10 hours a week, or 12-15 weeks at 4-5 hours a week. Job readiness after that depends on practice, certification and the job market; there is no fixed timeline.' },
      { role: 'Junior Network Administrator', course: 1,
        needs: ['Network design for small offices', 'IP planning', 'VPN and remote access', 'Firewalls and backups', 'Active Directory and Group Policy', 'Documentation'],
        covers: ['Planning IP addressing and subnets', 'VPN and remote access (Module 9)', 'Active Directory, Group Policy and OUs (Modules 7-8)', 'Running a small-office network end to end (capstone)'],
        gaps: 'Real production change management, enterprise firewalls and monitoring at scale; on-call experience. ' + NETWORK_COMMON_GAPS,
        next: ['Finish the course and capstone', 'Document your capstone network like a real handover', 'Build a home lab and keep notes', 'Start in an L1 support or NOC role to gain production experience'],
        timing: 'Most people reach junior administrator roles after some time in an L1 support or NOC role. The course is a first step, not the whole path.' },
      { role: 'NOC Engineer (L1)', course: 1,
        needs: ['Reading alerts and logs', 'Basic routing and switching', 'Wireshark and traffic analysis', 'Following escalation procedures', 'Shift work and clear handover notes'],
        covers: ['Routing and switching labs (Modules 2-3)', 'Wireshark traffic analysis (Module 4)', 'Network services troubleshooting (Module 5)'],
        gaps: 'Network monitoring tools used in NOCs are not taught in the course; working in shifts and escalation processes are learned on the job. ' + NETWORK_COMMON_GAPS,
        next: ['Finish the course and capstone', 'Learn one free network monitoring tool on your own', 'Practise reading logs and writing short incident notes'],
        timing: 'After the 60-hour course, add a few weeks of self-practice on monitoring tools before applying. Hiring time varies.' },
      { role: 'System Administrator (L1)', course: 1,
        needs: ['Windows Server administration', 'Active Directory, users and groups', 'Group Policy', 'Linux basics', 'Virtual machines', 'Backups', 'Scripting'],
        covers: ['Windows Server and virtualization (Module 6)', 'Active Directory and virtual networking (Module 7)', 'Group Policy and OUs (Module 8)', 'Ubuntu and Linux basics (Module 10)', 'VirtualBox virtual machines'],
        gaps: 'Scripting (PowerShell or Bash) and cloud basics are not covered; deeper Linux administration needs extra practice.',
        next: ['Finish the course and capstone', 'Learn basic PowerShell and Bash scripting', 'Practise Linux administration in a VM'],
        timing: 'The course plus a few weeks of scripting practice gives a foundation for L1 roles. Timelines vary by person and market.' },
      { role: 'IT Help Desk Engineer', course: 1,
        needs: ['OS and network basics', 'User and account management', 'Troubleshooting', 'Customer communication', 'Ticketing'],
        covers: ['Network and OS fundamentals', 'User accounts in Active Directory', 'Troubleshooting network faults'],
        gaps: 'Customer-service skills, ticketing tools and PC hardware troubleshooting are not part of the course.',
        next: ['Finish the course', 'Practise explaining fixes in simple words', 'Apply for help desk roles and internships through Career'],
        timing: 'Help desk is often the quickest entry role after the course, but no timeline is guaranteed.' },
      // Courses that are not open yet: map exists so the bot can answer honestly, but it must not recommend them.
      { role: 'SOC Analyst (L1)', course: 6,
        needs: ['Networking basics', 'Threats and attack types', 'Reading security logs', 'SIEM and IDS/IPS basics', 'Incident triage and reporting'],
        covers: ['Threats, phishing and threat intelligence (Module 1)', 'Networks, firewalls and VPNs (Modules 3-4)', 'SIEM, IDS/IPS and traffic analysis (Module 6)', 'Vulnerability scanning (Module 8)', 'Digital forensics and incident response (Modules 9-10)'],
        gaps: 'Hands-on time with a commercial SIEM, on-call SOC shift work and an entry-level security certification that many employers ask for are not part of the course.',
        next: ['Finish all 10 modules and the MCQ tests', 'Complete the incident response or mini-SOC capstone', 'Practise log analysis on free labs', 'Consider an entry-level security certification', 'Apply for SOC internships through Career'],
        timing: 'The course is 60 hours: about 7-8 weeks at 8 hours a week. Most people add a few months of practice before L1 SOC roles; hiring time varies.' },
      { role: 'Vulnerability Assessment Analyst', course: 6,
        needs: ['Port scanning', 'OWASP Top 10', 'Risk prioritisation', 'Report writing'],
        covers: ['Vulnerabilities, OWASP Top 10 and Nmap (Module 8)', 'Cryptography and hashing (Module 7)', 'Firewalls and access control (Module 4)'],
        gaps: 'Web application testing tools in depth and authorised penetration-testing experience are not covered.',
        next: ['Finish the course and the vulnerability assessment capstone', 'Practise only on legal training labs', 'Learn one web testing tool on your own'],
        timing: 'After the 60-hour course, plan a few months of lab practice before applying. There is no fixed timeline.' },
      { role: 'Flutter Developer', course: 7,
        needs: ['Dart programming', 'Flutter widgets and layouts', 'State management (setState, Provider)', 'Navigation', 'REST APIs and JSON', 'Error handling and offline storage', 'Git and publishing basics'],
        covers: ['Flutter setup and first app (Module 1)', 'Widgets and layouts (Module 2)', 'Dart and async (Module 3)', 'setState and Provider (Module 4)', 'Navigation and deep linking (Module 5)', 'APIs, error handling and offline storage (Modules 6, 9-10)', 'Theming, animations, sensors, camera and location (Modules 7-8)'],
        gaps: 'Publishing to the Play Store and App Store, automated testing, Git workflows and other state-management libraries (Bloc, Riverpod) are not covered in depth. Employers also look for 2-3 finished apps in a portfolio.',
        next: ['Finish all 10 modules and the MCQ tests', 'Build 2-3 small apps of your own (one using a public API) and put them on GitHub', 'Learn to publish a test build to a phone', 'Apply for Flutter internships and junior roles through Career'],
        timing: 'The course is 40 hours: about 5-6 weeks at 8 hours a week. Building a portfolio usually takes a few more weeks after that; hiring time varies.' },
      { role: 'Mobile App Developer', course: 7,
        needs: ['One cross-platform or native framework', 'UI building', 'APIs and data', 'Device features (camera, location)', 'Debugging'],
        covers: ['Cross-platform apps with Flutter and Dart (Modules 1-5)', 'APIs, JSON and offline storage (Modules 6, 9-10)', 'Camera, location and sensors (Module 8)'],
        gaps: 'Native Android (Kotlin) and iOS (Swift) development are not taught; app store release and testing are covered only lightly.',
        next: ['Finish the course', 'Build and share portfolio apps', 'Learn the basics of publishing an app'],
        timing: 'After the 40-hour course, plan a few weeks of portfolio work before applying. There is no fixed timeline.' },
      { role: 'EV Service Technician', course: 8,
        needs: ['EV types and how they work', 'Motors, inverters and controllers', 'Battery basics and safety', 'Charging equipment', 'Electrical safety and diagnostics'],
        covers: ['EV types, motors, power electronics and batteries (Module 1)', 'Powertrain: motors, inverters, controllers (Module 3)', 'Charging basics and standards (Modules 2, 4)', 'BMS, battery safety and thermal management (Modules 5-6)'],
        gaps: 'Hands-on work on real vehicles, high-voltage safety certification and brand-specific diagnostic tools are not covered; they are learned at service centres.',
        next: ['Finish all 6 modules and the MCQ tests', 'Complete a capstone project', 'Look for apprenticeships or internships at EV service centres', 'Get a high-voltage safety training certificate'],
        timing: 'The course is 40 hours: about 5-6 weeks at 8 hours a week. Workshop experience after that varies; there is no fixed timeline.' },
      { role: 'BMS Technician', course: 8,
        needs: ['SOC and SOH', 'Cell balancing', 'Thermal management', 'BMS hardware and CAN communication', 'Battery safety'],
        covers: ['BMS fundamentals, SOC and SOH (Module 5)', 'BMS hardware, safety and integration (Module 5)', 'Thermal management, balancing and communication (Module 6)'],
        gaps: 'Embedded programming of BMS firmware and lab testing with real cell testers are not covered in depth.',
        next: ['Finish the course and the BMS capstone', 'Learn basic embedded C and CAN tools', 'Apply to battery and BMS companies for internships'],
        timing: 'After the 40-hour course, a few months of hands-on lab or internship work is usual before technician roles. Hiring time varies.' },
      { role: 'AR/VR Developer', course: 4, notOpen: true, needs: ['C# and Unity', '3D scenes', 'XR interaction'], covers: ['Course not open yet.'], gaps: 'No open ingage course covers XR development right now.', next: ['Talk to a counsellor'], timing: 'No estimate until the course opens.' },
      { role: 'Unity Developer', course: 4, notOpen: true, needs: ['C# programming', 'Unity engine', 'Physics and UI'], covers: ['Course not open yet.'], gaps: 'No open ingage course covers Unity right now.', next: ['Talk to a counsellor'], timing: 'No estimate until the course opens.' },
      { role: 'Digital Twin Engineer', course: 5,
        needs: ['IoT and sensors', 'Microcontrollers (ESP32)', 'Cloud data platforms', '3D modelling', 'Unity and AR/VR', 'Data processing'],
        covers: ['Digital twin concepts (Module 1)', 'ESP32, Wokwi, sensors and motors (Modules 2-3)', 'IoT and ThingSpeak (Module 4)', 'Blender 3D modelling (Module 5)', 'AR/VR and Unity, including live ThingSpeak data (Modules 6-8)', 'Real-time data and AI/ML (Module 11)'],
        gaps: 'Industrial platforms (for example PLCs and industrial IoT suites), physics-based simulation tools and real factory data are not covered; many Digital Twin Engineer roles also ask for a few years of engineering experience.',
        next: ['Finish all 11 modules and the MCQ tests', 'Complete a capstone such as the smart room or machine health twin', 'Build a portfolio video of your twin working', 'Start with IoT or AR/VR developer internships'],
        timing: 'The course is 40 hours: about 5-6 weeks at 8 hours a week. Digital twin roles usually come after some IoT or 3D development experience; there is no fixed timeline.' },
      { role: 'IoT Solutions Engineer', course: 5,
        needs: ['Microcontrollers and sensors', 'Wi-Fi and IoT protocols', 'Cloud IoT platforms', 'Dashboards and alerts'],
        covers: ['ESP32 and Wokwi (Module 2)', 'Sensors and motors (Module 3)', 'IoT and ThingSpeak (Module 4)', 'Real-time streaming (Module 11)'],
        gaps: 'Hands-on work with real hardware, PCB design and IoT security in depth are not covered.',
        next: ['Finish the course', 'Build one project on a real ESP32 board', 'Apply for IoT internships through Career'],
        timing: 'After the 40-hour course, a few weeks of hardware practice helps before applying. Hiring time varies.' },
      { role: 'GIS Analyst', course: 3, notOpen: true, needs: ['GIS tools', 'Coordinate systems', 'Terrain data'], covers: ['Course not open yet.'], gaps: 'No open ingage course covers GIS right now.', next: ['Talk to a counsellor'], timing: 'No estimate until the course opens.' },
      { role: 'LiDAR Data Technician', course: 2, notOpen: true, needs: ['LiDAR scanning', 'Point cloud processing', '3D modelling'], covers: ['Course not open yet.'], gaps: 'No open ingage course covers LiDAR right now.', next: ['Talk to a counsellor'], timing: 'No estimate until the course opens.' }
    ]
  };

  function norm(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }
  // A course added later (in code or the admin editor) with no roles written above still gets draft roles, built from
  // its own job roles, skills and modules, so the chatbot can give career answers for it. Write real entries when you can.
  function autoRoles() {
    var mapped = {}; w.ROLE_MAP.roles.forEach(function (r) { mapped[r.course] = 1; });
    var C = (w.cxVis ? w.cxVis() : w.C) || [];
    return C.filter(function (c) { return !mapped[c.i] && (c.jr || []).length; }).flatMap(function (c) {
      var mods = ((w.modsAll || w.mods) ? (w.modsAll || w.mods)(c) : []).filter(function (m) { return !/^start here/i.test(m.t) && !m.gen; })
        .map(function (m, n) { return m.t.replace(/^Module \d+:\s*/, '') + ' (Module ' + (n + 1) + ')'; });
      return c.jr.slice(0, 4).map(function (role) {
        return { role: role, course: c.i, auto: true, notOpen: !!c.soon,
          needs: (c.k || []).concat(c.l || []).slice(0, 6),
          covers: c.soon ? ['Course not open yet.'] : mods.slice(0, 8),
          gaps: 'Not reviewed yet: this draft is built from the course page. Be honest that real projects, practice and the employer’s own requirements matter beyond the course.',
          next: c.soon ? ['Talk to a counsellor'] : ['Finish all modules and the MCQ tests', 'Complete a capstone project for your portfolio', 'Apply for internships and entry roles through Career'],
          timing: c.soon ? 'No estimate until the course opens.' : 'The course is ' + c.h + ' hours. Job readiness depends on practice and the job market; there is no fixed timeline.' };
      });
    });
  }
  w.allRoles = function () { return w.ROLE_MAP.roles.concat(autoRoles()); };
  // Roles relevant to a question: named in the question, or belonging to the course in focus / enrolled courses.
  w.rolesFor = function (q, courseIds) {
    var s = ' ' + norm(q) + ' ', ids = (courseIds || []).map(Number), R = w.allRoles();
    var named = R.filter(function (r) {
      var n = norm(r.role.replace(/\(.*?\)/g, ''));
      return s.indexOf(' ' + n + ' ') > -1 || n.split(' ').filter(function (x) { return x.length > 3; }).every(function (x) { return s.indexOf(x) > -1; });
    });
    var byCourse = R.filter(function (r) { return ids.indexOf(r.course) > -1; });
    var out = named.concat(byCourse).filter(function (r, i, a) { return a.indexOf(r) == i; });
    if (!out.length && /\b(career|job|role|become|work as|placement|salary|next step|future)\b/.test(s)) out = R.filter(function (r) { return !r.notOpen; });
    return out.slice(0, 6);
  };
})(window);

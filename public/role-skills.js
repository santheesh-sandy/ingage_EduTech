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
      { role: 'SOC Analyst (L1)', course: 6, notOpen: true,
        needs: ['Networking basics', 'Threats and attack types', 'Reading security logs', 'Incident triage and reporting'],
        covers: ['Course not open yet; the open IT Network System Administrator course covers the networking basics that security roles build on.'],
        gaps: 'Security monitoring, log analysis and incident response are not covered by any open ingage course right now.',
        next: ['If networking is new to you, the open IT Network System Administrator course is a foundation', 'Talk to a counsellor about your goal'],
        timing: 'No honest estimate until the security course opens.' },
      { role: 'AR/VR Developer', course: 4, notOpen: true, needs: ['C# and Unity', '3D scenes', 'XR interaction'], covers: ['Course not open yet.'], gaps: 'No open ingage course covers XR development right now.', next: ['Talk to a counsellor'], timing: 'No estimate until the course opens.' },
      { role: 'Unity Developer', course: 4, notOpen: true, needs: ['C# programming', 'Unity engine', 'Physics and UI'], covers: ['Course not open yet.'], gaps: 'No open ingage course covers Unity right now.', next: ['Talk to a counsellor'], timing: 'No estimate until the course opens.' },
      { role: 'Digital Twin Engineer', course: 5, notOpen: true, needs: ['IoT and sensors', '3D modelling', 'Dashboards', 'Simulation'], covers: ['Course not open yet.'], gaps: 'No open ingage course covers digital twins right now.', next: ['Talk to a counsellor'], timing: 'No estimate until the course opens.' },
      { role: 'GIS Analyst', course: 3, notOpen: true, needs: ['GIS tools', 'Coordinate systems', 'Terrain data'], covers: ['Course not open yet.'], gaps: 'No open ingage course covers GIS right now.', next: ['Talk to a counsellor'], timing: 'No estimate until the course opens.' },
      { role: 'LiDAR Data Technician', course: 2, notOpen: true, needs: ['LiDAR scanning', 'Point cloud processing', '3D modelling'], covers: ['Course not open yet.'], gaps: 'No open ingage course covers LiDAR right now.', next: ['Talk to a counsellor'], timing: 'No estimate until the course opens.' }
    ]
  };

  function norm(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }
  // Roles relevant to a question: named in the question, or belonging to the course in focus / enrolled courses.
  w.rolesFor = function (q, courseIds) {
    var s = ' ' + norm(q) + ' ', ids = (courseIds || []).map(Number), R = w.ROLE_MAP.roles;
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

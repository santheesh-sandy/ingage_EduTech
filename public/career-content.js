/* ingage EduTech – career content for every course
 *   CJOBS   internships and full-time roles shown in Career → Internships & jobs (and the milestone recommendations).
 *           Each course gets its own listings; a title already on the job board is reused (not duplicated).
 *           A course whose job list was set in Admin → Courses keeps that list.
 *   CPATH   career path chips and "next learning" shown under the job listings
 *   RSD     resume builder suggestions: professional summary and skills (projects come from the course capstones)
 *   PREP_Q  common interview questions with what to cover, shown in Placement preparation
 * Course 1 (IT Network System Administrator) keeps the original job board listings and RDEF resume text in index.html.
 * Add an entry for each new course. Loaded right after the main script, before role-skills.js.
 * Listing types: put "Internship" (or "Trainee") in the type for internships – they unlock at 50%; other roles at 60%.
 */
(function (w) {
  'use strict';
  var CJOBS = {
    2: [
      ['PCB Design Intern', 'Internship · 3 months · Stipend', 'Draw schematics and lay out boards in KiCad with a senior designer.'],
      ['Electronics Lab Intern', 'Internship · 3 months', 'Build and test circuits, check boards with a multimeter and log the results.'],
      ['Junior PCB Design Engineer', 'Full-time · Chennai / Bengaluru', 'Schematics, footprints, layout, DRC and Gerber files for products.'],
      ['Electronics Test Technician', 'Full-time · Manufacturing', 'Test assembled boards, find faults and record the results.'],
      ['Embedded Hardware Technician', 'Full-time · Chennai', 'Prototype Arduino-based boards and support the hardware team.']],
    3: [
      ['GIS / LiDAR Intern', 'Internship · 3 months', 'Process LiDAR point clouds and make terrain maps.'],
      ['GIS Analyst', 'Full-time · Chennai', 'Terrain models, contours and map products for projects.']],
    4: [
      ['AR/VR Developer Intern', 'Internship · 3 months · Stipend', 'Build Unity scenes and interactions with a mentor.'],
      ['Junior Unity Developer', 'Full-time · Chennai / Remote', 'AR/VR apps and 3D experiences in Unity.']],
    5: [
      ['Digital Twin Intern', 'Internship · 3 months · Stipend', 'Connect live sensor data to 3D models and dashboards.'],
      ['IoT & Simulation Intern', 'Internship · 3 months', 'Build ESP32 sensor prototypes and ThingSpeak dashboards.'],
      ['Junior Digital Twin Developer', 'Full-time · Chennai / Remote', 'Build live 3D twins in Unity with cloud sensor data.'],
      ['Industry 4.0 Support Engineer', 'Full-time · Manufacturing', 'Support plant dashboards, sensors and data pipelines.']],
    6: [
      ['SOC Analyst Intern', 'Internship · 3 months · Stipend', 'Watch security alerts, triage incidents and write short reports.'],
      ['Vulnerability Assessment Intern', 'Internship · 3 months', 'Run scans, verify findings and draft fix recommendations.'],
      ['SOC Analyst (L1)', 'Full-time · Shift based', 'Monitor SIEM alerts, investigate and escalate incidents.'],
      ['Junior Security Analyst', 'Full-time · Chennai / Remote', 'Hardening, access reviews, phishing response and reporting.'],
      ['Junior Network Security Engineer', 'Full-time · Chennai', 'Firewall rules, VPN and IDS/IPS support.']],
    7: [
      ['Flutter Developer Intern', 'Internship · 3 months · Stipend', 'Build screens and features in Flutter with a mentor.'],
      ['Mobile App Testing Intern', 'Internship · 3 months', 'Test Android and iOS builds and report bugs clearly.'],
      ['Junior Flutter Developer', 'Full-time · Chennai / Remote', 'Build and ship cross-platform apps with APIs and state management.'],
      ['Junior Android Developer', 'Full-time · Chennai', 'Android features, device APIs and Play Store releases.']],
    8: [
      ['EV Service Intern', 'Internship · 3 months · Stipend', 'Assist technicians with EV diagnostics and servicing.'],
      ['Battery & BMS Lab Intern', 'Internship · 3 months', 'Test battery packs and log BMS data.'],
      ['EV Service Technician', 'Full-time · Service centre', 'Diagnose and service electric two-wheelers and cars.'],
      ['EV Charging Station Technician', 'Full-time · Field', 'Install, test and maintain AC and DC chargers.'],
      ['Junior EV Powertrain Engineer', 'Full-time · Chennai / Bengaluru', 'Motor, inverter and controller testing and integration.']],
    9: [
      ['Robotics Intern', 'Internship · 3 months · Stipend', 'Help with robot programming, testing and cell setup.'],
      ['Automation Intern', 'Internship · 3 months', 'Support PLC, sensor and robot integration on the shop floor.'],
      ['Junior Robot Programmer', 'Full-time · Plant / Integrator', 'Teach points, write and optimise robot programs.'],
      ['Robotics Technician', 'Full-time · Shift based', 'Operate, monitor and maintain robot cells.'],
      ['Automation Technician', 'Full-time · Manufacturing', 'Support PLCs, sensors, robots and safety systems.']],
    10: [
      ['IoT Developer Intern', 'Internship · 3 months · Stipend', 'Build ESP32 sensor projects with Blynk and ThingSpeak.'],
      ['IoT Testing Intern', 'Internship · 3 months', 'Test IoT devices, dashboards and alerts.'],
      ['Junior IoT Developer', 'Full-time · Chennai / Remote', 'Device code, MQTT, cloud dashboards and companion apps.'],
      ['Embedded IoT Technician', 'Full-time · Field / Lab', 'Wire, flash, test and install IoT devices.'],
      ['Smart Home Installation Engineer', 'Full-time · Field', 'Install and configure smart home and building automation.']],
    11: [
      ['Network Cabling Intern', 'Internship · 3 months · Stipend', 'Terminate, label and test copper links on site.'],
      ['Fibre Optic Intern', 'Internship · 3 months', 'Help with fibre installation, OTDR tests and documentation.'],
      ['Network Cabling Technician', 'Full-time · Field / Travel', 'Install, terminate and certify structured cabling.'],
      ['Fibre Optic Technician', 'Full-time · Field', 'Fibre installation, testing and fault repair.'],
      ['Network Support Technician (L1)', 'Full-time · Chennai', 'First-line network connectivity and cabling support.']],
    12: [
      ['Network Engineer Intern', 'Internship · 3 months · Stipend', 'Configure switches, routers and VLANs in labs and on site.'],
      ['NOC Intern', 'Internship · 3 months · Shift based', 'Monitor links and devices, raise and track tickets.'],
      ['Junior Network Engineer', 'Full-time · Chennai / Bengaluru', 'LAN/WAN configuration, routing, VPN and firewall changes.'],
      ['NOC Engineer (L1)', 'Full-time · Shift based', 'Monitor links, raise tickets and escalate incidents.'],
      ['Network Support Engineer', 'Full-time · Chennai', 'Troubleshoot LAN/WAN issues for offices and branches.']],
  };

  var CPATH = {
    1: [['Intern', 'L1 Support', 'Network Admin', 'Network Engineer', 'Senior / Architect'], 'CCNA-style routing and switching, firewall administration, cloud networking.'],
    2: [['Intern', 'PCB Design Trainee', 'PCB Design Engineer', 'Senior Hardware Designer', 'Hardware Lead'], 'Multi-layer and high-speed design, Altium or OrCAD, design for manufacturing.'],
    3: [['Intern', 'GIS Technician', 'GIS Analyst', 'Senior GIS / LiDAR Specialist', 'GIS Manager'], 'Remote sensing, photogrammetry and GIS programming.'],
    4: [['Intern', 'Junior Unity Developer', 'AR/VR Developer', 'Senior XR Developer', 'XR Lead'], 'C# design patterns, shaders, XR interaction toolkits.'],
    5: [['Intern', 'IoT / Simulation Trainee', 'Digital Twin Developer', 'Digital Twin Engineer', 'Industry 4.0 Architect'], 'Industrial IoT platforms, PLC data, physics simulation and cloud analytics.'],
    6: [['Intern', 'SOC Analyst L1', 'SOC Analyst L2', 'Security Engineer', 'Security Architect'], 'CompTIA Security+ or CEH, cloud security, threat hunting.'],
    7: [['Intern', 'Junior Flutter Developer', 'Flutter Developer', 'Senior Mobile Developer', 'Mobile Lead'], 'App testing, CI/CD for apps, native Android/iOS basics, backend APIs.'],
    8: [['Intern', 'EV Service Technician', 'Senior Technician / BMS Engineer', 'EV Powertrain Engineer', 'EV Lead'], 'High-voltage safety certification, CAN diagnostics, embedded BMS firmware.'],
    9: [['Intern', 'Robot Technician', 'Robot Programmer', 'Automation Engineer', 'Robotics Lead'], 'Robot brand certification (FANUC, ABB, KUKA), PLC programming, machine vision.'],
    10: [['Intern', 'Junior IoT Developer', 'IoT Developer', 'IoT Solutions Engineer', 'IoT Architect'], 'IoT security, low-power design, C/C++ firmware with an RTOS, cloud IoT platforms.'],
    11: [['Intern', 'Cabling Technician', 'Senior Technician / Fibre Specialist', 'Network Engineer', 'Project Lead'], 'Fibre splicing practice, vendor cabling certification, CCNA.'],
    12: [['Intern', 'NOC / L1 Support', 'Network Engineer', 'Senior Network Engineer', 'Network Architect'], 'CCNA then CCNP, SD-WAN platforms, firewalls and cloud networking.'],
  };

  var RSD = {
    2: ['Entry-level PCB design engineer trained in electronics, circuit simulation and PCB design. Hands-on with Tinkercad, Arduino and KiCad, from schematic and footprints to routed boards and Gerber files.',
      'Basic electronics, Circuit simulation (Tinkercad), Arduino, KiCad, Schematic capture, Footprints, PCB layout and routing, ERC and DRC, BOM, Gerber files, Multimeter testing'],
    3: ['Entry-level GIS analyst trained to process airborne and ground LiDAR data into terrain models, contours and slope maps.',
      'LiDAR, Point clouds, GIS, DEM and DSM, Contours, Slope analysis, Terrain reports'],
    4: ['Entry-level AR/VR developer trained to build interactive 3D, AR and VR experiences in Unity.',
      'Unity, C#, 3D scenes, XR interaction, Mobile AR, UI for XR'],
    5: ['Entry-level digital twin developer trained in IoT sensors, cloud data and 3D visualisation. Hands-on with ESP32, Wokwi, ThingSpeak, Blender and Unity, including AR/VR views of live data.',
      'ESP32, Wokwi, Sensors and actuators, ThingSpeak, IoT, Blender, Unity, AR/VR, Real-time data, Dashboards, Data analysis'],
    6: ['Entry-level security analyst trained in network security, threat detection and incident response. Hands-on with firewalls, vulnerability scanning, SIEM concepts and digital forensics labs.',
      'Network security, Firewalls, Phishing analysis, MFA and access control, Cryptography basics, Vulnerability scanning, Wireshark, SIEM and IDS/IPS, Digital forensics, Incident response, Linux'],
    7: ['Entry-level Flutter developer trained to build Android and iOS apps from one codebase. Hands-on with Dart, widgets and layouts, state management, REST APIs, offline storage and device features.',
      'Flutter, Dart, Widgets and layouts, State management (Provider), Navigation, REST APIs, JSON, Local storage, Theming and animations, Camera and location, Git'],
    8: ['Entry-level EV technician trained in electric vehicle systems, from motors and power electronics to charging and battery management. Hands-on with Tinkercad circuit practicals.',
      'EV architecture, BLDC and PMSM motors, Power electronics, Inverters and controllers, Charging standards (AC, DC, CCS2), Charging infrastructure, BMS (SOC, SOH), Cell balancing, Thermal management, Tinkercad'],
    9: ['Entry-level robot programmer trained to program, operate and maintain industrial robots. Hands-on with teach pendant programming, coordinate frames, robot I/O, grippers and sensors, PLC integration and cell safety.',
      'Teach pendant programming, Motion commands and frames, Robot I/O and logic, Grippers and end effectors, Sensors and vision basics, Kinematics, PLC and HMI integration, Robot safety (ISO 10218), Preventive maintenance, Troubleshooting'],
    10: ['Entry-level IoT developer trained to build connected devices end to end. Hands-on with Arduino and ESP32, sensors and actuators, Blynk, ThingSpeak, MQTT, Node-RED, Firebase, Kodular apps and Twilio alerts.',
      'Arduino, ESP32, Sensors and actuators, Blynk IoT, ThingSpeak, MATLAB analysis, MQTT (HiveMQ), Node-RED, Firebase, Kodular, Twilio, Wokwi'],
    11: ['Entry-level network cabling technician trained in structured cabling, copper and fibre installation, testing and certification. Hands-on with RJ45 termination, cable testers, OTDR concepts, Packet Tracer, iPerf, Wireshark and Grafana.',
      'Structured cabling (TIA-568), RJ45 termination, Cable testing and certification, Optical fibre, OTDR, draw.io diagrams, IPv4 and IPv6, VLANs, Cisco Packet Tracer, Wi-Fi security, iPerf3, Wireshark, Grafana'],
    12: ['Entry-level network engineer trained to build, route and secure LANs and WANs. Hands-on with Cisco Packet Tracer: subnetting, VLANs, static routing and OSPF, VPN concepts and ASA firewall configuration.',
      'OSI and TCP/IP, Subnetting and VLSM, Switching, VLANs and trunking, Static routing, OSPF, BGP basics, WAN and SD-WAN, VPN, Cisco ASA, NAT and ACLs, Troubleshooting'],
  };

  var CAP_Q = ['Walk us through your capstone project.', 'Problem → design → what you built → how you tested it → what you would improve.'];
  var PREP_Q = {
    2: [
      ['What is the difference between a schematic symbol and a footprint?', 'Symbol = logical drawing in the schematic; footprint = physical pads and outline on the PCB.'],
      ['Why do you run ERC and DRC in KiCad?', 'ERC finds wiring mistakes in the schematic; DRC finds clearance, width and connection errors on the board.'],
      ['How do you choose the track width for a power line?', 'Current, copper thickness and allowed temperature rise; use a width calculator and add margin.'],
      ['What files does a PCB manufacturer need?', 'Gerber files for each layer, drill files, the board outline and a BOM / pick-and-place file for assembly.'],
      ['How would you reduce noise on a board?', 'Solid ground plane, short return paths, decoupling capacitors close to IC pins, separate analog and digital areas.'],
      ['A circuit works in Tinkercad but not on the bench. What do you check?', 'Wiring against the schematic, power and ground, component values and orientation, loose breadboard contacts.'],
      ['What is a via and when do you use one?', 'A plated hole that connects layers; used to change layers or reach a ground plane.'],
      CAP_Q],
    5: [
      ['What is a digital twin?', 'A live virtual copy of a real asset that is kept in sync with sensor data and used to monitor, predict and test.'],
      ['How does sensor data reach your 3D model?', 'Sensor → ESP32 → Wi-Fi → cloud (ThingSpeak) → API read by Unity → model updates.'],
      ['Why use Wokwi before real hardware?', 'Test the circuit and code quickly, with no risk to parts, then move to the real board.'],
      ['What can go wrong with live data and how do you handle it?', 'Delays, gaps and bad readings: timestamps, validation, last-known-value and alerts.'],
      ['How would a factory use a digital twin?', 'Watch machines live, spot faults early, plan maintenance and test changes on the model first.'],
      ['What is the difference between monitoring and predicting?', 'Monitoring shows the current state; prediction uses trends or models to warn about what is likely next.'],
      ['Which tools did you use to build the 3D model and the view?', 'Blender for the model, Unity for the scene, AR/VR and the live data link.'],
      CAP_Q],
    6: [
      ['Explain the CIA triad with an example.', 'Confidentiality, integrity, availability – for example encryption, hashing and backups.'],
      ['How do you spot a phishing email?', 'Sender address, urgency, mismatched links, unexpected attachments; report it and do not click.'],
      ['What is the difference between IDS and IPS?', 'IDS detects and alerts; IPS sits in line and can block traffic.'],
      ['A SIEM shows many failed logins for one account. What do you do?', 'Check source IPs and times, lock or reset if needed, look for success after failures, escalate and document.'],
      ['What is the difference between a vulnerability scan and a penetration test?', 'A scan lists known weaknesses automatically; a pentest tries to exploit them, with permission.'],
      ['Why is MFA important?', 'A stolen password alone is not enough to sign in.'],
      ['What are the steps of incident response?', 'Prepare, identify, contain, eradicate, recover, lessons learned.'],
      CAP_Q],
    7: [
      ['What is the difference between a StatelessWidget and a StatefulWidget?', 'Stateless never changes after build; Stateful keeps state and rebuilds with setState.'],
      ['How do you manage state in a larger Flutter app?', 'Lift state up and share it with Provider (or similar), keep UI and logic separate.'],
      ['How do you call a REST API in Flutter?', 'http/dio package, async/await, decode JSON into model classes, handle loading and errors.'],
      ['What happens to your app when the network drops?', 'Show cached data from local storage, show a clear message and retry later.'],
      ['How does navigation work in Flutter?', 'Navigator push/pop or named routes; pass data with arguments.'],
      ['What is async/await in Dart?', 'Write asynchronous code that waits for a Future without blocking the UI.'],
      ['How do you prepare an app for the Play Store?', 'App icon and name, permissions, signing key, release build, store listing and testing.'],
      CAP_Q],
    8: [
      ['What are the main parts of an EV powertrain?', 'Battery, BMS, inverter, motor, controller and transmission, plus the charger.'],
      ['What do SOC and SOH mean?', 'SOC = how full the battery is now; SOH = battery health compared with when it was new.'],
      ['What is the difference between AC and DC charging?', 'AC uses the onboard charger and is slower; DC fast charging feeds the battery directly.'],
      ['Why does a battery pack need cell balancing?', 'Cells drift apart; balancing keeps them equal so the pack is safe and lasts longer.'],
      ['Which motor types are common in EVs and why?', 'BLDC/PMSM for efficiency and power density; induction motors are robust and cheaper.'],
      ['What safety steps do you follow before working on an EV?', 'Isolate the high-voltage system, use PPE and insulated tools, verify zero voltage, follow the service manual.'],
      ['How would you plan chargers for a delivery fleet?', 'Vehicle count, daily km, charging window, site power capacity, AC vs DC mix, smart charging.'],
      CAP_Q],
    9: [
      ['What is the difference between joint and linear motion?', 'Joint moves each axis to the target (fast, curved path); linear keeps the tool on a straight line.'],
      ['Why use tool and user frames?', 'Points stay correct relative to the tool and fixture; move a fixture and only update the frame.'],
      ['How does a robot know a part is ready?', 'A sensor gives a digital input; the program waits for it before moving.'],
      ['How would you reduce a cycle time?', 'Blend points, remove unnecessary stops, optimise paths and speeds, overlap with other machines.'],
      ['What safety devices protect people in a robot cell?', 'Fences, interlocked doors, light curtains, area scanners, E-stops and safe speeds.'],
      ['How does a robot exchange signals with a PLC?', 'Digital I/O or a fieldbus; handshake signals such as start, ready, busy and done.'],
      ['The robot stopped with an alarm. What do you do?', 'Read the alarm code, check the cause safely, fix it, reset and test at low speed, then record it.'],
      CAP_Q],
    10: [
      ['What is the difference between Arduino Uno and ESP32?', 'ESP32 has built-in Wi-Fi and Bluetooth, more speed and memory, and 3.3 V logic.'],
      ['How do you send sensor data to the cloud?', 'Read the sensor, connect to Wi-Fi, send to ThingSpeak/Blynk/MQTT at a fixed interval.'],
      ['Explain MQTT publish/subscribe.', 'Devices publish to topics on a broker; apps subscribe to the topics they need.'],
      ['Why avoid delay() in IoT code?', 'It blocks the loop and the connection; use timers instead.'],
      ['How would you build a gas leak alert?', 'Gas sensor → threshold → SMS/call with Twilio, with a cool-down so it does not repeat every second.'],
      ['How do you keep an IoT device secure?', 'No hard-coded secrets in shared code, strong passwords, TLS where possible, updates.'],
      ['How does your Android app get live data?', 'From a cloud database such as Firebase, which pushes changes to the app.'],
      CAP_Q],
    11: [
      ['What is the T568B colour order?', 'Orange-white, orange, green-white, blue, blue-white, green, brown-white, brown.'],
      ['What is the maximum length of a copper Ethernet channel?', '100 m in total: 90 m permanent link plus patch cords.'],
      ['What does a wire-map test find?', 'Opens, shorts, reversed and crossed pairs, and split pairs.'],
      ['When do you choose fibre instead of copper?', 'Long distances, high bandwidth, interference or between buildings.'],
      ['What does an OTDR show?', 'Distance to splices, connectors, bends and breaks, and the loss at each.'],
      ['Why label and document every link?', 'Faster fault finding, changes and audits; anyone can trace a cable.'],
      ['A user has no network. How do you troubleshoot?', 'Start at layer 1: link lights, patch cord, outlet, test the cable, then the switch port and IP.'],
      CAP_Q],
    12: [
      ['Explain the OSI model and where switches and routers work.', 'Seven layers; switches at layer 2 (MAC), routers at layer 3 (IP).'],
      ['Subnet 192.168.10.0/24 into 4 networks.', '/26: .0, .64, .128, .192 – 62 usable hosts each.'],
      ['What is a VLAN and how do VLANs talk to each other?', 'A separate logical network on a switch; inter-VLAN routing on a router or Layer 3 switch.'],
      ['Static routing or OSPF – when would you use each?', 'Static for small or stub networks; OSPF for larger networks that change and need automatic failover.'],
      ['What is a site-to-site VPN?', 'An encrypted tunnel that joins two office networks over the internet.'],
      ['What does a firewall do with NAT and ACLs?', 'NAT translates private to public addresses; ACLs allow or block traffic by rule.'],
      ['How do you troubleshoot "cannot reach the internet"?', 'ipconfig, ping gateway, ping public IP, nslookup, traceroute – layer by layer.'],
      CAP_Q],
  };

  // the IT Network System Administrator listings that ship in index.html (JOBS)
  var NET1 = ['Network Support Intern', 'Junior Network Administrator', 'NOC Engineer (L1)', 'System Administrator (L1)', 'Packet Analysis / Network Security Intern',
    'Network Technician / Field Engineer', 'Windows Server & AD Support Engineer (L1)', 'Desktop Support Engineer', 'VPN & Remote Access Support Engineer',
    'Linux System Administrator (Trainee)', 'Virtualization Support Intern', 'IT Help Desk Engineer'];
  // ---- job board: give each course its own listings (titles already on the board are reused) ----
  function idxOf(t) { for (var k = 0; k < w.JOBS.length; k++) if (w.JOBS[k][0] == t) return k; return -1; }
  if (w.JOBS && w.C) {
    var claimed = {};
    Object.keys(CJOBS).forEach(function (ci) {
      var c = w.cf(+ci); if (!c) return;
      var ids = CJOBS[ci].map(function (j) { var k = idxOf(j[0]); if (k < 0) { w.JOBS.push(j.slice()); k = w.JOBS.length - 1; } return k; });
      if (!(c.jobs && c.jobs.length)) c.jobs = ids; // a list set in Admin → Courses wins
      c.jobs.forEach(function (k) { claimed[k] = 1; });
    });
    // IT Network System Administrator: its own listings (also when another course shares one, e.g. NOC Engineer (L1))
    // plus any listing no other course uses, such as ones added by the admin
    var c1 = w.cf(1);
    if (c1 && !(c1.jobs && c1.jobs.length)) {
      c1.jobs = w.JOBS.map(function (j, k) { return k; }).filter(function (k) { return !claimed[k] || NET1.indexOf(w.JOBS[k][0]) > -1; });
    }
  }

  w.CJOBS = CJOBS; w.CPATH = CPATH; w.RSD = RSD; w.PREP_Q = PREP_Q;

  // resume builder suggestions for a course: summary, skills and projects
  w.rsDefFor = function (c) {
    c = c || {};
    if (c.i == 1 && w.RDEF) return { sum: w.RDEF.sum, sk: w.RDEF.sk, pr: w.RDEF.pr };
    var d = RSD[c.i] || [], caps = (w.CAPS && w.CAPS[c.i]) || [];
    return {
      sum: d[0] || c.s || '',
      sk: d[1] || (c.k || []).join(', '),
      pr: caps.slice(0, 2).map(function (p) { return p.t + ' | Course project, ingage EduTech\n' + p.out.slice(0, 2).map(function (o) { return '- ' + o; }).join('\n'); }).join('\n'),
    };
  };

  // career path shown under the job listings
  w.cpathHtml = function (ci) {
    var p = CPATH[ci]; if (!p) return '';
    return '<h3 style="margin-top:30px">Career path</h3><div class="xo" style="margin-top:10px">' + p[0].map(function (x, i) { return '<span class="chip' + (i < 1 ? ' on' : '') + '">' + w.esc(x) + '</span>'; }).join('') +
      '</div><p class="meta">Next learning: ' + w.esc(p[1]) + '</p>';
  };
})(window);

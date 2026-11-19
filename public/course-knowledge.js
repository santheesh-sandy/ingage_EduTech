/* ingage EduTech – course knowledge from the official slides (Google Drive: slides/pdf M1-1 … M10-3)
 * IT Network System Administrator. Used by the chatbot (predefined answers + context for the live AI).
 * Edit freely: each deck has a title and short fact lines (one fact per line).
 */
(function (w) {
  'use strict';
  var KB = {
    course: 'IT Network System Administrator',
    hours: '60 hours: 30 hours theory + 30 hours practical/lab',
    outline: ['Introduction to networking basics and the system admin role', 'Infrastructure setup and traffic analysis',
      'Network security and remote access', 'Server administration (Windows & Linux)', 'Server administration (file sharing and storage)'],
    hardware: [
      ['Operating system', '64-bit Windows 10 or later'],
      ['Processor', 'Intel Core i5 or Core i7 (3rd generation or newer)'],
      ['Memory', '8 GB RAM'],
      ['Graphics', '2 GB graphics card'],
      ['Storage', '256 GB SSD'],
      ['Internet', 'High-speed internet (100 Mbps)'],
    ],
    software: [
      ['Cisco Packet Tracer', 'Network simulator: build and test LANs with PCs, hubs, switches, routers and servers (static/dynamic routing, DHCP, DNS, HTTP labs).', 'Modules 1, 2, 5',
        'Windows 10/11 (32/64-bit), macOS 10.13+, or Ubuntu 18.04/20.04 LTS; Core i3 or above; 4 GB RAM minimum (8 GB recommended for complex topologies); 1 GB free disk (2 GB recommended). Internet only needed to download it.'],
      ['GNS3 (Graphical Network Simulator-3)', 'Open-source simulator for real router/switch images: VPCs, IOS routers, RIP v2 routing, capturing links into Wireshark. Install "GNS3 Desktop"; consoles open in Solar-PuTTY.', 'Modules 3, 4', 'Download from the official GNS3 site for your OS; a Cisco IOS router image is added under Edit → Preferences → IOS routers.'],
      ['Solar-PuTTY', 'Console used by GNS3 to type commands on PCs and routers (set IPs, gateways, ping).', 'Module 3', ''],
      ['Wireshark', 'Free, open-source packet analyser ("network microscope"): live capture, deep packet inspection, display filters (e.g. http, tcp.port==80, ip.addr==192.168.1.1), I/O graphs, save .pcap, export to CSV.', 'Module 4', 'Windows 64-bit installer from wireshark.org.'],
      ['Oracle VirtualBox', 'Free hypervisor to run Windows Server, Windows 10 and Ubuntu as virtual machines on one PC. Network modes: NAT, Bridged, Host-only, Internal, Generic.', 'Modules 6–10', ''],
      ['Windows Server 2019', 'Server OS for the labs: AD DS, DNS, DHCP, File & Storage, IIS, Hyper-V, RRAS/VPN, NPS, WSUS, Group Policy.', 'Modules 6–9', 'Installed in a VirtualBox VM from an ISO file.'],
      ['Windows 10 Pro', 'Client OS installed in a VM and joined to the domain.', 'Module 8', 'New VM: allocate CPU, RAM and disk, mount the Windows 10 Pro ISO, start the install.'],
      ['Active Directory Domain Services', 'Central management of users, computers, OUs, groups and policies; domain controller, trees and forests.', 'Modules 7–8', ''],
      ['Group Policy Management Console (GPMC)', 'Create and link GPOs (block Control Panel, disable USB, password rules, restrict software).', 'Module 8', ''],
      ['RRAS + NPS', 'Routing and Remote Access (VPN server) with Network Policy Server (RADIUS) to control which domain users may connect.', 'Module 9', ''],
      ['Ubuntu Linux', 'Free, open-source Linux OS by Canonical for desktops, servers and cloud; LTS releases (20.04, 22.04, 24.04) get 5 years of updates.', 'Module 10', 'Installed from an ISO (e.g. ubuntu-22.04-desktop.iso) in VirtualBox.'],
    ],
    decks: {
      'M1-1': ['Networking basics, scope and job roles', [
        'Computer networking is connecting computers and devices to share data and resources such as printers, storage and internet access.',
        'Advantages of computer networks: resource sharing, communication and collaboration, centralised data management, productivity, scalability, security, internet and cloud connectivity, remote access, efficient data transmission.',
        'Scope of networking: enterprise networking, telecom, network security, IoT, education, wireless and mobile, data analytics and big data, AI/ML networking, gaming and entertainment.',
        'Career stage 1 (entry level): Network Support Technician, Helpdesk Engineer, IT Support. Skills: OSI model, IP addressing, basic troubleshooting, Windows/Linux. Certifications: CompTIA ITF+, CompTIA A+, Cisco CCST.',
        'Career stage 2 (associate): Network Administrator, Junior Network Engineer, System Admin. Skills: LAN/WAN, DNS/DHCP, basic routing, server setup. Certifications: CompTIA Network+, CCNA, Microsoft Azure Fundamentals.',
        'Career stage 3 (mid level): Network Engineer, Infrastructure Engineer, Network Analyst. Skills: VLANs, subnetting, OSPF/BGP, firewall configuration, monitoring. Certifications: CCNP, JNCIA, Fortinet NSE 4.',
        'Career stage 4 (senior): Senior Network Engineer, Network Security Engineer, VoIP/Telecom Specialist. Skills: SD-WAN, MPLS, advanced firewalls, network automation with Python and Ansible. Certifications: CCNP Security, CEH, VMware NSX.',
        'Career stage 5 (architect): Network Architect, Cloud Network Architect, Infrastructure Manager. Certifications: CCIE, AWS Networking Specialty, TOGAF.',
        'Starting salaries for diploma holders (CSE/IT): IT Support Technician ₹2.0–3.0 LPA; Network Support Engineer ₹2.5–4.0 LPA; Junior System Administrator ₹3.0–4.5 LPA; Field Engineer ₹2.5–4.0 LPA; Data Center Technician ₹3.0–5.0 LPA.',
        'Certifications that boost a career after a diploma: CompTIA A+, CCNA, CompTIA Network+, Microsoft Azure Fundamentals (AZ-900).',
        'Career path: start as Support Technician / Field Engineer, gain 1–2 years experience and CCNA, move to Network Engineer/Admin, learn security or cloud networking, grow into Senior Engineer / Network Architect.',
      ]],
      'M1-2': ['IT Network Systems Administration overview and addressing', [
        'IT Network Systems Administration covers the design, implementation, maintenance and security of an organisation’s networks (LAN, WAN, intranets) and systems.',
        'Key responsibilities: install and configure routers, switches and firewalls; manage servers, storage and workstations; monitor performance; apply updates and patches; manage backups and disaster recovery.',
        'User support: help users with connectivity and access issues, diagnose hardware/software problems, support network services.',
        'Security administration: configure firewalls, antivirus and intrusion detection; enforce access control and security policies; respond to breaches.',
        'Documentation and compliance: keep records of configurations and changes; follow regulatory and internal IT standards.',
        'Addressing types: logical addressing (IPv4 and IPv6) identifies devices across networks; physical addressing (MAC address) is the fixed unique identifier of a network interface.',
      ]],
      'M1-3': ['IPv4, IPv6 and Packet Tracer setup', [
        'IPv4 is a 32-bit address written as four octets (e.g. 192.168.1.1), with classes A–E; the subnet mask (e.g. 255.255.255.0 for /24) separates network and host parts.',
        'IPv6 is a 128-bit address written in hexadecimal (e.g. 2001:0db8::1) with a vast address space, hierarchical routing and built-in IPsec support.',
        'IPv6 address types: unicast (one to one), multicast (one to many), anycast (to the nearest of several destinations). IPv6 supports SLAAC auto-configuration.',
        'IPv4 has limited addresses and relies on NAT; IPv6 solves exhaustion with about 340 undecillion addresses and supports end-to-end communication without NAT.',
        'IPv4 classes: A 1.0.0.0–126.255.255.255 (mask 255.0.0.0, large networks); B 128.0.0.0–191.255.255.255 (255.255.0.0, medium); C 192.0.0.0–223.255.255.255 (255.255.255.0, small, 254 hosts); D 224–239 multicast; E 240–255 experimental.',
        'Cisco Packet Tracer system requirements: Windows 10/11, macOS 10.13+ or Ubuntu 18.04/20.04; Core i3 or above; 4 GB RAM minimum, 8 GB recommended; 1–2 GB free disk.',
        'Packet Tracer has a logical view (topology) and a physical view (racks and devices).',
      ]],
      'M2-1': ['Hub and switch setup', [
        'A hub connects devices in a LAN and broadcasts every frame to all ports. It is cheap and plug-and-play, but causes collisions and is less secure.',
        'A switch sends data only to the intended device: faster, more secure, no collisions (each port has dedicated bandwidth) and scalable.',
        'Packet Tracer hub lab: drag PCs and a PT-Hub, connect with copper straight-through cables, set static IP and subnet mask on each PC (Desktop → IP Configuration), send an ICMP packet and check success in real-time mode.',
        'In simulation mode you can watch the hub send the packet to every PC, not only the receiver. Replace the hub with a switch to see traffic go only to the destination.',
      ]],
      'M2-2': ['Router setup and introduction to routing', [
        'Router lab: add a PT-Router, connect each LAN with a copper straight-through cable, open Config, turn on the port and set the interface IP and subnet mask for each network.',
        'Set each PC’s default gateway to the router interface on its network, then send an ICMP packet between networks to test.',
        'Routing is selecting the best path for packets between networks using Layer 3 (network layer) information.',
        'Routers work at OSI Layer 3, keep a routing table and use routing protocols to exchange routes and adapt to changes.',
        'Routing protocols automatically discover routes, react to failures and keep routing loop-free; static routing is impractical in large, changing networks.',
      ]],
      'M2-3': ['Static and dynamic routing', [
        'Static routing: routes are entered manually by the administrator (network, subnet mask, next hop). Simple for small networks, no automatic updates.',
        'Static routing lab in Packet Tracer: build 4 networks with routers, set interface IPs and PC gateways, then in each router add static routes with the next-hop address of the neighbouring router.',
        'Dynamic routing: routers learn and update routes automatically with protocols like RIP, OSPF and BGP, and adapt to network changes.',
        'RIP is a distance-vector protocol using hop count (max 15 hops), sends updates every 30 seconds and converges slowly: suited to small networks.',
        'OSPF is a link-state protocol using cost (based on bandwidth) and the Dijkstra algorithm; fast convergence, very scalable, organises networks into areas.',
        'EIGRP is Cisco’s hybrid protocol using bandwidth, delay, reliability and load, with very fast convergence through the DUAL algorithm.',
        'Dynamic routing lab: in each router choose RIP instead of Static and add the directly connected networks.',
      ]],
      'M3-1': ['GNS3 introduction, installation and project', [
        'GNS3 (Graphical Network Simulator-3) is an open-source tool to design, configure, test and troubleshoot virtual and real networks, used for CCNA/CCNP/CCIE practice without physical hardware.',
        'Install GNS3: download from the GNS3 site for your OS, run the installer and choose only "GNS3 Desktop".',
        'New project: File → New Blank Project, enter a name and save location.',
        'Switch lab: drag a switch and VPCs (Browse End Devices), connect them with Add Link, start the PCs, open the Solar-PuTTY console, set IP addresses with commands and ping to test.',
      ]],
      'M3-2': ['GNS3 router configuration', [
        'GNS3 router configuration sets up a virtual router to assign IPs, enable routing and control traffic, without physical hardware.',
        'Add a router: Edit → Preferences → IOS routers → New, browse to the Cisco IOS image, choose slots, Apply and OK, then drag the router into the project.',
        'Start the router, configure interface IPs in the Solar-PuTTY console, set the PC default gateways and test with ping.',
      ]],
      'M3-3': ['RIP routing in GNS3', [
        'RIP lab: build three routers as Zone 1, 2 and 3, configure PC IPs and gateways and router interface IPs.',
        'Enable RIP version 2 on every router with commands, then ping a PC in another zone and trace the route used.',
        'The module ends with an IT office network setup in GNS3.',
      ]],
      'M4-1': ['Wireshark introduction and features', [
        'Wireshark is a free, open-source network protocol analyser for troubleshooting, analysis, development, education and cybersecurity: a "network microscope".',
        'Features: live capture from Ethernet, Wi-Fi and Bluetooth; deep packet inspection of headers and payload; decodes thousands of protocols (HTTP, TCP, UDP, DNS, FTP, ICMP).',
        'Display filters narrow traffic, e.g. http, tcp.port==80, ip.addr==192.168.1.1. Colour rules, I/O graphs and flow diagrams help visual analysis.',
        'Captures can be saved as .pcap files and replayed for study.',
      ]],
      'M4-2': ['Wireshark installation and traffic capture', [
        'Install: go to wireshark.org, download the Windows 64-bit installer and install it.',
        'Capture: select the interface, start capture, stop with the stop button, apply a display filter, then save the capture file.',
        'Export: File → Export Packet Dissections → CSV to extract data; Statistics → I/O Graphs for traffic graphs.',
      ]],
      'M4-3': ['Capturing GNS3 traffic and exporting data', [
        'In GNS3, right-click a link and start a capture: Wireshark opens and records that link’s packets; rename links to capture several routes.',
        'Ping between PCs in the Solar-PuTTY console to generate traffic, filter it, and export as CSV for a report.',
      ]],
      'M5-1': ['DNS, FTP, protocols and DHCP', [
        'DNS (Domain Name System) resolves names like www.example.com into IP addresses using distributed servers worldwide.',
        'FTP transfers files to and from servers and works in active or passive mode; its secure version is SFTP. HTTP is for web browsing (secure version HTTPS).',
        'DHCP automatically assigns IP addresses from a pool, avoiding manual configuration and conflicts.',
        'DHCP process (DORA): Discover (client broadcast) → Offer (server offers an IP) → Request (client asks for it) → Acknowledge (server confirms).',
        'DHCP components: DHCP server, DHCP client, IP address pool and lease time (how long the address is valid before renewal).',
        'Common DHCP options: IP range, default gateway, DNS servers, lease duration.',
        'DHCP security: rogue DHCP servers can hand out wrong addresses; DHCP snooping prevents them.',
      ]],
      'M5-2': ['DHCP and HTTP labs in Packet Tracer', [
        'DHCP lab: add a server, give it a static IP, open Services → DHCP, turn it on, set the start IP and maximum users, save; then set each PC to DHCP to receive an address automatically.',
        'HTTP lab: add a second server (if the switch has no free port, power off the switch and add a PT-SWITCH-NM-1CFE module), set it to DHCP, turn on HTTP and open the server IP from a PC’s web browser.',
      ]],
      'M5-3': ['DNS server lab', [
        'DNS lab: add a DNS server, turn on DNS and add a name record pointing to the web server IP.',
        'Add the DNS server IP in the DHCP server settings, renew the PCs (static then DHCP again) and browse the website by name instead of IP.',
        'The final topology combines a DHCP server, web server and DNS server.',
      ]],
      'M6-1': ['Virtualization basics and VirtualBox', [
        'Virtualization creates virtual versions of servers, OSs, storage and networks so many OSs run on one physical machine.',
        'A hypervisor sits between hardware and VMs and shares CPU, memory, storage and network. Examples: Oracle VirtualBox, VMware, Microsoft Hyper-V.',
        'A virtual machine has a virtual CPU, RAM and hard disk. The physical computer is the host; the VMs are guests.',
        'Benefits: maximum hardware use, lower cost, easier backup and recovery, enables cloud, safe testing.',
        'VirtualBox is Oracle’s free, open-source hypervisor: install Linux on Windows, practise Windows Server, test software safely, learn networking and security.',
        'VirtualBox components: host machine, guest machine (VM), ISO file (OS installer) and the hypervisor engine.',
        'VirtualBox is free and best for learning; VMware is mostly paid, with better performance and advanced features for industry use.',
      ]],
      'M6-2': ['Windows Server roles and features', [
        'Windows Server is Microsoft’s OS for centrally managing networks, users, computers and security in schools, banks, companies and data centres.',
        'Roles: Active Directory Domain Services, DNS Server, DHCP Server, File & Storage Services, Web Server (IIS), Hyper-V, VPN & Routing (RRAS).',
        'Features: WSUS (distributes Windows updates), .NET Framework, Failover Clustering (high availability), BitLocker (encryption), Windows Defender, SMB file sharing, Remote Desktop Services.',
        'Advantages: centralised management, strong security and policies, many server roles, scalability, Hyper-V virtualisation, secure remote access, easy file sharing, integration with Azure and Microsoft 365.',
      ]],
      'M6-3': ['Windows Server versions and computer name', [
        'Versions: 2012/2012 R2 (new Server Manager, better Hyper-V), 2016 (Nano Server, Shielded VMs), 2019 (hybrid cloud, performance and security), 2022 (Secured-core server, modern cloud).',
        'The course labs use Windows Server 2019 installed in a VirtualBox VM.',
        'Change the computer name: System Properties → Computer Name → Change, then restart. Clear names help Active Directory and troubleshooting.',
      ]],
      'M7-1': ['Network adapters and VirtualBox network modes', [
        'A network adapter (NIC) connects a computer or VM to a network; types: Ethernet (RJ-45), Wi-Fi, USB and virtual adapters.',
        'NAT: the VM uses the host’s IP for internet and is hidden from the network; safest default, good for updates and browsing.',
        'Bridged: the VM becomes a real device on the LAN with an IP from the same router; good for server testing and domain joining.',
        'Host-only: only host ↔ VM communication, no internet, private IP; ideal for Active Directory, DNS, DHCP and VPN labs.',
        'Internal network: VMs talk only to each other; the host cannot reach them. Generic driver is for advanced experiments.',
        'Static IP is fixed and manually assigned (best for servers); dynamic IP is given by DHCP and can change.',
      ]],
      'M7-2': ['Active Directory Domain Services', [
        'AD DS manages users, computers and resources centrally: logins, permissions, security policies and access to files, printers and apps.',
        'AD DS components: Domain Controller, domain, user accounts, computer accounts, Organizational Units (OUs) and Group Policy Objects (GPOs).',
        'A domain is a group of users and computers under one network name, controlled by a Domain Controller.',
        'NTDS.dit is the Active Directory database on the Domain Controller (users, passwords, computers, groups, policies).',
        'A workgroup is a small network with no central server; each PC keeps its own users in the local SAM (Security Account Manager) database.',
        'SAM vs NTDS.dit: SAM stores local accounts on every Windows PC (workgroup login); NTDS.dit stores domain accounts only on the Domain Controller (domain login).',
      ]],
      'M7-3': ['Trees, forests and domain controllers', [
        'A tree is one or more domains sharing a DNS namespace in a parent–child relationship, e.g. college.edu with cs.college.edu and ece.college.edu.',
        'A forest is the largest AD structure: one or more trees (can have different names) sharing schema, global catalog and configuration.',
        'Workgroup vs domain: a workgroup has no central control and separate logins per PC (homes, small offices); a domain has centralised control, one login on all PCs and high security (schools, companies).',
        'A Domain Controller authenticates logins, stores user and computer accounts, applies Group Policy and controls access to resources.',
      ]],
      'M8-1': ['Windows 10 client deployment', [
        'Windows 10 is used as the client OS: GUI, multitasking, NTFS/FAT32, Windows Defender, BitLocker, and Active Directory, Group Policy and Remote Desktop support.',
        'Install Windows 10 Pro in a VM: create the VM, allocate CPU, RAM and disk, mount the ISO and start the installation, then join it to the domain.',
      ]],
      'M8-2': ['Group Policy', [
        'Group Policy lets an administrator set rules for users and computers in a domain from one place; they apply automatically at login.',
        'Examples: block Control Panel, disable USB drives, set password rules, restrict software installation, control desktop and internet settings.',
        'Terms: GPO (collection of settings), OU (group of users/computers), Domain Controller (applies policy), GPMC (Group Policy Management Console).',
      ]],
      'M8-3': ['Types of Group Policy', [
        'Local Group Policy applies to one computer (standalone/workgroup), e.g. block USB on one PC.',
        'Site-level policy applies to an AD site (physical location), e.g. a branch office.',
        'Domain-level policy applies to all users and computers in the domain, e.g. an organisation-wide password policy.',
        'OU-level policy applies to one Organizational Unit, e.g. only the Students OU or IT Staff OU.',
      ]],
      'M9-1': ['VPN introduction', [
        'A VPN (Virtual Private Network) creates a secure, encrypted connection over the internet to a private network, as if you were directly connected.',
        'Uses: work from home, secure banking, remote college lab access, corporate network access, safe use of public Wi-Fi, secure file sharing.',
        'Types: Remote Access VPN (individual users) and Site-to-Site VPN (between two office networks).',
      ]],
      'M9-2': ['VPN with Active Directory and NPS', [
        'Windows Server provides VPN through the Remote Access role; with Active Directory it gives central authentication, user-based access, policies and logging.',
        'NPS (Network Policy Server) is a RADIUS server role that decides who may connect: it checks domain username, password and group membership before allowing VPN access.',
      ]],
      'M9-3': ['RRAS and remote VPN clients', [
        'RRAS (Routing and Remote Access Service) is used for VPN server setup, routing between networks and remote connections.',
        'Add a VPN user: create the AD user, allow Remote Access (dial-in) permission, add the user to the VPN Users group and apply a network policy in NPS.',
        'Remote client: open VPN settings, enter the server IP or name, sign in with the domain username and password, Connect; a secure tunnel gives access to file servers, printers, apps and intranet sites.',
        'The module also covers file sharing between machines over IP.',
      ]],
      'M10-1': ['Ubuntu introduction', [
        'Ubuntu is a free, open-source Linux OS by Canonical Ltd, used on desktops, laptops, servers and the cloud: easy, secure, fast and stable.',
        'Uses: browsing, programming (Python, C, Java), office apps, servers and cloud, learning Linux commands and networking.',
        'Where it is used: student labs, software development, web servers, AWS/Azure/Google Cloud and cybersecurity practice.',
      ]],
      'M10-2': ['Ubuntu desktop, server and LTS', [
        'Ubuntu Desktop has a GUI for browsing, office work, programming and multimedia.',
        'Ubuntu Server is command-line by default and used for web hosting, databases, file servers and cloud platforms.',
        'LTS (Long Term Support) releases come every 2 years with 5 years of updates, e.g. Ubuntu 20.04, 22.04 and 24.04 LTS.',
      ]],
      'M10-3': ['Ubuntu flavours and ISO files', [
        'Flavours: Xubuntu (low RAM), Lubuntu (very lightweight), Kubuntu (Windows-like), Ubuntu MATE (classic), Ubuntu Budgie (modern), Ubuntu Studio (audio/video/graphics). Ubuntu Core is for IoT and embedded devices.',
        'An ISO file is a disk image of an OS installer (e.g. ubuntu-22.04-desktop.iso); attach it to a VirtualBox VM or computer and start the system to install.',
      ]],
    },
  };
  w.COURSE_KB = KB;

  // module number for a deck id like "M7-2"
  function modOf(id) { return +String(id).replace(/^M(\d+)-.*/, '$1'); }

  /* ---------- feed the chatbot knowledge base (DOCS → searchable "doc" entries) ---------- */
  w.DOCS = w.DOCS || [];
  Object.keys(KB.decks).forEach(function (id) {
    var d = KB.decks[id], m = (w.MD && w.MD[modOf(id) - 1]) || { t: '' };
    w.DOCS.push(['Module ' + modOf(id) + ' (' + m.t + ') – ' + d[0], d[0] + '\n' + d[1].join('\n')]);
  });
  w.DOCS.push(['Software used in IT Network System Administrator', 'Software\n' + KB.software.map(function (s) { return s[0] + ': ' + s[1] + ' Used in ' + s[2] + '.' + (s[3] ? ' Requirements: ' + s[3] : ''); }).join('\n')]);
  w.DOCS.push(['Hardware / PC requirements for IT Network System Administrator', 'Hardware\n' + KB.hardware.map(function (h) { return h[0] + ': ' + h[1]; }).join('\n')]);
  if ('KBS' in w) w.KBS = null; // rebuild the search index with the new entries

  /* ---------- predefined answers: software / hardware / requirements ---------- */
  var HWRE = /\b(hardware|system requirements?|(pc|laptop|computer|system) (requirements?|specs?|specifications?|config\w*)|specs?|specifications?|laptop|ram|processor|cpu|ssd|graphics card|internet speed)\b/i;
  var NEEDRE = /\b(need|needed|required|requirement|use|used|uses|using|which|what|list|install|minimum|recommended)\b/i;
  function tbl(rows) { return '<table class="ai-tbl" style="width:100%;border-collapse:collapse;font-size:13px">' + rows.map(function (r) { return '<tr><td style="padding:4px 6px;border-bottom:1px solid #e3e8f0;vertical-align:top"><b>' + w.esc(r[0]) + '</b></td><td style="padding:4px 6px;border-bottom:1px solid #e3e8f0">' + w.esc(r[1]) + '</td></tr>'; }).join('') + '</table>'; }
  function hwAnswer() {
    return '<b>💻 PC / hardware for IT Network System Administrator</b>' + tbl(KB.hardware) +
      '<p class="meta" style="margin:6px 0 0">Cisco Packet Tracer alone runs on a Core i3 with 4 GB RAM (8 GB recommended); the Windows Server and Ubuntu virtual-machine labs need the full spec above.</p>';
  }
  function swAnswer() {
    return '<b>🧰 Software used in IT Network System Administrator</b>' + tbl(KB.software.map(function (s) { return [s[0], s[1].split('. ')[0] + '. (' + s[2] + ')']; })) +
      '<p class="meta" style="margin:6px 0 0">All of these are free to download for learning, except Windows Server/Windows 10, which use evaluation ISOs in VirtualBox.</p>';
  }
  function sure(h) { if (w.AILIVE) w.AILIVE.sure = 1; return h; }
  w.cnHwAnswer = hwAnswer; w.cnSwAnswer = swAnswer;
  var _route = w.aiRoute;
  w.aiRoute = function (q) {
    var s = String(q).toLowerCase();
    if (w.CBMODE != 'doubt' && NEEDRE.test(s)) {
      var scope = (w.aiScope && w.aiScope()) || (w.aiCur && w.aiCur()), other = scope && scope.i != 1;
      var named = w.aiCourse && w.aiCourse(s);
      if (!other && (!named || named.i == 1)) {
        if (HWRE.test(s) && !/\b(fee|price|cost)\b/.test(s) && !/router|switch|hub/.test(s)) return sure(hwAnswer());
        if (/\bsoftware|tools?|applications?|programs?\b/.test(s) && !/\b(fee|price)\b/.test(s)) return sure(swAnswer());
      }
    }
    return _route(q);
  };

  /* ---------- module answers: add key points from the slides ---------- */
  var _modN = w.aiModN;
  w.aiModN = function (c, n) {
    var h = _modN(c, n);
    if (!h || !c || c.i != 1) return h;
    var ids = Object.keys(KB.decks).filter(function (id) { return modOf(id) == n; });
    if (!ids.length) return h;
    var sw = KB.software.filter(function (s) { return new RegExp('\\b' + n + '\\b').test(s[2].replace(/(\d+)\s*[–-]\s*(\d+)/g, function (_, a, b) { var r = []; for (var k = +a; k <= +b; k++) r.push(k); return r.join(','); })); }).map(function (s) { return s[0]; });
    return h + '<details class="ai-kp" style="margin-top:8px"><summary style="cursor:pointer;font-weight:700">📑 Key points from the slides</summary><ul class="ai-dot">' +
      ids.map(function (id) { return '<li><b>' + w.esc(KB.decks[id][0]) + ':</b> ' + w.esc(KB.decks[id][1][0]) + '</li>'; }).join('') + '</ul>' +
      (sw.length ? '<p class="meta" style="margin:4px 0 0">🧰 Software: ' + sw.map(w.esc).join(', ') + '</p>' : '') + '</details>';
  };

  /* ---------- context for the live AI ---------- */
  w.courseKbFor = function (ci, q) {
    if (ci != 1) return null;
    var words = String(q || '').toLowerCase();
    // the decks most related to the question (by simple word overlap), plus the fixed outline
    var scored = Object.keys(KB.decks).map(function (id) {
      var d = KB.decks[id], txt = (d[0] + ' ' + d[1].join(' ')).toLowerCase(), sc = 0;
      words.split(/[^a-z0-9.+#-]+/).filter(function (x) { return x.length > 2; }).forEach(function (x) { if (txt.indexOf(x) > -1) sc++; });
      return [sc, id];
    }).sort(function (a, b) { return b[0] - a[0]; });
    var top = scored.filter(function (x) { return x[0] > 0; }).slice(0, 3).map(function (x) { var d = KB.decks[x[1]]; return 'Module ' + modOf(x[1]) + ' – ' + d[0] + ': ' + d[1].join(' '); });
    return {
      hours: KB.hours, outline: KB.outline,
      modules: (w.MD || []).map(function (m, n) { return 'Module ' + (n + 1) + ': ' + m.t + ' (' + m.p.map(function (p) { return p[2]; }).join('; ') + ')'; }),
      hardware: KB.hardware.map(function (h) { return h[0] + ': ' + h[1]; }),
      software: KB.software.map(function (s) { return s[0] + ' – ' + s[1] + ' [' + s[2] + ']' + (s[3] ? ' Requirements: ' + s[3] : ''); }),
      relatedSlides: top,
    };
  };
})(window);

/* ingage EduTech – Cyber Security Essentials curriculum (course 6)
 * 10 modules · 26 slide decks · 18 videos · one 5-question MCQ test per module (written from the slides).
 * Slides are on Amazon S3: <base><file>.pptx, shown in the lesson with the Office Online viewer.
 * Videos (18 lab videos) are on S3 too: <video base><file name>.mp4 (list VIDEOS below). Each one is placed in its
 * module right after the slide deck it belongs to, and plays in the site's own player.
 * Loaded before the main script in index.html, so the course list (var C) can use it.
 */
(function (w) {
  'use strict';
  var BASE = 'https://ingage-lms.s3.ap-south-1.amazonaws.com/Cyber+Security+Essentials/Slides/';
  var VBASE = 'https://ingage-lms.s3.ap-south-1.amazonaws.com/Cyber+Security+Essentials/Videos/';
  // [module number, after deck number, S3 file name (no .mp4), lesson title]; the video number is the start of the file name
  var VIDEOS = [
    [1, 3, '1. Phishing Threat Intelligence', 'Phishing threat intelligence'],
    [2, 2, '2. Credential Vault & Risk Assessment', 'Credential vault & risk assessment'],
    [3, 1, '3. Introduction to cisco packet tracer', 'Introduction to Cisco Packet Tracer'],
    [3, 1, '4. Hub Configuration', 'Hub configuration'],
    [3, 1, '5.Switch and Router', 'Switch and router'],
    [3, 2, '6.Topologies', 'Topologies'],
    [3, 2, '7.Topology', 'Topology lab'],
    [3, 2, '8.Static Routing', 'Static routing'],
    [3, 2, '9.Static continue and Dynamic routing', 'Static (continued) and dynamic routing'],
    [3, 3, '10.VPN (Cisco Packet Tracer)', 'VPN in Cisco Packet Tracer'],
    [4, 1, '12.ASA_FIREWALL SIMULATION', 'ASA firewall simulation'],
    [5, 2, '11.WIRELESS SECURITY Configuration', 'Wireless security configuration'],
    [5, 3, '13.Secure Wireless Deployment', 'Secure wireless deployment'],
    [6, 3, '14.Traffic Analytics Dashboard', 'Traffic analytics dashboard'],
    [7, 3, '15.Secure Data Encryption & Integrity Verification', 'Secure data encryption & integrity verification'],
    [8, 2, '16.Vulnerability Scanning', 'Vulnerability scanning'],
    [9, 3, '17.Digital Forensics', 'Digital forensics'],
    [10, 2, '18.Integrated Incident Response (Capstone)', 'Integrated incident response (capstone)'],
  ];
  // S3 addresses: spaces become "+", everything else is URL-encoded
  function s3enc(s) { return encodeURIComponent(s).replace(/%20/g, '+'); }
  // [module title, [[file name (no .pptx), lesson title, slides], …], [[question, [4 options], answer index], …]]
  var M = [
    ['Cybersecurity foundations and phishing threat intelligence', [
      ['Module-01_Session-1_Cyber-Foundations-Careers-and-DigiLocker', 'Cyber foundations, careers and DigiLocker', 41],
      ['Module-01_Session-2_Cybersecurity-Concepts-Threats-and-Defences', 'Cybersecurity concepts, threats and defences', 17],
      ['Module-01_Session-3_Use-Case-Phishing-Threat-Intelligence', 'Use case: phishing threat intelligence', 25]], [
      ['Which security features protect a DigiLocker account?', ['Only a username', 'OTP-based multi-factor authentication and a 6-digit PIN', 'A shared family password', 'No login is needed'], 1],
      ['What does ransomware do?', ['Speeds up your computer', 'Backs up your files', 'Encrypts your files and demands payment', 'Blocks spam email'], 2],
      ['Why is multi-factor authentication (MFA) important?', ['The account stays secure even if the password leaks', 'It removes the need for passwords', 'It makes the internet faster', 'It deletes old emails'], 0],
      ['In email header analysis, what does SPF check?', ['The font used in the email', 'The size of the attachment', 'The reader’s location', 'Whether the sending server is allowed to send email for that domain'], 3],
      ['A DMARC policy set to “Reject” means the receiving server will…', ['Only monitor the email', 'Send the email to spam', 'Block the email', 'Forward it to the admin'], 2]]],
    ['Password attacks, MFA and credential vaults', [
      ['Module-02_Session-1_Password-Attacks-and-Why-Credentials-Matter', 'Password attacks and why credentials matter', 23],
      ['Module-02_Session-2_MFA-Credential-Vaults-and-Bitwarden-Lab', 'MFA, credential vaults and Bitwarden lab', 20]], [
      ['Trying one common password (like “Welcome@123”) against many accounts is called…', ['Brute force', 'Password spraying', 'Keylogging', 'Steganography'], 1],
      ['Credential stuffing works because users…', ['Reuse the same password on many sites', 'Use Wi-Fi at home', 'Use old printers', 'Have slow internet'], 0],
      ['A program that secretly records every key a user types is a…', ['Firewall', 'Router', 'Password manager', 'Keylogger'], 3],
      ['Bitwarden’s zero-knowledge encryption means…', ['Passwords are stored in plain text', 'Anyone can read the vault', 'Data is encrypted on your device, so even Bitwarden’s servers cannot read it', 'The vault needs no master password'], 2],
      ['A brute force attack succeeds most easily against…', ['Short passwords on a system with no account lockout', 'Long random passwords with MFA', 'Hardware security keys', 'Encrypted hard disks'], 0]]],
    ['Networks, topologies and VPNs', [
      ['Module-03_Session-1_Networks-LAN-WAN-and-TCP-IP', 'Networks: LAN, WAN and TCP/IP', 21],
      ['Module-03_Session-2_Network-Topologies', 'Network topologies', 23],
      ['Module-03_Session-3_VPN-Concepts-and-Cisco-Packet-Tracer', 'VPN concepts and Cisco Packet Tracer', 24]], [
      ['A switch works at which layer, using which address?', ['Layer 3, using IP addresses', 'Layer 2 (Data Link), using MAC addresses', 'Layer 7, using URLs', 'Layer 1, using voltages only'], 1],
      ['Which transport protocol is used for fast traffic like video streaming and online gaming?', ['TCP', 'FTP', 'UDP', 'SMTP'], 2],
      ['In which topology is every device connected directly to every other device?', ['Bus', 'Star', 'Ring', 'Full mesh'], 3],
      ['In a star topology, what happens if the central hub or switch fails?', ['The whole network is disrupted', 'Only one PC stops working', 'Nothing changes', 'The network gets faster'], 0],
      ['Which VPN type securely connects branch offices to each other over the internet?', ['Remote access VPN', 'Site-to-site VPN', 'Browser plug-in', 'Public hotspot'], 1]]],
    ['Firewalls, security zones and access control', [
      ['Module-04_Session-1_Firewall-Concepts-Types-and-Rules', 'Firewall concepts, types and rules', 22],
      ['Module-04_Session-2_Security-Zones-Access-Control-and-Wireless-Use-Case', 'Security zones, access control and wireless use case', 24]], [
      ['Which firewall keeps a session table and only allows packets that belong to a valid connection?', ['Stateful inspection firewall', 'Stateless packet filter', 'Network hub', 'Wi-Fi repeater'], 0],
      ['A firewall’s default “implicit deny” rule means…', ['Allow all traffic', 'Block any traffic that is not explicitly allowed', 'Turn off logging', 'Restart the router every night'], 1],
      ['Where should a public website or mail server be placed?', ['In the management zone', 'Inside the internal database network', 'In the DMZ (semi-trusted subzone)', 'On the admin’s laptop'], 2],
      ['Outbound firewall rules mainly help to…', ['Stop power cuts', 'Prevent disk failure', 'Reduce screen glare', 'Prevent data exfiltration and block unwanted services'], 3],
      ['In access control, what does authorization decide?', ['Who the user claims to be', 'What the user is allowed to do after logging in', 'Which Wi-Fi channel to use', 'When the user logs off'], 1]]],
    ['Wireless security', [
      ['Module-05_Session-1_Wireless-Security-Basics-and-Protocols', 'Wireless security basics and protocols', 27],
      ['Module-05_Session-2_Wi-Fi-Threats-and-Hardening', 'Wi-Fi threats and hardening', 19],
      ['Module-05_Session-3_Use-Case-Secure-Wireless-Deployment', 'Use case: secure wireless deployment', 14]], [
      ['Which Wi-Fi protocol uses RC4 with one shared key and is considered completely insecure today?', ['WPA3', 'WPA2', 'WEP', 'WPA2-Enterprise'], 2],
      ['Which encryption does WPA2 use?', ['AES', 'RC4', 'DES', 'MD5'], 0],
      ['The KRACK attack exploits a weakness in…', ['Printer drivers', 'USB ports', 'The computer’s BIOS', 'The WPA2 handshake'], 3],
      ['What is an Evil Twin attack?', ['A virus that copies itself', 'A fake access point that copies a real network’s name', 'Two routers on one network', 'A backup Wi-Fi password'], 1],
      ['In HotSpotWhiz, what does a risk score of 81–100 mean?', ['Very safe for banking', 'Minor risks only', 'Medium risk', 'Very high risk: dangerous, an attack is likely'], 3]]],
    ['IoT, cloud, SIEM, IDS/IPS and traffic analysis', [
      ['Module-06_Session-1_IoT-Cloud-Security-SIEM-and-IDS-IPS', 'IoT and cloud security, SIEM and IDS/IPS', 27],
      ['Module-06_Session-2_Packet-Capture-and-Network-Traffic-Analysis', 'Packet capture and network traffic analysis', 23],
      ['Module-06_Session-3_Use-Case-Traffic-Analytics-Dashboard', 'Use case: traffic analytics dashboard', 13]], [
      ['What is the main difference between an IDS and an IPS?', ['An IDS only alerts; an IPS sits inline and blocks threats', 'An IDS blocks; an IPS only alerts', 'They are the same thing', 'An IPS is only for printers'], 0],
      ['Mirai is an example of…', ['A firewall', 'IoT botnet malware', 'A VPN protocol', 'A hash algorithm'], 1],
      ['What does a SIEM do?', ['Stores videos', 'Replaces the router', 'Collects logs from firewalls, servers, cloud and more in one place and raises alerts', 'Encrypts Wi-Fi'], 2],
      ['Which port does HTTPS normally use?', ['21', '22', '3389', '443'], 3],
      ['Very high DNS traffic to long random domain names may indicate…', ['Normal printing', 'DNS tunneling or malware command-and-control', 'A full hard disk', 'Strong passwords'], 1]]],
    ['Cryptography, encryption and hashing', [
      ['Module-07_Session-1_Cryptographic-Attacks-and-Steganography', 'Cryptographic attacks and steganography', 21],
      ['Module-07_Session-2_Encryption-Decryption-and-Hashing', 'Encryption, decryption and hashing', 18],
      ['Module-07_Session-3_Use-Case-Data-Encryption-and-Integrity-with-CyberChef', 'Use case: data encryption and integrity with CyberChef', 12]], [
      ['Which of these is a symmetric encryption algorithm (same key to encrypt and decrypt)?', ['RSA', 'AES', 'SHA-256', 'MD5'], 1],
      ['In RSA, which key is used to decrypt?', ['The public key', 'The IV', 'The hash value', 'The private key'], 3],
      ['Rainbow table attacks do not work well against…', ['Short passwords', 'Unsalted MD5 hashes', 'Salted hashes', 'Plain-text passwords'], 2],
      ['Why is an IV (initialization vector) used with AES?', ['So the same plaintext does not produce the same ciphertext', 'To make the file smaller', 'To remove the need for a key', 'To compress images'], 0],
      ['What is steganography?', ['Breaking passwords', 'A type of firewall', 'Hiding data inside other data, such as an image', 'Scanning ports'], 2]]],
    ['Vulnerabilities, OWASP Top 10 and port scanning', [
      ['Module-08_Session-1_Vulnerabilities-and-OWASP-Top-10', 'Vulnerabilities and OWASP Top 10', 19],
      ['Module-08_Session-2_Port-Scanning-Risk-Prioritization-and-Nmap-Use-Case', 'Port scanning, risk prioritisation and Nmap use case', 23]], [
      ['What is OWASP?', ['A non-profit that improves web application security', 'A computer virus', 'A firewall brand', 'An operating system'], 0],
      ['What can an SQL injection attack do?', ['Speed up the database', 'Extract database records by running untrusted input', 'Encrypt the website', 'Block port scans'], 1],
      ['Port 3389 is used by…', ['SSH', 'FTP', 'RDP (Remote Desktop)', 'HTTPS'], 2],
      ['In an Nmap scan, a “filtered” port means…', ['A service is running', 'No service is running', 'The port is encrypted', 'A firewall is blocking it'], 3],
      ['Which port is a common ransomware target (e.g. WannaCry) and should never be open to the internet?', ['445 (SMB)', '80 (HTTP)', '443 (HTTPS)', '53 (DNS)'], 0]]],
    ['Digital forensics and malware analysis', [
      ['Module-09_Session-1_Forensics-Foundations-Metadata-and-File-Artifacts', 'Forensics foundations, metadata and file artifacts', 24],
      ['Module-09_Session-2_Malware-Analysis-and-Indicators-of-Compromise', 'Malware analysis and indicators of compromise', 20],
      ['Module-09_Session-3_Use-Case-Forensics-and-Malware-Analysis', 'Use case: forensics and malware analysis', 15]], [
      ['Which is an example of volatile evidence?', ['Files on the hard disk', 'Data in RAM, which is lost at shutdown', 'A printed report', 'A USB drive in a drawer'], 1],
      ['Metadata means…', ['Data about data, such as file owner and created date', 'Deleted data', 'Encrypted data', 'Very large data'], 0],
      ['An Indicator of Compromise (IoC) is…', ['A new firewall rule', 'A strong password', 'Evidence that a system may have been compromised, such as a malware hash', 'A type of network cable'], 2],
      ['Where does Hybrid Analysis run a suspicious file?', ['On your own computer', 'On the web server', 'Inside the email', 'Inside an isolated sandbox virtual machine'], 3],
      ['Why is the EICAR test file used in training?', ['It is real ransomware', 'It is harmless but every antivirus detects it, so analysis can be practised safely', 'It speeds up scans', 'It repairs infected files'], 1]]],
    ['Cloud IAM and incident response', [
      ['Module-10_Session-1_Cloud-Security-and-Identity-and-Access-Management', 'Cloud security and identity and access management', 20],
      ['Module-10_Session-2_Incident-Response-Lifecycle', 'Incident response lifecycle', 17]], [
      ['In the cloud shared responsibility model, who secures identities (IAM), data and configurations?', ['The cloud provider', 'The customer', 'Nobody', 'The internet provider'], 1],
      ['The principle of least privilege means…', ['Everyone gets admin rights', 'Passwords are never changed', 'Users get only the minimum access they need for their work', 'Access is never logged'], 2],
      ['Single Sign-On (SSO) lets a user…', ['Log in once and use many apps', 'Never use a password', 'Share one account with the team', 'Skip MFA forever'], 0],
      ['Which is the first phase of the incident response lifecycle?', ['Containment', 'Recovery', 'Lessons learned', 'Preparation'], 3],
      ['Isolating an infected VM (instead of deleting it) happens in which phase?', ['Eradication', 'Containment', 'Preparation', 'Identification'], 1]]],
  ];
  // capstone projects (learner-journey.js): mods = module numbers the project needs
  w.CAPS = w.CAPS || {};
  w.CAPS[6] = [
    { id: 'phish', e: '🎣', t: 'Phishing investigation and email defence report', mods: [1, 2, 6],
      brief: 'Investigate a suspicious email from start to finish and write the report a SOC team would send.',
      out: ['An email header analysis (SPF, DKIM, DMARC) with your verdict', 'A list of indicators of compromise to block', 'An awareness and MFA checklist for staff'],
      tools: ['Email headers', 'Threat intelligence lookups', 'MFA'],
      steps: ['Collect the email and its full headers', 'Check SPF, DKIM and DMARC results', 'Look up the links and sender in threat intelligence', 'List the IoCs and the blocking steps', 'Write the report and a staff checklist'] },
    { id: 'secnet', e: '🔥', t: 'Secure small-office network with firewall and VPN', mods: [3, 4, 5],
      brief: 'Build a small-office network in Cisco Packet Tracer with security zones, firewall rules, secure Wi-Fi and a VPN.',
      out: ['A network split into internal, DMZ and guest zones', 'Firewall rules with implicit deny, tested and documented', 'WPA2/WPA3 wireless and a working VPN for remote staff'],
      tools: ['Cisco Packet Tracer', 'ASA firewall', 'VPN', 'Wireless security'],
      steps: ['Draw the topology and the security zones', 'Configure the firewall rules and the DMZ', 'Secure the wireless network', 'Set up the VPN and test it', 'Document every rule and why it exists'] },
    { id: 'soc', e: '📊', t: 'Mini SOC: traffic monitoring dashboard', mods: [3, 6, 8],
      brief: 'Capture network traffic, build a dashboard of what is normal, and flag what is not.',
      out: ['Packet captures with a summary of normal traffic', 'A dashboard of top talkers, ports and protocols', 'Three alerts with what triggered them and the response'],
      tools: ['Wireshark', 'Traffic analytics dashboard', 'IDS/IPS basics'],
      steps: ['Capture traffic in the lab', 'Summarise normal ports and protocols', 'Build the dashboard', 'Run a port scan and spot it in the data', 'Write the alert and response notes'] },
    { id: 'vuln', e: '🛠️', t: 'Vulnerability assessment of a test lab', mods: [3, 7, 8],
      brief: 'Scan a test lab for open ports and weaknesses, rank the risks and recommend fixes.',
      out: ['An Nmap scan of the lab with open, closed and filtered ports', 'Findings mapped to the OWASP Top 10 where they apply', 'A prioritised fix list with encryption and hardening advice'],
      tools: ['Nmap', 'OWASP Top 10', 'CyberChef'],
      steps: ['Agree the scope of the test lab', 'Run the port and service scan', 'Check findings against OWASP and known issues', 'Rank each risk by impact and likelihood', 'Write the report with fixes'] },
    { id: 'ir', e: '🚨', t: 'Integrated incident response and forensics', mods: [1, 6, 9, 10],
      brief: 'Handle a simulated malware incident end to end: detect, contain, investigate and report.',
      out: ['An incident timeline from the logs and evidence', 'Containment and eradication steps you carried out', 'A final incident report with lessons learned'],
      tools: ['SIEM basics', 'Forensic tools', 'Incident response lifecycle'],
      steps: ['Spot the alert and confirm the incident', 'Contain the affected machine', 'Collect evidence and analyse the malware safely', 'Remove the threat and recover', 'Write the report and lessons learned'] },
  ];
  w.CYBER_CUR = M.map(function (m, i) {
    var k = i + 1, ls = [];
    m[1].forEach(function (p, j) {
      ls.push({ u: 'm' + k + 's' + (j + 1), ty: 'doc', t: 'PPT ' + (j + 1) + ': ' + p[1], du: p[2] + ' slides', url: BASE + p[0] + '.pptx', tx: '' });
      VIDEOS.forEach(function (v) {
        if (v[0] != k || v[1] != j + 1) return;
        var n = parseInt(v[2], 10);
        ls.push({ u: 'm' + k + 'v' + n, ty: 'video', t: 'Video ' + n + ': ' + v[3], du: '', url: VBASE + s3enc(v[2]) + '.mp4', tx: '' });
      });
    });
    return {
      u: 'm' + k, t: m[0],
      ls: ls,
      qs: m[2].map(function (q) { return { q: q[0], o: q[1], a: q[2] }; }),
    };
  });
})(window);

/* ingage EduTech – course overview shown at the top of every course page:
 *   a short description, an introduction to the business side the course covers ("how it is used in business"),
 *   the main topics and the practical outcomes.
 * Add an entry here when you add a course. A course without one still gets an overview from its own data
 * (summary, industry text, modules and outcomes).
 * Loaded before site-features.js.
 */
(function (w) {
  'use strict';
  w.COURSE_OVERVIEW = {
    1: { intro: 'A hands-on course that takes you from networking basics to running a small business network: routers and switches, network services, Windows Server, Active Directory, VPN and Linux. You practise every topic in Packet Tracer, GNS3 and virtual labs.',
      biz: 'Every office, bank, hospital and shop runs on its network; when it stops, work stops. Companies need people who plan addresses, set up servers and user access, secure remote work and fix problems quickly. The course follows that flow the way a real company runs it: plan, build, give access, secure, monitor and troubleshoot.' },
    2: { intro: 'Learn electronics by building and testing circuits in Tinkercad with Arduino, then design real printed circuit boards in KiCad, from schematic to the files a factory needs.',
      biz: 'Every electronic product is built on a PCB. A board that works first time and is easy to manufacture saves money and time to market, so companies rely on design checks (ERC and DRC), the right components and clean manufacturing files (Gerber, drill and BOM). The course follows that path: prototype, schematic, layout, check and hand over to manufacturing.' },
    3: { intro: 'Process airborne and ground LiDAR data into terrain models, contours and slope maps.',
      biz: 'Planners, mining and infrastructure companies decide where to build, dig or drain using accurate terrain data. LiDAR collects that data faster and more safely than ground surveys, which saves survey time and reduces project risk.' },
    4: { intro: 'Build interactive AR and VR experiences in Unity, from 3D scenes and interactions to mobile AR apps.',
      biz: 'Companies use AR and VR to train staff safely, show products before they are built and present property or designs remotely. That cuts training costs, travel and rework, and helps customers decide faster.' },
    5: { intro: 'Build live virtual copies of real systems: simulate an ESP32 with sensors, send the data to the cloud with ThingSpeak, model in Blender and show it in Unity with AR, VR and AI avatars.',
      biz: 'A digital twin lets a business watch its machines, buildings or plants live, spot problems before they cause downtime and test changes on the model before touching the real thing. Fewer breakdowns, less energy waste and better decisions are where the savings come from. The course follows the same chain: sensors, cloud data, 3D model, live view, insight.' },
    6: { intro: 'Learn how attacks work and how to defend against them: phishing, passwords and MFA, networks, firewalls, wireless, cryptography, vulnerability scanning, digital forensics and incident response, with hands-on labs.',
      biz: 'One breach can stop a business, leak customer data and bring fines and lost trust. Companies invest in security to reduce that risk: block attacks early, find weaknesses before attackers do, and respond fast when something goes wrong. The course follows the way a security team works: understand the threat, protect, detect, investigate and respond.' },
    7: { intro: 'Build Android and iOS apps from one codebase with Flutter and Dart: screens and layouts, state management, navigation, APIs, offline storage, theming, animations and device features such as camera and location.',
      biz: 'For many businesses the app is where customers order, pay and get support. Flutter lets one team ship to Android and iOS together, which cuts development cost. A good app loads data from the company’s servers, keeps working when the network drops and handles errors without losing the customer, which is what this course teaches.' },
    8: { intro: 'Understand electric vehicles from battery to wheels: EV types, motors and power electronics, charging standards and stations, powertrains and battery management systems, with Tinkercad practicals.',
      biz: 'EV makers, fleet operators and charging networks earn by keeping vehicles safe, efficient and charged. That depends on choosing the right powertrain, sizing chargers to a site’s electrical capacity, charging smartly to avoid peak costs, and battery systems that protect expensive packs and extend their life.' },
  };
})(window);

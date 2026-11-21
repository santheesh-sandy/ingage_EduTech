/* ingage EduTech – Digital Twin curriculum (course 5)
 * 11 modules · 23 slide decks · 11 videos · one 5-question MCQ test per module · 5 capstone projects.
 * Lesson titles come from the file names. Each video is placed after the deck whose topic matches its name (VIDEOS below).
 * Files are on Amazon S3 (folder "Digital_Twin"):
 *   slides  <base>Slides/<file name>.pptx   (shown in the lesson with the Office Online viewer)
 *   videos  <base>Videos/<file name>.mp4    (played in the site's own player; a file not uploaded yet shows a note)
 * Loaded before the main script in index.html, so the course list (var C) can use it.
 */
(function (w) {
  'use strict';
  var BASE = 'https://ingage-lms.s3.ap-south-1.amazonaws.com/Digital_Twin/';
  function s3enc(s) { return encodeURIComponent(s).replace(/%20/g, '+'); }
  // [module, after deck, S3 file name exactly as uploaded (no .mp4), lesson title]
  var VIDEOS = [
    [2, 2, 'Video 1 - Introduction of Wokwi and sensor', 'Video 1: Introduction to Wokwi and sensors'],
    [4, 2, 'Video 2 -  Thingspeak Creating Account', 'Video 2: Creating a ThingSpeak account'],
    [4, 2, 'Video 3 - Thingspeak with Wokwi', 'Video 3: ThingSpeak with Wokwi'],
    [5, 2, 'Video 4 - Blender', 'Video 4: Blender'],
    [6, 1, 'Video 5 Free online platform used', 'Video 5: Free online platforms used'],
    [7, 1, 'Video 7 Unity Installation', 'Video 7: Unity installation'],
    [7, 2, 'Video 10 - Occulues', 'Video 10: Oculus'],
    [7, 3, 'Video 8 Unity Part_1', 'Video 8: Unity (part 1)'],
    [7, 3, 'Video 8 Unity Part_2', 'Video 8: Unity (part 2)'],
    [9, 1, 'Video 9- Working with Particles', 'Video 9: Working with particles'],
    [10, 1, 'Video 6 - Convai AI Avatar', 'Video 6: Convai AI avatar'],
  ];
  // [module title, [[slide file name (no .pptx), lesson title], …], [[question, [4 options], answer index], …]]
  var M = [
    ['Introduction to digital twins', [
      ['Module-01_Session-1_Introduction-to-Digital-Twin', 'Introduction to digital twins'],
      ['Module-01_Session-2_Evolution-Components-Benefits-and-Challenges', 'Evolution, components, benefits and challenges']], [
      ['What is a digital twin?', ['A backup copy of a hard disk', 'A virtual model of a real object or system that is kept up to date with its data', 'A second phone number', 'A 3D printer'], 1],
      ['Which three parts make up a digital twin?', ['The physical object, its virtual model and the data link between them', 'A keyboard, mouse and screen', 'A router, switch and firewall', 'A camera, lens and tripod'], 0],
      ['Which is a common benefit of a digital twin in a factory?', ['Higher electricity bills', 'Slower production', 'Predicting failures before they happen (predictive maintenance)', 'Removing all sensors'], 2],
      ['Which is a common challenge when building a digital twin?', ['It needs no data', 'It always works offline', 'It cannot use 3D', 'Collecting reliable data and keeping it secure'], 3],
      ['What keeps a digital twin in sync with the real object?', ['Live data from sensors', 'Printing reports', 'Manual drawings only', 'Email updates once a year'], 0]]],
    ['ESP32 hardware and the Wokwi simulator', [
      ['Module-02_Session-1_ESP32-Hardware-and-Specifications', 'ESP32 hardware and specifications'],
      ['Module-02_Session-2_Wokwi-Simulator-and-Demo-Project', 'Wokwi simulator and demo project']], [
      ['Which wireless features are built into the ESP32?', ['Only infrared', 'Wi-Fi and Bluetooth', 'Only 5G', 'None'], 1],
      ['What is Wokwi?', ['A 3D modelling tool', 'A VR headset', 'An online simulator for microcontroller projects', 'A cloud database'], 2],
      ['At what logic voltage do the ESP32’s GPIO pins work?', ['3.3 V', '12 V', '230 V', '48 V'], 0],
      ['GPIO pins on the ESP32 are used to…', ['Charge the laptop', 'Connect to HDMI screens', 'Store photos', 'Read sensors and control LEDs, motors and other parts'], 3],
      ['Which is a common way to program an ESP32?', ['Microsoft Paint', 'The Arduino IDE', 'A web browser’s history', 'Excel formulas'], 1]]],
    ['Sensors and motors', [
      ['Module-03_Session-1_Sensors-Types-and-Classification', 'Sensors: types and classification'],
      ['Module-03_Session-2_Motors-and-Sensor-Reading-Demos', 'Motors and sensor reading demos']], [
      ['What does a DHT11 or DHT22 sensor measure?', ['Distance', 'Light colour', 'Temperature and humidity', 'Sound level'], 2],
      ['An HC-SR04 ultrasonic sensor measures…', ['Distance', 'Air quality', 'Heart rate', 'Voltage'], 0],
      ['What is the difference between an analog and a digital sensor?', ['There is none', 'Analog sensors need no power', 'Digital sensors are always wireless', 'Analog gives a continuous range of values; digital gives discrete values (such as on/off)'], 3],
      ['Which motor turns to a precise angle, for example 90°?', ['Servo motor', 'Fan motor', 'Washing machine motor', 'Generator'], 0],
      ['A PIR sensor is used to detect…', ['Temperature', 'Motion of people or animals', 'Wi-Fi signals', 'Magnetic fields only'], 1]]],
    ['IoT and the ThingSpeak platform', [
      ['Module-04_Session-1_Introduction-to-IoT', 'Introduction to IoT'],
      ['Module-04_Session-2_ThingSpeak-IoT-Platform', 'ThingSpeak IoT platform']], [
      ['IoT (Internet of Things) means…', ['Only smartphones on the internet', 'Everyday devices with sensors that send and receive data over the internet', 'A new web browser', 'A type of cable'], 1],
      ['What is ThingSpeak?', ['A cloud IoT platform for collecting, storing and visualising sensor data', 'A video editor', 'A 3D game engine', 'A VR headset'], 0],
      ['To send data into a ThingSpeak channel, a device uses the channel’s…', ['Read-only password', 'Email address', 'Write API key', 'Phone number'], 2],
      ['How many data fields can one ThingSpeak channel have?', ['1', '3', '100', '8'], 3],
      ['Which is a good IoT security practice?', ['Share API keys publicly', 'Keep API keys secret and change default passwords', 'Turn off all updates', 'Use one password for every device'], 1]]],
    ['3D modelling with Blender', [
      ['Module-05_Session-1_Blender-Installation-and-Overview', 'Blender installation and overview'],
      ['Module-05_Session-2_Blender-Features-and-Models', 'Blender features and models']], [
      ['What is Blender?', ['A paid CAD tool only for cars', 'A spreadsheet', 'A free, open-source 3D creation tool', 'An IoT platform'], 2],
      ['A 3D mesh is made of…', ['Vertices, edges and faces', 'Pixels only', 'Cells and rows', 'Frames per second'], 0],
      ['Which Blender mode lets you change the individual vertices of a model?', ['Object mode', 'Edit mode', 'Render mode', 'Play mode'], 1],
      ['Which file format is commonly used to bring a Blender model into Unity?', ['PDF', 'MP3', 'DOCX', 'FBX'], 3],
      ['Why are low-poly models preferred for AR/VR apps?', ['They run smoothly on phones and headsets', 'They look more realistic', 'They are bigger files', 'They need no textures ever'], 0]]],
    ['Augmented and virtual reality', [
      ['Module-06_Session-1_Augmented-Reality-Concepts-and-Types', 'Augmented reality: concepts and types'],
      ['Module-06_Session-2_Virtual-Reality-with-Oculus-and-Unity', 'Virtual reality with Oculus and Unity']], [
      ['Augmented reality (AR)…', ['Replaces the real world completely', 'Adds digital content on top of the real world', 'Only works on TVs', 'Needs no camera'], 1],
      ['Virtual reality (VR)…', ['Puts the user inside a fully digital environment', 'Shows text messages', 'Prints 3D objects', 'Only works outdoors'], 0],
      ['Marker-based AR shows content when the camera sees…', ['A Wi-Fi network', 'A loud sound', 'A specific image or marker', 'A GPS signal only'], 2],
      ['Oculus (Meta Quest) is a…', ['Game engine', 'Sensor', 'Microcontroller', 'VR headset'], 3],
      ['“6DoF” tracking in VR means the headset tracks…', ['Only the battery', 'Movement and rotation in all directions', 'Only the volume', 'Only eye colour'], 1]]],
    ['Unity engine, Oculus and VR', [
      ['Module-07_Session-1_Unity-Engine-Setup-and-Interface', 'Unity engine setup and interface'],
      ['Module-07_Session-2_Oculus-and-VR-Integration-in-Unity', 'Oculus and VR integration in Unity'],
      ['Module-07_Session-3_Unity-Tools-and-Asset-Store', 'Unity tools and Asset Store']], [
      ['Which programming language is used for scripts in Unity?', ['Python', 'C#', 'PHP', 'Swift'], 1],
      ['Which Unity window shows and edits the properties of the selected object?', ['Inspector', 'Console', 'Project', 'Game'], 0],
      ['Which Unity window lists all objects in the current scene?', ['Asset Store', 'Profiler', 'Hierarchy', 'Package Manager'], 2],
      ['Every object in a Unity scene is a…', ['Prefab only', 'Texture', 'Shader', 'GameObject'], 3],
      ['The Unity Asset Store is used to…', ['Get ready-made models, scripts and tools for projects', 'Buy VR headsets', 'Host websites', 'Send IoT data'], 0]]],
    ['Unity UI, ThingSpeak and AR builds', [
      ['Module-08_Session-1_Unity-UI-and-ThingSpeak-Integration', 'Unity UI and ThingSpeak integration'],
      ['Module-08_Session-2_AR-Foundation-and-Building-the-APK', 'AR Foundation and building the APK']], [
      ['In Unity, UI elements such as text and buttons are placed on a…', ['Terrain', 'Canvas', 'Light', 'Camera only'], 1],
      ['How can a Unity app read live sensor values from ThingSpeak?', ['By scanning a QR code', 'Through Bluetooth only', 'By calling ThingSpeak’s web API over HTTP', 'It cannot'], 2],
      ['What is AR Foundation?', ['Unity’s framework for building AR apps for Android (ARCore) and iOS (ARKit)', 'A Blender plug-in', 'A sensor', 'A cloud database'], 0],
      ['An APK file is…', ['A 3D model', 'A video', 'A sensor reading', 'An installable Android app package'], 3],
      ['Before building for Android in Unity, you must…', ['Switch the build platform to Android in Build Settings', 'Delete all scripts', 'Turn off the camera', 'Export to PDF'], 0]]],
    ['Animation in Unity', [
      ['Module-09_Session-1_Animation-in-Unity', 'Animation in Unity'],
      ['Module-09_Session-2_Animator-and-Animator-Controller', 'Animator and Animator Controller']], [
      ['An Animation Clip in Unity stores…', ['Sound only', 'Keyframed changes to an object over time', 'Network settings', 'User passwords'], 1],
      ['The Animator Controller works like a…', ['State machine that switches between animation states', 'Spreadsheet', 'Web server', 'Sensor'], 0],
      ['What starts a transition between two animation states?', ['A new scene', 'Restarting Unity', 'A condition on a parameter (such as a trigger or bool)', 'Changing the font'], 2],
      ['Unity’s Particle System is used for effects like…', ['Database queries', 'User login', 'Text input', 'Fire, smoke, sparks and rain'], 3],
      ['Which component plays animations on a GameObject using an Animator Controller?', ['Animator', 'Rigidbody', 'Collider', 'Light'], 0]]],
    ['AI avatars and VR builds', [
      ['Module-10_Session-1_AI-Avatar-and-Convai-Integration', 'AI avatar and Convai integration'],
      ['Module-10_Session-2_Ready-Player-Me-Avatars-and-VR-Build', 'Ready Player Me avatars and VR build']], [
      ['What does Convai add to a Unity project?', ['A 3D printer driver', 'Conversational AI characters that can talk and respond', 'A new physics engine', 'Sensor wiring'], 1],
      ['Ready Player Me is used to…', ['Create customisable 3D avatars', 'Send IoT data', 'Measure humidity', 'Write C# code'], 0],
      ['Lip sync on an avatar means…', ['The avatar changes colour', 'The avatar walks', 'The mouth moves in time with the speech', 'The avatar disappears'], 2],
      ['To run a VR app on a standalone Meta Quest headset, Unity builds for…', ['Windows only', 'iOS', 'Web pages', 'Android'], 3],
      ['Why add an AI avatar to a digital twin?', ['To guide users and answer questions about the system in natural language', 'To slow the app down', 'To replace all sensors', 'To remove the 3D model'], 0]]],
    ['Real-time data, processing and AI/ML', [
      ['Module-11_Session-1_Data-Acquisition-and-Real-time-Streaming', 'Data acquisition and real-time streaming'],
      ['Module-11_Session-2_Data-Processing-and-AI-ML-Integration', 'Data processing and AI/ML integration']], [
      ['Data acquisition means…', ['Deleting old data', 'Collecting data from sensors and devices', 'Buying a database', 'Drawing charts by hand'], 1],
      ['Which lightweight protocol is widely used to stream IoT sensor data in real time?', ['MQTT', 'FTP', 'SMTP', 'POP3'], 0],
      ['Why is sensor data cleaned before analysis?', ['To make files bigger', 'To add random values', 'To remove errors, gaps and noise that would mislead results', 'It is never needed'], 2],
      ['Which machine learning task spots unusual readings that may mean a fault?', ['Image compression', 'Spell checking', 'Sorting files', 'Anomaly detection'], 3],
      ['Edge computing means processing data…', ['Close to where it is produced, on or near the device', 'Only on paper', 'Only once a year', 'Only in a different country'], 0]]],
  ];
  w.DT_CUR = M.map(function (m, i) {
    var k = i + 1, ls = [];
    m[1].forEach(function (p, j) {
      ls.push({ u: 'm' + k + 's' + (j + 1), ty: 'doc', t: 'PPT ' + (j + 1) + ': ' + p[1], du: '', url: BASE + 'Slides/' + s3enc(p[0]) + '.pptx', tx: '' });
      VIDEOS.forEach(function (v, n) {
        if (v[0] == k && v[1] == j + 1) ls.push({ u: 'm' + k + 'v' + (n + 1), ty: 'video', t: v[3], du: '', url: BASE + 'Videos/' + s3enc(v[2]) + '.mp4', tx: '' });
      });
    });
    return { u: 'm' + k, t: m[0], ls: ls, qs: m[2].map(function (q) { return { q: q[0], o: q[1], a: q[2] }; }) };
  });

  // capstone projects (learner-journey.js): mods = module numbers the project needs
  w.CAPS = w.CAPS || {};
  w.CAPS[5] = [
    { id: 'room', e: '🌡️', t: 'Smart room twin: live temperature and humidity in 3D', mods: [2, 3, 4, 7, 8],
      brief: 'Simulate an ESP32 with a DHT sensor in Wokwi, send readings to ThingSpeak and show them live on a 3D room in Unity.',
      out: ['A Wokwi ESP32 circuit sending readings every few seconds', 'A ThingSpeak channel with live charts', 'A Unity scene that shows the live values on a 3D room'],
      tools: ['ESP32', 'Wokwi', 'ThingSpeak', 'Unity'],
      steps: ['Build the sensor circuit in Wokwi', 'Send the data to a ThingSpeak channel', 'Model or import a simple room', 'Read ThingSpeak in Unity and show the values', 'Add a colour change when it gets too hot'] },
    { id: 'machine', e: '⚙️', t: 'Machine health twin with alerts', mods: [3, 4, 11],
      brief: 'Watch a simulated motor’s temperature and vibration, and flag readings that look like a coming fault.',
      out: ['A data stream from simulated sensors', 'Cleaned data with simple anomaly rules', 'Alerts and a short maintenance recommendation'],
      tools: ['Sensors', 'ThingSpeak', 'Data processing'],
      steps: ['Choose the sensors to watch', 'Stream the readings to the cloud', 'Clean the data and set normal ranges', 'Flag unusual readings', 'Write the alert and maintenance plan'] },
    { id: 'factory', e: '🏭', t: '3D factory line in Blender and Unity', mods: [5, 7, 9],
      brief: 'Model a small production line in Blender, bring it into Unity and animate it running.',
      out: ['Low-poly models of the machines', 'A Unity scene with the line laid out', 'Animations and particle effects showing it working'],
      tools: ['Blender', 'Unity', 'Animator', 'Particle System'],
      steps: ['Sketch the line and its machines', 'Model them in Blender', 'Export to FBX and set up the Unity scene', 'Animate the moving parts', 'Add particle effects and a camera tour'] },
    { id: 'ar', e: '📱', t: 'AR app showing live sensor data', mods: [4, 6, 8],
      brief: 'Build an Android AR app that places a 3D device on a table and shows its live sensor values next to it.',
      out: ['An AR Foundation scene that places a model on a surface', 'Live values read from ThingSpeak', 'An installable APK you can demo on a phone'],
      tools: ['Unity', 'AR Foundation', 'ThingSpeak', 'Android'],
      steps: ['Set up AR Foundation in Unity', 'Place a 3D model on a detected surface', 'Read live data from ThingSpeak', 'Show it on a UI panel in AR', 'Build and test the APK'] },
    { id: 'vr', e: '🥽', t: 'VR digital twin with an AI guide', mods: [6, 7, 10],
      brief: 'Create a VR walkthrough of a facility where an AI avatar explains each machine to the visitor.',
      out: ['A VR scene that runs on a Meta Quest headset', 'A Ready Player Me avatar with Convai conversation', 'A guided tour with at least three stops'],
      tools: ['Unity', 'Oculus / Meta Quest', 'Convai', 'Ready Player Me'],
      steps: ['Set up a Unity VR project for Quest', 'Build or import the facility scene', 'Add the avatar and connect Convai', 'Script the tour stops', 'Build to the headset and test'] },
  ];
})(window);

/* ingage EduTech – EV Technology curriculum (course 8)
 * 6 modules · 14 slide decks · 10 videos ("LMS - EV - Part 1 … 10") · one 5-question MCQ test per module · 5 capstone projects.
 * Lesson titles come from the file names. The file names do not say which module each video belongs to, so the parts are
 * placed in order (VIDEO_MODULE below); change a number there to move a video.
 * Files are on Amazon S3:
 *   slides  <base>Slides/<file name>.pptx   (shown in the lesson with the Office Online viewer)
 *   videos  <base>Videos/<file name>.mp4    (played in the site's own player)
 * Loaded before the main script in index.html, so the course list (var C) can use it.
 */
(function (w) {
  'use strict';
  var BASE = 'https://ingage-lms.s3.ap-south-1.amazonaws.com/EV+Technology/';
  function s3enc(s) { return encodeURIComponent(s).replace(/%20/g, '+'); }
  // video part number → module number
  var VIDEO_MODULE = { 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4, 9: 5, 10: 6 };
  // [module title, [[slide file name (no .pptx), lesson title], …], [[question, [4 options], answer index], …]]
  var M = [
    ['EV basics, motors, power electronics and batteries', [
      ['Module-01_Session-1_Overview-of-EVs-Types-and-Industry', 'Overview of EVs: types and industry'],
      ['Module-01_Session-2_Motors-Power-Electronics-and-Battery-Technologies', 'Motors, power electronics and battery technologies'],
      ['Module-01_Session-3_Practical-Boost-Converter-in-Tinkercad', 'Practical: boost converter in Tinkercad']], [
      ['What does BEV stand for?', ['Battery Electric Vehicle', 'Basic Engine Vehicle', 'Bi-fuel Electric Vehicle', 'Battery Exchange Vehicle'], 0],
      ['A plug-in hybrid (PHEV) has…', ['Only a petrol engine', 'An engine and a battery that can be charged from the grid', 'No battery', 'Only a fuel cell'], 1],
      ['What does a boost converter do?', ['Lowers DC voltage', 'Turns DC into AC', 'Raises a DC voltage to a higher DC voltage', 'Stores charge for years'], 2],
      ['Which battery chemistry is most common in today’s EVs?', ['Lead-acid', 'Nickel-cadmium', 'Alkaline', 'Lithium-ion'], 3],
      ['Which free online tool is used in this module to build and simulate circuits?', ['Tinkercad', 'Photoshop', 'Excel', 'AutoCAD only'], 0]]],
    ['EV charging basics, standards and power hardware', [
      ['Module-02_Session-1_EV-Charging-Basics-Levels-and-Chargers', 'EV charging basics: levels and chargers'],
      ['Module-02_Session-2_Charging-Standards-and-Infrastructure-Challenges', 'Charging standards and infrastructure challenges'],
      ['Module-02_Session-3_Practical-MOSFET-Hardware', 'Practical: MOSFET hardware']], [
      ['DC fast charging is faster mainly because…', ['It uses thinner cables', 'It supplies DC power straight to the battery at high power, bypassing the car’s onboard charger', 'It only works at night', 'It uses a smaller battery'], 1],
      ['The device inside the car that converts AC from a normal socket into DC for the battery is the…', ['Inverter', 'Motor', 'Onboard charger', 'Brake controller'], 2],
      ['CCS2 is…', ['A battery chemistry', 'A motor type', 'A tyre standard', 'A charging connector standard used for DC fast charging'], 3],
      ['In power electronics, a MOSFET is mainly used as a…', ['Fast electronic switch', 'Battery cell', 'Speaker', 'Fuse'], 0],
      ['Which is a common challenge for public charging infrastructure?', ['Too many chargers everywhere', 'Grid capacity and the cost of installing chargers', 'Cars refusing to charge', 'Batteries that never need charging'], 1]]],
    ['EV powertrain: motors, inverters and controllers', [
      ['Module-03_Session-1_EV-Powertrain-Motors-and-Inverters', 'EV powertrain: motors and inverters'],
      ['Module-03_Session-2_Controllers-Efficiency-and-Powertrain-Architectures', 'Controllers, efficiency and powertrain architectures']], [
      ['What does the inverter do in an EV powertrain?', ['Converts the battery’s DC into AC for the motor', 'Charges the 12 V radio', 'Cools the cabin', 'Measures tyre pressure'], 0],
      ['Which motor type is widely used in EVs for its high efficiency and power density?', ['Steam engine', 'Permanent magnet synchronous motor (PMSM)', 'Two-stroke engine', 'Diesel motor'], 1],
      ['Regenerative braking…', ['Wastes braking energy as heat only', 'Turns off the motor', 'Uses the motor as a generator to recharge the battery while slowing down', 'Increases tyre wear on purpose'], 2],
      ['The motor controller mainly…', ['Plays music', 'Locks the doors', 'Charges the phone', 'Controls motor speed and torque based on the throttle'], 3],
      ['Powertrain efficiency means…', ['How much of the battery energy reaches the wheels as useful work', 'How fast the car looks', 'The size of the boot', 'The number of seats'], 0]]],
    ['Charging systems, EVSE, smart charging and V2G', [
      ['Module-04_Session-1_Charging-System-Components-Levels-and-Connectors', 'Charging system components, levels and connectors'],
      ['Module-04_Session-2_EVSE-Smart-Charging-V2G-and-Station-Design', 'EVSE, smart charging, V2G and station design']], [
      ['EVSE stands for…', ['Electric Vehicle Supply Equipment', 'Electric Voltage Safety Engine', 'Energy Vehicle Storage Element', 'Electric Valve Supply Exchange'], 0],
      ['What does V2G (vehicle-to-grid) allow?', ['Charging only at petrol pumps', 'Sending energy from the car battery back to the grid', 'Driving without a battery', 'Using the car as a Wi-Fi router'], 1],
      ['Smart charging can…', ['Charge at any power with no limits', 'Disconnect the car permanently', 'Shift charging to times when the grid has spare capacity or power is cheaper', 'Remove the need for cables'], 2],
      ['When planning a charging station, an important first step is…', ['Picking the paint colour', 'Choosing a car brand', 'Buying a generator only', 'Checking the available electrical load and grid connection'], 3],
      ['Which protocol is commonly used to connect chargers to a central management system?', ['OCPP', 'HTTP only', 'FTP', 'SMTP'], 0]]],
    ['Battery management systems: fundamentals and hardware', [
      ['Module-05_Session-1_BMS-Fundamentals-SOC-and-SOH', 'BMS fundamentals: SOC and SOH'],
      ['Module-05_Session-2_BMS-Hardware-Safety-and-Integration', 'BMS hardware, safety and integration']], [
      ['SOC (state of charge) tells you…', ['How much charge is left in the battery, as a percentage', 'How old the battery is', 'The battery’s brand', 'The charger’s voltage'], 0],
      ['SOH (state of health) describes…', ['The current speed', 'The battery’s condition and remaining capacity compared to when new', 'The cabin temperature', 'The charging cable length'], 1],
      ['Coulomb counting estimates SOC by…', ['Weighing the battery', 'Counting the cells', 'Measuring the current flowing in and out over time', 'Checking the colour of the battery'], 2],
      ['Which is a key safety job of a BMS?', ['Changing radio stations', 'Choosing the route', 'Locking the boot', 'Protecting cells from over-voltage, under-voltage, over-current and over-temperature'], 3],
      ['Thermal runaway is…', ['A chain reaction where a cell overheats uncontrollably and can catch fire', 'A cooling method', 'A charging standard', 'A type of motor'], 0]]],
    ['BMS thermal management, balancing and communication', [
      ['Module-06_Session-1_BMS-Thermal-Management-Balancing-and-Hardware', 'BMS thermal management, balancing and hardware'],
      ['Module-06_Session-2_BMS-Communication-Safety-and-Trends', 'BMS communication, safety and trends']], [
      ['Why does a battery pack need cell balancing?', ['To make the pack heavier', 'To keep all cells at a similar charge so none is over- or under-charged', 'To change the battery colour', 'To charge faster than the charger allows'], 1],
      ['Passive balancing works by…', ['Moving energy between cells with inductors', 'Adding new cells', 'Burning off extra charge from the highest cells as heat through resistors', 'Heating the whole pack'], 2],
      ['Which network is most commonly used for the BMS to talk to other controllers in the vehicle?', ['Bluetooth only', 'CAN bus', 'USB', 'HDMI'], 1],
      ['Liquid cooling of a battery pack is used to…', ['Keep cells in their safe temperature range during fast charging and heavy use', 'Make the car quieter', 'Wash the battery', 'Increase cell voltage'], 0],
      ['Lithium-ion cells generally perform and age best when kept…', ['Below freezing', 'Above 80 °C', 'In direct sunlight', 'Within a moderate temperature range, roughly 15–35 °C'], 3]]],
  ];
  w.EV_CUR = M.map(function (m, i) {
    var k = i + 1, ls = m[1].map(function (p, j) {
      return { u: 'm' + k + 's' + (j + 1), ty: 'doc', t: 'PPT ' + (j + 1) + ': ' + p[1], du: '', url: BASE + 'Slides/' + s3enc(p[0]) + '.pptx', tx: '' };
    });
    Object.keys(VIDEO_MODULE).map(Number).sort(function (a, b) { return a - b; }).forEach(function (n) {
      if (VIDEO_MODULE[n] == k) ls.push({ u: 'm' + k + 'v' + n, ty: 'video', t: 'Video: Part ' + n, du: '', url: BASE + 'Videos/' + s3enc('LMS - EV - Part ' + n) + '.mp4', tx: '' });
    });
    return { u: 'm' + k, t: m[0], ls: ls, qs: m[2].map(function (q) { return { q: q[0], o: q[1], a: q[2] }; }) };
  });

  // capstone projects (learner-journey.js): mods = module numbers the project needs
  w.CAPS = w.CAPS || {};
  w.CAPS[8] = [
    { id: 'boost', e: '⚡', t: 'Boost converter design and simulation', mods: [1, 2],
      brief: 'Design a DC-DC boost converter for an EV auxiliary supply in Tinkercad and test it with a MOSFET switch.',
      out: ['A working boost converter circuit with your component values', 'Measured output voltage at two different duty cycles', 'A short report on efficiency and losses'],
      tools: ['Tinkercad', 'MOSFET', 'Multimeter (simulated)'],
      steps: ['Choose the input and target output voltage', 'Pick the inductor, diode, capacitor and MOSFET', 'Build the circuit in Tinkercad', 'Change the duty cycle and record the output', 'Write up results and losses'] },
    { id: 'station', e: '🔌', t: 'EV charging station plan for a building', mods: [2, 4],
      brief: 'Plan the chargers for an apartment block or office car park: how many, which levels, connectors and load.',
      out: ['A charger mix (AC and DC) with connector types', 'A simple electrical load and smart-charging plan', 'A layout drawing and cost estimate'],
      tools: ['Charging standards', 'Load calculation', 'Station layout'],
      steps: ['Count the vehicles and daily distance', 'Choose charger levels and connectors', 'Check the available electrical load', 'Add smart charging to stay within the load', 'Draw the layout and estimate costs'] },
    { id: 'powertrain', e: '🛵', t: 'Powertrain selection for an electric two-wheeler', mods: [1, 3],
      brief: 'Choose the motor, controller and battery for a city electric scooter and justify each choice.',
      out: ['A motor and controller choice with power and torque figures', 'A battery size for a target range', 'A one-page powertrain architecture diagram'],
      tools: ['Motor and inverter basics', 'Efficiency calculation', 'Block diagrams'],
      steps: ['Set the target speed, range and load', 'Estimate the power and energy needed', 'Pick the motor type and controller', 'Size the battery pack', 'Draw the architecture and check efficiency'] },
    { id: 'bms', e: '🔋', t: 'BMS monitor: SOC, safety limits and balancing', mods: [1, 5, 6],
      brief: 'Design the monitoring logic of a battery management system for a small lithium-ion pack.',
      out: ['An SOC estimate method (coulomb counting) with a worked example', 'Safety limits for voltage, current and temperature', 'A balancing and thermal plan for the pack'],
      tools: ['BMS fundamentals', 'SOC / SOH', 'Cell balancing'],
      steps: ['Define the pack: cells in series and parallel', 'Write the SOC estimation steps', 'Set the protection limits and actions', 'Choose passive or active balancing', 'Plan cooling and the CAN messages to share'] },
    { id: 'v2g', e: '🏙️', t: 'Smart charging and V2G study for a fleet', mods: [2, 4, 6],
      brief: 'Plan when a delivery fleet should charge, and when it could give energy back to the grid.',
      out: ['A charging schedule that avoids peak hours', 'A V2G opportunity estimate with its limits', 'A summary of battery-health trade-offs'],
      tools: ['Smart charging', 'V2G', 'OCPP basics'],
      steps: ['Describe the fleet and its daily routes', 'Map the peak and off-peak hours', 'Build a smart-charging schedule', 'Estimate how much energy V2G could return', 'Note the effects on battery health'] },
  ];

  // course card image (no photo yet): a charging plug and battery on the site's green
  w.EV_IMG = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0f1f3d"/><stop offset="1" stop-color="#3f6a0c"/></linearGradient></defs>' +
    '<rect width="640" height="360" fill="url(#g)"/><circle cx="110" cy="70" r="110" fill="#8dc63f" opacity=".14"/><circle cx="560" cy="310" r="100" fill="#8dc63f" opacity=".16"/>' +
    '<rect x="210" y="110" width="200" height="120" rx="18" fill="#fff"/><rect x="410" y="146" width="18" height="48" rx="6" fill="#fff"/>' +
    '<rect x="226" y="126" width="56" height="88" rx="8" fill="#8dc63f"/><rect x="290" y="126" width="56" height="88" rx="8" fill="#6fa12e"/><rect x="354" y="126" width="40" height="88" rx="8" fill="#edf3fa"/>' +
    '<path d="M318 132 L296 176 H314 L304 210 L338 160 H318 Z" fill="#0f1f3d"/>' +
    '<path d="M180 170 H120 C100 170 92 190 92 210 V250" stroke="#8dc63f" stroke-width="10" fill="none" stroke-linecap="round"/>' +
    '<rect x="72" y="248" width="40" height="34" rx="8" fill="#fff"/><rect x="80" y="282" width="6" height="14" fill="#fff"/><rect x="98" y="282" width="6" height="14" fill="#fff"/></svg>');
})(window);

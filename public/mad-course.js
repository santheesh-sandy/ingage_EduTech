/* ingage EduTech – Mobile App Development curriculum (course 7)
 * 10 modules · 20 slide decks · 10 videos (one "Day" recording per module) · one 5-question MCQ test per module.
 * Lesson titles come from the file names. Modules 8–10 reuse the Day-6 slides (API basics, state management,
 * error handling and offline storage), as the file names say.
 * Files are on Amazon S3:
 *   slides  <base>Slides/<file name>.pptx   (shown in the lesson with the Office Online viewer)
 *   videos  <base>Videos/<file name>.mp4    (played in the site's own player)
 * Loaded before the main script in index.html, so the course list (var C) can use it.
 */
(function (w) {
  'use strict';
  var BASE = 'https://ingage-lms.s3.ap-south-1.amazonaws.com/Mobile+App+Development/';
  function s3enc(s) { return encodeURIComponent(s).replace(/%20/g, '+'); }
  // [module title, [[slide file name (no .pptx), lesson title], …], video file name (no .mp4), [[question, [4 options], answer index], …]]
  var M = [
    ['Mobile app development basics and Flutter setup', [
      ['Module-01_Session-1_Mobile-App-Development-Basics-and-Frameworks', 'Mobile app development basics and frameworks'],
      ['Module-01_Session-2_Flutter-Setup-and-First-App', 'Flutter setup and first app']], 'Day1', [
      ['Which language are Flutter apps written in?', ['Java', 'Dart', 'Swift', 'Kotlin'], 1],
      ['What is a cross-platform framework?', ['One codebase that builds apps for Android and iOS', 'A framework that only runs on Android', 'A database for mobile apps', 'A tool for designing logos'], 0],
      ['Which command checks that your Flutter installation is set up correctly?', ['flutter run', 'flutter build', 'flutter doctor', 'flutter clean'], 2],
      ['Which function is the starting point of every Flutter app?', ['start()', 'init()', 'build()', 'main()'], 3],
      ['Hot reload in Flutter lets you…', ['See code changes in the running app within seconds', 'Delete the app from the phone', 'Publish the app to the store', 'Reset the phone'], 0]]],
    ['Flutter fundamentals, widgets and layout', [
      ['Module-02_Session-1_Flutter-Fundamentals-and-Widgets', 'Flutter fundamentals and widgets'],
      ['Module-02_Session-2_Layout-and-Core-UI-Widgets', 'Layout and core UI widgets']], 'Day2', [
      ['In Flutter, the user interface is built from…', ['HTML pages', 'XML files only', 'Widgets', 'SQL tables'], 2],
      ['A widget whose look never changes after it is built is a…', ['StatelessWidget', 'StatefulWidget', 'Provider', 'Future'], 0],
      ['Which widget places its children one below another (vertically)?', ['Row', 'Column', 'Stack', 'Text'], 1],
      ['Which widget puts its children on top of each other?', ['Column', 'Row', 'ListView', 'Stack'], 3],
      ['Which widget gives a page the standard app bar and body structure?', ['Scaffold', 'Container', 'Padding', 'Icon'], 0]]],
    ['Dart language and async programming', [
      ['Module-03_Session-1_Dart-Introduction-and-Tools', 'Dart introduction and tools'],
      ['Module-03_Session-2_Dart-Language-Fundamentals-and-Async', 'Dart language fundamentals and async']], 'Day3', [
      ['Which keyword declares a variable whose value cannot change after it is set once at run time?', ['var', 'dynamic', 'final', 'void'], 2],
      ['What does a Future represent in Dart?', ['A value that will be available later', 'A list of numbers', 'A loop', 'A class constructor'], 0],
      ['Which keyword waits for a Future to finish inside an async function?', ['wait', 'await', 'then', 'yield'], 1],
      ['What does the "?" in a type like String? mean?', ['The value must be a number', 'The variable is private', 'The value is constant', 'The variable can hold null'], 3],
      ['Which online tool lets you run Dart code in the browser without installing anything?', ['DartPad', 'Xcode', 'Gradle', 'Postman'], 0]]],
    ['State management: setState and Provider', [
      ['Module-04_Session-1_State-Management-and-setState', 'State management and setState'],
      ['Module-04_Session-2_Provider-in-Practice', 'Provider in practice']], 'Day4', [
      ['What does calling setState() do?', ['Deletes the widget', 'Tells Flutter the state changed so the widget rebuilds', 'Saves data to the server', 'Closes the app'], 1],
      ['setState() can be used inside a…', ['StatelessWidget', 'main() function', 'State class of a StatefulWidget', 'Dart package file'], 2],
      ['Provider is mainly used to…', ['Share state with many widgets without passing it down by hand', 'Draw animations', 'Send emails', 'Take photos'], 0],
      ['Which class can notify listeners when its data changes, for use with Provider?', ['Container', 'Scaffold', 'MaterialApp', 'ChangeNotifier'], 3],
      ['Which widget rebuilds when a Provider value it listens to changes?', ['Consumer', 'Padding', 'SizedBox', 'Divider'], 0]]],
    ['Navigation, routes and deep linking', [
      ['Module-05_Session-1_Navigator-Routes-and-Named-Routes', 'Navigator, routes and named routes'],
      ['Module-05_Session-2_Passing-Data-Navigation-Widgets-and-Deep-Linking', 'Passing data, navigation widgets and deep linking']], 'Day 5', [
      ['Which call opens a new screen on top of the current one?', ['Navigator.pop', 'Navigator.push', 'setState', 'runApp'], 1],
      ['Which call goes back to the previous screen?', ['Navigator.pop', 'Navigator.push', 'Navigator.restart', 'exit()'], 0],
      ['Named routes are registered in…', ['The pubspec.yaml file', 'A Text widget', 'The routes map of MaterialApp', 'The AndroidManifest only'], 2],
      ['Deep linking lets a link…', ['Delete the app', 'Change the app icon', 'Speed up the network', 'Open a specific screen inside the app'], 3],
      ['Which widget shows tabs or icons at the bottom of the screen for switching pages?', ['BottomNavigationBar', 'AppBar', 'Drawer', 'FloatingActionButton'], 0]]],
    ['APIs, state, error handling and offline storage', [
      ['Module-06_Session-1_API-Basics-HTTP-and-JSON', 'API basics: HTTP and JSON'],
      ['Module-06_Session-2_State-Management-Error-Handling-and-Offline-Storage', 'State management, error handling and offline storage']], 'Day 6', [
      ['Which HTTP method is normally used to read data from an API?', ['GET', 'POST', 'DELETE', 'PATCH'], 0],
      ['JSON is…', ['An image format', 'A text format for sending structured data', 'A database engine', 'A Flutter widget'], 1],
      ['Which Dart function turns a JSON string into a Map?', ['jsonEncode', 'toString', 'jsonDecode', 'parseInt'], 2],
      ['HTTP status code 404 means…', ['Success', 'Server error', 'Unauthorised', 'Not found'], 3],
      ['Which package is commonly used to save small key-value settings on the device?', ['shared_preferences', 'http', 'provider', 'camera'], 0]]],
    ['Theming and animations', [
      ['Module-07_Session-1_Theming-in-Flutter', 'Theming in Flutter'],
      ['Module-07_Session-2_Flutter-Animations', 'Flutter animations']], 'Day 7', [
      ['Where do you set the app-wide colours and text styles?', ['ThemeData in MaterialApp', 'Each Text widget only', 'pubspec.yaml', 'main.dart imports'], 0],
      ['How can an app support dark mode?', ['It cannot', 'Provide a darkTheme to MaterialApp', 'Use only black images', 'Restart the phone'], 1],
      ['Which widget animates size, colour or padding changes automatically?', ['Text', 'Column', 'AnimatedContainer', 'Icon'], 2],
      ['Which object controls the timing of an explicit animation?', ['Navigator', 'Scaffold', 'Future', 'AnimationController'], 3],
      ['Which widget animates a shared element between two screens?', ['Hero', 'Center', 'Expanded', 'Spacer'], 0]]],
    ['Sensors, camera, location and offline storage', [
      ['Module-08_Session-1_Sensors-Camera-and-Location', 'Sensors, camera and location'],
      ['Module-08_Session-2_State-Management-Error-Handling-and-Offline-Storage-repeat-of-Day-6', 'State management, error handling and offline storage (revision)']], 'Day 8', [
      ['Before an app can use the camera or location, it must…', ['Ask the user for permission', 'Restart the phone', 'Turn off Wi-Fi', 'Clear its cache'], 0],
      ['Which sensor measures how the phone is moving or tilting?', ['Microphone', 'Accelerometer', 'Speaker', 'Battery'], 1],
      ['Location (GPS) data gives the phone’s…', ['Battery level', 'Screen size', 'Latitude and longitude', 'Wi-Fi password'], 2],
      ['What should an app do when the user denies location permission?', ['Crash', 'Keep asking every second', 'Delete user data', 'Explain why it is needed and keep working without it'], 3],
      ['Which keywords catch an error so the app shows a message instead of crashing?', ['try / catch', 'if / else', 'for / in', 'switch / case'], 0]]],
    ['APIs and state management in practice', [
      ['Module-09_Session-1_API-Basics-HTTP-and-JSON_COPY-OF-DAY-6', 'API basics: HTTP and JSON (practice)'],
      ['Module-09_Session-2_State-Management-Error-Handling-and-Offline-Storage_COPY-OF-DAY-6', 'State management, error handling and offline storage (practice)']], 'Day 9', [
      ['Which HTTP method is normally used to send new data to an API?', ['GET', 'POST', 'HEAD', 'OPTIONS'], 1],
      ['Which widget shows the result of a Future (loading, data or error) in the UI?', ['FutureBuilder', 'ListTile', 'Opacity', 'Align'], 0],
      ['HTTP status codes in the 500 range mean…', ['Success', 'Redirect', 'A server error', 'The page was not found'], 2],
      ['Which Dart function turns a Map into a JSON string to send to an API?', ['jsonDecode', 'print', 'toList', 'jsonEncode'], 3],
      ['Why show a loading indicator while calling an API?', ['So the user knows the app is working and not frozen', 'To make the call faster', 'To save battery', 'It is required by Dart'], 0]]],
    ['APIs, state and offline storage: project', [
      ['Module-10_Session-1_API-Basics-HTTP-and-JSON_COPY-OF-DAY-6', 'API basics: HTTP and JSON (project)'],
      ['Module-10_Session-2_State-Management-Error-Handling-and-Offline-Storage_COPY-OF-DAY-6', 'State management, error handling and offline storage (project)']], 'Day 10', [
      ['Offline storage lets an app…', ['Work only on Wi-Fi', 'Keep showing saved data without an internet connection', 'Skip permissions', 'Run without a phone'], 1],
      ['Which is a good choice for storing larger structured data (tables of records) on the device?', ['shared_preferences', 'A Text widget', 'SQLite (for example the sqflite package)', 'The app icon'], 2],
      ['Where should an API key that must stay secret be kept?', ['On a server, not inside the app code', 'In a Text widget', 'In the app name', 'In a public GitHub file'], 0],
      ['If an API call fails because there is no internet, the app should…', ['Close immediately', 'Show nothing', 'Delete saved data', 'Show a friendly message and the last saved data if it has any'], 3],
      ['Which file lists the packages (dependencies) a Flutter project uses?', ['main.dart', 'pubspec.yaml', 'build.gradle only', 'README.md'], 1]]],
  ];
  // capstone projects (learner-journey.js): mods = module numbers the project needs
  w.CAPS = w.CAPS || {};
  w.CAPS[7] = [
    { id: 'todo', e: '✅', t: 'To-do app with offline storage', mods: [1, 2, 3, 4, 6],
      brief: 'Build a to-do app that keeps working without internet and remembers tasks after the app is closed.',
      out: ['Add, edit, complete and delete tasks', 'Tasks saved on the device and loaded on start', 'Clean state management with Provider'],
      tools: ['Flutter', 'Dart', 'Provider', 'shared_preferences'],
      steps: ['Sketch the screens', 'Build the task list and form', 'Manage the tasks with Provider', 'Save and load tasks on the device', 'Polish the UI and test edge cases'] },
    { id: 'news', e: '📰', t: 'News reader app using a public API', mods: [1, 2, 3, 6, 9],
      brief: 'Show the latest headlines from a free public API, with loading, error and offline states.',
      out: ['Headlines loaded from a REST API and parsed from JSON', 'Clear loading, error and retry screens', 'The last headlines shown when offline'],
      tools: ['Flutter', 'http package', 'JSON', 'FutureBuilder'],
      steps: ['Pick a free news API and read its docs', 'Fetch and parse the JSON', 'Build the list and detail screens', 'Handle errors and no internet', 'Cache the last result on the device'] },
    { id: 'shop', e: '🛒', t: 'Shopping app with a cart', mods: [2, 4, 5, 7],
      brief: 'Build a small shop: product list, product page and a cart that updates everywhere.',
      out: ['Product list and detail screens with navigation', 'A cart shared across screens with Provider', 'A themed, animated checkout flow'],
      tools: ['Flutter', 'Provider', 'Navigator', 'ThemeData'],
      steps: ['Create sample products', 'Build the list and detail screens', 'Add the cart with Provider', 'Add theming and small animations', 'Test the full checkout flow'] },
    { id: 'trip', e: '📍', t: 'Travel log app with camera and location', mods: [2, 3, 5, 8],
      brief: 'Let a user save places they visit with a photo and their location.',
      out: ['Take or pick a photo for each entry', 'Save the GPS location with each entry', 'Permission handling that explains why it is needed'],
      tools: ['Flutter', 'camera / image_picker', 'geolocator', 'Permissions'],
      steps: ['Plan the screens and data', 'Add camera or gallery photos', 'Read the location with permission', 'List entries with photo and place', 'Handle denied permissions politely'] },
    { id: 'weather', e: '🌦️', t: 'Weather app with themes and animations', mods: [3, 6, 7, 10],
      brief: 'Show the weather for a city from an API, with a light and dark theme and smooth animations.',
      out: ['Weather data from an API for any city', 'Light and dark themes', 'Animated weather cards and transitions'],
      tools: ['Flutter', 'http', 'ThemeData', 'Animations'],
      steps: ['Choose a free weather API', 'Fetch and show the forecast', 'Add a city search', 'Add themes and animations', 'Handle errors and offline use'] },
  ];
  w.MAD_CUR = M.map(function (m, i) {
    var k = i + 1, ls = m[1].map(function (p, j) {
      return { u: 'm' + k + 's' + (j + 1), ty: 'doc', t: 'PPT ' + (j + 1) + ': ' + p[1], du: '', url: BASE + 'Slides/' + s3enc(p[0]) + '.pptx', tx: '' };
    });
    ls.push({ u: 'm' + k + 'v', ty: 'video', t: 'Video: ' + m[2].replace(/^Day\s*/, 'Day ') + ' session', du: '', url: BASE + 'Videos/' + s3enc(m[2]) + '.mp4', tx: '' });
    return { u: 'm' + k, t: m[0], ls: ls, qs: m[3].map(function (q) { return { q: q[0], o: q[1], a: q[2] }; }) };
  });
  // course card image (no photo yet): a phone on the site's green
  w.MAD_IMG = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0f1f3d"/><stop offset="1" stop-color="#3f6a0c"/></linearGradient></defs>' +
    '<rect width="640" height="360" fill="url(#g)"/><circle cx="520" cy="70" r="120" fill="#8dc63f" opacity=".18"/><circle cx="90" cy="320" r="90" fill="#8dc63f" opacity=".12"/>' +
    '<rect x="250" y="50" width="140" height="260" rx="22" fill="#fff"/><rect x="262" y="76" width="116" height="200" rx="6" fill="#edf3fa"/>' +
    '<rect x="276" y="92" width="88" height="34" rx="6" fill="#8dc63f"/><rect x="276" y="138" width="88" height="12" rx="4" fill="#c2cfe3"/><rect x="276" y="158" width="64" height="12" rx="4" fill="#c2cfe3"/>' +
    '<rect x="276" y="186" width="40" height="40" rx="8" fill="#6fa12e"/><rect x="324" y="186" width="40" height="40" rx="8" fill="#0f1f3d" opacity=".75"/><rect x="276" y="234" width="88" height="28" rx="14" fill="#4a7a10"/>' +
    '<rect x="300" y="60" width="40" height="6" rx="3" fill="#c2cfe3"/><circle cx="320" cy="294" r="8" fill="#c2cfe3"/></svg>');
})(window);

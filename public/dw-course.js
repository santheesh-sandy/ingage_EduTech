/* ingage EduTech – Data Warehousing curriculum (course 22)
 * 10 modules · 25 slide decks ("Module_NN_…_PartN") · 14 videos · one 5-question MCQ test per module · 5 capstones.
 * Each module shows its decks first, then its videos. Videos are placed by topic (V below: [file name, title, module]).
 * Videos 8 and 13 on S3 are exact copies of videos 3 and 6 (same file), so they are not listed twice;
 * they are used as the backup link ("alt") in case the main copy is missing.
 * Files are on Amazon S3 (folder "Data Warehousing"):
 *   slides  <base>Slides/<file name>.pptx   (shown in the view-only slide viewer)
 *   videos  <base>Videos/<file name>.mp4    (played in the site's own player)
 * Loaded before the main script in index.html, so the course list (var C) can use it.
 * The course picture is UPC_IMG[22] (upcoming-courses.js).
 */
(function (w) {
  'use strict';
  var BASE = 'https://ingage-lms.s3.ap-south-1.amazonaws.com/Data+Warehousing/';
  function s3enc(s) { return encodeURIComponent(s).replace(/%20/g, '+'); }
  // [S3 file name (without .mp4), title shown to learners, module number, backup copy file name?]
  var V = [
    ['1.Data Lake VS Data Warehouse VS Data Marts _ CodeLearnX', 'Data lake vs data warehouse vs data marts', 1],
    ['2.Database Management System (DBMS)', 'Database management systems (DBMS)', 1],
    ['4.Types Of Software_ Database', 'Types of software: databases', 2],
    ['10.Snowflake Architecture', 'Snowflake architecture', 3],
    ['5.Y2meta.app - Snowflake - Virtual Warehouses', 'Snowflake virtual warehouses', 3],
    ['9.Snowflake - Loading data from Azure', 'Snowflake: loading data from Azure', 4],
    ['12.Y2meta.app - Snowflake - Stored Procedure for Data Load Automation', 'Snowflake stored procedure for data load automation', 4],
    ['7.Y2meta.app - SQL Query to Eliminate Duplicate Pairs of Records', 'SQL query to eliminate duplicate pairs of records', 6],
    ['11.Y2meta.app - Snowflake - EXCLUDE and RENAME - Very Useful in Real-time', 'Snowflake EXCLUDE and RENAME in real-time queries', 6],
    ['3.Relational Database Relationships (Updated)', 'Relational database relationships', 7, '8.Relational+Database+Relationships+(Updated)+GiveFastLink'],
    ['6.Y2meta.app - Snowflake External Tables - Working Session - Queries in the Description', 'Snowflake external tables: working session', 8, '13.Y2meta.app - Snowflake External Tables - Working Session - Queries in the Description (1)'],
    ['14.What+Is+Power+BI_+_+Introduction+To+Power+BI+_+Power+BI+Tutorial+For+Beginners+_+Simplilearn+GiveFastLink', 'What is Power BI? Introduction for beginners', 9],
    ['16.System+Managers+in+Data+Warehousing+_+Lecture+#15+_+Data+Warehouse+Tutorial+GiveFastLink', 'System managers in data warehousing', 10],
    ['15.Snowflake - Roles and Users Practice', 'Snowflake roles and users practice', 10],
  ];
  // [module title, slide file stem (decks are <stem>_Part1…N), number of decks, [[question, [4 options], answer index], …]]
  var M = [
    ['Data warehouse introduction and characteristics', 'Module_01_Data_Warehouse_Introduction_and_Characteristics', 3, [
      ['What is a data warehouse?', ['A central store of cleaned, integrated historical data used for reporting and analysis', 'A spreadsheet on one laptop', 'A backup tape', 'A website database for online orders only'], 0],
      ['Which is a classic characteristic of a data warehouse (Inmon)?', ['Volatile', 'Subject-oriented, integrated, time-variant and non-volatile', 'Real-time only', 'Unstructured only'], 1],
      ['A data lake mainly stores…', ['Only cleaned summary tables', 'Only reports', 'Raw data of any format, structured or not', 'Only passwords'], 2],
      ['A data mart is…', ['A shop selling data', 'A type of cable', 'A backup of the OLTP system', 'A smaller warehouse focused on one department or subject'], 3],
      ['A DBMS is software that…', ['Stores, retrieves and manages data in databases', 'Draws charts only', 'Edits videos', 'Sends emails'], 0]]],
    ['DW components, architecture and challenges', 'Module_02_DW_Components_Architecture_and_Challenges', 3, [
      ['Which is the usual flow of data in a warehouse?', ['Reports → sources → warehouse', 'Source systems → staging / ETL → warehouse → reports', 'Warehouse → source systems', 'Reports → ETL → sources'], 1],
      ['The staging area is used to…', ['Show dashboards to managers', 'Store user passwords', 'Hold raw extracted data before cleaning and loading', 'Replace the warehouse'], 2],
      ['In a three-tier DW architecture, the top tier is…', ['The source database', 'The network', 'The staging area', 'Front-end tools for reporting and analysis'], 3],
      ['A common data warehouse challenge is…', ['Poor data quality from source systems', 'Too few colours in charts', 'Keyboards wearing out', 'Too little electricity'], 0],
      ['Metadata in a warehouse is…', ['The largest fact table', 'Data about data: sources, meanings, formats and load history', 'A type of chart', 'A password list'], 1]]],
    ['Snowflake setup, Power BI install and basic SQL', 'Module_03_Snowflake_Setup_Power_BI_Install_and_Basic_SQL', 2, [
      ['Snowflake is…', ['A desktop spreadsheet', 'An operating system', 'A cloud data warehouse platform', 'A web browser'], 2],
      ['In Snowflake, a virtual warehouse is…', ['A physical building', 'A schema', 'A backup file', 'Compute resources that run queries and loads'], 3],
      ['Snowflake separates storage from…', ['Compute', 'Users', 'SQL', 'Tables'], 0],
      ['Which SQL statement reads data from a table?', ['INSERT', 'SELECT', 'DROP', 'GRANT'], 1],
      ['Power BI Desktop is used to…', ['Store warehouse data', 'Write ETL code only', 'Build reports and dashboards from data', 'Manage Snowflake users'], 2]]],
    ['ETL, ELT, metadata and reporting tools', 'Module_04_ETL_ELT_Metadata_and_Reporting_Tools', 2, [
      ['ETL stands for…', ['Edit, Test, Launch', 'Export, Track, Link', 'Enter, Transfer, Lock', 'Extract, Transform, Load'], 3],
      ['In ELT, data is transformed…', ['After loading, inside the warehouse', 'Before extraction', 'Never', 'Only in Excel'], 0],
      ['Which is a transformation step?', ['Turning the server off', 'Removing duplicates and standardising date formats', 'Buying more storage', 'Emailing a report'], 1],
      ['A stored procedure that loads data on a schedule helps…', ['Delete the warehouse', 'Draw charts', 'Automate repeated data loads', 'Design logos'], 2],
      ['Which is a reporting / BI tool?', ['Snowpipe', 'MySQL', 'Python only', 'Power BI'], 3]]],
    ['OLAP, OLTP and OLAP types', 'Module_05_OLAP_OLTP_and_OLAP_Types', 2, [
      ['OLTP systems are designed for…', ['Many small, fast transactions such as orders and payments', 'Yearly trend analysis', 'Only reports', 'Only images'], 0],
      ['OLAP systems are designed for…', ['Typing documents', 'Complex analysis over large amounts of historical data', 'Sending messages', 'Single-row updates'], 1],
      ['MOLAP stores data in…', ['Relational tables only', 'Text files', 'Multidimensional cubes', 'Emails'], 2],
      ['ROLAP works on…', ['Paper files', 'Cubes only', 'Images', 'Relational tables in the database'], 3],
      ['A "drill-down" operation moves from…', ['Summary data to more detailed data', 'Detail to deleting data', 'One user to another', 'SQL to Python'], 0]]],
    ['SQL commands, constraints, aggregates and joins', 'Module_06_SQL_Commands_Constraints_Aggregates_and_Joins', 3, [
      ['CREATE, ALTER and DROP belong to…', ['DML', 'DDL (data definition language)', 'DCL', 'TCL'], 1],
      ['A PRIMARY KEY constraint ensures…', ['Values can repeat', 'Columns are hidden', 'Each row has a unique, non-null identifier', 'The table is read-only'], 2],
      ['Which function counts rows?', ['SUM()', 'MAX()', 'AVG()', 'COUNT()'], 3],
      ['An INNER JOIN returns…', ['Only rows with matching values in both tables', 'All rows from both tables always', 'Only unmatched rows', 'Only column names'], 0],
      ['Which clause filters groups after GROUP BY?', ['WHERE', 'HAVING', 'ORDER BY', 'FROM'], 1]]],
    ['Dimensional modelling: star and snowflake schemas, views', 'Module_07_Dimensional_Modeling_Star_Snowflake_Schema_Views', 3, [
      ['A fact table stores…', ['Descriptions of customers only', 'User passwords', 'Measurable events such as sales amounts and quantities', 'Report colours'], 2],
      ['A dimension table stores…', ['Only numeric totals', 'Log files', 'Backups', 'Descriptive context such as product, customer and date'], 3],
      ['In a star schema, the fact table links…', ['Directly to denormalised dimension tables', 'To nothing', 'Only to other fact tables', 'Only to views'], 0],
      ['A snowflake schema differs from a star schema because…', ['It has no fact table', 'Its dimension tables are normalised into further tables', 'It cannot use SQL', 'It stores only images'], 1],
      ['A database view is…', ['A copy of the whole database', 'A chart', 'A saved query that behaves like a virtual table', 'A user role'], 2]]],
    ['E-commerce use case with Snowflake', 'Module_08_E_commerce_Use_Case_with_Snowflake', 2, [
      ['In an e-commerce warehouse, which is a good fact table?', ['Customer names', 'Product colours', 'Store addresses', 'Order lines with quantity and amount'], 3],
      ['Which is a typical dimension for e-commerce sales?', ['Date, customer and product', 'Order total only', 'Database password', 'Server IP'], 0],
      ['A Snowflake external table lets you…', ['Delete the stage', 'Query files in cloud storage without loading them first', 'Draw dashboards', 'Create users'], 1],
      ['Which business question does an e-commerce warehouse answer?', ['Which font to use', 'How fast the CPU is', 'Which products sell best each month in each region', 'The Wi-Fi password'], 2],
      ['A stage in Snowflake is…', ['A user role', 'A report page', 'A type of join', 'A location of data files for loading or querying'], 3]]],
    ['Power BI and Snowflake connection', 'Module_09_Power_BI_and_Snowflake_Connection', 3, [
      ['To connect Power BI to Snowflake you need…', ['The Snowflake server/account URL, warehouse and login details', 'Only an email address', 'A USB cable', 'A Python script'], 0],
      ['DirectQuery mode in Power BI…', ['Copies all data into Power BI', 'Sends queries to the source each time the report is used', 'Deletes the source data', 'Only works offline'], 1],
      ['Import mode in Power BI…', ['Never stores data', 'Writes data back to Snowflake', 'Loads a copy of the data into the Power BI model', 'Only shows images'], 2],
      ['A Power BI measure such as Total Sales is usually written in…', ['HTML', 'CSS', 'Java', 'DAX'], 3],
      ['Which visual best shows sales trend over months?', ['Line chart', 'Pie chart of one value', 'Single card with a name', 'Blank page'], 0]]],
    ['DW system managers and user access', 'Module_10_DW_System_Managers_and_User_Access', 2, [
      ['A load manager in a data warehouse…', ['Designs logos', 'Extracts and loads data into the warehouse', 'Writes emails', 'Prints reports'], 1],
      ['A query manager…', ['Installs Windows', 'Buys hardware', 'Directs user queries to the right tables and manages them', 'Deletes old users'], 2],
      ['In Snowflake, access is given to users through…', ['Shared passwords', 'Email only', 'Public links', 'Roles with granted privileges'], 3],
      ['The principle of least privilege means…', ['Give users only the access they need for their job', 'Give everyone admin access', 'Share one login', 'Remove all access'], 0],
      ['Which SQL command gives a privilege to a role?', ['SELECT', 'GRANT', 'UPDATE', 'DELETE'], 1]]],
  ];
  w.DW_CUR = M.map(function (m, i) {
    var k = i + 1, ls = [];
    for (var j = 1; j <= m[2]; j++) {
      ls.push({ u: 'm' + k + 's' + j, ty: 'doc', t: 'PPT ' + j + ': ' + m[0] + ' (Part ' + j + ')', du: '', url: BASE + 'Slides/' + s3enc(m[1] + '_Part' + j) + '.pptx', tx: '' });
    }
    V.forEach(function (v) {
      if (v[2] != k) return;
      var n = v[0].split('.')[0], l = { u: 'm' + k + 'v' + n, ty: 'video', t: 'Video: ' + v[1], du: '', url: BASE + 'Videos/' + s3enc(v[0]) + '.mp4', tx: '' };
      if (v[3]) l.alt = BASE + 'Videos/' + s3enc(v[3]) + '.mp4';
      ls.push(l);
    });
    return { u: 'm' + k, t: m[0], ls: ls, qs: m[3].map(function (q) { return { q: q[0], o: q[1], a: q[2] }; }) };
  });

  // capstone projects (learner-journey.js): mods = module numbers the project needs
  w.CAPS = w.CAPS || {};
  w.CAPS[22] = [
    { id: 'ecom', e: '🛒', t: 'E-commerce sales data warehouse in Snowflake', mods: [6, 7, 8],
      brief: 'Design and build a star schema for an online store and load sample orders, customers and products into Snowflake.',
      out: ['A star schema diagram with fact and dimension tables', 'Snowflake tables loaded with sample data', 'SQL queries answering 5 business questions'],
      tools: ['Snowflake', 'SQL', 'Star schema'],
      steps: ['List the business questions', 'Design the fact and dimension tables', 'Create the tables in Snowflake', 'Load the sample data', 'Write and test the queries'] },
    { id: 'etl', e: '🔄', t: 'Automated ETL / ELT load pipeline', mods: [4, 8],
      brief: 'Load raw files from cloud storage into Snowflake through a stage, clean them and automate the load with a stored procedure.',
      out: ['A stage and file format for the raw files', 'Cleaning SQL (duplicates, dates, nulls)', 'A stored procedure and schedule for the load'],
      tools: ['Snowflake stages', 'COPY INTO', 'Stored procedures / tasks'],
      steps: ['Upload sample files', 'Create the stage and file format', 'Load into staging tables', 'Clean and move to the warehouse tables', 'Automate and test the load'] },
    { id: 'pbi', e: '📊', t: 'Power BI sales dashboard on Snowflake', mods: [3, 9],
      brief: 'Connect Power BI to the Snowflake warehouse and build a management dashboard with sales, trends and top products.',
      out: ['A Power BI report connected to Snowflake', 'DAX measures for sales, orders and growth', 'A one-page dashboard with filters'],
      tools: ['Power BI Desktop', 'Snowflake connector', 'DAX'],
      steps: ['Connect to Snowflake', 'Pick tables and build relationships', 'Write the measures', 'Design the dashboard', 'Share findings in 5 bullet points'] },
    { id: 'olap', e: '🧊', t: 'OLAP analysis report for a retail chain', mods: [5, 6, 7],
      brief: 'Answer roll-up, drill-down and slice-and-dice questions on retail sales data with SQL aggregates and joins.',
      out: ['SQL for roll-up by region and month', 'Drill-down from category to product', 'A short report of the insights'],
      tools: ['SQL GROUP BY / HAVING', 'Joins', 'Views'],
      steps: ['Load the retail data', 'Write roll-up queries', 'Write drill-down and slice queries', 'Save useful queries as views', 'Write the report'] },
    { id: 'access', e: '🔐', t: 'Warehouse roles and user access plan', mods: [2, 10],
      brief: 'Plan who can see and change what in a company warehouse, then set it up with Snowflake roles and grants.',
      out: ['A role plan for analysts, engineers and admins', 'GRANT scripts for each role', 'Test results showing who can and cannot access each table'],
      tools: ['Snowflake roles and users', 'GRANT / REVOKE', 'Least privilege'],
      steps: ['List the user groups', 'Decide the access for each', 'Create roles and users', 'Grant the privileges', 'Test and document'] },
  ];
})(window);

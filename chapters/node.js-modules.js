/*

understanding node.js module system
- every file is module
- variables, constants, functions, objects, etc. is not accessible in another file/s until explicitly exported
- uses commonJS module system (module.exports and require)

how to export and import in node.js
- to export 
module.exports = name;

- to import 
const name = require('file/path/name.js')

- for multiple exports
named: module.exports.name = name;
aggregate: module.exports = { name1, name2,... }

- for multiple imports from same module
for named export: const name = require('file/path/name.js')
for aggregate export: const { name1, name2,... } = require('file/path/name.js')

In built modules in node.js

path module
- __dirname
- __filename
methods: join(), parse(), resolve(), extname(), basename(), dirname(), sep

os module
- working with OS

fs module
- allows CRUD operations with files using fs module

event module
- EventEmitter
- key methods: emit(eventName, [args]), on(eventName, listener)

http module
- allows developers to create an HTTP server to handle client requests and server responses
- provides methods and properties to work with HTTP requests and responses
- enables creating REST APIs, web pages, and other networked apps

*/


/*

---- TIP TIME ----

before reading tips, make sure package.json file is installed, command: npm init -y, install it in directory in which main server file is present.

tip: if you don't want to restart your server again and again, and want to restart it automatic, you can use nodeman package. command: nodemon app.js, to run your application

tip: if you don't want to write nodemon app.js, edit your package.json, in scripts, write this script, "start": "nodemon app.js", and then run command: npm start, to run your application

tip: we can save automatic without nodemon by using this command: node --watch app.js, we --watch before our server file

*/

/*

ESModules
- EcmaScript Modules
- to enable: edit package.json, set "type": "module"
- types: default, named and aggregate

readline module
- for input operations
- project/task: todo

*/
const path = require('path');

// shows current directory you are working in
// console.log(__dirname); 

// shows current file you are working in
// console.log(__filename); 

// creating a path
const newFile = path.join("folder", "students", "data.txt");
// console.log(newFile);

// more details about file
const parseData = path.parse(newFile);
const resolvePath = path.resolve(newFile);
const extname = path.extname(newFile);
const basename = path.basename(newFile);
const dirname = path.dirname(newFile);
const seperator = path.sep;

console.log({
    parseData,
    resolvePath,
    extname,
    basename,
    dirname,
    seperator
})
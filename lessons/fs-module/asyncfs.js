const fs = require('fs');
const path = require('path');

const fileName = "fs-async.txt";
const filePath = path.join(__dirname, fileName);

// fs.writeFile(
//     filePath, 
//     "This is first async data.", 
//     'utf-8',
//     (err) => {
//         if(err) console.log(err.message);
//         else console.log("File has been saved");
//     }
// );

// fs.readFile(
//     filePath, 
//     'utf-8',
//     (err, data) => {
//         if(err) console.log(err.message);
//         else console.log(data);
//     }
// );

// fs.appendFile(
//     filePath, 
//     "\nnew updated data",
//     'utf-8',
//     (err) => {
//         if(err) console.log(err.message);
//         else console.log("File has been updated");
//     }
// );

// fs.unlink(
//     filePath, 
//     (err) => {
//         if(err) console.log(err.message);
//         else console.log("File has been deleted");
//     }
// );

const newFileName = "updated-fs-async.txt";
const newFilePath = path.join(__dirname, newFileName);

fs.rename(filePath, newFilePath, (err) => {
    if(err) console.log(err)
    else console.log("File renamed");
});
const fs = require("fs");
const path = require("path");

const fileName = "fs-sync.txt";
const filePath = path.join(__dirname, fileName)

// const createFile = fs.writeFileSync(
//     filePath,
//     "This is our first fs sync data.",
//     "utf-8"
// );
// console.log(createFile);

// const readFile = fs.readFileSync(
//     filePath,
//     'utf-8'
// );
// console.log(readFile.toString());
// console.log(readFile);

// const updateFile = fs.appendFileSync(
//     filePath,
//     "\nThis is updated Data.",
//     'utf-8'
// )
// console.log(updateFile);

// const deleteFile = fs.unlinkSync(filePath);
// console.log(deleteFile);

const newFileName = "updated-fs-sync.txt";
const newFilePath = path.join(__dirname, newFileName);
const renameFile = fs.renameSync(filePath, newFilePath);
console.log(renameFile);
const fs = require('fs');
// tired of writing fs.promises you can import fs/promises and can use only fs.method
// const fs = require('fs/promises') 
const path = require('path');

const fileName = "fsPromises.txt";
const filePath = path.join(__dirname, fileName);
const fileDir = __dirname;

// fs.promises.readdir(fileDir)
// .then((data) => console.log(data))
// .catch((err) => console.log(err))

// fs.promises.writeFile(filePath, "This is our first promise data.", 'utf-8')
// .then(() => console.log("File created"))
// .catch((err) => console.log(err))

// fs.promises.readFile(filePath, 'utf-8')
// .then((data) => console.log(data))
// .catch((err) =>  console.log(err))

// fs.promises.appendFile(filePath, "\nthis is updated promise data.", 'utf-8')
// .then(() => console.log("file updated"))
// .catch((err) => console.log(err))

// fs.promises.unlink(filePath)
// .then(() => console.log("file deleted"))
// .catch((err) => console.log(err))

const newFileName = "updated-fs-promises.txt";
const newFilePath = path.join(__dirname, newFileName);

fs.promises.rename(filePath, newFilePath)
.then(() => console.log("file renamed"))
.catch((err) => console.log(err))
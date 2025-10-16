const fs = require('fs/promises');
const path = require('path');

const fileName = "fs-async-await.txt";
const filePath = path.join(__dirname, fileName);
const fileDir = __dirname;

// const readFileDir = async () => {
//     try{
//         const fetchedFiles = await fs.readdir(fileDir);
//         console.log("fetched all files in directory.");
//         console.log(fetchedFiles);
//     }catch(err){
//         console.log(err);
//     }
// }
// readFileDir();

// async function writeFile(){
//     try {
//         await fs.writeFile(filePath, "This is our first async await data.", 'utf-8');
//         console.log("file created");
//     } catch (err){
//         console.log(err)
//     }
// }
// writeFile();

// async function readFile(){
//     try{
//         const data = await fs.readFile(filePath, 'utf-8');
//         console.log(data);
//     }catch(err){
//         console.log(err);
//     }
// }
// readFile();

// async function updateFile(){
//     try{
//         await fs.appendFile(filePath, "\nthis is updated data.",'utf-8');
//         console.log("file updated");
//     }catch(err){
//         console.log(err);
//     }
// }
// updateFile();

// async function deleteFile() {
//     try{
//         await fs.unlink(filePath);
//         console.log("file deleted");
//     }catch(err){
//         console.log(err);
//     }
// }
// deleteFile();

async function renameFile(){
    try{
        const newFileName = "updated-fs-async-await.txt";
        const newFilePath = path.join(__dirname, newFileName);
        await fs.rename(filePath, newFilePath);
        console.log("file name changed");
    }catch(err){
        console.log(err);
    }
}
renameFile();
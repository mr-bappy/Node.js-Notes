// package import
const fs = require("fs");
const readline = require("readline");

// creating input interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// function to take input options
const showMenu = () => {
    console.log("\n1. Create a file.");
    console.log("2. Read file content.");
    console.log("3. Add content in file.");
    console.log("4. Delete a file.");
    console.log("5. Exit.");
    rl.question("Enter option: ", handleInput );
}

// function to handle input operations
function handleInput(option){
    if(option === "1") createFile();
    else if(option === "2") readFile();
    else if(option === "3") updateFile();
    else if(option === "4") deleteFile();
    else if(option === "5"){
        console.log("No operations performed");
        rl.close();
    }
    else{
        console.log("Invalid option");
        showMenu()
    }
}

// handle operations
function createFile(){
    rl.question("Enter filename: ", (filename) => {
        rl.question("Enter file extension: ", (extension) => {
            rl.question("Enter content: ", (content) => {
                fs.writeFile(`${filename}.${extension}`, content, 'utf-8', (err) => {
                    if(err) {
                        console.log("\nError writing file: ", err.message);
                        rl.close();
                    }
                    else {
                        console.log("\nFile created successfully.");
                        showMenu();
                    };
                });
                
            })
        })
    })
}

function readFile(){
    rl.question("Enter filename: ", (filename) => {
        rl.question("Enter file extension: ", (extension) => {
            fs.readFile(`${filename}.${extension}`, 'utf-8', (err, data) => {
                if(err) {
                    console.log("\nError reading file: ", err.message)
                    rl.close();
                }
                else {
                    console.log("\nbelow is your data inside file:");
                    console.log(data);
                    showMenu();
                };
            });
            
        })
    })
}

function updateFile(){
    rl.question("Enter filename: ", (filename) => {
        rl.question("Enter file extension: ", (extension) => {
            rl.question("Enter content: ", (content) => {
                fs.appendFile(`${filename}.${extension}`, `\n${content}`, 'utf-8', (err) => {
                    if(err) {
                        console.log("\nError adding content in file: ", err.message);
                        rl.close();
                    }else{
                        console.log("\nFile updated successfully");
                        showMenu();
                    }
                });
                
            })
        })
    })
}

function deleteFile(){
    rl.question("Enter filename: ", (filename) => {
        rl.question("Enter file extension: ", (extension) => {
            fs.unlink(`${filename}.${extension}`, (err) => {
                if(err) {
                    console.log("\nError deleting file: ", err.message);
                    rl.close();
                }
                else {
                    console.log("\nFile deleted successfully.");
                    showMenu();
                };
            });
            
        })
    })
}

// calling showMenu()
showMenu();
const os = require('os');

console.log("Platform: ", os.platform());
console.log("User: ", os.userInfo());
console.log("CPU architecture: ", os.arch());
console.log("Free memory: ", os.freemem(), " bytes");
console.log("Total memory: ", os.totalmem(), " bytes");
console.log("System uptime: ", os.uptime(), " seconds"); // be default - in seconds
console.log("System uptime: ", Math.floor((os.uptime()/60)/60), " hours"); // be default - in seconds
console.log("Home directory: ", os.homedir());
console.log("Host name: ", os.hostname());
console.log("Network interfaces: ", os.networkInterfaces());
console.log("Temporary directory: ", os.tmpdir());
console.log("Operating system: ", os.type());
// const add = require('./cal')

// const { add, sub, div, mul } = require('./cal')

// es import
import mul from "./cal.js"; // default import
import { div } from "./cal.js"; // named import
import { add, sub } from "./cal.js" // aggregate import
import * as math from "./cal.js" // aggregate import

console.log(add(4,5));
console.log(sub(4,5));
console.log(div(4,5));
console.log(mul(4,5));
console.log("\nusing . notation with math, math is now object containing methods")
console.log(math.add(4,5));
console.log(math.sub(4,5));
console.log(math.div(4,5));
// console.log(math.mul(4,5)); // this will not work, because it is default export
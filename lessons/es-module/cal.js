const add = (a,b) => {
    return a+b;
}
const sub = (a,b) => {
    return a-b;
}
// named export
export const div = (a,b) => {
    return a/b;
}
const mul = (a,b) => {
    return a*b;
}

// module.exports =  add;

// named export
// module.exports.add = add;
// module.exports.sub = sub;
// module.exports.div = div;
// module.exports.mul = mul;

// aggregate exports
// module.exports = {
//     add,
//     sub,
//     div,
//     mul,
// };

// es export
export default mul; // default export

export { add, sub }; //aggregate export
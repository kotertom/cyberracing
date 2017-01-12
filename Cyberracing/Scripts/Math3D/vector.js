/**
 * Created by tom on 2017-01-12.
 */

var Vector = {};
// Vector.prototype.add = function (vector) {
//     let coords = [];
//     for(let i = 0; i < this.dim; i++)
//         coords.push(this.coords[i] + vector.coords[i]);
//     return new Vector(coords);
// };
// Vector.prototype.mult = function (scalar) {
//     let coords = [];
//     for(let value of this.coords)
//         coords.push(value * scalar);
//     return new Vector(coords);
// };
// Vector.prototype.negate = function () {
//     let coords = [];
//     for(let value of this.coords)
//         coords.push(-value);
//     return new Vector(coords);
// };
// Vector.prototype.normalize = function () {
//     let coords = [];
//     let length = 0;
//     for(let value of this.coords)
//         length += value*value;
//     length = Math.sqrt(length);
//     for(let value of this.coords)
//         coords.push(value / length);
//     return new Vector(coords);
// };
Vector.up3 = [0,1,0];
Vector.forward3 = [0,0,1];
Vector.right3 = [1,0,0];

Vector.add = function (vec1, vec2) {
    if(vec1.length != vec2.length)
        throw "Vectors must be of same dimensions.";
    let result = [];
    for(let i = 0; i < vec1.length; i++)
        result.push(vec1[i] + vec2[i]);
    return result;
};
Vector.mult = function (vector, scalar) {
    let res = [];
    for(let val of vector)
        res.push(val * scalar);
    return res;
};
Vector.normalize = function (vector) {
    let length = 0;
    let result = [];
    for(let value of vector)
        length += value*value;
    length = Math.sqrt(length);
    for(let value of vector)
        result.push(value / length);
    return result;
};
Vector.negate = function (vector) {
    let result = [];
    for(let value of  vector)
        result.push(-value);
    return result;
};
Vector.dotProd = function (vec1, vec2) {
    throw "not implemented";
};
Vector.crossProd = function (vec1, vec2) {
    throw "not implemented";
};
Vector.invertValues = function (vector) {
    let result = [];
    for(let value of vector)
        result.push(1/value);
    return result;
};
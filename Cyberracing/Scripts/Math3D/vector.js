/**
 * Created by tom on 2017-01-12.
 */

var Vector = {};
var vec = Vector,
    v = Vector;
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
    if(typeof vec2 == "number")
    {
        let result = [];
        for(let i = 0; i < vec1.length; i++)
            result.push(vec1[i] + vec2);
        return result;
    }
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
    if(vec1.length != vec2.length)
        throw "Vectors must be of same dimensions.";
    let sum = 0;
    for(let i = 0; i < vec1.length; i++)
    {
        sum += vec1[i] * vec2[i];
    }
    return sum;
};
Vector.crossProd3 = function (vec1, vec2) {
    if(vec1.length != 3 || vec2.length != 3)
        throw "Vectors must be 3D";

    let f = [0,0,1];
    let u = [0,1,0];
    let r = [1,0,0];

    let u1 = vec1[0],
        u2 = vec1[1],
        u3 = vec1[2],
        v1 = vec2[0],
        v2 = vec2[1],
        v3 = vec2[2];

    let x = vec.mult(r, u2*v3 - u3*v2);
    let y = vec.mult(u, u3*v1 - u1*v3);
    let z = vec.mult(f, u1*v2 - u2*v1);
    return [x,y,z];
};
Vector.invertValues = function (vector) {
    let result = [];
    for(let value of vector)
        result.push(1/value);
    return result;
};
Vector.sub = function (vec1, vec2) {
    return Vector.add(vec1, Vector.negate(vec2));
};

Vector.zero = function (dim) {
    let result = [];
    for(let i = 0; i < dim; i++)
        result.push(0);
    return result;
};
Vector.one = function (dim) {
    let result = [];
    for(let i = 0; i < dim; i++)
        result.push(1);
    return result;
};
Vector.singleValue = function (dim, value) {
    let result = [];
    for(let i = 0; i < dim; i++)
        result.push(value);
    return result;
};

/**
 * Created by tom on 2017-01-12.
 */


var Matrix = (function (ns) {
    let sin = Math.sin;
    let cos = Math.cos;

    // ns.multiplyMbyV = function (matrix, vector) {
    //
    //     //Give a simple variable name to each part of the matrix, a column and row number
    //     let c0r0 = matrix[0], c1r0 = matrix[1], c2r0 = matrix[2], c3r0 = matrix[3];
    //     let c0r1 = matrix[4], c1r1 = matrix[5], c2r1 = matrix[6], c3r1 = matrix[7];
    //     let c0r2 = matrix[8], c1r2 = matrix[9], c2r2 = matrix[10], c3r2 = matrix[11];
    //     let c0r3 = matrix[12], c1r3 = matrix[13], c2r3 = matrix[14], c3r3 = matrix[15];
    //
    //     //Now set some simple names for the point
    //     let x = vector[0];
    //     let y = vector[1];
    //     let z = vector[2];
    //     let w = vector[3];
    //
    //     //Multiply the point against each part of the 1st column, then add together
    //     let resultX = (x * c0r0) + (y * c1r0) + (z * c2r0) + (w * c3r0);
    //
    //     //Multiply the point against each part of the 2nd column, then add together
    //     let resultY = (x * c0r1) + (y * c1r1) + (z * c2r1) + (w * c3r1);
    //
    //     //Multiply the point against each part of the 3rd column, then add together
    //     let resultZ = (x * c0r2) + (y * c1r2) + (z * c2r2) + (w * c3r2);
    //
    //     //Multiply the point against each part of the 4th column, then add together
    //     let resultW = (x * c0r3) + (y * c1r3) + (z * c2r3) + (w * c3r3);
    //
    //     return [resultX, resultY, resultZ, resultW];
    // };

    ns.multiplyMbyV = function (matrix, vector) {

        //Give a simple variable name to each part of the matrix, a column and row number
        let c0r0 = matrix[0], c1r0 = matrix[4], c2r0 = matrix[8], c3r0 = matrix[12];
        let c0r1 = matrix[1], c1r1 = matrix[5], c2r1 = matrix[9], c3r1 = matrix[13];
        let c0r2 = matrix[2], c1r2 = matrix[6], c2r2 = matrix[10], c3r2 = matrix[14];
        let c0r3 = matrix[3], c1r3 = matrix[7], c2r3 = matrix[11], c3r3 = matrix[15];

        //Now set some simple names for the point
        let x = vector[0];
        let y = vector[1];
        let z = vector[2];
        let w = vector[3];

        //Multiply the point against each part of the 1st column, then add together
        let resultX = (x * c0r0) + (y * c1r0) + (z * c2r0) + (w * c3r0);

        //Multiply the point against each part of the 2nd column, then add together
        let resultY = (x * c0r1) + (y * c1r1) + (z * c2r1) + (w * c3r1);

        //Multiply the point against each part of the 3rd column, then add together
        let resultZ = (x * c0r2) + (y * c1r2) + (z * c2r2) + (w * c3r2);

        //Multiply the point against each part of the 4th column, then add together
        let resultW = (x * c0r3) + (y * c1r3) + (z * c2r3) + (w * c3r3);

        return [resultX, resultY, resultZ, resultW];
    };

    ns.multiplyVbyM = function (vector, matrix) {

        //Give a simple variable name to each part of the matrix, a column and row number
        let c0r0 = matrix[0], c1r0 = matrix[1], c2r0 = matrix[2], c3r0 = matrix[3];
        let c0r1 = matrix[4], c1r1 = matrix[5], c2r1 = matrix[6], c3r1 = matrix[7];
        let c0r2 = matrix[8], c1r2 = matrix[9], c2r2 = matrix[10], c3r2 = matrix[11];
        let c0r3 = matrix[12], c1r3 = matrix[13], c2r3 = matrix[14], c3r3 = matrix[15];

        //Now set some simple names for the point
        let x = vector[0];
        let y = vector[1];
        let z = vector[2];
        let w = vector[3];

        //Multiply the point against each part of the 1st column, then add together
        let resultX = (x * c0r0) + (y * c0r1) + (z * c0r2) + (w * c0r3);

        //Multiply the point against each part of the 2nd column, then add together
        let resultY = (x * c1r0) + (y * c1r1) + (z * c1r2) + (w * c1r3);

        //Multiply the point against each part of the 3rd column, then add together
        let resultZ = (x * c2r0) + (y * c2r1) + (z * c2r2) + (w * c2r3);

        //Multiply the point against each part of the 4th column, then add together
        let resultW = (x * c3r0) + (y * c3r1) + (z * c3r2) + (w * c3r3);

        return [resultX, resultY, resultZ, resultW];
    };

    ns.multiplyMbyM = function (matL, matR) {

        // Slice the second matrix up into columns
        let column0 = [matR[0], matR[1], matR[2], matR[3]];
        let column1 = [matR[4], matR[5], matR[6], matR[7]];
        let column2 = [matR[8], matR[9], matR[10], matR[11]];
        let column3 = [matR[12], matR[13], matR[14], matR[15]];

        // Multiply each column by the matrix
        let result0 = ns.multiplyMbyV( matL, column0 );
        let result1 = ns.multiplyMbyV( matL, column1 );
        let result2 = ns.multiplyMbyV( matL, column2 );
        let result3 = ns.multiplyMbyV( matL, column3 );

        // let result0 = ns.multiplyVbyM( column0, matL );
        // let result1 = ns.multiplyVbyM( column1, matL );
        // let result2 = ns.multiplyVbyM( column2, matL );
        // let result3 = ns.multiplyVbyM( column3, matL );

        // Turn the result columns back into a single matrix
        return result0.concat(result1, result2, result3);
    };

    ns.multiplyMatrixArray = function (array) {

        let result = array.pop();
        while(array.length > 0)
            result = ns.multiplyMbyM(array.pop(), result);
        return result;
    };

    ns.identityMatrix = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];

    ns.transpose = function (matrix) {
        let m = matrix;
        return [
            m[0], m[4], m[8], m[12],
            m[1], m[5], m[9], m[13],
            m[2], m[6], m[10], m[14],
            m[3], m[7], m[11], m[15]
        ];
    };

    ns.translationMatrix = function (xyz) {
        return [
            1,      0,      0,      xyz[0],
            0,      1,      0,      xyz[1],
            0,      0,      1,      xyz[2],
            0,      0,      0,           1
        ];
    };

    ns.inverseTranslationMatrix = function (xyz) {
        return [
            1,      0,      0,      -xyz[0],
            0,      1,      0,      -xyz[1],
            0,      0,      1,      -xyz[2],
            0,      0,      0,           1
        ];
    };

    ns.scaleMatrix = function (xyz) {
        return [
            xyz[0], 0,      0,      0,
            0,      xyz[1], 0,      0,
            0,      0,      xyz[2], 0,
            0,      0,      0,      1
        ];
    };

    ns.inverseScaleMatrix = function (xyz) {
        let x = 1 / xyz[0],
            y = 1 / xyz[1],
            z = 1 / xyz[2];

        return [
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1
        ];
    };

    ns.rotationMatrix = function (xyz) {
        let x = xyz[0],
            y = xyz[1],
            z = xyz[2];

        return ns.multiplyMatrixArray([
            ns.xRotationMatrix(x),
            ns.yRotationMatrix(y),
            ns.zRotationMatrix(z)
        ]);
    };

    ns.inverseRotationMatrix = function (xyz) {
        let x = xyz[0],
            y = xyz[1],
            z = xyz[2];

        return ns.multiplyMatrixArray([
            xRotationMatrix(-z),
            yRotationMatrix(-y),
            zRotationMatrix(-x)
        ]);
    };

    ns.xRotationMatrix = function (x) {
        let c = cos(x),
            s = sin(x);
        return [
            1,       0,        0,     0,
            0,       c,       -s,     0,
            0,       s,        c,     0,
            0,       0,        0,     1
        ];
    };

    ns.yRotationMatrix = function (y) {
        let c = cos(y),
            s = sin(y);
        return [
                  c,   0,   s,   0,
                  0,   1,   0,   0,
                 -s,   0,   c,   0,
                  0,   0,   0,   1
        ];
    };

    ns.zRotationMatrix = function (z) {
        let c = cos(z),
            s = sin(z);
        return [
            c, -s,    0,    0,
            s,  c,    0,    0,
                 0,       0,    1,    0,
                 0,       0,    0,    1
        ];
    };

    return ns;
})(Matrix || {});

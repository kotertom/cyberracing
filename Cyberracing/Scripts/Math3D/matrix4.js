/**
 * Created by tom on 2017-02-20.
 */


function Matrix4(array) {
    if(!array)
        array = Matrix4.identity.elements;
    Matrix.call(this, 4, array.slice(0,16));
}
Matrix4.inheritsFrom(Matrix);

Matrix4.prototype.defineProperties({

    det: {
        get: function () {
            let m = this.elements;
            let a11 = m[0],
                a12 = m[4],
                a13 = m[8],
                a14 = m[12],

                a21 = m[1],
                a22 = m[5],
                a23 = m[9],
                a24 = m[13],

                a31 = m[2],
                a32 = m[6],
                a33 = m[10],
                a34 = m[14],

                a41 = m[3],
                a42 = m[7],
                a43 = m[11],
                a44 = m[15];

            return a11 * (a22 * (a33 * a44 - a34 * a43) + a23 * (a34 * a42 - a32 * a44) + a24 * (a32 * a43 - a33 * a42)) +
                a12 * (a21 * (a34 * a43 - a33 * a44) + a23 * (a31 * a44 - a34 * a41) + a24 * (a33 * a41 - a31 * a43)) +
                a13 * (a21 * (a32 * a44 - a34 * a42) + a22 * (a34 * a41 - a31 * a44) + a24 * (a31 * a42 - a32 * a41)) +
                a14 * (a21 * (a33 * a42 - a32 * a43) + a22 * (a31 * a43 - a33 * a41) + a23 * (a32 * a41 - a31 * a42));
        }
    },

    inverted: {
        get: function () {
            return new Matrix4(this.elements).invert();
        }
    },

    inv: {
        get: function () {
            return this.inverted;
        }
    },

    invert: {
        value: function () {
            this.elements = Matrix4.inverse(this.elements);
            return this;
        }
    }
});

Matrix4.defineProperties({

    identity: {
        get: function () {
            return new Matrix4([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]);
        }
    }
});


Matrix4 = (function (ns) {
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
        let a11 = matrix[0], a12 = matrix[4], a13 = matrix[8], a14 = matrix[12];
        let a21 = matrix[1], a22 = matrix[5], a23 = matrix[9], a24 = matrix[13];
        let a31 = matrix[2], a32 = matrix[6], a33 = matrix[10], a34 = matrix[14];
        let a41 = matrix[3], a42 = matrix[7], a43 = matrix[11], a44 = matrix[15];

        //Now set some simple names for the point
        let x = vector[0];
        let y = vector[1];
        let z = vector[2];
        let w = vector[3];

        //Multiply the point against each part of the 1st column, then add together
        let resultX = (x * a11) + (y * a12) + (z * a13) + (w * a14);

        //Multiply the point against each part of the 2nd column, then add together
        let resultY = (x * a21) + (y * a22) + (z * a23) + (w * a24);

        //Multiply the point against each part of the 3rd column, then add together
        let resultZ = (x * a31) + (y * a32) + (z * a33) + (w * a34);

        //Multiply the point against each part of the 4th column, then add together
        let resultW = (x * a41) + (y * a42) + (z * a43) + (w * a44);

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
            m[0], m[1], m[2], m[3],
            m[4], m[5], m[6], m[7],
            m[8], m[9], m[10], m[11],
            m[12], m[13], m[14], m[15]
        ];
    };

    ns.inverse = function (matrix) {
        let m = matrix;
        // let det = m[0]*m[5]*m[10]*m[15] +
        //           m[0]*m[9]*m[14]*m[7] +
        //           m[0]*m[14]*m[6]*m[11] +
        //
        //           m[4]*m[1]*m[14]*m[11] +
        //           m[4]*m[9]*m[2]*m[15] +
        //           m[4]*m[13]*m[10]*m[3] +
        //
        //           m[8]*m[1]*m[6]*m[15] +
        //           m[8]*m[5]*m[14]*m[3] +
        //           m[8]*m[13]*m[2]*m[7] +
        //
        //           m[12]*m[1]*m[10]*m[7] +
        //           m[12]*m[5]*m[2]*m[11] +
        //           m[12]*m[9]*m[6]*m[3] -
        //
        //           m[0]*m[5]*m[14]*m[11] -
        //           m[0]*m[9]*m[6]*m[15] -
        //           m[0]*m[13]*m[10]*m[7] -
        //
        //           m[4]*m[1]*m[10]*m[15] -
        //           m[4]*m[9]*m[14]*m[3] -
        //           m[4]*m[13]*m[2]*m[11] -
        //
        //           m[8]*m[1]*m[14]*m[7] -
        //           m[8]*m[5]*m[2]*m[15] -
        //           m[8]*m[13]*m[6]*m[3] -
        //
        //           m[12]*m[1]*m[6]*m[11] -
        //           m[12]*m[5]*m[10]*m[3] -
        //           m[12]*m[9]*m[2]*m[7];

        let a11 = m[0],
            a12 = m[4],
            a13 = m[8],
            a14 = m[12],

            a21 = m[1],
            a22 = m[5],
            a23 = m[9],
            a24 = m[13],

            a31 = m[2],
            a32 = m[6],
            a33 = m[10],
            a34 = m[14],

            a41 = m[3],
            a42 = m[7],
            a43 = m[11],
            a44 = m[15];

        let det = a11*(a22*(a33*a44 - a34*a43) + a23*(a34*a42 - a32*a44) + a24*(a32*a43 - a33*a42)) +
            a12*(a21*(a34*a43 - a33*a44) + a23*(a31*a44 - a34*a41) + a24*(a33*a41 - a31*a43)) +
            a13*(a21*(a32*a44 - a34*a42) + a22*(a34*a41 - a31*a44) + a24*(a31*a42 - a32*a41)) +
            a14*(a21*(a33*a42 - a32*a43) + a22*(a31*a43 - a33*a41) + a23*(a32*a41 - a31*a42));

        if(det == 0)
            throw "cannot inverse matrix: det == 0";

        // row 1
        let b11 = a22*a33*a44 + a23*a34*a42 + a24*a32*a43 - a22*a34*a43 - a23*a32*a44 - a24*a33*a42;
        let b12 = a12*a34*a43 + a13*a32*a44 + a14*a33*a42 - a12*a33*a44 - a13*a34*a42 - a14*a32*a43;
        let b13 = a12*a23*a44 + a13*a24*a42 + a14*a22*a43 - a12*a24*a43 - a13*a22*a44 - a14*a23*a42;
        let b14 = a12*a24*a33 + a13*a22*a34 + a14*a23*a32 - a12*a23*a34 - a13*a24*a32 - a14*a22*a33;

        // row 2
        let b21 = a21*a34*a43 + a23*a31*a44 + a24*a33*a41 - a21*a33*a44 - a23*a34*a41 - a24*a31*a43;
        let b22 = a11*a33*a44 + a13*a34*a41 + a14*a31*a43 - a11*a34*a43 - a13*a31*a44 - a14*a33*a41;
        let b23 = a11*a24*a43 + a13*a23*a44 + a14*a23*a41 - a11*a23*a44 - a13*a24*a41 - a14*a21*a43;
        let b24 = a11*a23*a34 + a13*a24*a31 + a14*a21*a33 - a11*a24*a33 - a13*a21*a34 - a14*a23*a31;

        // row 3
        let b31 = a21*a32*a44 + a22*a34*a41 + a24*a31*a42 - a21*a34*a42 - a22*a31*a44 - a24*a32*a41;
        let b32 = a11*a34*a42 + a12*a31*a44 + a14*a32*a41 - a11*a32*a44 - a12*a34*a41 - a14*a31*a42;
        let b33 = a11*a22*a44 + a12*a24*a41 + a14*a21*a42 - a11*a24*a42 - a12*a21*a44 - a14*a22*a41;
        let b34 = a11*a24*a32 + a12*a21*a34 + a14*a22*a31 - a11*a22*a34 - a12*a24*a31 - a14*a21*a32;

        // row 4
        let b41 = a21*a33*a42 + a22*a31*a43 + a23*a32*a41 - a21*a32*a43 - a22*a33*a41 - a23*a31*a42;
        let b42 = a11*a32*a43 + a12*a33*a41 + a13*a31*a42 - a11*a33*a42 - a12*a31*a43 - a13*a32*a41;
        let b43 = a11*a23*a42 + a12*a21*a43 + a13*a22*a41 - a11*a22*a43 - a12*a23*a41 - a13*a21*a42;
        let b44 = a11*a22*a33 + a12*a23*a31 + a13*a21*a32 - a11*a23*a32 - a12*a21*a33 - a13*a22*a31;

        let di = 1/det;

        return [
            di*b11, di*b21, di*b31, di*b41,
            di*b12, di*b22, di*b32, di*b42,
            di*b13, di*b23, di*b33, di*b43,
            di*b14, di*b24, di*b34, di*b44
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
            c,   0,  -s,   0,
            0,   1,   0,   0,
            s,   0,   c,   0,
            0,   0,   0,   1
        ];
    };

    ns.zRotationMatrix = function (z) {
        let c = cos(z),
            s = sin(z);
        return [
            c, s,    0,    0,
            -s,  c,    0,    0,
            0,       0,    1,    0,
            0,       0,    0,    1
        ];
    };

    ns.xRotationMatrix3 = function (x) {
        let m = ns.xRotationMatrix(x);
        return [
            m[0], m[1], m[2],
            m[4], m[5], m[6],
            m[8], m[9], m[10]
        ];
    };

    ns.yRotationMatrix3 = function (y) {
        let m = ns.yRotationMatrix(y);
        return [
            m[0], m[1], m[2],
            m[4], m[5], m[6],
            m[8], m[9], m[10]
        ];
    };

    ns.zRotationMatrix3 = function (z) {
        let m = ns.zRotationMatrix(z);
        return [
            m[0], m[1], m[2],
            m[4], m[5], m[6],
            m[8], m[9], m[10]
        ];
    };

    return ns;
})(Matrix4 || {});

var mat = Matrix4,
    m = Matrix4;

var RotationOrder = {
    EulerXYZ: [0, 1, 2],
    EulerXZY: [0, 2, 1],
    EulerYXZ: [1, 0, 2],
    EulerYZX: [1, 2, 0],
    EulerZXY: [2, 0, 1],
    EulerZYX: [2, 1, 0]
};
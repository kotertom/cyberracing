/**
 * Created by tom on 2017-01-12.
 */

var Matrix = (function (Matrix) {
    var sin = Math.sin;
    var cos = Math.cos;

    Matrix.multiplyMatrixAndVector = function (matrix, vector) {

    }

    Matrix.multiplyMatrices = function (matL, matR) {

    };

    Matrix.multiplyMatrixArray = function (array) {
        let result = array.pop();
        while(array.length > 0)
            result = Matrix.multiplyMatrices(array.pop(), result);
        return result;
    };

    Matrix.identityMatrix = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];

    Matrix.translationMatrix = function (xyz) {
        return [
            1,      0,      0,      0,
            0,      1,      0,      0,
            0,      0,      1,      0,
            xyz[0], xyz[1], xyz[2], 1
        ];
    };

    Matrix.scaleMatrix = function (xyz) {
        return [
            xyz[0], 0,      0,      0,
            0,      xyz[1], 0,      0,
            0,      0,      xyz[2], 0,
            0,      0,      0,      1
        ];
    };

    Matrix.rotationMatrix = function (xyz) {
        let x = xyz[0],
            y = xyz[1],
            z = xyz[2];

        return Matrix.multiplyMatrixArray([
            xRotationMatrix(x),
            yRotationMatrix(y),
            zRotationMatrix(z)
        ]);
    };

    Matrix.xRotationMatrix = function (x) {
        return [
            1,       0,        0,     0,
            0,  cos(x),  -sin(x),     0,
            0,  sin(x),   cos(x),     0,
            0,       0,        0,     1
        ];
    };

    Matrix.yRotationMatrix = function (y) {
        return [
             cos(y),   0, sin(y),   0,
                  0,   1,      0,   0,
            -sin(y),   0, cos(y),   0,
                  0,   0,      0,   1
        ];
    };

    Matrix.zRotationMatrix = function (z) {
        return [
            cos(z), -sin(z),    0,    0,
            sin(z),  cos(z),    0,    0,
                 0,       0,    1,    0,
                 0,       0,    0,    1
        ];
    };

})(Matrix || {});


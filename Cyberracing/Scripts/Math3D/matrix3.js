/**
 * Created by tom on 2017-02-20.
 */


function Matrix3(array) {
    if(!array)
        array = Matrix3.identity.elements;
    Matrix.call(this, 3, array.slice(0,9));
}
Matrix3.inheritsFrom(Matrix);

Matrix3.prototype.defineProperties({

    scale: {
        value: function (xyz) {
            this.set(Matrix3.scale(xyz).mult(this));
        }
    },

    rotateX: {
        value: function (a) {
            this.set(Matrix3.rotationX(a).mult(this));
        }
    },

    rotateY: {
        value: function (a) {
            this.set(Matrix3.rotationY(a).mult(this));
        }
    },

    rotateZ: {
        value: function (a) {
            this.set(Matrix3.rotationZ(a).mult(this));
        }
    },

    rotate: {
        value: function (xyz, order) {
            this.set(Matrix3.rotation(xyz, order).mult(this));
        }
    }
});

Matrix3.defineProperties({

    identity: {
        get: function () {
            return new Matrix3([
                1,0,0,
                0,1,0,
                0,0,1]);
        }
    },

    scale: {
        value: function (xyz) {
            let x = xyz.x || xyz[0];
            let y = xyz.y || xyz[1];
            let z = xyz.z || xyz[2];

            return new Matrix3([
                x, 0, 0,
                0, y, 0,
                0, 0, z
            ]);
        }
    },

    rotationX: {
        value: function (a) {
            let c = Math.cos(a);
            let s = Math.sin(a);

            return new Matrix3([
                1,       0,        0,
                0,       c,       -s,
                0,       s,        c
            ]);
        }
    },

    rotationY: {
        value: function (a) {
            let c = Math.cos(a);
            let s = Math.sin(a);

            return new Matrix3([
                c,   0,  -s,
                0,   1,   0,
                s,   0,   c
            ]);
        }
    },

    rotationZ: {
        value: function (a) {
            let c = Math.cos(a);
            let s = Math.sin(a);

            return new Matrix3([
                 c,  s,  0,
                -s,  c,  0,
                 0,  0,  1
            ]);
        }
    },

    rotation: {
        value: function (xyz, order) {
            order = order || RotationOrder.EulerXYZ;

            let matrices = [
                Matrix3.rotationX(xyz.x),
                Matrix3.rotationY(xyz.y),
                Matrix3.rotationZ(xyz.z)
            ];
            return matrices[order[0]].mult(matrices[order[1]]).mult(matrices[order[2]]);
        }
    },

    inverted: {
        get: function () {
            return new Matrix3(this.elements).invert();
        }
    },

    inv: {
        get: function () {
            return this.inverted;
        }
    },

    invert: {
        value: function () {
            let a11 = this.elements[0],
                a21 = this.elements[1],
                a31 = this.elements[2],

                a12 = this.elements[3],
                a22 = this.elements[4],
                a32 = this.elements[5],

                a13 = this.elements[6],
                a23 = this.elements[7],
                a33 = this.elements[8];

            let det = a11*a22*a33 + a21*a32*a13 + a31*a12*a23 -
                      a11*a32*a23 - a31*a22*a13 - a21*a12*a33;

            if(det == 0)
                throw "Can't invert matrix: det == 0";

            let b11 = a22*a33 - a23*a32,
                b21 = a23*a31 - a21*a33,
                b31 = a21*a32 - a22*a31,

                b12 = a13*a32 - a12*a33,
                b22 = a11*a33 - a13*a31,
                b32 = a12*a31 - a11*a32,

                b13 = a12*a23 - a13*a22,
                b23 = a13*a21 - a11*a23,
                b33 = a11*a22 - a12*a21;

            this.elements = [b11, b21, b31,
                             b12, b22, b32,
                             b13, b23, b33];
        }
    }
});
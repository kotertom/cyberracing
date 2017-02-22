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
            let matrices = [
                Matrix3.RotationX(xyz.x || xyz[0]),
                Matrix3.rotationY(xyz.y || xyz[1]),
                Matrix3.rotationZ(xyz.z || xyz[2])
            ];
            return matrices[order[0]].mult(matrices[order[1]]).mult(matrices[order[2]]);
        }
    },
});
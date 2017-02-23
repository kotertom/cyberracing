/**
 * Created by tom on 2017-02-19.
 */


function Vector3(xyzArray) {
    xyzArray = xyzArray || Vector.zero(3);
    Vector.call(this, xyzArray.slice(0,3));
}
Vector3.inheritsFrom(Vector);

Vector3.prototype.defineProperties({

    cross: {
        enumerable: false,
        value: function (vec) {
            return new Vector3(Vector.crossProd3(this.elements, vec.elements));
        }
    },

    scale: {
        value: function (xyz) {
            this.elements = Vector.scalarMult(this.elements, xyz);
        }
    },

    translate: {
        value: function (xyz) {
            this.elements = Vector.add(this.elements, xyz);
        }
    },

    rotate: {
        value: function (xyz) {
            let rotMatrix = Matrix3.rotation(xyz);
            this.elements = rotMatrix.times(this).toArray();
        }
    },

    scaled: {
        value: function (xyz) {
            return this.scalarMult(xyz);
        }
    },

    translated: {
        value: function (xyz) {
            return this.add(xyz);
        }
    },

    rotated: {
        value: function (xyz) {
            return Matrix3.rotation(xyz).times(this);
        }
    }
});

Vector3.defineProperties({

    right: {
        value: [1,0,0].vec3
    },

    up: {
        value: [0,1,0].vec3
    },

    forward: {
        value: [0,0,1].vec3
    },

    left: {
        value: [-1,0,0].vec3
    },

    down: {
        value: [0,-1,0].vec3
    },

    backward: {
        value: [0,0,-1].vec3
    },

    zero: {
        value: [0,0,0].vec3
    },

    ones: {
        value: [1,1,1].vec3
    }
});
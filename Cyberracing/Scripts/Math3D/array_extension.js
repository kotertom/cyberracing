/**
 * Created by tom on 2017-02-19.
 */

Object.defineProperties(Array.prototype, {
    vec: {
        enumerable: false,
        get: function () {
            return new Vector(this);
        }
    },

    vec3: {
        enumerable: false,
        get: function () {
            return new Vector3(this);
        }
    },

    quat: {
        enumerable: false,
        get: function () {
            return new Quaternion(this);
        }
    },

    mat: {
        enumerable: false,
        value: function (dim) {
            return new Matrix(dim, this);
        }
    },

    mat3: {
        enumerable: false,
        get: function () {
            return new Matrix3(this);
        }
    },

    mat4: {
        enumerable: false,
        get: function () {
            return new Matrix4(this);
        }
    }
});
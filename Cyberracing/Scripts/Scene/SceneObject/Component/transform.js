/**
 * Created by tom on 2016-12-20.
 */

function Transform(position, rotation, scale) {
    Component.call(this);

    this.position = position || Vector.zero(3);
    this.rotation = rotation || Vector.zero(3);
    this.scale = scale || Vector.one(3);
    this.rotationModel = RotationOrder.EulerXYZ;

    this._forward = [0,0,1];
    this._up = [0,1,0];
    this._right = [1,0,0];

    this.matrix = Vector.zero(16);
}
Transform.inheritsFrom(Component);

Object.defineProperties(Transform.prototype, {

    position: {
        get: function () {
            return this._position;
        },
        set: function (value) {
            this._position = value;
        }
    },

    rotation: {
        get: function () {
            return this._rotation;
        },
        set: function (value) {
            this._rotation = value;
            let mx = mat.xRotationMatrix(value[0]);
            let my = mat.yRotationMatrix(value[1]);
            let mz = mat.zRotationMatrix(value[2]);
            let rm = mat.multiplyMatrixArray([mz, my, mx]);

            this._forward = mat.multiplyMbyV(rm, [0,0,1,1]).slice(0,3);
            this._right = mat.multiplyMbyV(rm, [1,0,0,1]).slice(0,3);
            this._up = mat.multiplyMbyV(rm, [0,1,0,1]).slice(0,3);
        }
    },

    scale: {
        get: function () {
            return this._scale;
        },
        set: function (value) {
            this._scale = value;
        }
    },

    worldPosition: {
        get: function () {
            return this._worldPosition;
        },
        set: function (value) {
            this._worldPosition = value;
        }
    },

    worldRotation: {
        get: function () {

        },
        set: function (value) {

        }
    },

    worldScale: {
        get: function () {

        },
        set: function (value) {

        }
    },

    forward: {
        get: function () {
            return this._forward.slice();
        }
    },

    backward: {
        get: function () {
            return v.negate(this.forward);
        }
    },

    right: {
        get: function () {
            return this._right.slice();
        }
    },

    left: {
        get: function () {
            return v.negate(this.right);
        }
    },

    up: {
        get: function () {
            return this._up.slice();
        }
    },

    down: {
        get: function () {
            return v.negate(this.up);
        }
    },

    rotate: {
        value: function (xyz) {
            this.rotation = this.rotation.vec3.add(xyz).toArray();
        }
    },

    translate: {
        value: function (xyz) {
            this.position = this.position.vec3.add(xyz).toArray();
        }
    },

    applyScale: {
        value: function (xyz) {
            this.scale = this.scale.vec3.scalarMult(xyz).toArray();
        }
    }
});

// Transform.prototype.getTransformMatrix = function () {
//     let parent = this.getOwner().parent;
//     let parentMatrix = parent ? parent.getComponent('transform').getTransformMatrix() : matrix.identityMatrix;
//     let tm = mat4.create();
//     let q = quat.create();
//     quat.rotateX(q, q, this.rotation[0]);
//     quat.rotateY(q, q, this.rotation[1]);
//     quat.rotateZ(q, q, this.rotation[2]);
//     mat4.fromRotationTranslationScale(tm, q, this.position, this.scale);
//     return matrix.multiplyMbyM(parentMatrix, tm);
// };

Transform.prototype.getTransformMatrix = function () {
    let parent = this.owner.parent;
    let parentMatrix = parent ? parent.getComponent('transform').getTransformMatrix() : Matrix4.identityMatrix;

    let p = this.position;

    let r = this.right;
    let u = this.up;
    let f = this.forward;

    let sm = Matrix4.scaleMatrix(this.scale);
    let tm = [
        r[0], r[1], r[2], 0,
        u[0], u[1], u[2], 0,
        f[0], f[1], f[2], 0,
        p[0], p[1], p[2], 1
    ];

    return Matrix4.multiplyMatrixArray([parentMatrix, tm, sm]);

};

Transform.prototype.getInverseTransformMatrix = function () {
    // return this.getTransformMatrix().mat4.inverted.toArray();
    let parent = this.getOwner().parent;
    let parentMatrix = parent ? parent.getComponent('transform').getInverseTransformMatrix() : Matrix4.identityMatrix;
    return Matrix4.multiplyMatrixArray([
        Matrix4.scaleMatrix      (Vector.invertValues(this.scale)),
        Matrix4.xRotationMatrix   (-this.rotation[0]),
        Matrix4.yRotationMatrix   (-this.rotation[1]),
        Matrix4.zRotationMatrix   (-this.rotation[2]),
        Matrix4.translationMatrix(Vector.negate(this.position)),
        parentMatrix
    ]);
};

Transform.prototype.lookAt = function (targetPos, upVector) {
    upVector = upVector || [0,1,0];

    let pos = this.position;

    let zAxis = Vector.sub(targetPos, pos);
    let xAxis = Vector.crossProd3(zAxis, upVector);
    let yAxis = Vector.crossProd3(zAxis, vec.negate(xAxis));

    this._forward = zAxis;
    this._right = xAxis;
    this._up = yAxis;
};
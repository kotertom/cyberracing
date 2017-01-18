/**
 * Created by tom on 2016-12-20.
 */

function Transform(owner, position, rotation, scale) {
    Composite.call(this, owner);
    if(position == null)
        position = Vector.zero(3);
    if(rotation == null)
        rotation = Vector.zero(3);
    if(scale == null)
        scale = Vector.one(3);

    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
}
Transform.inheritsFrom(Composite);

Transform.prototype.getTransformMatrix = function () {
    let tm = mat4.create();
    let q = quat.create();
    quat.rotateX(q, q, this.rotation[0]);
    quat.rotateY(q, q, this.rotation[1]);
    quat.rotateZ(q, q, this.rotation[2]);
    mat4.fromRotationTranslationScale(tm, q, this.position, this.scale);
    return tm;
};

Transform.prototype.getInverseTransformMatrix = function () {
    return Matrix.multiplyMatrixArray([
        Matrix.scaleMatrix      (Vector.invertValues(this.scale)),
        Matrix.zRotationMatrix   (-this.rotation[2]),
        Matrix.yRotationMatrix   (-this.rotation[1]),
        Matrix.xRotationMatrix   (-this.rotation[0]),
        Matrix.translationMatrix(Vector.negate(this.position))
    ]);
};
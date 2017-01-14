/**
 * Created by tom on 2016-12-20.
 */

function Transform(owner, position, rotation, scale) {
    Composite.call(this, "transform", owner);
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
Transform.prototype = Object.create(Composite.prototype);
Transform.prototype.constructor = Transform.constructor;
Transform.prototype.getName = function () {
    return "transform";
};
Transform.prototype.getTransformMatrix = function () {
    return Matrix.multiplyMatrixArray([
        Matrix.translationMatrix(this.position),
        Matrix.rotationMatrix   (this.rotation),
        Matrix.scaleMatrix      (this.scale)
    ]);
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
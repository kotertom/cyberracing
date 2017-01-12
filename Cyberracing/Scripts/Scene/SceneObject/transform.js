/**
 * Created by tom on 2016-12-20.
 */

function Transform(position, rotation, scale) {
    if(position == null)
        position = new Vector([0,0,0]);
    if(rotation == null)
        rotation = new Vector([0,0,0]);

    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
}
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
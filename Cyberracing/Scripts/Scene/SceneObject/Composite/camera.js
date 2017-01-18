/**
 * Created by tom on 2017-01-12.
 */

function Camera(owner, fov, aspectRatio, near, far) {
    Composite.call(this, owner);
    this.fov = fov || 75;
    this.aspectRatio = aspectRatio || window.innerWidth / window.innerHeight;
    this.near = near || 0.1;
    this.far = far || 1000;
}
Camera.inheritsFrom(Composite);
Camera.prototype.getPerspectiveMatrix = function () {
    // var f = 1.0 / Math.tan(fov / 360 * 2 * Math.PI / 2);
    let f = 1.0 / Math.tan(this.fov * Math.PI / 360);
    let ar = this.aspectRatio;
    let rangeInv = 1 / (this.near - this.far);

    return [
        f / ar, 0,                          0,   0,
        0,               f ,                          0,   0,
        0,               0,    (this.near + this.far) * rangeInv,  -1,
        0,               0,  this.near * this.far * rangeInv * 2,   0
    ];
};
Camera.prototype.lookAt = function (target, upVector) {
    let cameraPos = this.position;
    let zAxis = Vector.sub(cameraPos, target);
    let xAxis = Vector.crossProd(upVector, zAxis);
    let yAxis = upVector;
};
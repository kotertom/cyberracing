/**
 * Created by tom on 2017-01-12.
 */

function Camera(fov, aspectRatio, near, far) {
    this.fov = fov || 75;
    this.aspectRatio = aspectRatio || window.innerWidth / window.innerHeight;
    this.near = near || 1;
    this.far = far || 50;
}
Camera.prototype.getName = function () {
    return "camera";
};
Camera.prototype.getPerspectiveMatrix = function () {
    // var f = 1.0 / Math.tan(fov / 360 * 2 * Math.PI / 2);
    let f = 1.0 / Math.tan(this.fov * Math.PI / 360);
    let rangeInv = 1 / (this.near - this.far);

    return [
        f / this.aspectRatio, 0,                          0,   0,
        0,               f,                          0,   0,
        0,               0,    (this.near + this.far) * rangeInv,  -1,
        0,               0,  this.near * this.far * rangeInv * 2,   0
    ];
};
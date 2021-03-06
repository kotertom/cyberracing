/**
 * Created by tom on 2017-01-12.
 */

function Camera(fov, aspectRatio, near, far) {
    Component.call(this);
    this.fov = fov || 75;
    this.aspectRatio = aspectRatio || window.innerWidth / window.innerHeight;
    this.near = near || 0.1;
    this.far = far || 1000;
}
Camera.inheritsFrom(Component);
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
Camera.prototype.getViewMatrix = function () {
    let viewMatrix = mat4.create();
    let transform = App.activeScene.getObjectByName('cube').getComponent('transform');
    let t = this.owner.getComponent('transform');

    mat4.lookAt(viewMatrix, t.position, vec.add(t.position, t.forward), [0,1,0]);
    // viewMatrix = t.getInverseTransformMatrix();
    return viewMatrix;
};
Camera.prototype.lookAt = function (targetPos, upVector) {
    upVector = upVector || [0,1,0];

    let transform = this.owner.getComponent('transform');

    let cameraPos = transform.position;

    let zAxis = Vector.sub(targetPos, cameraPos);
    let xAxis = Vector.crossProd3(zAxis, upVector);
    let yAxis = Vector.crossProd3(zAxis, vec.negate(xAxis));

    transform._forward = zAxis;
    transform._right = xAxis;
    transform._up = yAxis;
};
/**
 * Created by tom on 2017-01-26.
 */


var Quaternion = (function (ns) {

    ns.fromAxisRotation = function (radians, axis) {
        let t = 0.5 * radians;
        let s = Math.sin(t);
        let c = Math.cos(t);

        return [c, s*axis[0], s*axis[1], s*axis[2]];
    };

    ns.fromXYZRotation = function (rotation) {
        let xr = rotation[0],
            yr = rotation[1],
            zr = rotation[2];

        return [

        ];
    };

    ns.toMatrix = function (quaternion) {
        let w = quaternion[0],
            x = quaternion[1],
            y = quaternion[2],
            z = quaternion[3];

        let xx = x*x,
            yy = y*y,
            zz = z*z,
            ww = w*w,
            xy = x*y,
            xz = x*z,
            yz = y*z,
            zw = z*w,
            yw = y*w,
            xw = x*w;

        let a11 = ww + xx - yy - zz,
            a12 = 2*(xy - zw),
            a13 = 2*(xz + yw),

            a21 = 2*(xy + zw),
            a22 = ww - xx + yy - zz,
            a23 = 2*(yz - xw),

            a31 = 2*(xz - yw),
            a32 = 2*(yz + xw),
            a33 = ww - xx - yy + zz;

        return [
            a11, a21, a31,
            a12, a22, a32,
            a13, a23, a33
        ];
    };

    ns.invert = function (q) {
        return [q[0], -q[1], -q[2], -q[3]];
    };

    return ns;
})(Quaternion || {});
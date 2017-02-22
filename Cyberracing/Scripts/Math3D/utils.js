/**
 * Created by tom on 2017-02-20.
 */

function clamp(value, min, max) {
    return Math.max(Math.min(value, max), min);
}

function toRad(deg) {
    return deg / 180 * Math.PI;
}

function toDeg(rad) {
    return rad * 180 / Math.PI;
}

function linspace(a, b, points) {
    let h = (b - a) / (points - 1);
    let res = [a];
    for(let i = 0; i < points - 2; i++) {
        res.push(res[i] + h);
    }
    res.push(b);
    return res;
}
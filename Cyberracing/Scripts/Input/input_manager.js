/**
 * Created by tom on 2017-01-26.
 */

var input = input || {};

function initInput() {
    let e = gameCanvas;

    e.addEventListener('click')
}



var input = (function (ns) {
    ns.axes = {};

    ns.getAxis = function (name) {
        return ns.axes[name];
    };
})(input || {});